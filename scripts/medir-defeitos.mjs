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
 *      inventariada que são prosa da casa, mais a DESCRIÇÃO do seu `<head>`, as
 *      DICAS (`title`) e os RÓTULOS DE ACESSIBILIDADE (`aria-label`) dela, e o
 *      NOME e o NOME CURTO da aplicação de ecrã principal que ela oferece,
 *      classificados em conteúdo, navegação e autorreferência pela lista
 *      declarada em `design/especime-v3/INVENTARIO-FRASES.md` (Emenda 15).
 *   9. o tripwire da voz · os mesmos blocos, passados pela lista fechada de
 *      marcadores de `design/especime-v3/VOZ-MARCADORES.md`, DECLARADOS OU NÃO.
 *      A medida 8 acredita em quem escreveu a frase; esta não.
 *  10. o estado de cada declaração · cada linha do inventário diz-se `viva` (e
 *      então tem de se render nalguma rota) ou `retirada` (e então não pode
 *      render-se em nenhuma). Mede-se contra a união das duas varreduras.
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
/* Os dois ficheiros de dados que podem sustentar um `data-nome`. A régua lê-os
   para conferir que o texto marcado é o que eles publicam: ver a razão escrita
   ao lado de `NOME_DECLARADO`. */
import { AREAS } from '../src/data/areas.mjs';
import { REGIOES } from '../src/data/regioes.mjs';
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
 * ---------------------------------------------------------------------------
 * OS RÓTULOS QUE VIVEM NUM `<span>`, E A RÉGUA PASSOU A VÊ-LOS (29.08.2026)
 * ---------------------------------------------------------------------------
 * A definição de bloco acima é uma lista de etiquetas, e um `<span>` não está
 * nela. Isso é o certo para prosa corrida: um `<span>` dentro de um parágrafo é
 * um pedaço da frase, não uma frase. **Mas o rótulo da cabeça de dezasseis
 * vistas do sítio é um `<span>` sozinho ao lado do `<h1>`**, e ali ele é um
 * bloco no ecrã e um bloco na leitura: `.eyebrow` é `display: block` com
 * `margin: 0`. O elemento à volta dos dois é um `<div>`, que também não está na
 * lista, e por isso a cadeia passava por baixo da régua sem ninguém a ver.
 *
 * A MEDIÇÃO CEGA DE 28.08.2026 É QUE O ENCONTROU, nas páginas das áreas: vinte
 * rendições de «Áreas de governo» e «Government areas» sem uma linha no
 * inventário. A prova de que a causa é a etiqueta e não outra coisa está no
 * próprio inventário: «Relance» e «At a glance» são o mesmo rótulo, com a mesma
 * classe, escritos num `<h2>`, e estão declarados desde sempre.
 *
 * DUAS SAÍDAS, E ESTA É A QUE MANTÉM A RÉGUA VERDADEIRA. A outra era pôr o
 * rótulo de cada vista num `<p>`, e foi o que o bloco das áreas fez nas suas
 * duas. Corrige as páginas de hoje e **não corrige a régua**: o próximo rótulo
 * que alguém escreva num `<span>` volta a passar por baixo dela, e a regra «cada
 * frase da casa está declarada» fica com uma exceção por escrever. O caso
 * plantado do brief pede o contrário: um rótulo em `<span>` não inventariado tem
 * de ser visto VERMELHO, e só a régua pode fazer isso.
 *
 * A LISTA É DE CLASSES DECLARADAS, E NÃO DE `<span>` A ESMO. Medir todos os
 * `<span>` do sítio partia cada frase composta em pedaços e enchia o inventário
 * com metades de frases. O que entra é o `<span>` que a casa declarou como
 * rótulo pela classe, e a classe está aqui, nomeada, com a razão.
 *
 * E A RÉGUA PROVA, EM CADA CONSTRUÇÃO, QUE AINDA VÊ. Uma lista de classes é uma
 * dependência de uma folha de estilos, e uma folha de estilos muda: renomear
 * `.eyebrow` deixava esta régua cega em silêncio, que é o defeito que ela existe
 * para fechar. Por isso conta as ocorrências de cada classe declarada em `dist/`
 * e escreve-as na medição; `check-voz.mjs` fecha a construção quando uma delas
 * for a zero. É o positivo conhecido da regra 14, corrido a cada construção em
 * vez de uma vez.
 *
 * SÓ AS MEDIDAS 8 E 9 A USAM. A medida 3 («frases de moldura») é uma linha de
 * base comparada entre construções desde a etapa 0, e mudar-lhe a definição
 * mudava um número que não é deste assunto. É a mesma razão por que
 * `COBERTURA_DECLARADA` ficou de fora de `ORIGEM_DECLARADA`.
 */
