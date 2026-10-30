/** DO3: os mesmos caminhos das réguas recusam os estragos no dossiê. */
import {superficieDe,PALAVRAS_PROIBIDAS} from '../../scripts/voz-palavras.mjs';
import fs from 'node:fs';
import {routePath} from '../../src/lib/routes.mjs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {DOSSIES} from '../../src/data/dossies.mjs';
import {conferirSuperficieDossies} from '../../scripts/dossies-superficie.mjs';
import {conferirPalavrasDaExplicacaoNaPagina} from '../explicacoes/explicacao.mjs';
let plantas=0;
for(const lang of ['pt','en'])for(const d of DOSSIES) {
 const pagina=`${lang==='pt'?'dossies':'en/dossiers'}/${d.slug}/index.html`;
 const html=fs.readFileSync(`dist/${pagina}`,'utf8');
 const fonteExplicacao=parse(fs.readFileSync(`dist/${routePath('explicacao',lang,{slug:d.pecas.explicacoes[0]})}/index.html`,'utf8'));
 const limiar=PALAVRAS_PROIBIDAS.find(p=>p.chave==='limiar').marca;
 assert(!limiar.test(superficieDe(html,{pagina})));
 for(const seletor of ['[data-dossie-resto]','[data-registo-unidade]']) {
   const r=parse(html);r.querySelector(seletor).insertAdjacentHTML('beforeend',' limiar. ');
   assert(limiar.test(superficieDe(r.toString(),{pagina})));plantas++;
 }
 const superficie=r=>conferirSuperficieDossies(r,lang,pagina).erros;
 const explicacao=r=>conferirPalavrasDaExplicacaoNaPagina(r,lang,'dossie',d.slug);
 for(const medir of [superficie,explicacao])assert.deepEqual(medir(parse(html)),[]);
 for(const [medir,alterar] of [
  [superficie,r=>r.querySelector('details.texto-fontes').insertAdjacentHTML('beforeend','<p>Frase da casa plantada.</p>')],
  [superficie,r=>r.querySelector('details.texto-fontes a').setAttribute('href','/')],
  [superficie,r=>r.querySelector('[data-dossie-seccao] [data-registo-unidade]').insertAdjacentHTML('afterend',' Texto plantado entre blocos. ')],
  [superficie,r=>r.querySelector('[data-dossie-indice] a').set_content('Título inventado')],
  [superficie,r=>r.querySelector('[data-dossie-resto] a').setAttribute('href','/')],
  [superficie,r=>r.querySelector('[data-registo-unidade]').set_content('Prosa inventada')],
  [superficie,r=>r.querySelector('[data-registo-bloco]').remove()],
  [superficie,r=>r.querySelector('[data-registo-edicao] a.src-chip').setAttribute('href','/')],
  [explicacao,r=>r.querySelector('[data-dossie-explicacao]').insertAdjacentHTML('beforeend',fonteExplicacao.querySelector('[data-explicacao-portas]').outerHTML)],
  [explicacao,r=>r.querySelector('[data-dossie-explicacao]').insertAdjacentHTML('beforeend',fonteExplicacao.querySelector('[data-discussao-integracao]').outerHTML)],
  [explicacao,r=>r.querySelector('[data-dossie-explicacao] [data-claim]').set_content('999999')],
  [explicacao,r=>r.querySelector('[data-dossie-explicacao] a.src-chip').setAttribute('href','/')],
  [explicacao,r=>r.querySelector('[data-explicacao-paragrafo]').insertAdjacentHTML('beforeend',' Frase inventada.')],
  [explicacao,r=>r.querySelector('[data-explicacao-secao] h3').set_content('Título inventado')],
  [explicacao,r=>r.querySelector('[data-dossie-explicacao] [data-instrumento]').remove()],
  [explicacao,r=>r.querySelector('[data-dossie-explicacao] .exp-barra').setAttribute('style','width:999999%')],
 ]) {const r=parse(html);alterar(r);assert(medir(r).length,'DO3: planta não recusada');plantas++;}
}
console.log(`DO3: superfície, voz e explicação conferidas; ${plantas} plantas recusadas.`);
