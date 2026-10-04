/** Primeira página nas duas edições e cinco larguras, sobre a cabeça construída.
 * Copiado o método do captor R3: servidor efémero, pedidos só locais e tipos prontos. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { WORKS } from '../../../../src/data/studies.mjs';
const pasta='design/especime-v3/medicoes/h2-2026-10-04';
const saida='design/especime-v3/capturas/h2-2026-10-04';
const destino=process.env.OEDP_CAPTURAS ?? saida;
const medidasDestino=process.env.OEDP_MEDICOES ?? pasta;
const dist=path.resolve('dist');
const cabeca=process.env.OEDP_MEDICOES ? execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim() : (await fs.readFile(path.join(pasta,'portoes/cabeca'),'utf8')).trim();
const estado=execFileSync('git',['status','--porcelain','--untracked-files=no'],{encoding:'utf8'});
if(process.env.OEDP_EXIGIR_ARVORE_LIMPA==='1'&&estado)throw Error('A captura exige uma árvore seguida limpa.');
const delta=execFileSync('git',['diff','--name-only',cabeca,'HEAD'],{encoding:'utf8'}).trim();
if(delta&&delta.split('\n').some(f=>!f.startsWith(pasta+'/')&&!f.startsWith(saida+'/')))throw Error('Há código posterior à cabeça conferida.');
const versao=JSON.parse(await fs.readFile(path.join(dist,'version.json'),'utf8'));
if(versao.commit!==cabeca)throw Error('A construção não é desta cabeça.');
const larguras=[390,768,1024,1280,1600];
const tipos={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.webp':'image/webp'};
const servidor=http.createServer(async(req,res)=>{
 try {
  let f=path.resolve(dist,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(f!==dist&&!f.startsWith(dist+path.sep))throw Error('Caminho inválido');
  if((await fs.stat(f)).isDirectory())f=path.join(f,'index.html');
  res.setHeader('Content-Type',tipos[path.extname(f)]??'application/octet-stream');
  res.end(await fs.readFile(f));
 }catch{res.writeHead(404).end();}
});
await fs.mkdir(destino,{recursive:true});
await new Promise(r=>servidor.listen(0,'127.0.0.1',r));
const origem=`http://127.0.0.1:${servidor.address().port}`;
const navegador=await chromium.launch();
const resultados=[],problemas=[];
try {
 for(const lang of ['pt','en']) for(const largura of larguras) {
  const contexto=await navegador.newContext({viewport:{width:largura,height:900},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});
  await contexto.route('**/*',r=>r.request().url().startsWith(origem)?r.continue():r.abort());
  const page=await contexto.newPage();
  page.on('pageerror',e=>problemas.push(`${lang}/${largura}: ${e.message}`));
  const resposta=await page.goto(origem+(lang==='pt'?'/':'/en/'),{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const medidas=await page.evaluate(()=>({
   janela:innerWidth,documento:document.documentElement.scrollWidth,altura:document.documentElement.scrollHeight,
   estudos:[...document.querySelectorAll('#trabalhos [data-estudo]')].map(e=>({slug:e.getAttribute('data-estudo'),marca:e.querySelector('[data-estudo-em-curso]')?.textContent??null})),
   marcas:document.querySelectorAll('[data-estudo-em-curso]').length,
   ligacoes_encaixadas:document.querySelectorAll('a a').length,
  }));
  const ano=WORKS.find(w=>w.slug===medidas.estudos[0]?.slug)?.emCurso?.ate?.slice(0,4);
  if(resposta.status()!==200||medidas.documento>largura||medidas.estudos.length!==3||medidas.marcas!==1||medidas.estudos[0].marca!==`${lang==='pt'?'em curso até':'ongoing until'} ${ano}`)problemas.push(`${lang}/${largura}: a página não cumpre as medidas.`);
  const ficheiro=`${saida}/depois-primeira-${lang}-${largura}.png`;
  const bytes=await page.screenshot({path:path.join(destino,path.basename(ficheiro)),fullPage:true});
  resultados.push({ficheiro,lang,largura,medidas,sha256:createHash('sha256').update(bytes).digest('hex')});
  // Um recorte da alteração permite ler a data e a marca em tamanho natural.
  const recorte=`${saida}/depois-estudos-${lang}-${largura}.png`;
  const recorteBytes=await page.locator('#trabalhos').screenshot({path:path.join(destino,path.basename(recorte))});
  resultados.push({ficheiro:recorte,lang,largura,tipo:'recorte',sha256:createHash('sha256').update(recorteBytes).digest('hex')});
  await contexto.close();
 }
}finally{await navegador.close();servidor.close();}
await fs.writeFile(`${medidasDestino}/capturas.json`,JSON.stringify({cabeca,estado,larguras,resultados,problemas},null,2)+'\n');
console.log(`${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode=problemas.length?1:0;
