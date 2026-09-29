/**
 * AS LINHAS DE SÉRIE DO LIVRO-RAZÃO (bloco UE1, 29.09.2026).
 *
 * Carrega `ledger/series/*.yml`, confere cada série pelas regras de
 * `ledger/series/README.md` e serve-as às páginas. Uma linha de série é uma
 * linha do livro-razão com vários pontos dentro: o corte entre países
 * (`eixo: pais`, este bloco) e, no RP3, a série no tempo (`eixo: periodo`), na
 * mesma forma. É GERADA pelo motor e atravessa como as linhas cruzadas: o sítio
 * nunca a escreve à mão, e o `check:cruzamento` prende-lhe os bytes.
 *
 * AS REGRAS SÃO UMA FUNÇÃO PURA. `validateSeries()` recebe as séries, as linhas
 * do livro-razão e a tabela dos nomes, e devolve os erros; não lê o disco. É o
 * que deixa o `ledger:check` plantar cada estrago numa cópia em memória e
 * exigir que a regra dele morda, sem trocar o livro debaixo de si próprio.
 *
 * AS GÉMEAS COMPARAM-SE COMO NÚMEROS. A linha portuguesa da taxa de desemprego
 * publica «6», e o ponto de Portugal é «6,0», que é como a fonte o escreve:
 * são o mesmo número, e a regra pede isso e mais nada (`parsePtNumber`).
 */

import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

import { LEDGER_DIR, parsePtNumber, normalizaPtNumero } from './ledger.mjs';
import { STUDY_IDS } from '../data/studies.mjs';

/** A pasta das séries: ao lado de `ledger/claims`, ou a que `OEDP_SERIES_DIR` nomear. */
export const SERIES_DIR = process.env.OEDP_SERIES_DIR ?? path.join(path.dirname(LEDGER_DIR), 'series');

/** A tabela dos nomes dos países, que atravessa do motor com a sua proveniência. */
export const TABELA_DOS_PAISES = path.join(path.dirname(path.dirname(LEDGER_DIR)), 'src', 'data', 'paises-da-uniao.json');

/** O código do Eurostat para a União dos 27, que é a geografia da linha `-ue`. */
export const AGREGADO_DA_UNIAO = 'EU27_2020';

/** Os eixos que uma série pode ter. O RP3 acrescenta `periodo`. */
export const EIXOS = /** @type {const} */ (['pais']);

/** Os campos de uma série, e mais nenhum (regra S1). */
export const CAMPOS_DA_SERIE = /** @type {const} */ ([
  'id', 'eixo', 'name', 'name_source', 'unit', 'periodo', 'source', 'document', 'source_url',
  'access_date', 'published_at', 'excerpt', 'linha_da_uniao', 'linha_de_portugal', 'bandeiras',
  'pontos', 'attributed_to', 'study', 'note', 'corrections',
]);
/** Os campos obrigatórios: todos menos a nota. */
const OBRIGATORIOS = CAMPOS_DA_SERIE.filter((c) => c !== 'note');
/** Os campos de um ponto (regra S3). */
export const CAMPOS_DO_PONTO = /** @type {const} */ (['geo', 'valor', 'excerto', 'bandeira']);
/** Os campos do bloco `document` de uma série. */
export const CAMPOS_DO_DOCUMENTO_DA_SERIE = /** @type {const} */ (['title', 'edition', 'kind', 'url']);
/** Os campos de uma correção de um ponto (regra S9). */
export const CAMPOS_DA_CORRECAO_DA_SERIE = /** @type {const} */ ([
  'geo', 'date', 'kind', 'old_value', 'new_value', 'reason', 'reason_en',
]);

