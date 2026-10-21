/** As derivadas EO1 usam a forma numérica da edição; as restantes conservam a publicação. */
/** @param {{id: string, value: unknown, study?: unknown, derivation?: unknown}} linha @param {string} lang */
export function valorNaLingua(linha, lang) {
  const value = String(linha.value);
  if (lang !== 'en' || linha.study !== 'orcamento-2027-o-que-muda-e-para-quem' || !linha.derivation) return value;
  const match = value.replace(/[\s\u00a0\u202f]/g, '').match(/^([−+-]?)(\d+)(?:,(\d+))?$/);
  if (!match) throw new Error('Derivada EO1 sem valor numérico: ' + linha.id);
  return match[1].replace('-', '−') + match[2].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + (match[3] === undefined ? '' : '.' + match[3]);
}
