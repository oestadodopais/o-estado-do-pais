/** Todas as listas de fontes dos registos passam pelo renderizador da vista. */
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {manifestoDosRegistos,registoDaEdicao} from '../../src/lib/registos.mjs';
import {pecasDoCorpo} from '../../src/lib/registo-html.mjs';
import {linhaDoSitioDoEstudo} from '../../src/lib/cruzamento.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {hasSerie,getSerie,allSeries} from '../../src/lib/series.mjs';
import {nomeDoProjeto} from '../../src/data/nomes-das-medidas.mjs';
import {routePath} from '../../src/lib/routes.mjs';
import rotulos from '../../src/data/rotulos-das-series.json' with {type:'json'};
const claims=loadClaims();let editions=0,blocks=0,doors=0,catalogue=0,geografias=0,genericas=0,nomeadas=0;const nomesDeSerie=/** @type {Record<string,Map<string,string>>} */ ({});
// HB1-c3: o rótulo genérico «Fonte» só vale onde o renderizador o declara (a EO1,
// `src/lib/registo-html.mjs`): uma linha sem nome do projeto e sem série, fora do
// estudo da habitação, cujas portas dizem sempre o nome. As plantas no fim provam
// que a regra ainda recusa o rótulo genérico onde ele não vale.
const semNomeNemSerie=(/** @type {string} */ id)=>!nomeDoProjeto(id)&&!hasSerie(id)&&!allSeries().some(s=>s.linha_de_portugal===id||s.linha_da_uniao===id);
const aceita=(/** @type {string} */ slug,/** @type {string} */ id,/** @type {string} */ label)=>!!label&&(!/^(Fonte|Source)$/.test(label)||(slug!=='a-casa-em-portugal-e-na-europa'&&semNomeNemSerie(id)));
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
   const label=links[i].textContent.trim();assert(aceita(slug,id,label),key+' fonte sem nome');if(/^(Fonte|Source)$/.test(label))genericas++;doors++;
   const marked=links[i].querySelector('[data-serie]');
   // HB1-c3: uma linha de série com nome do projeto abre a porta pelo nome; as portas
   // de Portugal e da União da mesma série têm de se distinguir (o achado 23).
   const daSerie=allSeries().find(s=>s.linha_de_portugal===id||s.linha_da_uniao===id);
   if(!marked&&daSerie){const nome=nomeDoProjeto(id)?.[lang];assert.equal(label,nome,key+' porta de série sem o nome do projeto');const k=daSerie.id+'/'+lang;(nomesDeSerie[k]??=new Map()).set(id,label);nomeadas++;}
   if(marked) {
    const sid=marked.getAttribute('data-serie'),series=getSerie(sid);
    assert(id===sid||series.linha_de_portugal===id||series.linha_da_uniao===id,'rótulo de outra série');
    const rotulo=rotulos.rotulos.find(r=>r.serie===sid)?.documento;
    assert.equal(marked.textContent.trim(),rotulo,'rótulo fora do catálogo');
    // HB1-c2 (o achado 23): a geografia da linha citada segue o rótulo do catálogo.
    const geo=id===series.linha_de_portugal?'Portugal':id===series.linha_da_uniao?(lang==='pt'?'União Europeia':'European Union'):'';
    assert.equal(label,geo?`${rotulo}, ${geo}`:rotulo,'porta sem a geografia da linha');if(geo)geografias++;catalogue++;
   }
  }
 }
}
const distinguir=(/** @type {Map<string,string>} */ m)=>m.size<2||new Set(m.values()).size===m.size;
for(const [k,m] of Object.entries(nomesDeSerie))assert(distinguir(m),k+' portas de Portugal e da União com o mesmo nome');
assert(!distinguir(new Map([['pt','Sobrecarga'],['ue','Sobrecarga']])),'planta sem recusa: portas iguais');console.log('PLANTA portas iguais de Portugal e da União: recusada');
assert(doors&&(catalogue||nomeadas)&&(!catalogue||geografias),'nenhuma porta de série conferida');
const comSerie=allSeries().find(s=>s.linha_de_portugal)?.linha_de_portugal;
for(const [nome,ok] of [['genérico na habitação',aceita('a-casa-em-portugal-e-na-europa','divida-publica-2025-notificacao-ine-2026-09','Fonte')],['genérico numa linha com série',aceita('orcamento-2027-o-que-muda-e-para-quem',String(comSerie),'Source')],['porta vazia',aceita('orcamento-2027-o-que-muda-e-para-quem','divida-publica-2025-notificacao-ine-2026-09','')]]){assert(comSerie&&!ok,'planta sem recusa: '+nome);console.log('PLANTA '+nome+': recusada');}
console.log(JSON.stringify({edicoes:editions,blocos:blocks,portas:doors,rotulos_do_catalogo:catalogue,geografias,portas_de_serie_pelo_nome:nomeadas,portas_genericas:genericas,erros:0}));
