/**
 * =============================================================================
 * K17 · AS FAMÍLIAS: O QUE É CADA NÚMERO, AUDITADO E CONFERIDO EM CADA RECIBO · bloco R4 (05.10.2026)
 * =============================================================================
 *
 * O ponto 2 do brief `design/observatorio/BRIEF-R4-as-palavras-correntes-em-cada-numero.md`: «a célula das leituras
 * provadas passa a exigir uma frase para cada linha do livro, por id ou por família, com a planta de uma linha sem
 * frase e a de uma frase com um algarismo». É a K17 alargada: a mesma forma de auditoria (cada parte que diz o que a
 * medida é apoia-se num literal que está mesmo no campo que cita), sobre as frases das famílias.
 *
 * A PRIMEIRA METADE NÃO LÊ `dist/`. Com a sua própria regra de família (o cartão nacional; a medida dos concelhos,
 * pelo relance e pela distância que cada concelho declara; ou o identificador sem o período no fim, com o «-ue»
 * guardado), confere que:
 *   · cada linha do livro-razão tem frase: a leitura auditada do cartão, ou a família com entrada na auditoria e na
 *     declaração (`src/data/o-que-e-das-familias.mjs`, ou a nota da medida em `src/data/concelhos.mjs`);
 *   · nenhuma família sem linha nem nenhuma entrada da auditoria sem família;
 *   · nenhuma palavra fixa de uma frase de família traz um algarismo;
 *   · as partes juntas são a frase declarada, nas duas edições;
 *   · cada parte que diz tem pelo menos um apoio, e cada apoio vale em CADA linha da família: um literal de quatro
 *     caracteres ou mais num campo de uma origem declarada, num campo selado da linha (os da fonte: excerpt, unit,
 *     name, source, document.title, document.locator, document.edition; e os da casa, conferidos no motor:
 *     derivation, derivation_en, ressalva, ressalva_en), no nome do recibo da linha, ou numa explicação de termo de
 *     `TERMOS_DOS_CARTOES` que nomeia a linha; um apoio em alternativa vale quando uma das alternativas vale em cada
 *     linha;
 *   · uma família que lê o cartão: cada apoio da linha própria das folhas da metade «o que é» do cartão, na
 *     auditoria da K17, vale também em cada linha da família, e os algarismos dela também;
 *   · cada origem da lista de uma entrada apoia uma parte, e cada origem usada está na lista.
 *
 * A SEGUNDA METADE LÊ OS RECIBOS CONSTRUÍDOS (as 3 195 linhas, nas duas edições): uma frase por recibo, com a marca
 * da linha, dentro da cabeça; o texto rendido é o que esta célula recompõe por conta própria (a frase declarada, a
 * nota da medida, ou a metade «o que é» do cartão recomposta contra a linha pela conta da K17); nas linhas com cartão,
 * as duas metades recompostas pela mesma conta, com a régua lida do cartão onde ele se rende (uma página de assunto
 * ou, para o cartão que só vive numa página de área, essa página), e iguais, carácter a carácter, às do cartão onde
 * ele se rende com a leitura; cada algarismo da frase está numa marca de origem; e o título é o nome do recibo da
 * linha, com o concelho onde o nome é o de uma medida dos 308.
 *
 * O QUE NÃO CONFERE, e di-lo: não infere que o literal quer dizer o que a parte diz. Essa leitura é de quem assina a
 * auditoria, e é ela que a leitura a frio relê.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse, NodeType } from 'node-html-parser';

import { FAMILIAS_DAS_LINHAS, FAMILIAS_DOS_CONCELHOS, LINHAS_POR_CONFIRMAR_NA_FONTE } from '../../src/data/o-que-e-das-familias.mjs';
import { POR_VERIFICAR } from '../../src/data/marcador.mjs';
import { MEDIDAS_DO_CONCELHO } from '../../src/data/concelhos.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../../src/data/municipios.mjs';
import { LEITURAS_DAS_MEDIDAS } from '../../src/data/leituras-das-medidas.mjs';
import { ORIGENS_DAS_DEFINICOES, FIGURAS } from '../../src/data/figuras.mjs';
import { MEDIDAS_DO_DOMINIO_1 } from '../../src/data/dominios.mjs';
import { NOMES_DO_PROJETO, NOMES_DAS_LINHAS_DERIVADAS } from '../../src/data/nomes-das-medidas.mjs';
import { TERMOS_DOS_CARTOES } from '../../src/data/termos-dos-cartoes.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { NOMES_DAS_SERIES } from '../../src/data/series-no-tempo.mjs';
import { FRASES_DAS_SERIES, SERIES_POR_CONFIRMAR_NA_FONTE } from '../../src/data/o-que-e-das-series.mjs';
import { lerSeriesDoPortao } from '../../scripts/series-do-portao.mjs';
import { folhasDaLeitura, lerAuditoriaDasLeituras, leituraIndependente, corteIndependente, normal, PAGINAS_DA_LEITURA } from './leituras.mjs';

const LITERAL_MINIMO = 4;
const CAMPOS_DA_FONTE = new Set(['excerpt', 'unit', 'name', 'source', 'document.title', 'document.locator', 'document.edition']);
const CAMPOS_DA_CASA = new Set(['derivation', 'derivation_en', 'ressalva', 'ressalva_en']);
const PONTUACAO = /[\s.,:;()−%’'!?]+/g;
/** @param {any} l @param {string} c */
const campoDaLinha = (l, c) => (c === 'document.title' ? l?.document?.title : c === 'document.locator' ? l?.document?.locator : c === 'document.edition' ? l?.document?.edition : l?.[c]);
/** O texto de uma frase de pedaços (as cadeias e os termos de outra língua). @param {unknown} x */
export const textoDaFrase = (x) => (Array.isArray(x) ? x.map((p) => (typeof p === 'string' ? p : p?.termo ?? '')).join('') : typeof x === 'string' ? x : '');
const curto = (/** @type {string} */ s) => (s.length > 60 ? `${s.slice(0, 57)}…` : s);
/** Um valor do livro-razão como número, pela conta desta célula. @param {unknown} v */
const numeroAqui = (v) => { const t = String(v ?? '').replace(/[\s\u00a0\u202f\u2009]/g, '').replace(/\u2212/g, '-').replace(',', '.'); return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null; };
/**
 * A parte do sinal de uma leitura de um cartão contra uma linha, pela conta desta célula (R4-b): o primeiro ramo do sinal
 * depois do corte, escolhido pelo valor da linha, até ao primeiro pedaço que compara.
 * @param {string} cartao @param {'pt'|'en'} lang @param {any} linha
 */
export function parteDoSinalAqui(cartao, lang, linha) {
  const partes = /** @type {any} */ (LEITURAS_DAS_MEDIDAS)[cartao]?.[lang];
  const v = numeroAqui(linha?.value);
  if (!Array.isArray(partes) || v === null) return null;
  const compara = (/** @type {any} */ x) => (Array.isArray(x) ? x.some(compara)
    : Boolean(x && typeof x === 'object' && ('compara' in x || 'estado' in x || 'comparacao' in x || ('sinal' in x && Object.values(x.sinal ?? {}).some(compara)))));
  const corte = partes.findIndex(compara);
  for (const p of corte < 0 ? [] : partes.slice(corte)) {
    if (!p || typeof p !== 'object' || !('sinal' in p)) continue;
    const ramo = p.sinal[v > 0 ? 'positivo' : v < 0 ? 'negativo' : 'zero'] ?? [];
    /** @type {string[]} */
    const antes = [];
    for (const x of ramo) { if (compara(x) || typeof x !== 'string') break; antes.push(x); }
    return normal(antes.join('')) || null;
  }
  return null;
}

/* ------------------------------------------------------------------ a regra das famílias, desta célula */
/** O identificador sem o período no fim, com o «-ue» guardado. @param {string} id */
export const semPeriodoAqui = (id) => id.replace(/-\d{4}(-\d{2})?(?=(-ue)?$)/, '');

/** As linhas que cada concelho declara, com a chave da medida e o nome do concelho. */
function linhasDosConcelhos(municipios = MUNICIPIOS_COM_PAGINA) {
  /** @type {Map<string, { chave: string, concelho: Record<string, string> }>} */
  const m = new Map();
  for (const c of municipios) {
    for (const p of c.relance ?? []) if (p.claim) m.set(p.claim, { chave: p.chave, concelho: c.nome });
    if (c.distancia?.limite) m.set(c.distancia.limite, { chave: 'limite', concelho: c.nome });
  }
  return m;
}

/** O nome da casa de uma linha, pela escada (a primeira página, o domínio, os nomes do projeto, as derivadas). */
function nomesDaCasa() {
  /** @type {Map<string, Record<string, string>>} */
  const m = new Map();
  for (const [id, n] of Object.entries(NOMES_DO_PROJETO)) m.set(id, n);
  for (const x of MEDIDAS_DO_DOMINIO_1) if (x.claim) m.set(x.claim, x.nome);
  for (const f of FIGURAS) if (f.claim) m.set(f.claim, f.nome);
  for (const [id, n] of Object.entries(NOMES_DAS_LINHAS_DERIVADAS)) if (!m.has(id)) m.set(id, n);
  return m;
}

/**
 * O contexto da célula: as linhas, as famílias e os nomes, lidos dos ficheiros e não do resolvedor das páginas.
 * @param {{ linhas?: Map<string, any>, familias?: Record<string, any>, doConcelho?: Record<string, any>, municipios?: any[] }} [e]
 */
