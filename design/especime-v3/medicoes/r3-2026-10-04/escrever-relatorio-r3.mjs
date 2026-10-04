/** R3: escreve `LEIA-ME.md` e `RESPOSTA-construtor-r3.md` a partir dos seus modelos (`LEIA-ME.modelo.md` e
 * `RESPOSTA.modelo.md`, nesta pasta) e de `medidas.json`.
 * Cada marca ⟦nome⟧ do modelo é o valor da medida com esse nome, escrito à maneira da casa (os milhares com um espaço,
 * a vírgula decimal); ⟦cabeca_dos_portoes_curta⟧ são os oito primeiros caracteres da cabeça dos portões, ⟦n_medidas⟧ o
 * número de medidas, e ⟦COMMITS⟧ a lista dos commits do bloco lida do Git. Uma marca sem medida, ou uma medida sem
 * valor, fecha a corrida: o relatório não leva um número que não esteja no ficheiro.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r3-2026-10-04/escrever-relatorio-r3.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const PASTA = 'design/especime-v3/medicoes/r3-2026-10-04';
const BASE = '358e3649';
const medidas = JSON.parse(fs.readFileSync(path.join(PASTA, 'medidas.json'), 'utf8'));
const porNome = new Map(medidas.medidas.map((m) => [m.nome, m.valor]));
const formata = (v) => {
  if (typeof v === 'number') {
    const [inteira, decimal] = String(v).split('.');
    const comMilhares = inteira.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return decimal ? `${comMilhares},${decimal}` : comMilhares;
  }
  if (typeof v === 'boolean') return v ? 'sim' : 'não';
  return String(v);
};
const commits = execFileSync('git', ['log', '--reverse', '--format=- `%h` %s', `${BASE}..HEAD`], { encoding: 'utf8' }).trim();
let falhou = false;
for (const [entrada, saida] of [['LEIA-ME.modelo.md', 'LEIA-ME.md'], ['RESPOSTA.modelo.md', 'RESPOSTA-construtor-r3.md']]) {
  const modelo = fs.readFileSync(path.join(PASTA, entrada), 'utf8');
  const faltas = [];
  const texto = modelo.replace(/⟦([^⟧]+)⟧/g, (_, nome) => {
    if (nome === 'COMMITS') return commits;
    if (nome === 'n_medidas') return formata(medidas.total_de_medidas);
    if (nome === 'cabeca_dos_portoes_curta') return String(porNome.get('cabeca_dos_portoes') ?? '').slice(0, 8);
    if (!porNome.has(nome) || porNome.get(nome) === 'NÃO LIDO') { faltas.push(nome); return `⟦${nome}⟧`; }
    return formata(porNome.get(nome));
  });
  if (faltas.length) {
    console.error(`escrever-relatorio-r3: ${entrada}: ${faltas.length} marca(s) sem medida: ${faltas.join(', ')}`);
    falhou = true;
    continue;
  }
  fs.writeFileSync(path.join(PASTA, saida), texto);
  console.log(`escrever-relatorio-r3: ${saida} escrito, ${(modelo.match(/⟦/g) ?? []).length} marca(s) cheia(s).`);
}
process.exitCode = falhou ? 1 : 0;
