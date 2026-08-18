/**
 * `/livro-razao.csv` — o livro-razão inteiro, uma linha por registo.
 *
 * Gerado na construção a partir de `ledger/claims/*.yml`. Ver
 * `src/lib/conjunto.mjs` para a forma das colunas, e `src/data/licenca.mjs`
 * para porque é que nenhuma página o liga enquanto a licença não for decidida.
 *
 * As duas edições servem-se do MESMO ficheiro: isto são dados, não prosa, e um
 * segundo ficheiro em inglês seria a mesma tabela com o mesmo conteúdo e um
 * endereço a mais para ficar fora de passo.
 */
import { csvDoConjunto } from '../lib/conjunto.mjs';

export function GET() {
  return new Response(csvDoConjunto(), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
}
