/** Confere a composição e as portas HB1 antes da construção do sítio. */
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {manifestoDosRegistos,registoDaEdicao} from '../src/lib/registos.mjs';
import {pecasDoCorpo} from '../src/lib/registo-html.mjs';
import {linhaDoSitioDoEstudo} from '../src/lib/cruzamento.mjs';
import {loadClaims} from '../src/lib/ledger.mjs';
import {routePath} from '../src/lib/routes.mjs';
const slug='a-casa-em-portugal-e-na-europa',claims=loadClaims(),manifest=manifestoDosRegistos();
for(const lang of ['pt','en']) {
 const key=slug+'/'+lang,entry=manifest.registos[key],registo=registoDaEdicao(slug,lang);
 assert(entry&&registo,'edição ausente');
 const resolve=linhaDoSitioDoEstudo(entry.rh_study,entry.rh_origens??{});
 const pieces=pecasDoCorpo({registo,chave:key,linhaDoSitio:resolve,rotuloDaPorta:'Fonte'});
 const html=parse(pieces.map(p=>p.html??'').join(''));
 for(const block of registo.blocks) {
  const refs=block.source_rows??[];if(!refs.length)continue;
  const doors=html.querySelectorAll(`[data-fontes-da-unidade="${key}#${block.i}"]`);
  assert.equal(doors.length,1,'porta por parágrafo');
  assert.deepEqual(doors[0].querySelectorAll('a').map(a=>a.getAttribute('href')),refs.map(row=>{const id=resolve(row);assert(claims.has(id),'recibo ausente: '+row);return routePath('linha',lang,{slug:id});}));
 }
 assert(!/[⟦⟧]/.test(html.textContent),'token sem composição');
 console.log(JSON.stringify({lang,blocos:registo.blocks.length,portas:html.querySelectorAll('[data-fontes-da-unidade]').length,selos:pieces.filter(p=>p.selo).length}));
}
