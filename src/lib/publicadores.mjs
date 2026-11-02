/** OG1-E C: registo fechado do publicador e do domínio do documento. */
import registo from '../../ledger/publicadores.json' with {type:'json'};
export const PUBLICADORES=registo.publicadores;
const nomes=new Map(PUBLICADORES.flatMap(p=>[p.nome,...p.aliases].map(n=>[n,p])));
/** @param {Linha} row */
export function errosDoPublicador(row) {
  if(!row.source_url && row.check)return [];
  if(!row.source && (!row.source_url||row.source_url==='[a verificar]'))return [];
  if(row.source==='[a verificar]'&&(!row.source_url||row.source_url==='[a verificar]'))return [];
  const p=nomes.get(typeof row.source==='string'?row.source:'');
  if(!p)return [`OG1-E publicador ${row.id}: nome fora do registo`];
  if(!row.source_url||row.source_url==='[a verificar]')return [];
  let dominio;try{dominio=new URL(String(row.source_url)).hostname;}catch{return [`OG1-E publicador ${row.id}: endereço inválido`];}
  if(!p.dominios.includes(dominio))return [`OG1-E publicador ${row.id}: domínio diferente do registo`];
  return [];
}
