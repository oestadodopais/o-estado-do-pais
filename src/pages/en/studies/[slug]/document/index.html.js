import { WORKS } from '../../../../../data/studies.mjs';
import {documentoDaHistoriaServido} from '../../../../../lib/edicoes.mjs';
/**
 * `/en/studies/<slug>/document` — a edição inglesa do documento original.
 * Espelho exacto da rota portuguesa. Ver src/lib/documentos.mjs.
 */
import { todosOsDocumentos, documentoServido } from '../../../../../lib/documentos.mjs';

export function getStaticPaths() {
  return todosOsDocumentos()
    .filter(d => !WORKS.some(w => w.slug === d.slug && w.estado === 'retirado'))
    .filter((d) => d.lang === 'en')
    .map((d) => ({ params: { slug: d.slug } }));
}

export function GET({ params }) {
  return new Response(documentoDaHistoriaServido(params.slug, 'en'), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
