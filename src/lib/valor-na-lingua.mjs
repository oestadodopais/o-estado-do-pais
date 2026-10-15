/** EX3: as percentagens da NATO conservam as duas casas impressas em ambas as edições. */
/** @param {{id: string, value: unknown}} linha @param {string} lang */
export function valorNaLingua(linha, lang) {
  const valor = String(linha.value);
  return lang === 'en' && /^nato-defesa-portugal-pib-202[56]$/.test(linha.id) ? valor.replace(',', '.') : valor;
}
