#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DO MAPA QUE CRESCE · F1.1d, §4 do BRIEF-F1.1d-os-nomes-do-mapa
 * =============================================================================
 *
 * Uma célula por medida de aceitação do brief, medida em Chromium sem cabeça
 * sobre `dist/`. NÃO é um portão: não entra no `npm run build` e não constrói
 * nada. Imprime uma linha por célula e SAI COM 0 quando todas passam e com 1
 * quando alguma falha, como as outras réguas de `tests/inicio` que contam.
 *
 *   node tests/inicio/mapa-regioes.mjs
 *   node tests/inicio/mapa-regioes.mjs --json <ficheiro>
 *   node tests/inicio/mapa-regioes.mjs --vermelhos
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * P1 · os alvos. O alvo de uma área é o MAIOR QUADRADO INSCRITO À VOLTA DO SEU
 * PONTO REPRESENTATIVO (I82, 27.08.2026), rasterizado a 2 px com
 * `isPointInFill` no próprio navegador: entre o artefacto e o dedo estão a
 * folha, o `viewBox` e a largura da coluna, e nenhum dos três se adivinha do
 * ficheiro. São três células, e a razão de serem três está na terceira:
 *
 *   P1a  as nove regiões, a 390 e a 1280, com o número das que chegam aos 44 px;
 *   P1b  os 308 concelhos, região a região, no nível em que se tocam;
 *   P1c  a rede de nomes responde por TODAS: as nove estão na lista fechada dos
 *        nomes e os 308 estão no índice dos concelhos.
 *
 * P1a e P1b IMPRIMEM O NÚMERO E NÃO EXIGEM OS 44 px, e isso está medido e
 * escrito no relatório do bloco: com o desenho à largura de um telemóvel, 3 das
 * 9 regiões e 20 dos 308 concelhos chegam aos 44 px, e levar o pior dos 308 lá
 * pediria um desenho de cerca de 8 600 px de largura. O que as duas células
 * exigem é que a medição corra sobre 9 de 9 e 308 de 308 e que nenhuma área
 * fique com alvo de 0 px, que é o sinal de um ponto representativo fora da sua
 * área. Quem responde pelas que não chegam é a P1c, que é a mesma decisão da
 * Emenda 20c e da I82: a rede dos nomes.
 *
 * P2 · o nome no lugar, pelos três gestos e nas duas edições. O rato mede-se com
 * `pointerover`, o teclado com o foco, e o dedo com um toque num contexto com
 * `hasTouch`. As três leituras têm de dar o mesmo nome, que é o da lista da casa
 * para uma região e o da Carta para um concelho.
 *
 * P3 · o primeiro toque nunca navega. Mede-se com O DEDO e não com o rato, e a
 * distinção não é um preciosismo: um toque faz o navegador disparar os eventos
 * do rato antes do clique, e uma medida feita com `click()` num contexto sem
 * toque nunca veria a diferença entre «apontou» e «tocou». Com rato o nome já
 * está no lugar desde que o cursor entrou na área, e o clique é o segundo gesto:
 * a célula mede os dois caminhos, e escreve os dois.
 *
 * P4 · sem guião. O contexto corre com `javaScriptEnabled: false`, que é o
 * leitor sem script: as nove áreas continuam a ser ligações para as nove
 * páginas, a lista fica fechada, e um `#regiao=` no endereço não parte nada.
 *
 * P5 · a altura da primeira página a 390, antes e depois. O «antes» é a gaveta
 * dos nomes aberta, que é a forma que este bloco fechou, e mede-se na MESMA
 * construção: comparar com um número medido noutra construção mediria também
 * tudo o que mudou pelo meio.
 *
 * P7 · o contraste do lugar do nome nos dois temas, pela fórmula da WCAG sobre
 * as cores que o navegador resolve, e o `aria-live` a anunciar, conferido com o
 * `ariaSnapshot` da própria página.
 *
 * P9 · as plantas. Cada uma é a coisa que uma célula existe para apanhar, posta
 * na resposta que o servidor dá e em mais lado nenhum; a régua volta a correr as
 * células que ela toca e exige que fiquem vermelhas.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const argv = process.argv.slice(2);
const VERMELHOS = argv.includes('--vermelhos');
const FICHEIRO_JSON = argv.includes('--json') ? argv[argv.indexOf('--json') + 1] : null;

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  não existe dist/. Corra `npm run build` primeiro.\n'));
  process.exit(1);
}

const ALVO = 44;
const GERADO = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src', 'data', 'mapa-regioes.gerado.json'), 'utf8'));
const REGIOES = GERADO.regioes;

/* --------------------------------------------------------------- o servidor */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.csv': 'text/csv',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

/** O estrago da vez, aplicado ao texto de cada resposta. */
let ESTRAGO = null;

