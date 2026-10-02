#!/usr/bin/env node
/** A PORTA DA PRIMEIRA PÁGINA, na forma do bloco PP1 (28.09.2026).
 *
 * Até ao PP1 esta célula media a primeira página do B1 (a leitura do país, a porta do mapa, o olho
 * e o primeiro tema no primeiro ecrã do portátil, e a grelha dos temas com a largura do conteúdo e as
 * colunas de /temas/). A leitura e os cartões saíram da primeira página, e o que a célula protege
 * muda de forma com ela, sem perder nada:
 *
 *   · N1 e N2 ficam como eram (o menu numa linha e nenhum deslize de lado), e passam a correr também
 *     nas cinco páginas das entradas, nas cinco larguras;
 *   · G1 muda de casa: a grelha dos cartões vive agora nas entradas, e cada uma tem de ter a largura
 *     do conteúdo e as mesmas colunas da página dos temas, na mesma largura;
 *   · P1 passa a ser a prova de aceitação do brief do PP1 (§1): num telefone de 390 px, nos dois
 *     primeiros ecrãs (2 × 844 px), o leitor lê «O que se passa», a data dos números mais recentes e
 *     os dois primeiros blocos inteiros (o título, a frase, o desenho e a fonte).
 *
 * --vermelhos prova que as três ainda mordem: o menu partido (N1), os blocos empurrados para baixo
 * dos dois ecrãs (P1) e a grelha de uma entrada estreitada (G1), e exige a reposição depois de cada
 * planta. --json escreve os resultados. OEDP_DIST aponta outra construção. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';
import { ENTRADAS } from '../../src/data/primeira-pagina.mjs';
const dist=path.resolve(process.env.OEDP_DIST ?? 'dist');
const tipos={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.json':'application/json','.svg':'image/svg+xml'};
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
/* A ALTURA DE UM ECRÃ DE TELEFONE, a das capturas do brief (390 × 844). */
const ECRA=844;
const medir=()=>{
 const caixa=el=>el?el.getBoundingClientRect().toJSON():null;
 const menu=[...document.querySelectorAll('#nav-principal a')].map(a=>a.getBoundingClientRect());
 const grelha=document.querySelector('main .pais-cartoes');
 const blocos=[...document.querySelectorAll('main [data-o-que-se-passa] [data-bloco]')].slice(0,2).map(b=>({
  id:b.getAttribute('data-bloco'),titulo:caixa(b.querySelector('[data-bloco-titulo]')),frase:caixa(b.querySelector('[data-bloco-frase]')),
  desenho:caixa(b.querySelector('[data-bloco-desenho]')),fonte:caixa(b.querySelector('[data-bloco-fonte]'))}));
 /* P4, 02.10.2026 (item 0 do brief P4): seis portas, com a página da União, numa linha a 390 px. */
 return {menuUmaLinha:menu.length===6 && menu.every(r=>r.width>0&&Math.abs(r.y-menu[0].y)<1),
  largura:innerWidth,documento:document.documentElement.scrollWidth,altura:document.documentElement.scrollHeight,
  menu:caixa(document.querySelector('#nav-principal')),conteudo:caixa(document.querySelector('main')),
  oQueSePassa:caixa(document.querySelector('main [data-o-que-se-passa] h2')),data:caixa(document.querySelector('main [data-numeros-mais-recentes]')),
  blocos,grelha:caixa(grelha),colunas:grelha?getComputedStyle(grelha).gridTemplateColumns:null};
};
const dentro=(c,limite)=>!!c&&c.width>0&&c.height>0&&c.top>=0&&c.bottom<=limite;
/* P1: os dois primeiros blocos inteiros, «O que se passa» e a data, nos dois primeiros ecrãs. */
const aceitacao=m=>m.menuUmaLinha&&dentro(m.oQueSePassa,2*ECRA)&&dentro(m.data,2*ECRA)&&m.blocos.length===2
 &&m.blocos.every(b=>['titulo','frase','desenho','fonte'].every(k=>dentro(b[k],2*ECRA)));
/* G1: a grelha de uma entrada tem a largura do conteúdo e as colunas da página dos temas: o mesmo número
   de colunas, cada uma com a mesma largura a menos de meio píxel. O navegador reparte a sobra das frações
   pela última coluna, e duas grelhas iguais com números de cartões diferentes dão 248,047 e 248,062 px
   na mesma coluna (medido a 1 280 px na entrada da casa): comparar as cadeias era comparar o arredondamento. */
