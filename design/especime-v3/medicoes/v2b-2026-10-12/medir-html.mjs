/** Prova V2-b recolhida exclusivamente do HTML construído. */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const raiz=process.cwd(), require=createRequire(path.join(raiz,'package.json'));
const {parse}=require('node-html-parser');
const saida=process.argv[2];
const dist=path.join(raiz,'dist');
const ler=p=>parse(fs.readFileSync(path.join(dist,p),'utf8'));
const limpo=n=>{const x=parse(n.outerHTML);x.querySelectorAll('.src-chip,script,style').forEach(e=>e.remove());return x.text.replace(/[ \t\r\n\f]+/g,' ').trim();};
const ids=n=>[...new Set(n.querySelectorAll('[data-claim],[data-linha-claim],[data-de-linha],[data-explicacao-nome]').filter(e=>!e.closest('[data-discussao-integracao]')).map(e=>e.getAttribute('data-claim')??e.getAttribute('data-linha-claim')??e.getAttribute('data-de-linha')??e.getAttribute('data-explicacao-nome')))];
const erros=[],edicoes={},integracoes=[],recursos={};
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const destinoValido=href=>{const [rota,ancora]=href.split('#');const f=path.join(dist,rota,'index.html');return fs.existsSync(f)&&(!ancora||ler(path.relative(dist,f)).querySelector(`[id="${ancora}"]`)!==null);};
for(const lang of ['pt','en']) {
 const rota=lang==='pt'?'/o-que-se-discute/':'/en/under-discussion/';
 const file=rota.slice(1)+'index.html',root=ler(file),home=ler(lang==='pt'?'index.html':'en/index.html');
 const explicacao=ler((lang==='pt'?'explicacoes/':'en/explainers/')+'dinheiro-do-estado-2026/index.html');
 recursos[file]=sha(path.join(dist,file));
 const bloco=home.querySelector('[data-discussao-inicio]');
 const portaPagina=bloco.querySelector('h2 a')?.getAttribute('href');
 const itens=root.querySelectorAll('[data-discussao]').map(a=>{
  const slug=a.getAttribute('data-discussao'),destino=rota+'#'+slug;
  const sumario=root.querySelector('.discussao-sumario')?.querySelectorAll('a').some(n=>n.getAttribute('href')===destino);
  const direto=bloco.querySelectorAll('a').some(n=>n.getAttribute('href')===destino);
  const numeros=a.querySelectorAll('[data-claim]').map(n=>{const id=n.getAttribute('data-claim'),href=(lang==='pt'?'/livro-razao/':'/en/ledger/')+id;return {id,valor:n.text,recibo:href,toques:1,adjacente:n.parentNode.querySelectorAll('a').some(e=>e.getAttribute('href')===href),destino_existe:destinoValido(href)};});
  const linhas=ids(a),recibos=linhas.map(id=>{const href=(lang==='pt'?'/livro-razao/':'/en/ledger/')+id;return {id,href,presente:a.querySelectorAll('a').some(n=>n.getAttribute('href')===href),destino_existe:destinoValido(href)};});
  const r={slug,titulo:limpo(a.querySelector('[data-discussao-titulo]')),partes:a.querySelectorAll('[data-discussao-parte]').map(s=>({id:s.getAttribute('data-discussao-parte'),titulo:limpo(s.querySelector('h3')),paragrafos:s.querySelectorAll('[data-discussao-paragrafo]').map(limpo)})),linhas,numeros,recibos,inicio:{via_pagina:portaPagina===rota&&sumario&&destinoValido(destino),toques_via_pagina:2,direto,toques_direto:1}};
  if(!r.inicio.via_pagina||!direto||r.partes.length!==6||numeros.some(n=>!n.adjacente||!n.destino_existe)||recibos.some(n=>!n.presente||!n.destino_existe))erros.push(lang+': falha de aceitação em '+slug);
  return r;
 });
 const porta=explicacao.querySelector('[data-explicacao-secao="por-funcao"] [data-discussao-integracao] a')?.getAttribute('href');
 const tematica={href:porta,toques:1,correta:porta===rota+'#saude-no-orcamento'&&destinoValido(porta)};
 if(!tematica.correta)erros.push(lang+': porta temática errada');
 edicoes[lang]={rota,itens,tematica};
}
let paginasLidas=0;
const visitar=p=>{for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isDirectory())visitar(f);else if(e.name==='index.html'){
 const rel=path.relative(dist,f);if(rel.includes('/documento/')||rel.includes('/document/'))continue;
 paginasLidas++;
 const html=fs.readFileSync(f,'utf8');
 if(!html.includes('data-discussao-integracao'))continue;
 const root=parse(html),lang=rel.startsWith('en/')?'en':'pt',linhas=ids(root.querySelector('main'));
 recursos[rel]=sha(f);
 for(const p of root.querySelectorAll('[data-discussao-integracao]')){
  const slug=p.getAttribute('data-discussao-integracao'),condicao=p.getAttribute('data-discussao-condicao'),item=edicoes[lang].itens.find(i=>i.slug===slug),comuns=linhas.filter(id=>item.linhas.includes(id)),href=p.querySelector('a')?.getAttribute('href');
  const r={pagina:rel,lang,item:slug,condicao,linhas_comuns:comuns,href,destino_existe:destinoValido(href)};integracoes.push(r);
  if(!r.destino_existe||(condicao==='linhas'&&!comuns.length)||(condicao==='tematica'&&(!rel.includes('dinheiro-do-estado-2026')||slug!=='saude-no-orcamento')))erros.push('integração inválida: '+rel);
 }
}}};visitar(dist);
const res={cabeca:JSON.parse(fs.readFileSync(path.join(dist,'version.json'))).commit,paginas_lidas:paginasLidas,edicoes,integracoes,recursos,erros};
fs.writeFileSync(saida,JSON.stringify(res,null,2)+'\n');
console.log(JSON.stringify({erros,portas:integracoes.length,por_condicao:Object.fromEntries(['linhas','tematica'].map(c=>[c,integracoes.filter(i=>i.condicao===c).length])),numeros:Object.fromEntries(Object.entries(edicoes).map(([l,e])=>[l,e.itens.map(i=>i.numeros.length)]))}));
if(erros.length)process.exitCode=1;
