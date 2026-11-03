/** ED1: a lista publicada governa os documentos e as portas de cada correção. */
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {load} from 'js-yaml';
import {marcarLeisDaEdicao,provaDosBytesDaEdicao} from './leis-da-edicao.mjs';
import {STUDIES_SRC_DIR,comFaixa,comMarcasDaCasa,documentoServido} from './documentos.mjs';
import {dataDaCasa} from './datas.mjs';
/** @param {Buffer|string} bytes */
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
/** @typedef {{data:string,sha256:string,file:string,natureza?:string}} Versao */
/** @typedef {{slug:string,lang:Lingua,edicoes:Versao[],primeira_edicao?:{commit:string}}} Declaracao */
export function manifestoDasEdicoes(){
 if(!STUDIES_SRC_DIR)throw Error('ED1: pasta dos estudos ausente');
 return /** @type {{edicoes:Declaracao[]}} */(load(fs.readFileSync(path.join(STUDIES_SRC_DIR,'manifest.yml'),'utf8')));
}
/** @param {string} slug @param {string} lang */
export function versoesDaEdicao(slug,lang){
 const e=manifestoDasEdicoes().edicoes.find(e=>e.slug===slug&&e.lang===lang);
 return (e?.edicoes??[]).map((v,i,lista)=>({...v,date:v.data,slug,lang:/** @type {Lingua} */(lang),indice:i,atual:i===lista.length-1,
  ficheiro:path.join(/** @type {string} */(STUDIES_SRC_DIR),v.file),
  rota:`${lang==='pt'?'/estudos':'/en/studies'}/${slug}/${lang==='pt'?'documento':'document'}${i===lista.length-1?'':'/'+v.data}`}));
}
export function edicoesGuardadas(){return manifestoDasEdicoes().edicoes.flatMap(e=>versoesDaEdicao(e.slug,e.lang).slice(0,-1));}
export function primeirasEdicoes(){return edicoesGuardadas().filter(e=>e.indice===0);}
/** @param {string} slug @param {string} lang */
export function primeiraEdicao(slug,lang){return primeirasEdicoes().find(e=>e.slug===slug&&e.lang===lang)??null;}
/** @param {string} slug @param {string} lang @param {string|null} publicada */
export function dataAtualizacaoDaEdicao(slug,lang,publicada=null){const vs=versoesDaEdicao(slug,lang),ultima=vs.at(-1);return ultima&&(vs.length>1||(publicada&&ultima.data>publicada))?ultima.data:null;}
/** @param {string} slug @param {Lingua} lang @param {string} data */
export function portasDaCorrecao(slug,lang,data){
 const vs=versoesDaEdicao(slug,lang),i=vs.findIndex(v=>v.data===data);
 if(i<1)throw Error(`ED1: correção sem par de versões: ${slug}/${lang}/${data}`);
 const label=(/** @type {number} */ n)=>n===0?(lang==='pt'?'Primeira edição':'First edition'):n===vs.length-1?(lang==='pt'?'Edição atual':'Current edition'):(lang==='pt'?'Edição de ':'Edition of ')+dataDaCasa(vs[n].data);
 return {antes:vs[i-1],depois:vs[i],rotuloAntes:label(i-1),rotuloDepois:label(i)};
}
/** @param {string} slug @param {Lingua} lang @param {string} data */
export function faixaDaVersao(slug,lang,data){
 const vs=versoesDaEdicao(slug,lang),i=vs.findIndex(v=>v.data===data);if(vs.length<2)return '';if(i<0)throw Error('ED1: data de edição desconhecida');
 const dataEm=(/** @type {string} */ d)=>`<time data-edicao-data datetime="${d}">${dataDaCasa(d)}</time>`;
 const primeira=vs[0],atual=vs.at(-1);if(!atual)throw Error('ED1: versão atual ausente');
 const d=dataEm(data),p=dataEm(primeira.data),a=dataEm(atual.data),pt=lang==='pt';
 const frase=i===0?(pt?`Primeira edição, publicada a ${d}. A edição atual é de ${a}.`:`First edition, published on ${d}. The current edition is from ${a}.`):i===vs.length-1?(pt?`Edição atual, de ${d}. A primeira edição é de ${p}.`:`Current edition, from ${d}. The first edition is from ${p}.`):(pt?`Edição de ${d}. A edição atual é de ${a}.`:`Edition of ${d}. The current edition is from ${a}.`);
 const destino=i===vs.length-1?primeira:atual,label=i===vs.length-1?(pt?'Primeira edição, tal como foi publicada':'First edition, as published'):(pt?'Edição atual':'Current edition');
 return `<aside data-documento-edicao="${slug}/${lang}/${data}" lang="${pt?'pt-PT':'en-GB'}"><p data-edicao-frase>${frase}</p><a data-edicao-porta href="${destino.rota}">${label}</a></aside>`;
}
/** @param {string} html @param {string} slug @param {Lingua} lang @param {string} data */
function comFaixaDaVersao(html,slug,lang,data){const faixa=faixaDaVersao(slug,lang,data);if(!faixa)return html;const marca='<div data-oedp-faixa';if(!html.includes(marca))throw Error('ED1: faixa da casa ausente');return html.replace(marca,faixa+marca);}
/** @param {string} slug @param {Lingua} lang @param {string} date */
export function primeiraEdicaoServida(slug,lang,date){
 const e=edicoesGuardadas().find(e=>e.slug===slug&&e.lang===lang&&e.data===date);if(!e)throw Error(`ED1: edição guardada desconhecida: ${slug}/${lang}/${date}`);
 const bytes=fs.readFileSync(e.ficheiro);if(sha256(bytes)!==e.sha256)throw Error(`ED1: sha256 da edição guardada diverge: ${slug}/${lang}`);
 const bruto=bytes.toString('utf8');if(!Buffer.from(bruto).equals(bytes))throw Error('ED1: edição não preserva UTF-8');
 const servido=comFaixaDaVersao(marcarLeisDaEdicao(comFaixa(comMarcasDaCasa(bruto,{slug,lang,guardada:true}),{slug,lang}),lang),slug,lang,date);
 const falha=provaDosBytesDaEdicao(bruto,servido,lang);if(falha)throw Error(`ED1: ${falha}`);return servido;
}
/** @param {string} slug @param {Lingua} lang */
export function documentoDaHistoriaServido(slug,lang){
 const v=versoesDaEdicao(slug,lang).at(-1);if(!v)throw Error('ED1: documento sem história declarada');
 if(sha256(fs.readFileSync(v.ficheiro))!==v.sha256)throw Error(`ED1: documento mudou sem versão: ${slug}/${lang}`);
 return comFaixaDaVersao(documentoServido(slug,lang),slug,lang,v.data);
}
