import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {t} from '../../src/i18n/strings.mjs';
import {conferirSuperficieCorrecoes} from '../../scripts/correcoes-superficie-conferir.mjs';
const politicas={
 pt:'Quando o que se publicou aqui está errado, corrige-se à vista: a entrada diz o que estava, o que ficou, a data e o motivo, e nada se apaga. Uma atualização não é um erro: é um valor que mudou porque aquilo que mede mudou, ou um estudo que ganhou documentos novos.',
 en:'When something published here is wrong, it is corrected in the open: the entry says what it was, what it became, the date and the reason, and nothing is deleted. An update is not an error: it is a value that changed because what it measures changed, or a study that gained new documents.'};
for(const lang of ['pt','en']){
 const r=t(lang).correcoes;assert.equal(r.politicaV,politicas[lang]);assert.equal(r.naturezas.length,5);assert.equal(r.naturezas.at(-1).k,lang==='pt'?'Estudo corrigido.':'Study corrected.');
 assert(r.politicaV.includes(lang==='pt'?'nada se apaga':'nothing is deleted'));
 const root=parse(fs.readFileSync(`${process.env.OEDP_DIST??'dist'}/${lang==='pt'?'correcoes':'en/corrections'}/index.html`,'utf8'));
 if(process.argv.includes('--preparar')){root.querySelector('.lede')?.remove();root.querySelector('#politica .metodo-lista')?.remove();root.querySelector('#politica .metodo-p').set_content(r.politicaV);root.querySelector('meta[name="description"]').setAttribute('content',r.metaDescription);}
 assert.deepEqual(conferirSuperficieCorrecoes(root,lang),[]);console.log(`EV3-G ${lang}: superfície autorizada, verde 0.`);
 const antiga=lang==='pt'?'Corrigir em silêncio é a forma mais barata de mentir.':'Correcting in silence is the cheapest way of lying.';
 const copia=parse(root.outerHTML);copia.querySelector('h1').insertAdjacentHTML('afterend',`<p class="lede">${antiga}</p>`);assert(conferirSuperficieCorrecoes(copia,lang).some(e=>e.includes('texto entre')));console.log(`EV3-G ${lang}: lede antiga reposta, vermelho 1.`);
 const extra=parse(root.outerHTML);extra.querySelector('#politica').insertAdjacentHTML('afterend','<p>Uma frase acrescentada.</p>');assert(conferirSuperficieCorrecoes(extra,lang).some(e=>e.includes('texto entre')));
}
console.log('ED1 política: cinco naturezas nos dados; história conservada; texto integral e plantas conferidos.');
