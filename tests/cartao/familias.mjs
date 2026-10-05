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

import { FAMILIAS_DAS_LINHAS, FAMILIAS_DOS_CONCELHOS } from '../../src/data/o-que-e-das-familias.mjs';
import { MEDIDAS_DO_CONCELHO } from '../../src/data/concelhos.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../../src/data/municipios.mjs';
import { LEITURAS_DAS_MEDIDAS } from '../../src/data/leituras-das-medidas.mjs';
import { ORIGENS_DAS_DEFINICOES, FIGURAS } from '../../src/data/figuras.mjs';
import { MEDIDAS_DO_DOMINIO_1 } from '../../src/data/dominios.mjs';
import { NOMES_DO_PROJETO, NOMES_DAS_LINHAS_DERIVADAS } from '../../src/data/nomes-das-medidas.mjs';
import { TERMOS_DOS_CARTOES } from '../../src/data/termos-dos-cartoes.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';
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
} = {}) {
  /** @type {string[]} */
  const erros = [];
  const contas = { linhas: 0, por_cartao: 0, por_concelho: 0, por_familia: 0, familias: 0, entradas: 0, partes: 0, diz: 0, apoios: 0, todas_na_fonte: 0, alguma_da_casa: 0 };
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
  if (!entradas.length) { falha('a auditoria não tem a chave «familias»: a célula não mediu nada'); return { erros, contas }; }
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
    if (todasNaFonte) contas.todas_na_fonte++; else contas.alguma_da_casa++;
  }
  return { erros, contas };
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
 * @param {{ ctx: ReturnType<typeof contextoDasFamilias>, cartoes: ReturnType<typeof reguasDosCartoes> }} e
 */
export function conferirCabecaDoRecibo(cabeca, id, lang, { ctx, cartoes }) {
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
  const rendidoOQueE = oQueE ? normal(oQueE.textContent) : '';
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

/** A segunda metade, sobre o `dist/`: os recibos de todas as linhas, nas duas edições. @param {string} dist */
export function conferirRecibosDasLinhas(dist) {
  /** @type {string[]} */
  const erros = [];
  const contas = { recibos: 0, com_frase: 0, cartao: 0, concelho: 0, familia: 0 };
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
      const e = conferirCabecaDoRecibo(cabeca, id, lang, { ctx, cartoes });
      erros.push(...e);
      if (!e.length) { contas.com_frase++; contas[/** @type {'cartao'|'concelho'|'familia'} */ (ctx.familia(id).tipo)]++; }
    }
  }
  if (contas.recibos === 0) erros.push('K17 · recibos: nenhum recibo lido; a célula não mediu nada');
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
  /* A SEGUNDA METADE, sobre cópias de recibos em memória. */
  const ctx = contextoDasFamilias();
  const cartoes = reguasDosCartoes(dist);
  const recibo = (/** @type {string} */ id, /** @type {'pt'|'en'} */ lang) => cabecaDoRecibo(fs.readFileSync(path.join(dist, ...(lang === 'en' ? ['en', 'ledger'] : ['livro-razao']), id, 'index.html'), 'utf8'));
  const conferir = (/** @type {any} */ c, /** @type {string} */ id, /** @type {'pt'|'en'} */ lang) => conferirCabecaDoRecibo(c, id, lang, { ctx, cartoes });
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
  return out;
}
