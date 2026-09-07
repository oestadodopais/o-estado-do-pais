#!/usr/bin/env node
/**
 * =============================================================================
 * AS CAPTURAS DO BLOCO F1.1c · a área de leitura vazia e a área com uma leitura
 * =============================================================================
 *
 * NÃO MEDE NADA: fotografa. Duas capturas a 390 × 664, em português e no tema
 * claro, sobre um `dist/` já construído, em Chromium sem cabeça e depois de
 * `document.fonts.ready`:
 *
 *   · `inicio-390x664-repouso-pt.png` · a página em repouso, com a área de
 *     leitura vazia e a linha «Toque num cartão para ler a medida.»;
 *   · `inicio-390x664-uma-leitura-pt.png` · a mesma página depois de um toque
 *     num cartão, com uma leitura aberta e só ela.
 *
 * PORQUE NÃO VIVE EM `tests/inicio/capturas.mjs`. O fotógrafo da primeira página
 * tira estados que se pedem pelo ENDEREÇO (`?densidade=leitura`, `?ambito=…`) e
 * uma rota por linha; estes dois estados pedem-se com um GESTO, um toque num
 * cartão, e um gesto não cabe na tabela dele sem lhe mudar a forma. Fica ao lado,
 * com o nome do bloco, como os outros medidores de `scripts/`.
 *
 * O CARTÃO QUE SE TOCA é o primeiro da faixa da cabeça cujo destino seja uma
 * âncora desta página. Desde a segunda passagem do bloco (07.09.2026) são os 21,
 * e o id do cartão tocado é impresso, para que a captura se possa refazer.
 *
 *   node scripts/capturas-toque.mjs [destino] [dist]
 *
 * Exemplo (o que tirou as capturas de 04.09.2026):
 *
 *   node scripts/capturas-toque.mjs design/especime-v3/capturas/toque-2026-09-04
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = path.resolve(process.argv[2] ?? '.');
const DIST = path.resolve(process.argv[3] ?? path.join(RAIZ, 'dist'));

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(vermelho(`\n  não existe ${DIST}. Corra o build primeiro.\n`));
  process.exit(1);
}
fs.mkdirSync(DESTINO, { recursive: true });

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
};

const servidor = http.createServer((req, res) => {
  const semQuery = req.url.split('?')[0];
  let f;
  try {
    f = path.resolve(DIST, '.' + decodeURIComponent(semQuery));
  } catch {
    f = path.resolve(DIST, '.' + semQuery);
  }
  if (!f.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const navegador = await chromium.launch({ headless: true });
const ctx = await navegador.newContext({ viewport: { width: 390, height: 664 } });
/* O CLARO É A ESCOLHA GUARDADA NO APARELHO, que é o mesmo caminho que
   `tests/inicio/capturas.mjs` usa desde a Emenda 12. */
await ctx.addInitScript(() => {
  try {
    localStorage.setItem('tema', 'light');
  } catch {
    /* sem armazenamento a página sai clara à mesma */
  }
});
const p = await ctx.newPage();
await p.goto(base + '/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: path.join(DESTINO, 'inicio-390x664-repouso-pt.png'), fullPage: true });

const cartao = await p.evaluate(() => {
  const c = [...document.querySelectorAll('[data-grelha] [data-faixa] [data-cartao]')].find((x) =>
    (x.querySelector('.cartao-porta')?.getAttribute('href') ?? '').startsWith('#'),
  );
  if (c) c.scrollIntoView({ block: 'center', inline: 'center' });
  return c ? c.getAttribute('data-cartao') : null;
});
if (!cartao) {
  console.error(vermelho('\n  nenhum cartão da faixa da cabeça abre uma leitura nesta página.\n'));
  await ctx.close();
  await navegador.close();
  servidor.close();
  process.exit(1);
}
await p.click(`[data-cartao="${cartao}"] .cartao-porta`);
await p.waitForTimeout(250);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({
  path: path.join(DESTINO, 'inicio-390x664-uma-leitura-pt.png'),
  fullPage: true,
});

console.log(
  `  ${verde('✓')} duas capturas em ${path.relative(RAIZ, DESTINO)} ${cinza(`cartão tocado: ${cartao}`)}`,
);
await ctx.close();
await navegador.close();
servidor.close();
