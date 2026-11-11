import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {conferirParidade,validarExcecoes,assinatura} from '../../scripts/check-paridade.mjs';
import {blocosDe,compara} from '../../scripts/paridade-numeros.mjs';
const slug='evora-2027-capital-europeia-da-cultura';
const excecoes=JSON.parse(fs.readFileSync('scripts/paridade-excecoes.json','utf8'));
excecoes.diferencas=excecoes.diferencas.filter(e=>e.estudo===slug);
const julgados=['pt','en'].map(l=>blocosDe(fs.readFileSync(`studies-src/${slug}/${l}.html`,'utf8')));
const original=assinatura(compara(...julgados));
for(const e of excecoes.diferencas){
 assert.deepEqual(e.numeros.total,original.total);
 const offset=e.numeros.blocos[0].i-original.blocos[0].i;
 assert.deepEqual(e.numeros.blocos.map(b=>({...b,i:b.i-offset})),original.blocos);
}
for(const campo of ['documentos','razao','data_fecho']){
 const bad=structuredClone(excecoes);delete bad.diferencas[0][campo];assert.throws(()=>validarExcecoes(bad));
}
const bad=structuredClone(excecoes);bad.diferencas[0].documentos.pt='0'.repeat(64);assert.throws(()=>validarExcecoes(bad));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'evb-paridade-'));
try{
 for(const base of [`estudos/${slug}`,`en/studies/${slug}`]){
  fs.mkdirSync(path.join(tmp,base),{recursive:true});
  for(const sufixo of ['index.html',`${base.startsWith('en/')?'document':'documento'}/index.html`]){
   const file=path.join(tmp,base,sufixo);fs.mkdirSync(path.dirname(file),{recursive:true});fs.copyFileSync(path.join('dist',base,sufixo),file);
  }
 }
 assert.deepEqual(conferirParidade(tmp,excecoes).erros,[]);
 const file=path.join(tmp,`estudos/${slug}/documento/index.html`);
 const root=parse(fs.readFileSync(file,'utf8'));const h1=root.querySelector('h1');h1.set_content(h1.textContent.replace('2027','999999999'));fs.writeFileSync(file,root.outerHTML);
 assert(conferirParidade(tmp,excecoes).erros.some(e=>e.startsWith(slug+'|documento: diferença mudou')));
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
console.log(`EVB paridade: ${original.blocos.length} diferenças iguais ao texto julgado; três campos ausentes, resumo trocado e número novo recusados.`);
