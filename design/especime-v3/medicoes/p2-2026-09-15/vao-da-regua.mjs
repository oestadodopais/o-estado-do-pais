#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * OS VÃOS DA RÉGUA DE UM CARTÃO, MEDIDOS NO NAVEGADOR (achado do lugar de
 * direção às capturas de 15.09.2026, fechado a 16.09)
 * ---------------------------------------------------------------------------
 * O diretor leu «acima do valor de referência ( 9 %)» nas capturas, com dois
 * espaços que ninguém escreveu. O HTML construído não os tinha: quem os punha
 * era a folha. `.cartao-medida-regua-item` é um `inline-flex` com `gap: 0 4px`, e
 * num contentor de flexão CADA CORRIDA DE TEXTO vira um filho seu, com o `gap`
 * entre ela e a seguinte. Os parênteses, o algarismo e o símbolo eram três
 * filhos, e o olho lia três vãos onde a casa tinha escrito zero.
 *
 * ESTA RÉGUA MEDE O QUE O LEITOR LÊ, e não o que a fonte diz: conta os filhos de
 * cada item da régua no navegador, e lê o texto do item já composto. A promessa
 * é uma forma só em todo o sítio: o símbolo escreve-se como a medida o declara
 * em `src/data/figuras.mjs` e a página não lhe acrescenta nada.
 *
 *   node design/especime-v3/medicoes/p2-2026-09-15/vao-da-regua.mjs
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(RAIZ, process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const ROTAS = [
  { nome: 'area (habitação)', pt: '/areas/infraestruturas-e-habitacao', en: '/en/areas/infraestruturas-e-habitacao' },
  { nome: 'dominio', pt: '/dominios/economia-e-financas-publicas', en: '/en/domains/economia-e-financas-publicas' },
];
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.csv': 'text/csv',
  '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf',
};
if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}
const servidor = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(DIST, u);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'light' });
const p = await ctx.newPage();

/* Os filhos de um `inline-flex` incluem as corridas de texto anónimas, e o
   navegador não as dá numa lista: contam-se pelos nós filhos do elemento, que é
   o que o motor usa para as gerar. */
const SONDA = () =>
  [...document.querySelectorAll('.cartao-medida-regua-item')].map((el) => ({
    tipo: el.getAttribute('data-regua'),
    filhos: [...el.childNodes].filter(
      (n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== ''),
    ).length,
    texto: el.textContent.replace(/\s+/g, ' ').trim(),
  }));

let itens = 0;
let comVaoASerio = 0;
const exemplos = new Map();
for (const rota of ROTAS) {
  for (const ed of ['pt', 'en']) {
    await p.goto(base + rota[ed], { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    for (const i of await p.evaluate(SONDA)) {
      itens++;
      if (i.filhos > 2) comVaoASerio++;
      const chave = `${rota.nome} · ${ed} · ${i.tipo}`;
      if (!exemplos.has(chave)) exemplos.set(chave, i);
    }
  }
}
await ctx.close();
await nav.close();
servidor.close();

console.log('');
console.log('  OS VÃOS DA RÉGUA DE UM CARTÃO · medidos no navegador, a 1280');
console.log('');
console.log(`    itens da régua medidos                       ${itens}`);
console.log(`    itens com mais de dois filhos de flexão      ${comVaoASerio}`);
console.log('');
for (const [chave, i] of exemplos) {
  console.log(`    ${chave.padEnd(34)} ${i.filhos} filho(s) · «${i.texto}»`);
}
console.log('');
if (comVaoASerio > 0) {
  console.error(
    `  ✗ ${comVaoASerio} item(ns) da régua com mais de dois filhos de flexão: a folha põe um vão\n` +
      `    de 4 px entre cada dois, e o leitor lê espaços que ninguém escreveu.\n`,
  );
  process.exit(1);
}
console.log('  ✓ dois filhos por item (o rótulo e o valor), e o único vão é o de 4 px entre eles.');
console.log('');
