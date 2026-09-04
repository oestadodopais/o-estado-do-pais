#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DA FAIXA · o bloco «a cabeça nova como contentor», 01.09.2026
 * =============================================================================
 *
 * Uma célula por coisa que a ordem de construção e o brief mandam medir, em
 * Chromium sem cabeça sobre `dist/`. NÃO é um portão: não entra no `npm run
 * build` e não constrói nada. Imprime uma linha por célula e sai com 0 quando
 * todas passam e com 1 quando alguma falha, como `tests/inicio/lista.mjs`.
 *
 *   node tests/inicio/faixa.mjs
 *   node tests/inicio/faixa.mjs --json <ficheiro>
 *   node tests/inicio/faixa.mjs --vermelhos
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * F1 · A FAIXA DA CABEÇA É UMA LISTA NO DOCUMENTO, E OS SEUS CARTÕES SÃO AS
 * MEDIDAS DA PÁGINA. A afinação 2 do brief pede «uma lista no documento (`<ol>`
 * ou `<ul>`)» e a ordem pede que a faixa se encha do conteúdo de hoje. Não basta
 * contar: o conjunto dos ids dos cartões tem de ser, elemento a elemento, o
 * conjunto das medidas que a página rende por baixo (as peças do painel, as
 * linhas da lista social e, desde 04.09.2026, as leituras breves da primeira
 * página). Uma faixa com o número certo de cartões e um id errado passava numa
 * contagem e não passa numa comparação de conjuntos.
 *
 * A COMPARAÇÃO É SOBRE A FAIXA DA CABEÇA (F1.1b, 04.09.2026). A primeira página
 * passou a ter duas faixas — a da cabeça e a do domínio, na secção que entrou a
 * seguir ao mapa —, e as medidas de cabeça de um domínio NÃO têm leitura nesta
 * página: têm-na na página do domínio, e é para lá que os seus cartões levam.
 * Comparar o conjunto de todos os cartões da página com o das leituras dela
 * media a relação errada. As células que medem CADA cartão (F2, F3, F5, F7, F8)
 * continuam a ler todos: uma faixa nova não podia entrar sem régua.
 *
 * F2 · CADA CARTÃO TEM VALOR COM LINHA E SELO PARA ESSA LINHA. É a promessa da
 * casa vista dentro do cartão: o número está debaixo de `data-claim`, o selo é
 * uma `<a class="src-chip">` cujo `href` é a página daquela linha, e nenhum
 * algarismo do cartão está fora de `[data-claim]` ou de um motivo declarado
 * (`data-nonledger`). É esta célula que a planta «um cartão sem selo» e a planta
 * «um número sem linha» têm de fazer cair.
 *
 * F3 · O CARTÃO INTEIRO É ALVO, E O SELO GANHA O TOQUE. Duas exigências que
 * puxam para lados opostos (brief §4 e Emenda 2), e por isso medem-se juntas:
 *
 *   · a porta cobre o cartão INTEIRO, de cima a baixo e de lado a lado, com as
 *     quatro bordas a menos de 1 px das do cartão. A primeira construção deste
 *     bloco parava-a antes do pé para não tocar no selo, e a régua aceitava
 *     isso: o pé é um terço da altura do cartão a 390, e um terço do cartão que
 *     não abre nada é um alvo com um buraco;
 *   · a porta mede pelo menos 44 px nos dois sentidos abaixo de 1024 e 32 a
 *     partir de 1024, e nenhuma porta interseta a de outro cartão;
 *   · e o que a Emenda 2 protege mede-se onde ela o promete, no TOQUE: para cada
 *     selo do cartão, `document.elementFromPoint` no centro dele devolve o selo
 *     e não a porta, e um ponto do corpo devolve a porta. É a pergunta ao
 *     navegador, com o cartão trazido à vista, e não uma regra geométrica sobre
 *     quem está por cima de quem.
 *
 * A área efectiva é a mesma de `correcoes-a.mjs` (a caixa unida com a do
 * `::after` absoluto), para que os dois números se possam comparar.
 *
 * F4 · A FAIXA FUNCIONA SEM JAVASCRIPT. A página carrega-se com o guião
 * DESLIGADO e conta-se o mesmo número de cartões, todos com caixa; a faixa
 * continua a poder correr (`overflow-x` não é `visible`); e nenhum `<script>` da
 * página nomeia a faixa ou um cartão. Uma faixa que precisa de guião é a coisa
 * que a afinação 2 proíbe pelo nome.
 *
 * F5 · O ENCAIXE É DE CSS. `scroll-snap-type` com eixo x na lista e
 * `scroll-snap-align` em cada cartão, lidos do estilo computado. Sem isto a
 * faixa corre mas não encaixa, e o brief pede as duas coisas.
 *
 * F6 · O PRIMEIRO CARTÃO É VISÍVEL SEM GESTO, às sete larguras e nas duas
 * edições: a caixa começa em `scrollLeft` 0 e o primeiro cartão está INTEIRO
 * dentro da parte visível da faixa. E a faixa TEM de correr (`scrollWidth` maior
 * do que `clientWidth`), senão o encaixe é uma promessa sobre nada.
 *
 * F7 · O TECLADO CHEGA A CADA CARTÃO. Cada porta é focável pelo `Tab`, na ordem
 * do documento, e o destino de cada uma EXISTE. Desde o F1.2b (03.09.2026) há
 * duas formas de destino: a âncora da leitura daquela medida nesta página, e a
 * página do domínio a que a medida pertence, com a âncora da medida lá dentro. A
 * célula exige o que cada forma promete (o `id` nesta página; a página a
 * responder 200 e o `id` lá dentro). Uma porta que não abre nada é pior do que
 * nenhuma.
 *
 * F8 · OS DOIS CORPOS DO NÚMERO. O `font-size` computado do valor de um cartão a
 * 390 é menor do que a 1280, os dois vêm das duas fichas declaradas na folha, e
 * nenhum desce abaixo do corpo mínimo da casa para um número com selo, que é o
 * da lista social (19 px). É a regra do brief §4, medida em píxeis e não
 * afirmada.
 *
 * F9 · A ORDEM DA CABEÇA, ÀS SETE LARGURAS: a manchete, a faixa e o mapa, por
 * esta ordem no documento E no ecrã. Duas leituras que não podem divergir:
 * `compareDocumentPosition` para a árvore, e o topo de cada caixa para o ecrã.
 *
 * F10 · AS DUAS GAVETAS DO MAPA, FECHADAS, E QUE ABREM SEM GUIÃO. As duas
 * existem, nenhuma vem aberta, o `<summary>` de cada uma é um alvo de 44 px
 * abaixo de 1024, e, com o guião DESLIGADO, um toque no `<summary>` abre a
 * gaveta e põe os 29 nomes à vista. É o que a afinação 1 promete a quem não vê:
 * «um mapa sem lista não é navegável por quem não vê».
 *
 * F11 · O PRIMEIRO NÚMERO SELADO DE UMA MEDIDA A MENOS DE UM ECRÃ DA MANCHETE, a
 * 390 × 844. É a medida de aceitação do brief §4, e mede-se do FUNDO da manchete
 * ao TOPO do número, em píxeis de documento e em ecrãs de 844 px.
 *
 * F12 · AS TRÊS CAMADAS HERDAM A CABEÇA INTEIRA, e não só a faixa: a moldura, o
 * rótulo com o nome do lugar declarado, a manchete com um número selado, a faixa
 * e o instrumento da camada, por esta ordem no documento. Ver a nota da célula.
 *
 * F13 · NENHUM TRANSBORDO HORIZONTAL, às sete larguras e nas duas edições. Nasce
 * de um achado da segunda passagem: `/en/` rolava de lado 33 px a 320 e 16 px a
 * 390, na construção de partida e nesta, por causa da fila do comando. Uma
 * página que rola de lado num telemóvel esconde metade do que tem.
 *
 * ---------------------------------------------------------------------------
 * O QUE `--vermelhos` EXIGE DE CADA ESTRAGO
 * ---------------------------------------------------------------------------
 * Três coisas, e não uma, como em `lista.mjs`. **Verde antes**: as células que o
 * estrago nomeia passam sem ele, porque uma célula que já estava vermelha não
 * prova nada. **O HTML mudou**: a transformação dá bytes diferentes, porque um
 * estrago que não muda nada nunca podia ser apanhado. **Vermelho depois**: pelo
 * menos uma das células nomeadas cai.
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
   entre o ficheiro e o navegador, como nas outras réguas da casa. */
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
async function pagina(rota, largura, { altura = 900, js = true } = {}) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: altura },
    javaScriptEnabled: js,
  });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  /* `document.fonts.ready` é uma promessa do documento e resolve-se com o guião
     ligado; com ele desligado não há como esperar por ela, e a espera de rede já
     cobre o descarregamento dos tipos. */
  if (js) await p.evaluate(() => document.fonts.ready);
  return p;
}

