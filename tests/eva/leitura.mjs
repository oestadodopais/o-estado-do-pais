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

// A frase completa conserva a voz; o rótulo isolado e uma palavra nova continuam proibidos.
const {RETIRADAS_EVA,retiradaForaDaFrase}=await import('../../scripts/voz-edicoes.mjs');
const admitidas=RETIRADAS_EVA.get('Debt limit');
for(const frase of admitidas){assert(!retiradaForaDaFrase(frase,'Debt limit',admitidas));assert(retiradaForaDaFrase(frase+' Extra.','Debt limit',admitidas));}
assert(retiradaForaDaFrase('Debt limit','Debt limit',admitidas));
console.log('EVA voz: leitura completa aceite; rótulo isolado e frase alterada recusados.');