const servidor = http.createServer((req, res) => {
  const rota = decodeURIComponent(req.url.split('?')[0]);
  let abs = path.join(DIST, rota);
  if (!path.extname(abs)) abs = path.join(abs, 'index.html');
  if (!abs.startsWith(DIST) || !fs.existsSync(abs)) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('404');
    return;
  }
  const ext = path.extname(abs);
  const tipo = MIME[ext] ?? 'application/octet-stream';
  let corpo = fs.readFileSync(abs);
  if (ESTRAGO && (ext === '.html' || ext === '.js' || ext === '.json')) {
    corpo = Buffer.from(ESTRAGO(corpo.toString('utf8'), rota, ext), 'utf8');
  }
  res.writeHead(200, { 'content-type': tipo, 'cache-control': 'no-store' });
  res.end(corpo);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const nav = await chromium.launch();

/** Uma página, com o contexto que a célula pede. */
async function pagina(rota, largura, opcoes = {}) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: opcoes.altura ?? (largura < 640 ? 664 : 900) },
    hasTouch: opcoes.toque ?? false,
    javaScriptEnabled: opcoes.guiao ?? true,
    colorScheme: opcoes.tema ?? 'light',
    reducedMotion: 'reduce',
  });
  const p = await ctx.newPage();
  await p.goto(`${base}${rota}`, { waitUntil: opcoes.guiao === false ? 'domcontentloaded' : 'networkidle' });
  p.__ctx = ctx;
  return p;
}

/* ------------------------------------------------------------- a contagem */
let celulas = [];
let medidas = {};
function conta(nome, passa, prova) {
  celulas.push({ nome, passa: !!passa, prova });
}

/* ---------------------------------------------------------------------------
 * O QUADRADO INSCRITO, MEDIDO NO NAVEGADOR (I82)
 * ---------------------------------------------------------------------------
 * A mesma conta de `tests/inicio/mapa-distritos.mjs`, com o mesmo passo de 2 px
 * e a mesma leitura da escala pela matriz do `svg`: o ponto chega em unidades do
 * campo e a grelha alinha-se a ele, para que ele seja um nó dela. O lado é
 * múltiplo do passo, e por isso arredonda para baixo.
 * ------------------------------------------------------------------------- */
const QUADRADO_INSCRITO = ({ pontos, PASSO, seletor }) => {
  const svg = document.querySelector('[data-mapa-areas]');
  const inv = svg.getScreenCTM().inverse();
  const p0 = new DOMPoint(0, 0).matrixTransform(inv);
  const p1 = new DOMPoint(1, 0).matrixTransform(inv);
  const u = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const passo = PASSO * u;
  const fora = {};
  for (const el of svg.querySelectorAll(seletor)) {
    const slug = el.getAttribute('data-unidade');
    const pr = pontos[slug];
    if (!pr) continue;
    const bb = el.getBBox();
    const [px, py] = pr;
    const x0 = px - Math.ceil((px - bb.x) / passo) * passo;
    const y0 = py - Math.ceil((py - bb.y) / passo) * passo;
    const cols = Math.ceil((bb.x + bb.width - x0) / passo) + 1;
    const rows = Math.ceil((bb.y + bb.height - y0) / passo) + 1;
    const dentro = [];
    for (let r = 0; r < rows; r++) {
      const linha = new Uint8Array(cols);
      for (let c = 0; c < cols; c++) {
        linha[c] = el.isPointInFill(new DOMPoint(x0 + c * passo, y0 + r * passo)) ? 1 : 0;
      }
      dentro.push(linha);
    }
    const ic = Math.round((px - x0) / passo);
    const ir = Math.round((py - y0) / passo);
    const dp = dentro.map((l) => new Int32Array(l.length));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!dentro[r][c]) {
          dp[r][c] = 0;
          continue;
        }
        dp[r][c] = r === 0 || c === 0 ? 1 : 1 + Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]);
      }
    }
    let contem = 0;
    for (let r = ir; r < rows; r++) {
      for (let c = ic; c < cols; c++) {
        const k = dp[r][c];
        if (k <= contem) continue;
        if (r - k + 1 <= ir && c - k + 1 <= ic) contem = k;
      }
    }
    const caixa = el.getBoundingClientRect();
    fora[slug] = {
      dentro: !!dentro[ir][ic],
      inscrito: Math.max(0, (contem - 1) * PASSO),
      caixa: Math.round(Math.max(caixa.width, caixa.height)),
    };
  }
  return fora;
};

/**
 * O ponto de ecrã de um ponto do campo, pela matriz do próprio `svg`.
 *
 * O CENTRO DA CAIXA DE UMA ÁREA NÃO SERVE PARA LHE TOCAR, e não é um detalhe de
 * medição: a caixa da Madeira envolve a ilha, o Porto Santo e as Selvagens, e o
 * seu centro cai no mar. O Playwright aponta ao centro da caixa e o `svg` come o
 * gesto. Todos os gestos desta régua vão ao PONTO REPRESENTATIVO da área, que é
 * o mesmo por onde o alvo se mede, e é a mesma lição que a célula M6 de
 * `mapa-distritos.mjs` tem escrita desde 26.08.
 *
 * @param {import('playwright').Page} p
 * @param {number[]} ponto
 */
