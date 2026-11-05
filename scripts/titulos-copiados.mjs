/** VOZ-1 B: um título copiado só é transcrição depois de conferido no destino. */
import fs from 'node:fs';import path from 'node:path';import {parse} from 'node-html-parser';
import {matchPath} from '../src/lib/routes.mjs';
import {conferirRevisoesNoRegisto} from './revisoes-no-registo.mjs';
const normal=s=>s.replace(/\s+/gu,' ').trim();
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
   if(!titulo||normal(el.textContent)!==normal(titulo.textContent))throw Error('título diferente do destino');
   if(el.getAttribute('href')!==destino||matchPath(destino)?.lang!==lang)throw Error('porta ou edição diferente');
   elementos.push(el);
  }catch(e){erros.push(`VOZ-1 B: título copiado recusado: ${e.message}`);}
 }
 return {erros,elementos};
}
