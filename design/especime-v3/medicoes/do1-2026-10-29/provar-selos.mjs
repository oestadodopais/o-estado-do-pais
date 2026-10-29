/** DO1-B: conserva o mesmo HTML do resumo, com os selos, lado a lado. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {routePath} from '../../../../src/lib/routes.mjs';
const escapar=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const ler=rota=>parse(fs.readFileSync(`dist/${rota.replace(/^\//,'')}/index.html`,'utf8'));
const blocos=[];
for(const lang of ['pt','en']) {
 const inicio=routePath('home',lang), dossie=routePath('dossie',lang,{slug:'orcamento-2027'});
 const resumo=rota=>ler(rota).querySelector('[data-discussao-porta="parcerias-rodoviarias"]').closest('li').querySelector('[data-discussao-resumo]');
 const a=resumo(inicio),b=resumo(dossie);
 assert.equal(a.outerHTML,b.outerHTML);
 const valores=a.querySelectorAll('[data-claim]');assert(valores.length);
 for(const v of valores)assert(v.parentNode.querySelector(`a.src-chip[href="${routePath('linha',lang,{slug:v.getAttribute('data-claim')})}"]`));
 blocos.push(`<h2>${lang}</h2><p>HTML integral igual, com o selo local de cada valor.</p><table><thead><tr><th>${inicio}</th><th>${dossie}</th></tr></thead><tbody><tr><td><pre>${escapar(a.outerHTML)}</pre></td><td><pre>${escapar(b.outerHTML)}</pre></td></tr></tbody></table>`);
}
fs.writeFileSync('design/especime-v3/medicoes/do1-2026-10-29/selos-lado-a-lado.html',`<!doctype html><html lang="pt"><meta charset="utf-8"><title>DO1: os selos dos resumos</title><style>body{font-family:system-ui;margin:2rem}table{width:100%;table-layout:fixed;border-collapse:collapse}td,th{border:1px solid #999;padding:1rem;vertical-align:top}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px}</style><h1>DO1: os selos dos resumos</h1>${blocos.join('')}</html>\n`);
console.log('DO1-B: HTML igual nas duas superfícies e nas duas edições; selos locais conferidos.');
