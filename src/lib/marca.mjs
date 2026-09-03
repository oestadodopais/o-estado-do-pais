/**
 * =============================================================================
 * O SINAL DA MARCA, LIDO DO FICHEIRO QUE O NAVEGADOR JÁ SERVE
 * =============================================================================
 *
 * O cabeçalho leva o «e» ao lado do nome (diretor, 28.08.2026), e este módulo é
 * de onde o gabarito o tira. Lê `public/favicon.svg` na construção e devolve os
 * caminhos que estão lá dentro. Não desenha nada e não guarda uma segunda cópia
 * do desenho.
 *
 * PORQUE É QUE LÊ O FAVICON E NÃO O SVG DA DIREÇÃO. São a mesma forma, e é
 * exactamente por isso: o `favicon.svg` já é uma composição de
 * `design/marca/direcoes-e2/e2-unida-28.svg`, feita por
 * `design/marca/exportar.mjs app`, e ler a origem outra vez daria uma SEGUNDA
 * derivação da mesma coisa — duas derivações divergem no dia em que uma delas
 * for corrigida. Assim há uma só, e o que o separador do navegador mostra é, aos
 * mesmos contornos, o que o cabeçalho mostra.
 *
 * O QUE ESTE MÓDULO NÃO TRAZ: a cor. O ficheiro do favicon traz a tinta lá
 * dentro e a regra do escuro do SISTEMA, porque um separador de navegador é do
 * navegador; o cabeçalho é do sítio, onde o escuro é a escolha do leitor
 * (Emenda 12), e por isso o sinal do cabeçalho pinta-se com `currentColor` e
 * herda a tinta do tema. Em claro é tinta; em escuro é o papel. É a mesma forma
 * a obedecer a dois donos diferentes, e cada um manda no que é dele.
 *
 * A CAIXA É A DA TINTA, e não a do ficheiro. O `viewBox` do favicon é o quadrado
 * de 512 do ícone, e a tinta ocupa lá dentro um quadrado de 360 a começar em
 * (76, 76) — medido, não suposto: `getBoundingClientRect()` de cada caminho num
 * Chromium 148, com o SVG a 512 px. Recortar o `viewBox` a esse quadrado é o que
 * faz `height: 0.66em` na folha querer dizer «a tinta mede a altura de maiúscula
 * do nome», que é a âncora B da `design/marca/NOTAS.md` §5. Com o `viewBox` do
 * ficheiro, `0.66em` seria a altura da CAIXA e a tinta ficaria a 0,46em.
 *
 * Se a estrutura do favicon mudar, isto PÁRA a construção em vez de render meio
 * sinal: um «e» sem a barra é um «c».
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * A raiz do repositório, procurada a subir, como em `src/lib/mapa.mjs` e
 * `src/lib/prova.mjs` e pela mesma razão: na construção, este módulo já não vive
 * em `src/lib/` — vive num pedaço empacotado dentro do `dist/`, e `import.meta.url`
 * apontaria para lá. Procura-se o ficheiro que a raiz tem e mais ninguém.
 */
function encontraRaiz() {
  /** @param {string} inicio */
  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      if (fs.existsSync(path.join(dir, 'public', 'favicon.svg'))) return dir;
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
    return null;
  };
  return (
    subir(process.cwd()) ?? subir(path.dirname(fileURLToPath(import.meta.url))) ?? process.cwd()
  );
}

const FAVICON = path.join(encontraRaiz(), 'public', 'favicon.svg');

/**
 * A caixa da tinta dentro do `viewBox` de 512 do ícone, medida no navegador.
 *
 * `tests/inicio/app.mjs` volta a medi-la a partir do ficheiro construído e
 * fecha se ela deixar de ser esta: um número escrito à mão que ninguém reconfere
 * é um número que fica errado no dia em que o desenho mudar.
 */
export const CAIXA_DA_TINTA = { x: 76, y: 76, lado: 360 };

/**
 * A GEOMETRIA DO LOCKUP, de `design/marca/NOTAS.md` §6 bis, item 6.
 *
 * As duas medidas saíram de olhar a marca a 1:1 e não de uma proporção
 * escolhida, e é por isso que estão aqui com o nome delas:
 *
 *   `altura`  · 1 altura de maiúscula do nome. É a âncora B: o sinal à altura de
 *              maiúscula do cabeçalho, que é a única das duas âncoras que não
 *              obriga a mexer no cabeçalho. A caixa de tinta fica a mesma que
 *              hoje, e a régua das sete larguras mede-o.
 *   `folga`   · 0,42 da altura de maiúscula. Subiu de 0,30 para 0,42 ao ver a
 *              marca a 1:1: com 0,30 o anel do «e» e o «O» de «O Estado»
 *              ficavam quase encostados, e duas formas redondas encostadas leem-
 *              se como uma só.
 *
 * A altura de maiúscula do Spectral é 660 em 1000 de em, lida da tabela `OS/2`
 * do ficheiro da casa (NOTAS §8), e é o que transforma estas duas frações em
 * `em` na folha de estilos.
 */
export const LOCKUP = { capEm: 0.66, alturaEmCap: 1, folgaEmCap: 0.42 };

/**
 * O sinal: o `transform` do grupo e os dois caminhos, tal como estão no favicon.
 *
 * @returns {{ viewBox: string, transform: string, caminhos: string[] }}
 */
export function sinalDaMarca() {
  let cru;
  try {
    cru = fs.readFileSync(FAVICON, 'utf8');
  } catch (/** @type {any} */ erro) {
    throw new Error(
      `não consegui ler public/favicon.svg (${erro.message}). ` +
        `É o ficheiro de onde o cabeçalho tira o sinal, e gera-se com ` +
        `\`node design/marca/exportar.mjs app\`.`,
    );
  }
  const grupo = /<g transform="([^"]+)">([\s\S]*?)<\/g>/.exec(cru);
  if (!grupo) throw new Error('public/favicon.svg: não encontrei o grupo do sinal.');
  const caminhos = [...grupo[2].matchAll(/<path class="tinta" d="([^"]+)"\s*\/>/g)].map((m) => m[1]);
  if (caminhos.length !== 2) {
    throw new Error(
      `public/favicon.svg: esperava 2 caminhos e encontrei ${caminhos.length}. ` +
        `O «e» são o anel e a barra; com outro número isto não é o «e».`,
    );
  }
  const { x, y, lado } = CAIXA_DA_TINTA;
  return { viewBox: `${x} ${y} ${lado} ${lado}`, transform: grupo[1], caminhos };
}
