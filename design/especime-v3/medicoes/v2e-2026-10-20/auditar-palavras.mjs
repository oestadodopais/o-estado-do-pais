/** Regenera a auditoria V2-e-b a partir das frases e dos campos selados. */
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const importar=p=>import(pathToFileURL(process.cwd()+'/'+p).href);
const {ITENS}=await importar('src/data/discussao.mjs');
const {loadClaims}=await importar('src/lib/ledger.mjs');
const {folhasDaExplicacao,linhasDaExplicacao,conferirAuditoriaDasExplicacoes}=await importar('tests/explicacoes/explicacao.mjs');
const linhas=loadClaims();
const serie=Array.from({length:6},(_,i)=>i+2020).flatMap(a=>[`saude-total-${a}-orcamento-oe${a}`,`saude-total-${a}-execucao-cge${a}`]);
const saude='oe-2027-saude-';
const apoiosSaude={
 titulo:[saude+'despesa-efetiva-consolidada-sem-prr-variacao',saude+'despesa-total-consolidada-variacao'],
 '1.0':[saude+'despesa-total-consolidada-2027'],
 '1.4':serie,
 '2.2':['oe-2027-saude-dotacao-reforco-contratos-programa','oe-2027-saude-contrato-programa-acss',saude+'pessoal-2027',saude+'bens-servicos-2027',saude+'investimento-2027',saude+'outras-correntes-2027',saude+'fonte-receitas-proprias-2027',saude+'fonte-fundos-europeus-2027'],
 '3.0':[...serie,saude+'pessoal-2027',saude+'bens-servicos-2027',saude+'investimento-2027'],
 '4.0':[...serie,'utao-risco-execucao-sns-2027'],
 '5.0':['oe-2027-saude-dotacao-reforco-contratos-programa','oe-2027-saude-contrato-programa-acss',...serie,'afirmacao-leitao-amaro-saude-oe2027-2026-10-09','afirmacao-rtp-saude-queda-oe2027-2026-10-09','der-saude-prr-2026','der-saude-pessoal-variacao-abs','der-saude-bens-servicos-reducao-abs','der-saude-investimento-reducao-abs','der-saude-receitas-proprias-variacao-pct','oe-2027-saude-outras-correntes-2026','oe-2027-saude-outras-correntes-2027','utao-risco-execucao-sns-2027'],
};
const apoiosPpp={
 titulo:['oe-2027-ppp-rodoviario-encargos-liquidos-2027','ppp-oe2027-riscos-pedidos-rodoviarios'],
 '1.0':['oe-2027-ppp-total-encargos-liquidos-2027'],
 '4.0':['ppp-oe2027-riscos-brisa','ppp-oe2027-riscos-pedidos-rodoviarios','ppp-oe2027-liquidos-2040','utao-ppp-contingencias-natureza-2026'],
 '5.0':['oe-2027-ppp-rodoviario-encargos-brutos-2027','der-ppp-brutos-todos-2027','afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09','afirmacao-pcp-paula-ppp-2026-10-12','ppp-oe2027-riscos-brisa','ppp-oe2027-riscos-pedidos-rodoviarios','utao-ppp-contingencias-natureza-2026'],
};
const descricoes={
 'saude-no-orcamento':[
 ['Atribuições, citações e datas literais dos três intervenientes.'],
 ['Identificação do quadro, do programa e da unidade.', 'As três bases de comparação da despesa, sem as confundir.', 'Composição económica do programa e variações com e sem PRR.', 'Financiamento entre orçamentos e transferências para o SNS.', 'Comparação orçamento e execução dentro de cada um dos seis anos, com as duas bases de reforço de 2026 distintas.', 'Execução acumulada até agosto e saldo do SNS no mesmo período.', 'Comparação europeia pelas mesmas unidades, ano e regimes de financiamento.'],
 ['Coincidência de cada afirmação com uma linha, e confirmação da UTAO.', 'Substituição parcial da despesa PRR pela despesa fora do PRR; igualdade das bases em 2027.', 'Variações nas rubricas e fontes de financiamento; explicação da dotação sem montante declarado e dos contratos-programa, apoiada na nota 26 e na frase inteira sobre a ACSS da página 303, conservadas nos recibos.', 'Comparação entre programas, sem confundir sem PRR com financiamento nacional.', 'Orçamento, estimativa e execução com períodos distintos e risco descrito pela UTAO.'],
 ['Conclusão editorial sobre os perímetros, composição e insuficiência histórica dos orçamentos iniciais.'],
 ['Recomendação editorial de acompanhar a execução e o risco de reforço; não constitui previsão certa.'],
 ['Opinião expressamente rotulada sobre a seleção dos perímetros, a composição, receitas e risco de execução.']
 ],
 'parcerias-rodoviarias':[
 ['Citações do PCP, atribuições e datas na ordem cronológica.'],
 ['Identificação do quadro, setores, ano e unidade.', 'Brutos, receitas, líquidos e soma dos setores, com a ressalva do total impresso.', 'Série dos encargos rodoviários, conservando execução, estimativas e orçamento.', 'Projeções contratuais e ano em que as receitas excedem encargos.', 'Revisão da previsão para o mesmo ano e fatores que o relatório lhe atribui.', 'Pedidos e litígios fora da previsão de encargos, com a natureza contingente explicitada pela UTAO.'],
 ['Diferença entre a afirmação e as duas medidas rodoviárias.', 'Aproximação à soma dos setores, sem provar a conta do autor, e alargamento posterior da formulação do PCP.', 'Comparação temporal, subida líquida face a 2025 apesar da descida dos encargos brutos, e maior descida das receitas previstas.', 'Pedidos pendentes comparados com os valores anuais, sem os tratar como pagamentos certos.'],
 ['Conclusão editorial sobre encargos contratados, aproximação numérica e riscos contingentes.'],
 ['Recomendação editorial de acompanhar a negociação e os litígios nas fontes de risco.'],
 ['Opinião expressamente rotulada sobre a abrangência da afirmação e a separação entre encargos e riscos.']
 ]
};
const efeitosSaude=['sns-sem-medico-serie-nova-2026-08','der-sns-lista-cirurgia-variacao-pct','der-infarmed-variacao-pct','der-prr-saude-por-pagar-pct','der-sns-divida-fornecedores-2026-07'];
for(const key of ['3.0','4.0','5.0'])apoiosSaude[key].push(...efeitosSaude);
apoiosSaude['1.9']=['prr-complemento-p4-1-40-estado'];
apoiosPpp['1.6']=['alargamentos','investimentos-previstos','equilibrio','comparticipacoes','braga','investimentos-novos','limites','qualidade'].map(s=>'pe-despacho-'+s);
apoiosPpp['3.0']=['pe-scut-vigencia','pe-dl87a-financiamento','pe-dl87a-apoio-retificado','pe-oe-apoio-dl87a','pe-brisa-prazo-minuta','pe-oe-riscos-nao-reconhecimento',...apoiosPpp['1.6']];
apoiosPpp['5.0'].push('pe-oe-beira-abolicao');
apoiosPpp['1.7']=['pe-scut-trocos'];
descricoes['saude-no-orcamento'][1].push('Acesso e atividade do SNS, com as séries de médico de família e os períodos distintos.','Encargos com medicamentos e três medidas distintas de dívida e regularização.','Pagamentos do PRR e estados dos marcos, sem inferir execução física.');
descricoes['saude-no-orcamento'][2].push('Composição orçamental ao lado de encargos com medicamentos, pagamentos do PRR e acesso ao serviço.');
descricoes['parcerias-rodoviarias'][1].push('Prazo contratual e oito tarefas da negociação, com não reconhecimento dos pedidos.','Eliminação de portagens e apoio pela diferença entre a atualização limitada e a de referência do decreto, com a definição retificada, a salvaguarda dos descontos, o financiamento pelo Orçamento do Estado, a inclusão nos encargos brutos e a negociação da Beira Interior.');
function tokens(x,out=[]){if(Array.isArray(x))x.forEach(y=>tokens(y,out));else if(x&&typeof x==='object'){for(const k of ['claim','literal','periodo','nome','selo'])if(typeof x[k]==='string')out.push({id:x[k],campo:k==='periodo'?(linhas.get(x[k])?.period?'period':'reference_date'):null});for(const [k,v] of Object.entries(x))if(!['claim','literal','periodo','nome','selo'].includes(k))tokens(v,out);}return out;}
function apoio(id,campo){const l=linhas.get(id);if(!l)throw new Error('Linha ainda não exportada: '+id);campo??=l.derivation?'derivation':'excerpt';const literal=l[campo];if(typeof literal!=='string'||literal.trim().length<4)throw new Error('Campo sem apoio: '+id+'.'+campo);return {linha:id,campo,literal};}
function partesDaComparacao(parte){
 const frases=[
  ['é nesta rubrica que fica, para a Saúde, a dotação para reforçar os contratos-programa ainda por fechar','this line is where the provision to reinforce the contract-programmes still to be closed sits for Health','oe-2027-saude-dotacao-reforco-contratos-programa'],
  ['os acordos entre a Administração Central do Sistema de Saúde e as entidades do Serviço Nacional de Saúde',"the agreements between the Central Administration of the Health System and the National Health Service's entities",'oe-2027-saude-contrato-programa-acss'],
 ];
 if(!parte.pt.includes(frases[0][0]))return [parte];
 const partes=[];let pt=parte.pt,en=parte.en;
 for(const [frasePt,fraseEn,id] of frases){
  const a=pt.indexOf(frasePt),b=en.indexOf(fraseEn);
  if(a<0||b<0)throw new Error('Frase fixa da comparação ausente');
  partes.push({...parte,pt:pt.slice(0,a),en:en.slice(0,b)});
  partes.push({...parte,pt:frasePt,en:fraseEn,sobre:'Apoio declarado para esta frase fixa.',apoios:[apoio(id,'excerpt')]});
  pt=pt.slice(a+frasePt.length);en=en.slice(b+fraseEn.length);
 }
 partes.push({...parte,pt,en});
 return partes;
}
const auditoria={explicacoes:ITENS.map(e=>{
 const extras=e.slug==='saude-no-orcamento'?apoiosSaude:apoiosPpp;
 const permitidas=linhasDaExplicacao(e,linhas);
 return {slug:e.slug,origens:[],folhas:folhasDaExplicacao(e).map(f=>{
  const m=/^seccoes\[(\d+)\](?:\.conteudo\[(\d+)\])?/.exec(f.caminho);
  const sec=m?+m[1]:null,par=m?.[2]===undefined?null:+m[2];
  const chave=sec===null?'titulo':`${sec}.${par??0}`;
  const bloco=sec===null?e.titulo.pt:e.seccoes[sec].conteudo[par??0].paragrafo.pt;
  let refs=tokens(bloco);
  refs.push(...(extras[chave]??[]).map(id=>({id,campo:null})));
  if(!refs.length)refs=(extras.titulo??[]).map(id=>({id,campo:null}));
  const unicas=new Map();for(const r of refs){if(!permitidas.has(r.id))throw new Error('Apoio fora do inventário: '+r.id);const a=apoio(r.id,r.campo);unicas.set(a.linha+'.'+a.campo,a);}
  const sobre=sec===null?'Leitura editorial dos valores e dos perímetros que o título anuncia.':descricoes[e.slug][sec][par??0];
  const parte={pt:f.pt,en:f.en,classe:'leitura',sobre,apoios:[...unicas.values()]};
  if(e.slug==='parcerias-rodoviarias'&&chave==='1.7'&&f.pt.includes('sete autoestradas')){
   const literal=linhas.get('pe-scut-trocos').excerpt;
   const alineas=[...literal.matchAll(/(?:^|\s)([a-g])\)/g)].map(m=>m[1]);
   if(alineas.join('')!=='abcdefg')throw new Error('V2EC: sete sem as alíneas a) a g)');
   parte.sobre='Sete é a contagem conferida das alíneas a) a g) do excerto de pe-scut-trocos; cada alínea enumera uma autoestrada.';
   parte.apoios=[apoio('pe-scut-trocos','excerpt')];
  }
  return {...f,partes:e.slug==='saude-no-orcamento'&&chave==='2.2'?partesDaComparacao(parte):[parte]};
 })};
})};
const r=conferirAuditoriaDasExplicacoes({auditoria,explicacoes:ITENS,linhas});
if(r.erros.length)throw new Error(r.erros.join('\n'));
fs.writeFileSync('tests/discussao/palavras.json',JSON.stringify(auditoria,null,2)+'\n');
console.log(JSON.stringify(r.contas));
