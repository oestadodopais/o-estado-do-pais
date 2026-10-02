#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DOS NOMES AO LADO DO MAPA · o bloco de 29.08.2026
 * =============================================================================
 *
 * Uma célula por coisa que o brief manda medir, em Chromium sem cabeça sobre
 * `dist/`. NÃO é um portão: não entra no `npm run build` e não constrói nada.
 * Imprime uma linha por célula e sai com 0 quando todas passam e com 1 quando
 * alguma falha, como `tests/inicio/mapa-distritos.mjs`.
 *
 *   node tests/inicio/lista.mjs
 *   node tests/inicio/lista.mjs --json <ficheiro>
 *   node tests/inicio/lista.mjs --vermelhos
 *
 * ---------------------------------------------------------------------------
 * A LISTA MUDOU DE PÁGINA E DE FORMA, E A RÉGUA FOI ATRÁS DELA (bloco P4,
 * 02.10.2026)
 * ---------------------------------------------------------------------------
 * Desde o L2a (01.10.2026, §1.149 e §1.150) o mapa das 29 unidades vive em
 * «Lugares», e os nomes que ficavam ao lado dele na primeira página passaram a
 * uma gaveta, «Os distritos e as ilhas», fechada, que abre sem guião, com os 29
 * nomes em ligações simples, numa grelha. A régua rebentava na linha 560 a
 * procurar a cabeça da primeira página, e uma régua que rebenta mente por omissão
 * (§5 do brief P4, decisão 1). O que ela mede agora, nas duas edições de
 * «Lugares», com a gaveta aberta como o leitor a abre:
 *
 *   L1  · uma lista só, com as mesmas 29 unidades do desenho, e o mapa antes dos
 *         nomes no documento (a ordem em que se veem);
 *   L4  · nenhuma unidade sem nome à vista: a gaveta e os 29 nomes, às oito larguras;
 *   L5  · cada nome é um alvo com a altura que a folha da gaveta declara (44 px,
 *         `lugar.css`, `.lugares-lista a`), e nenhum par de alvos se interseta. A
 *         largura de 44 px era da rede em linha ao lado do mapa da primeira
 *         página (a Emenda 20c), onde os nomes ficavam encostados; na gaveta cada
 *         nome tem a sua célula da grelha, e o que protege o dedo de acertar no
 *         vizinho é a interseção, que continua medida;
 *   L10 · sem pontuação entre os nomes, nas duas gavetas.
 *
 * E SAEM, com a razão escrita no lugar delas, as que mediam a cabeça da primeira
 * página (a da Emenda 24, §1.84, com a emenda do alinhamento de 29.08.2026, que o
 * PP1 e o L2a deixaram sem objeto) ou o par entre um nome e a sua área: a L2 (a
 * legenda na banda da cabeça),
 * a L6 e a L7 (o rato ou o foco num nome a acender a área, e o contrário: a gaveta
 * de «Lugares» é uma lista de ligações sem par com o desenho, e o nome da área
 * apontada diz-se no lugar do nome do mapa, que a U2 de `mapa-unidades.mjs`
 * mede), a L9 (as duas formas da I101, em linha abaixo de 1 024 e em coluna
 * acima: a gaveta tem uma forma só), e a L11, a L12 e a L13 (o mapa contra a
 * manchete e a legenda, na grelha da cabeça). As plantas delas saíram com elas.
 * A colocação do mapa e das gavetas em «Lugares» é do L2a, e mede-se na célula
 * dele (`tests/inicio/mapa-primeiro.mjs`, no `check:navegacao`).
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * L1 · UMA LISTA SÓ, E É A DO MAPA. O brief escreve que a colocação na coluna
 * esquerda é da folha e não uma segunda rendição. Não basta contar 29: o
 * conjunto dos slugs da lista tem de ser, elemento a elemento, o conjunto dos
 * slugs das áreas do desenho. Uma lista com 29 nomes certos e um errado passava
 * numa contagem e não passa numa comparação de conjuntos.
 *
 * L2 · A COLOCAÇÃO, nas duas edições. A coluna das gavetas na banda da coluna
 * esquerda (a mesma abcissa e a mesma largura da cabeça), a começar por baixo da
 * manchete e da faixa e a começar antes do fim da coluna do instrumento: é isso,
 * e não uma ordem no documento, que a põe AO LADO do mapa e não por baixo dele.
 * Desde 01.09.2026 mede-se a GAVETA e não a lista, e a razão está na célula: com
 * a lista recolhida, os 29 nomes só têm caixa quando ela abre.
 *
 * L3 · RETIRADA a 16.09.2026. Media «a grelha não passa muito da coluna do
 * mapa», que é a relação que a cabeça de hoje não tem: a coluna esquerda leva a
 * busca, a porta do concelho e a legenda, e é 292 px mais alta do que a do mapa.
 * A razão inteira está no corpo da régua, no bloco «a relação que três células
 * mediam».
 *
 * L4 · NENHUMA UNIDADE SEM ALVO TOCÁVEL, que é o que a Emenda 20c protege. Em
 * cada largura, cada nome VISÍVEL, e não apenas presente no documento: a régua do
 * mapa (M1b e M2b) pergunta ao DOM, e um grupo escondido pela folha passaria por
 * ela. E o número de grupos é o número de parcelas que o desenho tem, para que
 * zero grupos não passe por «nenhum escondido».
 *
 * L5 · O ALVO DE CADA NOME, NAS DUAS DIMENSÕES. 44 px de altura E 44 px de
 * largura, e nenhum par de alvos que se intersete. A primeira forma desta folha
 * media 44 px de altura e 32 de largura em «Beja», e um alvo que é 44 num sentido
 * só é 44 no papel e menos no dedo. A interseção mede-se entre rectângulos, e não
 * por colunas de abcissa igual: dois alvos podem sobrepor-se sem partilharem a
 * abcissa. E não passa com uma ligação visível: exige as 29.
 *
 * L6 · O PAR DE ESTADO, NOS 29 PARES, NOS DOIS SENTIDOS E PELAS DUAS PORTAS.
 * Quatro células: o rato num nome contra a área daquela unidade; o rato numa área
 * contra o nome; o foco do teclado num nome contra a área; o foco do teclado numa
 * área contra o nome. Cada uma percorre as 29 e exige que a marca apareça na
 * unidade apontada e em nenhuma outra. O rato do lado do mapa vai ao PONTO
 * REPRESENTATIVO do artefacto e não ao centro da caixa: numa forma côncava o
 * centro da caixa cai fora da forma (I82), e o `:hover` não acenderia.
 *
 * L7 · A MARCA NÃO É SÓ COR, nas duas edições. Dos dois lados, o que muda entre o
 * repouso e a marca tem de incluir uma grandeza que não é cor.
 *
 * L8 · RETIRADA a 16.09.2026: os dois painéis saíram da primeira página com o
 * F1.10 e vivem em `/uniao-europeia`. A razão inteira está no corpo da régua.
 * O que ela media, enquanto os painéis estavam aqui: o nome de cada painel conta
 * o que está na página, e o algarismo tem de estar
 * dentro de um `data-prova` com a chave certa, e o número que ele mostra tem de
 * ser o número de leituras breves de cada uma das duas metades da área de
 * leitura, contadas no documento (`#painel [data-leituras="pdm"]` e
 * `#painel-social`). Eram as peças da grelha e as linhas da lista social, que
 * saíram da primeira página a 04.09.2026; a medida é a mesma e o seletor segue a
 * coisa que ele conta. Um número certo com a marca certa que não conta o que
 * está por baixo dele continua a ser um número errado. Nas duas edições.
 *
 * L9 · UMA FORMA DE CADA VEZ, ÀS SETE LARGURAS. A regra, depois da decisão do
 * lugar de direção sobre a I101: abaixo de 1024 a rede é em linha; a partir de
 * 1024 é a lista da coluna esquerda. Nenhuma largura mostra as duas.
 *
 * A REDE DEIXOU DE SE MOSTRAR SEMPRE (01.09.2026). A I101 tinha decidido que ela
 * se mostra a todas as larguras abaixo de 1024, porque era o único alvo de 44 px
 * das unidades do mapa; a afinação 1 do brief da forma dos domínios recolheu-a
 * numa gaveta fechada, e a Emenda 20c passa a estar protegida pelo `<summary>`,
 * que é um alvo de 44 px e abre sem guião. Esta régua abre a gaveta e mede a
 * rede como sempre a mediu; que a gaveta existe, vem fechada e abre sem guião é
 * `tests/inicio/faixa.mjs` (F10a e F10b). A forma lê-se em dois sítios que não
 * podem divergir: a `display` da `<ul>` (a folha) e o número de linhas que os 18
 * nomes do continente ocupam (o ecrã) — dezoito em fila dão menos de nove linhas,
 * duas colunas de nove dão exactamente nove.
 *
 * L10 · SEM PONTUAÇÃO ENTRE OS NOMES. Nenhum `::before` nem `::after` com
 * conteúdo em nenhum item nem em nenhuma ligação da lista, a nenhuma largura. Um
 * ponto de separação num item inquebrável fica pendurado no fim da linha, e o que
 * separa os nomes passa a ser o intervalo e o sublinhado que cada um já tem.
 *
 * ---------------------------------------------------------------------------
 * O QUE `--vermelhos` EXIGE DE CADA ESTRAGO
 * ---------------------------------------------------------------------------
 * Três coisas, e não uma. **Verde antes**: as células que o estrago nomeia
 * passam sem ele, porque uma célula que já estava vermelha não prova nada.
 * **O HTML mudou**: a transformação aplicada às páginas dá bytes diferentes,
 * porque um estrago que não muda nada nunca podia ser apanhado e um `replace`
 * que falha em silêncio é o modo mais comum de isso acontecer. **Vermelho
 * depois**: pelo menos uma das células nomeadas cai. Falhar qualquer das três é
 * vermelho do próprio corredor.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

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
  '.zip': 'application/zip',
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