export function contextoDasFamilias({ linhas = loadClaims(), familias = FAMILIAS_DAS_LINHAS, doConcelho = FAMILIAS_DOS_CONCELHOS, municipios = MUNICIPIOS_COM_PAGINA } = {}) {
  const concelhos = linhasDosConcelhos(municipios);
  const casa = nomesDaCasa();
  /** @param {string} id */
  const familia = (id) => (Object.prototype.hasOwnProperty.call(LEITURAS_DAS_MEDIDAS, id) ? { tipo: 'cartao', chave: id }
    : concelhos.has(id) ? { tipo: 'concelho', chave: /** @type {any} */ (concelhos.get(id)).chave, concelho: /** @type {any} */ (concelhos.get(id)).concelho }
      : { tipo: 'familia', chave: semPeriodoAqui(id) });
  /** O nome do recibo de uma linha, e o lugar. @param {string} id @param {'pt'|'en'} lang */
  const nomeDoRecibo = (id, lang) => {
    const n = casa.get(id);
    const daCasa = n ? n[lang] ?? n.pt : null;
    if (typeof daCasa === 'string' && daCasa.trim() !== '') return { texto: daCasa, lugar: null };
    const f = familia(id);
    if (f.tipo === 'concelho') {
      const m = MEDIDAS_DO_CONCELHO.find((x) => x.chave === f.chave);
      const nome = m ? m.nome[lang] : doConcelho[f.chave]?.nome?.[lang];
      return { texto: nome ?? null, lugar: f.concelho?.[lang] ?? f.concelho?.pt ?? null };
    }
    if (f.tipo === 'familia') {
      const d = familias[f.chave];
      return { texto: d?.nome?.[lang] ?? (d?.cartao ? casa.get(d.cartao)?.[lang] ?? null : null), lugar: null };
    }
    return { texto: null, lugar: null };
  };
  return { linhas, familias, doConcelho, familia, nomeDoRecibo };
}

/* =========================================================================
 * A PRIMEIRA METADE: a auditoria contra a declaração, as origens e as linhas
 * ========================================================================= */

/**
 * @param {{ auditoria?: any, linhas?: Map<string, any>, familias?: Record<string, any>, doConcelho?: Record<string, any>, origens?: Record<string, any> }} [entrada]
 */
