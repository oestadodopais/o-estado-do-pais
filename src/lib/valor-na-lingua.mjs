/** A formatação portuguesa dos números conserva-se nas duas edições (§1.6). */
/** @param {{id: string, value: unknown}} linha @param {string} _lang */
export function valorNaLingua(linha, _lang) {
  return String(linha.value);
}