const CLASSES_DE_ROTULO = [
  /* `.eyebrow` · o antetítulo da cabeça de uma página: «Município», «Livro-razão»,
     «Distritos e ilhas». Nomeia o que a página é, e o leitor lê-o antes do
     título. */
  'eyebrow',
];
const ROTULOS_EM_SPAN = CLASSES_DE_ROTULO.map((c) => `span.${c}`).join(',');
const BLOCOS_DA_VOZ = `${BLOCOS},${ROTULOS_EM_SPAN}`;
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
/* O POSITIVO CONHECIDO DA LISTA DAS CLASSES DE RÓTULO, contado em `dist/`. Ver a
   razão escrita ao lado de `CLASSES_DE_ROTULO`: uma classe que deixe de existir
   deixa esta régua cega, e um zero aqui fecha a construção em `check-voz.mjs`. */
const rotulosEmSpan = Object.fromEntries(CLASSES_DE_ROTULO.map((c) => [c, 0]));

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
/* A quarta classe entra na segunda passagem de 01.09.2026, e a razão está
   escrita em `scripts/voz.mjs`: uma divulgação obrigatória não é nem conteúdo,
   nem navegação, nem a casa a falar de si. `autorreferencia` continua a ir a
   zero. */
const CLASSES = ['conteudo', 'navegacao', 'autorreferencia', 'divulgacao'];

/**
 * AS ROTAS QUE SÓ PROVAM QUE UMA LINHA SE RENDE (segunda passagem, 01.09.2026).
 *
 * A Emenda 15 isenta o Método e o Sobre da CONTAGEM, e por isso eles não estão
 * em `ROTAS_DO_INVENTARIO`: são a casa do método, e ali a autorreferência é o
 * objecto da página. Mas a régua usava a mesma lista para responder a duas
 * perguntas diferentes, e a segunda não é a mesma: «esta linha declarada ainda
 * se rende em algum lado?» A frase da política e a secção da política vivem no
 * Sobre e no Método e em mais lado nenhum, e sem esta lista uma linha declarada
 * para elas era logo uma «viva que não rende» e fechava a construção.
 *
 * O que estas duas rotas dão é só isso: entram no conjunto que prova que uma
 * linha viva se rende. **Não entram na contagem por classe, não entram nos
 * blocos por classificar, e não entram na proibição das linhas retiradas**: uma
 * frase retirada de uma página do leitor continua a poder ser citada no Método,
 * que é onde o método se explica, e alargar-lhe a proibição mudava uma regra que
 * ninguém mandou mudar.
 */
const ROTAS_QUE_PROVAM_A_RENDICAO = new Set(['sobre', 'metodo']);
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
  /* O ÍNDICE DAS 29 UNIDADES E A PÁGINA DE CADA UMA (Emenda 20, 27.08.2026).
     Entram no commit em que são construídas, que é a regra desta lista. São
     páginas do leitor como o índice dos concelhos e a página de um concelho: a
     Emenda 15 governa-as, e a sua autorreferência vai a zero. O `<h1>` de uma
     unidade é o nome que a Carta lhe dá (declarado `data-lugar`) e a sua
     descrição é composta com esse nome, como a da página do concelho, e por isso
     conta-se uma vez e não 29. */
  'distritos',
  'distrito',
  /* O ÍNDICE DAS REGIÕES E A PÁGINA DE CADA UMA (Emenda 21, 27.08.2026).
     Entram no commit em que são construídas, que é a regra desta lista. São
     páginas do leitor como o índice dos distritos e a página de uma unidade: a
     Emenda 15 governa-as, e a sua autorreferência vai a zero. O `<h1>` de uma
     região é o nome dela (declarado `data-lugar`) e a sua descrição é composta
     com esse nome, e por isso conta-se uma vez e não uma por região. */
  'regioes',
  'regiao',
  /* O ÍNDICE DAS ÁREAS DE GOVERNO E A PÁGINA DE CADA UMA (decisão 6 da auditoria
     de 25.08.2026). Entram no commit em que são construídas, que é a regra desta
     lista. São páginas do leitor como o índice das regiões e a página de uma
     região: a Emenda 15 governa-as, e a sua autorreferência vai a zero. */
  'areas',
  'area',
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

