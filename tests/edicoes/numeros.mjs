import assert from 'node:assert/strict';import {parse} from 'node-html-parser';import {loadClaims} from '../../src/lib/ledger.mjs';import {CORRECOES_TEXTO} from '../../src/data/correcoes.mjs';import {partesDaCorrecao} from '../../src/lib/texto-correcao.mjs';import {textoDaMudancaGate} from '../../scripts/texto-mudanca-gate.mjs';import {conferirNumerosDaCorrecao} from '../../scripts/edicoes-conferir.mjs';import {fraseHtml} from './texto-html.mjs';
const claims=loadClaims();let plantas=0;
for(const c of CORRECOES_TEXTO)for(const lang of ['pt','en']){
 const partes=partesDaCorrecao(c,lang);assert.equal(textoDaMudancaGate(partes,claims,true),c.frase[lang]);
 assert.equal(textoDaMudancaGate([...partes,' 999'],claims,true),null);plantas++;
 const root=parse(`<span>${fraseHtml(c,lang)}</span>`);assert.deepEqual(conferirNumerosDaCorrecao(root,claims,lang),[]);
 if(lang==='en'&&c.slug==='a-casa-em-portugal-e-na-europa'){
  assert(root.querySelectorAll('[lang="pt-PT"]').some(el=>el.textContent==='pelo menos'),'qualificação portuguesa sem língua marcada');
  const semLingua=parse(root.toString());semLingua.querySelectorAll('[lang="pt-PT"]').find(el=>el.textContent==='pelo menos').removeAttribute('lang');
  assert(conferirNumerosDaCorrecao(semLingua,claims,lang).includes('ED1 língua: nome português sem marca'));plantas++;
 }
 const comNumero=parse(root.toString()+'999');assert(conferirNumerosDaCorrecao(comNumero,claims,lang).length);plantas++;
 if(c.datas){for(const muda of [r=>r.querySelector('.src-chip').remove(),r=>r.querySelector('[data-de-linha]').setAttribute('data-de-linha','nao-existe'),r=>r.querySelector('[data-de-linha]').set_content('999')]){const copia=parse(root.toString());muda(copia);assert(conferirNumerosDaCorrecao(copia,claims,lang).length);plantas++;}}
}
console.log(`ED1-E números: recomposição comum às mudanças do projeto; ${plantas} plantas recusadas.`);
