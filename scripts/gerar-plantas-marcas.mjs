/** Escolhe um exemplo isolado por marca; a ausência no dist fica explícita. */
import fs from 'node:fs';
import {MARCAS, lerPaginas, marcasDaFrase} from './frases-com-afirmacao.mjs';
const paginas=lerPaginas(process.argv[2]??'dist');
const frases=paginas.flatMap(p=>p.blocos.flatMap(b=>b.frases.map(frase=>({frase,rota:p.rota,lingua:p.lingua}))));
const sintetica=m=>{
  if(m.tipo==='leitura')return m.lingua==='pt'?'O valor é este (inferência).':'This is the value (inference).';
  if(m.expressao.startsWith('«'))return '«Uma declaração bastante longa».';
  if(m.expressao.startsWith('“'))return '“A sufficiently long quotation”.';
  if(m.expressao.startsWith('"'))return '"A sufficiently long quotation".';
  if(m.expressao.includes('per\\s'))return 'The value per OECD table.';
  let v=m.expressao.replace(/^\(\?<\!\[\\p\{L\}\]\)\(\?:/,'').replace(/\)\(\?!\[\\p\{L\}\]\)$/,'');
  if(v.startsWith('segundo'))v='segundo';
  v=v.replace(/\(\?<\!mecanismo de \)\(\?<\!sistema de \)/,'').replace('d(?:e|o|a|os|as)','de').replace('motivad[oa]s?','motivado').replace(/s\?/g,'s');
  return `A fonte ${v} elementos documentados.`;
};
const isoladas=new Map();
for(const f of frases) {const ids=marcasDaFrase(f.frase,f.lingua);if(ids.length===1&&!isoladas.has(ids[0]))isoladas.set(ids[0],f);}
const casos=MARCAS.map(m=>{
  const f=isoladas.get(m.id);
  const frase=f?.frase??sintetica(m);
  if(JSON.stringify(marcasDaFrase(frase,m.lingua))!==JSON.stringify([m.id]))throw new Error('planta não isola '+m.id+': '+frase);
  return {marca:m.id,lingua:m.lingua,frase,origem:f?'dist':'sintética',...(f?{rota:f.rota}:{razao:'Não há frase do dist apanhada apenas por esta marca.'})};
});
fs.writeFileSync('tests/leituras/frases-marcas-plantas.json',JSON.stringify(casos,null,2)+'\n');
console.log(JSON.stringify({marcas:casos.length,reais:casos.filter(c=>c.origem==='dist').length,sinteticas:casos.filter(c=>c.origem==='sintética').length}));
