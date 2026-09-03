#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DA MOLDURA · bloco F1.8, 03.09.2026 (segunda passagem, mesma data)
 * =============================================================================
 *
 * Uma célula por medida de aceitação do brief F1.8, medida em Chromium sem
 * cabeça sobre `dist/`, nos dezasseis documentos alojados, nos dois temas que
 * eles próprios declaram e nas duas larguras da casa (390 e 1 280 px: Major 8,
 * segunda passagem). É UM PORTÃO: entra em `npm run verify` (`check:moldura`)
 * e sai com 1 quando alguma célula falha, como as outras réguas do sítio.
 *
 *   node tests/documentos/moldura.mjs
 *   node tests/documentos/moldura.mjs --json <ficheiro>
 *   node tests/documentos/moldura.mjs --vermelhos
 *
 * `--vermelhos` corre cinco vezes o que as outras formas correm uma (a
 * limpa, e uma por estrago plantado): fica de fora do `verify` por custo, e é
 * assim que o relatório do bloco o mede.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * C1 · O AXE A ZERO NAS GRAVES. `axe-core` corrido sobre a página inteira, nos
 * dezasseis, nos dois temas e nas duas larguras, e contadas as violações de
 * impacto «serious» e «critical». Conta-se a página INTEIRA e não só a
 * moldura, porque é a página inteira que o leitor recebe; o relatório do
 * bloco separa depois o que é da moldura do que é do corpo da obra citada.
 *
 * C2 · O CONTRASTE, MEDIDO E NÃO AFIRMADO. Duas coisas, contra o fundo que o
 * navegador de facto compõe por baixo (a pilha de fundos até à raiz, composta
 * de baixo para cima, como o axe faz, com a `opacity` de cada nó incluída:
 * Major 7, segunda passagem — ver `filetEfetivo()` e `fundoDe()`, abaixo):
 *
 *   · os FILETES da grelha das tabelas e da caixa que envolve uma tabela, a
 *     pelo menos 3:1 contra os DOIS fundos que tocam (o de dentro, composto
 *     pelo próprio elemento, e o de fora, do elemento-mãe), que é o que a
 *     WCAG 2.1 §1.4.11 pede a um objeto de interface: distinguir-se de CADA
 *     fundo que o toca, e não só de um dos dois;
 *   · o TEXTO PRÓPRIO das células, a pelo menos 4,5:1. «Próprio» é o texto que
 *     está debaixo do `<th>` ou do `<td>` e herda a cor dele; um filho que
 *     declare a sua cor não é texto da célula, é um selo da obra citada, e o
 *     relatório do bloco conta-os à parte com a razão por que a moldura não
 *     lhes toca (Blocking 4, segunda passagem: onde esse selo falha 4,5:1, a
 *     moldura já lá chega por outra via — `estiloDosAjustesDeCor()`, em
 *     `src/lib/documentos.mjs` — e por isso os selos, aqui, contam-se a
 *     zero).
 *
 * C3 · O TECLADO CHEGA A CADA CAIXA QUE SE DESLOCA. Procuram-se todas as caixas
 * que de facto se deslocam (estilo calculado `auto` ou `scroll` no eixo em que
 * o conteúdo não cabe, nas duas larguras) e exige-se de cada uma: focável
 * (`tabindex`), nomeada (`aria-label`, ou `aria-labelledby` que aponte para um
 * `id` que EXISTE: um `id` que o documento não tem não nomeia nada, Minor 11)
 * e com marco: `role="region"`, ou um papel próprio que a obra já declarava e
 * que não é vazio nem `presentation`/`none` (Minor 11 — um `role="tablist"`
 * já existente, por exemplo, fica com o seu, porque forçar `region` por cima
 * apagava um papel mais específico e correcto). E os nomes têm de ser
 * DISTINTOS na página: dois marcos com o mesmo nome mandam quem ouve escolher
 * entre coisas que soam iguais.
 *
 * C4 · UM MARCO PRINCIPAL E UM TÍTULO. `<main>` a um e `<h1>` VISÍVEL a um em
 * cada uma das passagens: visível quer dizer que ocupa espaço
 * (`getClientRects`), que `visibility` calculada não é `hidden`/`collapse`, e
 * que nem ele nem nenhum antepassado tem `aria-hidden="true"` (Minor 11,
 * segunda passagem — a primeira forma só perguntava pelas caixas do
 * `getClientRects`).
 *
 * C5 · O QUE É DA CASA CONTRA A PALETA DA CASA; O QUE É DA OBRA CONTRA O
 * CONTRASTE (Major 6, segunda passagem escreve a regra assim, por decisão do
 * lugar de direção). A moldura e os filetes das tabelas usam só cores da casa
 * — a lista é a da folha da casa, lida de `src/styles/tokens.css` nos dois
 * blocos e com os `var()` resolvidos — e o que se compara com ela são os
 * filetes que a moldura declara seus: a grelha das tabelas, a caixa que
 * envolve uma tabela, o fio do `<h1>`, a barra do `h2::before` e os filetes
 * reforçados de `estiloDoFileteReforcado()` (Major 7 achou dois sítios onde o
 * filete comum não chegava a 3:1; a correcção sobe um degrau na MESMA escala
 * da casa, nunca sai dela). As cores INTERIORES da obra citada — os selos, as
 * barras dos gráficos, os fios de severidade — ficam das obras e não entram
 * aqui: onde uma delas falha contraste, é a C1/C2 que o mede e o Blocking 4 do
 * relatório que o resolve, nunca esta célula.
 *
 * C6 · O PROVADOR DOS BYTES, VERDE E DEPOIS VERMELHO. O provador do F0.7 corre
 * sobre os dezasseis pares (origem em `studies-src/`, construído em `dist/`) e
 * tem de dar verde; e depois, com UM carácter mudado no meio do corpo de cada
 * documento, tem de dar vermelho nos dezasseis. Uma prova que não fecha sobre
 * um estrago não é uma prova.
 *
 * ---------------------------------------------------------------------------
 * OS ESTRAGOS PLANTADOS (`--vermelhos`)
 * ---------------------------------------------------------------------------
 * Cada estrago diz que células tem de fazer cair. A transformação acontece no
 * caminho entre o ficheiro e o navegador e não toca em disco. Três exigências,
 * as mesmas das outras réguas da casa: **verde antes**, **o HTML mudou** (um
 * estrago que não muda nada nunca podia ser apanhado), **vermelho depois** em
 * pelo menos uma das células que o estrago nomeia. UMA PLANTA QUE NÃO CUMPRE
 * AS TRÊS FAZ A CORRIDA SAIR A 1 (Major 9, segunda passagem: a primeira forma
 * calculava a prova e só a usava para a cor do símbolo no ecrã; `--vermelhos`
 * podia mostrar um ✗ e sair a 0 na mesma).
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

