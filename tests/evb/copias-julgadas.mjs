import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {blocosDaPagina,inventario,chave} from '../../scripts/frases-com-afirmacao.mjs';
import {conferirTextosJulgados,lerTextosJulgados} from '../../scripts/textos-julgados.mjs';
const slug='evora-2027-capital-europeia-da-cultura',declaracoes=lerTextosJulgados();
let controlos=0,plantas=0;
for(const lingua of ['pt','en'])for(const tipo of ['home','estudos','indice','municipio']){
 const rota=lingua==='pt'?{home:'/',estudos:'/estudos',indice:'/indice',municipio:'/municipios/evora'}[tipo]:{home:'/en',estudos:'/en/studies',indice:'/en/index',municipio:'/en/municipalities/evora'}[tipo];
 const root=parse(fs.readFileSync(`dist${rota==='/'?'':rota}/index.html`,'utf8'));
 const el=root.querySelector(tipo==='home'?`[data-novidade="estudo:${slug}"]`:`[data-estudo="${slug}"]`);
 const conferir=(html,ds=declaracoes)=>{
  const p={rota,lingua,tipo,estudo:'colecao-teste',blocos:blocosDaPagina(`<main>${html}</main>`)},fsx=inventario([p]);
  const r=conferirTextosJulgados(ds,[p],fsx);
  return {r,fsx,alvos:fsx.filter(f=>f.ocorrencias.some(o=>p.blocos[o.bloco].copiaJulgada))};
 };
 const controlo=conferir(el.outerHTML);assert.equal(controlo.alvos.length,1);
 assert(controlo.r.textos.has(chave(controlo.alvos[0])));controlos++;
 for(const mudar of [
  r=>r.querySelector('a').setAttribute('href','/outro'),
  r=>(tipo==='home'?r.querySelector('[data-titulo-publicado]'):r.querySelector('[data-verbatim]')).insertAdjacentHTML('beforeend',' Texto adulterado.'),
  r=>{const el=tipo==='home'?r.querySelector('[data-titulo-publicado]'):r.querySelector('[data-verbatim]');el.set_content(el.textContent.replace('2027','2028'));},
 ]){
  const copia=parse(el.outerHTML);mudar(copia);const v=conferir(copia.outerHTML);
  assert(v.alvos.length>0);assert(v.alvos.every(f=>!v.r.textos.has(chave(f))));plantas++;
 }
 const alteradas=structuredClone(declaracoes);alteradas.find(d=>d.estudo===slug&&d.lingua===lingua).sha256_documento='0'.repeat(64);
 const bad=conferir(el.outerHTML,alteradas);assert(bad.r.erros.length);assert(bad.alvos.every(f=>!bad.r.textos.has(chave(f))));plantas++;
 if(tipo==='home'){
  for(const mudar of [r=>r.querySelector('time').setAttribute('datetime','2026-11-13'),r=>r.querySelector('[data-titulo-publicado]').setAttribute('data-titulo-publicado',lingua==='pt'?'en':'pt'),r=>r.querySelector('.pp-novidade-tipo').set_content('Outra coisa')]){
   const copia=parse(el.outerHTML);mudar(copia);const v=conferir(copia.outerHTML);assert(v.alvos.every(f=>!v.r.textos.has(chave(f))));plantas++;
  }
 }
}
console.log(`EVB cópias: ${controlos} controlos; ${plantas} adulterações de texto, número, porta, data, língua e resumo recusadas.`);
