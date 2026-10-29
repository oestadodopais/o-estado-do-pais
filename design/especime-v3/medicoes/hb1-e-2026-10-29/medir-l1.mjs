/** HB1-e: quatro recibos novos, uma referência repetida no estudo e a ordem da primeira página.
 * Uso: node .../medir-l1.mjs base <registo AMOSTRA=5000> <dist da cabeça de partida>
 *      node .../medir-l1.mjs <registo AMOSTRA=5000> [--escrever]
 * A fotografia de base exige stamp-version --preparar antes de astro build, como a construção normal.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
const pasta = 'design/especime-v3/medicoes/hb1-e-2026-10-29';
const origem = `${pasta}/l1-base.json`;
const estudos = ['/estudos/a-casa-em-portugal-e-na-europa', '/en/studies/a-casa-em-portugal-e-na-europa'];
const entradas = ['/', '/en'];
function lerMedicao(f) {
  const texto = fs.readFileSync(f, 'utf8').replace(/\x1b\[[0-9;]*m/g, '');
  const m = texto.match(/^ {2}L1 · páginas com dois destinos iguais fora da mobília +(\d+) +\(teto (\d+)\)/m);
  assert(m, 'Medição da L1 ausente');
  const paginas = Object.fromEntries([...texto.matchAll(/^ {6}· (\/\S*) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/gm)].map(x => [x[1], { destinos: Number(x[2]), exemplo: x[3], vezes: Number(x[4]) }]));
  assert.equal(Object.keys(paginas).length, Number(m[1]), 'Amostra incompleta');
  return { total: Number(m[1]), paginas };
}
function portas(dist, rota) {
  const r = parse(fs.readFileSync(path.join(dist, rota.replace(/^\//, ''), 'index.html'), 'utf8'));
  const c = {};
  for (const a of r.querySelectorAll('main a[href]')) { const h = a.getAttribute('href'); c[h] = (c[h] ?? 0) + 1; }
  return c;
}
if (process.argv[2] === 'base') {
  const medida = lerMedicao(process.argv[3]), dist = process.argv[4];
  const versao = JSON.parse(fs.readFileSync(path.join(dist, '../.astro/version.json')));
  assert.match(versao.commit, /^[a-f0-9]{40}$/);
  const links = Object.fromEntries([...entradas, ...estudos].map(p => [p, portas(dist, p)]));
  fs.writeFileSync(origem, JSON.stringify({ comando: 'stamp-version --preparar; astro build; AMOSTRA=5000 node scripts/check-lugar.mjs', commit: versao.commit, contagens: { estudos: medida.total }, paginas: medida.paginas, portas: links, nota: 'Fotografia dos ficheiros comitados da cabeça de partida. Só o HTML foi construído para medir a L1; esta medição não afirma aprovação dos portões.' }, null, 2) + '\n');
  console.log(`L1 base: ${medida.total} páginas; cabeça ${versao.commit}`);
  process.exit(0);
}
const base = JSON.parse(fs.readFileSync(origem, 'utf8'));
const atual = lerMedicao(process.argv[2]);
const novas = ['hab-ine-avaliacao-mediana', 'hab-ine-avaliacao-homologa'].flatMap(id => [`/livro-razao/${id}`, `/en/ledger/${id}`]).sort();
const links = Object.fromEntries([...entradas, ...estudos].map(p => [p, portas('dist', p)]));
function conferir(p, total, ls = links) {
  assert.equal(Object.keys(p).length, total, 'Amostra incompleta');
  assert.deepEqual(Object.keys(p).filter(k => !base.paginas[k]).sort(), novas, 'Páginas novas fora do mandato');
  for (const [k, v] of Object.entries(base.paginas)) {
    if (entradas.includes(k)) {
      assert.equal(p[k].destinos, v.destinos, 'Primeira página com destinos adicionais');
      assert.deepEqual(ls[k], base.portas[k], 'Primeira página com portas ou multiplicidades alteradas');
    } else if (estudos.includes(k)) {
      assert.deepEqual(p[k], { ...v, destinos: v.destinos + 1 }, 'Estudo com repetição fora do mandato');
      const prefixo = k.startsWith('/en/') ? '/en/ledger/' : '/livro-razao/';
      assert.deepEqual(ls[k], { ...base.portas[k], [prefixo + 'hab-ine-avaliacao-mediana']: 3, [prefixo + 'hab-ine-avaliacao-homologa']: 2 }, 'Portas do estudo fora das duas linhas');
    } else assert.deepEqual(p[k], v, `Página anterior alterada: ${k}`);
  }
  for (const k of novas) assert.deepEqual(p[k], { destinos: 1, exemplo: k.startsWith('/en/') ? '/en/method' : '/metodo', vezes: 2 }, 'Recibo novo com portas inesperadas');
}
conferir(atual.paginas, atual.total);
const plantas = [];
for (const [nome, mudar] of [
  ['recibo omitido', p => { delete p[novas[0]]; }],
  ['multiplicidade de recibo alterada', p => { p[novas[0]].vezes++; }],
  ['página anterior alterada', p => { p[Object.keys(base.paginas)[0]].destinos++; }],
  ['página indevida', p => { p['/planta-hb1-e'] = { destinos: 1, exemplo: '/metodo', vezes: 2 }; }],
]) {
  const p = structuredClone(atual.paginas); mudar(p);
  assert.throws(() => conferir(p, Object.keys(p).length), undefined, nome); plantas.push({ nome, recusada: true });
}
assert.throws(() => conferir(atual.paginas, atual.total + 1)); plantas.push({ nome: 'contagem divergente da régua', recusada: true });
for (const k of ['/', estudos[0]]) {
  const ls = structuredClone(links); ls[k]['/planta-hb1-e'] = 2;
  assert.throws(() => conferir(atual.paginas, atual.total, ls)); plantas.push({ nome: `porta indevida em ${k}`, recusada: true });
}
const registo = { comando: 'AMOSTRA=5000 npm run check:lugar', cabeca: JSON.parse(fs.readFileSync('dist/version.json')), base: { medicao: origem, paginas: base.contagens.estudos }, contagens: { estudos: atual.total, novas: novas.length, retiradas: 0 }, novas, paginas: atual.paginas, portas: links, plantas, razao: 'Quatro recibos novos. O estudo cita a mediana nas secções 6 e 11, acrescentando um destino repetido por edição. Na primeira página, a data declarada muda a ordem, sem mudar destinos nem multiplicidades. As restantes páginas conservam a medição da cabeça de partida. A regra da L1 não mudou.' };
if (process.argv.includes('--escrever')) {
  fs.writeFileSync(`${pasta}/l1-hb1e.json`, JSON.stringify(registo, null, 2) + '\n');
  fs.writeFileSync('scripts/lugar-tetos-b1.json', JSON.stringify({ l1_paginas: atual.total, medicao: `${pasta}/l1-hb1e.json` }, null, 2) + '\n');
}
console.log(JSON.stringify({ codigo: 0, antes: base.contagens.estudos, depois: atual.total, plantas }));