/**
 * ---------------------------------------------------------------------------
 * O NOME DE UMA COISA DE UM FICHEIRO DE DADOS TAMBÉM NÃO É UMA FRASE DA CASA
 * ---------------------------------------------------------------------------
 * `data-nome` é a marca IRMÃ de `data-lugar`, e entra a 29.08.2026 com a dívida
 * de forma que o bloco das áreas de governo nomeou duas vezes sem a pagar.
 *
 * O PROBLEMA, MEDIDO. O nome de cada área de governo custava duas linhas do
 * inventário (uma por edição) e a descrição do `<head>` composta com ele custava
 * outras duas. Com quatro áreas eram dezasseis linhas; com nove, trinta e seis;
 * com as dezasseis do Governo seriam sessenta e quatro. Isso não é um inventário
 * das frases da casa: é a lista dos ministérios escrita outra vez dentro dele.
 * `data-lugar` não servia, e por uma razão que está escrita na marca: uma área de
 * governo não é um lugar.
 *
 * O QUE ESTA MARCA DIZ. «Este texto é o nome de uma coisa de um ficheiro de
 * dados, e não prosa que a casa escreveu.» O valor do atributo nomeia o FICHEIRO
 * de onde o nome vem, e é isso que a torna conferível.
 *
 * A REGRA, E É ESTREITA DE PROPÓSITO. Só um nome que venha de um ficheiro de
 * dados com fonte declarada a pode levar. Hoje são dois, e cada um traz a sua
 * fonte escrita: `src/data/areas.mjs` (as páginas do Governo, no campo
 * `FONTE_DOS_NOMES`, com a data em que foram lidas) e `src/data/regioes.mjs` (a
 * classificação NUTS 2024, com o código de cada região ao lado do nome). Um
 * `data-nome` com outro valor fecha a construção, e um `data-nome` cujo texto não
 * seja, carácter a carácter, um nome daquele ficheiro fecha a construção
 * também. **É a diferença entre esta marca e a dos lugares**: `data-lugar`
 * exclui e não confere, e por isso um erro de digitação num nome sai do
 * inventário sem que ninguém o veja. Aqui não sai.
 *
 * A DESCRIÇÃO DO `<head>` LEVA A MESMA SUBSTITUIÇÃO que a dos lugares, e pela
 * mesma razão: uma descrição composta com o nome conta-se uma vez, com `<nome>`
 * no lugar dele, e não uma por área.
 *
 * O QUE ESTA MARCA NÃO É. Não é uma dispensa da declaração para tudo o que um
 * ficheiro de dados guarda: marca o NOME de uma entrada, e nada mais. Uma frase
 * que a casa escreveu sobre uma área continua a ser prosa da casa, viva no
 * ficheiro de dados ou não.
 *
 * AS REGIÕES CONTINUAM EM `data-lugar`, e não é um descuido: uma região NUTS II
 * é um lugar, a descrição da página de cada uma já se conta com `<lugar>` lá
 * dentro, e trocar a marca mudava o texto de quatro linhas do inventário sem
 * mudar o que elas dizem. O ficheiro fica na lista das fontes desta marca porque
 * a regra é sobre que ficheiros a podem sustentar, e a medição diz quantas vezes
 * cada fonte se exerce, para que uma fonte por exercer não fique em silêncio.
 */
