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
const fun=[L(f,'derivation','despesa efetiva consolidada da administração central'),O('dados-gov-oe-despesa-funcional','excerto','contabilidade pública')];
const euro=[L(u,'ressalva','contabilidade nacional, incluindo as administrações regional e local'),L(u,'unit','% do PIB'),O('eurostat-cofog-divisao-01','documento','General government expenditure by function (COFOG)')];
const ministerios=[L('oe-2026-cem-euros-ministerio-financas','derivation','pela «DESPESA TOTAL» do MAPA 4'),...['rp4n-total-ministerios','rp4n-mapa-ministerios','rp4n-consolidada-ministerios'].map(k=>O(k,'excerto',origens[k].excerto))];
const def=O('nato-definicao-despesa-defesa','excertoEn',origens['nato-definicao-despesa-defesa'].excertoEn.split('\n')[0]);
const ligaDef=O('nato-definicao-despesa-defesa','excertoEn',origens['nato-definicao-despesa-defesa'].excertoEn.split('\n')[1]);
const nato=(kind,year='2026')=>L(`nato-defesa-portugal-${kind}-${year}`,'excerpt',kind==='pib'?'Based on 2021 prices':'Current prices');
const estimativa=year=>L(`nato-defesa-portugal-pib-${year}`,'excerpt','Figures for 2025 and 2026 are estimates.');
const anterior=a.explicacoes.find(x=>x.slug===e.slug);
const diz=(pt,en,apoios)=>({pt,en,classe:'diz',apoios});
const leitura=(pt,en,apoios,sobre)=>({pt,en,classe:'leitura',sobre,apoios});
const folhas=folhasDaExplicacao(e).map(folha=>{
 const velha=anterior.folhas.find(x=>x.caminho===folha.caminho&&x.pt===folha.pt&&x.en===folha.en);
 if(velha)return velha;
 const {caminho,pt,en}=folha;let partes;
 if(caminho.startsWith('seccoes[0].conteudo[2]')){
  if(caminho.endsWith('[2]')){
   const sepPt=' A despesa em defesa',sepEn=' Defence spending';
   const fimPt=' Para Portugal,',fimEn=' For Portugal,';
   const x=pt.indexOf(sepPt),y=en.indexOf(sepEn),z=pt.indexOf(fimPt),w=en.indexOf(fimEn);
   partes=[diz(pt.slice(0,x),en.slice(0,y),fun),diz(pt.slice(x,z),en.slice(y,w),[def,ligaDef]),diz(pt.slice(z),en.slice(w),[nato('pib','2025'),estimativa('2025')])];
  }else if(caminho.endsWith('[14]')){
   const x=pt.indexOf(' Estas percentagens'),y=en.indexOf(' These percentages');
   partes=[diz(pt.slice(0,x),en.slice(0,y),[estimativa('2026')]),leitura(pt.slice(x),en.slice(y),[...fun,nato('pib'),L('nato-defesa-portugal-pib-2026','unit','% do PIB')],'Os denominadores declarados das duas percentagens são diferentes.')];
  }else if(pt.includes('preços correntes'))partes=[diz(pt,en,[nato('eur')])];
  else if(/[\p{L}]/u.test(pt)&&!['Os ',' e ',' % em '].includes(pt))partes=[diz(pt,en,[nato('pib'),estimativa('2026')])];
  else partes=[{pt,en,classe:'liga'}];
 }else if(caminho.startsWith('seccoes[0].conteudo[3]')){
  const nome=pt.match(/(?:^: |^, |^ e )(.+?) $/);
  if(nome && Number(caminho.match(/\[(\d+)\]$/)[1])<=20){
   const idx=Number(caminho.match(/\[(\d+)\]$/)[1]);const n=idx/2;
   const id=`despesa-por-funcao-2024-gf${String(n).padStart(2,'0')}-pt`;
   partes=[diz(pt,en,[L(id,'name',linhas.get(id).name),L(`oe-2026-cem-euros-funcao-${String(n).padStart(2,'0')}`,'nome',nome[1])])];
  }else if(pt===' e usam o PIB como denominador. As fatias por função do Orçamento referem-se a '||pt.startsWith(' e usam a despesa'))partes=[leitura(pt,en,[...fun,...euro],'Períodos, denominadores, perímetros e bases contabilísticas das linhas comparadas.')];
  else partes=[diz(pt,en,euro)];
 }else if(caminho.startsWith('abertura')){
  const antiga=anterior.folhas.find(x=>x.caminho===caminho);partes=structuredClone(antiga.partes);
  const last=partes.at(-1);last.pt=last.pt.replace('De cada cem euros,','De cada cem euros da despesa efetiva consolidada da administração central,');last.en=last.en.replace('Of every hundred euros,',"Of every hundred euros of central administration's consolidated effective expenditure,");last.apoios.push(...fun);
 }else if(caminho.includes('seccoes[1]'))partes=[leitura(pt,en,ministerios,'O denominador é a despesa total antes da consolidação no mapa dos ministérios.')];
 else if(caminho.endsWith('figura.titulo'))partes=[diz(pt,en,fun)];
 else throw Error('Folha EX3 sem auditoria: '+caminho);
 return {caminho,pt,en,partes};
});
anterior.folhas=folhas;anterior.quem+='; Codex gpt-6-astra (EX3)';anterior.quando='2026-10-15';anterior.o_que+=' EX3: denominadores, definição NATO, estimativas e comparação com as dez funções do Eurostat.';
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
