/** OG1-E C: só um título conferido contra WORKS sai da procura de frases retiradas. */
import {WORKS} from '../src/data/studies.mjs';
const titulos=new Map(['pt','en'].map(lang=>[lang,new Set(WORKS.flatMap(w=>w.editions.filter(e=>e.lang===lang).map(e=>e.title)))]));
const normal=s=>String(s).replace(/\s+/gu,' ').trim();
export function tituloPublicadoValido(el){return [...(titulos.get(el.getAttribute('data-titulo-publicado'))??[])].some(t=>normal(t)===normal(el.textContent));}
export function conferirTitulosPublicados(root){return root.querySelectorAll('[data-titulo-publicado]').filter(el=>!tituloPublicadoValido(el)).map(()=> 'OG1-E título marcado não corresponde a WORKS na língua declarada');}
export function retirarTitulosConferidos(root){for(const el of root.querySelectorAll('[data-titulo-publicado]'))if(tituloPublicadoValido(el))el.set_content('');return root;}

/** A mesma fronteira lexical usada na procura das formas retiradas da voz. */
export function fraseRetiradaNoTexto(texto,frase){
  const escaped=frase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,'iu').test(texto);
}
