/** EX3: acrescenta apenas as famílias e a auditoria deste bloco. */
import fs from 'node:fs';
import {FAMILIAS_EX3} from './familias.mjs';
import {DINHEIRO_DO_ESTADO_2026 as e} from '../../../../src/data/explicacoes/dinheiro-do-estado-2026.mjs';
import {folhasDaExplicacao,conferirAuditoriaDasExplicacoes} from '../../../../tests/explicacoes/explicacao.mjs';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {ORIGENS_DAS_DEFINICOES as origens} from '../../../../src/data/figuras.mjs';
const root=new URL('../../../../',import.meta.url);
const read=f=>fs.readFileSync(new URL(f,root),'utf8');
const write=(f,s)=>fs.writeFileSync(new URL(f,root),s);
const a=JSON.parse(read('tests/cartao/leituras-provadas.json'));
const linhas=loadClaims();
const L=(linha,campo,literal)=>({linha,campo,literal});
const O=(origem,campo,literal)=>({origem,campo,literal});
const f='oe-2026-cem-euros-funcao-02',u='despesa-por-funcao-2024-gf02-pt';
const glosa=a.familias.find(x=>x.chaves?.includes(f)).folhas[0].partes.at(-1).apoios;
const fun=[...glosa,L(f,'derivation','despesa efetiva consolidada da administração central'),O('dados-gov-oe-despesa-funcional','excerto','contabilidade pública')];
const euro=[L(u,'ressalva','contabilidade nacional, incluindo as administrações regional e local'),L(u,'unit','% do PIB'),O('eurostat-cofog-divisao-01','documento','General government expenditure by function (COFOG)')];
const ministerios=[L('oe-2026-cem-euros-ministerio-financas','derivation','pela «DESPESA TOTAL» do MAPA 4'),...['rp4n-total-ministerios','rp4n-mapa-ministerios','rp4n-consolidada-ministerios'].map(k=>O(k,'excerto',origens[k].excerto))];
const def=O('nato-definicao-despesa-defesa','excertoEn',origens['nato-definicao-despesa-defesa'].excertoEn.split('\n')[0]);
const pensoes=O('nato-definicao-despesa-defesa','excertoEn',origens['nato-definicao-despesa-defesa'].excertoEn.split('\n')[2]);
const ligaDef=O('nato-definicao-despesa-defesa','excertoEn',origens['nato-definicao-despesa-defesa'].excertoEn.split('\n')[1]);
const nato=(kind,year='2026')=>L(`nato-defesa-portugal-${kind}-${year}`,'excerpt',kind==='pib'?'Based on 2021 prices':'Current prices');
const estimativa=(year,kind='pib')=>L(`nato-defesa-portugal-${kind}-${year}`,'excerpt','Figures for 2025 and 2026 are estimates.');
const anterior=a.explicacoes.find(x=>x.slug===e.slug);
const diz=(pt,en,apoios)=>({pt,en,classe:'diz',apoios});
const leitura=(pt,en,apoios,sobre)=>({pt,en,classe:'leitura',sobre,apoios});
const folhas=folhasDaExplicacao(e).map(folha=>{
 const velha=anterior.folhas.find(x=>x.caminho===folha.caminho&&x.pt===folha.pt&&x.en===folha.en);
 if(velha&&!folha.caminho.startsWith('seccoes[0].conteudo[2]'))return velha;
 const {caminho,pt,en}=folha;let partes;
 if(caminho.startsWith('seccoes[0].conteudo[2]')){
  const idx=Number(caminho.match(/paragrafo\[(\d+)\]/)[1]);
  const pib=year=>L(`nato-defesa-portugal-pib-${year}`,'excerpt','as a share of GDP');
  const ano=(kind,year)=>({linha:`nato-defesa-portugal-${kind}-${year}`,campo:'reference_date',forma:'ano'});
  if(idx>=19){
   const ids={19:['nato-compromisso-gales-2014','nato-compromisso-haia-2035'],20:['nato-compromisso-gales-2014'],21:['nato-compromisso-gales-2014'],23:['nato-cimeira-haia-2025','nato-compromisso-gales-2014'],25:['nato-cimeira-haia-2025'],26:['nato-compromisso-haia-2035'],27:['nato-compromisso-haia-2035'],29:['nato-compromisso-haia-essencial-2035'],30:['nato-compromisso-haia-essencial-2035'],31:['nato-compromisso-haia-essencial-2035']};
   if(!ids[idx])throw Error('Parte do compromisso sem apoio: '+caminho);
   partes=[diz(pt,en,ids[idx].map(id=>L(id,'excerpt',linhas.get(id).excerpt)))];
  }else if(idx===2){
   const x=pt.indexOf(' A despesa em defesa'),y=en.indexOf(' Defence spending');
   const z=pt.indexOf('; a definição da NATO'),w=en.indexOf("; NATO's definition");
   const v=pt.indexOf(' Para Portugal,'),q=en.indexOf(' For Portugal,');
   partes=[diz(pt.slice(0,x),en.slice(0,y),fun),diz(pt.slice(x,z),en.slice(y,w),[def,ligaDef]),diz(pt.slice(z,v),en.slice(w,q),[pensoes]),diz(pt.slice(v),en.slice(q),[pib('2024')])];
  }else{
   const apoios={3:[pib('2024')],4:[pib('2024'),ano('pib','2024')],6:[estimativa('2025'),estimativa('2026')],7:[pib('2025')],8:[ano('pib','2025')],11:[pib('2026')],12:[ano('pib','2026')],14:[nato('pib')],16:[L('nato-defesa-portugal-eur-2026','excerpt','Million national currency units'),ano('eur','2026')],18:[nato('eur'),estimativa('2026','eur')]};
   if([0,10].includes(idx))partes=[{pt,en,classe:'liga'}];
   else if(apoios[idx])partes=[diz(pt,en,apoios[idx])];
   else throw Error('Parte P1 sem apoio específico: '+caminho);
  }
 }else if(caminho.startsWith('seccoes[0].conteudo[3]')){
  const idx=Number(caminho.match(/paragrafo\[(\d+)\]/)[1]);
  if(idx>=27){
   const nat=nato('pib','2024');
   if(idx===27){
    const x=pt.indexOf(', e a da NATO'),y=en.indexOf(", and NATO's");
    partes=[leitura(pt.slice(0,x),en.slice(0,y),euro,'A função e o setor das contas nacionais do Eurostat.'),leitura(pt.slice(x),en.slice(y),[def,pensoes,nat],'A definição da NATO inclui pensões e difere do perímetro do Eurostat.')];
   }else if(idx===29)partes=[diz(pt,en,[nat])];
   else if(idx===30||idx===31)partes=[diz(pt,en,[L('nato-defesa-portugal-pib-2024','excerpt','as a share of GDP'),...euro])];
   else if(idx===32)partes=[diz(pt,en,euro)];
   else partes=[leitura(pt,en,[...euro,nat,def,pensoes],'A declaração apresenta as duas medidas e não contém tokens de soma ou correção entre elas.')];
  }else{
  const nome=pt.match(/(?:^: |^, |^ e )(.+?) $/);
  if(nome && Number(caminho.match(/\[(\d+)\]$/)[1])<=20){
   const idx=Number(caminho.match(/\[(\d+)\]$/)[1]);const n=idx/2;
   const id=`despesa-por-funcao-2024-gf${String(n).padStart(2,'0')}-pt`;
   partes=[diz(pt,en,[L(id,'name',linhas.get(id).name),L(`oe-2026-cem-euros-funcao-${String(n).padStart(2,'0')}`,'nome',nome[1])])];
  }else if(pt===' e usam o PIB como denominador. As fatias por função do Orçamento referem-se a '||pt.startsWith(' e usam a despesa'))partes=[leitura(pt,en,[...fun,...euro],'Períodos, denominadores, perímetros e bases contabilísticas das linhas comparadas.')];
  else partes=[diz(pt,en,euro)];
  }
 }else if(caminho.startsWith('abertura')){
  const antiga=anterior.folhas.find(x=>x.caminho===caminho);partes=structuredClone(antiga.partes);
  const last=partes.at(-1);const antesPt=partes.slice(0,-1).map(x=>x.pt).join(''),antesEn=partes.slice(0,-1).map(x=>x.en).join('');
  last.pt=pt.slice(antesPt.length);last.en=en.slice(antesEn.length);last.apoios.push(...fun);
 }else if(caminho.includes('seccoes[1]'))partes=[leitura(pt,en,ministerios,'O denominador é a despesa total antes da consolidação no mapa dos ministérios.')];
 else if(caminho.endsWith('figura.titulo'))partes=[diz(pt,en,fun)];
 else throw Error('Folha EX3 sem auditoria: '+caminho);
 return {caminho,pt,en,partes};
});
anterior.folhas=folhas;anterior.quem='Codex gpt-6-astra (EX3, terceira correção)';anterior.quando='2026-10-19';anterior.o_que='EX3: definição completa das pensões e compromissos NATO com apoios por linha.';
anterior.origens=[...new Set(folhas.flatMap(f=>f.partes.flatMap(p=>(p.apoios??[]).filter(x=>x.origem).map(x=>x.origem))))];
const r=conferirAuditoriaDasExplicacoes({auditoria:a});
if(r.erros.length){console.error(r.erros.join('\n'));process.exit(1)}
// A família nova é composta isoladamente: o compositor R4 histórico não cobre as famílias posteriores.
let s=read('src/data/o-que-e-das-familias.mjs');
for(const f of FAMILIAS_EX3){
 const key=f.chaves[0],origens=[...new Set(f.partes.flatMap(p=>p.apoios.filter(x=>x.origem).map(x=>x.origem)))];
 const pt=f.partes.map(p=>p.pt).join(''),en=f.partes.map(p=>p.en).join('');
 if(!s.includes('"'+key+'":'))s=s.replace('export const FAMILIAS_DAS_LINHAS = {','export const FAMILIAS_DAS_LINHAS = {\n  '+JSON.stringify(key)+': '+JSON.stringify({nome:f.nome,frase:{pt:[pt],en:[en]},origens},null,2)+',');
 a.familias=a.familias.filter(x=>!x.chaves?.includes(key));a.familias.push({chaves:f.chaves,nome:f.nome,origens,folhas:[{pt,en,partes:f.partes}]});
}
write('src/data/o-que-e-das-familias.mjs',s);write('tests/cartao/leituras-provadas.json',JSON.stringify(a,null,2)+'\n');
console.log(JSON.stringify(r.contas));