export function conferirAuditoriaDasFamilias({
  auditoria = lerAuditoriaDasLeituras(),
  linhas = loadClaims(),
  familias = FAMILIAS_DAS_LINHAS,
  doConcelho = FAMILIAS_DOS_CONCELHOS,
  origens = /** @type {Record<string, any>} */ (ORIGENS_DAS_DEFINICOES),
  porConfirmarDeclaradas = /** @type {readonly string[]} */ (LINHAS_POR_CONFIRMAR_NA_FONTE),
} = {}) {
  /** @type {string[]} */
  const erros = [];
  const contas = { linhas: 0, por_cartao: 0, por_concelho: 0, por_familia: 0, familias: 0, entradas: 0, partes: 0, diz: 0, apoios: 0, todas_na_fonte: 0, alguma_da_casa: 0, lista_da_casa: /** @type {string[]} */ ([]), por_confirmar_entradas: 0, por_confirmar_linhas: 0 };
  /** As linhas cuja frase está por confirmar na fonte, pela conta desta célula (R4-b). @type {Set<string>} */
  const porConfirmar = new Set();
  const falha = (/** @type {string} */ m) => erros.push(`K17 · famílias · ${m}`);
  const ctx = contextoDasFamilias({ linhas, familias, doConcelho });

  /* AS LINHAS DE CADA FAMÍLIA, pela regra desta célula. */
  /** @type {Map<string, string[]>} */
  const linhasDe = new Map();
  for (const id of linhas.keys()) {
    contas.linhas++;
    const f = ctx.familia(id);
    if (f.tipo === 'cartao') { contas.por_cartao++; continue; }
    const k = f.tipo === 'concelho' ? `concelho:${f.chave}` : f.chave;
    if (f.tipo === 'concelho') contas.por_concelho++; else contas.por_familia++;
    if (!linhasDe.has(k)) linhasDe.set(k, []);
    /** @type {string[]} */ (linhasDe.get(k)).push(id);
  }
  contas.familias = linhasDe.size;

  const entradas = Array.isArray(auditoria?.familias) ? auditoria.familias : [];
  if (!entradas.length) { falha('a auditoria não tem a chave «familias»: a célula não mediu nada'); return { erros, contas, porConfirmar }; }
  /** @type {Map<string, any>} */
  const porFamilia = new Map();
  for (const e of entradas) {
    const chaves = e.concelho ? [`concelho:${e.concelho}`] : Array.isArray(e.chaves) ? e.chaves : [];
    if (!chaves.length) falha('uma entrada da auditoria sem família');
    for (const k of chaves) {
      if (porFamilia.has(k)) falha(`a família «${k}» aparece em duas entradas da auditoria`);
      porFamilia.set(k, e);
    }
  }
  /* CADA LINHA TEM FRASE: a leitura do cartão (que a K17 audita) ou a família com auditoria e declaração. */
  for (const id of linhas.keys()) {
    const f = ctx.familia(id);
    if (f.tipo === 'cartao') {
      if (!(auditoria.medidas ?? []).some((/** @type {any} */ m) => m.id === id)) falha(`a linha «${id}» tem cartão e a leitura dele não está auditada`);
      continue;
    }
    const k = f.tipo === 'concelho' ? `concelho:${f.chave}` : f.chave;
    const declarada = f.tipo === 'concelho'
      ? MEDIDAS_DO_CONCELHO.find((m) => m.chave === f.chave)?.nota ?? doConcelho[f.chave]?.frase
      : familias[f.chave] ? (familias[f.chave].cartao ? { cartao: familias[f.chave].cartao } : familias[f.chave].frase) : null;
    if (!declarada) falha(`a linha «${id}» (família «${k}») não tem frase declarada`);
    if (!porFamilia.has(k)) falha(`a linha «${id}» (família «${k}») não tem frase auditada`);
  }
  for (const k of porFamilia.keys()) if (!linhasDe.has(k)) falha(`a auditoria fala da família «${k}», que nenhuma linha do livro-razão tem`);
  for (const k of Object.keys(familias)) if (!linhasDe.has(k)) falha(`a declaração tem a família «${k}», que nenhuma linha do livro-razão tem`);
  for (const k of Object.keys(doConcelho)) if (!linhasDe.has(`concelho:${k}`)) falha(`a declaração tem a medida dos concelhos «${k}», que nenhuma linha tem`);

  /* NENHUM ALGARISMO NAS FRASES DAS FAMÍLIAS: a declaração inteira, e as notas das medidas dos concelhos. */
  const semAlgarismo = (/** @type {unknown} */ x, /** @type {string} */ onde) => {
    for (const p of Array.isArray(x) ? x : [x]) {
      const t = typeof p === 'string' ? p : /** @type {any} */ (p)?.termo;
      if (typeof t !== 'string') { falha(`${onde}: um pedaço que não é texto nem termo de outra língua`); continue; }
      if (/\d/.test(t)) falha(`${onde}: a palavra fixa «${curto(t)}» traz um algarismo`);
    }
  };
  for (const [k, d] of Object.entries(familias)) {
    for (const lang of ['pt', 'en']) {
      if (d.frase) semAlgarismo(d.frase[lang], `${k} · ${lang}`);
      if (d.nome && /\d/.test(d.nome[lang] ?? '')) falha(`${k} · ${lang}: o nome da família traz um algarismo`);
    }
  }
  for (const [k, d] of Object.entries(doConcelho)) for (const lang of ['pt', 'en']) semAlgarismo(d.frase?.[lang], `concelho:${k} · ${lang}`);
  for (const m of MEDIDAS_DO_CONCELHO) for (const lang of ['pt', 'en']) semAlgarismo(/** @type {any} */ (m.nota)[lang], `concelho:${m.chave} · ${lang}`);

  /* AS ENTRADAS, uma a uma. */
  const nomes = (/** @type {string} */ id, /** @type {'pt'|'en'} */ lang) => ctx.nomeDoRecibo(id, lang).texto;
  /**
   * Um apoio, para cada linha. Devolve 'fonte', 'casa' ou null.
   * @param {any} a @param {string[]} ids @param {string} onde
   */
  const apoio = (a, ids, onde) => {
    contas.apoios++;
    if (Array.isArray(a?.ou)) {
      let classe = 'fonte';
      for (const id of ids) {
        const validas = a.ou.filter((/** @type {any} */ alt) => verifica(alt, [id]) === null);
        if (!validas.length) { falha(`${onde}: nenhuma das alternativas vale na linha «${id}»`); return null; }
        if (!validas.some((/** @type {any} */ alt) => classeDe(alt) === 'fonte')) classe = 'casa';
      }
      return classe;
    }
    const e = verifica(a, ids);
    if (e) { falha(`${onde}: ${e}`); return null; }
    return classeDe(a);
  };
  const classeDe = (/** @type {any} */ a) => (a.origem || (a.linha && (CAMPOS_DA_FONTE.has(a.campo) || a.forma === 'ano')) ? 'fonte' : 'casa');
  /* R4-b: UMA PARTE CONFIRMA-SE NUMA LINHA quando um apoio válido nessa linha é da fonte (uma origem, um campo da fonte, o
     período da data) ou é a conta declarada de uma linha calculada (`derivation`, `derivation_en`), que é a definição
     desse número; o nome do projeto, a ressalva e a explicação de um termo são palavras da casa e não confirmam. */
  const confirmaNaLinha = (/** @type {any} */ a, /** @type {string} */ id) => (Array.isArray(a?.ou)
    ? a.ou.some((/** @type {any} */ alt) => verifica(alt, [id]) === null && confirmaNaLinha(alt, id))
    : Boolean(a?.origem || a?.forma === 'ano' || (a?.linha === 'propria' && (CAMPOS_DA_FONTE.has(a.campo) || a.campo === 'derivation' || a.campo === 'derivation_en'))));
  /** @param {any} a @param {string[]} ids @returns {string|null} */
  const verifica = (a, ids) => {
    if (a?.forma === 'ano') {
      if (a.linha !== 'propria' || a.campo !== 'reference_date') return 'a forma «ano» lê-se só do reference_date da linha própria';
      for (const id of ids) if (!/^\d{4}$/.test(String(linhas.get(id)?.reference_date ?? ''))) return `diz que o período é um ano, e o de «${id}» é «${linhas.get(id)?.reference_date}»`;
      return null;
    }
    if (a?.termo) {
      const t = /** @type {any} */ (TERMOS_DOS_CARTOES)[a.termo];
      if (!t) return `o termo «${a.termo}» não está em TERMOS_DOS_CARTOES`;
      for (const id of ids) if (!t.cartoes.includes(id)) return `o termo «${a.termo}» não nomeia a linha «${id}»`;
      return null;
    }
    const literal = a?.literal;
    if (typeof literal !== 'string' || literal.trim().length < LITERAL_MINIMO) return `um literal com menos de ${LITERAL_MINIMO} caracteres, que não prende nada`;
    if (a.origem) {
      const o = origens[a.origem];
      if (!o) return `apoia-se em «${a.origem}», que não está declarada em ORIGENS_DAS_DEFINICOES`;
      if (!['excerto', 'excertoEn', 'documento', 'publicador'].includes(a.campo) || typeof o[a.campo] !== 'string') return `cita o campo «${a.campo}» da origem «${a.origem}», que não pode apoiar`;
      if (!o[a.campo].includes(literal)) return `cita «${curto(literal)}», que não está no campo «${a.campo}» da origem «${a.origem}»`;
      return null;
    }
    if (a.declaracao === 'nome') {
      for (const id of ids) {
        const n = nomes(id, a.lingua === 'en' ? 'en' : 'pt');
        if (typeof n !== 'string' || !n.includes(literal)) return `o nome do recibo de «${id}» (${a.lingua}) não traz «${curto(literal)}»`;
      }
      return null;
    }
    if (a.linha === 'propria') {
      if (!CAMPOS_DA_FONTE.has(a.campo) && !CAMPOS_DA_CASA.has(a.campo)) return `cita o campo «${a.campo}», que não pode apoiar`;
      for (const id of ids) {
        const v = campoDaLinha(linhas.get(id), a.campo);
        if (typeof v !== 'string' || !v.includes(literal)) return `cita «${curto(literal)}», que não está no campo «${a.campo}» da linha «${id}»`;
      }
      return null;
    }
    return 'um apoio sem origem, linha, nome nem termo';
  };

  const auditoriaDasMedidas = new Map((auditoria.medidas ?? []).map((/** @type {any} */ m) => [m.id, m]));
  const comuns = Array.isArray(auditoria.comuns) ? auditoria.comuns : [];
  for (const e of entradas) {
    contas.entradas++;
    const chaves = e.concelho ? [`concelho:${e.concelho}`] : e.chaves ?? [];
    const ids = chaves.flatMap((/** @type {string} */ k) => linhasDe.get(k) ?? []);
    const quem = chaves.join(', ');
    if (e.cartao) {
      /* UMA FAMÍLIA QUE LÊ O CARTÃO: a declaração diz o mesmo cartão, e cada apoio da linha própria da metade «o que
         é» dele vale em cada linha da família. */
      for (const k of chaves) if (familias[k]?.cartao !== e.cartao) falha(`${k}: a auditoria diz que lê o cartão «${e.cartao}», e a declaração diz «${familias[k]?.cartao ?? 'nenhum'}»`);
      const d = /** @type {any} */ (LEITURAS_DAS_MEDIDAS)[e.cartao];
      const m = auditoriaDasMedidas.get(e.cartao);
      if (!d || !m) { falha(`${quem}: o cartão «${e.cartao}» não tem leitura auditada`); continue; }
      const corte = corteIndependente(d.pt);
      const folhas = folhasDaLeitura(d.pt.slice(0, corte), d.en.slice(0, corte));
      for (const f of folhas) {
        if (f.nl !== undefined) continue;
        const entrada = (m.folhas ?? []).find((/** @type {any} */ x) => x.pt === f.pt && x.en === f.en) ?? comuns.find((/** @type {any} */ x) => x.pt === f.pt && x.en === f.en);
        if (!entrada) { falha(`${quem}: a folha «${curto(String(f.pt))}» do cartão não tem auditoria`); continue; }
        for (const p of entrada.partes ?? []) for (const a of p.apoios ?? []) if (a.linha === 'propria') {
          const er = verifica(a, ids);
          if (er) falha(`${quem} (a frase do cartão «${e.cartao}»): ${er}`);
        }
      }
      for (const alg of m.algarismos ?? []) for (const ap of alg.apoios ?? []) if (ap.linha === 'propria') {
        const er = verifica(ap, ids);
        if (er) falha(`${quem} (o algarismo «${alg.nl}» do cartão «${e.cartao}»): ${er}`);
      }
      contas.todas_na_fonte++;
      continue;
    }
    /* UMA FRASE ESCRITA PARA A FAMÍLIA, ou a nota de uma medida dos concelhos. */
    const declarada = e.concelho
      ? MEDIDAS_DO_CONCELHO.find((m) => m.chave === e.concelho)?.nota ?? doConcelho[e.concelho]?.frase
      : familias[chaves[0]]?.frase;
    for (const k of chaves.slice(1)) {
      if (textoDaFrase(familias[k]?.frase?.pt) !== textoDaFrase(declarada?.pt) || textoDaFrase(familias[k]?.frase?.en) !== textoDaFrase(declarada?.en)) {
        falha(`${k}: a auditoria junta-a a «${chaves[0]}», e as duas declaram frases diferentes`);
      }
    }
    const folha = Array.isArray(e.folhas) && e.folhas.length === 1 ? e.folhas[0] : null;
    if (!folha || !declarada) { falha(`${quem}: a auditoria não tem uma folha, ou a família não declara frase`); continue; }
    const partes = Array.isArray(folha.partes) ? folha.partes : [];
    const juntas = (/** @type {'pt'|'en'} */ lang) => partes.map((/** @type {any} */ p) => textoDaFrase(p?.[lang])).join('');
    if (juntas('pt') !== textoDaFrase(declarada.pt) || juntas('en') !== textoDaFrase(declarada.en)) {
      falha(`${quem}: as partes juntas não dão a frase declarada, nas duas edições (uma frase mudada precisa de nova leitura das origens)`);
      continue;
    }
    let todasNaFonte = true;
    /** @type {Set<string>} */
    const usadas = new Set();
    for (const [j, p] of partes.entries()) {
      contas.partes++;
      const qual = `${quem}, parte ${j + 1} («${curto(textoDaFrase(p?.pt))}»)`;
      if (p?.classe === 'liga') {
        for (const lang of ['pt', 'en']) if (textoDaFrase(p[lang]).replace(PONTUACAO, '') !== '') falha(`${qual}: está marcada como ligação e traz palavras`);
        continue;
      }
      if (p?.classe !== 'diz') { falha(`${qual}: não tem classe (diz ou liga)`); continue; }
      contas.diz++;
      if (!Array.isArray(p.apoios) || !p.apoios.length) { falha(`${qual}: diz o que a medida é e não tem apoio nenhum`); todasNaFonte = false; continue; }
      let daFonte = false;
      for (const a of p.apoios) {
        const c = apoio(a, ids, qual);
        if (c === 'fonte') daFonte = true;
        const anda = (/** @type {any} */ x) => { if (x?.origem) usadas.add(x.origem); for (const y of x?.ou ?? []) anda(y); };
        anda(a);
      }
      if (!daFonte) todasNaFonte = false;
    }
    const declaradas = new Set(e.origens ?? []);
    for (const o of declaradas) if (!usadas.has(o)) falha(`${quem}: a origem «${o}» está na lista e não apoia parte nenhuma`);
    for (const o of usadas) if (!declaradas.has(o)) falha(`${quem}: a origem «${o}» apoia uma parte e não está na lista`);
    if (todasNaFonte) contas.todas_na_fonte++; else { contas.alguma_da_casa++; contas.lista_da_casa.push(quem); }
    /* R4-b: O QUE ESTÁ POR CONFIRMAR NA FONTE, linha a linha, contra o que a auditoria declara. */
    const diz = partes.filter((/** @type {any} */ p) => p?.classe === 'diz');
    const por = ids.filter((id) => diz.some((/** @type {any} */ p) => !(p.apoios ?? []).some((/** @type {any} */ a) => confirmaNaLinha(a, id))));
    const esperado = por.length === 0 ? null : por.length === ids.length ? true : [...por].sort();
    const declarado = e.por_confirmar_na_fonte === true ? true : Array.isArray(e.por_confirmar_na_fonte?.linhas) ? [...e.por_confirmar_na_fonte.linhas].sort() : e.por_confirmar_na_fonte ? 'forma desconhecida' : null;
    if (JSON.stringify(esperado) !== JSON.stringify(declarado)) {
      falha(`${quem}: a auditoria diz «por confirmar na fonte» ${JSON.stringify(declarado)}, e a conta desta célula dá ${JSON.stringify(esperado === true ? true : esperado)}`);
    }
    if (por.length) contas.por_confirmar_entradas++;
    for (const id of por) porConfirmar.add(id);
  }
  /* AS LINHAS DECLARADAS AO RESOLVEDOR SÃO AS DESTA CONTA, nem mais nem menos (`LINHAS_POR_CONFIRMAR_NA_FONTE`). */
  const declaradas = new Set(porConfirmarDeclaradas);
  for (const id of porConfirmar) if (!declaradas.has(id)) falha(`a linha «${id}» está por confirmar na fonte pela auditoria e não está na lista que o resolvedor lê (uma marca em falta)`);
  for (const id of declaradas) if (!porConfirmar.has(id)) falha(`a linha «${id}» está na lista das frases por confirmar e a auditoria não a declara (uma marca a mais)`);
  contas.por_confirmar_linhas = porConfirmar.size;
  return { erros, contas, porConfirmar };
}

