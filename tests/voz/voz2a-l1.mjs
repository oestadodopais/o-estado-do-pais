/** VOZ-2A F: repor as ligações antigas do Método faz a mesma L1 recusar. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {load} from 'js-yaml';
const url=load(fs.readFileSync('ledger/claims/retribuicao-minima-mensal-garantida-continente-2026.yml','utf8')).source_url;
const teto=JSON.parse(fs.readFileSync('scripts/lugar-tetos-b1.json','utf8')).l1_paginas;
const copias=['metodo/index.html','en/method/index.html'].map(rel=>{
 const f=path.resolve('dist',rel),original=fs.readFileSync(f,'utf8'),root=parse(original);
 const dd=root.querySelector('[data-met1="campo-2"]').parentNode.querySelector('dd');
 dd.set_content(`<a href="${url}">${dd.innerHTML}</a>`);
 return {f,original,alterada:root.toString()};
});
const codigo=`import fs from 'node:fs';import path from 'node:path';const ler=fs.readFileSync;const copias=new Map(${JSON.stringify(copias.map(c=>[c.f,c.alterada]))});fs.readFileSync=function(f,...args){const copia=typeof f==='string'?copias.get(path.resolve(f)):undefined;return copia??ler.call(this,f,...args);};await import('./scripts/check-lugar.mjs');`;
const r=spawnSync(process.execPath,['--input-type=module','-e',codigo],{encoding:'utf8',maxBuffer:64*1024*1024});
const saida=r.stdout+r.stderr;
assert.equal(r.status,1,saida.slice(-2500));
assert(saida.includes(`L1 · páginas com dois destinos iguais fora da mobília: ${teto+2}, acima do teto ${teto}.`),saida.slice(-2500));
for(const c of copias)assert.equal(fs.readFileSync(c.f,'utf8'),c.original);
const resultado={codigo_da_planta:r.status,teto,paginas_com_planta:teto+2,paginas_preservadas:copias.length,regua_alterada:false};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify(resultado));
