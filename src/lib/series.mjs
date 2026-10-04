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

import { LEDGER_DIR, parsePtNumber, normalizaPtNumero, parsePtDecimal, evaluateCheck, MarcaDaExpressao } from './ledger.mjs';
import { STUDY_IDS } from '../data/studies.mjs';

/** A pasta das séries: ao lado de `ledger/claims`, ou a que `OEDP_SERIES_DIR` nomear. */
export const SERIES_DIR = process.env.OEDP_SERIES_DIR ?? path.join(path.dirname(LEDGER_DIR), 'series');

/** A tabela dos nomes dos países, que atravessa do motor com a sua proveniência. */
export const TABELA_DOS_PAISES = path.join(path.dirname(path.dirname(LEDGER_DIR)), 'src', 'data', 'paises-da-uniao.json');

/** O código do Eurostat para a União dos 27, que é a geografia da linha `-ue`. */
export const AGREGADO_DA_UNIAO = 'EU27_2020';

/** Os eixos que uma série pode ter: o corte entre países (UE1) e a série no tempo (RP3). */
export const EIXOS = /** @type {const} */ (['pais', 'periodo']);

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

/* ------------------------------------------------- as séries no tempo (RP3) */

/** Os campos de uma série no tempo (`eixo: periodo`, bloco RP3), e mais nenhum (regra S9). */
export const CAMPOS_DA_SERIE_NO_TEMPO = /** @type {const} */ ([
  'id', 'eixo', 'name', 'name_source', 'unit', 'periodicidade', 'source', 'document', 'source_url',
  'access_date', 'published_at', 'pedidos', 'excerpt', 'primeiro_periodo', 'ultimo_periodo', 'lacunas',
  'bandeiras', 'pontos', 'derivation', 'derivation_en', 'derived_from', 'check', 'attributed_to', 'study',
  'note', 'corrections',
]);
/** Os campos de um ponto de uma série no tempo (regra S9). */
export const CAMPOS_DO_PONTO_NO_TEMPO = /** @type {const} */ (['periodo', 'valor', 'excerto', 'bandeira']);
/** Os campos de um pedido do cliente da casa de onde os pontos saíram (regra S12). */
export const CAMPOS_DO_PEDIDO = /** @type {const} */ ([
  'url', 'lido_em', 'cliente', 'user_agent', 'sha256', 'bytes', 'primeiro', 'ultimo',
]);
/** Os campos de uma correção de um ponto de uma série no tempo (regra S13). */
export const CAMPOS_DA_CORRECAO_NO_TEMPO = /** @type {const} */ ([
  'periodo', 'date', 'kind', 'old_value', 'new_value', 'reason', 'reason_en',
]);
/** As periodicidades, e a forma do período de cada uma. */
export const PERIODICIDADES = /** @type {const} */ (['mensal', 'trimestral', 'semestral', 'anual']);
const FORMA_DA_PERIODICIDADE = {
  mensal: /^\d{4}-(0[1-9]|1[0-2])$/,
  trimestral: /^\d{4}-T[1-4]$/,
  semestral: /^\d{4}-S[12]$/,
  anual: /^\d{4}$/,
};
/** Os campos que uma série derivada não tem, porque a proveniência é a das origens (regra S11). */
const SEM_PROVENIENCIA_NA_DERIVADA = /** @type {const} */ ([
  'name', 'name_source', 'source', 'document', 'source_url', 'access_date', 'published_at', 'excerpt', 'attributed_to',
]);
/** Uma referência a um ponto de uma série numa expressão: `<id>[AAAA-MM]` ou `<id>[t]`. */
const REFERENCIA_A_PONTO = /([a-z0-9]+(?:-[a-z0-9]+)*)\[(t|\d{4}(?:-\d{2}|-T[1-4]|-S[12])?)\]/g;
/** O separador dos fragmentos de um excerto do Eurostat. */
export const SEPARADOR_DO_EXCERTO = ' · ';

/**
 * A ordem de um período da casa no tempo: [ano, posição dentro do ano]. `null`
 * quando a cadeia não é um período da casa.
 *
 * @param {unknown} periodo
 * @returns {[number, number] | null}
 */