/* =========================================================================
 * A SEGUNDA METADE: os recibos construídos
 * ========================================================================= */

/**
 * A RÉGUA DE CADA CARTÃO, lida onde ele se rende: as páginas de assunto onde a K17 confere as leituras e, para os
 * cartões que só se rendem numa página de área, essas páginas. A régua diz que linha é o período anterior e que linha
 * é a União, que a conta desta célula precisa para recompor a metade que compara; onde o cartão se rende com a leitura,
 * guardam-se também as duas metades rendidas, para se conferir que o recibo e o cartão dizem a mesma frase.
 * @param {string} dist
 */
export function reguasDosCartoes(dist) {
  /** @type {Map<string, { regua: { anterior: string|null, ue: string|null }, oQueE?: string, comparacao?: string, pagina: string }>} */
  const m = new Map();
  const comLeitura = Object.keys(LEITURAS_DAS_MEDIDAS);
  /** @param {string} rel @param {'pt'|'en'} lang */
  const le = (rel, lang) => {
    const f = path.join(dist, rel);
    if (!fs.existsSync(f)) return;
    const html = fs.readFileSync(f, 'utf8');
    if (!comLeitura.some((id) => !m.has(`${lang}:${id}`) && html.includes(`data-cartao-medida="${id}"`))) return;
    const root = parse(html);
    for (const c of root.querySelectorAll('article.cartao-medida[data-cartao-medida]')) {
      const id = /** @type {string} */ (c.getAttribute('data-cartao-medida'));
      if (!comLeitura.includes(id) || m.has(`${lang}:${id}`)) continue;
      const regua = {
        anterior: c.querySelector('[data-regua="anterior"] [data-claim]')?.getAttribute('data-claim') ?? null,
        ue: c.querySelector('[data-regua="ue"] [data-claim]')?.getAttribute('data-claim') ?? null,
      };
      const o = c.querySelector('[data-leitura-parte="o-que-e"]');
      const k = c.querySelector('[data-leitura-parte="comparacao"]');
      m.set(`${lang}:${id}`, {
        regua,
        ...(o || k ? { oQueE: o ? normal(o.textContent) : '', comparacao: k ? normal(k.textContent) : '' } : {}),
        pagina: rel,
      });
    }
  };
  for (const [rel, lang] of PAGINAS_DA_LEITURA) le(rel, /** @type {'pt'|'en'} */ (lang));
  for (const [base, lang] of /** @type {const} */ ([['areas', 'pt'], [path.join('en', 'areas'), 'en']])) {
    const dir = path.join(dist, base);
    if (!fs.existsSync(dir)) continue;
    for (const d of fs.readdirSync(dir).sort()) if (fs.existsSync(path.join(dir, d, 'index.html'))) le(path.join(base, d, 'index.html'), lang);
  }
  return m;
}

/** A cabeça de um recibo, cortada do HTML sem o analisar inteiro. @param {string} html */
export function cabecaDoRecibo(html) {
  const i = html.indexOf('<div class="linha-cabeca"');
  if (i < 0) return null;
  const j = html.indexOf('<p class="linha-id"', i);
  return parse(html.slice(i, j < 0 ? undefined : j));
}

/**
 * Um recibo, conferido. Separado para as plantas o exercerem sobre uma cópia em memória.
 * @param {import('node-html-parser').HTMLElement} cabeca @param {string} id @param {'pt'|'en'} lang
 * @param {{ ctx: ReturnType<typeof contextoDasFamilias>, cartoes: ReturnType<typeof reguasDosCartoes>, porConfirmar?: Set<string> }} e
 */
export function conferirCabecaDoRecibo(cabeca, id, lang, { ctx, cartoes, porConfirmar = new Set() }) {
  /** @type {string[]} */
  const erros = [];
  const falha = (/** @type {string} */ m) => erros.push(`K17 · recibo · ${lang} · ${id}: ${m}`);
  const frases = cabeca.querySelectorAll('[data-o-que-e]');
  if (frases.length !== 1) { falha(`o recibo tem ${frases.length} frase(s) «O que é este número», e tem uma`); return erros; }
  const el = frases[0];
  if (el.getAttribute('data-o-que-e') !== id) falha(`a frase diz ser de «${el.getAttribute('data-o-que-e')}»`);
  const f = ctx.familia(id);
  const chave = f.tipo === 'cartao' ? id : f.chave;
  if (el.getAttribute('data-o-que-e-tipo') !== f.tipo || el.getAttribute('data-o-que-e-familia') !== chave) {
    falha(`a frase diz ser da família «${el.getAttribute('data-o-que-e-tipo')}:${el.getAttribute('data-o-que-e-familia')}», e é de «${f.tipo}:${chave}»`);
  }
  const oQueE = el.querySelector('[data-o-que-e-parte="o-que-e"]');
  const comparacao = el.querySelector('[data-o-que-e-parte="comparacao"]');
  /* R4-b: O MARCADOR «POR CONFIRMAR NA FONTE», onde a conta desta célula sobre a auditoria o põe e em mais lado nenhum:
     um só, ao pé da frase, o marcador da casa com a porta da sua página; o texto da frase lê-se sem ele. */
  const marcas = cabeca.querySelectorAll('[data-por-confirmar-na-fonte]');
  if (porConfirmar.has(id)) {
    const a = marcas.length === 1 ? marcas[0].querySelector('a.marcador.marcador-da-frase') : null;
    if (marcas.length !== 1 || marcas[0].getAttribute('data-por-confirmar-na-fonte') !== id || !marcas[0].closest('[data-o-que-e-parte="o-que-e"]')) {
      falha(`a frase está por confirmar na fonte e o recibo tem ${marcas.length} marcador(es) ao pé dela, e tem um (uma marca em falta)`);
    } else if (!a || a.getAttribute('href') !== (lang === 'pt' ? '/a-verificar' : '/en/to-verify') || normal(a.textContent) !== POR_VERIFICAR) {
      falha('o marcador da frase não é o marcador da casa com a porta da sua página');
    }
  } else if (marcas.length) falha('o recibo tem o marcador «por confirmar na fonte» e a auditoria não o declara (uma marca a mais)');
  const semMarca = (/** @type {any} */ x) => { if (!x) return ''; const c = parse(x.outerHTML); for (const m of c.querySelectorAll('[data-por-confirmar-na-fonte]')) m.remove(); return normal(c.textContent); };
  const rendidoOQueE = semMarca(oQueE);
  /* R4-b: A PARTE DO SINAL, quando a frase lê a metade «o que é» de um cartão contra esta linha e o sinal vive na metade
     que compara: pela conta desta célula, o ramo que o valor da linha escolhe, até ao primeiro pedaço que compara. */
  const sinais = el.querySelectorAll('[data-o-que-e-parte="sinal"]');
  const cartaoDaFamilia = f.tipo === 'familia' ? ctx.familias[f.chave]?.cartao ?? null : null;
  const sinalEsperado = cartaoDaFamilia ? parteDoSinalAqui(cartaoDaFamilia, lang, ctx.linhas.get(id)) : null;
  if (sinalEsperado) {
    if (sinais.length !== 1 || normal(sinais[0].textContent) !== sinalEsperado) falha(`a frase lê o cartão «${cartaoDaFamilia}» e não diz o que o sinal quer dizer, como a conta desta célula manda («${sinalEsperado}»)`);
  } else if (sinais.length) falha('o recibo tem uma parte do sinal que a conta desta célula não dá');
  const rendidoComparacao = comparacao ? normal(comparacao.textContent) : '';
  /* O TEXTO, PELA CONTA DESTA CÉLULA. */
  let esperado = null;
  let esperadaComparacao = '';
  if (f.tipo === 'cartao') {
    const c = cartoes.get(`${lang}:${id}`);
    if (!c) falha('a linha tem cartão e o cartão não se rende em nenhuma página onde esta célula leia a régua dele');
    else {
      /* AS DUAS METADES PELA CONTA DESTA CÉLULA, com a régua do cartão rendido; e, onde o cartão se rende com a
         leitura, as metades do cartão iguais às do recibo: a frase é uma, e é a do cartão (a decisão 1 do brief). */
      const decl = /** @type {any} */ (LEITURAS_DAS_MEDIDAS)[id][lang];
      const corte = corteIndependente(decl);
      try {
        esperado = corte > 0 ? leituraIndependente(id, lang, c.regua, ctx.linhas, [0, corte]).texto : '';
        esperadaComparacao = corte < decl.length ? leituraIndependente(id, lang, c.regua, ctx.linhas, [corte, decl.length]).texto : '';
      } catch (e) {
        falha(`a conta desta célula não recompõe a leitura do cartão: ${e instanceof Error ? e.message : e}`);
      }
      if (c.oQueE !== undefined && (normal(c.oQueE) !== normal(rendidoOQueE) || normal(c.comparacao) !== normal(rendidoComparacao))) {
        falha(`o recibo e o cartão de «${c.pagina}» não dizem a mesma frase`);
      }
    }
  } else if (f.tipo === 'concelho') {
    const m = MEDIDAS_DO_CONCELHO.find((x) => x.chave === f.chave);
    esperado = normal(textoDaFrase(m ? /** @type {any} */ (m.nota)[lang] : ctx.doConcelho[f.chave]?.frase?.[lang]));
  } else {
    const d = ctx.familias[f.chave];
    if (d?.cartao) {
      const decl = /** @type {any} */ (LEITURAS_DAS_MEDIDAS)[d.cartao][lang];
      try {
        esperado = leituraIndependente(d.cartao, lang, { anterior: null, ue: null }, ctx.linhas, [0, corteIndependente(decl)], id).texto;
      } catch (e) {
        falha(`a conta desta célula não recompõe a frase do cartão «${d.cartao}» contra a linha: ${e instanceof Error ? e.message : e}`);
      }
    } else esperado = normal(textoDaFrase(d?.frase?.[lang]));
  }
  if (esperado !== null && rendidoOQueE !== esperado) falha(`a frase rendida não é a que a conta desta célula dá: «${curto(rendidoOQueE)}» contra «${curto(esperado ?? '')}»`);
  if (rendidoComparacao !== esperadaComparacao) falha(`a metade que compara não é a do cartão: «${curto(rendidoComparacao)}» contra «${curto(esperadaComparacao)}»`);
  /* CADA ALGARISMO NUMA MARCA DE ORIGEM; nas frases das famílias, nenhum. */
  const anda = (/** @type {any} */ n) => {
    if (n.nodeType === NodeType.TEXT_NODE) {
      if (/\d/.test(n.text)) {
        let marcado = false;
        for (let p = n.parentNode; p && p !== el.parentNode; p = p.parentNode) {
          const a = p.attributes ?? {};
          if ('data-claim' in a || 'data-nonledger' in a) { marcado = true; break; }
        }
        if (!marcado || f.tipo === 'concelho' || (f.tipo === 'familia' && !ctx.familias[f.chave]?.cartao)) falha(`a frase escreve um algarismo${marcado ? ' numa frase de família' : ' sem marca de origem'}: «${curto(normal(n.text))}»`);
      }
      return;
    }
    for (const x of n.childNodes ?? []) anda(x);
  };
  anda(el);
  /* O TÍTULO: o nome do recibo e, numa medida dos 308, o concelho. */
  const nome = ctx.nomeDoRecibo(id, lang);
  const h1 = cabeca.querySelector('h1');
  const titulo = h1?.querySelector(`[data-de-linha="${id}"]`);
  if (!titulo || normal(titulo.textContent) !== normal(nome.texto ?? '')) falha(`o título não é o nome do recibo da linha («${curto(normal(titulo?.textContent ?? ''))}» contra «${curto(nome.texto ?? '')}»)`);
  const lugar = h1?.querySelector('[data-lugar-da-linha]');
  if (normal(lugar?.textContent ?? '') !== normal(nome.lugar ?? '')) falha(`o título diz o lugar «${normal(lugar?.textContent ?? '')}» e a linha é de «${nome.lugar ?? 'nenhum'}»`);
  return erros;
}

