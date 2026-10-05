/**
 * ===========================================================================
 * AS EXPLICAÇÕES E A LEITURA DA SEMANA, LIDAS PELO PORTÃO DE HTML (bloco EX1, 05.10.2026)
 * ===========================================================================
 *
 * LEITOR PRÓPRIO. Não importa o resolvedor das explicações nem o da leitura da semana (`src/lib/explicacoes.mjs`,
 * `src/lib/leitura-da-semana.mjs`): uma conferência que usasse o código das páginas confirmava-se a si própria. Lê
 * as declarações das explicações (`src/data/explicacoes/`), a declaração da medida reunida (`MEDIDA_REUNIDA`) e as
 * linhas do livro-razão pelo mapa que o portão já carregou, e refaz as contas por si.
 *
 * TRÊS COISAS:
 *
 *   1. A DÉCIMA ORIGEM, `data-semana`: as contagens e as datas da primeira frase da leitura da semana. A janela
 *      lê-se do antepassado que a declara (`data-semana-janela`, «AAAA-MM-DD/AAAA-MM-DD»), tem de ter sete dias e
 *      de acabar no dia do carimbo da construção (`construido_em`, em `dist/version.json`), ou no dia anterior
 *      quando o carimbo cai na primeira meia hora do dia: a página rende-se antes do carimbo, e uma construção que
 *      passe a meia-noite UTC entre as duas coisas não muda de semana. Cada contagem reconta-se das linhas (as
 *      linhas do âmbito com uma entrada datada dentro da janela) e cada data recompõe-se pela cópia da forma da
 *      casa; o texto rendido compara-se carácter a carácter. A porta é a da página da semana: a marca vive dentro
 *      de uma ligação para ela, ou na própria página da semana, onde uma porta para si mesma não é porta.
 *   2. A PÁGINA DA SEMANA, CONTADA: existe nas duas edições, tem a primeira frase uma vez, e tem uma entrada por
 *      linha do âmbito cujo valor mudou na janela, nem mais nem menos, cada uma com a natureza do registo.
 *   3. O `<head>` DE UMA EXPLICAÇÃO: o título e a descrição compõem-se do título declarado, com o ano pelo período
 *      da linha nomeada, e o portão recompõe-nos por conta própria e exige-os iguais aos construídos, como faz ao
 *      `<head>` de uma página de linha.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { EXPLICACOES } from '../src/data/explicacoes/index.mjs';
import { MEDIDA_REUNIDA } from '../src/lib/pais.mjs';

/** O estudo das contagens do próprio projeto, fora do âmbito da leitura. */
const ESTUDO_DO_PROJETO = 'o-estado-do-pais';
const NATUREZAS_DE_VALOR = new Set(['correcao', 'atualizacao']);
const DIAS = 7;
const DIA = /^\d{4}-\d{2}-\d{2}$/;
/** As chaves da marca, e mais nenhuma. */
export const CHAVES_DA_SEMANA = ['inicio', 'fim', 'relidas', 'valor', 'proveniencia'];

/**
 * O dia do carimbo da construção, e os dias em que a janela pode acabar.
 * @param {string} dist
 */
export function diasDaJanelaNoPortao(dist) {
  const ficheiro = path.join(dist, 'version.json');
  if (!fs.existsSync(ficheiro)) throw new Error('EX1 · semana: não há dist/version.json, e a janela da leitura da semana confere-se contra o carimbo da construção.');
  const carimbo = JSON.parse(fs.readFileSync(ficheiro, 'utf8')).construido_em;
  if (typeof carimbo !== 'string' || !Number.isFinite(Date.parse(carimbo))) throw new Error('EX1 · semana: o carimbo da construção (construido_em) falta ou não se lê.');
  const d = new Date(carimbo);
  const dia = d.toISOString().slice(0, 10);
  const aceites = [dia];
  if (d.getUTCHours() === 0 && d.getUTCMinutes() < 30) {
    const antes = new Date(d);
    antes.setUTCDate(antes.getUTCDate() - 1);
    aceites.push(antes.toISOString().slice(0, 10));
  }
  return { carimbo, dia, aceites };
}

