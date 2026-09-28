/** C1d: o mesmo validador que build e verify chamam recusa perder a história. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadClaims, validateLedger } from '../../src/lib/ledger.mjs';
const linhas = loadClaims();
const id = 'divida-das-familias-2025-ue';
const original = linhas.get(id);
assert.deepEqual(validateLedger().errors, []);
const plantas = [];
for (const [nome, muda, falha] of [
  ['valor editado depois da atualização', c => { c.value = '49,4'; }, '"value" é 49,4, mas o último "new_value" é 49,2.'],
  ['atualização retirada', c => { c.corrections = c.corrections.filter(x => x.kind !== 'atualizacao'); }, 'uma entrada selada foi retirada ou alterada.'],
  ['valor anterior inventado', c => { c.corrections.find(x => x.kind === 'atualizacao').old_value = '49,1'; }, '"old_value" é 49,1, mas antes vigorava 49,3.'],
  ['valor fora da forma da casa', c => { c.value = '49.2'; }, '"value" é 49.2, mas o último "new_value" é 49,2.'],
]) {
  const c = structuredClone(original); muda(c); linhas.set(id, c);
  try {
    const erros = validateLedger().errors;
    assert.ok(erros.some(e => e.includes(falha)), `${nome}: ${erros.join('\n')}`);
    plantas.push({ nome, falha, erros, mordeu: true });
  } finally { linhas.set(id, original); }
}
assert.deepEqual(validateLedger().errors, []);
const r = { controlos: 2, plantas };
const i = process.argv.indexOf('--json');
if (i >= 0) fs.writeFileSync(process.argv[i+1], JSON.stringify(r, null, 2)+'\n');
console.log(`História do valor: ${r.controlos} controlos e ${plantas.length} plantas.`);
