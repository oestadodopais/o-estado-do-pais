/** Acrescenta só as famílias V2-a, preservando as declarações das outras corridas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {loadClaims} from '../src/lib/ledger.mjs';
import {FAMILIAS_V2A} from '../design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs';
const claims=loadClaims({includeWithdrawn:true});
const file='src/data/o-que-e-das-familias.mjs';
const original=fs.readFileSync(file,'utf8').split('\n// V2A: declarações acrescentadas pelo compositor próprio.')[0];
const match=original.match(/export const FAMILIAS_DAS_LINHAS = ([\s\S]*?);\n\nexport const FAMILIAS_DOS_CONCELHOS/);
assert(match,'declaração das famílias não encontrada');const declared=JSON.parse(match[1]);
const audFile='tests/cartao/leituras-provadas.json',aud=JSON.parse(fs.readFileSync(audFile,'utf8'));
const keys=new Set(FAMILIAS_V2A.flatMap(e=>e.chaves));
const family=id=>id.replace(/-\d{4}(-\d{2})?(?=(-ue)?$)/,'');
for(const e of FAMILIAS_V2A) {
  const rows=[...claims.values()].filter(c=>e.chaves.includes(family(c.id)));
  assert(rows.length,`família sem linhas: ${e.chaves}`);
  for(const part of e.partes) {
    assert(!/\d/.test(part.pt+part.en),'frase com algarismos');
    for(const a of part.apoios) for(const c of rows) {
      const value=a.campo.split('.').reduce((o,k)=>o?.[k],c);
      assert(a.literal.trim().length>=4 && typeof value==='string' && value.includes(a.literal),`${c.id}: apoio ausente ${a.campo} ${a.literal}`);
    }
  }
  const frase={pt:[e.partes.map(p=>p.pt).join('')],en:[e.partes.map(p=>p.en).join('')]};
  for(const k of e.chaves) declared[k]={nome:e.nome,frase};
}
const newMap=JSON.stringify(Object.fromEntries([...keys].sort().map(k=>[k,declared[k]])),null,2);
fs.writeFileSync(file,original+'\n// V2A: declarações acrescentadas pelo compositor próprio.\nObject.assign(FAMILIAS_DAS_LINHAS, '+newMap+');\n');
aud.familias=aud.familias.filter(e=>!e.chaves?.some(k=>keys.has(k)));
for(const e of FAMILIAS_V2A) aud.familias.push({chaves:e.chaves,nome:e.nome,origens:e.origens,folhas:[{pt:e.partes.map(p=>p.pt).join(''),en:e.partes.map(p=>p.en).join(''),partes:e.partes}]});
aud.leituras=aud.leituras.filter(l=>!l.o_que.startsWith('Construção V2-a:'));
aud.leituras.push({quem:'Codex gpt-6-astra',quando:'2026-10-13',o_que:'Construção V2-a: frases conferidas nas linhas e documentos selados. A leitura a frio pertence à entrega seguinte.'});
fs.writeFileSync(audFile,JSON.stringify(aud,null,2)+'\n');
console.log(`V2A: ${keys.size} famílias compostas e conferidas.`);