/* O estrago plantado não toca em disco: é uma transformação do HTML no caminho
   entre o ficheiro e o navegador, como na régua do mapa. */
let ESTRAGO = null;

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
    const html = ESTRAGO(fs.readFileSync(ficheiro, 'utf8'), semQuery);
    res.writeHead(200, { 'content-type': tipo });
    return void res.end(html);
  }
  res.writeHead(200, { 'content-type': tipo });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

let celulas = [];
let medidas = {};
const conta = (nome, passa, prova) => celulas.push({ nome, passa: !!passa, prova: String(prova) });

const nav = await chromium.launch({ headless: true });

/* «LUGARES», NAS DUAS EDIÇÕES (bloco P4). A gaveta abre-se como o leitor a abre:
   um `<details>` fechado não desenha o que tem dentro, e as células que medem os
   nomes mediriam o nada. Que a gaveta existe, vem fechada e abre sem guião é a
   célula do L2a (`tests/inicio/mapa-primeiro.mjs`) e a U4 de `mapa-unidades.mjs`. */
const EDICOES = [
  { rota: '/lugares/', chave: 'pt', ficheiro: path.join('lugares', 'index.html') },
  { rota: '/en/places/', chave: 'en', ficheiro: path.join('en', 'places', 'index.html') },
];
async function pagina(rota, largura, abrir = false) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 900 } });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  if (abrir) await p.evaluate(() => { for (const g of document.querySelectorAll('[data-gaveta]')) g.open = true; });
  return p;
}

