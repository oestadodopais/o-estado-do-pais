/**
 * ===========================================================================
 * O TEMA DE CADA MEDIDA DE UM CONCELHO (B1, peça 2)
 * ===========================================================================
 *
 * PORQUE EXISTE. A página de um lugar arruma os números por tema, e o tema é um
 * dos dezoito da carta dos conteúdos (`src/data/dominios.mjs`). As medidas de um
 * concelho não diziam a que tema pertencem: o cartão de cada uma sabia o nome, a
 * unidade, o período e a nota, e mais nada. A maqueta da peça 2 escreveu a
 * tabela à mão, em Python, e esta é a mesma tabela no sítio, declarada uma vez.
 *
 * AS CHAVES SÃO AS DE `MEDIDAS_DO_CONCELHO` E AS DO FICHEIRO DO MOTOR. As oito
 * chaves de `linhas` em `src/data/concelhos.gerado.json` (`populacao`,
 * `poderDeCompra`, `desempregoRegistado`, `empresas`, `divida`, `indice`,
 * `limite`, `pmp`) mais a medida que não vem naquele mapa e se resolve do
 * livro-razão pelo código do INE (`ganho`). `limite` não tem cartão próprio — é
 * a linha do limite de dívida, que entra na unidade do índice —, e tem tema
 * porque o portão confere a tabela contra as chaves do ficheiro do motor e uma
 * chave sem tema é um buraco à espera do dia em que ela ganhar cartão.
 *
 * ONDE CADA UMA CAI, E PORQUÊ. As três que medem dinheiro público (a dívida, o
 * limite e o índice que os compara), a que mede o prazo de pagamento da câmara,
 * o poder de compra e as empresas são todas do primeiro tema da carta, «Economia
 * e finanças públicas». O desemprego registado e o ganho médio mensal são
 * «Trabalho», que a carta declara dentro do primeiro. A população residente é
 * «População».
 *
 * O PORTÃO. `scripts/check-lugares.mjs` falha se uma medida rendida numa página
 * de concelho ficar sem tema, se uma chave do ficheiro do motor não estiver
 * aqui, ou se um tema declarado aqui não for um dos dezoito.
 */

/** @type {Record<string, string>} */
export const TEMA_DA_MEDIDA_DE_CONCELHO = {
  populacao: 'populacao',
  poderDeCompra: 'economia-e-financas-publicas',
  desempregoRegistado: 'trabalho',
  empresas: 'economia-e-financas-publicas',
  divida: 'economia-e-financas-publicas',
  limite: 'economia-e-financas-publicas',
  indice: 'economia-e-financas-publicas',
  pmp: 'economia-e-financas-publicas',
  ganho: 'trabalho',
};

/**
 * A ORDEM DOS TEMAS NUMA PÁGINA DE LUGAR.
 *
 * A ordem das medidas dentro de um tema é a da Emenda 14, que
 * `pecasDoConcelho()` fixa e não se reordena aqui. A ordem dos temas entre si é
 * a da carta dos conteúdos, pelo número do domínio, e sai de `DOMINIOS`: uma
 * segunda lista escrita aqui divergia dela no dia em que um tema novo entrasse.
 */

/**
 * O tema de uma medida, pela chave dela.
 *
 * @param {string} chave
 * @returns {string|null}
 */
export function temaDaMedida(chave) {
  return TEMA_DA_MEDIDA_DE_CONCELHO[chave] ?? null;
}