/* As sete larguras da casa, as mesmas de `tests/inicio/app.mjs`. */
const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280];
const LIMIAR_DA_COLUNA = 1024;
const ALVO_TOQUE = 44;
const ALVO_PONTEIRO = 32;
/* O corpo mínimo da casa para um número com selo: o da lista social. */
const CORPO_MINIMO = 19;
const ALTURA_DO_ECRA = 844;

const EDICOES = [
  { chave: 'pt', rota: '/', regiao: '/regioes/alentejo', concelho: '/municipios/evora' },
  {
    chave: 'en',
    rota: '/en',
    regiao: '/en/regions/alentejo',
    concelho: '/en/municipalities/evora',
  },
];

/* ===========================================================================
 * A SONDA · corre dentro da página, uma vez por largura e por edição
 * ======================================================================== */
const LEITURA = () => {
  const cx = (el) => {
    const r = el.getBoundingClientRect();
    return {
      x: +(r.left + scrollX).toFixed(1),
      y: +(r.top + scrollY).toFixed(1),
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      fundo: +(r.bottom + scrollY).toFixed(1),
    };
  };
  /* A ÁREA EFECTIVA DE UM ALVO, palavra por palavra de `correcoes-a.mjs` (item
     A10): a caixa do elemento unida com a do seu `::after` absoluto, que é a
     técnica com que o selo alarga o que se toca sem alargar o que se compõe. */
  const areaEfetiva = (el) => {
    const r = el.getBoundingClientRect();
    let x1 = r.left;
    let y1 = r.top;
    let x2 = r.right;
    let y2 = r.bottom;
    const cs = getComputedStyle(el, '::after');
    if (cs && cs.content !== 'none' && cs.position === 'absolute') {
      const W = Math.max(parseFloat(cs.width) || 0, parseFloat(cs.minWidth) || 0);
      const H = Math.max(parseFloat(cs.height) || 0, parseFloat(cs.minHeight) || 0);
      if (W > 0 && H > 0) {
        const ccx = (r.left + r.right) / 2;
        const ccy = (r.top + r.bottom) / 2;
        x1 = Math.min(x1, ccx - W / 2);
        x2 = Math.max(x2, ccx + W / 2);
        y1 = Math.min(y1, ccy - H / 2);
        y2 = Math.max(y2, ccy + H / 2);
      }
    }
    return {
      x: +(x1 + scrollX).toFixed(1),
      y: +(y1 + scrollY).toFixed(1),
      w: +(x2 - x1).toFixed(1),
      h: +(y2 - y1).toFixed(1),
    };
  };

  const grelha = document.querySelector('[data-grelha]');
  const rotulo = document.querySelector('[data-grelha] .cabeca-rotulo');
  const instrumento = document.querySelector('[data-coluna-instrumento]');
  const faixa = document.querySelector('[data-faixa]');
  const cartoes = [...document.querySelectorAll('[data-cartao]')];
  /* A MANCHETE DA PÁGINA, E NÃO O NOME DO SÍTIO: `querySelector('h1')` devolve
     o `<h1 class="wordmark">` do cabeçalho, que é a marca. A manchete é a da
     vista, e vive dentro de `<main>`. */
  const manchete = document.querySelector('main h1') ?? document.querySelector('h1');
  const mapa = document.querySelector('.mapa-svg');

  /* O primeiro número SELADO de uma medida: um `[data-claim]` cujo pai leva o
     selo, dentro do painel, da lista social ou da faixa. É a mesma relação que
     `auditaSelo()` confere no portão. */
  const selados = [...document.querySelectorAll('[data-claim]')].filter((el) => {
    const pai = el.parentElement;
    return !!(pai && pai.querySelector('.src-chip'));
  });
  const primeiraMedida = selados.find((el) =>
    el.closest('#painel, #painel-social, [data-faixa], .painel'),
  );

  /* As medidas que a página rende por baixo da faixa: as peças, as linhas da
     lista social e — desde 04.09.2026 — as leituras breves da primeira página,
     que entraram no lugar das duas primeiras. É o conjunto contra o qual os
     cartões da faixa da CABEÇA se comparam. As três marcas contam-se juntas
     porque as três são a mesma coisa vista em três páginas: a leitura daquela
     medida naquele lugar. */
  const daPagina = [
    ...document.querySelectorAll('[data-medida]'),
  ].map((el) => el.getAttribute('data-medida'));
  const daSocial = [...document.querySelectorAll('[data-social]')].map((el) =>
    el.getAttribute('data-social'),
  );
  const daLeitura = [...document.querySelectorAll('[data-leitura]')].map((el) =>
    el.getAttribute('data-leitura'),
  );

  const guioes = [...document.querySelectorAll('script')].map((s) => s.textContent ?? '');

  return {
    largura: window.innerWidth,
    pagina: document.documentElement.scrollHeight,
    temFaixa: !!faixa,
    /* A CABEÇA DE UMA CAMADA, lida como um todo: a moldura, o rótulo com o nome
       do lugar declarado, a manchete com pelo menos um número selado, a faixa, e
       o instrumento da camada com desenho lá dentro. É o que a ordem pede às
       três, e não só à primeira página. */
    cabeca: grelha
      ? {
          forma: grelha.getAttribute('data-cabeca-forma'),
          lugar: grelha.getAttribute('data-cabeca-lugar'),
          rotuloDeclarado: !!(rotulo && rotulo.querySelector('[data-lugar]')),
          rotulo: rotulo ? (rotulo.textContent ?? '').replace(/\s+/g, ' ').trim() : null,
          manchete: (() => {
            const h1 = document.querySelector('[data-grelha] h1');
            if (!h1) return null;
            const val = h1.querySelector('[data-claim], [data-prova]');
            const pai = val ? val.parentElement : null;
            return {
              texto: (h1.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 80),
              comNumero: !!val,
              /* Um valor do livro-razão precisa do selo ao lado; uma contagem da
                 prova é ela própria uma porta. As duas formas contam. */
              selado: !!(
                val &&
                (val.hasAttribute('data-prova') || (pai && pai.querySelector('.src-chip')))
              ),
            };
          })(),
          instrumento: instrumento
            ? {
                desenho: instrumento.querySelectorAll('svg').length,
                caixa: cx(instrumento),
              }
            : null,
          /* A ordem no documento, entre as quatro peças da cabeça. */
          ordemDaCabeca: (() => {
            const col = document.querySelector('[data-grelha] .cabeca-col');
            const fb = document.querySelector('[data-faixa-bloco]');
            const seg = (a, b) =>
              a && b ? Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) : null;
            return { colAntesDaFaixa: seg(col, fb), faixaAntesDoInstrumento: seg(fb, instrumento) };
          })(),
        }
      : null,
    etiqueta: faixa ? faixa.tagName.toLowerCase() : null,
    rotulo: faixa ? faixa.getAttribute('aria-label') : null,
    faixaCaixa: faixa ? cx(faixa) : null,
    ladoCaixa: (() => {
      const l = document.querySelector('[data-cabeca-lado]');
      return l ? cx(l) : null;
    })(),
    scroll: faixa
      ? {
          left: faixa.scrollLeft,
          largura: faixa.scrollWidth,
          visivel: faixa.clientWidth,
          snap: getComputedStyle(faixa).scrollSnapType,
          overflow: getComputedStyle(faixa).overflowX,
        }
      : null,
    cartoes: cartoes.map((c) => {
      const porta = c.querySelector('.cartao-porta');
      const selo = c.querySelector(':scope > .claim-com-chip > .src-chip');
      /* TODOS os selos do cartão, e não só o do valor: a linha da unidade pode
         citar uma linha do livro-razão e trazer o selo dela. Nenhum deles pode
         cair debaixo da porta, e nenhum pode sobrepor-se a outro. */
      const selos = [...c.querySelectorAll('.src-chip')];
      const unidade = c.querySelector('.cartao-unidade');
      const valor = c.querySelector('[data-claim]');
      /* Um algarismo dentro do cartão que não esteja debaixo de `data-claim`
         nem de um motivo declarado é um número sem linha. Percorre-se o texto
         dos nós-folha, que é o que o leitor vê. */
      const semLinha = [];
      for (const el of c.querySelectorAll('*')) {
        if (el.children.length) continue;
        if (el.closest('[data-claim],[data-nonledger],.src-chip,.vh')) continue;
        const t = (el.textContent ?? '').trim();
        if (/\d/.test(t)) semLinha.push(t.slice(0, 24));
      }
      return {
        id: c.getAttribute('data-cartao'),
        estado: c.getAttribute('data-estado'),
        caixa: cx(c),
        porta: porta ? areaEfetiva(porta) : null,
        portaDestino: porta ? porta.getAttribute('href') : null,
        portaNome: porta ? porta.getAttribute('aria-labelledby') : null,
        selo: selo ? areaEfetiva(selo) : null,
        seloDestino: selo ? selo.getAttribute('href') : null,
        selos: selos.map((s) => areaEfetiva(s)),
        pe: unidade ? cx(unidade) : null,
        valorId: valor ? valor.getAttribute('data-claim') : null,
        corpo: valor ? +parseFloat(getComputedStyle(valor).fontSize).toFixed(2) : null,
        snapAlign: getComputedStyle(c).scrollSnapAlign,
        visivel:
        c.getBoundingClientRect().width > 0 &&
        c.getBoundingClientRect().height > 0 &&
        (typeof c.checkVisibility !== 'function' ||
          c.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })),
        semLinha,
      };
    }),
    medidasDaPagina: [...new Set([...daPagina, ...daSocial, ...daLeitura])],
    /* OS CARTÕES DA FAIXA DA CABEÇA, À PARTE (F1.1b, 04.09.2026). Desde
       04.09 a primeira página tem duas faixas: a da cabeça, que é o «Relance»
       do lugar, e a do domínio, na secção que entrou a seguir ao mapa. As
       células que comparam CONJUNTOS (F1 e F12, «os cartões da faixa são as
       medidas que a página rende por baixo») são sobre a primeira: as medidas
       de cabeça de um domínio não têm leitura NESTA página, têm-na na página do
       domínio, e é para lá que os seus cartões levam. As células que medem cada
       cartão (o selo, o alvo, o corpo do número, o destino) continuam a ler
       `cartoes`, que são TODOS: uma faixa nova não podia entrar sem régua. */
    idsDaCabeca: [...document.querySelectorAll('[data-grelha] [data-faixa] [data-cartao]')].map((c) =>
      c.getAttribute('data-cartao'),
    ),
    ancoras: [...document.querySelectorAll('[id]')].map((el) => el.id),
    manchete: manchete ? cx(manchete) : null,
    mapa: mapa ? cx(mapa) : null,
    ordem: (() => {
      if (!manchete || !faixa) return null;
      const antesDaFaixa = manchete.compareDocumentPosition(faixa) & Node.DOCUMENT_POSITION_FOLLOWING;
      const faixaAntesDoMapa = mapa
        ? Boolean(faixa.compareDocumentPosition(mapa) & Node.DOCUMENT_POSITION_FOLLOWING)
        : null;
      return { mancheteAntesDaFaixa: Boolean(antesDaFaixa), faixaAntesDoMapa };
    })(),
    primeiraMedida: primeiraMedida
      ? {
          id: primeiraMedida.getAttribute('data-claim'),
          topo: +(primeiraMedida.getBoundingClientRect().top + scrollY).toFixed(1),
        }
      : null,
    gavetas: [...document.querySelectorAll('[data-gaveta]')].map((g) => {
      const sum = g.querySelector('summary');
      return {
        chave: g.getAttribute('data-gaveta'),
        aberta: g.hasAttribute('open'),
        alvo: sum ? areaEfetiva(sum) : null,
        rotulo: sum ? (sum.textContent ?? '').trim() : null,
      };
    }),
    nomes: document.querySelectorAll('[data-lista-porta]').length,
    guiaoNomeiaAFaixa: guioes.some((g) => /data-faixa|data-cartao|cartao-porta/.test(g)),
  };
};

