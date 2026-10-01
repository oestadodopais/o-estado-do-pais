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
 *   AS GAVETAS · num navegador com o JavaScript desligado, nas duas gavetas (as regiões, e os distritos e as
 *     ilhas), o foco no `<summary>` e a tecla Enter abrem a lista (os nomes todos ficam à vista) e a mesma
 *     tecla fecha-a.
 *   SEM GUIÃO · com o JavaScript desligado, que a H15 do `check:alvos` não cobre, duas medidas separadas (L2a-b):
 *     a pesquisa NÃO PROCURA (o formulário leva à página dos lugares da mesma edição, que é estática: recarrega
 *     com o que se escreveu no endereço e nenhum resultado à vista, e isso regista-se sem se dar por procura);
 *     e o caminho para um concelho são as gavetas (a porta do distrito de Mourão, dentro da gaveta dos
 *     distritos e das ilhas, só à vista com ela aberta, abre a página do distrito, onde a porta de Mourão está
 *     à vista e abre a página dele). Com guião, a pesquisa é a H15.
 *
 * `--prova` corre seis plantas, cada uma a trocar a página que o servidor entrega:
 *   · o mapa depois das gavetas em «Lugares»: a ordem a 390 morde;
 *   · a porta «Lugares» da primeira página para uma página que não existe: o toque dá 404;
 *   · o `<summary>` das regiões trocado por um bloco qualquer: o Enter já não abre essa lista;
 *   · o `<summary>` dos distritos e das ilhas trocado por um bloco qualquer: o Enter já não abre essa lista;
 *   · o formulário de «Lugares» sem destino: sem guião, o Enter dá 404;
 *   · a porta do distrito de Mourão tirada da gaveta: o caminho pelas gavetas deixa de chegar a Mourão.
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
 * AS GAVETAS: sem guião, em cada uma das duas (as regiões e os distritos e as ilhas), o foco no `<summary>` e o
 * Enter abrem a lista, com os nomes todos à vista, e o Enter fecha-a. A primeira redação só abria a das
 * regiões (L2a-b, o achado 6 da leitura a frio): a dos distritos e das ilhas, com os 29 nomes, ficava sem prova.
 * @param {import('playwright').Browser} nav @param {'pt'|'en'} lang
 * @param {{ preparar?: ((c: import('playwright').BrowserContext) => Promise<void>)|null }} [opcoes]
 */
async function medeAsGavetas(nav, lang, { preparar = null } = {}) {
  const contexto = await nav.newContext({ viewport: { width: 390, height: 900 }, javaScriptEnabled: false });
  if (preparar) await preparar(contexto);
  const pagina = await contexto.newPage();
  /** @type {Record<string, any>} */
  const r = { lang, gavetas: [] };
  try {
    await pagina.goto(base + routePath('lugares', lang), { waitUntil: 'load' });
    for (const chave of ['regioes', 'distritos']) {
      const nomes = pagina.locator(`ul[data-lista-lugares="${chave}"] a`);
      const aVista = async () => { let n = 0; for (const a of await nomes.all()) if (await a.isVisible()) n++; return n; };
      /** @type {Record<string, any>} */
      const g = { chave, nomes: await nomes.count(), antes: await aVista() };
      const sumario = pagina.locator(`[data-dobra-lugares="${chave}"] summary`);
      g.sumarios = await sumario.count();
      if (g.sumarios === 1) {
        await sumario.focus();
        await pagina.keyboard.press('Enter');
        g.aberta = await aVista();
        await pagina.keyboard.press('Enter');
        g.fechada = await aVista();
      }
      g.passa = g.nomes > 0 && g.antes === 0 && g.sumarios === 1 && g.aberta === g.nomes && g.fechada === 0;
      r.gavetas.push(g);
    }
  } finally {
    await contexto.close();
  }
  r.passa = r.gavetas.length === 2 && r.gavetas.every((/** @type {any} */ g) => g.passa);
  return r;
}

/**
 * SEM GUIÃO, MEDIDO COMO É (L2a-b, o achado 4 da leitura a frio). A primeira redação desta função contava como
 * uma procura o que não o era: sem guião, o formulário de «Lugares» submete para a própria página, que é
 * estática e não lê o que se escreveu; a página recarrega com «mourao» no endereço e nenhum resultado, e a
 * célula achava o distrito de Mourão pelas áreas do mapa, que a pesquisa não deu ao leitor. Agora mede as duas
 * coisas em separado, e só a segunda é um caminho:
 *
 *   · A PESQUISA SEM GUIÃO NÃO PROCURA. «mourao» e Enter levam à página dos lugares da mesma edição (e não a um
 *     404), com o que se escreveu no endereço, e nenhum resultado à vista. Regista-se o que acontece; não se
 *     exige uma procura que a página não faz.
 *   · O CAMINHO SEM GUIÃO PARA UM CONCELHO SÃO AS GAVETAS. A porta do distrito de Mourão (lida das páginas de
 *     distrito construídas, que são as que a têm) está dentro da gaveta dos distritos e das ilhas: escondida
 *     com a gaveta fechada, à vista depois de a abrir; tocá-la abre a página do distrito, e nela a porta de
 *     Mourão está à vista e abre a página de Mourão.
 * @param {import('playwright').Browser} nav @param {'pt'|'en'} lang
 * @param {{ preparar?: ((c: import('playwright').BrowserContext) => Promise<void>)|null }} [opcoes]
 */
