#!/usr/bin/env node
// Medição cega M4 · o mapa é navegação · medidor: Claude Sonnet
//
// Código do zero, sem importar nada do construtor. Lê os dois `dist/` já
// construídos (congelados em scratchpad) e serve-os localmente; compara
// "antes" (main, no ar) com "depois" (ramo mapa-navegacao-2026-08-26).
//
// Corre com: node design/especime-v3/medicoes/mapa-navegacao-M4-sonnet.mjs
// (a partir da raiz do repositório, para o import de "playwright" resolver).

import { chromium, devices } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = '/Users/nunosantos/Instruments/OEstadoDoPais';
const SCRATCH = '/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad';
const DIST_DEPOIS = path.join(SCRATCH, 'dist-mapa-depois');
const DIST_ANTES = path.join(SCRATCH, 'dist-antes-mapa');
const PORT_DEPOIS = 4611;
const PORT_ANTES = 4612;
const URL_DEPOIS = `http://localhost:${PORT_DEPOIS}`;
const URL_ANTES = `http://localhost:${PORT_ANTES}`;
const LIVE = 'https://xn--oestadodopas-2fb.pt';

const OUT_JSON = path.join(__dirname, 'mapa-navegacao-M4-sonnet.resultados.json');
const OUT_LOG = path.join(__dirname, 'mapa-navegacao-M4-sonnet.execucao.log');

const DESKTOP_VIEWPORTS = [
  { width: 1280, height: 800, label: '1280' },
  { width: 2000, height: 1184, label: '2000' },
];

// ---------------------------------------------------------------- registo --
const log = [];
function P(...args) {
  const line = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  log.push(line);
  console.log(line);
}
function section(title) {
  P('');
  P('═══ ' + title + ' ═══');
}

const results = { meta: {}, items: {}, knownCases: [], falseAlarms: [], disagreements: [], notas: [] };

function recordKnownCase(detector, expected, observed, passedRed, method) {
  results.knownCases.push({ detector, expected, observed, passedRed, method });
  P(`  [caso conhecido] ${detector}: esperado=${expected} | observado=${JSON.stringify(observed)} | vermelho=${passedRed ? 'SIM' : 'NÃO'}`);
}
function recordFalseAlarm(detector, cause) {
  results.falseAlarms.push({ detector, cause });
  P(`  [falso alarme] ${detector}: ${cause}`);
}
function recordDisagreement(ref, coord, evidence) {
  results.disagreements.push({ ref, coord, evidence });
  P(`  [discordância] ${ref} @ ${coord}: ${evidence}`);
}

// --------------------------------------------------------------- servidor --
async function healthCheck(url) {
  try {
    const r = await fetch(url + '/', { signal: AbortSignal.timeout(2000) });
    return r.status < 500;
  } catch { return false; }
}

async function isPortFree(port) {
  return new Promise(resolve => {
    const srv = net.createServer();
    srv.once('error', () => resolve(false));
    srv.once('listening', () => srv.close(() => resolve(true)));
    srv.listen(port, '127.0.0.1');
  });
}

const spawnedServers = [];
async function ensureServer(dir, port, url) {
  if (await healthCheck(url)) {
    P(`  servidor já ativo em ${url} (não iniciado por este programa)`);
    return null;
  }
  if (!(await isPortFree(port))) {
    throw new Error(`porto ${port} está ocupado por outra coisa (não responde como servidor http válido) -- escolhe outro porto`);
  }
  P(`  porto ${port} livre. a iniciar: python3 -m http.server ${port}  (cwd=${dir})`);
  const child = spawn('python3', ['-m', 'http.server', String(port)], { cwd: dir, stdio: 'ignore', detached: true });
  spawnedServers.push(child);
  for (let i = 0; i < 30; i++) {
    if (await healthCheck(url)) { P(`  servidor pronto em ${url}`); return child; }
    await sleep(200);
  }
  throw new Error(`servidor em ${url} não respondeu a tempo`);
}

function stopSpawnedServers() {
  for (const child of spawnedServers) {
    try { process.kill(-child.pid); } catch { try { child.kill(); } catch {} }
  }
}

// ------------------------------------------------------------- ficheiros --
function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }

function walkFiles(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, base));
    else out.push(path.relative(base, full));
  }
  return out.sort();
}

function compareTrees(dirA, dirB) {
  const filesA = new Set(walkFiles(dirA));
  const filesB = new Set(walkFiles(dirB));
  const onlyA = [...filesA].filter(f => !filesB.has(f));
  const onlyB = [...filesB].filter(f => !filesA.has(f));
  const common = [...filesA].filter(f => filesB.has(f));
  const differing = [];
  for (const f of common) {
    const bufA = fs.readFileSync(path.join(dirA, f));
    const bufB = fs.readFileSync(path.join(dirB, f));
    if (!bufA.equals(bufB)) differing.push({ file: f, sizeA: bufA.length, sizeB: bufB.length });
  }
  return { onlyA, onlyB, commonCount: common.length, differing };
}

// -------------------------------------------------------- Playwright util --
async function newDesktopPage(browser, vp) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  return { ctx, page };
}
async function newMobilePage(browser) {
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  return { ctx, page };
}

async function gotoSettled(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(250);
  return page.url();
}

async function clickConcelho(page) {
  await page.locator('a.seg[data-modo="municipio"]').first().click();
  await page.waitForTimeout(350);
}

async function visibleCabeca(page) {
  return page.evaluate(() => {
    const blocks = [...document.querySelectorAll('.cabeca-bloco[data-cabeca]')];
    const visible = blocks.filter(e => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    });
    if (visible.length === 0) {
      // reserva: h1 do masthead, para nao ficar sem numero nenhum
      const h1 = document.querySelector('h1');
      return { fallback: true, count: 0, dataCabeca: null, texto: h1 ? h1.textContent.trim() : null };
    }
    return {
      fallback: false,
      count: visible.length,
      dataCabeca: visible.map(e => e.getAttribute('data-cabeca')),
      texto: visible.map(e => e.querySelector('.cabeca-rotulo')?.textContent?.trim() || e.textContent.trim().slice(0, 60)),
    };
  });
}

async function rootAmbito(page) {
  return page.evaluate(() => document.querySelector('[data-ambito]')?.getAttribute('data-ambito') ?? null);
}

async function mapSvgBox(page) {
  const loc = page.locator('svg.mapa-svg, svg[data-mapa]').first();
  const count = await loc.count();
  if (count === 0) return { count: 0, box: null };
  const box = await loc.boundingBox().catch(() => null);
  return { count, box };
}

async function docSize(page) {
  return page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight }));
}

async function svgChildTransforms(page) {
  // qualquer nó DENTRO do svg do mapa (excluindo o próprio svg) com transform != none, computado OU por atributo
  return page.evaluate(() => {
    const svg = document.querySelector('svg.mapa-svg, svg[data-mapa]');
    if (!svg) return { svgExists: false, count: 0, sample: [] };
    const nodes = [...svg.querySelectorAll('*')];
    const withTransform = [];
    for (const n of nodes) {
      const cs = getComputedStyle(n).transform;
      const attr = n.getAttribute('transform');
      if ((cs && cs !== 'none') || attr) {
        withTransform.push({ tag: n.tagName, cls: n.getAttribute('class'), computed: cs, attr });
      }
    }
    return { svgExists: true, count: withTransform.length, sample: withTransform.slice(0, 5) };
  });
}

