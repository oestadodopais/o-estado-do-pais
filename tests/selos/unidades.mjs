import assert from 'node:assert/strict';
import {UNIDADES_DA_MEDIDA,unidadeDaMedida} from '../../src/lib/unidade-da-medida.mjs';
for(const unidade of UNIDADES_DA_MEDIDA) {
  for(const espaco of ['', ' ', '\u2009', '\u202f']) assert.deepEqual(unidadeDaMedida(espaco+unidade+','),{unidade,texto:espaco+unidade});
  assert.equal(unidadeDaMedida('  '+unidade),null);
  assert.equal(unidadeDaMedida('\n'+unidade),null);
  assert.notEqual(unidadeDaMedida(' '+unidade+'sufixo')?.unidade,unidade);
}
assert.equal(unidadeDaMedida(' milhões de euros,').unidade,'milhões de euros');
for(const t of [' para',' e',' em',' educação',' mil habitantes']) assert.equal(unidadeDaMedida(t),null);
console.log('SEL1: unidades, precedência e limites conferidos.');
