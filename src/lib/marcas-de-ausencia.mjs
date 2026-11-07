/** ND1: lista fechada, literal e sensível a maiúsculas. Só cresce por decisão. */
export const MARCAS_DE_AUSENCIA = Object.freeze(['N.d.']);

/** @param {unknown} valor */
export function eMarcaDeAusencia(valor) {
  return MARCAS_DE_AUSENCIA.includes(String(valor));
}
