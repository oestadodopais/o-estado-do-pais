#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * AS CAPTURAS DO BLOCO P1 · «O rodapé e a primeira página»
 * ---------------------------------------------------------------------------
 * A regra do diretor, de 15.09.2026, é a mesma que o F1.13 seguiu: uma mudança
 * de forma decide-se em capturas nas larguras reais, enviadas ao diretor ANTES
 * de aterrar, e não numa descrição.
 *
 * O item 10 do brief do P1 diz o que fotografar: **a primeira página, o rodapé
 * de uma página de área e o Sobre**, nas duas edições, a 390, 768, 1 024, 1 280
 * e 1 600 px, antes e depois, em `design/especime-v3/capturas/p1-2026-09-15/`.
 *
 * O SOBRE ENTRA E A PÁGINA DE ÁREA FICA, e as duas por razões diferentes: o
 * Sobre é onde o item 3 põe a frase que diz o que este projeto é, e a página de
 * área é onde o rodapé se lê fora da primeira página, sem a ficha do artigo
 * 15.º por baixo dele.
 *
 * A ROTA DE CADA NOME ESTÁ ESCRITA AQUI, e é isso que faz de uma fotografia uma
 * medição: uma captura sem a rota declarada é a imagem de uma página que ninguém
 * sabe qual é.
 *
 *   node design/especime-v3/medicoes/p1-2026-09-15/capturas-p1.mjs --momento=antes
 *   node …/capturas-p1.mjs --momento=depois
 *   OEDP_DIST=… node …/capturas-p1.mjs --momento=antes --so=inicio
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
const DIST = process.env.OEDP_DIST
  ? path.resolve(RAIZ, process.env.OEDP_DIST)
  : path.join(RAIZ, 'dist');
const argv = process.argv.slice(2);
const SO = (argv.find((a) => a.startsWith('--so=')) ?? '').slice(5).split(',').filter(Boolean);
const MOMENTO = (argv.find((a) => a.startsWith('--momento=')) ?? '').slice(10);
const PARA = (argv.find((a) => a.startsWith('--para=')) ?? '').slice(7);

if (MOMENTO !== 'antes' && MOMENTO !== 'depois') {
  console.error('use --momento=antes ou --momento=depois: uma captura sem o momento não se compara.');
  process.exit(2);
}

const DESTINO = path.resolve(
  RAIZ,
  PARA || path.join('design', 'especime-v3', 'capturas', 'p1-2026-09-15'),
);

/**
 * AS TRÊS PÁGINAS DO CONJUNTO, com a rota de cada edição.
 *
 * `inicio` é onde vivem os itens 2, 4, 5, 6, 7 e 8 (a linha legal, a busca, o
 * lugar do nome do mapa, os dezoito domínios e as três portas); `area` é onde o
 * rodapé se lê sem a ficha da primeira página por baixo (item 1); `sobre` é
 * onde vive a frase do item 3.
 */
const ROTAS = [
  { nome: 'inicio', pt: '/', en: '/en' },
  {
    nome: 'area',
    pt: '/areas/infraestruturas-e-habitacao',
    en: '/en/areas/infraestruturas-e-habitacao',
  },
  { nome: 'sobre', pt: '/sobre', en: '/en/about' },
];

/** As cinco larguras do §0 do brief. A altura é a do telemóvel da casa. */
const LARGURAS = [390, 768, 1024, 1280, 1600];
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
        console.error(
          `${rota.nome} ${edicao} ${largura}: ${resposta?.status() ?? 'sem resposta'} em ${rota[edicao]}`,
        );
        await ctx.close();
        process.exitCode = 1;
        continue;
      }
      await p.evaluate(() => document.fonts.ready);
      const ficheiro = path.join(DESTINO, `${rota.nome}-${edicao}-${largura}-${MOMENTO}.png`);
      await p.screenshot({ path: ficheiro, fullPage: true });
      feitas++;
      console.log(`${path.relative(RAIZ, ficheiro)}  ←  ${rota[edicao]}`);
      await ctx.close();
    }
  }
}
await nav.close();
servidor.close();
console.log(`${feitas} captura(s) em ${path.relative(RAIZ, DESTINO)} (${MOMENTO})`);
