#!/usr/bin/env node
/** B1, peça 3: substitui a régua F1.1 da faixa, da gaveta e dos treze menus.
 * A forma antiga saiu por mandato. Números, selos e fontes continuam nos
 * portões de HTML, cartão e mapa. Esta régua mede a porta que existe agora:
 * menu numa linha, primeira fila no portátil e ausência de deslocamento.
 * --vermelhos prova em navegador o menu partido e os cartões fora da dobra. */
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
 const cards=[...document.querySelectorAll('[data-tema]')][0]?.querySelectorAll('[data-cartao-medida]')??[];
 const topo=cards[0]?.getBoundingClientRect().top;
 return {menuUmaLinha:menu.length===5 && menu.every(r=>r.width>0&&Math.abs(r.y-menu[0].y)<1),
  largura:innerWidth,documento:document.documentElement.scrollWidth,
  leitura:caixa('[data-leitura-pais]'),mapa:caixa('[data-mapa]'),
  fila:[...cards].map(c=>c.getBoundingClientRect().toJSON()).filter(c=>Math.abs(c.top-topo)<2)};
};
try{
 for(const [lang,home,theme] of [['pt','/','/temas/'],['en','/en/','/en/themes/']]){
  const ctx=await browser.newContext({viewport:{width:390,height:800},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});
  await ctx.route('**/*',r=>r.request().url().startsWith(origem)?r.continue():r.abort());
  const pg=await ctx.newPage();
  for(const rota of [home,theme]){
   await pg.goto(origem+rota,{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);
   const m=await pg.evaluate(medir);regista(`N1.${lang}.${rota}`,m.menuUmaLinha,m);regista(`N2.${lang}.${rota}`,m.documento<=m.largura,m.documento);
  }
  await pg.setViewportSize({width:1280,height:800});await pg.goto(origem+home,{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);
  const m=await pg.evaluate(medir);
  const visivel=m.leitura?.top>=0&&m.leitura.bottom<=800&&m.mapa?.top>=0&&m.mapa.bottom<=800&&m.fila.length>0&&m.fila.every(c=>c.bottom<=800);
  regista(`P1.${lang}`,visivel,m);
  if(process.argv.includes('--vermelhos')){
   await pg.addStyleTag({content:'#nav-principal { flex-direction:column !important; }'});
   await pg.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   regista(`planta-menu.${lang}`,!(await pg.evaluate(medir)).menuUmaLinha,'cinco entradas em coluna recusadas');
   await pg.addStyleTag({content:'.pais-temas { margin-top:1000px !important; }'});
   await pg.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   regista(`planta-dobra.${lang}`,(await pg.evaluate(medir)).fila.every(c=>c.bottom>800),'fila fora do primeiro ecrã recusada');
  }
  await ctx.close();
 }
 const j=process.argv.indexOf('--json');if(j!==-1)await fs.writeFile(process.argv[j+1],JSON.stringify(resultados,null,2)+'\n');
 for(const r of resultados)console.log(`${r.passou?'OK':'FALHA'} ${r.id} ${JSON.stringify(r.medida)}`);
 if(resultados.some(r=>!r.passou))process.exitCode=1;
}finally{await browser.close();await new Promise(r=>server.close(r));}
