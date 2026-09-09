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
 * A5 · A GAVETA DOS NOMES ABRE COM UM TOQUE, E OS 29 ESTÃO LÁ COM ALVO E PORTA.
 * Abaixo de 1024, um toque no `<summary>` da gaveta «Os nomes no mapa» abre-a, e
 * lá dentro as 29 unidades da Carta têm cada uma um nome visível, um alvo de
 * 44 × 44 px e uma porta para a sua página, que responde.
 *
 * A EXPECTATIVA «VISÍVEL EM REPOUSO» RETIROU-SE, e a razão escreve-se
 * (decisão do lugar de direção, 09.09.2026, sobre o F1.10). A célula nasceu com
 * o F1.1, que mandava a lista dos nomes ABERTA: «o item 4 do brief manda a lista
 * aberta», porque abaixo de 1 024 nenhuma das 29 áreas do desenho chegava aos
 * 44 px pelo quadrado inscrito (I82) e a rede de nomes era o único alvo que
 * respondia por elas. O F1.1d e o F1.1e mudaram esse facto e a decisão que dele
 * saía: «A lista aberta dos 29 nomes sai; fica uma lista fechada como
 * alternativa sem guião» (`BRIEF-F1.1d-os-nomes-do-mapa.md`, §0), e «sem guião
 * as unidades são ligações para as suas páginas com a lista fechada dos nomes
 * por baixo» (`BRIEF-F1.1e-os-distritos-voltam-ao-mapa.md`, §0). O nome de uma
 * unidade aparece agora no lugar fixo ao passar, ao focar ou ao tocar, e a lista
 * voltou a ser o que o nome dela diz: o índice do desenho.
 *
 * Uma célula que continuasse a exigir os 29 nomes VISÍVEIS EM REPOUSO media o
 * que o bloco anterior queria e não o que os dois blocos seguintes decidiram: é
 * a régua a contradizer a decisão em vez de a medir. O que fica medido é o que
 * a decisão promete a quem não tem rato nem guião: que a gaveta se abre com um
 * toque, que os 29 lá estão com o alvo do toque, e que cada um leva à sua
 * página. O alvo de 44 px dentro da gaveta é a exigência do lugar de direção de
 * 09.09.2026: os briefs do F1.1d e do F1.1e fixam os 44 px para as áreas
 * desenhadas e não escrevem nada sobre os nomes da gaveta, e a decisão fecha o
 * silêncio pelo lado do leitor.
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
 * e dentro das leituras breves de `/`, nas duas edições, e as duas coleções com
 * elementos: uma contagem de zero sobre uma coleção vazia não prova nada. O
 * segundo seletor era `#painel .peca` e passou a `#painel [data-leitura]` a
 * 04.09.2026, quando a grelha das peças saiu da primeira página e a área de
 * leitura entrou no lugar dela.
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
 * A13 · O DESTINO DE CADA UM DOS 21 CARTÕES DA FAIXA DA CABEÇA. Os 21 fazem o
 * mesmo: cada um abre a leitura breve daquela medida NESTA página, em `#m-<id>`,
 * e a âncora existe. Nenhum leva para fora, e por isso nenhum traz o rótulo do
 * destino.
 *
 * A EXCEÇÃO SAIU (F1.1c, segunda passagem, 07.09.2026). Até aqui a célula
 * aceitava três cartões com um segundo destino, a página do domínio, que é o que
 * o F1.2b (item 1) lhes tinha dado. A decisão (7) da §1.99 pôs as leituras dos
 * três inteiras na primeira página com a porta «Ver no domínio →» acrescentada,
 * e o mandato do F1.1c é que um toque num cartão abre a leitura daquele cartão:
 * um cartão que muda de página quebrava a promessa em três dos 21 (Blocking 2 da
 * leitura a frio do Codex de 07.09).
 *
 * O QUE A CÉLULA MEDIA CONTINUA MEDIDO, no sítio para onde a porta se mudou: a
 * leitura de uma medida cuja linha pertence a um domínio COM PÁGINA acrescenta a
 * porta para lá, com a âncora daquela medida, e a âncora existe na página de
 * chegada. A régua não escreve a lista dos que são de domínio: pergunta-a a
 * `dominioDaLinha()`, que é a mesma tabela que a vista usa, e compara MEDIDA A
 * MEDIDA. Uma célula que contasse «três levam porta» passava com os três
 * errados.
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
 * A17 · O «n DE N» DE CADA FAIXA, nas quatro camadas e nas duas edições: uma
 * posição por cartão, o total igual ao número de cartões DAQUELA FAIXA (contado
 * no HTML dela), o ordinal a correr de 1 a N dentro dela, e os dois algarismos
 * com o motivo `numeracao` declarado. É a célula que recusa uma faixa de região
 * a dizer «de 21». Lia a página inteira e passou a ler faixa a faixa a
 * 04.09.2026, quando a primeira página passou a ter duas.
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
import { chromium, webkit } from 'playwright';

/* A DECLARAÇÃO DAS DEFINIÇÕES DOS DOIS PAINÉIS (F1.10, item 8.4, 08.09.2026). A
   célula A4 compara o que a página rende com o que a declaração diz, e por isso
   lê-a: os dois lados da comparação deixam de ser o mesmo texto escrito duas
   vezes na régua. */
import { DEFINICAO_DOS_PAINEIS } from '../../src/data/figuras.mjs';

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

/**
 * O DEDO É UM APONTADOR GROSSO, E UMA CÉLULA QUE MEDE UM ALVO DE TOQUE TEM DE O
 * DIZER AO NAVEGADOR (F1.10, 08.09.2026)
 * ---------------------------------------------------------------------------
 * A folha desta casa dá os 44 px de alvo dentro de `@media (pointer: coarse)`,
 * que é a regra certa: num cursor uma ligação de barra não cresce, e crescer ali
 * empurrava linhas. Um Chromium com `viewport` e mais nada declara um apontador
 * FINO, e por isso essa regra nunca valia nesta régua: a A15 media o alvo da
 * porta dos estudos em 30,4 px e falhava por uma altura que o telemóvel dá.
 * Medido nos dois: 57,9 × 27,2 px com o apontador fino e 57,9 × 44,0 px com o
 * grosso, na mesma construção e na mesma largura.
 *
 * `toque` NÃO É O DEFEITO desta função, e é de propósito: as células da
 * geometria (A1, A2, A11) medem a COMPOSIÇÃO, e a composição é a mesma nos dois
 * apontadores menos nas alturas de alvo, que não são o que elas medem. Quem pede
 * o apontador grosso é a célula que mede um alvo de toque, e é a A15. A mesma
 * decisão está tomada em `tests/inicio/correcoes-a.mjs`, que corre as suas
 * células de telemóvel com `devices['iPhone 13']`.
 *
 * @param {string} rota
 * @param {number} largura
 * @param {number} [altura]
 * @param {{ toque?: boolean }} [opcoes]
 */
async function pagina(rota, largura, altura = 844, opcoes = {}) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: altura },
    ...(opcoes.toque ? { hasTouch: true, isMobile: true } : {}),
  });
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
/**
 * ---------------------------------------------------------------------------
 * A MOBÍLIA TEM DOIS TETOS, UM POR EDIÇÃO (F1.10, item 8.9, decisão do lugar de
 * direção de 09.09.2026)
 * ---------------------------------------------------------------------------
 * O teto do brief é 64 px, e a edição portuguesa cumpre-o numa fila (62 px,
 * medido na quinta sessão). A inglesa não cabe, e a conta está feita ao píxel: a
 * barra mede 354 px a 390; o comando de abertura mede 55,7 e a goteira 10, e as
 * duas goteiras da fila 20, o que deixa **268,3 px** para as três etiquetas; e as
 * três etiquetas inglesas medem, a 12 px com o entreletra da casa,
 * **311,3 px** («Municipalities» 105,4 + «Studies» 53,4 + «Numbers and sources»
 * 152,5). Faltam 43,0 px, e a contração que o brief autoriza («Numbers &
 * sources») fecha 18,8 dos 43: ficavam 24,2 por fechar.
 *
 * A DECISÃO É DO LUGAR DE DIREÇÃO, PELA DELEGAÇÃO DA §1.98: as etiquetas
 * inglesas ficam fiéis («Municipalities», «Studies», «Numbers and sources») —
 * não se encurta o nome que o diretor escolheu para a página dos números — e o
 * corpo não desce abaixo dos 12 px que a regra A9 fixou para o telemóvel. A
 * edição inglesa aceita DUAS FILAS a 390, e o teto dela é a altura medida dessas
 * duas filas: **95,2 px**. Uma terceira fila fica vermelha, que é o que este
 * número existe para impedir.
 *
 * O DIRETOR PODE REABRIR ISTO com um nome inglês mais curto para a página dos
 * números: com ele, a fila inglesa cabe numa linha e o teto volta a ser um só.
 */
