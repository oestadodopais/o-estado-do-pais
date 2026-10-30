/** V2-b: caminhos reais por clique, no telefone, sobre a construção local. */
import { listagensDoInicio } from '../../src/lib/listagens-do-inicio.mjs';
import { dossieDaPeca } from '../../src/lib/dossies.mjs';
import { routePath } from '../../src/lib/routes.mjs';
export async function conferirToques(abre, origem) {
 const resultados=[];
 for(const lang of ['pt','en']) {
  const inicio=lang==='pt'?'/':'/en/';
  const discussao=lang==='pt'?'/o-que-se-discute/':'/en/under-discussion/';
  const explicacao=lang==='pt'?'/explicacoes/dinheiro-do-estado-2026/':'/en/explainers/dinheiro-do-estado-2026/';
  const {ctx,pagina}=await abre(inicio,390);
  try {
   const listas=listagensDoInicio(lang),dossie=dossieDaPeca('discussao','saude-no-orcamento');
   const seccoes={novidades:'[data-novidades]',discussao:'[data-discussao-inicio]',perceber:'[data-para-perceber]',estudos:'#trabalhos',integracao:'[data-integracao-do-inicio]'};
   const primeira=dossie&&Object.keys(seccoes).find(s=>listas[s].some(e=>e.tipo==='dossie'&&e.dossie.slug===dossie.slug));
   if(dossie&&!primeira)throw Error('V2B DO2: o dossiê do item não tem lugar na seleção');
   const selector=primeira?`${seccoes[primeira]} a[href="${routePath('dossie',lang,{slug:dossie.slug})}"]`:'[data-discussao-inicio] h2 a';
   const conferirPorta=async()=>{
    const erros=[];
    if(await pagina.locator('[data-discussao-inicio]').count()!==Number(listas.discussao.length>0))erros.push('V2B DO2: presença do bloco diferente da seleção');
    if(await pagina.locator(selector).count()!==1)erros.push('V2B DO2: porta inicial ausente ou repetida');
    if(primeira==='novidades'&&await pagina.locator(selector).count()===1) {
     const forma=await pagina.locator(selector).evaluate(a=>a.parentElement.children.length===3&&a.parentElement.children[2]===a&&a.parentElement.children[0].tagName==='TIME'&&a.querySelectorAll('[data-prova]').length===1);
     if(!forma)erros.push('DO4: a porta tocada não é a terceira coluna com contagem');
    }
    return erros;
   };
   if(primeira==='novidades') {
    await pagina.locator(selector).evaluate(a=>a.querySelector('[data-prova]').remove());
    if(!(await conferirPorta()).some(e=>e.startsWith('DO4:')))throw Error('DO4: planta da porta sem contagem não mordeu');
    await pagina.goto(origem+inicio);
   }
   const controlo=await conferirPorta();if(controlo.length)throw Error(controlo.join('; '));
   let plantas=0;
   // Só a cópia no navegador muda. A presença esperada vem da seleção comum.
   await pagina.evaluate(presente=>{
    if(presente)document.querySelector('[data-discussao-inicio]').remove();
    else document.querySelector('main').insertAdjacentHTML('beforeend','<section data-discussao-inicio></section>');
   },listas.discussao.length>0);
   if(!(await conferirPorta()).includes('V2B DO2: presença do bloco diferente da seleção'))throw Error('V2B DO2: a planta da presença do bloco não mordeu');
   plantas++;
   await pagina.goto(origem+inicio);
   await pagina.locator(selector).evaluate(el=>el.remove());
   if(!(await conferirPorta()).includes('V2B DO2: porta inicial ausente ou repetida'))throw Error('V2B DO2: a planta da porta retirada não mordeu');
   plantas++;
   await pagina.goto(origem+inicio);
   if((await conferirPorta()).length)throw Error('V2B DO2: a página reposta não passou');
   console.log(`V2B DO2 ${lang}: ${plantas} plantas da presença e da porta recusadas.`);
   await pagina.locator(selector).click();
   await pagina.locator('.discussao-sumario [data-discussao-porta="saude-no-orcamento"]').click();
   if(new URL(pagina.url()).hash!=='#saude-no-orcamento'||new URL(pagina.url()).pathname.replace(/\/$/,'')!==discussao.replace(/\/$/,''))throw Error('V2B toques: a primeira página não chegou ao item');
   resultados.push({lang,de:'primeira página',para:'saude-no-orcamento',toques:2});
   await pagina.goto(origem+explicacao);
   await pagina.locator('[data-discussao-integracao="saude-no-orcamento"] a').click();
   if(new URL(pagina.url()).hash!=='#saude-no-orcamento')throw Error('V2B toques: a explicação não chegou ao item');
   resultados.push({lang,de:'explicação',para:'saude-no-orcamento',toques:1});
   const portas=await pagina.locator('[data-discussao] .src-chip, [data-discussao] a[data-discussao-literal="attributed_to"], [data-discussao] a[data-discussao-periodo]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')))]);
   for(const href of portas){
    if(!href)throw Error('V2B toques: selo sem destino');
    await pagina.goto(origem+discussao);
    await pagina.locator(`[data-discussao] a[href="${href}"]`).first().click();
    if(new URL(pagina.url()).pathname.replace(/\/$/,'')!==href.replace(/\/$/,''))throw Error('V2B toques: recibo errado');
    if(await pagina.locator('main h1').count()!==1)throw Error('V2B toques: recibo ausente');
    resultados.push({lang,de:'item',para:href,toques:1});
   }
  } finally {await ctx.close();}
 }
 return resultados;
}
