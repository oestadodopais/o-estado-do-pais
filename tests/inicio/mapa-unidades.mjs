#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DO MAPA DAS UNIDADES · F1.1e, §3 do
 * BRIEF-F1.1e-os-distritos-voltam-ao-mapa
 * =============================================================================
 *
 * Uma célula por medida de aceitação do brief, medida em Chromium sem cabeça
 * sobre `dist/`. NÃO é um portão: não entra no `npm run build`. Imprime uma
 * linha por célula e SAI COM 0 quando todas passam e com 1 quando alguma falha,
 * como as outras réguas de `tests/inicio` que contam.
 *
 *   node tests/inicio/mapa-unidades.mjs
 *   node tests/inicio/mapa-unidades.mjs --json <ficheiro>
 *   node tests/inicio/mapa-unidades.mjs --vermelhos
 *
 * ---------------------------------------------------------------------------
 * O NOME DO FICHEIRO MUDOU, E A RAZÃO É O DESENHO
 * ---------------------------------------------------------------------------
 * Chamava-se `mapa-regioes.mjs` e media o mapa que o F1.1d desenhou: as nove
 * regiões NUTS II no nível do país. O diretor corrigiu-o a 08.09.2026 («the map
 * on the first page we had before was quite alright … we can select Évora and we
 * have all the municipalities»), e o nível do país voltou a ser as 29 unidades
 * da Carta. Uma régua que se chamasse «regiões» e medisse unidades era um nome a
 * mentir sobre o que ela lê. As células passam de P a U, que são as letras das
 * medidas do brief novo; o que cada uma mede, e o modo como mede, é quase tudo o
 * que o F1.1d construiu, com a fonte trocada.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * U1 · os alvos. O alvo de uma área é o MAIOR QUADRADO INSCRITO À VOLTA DO SEU
 * PONTO REPRESENTATIVO (I82, 27.08.2026), rasterizado a 2 px com
 * `isPointInFill` no próprio navegador: entre o artefacto e o dedo estão a
 * folha, o `viewBox` e a largura da coluna, e nenhum dos três se adivinha do
 * ficheiro. São três células, e a razão de serem três está na terceira:
 *
 *   U1a  as 29 unidades, a 390 e a 1280, com o número das que chegam aos 44 px;
 *   U1b  os 308 concelhos, unidade a unidade, no nível em que se tocam;
 *   U1c  a rede de nomes responde por TODAS: as 29 estão na lista fechada dos
 *        nomes e os 308 estão no índice dos concelhos.
 *
 * A U1 É MEDIDA E NÃO EXIGIDA, e é o próprio brief que o escreve: «a medida é a
 * subida, dita, e não os 44 px em todos; o diretor escolheu a área que se
 * reconhece pelo nome, e isso fica escrito». Levar o menor concelho com lado
 * medível aos 44 px pediria um desenho de milhares de píxeis de largura, e isso
 * está medido no relatório. As duas células U1a e U1b IMPRIMEM O NÚMERO e não se
 * declaram verdes como se uma meta estivesse cumprida: dizem-no no próprio nome.
 * O que exigem é que a medição corra sobre 29 de 29 e 308 de 308 e que nenhum
 * ponto representativo caia fora da sua área. Quem responde pelas áreas que não
 * chegam é a U1c, e essa É uma exigência: é a mesma decisão da Emenda 20c e da
 * I82, a rede dos nomes.
 *
 * O QUADRADO QUE ESTA RÉGUA MEDE É O MAIOR QUADRADO DA GRELHA DE 2 px QUE CONTÉM
 * O PONTO REPRESENTATIVO, e não o maior quadrado CENTRADO nele. A grelha alinha-
 * -se ao ponto (ele é sempre um nó dela) e a busca corre todos os quadrados da
 * grelha que o contêm, e não só os que o têm no meio: um ponto encostado a uma
 * costa dá zero com a segunda definição e dá o quadrado do lado com esta. As
 * duas são medidas honestas de coisas diferentes, e a do centro é o limite
 * inferior estrito da desta. É esta a definição que o Sonnet mede às cegas ao
 * lado, com a outra, e as duas leituras ficam lado a lado no relatório.
 *
 * U2 · o nome no lugar, pelos três gestos e nas duas edições. O rato mede-se com
 * `pointerover`, o teclado com o foco, e o dedo com um toque num contexto com
 * `hasTouch`. As três leituras têm de dar o mesmo nome, que é o da Carta. O DEDO
 * MEDE-SE NAS DUAS EDIÇÕES E NAS 29 UNIDADES, e não numa: a U2d faz o gesto do
 * telemóvel em 29 de 29 unidades e numa amostra de 30 concelhos, e AFIRMA o nome
 * e a porta que o lugar mostra depois do toque.
 *
 * U3 · o primeiro toque nunca navega. Mede-se com O DEDO e não com o rato, e a
 * distinção não é um preciosismo: um toque faz o navegador disparar os eventos
 * do rato antes do clique, e uma medida feita com `click()` num contexto sem
 * toque nunca veria a diferença entre «apontou» e «tocou». Com rato o nome já
 * está no lugar desde que o cursor entrou na área, e o clique é o segundo gesto:
 * a célula mede os dois caminhos, e escreve os dois.
 *
 * A PÁGINA DE UMA UNIDADE ABRE-SE PELA PORTA DO LUGAR DO NOME, E NÃO POR UM
 * SEGUNDO TOQUE NA ÁREA. É a decisão escrita do lugar de direção de 08.09.2026,
 * e não é uma falta de código: ao primeiro toque a unidade CRESCE, o seu contorno
 * sai do ecrã e o desenho passa a ser o dos seus concelhos, e o alvo do segundo
 * toque já lá não está para o receber. Quem quer a página tem a porta «Abrir →»,
 * que ficou no lugar do nome com o mesmo gesto, e é a U3c que a mede. A regra dos
 * dois toques continua a valer inteira para um CONCELHO, que não cresce, e é a
 * U3a e a U3d que a medem.
 *
 * U4 · sem guião. O contexto corre com `javaScriptEnabled: false`, que é o
 * leitor sem script: as 29 áreas continuam a ser ligações para as 29 páginas de
 * unidade, a lista fica fechada com as 29, nenhuma região é desenhada nem
 * listada, e um `#unidade=` no endereço não parte nada.
 *
 * U5 · a altura da primeira página a 390, contra a de partida. O «antes» lê-se do
 * artefacto que a régua do F1.1d gravou (`mapa-medidas.json`, cabeça `c9823939`,
 * 390 × 664 em Chromium), que é a mesma largura e o mesmo motor desta célula. O
 * «depois» é esta árvore, e a exigência do brief é «igual ou menor». A célula
 * escreve também a altura com a gaveta dos nomes aberta e sem guião, que são
 * duas leituras da MESMA construção e servem para saber quanto pesa a gaveta,
 * não para dizer de onde a página veio.
 *
 * U6 · o portão do mapa. Não é uma célula desta régua: é `npm run check:mapa`, e
 * a regra que mede o segundo nível servido é a R8.
 *
 * U7 · a página do concelho com o nível da unidade. A página do concelho é de
 * outro bloco, e este NÃO LHE TOCA: o que ele entrega é o nível como parâmetro
 * do componente. A célula constrói uma PÁGINA DE PROVA (uma página Astro de uma
 * linha, que rende `MapaRespira` com `nivel="unidade"`, na mesma postura de
 * localizador em que a página do concelho o rende) e mede-a. Nada disso entra no
 * sítio nem no repositório: vive em `dist/`, e leva menos de dois segundos.
 *
 * U8 · as réguas e os portões. Os comandos são de fora; as três células U8 são as
 * P7 do F1.1d herdadas (o contraste do lugar do nome nos dois temas e o que se
 * mede do anúncio), que ficam porque o lugar do nome não mudou neste bloco.
 * NENHUMA DELAS OUVE UM LEITOR DE ECRÃ: uma confere que a frase declara
 * `aria-live="polite"`, que é o atributo por onde um leitor de ecrã sabe que há
 * ali algo a reler, e a outra confere que A ÁRVORE DE ACESSIBILIDADE DO LUGAR
 * MUDA quando a área apontada muda (`ariaSnapshot` antes e depois). Dizer que um
 * leitor de ecrã anunciou seria afirmar o que esta régua não mede.
 *
 * U9 · as plantas. Cada uma é a coisa que uma célula existe para apanhar, posta
 * na resposta que o servidor dá e em mais lado nenhum; a régua volta a correr as
 * células que ela toca e exige que TODAS fiquem vermelhas. As cinco que o brief
 * nomeia estão lá: uma unidade sem nome, um concelho na unidade errada, o
 * primeiro toque a navegar, a lista aberta por defeito e uma região a voltar ao
 * desenho.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { chromium, webkit } from 'playwright';

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

