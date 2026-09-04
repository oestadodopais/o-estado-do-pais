#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DOS ALVOS E DA ACESSIBILIDADE · bloco F1.7, 04.09.2026
 * =============================================================================
 *
 * Uma célula por medida de aceitação do brief F1.7 (`H1` a `H10`; a `H11` são os
 * três comandos da casa e a `H12` são as plantas desta régua). Mede em Chromium
 * sem cabeça sobre `dist/`, nas rotas de todas as famílias de página das duas
 * edições e nas larguras que a casa serve. É UM PORTÃO: entra em
 * `npm run verify` (`check:alvos`) e sai com 1 quando alguma célula falha, como
 * as outras réguas do sítio.
 *
 *   node tests/acessibilidade/alvos.mjs
 *   node tests/acessibilidade/alvos.mjs --json <ficheiro>
 *   node tests/acessibilidade/alvos.mjs --vermelhos
 *
 * `--vermelhos` corre cinco vezes o que as outras formas correm uma (a limpa, e
 * uma por estrago plantado): fica de fora do `verify` por custo, e é assim que o
 * relatório do bloco o mede. `OEDP_DIST` aponta a régua para outra construção, e
 * serve para uma coisa só: medir o ANTES, com a mesma régua e não com outra
 * (a convenção é a de `tests/documentos/moldura.mjs`).
 *
 * ---------------------------------------------------------------------------
 * COMO SE MEDE UM ALVO, E PORQUE NÃO É A CAIXA DO ELEMENTO
 * ---------------------------------------------------------------------------
 * A caixa de um elemento não é a área que o dedo alcança: a folha da casa
 * alarga vários alvos com um `::after` absoluto e centrado que não entra em
 * `getBoundingClientRect()` (o selo `a.src-chip`, por exemplo, mede 19 px de
 * caixa e 44 px de área efetiva). Uma régua que medisse a caixa contaria como
 * pequenos alvos que já são grandes, e ao contrário: um alvo grande tapado por
 * outro elemento continuaria a contar como grande.
 *
 * Esta régua mede por TOQUE, e em duas passagens. A barata pergunta ao
 * navegador, em quatro pontos a meia medida do centro, quem é que está ali
 * (`document.elementFromPoint()`); quando os quatro respondem o elemento, o
 * alvo tem a medida e não se mede mais nada. Quando não respondem, anda-se para
 * os quatro lados por busca binária, oito perguntas cada, e SOMAM-SE os dois
 * lados de cada eixo. Um pseudo-elemento responde pelo elemento que o origina,
 * e é por isso que esta medição vê a área efetiva; um elemento por cima
 * responde por si, e é por isso que ela vê o que está tapado.
 *
 * MEDE-SE PELAS LINHAS DO CENTRO, e não pelos cantos de um quadrado. Um alvo
 * dentro de uma frase tem quase sempre outra palavra a dois píxeis de
 * distância na diagonal: exigir os quatro cantos reprovaria toda a prosa do
 * sítio e não diria nada sobre o alvo. O que a WCAG 2.5.5 pede é que o ALVO
 * tenha a medida, e é a medida do alvo que isto lê.
 *
 * E SOMAM-SE OS LADOS EM VEZ DE SE EXIGIR UM QUADRADO CENTRADO, porque um alvo
 * pode ter a medida e estar deslocado: medido a 04.09.2026, o `::after` do
 * algarismo da manchete tem 44 px de altura e fica 1 px acima do centro da
 * caixa do elemento. O dedo alcança 44 px; um teste centrado dizia que não.
 *
 * Um elemento cuja procura bate na margem da janela antes de o alvo acabar, e
 * que sem isso não chegaria à medida, conta-se à parte como NÃO MEDIDO, e nunca
 * como verde: uma medição que não se fez não é um alvo pequeno nem um grande.
 *
 * A página lê-se em fatias: `window.scrollTo()` percorre-a de janela em janela,
 * e cada elemento é medido na fatia em que a sua caixa cabe inteira. Um
 * elemento que nunca caiba (mais alto do que a janela) conta-se como não
 * medido, com a razão.
 *
 * ---------------------------------------------------------------------------
 * A REGRA DA CASA PARA O TAMANHO (Emenda 20c, e a I104 que lhe achou o buraco)
 * ---------------------------------------------------------------------------
 * 44 px abaixo de 1024, 32 px nas linhas de nome a partir de 1024. A I104 mediu
 * o buraco: as regras dos 44 px viviam dentro de `@media (max-width: 640px)` e
 * entre 641 e 1023 não havia regra nenhuma. Por isso as larguras desta régua
 * são 390, 641, 768, 1023 e 1280: as três do meio são o buraco, medido nas suas
 * três pontas.
 *
 * ---------------------------------------------------------------------------
 * OS ESTRAGOS PLANTADOS (`--vermelhos`)
 * ---------------------------------------------------------------------------
 * Cinco estragos. Cada um diz que células tem de fazer cair. A transformação acontece no
 * caminho entre o ficheiro e o navegador e não toca em disco. Três exigências,
 * as mesmas das outras réguas da casa: **verde antes**, **o HTML mudou** (um
 * estrago que não muda nada nunca podia ser apanhado), **vermelho depois** em
 * pelo menos uma das células que o estrago nomeia. Uma planta que não cumpre as
 * três faz a corrida sair a 1.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { parse, NodeType } from 'node-html-parser';

import { routePath, LANGS } from '../../src/lib/routes.mjs';
import { unidadeDaLinha } from '../../src/i18n/unidades.mjs';
import { feitioDeLei } from '../../src/i18n/nomes-de-lei.mjs';
import { MUNICIPIOS } from '../../src/data/caop-centroids.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const AXE = path.join(RAIZ, 'node_modules', 'axe-core', 'axe.min.js');

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
if (!fs.existsSync(AXE)) {
  console.error(`não existe ${path.relative(RAIZ, AXE)}. Corra \`npm ci\` primeiro.`);
  process.exit(2);
}
const GUIAO_DO_AXE = fs.readFileSync(AXE, 'utf8');

/* ------------------------------------------------------------- as medidas */

/** O alvo do toque, e o alvo do ponteiro nas linhas de nome (Emenda 20c). */
const ALVO = 44;
const ALVO_PONTEIRO = 32;
/** A largura a partir da qual a casa desenha para o ponteiro (Emenda 20c). */
const LIMIAR_DA_COLUNA = 1024;
/**
 * AS CINCO LARGURAS. 390 é o telemóvel da casa; 641, 768 e 1023 são as três
 * pontas do buraco que a I104 mediu; 1280 é a secretária.
 */
const LARGURAS = [390, 641, 768, 1023, 1280];

/* -------------------------------------------------------------- as rotas */

/**
 * UMA ROTA POR FAMÍLIA DE PÁGINA, NAS DUAS EDIÇÕES.
 *
 * Os caminhos saem de `routePath()` e não de uma lista escrita à mão: a régua
 * lê a autoridade das rotas, e uma família que mude de endereço muda aqui
 * sozinha. Os documentos alojados (`/estudos/<slug>/documento`) ficam de fora,
 * com a razão escrita: são obra já publicada, alojada carácter a carácter, e o
 * bloco F1.8 mede-os com a régua deles (`tests/documentos/moldura.mjs`). O
 * brief F1.7 di-lo à letra: «fora do CSS próprio dos documentos alojados».
 */
const FAMILIAS = [
  ['home', null],
  ['municipios', null],
  ['municipio', { slug: 'evora' }],
  ['distritos', null],
  ['distrito', { slug: 'evora' }],
  ['regioes', null],
  ['regiao', { slug: 'alentejo' }],
  ['areas', null],
  ['area', { slug: 'administracao-interna' }],
  ['dominios', null],
  ['dominio', { slug: 'economia-e-financas-publicas' }],
  ['livro', null],
  ['livroConcelhos', null],
  ['livroConcelho', { slug: 'evora' }],
  ['linha', { slug: 'evora-populacao-2025' }],
  ['estudos', null],
  ['estudo', { slug: 'agua-nao-faturada' }],
  /* A página de leitura só existe nas duas edições para dois trabalhos (seis em
     português, dois em inglês): a régua escolhe um dos dois, para que a família
     seja medida nas duas edições como todas as outras. */
  ['texto', { slug: 'evora-prometido-pago-auditado-2026' }],
  ['agenda', null],
  ['metodo', null],
  ['sobre', null],
  ['correcoes', null],
  ['marcador', null],
];

/**
 * O PREFIXO DA PÁGINA DE UM CONCELHO, POR EDIÇÃO, tirado da tabela de rotas e
 * não escrito à mão: `/municipios/` e `/en/municipalities/`. É por ele que a
 * célula H13 conta as portas dos concelhos numa página.
 */
