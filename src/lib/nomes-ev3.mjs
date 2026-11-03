/** EV3: marcas reversíveis dos nomes portugueses, sem alterar o texto alojado. */
import {parse,NodeType} from 'node-html-parser';
export const NOMES_EV3=['Laboratório Floresta Nómada','Assembleia Municipal','Tribunal de Contas','Floresta Nómada','Câmara'];
const re=new RegExp(NOMES_EV3.join('|'),'g');
/** @param {string} html */
export function marcarNomesEv3(html){
 /** @type {{a:number,b:number,text:string}[]} */
 const changes=[];
 /** @param {any} node */
 function walk(node){
  if(node.nodeType===NodeType.TEXT_NODE){
   for(let p=node.parentNode;p;p=p.parentNode)if(['script','style','head','title'].includes(p.rawTagName?.toLowerCase())||p.getAttribute?.('lang')==='pt-PT')return;
   const text=String(node.rawText).replace(re,n=>`<span data-ev3-nome lang="pt-PT">${n}</span>`);
   if(text!==node.rawText)changes.push({a:node.range[0],b:node.range[1],text});return;
  }
  for(const child of node.childNodes??[])walk(child);
 }
 walk(parse(html));for(const c of changes.reverse())html=html.slice(0,c.a)+c.text+html.slice(c.b);return html;
}
/** Só remove a marca exata sobre um dos nomes declarados. @param {string} html */
export function retirarNomesEv3(html){
 return html.replace(/<span data-ev3-nome lang="pt-PT">([^<>]*)<\/span>/g,(whole,name)=>NOMES_EV3.includes(name)?name:whole);
}
