/** Nomes e explicações dos recibos V2-e, a partir das provas atravessadas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {dataDaCasa} from '../../../../src/lib/datas.mjs';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
const provas=JSON.parse(fs.readFileSync('ledger/provas/v2e/provas.json','utf8')).rows;
const claims=loadClaims();
const nomes={},familias={},aud=JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json','utf8'));
const descriptions=[
 [/^sns-sem-medico-elegibilidade$/, 'É a definição de elegibilidade para atribuição de médico de família no catálogo do SNS.', 'It is the NHS catalogue definition of eligibility for assignment of a family doctor.'],
 [/^sns-consultas-csp-descricao$/, 'É a ressalva da fonte sobre a exclusão do Vitacare e o carácter provisório do último mês.', 'It is the source caveat about the exclusion of Vitacare and the provisional latest month.'],
 [/^sns-catalogo-acumulados$/, 'É a descrição da cobertura temporal do conjunto no catálogo do SNS.', 'It is the description of the dataset’s temporal coverage in the NHS catalogue.'],
 [/^sns-sem-medico-serie-nova/, 'Conta os utentes elegíveis inscritos sem médico de família atribuído, segundo as regras da nova série.', 'Counts eligible registered users without an assigned family doctor, under the rules of the new series.'],
 [/^pe-dl87a-publicacao-ano$/, 'É a data do cabeçalho de publicação do decreto-lei sobre a atualização das portagens.', 'It is the publication header date of the decree-law on the toll update.'],
 [/^pe-brisa-minuta-ano$/, 'É a data de publicação da minuta do contrato de concessão Brisa.', 'It is the publication date of the Brisa concession draft contract.'],
 [/^pe-dl87a-financiamento$/, 'É a regra do financiamento do apoio pelo Orçamento do Estado, processado pela Direção-Geral do Tesouro e Finanças.', 'It is the rule for financing support through the State Budget, processed by the Directorate-General for Treasury and Finance.'],
 [/^pe-dl87a-apoio-retificado$/, 'É a definição do apoio correspondente à diferença entre a atualização de referência do decreto e a atualização limitada das portagens, na redação retificada.', 'It is the definition of support covering the difference between the decree’s reference and capped toll updates, in the rectified wording.'],
 [/^pe-dl87a-apoio$/, 'É a definição do apoio pela diferença entre a atualização limitada das portagens e a de referência do decreto, na versão original do diploma.', 'It is the definition of support covering the difference between capped toll updates and the decree’s reference update, in the original decree.'],
 [/^pe-dl87a-descontos$/, 'É a disposição que preserva os regimes de descontos em vigor.', 'It is the provision preserving existing discount schemes.'],

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
 [/^eurostat-.*-nrs/, 'É o número de enfermeiros com qualificação reconhecida na União Europeia por cem mil habitantes no país e período da linha.', 'It is the number of nurses with an EU-recognised qualification per hundred thousand inhabitants in the country and period of the row.'],
 [/^oe2027-/, 'É o objetivo ou compromisso assistencial escrito no relatório do Orçamento, sem meta quantitativa nesta linha.', 'It is the care objective or commitment written in the Budget report, without a numerical target in this row.'],
 [/^pe-despacho-/, 'É uma tarefa atribuída à comissão de negociação da concessão Brisa pelo despacho.', 'It is a task assigned by the order to the Brisa concession negotiating committee.'],
 [/^pe-brisa-vias/, 'São as vias abrangidas pela concessão Brisa na minuta do contrato.', 'These are the roads covered by the Brisa concession in the draft contract.'],
 [/^pe-brisa-/, 'É o prazo da concessão Brisa indicado no documento identificado na fonte.', 'It is the Brisa concession term stated in the document identified as the source.'],
 [/^pe-scut-/, 'É o excerto da lei sobre a eliminação de portagens e a sua entrada em vigor.', 'It is the excerpt from the law on toll abolition and its entry into force.'],
 [/^pe-dl87a-atualizacao/, 'É a atualização das tarifas e taxas de portagem fixada pelo diploma.', 'It is the toll rate update set by the decree.'],
 [/^pe-dl87a-efeitos/, 'É a data em que a atualização das tarifas e taxas de portagem produz efeitos.', 'It is the date when the toll rate update takes effect.'],
 [/^pe-tc15-/, 'É o excerto histórico do Tribunal de Contas sobre as parcerias e as compensações contingentes.', 'It is the historical Court of Auditors excerpt on partnerships and contingent compensation.'],
 [/^pe-oe-beira-abolicao$/, 'É a passagem da parte das negociações do capítulo das parcerias sobre o pedido da concessionária da Beira Interior ligado à eliminação das portagens.', 'It is the passage from the negotiations part of the partnerships chapter about the Beira Interior concessionaire’s claim linked to the toll abolition.'],
 [/^pe-oe-/,  'É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias.', 'It is the Budget report excerpt on road partnership risks.'],
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
 if(id.startsWith('infarmed-')&&id.includes('-encargo'))for(const lang of ['pt','en'])nome[lang]=nome[lang].replace(proof.period,dataDaCasa(proof.period,lang));
 nomes[id]=nome;
 let familiaNome={...nome};
 if(id==='sns-sem-medico-serie-nova-2026-08')familiaNome={pt:'Utentes elegíveis sem médico de família atribuído',en:'Eligible users without an assigned family doctor'};
 if(/^prr-(complemento|marcos)/.test(id))familiaNome={pt:'Estado do marco ou meta da Saúde',en:'Health milestone or target status'};
 else if(id.startsWith('infarmed-'))for(const lang of ['pt','en'])familiaNome[lang]=familiaNome[lang].replace(/, (?:\d{4}-\d{2}\/\d{4}-\d{2}|janeiro a julho de \d{4}|January to July \d{4})$/,'');
 else if(id.startsWith('prr-monitorizacao'))for(const lang of ['pt','en'])familiaNome[lang]=familiaNome[lang].replace(/^C01 - /,'');
 else if(id==='pe-dl87a-atualizacao')familiaNome={pt:'Atualização das portagens prevista no diploma',en:'Toll rate update set by the decree'};
 else if(id==='pe-tc15-futuros')familiaNome={pt:'Previsão histórica de encargos com as parcerias',en:'Historical forecast of partnership charges'};
 else if(id==='pe-brisa-vias-minuta')familiaNome={pt:'Vias da concessão Brisa na minuta',en:'Brisa concession roads in the draft contract'};
 assert(!/\d/.test(familiaNome.pt+familiaNome.en),`nome de família com algarismo: ${id}`);
 const texts=id==='der-prr-saude-taxa-numerico'?['É a leitura numérica da taxa de execução financeira publicada no painel.','It is the numerical reading of the financial execution rate published on the dashboard.']:id.startsWith('der-')?derivedDescriptions[proof.derivation.operation]:descriptions.find(([re])=>re.test(id))?.slice(1);
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
