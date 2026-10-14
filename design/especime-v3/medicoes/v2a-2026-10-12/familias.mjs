/** V2-a: frases e nomes das medidas, com apoio nas palavras seladas. */
const minusculas=s=>s.charAt(0).toLowerCase()+s.slice(1);
const L=(campo,literal)=>({linha:'propria',campo,literal});
const familia=(chaves,pt,en,frase,phrase,...apoios)=>({chaves,nome:{pt,en},origens:[],partes:[{pt:frase,en:phrase,classe:'diz',apoios}]});
export const FAMILIAS_V2A=[];
const A=(origem,campo)=>({apoio:{origem,campo}});
const O=(origem,literal)=>({origem,campo:'excerto',literal});
const definicoesSaude={"pt": " \"Consolidada\" quer dizer que o quadro retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. \"Efetiva\" é a despesa sem as operações financeiras (os empréstimos que o programa concede ou paga e as participações que compra): a despesa total é a efetiva mais os ativos e os passivos financeiros, como o quadro mostra.", "en": " \"Consolidated\" means that the table removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. \"Effective\" is expenditure without financial operations (the loans the programme grants or repays and the holdings it buys): total expenditure is the effective figure plus financial assets and liabilities, as the table shows."};
const saude='oe-2027-saude-despesa-efetiva-consolidada-';
const prrPt=' PRR é o Plano de Recuperação e Resiliência. O relatório descreve o fim do seu ciclo extraordinário de financiamento.';
const prrEn=' The report describes the end of the exceptional funding cycle of the Recovery and Resilience Plan (RRP; «PRR» in the table).';
const apoioPrr=[O('v2a-prr-saude','Plano de Recuperação e Resiliência (PRR)'),O('v2a-prr-ciclo','Concluído o ciclo extraordinário de financiamento associado ao PRR')];
export const comparacaoPrr={
 pt:[' Com o PRR, a despesa efetiva consolidada passa de ',{claim:saude+'2026'},' milhões de euros na estimativa de ',{periodo:saude+'2026'},' para ',{claim:saude+'2027'},' milhões no orçamento para ',{periodo:saude+'2027'},'; sem o PRR, passa de ',{claim:saude+'sem-prr-2026'},' para ',{claim:saude+'sem-prr-2027'},' milhões. A diferença entre a despesa com e sem PRR é a parcela do PRR. A redução dessa parcela faz com que a despesa com PRR desça, apesar de a despesa sem PRR subir.'],
 en:[' With the RRP, consolidated effective expenditure goes from ',{claim:saude+'2026'},' million euros in the estimate for ',{periodo:saude+'2026'},' to ',{claim:saude+'2027'},' million in the budget for ',{periodo:saude+'2027'},'; excluding the RRP, it goes from ',{claim:saude+'sem-prr-2026'},' to ',{claim:saude+'sem-prr-2027'},' million. The difference between expenditure with and without the RRP is the RRP component. The reduction in that component makes expenditure with the RRP fall, even though expenditure without the RRP rises.'],
};
const totalComPrr={
 pt:[' A variação da despesa total consolidada inclui a despesa relativa ao Plano de Recuperação e Resiliência (PRR). Na parte da Saúde, o relatório do Orçamento do Estado para ',{periodo:'oe-2027-saude-despesa-total-consolidada-2027'},' diz que a dotação desse ano é superior à estimativa de ',{periodo:'oe-2027-saude-despesa-total-consolidada-2026'},' expurgada do efeito do PRR.'],
 en:[' The change in consolidated total expenditure includes spending under the Recovery and Resilience Plan (RRP; «PRR» in the table). In its Health section, the Budget report for ',{periodo:'oe-2027-saude-despesa-total-consolidada-2027'},' says that the allocation for that year is higher than the estimate for ',{periodo:'oe-2027-saude-despesa-total-consolidada-2026'},' excluding the RRP effect.'],
};
for(const [stem,label,en] of [
 ['despesa-total-consolidada','Despesa total consolidada','Consolidated total expenditure'],
 ['despesa-efetiva-consolidada','Despesa efetiva consolidada','Consolidated effective expenditure'],
 ['despesa-efetiva-consolidada-sem-prr','Despesa efetiva consolidada sem PRR','Consolidated effective expenditure excluding the RRP'],
]) for(const ano of ['2026','2027','variacao']) {
 const id='oe-2027-saude-'+stem+'-'+ano,variacao=ano==='variacao',sem=stem.endsWith('sem-prr'),explica=sem||variacao,totalPrr=variacao&&stem.includes('total');
 const medida=minusculas(label),measure=minusculas(en).replace('excluding the RRP','excluding the Recovery and Resilience Plan (RRP; «PRR» in the table)');
 const f=familia([id],'Saúde, '+medida+(variacao?', variação publicada':''),'Health, '+minusculas(en)+(variacao?', published change':''),
  (variacao?'É a variação publicada da ':'É a ')+medida+' do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve.',
  (variacao?'It is the published change in ':'It is ')+measure+' in the Health table, «Conta do Pograma Legado», as written in the table.',
  L('name',label.replace(' sem PRR','')),L('document.locator','Saúde (PL15), Conta do Pograma Legado'),O('v2a-saude-consolidada','provenientes e destinados a entidades do Pograma Legado'),...(totalPrr?[apoioPrr[0]]:explica?apoioPrr:[]));
 f.origens=['v2a-saude-consolidada',...(totalPrr?['v2a-prr-saude']:explica?['v2a-prr-saude','v2a-prr-ciclo']:[])];
 f.complemento={pt:variacao?[' Compara a estimativa de ',{periodo:id.replace('variacao','2026')},' com o orçamento para ',{periodo:id},'.']:[' Refere-se '+(ano==='2026'?'à estimativa de ':'ao orçamento para '),{periodo:id},'.'],en:variacao?[' It compares the estimate for ',{periodo:id.replace('variacao','2026')},' with the budget for ',{periodo:id},'.']:[' It refers to the '+(ano==='2026'?'estimate':'budget')+' for ',{periodo:id},'.']};
 for(const lang of ['pt','en'])f.complemento[lang].push(definicoesSaude[lang]);
 if(totalPrr)for(const lang of ['pt','en'])f.complemento[lang].push(...totalComPrr[lang]);
 else if(explica) {f.complemento.pt.push(prrPt,...comparacaoPrr.pt);f.complemento.en.push(sem?' The report describes the end of the plan’s exceptional funding cycle.':prrEn,...comparacaoPrr.en);}
 FAMILIAS_V2A.push(f);
}
for(const [stem,label,en,fonte] of [
 ['rodoviario-encargos-brutos','Encargos brutos do setor rodoviário','Road sector gross charges','encargos brutos'],
 ['rodoviario-receitas','Receitas do setor rodoviário','Road sector revenue','receitas'],
 ['rodoviario-encargos-liquidos','Encargos líquidos do setor rodoviário','Road sector net charges','Rodoviário'],
 ['total-encargos-liquidos','Total dos encargos líquidos das parcerias público-privadas','Total net public-private partnership charges','Total'],
]) {
 const total=stem==='total-encargos-liquidos';
 const f=familia(['oe-2027-ppp-'+stem],(total?'Parcerias público-privadas, total dos encargos líquidos':'Parcerias público-privadas rodoviárias, '+(stem.endsWith('brutos')?'encargos brutos':stem.endsWith('receitas')?'receitas':'encargos líquidos')),(total?'Public-private partnerships, total net charges':'Road public-private partnerships, '+(stem.endsWith('brutos')?'gross charges':stem.endsWith('receitas')?'revenue':'net charges')),
  total?"É quanto o Estado prevê pagar em ":'É o valor previsto para '+minusculas(label)+' no quadro das parcerias público-privadas.',
  total?"It is what the State expects to pay in ":'It is the projected value for '+minusculas(en)+' in the public-private partnership table.',
  L('name',fonte),L('document.locator','Quadro 4.25'),L('excerpt','ótica de fluxo de caixa'),L('excerpt','preços constantes de 2027'),...(total?[O('v2a-ppp-setores','Oceanário')]:[O('v2a-ppp-conta','designadamente os encargos e as receitas')]));
 f.origens=[...(total?['v2a-ppp-setores']:[]),'v2a-ppp-conta'];
 if(total)f.partes[0].apoios.push(O('v2a-ppp-conta','Receitas oriundas da cobrança de taxas de portagem'));
 if(total)f.complemento={"pt": [{"periodo": "oe-2027-ppp-total-encargos-liquidos-2027"}, " ao conjunto das parcerias público-privadas, depois de descontar o que recebe delas: a linha «Total» do quadro ", {"apoio": {"origem": "v2a-ppp-setores", "campo": "quadro"}}, " do relatório, em dinheiro que sai e que entra no ano, em euros de ", {"periodo": "oe-2027-ppp-total-encargos-liquidos-2027"}, ". O quadro lista cinco setores, como os escreve: «Rodoviário» (estradas), «Ferroviário» (ferrovia), «Saúde» (hospitais), «Aeroportuário» (aeroportos) e «Oceanário». O que o Estado paga e recebe nas parcerias rodoviárias está explicado no texto do relatório (p. ", {"apoio": {"origem": "v2a-ppp-conta", "campo": "pagina_pdf"}}, "): de um lado, os pagamentos pela disponibilidade das vias e pelo serviço, os gastos com a cobrança das portagens, as grandes reparações e as compensações; do outro, as portagens, a partilha de benefícios ou de receitas e os pagamentos fixos das subconcessionárias."], "en": [{"periodo": "oe-2027-ppp-total-encargos-liquidos-2027"}, " to all public-private partnerships, after deducting what it receives from them: the «Total» row of Table ", {"apoio": {"origem": "v2a-ppp-setores", "campo": "quadro"}}, " of the report, in money paid and received in the year, in ", {"periodo": "oe-2027-ppp-total-encargos-liquidos-2027"}, " euros. The table lists five sectors, as it writes them: «Rodoviário» (roads), «Ferroviário» (railways), «Saúde» (hospitals), «Aeroportuário» (airports) and «Oceanário» (the oceanarium). What the State pays and receives in the road partnerships is explained in the report's text (p. ", {"apoio": {"origem": "v2a-ppp-conta", "campo": "pagina_pdf"}}, "): on one side, availability and service payments, the costs of toll collection, major repairs and compensation; on the other, tolls, benefit or revenue sharing and the fixed payments by subconcessionaires."]};
 FAMILIAS_V2A.push(f);
}
FAMILIAS_V2A.push(familia(['oe-2027-cenario-pib-real-crescimento'],'Previsão do Ministério das Finanças para o crescimento real do produto interno bruto, transcrita pelo CFP',
  'Ministry of Finance forecast for real gross domestic product growth, transcribed by the CFP',
  'É a previsão do Ministério das Finanças para o crescimento real do produto interno bruto na Proposta de Orçamento do Estado analisada pelo CFP, como o CFP a transcreve. O parecer considera-a superior à de todas as instituições de referência.',
  'It is the Ministry of Finance forecast for real gross domestic product growth in the Draft State Budget assessed by the CFP, as transcribed by the CFP. The opinion considers it higher than those of all reference institutions.',
  L('document.title','Proposta de Orçamento do Estado para 2027'),L('excerpt','crescimento real'),L('excerpt','Fonte: MF'),L('excerpt','superior ao de todas as instituições de referência')));
