import assert from 'node:assert/strict';
import {UNIDADES_DA_MEDIDA,unidadeDaMedida} from '../../src/lib/unidade-da-medida.mjs';
for(const unidade of UNIDADES_DA_MEDIDA) {
  for(const espaco of ['', ' ', '\u2009', '\u202f', '\u00a0', '  ', '\n  ', '&nbsp;']) assert.deepEqual(unidadeDaMedida(espaco+unidade+','),{unidade,texto:espaco+unidade});
  assert.notEqual(unidadeDaMedida(' '+unidade+'sufixo')?.unidade,unidade);
}
assert.equal(unidadeDaMedida(' milhões de euros,').unidade,'milhões de euros');
for(const t of [' para',' e',' em',' educação']) assert.equal(unidadeDaMedida(t),null);
console.log('SEL1: unidades, precedência e limites conferidos.');

for(const texto of [' milhões de euros por mês', ' pontos do PIB', ' % do produto interno bruto (o PIB) por ano', ' million euros per month per inhabitant', ' de outubro de 2026', ' October 2026']) {
 assert.equal(unidadeDaMedida(texto+', fim').texto,texto);
}
assert.equal(unidadeDaMedida('pXpX'),null);
