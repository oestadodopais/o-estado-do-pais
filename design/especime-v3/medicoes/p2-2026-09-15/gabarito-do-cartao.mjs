#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * O GABARITO DO CARTÃO · as linhas de base dos números e dos títulos
 * (bloco P2, item 6, 15.09.2026)
 * ---------------------------------------------------------------------------
 *
 * A medida de aceitação do item 6: «as capturas nas cinco larguras sem saltos,
 * medidas por uma régua que compara as posições dos números e dos títulos entre
 * cartões». Isto é essa régua.
 *
 * O QUE ELA PERGUNTA AO NAVEGADOR, e não ao HTML: para cada cartão da faixa, a
 * que altura começa o número e a que altura começa o título, **dentro da sua
 * própria fila da grelha**. Não se comparam alturas absolutas na página: a
 * partir de 768 px a faixa é uma grelha que dobra, e a segunda fila de cartões
 * começa naturalmente mais abaixo do que a primeira. O que tem de ser igual é a
 * distância do topo de cada CARTÃO ao topo do seu número e do seu título: é isso
 * que o olho lê como uma serra quando varia.
 *
 * MEDE TAMBÉM O TRANSBORDO HORIZONTAL da página em cada largura, porque é a
 * outra metade da mudança da faixa: uma fila que deixa de rolar não pode passar
 * a empurrar a página.
 *
 *   node design/especime-v3/medicoes/p2-2026-09-15/gabarito-do-cartao.mjs
 *   node ...../gabarito-do-cartao.mjs --json design/.../gabarito.json
 *
 * Não é um portão: é a régua que torna comparável o antes e o depois.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(RAIZ, process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const argv = process.argv.slice(2);
const JSON_PARA = (argv.find((a) => a.startsWith('--json=')) ?? '').slice(7);

const ROTAS = [
  { nome: 'inicio', pt: '/', en: '/en' },
  { nome: 'dominio', pt: '/dominios/economia-e-financas-publicas', en: '/en/domains/economia-e-financas-publicas' },
  { nome: 'uniao', pt: '/uniao-europeia', en: '/en/european-union' },
];
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
/** @type {any[]} */
const linhas = [];
for (const rota of ROTAS) {
  for (const edicao of ['pt', 'en']) {
    for (const largura of LARGURAS) {
      const ctx = await nav.newContext({ viewport: { width: largura, height: ALTURA } });
      const p = await ctx.newPage();
      const resposta = await p.goto(base + rota[edicao], { waitUntil: 'networkidle' });
      if (!resposta || resposta.status() !== 200) {
        console.error(`${rota.nome} ${edicao} ${largura}: ${resposta?.status() ?? 'sem resposta'}`);
        await ctx.close();
        process.exitCode = 1;
        continue;
      }
      await p.evaluate(() => document.fonts.ready);
      const m = await p.evaluate(() => {
        const cartoes = [...document.querySelectorAll('.cartao')];
        const dentro = cartoes.map((c) => {
          const cr = c.getBoundingClientRect();
          const v = c.querySelector('.cartao-valor');
          const n = c.querySelector('.cartao-nome');
          const u = c.querySelector('.cartao-unidade');
          return {
            id: c.getAttribute('data-cartao'),
            altura: Math.round(cr.height * 10) / 10,
            valor: v ? Math.round((v.getBoundingClientRect().top - cr.top) * 10) / 10 : null,
            nome: n ? Math.round((n.getBoundingClientRect().top - cr.top) * 10) / 10 : null,
            unidade: u ? Math.round((u.getBoundingClientRect().top - cr.top) * 10) / 10 : null,
          };
        });
        const faixa = document.querySelector('.faixa');
        return {
          cartoes: dentro,
          faixaRola: faixa ? faixa.scrollWidth - faixa.clientWidth > 1 : null,
          transbordo: Math.round((document.documentElement.scrollWidth - document.documentElement.clientWidth) * 10) / 10,
        };
      });
      /** @param {(number|null)[]} xs */
      const espalhamento = (xs) => {
        const ns = xs.filter((x) => typeof x === 'number');
        if (ns.length === 0) return null;
        return Math.round((Math.max(...ns) - Math.min(...ns)) * 10) / 10;
      };
      linhas.push({
        rota: rota.nome,
        edicao,
        largura,
        cartoes: m.cartoes.length,
        espalhamento_do_valor: espalhamento(m.cartoes.map((c) => c.valor)),
        espalhamento_do_nome: espalhamento(m.cartoes.map((c) => c.nome)),
        espalhamento_da_unidade: espalhamento(m.cartoes.map((c) => c.unidade)),
        faixa_rola: m.faixaRola,
        transbordo_da_pagina: m.transbordo,
      });
      await ctx.close();
    }
  }
}
await nav.close();
servidor.close();

const cab = ['rota', 'edição', 'largura', 'cartões', 'valor', 'nome', 'unidade', 'faixa rola', 'transbordo'];
console.log('');
console.log('  O GABARITO DO CARTÃO · espalhamento (px) das posições dentro de cada cartão');
console.log('');
console.log(`  ${cab[0].padEnd(8)}${cab[1].padEnd(7)}${cab[2].padEnd(9)}${cab[3].padEnd(9)}${cab[4].padEnd(8)}${cab[5].padEnd(8)}${cab[6].padEnd(9)}${cab[7].padEnd(11)}${cab[8]}`);
for (const l of linhas) {
  console.log(
    `  ${l.rota.padEnd(8)}${l.edicao.padEnd(7)}${String(l.largura).padEnd(9)}${String(l.cartoes).padEnd(9)}` +
      `${String(l.espalhamento_do_valor ?? '-').padEnd(8)}${String(l.espalhamento_do_nome ?? '-').padEnd(8)}` +
      `${String(l.espalhamento_da_unidade ?? '-').padEnd(9)}${String(l.faixa_rola ?? '-').padEnd(11)}${l.transbordo_da_pagina}`,
  );
}
console.log('');

if (JSON_PARA) {
  const destino = path.resolve(RAIZ, JSON_PARA);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, `${JSON.stringify(linhas, null, 2)}\n`);
  console.log(`  ${path.relative(RAIZ, destino)}`);
  console.log('');
}
