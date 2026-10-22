/** C1d: o mesmo validador que build e verify chamam recusa perder a história. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadClaims, validateLedger } from '../../src/lib/ledger.mjs';
import {conferirHistoriaDoValor,entradasDoValor,assinaturaDoValor} from '../../src/lib/historia-do-valor.mjs';
const linhas = loadClaims({includeWithdrawn:true});
const id = 'divida-das-familias-2025-ue';
const original = linhas.get(id);
assert.deepEqual(validateLedger().errors, []);
const plantas = [];
for (const [nome, muda, falha] of [
  ['valor editado depois da atualização', c => { c.value = '49,4'; }, '"value" é 49,4, mas o último "new_value" é 49,2.'],
  ['atualização retirada', c => { c.corrections = c.corrections.filter(x => x.kind !== 'atualizacao'); }, 'uma entrada selada foi retirada ou alterada.'],
  ['valor anterior inventado', c => { c.corrections.find(x => x.kind === 'atualizacao').old_value = '49,1'; }, '"old_value" é 49,1, mas antes vigorava 49,3.'],
  ['valor fora da forma da casa', c => { c.value = '49.2'; }, '"value" é 49.2, mas o último "new_value" é 49,2.'],
]) {
  const c = structuredClone(original); muda(c); linhas.set(id, c);
  try {
    const erros = validateLedger().errors;
    assert.ok(erros.some(e => e.includes(falha)), `${nome}: ${erros.join('\n')}`);
    plantas.push({ nome, falha, erros, mordeu: true });
  } finally { linhas.set(id, original); }
}
assert.deepEqual(validateLedger().errors, []);
const textual=linhas.get('utao-risco-execucao-sns-2027');
const selo=entradasDoValor(textual).map(assinaturaDoValor);
for(const [nome,muda,falha] of [
 ['texto da afirmação editado',c=>{c.value+=' Palavra acrescentada.';},'não coincide com o excerto'],
 ['correção textual retirada',c=>{c.corrections=[];},'retirada ou alterada'],
 ['valor textual anterior inventado',c=>{c.corrections[0].old_value='Outra afirmação.';},'retirada ou alterada'],
 ['afirmação textual vazia',c=>{c.corrections[0].new_value='';},'texto não vazio'],
 ['linha numérica disfarçada de texto',c=>{c.unit='%';},'forma de número da casa'],
]){
 const c=structuredClone(textual),erros=[];muda(c);conferirHistoriaDoValor(c,selo,'ensaio',erros);
 assert.ok(erros.some(e=>e.includes(falha)),nome);plantas.push({nome,falha,erros,mordeu:true});
}
// O corte editorial do não reconhecimento não conta como correção de erro.
assert.deepEqual(entradasDoValor(linhas.get('pe-oe-riscos-nao-reconhecimento')),[]);
assert.equal(linhas.get('correcoes-publicadas').value,'12');
for(const id of ['pe-oe-beira-abolicao']){
 const original=linhas.get(id),seladas=JSON.parse(fs.readFileSync('ledger/historias-valores.json','utf8'))[id],erros=[];
 conferirHistoriaDoValor(original,seladas,'ensaio',erros);assert.deepEqual(erros,[]);
 for(const [nome,muda,falha] of [
  ['texto documental anterior alterado',c=>{c.corrections[0].old_value+=' Palavra.';},'retirada ou alterada'],
  ['correção documental retirada',c=>{c.corrections=[];},'retirada ou alterada'],
  ['texto atual e excerto alterados juntos',c=>{c.value+=' Palavra.';c.excerpt=c.value;c.corrections[0].new_value=c.value;},'forma de número da casa'],
  ['marca documental com fonte diferente',c=>{c.document.source_sha256='outro';},'forma de número da casa'],
  ['texto documental sem selo de tipo',c=>{delete c.texto_documental;},'forma de número da casa'],
 ]){
  const c=structuredClone(original),erros=[];muda(c);conferirHistoriaDoValor(c,seladas,'ensaio',erros);
  assert.ok(erros.some(e=>e.includes(falha)),`${id}: ${nome}`);plantas.push({nome:`${id}: ${nome}`,falha,erros,mordeu:true});
 }
}

const entrega=linhas.get('oe-2027-calendario-entrega');
const historiaData=entradasDoValor(entrega).map(assinaturaDoValor);
for(const [nome,muda,falha] of [
 ['data impossível',c=>{c.reference_date='2026-02-31';c.value='31 de fevereiro';c.excerpt=c.value;c.corrections.at(-1).new_value=c.value;},'data completa não coincide'],
 ['mês trocado',c=>{c.value='8 de novembro';c.corrections.at(-1).new_value=c.value;},'data completa não coincide'],
 ['texto medido disfarçado de data',c=>{c.value='820 euros';c.corrections.at(-1).new_value=c.value;},'forma de calendário'],
 ['história da data retirada',c=>{c.corrections=[];},'retirada ou alterada'],
]){
 const c=structuredClone(entrega),erros=[];muda(c);conferirHistoriaDoValor(c,historiaData,'ensaio',erros);
 assert(erros.some(e=>e.includes(falha)),nome);plantas.push({nome,falha,erros,mordeu:true});
}
// HB1-c (o achado 15): uma linha de um estudo em preparação (`date: null`) não
// tem correção pública nem história selada; a planta põe uma e tem de ficar vermelha.
for(const id of ['hab-imprensa-manif-euronews','hab-imprensa-tendas']) {
 const original=linhas.get(id);
 assert.equal(original.unit,'texto');assert.deepEqual(original.corrections??[],[],`${id}: correção numa edição em preparação`);
 const so=e=>e.startsWith(`[${id}.yml]`)&&e.includes('estudo em preparação');
 assert.deepEqual(validateLedger().errors.filter(so),[]);
 const c=structuredClone(original);c.corrections=[{date:'2026-10-21',kind:'correcao',old_value:'Texto anterior.',new_value:original.value,reason:'planta',reason_en:'plant'}];
 linhas.set(id,c);
 try { const erros=validateLedger().errors.filter(so);assert.ok(erros.length,`${id}: correção numa edição em preparação passou`);plantas.push({nome:`${id}: correção pública numa edição em preparação`,falha:'estudo em preparação',erros,mordeu:true}); }
 finally { linhas.set(id,original); }
}
assert.equal(linhas.get('correcoes-publicadas').value,'12');
const r = { controlos: 4, plantas };
const i = process.argv.indexOf('--json');
if (i >= 0) fs.writeFileSync(process.argv[i+1], JSON.stringify(r, null, 2)+'\n');
console.log(`História do valor: ${r.controlos} controlos e ${plantas.length} plantas.`);
