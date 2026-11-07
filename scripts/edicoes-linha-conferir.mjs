/** ED2: expectativas lidas do manifesto, sem importar o renderizador. */
import fs from 'node:fs';
import {load} from 'js-yaml';
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
const forma=d=>d.split('-').reverse().join('.');
export const manifestoEd2=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
export function versoesNoManifesto(slug,lang,manifesto=manifestoEd2){return manifesto.edicoes.find(e=>e.slug===slug&&e.lang===lang)?.edicoes??[];}
export function rotasNoManifesto(slug,lang,manifesto=manifestoEd2){
 const vs=versoesNoManifesto(slug,lang,manifesto),base=`${lang==='pt'?'/estudos':'/en/studies'}/${slug}/${lang==='pt'?'documento':'document'}`;
 return vs.map((v,i)=>base+(i===vs.length-1?'':'/'+v.data));
}
export function mudancasNoManifesto(slug,lang,manifesto=manifestoEd2){
 const vs=versoesNoManifesto(slug,lang,manifesto).slice(1);
 return ['atualizacao','correcao'].flatMap(n=>{const v=vs.findLast(v=>n==='atualizacao'?v.natureza==='atualizacao':v.natureza===undefined);return v?[{data:v.data,natureza:n}]:[];}).sort((a,b)=>a.data.localeCompare(b.data));
}
export function conferirLinhaDasEdicoes(root,manifesto,slug,lang,data=null){
 const vs=versoesNoManifesto(slug,lang,manifesto),linhas=root?.querySelectorAll('[data-edicoes-linha]')??[],erros=[];
 if(vs.length<2)return linhas.length||root?.querySelector('[data-edicao-lista-data]')?['ED2 linha: edição única com linha']:[];
 if(linhas.length!==1)return ['ED2 linha: falta a linha completa'];
 const linha=linhas[0],itens=linha.querySelectorAll('[data-edicoes-item]'),rotas=rotasNoManifesto(slug,lang,manifesto),pt=lang==='pt';
 const esperados=vs.map((v,i)=>{
  const natureza=i===0?(pt?'primeira':'first'):v.natureza==='atualizacao'?(pt?'atualização':'update'):(pt?'correção':'correction');
  return `${forma(v.data)} (${natureza}${i===vs.length-1?(pt?', atual':', current'):''})`;
 });
 if(normal(linha.textContent)!==`${pt?'Edições:':'Editions:'} ${esperados.join(' · ')}`||itens.length!==vs.length)erros.push('ED2 linha: edições, naturezas ou ordem incorretas');
 for(const [i,v] of vs.entries()){
  const item=itens[i],t=item?.querySelector('time'),porta=item?.querySelector('a'),corrente=item?.querySelector('[aria-current]');
  if(v.natureza!==undefined&&v.natureza!=='atualizacao')erros.push(`ED2 natureza desconhecida: ${v.natureza}`);
  if(!item||normal(item.textContent)!==esperados[i]||t?.getAttribute('datetime')!==v.data||normal(t?.textContent)!==forma(v.data))erros.push(`ED2 linha: edição incorreta ${v.data}`);
  if(data===v.data){if(porta||corrente?.getAttribute('aria-current')!=='page'||!corrente?.querySelector('time'))erros.push(`ED2 linha: página corrente incorreta ${v.data}`);}
  else if(corrente||porta?.getAttribute('href')!==rotas[i]||normal(porta?.textContent)!==forma(v.data))erros.push(`ED2 linha: porta incorreta ${v.data}`);
 }
 if(root.querySelectorAll('[data-edicao-lista-data]').length!==vs.length)erros.push('ED2 linha: número de datas incorreto');
 if(root.querySelectorAll('a[href]').length!==vs.length-(data?1:0)||linha.querySelectorAll('[aria-current]').length!==(data?1:0))erros.push('ED2 linha: número de portas incorreto');
 return erros;
}
export function conferirMudancasDoCabecalho(root,slug,lang,manifesto=manifestoEd2){
 const esperadas=mudancasNoManifesto(slug,lang,manifesto),marcas=root?.querySelectorAll('[data-estudo-atualizacao], [data-estudo-correcao]')??[],erros=[];
 if(marcas.length!==esperadas.length)erros.push('ED2 datas: falta ou sobra atualização/correção');
 for(const [i,m] of esperadas.entries()){
  const el=marcas[i],atributo=m.natureza==='atualizacao'?'data-estudo-atualizacao':'data-estudo-correcao';
  const rotulo=m.natureza==='atualizacao'?(lang==='pt'?'atualizado a':'updated on'):(lang==='pt'?'corrigido a':'corrected on');
  const irmaos=el?.parentNode?.childNodes??[];
  const anterior=irmaos.slice(0,irmaos.indexOf(el)).findLast(n=>n.nodeType!==3||normal(n.textContent));
  if(!el?.hasAttribute(atributo)||el.hasAttribute(m.natureza==='atualizacao'?'data-estudo-correcao':'data-estudo-atualizacao')||el.getAttribute('datetime')!==m.data||normal(el.textContent)!==forma(m.data)||normal(anterior?.textContent)!==rotulo)erros.push(`ED2 datas: atualização/correção ou data incorreta ${m.data}`);
 }
 return erros;
}
