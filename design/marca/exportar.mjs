/**
 * OS PNG DE CADA DIREÇÃO, E A CAPTURA DA PRANCHA.
 *
 * Corre o Chromium que já está no repositório (`playwright`, dependência de
 * desenvolvimento do `package.json`) sobre os SVG de `design/marca/direcoes/`.
 * Nenhuma dependência nova: isto escreve para `design/marca/EXPORT/` e para
 * `design/marca/PRANCHA.png`.
 *
 * E, DESDE 28.08.2026, ESCREVE TAMBÉM EM `public/`, com `exportar.mjs app`.
 * A linha de cima dizia «nada em `public/`», e era verdade enquanto isto era só
 * uma ferramenta de exploração: nenhuma das trinta e seis direções tinha sido
 * escolhida, e escrever no sítio a partir de uma exploração seria pôr no ar uma
 * pergunta. O diretor escolheu (`design/marca/BRIEF-app.md`, decisões de
 * 28.08.2026), e a partir daí a regra que interessa é a outra: os ficheiros do
 * telemóvel **nunca se desenham à mão nem se retocam**, saem daqui, e quem os
 * quiser refazer corre uma linha. A ronda `app` está no fim deste ficheiro e
 * escreve seis ficheiros e mais nenhum.
 *
 * PORQUÊ UM NAVEGADOR E NÃO UM CONVERSOR. Os SVG trazem as duas paletas dentro,
 * escolhidas por `svg[data-tema]`, e o `maskable` é uma regra de CSS sobre o
 * grupo do sinal. Um conversor sem CSS daria o tema claro sempre e o `maskable`
 * do tamanho errado; o navegador dá o que o telemóvel dará.
 *
 * O QUE SAI, por direção:
 *   512, 192, 180, 60, 32, 16   · o ícone, tema claro
 *   512-escuro, 180-escuro      · o mesmo em papel escuro
 *   maskable-512                · o sinal dentro do círculo seguro do Android
 * E ainda `PRANCHA.png`, a prancha inteira a 1280 de largura.
 *
 * O 60 não é um tamanho que algum sistema peça: é o tamanho a que este trabalho
 * se julga, porque é a esse tamanho que o ícone aparece no ecrã principal de um
 * telemóvel a densidade normal, e é a esse tamanho que as referências mostram
 * qual delas sobrevive.
 *
 * USO: node design/marca/exportar.mjs        as trinta e seis direções
 *      node design/marca/exportar.mjs e2     as cinquenta e cinco células do «e»
 *      node design/marca/exportar.mjs app    os ficheiros do telemóvel, em public/
 *      node design/marca/exportar.mjs app e2 os mesmos, da marca de 28.08
 */

import { chromium } from 'playwright';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIRECOES = path.join(AQUI, 'direcoes');
const RAIZ = path.resolve(AQUI, '..', '..');
const PUBLIC = path.join(RAIZ, 'public');
const EXPORT = path.join(AQUI, 'EXPORT');

/** Os tamanhos, e o motivo de cada um. */
const TAMANHOS = [
  { nome: '512', px: 512, tema: 'claro', forma: 'normal' },       // manifesto, ícone grande
  { nome: '192', px: 192, tema: 'claro', forma: 'normal' },       // manifesto, ícone pequeno
  { nome: '180', px: 180, tema: 'claro', forma: 'normal' },       // apple-touch-icon
  { nome: '120', px: 120, tema: 'claro', forma: 'normal' },       // a prancha
  { nome: '60', px: 60, tema: 'claro', forma: 'normal' },         // o tamanho a que se julga
  { nome: '32', px: 32, tema: 'claro', forma: 'favicon' },        // favicon, forma simplificada
  { nome: '16', px: 16, tema: 'claro', forma: 'favicon' },        // favicon, forma simplificada
  { nome: 'maskable-512', px: 512, tema: 'claro', forma: 'maskable' },
  { nome: 'maskable-180', px: 180, tema: 'claro', forma: 'maskable' },
  { nome: '512-escuro', px: 512, tema: 'escuro', forma: 'normal' },
  { nome: '180-escuro', px: 180, tema: 'escuro', forma: 'normal' },
  { nome: '120-escuro', px: 120, tema: 'escuro', forma: 'normal' },
  { nome: '60-escuro', px: 60, tema: 'escuro', forma: 'normal' },
  { nome: '32-escuro', px: 32, tema: 'escuro', forma: 'favicon' },
];

/**
 * QUANDO UMA DIREÇÃO TROCA DE DESENHO MAIS CEDO DO QUE AS OUTRAS.
 *
 * A regra da casa é: o desenho cheio até aos 60 px, e a simplificação a partir
 * dos 32. A direção J não a cumpre, e não é um descuido: o sinal dela é a
 * palavra «Estado», que a 60 px dá 10 px de altura de maiúscula e é uma mancha.
 * A terceira adenda pede-o à letra («o ícone pode levar «Estado» a 180 e o «E»
 * desenhado a 60 e a 16»), e é isto que o faz: a J passa ao segundo desenho já
 * aos 60 px. Quem não estiver aqui nomeado segue a regra da casa.
 */
const TROCA_CEDO = {
  '10-palavra-estado': { 60: 'favicon', '60-escuro': 'favicon' },
  '11-estado-linha': { 60: 'favicon', '60-escuro': 'favicon' },
};

