import { emEnsaio } from '../../site.config.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {t} from '../../src/i18n/strings.mjs';
import {conferirSuperficieCorrecoes} from '../../scripts/correcoes-superficie-conferir.mjs';
const politicas={
 pt:(emEnsaio() ? 'A partir do lançamento, quando o que se publicou aqui estiver errado,' : 'Desde o lançamento, quando o que se publicou aqui está errado,') + ' corrige-se à vista: cada entrada traz o que estava, o que ficou, a data e o motivo, e nada se apaga. Uma atualização não é um erro: é um valor que mudou porque aquilo que mede mudou, ou um estudo que ganhou documentos novos.',
 en:(emEnsaio() ? 'From launch onward,' : 'Since launch,') + ' when something published here is wrong, it is corrected in the open: each entry carries what it was, what it became, the date and the reason, and nothing is deleted. An update is not an error: it is a value that changed because what it measures changed, or a study that gained new documents.'};
for(const lang of ['pt','en']){
 const r=t(lang).correcoes;assert.equal(r.politicaV,politicas[lang]);assert.equal(r.naturezas.length,5);assert.equal(r.naturezas.at(-1).k,lang==='pt'?'Estudo corrigido.':'Study corrected.');
 assert(r.politicaV.includes(lang==='pt'?'nada se apaga':'nothing is deleted'));
 const root=parse(fs.readFileSync(`${process.env.OEDP_DIST??'dist'}/${lang==='pt'?'correcoes':'en/corrections'}/index.html`,'utf8'));
 if(process.argv.includes('--preparar')){root.querySelector('.lede')?.remove();root.querySelector('#politica .metodo-lista')?.remove();root.querySelector('#politica .metodo-p').set_content(r.politicaV);root.querySelector('meta[name="description"]').setAttribute('content',r.metaDescription);}
 assert.deepEqual(conferirSuperficieCorrecoes(root,lang),[]);console.log(`EV3-G ${lang}: superfície autorizada, verde 0.`);
 const atribuicao=parse(root.outerHTML);atribuicao.querySelector('#politica .metodo-p').set_content(r.politicaV.replace(lang==='pt'?'cada entrada traz':'each entry carries',lang==='pt'?'a entrada diz':'the entry says'));assert(conferirSuperficieCorrecoes(atribuicao,lang).length,'REC1: verbo de atribuição reposto recusado');
 const semSegunda=parse(root.outerHTML);semSegunda.querySelector('#politica .metodo-p').set_content(r.politicaV.split(lang==='pt'?' Uma atualização':' An update')[0]);assert(conferirSuperficieCorrecoes(semSegunda,lang).length);
 const antiga=lang==='pt'?'Corrigir em silêncio é a forma mais barata de mentir.':'Correcting in silence is the cheapest way of lying.';
 const copia=parse(root.outerHTML);copia.querySelector('h1').insertAdjacentHTML('afterend',`<p class="lede">${antiga}</p>`);assert(conferirSuperficieCorrecoes(copia,lang).some(e=>e.includes('texto entre')));console.log(`EV3-G ${lang}: lede antiga reposta, vermelho 1.`);
 const extra=parse(root.outerHTML);extra.querySelector('#politica').insertAdjacentHTML('afterend','<p>Uma frase acrescentada.</p>');assert(conferirSuperficieCorrecoes(extra,lang).some(e=>e.includes('texto entre')));
}
console.log('ED1 política: cinco naturezas nos dados; história conservada; texto integral e plantas conferidos.');