const DATA = /^\d{4}-\d{2}-\d{2}$/;
const PERIODO = /^\d{4}(-\d{2}|-T[1-4]|-S[12])?$/;
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** @param {unknown} x @returns {x is Record<string, unknown>} */
function eMapa(x) {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/**
 * Uma série, no mínimo que o carregador precisa: um mapa com um `id`.
 *
 * @param {unknown} x
 * @returns {x is Serie}
 */
export function eSerie(x) {
  return eMapa(x) && typeof x.id === 'string' && x.id.trim() !== '';
}

/**
 * Os pontos de uma série, quando são uma lista de mapas; `[]` quando não são.
 *
 * @param {Serie | null | undefined} serie
 * @returns {PontoDaSerie[]}
 */
export function pontosDaSerie(serie) {
  const lista = serie?.pontos;
  return Array.isArray(lista) ? lista.filter(ePonto) : [];
}

/**
 * Um ponto, no mínimo que quem o lê precisa: um mapa com a geografia.
 *
 * @param {unknown} x
 * @returns {x is PontoDaSerie}
 */
function ePonto(x) {
  return eMapa(x) && typeof x.geo === 'string';
}

/**
 * O ponto de uma geografia, ou `null`.
 *
 * @param {Serie} serie
 * @param {string} geo
 */
export function pontoDaSerie(serie, geo) {
  return pontosDaSerie(serie).find((p) => p.geo === geo) ?? null;
}

/**
 * O valor da casa na forma em que a API do Eurostat o escreve: «−2,3» → «-2.3»,
 * «6,0» → «6.0». Não arredonda nem tira zeros: é a mesma cadeia com o ponto
 * decimal e o hífen, e é contra ela que se lê o excerto (regra S4).
 *
 * @param {unknown} valor
 * @returns {string | null}
 */
export function valorNaFonte(valor) {
  if (typeof valor !== 'string') return null;
  const s = valor.replace(/−/g, '-').replace(/(?<=\d)[    ](?=\d)/g, '').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(s) ? s : null;
}

/* ------------------------------------------------------------------ o carregador */

/**
 * Lê as séries de uma pasta. Os erros de ficheiro (YAML partido, um nome que
 * não é o id, um id repetido) voltam na lista, e não atiram: é o que deixa a
 * planta do `ledger:check` provar que o carregador os vê.
 *
 * @param {string} [dir]
 * @returns {{ series: Map<string, Serie>, erros: string[], ficheiros: number }}
 */
export function lerSeries(dir = SERIES_DIR) {
  /** @type {Map<string, Serie>} */
  const series = new Map();
  /** @type {string[]} */
  const erros = [];
  /** @type {string[]} */
  let nomes = [];
  try {
    nomes = fs.readdirSync(dir).filter((f) => f.endsWith('.yml')).sort();
  } catch {
    return { series, erros, ficheiros: 0 };
  }
  for (const nome of nomes) {
    /** @type {unknown} */
    let bruto;
    try {
      bruto = load(fs.readFileSync(path.join(dir, nome), 'utf8'));
    } catch (e) {
      erros.push(`[${nome}] YAML inválido: ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }
    if (!eSerie(bruto)) {
      erros.push(`[${nome}] não é um mapa com um id.`);
      continue;
    }
    if (`${bruto.id}.yml` !== nome) {
      erros.push(`[${nome}] S1: o id é «${bruto.id}», e o nome do ficheiro tem de ser o id.`);
      continue;
    }
    if (series.has(bruto.id)) {
      erros.push(`[${nome}] S1: o id «${bruto.id}» repete-se.`);
      continue;
    }
    bruto.__file = nome;
    series.set(bruto.id, bruto);
  }
  return { series, erros, ficheiros: nomes.length };
}

/** @type {Map<string, Serie> | null} */
let _cache = null;

/** As séries do livro-razão, pelo id. Atira se um ficheiro estiver partido. */
export function loadSeries() {
  if (_cache) return _cache;
  const { series, erros } = lerSeries();
  if (erros.length) throw new Error(`livro-razão, séries: ${erros.join(' · ')}`);
  _cache = series;
  return series;
}

/** @returns {Serie[]} */
export function allSeries() {
  return [...loadSeries().values()];
}

/** @param {string} id */
export function hasSerie(id) {
  return loadSeries().has(id);
}

/**
 * Uma série, pelo id. Atira, na construção, se não existir: uma porta para uma
 * série que não existe é uma página que não abre.
 *
 * @param {string} id
 * @returns {Serie}
 */
export function getSerie(id) {
  const s = loadSeries().get(id);
  if (!s) throw new Error(`livro-razão: a série «${id}» não existe em ledger/series/.`);
  return s;
}

/**
 * A série de países de uma linha portuguesa, lida no campo `linha_de_portugal`
 * da série, e nunca inferida do identificador (a decisão 2 do RP3). `null`
 * quando a linha não tem série.
 *
 * @param {string} idDaLinha
 * @returns {Serie | null}
 */
export function serieDaLinha(idDaLinha) {
  const achadas = allSeries().filter((s) => s.linha_de_portugal === idDaLinha && s.eixo === 'pais');
  if (achadas.length > 1) {
    throw new Error(`livro-razão: a linha «${idDaLinha}» é a gémea de ${achadas.length} séries de países.`);
  }
  return achadas[0] ?? null;
}

/* ------------------------------------------------------------ a tabela dos nomes */

/**
 * @param {unknown} x
 * @returns {x is PaisDaUniao}
 */
function ePais(x) {
  return (
    eMapa(x) &&
    ['geo', 'codigo', 'pt', 'en', 'ordem', 'endereco', 'lido_em', 'sha256', 'excerto_pt', 'excerto_en', 'excerto_geo']
      .every((k) => typeof x[k] === 'string' && String(x[k]).trim() !== '')
  );
}

/** @type {PaisDaUniao[] | null} */
let _paises = null;

/**
 * Os 27 países da tabela, pela ordem em que ela os serve (a protocolar). Atira
 * se a tabela não tiver essa forma: um nome de país não se adivinha.
 *
 * @returns {PaisDaUniao[]}
 */
export function paisesDaUniao() {
  if (_paises) return _paises;
  /** @type {unknown} */
  const doc = JSON.parse(fs.readFileSync(TABELA_DOS_PAISES, 'utf8'));
  const lista = eMapa(doc) && Array.isArray(doc.paises) ? doc.paises : [];
  if (lista.length !== 27 || !lista.every(ePais)) {
    throw new Error(`livro-razão: a tabela dos nomes (${TABELA_DOS_PAISES}) não traz os 27 países na forma do motor.`);
  }
  _paises = /** @type {PaisDaUniao[]} */ (lista);
  return _paises;
}

/** A fonte da tabela e o seu endereço, como o ficheiro os diz. */
export function fonteDaTabelaDosPaises() {
  /** @type {unknown} */
  const doc = JSON.parse(fs.readFileSync(TABELA_DOS_PAISES, 'utf8'));
  if (!eMapa(doc) || typeof doc.fonte !== 'string' || typeof doc.tabela !== 'string') {
    throw new Error('livro-razão: a tabela dos nomes não diz a sua fonte.');
  }
  return { fonte: doc.fonte, tabela: doc.tabela };
}

/**
 * O nome curto de um país na língua da página, lido da tabela. Atira para um
 * código que a tabela não tem: nenhum nome de país se escreve à mão.
 *
 * @param {string} geo
 * @param {Lingua} lang
 * @returns {string}
 */
export function nomeDoPais(geo, lang) {
  const p = paisesDaUniao().find((x) => x.geo === geo);
  if (!p) throw new Error(`livro-razão: a tabela dos nomes não tem o código «${geo}».`);
  return lang === 'en' ? p.en : p.pt;
}

/* -------------------------------------------------------------------- as regras */

/**
 * As regras de uma linha de série. Numeram-se S1 a S8, como as do
 * `ledger/README.md`, e são as do `ledger/series/README.md`.
 *
 * @param {{
 *   series: Map<string, Serie>,
 *   claims: Map<string, Linha>,
 *   paises: PaisDaUniao[],
 *   hoje?: string,
 * }} entrada
 * @returns {{ errors: string[], stats: { series: number, pontos: number, marcas: number } }}
 */
export function validateSeries({ series, claims, paises, hoje = new Date().toISOString().slice(0, 10) }) {
  /** @type {string[]} */
  const errors = [];
  let pontos = 0;
  let marcas = 0;
  const geosDaTabela = paises.map((p) => p.geo);
  const esperados = [...geosDaTabela, AGREGADO_DA_UNIAO];

  for (const [id, s] of series) {
    const onde = `[series/${id}.yml]`;
    /** @param {string} m */
    const erro = (m) => errors.push(`${onde} ${m}`);

    // S1 · a forma: os campos, e mais nenhum; o id
    for (const k of Object.keys(s)) {
      if (k === '__file') continue;
      if (!(/** @type {readonly string[]} */ (CAMPOS_DA_SERIE)).includes(k)) erro(`S1: campo desconhecido «${k}».`);
    }
    for (const k of OBRIGATORIOS) {
      if (!(k in s)) erro(`S1: falta «${k}».`);
    }
    if (!ID.test(id)) erro('S1: o id não é minúsculas-com-hífenes.');

    // S2 · o eixo, e a identidade explícita da série
    if (!(/** @type {readonly unknown[]} */ (EIXOS)).includes(s.eixo)) erro(`S2: o eixo «${String(s.eixo)}» não é um dos eixos: ${EIXOS.join(', ')}.`);
    const pt = typeof s.linha_de_portugal === 'string' ? s.linha_de_portugal : null;
    const ue = typeof s.linha_da_uniao === 'string' ? s.linha_da_uniao : null;
    if (!pt || !ue) {
      erro('S2: a série não nomeia as duas gémeas (linha_da_uniao, linha_de_portugal).');
      continue;
    }
    if (s.eixo === 'pais' && id !== `${pt}-paises`) erro(`S2: uma série de países chama-se «<linha portuguesa>-paises», e esta chama-se «${id}».`);
    if (ue !== `${pt}-ue`) erro(`S2: a linha da União de «${pt}» é «${pt}-ue», e a série nomeia «${ue}».`);
    const linhaPt = claims.get(pt) ?? null;
    const linhaUe = claims.get(ue) ?? null;
    if (!linhaPt) erro(`S2: a linha portuguesa «${pt}» não existe no livro-razão.`);
    if (!linhaUe) erro(`S2: a linha da União «${ue}» não existe no livro-razão.`);

    // S3 · os 28 pontos: os 27 países da tabela, cada um uma vez, pela ordem dela, e a União no fim
    const lista = Array.isArray(s.pontos) ? s.pontos : [];
    const geos = lista.map((p) => (eMapa(p) ? p.geo : undefined));
    const repetidos = [...new Set(geos.filter((g, i) => geos.indexOf(g) !== i))];
    const faltam = esperados.filter((g) => !geos.includes(g));
    const sobram = geos.filter((g) => !esperados.includes(/** @type {string} */ (g)));
    if (repetidos.length) erro(`S3: país repetido: ${repetidos.join(', ')}.`);
    if (faltam.length) erro(`S3: país em falta: ${faltam.join(', ')}.`);
    if (sobram.length) erro(`S3: geografia que não é da tabela nem a União: ${sobram.map(String).join(', ')}.`);
    if (!repetidos.length && !faltam.length && !sobram.length && geos.join(' ') !== esperados.join(' ')) {
      erro('S3: os pontos não estão pela ordem protocolar da tabela, com a União no fim.');
    }
    for (const p of lista) {
      if (!eMapa(p)) {
        erro('S3: um ponto não é um mapa.');
        continue;
      }
      for (const k of Object.keys(p)) {
        if (!(/** @type {readonly string[]} */ (CAMPOS_DO_PONTO)).includes(k)) erro(`S3: o ponto ${String(p.geo)} traz o campo desconhecido «${k}».`);
      }
    }
    pontos += lista.length;

    // S4 · o valor de cada ponto dentro do seu excerto; a marca, uma das da série
    const periodo = typeof s.periodo === 'string' ? s.periodo : '';
    if (!PERIODO.test(periodo)) erro(`S4: o período «${periodo}» não é AAAA, AAAA-MM, AAAA-Tn nem AAAA-Sn.`);
    const bandeiras = eMapa(s.bandeiras) ? s.bandeiras : null;
    if (!bandeiras) erro('S4: «bandeiras» não é um mapa (vazio quando nenhum ponto leva marca).');
    const excerto = typeof s.excerpt === 'string' ? s.excerpt : '';
    const prefixo = excerto.endsWith(` — ${periodo}`) ? excerto.slice(0, -(` — ${periodo}`).length) : null;
    if (prefixo === null) erro('S4: o excerto da série não acaba no período.');
    /** @type {Set<string>} */
    const usadas = new Set();
    for (const p of lista) {
      if (!eMapa(p)) continue;
      const geo = String(p.geo);
      const fonte = valorNaFonte(p.valor);
      if (typeof p.valor !== 'string' || !/\d/.test(p.valor) || fonte === null || parsePtNumber(p.valor) === null) {
        erro(`S4: o valor de ${geo} («${String(p.valor)}») não é uma cadeia com um número da casa.`);
        continue;
      }
      const marca = p.bandeira === null || p.bandeira === undefined ? null : String(p.bandeira);
      if (marca !== null) {
        usadas.add(marca);
        marcas++;
        if (bandeiras && !(marca in bandeiras)) erro(`S4: a marca «${marca}» de ${geo} não está em «bandeiras».`);
      }
      const fim = `${periodo}: ${fonte}${marca ? ` ${marca}` : ''}`;
      if (typeof p.excerto !== 'string' || !p.excerto.endsWith(fim)) {
        erro(`S4: o valor de ${geo} («${p.valor}», «${fonte}» na forma da fonte) não está no seu excerto como «${fim}».`);
      } else if (prefixo !== null && !p.excerto.startsWith(`${prefixo} — `)) {
        erro(`S4: o excerto de ${geo} não começa pelo literal da série.`);
      }
    }
    if (bandeiras) {
      for (const k of Object.keys(bandeiras)) {
        if (!usadas.has(k)) erro(`S4: a marca «${k}» está em «bandeiras» e nenhum ponto a leva.`);
        if (typeof bandeiras[k] !== 'string' || !String(bandeiras[k]).trim()) erro(`S4: a marca «${k}» não traz a etiqueta da fonte.`);
      }
    }

    // S5 · o período das duas gémeas
    for (const [nome, linha] of /** @type {const} */ ([['portuguesa', linhaPt], ['da União', linhaUe]])) {
      if (linha && String(linha.reference_date) !== periodo) {
        erro(`S5: o período da série (${periodo}) não é o da linha ${nome} «${linha.id}» (${String(linha.reference_date)}).`);
      }
      if (linha && linha.unit !== s.unit) erro(`S5: a unidade da série não é a da linha ${nome} «${linha.id}».`);
    }

    // S6 · o ponto da União é a linha `-ue`, e o de Portugal a linha portuguesa, como números
    for (const [geo, linha] of /** @type {const} */ ([[AGREGADO_DA_UNIAO, linhaUe], ['PT', linhaPt]])) {
      const ponto = lista.find((p) => eMapa(p) && p.geo === geo);
      if (!linha || !eMapa(ponto)) continue;
      const a = parsePtNumber(ponto.valor);
      const b = parsePtNumber(linha.value);
      if (a === null || b === null || normalizaPtNumero(ponto.valor) === null || a !== b) {
        erro(`S6: o ponto ${geo} («${String(ponto.valor)}») não é, como número, a linha «${linha.id}» («${String(linha.value)}»).`);
      }
    }

    // S7 · a proveniência, como as linhas do livro
    const doc = eMapa(s.document) ? s.document : null;
    if (!doc) erro('S7: «document» não é um mapa.');
    else {
      for (const k of Object.keys(doc)) {
        if (!(/** @type {readonly string[]} */ (CAMPOS_DO_DOCUMENTO_DA_SERIE)).includes(k)) erro(`S7: document.${k} não é um campo do documento de uma série.`);
      }
      if (doc.kind !== 'serie') erro('S7: document.kind de uma série é «serie».');
      for (const k of ['title', 'edition']) if (typeof doc[k] !== 'string' || !String(doc[k]).trim()) erro(`S7: falta document.${k}.`);
      if (typeof doc.url !== 'string' || !/^https:\/\//.test(doc.url)) erro('S7: document.url não é um endereço https.');
    }
    /* A série lida como mapa de campos, para as regras que percorrem uma lista de nomes. */
    const campos = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (s));
    for (const k of ['source', 'name', 'name_source', 'unit']) {
      if (typeof campos[k] !== 'string' || !String(campos[k]).trim()) erro(`S7: «${k}» não é uma cadeia.`);
    }
    if (typeof s.source_url !== 'string' || !/^https?:\/\//.test(s.source_url)) erro('S7: source_url não é um endereço.');
    for (const k of ['access_date', 'published_at']) {
      const v = campos[k];
      if (typeof v !== 'string' || !DATA.test(v)) erro(`S7: «${k}» não é AAAA-MM-DD.`);
      else if (v > hoje) erro(`S7: «${k}» (${v}) é posterior ao dia da construção (${hoje}).`);
    }
    if (typeof s.published_at === 'string' && /^\d{4}-\d{2}$/.test(periodo) && s.published_at < `${periodo}-01`) {
      erro(`S7: published_at (${s.published_at}) é anterior ao mês de referência (${periodo}).`);
    }
    if (!Array.isArray(s.attributed_to) || !s.attributed_to.length || !s.attributed_to.every((a) => typeof a === 'string' && a.trim())) {
      erro('S7: attributed_to não é uma lista não vazia de nomes.');
    }
    if (!STUDY_IDS.has(/** @type {string} */ (s.study))) erro(`S7: o estudo «${String(s.study)}» não consta de src/data/studies.mjs.`);

    // S8 · as correções, uma por ponto mudado, com os sete campos
    if (!Array.isArray(s.corrections)) erro('S8: «corrections» não é uma lista.');
    else {
      for (const c of s.corrections) {
        if (!eMapa(c)) {
          erro('S8: uma correção não é um mapa.');
          continue;
        }
        for (const k of CAMPOS_DA_CORRECAO_DA_SERIE) if (!(k in c)) erro(`S8: uma correção não traz «${k}».`);
        for (const k of Object.keys(c)) {
          if (!(/** @type {readonly string[]} */ (CAMPOS_DA_CORRECAO_DA_SERIE)).includes(k)) erro(`S8: uma correção traz o campo desconhecido «${k}».`);
        }
      }
    }
  }
  return { errors, stats: { series: series.size, pontos, marcas } };
}
