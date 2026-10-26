/** OG1-A6: fragmentos, data de publicação e relação percentual nos dados e no HTML. */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dataDaCasa} from '../../src/lib/datas.mjs';
import {conferirOg1} from '../../scripts/afirmacoes-og1.mjs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {OG1} from '../../src/data/discussao-og1.mjs';
import {resolverExplicacao} from '../../src/lib/explicacoes.mjs';
import {linhasImpressasOuDerivadas} from './efeitos.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
const claims=loadClaims();
const candidato=t=>({slug:'ensaio-og1',titulo:{pt:['Ensaio'],en:['Test']},abertura:[],naoDiz:[],seccoes:[{id:'fonte',titulo:{pt:'Fonte',en:'Source'},conteudo:[{paragrafo:{pt:[t],en:[t]}}]}]});
let checks=0;
const proofs=JSON.parse(fs.readFileSync('ledger/provas/og1a/provas.json')).rows;
// O build sem motor relê os excertos selados; com o motor confere-os no corpo alojado.
if(process.env.RESEARCHHUB_DIR){
 const code="import json; from publisher import oe2027_generalidade as G; print(json.dumps({s['id']:G.norm(G.surface(s)[0]) for s in G.load(G.STUDY/'extracoes.json')['rows'] if s['group'] in ('partidos','governo')}))";
 const bodies=JSON.parse(execFileSync('python3',['-c',code],{cwd:process.env.RESEARCHHUB_DIR,encoding:'utf8',maxBuffer:4*1024*1024}));
 for(const [id,p] of Object.entries(proofs))if(p.speaker_label){assert(bodies[id].includes(p.speaker_label.context),id+': rótulo ausente do corpo');checks++;}
}
const exists=fs.existsSync;
try{fs.existsSync=file=>file==='ledger/provas/og1a/provas.json'?false:exists(file);assert(conferirOg1(claims).errors.some(e=>e.includes('provas ausente')));checks++;}finally{fs.existsSync=exists;}
function conferirDatasERotulos(item,lang){
 const errors=[];
 for(const p of item.querySelector('[data-discussao-parte="como-foi-dito"]').querySelectorAll('[data-discussao-paragrafo]')){
  const speaker=p.querySelector('[data-linha-campo="attributed_to"]'),id=speaker?.getAttribute('data-linha-claim'),row=claims.get(id),proof=proofs[id];
  const dates=p.querySelectorAll('[data-de-campo="reference_date"]');
  const copy=parse(p.toString());copy.querySelectorAll('.src-chip,[data-discussao-literal="excerpt"]').forEach(n=>n.remove());
  const visible=copy.text.match(/\b\d{2}\.\d{2}\.\d{4}\b/g)??[];
  if(dates.length!==1||dates[0].getAttribute('data-de-linha')!==id||dates[0].text!==dataDaCasa(row?.reference_date,lang)||visible.length!==1||visible[0]!==dataDaCasa(row?.reference_date,lang))errors.push(id+': data impressa diferente da linha');
  const prefix=p.text.split(dataDaCasa(row?.reference_date,lang))[0].slice(speaker?.text.length??0);
  const label=proof?.speaker_label;
  if(label){
   const printed=lang==='en'&&label.literal==='ministro das Finanças'?'Finance Minister':label.literal;
   if(!label.context.includes(label.literal)||label.source_sha256!==proof.document.source_sha256||!prefix.includes(printed))errors.push(id+': rótulo sem apoio na página alojada');
   const party=/, (?:do|da|of(?: the)?) ([^,]+),/.exec(prefix)?.[1];
   if(party&&party!==printed)errors.push(id+': partido diferente da página alojada');
  }else if(/, (?:do|da|of(?: the)?) [^,]+,/.test(prefix))errors.push(id+': partido sem prova');
 }
 return errors;
}

const falsaData=structuredClone(OG1);falsaData.apenasDatas.push('pm-q3-3-r37-c3');assert.throws(()=>linhasImpressasOuDerivadas(falsaData,claims));checks++;

