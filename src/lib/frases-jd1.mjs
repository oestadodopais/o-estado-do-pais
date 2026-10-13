/** JD1: montantes sempre por token, vindos das linhas seladas. */
import { loadClaims, parsePtNumber } from './ledger.mjs';
import { quadroFinanciamentoJd1 } from './quadro-financiamento-jd1.mjs';
export const FINANCIAMENTO_JD1 = 'necessidades-brutas-de-financiamento-2025';
export const AMORTIZACOES_JD1 = 'amortizacoes-e-anulacoes-de-divida-fundada-2025';
/** @param {string} id @param {'pt'|'en'} lang */
export function parcelaDoFinanciamento(id, lang) {
  if (id === AMORTIZACOES_JD1) {
    const excerto = loadClaims().get(id)?.excerpt;
    if (typeof excerto !== 'string') throw new Error('JD1: falta o excerto selado das amortizações.');
    const quadro = quadroFinanciamentoJd1(excerto);
    const parcela = quadro.linhas.find(linha => linha.destaque === 'parcela');
    if (!parcela) throw new Error('JD1: falta a parcela no quadro.');
    const atual = parsePtNumber(parcela.celulas[2]), anterior = parsePtNumber(parcela.celulas[1]);
    if (atual === null || anterior === null) throw new Error('JD1: a parcela não tem dois montantes comparáveis.');
    const diferenca = atual - anterior;
    const comparacao = lang === 'pt'
      ? diferenca > 0 ? 'A parcela foi maior do que a registada' : diferenca < 0 ? 'A parcela foi menor do que a registada' : 'A parcela foi igual à registada'
      : diferenca > 0 ? 'The portion was greater than that' : diferenca < 0 ? 'The portion was smaller than that' : 'The portion was equal to that';
    return lang === 'pt'
      ? ['Das necessidades brutas de financiamento do Estado em ', { ref: quadro.cabecalho[2] }, ', ', { claim: FINANCIAMENTO_JD1 }, ' milhões de euros, a parcela das amortizações e anulações foi de ', { claim: id }, ' milhões. ', comparacao, ' na coluna de ', { ref: quadro.cabecalho[1] }, ' do mesmo quadro.']
      : ['Of the State’s gross financing needs in ', { ref: quadro.cabecalho[2] }, ', ', { claim: FINANCIAMENTO_JD1 }, ' million euros, the portion for redemptions and cancellations was ', { claim: id }, ' million. ', comparacao, ' in the ', { ref: quadro.cabecalho[1] }, ' column of the same table.'];
  }
  if (id !== FINANCIAMENTO_JD1) return null;
  return lang === 'pt'
    ? ['Desses ', { claim: id }, ' milhões de euros, ', { claim: AMORTIZACOES_JD1 }, ' milhões serviram para reembolsar ou extinguir dívida.']
    : ['Of those ', { claim: id }, ' million euros, ', { claim: AMORTIZACOES_JD1 }, ' million were used to repay or extinguish debt.'];
}
