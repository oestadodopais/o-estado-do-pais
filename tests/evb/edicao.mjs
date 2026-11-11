import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {load} from 'js-yaml';
import {WORKS} from '../../src/data/studies.mjs';
import {CORRECOES_TEXTO,CORRECOES_TEXTO_ENSAIO} from '../../src/data/correcoes.mjs';
const slug='evora-2027-capital-europeia-da-cultura';
const manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
const historia=JSON.parse(fs.readFileSync(new URL('../edicoes/fixtures/evora-2027-historia.json',import.meta.url)));
const routes=JSON.parse(fs.readFileSync('vercel.json')).routes;
assert.equal(CORRECOES_TEXTO.filter(e=>e.slug===slug).length,0);
assert.deepEqual(CORRECOES_TEXTO_ENSAIO.filter(e=>e.slug===slug),historia.correcoes);
assert.equal(WORKS.find(w=>w.slug===slug).emCurso.ate,'2027-12-31');
for(const lang of ['pt','en']){
 const e=manifesto.edicoes.find(e=>e.slug===slug&&e.lang===lang);
 assert.equal(e.edicoes.length,1);assert(!e.primeira_edicao);assert(!e.edicoes[0].natureza);
 assert.equal(e.edicoes[0].data,'2026-11-12');
 const base=`/${lang==='pt'?'estudos':'en/studies'}/${slug}`,doc=base+`/${lang==='pt'?'documento':'document'}`;
 const root=parse(fs.readFileSync(`dist${base}/index.html`,'utf8'));
 assert(!root.querySelector('[data-estudo-atualizacao], [data-estudo-correcao], [data-edicoes-linha]'));
 for(const v of historia.manifesto.edicoes.find(e=>e.lang===lang).edicoes.slice(0,-1)){
  assert(!fs.existsSync(`dist${doc}/${v.data}/index.html`));
  assert(routes.some(r=>r.src===`${doc}/${v.data}/?`&&r.status===301&&r.headers.Location===doc+'/'));
 }
}
console.log('EVB edição: publicação única, três correções de ensaio intactas, seis rotas redirecionadas e acompanhamento até 2027 conservado.');