import { todosOsDocumentos, provaDosBytes } from '../../src/lib/documentos.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
/**
 * `OEDP_DIST` aponta a régua para outra construção, e serve para uma coisa só:
 * medir o ANTES. O relatório do bloco precisa dos mesmos números sobre a
 * construção de `origin/main` e sobre esta, e uma régua que só soubesse medir a
 * árvore onde vive obrigava a reescrevê-la duas vezes. A convenção é a de
 * `OEDP_REGISTOS_DIR` e `OEDP_STUDIES_DIR`.
 *
 * A célula C6 não é comparável entre construções de geometrias diferentes: o
 * provador desta árvore conhece a moldura e a construção antiga não a tem. O
 * relatório do bloco diz qual foi qual.
 */
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

/* --------------------------------------------------------- a paleta da casa */

/**
 * As cores da folha da casa, nos dois blocos, com os `var()` resolvidos.
 *
 * Lida aqui e não importada de lado nenhum: é a régua a ler a folha, que é o
 * que a torna uma medição e não um espelho do módulo.
 */
function paletaDaCasa() {
  const css = fs
    .readFileSync(path.join(RAIZ, 'src', 'styles', 'tokens.css'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  /** @param {string} selector */
  const bloco = (selector) => {
    const escapado = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = css.match(new RegExp(`(?:^|\\})\\s*${escapado}\\s*\\{([^{}]*)\\}`));
    if (!m) throw new Error(`a régua não encontrou \`${selector}\` em tokens.css`);
    const fichas = {};
    for (const [, nome, valor] of m[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      fichas[nome] = valor.trim();
    }
    return fichas;
  };
  const cores = new Set();
  const claro = bloco(':root');
  const escuro = { ...claro, ...bloco(":root[data-theme='dark']") };
  for (const fichas of [claro, escuro]) {
    for (const nome of Object.keys(fichas)) {
      let v = fichas[nome];
      for (let i = 0; i < 8; i++) {
        const m = String(v).trim().match(/^var\(\s*--([a-z0-9-]+)\s*\)$/);
        if (!m || !(m[1] in fichas)) break;
        v = fichas[m[1]];
      }
      const hex = String(v).trim().match(/^#([0-9a-f]{6})$/i);
      if (hex) {
        const n = parseInt(hex[1], 16);
        cores.add(`rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`);
      }
    }
  }
  return [...cores];
}

const PALETA = paletaDaCasa();

/* ------------------------------------------------------------- os estragos */

/**
 * Cada estrago: o que faz ao HTML servido, e que células tem de fazer cair.
 * @type {{ nome: string, celulas: string[], faz: (html: string, rota: string) => string }[]}
 */
const ESTRAGOS = [
  {
    nome: 'moldura-fora · tirar a abertura da moldura',
    celulas: ['C4', 'C5'],
    faz: (html) => html.replace('<main data-oedp-moldura>', '').replace('<div data-oedp-moldura>', ''),
  },
  {
    nome: 'filete-turquesa · o filete da grelha volta à cor de fora da paleta',
    celulas: ['C2', 'C5'],
    faz: (html) => html.replace(/--oedp-g2:#[0-9a-f]{6}/g, '--oedp-g2:#16556E'),
  },
  {
    nome: 'texto-da-celula · tirar a regra da cor do texto das células',
    celulas: ['C2'],
    faz: (html) =>
      html.replace(
        /\[data-oedp-moldura\] th,\[data-oedp-moldura\] td\{color:[^}]*\}/,
        '',
      ),
  },
  {
    nome: 'sem-guiao · tirar o guião da moldura',
    celulas: ['C1', 'C3'],
    faz: (html) => html.replace(/<script>\(function\(\)\{var R=[\s\S]*?\}\)\(\);<\/script>/, ''),
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

/* ----------------------------------------------------------- os documentos */

/** Os dezasseis, com a rota construída e o ficheiro de origem. */
const DOCUMENTOS = todosOsDocumentos().map((d) => ({
  chave: `${d.slug}/${d.lang}`,
  origem: d.ficheiro,
  rota: d.rota.endsWith('/') ? d.rota : `${d.rota}/`,
  construido: path.join(DIST, d.rota.replace(/^\//, ''), 'index.html'),
}));

const TEMAS = /** @type {const} */ (['light', 'dark']);
/**
 * AS DUAS LARGURAS (Major 8, segunda passagem). A primeira forma só media a
 * 1 280 e não entrava no `verify`: uma tabela que só transborda a 390 (o
 * telemóvel, e a largura que `IDENTIDADE.md` fixa para o aparelho pequeno)
 * podia ficar sem teclado e os dois comandos oficiais passavam na mesma.
 * Medido nos dezasseis: há caixas que só se deslocam a 390.
 */
const LARGURAS = /** @type {const} */ ([390, 1280]);

/* ------------------------------------------------------- a medição no ecrã */

/**
 * O que se mede dentro da página. Corre no navegador, e por isso é uma cadeia
 * de funções sem nada importado: tudo o que precisa está aqui dentro.
 */
function medeNaPagina() {
  /**
   * O CHROMIUM SERIALIZA `color-mix()` COMO `color(srgb r g b / a)`, COM OS
   * TRÊS CANAIS EM 0–1 E NÃO EM 0–255 (segunda passagem, medido: o selo
   * `.tag.src` da água, cujo fundo é `color-mix(in srgb,var(--teal) 16%,
   * transparent)`, devolve `color(srgb 0 0.427451 0.458824 / 0.16)` e não
   * `rgba(0,109,117,0.16)`). Uma leitura que só apanhasse os números da cadeia
   * lia 0,43 como se fosse quase preto, e um fundo quase preto por trás de um
   * selo escuro dava um contraste baixo que não é o que o navegador mostra: é
   * essa leitura que fazia os selos `tag src/prs/inf` dentro de tabela
   * medirem abaixo de 4,5:1 no diagnóstico ainda depois de corrigidos (o
   * axe-core, que resolve a cor à parte, já os media a passar).
   * @param {string} c
   */
  const cor = (c) => {
    const s = String(c);
    const mistura = s.match(
      /^color\([a-z0-9-]+\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/,
    );
    if (mistura) {
      const r = Number(mistura[1]) * 255;
      const g = Number(mistura[2]) * 255;
      const b = Number(mistura[3]) * 255;
      const a = mistura[4] !== undefined ? Number(mistura[4]) : 1;
      return [r, g, b, a];
    }
    const m = s.match(/[\d.]+/g);
    if (!m) return null;
    const [r, g, b] = m.map(Number);
    return [r, g, b, m.length > 3 ? Number(m[3]) : 1];
  };
  /** @param {number[]} rgb */
  const lum = ([r, g, b]) => {
    const c = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  /** @param {number[]} a @param {number[]} b */
  const razao = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  /** Compõe uma cor com alfa sobre outra já opaca. */
  const sobre = (frente, fundo) => {
    const a = frente[3];
    return [0, 1, 2].map((i) => Math.round(frente[i] * a + fundo[i] * (1 - a)));
  };
  /**
   * O fundo que o navegador compõe por baixo de um elemento, com a `opacity`
   * de cada nó (Major 7, segunda passagem: sem isto, a fileira de fronteira de
   * mandato de `evora-quinze-anos-cinco-mandatos`, a `opacity:.85`, media o
   * seu próprio azul de série a cheio e não os 85% que de facto se veem).
   *
   * `opacity` NÃO É O ALFA DO FUNDO: cria um GRUPO — o elemento inteiro
   * (fundo, filete, texto) pinta-se primeiro a cheio e só DEPOIS esse grupo se
   * esbate contra o que está atrás. Matematicamente isso é o mesmo que tratar
   * a `opacity` como um MULTIPLICADOR do alfa do fundo desse nó (a álgebra:
   * `o·(a·C+(1-a)·F) + (1-o)·F = (o·a)·C + (1-o·a)·F`, que é exactamente
   * `sobre(C, F)` com alfa `o·a`), e por isso a composição, nó a nó de dentro
   * para fora, continua a ser a mesma função `sobre()` de sempre.
   */
  const fundoDe = (el) => {
    const pilha = [];
    let n = el;
    while (n) {
      const c = cor(getComputedStyle(n).backgroundColor);
      const op = parseFloat(getComputedStyle(n).opacity);
      const alfa = (c ? c[3] : 0) * (Number.isNaN(op) ? 1 : op);
      if (c && alfa > 0) pilha.push([c[0], c[1], c[2], alfa]);
      if (alfa >= 1) break;
      n = n.parentElement;
    }
    let out = [255, 255, 255];
    for (let i = pilha.length - 1; i >= 0; i--) out = sobre(pilha[i], out);
    return out;
  };
  /**
   * A cor DECLARADA de um filete (um `border-color`) tal como o navegador a
   * vai de facto mostrar: a mesma `opacity` do elemento que a declara também a
   * esbate, exactamente como esbate o fundo desse elemento. O que fica «atrás»
   * é o fundo do elemento-mãe: a `opacity` funde o elemento INTEIRO (fundo E
   * filete) contra o que está fora dele, e não um contra o outro.
   * @param {Element} el @param {number[]} corDeclarada
   */
  const filetEfetivo = (el, corDeclarada) => {
    const op = parseFloat(getComputedStyle(el).opacity);
    const alfa = corDeclarada[3] * (Number.isNaN(op) ? 1 : op);
    return sobre([corDeclarada[0], corDeclarada[1], corDeclarada[2], alfa], fundoDe(el.parentElement ?? el));
  };
  /** O texto que é do próprio elemento, e não de um filho. */
  const textoProprio = (el) =>
    [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join('')
      .trim();

  /**
   * VISÍVEL, E NÃO SÓ PRESENTE (Minor 11, segunda passagem). `getClientRects()`
   * apanha `display:none` (no elemento ou num antepassado: a caixa desaparece
   * e ele com ela), mas não `visibility:hidden` (a caixa continua a existir, só
   * não se pinta) nem `aria-hidden="true"` (pinta-se, mas sai da árvore de
   * acessibilidade). Um `<h1>` que passasse por qualquer das duas não era um
   * título visível: era um título que só um leitor de ecrã distraído contava.
   * @param {Element} el
   */
  const visivel = (el) => {
    if (el.getClientRects().length === 0) return false;
    if (getComputedStyle(el).visibility !== 'visible') return false;
    if (el.closest('[aria-hidden="true"]')) return false;
    return true;
  };

  /**
   * UM `aria-labelledby` QUE APONTE PARA NINGUÉM NÃO NOMEIA NADA (Minor 11,
   * segunda passagem). A primeira forma tratava a simples presença do
   * atributo como um nome; um `id` que o documento não tem dá um nome vazio a
   * quem ouve, e a régua contava-o como nomeado. Todos os `id` que o atributo
   * lista (pode listar mais do que um) têm de existir.
   * @param {string | null} valor
   */
  const labelledbyValido = (valor) => {
    if (!valor) return false;
    const ids = valor.trim().split(/\s+/).filter(Boolean);
    return ids.length > 0 && ids.every((id) => !!document.getElementById(id));
  };

  /**
   * ONDE SE MEDE, E PORQUE NÃO É SÓ DENTRO DA MOLDURA.
   *
   * A régua tem de dar os mesmos números sobre a construção de ANTES, que não
   * tem moldura nenhuma. Medir só dentro dela dava zero filetes e zero células
   * no antes, e zero medido é uma célula verde que não mediu nada, que é a
   * pior espécie de verde. Onde não há moldura mede-se o corpo, tirando a
   * faixa; onde há, mede-se a moldura, que é exactamente o mesmo conteúdo.
   */
  const moldura = document.querySelector('[data-oedp-moldura]');
  const ambito = moldura ?? document.body;
  const daFaixa = (el) => !moldura && !!el.closest('[data-oedp-faixa]');
  const saida = {
    ambito: moldura ? 'moldura' : 'corpo',
    main: document.querySelectorAll('main').length,
    h1: [...document.querySelectorAll('h1')].filter(visivel).length,
    molduras: document.querySelectorAll('[data-oedp-moldura]').length,
    faixaDentro: moldura ? !!moldura.querySelector('[data-oedp-faixa]') : false,
    /** filetes da grelha: [razão, cor] */
    filetes: [],
    /** texto próprio das células: [razão, cor, corpo] */
    celulas: [],
    /** texto dentro de tabela que NÃO é da célula, abaixo de 4,5 */
    selos: [],
    caixas: [],
    coresDosFiletes: [],
  };
  const grelha = [...ambito.querySelectorAll('table,thead,tbody,tfoot,tr,th,td')].filter((e) => !daFaixa(e));
  const envolventes = [...ambito.querySelectorAll('*')].filter(
    (e) => !daFaixa(e) && !e.matches('table') && !!e.querySelector(':scope > table'),
  );
  /**
   * O CONTRASTE DE UM FILETE CONTRA OS DOIS FUNDOS ADJACENTES (Major 7, segunda
   * passagem). Um filete é a fronteira entre DOIS fundos: o de dentro (a
   * composição do PRÓPRIO elemento, se ele tiver a sua) e o de fora (a do
   * elemento-mãe, do outro lado da fronteira). A primeira passagem só olhava
   * para o de fora; um filete podia medir bem contra um fundo que ninguém lhe
   * punha ao lado e mal contra o que de facto o rodeia dos dois lados, e
   * passava. O que se guarda é o PIOR dos dois, que é o que WCAG 2.1 §1.4.11
   * pede: o objeto tem de se distinguir de CADA fundo que o toca.
   * @param {number[]} c @param {Element} el
   */
  const piorContraste = (c, el) => {
    const corDoFilete = filetEfetivo(el, c);
    const fundoProprio = fundoDe(el);
    const fundoDoPai = fundoDe(el.parentElement ?? el);
    return Math.min(razao(corDoFilete, fundoProprio), razao(corDoFilete, fundoDoPai));
  };
  for (const el of [...grelha, ...envolventes]) {
    const cs = getComputedStyle(el);
    for (const lado of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = parseFloat(cs[`border${lado}Width`]);
      if (!(w > 0) || cs[`border${lado}Style`] === 'none') continue;
      const c = cor(cs[`border${lado}Color`]);
      if (!c || c[3] === 0) continue;
      saida.filetes.push([piorContraste(c, el), cs[`border${lado}Color`]]);
      saida.coresDosFiletes.push(cs[`border${lado}Color`]);
    }
  }
  /* O fio do `<h1>` e a barra do `h2::before`, que são os outros dois filetes
     que a moldura declara seus. A barra é um pseudo-elemento sem nó próprio: o
     seu «fundo de dentro» é o do `<h2>` que a gera. */
  for (const h of [...ambito.querySelectorAll('h1')].filter((e) => !daFaixa(e))) {
    const cs = getComputedStyle(h);
    if (parseFloat(cs.borderBottomWidth) > 0 && cs.borderBottomStyle !== 'none') {
      saida.coresDosFiletes.push(cs.borderBottomColor);
      const c = cor(cs.borderBottomColor);
      if (c && c[3] > 0) saida.filetes.push([piorContraste(c, h), cs.borderBottomColor]);
    }
  }
  for (const h of [...ambito.querySelectorAll('h2')].filter((e) => !daFaixa(e))) {
    const cs = getComputedStyle(h, '::before');
    if (cs.content && cs.content !== 'none' && parseFloat(cs.height) > 0) {
      const c = cor(cs.backgroundColor);
      if (c && c[3] > 0) {
        saida.coresDosFiletes.push(cs.backgroundColor);
        saida.filetes.push([piorContraste(c, h), cs.backgroundColor]);
      }
    }
  }

  for (const cel of [...ambito.querySelectorAll('th,td')].filter((e) => !daFaixa(e))) {
    const proprio = textoProprio(cel);
    if (!proprio) continue;
    const cs = getComputedStyle(cel);
    const c = cor(cs.color);
    if (!c) continue;
    const fundo = fundoDe(cel);
    saida.celulas.push([razao(sobre(c, fundo), fundo), cs.color, parseFloat(cs.fontSize)]);
  }
  for (const el of [...ambito.querySelectorAll('table *')].filter((e) => !daFaixa(e))) {
    if (el.matches('th,td,tr,thead,tbody,tfoot,table')) continue;
    if (!textoProprio(el)) continue;
    const cs = getComputedStyle(el);
    const c = cor(cs.color);
    if (!c) continue;
    const fundo = fundoDe(el);
    const r = razao(sobre(c, fundo), fundo);
    if (r < 4.5) saida.selos.push([Math.round(r * 100) / 100, cs.color, el.className || el.tagName]);
  }

  for (const el of [...ambito.querySelectorAll('*')].filter((e) => !daFaixa(e))) {
    const x = el.scrollWidth - el.clientWidth > 1;
    const y = el.scrollHeight - el.clientHeight > 1;
    if (!x && !y) continue;
    const cs = getComputedStyle(el);
    const corre = (x && /auto|scroll/.test(cs.overflowX)) || (y && /auto|scroll/.test(cs.overflowY));
    if (!corre) continue;
    saida.caixas.push({
      eixo: x && /auto|scroll/.test(cs.overflowX) ? 'x' : 'y',
      focavel: el.tabIndex >= 0,
      papel: el.getAttribute('role'),
      nome: el.getAttribute('aria-label') ?? (labelledbyValido(el.getAttribute('aria-labelledby')) ? '(por id)' : null),
      onde: el.tagName + '.' + String(el.className || '').slice(0, 24),
    });
  }
  return saida;
}

/* ------------------------------------------------------------- a passagem */

const nav = await chromium.launch({ headless: true });

/**
 * Uma passagem completa pelos dezasseis documentos e pelos dois temas.
 * @returns {Promise<{ axe: Record<string, number>, graves: number, docs: any[] }>}
 */
async function passagem() {
  /** @type {Record<string, number>} */
  const axe = {};
  let graves = 0;
  const docs = [];
  for (const doc of DOCUMENTOS) {
    for (const tema of TEMAS) {
      for (const largura of LARGURAS) {
        const ctx = await nav.newContext({
          viewport: { width: largura, height: 900 },
          colorScheme: tema,
        });
        const pagina = await ctx.newPage();
        await pagina.goto(base + doc.rota, { waitUntil: 'networkidle' });
        /* O guião da moldura corre no `load` e as folhas dos documentos desenham
           gráficos nessa altura: dá-se-lhes o tempo que a medição precisa. */
        await pagina.evaluate(() => new Promise((r) => setTimeout(r, 400)));
        await pagina.addScriptTag({ content: GUIAO_DO_AXE });
        const violacoes = await pagina.evaluate(async () => {
          const res = await window.axe.run(document, { resultTypes: ['violations'] });
          return res.violations.map((v) => ({
            id: v.id,
            impacto: v.impact,
            nos: v.nodes.length,
            /* ONDE, e não só QUANTOS. O relatório do bloco tem de poder dizer
               quanto do contraste é da moldura e quanto é do corpo da obra
               citada, e uma contagem que não separa as duas coisas deixa a
               pergunta em aberto. */
            emTabela: v.nodes.filter((n) => {
              const el = document.querySelector(n.target.join(' '));
              return !!(el && el.closest('table'));
            }).length,
          }));
        });
        for (const v of violacoes) {
          const k = `${v.id} [${v.impacto}]`;
          axe[k] = (axe[k] ?? 0) + v.nos;
          axe[`${k} · em tabela`] = (axe[`${k} · em tabela`] ?? 0) + v.emTabela;
          if (v.impacto === 'serious' || v.impacto === 'critical') graves += v.nos;
        }
        const medida = await pagina.evaluate(medeNaPagina);
        docs.push({ chave: doc.chave, tema, largura, ...medida });
        await ctx.close();
      }
    }
  }
  return { axe, graves, docs };
}

/* ------------------------------------------------------------- as células */

/** @type {{ nome: string, passa: boolean, prova: string }[]} */
let celulas = [];
const conta = (nome, passa, prova) => celulas.push({ nome, passa: !!passa, prova: String(prova) });

/** @param {{ axe: Record<string, number>, graves: number, docs: any[] }} p */
function avalia(p) {
  celulas = [];
  const dos = (f) => p.docs.flatMap(f);

  /* C1 */
  const porRegra = Object.entries(p.axe)
    .filter(([k]) => /\[(serious|critical)\]$/.test(k))
    .sort((a, b) => b[1] - a[1]);
  conta(
    'C1',
    p.graves === 0,
    `${p.graves} nó(s) graves em ${p.docs.length} passagens · ` +
      (porRegra.length ? porRegra.map(([k, v]) => `${k}=${v}`).join(' · ') : 'nenhuma'),
  );

  /* C2 */
  const filetes = dos((d) => d.filetes);
  const celulasTexto = dos((d) => d.celulas);
  const filetesMaus = filetes.filter(([r]) => r < 3);
  const textoMau = celulasTexto.filter(([r]) => r < 4.5);
  const min = (xs) => (xs.length ? Math.min(...xs.map(([r]) => r)) : Infinity);
  /* UMA MEDIÇÃO VAZIA NÃO É UM VERDE. Se a régua não encontrou filete nenhum
     nem célula nenhuma, não mediu: ou o âmbito está errado, ou a construção não
     é a que se pensa. Falha, e diz o que contou. */
  conta(
    'C2',
    filetes.length > 0 && celulasTexto.length > 0 && filetesMaus.length === 0 && textoMau.length === 0,
    `filetes: ${filetes.length} medidos, ${filetesMaus.length} abaixo de 3:1 ` +
      `(o pior ${min(filetes).toFixed(2)}:1) · texto próprio das células: ` +
      `${celulasTexto.length} medidos, ${textoMau.length} abaixo de 4,5:1 ` +
      `(o pior ${min(celulasTexto).toFixed(2)}:1)`,
  );

  /* C3 */
  const caixas = dos((d) => d.caixas.map((c) => ({ ...c, chave: d.chave, tema: d.tema, largura: d.largura })));
  const semTeclado = caixas.filter((c) => !c.focavel);
  const semNome = caixas.filter((c) => !c.nome);
  /**
   * O MARCO TEM DE SER `region`, OU UM PAPEL PRÓPRIO QUE JÁ NÃO É VAZIO NEM
   * `presentation`/`none` (Minor 11, segunda passagem). A primeira forma só
   * perguntava se havia ALGUM valor, e um `role="presentation"` — que APAGA o
   * marco em vez de o dar — passava por essa pergunta. O guião da moldura só
   * põe `region` onde a obra não declarou papel nenhum (`documentos.mjs`,
   * `guiaoDaMoldura()`): uma caixa que já é `role="tablist"` (medido: a barra
   * de separadores de `evolucao-de-portugal-desde-1981`, com os seus
   * `role="tab"` por baixo) fica com o seu, porque um `tablist` não é uma
   * região genérica e forçar `region` por cima apagava o papel mais
   * específico, e mais correcto, que a própria obra já lhe dava.
   */
  const PAPEIS_QUE_APAGAM_O_MARCO = new Set(['presentation', 'none']);
  const semPapel = caixas.filter((c) => !c.papel || PAPEIS_QUE_APAGAM_O_MARCO.has(c.papel));
  let repetidos = 0;
  for (const d of p.docs) {
    const vistos = new Set();
    for (const c of d.caixas) {
      if (c.nome && vistos.has(c.nome)) repetidos++;
      if (c.nome) vistos.add(c.nome);
    }
  }
  conta(
    'C3',
    caixas.length > 0 && semTeclado.length === 0 && semNome.length === 0 && semPapel.length === 0 && repetidos === 0,
    `${caixas.length} caixa(s) que se deslocam · ${semTeclado.length} sem teclado · ` +
      `${semNome.length} sem nome · ${semPapel.length} sem marco · ${repetidos} nome(s) repetido(s)`,
  );

  /* C4 */
  const semMain = p.docs.filter((d) => d.main !== 1);
  const semH1 = p.docs.filter((d) => d.h1 !== 1);
  const molduraMa = p.docs.filter((d) => d.molduras !== 1 || d.faixaDentro);
  conta(
    'C4',
    semMain.length === 0 && semH1.length === 0 && molduraMa.length === 0,
    `${p.docs.length} passagens · ${semMain.length} sem <main> a um · ${semH1.length} sem <h1> ` +
      `visível a um · ${molduraMa.length} com a moldura errada ou a faixa lá dentro`,
  );

  /* C5 */
  const cores = new Map();
  for (const c of dos((d) => d.coresDosFiletes)) cores.set(c, (cores.get(c) ?? 0) + 1);
  const foraDaPaleta = [...cores].filter(([c]) => !PALETA.includes(c));
  /* A mesma regra da C2: zero filetes contados é uma medição que não aconteceu. */
  conta(
    'C5',
    cores.size > 0 && foraDaPaleta.length === 0,
    `${cores.size} cor(es) distintas nos filetes da moldura · ${foraDaPaleta.length} fora da ` +
      `paleta da casa${foraDaPaleta.length ? ': ' + foraDaPaleta.map(([c, n]) => `${c} (${n})`).join(', ') : ''}`,
  );

  /* Diagnóstico: o que a moldura NÃO corrige, contado e nomeado. */
  const selos = new Map();
  for (const [r, cor, onde] of dos((d) => d.selos)) {
    const k = `${cor} ${r}:1 ${onde}`;
    selos.set(k, (selos.get(k) ?? 0) + 1);
  }
  return {
    porRegra,
    selos: [...selos].sort((a, b) => b[1] - a[1]),
    caixas: caixas.length,
  };
}

/* C6 · o provador dos bytes, e a planta. Sem navegador. */
function celulaC6() {
  let verdes = 0;
  let plantasApanhadas = 0;
  const falhas = [];
  for (const doc of DOCUMENTOS) {
    const bruto = fs.readFileSync(doc.origem, 'utf8');
    const construido = fs.readFileSync(doc.construido, 'utf8');
    const falha = provaDosBytes(bruto, construido);
    if (falha) falhas.push(`${doc.chave}: ${falha}`);
    else verdes++;
    /* A PLANTA: um carácter mudado a meio do CORPO do documento. Muda-se o
       original e pergunta-se ao provador se o construído ainda é dele. */
    const i = Math.floor(bruto.length / 2);
    const estragado = bruto.slice(0, i) + (bruto[i] === 'a' ? 'b' : 'a') + bruto.slice(i + 1);
    if (estragado !== bruto && provaDosBytes(estragado, construido)) plantasApanhadas++;
  }
  conta(
    'C6',
    verdes === DOCUMENTOS.length && plantasApanhadas === DOCUMENTOS.length,
    `${verdes} de ${DOCUMENTOS.length} verdes · ${plantasApanhadas} de ${DOCUMENTOS.length} ` +
      `plantas apanhadas${falhas.length ? ' · ' + falhas[0] : ''}` +
      /* O provador desta árvore conhece a moldura. Corrido sobre uma construção
         que não a tem, diz vermelho, e isso é a régua a funcionar e não um
         defeito da construção antiga: diz-se aqui para ninguém o ler ao
         contrário. */
      (process.env.OEDP_DIST
        ? ` · [OEDP_DIST: o provador desta árvore mede a geometria da moldura, que esta ` +
          `construção não tem]`
        : ''),
  );
}

/* -------------------------------------------------------------- a corrida */

console.log('');
console.log(
  cinza(
    `  a régua da moldura · ${DOCUMENTOS.length} documentos × ${TEMAS.length} temas × ` +
      `${LARGURAS.length} larguras (${LARGURAS.join(', ')} px)`,
  ),
);
console.log('');

const primeira = await passagem();
const diagnostico = avalia(primeira);
celulaC6();

const limpas = celulas.map((c) => ({ ...c }));
for (const c of celulas) {
  console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}  ${c.prova}`);
}

console.log('');
console.log(cinza('  o axe, regra a regra (as dezasseis páginas nos dois temas):'));
for (const [k, v] of Object.entries(primeira.axe).sort((a, b) => b[1] - a[1])) {
  console.log(cinza(`    ${String(v).padStart(6)}  ${k}`));
}
console.log('');
console.log(cinza('  o que a moldura NÃO corrige, contado:'));
console.log(cinza(`    · texto dentro de tabela que não é da célula e mede abaixo de 4,5:1: ${diagnostico.selos.reduce((a, b) => a + b[1], 0)} nó(s)`));
for (const [k, n] of diagnostico.selos.slice(0, 8)) console.log(cinza(`        ${String(n).padStart(4)}  ${k}`));

/* ------------------------------------------------------------- as plantas */

/**
 * `bom` é a PROVA de que o estrago pegou: o HTML mudou, ao menos uma célula
 * que o estrago nomeia caiu, e essa célula estava verde antes. Guarda-se aqui
 * — e não só no ecrã — para o relatório poder citar cada planta sem repetir a
 * corrida (Major 10), e para o `bom` poder decidir a saída (Major 9, abaixo).
 * @type {{ nome: string, celulas: string[], mudou: boolean, caiu: string[], nomeadas: string[], verdesAntes: string[], bom: boolean }[]}
 */
const plantas = [];
/**
 * UMA PLANTA QUE NÃO PEGA É UMA FALHA DA CORRIDA, E NÃO SÓ UM ✗ NO ECRÃ (Major
 * 9, segunda passagem). A primeira forma calculava `bom` e só o usava para
 * escolher a cor do símbolo: `--vermelhos` podia mostrar uma planta falhada e
 * sair a 0 na mesma, porque a saída só olhava para `limpas` (a corrida sem
 * estragos). Uma planta que não muda a régua não prova que ela apanha nada, e
 * por isso conta como um vermelho da corrida.
 */
let plantaMa = false;
if (VERMELHOS) {
  console.log('');
  console.log(cinza('  as plantas:'));
  for (const estrago of ESTRAGOS) {
    /* O HTML tem de mudar: um estrago que não muda nada nunca podia ser
       apanhado. Mede-se num documento com tabelas e com uma caixa que corre. */
    const amostra = fs.readFileSync(
      path.join(DIST, 'estudos', 'evora-prometido-pago-auditado-2026', 'documento', 'index.html'),
      'utf8',
    );
    const mudou = estrago.faz(amostra, '/estudos/evora-prometido-pago-auditado-2026/documento/') !== amostra;
    ESTRAGO = estrago.faz;
    const depois = await passagem();
    avalia(depois);
    ESTRAGO = null;
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
        documentos: DOCUMENTOS.length,
        temas: TEMAS,
        larguras: LARGURAS,
        celulas: limpas,
        axe: primeira.axe,
        graves: primeira.graves,
        selos: diagnostico.selos,
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
const plantasMas = plantas.filter((p) => !p.bom);
if (maus.length || plantasMas.length) {
  if (maus.length) {
    console.log(vermelho(`  ${maus.length} célula(s) vermelhas: ${maus.map((c) => c.nome).join(', ')}`));
  }
  if (plantasMas.length) {
    console.log(
      vermelho(
        `  ${plantasMas.length} planta(s) que não pegaram: ${plantasMas.map((p) => p.nome).join(', ')}`,
      ),
    );
  }
  console.log('');
  process.exit(1);
}
console.log(verde('  todas as células verdes.' + (VERMELHOS ? ' todas as plantas pegaram.' : '')));
console.log('');
