/** DO1: pertenças, datas e peças conferidas nas duas edições, com estragos plantados. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { DOSSIES, conferirDossies } from '../../src/data/dossies.mjs';
import { dossieDaPeca } from '../../src/lib/dossies.mjs';
import { pecasPublicadas } from '../../src/lib/novidades.mjs';
import { routePath } from '../../src/lib/routes.mjs';
import { getClaim } from '../../src/lib/ledger.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';
const ler = rota => parse(fs.readFileSync(`dist/${rota.replace(/^\//,'')}/index.html`,'utf8'));
const normal = t => String(t).replace(/\s+/g,' ').trim();
let plantas = 0;
for (const mudar of [
 d => {d[0].slug = 'Slug inválido';},
 d => {d[1].slug = d[0].slug;},
 d => {d[0].pecas.estudos = ['inexistente'];},
 d => {d[1].pecas = {estudos:[],explicacoes:[],itens:[]};},
 d => {d[1].pecas.estudos.push(d[0].pecas.estudos[0]);},
 d => {d[1].portas = ['inexistente'];},
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
 const recentes=pecasPublicadas(lang).filter(p=>p.dossie?.slug===d.slug).map(p=>p.data).sort();
 assert.equal(datas.find(e=>e.getAttribute('data-data-origem')==='publicacao.declarada')?.getAttribute('datetime'),recentes.at(-1));
 assert.deepEqual(main.querySelectorAll('[data-estudo]').map(e=>e.getAttribute('data-estudo')),d.pecas.estudos);
 assert.deepEqual(main.querySelectorAll('[data-dossie-explicacao]').map(e=>e.getAttribute('data-dossie-explicacao')),d.pecas.explicacoes);
 assert.deepEqual(new Set(main.querySelectorAll('[data-discussao-porta]').map(e=>e.getAttribute('data-discussao-porta'))),new Set(d.pecas.itens));
 for(const [tipo,slugs] of Object.entries(d.pecas))for(const slug of slugs){
  const caminho=tipo==='itens'?`${routePath('discussao',lang)}#${slug}`:routePath(tipo==='estudos'?'estudo':'explicacao',lang,{slug});
  assert(main.querySelectorAll('a').some(a=>a.getAttribute('href')===caminho));

  if(tipo==='itens') {
   const no=main.querySelector(`[data-discussao-porta="${slug}"]`).closest('li').querySelector('[data-discussao-resumo]');
   const inicio=ler(routePath('home',lang)).querySelector(`[data-discussao-inicio] [data-discussao-porta="${slug}"]`).closest('li').querySelector('[data-discussao-resumo]');
   assert.equal(no.outerHTML,inicio.outerHTML,'o resumo e a data conservam a forma conferida na primeira página');
  }
  const fonte=ler(caminho.split('#')[0]);
  const lugar=tipo==='itens'?fonte.querySelector(`[data-discussao="${slug}"]`):fonte.querySelector('main');
  const link=lugar.querySelector('[data-dossie-ligacao] a');
  assert.equal(link?.getAttribute('href'),rota);
 }
 const origem=ler(routePath('correcoes',lang));
 for(const correcao of main.querySelectorAll('[data-correcao-entrada]')){
  const id=correcao.getAttribute('data-correcao-entrada'),n=correcao.querySelector('[data-correcao-n]').getAttribute('data-correcao-n');
  const original=origem.querySelectorAll(`[data-correcao-entrada="${id}"]`).find(e=>e.querySelector(`[data-correcao-n="${n}"]`));
  assert(original,'correção presente no registo público');
  assert.equal(normal(correcao.textContent),normal(original.textContent));
 }
 for(const p of main.querySelectorAll('[data-dossie-abertura] [data-de-linha]')){
  const id=p.getAttribute('data-de-linha'), campo=p.getAttribute('data-de-campo');
  assert.equal(p.textContent,dataDaCasa(getClaim(id)[campo],lang));
  assert(p.closest('[data-dossie-abertura]').querySelector(`a.src-chip[href="${routePath('linha',lang,{slug:id})}"]`));
 }
 if(!d.calendario.length)assert.equal(main.querySelector('#dossie-calendario'),null);
 if(d.slug==='a-casa-em-portugal')assert.equal(main.querySelector('#dossie-correcoes'),null);
}
for(const lang of ['pt','en']) {
 const lista=ler(routePath('dossies',lang));
 assert.equal(lista.querySelectorAll('[data-dossie-lista]').length,DOSSIES.length);
 const datas=lista.querySelectorAll('[data-dossie-lista] time').map(e=>e.getAttribute('datetime'));
 assert.deepEqual(datas,[...datas].sort().reverse());
 for(const d of DOSSIES){
  const rota=routePath('dossie',lang,{slug:d.slug}), root=ler(rota);conferir(root,d,lang);
  for(const mudar of [
   r=>r.querySelector('[data-estudo]').remove(),
   r=>r.querySelector('[data-data-origem="publicacao.declarada"]').setAttribute('datetime','1900-01-01'),
   r=>r.querySelector('main h1').set_content('Título trocado'),
  ]) {const copia=parse(root.toString());mudar(copia);assert.throws(()=>conferir(copia,d,lang));plantas++;}
 }
}
console.log(`DO1: seis páginas, pertenças e datas conferidas nas duas edições; ${plantas} plantas recusadas.`);
