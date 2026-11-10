import fs from 'node:fs';import assert from 'node:assert/strict';import {load} from 'js-yaml';
import {WORKS} from '../../src/data/studies.mjs';
import {CORRECOES_TEXTO,CORRECOES_TEXTO_ENSAIO} from '../../src/data/correcoes.mjs';
import {conferirHistoria} from '../../scripts/historia-edicoes-conferir.mjs';
import {dataEdicaoUnica} from '../../scripts/data-edicao-unica.mjs';
const slug='evora-contas-da-camara-2010-2025',manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
const datas=JSON.parse(fs.readFileSync('src/data/datas-de-publicacao.json')).edicoes;
for(const lang of ['pt','en']){
 const e=manifesto.edicoes.find(e=>e.slug===slug&&e.lang===lang),d=datas.find(e=>e.slug===slug&&e.lang===lang);
 assert.equal(e.edicoes.length,1);assert(!e.primeira_edicao);assert(!e.edicoes[0].natureza);
 assert.equal(dataEdicaoUnica(d,manifesto),d.data);assert.equal(d.data,'2026-11-11');
 const work=WORKS.find(w=>w.slug===slug).editions.find(e=>e.lang===lang);assert.equal(work.date,d.data);assert.equal(work.updated,null);
 const bad=structuredClone(manifesto);bad.edicoes.find(e=>e.slug===slug&&e.lang===lang).edicoes.push({...e.edicoes[0]});
 assert.throws(()=>dataEdicaoUnica(d,bad));
 for(const day of ['2026-10-01','2026-10-30'])assert(!fs.existsSync(`dist/${lang==='pt'?'estudos':'en/studies'}/${slug}/${lang==='pt'?'documento':'document'}/${day}/index.html`));
}
const args={works:WORKS,manifesto,correcoes:CORRECOES_TEXTO,raiz:'studies-src'};
assert.deepEqual(conferirHistoria(args),[]);
assert(conferirHistoria({...args,correcoes:[...CORRECOES_TEXTO,CORRECOES_TEXTO_ENSAIO[0]]}).some(e=>e.startsWith('ED1 órfã:')));
console.log('EVA edição: publicação única, datas e arquivo retirado conferidos; segunda versão e entrada viva sem versão recusadas.');
