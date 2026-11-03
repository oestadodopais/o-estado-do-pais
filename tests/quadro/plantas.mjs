/** Cada estrago parte de uma cópia nova; o dist nunca se altera. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {conferirQuadro,conferirAvisos,revisoesPorAplicar,livroDoQuadro,superficieDoQuadro} from '../../scripts/check-quadro.mjs';
const dist=process.env.OEDP_DIST??'dist';
let conta=0;
for(const lang of ['pt','en']){
 const f=lang==='pt'?'temas':'en/themes',html=fs.readFileSync(path.join(dist,f,'index.html'),'utf8');
 const medir=r=>conferirQuadro(r,lang,{dist}).erros;
 assert.deepEqual(medir(parse(html)),[],`${lang}: controlo do quadro`);
 const plantas=[
  ['medida retirada',r=>r.querySelector('[data-quadro-medida]').remove(),/Q1/],
  ['valor trocado',r=>r.querySelector('[data-quadro-coluna="portugal"] [data-claim]').set_content('999999'),/Q2/],
  ['sem anterior indevido',r=>r.querySelector('[data-quadro-coluna="anterior"] [data-claim]').parentNode.replaceWith(`<span data-quadro-sem-anterior>${lang==='pt'?'sem anterior':'no previous'}</span>`),/Q5/],
  ['período trocado',r=>r.querySelector('[data-quadro-coluna="portugal"] [data-de-campo="reference_date"]').set_content('1900'),/Q2/],
  ['selo antes do período',r=>{const n=r.querySelector('[data-quadro-coluna="portugal"] .src-chip'),p=n.parentNode; n.remove();p.insertAdjacentHTML('afterbegin',n.outerHTML);},/selo interrompe/],
  ['prosa acrescentada',r=>r.querySelector('[data-quadro-coluna="portugal"]').insertAdjacentHTML('beforeend',' Prosa inventada.'),/texto extra/],
  ['nome trocado',r=>r.querySelector('[data-quadro-destino]').set_content('Nome indevido'),/nome ou destino/],
 ];
 for(const [nome,mudar,mordida] of plantas){const copia=parse(html);mudar(copia);assert(medir(copia).some(e=>mordida.test(e)),`${lang} ${nome}`);assert.equal(superficieDoQuadro(copia,lang,{dist}).portas.size,0,`${nome}: L1 não dispensa forma estragada`);conta++;console.log(`PAI2 ${lang}: ${nome} recusado.`);}
 const porta=lang==='pt'?'estado-e-economia':'en/state-and-economy';
 const card=fs.readFileSync(path.join(dist,porta,'index.html'),'utf8');
 assert.deepEqual(conferirAvisos(parse(card),lang).erros,[]);
 for(const [nome,mudar,mordida] of [
  ['divergência sem aviso',r=>r.querySelector('[data-aviso-revisao]').remove(),/Q3/],
  ['aviso sem divergência',r=>r.querySelector('[data-aviso-revisao]').setAttribute('data-aviso-revisao','divida-publica-2025'),/Q4/],
  ['data da revisão trocada',r=>r.querySelector('[data-aviso-revisao] [data-de-campo]').set_content('01.01.1900'),/Q4/],
  ['frase da revisão trocada',r=>r.querySelector('[data-aviso-revisao] a').insertAdjacentHTML('beforeend',' Texto inventado.'),/Q4/],
 ]){const copia=parse(card);mudar(copia);assert(conferirAvisos(copia,lang).erros.some(e=>mordida.test(e)),nome);conta++;console.log(`PAI2 ${lang}: ${nome} recusado.`);}
}
// A ordem do vetor não substitui a data; uma correção de outro campo não aplica a revisão.
const id=[...revisoesPorAplicar().keys()][0],original=livroDoQuadro().get(id);
const v=revisoesPorAplicar().get(id);
for(const [nome,editar,esperado] of [
 ['releitura igual posterior',c=>c.verifications.push({date:'9999-01-01',result:'igual'}),false],
 ['correção posterior',c=>c.corrections.push({date:'9999-01-01',kind:'correcao'}),false],
 ['atualização posterior',c=>c.corrections.push({date:'9999-01-01',kind:'atualizacao'}),false],
 ['correção de campo',c=>c.corrections.push({date:'9999-01-01',kind:'correcao',field:'source'}),true],
 ['releitura antiga no fim',c=>c.verifications.push({date:'1900-01-01',result:'igual'}),true],
 ]){const copia=structuredClone(original);editar(copia);assert.equal(revisoesPorAplicar(new Map([[id,copia]])).has(id),esperado,nome);conta++;}
console.log(`PAI2: ${conta} plantas, controlos intactos nas duas edições.`);
