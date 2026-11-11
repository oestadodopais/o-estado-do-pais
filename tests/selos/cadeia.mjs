import {corpoDocumentalConferido} from '../../scripts/corpo-documental-conferir.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {spawnSync} from 'node:child_process';import {parse} from 'node-html-parser';
import {WORKS} from '../../src/data/studies.mjs';
import {manifestoDosRegistos} from '../../src/lib/registos.mjs';import {routePath} from '../../src/lib/routes.mjs';import {irmaoDepoisDaMedida} from '../../src/lib/posicao-do-selo.mjs';
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sel1-cadeia-'));
try {
 let alvo;
 for(const chave of Object.keys(manifestoDosRegistos().registos)){
  const corte=chave.lastIndexOf('/'),slug=chave.slice(0,corte),lang=chave.slice(corte+1),f=path.join(routePath('estudo',lang,{slug}),'index.html');
  if(WORKS.some(w=>w.slug===slug&&w.estado==='retirado'))continue;
  const destino=path.join(tmp,f);fs.mkdirSync(path.dirname(destino),{recursive:true});fs.copyFileSync(path.join('dist',f),destino);
  if(!alvo){const root=parse(fs.readFileSync(destino,'utf8'));const figura=root.querySelectorAll('[data-registo]').find(el=>el.nextSibling?.nodeType===3&&irmaoDepoisDaMedida(el).irmao?.matches('a.src-chip'));if(figura)alvo={root,figura,destino};}
 }
 const correr=()=>spawnSync(process.execPath,['scripts/check-cadeia.mjs'],{encoding:'utf8',env:{...process.env,OEDP_DIST:tmp}});
 const controlo=correr();assert.equal(controlo.status,0,controlo.stdout+controlo.stderr);assert(alvo);
 irmaoDepoisDaMedida(alvo.figura).irmao.setAttribute('href','/livro-razao/fonte-trocada');fs.writeFileSync(alvo.destino,alvo.root.toString());
 const planta=correr();assert.equal(planta.status,1);assert.match(planta.stdout+planta.stderr,/C6 .*fonte-trocada/);
 console.log('SEL1: C6 aceita a medida inteira e recusa uma fonte trocada na cópia do estudo.');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}

// C1: os dois formatos guardam a mesma prova; mudar o caminho ou o resumo fecha.
const figura={row:'planta',source_body:'content/planta/documento.pdf',source_sha256:'a'.repeat(64)};
for(const campo of ['proof_rows','documentary_rows']){
 const registo={[campo]:{planta:{document:{file:figura.source_body,source_sha256:figura.source_sha256}}}};
 assert(corpoDocumentalConferido(registo,figura));
 for(const alterada of [{...figura,source_body:'content/planta/outro.pdf'},{...figura,source_sha256:'b'.repeat(64)},{...figura,row:'ausente'}])assert(!corpoDocumentalConferido(registo,alterada));
 for(const file of ['content/../documento.pdf','fora/documento.pdf']){
  const alterado=structuredClone(registo);alterado[campo].planta.document.file=file;
  assert(!corpoDocumentalConferido(alterado,{...figura,source_body:file}));
 }
}
console.log('C1: dois formatos de origem conferidos e dez adulterações recusadas.');
