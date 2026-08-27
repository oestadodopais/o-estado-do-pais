#!/usr/bin/env node
/**
 * A régua deste bloco — mede o que o BRIEF-confianca.md mediu, para se poder
 * dizer «antes» e «depois» com o mesmo instrumento.
 *
 * NÃO é um portão: não falha nada, não entra no `npm run build`. É uma fita
 * métrica. Corre sobre `dist/` e sobre `ledger/claims/`, e imprime seis
 * contagens:
 *
 *   1. porta de correcções — quantas páginas construídas trazem a caixa
 *      «Encontrou um erro», e quantas não trazem;
 *   2. selos na primeira página — valores (`data-claim`) sem selo ao lado, e
 *      selos que apontam para outra linha que não a do valor;
 *   3. frases de moldura — blocos de texto com 30 ou mais carácteres que
 *      aparecem em mais do que uma página;
 *   4. o marcador retirado `[descrição em preparação]`;
 *   5. `#page=` nas linhas do livro-razão;
 *   6. localizadores que nomeiam um artefacto interno (ficheiro, chave JSON);
 *   7. frases de cobertura — quantas cadeias visíveis DISTINTAS o sítio usa
 *      para cada estado de cobertura editorial, por edição (defeito 7);
 *   8. frases da casa — o inventário de todos os blocos de texto de uma rota
 *      inventariada que são prosa da casa, mais a DESCRIÇÃO do seu `<head>`,
 *      classificados em conteúdo, navegação e autorreferência pela lista
 *      declarada em `design/especime-v3/INVENTARIO-FRASES.md` (Emenda 15).
 *   9. o tripwire da voz · os mesmos blocos, passados pela lista fechada de
 *      marcadores de `design/especime-v3/VOZ-MARCADORES.md`, DECLARADOS OU NÃO.
 *      A medida 8 acredita em quem escreveu a frase; esta não.
 *
 * Uso:  node scripts/medir-defeitos.mjs            (imprime)
 *       node scripts/medir-defeitos.mjs --json     (para guardar uma medição)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, NodeType } from 'node-html-parser';

import { loadClaims } from '../src/lib/ledger.mjs';
import { matchPath, routePath } from '../src/lib/routes.mjs';
import { leMarcadores, analisa, leInventario, FICHEIRO_DOS_MARCADORES } from './voz.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');

const cinza = (s) => `\x1b[90m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;

function ficheirosHtml(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...ficheirosHtml(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out.sort();
}

function texto(no) {
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(no);
  return partes.join(' ');
}

const norm = (s) => String(s).replace(/\s+/g, ' ').trim();

const SECCIONADORES = new Set(['section', 'article', 'aside', 'details', 'main', 'header', 'footer', 'body', 'html']);

/**
 * Uma «frase de moldura», definida como programa.
 *
 * É prosa da casa — as palavras que embrulham os números, não os números nem os
 * campos do livro-razão. Definição mecânica, para que «antes» e «depois» sejam
 * medidos com a mesma régua e por qualquer pessoa:
 *
 *   · um bloco de texto (um elemento que não contém outro elemento de bloco);
 *   · com 30 ou mais carácteres;
 *   · que não seja, nem contenha, conteúdo com origem declarada — `data-claim`,
 *     `data-linha-*`, `data-correcao-*`, `data-verbatim`, `data-nonledger`,
 *     `data-agenda`. Esses são o livro-razão, ou o registo da agenda, a falar,
 *     e não a casa. (`data-agenda` entrou a 16.08.2026 com a origem 8, pela
 *     mesma razão das outras: um excerto do calendário das fontes é a fonte a
 *     falar, e contá-lo como moldura da casa mediria a coisa errada. Quem
 *     comparar duas construções tem de correr esta régua nas duas.);
 *   · e que apareça em MAIS DO QUE UMA página construída.
 *
 * A última condição é a do BRIEF §3.2 («todas as 43 aparecem em mais de uma
 * página»): uma frase escrita uma vez, num sítio, é conteúdo; a mesma frase
 * repetida em 264 páginas é moldura.
 *
 * **Esta régua NÃO reproduz os números do BRIEF, e é honesto dizê-lo.** As 43
 * frases do §3.2 foram identificadas à mão, uma a uma; esta definição é
 * mecânica e apanha mais coisas — rótulos, cabeçalhos de secção, estados vazios
 * — pelo que dá 86 onde o BRIEF deu 43. O que a régua serve é **comparar duas
 * construções com o mesmo instrumento**: um número absoluto desta saída não é
 * comparável com um número do BRIEF, e um «antes» e um «depois» medidos aqui
 * são comparáveis entre si e com mais nada.
 */
