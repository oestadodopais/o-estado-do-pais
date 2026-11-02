/** G2: os sete pares aprovados, independentes da tabela de renderização. */
import assert from 'node:assert/strict';
import {partesComRecibos} from '../../src/lib/posicao-do-selo.mjs';
const pares=[
 ['og1-votacao-generalidade','o ECO tinha noticiado','ECO had reported'],
 ['og1-mf-despesa-total-efetiva-nota','inclui os ativos e passivos financeiros','includes financial assets and liabilities'],
 ['oe-2027-saude-dotacao-reforco-contratos-programa','a dotação para reforçar os contratos-programa ainda por fechar','the provision to reinforce the contract-programmes still to be closed'],
 ['oe-2027-saude-contrato-programa-acss','os acordos entre a Administração Central do Sistema de Saúde e as entidades do Serviço Nacional de Saúde',"the agreements between the Central Administration of the Health System and the National Health Service's entities"],
 ['og1-mf-ppp-encargos-receitas','receitas que lhe cabem','revenue that falls to it'],
 ['og1-mf-ppp-receitas-portagem','vias portajadas','tolled roads'],
 ['pe-oe-beira-abolicao','eliminação das portagens','toll abolition'],
];
function conferir(partes,lang){for(const[id,...frases]of pares){const i=partes.findIndex(p=>p?.fonte===id);assert(i>0);assert.equal(partes[i-1].slice(-frases[lang==='pt'?0:1].length),frases[lang==='pt'?0:1],id);}}
for(const lang of ['pt','en']) {
 const texto=pares.map(p=>p[lang==='pt'?1:2]).join('; ')+'.';
 const partes=partesComRecibos([texto],pares.map(p=>p[0]),lang);
 conferir(partes,lang);
 assert.equal(partes.filter(p=>typeof p==='string').join(''),texto);
 const copia=structuredClone(partes),a=copia.find(p=>p?.fonte===pares[2][0]),b=copia.find(p=>p?.fonte===pares[3][0]);
 [a.fonte,b.fonte]=[b.fonte,a.fonte];assert.throws(()=>conferir(copia,lang));
}
console.log('SEL1-G2: sete pares nas duas edições; troca dos apoios da Saúde recusada.');