const TETO_DA_MOBILIA = { pt: 64, en: 95.2 };
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
 * O TETO É UMA REGRA E NÃO UM SEGUNDO NÚMERO ESCRITO (Minor 11 da leitura a
 * frio, segunda passagem, 03.09.2026)
 * ---------------------------------------------------------------------------
 * O F1.2b põe a fila dos estudos logo a seguir à faixa (item 4 do brief), e o
 * brief diz o que ela pode custar: «a altura de `/` a 390 não sobe mais do que a
 * altura da fila dos estudos, medida e dita».
 *
 * A PRIMEIRA REDAÇÃO SUBIU O TETO À MÃO, de 6 941 para 6 991, e a leitura a frio
 * apanhou o que isso estragava: a régua corrida sobre a ÁRVORE DE PARTIDA
 * passava a guardar no seu JSON o teto NOVO, e a linha de partida deixava de
 * provar o teto que estava em vigor no dia dela.
 *
 * O TETO PASSA A SER o teto da partida MAIS a altura da fila dos estudos medida
 * na construção que se está a ler. Na árvore de partida a fila não existe, a
 * parcela é 0 e o teto é 6 941; nesta a fila mede 50,0 px (a caixa de
 * `.inicio-estudos`: 44 px de alvo e 6 px de ar por cima, `margin: 0`) e o teto
 * é 6 991. Não há um segundo número escrito à mão, cada lado guarda o teto que o
 * governa, e a regra é a frase do brief posta em código: nem um píxel além do
 * que a fila mede.
 *
 * A FOLGA CONTINUA A SER A QUE O F1.1 DEIXOU (32 px em `/` e 29 px em `/en`), e
 * é essa a razão de a regra ser esta: um teto que subisse «até caber» apagava o
 * que a folga diz. Nada mais deste bloco custa altura ao telemóvel: o rótulo do
 * destino senta-se na fila do selo (o cartão mede 163,0 px em `/` e 181,7 px em
 * `/en`, antes e depois), o «Domínios» do menu vive dentro do `<details>`
 * fechado, e a manchete do domínio ENCOLHEU com o selo fora da frase. */
const TETO_DA_PARTIDA = { pt: 6941, en: 6890 };

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
    /* A PÁGINA DOS DOIS QUADROS DA UNIÃO (F1.10, item 8.16, 08.09.2026). Os 21
       cartões e as suas leituras saíram da primeira página para aqui, e com eles
       saíram as células que os medem: a A3 (os 21 valores uma só vez), a A4 (a
       Comissão em cada frase de contexto), a A10 («sem limiar» fora dos cartões)
       e a A13 (o destino de cada um dos 21). O que a A1 mede continua a ser a
       primeira página, que é onde o primeiro ecrã do telemóvel é. */
    painel: '/uniao-europeia',
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
    painel: '/en/european-union',
  },
];

/* As 21 medidas dos dois quadros, lidas da própria fonte de dados do sítio e
   não de uma segunda lista escrita aqui: uma cópia da lista seria uma régua a
   medir o que ela própria escreveu. */
const { FIGURAS_PDM, FIGURAS_SOCIAL } = await import(
  path.join(RAIZ, 'src', 'data', 'figuras.mjs')
);
const AS_VINTE_E_UMA = [...FIGURAS_PDM, ...FIGURAS_SOCIAL].map((f) => f.claim);

/* OS CARTÕES DA FAIXA DA PRIMEIRA PÁGINA, LIDOS DA DECLARAÇÃO DO DOMÍNIO (F1.10,
   item 8.16, 08.09.2026). Eram os 21 dos dois quadros da União; passaram a ser
   as medidas de cabeça dos domínios vivos, e a vista compõe a lista da mesma
   declaração. Um número escrito aqui («cinco») ficava errado no dia em que um
   domínio novo ficasse vivo, e é exactamente o que esta célula não pode fazer. */
const { FAIXA_DO_DOMINIO_1 } = await import(path.join(RAIZ, 'src', 'data', 'dominios.mjs'));
const CARTOES_DA_CABECA = FAIXA_DO_DOMINIO_1.length;

/* A TABELA DO DESTINO, LIDA DA MESMA FONTE QUE A VISTA USA (A13). Uma segunda
   lista escrita aqui («estas três são de domínio») era a régua a medir o que ela
   própria escreveu: se a vista trocasse de domínio uma medida, as duas listas
   trocavam juntas e nada caía. O que a régua sabe é a REGRA (`dominioDaLinha`),
   e o que ela mede é o HTML construído contra ela. */
const { dominioDaLinha } = await import(path.join(RAIZ, 'src', 'lib', 'dominios.mjs'));

/* AS CADEIAS DA CASA, LIDAS DA FONTE DO SÍTIO (Minor 12, segunda passagem). As
   células que conferem PALAVRAS comparam-nas com o que `src/i18n/strings.mjs`
   declara, e nunca com uma cópia escrita aqui: uma régua que escrevesse a
   palavra estaria a medir o que ela própria disse. */
const { t } = await import(path.join(RAIZ, 'src', 'i18n', 'strings.mjs'));

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

/**
 * UM TOQUE NO COMANDO DA GAVETA DOS NOMES, e diz se ela ficou aberta.
 *
 * É um toque a sério (`click` sobre o `<summary>`), e não um `open = true`
 * escrito por fora: o que a célula A5 promete é que quem não tem rato nem guião
 * chega aos 29 nomes com UM gesto, e um estado forçado não prova gesto nenhum.
 */
