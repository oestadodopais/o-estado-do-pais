/** Todas as listas de fontes dos registos passam pelo renderizador da vista. */
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {manifestoDosRegistos,registoDaEdicao} from '../../src/lib/registos.mjs';
import {pecasDoCorpo} from '../../src/lib/registo-html.mjs';
import {linhaDoSitioDoEstudo} from '../../src/lib/cruzamento.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {hasSerie,getSerie} from '../../src/lib/series.mjs';
import {routePath} from '../../src/lib/routes.mjs';
import rotulos from '../../src/data/rotulos-das-series.json' with {type:'json'};
const claims=loadClaims();let editions=0,blocks=0,doors=0,catalogue=0;
for(const [key,entry] of Object.entries(manifestoDosRegistos().registos)) {
 const [slug,lang]=key.split('/'),registo=registoDaEdicao(slug,lang),resolve=linhaDoSitioDoEstudo(entry.rh_study,entry.rh_origens??{});
 const pieces=pecasDoCorpo({registo,chave:key,linhaDoSitio:resolve,rotuloDaPorta:lang==='pt'?'Fonte':'Source'});
 const doc=parse(pieces.map(p=>p.html??'').join(''));editions++;
 for(const block of registo.blocks) {
  const refs=block.source_rows??[];if(!refs.length)continue;
  const lists=doc.querySelectorAll(`[data-fontes-da-unidade="${key}#${block.i}"]`);assert.equal(lists.length,1,key+' lista de fontes');blocks++;
  const links=lists[0].querySelectorAll('a');assert.equal(links.length,refs.length,key+' número de portas');
  for(const [i,row] of refs.entries()) {
   const id=resolve(row);assert(id&&(claims.has(id)||hasSerie(id)),key+' fonte sem recibo');
   assert.equal(links[i].getAttribute('href'),routePath('linha',lang,{slug:id}));
   const label=links[i].textContent.trim();assert(label&&!/^(Fonte|Source)$/.test(label),key+' fonte sem nome');doors++;
   const marked=links[i].querySelector('[data-serie]');
   if(marked) {
    const sid=marked.getAttribute('data-serie'),series=getSerie(sid);
    assert(id===sid||series.linha_de_portugal===id||series.linha_da_uniao===id,'rótulo de outra série');
    assert.equal(label,rotulos.rotulos.find(r=>r.serie===sid)?.documento,'rótulo fora do catálogo');catalogue++;
   }
  }
 }
}
assert(doors&&catalogue,'nenhuma porta de catálogo conferida');
console.log(JSON.stringify({edicoes:editions,blocos:blocks,portas:doors,rotulos_do_catalogo:catalogue,erros:0}));
