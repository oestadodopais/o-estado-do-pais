/** EVB: a página conserva a sequência e o texto do registo julgado. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {conferirAberturaB1} from '../../scripts/abertura-b1-do-portao.mjs';
import {WORKS} from '../../src/data/studies.mjs';
const slug='evora-2027-capital-europeia-da-cultura';
const normal=s=>s.replace(/[\u200b\u2060\u00ad]/g,'').replace(/\s+/g,' ').trim();
for(const lang of ['pt','en']){
 const base=`${lang==='pt'?'estudos':'en/studies'}/${slug}`;
 const root=parse(fs.readFileSync(`dist/${base}/index.html`,'utf8'));
 const doc=parse(fs.readFileSync(`studies-src/${slug}/${lang}.html`,'utf8'));
 const r=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8'));
 const work=WORKS.find(w=>w.slug===slug);
 assert.equal(normal(root.querySelector('h1').textContent),normal(r.blocks[0].text));
 assert.equal(work.editions.find(e=>e.lang===lang).title,doc.querySelector('h1').nextElementSibling.textContent);
 assert.equal(work.pergunta[lang],r.blocks[2].text);
 assert.deepEqual(conferirAberturaB1(root,r,`${slug}/${lang}`,lang),[]);
 const texto=root.querySelector('.estudo-texto');
 assert.equal(texto.querySelectorAll('[data-registo-bloco]').length,r.blocks.length-1);
 const tabelas=texto.querySelectorAll('table');
 assert.equal(tabelas.length,r.blocks.filter(b=>b.kind==='table').length);
 for(const table of tabelas)assert(table.parentNode.classList.contains('texto-tabela'));
 assert.equal(texto.querySelectorAll('ul').length,doc.querySelectorAll('ul').length);
 const afirmacoes=tabelas.find(t=>t.querySelectorAll('tr').length===6&&t.textContent.includes(lang==='pt'?'Veredicto':'Verdict'));
 assert(afirmacoes,'quadro das cinco afirmações');
 const fonte=doc.querySelectorAll('table').find(t=>t.querySelectorAll('tr').length===6&&t.textContent.includes(lang==='pt'?'Veredicto':'Verdict'));
 assert.deepEqual(afirmacoes.querySelectorAll('tr').slice(1).map(tr=>normal(tr.querySelectorAll('td').at(-1).textContent)),fonte.querySelectorAll('tr').slice(1).map(tr=>normal(tr.querySelectorAll('td').at(-1).textContent)));
 assert(texto.textContent.includes('†'));
 assert(root.querySelector('footer'));
 const hs=root.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6');
 for(let i=1;i<hs.length;i++)assert(Number(hs[i].tagName[1])<=Number(hs[i-1].tagName[1])+1,`salto: ${hs[i].textContent}`);
 const bad=parse(root.outerHTML);bad.querySelector('.estudo-texto [data-registo-bloco="3"]').remove();
 assert(conferirAberturaB1(bad,r,`${slug}/${lang}`,lang).length);
 console.log(`EVB ${lang}: manchete, nome, pergunta, ordem, listas, ${tabelas.length} quadros, cinco veredictos, adaga, rodapé e títulos; abertura retirada recusada.`);
}
