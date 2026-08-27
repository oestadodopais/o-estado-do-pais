#!/usr/bin/env node
/**
 * AS CAPTURAS DA PRIMEIRA PÁGINA, estado a estado.
 *
 * Não mede nada: fotografa. Cinco estados × duas larguras × duas edições × dois
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
/* O TERCEIRO USO DO SEGUNDO MODO: O MAPA POR DISTRITOS (Emenda 20, 27.08.2026).
   As quatro rotas que o brief manda fotografar antes e depois. Duas delas não
   existiam antes (`/distritos/<slug>`), e por isso o modo aceita `--para=<dir>`:
   a fotografia de antes e a de depois vão para pastas diferentes, e uma rota que
   ainda não existe sai da lista pelo `--so=`. */
const MAPA_DISTRITOS = argv.includes('--mapa-distritos');
const PARA = (argv.find((a) => a.startsWith('--para=')) ?? '').slice(7);
/* AS ROTAS DAS REGIÕES (Emenda 21, 27.08.2026). O índice com a régua completa, e
   duas páginas de região: a que está acima do 100 e a que está mais abaixo — as
   duas pontas da escala, que é onde um desenho de régua se parte se se partir. */
const REGIOES = argv.includes('--regioes');
const ROTAS_DAS_REGIOES = [
  { nome: 'regioes-indice', pt: '/regioes', en: '/en/regions', larguras: [1280, 430, 390, 360, 320] },
  { nome: 'regiao-grande-lisboa', pt: '/regioes/grande-lisboa', en: '/en/regions/grande-lisboa' },
  {
    nome: 'regiao-peninsula-de-setubal',
    pt: '/regioes/peninsula-de-setubal',
    en: '/en/regions/peninsula-de-setubal',
  },
];

const ROTAS_DO_MAPA = [
  { nome: 'inicio', pt: '/', en: '/en' },
  { nome: 'distrito-lisboa', pt: '/distritos/lisboa', en: '/en/districts/lisboa' },
  {
    nome: 'distrito-ilha-de-sao-miguel',
    pt: '/distritos/ilha-de-sao-miguel',
    en: '/en/districts/ilha-de-sao-miguel',
  },
  { nome: 'municipios-indice', pt: '/municipios', en: '/en/municipalities' },
];
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
  /* Uma página de trabalho COM leitura publicada, para que o conjunto mostre os
     dois estados que a página tem: `agua-nao-faturada` é a de documento alojado
     sem leitura, e esta é a das três camadas. */
  { nome: 'estudo-leitura', pt: '/estudos/evora-prometido-pago-auditado-2026', en: '/en/studies/evora-prometido-pago-auditado-2026' },
  { nome: 'marcador', pt: '/a-verificar', en: '/en/to-verify' },
  /* O 404 fotografa-se pelo ficheiro (`/404.html`) e não pelo caminho: o
     servidor destas capturas serve `dist/` tal e qual, e `/404` não é uma pasta
     com `index.html`. Em produção é o anfitrião que devolve este ficheiro para
     um caminho desconhecido; aqui, pedir `/404` devolvia um corpo vazio, e a
     captura saía uma página branca. */
  { nome: 'nao-encontrado', pt: '/404.html', edicoes: ['pt'] },
];

const DESTINO = REGIOES
  ? path.resolve(RAIZ, PARA || path.join('design', 'especime-v3', 'capturas', 'regioes-2026-08-27'))
  : MAPA_DISTRITOS
  ? path.resolve(RAIZ, PARA || path.join('design', 'especime-v3', 'capturas', 'mapa-distritos-2026-08-27'))
  : ETAPA_4
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

/* OS QUATRO ESTADOS QUE A PRIMEIRA PÁGINA TEM (Emendas 19 e 21).
   `regiao-alentejo` saiu a 27.08 com a Emenda 21b: uma região vive na sua
   página, e é lá que é fotografada (`--regioes`, mais abaixo).

   (a nota de 26.08, que continua a valer para os outros quatro:)
   Eram nove. Os quatro que saíram eram os do concelho e o da vista de escolha:
   `evora-relance`, `evora-leitura`, `beja-vazio` (os estados
   `?ambito=municipio:<slug>`, que a Emenda 19a tirou do esquema; um concelho é
   fotografado na página dele, no segundo modo, com `--etapa-3`) e
   `escolha-proxima` (a vista de escolha depois do gesto do selo do telemóvel,
   que saiu com o selo no item A4).

   `escolha` fica com outro nome, porque é outra coisa: `?ambito=municipio` é a
   PESQUISA ABERTA, e já não muda o mapa. As quatro larguras ficam, e a razão é a
   mesma que a 2m escreveu para elas ao contrário: é onde se vê que o mapa NÃO
   muda com a largura da vista. */
const ESTADOS = [
  /* O País nas quatro larguras: é o mapa que muda com elas. */
  { nome: 'pais-relance', q: '', larguras: [1440, 1280, 1024, 390] },
  { nome: 'pais-leitura', q: '?densidade=leitura' },
  { nome: 'pesquisa-aberta', q: '?ambito=municipio', larguras: [1440, 1280, 1024, 390] },
  { nome: 'pais-sem-js', q: '', js: false },
];

fs.mkdirSync(DESTINO, { recursive: true });
const navegador = await chromium.launch({ headless: true });
let feitas = 0;

if (ETAPA_3 || ETAPA_4 || MAPA_DISTRITOS || REGIOES) {
  const lista = (
    REGIOES
      ? ROTAS_DAS_REGIOES
      : MAPA_DISTRITOS
        ? ROTAS_DO_MAPA
        : ETAPA_4
          ? ROTAS_DA_ETAPA_4
          : ROTAS_DA_ETAPA_3
  ).filter((r) => SO.length === 0 || SO.includes(r.nome));
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
        /* O SEGUNDO GESTO SAIU COM O SELO DO TELEMÓVEL (item A4) e com a vista
           de escolha (Emenda 19b): era um toque num sítio concreto do mapa, que
           trocava os resultados da pesquisa pelos concelhos mais próximos desse
           sítio. Nenhuma superfície o alcança, e por isso nenhuma captura o
           mostra. */
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
