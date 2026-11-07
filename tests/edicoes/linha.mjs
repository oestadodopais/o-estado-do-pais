import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {manifestoEd2,conferirLinhaDasEdicoes,conferirMudancasDoCabecalho,rotasNoManifesto} from '../../scripts/edicoes-linha-conferir.mjs';
import {conferirFaixaDaVersao} from '../../scripts/documento-edicao-conferir.mjs';
const dist=process.env.OEDP_DIST??'dist',ler=rota=>parse(fs.readFileSync(`${dist}${rota}/index.html`,'utf8'));
const pedida=process.argv.find(a=>a.startsWith('--planta='))?.split('=')[1];
let controlos=0,plantas=0,recusadas=0;
function planta(nome,root,mudar,conferir){
 const copia=parse(root.outerHTML);mudar(copia);const erros=conferir(copia);
 assert(erros.length,`ED2: planta ${nome} passou`);plantas++;
 if(pedida===nome){recusadas++;console.error(`ED2 planta ${nome}: vermelho 1: ${erros[0]}`);}
}
for(const e of manifestoEd2.edicoes.filter(e=>e.edicoes.length>1)){
 const base=`${e.lang==='pt'?'/estudos':'/en/studies'}/${e.slug}`;
 const root=ler(base).querySelector('[data-estudo-edicao]');
 const conferir=r=>[...conferirLinhaDasEdicoes(r,manifestoEd2,e.slug,e.lang),...conferirMudancasDoCabecalho(r,e.slug,e.lang)];
 assert.deepEqual(conferir(root),[]);controlos++;
 planta('edicao-omitida',root,r=>r.querySelector('[data-edicoes-item]').remove(),conferir);
 const correcao=e.edicoes.findIndex((v,i)=>i>0&&v.natureza===undefined);
 if(correcao>0){
  planta('natureza-trocada',root,r=>{const el=r.querySelectorAll('[data-edicao-lista-data]')[correcao].closest('[data-edicoes-item]').querySelector('[data-voz]');el.set_content(el.textContent.replace(e.lang==='pt'?'corrigido a':'corrected on',e.lang==='pt'?'atualizado a':'updated on'));},conferir);
  planta('data-de-correcao-como-atualizacao',root,r=>{const el=r.querySelector('[data-estudo-correcao]');el.removeAttribute('data-estudo-correcao');el.setAttribute('data-estudo-atualizacao','');const ns=el.parentNode.parentNode.childNodes;const antes=ns.slice(0,ns.indexOf(el.parentNode)).findLast(n=>n.nodeType===1);antes.set_content(e.lang==='pt'?'atualizado a':'updated on');},conferir);
 }
 for(const [i,rota] of rotasNoManifesto(e.slug,e.lang).entries()){
  const doc=ler(rota),data=e.edicoes[i].data,confere=r=>conferirFaixaDaVersao(r,manifestoEd2,e.slug,e.lang,data);
  assert.deepEqual(confere(doc),[]);controlos++;
  planta('edicao-omitida',doc,r=>r.querySelector('[data-edicoes-item]').remove(),confere);
  if(correcao>0)planta('natureza-trocada',doc,r=>{const el=r.querySelectorAll('[data-edicao-lista-data]')[correcao].closest('[data-edicoes-item]').querySelector('[data-voz]');el.set_content(el.textContent.replace(e.lang==='pt'?'corrigido a':'corrected on',e.lang==='pt'?'atualizado a':'updated on'));},confere);
  planta('corrente-com-porta',doc,r=>r.querySelector('[aria-current="page"]').set_content(`<a href="${rota}">indevida</a>`),confere);
 }
}
// A régua recusa uma natureza desconhecida, sem a converter em correção.
const desconhecido=structuredClone(manifestoEd2),alvo=desconhecido.edicoes.find(e=>e.edicoes.length>1);
alvo.edicoes[1].natureza='planta-desconhecida';
assert(conferirLinhaDasEdicoes(ler(`${alvo.lang==='pt'?'/estudos':'/en/studies'}/${alvo.slug}`).querySelector('[data-estudo-edicao]'),desconhecido,alvo.slug,alvo.lang).some(e=>e.includes('natureza desconhecida')));plantas++;
// A ordem segue as datas também quando a atualização é posterior à correção.
for(const lang of ['pt','en']){
 const m={edicoes:[{slug:'planta',lang,edicoes:[{data:'2025-01-01'},{data:'2025-02-01',natureza:'atualizacao'},{data:'2025-03-01'},{data:'2026-02-01'},{data:'2026-03-01',natureza:'atualizacao'}]}]};
 const html=`<p><span>${lang==='pt'?'corrigido a':'corrected on'}</span> <time data-estudo-correcao datetime="2026-02-01">01.02.2026</time> · <span>${lang==='pt'?'atualizado a':'updated on'}</span> <time data-estudo-atualizacao datetime="2026-03-01">01.03.2026</time></p>`;
 assert.deepEqual(conferirMudancasDoCabecalho(parse(html),'planta',lang,m),[]);controlos++;
}
console.log(`ED2: ${controlos} controlos; ${plantas} plantas recusadas.`);
if(pedida){assert(recusadas>0,'planta desconhecida');process.exitCode=1;}
