/**
 * `/dados/convergencia.csv` — os dados por trás da régua da convergência.
 *
 * Gerado no build a partir do livro-razão. Ver src/lib/dados.mjs.
 */
import { csvConvergencia } from '../../lib/dados.mjs';

export function GET() {
  return new Response(csvConvergencia(), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
}