/**
 * AS SETE VOZES DA QUARTA ADENDA TROCAM MAIS CEDO AINDA: A PALAVRA SÓ AOS 512.
 *
 * A adenda diz o tamanho de cada sinal à letra: «a palavra "Estado" (para o
 * cabeçalho e para o ícone de 512) e o "E" dela sozinho (para 180, 60, 32,
 * 16)». É isso, e não uma interpretação: só o ficheiro de 512 leva a palavra;
 * tudo o que é ícone de telemóvel leva a letra.
 *
 * E SÃO TRÊS DESENHOS, E NÃO DOIS. A palavra aos 512; a LETRA da voz, com os
 * números da voz, dos 192 aos 60; e a simplificação aos 32 e 16. O terceiro
 * grupo nasceu de um erro que só se viu ao olhar: com dois grupos, a cela de
 * 180 px mostrava a letra ENGROSSADA do favicon, e a Didone chegava ao tamanho
 * a que o diretor a julga com contraste 1,9 em vez de 6,55. A cela de 180 é a
 * que decide, e tem de mostrar a letra tal como ela está dentro da palavra.
 *
 * O `maskable` leva a letra nos DOIS tamanhos, incluindo o de 512, e a razão
 * está medida nas NOTAS: um ícone adaptável do Android desenha-se a 108 px, e a
 * maiúscula da palavra lá dentro fica a 13,5 px. Um ficheiro de 512 que ninguém
 * vê a 512 não é um argumento. Daí as formas compostas «maskable-letra» e
 * «maskable-favicon», que o CSS dos SVG conhece: o sinal pequeno, dentro do
 * círculo seguro.
 *
 * A 18 (o «e» minúsculo) não está aqui, e de propósito: o sinal dela é o mesmo
 * em todos os tamanhos, porque não é uma palavra, é uma letra só.
 */
const VOZES = ['12-didone-estado', '13-inscricional-estado', '14-geometrica-ambar',
  '14b-geometrica-cobalto', '15-laje-instrumento', '16-condensada-estado',
  '17-caligrafica-estado'];
const SO_A_PALAVRA = new Set(['512', '512-escuro']);
const SIMPLIFICADO = new Set(['32', '16', '32-escuro']);
for (const slug of VOZES) {
  TROCA_CEDO[slug] = {};
  for (const t of TAMANHOS) {
    if (SO_A_PALAVRA.has(t.nome)) continue;
    const sinal = SIMPLIFICADO.has(t.nome) ? 'favicon' : 'letra';
    TROCA_CEDO[slug][t.nome] = t.forma === 'maskable' ? `maskable-${sinal}` : sinal;
  }
}

/**
 * TAMANHOS A MAIS, SÓ PARA AS DIREÇÕES QUE TROCAM CEDO.
 *
 * As duas direções da palavra têm dois sinais, e a 180 px mostram o grande.
 * Para a maqueta do ecrã principal (`desenhar.py ecras`) é preciso ver a MESMA
 * cela de 180 px com o sinal pequeno, que é a pergunta que a maqueta responde:
 * o que segura um lugar num ecrã principal, a palavra ou a letra? Só estas duas
 * levam estes ficheiros a mais; as outras não têm duas leituras para comparar.
 */
const TAMANHOS_EXTRA = {
  '10-palavra-estado': ['180-letra', '180-letra-escuro'],
  '11-estado-linha': ['180-letra', '180-letra-escuro'],
};
const EXTRA = {
  // A letra da voz na cela de 180, para a maqueta e para a prancha (é a mesma
  // que o `-180` já traz; fica com nome próprio para quem ler a pasta perceber).
  '180-letra': { px: 180, tema: 'claro', forma: 'favicon' },
  '180-letra-escuro': { px: 180, tema: 'escuro', forma: 'favicon' },
  // O contrário, para as sete vozes: a cela de 180 px com a PALAVRA lá dentro.
  // É o ficheiro que mostra, lado a lado com o da letra, porque é que o diretor
  // tem razão quando diz que a palavra «pode não funcionar, por causa do
  // tamanho»: a prancha põe os dois na mesma linha, à mesma escala.
  '180-palavra': { px: 180, tema: 'claro', forma: 'normal' },
  '180-palavra-escuro': { px: 180, tema: 'escuro', forma: 'normal' },
};
for (const slug of VOZES) TAMANHOS_EXTRA[slug] = ['180-palavra', '180-palavra-escuro'];

/**
 * A página que o navegador vê: o SVG sozinho, do tamanho pedido, sem margem e
 * sem nada por baixo. O `image-rendering` fica no defeito: o que se quer medir é
 * o que o telemóvel faz, e o telemóvel não pede nada de especial.
 */
function pagina(svg, px, tema, forma) {
  const marcado = svg
    .replace('<svg ', `<svg data-tema="${tema}" data-forma="${forma}" `)
    .replace(/width="512" height="512"/, `width="${px}" height="${px}"`);
  return `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>
${marcado}`;
}

/**
 * AS RONDAS DE EXPLORAÇÃO, QUE NÃO SÃO DIREÇÕES.
 *
 * `node design/marca/exportar.mjs e2` lê `direcoes-e2/` e escreve `EXPORT-E2/`.
 *
 * Porque é que não vão para `direcoes/` com as outras: as trinta e cinco
 * células de uma tabela cruzada não são trinta e cinco propostas de marca. Se
 * fossem para lá, entravam na prancha, entravam no `medir` e entravam na lista
 * que a §7 das NOTAS ordena, e nenhuma dessas coisas quer dizer alguma coisa
 * sobre uma célula de grelha. Ficam num sítio só delas, com um `medir-e2` só
 * delas, e o ramo continua a poder dizer quantas direções tem.
 *
 * E LEVAM TRÊS TAMANHOS EM VEZ DE CATORZE, porque a adenda 6 nomeia três (180,
 * 60 e 16) e mais nenhum entra em decisão nenhuma desta ronda. O tema é sempre
 * «claro» porque estes ficheiros têm o MESMO par de cores nos dois temas, de
 * propósito: a pergunta é sobre o par, e um ficheiro que muda de cor conforme o
 * tema responderia a outra.
 */
const RONDAS = {
  e2: {
    origem: 'direcoes-e2',
    destino: 'EXPORT-E2',
    tamanhos: [
      { nome: '180', px: 180, tema: 'claro', forma: 'normal' },
      { nome: '60', px: 60, tema: 'claro', forma: 'normal' },
      { nome: '16', px: 16, tema: 'claro', forma: 'favicon' },
    ],
  },
};