/**
 * A segunda metade, sobre o `dist/`: os recibos de todas as linhas, nas duas edições.
 * @param {string} dist @param {Set<string>} [porConfirmar]  as linhas por confirmar na fonte, pela conta desta célula
 */
export function conferirRecibosDasLinhas(dist, porConfirmar = conferirAuditoriaDasFamilias().porConfirmar) {
  /** @type {string[]} */
  const erros = [];
  const contas = { recibos: 0, com_frase: 0, cartao: 0, concelho: 0, familia: 0, com_marcador: 0, com_sinal: 0 };
  const ctx = contextoDasFamilias();
  const cartoes = reguasDosCartoes(dist);
  if (!cartoes.size) erros.push('K17 · recibos: as páginas de assunto não renderam cartão nenhum, e as frases dos cartões não se conferem');
  for (const id of ctx.linhas.keys()) {
    for (const lang of /** @type {const} */ (['pt', 'en'])) {
      const f = path.join(dist, ...(lang === 'en' ? ['en', 'ledger'] : ['livro-razao']), id, 'index.html');
      if (!fs.existsSync(f)) { erros.push(`K17 · recibo · ${lang} · ${id}: o recibo não está construído`); continue; }
      contas.recibos++;
      const cabeca = cabecaDoRecibo(fs.readFileSync(f, 'utf8'));
      if (!cabeca) { erros.push(`K17 · recibo · ${lang} · ${id}: o recibo não tem cabeça`); continue; }
      const e = conferirCabecaDoRecibo(cabeca, id, lang, { ctx, cartoes, porConfirmar });
      erros.push(...e);
      if (!e.length) {
        contas.com_frase++;
        contas[/** @type {'cartao'|'concelho'|'familia'} */ (ctx.familia(id).tipo)]++;
        if (cabeca.querySelector('[data-por-confirmar-na-fonte]')) contas.com_marcador++;
        if (cabeca.querySelector('[data-o-que-e-parte="sinal"]')) contas.com_sinal++;
      }
    }
  }
  if (contas.recibos === 0) erros.push('K17 · recibos: nenhum recibo lido; a célula não mediu nada');
  return { erros, contas };
}

/* =========================================================================
 * AS SÉRIES NO TEMPO (bloco R4, o ponto 3 do brief): a frase «o que é» de cada série
 * ========================================================================= */

/**
 * A linha de onde vem a frase de uma série, pela regra desta célula: a que o nome da série declara, ou a última linha
 * presa à série pelo campo `serie`, pela ordem do período.
 * @param {string} id @param {Map<string, any>} linhas @param {Record<string, any>} [nomes]
 */
export function linhaDaSerieAqui(id, linhas, nomes = /** @type {Record<string, any>} */ (NOMES_DAS_SERIES)) {
  const d = nomes[id];
  if (d && 'linha' in d) return /** @type {string} */ (d.linha);
  const presas = [...linhas.values()].filter((c) => c.serie === id).sort((a, b) => String(a.reference_date).localeCompare(String(b.reference_date)));
  return presas.length ? presas[presas.length - 1].id : null;
}

const CAMPOS_DA_SERIE_FONTE = new Set(['name', 'unit', 'source', 'document.title', 'document.edition']);
const CAMPOS_DA_SERIE_CASA = new Set(['derivation', 'derivation_en']);
/** @param {any} s @param {string} c */
const campoDaSerieAqui = (s, c) => (c === 'document.title' ? s?.document?.title : c === 'document.edition' ? s?.document?.edition : s?.[c]);

/**
 * A primeira metade, para as séries: cada série no tempo tem a frase da sua linha ou uma frase auditada, nunca as duas;
 * as partes juntas são a frase declarada; cada parte que diz tem apoio, e cada apoio vale no campo da série, na origem
 * ou no nome que o projeto dá à série; nenhum algarismo; as origens da lista são as usadas.
 * @param {{ auditoria?: any, series?: Map<string, any>, frases?: Record<string, any>, linhas?: Map<string, any>, origens?: Record<string, any>, nomes?: Record<string, any> }} [e]
 */
