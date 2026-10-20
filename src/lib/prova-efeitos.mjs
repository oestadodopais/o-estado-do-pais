/** Tipos documentais V2-e: nenhuma prosa ou período passa sem a prova selada. */
import fs from 'node:fs';
const file=new URL('../../ledger/provas/v2e/provas.json',import.meta.url);
const proofs=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')).rows:{};
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
