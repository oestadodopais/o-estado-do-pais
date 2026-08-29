#!/usr/bin/env node
/**
 * =============================================================================
 * AS RÉGUAS DO SÍTIO NO ECRÃ PRINCIPAL (28.08.2026, `design/marca/BRIEF-app.md`)
 * =============================================================================
 *
 * NÃO é um portão: não entra no `npm run build` e não constrói nada. Corre sobre
 * `dist/`, imprime uma linha por célula e SAI COM 0 quando todas passam e com 1
 * quando alguma falha, como `tests/inicio/regioes.mjs` e ao contrário de
 * `matriz.mjs`, que só imprime. O código de saída é o que faz um estrago
 * plantado ser visível (regra 14 da casa).
 *
 *   node tests/inicio/app.mjs
 *   node tests/inicio/app.mjs --json <ficheiro>
 *   node tests/inicio/app.mjs --vermelhos
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTA RÉGUA NÃO PODE PROVAR, E É PRECISO DIZÊ-LO PRIMEIRO
 * ---------------------------------------------------------------------------
 * O `BRIEF-app.md` §3 diz o que é «feito»: no telemóvel do diretor, «adicionar
 * ao ecrã principal» mostra o ícone e o nome curto, e a aplicação abre sem a
 * moldura do navegador. **Nada aqui substitui isso.** Um Chromium sem cabeça não
 * instala uma aplicação, não desenha um ecrã principal e não arredonda os cantos
 * de um ícone. O que esta régua mede são as CONDIÇÕES de isso acontecer: os
 * ficheiros existem, têm as medidas que dizem ter, a tinta cabe onde tem de
 * caber, e todas as páginas das duas edições ligam o que têm de ligar. A prova
 * de que funciona é uma fotografia de um telemóvel, e é do diretor.
 *
 * ---------------------------------------------------------------------------
 * O LEITOR DE PNG É PRÓPRIO, E É POR ISSO QUE A CONFERÊNCIA VALE
 * ---------------------------------------------------------------------------
 * Os ficheiros são escritos por `design/marca/exportar.mjs`, que os captura num
 * Chromium e que tem lá dentro um leitor de PNG para medir a opacidade do 180.
 * Este ficheiro tem o SEU, escrito à parte: uma conferência que usasse o leitor
 * do exportador confirmava-se a si própria, e um defeito nesse leitor passava
 * pelos dois lados ao mesmo tempo. É a mesma disciplina do `check-cadeia.mjs` e
 * do ramo `verificaTexto()` do portão.
 *
 * Pela mesma razão, a varredura das cabeças das páginas é feita com expressões
 * sobre o HTML servido e não com o `node-html-parser` do portão.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 *
 * A1 · OS DOIS MANIFESTOS. Analisam como JSON e trazem os campos que fazem de um
 *      sítio uma aplicação de ecrã principal. O `id` e o `start_url` são por
 *      edição, e é a única coisa que os separa: o nome não se traduz.
 *
 * A2 · OS ÍCONES DECLARADOS EXISTEM COM O TAMANHO DECLARADO. O tamanho lê-se da
 *      cabeça do PNG (o pedaço `IHDR`, bytes 16 a 24) e nunca do nome do
 *      ficheiro: `icon-512.png` com 192 px lá dentro passaria em qualquer
 *      conferência que olhasse para o nome, e é exactamente o que o Android
 *      recusaria depois.
 *
 * A3 · A ZONA SEGURA DO `maskable`. O Android recorta um ícone adaptável com uma
 *      forma que ele escolhe (círculo, quadrado redondo, gota), e a única coisa
 *      garantida é o CÍRCULO INSCRITO DE RAIO 40 % centrado — 204,8 px num
 *      ficheiro de 512. Toda a tinta do sinal tem de caber lá dentro. Mede-se
 *      nos PÍXEIS: o campo é a cor do canto, o sinal é tudo o que difere dela, e
 *      a célula imprime a distância máxima do sinal ao centro e a folga que
 *      sobra até ao bordo do círculo. Um `transform: scale()` numa folha de
 *      estilos não é uma medição: é uma intenção.
 *
 * A4 · O ÍCONE DO IPHONE É OPACO E MEDE 180. As duas coisas na mesma célula
 *      porque o defeito é um só: o iOS compõe este ficheiro sobre PRETO e
 *      arredonda-lhe os cantos, e um canto transparente num ícone que já é quase
 *      preto sai preto sem ninguém dar por isso. Contam-se os píxeis com alfa
 *      abaixo de 255, e o número é zero.
 *
 *      E A MANCHA DA CELA TEM CHÃO, que é a segunda metade desta célula. A
 *      mancha é a percentagem de píxeis que não são o campo, e a §6 quinquies
 *      das NOTAS mediu que os ícones que a casa aceitou pintam entre 19,8 e
 *      29,9 % da cela e que a palavra recusada pintava 4,7 %. Essa BANDA é
 *      decisão de direção e sai só impressa. O CHÃO não: é a área geométrica
 *      das barras ao enquadramento da cela, somada dos próprios `<rect>` do
 *      desenho do diretor, e a célula falha se a mancha ficar abaixo dela por
 *      mais do que o suavizado pode tirar. Sem chão, um ícone opaco todo em
 *      campo passava a imprimir 0 %.
 *
 * A5 · OS DOIS FAVICONS. O ICO lê-se pelo seu DIRETÓRIO — seis bytes de cabeça e
 *      dezasseis por entrada — e tem de trazer os dois tamanhos, 32 e 16, cada
 *      um com os bytes que a entrada promete. O SVG tem de trazer os TRÊS
 *      caminhos do sinal e a regra do esquema escuro, e não pode trazer campo:
 *      um favicon é desenhado sobre o separador do navegador, e um quadrado
 *      opaco numa barra de separadores é uma mancha e não uma marca. E «três»
 *      é uma contagem de TUDO o que desenha (path, rect, circle, ellipse,
 *      polygon, polyline, line, image, use, text) e não dos elementos que a
 *      célula esperava encontrar: com as três barras certas e um `<circle>` ao
 *      lado, o favicon rende outra coisa.
 *
 *      E «os três caminhos» não é uma contagem, é uma COMPARAÇÃO: cada um tem
 *      de ser, carácter a carácter, a barra correspondente de
 *      `design/marca/direcoes-k/favicon.svg`, que é a marca que o diretor
 *      entregou a 29.08.2026, e as duas cores do esquema escuro têm de ser as
 *      de `marca-cheia-escuro.svg`, que é a paleta escura que ele desenhou para
 *      o mesmo desenho. É a única maneira de dizer que o favicon é a marca e
 *      não uma coisa parecida com ela. A conversão de `<rect>` para `<path>` é
 *      refeita AQUI, com o leitor desta régua: uma conferência que usasse a do
 *      exportador confirmava-se a si própria.
 *
 * A6 · AS LIGAÇÕES NA CABEÇA DE TODAS AS ROTAS CONSTRUÍDAS DAS DUAS EDIÇÕES.
 *      Não numa amostra: em todas. Uma ligação que existe em 1357 páginas e
 *      falta numa é a que o leitor abre. E o manifesto tem de ser o DA EDIÇÃO
 *      daquela página, porque um manifesto da outra abre a aplicação na primeira
 *      página errada.
 *
 * A7 · O CABEÇALHO É O NOME, SEM SINAL, NUMA LINHA (diretor, 29.08.2026): o sinal
 *      saiu; a célula confirma que não voltou e que a marca cabe numa linha.
 *
 * A8 · O EXPORTADOR PÕE A MEDIDA, E PÁRA QUANDO NÃO A PODE PÔR. É a única
 *      célula que olha para `design/marca/exportar.mjs` e não para `dist/`, e
 *      está aqui porque o defeito que ela apanha não deixa rasto em `dist/`:
 *      `paginaDoSvg()` põe a medida no `<svg ` do desenho com um
 *      `String.replace`, e um `replace` que não encontra o literal devolve o
 *      texto INTACTO e cala-se. Um `<svg` seguido de quebra de linha, que é
 *      como muitos editores guardam um SVG, dava uma página sem medida nenhuma,
 *      o navegador desenhava o defeito de 300 × 150, e o PNG saía do tamanho da
 *      janela com a marca cortada. A célula chama a função com o desenho do
 *      diretor e exige a medida; e chama-a outra vez com uma cópia em memória
 *      onde o literal está escondido, e exige que PARE. É a segunda metade que
 *      prova a guarda, e corre em todas as passagens.
 *
 * (NÃO HÁ A9, e a falta é deliberada, não um esquecimento. A A9 media o «e» do
 *  cabeçalho em tema escuro; o sinal saiu do cabeçalho a 29.08.2026 por decisão
 *  do diretor, e não há marca nenhuma no cabeçalho para medir — a A7 já exige
 *  que ela não volte. A única superfície onde a marca ainda muda de cor com o
 *  esquema é o favicon, e essa é a A5b, que compara a regra do escuro contra a
 *  paleta escura do próprio diretor. Uma A9 reposta hoje mediria uma folha de
 *  estilos sem nada do outro lado, e as constantes que ela usava saíram com
 *  ela.)
 *
 * A10 · NADA DE MAIS. Nenhum service worker registado e nenhum
 *      `beforeinstallprompt` em nenhum ficheiro servido, e nenhuma
 *      `apple-mobile-web-app-capable` em nenhuma página. As três são proibições
 *      escritas no BRIEF, e uma proibição sem quem a confira é uma frase num
 *      ficheiro de texto.
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
/* A ÚNICA PEÇA QUE ESTA RÉGUA IMPORTA DO EXPORTADOR, e a razão de a importar em
   vez de a copiar: o que a célula A8 mede é a GUARDA do exportador, e uma cópia
   da guarda escrita aqui não provava nada sobre a dele. Para todo o resto vale
   a disciplina do costume, e o leitor de PNG desta régua é o dela. Importar não
   corre a ronda: `exportar.mjs` só a corre quando é ele o ficheiro chamado. */
