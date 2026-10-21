/** Confere os dados e o código de todas as linhas antes da construção. */
import assert from 'node:assert/strict';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {podeIncorporar,dadosDaIncorporacao,codigoDaIncorporacao} from '../../src/lib/incorporar.mjs';
let incorporaveis=0,incompletas=0;
const errors=[];
for(const linha of loadClaims().values())for(const lang of ['pt','en']) {
 try {
  if(!podeIncorporar(linha)) {
   assert.equal(codigoDaIncorporacao(linha,lang),null,'proveniência incompleta permite incorporação');incompletas++;continue;
  }
  const dados=dadosDaIncorporacao(linha,lang),codigo=codigoDaIncorporacao(linha,lang);
  assert(dados.nome&&dados.fonte&&dados.periodo&&dados.leitura,'dados incompletos');
  assert.equal(dados.valor,String(linha.value),'valor diferente da linha');
  assert(codigo?.includes(`data-oedp="${linha.id}"`),'código sem identidade');incorporaveis++;
 }catch(error){errors.push(`${linha.id} (${lang}): ${error.message}`);}
}
assert(incorporaveis>0,'nenhuma linha conferida');
for(const error of errors)console.error(error);
console.log(JSON.stringify({incorporaveis,proveniencia_incompleta:incompletas,erros:errors.length}));
process.exitCode=errors.length?1:0;
