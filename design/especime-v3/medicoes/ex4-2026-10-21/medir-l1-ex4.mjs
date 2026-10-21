/** EX4-e: o aumento da L1 vem só das páginas novas do bloco, sem mudar a regra da contagem.
 * Corre `check:lugar` com AMOSTRA=5000 sobre o dist/ presente, lê as páginas que a L1 enumera
 * e compara-as com o conjunto do V2-b (retoma2/l1-destinos.json, 2782 páginas). Exige: a lista
 * enumerada tem o número que a régua imprime; nenhuma página anterior sai nem entra outra além
 * das novas; as novas são as páginas de linha das mesmas 83 linhas nas duas edições e as duas
 * edições da explicação de 2027. Quatro plantas provam que cada recusa morde.
 * Uso: node design/especime-v3/medicoes/ex4-2026-10-21/medir-l1-ex4.mjs [--teto] */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const pasta = 'design/especime-v3/medicoes/ex4-2026-10-21';
const saida = spawnSync('node', ['scripts/check-lugar.mjs'], { encoding: 'utf8', env: { ...process.env, AMOSTRA: '5000' }, maxBuffer: 1 << 28 });
const texto = saida.stdout + saida.stderr;
const regua = Number(texto.match(/^ {2}L1 · páginas com dois destinos iguais fora da mobília +(\d+) /m)[1]);
const paginas = Object.fromEntries([...texto.matchAll(/^ {6}· (\/\S*) · (\d+) destinos repetidos/gm)].map(m => [m[1], Number(m[2])]));
const anterior = Object.keys(JSON.parse(fs.readFileSync('design/especime-v3/medicoes/v2b-2026-10-12/retoma2/l1-destinos.json', 'utf8')).repetidos_por_pagina).sort();
const explicacoes = ['/en/explainers/dinheiro-do-estado-2027', '/explicacoes/dinheiro-do-estado-2027'];
function conferir(r) {
  const lista = Object.keys(r.paginas);
  assert.equal(lista.length, r.regua, 'EX4 L1: contagem diferente da régua');
  assert.deepEqual(anterior.filter(p => !(p in r.paginas)), [], 'EX4 L1: saiu uma página anterior');
  const novas = lista.filter(p => !anterior.includes(p)).sort();
  const pt = novas.filter(p => p.startsWith('/livro-razao/')).map(p => p.slice(13)).sort();
  const en = novas.filter(p => p.startsWith('/en/ledger/')).map(p => p.slice(11)).sort();
  assert.deepEqual(novas.filter(p => !p.startsWith('/livro-razao/') && !p.startsWith('/en/ledger/')), explicacoes, 'EX4 L1: entrou uma página que não é de linha nem a explicação de 2027');
  assert.equal(pt.length, 83, 'EX4 L1: as páginas de linha portuguesas não são 83');
  assert.deepEqual(en, pt, 'EX4 L1: as duas edições não têm as mesmas linhas');
  assert.ok(pt.every(id => /oe2027|oe-2027|oe-2026|oe2026/.test(id)), 'EX4 L1: linha nova fora do Orçamento');
  return { novas, linhas: pt };
}
const medida = conferir({ regua, paginas });
const plantas = [];
for (const [nome, mut, re] of [
  ['página anterior retirada', r => { delete r.paginas[anterior[0]]; r.regua--; }, /saiu uma página anterior/],
  ['página alheia acrescentada', r => { r.paginas['/planta'] = 1; r.regua++; }, /nem a explicação/],
  ['edição inglesa de uma linha em falta', r => { delete r.paginas['/en/ledger/' + medida.linhas[0]]; r.regua--; }, /mesmas linhas/],
  ['contagem diferente da régua', r => { r.regua++; }, /diferente da régua/],
]) { const copia = structuredClone({ regua, paginas }); mut(copia); assert.throws(() => conferir(copia), re); plantas.push({ nome, mordeu: true }); }
const r = {
  construcao: JSON.parse(fs.readFileSync('dist/version.json', 'utf8')).commit,
  comando: 'AMOSTRA=5000 node scripts/check-lugar.mjs',
  contagens: { estudos: regua, anteriores: anterior.length, novas: medida.novas.length },
  novas: { linhas_por_edicao: medida.linhas.length, explicacoes, linhas: medida.linhas },
  plantas,
  razao: 'A contagem integral coincide com a régua. O conjunto das 2782 páginas anteriores do V2-b permanece inteiro. Entram só as páginas de linha das 83 linhas do Mapa 2 da proposta de 2027 e da lei de 2026, nas duas edições, com a forma já contada (a porta da releitura e a do rodapé para o Método), e as duas edições da explicação de 2027 (as portas da prosa e das figuras para as mesmas linhas, como na de 2026). A regra da L1 não muda.',
};
fs.writeFileSync(pasta + '/l1-ex4.json', JSON.stringify(r, null, 2) + '\n');
if (process.argv.includes('--teto')) fs.writeFileSync('scripts/lugar-tetos-b1.json', JSON.stringify({ l1_paginas: regua, medicao: pasta + '/l1-ex4.json' }, null, 2) + '\n');
console.log(JSON.stringify({ construcao: r.construcao, contagens: r.contagens, plantas: plantas.length }));