const BLOCOS = 'p,li,dd,dt,h1,h2,h3,h4,figcaption,summary,blockquote,td,th,caption';
/**
 * `data-registo*` entrou a 24.08.2026 com as páginas de leitura, e pela mesma
 * razão de todas as outras: **um documento transcrito não é a casa a falar**.
 * O corpo de uma página de leitura são os blocos de um documento fixado, com
 * cada algarismo comparado carácter a carácter com o registo de conteúdo do
 * motor; contá-los como frases da casa mediria a coisa errada, e faria a
 * contagem de moldura saltar 829 blocos de prosa de estudo de uma vez. As
 * quatro marcas entram juntas porque as quatro são a mesma origem, vista em
 * quatro sítios: o corpo (`data-registo-unidade` e `data-registo`), as linhas
 * do documento (`data-registo-linha`) e a faixa (`data-registo-conta`). Quem
 * comparar duas construções tem de correr esta régua nas duas.
 */
const ORIGEM_DECLARADA =
  '[data-claim],[data-linha-claim],[data-correcao-claim],[data-verbatim],[data-nonledger],' +
  '[data-agenda],[data-registo],[data-registo-unidade],[data-registo-linha],[data-registo-conta]';

function blocosDe(root) {
  const out = [];
  const marcados = new Set();
  for (const el of root.querySelectorAll(ORIGEM_DECLARADA)) {
    marcados.add(el);
    for (const d of el.querySelectorAll('*')) marcados.add(d);
  }
  for (const el of root.querySelectorAll(BLOCOS)) {
    if (el.querySelector(BLOCOS)) continue;
    if (marcados.has(el)) continue;
    if (el.querySelector(ORIGEM_DECLARADA)) continue;
    const t = norm(texto(el));
    if (t.length >= 30) out.push(t);
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

const claims = loadClaims();
const ficheiros = ficheirosHtml(DIST);

let paginas = 0;
let comPorta = 0;
const semPorta = [];
const ocorrenciasPorBloco = new Map(); // bloco → total
const paginasPorBloco = new Map(); // bloco → nº de páginas
let marcadorRetirado = 0;
const paginasComMarcadorRetirado = new Set();

let frontSemSelo = [];
let frontSeloErrado = [];
const blocosDaPorta = new Set();

/**
 * 7 — AS FRASES DE COBERTURA (v3, etapa 2a; defeito 7 de `DECISIONS.md` §4).
 *
 * O sítio dizia a mesma coisa de três maneiras: «Municípios com estudo
 * aprofundado publicado», «Município com estudo publicado» e «sem página
 * ainda», em três superfícies, e nenhuma máquina sabia que eram a mesma coisa.
 * Agora cada rendição de um estado de cobertura leva
 * `data-cobertura="com-pagina"` ou `"sem-pagina"`, e esta medida conta, POR
 * EDIÇÃO E POR ESTADO, quantas cadeias visíveis distintas existem.
 *
 * **O defeito fecha quando cada contagem é 1.** Duas cadeias para o mesmo
 * estado na mesma edição são duas línguas para a mesma coisa; zero quer dizer
 * que a marca desapareceu, e isso não é um sucesso, é uma medição que deixou de
 * medir. As duas leituras estão na saída.
 *
 * A edição sai do `<html lang>` da própria página, e não da rota: é o que o
 * leitor recebe.
 */
/**
 * 8 — AS FRASES DA CASA (v3, etapa 2l; Emenda 15 de 21.08.2026).
 *
 * «Uma página do leitor leva conteúdo (a medida, o valor, a unidade, o período,
 * o nome da fonte) e navegação. Não leva nenhuma frase sobre o método, a
 * verificação, a honestidade, a cobertura ou as intenções do próprio sítio.»
 *
 * A emenda traz a sua própria medida: «o inventário de todas as frases da casa
 * na superfície pública, classificadas em conteúdo, navegação e
 * autorreferência; a terceira classe vai a zero fora do Método, do Sobre e do
 * recibo, e a régua imprime a contagem para que não volte».
 *
 * ---------------------------------------------------------------------------
 * O QUE CONTA COMO «FRASE DA CASA», DEFINIDO COMO PROGRAMA
 * ---------------------------------------------------------------------------
 * Um bloco de texto (a mesma definição da medida 3: um elemento de bloco que
 * não contém outro) que NÃO seja, nem contenha:
 *
 *   · uma origem declarada — `data-claim`, `data-prova`, `data-verbatim`,
 *     `data-nonledger`, `data-linha-*`, `data-correcao-*`, `data-agenda`. Essas
 *     são o livro-razão, o próprio sítio contado, ou uma transcrição: não são a
 *     casa a falar;
 *   · o NOME de uma medida ou a sua linha de UNIDADE, marcados
 *     `data-medida-nome` e `data-medida-unidade` no gabarito. São conteúdo por
 *     definição da emenda, e são marcados em vez de reconhecidos pelo nome da
 *     classe, para que a régua não dependa de uma folha de estilos;
 *   · uma LIGAÇÃO DE NAVEGAÇÃO — um bloco cujo texto está todo dentro de um
 *     `<a>` ou de um `<button>`, ou um bloco que É o rótulo de um comando (um
 *     `<summary>`). Um destino não é uma frase, e nesta página metade dos
 *     destinos são botões: o script troca as ligações por botões para que a
 *     página mude sem recarregar, e a régua tem de ver a mesma coisa que o
 *     leitor vê — uma coisa em que se carrega.
 *
 * O que sobra é a casa a escrever, e cada bloco tem de estar na lista
 * declarada, com a sua classe. Um bloco que não esteja lá sai na saída como
 * NÃO CLASSIFICADO, que é o estado que obriga alguém a decidir.
 *
 * A régua não falha nada: imprime. O alvo — autorreferência a zero na primeira
 * página, nas duas edições — é conferido por uma célula da matriz.
 */
/**
 * ---------------------------------------------------------------------------
 * A DESCRIÇÃO DO `<head>` CONTA, E CONTA PELA MESMA RÉGUA (direção, 21.08.2026)
 * ---------------------------------------------------------------------------
 * A `<meta name="description">` é superfície pública: é o que um motor de busca
 * e um cartão de partilha citam, e é escrita pela casa como qualquer outro
 * bloco. Ficava de fora desta medida porque a varredura é sobre o `<body>`, e a
 * primeira página descrevia-se a si própria («Cada número publicado tem uma
 * linha no livro-razão…») com a contagem de autorreferência a zero.
 *
 * Entra como um bloco só, com o texto que o atributo `content` leva, e é
 * classificada na mesma lista. Numa página de linha o `<head>` é COMPOSTO da
 * linha (`src/lib/livro.mjs`, e o portão recompõe-o) e não é prosa da casa: por
 * isso esta medida corre sobre um conjunto declarado de rotas, e não sobre as
 * 307 páginas.
 *
 * ---------------------------------------------------------------------------
 * AS ROTAS INVENTARIADAS, E PORQUE SÃO UMA LISTA
 * ---------------------------------------------------------------------------
 * A Emenda 15 põe a autorreferência a zero «fora do Método, do Sobre e do
 * recibo». O inventário cresce com as etapas: uma rota entra aqui no commit em
 * que a sua página é reconstruída e as suas frases são classificadas. Uma rota
 * que não esteja nesta lista não é medida — e isso está escrito, em vez de
 * parecer um zero.
 */
const CLASSES = ['conteudo', 'navegacao', 'autorreferencia'];
const MEDIDA_DECLARADA = '[data-medida-nome],[data-medida-unidade]';
const ROTAS_DO_INVENTARIO = new Set([
  'home',
  'livro',
  'municipios',
  /* Évora entra no commit 4-0: a decisão da direção de 21.08.2026 tirou-lhe a
     abertura, as contagens por extenso e o parágrafo de atribuição, e uma rota
     medida é a única maneira de isso não voltar. `municipio` é a rota de um
     concelho com página, e hoje há uma. */
  'municipio',
  /* `/livro-razao/concelhos` entra no bloco dos 308 (P2). É a página do conjunto
     das linhas dos concelhos, e é uma página do leitor como o índice do
     livro-razão de que ela sai: a Emenda 15 governa-a, e a sua autorreferência
     vai a zero. Sem esta entrada, uma página nova do sítio ficava fora do
     inventário — e o inventário existe para que nenhuma volte a ficar. */
  'livroConcelhos',
  /* E a página de livro-razão de cada concelho, que veio com ela a 26.08: é uma
     página do leitor, o seu `<h1>` é o nome do concelho (declarado `data-lugar`)
     e a sua descrição é composta com esse nome, como a da página do concelho. */
  'livroConcelho',
  /* `/correcoes` entra na subetapa 4a, que é a que reconstrói a forma do
     registo. A rota não é a casa do método (Emenda 15 isenta o Método, o Sobre e
     o recibo), e por isso a sua autorreferência conta e vai a zero. */
  'correcoes',
  /* `/agenda` entra na subetapa 4c, `/estudos` e `/estudos/<slug>` na 4e. São as
     páginas de leitura que a Emenda 15 governa e que o brief da etapa 4 manda
     medir a zero: nenhuma delas é a casa do método. */
  'agenda',
  'estudos',
  'estudo',
  /* `/estudos/<slug>/texto` entra na P2 da parte 3, que é a etapa que a
     constrói. A rota é uma página do leitor como as outras, e a sua
     autorreferência vai a zero: o que ela mostra é um documento, e a mobília à
     volta dele nomeia o que a coisa é. */
  'texto',
]);

/**
 * O ESTADO DE COBERTURA É VOCABULÁRIO DECLARADO, E NÃO PROSA DA CASA (etapa 3c).
 *
 * `data-cobertura` marca as duas palavras fechadas do sítio, «tem página» e «sem
 * página ainda», e a medida 7 já as conta por conta própria. A Emenda 15 chama-as
 * conteúdo por definição («a ausência dita em duas palavras»), e o nome de um
 * concelho ao lado delas é o nome do âmbito, que a emenda também chama conteúdo.
 *
 * Sem esta exclusão, o índice dos concelhos entrava aqui com **307 blocos** do
 * feitio «Abrantes sem página ainda», um por concelho, e a lista declarada teria
 * de os enumerar um a um para a contagem fechar. Uma lista assim não é um
 * inventário de frases da casa: é a lista dos concelhos escrita outra vez.
 *
 * Fica **fora** de `ORIGEM_DECLARADA` de propósito: essa constante é partilhada
 * com a medida 3 («frases de moldura»), que é uma linha de base comparada entre
 * construções desde a etapa 0, e mudá-la mudaria um número que não é deste
 * assunto.
 */
const COBERTURA_DECLARADA = '[data-cobertura]';

/**
 * O NOME DE UM LUGAR NÃO É UMA FRASE DA CASA (bloco dos 308, P2).
 *
 * `data-lugar` marca o nome de um concelho e a etiqueta que a Carta
 * Administrativa lhe dá («distrito de Bragança», «Ilha do Faial»). São o nome da
 * coisa de que a página trata, transcrito de um registo, e não a casa a
 * escrever. Sem esta exclusão o inventário passava a ter, com as 308 páginas,
 * mais 924 entradas — o nome, a etiqueta e a descrição de cada concelho —, que é
 * a lista dos concelhos escrita outra vez. É a mesma razão, e a mesma forma, da
 * exclusão de `data-cobertura` acima.
 *
 * A DESCRIÇÃO DO `<head>` É COMPOSTA COM ESSE NOME, e por isso não se conta 308
 * vezes: conta-se uma, com o nome substituído pelo lugar que ele ocupa. O que
 * fica declarado no inventário é a frase que a casa escreveu — «O que as fontes
 * publicam sobre o município de <lugar>: …» —, que é o que ela é. É a mesma
 * regra que já governa a página de uma linha, cujo `<head>` é composto da linha
 * e por isso fica fora da lista de rotas.
 */
const LUGAR_DECLARADO = '[data-lugar]';

/** A lista declarada: texto normalizado → classe. A leitura vive em `voz.mjs`,
    porque o portão da voz lê a mesma tabela e a terceira coluna dela. */
const INVENTARIO = leInventario(RAIZ);

/**
 * Os blocos de prosa da casa de uma página.
 *
 * A varredura é a de `blocosDe()`, com duas exclusões a mais: o que está
 * marcado como nome ou unidade de uma medida, e o que é só uma ligação.
 */
/** O texto de um elemento, sem o que está dentro de `<a>` e de `<button>`. */
function textoForaDeComandos(no) {
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'a' || tag === 'button') return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(no);
  return partes.join(' ');
}

/**
 * O TEXTO DE UM BLOCO, SEM O QUE ESTÁ DENTRO DE UMA ORIGEM DECLARADA (V1,
 * 27.08.2026).
 *
 * A medida 8 DEIXA CAIR um bloco inteiro que contenha uma origem declarada, e
 * está certa: o que ela conta são as frases da casa, e um `<dd>` com um valor do
 * livro-razão lá dentro não é uma frase de moldura. Mas o tripwire da voz não
 * está a contar frases: está à procura de uma casa que fala de si, e essa fala
 * mora muitas vezes ao lado de um número. Medido a 27.08 com a leitura de fora:
 * três das quatro frases que ela apanhou na página de Évora («A página mostra as
 * duas…», «nos quatro anos que esta página publica», «a diferença é publicada
 * arredondada ao euro») partilhavam o bloco com um `<Claim>`, e por isso nunca
 * chegaram à medida 8 nem ao tripwire.
 *
 * O tripwire passa a varrer o texto que fica FORA das origens declaradas, em
 * todos os blocos de uma rota inventariada. Fora dos comandos também, pela razão
 * que a medida 8 já escreve: um destino não é uma frase.
 */
function textoForaDasOrigens(no, marcados) {
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'a' || tag === 'button') return;
    if (marcados.has(n)) return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(no);
  return partes.join(' ');
}

