/** EO1: afirmações, recibos, atribuição e data contra os corpos selados. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {parse} from 'node-html-parser';
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
const seguro=f=>typeof f==='string'&&/^content\/(24 Orcamento 2027 Analise|25 Orcamento 2027 Medidas)\/source\/[\w/-]+\.html$/.test(f)&&!f.includes('..');
function dateOf(anchor){
 const iso=anchor.match(/^(\d{4}-\d{2}-\d{2})/);if(iso)return iso[1];
 const slash=anchor.match(/^(\d{2})\/(\d{2})\/(\d{4})/);if(slash)return `${slash[3]}-${slash[2]}-${slash[1]}`;
 const month=anchor.match(/^(\d{1,2}) (jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez) (\d{4})/i);
 return month?`${month[3]}-${String(['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'].indexOf(month[2].toLowerCase())+1).padStart(2,'0')}-${month[1].padStart(2,'0')}`:null;
}
function text(raw){const tree=parse(raw.toString('utf8'));tree.querySelectorAll('head,script,style').forEach(e=>e.remove());return normal(parse(tree.toString().replace(/<[^>]*>/g,' ')).textContent);}
export function conferirEo1(c,p,raw){
 const errors=[];if(!p)return ['EO1 selo: falta a prova'];
 const d=p.document,r=p.receipt,s=p.selector;
 if(!seguro(d?.file)||!/^[a-f0-9]{64}$/.test(d?.source_sha256??'')||r?.sha256!==d.source_sha256||c.document?.source_sha256!==d.source_sha256||r?.estado!==200)errors.push('EO1 selo: recibo divergente');
 if(raw&&crypto.createHash('sha256').update(raw).digest('hex')!==d.source_sha256)errors.push('EO1 selo: corpo divergente');
 if(c.afirmacao!==true||p.afirmacao!==true||c.unit!==p.unit||c.document?.kind!=='html')errors.push('EO1 medida: tipo divergente');
 if(c.value!==p.value||c.excerpt!==p.excerpt||c.value!==c.excerpt)errors.push('EO1 excerto: citação divergente');
 if(JSON.stringify(c.attributed_to)!==JSON.stringify(p.attributed_to)||!p.attributed_to.every(a=>s.attribution_anchor.includes(a)))errors.push('EO1 atribuição: nome divergente');
 if(dateOf(p.publication.quote)!==p.published_at||c.published_at!==p.published_at||c.reference_date!==p.published_at||!/^\d{4}-\d{2}-\d{2}$/.test(p.published_at??''))errors.push('EO1 data: publicação divergente');
 if(c.source_url!==p.source_url||![r?.pedido,r?.endereco_final].includes(c.source_url))errors.push('EO1 porta: endereço divergente');
 if(raw){
  const t=text(raw),q=s.raw_quote??p.excerpt;
  if(!t.includes(normal(q)))errors.push('EO1 excerto: ausente do corpo');
  let cleaned=q;for(const [a,b] of s.remove_footnotes??[])cleaned=cleaned.replace(a,b);
  if(cleaned!==p.excerpt)errors.push('EO1 excerto: limpeza divergente');
  if(!t.includes(normal(s.attribution_anchor)))errors.push('EO1 atribuição: âncora ausente');
  const publication=p.publication;
  if(publication.file!==d.file||!(publication.raw?raw.toString('utf8'):t).includes(publication.quote))errors.push('EO1 data: âncora ausente');
 }
 return errors;
}
export function conferirAfirmacoesEo1(claims,{motor,plantar=true}={}){
 const file='ledger/provas/eo1/provas.json';
 if(!fs.existsSync(file))return {errors:[],plantas:[],ids:new Set(),checked:0,bodies:0};
 const provas=JSON.parse(fs.readFileSync(file,'utf8')).rows;
 const errors=[],plantas=[],ids=new Set();let checked=0,bodies=0;
 for(const [id,p] of Object.entries(provas)){
  if(!p.afirmacao)continue;ids.add(id);const c=claims.get(id);if(!c){errors.push(id+': EO1 linha ausente');continue;}
  let raw;if(motor&&seguro(p.document.file)){try{raw=fs.readFileSync(path.join(motor,p.document.file));bodies++;}catch{errors.push(id+': EO1 corpo indisponível');}}
  errors.push(...conferirEo1(c,p,raw).map(e=>id+': '+e));checked++;
  if(plantar&&!plantas.length){
   for(const [nome,altera] of [['excerto',x=>x.excerpt+=' Alterado.'],['valor',x=>x.value+=' Alterado.'],['atribuição',x=>x.attributed_to=[]],['data',x=>x.published_at='2000-01-01'],['porta',x=>x.source_url='https://example.invalid/'],['selo',x=>x.document.source_sha256='0'.repeat(64)]]){
    const bad=structuredClone(c);altera(bad);const mensagem=conferirEo1(bad,p,raw)[0];plantas.push({nome:'EO1 '+nome,mensagem});if(!mensagem)errors.push('EO1 planta não mordeu: '+nome);
   }
  }
 }
 return {errors,plantas,ids,checked,bodies};
}
