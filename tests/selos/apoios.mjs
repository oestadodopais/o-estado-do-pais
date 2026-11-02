/** I: nove pares aprovados conferidos nas frases reais, com a troca plantada. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {routePath} from '../../src/lib/routes.mjs';
import {partesComRecibos} from '../../src/lib/posicao-do-selo.mjs';
import {itensResolvidos} from '../../src/lib/discussao.mjs';
const conclusao='seccoes[5].conteudo[0].paragrafo';
const pares=[
 ['', 'og1-votacao-generalidade','o ECO tinha noticiado','ECO had reported'],
 ['', 'og1-mf-despesa-total-efetiva-nota','inclui os ativos e passivos financeiros','includes financial assets and liabilities'],
 ['', 'oe-2027-saude-dotacao-reforco-contratos-programa','a dotação para reforçar os contratos-programa ainda por fechar','the provision to reinforce the contract-programmes still to be closed'],
 ['', 'oe-2027-saude-contrato-programa-acss','os acordos entre a Administração Central do Sistema de Saúde e as entidades do Serviço Nacional de Saúde',"the agreements between the Central Administration of the Health System and the National Health Service's entities"],
 ['', 'og1-mf-ppp-encargos-receitas','receitas que lhe cabem','revenue that falls to it'],
 ['', 'og1-mf-ppp-receitas-portagem','vias portajadas','tolled roads'],
 ['', 'pe-oe-beira-abolicao','eliminação das portagens','toll abolition'],
 [conclusao,'oe-2027-saude-dotacao-reforco-contratos-programa','sem dizer quanto','without saying how much'],
 [conclusao,'oe-2027-saude-contrato-programa-acss','contratos-programa','contract-programmes'],
];
function conferir(partes,lang,contexto){const vistos=[];for(const [i,p]of partes.entries())if(p?.fonte){const par=pares.find(([c,id])=>id===p.fonte&&c===contexto)??pares.find(([c,id])=>id===p.fonte&&c==='');assert(par,p.fonte);assert(partes[i-1]?.endsWith(par[lang==='pt'?2:3]),p.fonte+': frase diferente');vistos.push(pares.indexOf(par));}return vistos;}
for(const lang of ['pt','en']) {
 const vistos=new Set();let plantada=false;
 const root=parse(fs.readFileSync('dist'+routePath('discussao',lang)+'index.html','utf8'));
 const conferirHtml=(p,indice)=>{const par=pares[indice],a=p.querySelectorAll('a.src-chip').find(a=>a.getAttribute('href')===routePath('linha',lang,{slug:par[1]}));assert(a,par[1]);assert(a.previousSibling?.textContent.endsWith(par[lang==='pt'?2:3]),par[1]+': selo fora da frase no HTML');};
 for(const e of itensResolvidos(lang))for(const p of [...e.abertura,...e.seccoes.flatMap(s=>s.blocos).filter(b=>b.tipo==='paragrafo')]) {
  const ids=e.recibos[p.caminho]??[],partes=partesComRecibos(p.pedacos,ids,lang,p.caminho);
  const indices=conferir(partes,lang,p.caminho);
  const construido=root.querySelector(`[data-discussao="${e.slug}"] [data-discussao-paragrafo="${p.caminho}"]`);
  for(const i of indices){vistos.add(i);conferirHtml(construido,i);}
  assert.equal(partes.filter(p=>typeof p==='string').join(''),p.pedacos.filter(p=>typeof p==='string').join(''));
  if(e.slug==='saude-no-orcamento'&&p.caminho==='seccoes[2].conteudo[2].paragrafo') {
   const copia=structuredClone(partes),a=copia.find(p=>p?.fonte===pares[2][1]),b=copia.find(p=>p?.fonte===pares[3][1]);
   [a.fonte,b.fonte]=[b.fonte,a.fonte];assert.throws(()=>conferir(copia,lang,p.caminho));
   const html=parse(construido.outerHTML),links=[2,3].map(i=>html.querySelectorAll('a.src-chip').find(a=>a.getAttribute('href')===routePath('linha',lang,{slug:pares[i][1]})));
   const href=links[0].getAttribute('href');links[0].setAttribute('href',links[1].getAttribute('href'));links[1].setAttribute('href',href);
   assert.throws(()=>conferirHtml(html,2));plantada=true;
  }
 }
 assert.equal(vistos.size,9);assert(plantada);
}
console.log('SEL1-I: nove pares nos dados e no HTML de cada edição; troca dos apoios do parágrafo recusada.');
