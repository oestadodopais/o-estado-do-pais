#!/usr/bin/env node
/**
 * =============================================================================
 * A PORTA E A PÁGINA DOS LUGARES, PROVADAS NO NAVEGADOR · bloco L2a (01.10.2026)
 * =============================================================================
 *
 * ERA A PESQUISA DA PRIMEIRA PÁGINA, PROVADA A INTERAGIR (bloco PP1b, 28.09.2026), e muda de forma com a
 * página (§1.149): a primeira página deixou de ter a pesquisa e o mapa, que vivem em «Lugares», e passou a
 * ter a porta «Lugares» com um sinal. O que a célula protegia fica protegido onde a coisa vive agora, e a
 * lição continua a da §1.124: o que é interativo prova-se a interagir.
 *
 *   A PORTA · na primeira página, nas duas edições, a 390 e a 1 280 px: o sinal da porta «Lugares» está à
 *     vista, e tocar na porta abre a página dos lugares da mesma edição (e não um 404).
 *   A ORDEM · em «Lugares», nas duas edições e nas cinco larguras (390, 768, 1 024, 1 280 e 1 600 px), com o
 *     que o leitor vê e não com o atributo: abaixo de 1 024 px, a pesquisa, o mapa e só depois as duas
 *     gavetas, de cima para baixo; a partir de 1 024 px, o mapa à direita das gavetas e as gavetas por baixo
 *     da pesquisa. Nas duas formas as gavetas chegam fechadas: nenhum nome das listas à vista.
 *   AS GAVETAS · num navegador com o JavaScript desligado, o foco no `<summary>` das regiões e a tecla Enter
 *     abrem a lista (os nomes ficam à vista) e a mesma tecla fecha-a.
 *   SEM GUIÃO · a pesquisa dos lugares com o JavaScript desligado, que a H15 do `check:alvos` não cobre:
 *     «mourao» e Enter submetem o formulário para a página dos lugares da mesma edição, que abre; nela está
 *     à vista a porta do distrito que tem Mourão (uma área do mapa, que vem logo a seguir à pesquisa); e na
 *     página do distrito está à vista a porta de Mourão. Com guião, a mesma pesquisa é a H15.
 *
 * `--prova` corre quatro plantas, cada uma a trocar a página que o servidor entrega:
 *   · o mapa depois das gavetas em «Lugares»: a ordem a 390 morde;
 *   · a porta «Lugares» da primeira página para uma página que não existe: o toque dá 404;
 *   · o `<summary>` das regiões trocado por um bloco qualquer: o Enter já não abre a lista;
 *   · o formulário de «Lugares» sem destino: sem guião, o Enter dá 404.
 *
 * Uso: node tests/inicio/lugares-no-navegador.mjs [--prova] [--json saída]   (OEDP_DIST aponta outra construção)
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { parse } from 'node-html-parser';

import { routePath, LANGS } from '../../src/lib/routes.mjs';
import { ESCRITAS, ALVO } from '../acessibilidade/pesquisa.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('a porta e a página dos lugares · não existe dist/index.html. Corra o build primeiro.');
  process.exit(2);
}
const semBarra = (/** @type {unknown} */ s) => String(s ?? '').replace(/\/+$/, '') || '/';
const LARGURAS = [390, 768, 1024, 1280, 1600];

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };
const servidor = http.createServer((req, res) => {
  const semQuery = String(req.url ?? '/').split('?')[0];
  let f;
  try { f = path.resolve(DIST, '.' + decodeURIComponent(semQuery)); } catch { f = path.resolve(DIST, '.' + semQuery); }
  if (!f.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end('<!doctype html><title>404</title>');
  res.writeHead(200, { 'content-type': MIME[/** @type {keyof typeof MIME} */ (path.extname(f))] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', () => r(null)));
const endereco = /** @type {import('node:net').AddressInfo} */ (servidor.address());
const base = `http://127.0.0.1:${endereco.port}`;

/**
 * Uma planta: uma página de uma edição, trocada no que o servidor entrega.
 * @param {string} rota @param {(html: string) => string} troca
 */
const trocaPagina = (rota, troca) => async (/** @type {import('playwright').BrowserContext} */ contexto) => {
  const original = fs.readFileSync(path.join(DIST, rota.replace(/^\//, ''), 'index.html'), 'utf8');
  const trocado = troca(original);
  if (trocado === original) throw new Error('a planta não mudou a página');
  await contexto.route((u) => semBarra(new URL(u).pathname) === semBarra(rota), (r) => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: trocado }));
};

/**
 * A PORTA: o sinal à vista, e o toque na porta abre a página dos lugares da mesma edição.
 * @param {import('playwright').Browser} nav @param {'pt'|'en'} lang @param {number} largura
 * @param {{ preparar?: ((c: import('playwright').BrowserContext) => Promise<void>)|null }} [opcoes]
 */
async function medeAPorta(nav, lang, largura, { preparar = null } = {}) {
  const contexto = await nav.newContext({ viewport: { width: largura, height: 900 } });
  if (preparar) await preparar(contexto);
  const pagina = await contexto.newPage();
  /** @type {Record<string, any>} */
  const r = { lang, largura };
  try {
    await pagina.goto(base + routePath('home', lang), { waitUntil: 'load' });
    const porta = pagina.locator('[data-indice-assuntos] > li[data-entrada="lugares"] > a.pp-entrada');
    const sinal = porta.locator('svg[data-sinal-dos-lugares]');
    r.portas = await porta.count();
    r.sinalAVista = r.portas === 1 && (await sinal.count()) === 1 && (await sinal.isVisible());
    const caixa = r.sinalAVista ? await sinal.boundingBox() : null;
    r.sinal = caixa ? { largura: Math.round(caixa.width * 10) / 10, altura: Math.round(caixa.height * 10) / 10 } : null;
    if (r.portas === 1) {
      const [resposta] = await Promise.all([pagina.waitForNavigation({ timeout: 6000 }).catch(() => null), porta.click()]);
      r.estado = resposta?.status() ?? null;
      r.aterra = semBarra(new URL(pagina.url()).pathname);
    }
  } finally {
    await contexto.close();
  }
  r.passa = r.portas === 1 && r.sinalAVista && (r.sinal?.largura ?? 0) >= 20 && r.estado === 200 && r.aterra === semBarra(routePath('lugares', lang));
  return r;
}

/**
 * A ORDEM: as quatro peças de «Lugares» pelo que o leitor vê.
 * @param {import('playwright').Browser} nav @param {'pt'|'en'} lang @param {number} largura
 * @param {{ preparar?: ((c: import('playwright').BrowserContext) => Promise<void>)|null }} [opcoes]
 */
async function medeAOrdem(nav, lang, largura, { preparar = null } = {}) {
  const contexto = await nav.newContext({ viewport: { width: largura, height: 900 } });
  if (preparar) await preparar(contexto);
  const pagina = await contexto.newPage();
  /** @type {Record<string, any>} */
  const r = { lang, largura };
  try {
    await pagina.goto(base + routePath('lugares', lang), { waitUntil: 'load' });
    /** @param {string} sel */
    const caixa = async (sel) => {
      const l = pagina.locator(sel).first();
      if (!(await l.count()) || !(await l.isVisible())) return null;
      const b = await l.boundingBox();
      return b ? { cima: Math.round(b.y), baixo: Math.round(b.y + b.height), esquerda: Math.round(b.x), direita: Math.round(b.x + b.width) } : null;
    };
    r.pesquisa = await caixa('[data-pesquisa-bloco]');
    r.mapa = await caixa('[data-lugares-mapa]');
    r.regioes = await caixa('[data-dobra-lugares="regioes"] summary');
    r.distritos = await caixa('[data-dobra-lugares="distritos"] summary');
    let nomesAVista = 0;
    for (const a of await pagina.locator('ul[data-lista-lugares] a').all()) if (await a.isVisible()) nomesAVista++;
    r.nomesAVista = nomesAVista;
  } finally {
    await contexto.close();
  }
  const { pesquisa: p, mapa: m, regioes: g, distritos: d } = r;
  const todas = Boolean(p && m && g && d);
  r.forma = largura >= 1024 ? 'duas colunas' : 'uma coluna';
  r.ordemCerta = todas && (largura >= 1024
    ? m.esquerda >= Math.max(g.direita, d.direita, p.direita) && p.cima < g.cima && g.cima < d.cima && m.cima < g.baixo
    : p.cima < m.cima && m.baixo <= g.cima && g.cima < d.cima);
  r.passa = r.ordemCerta && r.nomesAVista === 0;
  return r;
}

/**
 * AS GAVETAS: sem guião, o foco no `<summary>` das regiões e o Enter abrem a lista, e o Enter fecha-a.
 * @param {import('playwright').Browser} nav @param {'pt'|'en'} lang
 * @param {{ preparar?: ((c: import('playwright').BrowserContext) => Promise<void>)|null }} [opcoes]
 */
async function medeAsGavetas(nav, lang, { preparar = null } = {}) {
  const contexto = await nav.newContext({ viewport: { width: 390, height: 900 }, javaScriptEnabled: false });
  if (preparar) await preparar(contexto);
  const pagina = await contexto.newPage();
  /** @type {Record<string, any>} */
  const r = { lang };
  try {
    await pagina.goto(base + routePath('lugares', lang), { waitUntil: 'load' });
    const nomes = pagina.locator('ul[data-lista-lugares="regioes"] a');
    const aVista = async () => { let n = 0; for (const a of await nomes.all()) if (await a.isVisible()) n++; return n; };
    r.nomes = await nomes.count();
    r.antes = await aVista();
    const sumario = pagina.locator('[data-dobra-lugares="regioes"] summary');
    r.sumarios = await sumario.count();
    if (r.sumarios === 1) {
      await sumario.focus();
      await pagina.keyboard.press('Enter');
      r.aberta = await aVista();
      await pagina.keyboard.press('Enter');
      r.fechada = await aVista();
    }
  } finally {
    await contexto.close();
  }
  r.passa = r.nomes > 0 && r.antes === 0 && r.sumarios === 1 && r.aberta === r.nomes && r.fechada === 0;
  return r;
}

/**
 * SEM GUIÃO: o que acontece a quem escreve «mourao» na pesquisa de «Lugares» e carrega em Enter com o
 * JavaScript desligado.
 * @param {import('playwright').Browser} nav @param {'pt'|'en'} lang
 * @param {{ preparar?: ((c: import('playwright').BrowserContext) => Promise<void>)|null }} [opcoes]
 */
async function medeSemGuiao(nav, lang, { preparar = null } = {}) {
  const rota = routePath('lugares', lang);
  const lugares = semBarra(rota);
  const destino = semBarra(routePath('municipio', lang, { slug: ALVO }));
  const prefixoDoDistrito = routePath('distrito', lang, { slug: 'x' }).replace(/x$/, '');
  const contexto = await nav.newContext({ viewport: { width: 390, height: 900 }, javaScriptEnabled: false });
  if (preparar) await preparar(contexto);
  const pagina = await contexto.newPage();
  /** @type {Record<string, any>} */
  const r = { lang, rota, escrita: ESCRITAS.unico };
  try {
    await pagina.goto(base + rota, { waitUntil: 'load' });
    const campo = pagina.locator('[data-pesquisa-bloco] input[type="search"]');
    r.campo = await campo.count();
    let aVista = 0;
    for (const a of await pagina.locator('[data-pesquisa-bloco] .pesquisa-item a[href]').all()) if (await a.isVisible()) aVista++;
    r.resultadosAVista = aVista;
    await campo.fill(ESCRITAS.unico);
    const [resposta] = await Promise.all([pagina.waitForNavigation({ timeout: 6000 }).catch(() => null), campo.press('Enter')]);
    const url = new URL(pagina.url());
    r.aterra = `${semBarra(url.pathname)}${url.search}`;
    r.estado = resposta?.status() ?? null;
    r.aterraNosLugares = semBarra(url.pathname) === lugares && url.searchParams.get('concelho') === ESCRITAS.unico;
    /** @type {string[]} */
    const portas = [];
    for (const a of await pagina.locator(`a[href^="${prefixoDoDistrito}"]`).all()) if (await a.isVisible()) portas.push(semBarra(await a.getAttribute('href')));
    r.portasDeDistritoAVista = new Set(portas).size;
    const doConcelho = [...new Set(portas)].find((h) => {
      const f = path.join(DIST, h.replace(/^\//, ''), 'index.html');
      return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes(`href="${destino}"`);
    }) ?? null;
    r.portaDoDistrito = doConcelho;
    r.portaDoConcelhoAVista = 0;
    if (doConcelho) {
      await pagina.goto(base + doConcelho, { waitUntil: 'load' });
      for (const a of await pagina.locator(`a[href="${destino}"]`).all()) if (await a.isVisible()) r.portaDoConcelhoAVista++;
    }
  } finally {
    await contexto.close();
  }
  r.passa = r.campo === 1 && r.resultadosAVista === 0 && r.estado === 200 && r.aterraNosLugares && r.portaDoDistrito !== null && r.portaDoConcelhoAVista > 0;
  return r;
}

/** @param {Record<string, any>} r */
const resumoDaPorta = (r) => `${r.lang} ${r.largura}: porta «Lugares» ${r.portas}× · sinal à vista ${r.sinalAVista ? `${r.sinal?.largura}×${r.sinal?.altura} px` : 'NÃO'} · o toque aterra em ${r.aterra ?? '?'} (${r.estado ?? 'sem resposta'})`;
/** @param {Record<string, any>} r */
const resumoDaOrdem = (r) => `${r.lang} ${r.largura} (${r.forma}): pesquisa ${r.pesquisa?.cima ?? '?'} · mapa ${r.mapa?.cima ?? '?'}–${r.mapa?.baixo ?? '?'} à esquerda ${r.mapa?.esquerda ?? '?'} · regiões ${r.regioes?.cima ?? '?'} · distritos ${r.distritos?.cima ?? '?'} · nomes à vista ${r.nomesAVista}`;
/** @param {Record<string, any>} r */
const resumoDasGavetas = (r) => `${r.lang} sem guião: ${r.nomes} nomes das regiões · à vista antes ${r.antes}, depois do Enter ${r.aberta ?? '?'}, depois do segundo Enter ${r.fechada ?? '?'}`;
/** @param {Record<string, any>} r */
const resumoSemGuiao = (r) =>
  `${r.lang} sem guião: ${r.resultadosAVista} resultado(s) à vista · «${r.escrita}» + Enter aterra em ${r.aterra} (${r.estado}) · ` +
  `${r.portasDeDistritoAVista} porta(s) de distrito à vista, a de Mourão ${r.portaDoDistrito ?? 'NENHUMA'} · a porta de Mourão à vista nela ${r.portaDoConcelhoAVista}×`;

const nav = await chromium.launch({ headless: true });
/** @type {any[]} */ const portas = [];
/** @type {any[]} */ const ordens = [];
/** @type {any[]} */ const gavetas = [];
/** @type {any[]} */ const semGuiao = [];
/** @type {{ nome: string, mordeu: boolean, queixa: string|null }[]} */
const plantas = [];
/** @param {string} nome @param {() => Promise<{ passa: boolean } & Record<string, any>>} corre @param {(r: any) => string} resumo @param {(r: any) => boolean} [mordeu] */
const planta = async (nome, corre, resumo, mordeu = (r) => !r.passa) => {
  try {
    const r = await corre();
    plantas.push({ nome, mordeu: mordeu(r), queixa: resumo(r) });
  } catch (e) {
    plantas.push({ nome, mordeu: false, queixa: `a planta rebentou: ${e instanceof Error ? e.message : e}` });
  }
};
try {
  for (const lang of /** @type {('pt'|'en')[]} */ (LANGS)) {
    for (const largura of [390, 1280]) portas.push(await medeAPorta(nav, lang, largura));
    for (const largura of LARGURAS) ordens.push(await medeAOrdem(nav, lang, largura));
    gavetas.push(await medeAsGavetas(nav, lang));
    semGuiao.push(await medeSemGuiao(nav, lang));
  }
  if (process.argv.includes('--prova')) {
    const lugaresPt = routePath('lugares', 'pt');
    await planta('o mapa depois das gavetas em «Lugares», a 390', () => medeAOrdem(nav, 'pt', 390, { preparar: trocaPagina(lugaresPt, (h) => {
      const root = parse(h, { comment: true });
      const m = root.querySelector('[data-lugares-mapa]');
      const html = m.outerHTML;
      m.remove();
      root.querySelector('[data-dobra-lugares="distritos"]').insertAdjacentHTML('afterend', html);
      return root.toString();
    }) }), resumoDaOrdem, (r) => !r.ordemCerta);
    /* A PORTA DO ÍNDICE, E NÃO A PRIMEIRA LIGAÇÃO PARA «LUGARES» DA PÁGINA: a primeira é a do menu, e a
       primeira redação desta planta trocava essa e não mordia (visto na primeira corrida). */
    await planta('a porta «Lugares» da primeira página para uma página que não existe', () => medeAPorta(nav, 'en', 390, { preparar: trocaPagina(routePath('home', 'en'), (h) => {
      const root = parse(h, { comment: true });
      root.querySelector('[data-indice-assuntos] > li[data-entrada="lugares"] > a.pp-entrada').setAttribute('href', '/en/places-that-do-not-exist/');
      return root.toString();
    }) }), resumoDaPorta, (r) => !r.passa && r.estado === 404);
    await planta('o <summary> das regiões trocado por um bloco qualquer', () => medeAsGavetas(nav, 'pt', { preparar: trocaPagina(lugaresPt, (h) => {
      const root = parse(h, { comment: true });
      const s = root.querySelector('[data-dobra-lugares="regioes"] summary');
      s.replaceWith(`<div class="gaveta-abrir">${s.innerHTML}</div>`);
      return root.toString();
    }) }), resumoDasGavetas);
    await planta('o formulário de «Lugares» sem destino', () => medeSemGuiao(nav, 'en', { preparar: trocaPagina(routePath('lugares', 'en'), (h) => h.replace(`action="${routePath('lugares', 'en')}"`, 'action="/en/places-that-do-not-exist/"')) }), resumoSemGuiao, (r) => !r.passa && r.estado === 404);
  }
} finally {
  await nav.close();
  servidor.close();
}

let versao = null;
try { versao = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8')).commit; } catch { versao = null; }
for (const r of portas) console.log(`${r.passa ? '✓' : '✗'} a porta · ${resumoDaPorta(r)}`);
for (const r of ordens) console.log(`${r.passa ? '✓' : '✗'} a ordem · ${resumoDaOrdem(r)}`);
for (const r of gavetas) console.log(`${r.passa ? '✓' : '✗'} as gavetas · ${resumoDasGavetas(r)}`);
for (const r of semGuiao) console.log(`${r.passa ? '✓' : '✗'} a pesquisa · ${resumoSemGuiao(r)}`);
for (const p of plantas) console.log(`  ${p.mordeu ? 'mordeu' : 'NÃO MORDEU'} · ${p.nome} · ${p.queixa}`);
const j = process.argv.indexOf('--json');
if (j !== -1) fs.writeFileSync(process.argv[j + 1], JSON.stringify({ dist_construido_de: versao, portas, ordens, gavetas, sem_guiao: semGuiao, plantas }, null, 2) + '\n');
const todas = [...portas, ...ordens, ...gavetas, ...semGuiao];
const falhou = todas.some((r) => !r.passa) || plantas.some((p) => !p.mordeu);
if (falhou) {
  console.error('a porta e a página dos lugares · há passos por cumprir ou plantas que não morderam.');
  process.exit(1);
}
console.log(`a porta e a página dos lugares · ${todas.length} medições no navegador, todas a cumprir${plantas.length ? ` · ${plantas.length} de ${plantas.length} plantas mordidas` : ''}.`);
