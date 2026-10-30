import { parse } from 'node-html-parser';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { conferirDataDeclarada, conferirPublicacaoDeclaradaNoHtml } from '../../scripts/publicacao-declarada.mjs';
import { resolverDataPublicacao } from '../../src/lib/publicacao.mjs';
import { edicaoPublicada, WORKS } from '../../src/data/studies.mjs';
import { aberturaDoEstudo } from '../../src/lib/abertura-do-estudo.mjs';
import { dataDaEdicaoNoRepositorio, FICHEIRO_DAS_DATAS } from '../../src/lib/datas-do-repositorio.mjs';
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
const htmlPublicacao=(date,status='Draft',extra={})=>`<html><head><script type="application/ld+json">${JSON.stringify({'@type':'Article',creativeWorkStatus:status,...extra})}</script></head><body><main><p data-estudo-edicao="estudo-planta/pt">${date?`publicado a <time datetime="${date}">${date.slice(8)}.${date.slice(5,7)}.${date.slice(0,4)}</time>`:'Edição em preparação'}</p><div data-registo-edicao="estudo-planta/pt"></div></main></body></html>`;
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
assert(provaPublicacao(null,parse(htmlPublicacao(null)).querySelector('body')).length,'a árvore sem JSON-LD não pode ser a entrada da régua');
if(process.argv.includes('--html-construido')) {
 // A data de entrada de cada edição lê-se do ficheiro comitado, nunca do `git` vivo (a lição do F1.4b em
 // src/lib/datas-do-repositorio.mjs): numa cópia rasa, como a que a Vercel constrói, o `git log` responde com o
 // commit mais antigo que a cópia tem, e a 27.10.2026 esta régua fechou a construção de produção com a data do
 // dia no lugar da entrada do Orçamento (I272). scripts/check-datas.mjs confere o ficheiro contra o `git` onde a
 // história é completa, por isso a régua lê aqui o mesmo em qualquer cópia.
 const planta=process.argv.includes('--planta-entrada');
 let edicoes=0, plantadas=0;
 for(const work of WORKS.filter(w=>w.publication==='declared'))for(const edition of work.editions) {
  const rota=edition.lang==='pt'?`/estudos/${work.slug}`:`/en/studies/${work.slug}`;
  const pag={rota,html:fs.readFileSync(path.join(process.env.OEDP_DIST??'dist',rota,'index.html'),'utf8')};
  const entrada=dataDaEdicaoNoRepositorio(work.slug,edition.lang);
  assert.match(String(entrada),/^\d{4}-\d{2}-\d{2}$/,`${work.slug}/${edition.lang}: sem data de entrada em ${FICHEIRO_DAS_DATAS}`);
  // O argumento é pag.html, exatamente como na célula I9, antes da peneira da prosa.
  assert.deepEqual(conferirPublicacaoDeclaradaNoHtml(work,edition,entrada,pag.html),[]);
  if(edition.updated) {
   const semAtualizacao=parse(pag.html);
   semAtualizacao.querySelector('[data-estudo-atualizacao]').remove();
   assert(conferirPublicacaoDeclaradaNoHtml(work,edition,entrada,semAtualizacao.toString()).some(e=>e.includes('atualização')),'EV2: atualização ausente passou');
   const dataTrocada=parse(pag.html);
   dataTrocada.querySelector('[data-estudo-atualizacao]').setAttribute('datetime',edition.date);
   assert(conferirPublicacaoDeclaradaNoHtml(work,edition,entrada,dataTrocada.toString()).some(e=>e.includes('atualização')),'EV2: publicação no lugar da atualização passou');
  }
  if(planta&&edition.date){
   // A planta: a mesma página com uma entrada um dia depois da data declarada tem de ser recusada por esta régua.
   const depois=new Date(edition.date+'T00:00:00Z');depois.setUTCDate(depois.getUTCDate()+1);
   const erros=conferirPublicacaoDeclaradaNoHtml(work,edition,depois.toISOString().slice(0,10),pag.html);
   if(!erros.some(e=>e.includes('anterior ao commit de entrada'))){console.error(`HB1 planta: ${work.slug}/${edition.lang} com entrada posterior à data declarada NÃO foi recusada`);process.exit(2);}
   plantadas++;
  }
  const mutilada=parse(pag.html);for(const el of mutilada.querySelectorAll('script, style, template'))el.remove();
  assert(conferirPublicacaoDeclaradaNoHtml(work,edition,entrada,mutilada.querySelector('body').outerHTML).some(e=>e.includes('Article')));
  edicoes++;
 }
 assert(edicoes>0);console.log(`I9 integração: ${edicoes} edições reais verdes; ${edicoes} páginas sem scripts recusadas.`);
 if(planta){if(plantadas===0){console.error('HB1 planta: nenhuma edição com data declarada para plantar');process.exit(2);}console.error(`HB1 portão: a entrada posterior à data declarada recusada em ${plantadas} edições`);process.exit(1);}
}
