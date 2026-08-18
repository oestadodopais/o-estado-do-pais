/**
 * `/livro-razao.json` — o livro-razão inteiro, com a estrutura que o CSV achata.
 *
 * Gerado na construção a partir de `ledger/claims/*.yml`. Ver
 * `src/lib/conjunto.mjs`.
 */
import { jsonDoConjunto } from '../lib/conjunto.mjs';

export function GET() {
  return new Response(jsonDoConjunto(), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