function frasesDaVoz(root) {
  const out = [];
  const DECLARADO =
    ORIGEM_DECLARADA + ',' + MEDIDA_DECLARADA + ',' + COBERTURA_DECLARADA + ',' + LUGAR_DECLARADO;
  const marcados = new Set();
  for (const el of root.querySelectorAll(DECLARADO)) marcados.add(el);
  for (const el of root.querySelectorAll(BLOCOS)) {
    if (el.querySelector(BLOCOS)) continue;
    if (marcados.has(el)) continue;
    const t = norm(textoForaDasOrigens(el, marcados));
    if (t) out.push(t);
  }
  return out;
}

function frasesDaCasa(root) {
  const out = [];
  const marcados = new Set();
  const DECLARADO =
    ORIGEM_DECLARADA + ',' + MEDIDA_DECLARADA + ',' + COBERTURA_DECLARADA + ',' + LUGAR_DECLARADO;
  for (const el of root.querySelectorAll(DECLARADO)) {
    marcados.add(el);
    for (const d of el.querySelectorAll('*')) marcados.add(d);
  }
  for (const el of root.querySelectorAll(BLOCOS)) {
    if (el.querySelector(BLOCOS)) continue;
    if (marcados.has(el)) continue;
    if (el.querySelector(DECLARADO)) continue;
    const t = norm(texto(el));
    if (!t) continue;
    /* Uma ligação inteira não é uma frase: é um destino. O teste é sobre o
       texto que fica FORA das âncoras, e não sobre a etiqueta do elemento. */
    if (String(el.rawTagName ?? '').toLowerCase() === 'summary') continue;
    /* O texto que fica FORA das âncoras e dos botões, percorrendo a árvore. Uma
       subtração de cadeias não serve: dois destinos seguidos dão «a →b →» de um
       lado e «a → b →» do outro, e o bloco escapava por um espaço. */
    const foraDeLigacoes = norm(textoForaDeComandos(el));
    if (!foraDeLigacoes) continue;
    out.push(t);
  }
  return out;
}