import { paginaDoSvg } from '../../design/marca/exportar.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.csv': 'text/csv',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const argv = process.argv.slice(2);
const opcao = (nome) => {
  const i = argv.indexOf(nome);
  return i >= 0 ? (argv[i + 1] ?? true) : null;
};
const FICHEIRO_JSON = opcao('--json');
const VERMELHOS = argv.includes('--vermelhos');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

/* ============================================================== os estragos ==
 * O ESTRAGO NÃO TOCA EM DISCO, em nenhuma das suas três formas: é uma
 * transformação no caminho entre o ficheiro e quem o lê. Assim a régua mede
 * exactamente o que mediria de verdade, e o `dist/` fica como estava.
 *
 * São quatro formas porque esta régua lê quatro coisas diferentes, e nenhuma
 * delas se planta como as outras: HTML servido ao navegador, BYTES de um
 * ficheiro binário, PÍXEIS já descodificados (que é onde um píxel de tinta fora
 * do círculo seguro se pode plantar sem reescrever um PNG), e o TEXTO de um
 * ficheiro da árvore, que é o que a A8 precisa: os ficheiros do diretor não se
 * tocam, nem para plantar um estrago.
 * ========================================================================== */
let ESTRAGO = null; // (html, rota) => html
let ESTRAGO_BYTES = null; // (caminho, buf) => buf
let ESTRAGO_PIXEIS = null; // (caminho, imagem) => imagem
let ESTRAGO_FONTE = null; // (ficheiro, texto) => texto

