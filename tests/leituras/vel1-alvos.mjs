import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DEPOIS_DO_GRUPO} from '../../scripts/verify-depois-do-build.mjs';
import {execFileSync} from 'node:child_process';
import {FAMILIAS,EDICOES,LARGURAS,medidasEsperadas,fatiaDaFamilia,PRESENCAS,juntarAlvos} from '../../scripts/alvos-fatias.mjs';
const inteira = JSON.parse(execFileSync('node',['tests/acessibilidade/alvos.mjs','--listar'],{encoding:'utf8'}));
const fatias = [0,1,2].map(i=>JSON.parse(execFileSync('node',['tests/acessibilidade/alvos.mjs','--fatia',String(i),'--listar'],{encoding:'utf8'})));
assert.deepEqual(fatias.flat().sort(), [...inteira].sort());
for (let i=0;i<3;i++) for (let j=i+1;j<3;j++) assert(!fatias[i].some(m=>fatias[j].includes(m)), 'fatias sobrepostas');
assert.equal(inteira.length, FAMILIAS.length*EDICOES.length*LARGURAS.length);
const provas=fatias.map((medidas,fatia)=>({medidas,fatia,ok:true,execucao:'ensaio',presencas:Object.fromEntries(PRESENCAS.map(k=>[k,fatia===0?1:0]))}));
assert(juntarAlvos(provas,'ensaio').ok);
for (const mudar of [p=>p[1].medidas.splice(0,5),p=>p[1].medidas.pop(),p=>p[1].medidas.push(p[0].medidas[0]),p=>p[1].fatia=0,p=>p[1].execucao='outra',p=>p[1].ok=false]) {
  const p=structuredClone(provas);mudar(p);assert.throws(()=>juntarAlvos(p,'ensaio'));
}
for (const k of PRESENCAS) {
  const p=structuredClone(provas);p[0].presencas[k]=0;
  assert.throws(()=>juntarAlvos(p,'ensaio'),new RegExp(`ausência de ${k}`));
  p[2].presencas[k]=1;assert(juntarAlvos(p,'ensaio').ok);
}
assert.throws(()=>fatiaDaFamilia('desconhecida','pt'));
console.log(JSON.stringify({regua_inteira:inteira.length,fatias:fatias.map(p=>p.length),plantas:'família e largura omitidas, repetição, outra execução, vermelho e todas as ausências recusados'}));

const scripts=JSON.parse(fs.readFileSync('package.json')).scripts;
for (const i of [0,1,2]) {
  assert(scripts.verify.split(' && ').includes(`npm run check:alvos:${i}`));
  assert(scripts[`check:alvos:${i}`].includes(`--fatia ${i}`));
  assert(DEPOIS_DO_GRUPO.includes(`npm run check:alvos:${i}`));
}
assert(scripts['check:alvos:0'].includes('expanded-documentos.mjs'));
assert(scripts['check:alvos:0'].includes('disposicao.mjs alvos'));
assert(scripts['check:alvos:2'].includes('--juntar'));
assert(!scripts.verify.split(' && ').includes('npm run check:alvos'));
