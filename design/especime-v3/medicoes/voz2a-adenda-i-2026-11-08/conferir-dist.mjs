import fs from 'node:fs';import {parse} from 'node-html-parser';import assert from 'node:assert/strict';
const slug='evora-orcamentado-pago-devido-2025',itens=[];
for(const lang of ['pt','en'])for(const documento of [true,false]){
 const rota=(lang==='pt'?'/estudos/':'/en/studies/')+slug+(documento?(lang==='pt'?'/documento':'/document'):'');
 const root=parse(fs.readFileSync('dist'+rota+'/index.html','utf8'));root.querySelectorAll('script,style').forEach(n=>n.remove());
 const par=root.querySelectorAll('p').map(n=>n.textContent.replace(/\s+/g,' ').trim()).find(t=>t.includes(lang==='pt'?'Dez anos a pagar a dívida do resgate':'Ten years of paying down the rescue debt'));
 assert(par,rota);const etiqueta=par.match(/\((?:inferência|inference)[^)]*\)/)?.[0];const esperado=documento?(lang==='pt'?'(inferência; a tabela é da fonte)':"(inference; the table is the source's)"):(lang==='pt'?'(inferência)':'(inference)');assert.equal(etiqueta,esperado,rota);itens.push({rota,etiqueta,paragrafo:par});
}
fs.writeFileSync(new URL('./etiquetas-do-dist.json',import.meta.url),JSON.stringify(itens,null,2)+'\n');console.log('Quatro etiquetas conferidas no dist:',itens.map(x=>x.etiqueta).join(' | '));