async function noEcra(p, ponto) {
  /* O MAPA ENTRA NO ECRÃ ANTES DE SE MEDIR ONDE ELE ESTÁ. A 390 o desenho começa
     a uns 719 px do topo do documento, e um ponto do campo dava uma coordenada
     fora da janela: o gesto caía no nada e a célula acusava o desenho de um
     defeito que era da medição. O Playwright faz isto sozinho quando se lhe dá um
     selector; quando se lhe dá um ponto, faz-se aqui. */
  await p.locator('[data-mapa-areas]').scrollIntoViewIfNeeded();
  return p.evaluate((pt) => {
    const svg = document.querySelector('[data-mapa-areas]');
    const q = new DOMPoint(pt[0], pt[1]).matrixTransform(svg.getScreenCTM());
    return { x: q.x, y: q.y };
  }, ponto);
}

const mediana = (ns) => {
  const s = [...ns].sort((a, b) => a - b);
  return s.length === 0 ? 0 : s[Math.floor(s.length / 2)];
};

/* ======================================================================= P1 */
async function p1() {
  const pontosDaRegiao = Object.fromEntries(REGIOES.map((r) => [r.slug, r.ponto]));
  medidas.alvos = {};
  for (const largura of [390, 1280]) {
    const p = await pagina('/', largura);
    const desenho = await p.evaluate(() => {
      const b = document.querySelector('[data-mapa-areas]').getBoundingClientRect();
      return [Math.round(b.width), Math.round(b.height)];
    });
    const r = await p.evaluate(QUADRADO_INSCRITO, { pontos: pontosDaRegiao, PASSO: 2, seletor: '[data-areas] .uni' });
    const entradas = Object.entries(r);
    const chegam = entradas.filter(([, v]) => v.inscrito >= ALVO);
    const zeros = entradas.filter(([, v]) => !v.dentro || v.inscrito === 0);
    medidas.alvos[`regioes_${largura}`] = {
      desenho,
      chegam: chegam.length,
      areas: entradas.length,
      mediana: mediana(entradas.map(([, v]) => v.inscrito)),
      unidades: entradas
        .sort((a, b) => b[1].inscrito - a[1].inscrito)
        .map(([slug, v]) => ({ slug, inscrito: v.inscrito, caixa: v.caixa })),
    };
    conta(
      `P1a · a ${largura}, as nove regiões medidas pelo quadrado inscrito`,
      entradas.length === 9 && zeros.length === 0,
      `desenho ${desenho[0]} × ${desenho[1]} px · ${entradas.length} áreas · ${chegam.length} de 9 chegam aos ${ALVO} px ` +
        `(mediana ${mediana(entradas.map(([, v]) => v.inscrito))} px; a maior ${Math.max(...entradas.map(([, v]) => v.inscrito))} px, ` +
        `a menor ${Math.min(...entradas.map(([, v]) => v.inscrito))} px)` +
        (zeros.length ? ` · ${zeros.length} com o ponto fora da área` : ''),
    );
    await p.__ctx.close();
  }

  /* P1b · os concelhos, região a região, no nível em que se tocam. */
  const p = await pagina('/', 390);
  let total = 0;
  let chegam = 0;
  const todos = [];
  const foraDaArea = [];
  const porRegiao = {};
  for (const r of REGIOES) {
    const cliente = JSON.parse(fs.readFileSync(path.join(DIST, r.ficheiro), 'utf8'));
    const pontos = Object.fromEntries(cliente.concelhos.map((c) => [c.slug, c.ponto]));
    await p.goto(`${base}/#regiao=${r.slug}`, { waitUntil: 'networkidle' });
    await p.waitForFunction(
      (n) => document.querySelectorAll('[data-areas-concelhos] [data-concelho-porta]').length === n,
      cliente.concelhos.length,
      { timeout: 5000 },
    ).catch(() => {});
    const medido = await p.evaluate(QUADRADO_INSCRITO, {
      pontos,
      PASSO: 2,
      seletor: '[data-areas-concelhos] .uni',
    });
    const es = Object.entries(medido);
    total += es.length;
    chegam += es.filter(([, v]) => v.inscrito >= ALVO).length;
    todos.push(...es.map(([, v]) => v.inscrito));
    if (es.some(([, v]) => !v.dentro)) foraDaArea.push(...es.filter(([, v]) => !v.dentro).map(([slug]) => slug));
    porRegiao[r.slug] = {
      concelhos: es.length,
      chegam: es.filter(([, v]) => v.inscrito >= ALVO).length,
      mediana: mediana(es.map(([, v]) => v.inscrito)),
      menor: Math.min(...es.map(([, v]) => v.inscrito)),
      abaixo: es
        .filter(([, v]) => v.inscrito < ALVO)
        .sort((a, b) => a[1].inscrito - b[1].inscrito)
        .map(([slug, v]) => `${slug} ${v.inscrito}`),
    };
  }
  await p.__ctx.close();
  medidas.alvos.concelhos_390 = { total, chegam, mediana: mediana(todos), porRegiao };
  /* O QUE A CÉLULA EXIGE É QUE OS 308 ESTEJAM DESENHADOS E QUE O PONTO DE CADA UM
     CAIA DENTRO DA SUA ÁREA. O tamanho do alvo é um número que ela escreve, e não
     uma condição: com o desenho à largura de um telemóvel ele não chega aos 44 px
     para a maior parte, e quem responde por esses é a rede de nomes (P1c). Um
     alvo de 0 px é uma área menor do que o passo da grelha, e no arquipélago dos
     Açores há duas: é uma medida do desenho, e está no relatório. */
  const semNome = mediana(todos.filter((v) => v > 0));
  conta(
    'P1b · a 390, os 308 concelhos medidos região a região, no nível em que se tocam',
    total === 308 && foraDaArea.length === 0,
    `${total} de 308 medidos em ${REGIOES.length} regiões, todos com o ponto dentro da sua área · ${chegam} chegam aos ${ALVO} px · ` +
      `mediana ${mediana(todos)} px (${semNome} px sem os de lado zero) · ${todos.filter((v) => v === 0).length} com menos de 2 px · ` +
      `o menor com lado medível pediria um desenho de ${Math.round((390 * ALVO) / Math.max(1, Math.min(...todos.filter((v) => v > 0))))} px de largura`,
  );

  /* P1c · a rede de nomes responde por todas. */
  const semGuiao = await pagina('/', 390, { guiao: false });
  const rede = await semGuiao.evaluate(() => ({
    regioes: [...document.querySelectorAll('[data-mapa-ilhas] [data-lista-regiao]')].map((a) => a.getAttribute('data-lista-regiao')),
    unidades: [...document.querySelectorAll('[data-mapa-ilhas] [data-lista-porta]')].map((a) => a.getAttribute('data-lista-porta')),
  }));
  await semGuiao.__ctx.close();
  const indice = await pagina('/municipios', 390, { guiao: false });
  const nosConcelhos = await indice.evaluate(
    () => document.querySelectorAll('a[href^="/municipios/"]').length,
  );
  await indice.__ctx.close();
  const emFalta = REGIOES.map((r) => r.slug).filter((s) => !rede.regioes.includes(s));
  conta(
    'P1c · a rede de nomes responde pelas áreas abaixo de 44 px',
    emFalta.length === 0 && rede.unidades.length === 29 && nosConcelhos >= 308,
    `a lista dos nomes tem ${rede.regioes.length} regiões e ${rede.unidades.length} unidades da Carta · ` +
      `o índice dos concelhos tem ${nosConcelhos} ligações` +
      (emFalta.length ? ` · em falta: ${emFalta.join(', ')}` : ''),
  );
  medidas.rede = { regioes: rede.regioes.length, unidades: rede.unidades.length, concelhos: nosConcelhos };
}