const NOME_DECLARADO = '[data-nome]';
/** As fontes que podem sustentar um `data-nome`, e os nomes que cada uma publica. */
const NOMES_POR_FONTE = {
  areas: new Set(AREAS.flatMap((a) => Object.values(a.nome ?? {}))),
  regioes: new Set(REGIOES.flatMap((r) => Object.values(r.nome ?? {}))),
};
/* A CONFERÊNCIA DE `data-nome`, e é o que distingue esta marca da dos lugares.
   Cada elemento marcado diz de que ficheiro vem o nome, e a régua confere que o
   texto rendido é, carácter a carácter, um nome daquele ficheiro. Os achados
   fecham a construção em `check-voz.mjs`; a contagem por fonte sai na medição
   para que uma fonte declarada e nunca exercida não fique em silêncio. */
const nomesPorFonte = Object.fromEntries(Object.keys(NOMES_POR_FONTE).map((f) => [f, 0]));
const nomesForaDaFonte = [];

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
    ORIGEM_DECLARADA +
    ',' +
    MEDIDA_DECLARADA +
    ',' +
    COBERTURA_DECLARADA +
    ',' +
    LUGAR_DECLARADO +
    ',' +
    NOME_DECLARADO;
  const marcados = new Set();
  for (const el of root.querySelectorAll(DECLARADO)) marcados.add(el);
  for (const el of root.querySelectorAll(BLOCOS_DA_VOZ)) {
    if (el.querySelector(BLOCOS_DA_VOZ)) continue;
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
    ORIGEM_DECLARADA +
    ',' +
    MEDIDA_DECLARADA +
    ',' +
    COBERTURA_DECLARADA +
    ',' +
    LUGAR_DECLARADO +
    ',' +
    NOME_DECLARADO;
  for (const el of root.querySelectorAll(DECLARADO)) {
    marcados.add(el);
    for (const d of el.querySelectorAll('*')) marcados.add(d);
  }
  for (const el of root.querySelectorAll(BLOCOS_DA_VOZ)) {
    if (el.querySelector(BLOCOS_DA_VOZ)) continue;
    if (marcados.has(el)) continue;
    if (el.querySelector(DECLARADO)) continue;
    const t = norm(texto(el));
    if (!t) continue;
    /* --------------------------------------------------------------------
       O `<summary>` ENTRA (01.09.2026)
       --------------------------------------------------------------------
       Estava escrito aqui «uma ligação inteira não é uma frase: é um destino»,
       e a linha a seguir saltava TODOS os `<summary>` sem condição. As duas
       coisas não são a mesma: o comentário fala do texto que fica fora das
       âncoras, e isso é a regra que vem logo a seguir e vale para todos os
       blocos; o salto do `<summary>` era mais largo do que a sua razão.

       O QUE ELE DEIXAVA PASSAR. Um `<summary>` é texto à vista, escrito pela
       casa, e é a palavra que o leitor lê antes de decidir se abre. Nenhum
       estava neste inventário: nem o «abrir/fechar» de cada peça, nem a porta
       da régua da convergência, nem — desde o bloco da cabeça nova, 01.09.2026 —
       os nomes das duas gavetas do mapa. O bloco da cabeça encontrou o buraco e
       este commit fecha-o, com as cadeias que ele revela classificadas.

       O «Menu» do cabeçalho já estava declarado, mas pelo `aria-label` e não
       pelo texto: as dicas e os rótulos de acessibilidade entram desde a I79.
       Passa a estar pelas duas superfícies, que é o que ele é.

       A REGRA QUE FICA vale para o `<summary>` como para qualquer outro bloco:
       o que se recolhe é o texto de fora das âncoras e dos botões. Um `<summary>`
       cujo conteúdo seja só uma ligação continua a não ser uma frase. */
    /* O texto que fica FORA das âncoras e dos botões, percorrendo a árvore. Uma
       subtração de cadeias não serve: dois destinos seguidos dão «a →b →» de um
       lado e «a → b →» do outro, e o bloco escapava por um espaço. */
    const foraDeLigacoes = norm(textoForaDeComandos(el));
    if (!foraDeLigacoes) continue;
    out.push(t);
  }
  return out;
}

