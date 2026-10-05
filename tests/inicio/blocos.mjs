#!/usr/bin/env node
import { conferirSerieDoBloco } from './serie-do-bloco.mjs';
/**
 * =============================================================================
 * A PRIMEIRA PÁGINA DE UM LEITOR COMUM · OS BLOCOS, AUDITADOS E RECONTADOS · bloco PP1 (28.09.2026)
 * =============================================================================
 *
 * PORQUE EXISTE. Os cinco blocos de «O que se passa» são frases do lugar de direção com números da
 * máquina, e cada bloco sai sozinho da página quando os valores deixam de lhe dar razão. É o sítio
 * onde uma palavra sem origem entra com mais facilidade, onde um ramo trocado diz o contrário do
 * valor sem que um algarismo mude, e onde um bloco podia ficar na página por cima de números que já
 * não o sustentam. Esta célula existe para as três coisas, e segue a forma da K17 do `check:cartao`
 * (`tests/cartao/leituras.mjs`).
 *
 * A PRIMEIRA METADE NÃO LÊ `dist/` (`conferirAuditoriaDosBlocos`): confere a auditoria
 * (`tests/inicio/blocos-provados.json`) contra a declaração (`src/data/primeira-pagina.mjs`), as
 * origens (`ORIGENS_DAS_DEFINICOES`) e o livro-razão. Cada folha de palavras fixas de cada bloco, nas
 * duas edições, tem a sua auditoria; as partes juntas são a folha; uma parte «diz» apoia-se num
 * literal que está mesmo no campo que cita; uma parte «conta» vive num ramo que os valores escolhem ou
 * está guardada por condições declaradas do seu bloco ou da sua peça, que são comparações; uma parte
 * «liga» é pontuação e palavras da lista fechada; cada algarismo declarado tem um literal que o traz e
 * um motivo de `ledger/allowlist.yml`; cada origem listada apoia alguma parte, e nenhuma parte usa uma
 * origem que a lista não tenha. E o detetor de autorreferência da voz (`scripts/voz.mjs`, os
 * marcadores de `VOZ-MARCADORES.md`) corre sobre TODAS as palavras declaradas, em todos os ramos: é a
 * proteção que a régua da voz dava às frases da casa, e passa a ser dada aqui, antes de se render.
 *
 * A SEGUNDA METADE LÊ AS PÁGINAS CONSTRUÍDAS (`conferirBlocosDaPagina`): ver o cabeçalho dela.
 *
 * O QUE NÃO CONFERE, e di-lo: não infere que o literal quer dizer o que a parte diz. Essa escolha é
 * uma leitura, de quem assina a auditoria, e é essa leitura que a leitura a frio relê.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { parse, NodeType } from 'node-html-parser';

import { BLOCOS_DA_PRIMEIRA_PAGINA, ENTRADAS } from '../../src/data/primeira-pagina.mjs';
import { ORIGENS_DAS_DEFINICOES } from '../../src/data/figuras.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { blocoResolvido, textoDosPedacos, idsDosBlocos } from '../../src/lib/primeira-pagina.mjs';
import { leMarcadores, analisa } from '../../scripts/voz.mjs';
import { t } from '../../src/i18n/strings.mjs';
import { folhasDoBloco } from './folhas-dos-blocos.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
export const AUDITORIA_DOS_BLOCOS = path.join(AQUI, 'blocos-provados.json');

/** Os campos de uma origem que podem apoiar uma parte. */
const CAMPOS_DA_ORIGEM = new Set(['excerto', 'excertoEn', 'documento', 'publicador']);
/** Os campos selados de uma linha que podem apoiar uma parte. */
const CAMPOS_DA_LINHA = new Set(['excerpt', 'unit', 'document.title', 'document.locator']);
/* UM LITERAL DE MENOS DE QUATRO CARACTERES NÃO PRENDE NADA, a regra da K16 e da K17. */
const LITERAL_MINIMO = 4;
/* AS PALAVRAS DE LIGAÇÃO DOS BLOCOS, uma lista fechada. É a da K17 com as preposições e as cópulas que
   ligam dois pedaços calculados sem dizer o que uma medida é e sem comparar nada («de 2024 para 2025»,
   «passou de … para …», «23,78 % contra 3,2 %», «estavam»). Uma palavra que diga alguma coisa não é
   ligação, e uma comparação («maior», «acima», «subiram») é conta, com a sua guarda. */
