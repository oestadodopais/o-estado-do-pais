/** Tipos documentais V2-e: nenhuma prosa ou período passa sem a prova selada. */
import fs from 'node:fs';
import {dataDaCasa} from './datas.mjs';
import path from 'node:path';
const file=path.join(process.cwd(),'ledger','provas','v2e','provas.json');
const proofs=JSON.parse(fs.readFileSync(file,'utf8')).rows;
/** @param {string} id */
export function temProvaDeEfeito(id){return Object.hasOwn(proofs,id);}
/** @param {string} id @param {string} texto @param {string} lang */
export function nomeDoEfeitoConferido(id,texto,lang){
 const p=proofs[id];
 let esperado=lang==='pt'?p?.label:lang==='en'?p?.label_en:null;
 if(id.startsWith('infarmed-')&&id.includes('-encargo')&&typeof esperado==='string'&&typeof p?.period==='string'&&(lang==='pt'||lang==='en'))esperado=esperado.replace(p.period,dataDaCasa(p.period,lang));
 return typeof esperado==='string'&&texto.replace(/\s+/g,' ').trim()===esperado.replace(/\s+/g,' ').trim();
}
/** Os três tokens do painel conservam a unidade impressa, exigida pelo mandato.
 * @param {string} id @param {string} texto */
export function valorImpressoDoPainelConferido(id,texto){
 const ids=['prr-monitorizacao-20261014-p2-c01-contratado','prr-monitorizacao-20261014-p2-c01-pago','prr-monitorizacao-20261014-p2-c01-taxa'];
 return ids.includes(id)&&typeof proofs[id]?.value==='string'&&texto===proofs[id].value;
}
/** @param {any} c @param {Record<string,any>} provas */
export function textoDocumentalConferido(c,provas=proofs){
 const p=provas[c.id],doc=c.document;
 const addresses=[p?.receipt?.pedido,p?.receipt?.endereco_final].filter(Boolean).flatMap(address=>{
  const u=new URL(address);if(p?.document?.page)u.hash=`page=${p.document.page}`;return [address,u.href];
 });
 return c.texto_documental===true&&c.unit==='texto'&&p?.unit==='texto'&&
  typeof c.value==='string'&&c.value.length>0&&c.value===p.value&&
  c.excerpt===p.excerpt&&c.excerpt.includes(c.value)&&
  doc?.source_sha256===p.document?.source_sha256&&doc?.title===p.document?.title&&
  doc?.locator===p.document?.locator&&
  addresses.includes(c.source_url)&&doc?.page===p.document?.page&&
  c.access_date===p.receipt?.acedido_em?.slice(0,10);
}
/** @param {any} c @param {Record<string,any>} provas */
export function acumuladoConferido(c,provas=proofs){
 const m=/^(\d{4})-01\/\1-(0[1-9]|1[0-2])$/.exec(String(c.period));
 return !!m&&c.reference_date===`${m[1]}-${m[2]}`&&provas[c.id]?.period===c.period;
}
/** Fragmentos auxiliares ligados ao recibo alojado, não uma licença para outros números.
 * @param {any} c @param {Record<string,any>} provas */
export function fragmentosAuxiliaresConferidos(c,provas=proofs){
 const p=provas[c.id];if(!p)return [];
 const fragments=[];
 for(const key of ['temporal_evidence','provisional_evidence']){
  const e=p[key];
  if(e&&typeof e.quote==='string'&&c.definition_sources?.some((/** @type {any} */ s)=>
   s.receipt?.motor===e.file&&s.receipt?.sha256===e.sha256&&
   String(s.receipt?.campo).split('; ').some((/** @type {string} */ v,/** @type {number} */ i,/** @type {string[]} */ a)=>i%2===0&&v===e.dataset&&a[i+1]===e.field))){
   fragments.push(e.quote.replace(/\s+/g,' '),e.dataset);
  }
 }
 return fragments;
}
/** O identificador numérico do documento vem do título selado.
 * @param {any} c */
export function tituloAuxiliarConferido(c){
 const p=proofs[c.id];
 return textoDocumentalConferido(c)&&p?.document?.title===c.document?.title?p.document.title:'';
}
/** Separa só as citações portuguesas reconhecidas nos corpos selados.
 * A concatenação conserva a ressalva inteira, incluindo as aspas.
 * @param {string} id @param {unknown} texto */
export function partesDaRessalvaConferida(id,texto){
 const p=proofs[id],s=String(texto??'');if(!p)return null;
 const normal=(/** @type {string} */ v)=>v.replace(/\s+/g,' ').trim();
 const quotes=[p.temporal_evidence?.quote,p.provisional_evidence?.quote].filter(Boolean).map(normal);
 const partes=[];let fim=0;
 for(const m of s.matchAll(/«([^»]+)»/gu)){
  if(m.index>fim)partes.push({texto:s.slice(fim,m.index),pt:false});
  const q=normal(m[1]);
  partes.push({texto:m[0],pt:quotes.includes(q)||(id==='dgo-atraso-45-p'&&normal(p.excerpt).includes(q))});
  fim=m.index+m[0].length;
 }
 if(fim<s.length)partes.push({texto:s.slice(fim),pt:false});
 if(partes.map(x=>x.texto).join('')!==s)throw new Error('A partição da ressalva alterou o texto.');
 return partes.some(x=>x.pt)?partes:null;
}