async function medeSemGuiao(nav, lang, { preparar = null } = {}) {
  const rota = routePath('lugares', lang);
  const lugares = semBarra(rota);
  const destino = semBarra(routePath('municipio', lang, { slug: ALVO }));
  const contexto = await nav.newContext({ viewport: { width: 390, height: 900 }, javaScriptEnabled: false });
  if (preparar) await preparar(contexto);
  const pagina = await contexto.newPage();
  /** @type {Record<string, any>} */
  const r = { lang, rota, escrita: ESCRITAS.unico };
  const resultadosAVista = async () => { let n = 0; for (const a of await pagina.locator('[data-pesquisa-bloco] .pesquisa-item a[href]').all()) if (await a.isVisible()) n++; return n; };
  try {
    /* 1 · a pesquisa sem guião, como é */
    await pagina.goto(base + rota, { waitUntil: 'load' });
    const campo = pagina.locator('[data-pesquisa-bloco] input[type="search"]');
    r.campo = await campo.count();
    r.resultadosAntes = await resultadosAVista();
    await campo.fill(ESCRITAS.unico);
    const [resposta] = await Promise.all([pagina.waitForNavigation({ timeout: 6000 }).catch(() => null), campo.press('Enter')]);
    const url = new URL(pagina.url());
    r.aterra = `${semBarra(url.pathname)}${url.search}`;
    r.estado = resposta?.status() ?? null;
    r.aterraNosLugares = semBarra(url.pathname) === lugares && url.searchParams.get('concelho') === ESCRITAS.unico;
    r.resultadosDepois = await resultadosAVista();
    r.procura = r.resultadosDepois > 0;

    /* 2 · o caminho pelas gavetas: a porta do distrito de Mourão dentro da gaveta dos distritos e das ilhas */
    await pagina.goto(base + rota, { waitUntil: 'load' });
    const nomes = pagina.locator('ul[data-lista-lugares="distritos"] a');
    /** @type {string[]} */
    const destinos = [];
    for (const a of await nomes.all()) destinos.push(semBarra(await a.getAttribute('href')));
    const doDistrito = destinos.find((h) => {
      const f = path.join(DIST, h.replace(/^\//, ''), 'index.html');
      return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes(`href="${destino}"`);
    }) ?? null;
    r.portaDoDistrito = doDistrito;
    if (doDistrito) {
      const porta = pagina.locator(`ul[data-lista-lugares="distritos"] a[href="${doDistrito}"], ul[data-lista-lugares="distritos"] a[href="${doDistrito}/"]`).first();
      r.portaEscondidaComAGavetaFechada = !(await porta.isVisible());
      const sumario = pagina.locator('[data-dobra-lugares="distritos"] summary');
      await sumario.focus();
      await pagina.keyboard.press('Enter');
      r.portaAVistaComAGavetaAberta = await porta.isVisible();
      const [noDistrito] = await Promise.all([pagina.waitForNavigation({ timeout: 6000 }).catch(() => null), porta.click()]);
      r.estadoDoDistrito = noDistrito?.status() ?? null;
      /* A PORTA DE MOURÃO QUE SE TOCA É A DA LISTA DOS CONCELHOS DA PÁGINA DO DISTRITO (`#concelhos`). A área
         do mapa da mesma página também é uma porta, mas o toque do navegador sem cabeça cai no `<svg>`, e o
         caminho sem guião que esta medida descreve é o das listas. */
      const doConcelho = pagina.locator(`#concelhos a[href="${destino}"], #concelhos a[href="${destino}/"]`);
      r.portaDoConcelhoAVista = 0;
      for (const a of await doConcelho.all()) if (await a.isVisible()) r.portaDoConcelhoAVista++;
      if (r.portaDoConcelhoAVista) {
        const [noConcelho] = await Promise.all([pagina.waitForNavigation({ timeout: 6000 }).catch(() => null), doConcelho.first().click({ timeout: 6000 })]);
        r.estadoDoConcelho = noConcelho?.status() ?? null;
        r.aterraNoConcelho = semBarra(new URL(pagina.url()).pathname) === destino;
      }
    }
  } finally {
    await contexto.close();
  }
  r.passa = r.campo === 1 && r.resultadosAntes === 0 && r.estado === 200 && r.aterraNosLugares
    && r.portaDoDistrito !== null && r.portaEscondidaComAGavetaFechada === true && r.portaAVistaComAGavetaAberta === true
    && r.estadoDoDistrito === 200 && r.portaDoConcelhoAVista > 0 && r.estadoDoConcelho === 200 && r.aterraNoConcelho === true;
  return r;
}

/** @param {Record<string, any>} r */
const resumoDaPorta = (r) => `${r.lang} ${r.largura}: porta «Lugares» ${r.portas}× · sinal à vista ${r.sinalAVista ? `${r.sinal?.largura}×${r.sinal?.altura} px` : 'NÃO'} · o toque aterra em ${r.aterra ?? '?'} (${r.estado ?? 'sem resposta'})`;
/** @param {Record<string, any>} r */
const resumoDaOrdem = (r) => `${r.lang} ${r.largura} (${r.forma}): pesquisa ${r.pesquisa?.cima ?? '?'} · mapa ${r.mapa?.cima ?? '?'}–${r.mapa?.baixo ?? '?'} à esquerda ${r.mapa?.esquerda ?? '?'} · regiões ${r.regioes?.cima ?? '?'} · distritos ${r.distritos?.cima ?? '?'} · nomes à vista ${r.nomesAVista}`;
/** @param {Record<string, any>} r */
const resumoDasGavetas = (r) => `${r.lang} sem guião: ` + (r.gavetas ?? []).map((/** @type {any} */ g) => `${g.chave}, ${g.nomes} nomes · à vista antes ${g.antes}, depois do Enter ${g.aberta ?? '?'}, depois do segundo Enter ${g.fechada ?? '?'}`).join(' · ');
/** @param {Record<string, any>} r */
const resumoSemGuiao = (r) =>
  `${r.lang} sem guião: a pesquisa ${r.procura ? 'PROCURA' : 'não procura'}: «${r.escrita}» + Enter aterra em ${r.aterra} (${r.estado}), com ${r.resultadosDepois ?? '?'} resultado(s) à vista · ` +
  `o caminho pelas gavetas: a porta de ${r.portaDoDistrito ?? 'NENHUM distrito'} escondida com a gaveta fechada ${r.portaEscondidaComAGavetaFechada ?? '?'}, à vista com ela aberta ${r.portaAVistaComAGavetaAberta ?? '?'}, ` +
  `abre (${r.estadoDoDistrito ?? '?'}) e nela a porta de Mourão à vista ${r.portaDoConcelhoAVista ?? 0}×, que abre (${r.estadoDoConcelho ?? '?'})`;

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
    }) }), resumoDasGavetas, (r) => r.gavetas?.find((/** @type {any} */ g) => g.chave === 'regioes')?.passa === false);
    /* L2a-b (o achado 6): a mesma planta na gaveta dos distritos e das ilhas, na edição inglesa. */
    await planta('o <summary> dos distritos e das ilhas trocado por um bloco qualquer', () => medeAsGavetas(nav, 'en', { preparar: trocaPagina(routePath('lugares', 'en'), (h) => {
      const root = parse(h, { comment: true });
      const s = root.querySelector('[data-dobra-lugares="distritos"] summary');
      s.replaceWith(`<div class="gaveta-abrir">${s.innerHTML}</div>`);
      return root.toString();
    }) }), resumoDasGavetas, (r) => r.gavetas?.find((/** @type {any} */ g) => g.chave === 'distritos')?.passa === false);
    /* L2a-b (o achado 4): o distrito de Mourão tirado da gaveta. As áreas do mapa continuam a levar a ele, e a
       primeira redação desta célula passava por elas; agora o caminho medido é o da gaveta, e a planta morde. */
    await planta('a porta do distrito de Mourão tirada da gaveta dos distritos e das ilhas', () => medeSemGuiao(nav, 'pt', { preparar: trocaPagina(lugaresPt, (h) => {
      const root = parse(h, { comment: true });
      const lista = root.querySelectorAll('ul[data-lista-lugares="distritos"] li');
      const comMourao = lista.find((li) => {
        const h2 = li.querySelector('a')?.getAttribute('href') ?? '';
        const f = path.join(DIST, h2.replace(/^\//, ''), 'index.html');
        return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes(`href="${semBarra(routePath('municipio', 'pt', { slug: ALVO }))}"`);
      });
      comMourao?.remove();
      return root.toString();
    }) }), resumoSemGuiao, (r) => !r.passa && r.portaDoDistrito === null);
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
