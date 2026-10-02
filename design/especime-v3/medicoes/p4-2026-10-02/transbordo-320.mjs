/** P4 (02.10.2026): o achado da largura 320 da matriz, medido elemento a elemento. Diz, na primeira página das duas
 * edições a 320 px, quanto o documento transborda e que elementos passam a margem direita da janela, para que o
 * relatório diga o que transborda e se é do cabeçalho (que o P4 mudou) ou do corpo (que o P4 não tocou).
 * Uso, da raiz da worktree, depois de uma construção: node design/especime-v3/medicoes/p4-2026-10-02/transbordo-320.mjs
 * Sai 0 depois de medir (o achado não é um portão); 1 se não conseguir medir. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const DIST = path.resolve('dist');
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  let u = decodeURIComponent(q.url.split('?')[0]);
  let f = path.join(DIST, u);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  else if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  if (!fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { 'content-type': tipos[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
});
await new Promise((ok) => srv.listen(0, ok));
const base = `http://127.0.0.1:${srv.address().port}`;
const nav = await chromium.launch();
for (const rota of ['/', '/en/']) {
  const ctx = await nav.newContext({ viewport: { width: 320, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const d = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const fora = [...document.body.querySelectorAll('*')]
      .filter((e) => e.getClientRects().length && e.getBoundingClientRect().right > document.documentElement.clientWidth + 0.5)
      .map((e) => {
        const b = e.getBoundingClientRect();
        return `${e.tagName.toLowerCase()}.${[...e.classList].join('.')}${e.closest('header') ? ' (no cabeçalho)' : ''} right=${b.right.toFixed(1)} «${(e.textContent || '').trim().slice(0, 40)}»`;
      });
    return { d, fora: fora.slice(0, 8), n: fora.length };
  });
  console.log(rota, 'transbordo', r.d, 'elementos para lá da janela', r.n);
  for (const f of r.fora) console.log('   ', f);
  await ctx.close();
}
await nav.close();
srv.close();