const servidor = http.createServer((req, res) => {
  const semQuery = req.url.split('?')[0];
  let ficheiro;
  try {
    ficheiro = path.resolve(DIST, '.' + decodeURIComponent(semQuery));
  } catch {
    ficheiro = path.resolve(DIST, '.' + semQuery);
  }
  if (!ficheiro.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(ficheiro) && fs.statSync(ficheiro).isDirectory()) {
    ficheiro = path.join(ficheiro, 'index.html');
  }
  if (!fs.existsSync(ficheiro)) return void res.writeHead(404).end('404');
  const tipo = MIME[path.extname(ficheiro)] ?? 'application/octet-stream';
  if (ESTRAGO && path.extname(ficheiro) === '.html') {
    res.writeHead(200, { 'content-type': tipo });
    return void res.end(ESTRAGO(fs.readFileSync(ficheiro, 'utf8'), semQuery));
  }
  res.writeHead(200, { 'content-type': tipo });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const nav = await chromium.launch({ headless: true });

let celulas = [];
let medidas = {};
const conta = (nome, passa, prova) => celulas.push({ nome, passa: !!passa, prova: String(prova) });

/* ================================================================ os leitores */

/** Os bytes de um ficheiro construído, com o estrago pelo caminho. */
function bytesDoDist(caminho) {
  const ficheiro = path.join(DIST, caminho.replace(/^\//, ''));
  if (!fs.existsSync(ficheiro)) return null;
  const buf = fs.readFileSync(ficheiro);
  return ESTRAGO_BYTES ? ESTRAGO_BYTES(caminho, buf) : buf;
}

/** O texto de um ficheiro construído, com o estrago de HTML pelo caminho. */
function textoDoDist(caminho) {
  const buf = bytesDoDist(caminho);
  if (!buf) return null;
  const cru = buf.toString('utf8');
  return ESTRAGO && caminho.endsWith('.html') ? ESTRAGO(cru, caminho) : cru;
}

/**
 * O LEITOR DE PNG DESTA RÉGUA. Lê o que o Chromium escreve e mais nada — oito
 * bits por canal, sem entrelaçamento, cor 6 (RGBA) ou 2 (RGB) — e devolve
 * `null` com o motivo em vez de uma imagem errada.
 *
 * A desfiltragem é a do formato: cada linha traz um byte a dizer com que filtro
 * foi escrita, e os cinco filtros leem-se do píxel à esquerda, do de cima, e do
 * da diagonal. Um filtro que este leitor não conheça PÁRA, porque uma linha mal
 * desfiltrada é uma imagem plausível e errada, que é o pior que uma régua pode
 * devolver.
 */
function lePng(bytes) {
  if (!bytes || bytes.length < 24) return { erro: 'ficheiro vazio ou curto de mais' };
  const ASSINATURA = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!bytes.subarray(0, 8).equals(ASSINATURA)) return { erro: 'não tem a assinatura de PNG' };
  let pos = 8;
  let cab = null;
  const idat = [];
  while (pos + 8 <= bytes.length) {
    const tamanho = bytes.readUInt32BE(pos);
    const tipo = bytes.toString('ascii', pos + 4, pos + 8);
    const corpo = bytes.subarray(pos + 8, pos + 8 + tamanho);
    if (tipo === 'IHDR') {
      cab = {
        largura: corpo.readUInt32BE(0),
        altura: corpo.readUInt32BE(4),
        bits: corpo[8],
        cor: corpo[9],
        entrelacado: corpo[12],
      };
    } else if (tipo === 'IDAT') idat.push(corpo);
    else if (tipo === 'IEND') break;
    pos += 12 + tamanho;
  }
  if (!cab) return { erro: 'PNG sem IHDR' };
  if (cab.bits !== 8 || cab.entrelacado !== 0 || (cab.cor !== 6 && cab.cor !== 2)) {
    return { erro: `${cab.bits} bits, cor ${cab.cor}, entrelaçado ${cab.entrelacado}` };
  }
  const canais = cab.cor === 6 ? 4 : 3;
  let bruto;
  try {
    bruto = zlib.inflateSync(Buffer.concat(idat));
  } catch (e) {
    return { erro: `os dados não descomprimem: ${e.message}` };
  }
  const passo = cab.largura * canais;
  if (bruto.length < cab.altura * (passo + 1)) return { erro: 'faltam linhas nos dados' };
  const rgba = Buffer.alloc(cab.largura * cab.altura * 4);
  const linha = Buffer.alloc(passo);
  const anterior = Buffer.alloc(passo);
  for (let y = 0; y < cab.altura; y++) {
    const inicio = y * (passo + 1);
    const filtro = bruto[inicio];
    if (filtro > 4) return { erro: `filtro ${filtro} na linha ${y}` };
    bruto.copy(linha, 0, inicio + 1, inicio + 1 + passo);
    for (let i = 0; i < passo; i++) {
      const a = i >= canais ? linha[i - canais] : 0;
      const b = anterior[i];
      const c = i >= canais ? anterior[i - canais] : 0;
      if (filtro === 1) linha[i] = (linha[i] + a) & 0xff;
      else if (filtro === 2) linha[i] = (linha[i] + b) & 0xff;
      else if (filtro === 3) linha[i] = (linha[i] + ((a + b) >> 1)) & 0xff;
      else if (filtro === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        linha[i] = (linha[i] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
      }
    }
    for (let x = 0; x < cab.largura; x++) {
      const o = (y * cab.largura + x) * 4;
      rgba[o] = linha[x * canais];
      rgba[o + 1] = linha[x * canais + 1];
      rgba[o + 2] = linha[x * canais + 2];
      rgba[o + 3] = canais === 4 ? linha[x * canais + 3] : 255;
    }
    linha.copy(anterior);
  }
  return { largura: cab.largura, altura: cab.altura, rgba };
}

/**
 * O TEXTO DE UM FICHEIRO DA ÁRVORE (não de `dist/`), com o estrago pelo caminho.
 *
 * É por aqui que passam os desenhos do diretor. O estrago é uma transformação
 * entre o ficheiro e quem o lê, e nunca uma escrita: `design/marca/direcoes-k/`
 * é obra dele e não se toca, nem para plantar.
 */
function textoDaFonte(ficheiro) {
  const cru = fs.readFileSync(ficheiro, 'utf8');
  return ESTRAGO_FONTE ? ESTRAGO_FONTE(ficheiro, cru) : cru;
}

/** Os píxeis de um ícone construído, com o estrago de píxeis pelo caminho. */
function pixeisDoDist(caminho) {
  const imagem = lePng(bytesDoDist(caminho));
  if (imagem.erro || !ESTRAGO_PIXEIS) return imagem;
  return ESTRAGO_PIXEIS(caminho, imagem);
}

/**
 * O DIRETÓRIO DE UM ICO, lido dos bytes.
 *
 * Seis bytes de cabeça (reservado, tipo, número de imagens) e dezasseis por
 * entrada, dos quais interessam quatro: a largura, a altura (zero quer dizer
 * 256, que é a convenção do formato para o único tamanho que não cabe num byte),
 * o tamanho em bytes e o deslocamento. A entrada tem de apontar para dentro do
 * ficheiro: um ICO cujo diretório promete bytes que lá não estão é um ICO que
 * um cliente velho abre e desiste.
 */
function leIco(bytes) {
  if (!bytes || bytes.length < 6) return { erro: 'ficheiro vazio ou curto de mais' };
  if (bytes.readUInt16LE(0) !== 0) return { erro: 'o campo reservado não é zero' };
  if (bytes.readUInt16LE(2) !== 1) return { erro: `o tipo é ${bytes.readUInt16LE(2)} e devia ser 1` };
  const quantas = bytes.readUInt16LE(4);
  if (bytes.length < 6 + 16 * quantas) return { erro: 'o diretório não cabe no ficheiro' };
  const imagens = [];
  for (let i = 0; i < quantas; i++) {
    const e = 6 + 16 * i;
    const largura = bytes[e] === 0 ? 256 : bytes[e];
    const altura = bytes[e + 1] === 0 ? 256 : bytes[e + 1];
    const bits = bytes.readUInt16LE(e + 6);
    const tamanho = bytes.readUInt32BE ? bytes.readUInt32LE(e + 8) : 0;
    const deslocamento = bytes.readUInt32LE(e + 12);
    imagens.push({
      largura,
      altura,
      bits,
      tamanho,
      deslocamento,
      cabe: deslocamento + tamanho <= bytes.length,
    });
  }
  return { imagens };
}

/** As rotas construídas: todo o `index.html` e todo o `<nome>.html` de `dist/`. */
function rotasConstruidas() {
  const out = [];
  const anda = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) anda(full);
      else if (e.name.endsWith('.html')) {
        out.push('/' + path.relative(DIST, full).split(path.sep).join('/'));
      }
    }
  };
  anda(DIST);
  return out.sort();
}

/* ============================================================== as constantes */

/** As sete larguras que a casa mede, das mais estreitas às de secretária. */
const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280];

