import {parse} from 'node-html-parser';
const root=process.cwd();
const {manifestoDosRegistos,registoDaEdicao}=await import(root+'/src/lib/registos.mjs');
const {pecasDoCorpo}=await import(root+'/src/lib/registo-html.mjs');
const {linhaDoSitioDoEstudo}=await import(root+'/src/lib/cruzamento.mjs');
for(const [key,entry] of Object.entries(manifestoDosRegistos().registos)){
 const [slug,lang]=key.split('/'),registo=registoDaEdicao(slug,lang),resolve=linhaDoSitioDoEstudo(entry.rh_study,entry.rh_origens??{});
 const doc=parse(pecasDoCorpo({registo,chave:key,linhaDoSitio:resolve,rotuloDaPorta:lang==='pt'?'Fonte':'Source'}).map(p=>p.html??'').join(''));
 for(const block of registo.blocks){const refs=block.source_rows??[];if(!refs.length)continue;
  const links=doc.querySelectorAll(`[data-fontes-da-unidade="${key}#${block.i}"] a`);
  refs.forEach((row,i)=>{const l=links[i]?.textContent.trim();if(!l||/^(Fonte|Source)$/.test(l))console.log(key,block.i,JSON.stringify(row),resolve(row),JSON.stringify(l));});}
}
