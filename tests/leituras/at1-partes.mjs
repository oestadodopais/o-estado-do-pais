import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { dividir, conferirPartes, juntar } from '../../scripts/verify-partes.mjs';
import {medidasEsperadas, PRESENCAS} from '../../scripts/alvos-fatias.mjs';
import {restantesDoVerify, celulaDaUniao, passosDaEscrita} from '../../scripts/verify-depois-do-build.mjs';
const scripts = JSON.parse(fs.readFileSync('package.json')).scripts;
const tabela = JSON.parse(fs.readFileSync('scripts/verify-partes-tempos.json'));
const tempos = {...tabela.estimativas, ...tabela.passos};
const plano = dividir(scripts, tempos);
conferirPartes(scripts, plano.partes);
assert.equal(scripts['check:metodo-construido'], 'node tests/metodo/construido.mjs');
assert.equal(plano.partes.length, 6);
assert.equal(plano.partes.flat().filter(p => p === 'npm run check:metodo-construido').length, 1);
assert.throws(()=>conferirPartes({...scripts, build:'true'},plano.partes));
for (let i=0; i<plano.partes.length; i++) {
  const falta=structuredClone(plano.partes); falta[i].pop();
  assert.throws(()=>conferirPartes(scripts,falta));
}
const repetido=structuredClone(plano.partes); repetido[0].push(repetido[1][0]);
assert.throws(()=>conferirPartes(scripts,repetido));
const construidos=passosDaEscrita(scripts).map(passo=>({passo,codigo:0}));
const base={...plano,cabeca:'ensaio',construidos};
const manifesto=crypto.createHash('sha256').update(JSON.stringify(base)).digest('hex');
const provas=plano.partes.map((p,i)=>({parte:i,cabeca:'ensaio',manifesto,ok:true,celulas:{U:{ok:true},D:{ok:true},C:{ok:true}},corridos:p.map(passo=>({passo,codigo:0})),alvos:p.filter(p=>/^npm run check:alvos:[012]$/.test(p)).map(p=>({fatia:Number(p.at(-1)),execucao:manifesto,ok:true,medidas:medidasEsperadas(Number(p.at(-1))),presencas:Object.fromEntries(PRESENCAS.map(k=>[k,1]))}))}));
assert(juntar(scripts,base,provas).ok);
for (const mudar of [p=>p.pop(),p=>p[0].corridos.pop(),p=>p[0].corridos[0].codigo=1,p=>p[0].celulas.D.ok=false,p=>p[0].celulas.C.ok=false,p=>p[0].cabeca='outra',p=>p[0].manifesto='outro',p=>p[0].parte=1]) {
 const p=structuredClone(provas); mudar(p); assert.throws(()=>juntar(scripts,base,p));
}
console.log('AT1: união inteira verde; faltas, repetições, vermelhos e outras construções recusados');

// Sem motor no ambiente, apenas a reserva declarada sai da união do GitHub.
const ambiente = process.env.RESEARCHHUB_DIR;
delete process.env.RESEARCHHUB_DIR;
try {
  const motor = scripts['verify:com-motor'].split(/\s*&&\s*/);
  const verify = scripts.verify.split(/\s*&&\s*/);
  const build = passosDaEscrita(scripts);
  const partes = dividir(scripts, tempos).partes;
  assert.deepEqual(partes.flat().sort(), restantesDoVerify(scripts).sort());
  assert.deepEqual([...verify.filter(p => build.includes(p)), ...partes.flat()].sort(), verify.filter(p => !motor.includes(p)).sort());
  assert.equal(juntar(scripts, base, provas).U.reservados_ao_motor, 2);
  for (const reserva of ['npm run inexistente', scripts['verify:com-motor'] + ' && ', scripts['verify:com-motor'] + ' && ' + motor[0]]) {
    const invalidos = {...scripts, 'verify:com-motor':reserva};
    assert.throws(() => restantesDoVerify(invalidos));
    assert.throws(() => conferirPartes(invalidos, partes));
    assert.throws(() => juntar(invalidos, base, provas));
    assert.equal(celulaDaUniao(invalidos, provas.flatMap(p => p.corridos), construidos).ok, false);
  }
  const omitidos = partes.map(ps => ps.filter(p => p !== partes[0][0]));
  assert.equal(celulaDaUniao(scripts, omitidos.flat().map(passo => ({passo, codigo:0}))).ok, false);
  console.log(JSON.stringify({sem_motor:true, verify:verify.length, build:verify.filter(p => build.includes(p)).length, partes:partes.flat().length, reservados:motor}));
} finally {
  if (ambiente === undefined) delete process.env.RESEARCHHUB_DIR; else process.env.RESEARCHHUB_DIR = ambiente;
}

// VEL1: a união lê também o build e exige o registo real da escrita.
const exemplo = {build:'python3 scripts/leituras/com-tranca.py npm run build:conteudo',
  'build:conteudo':'escreve && le && exclusivo', 'build:escrever':'escreve', verify:'le && verifica'};
const partesExemplo = [['le', 'verifica', 'exclusivo']];
const registo = [{passo:'escreve',codigo:0}];
conferirPartes(exemplo, partesExemplo);
assert(celulaDaUniao(exemplo, partesExemplo.flat().map(passo=>({passo,codigo:0})),registo).ok);
assert.throws(()=>conferirPartes(exemplo, [['le','verifica']]), /faltam ou sobram/);
assert(!celulaDaUniao(exemplo,[{passo:'le',codigo:0},{passo:'verifica',codigo:0}],registo).ok);
assert.throws(()=>conferirPartes({...exemplo,'build:escrever':'intruso'},partesExemplo), /ausente/);
assert.throws(()=>conferirPartes({...exemplo,'build:escrever':'le && escreve'},[['verifica','exclusivo']]), /ordem/);
conferirPartes({...exemplo,'build:escrever':'escreve && le'},[['verifica','exclusivo']]);
for (const falsos of [[],[{passo:'escreve',codigo:1}],[...registo,...registo]])
  assert(!celulaDaUniao(exemplo,partesExemplo.flat().map(passo=>({passo,codigo:0})),falsos).ok);
console.log('VEL1 escrita: omissão, intruso, ordem trocada e registo incompleto ou vermelho recusados; leitor antecipado aceite');
