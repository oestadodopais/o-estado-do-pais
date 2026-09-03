#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DA PORTA DA FRENTE · o bloco F1.1 de 03.09.2026
 * =============================================================================
 *
 * Uma célula por medida de aceitação do `BRIEF-F1.1-porta-da-frente.md` §4, em
 * Chromium sem cabeça sobre `dist/` servido em local, e em leitura direta do
 * HTML construído onde a medida é uma contagem. NÃO é um portão: não entra no
 * `npm run build` nem no `npm run verify`, e não constrói nada. Imprime uma
 * linha por célula, sai a 0 quando todas passam e a 1 quando alguma falha, como
 * `tests/inicio/faixa.mjs` e `tests/inicio/lista.mjs`.
 *
 *   node tests/inicio/porta.mjs
 *   node tests/inicio/porta.mjs --json <ficheiro>
 *   node tests/inicio/porta.mjs --vermelhos
 *   OEDP_DIST=/caminho/para/outra/dist node tests/inicio/porta.mjs
 *
 * `OEDP_DIST` existe por uma razão do próprio bloco: as medidas de aceitação
 * exigem o valor de PARTIDA e o de CHEGADA, e o de partida mede-se na
 * construção da árvore de origem, que fica guardada noutra pasta. A régua é a
 * mesma nas duas leituras; o que muda é a pasta que ela lê, e o relatório diz
 * qual foi.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * A1 · O PRIMEIRO ECRÃ DO TELEMÓVEL PEQUENO (390 × 664), nas duas edições.
 * Cinco coisas dentro do primeiro ecrã, sem gesto: o nome da publicação, a
 * manchete INTEIRA (o fundo da caixa, e não o topo), o primeiro cartão INTEIRO,
 * o selo desse cartão e a porta do concelho. Mede-se a caixa de cada um contra
 * a altura da janela, com a página no cimo: `rect.bottom <= 664` e
 * `rect.top >= 0`. Uma coisa que começa dentro do ecrã e acaba fora não está
 * visível; é a diferença entre «vê-se» e «vê-se o princípio».
 *
 * A2 · A ALTURA DE `/` A 390. `document.documentElement.scrollHeight`, a mesma
 * definição de `tests/inicio/lista.mjs`. A célula não guarda um teto escrito:
 * o teto é o «hoje» medido na árvore de partida, e o relatório imprime os dois.
 * Aqui a célula só imprime o número; quem o compara é o relatório, que é onde a
 * comparação tem os dois lados.
 *
 * A3 · OS VINTE E UM VALORES UMA SÓ VEZ. Conta-se, no HTML construído das duas
 * edições, quantos elementos levam `data-claim="<id>"` para cada uma das 21
 * medidas dos dois quadros. A conta é sobre a MARCA e não sobre o texto do
 * valor: dois valores podem ser iguais por acaso (duas medidas a 6,0) e a marca
 * é a única coisa que diz de que linha é cada algarismo.
 *
 * A4 · «Comissão Europeia» EM `/` E «European Commission» EM `/en`. Contagem de
 * ocorrências, e não de linhas: o HTML construído é quase todo uma linha só, e
 * `grep -c` contaria 1 onde há dez.
 *
 * A5 · AS 29 UNIDADES COM NOME VISÍVEL E ALVO. Abaixo de 1024, cada uma das 29
 * unidades da Carta tem de ter um nome com caixa (visível, e não apenas
 * presente) e alvo de 44 × 44 px. A lista mede-se COMO ELA CHEGA AO LEITOR:
 * sem abrir gaveta nenhuma, porque o item 4 do brief manda a lista aberta.
 *
 * A6 · «Âmbito» E «Densidade» FORA DA PÁGINA. Contagem de ocorrências a 0 nas
 * duas edições, com as palavras de cada edição.
 *
 * A7 · AS DUAS LAGOAS COM DISTRITOS DISTINTOS. Nas fichas da busca de `/`,
 * as duas entradas cujo nome é «Lagoa» têm de trazer, cada uma, um texto
 * distinto do da outra. Não basta que exista um texto: dois textos iguais não
 * distinguem nada.
 *
 * A8 · A BUSCA COMO `<form>` COM DESTINO. Um `<form>` em `/`, com `action` para
 * um caminho que existe no `dist/` (pede-se ao servidor e espera-se 200) e com
 * `method="get"`, que é o que a torna uma busca e não uma escrita.
 *
 * A9 · ENCONTRAR O CONCELHO EM ≤ 2 TOQUES E ≤ 1 ECRÃ, a 390 × 664. O percurso
 * corre-se: toque 1 no campo, escreve-se o nome, toque 2 no resultado, e a
 * página que chega é a do concelho. Cada toque é um `click` a sério, e a régua
 * confere que o alvo do toque estava dentro do primeiro ecrã quando o toque
 * aconteceu.
 *
 * A10 · «sem limiar» FORA DOS CARTÕES. Contagem a 0 dentro dos cartões da faixa
 * e dentro das peças do painel de `/`, nas duas edições.
 *
 * A11 · A MOBÍLIA NUMA LINHA A 390. Do topo do documento ao topo do nome da
 * publicação: 64 px, que é o teto do brief.
 *
 * A12 · REGIÕES, DISTRITOS E ÁREAS NO MENU, nas duas edições. Procura-se pelo
 * `href` das rotas e não pelo texto: o texto é a etiqueta e pode mudar de
 * palavra sem que a porta mude de sítio.
 *
 * ---------------------------------------------------------------------------
 * AS QUATRO CÉLULAS DO F1.2b (03.09.2026)
 * ---------------------------------------------------------------------------
 * O bloco F1.2b abre três portas pequenas na primeira página e tira o selo de
 * dentro da manchete do domínio. As quatro medidas do seu brief §4 (E1, E2, E3
 * e E7) medem-se aqui, e não numa régua nova, porque as quatro são medidas
 * DESTA página e das páginas que ela abre, que é o que esta régua já mede. Os
 * seus estragos plantados (E6) entram na lista de `--vermelhos` desta mesma
 * régua, pela mesma razão: uma planta que tenha de derrubar uma célula tem de
 * viver ao pé da célula que derruba.
 *
 * A13 · O DESTINO DE CADA UM DOS 21 CARTÕES. Um cartão cuja linha pertence a um
 * domínio COM PÁGINA abre a leitura daquela medida na página do domínio; os
 * outros abrem a leitura breve desta página, como sempre. A régua não escreve a
 * lista dos que são de domínio: pergunta-a a `dominioDaLinha()`, que é a mesma
 * tabela que a vista usa, e compara CARTÃO A CARTÃO. Uma célula que contasse
 * «três apontam para fora» passava com os três errados. E cada destino tem de
 * responder: a página existe (200) e o `id` da âncora existe nela.
 *
 * O RÓTULO DO DESTINO ENTRA NA MESMA CÉLULA, e por três exigências: existe em
 * cada cartão que aponta para fora e em nenhum dos outros; tem caixa (um rótulo
 * de largura zero não é um rótulo); e NÃO SE SOBREPÕE ao selo daquele cartão,
 * com quem partilha a fila do pé. As três medem-se a 390, que é onde o cartão é
 * mais estreito.
 *
 * A14 · «DOMÍNIOS» NO MENU, nas duas edições, pelo `href` e não pelo texto (a
 * regra da A12), e com a página a responder 200.
 *
 * A15 · OS ESTUDOS A ≤ 1 TOQUE E ≤ 1,5 ECRÃS, a 390 × 664. As duas metades
 * medem-se, e nenhuma chega sozinha: a porta do menu está a um toque de
 * distância do menu, que abaixo de 640 px é um `<details>` fechado, e por isso
 * custa dois; a do rodapé está a um toque e a sete mil píxeis. A célula procura
 * a porta para `/estudos` que esteja MAIS ACIMA na página, sem contar as que
 * vivem dentro de um `<details>` fechado (que não se tocam sem abrir primeiro),
 * e mede o topo dela em ecrãs de 664 px. Depois toca-lhe, e a página que chega
 * tem de ser o arquivo.
 *
 * A16 · A MANCHETE SEM TEXTO DE SELO DENTRO DA FRASE, nas quatro camadas (o
 * país, o domínio, a região e o concelho) e nas duas edições. Mede-se pelo TEXTO
 * ACESSÍVEL do `<h1>`, que é o que um leitor de ecrã ouve, e a regra é
 * mecânica: o texto do `<h1>` com os selos retirados é a FRASE, e o texto
 * inteiro tem de COMEÇAR por ela. Um selo pelo meio parte a frase e o texto
 * inteiro deixa de começar por ela; um selo no fim não a parte. A célula exige
 * ainda que cada valor do livro-razão da manchete continue a ter o seu selo, e
 * é isso que impede que a maneira mais fácil de a passar seja tirar as portas.
 *
 * ---------------------------------------------------------------------------
 * O QUE `--vermelhos` EXIGE DE CADA ESTRAGO
 * ---------------------------------------------------------------------------
 * Três coisas, e não uma, como em `faixa.mjs` e em `lista.mjs`. **Verde antes**:
 * as células que o estrago nomeia passam sem ele, porque uma célula que já
 * estava vermelha não prova nada. **O HTML mudou**: a transformação dá bytes
 * diferentes, porque um estrago que não muda nada nunca podia ser apanhado.
 * **Vermelho depois**: TODAS as células nomeadas caem, e não só uma. É a
 * exigência que a segunda passagem de `faixa.mjs` ganhou depois da leitura a
 * frio de 01.09.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST
  ? path.resolve(process.env.OEDP_DIST)
  : path.join(RAIZ, 'dist');

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

