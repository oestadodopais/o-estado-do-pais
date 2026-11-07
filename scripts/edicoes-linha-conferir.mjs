/** ED2: expectativas lidas do manifesto, sem importar o renderizador. */
import fs from 'node:fs';
import {load} from 'js-yaml';
import {WORKS} from '../src/data/studies.mjs';
const publicacoes=JSON.parse(fs.readFileSync('src/data/datas-de-publicacao.json','utf8')).edicoes;
export function publicacaoNoPortao(slug,lang){
 const w=WORKS.find(w=>w.slug===slug),e=w?.editions.find(e=>e.lang===lang);
 return w?.publication==='declared'?(e?.date??null):(publicacoes.find(e=>e.slug===slug&&e.lang===lang)?.data??null);
}
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
const forma=d=>d.split('-').reverse().join('.');
export const manifestoEd2=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
export function versoesNoManifesto(slug,lang,manifesto=manifestoEd2){return manifesto.edicoes.find(e=>e.slug===slug&&e.lang===lang)?.edicoes??[];}
export function rotasNoManifesto(slug,lang,manifesto=manifestoEd2){
 const vs=versoesNoManifesto(slug,lang,manifesto),base=`${lang==='pt'?'/estudos':'/en/studies'}/${slug}/${lang==='pt'?'documento':'document'}`;
 return vs.map((v,i)=>base+(i===vs.length-1?'':'/'+v.data));
}
export function mudancasNoManifesto(slug,lang,manifesto=manifestoEd2){
 const todas=versoesNoManifesto(slug,lang,manifesto),publicada=publicacaoNoPortao(slug,lang);
 if(todas.length===1&&publicada&&todas[0].data>publicada)return [{data:todas[0].data,natureza:'atualizacao'}];
 const vs=todas.slice(1);
 return ['atualizacao','correcao'].flatMap(n=>{const v=vs.findLast(v=>n==='atualizacao'?v.natureza==='atualizacao':v.natureza===undefined);return v?[{data:v.data,natureza:n}]:[];}).sort((a,b)=>a.data.localeCompare(b.data));
}
/** ED3: a publicação e as versões definem os elementos, sem usar a vista. */
export function elementosDaLinha(manifesto,slug,lang,data=null,linguaPagina=lang){
 const vs=versoesNoManifesto(slug,lang,manifesto),publicada=publicacaoNoPortao(slug,lang),pt=linguaPagina==='pt';
 const rotas=rotasNoManifesto(slug,lang,manifesto);
 const itens=vs.map((v,i)=>({data:v.data,edicao:true,rota:rotas[i],
  rotulo:i===0?(v.data===publicada?(pt?'publicado a':'published on'):(pt?'primeira edição guardada a':'first edition kept on')):v.natureza==='atualizacao'?(pt?'atualizado a':'updated on'):(pt?'corrigido a':'corrected on'),
  estado:i===vs.length-1?(data===v.data?(pt?' (atual, esta edição)':' (current, this edition)'):(pt?' (atual)':' (current)')):data===v.data?(pt?' (esta edição)':' (this edition)'):''}));
 if(vs[0]?.data!==publicada)itens.unshift({data:publicada,edicao:false,rotulo:pt?'publicado a':'published on',estado:''});
 return itens;
}
export function conferirLinhaDasEdicoes(root,manifesto,slug,lang,data=null,linguaPagina=lang){
 const vs=versoesNoManifesto(slug,lang,manifesto),linhas=root?.querySelectorAll('[data-edicoes-linha]')??[],erros=[];
 if(vs.length<2)return linhas.length||root?.querySelector('[data-edicao-lista-data]')?['ED2 linha: edição única com linha']:[];
 if(linhas.length!==1)return ['ED3 linha: falta a linha completa'];
 const linha=linhas[0],itens=linha.querySelectorAll('[data-edicoes-item]'),publicada=publicacaoNoPortao(slug,lang);
 const esperados=elementosDaLinha(manifesto,slug,lang,data,linguaPagina),mudancas=mudancasNoManifesto(slug,lang,manifesto);
 const texto=e=>`${e.rotulo} ${e.data?forma(e.data):'[ausente]'}${e.estado}`;
 if(!publicada)erros.push('ED3 linha: falta a publicação declarada');
 if(data&&!vs.some(v=>v.data===data))erros.push('ED3 linha: edição corrente desconhecida');
 if(normal(root.textContent)!==esperados.map(texto).join(' · ')||itens.length!==esperados.length)erros.push('ED3 linha: datas, palavras ou ordem incorretas');
 for(const v of vs)if(v.natureza!==undefined&&v.natureza!=='atualizacao')erros.push(`ED2 natureza desconhecida: ${v.natureza}`);
 for(const [i,e] of esperados.entries()){
  const item=itens[i],t=item?.querySelector('time'),porta=item?.querySelector('a'),corrente=item?.querySelector('[aria-current]');
  if(!item||normal(item.textContent)!==texto(e)||item.querySelectorAll('time').length!==1||t?.getAttribute('datetime')!==e.data||normal(t?.textContent)!==forma(e.data??''))erros.push(`ED3 linha: data ou elemento incorreto ${e.data}`);
  if(e.edicao&&data===e.data){if(porta||corrente?.getAttribute('aria-current')!=='page'||corrente?.querySelector('time')!==t)erros.push(`ED3 linha: página corrente incorreta ${e.data}`);}
  else if(e.edicao){if(corrente||porta?.getAttribute('href')!==e.rota||normal(porta?.textContent)!==forma(e.data)||porta?.getAttribute('hreflang')!==(lang==='pt'?'pt-PT':'en'))erros.push(`ED3 linha: porta incorreta ${e.data}`);}
  else if(porta||corrente)erros.push('ED3 linha: publicação sem edição com porta');
  if(Boolean(t?.hasAttribute('data-edicao-lista-data'))!==e.edicao||t?.getAttribute('data-nonledger')!==(e.data===publicada?'data-do-repositorio':'data-editorial')||(e.data!==publicada&&t?.getAttribute('data-data-origem')!=='edicoes.data'))erros.push(`ED3 linha: origem da data incorreta ${e.data}`);
  for(const [natureza,atributo] of [['atualizacao','data-estudo-atualizacao'],['correcao','data-estudo-correcao']])if(Boolean(t?.hasAttribute(atributo))!==mudancas.some(m=>m.natureza===natureza&&m.data===e.data))erros.push(`ED3 linha: marca ${atributo} incorreta ${e.data}`);
 }
 const separadores=linha.childNodes.filter(n=>n.nodeType===1&&!n.hasAttribute('data-edicoes-item'));
 if(separadores.length!==itens.length-1||separadores.some(n=>normal(n.textContent)!=='·'||n.getAttribute('aria-hidden')!=='true')||linha.childNodes.some(n=>n.nodeType===3&&normal(n.textContent)))erros.push('ED3 linha: separador audível ou incorreto');
 if(root.querySelectorAll('time').length!==esperados.length||root.querySelectorAll('[data-edicao-lista-data]').length!==vs.length)erros.push('ED3 linha: número de datas incorreto');
 const datasNoTexto=normal(root.textContent).match(/\d{2}\.\d{2}\.\d{4}/g)??[];
 if(datasNoTexto.length!==esperados.length||new Set(datasNoTexto).size!==datasNoTexto.length)erros.push('ED3 linha: data repetida ou ausente');
 if(root.querySelectorAll('a[href]').length!==vs.length-(data?1:0)||root.querySelectorAll('[aria-current]').length!==(data?1:0))erros.push('ED3 linha: número de portas incorreto');
 return erros;
}
export function conferirMudancasDoCabecalho(root,slug,lang,manifesto=manifestoEd2,linguaPagina=lang){
 const esperadas=mudancasNoManifesto(slug,lang,manifesto),marcas=root?.querySelectorAll('[data-estudo-atualizacao], [data-estudo-correcao]')??[],erros=[];
 const vs=versoesNoManifesto(slug,lang,manifesto);
 if(vs.length===1){
  const portas=root?.querySelectorAll('a[href]')??[],publicada=publicacaoNoPortao(slug,lang),pt=linguaPagina==='pt';
  const rotulo=esperadas.length?(pt?'Edição atual':'Current edition'):publicada?(pt?'Edição tal como foi publicada':'Edition as published'):(pt?'Edição em preparação':'Edition in preparation');
  if(portas.length!==1||portas[0].getAttribute('href')!==rotasNoManifesto(slug,lang,manifesto)[0]||normal(portas[0].textContent)!==rotulo)erros.push('ED2 porta: edição única com rótulo ou destino incorreto');
 }
 if(marcas.length!==esperadas.length)erros.push('ED2 datas: falta ou sobra atualização/correção');
 for(const [i,m] of esperadas.entries()){
  const el=marcas[i],atributo=m.natureza==='atualizacao'?'data-estudo-atualizacao':'data-estudo-correcao';
  const rotulo=m.natureza==='atualizacao'?(linguaPagina==='pt'?'atualizado a':'updated on'):(linguaPagina==='pt'?'corrigido a':'corrected on');
  const ancora=el?.closest('[data-edicoes-item]')?el.parentNode:el;
  const irmaos=ancora?.parentNode?.childNodes??[];
  const anterior=irmaos.slice(0,irmaos.indexOf(ancora)).findLast(n=>n.nodeType!==3||normal(n.textContent));
  if(!el?.hasAttribute(atributo)||el.hasAttribute(m.natureza==='atualizacao'?'data-estudo-correcao':'data-estudo-atualizacao')||el.getAttribute('datetime')!==m.data||normal(el.textContent)!==forma(m.data)||normal(anterior?.textContent)!==rotulo)erros.push(`ED2 datas: atualização/correção ou data incorreta ${m.data}`);
 }
 return erros;
}
