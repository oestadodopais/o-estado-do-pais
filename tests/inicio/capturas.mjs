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
 * A ETAPA 4 usa o mesmo segundo modo, com a sua lista e mais uma coisa: um
 * RECORTE. A entrada de fecho do Método é o que a subetapa 4b entrega, e uma
 * fotografia da página inteira a 1280 mostra-a com dois dedos de altura. Uma
 * rota pode por isso declarar `recorte`, que é o selector do que se fotografa;
 * a página é sempre carregada inteira, e o que muda é o rectângulo.
 *
 *   node tests/inicio/capturas.mjs                as nove estados da primeira página
 *   node tests/inicio/capturas.mjs --etapa-3      as seis rotas da etapa 3
 *   node tests/inicio/capturas.mjs --etapa-4      as rotas da família da leitura
 *   node tests/inicio/capturas.mjs <dir>          as da primeira página, noutro sítio
 */
const ETAPA_3 = argv.includes('--etapa-3');
const ETAPA_4 = argv.includes('--etapa-4');
/* `--so=<nome>[,<nome>]` corre só as rotas nomeadas do segundo modo. Serve para
   refotografar o que uma subetapa mexeu sem refotografar o que ela não mexeu:
   uma captura de uma página ainda por reconstruir é uma captura que vai mentir
   até ao fecho da etapa. */
const SO = (argv.find((a) => a.startsWith('--so=')) ?? '').slice(5).split(',').filter(Boolean);
const ROTAS_DA_ETAPA_3 = [
  { nome: 'livro-razao-indice', pt: '/livro-razao', en: '/en/ledger' },
  { nome: 'linha-divida-publica', pt: '/livro-razao/divida-publica-2025', en: '/en/ledger/divida-publica-2025' },
  { nome: 'linha-evora-indice-de-divida', pt: '/livro-razao/evora-indice-de-divida-2024', en: '/en/ledger/evora-indice-de-divida-2024' },
  { nome: 'linha-avisos-pt2030', pt: '/livro-razao/avisos-pt2030-abertos', en: '/en/ledger/avisos-pt2030-abertos' },
  { nome: 'municipios-indice', pt: '/municipios', en: '/en/municipalities' },
  { nome: 'municipios-evora', pt: '/municipios/evora', en: '/en/municipalities/evora' },
];

/* AS ROTAS DA ETAPA 4: a família da leitura, como o brief da etapa a lista.
   O 404 é uma rota só, e não duas: o sítio tem uma página de erro (`/404`) e a
   edição inglesa não tem a sua — está declarado assim em `src/pages/`, e uma
   captura de uma rota que não existe seria uma captura de outra página. */
const ROTAS_DA_ETAPA_4 = [
  { nome: 'metodo', pt: '/metodo', en: '/en/method' },
  { nome: 'metodo-fecho', pt: '/metodo', en: '/en/method', recorte: '#a-forma', larguras: [1280] },
  { nome: 'agenda', pt: '/agenda', en: '/en/agenda' },
  { nome: 'agenda-eixo', pt: '/agenda', en: '/en/agenda', recorte: '.agenda-eixo-caixa', larguras: [1280] },
  { nome: 'correcoes', pt: '/correcoes', en: '/en/corrections' },
  { nome: 'sobre', pt: '/sobre', en: '/en/about' },
  { nome: 'estudos', pt: '/estudos', en: '/en/studies' },
  { nome: 'estudo-agua', pt: '/estudos/agua-nao-faturada', en: '/en/studies/agua-nao-faturada' },
  { nome: 'marcador', pt: '/a-verificar', en: '/en/to-verify' },
  /* O 404 fotografa-se pelo ficheiro (`/404.html`) e não pelo caminho: o
     servidor destas capturas serve `dist/` tal e qual, e `/404` não é uma pasta
     com `index.html`. Em produção é o anfitrião que devolve este ficheiro para
     um caminho desconhecido; aqui, pedir `/404` devolvia um corpo vazio, e a
     captura saía uma página branca. */
  { nome: 'nao-encontrado', pt: '/404.html', edicoes: ['pt'] },
];

const DESTINO = ETAPA_4
  ? path.join(RAIZ, 'design', 'especime-v3', 'capturas', 'etapa-4')
  : ETAPA_3
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

if (ETAPA_3 || ETAPA_4) {
  const lista = (ETAPA_4 ? ROTAS_DA_ETAPA_4 : ROTAS_DA_ETAPA_3).filter(
    (r) => SO.length === 0 || SO.includes(r.nome),
  );
  if (SO.length > 0 && lista.length === 0) {
    console.error(`\n  nenhuma rota chamada ${SO.join(', ')} neste modo.\n`);
    process.exit(1);
  }
  for (const rota of lista) {
    for (const largura of rota.larguras ?? [1280, 390]) {
      for (const edicao of rota.edicoes ?? ['pt', 'en']) {
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
        const ficheiro = path.join(DESTINO, `${rota.nome}-${largura}-${edicao}-claro.png`);
        /* O recorte fotografa um pedaço da página, e não outra página: o alvo é
           trazido à janela e o rectângulo é o dele. Se o selector não existir, a
           captura falha em vez de sair uma página inteira com o nome errado. */
        if (rota.recorte) {
          const alvo = p.locator(rota.recorte);
          await alvo.scrollIntoViewIfNeeded();
          await alvo.screenshot({ path: ficheiro });
        } else {
          await p.screenshot({ path: ficheiro, fullPage: true });
        }
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