/* ---------------------------------------------------------------------------
 * AS 29 UNIDADES, LIDAS DO ARTEFACTO DO MOTOR
 * ---------------------------------------------------------------------------
 * O nível do país do mapa são os 18 distritos, as duas ilhas da Madeira e as
 * nove dos Açores, com a geometria e o ponto representativo que `mapa/pais.json`
 * traz; os concelhos de cada uma vêm de `mapa/distritos/<slug>.json`, que é o
 * MESMO ficheiro que a construção copia para `public/dados/mapa/unidade-<slug>.json`
 * e o guião pede ao navegador. A régua lê o artefacto e não a cópia, para que uma
 * cópia errada dê célula vermelha e não uma comparação de um ficheiro consigo
 * próprio; que os dois sejam iguais byte a byte é a R8 do portão do mapa. */
const UNIDADES = JSON.parse(fs.readFileSync(path.join(RAIZ, 'mapa', 'pais.json'), 'utf8')).unidades;
const ficheiroDaUnidade = (slug) => `dados/mapa/unidade-${slug}.json`;
const concelhosDe = (slug) =>
  JSON.parse(fs.readFileSync(path.join(RAIZ, 'mapa', 'distritos', `${slug}.json`), 'utf8')).concelhos;
/* As três unidades com mais concelhos, para a amostra de 30 (dez em cada uma).
   Contadas do artefacto e não escolhidas à mão. */
const AS_TRES_MAIORES = UNIDADES.map((u) => ({ slug: u.slug, n: concelhosDe(u.slug).length }))
  .sort((a, b) => b.n - a.n)
  .slice(0, 3)
  .map((x) => x.slug);
/** A unidade de um slug. */
const uni = (slug) => UNIDADES.find((u) => u.slug === slug);

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
/* O SEGUNDO MOTOR ABRE-SE UMA VEZ E SÓ ONDE É PRECISO. A célula P3a corre nos
   dois, e a razão está medida no cabeçalho de `public/js/mapa-regioes.js`: o
   `pointerType` de um clique feito com o dedo diz «touch» no Chromium e «mouse»
   no WebKit, e a primeira forma da regra do primeiro toque passava num e caía no
   outro, que é o motor de todos os telemóveis da Apple. */
const navWebkit = await webkit.launch();
const MOTORES = [
  ['Chromium', nav],
  ['WebKit', navWebkit],
];

