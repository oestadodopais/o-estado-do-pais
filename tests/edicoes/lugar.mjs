import {rotasNoManifesto} from '../../scripts/edicoes-linha-conferir.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {WORKS} from '../../src/data/studies.mjs';
import {primeirasEdicoes} from '../../src/lib/edicoes.mjs';
import {documentosDoEstudo} from '../../src/lib/documentos.mjs';
import {conferirPortasDaEdicao,conferirColecoes} from '../../scripts/lugar-edicoes.mjs';
const historicas=primeirasEdicoes(),vistas={estudo:0,edicoes:0,primeiras_edicoes:0};let plantas=0;
const amostras=[];
const esperadas={estudo:WORKS.length*2,edicoes:WORKS.length*2,primeiras_edicoes:historicas.length};
for(const w of WORKS)for(const lang of ['pt','en']) {
 const e=w.editions.find(e=>e.lang===lang)??w.editions[0],atual=documentosDoEstudo(w.slug).find(d=>d.lang===e.lang).rota;
 const primeira=e.updated?historicas.find(h=>h.slug===w.slug&&h.lang===e.lang)?.rota:undefined;
 const rota=`${lang==='pt'?'estudos':'en/studies'}/${w.slug}`;
 const root=parse(fs.readFileSync(`${process.env.OEDP_DIST??'dist'}/${rota}/index.html`,'utf8'));
 const todas=rotasNoManifesto(w.slug,e.lang);
 amostras.push({html:root.toString(),atual,primeira,todas});
 const portas=root.querySelectorAll('.estudo-publicado a[href]').map(a=>a.getAttribute('href'));
 const r=conferirPortasDaEdicao(portas,atual,primeira,todas);assert.deepEqual(r.erros,[]);
 vistas.estudo++;vistas.edicoes+=r.edicoes;vistas.primeiras_edicoes+=r.primeiras_edicoes;
 if(primeira){for(const copia of [[atual,atual],[primeira],[primeira,atual,atual]]){assert(conferirPortasDaEdicao(copia,atual,primeira,todas).erros.length);plantas++;}}
}
assert.deepEqual(conferirColecoes(vistas,esperadas),[]);
// Uma cópia da página de estudo acrescenta outra apresentação inteira, mesmo com portas válidas.
const copia=[...amostras,structuredClone(amostras[0])];
const extra={estudo:0,edicoes:0,primeiras_edicoes:0};
for(const pagina of copia){
 const portas=parse(pagina.html).querySelectorAll('.estudo-publicado a[href]').map(a=>a.getAttribute('href'));
 const prova=conferirPortasDaEdicao(portas,pagina.atual,pagina.primeira,pagina.todas);assert.deepEqual(prova.erros,[]);
 extra.estudo++;extra.edicoes+=prova.edicoes;extra.primeiras_edicoes+=prova.primeiras_edicoes;
}
assert(conferirColecoes(extra,esperadas).some(e=>e.includes('«estudo»')));plantas++;
const falta=structuredClone(vistas);falta.primeiras_edicoes--;
assert(conferirColecoes(falta,esperadas).some(e=>e.includes('«primeiras_edicoes»')));plantas++;
console.log(`ED1-D lugar: ${vistas.estudo} estudos, ${vistas.edicoes} edições atuais e ${vistas.primeiras_edicoes} primeiras edições; ${plantas} plantas recusadas.`);
