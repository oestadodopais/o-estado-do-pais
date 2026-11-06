/** EV3-p D: procura reproduzível das datas nas declarações e nas suas conferências. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {loadClaims,POR_VERIFICAR} from '../../../../src/lib/ledger.mjs';
import {LINGUA_DAS_EDICOES} from '../../../../src/i18n/lingua-dos-titulos.mjs';
const pasta=path.dirname(new URL(import.meta.url).pathname);
const claims=[...loadClaims()];
const usadas=new Map();
for(const [id,c] of claims){const e=c.document?.edition;if(e==null||String(e)===''||String(e)===POR_VERIFICAR)continue;const s=String(e);usadas.set(s,[...(usadas.get(s)??[]),id]);}
const falta=[...usadas.keys()].filter(e=>!Object.hasOwn(LINGUA_DAS_EDICOES,e));
const sobra=Object.keys(LINGUA_DAS_EDICOES).filter(e=>!usadas.has(e));
const ficheiros=execFileSync('git',['ls-files','-z','--','src','scripts','tests','ledger','studies-src/manifest.yml','design/especime-v3/INVENTARIO-FRASES.md'],{encoding:'utf8',maxBuffer:16*1024*1024}).split('\0').filter(f=>f&&(/^(src|scripts|tests|ledger)\//.test(f)&&/\.(mjs|js|ts|json|yml|yaml|astro)$/.test(f)||f==='studies-src/manifest.yml'||f==='design/especime-v3/INVENTARIO-FRASES.md'));
const referencias=[];const candidatas=[];
for(const f of ficheiros){const linhas=fs.readFileSync(f,'utf8').split('\n');const datas=[];for(let i=0;i<linhas.length;i++)if(/2026-11-0[36]|0[36]\.11\.2026/.test(linhas[i]))datas.push({linha:i+1,trecho:linhas[i].trim().slice(0,240)});if(datas.length)referencias.push({ficheiro:f,datas});if(linhas.some(l=>/(edition|edi[cç][aãõo]|teto|invent[aá]rio)/i.test(l))&&linhas.some(l=>/\b20\d\d-\d\d-\d\d\b|\b\d\d\.\d\d\.20\d\d\b/.test(l)))candidatas.push(f);}
const r={ficheiros_examinados:ficheiros.length,edicoes:{'03.11.2026':usadas.get('03.11.2026')??[],'06.11.2026':usadas.get('06.11.2026')??[]},lingua:{falta,sobra},candidatas,referencias};
fs.writeFileSync(path.join(pasta,'auditoria.json'),JSON.stringify(r,null,2)+'\n');
assert.deepEqual(r.edicoes['03.11.2026'],[]);assert.deepEqual(r.edicoes['06.11.2026'],['correcoes-publicadas']);assert.deepEqual(falta,[]);assert.deepEqual(sobra,[]);
console.log(JSON.stringify({ficheiros_examinados:r.ficheiros_examinados,edicoes:r.edicoes,lingua:r.lingua,referencias:referencias.map(r=>({ficheiro:r.ficheiro,ocorrencias:r.datas.length}))}));
