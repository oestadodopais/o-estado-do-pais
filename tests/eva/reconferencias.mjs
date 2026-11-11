import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {routePath} from '../../src/lib/routes.mjs';
import {conferirVerificacaoLegivel} from '../../scripts/verificacao-legivel.mjs';
const linhas=[...loadClaims({includeWithdrawn:true}).values()];
const exemplo=linhas.find(r=>r.id==='evora-execucao-da-receita-2021');
let plantas=0,recibos=0;
for(const lang of ['pt','en']){
 const atual=lang==='pt'?'Ficheiro da fonte relido a':'Source file read again on';
 const anterior=lang==='pt'?'Ficheiro da fonte anterior relido a':'Previous source file read again on';
 const frase=lang==='pt'?'confirmou o valor anterior:':'confirmed the previous value:';
 const html=rotulo=>parse(`<dl><dt>${rotulo}</dt><dd data-linha-verificacao="0">01.09.2026, <span data-linha-verificacao-resultado>${frase} <span data-valor-anterior-confirmado>96</span></span></dd></dl>`);
 const mesma=structuredClone(exemplo);mesma.verifications[0].path=mesma.source_url;
 assert.deepEqual(conferirVerificacaoLegivel(html(atual),mesma,lang),[]);
 assert.deepEqual(conferirVerificacaoLegivel(html(anterior),exemplo,lang),[]);
 for(const [rotulo,linha] of [[atual,exemplo],[anterior,mesma]]){
  assert(conferirVerificacaoLegivel(html(rotulo),linha,lang).some(e=>e.startsWith('C1: o recibo não distingue')));plantas++;
 }
 if(process.argv.includes('--so-plantas'))continue;
 for(const linha of linhas.filter(r=>(r.verifications??[]).some(v=>v.path&&v.path!==r.source_url))){
  const rota=routePath('linha',lang,{slug:linha.id});
  const root=parse(fs.readFileSync(`dist${rota}/index.html`,'utf8'));
  assert.deepEqual(conferirVerificacaoLegivel(root,linha,lang),[],`${lang}/${linha.id}`);recibos++;
  for(const el of root.querySelectorAll('[data-linha-verificacao]')){
   const v=linha.verifications[Number(el.getAttribute('data-linha-verificacao'))];
   if(v.path&&v.path!==linha.source_url&&v.result!=='inacessivel'){
    assert.equal(el.previousElementSibling.textContent,anterior);
    el.previousElementSibling.set_content(atual);
    assert(conferirVerificacaoLegivel(root,linha,lang).some(e=>e.startsWith('C1: o recibo não distingue')));plantas++;
    el.previousElementSibling.set_content(anterior);
   }
  }
 }
}
console.log(`EVA reconferências: ${plantas} plantas recusadas; mesmo endereço conserva a frase; ${recibos} recibos construídos conferidos.`);
