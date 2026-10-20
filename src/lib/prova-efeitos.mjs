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
