#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * AS CAPTURAS DO BLOCO P3 · «Os nomes das medidas, e a revisão de língua de tudo»
 * ---------------------------------------------------------------------------
 * O guião é o do P2 (`design/especime-v3/medicoes/p2-2026-09-15/capturas-cartao.mjs`),
 * que por sua vez era o do F1.13, com outra lista de rotas e outro destino: a
 * máquina de fotografar não muda de bloco para bloco, e reescrevê-la seria uma
 * segunda cópia a divergir na primeira correção.
 *
 * A regra do diretor, de 15.09.2026: uma mudança de forma decide-se em capturas
 * nas larguras reais, enviadas a ele ANTES de aterrar, e não numa descrição.
 *
 * O §1, item 7, do brief P3 diz o que fotografar: a primeira página, a página
 * de área da habitação, a página de domínio da economia, o Sobre e o Método,
 * nas duas edições, a 390, 768, 1 024, 1 280 e 1 600 px, antes e depois, em
 * `design/especime-v3/capturas/p3-2026-09-16/`.
 *
 * A ROTA DE CADA NOME ESTÁ ESCRITA AQUI, e é isso que faz de uma fotografia uma
 * medição: uma captura sem a rota declarada é a imagem de uma página que ninguém
 * sabe qual é.
 *
 *   node design/especime-v3/medicoes/p3-2026-09-16/capturas-p3.mjs --momento=antes
 *   node ...../capturas-p3.mjs --momento=depois
 *   node ...../capturas-p3.mjs --momento=antes --so=sobre,metodo
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
  PARA || path.join('design', 'especime-v3', 'capturas', 'p3-2026-09-16'),
);

/**
 * AS CINCO PÁGINAS DO CONJUNTO, com a rota de cada edição.
 *
 * `inicio` é a primeira página; `area` é a da habitação, que é a que o diretor
 * leu a 15.09.2026 e a que o brief nomeia; `dominio` é o da economia e das
 * finanças públicas, que é o único domínio com página; `sobre` e `metodo` são
 * as duas páginas onde o sítio se explica, e são as que perdem «a casa».
 */
const ROTAS = [
  { nome: 'inicio', pt: '/', en: '/en' },
  {
    nome: 'area',
    pt: '/areas/infraestruturas-e-habitacao',
    en: '/en/areas/infraestruturas-e-habitacao',
  },
  {
    nome: 'dominio',
    pt: '/dominios/economia-e-financas-publicas',
    en: '/en/domains/economia-e-financas-publicas',
  },
  { nome: 'sobre', pt: '/sobre', en: '/en/about' },
  { nome: 'metodo', pt: '/metodo', en: '/en/method' },
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
