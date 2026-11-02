import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {conferirFormaDasCitacoes} from '../../scripts/forma-da-citacao.mjs';
const base=structuredClone(loadClaims().get('posicao-governo-irc'));
assert.equal(base.forma_da_citacao,'relato');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const q=`«${esc(base.excerpt)}»`,doc=`«${esc(base.document.title)}»`;
let count=0;
for(const lang of ['pt','en']) {
 const intro=lang==='pt'?'pela notícia':'by the report';
 for(const key of ['estudo','documento','texto','dossie','discussao','explicacao','explicacoes']) {
  for(const [name,text,code] of [['pessoa',`A pessoa: ${q}`,1],['antes',`A pessoa, ${intro} ${doc}: ${q}`,0],['depois',`${q}, ${intro} ${doc}.`,0],['outra frase',`${doc}. A pessoa: ${q}`,1]]) {
   const html=parse(`<main><p>${text}</p></main>`);
   const errors=conferirFormaDasCitacoes(html,{key,lang},new Map([[base.id,base]]));
   assert.equal(errors.length?1:0,code,`${key}/${lang}/${name}: ${errors}`);count++;
  }
 }
}
// Cópias isoladas atravessam validateLedger, a mesma entrada do ledger:check.
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'og1e-'));
try {
 for(const [name,change,expected] of [['palavras com salientou',{forma_da_citacao:'palavras',excerpt:'O primeiro-ministro salientou a proposta.'},1],['sem forma',{forma_da_citacao:null},1],['fora da lista',{forma_da_citacao:'direta'},1],['relato',{},0]]) {
  const row=structuredClone(base);Object.assign(row,change);delete row.__file;
  fs.writeFileSync(path.join(tmp,row.id+'.yml'),JSON.stringify(row));
  const program="import {validateLedger} from './src/lib/ledger.mjs'; console.log(JSON.stringify(validateLedger().errors.filter(e=>e.includes('OG1-E'))));";
  const errors=JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',program],{env:{...process.env,OEDP_LEDGER_DIR:tmp},encoding:'utf8'}));
  assert.equal(errors.length?1:0,expected,name);count++;
  console.log(`OG1-E livro ${name}: código ${errors.length?1:0}`);
 }
} finally {fs.rmSync(tmp,{recursive:true,force:true});}
console.log(`OG1-E: ${count} plantas, nas duas edições e em todas as famílias editoriais, conferidas.`);
