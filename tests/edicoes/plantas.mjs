import {loadClaims} from '../../src/lib/ledger.mjs';
import {fraseHtml} from './texto-html.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {KIND_LABELS} from '../../src/data/correcoes.mjs';
import os from 'node:os';
import path from 'node:path';
import {load} from 'js-yaml';
import {parse} from 'node-html-parser';
import {WORKS} from '../../src/data/studies.mjs';
import {CORRECOES_TEXTO} from '../../src/data/correcoes.mjs';
import {primeiraEdicaoServida,portasDaCorrecao,linhaDasEdicoes} from '../../src/lib/edicoes.mjs';
import {conferirEdicoes,conferirTextoHtml as conferirTextoHtmlBase,rotaPrimeira,rotaAtual} from '../../scripts/edicoes-conferir.mjs';
const conferirTextoHtml=(...args)=>conferirTextoHtmlBase(...args,loadClaims({includeWithdrawn:true}));
const manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
const paginas=new Map();
for(const e of manifesto.edicoes.filter(e=>e.primeira_edicao&&!WORKS.some(w=>w.slug===e.slug&&w.estado==='retirado'))) {
 for(const v of e.edicoes.slice(0,-1)) paginas.set(rotaAtual(e.slug,e.lang)+'/'+v.data,primeiraEdicaoServida(e.slug,e.lang,v.data));
 paginas.set(`${e.lang==='pt'?'/estudos':'/en/studies'}/${e.slug}`,`<p data-estudo-edicao="${e.slug}/${e.lang}">${linhaDasEdicoes(e.slug,e.lang)}</p>`);
}
let conta=0;
const alvo=manifesto.edicoes.find(e=>e.slug==='orcamento-2027-o-que-muda-e-para-quem'&&e.lang==='pt'&&e.primeira_edicao),rota=`/estudos/${alvo.slug}`;
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
 const portas=portasDaCorrecao(c.slug,lang,c.data);
 const html=`<li data-texto-estudo="${c.slug}" data-texto-data="${c.data}" data-texto-kind="${c.kind}"><time datetime="${c.data}" data-texto-campo="data">${c.data.split('-').reverse().join('.')}</time><span data-texto-campo="kind">${KIND_LABELS[c.kind][lang]}</span><span data-texto-campo="titulo">${esc((w.editions.find(e=>e.lang===lang)??(w.editions.length===1?w.editions[0]:null)).title)}</span><span data-texto-campo="frase">${fraseHtml(c,lang)}</span>${portas.antes?`<a data-texto-porta="primeira" href="${portas.antes.rota}">${portas.rotuloAntes}</a>`:""}<a data-texto-porta="atual" href="${portas.depois.rota}">${portas.rotuloDepois}</a></li>`;
 assert.deepEqual(conferirTextoHtml(parse(html),lang,WORKS,CORRECOES_TEXTO,manifesto).erros,[]);conta++;
 for(const campo of ['data','kind','titulo','frase']) {
  const copia=parse(html);copia.querySelector(`[data-texto-campo="${campo}"]`).set_content('Outra frase 999');
  assert(conferirTextoHtml(copia,lang,WORKS,CORRECOES_TEXTO,manifesto).erros.some(e=>e.includes(`campo ${campo}`)));conta++;
 }
 const copia=parse(html),lado=portas.antes?'primeira':'atual';copia.querySelector(`[data-texto-porta="${lado}"]`).setAttribute('href','/edicao-inexistente');
 assert(conferirTextoHtml(copia,lang,WORKS,CORRECOES_TEXTO,manifesto).erros.some(e=>e.includes(portas.antes?'porta primeira':'porta da atualização única')));conta++;
 if(!portas.antes){const extra=parse(html);extra.firstChild.insertAdjacentHTML('beforeend','<a data-texto-porta="primeira" href="/">Primeira edição</a>');assert(conferirTextoHtml(extra,lang,WORKS,CORRECOES_TEXTO,manifesto).erros.some(e=>e.includes('porta da atualização única')));conta++;}
}
console.log(`ED1: ${conta} controlos e plantas.`);
