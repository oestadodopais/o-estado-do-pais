/** EO1-d: estado de imprensa e forma numérica conferidos nos recibos construídos. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {localizadorEo1Confere} from '../../scripts/localizadores-eo1-do-portao.mjs';
const claims=loadClaims(), dist=process.env.OEDP_DIST??'dist';
const rows=[...claims.values()].filter(c=>c.study==='orcamento-2027-o-que-muda-e-para-quem');
const press=rows.filter(c=>c.status==='por confirmar na fonte primária');
assert.equal(press.length,8);
if(process.argv.includes('--planta-estado')) {
 const bad=structuredClone(press[0]);bad.status='confirmado';
 const recusado=!localizadorEo1Confere(bad.name_source,bad);
 console.log(recusado?'EO1-d estado: alteração recusada pela prova selada.':'EO1-d estado: alteração aceite indevidamente.');
 process.exit(recusado?1:0);
}

const norm=s=>s.replace(/\s+/g,' ').trim();
let receipts=0, plants=0;
for(const c of press){
 assert(localizadorEo1Confere(c.name_source,c));
 const bad=structuredClone(c);bad.status='confirmado';
 assert(!localizadorEo1Confere(bad.name_source,bad));plants++;
 for(const lang of ['pt','en']){
  const page=parse(fs.readFileSync(`${dist}/${lang==='pt'?'livro-razao':'en/ledger'}/${c.id}/index.html`,'utf8'));
  const expected=lang==='pt'?'Por confirmar na fonte primária: o que aqui está é o que a notícia escreveu':'To be confirmed at the primary source: what is here is what the news report wrote';
  assert(page.querySelectorAll('.aparelho-nota').some(el=>norm(el.text)===expected),c.id+': estado perdido');receipts++;
 }
}
for(const c of rows.filter(c=>c.derivation))for(const lang of ['pt','en']){
 const page=parse(fs.readFileSync(`${dist}/${lang==='pt'?'livro-razao':'en/ledger'}/${c.id}/index.html`,'utf8'));
 const name=page.querySelector('.linha-nome-da-fonte .linha-campo-k').text;
 assert.equal(name,lang==='pt'?'Linha derivada deste projeto':'Derived row of this project');
 const raw=String(c.value).replace(/\s/g,''),[whole,frac]=raw.split(',');
 const expected=lang==='pt'?norm(String(c.value)):whole.replace(/(\d)(?=(\d{3})+(?!\d))/g,'$1,')+(frac===undefined?'':'.'+frac);
 assert.equal(norm(page.querySelector('.linha-valor [data-claim]').text),expected);receipts++;
}
console.log(`EO1-d recibos: ${receipts} conferidos; ${plants} plantas de estado recusadas; controlo código 0.`);
