import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {WORKS} from '../../src/data/studies.mjs';
import {conferirTitulosCopiados,titulosCopiadosDaPagina} from '../../scripts/titulos-copiados.mjs';
const dist=fs.mkdtempSync(path.join(os.tmpdir(),'eva-titulos-'));
const evora='evora-contas-da-camara-2010-2025';
const outro=WORKS.find(w=>w.slug!==evora&&w.editions.some(e=>e.lang==='pt'));
let plantas=0;
try {
 const conferir=(rota,titulo,lang)=>conferirTitulosCopiados(parse(`<a data-calendario-pagina="${rota}" href="${rota}">${titulo}</a>`),{key:'agenda',lang},dist).erros;
 for(const slug of [outro.slug,evora])for(const lang of ['pt','en']){
  const rota=`/${lang==='pt'?'estudos':'en/studies'}/${slug}`;
  const html=fs.readFileSync(`dist${rota}/index.html`,'utf8'),root=parse(html);
  const pasta=path.join(dist,rota);fs.mkdirSync(pasta,{recursive:true});fs.writeFileSync(path.join(pasta,'index.html'),html);
  const titulos=titulosCopiadosDaPagina(root,rota);assert(titulos.length);
  for(const titulo of titulos)assert.deepEqual(conferir(rota,titulo,lang),[]);
  assert(conferir(rota,titulos[0]+' título que a página não imprime',lang).length);plantas++;
  const outraRota=`/${lang==='pt'?'en/studies':'estudos'}/${slug}`;
  const outra=parse(fs.readFileSync(`dist${outraRota}/index.html`,'utf8'));
  assert(conferir(rota,titulosCopiadosDaPagina(outra,outraRota).at(-1),lang).length);plantas++;
  if(slug===evora){assert.equal(titulos.length,2);assert(conferir(rota,titulos[0].replace('137','138'),lang).length);plantas++;}
  // Mesmo o título do catálogo recusa se não existir na página de destino.
  fs.writeFileSync(path.join(pasta,'index.html'),'<main><h1>Destino alterado</h1></main>');
  const edicao=WORKS.find(w=>w.slug===slug).editions.find(e=>e.lang===lang);
  if(edicao){assert(conferir(rota,edicao.title,lang).length);plantas++;}
 }
 const rota=`/estudos/${evora}`;
 for(const html of ['<h1>Manchete</h1><p><strong>Nome</strong></p>','<h1>Manchete</h1><p>Intervalo</p><p><em>Nome</em></p>']){
  assert.deepEqual(titulosCopiadosDaPagina(parse(html),rota),['Manchete']);plantas++;
 }
 console.log(`EVA títulos: ${plantas} plantas recusadas; H1 e nome em itálico conferidos no HTML das duas edições de dois estudos.`);
} finally {fs.rmSync(dist,{recursive:true,force:true});}
