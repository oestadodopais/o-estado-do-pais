/** Regenera a auditoria V2-d a partir das frases e dos campos selados. */
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
 '2.2':[saude+'pessoal-2027',saude+'bens-servicos-2027',saude+'investimento-2027',saude+'outras-correntes-2027',saude+'fonte-receitas-proprias-2027',saude+'fonte-fundos-europeus-2027'],
 '3.0':[...serie,saude+'pessoal-2027',saude+'bens-servicos-2027',saude+'investimento-2027'],
 '4.0':[...serie,'utao-risco-execucao-sns-2027'],
 '5.0':[...serie,'afirmacao-leitao-amaro-saude-oe2027-2026-10-09','afirmacao-rtp-saude-queda-oe2027-2026-10-09','der-saude-prr-2026','der-saude-pessoal-variacao-abs','der-saude-bens-servicos-reducao-abs','der-saude-investimento-reducao-abs','der-saude-receitas-proprias-variacao-pct','oe-2027-saude-outras-correntes-2026','oe-2027-saude-outras-correntes-2027','utao-risco-execucao-sns-2027'],
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
 ['Coincidência de cada afirmação com uma linha, e confirmação da UTAO.', 'Substituição parcial da despesa PRR pela despesa fora do PRR; igualdade das bases em 2027.', 'Variações nas rubricas e fontes de financiamento; a explicação das reservas refere-se ao conjunto das administrações públicas; o programa Saúde inscreve uma ação de reserva orçamental.', 'Comparação entre programas, sem confundir sem PRR com financiamento nacional.', 'Orçamento, estimativa e execução com períodos distintos e risco descrito pela UTAO.'],
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
function tokens(x,out=[]){if(Array.isArray(x))x.forEach(y=>tokens(y,out));else if(x&&typeof x==='object'){for(const k of ['claim','literal','periodo','nome'])if(typeof x[k]==='string')out.push({id:x[k],campo:k==='periodo'?'reference_date':null});for(const [k,v] of Object.entries(x))if(!['claim','literal','periodo','nome'].includes(k))tokens(v,out);}return out;}
function apoio(id,campo){const l=linhas.get(id);if(!l)throw new Error('Linha ainda não exportada: '+id);campo??=l.derivation?'derivation':'excerpt';const literal=l[campo];if(typeof literal!=='string'||literal.trim().length<4)throw new Error('Campo sem apoio: '+id+'.'+campo);return {linha:id,campo,literal};}
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
  return {...f,partes:[{pt:f.pt,en:f.en,classe:'leitura',sobre,apoios:[...unicas.values()]}]};
 })};
})};
const r=conferirAuditoriaDasExplicacoes({auditoria,explicacoes:ITENS,linhas});
if(r.erros.length)throw new Error(r.erros.join('\n'));
fs.writeFileSync('tests/discussao/palavras.json',JSON.stringify(auditoria,null,2)+'\n');
console.log(JSON.stringify(r.contas));
