/** Acrescentar só as assinaturas das entradas COR3, sem alterar uma assinatura anterior. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {entradasDoValor,assinaturaDoValor} from '../../../../src/lib/historia-do-valor.mjs';
const file='ledger/historias-valores.json',hist=JSON.parse(fs.readFileSync(file,'utf8'));let n=0;
for(const [id,r] of loadClaims({includeWithdrawn:true})){
 const entries=entradasDoValor(r).map(assinaturaDoValor),old=hist[id]??[];
 assert.deepEqual(entries.slice(0,old.length),old,id);
 if(entries.length>old.length){assert(entries.slice(old.length).every(e=>e.date==='2026-11-13'),id);hist[id]=entries;n+=entries.length-old.length;}
}
fs.writeFileSync(file,JSON.stringify(hist,null,2)+'\n');console.log(n,'assinaturas acrescentadas; anteriores intactas');
