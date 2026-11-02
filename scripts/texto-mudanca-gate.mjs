/** A mesma recomposição serve as mudanças do projeto e as correções dos estudos. */
export function textoDaMudancaGate(texto,claims,numerosSelados=false){
 if(typeof texto==='string')return numerosSelados&&/\d/.test(texto)?null:texto;
 if(!Array.isArray(texto))return null;let saida='';
 for(const p of texto){
  if(typeof p==='string'){if(numerosSelados&&/\d/.test(p))return null;saida+=p;continue;}
  if(p?.termo&&p.lingua==='pt-PT'){if(numerosSelados&&/\d/.test(p.termo))return null;saida+=p.termo;continue;}
  if(p?.data){const d=p.data,linha=claims.get(d.id);if(d.campo!=='reference_date'||!linha||linha.reference_date!==d.valor||!/^\d{4}$/.test(d.valor))return null;saida+=d.valor;continue;}
  const linha=p&&typeof p.claim==='string'?claims.get(p.claim):null;if(!linha)return null;
  const sufixo=typeof p.sufixo==='string'?p.sufixo:'';if(numerosSelados&&/\d/.test(sufixo))return null;saida+=String(linha.value)+sufixo;
 }
 return saida;
}
