#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * O PRIMEIRO ECRÃ DA PÁGINA DE TEXTO, COM A LEITURA DE ABERTURA
 * ---------------------------------------------------------------------------
 * Bloco E1, passagem da abertura (16.09.2026 à noite, `DECISIONS.md` §1.111,
 * norma §4.4). O estudo passou a abrir com a leitura do lugar de direção, e a
 * pergunta que uma captura responde aqui é uma só: **o que é que um leitor vê
 * sem tocar em nada?**
 *
 * É POR ISSO QUE ESTAS CAPTURAS NÃO SÃO DE PÁGINA INTEIRA, ao contrário das do
 * `capturas-e1.mjs`. Uma fotografia da página toda mostra o documento todo e
 * não responde à pergunta; o primeiro ecrã é exactamente a altura da janela, e
 * é o que decide se a abertura é a primeira coisa que se lê.
 *
 * A ALTURA É A DA JANELA DE CADA LARGURA, e as duas são as da casa: 390×664,
 * que é o telemóvel da casa, e 1 280×800, que é o portátil. A altura de 1 280
 * está escrita aqui e não herdada dos outros guiões, que fotografam a página
 * inteira e por isso usam 664 nas duas.
 *
 *   node design/especime-v3/medicoes/e1-2026-09-16/capturas-abertura.mjs
 *
 * Imprime, ao lado de cada captura, os títulos que couberam no primeiro ecrã:
 * uma captura sem essa lista é uma imagem que ninguém pode reconferir sem
 * abrir o ficheiro.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(RAIZ, process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const DESTINO = path.join(RAIZ, 'design', 'especime-v3', 'capturas', 'e1-2026-09-16');

const ROTA = '/estudos/evora-2027-prometido-painel-dinheiro/texto';
/** As duas janelas: o telemóvel da casa e o portátil. */
const JANELAS = [
  { largura: 390, altura: 664 },
  { largura: 1280, altura: 800 },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}
fs.mkdirSync(DESTINO, { recursive: true });

const servidor = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(DIST, u);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('404');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const nav = await chromium.launch({ headless: true });
for (const { largura, altura } of JANELAS) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: altura } });
  const p = await ctx.newPage();
  const r = await p.goto(base + ROTA, { waitUntil: 'networkidle' });
  if (!r || r.status() !== 200) {
    console.error(`${largura}: ${r?.status() ?? 'sem resposta'} em ${ROTA}`);
    await ctx.close();
    process.exitCode = 1;
    continue;
  }
  await p.evaluate(() => document.fonts.ready);
  const visiveis = await p.evaluate((h) => {
    const dentro = (el) => {
      const c = el.getBoundingClientRect();
      return c.top < h && c.bottom > 0;
    };
    return [...document.querySelectorAll('.texto-artigo h1, .texto-artigo h2')]
      .filter(dentro)
      .map((el) => `${el.tagName} ${el.textContent.trim()}`);
  }, altura);
  const ficheiro = path.join(DESTINO, `texto-abertura-pt-${largura}.png`);
  await p.screenshot({ path: ficheiro });
  console.log(`${path.relative(RAIZ, ficheiro)}  ←  ${ROTA}  ${largura}×${altura}`);
  for (const v of visiveis) console.log(`    no primeiro ecrã: ${v}`);
  await ctx.close();
}
await nav.close();
servidor.close();
