#!/usr/bin/env node
/**
 * A RÉGUA DA PÁGINA DE LEITURA — a forma, medida no motor.
 *
 * ---------------------------------------------------------------------------
 * NÃO É UM PORTÃO. Imprime, e sai sempre com 0.
 * ---------------------------------------------------------------------------
 * Corre fora do `npm run build`, como `tests/linha/recibo.mjs`, e pela mesma
 * razão: o que fecha a construção são as sete conferências L1 a L7 dentro do
 * `gate:html`, provadas em estragos plantados. O que se mede aqui é FORMA — que
 * letra cada coisa tem, que largura, e se alguma coisa transborda —, e a forma
 * julga-se lendo, não obedecendo.
 *
 * O que mede:
 *   1. a disposição B a 1280: o corpo e a coluna do aparelho, e a coluna a
 *      passar para baixo do corpo no móvel;
 *   2. a letra: Bitter tabular em toda a figura, Spectral na prosa da frase;
 *   3. o selo colado à sua figura, e o alvo de toque;
 *   4. o transbordo horizontal a 320, 390, 768, 1024 e 1280;
 *   5. as tabelas a rolarem dentro da sua caixa, e não a empurrarem a página;
 *   6. a ligação mais longa do 03 pt (o endereço como etiqueta) a quebrar.
 *
 *   node tests/texto/leitura.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

const servidor = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(DIST, p);
  if (!f.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': TIPOS[path.extname(f)] ?? 'application/octet-stream' });
  res.end(fs.readFileSync(f));
});

await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;
const nav = await chromium.launch();

let passam = 0;
let total = 0;
function conta(nome, bem, prova) {
  total += 1;
  if (bem) passam += 1;
  console.log(`  ${bem ? verde('passa') : vermelho('falha')}  ${nome}`);
  if (prova) console.log(cinza(`         ${prova}`));
}

async function pagina(largura = 1280) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 1000 } });
  const p = await ctx.newPage();
  p.__contexto = ctx;
  return p;
}

const O04 = '/estudos/evora-prometido-pago-auditado-2026/texto';
const O03 = '/estudos/avaliacao-economica-regional-de-portugal-2026/texto';
const O08 = '/estudos/evora-quinze-anos-cinco-mandatos/texto';

console.log('');
console.log(cinza('  a régua da página de leitura · o documento composto do registo'));
console.log('');

/* 1 · A DISPOSIÇÃO B (IDENTIDADE.md §3): corpo a 68ch, aparelho a 300px. */
{
  const p = await pagina(1280);
  await p.goto(base + O04, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const grelha = document.querySelector('.texto');
    const corpo = document.querySelector('.texto-corpo');
    const aparelho = document.querySelector('.aparelho');
    const artigo = document.querySelector('.texto-artigo');
    const par = artigo.querySelector('p[data-registo-bloco]');
    return {
      colunas: getComputedStyle(grelha).gridTemplateColumns,
      corpo: Math.round(corpo.getBoundingClientRect().width),
      aparelho: Math.round(aparelho.getBoundingClientRect().width),
      aparelhoAoLado: Math.round(aparelho.getBoundingClientRect().top) <= Math.round(corpo.getBoundingClientRect().top),
      prosa: getComputedStyle(par).fontSize + ' / ' + getComputedStyle(par).lineHeight,
    };
  });
  conta('a 1280 a página é a disposição B, com a coluna do aparelho ao lado do corpo', m.aparelhoAoLado && m.aparelho >= 290 && m.aparelho <= 310, `corpo ${m.corpo}px · aparelho ${m.aparelho}px · grid ${m.colunas}`);
  conta('a prosa do corpo é a escala da leitura (19px, entrelinha 1,6)', m.prosa.startsWith('19px'), m.prosa);
  await p.__contexto.close();
}

