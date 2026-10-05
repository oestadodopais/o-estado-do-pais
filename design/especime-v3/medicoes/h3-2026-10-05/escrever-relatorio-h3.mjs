/** H3: escreve `LEIA-ME.md` a partir do seu modelo (`LEIA-ME.modelo.md`, nesta pasta) e de `medidas.json`, na forma
 * do guião do R3 (`design/especime-v3/medicoes/r3-2026-10-04/escrever-relatorio-r3.mjs`).
 * Cada marca ⟦nome⟧ do modelo é o valor da medida com esse nome, escrito à maneira da casa (os milhares com um espaço,
 * a vírgula decimal); ⟦n_medidas⟧ é o número de medidas, ⟦cabeca_curta⟧ os oito primeiros caracteres da cabeça dos
 * portões, ⟦base_curta⟧ o commit do brief, e ⟦COMMITS⟧ a lista dos commits do bloco lida do Git. Uma marca sem medida,
 * ou uma medida sem valor, fecha a corrida: o relatório não leva um número que não esteja no ficheiro.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/h3-2026-10-05/escrever-relatorio-h3.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const PASTA = 'design/especime-v3/medicoes/h3-2026-10-05';
const BASE = execFileSync('git', ['log', '-1', '--format=%h', '--grep=^H3: o brief da passagem de higiene', 'HEAD'], { encoding: 'utf8' }).trim();
if (!BASE) throw new Error('A base do ramo (o commit do brief do H3) não está na história da cabeça.');
const medidas = JSON.parse(fs.readFileSync(path.join(PASTA, 'medidas.json'), 'utf8'));
const porNome = new Map(medidas.medidas.map((m) => [m.nome, m.valor]));
const formata = (v) => {
  if (typeof v === 'number') {
    const [inteira, decimal] = String(v).split('.');
    const sinal = inteira.startsWith('-') ? '−' : '';
    const comMilhares = inteira.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${sinal}${comMilhares}${decimal ? `,${decimal}` : ''}`;
  }
  if (typeof v === 'boolean') return v ? 'sim' : 'não';
  if (Array.isArray(v)) return v.map((x) => `«${x}»`).join(' e ');
  return String(v);
};
const commits = execFileSync('git', ['log', '--reverse', '--format=- `%h` %s', `${BASE}..HEAD`], { encoding: 'utf8' }).trim();
const cabeca = fs.readFileSync(path.join(PASTA, 'portoes', 'cabeca'), 'utf8').trim();
const modelo = fs.readFileSync(path.join(PASTA, 'LEIA-ME.modelo.md'), 'utf8');
const faltas = [];
const texto = modelo.replace(/⟦([^⟧]+)⟧/g, (_, nome) => {
  if (nome === 'COMMITS') return commits;
  if (nome === 'n_medidas') return formata(medidas.medidas.length);
  if (nome === 'cabeca_curta') return cabeca.slice(0, 8);
  if (nome === 'base_curta') return BASE;
  if (!porNome.has(nome) || porNome.get(nome) === 'NÃO LIDO') { faltas.push(nome); return `⟦${nome}⟧`; }
  return formata(porNome.get(nome));
});
if (faltas.length) {
  console.error(`escrever-relatorio-h3: ${faltas.length} marca(s) sem medida: ${faltas.join(', ')}`);
  process.exit(1);
}
fs.writeFileSync(path.join(PASTA, 'LEIA-ME.md'), texto);
console.log(`escrever-relatorio-h3: LEIA-ME.md escrito, ${(modelo.match(/⟦/g) ?? []).length} marca(s) cheia(s).`);