/** O papel do sítio, de `src/styles/tokens.css`. Lido, não escrito. */
const TOKENS = fs.readFileSync(path.join(RAIZ, 'src', 'styles', 'tokens.css'), 'utf8');
const PAPEL_CLARO = (/--paper:\s*(#[0-9a-f]{6})/i.exec(TOKENS) ?? [])[1]?.toLowerCase() ?? null;

const MANIFESTOS = [
  {
    lang: 'pt',
    caminho: '/manifest.webmanifest',
    lingua: 'pt-PT',
    inicio: '/',
    rota: '/',
  },
  {
    lang: 'en',
    caminho: '/en/manifest.webmanifest',
    lingua: 'en',
    inicio: '/en/',
    rota: '/en',
  },
];

const ICONES = [
  { src: '/icon-192.png', sizes: '192x192', px: 192, purpose: 'any' },
  { src: '/icon-512.png', sizes: '512x512', px: 512, purpose: 'any' },
  { src: '/icon-512-maskable.png', sizes: '512x512', px: 512, purpose: 'maskable' },
];

/** O raio do círculo seguro de um ícone adaptável do Android: 40 % do lado. */
const RAIO_SEGURO = 0.4;

/* ============================================== o desenho do diretor, lido ==
 * As barras de `design/marca/direcoes-k/` são a origem de duas coisas nesta
 * régua: a forma que o `favicon.svg` construído tem de repetir (A5b), e a área
 * que a cela de 180 px tem de pintar (A4). Lêem-se aqui, uma vez, com a régua
 * DESTA régua: um `<rect>` de cada vez, atributo a atributo, sem presumir a
 * ordem em que eles estão escritos, e o retângulo vira caminho aqui. Se a
 * conversão fosse pedida ao exportador, o que se media era o exportador a
 * concordar consigo próprio.
 * ========================================================================== */
const MARCA_K = path.join(RAIZ, 'design', 'marca', 'direcoes-k');

/** O lado da grelha em que a marca está desenhada. */
const LADO_DA_GRELHA = 512;

/** As barras de um desenho do diretor, com a geometria e a cor de cada uma. */
function barrasDaMarca(ficheiro) {
  return [...textoDaFonte(ficheiro).matchAll(/<rect\b[^>]*>/g)]
    .map((m) => {
      const atr = (n) => (new RegExp(`\\b${n}="([^"]*)"`).exec(m[0]) ?? [])[1] ?? null;
      return {
        x: atr('x'),
        y: atr('y'),
        largura: atr('width'),
        altura: atr('height'),
        cor: (atr('fill') ?? '').toUpperCase() || null,
      };
    })
    /* O campo de um ficheiro de cela não tem `x` nem `y`; as barras têm. */
    .filter((b) => b.x !== null && b.y !== null);
}

/** O caminho que uma barra dá, escrito como o exportador o escreve. */
function caminhoDaBarra(b) {
  const x = Number(b.x);
  const y = Number(b.y);
  return `M${x} ${y}H${x + Number(b.largura)}V${y + Number(b.altura)}H${x}Z`;
}

/**
 * O CHÃO DA MANCHA, DERIVADO DO DESENHO E NÃO ESCRITO À MÃO.
 *
 * A soma das áreas das três barras, em percentagem da grelha de 512. Ao
 * enquadramento que as celas usam (o do `favicon.svg` do diretor) dá 24,0875 %,
 * e é esse o número que a cela de 180 px tem de pintar. Não está escrito aqui:
 * sai dos `<rect>` dele, e se ele mudar as barras o chão muda com elas.
 */
function manchaDoDesenho() {
  const barras = barrasDaMarca(path.join(MARCA_K, 'favicon.svg'));
  const area = barras.reduce((a, b) => a + Number(b.largura) * Number(b.altura), 0);
  return (100 * area) / (LADO_DA_GRELHA * LADO_DA_GRELHA);
}

/**
 * O QUE O SUAVIZADO PODE TIRAR À MANCHA, MEDIDO E NÃO ARBITRADO.
 *
 * A mancha conta os píxeis que diferem do campo em mais de 8 níveis, que é o
 * limiar da A3. Um píxel de bordo só se PERDE se a cobertura de tinta nele for
 * tão pequena que a mistura fique dentro desses 8 níveis. O par de cor mais
 * fraco da marca é o cobalto-claro #7FA6DC contra o campo #17191B, que difere
 * 193 níveis no seu canal mais aberto: um píxel só se perde abaixo de
 * 8/193 = 4,15 % de cobertura. A 180 px as três barras têm 768,52 px de
 * perímetro somado, e um bordo tem um píxel de fundo: o máximo que o suavizado
 * pode tirar são 768,52 × 0,0415 = 31,86 px², ou seja **0,098 pontos** dos
 * 32 400 píxeis da cela.
 *
 * A margem é 0,5 pontos, cinco vezes esse máximo. E o desvio real vai no
 * sentido contrário, como tinha de ir: medido, o 180 pinta 24,88 %, que é
 * 0,79 pontos ACIMA da área geométrica, porque um bordo suavizado quase sempre
 * conta. A margem existe para o dia em que um navegador desenhe de outra
 * maneira, não para tapar uma marca encolhida: 0,5 pontos não chegam para
 * esconder um enquadramento trocado, que custaria catorze.
 */
const MARGEM_DO_SUAVIZADO = 0.5;

/** As quatro rotas do cabeçalho: as duas edições, no grande e no compacto. */
const ROTAS_DO_CABECALHO = [
  { nome: 'pt', rota: '/', forma: 'grande' },
  { nome: 'en', rota: '/en', forma: 'grande' },
  { nome: 'pt-compacto', rota: '/metodo', forma: 'compacto' },
  { nome: 'en-compacto', rota: '/en/method', forma: 'compacto' },
];

/* ================================================================= as células */

/** A1 e A2 · os dois manifestos, campo a campo, e os ícones que eles declaram. */
function mediuOsManifestos() {
  for (const m of MANIFESTOS) {
    const cru = textoDoDist(m.caminho);
    if (cru === null) {
      conta(`A1·${m.lang} · o manifesto da edição`, false, `${m.caminho} não foi construído`);
      continue;
    }
    let doc = null;
    let erro = null;
    try {
      doc = JSON.parse(cru);
    } catch (e) {
      erro = e.message;
    }
    if (!doc) {
      conta(`A1·${m.lang} · o manifesto da edição`, false, `não analisa como JSON: ${erro}`);
      continue;
    }
    const esperado = {
      name: 'O Estado do País',
      short_name: 'O Estado',
      lang: m.lingua,
      id: m.inicio,
      start_url: m.inicio,
      display: 'standalone',
      background_color: PAPEL_CLARO,
      theme_color: PAPEL_CLARO,
    };
    const erradas = Object.entries(esperado).filter(([k, v]) => doc[k] !== v);
    conta(
      `A1·${m.lang} · o manifesto da edição`,
      erradas.length === 0,
      erradas.length === 0
        ? Object.entries(esperado)
            .map(([k, v]) => `${k} "${v}"`)
            .join(' · ')
        : erradas.map(([k, v]) => `${k} é ${JSON.stringify(doc[k])} e devia ser ${JSON.stringify(v)}`).join(' · '),
    );
    medidas[`manifesto_${m.lang}`] = doc;

    const declarados = Array.isArray(doc.icons) ? doc.icons : [];
    const queixas = [];
    for (const esperadoIcone of ICONES) {
      const declarado = declarados.find((i) => i?.src === esperadoIcone.src);
      if (!declarado) {
        queixas.push(`não declara "${esperadoIcone.src}"`);
        continue;
      }
      if (declarado.sizes !== esperadoIcone.sizes) {
        queixas.push(`"${esperadoIcone.src}" declara sizes ${declarado.sizes}`);
      }
      if (declarado.purpose !== esperadoIcone.purpose) {
        queixas.push(`"${esperadoIcone.src}" declara purpose ${declarado.purpose}`);
      }
      const imagem = pixeisDoDist(esperadoIcone.src);
      if (imagem.erro) {
        queixas.push(`"${esperadoIcone.src}" não é um PNG legível (${imagem.erro})`);
        continue;
      }
      if (imagem.largura !== esperadoIcone.px || imagem.altura !== esperadoIcone.px) {
        queixas.push(
          `"${esperadoIcone.src}" tem ${imagem.largura}×${imagem.altura} na cabeça do PNG e ` +
            `declara ${esperadoIcone.sizes}`,
        );
      }
    }
    if (declarados.length !== ICONES.length) {
      queixas.push(`declara ${declarados.length} ícones e a casa tem ${ICONES.length}`);
    }
    conta(
      `A2·${m.lang} · cada ícone declarado existe com o tamanho que a cabeça do PNG diz`,
      queixas.length === 0,
      queixas.length === 0
        ? ICONES.map((i) => `${i.src} ${i.px}×${i.px} (${i.purpose})`).join(' · ')
        : queixas.join(' · '),
    );
  }
}

/**
 * A3 · a zona segura do `maskable`, medida nos píxeis.
 *
 * O campo é a cor do canto (0,0), e o sinal é todo o píxel que difere dela em
 * mais do que um limiar. O limiar existe por causa do suavizado: um píxel a um
 * ou dois níveis do campo é o bordo da compressão e não é tinta. Oito níveis em
 * 255 é a mesma margem que a régua do «e» usa para separar tinta de campo, e
 * está longe de qualquer par de cores da casa, que medem 16,39:1.
 */
function mediuAZonaSegura() {
  const caminho = '/icon-512-maskable.png';
  const imagem = pixeisDoDist(caminho);
  if (imagem.erro) {
    conta('A3 · toda a tinta do maskable dentro do círculo seguro', false, `não legível: ${imagem.erro}`);
    return;
  }
  const { largura, altura, rgba } = imagem;
  const campo = [rgba[0], rgba[1], rgba[2]];
  const centro = { x: largura / 2, y: altura / 2 };
  const raio = largura * RAIO_SEGURO;
  let maior = 0;
  let fora = 0;
  let pontoMaisLonge = null;
  let doSinal = 0;
  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      const o = (y * largura + x) * 4;
      const diferenca = Math.max(
        Math.abs(rgba[o] - campo[0]),
        Math.abs(rgba[o + 1] - campo[1]),
        Math.abs(rgba[o + 2] - campo[2]),
      );
      if (diferenca <= 8) continue;
      doSinal++;
      /* O canto do PÍXEL mais afastado do centro, e não o centro dele: um píxel
         é um quadrado de lado 1, e a tinta dele chega ao canto. Medir pelo
         centro daria meio píxel de folga que não existe. */
      const dx = Math.max(Math.abs(x - centro.x), Math.abs(x + 1 - centro.x));
      const dy = Math.max(Math.abs(y - centro.y), Math.abs(y + 1 - centro.y));
      const d = Math.hypot(dx, dy);
      if (d > maior) {
        maior = d;
        pontoMaisLonge = { x, y };
      }
      if (d > raio) fora++;
    }
  }
  medidas.zona_segura = {
    ficheiro: caminho,
    lado: largura,
    campo: `#${campo.map((c) => c.toString(16).padStart(2, '0')).join('')}`,
    raio_seguro: +raio.toFixed(2),
    distancia_maxima: +maior.toFixed(2),
    folga: +(raio - maior).toFixed(2),
    pixeis_de_sinal: doSinal,
    pixeis_fora: fora,
    ponto_mais_longe: pontoMaisLonge,
  };
  conta(
    'A3 · toda a tinta do maskable dentro do círculo seguro',
    fora === 0 && doSinal > 0,
    `${doSinal} píxeis de sinal · o mais longe a ${maior.toFixed(1)}px do centro ` +
      `(${pontoMaisLonge ? `${pontoMaisLonge.x},${pontoMaisLonge.y}` : '—'}) · ` +
      `círculo seguro ${raio.toFixed(1)}px (40 % de ${largura}) · ` +
      `folga ${(raio - maior).toFixed(1)}px · ${fora} píxeis fora`,
  );
}

