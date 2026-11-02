/** As unidades lidas e os títulos só saem da prosa da casa com prova integral. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {retirarCitacoesEo1} from '../../scripts/citacoes-eo1-do-portao.mjs';
import {registoDoHtml} from '../../src/lib/eyetext.mjs';
import {errosDaFormaNoTexto} from '../../scripts/forma-da-citacao.mjs';
const rows=loadClaims(),slug='orcamento-2027-o-que-muda-e-para-quem';
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let count=0;
for(const lang of ['pt','en']) {
 const record=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8'));
 const block=record.blocks.find(b=>b.proofs.some(p=>p.tipo==='documento'&&p.id==='posicao-governo-irc'));
 assert(block,'OG1-E: falta o novo título documental');
 const title=block.proofs.find(p=>p.tipo==='documento'&&p.id==='posicao-governo-irc').texto;
 const html=text=>parse(`<main><p data-registo-unidade="${slug}/${lang}#${block.i}">${esc(text)}</p></main>`);
 const control=html(block.text);retirarCitacoesEo1(control,{key:'estudo',lang,params:{slug}},rows);
 assert(!control.textContent.includes(title),'K8: título documental ficou na prosa da casa');count++;
 const bad=html(block.text.replace(title,title+' 999'));retirarCitacoesEo1(bad,{key:'estudo',lang,params:{slug}},rows);
 assert(bad.textContent.includes(title+' 999'),'K8: título alterado saiu sem prova');count++;
 const dossier=html(block.text);retirarCitacoesEo1(dossier,{key:'estudo',lang,params:{slug}},rows);
 assert(!dossier.textContent.includes(title),'dossiê: título documental não retirado');count++;
 const source=registoDoHtml(fs.readFileSync(`studies-src/${slug}/${lang}.html`,'utf8'));
 assert.equal(source[block.i].text,block.text,'texto lido diverge do registo');count++;
 assert.notEqual(registoDoHtml(`<p>${esc(block.text.replace(title,title+' 999'))}</p>`)[0].text,block.text,'texto lido não detetou título alterado');count++;
 const debt=record.blocks.find(b=>b.proofs.some(p=>p.tipo==='documento'&&p.id==='posicao-governo-divida85'));
 assert.deepEqual(errosDaFormaNoTexto(debt.text,rows,lang),[],'título confundido com citação do excerto');count++;
 const r=rows.get('posicao-governo-divida85');
 assert(errosDaFormaNoTexto(`A pessoa: «${r.excerpt}»`,new Map([[r.id,r]]),lang).length,'título usado como fala direta passou');count++;
}
console.log(`OG1-E: ${count} controlos e plantas do texto lido, dos títulos, da K8 e da citação conferidos.`);
