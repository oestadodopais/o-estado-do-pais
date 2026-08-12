/**
 * `/estudos/<slug>/documento` — o estudo original, alojado tal como foi publicado.
 *
 * Não é uma página deste sítio: é um documento de outrem — de nós próprios,
 * noutro dia — servido intacto, com uma faixa nossa por cima e mais nada. Por
 * isso é um endpoint e não um gabarito: o que sai daqui é o ficheiro, byte a
 * byte, sem o Astro lhe tocar. Ver src/lib/documentos.mjs.
 */
import { todosOsDocumentos, documentoServido } from '../../../../lib/documentos.mjs';

export function getStaticPaths() {
  return todosOsDocumentos()
    .filter((d) => d.lang === 'pt')
    .map((d) => ({ params: { slug: d.slug } }));
}

export function GET({ params }) {
  return new Response(documentoServido(params.slug, 'pt'), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
