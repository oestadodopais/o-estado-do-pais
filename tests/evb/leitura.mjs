import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {LEITURAS} from '../../src/data/leituras.mjs';
const slug='evora-2027-capital-europeia-da-cultura',l=LEITURAS[slug];
assert.deepEqual(l.medidas,[]);
for(const lang of ['pt','en']){
 const f=l.frase[lang];
 assert.deepEqual(f.filter(p=>typeof p!=='string'),[{ref:'2025'}]);
 assert(f.filter(p=>typeof p==='string').every(p=>!/[0-9]/.test(p)));
 const file=`studies-src/${slug}/${lang}.html`,lines=fs.readFileSync(file,'utf8').split('\n');
 const n=lines.findIndex(t=>parse(t).textContent===l.origem[lang])+1;
 assert(n>0);assert(l.origem.onde.includes(`${file}:${n} (C005)`));
 const texto=f.map(p=>typeof p==='string'?p:p.ref).join('');
 assert.equal(texto,l.origem[lang]);
 assert.equal(l.origem.troca,undefined);
 const registo=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8'));
 assert.equal(texto,registo.blocks[4].text);
 console.log(`EVB leitura ${lang}: C005 na linha ${n}, um ano por referência, sem medidas nem troca de palavras.`);
}