const nav = await chromium.launch({ headless: true });

async function pagina(rota, largura, altura = 844) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: altura } });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

/* O HTML como o servidor o entrega, com o estrago aplicado quando há um: é o
   mesmo texto que o navegador lê, e por isso as contagens e a geometria falam
   da mesma página. */
async function html(rota) {
  const r = await fetch(base + rota);
  return await r.text();
}

const ocorrencias = (texto, agulha) => texto.split(agulha).length - 1;

const ALTURA_PEQUENA = 664;
const ALVO_TOQUE = 44;
const ALVO_PONTEIRO = 32;
const TETO_DA_MOBILIA = 64;
const LIMIAR_DA_COLUNA = 1024;

/* ---------------------------------------------------------------------------
 * O TETO DA ALTURA, MEDIDO NA ÁRVORE DE PARTIDA E ESCRITO AQUI (Major 8)
 * ---------------------------------------------------------------------------
 * A primeira redação da A2 só exigia que a altura fosse um número: imprimia o
 * valor e deixava a comparação para o relatório, que é onde ela tem os dois
 * lados. A leitura a frio apanhou-o — «A2 merely tests that height is finite,
 * not that it decreased» — e tem razão: uma medida de aceitação que não recusa
 * nada não é uma medida.
 *
 * O TETO É O «HOJE» MEDIDO ANTES DE MUDAR SEJA O QUE FOR, com esta mesma régua,
 * sobre a construção de `d8b14a88`, que é o ponto de partida deste ramo:
 *
 *     OEDP_DIST=<a construção de d8b14a88> node tests/inicio/porta.mjs
 *     A2.pt → 6941 px · A2.en → 6890 px
 *
 * Está escrito aqui e não no relatório porque é a régua que tem de o recusar. O
 * dia em que a página crescer acima disto, a célula fecha; o dia em que o teto
 * mudar de propósito, muda-se aqui, com a data e a medição ao lado.
 *
 * ---------------------------------------------------------------------------
 * O TETO SOBE 50 px A 03.09.2026, E SOBE EXACTAMENTE A ALTURA DA FILA NOVA
 * ---------------------------------------------------------------------------
 * O F1.2b põe a fila dos estudos logo a seguir à faixa (item 4 do brief), e o
 * brief diz o que ela pode custar: «a altura de `/` a 390 não sobe mais do que a
 * altura da fila dos estudos, medida e dita». A fila mede **50,0 px** nas duas
 * edições (a caixa de `.inicio-estudos`: 44 px de alvo e 6 px de ar por cima,
 * `margin: 0`), e a página subiu **exactamente 50 px** nas duas:
 *
 *     antes (a construção deste ramo, sem a fila)   `/` 6 909 · `/en` 6 861
 *     depois                                        `/` 6 959 · `/en` 6 911
 *
 * O teto sobe por isso 50 px e nem um a mais: 6 941 → 6 991 e 6 890 → 6 940. A
 * folga contra o teto continua a ser a mesma que o F1.1 deixou (32 px em `/` e
 * 29 px em `/en`), e é essa a razão de o subir assim: um teto que subisse «até
 * caber» apagava o que a folga diz. Nada mais deste bloco custa altura ao
 * telemóvel: o rótulo do destino senta-se na fila do selo (o cartão mede 163,0 px
 * em `/` e 181,7 px em `/en`, antes e depois), o «Domínios» do menu vive dentro
 * do `<details>` fechado, e a manchete do domínio ENCOLHEU 3,4 px com o selo
 * fora da frase. */
const TETO_DA_ALTURA = { pt: 6991, en: 6940 };

const EDICOES = [
  {
    chave: 'pt',
    rota: '/',
    comissao: 'Comissão Europeia',
    casa: ['Âmbito', 'Densidade'],
    semLimiar: 'sem limiar',
    menu: ['/regioes', '/distritos', '/areas'],
    concelho: 'Évora',
    destinoDoConcelho: '/municipios/evora',
    indiceDosConcelhos: '/municipios',
    /* As rotas que as células do F1.2b abrem. Escritas aqui e não compostas:
       esta régua lê o `dist/` e não a tabela de rotas do sítio, que é o que a
       torna capaz de ver um caminho que mudou sem ninguém dar por isso. */
    indiceDosDominios: '/dominios',
    dominio: '/dominios/economia-e-financas-publicas',
    estudos: '/estudos',
    regiao: '/regioes/alentejo',
    paginaDoConcelho: '/municipios/evora',
  },
  {
    chave: 'en',
    rota: '/en',
    comissao: 'European Commission',
    casa: ['Scope', 'Density'],
    semLimiar: 'no threshold',
    menu: ['/en/regions', '/en/districts', '/en/areas'],
    concelho: 'Évora',
    destinoDoConcelho: '/en/municipalities/evora',
    indiceDosConcelhos: '/en/municipalities',
    indiceDosDominios: '/en/domains',
    dominio: '/en/domains/economia-e-financas-publicas',
    estudos: '/en/studies',
    regiao: '/en/regions/alentejo',
    paginaDoConcelho: '/en/municipalities/evora',
  },
];

/* As 21 medidas dos dois quadros, lidas da própria fonte de dados do sítio e
   não de uma segunda lista escrita aqui: uma cópia da lista seria uma régua a
   medir o que ela própria escreveu. */
const { FIGURAS_PDM, FIGURAS_SOCIAL } = await import(
  path.join(RAIZ, 'src', 'data', 'figuras.mjs')
);
const AS_VINTE_E_UMA = [...FIGURAS_PDM, ...FIGURAS_SOCIAL].map((f) => f.claim);