async function countLoc(page, sel) {
  return page.locator(sel).count();
}

async function focusedElement(page) {
  return page.evaluate(() => {
    const a = document.activeElement;
    if (!a) return null;
    return { tag: a.tagName, id: a.id || null, cls: a.getAttribute ? a.getAttribute('class') : null, href: a.getAttribute ? a.getAttribute('href') : null };
  });
}

async function searchBlockState(page) {
  const input = page.locator('#pesquisa-concelho, [data-pesquisa]').first();
  const count = await input.count();
  if (count === 0) return { existe: false, visivel: false, box: null };
  const visivel = await input.isVisible().catch(() => false);
  const box = await input.boundingBox().catch(() => null);
  return { existe: true, visivel, box };
}

// scroll o alvo para dentro do ecrã e devolve um ponto seguro (dentro do
// elemento E dentro do viewport) para posicionar o rato -- ver nota da
// descoberta: o bounding box do svg do mapa (quando cresce) ultrapassa
// facilmente os 800px do ecrã, e um mouse.move para um y fora do viewport
// não acerta em nada (elementFromPoint devolve null), pelo que a roda não
// tem efeito nenhum -- nem sequer o scroll normal da página é o que se testa.
async function safeHoverPoint(page, locator) {
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const box = await locator.boundingBox();
  const vp = page.viewportSize();
  if (!box) return null;
  const px = box.x + box.width / 2;
  const py = Math.max(box.y + 5, Math.min(box.y + box.height - 5, vp.height / 2));
  return { px, py, box };
}

// ============================================================ ITEM 1 =====
async function medirItem1(browser) {
  section('1 · O mapa não cresce');
  const estados = [
    { id: 'A_pais', desc: 'em / (país)', run: async page => { await gotoSettled(page, page.__base + '/'); } },
    { id: 'B_municipio_url', desc: 'em /?ambito=municipio (navegação direta)', run: async page => { await gotoSettled(page, page.__base + '/?ambito=municipio'); } },
    { id: 'C_concelho_clique', desc: 'depois de clique real em «Concelho»', run: async page => { await gotoSettled(page, page.__base + '/'); await clickConcelho(page); } },
  ];

  const tabela = [];
  for (const vp of DESKTOP_VIEWPORTS) {
    for (const estado of estados) {
      const row = { viewport: vp.label, estado: estado.id, estadoDesc: estado.desc, antes: null, depois: null };
      for (const [chave, base] of [['antes', URL_ANTES], ['depois', URL_DEPOIS]]) {
        const { ctx, page } = await newDesktopPage(browser, vp);
        page.__base = base;
        try {
          await estado.run(page);
          const svg = await mapSvgBox(page);
          const doc = await docSize(page);
          const transforms = await svgChildTransforms(page);
          const fechar = await countLoc(page, '.mapa-fechar');
          const dataCampo = await countLoc(page, '[data-campo]');
          const cabeca = await visibleCabeca(page);
          const pesquisa = await searchBlockState(page);
          const foco = await focusedElement(page);
          row[chave] = {
            url: page.url(),
            svgCount: svg.count,
            svgBox: svg.box ? { w: Math.round(svg.box.width), h: Math.round(svg.box.height) } : null,
            docSize: { w: doc.w, h: doc.h },
            transformsDentroDoSvg: transforms.count,
            transformsAmostra: transforms.sample,
            mapaFecharCount: fechar,
            dataCampoCount: dataCampo,
            cabecaVisivel: cabeca,
            pesquisaVisivel: pesquisa.visivel,
            pesquisaBox: pesquisa.box ? { x: Math.round(pesquisa.box.x), y: Math.round(pesquisa.box.y), w: Math.round(pesquisa.box.width), h: Math.round(pesquisa.box.height) } : null,
            foco,
          };
        } catch (e) {
          row[chave] = { erro: String(e).slice(0, 300) };
        } finally {
          await ctx.close();
        }
      }
      tabela.push(row);
      P(`  [${vp.label}px | ${estado.id}] antes svg=${JSON.stringify(row.antes?.svgBox)} fechar=${row.antes?.mapaFecharCount} dataCampo=${row.antes?.dataCampoCount}  ->  depois svg=${JSON.stringify(row.depois?.svgBox)} fechar=${row.depois?.mapaFecharCount} dataCampo=${row.depois?.dataCampoCount}`);
    }
  }

  // caso conhecido: no ar, /?ambito=municipio a 1280 tem o mapa a 1092x1438 e .mapa-fechar existe.
  const casoLinha = tabela.find(r => r.viewport === '1280' && r.estado === 'B_municipio_url');
  const box = casoLinha?.antes?.svgBox;
  const fecharExiste = (casoLinha?.antes?.mapaFecharCount ?? 0) >= 1;
  const bateCerto = box && Math.abs(box.w - 1092) <= 3 && Math.abs(box.h - 1438) <= 3 && fecharExiste;
  recordKnownCase(
    'item1.mapaCresce (svg box + .mapa-fechar em /?ambito=municipio, 1280, antes)',
    'svg ≈ 1092×1438 px e .mapa-fechar existe',
    { svgBox: box, mapaFecharCount: casoLinha?.antes?.mapaFecharCount },
    bateCerto,
    'goto(antes, /?ambito=municipio) @1280 -> boundingBox do svg.mapa-svg + count(.mapa-fechar)'
  );

  // Emenda 19(c): "a página continua a ser a do país [depois de clicar em «Concelho»]".
  // O mapa, a cabeça e o painel confirmam-se inalterados (colunas acima); mas o ENDEREÇO e o
  // data-ambito da raiz mudam de / e "pais" para /?ambito=municipio e "municipio". Regista-se
  // como discordância a examinar (não é claro se "a página continua a ser a do país" cobre o
  // endereço/data-ambito ou só o conteúdo visível -- por isso reporta-se com os dois números,
  // não se decide por conta própria).
  for (const linha of tabela.filter(r => r.estado === 'C_concelho_clique')) {
    const d = linha.depois;
    if (d && (d.url.endsWith('?ambito=municipio') || d.foco)) {
      const urlMudouDePais = !d.url.endsWith('/') || d.url.includes('?ambito=municipio');
      if (urlMudouDePais) {
        recordDisagreement(
          'Emenda 19(c) · "não muda o mapa, a cabeça nem o painel; a página continua a ser a do país"',
          `/ (depois de clicar em «Concelho», ${linha.viewport}px, depois)`,
          `mapa/cabeça/painel confirmados inalterados (ver tabela do item 1), mas o endereço muda de "/" para "${d.url.replace(URL_DEPOIS, '')}" e a raiz passa a ter data-ambito="municipio" (era "pais") -- não se decide aqui se isto viola "a página continua a ser a do país"; regista-se com os dois valores para o lugar de direção julgar.`
        );
      }
    }
  }

  results.items['1'] = { titulo: 'O mapa não cresce', tabela };
}

