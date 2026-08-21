#!/usr/bin/env node
/**
 * A RÉGUA DOS CONCELHOS — `/municipios` e `/municipios/evora`, medidas no motor.
 *
 * NÃO É UM PORTÃO: imprime, e sai sempre com 0. Corre fora do `npm run build`,
 * como `tests/inicio/matriz.mjs` e `tests/linha/recibo.mjs`, e pela mesma razão.
 *
 *   node tests/municipio/concelhos.mjs
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
  '.csv': 'text/csv',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.png': 'image/png',
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

const INDICE = '/municipios';
const EVORA = '/municipios/evora';

console.log('');
console.log(cinza('  a régua dos concelhos'));
console.log('');

/* 1 · OS 308, com o vocabulário de cobertura e a porta de Évora. */
{
  const p = await pagina();
  await p.goto(base + INDICE, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const itens = [...document.querySelectorAll('.concelho')];
    const cobertura = [...document.querySelectorAll('.concelhos-lista [data-cobertura]')];
    const porEstado = {};
    for (const e of cobertura) {
      const k = e.getAttribute('data-cobertura');
      (porEstado[k] = porEstado[k] ?? new Set()).add(e.textContent.trim());
    }
    return {
      n: itens.length,
      grupos: document.querySelectorAll('.concelhos-grupo').length,
      comPagina: document.querySelectorAll('.concelho-com-pagina').length,
      portaEvora: [...document.querySelectorAll('.concelho a[href]')].map((a) => a.getAttribute('href')),
      cadeias: Object.fromEntries(Object.entries(porEstado).map(([k, v]) => [k, [...v]])),
    };
  });
  conta(
    '3c · os 308 concelhos, uma cadeia por estado de cobertura, e a porta de Évora',
    m.n === 308 &&
      m.comPagina === 1 &&
      m.portaEvora.length === 1 &&
      m.portaEvora[0] === '/municipios/evora' &&
      Object.values(m.cadeias).every((v) => v.length === 1),
    `${m.n} concelhos em ${m.grupos} grupos · ${m.comPagina} com página · porta ${m.portaEvora.join(', ')} · ` +
      `cadeias ${JSON.stringify(m.cadeias)}`,
  );
  await p.__contexto.close();
}

/* 2 · A COBERTURA PELAS DUAS CHAVES DA PROVA, e a contagem por parcelas com o
   seu selo. A soma rende UMA vez com selo (ISSUES I38). */
{
  const p = await pagina();
  await p.goto(base + INDICE, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const provas = [...document.querySelectorAll('#conteudo [data-prova]')].map((e) => [
      e.getAttribute('data-prova'),
      e.textContent.trim(),
      e.getAttribute('href'),
    ]);
    const parcelas = [...document.querySelectorAll('.concelhos-parcela')].map((e) => {
      const claim = e.querySelector('[data-claim]');
      return {
        id: claim?.getAttribute('data-claim'),
        valor: claim?.textContent.trim(),
        selo: e.querySelector('.src-chip')?.getAttribute('href'),
      };
    });
    return {
      provas,
      parcelas,
      totalNaPagina: document.querySelectorAll('[data-claim="municipios-portugal-caop-2025"]').length,
    };
  });
  const esperadas = ['municipios_com_pagina', 'municipios_total'];
  conta(
    '3c · a cobertura pelas duas chaves da prova, e as quatro parcelas com o seu selo',
    m.provas.length === 2 &&
      esperadas.every((k) => m.provas.some(([c]) => c === k)) &&
      m.provas.every(([, , href]) => href) &&
      m.parcelas.length === 4 &&
      m.parcelas.every((x) => x.id && x.selo === `/livro-razao/${x.id}`) &&
      m.totalNaPagina === 1,
    `provas ${m.provas.map(([k, v]) => `${k}=${v}`).join(' · ')} · ` +
      `parcelas ${m.parcelas.map((x) => `${x.valor}(${x.id})`).join(' · ')} · ` +
      `a soma rende ${m.totalNaPagina} vez(es)`,
  );
  await p.__contexto.close();
}

/* 3 · A PORTA DO CSV E A FONTE DA CAOP. */
{
  const p = await pagina();
  await p.goto(base + INDICE, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => ({
    csv: [...document.querySelectorAll('a[href]')].some(
      (a) => a.getAttribute('href') === '/dados/municipios-308.csv',
    ),
    verbatim: document.querySelectorAll('[data-verbatim="caop-fonte"]').length,
    mapa: [...document.querySelectorAll('a[href]')]
      .map((a) => a.getAttribute('href'))
      .filter((h) => h.includes('#mapa')),
  }));
  conta(
    '3c · a porta do CSV, a citação da CAOP e a porta do mapa',
    m.csv && m.verbatim === 1 && m.mapa.length === 1,
    `CSV ${m.csv} · citação da CAOP ${m.verbatim} · porta do mapa ${m.mapa.join(', ') || '(nenhuma)'}`,
  );
  await p.__contexto.close();
}

