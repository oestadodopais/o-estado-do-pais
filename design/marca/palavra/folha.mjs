import { chromium } from 'playwright';
import fs from 'node:fs';
const REPO = '/Users/nunosantos/Instruments/OEstadoDoPais';
const out = process.argv[2];
const font = "data:font/woff2;base64," + fs.readFileSync(`${REPO}/public/tipos/spectral/Spectral-Regular.woff2`).toString("base64");
const k180 = 'data:image/png;base64,' + fs.readFileSync(`${REPO}/public/apple-touch-icon.png`).toString('base64');
const kfav = fs.readFileSync(`${REPO}/public/favicon.svg`, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
const INK = '#17191B', PAPER = '#F6F7F4', PAPER_D = '#ECEEEA';
// an icon cell: word fitted to 78 % of the side, Spectral 400, letter-spacing -0.014em as the masthead
const cel = (px, palavra, campo, tinta, r) => `<div class="cel" style="width:${px}px;height:${px}px;background:${campo};color:${tinta};border-radius:${r ?? Math.round(px * 0.2237)}px" data-px="${px}" data-palavra="${palavra}"><span class="p">${palavra}</span></div>`;
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Spectral;src:url(${font}) format('woff2');font-weight:400}
body{margin:0;background:#fff;font-family:Spectral,serif;color:${INK};width:1360px}
h1{font:400 20px/1.2 Spectral;margin:24px 28px 4px}
p.n{font:400 13px/1.4 Spectral;margin:0 28px 14px;color:#666}
.fila{display:flex;align-items:flex-end;gap:28px;margin:0 28px 22px}
.cel{position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}
.cel .p{font-family:Spectral;font-weight:400;letter-spacing:-0.014em;line-height:1;white-space:nowrap}
.leg{font:400 12px/1.3 Spectral;color:#666;width:180px}
.k{flex:none}
.home{display:flex;gap:30px;padding:26px;background:#2b2f36;border-radius:18px;margin:0 28px 22px;width:max-content}
.home .app{display:flex;flex-direction:column;align-items:center;gap:6px;width:76px}
.home .app .cel{border-radius:13.4px}
.home .app span.rot{font:400 11px/1.2 -apple-system,Helvetica,sans-serif;color:#fff}
.fav{display:flex;gap:18px;align-items:center;margin:0 28px 22px}
.tab{display:flex;align-items:center;gap:8px;background:#35363a;color:#e8eaed;padding:8px 14px;border-radius:8px 8px 0 0;font:400 12px -apple-system,Helvetica,sans-serif}
.tab.l{background:#fff;color:#202124;border:1px solid #dadce0;border-bottom:0}
</style>
<h1>A palavra como ícone, no Spectral 400 da cabeça do sítio (a mesma família, o mesmo peso, o mesmo espaçamento)</h1>
<p class="n">Cada cela ao tamanho real em píxeis do ficheiro: 180 é o ícone do iPhone (60 pontos a 3×), 120 o de 2×, 60 é o que um ecrã a 1× mostra; a palavra ocupa 78 % da largura, que é o mais que um ícone deixa. À esquerda, a marca que está no ar, para comparar.</p>
<div class="fila"><img class="k" src="${k180}" width="180" height="180" style="border-radius:40px">${cel(180,'estado',INK,PAPER_D)}${cel(180,'Estado',INK,PAPER_D)}${cel(180,'estado',PAPER,INK)}${cel(180,'Estado',PAPER,INK)}<div class="leg">180 px · papel sobre tinta, e tinta sobre papel; minúsculas e com versal</div></div>
<div class="fila"><img class="k" src="${k180}" width="120" height="120" style="border-radius:27px">${cel(120,'estado',INK,PAPER_D)}${cel(120,'Estado',INK,PAPER_D)}${cel(120,'estado',PAPER,INK)}${cel(120,'Estado',PAPER,INK)}<div class="leg">120 px</div></div>
<div class="fila"><img class="k" src="${k180}" width="60" height="60" style="border-radius:13px">${cel(60,'estado',INK,PAPER_D)}${cel(60,'Estado',INK,PAPER_D)}${cel(60,'estado',PAPER,INK)}${cel(60,'Estado',PAPER,INK)}<div class="leg">60 px · o ícone visto a 1×</div></div>
<h1>Como fica no ecrã principal (a 3×, como o iPhone rende: esta imagem é 1,5 vezes maior do que no telemóvel a 460 ppp)</h1>
<div class="home" id="home"><div class="app"><img src="${k180}" width="60" height="60" style="border-radius:13.4px"><span class="rot">O Estado</span></div><div class="app">${cel(60,'estado',INK,PAPER_D,13.4)}<span class="rot">O Estado</span></div><div class="app">${cel(60,'Estado',INK,PAPER_D,13.4)}<span class="rot">O Estado</span></div><div class="app">${cel(60,'estado',PAPER,INK,13.4)}<span class="rot">O Estado</span></div><div class="app">${cel(60,'Estado',PAPER,INK,13.4)}<span class="rot">O Estado</span></div></div>
<h1>Na aba (16 px, o favicon)</h1>
<div class="fav"><div class="tab"><span style="width:16px;height:16px;display:inline-block">${kfav.replace('<svg ', '<svg width="16" height="16" ')}</span>O Estado do País</div><div class="tab">${cel(16,'estado',PAPER,INK,3)}O Estado do País</div><div class="tab l">${cel(16,'estado',PAPER_D,INK,3)}O Estado do País</div><div class="tab l">${cel(16,'estado','transparent',INK,0)}O Estado do País</div></div>
<div id="med" style="font:400 13px/1.5 Spectral;margin:0 28px 30px;color:#444"></div>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 1 });
await p.setContent(html, { waitUntil: 'load' });
await p.evaluate(async () => { await document.fonts.load('400 20px Spectral'); await document.fonts.ready; });
const med = await p.evaluate(() => {
  const ok = document.fonts.check('20px Spectral');
  const linhas = [];
  for (const c of document.querySelectorAll('.cel')) {
    const px = +c.dataset.px, span = c.querySelector('.p');
    // fit: largest font-size whose text width <= 78 % of the side
    let lo = 4, hi = px; while (hi - lo > 0.25) { const m = (lo + hi) / 2; span.style.fontSize = m + 'px'; if (span.getBoundingClientRect().width <= px * 0.78) lo = m; else hi = m; }
    span.style.fontSize = lo + 'px';
    // x-height measured on a canvas with the same font
    const cv = document.createElement('canvas'); cv.width = cv.height = Math.ceil(lo * 2); const ctx = cv.getContext('2d');
    ctx.font = `400 ${lo}px Spectral`; ctx.fillStyle = '#000'; ctx.textBaseline = 'alphabetic'; ctx.fillText('x', lo * 0.2, lo * 1.4);
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let top = Infinity, bot = -1;
    for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4 + 3] > 40) { top = Math.min(top, y); bot = Math.max(bot, y); }
    linhas.push(`${px} px · «${c.dataset.palavra}»: corpo ${lo.toFixed(1)} px, altura de x ${(bot - top + 1)} px`);
  }
  const u = [...new Set(linhas)];
  document.getElementById('med').innerHTML = `<b>Medido no render (Spectral carregado: ${ok})</b><br>` + u.join('<br>');
  return { ok, linhas: u };
});
await p.screenshot({ path: `${out}/palavra-icone.png`, fullPage: true });
await p.setViewportSize({ width: 1360, height: 900 });
const home = await p.$('#home'); await p.evaluate(() => { for (const c of document.querySelectorAll('#home .cel .p')) c.style.fontSize = c.style.fontSize; });
const p3 = await b.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 3 });
await p3.setContent(await p.content(), { waitUntil: 'load' }); await p3.evaluate(async () => { await document.fonts.load('400 20px Spectral'); await document.fonts.ready; });
await (await p3.$('#home')).screenshot({ path: `${out}/ecra-principal-3x.png` });
console.log(JSON.stringify(med, null, 1)); await b.close();
