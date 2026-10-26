/** Confere a separação entre as quinze revisões e as duas pendentes. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {load} from 'js-yaml';
const pasta='design/especime-v3/medicoes/cr2-2026-10-26';
const pendentes={'divida-publica-2025':'89,7','divida-publica-2025-ue':'81,7'};
const linhas=JSON.parse(fs.readFileSync(`${pasta}/ids.json`)).map(id=>{
 const d=load(fs.readFileSync(`ledger/claims/${id}.yml`,'utf8'));
 const c=d.corrections.filter(x=>x.date==='2026-10-26');
 const v=d.verifications.filter(x=>x.date==='2026-10-26'&&x.result==='diverge');
 assert(v.length>0,id);
 if(id in pendentes){
  assert.equal(d.value,pendentes[id]);assert.equal(c.length,0);
  const main=load(execFileSync('git',['show',`main:ledger/claims/${id}.yml`],{encoding:'utf8'}));
  for(const k of ['value','corrections'])assert.deepEqual(d[k],main[k]);
 }else{
  assert.equal(c.length,3);assert.equal(c.filter(x=>x.kind==='atualizacao').length,1);
  assert.equal(c.filter(x=>x.kind==='proveniencia').length,2);
 }
 return {id,valor:d.value,corrections_26_10:c.length,diverge_26_10:v.length,pendente:id in pendentes};
});
const resultado={linhas,atualizadas:linhas.filter(x=>!x.pendente).length,pendentes:linhas.filter(x=>x.pendente).length,entradas:linhas.reduce((n,x)=>n+x.corrections_26_10,0)};
fs.writeFileSync(`${pasta}/d/partida.json`,JSON.stringify(resultado,null,2)+'\n');
console.log(`${resultado.atualizadas} atualizadas, ${resultado.pendentes} pendentes, ${resultado.entradas} entradas`);
