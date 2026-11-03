/** Datas e nomes portugueses conservam o texto declarado da entrada. */
/** @param {{frase:Record<string,string>,datas?:Record<string,string>,partes?:Record<string,any[]>}} entrada @param {string} lang */
export function partesDaCorrecao(entrada,lang){
 if(entrada.partes?.[lang])return entrada.partes[lang];
 const partes=[],nomes=lang==='en'?['Partido Socialista','Unidade Técnica de Apoio Orçamental','pelo menos']:[];
 const re=/\d+|Partido Socialista|Unidade Técnica de Apoio Orçamental|pelo menos/g;let inicio=0;
 for(const m of entrada.frase[lang].matchAll(re)){
  if(m.index>inicio)partes.push(entrada.frase[lang].slice(inicio,m.index));
  const id=entrada.datas?.[m[0]];
  partes.push(id?{data:{id,campo:'reference_date',valor:m[0]}}:nomes.includes(m[0])?{termo:m[0],lingua:'pt-PT'}:m[0]);inicio=m.index+m[0].length;
 }
 if(inicio<entrada.frase[lang].length)partes.push(entrada.frase[lang].slice(inicio));return partes;
}