/** A4 · o ícone do iPhone é opaco e mede 180. */
function mediuOIconeDoIPhone() {
  const caminho = '/apple-touch-icon.png';
  const imagem = pixeisDoDist(caminho);
  if (imagem.erro) {
    conta('A4 · o apple-touch-icon é opaco e mede 180', false, `não legível: ${imagem.erro}`);
    return;
  }
  let transparentes = 0;
  let minimo = 255;
  for (let i = 3; i < imagem.rgba.length; i += 4) {
    if (imagem.rgba[i] !== 255) transparentes++;
    if (imagem.rgba[i] < minimo) minimo = imagem.rgba[i];
  }
  const medida = imagem.largura === 180 && imagem.altura === 180;
  /* A MANCHA DA CELA: quantos píxeis da cela NÃO são o campo. É o que separa um
     ícone que segura o seu lugar numa grelha de ícones de um que desaparece
     nela, e o 180 é o tamanho a que isso se vê (NOTAS §6 quinquies). O limiar
     de 8 níveis é o mesmo da célula A3.

     A BANDA de direção (19,8 a 29,9 %) sai só impressa, porque é uma decisão
     dele. O CHÃO entra na condição, porque não é uma decisão de ninguém: é a
     área que as barras do desenho ocupam, somada dos `<rect>` do próprio
     ficheiro do diretor, menos o que o suavizado pode tirar. Sem ele, esta
     célula dava verde a um ícone opaco todo em campo, com a mancha a zero. */
  const campo = [imagem.rgba[0], imagem.rgba[1], imagem.rgba[2]];
  let doSinal = 0;
  for (let i = 0; i < imagem.rgba.length; i += 4) {
    const diferenca = Math.max(
      Math.abs(imagem.rgba[i] - campo[0]),
      Math.abs(imagem.rgba[i + 1] - campo[1]),
      Math.abs(imagem.rgba[i + 2] - campo[2]),
    );
    if (diferenca > 8) doSinal++;
  }
  const pixeis = imagem.largura * imagem.altura;
  const mancha = (100 * doSinal) / pixeis;
  const doDesenho = manchaDoDesenho();
  const chao = doDesenho - MARGEM_DO_SUAVIZADO;
  medidas.apple_touch_icon = {
    largura: imagem.largura,
    altura: imagem.altura,
    pixeis,
    pixeis_com_alfa_abaixo_de_255: transparentes,
    alfa_minimo: minimo,
    campo: `#${campo.map((c) => c.toString(16).padStart(2, '0')).join('')}`,
    pixeis_de_sinal: doSinal,
    mancha_por_cento: +mancha.toFixed(2),
    area_do_desenho_por_cento: +doDesenho.toFixed(4),
    margem_do_suavizado: MARGEM_DO_SUAVIZADO,
    chao_por_cento: +chao.toFixed(4),
    acima_do_chao: +(mancha - chao).toFixed(2),
  };
  conta(
    'A4 · o apple-touch-icon é opaco, mede 180 e pinta a marca inteira',
    medida && transparentes === 0 && mancha >= chao,
    `${imagem.largura}×${imagem.altura} · ${pixeis} píxeis · ` +
      `alfa mínimo ${minimo} · ${transparentes} abaixo de 255 · ` +
      `mancha ${doSinal} px, ${mancha.toFixed(2)} % da cela · ` +
      `chão ${chao.toFixed(2)} % (área do desenho ${doDesenho.toFixed(2)} % ` +
      `menos ${MARGEM_DO_SUAVIZADO} de suavizado), ${(mancha - chao).toFixed(2)} pontos acima · ` +
      `banda de direção 19,8 a 29,9 %, só impressa`,
  );
}

