#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * O PORTÃO DA LÍNGUA · o que é português numa página inglesa diz que o é
 * ---------------------------------------------------------------------------
 *
 * **I92** — a unidade de uma linha do livro-razão é um RÓTULO, e não uma
 * citação. Traduz-se onde há um facto de dicionário (`src/i18n/unidades.mjs`),
 * e onde não há rende-se em português com a marca da língua. As medidas dos
 * concelhos já tinham unidade nas duas línguas, escrita na definição da medida;
 * as linhas do livro-razão não tinham nenhuma, e foi isso que a leitura do
 * Codex de 29.08.2026 apanhou.
 *
 * ---------------------------------------------------------------------------
 * TRÊS CONFERÊNCIAS, E A PRIMEIRA É A QUE IMPEDE O SILÊNCIO
 * ---------------------------------------------------------------------------
 *   L1 · toda a unidade do livro-razão tem entrada no dicionário OU na lista
 *        das que ficam em português, e nenhuma tem as duas. Uma unidade nova
 *        fecha a construção em vez de se render em português por omissão;
 *   L2 · as tabelas não engordam sozinhas: uma entrada que nenhuma linha do
 *        livro-razão usa fecha a construção. É a mesma regra do inventário das
 *        frases — uma declaração que não se rende não é uma sentinela, é uma
 *        linha morta;
 *   L3 · em `dist/en`, nenhuma unidade em português sem `lang="pt-PT"`.
 *
 * ---------------------------------------------------------------------------
 * O POSITIVO CONHECIDO (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Um zero só conta depois de a régua ter visto um vermelho. As duas portas do
 * estrago plantado são variáveis de ambiente, como o `OEDP_DIRECAO` do portão
 * da voz e pela mesma razão — planta-se numa CÓPIA, e nunca no que a construção
 * publica:
 *
 *   · `OEDP_LEDGER_DIR` — um livro-razão de mentira, com uma unidade inventada,
 *     para ver L1 vermelha;
 *   · `OEDP_DIST` — uma cópia de `dist/` com uma marca tirada, para ver L3.
 *
 * E a régua traz o seu próprio positivo, corrido em cada construção: se a
 * edição inglesa render unidades e NENHUMA traduzida, o dicionário não está a
 * ser aplicado, e o zero de L3 não prova nada.
 *
 * Uso:  node scripts/check-lingua.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'node-html-parser';

import { loadClaims, POR_VERIFICAR } from '../src/lib/ledger.mjs';
import { UNIDADES, UNIDADES_EM_PORTUGUES } from '../src/i18n/unidades.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = process.env.OEDP_DIST ?? path.join(RAIZ, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const erros = [];

/* ================================================================== L1/L2 · */
/* as unidades do livro-razão, contra as duas tabelas                         */

const claims = [...loadClaims().values()];

const unidadesDoLivro = new Map();
for (const c of claims) {
  const u = c.unit === null || c.unit === undefined ? '' : String(c.unit);
  /* O marcador não é uma unidade: é a ausência de uma, e tem forma própria. */
  if (u === POR_VERIFICAR) continue;
  unidadesDoLivro.set(u, (unidadesDoLivro.get(u) ?? 0) + 1);
}

const semEntrada = [];
for (const [u] of unidadesDoLivro) {
  const noDicionario = Object.prototype.hasOwnProperty.call(UNIDADES, u);
  const emPortugues = Object.prototype.hasOwnProperty.call(UNIDADES_EM_PORTUGUES, u);
  if (noDicionario && emPortugues) {
    erros.push(
      `a unidade «${u}» está no dicionário E na lista das que ficam em português. ` +
        `Uma unidade traduz-se ou não se traduz; as duas coisas ao mesmo tempo dizem ` +
        `que ninguém decidiu.`,
    );
    continue;
  }
  if (!noDicionario && !emPortugues) semEntrada.push(u);
}
for (const u of semEntrada) {
  erros.push(
    `a unidade «${u}» (${unidadesDoLivro.get(u)} linha(s)) não tem entrada em ` +
      `src/i18n/unidades.mjs.\n` +
      `      Ou entra no dicionário, com o facto de dicionário ou o inglês que a casa já ` +
      `escreve para a mesma coisa,\n      ou entra em UNIDADES_EM_PORTUGUES com a razão pela ` +
      `qual fica em português. Uma unidade nova não se traduz sozinha.`,
  );
}
for (const u of Object.keys(UNIDADES)) {
  if (!unidadesDoLivro.has(u)) {
    erros.push(
      `o dicionário traduz a unidade «${u}», que nenhuma linha do livro-razão usa. ` +
        `Uma entrada que não se rende não é uma sentinela: é uma linha morta, e a tabela engorda.`,
    );
  }
}
for (const u of Object.keys(UNIDADES_EM_PORTUGUES)) {
  if (!unidadesDoLivro.has(u)) {
    erros.push(
      `UNIDADES_EM_PORTUGUES declara «${u}», que nenhuma linha do livro-razão usa. ` +
        `A lista das que ficam é uma lista do que existe, não do que já existiu.`,
    );
  }
}

/* ===================================================================== L3 · */

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DA LÍNGUA · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

/** O inglês que o dicionário produz, para reconhecer uma unidade já traduzida. */
const INGLES_DAS_UNIDADES = new Set(Object.values(UNIDADES));

function decodeEntities(s) {
  return String(s)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

const norm = (s) => decodeEntities(String(s)).replace(/\s+/g, ' ').trim();

/** A língua efectiva de um nó: o `lang` do ancestral mais próximo que o tenha. */
function langDe(no) {
  let n = no;
  while (n) {
    const l = n.getAttribute?.('lang');
    if (l) return l;
    n = n.parentNode;
  }
  return null;
}

function paginasDe(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...paginasDe(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const contas = {
  paginas: 0,
  unidades_en: 0,
  unidades_en_traduzidas: 0,
  unidades_en_em_portugues: 0,
  unidades_en_sem_marca: 0,
};
const achados = new Map();

for (const ficheiro of paginasDe(DIST)) {
  const root = parse(fs.readFileSync(ficheiro, 'utf8'));
  const lingua = root.querySelector('html')?.getAttribute('lang') ?? '';
  /* A edição, lida do documento e não do caminho: é o `lang` do `<html>` que o
     leitor de ecrã usa, e é contra ele que tudo aqui se mede. */
  if (!lingua.startsWith('en')) continue;
  contas.paginas++;
  const rel = path.relative(RAIZ, ficheiro);

  for (const el of root.querySelectorAll('[data-linha-campo="unit"]')) {
    const texto = norm(el.text);
    contas.unidades_en++;
    if (INGLES_DAS_UNIDADES.has(texto)) {
      contas.unidades_en_traduzidas++;
      continue;
    }
    contas.unidades_en_em_portugues++;
    if (langDe(el) !== 'pt-PT') {
      contas.unidades_en_sem_marca++;
      const x = achados.get(texto) ?? { n: 0, onde: rel };
      x.n++;
      achados.set(texto, x);
    }
  }
}

if (contas.paginas === 0) {
  erros.push(
    `nenhuma página inglesa lida em ${DIST}: sem páginas, o zero abaixo é o zero de uma ` +
      `varredura que não aconteceu.`,
  );
}
for (const [texto, x] of achados) {
  erros.push(
    `unidade em português sem lang="pt-PT" na edição inglesa: «${texto}» ` +
      `(${x.n} ocorrência(s), ex.: ${x.onde}).`,
  );
}
if (contas.unidades_en > 0 && contas.unidades_en_traduzidas === 0) {
  erros.push(
    `a edição inglesa rende ${contas.unidades_en} unidade(s) e nenhuma traduzida. ` +
      `O dicionário não está a ser aplicado, e o zero das que ficaram sem marca não prova nada.`,
  );
}

console.log('');
if (erros.length) {
  console.error(vermelho(`  PORTÃO DA LÍNGUA · ${erros.length} problema(s)\n`));
  for (const e of erros.slice(0, 40)) console.error(vermelho('    · ') + e);
  if (erros.length > 40) console.error(cinza(`    … e mais ${erros.length - 40}`));
  console.error('');
  process.exit(1);
}

console.log(
  verde('  língua ✓ ') +
    `${unidadesDoLivro.size} unidade(s) do livro-razão: ${Object.keys(UNIDADES).length} traduzida(s), ` +
    `${Object.keys(UNIDADES_EM_PORTUGUES).length} em português com razão escrita`,
);
console.log(
  cinza(
    `        ${contas.paginas} página(s) inglesa(s) lidas · unidades: ${contas.unidades_en} ` +
      `(${contas.unidades_en_traduzidas} traduzidas, ${contas.unidades_en_em_portugues} em ` +
      `português, todas com marca)`,
  ),
);
console.log('');
