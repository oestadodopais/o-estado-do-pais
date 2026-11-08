/** VOZ-1: apresentação reversível de uma ausência em documentos já publicados.
 * Os bytes alojados e os resumos não mudam. A prova só desfaz esta substituição
 * exata; qualquer outra palavra alterada continua a falhar a comparação.
 */
import {parse,NodeType} from 'node-html-parser';
/** @param {string} html @param {string} lang */
export function apresentarAusencias(html,lang='pt') {
 const frase=lang==='en'?'to be confirmed at the source':'por confirmar na fonte';
 const mudancas=/** @type {{inicio:number,fim:number,texto:string}[]} */([]);
 /** @param {any} n */
 function anda(n){
  if(n.nodeType===NodeType.TEXT_NODE){
   for(let p=n.parentNode;p;p=p.parentNode)if(['SCRIPT','STYLE','HEAD'].includes(p.tagName))return;
   const texto=String(n.rawText).replace(/\[(a verificar|verificar|to verify|verify)\]/g,(_,marca)=>`<span data-voz1-ausencia="${marca}">${frase}</span>`);
   if(texto!==n.rawText)mudancas.push({inicio:n.range[0],fim:n.range[1],texto});
  }else for(const f of n.childNodes??[])anda(f);
 }
 anda(parse(html));for(const m of mudancas.reverse())html=html.slice(0,m.inicio)+m.texto+html.slice(m.fim);return html;
}
/** @param {string} html */
export function retirarAusencias(html){
 return html.replace(/<span data-voz1-ausencia="(a verificar|verificar|to verify|verify)">(por confirmar na fonte|to be confirmed at the source)<\/span>/g,(_,marca)=>`[${marca}]`);
}