/** A5 · os dois favicons: o ICO com os dois tamanhos, o SVG com o sinal e a regra. */
function mediuOsFavicons() {
  const ico = leIco(bytesDoDist('/favicon.ico'));
  if (ico.erro) {
    conta('A5a · o favicon.ico traz os dois tamanhos', false, `não legível: ${ico.erro}`);
  } else {
    const tamanhos = ico.imagens.map((i) => `${i.largura}×${i.altura}`);
    const tem32 = ico.imagens.some((i) => i.largura === 32 && i.altura === 32);
    const tem16 = ico.imagens.some((i) => i.largura === 16 && i.altura === 16);
    const cabemTodas = ico.imagens.every((i) => i.cabe);
    medidas.favicon_ico = ico.imagens;
    conta(
      'A5a · o favicon.ico traz os dois tamanhos',
      tem32 && tem16 && ico.imagens.length === 2 && cabemTodas,
      `${ico.imagens.length} imagem(ns): ${tamanhos.join(' · ')} · ` +
        `${ico.imagens.map((i) => `${i.bits} bits/px, ${i.tamanho}B`).join(' · ')} · ` +
        `todas cabem no ficheiro: ${cabemTodas}`,
    );
  }

  const svg = textoDoDist('/favicon.svg');
  if (svg === null) {
    conta(
      'A5b · o favicon.svg são as três barras do diretor e mais nada, com a regra do escuro',
      false,
      'não foi construído',
    );
    return;
  }
  /* TUDO O QUE DESENHA, e não só o que se espera encontrar.
     A conferência antiga recolhia `<path class="…" d="…"/>` e contava esses: um
     `<circle>` a mais, um `<path>` sem classe, um `<image>` ou um `<use>`
     passavam ao lado dela, e o favicon rendia outra coisa com as três barras
     certas lá dentro. Agora contam-se os ELEMENTOS DE DESENHO todos, e a célula
     exige que sejam exactamente os três que compara. Os comentários saem antes
     da contagem, para que uma palavra dentro de um comentário não conte como
     desenho. */
  const semComentarios = svg.replace(/<!--[\s\S]*?-->/g, '');
  const elementos = [
    ...semComentarios.matchAll(
      /<(path|rect|circle|ellipse|polygon|polyline|line|image|use|text)\b/g,
    ),
  ].map((m) => m[1]);
  const caminhos = [...svg.matchAll(/<path class="([a-z-]+)" d="([^"]+)"\s*\/>/g)].map((m) => ({
    classe: m[1],
    d: m[2],
  }));
  const temRegra = /@media\s*\(prefers-color-scheme:\s*dark\)/.test(svg);
  const temCampo = /class="campo"/.test(svg) || /<rect\b/.test(svg);

  const daFonte = barrasDaMarca(path.join(MARCA_K, 'favicon.svg'));
  const doEscuro = barrasDaMarca(path.join(MARCA_K, 'marca-cheia-escuro.svg'));

  /* As duas classes, pela ordem em que a COR aparece e não pela posição da
     barra: as duas linhas de registo partilham uma regra, a do valor tem a
     dela. É a ordem que o exportador usa, escrita aqui outra vez. */
  const CLASSES = ['tinta', 'valor'];
  const ordem = [];
  for (const b of daFonte) if (!ordem.includes(b.cor)) ordem.push(b.cor);
  const classeDa = (b) => CLASSES[ordem.indexOf(b.cor)];

  /* As cores declaradas: as claras antes da regra do escuro, as escuras dentro
     dela. O corte é o índice do `@media`, que é onde uma acaba e a outra
     começa. */
  const iEscuro = svg.indexOf('@media');
  const iFimDoEstilo = svg.indexOf('</style>');
  const noClaro = iEscuro > 0 ? svg.slice(0, iEscuro) : svg;
  const noEscuro = iEscuro > 0 && iFimDoEstilo > iEscuro ? svg.slice(iEscuro, iFimDoEstilo) : '';
  const corDe = (texto, classe) =>
    ((new RegExp(`\\.${classe}\\s*\\{\\s*fill:\\s*(#[0-9A-Fa-f]{6})`).exec(texto) ?? [])[1] ?? '')
      .toUpperCase() || null;

  const asFormas =
    daFonte.length === 3 &&
    caminhos.length === daFonte.length &&
    caminhos.every(
      (c, i) => c.d === caminhoDaBarra(daFonte[i]) && c.classe === classeDa(daFonte[i]),
    );
  /* E nada mais desenha: os elementos de desenho do ficheiro são exactamente os
     três caminhos que a linha de cima comparou. */
  const soAsBarras = elementos.length === daFonte.length && elementos.every((n) => n === 'path');
  const aPaleta =
    ordem.length === 2 &&
    doEscuro.length === daFonte.length &&
    daFonte.every(
      (b, i) =>
        b.x === doEscuro[i].x &&
        b.y === doEscuro[i].y &&
        b.largura === doEscuro[i].largura &&
        b.altura === doEscuro[i].altura,
    ) &&
    ordem.every((cor, i) => corDe(noClaro, CLASSES[i]) === cor) &&
    daFonte.every((b, i) => corDe(noEscuro, classeDa(b)) === doEscuro[i].cor);

  medidas.favicon_svg = {
    elementos_de_desenho: elementos,
    caminhos: caminhos.length,
    regra_do_escuro: temRegra,
    campo: temCampo,
    fonte: 'design/marca/direcoes-k/favicon.svg',
    claro: ordem,
    escuro: [...new Set(doEscuro.map((b) => b.cor))],
    so_as_barras: soAsBarras,
    formas_iguais: asFormas,
    paleta_igual: aPaleta,
  };
  conta(
    'A5b · o favicon.svg são as três barras do diretor e mais nada, com a regra do escuro',
    soAsBarras && caminhos.length === 3 && temRegra && !temCampo && asFormas && aPaleta,
    `${elementos.length} elemento(s) de desenho (${elementos.join(', ') || 'nenhum'}) · ` +
      `prefers-color-scheme: ${temRegra} · campo: ${temCampo} · ` +
      `iguais às barras de direcoes-k/favicon.svg: ${asFormas} · ` +
      `paleta ${ordem.join(' e ')} → ${[...new Set(doEscuro.map((b) => b.cor))].join(' e ')} ` +
      `(de marca-cheia-escuro.svg): ${aPaleta}`,
  );
}

/**
 * A6 e A10 · as ligações na cabeça de TODAS as rotas construídas, e as três
 * proibições.
 *
 * Lê o HTML do disco (com o estrago de HTML pelo caminho) e procura com
 * expressões, que é a segunda implementação de uma coisa que o portão também
 * confere: quem quiser saber se a segunda concorda com a primeira tem de as ter
 * escritas em sítios diferentes.
 */
function mediuAsCabecas() {
  const todas = rotasConstruidas();
  /**
   * OS DOCUMENTOS ALOJADOS FICAM DE FORA, E NÃO É UMA EXCEÇÃO ABERTA A ESTA
   * RÉGUA: é a regra que a casa já tem, escrita no portão de HTML («os
   * documentos de estudo estão fora, como sempre: são obra alojada intacta,
   * conferida carácter a carácter contra a origem»). Não passam pelo
   * `Base.astro`, não têm cabeçalho da casa nem canónico, e pôr-lhes uma
   * ligação na cabeça mudava os bytes de um ficheiro que o `check:documentos`
   * compara com o resumo do original.
   *
   * E a exclusão é MEDIDA, em vez de ser uma subtração: conta-se quantos são,
   * confere-se que nenhum deles traz nenhuma das ligações, e o número sai na
   * prova. Uma lista que encolhe em silêncio é o que uma exceção faz.
   */
  const eAlojado = (r) => /\/(documento|document)\/index\.html$/.test(r);
  const alojadas = todas.filter(eAlojado);
  const rotas = todas.filter((r) => !eAlojado(r));
  const alojadasComLigacao = alojadas.filter((r) => {
    const html = textoDoDist(r);
    return html !== null && /rel="manifest"|apple-touch-icon|favicon\.(ico|svg)/.test(html);
  });
  const faltas = { manifesto: [], edicao: [], ico: [], svg: [], apple: [], cor: [], titulo: [] };
  const proibidas = { capaz: [], sw: [], prompt: [] };
  for (const rota of rotas) {
    const html = textoDoDist(rota);
    if (html === null) continue;
    const cabeca = html.slice(0, html.indexOf('</head>') + 7);
    const inglesa = rota === '/en.html' || rota.startsWith('/en/');
    const esperado = inglesa ? '/en/manifest.webmanifest' : '/manifest.webmanifest';
    const manifesto = /<link[^>]*\brel="manifest"[^>]*\bhref="([^"]+)"/.exec(cabeca);
    if (!manifesto) faltas.manifesto.push(rota);
    else if (manifesto[1] !== esperado) faltas.edicao.push(`${rota} → ${manifesto[1]}`);
    if (!/<link[^>]*\brel="icon"[^>]*\bhref="\/favicon\.ico"[^>]*\bsizes="32x32"/.test(cabeca)) {
      faltas.ico.push(rota);
    }
    if (!/<link[^>]*\btype="image\/svg\+xml"[^>]*\bhref="\/favicon\.svg"/.test(cabeca)) {
      faltas.svg.push(rota);
    }
    if (!/<link[^>]*\brel="apple-touch-icon"[^>]*\bhref="\/apple-touch-icon\.png"/.test(cabeca)) {
      faltas.apple.push(rota);
    }
    const cores = [...cabeca.matchAll(/<meta[^>]*\bname="theme-color"[^>]*>/g)];
    if (cores.length !== 1 || !cores[0][0].includes(`content="${PAPEL_CLARO}"`)) {
      faltas.cor.push(`${rota} (${cores.length})`);
    }
    if (!/<meta[^>]*\bname="apple-mobile-web-app-title"[^>]*\bcontent="O Estado"/.test(cabeca)) {
      faltas.titulo.push(rota);
    }
    if (/apple-mobile-web-app-capable/.test(html)) proibidas.capaz.push(rota);
    if (/serviceWorker/.test(html)) proibidas.sw.push(rota);
    if (/beforeinstallprompt/.test(html)) proibidas.prompt.push(rota);
  }
  const total = Object.values(faltas).reduce((a, b) => a + b.length, 0);
  medidas.cabecas = {
    rotas_da_casa: rotas.length,
    documentos_alojados: alojadas.length,
    alojados_com_ligacao: alojadasComLigacao.length,
    faltas: Object.fromEntries(Object.entries(faltas).map(([k, v]) => [k, v.length])),
  };
  conta(
    'A6 · as cinco ligações na cabeça de todas as rotas construídas',
    total === 0 && alojadasComLigacao.length === 0,
    total === 0 && alojadasComLigacao.length === 0
      ? `${rotas.length} rotas da casa · manifesto da edição certa, favicon.ico (32x32), ` +
        `favicon.svg, apple-touch-icon, uma theme-color "${PAPEL_CLARO}", ` +
        `apple-mobile-web-app-title "O Estado" · ` +
        `${alojadas.length} documentos alojados fora da conta, nenhum tocado`
      : [
          ...Object.entries(faltas)
            .filter(([, v]) => v.length)
            .map(([k, v]) => `${k}: ${v.length} (ex.: ${v[0]})`),
          ...(alojadasComLigacao.length
            ? [`documentos alojados com ligação: ${alojadasComLigacao.length} (ex.: ${alojadasComLigacao[0]})`]
            : []),
        ].join(' · '),
  );

  /* AS PROIBIÇÕES VALEM TAMBÉM PARA OS DOCUMENTOS ALOJADOS, e a diferença é
     deliberada: as LIGAÇÕES não lhes tocam porque são obra de outrem conferida
     byte a byte, mas «este sítio não regista um service worker» é uma afirmação
     sobre tudo o que ele serve. Se um documento alojado trouxesse um, o leitor
     tinha um service worker deste domínio na mesma. */
  for (const rota of alojadas) {
    const html = textoDoDist(rota);
    if (html === null) continue;
    if (/apple-mobile-web-app-capable/.test(html)) proibidas.capaz.push(rota);
    if (/serviceWorker/.test(html)) proibidas.sw.push(rota);
    if (/beforeinstallprompt/.test(html)) proibidas.prompt.push(rota);
  }

  /* O `serviceWorker` e o `beforeinstallprompt` procuram-se também nos ficheiros
     de JavaScript servidos, que é onde eles viveriam se alguém os pusesse. */
  const jsDir = path.join(DIST, 'js');
  const jsFicheiros = fs.existsSync(jsDir)
    ? fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'))
    : [];
  for (const f of jsFicheiros) {
    const cru = fs.readFileSync(path.join(jsDir, f), 'utf8');
    if (/serviceWorker/.test(cru)) proibidas.sw.push(`js/${f}`);
    if (/beforeinstallprompt/.test(cru)) proibidas.prompt.push(`js/${f}`);
  }
  const totalProibidas = Object.values(proibidas).reduce((a, b) => a + b.length, 0);
  medidas.proibidas = Object.fromEntries(Object.entries(proibidas).map(([k, v]) => [k, v.length]));
  conta(
    'A10 · nada de service worker, de pedido de instalação, nem da etiqueta obsoleta',
    totalProibidas === 0,
    totalProibidas === 0
      ? `${todas.length} páginas (as da casa e as alojadas) e ${jsFicheiros.length} ficheiros de ` +
        `JavaScript varridos`
      : Object.entries(proibidas)
          .filter(([, v]) => v.length)
          .map(([k, v]) => `${k}: ${v.length} (ex.: ${v[0]})`)
          .join(' · '),
  );
}

