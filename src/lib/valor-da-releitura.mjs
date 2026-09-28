/** Apresenta o valor relido sem mudar algarismos nem precisão.
 * @param {unknown} valor @param {string} lang */
export function valorDaReleitura(valor, lang) {
  const original = String(valor ?? '');
  const limpo = original.replace(/[\s\u202f]/g, '').replace('−', '-');
  if (!/^-?\d+(?:[.,]\d+)?$/.test(limpo)) return original;
  const [inteiro, decimais] = limpo.replace(',', '.').split('.');
  const agrupado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0').replace('-', '−');
  return agrupado + (decimais === undefined ? '' : ',' + decimais);
}
