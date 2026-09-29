#!/usr/bin/env node
/**
 * =============================================================================
 * A PESQUISA DA PRIMEIRA PÁGINA, PROVADA A INTERAGIR · bloco PP1b (28.09.2026)
 * =============================================================================
 *
 * PORQUE EXISTE. A leitura a frio do PP1 (achado 7) viu que a primeira página ganhou a pesquisa dos
 * lugares (`Pesquisa.astro`, a mesma da página dos lugares, com o formulário que leva à página dos
 * lugares) e que nenhuma célula tinha escrito no campo dela: a H15 escreve no da página dos lugares. A
 * lição está na §1.124, «o que é interativo prova-se a interagir», e esta célula é essa prova.
 *
 * COM GUIÃO, nas duas edições e nas duas larguras da casa, os cinco passos de `medePesquisa()`
 * (`tests/acessibilidade/pesquisa.mjs`): o campo vazio sem resultados à vista; «mour» com a porta de
 * Mourão à vista; o Enter com vários resultados, que não sai da página; «xyzq», com a frase de nenhum
 * resultado à vista e o Enter que não sai; e «mourao», cujo Enter abre a página de Mourão.
 *
 * SEM GUIÃO, num navegador com o JavaScript desligado, diz o que acontece e exige que seja isto: a
 * fila dos resultados não está à vista; o Enter submete o formulário para a página dos lugares da mesma
 * edição, com o que se escreveu no endereço, e a página abre; nela está à vista a porta do distrito que
 * tem Mourão; e na página do distrito está à vista a porta de Mourão. É o caminho sem guião que a página
 * dos lugares dá: o mapa e as listas, sem filtro nenhum.
 *
 * `--prova` corre as duas plantas, cada uma a trocar a primeira página que o servidor entrega:
 *   · a ligação do campo partida (o bloco sem a marca `data-pesquisa-bloco`, que é por onde o guião
 *     encontra o campo): escrever «mour» deixa de mostrar Mourão;
 *   · o formulário sem destino (a ação para uma página que não existe): sem guião, o Enter dá 404.
 *
 * Uso: node tests/inicio/pesquisa-da-primeira.mjs [--prova] [--json saída]   (OEDP_DIST aponta outra construção)
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

import { routePath, LANGS } from '../../src/lib/routes.mjs';
import { medePesquisa, resumoDaPesquisa, ESCRITAS, ALVO } from '../acessibilidade/pesquisa.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('pesquisa da primeira página · não existe dist/index.html. Corra o build primeiro.');
  process.exit(2);
}
const semBarra = (/** @type {unknown} */ s) => String(s ?? '').replace(/\/+$/, '') || '/';

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
 * SEM GUIÃO: o que acontece a quem escreve «mourao» e carrega em Enter com o JavaScript desligado.
 *
 * @param {import('playwright').Browser} nav @param {'pt'|'en'} lang
 * @param {{ preparar?: ((c: import('playwright').BrowserContext) => Promise<void>)|null }} [opcoes]
 */
