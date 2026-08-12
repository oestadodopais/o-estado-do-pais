/**
 * `/dados/municipios-308.csv` — as posições dos municípios, tal como o mapa as usa.
 *
 * Gerado no build a partir de src/data/caop-centroids.mjs, com a citação da
 * CAOP e a data de acesso no cabeçalho. Ver src/lib/dados.mjs.
 */
import { csvMunicipios } from '../../lib/dados.mjs';

export function GET() {
  return new Response(csvMunicipios(), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
}
