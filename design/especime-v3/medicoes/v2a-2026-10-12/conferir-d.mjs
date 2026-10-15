/** V2-a-d: fotografia dos portões e comparação com a cabeça de entrada. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {load} from 'js-yaml';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {resultado} from '../../../../tests/linha/v2a.mjs';
const base='62165d25',claims=loadClaims();
for(const id of new Set(resultado.resultados.map(r=>r.id))) {
  const old=load(execFileSync('git',['show',`${base}:ledger/claims/${id}.yml`],{encoding:'utf8'})),now=claims.get(id);
  assert.deepEqual([now.value,now.unit],[old.value,old.unit],`V2AD valor alterado: ${id}`);
}
fs.writeFileSync('design/especime-v3/medicoes/v2a-2026-10-12/inspecao-d.json',JSON.stringify({base,...resultado},null,2)+'\n');
console.log('V2AD: os 18 valores e unidades coincidem com a cabeça de entrada.');
