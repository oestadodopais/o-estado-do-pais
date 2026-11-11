import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {LEITURAS} from '../../src/data/leituras.mjs';
const slug='evora-2027-capital-europeia-da-cultura',l=LEITURAS[slug];
assert.deepEqual(l.medidas,[]);
for(const lang of ['pt','en']){
 const f=l.frase[lang];
 assert.deepEqual(f.filter(p=>typeof p!=='string'),[{ref:'2024'},{ref:'2025'}]);
 assert(f.filter(p=>typeof p==='string').every(p=>!/[0-9]/.test(p)));
 const file=`studies-src/${slug}/${lang}.html`,lines=fs.readFileSync(file,'utf8').split('\n');
 const n=lines.findIndex(t=>parse(t).textContent===l.origem[lang])+1;
 assert(n>0);assert(l.origem.onde.includes(`${file}:${n} (C039)`));
 const texto=f.map(p=>typeof p==='string'?p:p.ref).join('');
 assert.equal(texto,l.origem[lang].replace(lang==='pt'?'a do município':"the municipality's",lang==='pt'?'a da câmara':"the council's"));
 console.log(`EVB leitura ${lang}: C039 na linha ${n}, dois anos por referência e só a troca da palavra da casa.`);
}