async function abreAGaveta(pg) {
  const cmd = pg.locator('[data-gaveta="nomes"] > summary');
  if ((await cmd.count()) !== 1) return false;
  await cmd.click();
  return await pg.evaluate(
    () => document.querySelector('[data-gaveta="nomes"]')?.hasAttribute('open') ?? false,
  );
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
  /* OS DA FAIXA DA CABEÇA À PARTE (F1.1b, 04.09.2026). A primeira página passou a
     ter duas faixas — a da cabeça, com os 21 cartões dos dois quadros, e a do
     domínio, na secção que entrou a seguir ao mapa. A medida A1 é sobre os 21, e
     é essa contagem que a célula exige; a exigência do SELO fica sobre TODOS os
     cartões da página, que é o que a promessa da casa diz («onde aparece um
     valor, aparece o selo, sem exceção de página»). */
  const daCabeca = [...document.querySelectorAll('[data-grelha] [data-faixa] .cartao')];
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
  /* ---------------------------------------------------------------------------
     QUANTAS LINHAS TEM A FRASE DA MANCHETE (item 8.15, 08.09.2026)
     ---------------------------------------------------------------------------
     «No telemóvel a manchete do país fica com no máximo dois algarismos selados
     e cabe em três linhas, medido.» A altura da caixa não diz o número de
     linhas: diz a altura, e a altura muda com o corpo do tipo. Contam-se as
     linhas como o motor as desenha, com um `Range` sobre a FRASE — e a frase é o
     `<h1>` sem os selos, que vivem numa fila própria por baixo dela e não são
     texto da manchete.

     A CONTAGEM É DE LINHAS, E O TOPO NÃO AS DISTINGUE (corrigido a 08.09.2026,
     no mesmo item). A primeira redação contava TOPOS DISTINTOS, e isso conta a
     mais: a frase da manchete corre no tipo de leitura e os dois algarismos
     correm no tipo de instrumento, que tem outra métrica, e na MESMA linha o
     rectângulo do algarismo começa 4 px abaixo do rectângulo da prosa. Medido em
     `/` a 390 px: a manchete tem rectângulos nos topos 189, 193, 225 e 229, que
     são DUAS linhas (189 com 193, 225 com 229) e não quatro. A célula dizia
     cinco linhas em `/` e seis em `/en` numa manchete que tinha três e quatro, e
     um teto medido com uma conta errada é um teto que não se cumpre nunca.

     A CONTA CERTA É PELO CENTRO DE CADA RECTÂNGULO, com a tolerância tirada da
     própria medição: dois rectângulos estão na mesma linha quando os centros
     distam menos de metade da menor altura de rectângulo da frase. Na mesma
     medição, os centros da mesma linha distam 1 px e os de linhas seguidas
     distam 36; a menor altura é 33, e a tolerância 16,5. Nenhum número está
     escrito aqui: os dois saem do que o motor desenhou. */
  const linhasDaFrase = (() => {
    const h1 = document.querySelector('.cabeca-h1');
    if (!h1) return 0;
    const selos = h1.querySelector('.manchete-selos');
    const r = document.createRange();
    r.selectNodeContents(h1);
    if (selos) r.setEndBefore(selos);
    const caixas = [...r.getClientRects()].filter((x) => x.width > 0 && x.height > 0);
    if (!caixas.length) return 0;
    const tolerancia = Math.min(...caixas.map((x) => x.height)) / 2;
    const centros = caixas.map((x) => x.top + x.height / 2).sort((a, b) => a - b);
    let linhas = 1;
    let doDaLinha = centros[0];
    for (const c of centros.slice(1)) {
      if (c - doDaLinha > tolerancia) {
        linhas++;
        doDaLinha = c;
      }
    }
    return linhas;
  })();
  return {
    nome: cx(document.querySelector('.wordmark')),
    manchete: cx(document.querySelector('.cabeca-h1')),
    linhasDaManchete: linhasDaFrase,
    cartao: cx(cartao),
    selo: cx(cartao ? cartao.querySelector('.src-chip') : null),
    porta: cx(document.querySelector('[data-porta-concelho]')),
    cartoes: cartoes.length,
    cartoesDaCabeca: daCabeca.length,
    semSelo,
    ecra: alturaDoEcra,
    altura: document.documentElement.scrollHeight,
    /* A CAIXA DA FILA DOS ESTUDOS, para o teto da A2 se calcular em vez de se
       escrever. Zero quando a fila não existe, que é o caso da árvore de
       partida. */
    filaDosEstudos: (() => {
      const f = document.querySelector('.inicio-estudos');
      if (!f) return 0;
      const r = f.getBoundingClientRect();
      const e = getComputedStyle(f);
      return +(r.height + parseFloat(e.marginTop) + parseFloat(e.marginBottom)).toFixed(1);
    })(),
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
    /* O TETO DAS LINHAS DA MANCHETE (item 8.15). Três, medidas em Chromium e em
       WebKit, nas duas edições; o teto está escrito uma vez e não por edição. */
    const TETO_DAS_LINHAS = 3;
    conta(
      `A1.${ed.chave}`,
      falhas.length === 0 &&
        g.cartoesDaCabeca === CARTOES_DA_CABECA &&
        g.semSelo.length === 0 &&
        g.linhasDaManchete > 0 &&
        g.linhasDaManchete <= TETO_DAS_LINHAS,
      (falhas.length === 0
        ? `390×${ALTURA_PEQUENA}: nome, manchete, cartão, selo e porta do concelho dentro do ecrã ` +
          `(fundo máximo ${Math.max(...Object.values(partes).map((c) => c.fundo)).toFixed(1)} px)`
        : `fora do primeiro ecrã: ${falhas.join('; ')}`) +
        ` · a manchete em ${g.linhasDaManchete} linha(s) (teto ${TETO_DAS_LINHAS}), ` +
        `${g.manchete ? g.manchete.altura : 0} px de altura` +
        ` · ${g.cartoesDaCabeca} cartões na cabeça (${g.cartoes} na página, ` +
        `${CARTOES_DA_CABECA} declarados pelo domínio), ${g.semSelo.length} sem selo com caixa` +
        (g.semSelo.length ? ` (${g.semSelo.map((c) => c.id).slice(0, 3).join(', ')})` : ''),
    );

    const tetoDaPartida = TETO_DA_PARTIDA[ed.chave];
    const teto = tetoDaPartida + Math.round(g.filaDosEstudos);
    medidas[`A2.${ed.chave}`] = {
      altura: g.altura,
      teto,
      tetoDaPartida,
      filaDosEstudos: g.filaDosEstudos,
    };
    conta(
      `A2.${ed.chave}`,
      Number.isFinite(g.altura) && g.altura <= teto,
      `altura de ${ed.rota} a 390: ${g.altura} px · teto ${teto} px ` +
        `(${tetoDaPartida} da árvore de partida + ${g.filaDosEstudos} da fila dos estudos)` +
        ` (${g.altura <= teto ? `menos ${teto - g.altura}` : `MAIS ${g.altura - teto}`} px)`,
    );

    /* A SEGUNDA METADE DA CÉLULA MUDA DE NÚMERO COM O ITEM 8.11 (F1.10,
       08.09.2026). Exigia UMA fila de leituras por baixo do nome a 390, que era
       a folha a mostrar ali uma das quatro. As quatro saíram do cabeçalho de
       todas as páginas e foram para a página da medida e para o Método: por
       baixo do nome não fica leitura nenhuma, e a caixa da mobília não se
       desenha abaixo de 640 (o seu único filho, o controlo do tema, vive dentro
       do menu). A célula passa a exigir ZERO filas, que é o que o item manda, e
       continua a imprimir a altura para que uma caixa vazia com fio se veja no
       número em vez de passar despercebida. */
    medidas[`A11.${ed.chave}`] = { acimaDoNome: g.mobilia, barra: g.barra, leituras: g.leituras };
    /* AS FILAS DA BARRA SÃO DUAS POR EDIÇÃO, E É A MESMA DECISÃO (item 8.9): uma
       em português, duas em inglês. O número da barra é o que o teto mede, e
       por isso a célula pede as duas coisas ao mesmo par. */
    const tetoDaMobilia = TETO_DA_MOBILIA[ed.chave];
    const filasDaBarra = ed.chave === 'pt' ? 1 : 2;
    conta(
      `A11.${ed.chave}`,
      g.mobilia !== null &&
        g.mobilia <= tetoDaMobilia &&
        g.barra.filas === filasDaBarra &&
        g.leituras.filas === 0 &&
        g.leituras.altura === 0,
      `mobília acima do nome a 390: ${g.mobilia} px (teto ${tetoDaMobilia})` +
        ` · a barra em ${g.barra.filas} fila(s) com ${g.barra.itens} item(ns), ${g.barra.altura} px` +
        ` (esta edição cabe em ${filasDaBarra})` +
        ` · as leituras por baixo do nome em ${g.leituras.filas} fila(s) com ${g.leituras.itens} à vista, ${g.leituras.altura} px (o item 8.11 exige 0 e 0)`,
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
    const antes = await medeOsNomes(p, ALVO_TOQUE);
    const abriu390 = await abreAGaveta(p);
    const nomes = await medeOsNomes(p, ALVO_TOQUE);
    medidas[`A5.${ed.chave}.390`] = { antes, abriu: abriu390, depois: nomes };
    const p768 = await pagina(ed.rota, 768, 900);
    const abriu768 = await abreAGaveta(p768);
    const nomes768 = await medeOsNomes(p768, ALVO_TOQUE);
    medidas[`A5.${ed.chave}.768`] = { abriu: abriu768, depois: nomes768 };
    await p768.__ctx.close();
    /* CADA NOME LEVA À SUA PÁGINA, e o destino confere-se contra o que a Carta
       diz: a porta de uma unidade é `/distritos/<slug>` na edição portuguesa e
       `/en/districts/<slug>` na inglesa, com o mesmo slug que a marca declara. A
       página pede-se ao servidor: uma porta que não abre não é uma porta. */
    const portas = await p.evaluate(() =>
      [...document.querySelectorAll('[data-lista-porta]')].map((a) => ({
        slug: a.getAttribute('data-lista-porta'),
        href: (a.getAttribute('href') ?? '').split('#')[0],
      })),
    );
    const prefixo = ed.chave === 'pt' ? '/distritos/' : '/en/districts/';
    const forasDoSitio = portas.filter((x) => x.href !== `${prefixo}${x.slug}`);
    let semResposta = 0;
    for (const x of portas) {
      const r = await fetch(base + x.href);
      if (!r.ok) semResposta++;
    }
    conta(
      `A5.${ed.chave}`,
      abriu390 &&
        abriu768 &&
        antes.total === 29 &&
        antes.invisiveis === 29 &&
        nomes.total === 29 &&
        nomes.pequenos.length === 0 &&
        nomes768.total === 29 &&
        nomes768.pequenos.length === 0 &&
        portas.length === 29 &&
        forasDoSitio.length === 0 &&
        semResposta === 0,
      `a gaveta dos nomes abre com um toque e leva as 29 unidades com alvo ≥ ${ALVO_TOQUE} px, ` +
        `abaixo de ${LIMIAR_DA_COLUNA} (a partir de ${LIMIAR_DA_COLUNA} a regra é ${ALVO_PONTEIRO} px, ` +
        `Emenda 20c): em repouso ${antes.total} nome(s), ${antes.invisiveis} invisível(eis) ` +
        `(a gaveta chega fechada, F1.1d/F1.1e); a 390 abriu ${abriu390}, ${nomes.total} nome(s), ` +
        `${nomes.pequenos.length} fora do alvo; a 768 abriu ${abriu768}, ${nomes768.total} nome(s), ` +
        `${nomes768.pequenos.length} fora do alvo; ${portas.length} porta(s), ` +
        `${forasDoSitio.length} fora de «${prefixo}», ${semResposta} sem resposta` +
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
    /* AS CÉLULAS DOS 21 LEEM A PÁGINA ONDE OS 21 ESTÃO (F1.10, item 8.16). Os
       dois quadros da União saíram da primeira página para «Portugal na União
       Europeia», e uma régua que continuasse a contá-los aqui contava zero numa
       coleção vazia, que é a regra 14 da casa a ser quebrada dentro da própria
       régua. O que muda é a pasta que ela lê; o teste é o mesmo. */
    const docDoPainel = await html(`${ed.painel}/index.html`);

    const repetidos = AS_VINTE_E_UMA.map((id) => ({
      id,
      n: ocorrencias(docDoPainel, `data-claim="${id}"`),
    })).filter((c) => c.n !== 1);
    medidas[`A3.${ed.chave}`] = {
      total: AS_VINTE_E_UMA.length,
      repetidos: repetidos.map((c) => `${c.id}×${c.n}`),
    };
    conta(
      `A3.${ed.chave}`,
      repetidos.length === 0,
      `os 21 valores selados uma só vez em ${ed.painel}: ${repetidos.length} fora da conta` +
        (repetidos.length ? ` (${repetidos.map((c) => `${c.id}×${c.n}`).join(', ')})` : ''),
    );

    /* ------------------------------------------------------------------------
       A DEFINIÇÃO DE CADA PAINEL, CARÁCTER A CARÁCTER (F1.10, item 8.4)
       ------------------------------------------------------------------------
       A CÉLULA MUDOU DE MEDIDA A 08.09.2026, E A RAZÃO ESCREVE-SE. Ela exigia
       «Comissão Europeia» dentro de cada uma das duas frases de contexto, porque
       essas frases diziam contra que documento da Comissão a casa tinha
       confirmado os valores. **Essas duas frases saíram** (§9.3 do brief, sobre a
       leitura cruzada do inventário): a Emenda 15 não deixa a página do leitor
       falar do trabalho da casa. No lugar delas está a DEFINIÇÃO de cada painel,
       e as duas definições não têm o mesmo publicador: a do Procedimento sai da
       página da Comissão sobre o painel e nomeia-a; a do Painel Social sai da
       página do Eurostat sobre o Pilar. Continuar a exigir a mesma cadeia nas
       duas era exigir que a segunda dissesse o que a sua origem não diz.

       A MESMA COMPARAÇÃO ENTROU NO `verify` A 08.09.2026, e a razão é que esta
       célula abre um navegador e não corre em portão nenhum: foi escrita num dia
       e não foi corrida nesse dia. O lugar de direção decidiu que ela entra no
       `verify` ou que a razão de não entrar fica escrita, e a comparação entrou:
       `scripts/check-lugar.mjs` faz o mesmo teste sobre o HTML construído
       (medida «8.4 · definições de painel fora da declaração», com a conferência
       de que os quatro parágrafos existem, e com duas plantas que a fazem morder).
       ESTA CÉLULA FICA, e não é uma cópia: mede o mesmo com a página composta e
       as folhas aplicadas, que é o que um navegador acrescenta a um ficheiro.

       O QUE A CÉLULA MEDE AGORA é mais apertado do que o que media: cada
       parágrafo `data-contexto-painel` tem de render, CARÁCTER A CARÁCTER, a
       definição que `DEFINICAO_DOS_PAINEIS` declara para aquele painel naquela
       edição. Uma frase reescrita à mão na vista cai; uma frase que perca a
       Comissão cai; uma frase que troque de painel cai. A contagem da Comissão no
       documento fica ao lado, para o relatório, e não decide nada. */
    const nComissao = ocorrencias(docDoPainel, ed.comissao);
    const declaradas = Object.fromEntries(
      Object.entries(DEFINICAO_DOS_PAINEIS).map(([chave, d]) => [
        chave,
        d[ed.chave].join('').replace(/\s+/g, ' ').trim(),
      ]),
    );
    const p4 = await pagina(ed.painel, 1280, 900);
    const frases = await p4.evaluate(
      ({ esperado }) =>
        [...document.querySelectorAll('[data-contexto-painel]')].map((el) => {
          const painel = el.getAttribute('data-contexto-painel') ?? '';
          const texto = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
          return { painel, texto, tem: texto === esperado[painel] };
        }),
      { esperado: declaradas },
    );
    await p4.__ctx.close();
    const fora = frases.filter((f) => !f.tem);
    medidas[`A4.${ed.chave}`] = { noDocumento: nComissao, frases, declaradas };
    conta(
      `A4.${ed.chave}`,
      frases.length === 2 && fora.length === 0,
      `a definição declarada de cada painel em ${ed.painel}: ${frases.length} frase(s), ` +
        `${fora.length} diferente(s) da declaração` +
        (fora.length ? ` (${fora.map((f) => `${f.painel}: «${f.texto.slice(0, 50)}»`).join('; ')})` : '') +
        ` · «${ed.comissao}» no documento inteiro: ${nComissao}`,
    );

    const nCasa = ed.casa.map((w) => `${w}=${ocorrencias(doc, w)}`);
    const somaCasa = ed.casa.reduce((a, w) => a + ocorrencias(doc, w), 0);
    medidas[`A6.${ed.chave}`] = somaCasa;
    conta(`A6.${ed.chave}`, somaCasa === 0, `vocabulário da casa em ${ed.rota}: ${nCasa.join(' · ')}`);

    /* A10 mede DENTRO dos cartões e das peças, e não na página inteira: a
       palavra é legítima onde ela é a leitura de uma ausência escrita por
       extenso, e é ilegítima como estado de um cartão.

       A SEGUNDA METADE MUDOU DE SELETOR COM A COISA QUE ELA MEDE (F1.1b,
       04.09.2026). Media `#painel .peca`, que era a grelha das treze peças; a
       grelha saiu da primeira página e no seu lugar está a área de leitura, com
       um `<details data-leitura>` por medida. Deixar o seletor antigo era a
       régua a contar zero numa página onde já não há nada daquela forma: uma
       contagem de zero sobre uma coleção vazia não prova coisa nenhuma (a regra
       14 da casa), e a palavra podia voltar dentro de uma leitura sem nada
       cair. Conta-se onde a leitura agora vive.

       AS DUAS COLEÇÕES TÊM DE TER ELEMENTOS, e isso é a outra metade da mesma
       regra: uma célula que passe por não encontrar nada é uma célula cega. */
    const p2 = await pagina(ed.painel, 390, 844);
    const semLimiar = await p2.evaluate((palavra) => {
      const conta = (sel) =>
        [...document.querySelectorAll(sel)].filter((el) =>
          (el.textContent ?? '').toLowerCase().includes(palavra.toLowerCase()),
        ).length;
      return {
        cartoes: conta('[data-faixa] .cartao'),
        pecas: conta('#painel [data-leitura]'),
        nCartoes: document.querySelectorAll('[data-faixa] .cartao').length,
        nLeituras: document.querySelectorAll('#painel [data-leitura]').length,
      };
    }, ed.semLimiar);
    medidas[`A10.${ed.chave}`] = semLimiar;
    conta(
      `A10.${ed.chave}`,
      semLimiar.cartoes === 0 &&
        semLimiar.pecas === 0 &&
        semLimiar.nCartoes > 0 &&
        semLimiar.nLeituras > 0,
      `«${ed.semLimiar}» nos cartões e nas leituras de ${ed.painel}: ` +
        `${semLimiar.cartoes} de ${semLimiar.nCartoes} cartão(ões), ` +
        `${semLimiar.pecas} de ${semLimiar.nLeituras} leitura(s)`,
    );

    await p2.__ctx.close();

    /* ------------------------------------------------------------- A7 e A12 */
    /* AS DUAS CÉLULAS LEEM A PÁGINA QUE O SEU TEXTO NOMEIA (09.09.2026).
       ------------------------------------------------------------------------
       Estavam as duas a ler `p2`, que até ao item 8.16 era a primeira página e
       passou a ser «Portugal na União Europeia» quando os 21 cartões mudaram de
       casa. O texto das duas continuou a dizer «em /» e «no menu de /», e a A7
       ficou a contar fichas de busca numa página que não tem busca nenhuma:
       vermelha desde então, e não por causa do sítio. A A12 passava, porque o
       menu é o mesmo em todas as páginas, e por isso o defeito só se via numa
       delas. As duas passam a abrir a página que dizem, e a A7 exige que a
       coleção tenha as 308 fichas antes de procurar as duas Lagoas: contar zero
       Lagoas numa lista vazia é a régua a dormir (regra 14 da casa).

       AS DUAS LAGOAS DIZEM QUAL É QUAL (Major 9). A primeira redação exigia dois
       textos DIFERENTES, e a leitura a frio apanhou-o: «Lagoa passes when the
       two complete texts differ for any reason, without checking Faro and São
       Miguel.» Dois textos diferentes por acaso não distinguem nada. A célula
       exige os dois lugares da Carta pelo nome: uma ficha traz «Faro», a outra
       «São Miguel», e são fichas diferentes. O distrito nas fichas dos homónimos
       é o item 7 do `BRIEF-F1.1-porta-da-frente.md`, e continua a valer: o
       F1.1d e o F1.1e não lhe tocaram («nenhuma mudança à manchete, à faixa, às
       leituras ou à busca», §2 dos dois briefs). */
    const pBusca = await pagina(ed.rota, 390, 844);
    const busca = await pBusca.evaluate(() => {
      const itens = [...document.querySelectorAll('.pesquisa-item')];
      return {
        total: itens.length,
        lagoas: itens
          .filter((li) => (li.querySelector('.pesquisa-nome')?.textContent ?? '').trim() === 'Lagoa')
          .map((li) => (li.textContent ?? '').replace(/\s+/g, ' ').trim()),
      };
    });
    const lagoas = busca.lagoas;
    const distintas = new Set(lagoas);
    const comFaro = lagoas.filter((x) => x.includes('Faro'));
    const comMiguel = lagoas.filter((x) => x.includes('São Miguel'));
    medidas[`A7.${ed.chave}`] = busca;
    conta(
      `A7.${ed.chave}`,
      busca.total > 2 &&
        lagoas.length === 2 &&
        distintas.size === 2 &&
        comFaro.length === 1 &&
        comMiguel.length === 1 &&
        comFaro[0] !== comMiguel[0],
      `as duas fichas de «Lagoa» na busca de ${ed.rota}: ${busca.total} ficha(s) na lista, ` +
        `${lagoas.length} com o nome «Lagoa», ${distintas.size} texto(s) distinto(s), ` +
        `${comFaro.length} com «Faro» e ${comMiguel.length} com «São Miguel» [${lagoas.join(' | ')}]`,
    );

    const menu = await pBusca.evaluate(() =>
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
    await pBusca.__ctx.close();

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
       nenhum.

       A FAIXA DA CABEÇA, E NÃO TODAS AS FAIXAS DA PÁGINA (F1.1b, 04.09.2026).
       Desde 04.09 a primeira página tem DUAS faixas: a da cabeça, com os 21
       cartões dos dois quadros, e a do domínio, na secção que entrou a seguir ao
       mapa, com as medidas de cabeça daquele domínio. Esta célula é sobre os 21
       — «o destino de cada um dos 21 cartões» —, e por isso lê a faixa que está
       DENTRO da cabeça (`[data-grelha]`, a marca da grelha da cabeça, a mesma
       por que a régua da faixa a encontra). Sem o recorte a célula contava 23 e
       caía por uma razão que não é a dela; com o recorte continua a exigir os 21
       e continua a comparar cartão a cartão. O destino dos cartões da faixa do
       domínio é medido pela célula J5 de `tests/inicio/leitura.mjs`, que é a
       régua do bloco que os pôs lá. */
    /* A FAIXA DOS 21 MUDOU DE PÁGINA (F1.10, item 8.16, 08.09.2026), e a célula
       vai com ela: os 21 vivem em «Portugal na União Europeia», onde a faixa é a
       única da página e não precisa do recorte da grelha da cabeça. */
    const pCartoes = await pagina(ed.painel, 390, ALTURA_PEQUENA);
    const cartoes = await pCartoes.evaluate(() => {
      const ancoras = new Set([...document.querySelectorAll('[id]')].map((el) => el.id));
      return [...document.querySelectorAll('[data-faixa] [data-cartao]')].map((c) => ({
        id: c.getAttribute('data-cartao'),
        href: c.querySelector('.cartao-porta')?.getAttribute('href') ?? null,
        /* O RÓTULO DO DESTINO NÃO PODE ESTAR EM NENHUM DOS 21 (07.09.2026).
           Ele diz «este cartão leva para fora desta página», e nenhum leva. */
        rotulo: (c.querySelector('.cartao-destino')?.textContent ?? '').trim() || null,
        ancoraLocal: ancoras.has(
          String(c.querySelector('.cartao-porta')?.getAttribute('href') ?? '').replace(/^#/, ''),
        ),
      }));
    });
    /* A PORTA DENTRO DA LEITURA, que é para onde a porta do domínio se mudou.
       Lê-se na mesma página e na mesma corrida: o que a A13 media era «cada
       destino responde», e esse destino é hoje o da leitura. */
    const portasDasLeituras = await pCartoes.evaluate(() =>
      Object.fromEntries(
        [...document.querySelectorAll('details[data-leitura]')].map((d) => [
          d.getAttribute('data-leitura'),
          d.querySelector('.dobra-porta a[href]')?.getAttribute('href') ?? null,
        ]),
      ),
    );
    await pCartoes.__ctx.close();

    /* As páginas de destino lêem-se uma vez, e não uma vez por cartão. */
    const idsDaPaginaDoDominio = await (async () => {
      const doc = await html(`${ed.dominio}/index.html`);
      return new Set([...doc.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    })();

    const errados = [];
    for (const c of cartoes) {
      if (c.href !== `#m-${c.id}`) errados.push(`${c.id}: «${c.href}» ≠ «#m-${c.id}»`);
      else if (!c.ancoraLocal) errados.push(`${c.id}: a âncora «m-${c.id}» não existe nesta página`);
      else if (c.rotulo) errados.push(`${c.id}: um cartão que abre aqui traz rótulo de destino`);
      /* E A PORTA DO DOMÍNIO ONDE ELA AGORA VIVE: a leitura de uma medida que
         pertence a um domínio COM PÁGINA acrescenta a porta para lá, com a
         âncora daquela medida, e essa âncora tem de existir na página de
         chegada. Quem não pertence a domínio nenhum não leva porta. */
      const dominio = dominioDaLinha(c.id);
      const porta = portasDasLeituras[c.id] ?? null;
      if (dominio) {
        const esperada = `${ed.dominio}#${dominio.ancora}`;
        if (porta !== esperada) errados.push(`${c.id}: a leitura tem porta «${porta}» ≠ «${esperada}»`);
        else if (!idsDaPaginaDoDominio.has(dominio.ancora))
          errados.push(`${c.id}: a âncora «${dominio.ancora}» não existe na página do domínio`);
      } else if (porta) {
        errados.push(`${c.id}: não é de domínio nenhum e a leitura leva porta «${porta}»`);
      }
    }
    const comPorta = cartoes.filter((c) => dominioDaLinha(c.id));
    /* CONTADO E NÃO ESCRITO. Um «0 para fora» escrito na frase dizia zero no dia
       em que fossem três, e a prova de uma célula vermelha tem de dizer o que
       ela viu. */
    const paraFora = cartoes.filter((c) => !String(c.href ?? '').startsWith('#'));
    medidas[`A13.${ed.chave}`] = { cartoes, portasDasLeituras, errados, comPorta: comPorta.length };
    conta(
      `A13.${ed.chave}`,
      cartoes.length === AS_VINTE_E_UMA.length && comPorta.length > 0 && errados.length === 0,
      `o destino dos cartões de ${ed.painel}: ${cartoes.length} cartão(ões), ` +
        `${cartoes.length - paraFora.length} para a leitura breve desta página, ` +
        `${paraFora.length} para fora · ` +
        `${comPorta.length} leitura(s) acrescentam a porta do domínio ` +
        `(${comPorta.map((c) => c.id).join(', ') || 'nenhuma'}) · ` +
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
    /* O MENU ABRE-SE PARA A ETIQUETA TER CAIXA. Abaixo de 640 px a fila vive
       dentro de um `<details>` fechado, e o conteúdo de uma gaveta fechada não
       tem caixa nenhuma: medir a etiqueta sem a abrir dizia «sem caixa» sobre
       uma palavra que está lá. A porta abre-se como um leitor a abre. */
    await pMenu.evaluate(() => {
      /* A GAVETA É IRMÃ DA FILA, E NÃO A ENVOLVE. Medido no HTML construído: o
         `<details class="nav-menu">` e o `<nav class="nav-principal">` são
         irmãos, e é a folha que revela a fila quando a gaveta abre
         (`details[open] + .nav-principal`). Um `closest('details')` a partir da
         fila devolve `null`, e a etiqueta ficava a medir zero com a palavra lá:
         foi o que a primeira redação desta célula disse, e estava a medir a
         gaveta fechada e não a etiqueta. */
      for (const g of document.querySelectorAll('details.nav-menu')) g.open = true;
    });
    await pMenu.waitForTimeout(50);
    const menuDominios = await pMenu.evaluate(() =>
      [...document.querySelectorAll('.nav-principal a')].map((a) => {
        const r = a.getBoundingClientRect();
        return {
          href: a.getAttribute('href'),
          texto: (a.textContent ?? '').replace(/\s+/g, ' ').trim(),
          visivel: r.width > 0 && r.height > 0,
        };
      }),
    );
    await pMenu.__ctx.close();
    const temDominios = menuDominios.map((x) => x.href).includes(ed.indiceDosDominios);
    const respostaDoIndice = temDominios
      ? (await fetch(base + ed.indiceDosDominios)).status
      : null;
    /* A PALAVRA, E NÃO SÓ A PORTA (segunda passagem, Minor 12, 03.09.2026). A
       célula conferia o `href` e o código da resposta, e por isso uma etiqueta
       vazia, escondida, ou uma palavra que ninguém declarou passavam por ela. O
       texto do item passa a comparar-se, carácter a carácter, com a cadeia
       `nav.dominios` da edição, lida de `src/i18n/strings.mjs` e não escrita
       aqui: uma régua que escrevesse a palavra media o que ela própria disse. */
    const itemDosDominios = menuDominios.find((x) => x.href === ed.indiceDosDominios) ?? null;
    const palavraEsperada = t(ed.chave).nav.dominios;
    const palavraCerta = itemDosDominios?.texto === palavraEsperada;
    const palavraAVista = !!itemDosDominios?.visivel;
    medidas[`A14.${ed.chave}`] = {
      menu: menuDominios,
      temDominios,
      respostaDoIndice,
      palavraEsperada,
      palavra: itemDosDominios?.texto ?? null,
      palavraAVista,
    };
    conta(
      `A14.${ed.chave}`,
      temDominios && respostaDoIndice === 200 && palavraCerta && palavraAVista,
      `«${ed.indiceDosDominios}» no menu de ${ed.rota}: ` +
        (temDominios
          ? `lá está, a página responde ${respostaDoIndice}, e diz «${itemDosDominios?.texto ?? ''}»` +
            ` (esperado «${palavraEsperada}»${palavraCerta ? '' : ', NÃO BATE'})` +
            `${palavraAVista ? '' : ' · a etiqueta não tem caixa'}`
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
    /* COM O APONTADOR GROSSO, que é o que a promessa desta célula pede: ela
       mede um alvo de TOQUE, e a folha só dá os 44 px onde o apontador é grosso.
       A razão inteira está em `pagina()`, mais acima. */
    const pEstudos = await pagina(ed.rota, 390, ALTURA_PEQUENA, { toque: true });
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
       O NOME ACESSÍVEL DA MANCHETE É A FRASE, E CADA VALOR TEM A SUA PORTA
       ------------------------------------------------------------------------
       Segunda passagem, 03.09.2026, achados Major 5 e Major 6 da leitura a frio.

       O QUE A PRIMEIRA REDAÇÃO MEDIA, E O QUE ELA DEIXAVA PASSAR. Media duas
       coisas fracas: que o texto do `<h1>` COMEÇASSE pela frase (um prefixo, e
       por isso um selo acrescentado no fim passava, que era exactamente o estado
       do bloco), e que o PAI de cada valor contivesse ALGUM `.src-chip` (e como
       todos os valores partilham o mesmo pai, que é o `<h1>`, um único selo,
       ainda que apontasse à linha errada, satisfazia todos).

       O QUE ELA PASSA A MEDIR, e são quatro coisas:

         1 · o NOME ACESSÍVEL CALCULADO do `<h1>`, lido do navegador por
             `ariaSnapshot()` e não do texto do elemento, EM CHROMIUM E EM
             WEBKIT. O nome, sem espaços, tem de ser a frase, sem espaços. Os
             espaços tiram-se dos dois lados porque o algoritmo do nome junta
             duas referências com um espaço pelo meio, e por isso o símbolo da
             unidade fica separado do número NO NOME (medido nos dois motores; a
             razão está no cabeçalho de `src/components/Manchete.astro`). Tirar
             os espaços não esconde uma palavra que caia: esconde só onde elas
             se juntam;
         2 · o nome não contém o texto de nenhum selo. É a mesma coisa dita pela
             outra ponta, e é ela que cai se alguém voltar a pôr os selos dentro
             da lista do nome;
         3 · CADA valor tem UM selo SEU: uma âncora `.src-chip` cujo `href` é o
             caminho da linha DAQUELE valor. Contam-se os selos por linha, e um
             valor com zero ou com dois cai. Uma manchete com dois valores e um
             selo cai, que é o caso que o Major 6 nomeia;
         4 · e esse selo está AO PÉ DO NÚMERO E FORA DA FRASE, medido em píxeis:
             a caixa do selo não interseta a caixa de nenhum pedaço da frase, e
             fica na linha de baixo (o topo do selo abaixo do fundo da frase) a
             menos de um ecrã pequeno de distância. É a forma que o item 9 do
             brief da porta da frente desenha, medida em vez de afirmada. */
    const CAMADAS = [
      ['pais', ed.rota],
      ['dominio', ed.dominio],
      ['regiao', ed.regiao],
      ['concelho', ed.paginaDoConcelho],
    ];

    /* O NOME É O QUE O NAVEGADOR CALCULA, e não o que a régua recompõe. Lê-se do
       instantâneo de acessibilidade do próprio `<h1>`, cuja primeira linha traz
       o nome entre aspas. Dois motores, porque um nome acessível é uma leitura
       do motor e dois motores podem discordar: é a única maneira de a promessa
       valer para quem não usa o mesmo navegador que o construtor. */
    const nomeDoH1 = async (pg) => {
      const yaml = await pg.locator('[data-grelha] h1').first().ariaSnapshot();
      const linha = String(yaml).split('\n')[0];
      const m = /heading\s+"((?:[^"\\]|\\.)*)"/.exec(linha);
      return m ? m[1].replace(/\\(.)/g, '$1') : null;
    };

    const SONDA_MANCHETE = () => {
      const h1 = document.querySelector('[data-grelha] h1');
      if (!h1) return null;
      const norma = (t) => String(t ?? '').replace(/\s+/g, ' ').trim();
      const cx = (el) => {
        const r = el.getBoundingClientRect();
        return {
          esq: +r.left.toFixed(1),
          dir: +r.right.toFixed(1),
          topo: +r.top.toFixed(1),
          fundo: +r.bottom.toFixed(1),
        };
      };
      const copia = h1.cloneNode(true);
      for (const selo of copia.querySelectorAll('.src-chip')) selo.remove();
      /* OS PEDAÇOS DA FRASE são os elementos que o `aria-labelledby` nomeia, e
         é deles que sai a caixa da frase: a caixa do `<h1>` inclui a linha dos
         selos, e mediria a frase como se ela chegasse até lá abaixo. */
      const refs = (h1.getAttribute('aria-labelledby') ?? '').split(/\s+/).filter(Boolean);
      const pedacos = refs
        .map((r) => document.getElementById(r))
        .filter((el) => el && h1.contains(el))
        .map((el) => ({ id: el.id, caixa: cx(el) }));
      const valores = [...h1.querySelectorAll('[data-claim]')].map((v) => ({
        linha: v.getAttribute('data-claim'),
        caixa: cx(v),
      }));
      const selos = [...h1.querySelectorAll('.src-chip')].map((a) => ({
        href: a.getAttribute('href'),
        texto: norma(a.textContent),
        caixa: cx(a),
      }));
      return {
        frase: norma(copia.textContent),
        refs: refs.length,
        pedacos,
        valores,
        selos,
        fundoDaFrase: pedacos.length ? Math.max(...pedacos.map((p) => p.caixa.fundo)) : null,
      };
    };

    /* O caminho da linha de um valor, na edição da página: é o mesmo que o
       portão de HTML compõe, e é contra ele que o `href` do selo se confere. */
    const caminhoDaLinha = (linha) =>
      ed.chave === 'pt' ? `/livro-razao/${linha}` : `/en/ledger/${linha}`;

    const manchetes = [];
    for (const [camada, rota] of CAMADAS) {
      const pg = await pagina(rota, 390, ALTURA_PEQUENA);
      const r = await pg.evaluate(SONDA_MANCHETE);
      const nomeChromium = r ? await nomeDoH1(pg) : null;
      await pg.__ctx.close();
      if (!r) {
        manchetes.push({ camada, rota, erro: 'não há <h1> na cabeça' });
        continue;
      }

      const semEspacos = (t) => String(t ?? '').replace(/\s+/g, '');
      const queixas = [];

      /* 1 · o nome calculado é a frase */
      if (semEspacos(nomeChromium) !== semEspacos(r.frase)) {
        queixas.push(
          `o nome «${String(nomeChromium).slice(0, 70)}» não é a frase «${r.frase.slice(0, 70)}»`,
        );
      }
      /* 2 · e não traz o texto de selo nenhum */
      for (const selo of r.selos) {
        if (selo.texto && semEspacos(nomeChromium).includes(semEspacos(selo.texto))) {
          queixas.push(`o nome traz o texto do selo «${selo.texto.slice(0, 40)}»`);
        }
      }
      /* 3 · cada valor com o SEU selo, e um só */
      for (const v of r.valores) {
        const seus = r.selos.filter((sl) => sl.href === caminhoDaLinha(v.linha));
        if (seus.length !== 1) {
          queixas.push(`«${v.linha}» tem ${seus.length} selo(s) para a sua linha`);
          continue;
        }
        /* 4 · ao pé do número, na linha de baixo, e fora da frase */
        const selo = seus[0];
        const cruza = (a, b) =>
          !(a.dir <= b.esq || b.dir <= a.esq || a.fundo <= b.topo || b.fundo <= a.topo);
        const dentroDaFrase = r.pedacos.filter((p) => cruza(selo.caixa, p.caixa));
        if (dentroDaFrase.length > 0) {
          queixas.push(
            `o selo de «${v.linha}» cruza ${dentroDaFrase.length} pedaço(s) da frase`,
          );
        }
        const abaixo = selo.caixa.topo >= r.fundoDaFrase - 1;
        const perto = selo.caixa.topo - r.fundoDaFrase <= ALTURA_PEQUENA;
        if (!abaixo || !perto) {
          queixas.push(
            `o selo de «${v.linha}» está a ${(selo.caixa.topo - r.fundoDaFrase).toFixed(1)} px do fim da frase`,
          );
        }
      }
      manchetes.push({
        camada,
        rota,
        nomeChromium,
        frase: r.frase,
        valores: r.valores.length,
        selos: r.selos.length,
        queixas,
      });
    }

    /* O MESMO NOME NO SEGUNDO MOTOR. Só o nome: a geometria é a mesma folha e o
       Chromium já a mediu; o que um segundo motor acrescenta é a leitura do
       algoritmo do nome, que é onde os motores podem divergir. */
    const nomesWebkit = [];
    {
      const nav2 = await webkit.launch({ headless: true });
      for (const [camada, rota] of CAMADAS) {
        const ctx = await nav2.newContext({ viewport: { width: 390, height: ALTURA_PEQUENA } });
        const pg = await ctx.newPage();
        await pg.goto(base + rota, { waitUntil: 'networkidle' });
        await pg.evaluate(() => document.fonts.ready);
        const nome = await nomeDoH1(pg);
        await ctx.close();
        nomesWebkit.push({ camada, nome });
      }
      await nav2.close();
    }
    for (const m of manchetes) {
      const w = nomesWebkit.find((x) => x.camada === m.camada);
      m.nomeWebkit = w?.nome ?? null;
      if (String(m.nomeWebkit) !== String(m.nomeChromium)) {
        (m.queixas ??= []).push(
          `os dois motores dão nomes diferentes (webkit «${String(m.nomeWebkit).slice(0, 50)}»)`,
        );
      }
    }

    const comQueixa = manchetes.filter((m) => m.erro || (m.queixas ?? []).length > 0);
    medidas[`A16.${ed.chave}`] = { manchetes };
    conta(
      `A16.${ed.chave}`,
      manchetes.length === 4 && comQueixa.length === 0,
      `o nome acessível do <h1> das quatro camadas em ${ed.chave}, em Chromium e WebKit: ` +
        manchetes
          .map((m) => `${m.camada} ${m.valores ?? 0} valor(es)/${m.selos ?? 0} selo(s)`)
          .join(' · ') +
        (comQueixa.length
          ? ` · QUEIXAS: ${comQueixa.map((m) => `${m.camada}: ${m.erro ?? m.queixas.join('; ')}`).join(' | ')}`
          : ' · nome igual à frase nos dois motores, cada valor com a sua porta ao pé dele'),
    );

    /* ------------------------------------------------------------------ A17
       O «n DE N» DE CADA FAIXA, COM O N DA PRÓPRIA PÁGINA
       ------------------------------------------------------------------------
       Segunda passagem, 03.09.2026, achado Major 7 da leitura a frio: «No ruler
       verifies "n de N". A region showing "1 de 21" with both numerals still
       marked `numeracao` would pass.» Tinha razão: a F12 da régua da faixa mede
       a pertença dos cartões, os selos, a geometria e a ordem, e nunca lê o
       `.cartao-posicao`. A posição era a única coisa deste bloco sem régua.

       O QUE ESTA CÉLULA EXIGE, nas quatro camadas e nas duas edições:

         · há uma posição por cartão, e nem uma a mais;
         · o TOTAL de cada posição é o número de cartões DAQUELA página, contado
           no HTML dela e não escrito aqui. É esta metade que recusa uma faixa de
           região a dizer «de 21»;
         · o ORDINAL corre de 1 a N, pela ordem do documento, sem saltos;
         · e os DOIS algarismos levam `data-nonledger="numeracao"`, que é o
           motivo do registo para a numeração de secções e de instrumentos. Um
           algarismo à vista sem origem declarada é o que a casa não deixa
           entrar. */
    /* O N É O DA FAIXA, E NÃO O DA PÁGINA (F1.1b, 04.09.2026)
       ------------------------------------------------------------------------
       A primeira redação contava `[data-faixa] [data-cartao]` na página inteira
       e comparava o total de cada posição com essa contagem. Era certo enquanto
       cada página tinha UMA faixa; desde 04.09 a primeira página tem duas — a da
       cabeça, com os 21, e a do domínio, na secção que entrou a seguir ao mapa —
       e o mesmo código passava a exigir «de 23» às duas, que é uma frase que
       nenhuma das duas pode dizer com verdade.

       A CÉLULA PASSA A LER FAIXA A FAIXA. Para cada `[data-faixa]` da página, o
       N é o número de cartões DAQUELA faixa e o ordinal corre de 1 a N dentro
       dela. É a mesma definição de sempre («o total é o número de cartões
       daquela faixa, contado no HTML e não escrito aqui»), aplicada à coisa
       certa; a planta «a faixa de uma região a dizer de 21» continua a cair, e a
       faixa do domínio na primeira página tem de dizer o SEU número. */
    const faixas = [];
    for (const [camada, rota] of CAMADAS) {
      const pg = await pagina(rota, 390, ALTURA_PEQUENA);
      const r = await pg.evaluate(() =>
        [...document.querySelectorAll('[data-faixa]')].map((faixa, iF) => {
          const cartoes = [...faixa.querySelectorAll('[data-cartao]')];
          const posicoes = cartoes.map((c) => {
            const p = c.querySelector('.cartao-posicao');
            if (!p) return null;
            const marcados = [...p.querySelectorAll('[data-nonledger]')].map((x) => ({
              motivo: x.getAttribute('data-nonledger'),
              texto: (x.textContent ?? '').trim(),
            }));
            return { texto: (p.textContent ?? '').replace(/\s+/g, ' ').trim(), marcados };
          });
          return { faixa: iF + 1, cartoes: cartoes.length, posicoes };
        }),
      );
      await pg.__ctx.close();
      const queixas = [];
      /* A CAMADA DA REGIÃO DEIXOU DE TER FAIXA (F1.10, §1 e §7.6, 09.09.2026), e
         a célula mede o FACTO em vez de pedir de volta o que a casa tirou. A
         página de uma região tinha os seus dois valores três vezes — na faixa, em
         «As medidas» e, um deles, dentro da manchete — e o §7.6 manda ficar «o
         valor uma vez e a porta "Comparar as regiões →"». Das duas apresentações
         ficou a que leva a unidade e o período ao lado do valor.
         O que aqui se exige daquela camada é o contrário do que se exige das
         outras três: zero faixas, e a porta da régua no lugar dela. Uma célula
         que só contasse «n de N» onde há faixa passaria com a faixa de volta. */
      const semFaixa = camada === 'regiao';
      if (semFaixa) {
        if (r.length !== 0) queixas.push(`a página tem ${r.length} faixa(s), e o §7.6 tirou-lha`);
        const temPorta = await pagina(rota, 390, ALTURA_PEQUENA).then(async (pg2) => {
          const v = await pg2.evaluate(() =>
            [...document.querySelectorAll('main a[href], a[href]')].some((a) =>
              (a.getAttribute('href') ?? '').includes('#regua'),
            ),
          );
          await pg2.__ctx.close();
          return v;
        });
        if (!temPorta) queixas.push('a página não tem a porta para a régua do índice');
        faixas.push({ camada, rota, faixas: [], queixas });
        continue;
      }
      if (r.length === 0) queixas.push('a página não tem faixa nenhuma');
      for (const f of r) {
        const N = f.cartoes;
        const semPosicao = f.posicoes.filter((x) => x === null).length;
        if (N === 0) queixas.push(`a faixa ${f.faixa} não tem cartão nenhum`);
        if (semPosicao > 0) queixas.push(`a faixa ${f.faixa} tem ${semPosicao} cartão(ões) sem posição`);
        f.posicoes.forEach((x, i) => {
          if (!x) return;
          const nums = x.marcados.map((m) => m.texto);
          const motivos = x.marcados.map((m) => m.motivo);
          if (x.marcados.length !== 2) {
            queixas.push(
              `o cartão ${i + 1} da faixa ${f.faixa} tem ${x.marcados.length} algarismo(s) declarado(s)`,
            );
            return;
          }
          if (motivos.some((m) => m !== 'numeracao')) {
            queixas.push(
              `o cartão ${i + 1} da faixa ${f.faixa} declara «${motivos.join(', ')}» e não «numeracao»`,
            );
          }
          if (nums[0] !== String(i + 1)) {
            queixas.push(`o cartão ${i + 1} da faixa ${f.faixa} diz que é o «${nums[0]}»`);
          }
          if (nums[1] !== String(N)) {
            queixas.push(`o cartão ${i + 1} da faixa ${f.faixa} diz «de ${nums[1]}» numa faixa de ${N}`);
          }
        });
      }
      faixas.push({ camada, rota, faixas: r.map((f) => f.cartoes), queixas });
    }
    const faixasComQueixa = faixas.filter((f) => f.queixas.length > 0);
    medidas[`A17.${ed.chave}`] = { faixas };
    conta(
      `A17.${ed.chave}`,
      faixas.length === 4 && faixasComQueixa.length === 0,
      `o «n de N» das faixas das quatro camadas em ${ed.chave}: ` +
        faixas.map((f) => `${f.camada} ${f.faixas.map((n) => `1..${n} de ${n}`).join(' + ')}`).join(' · ') +
        (faixasComQueixa.length
          ? ` · QUEIXAS: ${faixasComQueixa.map((f) => `${f.camada}: ${f.queixas.slice(0, 3).join('; ')}`).join(' | ')}`
          : ''),
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
    /* Repõe uma segunda rendição do valor da dívida pública dentro da área de
       leitura, que é exactamente a cópia que o F1.1 veio tirar do painel.

       O ALVO MUDOU COM A PÁGINA (F1.1b, 04.09.2026): a planta enxertava-se antes
       de `<div class="painel"`, que era a grelha das treze peças; a grelha saiu
       e a marca deixou de existir, e uma planta que não encontra o seu alvo é um
       `replace` que falha em silêncio — o modo mais comum de um estrago não ser
       estrago nenhum. O novo alvo é a área de leitura, que é o que está no lugar
       dela. E foi preciso mudá-lo DUAS vezes no mesmo dia: a primeira redação
       apontava a `class="leituras"`, e a classe passou a `dobras` porque
       `.leitura` já existia em `site.css`. Quem o disse foi a conferência do
       «html mudou» desta mesma corrida. */
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h
        : h.replace(
            /<div class="dobras"/,
            '<p class="claim-value" data-claim="divida-publica-2025">96,4</p><div class="dobras"',
          ),
  },
  {
    nome: 'a definição do Procedimento sem «Comissão Europeia» (a do Painel Social fica intacta)',
    celulas: ['A4.pt', 'A4.en'],
    /* A PLANTA MUDOU PARA A FORMA QUE A PRIMEIRA CÉLULA DEIXAVA PASSAR (Major 9,
       e a planta P1 da leitura a frio). Tira a Comissão SÓ da definição do
       Procedimento, e deixa a do Painel Social como está: a célula que contava a
       cadeia no documento inteiro continuava verde, e a que compara cada
       parágrafo com a declaração cai. */
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
    /* A GAVETA SEM COMANDO (09.09.2026, com a A5 reescrita). A célula deixou de
       exigir os 29 nomes visíveis em repouso e passou a exigir que UM TOQUE os
       abra: sem esta planta, a promessa nova não tinha positivo conhecido. Tira
       o `<summary>` da gaveta dos nomes, e o toque deixa de ter onde bater. */
    nome: 'a gaveta dos nomes sem comando',
    celulas: ['A5.pt', 'A5.en'],
    f: (h) =>
      h.replace(
        /(<details class="gaveta"[^>]*data-gaveta="nomes"[^>]*>)<summary[\s\S]*?<\/summary>/,
        '$1',
      ),
  },
  {
    /* O DISTRITO FORA DAS FICHAS DOS HOMÓNIMOS (09.09.2026, com a A7 posta a ler
       a página que ela nomeia). Tira os `<span class="pesquisa-distrito">` da
       busca: as duas Lagoas voltam a dizer «Lagoa» e mais nada. */
    nome: 'as duas Lagoas sem distrito',
    celulas: ['A7.pt', 'A7.en'],
    f: (h) => h.replace(/<span class="pesquisa-distrito"[^>]*>[\s\S]*?<\/span>/g, ''),
  },
  {
    nome: 'a página mais alta do que a árvore de partida',
    celulas: ['A2.pt', 'A2.en'],
    /* A2 SÓ EXIGIA UM NÚMERO (Major 8), e a planta P3 da leitura a frio mostrou
       que o relatório podia dizer um valor e a régua outro sem nada cair. Com o
       teto medido escrito na régua, uma página que cresça acima dele fecha a
       célula, e esta planta prova-o: papel a mais no fim do corpo.

       O PAPEL É GRANDE DE PROPÓSITO, E NÃO É UMA MEDIDA (F1.1b, 04.09.2026).
       Eram mil píxeis, e deixaram de chegar: este bloco tirou 2 292 px à página
       (`/` a 390 passou de 6 959 para 4 667), e mil píxeis de papel já não a
       levam acima do teto. Uma planta que dependa da folga do dia apodrece com
       ela; cem mil píxeis são maiores do que qualquer teto que a casa venha a
       escrever, e a planta volta a provar o que promete. */
    f: (h) => h.replace(/<\/body>/, '<div style="height:100000px"></div></body>'),
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
    nome: 'um cartão a levar à página do domínio em vez de abrir a sua leitura',
    celulas: ['A13.pt', 'A13.en'],
    /* O DEFEITO QUE A SEGUNDA PASSAGEM DO F1.1c TIROU, REPOSTO (07.09.2026).
       Até 07.09 o cartão da dívida pública mudava de página, e a planta anterior
       plantava o contrário: repunha nele a âncora desta página. Com a decisão
       (7) da §1.99 e o mandato do F1.1c, o destino certo é a âncora desta
       página, e o defeito é levar para fora. A planta repõe exactamente a forma
       que o F1.2b lhe tinha dado, com a âncora lida da mesma tabela que a vista
       usa e não escrita aqui: o cartão continua a ser um alvo e a apontar a uma
       página que existe, e o que cai é a promessa deste bloco. */
    f: (h, rota) => {
      const d = dominioDaLinha('divida-publica-2025');
      if (!d) return h;
      const pagina = rota.startsWith('/en')
        ? `/en/domains/${d.slug}`
        : `/dominios/${d.slug}`;
      return h.replace(
        'href="#m-divida-publica-2025" aria-labelledby=',
        `href="${pagina}#${d.ancora}" aria-labelledby=`,
      );
    },
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
    nome: 'a manchete do domínio com dois valores e um selo só',
    celulas: ['A16.pt', 'A16.en'],
    rotas: [
      '/dominios/economia-e-financas-publicas/index.html',
      '/en/domains/economia-e-financas-publicas/index.html',
    ],
    /* O CASO QUE O MAJOR 6 NOMEIA. A primeira redação da A16 perguntava se o PAI
       de um valor continha ALGUM `.src-chip`; como os dois valores partilham o
       `<h1>`, um selo só satisfazia os dois. Esta planta tira o segundo selo e
       deixa o primeiro: a frase não muda, o nome não muda, e o que fica sem
       porta é o saldo das administrações públicas. */
    f: (h, rota) => {
      if (!rota.includes('dominios') && !rota.includes('domains')) return h;
      const i = h.indexOf('<span class="manchete-selos">');
      if (i < 0) return h;
      const fim = h.indexOf('</span></h1>', i);
      if (fim < 0) return h;
      const bloco = h.slice(i, fim);
      const selos = [...bloco.matchAll(/<a class="src-chip[\s\S]*?<\/a>/g)];
      if (selos.length < 2) return h;
      return h.slice(0, i) + bloco.replace(selos[1][0], '') + h.slice(fim);
    },
  },
  {
    nome: 'um selo da manchete a abrir a linha do outro valor',
    celulas: ['A16.pt', 'A16.en'],
    rotas: [
      '/dominios/economia-e-financas-publicas/index.html',
      '/en/domains/economia-e-financas-publicas/index.html',
    ],
    /* A OUTRA METADE DO MAJOR 6: os dois selos ficam, e um deles passa a abrir a
       linha do vizinho. A contagem de selos continua certa, o nome continua
       certo, e o que está errado é a porta: um leitor que toque no selo da
       dívida pública aterra na linha do saldo. */
    f: (h, rota) => {
      if (!rota.includes('dominios') && !rota.includes('domains')) return h;
      const i = h.indexOf('<span class="manchete-selos">');
      if (i < 0) return h;
      const fim = h.indexOf('</span></h1>', i);
      if (fim < 0) return h;
      const bloco = h.slice(i, fim);
      const trocado = bloco.replace('divida-publica-2025', 'saldo-das-administracoes-publicas-2025');
      return h.slice(0, i) + trocado + h.slice(fim);
    },
  },
  {
    nome: 'a faixa de uma região a dizer «de 21»',
    celulas: ['A17.pt', 'A17.en'],
    rotas: ['/regioes/alentejo/index.html', '/en/regions/alentejo/index.html'],
    /* O TOTAL DA PRIMEIRA PÁGINA NUMA FAIXA QUE TEM DOIS CARTÕES. É o caso que
       o Major 7 nomeia: o algarismo continua declarado como `numeracao`, a
       posição continua lá, e o que está errado é que ele não é o N daquela
       página. Uma célula que só contasse posições passava. */
    f: (h, rota) => {
      if (!rota.includes('regio') && !rota.includes('region')) return h;
      /* O TOTAL é o SEGUNDO algarismo declarado de cada posição, e é só ele que
         a planta troca: o ordinal fica certo, a marca fica declarada, e o que
         passa a estar errado é o N. Medido no HTML construído, a posição rende
         `<span class="cartao-posicao"><span data-nonledger="numeracao">1</span>
         de <span data-nonledger="numeracao">2</span></span>`. */
      return h.replace(
        /(<span class="cartao-posicao">(?:(?!<\/span><\/span>)[\s\S])*<span data-nonledger="numeracao">)\d+(<\/span><\/span>)/g,
        '$121$2',
      );
    },
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
