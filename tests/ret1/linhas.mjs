import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { loadClaims, validateLedger } from '../../src/lib/ledger.mjs';
import { WORKS, PUBLISHED_WORKS, studyTitle } from '../../src/data/studies.mjs';
import { tituloDoEstudoDaLinha, enderecoDeEstudoRetirado } from '../../src/lib/estudo-da-linha.mjs';
const antes=JSON.parse(fs.readFileSync('design/especime-v3/medicoes/ret1-2026-11-12/linhas-de-partida.json','utf8'));
for(const [f,resumo] of Object.entries(antes)) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(`ledger/claims/${f}`)).digest('hex'),resumo,`linha alterada: ${f}`);
for(const lang of ['pt','en']) {
  for(const w of WORKS.filter(w=>w.estado==='retirado')) assert.equal(tituloDoEstudoDaLinha(w.id,lang),null);
  for(const w of PUBLISHED_WORKS) assert.equal(tituloDoEstudoDaLinha(w.id,lang),studyTitle(w.id,lang).titulo);
}
const linhas=loadClaims({includeWithdrawn:true}),publicas=loadClaims();
const original=[...publicas.values()].find(c=>WORKS.some(w=>w.id===c.study&&w.estado==='retirado')&&c.corrections?.length);
assert(original); const id=original.id;
const erros=c=>{linhas.set(id,c);publicas.set(id,c);return validateLedger().errors.filter(e=>e.startsWith(`[${id}.yml]`));};
try {
  assert.deepEqual(erros(original),[]);
  assert(erros({...original,study:'estudo-inexistente-ret1'}).some(e=>e.includes('não consta de src/data/studies.mjs')));
  assert.deepEqual(erros(original),[]);
} finally {linhas.set(id,original);publicas.set(id,original);}
console.log(`RET1: ${Object.keys(antes).length} ficheiros de linhas preservados byte a byte; estudo retirado oculto no recibo; estudo desconhecido recusado.`);

const historica=[...publicas.values()].find(c=>enderecoDeEstudoRetirado(c.source_url));
assert(historica);assert(!enderecoDeEstudoRetirado('https://example.test/estudos/'+historica.study));
assert(!enderecoDeEstudoRetirado('/estudos/'+PUBLISHED_WORKS[0].slug));
for (const w of PUBLISHED_WORKS) for (const prefixo of ['/estudos/', '/en/studies/']) assert(!enderecoDeEstudoRetirado(prefixo+w.slug+'/documento/2026-08-12'), 'O estado do trabalho publicado mantém o endereço da fonte.');
console.log('RET1-C: endereços retirados identificados pelos dados; fontes externas e todos os estudos publicados conservam o endereço.');
