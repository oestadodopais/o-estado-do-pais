import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {WORKS, PUBLISHED_WORKS} from '../../src/data/studies.mjs';
import {manifestoEd2,conferirMudancasDoCabecalho,publicacaoNoPortao,versoesNoManifesto} from '../../scripts/edicoes-linha-conferir.mjs';
const pedida=process.argv.find(a=>a.startsWith('--planta='))?.split('=')[1];
const dist=process.env.OEDP_DIST??'dist';let controlos=0,plantas=0,recusadas=0;
const ler=(slug,lang)=>parse(fs.readFileSync(`${dist}/${lang==='pt'?'estudos':'en/studies'}/${slug}/index.html`,'utf8')).querySelector('[data-estudo-edicao]');
function planta(nome,original,mudar,conferir){
 const root=parse(original.outerHTML).firstChild;mudar(root);const erros=conferir(root);
 assert(erros.length,`ED2 B: ${nome} passou`);plantas++;
 if(pedida===nome){console.error(`ED2 B ${nome}: ${erros.join('; ')}`);recusadas++;}
}
for(const w of PUBLISHED_WORKS)for(const lang of ['pt','en']){
 const e=w.editions.find(e=>e.lang===lang)??w.editions[0],vs=versoesNoManifesto(w.slug,e.lang),pub=publicacaoNoPortao(w.slug,e.lang);
 if(vs.length!==1||!pub||vs[0].data<=pub)continue;
 const root=ler(w.slug,lang),conferir=r=>conferirMudancasDoCabecalho(r,w.slug,e.lang,manifestoEd2,lang);
 assert.deepEqual(conferir(root),[]);controlos++;
 planta('atualizacao-tirada',root,r=>r.querySelector('[data-estudo-atualizacao]').remove(),conferir);
 planta('porta-publicada-falsa',root,r=>r.querySelector('a').set_content(lang==='pt'?'Edição tal como foi publicada':'Edition as published'),conferir);
}
const esperados=PUBLISHED_WORKS.flatMap(w=>['pt','en'].map(lang=>({w,e:w.editions.find(e=>e.lang===lang)??w.editions[0]}))).filter(({w,e})=>e.updated&&versoesNoManifesto(w.slug,e.lang).length===1).length;
assert.equal(controlos,esperados,'todas as páginas com uma única edição e atualização declarada');
for(const lang of ['pt','en']){
 const slug='onde-esta-a-agua',root=ler(slug,lang),conferir=r=>conferirMudancasDoCabecalho(r,slug,lang);
 assert.deepEqual(conferir(root),[]);controlos++;
 planta('atualizacao-a-mais',root,r=>r.insertAdjacentHTML('beforeend',` · <span>${lang==='pt'?'atualizado a':'updated on'}</span> <time data-estudo-atualizacao datetime="2026-11-07">07.11.2026</time>`),conferir);
 const evora='evora-2027-capital-europeia-da-cultura',atual=ler(evora,lang),confere=r=>conferirMudancasDoCabecalho(r,evora,lang);
 assert.deepEqual(confere(atual),[]);controlos++;
 planta('so-palavra-errada',atual,r=>{
  const time=r.querySelector('[data-estudo-correcao]'),ns=time.parentNode.parentNode.childNodes;
  const label=ns.slice(0,ns.indexOf(time.parentNode)).findLast(n=>n.nodeType===1);label.set_content(lang==='pt'?'atualizado a':'updated on');
  assert(time.hasAttribute('data-estudo-correcao'));assert(!time.hasAttribute('data-estudo-atualizacao'));
 },confere);
}
console.log(`ED2 B: ${controlos} controlos; ${plantas} plantas recusadas.`);
if(pedida){assert(recusadas>0,'planta desconhecida');process.exitCode=1;}
