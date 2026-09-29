#!/usr/bin/env node
/**
 * PP1 · A COMPOSIÇÃO DA CATRACA L1, antes e depois do bloco (28.09.2026).
 *
 * A L1 do `check:lugar` conta as páginas com dois destinos iguais fora da mobília, e o teto só sobe
 * com a razão medida e inteira: que páginas entraram, que páginas saíram, e nenhuma página antiga
 * agravada. Este guião corre a MESMA régua de cada cabeça sobre a construção dessa cabeça, com a
 * amostra aberta (`AMOSTRA` alta), e compara as duas listas:
 *
 *   · antes: a árvore da cabeça de partida, extraída com `git archive` para uma pasta fora do
 *     repositório, com a construção dessa cabeça ao lado como `dist/`;
 *   · depois: esta árvore, com a sua construção.
 *
 * As páginas que podem entrar, ou ficar com mais destinos repetidos, são as que o bloco fez de novo ou
 * refez: a primeira página, nas duas edições, e as dez páginas das entradas. Uma entrada fora destas,
 * uma página que sai, ou uma página que o bloco não refez com mais destinos repetidos, fecha o guião
 * com 1. A primeira página agravada diz-se com os dois números.
 *
 * Uso: node design/especime-v3/medicoes/pp1-2026-09-28/medir-l1-pp1.mjs <árvore de antes>
 *      (a árvore de antes tem de ter `dist/` e `node_modules/`; o caminho não se escreve em ficheiro
 *      nenhum: o registo guarda as cabeças, lidas do `version.json` de cada construção)
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ENTRADAS } from '../../../../src/data/primeira-pagina.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const antesDir = process.argv[2];
if (!antesDir || !fs.existsSync(path.join(antesDir, 'dist', 'version.json'))) {
  console.error('medir-l1-pp1 · falta a árvore de antes, com dist/ construído.');
  process.exit(2);
}
/** Corre a régua de uma árvore e devolve as páginas da L1 com a linha que a régua escreve. @param {string} dir */
function paginasDaL1(dir) {
  let saida = '';
  try {
    saida = execFileSync(process.execPath, ['scripts/check-lugar.mjs'], { cwd: dir, encoding: 'utf8', env: { ...process.env, AMOSTRA: '1000000' }, maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    saida = String(/** @type {any} */ (e).stdout ?? '');
  }
  const linhas = saida.split('\n');
  const i = linhas.findIndex((l) => l.includes('L1 · páginas com dois destinos iguais fora da mobília'));
  if (i < 0) throw new Error('a régua não imprimiu a L1');
  const total = Number(/mobília\s+(\d+)/.exec(linhas[i])?.[1]);
  /** @type {Map<string, { destinos: number, exemplo: string }>} */
  const paginas = new Map();
  for (const l of linhas.slice(i + 1)) {
    const m = /^\s+· (\S+) · (\d+) destinos repetidos \(ex\.: (.+)\)$/.exec(l);
    if (!m) break;
    paginas.set(m[1], { destinos: Number(m[2]), exemplo: m[3] });
  }
  if (paginas.size !== total) throw new Error(`a régua disse ${total} páginas e a amostra tem ${paginas.size}`);
  return { total, paginas };
}
const cabeca = (/** @type {string} */ dir) => JSON.parse(fs.readFileSync(path.join(dir, 'dist', 'version.json'), 'utf8')).commit;
const antes = paginasDaL1(antesDir);
const depois = paginasDaL1(RAIZ);
const permitidas = new Set(['/', '/en', ...ENTRADAS.filter((e) => !('existente' in e && e.existente)).flatMap((e) => [e.rota.pt, e.rota.en]).map((r) => r.replace(/\/$/, ''))]);
const entraram = [...depois.paginas.keys()].filter((p) => !antes.paginas.has(p));
const sairam = [...antes.paginas.keys()].filter((p) => !depois.paginas.has(p));
const agravadas = [...antes.paginas.keys()].filter((p) => depois.paginas.has(p) && /** @type {any} */ (depois.paginas.get(p)).destinos > /** @type {any} */ (antes.paginas.get(p)).destinos);
const fora = entraram.filter((p) => !permitidas.has(p));
const agravadasFora = agravadas.filter((p) => !permitidas.has(p));
const saida = {
  o_que_e: 'A composição da L1 do check:lugar antes e depois do bloco PP1: cada cabeça medida com a sua própria régua, sobre a sua própria construção, com a amostra aberta.',
  comando: 'node design/especime-v3/medicoes/pp1-2026-09-28/medir-l1-pp1.mjs <árvore da cabeça de partida>',
  cabeca_antes: cabeca(antesDir),
  cabeca_depois: cabeca(RAIZ),
  contagens: { estudos: depois.total, antes: antes.total, entraram: entraram.length, sairam: sairam.length, paginas_refeitas_agravadas: agravadas.length - agravadasFora.length, paginas_antigas_agravadas: agravadasFora.length, outras_entradas: fora.length },
  permitidas: [...permitidas],
  entraram: entraram.map((p) => ({ url: p, ...depois.paginas.get(p) })),
  sairam,
  agravadas: agravadas.map((p) => ({ url: p, destinos_antes: /** @type {any} */ (antes.paginas.get(p)).destinos, destinos_depois: /** @type {any} */ (depois.paginas.get(p)).destinos, exemplo_antes: /** @type {any} */ (antes.paginas.get(p)).exemplo, exemplo_depois: /** @type {any} */ (depois.paginas.get(p)).exemplo })),
  fora,
};
fs.writeFileSync(path.join(AQUI, 'l1-pp1.json'), JSON.stringify(saida, null, 2) + '\n');
console.log(JSON.stringify(saida.contagens));
if (fora.length || sairam.length || agravadasFora.length) process.exit(1);