/**
 * A7 · o cabeçalho é o nome, sem sinal, numa linha (diretor, 29.08.2026).
 *
 * O sinal ao lado do nome saiu do cabeçalho a 29.08.2026 (§1.79). A célula
 * confirma que não voltou (nenhum `.wordmark-e` na página) e que a marca
 * continua numa linha só, em cada largura e nas quatro rotas.
 */
async function mediuOCabecalho(largura) {
  for (const { nome, rota, forma } of ROTAS_DO_CABECALHO) {
    const ctx = await nav.newContext({ viewport: { width: largura, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(() => {
      const cabeca = document.querySelector('header');
      const marca = document.querySelector('.wordmark');
      if (!cabeca || !marca) return { erro: 'não há header ou .wordmark' };
      const entrelinha = parseFloat(getComputedStyle(marca).lineHeight);
      return {
        sinal: Boolean(document.querySelector('.wordmark-e')),
        linhas: Math.round(marca.getBoundingClientRect().height / entrelinha),
        cabeca: cabeca.getBoundingClientRect().height,
      };
    });
    await ctx.close();
    if (m.erro) {
      conta(`A7·${largura} ${nome} · o cabeçalho é o nome, sem sinal, numa linha`, false, m.erro);
      continue;
    }
    conta(
      `A7·${largura} ${nome} · o cabeçalho é o nome, sem sinal, numa linha`,
      !m.sinal && m.linhas === 1,
      `sinal ${m.sinal ? 'presente' : 'ausente'} · marca em ${m.linhas} linha(s) · ` +
        `cabeçalho ${forma}, ${m.cabeca.toFixed(2)}px`,
    );
  }
}


/**
 * A8 · o exportador põe a medida, e pára quando não a pode pôr.
 *
 * As duas metades estão na mesma célula porque são a mesma afirmação: a medida
 * entra, ou o exportador pára. A segunda metade faz a cópia mexida AQUI, em
 * memória; `design/marca/direcoes-k/` é obra do diretor e não se toca.
 */
function mediuOExportador() {
  const ficheiro = path.join(MARCA_K, 'favicon.svg');
  const fonte = textoDaFonte(ficheiro);
  const queixas = [];

  let pagina = null;
  try {
    pagina = paginaDoSvg(fonte, 180);
  } catch (e) {
    queixas.push(`parou com o desenho como ele está: ${e.message.split('.')[0]}`);
  }
  const comMedida = pagina !== null && /<svg width="180" height="180"/.test(pagina);
  if (pagina !== null && !comMedida) {
    queixas.push('a página saiu sem a medida no <svg, e o PNG sairia do tamanho da janela');
  }

  let parou = false;
  try {
    paginaDoSvg(fonte.replace('<svg ', '<svg\n  '), 180);
  } catch {
    parou = true;
  }
  if (!parou) {
    queixas.push(
      'não parou com um «<svg» seguido de quebra de linha: um replace que não encontra o ' +
        'literal devolve o texto intacto, e a página ficava sem medida',
    );
  }

  medidas.exportador = {
    ficheiro: path.relative(RAIZ, ficheiro),
    pagina_com_medida: comMedida,
    para_sem_o_literal: parou,
  };
  conta(
    'A8 · o exportador põe a medida, e pára quando não a pode pôr',
    queixas.length === 0,
    queixas.length === 0
      ? `paginaDoSvg() sobre ${path.basename(ficheiro)}: <svg width="180" height="180"> · ` +
        'com «<svg» seguido de quebra de linha, pára'
      : queixas.join(' · '),
  );
}

/* ================================================================ os estragos */

/**
 * OS ESTRAGOS PLANTADOS (regra 14)
 *
 * Cada um é a coisa que uma célula existe para apanhar, posto no caminho entre o
 * ficheiro e quem o lê. A régua volta a correr as células que ele toca e exige
 * que fiquem vermelhas.
 */
const PLANTAS = [
  {
    nome: 'um píxel de sinal fora do círculo seguro do maskable',
    celulas: ['A3'],
    /* O sítio: o canto superior esquerdo, que num círculo inscrito está sempre
       fora. A cor é a do sinal, lida do próprio ficheiro no meio do «e». */
    pixeis: (caminho, imagem) => {
      if (caminho !== '/icon-512-maskable.png') return imagem;
      const copia = { ...imagem, rgba: Buffer.from(imagem.rgba) };
      const meio = (Math.floor(imagem.altura / 2) * imagem.largura + Math.floor(imagem.largura / 2)) * 4;
      const o = (10 * imagem.largura + 10) * 4;
      for (let k = 0; k < 4; k++) copia.rgba[o + k] = imagem.rgba[meio + k] ^ 0xff;
      return copia;
    },
  },
  {
    nome: 'um píxel transparente no canto do apple-touch-icon',
    celulas: ['A4'],
    pixeis: (caminho, imagem) => {
      if (caminho !== '/apple-touch-icon.png') return imagem;
      const copia = { ...imagem, rgba: Buffer.from(imagem.rgba) };
      copia.rgba[3] = 0;
      return copia;
    },
  },
  {
    nome: 'o icon-512.png com os bytes do de 192 lá dentro',
    celulas: ['A2'],
    bytes: (caminho, buf) =>
      caminho === '/icon-512.png'
        ? fs.readFileSync(path.join(DIST, 'icon-192.png'))
        : buf,
  },
  {
    nome: 'o `display` do manifesto português trocado por `browser`',
    celulas: ['A1·pt'],
    bytes: (caminho, buf) =>
      caminho === '/manifest.webmanifest'
        ? Buffer.from(buf.toString('utf8').replace('"standalone"', '"browser"'))
        : buf,
  },
  {
    nome: 'o manifesto de uma página inglesa trocado pelo português',
    celulas: ['A6'],
    html: (html, rota) =>
      rota.startsWith('/en/')
        ? html.replace('href="/en/manifest.webmanifest"', 'href="/manifest.webmanifest"')
        : html,
  },
  {
    nome: 'a etiqueta obsoleta `apple-mobile-web-app-capable` de volta',
    celulas: ['A10'],
    html: (html) => html.replace('</head>', '<meta name="apple-mobile-web-app-capable" content="yes"></head>'),
  },
  {
    nome: 'o favicon.ico com uma imagem só no diretório',
    celulas: ['A5a'],
    bytes: (caminho, buf) => {
      if (caminho !== '/favicon.ico') return buf;
      const copia = Buffer.from(buf);
      copia.writeUInt16LE(1, 4);
      return copia;
    },
  },
  {
    nome: 'a regra do esquema escuro retirada do favicon.svg',
    celulas: ['A5b'],
    bytes: (caminho, buf) =>
      caminho === '/favicon.svg'
        ? Buffer.from(buf.toString('utf8').replace(/@media[^}]+\}[^}]*\}/, ''))
        : buf,
  },
  {
    /* Um píxel de deslocação numa barra. É o estrago que a comparação carácter
       a carácter existe para apanhar, e nasceu com ela: sem esta planta, «os
       caminhos são os do diretor» era uma frase que ninguém tinha visto falhar.
       A mudança faz-se sobre o NÚMERO que lá está, e não sobre um número
       escrito aqui, para que a planta continue a plantar se a marca mudar. */
    nome: 'uma coordenada mudada num caminho do favicon.svg',
    celulas: ['A5b'],
    bytes: (caminho, buf) =>
      caminho === '/favicon.svg'
        ? Buffer.from(buf.toString('utf8').replace(/d="M(\d+) /, (_, n) => `d="M${Number(n) + 1} `))
        : buf,
  },
  {
    /* Um ícone opaco, do tamanho certo, e todo em campo. Passava as duas
       condições antigas da A4 (mede 180, nenhum píxel translúcido) e imprimia
       0 % de mancha sem que nada ficasse vermelho. É o estrago que o chão da
       mancha existe para apanhar. */
    nome: 'o apple-touch-icon opaco, do tamanho certo, e sem marca nenhuma',
    celulas: ['A4'],
    pixeis: (caminho, imagem) =>
      caminho === '/apple-touch-icon.png'
        ? { ...imagem, rgba: Buffer.alloc(imagem.rgba.length, 0xff) }
        : imagem,
  },
  {
    /* Um elemento a mais, com as três barras intactas ao lado dele. A
       comparação carácter a carácter continua a dar certo; o que apanha isto é
       a contagem de tudo o que desenha. */
    nome: 'um <circle> a mais no favicon.svg, ao lado das três barras',
    celulas: ['A5b'],
    bytes: (caminho, buf) =>
      caminho === '/favicon.svg'
        ? Buffer.from(
            buf.toString('utf8').replace('</svg>', '  <circle cx="256" cy="256" r="20"/>\n</svg>'),
          )
        : buf,
  },
  {
    /* O desenho de origem guardado com «<svg» seguido de quebra de linha, que é
       como muitos editores o escrevem. NUMA CÓPIA EM MEMÓRIA: o ficheiro do
       diretor não se toca, nem para plantar um estrago. */
    nome: 'um <svg seguido de quebra de linha no desenho de origem',
    celulas: ['A8'],
    fonte: (ficheiro, texto) =>
      ficheiro.endsWith('favicon.svg') ? texto.replace('<svg ', '<svg\n  ') : texto,
  },
  {
    /* A cor do valor trocada pela da tinta na regra do escuro: o cobalto claro
       do diretor desaparece e a barra do meio passa a papel. É um favicon que
       continua a ler-se e que já não é a marca. */
    nome: 'a cor do valor trocada na regra do escuro do favicon.svg',
    celulas: ['A5b'],
    bytes: (caminho, buf) => {
      if (caminho !== '/favicon.svg') return buf;
      const texto = buf.toString('utf8');
      const i = texto.indexOf('@media');
      if (i < 0) return buf;
      return Buffer.from(
        texto.slice(0, i) +
          texto.slice(i).replace(/\.valor\s*\{\s*fill:\s*#[0-9A-Fa-f]{6}/, '.valor { fill: #ECEEEA'),
      );
    },
  },


];

/* =================================================================== a corrida */

async function corridaInteira() {
  mediuOsManifestos();
  mediuAZonaSegura();
  mediuOIconeDoIPhone();
  mediuOsFavicons();
  mediuAsCabecas();
  mediuOExportador();
  for (const largura of LARGURAS) await mediuOCabecalho(largura);
}

if (!VERMELHOS) {
  await corridaInteira();
  const falhadas = celulas.filter((c) => !c.passa);
  console.log('');
  for (const c of celulas) {
    console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}\n    ${cinza(c.prova)}`);
  }
  console.log(
    `\n  ${
      falhadas.length
        ? vermelho(`${celulas.length - falhadas.length} de ${celulas.length}`)
        : verde(`${celulas.length} de ${celulas.length}`)
    } célula(s)\n`,
  );
  if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
    fs.writeFileSync(path.resolve(RAIZ, FICHEIRO_JSON), JSON.stringify({ celulas, medidas }, null, 2));
  }
  await nav.close();
  servidor.close();
  process.exit(falhadas.length ? 1 : 0);
}

