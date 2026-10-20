import { apoioLiteralEo1, dataLiteralEo1, retirarAnosIsoladosEo1 } from '../../scripts/literais-eo1-do-portao.mjs';
/** EO1: prova independente dos intervalos, citações e literais no HTML construído. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { NOMES_EO1 } from '../../src/data/nomes-eo1.mjs';
import { conferirNomeEo1 } from '../../scripts/nomes-eo1-do-portao.mjs';
import { retirarCitacoesEo1 } from '../../scripts/citacoes-eo1-do-portao.mjs';
import { portasObrigatoriasEo1 } from '../../scripts/portas-eo1-do-portao.mjs';
import { localizadorEo1Confere } from '../../scripts/localizadores-eo1-do-portao.mjs';
import { superficieDe } from '../../scripts/voz-palavras.mjs';
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
// Este modo expõe o código da recusa da célula, sem depender de um build.
if (process.argv.includes('--planta-literal')) {
 const plant={proof_rows:{apoio:{locator:'Artigo 18.º'}},blocks:[{text:'8.º',source_rows:['apoio'],proofs:[{tipo:'literal',inicio:0,fim:3,texto:'8.º',apoios:[{id:'apoio',campo:'locator'}]}],figures:[]}]};
 try {prove(plant,'pt');console.log('Planta literal aceite indevidamente.');process.exit(0);}
 catch(error) {if(error instanceof assert.AssertionError && /literal sem prova inteira/.test(error.message)){console.log('Recusado: literal 8.º sem prova inteira em Artigo 18.º.');process.exit(1);}throw error;}
}
const claims=loadClaims();
let localizadores=0;
for (const c of claims.values()) {
 if(c.study!==slug) continue;
 assert(c.name && c.name_en,'linha sem nome bilingue: '+c.id);
 assert(localizadorEo1Confere(c.name_source,c),'nome, período ou localizador sem prova: '+c.id); localizadores++;
 const alteracoes=[x=>x.name+=' alterado',x=>x.name_en+=' altered',x=>x.reference_date='1900'];
 if(c.document)alteracoes.push(x=>x.document.page++,x=>x.document.source_sha256='0'.repeat(64),x=>x.document.locator+=' alterado');
 for(const altera of alteracoes) {
  const x=structuredClone(c);altera(x);assert(!localizadorEo1Confere(x.name_source,x),'nome, período ou localizador alterado aceite: '+c.id);
 }
 assert(!localizadorEo1Confere(c.name_source+' alterado',c),'coordenada alterada aceite');
}
console.log(`EO1: ${localizadores} localizadores, nomes e períodos conferidos em todas as linhas, com alterações rejeitadas.`);
const quotedClaim=[...claims.values()].find(c=>c.value===c.excerpt&&['texto','afirmação'].includes(c.unit)&&/\blimiar\b/.test(c.excerpt));
assert(quotedClaim,'controlo da citação ausente');
const htmlQuote=text=>`<body><span data-claim="${quotedClaim.id}">${text.replaceAll('&','&amp;').replaceAll('<','&lt;')}</span></body>`;
assert(!superficieDe(htmlQuote(quotedClaim.excerpt)).includes('limiar'),'citação integral confundida com prosa');
assert(superficieDe(htmlQuote(quotedClaim.excerpt+' limiar')).includes('limiar'),'marca não pode dispensar texto acrescentado');
function field(row,type,lang,modificador){
 if(type==='excerto')return norm(row.excerpt);
 if(type==='documento')return row.document.title;
 if(type==='medida')return row[lang==='pt'?'measure':'measure_en'];
 if(type==='atribuicao')return row.attributed_to.join(', ');
 const raw=String(row.value), c=claims.get(row.id);
 if(row.unit==='data') return dataLiteralEo1(raw,lang);
 // As linhas AN e DOM já atravessaram por outros manifestos; a comparação
 // dos seus valores continua independente do intervalo do documento.
 let value=c?String(c.value):raw;
 if(modificador==='abs')value=value.replace(/^[+−-]/,'');
 else assert(modificador===undefined,'modificador desconhecido');
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
   assert(q.modificador===undefined || (q.tipo==='valor'&&q.modificador==='abs'),'modificador fora de um valor');
   if(q.tipo==='literal'){
    assert(q.apoios.length,'literal sem linha');
    assert.equal(q.texto,dataLiteralEo1(q.origem ?? q.texto,lang),'data literal divergente');
    for(const a of q.apoios){assert(['excerpt','locator','published_at'].includes(a.campo),'campo de apoio literal inválido');assert(block.source_rows.includes(a.id),'apoio fora do parágrafo');assert(apoioLiteralEo1(record.proof_rows[a.id],a.campo,q.origem ?? q.texto),'literal sem prova inteira');}
   }else{
    const row=record.proof_rows[q.id];assert.equal(sha(row),q.sha256_linha,'linha alterada: '+q.id);assert.equal(field(row,q.tipo,lang,q.modificador),q.texto,'valor ou excerto divergente');
   }
   for(let i=q.inicio;i<q.fim;i++)covered.add(i);
  }
  const outside=retirarAnosIsoladosEo1(chars.map((c,i)=>covered.has(i)?' ':c).join(''));assert(!/\d/.test(outside),'algarismo sem linha');
  for(const f of block.figures){assert.equal(f.value,String(record.proof_rows[f.row].value),'valor do registo alterado');assert.equal(chars.slice(f.start,f.end).join(''),f.printed);}
 }
}
// A planta passa pela célula inteira, conservando apoios não vazios.
const plantaLiteral = {proof_rows:{apoio:{locator:'Artigo 18.º'}},blocks:[{text:'8.º',source_rows:['apoio'],proofs:[{tipo:'literal',inicio:0,fim:3,texto:'8.º',apoios:[{id:'apoio',campo:'locator'}]}],figures:[]}]};
assert.throws(()=>prove(plantaLiteral,'pt'),/literal sem prova inteira/);
const literalCorreto=structuredClone(plantaLiteral);literalCorreto.proof_rows.apoio.locator='Artigo 8.º';prove(literalCorreto,'pt');
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
 const rotaPortas={key:'estudo',lang,params:{slug}};
 assert.deepEqual(portasObrigatoriasEo1(page,rotaPortas).erros,[]);
 for(const altera of [r=>r.querySelector('[data-fontes-da-unidade] a').remove(),r=>r.querySelector('[data-fontes-da-unidade] a').setAttribute('href','/errado'),r=>r.querySelector('[data-fontes-da-unidade] a').set_content('Inventado')]) {
  const x=parse(page.outerHTML);altera(x);assert(portasObrigatoriasEo1(x,rotaPortas).erros.length);
 }
 assert.equal(portasObrigatoriasEo1(page,{...rotaPortas,params:{slug:'outro'}}).portas.size,0);
 const quoteCopy=parse(page.outerHTML);retirarCitacoesEo1(quoteCopy,rotaPortas,claims);
 assert(!quoteCopy.text.includes('Governo Constitucional'),'citação literal contada como voz própria');
 const extraCopy=parse(page.outerHTML);extraCopy.querySelector('[data-registo-unidade]').insertAdjacentHTML('beforeend',' Governo Constitucional');retirarCitacoesEo1(extraCopy,rotaPortas,claims);
 assert(extraCopy.text.includes('Governo Constitucional'),'prosa acrescentada escondida como citação');
 for(const block of record.blocks){
  const el=page.querySelector(`[data-registo-unidade="${slug}/${lang}#${block.i}"]`);assert(el,'unidade ausente no HTML');
  for(const seal of el.querySelectorAll('[data-selo-etiqueta]'))seal.remove();
  assert.equal(norm(el.textContent),norm(block.text),'HTML diverge da linha do documento');units++;
  if(block.kind==='paragraph'&&block.source_rows?.length){
   const doors=page.querySelectorAll(`[data-fontes-da-unidade="${slug}/${lang}#${block.i}"]`);
   assert.equal(doors.length,1,'porta de fontes ausente ou repetida');
   assert.deepEqual(doors[0].querySelectorAll('li a').map(a=>a.getAttribute('href')),
    block.source_rows.map(id=>lang==='pt'?`/livro-razao/${id}`:`/en/ledger/${id}`),'porta trocada');
  }
 }
 const raw=parse(fs.readFileSync(`studies-src/${slug}/${lang}.html`,'utf8'));
 const actual=raw.querySelectorAll('body h1,body h2,body p').map(el=>norm(el.textContent));
 assert.deepEqual(actual,record.blocks.map(b=>norm(b.text)),'documento alojado diverge');
 const documentRoute=lang==='pt'?`estudos/${slug}/documento`:`en/studies/${slug}/document`;
 const documentPage=parse(fs.readFileSync(`${dist}/${documentRoute}/index.html`,'utf8'));
 const documentRota={...rotaPortas,key:'documento'};assert.deepEqual(portasObrigatoriasEo1(documentPage,documentRota).erros,[]);
 for(const altera of [r=>r.querySelector('[data-oedp-marca]').setAttribute('href','/errado'),r=>r.querySelector('[data-oedp-voltar]').set_content('Inventado'),r=>r.querySelector('[data-oedp-moldura] a').remove(),r=>r.querySelector('[data-oedp-faixa]').insertAdjacentHTML('beforeend','<a href="/extra">Extra</a>')]) {
  const x=parse(documentPage.outerHTML);altera(x);assert(portasObrigatoriasEo1(x,documentRota).erros.length);
 }
 const built=documentPage.querySelector('[data-oedp-moldura]');assert(built,'moldura do documento ausente');
 assert.deepEqual(built.querySelectorAll('h1,h2,p').map(el=>norm(el.textContent)),actual,'documento construído diverge');
 const changed=structuredClone(record);changed.blocks.find(b=>b.figures.length).figures[0].value+='1';assert.throws(()=>prove(changed,lang));
 const cut=structuredClone(record);const b=cut.blocks.find(b=>b.proofs.some(p=>p.tipo==='excerto'));const quoted=b.proofs.find(p=>p.tipo==='excerto');const characters=Array.from(b.text);characters.splice(quoted.inicio,1);b.text=characters.join('');assert.throws(()=>prove(cut,lang));
 const literal=structuredClone(record);literal.blocks.flatMap(b=>b.proofs).find(p=>p.tipo==='literal').apoios=[];assert.throws(()=>prove(literal,lang));
 console.log(`EO1 ${lang}: plantas valor, excerto e literal recusadas (código de recusa 1).`);
}
console.log(`EO1: PASS ${units} unidades do HTML, provas e três plantas por edição.`);
