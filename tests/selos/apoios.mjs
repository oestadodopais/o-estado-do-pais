/** I: nove pares aprovados conferidos nas frases reais, com a troca plantada. */
import assert from 'node:assert/strict';
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
 for(const e of itensResolvidos(lang))for(const p of [...e.abertura,...e.seccoes.flatMap(s=>s.blocos).filter(b=>b.tipo==='paragrafo')]) {
  const ids=e.recibos[p.caminho]??[],partes=partesComRecibos(p.pedacos,ids,lang,p.caminho);
  for(const i of conferir(partes,lang,p.caminho))vistos.add(i);
  assert.equal(partes.filter(p=>typeof p==='string').join(''),p.pedacos.filter(p=>typeof p==='string').join(''));
  if(e.slug==='saude-no-orcamento'&&p.caminho==='seccoes[2].conteudo[2].paragrafo') {
   const copia=structuredClone(partes),a=copia.find(p=>p?.fonte===pares[2][1]),b=copia.find(p=>p?.fonte===pares[3][1]);
   [a.fonte,b.fonte]=[b.fonte,a.fonte];assert.throws(()=>conferir(copia,lang,p.caminho));plantada=true;
  }
 }
 assert.equal(vistos.size,9);assert(plantada);
}
console.log('SEL1-I: nove pares nas frases reais de cada edição; troca dos apoios do parágrafo recusada.');
