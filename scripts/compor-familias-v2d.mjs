/** Acrescenta só as famílias V2-d, preservando as declarações das outras corridas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {ORIGENS_DAS_DEFINICOES} from '../src/data/figuras.mjs';
import {loadClaims} from '../src/lib/ledger.mjs';
import {FAMILIAS_V2D} from '../design/especime-v3/medicoes/v2d-2026-10-20/familias.mjs';
const claims=loadClaims({includeWithdrawn:true});
const file='src/data/o-que-e-das-familias.mjs';
const original=fs.readFileSync(file,'utf8').split('\n// V2D: declarações acrescentadas pelo compositor próprio.')[0];
const match=original.match(/export const FAMILIAS_DAS_LINHAS = ([\s\S]*?);\n\nexport const FAMILIAS_DOS_CONCELHOS/);
assert(match,'declaração das famílias não encontrada');const declared=JSON.parse(match[1]);
const audFile='tests/cartao/leituras-provadas.json',aud=JSON.parse(fs.readFileSync(audFile,'utf8'));
const keys=new Set(FAMILIAS_V2D.flatMap(e=>e.chaves));
const family=id=>keys.has(id)?id:id.replace(/-\d{4}(-\d{2})?(?=(-ue)?$)/,'');
for(const e of FAMILIAS_V2D) {
  const rows=[...claims.values()].filter(c=>e.chaves.includes(family(c.id)));
  assert(rows.length,`família sem linhas: ${e.chaves}`);
  for(const part of e.partes) {
    assert(!/\d/.test(part.pt+part.en),'frase com algarismos');
    for(const a of part.apoios) for(const c of rows) {
      if(a.origem) { assert(ORIGENS_DAS_DEFINICOES[a.origem]?.[a.campo]?.includes(a.literal),'origem sem literal'); continue; }
      const value=a.campo.split('.').reduce((o,k)=>o?.[k],c);
      assert(a.literal.trim().length>=4 && typeof value==='string' && value.includes(a.literal),`${c.id}: apoio ausente ${a.campo} ${a.literal}`);
    }
  }
  const frase={pt:[e.partes.map(p=>p.pt).join('')],en:[e.partes.map(p=>p.en).join('')]};
  for(const k of e.chaves) declared[k]={nome:e.nome,frase,...(e.complemento?{complemento:e.complemento}:{}),...(e.origens.length?{origens:e.origens}:{})};
}
const newMap=JSON.stringify(Object.fromEntries([...keys].sort().map(k=>[k,declared[k]])),null,2);
fs.writeFileSync(file,original+'\n// V2D: declarações acrescentadas pelo compositor próprio.\nObject.assign(FAMILIAS_DAS_LINHAS, '+newMap+');\n');
aud.familias=aud.familias.filter(e=>!e.chaves?.some(k=>keys.has(k)));
for(const e of FAMILIAS_V2D) aud.familias.push({chaves:e.chaves,nome:e.nome,origens:e.origens,...(e.complemento?{complemento:e.complemento}:{}),folhas:[{pt:e.partes.map(p=>p.pt).join(''),en:e.partes.map(p=>p.en).join(''),partes:e.partes}]});
aud.leituras=aud.leituras.filter(l=>!l.o_que.startsWith('Construção V2-d:'));
aud.leituras.push({quem:'Codex gpt-6-astra',quando:'2026-10-20',o_que:'Construção V2-d: frases conferidas nas linhas e documentos selados. A leitura a frio pertence à entrega seguinte.'});
fs.writeFileSync(audFile,JSON.stringify(aud,null,2)+'\n');
console.log(`V2D: ${keys.size} famílias compostas e conferidas.`);