/* ---------------------------------------------------------------------------
 * A SONDA DO TOQUE · quem apanha o dedo em cima de cada selo
 * ---------------------------------------------------------------------------
 * `elementFromPoint` lê coordenadas do ECRÃ, e a faixa corre de lado: os cartões
 * a seguir ao primeiro estão fora da parte visível dela, e perguntar por eles
 * sem os trazer à vista devolveria o que estiver naquele ponto do ecrã, que é
 * outra coisa qualquer. Por isso cada cartão é trazido ao centro da faixa antes
 * de se perguntar, com `scrollIntoView`, que é o mesmo gesto que o teclado faz.
 */
const SONDA_TOQUE = () => {
  const out = [];
  for (const c of document.querySelectorAll('[data-cartao]')) {
    c.scrollIntoView({ block: 'nearest', inline: 'center' });
    const porta = c.querySelector('.cartao-porta');
    const selos = [...c.querySelectorAll('.src-chip')];
    const quem = selos.map((sel) => {
      const b = sel.getBoundingClientRect();
      const el = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      const alvo = el ? el.closest('a[href]') : null;
      return {
        apanha: alvo === sel,
        apanhou: alvo ? String(alvo.className || alvo.tagName) : 'nada',
      };
    });
    /* E o contrário, para que a célula não passe por um cartão em que ninguém
       apanha nada: um ponto do CORPO do cartão, longe dos selos, tem de devolver
       a porta. O ponto é o canto superior esquerdo mais 8 px, que é papel em
       todos os cartões. */
    const b = c.getBoundingClientRect();
    const noCorpo = document.elementFromPoint(b.left + 8, b.top + 8);
    out.push({
      id: c.getAttribute('data-cartao'),
      selos: quem,
      corpoAbrePorta: !!(noCorpo && noCorpo.closest('a[href]') === porta),
    });
  }
  return out;
};

/* ===========================================================================
 * A CORRIDA
 * ======================================================================== */
const intersecta = (a, b) =>
  a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5;

const alvoEm = (w) => (w >= LIMIAR_DA_COLUNA ? ALVO_PONTEIRO : ALVO_TOQUE);

