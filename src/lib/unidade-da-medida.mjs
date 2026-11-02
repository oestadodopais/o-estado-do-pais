/** SEL1: uma só lista, com a correspondência mais longa primeiro. */
export const UNIDADES_DA_MEDIDA = Object.freeze([
  'mil milhões de euros', 'milhões de euros', 'mil euros', '% do PIB',
  'pontos percentuais', 'mil milhões', 'milhões', 'euros', '%', 'p.p.', 'pontos', 'dias',
  'billion euros', 'million euros', 'thousand euros', '% of GDP',
  'percentage points', 'billion', 'million', 'points', 'days',
].sort((a, b) => b.length - a.length));

/** Só o início deste nó de texto, com no máximo um espaço normal ou fino.
 * @param {string} texto
 * @returns {{unidade: string, texto: string}|null}
 */
export function unidadeDaMedida(texto) {
  const espaco = /^[ \u2009\u202f]/u.test(texto) ? texto[0] : '';
  const resto = texto.slice(espaco.length);
  for (const unidade of UNIDADES_DA_MEDIDA) {
    if (!resto.startsWith(unidade)) continue;
    if (/[\p{L}\p{N}_]/u.test(resto.slice(unidade.length, unidade.length + 1))) continue;
    return { unidade, texto: espaco + unidade };
  }
  return null;
}
