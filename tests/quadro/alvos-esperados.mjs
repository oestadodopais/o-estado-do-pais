/** CR3-A: só esta página perdeu os avisos das duas exportações já aplicadas. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const SEM_AVISO_APOS_CR3=new Set(['/estado-e-economia/','/en/state-and-economy/']);
export function exigirAlvos(rota,quantos){
 assert(quantos>0 || SEM_AVISO_APOS_CR3.has(rota),`rota fixa sem alvos: ${rota}`);
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
 let plantas=0;
 for(const rota of ['/temas/','/en/themes/','/uniao-europeia/','/en/european-union/','/livro-razao/','/en/ledger/','/','/en/','/estudos/','/en/studies/','/livro-razao/series/sobrecarga-do-custo-da-habitacao-2025-paises','/en/ledger/series/sobrecarga-do-custo-da-habitacao-2025-paises']){
  exigirAlvos(rota,1);
  assert.throws(()=>exigirAlvos(rota,0),/rota fixa sem alvos/);plantas++;
 }
 for(const rota of SEM_AVISO_APOS_CR3){exigirAlvos(rota,0);exigirAlvos(rota,1);}
 assert.equal(plantas,12);
 console.log(`CR3-A alvos: ${plantas} rotas vazias recusadas; exceção só para Estado e economia nas duas línguas.`);
}
