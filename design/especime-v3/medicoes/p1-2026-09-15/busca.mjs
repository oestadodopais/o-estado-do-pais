#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * A BUSCA A 390 E A 1 280 · a medida de aceitação do item 4 do P1
 * ---------------------------------------------------------------------------
 * «Nenhuma frase à vista acima ou abaixo do campo, medida a 390 e a 1 280; o
 * axe a 0; o campo com nome acessível.»
 *
 * O axe é da célula H1 de `tests/acessibilidade/alvos.mjs`, que corre no
 * `verify`; o que falta medir é o resto, e é isto: **o que está à vista acima e
 * abaixo do campo**, e **o nome acessível do campo**, nas três superfícies que
 * rendem a caixa e nas duas edições.
 *
 * «À VISTA ACIMA OU ABAIXO» É UMA GEOMETRIA E NÃO UMA CONTAGEM DE CADEIAS: um
 * `.vh` continua no documento e não se vê, e é exactamente o que o item manda
 * fazer à frase do sem-guião e ao rótulo. Por isso a medição pergunta ao
 * navegador, e não ao HTML: dos irmãos do campo dentro da caixa da busca, quais
 * é que têm área.
 *
 * O TECTO É 1 px², E É MEDIDO E NÃO ESCOLHIDO. A classe `.vh` desta casa é a
 * receita de sempre: `position: absolute` com um rectângulo de 1 × 1 px
 * recortado, e por isso a caixa de um `.vh` mede 1 px² e não zero. É o mesmo
 * número que a célula A5 de `tests/inicio/porta.mjs` já imprime sobre a gaveta
 * dos nomes («1 × 1 px recortada, área à vista 0»). Um elemento com mais do que
 * isso está à vista.
 *
 * O NOME ACESSÍVEL LÊ-SE DO `<label for>`, que é o que o navegador resolve, e a
 * medição imprime-o: um texto-fantasma não é um nome, e um campo que só o
 * tivesse ficava sem nome nenhum quando o leitor escreve.
 *
 *   node design/especime-v3/medicoes/p1-2026-09-15/busca.mjs
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(RAIZ, process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.csv': 'text/csv', '.xml': 'application/xml', '.txt': 'text/plain' };

const servidor = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(DIST, u);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

/** As três superfícies que rendem a caixa, nas duas edições. */
const ROTAS = [
  '/', '/municipios', '/livro-razao/concelhos',
  '/en', '/en/municipalities', '/en/ledger/municipalities',
];
const LARGURAS = [390, 1280];

const nav = await chromium.launch({ headless: true });
let maus = 0;
console.log(`\n  A BUSCA A 390 E A 1 280 · ${path.relative(RAIZ, DIST) || DIST}\n`);
for (const rota of ROTAS) {
  for (const largura of LARGURAS) {
    const ctx = await nav.newContext({ viewport: { width: largura, height: 800 } });
    const p = await ctx.newPage();
    const r = await p.goto(base + rota, { waitUntil: 'networkidle' });
    if (!r || r.status() !== 200) {
      console.log(`  ${rota} a ${largura}: ${r?.status() ?? 'sem resposta'}`);
      await ctx.close();
      continue;
    }
    const lido = await p.evaluate(() => {
      const campo = document.querySelector('.busca-campo');
      if (!campo) return null;
      const caixa = campo.closest('.busca');
      const area = (el) => {
        const b = el.getBoundingClientRect();
        return Math.round(b.width * b.height);
      };
      const rotulo = document.querySelector(`label[for="${campo.id}"]`);
      return {
        fantasma: campo.getAttribute('placeholder'),
        nomeAcessivel: rotulo ? (rotulo.textContent ?? '').replace(/\s+/g, ' ').trim() : null,
        areaDoRotulo: rotulo ? area(rotulo) : null,
        /* Os irmãos do campo dentro da caixa da busca, com área. O botão é um
           comando e não uma frase: nomeia-se à parte. */
        aVista: [...(caixa?.children ?? [])]
          .filter((el) => !el.contains(campo) && area(el) > 1)
          .map((el) => `${el.tagName.toLowerCase()}.${el.className} «${(el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40)}» ${area(el)}px²`),
        botao: (document.querySelector('.busca-submeter')?.textContent ?? '').trim() || null,
      };
    });
    await ctx.close();
    if (!lido) {
      console.log(`  ${rota} a ${largura}: sem campo de busca`);
      continue;
    }
    const mau = lido.aVista.length > 0 || !lido.nomeAcessivel || lido.areaDoRotulo > 1;
    if (mau) maus++;
    console.log(
      `  ${mau ? '✗' : '✓'} ${rota.padEnd(28)} ${String(largura).padStart(4)}  ` +
        `texto-fantasma «${lido.fantasma}» · nome acessível «${lido.nomeAcessivel}» ` +
        `(${lido.areaDoRotulo}px², e 1 é o que a classe .vh da casa dá) · ` +
        `botão «${lido.botao ?? 'nenhum'}» · ` +
        `à vista à volta do campo: ${lido.aVista.length ? lido.aVista.join(' | ') : 'nada'}`,
    );
  }
}
await nav.close();
servidor.close();
console.log(`\n  ${maus} superfície(s) com uma frase à vista ou sem nome acessível.\n`);
process.exitCode = maus === 0 ? 0 : 1;
