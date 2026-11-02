import {fraseHtml} from './texto-html.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {load} from 'js-yaml';
import {parse} from 'node-html-parser';
import {WORKS} from '../../src/data/studies.mjs';
import {CORRECOES_TEXTO} from '../../src/data/correcoes.mjs';
import {primeiraEdicaoServida} from '../../src/lib/edicoes.mjs';
import {conferirEdicoes,conferirTextoHtml,rotaPrimeira,rotaAtual} from '../../scripts/edicoes-conferir.mjs';
const manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
const paginas=new Map();
for(const e of manifesto.edicoes.filter(e=>e.primeira_edicao)) {
 paginas.set(rotaPrimeira(e),primeiraEdicaoServida(e.slug,e.lang,e.primeira_edicao.date));
 const labels=e.lang==='pt'?['Primeira edição, tal como foi publicada','Edição atual']:['First edition, as published','Current edition'];
 paginas.set(`${e.lang==='pt'?'/estudos':'/en/studies'}/${e.slug}`,`<p data-estudo-edicao="${e.slug}/${e.lang}"><a href="${rotaPrimeira(e)}">${labels[0]}</a><a href="${rotaAtual(e.slug,e.lang)}">${labels[1]}</a></p>`);
}
let conta=0;
const alvo=manifesto.edicoes.find(e=>e.primeira_edicao),rota=`/estudos/${alvo.slug}`;
for(const [nome,muda,erro] of [
 ['controlo',()=>{},null],
 ['edição sem entrada',c=>{c.correcoes=c.correcoes.filter(e=>e.slug!==alvo.slug);},'ED1 entrada:'],
 ['primeira porta para o documento atual',c=>{c.paginas.set(rota,c.paginas.get(rota).replace(rotaPrimeira(alvo),rotaAtual(alvo.slug,alvo.lang)));},'ED1 portas:'],
 ['um byte da primeira edição',c=>{fs.appendFileSync(path.join(c.raiz,alvo.primeira_edicao.file),'x');},'ED1 sha256:'],
 ['entrada sem estudo',c=>{c.correcoes[0].slug='inexistente';},'ED1 órfã:'],
 ['entrada com outra data',c=>{c.correcoes[0].data='2026-11-01';},'ED1 órfã:'],
 ['bytes servidos mudados',c=>{c.paginas.set(rotaPrimeira(alvo),c.paginas.get(rotaPrimeira(alvo))+'x');},'ED1 servido:'],
]) {
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ed1-planta-'));
 try {
  fs.cpSync('studies-src/_edicoes',path.join(dir,'_edicoes'),{recursive:true});
  for(const e of manifesto.edicoes){const file=e.edicoes.at(-1).file;fs.mkdirSync(path.dirname(path.join(dir,file)),{recursive:true});fs.copyFileSync(path.join('studies-src',file),path.join(dir,file));}
  const c={works:structuredClone(WORKS),manifesto:structuredClone(manifesto),correcoes:structuredClone(CORRECOES_TEXTO),raiz:dir,paginas:new Map(paginas)};
  muda(c);const erros=conferirEdicoes(c);
  if(erro)assert(erros.some(e=>e.startsWith(erro)),`${nome}: ${erros.join('; ')}`);else assert.deepEqual(erros,[]);
  console.log(`ED1 planta: ${nome}: passou`);conta++;
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
}
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
for(const lang of ['pt','en'])for(const c of CORRECOES_TEXTO) {
 const e=manifesto.edicoes.find(e=>e.slug===c.slug&&e.lang===lang),w=WORKS.find(w=>w.slug===c.slug);
 const html=`<li data-texto-estudo="${c.slug}" data-texto-data="${c.data}"><time datetime="${c.data}" data-texto-campo="data">${c.data.split('-').reverse().join('.')}</time><span data-texto-campo="kind">${lang==='pt'?'Estudo corrigido':'Study corrected'}</span><span data-texto-campo="titulo">${esc(w.editions.find(e=>e.lang===lang).title)}</span><span data-texto-campo="frase">${fraseHtml(c,lang)}</span><a data-texto-porta="primeira" href="${rotaPrimeira(e)}">${lang==='pt'?'Primeira edição':'First edition'}</a><a data-texto-porta="atual" href="${rotaAtual(c.slug,lang)}">${lang==='pt'?'Edição atual':'Current edition'}</a></li>`;
 assert.deepEqual(conferirTextoHtml(parse(html),lang,WORKS,CORRECOES_TEXTO,manifesto).erros,[]);conta++;
 for(const campo of ['data','kind','titulo','frase']) {
  const copia=parse(html);copia.querySelector(`[data-texto-campo="${campo}"]`).set_content('Outra frase 999');
  assert(conferirTextoHtml(copia,lang,WORKS,CORRECOES_TEXTO,manifesto).erros.some(e=>e.includes(`campo ${campo}`)));conta++;
 }
 const copia=parse(html);copia.querySelector('[data-texto-porta="primeira"]').setAttribute('href',rotaAtual(c.slug,lang));
 assert(conferirTextoHtml(copia,lang,WORKS,CORRECOES_TEXTO,manifesto).erros.some(e=>e.includes('porta primeira')));conta++;
}
console.log(`ED1: ${conta} controlos e plantas.`);