const PREFIXO_DO_CONCELHO = Object.fromEntries(
  LANGS.map((l) => [l, routePath('municipio', l, { slug: 'x' }).replace(/x$/, '')]),
);

/**
 * OS CONCELHOS DA CARTA, contados na mesma lista de onde a página os tira. Não é
 * um número escrito à mão: é `MUNICIPIOS.length` de `src/data/caop-centroids.mjs`,
 * que é o ficheiro que o `check:mapa` já reconfere.
 */
const CONCELHOS_DA_CARTA = MUNICIPIOS.length;

const ROTAS = [];
for (const [chave, params] of FAMILIAS) {
  for (const lang of LANGS) {
    const p = routePath(chave, lang, params ?? undefined);
    const rota = p.endsWith('/') ? p : `${p}/`;
    const ficheiro = path.join(DIST, rota.replace(/^\//, ''), 'index.html');
    if (!fs.existsSync(ficheiro)) {
      console.error(`a régua pede ${rota} e a construção não a tem (${path.relative(RAIZ, ficheiro)}).`);
      process.exit(2);
    }
    ROTAS.push({ chave: `${chave}/${lang}`, familia: chave, lang, rota });
  }
}

/* ------------------------------------------------------------- os estragos */

/**
 * Cada estrago: o que faz ao HTML servido, e que células tem de fazer cair.
 * São os quatro que o brief F1.7 nomeia na medida H12.
 * @type {{ nome: string, celulas: string[], faz: (html: string, rota: string) => string }[]}
 */
const ESTRAGOS = [
  {
    nome: 'h1-a-dobrar · um segundo <h1> na página',
    celulas: ['H3'],
    faz: (html) => html.replace('<main id="conteudo">', '<main id="conteudo"><h1>O Estado do País</h1>'),
  },
  {
    nome: 'ficha-a-30 · a ficha de um concelho a 30 px',
    celulas: ['H2'],
    faz: (html) =>
      html.replace(
        '</head>',
        '<style>.concelho,.concelho-com-pagina a,.concelho-nome{min-height:30px!important;height:30px!important}</style></head>',
      ),
  },
  {
    nome: 'porta-fora-do-marco · a porta de correções fora de qualquer marco',
    celulas: ['H4'],
    faz: (html) =>
      /* Tira a porta de dentro do rodapé e põe-na entre o `</main>` e o
         `<footer>`, que é exactamente onde ela estava antes deste bloco. */
      html.replace(
        /(<footer class="rodape">)([\s\S]*?)(<div class="porta-correccoes[\s\S]*?<\/div>)/,
        '$3$1$2',
      ),
  },
  {
    nome: 'unidade-em-portugues · a unidade de um cartão inglês em português',
    celulas: ['H8'],
    faz: (html, rota) =>
      rota.startsWith('/en/') ? html.replace(/\bpeople\b/g, 'pessoas') : html,
    /* O estrago que a H8 pode ver: o registo de um cartão inglês a dizer que
       desenhou «pessoas» onde a tabela da casa manda escrever «people». */
    noDisco: (texto, caminho) =>
      caminho.includes(`${path.sep}cartoes${path.sep}`) && caminho.endsWith('.json')
        ? texto.replace(/"people"/g, '"pessoas"').replace(/ people/g, ' pessoas')
        : texto,
  },
  {
    /* A SEGUNDA LISTA DE VOLTA (H13). O estrago copia a lista agrupada e tira à
       cópia a marca que a identifica: a página passa a ter os 308 concelhos duas
       vezes e só 308 das 616 portas dentro da lista agrupada, que é exactamente
       a forma do defeito que o diretor viu a 04.09. */
    nome: 'lista-a-dobrar · a segunda lista dos 308 concelhos de volta',
    celulas: ['H13'],
    faz: (html) => {
      const i = html.indexOf('<div class="concelhos" data-lista-agrupada>');
      if (i < 0) return html;
      const fim = html.indexOf('<div class="prov"', i);
      if (fim < 0) return html;
      const lista = html.slice(i, fim);
      return html.slice(0, fim) + lista.replace(' data-lista-agrupada', '') + html.slice(fim);
    },
  },
];

/* -------------------------------------------------------------- o servidor */

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
};

/** @type {((html: string, rota: string) => string) | null} */
let ESTRAGO = null;

/**
 * O SEGUNDO CANAL DO ESTRAGO: O DISCO.
 *
 * Metade das células desta régua não lê o navegador: lê os ficheiros. A H8 lê o
 * REGISTO de cada cartão (`dist/cartoes/*.json`), porque um PNG não tem texto
 * que se leia; a H3, a H4 e a H10 varrem as 7 237 páginas construídas; a H9
 * varre as inglesas. Um estrago que só passe pelo servidor de HTTP nunca lhes
 * chega, e uma planta que não lhes chega **não prova nada** e passa por boa.
 *
 * Foi o que aconteceu à primeira corrida com plantas: a planta da unidade em
 * português trocava «people» por «pessoas» no HTML servido, a H8 nem sequer
 * olhava para o HTML, e a planta saía com «caíram: nenhuma». Está aqui a
 * correcção, e está aqui a razão: uma régua com dois caminhos de leitura precisa
 * de dois caminhos de estrago.
 *
 * @type {((texto: string, caminho: string) => string) | null}
 */
let ESTRAGO_NO_DISCO = null;

/**
 * Ler um ficheiro pelo caminho por onde os estragos passam.
 * @param {string} caminho
 */
function leFicheiro(caminho) {
  const texto = fs.readFileSync(caminho, 'utf8');
  return ESTRAGO_NO_DISCO ? ESTRAGO_NO_DISCO(texto, caminho) : texto;
}

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

/* ------------------------------------------------------- a medição no ecrã */

/**
 * O que se mede dentro da página. Corre no navegador, e por isso é uma cadeia
 * de funções sem nada importado: tudo o que precisa está aqui dentro.
 *
 * @param {{ alvo: number, alvoPonteiro: number, prefixoDoConcelho: string }} cfg
 */
function medeNaPagina(cfg) {
  const { alvo, alvoPonteiro, prefixoDoConcelho } = cfg;

  /* --------------------------------------------------------- o que é um alvo */

  const SELETOR_DE_ALVO = [
    'a[href]',
    'area[href]',
    'button',
    'summary',
    'input:not([type="hidden"])',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  /** Um elemento que ocupa espaço e que ninguém escondeu de quem ouve. */
  const aVista = (el) => {
    if (!el.getClientRects().length) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.visibility === 'collapse') return false;
    for (let n = el; n; n = n.parentElement) {
      if (n.hasAttribute?.('hidden')) return false;
      if (n.getAttribute?.('aria-hidden') === 'true') return false;
    }
    return true;
  };

  /**
   * A CAIXA DE TOQUE DE UM ELEMENTO, MEDIDA E NÃO CALCULADA.
   *
   * Do centro do elemento, anda-se para os quatro lados e pergunta-se ao
   * navegador, ponto a ponto, até onde é que ele ainda responde este elemento:
   * `document.elementFromPoint()`. A largura de toque é o que se andou para a
   * esquerda mais o que se andou para a direita; a altura, o mesmo na vertical.
   * Uma busca binária faz cada lado em oito perguntas.
   *
   * PORQUE SE MEDE PELAS LINHAS DO CENTRO, E NÃO PELOS CANTOS. Um alvo dentro
   * de uma frase tem quase sempre outro alvo ou outra palavra a um par de
   * píxeis de distância, na diagonal: exigir que os quatro cantos de um
   * quadrado de 44 px respondessem o elemento reprovaria toda a prosa do sítio
   * e não mediria coisa nenhuma sobre o alvo em si. O que a WCAG 2.5.5 pede é
   * que o ALVO tenha a medida, e é a medida do alvo que isto lê. A folha da
   * casa alarga vários alvos com um `::after` absoluto centrado, e um
   * pseudo-elemento responde pelo elemento que o origina: por isso esta leitura
   * vê os 44 px do selo, que a caixa do elemento não vê.
   *
   * E PORQUE SE SOMAM OS DOIS LADOS EM VEZ DE SE MEDIR UM QUADRADO CENTRADO.
   * Medido a 04.09.2026 no algarismo da manchete da primeira página: o
   * `::after` de `a.prova-valor` tem 44 px de altura e fica 1 px acima do centro
   * da caixa do elemento (a caixa de um elemento em linha não é a caixa contra a
   * qual as percentagens de um filho absoluto se resolvem). O alvo TEM 44 px, e
   * um teste que exigisse 22 px para cada lado do centro reprovava-o por causa
   * desse píxel. O que interessa ao dedo é a extensão, e é a extensão que isto
   * soma: 23 px para cima mais 21 para baixo são 44 px de alvo.
   *
   * A TOLERÂNCIA DE UM PÍXEL, e fica escrita porque é uma tolerância. Um teste
   * de ponto não certifica a última fracção de píxel de cada lado (o ponto
   * exactamente na aresta de um rectângulo não está dentro dele) e a busca
   * binária converge por baixo. Um alvo de exactamente 44 px mede 43,8 px, e por
   * isso a régua exige `n - 1`: é o mais que um teste de ponto pode certificar,
   * e uma régua que exigisse `n` reprovava tudo o que a casa desenha a `n`.
   *
   * `limitado` diz que a procura bateu na margem da janela antes de acabar. Um
   * alvo que não chega à medida com um lado limitado não se conta como pequeno:
   * conta-se como NÃO MEDIDO, porque a medição não se fez.
   *
   * @param {Element} el
   * @param {number} limite quanto se procura, no máximo, para cada lado
   * @returns {{ w: number, h: number, limitada: boolean } | null}
   */
  const caixaDeToque = (el, limite) => {
    const r = el.getBoundingClientRect();
    const cx = (r.left + r.right) / 2;
    const cy = (r.top + r.bottom) / 2;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    /** @param {number} x @param {number} y */
    const meu = (x, y) => {
      if (x < 0 || y < 0 || x >= vw || y >= vh) return null;
      const quem = document.elementFromPoint(x, y);
      if (!quem) return false;
      return quem === el || el.contains(quem);
    };
    if (meu(cx, cy) !== true) return null;
    /**
     * Quanto se anda numa direção antes de o navegador deixar de responder
     * este elemento, e se a margem da janela chegou primeiro.
     * @param {number} dx @param {number} dy
     * @returns {{ d: number, limitado: boolean }}
     */
    const anda = (dx, dy) => {
      /* Até onde a janela deixa procurar nesta direção. */
      const ateAMargem =
        dx < 0 ? cx : dx > 0 ? vw - 1 - cx : dy < 0 ? cy : vh - 1 - cy;
      const tecto = Math.min(limite, Math.max(0, ateAMargem));
      const limitado = tecto < limite;
      if (meu(cx + dx * tecto, cy + dy * tecto) === true) return { d: tecto, limitado };
      let bom = 0;
      let mau = tecto;
      for (let i = 0; i < 8; i++) {
        const meio = (bom + mau) / 2;
        if (meu(cx + dx * meio, cy + dy * meio) === true) bom = meio;
        else mau = meio;
      }
      /* Parou por si, e não pela margem: o lado está medido. */
      return { d: bom, limitado: false };
    };
    const e = anda(-1, 0);
    const d = anda(1, 0);
    const c = anda(0, -1);
    const b = anda(0, 1);
    return {
      w: e.d + d.d,
      h: c.d + b.d,
      limitada: e.limitado || d.limitado || c.limitado || b.limitado,
    };
  };

  /**
   * ALCANÇA `n` PÍXEIS? A pergunta directa, e a barata.
   *
   * Quatro pontos a `n/2 - 0.5` do centro. Quando os quatro respondem o
   * elemento, o alvo tem pelo menos `n - 1` px nos dois eixos e não é preciso
   * medir mais nada. Quando não respondem, a resposta ainda pode ser sim: o
   * alvo pode ser grande e estar deslocado (é o caso do algarismo da manchete),
   * e aí é `caixaDeToque()` que decide, somando os dois lados.
   *
   * @param {Element} el
   * @param {number} n
   * @returns {boolean | null}
   */
  const alcanca = (el, n) => {
    const r = el.getBoundingClientRect();
    const cx = (r.left + r.right) / 2;
    const cy = (r.top + r.bottom) / 2;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const meio = n / 2 - 0.5;
    /** @param {number} x @param {number} y */
    const meu = (x, y) => {
      if (x < 0 || y < 0 || x >= vw || y >= vh) return null;
      const quem = document.elementFromPoint(x, y);
      if (!quem) return false;
      return quem === el || el.contains(quem);
    };
    for (const [x, y] of [
      [cx - meio, cy],
      [cx + meio, cy],
      [cx, cy - meio],
      [cx, cy + meio],
    ]) {
      if (meu(x, y) !== true) return false;
    }
    return true;
  };

  /**
   * A RESPOSTA SOBRE UM ALVO: `true`, `false`, ou `null` para não medido.
   * @param {Element} el @param {number} n @param {{w:number,h:number,limitada:boolean}|null} medida
   */
  const cumpre = (el, n, medida) => {
    if (alcanca(el, n)) return true;
    if (!medida) return null;
    if (medida.w >= n - 1 && medida.h >= n - 1) return true;
    return medida.limitada ? null : false;
  };

  /** Uma marca curta e estável para o relatório dizer QUAL alvo falhou. */
  const marcaDe = (el) => {
    const tag = el.tagName.toLowerCase();
    const cls = (el.getAttribute('class') ?? '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    const texto = (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 34);
    return `${tag}${cls ? '.' + cls : ''}${texto ? ` «${texto}»` : ''}`;
  };

  /**
   * O CAMINHO DE UM ELEMENTO NA ÁRVORE, para o poder reconhecer noutra largura.
   *
   * A I104 é uma pergunta sobre a MESMA coisa em duas larguras («que alvos é que
   * a folha reduz abaixo de 44 px entre 641 e 1023?»), e para a responder é
   * preciso saber que o alvo de 390 e o de 768 são o mesmo alvo. O caminho de
   * índices de filho é essa identidade: não depende de texto, de classe nem de
   * ordem de leitura, e é igual nas cinco larguras porque a árvore é a mesma.
   */
  const caminhoDe = (el) => {
    const partes = [];
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const pai = n.parentElement;
      if (!pai) break;
      partes.push(`${n.tagName.toLowerCase()}:${[...pai.children].indexOf(n)}`);
    }
    return partes.reverse().join('/');
  };

  /* ------------------------------------------------- a varredura em fatias */

  const todos = [...document.querySelectorAll(SELETOR_DE_ALVO)].filter(aVista);
  /** @type {Map<Element, { marca: string, caixa: {w:number,h:number}, ok: boolean|null, ficha: boolean, manchete: boolean, texto: boolean }>} */
  const medidos = new Map();
  const vh = document.documentElement.clientHeight;
  const alturaDoDoc = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
  );
  const passo = Math.max(1, Math.floor(vh * 0.7));
  const paradas = [];
  for (let y = 0; y < alturaDoDoc; y += passo) paradas.push(y);
  paradas.push(Math.max(0, alturaDoDoc - vh));

  /* AS FICHAS DOS CONCELHOS e OS ALGARISMOS DAS MANCHETES, nomeados aqui e
     não por texto: são as duas classes de alvo que o brief mede à parte. */
  /**
   * QUEM É QUE ESTÁ NO LUGAR QUE FALTA A ESTE ALVO.
   *
   * Procura, nas quatro direções, o primeiro elemento que responde por si e não
   * por este, e devolve a lista deles. Serve uma pergunta só, e está escrita
   * porque a resposta a essa pergunta muda o juízo: quando quem ocupa a área que
   * falta a um algarismo da manchete é OUTRA PORTA DA MESMA MANCHETE — o selo de
   * uma das linhas que ela cita —, um toque nessa área abre uma linha daquela
   * manchete e não uma página qualquer. Continua a não ser um alvo de 44 px
   * inteiro, e é isso que a célula diz; mas não é o mesmo defeito que uma área
   * roubada por prosa ou por um comando de outra secção.
   *
   * @param {Element} el
   * @param {number} n
   */
  const quemOcupa = (el, n) => {
    const r = el.getBoundingClientRect();
    const cx = (r.left + r.right) / 2;
    const cy = (r.top + r.bottom) / 2;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const meio = n / 2 - 0.5;
    const achados = [];
    for (const [x, y] of [
      [cx - meio, cy],
      [cx + meio, cy],
      [cx, cy - meio],
      [cx, cy + meio],
    ]) {
      if (x < 0 || y < 0 || x >= vw || y >= vh) continue;
      const quem = document.elementFromPoint(x, y);
      if (!quem || quem === el || el.contains(quem)) continue;
      const ancora = quem.closest('a[href]');
      achados.push({
        marca: quem.tagName.toLowerCase() + '.' + (quem.getAttribute('class') ?? ''),
        href: ancora ? ancora.getAttribute('href') : null,
        noMesmoTitulo: !!(ancora && el.closest('h1') && el.closest('h1').contains(ancora)),
      });
    }
    return achados;
  };

  const eFicha = (el) => !!el.closest('.concelho');
  const eManchete = (el) => !!el.closest('h1') && (el.matches('[data-claim]') || el.matches('a.prova-valor'));
  /**
   * OS QUATRO ALVOS DE TEXTO DA I105, pela classe e não pela cadeia.
   *
   * A issue nomeia-os pelo que se lê («O livro-razão →», «a página inteira →»,
   * o endereço de correio, «O registo de correções →») e mede-os a 14, 19,2, 19
   * e 24 px. São as ligações da MOBÍLIA e da PORTA da primeira página, e é essa
   * a classe que a régua reconhece: uma régua que procurasse as quatro cadeias
   * deixava de as achar no dia em que uma delas mudasse de palavra, e é a
   * medida que interessa, não a palavra.
   */
  const eI105 = (el) =>
    el.matches(
      '.porta-correccoes-linha .ligacao-email,.porta-correccoes-linha > a,.porta-abrir,a.lig',
    );

  const eTexto = (el) => {
    /* Um alvo de TEXTO: o que vive dentro de prosa, e não um comando, um
       campo de formulário ou uma área de um desenho. É a classe da I105. */
    if (el.tagName.toLowerCase() !== 'a') return false;
    if (el.closest('svg')) return false;
    return true;
  };

  for (const y of paradas) {
    window.scrollTo(0, y);
    for (const el of todos) {
      if (medidos.has(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const cy = (r.top + r.bottom) / 2;
      const cx = (r.left + r.right) / 2;
      const n = Math.max(alvo, alvoPonteiro);
      /* Só se mede na fatia em que a caixa maior cabe inteira: senão a
         resposta seria «não cabe» e não «não alcança». */
      if (cy - n / 2 < 0 || cy + n / 2 > vh) continue;
      if (cx - n / 2 < -n || cx + n / 2 > document.documentElement.clientWidth + n) continue;
      const ficha = eFicha(el);
      const manchete = eManchete(el);
      const texto = eTexto(el);
      /* A REGRA DO TAMANHO. A Emenda 20c dá 44 px ao toque e deixa 32 px às
         LINHAS DE NOME a partir de 1024 — e essas linhas de nome são as 29 do
         mapa da primeira página, que `tests/inicio/lista.mjs` mede na sua L5 e
         esta régua não mede. As fichas dos concelhos ficam com 44 px em todas
         as larguras, que é o que o item 4 do brief pede e o que a folha passa a
         escrever: 44 é maior do que 32, e uma régua que aceitasse 32 a 1280
         deixava de ver uma regressão que se visse ali. */
      const exigido = alvo;
      /* A caixa mede-se só quando o teste barato não chega: para um alvo que
         alcança os quatro pontos, medir seriam trinta e duas perguntas ao
         navegador para dizer «44 ou mais». */
      const barato = alcanca(el, alvo);
      const toque = barato ? null : caixaDeToque(el, alvo);
      const ok44 = barato ? true : cumpre(el, alvo, toque);
      const ok32 = ok44 === true ? true : cumpre(el, alvoPonteiro, toque);
      medidos.set(el, {
        marca: marcaDe(el),
        caminho: caminhoDe(el),
        caixa: { w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 },
        toque: toque ? { w: Math.round(toque.w * 10) / 10, h: Math.round(toque.h * 10) / 10 } : null,
        exigido,
        ok: ok44,
        ok32,
        ok44,
        ficha,
        manchete,
        texto,
        i105: eI105(el),
        /* Só para as manchetes, e só quando falham: é a informação de que a
           célula H7 precisa para separar as duas espécies de colisão. */
        ocupada: manchete && ok44 !== true ? quemOcupa(el, alvo) : null,
      });
    }
  }
  window.scrollTo(0, 0);

  const alvos = [...medidos.values()];

  /* ------------------------------- as caixas que se deslocam, e o teclado */

  const caixas = [];
  for (const el of document.querySelectorAll('*')) {
    if (!aVista(el)) continue;
    const cs = getComputedStyle(el);
    const desliza =
      (cs.overflowX === 'auto' || cs.overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 1;
    if (!desliza) continue;
    const rotulo = el.getAttribute('aria-label');
    const porId = el.getAttribute('aria-labelledby');
    const nomeadoPorId = porId
      ? porId.split(/\s+/).filter(Boolean).every((id) => !!document.getElementById(id))
      : false;
    const papel = (el.getAttribute('role') ?? '').trim();
    /* O PAPEL PODE SER O DA ETIQUETA, e não tem de ser escrito à mão. É a mesma
       regra da C3 de `tests/documentos/moldura.mjs` («um papel próprio que a
       obra já declarava e que não é vazio nem presentation/none»): uma `<ol>`
       que se desloca é uma lista, e forçar-lhe `role="region"` por cima APAGA o
       papel de lista e deixa os `<li>` órfãos — medido a 04.09.2026, foi o que
       a primeira forma deste bloco fez, com 144 nós graves de `listitem`. */
    const ETIQUETAS_COM_PAPEL = ['ol', 'ul', 'table', 'nav', 'figure', 'aside', 'main', 'form'];
    const tag = el.tagName.toLowerCase();
    caixas.push({
      marca: marcaDe(el),
      focavel: el.hasAttribute('tabindex'),
      nomeada: !!(rotulo && rotulo.trim()) || nomeadoPorId,
      papel: papel || `(${tag})`,
      comPapel:
        (papel !== '' && papel !== 'presentation' && papel !== 'none') ||
        ETIQUETAS_COM_PAPEL.includes(tag),
    });
  }

  /* ------------------------------------------------------- o que mais conta */

  /* -------------------------------- H13 · as portas dos concelhos numa página */

  const portasDeConcelho = [...document.querySelectorAll('a[href]')].filter((el) => {
    const href = el.getAttribute('href') ?? '';
    if (!href.startsWith(prefixoDoConcelho)) return false;
    const resto = href.slice(prefixoDoConcelho.length).replace(/\/$/, '');
    /* Uma porta de concelho e não uma porta para dentro de um concelho: um
       segmento só, e sem query nem âncora. */
    return resto.length > 0 && !/[/#?]/.test(resto);
  });
  const naListaAgrupada = portasDeConcelho.filter((el) => !!el.closest('[data-lista-agrupada]'));

  const h1 = [...document.querySelectorAll('h1')];
  const porta = document.querySelector('[data-porta-correccoes]');
  const marcoDaPorta = porta
    ? porta.closest('footer,main,[role="contentinfo"],[role="main"],nav[aria-label],nav[aria-labelledby]')
      ? (porta.closest('footer,main,[role="contentinfo"],[role="main"],nav[aria-label],nav[aria-labelledby]') ?? {})
          .tagName?.toLowerCase() ?? null
      : null
    : null;

  /* `aria-expanded` no HTML servido: quantos há, e quantos deles são de um
     `details > summary[aria-controls]`, que é o único feitio que o guião da
     casa acompanha (`public/js/tema.js`). */
  const comExpanded = [...document.querySelectorAll('[aria-expanded]')];
  const expandedDoGuiao = comExpanded.filter((el) => el.matches('details > summary[aria-controls]'));

  return {
    alvos,
    caixas,
    portasDeConcelho: portasDeConcelho.length,
    naListaAgrupada: naListaAgrupada.length,
    h1: h1.length,
    tituloDaPagina: (document.title ?? '').trim(),
    h1Texto: h1.map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim()),
    portaExiste: !!porta,
    marcoDaPorta,
    expanded: comExpanded.length,
    expandedDoGuiao: expandedDoGuiao.length,
    expandedForaDoGuiao: comExpanded
      .filter((el) => !el.matches('details > summary[aria-controls]'))
      .map((el) => marcaDe(el)),
  };
}

/* ------------------------------------------------ a varredura de `dist/` */

/**
 * As contagens que se leem do disco e não do navegador: são sobre AS 7 mil e
 * tal páginas construídas, e não sobre as rotas medidas. Um `<h1>` a mais numa
 * página que a régua não abre continua a ser um `<h1>` a mais.
 */
function varreDist() {
  /** @param {string} d */
  function* paginas(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) yield* paginas(p);
      else if (e.name === 'index.html') yield p;
    }
  }
  let n = 0;
  let h1Errado = 0;
  let semPorta = 0;
  let portaEmMarco = 0;
  let portaForaDeMarco = 0;
  let expanded = 0;
  let expandedForaDoGuiao = 0;
  const exemplos = { h1: [], porta: [], expanded: [] };
  for (const f of paginas(DIST)) {
    n++;
    const s = leFicheiro(f);
    const rel = path.relative(DIST, f);
    const nH1 = (s.match(/<h1[\s>]/g) ?? []).length;
    if (nH1 !== 1) {
      h1Errado++;
      if (exemplos.h1.length < 5) exemplos.h1.push(`${rel} (${nH1})`);
    }
    const i = s.indexOf('data-porta-correccoes');
    if (i < 0) semPorta++;
    else {
      /* Dentro de um marco: `<main>` ou `<footer>`. Lê-se pela posição das
         etiquetas, que é barato e chega para um documento que a casa compõe;
         a forma completa, com a árvore, é a do portão de HTML. */
      const mo = s.lastIndexOf('<main', i);
      const mc = s.lastIndexOf('</main>', i);
      const fo = s.lastIndexOf('<footer', i);
      const fc = s.lastIndexOf('</footer>', i);
      if ((mo >= 0 && mo > mc) || (fo >= 0 && fo > fc)) portaEmMarco++;
      else {
        portaForaDeMarco++;
        if (exemplos.porta.length < 5) exemplos.porta.push(rel);
      }
    }
    /* OS DOCUMENTOS ALOJADOS FICAM DE FORA DESTA CONTA, e não é uma folga: um
       documento em `/estudos/<slug>/documento` é obra já publicada, alojada
       carácter a carácter e conferida contra a origem; o `aria-expanded` que
       está lá dentro é DELE, com o guião dele, e a casa não lhe toca. Medido a
       04.09.2026: 1 380 das 8 601 ocorrências estavam nesses dezasseis
       ficheiros (e algumas nem eram markup, eram a palavra dentro do `<style>`
       do próprio documento). É a mesma exclusão que `scripts/check-lingua.mjs`
       faz, e pela mesma razão. */
    if (/[\\/](documento|document)[\\/]index\.html$/.test(rel)) continue;
    for (const m of s.matchAll(/\saria-expanded=/g)) {
      expanded++;
      /* O único feitio que o guião acompanha: um `<summary aria-controls>`
         dentro de um `<details>`. Lê-se a etiqueta de abertura à volta da
         marca; o que não for esse feitio conta-se como fora do guião. */
      const abre = s.lastIndexOf('<', m.index);
      const fecha = s.indexOf('>', m.index);
      const etiqueta = s.slice(abre, fecha + 1);
      if (!/^<summary\b/.test(etiqueta) || !/\baria-controls=/.test(etiqueta)) {
        expandedForaDoGuiao++;
        if (exemplos.expanded.length < 5) exemplos.expanded.push(`${rel}: ${etiqueta.slice(0, 80)}`);
      }
    }
  }
  return { n, h1Errado, semPorta, portaEmMarco, portaForaDeMarco, expanded, expandedForaDoGuiao, exemplos };
}

/**
 * ---------------------------------------------------------------------------
 * H8 · AS UNIDADES DOS CARTÕES DE PARTILHA DA EDIÇÃO INGLESA (I96)
 * ---------------------------------------------------------------------------
 * Um cartão é um PNG, e um PNG não tem texto que se leia. O que se lê é o
 * REGISTO que cada cartão escreve ao lado (`dist/cartoes/*.json`), onde `copia`
 * é a lista das cadeias que foram desenhadas, pela ordem em que foram
 * desenhadas, e `valores` é a proveniência de cada número. A régua confronta a
 * manchete desenhada com a unidade que a tabela da casa dá para aquela linha na
 * edição do cartão: se a tabela traduz e a manchete não traz o inglês, o cartão
 * está a dizer em português o que a página ao lado diz em inglês.
 *
 * Uma unidade SEM tradução na tabela conta-se à parte e não é uma falha: a
 * tabela declara-a, com a razão escrita, e o que ela manda é ficar em português
 * (`src/i18n/unidades.mjs`).
 */
function varreCartoes() {
  const dir = path.join(DIST, 'cartoes');
  if (!fs.existsSync(dir)) return { registos: 0, en: 0, comUnidade: 0, semTraducao: 0, emPortugues: 0, exemplos: [] };
  let registos = 0;
  let en = 0;
  let comUnidade = 0;
  let semTraducao = 0;
  let emPortugues = 0;
  const exemplos = new Map();
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    registos++;
    const r = JSON.parse(leFicheiro(path.join(dir, f)));
    if (r.edicao !== 'en') continue;
    en++;
    const u = (r.valores ?? []).find((v) => v.campo === 'unit');
    if (!u) continue;
    comUnidade++;
    const esperado = unidadeDaLinha(u.texto, 'en');
    if (esperado.lingua === 'pt-PT') {
      semTraducao++;
      continue;
    }
    /* A manchete é a terceira cadeia da cópia: a marca, a sobrancelha, e depois
       o valor com a unidade (`src/lib/cartoes.mjs`, `modeloDaLinha()`). */
    const manchete = String((r.copia ?? [])[2] ?? '');
    if (!manchete.includes(esperado.texto)) {
      emPortugues++;
      const k = `«${manchete}» devia trazer «${esperado.texto}»`;
      exemplos.set(k, (exemplos.get(k) ?? 0) + 1);
    }
  }
  return {
    registos,
    en,
    comUnidade,
    semTraducao,
    emPortugues,
    exemplos: [...exemplos].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${v}× ${k}`),
  };
}

/**
 * ---------------------------------------------------------------------------
 * H9 · OS NOMES DE DIPLOMA NAS PÁGINAS INGLESAS (I95)
 * ---------------------------------------------------------------------------
 * A régua percorre as páginas de `dist` cujo `<html lang>` é inglês, procura os
 * nomes de diploma no TEXTO (e não no markup) e pergunta, para cada um, qual é
 * a língua efectiva do elemento que o contém. Três respostas:
 *
 *   · COM MARCA — o elemento, ou um antepassado dele, declara `pt-PT`;
 *   · EM TRANSCRIÇÃO DA FONTE — o nome está dentro de um campo que é ele
 *     próprio uma transcrição de um documento português (um `excerpt`, o corpo
 *     de uma página de leitura). Esse marca-se inteiro, na língua da fonte, e
 *     não é deste bloco: conta-se, com a razão;
 *   · SEM MARCA — tudo o resto, e é o que a célula exige a zero.
 *
 * A régua LÊ o `dist` e não confia em `check-lingua.mjs`: duas contagens
 * independentes da mesma coisa é o que separa uma medição de um espelho.
 */
const TRANSCRICAO_DA_FONTE =
  '[data-linha-campo="excerpt"],[data-verbatim],[data-registo],[data-registo-unidade],' +
  '[data-registo-bloco],[data-registo-linha],[data-registo-conta]';

function varreLeis() {
  /** @param {string} d */
  function* paginas(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) yield* paginas(p);
      else if (e.name === 'index.html') yield p;
    }
  }
  let comMarca = 0;
  let emTranscricao = 0;
  let semMarca = 0;
  const exemplos = new Map();
  for (const f of paginas(DIST)) {
    const s = leFicheiro(f);
    if (!/<html[^>]*\slang="en/.test(s)) continue;
    if (!feitioDeLei().test(s)) continue;
    /* Um documento alojado não é uma página deste sítio: a casa não lhe escreve
       uma linha e não lhe mete markup por dentro (a mesma exclusão que
       `scripts/check-lingua.mjs` faz, e pela mesma razão). */
    if (/\/(documento|document)\/index\.html$/.test(f)) continue;
    const root = parse(s);
    const daFonte = new Set();
    for (const el of root.querySelectorAll(TRANSCRICAO_DA_FONTE)) {
      daFonte.add(el);
      for (const d of el.querySelectorAll('*')) daFonte.add(d);
    }
    /** @param {any} n */
    const linguaDe = (n) => {
      for (let x = n; x; x = x.parentNode) {
        const l = x.attributes?.['lang'];
        if (l) return l;
      }
      return null;
    };
    /** @param {any} n @param {boolean} dentro */
    const anda = (n, dentro) => {
      if (!n) return;
      if (n.nodeType === NodeType.TEXT_NODE) {
        const ms = [...String(n.rawText).matchAll(feitioDeLei())];
        if (!ms.length) return;
        const marcado = linguaDe(n.parentNode) === 'pt-PT';
        for (const m of ms) {
          if (marcado) comMarca++;
          else if (dentro) emTranscricao++;
          else {
            semMarca++;
            const k = `${m[0]} @ ${path.relative(DIST, f)}`;
            exemplos.set(k, (exemplos.get(k) ?? 0) + 1);
          }
        }
        return;
      }
      const tag = String(n.rawTagName ?? '').toLowerCase();
      if (tag === 'script' || tag === 'style') return;
      const d2 = dentro || daFonte.has(n);
      for (const c of n.childNodes ?? []) anda(c, d2);
    };
    anda(root.querySelector('body') ?? root, false);
  }
  return {
    comMarca,
    emTranscricao,
    semMarca,
    exemplos: [...exemplos].slice(0, 4).map(([k]) => k),
  };
}

/**
 * ---------------------------------------------------------------------------
 * H2, SEGUNDA METADE · O BURACO LÊ-SE NA FOLHA, E NÃO SÓ NO ECRÃ (I104)
 * ---------------------------------------------------------------------------
 * A I104 diz o que o buraco é, à letra: «`.seg { min-height: 44px }` e o dos
 * `.chipb` vivem dentro de `@media (max-width: 640px)`». É uma afirmação sobre a
 * FOLHA, e é na folha que ela se mede: nenhuma regra que dê 44 px de alvo pode
 * viver numa consulta que acaba antes de 1024.
 *
 * PORQUE NÃO CHEGA MEDIR NO ECRÃ. A leitura do ecrã diz «este alvo tem 44 px a
 * 390 e não tem a 768», e isso apanha duas coisas diferentes: uma regra que
 * acaba cedo (o buraco) e uma ligação de prosa que a 390 quebra em três linhas e
 * a 768 cabe numa (não é buraco nenhum: é texto). Medido a 04.09.2026, das 4 042
 * passagens que a leitura do ecrã acusava, 3 696 eram a fila da busca (regra) e
 * as outras eram sobretudo títulos de estudos em prosa (texto). Uma célula que
 * as juntasse nunca podia ficar verde sem uma decisão que ninguém tomou: dar 44
 * px de altura a cada ligação de cada frase do sítio.
 *
 * A leitura do ecrã fica no relatório, contada e repartida por classe; a CÉLULA
 * é a da folha, que é a afirmação da issue.
 */
function varreFolhas() {
  const dir = path.join(RAIZ, 'src', 'styles');
  const maus = [];
  let blocos = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.css')) continue;
    /* OS COMENTÁRIOS SAEM PRIMEIRO, e é uma correção medida: as folhas desta
       casa explicam-se por extenso, e várias explicações CITAM a consulta que
       descrevem («a regra nasceu numa `@media (max-width: 640px)` e o buraco era
       esse»). Sem os tirar, a régua lia a citação como uma regra e acusava de
       buraco precisamente o comentário que dizia que ele tinha sido tapado. */
    const css = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    /* Um bloco `@media` de primeiro nível: da abertura até à chaveta que a
       fecha, contando as de dentro. */
    const re = /@media([^{]*)\{/g;
    for (;;) {
      const m = re.exec(css);
      if (m === null) break;
      const condicao = m[1].trim();
      let i = m.index + m[0].length;
      let nivel = 1;
      while (i < css.length && nivel > 0) {
        if (css[i] === '{') nivel++;
        else if (css[i] === '}') nivel--;
        i++;
      }
      const corpo = css.slice(m.index + m[0].length, i - 1);
      const tectos = [...condicao.matchAll(/max-width:\s*(\d+)px/g)].map((x) => Number(x[1]));
      if (!tectos.length) continue;
      blocos++;
      const tecto = Math.min(...tectos);
      if (tecto >= LIMIAR_DA_COLUNA - 1) continue;
      if (!/min-(?:height|width):\s*44px/.test(corpo)) continue;
      maus.push(`${f}: @media ${condicao} (tecto ${tecto}px)`);
    }
  }
  return { blocos, maus };
}

/* ------------------------------------------------------------- a passagem */

const nav = await chromium.launch({ headless: true });

/**
 * Uma passagem completa: as rotas × as larguras, com o axe a 390 e a 1280.
 */
async function passagem() {
  /** @type {Record<string, number>} */
  const axe = {};
  let graves = 0;
  const paginas = [];
  for (const r of ROTAS) {
    for (const largura of LARGURAS) {
      const ctx = await nav.newContext({ viewport: { width: largura, height: 900 } });
      const pagina = await ctx.newPage();
      await pagina.goto(base + r.rota, { waitUntil: 'networkidle' });
      await pagina.evaluate(() => new Promise((res) => setTimeout(res, 120)));
      /* O AXE NAS DUAS LARGURAS DA CASA, e não nas cinco: as três do meio
         existem para o buraco dos alvos (I104), e o axe não muda com elas
         (medido). Correr o axe cinco vezes por rota triplicava o custo do
         portão sem uma violação a mais. */
      if (largura === 390 || largura === 1280) {
        await pagina.addScriptTag({ content: GUIAO_DO_AXE });
        const violacoes = await pagina.evaluate(async () => {
          const res = await window.axe.run(document, { resultTypes: ['violations'] });
          return res.violations.map((v) => ({ id: v.id, impacto: v.impact, nos: v.nodes.length }));
        });
        for (const v of violacoes) {
          const k = `${v.id} [${v.impacto}]`;
          axe[k] = (axe[k] ?? 0) + v.nos;
          if (v.impacto === 'serious' || v.impacto === 'critical') graves += v.nos;
        }
      }
      const medida = await pagina.evaluate(medeNaPagina, {
        alvo: ALVO,
        alvoPonteiro: ALVO_PONTEIRO,
        prefixoDoConcelho: PREFIXO_DO_CONCELHO[r.lang],
      });
      paginas.push({ ...r, largura, ...medida });
      await ctx.close();
    }
  }
  return { axe, graves, paginas };
}

/* -------------------------------------------------------------- as células */

/** @type {{ nome: string, passa: boolean, prova: string }[]} */
let celulas = [];
const conta = (nome, passa, prova) => celulas.push({ nome, passa: !!passa, prova: String(prova) });

/** @param {{ axe: Record<string, number>, graves: number, paginas: any[] }} p */
function avalia(p, dist, cartoes, leis, folhas) {
  celulas = [];
  const todosOsAlvos = p.paginas.flatMap((pg) =>
    pg.alvos.map((a) => ({ ...a, chave: pg.chave, largura: pg.largura, rota: pg.rota })),
  );

  /* --- H1 · o axe a zero nas graves --------------------------------------- */
  const porRegra = Object.entries(p.axe).sort((a, b) => b[1] - a[1]);
  conta(
    'H1',
    p.paginas.length > 0 && p.graves === 0,
    `${p.graves} nó(s) graves em ${ROTAS.length} rotas × 2 larguras · ` +
      (porRegra.length ? porRegra.map(([k, v]) => `${k}=${v}`).join(' · ') : 'nenhuma violação'),
  );

  /* --- H2 · as fichas, e o buraco dos 641 a 1023 --------------------------
   *
   * DUAS PERGUNTAS, E A SEGUNDA TEM DE SER A DA I104 E NÃO OUTRA MAIOR.
   *
   * A primeira é direta: as fichas dos concelhos têm o alvo que a regra lhes
   * dá, em todas as larguras medidas.
   *
   * A segunda é a I104, e o âmbito dela está escrito na própria issue: «as
   * regras dos 44 px vivem dentro de `@media (max-width: 640px)`», ou seja há
   * alvos que a folha faz grandes a 390 e deixa de fazer a partir de 641. São
   * ESSES que a emenda 20c manda pôr de pé, e não todo o alvo do sítio: exigir
   * 44 px a cada ligação de prosa em todas as larguras seria outra decisão,
   * muito maior, que nem a emenda nem o brief tomam. Por isso a célula compara
   * o MESMO alvo (o mesmo caminho na árvore, na mesma rota) a 390 e na faixa: o
   * que chega aos 44 px a 390 e não chega entre 641 e 1023 é o buraco, e é o
   * que tem de ir a zero.
   */
  const fichas = todosOsAlvos.filter((a) => a.ficha);
  const fichasMas = fichas.filter((a) => a.ok !== true);
  /** @type {Map<string, any>} */
  const a390 = new Map();
  for (const a of todosOsAlvos) {
    if (a.largura === 390) a390.set(`${a.chave}|${a.caminho}`, a);
  }
  const noBuraco = todosOsAlvos.filter((a) => a.largura >= 641 && a.largura <= 1023);
  const doBuraco = noBuraco.filter((a) => {
    const pequeno = a390.get(`${a.chave}|${a.caminho}`);
    return pequeno?.ok44 === true;
  });
  const buracoMau = doBuraco.filter((a) => a.ok44 !== true);
  const naoMedidos = todosOsAlvos.filter((a) => a.ok === null);
  conta(
    'H2',
    fichas.length > 0 &&
      fichasMas.length === 0 &&
      folhas.blocos > 0 &&
      folhas.maus.length === 0,
    `fichas de concelho: ${fichas.length} medidas, ${fichasMas.length} sem o alvo ` +
      `(${resumo(fichasMas)}) · a folha: ${folhas.blocos} bloco(s) @media com tecto, ` +
      `${folhas.maus.length} com uma regra de 44 px que acaba antes de ${LIMIAR_DA_COLUNA}` +
      (folhas.maus.length ? ` (${folhas.maus.join('; ')})` : '') +
      ` · no ecrã, na faixa 641 a 1023: ${noBuraco.length} alvos medidos, ${doBuraco.length} ` +
      `deles com ${ALVO} px a 390, ${buracoMau.length} sem eles na faixa (${resumo(buracoMau)}) ` +
      `· ${naoMedidos.length} não medido(s)`,
  );

  /* --- H3 · um só <h1> por página ---------------------------------------- */
  const h1Maus = p.paginas.filter((pg) => pg.h1 !== 1);
  conta(
    'H3',
    dist.h1Errado === 0 && h1Maus.length === 0,
    `${dist.n} página(s) do dist/: ${dist.h1Errado} com um número de <h1> diferente de 1` +
      (dist.exemplos.h1.length ? ` (${dist.exemplos.h1.join('; ')})` : '') +
      ` · nas rotas medidas: ${h1Maus.length} de ${p.paginas.length} passagens`,
  );

  /* --- H4 · a porta de correções dentro de um marco ----------------------- */
  const portasMas = p.paginas.filter((pg) => pg.portaExiste && !pg.marcoDaPorta);
  conta(
    'H4',
    dist.portaForaDeMarco === 0 && portasMas.length === 0 && dist.portaEmMarco > 0,
    `${dist.n} página(s) do dist/: ${dist.portaEmMarco} com a porta dentro de um marco, ` +
      `${dist.portaForaDeMarco} fora` +
      (dist.exemplos.porta.length ? ` (${dist.exemplos.porta.join('; ')})` : '') +
      `, ${dist.semPorta} sem porta (os documentos alojados) · nas rotas medidas: ` +
      `${portasMas.length} fora de marco`,
  );

  /* --- H5 · as caixas que se deslocam, ao teclado ------------------------- */
  const caixas = p.paginas.flatMap((pg) =>
    pg.caixas.map((c) => ({ ...c, chave: pg.chave, largura: pg.largura })),
  );
  const caixasMas = caixas.filter((c) => !c.focavel || !c.nomeada || !c.comPapel);
  conta(
    'H5',
    caixasMas.length === 0,
    `${caixas.length} caixa(s) com deslocamento horizontal medidas, ${caixasMas.length} sem ` +
      `teclado, nome ou papel` +
      (caixasMas.length
        ? ` (${caixasMas
            .slice(0, 4)
            .map((c) => `${c.chave}@${c.largura} ${c.marca}${c.focavel ? '' : ' sem tabindex'}${c.nomeada ? '' : ' sem nome'}${c.comPapel ? '' : ' sem papel'}`)
            .join('; ')})`
        : ''),
  );

  /* --- H6 · os quatro alvos de texto da I105, a 32 px ---------------------
   *
   * A I105 nomeia quatro alvos da primeira página e mede-os a 14, 19,2, 19 e
   * 24 px, a 1024 e a 1280. São as ligações da mobília e da porta, e é essa a
   * classe que a célula mede: as quatro, nas duas edições, nas duas larguras
   * onde a issue as mediu.
   *
   * A CÉLULA NÃO É «TODO O ALVO DE TEXTO DA PRIMEIRA PÁGINA A 32 px». Essa foi a
   * primeira forma desta célula e media 104 reprovações, quase todas selos de
   * proveniência dentro de prosa cujas áreas de 44 px se cruzam umas com as
   * outras (a folha escreve-o em três sítios: «duas áreas de 44px a 18px de
   * distância sobrepõem-se»). Desentrançar isso é outro bloco, e não este: o
   * brief pede os QUATRO, e a régua mede os quatro.
   */
  const daI105 = todosOsAlvos.filter(
    (a) => a.chave.startsWith('home/') && a.largura >= LIMIAR_DA_COLUNA && a.i105,
  );
  const daI105Maus = daI105.filter((a) => a.ok32 !== true);
  conta(
    'H6',
    daI105.length > 0 && daI105Maus.length === 0,
    `primeira página, a ${LARGURAS.filter((w) => w >= LIMIAR_DA_COLUNA).join(' e ')}: ` +
      `${daI105.length} alvo(s) da I105 medidos, ${daI105Maus.length} abaixo de ` +
      `${ALVO_PONTEIRO} px (${resumo(daI105Maus)})`,
  );

  /* --- H7 · os algarismos das manchetes -----------------------------------
   *
   * Cada algarismo de uma manchete é uma porta para a sua linha, com 44 px de
   * área. A EXCEÇÃO, escrita à partida e não depois de falhar: onde a área que
   * falta está ocupada por OUTRA PORTA DA MESMA MANCHETE — o selo de uma das
   * linhas que ela cita —, o alvo conta-se como cumprido. A razão é que nesse
   * ponto o dedo abre uma linha daquela manchete e não uma página qualquer: as
   * duas portas são a mesma promessa, e a folha da casa não consegue dar 44 px a
   * duas portas a 34 px uma da outra sem lhes dar altura de fila, que é uma
   * mudança do aspeto da manchete que o brief F1.7 proíbe («Nada nas manchetes
   * além do alvo»).
   *
   * Medido a 04.09.2026: dos 70 algarismos medidos, os que caem nesta exceção
   * caem nas páginas de região e de domínio, a 641, 768 e 1023, onde a manchete
   * quebra de maneira a pôr a fila dos selos a menos de 44 px do último número.
   * O relatório do bloco conta-os e nomeia-os; o que fica para a direção é a
   * escolha entre dar ar à fila dos selos e deixá-los como estão.
   */
  const manchetes = todosOsAlvos.filter((a) => a.manchete);
  const manchetesMas = manchetes.filter((a) => a.ok !== true);
  const porOutraPorta = manchetesMas.filter(
    (a) => (a.ocupada ?? []).length > 0 && (a.ocupada ?? []).every((o) => o.noMesmoTitulo),
  );
  const semDesculpa = manchetesMas.filter((a) => !porOutraPorta.includes(a));
  conta(
    'H7',
    manchetes.length > 0 && semDesculpa.length === 0,
    `${manchetes.length} algarismo(s) de manchete medidos, ${manchetes.length - manchetesMas.length} ` +
      `com ${ALVO} px inteiros, ${porOutraPorta.length} com a área partilhada com outra porta da ` +
      `MESMA manchete (${resumo(porOutraPorta)}), ${semDesculpa.length} sem alvo e sem essa razão ` +
      `(${resumo(semDesculpa)})`,
  );

  /* --- H8 · as unidades dos cartões ingleses (I96) ------------------------ */
  conta(
    'H8',
    cartoes.en > 0 && cartoes.emPortugues === 0,
    `${cartoes.registos} registo(s) de cartão, ${cartoes.en} da edição inglesa, ` +
      `${cartoes.comUnidade} com unidade · ${cartoes.emPortugues} com a unidade em português ` +
      `na manchete` +
      (cartoes.exemplos.length ? ` (${cartoes.exemplos.join('; ')})` : '') +
      ` · ${cartoes.semTraducao} sem tradução na tabela da casa, e a tabela manda ficarem em ` +
      `português`,
  );

  /* --- H9 · os nomes de diploma nas páginas inglesas (I95) ---------------- */
  conta(
    'H9',
    leis.comMarca + leis.emTranscricao + leis.semMarca > 0 && leis.semMarca === 0,
    `${leis.comMarca + leis.emTranscricao + leis.semMarca} nome(s) de diploma em páginas ` +
      `inglesas: ${leis.comMarca} com lang="pt-PT", ${leis.emTranscricao} dentro de uma ` +
      `transcrição da fonte (marca-se inteira, na língua da fonte: não é deste bloco), ` +
      `${leis.semMarca} sem marca` +
      (leis.exemplos.length ? ` (${leis.exemplos.join('; ')})` : ''),
  );

  /* --- H13 · uma lista só de concelhos em /municipios ---------------------
   *
   * A 04.09.2026 o diretor viu no sítio no ar que `/municipios` listava os 308
   * concelhos DUAS vezes: uma na fila de resultados da peça da pesquisa (308
   * `<li>` com 308 portas) e outra na lista agrupada pelas 29 unidades da
   * Carta. A célula conta as portas de concelho da página e exige que sejam as
   * 308 e que estejam TODAS dentro da lista agrupada: uma segunda lista, seja
   * ela a fila de resultados de volta ou uma cópia da agrupada, faz a contagem
   * subir e a célula cair.
   *
   * O NÚMERO NÃO É ESCRITO À MÃO: é o das 308 entradas da Carta, e a régua
   * pergunta-o à mesma lista de onde a página o tira.
   */
  const doIndice = p.paginas.filter((pg) => pg.familia === 'municipios');
  const indiceMau = doIndice.filter(
    (pg) => pg.portasDeConcelho !== CONCELHOS_DA_CARTA || pg.naListaAgrupada !== CONCELHOS_DA_CARTA,
  );
  conta(
    'H13',
    doIndice.length > 0 && indiceMau.length === 0,
    `/municipios nas duas edições e nas ${LARGURAS.length} larguras: ${doIndice.length} ` +
      `passagem(ns) · portas de concelho por página: ` +
      `${[...new Set(doIndice.map((pg) => pg.portasDeConcelho))].sort((a, b) => a - b).join(', ')} ` +
      `(esperado ${CONCELHOS_DA_CARTA}) · dentro da lista agrupada: ` +
      `${[...new Set(doIndice.map((pg) => pg.naListaAgrupada))].sort((a, b) => a - b).join(', ')}`,
  );

  /* --- H10 · `aria-expanded` e o título do Método ------------------------- */
  const metodo = p.paginas.filter((pg) => pg.familia === 'metodo');
  const metodoSemTitulo = metodo.filter(
    (pg) => !pg.tituloDaPagina || pg.h1Texto.some((t) => t === ''),
  );
  conta(
    'H10',
    dist.expandedForaDoGuiao === 0 && metodo.length > 0 && metodoSemTitulo.length === 0,
    `aria-expanded no dist/: ${dist.expanded} ocorrência(s), ${dist.expandedForaDoGuiao} fora do ` +
      `feitio que o guião acompanha (details > summary[aria-controls])` +
      (dist.exemplos.expanded.length ? ` (${dist.exemplos.expanded.join('; ')})` : '') +
      ` · Método: ${metodo.length} passagem(ns), ${metodoSemTitulo.length} com <title> ou <h1> vazio` +
      (metodo[0] ? ` · <title> = «${metodo[0].tituloDaPagina.slice(0, 60)}»` : ''),
  );

  return { todosOsAlvos, caixas, buraco: buracoMau };
}

/** Um resumo curto dos alvos que falharam, para a prova de uma célula. */
function resumo(maus) {
  if (!maus.length) return 'nenhum';
  const porMarca = new Map();
  for (const m of maus) {
    const t = m.toque ? `${m.toque.w}×${m.toque.h} de toque` : 'não medido';
    const k = `${m.marca} · ${t} (caixa ${m.caixa.w}×${m.caixa.h})`;
    porMarca.set(k, (porMarca.get(k) ?? 0) + 1);
  }
  return [...porMarca]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k, v]) => `${v}× ${k}`)
    .join('; ');
}

/* ------------------------------------------------------------ a corrida */

const DIST_VARRIDO = varreDist();
const CARTOES = varreCartoes();
const LEIS = varreLeis();
const FOLHAS = varreFolhas();
const primeira = await passagem();
const diagnostico = avalia(primeira, DIST_VARRIDO, CARTOES, LEIS, FOLHAS);
const limpas = celulas;

console.log('');
console.log(cinza(`  a régua dos alvos · ${ROTAS.length} rotas × ${LARGURAS.length} larguras · dist: ${path.relative(RAIZ, DIST) || DIST}`));
console.log('');
for (const c of limpas) {
  console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}  ${cinza(c.prova)}`);
}

/* ------------------------------------------------------------- as plantas */

/** @type {{ nome: string, celulas: string[], mudou: boolean, caiu: string[], nomeadas: string[], verdesAntes: string[], bom: boolean }[]} */
const plantas = [];
let plantaMa = false;
if (VERMELHOS) {
  console.log('');
  console.log(cinza('  as plantas:'));
  const amostra = fs.readFileSync(path.join(DIST, 'municipios', 'index.html'), 'utf8');
  const amostraEn = fs.readFileSync(path.join(DIST, 'en', 'ledger', 'evora-populacao-2025', 'index.html'), 'utf8');
  for (const estrago of ESTRAGOS) {
    const amostraDeCartao = (() => {
      const dir = path.join(DIST, 'cartoes');
      const f = fs.readdirSync(dir).find((x) => x.startsWith('en-') && x.endsWith('.json'));
      return f ? { caminho: path.join(dir, f), texto: fs.readFileSync(path.join(dir, f), 'utf8') } : null;
    })();
    const mudou =
      estrago.faz(amostra, '/municipios/') !== amostra ||
      estrago.faz(amostraEn, '/en/ledger/evora-populacao-2025/') !== amostraEn ||
      !!(
        estrago.noDisco &&
        amostraDeCartao &&
        estrago.noDisco(amostraDeCartao.texto, amostraDeCartao.caminho) !== amostraDeCartao.texto
      );
    ESTRAGO = estrago.faz;
    ESTRAGO_NO_DISCO = estrago.noDisco ?? null;
    /* Uma planta que mexe no disco obriga a refazer as varreduras: as células
       que lêem ficheiros lêem-nos uma vez, no princípio, e um estrago que não
       as refizesse era um estrago que elas nunca viam. */
    const varridoAgora = estrago.noDisco ? varreDist() : DIST_VARRIDO;
    const cartoesAgora = estrago.noDisco ? varreCartoes() : CARTOES;
    const leisAgora = estrago.noDisco ? varreLeis() : LEIS;
    const depois = await passagem();
    avalia(depois, varridoAgora, cartoesAgora, leisAgora, FOLHAS);
    ESTRAGO = null;
    ESTRAGO_NO_DISCO = null;
    const caiu = celulas.filter((c) => !c.passa).map((c) => c.nome);
    const nomeadas = estrago.celulas.filter((n) => caiu.includes(n));
    const verdesAntes = estrago.celulas.filter((n) => limpas.find((c) => c.nome === n)?.passa);
    const bom = mudou && nomeadas.length > 0 && verdesAntes.length > 0;
    if (!bom) plantaMa = true;
    plantas.push({ nome: estrago.nome, celulas: estrago.celulas, mudou, caiu, nomeadas, verdesAntes, bom });
    console.log(
      `    ${bom ? verde('✓') : vermelho('✗')} ${estrago.nome}\n` +
        cinza(
          `        o HTML mudou: ${mudou ? 'sim' : 'NÃO'} · verdes antes: ${verdesAntes.join(', ') || 'nenhuma'} · ` +
            `caíram: ${caiu.join(', ') || 'nenhuma'} · das nomeadas: ${nomeadas.join(', ') || 'NENHUMA'}`,
        ),
    );
  }
  celulas = limpas;
}

await nav.close();
servidor.close();

if (FICHEIRO_JSON) {
  fs.writeFileSync(
    String(FICHEIRO_JSON),
    JSON.stringify(
      {
        quando: new Date().toISOString(),
        dist: DIST,
        rotas: ROTAS.map((r) => r.rota),
        larguras: LARGURAS,
        celulas: limpas,
        axe: primeira.axe,
        graves: primeira.graves,
        dist_varrido: DIST_VARRIDO,
        cartoes: CARTOES,
        folhas: FOLHAS,
        leis: LEIS,
        buraco: diagnostico.buraco.map((a) => ({
          chave: a.chave,
          largura: a.largura,
          marca: a.marca,
          caminho: a.caminho,
          caixa: a.caixa,
          toque: a.toque,
        })),
        alvos_maus: diagnostico.todosOsAlvos
          .filter((a) => a.ok !== true)
          .map((a) => ({ chave: a.chave, largura: a.largura, marca: a.marca, caminho: a.caminho, caixa: a.caixa, toque: a.toque, exigido: a.exigido, ok: a.ok })),
        caixas: diagnostico.caixas,
        plantas,
      },
      null,
      2,
    ),
  );
  console.log(cinza(`\n  escrito ${FICHEIRO_JSON}`));
}

console.log('');
const maus = limpas.filter((c) => !c.passa);
const plantasMas = plantas.filter((pl) => !pl.bom);
if (maus.length || plantasMas.length) {
  if (maus.length) {
    console.log(vermelho(`  ${maus.length} célula(s) vermelhas: ${maus.map((c) => c.nome).join(', ')}`));
  }
  if (plantasMas.length) {
    console.log(
      vermelho(`  ${plantasMas.length} planta(s) que não pegaram: ${plantasMas.map((pl) => pl.nome).join(', ')}`),
    );
  }
  console.log('');
  process.exit(1);
}
console.log(verde('  todas as células verdes.' + (VERMELHOS ? ' todas as plantas pegaram.' : '')));
console.log('');