/* ===========================================================================
 * A RONDA `app`: OS SEIS FICHEIROS DO TELEMÓVEL, EM `public/`
 * ===========================================================================
 *
 * A MARCA ENTRA POR PARÂMETRO desde 29.08.2026, e o defeito é a do diretor.
 * Ele entregou-a nesse dia em `design/marca/direcoes-k/`, com o `LEIA-ME.txt`
 * ao lado: três linhas alinhadas à esquerda, a do meio mais curta e de cobalto,
 * que é o «E» lido sem letra desenhada. **Os ficheiros dele não se tocam**;
 * tudo o que sai daqui deriva deles, e a derivação está escrita ao lado de cada
 * peça. A marca de 28.08 (o «e» unido) continua a poder ser refeita por uma
 * linha, `app e2`, e é isso que faz do parâmetro um parâmetro.
 *
 * DE CADA MARCA ENTRAM DOIS DESENHOS E UMA PALETA:
 *
 *   a CELA, com campo   `direcoes-k/icone-telemovel.svg`. É o ecrã principal:
 *       o campo de tinta e as três linhas em papel e cobalto lá dentro. Vai nos
 *       quatro PNG.
 *
 *   o SINAL, sem campo  `direcoes-k/favicon.svg`. Um favicon é desenhado pelo
 *       navegador sobre o separador dele, e um quadrado opaco no meio de uma
 *       barra de separadores é uma mancha e não uma marca. O ficheiro do
 *       diretor já é sem campo, e é por isso que é este e não a cela que aqui
 *       entra. Vai no `favicon.svg` (com a troca por `prefers-color-scheme`) e
 *       no `favicon.ico` (32 e 16, com fundo transparente).
 *
 *   e um TERCEIRO, que não é um desenho mas uma paleta: a marca de peso cheio
 *       sobre tinta, `direcoes-k/marca-cheia-escuro.svg`. É de lá que sai a
 *       regra do esquema escuro do `favicon.svg`, em vez de duas cores
 *       datilografadas aqui. As duas paletas são do MESMO desenho, e a ronda
 *       confere-o barra a barra antes de compor: se as medidas divergirem, isto
 *       pára, porque nesse caso não é a paleta escura, é outra marca.
 *
 * O QUE SAI, e de onde:
 *
 *   public/apple-touch-icon.png   180  a cela  forma normal    OPACO
 *   public/icon-192.png           192  a cela  forma normal
 *   public/icon-512.png           512  a cela  forma normal
 *   public/icon-512-maskable.png  512  a cela  forma maskable
 *   public/favicon.svg            —    o sinal, sem campo, com a regra do escuro
 *   public/favicon.ico            32 e 16, do `favicon.svg`, fundo transparente
 *
 * PORQUE É QUE O 180 É OPACO SEM SE FAZER NADA. A cela traz o campo de tinta a
 * cobrir os 512 do `viewBox`, e a captura corre com `omitBackground` falso. Não
 * é uma esperança: a ronda MEDE o canal alfa dos 32 400 píxeis do ficheiro
 * antes de o dar por escrito, e pára se algum não for 255. O iOS compõe o
 * `apple-touch-icon` sobre preto, e um canto transparente sairia preto num
 * ícone que é quase preto: ninguém veria o defeito e ele estaria lá.
 *
 * E PORQUE É QUE OS CANTOS DO APARELHO NÃO VÃO NOS PNG. A cela do diretor traz
 * `rx="114"`, que são 22,3 % do lado, e é uma boa aproximação do canto que um
 * telemóvel desenha. É exactamente por ser uma aproximação que ele não pode ir
 * no ficheiro: o iOS recorta este PNG com a máscara DELE, aproximada ou não,
 * e dois cantos de raios parecidos e diferentes deixam uma meia-lua de fundo
 * por dentro da máscara, que ninguém procura porque a medição da opacidade
 * passa na mesma. O Android faz o mesmo pelo seu lado e desenha o `maskable` de
 * bordo a bordo por baixo da forma que o aparelho escolhe: um canto redondo lá
 * dentro é um buraco. Os cantos são do aparelho; o ficheiro do diretor
 * mostra-os para se ver a cela como ela vai ficar, e aqui o campo vai de bordo
 * a bordo nos quatro PNG.
 *
 * (E o raio DO APARELHO não está medido em lado nenhum deste repositório: é uma
 * coisa que se confere numa fotografia do telemóvel do diretor, e a régua do
 * `tests/inicio/app.mjs` diz na cabeça que essa prova é dele.)
 *
 * PORQUE É QUE O ICO SE ESCREVE COM DIB E NÃO COM PNG LÁ DENTRO. Um ICO pode
 * levar as duas coisas, e um PNG dentro do ICO é menos código do que isto. Mas o
 * `/favicon.ico` é o endereço que os clientes VELHOS pedem sozinhos — é essa a
 * única razão de ele existir ao lado do `favicon.svg` —, e o PNG dentro do ICO é
 * a parte do formato que os clientes velhos não leem. Um ficheiro que só o
 * Chrome entende não precisava de ser um ICO.
 */

/** Os quatro PNG da cela, e o que cada um é. */
const PNG_DO_APP = [
  { nome: 'apple-touch-icon.png', px: 180, forma: 'normal', opaco: true },
  { nome: 'icon-192.png', px: 192, forma: 'normal', opaco: false },
  { nome: 'icon-512.png', px: 512, forma: 'normal', opaco: false },
  { nome: 'icon-512-maskable.png', px: 512, forma: 'maskable', opaco: false },
];

/** Os dois tamanhos que o ICO leva dentro, pela ordem em que ficam no ficheiro. */
const TAMANHOS_DO_ICO = [32, 16];

