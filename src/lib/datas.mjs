/**
 * A ESCRITA DE UMA DATA NA SUPERFÍCIE · dd.mm.aaaa, e uma regra só.
 *
 * «As datas escrevem-se dd.mm.aaaa em todo o lado (uma regra só; a data ISO do
 * cabeçalho sai)», brief da forma dos domínios §4.
 *
 * O DADO NÃO MUDA, MUDA A ESCRITA. Os ficheiros de dados guardam as datas em
 * ISO, e é bem que continuem: é a forma que se ordena, que se compara e que os
 * portões reconta. O que esta função faz é a composição, no sítio onde a data
 * chega à página, e nada mais.
 *
 * NENHUM ALGARISMO NOVO: os quatro pedaços de saída são os quatro de entrada,
 * noutra ordem e com outro separador, e o elemento que a leva continua debaixo
 * do seu motivo declarado (`data-de-referencia`, `data-de-atualizacao`).
 *
 * O QUE NÃO É UMA DATA COMPLETA PASSA COMO ESTÁ, e é de propósito: um ano
 * («2024»), um mês («2025-12») ou um período escrito à mão não são desta regra,
 * e uma função que adivinhasse o que fazer com eles inventaria dias. A conversão
 * acontece só quando os três campos existem.
 *
 * @param {unknown} valor
 */
export function dataDaCasa(valor) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(valor ?? ''));
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(valor ?? '');
}
