import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {rotuloDaPortaDaSerieConferido} from '../../scripts/voz-b1.mjs';
import {allSeries} from '../../src/lib/series.mjs';
import {nomeDoProjeto} from '../../src/data/nomes-das-medidas.mjs';
import {routePath} from '../../src/lib/routes.mjs';
/* HB1-c4 (21.10.2026): o estudo da habitação já não tem portas de catálogo
   ([data-serie]); as linhas citadas abrem a porta pelo nome do projeto. O teste
   conta também essas portas nomeadas: o rótulo é nomeDoProjeto(id)[lang], o
   data-de-linha é o id e o href é a página da linha. Medido nesta passagem:
   nenhuma série de ledger/series/ declara as linhas da habitação como
   linha_de_portugal ou linha_da_uniao, por isso a porta nomeada conta-se pela
   marca (span[data-nome="projeto"][data-de-linha] com nome do projeto), um
   conjunto que contém o das séries; os rótulos de Portugal e da União da mesma
   série conferem-se distintos quando a série existir. */
const ladoDaSerie=new Map();
for(const s of allSeries())for(const [campo,lado] of [['linha_de_portugal','portugal'],['linha_da_uniao','uniao']])
 if(typeof s[campo]==='string')ladoDaSerie.set(s[campo],{serie:s.id,lado});
const normal=(/** @type {string} */ s)=>String(s??'').replace(/\s+/g,' ').trim();
/** @param {any} a @param {string} id @param {'pt'|'en'} lang */
export function portaNomeadaConferida(a,id,lang){
 const marca=a?.querySelector('span[data-nome="projeto"]');
 return Boolean(marca)&&normal(marca.textContent)===nomeDoProjeto(id)?.[lang]&&marca.getAttribute('data-de-linha')===id&&a.getAttribute('href')===routePath('linha',lang,{slug:id});
}
let controlos=0,plantas=0;const contas={catalogo:0,nomeadas:0,de_serie:{portugal:0,uniao:0},pares_distintos:0};const recusas=new Set();
for(const lang of /** @type {const} */ (['pt','en'])) {
 const route=lang==='pt'?'estudos':'en/studies';
 const root=parse(fs.readFileSync(`dist/${route}/a-casa-em-portugal-e-na-europa/index.html`,'utf8'));
 for(const el of root.querySelectorAll('.texto-fontes [data-serie]')) {
  assert(rotuloDaPortaDaSerieConferido(el,lang));controlos++;contas.catalogo++;
  const html=el.closest('.texto-fontes').outerHTML;
  for(const change of [
   (/** @type {any} */ e)=>e.set_content('Housing cost overburden rate. A casa verifica tudo.'),
   (/** @type {any} */ e)=>e.setAttribute('data-serie-campo','name'),
   (/** @type {any} */ e)=>e.setAttribute('data-serie','serie-inexistente'),
   (/** @type {any} */ e)=>e.closest('a').setAttribute('href','/'),
   (/** @type {any} */ e)=>e.closest('.texto-fontes').removeAttribute('data-fontes-da-unidade'),
  ]) {
   const copy=parse(html),bad=copy.querySelector('[data-serie]');change(bad);
   assert.equal(rotuloDaPortaDaSerieConferido(bad,lang),false);plantas++;
  }
 }
 /** @type {Map<string,Map<string,string>>} */ const rotulosDaSerie=new Map();
 for(const a of root.querySelectorAll('.texto-fontes a[href]')) {
  const marca=a.querySelector('span[data-nome="projeto"][data-de-linha]');
  const slug=(a.getAttribute('href')??'').replace(/\/$/,'').split('/').pop()??'';
  const id=marca?.getAttribute('data-de-linha')??slug;
  if(!nomeDoProjeto(id)&&!ladoDaSerie.has(slug))continue;
  assert(portaNomeadaConferida(a,id,lang),`porta nomeada ${id} (${lang}): rótulo, data-de-linha ou href diferente`);controlos++;contas.nomeadas++;
  const lado=ladoDaSerie.get(id);
  if(lado){contas.de_serie[lado.lado]++;const m=rotulosDaSerie.get(lado.serie)??new Map();m.set(lado.lado,normal(a.textContent));rotulosDaSerie.set(lado.serie,m);}
  const html=a.outerHTML;
  for(const [nome,change] of [
   ['o rótulo trocado',(/** @type {any} */ x)=>x.querySelector('span[data-nome="projeto"]').set_content('Sobrecarga do custo da habitação, Espanha')],
   ['o href para /',(/** @type {any} */ x)=>x.setAttribute('href','/')],
   ['o data-de-linha tirado',(/** @type {any} */ x)=>x.querySelector('span[data-nome="projeto"]').removeAttribute('data-de-linha')],
  ]) {
   const bad=parse(html).querySelector('a');change(bad);
   assert.equal(portaNomeadaConferida(bad,id,lang),false,`planta sem recusa: ${nome}`);plantas++;recusas.add(nome);
  }
 }
 for(const [serie,m] of rotulosDaSerie)if(m.has('portugal')&&m.has('uniao')){assert.notEqual(m.get('portugal'),m.get('uniao'),`série ${serie} (${lang}): Portugal e União com o mesmo rótulo`);contas.pares_distintos++;}
}
assert(controlos>0);console.log(JSON.stringify({controlos,plantas,...contas,plantas_recusadas:[...recusas],erros:0}));