const ALVO = 44;
const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280, 1440];

/* As 29 unidades da Carta, lidas do artefacto: o desenho e a lista têm de ser estas. */
const PARES = JSON.parse(fs.readFileSync(path.join(RAIZ, 'mapa', 'pais.json'), 'utf8')).unidades.length;
const NOMES_DA_LISTA = PARES;

/** Tudo o que uma página diz sobre a gaveta dos nomes, a uma largura. */
const LEITURA = () => {
  const visivel = (el) => {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  };
  const cx = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: +b.x.toFixed(1), y: +(b.y + window.scrollY).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
  };
  const conteudoDe = (el, onde) => {
    const c = getComputedStyle(el, onde).content;
    return c === 'none' || c === 'normal' || c === '' ? null : c;
  };
  const gaveta = document.querySelector('[data-gaveta="distritos"]');
  const nomes = [...document.querySelectorAll('[data-lista-lugares="distritos"] a[href]')].map((a) => ({
    slug: (a.getAttribute('href') ?? '').replace(/^\/(?:en\/districts|distritos)\//, '').replace(/\/$/, ''),
    visivel: visivel(a),
    caixa: cx(a),
    destino: a.getAttribute('href'),
  }));
  const pontuacao = [];
  for (const el of document.querySelectorAll('[data-lista-lugares] li, [data-lista-lugares] a')) {
    for (const onde of ['::before', '::after']) {
      const c = conteudoDe(el, onde);
      if (c) pontuacao.push(`${el.tagName.toLowerCase()}${onde} = ${c}`);
    }
  }
  const areas = [...document.querySelectorAll('#mapa [data-areas] .uni')].map((el) => el.getAttribute('data-unidade'));
  const primeiroNome = document.querySelector('[data-lista-lugares="distritos"] a[href]');
  const primeiraArea = document.querySelector('#mapa a.uni-porta');
  const ordemDoDocumento =
    primeiroNome && primeiraArea
      ? primeiroNome.compareDocumentPosition(primeiraArea) & Node.DOCUMENT_POSITION_FOLLOWING
        ? 'nomes antes do mapa'
        : 'mapa antes dos nomes'
      : 'sem um dos dois';
  return { janela: window.innerWidth, gaveta: { aberta: gaveta?.open ?? null, visivel: visivel(gaveta) }, nomes, pontuacao, areas, ordemDoDocumento };
};