export function conferirAuditoriaDasSeries({
  auditoria = lerAuditoriaDasLeituras(),
  series = lerSeriesDoPortao(),
  frases = /** @type {Record<string, any>} */ (FRASES_DAS_SERIES),
  linhas = loadClaims(),
  origens = /** @type {Record<string, any>} */ (ORIGENS_DAS_DEFINICOES),
  nomes = /** @type {Record<string, any>} */ (NOMES_DAS_SERIES),
  porConfirmarDeclaradas = /** @type {readonly string[]} */ (SERIES_POR_CONFIRMAR_NA_FONTE),
} = {}) {
  /** @type {string[]} */
  const erros = [];
  const contas = { series: 0, pela_linha: 0, propria: 0, partes: 0, apoios: 0, todas_na_fonte: 0, alguma_da_casa: 0, lista_da_casa: /** @type {string[]} */ ([]), por_confirmar: 0 };
  /** As séries com frase própria por confirmar na fonte, pela conta desta célula (R4-b). @type {Set<string>} */
  const porConfirmar = new Set();
  const falha = (/** @type {string} */ m) => erros.push(`K17 · séries · ${m}`);
  const noTempo = [...series.values()].filter((x) => x.eixo === 'periodo');
  const entradas = Array.isArray(auditoria?.series) ? auditoria.series : [];
  if (!noTempo.length) { falha('não há séries no tempo: a célula não mediu nada'); return { erros, contas, porConfirmar }; }
  /** @type {Map<string, any>} */
  const porSerie = new Map();
  for (const e of entradas) {
    if (porSerie.has(e.serie)) falha(`a série «${e.serie}» aparece duas vezes na auditoria`);
    porSerie.set(e.serie, e);
  }
  for (const s of noTempo) {
    contas.series++;
    const linha = linhaDaSerieAqui(s.id, linhas, nomes);
    if (linha) {
      contas.pela_linha++;
      if (!linhas.has(linha)) falha(`«${s.id}»: a linha «${linha}» não está no livro-razão`);
      if (frases[s.id] || porSerie.has(s.id)) falha(`«${s.id}»: tem a linha «${linha}» e uma frase própria; a frase é uma, e é a da linha`);
      continue;
    }
    contas.propria++;
    if (!frases[s.id]) falha(`«${s.id}»: não tem linha nem frase declarada`);
    if (!porSerie.has(s.id)) falha(`«${s.id}»: não tem linha nem frase auditada`);
  }
  for (const id of Object.keys(frases)) if (!noTempo.some((x) => x.id === id)) falha(`a declaração tem a frase de «${id}», que não é uma série no tempo`);
  for (const id of porSerie.keys()) if (!noTempo.some((x) => x.id === id)) falha(`a auditoria tem a frase de «${id}», que não é uma série no tempo`);

  for (const e of entradas) {
    const s = series.get(e.serie);
    const declarada = frases[e.serie]?.frase;
    if (!s || !declarada) continue;
    for (const lang of ['pt', 'en']) for (const p of declarada[lang] ?? []) if (typeof p !== 'string' || /\d/.test(p)) falha(`«${e.serie}» · ${lang}: a frase traz um algarismo ou um pedaço que não é texto`);
    const folha = Array.isArray(e.folhas) && e.folhas.length === 1 ? e.folhas[0] : null;
    const partes = Array.isArray(folha?.partes) ? folha.partes : [];
    const juntas = (/** @type {'pt'|'en'} */ lang) => partes.map((/** @type {any} */ p) => String(p?.[lang] ?? '')).join('');
    if (!folha || juntas('pt') !== textoDaFrase(declarada.pt) || juntas('en') !== textoDaFrase(declarada.en)) {
      falha(`«${e.serie}»: as partes juntas não dão a frase declarada, nas duas edições (uma frase mudada precisa de nova leitura das origens)`);
      continue;
    }
    /** @type {Set<string>} */
    const usadas = new Set();
    let daFonte = true;
    for (const [j, p] of partes.entries()) {
      contas.partes++;
      const qual = `«${e.serie}», parte ${j + 1} («${curto(String(p?.pt))}»)`;
      if (p?.classe === 'liga') {
        for (const lang of ['pt', 'en']) if (String(p[lang] ?? '').replace(PONTUACAO, '') !== '') falha(`${qual}: está marcada como ligação e traz palavras`);
        continue;
      }
      if (p?.classe !== 'diz') { falha(`${qual}: não tem classe (diz ou liga)`); continue; }
      if (!Array.isArray(p.apoios) || !p.apoios.length) { falha(`${qual}: diz o que a série é e não tem apoio nenhum`); daFonte = false; continue; }
      let parteDaFonte = false;
      for (const a of p.apoios) {
        contas.apoios++;
        const literal = a?.literal;
        if (typeof literal !== 'string' || literal.trim().length < LITERAL_MINIMO) { falha(`${qual}: um literal com menos de ${LITERAL_MINIMO} caracteres, que não prende nada`); continue; }
        if (a.origem) {
          usadas.add(a.origem);
          const o = origens[a.origem];
          if (!o) { falha(`${qual}: apoia-se em «${a.origem}», que não está declarada em ORIGENS_DAS_DEFINICOES`); continue; }
          if (!['excerto', 'excertoEn', 'documento', 'publicador'].includes(a.campo) || typeof o[a.campo] !== 'string' || !o[a.campo].includes(literal)) { falha(`${qual}: cita «${curto(literal)}», que não está no campo «${a.campo}» da origem «${a.origem}»`); continue; }
          parteDaFonte = true;
        } else if (a.declaracao === 'nome') {
          const n = nomes[e.serie]?.nome?.[a.lingua];
          if (typeof n !== 'string' || !n.includes(literal)) falha(`${qual}: o nome da série (${a.lingua}) não traz «${curto(literal)}»`);
        } else if (a.serie === 'propria') {
          if (!CAMPOS_DA_SERIE_FONTE.has(a.campo) && !CAMPOS_DA_SERIE_CASA.has(a.campo)) { falha(`${qual}: cita o campo «${a.campo}» da série, que não pode apoiar`); continue; }
          const v = campoDaSerieAqui(s, a.campo);
          if (typeof v !== 'string' || !v.includes(literal)) { falha(`${qual}: cita «${curto(literal)}», que não está no campo «${a.campo}» da série`); continue; }
          if (CAMPOS_DA_SERIE_FONTE.has(a.campo)) parteDaFonte = true;
        } else falha(`${qual}: um apoio sem origem, campo da série nem nome`);
      }
      if (!parteDaFonte) daFonte = false;
    }
    const declaradas = new Set(e.origens ?? []);
    for (const o of declaradas) if (!usadas.has(o)) falha(`«${e.serie}»: a origem «${o}» está na lista e não apoia parte nenhuma`);
    for (const o of usadas) if (!declaradas.has(o)) falha(`«${e.serie}»: a origem «${o}» apoia uma parte e não está na lista`);
    if (daFonte) contas.todas_na_fonte++; else { contas.alguma_da_casa++; contas.lista_da_casa.push(e.serie); }
    /* R4-b: por confirmar na fonte quando uma parte que diz não tem apoio da fonte nem da conta declarada da série. */
    const confirma = (/** @type {any} */ a) => Boolean(a?.origem || (a?.serie === 'propria' && (CAMPOS_DA_SERIE_FONTE.has(a.campo) || CAMPOS_DA_SERIE_CASA.has(a.campo))));
    const por = partes.some((/** @type {any} */ p) => p?.classe === 'diz' && !(p.apoios ?? []).some(confirma));
    if (por !== (e.por_confirmar_na_fonte === true)) falha(`«${e.serie}»: a auditoria diz «por confirmar na fonte» ${JSON.stringify(e.por_confirmar_na_fonte ?? null)}, e a conta desta célula dá ${por}`);
    if (por) { porConfirmar.add(e.serie); contas.por_confirmar++; }
  }
  const declaradas = new Set(porConfirmarDeclaradas);
  for (const id of porConfirmar) if (!declaradas.has(id)) falha(`a série «${id}» está por confirmar na fonte pela auditoria e não está na lista que o resolvedor lê (uma marca em falta)`);
  for (const id of declaradas) if (!porConfirmar.has(id)) falha(`a série «${id}» está na lista das frases por confirmar e a auditoria não a declara (uma marca a mais)`);
  return { erros, contas, porConfirmar };
}

/** O texto de um elemento sem as portas dos selos. @param {any} el */
const textoSemSelos = (el) => {
  const c = parse(el.outerHTML);
  for (const a of c.querySelectorAll('a.src-chip')) a.remove();
  return normal(c.textContent);
};

/**
 * A frase «o que é» de uma linha, pela conta desta célula, sem a metade que compara (a da série não a leva).
 * @param {string} id @param {'pt'|'en'} lang @param {ReturnType<typeof contextoDasFamilias>} ctx
 */
function oQueEDaLinhaAqui(id, lang, ctx) {
  const f = ctx.familia(id);
  const cartao = f.tipo === 'cartao' ? id : f.tipo === 'familia' ? ctx.familias[f.chave]?.cartao ?? null : null;
  if (cartao) {
    const decl = /** @type {any} */ (LEITURAS_DAS_MEDIDAS)[cartao][lang];
    return leituraIndependente(cartao, lang, { anterior: null, ue: null }, ctx.linhas, [0, corteIndependente(decl)], id).texto;
  }
  if (f.tipo === 'concelho') {
    const m = MEDIDAS_DO_CONCELHO.find((x) => x.chave === f.chave);
    return normal(textoDaFrase(m ? /** @type {any} */ (m.nota)[lang] : ctx.doConcelho[f.chave]?.frase?.[lang]));
  }
  return normal(textoDaFrase(ctx.familias[f.chave]?.frase?.[lang]));
}

/**
 * Um recibo de série, conferido: uma frase «o que é», da série, na cabeça, com a origem e a linha que esta célula dá,
 * e o texto que ela recompõe. Separado para as plantas.
 * @param {import('node-html-parser').HTMLElement} root @param {any} s @param {'pt'|'en'} lang
 * @param {{ ctx: ReturnType<typeof contextoDasFamilias>, frases?: Record<string, any>, porConfirmarLinhas?: Set<string>, porConfirmarSeries?: Set<string> }} e
 */