const frasesPorRota = new Map(); // rota → Map(texto → ocorrências)
const frasesDaVozPorRota = new Map(); // rota → Set(texto), a varredura do tripwire

const coberturaPorEdicao = new Map(); // edição → estado → Map(cadeia → ocorrências)
function registaCobertura(edicao, estado, cadeia) {
  if (!coberturaPorEdicao.has(edicao)) coberturaPorEdicao.set(edicao, new Map());
  const porEstado = coberturaPorEdicao.get(edicao);
  if (!porEstado.has(estado)) porEstado.set(estado, new Map());
  const cadeias = porEstado.get(estado);
  cadeias.set(cadeia, (cadeias.get(cadeia) ?? 0) + 1);
}

for (const file of ficheiros) {
  const rel = path.relative(DIST, file);
  const caminho = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
  const rota = matchPath(caminho);
  if (rota?.key === 'documento') continue; // obra citada: fora da conta, como no BRIEF
  paginas++;

  const html = fs.readFileSync(file, 'utf8');
  const root = parse(html, { comment: false, blockTextElements: { script: true, style: true } });

  /* 1 — a porta de correcções */
  const portas = root.querySelectorAll('[data-porta-correccoes]');
  if (portas.length) comPorta++;
  else semPorta.push(caminho || '/');

  /* 3 — blocos repetidos */
  const vistosNestaPagina = new Set();
  for (const b of blocosDe(root)) {
    ocorrenciasPorBloco.set(b, (ocorrenciasPorBloco.get(b) ?? 0) + 1);
    vistosNestaPagina.add(b);
  }
  for (const porta of portas) for (const b of blocosDe(porta)) blocosDaPorta.add(b);
  for (const b of vistosNestaPagina) {
    paginasPorBloco.set(b, (paginasPorBloco.get(b) ?? 0) + 1);
  }

  /* 8 — as frases da casa, nas rotas inventariadas: o corpo e a descrição */
  if (rota && ROTAS_DO_INVENTARIO.has(rota.key)) {
    const chave = caminho || '/';
    const conta = frasesPorRota.get(chave) ?? new Map();
    for (const f of frasesDaCasa(root)) conta.set(f, (conta.get(f) ?? 0) + 1);
    let descricao = norm(
      root.querySelector('head meta[name="description"]')?.getAttribute('content') ?? '',
    );
    /* O nome do lugar sai da descrição e deixa no seu lugar a marca: uma frase
       composta conta-se uma vez, e não uma por concelho. */
    for (const el of root.querySelectorAll(LUGAR_DECLARADO)) {
      const nome = norm(texto(el));
      if (nome) descricao = norm(descricao.split(nome).join('<lugar>'));
    }
    if (descricao) conta.set(descricao, (conta.get(descricao) ?? 0) + 1);
    frasesPorRota.set(chave, conta);
    const daVoz = frasesDaVozPorRota.get(chave) ?? new Set();
    for (const f of frasesDaVoz(root)) daVoz.add(f);
    if (descricao) daVoz.add(descricao);
    frasesDaVozPorRota.set(chave, daVoz);
  }

  /* 7 — as frases de cobertura */
  const edicao = root.querySelector('html')?.getAttribute('lang') ?? '(sem lang)';
  for (const el of root.querySelectorAll('[data-cobertura]')) {
    registaCobertura(edicao, el.getAttribute('data-cobertura'), norm(texto(el)));
  }

  /* 4 — o marcador retirado */
  const n = (html.match(/\[descrição em preparação\]/g) ?? []).length;
  if (n) {
    marcadorRetirado += n;
    paginasComMarcadorRetirado.add(caminho || '/');
  }

  /* 2 — selos na primeira página. A mesma regra que o portão impõe: procura-se
     a subir, e a procura pára ao atravessar um elemento de secção. */
  if (rota?.key === 'home') {
    const body = root.querySelector('body') ?? root;
    for (const el of body.querySelectorAll('[data-claim]')) {
      const id = el.getAttribute('data-claim');
      const alvo = routePath('linha', rota.lang, { slug: id });
      let no = el.parentNode;
      let ok = false;
      let outro = null;
      while (no && !ok) {
        for (const a of no.querySelectorAll?.('.src-chip') ?? []) {
          if (String(a.rawTagName ?? '').toLowerCase() !== 'a') continue;
          const href = a.getAttribute('href') ?? '';
          if (href === alvo) { ok = true; break; }
          if (!outro) outro = href;
        }
        if (SECCIONADORES.has(String(no.rawTagName ?? '').toLowerCase())) break;
        no = no.parentNode;
      }
      if (ok) continue;
      if (outro) frontSeloErrado.push(`${caminho || '/'} ${id} → ${outro}`);
      else frontSemSelo.push(`${caminho || '/'} ${id}`);
    }
  }
}