/** Uma página, com o contexto que a célula pede. */
async function pagina(rota, largura, opcoes = {}) {
  const ctx = await (opcoes.motor ?? nav).newContext({
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

/* ======================================================================= U1 */
async function u1() {
  const pontosDaUnidade = Object.fromEntries(UNIDADES.map((u) => [u.slug, u.ponto]));
  medidas.alvos = {};
  for (const largura of [390, 1280]) {
    const p = await pagina('/', largura);
    const desenho = await p.evaluate(() => {
      const b = document.querySelector('[data-mapa-areas]').getBoundingClientRect();
      return [Math.round(b.width), Math.round(b.height)];
    });
    const r = await p.evaluate(QUADRADO_INSCRITO, { pontos: pontosDaUnidade, PASSO: 2, seletor: '[data-areas] .uni' });
    const entradas = Object.entries(r);
    const chegam = entradas.filter(([, v]) => v.inscrito >= ALVO);
    /* DUAS COISAS DIFERENTES, E SÓ UMA É UM DEFEITO. Um ponto representativo FORA
       da sua área é um erro de geometria e a célula recusa-o; um quadrado
       inscrito de 0 px é uma área menor do que o passo da grelha àquela largura,
       que é uma MEDIDA do desenho e não um erro: às 390 px de um telemóvel há
       ilhas dos Açores com menos de 2 px de lado. A primeira forma desta célula
       (herdada do F1.1d, onde o desenho tinha nove áreas grandes) juntava as
       duas e recusava as ilhas. */
    const fora = entradas.filter(([, v]) => !v.dentro);
    const semLado = entradas.filter(([, v]) => v.inscrito === 0);
    medidas.alvos[`unidades_${largura}`] = {
      desenho,
      chegam: chegam.length,
      areas: entradas.length,
      semLado: semLado.length,
      foraDaArea: fora.length,
      mediana: mediana(entradas.map(([, v]) => v.inscrito)),
      unidades: entradas
        .sort((a, b) => b[1].inscrito - a[1].inscrito)
        .map(([slug, v]) => ({ slug, inscrito: v.inscrito, caixa: v.caixa })),
    };
    conta(
      `U1a · medida, não exigida (decisão de 08.09.2026) · a ${largura}, o alvo das 29 unidades`,
      entradas.length === 29 && fora.length === 0,
      `desenho ${desenho[0]} × ${desenho[1]} px · ${entradas.length} áreas · ${chegam.length} de 29 chegam aos ${ALVO} px (medido, não exigido) ` +
        `(mediana ${mediana(entradas.map(([, v]) => v.inscrito))} px; a maior ${Math.max(...entradas.map(([, v]) => v.inscrito))} px, ` +
        `a menor ${Math.min(...entradas.map(([, v]) => v.inscrito))} px) · ` +
        `${semLado.length} com menos de 2 px de lado · ${fora.length} com o ponto fora da área`,
    );
    await p.__ctx.close();
  }

  /* U1b · os concelhos, unidade a unidade, no nível em que se tocam. */
  const p = await pagina('/', 390);
  let total = 0;
  let chegam = 0;
  const todos = [];
  const foraDaArea = [];
  const porUnidade = {};
  for (const r of UNIDADES) {
    const cliente = JSON.parse(fs.readFileSync(path.join(DIST, ficheiroDaUnidade(r.slug)), 'utf8'));
    const pontos = Object.fromEntries(cliente.concelhos.map((c) => [c.slug, c.ponto]));
    await p.goto(`${base}/#unidade=${r.slug}`, { waitUntil: 'networkidle' });
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
    porUnidade[r.slug] = {
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
  medidas.alvos.concelhos_390 = { total, chegam, mediana: mediana(todos), porUnidade };
  /* O QUE A CÉLULA EXIGE É QUE OS 308 ESTEJAM DESENHADOS E QUE O PONTO DE CADA UM
     CAIA DENTRO DA SUA ÁREA. O tamanho do alvo é um número que ela escreve, e não
     uma condição: com o desenho à largura de um telemóvel ele não chega aos 44 px
     para a maior parte, e quem responde por esses é a rede de nomes (P1c). Um
     alvo de 0 px é uma área menor do que o passo da grelha, e no arquipélago dos
     Açores há duas: é uma medida do desenho, e está no relatório.

     A DECISÃO DE 08.09.2026 ESTÁ NO NOME DA CÉLULA e não só aqui: uma célula
     verde com um nome que promete os 44 px seria a régua a dizer que a medida do
     brief está cumprida quando ela não está, e foi a leitura a frio do Codex que
     o apanhou (achado 5). A U1 do F1.1e diz-o por escrito: «a medida é a subida,
     dita, e não os 44 px em todos». */
  const semNome = mediana(todos.filter((v) => v > 0));
  conta(
    'U1b · medida, não exigida (decisão de 08.09.2026) · a 390, o alvo dos 308 concelhos, unidade a unidade',
    total === 308 && foraDaArea.length === 0,
    `${total} de 308 medidos em ${UNIDADES.length} unidades, todos com o ponto dentro da sua área · ${chegam} chegam aos ${ALVO} px (medido, não exigido) · ` +
      `mediana ${mediana(todos)} px (${semNome} px sem os de lado zero) · ${todos.filter((v) => v === 0).length} com menos de 2 px · ` +
      `o menor com lado medível pediria um desenho de ${Math.round((390 * ALVO) / Math.max(1, Math.min(...todos.filter((v) => v > 0))))} px de largura`,
  );

  /* U1c · a rede de nomes responde por todas. */
  const semGuiao = await pagina('/', 390, { guiao: false });
  const rede = await semGuiao.evaluate(() => ({
    unidades: [...document.querySelectorAll('[data-mapa-ilhas] [data-lista-porta]')].map((a) => a.getAttribute('data-lista-porta')),
  }));
  await semGuiao.__ctx.close();
  const indice = await pagina('/municipios', 390, { guiao: false });
  const nosConcelhos = await indice.evaluate(
    () => document.querySelectorAll('a[href^="/municipios/"]').length,
  );
  await indice.__ctx.close();
  const emFalta = UNIDADES.map((u) => u.slug).filter((s) => !rede.unidades.includes(s));
  conta(
    'U1c · a rede de nomes responde pelas áreas abaixo de 44 px',
    emFalta.length === 0 && rede.unidades.length === 29 && nosConcelhos >= 308,
    `a lista dos nomes tem ${rede.unidades.length} unidades da Carta · ` +
      `o índice dos concelhos tem ${nosConcelhos} ligações` +
      (emFalta.length ? ` · em falta: ${emFalta.join(', ')}` : ''),
  );
  medidas.rede = { unidades: rede.unidades.length, concelhos: nosConcelhos };
}

/* ======================================================================= U2 */
async function u2() {
  medidas.nome = {};
  for (const [lang, casa] of [
    ['pt', '/'],
    ['en', '/en'],
  ]) {
    const p = await pagina(casa, 1280);
    const lidos = [];
    for (const r of UNIDADES) {
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
      `U2a · ${lang}: o nome no lugar ao passar e ao focar, nas 29 unidades`,
      lidos.length === 29 && maus.length === 0,
      maus.length === 0
        ? `29 de 29 · «${lidos[0].noRato}» … «${lidos[28].noRato}» · cada porta na sua página`
        : `${maus.length} falham: ${maus.map((m) => m.slug).join(', ')}`,
    );
    await p.__ctx.close();

    /* Uma amostra de 30 concelhos, dez de cada uma das três unidades maiores. */
    const q = await pagina(casa, 1280);
    const amostra = [];
    for (const slug of AS_TRES_MAIORES) {
      const cliente = JSON.parse(fs.readFileSync(path.join(DIST, ficheiroDaUnidade(slug)), 'utf8'));
      await q.goto(`${base}${casa === '/' ? '' : casa}/#unidade=${slug}`, { waitUntil: 'networkidle' });
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
      `U2b · ${lang}: o nome no lugar numa amostra de 30 concelhos, nos níveis das três unidades maiores`,
      amostra.length === 30 && errados.length === 0,
      errados.length === 0
        ? `30 de 30 · «${amostra[0].nome}» … «${amostra[29].nome}»`
        : `${errados.length} errados: ${errados.map((e) => e.slug).join(', ')}`,
    );
    medidas.nome[lang] = { unidades: lidos.length, concelhos: amostra.length, errados: errados.length };
    await q.__ctx.close();

    /* U2c · a página de um distrito tem o mesmo lugar do nome para os seus
       concelhos (item 7 do brief do F1.1d, que este bloco não desfaz). Mede-se em
       Lisboa, que é a unidade com os concelhos mais apertados do continente. */
    const d = await pagina(lang === 'pt' ? '/distritos/lisboa' : '/en/districts/lisboa', 1280);
    const artefacto = JSON.parse(
      fs.readFileSync(path.join(RAIZ, 'mapa', 'distritos', 'lisboa.json'), 'utf8'),
    );
    const noDistrito = [];
    for (const c of artefacto.concelhos) {
      await d.locator('[data-mapa-concelhos]').scrollIntoViewIfNeeded();
      const onde = await d.evaluate((pt) => {
        const svg = document.querySelector('[data-mapa-concelhos]');
        const q2 = new DOMPoint(pt[0], pt[1]).matrixTransform(svg.getScreenCTM());
        return { x: q2.x, y: q2.y };
      }, c.ponto);
      await d.mouse.move(onde.x, onde.y);
      await d.waitForTimeout(20);
      const nome = await d.evaluate(
        () => document.querySelector('[data-mapa-nome-texto]')?.textContent.trim() ?? '',
      );
      const destino = await d.evaluate(
        () => document.querySelector('[data-mapa-porta]')?.getAttribute('href') ?? '',
      );
      noDistrito.push({ slug: c.slug, esperado: c.nome, nome, destino });
    }
    const semVoltar = await d.evaluate(() => document.querySelectorAll('[data-mapa-voltar]').length);
    const maus2 = noDistrito.filter((x) => x.nome !== x.esperado || !x.destino.endsWith(x.slug));
    conta(
      `U2c · ${lang}: numa página de distrito, o lugar do nome diz o concelho apontado`,
      noDistrito.length === artefacto.concelhos.length && maus2.length === 0 && semVoltar === 0,
      `${noDistrito.length - maus2.length} de ${noDistrito.length} concelhos de Lisboa · ` +
        `«${noDistrito[0].nome}» … «${noDistrito[noDistrito.length - 1].nome}» · ` +
        `${semVoltar} porta(s) de voltar (uma página de distrito não tem nível de cima)`,
    );
    await d.__ctx.close();

    /* -----------------------------------------------------------------------
       U2d · O NOME NO LUGAR AO TOCAR, NAS 29 UNIDADES E EM 30 CONCELHOS.
       -----------------------------------------------------------------------
       A U2a e a U2b medem o rato e o teclado; sem esta célula o gesto do
       telemóvel ficava medido numa região e num concelho, e só em português (a
       leitura a frio do Codex de 08.09.2026, achado 7). O contexto tem
       `hasTouch` e a largura de um telemóvel, e a célula AFIRMA as duas coisas
       que o lugar mostra depois do toque: o nome e a porta.

       O NOME ESPERADO DE UMA UNIDADE LÊ-SE DO `<title>` DA SUA ÁREA, que é o nome
       acessível que o servidor desenhou; o de um concelho lê-se do ficheiro da
       unidade, que é a Carta. Assim a célula não guarda uma lista de nomes que
       teria de acompanhar o artefacto à mão. */
    const t = await pagina(casa, 390, { toque: true });
    /* «Não navegou» é ter ficado na mesma casa, com ou sem barra no fim: a
       primeira página em inglês responde tanto em «/en» como em «/en/». */
    const naCasa = (caminho) => (caminho ?? '').replace(/\/+$/, '') === casa.replace(/\/+$/, '');
    const toqueNasUnidades = [];
    for (const r of UNIDADES) {
      const alvo = `[data-uni-porta="${r.slug}"]`;
      const esperado = await t.evaluate(
        (sel) => document.querySelector(sel)?.querySelector('title')?.textContent.trim() ?? null,
        alvo,
      );
      const onde = await noEcra(t, r.ponto);
      await t.touchscreen.tap(onde.x, onde.y);
      await t.waitForTimeout(250);
      const lido = await t.evaluate(() => ({
        nome: document.querySelector('[data-mapa-nome-texto]')?.textContent.trim() ?? null,
        porta: document.querySelector('[data-mapa-porta]')?.getAttribute('href') ?? null,
        caminho: location.pathname,
      }));
      toqueNasUnidades.push({ slug: r.slug, esperado, ...lido });
      /* VOLTA AO NÍVEL DO PAÍS PELO ENDEREÇO, E NÃO POR UM CLIQUE NA PORTA DE
         SUBIR: um `click` do Playwright é um gesto DE RATO, e num telemóvel não
         há rato nenhum. Medido a 08.09.2026 (F1.1d): com o clique de rato pelo
         meio, algumas áreas devolvem o nome de um CONCELHO em vez do da área
         tocada, porque o cursor do rato fica parado sobre o mapa e o navegador
         reavalia o que está debaixo dele quando o desenho novo nasce; com o
         fragmento, que é o mesmo caminho que o botão de voltar do navegador
         percorre, não acontece. O que a célula mede é o dedo, e um rato a meio
         media outro gesto. A observação fica no relatório. */
      await t.evaluate(() => {
        location.hash = '';
      });
      await t.waitForTimeout(150);
    }
    const masUnidades = toqueNasUnidades.filter(
      (x) => !x.esperado || x.nome !== x.esperado || !x.porta || !x.porta.endsWith(x.slug) || !naCasa(x.caminho),
    );
    conta(
      `U2d · ${lang}: com o dedo, o nome e a porta no lugar nas 29 unidades`,
      toqueNasUnidades.length === 29 && masUnidades.length === 0,
      masUnidades.length === 0
        ? `29 de 29 · «${toqueNasUnidades[0].nome}» → «${toqueNasUnidades[0].porta}» … ` +
          `«${toqueNasUnidades[28].nome}» → «${toqueNasUnidades[28].porta}» · nenhum toque navegou`
        : `${masUnidades.length} falham: ${masUnidades
            .map((x) => `${x.slug} diz «${x.nome}» e a porta «${x.porta}»`)
            .join('; ')}`,
    );

    /* A amostra de 30 concelhos, dez em cada uma das três unidades maiores. Cada
       toque é o PRIMEIRO naquele concelho, e por isso nenhum navega. */
    const toqueNosConcelhos = [];
    for (const slug of AS_TRES_MAIORES) {
      const cliente = JSON.parse(fs.readFileSync(path.join(DIST, ficheiroDaUnidade(slug)), 'utf8'));
      await t.goto(`${base}${casa === '/' ? '' : casa}/#unidade=${slug}`, { waitUntil: 'networkidle' });
      await t.waitForSelector('[data-areas-concelhos] [data-concelho-porta]', { timeout: 5000 });
      for (let i = 0; i < 10; i++) {
        const c = cliente.concelhos[Math.floor((i * cliente.concelhos.length) / 10)];
        const onde = await noEcra(t, c.ponto);
        await t.touchscreen.tap(onde.x, onde.y);
        await t.waitForTimeout(80);
        const lido = await t.evaluate(() => ({
          nome: document.querySelector('[data-mapa-nome-texto]')?.textContent.trim() ?? null,
          porta: document.querySelector('[data-mapa-porta]')?.getAttribute('href') ?? null,
          caminho: location.pathname,
        }));
        toqueNosConcelhos.push({ slug: c.slug, esperado: c.nome, ...lido });
      }
    }
    const masConcelhos = toqueNosConcelhos.filter(
      (x) => x.nome !== x.esperado || !x.porta || !x.porta.endsWith(x.slug) || !naCasa(x.caminho),
    );
    conta(
      `U2d · ${lang}: com o dedo, o nome e a porta no lugar numa amostra de 30 concelhos`,
      toqueNosConcelhos.length === 30 && masConcelhos.length === 0,
      masConcelhos.length === 0
        ? `30 de 30 · «${toqueNosConcelhos[0].nome}» → «${toqueNosConcelhos[0].porta}» … ` +
          `«${toqueNosConcelhos[29].nome}» → «${toqueNosConcelhos[29].porta}» · nenhum primeiro toque navegou`
        : `${masConcelhos.length} falham: ${masConcelhos
            .slice(0, 6)
            .map((x) => `${x.slug} diz «${x.nome}»`)
            .join('; ')}`,
    );
    medidas.nome[lang].toqueUnidades = toqueNasUnidades.length - masUnidades.length;
    medidas.nome[lang].toqueConcelhos = toqueNosConcelhos.length - masConcelhos.length;
    await t.__ctx.close();
  }
}

/* ======================================================================= U3 */
async function u3() {
  for (const [motor, browser] of MOTORES) await u3aNum(motor, browser);
  await u3resto();
}

/* A UNIDADE QUE CRESCE NA U3a É ÉVORA, e não é uma escolha de acaso: é a que o
   diretor nomeou a 08.09 («we can select Évora and we have all the
   municipalities»). O número de concelhos lê-se do artefacto. */
const A_QUE_CRESCE = 'evora';

/** U3a · com o dedo, num motor. */
async function u3aNum(motor, browser) {
  const p = await pagina('/', 390, { toque: true, motor: browser });
  const norte = uni(A_QUE_CRESCE);
  /* O NOME ESPERADO LÊ-SE DO `<title>` DA ÁREA ANTES DO GESTO, e a célula
     AFIRMA-O depois: escrever o nome na prova e não o comparar era a régua a
     imprimir o que quer que o lugar dissesse (leitura a frio do Codex de
     08.09.2026, achado 7). */
  const nomeDoNorte = await p.evaluate(
    (sel) => document.querySelector(sel)?.querySelector('title')?.textContent.trim() ?? null,
    `[data-uni-porta="${A_QUE_CRESCE}"]`,
  );
  const ondeNorte = await noEcra(p, norte.ponto);
  await p.touchscreen.tap(ondeNorte.x, ondeNorte.y);
  await p.waitForTimeout(500);
  /* AS LEITURAS SÃO DEFENSIVAS DE PROPÓSITO: com a planta que tira o
     `preventDefault` ao guião, o toque navega, e na página de destino não há
     lugar do nome nenhum. A célula tem de ficar VERMELHA, e não rebentar. */
  const depoisDaUnidade = await p.evaluate(() => ({
    nivel: document.querySelector('[data-mapa-raiz]')?.getAttribute('data-nivel') ?? null,
    nome: document.querySelector('[data-mapa-nome-texto]')?.textContent.trim() ?? null,
    porta: document.querySelector('[data-mapa-porta]')?.getAttribute('href') ?? null,
    hash: location.hash,
    caminho: location.pathname,
    concelhos: document.querySelectorAll('[data-areas-concelhos] [data-concelho-porta]').length,
  }));
  const doNorte = JSON.parse(fs.readFileSync(path.join(DIST, ficheiroDaUnidade(norte.slug)), 'utf8'));
  /* O concelho do toque é o de maior alvo desta unidade, porque o que se mede
     aqui é a regra dos dois toques e não a pontaria: um concelho de 2 px seria a
     célula a medir o dedo do Playwright. */
  const maior = doNorte.concelhos
    .map((c) => ({ ...c, lado: Math.min(c.caixa[2], c.caixa[3]) }))
    .sort((a, b) => b.lado - a.lado)[0];
  const primeiro = maior.slug;
  const ondeConcelho = depoisDaUnidade.concelhos > 0 ? await noEcra(p, maior.ponto) : { x: 1, y: 1 };
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
    `U3a · ${motor}, com o dedo: a unidade cresce sem navegar, o primeiro toque num concelho diz o nome, o segundo abre`,
    depoisDaUnidade.nivel === 'unidade' &&
      depoisDaUnidade.caminho === '/' &&
      depoisDaUnidade.hash === `#unidade=${A_QUE_CRESCE}` &&
      depoisDaUnidade.concelhos === doNorte.concelhos.length &&
      !!nomeDoNorte &&
      depoisDaUnidade.nome === nomeDoNorte &&
      depoisDaUnidade.porta === `/distritos/${A_QUE_CRESCE}` &&
      depoisDoPrimeiro.caminho === '/' &&
      depoisDoPrimeiro.nome === maior.nome &&
      depoisDoSegundo === `/municipios/${primeiro}`,
    `a unidade: nível «${depoisDaUnidade.nivel}», ${depoisDaUnidade.concelhos} concelhos (o artefacto tem ${doNorte.concelhos.length}), ` +
      `endereço «${depoisDaUnidade.caminho}${depoisDaUnidade.hash}», ` +
      `nome «${depoisDaUnidade.nome}» (esperado «${nomeDoNorte}») com a porta «${depoisDaUnidade.porta}» · ` +
      `o primeiro toque no concelho deixa o endereço em «${depoisDoPrimeiro.caminho}» ` +
      `e diz «${depoisDoPrimeiro.nome}» (esperado «${maior.nome}») · o segundo abre «${depoisDoSegundo}»`,
  );
  await p.__ctx.close();
}

/** O resto da U3: o rato, a porta do lugar do nome e a página de um distrito. */
async function u3resto() {
  /* Com o rato, e o botão de voltar do navegador. */
  const q = await pagina('/', 1280);
  const alentejo = uni('beja');
  const ondeAlentejo = await noEcra(q, alentejo.ponto);
  await q.mouse.click(ondeAlentejo.x, ondeAlentejo.y);
  await q.waitForTimeout(400);
  const leEstado = () => ({
    nivel: document.querySelector('[data-mapa-raiz]')?.getAttribute('data-nivel') ?? null,
    hash: location.hash,
    voltar: document.querySelector('[data-mapa-voltar]') ? !document.querySelector('[data-mapa-voltar]').hidden : false,
  });
  const naUnidade = await q.evaluate(leEstado);
  if (naUnidade.voltar) await q.click('[data-mapa-voltar]');
  await q.waitForTimeout(300);
  const noPais = await q.evaluate(leEstado);
  await q.goBack();
  await q.waitForTimeout(400);
  const depoisDoVoltar = await q.evaluate(leEstado);
  conta(
    'U3b · com o rato: a porta de voltar sobe um nível, e o botão de voltar do navegador desfaz o que o toque escreveu',
    naUnidade.nivel === 'unidade' &&
      naUnidade.hash === '#unidade=beja' &&
      naUnidade.voltar &&
      noPais.nivel === 'pais' &&
      noPais.hash === '' &&
      depoisDoVoltar.nivel === 'unidade' &&
      depoisDoVoltar.hash === '#unidade=beja',
    `clique → «${naUnidade.hash}» (nível ${naUnidade.nivel}) · «Voltar ao país» → «${noPais.hash || 'sem fragmento'}» (nível ${noPais.nivel}) · ` +
      `voltar do navegador → «${depoisDoVoltar.hash}» (nível ${depoisDoVoltar.nivel})`,
  );

  /* A porta do lugar do nome abre a página da unidade. */
  await q.goto(`${base}/`, { waitUntil: 'networkidle' });
  const algarve = uni('faro');
  const ondeAlgarve = await noEcra(q, algarve.ponto);
  await q.mouse.move(ondeAlgarve.x, ondeAlgarve.y);
  await q.waitForTimeout(50);
  const daPorta = await q.evaluate(
    () => document.querySelector('[data-mapa-porta]')?.getAttribute('href') ?? null,
  );
  const viagem2 = q.waitForURL('**/distritos/faro', { timeout: 5000 }).catch(() => null);
  if (daPorta) await q.click('[data-mapa-porta]');
  await viagem2;
  const chegou = await q.evaluate(() => location.pathname);
  /* ESTA É A PROVA DA DECISÃO DE 08.09.2026 SOBRE O SEGUNDO TOQUE NUMA ÁREA DO
     NÍVEL DE CIMA. O brief do F1.1d pedia que um segundo toque nela abrisse a sua
     página; o lugar de direção decidiu que não, e a razão é do desenho e não do
     código: ao primeiro toque a área cresce, o grupo do nível do país esconde-se
     e o contorno dela deixa de estar no ecrã, de maneira que não há alvo nenhum
     para receber um segundo toque. A porta «Abrir →» é o caminho, e ficou no
     lugar do nome com o mesmo gesto que fez crescer a unidade. */
  conta(
    'U3c · a página de uma unidade abre-se pela porta do lugar do nome, e não por um segundo toque na área',
    daPorta === '/distritos/faro' && chegou === '/distritos/faro',
    `a porta diz «${daPorta}» e leva a «${chegou}» · uma unidade que cresceu já não tem contorno no ecrã ` +
      'para receber um segundo toque, e a regra dos dois toques vale para um concelho (U3a e U3d)',
  );
  await q.__ctx.close();

  /* U3d · a mesma regra dos dois toques numa página de distrito. */
  const d = await pagina('/distritos/lisboa', 390, { toque: true });
  const artefacto = JSON.parse(
    fs.readFileSync(path.join(RAIZ, 'mapa', 'distritos', 'lisboa.json'), 'utf8'),
  );
  const sintra = artefacto.concelhos.find((c) => c.slug === 'sintra');
  await d.locator('[data-mapa-concelhos]').scrollIntoViewIfNeeded();
  const ondeSintra = await d.evaluate((pt) => {
    const svg = document.querySelector('[data-mapa-concelhos]');
    const q2 = new DOMPoint(pt[0], pt[1]).matrixTransform(svg.getScreenCTM());
    return { x: q2.x, y: q2.y };
  }, sintra.ponto);
  await d.touchscreen.tap(ondeSintra.x, ondeSintra.y);
  await d.waitForTimeout(300);
  const primeiroToque = await d.evaluate(() => ({
    caminho: location.pathname,
    nome: document.querySelector('[data-mapa-nome-texto]')?.textContent.trim() ?? null,
  }));
  const viagem3 = d.waitForURL('**/municipios/sintra', { timeout: 5000 }).catch(() => null);
  await d.touchscreen.tap(ondeSintra.x, ondeSintra.y);
  await viagem3;
  const segundoToque = await d.evaluate(() => location.pathname);
  conta(
    'U3d · numa página de distrito, o primeiro toque num concelho diz o nome e o segundo abre',
    primeiroToque.caminho === '/distritos/lisboa' &&
      primeiroToque.nome === sintra.nome &&
      segundoToque === '/municipios/sintra',
    `o primeiro toque deixa o endereço em «${primeiroToque.caminho}» e diz «${primeiroToque.nome}» · ` +
      `o segundo abre «${segundoToque}»`,
  );
  await d.__ctx.close();

  await u3eFalha();
}

/**
 * U3e · UM PEDIDO QUE NÃO VOLTA NÃO DEIXA A LIGAÇÃO MORTA.
 *
 * O guião segura o clique numa unidade para a fazer crescer, e só depois pede o
 * ficheiro dos seus concelhos. Se o pedido não voltar, a primeira forma do guião
 * segurava o clique seguinte, e o seguinte, e a área ficava sem destino nenhum
 * (leitura a frio do Codex de 08.09.2026, achado 9). A célula põe uma unidade a
 * responder 404 com `page.route`, que é o que uma rede caída faz, e mede as três
 * coisas que a saída tem de dar: o desenho não cresce, o lugar do nome diz o que
 * aconteceu, e O TOQUE SEGUINTE ABRE A PÁGINA DA UNIDADE pela ligação que o
 * servidor escreveu.
 */
async function u3eFalha() {
  const p = await pagina('/', 390, { toque: true });
  const algarve = uni('faro');
  await p.route(`**/${ficheiroDaUnidade(algarve.slug)}`, (rota) => rota.fulfill({ status: 404, body: '404' }));
  const onde = await noEcra(p, algarve.ponto);
  await p.touchscreen.tap(onde.x, onde.y);
  await p.waitForTimeout(500);
  const depoisDoPrimeiro = await p.evaluate(() => ({
    nivel: document.querySelector('[data-mapa-raiz]')?.getAttribute('data-nivel') ?? null,
    caminho: location.pathname,
    aviso: document.querySelector('[data-mapa-aviso]')
      ? !document.querySelector('[data-mapa-aviso]').hidden
      : null,
    nome: document.querySelector('[data-mapa-nome-texto]')?.textContent.trim() ?? null,
    porta: document.querySelector('[data-mapa-porta]')?.getAttribute('href') ?? null,
  }));
  const viagem = p.waitForURL('**/distritos/faro', { timeout: 5000 }).catch(() => null);
  await p.touchscreen.tap(onde.x, onde.y);
  await viagem;
  const depoisDoSegundo = await p.evaluate(() => location.pathname);
  conta(
    'U3e · com o ficheiro de uma unidade a responder 404, o mapa não cresce, o lugar do nome di-lo e o toque seguinte abre a página dela',
    depoisDoPrimeiro.nivel === 'pais' &&
      depoisDoPrimeiro.caminho === '/' &&
      depoisDoPrimeiro.aviso === true &&
      depoisDoPrimeiro.nome === algarve.nome &&
      depoisDoPrimeiro.porta === '/distritos/faro' &&
      depoisDoSegundo === '/distritos/faro',
    `o primeiro toque deixa o nível em «${depoisDoPrimeiro.nivel}» e o endereço em «${depoisDoPrimeiro.caminho}», ` +
      `com o nome «${depoisDoPrimeiro.nome}», a porta «${depoisDoPrimeiro.porta}» e o aviso ${
        depoisDoPrimeiro.aviso ? 'à vista' : 'escondido'
      } · o toque seguinte abre «${depoisDoSegundo}»`,
  );
  medidas.semFicheiro = depoisDoPrimeiro;
  await p.__ctx.close();
}

/* ======================================================================= U4 */
async function u4() {
  for (const [lang, casa, prefixo] of [
    ['pt', '/', '/distritos/'],
    ['en', '/en', '/en/districts/'],
  ]) {
    const p = await pagina(`${casa}#unidade=evora`, 390, { guiao: false });
    const r = await p.evaluate((pre) => {
      const areas = [...document.querySelectorAll('[data-areas] [data-uni-porta]')];
      return {
        areas: areas.length,
        comDestino: areas.filter((a) => (a.getAttribute('href') || '').startsWith(pre)).length,
        destinos: areas.map((a) => a.getAttribute('href')),
        gaveta: document.querySelector('[data-cabeca-nomes] details')?.hasAttribute('open') ?? null,
        naLista: document.querySelectorAll('[data-mapa-ilhas] [data-lista-porta]').length,
        /* NENHUMA REGIÃO NO DESENHO NEM NA LISTA (U4 do F1.1e): uma ligação para
           `/regioes/` dentro do mapa ou da lista dos nomes é uma região a voltar
           ao desenho, e é isso que esta contagem proíbe. As nove continuam a ter
           página e a estar no menu, que é outra superfície. */
        regioesDesenhadas: document.querySelectorAll(
          '[data-mapa-areas] a[href*="/regioes/"], [data-mapa-areas] a[href*="/regions/"], ' +
            '[data-mapa-ilhas] a[href*="/regioes/"], [data-mapa-ilhas] a[href*="/regions/"]',
        ).length,
        lugar: document.querySelector('[data-mapa-nome]')?.hidden ?? null,
        segundoNivel: document.querySelectorAll('[data-areas-concelhos] *').length,
      };
    }, prefixo);
    /* Cada destino existe: pede-se a página de cada uma das 29. */
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
      `U4 · ${lang}: sem guião, 29 ligações para as 29 páginas, a lista fechada com as 29, zero regiões desenhadas e o «#unidade=» ignorado`,
      r.areas === 29 &&
        r.comDestino === 29 &&
        codigos.length === 29 &&
        codigos.every((c) => c === 200) &&
        r.gaveta === false &&
        r.naLista === 29 &&
        r.regioesDesenhadas === 0 &&
        r.lugar === true &&
        r.segundoNivel === 0,
      `${r.areas} áreas, ${r.comDestino} com destino em «${prefixo}», ${codigos.filter((c) => c === 200).length} de ${codigos.length} respondem 200 · ` +
        `gaveta ${r.gaveta ? 'aberta' : 'fechada'} com ${r.naLista} unidades · ${r.regioesDesenhadas} região(ões) no desenho ou na lista · ` +
        `o lugar do nome ${r.lugar ? 'não se rende' : 'rende-se'} · o segundo nível tem ${r.segundoNivel} nós`,
    );
    /* OS CÓDIGOS ENTRAM NO ARTEFACTO, e não só na prova impressa. A célula
       decidia com eles e guardava só os destinos: o ficheiro reproduzia nove
       endereços e não nove respostas (leitura a frio do Codex de 08.09.2026,
       achado 17). */
    medidas[`semGuiao_${lang}`] = { ...r, codigos };
    await p.__ctx.close();
  }
}

/* ======================================================================= U5 */
/**
 * O «ANTES» DESTE BLOCO É A PÁGINA DE PARTIDA, E O NÚMERO LÊ-SE DO ARTEFACTO QUE
 * O BLOCO ANTERIOR GRAVOU.
 *
 * A U5 do brief pede que a altura de `/` a 390 fique «igual ou menor do que a de
 * partida (`c9823939`, a medida da P5 do F1.1d)». `c9823939` é a cabeça em que o
 * F1.1d fechou o seu relatório, e a medida está no ficheiro que a régua desse
 * bloco gravou: `mapa-medidas.json`, `medidas.altura.depois`. É do mesmo motor e
 * da mesma largura desta célula (Chromium, 390 × 664), na primeira página
 * portuguesa com guião, em repouso.
 *
 * NÃO SE VOLTA A MEDIR O ANTES NESTA ÁRVORE, e a razão é a mesma que a leitura a
 * frio do Codex escreveu sobre a P5 (achado 11): a página de partida tinha outro
 * desenho e outra lista, e não se reconstrói mexendo na página de agora.
 */
const ANTES_DO_F11D = {
  ficheiro: 'design/especime-v3/medicoes/mapa-medidas.json',
  chave: 'medidas.altura.depois',
  cabeca: 'c9823939, a cabeça em que o F1.1d fechou o relatório',
};

async function u5() {
  const doF11d = JSON.parse(fs.readFileSync(path.join(RAIZ, ANTES_DO_F11D.ficheiro), 'utf8'));
  const antes = doF11d.medidas?.altura?.depois ?? null;

  const p = await pagina('/', 390);
  const depois = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.evaluate(() => {
    const d = document.querySelector('[data-cabeca-nomes] details');
    if (d) d.open = true;
  });
  await p.waitForTimeout(150);
  const comAGavetaAberta = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.__ctx.close();
  const semGuiao = await pagina('/', 390, { guiao: false });
  const sem = await semGuiao.evaluate(() => document.documentElement.scrollHeight);
  await semGuiao.__ctx.close();

  medidas.altura = {
    antes,
    antesDe: ANTES_DO_F11D,
    depois,
    comAGavetaAberta,
    semGuiao: sem,
  };
  conta(
    'U5 · a altura de `/` a 390 depois deste bloco é igual ou menor do que a de partida',
    typeof antes === 'number' && depois <= antes,
    `antes ${antes} px (${ANTES_DO_F11D.ficheiro}, «${ANTES_DO_F11D.chave}», cabeça ${ANTES_DO_F11D.cabeca}) · ` +
      `depois ${depois} px, na mesma largura e no mesmo motor (${antes - depois} px a menos) · ` +
      `na mesma construção, a gaveta dos nomes aberta dá ${comAGavetaAberta} px e sem guião ${sem} px`,
  );
}

/* ======================================================================= U7 */
/**
 * ---------------------------------------------------------------------------
 * A PÁGINA DE PROVA DO NÍVEL DA UNIDADE, CONSTRUÍDA POR ESTA RÉGUA
 * ---------------------------------------------------------------------------
 * A U7 do brief mede «a página do concelho com o nível da unidade, 0 pontos, o
 * concelho marcado, a porta a abrir o vizinho apontado». A página do concelho é
 * de outro bloco que corre em paralelo (o F1.10, item 8.17), e este bloco NÃO
 * TOCA em `src/views/MunicipioView.astro`: o que ele entrega é o nível como
 * parâmetro do componente, e a troca de uma linha fica escrita no relatório.
 *
 * Uma medida sobre o componente não pode esperar por essa troca, e por isso a
 * régua CONSTRÓI a página de prova: uma página Astro com uma linha, que rende
 * `MapaRespira` com `nivel="unidade"` e `escolhido="evora"`, na mesma postura de
 * localizador em que a página do concelho o rende. É uma construção própria, com
 * a sua configuração, para dentro de `dist/`, e leva menos de dois segundos: o
 * sítio construído não ganha página nenhuma, e o repositório não ganha ficheiro
 * nenhum (tudo o que ela escreve fica em `dist/`, que o `.gitignore` não segue).
 *
 * A FOLHA É A DO SÍTIO, e o nome dela não se escreve aqui: leem-se as folhas que
 * a PÁGINA DO CONCELHO construída declara, que é a superfície que esta célula
 * prova. Sem elas o anel do concelho escolhido não teria espessura para medir, e
 * uma folha escolhida à mão seria a régua a medir outra página.
 */
const PROVA = {
  dir: path.join(DIST, '_prova-nivel-da-unidade'),
  rota: '/_prova-nivel-da-unidade/saida/',
  unidade: 'evora',
  escolhido: 'evora',
};

/** Constrói a página de prova. Devolve a lista dos concelhos da unidade. */
function constroiAProva() {
  const folhas = [
    ...fs
      .readFileSync(path.join(DIST, 'municipios', PROVA.escolhido, 'index.html'), 'utf8')
      .matchAll(/<link rel="stylesheet" href="([^"]+)"/g),
  ].map((m) => m[1]);
  if (folhas.length === 0) {
    throw new Error(`a página de /municipios/${PROVA.escolhido} não declara folha nenhuma`);
  }
  fs.rmSync(PROVA.dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(PROVA.dir, 'pages'), { recursive: true });
  fs.mkdirSync(path.join(PROVA.dir, 'vazio'), { recursive: true });
  fs.writeFileSync(
    path.join(PROVA.dir, 'astro.config.mjs'),
    `import { defineConfig } from 'astro/config';\n` +
      `export default defineConfig({\n` +
      `  root: ${JSON.stringify(RAIZ)},\n` +
      `  srcDir: ${JSON.stringify(PROVA.dir)},\n` +
      `  publicDir: ${JSON.stringify(path.join(PROVA.dir, 'vazio'))},\n` +
      `  outDir: ${JSON.stringify(path.join(PROVA.dir, 'saida'))},\n` +
      `  output: 'static',\n  build: { format: 'directory' },\n  devToolbar: { enabled: false },\n});\n`,
  );
  fs.writeFileSync(
    path.join(PROVA.dir, 'pages', 'index.astro'),
    `---\n` +
      `import MapaRespira from ${JSON.stringify(path.join(RAIZ, 'src/components/inicio/MapaRespira.astro'))};\n` +
      `import { t } from ${JSON.stringify(path.join(RAIZ, 'src/i18n/strings.mjs'))};\n` +
      `import { concelhos } from ${JSON.stringify(path.join(RAIZ, 'src/lib/inicio.mjs'))};\n` +
      `const s = t('pt');\n---\n` +
      `<html lang="pt"><head><meta charset="utf-8" /><title>prova do nível da unidade</title>\n` +
      folhas.map((f) => `<link rel="stylesheet" href="${f}" />`).join('\n') +
      `\n</head><body>\n` +
      `<MapaRespira s={s} lang="pt" concelhos={concelhos()} postura="localizador" ` +
      `nivel="unidade" escolhido="${PROVA.escolhido}" />\n` +
      `</body></html>\n`,
  );
  const saida = spawnSync(
    'npx',
    ['astro', 'build', '--config', path.relative(RAIZ, path.join(PROVA.dir, 'astro.config.mjs'))],
    { cwd: RAIZ, encoding: 'utf8' },
  );
  if (saida.status !== 0) {
    throw new Error(`a página de prova não construiu:\n${saida.stdout ?? ''}${saida.stderr ?? ''}`);
  }
  return concelhosDe(PROVA.unidade);
}

/* A PÁGINA DE PROVA NÃO FICA EM `dist/`. É uma página construída dentro da pasta
   que os portões varrem, e uma página a mais ali seria uma página do sítio para
   `gate:html`, para `check:voz` e para o feixe do desenho. Apaga-se no fim da
   corrida, nos dois caminhos (as células e as plantas). */
function limpaAProva() {
  fs.rmSync(PROVA.dir, { recursive: true, force: true });
}

async function u7() {
  let daUnidade;
  try {
    daUnidade = constroiAProva();
  } catch (erro) {
    conta('U7 · a página de prova com o nível da unidade', false, String(erro.message ?? erro));
    return;
  }
  const p = await pagina(PROVA.rota, 390, { toque: true });
  const r = await p.evaluate(() => {
    const svg = document.querySelector('[data-mapa-concelhos]');
    const areas = [...(svg?.querySelectorAll('[data-concelho-porta]') ?? [])];
    const anel = svg?.querySelector('.uni-escolhida');
    return {
      svg: !!svg,
      areas: areas.length,
      destinos: areas.map((a) => a.getAttribute('href')),
      nivel: document.querySelector('[data-mapa-raiz]')?.getAttribute('data-nivel') ?? null,
      pontos: document.querySelectorAll('.mapa-pontos .mun').length,
      anelDe: anel?.getAttribute('data-unidade') ?? null,
      tracoDoAnel: anel ? Number.parseFloat(getComputedStyle(anel).strokeWidth) : null,
      tracoDosOutros: Math.max(
        ...[...(svg?.querySelectorAll('.uni:not(.uni-escolhida)') ?? [])].map((el) =>
          Number.parseFloat(getComputedStyle(el).strokeWidth),
        ),
      ),
      lugar: !!document.querySelector('[data-mapa-nome]'),
      voltar: document.querySelectorAll('[data-mapa-voltar]').length,
      /* O rótulo do desenho é o do nível da unidade, e não o do país. */
      rotulo: svg?.getAttribute('aria-label') ?? null,
    };
  });

  /* A PORTA ABRE O VIZINHO APONTADO: aponta-se um concelho que NÃO é o da
     página, lê-se o nome no lugar e segue-se a porta. É o gesto que a página do
     concelho ganha com o nível da unidade: sair para o vizinho sem voltar ao
     país. */
  const vizinho = daUnidade.find((c) => c.slug !== PROVA.escolhido);
  await p.locator('[data-mapa-concelhos]').scrollIntoViewIfNeeded();
  const onde = await p.evaluate((pt) => {
    const svg = document.querySelector('[data-mapa-concelhos]');
    const q = new DOMPoint(pt[0], pt[1]).matrixTransform(svg.getScreenCTM());
    return { x: q.x, y: q.y };
  }, vizinho.ponto);
  await p.touchscreen.tap(onde.x, onde.y);
  await p.waitForTimeout(200);
  const apontado = await p.evaluate(() => ({
    nome: document.querySelector('[data-mapa-nome-texto]')?.textContent.trim() ?? null,
    porta: document.querySelector('[data-mapa-porta]')?.getAttribute('href') ?? null,
  }));
  const viagem = p.waitForURL(`**/municipios/${vizinho.slug}`, { timeout: 5000 }).catch(() => null);
  if (apontado.porta) await p.click('[data-mapa-porta]');
  await viagem;
  const chegou = await p.evaluate(() => location.pathname);
  await p.__ctx.close();

  medidas.nivelDaUnidade = { ...r, apontado, chegou, vizinho: vizinho.slug };
  conta(
    'U7 · o nível da unidade rendido pelo servidor: os concelhos da unidade, 0 pontos, o concelho da página com o anel, e a porta a abrir o vizinho apontado',
    r.svg &&
      r.nivel === 'unidade' &&
      r.areas === daUnidade.length &&
      r.destinos.every((d, i) => d === `/municipios/${daUnidade[i].slug}`) &&
      r.pontos === 0 &&
      r.anelDe === PROVA.escolhido &&
      r.tracoDoAnel > r.tracoDosOutros &&
      r.lugar &&
      r.voltar === 0 &&
      apontado.nome === vizinho.nome &&
      apontado.porta === `/municipios/${vizinho.slug}` &&
      chegou === `/municipios/${vizinho.slug}`,
    `nível «${r.nivel}» · ${r.areas} áreas para os ${daUnidade.length} concelhos de ${PROVA.unidade} · ` +
      `${r.pontos} pontos · anel em «${r.anelDe}» com traço ${r.tracoDoAnel} contra ${r.tracoDosOutros} nos outros · ` +
      `${r.voltar} porta(s) de voltar (um nível só não sobe) · rótulo «${r.rotulo}» · ` +
      `ao apontar o vizinho o lugar diz «${apontado.nome}» (esperado «${vizinho.nome}») com a porta «${apontado.porta}», e ela leva a «${chegou}»`,
  );
}

/* ======================================================================= U8 */
/* AS CÉLULAS DO CONTRASTE E DA REGIÃO VIVA SÃO AS P7 DO F1.1d, HERDADAS.
 *
 * A U8 do brief é «as réguas de `tests/inicio` verdes ou reescritas com a razão;
 * os três portões a 0; as cadeias no inventário com origem»: as duas últimas são
 * comandos e não células, e a primeira é esta régua e as outras três. As três
 * células abaixo mediam o lugar do nome no F1.1d (P7a, P7b e P7c) e ficam, com o
 * nome mudado, porque o lugar do nome não mudou neste bloco: uma célula verde que
 * continua a valer não se deita fora por causa de uma renumeração. */
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
    ['aviso', '[data-mapa-aviso]'],
  ]) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const cor = rgb(getComputedStyle(el).color);
    fora[chave] = Math.round(razao(cor, fundoDe(el)) * 100) / 100;
  }
  return fora;
};

