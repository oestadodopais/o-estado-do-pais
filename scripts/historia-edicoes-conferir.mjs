import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex');
const dataValida=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
export function conferirHistoria({works,manifesto,correcoes,raiz}) {
 const erros=[],pares=new Set();
 if(String(manifesto.historia_edicoes_base instanceof Date?manifesto.historia_edicoes_base.toISOString().slice(0,10):manifesto.historia_edicoes_base)!=='2026-11-02')erros.push('ED1 base: falta o início declarado da história');
 for(const e of manifesto.edicoes){
  const chave=`${e.slug}/${e.lang}`,w=works.find(w=>w.slug===e.slug),d=w?.editions.find(d=>d.lang===e.lang),vs=e.edicoes;
  if(!d||pares.has(chave))erros.push(`ED1 edição: ${chave}`);pares.add(chave);
  if(!Array.isArray(vs)||!vs.length){erros.push(`ED1 versões: ${chave} sem lista`);continue;}
  if(e.primeira_edicao&&vs.length<2)erros.push(`ED1 versões: ${chave} perdeu a história declarada`);
  for(const [i,v] of vs.entries()){
   const atual=i===vs.length-1;
   if(!dataValida(v.data)||(i>0&&v.data<=vs[i-1].data))erros.push(`ED1 ordem: ${chave}`);
   const file=atual?`${e.slug}/${e.lang}.html`:`_edicoes/${e.slug}.${e.lang}.${v.data}.html`;
   if(v.file!==file||!/^[a-f0-9]{64}$/.test(v.sha256??'')){erros.push(`ED1 arquivo: ${chave}/${v.data}`);continue;}
   const f=path.join(raiz,file);
   if(!fs.existsSync(f)||sha(fs.readFileSync(f))!==v.sha256)erros.push(`ED1 sha256: ${chave}/${v.data}`);
   if(atual&&v.sha256!==e.sha256_normalized)erros.push(`ED1 atual: ${chave} diverge da última versão`);
   if(i>0&&!correcoes.some(c=>c.kind==='texto'&&c.slug===e.slug&&c.data===v.data))erros.push(`ED1 entrada: ${chave}/${v.data}`);
  }
  if(d?.updated&&d.updated!==vs.at(-1).data)erros.push(`ED1 updated: ${chave}`);
  if(vs.length>1){const p=e.primeira_edicao,v=vs[0];if(!p||p.file!==v.file||p.sha256!==v.sha256||p.date!==v.data||!/^[a-f0-9]{7,40}$/.test(p.commit??''))erros.push(`ED1 arquivo: ${chave} primeira edição em falta ou inválida`);}
 }
 for(const c of correcoes)if(!manifesto.edicoes.some(e=>e.slug===c.slug&&e.edicoes?.slice(1).some(v=>v.data===c.data)))erros.push(`ED1 órfã: ${c.slug}|${c.data}`);
 return erros;
}
export function conferirTestemunhas(manifesto, ler, {permitirAusencia=false}={}){
 const erros=[],avisos=[];
 for(const e of manifesto.edicoes.filter(e=>e.primeira_edicao)){
  const p=e.primeira_edicao;
  if(!/^[a-f0-9]{7,40}$/.test(p.commit??'')){erros.push(`ED1 história: referência inválida ${e.slug}/${e.lang}`);continue;}
  let bytes;try{bytes=ler(p.commit,`studies-src/${e.raw_file}`);}catch{const mensagem=`ED1 história indisponível: ${e.slug}/${e.lang}; a lista e os bytes guardados foram conferidos sem Git.`;if(permitirAusencia)avisos.push(mensagem);else erros.push(mensagem);continue;}
  if(sha(bytes)!==p.sha256)erros.push(`ED1 história: ${e.slug}/${e.lang}`);
 }
 return {erros,avisos};
}