/* A TABELA DO DESTINO, LIDA DA MESMA FONTE QUE A VISTA USA (A13). Uma segunda
   lista escrita aqui («estas três são de domínio») era a régua a medir o que ela
   própria escreveu: se a vista trocasse de domínio uma medida, as duas listas
   trocavam juntas e nada caía. O que a régua sabe é a REGRA (`dominioDaLinha`),
   e o que ela mede é o HTML construído contra ela. */
const { dominioDaLinha } = await import(path.join(RAIZ, 'src', 'lib', 'dominios.mjs'));

const ALTURA_DA_DOBRA = 1.5;

/* A rede de nomes, medida da mesma maneira em qualquer largura: uma função só,
   para que a leitura a 390 e a 768 não possam divergir por acaso. */
async function medeOsNomes(pg, alvo) {
  return await pg.evaluate((a) => {
    const ls = [...document.querySelectorAll('[data-lista-porta]')];
    const caixas = ls.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        slug: el.getAttribute('data-lista-porta'),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        vis: el.checkVisibility({
          contentVisibilityAuto: true,
          opacityProperty: true,
          visibilityProperty: true,
        }),
      };
    });
    return {
      total: caixas.length,
      pequenos: caixas.filter((c) => !c.vis || c.w < a || c.h < a),
      invisiveis: caixas.filter((c) => !c.vis).length,
    };
  }, alvo);
}

/* ===========================================================================
 * A SONDA DO PRIMEIRO ECRÃ · corre dentro da página
 * ======================================================================== */
const SONDA_A1 = (alturaDoEcra) => {
  const cx = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;
    return {
      topo: +r.top.toFixed(1),
      fundo: +r.bottom.toFixed(1),
      largura: +r.width.toFixed(1),
      altura: +r.height.toFixed(1),
    };
  };
  const cartoes = [...document.querySelectorAll('[data-faixa] .cartao')];
  const cartao = cartoes[0] ?? null;
  /* ---------------------------------------------------------------------------
     O SELO DE TODOS OS CARTÕES, E NÃO SÓ DO PRIMEIRO (Major 9)
     ---------------------------------------------------------------------------
     A primeira redação media o selo do PRIMEIRO cartão, porque é esse que a A1
     exige ver no primeiro ecrã. A leitura a frio apanhou o que isso deixava
     passar: «A missing seal is detected only on the first card; removing a later
     seal passes.» A promessa da casa é «onde aparece um valor, aparece o selo,
     sem exceção de página», e a faixa tem 21 valores.

     A caixa do selo mede-se, e não só a presença: um selo com caixa a zero é um
     selo que ninguém toca. A posição no primeiro ecrã continua a ser exigida só
     ao primeiro, que é o que a medida A1 diz. */
  const semSelo = cartoes
    .map((c) => {
      const s = c.querySelector('.src-chip');
      const r = s ? s.getBoundingClientRect() : null;
      return { id: c.getAttribute('data-cartao'), tem: !!s, w: r ? +r.width.toFixed(1) : 0 };
    })
    .filter((c) => !c.tem || c.w === 0);
  /* A MOBÍLIA EM LINHAS FÍSICAS, E NÃO SÓ EM PÍXEIS (Major 8). A célula media a
     abcissa do topo do nome, que diz quanto papel há por cima dele e não diz se
     esse papel é uma linha ou três. Conta-se agora quantas FILAS a barra ocupa,
     pelo número de topos distintos dos seus filhos visíveis, e o mesmo para a
     mobília de leituras que vive por baixo do nome. */
  const filas = (sel) => {
    const p = document.querySelector(sel);
    if (!p) return { filas: 0, itens: 0, altura: 0 };
    const vis = [...p.children].filter((e) =>
      e.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true }),
    );
    /* UMA FILA É UM GRUPO QUE SE SOBREPÕE NA VERTICAL, e não um conjunto de
       topos iguais. Medido antes de se escrever assim: a barra do menu alinha os
       filhos pela LINHA DE BASE (`align-items: baseline`), e um `<summary>` de
       44 px e uma ligação de 30,4 px na mesma fila têm topos diferentes por
       construção. Contar topos distintos dizia «duas filas» sobre uma barra de
       uma fila só, que é o contrário do que a célula quer saber. */
    const caixas = vis
      .map((e) => e.getBoundingClientRect())
      .sort((a, b) => a.top - b.top);
    let filas = 0;
    let fundo = -Infinity;
    for (const r of caixas) {
      if (r.top >= fundo - 1) filas += 1;
      fundo = Math.max(fundo, r.bottom);
    }
    return {
      filas,
      itens: vis.length,
      altura: +p.getBoundingClientRect().height.toFixed(1),
    };
  };
  return {
    nome: cx(document.querySelector('.wordmark')),
    manchete: cx(document.querySelector('.cabeca-h1')),
    cartao: cx(cartao),
    selo: cx(cartao ? cartao.querySelector('.src-chip') : null),
    porta: cx(document.querySelector('[data-porta-concelho]')),
    cartoes: cartoes.length,
    semSelo,
    ecra: alturaDoEcra,
    altura: document.documentElement.scrollHeight,
    mobilia: cx(document.querySelector('.wordmark'))
      ? +document.querySelector('.wordmark').getBoundingClientRect().top.toFixed(1)
      : null,
    barra: filas('.topbar'),
    leituras: filas('.masthead-furniture'),
  };
};

