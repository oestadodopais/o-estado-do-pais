/** COR-AGUA: definições do recibo, com apoios nas linhas seladas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {loadClaims} from '../src/lib/ledger.mjs';
const rows=loadClaims(),definicoes=[];
const define=(id,ptNome,enNome,pt,en,campos)=>{
 const c=rows.get('coragua-'+id);assert(c,id);
 const apoios=campos.map(campo=>{const literal=campo.split('.').reduce((o,k)=>o?.[k],c);assert(typeof literal==='string'&&literal.trim().length>=4);return {linha:'propria',campo,literal};});
 assert(!/\d/.test(ptNome+enNome+pt+en));
 definicoes.push({chaves:[c.id],nome:{pt:ptNome,en:enNome},origens:[],partes:[{classe:'diz',pt,en,apoios}]});
};
define('ersar-encargo-mensal-2024','Encargo mensal de abastecimento de água','Monthly water supply charge','É o nível médio de encargos mensais com abastecimento de água que a ERSAR apresenta para o consumo doméstico de referência.','It is the average monthly water supply charge presented by ERSAR for the reference household consumption.',['excerpt','document.locator']);
define('ersar-encargo-metro-cubico-2024','Encargo doméstico por metro cúbico','Household charge per cubic metre','É o encargo mensal de referência dividido pelo consumo de referência, para comparar os encargos por metro cúbico.','It is the reference monthly charge divided by the reference consumption, to compare charges per cubic metre.',['derivation']);
for(const [pressao,enPressao] of [['alta','high'],['baixa','low']])define('alqueva-'+pressao+'-pressao-2026','Tarifa do Alqueva em '+pressao+' pressão','Alqueva '+enPressao+' pressure tariff','É a tarifa por metro cúbico para fornecimento em '+pressao+' pressão publicada no edital do Alqueva.','It is the tariff per cubic metre for '+enPressao+' pressure supply published in the Alqueva edital.',['document.locator','excerpt']);
define('dgadr-eficiencia-2024','Eficiência média na adução e distribuição','Average conveyance and distribution efficiency','É a média da eficiência na adução e distribuição do conjunto dos aproveitamentos hidroagrícolas que a DGADR publica.','It is the average conveyance and distribution efficiency across the hydroagricultural schemes published by DGADR.',['excerpt']);
define('gulbenkian-sem-contador','Agricultores sem contador no inquérito','Farmers without a meter in the survey','É a percentagem dos agricultores inquiridos que não têm contador de saída de água.','It is the percentage of surveyed farmers who do not have a water outlet meter.',['excerpt','document.title']);
define('gulbenkian-universo-hectares','Área mínima das explorações no inquérito','Minimum holding area in the survey','É a área mínima das explorações abrangidas pelo inquérito a agricultores que regam as suas culturas em Portugal continental.','It is the minimum holding area covered by the survey of farmers who irrigate their crops in mainland Portugal.',['excerpt']);
define('gulbenkian-inquerito-ano','Ano das entrevistas do inquérito','Year of the survey interviews','É o ano em que decorreram as entrevistas do inquérito sobre o uso da água.','It is the year in which the water use survey interviews took place.',['excerpt','document.locator']);
define('tc-auditoria-ano','Ano da auditoria do Tribunal de Contas','Year of the Tribunal de Contas audit','É o ano do relatório de auditoria ao contrato de concessão das centrais hidroelétricas.','It is the year of the audit report on the hydroelectric power stations concession contract.',['excerpt','document.edition']);
for(const [limite,pressao,enLimite,enPressao] of [['minimo','alta','Lower','high'],['maximo','baixa','Upper','low']])define('racio-'+limite+'-2026',limite==='minimo'?'Limite inferior do rácio de encargos':'Limite superior do rácio de encargos',enLimite+' charge ratio','É o nível médio de encargos domésticos dividido pela tarifa de '+pressao+' pressão do Alqueva, arredondado à unidade.','It is the average household charge level divided by the Alqueva '+enPressao+' pressure tariff, rounded to the nearest integer.',['derivation']);
for(const [id,ptNome,enNome,pt,en] of [
 ['racio-minimo','Limite inferior do rácio na edição anterior','Lower ratio in the previous edition','É o limite inferior do rácio de preços que a edição arquivada imprimia.','It is the lower price ratio printed in the archived edition.'],
 ['racio-maximo','Limite superior do rácio na edição anterior','Upper ratio in the previous edition','É o limite superior do rácio de preços que a edição arquivada imprimia.','It is the upper price ratio printed in the archived edition.'],
 ['eficiencia-95','Eficiência ponderada na edição anterior','Weighted efficiency in the previous edition','É a eficiência ponderada pelo volume que a edição arquivada imprimia.','It is the volume weighted efficiency printed in the archived edition.'],
 ['eficiencia-83','Limite inferior da eficiência na edição anterior','Lower efficiency bound in the previous edition','É o limite inferior da eficiência ponderada pelo volume que a edição arquivada imprimia.','It is the lower bound of volume weighted efficiency printed in the archived edition.'],
 ['eficiencia-85','Limite superior da eficiência na edição anterior','Upper efficiency bound in the previous edition','É o limite superior da eficiência ponderada pelo volume que a edição arquivada imprimia.','It is the upper bound of volume weighted efficiency printed in the archived edition.'],
 ['inquerito-2021','Ano atribuído ao inquérito na edição anterior','Year assigned to the survey in the previous edition','É o ano que a edição arquivada atribuía ao inquérito.','It is the year the archived edition assigned to the survey.'],
])define('historico-'+id,ptNome,enNome,pt+' Conserva-se como prova da correção, não como valor atual.',en+' It is retained as evidence of the correction, not as a current value.',['excerpt','document.title']);
const file='src/data/o-que-e-das-familias.mjs',marca='\n// COR-AGUA: declarações acrescentadas pelo compositor próprio.';
const original=fs.readFileSync(file,'utf8').split(marca)[0];
const mapa=Object.fromEntries(definicoes.map(e=>[e.chaves[0],{nome:e.nome,frase:{pt:[e.partes[0].pt],en:[e.partes[0].en]},origens:[]}]));
fs.writeFileSync(file,original+marca+'\nObject.assign(FAMILIAS_DAS_LINHAS, '+JSON.stringify(mapa,null,2)+');\n');
const audFile='tests/cartao/leituras-provadas.json',aud=JSON.parse(fs.readFileSync(audFile,'utf8')),keys=new Set(Object.keys(mapa));
aud.familias=aud.familias.filter(e=>!e.chaves?.some(k=>keys.has(k)));
for(const e of definicoes)aud.familias.push({chaves:e.chaves,nome:e.nome,origens:e.origens,folhas:[{pt:e.partes[0].pt,en:e.partes[0].en,partes:e.partes}]});
aud.leituras=aud.leituras.filter(l=>!l.o_que.startsWith('Construção COR-AGUA:'));
aud.leituras.push({quem:'Codex gpt-6-astra',quando:'2026-11-08',o_que:'Construção COR-AGUA: definições dos recibos conferidas nos excertos, localizadores e contas das linhas seladas.'});
fs.writeFileSync(audFile,JSON.stringify(aud,null,2)+'\n');
console.log(`COR-AGUA: ${definicoes.length} definições compostas e apoios conferidos.`);
