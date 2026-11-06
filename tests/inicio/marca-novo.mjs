import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parse} from 'node-html-parser';
import {conferirMarcasNovo,exigeRotuloNovo} from '../../scripts/marca-novo.mjs';
import {estudoNovo} from '../../src/lib/construcao.mjs';
import {listagensDoInicio} from '../../src/lib/listagens-do-inicio.mjs';
import {estadoDoInventario} from '../../scripts/voz.mjs';
export function provarDatasDaMarcaNovo(){
 for(const lang of ['pt','en']){
  const datas=listagensDoInicio(lang).estudos.filter(e=>e.tipo==='estudo').map(e=>e.peca.data).filter(Boolean).sort();
  const publicada=datas.at(-1);assert(publicada);
  for(const dias of [-1,0,7,8]){
   const dia=new Date(Date.parse(publicada)+dias*86400000).toISOString().slice(0,10),esperado=dias>=0&&dias<=7;
   assert.equal(estudoNovo(publicada,dia),esperado);
   const root=parse(`<section id="trabalhos"><article data-estudo><div class="estudo-meta"><time datetime="${publicada}"></time></div>${esperado?'<span data-estudo-novo></span>':''}</article></section>`);
   assert.deepEqual(conferirMarcasNovo(root,dia),[]);
   if(esperado)root.querySelector('[data-estudo-novo]').remove();else root.querySelector('[data-estudo]').insertAdjacentHTML('beforeend','<span data-estudo-novo></span>');
   assert.deepEqual(conferirMarcasNovo(root,dia),['FP1: marca novo diferente da data impressa']);
   if(dias===7||dias===8){assert.equal(exigeRotuloNovo(lang,dia),esperado);console.log(`VOZ-1 H ${lang}, ${dia}: controlo a 0; ${esperado?'marca retirada':'marca indevida'} recusada: FP1: marca novo diferente da data impressa; voz ${esperado?'exige':'não exige'} o rótulo.`);}
  }
 }
 for(const palavra of ['novo','new']){assert.equal(estadoDoInventario('condicional-novo','fp1',palavra),'condicional-novo');assert.equal(estadoDoInventario('condicional-novo','outro',palavra),null);}
 assert.equal(estadoDoInventario('condicional-novo','fp1','arbitrário'),null);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)provarDatasDaMarcaNovo();
