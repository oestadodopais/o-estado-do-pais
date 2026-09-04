#!/usr/bin/env node
/**
 * AS CAPTURAS DO BLOCO F1.7, estado a estado.
 *
 * Não mede nada: fotografa. As rotas que o brief manda (o índice dos concelhos,
 * uma linha e uma região, nas duas edições) às cinco larguras da régua dos
 * alvos, mais a manchete da primeira página, que o item 7 manda fotografar antes
 * e depois para se ver que o aspeto não mudou.
 *
 *   node tests/acessibilidade/capturas.mjs <pasta>
 *   OEDP_DIST=<outra construção> node tests/acessibilidade/capturas.mjs <pasta>
 *
 * `OEDP_DIST` é a mesma convenção das outras réguas da casa: aponta a fotografia
 * para outra construção, e é assim que se tira a de ANTES sobre `origin/main`
 * com o mesmo guião e não com outro.
 *
 * O NOME DE CADA FICHEIRO DIZ O QUE ELE É: `<rota>-<largura>.png`. Onde a rota
 * declara um recorte, o ficheiro é só desse pedaço: uma fotografia de
 * `/municipios` inteira a 1 280 são 85 ecrãs de lista e não se vê nada nela.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const PARA = path.resolve(process.argv[2] ?? path.join(RAIZ, '.medicoes', 'capturas'));

const LARGURAS = [390, 641, 768, 1023, 1280];

/**
 * As rotas, com o recorte de cada uma.
 *
 * `recorte` é o seletor do que se fotografa; sem ele, fotografa-se a janela. As
 * fichas dos concelhos estão a vinte e tal ecrãs do topo de `/municipios`, e é
 * o primeiro grupo da lista que as mostra; a manchete da primeira página é o
 * `<h1>` e mais nada, porque é o alvo do algarismo que o item 7 muda.
 */
const ROTAS = [
  { nome: 'pt-municipios-fichas', rota: '/municipios/', recorte: '.concelhos-grupo' },
  { nome: 'en-municipios-fichas', rota: '/en/municipalities/', recorte: '.concelhos-grupo' },
  { nome: 'pt-linha', rota: '/livro-razao/evora-populacao-2025/' },
  { nome: 'en-linha', rota: '/en/ledger/evora-populacao-2025/' },
  { nome: 'pt-regiao', rota: '/regioes/alentejo/' },
  { nome: 'en-regiao', rota: '/en/regions/alentejo/' },
  { nome: 'pt-manchete', rota: '/', recorte: 'h1.cabeca-h1' },
  { nome: 'en-manchete', rota: '/en/', recorte: 'h1.cabeca-h1' },
  { nome: 'pt-manchete-concelho', rota: '/municipios/evora/', recorte: 'h1' },
  { nome: 'en-manchete-concelho', rota: '/en/municipalities/evora/', recorte: 'h1' },
  { nome: 'pt-rodape', rota: '/agenda/', recorte: 'footer.rodape' },
  { nome: 'en-rodape', rota: '/en/agenda/', recorte: 'footer.rodape' },
];

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

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}
fs.mkdirSync(PARA, { recursive: true });

const servidor = http.createServer((req, res) => {
  const semQuery = req.url.split('?')[0];
  let ficheiro;
  try {
    ficheiro = path.resolve(DIST, '.' + decodeURIComponent(semQuery));
  } catch {
    ficheiro = path.resolve(DIST, '.' + semQuery);
  }
  if (!ficheiro.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(ficheiro) && fs.statSync(ficheiro).isDirectory()) {
    ficheiro = path.join(ficheiro, 'index.html');
  }
  if (!fs.existsSync(ficheiro)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': MIME[path.extname(ficheiro)] ?? 'application/octet-stream' });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const nav = await chromium.launch({ headless: true });
let n = 0;
for (const r of ROTAS) {
  for (const largura of LARGURAS) {
    const ctx = await nav.newContext({ viewport: { width: largura, height: 900 } });
    const pagina = await ctx.newPage();
    await pagina.goto(base + r.rota, { waitUntil: 'networkidle' });
    await pagina.evaluate(() => document.fonts.ready);
    const destino = path.join(PARA, `${r.nome}-${largura}.png`);
    if (r.recorte) {
      const el = await pagina.$(r.recorte);
      if (!el) {
        console.error(`a rota ${r.rota} não tem "${r.recorte}" a ${largura}px.`);
        process.exit(2);
      }
      await el.scrollIntoViewIfNeeded();
      await el.screenshot({ path: destino });
    } else {
      await pagina.screenshot({ path: destino });
    }
    n++;
    await ctx.close();
  }
}
await nav.close();
servidor.close();
console.log(`${n} captura(s) em ${path.relative(RAIZ, PARA) || PARA}`);
