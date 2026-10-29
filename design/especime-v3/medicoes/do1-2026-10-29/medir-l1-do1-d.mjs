/** DO1-D: a retirada das correções só altera as repetições dos dossiês do Orçamento. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
const [antes,depois]=process.argv.slice(2);
function ler(f) {
 const s=fs.readFileSync(f,'utf8').replace(/\x1b\[[0-9;]*m/g,'');
 const total=Number(s.match(/^ {2}L1 · páginas com dois destinos iguais fora da mobília +(\d+)/m)?.[1]);
 const paginas=Object.fromEntries([...s.matchAll(/^ {6}· (\/\S*) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/gm)].map(m=>[m[1],{destinos:+m[2],exemplo:m[3],vezes:+m[4]}]));
 assert.equal(Object.keys(paginas).length,total);
 return {total,paginas};
}
const b=ler(antes),a=ler(depois);
const rotas=['/dossies/orcamento-2027','/en/dossiers/orcamento-2027'];
const esperadas=structuredClone(b);
for(const rota of rotas) {
 const root=parse(fs.readFileSync(`dist${rota}/index.html`,'utf8')), links=new Map();
 for(const el of root.querySelectorAll('main a[href]')) {
  if(el.closest('[data-rotulo-ia]'))continue;
  const href=el.getAttribute('href');if(href.startsWith('#'))continue;
  const chave=href.split('#')[0].replace(/\/$/,'');links.set(chave,(links.get(chave)??0)+1);
 }
 const repetidos=[...links].filter(([,n])=>n>1);
 esperadas.paginas[rota]={destinos:repetidos.length,exemplo:repetidos[0][0],vezes:repetidos[0][1]};
 assert.equal(b.paginas[rota].destinos-repetidos.length,1,'Sai apenas o destino repetido das correções');
 assert.equal(root.querySelector('#dossie-correcoes'),null);
}
function conferir(m){assert.deepEqual(m,esperadas,'Só mudam as repetições dos dois dossiês construídos');}
conferir(a);
let plantas=0;
for(const mudar of [
 m=>m.total++,m=>delete m.paginas[rotas[0]],m=>m.paginas[rotas[0]].destinos++,
 m=>m.paginas[rotas[0]].vezes++,m=>m.paginas['/'].destinos++,m=>m.paginas['/planta']={destinos:1,exemplo:'/',vezes:2},
]){const c=structuredClone(a);mudar(c);assert.throws(()=>conferir(c));plantas++;}
const resultado={base:'02dc6db39',comando:'AMOSTRA=5000 npm run check:lugar',antes:b.total,depois:a.total,alteracoes:rotas.map(rota=>({rota,antes:b.paginas[rota],depois:a.paginas[rota]})),plantas,razao:'As páginas retiradas da casa não tinham destinos repetidos. Nos dossiês do Orçamento sai a repetição do destino das correções. As restantes páginas conservam a medição anterior.'};
fs.writeFileSync('design/especime-v3/medicoes/do1-2026-10-29/l1-do1-d.json',JSON.stringify(resultado,null,2)+'\n');
fs.writeFileSync('scripts/lugar-tetos-b1.json',JSON.stringify({l1_paginas:a.total,medicao:'design/especime-v3/medicoes/do1-2026-10-29/l1-do1-d.json'},null,2)+'\n');
console.log(JSON.stringify(resultado));
