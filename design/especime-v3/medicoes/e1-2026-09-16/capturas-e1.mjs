#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * AS CAPTURAS DO BLOCO E1 · «Évora 2027: o prometido, o painel, o dinheiro»
 * ---------------------------------------------------------------------------
 * O guião é o do P3 (`design/especime-v3/medicoes/p3-2026-09-16/capturas-p3.mjs`),
 * com outra lista de rotas e outro destino: a máquina de fotografar não muda de
 * bloco para bloco, e reescrevê-la seria uma segunda cópia a divergir na
 * primeira correção.
 *
 * O §1, itens 4 e 5, do brief E1 diz o que fotografar: a página do estudo e a
 * página de texto do estudo novo, nas duas edições e nas cinco larguras; e a
 * lista dos estudos a 390 e a 1 280.
 *
 * A ROTA DE CADA NOME ESTÁ ESCRITA AQUI, e é isso que faz de uma fotografia uma
 * medição: uma captura sem a rota declarada é a imagem de uma página que ninguém
 * sabe qual é.
 *
 *   node design/especime-v3/medicoes/e1-2026-09-16/capturas-e1.mjs
 *
 * Não mede: fotografa. Chromium sem cabeça, tema claro, depois de
 * `document.fonts.ready`, a página inteira. Este estudo entra pela primeira vez
 * e por isso não há «antes»: as capturas não levam momento no nome.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST
  ? path.resolve(RAIZ, process.env.OEDP_DIST)
  : path.join(RAIZ, 'dist');
const DESTINO = path.join(RAIZ, 'design', 'especime-v3', 'capturas', 'e1-2026-09-16');

const SLUG = 'evora-2027-prometido-painel-dinheiro';

/**
 * AS TRÊS PÁGINAS DO CONJUNTO, com a rota de cada edição e as larguras em que
 * cada uma se fotografa. A lista dos estudos leva duas, que são as que o item 5
 * do brief pede; as duas páginas do estudo levam as cinco do §0.
 */
const LARGURAS = [390, 768, 1024, 1280, 1600];
const ROTAS = [
  { nome: 'estudo', pt: `/estudos/${SLUG}`, en: `/en/studies/${SLUG}`, larguras: LARGURAS },
  { nome: 'texto', pt: `/estudos/${SLUG}/texto`, en: `/en/studies/${SLUG}/text`, larguras: LARGURAS },
  { nome: 'estudos', pt: '/estudos', en: '/en/studies', larguras: [390, 1280] },
];

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
  for (const edicao of ['pt', 'en']) {
    for (const largura of rota.larguras) {
      const ctx = await nav.newContext({ viewport: { width: largura, height: ALTURA } });
      const p = await ctx.newPage();
      const resposta = await p.goto(base + rota[edicao], { waitUntil: 'networkidle' });
      if (!resposta || resposta.status() !== 200) {
        console.error(
          `${rota.nome} ${edicao} ${largura}: ${resposta?.status() ?? 'sem resposta'} em ${rota[edicao]}`,
        );
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
