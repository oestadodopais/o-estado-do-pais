/** A formatação portuguesa dos números conserva-se nas duas edições (§1.6). */
/** @param {{id: string, value: unknown, unit?: unknown}} linha @param {string} _lang */
export function valorNaLingua(linha, _lang) {
  const valor = String(linha.value);
  // Datas anunciadas pelo calendário conservam os campos e usam a grafia da casa.
  if (linha.unit === 'data' && /^\d{2}\/\d{2}\/\d{4}$/.test(valor)) return valor.replaceAll('/', '.');
  return valor;
}
