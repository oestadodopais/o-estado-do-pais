/** Conferência independente dos efeitos, incluindo textos e períodos selados. */
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {textoDocumentalConferido,acumuladoConferido,nomeDoEfeitoConferido} from '../../src/lib/prova-efeitos.mjs';
import {lugarDaIncorporacao} from '../../src/lib/lugar-da-incorporacao.mjs';
import {conferirFormatoDaPagina} from '../inicio/formato-dos-numeros.mjs';
const proofFile=new URL('../../ledger/provas/v2e/provas.json',import.meta.url);
const proofs=JSON.parse(fs.readFileSync(proofFile,'utf8')).rows;
const idSite=id=>id.startsWith('eurostat-')?id:id.replaceAll('_','-').replaceAll('.','-').toLowerCase();
function n(value){
 let s=String(value).replaceAll('−','-').replace(/[\s  ]/g,'').replace(/M€|%/g,'');
 if(s.includes(','))s=s.replaceAll('.','').replace(',','.');
 else if(/^\d{1,3}(?:\.\d{3})+$/.test(s))s=s.replaceAll('.','');
 return Number(s);
}
export function conferirEfeitos(linhas,itens){
 const erros=[];
 for(const [id,p] of Object.entries(proofs)){
  const c=linhas.get(id);
  if(!c){erros.push(`V2E inventário: falta ${id}`);continue;}
  if(c.texto_documental&&!textoDocumentalConferido(c))erros.push(`V2E texto: ${id}`);
  if(c.period&&!acumuladoConferido(c))erros.push(`V2E acumulado: ${id}`);
  if(id.startsWith('der-')){
   const ds=p.derivation,ids=ds.components.map(idSite),rs=ids.map(k=>linhas.get(k));
   if(rs.some(r=>!r)){erros.push(`V2E componentes: ${id}`);continue;}
   const values=rs.map(r=>n(r.value));let result;
   if(ds.operation==='change_pct')result=(values[0]/values[1]-1)*100;
   else if(ds.operation==='sum')result=values.reduce((a,b)=>a+b,0);
   else if(ds.operation==='subtract')result=values[0]-values[1];
   else if(ds.operation==='percent')result=values[0]/values[1]*100;
   else if(ds.operation==='millions')result=values.reduce((a,b)=>a+b,0)/1e6;
   else if(ds.operation==='number')result=values[0];
   else if(ds.operation==='count')result=rs.length;
   else if(ds.operation==='count_complete')result=rs.filter(r=>r.value==='Completo').length;
   const rounded=Number(result?.toFixed(ds.rounding_places));
   if(!Number.isFinite(rounded)||rounded!==n(c.value))erros.push(`V2E conta: ${id}`);
   if(ds.check&&JSON.stringify([...(c.derived_from??[])].sort())!==JSON.stringify([...ids].sort()))erros.push(`V2E componentes: ${id}`);
   if(!c.derivation||!c.derivation_en)erros.push(`V2E derivação: ${id}`);
  }
  const owner=id.startsWith('pe-')?'parcerias-rodoviarias':'saude-no-orcamento';
  if(!itens.find(i=>i.slug===owner)?.linhas.includes(id))erros.push(`V2E integração: ${id}`);
 }
 const milestones=Object.keys(proofs).filter(id=>/^(prr-complemento|prr-marcos-metas)-/.test(id)&&id.endsWith('-estado'));
 if(milestones.length!==37)erros.push('V2E marcos: universo diferente');
 for(const id of ['prr-complemento-p4-1-40-estado','prr-complemento-p6-1-42-estado']){
  if(linhas.get(id)?.value!=='Completo')erros.push(`V2E exemplo: ${id} não está completo`);
 }
 const countries={'eurostat-be-phys':'Bélgica','eurostat-el-phys':'Grécia','eurostat-ro-nrs':'Roménia','eurostat-lu-nrs':'Luxemburgo'};
 for(const [id,country] of Object.entries(countries))if(lugarDaIncorporacao(linhas.get(id),'pt').nome!==country)erros.push(`V2E país: ${id}`);
 if(itens[0].seccoes[1].conteudo.length!==10||itens[0].seccoes[2].conteudo.length!==6||itens[1].seccoes[1].conteudo.length!==8)erros.push('V2E parágrafos: número diferente');
 return erros;
}
export function plantasDosEfeitos(linhas,itens){
 const results=[];
 const painel='prr-monitorizacao-20261014-p2-c01-taxa';
 const html=(id,v)=>`<span data-claim="${id}">${v}</span>`;
 if(conferirFormatoDaPagina(html(painel,'47%'),'planta').desvios.length)throw new Error('Painel íntegro recusado');
 for(const [nome,id,v] of [['valor do painel alterado',painel,'48%'],['valor com identidade diferente','taxa-de-emprego-2025','47%']])
  results.push({nome,mordeu:conferirFormatoDaPagina(html(id,v),'planta').desvios.some(d=>d.regra==='F4')});
 const nomeId='prr-complemento-p4-1-40-estado';
 for(const lang of ['pt','en']){
  const correto=proofs[nomeId][lang==='pt'?'label':'label_en'];
  for(const [nome,id,texto,edicao] of [
   ['nome alterado',nomeId,correto+' alterado',lang],
   ['código alterado',nomeId,correto.replace('1.40','9.99'),lang],
   ['nome de outra edição',nomeId,correto,lang==='pt'?'en':'pt'],
   ['nome sem prova','linha-inexistente',correto,lang],
  ])results.push({nome:nome+' '+lang,mordeu:!nomeDoEfeitoConferido(id,texto,edicao)});
 }
 const text=linhas.get('pe-despacho-braga');
 for(const [field,value] of [['value','Texto diferente'],['excerpt','Excerto diferente'],['unit','euros'],['source_url','https://example.invalid/'],['access_date','2000-01-01']]){
  const bad=structuredClone(text);bad[field]=value;
  results.push({nome:'texto documental com '+field+' alterado',mordeu:!textoDocumentalConferido(bad)});
 }
 for(const field of ['source_sha256','title','locator','page']){
  const bad=structuredClone(text);bad.document[field]=field==='page'?999:'Outra prova';
  results.push({nome:'texto documental com documento '+field+' alterado',mordeu:!textoDocumentalConferido(bad)});
 }
 for(const change of [c=>{c.period='2026-07';},c=>{c.period='2026-02/2026-07';},c=>{c.reference_date='2025-07';}]){
  const c=structuredClone(linhas.get('sns-cirurgias-2026-07'));change(c);
  results.push({nome:'período acumulado alterado',mordeu:!acumuladoConferido(c)});
 }
 for(const id of Object.keys(proofs).filter(id=>id.startsWith('der-'))){
  const bad=new Map(linhas),row=structuredClone(bad.get(id));row.value='999999';bad.set(id,row);
  results.push({nome:'conta alterada '+id,mordeu:conferirEfeitos(bad,itens).some(e=>e===`V2E conta: ${id}`)});
 }
 const bad=new Map(linhas),row=structuredClone(bad.get('prr-complemento-p6-1-42-estado'));
 row.value='Dentro do Prazo';bad.set(row.id,row);
 results.push({nome:'exemplo PRR incompleto',mordeu:conferirEfeitos(bad,itens).some(e=>e.startsWith('V2E exemplo:'))});
 return results;
}
export function conferirRecibosDosEfeitos(dist,itens){
 const erros=[],plantas=[];
 for(const lang of ['pt','en'])for(const id of Object.keys(proofs)){
  const file=path.join(dist,lang==='pt'?'livro-razao':'en/ledger',id,'index.html');
  if(!fs.existsSync(file)){erros.push(`V2E recibo ausente: ${id} ${lang}`);continue;}
  const root=parse(fs.readFileSync(file,'utf8'));
  const slug=id.startsWith('pe-')?'parcerias-rodoviarias':'saude-no-orcamento';
  const url=(lang==='pt'?'/o-que-se-discute/':'/en/under-discussion/')+'#'+slug;
  const check=r=>r.querySelectorAll('a[href]').some(a=>a.closest('[data-discussao-integracao]')&&a.getAttribute('href')===url);
  if(!check(root))erros.push(`V2E porta do recibo: ${id} ${lang}`);
  if(id==='pe-despacho-braga'){
   const broken=parse(root.toString());broken.querySelector('[data-discussao-integracao]')?.remove();
   plantas.push({nome:'recibo V2E sem porta '+lang,mordeu:!check(broken)});
  }
 }
 return {erros,plantas};
}
