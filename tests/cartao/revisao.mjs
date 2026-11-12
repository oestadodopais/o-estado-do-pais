/** PAI2-B: um bloco de revisão, com uma frase por linha revista do cartão. */
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {ENTRADAS} from '../../src/data/primeira-pagina.mjs';
import {reguaDoCartao} from '../../src/lib/enquadramento.mjs';
import {conferirAvisos,revisoesPorAplicar} from '../../scripts/check-quadro.mjs';
import {casoFixo,pendentesFixos} from '../revisoes/caso-fixo.mjs';
/** @param {any} cartao @param {'pt'|'en'} lang */
export function conferirRevisaoDoCartao(cartao,lang,{pendentes=revisoesPorAplicar()}={}){
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
 let plantas=0,controlos=0,plantasFixas=0;
 for(const lang of ['pt','en']){
  const paginas=ENTRADAS.filter(e=>e.seccoes.some(s=>s.cartoes.length)).map(e=>{
   const rota=e.rota[lang].replace(/^\/|\/$/g,'');return {rota,root:parse(ler(rota+'/index.html'))};
  });
  const real=paginas.find(p=>p.root.querySelector('[data-cartao-revisao]'))??paginas[0];
  const fixo=casoFixo.edicoes[lang];
  for(const {rota,root,pendentes,fixa} of [{rota:fixo.rota,root:parse(fixo.cartao+fixo.sao),pendentes:pendentesFixos,fixa:true},{...real,pendentes:revisoesPorAplicar(),fixa:false}]){
  const inicio=plantas;
  const opcoes={pendentes};
  const card=root.querySelector('[data-cartao-revisao]')?.closest('[data-cartao-medida]')??root.querySelector('[data-cartao-medida]');
  assert(card);assert.deepEqual(ordem(parse(card.outerHTML),lang,rota,opcoes).erros,[]);assert.deepEqual(conferirRevisaoDoCartao(card,lang,opcoes).erros,[]);controlos++;
  if(!card.querySelector('[data-cartao-revisao]')){
   const copia=parse(card.outerHTML).firstChild;
   copia.insertAdjacentHTML('beforeend',`<div data-cartao-revisao="${card.getAttribute('data-cartao-medida')}"><p>Revisão inexistente</p></div>`);
   assert(conferirRevisaoDoCartao(copia,lang,opcoes).erros.length);assert(ordem(parse(copia.outerHTML),lang,rota,opcoes).erros.length);plantas++;
   continue;
  }
  for(const mudar of [
   c=>c.insertAdjacentHTML('beforeend',c.querySelector('[data-cartao-revisao]').outerHTML),
   c=>c.querySelector('[data-cartao-revisao]').insertAdjacentHTML('beforeend',c.querySelector('[data-aviso-revisao]').outerHTML),
   c=>c.querySelector('[data-cartao-revisao]').insertAdjacentHTML('beforeend','<p>Outro bloco</p>'),
  ]){
   const copia=parse(card.outerHTML).firstChild;mudar(copia);
   assert(conferirRevisaoDoCartao(copia,lang,opcoes).erros.length);assert(ordem(parse(copia.outerHTML),lang,rota,opcoes).erros.length);plantas++;
  }
  const sao=root.querySelectorAll('[data-cartao-medida]').find(c=>!c.querySelector('[data-aviso-revisao]'));
  assert(sao);const falso=parse(sao.outerHTML).firstChild;
  falso.insertAdjacentHTML('beforeend',card.querySelector('[data-cartao-revisao]').outerHTML);
  assert(conferirRevisaoDoCartao(falso,lang,opcoes).erros.length);assert(ordem(parse(falso.outerHTML),lang,rota,opcoes).erros.length);plantas++;
  const extra=parse(card.outerHTML);extra.firstChild.insertAdjacentHTML('beforeend','<p>Outro bloco</p>');
  assert(ordem(extra,lang,rota,opcoes).erros.length);plantas++;
  assert.deepEqual(conferirRevisaoDoCartao(parse(card.outerHTML).firstChild,lang,opcoes).erros,[]);controlos++;
  if(fixa)plantasFixas+=plantas-inicio;
  }
 }
 assert(plantasFixas>=10,'faltam plantas da revisão no caso fixo');
 console.log(`CR3-A cartão: ${plantasFixas} plantas fixas recusadas.`);
 return {plantas,controlos};
}
