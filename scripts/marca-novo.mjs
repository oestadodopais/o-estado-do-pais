/** FP1: a marca é condicional, mas a janela de publicação é exata. */
import {listagensDoInicio} from '../src/lib/listagens-do-inicio.mjs';
export function conferirMarcasNovo(root,dia){
 const erros=[];
 for(const estudo of root.querySelectorAll('#trabalhos [data-estudo]')){
  const data=estudo.querySelector('.estudo-meta time')?.getAttribute('datetime');
  const dias=(Date.parse(dia)-Date.parse(data??''))/86400000;
  if(estudo.querySelectorAll('[data-estudo-novo]').length!==Number(dias>=0&&dias<=7))erros.push('FP1: marca novo diferente da data impressa');
 }
 return erros;
}
export function exigeRotuloNovo(lang,dia){
 return listagensDoInicio(lang).estudos.filter(e=>e.tipo==='estudo').some(e=>{
  const dias=(Date.parse(dia)-Date.parse(e.peca.data??''))/86400000;
  return dias>=0&&dias<=7;
 });
}
