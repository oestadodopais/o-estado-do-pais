/** PAI2: geometria e plantas no navegador, apenas pelo escrivão. Sem capturas. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {chromium} from 'playwright';
const modo=process.argv[2]??'alvos';
assert(['alvos','sobreposicao'].includes(modo));
const dist=path.resolve(process.env.OEDP_DIST??'dist');
const server=http.createServer((req,res)=>{
 try{
  let file=path.resolve(dist,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
  if(file!==dist&&!file.startsWith(dist+path.sep))throw Error('fora');
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  const tipo={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'}[path.extname(file)];
  if(tipo)res.setHeader('Content-Type',tipo);res.end(fs.readFileSync(file));
 }catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true});
const url=`http://127.0.0.1:${server.address().port}`;
async function medir(page){
 return page.evaluate((modo)=>{
  const erros=[];
  if(document.documentElement.scrollWidth>innerWidth+1)erros.push('página mais larga');
  const alvos=[...document.querySelectorAll('[data-quadro-destino], [data-aviso-revisao] a')];
  for(const el of alvos){
   el.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
   const r=el.getBoundingClientRect();
   if(modo==='alvos'&&(r.height<43.9||r.width<43.9))erros.push('alvo pequeno');
   if(modo==='alvos')for(const [x,y] of [[r.x+r.width/2,r.y+r.height/2],[r.x+r.width/2,r.y+Math.min(20,r.height/2)]]){
    const hit=document.elementFromPoint(x,y);if(!hit||!el.contains(hit))erros.push('alvo tapado');
   }
  }
  if(modo==='sobreposicao')for(const row of document.querySelectorAll('[data-quadro-medida]')){
   const cells=[...row.querySelectorAll('th,td')].map(n=>n.getBoundingClientRect());
   for(let a=0;a<cells.length;a++)for(let b=a+1;b<cells.length;b++){
    const x=Math.min(cells[a].right,cells[b].right)-Math.max(cells[a].left,cells[b].left),y=Math.min(cells[a].bottom,cells[b].bottom)-Math.max(cells[a].top,cells[b].top);
    if(x>1&&y>1)erros.push('células sobrepostas');
   }
   if(innerWidth<600){
    if(cells.some(c=>Math.abs(c.left-cells[0].left)>1))erros.push('células sem empilhar');
    for(const n of row.querySelectorAll('.quadro-rotulo'))if(getComputedStyle(n).display==='none')erros.push('rótulo escondido');
   }
  }
  return {erros:[...new Set(erros)],alvos:alvos.length};
 },modo);
}
let combinacoes=0,plantas=0;
try{
 for(const largura of [390,768,1024,1280,1600])for(const rota of ['/temas/','/en/themes/','/estado-e-economia/','/en/state-and-economy/','/uniao-europeia/','/en/european-union/','/livro-razao/','/en/ledger/','/','/en/','/estudos/','/en/studies/','/livro-razao/series/sobrecarga-do-custo-da-habitacao-2025-paises','/en/ledger/series/sobrecarga-do-custo-da-habitacao-2025-paises']){
  const page=await browser.newPage({viewport:{width:largura,height:1000}});
  assert.equal((await page.goto(url+rota)).status(),200,`página da prova ausente: ${rota}`);await page.evaluate(()=>document.fonts.ready);
  const r=await medir(page);assert.deepEqual(r.erros,[],`${modo} ${rota} ${largura}`);assert(r.alvos>0,`sem alvos: ${rota} a ${largura}`);combinacoes++;
  await page.close();
 }
 for(const rota of ['/temas/','/en/themes/']){
  const page=await browser.newPage({viewport:{width:390,height:1000}});assert.equal((await page.goto(url+rota)).status(),200,`página da prova ausente: ${rota}`);await page.evaluate(()=>document.fonts.ready);
  assert.deepEqual((await medir(page)).erros,[]);
  if(modo==='alvos'){
   await page.addStyleTag({content:'[data-quadro-destino] { min-height: 1px !important; height: 8px !important; font-size: 6px !important; overflow: hidden !important; }'});
   assert((await medir(page)).erros.includes('alvo pequeno'));
  }else{
   await page.addStyleTag({content:'[data-quadro-medida] { position: relative !important; } [data-quadro-coluna="anterior"] { position: absolute !important; inset: 0 !important; }'});
   assert((await medir(page)).erros.includes('células sobrepostas'));
  }
  await page.reload();await page.evaluate(()=>document.fonts.ready);
  const reposta=await medir(page);assert(reposta.alvos>0);assert.deepEqual(reposta.erros,[],'controlo reposto');
  plantas++;await page.close();
 }
 console.log(`PAI2 ${modo}: ${combinacoes} combinações verdes; ${plantas} plantas recusadas; sem capturas.`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
