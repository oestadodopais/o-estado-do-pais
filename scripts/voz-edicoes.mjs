/** ED1-F: só as formas integrais da faixa admitem o fragmento retirado. */
import {fraseRetiradaNoTexto} from './titulos-publicados.mjs';
// ED2: só estas formas integrais admitem os fragmentos antigos; as plantas conservam a recusa isolada.
const FAIXAS_PT = ['Edições: (primeira) · (correção, atual) · publicado a · corrigido a', 'Edições: (primeira) · (atualização) · (correção, atual) · publicado a · atualizado a · corrigido a'];
const FAIXAS_EN = ['Editions: (first) · (correction, current) · published on · corrected on', 'Editions: (first) · (update) · (correction, current) · published on · updated on · corrected on'];
export const FAIXAS_DE_EDICAO = new Map([
 ['publicado a ·',new Set(FAIXAS_PT)],
 ['published on ·',new Set(FAIXAS_EN)],
 ['· publicado a · atualizado a',new Set([FAIXAS_PT[1]])],
 ['· published on · updated on',new Set([FAIXAS_EN[1]])],
 ['Edições',new Set(['Edições:',...FAIXAS_PT])],
 ['Editions',new Set(['Editions:',...FAIXAS_EN])],
]);
/** @param {string} texto @param {string} frase @param {Set<string>} admitidas */
export function retiradaForaDaFrase(texto,frase,admitidas=new Set()) {
 return fraseRetiradaNoTexto(texto,frase)&&!admitidas.has(texto);
}
/** A obra citada fica fora da voz; o aviso editorial e as suas portas entram.
 * Não se removem datas nem palavras do aviso, que o portão documental confere.
 * @param {any} root */
export function frasesDaFaixaDocumental(root) {
 const frases=[];
 for(const faixa of root.querySelectorAll('[data-documento-edicao]')) {
  for(const el of faixa.querySelectorAll('p,h1,h2,h3,li,a,[data-voz]')) {
   if(el.querySelector('p,h1,h2,h3,li'))continue;
   const frase=el.textContent.replace(/\s+/g,' ').trim();
   if(frase)frases.push(frase);
  }
 }
 return [...new Set(frases)];
}

/** A extração comum da voz conserva os nós de selos e as marcas de língua.
 * @param {any} no */
export function textoDaVoz(no) {
  const partes = /** @type {string[]} */ ([]);
  const anda = (/** @type {any} */ n) => {
    if (!n) return;
    if (n.nodeType === 3) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(no);
  return partes.join(' ');
}
