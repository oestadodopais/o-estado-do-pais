/** DO2: a régua da voz recusa palavras e algarismos sem origem nas duas formas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {verificaVozPais} from '../../scripts/voz-pais.mjs';
const raiz=process.cwd();
assert.deepEqual(verificaVozPais(raiz),[]);
let plantas=0;
for(const rota of ['', 'en', 'temas', 'en/themes']) {
  const html=fs.readFileSync(`dist/${rota?rota+'/':''}index.html`,'utf8');
  const seletor=rota.includes('temas')||rota.includes('themes')?'[data-dossie-lista]':'[data-novidade^="dossie:"]';
  for(const alterar of [
    r=>r.querySelector(`${seletor} a`).insertAdjacentHTML('beforeend',' palavra inventada'),
    r=>{const n=r.querySelector(`${seletor} [data-prova]`);n.replaceWith(n.textContent);},
  ]) {
    const r=parse(html);alterar(r);
    const erros=verificaVozPais(raiz,new Map([[rota,r.toString()]]));
    assert(erros.some(e=>/DO2|FP1|lista fechada/.test(e)),`${rota}: adulteração não recusada`);
    plantas++;
  }
}
console.log(`DO2: voz das duas formas conferida; ${plantas} plantas recusadas.`);
