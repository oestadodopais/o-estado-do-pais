/** As duas formas do nome de uma linha exigem declaração de língua. */
export function conferirRotulosDaLingua(linhas,declaradas) {
 const rotulos=new Map(),erros=[];
 for(const c of linhas)for(const n of [c.name,c.name_en]) {
  if(n===null||n===undefined||String(n)==='')continue;
  const r=String(n);rotulos.set(r,(rotulos.get(r)??0)+1);
 }
 for(const [r,n] of rotulos)if(!Object.hasOwn(declaradas,r))erros.push(`o rótulo da fonte «${r.slice(0,90)}» (${n} linha(s)) não tem língua declarada em src/i18n/lingua-dos-titulos.mjs.`);
 for(const r of Object.keys(declaradas))if(!rotulos.has(r))erros.push(`a declaração de língua nomeia o rótulo «${r.slice(0,90)}», que nenhuma linha do livro-razão traz. A tabela declara o que existe.`);
 return {rotulos,erros};
}
