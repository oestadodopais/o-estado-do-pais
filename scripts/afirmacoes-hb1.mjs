/** HB1: citações e metadados contra as linhas provadas e os corpos recebidos. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const safe=f=>typeof f==='string'&&/^content\/(23 Habitacao|24 Orcamento 2027 Analise|25 Orcamento 2027 Medidas)\/source\//.test(f)&&!f.split('/').includes('..');
function text(raw){const t=parse(raw.toString('utf8'));t.querySelectorAll('head,script,style').forEach(e=>e.remove());return normal(parse(t.toString().replace(/<\/?(?:p|div|li|br|h1|h2|h3|td|tr)\b[^>]*>/gi,' ').replace(/<[^>]*>/g,'')).textContent);}
export function conferirHb1(c,p,raw,body){
 const errors=[];if(!p)return ['HB1 selo: prova ausente'];
 const r=p.row,d=r.document;
 if(!c||!safe(d.file)||!/^[a-f0-9]{64}$/.test(d.source_sha256??'')||p.receipt?.sha256!==d.source_sha256||p.receipt?.estado!==200||c.document?.source_sha256!==d.source_sha256)errors.push('HB1 selo: recibo ou linha divergente');
 if(raw&&sha(raw)!==d.source_sha256)errors.push('HB1 selo: corpo divergente');
 if(c?.afirmacao!==true||r.afirmacao!==true||c.unit!==r.unit||c.document?.kind!==(d.file.endsWith('.pdf')?'pdf':'html'))errors.push('HB1 medida: tipo divergente');
 if(c?.value!==r.value||c.excerpt!==r.excerpt||c.value!==c.excerpt)errors.push('HB1 excerto: citação divergente');
 if(JSON.stringify(c?.attributed_to)!==JSON.stringify(r.attributed_to))errors.push('HB1 atribuição: nome divergente');
 if((c?.published_at??null)!==r.published_at||c.reference_date!==(r.reference_date??'[a verificar]'))errors.push('HB1 data: publicação ou período divergente');
 if(r.published_at===null && !(r.id==='hab-il-proposta'&&r.document_checks?.published_at?.status==='por confirmar'&&r.reference_date===null))errors.push('HB1 data: ausência não documentada');
 const expectedUrl=r.source_url.split('#')[0].toLowerCase().endsWith('.pdf')&&d.page?r.source_url.split('#')[0]+'#page='+d.page:r.source_url;
 if(c?.source_url!==expectedUrl||![p.receipt?.pedido,p.receipt?.endereco_final].includes(r.source_url))errors.push('HB1 porta: endereço divergente');
 if(raw){
  const t=normal(body??text(raw));
  if(!t.includes(normal(r.excerpt)))errors.push('HB1 excerto: ausente do corpo');
  const a=r.document_checks?.attributed_to?.text;
  if(a&&!t.includes(normal(a)))errors.push('HB1 atribuição: âncora ausente');
  const date=r.document_checks?.published_at?.text;
  if(date&&!t.includes(normal(date))&&!normal(raw.toString('utf8')).includes(normal(date)))errors.push('HB1 data: âncora ausente');
 }
 return errors;
}
export function conferirAfirmacoesHb1(claims,{motor,plantar=true}={}){
 const file='ledger/provas/hb1/provas.json';if(!fs.existsSync(file))return {errors:[],plantas:[],ids:new Set(),checked:0,bodies:0};
 const proofs=JSON.parse(fs.readFileSync(file,'utf8')).rows;const errors=[],plantas=[],ids=new Set();let checked=0,bodies=0;
 for(const [id,p] of Object.entries(proofs)){
  ids.add(id);const c=claims.get(id);let raw,body;
  if(motor&&safe(p.row.document.file)){
   try{const f=path.join(motor,p.row.document.file);raw=fs.readFileSync(f);bodies++;if(f.endsWith('.pdf'))body=execFileSync('pdftotext',['-layout',f,'-'],{encoding:'utf8',maxBuffer:32*1024*1024});}
   catch{errors.push(id+': HB1 corpo indisponível');}
  }
  errors.push(...conferirHb1(c,p,raw,body).map(e=>id+': '+e));checked++;
  if(plantar&&!plantas.length&&c){
   for(const [nome,change] of [['excerto',x=>x.excerpt+=' Alterado.'],['valor',x=>x.value+=' Alterado.'],['atribuição',x=>x.attributed_to=[]],['data',x=>x.published_at='2000-01-01'],['porta',x=>x.source_url='https://example.invalid/'],['selo',x=>x.document.source_sha256='0'.repeat(64)]]){
    const bad=structuredClone(c);change(bad);const mensagem=conferirHb1(bad,p,raw,body)[0];plantas.push({nome:'HB1 '+nome,mensagem});if(!mensagem)errors.push('HB1 planta sem recusa: '+nome);
   }
  }
 }
 return {errors,plantas,ids,checked,bodies};
}
