/** H3: uma página tem um título; um redirecionamento B1 tem o destino certo. */
import { parse } from 'node-html-parser';
export function cabecaValida(html, relativo) {
  if ((html.match(/<h1[\s>]/g) ?? []).length === 1) return true;
  if (!/^(?:estudos\/[^/]+\/texto|en\/studies\/[^/]+\/text)\/index\.html$/.test(relativo)) return false;
  const destino = '/' + relativo.replace(/(?:texto|text)\/index\.html$/, '');
  const doc = parse(html);
  return doc.querySelectorAll('meta[http-equiv="refresh"]').length === 1 &&
    doc.querySelector('meta[http-equiv="refresh"]').getAttribute('content') === `0;url=${destino}` &&
    doc.querySelectorAll('body a[href]').length === 1 &&
    doc.querySelector('body a[href]').getAttribute('href') === destino;
}