const intersecta = (a, b) =>
  a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5;

/* ===========================================================================
 * A CORRIDA
 * ===========================================================================
 * `soEstas` limita a corrida às células que um estrago nomeia. As células que
 * saíram (L2, L3, L6, L7, L8, L9, L11, L12 e L13) estão no cabeçalho, com a razão;
 * a L3 e a L8 saíram a 16.09.2026 e as outras no bloco P4.
 */
async function correTudo(soEstas) {
  const precisa = (c) => !soEstas || soEstas.includes(c);
  const daPagina = ['L1', 'L4', 'L5', 'L10'].filter(precisa);
  const lido = {};
  if (daPagina.length) {
    const larguras = new Set();
    for (const c of daPagina) {
      if (['L4', 'L5', 'L10'].includes(c)) for (const w of LARGURAS) larguras.add(w);
      if (c === 'L1') larguras.add(1280);
    }
    for (const e of EDICOES) {
      for (const w of [...larguras].sort((a, b) => a - b)) {
        const p = await pagina(e.rota, w, true);
        lido[`${e.chave}_${w}`] = await p.evaluate(LEITURA);
        await p.__ctx.close();
      }
    }
    medidas.larguras = lido;
  }

  /* --------------------------------------------------------------------- L1 */
  if (precisa('L1')) {
    for (const e of EDICOES) {
      const r = lido[`${e.chave}_1280`];
      const daLista = new Set(r.nomes.map((n) => n.slug));
      const doMapa = new Set(r.areas);
      const soNoMapa = [...doMapa].filter((s) => !daLista.has(s));
      const soNaLista = [...daLista].filter((s) => !doMapa.has(s));
      const destinos = new Set(r.nomes.map((n) => n.destino));
      conta(
        `L1·${e.chave} · uma lista só, com as mesmas 29 unidades do desenho, depois do mapa no documento`,
        r.nomes.length === NOMES_DA_LISTA &&
          daLista.size === NOMES_DA_LISTA &&
          doMapa.size === PARES &&
          soNoMapa.length === 0 &&
          soNaLista.length === 0 &&
          destinos.size === NOMES_DA_LISTA &&
          r.ordemDoDocumento === 'mapa antes dos nomes',
        `${r.nomes.length} ligações, ${daLista.size} slugs na gaveta e ${doMapa.size} no mapa, ${destinos.size} destinos distintos` +
          `${soNoMapa.length ? ` · no mapa e não na gaveta: ${soNoMapa.join(', ')}` : ''}` +
          `${soNaLista.length ? ` · na gaveta e não no mapa: ${soNaLista.join(', ')}` : ''}` +
          ` · ordem do documento: ${r.ordemDoDocumento}`,
      );
    }
  }

  /* --------------------------------------------------------------------- L4 */
  if (precisa('L4')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        const escondidos = r.nomes.filter((n) => !n.visivel);
        conta(
          `L4·${e.chave}·${w} · nenhuma unidade sem nome à vista: a gaveta aberta e os ${NOMES_DA_LISTA} nomes`,
          r.gaveta.visivel && r.gaveta.aberta === true && r.nomes.length === NOMES_DA_LISTA && escondidos.length === 0,
          `gaveta ${r.gaveta.visivel ? 'à vista' : 'fora da vista'} e ${r.gaveta.aberta ? 'aberta' : 'fechada'} · ${r.nomes.length} nome(s), ${escondidos.length} escondido(s)`,
        );
      }
    }
  }

  /* --------------------------------------------------------------------- L5 */
  if (precisa('L5')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        const vistos = r.nomes.filter((n) => n.visivel);
        const baixos = vistos.filter((n) => n.caixa.h < ALVO - 0.01);
        let colisoes = 0;
        for (let i = 0; i < vistos.length; i++) {
          for (let j = i + 1; j < vistos.length; j++) if (intersecta(vistos[i].caixa, vistos[j].caixa)) colisoes++;
        }
        const menorAlto = vistos.length ? Math.min(...vistos.map((n) => n.caixa.h)) : 0;
        conta(
          `L5·${e.chave}·${w} · cada nome é um alvo de ${ALVO} px de altura, e nenhum se interseta`,
          vistos.length === NOMES_DA_LISTA && baixos.length === 0 && colisoes === 0,
          `${vistos.length}/${NOMES_DA_LISTA} à vista · o mais baixo ${menorAlto.toFixed(1)} px · ${baixos.length} sob ${ALVO} de altura, ${colisoes} interseção(ões)`,
        );
      }
    }
  }

  /* -------------------------------------------------------------------- L10 */
  if (precisa('L10')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        conta(
          `L10·${e.chave}·${w} · sem pontuação entre os nomes: nenhum «::before» nem «::after» com conteúdo`,
          r.pontuacao.length === 0,
          r.pontuacao.length === 0 ? '0 pseudo-elementos com conteúdo nas duas gavetas' : `${r.pontuacao.length}: ${[...new Set(r.pontuacao)].join(' · ')}`,
        );
      }
    }
  }
}

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS
 * =========================================================================== */
