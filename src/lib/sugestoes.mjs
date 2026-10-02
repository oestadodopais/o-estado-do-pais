/**
 * A CAIXA DAS SUGESTÕES · os caminhos (bloco S1, 02.10.2026)
 *
 * As páginas do resultado vivem debaixo da página do formulário, e o último
 * segmento de cada uma é o que a tabela das rotas diz (`src/lib/routes.mjs`):
 * as páginas (`src/pages/sugestoes/[resultado].astro` e a gémea inglesa) pedem
 * os segmentos a esta função, e a função `api/sugestoes.js` manda o leitor para
 * os mesmos caminhos pela mesma tabela. Uma rota do resultado que saia de debaixo
 * do formulário fecha a construção aqui, em vez de construir uma página noutro
 * endereço que a função não conhece.
 */
import { routePath } from './routes.mjs';
import { ROTAS_DO_RESULTADO } from '../data/sugestoes.mjs';

/**
 * O segmento de cada página do resultado numa edição, com o nome do resultado.
 * @param {Lingua} lang
 * @returns {{ segmento: string, resultado: keyof typeof ROTAS_DO_RESULTADO }[]}
 */
export function segmentosDoResultado(lang) {
  const base = `${routePath('sugestoes', lang)}/`;
  return /** @type {[keyof typeof ROTAS_DO_RESULTADO, ChaveDeRota][]} */ (Object.entries(ROTAS_DO_RESULTADO)).map(
    ([resultado, chave]) => {
      const caminho = routePath(chave, lang);
      const segmento = caminho.slice(base.length);
      if (!caminho.startsWith(base) || segmento === '' || segmento.includes('/')) {
        throw new Error(
          `sugestoes: a rota "${chave}" (${caminho}) tem de ser um segmento debaixo de ${base}, ` +
            'porque é aí que as páginas do resultado se constroem',
        );
      }
      return { segmento, resultado };
    },
  );
}
