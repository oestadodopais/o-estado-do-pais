/** Modelos fechados: palavras literais; variáveis só do catálogo ou numéricas. */
import fs from 'node:fs';
import {STRINGS} from '../src/i18n/strings.mjs';
import {METODO} from '../src/data/metodo.mjs';
import {allClaims} from '../src/lib/ledger.mjs';
import {nomeNaSemana} from '../src/lib/leitura-da-semana.mjs';
import {nomeNaLista} from '../src/lib/primeira-pagina.mjs';
import {unidadeDaLinha} from '../src/i18n/unidades.mjs';
import {dataDaCasa} from '../src/lib/datas.mjs';
import {conferirPino} from './frases-pino.mjs';
export const MODELOS=JSON.parse(fs.readFileSync(new URL('./frases-modelos.json',import.meta.url),'utf8'));
const normal=t=>String(t).normalize('NFKC').replace(/\u200b/g,'').replace(/\s+/g,' ').trim();
const escapar=t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function modelosDasFontes(strings=STRINGS,metodo=METODO) {
  return ['pt','en'].flatMap(lingua=>{
    const s=strings[lingua].semana;
    const p=metodo.passos.find(p=>p[lingua]?.some(t=>t?.prova==='painel_reconferido_em'))?.[lingua];
    return [{id:'revisao-'+lingua,lingua,tipo:'leituraDaSemana',fonte:'src/i18n/strings.mjs',modelo:'{indicador}'+s.virgula+'{periodo}'+s.publicado+'{valor} {unidade}'+s.fonteAgora+'{valor}'+s.naReleitura+'{data}'+s.ponto},
      {id:'painel-'+lingua,lingua,tipo:'metodo',fonte:'src/data/metodo.mjs',modelo:p?.map(t=>typeof t==='string'?t:t.prova==='painel_reconferido_em'?'{data}':'{desconhecido}').join('')??null}];
  });
}
export function conferirModelos(lista=MODELOS,strings=STRINGS,metodo=METODO) {
  return JSON.stringify(lista)===JSON.stringify(modelosDasFontes(strings,metodo))?[]:['modelos: lista diferente dos textos que os ficheiros geram'];
}
export const conferirPinoModelos=opcoes=>conferirPino({...opcoes,ficheiros:{marcas:'scripts/frases-modelos.json',pino:'scripts/frases-modelos-pino.json',base:'d9a6489a9'}}).map(e=>e.replaceAll('marcas:','modelos:'));
let catalogo;
export function catalogoDosModelos() {
  if(catalogo)return catalogo;
  catalogo=Object.fromEntries(['pt','en'].map(l=>[l,{indicador:new Set(),unidade:new Set(),periodo:new Set()}]));
  for(const linha of allClaims()) for(const lingua of ['pt','en']) {
    const c=catalogo[lingua], nome=nomeNaSemana(linha.id,lingua);
    if(nome?.texto)c.indicador.add(normal(nome.texto+(nomeNaLista(linha.id,lingua).qualificador==='ue'?STRINGS[lingua].semana.virgula+STRINGS[lingua].cartao.uniaoEuropeia:'')));
    c.unidade.add(normal(unidadeDaLinha(linha.unit,lingua).texto));
    c.periodo.add(normal(dataDaCasa(linha.reference_date,lingua)));
  }
  return catalogo;
}
export function expressaoDoModelo(m,catalogos=catalogoDosModelos()) {
  const numero='[-+−]?\\d+(?:[., ]\\d+)*%?', data='\\d{2}\\.\\d{2}\\.\\d{4}';
  const partes=m.modelo.split(/(\{(?:indicador|unidade|periodo|valor|data)\})/u);
  const campos={valor:numero,data};
  for(const campo of ['indicador','unidade','periodo'])campos[campo]='(?:'+[...catalogos[m.lingua][campo]].filter(Boolean).sort().map(escapar).join('|')+')';
  return new RegExp('^'+partes.map(p=>/^\{/.test(p)?campos[p.slice(1,-1)]:escapar(p)).join('')+'$','u');
}
let expressoes;
export function modeloDaFrase(frase,lingua,tipo) {
  if(!MODELOS.some(m=>m.lingua===lingua&&m.tipo===tipo))return null;
  expressoes??=MODELOS.map(m=>({...m,re:expressaoDoModelo(m)}));
  return expressoes.find(m=>m.lingua===lingua&&m.tipo===tipo&&m.re.test(normal(frase)))?.id??null;
}
export function contarModelos(paginas) {
  const r={pt:0,en:0,por_modelo:{}};
  for(const p of paginas)for(const b of p.blocos)for(const f of b.frases){const id=modeloDaFrase(f,p.lingua,p.tipo);if(id){r[p.lingua]++;r.por_modelo[id]=(r.por_modelo[id]??0)+1;}}
  return r;
}
