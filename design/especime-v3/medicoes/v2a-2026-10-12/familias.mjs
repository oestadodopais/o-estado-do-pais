/** V2-a: frases e nomes das medidas, com apoio nas palavras seladas. */
const minusculas=s=>s.charAt(0).toLowerCase()+s.slice(1);
const L=(campo,literal)=>({linha:'propria',campo,literal});
const familia=(chaves,pt,en,frase,phrase,...apoios)=>({chaves,nome:{pt,en},origens:[],partes:[{pt:frase,en:phrase,classe:'diz',apoios}]});
export const FAMILIAS_V2A=[];
for(const [stem,label,en] of [
  ['despesa-total-consolidada','Despesa total consolidada','Consolidated total expenditure'],
  ['despesa-efetiva-consolidada','Despesa efetiva consolidada','Consolidated effective expenditure'],
  ['despesa-efetiva-consolidada-sem-prr','Despesa efetiva consolidada sem PRR','Consolidated effective expenditure excluding the RRP'],
]) {
  const fonte=label.replace(' sem PRR','');
  FAMILIAS_V2A.push(familia(['oe-2027-saude-'+stem],label+' da conta do Programa Legado Saúde',en+' of the Health Legacy Programme Account',
    'É a '+minusculas(label)+' da conta do Programa Legado Saúde, na estimativa ou no orçamento indicado.',
    'It is '+minusculas(en)+' of the Health Legacy Programme Account, in the stated estimate or budget.',
    L('name',fonte),L('document.locator','Saúde (PL15), Conta do Pograma Legado'),L('document.locator',stem.endsWith('sem-prr')?'(Sem PRR)':'Quadro')));
  FAMILIAS_V2A.push(familia(['oe-2027-saude-'+stem+'-variacao'],'Variação da '+minusculas(label)+' da conta do Programa Legado Saúde',
    'Change in '+minusculas(en)+' of the Health Legacy Programme Account',
    'É a variação publicada da '+minusculas(label)+' da conta do Programa Legado Saúde: compara o orçamento com a estimativa do ano anterior, '+(stem.endsWith('sem-prr')?'sem PRR.':'incluindo PRR.'),
    'It is the published change in '+minusculas(en)+' of the Health Legacy Programme Account: the budget compared with the previous year’s estimate, '+(stem.endsWith('sem-prr')?'excluding the RRP.':'including the RRP.'),
    L('name',fonte),L('document.locator','Saúde (PL15), Conta do Pograma Legado'),L('document.locator','Variação'),L('ressalva','Compara o orçamento de 2027 com a estimativa de 2026')));
}
for(const [stem,label,en,fonte] of [
  ['rodoviario-encargos-brutos','Encargos brutos do setor rodoviário','Road sector gross charges','encargos brutos'],
  ['rodoviario-receitas','Receitas do setor rodoviário','Road sector revenue','receitas'],
  ['rodoviario-encargos-liquidos','Encargos líquidos do setor rodoviário','Road sector net charges','Rodoviário'],
  ['total-encargos-liquidos','Total dos encargos líquidos das parcerias público-privadas','Total net public-private partnership charges','Total'],
]) FAMILIAS_V2A.push(familia(['oe-2027-ppp-'+stem],label,en,
  'É o valor previsto para '+minusculas(label)+' no quadro das parcerias público-privadas.',
  'It is the projected value for '+minusculas(en)+' in the public-private partnership table.',
  L('name',fonte),L('document.locator','Quadro 4.25')));
FAMILIAS_V2A.push(familia(['oe-2027-cenario-pib-real-crescimento'],'Previsão do Ministério das Finanças para o crescimento real do produto interno bruto, transcrita pelo CFP',
  'Ministry of Finance forecast for real gross domestic product growth, transcribed by the CFP',
  'É a previsão do Ministério das Finanças para o crescimento real do produto interno bruto no Orçamento do Estado, como o CFP a transcreve. O parecer considera-a superior à de todas as instituições de referência.',
  'It is the Ministry of Finance forecast for real gross domestic product growth in the State Budget, as transcribed by the CFP. The opinion considers it higher than those of all reference institutions.',
  L('document.title','Previsões macroeconómicas'),L('excerpt','crescimento real'),L('excerpt','Fonte: MF'),L('excerpt','superior ao de todas as instituições de referência')));
FAMILIAS_V2A.push(familia(['oe-2027-cenario-ihpc'],'Previsão do Ministério das Finanças para a inflação medida pelo IHPC, transcrita pelo CFP',
  'Ministry of Finance forecast for HICP inflation, transcribed by the CFP',
  'É a previsão do Ministério das Finanças para a inflação medida pelo índice harmonizado de preços no consumidor no Orçamento do Estado, como o CFP a transcreve. O parecer considera-a pouco provável.',
  'It is the Ministry of Finance forecast for inflation measured by the harmonised index of consumer prices in the State Budget, as transcribed by the CFP. The opinion considers it unlikely.',
  L('name','IHPC'),L('document.title','Previsões macroeconómicas'),L('excerpt','Fonte: MF'),L('excerpt','pouco provável')));
for(const [id,pt,en,frase,phrase,literal] of [
 ['afirmacao-leitao-amaro-saude-oe2027-2026-10-09','Afirmação de Leitão Amaro sobre o orçamento da Saúde sem PRR','Leitão Amaro’s statement about the Health budget excluding the RRP',
  'É o aumento do orçamento da Saúde retirando a verba excecional do PRR, nas palavras do ministro da Presidência transcritas pela RTP.',
  'It is the increase in the Health budget excluding exceptional RRP funding, in the Minister of the Presidency’s words transcribed by RTP.', 'Se retirarmos isso, o orçamento da Saúde'],
 ['afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09','Afirmação de Paulo Raimundo sobre as parcerias rodoviárias','Paulo Raimundo’s statement about road partnerships',
  'É o montante que o orçamento entrega às parcerias público-privadas rodoviárias, nas palavras da intervenção de Paulo Raimundo publicada pelo PCP.',
  'It is the amount the budget allocates to road public-private partnerships, in Paulo Raimundo’s speech published by the PCP.', 'parcerias público-privadas rodoviárias'],
 ['afirmacao-rtp-saude-queda-oe2027-2026-10-09','Queda do orçamento da Saúde noticiada pela RTP','Health budget decrease reported by RTP',
  'É a queda do orçamento da Saúde noticiada pela RTP. A notícia alojada não explicita se a despesa é total ou efetiva.',
  'It is the Health budget decrease reported by RTP. The hosted article does not specify whether the expenditure is total or effective.', 'O orçamento para Saúde sofre um corte'],
]) FAMILIAS_V2A.push(familia([id],pt,en,frase,phrase,L('excerpt',literal)));
