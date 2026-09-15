#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * O PORTÃO DAS FOLHAS · duas coisas que o HTML sabe e que ninguém conferia
 * ---------------------------------------------------------------------------
 *
 * Nasce a 15.09.2026, de um defeito que o diretor leu no telemóvel, na primeira
 * página, e que nenhum dos vinte e tantos portões desta casa via:
 *
 *     2. Trabalhoas medidas estão em Economia e finanças públicas
 *
 * Eram duas coisas ao mesmo tempo, e são as duas células deste ficheiro.
 *
 * ---------------------------------------------------------------------------
 * C1 · AS REGRAS CHEGAM À PÁGINA
 * ---------------------------------------------------------------------------
 * A secção dos domínios da primeira página rendia `<ol class="dominios-lista">`
 * com `<li class="dominios-item">`, e as regras dessas classes viviam em
 * `src/styles/dominio.css`, que `HomeView.astro` não importa. O resultado é
 * silencioso e total: a numeração do `<ol>` aparece, o estado sai no serif do
 * corpo a 16 px em vez do tipo de instrumento a 14, e sem o `gap` do flex o nome
 * e o estado encostam-se. Nada falha, nada avisa. A mesma lista em `/dominios`,
 * onde a folha chega, estava certa, e por isso uma comparação entre páginas
 * também não o via.
 *
 * A conferência: para cada página de `dist/`, cada classe escrita no seu HTML
 * que TEM regra nalguma folha construída (`dist/**\/*.css`) e em NENHUMA folha
 * que essa página liga fecha a construção, com a página e a classe ditas.
 *
 * O que conta como «chega à página»: as folhas em `<link rel="stylesheet">` com
 * endereço local, e o conteúdo de cada `<style>` da própria página (o Astro
 * embute em linha as folhas pequenas, e uma regra embutida chega tão bem como
 * uma ligada).
 *
 * O que NÃO é defeito, e por isso não entra: uma classe que não tem regra em
 * folha nenhuma. Pode ser uma âncora de JavaScript, uma marca de leitura ou uma
 * classe de um documento alojado. A célula só fala do caso em que a regra
 * EXISTE e não chega: é o caso em que a página mente sobre como se compõe.
 *
 * ---------------------------------------------------------------------------
 * C2 · PALAVRAS COLADAS
 * ---------------------------------------------------------------------------
 * «Trabalhoas» é o HTML a dizer a verdade: entre `</a>` e `<span>` não havia
 * nada, e o espaço vinha do `gap` do flex. Numa página sem a folha, ou num
 * leitor de ecrã, ou num motor de busca, ou numa citação copiada, o espaço
 * nunca existiu. Um espaço que só o desenho dá é um espaço que a maior parte
 * dos leitores do documento não tem.
 *
 * A conferência: dentro de um bloco de texto (`li`, `p`, `h1`–`h6`, `td`, `th`,
 * `dt`, `dd`, `figcaption`, `summary`), dois ELEMENTOS vizinhos sem nada entre
 * eles, em que o texto do primeiro acaba em letra ou algarismo e o do segundo
 * começa em letra ou algarismo, fecham a construção.
 *
 * SÃO ELEMENTOS VIZINHOS, e não nós de texto vizinhos, e a diferença é o que
 * torna a régua utilizável: `<p>Foo<strong>bar</strong></p>` tem um nó de texto
 * antes da marca, e é uma marca DENTRO de uma palavra, que é uma coisa legítima
 * e frequente. O que a régua procura é a fronteira `</x><y>`, que é sempre duas
 * peças justapostas por quem escreveu o gabarito.
 *
 * AS EXCEPÇÕES ESTÃO ESCRITAS EM `COLAGENS_ACEITES`, cada uma com a razão, e
 * nenhuma foi escrita antes de a régua ter corrido sobre o sítio inteiro.
 *
 * ---------------------------------------------------------------------------
 * O DOCUMENTO ORIGINAL DE UM ESTUDO FICA DE FORA DAS DUAS
 * ---------------------------------------------------------------------------
 * `/estudos/<slug>/documento` serve o ficheiro do estudo tal como ele foi
 * publicado (`src/lib/routes.mjs`: «não é uma página deste sítio»). Traz a sua
 * própria folha embutida e o seu próprio markup, e nenhuma linha dele é da casa.
 * Fica de fora com a razão escrita, como já está no portão da língua, e não por
 * uma omissão silenciosa: as páginas excluídas contam-se e imprimem-se.
 *
 * ---------------------------------------------------------------------------
 * OS POSITIVOS CONHECIDOS (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Um zero só conta depois de a régua ter visto um vermelho. `--prova` monta um
 * `dist/` de mentira num directório temporário FORA da árvore do sítio, com uma
 * página que tem exactamente um defeito de cada espécie, e exige que cada célula
 * o veja e que não veja mais nada. O `verify` corre-o sempre.
 *
 * Uso:  node scripts/check-css.mjs [--prova]
 *       OEDP_DIST=/outro/dist node scripts/check-css.mjs
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, NodeType } from 'node-html-parser';
import { matchPath } from '../src/lib/routes.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const PROVA = process.argv.includes('--prova');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/* ========================================================================== */
/* as folhas                                                                  */
/* ========================================================================== */

