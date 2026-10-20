/** EO1: prova independente dos intervalos, citações e literais no HTML construído. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { NOMES_EO1 } from '../../src/data/nomes-eo1.mjs';
import { conferirNomeEo1 } from '../../scripts/nomes-eo1-do-portao.mjs';
const slug='orcamento-2027-o-que-muda-e-para-quem';
const norm=s=>String(s).replace(/[\u00a0\u202f]/g,' ');
// Python conserva a distinção entre 300 e 300.0 no resumo da linha.
// Os lexemas numéricos vêm dos bytes do registo, sem alterar a linha em teste.
let numberShape={};
function canonical(x,shape){
 if(typeof x==='number')return shape?.rawNumber!==undefined&&Number(shape.rawNumber)===x?shape.rawNumber:JSON.stringify(x);
 if(Array.isArray(x))return '['+x.map((v,i)=>canonical(v,shape?.[i])).join(',')+']';
 if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k],shape?.[k])).join(',')+'}';
 return JSON.stringify(x);
}
const sha=x=>createHash('sha256').update(canonical(x,numberShape[x.id])).digest('hex');
const claims=loadClaims();
function field(row,type,lang){
 if(type==='excerto')return norm(row.excerpt);
 if(type==='documento')return row.document.title;
 if(type==='medida')return row[lang==='pt'?'measure':'measure_en'];
 if(type==='atribuicao')return row.attributed_to.join(', ');
 const raw=String(row.value), c=claims.get(row.id);
 // As linhas AN e DOM já atravessaram por outros manifestos; a comparação
 // dos seus valores continua independente do intervalo do documento.
 const value=c?String(c.value):raw;
 if(!/^[−+\-]?[\d\s\u202f\u00a0]+(?:,\d+)?$/.test(value))return norm(raw);
 if(lang==='pt')return norm(value);
 const [whole,frac]=value.replace(/[\s\u202f\u00a0]/g,'').split(',');
 return whole.replace(/(\d)(?=(\d{3})+(?!\d))/g,'$1,')+(frac===undefined?'':'.'+frac);
}
export function prove(record,lang){
 for(const block of record.blocks){
  const chars=Array.from(block.text),covered=new Set();let end=0;
  for(const q of block.proofs){
   assert(q.inicio>=end&&q.fim>q.inicio&&q.fim<=chars.length,'intervalo inválido');end=q.fim;
   assert.equal(chars.slice(q.inicio,q.fim).join(''),q.texto,'excerto ou valor cortado');
   if(q.tipo==='literal'){
    assert(q.apoios.length,'literal sem linha');
    for(const a of q.apoios){assert(block.source_rows.includes(a.id),'apoio fora do parágrafo');assert(String(record.proof_rows[a.id][a.campo]).includes(q.texto),'literal sem prova');}
   }else{
    const row=record.proof_rows[q.id];assert.equal(sha(row),q.sha256_linha,'linha alterada: '+q.id);assert.equal(field(row,q.tipo,lang),q.texto,'valor ou excerto divergente');
   }
   for(let i=q.inicio;i<q.fim;i++)covered.add(i);
  }
  const outside=chars.map((c,i)=>covered.has(i)?' ':c).join('').replace(/(?<!\d)(?:19|20)\d\d(?!\d)/g,'');assert(!/\d/.test(outside),'algarismo sem linha');
  for(const f of block.figures){assert.equal(f.value,String(record.proof_rows[f.row].value),'valor do registo alterado');assert.equal(chars.slice(f.start,f.end).join(''),f.printed);}
 }
}
const dist=process.env.OEDP_DIST??'dist';let units=0;
for(const lang of ['pt','en']){
 const recordBytes=fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8');const record=JSON.parse(recordBytes);numberShape=JSON.parse(recordBytes,(k,v,c)=>typeof v==='number'?{rawNumber:c.source}:v).proof_rows;prove(record,lang);
 for(const [id,names] of Object.entries(NOMES_EO1)) {
  assert.equal(conferirNomeEo1(id,lang,names[lang],record.proof_rows),null);
  assert(conferirNomeEo1(id,lang,names[lang]+' 999',record.proof_rows));
  assert(conferirNomeEo1(id,lang,names[lang],{}));
  if(/\d/.test(names[lang])) assert(conferirNomeEo1(id,lang,names[lang],{[id]:{}}));
 }
 const route=lang==='pt'?`estudos/${slug}`:`en/studies/${slug}`;
 const page=parse(fs.readFileSync(`${dist}/${route}/index.html`,'utf8'));
 for(const block of record.blocks){
  const el=page.querySelector(`[data-registo-unidade="${slug}/${lang}#${block.i}"]`);assert(el,'unidade ausente no HTML');
  for(const seal of el.querySelectorAll('[data-selo-etiqueta]'))seal.remove();
  assert.equal(norm(el.textContent),norm(block.text),'HTML diverge da linha do documento');units++;
 }
 const raw=parse(fs.readFileSync(`studies-src/${slug}/${lang}.html`,'utf8'));
 const actual=raw.querySelectorAll('body h1,body h2,body p').map(el=>norm(el.textContent));
 assert.deepEqual(actual,record.blocks.map(b=>norm(b.text)),'documento alojado diverge');
 const documentRoute=lang==='pt'?`estudos/${slug}/documento`:`en/studies/${slug}/document`;
 const built=parse(fs.readFileSync(`${dist}/${documentRoute}/index.html`,'utf8')).querySelector('[data-oedp-moldura]');assert(built,'moldura do documento ausente');
 assert.deepEqual(built.querySelectorAll('h1,h2,p').map(el=>norm(el.textContent)),actual,'documento construído diverge');
 const changed=structuredClone(record);changed.blocks.find(b=>b.figures.length).figures[0].value+='1';assert.throws(()=>prove(changed,lang));
 const cut=structuredClone(record);const b=cut.blocks.find(b=>b.proofs.some(p=>p.tipo==='excerto'));const quoted=b.proofs.find(p=>p.tipo==='excerto');const characters=Array.from(b.text);characters.splice(quoted.inicio,1);b.text=characters.join('');assert.throws(()=>prove(cut,lang));
 const literal=structuredClone(record);literal.blocks.flatMap(b=>b.proofs).find(p=>p.tipo==='literal').apoios=[];assert.throws(()=>prove(literal,lang));
 console.log(`EO1 ${lang}: plantas valor, excerto e literal recusadas (código de recusa 1).`);
}
console.log(`EO1: PASS ${units} unidades do HTML, provas e três plantas por edição.`);
