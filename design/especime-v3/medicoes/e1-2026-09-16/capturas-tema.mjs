#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * A COMBINAÇÃO QUE PARTIA, FOTOGRAFADA ANTES E DEPOIS · bloco E1
 * ---------------------------------------------------------------------------
 * O documento alojado de um estudo é a obra citada, servida byte a byte, com a
 * moldura deste projeto por cima. A moldura escolhe a sua tinta por
 * `@media (prefers-color-scheme:dark)` com a guarda `:root:not([data-theme="light"])`,
 * que é a guarda que os documentos usam; a tela é do documento.
 *
 * A PRIMEIRA FOLHA DO 14 NÃO DECLARAVA TELA NENHUMA: dizia
 * `:root { color-scheme: light dark; }` e deixava-a ao navegador. O
 * `color-scheme` resolve-se pelo sistema operativo e não vê o `data-theme` que o
 * botão deste sítio escreve, e por isso havia uma combinação em que as duas
 * folhas diziam coisas diferentes ao mesmo leitor: **o sistema em escuro e o
 * leitor a escolher «claro»**. A moldura passava à tinta escura, a tela ficava
 * escura, e as tabelas do documento ficavam quase ilegíveis.
 *
 * Esta é a captura dessa combinação, e de mais nenhuma: uma medida de aceitação
 * que se vê. O «antes» é a folha sem papel nem tinta; o «depois» é a folha que o
 * motor corrigiu, com `--paper` e `--ink` nas três guardas.
 *
 *   node design/especime-v3/medicoes/e1-2026-09-16/capturas-tema.mjs --momento=antes
 *   node design/especime-v3/medicoes/e1-2026-09-16/capturas-tema.mjs --momento=depois
 *
 * Imprime, ao lado de cada captura, a cor calculada do texto da primeira célula
 * e a tela composta por baixo dela: é o par que a régua da moldura mede, e uma
 * fotografia sem os dois números é uma imagem que ninguém pode reconferir.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(RAIZ, process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const DESTINO = path.join(RAIZ, 'design', 'especime-v3', 'capturas', 'e1-2026-09-16');

const MOMENTO = (process.argv.slice(2).find((a) => a.startsWith('--momento=')) ?? '').slice(10);
if (MOMENTO !== 'antes' && MOMENTO !== 'depois') {
  console.error('use --momento=antes ou --momento=depois: uma captura sem o momento não se compara.');
  process.exit(2);
}

const SLUG = 'evora-2027-prometido-painel-dinheiro';
const ROTAS = [
  { edicao: 'pt', rota: `/estudos/${SLUG}/documento/` },
  { edicao: 'en', rota: `/en/studies/${SLUG}/document/` },
];
const LARGURA = 1280;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
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
for (const { edicao, rota } of ROTAS) {
  const ctx = await nav.newContext({ viewport: { width: LARGURA, height: 900 }, colorScheme: 'dark' });
  const p = await ctx.newPage();
  const r = await p.goto(base + rota, { waitUntil: 'networkidle' });
  if (!r || r.status() !== 200) {
    console.error(`${edicao}: ${r?.status() ?? 'sem resposta'} em ${rota}`);
    await ctx.close();
    process.exitCode = 1;
    continue;
  }
  /* O leitor escolhe «claro» com o sistema em escuro: é o botão deste sítio a
     escrever `data-theme` na raiz, que é o que `public/js/tema.js` faz. */
  await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await p.evaluate(() => new Promise((x) => setTimeout(x, 300)));
  await p.evaluate(() => {
    const t = document.querySelector('[data-oedp-moldura] table');
    if (t) t.scrollIntoView();
  });
  const medida = await p.evaluate(() => {
    const td = document.querySelector('[data-oedp-moldura] td');
    let el = td;
    let tela = 'transparente até à raiz';
    while (el) {
      const b = getComputedStyle(el).backgroundColor;
      if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') {
        tela = `${el.tagName} ${b}`;
        break;
      }
      el = el.parentElement;
    }
    return { cor: getComputedStyle(td).color, tela };
  });
  const ficheiro = path.join(DESTINO, `documento-tema-cruzado-${edicao}-1280-${MOMENTO}.png`);
  await p.screenshot({ path: ficheiro });
  console.log(
    `${path.relative(RAIZ, ficheiro)}  ←  ${rota}  · sistema escuro + leitor «claro» · ` +
      `tinta ${medida.cor} · tela ${medida.tela}`,
  );
  await ctx.close();
}
await nav.close();
servidor.close();
