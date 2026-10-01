import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
/** L2b: a sonda do toque das marcas da fonte dos cartões da página de Évora, a 390 e a 768 px: o que
 * `document.elementFromPoint()` devolve 10, 16 e 21 px por baixo do centro de cada marca e 16 px por cima, com a
 * regra `pointer-events: none` do desenho da faixa e, com `--sem-a-regra`, anulada no navegador. Escreve o JSON no
 * caminho que se lhe der por último. Uso, da raiz da worktree, sobre uma construção da cabeça:
 *   node design/especime-v3/medicoes/l2b-2026-10-01/sonda-toque.mjs [--sem-a-regra] <saída.json> */
import { chromium } from 'playwright';
const dist = path.resolve('dist');
const servidor = http.createServer(async (q, r) => {
  try { let f = path.resolve(dist, '.' + decodeURIComponent(new URL(q.url, 'http://x').pathname)); if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    r.setHeader('Content-Type', { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }[path.extname(f)] ?? 'application/octet-stream'); r.end(await fs.readFile(f)); } catch { r.writeHead(404).end(); } });
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const nav = await chromium.launch();
const resultado = {};
for (const largura of [390, 768]) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(origem + '/municipios/evora/', { waitUntil: 'networkidle' });
  if (process.argv.includes('--sem-a-regra')) await p.addStyleTag({ content: '.fc-desenho{pointer-events:auto!important}' });
  const r = await p.evaluate(() => {
    const out = [];
    for (const chip of document.querySelectorAll('[data-cartao-medida] .cartao-medida-valor > .src-chip')) {
      chip.scrollIntoView({ block: 'center' });
      const b = chip.getBoundingClientRect();
      const cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2;
      const quem = (dy) => { const e = document.elementFromPoint(cx, cy + dy); return e ? `${e.tagName.toLowerCase()}.${(e.getAttribute('class') ?? '').split(' ')[0]}` : null; };
      const af = getComputedStyle(chip, '::after');
      out.push({ pe: getComputedStyle(chip.closest('[data-cartao-medida]').querySelector('.fc-desenho') ?? chip).pointerEvents, cartao: chip.closest('[data-cartao-medida]').getAttribute('data-medida-chave'), texto: chip.textContent.trim().slice(0, 20), af: `${af.position} ${af.width}x${af.height} top:${af.top}`, baixo10: quem(10), baixo16: quem(16), baixo21: quem(21), cima16: quem(-16) });
    }
    return out;
  });
  resultado[largura] = r;
  await ctx.close();
}
await nav.close(); servidor.close();
const saida = process.argv[process.argv.length - 1];
await fs.writeFile(saida, JSON.stringify({ regra: process.argv.includes('--sem-a-regra') ? 'anulada' : 'em vigor', larguras: resultado }, null, 2) + '\n');
const todos = Object.values(resultado).flat();
console.log(`${todos.length} marcas; ${todos.filter((x) => x.baixo21 === 'a.src-chip' && x.cima16 === 'a.src-chip').length} respondem a 21 px por baixo e a 16 por cima`);