async function medeSemGuiao(nav, lang, { preparar = null } = {}) {
  const rota = routePath('home', lang);
  const lugares = semBarra(routePath('lugares', lang));
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
    const [resposta] = await Promise.all([
      pagina.waitForNavigation({ timeout: 6000 }).catch(() => null),
      campo.press('Enter'),
    ]);
    const url = new URL(pagina.url());
    r.aterra = `${semBarra(url.pathname)}${url.search}`;
    r.estado = resposta?.status() ?? null;
    r.aterraNosLugares = semBarra(url.pathname) === lugares && url.searchParams.get('concelho') === ESCRITAS.unico;
    /* As portas de distrito à vista na página onde se aterrou, e a que leva a Mourão (lida da construção). */
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
const resumoSemGuiao = (r) =>
  `${r.lang} sem guião: ${r.resultadosAVista} resultado(s) à vista · «${r.escrita}» + Enter aterra em ${r.aterra} (${r.estado}) · ` +
  `${r.portasDeDistritoAVista} porta(s) de distrito à vista, a de Mourão ${r.portaDoDistrito ?? 'NENHUMA'} · a porta de Mourão à vista nela ${r.portaDoConcelhoAVista}×`;

/**
 * Uma planta: a primeira página de uma edição, trocada no que o servidor entrega.
 * @param {'pt'|'en'} lang @param {(html: string) => string} troca
 */
const trocaPrimeira = (lang, troca) => async (/** @type {import('playwright').BrowserContext} */ contexto) => {
  const rota = semBarra(routePath('home', lang));
  const original = fs.readFileSync(path.join(DIST, rota.replace(/^\//, ''), 'index.html'), 'utf8');
  const trocado = troca(original);
  if (trocado === original) throw new Error('a planta não mudou a página');
  await contexto.route((u) => semBarra(new URL(u).pathname) === rota, (r) => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: trocado }));
};

const nav = await chromium.launch({ headless: true });
/** @type {any[]} */
const comGuiao = [];
/** @type {any[]} */
const semGuiao = [];
/** @type {{ nome: string, mordeu: boolean, queixa: string|null }[]} */
const plantas = [];
try {
  for (const lang of LANGS) {
    for (const largura of [390, 1280]) comGuiao.push(await medePesquisa(nav, base, /** @type {'pt'|'en'} */ (lang), largura, { rota: routePath('home', lang) }));
    semGuiao.push(await medeSemGuiao(nav, /** @type {'pt'|'en'} */ (lang)));
  }
  if (process.argv.includes('--prova')) {
    try {
      const m = await medePesquisa(nav, base, 'pt', 390, { rota: routePath('home', 'pt'), preparar: trocaPrimeira('pt', (h) => h.replace('data-pesquisa-bloco', 'data-pesquisa-bloco-partido')) });
      plantas.push({ nome: 'a ligação do campo partida na primeira página', mordeu: !m.passa && !m.mouraoVisivel, queixa: resumoDaPesquisa(m) });
    } catch (e) {
      plantas.push({ nome: 'a ligação do campo partida na primeira página', mordeu: false, queixa: `a planta rebentou: ${e instanceof Error ? e.message : e}` });
    }
    try {
      const lugares = routePath('lugares', 'en');
      const s = await medeSemGuiao(nav, 'en', { preparar: trocaPrimeira('en', (h) => h.replace(`action="${lugares}"`, 'action="/en/places-that-do-not-exist/"')) });
      plantas.push({ nome: 'o formulário da primeira página sem destino', mordeu: !s.passa && s.estado === 404, queixa: resumoSemGuiao(s) });
    } catch (e) {
      plantas.push({ nome: 'o formulário da primeira página sem destino', mordeu: false, queixa: `a planta rebentou: ${e instanceof Error ? e.message : e}` });
    }
  }
} finally {
  await nav.close();
  servidor.close();
}

let versao = null;
try { versao = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8')).commit; } catch { versao = null; }
for (const m of comGuiao) console.log(`${m.passa ? '✓' : '✗'} primeira página · ${resumoDaPesquisa(m)}`);
for (const s of semGuiao) console.log(`${s.passa ? '✓' : '✗'} primeira página · ${resumoSemGuiao(s)}`);
for (const p of plantas) console.log(`  ${p.mordeu ? 'mordeu' : 'NÃO MORDEU'} · ${p.nome} · ${p.queixa}`);
const j = process.argv.indexOf('--json');
if (j !== -1) fs.writeFileSync(process.argv[j + 1], JSON.stringify({ dist_construido_de: versao, com_guiao: comGuiao, sem_guiao: semGuiao, plantas }, null, 2) + '\n');
const falhou = comGuiao.some((m) => !m.passa) || semGuiao.some((s) => !s.passa) || plantas.some((p) => !p.mordeu);
if (falhou) {
  console.error('pesquisa da primeira página · há passos por cumprir ou plantas que não morderam.');
  process.exit(1);
}
console.log(`pesquisa da primeira página · ${comGuiao.length} passagens com guião e ${semGuiao.length} sem guião, todas a cumprir${plantas.length ? ` · ${plantas.length} de ${plantas.length} plantas mordidas` : ''}.`);