export function ordemDoPeriodo(periodo) {
  const m = /^(\d{4})(?:-(\d{2})|-T([1-4])|-S([12]))?$/.exec(String(periodo));
  if (!m) return null;
  const sub = m[2] ? Number(m[2]) : m[3] ? Number(m[3]) * 3 : m[4] ? Number(m[4]) * 6 : 12;
  return [Number(m[1]), sub];
}

/** @param {[number, number]} a @param {[number, number]} b */
function antes(a, b) {
  return a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
}

/**
 * O período que vem a seguir na cadência.
 *
 * @param {string} periodo
 * @param {typeof PERIODICIDADES[number]} periodicidade
 */
export function periodoSeguinte(periodo, periodicidade) {
  if (periodicidade === 'anual') return String(Number(periodo) + 1);
  const ano = Number(periodo.slice(0, 4));
  const resto = periodo.slice(5);
  const [n, de, letra] = periodicidade === 'mensal' ? [Number(resto), 12, '']
    : [Number(resto.slice(1)), periodicidade === 'trimestral' ? 4 : 2, periodicidade === 'trimestral' ? 'T' : 'S'];
  const [a, m] = n + 1 > de ? [ano + 1, 1] : [ano, n + 1];
  return periodicidade === 'mensal' ? `${a}-${String(m).padStart(2, '0')}` : `${a}-${letra}${m}`;
}

/**
 * Os períodos da cadência que faltam entre o primeiro e o último ponto.
 *
 * @param {string[]} periodos
 * @param {typeof PERIODICIDADES[number]} periodicidade
 */
export function periodosQueFaltam(periodos, periodicidade) {
  const presentes = new Set(periodos);
  const faltam = [];
  let atual = periodos[0];
  for (let guarda = 0; atual !== periodos[periodos.length - 1] && guarda < 100000; guarda++) {
    atual = periodoSeguinte(atual, periodicidade);
    if (!presentes.has(atual)) faltam.push(atual);
  }
  return faltam;
}

/**
 * O valor da casa na forma em que o INE o escreve no `ind_string`: os milhares com
 * o espaço comum, o sinal com o hífen. «1 835» (U+202F) → «1 835»; «−3,35» → «-3,35».
 *
 * @param {unknown} valor
 * @returns {string | null}
 */
export function valorNoIne(valor) {
  if (typeof valor !== 'string') return null;
  const s = valor.replace(/−/g, '-').replace(/(?<=\d)[\u202f\u00a0](?=\d)/g, ' ');
  return /^-?\d{1,3}( \d{3})*(,\d+)?$|^-?\d+(,\d+)?$/.test(s) ? s : null;
}

/**
 * O código do período como o Eurostat o escreve: o trimestre com Q, o resto igual.
 *
 * @param {string} periodo
 */
export function periodoNoEurostat(periodo) {
  return periodo.replace(/-T([1-4])$/, '-Q$1');
}

/**
 * A parte de uma série derivada que se refaz: a expressão de um ponto com as
 * referências aos pontos das origens trocadas por nomes da conta, e o mapa desses
 * nomes para as linhas de mentira que a conta lê (com o valor do ponto de origem).
 *
 * @param {string} check
 * @param {string} periodo
 * @param {Map<string, Serie>} series
 * @returns {{ expr: string, claims: Map<string, Linha>, erro: string | null }}
 */
export function expressaoDoPonto(check, periodo, series) {
  /** @type {Map<string, string>} */
  const nomes = new Map();
  /** @type {Map<string, Linha>} */
  const claims = new Map();
  let erro = null;
  const expr = String(check).replace(REFERENCIA_A_PONTO, (_, sid, per) => {
    const alvo = per === 't' ? periodo : per;
    const origem = series.get(sid);
    const ponto = origem ? pontosDaSerie(origem).find((p) => p.periodo === alvo) : undefined;
    if (!ponto) {
      erro = `a expressão cita o ponto ${alvo} da série ${sid}, que não existe`;
      return 'x';
    }
    const chave = `${sid}#${alvo}`;
    if (!nomes.has(chave)) {
      const nome = `ref-${nomes.size}`;
      nomes.set(chave, nome);
      claims.set(nome, /** @type {Linha} */ (/** @type {unknown} */ ({ id: nome, value: ponto.valor })));
    }
    return /** @type {string} */ (nomes.get(chave));
  });
  return { expr, claims, erro };
}