/* 4 · O TRANSBORDO, cinco larguras, duas edições, as duas páginas. */
{
  const rotas = [INDICE, '/en/municipalities', EVORA, '/en/municipalities/evora'];
  const linhas = [];
  let mau = 0;
  for (const largura of [320, 390, 768, 1024, 1280]) {
    const p = await pagina(largura);
    for (const rota of rotas) {
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      const t = await p.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (t !== 0) {
        mau += 1;
        linhas.push(`${rota} @${largura}: ${t}px`);
      }
    }
    await p.__contexto.close();
  }
  conta(
    '3c · transbordo 0 nas duas páginas × 2 edições × 5 larguras',
    mau === 0,
    mau === 0 ? '20 de 20 combinações a zero' : linhas.join(' · '),
  );
}

/* 5 · ÉVORA: as oito medidas pela peça da primeira página, e a única cor é a do
   tecto legal (Emenda 1). */
{
  const p = await pagina();
  await p.goto(base + EVORA, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const raiz = getComputedStyle(document.documentElement);
    const rgb = (hex) => {
      const h = hex.replace('#', '').trim();
      const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
      return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
    };
    const cores = {
      amber: rgb(raiz.getPropertyValue('--amber')),
      ochre: rgb(raiz.getPropertyValue('--ochre')),
      cobalt: rgb(raiz.getPropertyValue('--cobalt')),
    };
    const pecas = [...document.querySelectorAll('.peca')];
    const coloridas = [];
    for (const el of document.querySelectorAll('body *')) {
      const c = getComputedStyle(el);
      for (const prop of ['color', 'backgroundColor', 'fill', 'stroke']) {
        if (Object.values(cores).includes(c[prop])) {
          coloridas.push(`${el.tagName.toLowerCase()}.${(el.getAttribute('class') || '').split(' ')[0]}:${prop}`);
        }
      }
    }
    return {
      pecas: pecas.length,
      vazias: document.querySelectorAll('.peca-vazia').length,
      reguas: document.querySelectorAll('.peca .regua').length,
      estados: [...new Set(pecas.map((e) => e.getAttribute('data-estado')))].sort(),
      coloridas: [...new Set(coloridas)],
    };
  });
  conta(
    '3d · as oito medidas pela peça, e a cor só no tecto legal',
    m.pecas === 8 && m.vazias === 0 && m.reguas === 1 &&
      m.estados.join(',') === 'dentro,sem' &&
      m.coloridas.length > 0 &&
      /* Os únicos objectos com cor de estado são os da peça do índice de dívida:
         o quadrado do marcador, a palavra de estado e a barra da régua. */
      m.coloridas.every(
        (x) => x.startsWith('span.sq') || x.startsWith('span.peca-palavra') || x.startsWith('rect.regua-barra'),
      ),
    `${m.pecas} peças (${m.vazias} vazias) · ${m.reguas} régua · estados ${m.estados.join('/')} · ` +
      `elementos com cor de estado: ${m.coloridas.join(' | ') || '(nenhum)'}`,
  );
  await p.__contexto.close();
}

/* 6 · OS DOIS DESENHOS, NA GRAMÁTICA DA RÉGUA, E NENHUM AMARELO NO GABARITO. */
{
  const p = await pagina();
  await p.goto(base + EVORA, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    /* Um `<line>` sem `fill` declarado computa `rgb(0, 0, 0)`, que não é a cor
       que ele desenha: o que se lê num traço é o `stroke`. Por etiqueta, e não
       por adivinha. */
    const cor = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const c = getComputedStyle(el);
      return el.tagName.toLowerCase() === 'line' ? c.stroke : c.fill;
    };
    const largura = (sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).strokeWidth : null;
    };
    return {
      distanciaBarra: cor('.mun-distancia-barra'),
      distanciaValor: cor('.mun-distancia-valor'),
      distanciaRef: cor('.mun-distancia-ref'),
      refLargura: largura('.mun-distancia-ref'),
      valorLargura: largura('.mun-distancia-valor'),
      serieBarras: document.querySelectorAll('.mun-serie-barra').length,
      serieValores: document.querySelectorAll('.mun-serie-valor').length,
      serieRef: cor('.mun-serie-ref'),
      /* Nenhum atributo de apresentação com cor escrita no gabarito. */
      fillsEscritos: [...document.querySelectorAll('[fill]')].map((e) => e.getAttribute('fill')),
    };
  });
  conta(
    '3d · os dois desenhos na gramática da régua, e nenhuma cor escrita no gabarito',
    m.distanciaBarra && m.distanciaValor && m.distanciaRef &&
      m.refLargura === '2px' && m.valorLargura === '1px' &&
      m.serieBarras === 4 && m.serieValores === 4 && m.serieRef &&
      m.fillsEscritos.every((f) => !/yellow|#/.test(String(f))),
    `distância: barra ${m.distanciaBarra} · valor ${m.distanciaValor} (${m.valorLargura}) · ` +
      `referência ${m.distanciaRef} (${m.refLargura}) · série: ${m.serieBarras} barras, ` +
      `${m.serieValores} valores, referência ${m.serieRef} · fills escritos no gabarito: ` +
      `${[...new Set(m.fillsEscritos)].join(', ') || '(nenhum)'}`,
  );
  await p.__contexto.close();
}

await nav.close();
servidor.close();

console.log('');
console.log(
  `  ${passam === total ? verde(`${passam} de ${total} células passam.`) : vermelho(`${passam} de ${total} células passam.`)}`,
);
console.log('');
process.exit(0);