async function u8() {
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
    const centro = uni('evora');
    const ondeCentro = await noEcra(p, centro.ponto);
    await p.mouse.move(ondeCentro.x, ondeCentro.y);
    await p.waitForTimeout(50);
    const r = await p.evaluate(CONTRASTE);
    medidas.contraste[tema] = r;
    const piores = Object.entries(r).sort((a, b) => a[1] - b[1]);
    conta(
      `U8a · herdada do F1.1d (P7a) · o lugar do nome com contraste de 4,5:1 no tema ${tema === 'light' ? 'claro' : 'escuro'}`,
      piores.length === 4 && piores[0][1] >= 4.5,
      piores.map(([k, v]) => `${k} ${v.toFixed(2)}:1`).join(' · '),
    );
    await p.__ctx.close();
  }

  const p = await pagina('/', 1280);
  const antes = await p.locator('[data-mapa-nome]').ariaSnapshot();
  const doNorte = uni('evora');
  const onde = await noEcra(p, doNorte.ponto);
  await p.mouse.move(onde.x, onde.y);
  await p.waitForTimeout(120);
  const depois = await p.locator('[data-mapa-nome]').ariaSnapshot();
  /* O QUE ESTA CÉLULA MEDE É A ÁRVORE DE ACESSIBILIDADE, E NÃO UM ANÚNCIO.
     `ariaSnapshot()` dá o que a árvore de acessibilidade da página tem naquele
     lugar; que um leitor de ecrã leia a mudança em voz alta é o que o
     `aria-live` da P7c pede ao navegador, e não é coisa que esta régua oiça.
     Dizer «anunciado» seria afirmar o que não se mediu (leitura a frio do Codex
     de 08.09.2026, achado 12). */
  conta(
    'U8b · herdada do F1.1d (P7b) · o lugar do nome é uma região com nome acessível, e a árvore de acessibilidade dele muda com a área apontada',
    /group/.test(antes) && !new RegExp(doNorte.nome).test(antes) && new RegExp(doNorte.nome).test(depois),
    `em repouso: ${antes.replace(/\s+/g, ' ').slice(0, 90)} · ao apontar: ${depois.replace(/\s+/g, ' ').slice(0, 90)}`,
  );
  const vivo = await p.evaluate(
    () => document.querySelector('[data-mapa-frase]').getAttribute('aria-live'),
  );
  conta(
    'U8c · herdada do F1.1d (P7c) · a frase do lugar declara `aria-live="polite"`, que é o atributo por onde um leitor de ecrã sabe que há ali algo a reler',
    vivo === 'polite',
    `aria-live="${vivo}" · o atributo mede-se; o anúncio em voz alta é do navegador e do leitor de ecrã, e não desta régua`,
  );
  await p.__ctx.close();
}