// ============================================================ ITEM 2 =====
async function medirItem2(browser) {
  section('2 · A roda é da página');
  recordFalseAlarm(
    'primeira tentativa do caso conhecido do item 2 (antes)',
    'usar o centro do boundingBox do svg (sem o levar antes para dentro do ecrã) dá um ponto fora do viewport quando o mapa cresce para 1438px de altura num ecrã de 800px (y≈1525 quando o viewport só tem 800px); document.elementFromPoint nesse ponto devolve null, a roda não acerta em nada, e 5x para baixo faziam scroll normal (parecendo que a página "não estava presa") e 5x para cima não escreviam nenhum transform (parecendo que não havia zoom) -- as DUAS metades do caso conhecido liam falso, não porque o mapa antigo não prendesse a roda, mas porque o rato nunca esteve sobre o mapa. Corrigido com scrollIntoViewIfNeeded() + um ponto dentro do elemento E do viewport (ver safeHoverPoint); confirmado com o site no ar e com o motor webkit também, antes de aceitar a correção.'
  );

  async function testeRoda(base, vpLabel, vpObj) {
    const { ctx, page } = await newDesktopPage(browser, vpObj);
    try {
      await gotoSettled(page, base + '/');
      await clickConcelho(page);
      const svgLoc = page.locator('svg.mapa-svg, svg[data-mapa]').first();
      const svgCount = await svgLoc.count();
      if (svgCount === 0) {
        return { svgExists: false };
      }
      const pt = await safeHoverPoint(page, svgLoc);
      if (!pt) return { svgExists: true, semHoverPoint: true };
      await page.mouse.move(pt.px, pt.py);
      const scrollAntesDown = await page.evaluate(() => window.scrollY);
      for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(90); }
      await page.waitForTimeout(150);
      const scrollDepoisDown = await page.evaluate(() => window.scrollY);
      const transformsAposDown = await svgChildTransforms(page);

      // reposiciona (o scroll pode ter deslocado o alvo no ecrã) antes do lote de "para cima"
      const pt2 = await safeHoverPoint(page, svgLoc);
      if (pt2) await page.mouse.move(pt2.px, pt2.py);
      for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, -120); await page.waitForTimeout(90); }
      await page.waitForTimeout(150);
      const scrollDepoisUp = await page.evaluate(() => window.scrollY);
      const transformsAposUp = await svgChildTransforms(page);

      return {
        svgExists: true,
        scrollY: { antes: scrollAntesDown, aposDescer5: scrollDepoisDown, aposSubir5: scrollDepoisUp },
        paginaMoveuAoDescer: scrollDepoisDown !== scrollAntesDown,
        transformsDentroSvgAposDescer: transformsAposDown.count,
        transformsDentroSvgAposSubir: transformsAposUp.count,
        amostraTransformAposSubir: transformsAposUp.sample,
      };
    } finally {
      await ctx.close();
    }
  }

  const tabela = [];
  for (const vp of DESKTOP_VIEWPORTS) {
    const antes = await testeRoda(URL_ANTES, vp.label, vp);
    const depois = await testeRoda(URL_DEPOIS, vp.label, vp);
    tabela.push({ viewport: vp.label, antes, depois });
    P(`  [${vp.label}px] antes: moveu-pagina-ao-descer=${antes.paginaMoveuAoDescer} transforms-apos-subir=${antes.transformsDentroSvgAposSubir}  |  depois: moveu-pagina-ao-descer=${depois.paginaMoveuAoDescer} transforms-apos-subir=${depois.transformsDentroSvgAposSubir}`);
  }

  // caso conhecido: no ar (1280), 5 para baixo NÃO movem a página; 5 para cima escrevem scale(1.47...) em [data-campo]
  const linha1280 = tabela.find(r => r.viewport === '1280');
  const a = linha1280.antes;
  const naoMoveu = a.paginaMoveuAoDescer === false;
  const escalaAmostra = (a.amostraTransformAposSubir || []).find(t => (t.attr || '').includes('scale'));
  const escala147 = escalaAmostra && /scale\(1\.4[0-9]/.test(escalaAmostra.attr || escalaAmostra.computed || '');
  recordKnownCase(
    'item2.rodaMapa (scrollY + transform em [data-campo], antes, 1280, após Concelho)',
    'scrollY inalterado ao descer 5x; scale(1.47…) escrito em [data-campo] ao subir 5x',
    { paginaMoveuAoDescer: a.paginaMoveuAoDescer, amostraTransformAposSubir: a.amostraTransformAposSubir },
    naoMoveu && !!escala147,
    'scrollIntoViewIfNeeded + hover no centro visível do svg + mouse.wheel(0,±120)×5, medindo window.scrollY e getComputedStyle/getAttribute(transform) de todos os nós dentro do svg'
  );

  results.items['2'] = { titulo: 'A roda é da página', tabela };
}

// ============================================================ ITEM 3 =====
async function medirItem3(browser) {
  section('3 · Os endereços antigos');
  const casos = [
    { path: '/?ambito=municipio:evora', esperadoDepois: '/municipios/evora' },
    { path: '/?ambito=municipio:braganca', esperadoDepois: '/municipios' },
    { path: '/?ambito=regiao:alentejo', esperadoDepois: null },
    { path: '/?ambito=lixo', esperadoDepois: null },
  ];
  const tabela = [];
  for (const caso of casos) {
    const row = { path: caso.path, esperadoDepois: caso.esperadoDepois };
    for (const [chave, base] of [['antes', URL_ANTES], ['depois', URL_DEPOIS]]) {
      const { ctx, page } = await newDesktopPage(browser, DESKTOP_VIEWPORTS[0]);
      try {
        await gotoSettled(page, base + caso.path);
        const ambito = await rootAmbito(page);
        const cabeca = await visibleCabeca(page);
        row[chave] = { urlFinal: page.url().replace(base, ''), dataAmbito: ambito, cabecaTexto: cabeca.texto };
      } catch (e) {
        row[chave] = { erro: String(e).slice(0, 300) };
      } finally {
        await ctx.close();
      }
    }
    tabela.push(row);
    P(`  ${caso.path} -> antes: url=${row.antes.urlFinal} ambito=${row.antes.dataAmbito}  |  depois: url=${row.depois.urlFinal} ambito=${row.depois.dataAmbito}`);
  }
  results.items['3'] = { titulo: 'Os endereços antigos', tabela };
}