/**
 * Os prelúdios de uma folha: o texto que precede cada `{`, que é o selector de
 * uma regra ou o cabeçalho de uma at-rule. Anda carácter a carácter, e não por
 * expressão regular, porque a chaveta que abre um `@media` não fecha um bloco e
 * uma expressão que ande de chaveta em chaveta perde o primeiro selector lá
 * dentro. As declarações são deitadas fora ao `}`.
 */
function preludios(css) {
  const out = [];
  let buf = '';
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === '{') {
      out.push(buf);
      buf = '';
    } else if (c === '}') {
      buf = '';
    } else {
      buf += c;
    }
  }
  return out;
}

/**
 * As classes que uma folha estiliza. Fora os comentários e as cadeias: um
 * `.nome` dentro de um `content: ".x"` não é um selector.
 */
function classesDeCss(css) {
  const limpo = css
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
  const out = new Set();
  for (const p of preludios(limpo)) {
    for (const m of p.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) out.add(m[1]);
  }
  return out;
}

/**
 * O QUE CADA CLASSE DECLARA, e não só que é estilizada: `classe → conjunto de
 * propriedades`. C2 precisa disto para saber se a folha põe ALGUMA coisa entre
 * dois vizinhos, e a resposta tem de vir das folhas que chegam ÀQUELA página.
 *
 * Anda por blocos equilibrados: um bloco que ainda tem `{` lá dentro é uma
 * at-rule (`@media`, `@supports`) e entra-se nele; um bloco sem `{` é uma regra,
 * e as suas declarações contam para todas as classes do seu selector. Uma
 * declaração dentro de um `@media` conta como declaração: a régua pergunta «a
 * folha diz alguma coisa sobre o espaço aqui», e não «em que largura».
 */
function declaracoesDeCss(css) {
  const limpo = css
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
  /** @type {Map<string, Set<string>>} */
  const out = new Map();
  let i = 0;
  while (i < limpo.length) {
    const j = limpo.indexOf('{', i);
    if (j < 0) break;
    const pre = limpo.slice(i, j);
    let d = 1;
    let k = j + 1;
    while (k < limpo.length && d > 0) {
      if (limpo[k] === '{') d++;
      else if (limpo[k] === '}') d--;
      k++;
    }
    const corpo = limpo.slice(j + 1, k - 1);
    if (corpo.includes('{')) {
      i = j + 1; /* é uma at-rule: entra-se nela */
      continue;
    }
    const props = new Set();
    for (const m of corpo.matchAll(/(?:^|[;{])\s*([a-z-]+)\s*:([^;}]*)/g)) {
      props.add(`${m[1]}:${m[2].trim().toLowerCase()}`);
    }
    for (const m of pre.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
      const s = out.get(m[1]) ?? new Set();
      for (const pr of props) s.add(pr);
      out.set(m[1], s);
    }
    i = k;
  }
  return out;
}

/** Todos os `.css` de um `dist/`, por caminho absoluto. */
function folhasDe(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) folhasDe(p, out);
    else if (e.name.endsWith('.css')) out.push(p);
  }
  return out;
}

