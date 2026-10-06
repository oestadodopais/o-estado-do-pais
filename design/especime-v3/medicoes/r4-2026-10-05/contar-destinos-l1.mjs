#!/usr/bin/env node
/**
 * A L1 COM AS VEZES CONTADAS (passagem R4-b, 06.10.2026, o achado 10 da leitura a frio do Codex Astra).
 *
 * A régua da L1 (`scripts/check-lugar.mjs`) conta as páginas que têm algum destino repetido, e o registo dela diz, por
 * página, quantos destinos se repetem e um exemplo com as suas vezes. A medida do R4 comparou essa lista entre duas
 * construções e não viu que uma página que já repetia um destino passou a repeti-lo mais vezes (o recibo do PIB passou
 * de três a quatro portas para o mesmo sítio). Este guião faz a mesma conta da régua, ligação a ligação e com as mesmas
 * exclusões (a mobília, as portas obrigatórias provadas pelo B2, o marcador de um cartão, a porta do rótulo de IA, o
 * marcador de um título, a porta da origem de uma definição que é o documento da linha), e escreve, para cada página com
 * algum destino repetido, todos os destinos repetidos com as suas vezes. Lê os módulos da árvore que mede (o primeiro
 * argumento), para medir cada construção pela sua própria regra.
 *
 * O conhecido-positivo é a régua: o número de páginas com algum destino repetido tem de ser o que a régua da mesma
 * árvore conta (passa-se no segundo argumento, lido do registo dela), e o guião recusa escrever se não for.
 *
 * Uso:  node contar-destinos-l1.mjs <raiz da árvore com dist/ construído> <saída.json> <páginas que a régua conta>
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';

const [raizArg, saidaArg, reguaArg] = process.argv.slice(2);
if (!raizArg || !saidaArg || !reguaArg) throw new Error('uso: contar-destinos-l1.mjs <raiz> <saída.json> <páginas que a régua conta>');
const RAIZ = path.resolve(raizArg);
const DIST = path.join(RAIZ, 'dist');
const importa = (/** @type {string} */ rel) => import(pathToFileURL(path.join(RAIZ, rel)).href);
const { matchPath, routePath, normalizePath } = await importa('src/lib/routes.mjs');
const { ANCORA_DA_POLITICA } = await importa('src/data/politica-ia.mjs');
const { portasObrigatoriasB2 } = await importa('scripts/portas-b2.mjs');
const { documentoDosAssuntos } = await importa('tests/inicio/paginas-dos-assuntos.mjs');
const FICHEIROS_SEM_ROTA = new Set(['404.html', 'en/404/index.html']);

/** @param {string} d */
function paginasDe(d) {
  /** @type {string[]} */
  const out = [];
  const anda = (/** @type {string} */ x) => {
    for (const e of fs.readdirSync(x, { withFileTypes: true })) {
      const f = path.join(x, e.name);
      if (e.isDirectory()) anda(f);
      else if (e.name.endsWith('.html')) out.push(f);
    }
  };
  anda(d);
  return out.sort();
}

/** @type {Record<string, Record<string, number>>} */
const repetidosPorPagina = {};
for (const ficheiro of paginasDe(DIST)) {
  const rel = path.relative(DIST, ficheiro).split(path.sep).join('/');
  if (FICHEIROS_SEM_ROTA.has(rel)) continue;
  const url = normalizePath('/' + rel.replace(/index\.html$/, '').replace(/\.html$/, ''));
  const rota = matchPath(url);
  const chaveDaRota = rota?.key ?? null;
  const lang = rota?.lang ?? (rel.startsWith('en/') ? 'en' : 'pt');
  const raiz = parse(fs.readFileSync(ficheiro, 'utf8'));
  const corpo = raiz.querySelector('body');
  if (!corpo) continue;
  const daMobilia = new Set();
  for (const marco of [raiz.querySelector('header'), raiz.querySelector('footer')]) {
    if (!marco) continue;
    daMobilia.add(marco);
    for (const d of marco.querySelectorAll('*')) daMobilia.add(d);
  }
  const temas = chaveDaRota === 'home' ? documentoDosAssuntos(DIST, lang) : null;
  const b2 = portasObrigatoriasB2(raiz, chaveDaRota, lang, temas);
  /** @type {Map<string, number>} */
  const destinos = new Map();
  for (const a of corpo.querySelectorAll('a[href]')) {
    if (daMobilia.has(a) || b2.portas.has(a) || (chaveDaRota === 'estudo' && a.closest('[data-registo-unidade]'))) continue;
    const href = a.getAttribute('href') ?? '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) continue;
    if (a.matches('a.marcador') && a.closest('[data-cartao-definicao]') && href === routePath('marcador', lang)) continue;
    if (a.closest('[data-rotulo-ia="topo"]') && href === `${routePath('metodo', lang)}#${ANCORA_DA_POLITICA}`) continue;
    if (a.matches('a.marcador.marcador-de-titulo') && href === routePath('marcador', lang)) continue;
    if (a.matches('a.marcador.marcador-da-frase') && a.closest('[data-por-confirmar-na-fonte]') && href === routePath('marcador', lang)) continue;
    if (chaveDaRota === 'linha' && a.matches('a.def-origem-doc') && a.closest('[data-def-origem]')) {
      const pedido = corpo.querySelector('p.linha-pedido a.ligacao-externa')?.getAttribute('href') ?? null;
      if (pedido && href.split('#')[0].replace(/\/$/, '') === pedido.split('#')[0].replace(/\/$/, '')) continue;
    }
    const chave = href.split('#')[0].replace(/\/$/, '') || (href.startsWith('/') ? '/' : '');
    if (!chave) continue;
    destinos.set(chave, (destinos.get(chave) ?? 0) + 1);
  }
  const repetidos = [...destinos.entries()].filter(([, n]) => n > 1);
  if (repetidos.length) repetidosPorPagina[url] = Object.fromEntries(repetidos);
}
const paginas = Object.keys(repetidosPorPagina).length;
const regua = Number(reguaArg);
if (paginas !== regua) {
  console.error(`contar-destinos-l1: ${paginas} páginas com destino repetido, e a régua da mesma árvore conta ${regua}: a cópia da regra não é a da régua, e nada se escreve.`);
  process.exit(2);
}
fs.writeFileSync(path.resolve(saidaArg), `${JSON.stringify({ paginas, regua, repetidos_por_pagina: repetidosPorPagina }, null, 1)}\n`);
console.log(`contar-destinos-l1: ${paginas} páginas com destino repetido (a régua conta ${regua})`);
