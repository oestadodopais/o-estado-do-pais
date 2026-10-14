/** V2-a-d: provas independentes do HTML e do acesso ao motor. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {MESES_PT,conferirAfirmacoes} from '../../scripts/afirmacoes.mjs';
import {continuacaoDoNomeV2a,resolverPeriodosV2a,contaV2a} from '../../src/lib/v2a-palavras.mjs';
const claims=loadClaims();
for(const motor of [undefined,process.env.RESEARCHHUB_DIR].filter((x,i)=>i===0||x)) {
  assert.deepEqual(conferirAfirmacoes(claims,{motor:motor??''}).errors,[]);
  const guardados=[...MESES_PT];
  try {
    [MESES_PT[9],MESES_PT[10]]=[MESES_PT[10],MESES_PT[9]];
    let erro;
    try {conferirAfirmacoes(claims,{motor:motor??''});}catch(e){erro=e;}
    assert(erro?.message.includes('2026-11-09')&&erro.message.includes('2026-10-09'));
    console.log(`PLANTA meses trocados ${motor?'com':'sem'} motor: ${erro.message.replace(/\n/g,' ')}`);
  }finally{MESES_PT.splice(0,12,...guardados);}
}
for(const id of Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/v2a.json')).rows)) {
  for(const lang of ['pt','en']) {
    const partes=continuacaoDoNomeV2a(id,lang),resolvidas=resolverPeriodosV2a(partes);
    for(const p of resolvidas)if(typeof p==='object')assert.equal(p.data.valor,claims.get(p.data.id).reference_date);
    for(const p of contaV2a(id,lang))if(p.claim)assert(claims.has(p.claim));
  }
}
const numero=id=>Number(claims.get(id).value.replace(/\s/g,'').replace(',','.'));
assert.equal(Math.round((numero('oe-2027-saude-despesa-total-consolidada-2026')-numero('oe-2027-saude-despesa-total-consolidada-2027'))*10),2675);
assert.equal(numero('oe-2027-ppp-rodoviario-encargos-brutos-2027')-numero('oe-2027-ppp-rodoviario-receitas-2027'),numero('oe-2027-ppp-rodoviario-encargos-liquidos-2027'));
console.log('V2AD: tokens e contas conferidos nas linhas; meses com expectativas independentes.');
