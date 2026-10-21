import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {rotuloDaPortaDaSerieConferido} from '../../scripts/voz-b1.mjs';
let controlos=0,plantas=0;
for(const lang of ['pt','en']) {
 const route=lang==='pt'?'estudos':'en/studies';
 const root=parse(fs.readFileSync(`dist/${route}/a-casa-em-portugal-e-na-europa/index.html`,'utf8'));
 for(const el of root.querySelectorAll('.texto-fontes [data-serie]')) {
  assert(rotuloDaPortaDaSerieConferido(el,lang));controlos++;
  const html=el.closest('.texto-fontes').outerHTML;
  for(const change of [
   e=>e.set_content('Housing cost overburden rate. A casa verifica tudo.'),
   e=>e.setAttribute('data-serie-campo','name'),
   e=>e.setAttribute('data-serie','serie-inexistente'),
   e=>e.closest('a').setAttribute('href','/'),
   e=>e.closest('.texto-fontes').removeAttribute('data-fontes-da-unidade'),
  ]) {
   const copy=parse(html),bad=copy.querySelector('[data-serie]');change(bad);
   assert.equal(rotuloDaPortaDaSerieConferido(bad,lang),false);plantas++;
  }
 }
}
assert(controlos>0);console.log(JSON.stringify({controlos,plantas,erros:0}));
