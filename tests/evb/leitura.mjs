import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {LEITURAS} from '../../src/data/leituras.mjs';
import {leituraJulgada} from '../../scripts/textos-julgados.mjs';
const slug='evora-2027-capital-europeia-da-cultura',l=LEITURAS[slug];
assert.deepEqual(l.medidas.map(m=>m.claim),['evora-2027-recebido-do-protocolo-ate-2025','evora-2027-transferido-no-relato-ao-painel-2025']);
let plantas=0;
for(const lang of ['pt','en']){
 const file=`studies-src/${slug}/${lang}.html`,lines=fs.readFileSync(file,'utf8').split('\n');
 const n=lines.findIndex(t=>parse(t).textContent.startsWith(l.origem[lang]))+1;
 assert(n>0);assert(l.origem.onde.includes(`${file}:${n} (C004)`));
 const registo=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8'));
 const unidades=new Set([registo.blocks[3].text]);
 assert.equal(leituraJulgada(l,lang,unidades,slug),l.origem[lang]);
 for(const mudar of [
  e=>{e.frase[lang][0]=e.frase[lang][0].replace(lang==='pt'?'contas':'accounts',lang==='pt'?'livros':'books');},
  e=>{e.frase[lang].find(p=>p.claim).claim=l.medidas[1].claim;},
  e=>{e.frase[lang].find(p=>p.ref==='2025').ref='2024';},
  e=>{e.origem[lang]=e.origem[lang].slice(0,-10);e.frase[lang][e.frase[lang].length-1]=e.frase[lang].at(-1).slice(0,-10);},
 ]){const e=structuredClone(l);mudar(e);assert.equal(leituraJulgada(e,lang,unidades,slug),null);plantas++;}
 console.log(`EVL leitura ${lang}: C004 na linha ${n}; duas medidas e primeiras frases inteiras conferidas.`);
}
console.log(`EVL: ${plantas} plantas de palavra, número, ano e frase incompleta recusadas.`);
// Os anos da definição têm marca própria; a auditoria continua a prender o ano exato.
const {FAMILIAS_DAS_LINHAS}=await import('../../src/data/o-que-e-das-familias.mjs');
const {errosDasFamilias}=await import('../../src/lib/o-que-e-o-numero.mjs');
const {conferirAuditoriaDasFamilias}=await import('../cartao/familias.mjs');
const chave='evora-2027-pago-pela-cultura';
const alterada=structuredClone(FAMILIAS_DAS_LINHAS);
alterada[chave].frase.pt.find(p=>p.ref).ref='2024';
assert(conferirAuditoriaDasFamilias({familias:alterada}).erros.length);
alterada[chave].frase.pt.find(p=>p.ref).ref='9,7';
assert(errosDasFamilias(alterada).length);
console.log('EVL definições: ano trocado e medição disfarçada de ano recusados.');
