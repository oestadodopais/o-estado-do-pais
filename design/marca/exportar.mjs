/**
 * OS PNG DE CADA DIREÇÃO, E A CAPTURA DA PRANCHA.
 *
 * Corre o Chromium que já está no repositório (`playwright`, dependência de
 * desenvolvimento do `package.json`) sobre os SVG de `design/marca/direcoes/`.
 * Nenhuma dependência nova, nada em `public/`, nada no `<head>` do sítio: isto
 * escreve para `design/marca/EXPORT/` e para `design/marca/PRANCHA.png`, e mais
 * lado nenhum.
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
 * USO: node design/marca/exportar.mjs
 */

import { chromium } from 'playwright';
import { readFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIRECOES = path.join(AQUI, 'direcoes');
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

async function main() {
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
