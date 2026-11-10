import {registoParaPlantas} from '../edicoes/texto-html.mjs';
/** A exceção de uma correção exige a entrada íntegra, a posição e a rota. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {medirPagina,EXCECOES} from '../../scripts/voz-autorreferencia.mjs';
let controlos=0,plantas=0;
for(const e of EXCECOES.filter(e=>e.correcao_textual?.slug==='agua-nao-faturada')){
 const html=registoParaPlantas(e.rota);
 const selector='[data-texto-estudo="agua-nao-faturada"][data-texto-data="2026-11-08"]';
 const entrada=parse(html).querySelector(selector);assert(entrada);
 assert(medirPagina(html,e.rota).permitidas.includes(e.frase),'a entrada íntegra conserva a exceção');controlos++;
 const alterada=parse(html);alterada.querySelector(selector).setAttribute('data-texto-data','2026-11-07');
 assert(medirPagina(alterada.toString(),e.rota).frases.includes(e.frase),'entrada mudada recusa');plantas++;
 const fora=parse(html);fora.querySelector('main').insertAdjacentHTML('beforeend',`<p>${e.frase}</p>`);
 assert(medirPagina(fora.toString(),e.rota).frases.includes(e.frase),'frase fora da entrada recusa');plantas++;
 assert(medirPagina(entrada.outerHTML,e.rota.startsWith('/en/')?'/en/':'/').frases.includes(e.frase),'outra rota recusa');plantas++;
}
assert.equal(controlos,2);assert.equal(plantas,6);
console.log(`COR-AGUA voz: ${controlos} controlos, ${plantas} plantas recusadas.`);