const DATA = /^\d{4}-\d{2}-\d{2}$/;
const HORA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
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
 * Um ponto, no mínimo que quem o lê precisa: um mapa com a geografia (`eixo:
 * pais`) ou com o período (`eixo: periodo`, bloco RP3).
 *
 * @param {unknown} x
 * @returns {x is PontoDaSerie}
 */
function ePonto(x) {
  return eMapa(x) && (typeof x.geo === 'string' || typeof x.periodo === 'string');
}

/**
 * O ponto de uma chave, ou `null`: a geografia numa série de países, o período
 * numa série no tempo. A chave é a que vai na marca `data-ponto="<id>#<chave>"`.
 *
 * @param {Serie} serie
 * @param {string} chave
 */
export function pontoDaSerie(serie, chave) {
  const campo = serie?.eixo === 'periodo' ? 'periodo' : 'geo';
  return pontosDaSerie(serie).find((p) => p[campo] === chave) ?? null;
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
 * `ledger/README.md`, e são as do `ledger/series/README.md`; as séries no tempo
 * (bloco RP3) têm as S9 a S13, e a S14 é a do campo `serie` das linhas escalares.
 *
 * @param {{
 *   series: Map<string, Serie>,
 *   claims: Map<string, Linha>,
 *   paises: PaisDaUniao[],
 *   hoje?: string,
 *   agora?: string,
 * }} entrada
 * @returns {{ errors: string[], stats: { series: number, pontos: number, marcas: number, noTempo: number, presas: number } }}
 */
export function validateSeries({ series, claims, paises, hoje = new Date().toISOString().slice(0, 10), agora = new Date().toISOString() }) {
  /** @type {string[]} */
  const errors = [];
  let pontos = 0;
  let marcas = 0;
  let noTempo = 0;
  let presas = 0;
  const geosDaTabela = paises.map((p) => p.geo);
  const esperados = [...geosDaTabela, AGREGADO_DA_UNIAO];

  for (const [id, s] of series) {
    const onde = `[series/${id}.yml]`;
    /** @param {string} m */
    const erro = (m) => errors.push(`${onde} ${m}`);

    /* AS SÉRIES NO TEMPO (bloco RP3) têm as suas regras, S9 a S13; as de baixo são
       as do corte entre países, e não mudam. */
    if (s.eixo === 'periodo') {
      const r = validarSerieNoTempo(id, s, series, hoje, agora);
      for (const e of r.errors) erro(e);
      pontos += r.pontos;
      marcas += r.marcas;
      noTempo++;
      continue;
    }

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

  // S14 · o campo `serie` de uma linha escalar: a linha é o ponto do seu período nessa série
  for (const [lid, c] of claims) {
    const campos = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (c));
    if (campos.serie === undefined || campos.serie === null) continue;
    presas++;
    for (const e of errosDaSerieDaLinha(c, series)) errors.push(`[claims/${lid}.yml] S14: ${e}`);
  }
  return { errors, stats: { series: series.size, pontos, marcas, noTempo, presas } };
}

/**
 * As coordenadas de uma edição: o código e os pares `dimensão=categoria`.
 *
 * @param {unknown} edicao
 * @returns {{ codigo: string, pares: Map<string, string> } | null}
 */
export function coordenadasDaEdicao(edicao) {
  if (typeof edicao !== 'string' || !edicao.trim()) return null;
  const [codigo, ...resto] = edicao.split(', ');
  /** @type {Map<string, string>} */
  const pares = new Map();
  for (const par of resto) {
    const i = par.indexOf('=');
    if (i <= 0 || i === par.length - 1) return null;
    pares.set(par.slice(0, i), par.slice(i + 1));
  }
  return { codigo, pares };
}

/**
 * A REGRA S14, numa função só: os erros do campo `serie` de uma linha escalar.
 * A linha nomeia uma série no tempo que existe; tem a unidade dela; as suas
 * coordenadas são as da série (uma linha do Eurostat do RP1b não escreve a
 * geografia na edição, e a série escreve-a: então o excerto da linha tem de
 * nomear a geografia como a resposta a etiqueta no literal da série); e o ponto
 * do período da linha tem o valor da linha, cadeia a cadeia, e a mesma marca.
 *
 * @param {Linha} c
 * @param {Map<string, Serie>} series
 * @returns {string[]}
 */
export function errosDaSerieDaLinha(c, series) {
  const out = [];
  const campos = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (c));
  const sid = typeof campos.serie === 'string' ? campos.serie : null;
  const s = sid ? series.get(sid) : undefined;
  if (!sid || !s || s.eixo !== 'periodo') {
    out.push(`a linha nomeia a série «${String(campos.serie)}», que não é uma série no tempo de ledger/series/.`);
    return out;
  }
  if (c.unit !== s.unit) out.push(`a unidade da linha («${String(c.unit)}») não é a da série «${sid}» («${String(s.unit)}»).`);
  const docL = eMapa(c.document) ? c.document : null;
  const docS = eMapa(s.document) ? s.document : null;
  const cl = coordenadasDaEdicao(docL?.edition);
  const cs = coordenadasDaEdicao(docS?.edition);
  if (!cl || !cs) {
    out.push(`a edição da linha ou a da série «${sid}» não tem a forma «<código>, <dimensão>=<categoria>, …».`);
  } else {
    const extra = [...cs.pares.keys()].filter((k) => !cl.pares.has(k));
    const diferentes = [...cl.pares].filter(([k, v]) => cs.pares.get(k) !== v);
    if (cl.codigo !== cs.codigo || diferentes.length || extra.some((k) => k !== 'geo')) {
      out.push(`as coordenadas da linha («${String(docL?.edition)}») não são as da série «${sid}» («${String(docS?.edition)}»).`);
    } else if (extra.includes('geo')) {
      const geo = cs.pares.get('geo');
      const frag = String(s.excerpt ?? '').split(SEPARADOR_DO_EXCERTO).find((x) => x.startsWith(`"${geo}":"`));
      const rotulo = frag ? frag.slice(`"${geo}":"`.length, -1) : null;
      if (!rotulo || !String(c.excerpt ?? '').includes(` — ${rotulo} — `)) {
        out.push(`a série «${sid}» fixa a geografia ${geo} e o excerto da linha não a nomeia como a resposta a etiqueta («${String(rotulo)}»).`);
      }
    }
  }
  const ponto = pontosDaSerie(s).find((p) => p.periodo === String(c.reference_date));
  if (!ponto) {
    out.push(`a série «${sid}» não tem o ponto ${String(c.reference_date)}, que é o período da linha.`);
  } else {
    if (ponto.valor !== c.value) out.push(`o ponto ${String(c.reference_date)} da série «${sid}» vale «${String(ponto.valor)}» e a linha «${String(c.value)}».`);
    const marcaL = campos.source_flag ? String(campos.source_flag) : null;
    const marcaP = ponto.bandeira ? String(ponto.bandeira) : null;
    if (marcaL !== marcaP) out.push(`o ponto ${String(c.reference_date)} da série «${sid}» leva a marca «${String(marcaP)}» e a linha «${String(marcaL)}».`);
  }
  return out;
}

