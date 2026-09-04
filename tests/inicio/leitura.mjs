#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DA LEITURA BREVE · o bloco F1.1b, 04.09.2026
 * =============================================================================
 *
 * «A leitura breve no cartão, e o que vem a seguir ao mapa.» Uma célula por
 * medida de aceitação do §4 do brief que seja DESTE bloco, em Chromium e em
 * WebKit sem cabeça, sobre `dist/`. NÃO é um portão: não entra no `npm run
 * build` nem no `verify`, e sai com 0 quando todas passam e com 1 quando alguma
 * falha, como as outras réguas de `tests/inicio`.
 *
 *   node tests/inicio/leitura.mjs
 *   node tests/inicio/leitura.mjs --json <ficheiro>
 *   node tests/inicio/leitura.mjs --vermelhos
 *   OEDP_DIST=<outra construção> node tests/inicio/leitura.mjs
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTA RÉGUA MEDE, E O QUE MEDEM AS OUTRAS
 * ---------------------------------------------------------------------------
 * O brief numera onze medidas, e três delas já têm régua. Duplicá-las aqui era
 * escrever uma segunda definição da mesma coisa, e duas definições divergem:
 *
 *   J2 (os 21 valores uma só vez, e a Comissão em cada frase de contexto)
 *      → `tests/inicio/porta.mjs`, células A3 e A4;
 *   J8 (os estudos a ≤ 1 toque e ≤ 1,5 ecrãs)
 *      → `tests/inicio/porta.mjs`, célula A15;
 *   J9 (o inventário das classes de algarismos, antes e depois)
 *      → `tests/inicio/numeros-novos.mjs`, e a comparação é do relatório, que é
 *        onde ela tem os dois lados;
 *   J10 (os três comandos a 0) → `npm run build`, `verify` e `typecheck`.
 *
 * O que fica aqui são as seis que nasceram com este bloco.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * J1 · OS 21 NOMES EM EXACTAMENTE DOIS LUGARES, CONTADOS POR ID. O nome de cada
 * medida aparece no cartão da faixa e no `<summary>` da sua leitura, e em mais
 * lado nenhum de `/`. A contagem é POR ID e não pelo texto, e a diferença é
 * medida: duas medidas dos dois quadros chamam-se «Taxa de desemprego» (a do
 * Procedimento e a do Painel Social), e uma contagem por texto dava quatro onde
 * há dois e dois. O que se conta são os elementos `[data-medida-nome]`, que é a
 * marca da origem declarada de um nome de medida, e pergunta-se a cada um a que
 * medida pertence pelo `[data-cartao]` ou pelo `[data-leitura]` que o contém.
 *
 * A célula exige ainda que os dois lugares sejam OS DOIS CERTOS — um dentro de um
 * cartão da faixa DA CABEÇA, outro dentro de um `<summary>` — e que não sobre
 * nenhum `[data-medida-nome]` na página fora de um cartão ou de um `<summary>`.
 * Duas contagens certas com os nomes nos sítios errados passavam numa soma.
 *
 * A FAIXA DO DOMÍNIO TAMBÉM TEM NOMES, e são legítimos: são as medidas de cabeça
 * daquele domínio, que não são nenhuma das 21 e cuja leitura vive na página do
 * domínio. O que a célula recusa é uma das 21 num cartão que não seja o da faixa
 * da cabeça, e é essa metade que recusa a forma de cinco cartões que o §1, item 5
 * do brief escolhia: três das cinco são medidas desta página.
 *
 * O «HOJE» MEDIDO, e não o que o brief supunha: na árvore de partida (`1dbd1cef`)
 * cada nome aparecia DUAS vezes, não três — no cartão e na peça do painel (ou na
 * linha da lista social). O brief escreve «antes: cartão, painel e leitura,
 * três», e isso está errado por uma: a peça e a leitura eram a mesma coisa. O
 * que este bloco muda não é o NÚMERO de lugares, é QUAL é o segundo: um
 * `<summary>` de uma linha em vez de um painel inteiro. O número está no
 * relatório com o comando que o mediu.
 *
 * J3 · SEM GUIÃO: AS 21 LEITURAS PRESENTES, FECHADAS, COM `id`, E O FRAGMENTO A
 * ABRIR A CERTA. A página carrega-se com o JavaScript DESLIGADO em Chromium e em
 * WebKit; contam-se os `<details data-leitura>`, exige-se que nenhum venha
 * aberto e que cada um tenha o `id` da sua medida. Depois pede-se `/#m-<id>` de
 * uma delas e pergunta-se ao motor se aquele `<details>` está aberto.
 *
 * DOIS MOTORES E DUAS EDIÇÕES, e a segunda metade é da segunda passagem
 * (04.09.2026, Major 7 da leitura a frio): a primeira redação corria só em
 * português com a razão escrita, e uma leitura inglesa sem `id` não caía em
 * célula nenhuma. Uma razão escrita não substitui uma medição.
 *
 * DOIS MOTORES PORQUE A RESPOSTA PODE DIFERIR: abrir o `<details>` alvo de um
 * fragmento é comportamento do navegador, e a célula regista o que cada um faz
 * em vez de o presumir. O que ela EXIGE sem guião é a metade que não depende do
 * motor — as 21 lá, fechadas, com `id`, e a âncora a existir —, e o que ela
 * REGISTA é a abertura pelo fragmento, motor a motor, para o relatório. Onde o
 * motor não abrir, o `<summary>` está a um toque, que é o que o brief escreve.
 *
 * E EXIGE, COM GUIÃO E NOS DOIS MOTORES, que o mesmo endereço abra a leitura
 * certa e só essa: é a promessa que `public/js/inicio.js` cumpre à chegada, e
 * uma promessa que só um motor cumprisse não era uma promessa.
 *
 * J4 · COM GUIÃO: UM TOQUE NUM CARTÃO ABRE A SUA LEITURA E FECHA A ANTERIOR, E O
 * ENDEREÇO PASSA A `#<id>`. Toques a sério, com o cartão trazido à vista como o
 * teclado o traria: os 21 em português e uma amostra de cinco em inglês, nos
 * dois motores. A primeira redação tocava em dois, e a leitura a frio tinha
 * razão (Major 7): dois de vinte e um não são «um toque num cartão».
 *
 * UM CARTÃO É UMA DE DUAS COISAS, e a célula exige o que cada uma promete: o que
 * leva a uma âncora desta página abre a sua leitura, fecha a anterior e põe
 * `#m-<id>` na barra; o que leva à página do domínio (três, desde o F1.2b) muda
 * de página e chega à âncora daquela medida lá dentro. A amostra inglesa apanha
 * as duas classes de propósito. Uma célula que só contasse a leitura aberta
 * passava com as duas abertas.
 *
 * J5 · A SECÇÃO DOS DOMÍNIOS, A SEGUIR AO MAPA. Cinco coisas, e as cinco no HTML
 * construído: a secção existe e vem DEPOIS do mapa na ordem do documento; tem um
 * domínio (o que hoje tem página); o nome do domínio é uma porta para a página
 * dele e o `href` responde 200; a faixa tem cartões, cada um com a sua posição
 * «n de N» daquela faixa (que a A17 mede em detalhe), e cada destino aponta para
 * a página do domínio com uma âncora que existe lá dentro; e NENHUM cartão da
 * faixa do domínio cita uma linha que já está selada na faixa da cabeça. A
 * última é a que a planta «um valor selado repetido» derruba, e é a mesma regra
 * que a A3 conta do outro lado.
 *
 * J6 · A ALTURA DE `/` A 390 MENOR DO QUE A DA ÁRVORE DE PARTIDA. O «hoje» está
 * escrito aqui, medido com `tests/inicio/porta.mjs` (célula A2) sobre a
 * construção de `1dbd1cef`, que é o ponto de partida deste ramo:
 *
 *     A2.pt → 6959 px · A2.en → 6911 px
 *
 * A célula exige MENOR, e não «menor ou igual»: a medida do brief é «a altura de
 * `/` a 390 menor do que hoje», e um bloco que tira dois painéis de uma página e
 * a deixa na mesma altura não fez o que veio fazer.
 *
 * J12 · A FORMA DE CADA LEITURA (uma célula a mais do que as onze do brief).
 * Nasceu para medir a primeira instrução do lugar de direção de 04.09.2026
 * («para os três cartões da primeira página que pertencem ao domínio, a área de
 * leitura mostra uma linha só, com a porta, e não uma segunda leitura inteira»),
 * e é hoje a célula que RECUSA essa forma, porque a decisão foi corrigida no
 * mesmo dia depois do Blocking 3 da leitura a frio.
 *
 * A LEITURA BREVE É A MESMA PARA AS 21 (decisão corrigida de 04.09.2026, depois
 * do Blocking 3 da leitura a frio): a unidade, o limiar onde o quadro publica um
 * COM A SUA RÉGUA, a definição da medida onde ela existe, as TRÊS datas da carta
 * (§1, regra 3) e o selo, que é a porta para a linha. As três medidas que vivem
 * num domínio ACRESCENTAM, no fim, a porta «Ver no domínio →»; não trocam a
 * leitura por ela.
 *
 * A célula exige, leitura a leitura: um `id` igual a `m-<id da linha>`, uma
 * unidade, três datas, um selo, e a régua exactamente onde há linha de limiar
 * (as duas dizem a mesma coisa e não podem divergir). E exige que o conjunto das
 * que levam porta seja, elemento a elemento, o conjunto dos cartões da faixa da
 * cabeça que levam à página de um domínio: as duas metades vêm da mesma tabela
 * (`dominioDaLinha()`), e uma célula que só contasse «três» passava com os três
 * errados.
 *
 * O `id` LÊ-SE DUAS VEZES, e é a segunda passagem que o manda (Major 7): no HTML
 * SERVIDO, contando `id="m-<id>"` uma vez por medida, e no navegador, no
 * `<details>` daquela medida. Uma leitura sozinha deixava passar um componente a
 * render `data-ancora` em vez de `id`.
 *
 * J7 · O PRIMEIRO ECRÃ A 390 × 664 IGUAL AO DO F1.1: o nome da publicação, a
 * manchete inteira, o primeiro cartão inteiro, o selo desse cartão e a porta do
 * concelho, todos com o fundo dentro dos 664 px e o topo dentro do ecrã. É a
 * mesma definição da célula A1 de `porta.mjs` — «uma coisa que começa dentro do
 * ecrã e acaba fora não está visível» —, medida aqui para que o relatório deste
 * bloco tenha o número ao lado do «hoje».
 *
 * ---------------------------------------------------------------------------
 * AS DUAS CÉLULAS DO F1.1c (04.09.2026)
 * ---------------------------------------------------------------------------
 * O diretor viu a página do F1.1b no ar e disse o que ela é: «the cards that we
 * can scroll on top of the website … then are double just under the map … the
 * names are still there». A decisão: os cartões ficam, por baixo da faixa não se
 * mostra nada até um cartão ser tocado, e então mostra-se a leitura daquele
 * cartão e só ela. Sem guião não muda nada.
 *
 * J13 · COM GUIÃO, QUANTOS NOMES DE MEDIDA ESTÃO À VISTA POR BAIXO DA FAIXA. Em
 * repouso, zero, e a linha do estado vazio no lugar deles; depois de um toque
 * num cartão, um — o daquele cartão —, e a linha do estado vazio fora; depois de
 * um Enter no mesmo cartão, o mesmo (a promessa do teclado é a promessa do
 * dedo); e depois do botão «voltar» do navegador, zero outra vez, com a linha do
 * estado vazio de volta. A contagem é de NOMES VISÍVEIS e não de `<details>`
 * abertos: o que o diretor viu foi uma lista de nomes, e é a lista de nomes que
 * a célula conta. Uma célula que contasse dobras abertas passava com as vinte e
 * uma fechadas à vista, que é exactamente o defeito.
 *
 * «VISÍVEL» É O QUE O MOTOR DIZ, e não uma conta desta régua: `checkVisibility()`
 * onde ele existe, e as caixas do elemento onde não existe. Uma dobra fechada
 * que a folha tira da página não tem caixa nenhuma.
 *
 * J14 · SEM GUIÃO, NADA MUDA. As 21 leituras presentes no documento, os 21 nomes
 * à vista, e a linha do estado vazio ESCONDIDA — que é a outra metade da mesma
 * promessa: sem guião as leituras estão todas ao alcance, e uma linha a mandar
 * tocar num cartão para ver o que já está no ecrã seria uma instrução falsa.
 * A J3 já mede que elas lá estão, fechadas e com `id`; o que esta acrescenta é
 * que elas se VEEM, que é o que a folha do F1.1c podia ter partido.
 *
 * ---------------------------------------------------------------------------
 * O QUE `--vermelhos` EXIGE DE CADA ESTRAGO
 * ---------------------------------------------------------------------------
 * Três coisas, como em `porta.mjs` e em `faixa.mjs`. **Verde antes**: as células
 * que o estrago nomeia passam sem ele, porque uma célula que já estava vermelha
 * não prova nada. **O HTML mudou**: a transformação dá bytes diferentes, porque
 * um estrago que não muda nada nunca podia ser apanhado. **Vermelho depois**:
 * todas as células nomeadas caem.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');

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
  console.error(`não existe ${DIST}. Corra o build primeiro.`);
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