/**
 * ---------------------------------------------------------------------------
 * AS DICAS E OS RÓTULOS DE ACESSIBILIDADE SÃO TEXTO DO LEITOR (I79, 27.08.2026)
 * ---------------------------------------------------------------------------
 * A régua lia os blocos de texto e a descrição do `<head>`, e não lia os
 * atributos. Um `title` é o que o navegador mostra quando o cursor pára em cima
 * de um número, e um `aria-label` é o nome por que um leitor de ecrã chama um
 * instrumento: as duas coisas são superfície pública, escritas pela casa, e a
 * Emenda 15 não conhece a diferença entre uma frase no corpo e uma frase num
 * atributo.
 *
 * O CASO QUE ABRIU A ISSUE. Cinco das dicas dos valores da prova diziam a
 * maquinaria em vez da coisa, e a mais clara era «itens da agenda atravessados
 * do motor». Foram corrigidas a 27.08 na mão, e a régua não as via: replantar
 * aquela dica não ficava vermelho em lado nenhum. Passa a ficar, pelo nome e
 * pelo marcador «atravess».
 *
 * AS DICAS ENTRAM PELAS DUAS MEDIDAS, e a razão é a mesma que vale para o corpo:
 * a medida 8 exige que cada uma esteja declarada e classificada, e a medida 9
 * passa-lhe os marcadores por cima, declarada ou não.
 *
 * UM ATRIBUTO NUM BLOCO COM ORIGEM DECLARADA CONTA. A medida 8 deixa cair um
 * bloco inteiro que contenha um `data-claim` ou um `data-prova`, e está certa
 * para o texto: aquele bloco é o livro-razão a falar. O `title` do mesmo
 * elemento não é: o número vem do livro-razão e a frase que o nomeia é da casa.
 * É exactamente o caso das dicas da prova, que vivem em `<span data-prova>`.
 */
/**
 * UMA NORMALIZAÇÃO, E É A MESMA REGRA DO `<lugar>` DA DESCRIÇÃO.
 *
 * **Uma dica que repete um `data-*` do próprio elemento não é uma frase nova.**
 * O selo de uma linha leva `data-selo-etiqueta="calculado · Évora —
 * Prometido, Pago, Auditado 2026"` e o mesmo texto no `title`: o que ali está é
 * o estado da linha e o NOME DO TRABALHO que a publica, composto pelo
 * livro-razão. Declarar as trinta seria pôr o arquivo dentro do inventário, e o
 * inventário passava a crescer com o livro-razão.
 *
 * ERAM DUAS ATÉ 28.08.2026, E A SEGUNDA SAIU COM A I83. Ela tirava da dica o
 * identificador que o próprio elemento aponta e deixava `<linha>` no lugar
 * dele: as portas das figuras de uma página de leitura levavam
 * `href="#linha-tc-year-1-2008"` e `aria-label="linha do motor:
 * tc-year-1-2008"`, e sem ela o inventário ganhava uma linha por figura de cada
 * documento. As 34 cadeias eram um efeito do rótulo, e o rótulo mudou: a porta
 * chama-se «a linha desta figura», a chave ficou só no `href`, e não há
 * identificador nenhum para normalizar. Uma normalização sem matéria é uma
 * peneira que só pode esconder o que ainda não existe, e por isso sai com o que
 * a fez nascer. Uma dica composta com um identificador que volte volta ao
 * inventário como bloco POR CLASSIFICAR, que é o portão que a apanha.
 *
 * O QUE ISTO NÃO FAZ é dispensar a dica de um elemento com origem declarada. A
 * dica de um valor da prova vive num `<span data-prova>` e é prosa da casa a
 * nomear o que se conta: é ela que a I79 existe para apanhar.
 */
const DICAS = ['title', 'aria-label'];
function dicasDaCasa(root) {
  const out = [];
  for (const el of root.querySelectorAll('[title],[aria-label]')) {
    const dados = Object.entries(el.attributes ?? {})
      .filter(([k]) => k.startsWith('data-'))
      .map(([, v]) => norm(v));
    for (const at of DICAS) {
      const v = norm(el.getAttribute(at) ?? '');
      if (!v) continue;
      if (dados.includes(v)) continue;
      out.push(v);
    }
  }
  return out;
}

