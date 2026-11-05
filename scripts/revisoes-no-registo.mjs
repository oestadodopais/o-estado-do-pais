/** VOZ-1 E: cada revisão identifica a medida, o contexto e o período da sua linha. */
import {getClaim} from '../src/lib/ledger.mjs';
import {contextoDaRevisao} from '../src/lib/contexto-da-revisao.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {dataDaCasa} from '../src/lib/datas.mjs';
import {routePath} from '../src/lib/routes.mjs';
const normal=s=>s.replace(/\s+/gu,' ').trim();
export function conferirRevisoesNoRegisto(root,lang,dist='dist'){
 const erros=[],elementos=[];
 for(const el of root.querySelectorAll('[data-correcao-titulo]')){
  const id=el.getAttribute('data-correcao-titulo');
  try{
   const contexto=contextoDaRevisao(id),linha=getClaim(id);
   const recibo=parse(fs.readFileSync(path.join(dist,routePath('linha',lang,{slug:id}),'index.html'),'utf8'));
   const nome=normal(recibo.querySelector('main h1')?.textContent??'');
   const copiados=el.querySelectorAll('[data-correcao-nome]'),copiado=copiados[0];
   if(!nome||!linha.reference_date)throw Error('nome ou período ausente');
   if(copiados.length!==1||copiado.getAttribute('data-correcao-nome')!==id||copiado.getAttribute('data-de-linha')!==id||normal(copiado.textContent)!==nome)throw Error('título diferente do recibo');
   const periodo=dataDaCasa(linha.reference_date,lang);
   const esperado=`${nome}${contexto.uniao?(lang==='pt'?' na União Europeia':' in the European Union'):''}${nome.includes(periodo)?'':', '+periodo}`;
   if(normal(el.textContent)!==normal(esperado))throw Error('contexto ou período diferente do recibo e da linha');
   const item=el.closest('[data-correcao-entrada]');
   if(item?.getAttribute('data-correcao-entrada')!==id)throw Error('linha diferente');
   if(!item.querySelectorAll('a.src-chip').some(a=>a.getAttribute('href')===routePath('linha',lang,{slug:id})))throw Error('porta do recibo diferente');
   elementos.push(el);
  }catch(e){erros.push(`VOZ-1 E: revisão ${id} recusada: ${e.message}`);}
 }
 for(const lista of root.querySelectorAll('.registo-proveniencia-linhas')){
  const vistos=new Set();
  for(const el of lista.querySelectorAll('[data-correcao-titulo]')){
   const texto=normal(el.textContent);
   if(vistos.has(texto))erros.push(`VOZ-1 E: linha repetida na lista de revisões: ${texto}`);
   vistos.add(texto);
  }
 }
 return {erros,elementos};
}
