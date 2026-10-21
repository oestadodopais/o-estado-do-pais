/** HB1: citações e metadados contra as linhas provadas e os corpos recebidos. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {ORIGENS_HB1C} from '../src/data/figuras.mjs';
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const safe=f=>typeof f==='string'&&/^content\/(23 Habitacao|24 Orcamento 2027 Analise|25 Orcamento 2027 Medidas)\/source\//.test(f)&&!f.split('/').includes('..');
function text(raw){const t=parse(raw.toString('utf8'));t.querySelectorAll('head,script,style').forEach(e=>e.remove());return normal(parse(t.toString().replace(/<\/?(?:p|div|li|br|h1|h2|h3|td|tr)\b[^>]*>/gi,' ').replace(/<[^>]*>/g,'')).textContent);}
export function ficheiroDaReferencia(ref) {
 const f=ref?.file;
 if(typeof f!=='string'||!/^source\//.test(f)||f.includes('\\')||f.split('/').some(p=>!p||p==='..'||p==='.'))return null;
 return 'content/23 Habitacao/'+f;
}
export function conferirCorpoReferencia(ref,proof,raw,body,referenceDate){
 const errors=[],file=ficheiroDaReferencia(ref);
 if(!file||proof?.file!==file||!/^[a-f0-9]{64}$/.test(ref?.sha256??'')||proof?.sha256!==ref.sha256||proof?.receipt?.sha256!==ref.sha256||proof?.receipt?.estado!==200||proof?.receipt?.ficheiro!==path.posix.basename(file??''))errors.push('HB1 referência: recibo ou caminho suplementar divergente');
 if(ref?.date!==referenceDate)errors.push('HB1 referência: data suplementar divergente');
 const dates=[...String(ref?.text??'').matchAll(/\b(\d{4})-(\d{2})-(\d{2})(?!\d)|\b(\d{2})\/(\d{2})\/(\d{4})(?!\d)/g)].map(m=>m[1]?`${m[1]}-${m[2]}-${m[3]}`:`${m[6]}-${m[5]}-${m[4]}`);
 const unique=[...new Set(dates)];
 const date=unique[0],parsed=date?new Date(date+'T00:00:00Z'):null;
 if(unique.length!==1||!parsed||!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==date||date!==ref?.date||date!==referenceDate)errors.push('HB1 referência: data não provada pela âncora suplementar');
 if(raw){
  if(sha(raw)!==ref.sha256)errors.push('HB1 referência: corpo suplementar divergente');
  if(!ref.text||!normal(body??text(raw)).includes(normal(ref.text))&&!normal(raw.toString('utf8')).includes(normal(ref.text)))errors.push('HB1 referência: âncora suplementar ausente');
 }
 return errors;
}
export function conferirHb1(c,p,raw,body,reference={}){
 const errors=[];if(!p)return ['HB1 selo: prova ausente'];
 const r=p.row,d=r.document;
 if(!c||!safe(d.file)||!/^[a-f0-9]{64}$/.test(d.source_sha256??'')||p.receipt?.sha256!==d.source_sha256||p.receipt?.estado!==200||c.document?.source_sha256!==d.source_sha256)errors.push('HB1 selo: recibo ou linha divergente');
 if(raw&&sha(raw)!==d.source_sha256)errors.push('HB1 selo: corpo divergente');
 if(Boolean(c?.afirmacao)!==Boolean(r.afirmacao)||c.unit!==r.unit||c.document?.kind!==(d.file.endsWith('.pdf')?'pdf':'html'))errors.push('HB1 medida: tipo divergente');
 if(c?.value!==r.value||c.excerpt!==r.excerpt||c.value!==c.excerpt)errors.push('HB1 excerto: citação divergente');
 if(JSON.stringify(c?.attributed_to)!==JSON.stringify(r.attributed_to)||JSON.stringify(c?.attributed_to_en??null)!==JSON.stringify(r.attributed_to_en??null))errors.push('HB1 atribuição: nome divergente');
 if((c?.published_at??null)!==r.published_at||c.reference_date!==(r.reference_date??'[a verificar]')||c.document?.edition!==(d.edition??r.reference_date??'[a verificar]'))errors.push('HB1 data: publicação ou período divergente');
 if(r.published_at===null && !(r.document_checks?.published_at?.status==='por confirmar'&&r.document_checks.published_at.reason))errors.push('HB1 data: ausência não documentada');
 if((c?.period??null)!==(r.period??null))errors.push('HB1 data: período dos dados divergente');
 if(r.period&&!(r.document_checks?.period?.status==='conferido'&&r.document_checks.period.date===r.period&&r.excerpt.includes(r.document_checks.period.text)&&new RegExp(`(?<!\\d)${r.period}(?!\\d)`).test(r.document_checks.period.text)))errors.push('HB1 data: período dos dados sem âncora no excerto');
 const expectedUrl=r.source_url.split('#')[0].toLowerCase().endsWith('.pdf')&&d.page?r.source_url.split('#')[0]+'#page='+d.page:r.source_url;
 if(c?.source_url!==expectedUrl||![p.receipt?.pedido,p.receipt?.endereco_final].includes(r.source_url))errors.push('HB1 porta: endereço divergente');
 if(raw){
  const t=normal(body??text(raw));
  if(!t.includes(normal(r.excerpt)))errors.push('HB1 excerto: ausente do corpo');
  const a=r.document_checks?.attributed_to?.text;
  if(a&&!t.includes(normal(a)))errors.push('HB1 atribuição: âncora ausente');
  const date=r.document_checks?.published_at?.text;
  if(date&&!t.includes(normal(date))&&!normal(raw.toString('utf8')).includes(normal(date)))errors.push('HB1 data: âncora ausente');
  const ref=r.document_checks?.reference_date;
  if(ref?.text&&!ref.file&&!t.includes(normal(ref.text))&&!normal(raw.toString('utf8')).includes(normal(ref.text)))errors.push('HB1 data: âncora de referência ausente');
 }
 const ref=r.document_checks?.reference_date;
 if(ref?.file){
  const same=ficheiroDaReferencia(ref)===d.file;
  const refRaw=same?raw:reference.raw,refBody=same?body:reference.body;
  errors.push(...conferirCorpoReferencia(ref,p.reference_source,refRaw,refBody,r.reference_date));
  if(raw&&!refRaw)errors.push('HB1 referência: corpo suplementar indisponível');
 }
 return errors;
}
/* HB1-c4 (21.10.2026): o selo de cada origem das definições da habitação
   (ORIGENS_HB1C) contra o ficheiro no motor: o ficheiro existe, o sha256 é o do
   selo e o excerto está no corpo (HTML sem etiquetas e com os espaços
   normalizados; JSON na cadeia do campo). Só com o motor; sem ele não conta. */
