/** V2-a: frases e nomes das medidas, com apoio nas palavras seladas. */
const L=(campo,literal)=>({linha:'propria',campo,literal});
const familia=(chaves,pt,en,frase,phrase,...apoios)=>({chaves,nome:{pt,en},origens:[],partes:[{pt:frase,en:phrase,classe:'diz',apoios}]});
export const FAMILIAS_V2A=[];
for(const [stem,label,en] of [
  ['despesa-total-consolidada','Despesa total consolidada','Consolidated total expenditure'],
  ['despesa-efetiva-consolidada','Despesa efetiva consolidada','Consolidated effective expenditure'],
  ['despesa-efetiva-consolidada-sem-prr','Despesa efetiva consolidada sem PRR','Consolidated effective expenditure excluding the RRP'],
]) {
  const fonte=label.replace(' sem PRR','');
  FAMILIAS_V2A.push(familia(['oe-2027-saude-'+stem],label+' do programa Saúde',en+' of the Health programme',
    'É a '+label.toLowerCase()+' do programa Saúde, na estimativa ou no orçamento indicado.',
    'It is '+en.toLowerCase()+' of the Health programme, in the stated estimate or budget.',
    L('name',fonte),L('document.locator','programa Saúde'),L('document.locator',stem.endsWith('sem-prr')?'(Sem PRR)':'Quadro')));
  FAMILIAS_V2A.push(familia(['oe-2027-saude-'+stem+'-variacao'],'Variação da '+label.toLowerCase()+' do programa Saúde',
    'Change in '+en.toLowerCase()+' of the Health programme',
    'É a variação publicada da '+label.toLowerCase()+' do programa Saúde.',
    'It is the published change in '+en.toLowerCase()+' of the Health programme.',
    L('name',fonte),L('document.locator','programa Saúde'),L('document.locator','Variação')));
}
for(const [stem,label,en,fonte] of [
  ['rodoviario-encargos-brutos','Encargos brutos do setor rodoviário','Road sector gross charges','encargos brutos'],
  ['rodoviario-receitas','Receitas do setor rodoviário','Road sector revenue','receitas'],
  ['rodoviario-encargos-liquidos','Encargos líquidos do setor rodoviário','Road sector net charges','Rodoviário'],
  ['total-encargos-liquidos','Total dos encargos líquidos das parcerias público-privadas','Total net public-private partnership charges','Total'],
]) FAMILIAS_V2A.push(familia(['oe-2027-ppp-'+stem],label,en,
  'É o valor previsto para '+label.toLowerCase()+' no quadro das parcerias público-privadas.',
  'It is the projected value for '+en.toLowerCase()+' in the public-private partnership table.',
  L('name',fonte),L('document.locator','Quadro 4.25')));
FAMILIAS_V2A.push(familia(['oe-2027-cenario-pib-real-crescimento'],'Crescimento real do produto interno bruto previsto para Portugal',
  'Forecast real gross domestic product growth for Portugal',
  'É a taxa de crescimento real do produto interno bruto no cenário de previsões macroeconómicas.',
  'It is the real gross domestic product growth rate in the macroeconomic forecast scenario.',
  L('document.title','Previsões macroeconómicas'),L('excerpt','crescimento real')));
FAMILIAS_V2A.push(familia(['oe-2027-cenario-ihpc'],'Variação do índice harmonizado de preços no consumidor prevista para Portugal',
  'Forecast change in the harmonised index of consumer prices for Portugal',
  'É a taxa do índice harmonizado de preços no consumidor no cenário de previsões macroeconómicas.',
  'It is the harmonised index of consumer prices rate in the macroeconomic forecast scenario.',
  L('name','IHPC'),L('document.title','Previsões macroeconómicas')));
for(const [id,pt,en,literal] of [
 ['afirmacao-leitao-amaro-saude-oe2027-2026-10-09','Afirmação de Leitão Amaro sobre o orçamento da Saúde','Leitão Amaro’s statement about the Health budget','orçamento da Saúde'],
 ['afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09','Afirmação de Paulo Raimundo sobre as parcerias rodoviárias','Paulo Raimundo’s statement about road partnerships','parcerias público-privadas rodoviárias'],
 ['afirmacao-rtp-saude-queda-oe2027-2026-10-09','Queda do orçamento da Saúde noticiada pela RTP','Health budget decrease reported by RTP','Cai'],
]) FAMILIAS_V2A.push(familia([id],pt,en,
 'É o valor publicado na afirmação citada, com a atribuição que o documento apresenta.',
 'It is the value published in the quoted statement, with the attribution given by the document.',
 L('excerpt',literal==='Cai'?'Cai 1,5 por cento':literal)));