// ============================================================ ITEM 4 =====
async function medirItem4(browser) {
  section('4 · Os pontos');
  const vp = DESKTOP_VIEWPORTS[0]; // 1280
  const tabela = {};
  recordFalseAlarm(
    'primeira tentativa do caso conhecido do item 4 (clique em Bragança, antes)',
    'clicar no ponto de Bragança a partir de / simples (sem passar por «Concelho» / /?ambito=municipio primeiro) não muda nada em "antes" -- não porque o clique não funcione, mas porque a mesma pequena vista de / não responde a cliques em nenhum ponto (nem Évora, que também não navegou). A frase do brief para este caso conhecido situa-o explicitamente em "/?ambito=municipio"; corrigido para arrancar desse estado, o que fez o endereço mudar como esperado. A leitura a partir de / simples ficou no relatório como achado sobre o "antes", não como falha do detetor.'
  );

  // 4a: clique em Évora, a partir de / tal como o leitor faria (depois deve abrir /municipios/evora)
  async function testeClique(base, seletorPonto, partirDoEstadoExpandido) {
    const { ctx, page } = await newDesktopPage(browser, vp);
    try {
      const arranque = partirDoEstadoExpandido ? '/?ambito=municipio' : '/';
      await gotoSettled(page, base + arranque);
      const ponto = page.locator(seletorPonto).first();
      const existe = (await ponto.count()) > 0;
      const urlAntes = page.url();
      const ambitoAntes = await rootAmbito(page);
      const cabecaAntes = await visibleCabeca(page);
      if (existe) {
        await ponto.scrollIntoViewIfNeeded();
        await ponto.click({ force: true });
        await page.waitForTimeout(400);
      }
      const urlDepois = page.url();
      const ambitoDepois = await rootAmbito(page);
      const cabecaDepois = await visibleCabeca(page);
      return {
        arranque, existeElemento: existe,
        urlAntes: urlAntes.replace(base, ''), urlDepois: urlDepois.replace(base, ''),
        urlMudou: urlAntes !== urlDepois,
        ambitoAntes, ambitoDepois, ambitoMudou: ambitoAntes !== ambitoDepois,
        cabecaTextoAntes: cabecaAntes.texto, cabecaTextoDepois: cabecaDepois.texto,
      };
    } catch (e) {
      return { erro: String(e).slice(0, 300) };
    } finally {
      await ctx.close();
    }
  }

  // leitura direta: o leitor está em / (país) e clica num ponto -- é o que os itens 1-3 já
  // estabeleceram ser o único estado do mapa em "depois" (nunca cresce); em "antes" sabe-se
  // (item 1) que / tem o mapa pequeno (490×645, não expandido), pelo que este teste mede
  // também se cliques respondem nesse estado pequeno.
  tabela['cliqueEvora_partindoDePais_antes'] = await testeClique(URL_ANTES, 'circle.mun[data-caop="evora"]', false);
  tabela['cliqueEvora_partindoDePais_depois'] = await testeClique(URL_DEPOIS, 'circle.mun[data-caop="evora"]', false);
  tabela['cliqueBraganca_partindoDePais_antes'] = await testeClique(URL_ANTES, 'circle.mun[data-caop="braganca"]', false);
  tabela['cliqueBraganca_partindoDePais_depois'] = await testeClique(URL_DEPOIS, 'circle.mun[data-caop="braganca"]', false);

  // leitura da receita exata do caso conhecido do brief: em "antes", a partir do estado já
  // expandido pelo comando «Concelho» (/?ambito=municipio) -- é isto que a frase "Caso
  // conhecido: no ar, o clique em Bragança em /?ambito=municipio muda o endereço para
  // municipio:braganca" descreve literalmente.
  tabela['cliqueEvora_partindoDoEstadoExpandido_antes'] = await testeClique(URL_ANTES, 'circle.mun[data-caop="evora"]', true);
  tabela['cliqueBraganca_partindoDoEstadoExpandido_antes'] = await testeClique(URL_ANTES, 'circle.mun[data-caop="braganca"]', true);

  // caso conhecido do detetor de clique: no ar, a partir de /?ambito=municipio, clicar em
  // Bragança MUDA o endereço para .../?ambito=municipio:braganca
  const cBragExpandido = tabela['cliqueBraganca_partindoDoEstadoExpandido_antes'];
  const mudouComoEsperado = cBragExpandido && cBragExpandido.urlMudou && /municipio.{0,3}braganca/i.test(decodeURIComponent(cBragExpandido.urlDepois || ''));
  recordKnownCase(
    'item4.cliqueBraganca (deteção de mudança de endereço ao clicar num ponto sem página, antes, a partir de /?ambito=municipio)',
    'clicar em Bragança muda o endereço para .../?ambito=municipio:braganca',
    { urlDepois: cBragExpandido?.urlDepois, urlMudou: cBragExpandido?.urlMudou },
    !!mudouComoEsperado,
    'goto(antes,/?ambito=municipio) -> click(circle.mun[data-caop=braganca], force) -> comparar page.url() antes/depois'
  );
  // nota, não é falso alarme do depois: em antes, partindo de / (mapa pequeno, não expandido),
  // nenhum clique em ponto muda nada -- ver tabela; documentado no relatório como achado sobre
  // o "antes", não sobre o "depois" (que é sempre igual em / e depois de "Concelho", por via do item 1).

  // 4c: contagem pontos-dentro-de-<a> vs data-pagina="sim"
  for (const [chave, base] of [['antes', URL_ANTES], ['depois', URL_DEPOIS]]) {
    const { ctx, page } = await newDesktopPage(browser, vp);
    try {
      await gotoSettled(page, base + '/');
      const info = await page.evaluate(() => {
        const svg = document.querySelector('svg.mapa-svg, svg[data-mapa]');
        if (!svg) return null;
        const pontosComPagina = svg.querySelectorAll('[data-pagina="sim"]').length;
        const circulosDentroDeA = [...svg.querySelectorAll('a circle.mun, a circle[class*="mun"]')].length;
        const totalCirculos = svg.querySelectorAll('circle.mun, circle[class*="mun"], rect.mun-alvo, rect[class*="mun-alvo"]').length;
        return { pontosComPagina, circulosDentroDeA, totalCirculos };
      });
      tabela['contagemPontos_' + chave] = info;
    } catch (e) {
      tabela['contagemPontos_' + chave] = { erro: String(e).slice(0, 300) };
    } finally {
      await ctx.close();
    }
  }

  // 4d: hover Bragança -> nome visível
  for (const [chave, base] of [['antes', URL_ANTES], ['depois', URL_DEPOIS]]) {
    const { ctx, page } = await newDesktopPage(browser, vp);
    try {
      await gotoSettled(page, base + '/');
      const readoutAntes = await page.locator('[data-readout]').textContent().catch(() => null);
      const brag = page.locator('circle.mun[data-caop="braganca"]').first();
      await brag.scrollIntoViewIfNeeded();
      await brag.hover({ force: true });
      await page.waitForTimeout(300);
      const readoutDepois = await page.locator('[data-readout]').textContent().catch(() => null);
      const readoutVisivel = await page.locator('[data-readout]').isVisible().catch(() => false);
      const contemBraganca = (readoutDepois || '').includes('Bragança');
      tabela['hoverBraganca_' + chave] = { readoutAntes, readoutDepois, readoutVisivel, contemNomeVisivel: readoutVisivel && contemBraganca };
    } catch (e) {
      tabela['hoverBraganca_' + chave] = { erro: String(e).slice(0, 300) };
    } finally {
      await ctx.close();
    }
  }

  // 4e: Emenda 19(e) -- "44 dos 308 pontos têm um vizinho a menos de um diâmetro (7,3px) na
  // coluna do computador"; verificação independente, geométrica, sobre as coordenadas cx/cy
  // reais de cada circle.mun no mapa da primeira página (1280, depois).
  {
    const { ctx, page } = await newDesktopPage(browser, vp);
    try {
      await gotoSettled(page, URL_DEPOIS + '/');
      const pontos = await page.evaluate(() => {
        const svg = document.querySelector('svg.mapa-svg, svg[data-mapa]');
        return [...svg.querySelectorAll('circle.mun')].map(c => ({
          nome: c.getAttribute('data-m'), caop: c.getAttribute('data-caop'),
          cx: parseFloat(c.getAttribute('cx')), cy: parseFloat(c.getAttribute('cy')), r: parseFloat(c.getAttribute('r')),
        }));
      });
      let comVizinhoPerto = 0;
      const nomes = [];
      for (let i = 0; i < pontos.length; i++) {
        let menor = Infinity;
        for (let j = 0; j < pontos.length; j++) {
          if (i === j) continue;
          const dx = pontos[i].cx - pontos[j].cx, dy = pontos[i].cy - pontos[j].cy;
          const d = Math.hypot(dx, dy);
          if (d < menor) menor = d;
        }
        if (menor < pontos[i].r * 2) { comVizinhoPerto++; nomes.push(pontos[i].nome); }
      }
      const exemplosEmenda19 = ['Lisboa', 'Oeiras', 'Amadora', 'Odivelas', 'Aveiro', 'Ílhavo', 'Alcobaça', 'Nazaré'];
      const todosPresentes = exemplosEmenda19.every(n => nomes.includes(n));
      tabela['zonasDensas_Emenda19e'] = {
        totalPontos: pontos.length,
        raioUnico: [...new Set(pontos.map(p => p.r))],
        pontosComVizinhoAMenosDeUmDiametro: comVizinhoPerto,
        exemplosDaEmenda19PresentesNoConjunto: todosPresentes,
        nomesDoConjunto: nomes,
      };
      P(`  [Emenda 19(e)] pontos com vizinho a menos de 1 diâmetro: ${comVizinhoPerto} (emenda diz 44) | os 8 exemplos nomeados estão todos no conjunto: ${todosPresentes}`);
    } catch (e) {
      tabela['zonasDensas_Emenda19e'] = { erro: String(e).slice(0, 300) };
    } finally {
      await ctx.close();
    }
  }

  P('  ' + JSON.stringify(tabela, null, 0).slice(0, 2000));
  results.items['4'] = { titulo: 'Os pontos', tabela };
}

