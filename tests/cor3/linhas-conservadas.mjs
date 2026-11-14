import assert from 'node:assert/strict';
import {conferirNomeEo1, provasDosNomesEo1} from '../../scripts/nomes-eo1-do-portao.mjs';
import {NOMES_EO1} from '../../src/data/nomes-eo1.mjs';
for (const id of ['utao-salarios-irs','der-salarios-publicos-retorno-pct']) for (const lang of ['pt','en']) {
  const provas = provasDosNomesEo1({});
  assert.equal(conferirNomeEo1(id,lang,NOMES_EO1[id][lang],provas),null);
  assert(conferirNomeEo1(id,lang,NOMES_EO1[id][lang]+' adulterado',provas));
  assert(conferirNomeEo1(id,lang,NOMES_EO1[id][lang],{}));
  delete provas[id];
  assert(conferirNomeEo1(id,lang,NOMES_EO1[id][lang],provas));
}
const id=Object.keys(NOMES_EO1).find(id=>!['utao-salarios-irs','der-salarios-publicos-retorno-pct'].includes(id));
assert(conferirNomeEo1(id,'pt',NOMES_EO1[id].pt,provasDosNomesEo1({})));
console.log('COR3: duas linhas conservadas com prova selada explícita; nome alterado e prova retirada recusados.');
