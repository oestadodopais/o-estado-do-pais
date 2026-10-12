/** JD1-c: montantes sempre por token, vindos das linhas seladas. */
export const FINANCIAMENTO_JD1 = 'necessidades-brutas-de-financiamento-2025';
export const AMORTIZACOES_JD1 = 'amortizacoes-e-anulacoes-de-divida-fundada-2025';
/** @param {string} id @param {'pt'|'en'} lang */
export function parcelaDoFinanciamento(id, lang) {
  if (id !== FINANCIAMENTO_JD1) return null;
  return lang === 'pt'
    ? ['Desses ', { claim: id }, ' milhões de euros, ', { claim: AMORTIZACOES_JD1 }, ' milhões serviram para reembolsar ou extinguir dívida.']
    : ['Of those ', { claim: id }, ' million euros, ', { claim: AMORTIZACOES_JD1 }, ' million were used to repay or extinguish debt.'];
}
