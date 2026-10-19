/** V2-b: caminhos reais por clique, no telefone, sobre a construção local. */
export async function conferirToques(abre, origem) {
 const resultados=[];
 for(const lang of ['pt','en']) {
  const inicio=lang==='pt'?'/':'/en/';
  const discussao=lang==='pt'?'/o-que-se-discute/':'/en/under-discussion/';
  const explicacao=lang==='pt'?'/explicacoes/dinheiro-do-estado-2026/':'/en/explainers/dinheiro-do-estado-2026/';
  const {ctx,pagina}=await abre(inicio,390);
  try {
   await pagina.locator('[data-discussao-inicio] h2 a').click();
   await pagina.locator('.discussao-sumario [data-discussao-porta="saude-no-orcamento"]').click();
   if(new URL(pagina.url()).hash!=='#saude-no-orcamento')throw Error('V2B toques: a primeira página não chegou ao item');
   resultados.push({lang,de:'primeira página',para:'saude-no-orcamento',toques:2});
   await pagina.goto(origem+explicacao);
   await pagina.locator('[data-discussao-integracao="saude-no-orcamento"] a').click();
   if(new URL(pagina.url()).hash!=='#saude-no-orcamento')throw Error('V2B toques: a explicação não chegou ao item');
   resultados.push({lang,de:'explicação',para:'saude-no-orcamento',toques:1});
   const portas=await pagina.locator('[data-discussao] .src-chip, [data-discussao] a[data-discussao-literal="attributed_to"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')))]);
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
