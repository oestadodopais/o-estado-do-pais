/** SEL1: uma só lista, com a correspondência mais longa primeiro. */
const grandezasPt = ['mil', 'milhão', 'milhões', 'mil milhões'];
const grandezasEn = ['thousand', 'million', 'billion', 'thousand million'];
export const UNIDADES_DA_MEDIDA = Object.freeze([...new Set([
  ...grandezasPt.flatMap(g => [g, g + ' de euros']),
  ...grandezasEn.flatMap(g => [g, g + ' euros', g + ' of euros']),
  'mil euros', 'euros', 'euro', '% do PIB', '% of GDP', '%',
  'pontos percentuais', 'ponto percentual', 'percentage points', 'percentage point',
  'p.p.', 'pontos', 'ponto', 'points', 'point',
  'vezes', 'vez', 'times', 'time',
  'dias', 'dia', 'semanas', 'semana', 'meses', 'mês', 'anos', 'ano', 'horas', 'hora',
  'days', 'day', 'weeks', 'week', 'months', 'month', 'years', 'year', 'hours', 'hour',
])].sort((a, b) => b.length - a.length));

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
