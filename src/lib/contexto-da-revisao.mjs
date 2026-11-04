/** A linha revista conserva o nome da medida e identifica a comparação. */
import {ENTRADAS} from '../data/primeira-pagina.mjs';
import {reguaDoCartao} from './enquadramento.mjs';
/** @type {Map<string,{medida:string,uniao:boolean}>|undefined} */
let contextos;
/** @param {string} id */
export function contextoDaRevisao(id){
 if(!contextos){
  contextos=new Map();
  const ids=ENTRADAS.flatMap(e=>e.seccoes.flatMap(s=>s.cartoes));
  for(const medida of ids)contextos.set(medida,{medida,uniao:false});
  for(const medida of ids){
   const r=reguaDoCartao(medida);
   for(const [chave,linha] of [['anterior',r.anterior],['ue',r.ue]]){
    const c=/** @type {{id:string}|null} */(linha);
    if(c&&!contextos.has(c.id))contextos.set(c.id,{medida,uniao:chave==='ue'});
   }
  }
 }
 return contextos.get(id)??{medida:id,uniao:false};
}
