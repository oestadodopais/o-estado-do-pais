/**
 * `/livro-razao/<id>.json` — uma linha do livro-razão, com todos os campos
 * publicados.
 *
 * Os caminhos saem do próprio livro-razão, como os das páginas de linha: não há
 * lista escrita à mão. Um ficheiro por linha, com o nome da linha, como o
 * recorte e o ficheiro alojado já fazem.
 *
 * Um só ficheiro para as duas edições: ver `src/pages/livro-razao.csv.js`.
 */
import { allClaims } from '../../lib/ledger.mjs';
import { jsonDaLinha } from '../../lib/conjunto.mjs';

export function getStaticPaths() {
  return allClaims().map((c) => ({ params: { slug: c.id } }));
}

export function GET({ params }) {
  return new Response(jsonDaLinha(params.slug), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
