/**
 * O FORMATO DOS NÚMEROS DA CASA, para os números que o sítio escreve sobre si próprio (bloco K2, 02.10.2026, item 5
 * do brief).
 *
 * Os valores do livro-razão rendem-se como a linha os escreve (o `Claim` só troca o espaço fino dos milhares pelo
 * espaço inquebrável que a letra desenha). As contagens da prova são números que o próprio sítio conta e escreve, e
 * saíam sem separador de milhares («3009 afirmações», «2884 linhas atravessadas»), ao lado dos valores agrupados. Esta
 * função escreve uma contagem inteira de quatro algarismos ou mais agrupada de três em três, com U+00A0, que é o
 * separador que a página escreve em todos os valores; não toca em mais nada (uma data, um texto, um número com
 * vírgula). O portão de HTML tem a sua própria cópia da regra e compara carácter a carácter, e a célula
 * `tests/inicio/formato-dos-numeros.mjs` (F1) confere o resultado em todas as páginas.
 *
 * @param {unknown} valor
 * @returns {string}
 */
export function milharesDaCasa(valor) {
  const s = String(valor ?? '');
  return /^\d{4,}$/.test(s) ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') : s;
}