export function conferirFraseDaSerie(root, s, lang, { ctx, frases = /** @type {Record<string, any>} */ (FRASES_DAS_SERIES), porConfirmarLinhas = new Set(), porConfirmarSeries = new Set() }) {
  /** @type {string[]} */
  const erros = [];
  const falha = (/** @type {string} */ m) => erros.push(`K17 · recibo da série · ${lang} · ${s.id}: ${m}`);
  const todas = root.querySelectorAll('[data-o-que-e-da-serie]');
  if (todas.length !== 1) { falha(`o recibo tem ${todas.length} frase(s) «o que é», e tem uma`); return erros; }
  const el = todas[0];
  if (el.getAttribute('data-o-que-e-da-serie') !== s.id) falha(`a frase diz ser de «${el.getAttribute('data-o-que-e-da-serie')}»`);
  if (!el.closest('.linha-cabeca')) falha('a frase está fora da cabeça do recibo');
  const linha = linhaDaSerieAqui(s.id, ctx.linhas);
  const origem = linha ? 'linha' : 'serie';
  if (el.getAttribute('data-o-que-e-origem') !== origem || (el.getAttribute('data-o-que-e-linha') ?? null) !== linha) {
    falha(`a frase diz vir de «${el.getAttribute('data-o-que-e-origem')}:${el.getAttribute('data-o-que-e-linha') ?? ''}», e vem de «${origem}:${linha ?? ''}»`);
  }
  const frase = el.querySelector('.linha-o-que-e-frase');
  /* R4-b: O MARCADOR «POR CONFIRMAR NA FONTE», pela conta desta célula: o da linha, quando a frase é a dela; o da série,
     quando a frase é a escrita para ela. Um só, ao pé da frase, e em mais lado nenhum. */
  const deve = linha ? porConfirmarLinhas.has(linha) : porConfirmarSeries.has(s.id);
  const marcas = el.querySelectorAll('[data-por-confirmar-na-fonte]');
  if (deve) {
    const a = marcas.length === 1 ? marcas[0].querySelector('a.marcador.marcador-da-frase') : null;
    if (marcas.length !== 1 || marcas[0].getAttribute('data-por-confirmar-na-fonte') !== s.id || !a || a.getAttribute('href') !== (lang === 'pt' ? '/a-verificar' : '/en/to-verify') || normal(a.textContent) !== POR_VERIFICAR) {
      falha(`a frase está por confirmar na fonte e o recibo não tem o marcador da casa ao pé dela (uma marca em falta)`);
    }
  } else if (marcas.length) falha('o recibo tem o marcador «por confirmar na fonte» e a auditoria não o declara (uma marca a mais)');
  /* R4-b: UMA PORTA SÓ. O valor da linha diz-se pelo ponto da série quando a série tem o ponto do período da linha com o
     mesmo valor, e então a frase não tem selo nenhum; um selo que abra o recibo de uma linha que a lista das linhas da
     série já abre é a segunda porta para o mesmo sítio que a L1 conta. */
  const daLista = new Set(root.querySelectorAll('[data-linha-da-serie] a[href]').map((a) => a.getAttribute('href')));
  for (const a of el.querySelectorAll('a.src-chip')) if (daLista.has(a.getAttribute('href'))) falha(`o selo da frase abre «${a.getAttribute('href')}», que a lista das linhas da série já abre: duas portas para o mesmo sítio`);
  if (linha) {
    const l = ctx.linhas.get(linha);
    const ponto = (s.pontos ?? []).find((/** @type {any} */ p) => String(p.periodo) === String(l?.reference_date) && String(p.valor) === String(l?.value));
    /* Uma frase de família não diz valor nenhum; a de um cartão diz o da linha, e então tem de o dizer pelo ponto. */
    if (ponto && el.querySelector(`[data-claim="${linha}"]`)) {
      falha(`a série tem o ponto ${ponto.periodo} com o valor da linha, e a frase diz o valor pela linha, com o selo, em vez de o dizer pelo ponto da série`);
    }
  }
  const semMarca = frase ? (() => { const c = parse(frase.outerHTML); for (const m of c.querySelectorAll('[data-por-confirmar-na-fonte]')) m.remove(); return c; })() : null;
  const rendido = semMarca ? textoSemSelos(semMarca) : '';
  let esperado = null;
  try {
    esperado = linha ? oQueEDaLinhaAqui(linha, lang, ctx) : normal(textoDaFrase(frases[s.id]?.frase?.[lang]));
  } catch (e) {
    falha(`a conta desta célula não recompõe a frase: ${e instanceof Error ? e.message : e}`);
  }
  if (esperado !== null && rendido !== esperado) falha(`a frase rendida não é a que a conta desta célula dá: «${curto(rendido)}» contra «${curto(esperado)}»`);
  if (!esperado) falha('a frase está vazia');
  return erros;
}

/**
 * A segunda metade, para as séries: os recibos das séries no tempo, nas duas edições.
 * @param {string} dist @param {Set<string>} [porConfirmarLinhas] @param {Set<string>} [porConfirmarSeries]
 */
export function conferirRecibosDasSeries(dist, porConfirmarLinhas = conferirAuditoriaDasFamilias().porConfirmar, porConfirmarSeries = conferirAuditoriaDasSeries().porConfirmar) {
  /** @type {string[]} */
  const erros = [];
  const contas = { recibos: 0, com_frase: 0, com_marcador: 0 };
  const ctx = contextoDasFamilias();
  for (const s of [...lerSeriesDoPortao().values()].filter((x) => x.eixo === 'periodo')) {
    for (const lang of /** @type {const} */ (['pt', 'en'])) {
      const f = path.join(dist, ...(lang === 'en' ? ['en', 'ledger', 'series'] : ['livro-razao', 'series']), s.id, 'index.html');
      if (!fs.existsSync(f)) { erros.push(`K17 · recibo da série · ${lang} · ${s.id}: o recibo não está construído`); continue; }
      contas.recibos++;
      const root = parse(fs.readFileSync(f, 'utf8'));
      const e = conferirFraseDaSerie(root, s, lang, { ctx, porConfirmarLinhas, porConfirmarSeries });
      erros.push(...e);
      if (!e.length) { contas.com_frase++; if (root.querySelector('[data-o-que-e-da-serie] [data-por-confirmar-na-fonte]')) contas.com_marcador++; }
    }
  }
  if (!contas.recibos) erros.push('K17 · recibos das séries: nenhum recibo lido; a célula não mediu nada');
  return { erros, contas };
}

/* =========================================================================
 * AS PLANTAS, todas em memória
 * ========================================================================= */

