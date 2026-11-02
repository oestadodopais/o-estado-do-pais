/** SEL1: cada planta escreve a sua cópia, nunca a construção conferida. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {medirPagina} from '../../scripts/check-selos.mjs';
const selo='<a class="src-chip" href="/livro-razao/prova"><span>fonte</span></a>';
const plantas=[
 ['estudo-pt','estudos/prova/index.html',`<p><span>79</span>${selo} milhões</p>`,'unidade'],
 ['estudo-en','en/studies/prova/index.html',`<p><span>4</span>${selo}%</p>`,'unidade'],
 ['dossie','dossies/prova/index.html',`<p>Calendário.${selo} , ${selo}</p>`,'consecutivos'],
 ['controlo','estudos/prova/index.html',`<p><span>79</span> milhões de euros${selo}</p>`,null],
];
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sel1-plantas-'));
try {
 for(const [nome,pagina,html,tipo] of plantas){
  const dir=path.join(tmp,nome),f=path.join(dir,pagina);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,html);
  const r=spawnSync(process.execPath,['scripts/check-selos.mjs','--dist',dir],{encoding:'utf8'});
  assert.equal(r.status,tipo?1:0,nome+': '+r.stdout+r.stderr);
  if(tipo){assert.match(r.stdout,new RegExp(tipo));assert(r.stdout.includes(pagina));}
  const medida=spawnSync(process.execPath,['scripts/check-selos.mjs','--dist',dir,'--medir'],{encoding:'utf8'});
  assert.equal(medida.status,0,nome+' modo de medida');
 }
 for(const html of [`<p>${selo}</p><p>${selo}</p>`,`<p>79${selo} milhõesimo</p>`,`<p>79${selo}  milhões</p>`,`<p>79${selo} e ${selo}</p>`])assert.equal(medirPagina(html).erros.length,0);
 assert.equal(medirPagina(`<p>79${selo}<em> milhões</em></p>`).erros[0].unidade,'milhões');
 console.log('SEL1: três plantas recusadas, controlo aceite, modo de medida e fronteiras conferidos.');
} finally {fs.rmSync(tmp,{recursive:true,force:true});}