const soEmLugares = (rota) => ['/lugares/', '/lugares', '/lugares/index.html', '/en/places/', '/en/places', '/en/places/index.html'].includes(rota);
const comFolha = (css) => (html, rota) => (soEmLugares(rota) ? html.replace('</head>', `<style>${css}</style></head>`) : html);

/** O fim de um bloco que abre com a etiqueta `etiqueta`, contando as que abrem e as que fecham. */
function fimDoBloco(texto, inicio, etiqueta) {
  let nivel = 0;
  const re = new RegExp(`<${etiqueta}\\b|</${etiqueta}>`, 'g');
  re.lastIndex = inicio;
  let m;
  while ((m = re.exec(texto))) {
    nivel += m[0] === `</${etiqueta}>` ? -1 : 1;
    if (nivel === 0) return m.index + etiqueta.length + 3;
  }
  return -1;
}

const PLANTAS = [
  {
    nome: 'uma ligação duplicada: o mesmo nome duas vezes na gaveta',
    celulas: ['L1'],
    estrago: (html, rota) => {
      if (!soEmLugares(rota)) return html;
      const m = html.match(/<li[^>]*><a href="[^"]*\/(?:distritos|districts)\/aveiro"[^>]*>[^<]*<\/a><\/li>/);
      return m ? html.replace(m[0], m[0] + m[0]) : html;
    },
  },
  {
    nome: 'a gaveta dos distritos e das ilhas antes do mapa no documento',
    celulas: ['L1'],
    estrago: (html, rota) => {
      if (!soEmLugares(rota)) return html;
      const i = html.indexOf('<section class="lugares-dobra" data-dobra-lugares="distritos"');
      const f = i < 0 ? -1 : fimDoBloco(html, i, 'section');
      if (f < 0) return html;
      const bloco = html.slice(i, f);
      const sem = html.slice(0, i) + html.slice(f);
      const j = sem.indexOf('<div class="lugares-mapa"');
      return j < 0 ? html : sem.slice(0, j) + bloco + sem.slice(j);
    },
  },
  {
    nome: 'a gaveta dos distritos e das ilhas escondida',
    celulas: ['L4'],
    estrago: comFolha('[data-gaveta="distritos"]{display:none !important}'),
  },
  {
    nome: 'um alvo com 40 px de altura',
    celulas: ['L5'],
    estrago: comFolha('.lugares-lista a{min-height:40px !important;height:40px !important}'),
  },
  {
    nome: 'dois nomes encavalitados (os alvos a intersetar-se)',
    celulas: ['L5'],
    estrago: comFolha('.lugares-lista{display:block !important}.lugares-lista li + li{margin-top:-20px !important}.lugares-lista a{display:flex !important}'),
  },
  {
    nome: 'um ponto de separação de volta entre os nomes',
    celulas: ['L10'],
    estrago: comFolha('.lugares-lista li:not(:last-child)::after{content:"·";color:#888}'),
  },
];

