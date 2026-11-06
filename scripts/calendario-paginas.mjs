/** VOZ-1 B: as portas vêm das citações nas páginas construídas, antes dos portões. */
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {WORKS} from '../src/data/studies.mjs';
import {getClaim} from '../src/lib/ledger.mjs';
import {dataDaCasa} from '../src/lib/datas.mjs';
import {routePath,matchPath} from '../src/lib/routes.mjs';
const dist=process.env.OEDP_DIST??'dist';
const calendario=JSON.parse(fs.readFileSync('src/data/calendario.json','utf8'));
const linhas=new Set(calendario.eventos.flatMap(e=>e.afecta_linhas??[]));
const indice={pt:new Map(),en:new Map()};
const excluidas=new Set(['linha','livro','livroConcelho','livroConcelhos','serie','metodo','sobre','privacidade','agenda','correcoes','documento','texto','home','temas','indice','estudos','discussao','leituraDaSemana','areas']);
const normal=s=>s.replace(/\s+/gu,' ').trim();
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function andar(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const f=path.join(dir,e.name);if(e.isDirectory()){andar(f);continue;}if(e.name!=='index.html')continue;
 const rota='/'+path.relative(dist,f).replace(/index\.html$/,'').replace(/\/$/,'');const hit=matchPath(rota);
 if(!hit || excluidas.has(hit.key) || (hit.key==='estudo'&&WORKS.some(w=>w.slug===hit.params.slug&&w.sucedidoPor)))continue;
 const doc=parse(fs.readFileSync(f,'utf8')),main=doc.querySelector('main'),titulo=normal(main?.querySelector('h1')?.textContent??'');
 if(!titulo)continue;
 const ids=new Set((main?.querySelectorAll('a.src-chip[href]')??[]).map(a=>matchPath((a.getAttribute('href')??'').split('#')[0])).filter(r=>r?.key==='linha').map(r=>r.params.slug));
 for(const id of ids)if(linhas.has(id)){if(!indice[hit.lang].has(id))indice[hit.lang].set(id,[]);indice[hit.lang].get(id).push({rota,titulo});}
}}
andar(dist);
for(const lang of ['pt','en']){
 const arquivo=path.join(dist,lang==='pt'?'agenda':'en/agenda','index.html');const doc=parse(fs.readFileSync(arquivo,'utf8'));
 // A grafia vem do menu desta página; as outras portas conservam a rota encontrada.
 const menu=new Map(doc.querySelectorAll('#nav-principal a[href]').map(a=>{
  const href=a.getAttribute('href');return [href.replace(/\/$/,''),href];
 }));
 for(const alvo of doc.querySelectorAll('[data-calendario-alvos]')){
  const e=calendario.eventos.find(e=>e.id===alvo.getAttribute('data-calendario-alvos'));
  if(!e)throw new Error('Calendário: acontecimento desconhecido');
  const portas=[...new Map((e.afecta_linhas??[]).flatMap(id=>indice[lang].get(id)??[]).map(p=>[p.rota,p])).values()].sort((a,b)=>a.titulo.localeCompare(b.titulo,lang));
  if(!portas.length){alvo.remove();continue;}
  alvo.set_content((lang==='pt'?'Atualiza: ':'Updates: ')+portas.map(p=>{const href=menu.get(p.rota)??p.rota;return `<a data-calendario-pagina="${esc(href)}" href="${esc(href)}">${esc(p.titulo)}</a>`;}).join(' · '));
 }
 fs.writeFileSync(arquivo,doc.toString());
 const registo=path.join(dist,lang==='pt'?'correcoes':'en/corrections','index.html');
 const correcoes=parse(fs.readFileSync(registo,'utf8'));
 for(const el of correcoes.querySelectorAll('[data-correcao-titulo]')){
  const id=el.getAttribute('data-correcao-titulo');
  const recibo=parse(fs.readFileSync(path.join(dist,routePath('linha',lang,{slug:id}),'index.html'),'utf8'));
  const titulo=normal(recibo.querySelector('main h1')?.textContent??'');
  if(!titulo)throw Error(`Revisão sem título no recibo: ${id}`);
  el.querySelector('[data-correcao-nome]').set_content(esc(titulo));
  if(titulo.includes(lang==='pt'?'União Europeia':'European Union'))el.querySelector('[data-correcao-uniao]')?.remove();
  const periodo=dataDaCasa(getClaim(id).reference_date,lang);
  if(titulo.includes(periodo))el.querySelector('[data-correcao-periodo]')?.remove();
 }
 fs.writeFileSync(registo,correcoes.toString());

}
console.log('VOZ-1 B: portas do calendário conferíveis no HTML das páginas atuais.');
