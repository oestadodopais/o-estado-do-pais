/** Prova auxiliar dos registos originais cujo livro foi julgado no motor. */
import fs from 'node:fs';import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex');
const provaFile=new URL('../design/especime-v3/medicoes/eva-2026-11-10/provas-documentais-eva-t.json',import.meta.url);
let prova,linhas;
export function corpoDocumentalJulgado(registo,figura){
 try {
  if(!prova){
   prova=JSON.parse(fs.readFileSync(provaFile,'utf8'));
   const bytes=fs.readFileSync(new URL('../'+prova.livro.file,import.meta.url));
   if(sha(bytes)!==prova.livro.sha256)throw Error('Livro do motor alterado');
   linhas=new Map(JSON.parse(bytes).claims.map(r=>[r.id,r]));
  }
  const edicao=Object.values(prova.registos).find(r=>r.edition===registo.edition&&r.lang===registo.lang);
  if(!edicao||edicao.objeto_sha256!==sha(JSON.stringify(registo)))return false;
  const p=prova.linhas[figura.row],r=linhas.get(figura.row);
  return Boolean(p&&r&&p.source_body===figura.source_body&&p.source_sha256===figura.source_sha256&&
    prova.corpos[p.source_body]===p.source_sha256&&r.document?.source_sha256===p.source_sha256);
 }catch{return false;}
}
