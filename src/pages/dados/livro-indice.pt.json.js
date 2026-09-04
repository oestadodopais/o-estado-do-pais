/**
 * `/dados/livro-indice.pt.json` — o índice da busca do livro-razão, edição
 * portuguesa.
 *
 * Gerado na construção a partir de `ledger/claims/*.yml`. Ver
 * `src/lib/indice-da-busca.mjs` para o que ele guarda e porquê.
 */
import { jsonDoIndiceDaBusca } from '../../lib/indice-da-busca.mjs';

export function GET() {
  return new Response(jsonDoIndiceDaBusca('pt'), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
