import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const root=process.cwd();const {loadClaims}=await import(root+'/src/lib/ledger.mjs');const {NOMES_EO1}=await import(root+'/src/data/nomes-eo1.mjs');
const old=new Set(execFileSync('git',['ls-tree','-r','--name-only','003087056','ledger/claims'],{encoding:'utf8'}).trim().split('\n'));const claims=[...loadClaims({includeWithdrawn:true}).values()].filter(r=>!old.has(`ledger/claims/${r.id}.yml`)&&r.study!=='a-casa-em-portugal-e-na-europa');
const ref={
'flexibilizacao-regras-2018':['Data das regras da flexibilização a que se aplica o fator de sustentabilidade','Date of the flexibilisation rules to which the sustainability factor applies'],
'flexibilizacao-regras-2018-ano':['Ano das regras da flexibilização a que se aplica o fator de sustentabilidade','Year of the flexibilisation rules to which the sustainability factor applies'],
'flexibilizacao-idade-minima':['Idade mínima no regime de flexibilização','Minimum age under the flexibilisation scheme'],
'flexibilizacao-carreira-minima':['Carreira mínima no regime de flexibilização','Minimum contribution record under the flexibilisation scheme'],
'desemprego-longa-duracao-idade-referencia':['Idade de referência na antecipação por desemprego de longa duração','Reference age for early retirement due to long-term unemployment']};
const additions={},names={};const ap='tests/cartao/leituras-provadas.json',audit=JSON.parse(fs.readFileSync(ap));
for(const r of claims){let n=NOMES_EO1[r.id]??{pt:ref[r.id]?.[0],en:ref[r.id]?.[1]};if(!n.pt||!n.en)throw Error(r.id+JSON.stringify(n));
const pt=`É o valor de «${n.pt}» no documento citado, para o período e na unidade indicados.`,en=`It is the value of «${n.en}» in the cited document, for the stated period and unit.`;
const familia=r.id==='flexibilizacao-regras-2018'?'flexibilizacao-regras':r.id;
additions[familia]={nome:n,frase:{pt:[pt],en:[en]}};if(ref[r.id])names[r.id]=n;
audit.familias=audit.familias.filter(x=>!x.chaves?.includes(familia));audit.familias.push({chaves:[familia],nome:n,origens:[],folhas:[{pt,en,partes:[{classe:'diz',pt,en,apoios:[{linha:'propria',campo:'excerpt',literal:r.excerpt}]}]}]});}
const marker='\n// COR3: definições das linhas novas do Orçamento e da reforma.\n';
for(const [file,obj,sym] of [['src/data/o-que-e-das-familias.mjs',additions,'FAMILIAS_DAS_LINHAS'],['src/data/nomes-das-medidas.mjs',names,'NOMES_DO_PROJETO']])fs.writeFileSync(file,fs.readFileSync(file,'utf8').split(marker)[0]+marker+`Object.assign(${sym}, ${JSON.stringify(obj,null,2)});\n`);
fs.writeFileSync(ap,JSON.stringify(audit,null,2)+'\n');console.log(claims.length+' famílias novas');
