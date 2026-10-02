/** P4 (02.10.2026): a fila da marca, medida. Diz, a 320, 390 e 1 280 px, na primeira página e em «Lugares», nas duas
 * edições, a largura da marca, a do comando do tema e a da coluna, e se o comando fica na linha da marca ou desce
 * para a linha seguinte. Corre sobre `dist/`.
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/p4-2026-10-02/fila-da-marca.mjs
 * Sai 0 depois de medir; 1 se não conseguir. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const DIST = path.resolve('dist');
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  let f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { 'content-type': tipos[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
});
await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${srv.address().port}`;
const nav = await chromium.launch();
for (const rota of ['/', '/en/', '/lugares/', '/en/places/']) for (const largura of [320, 390, 1280]) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const m = await p.evaluate(() => {
    const fila = document.querySelector('.masthead-marca').getBoundingClientRect();
    const marca = document.querySelector('.masthead-marca .wordmark').getBoundingClientRect();
    const tema = document.querySelector('.masthead-marca [data-tema-controlo]').getBoundingClientRect();
    const botoes = [...document.querySelectorAll('.masthead-marca .tema-b')].map((b) => { const r = b.getBoundingClientRect(); return `${r.width.toFixed(1)}×${r.height.toFixed(1)}`; });
    return { coluna: +fila.width.toFixed(1), marca: +marca.width.toFixed(1), tema: +tema.width.toFixed(1), mesmaLinha: tema.top < marca.bottom - 1, botoes };
  });
  console.log(`${rota} ${largura}: coluna ${m.coluna} · marca ${m.marca} · comando ${m.tema} (botões ${m.botoes.join(', ')}) · ${m.mesmaLinha ? 'na linha da marca' : 'desce para a linha seguinte'}`);
  await ctx.close();
}
await nav.close();
srv.close();