/**
 * DE ONDE SAI A MARCA, E COMO SE TROCA.
 *
 * Uma entrada por marca, e a ronda leva o nome da entrada: `app` (a do diretor,
 * que é o defeito) ou `app e2` (a de 28.08). Um parâmetro com um valor só não é
 * um parâmetro, e enquanto o ramo for uma pré-visualização e não uma decisão a
 * ronda anterior tem de continuar a refazer-se por uma linha.
 *
 * `compor` diz qual das duas composições o `favicon.svg` leva, porque os dois
 * desenhos não são a mesma coisa: o «e» é um grupo de dois caminhos dentro de
 * um SVG com folha de estilos, e a marca do diretor são três retângulos num
 * ficheiro sem estilos nenhuns.
 */
const MARCAS = {
  k: {
    nome: 'K, as três linhas do diretor (design/marca/direcoes-k/, 29.08.2026)',
    compor: 'barras',
    cela: path.join(AQUI, 'direcoes-k', 'icone-telemovel.svg'),
    sinal: path.join(AQUI, 'direcoes-k', 'favicon.svg'),
    escuro: path.join(AQUI, 'direcoes-k', 'marca-cheia-escuro.svg'),
    /**
     * A ESCALA DAS BARRAS NO `maskable`, E A MEDIÇÃO QUE A DECIDE.
     *
     * O ficheiro do diretor põe as barras em `translate(97 97) scale(0.62)`, o
     * que dá uma caixa de tinta de 210,80 por 193,44 px num campo de 512,
     * centrada em 255,72 quando o campo está centrado em 256. O canto da caixa
     * mais afastado do centro do campo fica a hipot(105,68; 97,00) = 143,45 px,
     * e o círculo seguro do Android tem 204,8 px de raio (40 % de 512): sobram
     * 61,35 px. Não é preciso encolher nada, e por isso a escala é 1.
     *
     * E ficar em 1 não é preguiça, é a regra da §6 bis das NOTAS: o `maskable`
     * mostra a marca ao MESMO tamanho das outras três celas, porque uma marca
     * com `maskable` de escala própria são duas marcas.
     *
     * O número não fica por conta desta conta. `tests/inicio/app.mjs`, célula
     * A3, mede-o nos píxeis do PNG escrito, que é onde uma transformação de
     * folha de estilos deixa de ser uma intenção.
     */
    escalaDoMaskable: 1,
  },
  e2: {
    nome: 'o «e» unido, corte de 28 (design/marca/direcoes-e2/, 28.08.2026)',
    compor: 'e',
    cela: path.join(AQUI, 'direcoes-e2', 'e2c-unida-28-papel-tinta.svg'),
    sinal: path.join(AQUI, 'direcoes-e2', 'e2-unida-28.svg'),
    escuro: null,
    /* Está no CSS do próprio SVG (`svg[data-forma^="maskable"] .reducao`), que
       é onde a ronda de 28.08 a pôs. Aqui não entra. */
    escalaDoMaskable: null,
  },
};

/* ------------------------------------------------ a marca do diretor, lida --
 * As três expressões que leem os ficheiros de `direcoes-k/`. São estritas de
 * propósito: PARAM com o nome do defeito em vez de escreverem meia marca. Um
 * favicon com uma barra a menos são duas linhas, e duas linhas não são nada.
 * ------------------------------------------------------------------------- */
const K_CAMPO = /<rect\s+width="512"\s+height="512"\s+rx="([\d.]+)"\s+fill="(#[0-9A-Fa-f]{6})"\s*(?:\/>|><\/rect>)/;
const K_GRUPO = /<g\s+transform="([^"]+)"\s*>([\s\S]*?)<\/g>/;
const K_BARRA =
  /<rect\s+x="(-?[\d.]+)"\s+y="(-?[\d.]+)"\s+width="([\d.]+)"\s+height="([\d.]+)"\s+fill="(#[0-9A-Fa-f]{6})"\s*(?:\/>|><\/rect>)/g;

/** As três barras de um ficheiro do diretor, com a geometria e a cor de cada. */
function barrasDoDiretor(fonte, deOnde) {
  const barras = [...fonte.matchAll(K_BARRA)].map((m) => ({
    x: Number(m[1]),
    y: Number(m[2]),
    largura: Number(m[3]),
    altura: Number(m[4]),
    cor: m[5].toUpperCase(),
    texto: m[0],
  }));
  if (barras.length !== 3) {
    throw new Error(
      `${deOnde}: esperava três barras e encontrei ${barras.length}. A marca são três ` +
        `linhas, a do meio mais curta (design/marca/direcoes-k/LEIA-ME.txt).`,
    );
  }
  return barras;
}

/**
 * A CELA DO TELEMÓVEL, DERIVADA DA CELA DO DIRETOR.
 *
 * Duas coisas mudam, e mais nenhuma:
 *
 * 1. O CAMPO PASSA A QUADRADO. Os cantos são do aparelho, e a razão longa está
 *    na cabeça desta secção. O ficheiro dele fica como está.
 *
 * 2. AS BARRAS ENCOLHEM PARA O `maskable`, SE PRECISAREM. Com a marca K não
 *    precisam, e `MARCAS.k.escalaDoMaskable` traz a conta que o diz.
 *
 * A redução, quando existe, vai num grupo DE FORA e não no grupo do diretor: o
 * dele já leva `transform`, e escrever outro por cima substituía-o em vez de se
 * compor com ele. É o mesmo erro que a §9 das NOTAS conta ter apanhado a 28.08,
 * do outro lado (lá era o CSS a ganhar ao atributo); num grupo de fora as duas
 * transformações compõem-se, que é o que se quer.
 */
