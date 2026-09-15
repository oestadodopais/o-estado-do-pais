#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * A ALTURA DA PRIMEIRA PÁGINA A 390, BLOCO A BLOCO (F1.13, 15.09.2026)
 * ---------------------------------------------------------------------------
 * A página cresceu 34 px a 390 e o relatório tinha de dizer porquê, bloco a
 * bloco, em vez de o atribuir de cabeça. Este guião mede, nas duas construções,
 * a altura da gaveta dos nomes, a do bloco da busca (com o número de linhas do
 * seu rótulo) e a da secção dos domínios, e diz de cada uma o que ela OCUPA na
 * coluna: zero quando está fora da composição, que é o que `position: absolute`
 * faz.
 *
 *   node .../blocos-a-390.mjs <dist-antes> <dist-depois>
 *
 * Não interpreta: mede. Chromium sem cabeça, 390 × 664, depois de
 * `document.fonts.ready`. A conta que fecha a soma está no relatório, com o
 * `gap` da coluna medido em `getComputedStyle`.
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

async function mede(dist, rota) {
  const servidor = http.createServer((req, res) => {
    const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = path.join(dist, u);
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
  const ctx = await nav.newContext({ viewport: { width: 390, height: 664 } });
  const p = await ctx.newPage();
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const caixa = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        largura: +b.width.toFixed(1),
        altura: +b.height.toFixed(1),
        forma: cs.position,
        /* A altura que o bloco OCUPA na coluna: zero quando está fora da
           composição, que é o que `position: absolute` faz. */
        ocupa: cs.position === 'absolute' ? 0 : +b.height.toFixed(1),
      };
    };
    const rotulo = document.querySelector('.pesquisa-bloco .busca-k');
    return {
      pagina: document.documentElement.scrollHeight,
      gaveta: caixa('[data-cabeca-nomes]'),
      busca: caixa('.pesquisa-bloco'),
      rotuloDaBusca: rotulo
        ? {
            altura: +rotulo.getBoundingClientRect().height.toFixed(1),
            linhas: rotulo.getClientRects().length,
            texto: (rotulo.textContent ?? '').trim(),
          }
        : null,
      dominios: caixa('.dominios-secao'),
    };
  });
  await ctx.close();
  await nav.close();
  servidor.close();
  return r;
}

const [antes, depois] = process.argv.slice(2);
for (const rota of ['/', '/en']) {
  const a = await mede(antes, rota);
  const d = await mede(depois, rota);
  console.log(`\n=== ${rota} a 390 px ===`);
  console.log('página     ', a.pagina, '→', d.pagina, `(${d.pagina - a.pagina >= 0 ? '+' : ''}${d.pagina - a.pagina})`);
  for (const k of ['gaveta', 'busca', 'dominios']) {
    const va = a[k];
    const vd = d[k];
    console.log(
      `${k.padEnd(11)}`,
      va ? `${va.altura} px (${va.forma}, ocupa ${va.ocupa})` : '(não existe)',
      '→',
      vd ? `${vd.altura} px (${vd.forma}, ocupa ${vd.ocupa})` : '(não existe)',
      va && vd ? `(ocupa ${vd.ocupa - va.ocupa >= 0 ? '+' : ''}${(vd.ocupa - va.ocupa).toFixed(1)})` : '',
    );
  }
  console.log(
    'rótulo     ',
    a.rotuloDaBusca ? `${a.rotuloDaBusca.altura} px, «${a.rotuloDaBusca.texto}»` : '(sem)',
    '→',
    d.rotuloDaBusca ? `${d.rotuloDaBusca.altura} px, «${d.rotuloDaBusca.texto}»` : '(sem)',
  );
}