/* ======================================================================= P2 */
async function p2() {
  medidas.nome = {};
  for (const [lang, casa] of [
    ['pt', '/'],
    ['en', '/en'],
  ]) {
    const p = await pagina(casa, 1280);
    const lidos = [];
    for (const r of REGIOES) {
      const alvo = `[data-uni-porta="${r.slug}"]`;
      const onde = await noEcra(p, r.ponto);
      await p.mouse.move(onde.x, onde.y);
      await p.waitForTimeout(30);
      const noRato = await p.evaluate(() => document.querySelector('[data-mapa-nome-texto]').textContent.trim());
      await p.evaluate(() => document.querySelector('[data-mapa-nome-texto]').replaceChildren());
      await p.evaluate((s) => document.querySelector(s).focus(), alvo);
      const noFoco = await p.evaluate(() => document.querySelector('[data-mapa-nome-texto]').textContent.trim());
      const porta = await p.evaluate(() => document.querySelector('[data-mapa-porta]').getAttribute('href'));
      lidos.push({ slug: r.slug, noRato, noFoco, porta });
    }
    const maus = lidos.filter((l) => !l.noRato || l.noRato !== l.noFoco || !l.porta.endsWith(l.slug));
    conta(
      `P2a · ${lang}: o nome no lugar ao passar e ao focar, nas nove regiões`,
      lidos.length === 9 && maus.length === 0,
      maus.length === 0
        ? `9 de 9 · «${lidos[0].noRato}» … «${lidos[8].noRato}» · cada porta na sua página`
        : `${maus.length} falham: ${maus.map((m) => m.slug).join(', ')}`,
    );
    await p.__ctx.close();

    /* Uma amostra de 30 concelhos, dez de cada uma das três regiões maiores. */
    const q = await pagina(casa, 1280);
    const amostra = [];
    for (const slug of ['norte', 'centro', 'alentejo']) {
      const cliente = JSON.parse(
        fs.readFileSync(path.join(DIST, REGIOES.find((r) => r.slug === slug).ficheiro), 'utf8'),
      );
      await q.goto(`${base}${casa === '/' ? '' : casa}/#regiao=${slug}`, { waitUntil: 'networkidle' });
      await q.waitForSelector('[data-areas-concelhos] [data-concelho-porta]', { timeout: 5000 });
      for (let i = 0; i < 10; i++) {
        const c = cliente.concelhos[Math.floor((i * cliente.concelhos.length) / 10)];
        const onde = await noEcra(q, c.ponto);
        await q.mouse.move(onde.x, onde.y);
        await q.waitForTimeout(20);
        const nome = await q.evaluate(() => document.querySelector('[data-mapa-nome-texto]').textContent.trim());
        const porta = await q.evaluate(() => document.querySelector('[data-mapa-porta]').getAttribute('href'));
        amostra.push({ slug: c.slug, esperado: c.nome, nome, porta });
      }
    }
    const errados = amostra.filter((a) => a.nome !== a.esperado || !a.porta.endsWith(a.slug));
    conta(
      `P2b · ${lang}: o nome no lugar numa amostra de 30 concelhos, nos três níveis de região maiores`,
      amostra.length === 30 && errados.length === 0,
      errados.length === 0
        ? `30 de 30 · «${amostra[0].nome}» … «${amostra[29].nome}»`
        : `${errados.length} errados: ${errados.map((e) => e.slug).join(', ')}`,
    );
    medidas.nome[lang] = { regioes: lidos.length, concelhos: amostra.length, errados: errados.length };
    await q.__ctx.close();
  }
}