FAMILIAS_V2A.push(familia(['oe-2027-cenario-ihpc'],'Previsão do Ministério das Finanças para a inflação medida pelo IHPC, transcrita pelo CFP',
  'Ministry of Finance forecast for HICP inflation, transcribed by the CFP',
  'É a previsão do Ministério das Finanças para a inflação medida pelo índice harmonizado de preços no consumidor na Proposta de Orçamento do Estado analisada pelo CFP, como o CFP a transcreve. O parecer considera-a pouco provável.',
  'It is the Ministry of Finance forecast for inflation measured by the harmonised index of consumer prices in the Draft State Budget assessed by the CFP, as transcribed by the CFP. The opinion considers it unlikely.',
  L('name','IHPC'),L('document.title','Proposta de Orçamento do Estado para 2027'),L('excerpt','Fonte: MF'),L('excerpt','pouco provável')));
for(const f of FAMILIAS_V2A.filter(f=>f.chaves[0].includes('-cenario-'))) {
 const id=f.chaves[0]+(f.chaves[0].endsWith('ihpc')?'-2026':'-2027');
 f.complemento={pt:[' A previsão refere-se a ',{periodo:id},'.'],en:[' The forecast refers to ',{periodo:id},'.']};
}
for(const [id,pt,en,frase,phrase,literal] of [
 ['afirmacao-leitao-amaro-saude-oe2027-2026-10-09','Afirmação de Leitão Amaro sobre o orçamento da Saúde sem PRR','Leitão Amaro’s statement about the Health budget excluding the RRP',
  'É o aumento do orçamento da Saúde retirando a verba excecional do PRR, nas palavras do ministro da Presidência transcritas pela RTP.',
  'It is the increase in the Health budget excluding exceptional RRP funding, in the Minister of the Presidency’s words transcribed by RTP.', 'Se retirarmos isso, o orçamento da Saúde'],
 ['afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09','Afirmação de Paulo Raimundo sobre as parcerias rodoviárias','Paulo Raimundo’s statement about road partnerships',
  'É o montante que o orçamento entrega às parcerias público-privadas rodoviárias, nas palavras da intervenção de Paulo Raimundo publicada pelo PCP.',
  'It is the amount the budget allocates to road public-private partnerships, in Paulo Raimundo’s speech published by the PCP.', 'parcerias público-privadas rodoviárias'],
 ['afirmacao-rtp-saude-queda-oe2027-2026-10-09','Queda do orçamento da Saúde noticiada pela RTP','Health budget decrease reported by RTP',
  'É a queda do orçamento da Saúde para dois mil e vinte e sete noticiada pela RTP a nove de outubro de dois mil e vinte e seis. Os montantes da notícia identificam a despesa total consolidada do programa Saúde. A queda é a diferença entre a estimativa do ano anterior e o orçamento.',
  'It is the decrease in the Health budget for two thousand and twenty-seven reported by RTP on nine October two thousand and twenty-six. The article’s amounts identify consolidated total expenditure for the Health programme. The decrease is the difference between the previous year’s estimate and the budget.', 'O orçamento para Saúde sofre um corte'],
]) FAMILIAS_V2A.push(familia([id],pt,en,frase,phrase,L('excerpt',literal)));

