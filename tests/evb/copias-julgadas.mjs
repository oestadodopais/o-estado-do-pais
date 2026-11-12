import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {blocosDaPagina,inventario,chave} from '../../scripts/frases-com-afirmacao.mjs';
import {conferirTextosJulgados,lerTextosJulgados} from '../../scripts/textos-julgados.mjs';
import {LEITURAS} from '../../src/data/leituras.mjs';
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
let leiturasConferidas=0,plantasLeitura=0;
for(const lingua of ['pt','en'])for(const tipo of ['home','estudos','municipio','estudo']){
 const rota=lingua==='pt'?{home:'/',estudos:'/estudos',municipio:'/municipios/evora',estudo:`/estudos/${slug}`}[tipo]:{home:'/en',estudos:'/en/studies',municipio:'/en/municipalities/evora',estudo:`/en/studies/${slug}`}[tipo];
 const p={rota,lingua,tipo,estudo:tipo==='estudo'?slug:'colecao-teste',blocos:blocosDaPagina(fs.readFileSync(`dist${rota==='/'?'':rota}/index.html`,'utf8'))};
 const texto=LEITURAS[slug].frase[lingua].map(p=>typeof p==='string'?p:p.ref).join('');
 // No estudo, C039 conserva o vocabulário do documento. A cópia da leitura
 // nesta rota é uma planta positiva; as outras três rotas imprimem-na hoje.
 if(tipo==='estudo'){
  assert(p.blocos.some(b=>b.frases.includes(LEITURAS[slug].origem[lingua])));
  p.blocos.push(...blocosDaPagina(`<p>${texto}</p>`));
 }
 const ocorrencias=p.blocos.flatMap((b,bloco)=>b.frases.flatMap((frase,indice)=>frase===texto?[{pagina:rota,bloco,indice}]:[]));
 assert.equal(ocorrencias.length,1,`leitura ausente: ${rota}`);
 const frases=[{estudo:p.estudo,lingua,frase:texto,ocorrencias}];
 const coberta=(pagina=p,entrada=LEITURAS[slug],ds=declaracoes)=>conferirTextosJulgados(ds,[pagina],frases,{leituras:{[slug]:entrada}}).textos.has(chave(frases[0]));
 assert(coberta(),rota);leiturasConferidas++;
 // A chave omite números; a prova tem de recusar a ocorrência adulterada.
 for(const [antes,depois] of [[lingua==='pt'?'cultura':'culture',lingua==='pt'?'saúde':'health'],['2024','2023']]){
  const pagina=structuredClone(p);
  const o=frases[0].ocorrencias[0];
  pagina.blocos[o.bloco].frases[o.indice]=texto.replace(antes,depois);
  assert(!coberta(pagina),`cópia adulterada: ${rota}`);plantasLeitura++;
 }
 for(const mudar of [
  e=>{delete e.origem;},
  e=>{e.origem[lingua]+=' Texto alheio.';},
  e=>{e.origem.troca='troca-fora-da-lista';},
  e=>{delete e.origem.troca;},
  e=>{e.frase[lingua].find(p=>p.ref==='2024').ref='2023';},
  e=>{e.frase[lingua][0]=e.frase[lingua][0].replace(lingua==='pt'?'cultura':'culture',lingua==='pt'?'saúde':'health');},
 ]){
  const entrada=structuredClone(LEITURAS[slug]);mudar(entrada);
  assert(!coberta(p,entrada),`origem ou declaração adulterada: ${rota}`);plantasLeitura++;
 }
 assert(!coberta(p,LEITURAS[slug],[]));plantasLeitura++;
}
console.log(`EVB leitura julgada: ${leiturasConferidas} controlos (seis cópias impressas e duas plantas na página do estudo); ${plantasLeitura} plantas de palavra, ano, origem, troca e declaração recusadas.`);
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
