import { edicoesGuardadas, primeiraEdicaoServida } from '../../../../../../lib/edicoes.mjs';
export function getStaticPaths() {
  return edicoesGuardadas().filter(e => e.lang === 'en').map(e => ({params: {slug: e.slug, date: e.date}}));
}
export function GET({params}) {
  return new Response(primeiraEdicaoServida(params.slug, 'en', params.date), {headers: {'Content-Type': 'text/html; charset=utf-8'}});
}
