import {emEnsaio} from '../../site.config.mjs';
// LAR1: a largura pertence à página, mesmo quando uma tabela corre por dentro.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {matchPath} from '../../src/lib/routes.mjs';
const rotasDaHistoria = () => emEnsaio() ? ['/livro-razao/oe-2027-saude-contrato-programa-acss/','/en/ledger/oe-2027-saude-contrato-programa-acss/'] : ['/correcoes/','/en/corrections/'];
export const LARGURAS = [390,768,1024,1280,1600];
export function amostraDist(dist) {
  const familias = new Map([['/', ['/']], ['/en', ['/en/']]]), documentos = [];
  function andar(pasta, relativo='') {
    for (const e of fs.readdirSync(pasta,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))) {
      if (!e.isDirectory() || ['_astro','pagefind','registos'].includes(e.name)) continue;
      const rel = relativo+'/'+e.name, ficheiro = path.join(pasta,e.name,'index.html');
      if (fs.existsSync(ficheiro)) {
        const seg = rel.split('/').filter(Boolean);
        const chave = seg.map((s,i)=>i===0 || (seg[0]==='en' && i===1) ? s : '*').join('/');
        const paginas = familias.get(chave) ?? [];
        if (paginas.length<2) paginas.push(rel+'/');
        familias.set(chave,paginas);
        if (matchPath(rel)?.key==='documento') documentos.push(rel+'/');
      }
      andar(path.join(pasta,e.name),rel);
    }
  }
  andar(dist);
  const paginas = [...new Set([...familias.values()].flat().concat(documentos))];
  for (const rota of paginas) assert(fs.existsSync(path.join(dist,rota,'index.html')),`Página ausente: ${rota}`);
  assert(documentos.length,'Nenhum documento dos estudos encontrado');
  return {familias:Object.fromEntries(familias), documentos, paginas};
}
export async function medirPagina(page, origem, rota, largura, planta=false) {
  const resposta = await page.goto(origem+rota,{waitUntil:'load',timeout:30000});
  assert.equal(resposta?.status(),200,`${rota}: resposta diferente de 200`);
  await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
  if (planta) await page.evaluate(()=>{
    const valores=[...document.querySelectorAll('[data-correcao-campo="old_value"], [data-correcao-campo="new_value"]')];
    const longo=valores.sort((a,b)=>b.textContent.length-a.textContent.length)[0];
    if (!longo || longo.textContent.trim().length<100) throw Error('Planta sem valor textual longo real');
    longo.style.setProperty('white-space','nowrap','important');
  });
  if(emEnsaio() && ['/correcoes/','/en/corrections/'].includes(rota)) assert.equal(await page.locator('[data-mudanca]').count(),0,`${rota}: registo deve estar vazio em ensaio`);
  const medida = await page.evaluate(({rota,largura})=>{
    const sw=document.documentElement.scrollWidth;
    const causas=sw>largura ? [...document.querySelectorAll('body *')].filter(el=>el.children.length===0 && el.getBoundingClientRect().right>largura).slice(0,12).map(el=>({elemento:el.tagName.toLowerCase(),classe:el.getAttribute('class')??'',whiteSpace:getComputedStyle(el).whiteSpace})) : [];
    const tabelas=[...document.querySelectorAll('[data-oedp-moldura] table')].filter(el=>el.scrollWidth>el.clientWidth+1).map(el=>({largura:el.clientWidth,conteudo:el.scrollWidth,overflow:getComputedStyle(el).overflowX}));
    const ocultos=[...document.querySelectorAll(rota.includes('/livro-razao/') || rota.includes('/ledger/') ? '.vh' : '.registo-mudanca .vh')];
    const textoOculto={quantidade:ocultos.length,whiteSpace:[...new Set(ocultos.map(el=>getComputedStyle(el).whiteSpace))]};
    return {pagina:rota,largura,sw,causas,tabelas,textoOculto};
  },{rota,largura});
  if (rotasDaHistoria().includes(rota)) {
    assert(medida.textoOculto.quantidade>0,`${rota}: falta texto oculto no registo`);
    assert.deepEqual(medida.textoOculto.whiteSpace,['nowrap'],`${rota}: o texto oculto perdeu o nowrap`);
  }
  return medida;
}
async function correr() {
  const inicio=performance.now(), args=process.argv.slice(2);
  const dist=fs.realpathSync(process.env.OEDP_DIST??'dist');
  const planta=args.includes('--planta');
  const saida=args.includes('--json') ? args[args.indexOf('--json')+1] : process.env.OEDP_LARGURA_JSON;
  const amostra=amostraDist(dist), resultados=[], falhas=[];
  amostra.paginas=[...new Set([...amostra.paginas,...rotasDaHistoria()])];
  const tipos={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.webp':'image/webp'};
  const servidor=http.createServer((req,res)=>{
    try {
      let f=path.resolve(dist,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
      if (fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
      f=fs.realpathSync(f);
      if (!f.startsWith(dist+path.sep)) throw Error('Fora da construção');
      res.setHeader('content-type',tipos[path.extname(f)]??'application/octet-stream');
      fs.createReadStream(f).pipe(res);
    } catch {res.writeHead(404).end();}
  });
  let navegador;
  try {
    await new Promise((resolve,reject)=>{servidor.once('error',reject);servidor.listen(0,'127.0.0.1',resolve);});
    const origem=`http://127.0.0.1:${servidor.address().port}`;
    navegador=await chromium.launch({headless:true});
    const tarefas=(planta?[390]:LARGURAS).flatMap(largura=>(planta?rotasDaHistoria():amostra.paginas).map(rota=>({rota,largura})));
    // Quatro páginas reutilizadas evitam abrir um processo ou contexto por medida.
    await Promise.all(Array.from({length:4},async()=>{
      const contexto=await navegador.newContext({viewport:{width:390,height:900},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});
      await contexto.route('**/*',r=>new URL(r.request().url()).origin===origem?r.continue():r.abort());
      const page=await contexto.newPage();
      for(let tarefa;(tarefa=tarefas.shift());) {
        const {rota,largura}=tarefa;
        try {
          await page.setViewportSize({width:largura,height:900});
          const r=await medirPagina(page,origem,rota,largura,planta);
          resultados.push(r);
          if(r.sw>largura) falhas.push(`${rota}: ${r.sw} > ${largura}`);
        } catch(e) {
          resultados.push({pagina:rota,largura,erro:e.message.replaceAll(dist,'<dist>').replaceAll(origem,'<origem-local>')});
          falhas.push(`${rota} a ${largura}: medição falhou`);
        }
      }
      await contexto.close();
    }));
    if(args.includes('--prova')) {
      const contexto=await navegador.newContext({viewport:{width:390,height:900}});
      const page=await contexto.newPage();
      for(const rota of rotasDaHistoria()) {
        const vermelha=await medirPagina(page,origem,rota,390,true);
        assert(vermelha.sw>390,`A planta nowrap não foi detetada: ${rota}`);
        const verde=await medirPagina(page,origem,rota,390);
        assert(verde.sw===390,`O controlo sem planta não ficou verde: ${rota}`);
        console.log(JSON.stringify({pagina:rota,largura:390,documento:verde.sw,textoOculto:verde.textoOculto}));
      }
      await contexto.close();
      console.log('PLANTA: nowrap num valor longo real recusado nas duas línguas; releitura sem planta verde.');
    }
  } finally {
    await navegador?.close();
    await new Promise(r=>servidor.close(r));
  }
  resultados.sort((a,b)=>a.pagina.localeCompare(b.pagina)||a.largura-b.largura);
  const recibo={ok:falhas.length===0,planta,segundos:Number(((performance.now()-inicio)/1000).toFixed(3)),familias:Object.keys(amostra.familias).length,documentos:amostra.documentos.length,paginas:new Set(resultados.map(r=>r.pagina)).size,medidas:resultados.length,amostra,resultados,falhas};
  if(saida){fs.mkdirSync(path.dirname(saida),{recursive:true});fs.writeFileSync(saida,JSON.stringify(recibo,null,2)+'\n');}
  console.log(`Largura: ${recibo.familias} famílias, ${recibo.documentos} documentos, ${recibo.paginas} páginas, ${recibo.medidas} medidas, ${falhas.length} falhas, ${recibo.segundos} s.`);
  for(const f of falhas.slice(0,20)) console.error(f);
  process.exitCode=recibo.ok?0:1;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) await correr();
