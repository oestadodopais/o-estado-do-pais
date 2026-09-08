#!/usr/bin/env node
/**
 * =============================================================================
 * AS OITO CAPTURAS DO MAPA DO F1.1e, REFEITAS POR UM COMANDO
 * =============================================================================
 *
 *   node design/especime-v3/medicoes/capturas-do-mapa.mjs
 *
 * Escreve `design/especime-v3/capturas/distritos-2026-09-08/*.png`: o nível do
 * país e o nível de uma unidade (Évora), a 390 e a 1280, nas duas edições.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE ESTE FICHEIRO (F1.1e, segunda passagem, 08.09.2026)
 * ---------------------------------------------------------------------------
 * As oito capturas da primeira passagem foram feitas à mão, e o relatório
 * descrevia-as sem dar o comando que as refaz. A leitura a frio do Codex
 * escreveu que nada no pacote reproduzia as capturas (achado 12), e a arrumação
 * das molduras (achado 9) obrigou a refazê-las: uma captura de um desenho que
 * mudou é uma captura a dizer o que já não é.
 *
 * ---------------------------------------------------------------------------
 * O RECORTE É A UNIÃO DA FIGURA COM A TELA, MEDIDA NA PÁGINA
 * ---------------------------------------------------------------------------
 * Abaixo de 640 o mapa toma a largura da JANELA e a figura tem a largura da
 * coluna (I81): a 390 a figura mede 354 px a começar em x=18 e a tela mede 390 a
 * começar em x=0. Uma captura do elemento da figura cortava 18 px do desenho de
 * cada lado. O recorte é por isso a união das duas caixas, lida na página, e a
 * medida de cada captura fica escrita no ficheiro que este guião também grava.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const DIST = path.join(RAIZ, 'dist');
const PASTA = path.join(RAIZ, 'design/especime-v3/capturas/distritos-2026-09-08');
const ARTEFACTO = path.join(RAIZ, 'design/especime-v3/medicoes/capturas-do-mapa.json');

if (!fs.existsSync(DIST)) {
  console.error('\n  não existe dist/. Corra `npm run build` primeiro.\n');
  process.exit(1);
}

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
const servidor = http.createServer((req, res) => {
  const rota = decodeURIComponent(req.url.split('?')[0]);
  let abs = path.join(DIST, rota);
  if (!path.extname(abs)) abs = path.join(abs, 'index.html');
  if (!abs.startsWith(DIST) || !fs.existsSync(abs)) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('404');
    return;
  }
  res.writeHead(200, {
    'content-type': MIME[path.extname(abs)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  res.end(fs.readFileSync(abs));
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const nav = await chromium.launch();
fs.mkdirSync(PASTA, { recursive: true });

const UNIDADE = 'evora';
const feitas = [];

for (const [lang, casa] of [
  ['pt', '/'],
  ['en', '/en'],
]) {
  for (const largura of [390, 1280]) {
    for (const nivel of ['pais', `unidade-${UNIDADE}`]) {
      const ctx = await nav.newContext({
        viewport: { width: largura, height: largura < 640 ? 664 : 900 },
        colorScheme: 'light',
        reducedMotion: 'reduce',
      });
      const p = await ctx.newPage();
      const fragmento = nivel === 'pais' ? '' : `#unidade=${UNIDADE}`;
      await p.goto(`${base}${casa}${fragmento}`, { waitUntil: 'networkidle' });
      if (nivel !== 'pais') {
        await p
          .waitForFunction(
            () => document.querySelector('[data-mapa-raiz]')?.getAttribute('data-nivel') === 'unidade',
            { timeout: 5000 },
          )
          .catch(() => {});
      }
      await p.locator('[data-mapa-raiz]').scrollIntoViewIfNeeded();
      await p.waitForTimeout(200);
      /* A UNIÃO DA FIGURA COM A TELA, na página (achado 8 da primeira passagem). */
      const caixa = await p.evaluate(() => {
        const cx = (sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { x: b.x, y: b.y, x1: b.x + b.width, y1: b.y + b.height };
        };
        const caixas = ['[data-mapa-raiz]', '.mapa-tela'].map(cx).filter(Boolean);
        const x = Math.min(...caixas.map((c) => c.x));
        const y = Math.min(...caixas.map((c) => c.y));
        const x1 = Math.max(...caixas.map((c) => c.x1));
        const y1 = Math.max(...caixas.map((c) => c.y1));
        return { x: Math.round(x), y: Math.round(y), width: Math.round(x1 - x), height: Math.round(y1 - y) };
      });
      const nome = `${nivel === 'pais' ? 'pais' : `unidade-${UNIDADE}`}-${lang}-${largura}.png`;
      await p.screenshot({ path: path.join(PASTA, nome), clip: caixa });
      feitas.push({ ficheiro: nome, lang, largura, nivel, recorte: caixa });
      console.log(`  ${nome}  ${caixa.width} × ${caixa.height} px`);
      await ctx.close();
    }
  }
}

await nav.close();
servidor.close();

fs.writeFileSync(
  ARTEFACTO,
  `${JSON.stringify(
    {
      sobre: 'F1.1e · as oito capturas do mapa, o recorte de cada uma',
      comando: 'node design/especime-v3/medicoes/capturas-do-mapa.mjs',
      medido: new Date().toISOString(),
      pasta: path.relative(RAIZ, PASTA),
      escala: 1,
      capturas: feitas,
    },
    null,
    2,
  )}\n`,
);
console.log(`\n  escrito ${path.relative(RAIZ, ARTEFACTO)}\n`);
