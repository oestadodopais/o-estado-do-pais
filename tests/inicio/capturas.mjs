#!/usr/bin/env node
/**
 * AS CAPTURAS DA PRIMEIRA PÁGINA, estado a estado.
 *
 * Não mede nada: fotografa. Nove estados × duas larguras × duas edições × dois
 * temas, sobre `dist/`, em Chromium sem cabeça e depois de `document.fonts.ready`.
 * O escuro entra pela escolha guardada no aparelho, que é o único caminho para o
 * escuro desde a Emenda 12.
 * O nome de cada ficheiro diz o que ele é: `<estado>-<largura>-<edição>-<tema>.png`.
 *
 *   node tests/inicio/capturas.mjs [dir]
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');
const argv = process.argv.slice(2);

/* ---------------------------------------------------------------------------
 * O SEGUNDO MODO: AS ROTAS DA ETAPA 3 (etapa 2m)
 * ---------------------------------------------------------------------------
 * A etapa 3 parou no limite de fichas com a nota escrita e as réguas corridas,
 * e o que lhe faltou foi a fotografia (a sua subetapa 3e). O brief da 2m manda
 * tirá-la aqui. Não é a primeira página, e por isso não são estados: são ROTAS,
 * sem gesto nenhum pelo meio, a 1280 e a 390, nas duas edições e no tema claro.
 *
 *   node tests/inicio/capturas.mjs                as nove estados da primeira página
 *   node tests/inicio/capturas.mjs --etapa-3      as seis rotas da etapa 3
 *   node tests/inicio/capturas.mjs <dir>          as da primeira página, noutro sítio
 */
const ETAPA_3 = argv.includes('--etapa-3');
const ROTAS_DA_ETAPA_3 = [
  { nome: 'livro-razao-indice', pt: '/livro-razao', en: '/en/ledger' },
  { nome: 'linha-divida-publica', pt: '/livro-razao/divida-publica-2025', en: '/en/ledger/divida-publica-2025' },
  { nome: 'linha-evora-indice-de-divida', pt: '/livro-razao/evora-indice-de-divida-2024', en: '/en/ledger/evora-indice-de-divida-2024' },
  { nome: 'linha-avisos-pt2030', pt: '/livro-razao/avisos-pt2030-abertos', en: '/en/ledger/avisos-pt2030-abertos' },
  { nome: 'municipios-indice', pt: '/municipios', en: '/en/municipalities' },
  { nome: 'municipios-evora', pt: '/municipios/evora', en: '/en/municipalities/evora' },
];

const DESTINO = ETAPA_3
  ? path.join(RAIZ, 'design', 'especime-v3', 'capturas', 'etapa-3')
  : (argv.find((a) => !a.startsWith('--')) ?? path.join(RAIZ, 'design', 'especime-v3', 'capturas', 'etapa-2'));

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