/* 2 · A LETRA: Bitter tabular na figura, Spectral na frase. */
{
  const p = await pagina(1280);
  await p.goto(base + O04, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const fig = document.querySelector('.texto-artigo .texto-figura');
    const par = fig.closest('[data-registo-unidade]');
    const cs = getComputedStyle(fig);
    return {
      figura: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
      tabular: cs.fontVariantNumeric,
      frase: getComputedStyle(par).fontFamily.split(',')[0].replace(/["']/g, ''),
      cor: cs.color === getComputedStyle(par).color,
    };
  });
  conta('toda a figura vai em Bitter tabular', m.figura === 'Bitter' && /tabular-nums/.test(m.tabular), `${m.figura} · ${m.tabular}`);
  conta('a frase à volta fica em Spectral', m.frase === 'Spectral', m.frase);
  conta('a figura não leva cor nenhuma', m.cor, 'a mesma tinta da frase');
  await p.__contexto.close();
}

/* 3 · O SELO COLADO À SUA FIGURA, e o alvo de toque. */
{
  const p = await pagina(1280);
  await p.goto(base + O04, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const fig = [...document.querySelectorAll('.texto-artigo .texto-figura')].find(
      (f) => f.nextElementSibling?.classList.contains('src-chip'),
    );
    const selo = fig.nextElementSibling;
    const a = fig.getBoundingClientRect();
    const b = selo.getBoundingClientRect();
    const alvo = selo.getBoundingClientRect();
    return {
      distancia: Math.round(b.left - a.right),
      mesmaLinha: Math.abs(a.top - b.top) < 6,
      alvo: Math.round(alvo.height),
      dentroDeAlvo: Boolean(selo.closest('a:not(.src-chip), button')),
      semTextoPeloMeio: fig.nextSibling === selo,
    };
  });
  conta('o selo entra colado à figura, sem um nó de texto pelo meio', m.semTextoPeloMeio, `${m.distancia}px de afastamento, dado pela folha`);
  conta('o selo senta-se na linha da figura', m.mesmaLinha, `altura visível ${m.alvo}px`);
  conta('o selo nunca fica aninhado dentro de outro alvo (Emenda 2)', !m.dentroDeAlvo);
  await p.__contexto.close();
}

/* 4 · O TRANSBORDO, nas cinco larguras. */
for (const rota of [O04, O03, O08]) {
  for (const largura of [320, 390, 768, 1024, 1280]) {
    const p = await pagina(largura);
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const m = await p.evaluate(() => ({
      documento: document.documentElement.scrollWidth,
      janela: window.innerWidth,
      pior: (() => {
        let pior = null;
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.right > window.innerWidth + 1 && (!pior || r.right > pior.direita)) {
            pior = { direita: Math.round(r.right), quem: el.className || el.tagName };
          }
        }
        return pior;
      })(),
    }));
    conta(
      `${rota.split('/')[2].slice(0, 22)} a ${largura}: a página não rola de lado`,
      m.documento <= m.janela + 1,
      `documento ${m.documento}px · janela ${m.janela}px${m.pior ? ` · o mais à direita: ${m.pior.quem} a ${m.pior.direita}px` : ''}`,
    );
    await p.__contexto.close();
  }
}

/* 5 · AS TABELAS ROLAM DENTRO DA SUA CAIXA. */
{
  const p = await pagina(390);
  await p.goto(base + O04, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const caixas = [...document.querySelectorAll('.texto-tabela')];
    const rolam = caixas.filter((c) => c.scrollWidth > c.clientWidth + 1).length;
    const aparelho = document.querySelector('.aparelho').getBoundingClientRect();
    const corpo = document.querySelector('.texto-corpo').getBoundingClientRect();
    return { caixas: caixas.length, rolam, aparelhoPorBaixo: aparelho.top > corpo.top };
  });
  conta('a 390 as tabelas rolam dentro da sua caixa', m.rolam > 0, `${m.rolam} de ${m.caixas} caixas rolam`);
  conta('a 390 a coluna do aparelho passa para baixo do corpo', m.aparelhoPorBaixo);
  await p.__contexto.close();
}

/* 6 · A LIGAÇÃO MAIS LONGA DO 03 pt, que leva o endereço por etiqueta. */
{
  const p = await pagina(390);
  await p.goto(base + O03, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const ligacoes = [...document.querySelectorAll('.texto-artigo .texto-ligacao')];
    const maior = ligacoes.sort((a, b) => b.textContent.length - a.textContent.length)[0];
    const r = maior.getBoundingClientRect();
    return {
      caracteres: maior.textContent.length,
      quebra: getComputedStyle(maior).overflowWrap,
      linhas: maior.getClientRects().length,
      cabe: Math.round(r.right) <= window.innerWidth + 1,
    };
  });
  conta('a etiqueta mais longa do 03 pt quebra e não corta', m.quebra === 'anywhere' && m.linhas > 1 && m.cabe, `${m.caracteres} caracteres em ${m.linhas} linhas · overflow-wrap: ${m.quebra}`);
  await p.__contexto.close();
}

await nav.close();
servidor.close();
console.log('');
console.log(passam === total ? verde(`  ${passam}/${total}`) : vermelho(`  ${passam}/${total}`));
console.log('');
process.exit(0);
