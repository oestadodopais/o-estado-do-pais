/** Prova auxiliar dos registos originais cujo livro foi julgado no motor. */
import fs from 'node:fs';import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex');
const ficheiros=[
 'design/especime-v3/medicoes/eva-2026-11-10/provas-documentais-eva-t.json',
 'design/especime-v3/medicoes/evb-2026-11-11/provas-documentais-evb-t.json',
];
let provas;
function carregarProva(registo){
 if(!provas)provas=ficheiros.map(file=>{
  const prova=JSON.parse(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'));
  const bytes=fs.readFileSync(new URL('../'+prova.livro.file,import.meta.url));
  if(sha(bytes)!==prova.livro.sha256)throw Error('Livro do motor alterado');
  return {prova,linhas:new Map(JSON.parse(bytes).claims.map(r=>[r.id,r]))};
 });
 const objeto=sha(JSON.stringify(registo));
 return provas.find(({prova})=>Object.values(prova.registos).some(r=>r.edition===registo.edition&&r.lang===registo.lang&&r.objeto_sha256===objeto));
}
/** Só uma figura do objeto selado pode ganhar a raiz, sem mudar os seus bytes. */
export function figuraDocumentalNaRaiz(registo,figura){
 try {
  const p=carregarProva(registo),corpo=figura.source_body;
  if(p&&typeof corpo==='string'&&!corpo.startsWith('content/')&&!corpo.startsWith('/')&&!corpo.split('/').includes('..')&&p.prova.linhas[figura.row]?.source_body===corpo)
   return {...figura,source_body:'content/'+corpo};
 }catch{}
 return figura;
}
export function corpoDocumentalJulgado(registo,figura){
 const corpo=figura.source_body;
 if(typeof corpo!=='string'||!corpo.startsWith('content/')||corpo.split('/').includes('..'))return false;
 try {
  const carregada=carregarProva(registo);if(!carregada)return false;
  const {prova,linhas}=carregada,p=prova.linhas[figura.row],r=linhas.get(figura.row);
  return Boolean(p&&r&&(p.source_body.startsWith('content/')?p.source_body:'content/'+p.source_body)===corpo&&p.source_sha256===figura.source_sha256&&prova.corpos[p.source_body]===p.source_sha256&&r.document?.source_sha256===p.source_sha256);
 }catch{return false;}
}
