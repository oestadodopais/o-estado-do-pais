import assert from 'node:assert/strict';
import {loadClaims,validateLedger,contagensDoRegisto} from '../../src/lib/ledger.mjs';
import {entradasDoValor} from '../../src/lib/historia-do-valor.mjs';
const rows=loadClaims({includeWithdrawn:true}),id='hab-imprensa-psp-ferido',base=rows.get(id);let n=0;
function planta(nome,id,mudar,pattern){const original=rows.get(id),copia=structuredClone(original);mudar(copia);rows.set(id,copia);try{assert(validateLedger().errors.some(e=>pattern.test(e)),nome);console.log(`OG1-E D ${nome}: código 1`);n++;}finally{rows.set(id,original);}}
assert.equal(base.corrections.at(-1).kind,'correcao');assert.equal(entradasDoValor(base).length,0);n++;
planta('campo diferente do atual',id,r=>{r.corrections.at(-1).new_value='Outro jornal';},/correção de campo não termina no valor atual/);
planta('publicador como revisão',id,r=>{r.corrections.at(-1).kind='proveniencia';},/source exige correcao/);
planta('campo sem mudança',id,r=>{r.corrections.at(-1).old_value=r.source;},/correção de campo exige valores diferentes/);
planta('campo fora da lista',id,r=>{r.corrections.at(-1).field='value';},/Só pode ser/);
planta('história do valor partida','correcoes-publicadas',r=>{r.corrections.at(-1).old_value='0';},/história do valor/);
const all=[...rows.values()].flatMap(r=>(r.corrections??[]).map(c=>({r,c}))),fields=all.filter(({c})=>c.kind==='correcao'&&c.field);
assert.equal(fields.length,30);assert.equal(all.filter(({c})=>c.kind==='proveniencia'&&c.field==='source').length,0);
for(const {r,c} of fields){assert.equal(c.new_value,c.field.split('.').reduce((v,k)=>v[k],r));assert.notEqual(c.old_value,c.new_value);n++;}
assert.equal(String(contagensDoRegisto(rows).correcoes_publicadas),rows.get('correcoes-publicadas').value);n++;
console.log(`OG1-E D: ${n} plantas e controlos; trinta correções de campo e a contagem conferidas.`);