async function corre() {
  celulas = [];
  medidas = {};

  for (const ed of EDICOES) {
    /* -------------------------------------------------------------- A1, A2, A11 */
    const p = await pagina(ed.rota, 390, ALTURA_PEQUENA);
    const g = await p.evaluate(SONDA_A1, ALTURA_PEQUENA);
    medidas[`A1.${ed.chave}`] = g;

    const dentro = (c) => c !== null && c.topo >= 0 && c.fundo <= ALTURA_PEQUENA;
    const partes = { nome: g.nome, manchete: g.manchete, cartao: g.cartao, selo: g.selo, porta: g.porta };
    const falhas = Object.entries(partes)
      .filter(([, c]) => !dentro(c))
      .map(([k, c]) => (c === null ? `${k}: não existe` : `${k}: fundo ${c.fundo}`));
    conta(
      `A1.${ed.chave}`,
      falhas.length === 0 && g.cartoes === 21 && g.semSelo.length === 0,
      (falhas.length === 0
        ? `390×${ALTURA_PEQUENA}: nome, manchete, cartão, selo e porta do concelho dentro do ecrã ` +
          `(fundo máximo ${Math.max(...Object.values(partes).map((c) => c.fundo)).toFixed(1)} px)`
        : `fora do primeiro ecrã: ${falhas.join('; ')}`) +
        ` · ${g.cartoes} cartões, ${g.semSelo.length} sem selo com caixa` +
        (g.semSelo.length ? ` (${g.semSelo.map((c) => c.id).slice(0, 3).join(', ')})` : ''),
    );

    const teto = TETO_DA_ALTURA[ed.chave];
    medidas[`A2.${ed.chave}`] = { altura: g.altura, teto };
    conta(
      `A2.${ed.chave}`,
      Number.isFinite(g.altura) && g.altura <= teto,
      `altura de ${ed.rota} a 390: ${g.altura} px · teto medido na árvore de partida: ${teto} px` +
        ` (${g.altura <= teto ? `menos ${teto - g.altura}` : `MAIS ${g.altura - teto}`} px)`,
    );

    medidas[`A11.${ed.chave}`] = { acimaDoNome: g.mobilia, barra: g.barra, leituras: g.leituras };
    conta(
      `A11.${ed.chave}`,
      g.mobilia !== null &&
        g.mobilia <= TETO_DA_MOBILIA &&
        g.barra.filas === 1 &&
        g.leituras.filas === 1,
      `mobília acima do nome a 390: ${g.mobilia} px (teto ${TETO_DA_MOBILIA})` +
        ` · a barra em ${g.barra.filas} fila(s) com ${g.barra.itens} item(ns), ${g.barra.altura} px` +
        ` · as leituras por baixo do nome em ${g.leituras.filas} fila(s) com ${g.leituras.itens} à vista, ${g.leituras.altura} px`,
    );

    /* ------------------------------------------------------------------- A5 */
    /* A5 CORRE A 390 E A 768, E DIZ A REGRA DOS 32 PX (Major 8).
       A primeira redação media só a 390. A leitura a frio apanhou-o: «A5 samples
       only 390 px. The CSS gives map-name links 44 px below 1,024 but
       deliberately reduces them to 32 px at larger widths.» A redução é a regra
       da casa e não um descuido — a **Emenda 20c**, emendada pela decisão do
       diretor de 29.08.2026 (`DECISIONS.md` §1.84 e a I101): abaixo de 1024 a
       rede de nomes é o único alvo tocável das 29 unidades, e vale a regra do
       toque, 44 px; a partir de 1024 a lista é o índice do desenho para quem tem
       rato, e vale a regra do ponteiro, 32 px. A célula mede as duas larguras
       abaixo do limiar (390, o telemóvel, e 768, a tabuleta) com 44 px, e diz
       aqui porque é que 1024 e acima não entram nesta medida.
       ------------------------------------------------------------------------
       A VISIBILIDADE PERGUNTA-SE AO NAVEGADOR, E NÃO À CAIXA. Medido na árvore
       de partida: num Chromium 148 o conteúdo de um `<details>` FECHADO continua
       a ter caixa — `getBoundingClientRect()` devolve 54,1 × 44 nos 29 nomes de
       uma gaveta fechada —, porque a implementação nova esconde-o por
       `content-visibility` e não por `display`. Uma célula que contasse caixas
       dava verde com a lista fechada, que é exactamente o estado que este bloco
       veio abrir. `checkVisibility({ contentVisibilityAuto: true })` responde
       pelo que o leitor vê. */
    const nomes = await medeOsNomes(p, ALVO_TOQUE);
    medidas[`A5.${ed.chave}.390`] = nomes;
    const p768 = await pagina(ed.rota, 768, 900);
    const nomes768 = await medeOsNomes(p768, ALVO_TOQUE);
    medidas[`A5.${ed.chave}.768`] = nomes768;
    await p768.__ctx.close();
    conta(
      `A5.${ed.chave}`,
      nomes.total === 29 &&
        nomes.pequenos.length === 0 &&
        nomes768.total === 29 &&
        nomes768.pequenos.length === 0,
      `as 29 unidades com nome visível e alvo ≥ ${ALVO_TOQUE} px, sem gesto, abaixo de ${LIMIAR_DA_COLUNA} ` +
        `(a partir de ${LIMIAR_DA_COLUNA} a regra é ${ALVO_PONTEIRO} px, Emenda 20c): ` +
        `a 390 ${nomes.total} nome(s), ${nomes.invisiveis} invisível(eis), ${nomes.pequenos.length} fora do alvo; ` +
        `a 768 ${nomes768.total} nome(s), ${nomes768.invisiveis} invisível(eis), ${nomes768.pequenos.length} fora do alvo` +
        (nomes.pequenos.length || nomes768.pequenos.length
          ? ` (${[...nomes.pequenos, ...nomes768.pequenos]
              .slice(0, 3)
              .map((c) => `${c.slug} ${c.w}×${c.h}`)
              .join(', ')}…)`
          : ''),
    );
    await p.__ctx.close();



    /* -------------------------------------------------------- A3, A4, A6, A10 */
    const doc = await html(ed.rota === '/' ? '/index.html' : `${ed.rota}/index.html`);

    const repetidos = AS_VINTE_E_UMA.map((id) => ({
      id,
      n: ocorrencias(doc, `data-claim="${id}"`),
    })).filter((c) => c.n !== 1);
    medidas[`A3.${ed.chave}`] = {
      total: AS_VINTE_E_UMA.length,
      repetidos: repetidos.map((c) => `${c.id}×${c.n}`),
    };
    conta(
      `A3.${ed.chave}`,
      repetidos.length === 0,
      `os 21 valores selados uma só vez em ${ed.rota}: ${repetidos.length} fora da conta` +
        (repetidos.length ? ` (${repetidos.map((c) => `${c.id}×${c.n}`).join(', ')})` : ''),
    );

    /* ------------------------------------------------------------------------
       A COMISSÃO EM CADA UMA DAS DUAS FRASES, E NÃO NO DOCUMENTO (Major 9)
       ------------------------------------------------------------------------
       A primeira redação contava a cadeia no documento inteiro. A leitura a frio
       apanhou o que isso deixava passar: «Commission presence is counted
       anywhere in the document, not in each context sentence», e a planta P1
       provou-o — a frase do Procedimento perdeu a Comissão na fonte e a célula
       continuou verde, porque a frase do Painel Social ainda a tinha.

       A medida do brief é por frase: «as duas frases de contexto têm de nomear
       "Comissão Europeia" / "European Commission"». A célula lê os dois
       parágrafos pela marca que eles levam, `data-contexto-painel`, e exige a
       cadeia dentro de CADA um. A contagem no documento fica ao lado, para o
       relatório, e não decide nada. */
    const nComissao = ocorrencias(doc, ed.comissao);
    const p4 = await pagina(ed.rota, 1280, 900);
    const frases = await p4.evaluate(
      ({ palavra }) =>
        [...document.querySelectorAll('[data-contexto-painel]')].map((el) => ({
          painel: el.getAttribute('data-contexto-painel'),
          tem: (el.textContent ?? '').includes(palavra),
          texto: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60),
        })),
      { palavra: ed.comissao },
    );
    await p4.__ctx.close();
    const semComissao = frases.filter((f) => !f.tem);
    medidas[`A4.${ed.chave}`] = { noDocumento: nComissao, frases };
    conta(
      `A4.${ed.chave}`,
      frases.length === 2 && semComissao.length === 0,
      `«${ed.comissao}» em cada frase de contexto de ${ed.rota}: ${frases.length} frase(s), ` +
        `${semComissao.length} sem a Comissão` +
        (semComissao.length ? ` (${semComissao.map((f) => f.painel).join(', ')})` : '') +
        ` · no documento inteiro: ${nComissao}`,
    );

    const nCasa = ed.casa.map((w) => `${w}=${ocorrencias(doc, w)}`);
    const somaCasa = ed.casa.reduce((a, w) => a + ocorrencias(doc, w), 0);
    medidas[`A6.${ed.chave}`] = somaCasa;
    conta(`A6.${ed.chave}`, somaCasa === 0, `vocabulário da casa em ${ed.rota}: ${nCasa.join(' · ')}`);

    /* A10 mede DENTRO dos cartões e das peças, e não na página inteira: a
       palavra é legítima onde ela é a leitura de uma ausência escrita por
       extenso, e é ilegítima como estado de um cartão. */
    const p2 = await pagina(ed.rota, 390, 844);
    const semLimiar = await p2.evaluate((palavra) => {
      const conta = (sel) =>
        [...document.querySelectorAll(sel)].filter((el) =>
          (el.textContent ?? '').toLowerCase().includes(palavra.toLowerCase()),
        ).length;
      return { cartoes: conta('[data-faixa] .cartao'), pecas: conta('#painel .peca') };
    }, ed.semLimiar);
    medidas[`A10.${ed.chave}`] = semLimiar;
    conta(
      `A10.${ed.chave}`,
      semLimiar.cartoes === 0 && semLimiar.pecas === 0,
      `«${ed.semLimiar}» nos cartões e nas peças de ${ed.rota}: ` +
        `${semLimiar.cartoes} cartão(ões), ${semLimiar.pecas} peça(s)`,
    );

    /* ------------------------------------------------------------------- A7 */
    /* AS DUAS LAGOAS DIZEM QUAL É QUAL (Major 9). A primeira redação exigia dois
       textos DIFERENTES, e a leitura a frio apanhou-o: «Lagoa passes when the
       two complete texts differ for any reason, without checking Faro and São
       Miguel.» Dois textos diferentes por acaso não distinguem nada. A célula
       passa a exigir os dois lugares da Carta pelo nome: uma ficha traz «Faro»,
       a outra «São Miguel», e são fichas diferentes. */
    const lagoas = await p2.evaluate(() =>
      [...document.querySelectorAll('.pesquisa-item')]
        .filter((li) => (li.querySelector('.pesquisa-nome')?.textContent ?? '').trim() === 'Lagoa')
        .map((li) => (li.textContent ?? '').replace(/\s+/g, ' ').trim()),
    );
    const distintas = new Set(lagoas);
    const comFaro = lagoas.filter((t) => t.includes('Faro'));
    const comMiguel = lagoas.filter((t) => t.includes('São Miguel'));
    medidas[`A7.${ed.chave}`] = lagoas;
    conta(
      `A7.${ed.chave}`,
      lagoas.length === 2 &&
        distintas.size === 2 &&
        comFaro.length === 1 &&
        comMiguel.length === 1 &&
        comFaro[0] !== comMiguel[0],
      `as duas fichas de «Lagoa» em ${ed.rota}: ${lagoas.length} ficha(s), ` +
        `${distintas.size} texto(s) distinto(s), ${comFaro.length} com «Faro» e ` +
        `${comMiguel.length} com «São Miguel» [${lagoas.join(' | ')}]`,
    );

    /* ------------------------------------------------------------------- A12 */
    const menu = await p2.evaluate(() =>
      [...document.querySelectorAll('.nav-principal a')].map((a) => a.getAttribute('href')),
    );
    const emFalta = ed.menu.filter((h) => !menu.includes(h));
    medidas[`A12.${ed.chave}`] = { menu, emFalta };
    conta(
      `A12.${ed.chave}`,
      emFalta.length === 0,
      `regiões, distritos e áreas no menu de ${ed.rota}: ` +
        (emFalta.length ? `faltam ${emFalta.join(', ')}` : 'as três lá estão'),
    );
    await p2.__ctx.close();

    /* ------------------------------------------------------------------- A8 */
    const forms = [...doc.matchAll(/<form\b[^>]*>/g)].map((m) => m[0]);
    let destinoVivo = false;
    let action = null;
    let metodo = null;
    if (forms.length === 1) {
      action = /action="([^"]*)"/.exec(forms[0])?.[1] ?? null;
      metodo = /method="([^"]*)"/.exec(forms[0])?.[1] ?? null;
      if (action) {
        const r = await fetch(base + action);
        destinoVivo = r.status === 200;
      }
    }
    medidas[`A8.${ed.chave}`] = { formularios: forms.length, action, metodo, destinoVivo };
    conta(
      `A8.${ed.chave}`,
      forms.length === 1 && destinoVivo && String(metodo).toLowerCase() === 'get',
      `<form> em ${ed.rota}: ${forms.length}; action «${action}» ` +
        `(${destinoVivo ? '200' : 'não responde 200'}); method «${metodo}»`,
    );

    /* ------------------------------------------------------------------- A9 */
    const p3 = await pagina(ed.rota, 390, ALTURA_PEQUENA);
    let toques = 0;
    let dentroDoEcra = true;
    let chegou = null;
    try {
      const campo = await p3.$('[data-pesquisa]');
      if (campo) {
        const c1 = await campo.boundingBox();
        dentroDoEcra = dentroDoEcra && c1 !== null && c1.y >= 0 && c1.y + c1.height <= ALTURA_PEQUENA;
        await campo.click();
        toques += 1;
        await campo.type(ed.concelho);
        await p3.waitForTimeout(120);
        const res = await p3.$(
          `.pesquisa-item:not([hidden]) a[href="${ed.destinoDoConcelho}"]`,
        );
        if (res) {
          const c2 = await res.boundingBox();
          dentroDoEcra =
            dentroDoEcra && c2 !== null && c2.y >= 0 && c2.y + c2.height <= ALTURA_PEQUENA;
          await Promise.all([p3.waitForNavigation({ waitUntil: 'load' }), res.click()]);
          toques += 1;
          chegou = new URL(p3.url()).pathname.replace(/\/$/, '');
        }
      }
    } catch (e) {
      chegou = `erro: ${e.message}`;
    }
    const alvo = ed.destinoDoConcelho.replace(/\/$/, '');
    await p3.__ctx.close();

    /* ------------------------------------------------------------------------
       O MESMO PERCURSO SEM GUIÃO, PELA SUBMISSÃO NATIVA (Major 9)
       ------------------------------------------------------------------------
       A leitura a frio: «A9 exercises the JavaScript autocomplete, not native
       form submission.» O caminho de cima é o do leitor com guião, e é o que a
       medida do brief conta em toques; este é o do leitor sem guião, e é o que
       a promessa do item 12 sustenta. Corre com `javaScriptEnabled: false`,
       escreve no campo e carrega em Enter, que é a submissão que o navegador
       faz sozinho: o formulário tem de levar ao índice dos 308, com o que foi
       escrito no endereço, e a página que chega tem de existir. */
    const ctxSemGuiao = await nav.newContext({
      viewport: { width: 390, height: ALTURA_PEQUENA },
      javaScriptEnabled: false,
    });
    const pg = await ctxSemGuiao.newPage();
    await pg.goto(base + ed.rota, { waitUntil: 'load' });
    let semGuiao = null;
    try {
      await pg.fill('[data-pesquisa]', ed.concelho);
      await Promise.all([
        pg.waitForNavigation({ waitUntil: 'load' }),
        pg.press('[data-pesquisa]', 'Enter'),
      ]);
      const u = new URL(pg.url());
      semGuiao = {
        caminho: u.pathname.replace(/\/$/, ''),
        query: u.search,
        titulo: await pg.title(),
      };
    } catch (e) {
      semGuiao = { caminho: `erro: ${e.message.split('\n')[0]}`, query: '', titulo: '' };
    }
    await ctxSemGuiao.close();
    const indice = ed.indiceDosConcelhos.replace(/\/$/, '');

    medidas[`A9.${ed.chave}`] = { toques, dentroDoEcra, chegou, semGuiao };
    conta(
      `A9.${ed.chave}`,
      toques <= 2 &&
        chegou === alvo &&
        dentroDoEcra &&
        semGuiao.caminho === indice &&
        semGuiao.query.includes('concelho='),
      `com guião, a partir de ${ed.rota}: ${toques} toque(s), ` +
        `${dentroDoEcra ? 'sem rolar' : 'com rolar'}, chegou a «${chegou ?? 'lado nenhum'}»` +
        ` · sem guião, pela submissão nativa: «${semGuiao.caminho}${semGuiao.query}»`,
    );

    /* ------------------------------------------------------------------ A13
       O DESTINO DE CADA UM DOS 21 CARTÕES (F1.2b, item 1)
       ------------------------------------------------------------------------
       Cartão a cartão, e não por contagem. Para cada um pergunta-se à tabela do
       sítio se a sua linha pertence a um domínio com página: se pertencer, o
       `href` tem de ser a página desse domínio (e a âncora daquela medida); se
       não, tem de ser uma âncora DESTA página. E os dois destinos têm de
       responder: a âncora existe no documento, e a página do domínio responde
       200 com o `id` lá dentro. Um destino que não abre nada é pior do que
       nenhum. */
    const pCartoes = await pagina(ed.rota, 390, ALTURA_PEQUENA);
    const cartoes = await pCartoes.evaluate(() => {
      const ancoras = new Set([...document.querySelectorAll('[id]')].map((el) => el.id));
      const cruza = (a, b) =>
        !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
      return [...document.querySelectorAll('[data-faixa] [data-cartao]')].map((c) => {
        /* O RÓTULO DO DESTINO SENTA-SE NA MESMA CÉLULA DA GRELHA QUE O SELO, no
           outro extremo dela, para não custar uma fila ao cartão. Os dois têm de
           caber lado a lado: um rótulo por cima de um selo seria a etiqueta a
           comer a porta, e uma célula que só contasse rótulos não o via. */
        const rot = c.querySelector('.cartao-destino');
        const selo = c.querySelector('.src-chip');
        const cx = (el) => (el ? el.getBoundingClientRect() : null);
        const rr = cx(rot);
        const rs = cx(selo);
        return {
          id: c.getAttribute('data-cartao'),
          href: c.querySelector('.cartao-porta')?.getAttribute('href') ?? null,
          rotulo: (rot?.textContent ?? '').trim() || null,
          rotuloComCaixa: !!rr && rr.width > 0 && rr.height > 0,
          rotuloSobreOSelo: !!(rr && rs) && cruza(rr, rs),
          ancoraLocal: ancoras.has(
            String(c.querySelector('.cartao-porta')?.getAttribute('href') ?? '').replace(/^#/, ''),
          ),
        };
      });
    });
    await pCartoes.__ctx.close();

    /* As páginas de destino lêem-se uma vez, e não uma vez por cartão. */
    const idsDaPaginaDoDominio = await (async () => {
      const doc = await html(`${ed.dominio}/index.html`);
      return new Set([...doc.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    })();

    const errados = [];
    for (const c of cartoes) {
      const dominio = dominioDaLinha(c.id);
      if (dominio) {
        const esperado = `${ed.dominio}#${dominio.ancora}`;
        if (c.href !== esperado) errados.push(`${c.id}: «${c.href}» ≠ «${esperado}»`);
        else if (!idsDaPaginaDoDominio.has(dominio.ancora))
          errados.push(`${c.id}: a âncora «${dominio.ancora}» não existe na página do domínio`);
        else if (!c.rotulo) errados.push(`${c.id}: aponta ao domínio e não diz para onde leva`);
        else if (!c.rotuloComCaixa) errados.push(`${c.id}: o rótulo do destino não tem caixa`);
        else if (c.rotuloSobreOSelo)
          errados.push(`${c.id}: o rótulo do destino sobrepõe-se ao selo do cartão`);
      } else {
        if (c.href !== `#m-${c.id}`) errados.push(`${c.id}: «${c.href}» ≠ «#m-${c.id}»`);
        else if (!c.ancoraLocal) errados.push(`${c.id}: a âncora «m-${c.id}» não existe nesta página`);
        else if (c.rotulo) errados.push(`${c.id}: não é de domínio nenhum e traz rótulo de destino`);
      }
    }
    const paraODominio = cartoes.filter((c) => dominioDaLinha(c.id));
    medidas[`A13.${ed.chave}`] = { cartoes, errados, paraODominio: paraODominio.length };
    conta(
      `A13.${ed.chave}`,
      cartoes.length === AS_VINTE_E_UMA.length && paraODominio.length > 0 && errados.length === 0,
      `o destino dos cartões de ${ed.rota}: ${cartoes.length} cartão(ões), ` +
        `${paraODominio.length} para a página do domínio ` +
        `(${paraODominio.map((c) => c.id).join(', ') || 'nenhum'}), ` +
        `${cartoes.length - paraODominio.length} para a leitura breve desta página · ` +
        (errados.length ? `errados: ${errados.slice(0, 4).join(' · ')}` : 'nenhum errado'),
    );

    /* ------------------------------------------------------------------ A14
       «DOMÍNIOS» NO MENU (F1.2b, item 2)
       ------------------------------------------------------------------------
       Pelo `href` e não pelo texto, que é a regra que a A12 já escreve: o texto
       é a etiqueta e pode mudar de palavra sem que a porta mude de sítio. E o
       destino tem de responder 200: uma porta no menu para uma página que não
       foi construída é pior do que nenhuma. */
    const pMenu = await pagina(ed.rota, 390, ALTURA_PEQUENA);
    const menuDominios = await pMenu.evaluate(() =>
      [...document.querySelectorAll('.nav-principal a')].map((a) => a.getAttribute('href')),
    );
    await pMenu.__ctx.close();
    const temDominios = menuDominios.includes(ed.indiceDosDominios);
    const respostaDoIndice = temDominios
      ? (await fetch(base + ed.indiceDosDominios)).status
      : null;
    medidas[`A14.${ed.chave}`] = { menu: menuDominios, temDominios, respostaDoIndice };
    conta(
      `A14.${ed.chave}`,
      temDominios && respostaDoIndice === 200,
      `«${ed.indiceDosDominios}» no menu de ${ed.rota}: ` +
        (temDominios
          ? `lá está, e a página responde ${respostaDoIndice}`
          : `NÃO está (o menu tem ${menuDominios.length} portas)`),
    );

    /* ------------------------------------------------------------------ A15
       OS ESTUDOS A ≤ 1 TOQUE E ≤ 1,5 ECRÃS (F1.2b, item 4)
       ------------------------------------------------------------------------
       As duas metades, e nenhuma chega sozinha. Uma porta dentro de um
       `<details>` fechado não se toca sem abrir primeiro, e por isso não conta
       como um toque: a célula deita fora as que estão lá dentro antes de medir,
       e é essa a razão pela qual a porta do menu não passava esta medida. Do que
       fica, mede-se a que está MAIS ACIMA, em píxeis de documento e em ecrãs de
       664 px, e depois toca-se-lhe: a página que chega tem de ser o arquivo. */
    const pEstudos = await pagina(ed.rota, 390, ALTURA_PEQUENA);
    const portasDosEstudos = await pEstudos.evaluate((alvo) => {
      const fechado = (el) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          if (p.tagName === 'DETAILS' && !p.open) return true;
        }
        return false;
      };
      return [...document.querySelectorAll('a')]
        .filter((a) => a.getAttribute('href') === alvo)
        .map((a) => {
          const r = a.getBoundingClientRect();
          return {
            dentroDeGavetaFechada: fechado(a),
            topo: +(r.top + window.scrollY).toFixed(1),
            altura: +r.height.toFixed(1),
            largura: +r.width.toFixed(1),
          };
        });
    }, ed.estudos);
    const alcancaveis = portasDosEstudos
      .filter((x) => !x.dentroDeGavetaFechada && x.largura > 0 && x.altura > 0)
      .sort((a, b) => a.topo - b.topo);
    const primeira = alcancaveis[0] ?? null;
    const ecras = primeira ? +(primeira.topo / ALTURA_PEQUENA).toFixed(2) : null;
    let chegouAoArquivo = null;
    if (primeira) {
      await pEstudos.evaluate(
        (alvo) =>
          [...document.querySelectorAll('a')]
            .filter((a) => a.getAttribute('href') === alvo)
            .sort(
              (a, b) =>
                a.getBoundingClientRect().top + window.scrollY -
                (b.getBoundingClientRect().top + window.scrollY),
            )[0]
            .scrollIntoView({ block: 'center' }),
        ed.estudos,
      );
      await Promise.all([
        pEstudos.waitForNavigation({ waitUntil: 'load' }),
        pEstudos.click(`a[href="${ed.estudos}"]:visible`),
      ]);
      chegouAoArquivo = new URL(pEstudos.url()).pathname.replace(/\/$/, '');
    }
    await pEstudos.__ctx.close();
    const alvoDoArquivo = ed.estudos.replace(/\/$/, '');
    medidas[`A15.${ed.chave}`] = {
      portas: portasDosEstudos,
      alcancaveis: alcancaveis.length,
      topo: primeira?.topo ?? null,
      ecras,
      chegouAoArquivo,
    };
    conta(
      `A15.${ed.chave}`,
      !!primeira &&
        ecras !== null &&
        ecras <= ALTURA_DA_DOBRA &&
        primeira.altura >= ALVO_TOQUE &&
        chegouAoArquivo === alvoDoArquivo,
      `«${ed.estudos}» a partir de ${ed.rota}, a 390 × ${ALTURA_PEQUENA}: ` +
        `${portasDosEstudos.length} porta(s) no documento, ${alcancaveis.length} tocável(eis) sem abrir gaveta` +
        (primeira
          ? ` · a mais acima a ${primeira.topo} px (${ecras} ecrã(s), teto ${ALTURA_DA_DOBRA}),` +
            ` alvo ${primeira.largura}×${primeira.altura} px · um toque chegou a «${chegouAoArquivo}»`
          : ' · nenhuma alcançável num toque'),
    );

    /* ------------------------------------------------------------------ A16
       A MANCHETE SEM TEXTO DE SELO DENTRO DA FRASE (F1.2b, item 3)
       ------------------------------------------------------------------------
       As quatro camadas: o país, o domínio, a região e o concelho. A regra é
       mecânica e não uma leitura: o texto do `<h1>` com os selos retirados é a
       FRASE, e o texto inteiro tem de COMEÇAR por ela. Um selo pelo meio parte a
       frase e a comparação cai; um selo no fim não a parte.

       E CADA VALOR CONTINUA A TER O SEU SELO. Sem esta segunda metade, a maneira
       mais fácil de passar a célula era tirar as portas da manchete, que é
       exactamente o contrário do que o bloco quer. */
    const manchetes = [];
    for (const [camada, rota] of [
      ['pais', ed.rota],
      ['dominio', ed.dominio],
      ['regiao', ed.regiao],
      ['concelho', ed.paginaDoConcelho],
    ]) {
      const pg = await pagina(rota, 390, ALTURA_PEQUENA);
      const r = await pg.evaluate(() => {
        const h1 = document.querySelector('[data-grelha] h1');
        if (!h1) return null;
        const norma = (t) => String(t ?? '').replace(/\s+/g, ' ').trim();
        const inteiro = norma(h1.textContent);
        const copia = h1.cloneNode(true);
        for (const selo of copia.querySelectorAll('.src-chip')) selo.remove();
        const frase = norma(copia.textContent);
        return {
          inteiro,
          frase,
          selos: h1.querySelectorAll('.src-chip').length,
          valores: h1.querySelectorAll('[data-claim]').length,
          semSelo: [...h1.querySelectorAll('[data-claim]')].filter(
            (v) => !v.parentElement?.querySelector('.src-chip'),
          ).length,
        };
      });
      await pg.__ctx.close();
      manchetes.push({ camada, rota, ...(r ?? {}) });
    }
    const partidas = manchetes.filter((m) => !m.frase || !m.inteiro.startsWith(m.frase));
    const orfaos = manchetes.filter((m) => (m.semSelo ?? 0) > 0);
    medidas[`A16.${ed.chave}`] = { manchetes, partidas: partidas.map((m) => m.camada) };
    conta(
      `A16.${ed.chave}`,
      manchetes.length === 4 &&
        manchetes.every((m) => !!m.frase) &&
        partidas.length === 0 &&
        orfaos.length === 0,
      `a manchete das quatro camadas em ${ed.chave}, pelo texto acessível do <h1>: ` +
        manchetes
          .map((m) => `${m.camada} ${m.selos ?? 0} selo(s) fora da frase`)
          .join(' · ') +
        (partidas.length
          ? ` · SELO DENTRO DA FRASE em ${partidas.map((m) => `${m.camada} («${(m.inteiro ?? '').slice(0, 60)}…»)`).join(', ')}`
          : '') +
        (orfaos.length ? ` · valores sem selo em ${orfaos.map((m) => m.camada).join(', ')}` : ''),
    );
  }
}

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS (A17 do brief)
 * ======================================================================== */