// ============================================================ ITEM 5 =====
async function medirItem5(browser) {
  section('5 · O teclado');
  const vp = DESKTOP_VIEWPORTS[0];
  const tabela = {};
  recordFalseAlarm(
    'primeira tentativa da exploração por setas (item 5, depois)',
    'o seletor \'a.mun-porta[href*="evora"], a[href*="/municipios/evora"]\' apanha também a ligação homónima da lista de pesquisa (a.chipb[href="/municipios/evora"]), que existe no DOM mas está escondida até o comando «Concelho» ser ativado; em "depois" essa ligação vem primeiro na ordem do DOM, .first() ficava com ela, e scrollIntoViewIfNeeded esgotava os 30s à espera que um elemento escondido ficasse visível. Não aconteceu em "antes" só porque aí não há lista de pesquisa equivalente em /. Corrigido para o seletor específico do ponto do mapa (a.mun-porta), sem ambiguidade com a pesquisa.'
  );

  async function tabUntilEvora(page, maxStops = 400) {
    let stops = 0, found = false, last = null;
    for (let i = 0; i < maxStops; i++) {
      await page.keyboard.press('Tab');
      stops++;
      last = await focusedElement(page);
      if (last && last.href && last.href.replace(/\/$/, '') === '/municipios/evora') { found = true; break; }
    }
    // nome visível ao CHEGAR PELO TECLADO (Emenda 19(b)): só conta se a chegada foi por Tab de
    // verdade (keyboard.press), não por locator.focus() programático -- descoberto ao comparar
    // os dois métodos: focus() puro não desperta o mesmo ouvinte que um Tab real desperta (ver
    // nota "setasNoMapa" mais abaixo, que usa focus() de propósito para isolar as SETAS).
    const readoutAoChegar = found ? await page.locator('[data-readout]').textContent().catch(() => null) : null;
    return { stops, found, elemento: last, readoutAoChegarPeloTeclado: readoutAoChegar };
  }

  for (const [chave, base] of [['antes', URL_ANTES], ['depois', URL_DEPOIS]]) {
    // interpretação A: Concelho apenas focado (sem ativar) -> Tab
    {
      const { ctx, page } = await newDesktopPage(browser, vp);
      try {
        await gotoSettled(page, base + '/');
        await page.locator('a.seg[data-modo="municipio"]').first().focus();
        const r = await tabUntilEvora(page);
        tabela['tab_semAtivar_' + chave] = r;
      } catch (e) { tabela['tab_semAtivar_' + chave] = { erro: String(e).slice(0, 300) }; }
      finally { await ctx.close(); }
    }
    // interpretação B: Concelho ativado (clique) -> Tab a partir da pesquisa aberta
    {
      const { ctx, page } = await newDesktopPage(browser, vp);
      try {
        await gotoSettled(page, base + '/');
        await clickConcelho(page);
        const r = await tabUntilEvora(page);
        tabela['tab_aposAtivar_' + chave] = r;
        if (r.found) {
          await page.keyboard.press('Enter');
          await page.waitForTimeout(400);
          tabela['enterNaLigacaoEvora_' + chave] = { urlFinal: page.url().replace(base, '') };
        }
      } catch (e) { tabela['tab_aposAtivar_' + chave] = { erro: String(e).slice(0, 300) }; }
      finally { await ctx.close(); }
    }
  }

  // exploração por setas no mapa (só faz sentido testar em "depois"; medir também em "antes" por
  // contexto). Nota: este bloco usa locator.focus() programático para colocar o foco no ponto
  // ANTES de testar a seta, isolando o efeito da seta de qualquer efeito de chegada por Tab; por
  // isso "readoutAntes" aqui fica vazio mesmo em elementos com nome (focus() só não desperta o
  // mesmo ouvinte que um Tab a sério desperta -- ver tabUntilEvora acima, onde um Tab de
  // verdade MOSTRA o nome). Não é uma discrepância do sítio; é uma escolha deste teste.
  for (const [chave, base] of [['antes', URL_ANTES], ['depois', URL_DEPOIS]]) {
    const { ctx, page } = await newDesktopPage(browser, vp);
    try {
      await gotoSettled(page, base + '/');
      // seletor específico ao ponto do MAPA (a.mun-porta): um seletor mais largo também apanha
      // a ligação homónima da lista de pesquisa (a.chipb[href="/municipios/evora"]), que existe
      // mas fica escondida até o comando «Concelho» ser ativado -- .first() apanhava-a por estar
      // primeiro na ordem do DOM, e scrollIntoViewIfNeeded nunca via nada visível (esgotava o
      // tempo). Descoberto ao correr este programa; corrigido aqui.
      const alvo = page.locator('a.mun-porta[href*="evora"]').first();
      const existeAlvo = (await alvo.count()) > 0;
      if (!existeAlvo) { tabela['setasNoMapa_' + chave] = { existeAlvoFocavel: false }; continue; }
      await alvo.scrollIntoViewIfNeeded();
      await alvo.focus();
      const antes = await focusedElement(page);
      const readoutAntes = await page.locator('[data-readout]').textContent().catch(() => null);
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
      const depoisDir = await focusedElement(page);
      const readoutDepois = await page.locator('[data-readout]').textContent().catch(() => null);
      const focoMoveu = JSON.stringify(antes) !== JSON.stringify(depoisDir);
      tabela['setasNoMapa_' + chave] = { existeAlvoFocavel: true, focoAntes: antes, focoAposArrowRight: depoisDir, focoMoveu, readoutAntes, readoutDepoisArrowRight: readoutDepois };
    } catch (e) { tabela['setasNoMapa_' + chave] = { erro: String(e).slice(0, 300) }; }
    finally { await ctx.close(); }
  }

  P('  ' + JSON.stringify(tabela).slice(0, 2500));
  results.items['5'] = { titulo: 'O teclado', tabela };
}

