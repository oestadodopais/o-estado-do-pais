/** DO4: a mesma medida nas capturas e na régua dos alvos, com plantas locais. */
export async function conferirDisposicaoNovidades(pagina, plantas=true) {
 const entradas=pagina.locator('[data-novidade^="dossie:"]');
 if(!await entradas.count())throw Error('DO4: falta a entrada do dossiê para medir');
 const resultados=[];
 for(let i=0;i<await entradas.count();i++) {
  const li=entradas.nth(i);await li.scrollIntoViewIfNeeded();
  const medir=()=>li.evaluate(el=>{
   const erros=[],[data,tipo,a]=el.children;
   if(el.children.length!==3||data.tagName!=='TIME'||!tipo.matches('.pp-novidade-tipo')||!a.matches('a[data-novidade-dossie]'))return {erros:['colunas']};
   const n=a.querySelector('.prova-valor'),s=getComputedStyle(a),v=n&&getComputedStyle(n);
   if(!v||['fontFamily','fontSize','fontWeight','color','fontVariantNumeric'].some(k=>s[k]!==v[k])||parseFloat(v.borderBottomWidth)!==0)erros.push('letra da contagem');
   const d=data.getBoundingClientRect(),t=tipo.getBoundingClientRect(),b=a.getBoundingClientRect();
   if(innerWidth>600?!(d.x<t.x&&t.x<b.x):!(b.y>=Math.max(d.bottom,t.bottom)-1))erros.push('grelha');
   const tamanho=innerWidth<1024?44:0;
   const toca=(x,y)=>{const alvo=document.elementFromPoint(x,y);return alvo===a||a.contains(alvo);};
   if(tamanho&&(!toca(b.x+b.width/2,b.y+b.height/2-21.5)||!toca(b.x+b.width/2,b.y+b.height/2+21.5)||!toca(b.x+b.width/2-21.5,b.y+b.height/2)||!toca(b.x+b.width/2+21.5,b.y+b.height/2)))erros.push('alvo de toque');
   return {erros,largura:innerWidth,filhos:el.children.length,fonte:s.fontFamily,peso:s.fontWeight,altura:b.height,alvoMinimo:tamanho};
  });
  const controlo=await medir();if(controlo.erros.length)throw Error(`DO4: ${controlo.erros.join(', ')}`);
  const recusadas=[];
  if(plantas)for(const [nome,seletor,estilo]of [
   ['letra da contagem','.prova-valor','font-family:monospace!important;font-weight:900!important;border-bottom:1px solid red!important'],
   ['grelha','a[data-novidade-dossie]','grid-column:1 / -1!important'],
   ...(controlo.alvoMinimo?[['alvo de toque','a[data-novidade-dossie]','display:block!important;min-height:0!important;height:1px!important;width:1px!important;padding:0!important;overflow:hidden!important;pointer-events:none!important']]:[]),
  ]) {
   // No telefone o título já ocupa a linha inteira; a planta da grelha inverte a data.
   const alvo=nome==='grelha'&&controlo.largura<=600?li.locator('time'):li.locator(seletor);
   const anterior=await alvo.getAttribute('style');
   await alvo.evaluate((el,s)=>el.setAttribute('style',s),nome==='grelha'&&controlo.largura<=600?'grid-row:3!important':estilo);
   const estrago=await medir();
   await alvo.evaluate((el,s)=>s===null?el.removeAttribute('style'):el.setAttribute('style',s),anterior);
   if(!estrago.erros.includes(nome))throw Error(`DO4: planta sem mordida: ${nome}`);
   recusadas.push(nome);
  }
  if((await medir()).erros.length)throw Error('DO4: reposição da página falhou');
  resultados.push({...controlo,plantas:recusadas});
 }
 return resultados;
}