const chrome = await chromium.launch({ headless: true });
const safari = await webkit.launch({ headless: true });

/**
 * @param {import('playwright').Browser} nav
 * @param {string} rota
 * @param {number} largura
 * @param {number} altura
 * @param {{ comGuiao?: boolean }} opcoes
 */
async function pagina(nav, rota, largura, altura = 844, opcoes = {}) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: altura },
    javaScriptEnabled: opcoes.comGuiao !== false,
  });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

/** O HTML como o servidor o entrega, com o estrago aplicado quando há um. */
async function html(rota) {
  const r = await fetch(base + rota);
  return { ok: r.status === 200, estado: r.status, texto: await r.text() };
}

const ALTURA_PEQUENA = 664;

/* ---------------------------------------------------------------------------
 * O «HOJE», MEDIDO NA ÁRVORE DE PARTIDA E ESCRITO AQUI
 * ---------------------------------------------------------------------------
 * `1dbd1cef` é o commit de que este ramo parte. Os dois números saíram de
 *
 *     node tests/inicio/porta.mjs      (células A2.pt e A2.en)
 *
 * corrido sobre a construção daquele commit, antes de uma linha mudar. Estão
 * aqui e não no relatório porque é a régua que tem de os recusar. */
const ALTURA_DA_PARTIDA = { pt: 6959, en: 6911 };

const EDICOES = [
  {
    chave: 'pt',
    rota: '/',
    doc: '/index.html',
    dominio: '/dominios/economia-e-financas-publicas',
  },
  {
    chave: 'en',
    rota: '/en',
    doc: '/en/index.html',
    dominio: '/en/domains/economia-e-financas-publicas',
  },
];

/* As 21 medidas dos dois quadros, lidas da própria fonte de dados do sítio e não
   de uma segunda lista escrita aqui: uma cópia da lista seria uma régua a medir
   o que ela própria escreveu. */
const { FIGURAS_PDM, FIGURAS_SOCIAL } = await import(path.join(RAIZ, 'src', 'data', 'figuras.mjs'));
/* A TABELA DO DESTINO, LIDA DA MESMA FONTE QUE A VISTA USA. É a mesma razão que
   `porta.mjs` escreve na A13: uma segunda lista de ids escrita aqui era a
   promessa de divergir de `src/data/dominios.mjs` no dia em que uma medida
   trocasse de domínio. */
