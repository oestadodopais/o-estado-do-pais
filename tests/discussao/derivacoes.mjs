/** V2-d: as contas do mandato, refeitas sem usar o resolvedor do livro. */
const numero=x=>String(x??'').trim()?Number(String(x).replace(/[\s  ]/g,'').replace('−','-').replace(',','.')):NaN;
const diferenca=(a,b)=>a-b;
const percentagem=(a,b)=>(a/b-1)*100;
const s='oe-2027-saude-';
const total=ano=>s+'despesa-total-consolidada-'+ano;
const efetiva=ano=>s+'despesa-efetiva-consolidada-'+ano;
const semPrr=ano=>s+'despesa-efetiva-consolidada-sem-prr-'+ano;
const estrada='oe-2027-ppp-rodoviario-encargos-';
const regra=(id,componentes,conta,casas=1)=>({id,componentes,conta,casas});
export const DERIVACOES=[
 ...['pessoal','bens-servicos','investimento','outras-correntes'].map(r=>regra(`der-saude-${r}-variacao-abs`,[s+r+'-2027',s+r+'-2026'],diferenca)),
 regra('der-saude-variacao-total-abs',[total(2027),total(2026)],diferenca),
 regra('der-saude-reforco-total-2026',[total(2026),'saude-total-2026-orcamento-oe2026'],diferenca),
 ...['bens-servicos','investimento'].map(r=>regra(`der-saude-${r}-reducao-abs`,[s+r+'-2026',s+r+'-2027'],diferenca)),
 regra('der-saude-total-reducao-abs',[total(2026),total(2027)],diferenca),
 regra('der-saude-receitas-proprias-variacao-pct',[s+'fonte-receitas-proprias-2027',s+'fonte-receitas-proprias-2026'],percentagem),
 regra('der-saude-2027-vs-execucao-2025-pct',[total(2027),'saude-total-2025-execucao-cge2025'],percentagem),
 regra('der-ppp-brutos-todos-2027',[estrada+'brutos-2027','ppp-oe2027-ferroviario-2027','ppp-oe2027-saude-2027'],(...v)=>v.reduce((a,b)=>a+b,0),0),
 regra('der-ppp-quota-rodoviario',[estrada+'liquidos-2027','oe-2027-ppp-total-encargos-liquidos-2027'],(a,b)=>a/b*100,2),
 regra('der-ppp-rodoviario-2027-vs-2021-pct',[estrada+'liquidos-2027','ppp-oe2022-liquidos-2021'],percentagem),
 ...['brutos','liquidos'].map(r=>regra(`der-ppp-pcp-vs-${r}`,['afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09',estrada+r+'-2027'],diferenca,0)),
 regra('der-utao-saude-reforco-2026',['utao-saude-efetiva-2026-estimativa','utao-saude-efetiva-2026-orcamento'],diferenca,0),
 ...['saude','educacao','trabalho-solidariedade-e-seguranca-social','infraestruturas-e-habitacao','justica','seguranca-interna','financas','economia','coesao-territorial'].map(r=>regra(`der-${r}-variacao-sem-prr-pct`,r==='saude'?[semPrr(2027),semPrr(2026)]:[`oe-2027-${r}-sem-prr-2027`,`oe-2027-${r}-sem-prr-2026`],percentagem)),
 ...['financas','economia','infraestruturas-e-habitacao','ambiente-e-energia'].map(r=>regra(`der-${r}-prr-2026`,[`oe-2027-${r}-efetiva-2026`,`oe-2027-${r}-sem-prr-2026`],diferenca)),
 regra('der-saude-prr-2026',[efetiva(2026),semPrr(2026)],diferenca),
 regra('der-saude-variacao-sem-prr',[semPrr(2027),semPrr(2026)],diferenca),
 regra('der-saude-variacao-efetiva',[efetiva(2027),efetiva(2026)],diferenca),
 regra('der-saude-razao-compensacao-prr',['der-saude-variacao-sem-prr','der-saude-prr-2026'],(a,b)=>a/b,4),
 regra('der-saude-razao-compensacao-prr-pct',['der-saude-variacao-sem-prr','der-saude-prr-2026'],(a,b)=>a/b*100),
];
export function conferirDerivacoes(linhas){
 const erros=[];
 for(const {id,componentes,conta,casas} of DERIVACOES){
  const linha=linhas.get(id), valores=componentes.map(c=>linhas.has(c)?numero(linhas.get(c).value):NaN);
  if(!linha||valores.some(v=>!Number.isFinite(v))){erros.push(`V2D derivação: ${id} sem linha ou componente numérica`);continue;}
  const calculado=Number(conta(...valores).toFixed(casas));
  if(!Number.isFinite(calculado)||!Number.isFinite(numero(linha.value))||Math.abs(numero(linha.value)-calculado)>1e-8)erros.push(`V2D derivação: ${id} não bate com as componentes (${calculado})`);
  if(JSON.stringify([...(linha.derived_from??[])].sort())!==JSON.stringify([...componentes].sort()))erros.push(`V2D derivação: ${id} declara componentes diferentes da conta`);
  if(!linha.derivation?.trim()||!linha.derivation_en?.trim())erros.push(`V2D derivação: ${id} não explica a conta nas duas edições`);
 }
 for(const id of ['utao-risco-execucao-sns-2027','utao-ppp-contingencias-natureza-2026','oe-2027-outras-despesas-dotacoes-execucao','oe-2027-saude-dotacao-reforco-contratos-programa','oe-2027-saude-contrato-programa-acss']){
  const l=linhas.get(id);
  if(!l||l.afirmacao!==true||l.unit!=='afirmação'||l.value!==l.excerpt)erros.push(`V2D afirmação textual: ${id} não preserva o excerto como valor`);
 }
 for(const l of linhas.values()){
  if(l.afirmacao && l.document?.title==='Orçamento do Estado 2027 · Relatório' && (l.reference_date!=='2027'||l.published_at!=='2026-10-08'))erros.push(`V2D período textual: ${l.id} confunde orçamento e publicação`);
 }
 const acss=linhas.get('oe-2027-saude-contrato-programa-acss');
 if(!acss?.excerpt?.startsWith('Do total da despesa consolidada afeta ao Programa Legado,')||!acss.excerpt.includes('receitas de impostos (15 452,2 milhões de euros). Neste montante incluem-se'))erros.push('V2D antecedente: o recibo da ACSS omite o montante a que se refere');
 for(let ano=2020;ano<=2025;ano++){
  const inicial=linhas.get(`saude-total-${ano}-orcamento-oe${ano}`),execucao=linhas.get(`saude-total-${ano}-execucao-cge${ano}`);
  if(!inicial||!execucao||inicial.reference_date!==String(ano)||execucao.reference_date!==String(ano)||!(numero(execucao.value)>numero(inicial.value)))erros.push(`V2D série: orçamento inicial e execução de ${ano} não sustentam «todos os anos»`);
 }
 return erros;
}
export function plantasDasDerivacoes(linhas){
 const id='der-ppp-brutos-todos-2027';
 return [
  ['número derivado não bate com as componentes',c=>{c.get(id).value=String(numero(c.get(id).value)+1);}],
  ['componente da derivação trocada',c=>{c.get(id).derived_from[0]='oe-2027-ppp-rodoviario-encargos-liquidos-2027';}],
  ['período textual trocado pela publicação',c=>{c.get('oe-2027-saude-dotacao-reforco-contratos-programa').reference_date='2026-10-08';}],
  ['antecedente do recibo da ACSS retirado',c=>{const l=c.get('oe-2027-saude-contrato-programa-acss');l.value=l.excerpt=l.excerpt.slice(l.excerpt.indexOf('Neste montante'));}],
  ['afirmação textual com número inventado',c=>{c.get('utao-risco-execucao-sns-2027').value='42';}],
  ['execução anual abaixo do orçamento inicial',c=>{c.get('saude-total-2022-execucao-cge2022').value='0';}],
 ].map(([nome,estraga])=>{
  const copia=new Map([...linhas].map(([k,v])=>[k,structuredClone(v)]));
  if(!copia.has(id))return {nome,mordeu:false,queixa:'Linha da planta ausente'};
  estraga(copia);
  const queixa=conferirDerivacoes(copia).find(e=>nome.startsWith('período')?e.includes('V2D período textual'):nome.startsWith('execução')?e.includes('V2D série'):nome.startsWith('afirmação')?e.includes('V2D afirmação textual'):e.includes(id))??null;
  return {nome,mordeu:queixa!==null,queixa};
 });
}
