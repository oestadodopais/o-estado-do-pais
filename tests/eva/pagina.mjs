import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {conferirAberturaB1} from '../../scripts/abertura-b1-do-portao.mjs';
const slug='evora-contas-da-camara-2010-2025';
for(const lang of ['pt','en']){
 const rota=`${lang==='pt'?'estudos':'en/studies'}/${slug}`;
 const root=parse(fs.readFileSync(`dist/${rota}/index.html`,'utf8'));
 const registo=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8'));
 assert.deepEqual(conferirAberturaB1(root,registo,`${slug}/${lang}`,lang),[]);
 assert.equal(root.querySelectorAll('.estudo-leitura').length,0);
 const texto=root.querySelector('.estudo-texto');
 assert.equal(texto.querySelector('h2').textContent.trim(),registo.blocks[2].text);
 const tabelas=texto.querySelectorAll('table');
 assert.equal(tabelas.length,registo.blocks.filter(b=>b.kind==='table').length);
 for(const table of tabelas)assert(table.parentNode.classList.contains('texto-tabela'));
 assert.equal(texto.querySelectorAll('[data-registo-bloco]').length,registo.blocks.length-1);
 assert(texto.textContent.includes('†'));
 const bad=parse(root.outerHTML);bad.querySelector('.estudo-texto [data-registo-bloco="3"]').remove();
 assert(conferirAberturaB1(bad,registo,`${slug}/${lang}`,lang).length);
 console.log(`EVA ${lang}: ordem completa, ${tabelas.length} quadros em caixas próprias, adagas e abertura contínua; parágrafo retirado recusado.`);
}