const { dominioDaLinha } = await import(path.join(RAIZ, 'src', 'lib', 'dominios.mjs'));
const AS_VINTE_E_UMA = [...FIGURAS_PDM, ...FIGURAS_SOCIAL].map((f) => f.claim);

/* ===========================================================================
 * AS SONDAS
 * ======================================================================== */

/* J1 · onde está o nome de cada medida. Devolve, por elemento com a marca do
   nome declarado, a medida a que ele pertence e a família do lugar onde ele
   está: o cartão de uma faixa, o `<summary>` de uma leitura, ou nem uma coisa
   nem outra. */
const SONDA_DOS_NOMES = () =>
  [...document.querySelectorAll('[data-medida-nome]')].map((el) => {
    const cartao = el.closest('[data-cartao]');
    const leitura = el.closest('[data-leitura]');
    const noSummary = !!el.closest('summary');
    return {
      texto: (el.textContent ?? '').replace(/\s+/g, ' ').trim(),
      id: cartao?.getAttribute('data-cartao') ?? leitura?.getAttribute('data-leitura') ?? null,
      onde: cartao ? 'cartao' : leitura && noSummary ? 'summary' : leitura ? 'leitura' : 'nenhum',
      naCabeca: !!el.closest('[data-grelha]'),
    };
  });

/* J3 · o estado das 21 leituras como elas chegam ao leitor. */
const SONDA_DAS_LEITURAS = () => {
  const ds = [...document.querySelectorAll('details[data-leitura]')];
  return {
    total: ds.length,
    abertos: ds.filter((d) => d.open).map((d) => d.getAttribute('data-leitura')),
    semId: ds.filter((d) => !d.id).map((d) => d.getAttribute('data-leitura')),
    /* O `id` de uma leitura é `m-<id da linha>`, que é a âncora para onde o
       cartão daquela medida aponta: são as duas metades da mesma promessa, e
       por isso mede-se a igualdade e não só a presença. */
    idErrado: ds
      .filter((d) => d.id !== `m-${d.getAttribute('data-leitura')}`)
      .map((d) => `${d.getAttribute('data-leitura')}→#${d.id}`),
    comSummary: ds.filter((d) => d.querySelector(':scope > summary')).length,
  };
};

/* J12 · a forma de cada leitura, e a lista dos cartões da cabeça que levam para
   fora desta página. As duas coisas na mesma sonda porque a célula compara uma
   com a outra. */
const SONDA_DA_FORMA = () => ({
  leituras: [...document.querySelectorAll('details[data-leitura]')].map((d) => {
    const corpo = d.querySelector('.dobra-corpo');
    const porta = d.querySelector('.dobra-porta a[href]');
    return {
      id: d.getAttribute('data-leitura'),
      porta: porta ? porta.getAttribute('href') : null,
      portaTexto: porta ? (porta.textContent ?? '').replace(/\s+/g, ' ').trim() : null,
      datas: d.querySelectorAll('[data-nonledger="data-da-linha"]').length,
      selos: d.querySelectorAll('.src-chip').length,
      unidades: d.querySelectorAll('[data-medida-unidade]').length,
      blocos: corpo ? corpo.children.length : 0,
      /* O `id` LIDO DO ELEMENTO, para a metade que corre no navegador. A outra
         metade lê-o do HTML servido, na célula, e as duas têm de concordar: um
         componente que rendesse `data-ancora` em vez de `id` deixava a âncora
         de cada leitura sem existir, e foi a planta P1b da leitura a frio. */
      id_html: d.id || null,
      /* A régua contra o limiar, onde o quadro publica um: é a única forma
         gráfica desta página e saiu dela uma vez, sem ninguém pedir. */
      reguas: d.querySelectorAll('.regua-svg').length,
      frases: d.querySelectorAll('.dobra-frase').length,
      limiares: d.querySelectorAll('.dobra-limiar').length,
    };
  }),
  cartoesParaFora: [...document.querySelectorAll('[data-grelha] [data-faixa] [data-cartao]')]
    .filter((c) => !String(c.querySelector('.cartao-porta')?.getAttribute('href') ?? '').startsWith('#'))
    .map((c) => c.getAttribute('data-cartao')),
});

/* J13 e J14 · o que está À VISTA na área de leitura, e a linha do estado vazio.
   A sonda não julga: devolve os nomes visíveis com a medida a que pertencem, e
   quem decide são as células. */
const SONDA_DA_AREA = () => {
  /* «Visível» é o que o motor diz. `checkVisibility()` responde à pergunta certa
     (a folha tira isto da página?), e onde ele não existir as caixas do elemento
     respondem à mesma: um elemento com `display: none` não tem nenhuma. */
  const visivel = (el) => {
    if (!el) return false;
    if (typeof el.checkVisibility === 'function') return el.checkVisibility();
    return el.getClientRects().length > 0;
  };
  const area = document.querySelector('[data-area-leitura]') ?? document.getElementById('painel');
  const nomes = area ? [...area.querySelectorAll('[data-leitura] [data-medida-nome]')] : [];
  const vazio = document.querySelector('[data-leituras-vazio]');
  return {
    area: !!area,
    detalhes: document.querySelectorAll('details[data-leitura]').length,
    nomes: nomes.length,
    visiveis: nomes
      .filter(visivel)
      .map((el) => el.closest('[data-leitura]')?.getAttribute('data-leitura') ?? '(sem medida)'),
    abertas: [...document.querySelectorAll('details[data-leitura][open]')].map((d) => d.id),
    vazio: vazio ? { existe: true, visivel: visivel(vazio) } : { existe: false, visivel: false },
    hash: location.hash,
  };
};

/* J7 · o primeiro ecrã, com a mesma definição da A1 de `porta.mjs`. */
const SONDA_DO_PRIMEIRO_ECRA = () => {
  const cx = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;
    return { topo: +r.top.toFixed(1), fundo: +r.bottom.toFixed(1) };
  };
  const cartao = document.querySelector('[data-faixa] .cartao');
  return {
    nome: cx(document.querySelector('.wordmark')),
    manchete: cx(document.querySelector('.cabeca-h1')),
    cartao: cx(cartao),
    selo: cx(cartao ? cartao.querySelector('.src-chip') : null),
    porta: cx(document.querySelector('[data-porta-concelho]')),
    altura: document.documentElement.scrollHeight,
  };
};

/* ===========================================================================
 * A CORRIDA
 * ======================================================================== */
