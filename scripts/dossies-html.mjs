/** DO1-B: campos e datas de um assunto declarado, sem desligar a auditoria dos valores. */
import assert from 'node:assert/strict';
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
 const lista=el.closest('[data-dossie-lista]'), artigo=el.closest('[data-dossie]');
 const d=DOSSIES.find(d=>d.slug===(lista??artigo)?.getAttribute(lista?'data-dossie-lista':'data-dossie'));
 if(!d)return false;
 let data;
 if(lista) {
  const porta={entradaCasa:'habitacao',entradaEstado:'estado-e-economia'}[rota];
  if(!['dossies','temas'].includes(rota)&&!d.portas.includes(porta))return false;
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
 console.log('DO1-B: datas conferidas; origem, data e rota indevidas recusadas.');
}
