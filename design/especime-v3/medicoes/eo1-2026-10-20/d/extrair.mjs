/** EO1-d: frases e recibos lidos do HTML, com confronto das quatro rotas com os registos. */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
const folder='design/especime-v3/medicoes/eo1-2026-10-20/d',slug='orcamento-2027-o-que-muda-e-para-quem';
const norm=s=>s.replace(/\s+/g,' ').trim();
const withoutSeals=el=>{const copy=parse(el.toString());copy.querySelectorAll('[data-selo-etiqueta],.selo').forEach(x=>x.remove());return norm(copy.textContent);};
const result={cabeca:JSON.parse(fs.readFileSync('dist/version.json','utf8')).commit,edicoes:[],recibos:[]};
for(const lang of ['pt','en']){
 const before=JSON.parse(execFileSync('git',['show',`b4dc4869c:registos/${slug}/${lang}.record.json`],{encoding:'utf8',maxBuffer:10*1024*1024}));
 const record=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8'));
 const route=lang==='pt'?`estudos/${slug}`:`en/studies/${slug}`;
 const study=parse(fs.readFileSync(`dist/${route}/index.html`,'utf8'));
 const document=parse(fs.readFileSync(`dist/${route}/${lang==='pt'?'documento':'document'}/index.html`,'utf8'));
 const blocks=record.blocks.map(b=>{
  const el=study.querySelector(`[data-registo-unidade="${slug}/${lang}#${b.i}"]`);assert(el);
  el.querySelectorAll('[data-selo-etiqueta]').forEach(x=>x.remove());
  const text=norm(el.textContent);assert.equal(text,norm(b.text));
  assert(norm(document.querySelector('[data-oedp-moldura]').textContent).includes(text),`documento ${lang} unidade ${b.i}`);
  return {unidade:b.i,alterada:norm(before.blocks.find(x=>x.i===b.i)?.text??'')!==text,texto:text,fontes:b.source_rows,literais:b.proofs.filter(p=>p.tipo==='literal')};
 });
 const siglas=Object.fromEntries(['SIFIDE','AP','AR','OE'].map(a=>{const regex=new RegExp('\\b'+a+'(?=\\b|\\d)');const b=blocks.find(b=>regex.test(b.texto));return[a,{unidade:b.unidade,contexto:b.texto.slice(Math.max(0,b.texto.search(regex)-130),b.texto.search(regex)+160)}]}));
 result.edicoes.push({lingua:lang,rotas:[route,`${route}/${lang==='pt'?'documento':'document'}`],blocos:blocks,siglas});
}
const samples=[...['pt','en'].flatMap(lang=>['irs-2027-escalao-1-limite','oe-2027-rmmg-2024','irc-taxa-2027'].map(id=>({lang,id,tipo:'familia'}))),
 ...[['pt','der-oe2027-juros-variacao-cn'],['pt','der-oe2027-medidas-soma-derivadas'],['en','der-divida-pt-vs-ue-2025'],['en','der-rmmg-2026-2027-pct']].map(([lang,id])=>({lang,id,tipo:'derivada'})),
 {lang:'pt',id:'posicao-be-rendimentos',tipo:'imprensa'},{lang:'en',id:'posicao-governo-divida85-citacao',tipo:'imprensa'}];
for(const sample of samples){
 const {lang,id}=sample;const page=parse(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
 const sections={};
 for(const [key,selector] of Object.entries({titulo:'.linha-titulo',nome:'.linha-nome-da-fonte',definicao:'[data-o-que-e-parte="o-que-e"]',valor:'.linha-valor',aritmetica:'[data-linha-campo="derivation"]'})){
  const el=page.querySelector(selector);if(el)sections[key]=withoutSeals(el);
 }
 sections.proveniencia=page.querySelectorAll('.aparelho-nota').map(el=>norm(el.textContent)).filter(t=>/^(Por confirmar|To be confirmed|Completa\.|Complete\.)/.test(t));
 result.recibos.push({...sample,...sections});
}
fs.writeFileSync(`${folder}/html-extraido.json`,JSON.stringify(result,null,2)+'\n');
let out='\n### Frases desta passagem, extraídas das quatro rotas\n\n';
for(const e of result.edicoes){out+=`#### ${e.lingua}\n\n`;for(const b of e.blocos.filter(b=>b.alterada))out+=`**Unidade ${b.unidade}.** ${b.texto}\n\n`;}
out+='### Recibos tal como renderizam\n\n';
for(const r of result.recibos){out+=`#### ${r.lang}: ${r.id}\n\n`;for(const [k,v] of Object.entries(r).filter(([k])=>!['lang','id','tipo'].includes(k)))out+=`${k}: ${Array.isArray(v)?v.join(' '):v}\n\n`;}
fs.writeFileSync(`${folder}/frases-e-recibos.md`,out);
console.log(`EO1-d HTML: ${result.edicoes.length} edições, ${result.edicoes.reduce((n,e)=>n+e.blocos.length,0)} blocos conferidos, ${samples.length} recibos extraídos.`);
