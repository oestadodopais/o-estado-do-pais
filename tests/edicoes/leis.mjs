import {WORKS} from '../../src/data/studies.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NOME_DE_LEI} from '../../src/i18n/nomes-de-lei.mjs';
import {parse} from 'node-html-parser';
import {primeirasEdicoes,primeiraEdicaoServida} from '../../src/lib/edicoes.mjs';
import {marcarLeisDaEdicao,provaDosBytesDaEdicao} from '../../src/lib/leis-da-edicao.mjs';
let plantas=0;
for(const e of primeirasEdicoes().filter(e=>!WORKS.some(w=>w.slug===e.slug&&w.estado==='retirado'))) {
 const bruto=fs.readFileSync(e.ficheiro,'utf8'),servido=primeiraEdicaoServida(e.slug,e.lang,e.date);
 assert.equal(provaDosBytesDaEdicao(bruto,servido,e.lang),null);
 const nomes=parse(servido).querySelectorAll('[data-edicao-lei]');
 const evora=e.slug==='evora-2027-capital-europeia-da-cultura';
 if(evora&&e.lang==='en')assert(!NOME_DE_LEI.test(parse(bruto).querySelector('body').text),'EV3: a edição guardada não cita nomes de diploma');
 const fonte=parse(bruto);fonte.querySelectorAll('script,style,[lang="pt-PT"]').forEach(n=>n.remove());
 const esperados=e.lang==='en'?[...fonte.querySelector('body').textContent.matchAll(new RegExp(NOME_DE_LEI.source,'gu'))].length:0;
 assert.equal(nomes.length,esperados,'Cada nome de diploma na fonte exige a sua marca');
 for(const n of nomes){
  assert.equal(n.getAttribute('lang'),'pt-PT');
  for(const alterado of [servido.replace(n.outerHTML,n.outerHTML.replace(/\d/,d=>String((Number(d)+1)%10))),servido.replace(n.outerHTML,n.outerHTML.replace('pt-PT','en')),servido.replace(n.outerHTML,'<span data-edicao-lei lang="pt-PT">Outra frase</span>')]){
   assert.notEqual(alterado,servido,'A planta tem de alterar os bytes.');
   assert(provaDosBytesDaEdicao(bruto,alterado,e.lang));plantas++;
  }
 }
 assert(provaDosBytesDaEdicao(bruto,servido+'x',e.lang));plantas++;
}
const amostra='<html lang="en"><body><p>Lei n.º 73/2013</p><p lang="pt-PT">Lei n.º 64/2025</p><script>Lei n.º 1/2020</script></body></html>';
assert.equal((marcarLeisDaEdicao(amostra,'en').match(/data-edicao-lei/g)??[]).length,1);
console.log(`ED1-D: controlos dos bytes das primeiras edições dos estudos publicados e ${plantas} plantas das marcas e dos bytes; partição sem mudança do texto.`);
