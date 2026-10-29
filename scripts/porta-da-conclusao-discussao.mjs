/** OG1-B-2: nomes FP2 conservados; «conclusao» nesta API é a primeira frase da abertura.
 * DO1-E: a primeira página conserva a prova no item; o dossiê exige também o selo local. */
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {ITENS} from '../src/data/discussao.mjs';
import {resolverExplicacao, textoDosPedacosDaExplicacao} from '../src/lib/explicacoes.mjs';
import {primeirasFrases} from '../src/lib/estudos-b1.mjs';
import {dataDaCasa} from '../src/lib/datas.mjs';
import {routePath} from '../src/lib/routes.mjs';
const normal=x=>String(x??'').replace(/\s+/g,' ').trim();
const destinos=new Map();
export function conclusaoResolvida(e,lang) {
  return resolverExplicacao(e,lang).abertura[0]?.pedacos;
}
export function paragrafoDeDestino(e,lang,dist) {
  const ficheiro=path.join(dist,routePath('discussao',lang),'index.html');
  if(!fs.existsSync(ficheiro))return null;
  const mtime=fs.statSync(ficheiro).mtimeMs;
  if(destinos.get(ficheiro)?.mtime!==mtime)destinos.set(ficheiro,{mtime,root:parse(fs.readFileSync(ficheiro,'utf8'))});
  return destinos.get(ficheiro).root.querySelector(`[data-discussao="${e.slug}"] [data-discussao-paragrafo="abertura[0]"]`);
}
export function semSelos(el) {
  if(!el)return '';
  const copia=parse(el.outerHTML);
  for(const n of copia.querySelectorAll('.src-chip,.claim-provisorio-chip'))n.remove();
  return normal(copia.text);
}
export function conferirConclusaoDoInicio(a,e,lang,{dist=process.env.OEDP_DIST??'dist',destino}={}) {
  const erros=[],li=a?.parentNode;
  const dossie=Boolean(li?.closest('[data-dossie-discussao]'));
  const ps=li?.querySelectorAll('p[data-discussao-resumo]')??[],p=ps[0];
  if(ps.length!==1||p?.parentNode!==li||li.childNodes.indexOf(p)<li.childNodes.indexOf(a)||a?.tagName!=='A'||li?.tagName!=='LI'||(!dossie&&!li.closest('[data-discussao-inicio]')))return ['FP2 início: parágrafo ausente ou fora do item'];
  const times=p.querySelectorAll('time'),time=times[0],frases=p.querySelectorAll('[data-discussao-conclusao]'),frase=frases[0];
  const caixa=a.closest('main')?.querySelector(`[data-novidade="discussao:${e.slug}"] time`);
  if(times.length!==1||time?.parentNode!==p||time?.getAttribute('datetime')!==e.escrita||normal(time?.text)!==dataDaCasa(e.escrita)||time?.getAttribute('data-nonledger')!=='data-editorial'||time?.getAttribute('data-data-origem')!=='escrita.declarada'||(caixa&&(caixa.getAttribute('datetime')!==e.publicado||normal(caixa.text)!==dataDaCasa(e.publicado))))erros.push('FP2 início: data diferente da escrita declarada ou publicação diferente na caixa');
  const conclusao=conclusaoResolvida(e,lang);
  if(!conclusao)return [...erros,'FP2 início: conclusão declarada ausente'];
  const partes=primeirasFrases(conclusao,1),esperado=normal(textoDosPedacosDaExplicacao(partes,lang));
  if(frases.length!==1||frase?.parentNode!==p||frase?.querySelector(dossie?'a:not(.src-chip)':'a')||(dossie?semSelos(frase):normal(frase?.text))!==esperado||!esperado.endsWith('.')||(dossie?semSelos(p):normal(p.text))!==`${dataDaCasa(e.escrita)} · ${esperado}`)erros.push('FP2 início: frase diferente da primeira conclusão');
  const original=destino??paragrafoDeDestino(e,lang,dist);
  if(!original||!semSelos(original).startsWith(esperado))erros.push('FP2 início: frase não é prefixo da conclusão construída');
  const valores=partes.filter(x=>typeof x!=='string'&&x.claim),marcas=frase?.querySelectorAll('[data-claim]')??[];
  if(marcas.length!==valores.length||marcas.some((n,i)=>n.getAttribute('data-claim')!==valores[i].claim||normal(n.text)!==normal(textoDosPedacosDaExplicacao([{claim:valores[i].claim}],lang))))erros.push('FP2 início: valor ou linha diferente da conclusão');
  // DO1-B: cada valor no dossiê leva o seu selo local.
  if(dossie)for(const n of marcas) {
    const href=routePath('linha',lang,{slug:n.getAttribute('data-claim')});
    if(!n.parentNode?.querySelectorAll('a.src-chip').some(a=>a.getAttribute('href')===href))erros.push('DO1: valor do resumo sem o seu selo local');
  }
  return erros;
}
export function seloDaConclusaoDoInicio(el,id,lang,{dist}={}) {
  const p=el.closest('p[data-discussao-resumo]'),a=p?.parentNode?.querySelector('a[data-discussao-porta]');
  const e=ITENS.find(e=>e.slug===a?.getAttribute('data-discussao-porta'));
  if(!e||!el.closest('[data-discussao-conclusao]')||a.getAttribute('href')!==routePath('discussao',lang)+'#'+e.slug)return false;
  const destino=paragrafoDeDestino(e,lang,dist);
  if(conferirConclusaoDoInicio(a,e,lang,{dist,destino}).length)return false;
  return Boolean(destino?.querySelectorAll('[data-claim]').some(n=>n.getAttribute('data-claim')===id&&normal(n.text)===normal(el.text))&&destino.querySelectorAll('a.src-chip').some(n=>n.getAttribute('href')===routePath('linha',lang,{slug:id})));
}

export function fragmentoDaConclusaoDoInicio(el,id,campo,lang,{dist}={}) {
  const p=el.closest('p[data-discussao-resumo]'),a=p?.parentNode?.querySelector('a[data-discussao-porta]');
  const e=ITENS.find(e=>e.slug===a?.getAttribute('data-discussao-porta'));
  if(!e||!el.closest('[data-discussao-conclusao]')||a.getAttribute('href')!==routePath('discussao',lang)+'#'+e.slug||conferirConclusaoDoInicio(a,e,lang,{dist}).length)return false;
  return primeirasFrases(conclusaoResolvida(e,lang),1).some(p=>p?.literal?.fragmento&&p.literal.id===id&&p.literal.campo===campo&&p.literal.texto===el.getAttribute('data-linha-trecho')&&normal(el.text)===normal(p.literal.texto)&&el.closest('[data-discussao-fragmento]')?.getAttribute('data-discussao-fragmento')===campo);
}
