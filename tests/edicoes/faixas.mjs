import fs from 'node:fs';import assert from 'node:assert/strict';import {load} from 'js-yaml';import {parse} from 'node-html-parser';
import {primeirasEdicoes,primeiraEdicaoServida,documentoDaHistoriaServido} from '../../src/lib/edicoes.mjs';import {conferirFaixaDaVersao} from '../../scripts/documento-edicao-conferir.mjs';
const manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8'));let plantas=0;
for(const e of primeirasEdicoes())for(const data of [e.data,null]){
 const html=data?primeiraEdicaoServida(e.slug,e.lang,data):documentoDaHistoriaServido(e.slug,e.lang),root=parse(html),confere=r=>conferirFaixaDaVersao(r,manifesto,e.slug,e.lang,data);
 assert.deepEqual(confere(root),[]);
 for(const muda of [r=>r.querySelector('[data-documento-edicao]').remove(),r=>r.querySelector('[data-edicao-data]').setAttribute('datetime','1900-01-01'),r=>r.querySelector('[data-edicao-porta]').setAttribute('href','/'),r=>r.querySelector('[data-edicao-frase]').set_content('Outra edição.')]){const copia=parse(html);muda(copia);assert(confere(copia).length);plantas++;}
}
const m=structuredClone(manifesto),e=m.edicoes.find(e=>e.primeira_edicao&&e.lang==='pt'),anterior=e.edicoes.at(-1);e.edicoes.push({...anterior,data:'2026-11-03'});
const html=`<aside data-documento-edicao="${e.slug}/pt/${anterior.data}" lang="pt-PT"><p data-edicao-frase>Edição de <time data-edicao-data datetime="${anterior.data}">${anterior.data.split('-').reverse().join('.')}</time>. A edição atual é de <time data-edicao-data datetime="2026-11-03">03.11.2026</time>.</p><a data-edicao-porta href="/estudos/${e.slug}/documento">Edição atual</a></aside>`;
assert.deepEqual(conferirFaixaDaVersao(parse(html),m,e.slug,'pt',anterior.data),[]);
console.log(`ED1-E faixas: primeiras, atuais e intermédia conferidas; ${plantas} plantas recusadas.`);
