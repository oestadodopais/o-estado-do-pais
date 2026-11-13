/** COR3: crescer apenas pelas linhas novas e reler os apoios das alteradas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {FAMILIAS_DAS_LINHAS as familias} from '../../../../src/data/o-que-e-das-familias.mjs';
import {NOMES_HB1 as nomes} from '../../../../src/data/nomes-hb1.mjs';
const claims=loadClaims({includeWithdrawn:true}),initial=Object.fromEntries(execFileSync('git',['ls-tree','-r','--name-only','003087056','ledger/claims'],{encoding:'utf8'}).trim().split('\n').map(x=>[x,true]));
const fresh=[...claims.values()].filter(r=>!Object.hasOwn(initial,`ledger/claims/${r.id}.yml`)&&r.study==='a-casa-em-portugal-e-na-europa');
const audFile='tests/cartao/leituras-provadas.json',aud=JSON.parse(fs.readFileSync(audFile));const additions={},names={};
for(const r of fresh){
 const id=r.id;let sibling,pt,en;
 if(id.includes('-ptir-i25-'))sibling=id.replace('-i25-','-i15-').replace(/-\d{4}$/,'-2024');
 else if(id.includes('-ptir-lt-avg-'))sibling=id.replace(/-2025$/,'-2024');
 else if(id==='hab-oe-invariantes-definicao'){sibling='hab-oe-legenda-invariante';pt='O excerto reproduz a definição de políticas invariantes no relatório do Orçamento.';en='The excerpt reproduces the definition of unchanged policies in the Budget report.';}
 else if(id==='der-hab-preco-rendimento-lt-pt-2025'){sibling='der-hab-preco-rendimento-lt-pt-2024';pt='O resultado é a percentagem em que o rácio entre os preços das casas e o rendimento está acima da sua média de longo prazo';en='The result is the percentage by which the ratio of house prices to income exceeds its long-term average';}
 else {assert(id.startsWith('der-hab-preco-rendimento-2015-'));sibling='der-hab-preco-rendimento-acima-2015-pt-2024';pt='O resultado é a subida, em percentagem, do rácio entre os preços das casas e o rendimento entre os dois anos indicados na conta';en='The result is the percentage rise in the ratio of house prices to income between the two years identified in the calculation';}
 const source=familias[sibling];assert(source,sibling);let f=JSON.parse(JSON.stringify(source).replaceAll(sibling,id));
 if(pt){f.frase={pt:[pt],en:[en]};f.origens=[];f.nome={pt:id==='hab-oe-invariantes-definicao'?'Definição de políticas invariantes':id.includes('-lt-')?'Rácio preço-rendimento acima da média de longo prazo':'Subida do rácio entre os preços das casas e o rendimento',en:id==='hab-oe-invariantes-definicao'?'Definition of unchanged policies':id.includes('-lt-')?'Price-to-income ratio above its long-term average':'Rise in the ratio of house prices to income'};}
 names[id]=f.nome;additions[id]=f;
 let a=JSON.parse(JSON.stringify(aud.familias.find(e=>e.chaves?.includes(sibling))).replaceAll(sibling,id));a.chaves=[id];a.nome=f.nome;
 if(pt){a.origens=[];a.folhas=[{pt,en,partes:[{classe:'diz',pt,en,apoios:[{linha:'propria',campo:r.derivation?'derivation':'excerpt',literal:r.derivation||r.excerpt}]}]}];}
 aud.familias=aud.familias.filter(e=>!e.chaves?.includes(id));aud.familias.push(a);
}
// Uma revisão da fonte altera o literal que sustenta a mesma definição.
let apoios=0;
for(const a of aud.familias){
 if(a.chaves?.length!==1)continue;const r=claims.get(a.chaves[0]);if(!r||r.study!=='a-casa-em-portugal-e-na-europa')continue;
 for(const f of a.folhas??[])for(const p of f.partes??[])for(const ap of p.apoios??[]){
  if(ap.linha!=='propria'||!['excerpt','derivation','name'].includes(ap.campo))continue;
  const atual=r[ap.campo];if(typeof atual==='string'&&!atual.includes(ap.literal)){ap.literal=atual;apoios++;}
 }
}
const marker='\n// COR3: declarações das linhas acrescentadas.\n';
for(const [file,obj,symbol] of [['src/data/o-que-e-das-familias.mjs',additions,'FAMILIAS_DAS_LINHAS'],['src/data/nomes-hb1.mjs',names,'NOMES_HB1']]){const before=fs.readFileSync(file,'utf8').split(marker)[0];fs.writeFileSync(file,before+marker+`Object.assign(${symbol}, ${JSON.stringify(obj,null,2)});\n`);}
aud.leituras.push({quem:'Codex gpt-6-astra',quando:'2026-11-13',o_que:'COR3: famílias das linhas novas da habitação, com as definições existentes e os cálculos declarados; apoios relidos nas células revistas.'});fs.writeFileSync(audFile,JSON.stringify(aud,null,2)+'\n');
console.log(JSON.stringify({novas:fresh.length,nomes:Object.keys(names).length,familias:Object.keys(additions).length,apoios_relidos:apoios}));
