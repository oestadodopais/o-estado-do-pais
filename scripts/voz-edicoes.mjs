/** ED1-F: só as formas integrais da faixa admitem o fragmento retirado. */
import {fraseRetiradaNoTexto} from './titulos-publicados.mjs';
export const FAIXAS_DE_EDICAO = new Map([
 ['publicado a ·',new Set(['· publicado a · atualizado a','· · publicado a · atualizado a'])],
 ['published on ·',new Set(['· published on · updated on','· · published on · updated on'])],
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
 * @param {any} no
 * @param {(no:any)=>boolean} excluir */
export function textoDaVoz(no, excluir = () => false) {
  const partes = /** @type {{texto:string, lingua:boolean}[]} */ ([]);
  const textoLiteral = (/** @type {any} */ n) => {
    if (!n || excluir(n)) return '';
    if (n.nodeType === 3) return n.rawText;
    if (['script','style'].includes(String(n.rawTagName ?? '').toLowerCase())) return '';
    return (n.childNodes ?? []).map(textoLiteral).join('');
  };
  const anda = (/** @type {any} */ n) => {
    if (!n || excluir(n)) return;
    if (n.nodeType === 3) return void partes.push({texto:n.rawText,lingua:false});
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    // A marca de língua é inline: conserva os espaços escritos nos nós vizinhos.
    if (['span','em','i','strong','b','abbr','a'].includes(tag) && n.hasAttribute('lang')) {
      partes.push({texto:textoLiteral(n),lingua:true});return;
    }
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(no);
  return partes.map((p,i)=>(i && !p.lingua && !partes[i-1].lingua ? ' ' : '')+p.texto).join('');
}
