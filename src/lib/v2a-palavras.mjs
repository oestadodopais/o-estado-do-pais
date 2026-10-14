/** V2-a-d: períodos e contas lidos das linhas, sem algarismos na prosa. */
import {resolverComplemento} from './o-que-e-o-numero.mjs';
const saude='oe-2027-saude-despesa-total-consolidada-';
/** @param {string} id @param {'pt'|'en'} lang */
export function continuacaoDoNomeV2a(id,lang) {
  if(id.startsWith('oe-2027-saude-')) {
    if(id.endsWith('-variacao'))return [lang==='pt'?' entre a estimativa de ':' between the estimate for ',{periodo:id.replace(/variacao$/,'2026')},lang==='pt'?' e o orçamento para ':' and the budget for ',{periodo:id}];
    return [lang==='pt'?(id.endsWith('-2026')?', estimativa de ':', orçamento para '):(id.endsWith('-2026')?', ':', budget for '),{periodo:id},...(lang==='en'&&id.endsWith('-2026')?[' estimate']:[])];
  }
  if(id.startsWith('oe-2027-cenario-'))return [lang==='pt'?', período da previsão: ':', forecast period: ',{periodo:id}];
  if(id.startsWith('oe-2027-ppp-'))return [', ',{periodo:id}];
  return [];
}
/** @param {string} id @param {'pt'|'en'} lang */
export function contaV2a(id,lang) {
  if(id.startsWith('afirmacao-rtp-'))return lang==='pt'
    ? ['A despesa total consolidada passa de ',{claim:saude+'2026'},' milhões de euros na estimativa de ',{periodo:saude+'2026'},' para ',{claim:saude+'2027'},' milhões no orçamento para ',{periodo:saude+'2027'},'. A diferença obtém-se subtraindo o orçamento à estimativa.']
    : ['Consolidated total expenditure goes from ',{claim:saude+'2026'},' million euros in the estimate for ',{periodo:saude+'2026'},' to ',{claim:saude+'2027'},' million in the budget for ',{periodo:saude+'2027'},'. The decrease is calculated by subtracting the budget from the estimate.'];
  if(id.startsWith('oe-2027-ppp-rodoviario-'))return lang==='pt' ? ["Os encargos brutos são o que o Estado paga às parcerias rodoviárias nesse ano: os pagamentos pela disponibilidade das vias, os pagamentos por serviço indexados ao tráfego, os gastos com a cobrança das portagens, as grandes reparações de pavimentos a cargo do Estado e as compensações a pagar aos parceiros privados, como o relatório os lista na p. ", {"apoio": {"origem": "v2a-ppp-conta", "campo": "pagina_pdf"}}, ". As receitas são o que o Estado recebe nessas parcerias: as portagens cobradas nas vias portajadas (exceto nas parcerias em que as portagens pertencem ao parceiro privado), a partilha de benefícios ou de receitas prevista nos contratos, e os pagamentos fixos das subconcessionárias ao Estado. Os encargos líquidos são os encargos brutos menos as receitas: ", {"claim": "oe-2027-ppp-rodoviario-encargos-brutos-2027"}, " menos ", {"claim": "oe-2027-ppp-rodoviario-receitas-2027"}, " dá ", {"claim": "oe-2027-ppp-rodoviario-encargos-liquidos-2027"}, ", em milhões de euros. São valores de caixa, o dinheiro que sai e que entra no ano, em euros de ", {"periodo": "oe-2027-ppp-rodoviario-encargos-brutos-2027"}, "."] : ["Gross charges are what the State pays to the road partnerships in that year: availability payments for the roads, service payments indexed to traffic, the costs of toll collection, major pavement repairs borne by the State and compensation payable to private partners, as the report lists them on p. ", {"apoio": {"origem": "v2a-ppp-conta", "campo": "pagina_pdf"}}, ". Revenue is what the State receives in those partnerships: the tolls collected on tolled roads (except in partnerships where the tolls belong to the private partner), the benefit or revenue sharing provided for in the contracts, and the fixed payments made by subconcessionaires to the State. Net charges are gross charges minus revenue: ", {"claim": "oe-2027-ppp-rodoviario-encargos-brutos-2027"}, " minus ", {"claim": "oe-2027-ppp-rodoviario-receitas-2027"}, " gives ", {"claim": "oe-2027-ppp-rodoviario-encargos-liquidos-2027"}, ", in millions of euros. These are cash values, the money paid and received in the year, in ", {"periodo": "oe-2027-ppp-rodoviario-encargos-brutos-2027"}, " euros."];
  return [];
}
/** O token de período conserva o campo e a linha que o sustentam. @param {any[]} partes */
export function resolverPeriodosV2a(partes) {
  return resolverComplemento(partes);
}
