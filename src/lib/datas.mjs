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

/**
 * OS CAMPOS DE UMA LINHA QUE SÃO DATAS, DECLARADOS (bloco F1.4, 04.09.2026).
 *
 * A §1.91 fixou uma regra de data só, e a cabeça converteu; o corpo não. A
 * auditoria de 02.09.2026 mediu o que sobrou: 26 545 datas ISO à vista em 5 825
 * páginas, quase todas «Lido a 2026-08-12» ao pé de um campo do livro-razão.
 *
 * A CONVERSÃO NÃO PODE VIVER NA MARCA DO CAMPO, e a razão está escrita por
 * extenso em `src/components/DataDaLinha.astro`: `data-linha-campo` obriga a
 * uma comparação literal com o livro-razão, e uma data convertida nunca a
 * passaria. A saída é a outra marca, `data-nonledger="data-da-linha"`, que diz
 * de que linha e de que campo a data saiu e é reconferida por
 * `scripts/check-formas.mjs`, que vai buscar o campo à linha e recompõe a data
 * por conta própria. Esta lista é quem decide qual das duas marcas um campo
 * leva, e é DECLARADA e não adivinhada da forma do valor: uma regra que
 * convertesse tudo o que parece uma data converteria uma edição de documento
 * («2025-12») e um localizador que a fonte escreveu assim.
 *
 * As duas famílias com índice (`verifications.<n>.date`,
 * `document.computed_over.files.<n>.snapshot_date`) entram por forma porque o
 * índice é a posição da entrada na lista da própria linha.
 *
 * @param {unknown} campo
 * @returns {boolean}
 */
export function eCampoDeData(campo) {
  if (typeof campo !== 'string') return false;
  if (campo === 'access_date' || campo === 'reference_date' || campo === 'published_at') return true;
  if (campo === 'document.hosted.snapshot_date') return true;
  if (/^verifications\.\d+\.date$/.test(campo)) return true;
  return /^document\.computed_over\.files\.\d+\.snapshot_date$/.test(campo);
}