console.log('');
let todosVermelhos = true;
for (const planta of PLANTAS) {
  celulas = [];
  medidas = {};
  ESTRAGO = planta.html ?? null;
  ESTRAGO_BYTES = planta.bytes ?? null;
  ESTRAGO_PIXEIS = planta.pixeis ?? null;
  ESTRAGO_FONTE = planta.fonte ?? null;
  const toca = (prefixo) => planta.celulas.some((c) => c.startsWith(prefixo) || prefixo.startsWith(c));
  if (toca('A1') || toca('A2')) mediuOsManifestos();
  if (toca('A3')) mediuAZonaSegura();
  if (toca('A4')) mediuOIconeDoIPhone();
  if (toca('A5')) mediuOsFavicons();
  if (toca('A6') || toca('A10')) mediuAsCabecas();
  if (toca('A8')) mediuOExportador();
  /* O cabeçalho corre a UMA largura nas plantas, e não às sete: uma planta que
     muda a altura do sinal muda-a em todas, e sete corridas de navegador por
     planta seriam sete vezes o mesmo vermelho. */
  if (toca('A7')) await mediuOCabecalho(1280);
  const tocadas = celulas.filter((c) => planta.celulas.some((n) => c.nome.startsWith(n)));
  const apanhou = tocadas.some((c) => !c.passa);
  if (!apanhou) todosVermelhos = false;
  console.log(`  ${apanhou ? verde('vermelho ✓') : vermelho('NÃO APANHOU ✗')}  ${planta.nome}`);
  for (const c of tocadas.filter((x) => !x.passa)) console.log(cinza(`      ${c.nome} · ${c.prova}`));
}
ESTRAGO = null;
ESTRAGO_BYTES = null;
ESTRAGO_PIXEIS = null;
ESTRAGO_FONTE = null;
console.log('');
await nav.close();
servidor.close();
process.exit(todosVermelhos ? 0 : 1);