function celaDoDiretor(fonte, deOnde, escala) {
  const campo = K_CAMPO.exec(fonte);
  if (!campo) throw new Error(`${deOnde}: não encontrei o campo, o <rect> de 512 com cantos`);
  const grupo = K_GRUPO.exec(fonte);
  if (!grupo) throw new Error(`${deOnde}: não encontrei o grupo das barras`);
  const barras = barrasDoDiretor(grupo[2], deOnde);
  const dentro = `<g transform="${grupo[1]}">${barras.map((b) => b.texto).join('')}</g>`;
  const corpo =
    escala === 1
      ? dentro
      : `<g transform="translate(256 256) scale(${escala}) translate(-256 -256)">${dentro}</g>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">` +
    `<rect x="0" y="0" width="512" height="512" fill="${campo[2]}"/>` +
    corpo +
    `</svg>`
  );
}

/**
 * O `favicon.svg` DA MARCA DO DIRETOR, composto das barras e não copiado delas.
 *
 * As formas saem do `favicon.svg` dele, que já é o sinal sobre campo
 * transparente; as cores do esquema escuro saem do `marca-cheia-escuro.svg`,
 * que é o mesmo desenho na paleta que ele desenhou para fundos de tinta. Nada
 * aqui é datilografado: nem uma coordenada, nem uma cor.
 *
 * Os retângulos passam a caminhos, e isso é a única mudança de espécie. É
 * preciso porque a régua do sítio conta um `<rect>` como CAMPO, e com razão: um
 * favicon com um retângulo lá dentro é, quase sempre, um favicon com um fundo
 * opaco. Um caminho diz a mesma forma sem dizer isso, e a régua compara-o
 * carácter a carácter com a barra de onde ele veio.
 *
 * E as classes são as palavras dele: as duas linhas de fora são o REGISTO, a
 * do meio é o VALOR. Vêm por ordem de aparecimento da cor, e não por posição,
 * para que duas barras da mesma cor partilhem a mesma regra.
 */
function componFaviconDasBarras(claro, escuro, deOnde, deOndeEscuro) {
  const asClaras = barrasDoDiretor(claro, deOnde);
  const asEscuras = barrasDoDiretor(escuro, deOndeEscuro);
  for (let i = 0; i < asClaras.length; i++) {
    const a = asClaras[i];
    const b = asEscuras[i];
    if (a.x !== b.x || a.y !== b.y || a.largura !== b.largura || a.altura !== b.altura) {
      throw new Error(
        `${deOndeEscuro}: a barra ${i + 1} mede ${b.largura}×${b.altura} em (${b.x},${b.y}) e a ` +
          `mesma barra de ${path.basename(deOnde)} mede ${a.largura}×${a.altura} em (${a.x},${a.y}). ` +
          `As duas paletas são do mesmo desenho; se as medidas divergem, isto não é a ` +
          `paleta escura, é outra marca.`,
      );
    }
  }
  const CLASSES = ['tinta', 'valor'];
  const ordem = [];
  for (const b of asClaras) if (!ordem.includes(b.cor)) ordem.push(b.cor);
  if (ordem.length !== CLASSES.length) {
    throw new Error(
      `${deOnde}: esperava duas cores nas barras, o registo e o valor, e encontrei ` +
        `${ordem.length} (${ordem.join(', ')}).`,
    );
  }
  const escuraDe = new Map();
  asClaras.forEach((b, i) => {
    const ja = escuraDe.get(b.cor);
    if (ja && ja !== asEscuras[i].cor) {
      throw new Error(
        `${deOndeEscuro}: a cor ${b.cor} tem duas cores escuras (${ja} e ${asEscuras[i].cor}).`,
      );
    }
    escuraDe.set(b.cor, asEscuras[i].cor);
  });
  const n = (v) => String(Number(v.toFixed(3)));
  const caminhoDa = (b) =>
    `M${n(b.x)} ${n(b.y)}H${n(b.x + b.largura)}V${n(b.y + b.altura)}H${n(b.x)}Z`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" ` +
    `aria-label="O Estado do País">\n` +
    `  <title>O Estado do País</title>\n` +
    `  <!-- FICHEIRO GERADO por design/marca/exportar.mjs app, das barras de\n` +
    `       ${path.relative(RAIZ, deOnde)}, com a paleta escura de\n` +
    `       ${path.basename(deOndeEscuro)}. Não se edita à mão.\n` +
    `       O ficheiro do diretor já é sem campo, e é essa a razão de ser este e\n` +
    `       não a cela que aqui entra: um favicon desenha-se sobre o separador do\n` +
    `       navegador, e a cor desse separador é do cliente e não do sítio. Daí a\n` +
    `       única regra que aqui se acrescenta, a da preferência de esquema. -->\n` +
    `  <style>\n` +
    ordem.map((cor, i) => `    .${CLASSES[i]} { fill: ${cor}; }\n`).join('') +
    `    @media (prefers-color-scheme: dark) {\n` +
    ordem.map((cor, i) => `      .${CLASSES[i]} { fill: ${escuraDe.get(cor)}; }\n`).join('') +
    `    }\n` +
    `  </style>\n` +
    asClaras
      .map((b) => `  <path class="${CLASSES[ordem.indexOf(b.cor)]}" d="${caminhoDa(b)}"/>\n`)
      .join('') +
    `</svg>\n`
  );
}

/**
 * A PÁGINA DE UM SVG QUE JÁ VEM PRONTO, sem temas nem formas.
 *
 * `pagina()` marca o SVG com `data-tema` e `data-forma` e troca a medida por
 * uma expressão sobre `width="512" height="512"`, que é o que os ficheiros de
 * `direcoes-e2/` precisam. Os do diretor não têm nem uma coisa nem outra, e a
 * expressão da medida apanharia neles o `<rect>` do campo, que também mede 512
 * por 512. Aqui a medida entra no `<svg ` e mais em sítio nenhum.
 */
function paginaDoSvg(svg, px) {
  return `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>
${svg.replace('<svg ', `<svg width="${px}" height="${px}" `)}`;
}