const seguroNoMotor=(/** @type {unknown} */ f)=>typeof f==='string'&&/^content\/[^/]+\/source\/[^\\]+$/.test(f)&&!f.split('/').includes('..');
/** @param {string} ficheiro @param {Buffer} raw @param {string} campo */
export function textoDaOrigemHb1c(ficheiro,raw,campo){
 if(ficheiro.endsWith('.json')){/** @type {any} */ let v=JSON.parse(raw.toString('utf8'));for(const k of String(campo).split('.'))v=v?.[k];return typeof v==='string'?normal(v):'';}
 const t=parse(raw.toString('utf8'));t.querySelectorAll('head,script,style').forEach(e=>e.remove());return normal(t.textContent);
}
/** @param {any} o @param {Buffer|undefined} raw */
export function conferirOrigemHb1c(o,raw){
 const s=o?.selo;if(!seguroNoMotor(s?.motor))return ['HB1-c origem: o ficheiro do selo não está no motor'];
 if(!raw)return ['HB1-c origem: corpo indisponível no motor'];
 const errors=[];if(sha(raw)!==s.sha256)errors.push('HB1-c origem: o sha256 do selo não é o do ficheiro no motor');
 let t='';try{t=textoDaOrigemHb1c(s.motor,raw,s.campo);}catch{errors.push('HB1-c origem: corpo ilegível');}
 if(!normal(o.excerto)||!t.includes(normal(o.excerto)))errors.push('HB1-c origem: o excerto não está no corpo');
 return errors;
}
/** @param {string|undefined} motor @param {boolean} plantar */
function conferirOrigensHb1c(motor,plantar){
 const errors=[],plantas=[];let origens=0;if(!motor)return {errors,plantas,origens};
 for(const [chave,o] of Object.entries(ORIGENS_HB1C)){
  let raw;try{if(seguroNoMotor(o.selo?.motor))raw=fs.readFileSync(path.join(motor,o.selo.motor));}catch{}
  errors.push(...conferirOrigemHb1c(o,raw).map(e=>chave+': '+e));origens++;
  if(plantar&&raw&&!plantas.length){
   for(const [nome,mudar] of [['o sha256 trocado',(/** @type {any} */ x)=>{x.selo.sha256='0'.repeat(64);}],['o excerto alterado',(/** @type {any} */ x)=>{x.excerto+=' Alterado na planta HB1-c4.';}]]){
    const bad=structuredClone(o);mudar(bad);const mensagem=conferirOrigemHb1c(bad,raw)[0];plantas.push({nome:'HB1-c origem: '+nome,mensagem});if(!mensagem)errors.push('HB1-c planta de origem sem recusa: '+nome);
   }
  }
 }
 return {errors,plantas,origens};
}
export function conferirAfirmacoesHb1(claims,{motor,plantar=true}={}){
 const file='ledger/provas/hb1/provas.json';if(!fs.existsSync(file)){const o=conferirOrigensHb1c(motor,plantar);return {errors:o.errors,plantas:o.plantas,ids:new Set(),checked:0,bodies:0,origens:o.origens};}
 const proofs=JSON.parse(fs.readFileSync(file,'utf8')).rows;const errors=[],plantas=[],ids=new Set();let checked=0,bodies=0;
 for(const [id,p] of Object.entries(proofs)){
  ids.add(id);const c=claims.get(id);let raw,body;const reference={};
  if(motor&&safe(p.row.document.file)){
   try{const f=path.join(motor,p.row.document.file);raw=fs.readFileSync(f);bodies++;if(f.endsWith('.pdf'))body=execFileSync('pdftotext',['-layout',f,'-'],{encoding:'utf8',maxBuffer:32*1024*1024});}
   catch{errors.push(id+': HB1 corpo indisponível');}
  }
  const ref=p.row.document_checks?.reference_date,refFile=ficheiroDaReferencia(ref);
  if(motor&&refFile&&refFile!==p.row.document.file){
   try{reference.raw=fs.readFileSync(path.join(motor,refFile));bodies++;if(refFile.endsWith('.pdf'))reference.body=execFileSync('pdftotext',['-layout',path.join(motor,refFile),'-'],{encoding:'utf8',maxBuffer:32*1024*1024});}
   catch{errors.push(id+': HB1 referência: corpo suplementar indisponível');}
  }
  errors.push(...conferirHb1(c,p,raw,body,reference).map(e=>id+': '+e));checked++;
  if(plantar&&ref?.file&&!plantas.some(p=>p.nome==='HB1 referência suplementar: recibo')){
   const refRaw=refFile===p.row.document.file?raw:reference.raw,refBody=refFile===p.row.document.file?body:reference.body;
   for(const [nome,change] of [
    ['recibo',x=>x.proof.receipt.sha256='0'.repeat(64)],
    ['caminho',x=>x.ref.file='source/../fora.html'],
    ['data',x=>x.ref.date='2000-01-01'],
    ['data e referência',x=>{x.ref.date='2000-01-01';x.referenceDate='2000-01-01';}],
    ...(refRaw?[
     ['corpo',x=>x.raw=Buffer.concat([x.raw,Buffer.from(' Alterado')])],
     ['âncora',x=>x.ref.text='Âncora deliberadamente alterada na planta HB1'],
    ]:[]),
   ]){
    const x={ref:structuredClone(ref),proof:structuredClone(p.reference_source),raw:refRaw,body:refBody,referenceDate:p.row.reference_date};
    if(!x.proof){errors.push(id+': HB1 referência suplementar: falta a prova para plantar');break;}
    change(x);const mensagem=conferirCorpoReferencia(x.ref,x.proof,x.raw,x.body,x.referenceDate)[0];
    plantas.push({nome:'HB1 referência suplementar: '+nome,mensagem});if(!mensagem)errors.push('HB1 planta suplementar sem recusa: '+nome);
   }
  }
  if(plantar&&c&&p?.row?.document_checks?.period){
   // HB1-c3: o ano dos dados de uma estimativa; o controlo é a própria linha, sem erro.
   for(const [nome,mudar] of [['período do sítio trocado',(/** @type {any} */ y,/** @type {any} */ q)=>{y.period='2020';}],['período sem âncora',(/** @type {any} */ y,/** @type {any} */ q)=>{q.row.document_checks.period.text='Proposta de Lei';}],['período do motor e do sítio trocados juntos',(/** @type {any} */ y,/** @type {any} */ q)=>{y.period='2011';q.row.period='2011';}]]){
    const bad=structuredClone(c),q=structuredClone(p);mudar(bad,q);const mensagem=conferirHb1(bad,q,raw,body,reference).find(e=>e.startsWith('HB1 data: período'));plantas.push({nome:'HB1 '+nome,mensagem});if(!mensagem)errors.push('HB1 planta sem recusa: '+nome);
   }
  }
  if(plantar&&!plantas.some(p=>p.nome==='HB1 excerto')&&c){
   for(const [nome,change] of [['excerto',x=>x.excerpt+=' Alterado.'],['valor',x=>x.value+=' Alterado.'],['atribuição',x=>x.attributed_to=[]],['atribuição inglesa',x=>x.attributed_to_en=['Alterado']],['data',x=>x.published_at='2000-01-01'],['referência',x=>x.reference_date='2000-01-01'],['edição',x=>x.document.edition='2000-01-01'],['porta',x=>x.source_url='https://example.invalid/'],['selo',x=>x.document.source_sha256='0'.repeat(64)]]){
    const bad=structuredClone(c);change(bad);const mensagem=conferirHb1(bad,p,raw,body,reference)[0];plantas.push({nome:'HB1 '+nome,mensagem});if(!mensagem)errors.push('HB1 planta sem recusa: '+nome);
   }
  }
 }
 const o=conferirOrigensHb1c(motor,plantar);errors.push(...o.errors);plantas.push(...o.plantas);
 return {errors,plantas,ids,checked,bodies,origens:o.origens};
}
