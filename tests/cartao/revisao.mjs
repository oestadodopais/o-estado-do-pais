/** PAI2-B: um bloco de revisão, com uma frase por linha revista do cartão. */
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {reguaDoCartao} from '../../src/lib/enquadramento.mjs';
import {conferirAvisos,revisoesPorAplicar} from '../../scripts/check-quadro.mjs';
const pendentes=revisoesPorAplicar();
/** @param {any} cartao @param {'pt'|'en'} lang */
export function conferirRevisaoDoCartao(cartao,lang){
 const id=cartao.getAttribute('data-cartao-medida');
 const r=id?reguaDoCartao(id):{};
 const esperados=[...new Set([id,r.anterior?.id,r.ue?.id].filter(x=>pendentes.has(x)))];
 const blocos=cartao.querySelectorAll('[data-cartao-revisao]');
 const avisos=cartao.querySelectorAll('[data-aviso-revisao]');
 const erros=[];
 if(blocos.length!==(esperados.length?1:0))erros.push('número de blocos de revisão indevido');
 if(JSON.stringify(avisos.map(a=>a.getAttribute('data-aviso-revisao')))!==JSON.stringify(esperados))erros.push('aviso ausente, repetido ou de outra medida');
 const bloco=blocos[0];
 if(bloco&&(bloco.parentNode!==cartao||bloco.getAttribute('data-cartao-revisao')!==id||bloco.children.length!==avisos.length||bloco.childNodes.some(n=>!n.tagName&&n.text.trim())||bloco.children.some(n=>!avisos.includes(n))))erros.push('conteúdo ou posição do bloco de revisão indevido');
 erros.push(...conferirAvisos(cartao,lang,{pendentes}).erros);
 return {erros,bloco:erros.length?null:bloco};
}
/** @param {(p:string)=>string} ler @param {Function} ordem */
export function plantasDaRevisao(ler,ordem){
 let plantas=0,controlos=0;
 for(const [lang,rota] of [['pt','estado-e-economia'],['en','en/state-and-economy']]){
  const html=ler(rota+'/index.html'),root=parse(html);
  const card=root.querySelector('[data-cartao-medida="desempenho-das-exportacoes-2025"]');
  assert(card);assert.deepEqual(conferirRevisaoDoCartao(card,lang).erros,[]);controlos++;
  for(const mudar of [
   c=>c.insertAdjacentHTML('beforeend',c.querySelector('[data-cartao-revisao]').outerHTML),
   c=>c.querySelector('[data-cartao-revisao]').insertAdjacentHTML('beforeend',c.querySelector('[data-aviso-revisao]').outerHTML),
   c=>c.querySelector('[data-cartao-revisao]').insertAdjacentHTML('beforeend','<p>Outro bloco</p>'),
  ]){
   const copia=parse(card.outerHTML).firstChild;mudar(copia);
   assert(conferirRevisaoDoCartao(copia,lang).erros.length);assert(ordem(parse(copia.outerHTML),lang,rota).erros.length);plantas++;
  }
  const sao=root.querySelectorAll('[data-cartao-medida]').find(c=>!c.querySelector('[data-aviso-revisao]'));
  assert(sao);const falso=parse(sao.outerHTML).firstChild;
  falso.insertAdjacentHTML('beforeend',card.querySelector('[data-cartao-revisao]').outerHTML);
  assert(conferirRevisaoDoCartao(falso,lang).erros.length);assert(ordem(parse(falso.outerHTML),lang,rota).erros.length);plantas++;
  const extra=parse(card.outerHTML);extra.firstChild.insertAdjacentHTML('beforeend','<p>Outro bloco</p>');
  assert(ordem(extra,lang,rota).erros.length);plantas++;
  assert.deepEqual(conferirRevisaoDoCartao(parse(card.outerHTML).firstChild,lang).erros,[]);controlos++;
 }
 return {plantas,controlos};
}