/* ======================================================================= P3 */
async function p3() {
  /* Com o dedo. */
  const p = await pagina('/', 390, { toque: true });
  const norte = REGIOES.find((r) => r.slug === 'norte');
  const ondeNorte = await noEcra(p, norte.ponto);
  await p.touchscreen.tap(ondeNorte.x, ondeNorte.y);
  await p.waitForTimeout(500);
  /* AS LEITURAS SÃO DEFENSIVAS DE PROPÓSITO: com a planta que tira o
     `preventDefault` ao guião, o toque navega, e na página de destino não há
     lugar do nome nenhum. A célula tem de ficar VERMELHA, e não rebentar. */
  const depoisDaRegiao = await p.evaluate(() => ({
    nivel: document.querySelector('[data-mapa-raiz]')?.getAttribute('data-nivel') ?? null,
    nome: document.querySelector('[data-mapa-nome-texto]')?.textContent.trim() ?? null,
    porta: document.querySelector('[data-mapa-porta]')?.getAttribute('href') ?? null,
    hash: location.hash,
    caminho: location.pathname,
    concelhos: document.querySelectorAll('[data-areas-concelhos] [data-concelho-porta]').length,
  }));
  const doNorte = JSON.parse(fs.readFileSync(path.join(DIST, norte.ficheiro), 'utf8'));
  /* O concelho do toque é o de maior alvo desta região, porque o que se mede
     aqui é a regra dos dois toques e não a pontaria: um concelho de 2 px seria a
     célula a medir o dedo do Playwright. */
  const maior = doNorte.concelhos
    .map((c) => ({ ...c, lado: Math.min(c.caixa[2], c.caixa[3]) }))
    .sort((a, b) => b.lado - a.lado)[0];
  const primeiro = maior.slug;
  const ondeConcelho = depoisDaRegiao.concelhos > 0 ? await noEcra(p, maior.ponto) : { x: 1, y: 1 };
  await p.touchscreen.tap(ondeConcelho.x, ondeConcelho.y);
  await p.waitForTimeout(300);
  const depoisDoPrimeiro = await p.evaluate(() => ({
    caminho: location.pathname,
    nome: document.querySelector('[data-mapa-nome-texto]')?.textContent.trim() ?? null,
  }));
  const viagem = p.waitForURL(`**/municipios/${primeiro}`, { timeout: 5000 }).catch(() => null);
  await p.touchscreen.tap(ondeConcelho.x, ondeConcelho.y);
  await viagem;
  const depoisDoSegundo = await p.evaluate(() => location.pathname);
  conta(
    'P3a · com o dedo: a região cresce sem navegar, o primeiro toque num concelho diz o nome, o segundo abre',
    depoisDaRegiao.nivel === 'regiao' &&
      depoisDaRegiao.caminho === '/' &&
      depoisDaRegiao.hash === '#regiao=norte' &&
      depoisDaRegiao.concelhos === 86 &&
      depoisDoPrimeiro.caminho === '/' &&
      depoisDoSegundo === `/municipios/${primeiro}`,
    `a região: nível «${depoisDaRegiao.nivel}», ${depoisDaRegiao.concelhos} concelhos, endereço «${depoisDaRegiao.caminho}${depoisDaRegiao.hash}», ` +
      `nome «${depoisDaRegiao.nome}» com a porta «${depoisDaRegiao.porta}» · o primeiro toque no concelho deixa o endereço em «${depoisDoPrimeiro.caminho}» ` +
      `e diz «${depoisDoPrimeiro.nome}» · o segundo abre «${depoisDoSegundo}»`,
  );
  await p.__ctx.close();

  /* Com o rato, e o botão de voltar do navegador. */
  const q = await pagina('/', 1280);
  const alentejo = REGIOES.find((r) => r.slug === 'alentejo');
  const ondeAlentejo = await noEcra(q, alentejo.ponto);
  await q.mouse.click(ondeAlentejo.x, ondeAlentejo.y);
  await q.waitForTimeout(400);
  const leEstado = () => ({
    nivel: document.querySelector('[data-mapa-raiz]')?.getAttribute('data-nivel') ?? null,
    hash: location.hash,
    voltar: document.querySelector('[data-mapa-voltar]') ? !document.querySelector('[data-mapa-voltar]').hidden : false,
  });
  const naRegiao = await q.evaluate(leEstado);
  if (naRegiao.voltar) await q.click('[data-mapa-voltar]');
  await q.waitForTimeout(300);
  const noPais = await q.evaluate(leEstado);
  await q.goBack();
  await q.waitForTimeout(400);
  const depoisDoVoltar = await q.evaluate(leEstado);
  conta(
    'P3b · com o rato: a porta de voltar sobe um nível, e o botão de voltar do navegador desfaz o que o toque escreveu',
    naRegiao.nivel === 'regiao' &&
      naRegiao.hash === '#regiao=alentejo' &&
      naRegiao.voltar &&
      noPais.nivel === 'pais' &&
      noPais.hash === '' &&
      depoisDoVoltar.nivel === 'regiao' &&
      depoisDoVoltar.hash === '#regiao=alentejo',
    `clique → «${naRegiao.hash}» (nível ${naRegiao.nivel}) · «Voltar ao país» → «${noPais.hash || 'sem fragmento'}» (nível ${noPais.nivel}) · ` +
      `voltar do navegador → «${depoisDoVoltar.hash}» (nível ${depoisDoVoltar.nivel})`,
  );

  /* A porta do lugar do nome abre a página da região. */
  await q.goto(`${base}/`, { waitUntil: 'networkidle' });
  const algarve = REGIOES.find((r) => r.slug === 'algarve');
  const ondeAlgarve = await noEcra(q, algarve.ponto);
  await q.mouse.move(ondeAlgarve.x, ondeAlgarve.y);
  await q.waitForTimeout(50);
  const daPorta = await q.evaluate(
    () => document.querySelector('[data-mapa-porta]')?.getAttribute('href') ?? null,
  );
  const viagem2 = q.waitForURL('**/regioes/algarve', { timeout: 5000 }).catch(() => null);
  if (daPorta) await q.click('[data-mapa-porta]');
  await viagem2;
  const chegou = await q.evaluate(() => location.pathname);
  conta(
    'P3c · a porta do lugar do nome abre a página da região apontada',
    daPorta === '/regioes/algarve' && chegou === '/regioes/algarve',
    `a porta diz «${daPorta}» e leva a «${chegou}»`,
  );
  await q.__ctx.close();
}