for(const lang of ['pt','en']){assert.equal(resolverExplicacao(OG1,lang).seccoes.length,6);checks++;}
for(const t of [
 {fragmento:'og1-utao-brent-diferenca',campo:'excerpt',texto:'11% abaixo'},
 {fragmento:'og1-governo-observador-saldo',campo:'excerpt',texto:'30'},
 {fragmento:'og1-governo-observador-saldo',campo:'attributed_to',texto:'Joaquim'},
 {data:'divida-publica-2024',campo:'access_date'},
 {data:'linha-inexistente-og1',campo:'published_at'},
]){assert.throws(()=>resolverExplicacao(candidato(t),'pt'));checks++;}
const data=resolverExplicacao(candidato({data:'divida-publica-2024',campo:'published_at'}),'pt');assert.equal(data.seccoes[0].blocos[0].pedacos[0].data.valor,'2026-10-21');checks++;
assert(claims.get('og1-utao-brent-diferenca').excerpt.includes('11% acima dos 86,1 USD'));checks++;
for(const[lang,route]of[['pt','o-que-se-discute'],['en','en/under-discussion']]){
 const root=parse(fs.readFileSync(`dist/${route}/index.html`,'utf8'));
 const item=root.querySelector('[data-discussao="orcamento-2027-generalidade"]');assert(item);checks++;
 assert.equal(item.querySelectorAll('[data-discussao-parte]').length,6);checks++;
 assert.deepEqual(conferirDatasERotulos(item,lang),[]);checks++;
 const wrongDate=parse(item.toString());wrongDate.querySelector('[data-discussao-parte="como-foi-dito"] [data-de-campo="reference_date"]').set_content('01.01.1900');assert(conferirDatasERotulos(wrongDate,lang).some(e=>e.includes('data impressa')));checks++;
 const wrongParty=parse(item.toString().replace(lang==='pt'?', do Bloco de Esquerda,':', of Bloco de Esquerda,',lang==='pt'?', do Partido Trocado,':', of Wrong Party,'));assert(conferirDatasERotulos(wrongParty,lang).some(e=>e.includes('rótulo')||e.includes('partido')));checks++;
 console.log(`OG1 ${lang}: planta de data trocada e planta de partido trocado recusadas.`);
 for(const[id,p]of Object.entries(proofs)){
  const receipt=parse(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
  if(!p.name){assert.equal(receipt.querySelector('.linha-nome-da-fonte'),null,id+': título usado como rótulo');checks++;}
  if(lang==='en'&&id.startsWith('og1-utao-')){assert.equal(receipt.querySelector('.linha-excerto [data-linha-campo="excerpt"]')?.getAttribute('lang'),'pt-PT',id+': língua do excerto');checks++;}
  if(p.entity_aliases){const publisher=Object.keys(p.entity_aliases)[0];assert.equal(claims.get(id).source,publisher);assert.equal(receipt.querySelector('.linha-atribuicao [data-linha-campo="source"]')?.text,publisher);assert(receipt.text.includes(p.attributed_to[0]));checks++;}
 }

 assert.equal(item.querySelector('[data-discussao-parte="como-foi-dito"]').querySelectorAll('[data-discussao-paragrafo]').length,11);checks++;
 for(const span of item.querySelectorAll('[data-linha-trecho]')){
  const row=claims.get(span.getAttribute('data-linha-claim')),field=span.getAttribute('data-linha-campo');
  const text=field==='excerpt'?row.excerpt:row.document.title;
  assert(text.includes(span.text));assert.equal(span.text,span.getAttribute('data-linha-trecho'));checks++;
 }
 for(const section of ['fontes','conclusao']){
  const copy=parse(item.querySelector(`[data-discussao-parte="${section}"]`).toString());copy.querySelectorAll('.src-chip').forEach(n=>n.remove());
  assert(copy.text.includes(lang==='pt'?'11 % acima':'11 % above'));checks++;
 }
 assert(item.querySelector('[data-discussao-saude]')?.getAttribute('href').endsWith('#saude-no-orcamento'));checks++;
 for(const id of Object.keys(JSON.parse(fs.readFileSync('ledger/provas/og1a/provas.json')).rows))assert(fs.existsSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`));checks++;
}
console.log(`PASS: ${checks} conferências OG1 das formas, fontes e recibos nas duas edições.`);
