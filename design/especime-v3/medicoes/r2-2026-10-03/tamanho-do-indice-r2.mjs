/** R2 (04.10.2026): o tamanho do índice do livro-razão antes e depois do bloco, e o do seu cartão no feixe do desenho.
 *
 * Lê o tamanho em bytes de `livro-razao/index.html` na construção de partida (a pasta dada no argumento, a cópia de
 * `git archive` de d9b168b9) e na de `dist/`, e o tamanho do cartão `13-pagina-livro-razao.html` e o tecto nas duas
 * corridas do `design:feixe` guardadas em `entre-commits/` (antes e depois de mudar o número medido). Escreve
 * `tamanho-do-indice-r2.json`. O conhecido-positivo: o cartão aparece nas duas corridas, reprovado na primeira e aceite
 * na segunda.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r2-2026-10-03/tamanho-do-indice-r2.mjs <construção de partida>
 */
import fs from 'node:fs';
import path from 'node:path';

const PASTA = 'design/especime-v3/medicoes/r2-2026-10-03';
const base = process.argv[2];
const bytes = (f) => fs.statSync(f).size;
const semCor = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
const corrida = (n) => {
  const t = semCor(fs.readFileSync(`${PASTA}/entre-commits/${n}.log`, 'utf8'));
  const m = t.match(/13-pagina-livro-razao\.html\s+Páginas\s+(\d+)\s+(✓|✗)/);
  const tecto = t.match(/tecto ([\d.]+) KiB/);
  return { cartao_bytes: m ? Number(m[1]) : null, aceite: m ? m[2] === '✓' : null, tecto_kib: tecto ? Number(tecto[1]) : null };
};
const antes = bytes(path.join(base, 'livro-razao', 'index.html'));
const depois = bytes(path.join('dist', 'livro-razao', 'index.html'));
const primeira = corrida('design-feixe');
const segunda = corrida('design-feixe-depois');
const saida = {
  o_que: 'O tamanho do índice do livro-razão (bytes de HTML) na construção de d9b168b9 e na de dist/, e o cartão do índice no feixe do desenho nas duas corridas do design:feixe.',
  indice_antes_bytes: antes,
  indice_depois_bytes: depois,
  indice_diferenca_bytes: depois - antes,
  cartao_kib: primeira.cartao_bytes ? Number((primeira.cartao_bytes / 1024).toFixed(1)) : null,
  primeira_corrida: primeira,
  segunda_corrida: segunda,
  conhecido_positivo: { o_que: 'o cartão aparece nas duas corridas, reprovado na primeira e aceite na segunda', encontrado: primeira.aceite === false && segunda.aceite === true },
};
fs.writeFileSync(`${PASTA}/tamanho-do-indice-r2.json`, JSON.stringify(saida, null, 2) + '\n');
console.log(`índice: ${antes} → ${depois} bytes (${depois - antes}); cartão ${saida.cartao_kib} KiB; tecto ${primeira.tecto_kib} → ${segunda.tecto_kib} KiB; conhecido-positivo ${saida.conhecido_positivo.encontrado}.`);
process.exitCode = saida.conhecido_positivo.encontrado ? 0 : 1;
