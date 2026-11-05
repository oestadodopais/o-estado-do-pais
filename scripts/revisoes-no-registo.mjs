/** VOZ-1 E: cada revisão identifica a medida, o contexto e o período da sua linha. */
import {getClaim} from '../src/lib/ledger.mjs';
import {contextoDaRevisao} from '../src/lib/contexto-da-revisao.mjs';
import {nomeDoCartao,nomeDoCartaoComAUnidade} from '../src/lib/nomes.mjs';
import {unidadeDoCartao} from '../src/data/unidades-dos-cartoes.mjs';
import {dataDaCasa} from '../src/lib/datas.mjs';
import {routePath} from '../src/lib/routes.mjs';
const normal=s=>s.replace(/\s+/gu,' ').trim();
export function conferirRevisoesNoRegisto(root,lang){
 const erros=[],elementos=[];
 for(const el of root.querySelectorAll('[data-correcao-titulo]')){
  const id=el.getAttribute('data-correcao-titulo');
  try{
   const contexto=contextoDaRevisao(id),linha=getClaim(id),medida=getClaim(contexto.medida);
   const nome=(unidadeDoCartao(medida.id,lang)?nomeDoCartaoComAUnidade(medida,lang):nomeDoCartao(medida,lang))?.texto;
   if(!nome||!linha.reference_date)throw Error('nome ou período ausente');
   const esperado=`${nome}${contexto.uniao?(lang==='pt'?' na União Europeia':' in the European Union'):''}, ${dataDaCasa(linha.reference_date,lang)}`;
   if(normal(el.textContent)!==normal(esperado))throw Error('nome, contexto ou período diferente da linha');
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

/** Só os campos do nome da medida, dentro da revisão identificada. */
export function campoDoNomeDaRevisao(rota,el){
 const titulo=el.closest('[data-correcao-titulo]'),id=titulo?.getAttribute('data-correcao-titulo');
 return rota==='correcoes'&&!!id&&['name','document.title'].includes(el.getAttribute('data-linha-campo'))&&
  titulo.closest('[data-correcao-entrada]')?.getAttribute('data-correcao-entrada')===id&&
  el.getAttribute('data-linha-claim')===contextoDaRevisao(id).medida;
}