async function correTudo(soEstas) {
  /* A escolha das células que um estrago faz correr aceita o nome inteiro («F3»)
     ou o de uma sub-célula («F10a»): a F10 rende duas, e uma planta que nomeia
     as duas tem de as fazer correr às duas. */
  const precisa = (c) => !soEstas || soEstas.some((n) => n === c || n.startsWith(c));
  const daPagina = ['F1', 'F2', 'F3', 'F5', 'F6', 'F8', 'F9', 'F11'].filter(precisa);
  /* A F12 e a F13 abrem as suas próprias páginas (outras rotas, outras
     larguras) e não entram na leitura partilhada. */

  const lido = {};
  /* A sonda do toque corre na mesma página que a leitura das caixas, mas depois
     dela: ela ROLA a faixa para trazer cada cartão ao centro, e uma leitura de
     caixas feita a seguir a isso mediria outra posição. */
  const toques = {};
  if (daPagina.length || precisa('F10')) {
    const larguras = new Set();
    for (const c of daPagina) {
      if (['F3', 'F6', 'F9'].includes(c)) for (const w of LARGURAS) larguras.add(w);
      if (['F1', 'F2', 'F5'].includes(c)) larguras.add(1280);
      if (c === 'F8') {
        larguras.add(390);
        larguras.add(1280);
      }
      if (c === 'F11') larguras.add(390);
    }
    if (precisa('F10')) for (const w of LARGURAS) larguras.add(w);
    for (const e of EDICOES) {
      for (const w of [...larguras].sort((a, b) => a - b)) {
        const p = await pagina(e.rota, w, { altura: ALTURA_DO_ECRA });
        lido[`${e.chave}_${w}`] = await p.evaluate(LEITURA);
        if (precisa('F3')) toques[`${e.chave}_${w}`] = await p.evaluate(SONDA_TOQUE);
        await p.__ctx.close();
      }
    }
    medidas.larguras = lido;
    medidas.toques = toques;
  }

  /* --------------------------------------------------------------------- F1 */
  if (precisa('F1')) {
    for (const e of EDICOES) {
      const r = lido[`${e.chave}_1280`];
      /* OS CARTÕES DA CABEÇA, e não todos os da página: ver a razão ao pé de
         `idsDaCabeca`, na sonda. A faixa do domínio tem a sua régua no bloco que
         a pôs lá (`tests/inicio/leitura.mjs`, J5). */
      const ids = r.idsDaCabeca;
      const daFaixa = new Set(ids);
      const daPagina = new Set(r.medidasDaPagina);
      const soNaFaixa = [...daFaixa].filter((i) => !daPagina.has(i));
      const soNaPagina = [...daPagina].filter((i) => !daFaixa.has(i));
      conta(
        `F1·${e.chave} · a faixa é uma lista, e os seus cartões são as medidas da página`,
        r.temFaixa &&
          (r.etiqueta === 'ol' || r.etiqueta === 'ul') &&
          ids.length > 0 &&
          daFaixa.size === ids.length &&
          soNaFaixa.length === 0 &&
          soNaPagina.length === 0 &&
          Boolean(r.rotulo),
        `<${r.etiqueta}> com ${ids.length} cartões na cabeça (${daFaixa.size} ids distintos) · ${daPagina.size} medidas na página` +
          ` · só na faixa: ${soNaFaixa.join(', ') || 'nenhuma'} · só na página: ${soNaPagina.join(', ') || 'nenhuma'}` +
          ` · nome da lista: «${r.rotulo ?? 'nenhum'}»`,
      );
    }
  }

  /* --------------------------------------------------------------------- F2 */
  if (precisa('F2')) {
    for (const e of EDICOES) {
      const r = lido[`${e.chave}_1280`];
      const semSelo = r.cartoes.filter((c) => !c.selo);
      const semValor = r.cartoes.filter((c) => c.valorId !== c.id);
      const seloErrado = r.cartoes.filter(
        (c) => c.selo && !String(c.seloDestino ?? '').includes(String(c.id)),
      );
      const comNumeroSolto = r.cartoes.filter((c) => c.semLinha.length > 0);
      conta(
        `F2·${e.chave} · cada cartão tem valor com linha, selo para essa linha, e nenhum algarismo solto`,
        r.cartoes.length > 0 &&
          semSelo.length === 0 &&
          semValor.length === 0 &&
          seloErrado.length === 0 &&
          comNumeroSolto.length === 0,
        `${r.cartoes.length} cartões · sem selo: ${semSelo.length}${semSelo.length ? ` (${semSelo.map((c) => c.id).join(', ')})` : ''}` +
          ` · valor que não é o do cartão: ${semValor.length}` +
          ` · selo a apontar para outra linha: ${seloErrado.length}` +
          ` · com algarismo fora de linha ou motivo: ${comNumeroSolto.length}` +
          `${comNumeroSolto.length ? ` (${comNumeroSolto.map((c) => `${c.id}: «${c.semLinha.join('», «')}»`).join(' · ')})` : ''}`,
      );
    }
  }

  /* --------------------------------------------------------------------- F3 */
  if (precisa('F3')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        const min = alvoEm(w);
        const pequenas = r.cartoes.filter(
          (c) => !c.porta || c.porta.w + 0.5 < min || c.porta.h + 0.5 < min,
        );
        /* A PORTA COBRE O CARTÃO INTEIRO: as quatro bordas a menos de 1 px das
           do cartão. O que protege o selo não é a geometria, é o toque, e mede-se
           mais abaixo. */
        const porque = (c) => {
          if (!c.porta) return 'sem porta';
          const falhas = [];
          if (c.porta.w < c.caixa.w - 1) falhas.push(`largura ${c.porta.w} de ${c.caixa.w}`);
          if (Math.abs(c.porta.y - c.caixa.y) > 1) falhas.push(`topo ${c.porta.y} contra ${c.caixa.y}`);
          if (Math.abs(c.porta.y + c.porta.h - (c.caixa.y + c.caixa.h)) > 1)
            falhas.push(`fundo ${(c.porta.y + c.porta.h).toFixed(1)} contra ${(c.caixa.y + c.caixa.h).toFixed(1)}`);
          if (Math.abs(c.porta.x - c.caixa.x) > 1) falhas.push(`esquerda ${c.porta.x} contra ${c.caixa.x}`);
          return falhas.join(', ');
        };
        const naoCobrem = r.cartoes.filter((c) => porque(c) !== '');
        /* Duas portas de dois cartões nunca se podem tocar: aí não há
           empilhamento nenhum a decidir, e a de baixo apanharia o clique da de
           cima. Os selos ficam DENTRO da porta do seu cartão de propósito, e é o
           toque que os protege. */
        const sobrepostas = [];
        for (let i = 0; i < r.cartoes.length; i++) {
          for (let j = i + 1; j < r.cartoes.length; j++) {
            const a = r.cartoes[i].porta;
            const b = r.cartoes[j].porta;
            if (a && b && intersecta(a, b)) sobrepostas.push(`${r.cartoes[i].id}×${r.cartoes[j].id}`);
          }
        }
        /* E dois selos do MESMO cartão também não: ali estão os dois no mesmo
           degrau, e o de baixo apanharia o toque do de cima. */
        for (const c of r.cartoes) {
          for (let a = 0; a < c.selos.length; a++) {
            for (let b = a + 1; b < c.selos.length; b++) {
              if (intersecta(c.selos[a], c.selos[b])) sobrepostas.push(`${c.id}·selo${a}×selo${b}`);
            }
          }
        }
        const toque = toques[`${e.chave}_${w}`] ?? [];
        const selosRoubados = toque.flatMap((t) =>
          t.selos.filter((x) => !x.apanha).map((x) => `${t.id}→${x.apanhou}`),
        );
        const corposMudos = toque.filter((t) => !t.corpoAbrePorta).map((t) => t.id);
        const nSelos = toque.reduce((n, t) => n + t.selos.length, 0);
        conta(
          `F3·${e.chave}·${w} · o cartão inteiro é alvo (mín ${min} px), e o selo ganha o toque`,
          r.cartoes.length > 0 &&
            pequenas.length === 0 &&
            naoCobrem.length === 0 &&
            sobrepostas.length === 0 &&
            nSelos > 0 &&
            selosRoubados.length === 0 &&
            corposMudos.length === 0,
          `${r.cartoes.length} cartões · porta mais pequena ${
            r.cartoes.length
              ? Math.min(...r.cartoes.filter((c) => c.porta).map((c) => Math.min(c.porta.w, c.porta.h))).toFixed(1)
              : '(sem)'
          } px · abaixo do mínimo: ${pequenas.length} · portas que não cobrem o cartão inteiro: ${naoCobrem.length}` +
            `${naoCobrem.length ? ` (${naoCobrem.slice(0, 2).map((c) => `${c.id}: ${porque(c)}`).join(' · ')})` : ''}` +
            ` · portas sobrepostas: ${sobrepostas.length}${sobrepostas.length ? ` (${sobrepostas.slice(0, 3).join(', ')})` : ''}` +
            ` · ${nSelos} selos, ${selosRoubados.length} com o toque roubado pela porta` +
            `${selosRoubados.length ? ` (${selosRoubados.slice(0, 3).join(', ')})` : ''}` +
            ` · corpos que não abrem a porta: ${corposMudos.length}`,
        );
      }
    }
  }

  /* --------------------------------------------------------------------- F4 */
  if (precisa('F4')) {
    for (const e of EDICOES) {
      const p = await pagina(e.rota, 390, { altura: ALTURA_DO_ECRA, js: false });
      const semJs = await p.evaluate(LEITURA);
      await p.__ctx.close();
      const comJs = lido[`${e.chave}_390`] ?? (await (async () => {
        const q = await pagina(e.rota, 390, { altura: ALTURA_DO_ECRA });
        const v = await q.evaluate(LEITURA);
        await q.__ctx.close();
        return v;
      })());
      medidas[`semJs_${e.chave}`] = semJs;
      const vistos = semJs.cartoes.filter((c) => c.visivel).length;
      conta(
        `F4·${e.chave} · a faixa funciona com o guião desligado, e nenhum guião a nomeia`,
        semJs.temFaixa &&
          vistos === comJs.cartoes.length &&
          vistos > 0 &&
          semJs.scroll &&
          semJs.scroll.overflow !== 'visible' &&
          !semJs.guiaoNomeiaAFaixa,
        `sem guião: ${vistos} cartões com caixa de ${semJs.cartoes.length} no documento (com guião: ${comJs.cartoes.length})` +
          ` · overflow-x «${semJs.scroll?.overflow ?? '(sem)'}» · algum <script> nomeia a faixa: ${semJs.guiaoNomeiaAFaixa}`,
      );
    }
  }

  /* --------------------------------------------------------------------- F5 */
  if (precisa('F5')) {
    for (const e of EDICOES) {
      const r = lido[`${e.chave}_1280`];
      const semAlign = r.cartoes.filter((c) => !c.snapAlign || c.snapAlign === 'none');
      conta(
        `F5·${e.chave} · o encaixe é de CSS: eixo x na lista, alinhamento em cada cartão`,
        Boolean(r.scroll) &&
          /x/.test(r.scroll.snap) &&
          r.scroll.snap !== 'none' &&
          semAlign.length === 0,
        `scroll-snap-type «${r.scroll?.snap ?? '(sem)'}» · cartões sem scroll-snap-align: ${semAlign.length} de ${r.cartoes.length}`,
      );
    }
  }

  /* --------------------------------------------------------------------- F6 */
  if (precisa('F6')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        const primeiro = r.cartoes[0];
        const dentro =
          primeiro &&
          r.faixaCaixa &&
          primeiro.caixa.x >= r.faixaCaixa.x - 0.5 &&
          primeiro.caixa.x + primeiro.caixa.w <= r.faixaCaixa.x + r.faixaCaixa.w + 0.5;
        const corre = r.scroll && r.scroll.largura > r.scroll.visivel + 1;
        conta(
          `F6·${e.chave}·${w} · o primeiro cartão inteiro sem gesto, e a faixa corre`,
          Boolean(dentro) && r.scroll.left === 0 && Boolean(corre),
          `faixa ${r.faixaCaixa?.w ?? '(sem)'} px · primeiro cartão ${primeiro?.caixa.w ?? '(sem)'} px em x ${primeiro?.caixa.x ?? '(sem)'}` +
            ` · scrollLeft ${r.scroll?.left ?? '(sem)'} · corre ${r.scroll?.largura ?? '(sem)'} de ${r.scroll?.visivel ?? '(sem)'} px`,
        );
      }
    }
  }

  /* --------------------------------------------------------------------- F7 */
  if (precisa('F7')) {
    for (const e of EDICOES) {
      const p = await pagina(e.rota, 390, { altura: ALTURA_DO_ECRA });
      /* ---------------------------------------------------------------------
         O DESTINO DE UM CARTÃO PODE SER OUTRA PÁGINA (F1.2b, item 1, 03.09.2026)
         ---------------------------------------------------------------------
         A célula media uma coisa só: que o `href` do cartão fosse uma âncora
         DESTA página. Deixou de ser verdade quando os cartões cuja medida
         pertence a um domínio no ar passaram a abrir a leitura daquela medida
         na página do domínio. A célula não afrouxa: passa a exigir o que cada
         forma de destino promete.

           · `#ancora`        · o `id` existe nesta página;
           · `/caminho#ancora` · a página responde 200 E tem esse `id` lá dentro;
           · `/caminho`        · a página responde 200.

         Uma porta para uma página que não foi construída, ou para uma âncora que
         não existe na página de chegada, cai aqui, que é mais do que a célula
         antiga sabia recusar. */
      const r = await p.evaluate(() => {
        const cartoes = [...document.querySelectorAll('[data-cartao]')];
        const ancoras = new Set([...document.querySelectorAll('[id]')].map((el) => el.id));
        return cartoes.map((c) => {
          const a = c.querySelector('.cartao-porta');
          const href = a ? (a.getAttribute('href') ?? '') : '';
          const local = href.startsWith('#');
          return {
            id: c.getAttribute('data-cartao'),
            temPorta: !!a,
            href,
            local,
            destinoExiste: local ? ancoras.has(href.slice(1)) : null,
            nomeadaPor: a ? a.getAttribute('aria-labelledby') : null,
            nomeExiste: a ? ancoras.has(a.getAttribute('aria-labelledby') ?? '') : false,
          };
        });
      });
      /* As páginas de fora pedem-se ao servidor, uma vez por destino distinto. */
      const forasteiros = new Map();
      for (const c of r) {
        if (c.local || !c.href) continue;
        if (forasteiros.has(c.href)) continue;
        const [caminho, ancora] = c.href.split('#');
        const resposta = await fetch(base + caminho);
        const corpo = resposta.status === 200 ? await resposta.text() : '';
        forasteiros.set(
          c.href,
          resposta.status === 200 && (!ancora || corpo.includes(`id="${ancora}"`)),
        );
      }
      for (const c of r) {
        if (!c.local) c.destinoExiste = c.href ? (forasteiros.get(c.href) ?? false) : false;
      }
      /* O `Tab` A PARTIR DO PRIMEIRO CARTÃO, e o que se prova é a ORDEM em que
         as portas aparecem, não que elas sejam seguidas: entre a porta de um
         cartão e a do seguinte há o selo daquele cartão, que também é uma porta
         e também é focável, e é assim que se quer, porque o selo abre a linha. O
         que se recolhe é a subsequência das portas dos cartões, e o que se
         compara é essa subsequência com a ordem do documento.

         `focus()` põe o foco onde a tabulação continua; um `focus()` de guião
         não acende `:focus-visible` em todos os motores, e por isso o que esta
         célula mede é a ordem e não a marca (a marca é da folha, e a régua da
         lista mede-a nos nomes). */
      const focados = [];
      await p.evaluate(() => {
        const primeiro = document.querySelector('[data-cartao] .cartao-porta');
        if (primeiro) primeiro.focus();
      });
      const passos = r.length * 6;
      for (let i = 0; i < passos && focados.length < r.length; i++) {
        const foco = await p.evaluate(() => {
          const el = document.activeElement;
          return el && el.classList && el.classList.contains('cartao-porta')
            ? el.closest('[data-cartao]').getAttribute('data-cartao')
            : null;
        });
        if (foco && focados[focados.length - 1] !== foco) focados.push(foco);
        await p.keyboard.press('Tab');
      }
      await p.__ctx.close();
      const semPorta = r.filter((c) => !c.temPorta);
      const semDestino = r.filter((c) => !c.destinoExiste);
      const semNome = r.filter((c) => !c.nomeExiste);
      const ordem = focados.join(',') === r.map((c) => c.id).join(',');
      conta(
        `F7·${e.chave} · o teclado chega a cada cartão, pela ordem, e cada porta abre um destino que existe`,
        r.length > 0 && semPorta.length === 0 && semDestino.length === 0 && semNome.length === 0 && ordem,
        `${r.length} cartões · sem porta: ${semPorta.length} · com destino que não existe: ${semDestino.length}` +
          `${semDestino.length ? ` (${semDestino.map((c) => c.id).slice(0, 3).join(', ')})` : ''}` +
          ` · sem nome acessível: ${semNome.length} · a ordem do Tab é a do documento: ${ordem}`,
      );
    }
  }

  /* --------------------------------------------------------------------- F8 */
  if (precisa('F8')) {
    for (const e of EDICOES) {
      const movel = lido[`${e.chave}_390`];
      const largo = lido[`${e.chave}_1280`];
      const cm = movel.cartoes[0]?.corpo ?? null;
      const cl = largo.cartoes[0]?.corpo ?? null;
      const todosMoveis = movel.cartoes.map((c) => c.corpo);
      conta(
        `F8·${e.chave} · dois corpos: o número da faixa é mais pequeno no telemóvel do que no ecrã largo`,
        cm !== null && cl !== null && cm < cl && cm >= CORPO_MINIMO && new Set(todosMoveis).size === 1,
        `390: ${cm} px · 1280: ${cl} px · chão da casa para um número com selo: ${CORPO_MINIMO} px` +
          ` · corpos distintos a 390: ${new Set(todosMoveis).size}`,
      );
    }
  }

  /* --------------------------------------------------------------------- F9 */
  /* ---------------------------------------------------------------------------
   * A ORDEM NO ECRÃ TEM DUAS FORMAS, PORQUE A CABEÇA TEM DUAS (01.09.2026)
   * ---------------------------------------------------------------------------
   * Abaixo de 1024 a cabeça é uma coluna, e «manchete, faixa, mapa» é uma ordem
   * de cima para baixo: mede-se pelo topo de cada caixa.
   *
   * A PARTIR DE 1024 a cabeça tem duas colunas, e é a forma que a emenda das
   * 19:50 de 29.08 à §1.84 decidiu: a manchete, a faixa e as gavetas na coluna
   * esquerda, o mapa na direita, do topo da manchete ao fundo da legenda. Ali a
   * ordem é a de LEITURA, ou seja a coluna esquerda de cima para baixo com o
   * mapa ao lado dela, e não a do topo das caixas: o mapa começa à altura da
   * manchete,
   * porque é isso que estar ao lado quer dizer. Medir aqui «o topo da faixa
   * acima do topo do mapa» seria pedir à cabeça de duas colunas que fosse de uma.
   * A célula mede o que a forma promete: a coluna esquerda pela ordem, e o mapa
   * inteiramente à direita dela.
   * ------------------------------------------------------------------------ */
  if (precisa('F9')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        const noDocumento = r.ordem?.mancheteAntesDaFaixa && r.ordem?.faixaAntesDoMapa;
        const duasColunas = w >= LIMIAR_DA_COLUNA;
        let noEcra = null;
        let prova = '';
        if (r.manchete && r.faixaCaixa && r.mapa) {
          if (duasColunas) {
            /* A INVARIANTE DA CABEÇA DE DUAS COLUNAS, e não só «o mapa à
               direita» (01.09.2026, segunda passagem). A primeira redação media
               uma coisa só, e a planta que põe a faixa por baixo do mapa passava
               por ela a 1024 e a 1280: a faixa mudava de fila e continuava na
               coluna esquerda, com o mapa à direita, e a célula não via nada.
               O que a forma promete são TRÊS coisas, e as três medem-se:

                 · a coluna esquerda lê-se pela ordem, de cima para baixo: a
                   manchete, depois a faixa, depois as gavetas;
                 · a faixa está na banda da coluna esquerda (a mesma abcissa e a
                   mesma largura da manchete), e não na do mapa;
                 · o mapa começa depois do fim da coluna esquerda, e o seu topo é
                   o topo da manchete, que é o que «ao lado» quer dizer. */
            const aoLado = r.mapa.x >= r.faixaCaixa.x + r.faixaCaixa.w - 0.5;
            const emCima = r.manchete.y <= r.faixaCaixa.y + 0.5;
            const antesDasGavetas = r.ladoCaixa ? r.faixaCaixa.y < r.ladoCaixa.y : null;
            const naBanda =
              Math.abs(r.faixaCaixa.x - r.manchete.x) <= 1 &&
              r.faixaCaixa.w >= r.manchete.w - 1;
            /* O mapa começa ao lado da coluna e não por baixo dela: o topo
               dele está ACIMA do topo da faixa. A igualdade exacta com o topo da
               manchete é da L11 de `lista.mjs`, que a mede a 1024, 1280 e 1440
               contra a caixa da coluna e com a tolerância que a §1.84 fixou;
               repeti-la aqui contra o `<h1>`, que começa depois do rótulo,
               mediria outra coisa. */
            const topoDoMapa = r.mapa.y <= r.faixaCaixa.y + 0.5;
            noEcra = aoLado && emCima && antesDasGavetas === true && naBanda && topoDoMapa;
            prova =
              `duas colunas · manchete y ${r.manchete.y} antes da faixa y ${r.faixaCaixa.y}: ${emCima}` +
              ` · faixa antes das gavetas (y ${r.ladoCaixa?.y ?? '(sem)'}): ${antesDasGavetas}` +
              ` · faixa na banda da coluna esquerda (x ${r.faixaCaixa.x} contra ${r.manchete.x}): ${naBanda}` +
              ` · mapa x ${r.mapa.x} à direita do fim da coluna esquerda ${(r.faixaCaixa.x + r.faixaCaixa.w).toFixed(1)}: ${aoLado}` +
              ` · topo do mapa ${r.mapa.y} acima do topo da faixa ${r.faixaCaixa.y}: ${topoDoMapa}`;
          } else {
            noEcra = r.manchete.y <= r.faixaCaixa.y + 0.5 && r.faixaCaixa.y <= r.mapa.y + 0.5;
            prova = `uma coluna · manchete y ${r.manchete.y} · faixa y ${r.faixaCaixa.y} · mapa y ${r.mapa.y}`;
          }
        }
        conta(
          `F9·${e.chave}·${w} · manchete, faixa, mapa, por esta ordem no documento e no ecrã`,
          Boolean(noDocumento) && Boolean(noEcra),
          `documento: manchete→faixa ${r.ordem?.mancheteAntesDaFaixa} · faixa→mapa ${r.ordem?.faixaAntesDoMapa} · ${prova}`,
        );
      }
    }
  }

  /* -------------------------------------------------------------------- F10 */
  if (precisa('F10')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        const min = alvoEm(w);
        const abertas = r.gavetas.filter((g) => g.aberta);
        const pequenas = r.gavetas.filter(
          (g) => !g.alvo || g.alvo.w + 0.5 < min || g.alvo.h + 0.5 < min,
        );
        /* ---------------------------------------------------------------------
           A CÉLULA MUDOU DE EXIGÊNCIA COM O BLOCO F1.1 (03.09.2026), e não foi
           desligada. Media «as duas gavetas do mapa, FECHADAS»: era a afinação 1
           do brief da forma dos domínios, de 01.09, que recolheu a busca e a
           lista dos nomes em dois `<details>` fechados ao lado do mapa.

           O F1.1 mediu o que isso custava e desfez as duas metades por razões
           diferentes, escritas no brief da porta da frente. A LISTA DOS NOMES
           passa a chegar ABERTA (item 4): abaixo de 1024 nenhuma das 29 unidades
           do desenho chega aos 44 px pelo quadrado inscrito (I82), a rede de
           nomes é o único alvo que responde por elas, e fechada ela existia para
           o teclado e para quem ouve e não existia para quem vê. A BUSCA sai da
           gaveta e sobe para debaixo da manchete (itens 3 e 12), como `<form>`
           com destino, porque é a porta para o concelho no primeiro ecrã.

           O QUE A CÉLULA CONTINUA A PROTEGER é o que ela sempre protegeu: que a
           rede de nomes existe, que tem os 29, e que o comando que a fecha é um
           alvo da medida da casa. O que muda é o estado esperado — uma gaveta,
           aberta — e a busca, que passa a medir-se onde ela agora está. */
        conta(
          `F10a·${e.chave}·${w} · a gaveta dos nomes, aberta, com alvo de ${min} px, e a busca fora dela`,
          r.gavetas.length === 1 &&
            abertas.length === 1 &&
            pequenas.length === 0 &&
            r.nomes === 29,
          `${r.gavetas.length} gavetas (${r.gavetas.map((g) => g.chave).join(', ')}) · abertas: ${abertas.length}` +
            ` · alvo mais pequeno ${
              r.gavetas.length
                ? Math.min(...r.gavetas.filter((g) => g.alvo).map((g) => Math.min(g.alvo.w, g.alvo.h))).toFixed(1)
                : '(sem)'
            } px · nomes no documento: ${r.nomes}`,
        );
      }
      /* Abre sem guião: um toque real no `<summary>`, com o guião desligado. O
         `<details>` é do navegador, e é isso que esta célula prova. */
      const p = await pagina(e.rota, 390, { altura: ALTURA_DO_ECRA, js: false });
      /* UM TOQUE A SÉRIO, e não um `open` escrito por guião: o que esta célula
         prova é que o mecanismo é do NAVEGADOR. Se não houver `<summary>`, que
         é exactamente o que a planta «a lista dos nomes a abrir só com guião»
         faz, a célula fica vermelha com a razão escrita, e não rebenta a
         corrida: uma régua que atira em vez de contar não prova nada. */
      /* DUAS VOLTAS, E NÃO UMA (F1.1, 03.09.2026). A gaveta chega ABERTA, e por
         isso o primeiro toque fecha-a e o segundo abre-a: é a ida e a volta que
         provam que o mecanismo é do navegador, e é a mesma prova que a célula
         sempre quis. Uma célula que só medisse o estado inicial provaria o
         atributo `open` que o servidor escreve, e não o `<details>`.

         AS CAIXAS MEDEM-SE COM `checkVisibility` e não com a altura, e isso
         mediu-se antes de se escrever: num Chromium 148 o conteúdo de um
         `<details>` fechado CONTINUA a ter caixa (os 29 nomes dão 54,1 × 44 com
         a gaveta fechada), porque a implementação nova o esconde por
         `content-visibility` e não por `display`. Uma célula que contasse
         alturas dizia «29 à vista» com a gaveta fechada. */
      let tocou = true;
      const olha = () =>
        p.evaluate(() => {
          const g = document.querySelector('[data-gaveta="nomes"]');
          const nomes = [...document.querySelectorAll('[data-lista-porta]')];
          const ve = (n) =>
            n.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true });
          return {
            etiqueta: g ? g.tagName.toLowerCase() : null,
            aberta: !!g && g.hasAttribute('open'),
            visiveis: nomes.filter(ve).length,
            total: nomes.length,
          };
        });
      const entrada = await olha();
      try {
        await p.locator('[data-gaveta="nomes"] > summary').click({ timeout: 4000 });
      } catch {
        tocou = false;
      }
      const fechada = await olha();
      try {
        await p.locator('[data-gaveta="nomes"] > summary').click({ timeout: 4000 });
      } catch {
        tocou = false;
      }
      const depois = await olha();
      await p.__ctx.close();
      conta(
        `F10b·${e.chave} · a gaveta dos nomes chega aberta e fecha e abre sem guião, com os 29 à vista`,
        tocou &&
          depois.etiqueta === 'details' &&
          entrada.aberta &&
          entrada.visiveis === 29 &&
          !fechada.aberta &&
          fechada.visiveis === 0 &&
          depois.aberta &&
          depois.visiveis === 29 &&
          depois.total === 29,
        `o toque chegou ao <summary>: ${tocou} · a gaveta é um <${depois.etiqueta ?? 'nada'}>` +
          ` · à chegada: aberta ${entrada.aberta}, ${entrada.visiveis} à vista` +
          ` · depois de um toque: aberta ${fechada.aberta}, ${fechada.visiveis} à vista` +
          ` · depois do segundo: aberta ${depois.aberta}, ${depois.visiveis} de ${depois.total} à vista`,
      );
    }
  }

  /* -------------------------------------------------------------------- F11 */
  if (precisa('F11')) {
    for (const e of EDICOES) {
      const r = lido[`${e.chave}_390`];
      const d = r.primeiraMedida && r.manchete ? r.primeiraMedida.topo - r.manchete.fundo : null;
      conta(
        `F11·${e.chave}·390 · o primeiro número selado de uma medida a menos de um ecrã da manchete`,
        d !== null && d < ALTURA_DO_ECRA,
        `${d === null ? 'não medido' : `${d.toFixed(1)} px · ${(d / ALTURA_DO_ECRA).toFixed(2)} ecrãs de ${ALTURA_DO_ECRA} px · ${r.primeiraMedida?.id}`}`,
      );
    }
  }

  /* -------------------------------------------------------------------- F12 */
  /* ---------------------------------------------------------------------------
   * AS TRÊS CAMADAS HERDAM A CABEÇA, E NÃO SÓ A FAIXA
   * ---------------------------------------------------------------------------
   * A primeira redação desta célula pedia só que a página tivesse faixa, e a
   * medição cega apanhou-a: as páginas de região e de concelho herdavam a faixa
   * e mais nada, sem manchete numérica e sem instrumento na cabeça. A ordem pede
   * «o mesmo componente, com a unidade escolhida», e o que isso quer dizer
   * mede-se aqui, peça a peça:
   *
   *   · a moldura é a mesma (`[data-grelha]`), com a forma daquela camada;
   *   · o rótulo traz o nome do lugar DECLARADO, e não como prosa da casa;
   *   · a manchete traz pelo menos um número, e esse número está selado (o selo
   *     ao lado, para uma linha do livro-razão; a própria porta, para uma
   *     contagem da prova);
   *   · a faixa tem cartões, todos com selo, e todos resolvem em medidas da
   *     página;
   *   · o instrumento da camada existe e tem desenho lá dentro;
   *   · e a ordem no documento é a da ordem de construção: a coluna do texto, a
   *     faixa, o instrumento.
   *
   * A GEOMETRIA DOS ALVOS MEDE-SE AQUI TAMBÉM, e é onde ela morde: uma das sete
   * medidas de um concelho cita uma linha dentro da unidade e traz um SEGUNDO
   * selo no cartão; nenhum dos dois pode sobrepor-se ao outro, e cada um tem de
   * ganhar o seu toque.
   * ------------------------------------------------------------------------ */
  if (precisa('F12')) {
    for (const e of EDICOES) {
      for (const [qual, rota] of [
        ['pais', e.rota],
        ['regiao', e.regiao],
        ['concelho', e.concelho],
      ]) {
        const p = await pagina(rota, 390, { altura: ALTURA_DO_ECRA });
        const r = await p.evaluate(LEITURA);
        const toque = await p.evaluate(SONDA_TOQUE);
        await p.__ctx.close();
        medidas[`${qual}_${e.chave}`] = r;
        /* Os cartões da CABEÇA, como na F1 e pela mesma razão: esta célula
           pergunta se a camada herda a cabeça inteira, e a cabeça tem uma faixa
           só. */
        const ids = r.idsDaCabeca;
        const daPagina = new Set(r.medidasDaPagina);
        const soltos = ids.filter((i) => !daPagina.has(i));
        const semSelo = r.cartoes.filter((c) => !c.selo);
        const c = r.cabeca;
        const sobrepostas = [];
        for (const t of r.cartoes) {
          for (let a = 0; a < t.selos.length; a++) {
            for (let b = a + 1; b < t.selos.length; b++) {
              if (intersecta(t.selos[a], t.selos[b])) sobrepostas.push(`${t.id}·selo${a}×selo${b}`);
            }
          }
        }
        const selosRoubados = toque.flatMap((t) =>
          t.selos.filter((x) => !x.apanha).map((x) => `${t.id}→${x.apanhou}`),
        );
        /* O NOME DECLARADO EXIGE-SE ONDE ELE É TRANSCRITO. O rótulo de uma
           região e o de um concelho trazem o nome que a Carta lhes dá, e esse
           vai marcado `data-lugar` para não entrar no inventário das frases da
           casa. O do país é uma cadeia da casa («Portugal · país»), declarada em
           `strings.mjs` e inventariada como todas as outras: pedir-lhe a marca
           de lugar seria pedir-lhe que fosse o que não é. */
        const precisaDeLugar = qual !== 'pais';
        /* ---------------------------------------------------------------------
           O RÓTULO SAIU DA CABEÇA DO PAÍS (F1.1, 03.09.2026), e a célula segue-o
           em vez de o exigir onde ele já não está. Dizia «Portugal · país» por
           cima de uma manchete que começa por «Portugal ultrapassa…»: o nome do
           lugar duas vezes em duas filas, e a segunda custava uma fila do
           primeiro ecrã do telemóvel, que é o que o bloco existe para libertar.
           Era também o eco do comando de âmbito, que saiu da página no mesmo
           bloco: sem comando, o rótulo deixou de nomear um estado escolhido.

           NAS OUTRAS DUAS CAMADAS O RÓTULO CONTINUA A SER EXIGIDO, e com a marca
           de lugar: numa página de região ou de concelho ele diz o tipo do lugar
           («região NUTS II», «concelho · distrito de Évora»), que não está na
           manchete e que é o que distingue as três camadas uma da outra. */
        const precisaDeRotulo = qual !== 'pais';
        const temCabeca =
          !!c &&
          (!precisaDeLugar || c.rotuloDeclarado) &&
          (!precisaDeRotulo || !!c.rotulo) &&
          !!c.manchete &&
          c.manchete.comNumero &&
          c.manchete.selado &&
          !!c.instrumento &&
          c.instrumento.desenho > 0 &&
          c.ordemDaCabeca.colAntesDaFaixa === true &&
          c.ordemDaCabeca.faixaAntesDoInstrumento === true;
        conta(
          `F12·${qual}·${e.chave} · a camada herda a cabeça inteira: ${precisaDeRotulo ? 'rótulo declarado, ' : ''}manchete com número selado, faixa e instrumento`,
          temCabeca &&
            r.temFaixa &&
            ids.length > 0 &&
            soltos.length === 0 &&
            semSelo.length === 0 &&
            sobrepostas.length === 0 &&
            selosRoubados.length === 0,
          `forma «${c?.forma ?? '(sem)'}» · rótulo «${c?.rotulo ?? '(sem)'}»${precisaDeRotulo ? '' : ' (não é preciso: o F1.1 tirou-o da cabeça do país)'}, nome declarado ${c?.rotuloDeclarado}${precisaDeLugar ? '' : ' (não é preciso: é cadeia da casa)'}` +
            ` · manchete «${c?.manchete?.texto ?? '(sem)'}» com número ${c?.manchete?.comNumero}, selado ${c?.manchete?.selado}` +
            ` · instrumento com ${c?.instrumento?.desenho ?? 0} desenho(s), ${c?.instrumento?.caixa?.w ?? 0} px de largura` +
            ` · ordem coluna→faixa ${c?.ordemDaCabeca?.colAntesDaFaixa}, faixa→instrumento ${c?.ordemDaCabeca?.faixaAntesDoInstrumento}` +
            ` · ${ids.length} cartões, ${soltos.length} sem correspondência, ${semSelo.length} sem selo` +
            ` · selos sobrepostos ${sobrepostas.length}, toques roubados ${selosRoubados.length}`,
        );
      }
    }
  }

  /* -------------------------------------------------------------------- F13 */
  /* O TRANSBORDO HORIZONTAL, ÀS SETE LARGURAS E NAS DUAS EDIÇÕES.
   *
   * A célula nasce de um achado da segunda passagem: as capturas de `/en/` a 320
   * e a 390 saíram com 353 e 406 px de largura. Medido na construção de partida
   * (`307796f`) e nesta, o transbordo era de 33 e 16 px, só na edição inglesa, e
   * vinha da fila do comando, cujos rótulos são mais longos em inglês. Era um
   * defeito anterior a este bloco que nenhuma régua media: a matriz tem uma
   * célula «largura 320 · sem transbordo horizontal» e ela corre só numa edição.
   *
   * Uma página que rola de lado num telemóvel esconde metade do que tem, e por
   * isso isto passa a ter régua própria, nas duas edições e às sete larguras. */
  if (precisa('F13')) {
    for (const e of EDICOES) {
      const linhas = [];
      let bem = true;
      for (const w of LARGURAS) {
        const p = await pagina(e.rota, w, { altura: ALTURA_DO_ECRA });
        const r = await p.evaluate(() => {
          const de = document.documentElement;
          return { sw: de.scrollWidth, cw: de.clientWidth, t: de.scrollWidth - de.clientWidth };
        });
        await p.__ctx.close();
        if (r.t > 0) bem = false;
        linhas.push(`${w}: ${r.t}`);
      }
      conta(
        `F13·${e.chave} · nenhum transbordo horizontal, às sete larguras`,
        bem,
        `transbordo por largura · ${linhas.join(' · ')}`,
      );
    }
  }
}

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS · os cinco que a ordem de construção nomeia
 * ======================================================================== */