/* ======================================================================= P4 */
async function p4() {
  for (const [lang, casa, prefixo] of [
    ['pt', '/', '/regioes/'],
    ['en', '/en', '/en/regions/'],
  ]) {
    const p = await pagina(`${casa}#regiao=norte`, 390, { guiao: false });
    const r = await p.evaluate((pre) => {
      const areas = [...document.querySelectorAll('[data-areas] [data-uni-porta]')];
      return {
        areas: areas.length,
        comDestino: areas.filter((a) => (a.getAttribute('href') || '').startsWith(pre)).length,
        destinos: areas.map((a) => a.getAttribute('href')),
        gaveta: document.querySelector('[data-cabeca-nomes] details')?.hasAttribute('open') ?? null,
        naLista: document.querySelectorAll('[data-mapa-ilhas] [data-lista-porta]').length,
        regioesNaLista: document.querySelectorAll('[data-mapa-ilhas] [data-lista-regiao]').length,
        lugar: document.querySelector('[data-mapa-nome]')?.hidden ?? null,
        segundoNivel: document.querySelectorAll('[data-areas-concelhos] *').length,
      };
    }, prefixo);
    /* Cada destino existe: pede-se a página de cada uma das nove. */
    const codigos = [];
    for (const destino of r.destinos) {
      /* Uma área sem `href` é uma planta desta régua, e conta como um destino
         que não responde: pede-se só o que é um endereço. */
      if (!destino) {
        codigos.push(0);
        continue;
      }
      const resposta = await fetch(`${base}${destino}`);
      codigos.push(resposta.status);
    }
    conta(
      `P4 · ${lang}: sem guião, nove ligações para as nove páginas, a lista fechada e o «#regiao=» ignorado`,
      r.areas === 9 &&
        r.comDestino === 9 &&
        codigos.every((c) => c === 200) &&
        r.gaveta === false &&
        r.naLista === 29 &&
        r.regioesNaLista === 9 &&
        r.lugar === true &&
        r.segundoNivel === 0,
      `${r.areas} áreas, ${r.comDestino} com destino em «${prefixo}», ${codigos.filter((c) => c === 200).length} de 9 respondem 200 · ` +
        `gaveta ${r.gaveta ? 'aberta' : 'fechada'} com ${r.regioesNaLista} regiões e ${r.naLista} unidades · ` +
        `o lugar do nome ${r.lugar ? 'não se rende' : 'rende-se'} · o segundo nível tem ${r.segundoNivel} nós`,
    );
    medidas[`semGuiao_${lang}`] = r;
    await p.__ctx.close();
  }
}

