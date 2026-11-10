import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {fraseRec1DeveRender,conferirPresencaRec1} from '../../scripts/voz-rec1.mjs';
import {parse} from 'node-html-parser';
import {estadoDoInventario} from '../../scripts/voz.mjs';
const frasesRec1=JSON.parse(fs.readFileSync('scripts/voz-rec1.json','utf8'));
assert.equal(estadoDoInventario('condicional-rec1','rec1-a','Uma frase não autorizada.'),null);
for(const frase of frasesRec1) {assert.equal(estadoDoInventario('condicional-rec1','rec1-a',frase),'condicional-rec1');assert.equal(estadoDoInventario('condicional-rec1','rec1-a',frase+' Texto indevido.'),null);}
console.log(`REC1 inventário: ${frasesRec1.length} frases fechadas; adulterações recusadas.`);
const raiz=fs.mkdtempSync(path.join(os.tmpdir(),'rec1-modos-'));
let controlos=0, plantas=0;
try {
 for (const valor of ['', '10.11.2026', '2026-1-01', '2026-02-30', 20261110, false, undefined]) {
  const codigo=fs.readFileSync('site.config.mjs','utf8').replace(/export const LANCAMENTO = .*;/,`export const LANCAMENTO = ${JSON.stringify(valor)};`);
  const teste=spawnSync(process.execPath,['--input-type=module','-e',codigo],{encoding:'utf8'});
  assert.notEqual(teste.status,0);assert.match(teste.stderr,/REC1: LANCAMENTO/);plantas++;
 }
 for (const data of [null,'2026-08-01','2099-01-01']) {
  const copia=path.join(raiz,data??'ensaio');
  for(const f of ['site.config.mjs','scripts/lancamento-conferir.mjs','src/data/ensaio.mjs','src/pages/robots.txt.js','src/i18n/strings.mjs','src/data/metodo.mjs','scripts/frases-rec1-conferir.mjs','scripts/voz-rec1.json','scripts/voz-rec1-modos.json']) {
   const destino=path.join(copia,f);fs.mkdirSync(path.dirname(destino),{recursive:true});fs.copyFileSync(f,destino);
  }
  fs.writeFileSync(path.join(copia,'package.json'),' {"type":"module"}\n');
  const cfg=path.join(copia,'site.config.mjs');
  fs.writeFileSync(cfg,fs.readFileSync(cfg,'utf8').replace(/export const LANCAMENTO = .*;/,`export const LANCAMENTO = ${JSON.stringify(data)};`));
  const importar=f=>import(pathToFileURL(path.join(copia,f)).href);
  const {emEnsaio,desdeOLancamento}=await importar('site.config.mjs');
  const {conferirLancamentoHtml:conferir,conferirRobotsTxt}=await importar('scripts/lancamento-conferir.mjs');
  const {ENSAIO}=await importar('src/data/ensaio.mjs');
  const {GET}=await importar('src/pages/robots.txt.js');
  const {t,STRINGS}=await importar('src/i18n/strings.mjs');
  const {METODO}=await importar('src/data/metodo.mjs');
  const {conferirFrasesRec1}=await importar('scripts/frases-rec1-conferir.mjs');
  assert.deepEqual(conferirFrasesRec1(ENSAIO,STRINGS,METODO),[]);controlos++;
  for(const lang of ['pt','en']) {
   const formas=JSON.parse(fs.readFileSync('scripts/voz-rec1-modos.json','utf8'));
   const oposto=data===null?'lancado':'ensaio';
   for(const k of ['politicaV','h1','enderecoB','metodo']) {
    const atual=k==='metodo'?METODO.mudanca[lang][0]:STRINGS[lang].correcoes[k].replace(/^\. /,'');
    const prefixos={politicaV:lang==='pt'?['A partir do lançamento, quando','Desde o lançamento, quando']:['From launch onward, when','Since launch, when'],h1:lang==='pt'?['O que for corrigido','O que foi corrigido']:['What gets corrected','What was corrected'],enderecoB:lang==='pt'?['A partir do lançamento, um erro','Um erro confirmado']:['From launch onward, a confirmed error','A confirmed error'],metodo:lang==='pt'?['A partir do lançamento, cada mudança','Cada mudança']:['From launch onward, each change','Each change']};
    const outra=Object.keys(formas).find(t=>formas[t]===oposto&&prefixos[k].some(p=>t.startsWith(p)));
    assert(outra&&outra!==atual,`forma oposta ${k}/${lang}`);
    const strings=structuredClone(STRINGS),metodo=structuredClone(METODO);
    if(k==='metodo')metodo.mudanca[lang][0]=outra;else strings[lang].correcoes[k]=(k==='enderecoB'?'. ':'')+outra;
    assert(conferirFrasesRec1(ENSAIO,strings,metodo).some(e=>e.includes('modo errado')));plantas++;
    console.log(`REC1 troca de modo recusada: ${data??'ensaio'} ${lang} ${k}.`);
   }
   for(const k of Object.keys(ENSAIO[lang])) {
    const adulterado=structuredClone(ENSAIO);adulterado[lang][k]+=' Texto indevido.';
    assert(conferirFrasesRec1(adulterado,STRINGS,METODO).length);plantas++;
   }
   for(const k of ['politicaV','h1','enderecoB']) {
    const adulterado=structuredClone(STRINGS);adulterado[lang].correcoes[k]+=' Texto indevido.';
    assert(conferirFrasesRec1(ENSAIO,adulterado,METODO).length);plantas++;
   }
   const adulterado=structuredClone(METODO);adulterado.mudanca[lang][0]+=' Texto indevido.';
   assert(conferirFrasesRec1(ENSAIO,STRINGS,adulterado).length);plantas++;
   assert.equal(fraseRec1DeveRender(ENSAIO[lang].metodo,data===null,data==='2026-08-01'?1:0),data===null);controlos++;
   assert.equal(fraseRec1DeveRender(ENSAIO[lang].vazio,data===null,data==='2026-08-01'?1:0),data==='2099-01-01');controlos++;
  }
  const linhas=[{estado:'condicional-rec1',texto:'O que foi corrigido, e o que mudou'},{estado:'condicional-rec1',texto:ENSAIO.pt.metodo}];
  const rendidas=new Set([data===null?ENSAIO.pt.metodo:linhas[0].texto]);
  assert.deepEqual(conferirPresencaRec1(linhas,rendidas,s=>s,data===null,1),{faltam:[],sobram:[]});controlos++;
  assert.equal(conferirPresencaRec1(linhas,new Set(),s=>s,data===null,1).faltam.length,1);plantas++;
  assert.equal(conferirPresencaRec1(linhas,new Set(linhas.map(l=>l.texto)),s=>s,data===null,1).sobram.length,1);plantas++;
  assert.equal(emEnsaio(),data===null);
  assert.equal(desdeOLancamento('2026-08-01'),data==='2026-08-01');
  if(data){assert(desdeOLancamento(data));assert(!desdeOLancamento('1900-01-01'));}
  assert.deepEqual(conferirRobotsTxt(await GET().text()),[]);controlos++;
  assert(conferirRobotsTxt(`User-agent: *\nDisallow: /\n`).length);plantas++;
  for(const lang of ['pt','en'])for(const documento of [false,true]) {
   const marca=data?'':`<span class="rotulo-ia-linha" data-edicao-ensaio title="${ENSAIO[lang].acessivel}">${ENSAIO[lang].marca} <span class="vh">${ENSAIO[lang].acessivel}</span></span>`;
   const html=`<html lang="${lang}"><head>${!data||documento?'<meta name="robots" content="noindex, follow">':''}</head><body>${documento?'<div data-oedp-faixa>':'<header>'}${marca}${documento?'</div>':'</header>'}<main><p data-registo-vazio>${data?ENSAIO[lang].vazio:ENSAIO[lang].registo}</p></main></body></html>`;
   const rota={key:documento?'documento':'correcoes',lang};
   assert.deepEqual(conferir(parse(html),rota),[]);controlos++;
   if(!data||documento) {
    const copia=parse(html);copia.querySelector('head').insertAdjacentHTML('beforeend','<meta name="robots" content="noindex, follow">');
    assert(conferir(copia,rota).some(e=>e.includes('robots')));plantas++;
    const sem=parse(html);sem.querySelector('meta[name="robots"]').remove();assert(conferir(sem,rota).some(e=>e.includes('robots')));plantas++;
   }
   if(!data){
    const semEspaco=parse(html.replace(`${ENSAIO[lang].marca} <span`,`${ENSAIO[lang].marca}<span`));assert(conferir(semEspaco,rota).some(e=>e.includes('marca')));plantas++;
    const soAria=parse(html), marcaAria=soAria.querySelector('[data-edicao-ensaio]');
    marcaAria.setAttribute('aria-label',ENSAIO[lang].acessivel);marcaAria.querySelector('.vh').remove();
    assert(conferir(soAria,rota).some(e=>e.includes('marca')));plantas++;
    const copia=parse(html);copia.querySelector('[data-edicao-ensaio]').set_content(ENSAIO[lang].marca+' 1');
    assert(conferir(copia,rota).some(e=>e.includes('marca')));plantas++;
    if(!documento){const entrada=parse(html);entrada.querySelector('main').insertAdjacentHTML('beforeend','<li data-mudanca="correcao">Entrada indevida</li>');assert(conferir(entrada,rota).some(e=>e.includes('registo')));plantas++;}
   } else {
    const copia=parse(html);copia.querySelector('body').insertAdjacentHTML('beforeend','<span data-edicao-ensaio>Test edition</span>');assert(conferir(copia,rota).some(e=>e.includes('marca')));plantas++;
   }
   assert.equal(t(lang).correcoes.h1,lang==='pt'?(data?'O que foi corrigido, e o que mudou':'O que for corrigido, a partir do lançamento'):(data?'What was corrected, and what changed':'What gets corrected, from launch onward'));controlos++;
  }
  console.log(`REC1 modo ${data??'ensaio'}: controlos e plantas verdes.`);
 }
 console.log(`REC1: ${controlos} controlos, ${plantas} plantas; cópias isoladas, duas línguas.`);
} finally {fs.rmSync(raiz,{recursive:true,force:true});}