// ============================================================ ITEM 6 =====
async function medirItem6(browser) {
  section('6 · O telemóvel (iPhone 13)');
  const tabela = {};
  for (const [chave, base] of [['antes', URL_ANTES], ['depois', URL_DEPOIS]]) {
    const { ctx, page } = await newMobilePage(browser);
    try {
      await gotoSettled(page, base + '/');
      const svgInfo = await page.evaluate(() => {
        const els = [...document.querySelectorAll('svg.mapa-svg, svg[data-mapa]')];
        return els.map(e => {
          const r = e.getBoundingClientRect();
          const cs = getComputedStyle(e);
          let anc = e.parentElement, hiddenAncestor = null;
          while (anc) { if (getComputedStyle(anc).display === 'none') { hiddenAncestor = anc.tagName + '.' + (anc.className || ''); break; } anc = anc.parentElement; }
          return { display: cs.display, w: r.width, h: r.height, hiddenAncestor };
        });
      });
      const renderizado = svgInfo.some(s => s.w > 0 && s.h > 0 && !s.hiddenAncestor);
      const btn = page.locator('a.seg[data-modo="municipio"]').first();
      await btn.tap();
      await page.waitForTimeout(400);
      const foco = await focusedElement(page);
      const input = page.locator('#pesquisa-concelho');
      const box = await input.boundingBox().catch(() => null);
      const vp = page.viewportSize();
      const dentroDoEcra = box ? (box.x >= 0 && box.y >= 0 && box.x + box.width <= vp.width + 1 && box.y + box.height <= vp.height + 1) : false;
      const focoNoCampo = foco && foco.id === 'pesquisa-concelho';
      tabela[chave] = {
        svgCountDOM: svgInfo.length,
        svgDetalhe: svgInfo,
        svgRenderizado: renderizado,
        aposTapConcelho: { foco, box: box ? { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) } : null, viewport: vp, dentroDoEcra, focoNoCampo },
      };
    } catch (e) {
      tabela[chave] = { erro: String(e).slice(0, 300) };
    } finally {
      await ctx.close();
    }
  }
  P('  antes: svgCountDOM=' + tabela.antes.svgCountDOM + ' renderizado=' + tabela.antes.svgRenderizado + ' | dentroDoEcra=' + tabela.antes.aposTapConcelho?.dentroDoEcra + ' focoNoCampo=' + tabela.antes.aposTapConcelho?.focoNoCampo);
  P('  depois: svgCountDOM=' + tabela.depois.svgCountDOM + ' renderizado=' + tabela.depois.svgRenderizado + ' | dentroDoEcra=' + tabela.depois.aposTapConcelho?.dentroDoEcra + ' focoNoCampo=' + tabela.depois.aposTapConcelho?.focoNoCampo);
  results.items['6'] = { titulo: 'O telemóvel', tabela };
}

// ============================================================ ITEM 7 =====
function contarStringsEmFicheiro(caminho) {
  const txt = fs.readFileSync(caminho, 'utf8');
  function conta(sub) { return txt.split(sub).length - 1; }
  const totalFechar = conta('>fechar<');
  const fecharEmToggle = conta('peca-abrir-f">fechar<');
  const totalClose = conta('>close<');
  const closeEmToggle = conta('peca-abrir-f">close<');
  return {
    'class="mapa-fechar"': conta('class="mapa-fechar"'),
    'fechar-comando (>fechar< fora do peca-abrir-f)': totalFechar - fecharEmToggle,
    'fechar-total-bruto (inclui peca-abrir-f, informativo)': totalFechar,
    'fechar-em-peca-abrir-f (esperado, não é o alvo do teste)': fecharEmToggle,
    'close-comando (>close< fora do peca-abrir-f)': totalClose - closeEmToggle,
    'close-total-bruto (inclui peca-abrir-f, informativo)': totalClose,
    'close-em-peca-abrir-f (esperado, não é o alvo do teste)': closeEmToggle,
    '"trocar de concelho"': conta('trocar de concelho'),
    '"change municipality"': conta('change municipality'),
    '"Ainda sem linhas"': conta('Ainda sem linhas'),
    '"Still no rows for"': conta('Still no rows for'),
    '"sem linha ainda"': conta('sem linha ainda'),
    '"no row yet"': conta('no row yet'),
    'data-cabeca="vazio"': conta('data-cabeca="vazio"'),
    'data-painel="vazio"': conta('data-painel="vazio"'),
    'data-slot': conta('data-slot'),
    'mapa-fechar (substring, qualquer contexto)': conta('mapa-fechar'),
  };
}

async function medirItem7() {
  section('7 · As cadeias');
  const alvos = [
    { rota: 'index.html', antes: path.join(DIST_ANTES, 'index.html'), depois: path.join(DIST_DEPOIS, 'index.html') },
    { rota: 'en/index.html', antes: path.join(DIST_ANTES, 'en', 'index.html'), depois: path.join(DIST_DEPOIS, 'en', 'index.html') },
  ];
  const tabela = [];
  for (const alvo of alvos) {
    const antes = contarStringsEmFicheiro(alvo.antes);
    const depois = contarStringsEmFicheiro(alvo.depois);
    tabela.push({ rota: alvo.rota, antes, depois });
    P(`  [${alvo.rota}] mapa-fechar: antes=${antes['class="mapa-fechar"']} depois=${depois['class="mapa-fechar"']} | fechar-comando: antes=${antes['fechar-comando (>fechar< fora do peca-abrir-f)']} depois=${depois['fechar-comando (>fechar< fora do peca-abrir-f)']}`);
  }

  // caso conhecido: no ar, index.html tem data-painel="vazio"
  const linhaIndex = tabela.find(t => t.rota === 'index.html');
  const painelVazioAntes = linhaIndex.antes['data-painel="vazio"'];
  recordKnownCase(
    'item7.stringBans (contagem de substrings em dist/index.html, antes)',
    'data-painel="vazio" ocorre pelo menos 1 vez em index.html (antes)',
    { 'data-painel="vazio"': painelVazioAntes },
    painelVazioAntes >= 1,
    'leitura direta de dist-antes-mapa/index.html + contagem de substring'
  );

  // false alarm documentado: "fechar"/"close" também aparecem no alternador abrir/fechar de cada peça (peca-abrir-f) -- não são o rótulo de comando do mapa.
  const bruteAntes = linhaIndex.antes['fechar-total-bruto (inclui peca-abrir-f, informativo)'];
  const bruteDepois = linhaIndex.depois['fechar-total-bruto (inclui peca-abrir-f, informativo)'];
  if (bruteDepois > 0) {
    recordFalseAlarm(
      'busca ingénua por substring "fechar" em index.html (depois)',
      `uma busca literal por ">fechar<" encontra ${bruteDepois} ocorrências em "depois", todas dentro de <span class="peca-abrir-f">fechar</span> (o alternador abrir/fechar de cada peça de medida, não tocado por esta emenda); confirmado por contagem isolada de "peca-abrir-f\\">fechar<" = ${linhaIndex.depois['fechar-em-peca-abrir-f (esperado, não é o alvo do teste)']}; o rótulo de comando ".mapa-fechar" está mesmo a 0.`
    );
  }

  results.items['7'] = { titulo: 'As cadeias', tabela };
}