if (VERMELHOS) {
  console.log('');
  let falhou = false;
  const tocada = (c, planta) => planta.celulas.some((n) => c.nome.startsWith(n + '·') || c.nome.startsWith(n + ' ') || c.nome.startsWith(n));
  for (const planta of PLANTAS) {
    /* 1 · verde antes */
    ESTRAGO = null;
    celulas = [];
    medidas = {};
    await correTudo(planta.celulas);
    const antes = celulas.filter((c) => tocada(c, planta));
    const verdesAntes = antes.length > 0 && antes.every((c) => c.passa);

    /* 2 · a transformação muda o HTML */
    let mudou = false;
    for (const e of EDICOES) {
      const cru = fs.readFileSync(path.join(DIST, e.ficheiro), 'utf8');
      if (planta.estrago(cru, e.rota) !== cru) mudou = true;
    }

    /* 3 · vermelho depois */
    ESTRAGO = planta.estrago;
    celulas = [];
    medidas = {};
    await correTudo(planta.celulas);
    const depois = celulas.filter((c) => tocada(c, planta));
    const apanhou = depois.some((c) => !c.passa);

    const ok = verdesAntes && mudou && apanhou;
    if (!ok) falhou = true;
    console.log(
      `  ${ok ? verde('vermelho ✓') : vermelho('NÃO APANHOU ✗')}  ${planta.nome}` +
        cinza(`  [${antes.length} célula(s) · verde antes: ${verdesAntes} · o HTML mudou: ${mudou} · vermelho depois: ${apanhou}]`),
    );
    for (const c of depois.filter((c) => !c.passa).slice(0, 2)) console.log(cinza(`              ${c.nome} · ${c.prova}`));
    if (!verdesAntes) {
      for (const c of antes.filter((c) => !c.passa).slice(0, 2)) console.log(vermelho(`              já estava vermelha ANTES: ${c.nome} · ${c.prova}`));
    }
  }
  ESTRAGO = null;
  console.log('');
  await nav.close();
  servidor.close();
  process.exit(falhou ? 1 : 0);
}

await correTudo(null);
await nav.close();
servidor.close();

console.log('');
for (const c of celulas) {
  console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}`);
  console.log(cinza(`      ${c.prova}`));
}
const falhadas = celulas.filter((c) => !c.passa);
console.log('');
console.log(
  falhadas.length === 0
    ? verde(`  ${celulas.length} células, todas verdes.\n`)
    : vermelho(`  ${falhadas.length} de ${celulas.length} células vermelhas.\n`),
);

if (FICHEIRO_JSON) {
  fs.writeFileSync(path.resolve(RAIZ, String(FICHEIRO_JSON)), JSON.stringify({ celulas, medidas }, null, 2));
}
process.exit(falhadas.length === 0 ? 0 : 1);