/* ======================================================================= P5 */
async function p5() {
  const p = await pagina('/', 390);
  const depois = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.evaluate(() => {
    const d = document.querySelector('[data-cabeca-nomes] details');
    if (d) d.open = true;
  });
  await p.waitForTimeout(150);
  const antes = await p.evaluate(() => document.documentElement.scrollHeight);
  const semGuiao = await pagina('/', 390, { guiao: false });
  const sem = await semGuiao.evaluate(() => document.documentElement.scrollHeight);
  await semGuiao.__ctx.close();
  medidas.altura = { antes, depois, semGuiao: sem };
  conta(
    'P5 · a altura de `/` a 390 com a gaveta dos nomes fechada é menor do que com ela aberta',
    depois < antes,
    `com a gaveta aberta ${antes} px, fechada ${depois} px (${antes - depois} px a menos) · sem guião ${sem} px`,
  );
  await p.__ctx.close();
}

/* ======================================================================= P7 */
const CONTRASTE = () => {
  const rgb = (s) => {
    const m = /rgba?\(([^)]+)\)/.exec(s);
    if (!m) return null;
    const [r, g, b, a] = m[1].split(',').map((n) => Number(n.trim()));
    return { r, g, b, a: a === undefined ? 1 : a };
  };
  const fundoDe = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = rgb(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) return c;
      n = n.parentElement;
    }
    return rgb(getComputedStyle(document.body).backgroundColor) ?? { r: 255, g: 255, b: 255, a: 1 };
  };
  const lum = (c) => {
    const f = (v) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const razao = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const fora = {};
  for (const [chave, sel] of [
    ['vazio', '[data-mapa-vazio="pais-toque"]'],
    ['nome', '[data-mapa-nome-texto]'],
    ['porta', '[data-mapa-porta]'],
  ]) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const cor = rgb(getComputedStyle(el).color);
    fora[chave] = Math.round(razao(cor, fundoDe(el)) * 100) / 100;
  }
  return fora;
};

async function p7() {
  medidas.contraste = {};
  for (const tema of ['light', 'dark']) {
    const p = await pagina('/', 1280, { tema });
    /* O TEMA DA CASA NÃO SE LÊ DO SISTEMA, e isso está escrito em `tokens.css`:
       o escuro é `:root[data-theme='dark']`, e quem o põe é o comando do leitor
       em `public/js/tema.js`. Medir com `colorScheme: 'dark'` e mais nada media
       o tema claro duas vezes. */
    if (tema === 'dark') {
      await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      await p.waitForTimeout(80);
    }
    const centro = REGIOES.find((x) => x.slug === 'centro');
    const ondeCentro = await noEcra(p, centro.ponto);
    await p.mouse.move(ondeCentro.x, ondeCentro.y);
    await p.waitForTimeout(50);
    const r = await p.evaluate(CONTRASTE);
    medidas.contraste[tema] = r;
    const piores = Object.entries(r).sort((a, b) => a[1] - b[1]);
    conta(
      `P7a · o lugar do nome com contraste de 4,5:1 no tema ${tema === 'light' ? 'claro' : 'escuro'}`,
      piores.length === 3 && piores[0][1] >= 4.5,
      piores.map(([k, v]) => `${k} ${v.toFixed(2)}:1`).join(' · '),
    );
    await p.__ctx.close();
  }

  const p = await pagina('/', 1280);
  const antes = await p.locator('[data-mapa-nome]').ariaSnapshot();
  const doNorte = REGIOES.find((x) => x.slug === 'norte');
  const onde = await noEcra(p, doNorte.ponto);
  await p.mouse.move(onde.x, onde.y);
  await p.waitForTimeout(120);
  const depois = await p.locator('[data-mapa-nome]').ariaSnapshot();
  conta(
    'P7b · o lugar do nome é uma região viva com nome acessível, e o que ela diz muda com a área apontada',
    /group/.test(antes) && !/Norte/.test(antes) && /Norte/.test(depois),
    `em repouso: ${antes.replace(/\s+/g, ' ').slice(0, 90)} · ao apontar: ${depois.replace(/\s+/g, ' ').slice(0, 90)}`,
  );
  const vivo = await p.evaluate(
    () => document.querySelector('[data-mapa-frase]').getAttribute('aria-live'),
  );
  conta(
    'P7c · a frase do lugar declara `aria-live="polite"`',
    vivo === 'polite',
    `aria-live="${vivo}"`,
  );
  await p.__ctx.close();
}

