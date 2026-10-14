/** V2-a: frases e nomes das medidas, com apoio nas palavras seladas. */
const minusculas=s=>s.charAt(0).toLowerCase()+s.slice(1);
const L=(campo,literal)=>({linha:'propria',campo,literal});
const familia=(chaves,pt,en,frase,phrase,...apoios)=>({chaves,nome:{pt,en},origens:[],partes:[{pt:frase,en:phrase,classe:'diz',apoios}]});
export const FAMILIAS_V2A=[];
const O=(origem,literal)=>({origem,campo:'excerto',literal});
const totalEfetiva=[O('v2a-total-efetiva','A despesa total efetiva exclui ativos e passivos financeiros'),O('v2a-total-efetiva','A despesa total inclui ativos e passivos financeiros')];
const saude='oe-2027-saude-despesa-efetiva-consolidada-';
const prrPt=' PRR é o Plano de Recuperação e Resiliência. O relatório descreve o fim do seu ciclo extraordinário de financiamento.';
const prrEn=' PRR means Recovery and Resilience Plan. The report describes the end of its exceptional funding cycle.';
const apoioPrr=[O('v2a-prr-saude','Plano de Recuperação e Resiliência (PRR)'),O('v2a-prr-ciclo','Concluído o ciclo extraordinário de financiamento associado ao PRR')];
export const comparacaoPrr={
 pt:[' Com o PRR, a despesa efetiva consolidada passa de ',{claim:saude+'2026'},' milhões de euros na estimativa de ',{periodo:saude+'2026'},' para ',{claim:saude+'2027'},' milhões no orçamento para ',{periodo:saude+'2027'},'; sem o PRR, passa de ',{claim:saude+'sem-prr-2026'},' para ',{claim:saude+'sem-prr-2027'},' milhões. A diferença entre as colunas com e sem PRR é a parcela do PRR; a sua redução explica a descida com PRR e a subida sem ele.'],
 en:[' With the PRR, consolidated effective expenditure goes from ',{claim:saude+'2026'},' million euros in the estimate for ',{periodo:saude+'2026'},' to ',{claim:saude+'2027'},' million in the budget for ',{periodo:saude+'2027'},'; excluding the PRR, it goes from ',{claim:saude+'sem-prr-2026'},' to ',{claim:saude+'sem-prr-2027'},' million. The difference between the columns with and without PRR is the PRR component; its reduction explains the fall with PRR and the rise without it.'],
};
for(const [stem,label,en] of [
 ['despesa-total-consolidada','Despesa total consolidada','Consolidated total expenditure'],
 ['despesa-efetiva-consolidada','Despesa efetiva consolidada','Consolidated effective expenditure'],
 ['despesa-efetiva-consolidada-sem-prr','Despesa efetiva consolidada sem PRR','Consolidated effective expenditure excluding the RRP'],
]) for(const ano of ['2026','2027','variacao']) {
 const id='oe-2027-saude-'+stem+'-'+ano,variacao=ano==='variacao',sem=stem.endsWith('sem-prr'),explica=sem||(variacao&&stem.includes('efetiva'));
 const medida=minusculas(label),measure=minusculas(en).replace('excluding the RRP','excluding the Recovery and Resilience Plan (PRR)');
 const f=familia([id],'Saúde, '+medida+(variacao?', variação publicada':''),'Health, '+minusculas(en)+(variacao?', published change':''),
  (variacao?'É a variação publicada da ':'É a ')+medida+' do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve.'+(variacao?'':' A despesa total inclui operações com ativos e passivos financeiros; a efetiva exclui essas operações.')+(explica?prrPt:''),
  (variacao?'It is the published change in ':'It is ')+measure+' in the Health table, «Conta do Pograma Legado», as written in the table.'+(variacao?'':' Total expenditure includes financial asset and liability transactions; effective expenditure excludes those transactions.')+(explica?(sem?' The report describes the end of the plan’s exceptional funding cycle.':' Recovery and Resilience Plan (PRR) is the plan’s full name. The report describes the end of its exceptional funding cycle.') :''),
  L('name',label.replace(' sem PRR','')),L('document.locator','Saúde (PL15), Conta do Pograma Legado'),...(variacao?[]:totalEfetiva),...(explica?apoioPrr:[]));
 f.origens=[...(!variacao?['v2a-total-efetiva']:[]),...(explica?['v2a-prr-saude','v2a-prr-ciclo']:[])];
 f.complemento={pt:variacao?[' Compara a estimativa de ',{periodo:id.replace('variacao','2026')},' com o orçamento para ',{periodo:id},'.']:[' Refere-se '+(ano==='2026'?'à estimativa de ':'ao orçamento para '),{periodo:id},'.'],en:variacao?[' It compares the estimate for ',{periodo:id.replace('variacao','2026')},' with the budget for ',{periodo:id},'.']:[' It refers to the '+(ano==='2026'?'estimate':'budget')+' for ',{periodo:id},'.']};
 if(explica)for(const lang of ['pt','en'])f.complemento[lang].push(...comparacaoPrr[lang]);
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
  total?'É o total previsto dos encargos líquidos das parcerias público-privadas: soma os setores «Rodoviário», «Ferroviário», «Saúde», «Aeroportuário» e «Oceanário», como o quadro os escreve.':'É o valor previsto para '+minusculas(label)+' no quadro das parcerias público-privadas.',
  total?'It is the projected total of net public-private partnership charges: it sums the sectors «Rodoviário», «Ferroviário», «Saúde», «Aeroportuário» and «Oceanário», as written in the table.':'It is the projected value for '+minusculas(en)+' in the public-private partnership table.',
  L('name',fonte),L('document.locator','Quadro 4.25'),L('excerpt','ótica de fluxo de caixa'),L('excerpt','preços constantes de 2027'),...(total?[O('v2a-ppp-setores','Oceanário')]:[O('v2a-ppp-conta','designadamente os encargos e as receitas')]));
 f.origens=[total?'v2a-ppp-setores':'v2a-ppp-conta'];
 if(total)f.complemento={pt:[' São valores de caixa a preços constantes de ',{periodo:'oe-2027-ppp-total-encargos-liquidos-2027'},'.'],en:[' These are cash flows at constant prices for ',{periodo:'oe-2027-ppp-total-encargos-liquidos-2027'},'.']};
 FAMILIAS_V2A.push(f);
}
FAMILIAS_V2A.push(familia(['oe-2027-cenario-pib-real-crescimento'],'Previsão do Ministério das Finanças para o crescimento real do produto interno bruto em dois mil e vinte e sete, transcrita pelo CFP',
  'Ministry of Finance forecast for real gross domestic product growth in two thousand and twenty-seven, transcribed by the CFP',
  'É a previsão do Ministério das Finanças para o crescimento real do produto interno bruto em dois mil e vinte e sete, na Proposta de Orçamento do Estado para dois mil e vinte e sete, como o CFP a transcreve. O parecer considera-a superior à de todas as instituições de referência.',
  'It is the Ministry of Finance forecast for real gross domestic product growth in two thousand and twenty-seven, in the Draft State Budget for two thousand and twenty-seven, as transcribed by the CFP. The opinion considers it higher than those of all reference institutions.',
  L('document.title','Proposta de Orçamento do Estado para 2027'),L('excerpt','crescimento real'),L('excerpt','Fonte: MF'),L('excerpt','superior ao de todas as instituições de referência')));
