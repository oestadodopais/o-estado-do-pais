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
  '180-letra': { px: 180, tema: 'claro', forma: 'favicon' },
  '180-letra-escuro': { px: 180, tema: 'escuro', forma: 'favicon' },
};

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

async function main() {
  if (!existsSync(DIRECOES)) throw new Error(`não há ${DIRECOES}`);
  await mkdir(EXPORT, { recursive: true });

  const ficheiros = (await readdir(DIRECOES)).filter((f) => f.endsWith('.svg')).sort();
  if (ficheiros.length === 0) throw new Error('nenhum SVG em direcoes/');

  const navegador = await chromium.launch();
  const contexto = await navegador.newContext({ deviceScaleFactor: 1 });
  const pag = await contexto.newPage();

  let contados = 0;
  for (const ficheiro of ficheiros) {
    const slug = ficheiro.replace(/\.svg$/, '');
    const svg = await readFile(path.join(DIRECOES, ficheiro), 'utf8');
    const pasta = path.join(EXPORT, slug);
    await mkdir(pasta, { recursive: true });
    for (const t of TAMANHOS) {
      const forma = TROCA_CEDO[slug]?.[t.nome] ?? t.forma;
      await pag.setViewportSize({ width: t.px, height: t.px });
      await pag.setContent(pagina(svg, t.px, t.tema, forma));
      const destino = path.join(pasta, `${slug}-${t.nome}.png`);
      await pag.screenshot({ path: destino, omitBackground: false });
      contados += 1;
    }
    for (const nome of TAMANHOS_EXTRA[slug] ?? []) {
      const t = EXTRA[nome];
      await pag.setViewportSize({ width: t.px, height: t.px });
      await pag.setContent(pagina(svg, t.px, t.tema, t.forma));
      await pag.screenshot({ path: path.join(pasta, `${slug}-${nome}.png`) });
      contados += 1;
    }
    console.log(`${slug}: ${TAMANHOS.length + (TAMANHOS_EXTRA[slug]?.length ?? 0)} PNG`);
  }

  /* A prancha inteira, à largura que o brief pede. */
  const prancha = path.join(AQUI, 'PRANCHA.html');
  if (existsSync(prancha)) {
    await pag.setViewportSize({ width: 1280, height: 1000 });
    await pag.goto(pathToFileURL(prancha).href, { waitUntil: 'load' });
    await pag.screenshot({ path: path.join(AQUI, 'PRANCHA.png'), fullPage: true });
    console.log('PRANCHA.png: 1280 de largura, página inteira');
  } else {
    console.log('sem PRANCHA.html: a captura não foi feita');
  }

  await navegador.close();
  console.log(`${contados} PNG em ${path.relative(process.cwd(), EXPORT)}`);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
