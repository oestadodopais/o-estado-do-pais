import { WORKS } from '../../../../../data/studies.mjs';
import { edicoesGuardadas, primeiraEdicaoServida } from '../../../../../lib/edicoes.mjs';
export function getStaticPaths() {
  return edicoesGuardadas().filter(e => !WORKS.some(w => w.slug === e.slug && w.estado === 'retirado')).filter(e => e.lang === 'pt').map(e => ({params: {slug: e.slug, date: e.date}}));
}
export function GET({params}) {
  return new Response(primeiraEdicaoServida(params.slug, 'pt', params.date), {headers: {'Content-Type': 'text/html; charset=utf-8'}});
}