/** @param {string} dist @returns {{ nome: string, mordeu: boolean, queixa: string|null }[]} */
export function plantasDasFamilias(dist) {
  /** @type {{ nome: string, mordeu: boolean, queixa: string|null }[]} */
  const out = [];
  const regista = (/** @type {string} */ nome, /** @type {string[]} */ erros, /** @type {string} */ mordida) => {
    const q = erros.find((e) => e.includes(mordida)) ?? null;
    out.push({ nome, mordeu: q !== null, queixa: q ?? erros[0] ?? null });
  };
  const base = lerAuditoriaDasLeituras();
  const linhas = loadClaims();
  /* 1 · UMA LINHA SEM FRASE: uma linha nova no livro, de uma família que ninguém declarou. */
  {
    const l = new Map(linhas);
    l.set('planta-r4-uma-linha-sem-frase-2025', { ...structuredClone(linhas.get('credito-malparado-2025')), id: 'planta-r4-uma-linha-sem-frase-2025' });
    regista('uma linha sem frase', conferirAuditoriaDasFamilias({ auditoria: base, linhas: l }).erros, 'não tem frase declarada');
  }
  /* 2 · UMA FRASE COM UM ALGARISMO, na declaração de uma família. */
  {
    const fam = structuredClone(FAMILIAS_DAS_LINHAS);
    fam['credito-malparado'].frase.pt = [fam['credito-malparado'].frase.pt[0].replace('em percentagem', 'em 2025, em percentagem')];
    regista('uma frase com um algarismo', conferirAuditoriaDasFamilias({ auditoria: base, familias: fam }).erros, 'traz um algarismo');
  }
  /* 3 · UMA FRASE MUDADA SEM NOVA AUDITORIA. */
  {
    const fam = structuredClone(FAMILIAS_DAS_LINHAS);
    fam['credito-malparado'].frase.pt = [fam['credito-malparado'].frase.pt[0].replace('como combinado', 'a tempo')];
    regista('uma frase mudada sem nova auditoria', conferirAuditoriaDasFamilias({ auditoria: base, familias: fam }).erros, 'as partes juntas não dão a frase declarada');
  }
  /* 4 · UM LITERAL QUE A LINHA NÃO TEM. */
  {
    const a = structuredClone(base);
    const e = a.familias.find((/** @type {any} */ x) => x.chaves?.includes('credito-malparado'));
    e.folhas[0].partes[0].apoios[0].literal = 'Gross performing loans';
    regista('um literal que a linha não tem', conferirAuditoriaDasFamilias({ auditoria: a }).erros, 'que não está no campo');
  }
  /* 5 · UMA FAMÍLIA SEM AUDITORIA. */
  {
    const a = structuredClone(base);
    a.familias = a.familias.filter((/** @type {any} */ x) => !x.chaves?.includes('credito-malparado'));
    regista('uma família sem auditoria', conferirAuditoriaDasFamilias({ auditoria: a }).erros, 'não tem frase auditada');
  }
  /* 6 · A FRASE DO CARTÃO NUMA LINHA ONDE O APOIO FALHA: o ano anterior da taxa de emprego sem a classe etária. */
  {
    const l = new Map(linhas);
    const x = structuredClone(linhas.get('taxa-de-emprego-2024'));
    x.excerpt = x.excerpt.replace('From 20 to 64 years', 'From 15 to 74 years');
    l.set('taxa-de-emprego-2024', x);
    regista('a frase do cartão numa linha onde o apoio falha', conferirAuditoriaDasFamilias({ auditoria: base, linhas: l }).erros, 'a frase do cartão «taxa-de-emprego-2025»');
  }
  /* 7 · UMA PARTE QUE DIZ SEM APOIO. */
  {
    const a = structuredClone(base);
    const e = a.familias.find((/** @type {any} */ x) => x.concelho === 'limite');
    e.folhas[0].partes[0].apoios = [];
    regista('uma parte que diz sem apoio', conferirAuditoriaDasFamilias({ auditoria: a }).erros, 'não tem apoio nenhum');
  }
  /* R4-b · A AUDITORIA DO QUE ESTÁ POR CONFIRMAR NA FONTE. */
  {
    const declaradas = [...LINHAS_POR_CONFIRMAR_NA_FONTE].filter((x) => x !== 'funchal-desemprego-registado-2025-12');
    regista('a lista do resolvedor sem uma linha por confirmar', conferirAuditoriaDasFamilias({ auditoria: base, porConfirmarDeclaradas: declaradas }).erros, 'não está na lista que o resolvedor lê');
  }
  {
    const a = structuredClone(base);
    const e = a.familias.find((/** @type {any} */ x) => x.chaves?.includes('agua-nao-faturada-portugal'));
    delete e.por_confirmar_na_fonte;
    regista('a auditoria a dar como confirmada uma frase por confirmar', conferirAuditoriaDasFamilias({ auditoria: a }).erros, 'a auditoria diz «por confirmar na fonte» null');
  }
  /* A SEGUNDA METADE, sobre cópias de recibos em memória. */
  const ctx = contextoDasFamilias();
  const cartoes = reguasDosCartoes(dist);
  const porConfirmarAqui = conferirAuditoriaDasFamilias().porConfirmar;
  const porConfirmarSeriesAqui = conferirAuditoriaDasSeries().porConfirmar;
  const recibo = (/** @type {string} */ id, /** @type {'pt'|'en'} */ lang) => cabecaDoRecibo(fs.readFileSync(path.join(dist, ...(lang === 'en' ? ['en', 'ledger'] : ['livro-razao']), id, 'index.html'), 'utf8'));
  const conferir = (/** @type {any} */ c, /** @type {string} */ id, /** @type {'pt'|'en'} */ lang) => conferirCabecaDoRecibo(c, id, lang, { ctx, cartoes, porConfirmar: porConfirmarAqui });
  {
    const c = /** @type {any} */ (recibo('abrantes-populacao-2025', 'pt'));
    c.querySelector('[data-o-que-e-parte="o-que-e"]').insertAdjacentHTML('beforeend', '<span class="linha-por-confirmar" data-por-confirmar-na-fonte="abrantes-populacao-2025"> <a class="marcador marcador-da-frase" href="/a-verificar" lang="pt-PT">[a verificar]</a></span>');
    regista('uma marca a mais num recibo', conferir(c, 'abrantes-populacao-2025', 'pt'), 'uma marca a mais');
  }
  {
    const c = /** @type {any} */ (recibo('funchal-desemprego-registado-2025-12', 'en'));
    c.querySelector('[data-por-confirmar-na-fonte]').remove();
    regista('uma marca em falta num recibo', conferir(c, 'funchal-desemprego-registado-2025-12', 'en'), 'uma marca em falta');
  }
  {
    const c = /** @type {any} */ (recibo('posicao-de-investimento-internacional-2024', 'pt'));
    c.querySelector('[data-o-que-e-parte="sinal"]').remove();
    regista('a parte do sinal tirada do recibo do ano anterior', conferir(c, 'posicao-de-investimento-internacional-2024', 'pt'), 'não diz o que o sinal quer dizer');
  }
  {
    const c = /** @type {any} */ (recibo('abrantes-populacao-2025', 'pt'));
    c.querySelector('[data-o-que-e]').remove();
    regista('um recibo sem a frase', conferir(c, 'abrantes-populacao-2025', 'pt'), 'frase(s) «O que é este número»');
  }
  {
    const c = /** @type {any} */ (recibo('abrantes-populacao-2025', 'pt'));
    c.querySelector('[data-o-que-e-parte="o-que-e"]').set_content(normal(textoDaFrase(MEDIDAS_DO_CONCELHO.find((m) => m.chave === 'empresas')?.nota.pt)));
    regista('a frase de outra medida no recibo', conferir(c, 'abrantes-populacao-2025', 'pt'), 'a frase rendida não é a que a conta desta célula dá');
  }
  {
    const c = /** @type {any} */ (recibo('credito-malparado-2025', 'pt'));
    c.querySelector('[data-o-que-e-parte="o-que-e"]').insertAdjacentHTML('beforeend', ' Em 2025 subiu.');
    regista('um algarismo escrito à mão na frase de uma família', conferir(c, 'credito-malparado-2025', 'pt'), 'escreve um algarismo');
  }
  {
    const c = /** @type {any} */ (recibo('posicao-de-investimento-internacional-2025', 'pt'));
    const k = c.querySelector('[data-o-que-e-parte="comparacao"]');
    k.set_content(k.innerHTML.replace('encolheu face a', 'cresceu face a'));
    regista('a metade que compara trocada no recibo de um cartão', conferir(c, 'posicao-de-investimento-internacional-2025', 'pt'), 'a metade que compara não é a do cartão');
  }
  {
    const c = /** @type {any} */ (recibo('abrantes-populacao-2025', 'pt'));
    c.querySelector('[data-lugar-da-linha]').set_content('Viseu');
    regista('o concelho trocado no título', conferir(c, 'abrantes-populacao-2025', 'pt'), 'o título diz o lugar');
  }
  /* AS SÉRIES: a auditoria e os recibos. */
  {
    const frases = structuredClone(/** @type {Record<string, any>} */ (FRASES_DAS_SERIES));
    delete frases['serie-ipc-indice'];
    const a = structuredClone(base);
    a.series = a.series.filter((/** @type {any} */ x) => x.serie !== 'serie-ipc-indice');
    regista('uma série sem frase', conferirAuditoriaDasSeries({ auditoria: a, frases }).erros, 'não tem linha nem frase declarada');
  }
  {
    const frases = structuredClone(/** @type {Record<string, any>} */ (FRASES_DAS_SERIES));
    frases['serie-ipc-indice'].frase.pt = [frases['serie-ipc-indice'].frase.pt[0].replace('mês a mês', 'semana a semana')];
    regista('a frase de uma série mudada sem nova auditoria', conferirAuditoriaDasSeries({ frases }).erros, 'as partes juntas não dão a frase declarada');
  }
  {
    const a = structuredClone(base);
    const e = a.series.find((/** @type {any} */ x) => x.serie === 'serie-ipc-indice');
    const p = e.folhas[0].partes.find((/** @type {any} */ x) => x.apoios?.some((/** @type {any} */ y) => y.serie === 'propria' && y.campo === 'name' && y.literal === '; Mensal - INE'));
    p.apoios.find((/** @type {any} */ y) => y.literal === '; Mensal - INE').literal = '; Semanal - INE';
    regista('um literal que o campo da série não tem', conferirAuditoriaDasSeries({ auditoria: a }).erros, 'que não está no campo «name» da série');
  }
  const conjuntos = { porConfirmarLinhas: porConfirmarAqui, porConfirmarSeries: porConfirmarSeriesAqui };
  const reciboDaSerie = (/** @type {string} */ id, /** @type {'pt'|'en'} */ lang) => parse(fs.readFileSync(path.join(dist, ...(lang === 'en' ? ['en', 'ledger', 'series'] : ['livro-razao', 'series']), id, 'index.html'), 'utf8'));
  {
    const s = lerSeriesDoPortao().get('serie-ipc-rendas-variacao-homologa');
    const root = reciboDaSerie(s.id, 'pt');
    root.querySelector('[data-o-que-e-da-serie]')?.remove();
    regista('um recibo de série sem a frase', conferirFraseDaSerie(root, s, 'pt', { ctx, ...conjuntos }), 'frase(s) «o que é»');
  }
  {
    const s = lerSeriesDoPortao().get('serie-ipc-indice');
    const root = reciboDaSerie(s.id, 'en');
    root.querySelector('[data-o-que-e-da-serie] .linha-o-que-e-frase')?.set_content(textoDaFrase(/** @type {any} */ (FRASES_DAS_SERIES)['serie-ipc-indice-anual'].frase.en));
    regista('a frase de outra série no recibo', conferirFraseDaSerie(root, s, 'en', { ctx, ...conjuntos }), 'a frase rendida não é a que a conta desta célula dá');
  }
  /* R4-b · AS SÉRIES: o marcador a mais e em falta, e a segunda porta de volta. */
  {
    const s = lerSeriesDoPortao().get('serie-ipc-indice');
    const root = reciboDaSerie(s.id, 'pt');
    root.querySelector('[data-o-que-e-da-serie] .linha-o-que-e-frase')?.insertAdjacentHTML('beforeend', '<span class="linha-por-confirmar" data-por-confirmar-na-fonte="serie-ipc-indice"> <a class="marcador marcador-da-frase" href="/a-verificar" lang="pt-PT">[a verificar]</a></span>');
    regista('uma marca a mais num recibo de série', conferirFraseDaSerie(root, s, 'pt', { ctx, ...conjuntos }), 'uma marca a mais');
  }
  {
    const s = lerSeriesDoPortao().get('serie-ihpc-rendas-variacao-homologa');
    const root = reciboDaSerie(s.id, 'en');
    root.querySelector('[data-o-que-e-da-serie] [data-por-confirmar-na-fonte]')?.remove();
    regista('uma marca em falta num recibo de série', conferirFraseDaSerie(root, s, 'en', { ctx, ...conjuntos }), 'uma marca em falta');
  }
  {
    const s = lerSeriesDoPortao().get('serie-ipc-rendas-variacao-homologa');
    const root = reciboDaSerie(s.id, 'pt');
    const porta = root.querySelector('[data-linha-da-serie] a[href]')?.getAttribute('href');
    root.querySelector('[data-o-que-e-da-serie] .linha-o-que-e-frase')?.insertAdjacentHTML('beforeend', `<a class="src-chip" href="${porta}">fonte</a>`);
    regista('o selo de volta na frase de uma série, com a porta que a lista já tem', conferirFraseDaSerie(root, s, 'pt', { ctx, ...conjuntos }), 'duas portas para o mesmo sítio');
  }
  return out;
}
