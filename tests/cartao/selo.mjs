import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { seloDoValorDoCartao } from '../../scripts/selo-do-cartao.mjs';

const id = 'precos-da-habitacao-2025';
const alvo = `/livro-razao/${id}`;
const fonte = `<article data-cartao-medida="${id}"><p class="cartao-medida-valor"><span class="cartao-medida-quantidade"><span data-claim="${id}"></span><span data-linha-campo="unit" data-linha-claim="${id}"></span></span><a class="src-chip" href="${alvo}"></a></p></article>`;
const conferir = (html) => {
  const root = parse(html);
  return seloDoValorDoCartao(root.querySelector('[data-claim]'), id, alvo);
};
assert.equal(conferir(fonte), true);
const plantas = [
  ['selo retirado', fonte.replace(/<a class.*?<\/a>/, '')],
  ['selo de outra linha', fonte.replace(`href="${alvo}"`, 'href="/livro-razao/divida-publica-2025"')],
  ['selo fora da linha do valor', fonte.replace(/(<a class.*?<\/a>)(<\/p>)/, '$2$1')],
  ['duas marcas', fonte.replace('</p>', `<a class="src-chip" href="${alvo}"></a></p>`)],
  ['unidade de outra linha', fonte.replace(`data-linha-claim="${id}"`, 'data-linha-claim="divida-publica-2025"')],
  ['dois valores na linha', fonte.replace('</p>', `<span data-claim="${id}"></span></p>`)],
];
for (const [nome, html] of plantas) {
  assert.equal(conferir(html), false, nome);
  console.log(`planta: ${nome}, recusada`);
}
assert.equal(conferir(fonte), true);
console.log('selo do cartão: forma legítima aceite, plantas recusadas, reposição aceite');
