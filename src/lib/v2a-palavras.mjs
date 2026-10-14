/** V2-a-d: períodos e contas lidos das linhas, sem algarismos na prosa. */
import {getClaim} from './ledger.mjs';
const saude='oe-2027-saude-despesa-total-consolidada-';
const ppp='oe-2027-ppp-rodoviario-';
/** @param {string} id @param {'pt'|'en'} lang */
export function continuacaoDoNomeV2a(id,lang) {
  if(id.startsWith('oe-2027-saude-')) {
    if(id.endsWith('-variacao'))return [' ',{periodo:id.replace(/variacao$/,'2026')},lang==='pt'?' e o orçamento para ':' and the budget for ',{periodo:id}];
    return [' ',{periodo:id},...(lang==='en'&&id.endsWith('-2026')?[' estimate']:[])];
  }
  if(id.startsWith('oe-2027-ppp-'))return [' ',{periodo:id}];
  return [];
}
/** @param {string} id @param {'pt'|'en'} lang */
export function contaV2a(id,lang) {
  if(id.startsWith('afirmacao-rtp-'))return lang==='pt'
    ? ['A despesa total consolidada passa de ',{claim:saude+'2026'},' milhões de euros na estimativa de ',{periodo:saude+'2026'},' para ',{claim:saude+'2027'},' milhões no orçamento para ',{periodo:saude+'2027'},'. A diferença obtém-se subtraindo o orçamento à estimativa.']
    : ['Consolidated total expenditure goes from ',{claim:saude+'2026'},' million euros in the estimate for ',{periodo:saude+'2026'},' to ',{claim:saude+'2027'},' million in the budget for ',{periodo:saude+'2027'},'. The decrease is calculated by subtracting the budget from the estimate.'];
  if(id.startsWith('oe-2027-ppp-'))return lang==='pt'
    ? ['Na coluna de ',{periodo:id},', os encargos líquidos rodoviários são os encargos brutos menos as receitas: ',{claim:ppp+'encargos-brutos-2027'},' menos ',{claim:ppp+'receitas-2027'},' dá ',{claim:ppp+'encargos-liquidos-2027'},' milhões de euros. A nota do quadro indica valores de caixa a preços constantes desse ano.']
    : ['In the column for ',{periodo:id},', net road charges are gross charges minus revenue: ',{claim:ppp+'encargos-brutos-2027'},' minus ',{claim:ppp+'receitas-2027'},' equals ',{claim:ppp+'encargos-liquidos-2027'},' million euros. The table note specifies cash flows at constant prices for that year.'];
  return [];
}
/** O token de período conserva o campo e a linha que o sustentam. @param {any[]} partes */
export function resolverPeriodosV2a(partes) {
  return partes.map(p=>typeof p==='object'&&p.periodo?{data:{id:p.periodo,campo:'reference_date',valor:getClaim(p.periodo).reference_date}}:p);
}
