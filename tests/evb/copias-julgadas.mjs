import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {blocosDaPagina,inventario,chave,cortar} from '../../scripts/frases-com-afirmacao.mjs';
import {conferirTextosJulgados,lerTextosJulgados} from '../../scripts/textos-julgados.mjs';
import {LEITURAS} from '../../src/data/leituras.mjs';
import {getClaim} from '../../src/lib/ledger.mjs';
import {valorNaLingua} from '../../src/lib/valor-na-lingua.mjs';
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
// A opção planta a candidata numa cópia em memória; nunca certifica o dist.
const candidata=process.argv.includes('--copia-leitura-candidata');
let leiturasConferidas=0,plantasLeitura=0;
for(const lingua of ['pt','en'])for(const tipo of ['home','estudos','municipio']){
 const rota=lingua==='pt'?{home:'/',estudos:'/estudos',municipio:'/municipios/evora'}[tipo]:{home:'/en',estudos:'/en/studies',municipio:'/en/municipalities/evora'}[tipo];
 const root=parse(fs.readFileSync(`dist${rota==='/'?'':rota}/index.html`,'utf8'));
 const texto=LEITURAS[slug].frase[lingua].map(p=>typeof p==='string'?p:p.ref??valorNaLingua(getClaim(p.claim),lingua)).join('');
 if(candidata){
  const el=root.querySelector(`[data-estudo="${slug}"]`).querySelector('p.estudo-resumo, p.lugar-estudo-leitura');
  assert(el,`cartão ausente: ${rota}`);
  const escapar=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  el.set_content(LEITURAS[slug].frase[lingua].map(p=>typeof p==='string'?escapar(p):p.ref?`<span data-nonledger="data-de-referencia">${p.ref}</span>`:`<span data-claim="${p.claim}">${valorNaLingua(getClaim(p.claim),lingua)}</span>`).join(''));
 }
 const p={rota,lingua,tipo,estudo:'colecao-teste',blocos:blocosDaPagina(root.outerHTML)};
 const ocorrencias=p.blocos.flatMap((b,bloco)=>b.frases.flatMap((frase,indice)=>cortar(texto).includes(frase)?[{pagina:rota,bloco,indice}]:[]));
 assert.equal(ocorrencias.length,cortar(texto).length,`leitura ausente: ${rota}`);
 const frases=ocorrencias.map(o=>({estudo:p.estudo,lingua,frase:p.blocos[o.bloco].frases[o.indice],ocorrencias:[o]}));
 const coberta=(pagina=p,entrada=LEITURAS[slug],ds=declaracoes)=>conferirTextosJulgados(ds,[pagina],frases,{leituras:{[slug]:entrada}}).textos.size===frases.length;
 assert(coberta(),rota);leiturasConferidas++;
 // A chave omite números; a prova tem de recusar a ocorrência adulterada.
 for(const [antes,depois] of [[lingua==='pt'?'contas':'accounts',lingua==='pt'?'empresa':'company'],['2025','2023'],['9,7','8,7']]){
  const pagina=structuredClone(p);
  const o=frases[0].ocorrencias[0];
  pagina.blocos[o.bloco].frases[o.indice]=frases[0].frase.replace(antes,depois);
  assert(!coberta(pagina),`cópia adulterada: ${rota}`);plantasLeitura++;
 }
 for(const mudar of [
  e=>{delete e.origem;},
  e=>{e.origem[lingua]+=' Texto alheio.';},
  e=>{e.origem.troca='troca-fora-da-lista';},
  e=>{e.origem.troca='governo-do-concelho';},
  e=>{e.frase[lingua].find(p=>p.ref==='2025').ref='2023';},
  e=>{e.frase[lingua][0]=e.frase[lingua][0].replace(lingua==='pt'?'contas':'accounts',lingua==='pt'?'empresa':'company');},
 ]){
  const entrada=structuredClone(LEITURAS[slug]);mudar(entrada);
  assert(!coberta(p,entrada),`origem ou declaração adulterada: ${rota}`);plantasLeitura++;
 }
 assert(!coberta(p,LEITURAS[slug],[]));plantasLeitura++;
}
console.log(`EVB leitura julgada: ${leiturasConferidas} controlos (${candidata?'cópias em memória com C004 candidata, sem certificar a construção':'cópias impressas no dist'}); ${plantasLeitura} plantas de palavra, ano, origem, troca e declaração recusadas.`);
let titulosConferidos=0,plantasTitulo=0;
for(const lingua of ['pt','en']){
 const rota=lingua==='pt'?'/':'/en';
 const root=parse(fs.readFileSync(`dist/${lingua==='pt'?'':'en/'}index.html`,'utf8'));
 const el=root.querySelector(`article[data-estudo="${slug}"]`);
 const coberto=html=>{
  const p={rota,lingua,tipo:'home',estudo:'/',blocos:blocosDaPagina(html)},frases=inventario([p]);
  const alvos=frases.filter(f=>f.ocorrencias.some(o=>p.blocos[o.bloco].tag==='H3'));
  assert.equal(alvos.length,1);
  return conferirTextosJulgados(declaracoes,[p],frases).textos.has(chave(alvos[0]));
 };
 assert(coberto(el.outerHTML));titulosConferidos++;
 for(const mudar of [
  r=>r.querySelector('a').setAttribute('href','/outro'),
  r=>r.querySelector('a').set_content(r.querySelector('a').textContent.replace('2027','2028')),
  r=>r.querySelector('a').insertAdjacentHTML('beforeend',' Texto alheio.'),
  r=>r.querySelector('a').setAttribute('data-titulo-publicado',lingua==='pt'?'en':'pt'),
  r=>r.querySelector('[data-estudo-novo]').set_content('Outro marcador'),
 ]){
  const copia=parse(el.outerHTML);mudar(copia);assert(!coberto(copia.outerHTML));plantasTitulo++;
 }
}
console.log(`EVB título do cartão: ${titulosConferidos} controlos; ${plantasTitulo} plantas de porta, ano, palavra, língua e marcador recusadas.`);
