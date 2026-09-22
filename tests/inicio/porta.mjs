#!/usr/bin/env node
/** B1, peça 3, correção de 22.09: a cabeça tem a leitura e o mapa; os temas
 * começam por baixo, com a largura do conteúdo e a grelha de /temas/.
 * A leitura, a porta do mapa, o olho e o nome do primeiro tema cabem no portátil.
 * --vermelhos prova o menu partido, o olho fora da dobra e a grelha estreita. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';
const dist=path.resolve(process.env.OEDP_DIST ?? 'dist');
const tipos={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.json':'application/json'};
const server=http.createServer(async(req,res)=>{try{
  let f=path.resolve(dist,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!f.startsWith(dist+path.sep)&&f!==dist)throw Error('Caminho inválido');
  if((await fs.stat(f)).isDirectory())f=path.join(f,'index.html');
  res.setHeader('Content-Type',tipos[path.extname(f)]??'application/octet-stream');res.end(await fs.readFile(f));
}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origem=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
const resultados=[];
const regista=(id,passou,medida)=>resultados.push({id,passou,medida});
const medir=()=>{
 const caixa=s=>document.querySelector(s)?.getBoundingClientRect().toJSON();
 const menu=[...document.querySelectorAll('#nav-principal a')].map(a=>a.getBoundingClientRect());
 const grelha=document.querySelector('.pais-cartoes');
 return {menuUmaLinha:menu.length===5 && menu.every(r=>r.width>0&&Math.abs(r.y-menu[0].y)<1),
  largura:innerWidth,documento:document.documentElement.scrollWidth,altura:document.documentElement.scrollHeight,
  menu:caixa('#nav-principal'),nome:caixa('h1.wordmark'),conteudo:caixa('main'),cabeca:caixa('.pais-cabeca'),
  leitura:caixa('[data-leitura-pais]'),mapa:caixa('[data-mapa]'),porta:caixa('.pais-porta-lugares'),
  textoDaPorta:document.querySelector('.pais-porta-lugares')?.textContent.replace(/\s+/g,' ').trim(),
  temas:caixa('.pais-temas'),olho:caixa('#temas-k'),primeiroTema:caixa('.pais-tema-k'),
  grelha:caixa('.pais-cartoes'),colunas:grelha?getComputedStyle(grelha).gridTemplateColumns:null};
};
const dentro=c=>!!c&&c.width>0&&c.height>0&&c.top>=0&&c.bottom<=800;
const portaInteira=(m,lang)=>m.menuUmaLinha&&[m.menu,m.nome,m.leitura,m.mapa,m.porta,m.olho,m.primeiroTema].every(dentro)
 && m.textoDaPorta===(lang==='pt'?'308 concelhos':'308 municipalities');
const larguraInteira=m=>!!m.temas&&!!m.grelha&&Math.abs(m.temas.left-m.conteudo.left)<1
 &&Math.abs(m.temas.right-m.conteudo.right)<1&&Math.abs(m.grelha.width-m.conteudo.width)<1;
try{
 for(const [lang,home,theme] of [['pt','/','/temas/'],['en','/en/','/en/themes/']]){
  const ctx=await browser.newContext({viewport:{width:390,height:800},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});
  await ctx.route('**/*',r=>r.request().url().startsWith(origem)?r.continue():r.abort());
  const pg=await ctx.newPage();
  const abre=async rota=>{await pg.goto(origem+rota,{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);return pg.evaluate(medir);};
  for(const largura of [390,768,1024,1280,1600]){
   await pg.setViewportSize({width:largura,height:800});
   const t=await abre(theme),m=await abre(home);
   for(const [rota,v] of [[home,m],[theme,t]]){
    regista(`N1.${lang}.${largura}.${rota}`,v.menuUmaLinha,v.menu);
    regista(`N2.${lang}.${largura}.${rota}`,v.documento<=v.largura,v.documento);
   }
   regista(`G1.${lang}.${largura}`,larguraInteira(m)&&m.colunas===t.colunas&&m.temas.top>=m.cabeca.bottom-1,
    {altura:m.altura,conteudo:m.conteudo.width,temas:m.temas.width,grelha:m.grelha.width,colunas:m.colunas,colunasDosTemas:t.colunas});
   if(largura!==1280)continue;
   regista(`P1.${lang}`,portaInteira(m,lang),m);
   regista(`P2.${lang}`,larguraInteira(m),{conteudo:m.conteudo.width,temas:m.temas.width,grelha:m.grelha.width});
   if(process.argv.includes('--vermelhos')){
    for(const [id,css,aceita] of [
     ['menu','#nav-principal { flex-direction:column !important; }',v=>v.menuUmaLinha],
     ['dobra','.pais-temas { margin-top:1000px !important; }',v=>portaInteira(v,lang)],
     ['largura','.pais-temas { width:60% !important; }',larguraInteira],
    ]){
     const estilo=await pg.addStyleTag({content:css});
     await pg.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
     const plantada=await pg.evaluate(medir);
     regista(`planta-${id}.${lang}`,!aceita(plantada),{olho:plantada.olho.bottom,conteudo:plantada.conteudo.width,temas:plantada.temas.width,grelha:plantada.grelha.width});
     await estilo.evaluate(el=>el.remove());
     /* A ancoragem do navegador pode deslocar a página quando o espaço da
        planta desaparece. A porta mede sempre o primeiro ecrã, a partir do topo. */
     await pg.evaluate(()=>{scrollTo(0,0);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
     const reposta=await pg.evaluate(medir);
     regista(`reposicao-${id}.${lang}`,portaInteira(reposta,lang)&&larguraInteira(reposta),'forma reposta');
    }
   }
  }
  await ctx.close();
 }
 const j=process.argv.indexOf('--json');if(j!==-1)await fs.writeFile(process.argv[j+1],JSON.stringify(resultados,null,2)+'\n');
 for(const r of resultados)console.log(`${r.passou?'OK':'FALHA'} ${r.id} ${JSON.stringify(r.medida)}`);
 if(resultados.some(r=>!r.passou))process.exitCode=1;
}finally{await browser.close();await new Promise(r=>server.close(r));}