const PLANTAS = [
  {
    nome: 'um cartão sem selo (o último, e não o primeiro)',
    celulas: ['A1.pt'],
    /* O ÚLTIMO E NÃO O PRIMEIRO (Major 9). A planta da primeira passagem tirava
       o selo do primeiro cartão, que é o único que a A1 exigia ver; a leitura a
       frio mostrou que tirar o selo de um cartão de trás passava. Com a célula a
       medir os 21, a planta muda de alvo para o provar. */
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h
        : (() => {
            const i = h.lastIndexOf('<li class="cartao"');
            if (i < 0) return h;
            const cabeca = h.slice(0, i);
            const cauda = h.slice(i).replace(/<a class="src-chip"[\s\S]*?<\/a>/, '');
            return cabeca + cauda;
          })(),
  },
  {
    nome: 'um segundo cartão com o mesmo valor (a cópia)',
    celulas: ['A3.pt'],
    /* Repõe uma segunda rendição do valor da dívida pública dentro do painel,
       que é exactamente a cópia que o bloco veio tirar. */
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h
        : h.replace(
            /<div class="painel"/,
            '<p class="peca-valor claim-value" data-claim="divida-publica-2025">96,4</p><div class="painel"',
          ),
  },
  {
    nome: 'a frase do Procedimento sem «Comissão Europeia» (a outra frase fica com ela)',
    celulas: ['A4.pt', 'A4.en'],
    /* A PLANTA MUDOU PARA A FORMA QUE A PRIMEIRA CÉLULA DEIXAVA PASSAR (Major 9,
       e a planta P1 da leitura a frio). Tira a Comissão SÓ da frase do
       Procedimento, e deixa-a na do Painel Social: a célula que contava a cadeia
       no documento inteiro continuava verde, e a que a exige em cada frase cai. */
    f: (h, rota) => {
      const palavra = rota.startsWith('/en') ? 'European Commission' : 'Comissão Europeia';
      const troca = rota.startsWith('/en') ? 'European Board' : 'Junta Europeia';
      const i = h.indexOf('data-contexto-painel="pdm"');
      if (i < 0) return h;
      const fim = h.indexOf('</p>', i);
      if (fim < 0) return h;
      return h.slice(0, i) + h.slice(i, fim).split(palavra).join(troca) + h.slice(fim);
    },
  },
  {
    nome: 'a busca sem `action`',
    celulas: ['A8.pt', 'A8.en', 'A9.pt', 'A9.en'],
    /* A PLANTA PASSOU A NOMEAR TAMBÉM A A9 (Major 9): sem `action` a submissão
       nativa volta para a própria página, e o percurso sem guião morre. É o
       defeito que a planta P4 da leitura a frio plantou na página construída, e
       que só a A8 via. */
    f: (h) => h.replace(/(<form\b[^>]*?)\saction="[^"]*"/g, '$1'),
  },
  {
    nome: 'uma unidade do mapa sem nome',
    celulas: ['A5.pt', 'A5.en'],
    /* Tira a ligação de UMA unidade da lista dos nomes: fica com 28. */
    f: (h) => h.replace(/<li><a href="[^"]*" data-lista-porta="[^"]*">[^<]*<\/a><\/li>/, ''),
  },
  {
    nome: 'a página mais alta do que a árvore de partida',
    celulas: ['A2.pt', 'A2.en'],
    /* A2 SÓ EXIGIA UM NÚMERO (Major 8), e a planta P3 da leitura a frio mostrou
       que o relatório podia dizer um valor e a régua outro sem nada cair. Com o
       teto medido escrito na régua, uma página que cresça acima dele fecha a
       célula, e esta planta prova-o: mil píxeis de papel no fim do corpo. */
    f: (h) => h.replace(/<\/body>/, '<div style="height:1000px"></div></body>'),
  },
  /* -------------------------------------------------------------------------
     AS QUATRO PLANTAS DO F1.2b (E6 do brief, 03.09.2026)
     -------------------------------------------------------------------------
     Uma por porta, e cada uma é o defeito que o bloco veio fechar, reposto no
     HTML servido: o cartão do domínio a apontar à linha, o menu sem
     «Domínios», os estudos a mais de 1,5 ecrãs, e o selo de volta dentro da
     manchete do domínio.

     A ÚLTIMA MEXE NUMA PÁGINA QUE NÃO É A PRIMEIRA, e por isso traz `rotas`: a
     conferência de «o html mudou» lia só os dois `index.html` das duas edições,
     e uma planta que só toca na página do domínio passava por planta sem plantar
     nada. É a mesma regra da própria régua («um estrago que não muda nada nunca
     podia ser apanhado»), alargada às páginas que as células novas abrem. */
  {
    nome: 'um cartão do domínio a apontar à linha desta página',
    celulas: ['A13.pt', 'A13.en'],
    /* Repõe o destino antigo no cartão da dívida pública: uma âncora desta
       página, que é o que ele era antes deste bloco. A âncora existe, e por isso
       a planta não passa por acaso: o que cai é a comparação com a tabela. */
    f: (h) =>
      h.replace(
        /href="[^"]*\/dominios\/economia-e-financas-publicas#m-e3"|href="[^"]*\/en\/domains\/economia-e-financas-publicas#m-e3"/,
        'href="#m-divida-publica-2025"',
      ),
  },
  {
    nome: 'o menu sem «Domínios»',
    celulas: ['A14.pt', 'A14.en'],
    /* Tira a posição dos domínios da fila do menu, e deixa as outras onze. A
       fila é uma corrida de `<a>` dentro de `.nav-principal`, sem `<li>` pelo
       meio: o que se tira é a âncora, e é o `href` que a nomeia. */
    f: (h) => h.replace(/<a href="(\/dominios|\/en\/domains)"[^>]*>[^<]*<\/a>/, ''),
  },
  {
    nome: 'os estudos a mais de 1,5 ecrãs (a fila depois da faixa escondida)',
    celulas: ['A15.pt', 'A15.en'],
    /* Esconde a fila dos estudos. O arquivo continua a ter porta na página (o
       menu e o rodapé), e é isso que a planta prova: com a fila fora, a porta
       mais acima que se toca sem abrir uma gaveta é a do rodapé, a sete mil
       píxeis, e a medida do brief («≤ 1,5 ecrãs») cai. */
    f: (h) => h.replace(/<p class="inicio-estudos"/, '<p class="inicio-estudos" style="display:none"'),
  },
  {
    nome: 'o selo de volta dentro da manchete do domínio',
    celulas: ['A16.pt', 'A16.en'],
    rotas: [
      '/dominios/economia-e-financas-publicas/index.html',
      '/en/domains/economia-e-financas-publicas/index.html',
    ],
    /* Tira o bloco dos selos do fim do `<h1>` e mete-o de volta a seguir ao
       primeiro valor, que é onde ele estava antes deste bloco: a manchete volta
       a ler-se «89,7%fonte · Quadro institucional… do PIB». Nenhuma porta se
       perde, e é isso que faz a planta valer: o que cai é a ORDEM, e não a
       presença. */
    f: (h, rota) => {
      if (!rota.includes('dominios') && !rota.includes('domains')) return h;
      const i = h.indexOf('<span class="manchete-selos">');
      if (i < 0) return h;
      const j = h.indexOf('</h1>', i);
      if (j < 0) return h;
      const selos = h.slice(i, j);
      const sem = h.slice(0, i) + h.slice(j);
      const v = sem.indexOf('data-claim=');
      if (v < 0) return h;
      const fim = sem.indexOf('</span>', v);
      if (fim < 0) return h;
      return sem.slice(0, fim + 7) + selos + sem.slice(fim + 7);
    },
  },
  {
    nome: 'a mobília do menu em duas filas',
    celulas: ['A11.pt', 'A11.en'],
    /* A11 MEDIA A ABCISSA DO NOME (Major 8), e não se a barra é uma linha. Esta
       planta parte a barra em duas filas sem lhe mudar a altura total acima do
       nome, que é exactamente o caso que a primeira redação deixava passar. */
    f: (h) =>
      h.replace(
        /<\/head>/,
        '<style>.topbar{flex-wrap:wrap}.topbar>.nav-idioma{flex-basis:100%}</style></head>',
      ),
  },
];