/** Todas as páginas de um `dist/`. */
function paginasDe(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) paginasDe(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/* ========================================================================== */
/* C2 · o que é uma colagem aceite                                            */
/* ========================================================================== */

const BLOCOS = new Set([
  'li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'td', 'th', 'dt', 'dd', 'figcaption', 'summary',
]);

/**
 * AS ETIQUETAS QUE SÃO TEXTO CORRIDO POR OMISSÃO. Duas caixas nunca fazem uma
 * palavra: `<p>` ao lado de `<p>`, `<dt>` ao lado de `<dd>`, `<tr>` ao lado de
 * `<tr>` são linhas diferentes do documento, e o que as junta no `textContent`
 * é a leitura de um ficheiro e não uma palavra colada. A régua olha para a
 * fronteira entre duas peças de TEXTO.
 */
const EM_LINHA = new Set([
  'a', 'span', 'abbr', 'b', 'i', 'em', 'strong', 'small', 'code', 'kbd', 'sub', 'sup',
  'time', 'mark', 'q', 'cite', 'bdi', 'bdo', 'data', 'var', 'samp', 'u', 's',
  'label', 'output', 'del', 'ins',
]);

/**
 * O QUE, NUMA FOLHA, PÕE ESPAÇO ENTRE DUAS PEÇAS.
 *
 * ---------------------------------------------------------------------------
 * PORQUE É QUE ESTA PERGUNTA EXISTE, E É A MEDIÇÃO QUE A FEZ
 * ---------------------------------------------------------------------------
 * A primeira redação desta célula era a que o defeito pedia à letra: duas peças
 * vizinhas sem espaço entre elas. Corrida sobre `dist/` na cabeça 44f0d838, deu
 * 60 526 vermelhos, 31 407 deles entre duas peças de texto, em 60 padrões. Não
 * eram 31 407 defeitos: era o RETRATO DA COMPOSIÇÃO DESTA CASA. O selo da fonte
 * encostado ao seu número (`.claim-value` + `.src-chip`, umas onze mil vezes), o
 * valor e a sua unidade, o nome e a posição de um cartão, duas portas numa fila
 * de rodapé: em todos eles o espaço é um `gap` de caixa flexível, escrito de
 * propósito, e o `textContent` junta as palavras porque o HTML não tem de as
 * separar quando a folha as separa.
 *
 * Uma régua que acusa a composição inteira da casa não é uma régua: é uma lista
 * de exceções à espera de ser escrita, e uma exceção escrita para pôr um portão
 * a verde é a régua a servir o portão em vez de servir o leitor.
 *
 * O QUE SEPARA O DEFEITO DO IDIOMA é uma coisa só, e é a que o diretor leu: em
 * `/dominios` a folha chegava e o `gap` estava lá; em `/` a folha não chegava e
 * não estava nada. A pergunta passa a ser essa, e mede-se com as folhas que
 * chegam ÀQUELA página e com mais nenhumas:
 *
 *     duas peças de texto encostadas, e NADA na folha desta página põe espaço
 *     entre elas.
 *
 * `SEPARA_O_PAI` é o que um antepassado (a subida vai até à raiz, e a razão está
 * escrita onde ela anda) pode declarar para abrir espaço entre os filhos;
 * `SEPARA_A_PECA` é o que cada uma das duas peças pode declarar para se afastar
 * da outra ou para deixar de ser texto corrido. Basta uma para a fronteira não
 * ser um defeito: a régua não mede QUANTO espaço a folha põe, mede se a folha
 * diz alguma coisa sobre ele.
 *
 * Com esta pergunta, os mesmos 60 526 dão QUATRO vermelhos na cabeça 44f0d838, e
 * são a linha do domínio «Trabalho» e a de cima, nas duas edições: exactamente o
 * que o diretor leu. As outras 31 403 fronteiras entre peças de texto são
 * separadas pela folha da própria página.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTA PERGUNTA NÃO SABE RESPONDER, ESCRITO ANTES DE ALGUÉM PERGUNTAR
 * ---------------------------------------------------------------------------
 * (Achado 6 da leitura a frio do Codex à fatia, 15.09.2026, aceite como
 * limitação verdadeira desta redação.)
 *
 * «A folha desta página põe espaço aqui?» é respondida por leitura de TEXTO DE
 * FOLHA, e não por composição. Em concreto, a régua:
 *
 *   · **aceita a declaração de um antepassado qualquer, até à raiz.** Um `gap`
 *     separa os filhos DIRECTOS de uma caixa flexível ou de uma grelha, e mais
 *     ninguém: um `gap` declarado cinco níveis acima não diz nada sobre a
 *     fronteira que está a ser medida. A régua aceita-o à mesma;
 *   · **não resolve o selector.** Atribui as declarações de `.a .b { … }` tanto
 *     a `.a` como a `.b`, e não confere qual dos dois elementos casa de facto;
 *   · **não resolve a cascata nem a condição.** Uma declaração dentro de um
 *     `@media` que nunca se aplica àquela largura conta como declaração, e uma
 *     regra que outra sobrepõe conta na mesma;
 *   · **não mede um píxel.** Não sabe se o espaço que a folha declara tem
 *     largura, nem se os dois elementos chegam a ficar na mesma linha.
 *
 * O ERRO QUE ISTO PRODUZ É SEMPRE PARA O MESMO LADO, e é a escolha: deixa passar
 * colagens verdadeiras, e não inventa nenhuma. Entre uma régua que cala um
 * defeito e uma que acusa uma página que está bem, esta casa escolhe a primeira,
 * porque a segunda ensina toda a gente a escrever exceções.
 *
 * O PREÇO MEDIDO, com nome: o «Populaçãoprimeiro» de `/metodo` é uma colagem
 * verdadeira e a C2 não a acorda, porque `.metodo-secao`, lá acima, é uma grelha
 * com goma. Quem a apanhou foi a C1, por outra via, e está corrigida nesta
 * fatia. E o «Trabalhoincluído» da primeira página só ficou vermelho porque a
 * folha não chegava àquela página: em `/dominios`, onde chegava, o `gap` de
 * `.dominios-item` teria calado a mesma fronteira.
 *
 * A FORMA HONESTA DE FECHAR ISTO NÃO É UMA HEURÍSTICA MELHOR: é uma célula
 * RENDIDA, que abra as páginas num navegador e meça a distância entre as caixas
 * de duas peças de texto vizinhas na mesma linha. Zero píxeis é uma colagem, e
 * não há folha nem cascata para interpretar. Fica para a fatia
 * `css-alcance-2026-09-16`, com a conta do custo ao lado: a régua de hoje lê
 * 7 224 páginas em segundos, e uma rendida tem de escolher quantas abre.
 */
const zero = (v) => /^0(?:[a-z%]*)?$/.test(v.trim());

/** O pai abre espaço entre os filhos. */
const SEPARA_O_PAI = (prop, valor) => {
  if (['gap', 'column-gap', 'grid-column-gap', 'word-spacing'].includes(prop)) {
    return !zero(valor.split(/\s+/).pop() ?? '');
  }
  if (prop === 'grid-template-columns') return true;
  /* Um separador desenhado (`a + a::before { content: "·" }`) é espaço posto de
     propósito, e é o que o `content` declara. */
  if (prop === 'content') return true;
  return false;
};

/**
 * A peça afasta-se da vizinha, ou deixa de ser texto corrido.
 *
 * O VALOR DO `display` IMPORTA, e foi uma medição que o mostrou: a folha desta
 * casa dá `display: inline-flex` ao nome de um domínio para lhe crescer o alvo
 * de toque até 44 px (`site.css`, a lista dos alvos abaixo de 1024). Um
 * `inline-flex` não põe UM PIXEL entre aquela âncora e o que vem a seguir, e a
 * primeira redação desta régua, que olhava só para o nome da propriedade,
 * deixava passar por isso o defeito que o diretor leu. Só um `display` que tira
 * a peça da linha (`block`, `flex`, `grid`, `list-item`, `table*`, `flow-root`)
 * ou que a apaga (`none`) separa duas palavras.
 */
const DISPLAY_QUE_SEPARA = new Set([
  'block', 'flex', 'grid', 'list-item', 'flow-root', 'none',
  'table', 'table-row', 'table-cell', 'table-caption',
]);
const SEPARA_A_PECA = (prop, valor) => {
  if (/^margin(-left|-right|-inline|-inline-start|-inline-end)?$/.test(prop)) return !zero(valor);
  if (/^padding(-left|-right|-inline|-inline-start|-inline-end)?$/.test(prop)) return !zero(valor);
  if (prop === 'display') return DISPLAY_QUE_SEPARA.has(valor);
  if (prop === 'position') return ['absolute', 'fixed'].includes(valor);
  if (prop === 'float') return ['left', 'right'].includes(valor);
  if (prop === 'content') return true;
  return false;
};

/**
 * As colagens que a casa faz de propósito.
 *
 * NENHUMA DELAS MORDE NO SÍTIO DE HOJE: a conta `c2_aceites` fecha a zero sobre
 * `dist/` inteiro, nas duas cabeças. Ficam porque são sentinelas com positivo
 * conhecido — o `--prova` planta um expoente e exige que ele seja contado como
 * colagem aceite —, e não porque alguma linha do sítio precise delas hoje.
 *
 * `par(a, b)` recebe os dois elementos vizinhos e devolve `true` quando a
 * colagem é intencional.
 */
const COLAGENS_ACEITES = [
  {
    porque:
      'Um expoente ou um índice cola-se ao que eleva: «m²», «CO₂». Um espaço ali ' +
      'partia a palavra em vez de a compor.',
    par: (a, b) => ['sup', 'sub'].includes(a.rawTagName) || ['sup', 'sub'].includes(b.rawTagName),
  },
];

/* A ISENÇÃO DE `<abbr>` SAIU (achado 7 da leitura a frio do Codex, 15.09.2026).
   Estava escrita como «uma abreviatura com a sua marca de expansão é uma palavra
   só», e o que ela fazia era outra coisa: isentava QUALQUER fronteira que
   tocasse num `<abbr>`, dos dois lados. `<abbr>INE</abbr><span>publicou</span>`
   lê-se «INEpublicou» e passava. Uma isenção que apaga o defeito que devia
   apanhar não se estreita: tira-se. Um `<abbr>` dentro de uma palavra continua
   fora da conta pela regra geral, que é a do nó de texto: a célula só olha para
   a fronteira entre DOIS elementos, e `km<abbr>²</abbr>` tem texto antes. O
   `--prova` planta os dois casos e exige as duas respostas. */

/* ========================================================================== */
/* C1 · o que já estava vermelho quando a régua nasceu                        */
/* ========================================================================== */

/**
 * AS TRÊS ROTAS QUE ESTA RÉGUA ENCONTROU VERMELHAS NO DIA EM QUE NASCEU.
 *
 * Não são exceções: são O MESMO DEFEITO que a fez nascer, medido noutras
 * páginas, e ficam aqui escritas com o número para que ninguém precise de as
 * procurar outra vez. Corrida sobre `dist/` na cabeça 44f0d838, C1 deu 5 112
 * vermelhos, e depois de a lista dos domínios ficar arrumada sobram 5 104, em
 * três sítios:
 *
 *   · `/municipios/<slug>` e `/en/municipalities/<slug>`, 616 páginas, oito
 *     classes: as formas gráficas (`forma`, `forma-svg`, `forma-barra-c`,
 *     `forma-barra-num`, `forma-barra-p`, `forma-frase`, `forma-frase-num`,
 *     `forma-selo-rot`) têm as suas regras em `src/styles/dominio.css`, e
 *     `MunicipioView.astro` importa `inicio.css` e `municipio.css`;
 *   · `/distritos/<slug>` e `/en/districts/<slug>`, 58 páginas, três classes:
 *     `lig`, `mapa-svg` e `mapa-svg-areas` têm as suas regras em
 *     `src/styles/inicio.css`, e `DistritoView.astro` importa só `distrito.css`;
 *   · `/livro-razao/concelhos` e a gémea inglesa, 2 páginas, uma classe:
 *     `pesquisa-distrito` tem a sua regra em `src/styles/inicio.css`, e
 *     `LivroConcelhosView.astro` importa `linha.css` e `municipio.css`.
 *
 * PORQUE É QUE NÃO SE FECHARAM AQUI. Fechar cada um é escolher que folha passa a
 * chegar a que página, e a folha mais pequena das três leva 5,5 KB de regras a
 * 616 páginas que hoje não as têm: o que se vê nessas páginas muda, e quanto
 * muda tem de ser medido antes e depois. Não é uma correção do mesmo dia, é uma
 * decisão do lugar de direção com uma medição ao lado. O que esta fatia faz é
 * pôr a régua no `verify` com a dívida contada, e não deixar entrar mais nenhuma.
 *
 * A QUARENTENA É POR ROTA E POR CLASSE. Uma classe nova na mesma rota, ou a
 * mesma classe noutra rota, fecha a construção: o que está aqui é o que já
 * estava, e não uma porta aberta.
 */
const C1_EM_QUARENTENA = new Map([
  [
    'municipio',
    new Set([
      'forma', 'forma-svg', 'forma-barra-c', 'forma-barra-num', 'forma-barra-p',
      'forma-frase', 'forma-frase-num', 'forma-selo-rot',
    ]),
  ],
  ['distrito', new Set(['lig', 'mapa-svg', 'mapa-svg-areas'])],
  ['livroConcelhos', new Set(['pesquisa-distrito'])],
]);

/* ========================================================================== */
/* a corrida                                                                  */
/* ========================================================================== */

/**
 * Corre as duas células sobre um `dist/`.
 * @returns {{erros: string[], contas: object}}
 */
function corre(dist, { descreveRota = true } = {}) {
  const erros = [];
  const cru = [];
  const contas = {
    paginas: 0,
    paginas_documento_alojado: 0,
    folhas: 0,
    classes_com_regra: 0,
    classes_rendidas: 0,
    c1_vermelhos: 0,
    c1_em_quarentena: 0,
    c2_fronteiras: 0,
    c2_entre_caixas: 0,
    c2_entre_texto: 0,
    c2_separados_pela_folha: 0,
    c2_vermelhos: 0,
    c2_aceites: 0,
    folhas_externas: 0,
  };

  const folhas = folhasDe(dist);
  contas.folhas = folhas.length;
  /** @type {Map<string, Set<string>>} caminho absoluto da folha → classes */
  const porFolha = new Map();
  /** @type {Map<string, Map<string, Set<string>>>} folha → classe → propriedades */
  const declaraFolha = new Map();
  const comRegra = new Set();
  for (const f of folhas) {
    const texto = fs.readFileSync(f, 'utf8');
    const cs = classesDeCss(texto);
    porFolha.set(f, cs);
    declaraFolha.set(f, declaracoesDeCss(texto));
    for (const c of cs) comRegra.add(c);
  }
  contas.classes_com_regra = comRegra.size;

  const rendidas = new Set();

  for (const ficheiro of paginasDe(dist)) {
    const caminho = '/' + path.relative(dist, ficheiro).split(path.sep).join('/');
    const rota = descreveRota ? matchPath(caminho.replace(/index\.html$/, '')) : null;
    /* O DOCUMENTO ORIGINAL DE UM ESTUDO NÃO É UMA PÁGINA DESTE SÍTIO: é o
       trabalho tal como foi publicado, alojado aqui, com a sua folha e o seu
       markup. Conferir-lhe as classes ou as fronteiras era pedir-lhe que se
       escrevesse como a casa escreve. */
    if (rota?.key === 'documento') {
      contas.paginas_documento_alojado++;
      continue;
    }
    contas.paginas++;

    const raiz = parse(fs.readFileSync(ficheiro, 'utf8'));

    /* ---------------------------------------------------------------- C1 --- */
    const chega = new Set();
    /** As propriedades que cada classe recebe DESTA página, e de mais nenhuma. */
    const declara = new Map();
    const junta = (m) => {
      for (const [c, props] of m) {
        const s = declara.get(c) ?? new Set();
        for (const pr of props) s.add(pr);
        declara.set(c, s);
      }
    };
    for (const l of raiz.querySelectorAll('link[rel="stylesheet"]')) {
      const href = l.getAttribute('href') ?? '';
      if (!href.startsWith('/')) {
        contas.folhas_externas++;
        continue;
      }
      const f = path.join(dist, href.split('?')[0]);
      const cs = porFolha.get(f);
      if (cs) for (const c of cs) chega.add(c);
      const dec = declaraFolha.get(f);
      if (dec) junta(dec);
    }
    for (const st of raiz.querySelectorAll('style')) {
      const texto = st.textContent ?? '';
      for (const c of classesDeCss(texto)) chega.add(c);
      junta(declaracoesDeCss(texto));
    }
    /** O que a folha desta página declara para as classes de um elemento. */
    const propsDe = (el) => {
      const out = new Set();
      for (const c of (el.getAttribute('class') ?? '').split(/\s+/)) {
        if (!c) continue;
        for (const pr of declara.get(c) ?? []) out.add(pr);
      }
      return out;
    };

    const semRegraNaPagina = new Set();
    for (const el of raiz.querySelectorAll('[class]')) {
      for (const c of (el.getAttribute('class') ?? '').split(/\s+/)) {
        if (!c) continue;
        rendidas.add(c);
        if (comRegra.has(c) && !chega.has(c)) semRegraNaPagina.add(c);
      }
    }
    for (const c of [...semRegraNaPagina].sort()) {
      if (rota && C1_EM_QUARENTENA.get(rota.key)?.has(c)) {
        contas.c1_em_quarentena++;
        continue;
      }
      contas.c1_vermelhos++;
      cru.push({ celula: 'C1', caminho, rota: rota?.key ?? null, classe: c });
      const onde = [...porFolha.entries()]
        .filter(([, cs]) => cs.has(c))
        .map(([f]) => path.relative(dist, f))
        .join(', ');
      erros.push(
        `C1 · ${caminho} rende «${c}» e não liga nenhuma folha com a regra dela. ` +
          `A regra está em: ${onde}.`,
      );
    }

    /* ---------------------------------------------------------------- C2 --- */
    const vistos = new Set();
    for (const bloco of raiz.querySelectorAll([...BLOCOS].join(','))) {
      const pilha = [bloco];
      while (pilha.length) {
        const el = pilha.pop();
        if (vistos.has(el)) continue;
        vistos.add(el);
        const filhos = el.childNodes ?? [];
        for (const f of filhos) if (f.nodeType === NodeType.ELEMENT_NODE) pilha.push(f);
        for (let i = 0; i + 1 < filhos.length; i++) {
          const a = filhos[i];
          const b = filhos[i + 1];
          if (a.nodeType !== NodeType.ELEMENT_NODE) continue;
          if (b.nodeType !== NodeType.ELEMENT_NODE) continue;
          const antes = a.textContent ?? '';
          const depois = b.textContent ?? '';
          if (!/[\p{L}\p{N}]$/u.test(antes)) continue;
          if (!/^[\p{L}\p{N}]/u.test(depois)) continue;
          contas.c2_fronteiras++;
          /* Duas caixas não fazem uma palavra. */
          if (!EM_LINHA.has(a.rawTagName) || !EM_LINHA.has(b.rawTagName)) {
            contas.c2_entre_caixas++;
            continue;
          }
          contas.c2_entre_texto++;
          const aceite = COLAGENS_ACEITES.find((x) => x.par(a, b));
          if (aceite) {
            contas.c2_aceites++;
            continue;
          }
          /* A folha DESTA página põe espaço aqui? Basta uma das três respostas:
             um antepassado até ao bloco que abra espaço entre os filhos, ou uma
             das duas peças que se afaste ou deixe de ser texto corrido. */
          const parte = (d) => {
            const i = d.indexOf(':');
            return [d.slice(0, i), d.slice(i + 1)];
          };
          /* A SUBIDA VAI ATÉ À RAIZ, E NÃO ATÉ AO BLOCO, e foi uma medição que o
             decidiu: o sumário do Método é `<ol class="metodo-sumario-lista">`
             com `<li>` sem classe, e o `gap: 10px` que separa o número do nome
             está escrito em `.metodo-sumario-lista li`, isto é, atribuído por
             esta régua à classe do `<ol>`, que está FORA do bloco. Parar no
             bloco dava vinte vermelhos numa lista que tem o espaço lá.
             É a leitura conservadora de propósito: esta régua lê as declarações
             por CLASSE e não resolve a cascata, e entre deixar passar uma
             colagem e inventar uma que não existe, deixa passar. */
          let separado = false;
          for (let p = el; p; p = p.parentNode) {
            if ([...propsDe(p)].some((d) => SEPARA_O_PAI(...parte(d)))) {
              separado = true;
              break;
            }
          }
          if (!separado) {
            for (const peca of [a, b]) {
              if ([...propsDe(peca)].some((d) => SEPARA_A_PECA(...parte(d)))) {
                separado = true;
                break;
              }
            }
          }
          if (separado) {
            contas.c2_separados_pela_folha++;
            continue;
          }
          contas.c2_vermelhos++;
          const fim = antes.slice(-14);
          const inicio = depois.slice(0, 14);
          cru.push({
            celula: 'C2',
            caminho,
            rota: rota?.key ?? null,
            bloco: bloco.rawTagName,
            blocoClasse: bloco.getAttribute('class') ?? '',
            a: a.rawTagName,
            aClasse: a.getAttribute('class') ?? '',
            b: b.rawTagName,
            bClasse: b.getAttribute('class') ?? '',
            fim,
            inicio,
          });
          erros.push(
            `C2 · ${caminho} · dentro de <${bloco.rawTagName}>, ` +
              `<${a.rawTagName}> e <${b.rawTagName}> não têm espaço entre eles: ` +
              `«${fim}» + «${inicio}» lê-se «${fim}${inicio}».`,
          );
        }
      }
    }
  }

  contas.classes_rendidas = rendidas.size;
  return { erros, contas, cru };
}

/* ========================================================================== */
/* os positivos conhecidos                                                    */
/* ========================================================================== */

/**
 * Um `dist/` de mentira com um defeito de cada espécie, montado fora da árvore
 * do sítio. Devolve o directório, para quem o apague.
 */
function montaAProva() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-css-prova-'));
  fs.mkdirSync(path.join(dir, '_astro'));
  /* A folha que a página LIGA. */
  fs.writeFileSync(
    path.join(dir, '_astro', 'liga.css'),
    '.tem-regra-aqui{color:red}\n@media (max-width:100px){.dentro-de-media{color:red}}\n' +
      '.com-gap{display:flex;gap:8px}\n.com-margem{margin-left:8px}\n',
  );
  /* A folha que a página NÃO liga, e onde está a regra da classe que ela rende:
     é o defeito de 15.09, em miniatura. */
  fs.writeFileSync(
    path.join(dir, '_astro', 'nao-liga.css'),
    '.regra-que-nao-chega{display:flex;gap:6px 14px}\n',
  );
  fs.writeFileSync(
    path.join(dir, 'index.html'),
    '<!doctype html><html lang="pt-PT"><head><meta charset="utf-8">' +
      '<link rel="stylesheet" href="/_astro/liga.css">' +
      '<style>.embutida{color:red}</style></head><body>' +
      /* C1: a classe tem regra em `nao-liga.css` e a página não a liga. */
      '<ol><li class="regra-que-nao-chega">' +
      /* C2: dois elementos vizinhos sem espaço entre eles. */
      '<a href="/x">Trabalho</a><span>as medidas estão noutro</span>' +
      '</li></ol>' +
      /* C2, segundo vermelho: UMA ABREVIATURA COLADA AO QUE SE LHE SEGUE.
         «INEpublicou» é o mesmo defeito que «Trabalhoas», e até 15.09.2026
         passava, porque a isenção antiga isentava qualquer fronteira que
         tocasse num `<abbr>`. Plantado para que o dia em que alguém a reescrever
         tenha de explicar este vermelho. */
      '<p><abbr title="Instituto Nacional de Estatística">INE</abbr><span>publicou</span></p>' +
      /* O que NÃO pode ficar vermelho, e prova que a régua não grita por tudo:
         uma classe com regra na folha ligada, uma classe com regra embutida,
         uma classe dentro de um `@media` da folha ligada, uma classe sem regra
         em folha nenhuma, e um par com espaço. */
      '<p class="tem-regra-aqui embutida dentro-de-media sem-regra-em-lado-nenhum">' +
      '<a href="/y">Um</a> <span>dois</span>' +
      '</p>' +
      /* UMA MARCA DENTRO DE UMA PALAVRA, e o par que a célula VÊ.
         A primeira redação plantava `texto<strong>…</strong>`, que nunca chegava
         a ser candidato porque começa num nó de texto, e mesmo assim a mensagem
         de sucesso dizia que a régua o tinha deixado passar: um positivo
         conhecido que não prova o que diz é pior do que nenhum (achado 7 da
         leitura a frio do Codex, 15.09.2026). O que fica são os dois casos, e a
         diferença entre eles é a regra: o primeiro tem texto antes da marca e a
         célula não o vê; o segundo é `</abbr><sup>`, duas peças encostadas que
         a célula VÊ e deixa passar pela isenção do expoente, escrita. */
      '<p>km<abbr title="quadrado">²</abbr> e texto<strong>com marca</strong></p>' +
      '<p><abbr title="metro">m</abbr><sup>2</sup></p>' +
      /* O IDIOMA DA CASA: encostadas no HTML, separadas pela folha que a página
         liga. Uma pelo `gap` do pai, a outra pela margem de uma das peças. */
      '<p class="com-gap"><span>valor</span><a href="/z">fonte</a></p>' +
      '<p><span>valor</span><a class="com-margem" href="/z">fonte</a></p>' +
      '</body></html>',
  );
  return dir;
}