/**
 * AS REGRAS DE UMA SÉRIE NO TEMPO (bloco RP3), S9 a S13. Os erros voltam sem o
 * prefixo do ficheiro, que quem chama acrescenta.
 *
 * @param {string} id
 * @param {Serie} s
 * @param {Map<string, Serie>} series
 * @param {string} hoje
 * @param {string} agora
 * @returns {{ errors: string[], pontos: number, marcas: number }}
 */
function validarSerieNoTempo(id, s, series, hoje, agora) {
  /** @type {string[]} */
  const errors = [];
  let marcas = 0;
  const campos = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (s));
  /** @param {string} m */
  const erro = (m) => errors.push(m);

  // S9 · a forma e a cadência
  for (const k of Object.keys(s)) {
    if (k === '__file') continue;
    if (!(/** @type {readonly string[]} */ (CAMPOS_DA_SERIE_NO_TEMPO)).includes(k)) erro(`S9: campo desconhecido «${k}».`);
  }
  for (const k of CAMPOS_DA_SERIE_NO_TEMPO) {
    if (k !== 'note' && !(k in s)) erro(`S9: falta «${k}».`);
  }
  if (!/^serie-[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) erro('S9: o id de uma série no tempo é «serie-…», em minúsculas com hífenes.');
  const periodicidade = /** @type {typeof PERIODICIDADES[number]} */ (String(campos.periodicidade));
  const forma = /** @type {Record<string, RegExp>} */ (FORMA_DA_PERIODICIDADE)[periodicidade];
  if (!forma) erro(`S9: a periodicidade «${periodicidade}» não é uma de ${PERIODICIDADES.join(', ')}.`);
  const lista = Array.isArray(s.pontos) ? s.pontos : [];
  if (!lista.length) erro('S9: uma série sem pontos não é uma série.');
  /** @type {string[]} */
  const periodos = [];
  for (const p of lista) {
    if (!eMapa(p)) {
      erro('S9: um ponto não é um mapa.');
      continue;
    }
    for (const k of Object.keys(p)) {
      if (!(/** @type {readonly string[]} */ (CAMPOS_DO_PONTO_NO_TEMPO)).includes(k)) erro(`S9: o ponto ${String(p.periodo)} traz o campo desconhecido «${k}».`);
    }
    for (const k of CAMPOS_DO_PONTO_NO_TEMPO) if (!(k in p)) erro(`S9: o ponto ${String(p.periodo)} não traz «${k}».`);
    const per = String(p.periodo);
    if (forma && !forma.test(per)) erro(`S9: o período «${per}» não tem a forma da periodicidade «${periodicidade}».`);
    periodos.push(per);
  }
  const ordens = periodos.map(ordemDoPeriodo);
  for (let i = 1; i < ordens.length; i++) {
    const a = ordens[i - 1];
    const b = ordens[i];
    if (!a || !b || !antes(a, b)) {
      erro(`S9: os períodos não são crescentes e sem repetição (${periodos[i - 1]} e ${periodos[i]}).`);
      break;
    }
  }
  if (periodos.length && (campos.primeiro_periodo !== periodos[0] || campos.ultimo_periodo !== periodos[periodos.length - 1])) {
    erro(`S9: o primeiro e o último período (${String(campos.primeiro_periodo)}, ${String(campos.ultimo_periodo)}) não são os dos pontos (${periodos[0]}, ${periodos[periodos.length - 1]}).`);
  }
  const lacunas = Array.isArray(s.lacunas) ? s.lacunas : null;
  if (!lacunas) erro('S9: «lacunas» não é uma lista.');
  else if (forma && periodos.length && !errors.some((e) => e.startsWith('S9: os períodos'))) {
    const faltam = periodosQueFaltam(periodos, periodicidade);
    const declaradas = lacunas.map((l) => (eMapa(l) ? String(l.periodo) : '?'));
    if (faltam.join(' ') !== declaradas.join(' ')) {
      erro(`S9: faltam na cadência os períodos [${faltam.join(', ')}] e as lacunas declaradas são [${declaradas.join(', ')}].`);
    }
    for (const l of lacunas) {
      /* A RAZÃO É A DA FONTE, ou nenhuma: `null` quando a resposta não dá razão, e o
         recibo di-lo por palavras do projeto; uma cadeia vazia não é uma razão. */
      const semRazao = eMapa(l) && l.razao === null;
      if (!eMapa(l) || Object.keys(l).join(' ') !== 'periodo razao' || (!semRazao && (typeof l.razao !== 'string' || !l.razao.trim()))) {
        erro(`S9: a lacuna ${eMapa(l) ? String(l.periodo) : '?'} não traz o período e a razão da fonte (ou null), e mais nada.`);
      }
    }
  }

  const derivada = Array.isArray(s.derived_from) && s.derived_from.length > 0;
  const bandeiras = eMapa(s.bandeiras) ? s.bandeiras : null;
  if (!bandeiras) erro('S10: «bandeiras» não é um mapa (vazio quando nenhum ponto leva marca).');

  if (derivada) {
    // S11 · a série derivada, refeita ponto a ponto
    for (const k of SEM_PROVENIENCIA_NA_DERIVADA) {
      if (campos[k] !== null) erro(`S11: uma série derivada tem «${k}» a null: a proveniência é a das origens.`);
    }
    if (!Array.isArray(s.pedidos) || s.pedidos.length) erro('S11: uma série derivada não tem pedidos próprios.');
    if (bandeiras && Object.keys(bandeiras).length) erro('S11: uma série derivada não tem marcas próprias.');
    for (const k of ['derivation', 'derivation_en', 'check']) {
      if (typeof campos[k] !== 'string' || !String(campos[k]).trim()) erro(`S11: uma série derivada explica a conta em «${k}».`);
    }
    for (const o of /** @type {unknown[]} */ (s.derived_from)) {
      const origem = series.get(String(o));
      if (!origem || origem.eixo !== 'periodo') erro(`S11: a origem «${String(o)}» não é uma série no tempo de ledger/series/.`);
    }
    const casas = /,\s*(\d+)\s*\)\s*$/.exec(String(s.check ?? ''));
    for (const p of lista) {
      if (!eMapa(p)) continue;
      if (p.excerto !== null || p.bandeira !== null) erro(`S11: o ponto ${String(p.periodo)} de uma série derivada não tem excerto nem marca: prova-se pela conta.`);
      const { expr, claims, erro: falta } = expressaoDoPonto(String(s.check), String(p.periodo), series);
      if (falta) {
        erro(`S11: ${falta}.`);
        continue;
      }
      const publicado = parsePtDecimal(p.valor);
      try {
        const calculado = evaluateCheck(expr, { claims, env: {} });
        if (calculado instanceof MarcaDaExpressao || publicado === null || !calculado.igual(publicado)) {
          erro(`S11: o ponto ${String(p.periodo)} vale «${String(p.valor)}» e a conta dá ${calculado instanceof MarcaDaExpressao ? calculado.marca : calculado.canonica()}.`);
        } else if (casas && (String(p.valor).split(',')[1] ?? '').length !== Number(casas[1])) {
          erro(`S11: o ponto ${String(p.periodo)} escreve ${(String(p.valor).split(',')[1] ?? '').length} casa(s) e a conta arredonda a ${casas[1]}.`);
        }
      } catch (e) {
        erro(`S11: a conta do ponto ${String(p.periodo)} não se faz: ${e instanceof Error ? e.message : String(e)}.`);
      }
    }
  } else {
    // S10 · o valor de cada ponto no seu excerto, e as marcas
    const fonte = String(campos.source);
    /** @type {Set<string>} */
    const usadas = new Set();
    for (const p of lista) {
      if (!eMapa(p)) continue;
      const per = String(p.periodo);
      if (typeof p.valor !== 'string' || !/\d/.test(p.valor) || parsePtNumber(p.valor) === null) {
        erro(`S10: o valor de ${per} («${String(p.valor)}») não é uma cadeia com um número da casa.`);
        continue;
      }
      const marca = p.bandeira === null || p.bandeira === undefined ? null : String(p.bandeira);
      if (marca !== null) {
        usadas.add(marca);
        marcas++;
        if (bandeiras && !(marca in bandeiras)) erro(`S10: a marca «${marca}» de ${per} não está em «bandeiras».`);
      }
      const excerto = typeof p.excerto === 'string' ? p.excerto : '';
      if (fonte === 'INE') {
        const noIne = valorNoIne(p.valor);
        const literal = `"ind_string" : "${noIne}${marca ? ` ${marca}` : ''}"`;
        if (!noIne || !excerto.includes(literal)) erro(`S10: o valor de ${per} («${p.valor}») não está no seu excerto como ${literal}.`);
        if (marca && !excerto.includes(`"sinal_conv" : "${marca}"`)) erro(`S10: a marca «${marca}» de ${per} não está no seu excerto.`);
      } else if (fonte === 'Eurostat') {
        const partes = excerto.split(SEPARADOR_DO_EXCERTO);
        const mt = /^"([^"]+)":(\d+)$/.exec(partes[0] ?? '');
        const mv = /^"(\d+)":(-?\d+(?:\.\d+)?)$/.exec(partes[1] ?? '');
        const mm = partes[2] !== undefined ? /^"(\d+)":"([^"]+)"$/.exec(partes[2]) : null;
        if (!mt || mt[1] !== periodoNoEurostat(per)) erro(`S10: o excerto de ${per} não abre com o período e o seu índice («${partes[0] ?? ''}»).`);
        else if (!mv || mv[1] !== mt[2] || mv[2] !== valorNaFonte(p.valor)) erro(`S10: o valor de ${per} («${p.valor}») não está no seu excerto com o índice ${mt[2]} («${partes[1] ?? ''}»).`);
        else if ((marca === null) !== (partes.length === 2) || partes.length > 3 || (marca !== null && (!mm || mm[1] !== mt[2] || mm[2] !== marca))) {
          erro(`S10: a marca de ${per} («${String(marca)}») não é a do seu excerto.`);
        }
      } else {
        erro(`S10: a fonte «${fonte}» não tem forma de excerto conhecida para uma série no tempo.`);
      }
    }
    if (bandeiras) {
      for (const k of Object.keys(bandeiras)) {
        if (!usadas.has(k)) erro(`S10: a marca «${k}» está em «bandeiras» e nenhum ponto a leva.`);
        if (typeof bandeiras[k] !== 'string' || !String(bandeiras[k]).trim()) erro(`S10: a marca «${k}» não traz a etiqueta da fonte.`);
      }
    }

    // S12 · a proveniência e os pedidos
    for (const k of ['source', 'name', 'name_source', 'unit', 'excerpt']) {
      if (typeof campos[k] !== 'string' || !String(campos[k]).trim()) erro(`S12: «${k}» não é uma cadeia.`);
    }
    const doc = eMapa(s.document) ? s.document : null;
    if (!doc) erro('S12: «document» não é um mapa.');
    else {
      for (const k of Object.keys(doc)) {
        if (!(/** @type {readonly string[]} */ (CAMPOS_DO_DOCUMENTO_DA_SERIE)).includes(k)) erro(`S12: document.${k} não é um campo do documento de uma série.`);
      }
      if (doc.kind !== 'serie') erro('S12: document.kind de uma série é «serie».');
      for (const k of ['title', 'edition']) if (typeof doc[k] !== 'string' || !String(doc[k]).trim()) erro(`S12: falta document.${k}.`);
      if (typeof doc.url !== 'string' || !/^https:\/\//.test(doc.url)) erro('S12: document.url não é um endereço https.');
    }
    for (const k of ['access_date', 'published_at']) {
      const v = campos[k];
      if (typeof v !== 'string' || !DATA.test(v)) erro(`S12: «${k}» não é AAAA-MM-DD.`);
      else if (v > hoje) erro(`S12: «${k}» (${v}) é posterior ao dia da construção (${hoje}).`);
    }
    const ultimoMes = periodicidade === 'mensal' ? String(campos.ultimo_periodo) : null;
    if (ultimoMes && typeof s.published_at === 'string' && s.published_at < `${ultimoMes}-01`) {
      erro(`S12: published_at (${s.published_at}) é anterior ao mês do último ponto (${ultimoMes}).`);
    }
    const pedidos = Array.isArray(s.pedidos) ? s.pedidos : [];
    if (!pedidos.length) erro('S12: uma série lida tem pelo menos um pedido.');
    /** @type {string[]} */
    const cobertos = [];
    for (const q of pedidos) {
      if (!eMapa(q) || Object.keys(q).join(' ') !== CAMPOS_DO_PEDIDO.join(' ')) {
        erro('S12: um pedido não traz os campos da forma, pela ordem dela.');
        continue;
      }
      if (typeof q.url !== 'string' || !/^https?:\/\//.test(q.url)) erro('S12: o endereço de um pedido não é um endereço.');
      if (typeof q.lido_em !== 'string' || !HORA.test(q.lido_em)) erro(`S12: a hora de um pedido («${String(q.lido_em)}») não é AAAA-MM-DDTHH:MM:SSZ.`);
      else if (q.lido_em > agora) erro(`S12: a hora de um pedido (${q.lido_em}) é posterior à construção.`);
      if (typeof q.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(q.sha256)) erro('S12: o resumo de um pedido não são 64 hexadecimais.');
      if (!Number.isInteger(q.bytes) || Number(q.bytes) < 1) erro('S12: o tamanho do corpo de um pedido não é um inteiro positivo.');
      for (const k of ['cliente', 'user_agent']) if (typeof q[k] !== 'string' || !String(q[k]).trim()) erro(`S12: o pedido não diz «${k}».`);
      const a = ordemDoPeriodo(q.primeiro);
      const b = ordemDoPeriodo(q.ultimo);
      const dele = periodos.filter((per) => {
        const o = ordemDoPeriodo(per);
        return a && b && o && !antes(o, a) && !antes(b, o);
      });
      if (!dele.length || dele[0] !== q.primeiro || dele[dele.length - 1] !== q.ultimo) {
        erro(`S12: o pedido de ${String(q.primeiro)} a ${String(q.ultimo)} não abre e fecha em pontos da série.`);
      }
      cobertos.push(...dele);
    }
    if (pedidos.length && cobertos.join(' ') !== periodos.join(' ')) erro('S12: os pedidos não cobrem os pontos uma vez cada, pela ordem.');
    const ultimoPedido = pedidos[pedidos.length - 1];
    if (eMapa(ultimoPedido) && s.source_url !== ultimoPedido.url) erro('S12: source_url não é o endereço do pedido do último ponto.');
    if (pedidos.length && typeof s.access_date === 'string') {
      const dias = pedidos.map((q) => (eMapa(q) ? String(q.lido_em).slice(0, 10) : '')).sort();
      if (s.access_date !== dias[dias.length - 1]) erro(`S12: access_date (${s.access_date}) não é o dia do pedido mais recente (${dias[dias.length - 1]}).`);
    }
    if (!Array.isArray(s.attributed_to) || !s.attributed_to.length || !s.attributed_to.every((x) => typeof x === 'string' && x.trim())) {
      erro('S12: attributed_to não é uma lista não vazia de nomes.');
    }
  }
  if (!STUDY_IDS.has(/** @type {string} */ (s.study))) erro(`S12: o estudo «${String(s.study)}» não consta de src/data/studies.mjs.`);

  // S13 · as correções, uma por ponto mudado
  if (!Array.isArray(s.corrections)) erro('S13: «corrections» não é uma lista.');
  else {
    /** @type {Map<string, Record<string, unknown>>} */
    const ultimaPorPeriodo = new Map();
    for (const c of s.corrections) {
      if (!eMapa(c) || Object.keys(c).join(' ') !== CAMPOS_DA_CORRECAO_NO_TEMPO.join(' ')) {
        erro('S13: uma correção não traz os sete campos da forma, pela ordem dela.');
        continue;
      }
      if (!periodos.includes(String(c.periodo))) erro(`S13: uma correção nomeia o período ${String(c.periodo)}, que não é um ponto.`);
      if (!['correcao', 'atualizacao'].includes(String(c.kind))) erro(`S13: a natureza de uma correção é «correcao» ou «atualizacao», e esta diz «${String(c.kind)}».`);
      if (typeof c.date !== 'string' || !DATA.test(c.date)) erro('S13: a data de uma correção não é AAAA-MM-DD.');
      for (const k of ['reason', 'reason_en']) if (typeof c[k] !== 'string' || !String(c[k]).trim()) erro(`S13: uma correção não diz «${k}».`);
      ultimaPorPeriodo.set(String(c.periodo), c);
    }
    for (const [per, c] of ultimaPorPeriodo) {
      const ponto = lista.find((p) => eMapa(p) && p.periodo === per);
      if (ponto && eMapa(ponto) && ponto.valor !== c.new_value) erro(`S13: o ponto ${per} vale «${String(ponto.valor)}» e a última correção dele diz «${String(c.new_value)}».`);
    }
  }
  return { errors, pontos: lista.length, marcas };
}