/* --------------------------------------------------------------- a corrida */
async function corre(quais) {
  celulas = [];
  medidas = {};
  const todas = { U1: u1, U2: u2, U3: u3, U4: u4, U5: u5, U7: u7, U8: u8 };
  for (const nome of quais) await todas[nome]();
}

/* ---------------------------------------------------------------------------
 * AS PLANTAS (U9)
 * ------------------------------------------------------------------------- */
const PLANTAS = [
  {
    /* O NOME DE UMA ÁREA É O `<title>` DA SUA LIGAÇÃO, que é o nome acessível
       dela e o que o guião copia para o lugar do nome. A primeira forma desta
       planta (F1.1d) apagava o `data-u` do caminho, e deixou de morder quando o
       guião passou a ler o `<title>`: uma planta que não morde é uma régua que se
       diz verde sem ter olhado. */
    nome: 'uma unidade sem nome no lugar (o `<title>` de Évora apagado)',
    celulas: ['U2a'],
    quais: ['U2'],
    estrago: (texto, rota, ext) =>
      ext === '.html'
        ? texto.replace(/(<a[^>]*data-uni-porta="evora"[^>]*>)<title>[^<]*<\/title>/, '$1')
        : texto,
  },
  {
    /* UM CONCELHO NA UNIDADE ERRADA (a planta que o brief nomeia). O ficheiro
       servido de Évora perde um concelho e o de Beja ganha-o: os dois desenham,
       mas o concelho mudado vem com o ponto e o caminho da grelha de Évora, e na
       grelha de Beja o seu ponto representativo cai fora do próprio desenho. É
       isso que a U1b apanha, e é a mesma coisa que a R8 do portão do mapa apanha
       nos bytes. */
    nome: 'um concelho na unidade errada (mudado do ficheiro de Évora para o de Beja)',
    celulas: ['U1b'],
    quais: ['U1'],
    estrago: (texto, rota, ext) => {
      if (ext !== '.json') return texto;
      if (rota.endsWith('/unidade-evora.json')) {
        const d = JSON.parse(texto);
        d.concelhos = d.concelhos.filter((c) => c.slug !== 'arraiolos');
        return JSON.stringify(d);
      }
      if (rota.endsWith('/unidade-beja.json')) {
        const d = JSON.parse(texto);
        const evora = JSON.parse(
          fs.readFileSync(path.join(DIST, ficheiroDaUnidade('evora')), 'utf8'),
        );
        d.concelhos = [...d.concelhos, evora.concelhos.find((c) => c.slug === 'arraiolos')];
        return JSON.stringify(d);
      }
      return texto;
    },
  },
  {
    /* A PLANTA TIRA A REGRA DO TOQUE NUM CONCELHO, E MAIS NADA. A primeira forma
       apagava TODOS os `preventDefault` do guião, e com ela o primeiro toque na
       UNIDADE já navegava: a célula ficava vermelha antes de chegar ao concelho,
       e o defeito que ela diz medir nunca chegava a ser medido (leitura a frio do
       Codex de 08.09.2026, achado 10). Agora tira uma linha só, a do concelho. */
    nome: 'o primeiro toque num concelho a navegar (o guião deixa de segurar esse clique)',
    celulas: ['U3a · Chromium', 'U3a · WebKit'],
    quais: ['U3'],
    estrago: (texto, rota, ext) =>
      ext === '.js' && rota.endsWith('/mapa-unidades.js')
        ? texto.replace(
            'if (!doTeclado && toque && concelho !== tocada) {\n      ev.preventDefault();',
            'if (!doTeclado && toque && concelho !== tocada) {\n      ;',
          )
        : texto,
  },
  {
    /* UM PEDIDO FALHADO A DEIXAR A LIGAÇÃO MORTA: a marca da unidade que falhou
       deixa de se pôr, e o clique seguinte volta a ser segurado para sempre. */
    nome: 'a unidade cujo ficheiro não veio a ficar sem destino (o guião sem a saída da falha)',
    celulas: ['U3e'],
    quais: ['U3'],
    estrago: (texto, rota, ext) =>
      ext === '.js' && rota.endsWith('/mapa-unidades.js')
        ? texto.replace('falhadas[slug] = true;', ';')
        : texto,
  },
  {
    /* O CONCELHO QUE SAI É O PRIMEIRO DA LISTA, e não o último: a amostra da U2b
       toma os concelhos por posição, e tirar o último deixava-a a apontar aos
       mesmos e a passar, com a planta a declarar que a mordia. A unidade é a
       maior das três da amostra, para que a U2b a visite. */
    nome: 'um concelho a menos no ficheiro da geometria de uma unidade',
    celulas: ['U1b', 'U2b'],
    quais: ['U1', 'U2'],
    estrago: (texto, rota, ext) => {
      if (ext !== '.json' || !rota.endsWith(`/unidade-${AS_TRES_MAIORES[0]}.json`)) return texto;
      const dados = JSON.parse(texto);
      dados.concelhos = dados.concelhos.slice(1);
      return JSON.stringify(dados);
    },
  },
  {
    /* AS DUAS EDIÇÕES, e não só a portuguesa: a U2c corre nas duas e a planta só
       mexia em `/distritos/`, de maneira que a célula inglesa passava. */
    nome: 'o lugar do nome retirado da página de um distrito',
    celulas: ['U2c', 'U3d'],
    quais: ['U2', 'U3'],
    estrago: (texto, rota, ext) =>
      ext === '.html' && (rota.indexOf('/distritos/') === 0 || rota.indexOf('/en/districts/') === 0)
        ? texto.replace(/<div class="mapa-nome"[\s\S]*?<\/div><figcaption/, '<figcaption')
        : texto,
  },
  {
    nome: 'a lista fechada dos nomes aberta por defeito',
    celulas: ['U4'],
    quais: ['U4'],
    estrago: (texto, rota, ext) =>
      ext === '.html'
        ? texto.replace(
            '<details class="gaveta" data-gaveta="nomes">',
            '<details class="gaveta" data-gaveta="nomes" open>',
          )
        : texto,
  },
  {
    nome: 'uma área do nível do país sem ligação, sem guião',
    celulas: ['U4'],
    quais: ['U4'],
    estrago: (texto, rota, ext) =>
      ext === '.html'
        ? texto.replace(
            /href="\/(en\/districts|distritos)\/ilha-da-madeira"/,
            'data-sem-destino="ilha-da-madeira"',
          )
        : texto,
  },
  {
    /* UMA REGIÃO A VOLTAR AO DESENHO (a planta que o brief nomeia). Uma das 29
       áreas passa a apontar para a página de uma região NUTS II, que é a forma
       silenciosa de o desenho do F1.1d voltar. A U4 conta as ligações que não
       estão em `/distritos/` e as que apontam para `/regioes/`. */
    nome: 'uma região a voltar ao desenho (uma área a apontar para /regioes/)',
    celulas: ['U4'],
    quais: ['U4'],
    estrago: (texto, rota, ext) =>
      ext === '.html'
        ? texto
            .replace('href="/distritos/beja"', 'href="/regioes/alentejo"')
            .replace('href="/en/districts/beja"', 'href="/en/regions/alentejo"')
        : texto,
  },
  {
    /* O CONCELHO DA PÁGINA SEM O ANEL: a marca do lugar onde se está desaparece,
       e o mapa da página do concelho passa a ser um mapa da unidade sem dizer
       qual é o concelho. */
    nome: 'o concelho da página sem o anel, no nível da unidade',
    celulas: ['U7'],
    quais: ['U7'],
    estrago: (texto, rota, ext) =>
      ext === '.html' && rota.indexOf('/_prova-nivel-da-unidade/') === 0
        ? texto.replace('uni uni-escolhida', 'uni')
        : texto,
  },
];

