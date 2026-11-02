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
 for(const key of ['estudo','documento','texto','dossie','discussao','explicacao','explicacoes','linha','metodo','rota-nova',undefined]) {
  for(const [name,text,code] of [['pessoa',`A pessoa: ${q}`,1],['antes',`A pessoa, ${intro} ${doc}: ${q}`,0],['depois',`${q}, ${intro} ${doc}.`,0],['outra frase',`${doc}. A pessoa: ${q}`,1]]) {
   const html=parse(`<main><p>${text}</p></main>`);
   const errors=conferirFormaDasCitacoes(html,{key,lang},new Map([[base.id,base]]));
   assert.equal(errors.length?1:0,code,`${key}/${lang}/${name}: ${errors}`);count++;
  }
 }
}
// Elementos e texto próprio do li que antes ficavam fora da leitura.
for(const lang of ['pt','en'])for(const tag of ['figcaption','dd','h5','h6','summary','li','div']) {
 for(const [suffix,code] of [['',1],[`<p>Outro parágrafo.</p>`,1]]) {
  const html=parse(`<${tag}>A pessoa: ${q}${suffix}</${tag}>`);
  assert(conferirFormaDasCitacoes(html,{lang},new Map([[base.id,base]])).length,`${tag}/${lang}`);count++;
 }
}
for(const lang of ['pt','en'])for(const id of ['posicao-governo-divida85','posicao-jpp-irs','posicao-cds-orcamento']) {
 const row=loadClaims().get(id),title=esc(row.document.title),headline=lang==='pt'?'pelo título da notícia':'in the news headline';
 for(const [text,code] of [[`A pessoa: «${title}»`,1],[`A pessoa, ${headline}: «${title}»`,0]]) {
  assert.equal(conferirFormaDasCitacoes(parse(`<dd>${text}</dd>`),{lang},new Map([[id,row]])).length?1:0,code,`${id}/${lang}`);count++;
 }
}
// A rota desconhecida lê a língua do HTML; um documento noutro parágrafo não apoia a fala.
for(const lang of ['pt','en']) {
 const intro=lang==='pt'?'pela notícia':'by the report';
 const docAfter=parse(`<html lang="${lang}"><body><figcaption>${q}, ${intro} ${doc}.</figcaption></body></html>`);
 assert.deepEqual(conferirFormaDasCitacoes(docAfter,null,new Map([[base.id,base]])),[]);count++;
 const split=parse(`<li>A pessoa: ${q}<p>${intro} ${doc}</p></li>`);
 assert(conferirFormaDasCitacoes(split,{lang},new Map([[base.id,base]])).length);count++;
 const wrong=parse(`<summary>A pessoa, ${intro} «Outro documento»: ${q}</summary>`);
 assert(conferirFormaDasCitacoes(wrong,{lang},new Map([[base.id,base]])).length);count++;
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
