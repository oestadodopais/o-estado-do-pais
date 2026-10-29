/** DO1: pertenças, datas e peças conferidas nas duas edições, com estragos plantados. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { DOSSIES, conferirDossies } from '../../src/data/dossies.mjs';
import { dossieDaPeca } from '../../src/lib/dossies.mjs';
import { dossiesDaLista, pecaMaisRecente } from '../../src/lib/dossies-conteudo.mjs';
import { ITENS } from '../../src/data/discussao.mjs';
import { NOMES_EO1 } from '../../src/data/nomes-eo1.mjs';
import { seloDaConclusaoDoInicio, conferirConclusaoDoInicio, semSelos } from '../../scripts/porta-da-conclusao-discussao.mjs';
import { routePath } from '../../src/lib/routes.mjs';
import { getClaim } from '../../src/lib/ledger.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';
const ler = rota => parse(fs.readFileSync(`dist/${rota.replace(/^\//,'')}/index.html`,'utf8'));
const normal = t => String(t).replace(/\s+/g,' ').trim();
let plantas = 0;
for (const mudar of [
 d => {d[0].slug = 'Slug inválido';},
 d => {d.push(structuredClone(d[0]));},
 d => {d[0].pecas.estudos = ['inexistente'];},
 d => {d[0].pecas = {estudos:[],explicacoes:[],itens:[]};},
 d => {d.push({...structuredClone(d[0]),slug:'outro-assunto'});},
 d => {d[0].portas = ['inexistente'];},
 d => {d[0].calendario = ['calendario-inexistente'];},
]) {const copia=structuredClone(DOSSIES);mudar(copia);assert.throws(()=>conferirDossies(copia));plantas++;}
assert.equal(dossieDaPeca('estudo','inexistente'),null);
function conferir(root,d,lang) {
 const main=root.querySelector('main'), rota=routePath('dossie',lang,{slug:d.slug});
 assert.equal(normal(main.querySelector('h1').textContent),d.titulo[lang]);
 assert.equal(main.querySelectorAll('[data-dossie-abertura]').length,2);
 for(const [i,p]of main.querySelectorAll('[data-dossie-abertura]').entries()) {
  const copia=parse(p.outerHTML);copia.querySelectorAll('.src-chip').forEach(n=>n.remove());
  const esperado=d.abertura[i][lang].map(t=>typeof t==='string'?t:dataDaCasa(getClaim(t.periodo).reference_date,lang)).join('');
  assert.equal(normal(copia.text),normal(esperado),'abertura integral com os tokens');
 }

 assert.equal(main.querySelectorAll('[data-discussao-parte]').length,0,'não repete afirmações');
 const datas=main.querySelectorAll('time[data-data-origem]');
 assert.equal(datas.find(e=>e.getAttribute('data-data-origem')==='escrita.declarada')?.getAttribute('datetime'),d.escrita);
 const recente=dossiesDaLista(lang).find(e=>e.slug===d.slug);
 const impressa=main.querySelector('[data-dossie-data="recente"]');
 assert.equal(impressa.getAttribute('datetime'),recente.recente);
 assert.equal(impressa.getAttribute('data-data-origem'),recente.origemRecente);
 assert.deepEqual(main.querySelectorAll('[data-estudo]').map(e=>e.getAttribute('data-estudo')),d.pecas.estudos);
 assert.deepEqual(main.querySelectorAll('[data-dossie-explicacao]').map(e=>e.getAttribute('data-dossie-explicacao')),d.pecas.explicacoes);
 assert.deepEqual(new Set(main.querySelectorAll('[data-discussao-porta]').map(e=>e.getAttribute('data-discussao-porta'))),new Set(d.pecas.itens));
 for(const [tipo,slugs] of Object.entries(d.pecas))for(const slug of slugs){
  const caminho=tipo==='itens'?`${routePath('discussao',lang)}#${slug}`:routePath(tipo==='estudos'?'estudo':'explicacao',lang,{slug});
  assert(main.querySelectorAll('a').some(a=>a.getAttribute('href')===caminho));

  if(tipo==='itens') {
   const no=main.querySelector(`[data-discussao-porta="${slug}"]`).closest('li').querySelector('[data-discussao-resumo]');
   const inicio=ler(routePath('home',lang)).querySelector(`[data-discussao-inicio] [data-discussao-porta="${slug}"]`).closest('li').querySelector('[data-discussao-resumo]');
   assert.equal(semSelos(no),semSelos(inicio),'o texto e a data são os mesmos nas duas superfícies');
   assert.equal(inicio.querySelector('.src-chip'),null,'a primeira página conserva a prova no item');
  }
  const fonte=ler(caminho.split('#')[0]);
  const lugar=tipo==='itens'?fonte.querySelector(`[data-discussao="${slug}"]`):fonte.querySelector('main');
  const link=lugar.querySelector('[data-dossie-ligacao] a');
  assert.equal(link?.getAttribute('href'),rota);
 }
 assert.equal(main.querySelector('#dossie-correcoes'),null);
 for(const id of d.calendario) {
  const p=main.querySelector(`[data-dossie-calendario="${id}"]`);
  assert(p.textContent.includes(NOMES_EO1[id][lang]));
  assert(!p.querySelector('[data-linha-campo="excerpt"]'));
 }
 for(const a of main.querySelectorAll('[data-discussao-porta]')) {
  const e=ITENS.find(e=>e.slug===a.getAttribute('data-discussao-porta'));
  assert.deepEqual(conferirConclusaoDoInicio(a,e,lang),[]);
  for(const valor of a.closest('li').querySelectorAll('[data-discussao-resumo] [data-claim]'))assert(seloDaConclusaoDoInicio(valor,valor.getAttribute('data-claim'),lang,{dist:'dist'}));
 }
 for(const p of main.querySelectorAll('[data-dossie-abertura] [data-de-linha]')){
  const id=p.getAttribute('data-de-linha'), campo=p.getAttribute('data-de-campo');
  assert.equal(p.textContent,dataDaCasa(getClaim(id)[campo],lang));
  assert(p.closest('[data-dossie-abertura]').querySelector(`a.src-chip[href="${routePath('linha',lang,{slug:id})}"]`));
 }
 if(!d.calendario.length)assert.equal(main.querySelector('#dossie-calendario'),null);

}
const datasSinteticas={estudos:[{data:'2026-10-27'}],itens:[{escrita:'2026-10-26'}],explicacoes:[]};
assert.equal(pecaMaisRecente(datasSinteticas).data,'2026-10-27');
datasSinteticas.itens[0].escrita='2026-10-28';
assert.deepEqual(pecaMaisRecente(datasSinteticas),{data:'2026-10-28',origem:'escrita.declarada'});plantas++;
for(const lang of ['pt','en']) {
 assert.equal(dossieDaPeca('estudo','a-casa-em-portugal-e-na-europa'),null);
 assert.equal(ler(routePath('entradaCasa',lang)).querySelector('#dossies-k'),null);
 assert(!fs.existsSync(`dist${routePath('dossie',lang,{slug:'a-casa-em-portugal'})}/index.html`));
 const lista=ler(routePath('dossies',lang));
 assert.equal(lista.querySelectorAll('[data-dossie-lista]').length,DOSSIES.length);
 const datas=lista.querySelectorAll('[data-dossie-lista] time').map(e=>e.getAttribute('datetime'));
 assert.deepEqual(datas,[...datas].sort().reverse());
 for(const d of DOSSIES){
  const rota=routePath('dossie',lang,{slug:d.slug}), root=ler(rota);conferir(root,d,lang);
  for(const mudar of [
   r=>r.querySelector('[data-estudo]').remove(),
   r=>r.querySelector('[data-dossie-data="recente"]').setAttribute('datetime','1900-01-01'),
   r=>r.querySelector('main h1').set_content('Título trocado'),
   r=>r.querySelector('[data-discussao-resumo] .src-chip').remove(),
   r=>r.querySelector('[data-dossie-calendario] [data-nome]').set_content('Nome trocado'),
   r=>r.querySelector('[data-dossie-data="recente"]').setAttribute('data-data-origem','publicacao.declarada'),
  ]) {const copia=parse(root.toString());mudar(copia);assert.throws(()=>conferir(copia,d,lang));plantas++;}
 }
}
console.log(`DO1: quatro páginas, pertenças e datas conferidas nas duas edições; ${plantas} plantas recusadas.`);
