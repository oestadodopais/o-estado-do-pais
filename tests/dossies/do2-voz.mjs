/** DO2: voz das formas presentes e cenário explícito de dossiê nas novidades. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {verificaVozPais} from '../../scripts/voz-pais.mjs';
import {cenarioDossie,conferirNovidades} from '../inicio/novidades.mjs';
const raiz=process.cwd();
assert.deepEqual(verificaVozPais(raiz),[]);
let plantas=0;
for(const rota of ['', 'en', 'temas', 'en/themes']) {
 const html=fs.readFileSync(`dist/${rota?rota+'/':''}index.html`,'utf8');
 const seletor=parse(html).querySelector('[data-novidade^="dossie:"]')?'[data-novidade^="dossie:"]':'[data-dossie-lista]';
 for(const alterar of [
  r=>r.querySelector(`${seletor} a`).insertAdjacentHTML('beforeend',' palavra inventada'),
  r=>{const n=r.querySelector(`${seletor} [data-prova]`);n.replaceWith(n.textContent);},
 ]) {
  const r=parse(html);alterar(r);
  const erros=verificaVozPais(raiz,new Map([[rota,r.toString()]]));
  assert(erros.some(e=>/DO2|DO4|FP1|lista fechada/.test(e)),`${rota}: adulteração não recusada`);
  plantas++;
 }
}
// conferirNovidades é a mesma guarda que verificaVozPais exige antes de dispensar os nós.
for(const lang of ['pt','en']) {
 const html=fs.readFileSync(`dist/${lang==='en'?'en/':''}index.html`,'utf8');
 const c=cenarioDossie(html,lang,'dist');
 assert.deepEqual(conferirNovidades(parse(c.html),lang,'dist',c.publicacoes),[]);
 for(const [mudar,padrao] of [
  [r=>r.querySelector('[data-novidade^="dossie:"] a').insertAdjacentHTML('beforeend',' palavra inventada'),/título da peça/],
  [r=>{const n=r.querySelector('[data-novidade^="dossie:"] [data-prova]');n.replaceWith(n.textContent);},/contagem sem token/],
  [r=>r.querySelector('[data-novidade^="dossie:"] .pp-novidade-tipo').set_content('tipo inventado'),/tipo do dossiê/],
  [r=>r.querySelector('[data-novidade^="dossie:"]').insertAdjacentHTML('beforeend',' palavra inventada'),/texto fora das colunas/],
 ]) {
  const r=parse(c.html);mudar(r);
  assert(conferirNovidades(r,lang,'dist',c.publicacoes).some(e=>padrao.test(e)));
  plantas++;
 }
}
console.log(`DO2 e DO4: formas reais e dossiê de ensaio conferidos; ${plantas} plantas recusadas.`);