/* AS DUAS PRIMEIRAS PÁGINAS, E A INGLESA ENTRA PELO CAMINHO QUE O SERVIDOR VÊ.
   A primeira redação escrevia `/en/`, com barra, e o servidor destas réguas
   recebe `/en`, sem ela: a régua abre `base + '/en'` e é essa a cadeia que
   chega. O estrago nunca tocava na edição inglesa, e como o corredor se
   contentava com «pelo menos uma célula vermelha», as sete plantas passavam com
   metade das células. A segunda passagem apertou o corredor e o buraco
   apareceu. As quatro formas ficam escritas, para que o caminho volte a bater
   certo se o servidor mudar. */
const soNaPrimeira = (rota) =>
  rota === '/' || rota === '/index.html' || rota === '/en' || rota === '/en/' || rota === '/en/index.html';
const comFolha = (css) => (html, rota) =>
  soNaPrimeira(rota) ? html.replace('</head>', `<style>${css}</style></head>`) : html;

const PLANTAS = [
  {
    nome: 'um cartão sem selo (o selo do primeiro cartão retirado)',
    celulas: ['F2'],
    estrago: (html, rota) => {
      if (!soNaPrimeira(rota)) return html;
      const i = html.indexOf('<li class="cartao"');
      if (i < 0) return html;
      const f = html.indexOf('</li>', i);
      const cartao = html.slice(i, f);
      const sem = cartao.replace(/<a class="src-chip[\s\S]*?<\/a>/, '');
      return sem === cartao ? html : html.slice(0, i) + sem + html.slice(f);
    },
  },
  {
    nome: 'um cartão sem alvo de 44 px (a porta encolhida a 30 px)',
    celulas: ['F3'],
    estrago: comFolha('.cartao:first-child .cartao-porta{inset:0 auto auto 0 !important;width:30px !important;height:30px !important}'),
  },
  {
    nome: 'a faixa a depender de guião (os cartões escondidos pela folha)',
    celulas: ['F4'],
    estrago: comFolha('.cartao:nth-child(n+2){display:none !important}'),
  },
  {
    nome: 'um número sem linha (um algarismo escrito à mão dentro de um cartão)',
    celulas: ['F2'],
    estrago: (html, rota) => {
      if (!soNaPrimeira(rota)) return html;
      return html.replace(
        /(<p class="cartao-unidade"[^>]*>)/,
        '$1<span>13 de 27</span>',
      );
    },
  },
  {
    nome: 'a lista dos nomes a abrir só com guião (o <details> trocado por uma caixa escondida)',
    celulas: ['F10a', 'F10b'],
    estrago: (html, rota) => {
      if (!soNaPrimeira(rota)) return html;
      return html
        .replace('<details class="gaveta" data-gaveta="nomes">', '<div class="gaveta" data-gaveta="nomes" hidden>')
        .replace(/<summary class="gaveta-abrir">([\s\S]*?)<\/summary>/, '<p class="gaveta-abrir">$1</p>');
    },
  },
  /* Dois estragos a mais, que não estão na ordem e existem porque as células
     que eles nomeiam não tinham planta nenhuma: uma célula sem estrago é uma
     célula que ninguém provou saber falhar. */
  {
    nome: 'o encaixe retirado da folha',
    celulas: ['F5'],
    estrago: comFolha('.faixa{scroll-snap-type:none !important}.cartao{scroll-snap-align:none !important}'),
  },
  {
    /* Com a invariante nova do ecrã largo (a faixa antes das gavetas, na banda
       da coluna esquerda), esta planta morde às sete larguras. Antes dela ficava
       verde a 1024 e a 1280, e era isso que a segunda passagem apanhou. */
    nome: 'a faixa por baixo do mapa',
    celulas: ['F9'],
    estrago: comFolha('[data-inicio] .faixa-bloco{order:9 !important}@media (min-width:1024px){.faixa-bloco{grid-row:4 !important}.cabeca-inst{grid-row:1 !important}}'),
  },
];

if (VERMELHOS) {
  console.log('');
  let falhou = false;
  /* O NOME DA CÉLULA COMPARA-SE INTEIRO ATÉ AO SEPARADOR, e não por prefixo:
     `startsWith('F1')` apanhava também a F10, a F12 e a F13, e uma planta da F1
     passava a contar com o vermelho de outra célula qualquer. */
  const tocada = (c, planta) =>
    planta.celulas.some((n) => c.nome === n || c.nome.startsWith(`${n}·`) || c.nome.startsWith(`${n} `));
  for (const planta of PLANTAS) {
    ESTRAGO = null;
    celulas = [];
    medidas = {};
    await correTudo(planta.celulas);
    const antes = celulas.filter((c) => tocada(c, planta));
    const verdesAntes = antes.length > 0 && antes.every((c) => c.passa);

    let mudou = false;
    for (const [rota, rel] of [
      ['/', 'index.html'],
      ['/en', path.join('en', 'index.html')],
    ]) {
      const cru = fs.readFileSync(path.join(DIST, rel), 'utf8');
      if (planta.estrago(cru, rota) !== cru) mudou = true;
    }

    ESTRAGO = planta.estrago;
    celulas = [];
    medidas = {};
    await correTudo(planta.celulas);
    const depois = celulas.filter((c) => tocada(c, planta));
    /* ---------------------------------------------------------------------
       O VERMELHO EXIGE-SE EM TODAS AS LARGURAS E EDIÇÕES QUE A PLANTA ESTRAGA
       ---------------------------------------------------------------------
       «Pelo menos uma célula vermelha» não chega, e a segunda passagem deste
       bloco apanhou porquê: a planta que põe a faixa por baixo do mapa fazia
       cair as cinco larguras estreitas e deixava a 1024 e a 1280 verdes, porque
       a célula do ecrã largo media uma coisa que o estrago não tocava. Uma
       planta que estraga a página inteira e só é vista em metade das larguras
       está a dizer que a outra metade não tem régua.

       `parciais` é a lista das plantas que estragam MESMO só uma parte, com a
       razão escrita ao lado: ali exige-se vermelho onde a planta morde e
       verde onde ela não morde, o que é uma exigência mais apertada e não mais
       frouxa. */
    const vermelhas = depois.filter((c) => !c.passa);
    const apanhou = planta.parcial
      ? vermelhas.length > 0 && vermelhas.length < depois.length
      : vermelhas.length === depois.length && depois.length > 0;

    const ok = verdesAntes && mudou && apanhou;
    if (!ok) falhou = true;
    console.log(
      `  ${ok ? verde('vermelho ✓') : vermelho('NÃO APANHOU ✗')}  ${planta.nome}` +
        cinza(
          `  [${antes.length} célula(s) · verde antes: ${verdesAntes} · o HTML mudou: ${mudou} · vermelhas depois: ${vermelhas.length} de ${depois.length}${planta.parcial ? ' (parcial, e é de propósito)' : ''}]`,
        ),
    );
    for (const c of depois.filter((c) => !c.passa).slice(0, 2)) {
      console.log(cinza(`              ${c.nome} · ${c.prova}`));
    }
    if (!verdesAntes) {
      for (const c of antes.filter((c) => !c.passa).slice(0, 2)) {
        console.log(vermelho(`              já estava vermelha ANTES: ${c.nome} · ${c.prova}`));
      }
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
  fs.writeFileSync(
    path.resolve(RAIZ, String(FICHEIRO_JSON)),
    JSON.stringify({ celulas, medidas }, null, 2),
  );
}
process.exit(falhadas.length === 0 ? 0 : 1);
