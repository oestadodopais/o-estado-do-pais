/** As plantas da A4 sobre o HTML construído, com o código e as mensagens guardados. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const pasta='design/especime-v3/medicoes/rp4n-2026-10-06/conferencias-b';
const temporario=fs.mkdtempSync(path.join(os.tmpdir(),'rp4nb-titulos-'));
fs.mkdirSync(pasta,{recursive:true});
try {
 const ficheiro=path.join(temporario,'plantas.json');
 const r=spawnSync(process.execPath,['tests/pais/pais.mjs','--json',ficheiro],{encoding:'utf8'});
 assert.notEqual(r.status,null,'a conferência foi interrompida');
 fs.writeFileSync(`${pasta}/titulos.codigo`,`${r.status}\n`);
 assert.equal(r.status,0,r.stdout+r.stderr);
 const nomes=['marca num título de estudo no registo','marca num título de estudo no país','marca num título de estudo no índice inglês','título declarado por confirmar mesmo sem marca'];
 const todas=JSON.parse(fs.readFileSync(ficheiro,'utf8'));
 const plantas=nomes.map(nome=>{
  const p=todas.find(p=>p.nome===nome);
  assert(p?.passou,nome);
  const mensagens=p.saida.split('\n').filter(s=>s.includes('A4:')).map(s=>s.trim());
  assert(mensagens.length,nome);
  return {nome,codigo:p.codigo,mensagens};
 });
 fs.writeFileSync(`${pasta}/titulos.json`,JSON.stringify({comando:'node design/especime-v3/medicoes/rp4n-2026-10-06/conferir-titulos-b.mjs',codigo:r.status,plantas},null,2)+'\n');
 console.log(`RP4N-b: ${plantas.length} plantas da A4 com as mensagens guardadas, código ${r.status}`);
}finally{fs.rmSync(temporario,{recursive:true,force:true});}
