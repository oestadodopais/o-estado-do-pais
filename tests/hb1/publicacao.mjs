import { parse } from 'node-html-parser';
import assert from 'node:assert/strict';
import { conferirDataDeclarada, conferirPublicacaoDeclaradaNoHtml } from '../../scripts/publicacao-declarada.mjs';
import { resolverDataPublicacao } from '../../src/lib/publicacao.mjs';
import { edicaoPublicada } from '../../src/data/studies.mjs';
import { aberturaDoEstudo } from '../../src/lib/abertura-do-estudo.mjs';
const work = { publication: 'declared' };
assert.equal(resolverDataPublicacao(work, { date: null }, '2026-10-20'), null);
assert.equal(edicaoPublicada(work, { date: null }), false);
assert.equal(resolverDataPublicacao(work, { date: '2026-10-23' }, '2026-10-20'), '2026-10-23');
assert.equal(edicaoPublicada(work, { date: '2026-10-23' }), true);
assert.equal(resolverDataPublicacao({}, { date: null }, '2026-10-20'), '2026-10-20');
for(const data of ['2027-02-29','2026-11-31','2026-13-01']) {
 assert.throws(()=>resolverDataPublicacao(work,{date:data},'2026-10-20'),/inválida/);
 assert.equal(conferirDataDeclarada(work,{date:data},'2026-10-20').length,1);
}
assert.equal(resolverDataPublicacao(work,{date:'2026-10-20'},'2026-10-20'),'2026-10-20');
const errosDaPlanta = conferirDataDeclarada(work, { date: '2026-10-19' }, '2026-10-20');
assert.equal(errosDaPlanta.length, 1);
assert.deepEqual(conferirDataDeclarada(work, { date: null }, '2026-10-20'), []);
assert.deepEqual(conferirDataDeclarada(work, { date: '2026-10-23' }, '2026-10-20'), []);
if (process.argv.includes('--planta-data')) {
  console.error('HB1 portão: ' + errosDaPlanta[0]);
  process.exit(1);
}
assert.throws(() => resolverDataPublicacao(work, { date: '2026-10-19' }, '2026-10-20'), /anterior ao commit/);
const registo = { blocks: [{ i: 0, kind: 'heading', level: 1, text: 'Título' }, { i: 1, kind: 'paragraph', text: 'Intro' }, { i: 2, kind: 'heading', level: 2, text: 'In brief' }] };
assert.equal(aberturaDoEstudo(registo, 'en').temAbertura, true);
assert.equal(aberturaDoEstudo({ blocks: registo.blocks.map(b => b.i === 2 ? { ...b, text: 'In short' } : b) }, 'en').temAbertura, false);
console.log('HB1 publicação: preparação, aterragem declarada, legado, planta anterior e abertura comum conferidos.');
// I9: cópias mínimas do HTML para provar a distinção entre entrada e publicação.
const declarada={publication:'declared',slug:'estudo-planta'};
const htmlPublicacao=(date,status='Draft',extra={})=>parse(`<main><p data-estudo-edicao="estudo-planta/pt">${date?`publicado a <time datetime="${date}">${date.slice(8)}.${date.slice(5,7)}.${date.slice(0,4)}</time>`:'Edição em preparação'}</p><div data-registo-edicao="estudo-planta/pt"></div></main><script type="application/ld+json">${JSON.stringify({'@type':'Article',creativeWorkStatus:status,...extra})}</script>`);
const provaPublicacao=(date,html,entrada='2026-10-20')=>conferirPublicacaoDeclaradaNoHtml(declarada,{lang:'pt',date},entrada,html);
assert.deepEqual(provaPublicacao(null,htmlPublicacao(null)),[]);
assert.deepEqual(provaPublicacao('2026-10-23',htmlPublicacao('2026-10-23','Published')),[]);
for(const [date,html]of [
 [null,htmlPublicacao('2026-10-20')],
 [null,htmlPublicacao(null,'Published')],
 [null,htmlPublicacao(null,'Draft',{datePublished:'2026-10-20'})],
 ['2026-10-19',htmlPublicacao('2026-10-19','Published')],
 ['2026-10-23',htmlPublicacao('2026-10-20','Published')],
 ['2026-10-23',htmlPublicacao('2026-10-23','Draft')],
 ['2026-10-23',htmlPublicacao('2026-10-23','Published',{datePublished:'2026-10-20'})],
]) assert(provaPublicacao(date,html).length,'a planta de publicação passou');
console.log('I9 publicação declarada: dois controlos verdes; sete adulterações recusadas.');