/**
 * 5 e 6 — o livro-razão.
 *
 * «Localizador interno» tem aqui uma definição, e não um julgamento: um
 * localizador é interno quando manda o leitor a uma coisa que ele não tem —
 *
 *   · um ficheiro `.json` ou um caminho `raw/` do repositório do motor;
 *   · uma chave de estrutura de dados (`Dados["2024"]`, `cm_lists`,
 *     `executive_2025.seats[…]`, `mandates[…]`, `final_recipients`,
 *     `total_mandates`, ou uma seta `→` para dentro de um objecto);
 *   · o nome de um ficheiro `.pdf` que NÃO aparece no endereço da própria linha
 *     (o caso da DGAL: o localizador diz `dgal_divida_2024.pdf` e o endereço é
 *     uma cadeia de interrogação sem nome de ficheiro nenhum).
 *
 * Um localizador que diga «p. 119» sobre um PDF cujo nome está no endereço não
 * é interno: é exactamente o que o campo serve para dizer.
 */
let comPage = 0;
let comRecorte = 0;
const localizadoresInternos = [];
const CHAVES = /(\.json|raw\/|→|\[["']|\bcm_lists\b|\bexecutive_\d|\bmandates\[|\bfinal_recipients\b|\btotal_mandates\b)/;
for (const [id, c] of claims) {
  if (typeof c.source_url === 'string' && c.source_url.includes('#page=')) comPage++;
  if (c.document?.crop) comRecorte++;
  const loc = c.document?.locator;
  if (typeof loc !== 'string') continue;
  const url = typeof c.source_url === 'string' ? c.source_url : '';
  const pdfsNoLocalizador = loc.match(/[^\s,/]+\.pdf/gi) ?? [];
  const pdfAusente = pdfsNoLocalizador.some((f) => !url.includes(f));
  if (CHAVES.test(loc) || pdfAusente) localizadoresInternos.push(`${id}: ${loc}`);
}

/* --- relatório --- */
const molduras = [...ocorrenciasPorBloco.entries()]
  .filter(([b]) => (paginasPorBloco.get(b) ?? 0) > 1)
  .sort((a, b) => b[1] - a[1]);
const totalOcorrencias = molduras.reduce((s, [, n]) => s + n, 0);
/* A porta das correções é uma função, não moldura — mas é prosa repetida em
   todas as páginas, e por isso conta. Diz-se à parte para que o «antes» e o
   «depois» não pareçam iguais por acaso. */
const ocorrenciasDaPorta = molduras
  .filter(([b]) => blocosDaPorta.has(b))
  .reduce((s, [, n]) => s + n, 0);

/* As frases de cobertura, arrumadas para a saída e para o JSON. */
const cobertura = {};
for (const [edicao, porEstado] of [...coberturaPorEdicao.entries()].sort()) {
  cobertura[edicao] = {};
  for (const [estado, cadeias] of [...porEstado.entries()].sort()) {
    cobertura[edicao][estado] = {
      distintas: cadeias.size,
      ocorrencias: [...cadeias.values()].reduce((a, b) => a + b, 0),
      cadeias: [...cadeias.keys()].sort(),
    };
  }
}

/* As frases da casa, por rota e por classe. */
/**
 * 9 · O TRIPWIRE DA VOZ (bloco «A grelha da voz», 26.08.2026).
 *
 * A medida 8 classifica uma frase pela DECLARAÇÃO de quem a escreveu, e foi por
 * isso que «É a lei que o define, não este sítio.» viveu declarada como conteúdo
 * em 616 páginas. Esta medida não acredita na declaração: passa cada bloco pela
 * lista fechada de marcadores de `VOZ-MARCADORES.md` e diz quais morderam.
 *
 * Uma frase JÁ DECLARADA como autorreferência não entra nos achados, e não porque
 * seja aceitável, mas porque a medida 8 já a conta, e o `check:voz` fecha a
 * construção por essa contagem. Duas mensagens para o mesmo defeito seriam duas
 * coisas para corrigir onde há uma.
 *
 * A régua continua a não fechar nada: imprime, e escreve no JSON. Quem fecha é
 * `npm run check:voz`.
 */
const VOZ = leMarcadores(RAIZ);
const achadosDaVoz = [];
const frasesVarridas = new Set();
let ocorrenciasVarridas = 0;

const frasesDaCasaPorRota = {};
for (const [rota, conta] of [...frasesPorRota.entries()].sort()) {
  const porClasse = Object.fromEntries(CLASSES.map((c) => [c, 0]));
  const naoClassificados = [];
  let total = 0;
  for (const [t, n] of conta) {
    total += n;
    const classe = INVENTARIO.mapa.get(t);
    if (classe) porClasse[classe] += n;
    else naoClassificados.push(t);
  }
  frasesDaCasaPorRota[rota] = {
    total,
    distintas: conta.size,
    por_classe: porClasse,
    nao_classificados: naoClassificados.sort(),
  };
}

/* A varredura do tripwire, que é mais larga do que a da medida 8. */
for (const [rota, frases] of [...frasesDaVozPorRota.entries()].sort()) {
  for (const t of frases) {
    frasesVarridas.add(t);
    ocorrenciasVarridas++;
    if (INVENTARIO.mapa.get(t) === 'autorreferencia') continue;
    const mordeu = analisa(t, rota, VOZ);
    if (mordeu.length) {
      achadosDaVoz.push({ rota, marcadores: mordeu, classe: INVENTARIO.mapa.get(t) ?? null, texto: t });
    }
  }
}

/* Um achado é uma FRASE, e não uma frase vezes as rotas em que se rende: a
   legenda da dívida vivia em 616 páginas e é um defeito, não 616. As rotas vão
   ao lado, contadas, com a primeira pelo nome. */
const achadosPorFrase = new Map();
for (const a of achadosDaVoz) {
  const chave = a.texto;
  if (!achadosPorFrase.has(chave)) {
    achadosPorFrase.set(chave, { texto: a.texto, marcadores: a.marcadores, classe: a.classe, rotas: [] });
  }
  achadosPorFrase.get(chave).rotas.push(a.rota);
}
const achados = [...achadosPorFrase.values()].map((a) => ({
  texto: a.texto,
  marcadores: a.marcadores,
  classe: a.classe,
  rotas: a.rotas.length,
  rota: a.rotas[0],
}));
const excecoesPorUsar = VOZ.excecoes
  .filter((e) => e.tipo !== 'registo' && e.usos === 0)
  .map((e) => e.alvos[0]);

const medicao = {
  paginas,
  porta_correccoes: { com: comPorta, sem: semPorta.length },
  primeira_pagina: { sem_selo: frontSemSelo.length, selo_para_outra_linha: frontSeloErrado.length },
  frases_de_moldura: {
    distintas: molduras.length,
    ocorrencias: totalOcorrencias,
    na_porta_de_correccoes: ocorrenciasDaPorta,
    sem_a_porta: totalOcorrencias - ocorrenciasDaPorta,
  },
  primeira_pagina_distintas: {
    sem_selo: new Set(frontSemSelo.map((x) => x.split(' ').pop())).size,
    selo_para_outra_linha: new Set(frontSeloErrado.map((x) => x.split(' ')[1])).size,
  },
  marcador_retirado: { ocorrencias: marcadorRetirado, paginas: paginasComMarcadorRetirado.size },
  linhas_com_page: comPage,
  linhas_com_recorte: comRecorte,
  localizadores_internos: localizadoresInternos.length,
  frases_de_cobertura: cobertura,
  frases_da_casa: {
    inventario: path.relative(RAIZ, INVENTARIO.ficheiro),
    inventario_existe: INVENTARIO.existe,
    entradas_declaradas: INVENTARIO.mapa.size,
    por_rota: frasesDaCasaPorRota,
  },
  voz: {
    ficheiro: FICHEIRO_DOS_MARCADORES,
    erros: VOZ.erros,
    marcadores: VOZ.marcadores.length,
    excecoes: VOZ.excecoes.length,
    excecoes_de_registo: VOZ.excecoes.filter((e) => e.tipo === 'registo').length,
    excecoes_por_usar: excecoesPorUsar,
    frases_varridas: frasesVarridas.size,
    ocorrencias_varridas: ocorrenciasVarridas,
    achados,
  },
};

if (process.argv.includes('--json')) {
  /* ESCRITO EM SÍNCRONO, E A RAZÃO ESTÁ MEDIDA (bloco dos 308, P2). Um
     `console.log` para um cano é assíncrono, e `process.exit()` a seguir corta o
     que ainda não saiu: com os 308 construídos a medição passou de dezenas de
     kB para centenas, e a matriz, que a lê por `execFileSync`, recebia-a cortada
     ao byte 65 534 — o tamanho do cano — e fechava com «Unterminated string in
     JSON». `fs.writeSync` escreve tudo antes de a linha seguinte correr. */
  fs.writeSync(
    1,
    JSON.stringify(
      {
        ...medicao,
        detalhe: {
          sem_porta: semPorta,
          front_sem_selo: frontSemSelo,
          front_selo_errado: frontSeloErrado,
          localizadores_internos: localizadoresInternos,
          molduras: molduras.map(([b, n]) => ({
            n,
            paginas: paginasPorBloco.get(b),
            texto: b.slice(0, 150),
          })),
        },
      },
      null,
      2,
    ) + '\n',
  );
  process.exit(0);
}

console.log('');
console.log(cinza(`  medição · ${paginas} páginas construídas (sem os documentos de estudo)`));
console.log('');
console.log(`  porta de correcções ....... ${comPorta}/${paginas} páginas` + (semPorta.length ? amarelo(`  (${semPorta.length} sem)`) : verde('  ✓')));
console.log(`  primeira página ........... ${frontSemSelo.length} valores sem selo · ${frontSeloErrado.length} selos para outra linha`);
console.log(
  `  primeira página (distintas) ${new Set(frontSemSelo.map((x) => x.split(' ').pop())).size} sem selo · ` +
    `${new Set(frontSeloErrado.map((x) => x.split(' ')[1])).size} para outra linha`,
);
console.log(
  `  frases de moldura ......... ${molduras.length} distintas · ${totalOcorrencias} ocorrências ` +
    `(${ocorrenciasDaPorta} são a porta de correcções; sem ela, ${totalOcorrencias - ocorrenciasDaPorta})`,
);
console.log(`  [descrição em preparação] . ${marcadorRetirado} ocorrências em ${paginasComMarcadorRetirado.size} páginas`);
console.log(`  linhas com #page= ......... ${comPage} de ${claims.size}`);
console.log(`  linhas com recorte ........ ${comRecorte} de ${claims.size}`);
console.log(`  localizadores internos .... ${localizadoresInternos.length}`);
console.log('');
const edicoesDeCobertura = Object.keys(cobertura);
if (!edicoesDeCobertura.length) {
  console.log(amarelo('  frases de cobertura ....... nenhuma marca data-cobertura no dist/'));
} else {
  for (const edicao of edicoesDeCobertura) {
    for (const [estado, c] of Object.entries(cobertura[edicao])) {
      const bom = c.distintas === 1;
      console.log(
        `  frases de cobertura · ${edicao} · ${estado} ... ${c.distintas} distinta(s) em ` +
          `${c.ocorrencias} ocorrência(s)` + (bom ? verde('  ✓') : amarelo('  ✗')),
      );
      if (!bom) for (const t of c.cadeias) console.log(cinza(`      · «${t}»`));
    }
  }
}
console.log('');
if (!INVENTARIO.existe) {
  console.log(amarelo(`  frases da casa ............ não há ${path.relative(RAIZ, INVENTARIO.ficheiro)}`));
} else {
  console.log(cinza(`  frases da casa · lista declarada com ${INVENTARIO.mapa.size} entrada(s)`));
  for (const [rota, r] of Object.entries(frasesDaCasaPorRota)) {
    const zero = r.por_classe.autorreferencia === 0;
    console.log(
      `  frases da casa · ${rota} ... ${r.distintas} distinta(s) · ` +
        `conteúdo ${r.por_classe.conteudo} · navegação ${r.por_classe.navegacao} · ` +
        `autorreferência ${r.por_classe.autorreferencia}` +
        (zero ? verde('  ✓') : amarelo('  ✗')),
    );
    if (r.nao_classificados.length) {
      console.log(amarelo(`      ${r.nao_classificados.length} bloco(s) por classificar:`));
      for (const t of r.nao_classificados) console.log(cinza(`      · «${t}»`));
    }
  }
}
console.log('');
if (VOZ.erros.length) {
  console.log(amarelo(`  tripwire da voz ........... ${VOZ.erros.length} erro(s) no ficheiro dos marcadores`));
  for (const e of VOZ.erros) console.log(cinza('      · ' + e));
} else {
  const zero = achados.length === 0;
  console.log(
    `  tripwire da voz ........... ${VOZ.marcadores.length} marcadores · ${VOZ.excecoes.length} exceções · ` +
      `${frasesVarridas.size} frases distintas (${ocorrenciasVarridas} ocorrências em ${Object.keys(frasesDaCasaPorRota).length} rotas) · ` +
      `${achados.length} achado(s)` + (zero ? verde('  ✓') : amarelo('  ✗')),
  );
  for (const a of achados) {
    console.log(amarelo(`      · [${a.marcadores.join(' · ')}] ${a.rota}${a.rotas > 1 ? ` (+${a.rotas - 1} rotas)` : ''}`));
    console.log(cinza(`        «${a.texto.slice(0, 160)}»`));
  }
  if (excecoesPorUsar.length) {
    console.log(cinza(`      ${excecoesPorUsar.length} exceção(ões) por exercer:`));
    for (const e of excecoesPorUsar) console.log(cinza(`        · «${e.slice(0, 100)}»`));
  }
}
console.log('');
if (semPorta.length) {
  console.log(cinza('  páginas sem porta de correcções (primeiras 10):'));
  for (const p of semPorta.slice(0, 10)) console.log(cinza('    · ' + p));
  console.log('');
}
