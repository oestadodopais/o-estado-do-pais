import {medirPagina as medirPosicaoDosSelos} from '../../scripts/check-selos.mjs';
import './origens-coragua.mjs';
import assert from 'node:assert/strict';import {parse} from 'node-html-parser';import {loadClaims} from '../../src/lib/ledger.mjs';import {CORRECOES_TEXTO} from '../../src/data/correcoes.mjs';import {partesDaCorrecao} from '../../src/lib/texto-correcao.mjs';import {textoDaMudancaGate} from '../../scripts/texto-mudanca-gate.mjs';import {conferirNumerosDaCorrecao} from '../../scripts/edicoes-conferir.mjs';import {fraseHtml} from './texto-html.mjs';
const claims=loadClaims({includeWithdrawn:true});let plantas=0;
for(const c of CORRECOES_TEXTO)for(const lang of ['pt','en']){
 const partes=partesDaCorrecao(c,lang);assert.equal(textoDaMudancaGate(partes,claims,true),c.frase[lang]);
 assert.equal(textoDaMudancaGate([...partes,' 999'],claims,true),null);plantas++;
 const root=parse(`<span>${fraseHtml(c,lang)}</span>`);assert.deepEqual(medirPosicaoDosSelos(root.toString(),lang).erros,[],'A unidade fica antes do selo');assert.deepEqual(conferirNumerosDaCorrecao(root,claims,lang),[]);
 if(lang==='en'&&c.slug==='a-casa-em-portugal-e-na-europa'&&c.frase.en.includes('pelo menos')){
  assert(root.querySelectorAll('[lang="pt-PT"]').some(el=>el.textContent==='pelo menos'),'qualificação portuguesa sem língua marcada');
  const semLingua=parse(root.toString());semLingua.querySelectorAll('[lang="pt-PT"]').find(el=>el.textContent==='pelo menos').removeAttribute('lang');
  assert(conferirNumerosDaCorrecao(semLingua,claims,lang).includes('ED1 língua: nome português sem marca'));plantas++;
 }
 const comNumero=parse(root.toString()+'999');assert(conferirNumerosDaCorrecao(comNumero,claims,lang).length);plantas++;
 if(partes.some(p=>p?.claim)){
  const id=partes.find(p=>p?.claim).claim;
  assert.equal(textoDaMudancaGate(partes.map(p=>p?.claim===id?{claim:'nao-existe'}:p),claims,true),null);plantas++;
  for(const muda of [r=>r.querySelector(`[data-claim="${id}"]`).set_content('999'),r=>r.querySelector(`[data-claim="${id}"]`).setAttribute('data-claim','nao-existe'),r=>r.querySelector(`a.src-chip[href$="/${id}"]`).remove()]){const copia=parse(root.toString());muda(copia);assert(conferirNumerosDaCorrecao(copia,claims,lang).length);plantas++;}
 }
 if(c.datas){for(const muda of [r=>r.querySelector('.src-chip').remove(),r=>r.querySelector('[data-de-linha]').setAttribute('data-de-linha','nao-existe'),r=>r.querySelector('[data-de-linha]').set_content('999')]){const copia=parse(root.toString());muda(copia);assert(conferirNumerosDaCorrecao(copia,claims,lang).length);plantas++;}}
}
console.log(`ED1-E números: recomposição comum às mudanças do projeto; ${plantas} plantas recusadas.`);
