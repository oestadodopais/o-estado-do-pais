#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * AS CAPTURAS DO BLOCO F1.10
 * ---------------------------------------------------------------------------
 * O §6 do brief pede as capturas de `/`, `/municipios`, uma região e um concelho
 * «a 390 × 664 e 1 280 nas duas edições», em
 * `design/especime-v3/capturas/lugar-2026-09-04/`. A lista deste guião é a
 * dessas quatro mais as páginas que as passagens do bloco mudaram, e o nome de
 * cada ficheiro é `<nome>-<edição>-<largura>.png`, que é a convenção do conjunto
 * de 09.09.2026.
 *
 * A ROTA DE CADA NOME ESTÁ ESCRITA AQUI, e é isso que faz de uma fotografia uma
 * medição: uma captura sem a rota declarada é uma imagem de uma página que
 * ninguém sabe qual é.
 *
 *   node design/especime-v3/medicoes/lugar-2026-09-04/capturas-lugar.mjs
 *   node …/capturas-lugar.mjs --so=concelho,linha      só estes nomes
 *   node …/capturas-lugar.mjs --para=<dir>             noutra pasta
 *
 * Não mede: fotografa. Chromium sem cabeça, tema claro, depois de
 * `document.fonts.ready`, a página inteira.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = path.join(RAIZ, 'dist');
const argv = process.argv.slice(2);
const SO = (argv.find((a) => a.startsWith('--so=')) ?? '').slice(5).split(',').filter(Boolean);
const PARA = (argv.find((a) => a.startsWith('--para=')) ?? '').slice(7);
const DESTINO = path.resolve(
  RAIZ,
  PARA || path.join('design', 'especime-v3', 'capturas', 'lugar-2026-09-04'),
);

/** As treze páginas do conjunto, com a rota de cada edição. */
const ROTAS = [
  { nome: 'inicio', pt: '/', en: '/en' },
  { nome: 'concelhos', pt: '/municipios', en: '/en/municipalities' },
  { nome: 'concelho', pt: '/municipios/evora', en: '/en/municipalities/evora' },
  { nome: 'regioes', pt: '/regioes', en: '/en/regions' },
  { nome: 'regiao', pt: '/regioes/alentejo', en: '/en/regions/alentejo' },
  {
    nome: 'dominio',
    pt: '/dominios/economia-e-financas-publicas',
    en: '/en/domains/economia-e-financas-publicas',
  },
  { nome: 'estudos', pt: '/estudos', en: '/en/studies' },
  {
    nome: 'estudo',
    pt: '/estudos/evora-prometido-pago-auditado-2026',
    en: '/en/studies/evora-prometido-pago-auditado-2026',
  },
  {
    nome: 'estudo-texto',
    pt: '/estudos/evora-prometido-pago-auditado-2026/texto',
    en: '/en/studies/evora-prometido-pago-auditado-2026/text',
  },
  { nome: 'numeros-e-fontes', pt: '/livro-razao', en: '/en/ledger' },
  {
    nome: 'linha',
    pt: '/livro-razao/evora-indice-de-divida-2024',
    en: '/en/ledger/evora-indice-de-divida-2024',
  },
  { nome: 'metodo', pt: '/metodo', en: '/en/method' },
  { nome: 'uniao-europeia', pt: '/uniao-europeia', en: '/en/european-union' },
];

const LARGURAS = [390, 1280];
const ALTURA = 664;
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

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}
fs.mkdirSync(DESTINO, { recursive: true });

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
let feitas = 0;
for (const rota of ROTAS) {
  if (SO.length && !SO.includes(rota.nome)) continue;
  for (const edicao of ['pt', 'en']) {
    for (const largura of LARGURAS) {
      const ctx = await nav.newContext({ viewport: { width: largura, height: ALTURA } });
      const p = await ctx.newPage();
      const resposta = await p.goto(base + rota[edicao], { waitUntil: 'networkidle' });
      if (!resposta || resposta.status() !== 200) {
        console.error(`${rota.nome} ${edicao} ${largura}: ${resposta?.status() ?? 'sem resposta'} em ${rota[edicao]}`);
        await ctx.close();
        process.exitCode = 1;
        continue;
      }
      await p.evaluate(() => document.fonts.ready);
      const ficheiro = path.join(DESTINO, `${rota.nome}-${edicao}-${largura}.png`);
      await p.screenshot({ path: ficheiro, fullPage: true });
      feitas++;
      console.log(`${path.relative(RAIZ, ficheiro)}  ←  ${rota[edicao]}`);
      await ctx.close();
    }
  }
}
await nav.close();
servidor.close();
console.log(`${feitas} captura(s) em ${path.relative(RAIZ, DESTINO)}`);