if (PROVA) {
  const dir = montaAProva();
  let r;
  try {
    r = corre(dir, { descreveRota: false });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  const c1 = r.erros.filter((e) => e.startsWith('C1 ·'));
  const c2 = r.erros.filter((e) => e.startsWith('C2 ·'));
  const falhas = [];
  if (c1.length !== 1) falhas.push(`C1 devia ver 1 defeito plantado e viu ${c1.length}`);
  if (c1[0] && !c1[0].includes('regra-que-nao-chega')) {
    falhas.push(`C1 viu outra coisa: ${c1[0]}`);
  }
  if (c2.length !== 2) falhas.push(`C2 devia ver 2 defeitos plantados e viu ${c2.length}`);
  if (!c2.some((e) => e.includes('Trabalho'))) {
    falhas.push('C2 não viu o nome colado ao estado, que é o defeito de 15.09');
  }
  if (!c2.some((e) => e.includes('INE'))) {
    falhas.push('C2 não viu a abreviatura colada ao que se lhe segue');
  }
  /* A isenção do expoente morde uma vez, no `</abbr><sup>`, e não no
     `km<abbr>²</abbr>`, que nem candidato é. Se contar dois, a régua passou a
     ver nós de texto e a mensagem deixa de ser verdade. */
  if (r.contas.c2_aceites !== 1) {
    falhas.push(`o expoente plantado devia contar 1 colagem aceite e contou ${r.contas.c2_aceites}`);
  }
  /* Cinco candidatos entre peças de texto: os dois vermelhos, o expoente
     isento, e os dois que a folha ligada separa. O `texto<strong>` e o
     `km<abbr>` não entram, porque têm um nó de texto antes. */
  if (r.contas.c2_entre_texto !== 5) {
    falhas.push(
      `a prova planta 5 fronteiras entre peças de texto (2 vermelhas, 1 isenta, 2 separadas ` +
        `pela folha) e a régua contou ${r.contas.c2_entre_texto}: ou passou a ver nós de texto, ` +
        `ou deixou de ver um par de elementos`,
    );
  }
  if (r.contas.c2_separados_pela_folha !== 2) {
    falhas.push(
      `os dois pares que a folha ligada separa (um por «gap», um por margem) deviam contar 2 e ` +
        `contaram ${r.contas.c2_separados_pela_folha}`,
    );
  }
  if (r.contas.c2_entre_caixas !== 0) {
    falhas.push(`a prova não planta fronteiras entre caixas e contou ${r.contas.c2_entre_caixas}`);
  }
  if (falhas.length) {
    console.error(vermelho('\n  PORTÃO DAS FOLHAS · o positivo conhecido não bateu certo\n'));
    for (const f of falhas) console.error(vermelho('    · ') + f);
    console.error(cinza(`\n    o que a prova viu: ${JSON.stringify(r.erros)}\n`));
    process.exit(1);
  }
  console.log(
    cinza(
      '  folhas · positivo conhecido: C1 viu a classe cuja regra não chega à página; C2 viu ' +
        'os dois defeitos plantados (o nome colado ao estado e a abreviatura colada ao que se ' +
        'lhe segue). Nenhuma acusou a classe com regra na folha ligada, a regra embutida, a ' +
        'regra dentro de um `@media`, a classe sem regra, nem o par com espaço. Das cinco ' +
        'fronteiras entre peças de texto, duas ficaram vermelhas, uma foi isenta pelo expoente ' +
        'e duas foram separadas pela folha que a página liga; as duas marcas dentro de uma ' +
        'palavra não chegam a ser candidatas, porque têm um nó de texto antes.',
    ),
  );
}

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DAS FOLHAS · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

const { erros, contas, cru } = corre(DIST);

/* `--json` despeja o que as duas células viram, uma linha por achado, para quem
   queira contar por rota ou por par de etiquetas. Não muda o que o portão faz. */
{
  const i = process.argv.indexOf('--json');
  if (i !== -1 && process.argv[i + 1]) {
    fs.writeFileSync(process.argv[i + 1], JSON.stringify({ contas, cru }, null, 1));
  }
}

console.log('');
if (erros.length) {
  console.error(vermelho(`  PORTÃO DAS FOLHAS · ${erros.length} problema(s)\n`));
  for (const e of erros.slice(0, 40)) console.error(vermelho('    · ') + e);
  if (erros.length > 40) console.error(cinza(`    … e mais ${erros.length - 40}`));
  console.error('');
  process.exit(1);
}

console.log(
  verde('  folhas ✓ ') +
    `${contas.paginas} página(s) · ${contas.folhas} folha(s) construída(s) com ` +
    `${contas.classes_com_regra} classe(s) estilizada(s) · ${contas.classes_rendidas} classe(s) ` +
    `rendidas no HTML · C1: 0 regras que não chegam · C2: ${contas.c2_fronteiras} fronteira(s) ` +
    `sem espaço no HTML, 0 coladas`,
);
console.log(
  cinza(
    `        C2, das ${contas.c2_fronteiras} fronteiras: ${contas.c2_entre_caixas} entre duas ` +
      `caixas (duas caixas não fazem uma palavra) · ${contas.c2_entre_texto} entre duas peças de ` +
      `texto, das quais ${contas.c2_separados_pela_folha} a folha desta página separa com um ` +
      `«gap», uma margem ou um «display»`,
  ),
);
if (contas.c2_aceites > 0) {
  console.log(
    cinza(
      `        ${contas.c2_aceites} colagem(ns) aceite(s) e escrita(s) em COLAGENS_ACEITES: ` +
        COLAGENS_ACEITES.map((x) => x.porque.split('.')[0]).join(' · '),
    ),
  );
}
if (contas.c1_em_quarentena > 0) {
  console.log(
    cinza(
      `        C1 · ${contas.c1_em_quarentena} regra(s) que não chegam, em quarentena escrita em ` +
        `C1_EM_QUARENTENA: o MESMO defeito noutras rotas (as formas do concelho, o mapa do ` +
        `distrito, o distrito na busca do índice dos números), à espera da decisão do lugar de ` +
        `direção sobre que folha passa a chegar a que página. Não é uma exceção: é dívida contada.`,
    ),
  );
}
if (contas.paginas_documento_alojado > 0) {
  console.log(
    cinza(
      `        ${contas.paginas_documento_alojado} documento(s) de estudo alojado(s) tal como ` +
        `estão, fora das duas células: nenhuma linha deles é da casa.`,
    ),
  );
}
console.log('');
