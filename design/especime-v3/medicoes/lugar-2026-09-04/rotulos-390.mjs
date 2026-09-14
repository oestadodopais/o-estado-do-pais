#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * OS RÓTULOS DOS DESENHOS DO CONCELHO, MEDIDOS A 390 E A 1 280
 * ---------------------------------------------------------------------------
 * §7.10 do brief F1.10 («os rótulos dos gráficos a 390 escrevem-se como texto
 * por baixo»), 14.09.2026. A régua mede o ANTES e o DEPOIS com a mesma conta,
 * na página de um concelho, nas duas larguras e nas duas edições:
 *
 *   · a altura de letra com que cada rótulo DESENHADO chega ao leitor, que é o
 *     `font-size` do elemento vezes a escala do desenho (a largura em píxeis do
 *     `<svg>` a dividir pela largura do `viewBox`). Um rótulo de 10 px dentro de
 *     um desenho de 720 unidades numa coluna de 358 px não chega a 10 px: chega
 *     a 5;
 *   · quantos rótulos desenhados e quantos valores de legenda estão À VISTA em
 *     cada largura, lidos por `getComputedStyle`, que é o que a folha decide.
 *
 * Abre navegador, e por isso não está no `verify` nem na CI.
 *
 *   node design/especime-v3/medicoes/lugar-2026-09-04/rotulos-390.mjs
 *   OEDP_DIST=/outra/dist node …/rotulos-390.mjs
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };

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

const PAGINAS = [
  { chave: 'pt', rota: '/municipios/evora' },
  { chave: 'en', rota: '/en/municipalities/evora' },
];
const LARGURAS = [390, 1280];

const nav = await chromium.launch({ headless: true });
const saida = {};
for (const pag of PAGINAS) {
  for (const largura of LARGURAS) {
    const ctx = await nav.newContext({ viewport: { width: largura, height: 664 } });
    const p = await ctx.newPage();
    await p.goto(base + pag.rota, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(() => {
      const visivel = (el) => {
        const e = getComputedStyle(el);
        if (e.display === 'none' || e.visibility === 'hidden') return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const escalaDe = (el) => {
        const svg = el.closest('svg');
        if (!svg) return 1;
        const vb = svg.getAttribute('viewBox');
        if (!vb) return 1;
        const w = Number(vb.trim().split(/\s+/)[2]);
        const caixa = svg.getBoundingClientRect();
        return w ? caixa.width / w : 1;
      };
      const rotulos = [...document.querySelectorAll('.mun-barra-rot, .mun-tecto-rot, .mun-serie-val')];
      const legenda = [...document.querySelectorAll('.mun-legenda-val')];
      const letraDe = (el) => Number(getComputedStyle(el).fontSize.replace('px', '')) * escalaDe(el);
      return {
        desenhados: rotulos.length,
        desenhadosAVista: rotulos.filter(visivel).length,
        letraDesenhada: rotulos.map((el) => Number(letraDe(el).toFixed(2))),
        legenda: legenda.length,
        legendaAVista: legenda.filter(visivel).length,
        letraDaLegenda: legenda
          .filter(visivel)
          .map((el) => Number(getComputedStyle(el).fontSize.replace('px', ''))),
        textoDaLegenda: legenda.filter(visivel).map((el) => el.textContent.trim()),
      };
    });
    saida[`${pag.chave}.${largura}`] = m;
    await ctx.close();
  }
}
await nav.close();
servidor.close();

for (const [k, v] of Object.entries(saida)) {
  console.log(`${k}`);
  console.log(`  rótulos desenhados: ${v.desenhados}, à vista ${v.desenhadosAVista}` +
    (v.letraDesenhada.length ? ` · altura de letra com que chegam ao leitor: ${[...new Set(v.letraDesenhada)].join(' · ')} px` : ''));
  console.log(`  valores na legenda: ${v.legenda}, à vista ${v.legendaAVista}` +
    (v.letraDaLegenda.length ? ` · ${[...new Set(v.letraDaLegenda)].join(' · ')} px` : '') +
    (v.textoDaLegenda.length ? ` · «${v.textoDaLegenda.join('» «')}»` : ''));
}
console.log(JSON.stringify(saida));
