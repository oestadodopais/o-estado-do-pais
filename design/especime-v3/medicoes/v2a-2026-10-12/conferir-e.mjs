/** Valores da entrada, apoios e frases efetivamente construídas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {load} from 'js-yaml';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {routePath} from '../../../../src/lib/routes.mjs';
const base='c4b22a56',pasta='design/especime-v3/medicoes/v2a-2026-10-12';
const claims=loadClaims(),ids=Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/v2a.json')).rows);
const rows=ids.map(id=>{const c=claims.get(id),old=load(execFileSync('git',['show',base+':ledger/claims/'+id+'.yml'],{encoding:'utf8'}));assert.equal(c.value,old.value);assert.equal(c.unit,old.unit);return {id,valor:c.value,unidade:c.unit};});
const antigas=execFileSync('git',['ls-tree','-r','98487940','ledger/claims'],{encoding:'utf8'}).trim().split('\n');
const atuais=new Set(execFileSync('git',['ls-tree','-r','HEAD','ledger/claims'],{encoding:'utf8'}).trim().split('\n'));
for(const x of antigas)assert(atuais.has(x));
const out={base,linhas_anteriores_intactas:antigas.length,linhas:rows};
if(process.argv.includes('--html')) {
 out.cabeca=JSON.parse(fs.readFileSync('dist/version.json')).commit;
 out.frases=ids.map(id=>({id,...Object.fromEntries(['pt','en'].map(lang=>{const route=routePath('linha',lang,{slug:id}),html=parse(fs.readFileSync('dist'+route.replace(/\/$/,'')+'/index.html','utf8'));return [lang,{cabecalho:html.querySelector('h1').textContent,frase:html.querySelector('[data-o-que-e-parte="o-que-e"]').textContent,conta:html.querySelector('[data-v2a-conta]')?.textContent??''}];}))}));
}
fs.writeFileSync(pasta+'/inspecao-e.json',JSON.stringify(out,null,2)+'\n');console.log(`${rows.length} valores e unidades inalterados; ${antigas.length} linhas anteriores intactas.`);