const amaro=FAMILIAS_V2A.find(f=>f.chaves[0].startsWith('afirmacao-leitao-'));
amaro.partes[0].pt+=' PRR é o Plano de Recuperação e Resiliência.';
amaro.partes[0].en=amaro.partes[0].en.replace('exceptional RRP funding','exceptional Recovery and Resilience Plan (RRP; PRR in Portuguese) funding');
amaro.partes[0].apoios.push(...apoioPrr);amaro.origens=['v2a-prr-saude','v2a-prr-ciclo','v2a-saude-consolidada'];
amaro.partes[0].apoios.push(O('v2a-saude-consolidada','provenientes e destinados a entidades do Pograma Legado'));
amaro.complemento={pt:[' O relatório «',A('v2a-prr-ciclo','documento'),'» (p. ',A('v2a-prr-ciclo','pagina_pdf'),' do PDF) descreve o fim do ciclo extraordinário de financiamento do PRR.',definicoesSaude.pt,...comparacaoPrr.pt],en:[' The ',A('v2a-prr-ciclo','documento_en'),' (PDF p. ',A('v2a-prr-ciclo','pagina_pdf'),') describes the end of the RRP’s exceptional funding cycle.',definicoesSaude.en,...comparacaoPrr.en]};
const pcp=FAMILIAS_V2A.find(f=>f.chaves[0].startsWith('afirmacao-pcp-'));
pcp.partes[0].pt="Na intervenção publicada pelo PCP, Paulo Raimundo afirma: «";
pcp.partes[0].en="In the speech published by the PCP, Paulo Raimundo states that the budget allocates ";
pcp.origens=['v2a-ppp-setores','v2a-ppp-conta'];pcp.partes[0].apoios.push(O('v2a-ppp-setores','encargos brutos'),O('v2a-ppp-conta','designadamente os encargos e as receitas'));
const bruto='oe-2027-ppp-rodoviario-encargos-brutos-2027',liquido='oe-2027-ppp-rodoviario-encargos-liquidos-2027';
pcp.complemento={"pt": [{"excerto": "afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09"}, "». No relatório «", {"apoio": {"origem": "v2a-ppp-setores", "campo": "documento"}}, "» (p. ", {"apoio": {"origem": "v2a-ppp-setores", "campo": "pagina_pdf"}}, "), o quadro ", {"apoio": {"origem": "v2a-ppp-setores", "campo": "quadro"}}, " prevê para ", {"periodo": "oe-2027-ppp-rodoviario-encargos-brutos-2027"}, " encargos brutos rodoviários de ", {"claim": "oe-2027-ppp-rodoviario-encargos-brutos-2027"}, " milhões de euros: o que o Estado paga às parcerias rodoviárias nesse ano, com os pagamentos pela disponibilidade das vias e pelo serviço, os gastos com a cobrança das portagens, as grandes reparações e as compensações aos parceiros privados. Os encargos líquidos são ", {"claim": "oe-2027-ppp-rodoviario-encargos-liquidos-2027"}, " milhões: o que paga depois de descontar as receitas, que são as portagens cobradas nas vias portajadas (exceto onde pertencem ao parceiro privado), a partilha de benefícios ou de receitas prevista nos contratos e os pagamentos fixos das subconcessionárias, como o relatório as lista na p. ", {"apoio": {"origem": "v2a-ppp-conta", "campo": "pagina_pdf"}}, ". O montante afirmado é superior tanto aos encargos brutos como aos líquidos que o quadro imprime para ", {"periodo": "oe-2027-ppp-rodoviario-encargos-liquidos-2027"}, "."], "en": [{"claim": "afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09"}, " million euros to road public-private partnerships, in these words: «", {"excerto": "afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09"}, "». In the ", {"apoio": {"origem": "v2a-ppp-setores", "campo": "documento_en"}}, " (PDF p. ", {"apoio": {"origem": "v2a-ppp-setores", "campo": "pagina_pdf"}}, "), Table ", {"apoio": {"origem": "v2a-ppp-setores", "campo": "quadro"}}, " forecasts gross road charges of ", {"claim": "oe-2027-ppp-rodoviario-encargos-brutos-2027"}, " million euros for ", {"periodo": "oe-2027-ppp-rodoviario-encargos-brutos-2027"}, ": what the State pays to road partnerships that year, with availability and service payments, the costs of toll collection, major repairs and compensation to private partners. Net charges are ", {"claim": "oe-2027-ppp-rodoviario-encargos-liquidos-2027"}, " million: what it pays after deducting revenue, which is the tolls collected on tolled roads (except where they belong to the private partner), the benefit or revenue sharing provided for in the contracts and the fixed payments by subconcessionaires, as the report lists them on p. ", {"apoio": {"origem": "v2a-ppp-conta", "campo": "pagina_pdf"}}, ". The stated amount is higher than both the gross and net charges printed in the table for ", {"periodo": "oe-2027-ppp-rodoviario-encargos-liquidos-2027"}, "."]};
const rtp=FAMILIAS_V2A.find(f=>f.chaves[0].startsWith('afirmacao-rtp-'));
rtp.partes[0].pt='É a queda do orçamento da Saúde noticiada pela RTP. Os montantes da notícia identificam a despesa total consolidada do programa Saúde.';
rtp.partes[0].en='It is the Health budget decrease reported by RTP. The article’s amounts identify consolidated total expenditure for the Health programme.';

rtp.complemento={pt:[' A notícia é de ',{periodo:rtp.chaves[0]},' e refere-se ao orçamento para ',{periodo:'oe-2027-saude-despesa-total-consolidada-2027'},'.'],en:[' The article is dated ',{periodo:rtp.chaves[0]},' and concerns the budget for ',{periodo:'oe-2027-saude-despesa-total-consolidada-2027'},'.']};

rtp.partes[0].apoios.push(apoioPrr[0]);rtp.origens=['v2a-prr-saude','v2a-saude-consolidada'];
rtp.partes[0].apoios.push(O('v2a-saude-consolidada','provenientes e destinados a entidades do Pograma Legado'));
for(const lang of ['pt','en'])rtp.complemento[lang].push(definicoesSaude[lang]);
for(const lang of ['pt','en'])rtp.complemento[lang].push(...totalComPrr[lang]);
