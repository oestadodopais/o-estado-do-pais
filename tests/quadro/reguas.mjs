/** PAI2: as réguas existentes chamam a mesma conferência das formas novas. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {conferirQuadro,conferirAvisos,superficieDoQuadro} from '../../scripts/check-quadro.mjs';
import {medirPagina} from '../../scripts/check-selos.mjs';
const modo=process.argv[2];
assert(['datas','selos','voz','l1'].includes(modo));
for(const lang of ['pt','en']){
 const rel=lang==='pt'?'temas':'en/themes',html=fs.readFileSync(`dist/${rel}/index.html`,'utf8');
 const root=parse(html),base=superficieDoQuadro(root,lang);
 assert.deepEqual(base.erros,[]);
 if(modo==='datas'){
  const r=parse(html);r.querySelector('[data-aviso-revisao] [data-de-campo]').set_content('01.01.1900');
  assert(conferirAvisos(r,lang).erros.some(e=>e.startsWith('Q4')));
 }else if(modo==='selos'){
  assert.deepEqual(medirPagina(html,lang).erros,[]);
  const r=parse(html),selo=r.querySelector('[data-quadro-coluna="portugal"] .src-chip');
  const unidade=r.querySelector('[data-quadro-coluna="portugal"] [data-unidade-da-casa], [data-quadro-coluna="portugal"] [data-linha-campo="unit"]');
  selo.remove();unidade.insertAdjacentHTML('beforebegin',selo.outerHTML);
  assert(conferirQuadro(r,lang).erros.some(e=>e.includes('selo interrompe')));
  assert(medirPagina(r.toString(),lang).erros.length>0);
 }else if(modo==='voz'){
  const r=parse(html);r.querySelector('[data-quadro-coluna="portugal"]').insertAdjacentHTML('beforeend',' Texto acrescentado.');
  const alterada=superficieDoQuadro(r,lang);assert(alterada.erros.some(e=>e.includes('texto extra')));assert.equal(alterada.nos.size,0);
 }else{
  const porta=root.querySelector('[data-quadro-destino]');assert(base.portas.has(porta));
  root.querySelector('main').insertAdjacentHTML('beforeend',porta.outerHTML);
  const extra=root.querySelector('main').lastElementChild;
  assert(!superficieDoQuadro(root,lang).portas.has(extra),'uma cópia fora do quadro não recebe dispensa da L1');
  const alterada=parse(html);alterada.querySelector('[data-quadro-destino]').setAttribute('href','/');assert.equal(superficieDoQuadro(alterada,lang).portas.size,0);
 }
 console.log(`PAI2 ${modo} ${lang}: controlo verde, planta recusada pela mesma função.`);
}