async function corre() {
  celulas = [];
  medidas = {};

  for (const ed of EDICOES) {
    /* ------------------------------------------------------------------- J1 */
    const p1 = await pagina(chrome, ed.rota, 390, ALTURA_PEQUENA);
    const nomes = await p1.evaluate(SONDA_DOS_NOMES);
    await p1.__ctx.close();

    /* OS DOIS LUGARES SÃO O CARTÃO DA FAIXA DA CABEÇA E O `<summary>` DA SUA
       LEITURA. A faixa do domínio, que entrou a seguir ao mapa, também tem
       cartões com nome de medida, e esses nomes são legítimos: são as medidas de
       cabeça do domínio, que não são nenhuma das 21 e cuja leitura vive na página
       do domínio. O que a célula recusa é (a) uma das 21 fora dos seus dois
       lugares e (b) um nome de medida fora de um cartão ou de um `<summary>`.

       A ALÍNEA (a) É A QUE RECUSA A FORMA DE CINCO CARTÕES da faixa do domínio:
       três das cinco são medidas desta página, e com elas na faixa do domínio o
       nome de cada uma passava a estar em três lugares. */
    const porMedida = new Map(AS_VINTE_E_UMA.map((id) => [id, { cartao: 0, summary: 0, outro: 0 }]));
    const forasteiros = [];
    for (const n of nomes) {
      if (n.onde !== 'cartao' && n.onde !== 'summary') {
        forasteiros.push(`${n.onde}:${n.id ?? '(sem medida)'}`);
        continue;
      }
      if (n.id === null || !porMedida.has(n.id)) continue;
      const c = porMedida.get(n.id);
      if (n.onde === 'summary') c.summary += 1;
      else if (n.naCabeca) c.cartao += 1;
      else c.outro += 1;
    }
    const foraDaConta = [...porMedida.entries()]
      .filter(([, c]) => c.cartao !== 1 || c.summary !== 1 || c.outro !== 0)
      .map(([id, c]) => `${id}: ${c.cartao} cartão + ${c.summary} summary + ${c.outro} noutro cartão`);
    medidas[`J1.${ed.chave}`] = {
      nomesNoDocumento: nomes.length,
      foraDaConta,
      forasteiros,
    };
    conta(
      `J1.${ed.chave}`,
      nomes.length > 0 && foraDaConta.length === 0 && forasteiros.length === 0,
      `os 21 nomes em ${ed.rota}: ${nomes.length} nome(s) declarado(s) no documento ` +
        `(21 no cartão da faixa da cabeça, 21 no <summary> da sua leitura, ` +
        `${nomes.length - 42} na faixa do domínio), ` +
        `${foraDaConta.length} medida(s) fora dos dois lugares` +
        (foraDaConta.length ? ` (${foraDaConta.slice(0, 3).join(' · ')})` : '') +
        `, ${forasteiros.length} nome(s) fora de um cartão ou de um <summary>` +
        (forasteiros.length ? ` (${[...new Set(forasteiros)].slice(0, 3).join(', ')})` : ''),
    );

    /* ------------------------------------------------------------------- J5 */
    const doc = await html(ed.doc);
    const paginaDoDominio = await html(`${ed.dominio}/index.html`);
    const idsDoDominio = new Set([...paginaDoDominio.texto.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

    const p5 = await pagina(chrome, ed.rota, 390, ALTURA_PEQUENA);
    const seccao = await p5.evaluate(() => {
      const sec = document.querySelector('[data-dominio-secao]')?.closest('section') ?? null;
      const mapa = document.querySelector('.mapa-svg');
      const dominios = [...document.querySelectorAll('[data-dominio-secao]')].map((d) => {
        const porta = d.querySelector('.dominio-secao-nome a[href]');
        const cartoes = [...d.querySelectorAll('[data-faixa] [data-cartao]')].map((c) => ({
          id: c.getAttribute('data-cartao'),
          destino: c.querySelector('.cartao-porta')?.getAttribute('href') ?? null,
          valor: c.querySelector('[data-claim]')?.getAttribute('data-claim') ?? null,
        }));
        return {
          slug: d.getAttribute('data-dominio-secao'),
          porta: porta ? porta.getAttribute('href') : null,
          portaTexto: porta ? (porta.textContent ?? '').replace(/\s+/g, ' ').trim() : null,
          cartoes,
        };
      });
      /* A ORDEM NO DOCUMENTO, e não a posição no ecrã: «a seguir ao mapa» é uma
         frase sobre a estrutura da página, e é ela que vale nas duas larguras e
         para quem lê por teclado. */
      const depoisDoMapa =
        sec && mapa
          ? Boolean(mapa.compareDocumentPosition(sec) & Node.DOCUMENT_POSITION_FOLLOWING)
          : null;
      /* E antes da área de leitura, que é a outra metade da ordem que o brief
         desenha: cabeça, domínios, leituras. */
      const painel = document.getElementById('painel');
      const antesDoPainel =
        sec && painel
          ? Boolean(sec.compareDocumentPosition(painel) & Node.DOCUMENT_POSITION_FOLLOWING)
          : null;
      return { temSeccao: !!sec, depoisDoMapa, antesDoPainel, dominios };
    });
    await p5.__ctx.close();

    /* Os ids das linhas seladas na faixa da CABEÇA: é contra eles que se mede se
       a faixa do domínio repete um valor. Lê-se do documento e não da lista das
       21, porque o que a régua tem de recusar é a repetição na página, venha ela
       de onde vier. */
    const seladosNaCabeca = new Set(
      [...doc.texto.matchAll(/data-claim="([^"]+)"/g)].map((m) => m[1]),
    );
    const queixas5 = [];
    if (!seccao.temSeccao) queixas5.push('não há secção dos domínios');
    if (seccao.depoisDoMapa !== true) queixas5.push('a secção não vem depois do mapa');
    if (seccao.antesDoPainel !== true) queixas5.push('a secção não vem antes da área de leitura');
    if (seccao.dominios.length === 0) queixas5.push('a secção não tem nenhum domínio');
    for (const d of seccao.dominios) {
      if (!d.porta) queixas5.push(`o domínio «${d.slug}» não tem porta`);
      else if (!d.porta.includes(d.slug)) queixas5.push(`a porta de «${d.slug}» é «${d.porta}»`);
      else if (!d.portaTexto) queixas5.push(`a porta de «${d.slug}» não tem texto`);
      if (d.cartoes.length === 0) queixas5.push(`a faixa de «${d.slug}» não tem cartões`);
      for (const c of d.cartoes) {
        if (!c.destino || !c.destino.includes('#')) {
          queixas5.push(`o cartão «${c.id}» de «${d.slug}» não leva à página do domínio`);
          continue;
        }
        const ancora = c.destino.slice(c.destino.indexOf('#') + 1);
        if (!c.destino.startsWith(ed.dominio)) {
          queixas5.push(`o cartão «${c.id}» leva a «${c.destino}» e não à página do domínio`);
        } else if (!idsDoDominio.has(ancora)) {
          queixas5.push(`a âncora «${ancora}» não existe na página do domínio`);
        }
      }
    }
    /* NENHUM VALOR SELADO REPETIDO: um cartão da faixa de um domínio não pode
       citar uma linha que a página já sela. `data-claim` é contado no HTML
       inteiro, e por isso duas rendições da mesma linha dão duas ocorrências. */
    const repetidos = [];
    for (const d of seccao.dominios) {
      for (const c of d.cartoes) {
        if (!c.valor) continue;
        const n = (doc.texto.match(new RegExp(`data-claim="${c.valor}"`, 'g')) ?? []).length;
        if (n !== 1) repetidos.push(`${c.valor}×${n}`);
      }
    }
    if (repetidos.length) queixas5.push(`valor(es) selado(s) mais do que uma vez: ${repetidos.join(', ')}`);
    if (!paginaDoDominio.ok) queixas5.push(`a página do domínio responde ${paginaDoDominio.estado}`);

    medidas[`J5.${ed.chave}`] = { seccao, repetidos, queixas: queixas5 };
    conta(
      `J5.${ed.chave}`,
      seccao.temSeccao && queixas5.length === 0 && seladosNaCabeca.size > 0,
      `a secção dos domínios em ${ed.rota}: ${seccao.dominios.length} domínio(s) ` +
        `(${seccao.dominios.map((d) => `${d.slug} ${d.cartoes.length} cartão(ões) → ${d.porta}`).join(' · ')})` +
        ` · depois do mapa: ${seccao.depoisDoMapa} · antes da leitura: ${seccao.antesDoPainel}` +
        (queixas5.length ? ` · QUEIXAS: ${queixas5.slice(0, 4).join('; ')}` : ' · nenhuma queixa'),
    );

    /* ------------------------------------------------------------------ J12 */
    const p12 = await pagina(chrome, ed.rota, 390, ALTURA_PEQUENA);
    const forma = await p12.evaluate(SONDA_DA_FORMA);
    await p12.__ctx.close();

    /* O `id` DE CADA LEITURA, LIDO DO HTML SERVIDO e não só do navegador
       (segunda passagem, Major 7). São duas leituras da mesma promessa, e a
       célula exige as duas: no documento entregue tem de haver exactamente um
       `id="m-<id da linha>"` por medida, e no navegador o `<details>` daquela
       medida tem de o levar. Uma delas sozinha deixava passar o componente a
       render `data-ancora` em vez de `id`, que é a planta P1b da leitura a
       frio. */
    const idsNoDocumento = AS_VINTE_E_UMA.map((id) => ({
      id,
      n: (doc.texto.match(new RegExp(`id="m-${id}"`, 'g')) ?? []).length,
    })).filter((x) => x.n !== 1);

    const queixas12 = [];
    if (forma.leituras.length !== AS_VINTE_E_UMA.length) {
      queixas12.push(`${forma.leituras.length} leitura(s) de ${AS_VINTE_E_UMA.length}`);
    }
    for (const x of idsNoDocumento) {
      queixas12.push(`o HTML servido tem ${x.n} «id="m-${x.id}"»`);
    }
    /* A LEITURA BREVE É A MESMA PARA AS 21 (decisão corrigida de 04.09.2026): a
       unidade, o limiar onde o quadro publica um com a sua régua, a frase da
       medida onde ela existe, as três datas da carta e o selo, que é a porta
       para a linha. Uma medida que vive num domínio ACRESCENTA a porta, e não
       troca a leitura por ela. */
    const limiaresEsperados = new Set(
      forma.leituras.filter((l) => l.limiares > 0).map((l) => l.id),
    );
    for (const l of forma.leituras) {
      if (l.id_html !== `m-${l.id}`) queixas12.push(`«${l.id}» tem id «${l.id_html}»`);
      if (l.datas !== 3) queixas12.push(`«${l.id}» tem ${l.datas} data(s) e a carta pede três`);
      if (l.selos !== 1) queixas12.push(`«${l.id}» tem ${l.selos} selo(s)`);
      if (l.unidades !== 1) queixas12.push(`«${l.id}» tem ${l.unidades} unidade(s)`);
      /* Onde há limiar há régua, e onde não há não há nenhuma das duas: as duas
         dizem a mesma coisa e não podem divergir. */
      if (l.limiares > 1) queixas12.push(`«${l.id}» tem ${l.limiares} linhas de limiar`);
      if (l.reguas !== l.limiares) {
        queixas12.push(`«${l.id}» tem ${l.limiares} limiar(es) e ${l.reguas} régua(s)`);
      }
      if (l.porta) {
        if (!l.porta.startsWith(ed.dominio)) queixas12.push(`«${l.id}» tem porta «${l.porta}»`);
        if (!l.portaTexto) queixas12.push(`a porta de «${l.id}» não tem texto`);
      }
    }
    if (limiaresEsperados.size === 0) queixas12.push('nenhuma leitura tem linha de limiar');
    const comPorta = forma.leituras.filter((l) => l.porta).map((l) => l.id).sort();
    const paraFora = [...forma.cartoesParaFora].sort();
    if (comPorta.join('|') !== paraFora.join('|')) {
      queixas12.push(
        `as leituras com porta (${comPorta.join(', ') || 'nenhuma'}) não são os cartões que levam ` +
          `para fora (${paraFora.join(', ') || 'nenhum'})`,
      );
    }
    const comFrase = forma.leituras.filter((l) => l.frases > 0).length;
    medidas[`J12.${ed.chave}`] = { forma, idsNoDocumento, queixas: queixas12 };
    conta(
      `J12.${ed.chave}`,
      forma.leituras.length > 0 && comPorta.length > 0 && queixas12.length === 0,
      `a forma das leituras em ${ed.rota}: ${forma.leituras.length} inteira(s) ` +
        `(unidade, três datas e selo em todas; ${limiaresEsperados.size} com limiar e régua; ` +
        `${comFrase} com a definição da medida), e ${comPorta.length} delas acrescentam a porta ` +
        `para o domínio (${comPorta.join(', ') || 'nenhuma'}) · ` +
        `${AS_VINTE_E_UMA.length - idsNoDocumento.length} de ${AS_VINTE_E_UMA.length} âncoras no HTML servido` +
        (queixas12.length ? ` · QUEIXAS: ${queixas12.slice(0, 4).join('; ')}` : ''),
    );

    /* ------------------------------------------------------------- J6 e J7 */
    const p7 = await pagina(chrome, ed.rota, 390, ALTURA_PEQUENA);
    const ecra = await p7.evaluate(SONDA_DO_PRIMEIRO_ECRA);
    await p7.__ctx.close();

    medidas[`J6.${ed.chave}`] = { altura: ecra.altura, partida: ALTURA_DA_PARTIDA[ed.chave] };
    conta(
      `J6.${ed.chave}`,
      Number.isFinite(ecra.altura) && ecra.altura < ALTURA_DA_PARTIDA[ed.chave],
      `altura de ${ed.rota} a 390: ${ecra.altura} px · árvore de partida ${ALTURA_DA_PARTIDA[ed.chave]} px ` +
        `(${ecra.altura - ALTURA_DA_PARTIDA[ed.chave]})`,
    );

    const dentro = (c) => !!c && c.fundo <= ALTURA_PEQUENA && c.topo >= 0;
    const foraDoEcra = Object.entries({
      nome: ecra.nome,
      manchete: ecra.manchete,
      cartao: ecra.cartao,
      selo: ecra.selo,
      porta: ecra.porta,
    })
      .filter(([, c]) => !dentro(c))
      .map(([k, c]) => `${k}${c ? ` (fundo ${c.fundo})` : ' (sem caixa)'}`);
    medidas[`J7.${ed.chave}`] = { ecra, foraDoEcra };
    conta(
      `J7.${ed.chave}`,
      foraDoEcra.length === 0,
      `390×664 em ${ed.rota}: nome, manchete, cartão, selo e porta do concelho dentro do ecrã ` +
        `(fundo máximo ${Math.max(
          ...[ecra.nome, ecra.manchete, ecra.cartao, ecra.selo, ecra.porta]
            .filter(Boolean)
            .map((c) => c.fundo),
        ).toFixed(1)} px)` + (foraDoEcra.length ? ` · FORA: ${foraDoEcra.join(', ')}` : ''),
    );
  }

  /* --------------------------------------------------------------------- J3 */
  /* NAS DUAS EDIÇÕES E NOS DOIS MOTORES (segunda passagem, 04.09.2026, Major 7
     da leitura a frio). A primeira redação corria só em português, com a razão
     escrita («os dois documentos têm a mesma estrutura, e a J1 mede as duas»),
     e o leitor mostrou o que isso deixava passar: uma leitura inglesa sem `id`
     não caía em célula nenhuma. Uma razão escrita não substitui uma medição, e
     esta custa quatro corridas em vez de duas. */
  for (const ed of EDICOES) {
    /* O ALVO DO FRAGMENTO É UMA MEDIDA QUE NÃO VIVE NUM DOMÍNIO, e escolhe-se
       assim: o cartão de uma medida de domínio leva para fora desta página, e o
       que esta célula mede é o endereço `#m-<id>` a abrir a leitura AQUI. */
    const alvoDoFragmento = AS_VINTE_E_UMA.find((id) => !dominioDaLinha(id)) ?? AS_VINTE_E_UMA[0];
    for (const [motor, nav] of [
      ['chromium', chrome],
      ['webkit', safari],
    ]) {
      const chave = `J3.${ed.chave}.${motor}`;
      const p = await pagina(nav, ed.rota, 390, ALTURA_PEQUENA, { comGuiao: false });
      const r = await p.evaluate(SONDA_DAS_LEITURAS);
      await p.__ctx.close();

      const SONDA_DO_FRAGMENTO = (id) => {
        const d = document.getElementById(`m-${id}`);
        return {
          existe: !!d,
          aberto: !!d && d.open,
          outrosAbertos: [...document.querySelectorAll('details[data-leitura][open]')].filter(
            (x) => x.id !== `m-${id}`,
          ).length,
        };
      };
      const pf = await pagina(nav, `${ed.rota}#m-${alvoDoFragmento}`, 390, ALTURA_PEQUENA, {
        comGuiao: false,
      });
      const semGuiao = await pf.evaluate(SONDA_DO_FRAGMENTO, alvoDoFragmento);
      await pf.__ctx.close();

      /* E O MESMO ENDEREÇO COM GUIÃO, no mesmo motor. É a metade que a página
         PROMETE em qualquer motor: sem guião, o `<summary>` está a um toque e o
         motor abre-o se souber; com guião, `public/js/inicio.js` abre a leitura
         do fragmento à chegada, e `/#m-<id>` é uma citação que abre alguma
         coisa. */
      const pg = await pagina(nav, `${ed.rota}#m-${alvoDoFragmento}`, 390, ALTURA_PEQUENA);
      const comGuiao = await pg.evaluate(SONDA_DO_FRAGMENTO, alvoDoFragmento);
      await pg.__ctx.close();

      medidas[chave] = { ...r, fragmento: { id: alvoDoFragmento, semGuiao, comGuiao } };
      conta(
        chave,
        r.total === AS_VINTE_E_UMA.length &&
          r.abertos.length === 0 &&
          r.semId.length === 0 &&
          r.idErrado.length === 0 &&
          r.comSummary === AS_VINTE_E_UMA.length &&
          semGuiao.existe &&
          comGuiao.aberto &&
          comGuiao.outrosAbertos === 0,
        `sem guião em ${ed.rota} · ${motor}: ${r.total} leitura(s) de ${AS_VINTE_E_UMA.length}, ` +
          `${r.abertos.length} aberta(s), ${r.semId.length} sem id, ${r.idErrado.length} com id errado, ` +
          `${r.comSummary} com <summary> · o fragmento «#m-${alvoDoFragmento}» existe: ${semGuiao.existe}, ` +
          `e o motor abre o <details> alvo de um fragmento sem guião: ` +
          `${semGuiao.aberto ? 'sim' : 'NÃO (o <summary> está a um toque)'} · ` +
          `com guião abre: ${comGuiao.aberto} (e ${comGuiao.outrosAbertos} outra(s) aberta(s))`,
      );
    }
  }

  /* --------------------------------------------------------------------- J4 */
  /* OS 21 CARTÕES EM PORTUGUÊS E UMA AMOSTRA DE CINCO EM INGLÊS, NOS DOIS
     MOTORES (segunda passagem, 04.09.2026, Major 7). A primeira redação tocava
     nos dois primeiros cartões locais em Chromium, e o leitor tinha razão: dois
     de vinte e um não são «um toque num cartão».
     ------------------------------------------------------------------------
     UM CARTÃO É UMA DE DUAS COISAS, e a célula exige a promessa de cada uma:
       · o que leva a uma âncora DESTA página abre a sua leitura, fecha a que
         estava aberta, e põe `#m-<id>` na barra de endereço;
       · o que leva à página do domínio (três, desde o F1.2b) muda de página e
         chega à âncora daquela medida lá dentro.
     Depois de um cartão de domínio a página é outra, e por isso a corrida volta
     à primeira página antes do cartão seguinte; a cadeia do «fecha a anterior»
     mede-se entre toques locais consecutivos, que é onde ela existe. */
  for (const [ed, quantos] of [
    [EDICOES[0], null],
    [EDICOES[1], 5],
  ]) {
    for (const [motor, nav] of [
      ['chromium', chrome],
      ['webkit', safari],
    ]) {
      const chave = `J4.${ed.chave}.${motor}`;
      const p = await pagina(nav, ed.rota, 390, ALTURA_PEQUENA);
      const todos = await p.evaluate(() =>
        [...document.querySelectorAll('[data-grelha] [data-faixa] [data-cartao]')].map((c) => ({
          id: c.getAttribute('data-cartao'),
          href: c.querySelector('.cartao-porta')?.getAttribute('href') ?? '',
        })),
      );
      /* A AMOSTRA INGLESA APANHA AS DUAS CLASSES, e não os cinco primeiros: dois
         cartões que levam à página do domínio e três que abrem aqui. Uma amostra
         que fosse só do princípio da faixa nunca tocaria num cartão de domínio. */
      const daFora = todos.filter((c) => !c.href.startsWith('#'));
      const daCasa = todos.filter((c) => c.href.startsWith('#'));
      const lista =
        quantos === null
          ? todos
          : [...daFora.slice(0, 2), ...daCasa.slice(0, quantos - Math.min(2, daFora.length))];

      const passos = [];
      let anterior = null;
      for (const c of lista) {
        const naPrimeira = new URL(p.url()).pathname.replace(/\/$/, '') === ed.rota.replace(/\/$/, '');
        if (!naPrimeira) {
          await p.goto(base + ed.rota, { waitUntil: 'networkidle' });
          anterior = null;
        }
        await p.evaluate((id) => {
          const el = document.querySelector(`[data-cartao="${id}"]`);
          if (el) el.scrollIntoView({ block: 'center', inline: 'center' });
        }, c.id);
        await p.click(`[data-cartao="${c.id}"] .cartao-porta`);
        await p.waitForTimeout(140);
        const local = c.href.startsWith('#');
        const estado = local
          ? await p.evaluate(() => ({
              url: location.pathname + location.hash,
              hash: location.hash,
              abertas: [...document.querySelectorAll('details[data-leitura][open]')].map((d) => d.id),
            }))
          : { url: new URL(p.url()).pathname + new URL(p.url()).hash, hash: '', abertas: [] };
        passos.push({ cartao: c.id, local, anterior, ...estado });
        anterior = local ? c.id : null;
      }
      await p.__ctx.close();

      const queixas4 = [];
      if (lista.length === 0) queixas4.push('a faixa da cabeça não tem cartões');
      if (quantos === null && lista.length !== AS_VINTE_E_UMA.length) {
        queixas4.push(`${lista.length} cartões de ${AS_VINTE_E_UMA.length}`);
      }
      if (!lista.some((c) => !c.href.startsWith('#'))) {
        queixas4.push('a amostra não tem nenhum cartão que leve à página do domínio');
      }
      for (const s2 of passos) {
        if (s2.local) {
          if (s2.hash !== `#m-${s2.cartao}`) queixas4.push(`«${s2.cartao}» deu «${s2.hash}»`);
          if (s2.abertas.length !== 1) {
            queixas4.push(`«${s2.cartao}» deixou ${s2.abertas.length} leitura(s) aberta(s)`);
          } else if (s2.abertas[0] !== `m-${s2.cartao}`) {
            queixas4.push(`«${s2.cartao}» abriu «${s2.abertas[0]}»`);
          }
        } else {
          const dominio = dominioDaLinha(s2.cartao);
          const esperado = `${ed.dominio}#${dominio ? dominio.ancora : ''}`;
          if (s2.url.replace(/\/$/, '') !== esperado) {
            queixas4.push(`«${s2.cartao}» chegou a «${s2.url}» e não a «${esperado}»`);
          }
        }
      }
      const locais = passos.filter((x) => x.local).length;
      medidas[chave] = { passos, queixas: queixas4 };
      conta(
        chave,
        passos.length === lista.length && lista.length > 0 && queixas4.length === 0,
        `com guião em ${ed.rota} · ${motor}: ${passos.length} cartão(ões) tocados, ` +
          `${locais} abriram a sua leitura aqui (uma de cada vez) e ${passos.length - locais} ` +
          `foram à página do domínio` +
          (queixas4.length ? ` · QUEIXAS: ${queixas4.slice(0, 4).join('; ')}` : ''),
      );
    }
  }

  /* ------------------------------------------------------------ J13 e J14 */
  /* AS DUAS CÉLULAS DO F1.1c, nas duas edições e nos dois motores. A J13 mede o
     que está À VISTA por baixo da faixa com guião — zero nomes em repouso, um
     depois de um toque, um depois de um Enter, zero depois de voltar atrás — e a
     J14 mede que sem guião nada disto acontece. */
  for (const ed of EDICOES) {
    for (const [motor, nav] of [
      ['chromium', chrome],
      ['webkit', safari],
    ]) {
      /* ---------------------------------------------------------------- J13 */
      const chave13 = `J13.${ed.chave}.${motor}`;
      const p13 = await pagina(nav, ed.rota, 390, ALTURA_PEQUENA);
      const repouso = await p13.evaluate(SONDA_DA_AREA);

      /* O CARTÃO QUE ABRE A LEITURA AQUI: os três que levam à página do domínio
         mudam de página, e o que esta célula mede é a área desta. */
      const cartao = await p13.evaluate(() => {
        const c = [...document.querySelectorAll('[data-grelha] [data-faixa] [data-cartao]')].find(
          (x) => (x.querySelector('.cartao-porta')?.getAttribute('href') ?? '').startsWith('#'),
        );
        if (c) c.scrollIntoView({ block: 'center', inline: 'center' });
        return c ? c.getAttribute('data-cartao') : null;
      });
      await p13.click(`[data-cartao="${cartao}"] .cartao-porta`);
      await p13.waitForTimeout(180);
      const aposToque = await p13.evaluate(SONDA_DA_AREA);

      /* O BOTÃO «VOLTAR» DO NAVEGADOR, e não o `goBack()` da ferramenta: o que a
         página promete é que a travessia do histórico devolve o ecrã vazio, e
         essa travessia é `history.back()` dentro do documento, que é o que
         dispara o `hashchange` de que o guião vive. */
      await p13.evaluate(() => history.back());
      await p13.waitForTimeout(180);
      const aposVoltar = await p13.evaluate(SONDA_DA_AREA);

      /* E O TECLADO: Enter no mesmo cartão faz o que o dedo faz. */
      await p13.focus(`[data-cartao="${cartao}"] .cartao-porta`);
      await p13.keyboard.press('Enter');
      await p13.waitForTimeout(180);
      const aposEnter = await p13.evaluate(SONDA_DA_AREA);
      await p13.__ctx.close();

      const queixas13 = [];
      if (!repouso.area) queixas13.push('não há área de leitura marcada');
      if (repouso.detalhes !== AS_VINTE_E_UMA.length) {
        queixas13.push(`${repouso.detalhes} leitura(s) no documento de ${AS_VINTE_E_UMA.length}`);
      }
      if (repouso.visiveis.length !== 0) {
        queixas13.push(
          `em repouso há ${repouso.visiveis.length} nome(s) à vista (${repouso.visiveis.slice(0, 3).join(', ')})`,
        );
      }
      if (!repouso.vazio.existe) queixas13.push('não há linha do estado vazio');
      else if (!repouso.vazio.visivel) queixas13.push('a linha do estado vazio não se vê em repouso');
      /* Depois do toque: um nome à vista, o daquele cartão, e a linha do estado
         vazio fora. As três coisas, porque duas delas certas com a terceira
         errada continua a ser a área a dizer o que não é. */
      if (aposToque.visiveis.length !== 1 || aposToque.visiveis[0] !== cartao) {
        queixas13.push(
          `depois do toque em «${cartao}» há ${aposToque.visiveis.length} nome(s) à vista ` +
            `(${aposToque.visiveis.slice(0, 3).join(', ') || 'nenhum'})`,
        );
      }
      if (aposToque.vazio.visivel) queixas13.push('a linha do estado vazio ficou à vista com uma leitura aberta');
      if (aposToque.hash !== `#m-${cartao}`) queixas13.push(`o toque deu «${aposToque.hash}»`);
      if (aposVoltar.visiveis.length !== 0) {
        queixas13.push(`depois de voltar há ${aposVoltar.visiveis.length} nome(s) à vista`);
      }
      if (aposVoltar.vazio.existe && !aposVoltar.vazio.visivel) {
        queixas13.push('depois de voltar a linha do estado vazio não voltou');
      }
      if (aposEnter.visiveis.length !== 1 || aposEnter.visiveis[0] !== cartao) {
        queixas13.push(
          `depois do Enter em «${cartao}» há ${aposEnter.visiveis.length} nome(s) à vista ` +
            `(${aposEnter.visiveis.slice(0, 3).join(', ') || 'nenhum'})`,
        );
      }
      if (aposEnter.hash !== `#m-${cartao}`) queixas13.push(`o Enter deu «${aposEnter.hash}»`);

      medidas[chave13] = { cartao, repouso, aposToque, aposVoltar, aposEnter, queixas: queixas13 };
      conta(
        chave13,
        !!cartao && queixas13.length === 0,
        `com guião em ${ed.rota} · ${motor}: ${repouso.visiveis.length} nome(s) à vista em repouso ` +
          `(linha do estado vazio: ${repouso.vazio.existe ? (repouso.vazio.visivel ? 'à vista' : 'escondida') : 'não existe'}), ` +
          `${aposToque.visiveis.length} depois do toque em «${cartao}», ` +
          `${aposVoltar.visiveis.length} depois de voltar atrás, ${aposEnter.visiveis.length} depois do Enter · ` +
          `${repouso.detalhes} leitura(s) no documento` +
          (queixas13.length ? ` · QUEIXAS: ${queixas13.slice(0, 4).join('; ')}` : ''),
      );

      /* ---------------------------------------------------------------- J14 */
      const chave14 = `J14.${ed.chave}.${motor}`;
      const p14 = await pagina(nav, ed.rota, 390, ALTURA_PEQUENA, { comGuiao: false });
      const semGuiao = await p14.evaluate(SONDA_DA_AREA);
      await p14.__ctx.close();

      const queixas14 = [];
      if (semGuiao.detalhes !== AS_VINTE_E_UMA.length) {
        queixas14.push(`${semGuiao.detalhes} leitura(s) de ${AS_VINTE_E_UMA.length}`);
      }
      if (semGuiao.visiveis.length !== AS_VINTE_E_UMA.length) {
        queixas14.push(
          `${semGuiao.visiveis.length} nome(s) à vista de ${AS_VINTE_E_UMA.length}`,
        );
      }
      if (semGuiao.abertas.length !== 0) queixas14.push(`${semGuiao.abertas.length} leitura(s) abertas`);
      if (semGuiao.vazio.visivel) queixas14.push('a linha do estado vazio vê-se sem guião');

      medidas[chave14] = { ...semGuiao, queixas: queixas14 };
      conta(
        chave14,
        semGuiao.detalhes === AS_VINTE_E_UMA.length && queixas14.length === 0,
        `sem guião em ${ed.rota} · ${motor}: ${semGuiao.detalhes} leitura(s) no documento, ` +
          `${semGuiao.visiveis.length} nome(s) à vista, ${semGuiao.abertas.length} aberta(s), ` +
          `linha do estado vazio ${semGuiao.vazio.existe ? (semGuiao.vazio.visivel ? 'À VISTA' : 'escondida') : 'não existe'}` +
          (queixas14.length ? ` · QUEIXAS: ${queixas14.slice(0, 3).join('; ')}` : ''),
      );
    }
  }
}

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS (J11 do brief)
 * ======================================================================== */
const PLANTAS = [
  {
    nome: 'um painel de baixo de volta (a peça com o nome da medida)',
    celulas: ['J1.pt'],
    /* Repõe uma peça do painel que saiu, com o nome da medida na forma que ela
       tinha: um `<h3 class="peca-nome" data-medida-nome>` dentro de um
       `<article class="peca">`. O nome da dívida pública passa a estar em três
       lugares em vez de dois, que é exactamente o que este bloco veio tirar. */
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h
        : h.replace(
            /<div class="dobras"/,
            '<div class="painel"><article class="peca" data-medida="divida-publica-2025">' +
              '<h3 class="peca-nome" data-medida-nome>Dívida pública</h3></article></div>' +
              '<div class="dobras"',
          ),
  },
  {
    nome: 'um <details> da área de leitura sem id',
    celulas: ['J3.pt.chromium', 'J3.pt.webkit', 'J12.pt'],
    /* Tira o `id` da primeira leitura. O `<details>` continua lá, continua
       fechado e continua com o seu `<summary>`: o que se perde é a âncora, e com
       ela a promessa de que `#m-<id>` abre alguma coisa. */
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h
        : h.replace(/<details class="dobra" id="m-[^"]+"/, '<details class="dobra"'),
  },
  {
    nome: 'a secção dos domínios sem a porta',
    celulas: ['J5.pt'],
    /* Tira a ligação do nome do domínio e deixa o nome. A secção continua lá,
       com a faixa e os cartões; o que falta é a porta para a página do domínio,
       que é o que o item 3 do brief manda pôr. */
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h
        : h.replace(
            /<h3 class="dominio-secao-nome"><a class="lig" href="[^"]*">([\s\S]*?)<\/a><\/h3>/,
            '<h3 class="dominio-secao-nome">$1</h3>',
          ),
  },
  {
    nome: 'a leitura de uma medida do domínio reduzida a uma linha com a porta',
    celulas: ['J12.pt'],
    /* O DEFEITO QUE A SEGUNDA PASSAGEM TIROU, REPOSTO (04.09.2026). A primeira
       passagem reduziu a leitura das três medidas de domínio a uma linha com a
       porta, e a leitura a frio mediu o que isso custava (Blocking 3): a
       primeira página perdia a definição da dívida pública, o seu limiar e a sua
       régua, e a porta para a linha. Esta planta repõe exactamente essa forma na
       leitura da dívida pública, e a J12 tem de a recusar: a leitura breve é a
       mesma para as 21, e a porta ACRESCENTA-SE, não substitui. */
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h
        : (() => {
            const i = h.indexOf('<details class="dobra" id="m-divida-publica-2025"');
            if (i < 0) return h;
            const abre = h.indexOf('<div class="dobra-corpo">', i);
            const porta = h.indexOf('<p class="dobra-porta">', i);
            if (abre < 0 || porta < 0) return h;
            return h.slice(0, abre) + '<div class="dobra-corpo">' + h.slice(porta);
          })(),
  },
  {
    nome: 'uma leitura fechada deixada à vista com guião',
    celulas: ['J13.pt.chromium', 'J13.pt.webkit'],
    /* O DEFEITO QUE O F1.1c VEIO TIRAR, REPOSTO NUMA LEITURA SÓ. A folha esconde
       as dobras fechadas quando o guião acende a área; um estilo em linha na
       primeira dobra ganha à folha e deixa aquela leitura à vista, fechada, por
       baixo do cartão que já diz o nome dela. É um nome de medida a mais na
       área, que é a unidade do defeito que o diretor viu — e a J13 tem de o
       contar. Sem guião não muda nada: `display: block` é o que o navegador já
       dá a um `<details>`, e por isso a J14 continua verde, como deve. */
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h
        : h.replace('<details class="dobra" id="m-', '<details style="display:block" class="dobra" id="m-'),
  },
  {
    nome: 'a área de leitura sem a linha do estado vazio',
    celulas: ['J13.pt.chromium', 'J13.pt.webkit'],
    /* Tira do documento a linha que a área mostra quando não há nenhuma leitura
       aberta. As dobras continuam a esconder-se, o toque continua a abrir a
       certa: o que fica é uma área sem nada dentro e sem uma palavra a dizer o
       gesto que a enche, que é o buraco que o item 1 do bloco manda fechar. */
    f: (h, rota) =>
      rota.startsWith('/en') ? h : h.replace(/<p class="dobras-nada"[^>]*>[\s\S]*?<\/p>/, ''),
  },
  {
    nome: 'a faixa do domínio com um valor selado repetido',
    celulas: ['J5.pt'],
    /* Troca a linha do primeiro cartão da faixa do domínio pela da dívida
       pública, que já está selada na faixa da cabeça. O cartão continua com
       valor, com selo e com destino: o que passa a estar errado é que a página
       sela a mesma linha duas vezes, que é o que a régua A3 conta do outro lado
       e o que este bloco decidiu não fazer. */
    f: (h, rota) => {
      if (rota.startsWith('/en')) return h;
      const i = h.indexOf('data-dominio-secao=');
      if (i < 0) return h;
      const cabeca = h.slice(0, i);
      const cauda = h
        .slice(i)
        .replace('data-claim="saldo-das-administracoes-publicas-2025"', 'data-claim="divida-publica-2025"');
      return cabeca + cauda;
    },
  },
];

/* ========================================================================= */
await corre();
const linhas = celulas.map((c) => ({ ...c }));

for (const c of linhas) {
  console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}  ${cinza(c.prova)}`);
}

let plantasOk = true;
if (VERMELHOS) {
  console.log('');
  console.log('  estragos plantados:');
  const porNome = new Map(linhas.map((c) => [c.nome, c]));
  for (const planta of PLANTAS) {
    /* VERDE ANTES, CÉLULA A CÉLULA E COM NOME (segunda passagem, 04.09.2026,
       Major 7 da leitura a frio). A conferência já existia e dizia «sim» ou
       «NÃO»; o que faltava era dizer QUAL das células nomeadas não estava verde,
       para que o relatório da planta seja reproduzível por quem lê e não só por
       quem correu. Uma planta cuja célula já estava vermelha não prova nada, e
       agora diz-se qual. */
    const naoVerdes = planta.celulas.filter((n) => !porNome.get(n)?.passa);
    const semCelula = planta.celulas.filter((n) => !porNome.has(n));
    const verdeAntes = naoVerdes.length === 0 && semCelula.length === 0;
    let mudou = false;
    const rotasDaPlanta = planta.rotas ?? EDICOES.map((ed) => ed.doc);
    for (const rota of rotasDaPlanta) {
      const antes = fs.readFileSync(path.join(DIST, rota.replace(/^\//, '')), 'utf8');
      if (planta.f(antes, rota.replace(/\/index\.html$/, '') || '/') !== antes) mudou = true;
    }
    ESTRAGO = planta.f;
    await corre();
    ESTRAGO = null;
    const depois = new Map(celulas.map((c) => [c.nome, c]));
    const caiuTudo = planta.celulas.every((n) => depois.get(n) && !depois.get(n).passa);
    const ok = verdeAntes && mudou && caiuTudo;
    plantasOk = plantasOk && ok;
    console.log(
      `  ${ok ? verde('✓') : vermelho('✗')} ${planta.nome}  ` +
        cinza(
          `verde antes: ${
            verdeAntes
              ? 'sim'
              : `NÃO (${[
                  ...naoVerdes.map((n) => `${n} já vermelha`),
                  ...semCelula.map((n) => `${n} não existe`),
                ].join(', ')})`
          } · html mudou: ${mudou ? 'sim' : 'NÃO'} · ` +
            `vermelho depois: ${planta.celulas
              .map((n) => `${n}=${depois.get(n)?.passa ? 'verde' : 'vermelho'}`)
              .join(', ')}`,
        ),
    );
  }
  /* Repõe a leitura limpa para o ficheiro JSON e para o código de saída. */
  await corre();
}

const todas = celulas.every((c) => c.passa);
console.log('');
console.log(
  `  leitura ${todas ? verde('✓') : vermelho('✗')} ${celulas.filter((c) => c.passa).length} de ${celulas.length} célula(s)` +
    (VERMELHOS ? ` · plantas ${plantasOk ? verde('✓') : vermelho('✗')}` : '') +
    cinza(`  ${DIST}`),
);

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(
    FICHEIRO_JSON,
    JSON.stringify({ dist: DIST, celulas, medidas, plantasOk: VERMELHOS ? plantasOk : null }, null, 2),
  );
}

await chrome.close();
await safari.close();
servidor.close();
process.exit(todas && (!VERMELHOS || plantasOk) ? 0 : 1);