/**
 * O `favicon.svg`, COMPOSTO do SVG da direção e não copiado dele.
 *
 * O que se extrai são os dois caminhos do grupo `.sinal` e a transformação desse
 * grupo, e mais nada: o campo fica para trás, as regras de `data-tema` e de
 * `data-forma` ficam para trás (um favicon não tem nem uma coisa nem a outra), e
 * o que entra em troca é a única regra que um favicon precisa de ter, a da
 * preferência de esquema do cliente.
 *
 * **E o esquema aqui não é o do sítio.** O sítio é claro para toda a gente desde
 * a Emenda 12, e o escuro é uma escolha guardada no aparelho; um favicon não é
 * desenhado pelo sítio, é desenhado pelo navegador na barra de separadores dele,
 * e quem manda nessa barra é a preferência do sistema. São duas superfícies
 * diferentes com dois donos diferentes, e por isso `prefers-color-scheme` é a
 * pergunta certa aqui e continua a ser a pergunta errada lá.
 *
 * Se a estrutura do SVG de origem mudar, isto PÁRA em vez de escrever meio
 * ficheiro: um favicon com um caminho a menos é um «c».
 */
function componFaviconDoE(fonte, deOnde) {
  const grupo = /<g class="sinal" transform="([^"]+)">([\s\S]*?)<\/g>/.exec(fonte);
  if (!grupo) throw new Error(`${deOnde}: não encontrei o grupo <g class="sinal">`);
  const caminhos = [...grupo[2].matchAll(/<path class="tinta" d="([^"]+)"\s*\/>/g)].map((m) => m[1]);
  if (caminhos.length !== 2) {
    throw new Error(
      `${deOnde}: esperava 2 caminhos de tinta no grupo do sinal e encontrei ${caminhos.length}. ` +
        `O «e» são o anel e a barra; com outro número isto não é o «e».`,
    );
  }
  const tinta = /\.tinta\s*\{\s*fill:\s*(#[0-9a-f]{6})/i.exec(fonte);
  if (!tinta) throw new Error(`${deOnde}: não encontrei a cor da tinta`);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" ` +
    `aria-label="O Estado do País">\n` +
    `  <title>O Estado do País</title>\n` +
    `  <!-- FICHEIRO GERADO por design/marca/exportar.mjs app, do sinal de\n` +
    `       design/marca/direcoes-e2/${path.basename(deOnde)}. Não se edita à mão.\n` +
    `       O campo do original fica de fora: um favicon desenha-se sobre o\n` +
    `       separador do navegador, e a cor dele é do cliente e não do sítio. -->\n` +
    `  <style>\n` +
    `    .tinta { fill: ${tinta[1]}; }\n` +
    `    @media (prefers-color-scheme: dark) { .tinta { fill: #f6f7f4; } }\n` +
    `  </style>\n` +
    `  <g transform="${grupo[1]}">\n` +
    caminhos.map((d) => `    <path class="tinta" d="${d}"/>\n`).join('') +
    `  </g>\n` +
    `</svg>\n`
  );
}

/**
 * OS PÍXEIS DE UM PNG, LIDOS DOS BYTES.
 *
 * Serve duas coisas nesta ronda: medir o canal alfa do 180 (que tem de ser opaco
 * em todos os píxeis) e dar ao escritor do ICO a matéria-prima que ele precisa,
 * que é BGRA e não um PNG. Trata do que o Chromium escreve e mais nada — oito
 * bits por canal, sem entrelaçamento, cor 6 (RGBA) ou 2 (RGB) — e pára com o
 * nome do defeito em qualquer outro caso, em vez de devolver uma imagem errada.
 *
 * @returns {{ largura: number, altura: number, rgba: Buffer }}
 */
function lePng(bytes, deOnde) {
  const ASSINATURA = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!bytes.subarray(0, 8).equals(ASSINATURA)) throw new Error(`${deOnde}: não é um PNG`);
  let pos = 8;
  let ihdr = null;
  const idat = [];
  while (pos + 8 <= bytes.length) {
    const tamanho = bytes.readUInt32BE(pos);
    const tipo = bytes.toString('ascii', pos + 4, pos + 8);
    const corpo = bytes.subarray(pos + 8, pos + 8 + tamanho);
    if (tipo === 'IHDR') {
      ihdr = {
        largura: corpo.readUInt32BE(0),
        altura: corpo.readUInt32BE(4),
        bits: corpo[8],
        cor: corpo[9],
        compressao: corpo[10],
        filtro: corpo[11],
        entrelacado: corpo[12],
      };
    } else if (tipo === 'IDAT') idat.push(corpo);
    else if (tipo === 'IEND') break;
    pos += 12 + tamanho;
  }
  if (!ihdr) throw new Error(`${deOnde}: PNG sem IHDR`);
  if (ihdr.bits !== 8 || ihdr.entrelacado !== 0 || (ihdr.cor !== 6 && ihdr.cor !== 2)) {
    throw new Error(
      `${deOnde}: PNG de ${ihdr.bits} bits, cor ${ihdr.cor}, entrelaçado ${ihdr.entrelacado}. ` +
        `Este leitor só lê 8 bits, cor 2 ou 6, sem entrelaçamento.`,
    );
  }
  const canais = ihdr.cor === 6 ? 4 : 3;
  const bruto = zlib.inflateSync(Buffer.concat(idat));
  const passo = ihdr.largura * canais;
  const rgba = Buffer.alloc(ihdr.largura * ihdr.altura * 4);
  const linha = Buffer.alloc(passo);
  const anterior = Buffer.alloc(passo);
  for (let y = 0; y < ihdr.altura; y++) {
    const inicio = y * (passo + 1);
    const filtro = bruto[inicio];
    bruto.copy(linha, 0, inicio + 1, inicio + 1 + passo);
    for (let i = 0; i < passo; i++) {
      const a = i >= canais ? linha[i - canais] : 0;
      const b = anterior[i];
      const c = i >= canais ? anterior[i - canais] : 0;
      if (filtro === 1) linha[i] = (linha[i] + a) & 0xff;
      else if (filtro === 2) linha[i] = (linha[i] + b) & 0xff;
      else if (filtro === 3) linha[i] = (linha[i] + ((a + b) >> 1)) & 0xff;
      else if (filtro === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        linha[i] = (linha[i] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
      } else if (filtro !== 0) throw new Error(`${deOnde}: filtro PNG desconhecido (${filtro})`);
    }
    for (let x = 0; x < ihdr.largura; x++) {
      const o = (y * ihdr.largura + x) * 4;
      rgba[o] = linha[x * canais];
      rgba[o + 1] = linha[x * canais + 1];
      rgba[o + 2] = linha[x * canais + 2];
      rgba[o + 3] = canais === 4 ? linha[x * canais + 3] : 255;
    }
    linha.copy(anterior);
  }
  return { largura: ihdr.largura, altura: ihdr.altura, rgba };
}