if (VERMELHOS) {
  console.log('');
  let falhou = false;
  for (const planta of PLANTAS) {
    ESTRAGO = planta.estrago;
    await corre(planta.quais);
    ESTRAGO = null;
    /* TODAS AS CÉLULAS QUE A PLANTA NOMEIA TÊM DE FICAR VERMELHAS, e não uma
       delas. Com `some`, uma planta que dissesse morder nas duas edições ou nos
       dois motores era aceite quando só um lado caía, e a régua declarava
       provada uma cobertura que não tinha (leitura a frio do Codex de
       08.09.2026, achado 10). Uma planta que nomeia uma célula que não morde
       corrige-se na planta: ou o estrago passa a morder, ou a lista das células
       passa a dizer a verdade. */
    const tocadas = celulas.filter((c) => planta.celulas.some((k) => c.nome.startsWith(k)));
    const semNenhuma = tocadas.length === 0;
    const apanhou = !semNenhuma && tocadas.every((c) => !c.passa);
    if (!apanhou) falhou = true;
    console.log(`  ${apanhou ? verde('vermelho ✓') : vermelho('NÃO APANHOU ✗')}  ${planta.nome}`);
    if (semNenhuma) console.log(vermelho(`              nenhuma célula com os nomes ${planta.celulas.join(', ')}`));
    for (const c of tocadas) console.log(cinza(`              ${c.passa ? 'PASSA (e devia falhar)' : 'falha ✓'} ${c.nome}`));
  }
  console.log('');
  limpaAProva();
  await nav.close();
  await navWebkit.close();
  servidor.close();
  process.exit(falhou ? 1 : 0);
}

await corre(['U1', 'U2', 'U3', 'U4', 'U5', 'U7', 'U8']);
limpaAProva();
await nav.close();
await navWebkit.close();
servidor.close();

if (FICHEIRO_JSON) fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ celulas, medidas }, null, 2));

console.log('');
console.log(cinza(`  F1.1e · os distritos e as ilhas voltam ao mapa · ${celulas.length} células`));
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
