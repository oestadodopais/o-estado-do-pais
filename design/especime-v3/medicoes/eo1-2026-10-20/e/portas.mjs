/** As portas são lidas das páginas construídas, com texto, destino e HTML. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {conferirPortasDeEntradaEo1} from '../../../../../scripts/portas-eo1-do-portao.mjs';
const result=[];
for(const lang of ['pt','en'])for(const key of ['discussao','explicacao']){
 const slug='dinheiro-do-estado-2026';
 const route=key==='discussao'?(lang==='pt'?'o-que-se-discute':'en/under-discussion'):`${lang==='pt'?'explicacoes':'en/explainers'}/${slug}`;
 const root=parse(fs.readFileSync(`dist/${route}/index.html`,'utf8'));
 const check=conferirPortasDeEntradaEo1(root,{key,lang,params:{slug}});assert.deepEqual(check.erros,[]);
 const portas=root.querySelectorAll('[data-eo1-porta]').map(el=>({texto:el.textContent.replace(/\s+/g,' ').trim(),html:el.outerHTML,ligacoes:el.querySelectorAll('a').map(a=>({texto:a.textContent,href:a.getAttribute('href')}))}));
 result.push({lang,key,route,portas});
}
fs.writeFileSync('design/especime-v3/medicoes/eo1-2026-10-20/e/portas-renderizadas.json',JSON.stringify(result,null,2)+'\n');
console.log('EO1-e: portas conferidas nas páginas da discussão e do explicador, nas duas edições.');
