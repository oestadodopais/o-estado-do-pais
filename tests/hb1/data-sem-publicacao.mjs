import assert from 'node:assert/strict';
import {loadClaims,validateLedger} from '../../src/lib/ledger.mjs';
const id='hab-il-proposta',linhas=loadClaims({includeWithdrawn:true}),publicas=loadClaims(),original=linhas.get(id);
assert(original&&original.published_at==null,'a publicação inicial permanece desconhecida');
const errors=c=>{linhas.set(id,c);publicas.set(id,c);return validateLedger().errors.filter(e=>e.startsWith(`[${id}.yml]`));};
try {
 assert.deepEqual(errors(original),[]);
 for(const [nome,change,queixa] of [
  ['referência inventada',c=>{c.reference_date='2000-01-01';c.document.edition='2000-01-01';},'V2A data'],
  ['publicação inventada',c=>{c.published_at=c.reference_date;},'atualização não prova a publicação inicial'],
  ['selo alterado',c=>{c.document.source_sha256='0'.repeat(64);},'V2A data'],
 ]) {
  const bad=structuredClone(original);change(bad);assert(errors(bad).some(e=>e.includes(queixa)),nome);
  assert.deepEqual(errors(original),[]);console.log(`PLANTA HB1 ${nome}: vermelho 1, verde 0`);
 }
} finally {linhas.set(id,original);publicas.set(id,original);}
console.log('HB1: a atualização provada conserva a publicação inicial desconhecida.');
