/** DO1-B: campos e datas de um assunto declarado, sem desligar a auditoria dos valores. */
import assert from 'node:assert/strict';
import { listagensDoInicio } from '../src/lib/listagens-do-inicio.mjs';
import { parse } from 'node-html-parser';
import { DOSSIES } from '../src/data/dossies.mjs';
import { WORKS } from '../src/data/studies.mjs';
import { ITENS } from '../src/data/discussao.mjs';
import { EXPLICACOES } from '../src/data/explicacoes/index.mjs';
import { dataPublicacao } from '../src/lib/publicacao.mjs';
import { dataDaCasa } from '../src/lib/datas.mjs';
function recente(d,lang) {
 return [...d.pecas.estudos.map(slug=>{const w=WORKS.find(w=>w.slug===slug);return {data:dataPublicacao(w,w.editions.find(e=>e.lang===lang)??w.editions[0]),origem:'publicacao.declarada'};}),...d.pecas.itens.map(slug=>({data:ITENS.find(e=>e.slug===slug).escrita,origem:'escrita.declarada'})),...d.pecas.explicacoes.map(slug=>({data:EXPLICACOES.find(e=>e.slug===slug).publicado,origem:'publicacao.declarada'}))].filter(e=>e.data).sort((a,b)=>b.data.localeCompare(a.data))[0];
}
export function dataDoDossiePermitida(el,rota,lang='pt') {
 const origem=el.getAttribute('data-data-origem');
 if(!['publicacao.declarada','escrita.declarada'].includes(origem))return false;
 const novidade=el.closest('[data-novidade^="dossie:"]');
 const lista=el.closest('[data-dossie-lista]')??novidade, artigo=el.closest('[data-dossie]');
 const d=DOSSIES.find(d=>d.slug===(novidade?novidade.getAttribute('data-novidade').slice(7):(lista??artigo)?.getAttribute(lista?'data-dossie-lista':'data-dossie')));
 if(!d)return false;
 // DO4: na caixa, a data é o primeiro filho direto, com a marca editorial.
 if(novidade&&(el.parentNode!==novidade||novidade.children[0]!==el||el.getAttribute('data-nonledger')!=='data-editorial'))return false;
 let data;
 if(lista) {
  const porta={entradaCasa:'habitacao',entradaEstado:'estado-e-economia'}[rota];
  const seccao=lista.closest('[data-discussao-inicio]')?'discussao':lista.closest('[data-para-perceber]')?'perceber':lista.closest('#trabalhos')?'estudos':lista.closest('[data-integracao-do-inicio]')?'integracao':null;
  const inicio=rota==='home'&&(novidade||seccao&&listagensDoInicio(lang)[seccao].some(e=>e.tipo==='dossie'&&e.dossie.slug===d.slug));
  if(!inicio&&!['dossies','temas'].includes(rota)&&!d.portas.includes(porta))return false;
  const ultima=recente(d,lang);
  if(origem!==ultima.origem)return false;
  data=ultima.data;
 } else {
  if(rota!=='dossie')return false;
  const item=el.closest('[data-discussao-integracao]')?.getAttribute('data-discussao-integracao');
  const explicacao=el.closest('[data-dossie-explicacao]')?.getAttribute('data-dossie-explicacao');
  if(item&&d.pecas.itens.includes(item)&&origem==='escrita.declarada')data=ITENS.find(e=>e.slug===item).escrita;
  else if(explicacao&&d.pecas.explicacoes.includes(explicacao)&&origem==='publicacao.declarada')data=EXPLICACOES.find(e=>e.slug===explicacao).publicado;
  else if(el.getAttribute('data-dossie-data')==='escrita'&&origem==='escrita.declarada')data=d.escrita;
  else if(el.getAttribute('data-dossie-data')==='recente'&&origem===recente(d,lang).origem)data=recente(d,lang).data;
 }
 return Boolean(data&&el.getAttribute('datetime')===data&&el.text.trim()===dataDaCasa(data));
}
export function plantasDossiesHtml() {
 const d=DOSSIES.find(d=>d.slug==='orcamento-2027');
 const data=parse(`<article data-dossie="${d.slug}"><time data-dossie-data="escrita" data-data-origem="escrita.declarada" datetime="${d.escrita}">${dataDaCasa(d.escrita)}</time></article>`).querySelector('time');
 assert(dataDoDossiePermitida(data,'dossie'));
 data.setAttribute('data-data-origem','origem-inventada');assert(!dataDoDossiePermitida(data,'dossie'));
 data.setAttribute('data-data-origem','escrita.declarada');assert(!dataDoDossiePermitida(data,'home'));
 data.setAttribute('datetime','1900-01-01');assert(!dataDoDossiePermitida(data,'dossie'));
 for(const lang of ['pt','en']) {
  const ultima=recente(d,lang);
  const li=parse(`<li data-novidade="dossie:${d.slug}"><time data-nonledger="data-editorial" data-data-origem="${ultima.origem}" datetime="${ultima.data}">${dataDaCasa(ultima.data)}</time><span>dossiê</span><a>Título</a></li>`).querySelector('li');
  const t=li.querySelector('time');assert(dataDoDossiePermitida(t,'home',lang));
  t.setAttribute('data-data-origem','origem-inventada');assert(!dataDoDossiePermitida(t,'home',lang));
  t.setAttribute('data-data-origem',ultima.origem);t.removeAttribute('data-nonledger');assert(!dataDoDossiePermitida(t,'home',lang));
  t.setAttribute('data-nonledger','data-editorial');const html=t.outerHTML;t.remove();li.insertAdjacentHTML('beforeend',html);assert(!dataDoDossiePermitida(li.querySelector('time'),'home',lang));
 }
 console.log('DO1-B: datas conferidas; origem, data e rota indevidas recusadas.');
}
