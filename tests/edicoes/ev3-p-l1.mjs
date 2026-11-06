/** EV3-p: uma página antes sem repetição passa a ser a terceira além do teto antigo.
 * A planta corre sozinha, sob a tranca, e repõe os bytes originais no fim. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const teto=JSON.parse(fs.readFileSync('scripts/lugar-tetos-b1.json','utf8')).l1_paginas;
const alvo='dist/temas/index.html';
const original=fs.readFileSync('dist/temas/index.html','utf8');
const sha=s=>createHash('sha256').update(s).digest('hex');
function correr(nome,comando,args,codigo,contagem){
 const r=spawnSync(comando,args,{encoding:'utf8',maxBuffer:64*1024*1024});
 const saida=(r.stdout??'')+(r.stderr??'');
 const n=Number(saida.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto/)?.[1]);
 console.log(`${nome}: código ${r.status}; L1 ${n}; teto ${teto}.`);
 assert.equal(r.status,codigo,saida.slice(-6000));assert.equal(n,contagem,saida.slice(-6000));
 if(codigo===1)assert(saida.includes(`L1 · páginas com dois destinos iguais fora da mobília: ${contagem}, acima do teto ${teto}.`));
 return {nome,codigo:r.status,contagem:n,teto};
}
const resultados=[];
try{
 resultados.push(correr('check:lugar, controlo','npm',['run','check:lugar'],0,teto));
 assert(original.includes('</main>'));
 fs.writeFileSync(alvo,original.replace('</main>','<p><a href="/lugares/">Os lugares</a> <a href="/lugares/">Os lugares</a></p></main>'));
 resultados.push(correr('terceira página adicional',process.execPath,['scripts/check-lugar.mjs'],1,teto+1));
}finally{fs.writeFileSync(alvo,original);}
assert.equal(sha(fs.readFileSync('dist/temas/index.html')),sha(original));
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify({resultados,planta_retirada:true,original_preservado:true},null,2)+'\n');
console.log('EV3-p L1: controlo verde, terceira página recusada, planta retirada e original preservado.');