// ============================================================ ITEM 8 =====
async function medirItem8() {
  section('8 · O que mais mudou');
  const cmp = compareTrees(DIST_ANTES, DIST_DEPOIS);
  const semVersion = cmp.differing.filter(d => d.file !== 'version.json');
  P(`  ficheiros comuns: ${cmp.commonCount} | só em antes: ${cmp.onlyA.length} | só em depois: ${cmp.onlyB.length} | diferentes: ${cmp.differing.length}`);
  for (const d of cmp.differing) P(`    DIFERE: ${d.file} (antes ${d.sizeA}B -> depois ${d.sizeB}B)`);
  for (const f of cmp.onlyA) P(`    SÓ EM ANTES: ${f}`);
  for (const f of cmp.onlyB) P(`    SÓ EM DEPOIS: ${f}`);

  // conferir se existe alguma "marca de versão dentro das páginas": se existisse embutida em
  // TODAS as páginas, todas as 1627 páginas comuns apareceriam como diferentes. Não é o caso.
  const paginasHtml = semVersion.filter(d => d.file.endsWith('.html'));
  const naoHtml = semVersion.filter(d => !d.file.endsWith('.html') && d.file !== 'version.json');

  const esperadas = new Set(['index.html', 'en/index.html']);
  // condicional do item 8: só entram no "esperado" se o construtor mexeu na nota (medido: mudaram ou não)
  const notaTocada = semVersion.some(d => d.file === 'municipios/index.html' || d.file === 'en/municipalities/index.html');
  if (notaTocada) { esperadas.add('municipios/index.html'); esperadas.add('en/municipalities/index.html'); }

  const achados = paginasHtml.filter(d => !esperadas.has(d.file));

  results.items['8'] = {
    titulo: 'O que mais mudou',
    ficheirosComuns: cmp.commonCount,
    soEmAntes: cmp.onlyA,
    soEmDepois: cmp.onlyB,
    todasAsDiferencas: cmp.differing,
    paginasHtmlDiferentes: paginasHtml.map(d => d.file),
    ficheirosNaoHtmlDiferentes: naoHtml.map(d => d.file),
    notaDeMunicipiosTocada: notaTocada,
    paginasEsperadas: [...esperadas],
    achadosForaDoEsperado: achados.map(d => d.file),
  };

  recordKnownCase(
    'item8.marcaDeVersaoDentroDasPaginas (ausência)',
    'version.json difere sempre (instrução do brief) -- confirmado abaixo',
    { 'version.json difere': cmp.differing.some(d => d.file === 'version.json') },
    cmp.differing.some(d => d.file === 'version.json'),
    'compareTrees(antes,depois) e procurar version.json na lista de diferentes'
  );

  if (achados.length > 0) {
    for (const a of achados) {
      recordDisagreement(
        'item 8 (§1.8 do brief) · "o esperado é /, /en/ e, se o construtor mexeu na nota, /municipios e /en/municipalities"',
        a.file,
        `bytes diferentes entre antes e depois (antes ${a.sizeA}B, depois ${a.sizeB}B) e não está na lista de páginas esperadas ${JSON.stringify([...esperadas])}`
      );
    }
  }
  if (naoHtml.length > 0) {
    P(`  nota: ${naoHtml.length} ficheiro(s) não-HTML também diferem (fora do âmbito de "página", reportados por transparência): ${naoHtml.map(d => d.file).join(', ')}`);
  }
}

