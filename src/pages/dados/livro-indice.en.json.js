/**
 * `/dados/livro-indice.en.json` — o índice da busca do livro-razão, edição
 * inglesa.
 *
 * Gerado na construção a partir de `ledger/claims/*.yml`. Ver
 * `src/lib/indice-da-busca.mjs` para o que ele guarda e porquê.
 */
import { jsonDoIndiceDaBusca } from '../../lib/indice-da-busca.mjs';

export function GET() {
  return new Response(jsonDoIndiceDaBusca('en'), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
