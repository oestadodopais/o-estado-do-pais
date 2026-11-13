import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {getClaim} from '../../src/lib/ledger.mjs';
import {razaoContemData,retiradaDaContagem} from '../../src/lib/retirada-da-contagem.mjs';
import {conferirContagemEstudos} from '../../scripts/contagem-retirada-conferir.mjs';
for(const lang of ['pt','en']) {
 const id='estudos-publicados',linha=getClaim(id),e=retiradaDaContagem(linha).entrada,campo=lang==='pt'?'reason':'reason_en',antiga=e[campo];
 const rota=lang==='pt'?'/estudos':'/en/studies',recibo=lang==='pt'?'/livro-razao/':'/en/ledger/';
 const html=frase=>parse(`<div data-contagem-estudos="${id}" data-correcao-entrada="${id}"><p><span data-claim="${id}">${linha.value}</span> ${lang==='pt'?'estudos':'studies'} <a class="src-chip" href="${recibo}${id}">fonte</a></p><p data-contagem-retirada="${id}">${frase}</p></div>`);
 try {
  assert(razaoContemData(e,lang));assert.deepEqual(conferirContagemEstudos(html(antiga),lang,rota).erros,[]);
  assert(conferirContagemEstudos(html(`13.11.2026: ${antiga}`),lang,rota).erros.length,'a data repetida tem de ser recusada');
  e[campo]=lang==='pt'?'A contagem mudou.':'The count changed.';
  assert(!razaoContemData(e,lang));
  assert.deepEqual(conferirContagemEstudos(html(`13.11.2026: ${e[campo]}`),lang,rota).erros,[]);
  assert(conferirContagemEstudos(html(e[campo]),lang,rota).erros.length,'a razão sem data exige o prefixo');
 } finally {e[campo]=antiga;}
}
console.log('COR3 data: razões com e sem data nas duas línguas; duplicação e ausência recusadas.');