const PALAVRAS_DE_LIGACAO = {
  pt: new Set(['no', 'na', 'em', 'aos', 'e', 'os', 'de', 'do', 'da', 'para', 'a', 'o', 'mas', 'contra', 'estavam', 'passou']),
  en: new Set(['in', 'to', 'and', 'the', 'from', 'of', 'a', 'but', 'against', 'was', 'went']),
};
const PONTUACAO = /[\s.,:;()−%’'!?]+/g;

/** @param {string} [ficheiro] */
export function lerAuditoriaDosBlocos(ficheiro = AUDITORIA_DOS_BLOCOS) {
  return JSON.parse(fs.readFileSync(ficheiro, 'utf8'));
}
/** @param {string} s */
const curto = (s) => (s.length > 60 ? `${s.slice(0, 57)}…` : s);
/** Os espaços todos colapsados num só. @param {unknown} s */
export const normal = (s) => String(s ?? '').replace(/[\s   ]+/g, ' ').trim();

/** @param {any} linha @param {string} campo */
const campoDaLinha = (linha, campo) =>
  campo === 'document.title' ? linha?.document?.title : campo === 'document.locator' ? linha?.document?.locator : linha?.[campo];

/** As linhas que um bloco declarado nomeia, em qualquer sítio da declaração. @param {any} b */
export function linhasDeclaradasDoBloco(b) {
  /** @type {Set<string>} */
  const ids = new Set();
  const anda = (/** @type {any} */ x) => {
    if (Array.isArray(x)) { x.forEach(anda); return; }
    if (!x || typeof x !== 'object') return;
    for (const k of ['claim', 'periodo', 'publicado', 'referencia', 'a', 'b', 'pt', 'ue', 'total']) if (typeof x[k] === 'string' && /-/.test(x[k])) ids.add(x[k]);
    for (const k of ['compara', 'mesmo_periodo', 'linhas', 'colunas']) if (Array.isArray(x[k])) for (const id of x[k]) if (typeof id === 'string') ids.add(id);
    for (const [k, v] of Object.entries(x)) if (typeof v === 'object' && !['compara', 'mesmo_periodo', 'linhas', 'colunas'].includes(k)) anda(v);
  };
  anda({ frase: b.frase, condicao: b.condicao, desenho: b.desenho, pecas: b.pecas });
  return ids;
}

/** Os motivos declarados em `ledger/allowlist.yml`. */
function motivosDeclarados() {
  const y = load(fs.readFileSync(path.join(RAIZ, 'ledger', 'allowlist.yml'), 'utf8'));
  return new Set((/** @type {any} */ (y)?.contexts ?? []).map((/** @type {any} */ c) => c.id));
}

/**
 * A PRIMEIRA METADE: a auditoria contra a declaração, as origens e as linhas.
 *
 * @param {{ auditoria?: any, blocos?: any[], origens?: Record<string, any>, linhas?: Map<string, any> }} [entrada]
 */
export function conferirAuditoriaDosBlocos({
  auditoria = lerAuditoriaDosBlocos(),
  blocos = /** @type {any[]} */ (BLOCOS_DA_PRIMEIRA_PAGINA),
  origens = /** @type {Record<string, any>} */ (ORIGENS_DAS_DEFINICOES),
  linhas = loadClaims(),
} = {}) {
  /** @type {string[]} */
  const erros = [];
  const contas = { blocos: 0, folhas: 0, partes: 0, diz: 0, conta: 0, liga: 0, apoios: 0, algarismos: 0, origens: 0, marcadores_corridos: 0 };
  /** @param {string} id @param {string} m */
  const falha = (id, m) => erros.push(`PP1 · ${id}: ${m}`);
  const lista = auditoria?.blocos;
  if (!Array.isArray(lista) || lista.length === 0) {
    erros.push('PP1 · a auditoria dos blocos não tem bloco nenhum: a célula não mediu nada');
    return { erros, contas };
  }
  /** @type {Map<string, any>} */
  const porBloco = new Map();
  for (const a of lista) {
    if (porBloco.has(a?.id)) falha(a?.id, 'aparece duas vezes na auditoria');
    porBloco.set(a?.id, a);
  }
  for (const b of blocos) if (!porBloco.has(b.id)) falha(b.id, 'o bloco declarado não tem auditoria');
  for (const id of porBloco.keys()) if (!blocos.some((b) => b.id === id)) falha(id, 'a auditoria fala de um bloco que a declaração não tem');

  const motivos = motivosDeclarados();
  const voz = leMarcadores(RAIZ);
  for (const e of voz.erros) erros.push(`PP1 · os marcadores da voz: ${e}`);
  if (!voz.marcadores.length) erros.push('PP1 · os marcadores da voz não se leram: o detetor de autorreferência não corre');

  for (const b of blocos) {
    const a = porBloco.get(b.id);
    if (!a) continue;
    contas.blocos++;
    const doBloco = linhasDeclaradasDoBloco(b);
    /** @type {Set<string>} */
    const usadas = new Set();
    const declaradas = new Set(a.origens ?? []);
    /** @param {any} ap @param {string} qual @param {string|null} [algarismo] */
    const apoio = (ap, qual, algarismo = null) => {
      contas.apoios++;
      const literal = ap?.literal;
      if (typeof literal !== 'string' || literal.trim().length < LITERAL_MINIMO) return falha(b.id, `${qual} cita um literal com menos de ${LITERAL_MINIMO} caracteres, que não prende nada`);
      if (algarismo !== null) {
        const traz = new RegExp(`(^|[^\\d])${algarismo.replace(',', '\\,')}([^\\d]|$)`);
        if (!traz.test(literal)) falha(b.id, `${qual}: o literal «${curto(literal)}» não traz o algarismo`);
      }
      if (ap.origem) {
        const o = origens[ap.origem];
        if (!o) return falha(b.id, `${qual} apoia-se em «${ap.origem}», que não está declarada em ORIGENS_DAS_DEFINICOES`);
        if (!CAMPOS_DA_ORIGEM.has(ap.campo) || typeof o[ap.campo] !== 'string') return falha(b.id, `${qual} cita o campo «${ap.campo}» da origem «${ap.origem}», que não existe ou não pode apoiar`);
        if (!o[ap.campo].includes(literal)) return falha(b.id, `${qual} cita «${curto(literal)}», que não está no campo «${ap.campo}» da origem «${ap.origem}»`);
        usadas.add(ap.origem);
        return;
      }
      if (ap.linha) {
        if (!doBloco.has(ap.linha)) return falha(b.id, `${qual} cita a linha «${ap.linha}», que o bloco não nomeia`);
        const l = linhas.get(ap.linha);
        /* UMA LINHA QUE SAIU DO LIVRO NÃO FECHA A CONSTRUÇÃO: tira o bloco da página (o resolvedor
           di-lo no sinal), e o apoio que ela dava fica por conferir até o lugar de direção reescrever
           o bloco. É a regra do §5.2 do brief, e fica contada. */
        if (!l) { contas.apoios--; return; }
        const valor = CAMPOS_DA_LINHA.has(ap.campo) ? campoDaLinha(l, ap.campo) : undefined;
        if (typeof valor !== 'string') return falha(b.id, `${qual} cita o campo «${ap.campo}» da linha «${ap.linha}», que não existe ou não pode apoiar`);
        if (!valor.includes(literal)) return falha(b.id, `${qual} cita «${curto(literal)}», que não está no campo «${ap.campo}» da linha «${ap.linha}»`);
        return;
      }
      falha(b.id, `${qual} tem um apoio sem origem nem linha`);
    };
    /** As condições de uma guarda: as do bloco, ou as da peça. @param {string} guarda */
    const condicoesDe = (guarda) => guarda === 'bloco' ? b.condicao ?? [] : (b.pecas ?? []).find((/** @type {any} */ p) => `peca:${p.id}` === guarda)?.condicao ?? [];

    let folhas;
    try { folhas = folhasDoBloco(b); } catch (e) { falha(b.id, e instanceof Error ? e.message : String(e)); continue; }
    const auditadas = Array.isArray(a.folhas) ? a.folhas : [];
    /** @type {Set<number>} */
    const usadasDaAuditoria = new Set();
    for (const f of folhas.filter((x) => x.nl === undefined)) {
      contas.folhas++;
      const qual = `a folha «${curto(String(f.pt || f.en))}» (${f.caminho})`;
      /* O DETETOR DA VOZ, nas duas edições, sobre a palavra declarada. */
      for (const lang of /** @type {const} */ (['pt', 'en'])) {
        const texto = String(f[lang] ?? '');
        if (!texto.trim()) continue;
        contas.marcadores_corridos++;
        const mordeu = analisa(texto, lang === 'pt' ? '/' : '/en', voz, 'home');
        if (mordeu.length) falha(b.id, `${qual} (${lang}) morde o marcador de autorreferência «${mordeu.join(', ')}»`);
      }
      const i = auditadas.findIndex((x) => x?.caminho === f.caminho && x?.pt === f.pt && x?.en === f.en);
      if (i < 0) { falha(b.id, `${qual} não tem auditoria: uma palavra mudada precisa de nova leitura das origens`); continue; }
      usadasDaAuditoria.add(i);
      const partes = Array.isArray(auditadas[i].partes) ? auditadas[i].partes : [];
      if (partes.map((/** @type {any} */ p) => p?.pt ?? '').join('') !== f.pt || partes.map((/** @type {any} */ p) => p?.en ?? '').join('') !== f.en) {
        falha(b.id, `${qual}: as partes juntas não dão a folha, nas duas edições`);
        continue;
      }
      for (const [j, p] of partes.entries()) {
        contas.partes++;
        const qualParte = `${qual}, parte ${j + 1} («${curto(String(p?.pt || p?.en))}»)`;
        if (p?.classe === 'diz') {
          contas.diz++;
          if (!Array.isArray(p.apoios) || p.apoios.length === 0) { falha(b.id, `${qualParte} diz o que uma medida é e não tem apoio nenhum`); continue; }
          for (const ap of p.apoios) apoio(ap, qualParte);
        } else if (p?.classe === 'conta') {
          contas.conta++;
          if (p.apoios?.length) falha(b.id, `${qualParte} é uma conta e traz apoios: ou diz o que a medida é, ou é uma conta`);
          if (f.dentroDeRamo) continue;
          const guarda = Array.isArray(p.guarda) ? p.guarda : [];
          if (!guarda.length) { falha(b.id, `${qualParte} é uma conta fora de um ramo e não diz que condições a guardam`); continue; }
          const conds = condicoesDe(f.condicoes);
          for (const k of guarda) {
            const c = conds[k];
            if (!c) falha(b.id, `${qualParte} é guardada pela condição ${k}, que ${f.condicoes === 'bloco' ? 'o bloco' : 'a peça'} não declara`);
            else if (typeof c.op !== 'string') falha(b.id, `${qualParte} é guardada pela condição ${k}, que não é uma comparação`);
          }
        } else if (p?.classe === 'liga') {
          contas.liga++;
          for (const lang of /** @type {const} */ (['pt', 'en'])) {
            const resto = String(p[lang] ?? '').toLowerCase().replace(PONTUACAO, ' ').trim();
            const palavras = resto ? resto.split(/\s+/) : [];
            const fora = palavras.filter((w) => !PALAVRAS_DE_LIGACAO[lang].has(w));
            if (fora.length) falha(b.id, `${qualParte} está marcada como ligação e traz «${fora.join(' ')}» (${lang}), que não é uma palavra de ligação`);
          }
        } else falha(b.id, `${qualParte} não tem classe (diz, conta ou liga)`);
      }
    }
    for (const [k, x] of auditadas.entries()) if (!usadasDaAuditoria.has(k)) falha(b.id, `a auditoria tem uma folha («${curto(String(x?.pt))}», ${x?.caminho}) que a declaração não tem`);

    /* OS ALGARISMOS DECLARADOS, pelo sítio de cada um. */
    const algarismos = folhas.filter((x) => x.nl !== undefined);
    const auditados = Array.isArray(a.algarismos) ? a.algarismos : [];
    /** @type {Set<number>} */
    const vistos = new Set();
    for (const f of algarismos) {
      contas.algarismos++;
      const qual = `o algarismo «${f.nl}» (${f.caminho})`;
      if (!motivos.has(String(f.motivo))) falha(b.id, `${qual} declara o motivo «${f.motivo}», que não está em ledger/allowlist.yml`);
      const k = auditados.findIndex((x) => x?.caminho === f.caminho && x?.nl === f.nl);
      if (k < 0) { falha(b.id, `${qual} não tem literal nenhum que o traga`); continue; }
      vistos.add(k);
      if (!Array.isArray(auditados[k].apoios) || !auditados[k].apoios.length) { falha(b.id, `${qual} não tem literal nenhum que o traga`); continue; }
      for (const ap of auditados[k].apoios) apoio(ap, qual, String(f.nl));
    }
    for (const [k, x] of auditados.entries()) if (!vistos.has(k)) falha(b.id, `a auditoria tem um algarismo («${x?.nl}», ${x?.caminho}) que a declaração não tem`);
    for (const o of declaradas) if (!usadas.has(o)) falha(b.id, `a origem «${o}» está na lista da auditoria e não apoia parte nenhuma do bloco`);
    for (const o of usadas) if (!declaradas.has(o)) falha(b.id, `a origem «${o}» apoia uma parte e não está na lista da auditoria`);
    contas.origens += usadas.size;
  }
  return { erros, contas };
}

/* =========================================================================
 * A SEGUNDA METADE, sobre as páginas construídas
 * =========================================================================
 * A conta desta célula é sua: lê os valores das linhas em YAML (`loadClaims()`, sem a função que
 * compõe a página), os limiares em `referencias.json` pelo ficheiro, escolhe cada ramo e avalia cada
 * condição por uma conta sua, escreve as datas por uma tabela sua, e só chama o resolvedor para exigir
 * que o texto rendido seja também o dele. Uma página confere-se assim:
 *   · os blocos rendidos são, pela ordem declarada, os que as condições deixam mostrar, e nenhum outro;
 *     as peças também;
 *   · o texto de cada parte (o título, a frase, cada peça, a ressalva) é, carácter a carácter, o do
 *     resolvedor e o da conta desta célula, sem travessões;
 *   · cada algarismo está numa marca; as linhas citadas são as que o bloco nomeia; o valor de
 *     referência é o de `referencias.json`;
 *   · a lista «Os números deste bloco» tem uma linha por número que o bloco mostra, cada uma com a
 *     porta do seu recibo, e é a legenda dos selos do instrumento;
 *   · o desenho cita as linhas declaradas e mais nenhuma, com os valores delas; as pontas das escalas
 *     escritas são as da régua declarada; cada comprimento escrito é o valor na escala do desenho;
 *   · a linha da fonte é a dos publicadores e dos períodos das linhas mostradas;
 *   · na primeira página, a data de «O que se passa» é o período mais recente, pelo fim, das linhas
 *     dos blocos mostrados.
 * ========================================================================= */

const RAIZ_REFERENCIAS = path.join(RAIZ, 'src', 'data', 'enquadramento', 'referencias.json');
/** O número de uma cadeia do livro, pela conta desta célula. @param {unknown} v */
export const numero = (v) => {
  const s = String(v ?? '').replace(/[\s   ]/g, '').replace(/−/g, '-').replace(',', '.');
  return /^[+-]?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
};
const MESES = {
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
/** A data na forma da casa, por uma tabela desta célula. @param {string} v @param {'pt'|'en'} lang */
export const dataAqui = (v, lang) => {
  let m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(v);
  if (m) return `${MESES[lang][Number(m[2]) - 1]}${lang === 'pt' ? ' de ' : ' '}${m[1]}`;
  m = /^(\d{4})-T([1-4])$/.exec(v);
  if (m) return lang === 'pt' ? `${m[2]}.º trimestre de ${m[1]}` : `${m[2]}${['st', 'nd', 'rd', 'th'][Number(m[2]) - 1]} quarter of ${m[1]}`;
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(v);
};
/** O fim de um período, por uma conta desta célula. @param {string} v */
export const fimAqui = (v) => {
  let m = /^(\d{4})$/.exec(v);
  if (m) return `${m[1]}-12-31`;
  m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(v);
  if (m) return `${m[1]}-${m[2]}-${String(new Date(Date.UTC(+m[1], +m[2], 0)).getUTCDate()).padStart(2, '0')}`;
  m = /^(\d{4})-T([1-4])$/.exec(v);
  if (m) { const mes = +m[2] * 3; return `${m[1]}-${String(mes).padStart(2, '0')}-${String(new Date(Date.UTC(+m[1], mes, 0)).getUTCDate()).padStart(2, '0')}`; }
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
};
/** Os limiares de `referencias.json`, lidos pelo ficheiro. */
function limiaresAqui() {
  const j = JSON.parse(fs.readFileSync(RAIZ_REFERENCIAS, 'utf8'));
  /** @type {Map<string, { texto: string, numero: number }>} */
  const m = new Map();
  for (const i of j.indicadores ?? []) {
    const x = /^([+\-−]?)(\d+(?:,\d+)?)%$/.exec(String(i.limiar ?? '').replace(/\s/g, ''));
    if (!x) continue;
    const sinal = x[1] === '-' || x[1] === '−' ? '−' : '';
    m.set(i.id_da_linha, { texto: `${sinal}${x[2]}`, numero: /** @type {number} */ (numero(`${sinal}${x[2]}`)) });
  }
  return m;
}
/** O primeiro número redondo que não fica abaixo de v, pela conta desta célula. @param {number} v */
const redondo = (v) => {
  const p = 10 ** Math.floor(Math.log10(v));
  return [1, 2, 2.5, 5, 10].map((f) => Number((f * p).toPrecision(12))).find((r) => r >= v - 1e-12) ?? 10 * p;
};
const PROVISORIO = (/** @type {any} */ l) => l?.source_flag === 'p' || (l?.source_flag === '&' && l?.source_flag_note === 'Dado provisório');
/** A condição, avaliada por esta célula. @param {any} c @param {Map<string, any>} linhas @param {Map<string, any>} limiares */
export function condicaoAqui(c, linhas, limiares) {
  const v = (/** @type {string} */ id) => numero(linhas.get(id)?.value);
  if (Array.isArray(c.mesmo_periodo)) {
    if (c.mesmo_periodo.some((/** @type {string} */ id) => !linhas.has(id))) return false;
    return new Set(c.mesmo_periodo.map((/** @type {string} */ id) => linhas.get(id).reference_date)).size === 1;
  }
  if (typeof c.mes === 'number') { const r = /^\d{4}-(\d{2})$/.exec(String(linhas.get(c.periodo)?.reference_date ?? '')); return Boolean(r) && Number(r?.[1]) === c.mes; }
  const a = v(c.a);
  const b = typeof c.b === 'string' ? v(c.b) : typeof c.valor === 'number' ? c.valor : limiares.get(c.referencia)?.numero ?? null;
  if (a === null || b === null) return false;
  return { '>': a > b, '<': a < b, '=': a === b, '!=': a !== b }[/** @type {'>'|'<'|'='|'!='} */ (c.op)] ?? false;
}
/** O texto de uma parte declarada, pela conta desta célula. @param {any} partes @param {'pt'|'en'} lang @param {Map<string, any>} linhas @param {Map<string, any>} limiares */
export function textoAqui(partes, lang, linhas, limiares) {
  const lista = typeof partes === 'string' ? [partes] : partes;
  return lista.map((/** @type {any} */ p) => {
    if (typeof p === 'string') return p;
    if ('claim' in p) { const l = linhas.get(p.claim); return `${l.value}${p.sufixo ?? ''}${PROVISORIO(l) ? ` (${t(lang).prov.dadoProvisorio})` : ''}`; }
    if ('periodo' in p) return dataAqui(String(linhas.get(p.periodo).reference_date), lang);
    if ('publicado' in p) return dataAqui(String(linhas.get(p.publicado).published_at), lang);
    if ('referencia' in p) return limiares.get(p.referencia)?.texto ?? '⟨sem limiar⟩';
    if ('compara' in p) { const [a, b] = p.compara.map((/** @type {string} */ id) => numero(linhas.get(id)?.value)); return textoAqui(p[a < b ? 'menor' : a > b ? 'maior' : 'igual'], lang, linhas, limiares); }
    if ('nl' in p) return p.nl;
    return '⟨pedaço desconhecido⟩';
  }).join('');
}
/** As linhas cujos valores se veem num bloco, pela ordem em que aparecem: a frase, o desenho, as peças mostradas. */
function comValorAqui(/** @type {any} */ b, /** @type {string[]} */ pecasMostradas) {
  /** @type {string[]} */
  const ids = [];
  const junta = (/** @type {any} */ x) => { if (Array.isArray(x)) x.forEach(junta); else if (x && typeof x === 'object' && typeof x.claim === 'string' && !ids.includes(x.claim)) ids.push(x.claim); };
  junta(b.frase.pt);
  const d = b.desenho;
  const doDesenho = d.forma === 'barras' ? [...d.linhas, d.total] : d.forma === 'colunas' ? d.paineis.flatMap((/** @type {any} */ p) => p.colunas) : (d.paineis ?? d.pares).flatMap((/** @type {any} */ p) => [p.pt, p.ue]);
  for (const id of doDesenho) if (!ids.includes(id)) ids.push(id);
  for (const p of b.pecas ?? []) if (pecasMostradas.includes(p.id)) junta(p.pt);
  return { ids, doDesenho };
}
/**
 * O SUFIXO DE CADA NÚMERO DA LISTA, pela conta desta célula: o da primeira citação dele na frase ou numa
 * peça mostrada (no ramo que os valores escolhem), senão o do desenho, senão « %» quando a unidade da
 * linha começa pelo símbolo da percentagem.
 *
 * @param {any} b @param {'pt'|'en'} lang @param {string[]} pecasMostradas @param {Map<string, any>} linhas
 * @returns {(id: string) => string}
 */
function sufixosAqui(b, lang, pecasMostradas, linhas) {
  /** @type {Map<string, string>} */
  const m = new Map();
  const anda = (/** @type {any} */ x) => {
    if (Array.isArray(x)) { x.forEach(anda); return; }
    if (!x || typeof x !== 'object') return;
    if (typeof x.claim === 'string') { if (!m.has(x.claim)) m.set(x.claim, x.sufixo ?? ''); return; }
    if (Array.isArray(x.compara)) { const [a, bb] = x.compara.map((/** @type {string} */ i) => numero(linhas.get(i)?.value)); anda(x[a < bb ? 'menor' : a > bb ? 'maior' : 'igual']); }
  };
  anda(b.frase[lang]);
  for (const p of b.pecas ?? []) if (pecasMostradas.includes(p.id)) anda(p[lang]);
  const doDesenho = typeof b.desenho.sufixo === 'string' ? b.desenho.sufixo : '';
  return (id) => m.get(id) ?? (doDesenho || (String(linhas.get(id)?.unit ?? '').startsWith('%') ? ' %' : ''));
}
/** A nota com que uma linha se declara o agregado da União de uma medida, a mesma frase que o portão de HTML lê. */
const AGREGADO_DA_UNIAO = /^Agregado da União Europeia \(EU27_2020\) da medida «([^»]+)»/;
/* O NOME DE UM NÚMERO DA LISTA tem uma de três marcas: o nome deste projeto ou do enquadramento
   (`data-nome`), o nome de uma medida (`data-medida-nome`), ou o campo transcrito do recibo (o título do
   documento, `data-linha-campo`, que o portão de HTML compara com a linha carácter a carácter). */
const MARCA_DO_NOME = '[data-nome], [data-medida-nome], [data-linha-campo]';
/** O texto de um elemento FORA das marcas de origem: sem o nome marcado, o valor, o selo e as datas. @param {any} el */
const foraDasMarcas = (el) => {
  const c = parse(el.outerHTML);
  c.querySelectorAll(`.src-chip, ${MARCA_DO_NOME}, [data-claim], [data-nonledger]`).forEach((n) => n.remove());
  return normal(c.textContent);
};
/** O texto que se lê de um elemento, sem os selos (que são portas e não frase). @param {any} el */
const textoLido = (el) => {
  if (!el) return null;
  const c = parse(el.outerHTML);
  c.querySelectorAll('.src-chip').forEach((n) => n.remove());
  return normal(c.textContent);
};
/** As percentagens escritas num estilo: `margin-left`, `width`, `bottom`, `height`. @param {string} estilo */
const percentagens = (estilo) => Object.fromEntries([...String(estilo ?? '').matchAll(/(margin-left|width|bottom|height)\s*:\s*([\d.]+)%/g)].map((m) => [m[1], Number(m[2])]));
/** A faixa dos desenhos de barras, em percentagem: a constante de `DesenhoDoBloco.astro`, escrita aqui outra vez. */
export const FAIXA_DAS_BARRAS = 72;

/**
 * UMA PÁGINA, conferida. `ids` são os blocos que a página declara (os cinco na primeira página, os
 * da entrada numa entrada); `primeira` diz se a página é a primeira (a data de «O que se passa»).
 *
 * @param {any} root @param {'pt'|'en'} lang @param {string} rota
 * @param {{ ids: string[], primeira?: boolean, linhas?: Map<string, any>, blocos?: any[] }} opcoes
 */
export function conferirBlocosDaPagina(root, lang, rota, { ids, primeira = false, linhas = loadClaims(), blocos = /** @type {any[]} */ (BLOCOS_DA_PRIMEIRA_PAGINA) }) {
  /** @type {string[]} */
  const erros = [];
  if (primeira) erros.push(...conferirSerieDoBloco(root, lang));
  const contas = { blocos_declarados: ids.length, blocos_mostrados: 0, pecas_mostradas: 0, textos: 0, numeros_na_lista: 0, valores_desenhados: 0, barras: 0, pontas: 0, referencias: 0 };
  /** @param {string} id @param {string} m */
  const falha = (id, m) => erros.push(`PP1 · ${rota} · ${id}: ${m}`);
  const limiares = limiaresAqui();
  const main = root.querySelector('main');
  if (!main) { erros.push(`PP1 · ${rota}: a página não tem <main>`); return { erros, contas }; }
  const rendidos = main.querySelectorAll('[data-bloco]');
  /* OS BLOCOS QUE AS CONDIÇÕES DEIXAM MOSTRAR, pela conta desta célula. */
  const esperados = ids.filter((id) => {
    const b = blocos.find((x) => x.id === id);
    if (!b) { falha(id, 'a página declara um bloco que as declarações não têm'); return false; }
    const todas = linhasDeclaradasDoBloco(b);
    return [...todas].every((x) => linhas.has(x)) && (b.condicao ?? []).every((/** @type {any} */ c) => condicaoAqui(c, linhas, limiares));
  });
  const ordem = rendidos.map((el) => el.getAttribute('data-bloco'));
  if (JSON.stringify(ordem) !== JSON.stringify(esperados)) {
    for (const id of ordem) if (!esperados.includes(String(id))) falha(String(id), 'o bloco está na página e as condições dele são falsas pela conta desta célula (ou o bloco não é desta página)');
    for (const id of esperados) if (!ordem.includes(id)) falha(id, 'as condições do bloco são verdadeiras e ele não está na página');
    if (ordem.length === esperados.length && ordem.every((id) => esperados.includes(String(id)))) erros.push(`PP1 · ${rota}: os blocos não estão pela ordem declarada (${ordem.join(', ')})`);
  }
  /** @type {string[]} */
  const linhasDosMostrados = [];
  for (const el of rendidos) {
    const id = String(el.getAttribute('data-bloco'));
    const b = blocos.find((x) => x.id === id);
    if (!b || !esperados.includes(id)) continue;
    contas.blocos_mostrados++;
    const declaradas = linhasDeclaradasDoBloco(b);
    let resolvido;
    try { resolvido = blocoResolvido(id, lang); } catch (e) { falha(id, `o resolvedor não resolve o bloco: ${e instanceof Error ? e.message : e}`); continue; }
    /* AS PEÇAS QUE AS CONDIÇÕES DEIXAM MOSTRAR. */
    const pecasMostradas = (b.pecas ?? []).filter((/** @type {any} */ p) => (p.condicao ?? []).every((/** @type {any} */ c) => condicaoAqui(c, linhas, limiares))).map((/** @type {any} */ p) => p.id);
    const pecasRendidas = el.querySelectorAll('[data-bloco-peca]').map((x) => String(x.getAttribute('data-bloco-peca')));
    if (JSON.stringify(pecasRendidas) !== JSON.stringify(pecasMostradas)) falha(id, `as peças rendidas (${pecasRendidas.join(', ') || 'nenhuma'}) não são as que as condições deixam mostrar (${pecasMostradas.join(', ') || 'nenhuma'})`);
    contas.pecas_mostradas += pecasRendidas.length;
    /* OS TEXTOS, carácter a carácter, contra o resolvedor e contra esta conta. */
    /** @param {string} qual @param {any} rendido @param {any} doResolvedor @param {any} declarado */
    const compara = (qual, rendido, doResolvedor, declarado) => {
      contas.textos++;
      const r = textoLido(rendido);
      if (r === null) { falha(id, `falta ${qual} na página`); return; }
      if (/[—–]/.test(r)) falha(id, `${qual} tem um travessão: «${curto(r)}»`);
      const a = normal(textoDosPedacos(doResolvedor, lang));
      const c = normal(textoAqui(declarado, lang, linhas, limiares));
      if (r !== a) falha(id, `o texto rendido ${qual} difere do que o resolvedor dá: «${curto(r)}» contra «${curto(a)}»`);
      if (r !== c) falha(id, `o texto rendido ${qual} difere do que a conta desta célula dá: «${curto(r)}» contra «${curto(c)}»`);
    };
    compara('do título', el.querySelector('[data-bloco-titulo]'), resolvido.titulo, b.titulo[lang]);
    compara('da frase', el.querySelector('[data-bloco-frase]'), resolvido.frase, b.frase[lang]);
    compara('da ressalva', el.querySelector('[data-bloco-ressalva]'), resolvido.ressalva, b.ressalva[lang]);
    for (const pid of pecasMostradas) {
      const p = b.pecas.find((/** @type {any} */ x) => x.id === pid);
      const r = resolvido.pecas.find((x) => x.id === pid);
      const noHtml = el.querySelector(`[data-bloco-peca="${pid}"]`);
      if (!p || !r || !noHtml) continue;
      if (p.caixa) {
        compara(`do título da peça ${pid}`, noHtml.querySelector('.pp-caixa-t'), r.titulo ?? [], p.titulo?.[lang] ?? []);
        compara(`da peça ${pid}`, noHtml.querySelector('.pp-caixa-texto'), r.pedacos, p[lang]);
      } else compara(`da peça ${pid}`, noHtml, r.pedacos, p[lang]);
    }
    /* O RAMO QUE NÃO FOI ESCOLHIDO NÃO ESTÁ NA FRASE. */
    const frase = textoLido(el.querySelector('[data-bloco-frase]')) ?? '';
    const ramos = (/** @type {any} */ x) => { if (Array.isArray(x)) x.forEach(ramos); else if (x && typeof x === 'object' && 'compara' in x) {
      const [a, bb] = x.compara.map((/** @type {string} */ i) => numero(linhas.get(i)?.value));
      const escolha = a < bb ? 'menor' : a > bb ? 'maior' : 'igual';
      for (const r of ['menor', 'maior', 'igual']) if (r !== escolha) { const o = normal(textoAqui(x[r], lang, linhas, limiares)); if (o.length >= 3 && frase.includes(o) && !normal(textoAqui(x[escolha], lang, linhas, limiares)).includes(o)) falha(id, `o texto de um ramo que a conta não escolheu está na frase: «${o}»`); }
    } };
    ramos(b.frase[lang]);
    /* CADA ALGARISMO NUMA MARCA, e só as linhas que o bloco nomeia. */
    /* As marcas de origem que o portão de HTML confere: o valor de uma linha, um contexto declarado,
       uma chave da prova, e um campo transcrito de uma linha (o título de um documento que traz um
       algarismo, «2ª Notificação», é comparado com a linha carácter a carácter). */
    const marcado = (/** @type {any} */ n) => { for (let q = n.parentNode; q && q !== el.parentNode; q = q.parentNode) { const at = q.attributes ?? {}; if ('data-claim' in at || 'data-nonledger' in at || 'data-prova' in at || 'data-linha-campo' in at || 'data-verbatim' in at) return true; } return false; };
    const anda = (/** @type {any} */ n) => {
      if (n.nodeType === NodeType.TEXT_NODE) { if (/\d/.test(n.text) && !marcado(n)) falha(id, `o bloco escreve um algarismo sem marca de origem: «${curto(normal(n.text))}»`); return; }
      const tag = String(n.rawTagName ?? '').toLowerCase();
      if (tag === 'script' || tag === 'style') return;
      for (const f of n.childNodes ?? []) anda(f);
    };
    anda(el);
    for (const x of el.querySelectorAll('[data-claim], [data-de-linha], [data-linha-claim], [data-referencia], [data-barra], [data-bloco-numero], [data-linha-de-referencia]')) {
      const citada = x.getAttribute('data-claim') ?? x.getAttribute('data-de-linha') ?? x.getAttribute('data-linha-claim') ?? x.getAttribute('data-referencia') ?? x.getAttribute('data-barra') ?? x.getAttribute('data-bloco-numero') ?? x.getAttribute('data-linha-de-referencia');
      if (!declaradas.has(String(citada))) falha(id, `o bloco cita a linha «${citada}», que o bloco não nomeia`);
    }
    for (const x of el.querySelectorAll('[data-referencia]')) {
      contas.referencias++;
      const l = limiares.get(String(x.getAttribute('data-referencia')));
      if (!l || normal(x.textContent) !== l.texto) falha(id, `o valor de referência de «${x.getAttribute('data-referencia')}» é «${normal(x.textContent)}» na página e «${l?.texto ?? 'nenhum'}» em referencias.json`);
    }
    /* O RÓTULO DA LINHA DE REFERÊNCIA DE UM DESENHO, INTEIRO (bloco PP1): a palavra de `strings.mjs`, o valor
       de `referencias.json` e o símbolo. É mobília do desenho declarado, e sai do inventário das frases com
       ele; o que lá fica é o que esta conta diz. */
    for (const r of el.querySelectorAll('[data-rotulo-da-referencia]')) {
      const ref = r.querySelector('[data-referencia]');
      const l = limiares.get(String(ref?.getAttribute('data-referencia')));
      const esperado = normal(`${t(lang).home.numeros.limiar} ${l?.texto ?? '⟨sem limiar⟩'} %`);
      if (normal(r.textContent) !== esperado) falha(id, `o rótulo da linha de referência diz «${normal(r.textContent)}» e a conta desta célula dá «${esperado}»`);
    }
    /* A LISTA «OS NÚMEROS DESTE BLOCO», COM A PORTA DE CADA NÚMERO. */
    const { ids: comValor, doDesenho } = comValorAqui(b, pecasMostradas);
    const lista = el.querySelector('[data-legenda-selos]');
    if (!lista || String(lista.rawTagName).toLowerCase() !== 'details' || lista.hasAttribute('open')) falha(id, 'a lista «Os números deste bloco» não é uma dobra fechada marcada data-legenda-selos');
    const naLista = (lista?.querySelectorAll('[data-bloco-numero]') ?? []).map((x) => String(x.getAttribute('data-bloco-numero')));
    for (const n of comValor) if (!naLista.includes(n)) falha(id, `a lista «Os números deste bloco» não tem a linha ${n}`);
    for (const n of naLista) if (!comValor.includes(n)) falha(id, `a lista «Os números deste bloco» tem a linha ${n}, que o bloco não mostra`);
    const sufixoDe = sufixosAqui(b, lang, pecasMostradas, linhas);
    for (const x of lista?.querySelectorAll('[data-bloco-numero]') ?? []) {
      contas.numeros_na_lista++;
      const n = String(x.getAttribute('data-bloco-numero'));
      const v = x.querySelector(`[data-claim="${n}"]`);
      if (!v || normal(v.textContent) !== normal(linhas.get(n)?.value)) falha(id, `a linha da lista de ${n} não mostra o valor da linha`);
      const porta = routePathLinha(lang, n);
      if (!x.querySelectorAll('a.src-chip').some((a) => a.getAttribute('href') === porta)) falha(id, `a linha da lista de ${n} está sem a porta do recibo (${porta})`);
      /* O TEXTO DA LINHA FORA DAS MARCAS, carácter a carácter (a mudança de forma do inventário, bloco
         PP1): a lista sai do inventário das frases (`data-bloco-declarado`) porque o sufixo e a palavra do
         provisório mudam com os dados, e o que sai tem de ser exatamente a palavra «União Europeia» onde
         o número é o agregado da União da medida cujo nome leva, o sufixo declarado e o provisório da
         linha. O nome, o valor, o selo e a data têm as suas marcas e as suas conferências. */
      const onde = x.querySelector('.pp-numero-onde');
      const nome = x.querySelector(MARCA_DO_NOME);
      const nota = AGREGADO_DA_UNIAO.exec(String(linhas.get(n)?.note ?? ''));
      const doNome = nome?.getAttribute('data-de-linha') ?? nome?.getAttribute('data-linha-claim') ?? null;
      if (!nome) falha(id, `a linha da lista de ${n} não tem o nome com a sua marca`);
      if (onde && !(nota && doNome === nota[1])) falha(id, `a linha da lista de ${n} diz «${normal(onde.textContent)}» e a linha não é o agregado da União da medida cujo nome leva`);
      if (!onde && nota && doNome === nota[1]) falha(id, `a linha da lista de ${n} leva o nome da medida ${nota[1]} sem a palavra da União, e o número é o agregado da União`);
      const l = linhas.get(n);
      const esperado = normal(`${onde ? `${t(lang).cartao.uniaoEuropeia} ` : ''}${sufixoDe(n)}${PROVISORIO(l) ? ` (${t(lang).prov.dadoProvisorio})` : ''}`);
      const lido = foraDasMarcas(x);
      if (lido !== esperado) falha(id, `o texto da linha da lista de ${n}, fora das marcas, é «${lido}» e a conta desta célula dá «${esperado}»`);
    }
    if (lista && !lista.querySelector('ul[data-bloco-declarado]')) falha(id, 'a lista «Os números deste bloco» não traz a marca das palavras conferidas por esta célula');
    /* O DESENHO: as linhas, os valores, as pontas das escalas e os comprimentos escritos. */
    const desenho = el.querySelector('[data-bloco-desenho]');
    const desenhadas = (desenho?.querySelectorAll('svg [data-claim]') ?? []);
    const idsDesenhados = desenhadas.map((x) => String(x.getAttribute('data-claim')));
    for (const n of doDesenho) if (!idsDesenhados.includes(n)) falha(id, `o desenho não tem a linha ${n}`);
    for (const x of desenhadas) {
      contas.valores_desenhados++;
      const n = String(x.getAttribute('data-claim'));
      if (!doDesenho.includes(n)) falha(id, `o desenho tem a linha ${n}, que a declaração do desenho não nomeia`);
      if (normal(x.textContent) !== normal(linhas.get(n)?.value)) falha(id, `o valor desenhado de ${n} é «${normal(x.textContent)}» e a linha diz «${linhas.get(n)?.value}»`);
      const dono = x.closest('[data-barra]');
      if (!dono || dono.getAttribute('data-barra') !== n) falha(id, `o valor desenhado de ${n} está na barra de «${dono?.getAttribute('data-barra')}»`);
    }
    const d = b.desenho;
    /** @type {{ painel: any, regua: any, linhas: string[] }[]} */
    const paineis = d.forma === 'barras' ? [{ painel: d, regua: d.regua, linhas: [...d.linhas, d.total] }]
      : d.forma === 'colunas' ? d.paineis.map((/** @type {any} */ p) => ({ painel: p, regua: d.regua, linhas: p.colunas }))
      : (d.paineis ?? d.pares).map((/** @type {any} */ p) => ({ painel: p, regua: p.regua ?? d.regua, linhas: [p.pt, p.ue] }));
    /** @type {Map<string, number[]>} */
    const porEscala = new Map();
    paineis.forEach((x, i) => { const k = x.painel.regua ? (x.painel.regua.grupo ?? `painel-${i}`) : 'unica'; porEscala.set(k, [...(porEscala.get(k) ?? []), ...x.linhas.map((n) => /** @type {number} */ (numero(linhas.get(n)?.value)))]); });
    const paineisHtml = desenho?.querySelectorAll('[data-painel]') ?? [];
    if (paineisHtml.length !== paineis.length) falha(id, `o desenho tem ${paineisHtml.length} painéis e a declaração ${paineis.length}`);
    paineis.forEach((x, i) => {
      const chave = x.painel.regua ? (x.painel.regua.grupo ?? `painel-${i}`) : 'unica';
      const valores = /** @type {number[]} */ (porEscala.get(chave));
      const r = x.regua;
      const min = Math.min(0, ...valores);
      const maior = Math.max(0, ...valores);
      const max = typeof r.ate === 'number' ? r.ate : r.ate === 'maior' ? maior : r.ate === 'redonda' ? redondo(maior) : Math.ceil(maior);
      const html = paineisHtml[i];
      if (!html) return;
      const pontas = html.querySelectorAll('.pp-escala [data-nonledger="escala-de-instrumento"]').map((e) => normal(e.textContent));
      const esperadas = r.pontas ? [String(min).replace('.', ','), String(Number(max.toPrecision(12))).replace('.', ',')] : [];
      contas.pontas += pontas.length;
      if (JSON.stringify(pontas) !== JSON.stringify(esperadas)) falha(id, `as pontas da escala do painel ${i + 1} são «${pontas.join(' e ')}» e a régua declarada dá «${esperadas.join(' e ')}»`);
      for (const n of x.linhas) {
        contas.barras++;
        const v = /** @type {number} */ (numero(linhas.get(n)?.value));
        const f = (v - min) / (max - min), z = (0 - min) / (max - min);
        const barra = html.querySelector(`[data-barra="${n}"] ${d.forma === 'colunas' ? '.pp-col-barra' : '.pp-barra'}`);
        const e = percentagens(barra?.getAttribute('style') ?? '');
        const escrito = d.forma === 'colunas' ? e.height : e.width;
        const conta = Math.abs(f - z) * (d.forma === 'colunas' ? 100 : FAIXA_DAS_BARRAS);
        if (escrito === undefined || Math.abs(escrito - conta) > 0.001) falha(id, `a barra de ${n} está escrita com ${escrito}% e a conta desta célula dá ${conta.toFixed(4)}%`);
      }
      if (d.forma === 'colunas' && x.painel.referencia) {
        const ref = html.querySelector('.pp-ref');
        const l = limiares.get(x.painel.referencia);
        const conta = l ? (l.numero - min) / (max - min) * 100 : NaN;
        const escrito = percentagens(ref?.getAttribute('style') ?? '').bottom;
        if (!ref || escrito === undefined || Math.abs(escrito - conta) > 0.001) falha(id, `a linha do valor de referência está escrita em ${escrito}% e a conta desta célula dá ${conta.toFixed(4)}%`);
      } else if (html.querySelector('.pp-ref')) falha(id, `o painel ${i + 1} tem a linha de um valor de referência que a declaração não lhe dá`);
    });
    /* A LINHA DA FONTE, pela conta desta célula. */
    /** @type {{ publicador: string, periodos: string[] }[]} */
    const grupos = [];
    for (const n of comValor) {
      const l = linhas.get(n);
      let g = grupos.find((x) => x.publicador === l.source);
      if (!g) { g = { publicador: l.source, periodos: [] }; grupos.push(g); }
      if (l.reference_date && !g.periodos.includes(String(l.reference_date))) g.periodos.push(String(l.reference_date));
    }
    const fonte = el.querySelector('[data-bloco-fonte]');
    const publicadores = (fonte?.querySelectorAll('[data-linha-campo="source"]') ?? []).map((x) => normal(x.textContent));
    const periodos = (fonte?.querySelectorAll('[data-de-campo="reference_date"]') ?? []).map((x) => normal(x.textContent));
    const esperadosP = grupos.flatMap((g) => g.periodos.map((p) => dataAqui(p, lang)));
    if (JSON.stringify(publicadores) !== JSON.stringify(grupos.map((g) => g.publicador)) || JSON.stringify(periodos) !== JSON.stringify(esperadosP)) {
      falha(id, `a linha da fonte diz «${publicadores.join(', ')} · ${periodos.join(', ')}» e a conta desta célula dá «${grupos.map((g) => g.publicador).join(', ')} · ${esperadosP.join(', ')}»`);
    }
    /* As linhas do bloco mostrado, para a data de «O que se passa». */
    const usadas = new Set(comValor);
    const periodoDe = (/** @type {any} */ x) => { if (Array.isArray(x)) x.forEach(periodoDe); else if (x && typeof x === 'object') { if (typeof x.periodo === 'string' && !('mes' in x)) usadas.add(x.periodo); if (typeof x.publicado === 'string') usadas.add(x.publicado); for (const r of ['menor', 'maior', 'igual']) if (r in x) periodoDe(x[r]); } };
    periodoDe(b.frase.pt);
    for (const p of b.pecas ?? []) if (pecasMostradas.includes(p.id)) periodoDe(p.pt);
    periodoDe(b.desenho.legenda?.pt ?? []);
    linhasDosMostrados.push(...usadas);
  }
  if (primeira) {
    let melhor = null;
    for (const n of linhasDosMostrados) { const f = fimAqui(String(linhas.get(n)?.reference_date ?? '')); if (f && (!melhor || f > melhor.fim)) melhor = { fim: f, periodo: String(linhas.get(n).reference_date) }; }
    const el = main.querySelector('[data-numeros-mais-recentes] [data-de-campo="reference_date"]');
    const esperado = melhor ? dataAqui(melhor.periodo, lang) : null;
    if (!el || normal(el.textContent) !== esperado) erros.push(`PP1 · ${rota}: a data de «O que se passa» diz «${el ? normal(el.textContent) : 'nada'}» e a conta desta célula dá «${esperado}»`);
    const h2 = main.querySelector('[data-o-que-se-passa] h2');
    if (!h2 || normal(h2.textContent) !== t(lang).primeira.oQueSePassa) erros.push(`PP1 · ${rota}: «O que se passa» não é o título da secção dos blocos`);
  }
  if (rendidos.length === 0 && esperados.length > 0) erros.push(`PP1 · ${rota}: a página não tem bloco nenhum e as condições deixam mostrar ${esperados.length}`);
  return { erros, contas };
}

/** O caminho do recibo de uma linha, escrito aqui como a tabela das rotas o escreve. @param {'pt'|'en'} lang @param {string} id */
function routePathLinha(lang, id) {
  return lang === 'pt' ? `/livro-razao/${id}` : `/en/ledger/${id}`;
}

/**
 * AS PLANTAS DA CÉLULA, todas em memória: a auditoria, a declaração e o livro são cópias, e as páginas
 * lêem-se do `dist/` e estragam-se numa cópia. Cada planta tem de morder com a queixa esperada.
 *
 * @param {string} dist
 * @returns {{ nome: string, mordeu: boolean, queixa: string|null }[]}
 */
export function plantasDosBlocos(dist) {
  const base = lerAuditoriaDosBlocos();
  /** @type {{ nome: string, mordeu: boolean, queixa: string|null }[]} */
  const out = [];
  /** @param {string} nome @param {string[]} erros @param {RegExp} mordida */
  const regista = (nome, erros, mordida) => { const q = erros.find((e) => mordida.test(e)) ?? null; out.push({ nome, mordeu: q !== null, queixa: q ?? erros[0] ?? null }); };
  /** @param {(a: any) => void} estraga */
  const auditoriaCom = (estraga) => { const c = structuredClone(base); estraga(c); return c; };
  const dela = (/** @type {any} */ a, /** @type {string} */ id) => a.blocos.find((/** @type {any} */ b) => b.id === id);
  const folhaDe = (/** @type {any} */ a, /** @type {string} */ id, /** @type {string} */ caminho) => dela(a, id).folhas.find((/** @type {any} */ f) => f.caminho === caminho);
  /* A primeira metade. */
  regista('uma palavra que diz o que a medida é, sem apoio', conferirAuditoriaDosBlocos({ auditoria: auditoriaCom((a) => { folhaDe(a, 'casa', 'desenho.paineis[1].titulo').partes[0].apoios = []; }) }).erros, /não tem apoio nenhum/);
  regista('um literal que o campo não tem', conferirAuditoriaDosBlocos({ auditoria: auditoriaCom((a) => { folhaDe(a, 'estado', 'frase[0]').partes[0].apoios[0].literal = 'general government sector debts'; }) }).erros, /que não está no campo «excerto» da origem «pdm-divida-publica»/);
  const mudada = structuredClone(/** @type {any[]} */ (BLOCOS_DA_PRIMEIRA_PAGINA));
  mudada.find((b) => b.id === 'pobreza').ressalva.pt[0] = 'O risco de pobreza mede-se sempre contra o rendimento de cada país: é ter menos de ';
  regista('uma palavra mudada sem nova leitura', conferirAuditoriaDosBlocos({ blocos: mudada }).erros, /não tem auditoria: uma palavra mudada/);
  regista('uma conta fora de um ramo sem guarda', conferirAuditoriaDosBlocos({ auditoria: auditoriaCom((a) => { delete folhaDe(a, 'precos', 'frase[4]').partes[0].guarda; }) }).erros, /é uma conta fora de um ramo e não diz que condições a guardam/);
  regista('uma guarda que não é uma comparação', conferirAuditoriaDosBlocos({ auditoria: auditoriaCom((a) => { folhaDe(a, 'precos', 'frase[4]').partes[0].guarda = [0]; }) }).erros, /é guardada pela condição 0, que não é uma comparação/);
  const comLigacao = structuredClone(/** @type {any[]} */ (BLOCOS_DA_PRIMEIRA_PAGINA));
  comLigacao.find((b) => b.id === 'estado').frase.pt[2] = ' desde ';
  regista('uma palavra de ligação que diz alguma coisa', conferirAuditoriaDosBlocos({ blocos: comLigacao, auditoria: auditoriaCom((a) => { const f = folhaDe(a, 'estado', 'frase[2]'); f.partes[0].pt = ' desde '; f.pt = ' desde '; }) }).erros, /está marcada como ligação e traz «desde» \(pt\)/);
  regista('um algarismo cujo literal não o traz', conferirAuditoriaDosBlocos({ auditoria: auditoriaCom((a) => { dela(a, 'pobreza').algarismos[4].apoios = [{ origem: 'eurostat-tipslc10-descricao', campo: 'excerto', literal: 'national median equalised disposable income' }]; }) }).erros, /não traz o algarismo/);
  regista('uma origem listada que não apoia nada', conferirAuditoriaDosBlocos({ auditoria: auditoriaCom((a) => { dela(a, 'trabalho').origens.push('glossario-hpi'); }) }).erros, /a origem «glossario-hpi» está na lista da auditoria e não apoia parte nenhuma/);
  const comMarcador = structuredClone(/** @type {any[]} */ (BLOCOS_DA_PRIMEIRA_PAGINA));
  comMarcador.find((b) => b.id === 'estado').ressalva.pt = 'É tudo o que as administrações públicas devem, e este sítio mostra-o em percentagem do PIB, o valor de tudo o que o país produz num ano.';
  regista('a autorreferência numa palavra declarada', conferirAuditoriaDosBlocos({ blocos: comMarcador, auditoria: auditoriaCom((a) => { const f = folhaDe(a, 'estado', 'ressalva'); f.pt = comMarcador.find((b) => b.id === 'estado').ressalva.pt; f.partes = [{ ...f.partes[0], pt: f.pt, en: f.en }]; }) }).erros, /morde o marcador de autorreferência/);
  /* A segunda metade, sobre cópias das páginas construídas. */
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const htmlEn = fs.readFileSync(path.join(dist, 'en', 'index.html'), 'utf8');
  const ids = idsDosBlocos();
  /** @param {(r: any) => void} estraga @param {{ linhas?: Map<string, any>, en?: boolean }} [o] */
  const pagina = (estraga, o = {}) => { const r = parse(o.en ? htmlEn : html); estraga(r); return conferirBlocosDaPagina(r, o.en ? 'en' : 'pt', o.en ? '/en/ (planta)' : '/ (planta)', { ids, primeira: true, linhas: o.linhas ?? loadClaims() }).erros; };
  const bloco = (/** @type {any} */ r, /** @type {string} */ id) => r.querySelector(`[data-bloco="${id}"]`);
  regista('uma palavra plantada numa frase', pagina((r) => { const f = bloco(r, 'pobreza').querySelector('[data-bloco-frase]'); f.set_content(f.innerHTML.replace('era menor', 'era bem menor')); }), /o texto rendido da frase difere do que o resolvedor dá/);
  regista('o ramo trocado', pagina((r) => { const f = bloco(r, 'estado').querySelector('[data-bloco-frase]'); f.set_content(f.innerHTML.replace('desceu', 'subiu')); }), /o texto de um ramo que a conta não escolheu está na frase: «subiu»/);
  regista('um algarismo escrito à mão num bloco', pagina((r) => { bloco(r, 'precos').querySelector('[data-bloco-ressalva]').insertAdjacentHTML('beforeend', ' Em 12 meses.'); }), /algarismo sem marca de origem/);
  regista('um travessão numa frase', pagina((r) => { const f = bloco(r, 'estado').querySelector('[data-bloco-ressalva]'); f.set_content(f.innerHTML.replace('devem,', 'devem —')); }), /tem um travessão/);
  regista('a linha de outro bloco citada', pagina((r) => { bloco(r, 'precos').querySelector('[data-bloco-frase] [data-claim]').setAttribute('data-claim', 'divida-publica-2025'); }), /o bloco cita a linha «divida-publica-2025», que o bloco não nomeia/);
  regista('o valor de referência trocado', pagina((r) => { bloco(r, 'estado').querySelector('[data-bloco-frase] [data-referencia]').set_content('50'); }), /o valor de referência de «divida-publica-2025» é «50»/);
  regista('um número tirado da lista do bloco', pagina((r) => { bloco(r, 'casa').querySelector('[data-bloco-numero="sobrecarga-do-custo-da-habitacao-2025-ue"]').remove(); }), /não tem a linha sobrecarga-do-custo-da-habitacao-2025-ue/);
  regista('a porta de um número da lista tirada', pagina((r) => { bloco(r, 'trabalho').querySelector('[data-bloco-numero="taxa-de-emprego-2025"] a.src-chip').remove(); }), /de taxa-de-emprego-2025 está sem a porta do recibo/);
  regista('o sufixo de um número da lista trocado', pagina((r) => { bloco(r, 'trabalho').querySelector('[data-bloco-numero="remuneracao-bruta-mensal-media"] .claim-sufixo').set_content(' euros por ano'); }), /o texto da linha da lista de remuneracao-bruta-mensal-media, fora das marcas, é «euros por ano \(dado provisório\)»/);
  regista('a palavra da União tirada de um número da União', pagina((r) => { bloco(r, 'casa').querySelector('[data-bloco-numero="sobrecarga-do-custo-da-habitacao-2025-ue"] .pp-numero-onde').remove(); }), /leva o nome da medida sobrecarga-do-custo-da-habitacao-2025 sem a palavra da União/);
  regista('a linha da fonte sem um publicador', pagina((r) => { bloco(r, 'precos').querySelector('[data-bloco-fonte] .pp-fonte-item:last-child').remove(); }), /a linha da fonte diz/);
  regista('a data de «O que se passa» trocada', pagina((r) => { r.querySelector('[data-numeros-mais-recentes] [data-de-campo]').set_content('julho de 2026'); }), /a data de «O que se passa» diz «julho de 2026»/);
  regista('uma ponta da escala trocada', pagina((r) => { bloco(r, 'trabalho').querySelector('.pp-escala [data-nonledger]:last-child').set_content('90'); }, { en: true }), /as pontas da escala do painel 1 são «0 e 90»/);
  regista('um comprimento escrito com outra escala', pagina((r) => { const b = bloco(r, 'casa').querySelector('[data-barra="sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025"] .pp-barra'); b.setAttribute('style', String(b.getAttribute('style')).replace(/width:[\d.]+%/, 'width:50%')); }), /a barra de sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025 está escrita com 50%/);
  regista('uma palavra no rótulo da linha de referência', pagina((r) => { const x = bloco(r, 'estado').querySelector('[data-rotulo-da-referencia] span'); x.set_content('limite da casa'); }), /o rótulo da linha de referência diz «limite da casa 60 %»/);
  regista('a linha do valor de referência nos 50', pagina((r) => { const x = bloco(r, 'estado').querySelector('.pp-ref'); x.setAttribute('style', 'bottom:53.4759%'); }), /a linha do valor de referência está escrita em 53.4759%/);
  /* Um bloco na página cuja condição passou a falsa: o livro da célula muda na memória, a página não. */
  const outro = new Map([...loadClaims()].map(([k, v]) => [k, structuredClone(v)]));
  outro.get('ipc-variacao-homologa').value = '-1,0';
  regista('um bloco rendido com a condição falsa', pagina(() => {}, { linhas: outro }), /precos: o bloco está na página e as condições dele são falsas/);
  const semPeca = new Map([...loadClaims()].map(([k, v]) => [k, structuredClone(v)]));
  semPeca.get('divida-publica-2025-notificacao-ine-2026-09').value = semPeca.get('divida-publica-2025').value;
  regista('uma peça rendida com a condição falsa', pagina(() => {}, { linhas: semPeca }), /estado: as peças rendidas \(revisao-do-ine\) não são as que as condições deixam mostrar \(nenhuma\)/);
  return out;
}

export { ENTRADAS, idsDosBlocos, blocoResolvido, textoDosPedacos, parse, NodeType, t };
