/** Repetições da planta real, sempre numa pasta temporária que a própria planta remove. */
import fs from 'node:fs';
import { plantas } from '../../../../scripts/verify-depois-do-build.mjs';
const inicio=Date.now(), corridas=[];
for(let i=0;i<20;i++){
 const p=await plantas();
 corridas.push({ok:p.ok,plantas:p.casos.length,troca:p.casos.find(c=>c.antes)});
 if(!p.ok)throw Error('Uma planta não mordeu.');
}
const saida={comando:'node design/especime-v3/medicoes/h2-2026-10-04/repetir-i194.mjs',corridas,segundos:(Date.now()-inicio)/1000};
fs.writeFileSync(new URL('i194-repeticoes.json',import.meta.url),JSON.stringify(saida,null,2)+'\n');
console.log(`${corridas.length} corridas com todas as plantas a morder.`);
