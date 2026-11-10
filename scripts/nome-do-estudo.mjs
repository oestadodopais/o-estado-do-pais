import {parse} from 'node-html-parser';
/** O nome é uma transcrição: o H1 ou a linha inteira em itálico logo abaixo. */
export function nomeDoEstudoNoDocumento(html, nome) {
  const root = parse(html), titulos = root.querySelectorAll('h1');
  if (titulos.length !== 1) return false;
  const h = titulos[0], p = h.nextElementSibling;
  if (h.textContent.trim() === nome) return true;
  return p?.tagName === 'P' && p.children.length === 1 &&
    ['EM','I'].includes(p.children[0].tagName) &&
    p.textContent.trim() === p.children[0].textContent.trim() && p.textContent.trim() === nome;
}
