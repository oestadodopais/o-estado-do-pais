#!/usr/bin/env node
/**
 * AS CAPTURAS DA PRIMEIRA PÁGINA, estado a estado.
 *
 * Não mede nada: fotografa. Oito estados × duas larguras × duas edições × dois
 * temas, sobre `dist/`, em Chromium sem cabeça e depois de `document.fonts.ready`.
 * O nome de cada ficheiro diz o que ele é: `<estado>-<largura>-<edição>-<tema>.png`.
 *
 *   node tests/inicio/capturas.mjs [dir]
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');
const DESTINO = process.argv[2] ?? path.join(RAIZ, 'design', 'especime-v3', 'capturas', 'etapa-2');

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

const servidor = http.createServer((req, res) => {
  let f;
  try {
    f = path.resolve(DIST, '.' + decodeURIComponent(req.url.split('?')[0]));
  } catch {
    f = path.resolve(DIST, '.' + req.url.split('?')[0]);
  }
  if (!f.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404).end();
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

/* Os oito estados. A vista de escolha não tem endereço próprio — é um modo, e
   entra por um toque no comando «Município». */
const ESTADOS = [
  { nome: 'pais-relance', q: '' },
  { nome: 'pais-leitura', q: '?densidade=leitura' },
  { nome: 'regiao-alentejo', q: '?ambito=regiao:alentejo' },
  { nome: 'evora-relance', q: '?ambito=municipio:evora' },
  { nome: 'evora-leitura', q: '?ambito=municipio:evora&densidade=leitura' },
  { nome: 'beja-vazio', q: '?ambito=municipio:beja' },
  { nome: 'escolha', q: '', clicar: '[data-modo="municipio"]' },
  { nome: 'pais-sem-js', q: '', js: false },
];

fs.mkdirSync(DESTINO, { recursive: true });
const navegador = await chromium.launch({ headless: true });
let feitas = 0;

for (const estado of ESTADOS) {
  for (const largura of [1280, 390]) {
    for (const [edicao, rota] of [['pt', '/'], ['en', '/en']]) {
      for (const tema of ['claro', 'escuro']) {
        const contexto = await navegador.newContext({
          viewport: { width: largura, height: 900 },
          javaScriptEnabled: estado.js !== false,
          colorScheme: tema === 'escuro' ? 'dark' : 'light',
        });
        await contexto.addInitScript((t) => {
          document.addEventListener('DOMContentLoaded', () =>
            document.documentElement.setAttribute('data-theme', t === 'escuro' ? 'dark' : 'light'),
          );
        }, tema);
        const p = await contexto.newPage();
        await p.goto(base + rota + estado.q, { waitUntil: 'networkidle' });
        /* A 390 o comando «Município» existe duas vezes: o segmento da linha
           de comando (escondido) e a linha de destino do telemóvel. Clica-se no
           que está à vista, que é o que o leitor tem. */
        if (estado.clicar) await p.locator(`${estado.clicar}:visible`).first().click();
        await p.evaluate(() => document.fonts.ready);
        await p.screenshot({
          path: path.join(DESTINO, `${estado.nome}-${largura}-${edicao}-${tema}.png`),
          fullPage: true,
        });
        feitas++;
        await contexto.close();
      }
    }
  }
}

await navegador.close();
servidor.close();
console.log(`\n  ${feitas} capturas em ${path.relative(RAIZ, DESTINO)}\n`);
