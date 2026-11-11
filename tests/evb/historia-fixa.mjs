import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {conferirHistoria} from '../../scripts/historia-edicoes-conferir.mjs';
const historia=JSON.parse(fs.readFileSync(new URL('../edicoes/fixtures/evora-2027-historia.json',import.meta.url)));
const raiz=new URL('../edicoes/fixtures/evora-2027-historia/',import.meta.url).pathname;
assert(historia.manifesto.edicoes.every(e=>e.edicoes.length===4));
assert.deepEqual(conferirHistoria({...historia,raiz}),[]);
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'evb-historia-'));
try{
 fs.cpSync(raiz,tmp,{recursive:true});
 const args={...structuredClone(historia),raiz:tmp};
 for(const e of args.manifesto.edicoes)for(const v of e.edicoes){
  const file=path.join(tmp,v.file),original=fs.readFileSync(file);
  fs.appendFileSync(file,'x');assert(conferirHistoria(args).some(e=>e.startsWith('ED1 sha256:')));fs.writeFileSync(file,original);
 }
 const menos=structuredClone(args);menos.correcoes.splice(1,1);
 assert(conferirHistoria(menos).some(e=>e.startsWith('ED1 entrada:')));
 const semPrimeira=structuredClone(args);delete semPrimeira.manifesto.edicoes[0].primeira_edicao;
 assert(conferirHistoria(semPrimeira).some(e=>e.startsWith('ED1 arquivo:')));
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
console.log('EVB história fixa: quatro versões por língua; oito adulterações de bytes, correção intermédia ausente e primeira edição ausente recusadas.');
