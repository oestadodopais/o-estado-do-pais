/** ED3: plantas isoladas sobre o HTML construído, sem importar a vista. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {WORKS} from '../../src/data/studies.mjs';
import {linhaDasEdicoes,faixaDaVersao} from '../../src/lib/edicoes.mjs';
import {manifestoEd2,publicacaoNoPortao,conferirLinhaDasEdicoes,rotasNoManifesto} from '../../scripts/edicoes-linha-conferir.mjs';
import {conferirFaixaDaVersao} from '../../scripts/documento-edicao-conferir.mjs';
const pedida=process.argv.find(a=>a.startsWith('--planta='))?.split('=')[1];
const dist=process.env.OEDP_DIST??'dist',ler=rota=>parse(fs.readFileSync(`${dist}${rota}/index.html`,'utf8'));
let controlos=0,plantas=0,recusadas=0;
function plantar(nome,root,muda,confere){
 if(pedida&&pedida!==nome)return;
 const copia=parse(root.outerHTML);muda(copia);const erros=confere(copia);
 assert(erros.length,`${nome}: passou indevidamente`);plantas++;
 if(pedida){recusadas++;console.error(`ED3 ${nome}: código 1: ${erros[0]}`);}
}
for(const e of manifestoEd2.edicoes.filter(e=>e.edicoes.length>1&&!WORKS.some(w=>w.slug===e.slug&&w.estado==='retirado'))){
 const base=`${e.lang==='pt'?'/estudos':'/en/studies'}/${e.slug}`;
 const header=ler(base).querySelector('[data-estudo-edicao]');
 const casos=[{root:header,confere:r=>conferirLinhaDasEdicoes(r,manifestoEd2,e.slug,e.lang)}];
 for(const [i,rota] of rotasNoManifesto(e.slug,e.lang).entries())casos.push({root:ler(rota).querySelector('[data-documento-edicao]'),confere:r=>conferirFaixaDaVersao(r,manifestoEd2,e.slug,e.lang,e.edicoes[i].data),faixa:true});
 for(const {root,confere,faixa} of casos){
  // O seletor da faixa exige um antepassado, tal como no documento completo.
  const original=parse(`<div>${root.outerHTML}</div>`);
  assert.deepEqual(confere(original),[]);controlos++;
  plantar('data-repetida',original,r=>{const t=r.querySelector('time');t.insertAdjacentHTML('afterend',t.outerHTML);},confere);
  plantar('separador-audivel',original,r=>r.querySelector('[aria-hidden]').removeAttribute('aria-hidden'),confere);
  const correcao=e.edicoes.findIndex((v,i)=>i>0&&v.natureza===undefined);
  if(correcao>0)plantar('correcao-como-atualizacao',original,r=>r.querySelectorAll('[data-edicao-lista-data]')[correcao].closest('[data-edicoes-item]').querySelector('[data-voz]').set_content(e.lang==='pt'?'atualizado a':'updated on'),confere);
  if(publicacaoNoPortao(e.slug,e.lang)!==e.edicoes[0].data)plantar('primeira-juntada',original,r=>{
   r.querySelector('[data-edicoes-item]').remove();
   const item=r.querySelector('[data-edicoes-item]');item.querySelector('[data-voz]').set_content(e.lang==='pt'?'publicado a':'published on');
   item.querySelector('time').setAttribute('data-nonledger','data-do-repositorio');
   r.querySelector('[data-edicoes-linha]').firstChild.remove();
  },confere);
  if(faixa)plantar('frase-antiga',original,r=>{
   const data=e.edicoes.at(-1).data.split('-').reverse().join('.');
   r.querySelector('[data-documento-edicao]').insertAdjacentHTML('afterbegin',`<p data-edicao-frase>${e.lang==='pt'?`Edição atual, de ${data}.`:`Current edition, from ${data}.`}</p>`);
  },confere);
 }
}
// Caso sintético: a entrada precede a publicação nos dados reais. Só nesta
// memória, usa-se essa entrada como publicação para exercitar datas distintas.
const entradas=JSON.parse(fs.readFileSync('src/data/datas-de-publicacao.json','utf8')).edicoes;
for(const e of manifestoEd2.edicoes.filter(e=>e.edicoes.length>1&&!WORKS.some(w=>w.slug===e.slug&&w.estado==='retirado'))){
 const edicao=WORKS.find(w=>w.slug===e.slug)?.editions.find(v=>v.lang===e.lang);
 const entrada=entradas.find(v=>v.slug===e.slug&&v.lang===e.lang)?.data;
 // O caso exige publicação e primeira edição guardada em datas distintas.
 if(!edicao||!entrada||entrada===edicao.date||entrada===e.edicoes[0].data)continue;
 const original=edicao.date;edicao.date=entrada;
 try{
  const data=e.edicoes[0].data;
  for(const faixa of [false,true]){
   const html=faixa?faixaDaVersao(e.slug,e.lang,data):linhaDasEdicoes(e.slug,e.lang);
   const root=parse(`<div>${html}</div>`),confere=r=>faixa?conferirFaixaDaVersao(r,manifestoEd2,e.slug,e.lang,data):conferirLinhaDasEdicoes(r,manifestoEd2,e.slug,e.lang);
   assert.deepEqual(confere(root),[]);controlos++;
   const itens=root.querySelectorAll('[data-edicoes-item]');
   assert.equal(itens[0].querySelector('time').getAttribute('datetime'),entrada);
   assert.equal(itens[0].querySelector('a'),null);
   assert.equal(itens[1].querySelector('[data-voz]').textContent,e.lang==='pt'?'primeira edição guardada a':'first edition kept on');
   plantar('primeira-juntada',root,r=>{
    r.querySelector('[data-edicoes-item]').remove();
    r.querySelector('[data-edicoes-linha]').firstChild.remove();
    const item=r.querySelector('[data-edicoes-item]');
    item.querySelector('[data-voz]').set_content(e.lang==='pt'?'publicado a':'published on');
    item.querySelector('time').setAttribute('data-nonledger','data-do-repositorio');
   },confere);
  }
 }finally{edicao.date=original;}
}
console.log(`ED3: ${controlos} controlos; ${plantas} plantas recusadas.`);
if(pedida){assert(recusadas>0,'planta desconhecida');process.exitCode=1;}
