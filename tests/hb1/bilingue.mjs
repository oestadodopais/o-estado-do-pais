import assert from 'node:assert/strict';
import { loadClaims, validateLedger, atribuicaoDaLinha } from '../../src/lib/ledger.mjs';
import { nomeDaFonteNoRecibo } from '../../src/lib/o-que-e-o-numero.mjs';
const linhas = loadClaims({includeWithdrawn:true});
const publicas = loadClaims();
const id = 'hab-imprensa-feridos35';
const original = linhas.get(id);
assert.ok(original?.name && original.attributed_to?.length);
const bilingue = structuredClone(original);
bilingue.name_en = original.name;
bilingue.measure = original.name;
bilingue.measure_en = original.name;
bilingue.attributed_to_en = [...original.attributed_to];
function errosDaLinha(c) {
 linhas.set(id, c); publicas.set(id,c);
 return validateLedger().errors.filter(e => e.startsWith(`[${id}.yml]`));
}
try {
 assert.deepEqual(errosDaLinha(bilingue), []);
 assert.equal(atribuicaoDaLinha(bilingue,'en'),bilingue.attributed_to_en.join(' · '));
 assert.deepEqual(nomeDaFonteNoRecibo(id,'pt'), {campo:'name',valor:original.name});
 assert.deepEqual(nomeDaFonteNoRecibo(id,'en'), {campo:'name_en',valor:original.name});
 const semTraducao = structuredClone(bilingue);delete semTraducao.name_en;
 linhas.set(id,semTraducao);publicas.set(id,semTraducao);
 assert.deepEqual(nomeDaFonteNoRecibo(id,'en'), {campo:'name',valor:original.name});
 for (const [nome,alterar,queixa] of [
  ['nome inglês vazio',c=>c.name_en='', 'name_en precisa de texto'],
  ['nome inglês sem original',c=>delete c.name,'name_en precisa do rótulo original'],
  ['medida inglesa sem original',c=>delete c.measure,'measure_en precisa da medida original'],
  ['atribuição inglesa escalar',c=>c.attributed_to_en=c.attributed_to_en[0],'attributed_to_en precisa da lista'],
  ['atribuição inglesa com entidade a mais',c=>c.attributed_to_en.push(c.attributed_to_en[0]),'attributed_to_en precisa da lista'],
 ]) {
  const alterada=structuredClone(bilingue);alterar(alterada);
  assert.ok(errosDaLinha(alterada).some(e=>e.includes(queixa)),nome);
  console.log(`PLANTA bilingue: ${nome}, recusada`);
 }
 assert.deepEqual(errosDaLinha(bilingue),[]);
} finally { linhas.set(id,original); publicas.set(id,original); }
console.log('HB1: campos bilingues, seleção no recibo e fallback conferidos.');
