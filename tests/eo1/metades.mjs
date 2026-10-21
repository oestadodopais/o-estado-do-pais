/** EO1-e: as palavras das definições têm a contagem das parcelas da conta. */
import assert from 'node:assert/strict';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {FAMILIAS_EO1} from '../../design/especime-v3/medicoes/eo1-2026-10-20/familias.mjs';
const claims=loadClaims();
const folhas=id=>{
 const c=claims.get(id);assert(c,'componente ausente: '+id);
 if(!c.derivation)return [id];
 const refs=[...c.check.matchAll(/[a-z][a-z0-9-]+/g)].map(m=>m[0]);
 assert.deepEqual([...refs].sort(),[...c.derived_from].sort(),'parcelas diferentes da aritmética');
 return refs.flatMap(folhas);
};
for(const [k,pt,en] of [['receita','sete','seven'],['despesa','três','three'],['saldo','dez','ten']]){
 const id='der-oe2027-medidas-anteriores-'+k,ids=folhas(id);
 assert.equal(new Set(ids).size,ids.length,'parcela repetida');
 const counts={sete:7,três:3,dez:10,seven:7,three:3,ten:10};
 const f=structuredClone(FAMILIAS_EO1.find(f=>f.chaves.includes(id)));
 if(process.argv.includes('--planta')&&k==='receita')f.partes[0].pt=f.partes[0].pt.replace('sete linhas','dez linhas');
 for(const [lang,word] of [['pt',pt],['en',en]]){
  const text=f.partes.map(p=>p[lang]).join(''),found=text.match(lang==='pt'?/das (sete|três|dez) linhas/:/of the (seven|three|ten) /)?.[1];
  assert.equal(found,word,id+' '+lang+': palavra divergente');
  assert.equal(counts[found],ids.length,id+' '+lang+': contagem divergente da conta');
 }
 console.log(`${id}: ${ids.length} parcelas conferidas nas duas definições.`);
}
