#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * A COLUNA DO VALOR DE UMA MEDIDA, ANTES E DEPOIS (achado 10 da leitura a frio
 * do Codex ao F1.13, 15.09.2026)
 * ---------------------------------------------------------------------------
 * A regra de `.livro-item` estava escrita nas duas folhas, com a mesma
 * especificidade e com `grid-template-columns` diferente, e quem decidia era a
 * ORDEM por que o empacotador as punha na página. Essa ordem é emergente do grafo
 * de módulos: o F1.13 mudou-a sem querer nas páginas de área, e a leitura a frio
 * apanhou-o. A decisão do lugar de direção é manter o estado novo e escrevê-lo
 * uma vez só, no sítio que serve a família que tem o elemento.
 *
 * ESTE GUIÃO É A PROVA DA MUDANÇA, e não uma descrição dela: mede a largura da
 * coluna do valor a 1 280 nas nove páginas de área e no índice dos números e
 * fontes, nas duas edições, em duas construções, e imprime também as colunas
 * calculadas e a ordem das folhas que cada página carrega.
 *
 *   node .../coluna-do-valor.mjs <dist-antes> <dist-depois>
 *
 * Não interpreta: mede. Chromium sem cabeça, 1 280 px, depois de
 * `document.fonts.ready`.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

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
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};

/** As nove áreas de governo, e o índice dos números e fontes ao lado delas. */
const AREAS = [
  'administracao-interna',
  'ambiente-e-energia',
  'economia-e-coesao-territorial',
  'educacao-ciencia-e-inovacao',
  'financas',
  'infraestruturas-e-habitacao',
  'justica',
  'saude',
  'trabalho-solidariedade-e-seguranca-social',
];
const ROTAS = [];
for (const a of AREAS) {
  ROTAS.push(['pt', `/areas/${a}`]);
  ROTAS.push(['en', `/en/areas/${a}`]);
}
ROTAS.push(['pt', '/livro-razao']);
ROTAS.push(['en', '/en/ledger']);

async function mede(DIST) {
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
  const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const out = {};
  for (const [ed, rota] of ROTAS) {
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    out[`${ed} ${rota}`] = await p.evaluate(() => {
      const valor = document.querySelector('.livro-item-valor');
      const item = document.querySelector('.livro-item');
      const cs = item ? getComputedStyle(item) : null;
      const folhas = [...document.querySelectorAll('link[rel=stylesheet]')].map((l) =>
        (l.getAttribute('href') ?? '').replace(/^\/_astro\//, '').replace(/\.[A-Za-z0-9_-]+\.css$/, ''),
      );
      return valor
        ? {
            largura: +valor.getBoundingClientRect().width.toFixed(1),
            colunas: cs ? cs.gridTemplateColumns : null,
            folhas: folhas.join('→'),
          }
        : null;
    });
  }
  await ctx.close();
  await nav.close();
  servidor.close();
  return out;
}

const [antes, depois] = process.argv.slice(2);
if (!antes || !depois) {
  console.error('uso: node coluna-do-valor.mjs <dist-antes> <dist-depois>');
  process.exit(2);
}
const a = await mede(antes);
const d = await mede(depois);
console.log('a coluna do valor de uma medida, a 1 280 px · antes → depois');
console.log(`  antes:  ${antes}`);
console.log(`  depois: ${depois}\n`);
for (const k of Object.keys(a)) {
  const va = a[k];
  const vd = d[k];
  console.log(
    k.padEnd(52),
    va ? `${va.largura} px [${va.colunas}] ${va.folhas}` : '(sem .livro-item)',
    '→',
    vd ? `${vd.largura} px [${vd.colunas}] ${vd.folhas}` : '(sem .livro-item)',
  );
}
