/** Nomes e explicações dos recibos V2-e, a partir das provas atravessadas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
const provas=JSON.parse(fs.readFileSync('ledger/provas/v2e/provas.json','utf8')).rows;
const claims=loadClaims();
const nomes={},familias={},aud=JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json','utf8'));
const descriptions=[
 [/^sns-sem-medico/, 'Conta os utentes inscritos sem médico de família atribuído, na série indicada.', 'Counts registered users without an assigned family doctor, in the indicated series.'],
 [/^sns-consultas-csp/, 'Conta as consultas realizadas nos cuidados de saúde primários no mês indicado.', 'Counts primary-care consultations in the indicated month.'],
 [/^sns-consultas-hospitalares/, 'Conta as consultas hospitalares acumuladas desde janeiro até ao mês indicado.', 'Counts hospital consultations accumulated from January through the indicated month.'],
 [/^sns-cirurgias/, 'Conta as intervenções cirúrgicas programadas e urgentes acumuladas desde janeiro até ao mês indicado.', 'Counts scheduled and emergency surgeries accumulated from January through the indicated month.'],
 [/^sns-lista-cirurgia/, 'Conta os utentes inscritos para cirurgia no período indicado.', 'Counts patients on the surgery waiting list in the indicated period.'],
 [/^sns-espera-rncci/, 'Conta os utentes à espera de vaga em cuidados continuados na data indicada.', 'Counts patients waiting for continuing-care places on the indicated date.'],
 [/^sns-urgencias/, 'Conta os atendimentos em urgência hospitalar acumulados desde janeiro até ao mês indicado.', 'Counts hospital emergency attendances accumulated from January through the indicated month.'],
 [/^sns-divida/, 'É a dívida a fornecedores externos da entidade identificada no nome.', 'It is the debt to external suppliers of the entity identified in the name.'],
 [/^infarmed-.*-encargo/, 'São os encargos do Serviço Nacional de Saúde com medicamentos no contexto e período identificados no nome.', 'It is National Health Service expenditure on medicines in the setting and period identified in the name.'],
 [/^infarmed-.*limitacao/, 'É a ressalva do Infarmed sobre as contribuições que os valores apresentados não refletem integralmente.', 'It is Infarmed’s caveat on contributions not fully reflected in the reported values.'],
 [/^dgo-atraso/, 'São pagamentos em atraso das unidades de saúde EPE. Não é a dívida total a fornecedores.', 'It is overdue payments by public enterprise health units. It is not total debt to suppliers.'],
 [/^dgo-regularizacao/, 'São regularizações de dívidas através de reforços de capital no período indicado.', 'It is debt settlement through capital injections in the indicated period.'],
 [/^prr-monitorizacao.*contratado/, 'É o montante contratado na componente Saúde do PRR, na data do painel.', 'It is the contracted amount in the RRP Health component, at the dashboard date.'],
 [/^prr-monitorizacao.*pago/, 'É o montante pago na componente Saúde do PRR, na data do painel.', 'It is the paid amount in the RRP Health component, at the dashboard date.'],
 [/^prr-monitorizacao.*taxa/, 'É a taxa de execução financeira da componente Saúde publicada no painel.', 'It is the Health component financial execution rate published in the dashboard.'],
 [/^prr-(marcos|complemento)/, 'É o estado do marco ou meta identificado no nome, tal como consta do anexo anual.', 'It is the status of the milestone or target identified in the name, as listed in the annual annex.'],
 [/^eurostat-.*-phys/, 'É o número de médicos por cem mil habitantes no país e período da linha.', 'It is the number of physicians per hundred thousand inhabitants in the country and period of the row.'],
 [/^eurostat-.*-nrs/, 'É o número de enfermeiros por cem mil habitantes no país e período da linha.', 'It is the number of nurses per hundred thousand inhabitants in the country and period of the row.'],
 [/^oe2027-/, 'É o objetivo ou compromisso assistencial escrito no relatório do Orçamento, sem meta quantitativa nesta linha.', 'It is the care objective or commitment written in the Budget report, without a numerical target in this row.'],
 [/^pe-despacho-/, 'É uma tarefa atribuída à comissão de negociação da concessão Brisa pelo despacho.', 'It is a task assigned by the order to the Brisa concession negotiating committee.'],
 [/^pe-brisa-vias/, 'São as vias abrangidas pela concessão Brisa na minuta do contrato.', 'These are the roads covered by the Brisa concession in the draft contract.'],
 [/^pe-brisa-/, 'É o prazo da concessão Brisa indicado no documento identificado na fonte.', 'It is the Brisa concession term stated in the document identified as the source.'],
 [/^pe-scut-/, 'É o excerto da lei sobre a eliminação de portagens e a sua entrada em vigor.', 'It is the excerpt from the law on toll abolition and its entry into force.'],
 [/^pe-dl87a-atualizacao/, 'É a atualização das tarifas e taxas de portagem fixada pelo diploma.', 'It is the toll rate update set by the decree.'],
 [/^pe-dl87a-efeitos/, 'É a data em que a atualização das tarifas e taxas de portagem produz efeitos.', 'It is the date when the toll rate update takes effect.'],
 [/^pe-dl87a-/, 'É a regra do diploma sobre o financiamento do apoio às concessionárias pelos descontos nas portagens.', 'It is the decree’s rule on financing support to concessionaires for toll discounts.'],
 [/^pe-tc15-/, 'É o excerto histórico do Tribunal de Contas sobre as parcerias e as compensações contingentes.', 'It is the historical Court of Auditors excerpt on partnerships and contingent compensation.'],
 [/^pe-oe-/, 'É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias.', 'It is the Budget report excerpt on road partnership risks.'],
];
const derivedDescriptions={
 change_pct:['É a variação percentual face ao período homólogo, refeita das componentes identificadas.','It is the percentage change against the corresponding period, recalculated from the identified components.'],
 sum:['É a soma dos encargos com medicamentos em ambulatório e em meio hospitalar.','It is the sum of outpatient and hospital medicines expenditure.'],
 subtract:['É o montante contratado na componente Saúde do PRR menos o montante pago.','It is the contracted amount in the RRP Health component minus the paid amount.'],
 percent:['É a parte do contratado na componente Saúde do PRR que ainda não foi paga.','It is the share of the contracted RRP Health amount that remains unpaid.'],
 millions:['É a soma das dívidas a fornecedores externos das entidades do Serviço Nacional de Saúde, em milhões de euros.','It is the sum of National Health Service entities’ debts to external suppliers, in million euros.'],
 number:['É a leitura numérica em milhões de euros do montante que o painel apresenta com a unidade incorporada.','It is the numerical reading in million euros of the amount the dashboard presents with its unit.'],
 count:['Conta os marcos e metas da componente Saúde no anexo anual.','Counts the Health component milestones and targets in the annual annex.'],
 count_complete:['Conta os marcos e metas da componente Saúde cujo estado no anexo anual é completo.','Counts the Health component milestones and targets whose annual annex status is complete.'],
};
aud.familias=aud.familias.filter(f=>!f.chaves?.some(id=>Object.hasOwn(provas,id)||Object.hasOwn(provas,id.replaceAll('_','-').replaceAll('.','-').toLowerCase())));
for(const [id,proof] of Object.entries(provas)){
 const c=claims.get(id);assert(c,`linha não atravessada: ${id}`);
 const nome={pt:proof.label,en:proof.label_en};assert(nome.pt&&nome.en);
 nomes[id]=nome;
 let familiaNome={...nome};
 if(/^prr-(complemento|marcos)/.test(id))familiaNome={pt:'Estado do marco ou meta da Saúde',en:'Health milestone or target status'};
 else if(id.startsWith('infarmed-'))for(const lang of ['pt','en'])familiaNome[lang]=familiaNome[lang].replace(/, \d{4}-\d{2}\/\d{4}-\d{2}$/,'');
 else if(id.startsWith('prr-monitorizacao'))for(const lang of ['pt','en'])familiaNome[lang]=familiaNome[lang].replace(/^C01 - /,'');
 else if(id==='pe-dl87a-atualizacao')familiaNome={pt:'Atualização das portagens prevista no diploma',en:'Toll rate update set by the decree'};
 else if(id==='pe-tc15-futuros')familiaNome={pt:'Previsão histórica de encargos com as parcerias',en:'Historical forecast of partnership charges'};
 else if(id==='pe-brisa-vias-minuta')familiaNome={pt:'Vias da concessão Brisa na minuta',en:'Brisa concession roads in the draft contract'};
 assert(!/\d/.test(familiaNome.pt+familiaNome.en),`nome de família com algarismo: ${id}`);
 const texts=id.startsWith('der-')?derivedDescriptions[proof.derivation.operation]:descriptions.find(([re])=>re.test(id))?.slice(1);
 assert(texts,`falta frase própria: ${id}`);assert(!/\d/.test(texts.join('')));
 const [pt,en]=texts,campo=c.derivation?'derivation':'excerpt',literal=c[campo];
 assert(typeof literal==='string'&&literal.length>=4);
 const partes=[{pt,en,classe:'diz',apoios:[{linha:'propria',campo,literal}]}];
 familias[id]={nome:familiaNome,frase:{pt:[pt],en:[en]}};
 aud.familias.push({chaves:[id],nome:familiaNome,origens:[],folhas:[{pt,en,partes}]});
}
fs.writeFileSync('src/data/nomes-v2e.mjs','/** Nomes conferidos nas provas V2-e. */\nexport const NOMES_V2E = '+JSON.stringify(nomes,null,2)+';\n');
const familyFile='src/data/o-que-e-das-familias.mjs',marker='\n// V2E: recibos dos efeitos.\n';
fs.writeFileSync(familyFile,fs.readFileSync(familyFile,'utf8').split(marker)[0]+marker+'Object.assign(FAMILIAS_DAS_LINHAS, '+JSON.stringify(familias,null,2)+');\n');
fs.writeFileSync('tests/cartao/leituras-provadas.json',JSON.stringify(aud,null,2)+'\n');
console.log(`${Object.keys(nomes).length} nomes bilingues e famílias preparados.`);
