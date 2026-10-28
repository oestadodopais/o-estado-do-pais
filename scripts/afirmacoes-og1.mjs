/** OG1-A6: as novas linhas conservam as provas e são relidas nos corpos do motor. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const relatorio='content/15 Orcamento do Estado 2027/source/v2a/oe-relatorio.pdf';
const relatorioCfp='content/30 Orcamento 2027 Generalidade/source/cfp-rel-08-2026.pdf';
const normal=x=>String(x??'').replace(/\s+/g,' ').trim();
export function conferirLinhaOg1(c,p,relida){
 const errors=[];
 if(!c||!p)return ['OG1 selo: linha ou prova ausente'];
 const d=p.document,r=p.receipt;
 if(typeof d?.file!=='string'||!(d.file===relatorio||d.file.startsWith('content/30 Orcamento 2027 Generalidade/source/'))||d.file.split('/').includes('..')||d.file.includes('\\')||!/^\w[\w-]*\.(pdf|html)$/.test(path.basename(d.file))||!/^[a-f0-9]{64}$/.test(d.source_sha256??'')||r?.sha256!==d.source_sha256)errors.push('OG1 selo: referência inválida');
 for(const key of ['value','unit','excerpt'])if((key==='value'?normal(c[key]).replaceAll('−','-'):normal(c[key]))!==(key==='value'?normal(p[key]).replaceAll('−','-'):normal(p[key])))errors.push('OG1 '+key+': diferente da prova');
 for(const key of ['title','locator','source_sha256','page'])if(c.document?.[key]!==d?.[key])errors.push('OG1 documento: '+key+' diferente');
 if(c.access_date!==r?.acedido_em?.slice(0,10))errors.push('OG1 acesso: diferente do recibo');
 if(c.reference_date!==(p.afirmacao?p.published_at:p.period))errors.push('OG1 período: diferente da origem');
 if(p.afirmacao&&(c.afirmacao!==true||JSON.stringify(c.attributed_to)!==JSON.stringify(p.attributed_to)||c.published_at!==p.published_at))errors.push('OG1 atribuição: pessoa ou data diferente');
 const publicador=p.source??Object.keys(p.entity_aliases??{})[0];
 if(c.source!==publicador)errors.push('OG1 editor: diferente da prova');
 const url=new URL(p.source_url);
 // A ligação exportada do CFP abre a página exata do PDF selado.
 if(d.file===relatorioCfp&&Number.isInteger(d.page)&&d.page>0)url.hash='page='+d.page;
 if(c.source_url!==url.href)errors.push('OG1 porta: diferente da origem');
 if(relida)for(const key of ['value','unit','excerpt','period','attributed_to','published_at','document','source','entity_aliases'])if(JSON.stringify(relida[key]??null)!==JSON.stringify(p[key]??null))errors.push('OG1 corpo: '+key+' diferente da releitura');
 return errors;
}
export function conferirOg1(claims,{motor,plantar=true}={}){
 const file='ledger/provas/og1a/provas.json';
 if(!fs.existsSync(file))return {errors:['OG1 selo: ficheiro de provas ausente'],checked:0,bodies:0,plantas:[],ids:new Set()};
 const proofs=JSON.parse(fs.readFileSync(file)).rows,ids=new Set(Object.keys(proofs)),errors=[],plantas=[];
 const record=JSON.parse(fs.readFileSync('ledger/cruzamentos/og1a-provas.json')).files['provas.json'];
 if(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==record.exported_sha256)errors.push('OG1 selo: ficheiro de provas diferente do registo');
 let relidas={};
 if(motor){
  try{
   const code="import json; from publisher import oe2027_generalidade as G; specs=G.load(G.STUDY/'extracoes.json')['rows']; ids={r['rh_id'] for r in G.load(G.ROOT/'publisher/manifest.og1a.json')['rows']}; print(json.dumps({s['id']:G.extract(s) for s in specs if s['id'] in ids},ensure_ascii=False))";
   relidas=JSON.parse(execFileSync('python3',['-c',code],{cwd:motor,encoding:'utf8',maxBuffer:4*1024*1024,stdio:['ignore','pipe','pipe']}));
  }catch{errors.push('OG1 corpo: não foi possível reler as fontes no motor indicado');}
 }
 for(const[id,p]of Object.entries(proofs)){
  const c=claims.get(id);errors.push(...conferirLinhaOg1(c,p,relidas[id]).map(e=>id+': '+e));
  if(motor&&!relidas[id])errors.push(id+': OG1 corpo ausente');
 }
 if(plantar){
  const id='og1-governo-observador-saldo',p=proofs[id],c=claims.get(id);
  for(const[key,change]of [['value',x=>x.value='999'],['excerpt',x=>x.excerpt+=' Texto inventado.'],['attributed_to',x=>x.attributed_to=['Outra pessoa']],['published_at',x=>x.published_at='1900-01-01'],['source_url',x=>x.source_url='https://example.invalid/'],['document',x=>x.document.source_sha256='0'.repeat(64)]]){
   const bad=structuredClone(c);change(bad);const mensagem=conferirLinhaOg1(bad,p,relidas[id])[0];plantas.push({nome:'OG1 '+key+' adulterado',mensagem});if(!mensagem)errors.push('OG1 planta não mordeu: '+key);
  }
 }
 if(plantar){
  for(const[id,nome,mudar,alvo]of[
   ['og1-cfp-saldo-2027','página do CFP trocada',c=>c.source_url=c.source_url.replace(/#page=\d+$/,'#page=999'),'linha'],
   ['og1-mf-juros-choque-100pb','relatório fora do caminho selado',p=>p.document.file='content/15 Orcamento do Estado 2027/source/v2a/outro.pdf','prova'],
   ['og1-mf-juros-choque-100pb','caminho com travessia',p=>p.document.file='content/30 Orcamento 2027 Generalidade/source/../outro.pdf','prova'],
  ]){
   const c=structuredClone(claims.get(id)),p=structuredClone(proofs[id]);
   const limpo=conferirLinhaOg1(c,p,relidas[id]).length===0;
   mudar(alvo==='linha'?c:p);
   const mensagem=conferirLinhaOg1(c,p,relidas[id])[0];
   plantas.push({nome:'OG1 '+nome,mensagem});if(!limpo||!mensagem)errors.push('OG1 planta não mordeu: '+nome);
  }
 }
 return {errors,checked:Object.values(proofs).filter(p=>p.afirmacao).length,bodies:Object.keys(relidas).length,plantas,ids};
}