/**
 * ---------------------------------------------------------------------------
 * AS FRASES DA APLICAÇÃO DE ECRÃ PRINCIPAL (28.08.2026, `BRIEF-app.md` §5)
 * ---------------------------------------------------------------------------
 * O sítio ganhou uma superfície pública nova, e ela tem duas frases da casa: o
 * NOME e o NOME CURTO da aplicação. Aparecem por baixo do ícone no ecrã
 * principal de um telemóvel e na lista de aplicações instaladas, que é um sítio
 * onde o leitor as lê sem estar no sítio.
 *
 * ENTRAM NESTA MEDIDA PELA MESMA RAZÃO DA DESCRIÇÃO DO `<head>`, e é a razão
 * escrita lá em cima: são superfície pública, são escritas pela casa, e ficavam
 * de fora só porque esta varredura era sobre o `<body>`. Se ficassem de fora, o
 * BRIEF pedia frases «classificadas» e o inventário teria duas linhas que
 * nenhuma régua alcança — ou seja, duas declarações que ninguém confere, que é
 * a coisa que a I74 fechou.
 *
 * A SUPERFÍCIE É A DA EDIÇÃO DA PÁGINA. O nome curto vem da etiqueta
 * `apple-mobile-web-app-title` daquela página, e o nome do MANIFESTO que aquela
 * página liga: é o par que o telemóvel vai mostrar a quem instalar a partir
 * dali, e é o que se quer medir. Ler os manifestos por conta própria mediria os
 * ficheiros; ler o que a página liga mede o sítio.
 */
