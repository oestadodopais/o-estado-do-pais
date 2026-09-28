/** As medidas dos concelhos, geradas do livro-razão em cada construção. */
import { csvIndicadoresDosConcelhos } from '../../lib/dados.mjs';

export function GET() {
  return new Response(csvIndicadoresDosConcelhos(), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
}
