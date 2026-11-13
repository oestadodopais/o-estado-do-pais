/** COR3-B: os quadros são permanentes; os avisos dependem das revisões por aplicar. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {revisoesPorAplicar} from '../../scripts/check-quadro.mjs';
const SEM_AVISO_APOS_CR3=new Set(['/estado-e-economia/','/en/state-and-economy/']);
const COM_QUADRO=new Set(['/temas/','/en/themes/']);
export function exigirAlvos(rota,quantos,{pendentes=revisoesPorAplicar(),esperados=null}={}){
 assert(Number.isInteger(quantos)&&quantos>=0,'contagem de alvos inválida');
 if(esperados!==null)assert.equal(quantos,esperados,`alvos diferentes do HTML conferido: ${rota}`);
 const resolvidas=pendentes.size===0&&!COM_QUADRO.has(rota);
 assert(quantos>0 || SEM_AVISO_APOS_CR3.has(rota) || resolvidas,`rota fixa sem alvos: ${rota}`);
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
 let plantas=0;
 const pendentes=new Map([['planta-revisao',{}]]);
 for(const rota of ['/temas/','/en/themes/','/uniao-europeia/','/en/european-union/','/livro-razao/','/en/ledger/','/','/en/','/estudos/','/en/studies/','/livro-razao/series/sobrecarga-do-custo-da-habitacao-2025-paises','/en/ledger/series/sobrecarga-do-custo-da-habitacao-2025-paises']){
  exigirAlvos(rota,1,{pendentes});
  assert.throws(()=>exigirAlvos(rota,0,{pendentes}),/rota fixa sem alvos/);plantas++;
  if(COM_QUADRO.has(rota))assert.throws(()=>exigirAlvos(rota,0,{pendentes:new Map()}),/rota fixa sem alvos/);
  else exigirAlvos(rota,0,{pendentes:new Map()});
  assert.throws(()=>exigirAlvos(rota,0,{pendentes:new Map(),esperados:1}),/alvos diferentes/);
 }
 for(const rota of SEM_AVISO_APOS_CR3){exigirAlvos(rota,0,{pendentes});exigirAlvos(rota,1,{pendentes});}
 assert.equal(plantas,12);
 console.log(`COR3-B alvos: ${plantas} rotas vazias recusadas com revisão pendente; quadros permanentes e contagem exata conservados; avisos resolvidos podem sair.`);
}
