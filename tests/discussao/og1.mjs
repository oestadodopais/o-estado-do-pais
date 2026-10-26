/** OG1-A6: fragmentos, data de publicação e relação percentual nos dados e no HTML. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {OG1} from '../../src/data/discussao-og1.mjs';
import {resolverExplicacao} from '../../src/lib/explicacoes.mjs';
import {linhasImpressasOuDerivadas} from './efeitos.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
const claims=loadClaims();
const candidato=t=>({slug:'ensaio-og1',titulo:{pt:['Ensaio'],en:['Test']},abertura:[],naoDiz:[],seccoes:[{id:'fonte',titulo:{pt:'Fonte',en:'Source'},conteudo:[{paragrafo:{pt:[t],en:[t]}}]}]});
let checks=0;
const falsaData=structuredClone(OG1);falsaData.apenasDatas.push('pm-q3-3-r37-c3');assert.throws(()=>linhasImpressasOuDerivadas(falsaData,claims));checks++;

for(const lang of ['pt','en']){assert.equal(resolverExplicacao(OG1,lang).seccoes.length,6);checks++;}
for(const t of [
 {fragmento:'og1-utao-brent-diferenca',campo:'excerpt',texto:'11% abaixo'},
 {fragmento:'og1-governo-observador-saldo',campo:'excerpt',texto:'30'},
 {fragmento:'og1-governo-observador-saldo',campo:'attributed_to',texto:'Joaquim'},
 {data:'divida-publica-2024',campo:'access_date'},
 {data:'linha-inexistente-og1',campo:'published_at'},
]){assert.throws(()=>resolverExplicacao(candidato(t),'pt'));checks++;}
const data=resolverExplicacao(candidato({data:'divida-publica-2024',campo:'published_at'}),'pt');assert.equal(data.seccoes[0].blocos[0].pedacos[0].data.valor,'2026-10-21');checks++;
assert(claims.get('og1-utao-brent-diferenca').excerpt.includes('11% acima dos 86,1 USD'));checks++;
for(const[lang,route]of[['pt','o-que-se-discute'],['en','en/under-discussion']]){
 const root=parse(fs.readFileSync(`dist/${route}/index.html`,'utf8'));
 const item=root.querySelector('[data-discussao="orcamento-2027-generalidade"]');assert(item);checks++;
 assert.equal(item.querySelectorAll('[data-discussao-parte]').length,6);checks++;
 assert.equal(item.querySelector('[data-discussao-parte="como-foi-dito"]').querySelectorAll('[data-discussao-paragrafo]').length,11);checks++;
 for(const span of item.querySelectorAll('[data-linha-trecho]')){
  const row=claims.get(span.getAttribute('data-linha-claim')),field=span.getAttribute('data-linha-campo');
  const text=field==='excerpt'?row.excerpt:row.document.title;
  assert(text.includes(span.text));assert.equal(span.text,span.getAttribute('data-linha-trecho'));checks++;
 }
 for(const section of ['fontes','conclusao']){
  const copy=parse(item.querySelector(`[data-discussao-parte="${section}"]`).toString());copy.querySelectorAll('.src-chip').forEach(n=>n.remove());
  assert(copy.text.includes(lang==='pt'?'11 % acima':'11 % above'));checks++;
 }
 assert(item.querySelector('[data-discussao-saude]')?.getAttribute('href').endsWith('#saude-no-orcamento'));checks++;
 for(const id of Object.keys(JSON.parse(fs.readFileSync('ledger/provas/og1a/provas.json')).rows))assert(fs.existsSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`));checks++;
}
console.log(`PASS: ${checks} conferências OG1 das formas, fontes e recibos nas duas edições.`);