const MANIFESTOS_LIDOS = new Map();
function frasesDaAplicacao(root) {
  const out = [];
  const curto = norm(root.querySelector('head meta[name="apple-mobile-web-app-title"]')?.getAttribute('content') ?? '');
  if (curto) out.push(curto);
  const href = root.querySelector('head link[rel="manifest"]')?.getAttribute('href') ?? '';
  if (!href.startsWith('/')) return out;
  if (!MANIFESTOS_LIDOS.has(href)) {
    let doc = null;
    try {
      doc = JSON.parse(fs.readFileSync(path.join(DIST, href.replace(/^\//, '')), 'utf8'));
    } catch {
      doc = null;
    }
    MANIFESTOS_LIDOS.set(href, doc);
  }
  const doc = MANIFESTOS_LIDOS.get(href);
  for (const campo of ['name', 'short_name']) {
    const v = norm(doc?.[campo] ?? '');
    if (v && !out.includes(v)) out.push(v);
  }
  return out;
}

const frasesPorRota = new Map(); // rota → Map(texto → ocorrências)
const frasesDaVozPorRota = new Map(); // rota → Set(texto), a varredura do tripwire
/* A CHAVE DA ROTA DE CADA CAMINHO, para as dispensas com rotas (X3). Uma família
   de páginas tem uma chave e seiscentos caminhos, e é pela chave que uma
   dispensa se escreve. */
const chaveDaRotaPorCaminho = new Map(); // caminho → chave da rota
/** As frases das rotas isentas da contagem: só provam que uma linha se rende. */
const rendidasNasIsentas = new Set();

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

  /* 8 — as frases da casa, nas rotas inventariadas: o corpo, a descrição e as
     dicas (I79) */
  if (rota && ROTAS_DO_INVENTARIO.has(rota.key)) {
    const chave = caminho || '/';
    const conta = frasesPorRota.get(chave) ?? new Map();
    for (const f of frasesDaCasa(root)) conta.set(f, (conta.get(f) ?? 0) + 1);
    for (const f of dicasDaCasa(root)) conta.set(f, (conta.get(f) ?? 0) + 1);
    const daAplicacao = frasesDaAplicacao(root);
    for (const f of daAplicacao) conta.set(f, (conta.get(f) ?? 0) + 1);
    let descricao = norm(
      root.querySelector('head meta[name="description"]')?.getAttribute('content') ?? '',
    );
    /* O nome do lugar sai da descrição e deixa no seu lugar a marca: uma frase
       composta conta-se uma vez, e não uma por concelho. */
    for (const el of root.querySelectorAll(LUGAR_DECLARADO)) {
      const nome = norm(texto(el));
      if (nome) descricao = norm(descricao.split(nome).join('<lugar>'));
    }
    /* E o nome de uma coisa de um ficheiro de dados sai da descrição pela mesma
       regra, com a marca `<nome>` no lugar dele: a descrição de uma página de
       área é o nome da área, e conta-se uma vez e não uma por área. */
    for (const el of root.querySelectorAll(NOME_DECLARADO)) {
      const nome = norm(texto(el));
      if (nome) descricao = norm(descricao.split(nome).join('<nome>'));
    }
    if (descricao) conta.set(descricao, (conta.get(descricao) ?? 0) + 1);
    frasesPorRota.set(chave, conta);
    const daVoz = frasesDaVozPorRota.get(chave) ?? new Set();
    for (const f of frasesDaVoz(root)) daVoz.add(f);
    for (const f of dicasDaCasa(root)) daVoz.add(f);
    for (const f of daAplicacao) daVoz.add(f);
    if (descricao) daVoz.add(descricao);
    frasesDaVozPorRota.set(chave, daVoz);
    chaveDaRotaPorCaminho.set(chave, rota.key);
  }

  /* As rotas isentas da contagem, que só provam que uma linha se rende. */
  if (rota && ROTAS_QUE_PROVAM_A_RENDICAO.has(rota.key)) {
    for (const f of frasesDaCasa(root)) rendidasNasIsentas.add(f);
    for (const f of frasesDaVoz(root)) rendidasNasIsentas.add(f);
    for (const f of dicasDaCasa(root)) rendidasNasIsentas.add(f);
  }

  /* O positivo conhecido das classes de rótulo, em TODAS as páginas e não só nas
     rotas inventariadas: a pergunta é «esta classe ainda existe no sítio?», e
     não «esta classe existe onde eu meço». */
  for (const c of CLASSES_DE_ROTULO) {
    rotulosEmSpan[c] += root.querySelectorAll(`span.${c}`).length;
  }

  /* E `data-nome` confere-se em TODAS as páginas, pela mesma razão: uma marca que
     dispensa um texto do inventário tem de ser verdadeira onde quer que esteja, e
     não só onde a contagem do inventário passa. */
  for (const el of root.querySelectorAll(NOME_DECLARADO)) {
    const fonte = el.getAttribute('data-nome') ?? '';
    const t = norm(texto(el));
    if (!Object.prototype.hasOwnProperty.call(NOMES_POR_FONTE, fonte)) {
      nomesForaDaFonte.push({
        caminho: caminho || '/',
        fonte: fonte || '(vazio)',
        texto: t,
        porque: 'a fonte não é um dos ficheiros de dados que podem sustentar esta marca',
      });
      continue;
    }
    nomesPorFonte[fonte] += 1;
    if (!NOMES_POR_FONTE[fonte].has(t)) {
      nomesForaDaFonte.push({
        caminho: caminho || '/',
        fonte,
        texto: t,
        porque: `o texto marcado não é um nome de src/data/${fonte}.mjs`,
      });
    }
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
    const mordeu = analisa(t, rota, VOZ, chaveDaRotaPorCaminho.get(rota) ?? null);
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

/* =============================================================================
 * 10 · O ESTADO DE CADA DECLARAÇÃO (I74, 27.08.2026)
 * =============================================================================
 * O inventário tinha 58 linhas que já não se rendiam em página nenhuma, e nada o
 * impedia: uma frase corrigida saía das páginas e a sua declaração ficava, pelo
 * que repô-la passava em silêncio. Cada linha declara agora o seu estado, e esta
 * medida confere os dois sentidos:
 *
 *   · uma linha `viva` que não se rende em rota nenhuma: ou a frase mudou e a
 *     linha ficou para trás, ou a rota saiu; nos dois casos a lista está a
 *     mentir sobre o sítio;
 *   · uma linha `retirada` que se rende, que é a frase que a casa tirou a voltar.
 *
 * O QUE CONTA COMO «RENDER-SE» É A UNIÃO DAS DUAS VARREDURAS, a da medida 8 (os
 * blocos de texto da casa) e a da medida 9 (o texto fora das origens
 * declaradas). Não é a mesma coisa e a diferença importa: uma frase reposta ao
 * lado de um número vive num bloco com origem declarada, que a medida 8 deixa
 * cair inteiro, e só a varredura da voz a vê. Para uma proibição, a peneira mais
 * larga é a certa.
 */
const rendidas = new Set();
for (const conta of frasesPorRota.values()) for (const t of conta.keys()) rendidas.add(t);
for (const frases of frasesDaVozPorRota.values()) for (const t of frases) rendidas.add(t);

/**
 * UMA SENTINELA APANHA A FRASE DENTRO DE OUTRA FRASE (X1 da leitura do Codex).
 *
 * A primeira forma desta medida comparava cadeias inteiras, e uma frase retirada
 * voltava à mesma desde que viesse acompanhada. Foi o que a leitura de fora
 * achou: «Com página» saiu da página dos 308 e continuava viva dentro da dica
 * «concelhos com página», que a varredura das dicas (I79) acabara de recolher. A
 * cadeia estava lá inteira, e a régua não a via porque olhava para o igual.
 *
 * A procura é por PALAVRA INTEIRA e sem sensibilidade a maiúsculas, que é o modo
 * dos marcadores da voz e pela mesma razão: «Com página» tem de morder «concelhos
 * com página» e não pode morder uma palavra que apenas a contenha por dentro. É a
 * mesma expressão do modo `palavra` de `voz.mjs`, com a frase inteira no lugar do
 * marcador.
 */
const escapaParaRe = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function ondeVolta(frase) {
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapaParaRe(frase)}(?![\\p{L}\\p{N}])`, 'iu');
  for (const t of rendidas) if (re.test(t)) return t;
  return null;
}

const declaracoes = {
  total: INVENTARIO.linhas.length,
  vivas: INVENTARIO.linhas.filter((l) => l.estado === 'viva').length,
  retiradas: INVENTARIO.linhas.filter((l) => l.estado === 'retirada').length,
  rendidas: rendidas.size,
  sem_estado: INVENTARIO.linhas
    .filter((l) => !l.estado)
    .map((l) => ({ n: l.n, estado: l.cru4, texto: l.texto })),
  retiradas_sem_razao: INVENTARIO.linhas
    .filter((l) => l.estado === 'retirada' && !l.razao)
    .map((l) => ({ n: l.n, texto: l.texto })),
  /* A pergunta é «esta linha rende-se?», e quem responde «não tem de se render»
     é só o estado `retirada`. Uma linha sem estado nenhum entra aqui e sai
     também em `sem_estado`: as duas coisas estão erradas, e as duas dizem-se. */
  rendidas_nas_isentas: rendidasNasIsentas.size,
  /* A peneira desta pergunta é a mais larga das duas, e inclui as rotas isentas
     da contagem (o Método e o Sobre): uma linha declarada para uma frase que só
     lá vive rende-se, e a lista não está a mentir sobre o sítio. */
  vivas_que_nao_rendem: INVENTARIO.linhas
    .filter((l) => l.estado !== 'retirada' && !rendidas.has(l.texto) && !rendidasNasIsentas.has(l.texto))
    .map((l) => ({ n: l.n, classe: l.classe, bloco: l.bloco, texto: l.texto })),
  retiradas_que_rendem: INVENTARIO.linhas
    .filter((l) => l.estado === 'retirada')
    .map((l) => ({ l, onde: ondeVolta(l.texto) }))
    .filter((x) => x.onde)
    .map(({ l, onde }) => ({
      n: l.n,
      bloco: l.bloco,
      razao: l.razao,
      texto: l.texto,
      dentro: onde === l.texto ? null : onde,
    })),
};

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
    declaracoes,
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
    rotulos_em_span: rotulosEmSpan,
    nomes_declarados: { por_fonte: nomesPorFonte, fora_da_fonte: nomesForaDaFonte },
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
        `divulgação ${r.por_classe.divulgacao} · ` +
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
