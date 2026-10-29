/** DO1-A: só saem da contagem os nós cuja declaração foi conferida inteira. */
import { DOSSIES } from '../src/data/dossies.mjs';
import { ROTULOS_B1 } from '../src/data/rotulos-b1.mjs';
import { WORKS } from '../src/data/studies.mjs';
import { ITENS } from '../src/data/discussao.mjs';
import { EXPLICACOES } from '../src/data/explicacoes/index.mjs';
import { dataPublicacao } from '../src/lib/publicacao.mjs';
import { dataDaCasa } from '../src/lib/datas.mjs';
import { getClaim } from '../src/lib/ledger.mjs';
import { routePath } from '../src/lib/routes.mjs';
const normal = s => String(s ?? '').replace(/\s+/g,' ').trim();
const paginaDa = rota => rota.replace(/^\//,'').replace(/\/$/,'') + '/index.html';
export function dossieDaPagina(pagina,lang) {
 return DOSSIES.find(d => paginaDa(routePath('dossie',lang,{slug:d.slug})) === pagina);
}
export function conferirSuperficieDossies(root,lang,pagina) {
 const erros=[],nos=new Set(), main=root.rawTagName==='main'?root:root.querySelector('main');
 if(!main)return {erros,nos};
 for(const n of main.querySelectorAll('[data-dossie-campo]')) {
  const [slug,campo]=n.getAttribute('data-dossie-campo').split(':');
  const d=DOSSIES.find(d=>d.slug===slug), esperado=d?.[campo]?.[lang];
  const datas=n.querySelectorAll('[data-de-linha]');
  const algarismos=String(esperado??'').match(/\d+/g)??[];
  const selados=datas.length===algarismos.length && datas.every((el,i)=>el.getAttribute('data-de-linha')==='pm-q3-3-r37-c3' && el.getAttribute('data-de-campo')==='reference_date' && el.textContent===algarismos[i] && el.textContent===String(getClaim('pm-q3-3-r37-c3').reference_date));
  if(!['titulo','ambito'].includes(campo)||!Object.values(ROTULOS_B1[lang]).includes(esperado)||normal(n.textContent)!==esperado||!selados)erros.push('DO1: cadeia do dossiê diferente da declaração ou do token');
  else nos.add(n);
 }
 for(const lista of main.querySelectorAll('[data-dossie-lista]')) {
  const d=DOSSIES.find(d=>d.slug===lista.getAttribute('data-dossie-lista'));
  const datas=d?[...d.pecas.estudos.map(slug=>{const w=WORKS.find(w=>w.slug===slug);const e=w.editions.find(e=>e.lang===lang)??w.editions[0];return {data:dataPublicacao(w,e),origem:'publicacao.declarada'};}),...d.pecas.itens.map(slug=>({data:ITENS.find(e=>e.slug===slug).escrita,origem:'escrita.declarada'})),...d.pecas.explicacoes.map(slug=>({data:EXPLICACOES.find(e=>e.slug===slug).publicado,origem:'publicacao.declarada'}))].filter(e=>e.data).sort((a,b)=>b.data.localeCompare(a.data)):[];
  const tempos=lista.querySelectorAll('time'), recente=datas[0];
  if(tempos.length!==1||!recente||tempos[0].getAttribute('datetime')!==recente.data||tempos[0].getAttribute('data-data-origem')!==recente.origem||tempos[0].textContent!==dataDaCasa(recente.data))erros.push('DO1: data da lista diferente das publicações');
  else nos.add(tempos[0]);
 }
 const ligacoes=new Set(main.querySelectorAll('[data-dossie-ligacao], .dossie-ligacao'));
 for(const d of DOSSIES) {
  for(const [tipo,slugs]of Object.entries(d.pecas))for(const slug of slugs) {
   const item=tipo==='itens'?main.querySelector(`[data-discussao="${slug}"]`):null;
   const dono=item??(tipo!=='itens'&&main.querySelector(tipo==='estudos'?'.estudo-b1':'[data-explicacao]')&&pagina===paginaDa(routePath(tipo==='estudos'?'estudo':'explicacao',lang,{slug}))?main:null);
   if(!dono)continue;
   const links=dono.querySelectorAll('a').filter(a=>a.getAttribute('href')===routePath('dossie',lang,{slug:d.slug}));
   if(links.length!==1||links[0].closest('[data-dossie-ligacao]')?.getAttribute('data-dossie-ligacao')!==d.slug)erros.push('DO1: porta sem condição declarada, linha Dossiê sem pertença');
   for(const a of links)if(a.closest('[data-dossie-ligacao]'))ligacoes.add(a.closest('[data-dossie-ligacao]'));
  }
 }
 for(const n of ligacoes) {
  const d=DOSSIES.find(d=>d.slug===n.getAttribute('data-dossie-ligacao'));
  const a=n.querySelectorAll('a');
  const esperado=d?`${lang==='pt'?'Dossiê':'Dossier'}: ${d.titulo[lang]} →`:null;
  const item=n.closest('[data-discussao]')?.getAttribute('data-discussao');
  const pertence=d&&(item?d.pecas.itens.includes(item):['estudos','explicacoes'].some(tipo=>d.pecas[tipo].some(slug=>pagina===paginaDa(routePath(tipo==='estudos'?'estudo':'explicacao',lang,{slug})))));
  if(!pertence||!Object.values(ROTULOS_B1[lang]).includes(esperado)||normal(n.textContent)!==esperado||a.length!==1||a[0].getAttribute('href')!==routePath('dossie',lang,{slug:d.slug}))erros.push('DO1: porta sem condição declarada, linha Dossiê inválida');
  else nos.add(n);
 }
 return {erros,nos};
}