// ============================================================ ITEM 9 =====
async function medirItem9() {
  section('9 · A página do concelho (Évora)');
  const pares = [
    { pt: 'municipios/evora/index.html', portaAntes: '/?ambito=municipio', portaDepois: '/municipios' },
    { pt: 'en/municipalities/evora/index.html', portaAntes: '/en?ambito=municipio', portaDepois: '/en/municipalities' },
  ];
  const tabela = [];
  for (const par of pares) {
    const antesTxt = fs.readFileSync(path.join(DIST_ANTES, par.pt), 'utf8');
    const depoisTxt = fs.readFileSync(path.join(DIST_DEPOIS, par.pt), 'utf8');
    const identicos = antesTxt === depoisTxt;

    // isolar a secção do "aparelho" (mapa localizador), que sabemos à partida que muda.
    // normaliza primeiro o nome do ficheiro CSS com hash de conteúdo (_astro/inicio.HASH.css):
    // muda sempre que o CSS muda, incluindo por causa deste bloco (afeta a folha de estilos da
    // página inicial); é uma diferença real e explicada (item 8), não uma marca de versão, mas
    // sem a normalizar aqui o "pré-aparelho idêntico" dava sempre falso por essa única linha do
    // <head>, escondendo se as OITO PEÇAS DE MEDIDA (o que este teste quer mesmo confirmar) são
    // mesmo byte a byte iguais.
    const normalizarCssHash = t => t.replace(/\/_astro\/inicio\.[A-Za-z0-9_-]+\.css/g, '/_astro/inicio.HASH.css');
    const antesNorm = normalizarCssHash(antesTxt);
    const depoisNorm = normalizarCssHash(depoisTxt);
    const marcaAparelho = 'aparelho: o que a página sabe de si';
    const idxAntes = antesNorm.indexOf(marcaAparelho);
    const idxDepois = depoisNorm.indexOf(marcaAparelho);
    const preAparelhoIguais = idxAntes >= 0 && idxDepois >= 0 && antesNorm.slice(0, idxAntes) === depoisNorm.slice(0, idxDepois);

    // as "oito medidas": tudo antes da secção do aparelho conta as peças de medida.
    const pecasAntes = (antesTxt.match(/class="peca[" ]/g) || []).length;
    const pecasDepois = (depoisTxt.match(/class="peca[" ]/g) || []).length;

    const temPostura = depoisTxt.includes('data-postura="localizador"');
    const portaAntesExiste = antesTxt.includes(`href="${par.portaAntes}"`);
    const portaDepoisExiste = depoisTxt.includes(`href="${par.portaDepois}"`);

    // diferença de bytes fora da porta do cartão -- para descrever com números o que item 9 chama "qualquer outra diferença"
    const semVersionMarker = true; // não encontrámos marca de versão dentro das páginas (ver item 8)
    const tamanhoAntes = Buffer.byteLength(antesTxt);
    const tamanhoDepois = Buffer.byteLength(depoisTxt);

    const linha = {
      ficheiro: par.pt,
      identicoByteAByte: identicos,
      preAparelhoIdentico: preAparelhoIguais,
      pecasDeMedidaCount: { antes: pecasAntes, depois: pecasDepois, iguais: pecasAntes === pecasDepois },
      localizador: { existeDataPosturaLocalizador_depois: temPostura },
      portaDoCartao: { antesTemHref: par.portaAntes, antesExiste: portaAntesExiste, depoisTemHref: par.portaDepois, depoisExiste: portaDepoisExiste },
      tamanhoBytes: { antes: tamanhoAntes, depois: tamanhoDepois, diferenca: tamanhoDepois - tamanhoAntes },
    };
    tabela.push(linha);
    P(`  [${par.pt}] pré-aparelho idêntico=${preAparelhoIguais} peças iguais=${linha.pecasDeMedidaCount.iguais} (antes ${pecasAntes} / depois ${pecasDepois}) porta antes(${par.portaAntes})=${portaAntesExiste} porta depois(${par.portaDepois})=${portaDepoisExiste} Δbytes=${linha.tamanhoBytes.diferenca}`);
  }
  results.items['9'] = { titulo: 'A página do concelho', tabela };

  // discordância: o brief diz que a porta do cartão é "a única diferença esperada fora da marca de versão".
  // medido: a secção do aparelho (mapa localizador) muda muito mais do que a porta -- reporta-se com prova.
  const linhaPt = tabela.find(t => t.ficheiro === 'municipios/evora/index.html');
  if (linhaPt && linhaPt.preAparelhoIdentico && !linhaPt.identicoByteAByte) {
    // sabemos do trabalho de descoberta (fora deste programa) que a secção do aparelho muda:
    // o grupo [data-campo] e os 308 <rect class="mun-alvo"> desaparecem, substituídos por 308
    // <circle class="mun">; e data-slot="nome" passa a texto simples. Confirma-se aqui,
    // programaticamente, que a secção MUDOU (o pré-aparelho não) e mede-se a extensão.
    const antesTxt = fs.readFileSync(path.join(DIST_ANTES, linhaPt.ficheiro), 'utf8');
    const depoisTxt = fs.readFileSync(path.join(DIST_DEPOIS, linhaPt.ficheiro), 'utf8');
    const rectsAntes = (antesTxt.match(/<rect class="mun-alvo"/g) || []).length;
    const circlesDepois = (depoisTxt.match(/<circle class="mun"/g) || []).length;
    const dataCampoAntes = (antesTxt.match(/<g data-campo/g) || []).length;
    const dataCampoDepois = (depoisTxt.match(/<g data-campo/g) || []).length;
    const dataSlotAntes = (antesTxt.match(/data-slot="nome"/g) || []).length;
    recordDisagreement(
      'item 9 (§1.9 do brief) · "a porta do cartão... é a única diferença esperada fora da marca de versão"',
      'municipios/evora/index.html, dentro de <aside class="aparelho">',
      `medido: ${rectsAntes} <rect class="mun-alvo"> + ${dataCampoAntes} grupo(s) <g data-campo> desaparecem de "antes"; "depois" tem ${circlesDepois} <circle class="mun"> onde "antes" não tinha nenhum; data-slot="nome" (${dataSlotAntes}× em antes) desaparece. A parte anterior ao aparelho (as oito peças de medida) é byte a byte idêntica (confirmado acima), mas a secção do mapa localizador muda muito mais do que só a porta do cartão.`
    );
  }
}

// ============================================================ ITEM 10 ====
async function medirItem10() {
  section('10 · A régua do inventário');
  const { execSync } = await import('node:child_process');
  let saida;
  try {
    saida = execSync('node scripts/medir-defeitos.mjs', { cwd: REPO, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  } catch (e) {
    saida = (e.stdout || '') + '\n[stderr]\n' + (e.stderr || '');
    P('  aviso: o script terminou com erro; a saída capturada segue mesmo assim.');
  }
  // eslint-disable-next-line no-control-regex
  const semCor = saida.replace(/\x1b\[[0-9;]*m/g, '');
  const linhaHome = semCor.split('\n').find(l => /frases da casa · \/ \.\.\./.test(l));
  let parsed = null;
  if (linhaHome) {
    const m = linhaHome.match(/(\d+) distinta\(s\) · conteúdo (\d+) · navegação (\d+) · autorreferência (\d+)/);
    if (m) {
      const [, distintas, conteudo, navegacao, autorreferencia] = m.map(Number);
      const classificadas = conteudo + navegacao + autorreferencia;
      parsed = {
        linhaBruta: linhaHome.trim(),
        distintas, conteudo, navegacao, autorreferencia,
        classificadas,
        blocosPorClassificar: distintas - classificadas,
      };
    }
  }
  if (!parsed) {
    P('  AVISO: não encontrei a linha "frases da casa · / ..." na saída do script -- ver ficheiro de log completo.');
  } else {
    P(`  rota home (/): autorreferência=${parsed.autorreferencia}  blocos por classificar=${parsed.blocosPorClassificar}  (${parsed.distintas} distintas = ${parsed.conteudo} conteúdo + ${parsed.navegacao} navegação + ${parsed.autorreferencia} autorreferência)`);
  }
  results.items['10'] = { titulo: 'A régua do inventário', comando: 'node scripts/medir-defeitos.mjs', rotaHome: parsed, saidaCompleta: semCor };
}

// =============================================================== main ====
async function main() {
  results.meta.geradoEm = new Date().toISOString();
  results.meta.portoDepois = PORT_DEPOIS;
  results.meta.portoAntes = PORT_ANTES;

  section('preparação');
  P(`  antes  (main, ${URL_ANTES}) <- ${DIST_ANTES}`);
  P(`  depois (ramo, ${URL_DEPOIS}) <- ${DIST_DEPOIS}`);
  await ensureServer(DIST_DEPOIS, PORT_DEPOIS, URL_DEPOIS);
  await ensureServer(DIST_ANTES, PORT_ANTES, URL_ANTES);

  const browser = await chromium.launch();
  try {
    await medirItem1(browser);
    await medirItem2(browser);
    await medirItem3(browser);
    await medirItem4(browser);
    await medirItem5(browser);
    await medirItem6(browser);
    await medirItem7();
    await medirItem8();
    await medirItem9();
    await medirItem10();
  } finally {
    await browser.close();
    stopSpawnedServers();
  }

  section('resumo');
  P(`  casos conhecidos provados: ${results.knownCases.length} (vermelho confirmado: ${results.knownCases.filter(k => k.passedRed).length})`);
  P(`  falsos alarmes documentados: ${results.falseAlarms.length}`);
  P(`  discordâncias registadas: ${results.disagreements.length}`);

  fs.writeFileSync(OUT_JSON, JSON.stringify(results, null, 2));
  fs.writeFileSync(OUT_LOG, log.join('\n'));
  P(`\n  resultados -> ${OUT_JSON}`);
  P(`  log        -> ${OUT_LOG}`);
}

main().catch(e => {
  console.error('ERRO FATAL', e);
  stopSpawnedServers();
  process.exit(1);
});
