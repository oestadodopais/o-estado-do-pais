/** DO1-B: campos e datas de um assunto declarado, sem desligar a auditoria dos valores. */
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { DOSSIES } from '../src/data/dossies.mjs';
import { dossieResolvido } from '../src/lib/dossies-conteudo.mjs';
import { WORKS } from '../src/data/studies.mjs';
import { ITENS } from '../src/data/discussao.mjs';
import { EXPLICACOES } from '../src/data/explicacoes/index.mjs';
import { dataPublicacao } from '../src/lib/publicacao.mjs';
import { dataDaCasa } from '../src/lib/datas.mjs';
const linhasPorDossie=new Map();
function linhas(d,lang) {
 const chave=`${d.slug}:${lang}`;
 if(!linhasPorDossie.has(chave))linhasPorDossie.set(chave,new Set(dossieResolvido(d.slug,lang).linhas));
 return linhasPorDossie.get(chave);
}
export function campoDeDossieAdmitido(rota,el,id,campo,lang) {
 if(rota?.key!=='dossie')return false;
 const d=DOSSIES.find(d=>d.slug===rota.params?.slug&&d.slug===el.closest('[data-dossie]')?.getAttribute('data-dossie'));
 if(!d)return false;
 if(campo==='excerpt')return d.calendario.includes(id)&&el.closest('[data-dossie-calendario]')?.getAttribute('data-dossie-calendario')===id;
 return ['unit','name','document.title'].includes(campo)&&el.closest('[data-correcao-entrada]')?.getAttribute('data-correcao-entrada')===id&&linhas(d,lang).has(id);
}
function recente(d,lang) {
 return [...d.pecas.estudos.map(slug=>{const w=WORKS.find(w=>w.slug===slug);return dataPublicacao(w,w.editions.find(e=>e.lang===lang)??w.editions[0]);}),...d.pecas.itens.map(slug=>ITENS.find(e=>e.slug===slug).publicado),...d.pecas.explicacoes.map(slug=>EXPLICACOES.find(e=>e.slug===slug).publicado)].filter(Boolean).sort().at(-1);
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
  if(origem!=='publicacao.declarada')return false;
  data=recente(d,lang);
 } else {
  if(rota!=='dossie')return false;
  const item=el.closest('[data-discussao-integracao]')?.getAttribute('data-discussao-integracao');
  const explicacao=el.closest('[data-dossie-explicacao]')?.getAttribute('data-dossie-explicacao');
  if(item&&d.pecas.itens.includes(item)&&origem==='escrita.declarada')data=ITENS.find(e=>e.slug===item).escrita;
  else if(explicacao&&d.pecas.explicacoes.includes(explicacao)&&origem==='publicacao.declarada')data=EXPLICACOES.find(e=>e.slug===explicacao).publicado;
  else if(el.getAttribute('data-dossie-data')==='escrita'&&origem==='escrita.declarada')data=d.escrita;
  else if(el.getAttribute('data-dossie-data')==='recente'&&origem==='publicacao.declarada')data=recente(d,lang);
 }
 return Boolean(data&&el.getAttribute('datetime')===data&&el.text.trim()===dataDaCasa(data));
}
export function plantasDossiesHtml() {
 const d=DOSSIES[0], id=d.calendario[0];
 const campo=parse(`<article data-dossie="${d.slug}"><p data-dossie-calendario="${id}"><span data-linha-claim="${id}" data-linha-campo="excerpt">calendário</span></p></article>`).querySelector('span');
 assert(campoDeDossieAdmitido({key:'dossie',params:{slug:d.slug}},campo,id,'excerpt','pt'));
 for(const key of ['home','temas','explicacao','correcoes'])assert(!campoDeDossieAdmitido({key,params:{slug:d.slug}},campo,id,'excerpt','pt'));
 assert(!campoDeDossieAdmitido({key:'dossie',params:{slug:d.slug}},campo,id,'value','pt'));
 const data=parse(`<article data-dossie="${d.slug}"><time data-dossie-data="escrita" data-data-origem="escrita.declarada" datetime="${d.escrita}">${dataDaCasa(d.escrita)}</time></article>`).querySelector('time');
 assert(dataDoDossiePermitida(data,'dossie'));
 data.setAttribute('data-data-origem','origem-inventada');assert(!dataDoDossiePermitida(data,'dossie'));
 data.setAttribute('data-data-origem','escrita.declarada');assert(!dataDoDossiePermitida(data,'home'));
 data.setAttribute('datetime','1900-01-01');assert(!dataDoDossiePermitida(data,'dossie'));
 const correcao=parse(`<article data-dossie="${d.slug}"><li data-correcao-entrada="divida-publica-2024"><span></span></li></article>`).querySelector('span');
 assert(campoDeDossieAdmitido({key:'dossie',params:{slug:d.slug}},correcao,'divida-publica-2024','unit','pt'));
 assert(!campoDeDossieAdmitido({key:'home'},correcao,'divida-publica-2024','unit','pt'));
 console.log('DO1-B: datas e campos conferidos; origem, data, campo e rota indevidos recusados.');
}