/**
 * O ICO, escrito com uma imagem DIB de 32 bits por tamanho.
 *
 * A altura do cabeçalho de cada imagem é o DOBRO da altura real, e não é um
 * erro: o formato guarda a máscara AND de um bit por baixo da imagem, e o
 * cabeçalho conta as duas. A máscara vai a zeros — com 32 bits por píxel quem
 * manda na transparência é o canal alfa —, mas TEM de lá estar, porque quem lê o
 * ficheiro conta os bytes que o cabeçalho promete.
 *
 * As linhas escrevem-se de baixo para cima, que é a convenção do BMP.
 */
function componIco(imagens) {
  const cabecalho = Buffer.alloc(6 + 16 * imagens.length);
  cabecalho.writeUInt16LE(0, 0); // reservado
  cabecalho.writeUInt16LE(1, 2); // tipo: ícone
  cabecalho.writeUInt16LE(imagens.length, 4);

  const corpos = [];
  let deslocamento = cabecalho.length;
  imagens.forEach((imagem, i) => {
    const { largura: w, altura: h, rgba } = imagem;
    const bytesDaMascara = Math.ceil(w / 8);
    const passoDaMascara = Math.ceil(bytesDaMascara / 4) * 4;
    const corpo = Buffer.alloc(40 + w * h * 4 + passoDaMascara * h);
    corpo.writeUInt32LE(40, 0); // biSize
    corpo.writeInt32LE(w, 4); // biWidth
    corpo.writeInt32LE(h * 2, 8); // biHeight: a imagem e a máscara
    corpo.writeUInt16LE(1, 12); // biPlanes
    corpo.writeUInt16LE(32, 14); // biBitCount
    corpo.writeUInt32LE(0, 16); // biCompression: BI_RGB
    corpo.writeUInt32LE(w * h * 4 + passoDaMascara * h, 20); // biSizeImage
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const origem = ((h - 1 - y) * w + x) * 4;
        const destino = 40 + (y * w + x) * 4;
        corpo[destino] = rgba[origem + 2]; // B
        corpo[destino + 1] = rgba[origem + 1]; // G
        corpo[destino + 2] = rgba[origem]; // R
        corpo[destino + 3] = rgba[origem + 3]; // A
      }
    }
    /* A máscara AND fica a zeros: já está, o Buffer nasce a zeros. */
    const entrada = 6 + 16 * i;
    cabecalho[entrada] = w === 256 ? 0 : w;
    cabecalho[entrada + 1] = h === 256 ? 0 : h;
    cabecalho[entrada + 2] = 0; // cores da paleta: nenhuma
    cabecalho[entrada + 3] = 0; // reservado
    cabecalho.writeUInt16LE(1, entrada + 4); // planos
    cabecalho.writeUInt16LE(32, entrada + 6); // bits por píxel
    cabecalho.writeUInt32LE(corpo.length, entrada + 8);
    cabecalho.writeUInt32LE(deslocamento, entrada + 12);
    deslocamento += corpo.length;
    corpos.push(corpo);
  });
  return Buffer.concat([cabecalho, ...corpos]);
}