const servidor = http.createServer((req, res) => {
  let f;
  try {
    f = path.resolve(DIST, '.' + decodeURIComponent(req.url.split('?')[0]));
  } catch {
    f = path.resolve(DIST, '.' + req.url.split('?')[0]);
  }
  if (!f.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404).end();
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

/* Os nove estados. A VISTA DE ESCOLHA JÁ TEM ENDEREÇO (etapa 2m, ISSUES I42):
   era um modo que só se abria por um toque no comando «Município», e passa a ser
   `?ambito=municipio`. A captura entra por lá, como as outras, e o gesto deixa
   de ser preciso — o que sobra do toque é o estado da proximidade, que continua
   a ser um gesto e por isso continua a ter o seu. */
const ESTADOS = [
  /* O País nas quatro larguras do brief da 2m: é o mapa que muda com elas. */
  { nome: 'pais-relance', q: '', larguras: [1440, 1280, 1024, 390] },
  { nome: 'pais-leitura', q: '?densidade=leitura' },
  { nome: 'regiao-alentejo', q: '?ambito=regiao:alentejo' },
  { nome: 'evora-relance', q: '?ambito=municipio:evora' },
  { nome: 'evora-leitura', q: '?ambito=municipio:evora&densidade=leitura' },
  { nome: 'beja-vazio', q: '?ambito=municipio:beja' },
  /* A vista de escolha a 1024 e a 1440 além das duas de sempre: é a largura que
     manda no mapa desta vista (etapa 2m), e uma captura só a 1280 não mostrava
     nem o mínimo nem o máximo do que ele faz. */
  { nome: 'escolha', q: '?ambito=municipio', larguras: [1440, 1280, 1024, 390] },
  /* A vista de escolha DEPOIS do gesto da Emenda 3 (subetapa 2h): um toque no
     selo abre a vista, um segundo toque, num sítio concreto do mapa, troca os
     botões pelos concelhos mais próximos desse sítio. Só existe no telemóvel,
     porque só lá o selo é o alvo — a 1280 os pontos são alvos e o gesto é
     outro —, e por isso este estado declara a sua largura. */
  { nome: 'escolha-proxima', q: '?ambito=municipio', tocarNoSelo: true, larguras: [390] },
  { nome: 'pais-sem-js', q: '', js: false },
];

fs.mkdirSync(DESTINO, { recursive: true });
const navegador = await chromium.launch({ headless: true });
let feitas = 0;

if (ETAPA_3) {
  for (const rota of ROTAS_DA_ETAPA_3) {
    for (const largura of [1280, 390]) {
      for (const edicao of ['pt', 'en']) {
        const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 } });
        /* Claro, e por escolha guardada como em toda a parte: é o defeito da
           Emenda 12 e o brief pede só o claro para estas seis. */
        await contexto.addInitScript(() => {
          try {
            localStorage.setItem('tema', 'light');
          } catch (e) {
            /* sem armazenamento a página sai clara à mesma */
          }
        });
        const p = await contexto.newPage();
        await p.goto(base + rota[edicao], { waitUntil: 'networkidle' });
        await p.evaluate(() => document.fonts.ready);
        await p.screenshot({
          path: path.join(DESTINO, `${rota.nome}-${largura}-${edicao}-claro.png`),
          fullPage: true,
        });
        feitas++;
        await contexto.close();
      }
    }
  }
  await navegador.close();
  servidor.close();
  console.log(`\n  ${feitas} capturas em ${path.relative(RAIZ, DESTINO)}\n`);
  process.exit(0);
}

for (const estado of ESTADOS) {
  for (const largura of estado.larguras ?? [1280, 390]) {
    for (const [edicao, rota] of [['pt', '/'], ['en', '/en']]) {
      for (const tema of ['claro', 'escuro']) {
        /* O ESCURO ENTRA PELO CAMINHO REAL (Emenda 12, 21.08.2026).
           Deixou de haver preferência do sistema a decidir o tema: há um
           controlo no cabeçalho e uma escolha guardada no aparelho do leitor.
           Escrever a escolha antes de a página correr é exatamente o estado de
           quem carregou no botão numa visita anterior, e é a guarda do `<head>`
           que a aplica — o mesmo caminho que a matriz mede. Pôr `data-theme` à
           mão fotografaria a folha e não o mecanismo. */
        const contexto = await navegador.newContext({
          viewport: { width: largura, height: 900 },
          javaScriptEnabled: estado.js !== false,
        });
        await contexto.addInitScript((t) => {
          try {
            localStorage.setItem('tema', t === 'escuro' ? 'dark' : 'light');
          } catch (e) {
            /* sem armazenamento a captura sai clara, e o nome do ficheiro dí-lo-ia */
          }
        }, tema);
        const p = await contexto.newPage();
        await p.goto(base + rota + estado.q, { waitUntil: 'networkidle' });
        /* A 390 o comando «Município» existe duas vezes: o segmento da linha
           de comando (escondido) e a linha de destino do telemóvel. Clica-se no
           que está à vista, que é o que o leitor tem. */
        if (estado.clicar) await p.locator(`${estado.clicar}:visible`).first().click();
        /* O gesto: o sítio tocado lê-se do rectângulo do mapa, que o selo cobre
           exactamente. É preciso trazer o selo à janela antes, porque um toque
           fora da janela não é um toque em sítio nenhum. */
        if (estado.tocarNoSelo) {
          await p.locator('.movel-selo').scrollIntoViewIfNeeded();
          const r = await p.evaluate(() => {
            const b = document.querySelector('[data-mapa]').getBoundingClientRect();
            return { left: b.left, top: b.top, w: b.width, h: b.height };
          });
          await p.mouse.click(r.left + r.w * 0.75, r.top + r.h * 0.66);
        }
        await p.evaluate(() => document.fonts.ready);
        await p.screenshot({
          path: path.join(DESTINO, `${estado.nome}-${largura}-${edicao}-${tema}.png`),
          fullPage: true,
        });
        feitas++;
        await contexto.close();
      }
    }
  }
}

await navegador.close();
servidor.close();
console.log(`\n  ${feitas} capturas em ${path.relative(RAIZ, DESTINO)}\n`);