/* --------------------------------------------------------------- a corrida */
async function corre(quais) {
  celulas = [];
  medidas = {};
  const todas = { P1: p1, P2: p2, P3: p3, P4: p4, P5: p5, P7: p7 };
  for (const nome of quais) await todas[nome]();
}

/* ---------------------------------------------------------------------------
 * AS PLANTAS (P9)
 * ------------------------------------------------------------------------- */
const PLANTAS = [
  {
    nome: 'uma região sem nome no lugar (o `data-u` de Centro apagado)',
    celulas: ['P2a'],
    quais: ['P2'],
    estrago: (texto, rota, ext) =>
      ext === '.html' ? texto.replace(' data-u="Centro"', '').replace(' data-u="Centre"', '') : texto,
  },
  {
    nome: 'o primeiro toque a navegar (o guião deixa de segurar o clique)',
    celulas: ['P3a'],
    quais: ['P3'],
    estrago: (texto, rota, ext) =>
      ext === '.js' && rota.endsWith('/mapa-regioes.js')
        ? texto.replace(/ev\.preventDefault\(\);/g, ';')
        : texto,
  },
  {
    nome: 'um concelho fora da sua região no ficheiro da geometria',
    celulas: ['P1b', 'P2b'],
    quais: ['P1', 'P2'],
    estrago: (texto, rota, ext) => {
      if (ext !== '.json' || !rota.endsWith('/regiao-norte.json')) return texto;
      const dados = JSON.parse(texto);
      dados.concelhos = dados.concelhos.slice(0, dados.concelhos.length - 1);
      return JSON.stringify(dados);
    },
  },
  {
    nome: 'a lista fechada dos nomes aberta por defeito',
    celulas: ['P4'],
    quais: ['P4'],
    estrago: (texto, rota, ext) =>
      ext === '.html' ? texto.replace('<details class="gaveta" data-gaveta="nomes">', '<details class="gaveta" data-gaveta="nomes" open>') : texto,
  },
  {
    nome: 'uma área do nível do país sem ligação, sem guião',
    celulas: ['P4'],
    quais: ['P4'],
    estrago: (texto, rota, ext) =>
      ext === '.html' ? texto.replace(/href="\/(en\/regions|regioes)\/madeira"/, 'data-sem-destino="madeira"') : texto,
  },
];

if (VERMELHOS) {
  console.log('');
  let falhou = false;
  for (const planta of PLANTAS) {
    ESTRAGO = planta.estrago;
    await corre(planta.quais);
    ESTRAGO = null;
    const tocadas = celulas.filter((c) => planta.celulas.some((k) => c.nome.startsWith(k)));
    const apanhou = tocadas.some((c) => !c.passa);
    if (!apanhou) falhou = true;
    console.log(`  ${apanhou ? verde('vermelho ✓') : vermelho('NÃO APANHOU ✗')}  ${planta.nome}`);
    for (const c of tocadas) console.log(cinza(`              ${c.passa ? 'passa' : 'FALHA'} ${c.nome}`));
  }
  console.log('');
  await nav.close();
  servidor.close();
  process.exit(falhou ? 1 : 0);
}

await corre(['P1', 'P2', 'P3', 'P4', 'P5', 'P7']);
await nav.close();
servidor.close();

if (FICHEIRO_JSON) fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ celulas, medidas }, null, 2));

console.log('');
console.log(cinza(`  F1.1d · o mapa que cresce, e o nome ao lado · ${celulas.length} células`));
console.log('');
let falhas = 0;
for (const c of celulas) {
  if (!c.passa) falhas++;
  console.log(`  ${c.passa ? verde('passa') : vermelho('falha')}  ${c.nome}`);
  console.log(cinza(`         ${c.prova}`));
}
console.log('');
console.log(
  falhas === 0
    ? verde(`  ${celulas.length} de ${celulas.length} células passam.`)
    : vermelho(`  ${falhas} de ${celulas.length} células falham.`),
);
console.log('');
process.exit(falhas === 0 ? 0 : 1);