/** A ronda do telemóvel, de ponta a ponta. */
async function app(qual = 'k') {
  const marca = MARCAS[qual];
  if (!marca) {
    throw new Error(
      `marca desconhecida: ${qual}. As que há: ${Object.keys(MARCAS).join(', ')}.`,
    );
  }
  const precisa = [marca.cela, marca.sinal, ...(marca.escuro ? [marca.escuro] : [])];
  for (const f of precisa) if (!existsSync(f)) throw new Error(`não há ${f}`);
  if (!existsSync(PUBLIC)) throw new Error(`não há ${PUBLIC}`);
  console.log(`a marca: ${marca.nome}`);

  const svgDaCela = await readFile(marca.cela, 'utf8');
  const svgDoFavicon =
    marca.compor === 'barras'
      ? componFaviconDasBarras(
          await readFile(marca.sinal, 'utf8'),
          await readFile(marca.escuro, 'utf8'),
          marca.sinal,
          marca.escuro,
        )
      : componFaviconDoE(await readFile(marca.sinal, 'utf8'), marca.sinal);
  await writeFile(path.join(PUBLIC, 'favicon.svg'), svgDoFavicon, 'utf8');
  console.log(`favicon.svg: o sinal de ${path.basename(marca.sinal)}, sem campo`);

  const navegador = await chromium.launch();
  /* O esquema é CLARO à força. O `favicon.svg` traz a regra do escuro dentro, e
     o que o ICO leva é a versão de tinta: sem esta linha o ICO sairia do humor
     da máquina que correu a exportação. */
  const contexto = await navegador.newContext({ deviceScaleFactor: 1, colorScheme: 'light' });
  const pag = await contexto.newPage();

  try {
    for (const { nome, px, forma, opaco } of PNG_DO_APP) {
      /* A cela do diretor deriva-se aqui (o campo de bordo a bordo, e a escala
         das barras quando a forma é `maskable`); a de 28.08 leva as duas coisas
         na folha de estilos dela e vai por `pagina()`, como sempre foi. */
      const html =
        marca.compor === 'barras'
          ? paginaDoSvg(
              celaDoDiretor(
                svgDaCela,
                marca.cela,
                forma === 'maskable' ? marca.escalaDoMaskable : 1,
              ),
              px,
            )
          : pagina(svgDaCela, px, 'claro', forma);
      await pag.setViewportSize({ width: px, height: px });
      await pag.setContent(html);
      const bytes = await pag.screenshot({ omitBackground: false });
      const imagem = lePng(bytes, nome);
      if (imagem.largura !== px || imagem.altura !== px) {
        throw new Error(`${nome}: saiu ${imagem.largura}×${imagem.altura} e devia ser ${px}×${px}`);
      }
      if (opaco) {
        let transparentes = 0;
        for (let i = 3; i < imagem.rgba.length; i += 4) if (imagem.rgba[i] !== 255) transparentes++;
        if (transparentes) {
          throw new Error(
            `${nome}: ${transparentes} píxeis com alfa abaixo de 255. O iOS compõe este ` +
              `ficheiro sobre preto, e um canto transparente sai preto sem ninguém dar por isso.`,
          );
        }
      }
      await writeFile(path.join(PUBLIC, nome), bytes);
      console.log(`${nome}: ${px}×${px}, forma ${forma}${opaco ? ', opaco (medido)' : ''}`);
    }

    /* O ICO: os dois tamanhos, do MESMO ficheiro que o navegador serve como
       `favicon.svg`, com o fundo transparente. `omitBackground` verdadeiro é o
       que tira o branco que o Chromium põe por baixo de uma página. */
    const dentroDoIco = [];
    /* O ficheiro que sai para `public/` não leva `width` nem `height`, que é o
       que um favicon deve ser: um desenho que o cliente escala. Para o
       rasterizar é preciso dizer-lhe um tamanho, e é isto: a medida entra aqui,
       na página, e não no ficheiro publicado. */
    for (const px of TAMANHOS_DO_ICO) {
      await pag.setViewportSize({ width: px, height: px });
      await pag.setContent(paginaDoSvg(svgDoFavicon, px));
      const bytes = await pag.screenshot({ omitBackground: true });
      dentroDoIco.push(lePng(bytes, `favicon.ico(${px})`));
    }
    await writeFile(path.join(PUBLIC, 'favicon.ico'), componIco(dentroDoIco));
    console.log(`favicon.ico: ${TAMANHOS_DO_ICO.join(' e ')}, fundo transparente`);
  } finally {
    await navegador.close();
  }

  console.log(`\n${PNG_DO_APP.length + 2} ficheiros em public/`);
}

async function main() {
  if (process.argv[2] === 'app') return app(process.argv[3]);
  const ronda = RONDAS[process.argv[2] ?? ''] ?? null;
  const origem = ronda ? path.join(AQUI, ronda.origem) : DIRECOES;
  const destino = ronda ? path.join(AQUI, ronda.destino) : EXPORT;
  const lista = ronda ? ronda.tamanhos : TAMANHOS;
  if (process.argv[2] && !ronda) throw new Error(`ronda desconhecida: ${process.argv[2]}`);
  if (!existsSync(origem)) throw new Error(`não há ${origem}`);
  await mkdir(destino, { recursive: true });

  const ficheiros = (await readdir(origem)).filter((f) => f.endsWith('.svg')).sort();
  if (ficheiros.length === 0) throw new Error(`nenhum SVG em ${path.basename(origem)}/`);

  const navegador = await chromium.launch();
  const contexto = await navegador.newContext({ deviceScaleFactor: 1 });
  const pag = await contexto.newPage();

  let contados = 0;
  for (const ficheiro of ficheiros) {
    const slug = ficheiro.replace(/\.svg$/, '');
    const svg = await readFile(path.join(origem, ficheiro), 'utf8');
    const pasta = path.join(destino, slug);
    await mkdir(pasta, { recursive: true });
    for (const t of lista) {
      const forma = ronda ? t.forma : (TROCA_CEDO[slug]?.[t.nome] ?? t.forma);
      await pag.setViewportSize({ width: t.px, height: t.px });
      await pag.setContent(pagina(svg, t.px, t.tema, forma));
      const alvo = path.join(pasta, `${slug}-${t.nome}.png`);
      await pag.screenshot({ path: alvo, omitBackground: false });
      contados += 1;
    }
    if (ronda) continue;
    for (const nome of TAMANHOS_EXTRA[slug] ?? []) {
      const t = EXTRA[nome];
      await pag.setViewportSize({ width: t.px, height: t.px });
      await pag.setContent(pagina(svg, t.px, t.tema, t.forma));
      await pag.screenshot({ path: path.join(pasta, `${slug}-${nome}.png`) });
      contados += 1;
    }
    console.log(`${slug}: ${TAMANHOS.length + (TAMANHOS_EXTRA[slug]?.length ?? 0)} PNG`);
  }

  /* A prancha inteira, à largura que o brief pede. Só na ronda das direções: as
     células de uma grelha de exploração não entram na prancha. */
  const prancha = path.join(AQUI, 'PRANCHA.html');
  if (!ronda && existsSync(prancha)) {
    await pag.setViewportSize({ width: 1280, height: 1000 });
    await pag.goto(pathToFileURL(prancha).href, { waitUntil: 'load' });
    await pag.screenshot({ path: path.join(AQUI, 'PRANCHA.png'), fullPage: true });
    console.log('PRANCHA.png: 1280 de largura, página inteira');
  } else if (!ronda) {
    console.log('sem PRANCHA.html: a captura não foi feita');
  }

  await navegador.close();
  console.log(`${contados} PNG em ${path.relative(process.cwd(), destino)}`);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