const colunas=c=>String(c??'').split(/\s+/).filter(Boolean).map(parseFloat);
const mesmasColunas=(a,b)=>{const x=colunas(a),y=colunas(b);return x.length>0&&x.length===y.length&&x.every((v,i)=>Math.abs(v-y[i])<0.5);};
const grelhaInteira=(m,t)=>!!m.grelha&&!!m.conteudo&&Math.abs(m.grelha.width-m.conteudo.width)<1&&mesmasColunas(m.colunas,t.colunas);
const entradas=ENTRADAS.filter(e=>!('existente' in e && e.existente));
try{
 for(const [lang,home,theme] of [['pt','/','/temas/'],['en','/en/','/en/themes/']]){
  const ctx=await browser.newContext({viewport:{width:390,height:ECRA},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});
  await ctx.route('**/*',r=>r.request().url().startsWith(origem)?r.continue():r.abort());
  const pg=await ctx.newPage();
  const abre=async rota=>{await pg.goto(origem+rota,{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);await pg.evaluate(()=>scrollTo(0,0));return pg.evaluate(medir);};
  for(const largura of [390,768,1024,1280,1600]){
   await pg.setViewportSize({width:largura,height:ECRA});
   const t=await abre(theme),m=await abre(home);
   for(const [rota,v] of [[home,m],[theme,t]]){
    regista(`N1.${lang}.${largura}.${rota}`,v.menuUmaLinha,v.menu);
    regista(`N2.${lang}.${largura}.${rota}`,v.documento<=v.largura,v.documento);
   }
   for(const e of entradas){
    const rota=e.rota[lang];
    const v=await abre(rota);
    regista(`N1.${lang}.${largura}.${rota}`,v.menuUmaLinha,v.menu);
    regista(`N2.${lang}.${largura}.${rota}`,v.documento<=v.largura,v.documento);
    regista(`G1.${lang}.${largura}.${rota}`,grelhaInteira(v,t),{conteudo:v.conteudo?.width,grelha:v.grelha?.width,colunas:v.colunas,colunasDosTemas:t.colunas});
   }
   if(largura!==390)continue;
   const m390=await abre(home);
   regista(`P1.${lang}`,aceitacao(m390),{limite:2*ECRA,oQueSePassa:m390.oQueSePassa?.bottom,data:m390.data?.bottom,blocos:m390.blocos.map(b=>({id:b.id,titulo:b.titulo?.bottom,frase:b.frase?.bottom,desenho:b.desenho?.bottom,fonte:b.fonte?.bottom}))});
   if(process.argv.includes('--vermelhos')){
    const entrada=entradas[0].rota[lang];
    for(const [id,rota,css,aceita] of [
     ['menu',home,'#nav-principal { flex-direction:column !important; }',v=>v.menuUmaLinha],
     ['dobra',home,'main [data-o-que-se-passa] .pp-blocos { margin-top:1000px !important; }',aceitacao],
     ['largura',entrada,'main .pais-cartoes { width:60% !important; }',v=>grelhaInteira(v,t)],
    ]){
     await abre(rota);
     const estilo=await pg.addStyleTag({content:css});
     await pg.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
     const plantada=await pg.evaluate(medir);
     regista(`planta-${id}.${lang}`,!aceita(plantada),{blocos:plantada.blocos.map(b=>b.fonte?.bottom),conteudo:plantada.conteudo?.width,grelha:plantada.grelha?.width,menu:plantada.menuUmaLinha});
     await estilo.evaluate(el=>el.remove());
     /* A ancoragem do navegador pode deslocar a página quando o espaço da planta desaparece: a
        porta mede sempre a partir do topo. */
     await pg.evaluate(()=>{scrollTo(0,0);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
     const reposta=await pg.evaluate(medir);
     regista(`reposicao-${id}.${lang}`,aceita(reposta),'forma reposta');
    }
   }
  }
  await ctx.close();
 }
 const j=process.argv.indexOf('--json');if(j!==-1)await fs.writeFile(process.argv[j+1],JSON.stringify(resultados,null,2)+'\n');
 for(const r of resultados)console.log(`${r.passou?'OK':'FALHA'} ${r.id} ${JSON.stringify(r.medida)}`);
 if(resultados.some(r=>!r.passou))process.exitCode=1;
}finally{await browser.close();await new Promise(r=>server.close(r));}