/** O primeiro dia de uma janela de sete que acaba em `fim`. @param {string} fim */
export function inicioDaJanelaNoPortao(fim) {
  const d = new Date(`${fim}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - (DIAS - 1));
  return d.toISOString().slice(0, 10);
}

/**
 * AS CONTAS DA SEMANA, pela leitura do portão.
 * @param {Map<string, any>} claims @param {string} inicio @param {string} fim
 */
export function contasDaSemanaNoPortao(claims, inicio, fim) {
  const dentro = (/** @type {unknown} */ d) => typeof d === 'string' && d >= inicio && d <= fim;
  let relidas = 0;
  /** @type {Set<string>} */
  const valor = new Set();
  /** @type {Set<string>} */
  const proveniencia = new Set();
  for (const [id, l] of claims) {
    if (!l || l.study === ESTUDO_DO_PROJETO || Object.hasOwn(MEDIDA_REUNIDA, id)) continue;
    if ((l.verifications ?? []).some((/** @type {any} */ v) => dentro(v?.date))) relidas += 1;
    for (const c of l.corrections ?? []) {
      if (!dentro(c?.date)) continue;
      if (c.kind === 'proveniencia') proveniencia.add(id);
      if (NATUREZAS_DE_VALOR.has(c.kind)) valor.add(id);
    }
  }
  return { relidas, valor: valor.size, proveniencia: proveniencia.size, linhasDeValor: valor };
}

/** A janela declarada no antepassado mais próximo de um elemento, ou `null`. @param {any} el */
function janelaDeclarada(el) {
  for (let p = el; p; p = p.parentNode) {
    const v = p.getAttribute?.('data-semana-janela');
    if (typeof v === 'string') return v;
  }
  return null;
}

/** A ligação mais próxima que embrulha um elemento, ou `null`. @param {any} el */
function ligacaoQueEmbrulha(el) {
  for (let p = el.parentNode; p; p = p.parentNode) if (String(p.rawTagName ?? '').toLowerCase() === 'a') return p;
  return null;
}

/**
 * UMA MARCA DA SEMANA (a décima origem). Devolve as queixas, vazias quando a marca confere.
 * @param {any} el
 * @param {{ rota: string|undefined, porta: string, claims: Map<string, any>, aceites: string[], texto: (el: any) => string, dataDaCasa: (iso: string) => string, milhares: (s: string) => string }} ctx
 */
export function conferirMarcaDaSemana(el, ctx) {
  const chave = el.getAttribute('data-semana');
  if (!CHAVES_DA_SEMANA.includes(chave)) return [`data-semana="${chave}" não é uma chave da leitura da semana (${CHAVES_DA_SEMANA.join(', ')}).`];
  const janela = janelaDeclarada(el);
  const m = /^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/.exec(janela ?? '');
  if (!m || !DIA.test(m[1]) || !DIA.test(m[2])) return [`data-semana="${chave}" está fora de um elemento que declare a janela (data-semana-janela="AAAA-MM-DD/AAAA-MM-DD"); leu-se «${janela}».`];
  const [, inicio, fim] = m;
  /** @type {string[]} */
  const erros = [];
  if (inicioDaJanelaNoPortao(fim) !== inicio) erros.push(`a janela da leitura da semana (${janela}) não tem ${DIAS} dias.`);
  if (!ctx.aceites.includes(fim)) erros.push(`a janela da leitura da semana acaba a ${fim}, e a construção é de ${ctx.aceites.join(' ou ')} (o carimbo de dist/version.json).`);
  const naPaginaDaSemana = ctx.rota === 'leituraDaSemana';
  const ligacao = ligacaoQueEmbrulha(el);
  if (!naPaginaDaSemana && (!ligacao || ligacao.getAttribute('href') !== ctx.porta)) {
    erros.push(`a marca data-semana="${chave}" está fora da porta da leitura da semana: fora da página dela, vai dentro de <a href="${ctx.porta}">.`);
  }
  if (naPaginaDaSemana && ligacao) erros.push(`a marca data-semana="${chave}" está dentro de uma ligação na própria página da semana.`);
  const contas = contasDaSemanaNoPortao(ctx.claims, inicio, fim);
  const esperado = chave === 'inicio' ? ctx.dataDaCasa(inicio)
    : chave === 'fim' ? ctx.dataDaCasa(fim)
      : ctx.milhares(String(/** @type {Record<string, number>} */ (/** @type {unknown} */ (contas))[chave]));
  const rendido = ctx.texto(el);
  if (rendido !== esperado) erros.push(`data-semana="${chave}" rende «${rendido}», e o portão conta «${esperado}» na janela ${janela}.`);
  return erros;
}

/**
 * A PÁGINA DA SEMANA, CONTADA, numa edição.
 * @param {string} dist @param {string} ficheiro relativo a `dist/` @param {Map<string, any>} claims @param {string[]} aceites
 */
export function conferirPaginaDaSemana(dist, ficheiro, claims, aceites) {
  const abs = path.join(dist, ficheiro);
  if (!fs.existsSync(abs)) return [`a página da leitura da semana não foi construída: ${ficheiro}.`];
  const root = parse(fs.readFileSync(abs, 'utf8'));
  /** @type {string[]} */
  const erros = [];
  const frases = root.querySelectorAll('main [data-semana-frase]');
  if (frases.length !== 1) erros.push(`${ficheiro}: a primeira frase da leitura aparece ${frases.length} vezes, e é uma.`);
  const janela = frases[0]?.getAttribute('data-semana-janela') ?? '';
  const m = /^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/.exec(janela);
  if (!m) return [...erros, `${ficheiro}: a primeira frase não declara a janela.`];
  if (!aceites.includes(m[2])) erros.push(`${ficheiro}: a janela acaba a ${m[2]}, e a construção é de ${aceites.join(' ou ')}.`);
  const contas = contasDaSemanaNoPortao(claims, m[1], m[2]);
  const entradas = root.querySelectorAll('main [data-semana-mudancas] [data-semana-mudanca]');
  const ids = entradas.map((e) => e.getAttribute('data-semana-mudanca') ?? '');
  const esperados = [...contas.linhasDeValor].sort();
  if (new Set(ids).size !== ids.length) erros.push(`${ficheiro}: uma linha aparece duas vezes entre as mudanças da semana.`);
  if (JSON.stringify([...ids].sort()) !== JSON.stringify(esperados)) {
    const faltam = esperados.filter((id) => !ids.includes(id));
    const aMais = ids.filter((id) => !esperados.includes(id));
    erros.push(`${ficheiro}: a página tem ${ids.length} mudanças de valor e o portão conta ${esperados.length} na janela ${janela}` +
      `${faltam.length ? `; faltam ${faltam.join(', ')}` : ''}${aMais.length ? `; a mais ${aMais.join(', ')}` : ''}.`);
  }
  for (const e of entradas) {
    if (e.getAttribute('data-correcao-entrada') !== e.getAttribute('data-semana-mudanca')) erros.push(`${ficheiro}: a entrada de «${e.getAttribute('data-semana-mudanca')}» não é uma entrada do registo dessa linha.`);
  }
  return erros;
}

/**
 * O TÍTULO DE UMA EXPLICAÇÃO, recomposto pelo portão: as palavras declaradas e o ano pelo período da linha nomeada.
 * @param {string} slug @param {'pt'|'en'} lang @param {Map<string, any>} claims @param {(periodo: string, lang: string) => string|null} periodoDaCasa
 */
export function tituloDaExplicacaoNoPortao(slug, lang, claims, periodoDaCasa) {
  const e = /** @type {any} */ (EXPLICACOES.find((x) => x.slug === slug));
  if (!e) throw new Error(`EX1 · a explicação «${slug}» tem página e não tem declaração.`);
  return e.titulo[lang].map((/** @type {any} */ p) => {
    if (typeof p === 'string') return p;
    if (p && typeof p.periodo === 'string') {
      const r = claims.get(p.periodo)?.reference_date;
      const texto = typeof r === 'string' ? periodoDaCasa(r, lang) : null;
      if (texto === null) throw new Error(`EX1 · o título de «${slug}» nomeia o período de «${p.periodo}», que não se lê.`);
      return texto;
    }
    throw new Error(`EX1 · o título de «${slug}» tem um pedaço que um título não pode ter: ${JSON.stringify(p)}.`);
  }).join('');
}

/** Os slugs declarados, para o portão contar as páginas. */
export const SLUGS_DAS_EXPLICACOES_NO_PORTAO = EXPLICACOES.map((e) => e.slug);
