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
 const expected=norm(String(c.value));
 assert.equal(norm(page.querySelector('.linha-valor [data-claim]').text),expected);receipts++;
 const labels=page.querySelectorAll('.aparelho-ficha dt').map(e=>norm(e.text));
 assert(!labels.includes(lang==='pt'?'Nome na fonte':'Name at the source'),c.id+': derivada apresentada como nome na fonte');
 assert(page.querySelectorAll('.aparelho-ficha dd').some(e=>norm(e.text)===(lang==='pt'?'cálculo sobre as linhas identificadas':'computed from the identified rows')),c.id+': localizador da derivada');
 const arithmetic=norm(page.querySelector('[data-linha-campo="derivation"]').text);
 for(const origin of c.derived_from){
  const source=parse(fs.readFileSync(`${dist}/${lang==='pt'?'livro-razao':'en/ledger'}/${origin}/index.html`,'utf8'));
  const value=norm(source.querySelector('.linha-valor [data-claim]').text).replace(/^[−+-]\s*/, '');
  assert(arithmetic.includes(value+' ('),c.id+': formato diferente do recibo '+origin+' ('+value+')');
 }
 assert(!/percentagem do PIB[^)]*% do PIB|percentage of GDP[^)]*% of GDP/.test(arithmetic),c.id+': unidade duplicada');

}
console.log(`EO1-d recibos: ${receipts} conferidos; ${plants} plantas de estado recusadas; controlo código 0.`);

for(const lang of ['pt','en']){
 const prefix=lang==='pt'?'livro-razao':'en/ledger';
 const page=parse(fs.readFileSync(`${dist}/${prefix}/oe-2027-calendario-entrega/index.html`,'utf8'));
 assert.equal(norm(page.querySelector('.linha-valor [data-claim]').text),'8 de outubro');
 const cds=parse(fs.readFileSync(`${dist}/${prefix}/posicao-cds-orcamento/index.html`,'utf8'));
 assert.equal(norm(cds.querySelector('[data-linha-campo="document.edition"]').text),'2026');
}
