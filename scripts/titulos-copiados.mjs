/** VOZ-1 B: um título copiado só é transcrição depois de conferido no destino. */
import fs from 'node:fs';import path from 'node:path';import {parse} from 'node-html-parser';
import {matchPath} from '../src/lib/routes.mjs';
import {conferirRevisoesNoRegisto} from './revisoes-no-registo.mjs';
const normal=s=>s.replace(/\s+/gu,' ').trim();
export function titulosCopiadosDaPagina(root, rota) {
 const h=root.querySelector('main h1')??root.querySelector('h1');
 if(!h)return [];
 // Os selos são portas para as fontes, não palavras da manchete.
 const copia=parse(h.outerHTML);
 for(const selo of copia.querySelectorAll('.src-chip'))selo.remove();
 const titulos=[normal(copia.textContent)];
 if(matchPath(rota)?.key==='estudo'){
  // A moldura construída separa o H1 do corpo para intercalar o índice.
  const p=h.nextElementSibling??(h.parentNode.classList.contains('estudo-b1-titulo')
   ? root.querySelector('main .estudo-texto')?.children[0] : null);
  if(p?.tagName==='P'&&p.children.length===1&&['EM','I'].includes(p.children[0].tagName)&&
   normal(p.textContent)===normal(p.children[0].textContent))titulos.push(normal(p.textContent));
 }
 return titulos.filter(Boolean);
}
export function tituloCopiadoDaPagina(root, rota) {
 return titulosCopiadosDaPagina(root,rota).at(-1)??'';
}
export function tituloCopiadoConfere(root,rota,titulo){
 return titulosCopiadosDaPagina(root,rota).includes(normal(titulo));
}
export function conferirTitulosCopiados(root,rota,dist='dist'){
 const erros=[],elementos=[];const lang=rota?.lang??'pt';
 if(root.querySelector('[data-correcao-titulo]')){
  if(rota?.key!=='correcoes')erros.push('VOZ-1 E: revisão fora do registo');
  else {const revisoes=conferirRevisoesNoRegisto(root,lang,dist);erros.push(...revisoes.erros);elementos.push(...revisoes.elementos.map(el=>el.querySelector('[data-correcao-nome]')));}
 }
 for(const el of root.querySelectorAll('[data-calendario-pagina]')){
  const destino=el.getAttribute('data-calendario-pagina');
  if(rota?.key!=='agenda'){erros.push('VOZ-1 B: título copiado fora da rota');continue;}
  try{
   if(!destino?.startsWith('/')||destino.includes('..'))throw Error('destino inválido');
   const alvo=parse(fs.readFileSync(path.join(dist,destino,'index.html'),'utf8'));const titulo=alvo.querySelector('h1');
   if(!titulo||!tituloCopiadoConfere(alvo,destino,el.textContent))throw Error('título diferente do destino');
   if(el.getAttribute('href')!==destino||matchPath(destino)?.lang!==lang)throw Error('porta ou edição diferente');
   elementos.push(el);
  }catch(e){erros.push(`VOZ-1 B: título copiado recusado: ${e.message}`);}
 }
 return {erros,elementos};
}
