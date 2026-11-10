import fs from 'node:fs';import assert from 'node:assert/strict';
import {LEITURAS} from '../../src/data/leituras.mjs';
const slug='evora-contas-da-camara-2010-2025',l=LEITURAS[slug];
for(const lang of ['pt','en']){
 const f=l.frase[lang],tokens=f.filter(p=>typeof p!=='string');
 assert.deepEqual(tokens.map(p=>p.claim??p.ref),['evora-prazo-medio-de-pagamento-2025','2025','evora-pagamentos-em-atraso-2025']);
 assert(!tokens[0].sufixo);assert(tokens[2].sufixo.startsWith('\u00a0'));
 assert(f.filter(p=>typeof p==='string').every(p=>!/[0-9]/.test(p)));
 const r=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8'));
 assert.equal(l.origem[lang],r.blocks[3].text);
 const file=`studies-src/${slug}/${lang}.html`,lines=fs.readFileSync(file,'utf8').split('\n');
 const n=lines.findIndex(t=>t.includes(r.blocks[3].text.slice(0,50)))+1;
 assert(n>0);assert(l.origem.onde.includes(`${file}:${n}`));
}
console.log('EVA leitura: dois valores, ano por referência, sufixo de unidade e parágrafo C004 com linha medida nas duas línguas.');
