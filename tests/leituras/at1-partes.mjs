import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { dividir, conferirPartes, juntar } from '../../scripts/verify-partes.mjs';
const scripts = JSON.parse(fs.readFileSync('package.json')).scripts;
const tempos = JSON.parse(fs.readFileSync('scripts/verify-partes-tempos.json')).passos;
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
const base={...plano,cabeca:'ensaio'};
const manifesto=crypto.createHash('sha256').update(JSON.stringify(base)).digest('hex');
const provas=plano.partes.map((p,i)=>({parte:i,cabeca:'ensaio',manifesto,ok:true,celulas:{U:{ok:true},D:{ok:true},C:{ok:true}},corridos:p.map(passo=>({passo,codigo:0}))}));
assert(juntar(scripts,base,provas).ok);
for (const mudar of [p=>p.pop(),p=>p[0].corridos.pop(),p=>p[0].corridos[0].codigo=1,p=>p[0].celulas.D.ok=false,p=>p[0].celulas.C.ok=false,p=>p[0].cabeca='outra',p=>p[0].manifesto='outro',p=>p[0].parte=1]) {
 const p=structuredClone(provas); mudar(p); assert.throws(()=>juntar(scripts,base,p));
}
console.log('AT1: união inteira verde; faltas, repetições, vermelhos e outras construções recusados');
