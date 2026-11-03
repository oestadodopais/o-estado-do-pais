/** OG1-E C: só um título conferido contra WORKS sai da procura de frases retiradas. */
import {WORKS} from '../src/data/studies.mjs';
const titulos=new Map(['pt','en'].map(lang=>[lang,new Set(WORKS.flatMap(w=>w.editions.filter(e=>e.lang===lang).map(e=>e.title)))]));
const normal=s=>String(s).replace(/\s+/gu,' ').trim();
export function tituloPublicadoValido(el){return [...(titulos.get(el.getAttribute('data-titulo-publicado'))??[])].some(t=>normal(t)===normal(el.textContent));}
export function conferirTitulosPublicados(root){return root.querySelectorAll('[data-titulo-publicado]').filter(el=>!tituloPublicadoValido(el)).map(()=> 'OG1-E título marcado não corresponde a WORKS na língua declarada');}
export function retirarTitulosConferidos(root){for(const el of root.querySelectorAll('[data-titulo-publicado]'))if(tituloPublicadoValido(el))el.set_content('');return root;}

/** A normalização acrescenta formas à retirada; a comparação original mantém-se. */
export function normalizaEspacosDaRetirada(texto){
 return texto.replace(/([«“])\s+/gu,'$1').replace(/\s+([»”])/gu,'$1').replace(/\s+/gu,' ').trim();
}
const padroesRetirados=new Map();
const textosNormalizados=new Map();
export function fraseRetiradaNoTexto(texto,frase){
 const padrao=f=>{
  if(!padroesRetirados.has(f)){
   const escaped=f.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   padroesRetirados.set(f,new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,'iu'));
  }
  return padroesRetirados.get(f);
 };
 if(padrao(frase).test(texto))return true;
 if(!textosNormalizados.has(texto))textosNormalizados.set(texto,normalizaEspacosDaRetirada(texto));
 return padrao(normalizaEspacosDaRetirada(frase)).test(textosNormalizados.get(texto));
}