/* ========================================================================= */
await corre();
const verdeInicial = celulas.every((c) => c.passa);
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
    const verdeAntes = planta.celulas.every((n) => porNome.get(n)?.passa);
    /* O HTML tem de mudar: um `replace` que falha em silêncio é o modo mais
       comum de um estrago não ser estrago nenhum. */
    let mudou = false;
    /* AS ROTAS QUE A PLANTA TOCA, E NÃO SÓ AS DUAS PRIMEIRAS PÁGINAS (F1.2b,
       03.09.2026). A conferência lia sempre `/index.html` e `/en/index.html`, e
       uma planta que só mexa na página do domínio dava «html mudou: NÃO» com o
       estrago a funcionar. Por defeito continuam a ser as duas primeiras
       páginas, que é o que todas as plantas anteriores tocam. */
    const rotasDaPlanta =
      planta.rotas ?? EDICOES.map((ed) => (ed.rota === '/' ? '/index.html' : `${ed.rota}/index.html`));
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
          `verde antes: ${verdeAntes ? 'sim' : 'NÃO'} · html mudou: ${mudou ? 'sim' : 'NÃO'} · ` +
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
  `  porta ${todas ? verde('✓') : vermelho('✗')} ${celulas.filter((c) => c.passa).length} de ${celulas.length} célula(s)` +
    (VERMELHOS ? ` · plantas ${plantasOk ? verde('✓') : vermelho('✗')}` : '') +
    cinza(`  ${DIST}`),
);

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(
    FICHEIRO_JSON,
    JSON.stringify({ dist: DIST, celulas, medidas, plantasOk: VERMELHOS ? plantasOk : null }, null, 2),
  );
}

await nav.close();
servidor.close();
process.exit(todas && (!VERMELHOS || plantasOk) ? 0 : 1);