FAMILIAS_V2A.push(familia(['oe-2027-cenario-ihpc'],'Previsão do Ministério das Finanças para a inflação medida pelo IHPC em dois mil e vinte e seis, transcrita pelo CFP',
  'Ministry of Finance forecast for HICP inflation in two thousand and twenty-six, transcribed by the CFP',
  'É a previsão do Ministério das Finanças para a inflação medida pelo índice harmonizado de preços no consumidor em dois mil e vinte e seis, na Proposta de Orçamento do Estado para dois mil e vinte e sete, como o CFP a transcreve. O parecer considera-a pouco provável.',
  'It is the Ministry of Finance forecast for inflation measured by the harmonised index of consumer prices in two thousand and twenty-six, in the Draft State Budget for two thousand and twenty-seven, as transcribed by the CFP. The opinion considers it unlikely.',
  L('name','IHPC'),L('document.title','Proposta de Orçamento do Estado para 2027'),L('excerpt','Fonte: MF'),L('excerpt','pouco provável')));
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
amaro.partes[0].pt+=prrPt;amaro.partes[0].en=amaro.partes[0].en.replace('exceptional RRP funding','exceptional Recovery and Resilience Plan (PRR) funding')+' The report describes the end of the plan’s exceptional funding cycle.';
amaro.partes[0].apoios.push(...apoioPrr);amaro.origens=['v2a-prr-saude','v2a-prr-ciclo'];amaro.complemento=comparacaoPrr;
const pcp=FAMILIAS_V2A.find(f=>f.chaves[0].startsWith('afirmacao-pcp-'));
pcp.partes[0].pt='Na intervenção publicada pelo PCP, Paulo Raimundo afirma: ';
pcp.partes[0].en='In the speech published by the PCP, Paulo Raimundo states: ';
pcp.complemento={pt:['«',{excerto:pcp.chaves[0]},'». No quadro das parcerias público-privadas, para ',{periodo:'oe-2027-ppp-rodoviario-encargos-brutos-2027'},', os encargos brutos rodoviários são ',{claim:'oe-2027-ppp-rodoviario-encargos-brutos-2027'},' milhões de euros e os líquidos são ',{claim:'oe-2027-ppp-rodoviario-encargos-liquidos-2027'},' milhões.'],en:['«',{excerto:pcp.chaves[0]},'». In the public-private partnership table, for ',{periodo:'oe-2027-ppp-rodoviario-encargos-brutos-2027'},', gross road charges are ',{claim:'oe-2027-ppp-rodoviario-encargos-brutos-2027'},' million euros and net charges are ',{claim:'oe-2027-ppp-rodoviario-encargos-liquidos-2027'},' million.']};
const rtp=FAMILIAS_V2A.find(f=>f.chaves[0].startsWith('afirmacao-rtp-'));
rtp.partes[0].pt='É a queda do orçamento da Saúde noticiada pela RTP. Os montantes da notícia identificam a despesa total consolidada do programa Saúde.';
rtp.partes[0].en='It is the Health budget decrease reported by RTP. The article’s amounts identify consolidated total expenditure for the Health programme.';

rtp.complemento={pt:[' A notícia é de ',{periodo:rtp.chaves[0]},' e refere-se ao orçamento para ',{periodo:'oe-2027-saude-despesa-total-consolidada-2027'},'.'],en:[' The article is dated ',{periodo:rtp.chaves[0]},' and concerns the budget for ',{periodo:'oe-2027-saude-despesa-total-consolidada-2027'},'.']};
