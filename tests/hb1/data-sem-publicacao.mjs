import assert from 'node:assert/strict';
import {loadClaims,validateLedger} from '../../src/lib/ledger.mjs';
const id='hab-il-proposta',linhas=loadClaims({includeWithdrawn:true}),publicas=loadClaims(),original=linhas.get(id);
// HB1-f: a data impressa é a da última edição (published_at_kind last-edited), nunca a publicação inicial.
assert(original&&original.published_at_kind==='last-edited'&&original.published_at===original.reference_date,'a publicação inicial permanece desconhecida');
const errors=c=>{linhas.set(id,c);publicas.set(id,c);return validateLedger().errors.filter(e=>e.startsWith(`[${id}.yml]`));};
try {
 assert.deepEqual(errors(original),[]);
 for(const [nome,change,queixa] of [
  ['referência inventada',c=>{c.reference_date='2000-01-01';c.document.edition='2000-01-01';},'V2A data'],
  ['publicação inventada',c=>{delete c.published_at_kind;},'atualização não prova a publicação inicial'],
  ['edição trocada',c=>{c.published_at='2026-06-01';},'V2A data'],
  ['página sem prova da edição',c=>{c.document.source_sha256='f'.repeat(64);},'a data da página não tem prova no corpo'],
  ['selo alterado',c=>{c.document.source_sha256='0'.repeat(64);},'V2A data'],
 ]) {
  const bad=structuredClone(original);change(bad);assert(errors(bad).some(e=>e.includes(queixa)),nome);
  assert.deepEqual(errors(original),[]);console.log(`PLANTA HB1 ${nome}: vermelho 1, verde 0`);
 }
} finally {linhas.set(id,original);publicas.set(id,original);}
console.log('HB1: a atualização provada conserva a publicação inicial desconhecida.');
