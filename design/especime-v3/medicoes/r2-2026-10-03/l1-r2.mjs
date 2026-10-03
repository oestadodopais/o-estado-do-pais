/** R2 (03.10.2026): a L1 do `check:lugar` página a página, antes e depois do bloco.
 *
 * Corre a régua da casa (`scripts/check-lugar.mjs`) sobre o `dist/` desta árvore com `AMOSTRA` alta, para ela escrever
 * todas as páginas da L1 e não seis, e compara com a lista que a mesma régua escreveu na construção da cabeça de
 * partida (d9b168b9, numa cópia de `git archive` fora da árvore, com o seu próprio `check-lugar.mjs`):
 * `l1-antes-check-lugar.txt`. Não conta melhor do que a régua: conta a mesma coisa, e diz que páginas entraram, que
 * páginas saíram e que páginas passaram a ter mais destinos repetidos. Escreve `l1-r2.json`.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r2-2026-10-03/l1-r2.mjs
 * Sai 0 quando nenhuma página entrou nem piorou; 1 se não.
 */
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { matchPath } from '../../../../src/lib/routes.mjs';

const PASTA = 'design/especime-v3/medicoes/r2-2026-10-03';
const r = spawnSync(process.execPath, ['scripts/check-lugar.mjs'], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env: { ...process.env, AMOSTRA: '100000' } });
const semCor = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
const lista = (texto) => {
  const m = new Map();
  for (const l of semCor(texto).split('\n')) {
    const x = l.match(/^\s+· (\S+) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/);
    if (x) m.set(x[1], { destinos: Number(x[2]), exemplo: x[3], vezes: Number(x[4]) });
  }
  return m;
};
const textoDepois = r.stdout + r.stderr;
fs.writeFileSync(`${PASTA}/l1-depois-check-lugar.txt`, semCor(textoDepois));
const depois = lista(textoDepois);
const antes = lista(fs.readFileSync(`${PASTA}/l1-antes-check-lugar.txt`, 'utf8'));
const linhaDaContagem = (t) => (semCor(t).match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto (\d+)\)/) ?? []).slice(1).map(Number);
const [contaDepois, tetoDepois] = linhaDaContagem(textoDepois);
const [contaAntes, tetoAntes] = linhaDaContagem(fs.readFileSync(`${PASTA}/l1-antes-check-lugar.txt`, 'utf8'));
const entraram = [...depois.keys()].filter((u) => !antes.has(u));
const sairam = [...antes.keys()].filter((u) => !depois.has(u));
const pioraram = [...depois.keys()].filter((u) => antes.has(u) && depois.get(u).destinos > antes.get(u).destinos);
const melhoraram = [...depois.keys()].filter((u) => antes.has(u) && depois.get(u).destinos < antes.get(u).destinos);
const familia = (u) => matchPath(u)?.key ?? '(sem rota)';
const saida = {
  o_que: 'A L1 do check:lugar página a página: a lista da construção da cabeça de partida (d9b168b9) e a de dist/, escritas pela régua da casa com AMOSTRA alta.',
  comando: 'AMOSTRA=100000 node scripts/check-lugar.mjs (em cada árvore, sobre a sua construção)',
  antes: { paginas: antes.size, contagem_impressa: contaAntes, teto: tetoAntes },
  depois: { paginas: depois.size, contagem_impressa: contaDepois, teto: tetoDepois, codigo: r.status },
  entraram: entraram.map((u) => ({ url: u, familia: familia(u), ...depois.get(u) })),
  sairam: sairam.map((u) => ({ url: u, familia: familia(u), ...antes.get(u) })),
  pioraram: pioraram.map((u) => ({ url: u, antes: antes.get(u).destinos, depois: depois.get(u).destinos })),
  melhoraram: melhoraram.map((u) => ({ url: u, antes: antes.get(u).destinos, depois: depois.get(u).destinos })),
  conhecido_positivo: { o_que: 'a lista de antes tem as páginas que a contagem impressa diz', encontrado: antes.size === contaAntes && depois.size === contaDepois },
};
fs.writeFileSync(`${PASTA}/l1-r2.json`, JSON.stringify(saida, null, 2) + '\n');
console.log(`L1: antes ${antes.size} (teto ${tetoAntes}), depois ${depois.size} (teto ${tetoDepois}); entraram ${entraram.length}, saíram ${sairam.length}, pioraram ${pioraram.length}, melhoraram ${melhoraram.length}; código da régua ${r.status}.`);
process.exitCode = entraram.length || pioraram.length || !saida.conhecido_positivo.encontrado ? 1 : 0;
