import { DOSSIES } from '../src/data/dossies.mjs';
/** Uma ligação de título tem por destino o item onde os valores levam os seus selos. */
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {ITENS,DISCUSSAO} from '../src/data/discussao.mjs';
import {routePath} from '../src/lib/routes.mjs';
const normal=x=>String(x??'').replace(/\s+/g,' ').trim();
const destinos=new Map();
/** O título fica inteiro; os selos seguem-no fora do h2, no mesmo cabeçalho. */
export function seloDoTituloDaDiscussao(el,id,lang,linhas){
 const titulo=el.closest('[data-discussao-titulo]'),cabeca=titulo?.parentNode;
 const e=ITENS.find(x=>x.slug===titulo?.closest('[data-discussao]')?.getAttribute('data-discussao'));
 if(!e||!cabeca?.hasAttribute('data-discussao-cabecalho')||cabeca.querySelectorAll('[data-discussao-titulo]').length!==1||titulo.querySelector('.src-chip'))return false;
 const partes=e.titulo[lang],valores=partes.filter(x=>x?.claim),datas=partes.filter(x=>x?.periodo);
 const esperado=partes.map(x=>typeof x==='string'?x:x.claim?linhas.get(x.claim)?.value+(x.sufixo??''):x.periodo?linhas.get(x.periodo)?.reference_date:'').join('');
 if(normal(titulo.text)!==normal(esperado)||!valores.some(x=>x.claim===id))return false;
 const marcas=titulo.querySelectorAll('[data-claim]'),anos=titulo.querySelectorAll('[data-de-linha]');
 if(marcas.length!==valores.length||marcas.some((m,i)=>m.getAttribute('data-claim')!==valores[i].claim||normal(m.text)!==normal(linhas.get(valores[i].claim)?.value)))return false;
 if(anos.length!==datas.length||anos.some((m,i)=>m.getAttribute('data-de-linha')!==datas[i].periodo||m.getAttribute('data-de-campo')!=='reference_date'||m.getAttribute('data-nonledger')!=='data-da-linha'||normal(m.text)!==String(linhas.get(datas[i].periodo)?.reference_date)))return false;
 const faixa=cabeca.querySelector('[data-discussao-selos-do-titulo]'),selos=faixa?.querySelectorAll('a.src-chip')??[];
 if(faixa?.parentNode!==cabeca||cabeca.childNodes.indexOf(faixa)<cabeca.childNodes.indexOf(titulo)||cabeca.querySelectorAll('.src-chip').length!==valores.length)return false;
 return selos.length===valores.length&&selos.every((s,i)=>s.getAttribute('href')===routePath('linha',lang,{slug:valores[i].claim}));
}
export function portaDoTituloDaDiscussao(el,id,lang,linhas,{dist,destino}={}){
 const a=el.closest('a');
 if(!a||a.closest('svg')||a.querySelector('a'))return false;
 const integracao=a.closest('[data-discussao-integracao]');
 const slug=a.getAttribute('data-discussao-porta')??integracao?.getAttribute('data-discussao-integracao');
 const e=ITENS.find(x=>x.slug===slug);
 if(!e||a.getAttribute('href')!==routePath('discussao',lang)+'#'+slug)return false;
 const partes=e.titulo[lang];
 const valores=partes.filter(x=>x?.claim),datas=partes.filter(x=>x?.periodo);
 const sequencia=partes.filter(x=>x?.claim||x?.periodo).map(x=>x.claim?'valor:'+x.claim:'data:'+x.periodo);
 const observada=a.querySelectorAll('[data-claim],[data-de-linha]').map(x=>x.hasAttribute('data-claim')?'valor:'+x.getAttribute('data-claim'):'data:'+x.getAttribute('data-de-linha'));
 if(JSON.stringify(sequencia)!==JSON.stringify(observada))return false;
 if(!valores.some(x=>x.claim===id))return false;
 const marcas=a.querySelectorAll('[data-claim]');
 if(marcas.length!==valores.length||marcas.some((m,i)=>m.getAttribute('data-claim')!==valores[i].claim||normal(m.text)!==normal(linhas.get(valores[i].claim)?.value)))return false;
 const anos=a.querySelectorAll('[data-de-linha]');
 if(anos.length!==datas.length||anos.some((m,i)=>m.getAttribute('data-de-linha')!==datas[i].periodo||m.getAttribute('data-de-campo')!=='reference_date'||m.getAttribute('data-nonledger')!=='data-da-linha'||normal(m.text)!==String(linhas.get(datas[i].periodo)?.reference_date)))return false;
 const titulo=partes.map(x=>typeof x==='string'?x:x.claim?linhas.get(x.claim)?.value+(x.sufixo??''):x.periodo?linhas.get(x.periodo)?.reference_date:'').join('');
 const doDossie=integracao?.getAttribute('data-discussao-condicao')==='pertenca-ao-dossie';
 if(doDossie&&!DOSSIES.some(d=>d.slug===a.closest('[data-dossie]')?.getAttribute('data-dossie')&&d.pecas.itens.includes(slug)))return false;
 const esperado=(integracao&&!doDossie?DISCUSSAO.porta[lang]+' ':'')+titulo;
 if(normal(a.text)!==normal(esperado))return false;
 if(!destino&&dist){
  const ficheiro=path.join(dist,routePath('discussao',lang),'index.html');
  if(!destinos.has(ficheiro)){if(!fs.existsSync(ficheiro))return false;destinos.set(ficheiro,parse(fs.readFileSync(ficheiro,'utf8')));}
  destino=destinos.get(ficheiro).querySelector(`[data-discussao="${slug}"] [data-discussao-titulo]`);
 }
 if(!destino||!destino.hasAttribute('data-discussao-titulo')||destino.closest('[data-discussao]')?.getAttribute('data-discussao')!==slug)return false;
 const ordemDestino=destino.querySelectorAll('[data-claim],[data-de-linha]').map(x=>x.hasAttribute('data-claim')?'valor:'+x.getAttribute('data-claim'):'data:'+x.getAttribute('data-de-linha'));
 if(JSON.stringify(ordemDestino)!==JSON.stringify(sequencia))return false;
 if(destino.querySelectorAll('[data-de-linha]').some((m,i)=>m.getAttribute('data-de-campo')!=='reference_date'||m.getAttribute('data-nonledger')!=='data-da-linha'||normal(m.text)!==String(linhas.get(datas[i].periodo)?.reference_date)))return false;
 const semSelos=parse(destino.toString());semSelos.querySelectorAll('.src-chip').forEach(x=>x.remove());
 if(normal(semSelos.text)!==normal(titulo))return false;
 const citacoes=destino.querySelectorAll('[data-claim]');
 if(citacoes.length!==valores.length)return false;
 return citacoes.every((m,i)=>m.getAttribute('data-claim')===valores[i].claim&&normal(m.text)===normal(linhas.get(valores[i].claim)?.value)&&seloDoTituloDaDiscussao(m,valores[i].claim,lang,linhas));

}
