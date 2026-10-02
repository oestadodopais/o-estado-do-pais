/** P4 (02.10.2026, item 0 do brief): o menu de seis portas a 390 px, medido em quatro formas, para dizer porque é
 * que a porta da União se chama «Europa» / «Europe» no menu e porque é que a letra do menu desceu a 13 px.
 *
 * Para cada edição da primeira página a 390 px, mede a largura natural da fila das portas (as seis portas e os cinco
 * intervalos, sem dobrar) contra a largura da coluna, em quatro formas: a publicada (o rótulo curto, a letra a 13 px
 * sem espaçamento e 6 px entre portas); o nome inteiro com a letra publicada; o nome inteiro com a letra a 12 px; e o
 * rótulo curto com a letra de antes do P4 (13,5 px, espaçamento de 0,03 em e 12 px entre portas). As formas que não
 * são a publicada põem-se só nesta medição, com uma folha e um texto trocados no navegador. Corre sobre `dist/`.
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/p4-2026-10-02/menu-a-390.mjs
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
const NOME_INTEIRO = { pt: 'União Europeia', en: 'European Union' };
const FORMAS = [
  ['publicada (rótulo curto, 13 px, 6 px)', null, null],
  ['nome inteiro, 13 px, 6 px', 'inteiro', null],
  ['nome inteiro, 12 px, 6 px', 'inteiro', '#nav-principal a{font-size:12px!important}'],
  ['rótulo curto, a letra de antes do P4 (13,5 px, 0,03 em, 12 px)', null, '#nav-principal{gap:0 12px!important}#nav-principal a{font-size:13.5px!important;letter-spacing:.03em!important}'],
];
const nav = await chromium.launch();
for (const [rota, lang] of [['/', 'pt'], ['/en/', 'en']]) for (const [nome, rotulo, folha] of FORMAS) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  if (folha) await p.addStyleTag({ content: folha });
  const m = await p.evaluate(({ rotulo, inteiro }) => {
    const navEl = document.querySelector('#nav-principal');
    const portas = [...navEl.querySelectorAll('a')];
    if (rotulo) portas.find((a) => /uniao-europeia|european-union/.test(a.getAttribute('href'))).textContent = inteiro;
    const coluna = navEl.clientWidth;
    navEl.style.flexWrap = 'nowrap';
    const gap = parseFloat(getComputedStyle(navEl).columnGap) || 0;
    const larguras = portas.map((a) => a.getBoundingClientRect().width);
    const natural = larguras.reduce((s, w) => s + w, 0) + gap * (portas.length - 1);
    navEl.style.flexWrap = '';
    const linhas = new Set(portas.map((a) => Math.round(a.getBoundingClientRect().top))).size;
    return { coluna, natural: +natural.toFixed(1), linhas, rotulos: portas.map((a) => a.textContent.trim()).join(' · '), menor: +Math.min(...larguras).toFixed(1) };
  }, { rotulo, inteiro: NOME_INTEIRO[lang] });
  console.log(`${lang} · ${nome}: ${m.natural} px de portas numa coluna de ${m.coluna} · ${m.linhas} linha(s) · a porta mais estreita ${m.menor} px · ${m.rotulos}`);
  await ctx.close();
}
await nav.close();
srv.close();
