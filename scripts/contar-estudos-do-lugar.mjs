import {matchPath, routePath} from '../src/lib/routes.mjs';

/** Conta as portas rendidas; um lugar sem estudos pode omitir a secção. */
export function contarEstudosDoLugar(doc, rota, lang, lugar, trabalhos) {
  const esperados = trabalhos.filter(w => w.subject === lugar && w.estado !== 'retirado');
  const tit = doc.querySelector('#trabalhos');
  const recusar = mensagem => { throw new Error(`B1 contagem do lugar: ${rota} ${mensagem}`); };
  if (!tit && esperados.length) recusar('não tem a secção #trabalhos.');
  const portas = (tit?.tagName === 'SECTION' ? tit : tit?.parentNode ?? doc)
    .querySelectorAll('a[href]').filter(a => matchPath(a.getAttribute('href'))?.key === 'estudo');
  if (portas.some(a => matchPath(a.getAttribute('href')).lang !== lang))
    recusar('contém uma porta de estudo noutra língua.');
  const vistas = new Set(portas.map(a => a.getAttribute('href').replace(/\/$/, '')));
  const destinos = new Set(esperados.map(w => routePath('estudo', lang, {slug:w.slug}).replace(/\/$/, '')));
  if (vistas.size !== destinos.size || [...destinos].some(p => !vistas.has(p)))
    recusar('não mostra exatamente os estudos publicados do lugar.');
  return vistas.size;
}
