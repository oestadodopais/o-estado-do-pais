/** FP1: datas da publicação e do calendário, relidas das declarações. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { WORKS } from '../../src/data/studies.mjs';
import { ITENS } from '../../src/data/discussao.mjs';
import { EXPLICACOES } from '../../src/data/explicacoes/index.mjs';
import { VERIFICACAO } from '../../src/data/verificacao.mjs';
import { FP1 } from '../../src/data/rotulos-fp1.mjs';
import { mudancasDoRegisto } from '../../src/lib/mudancas.mjs';
import { routePath } from '../../src/lib/routes.mjs';
const forma = d => `${d.slice(8,10)}.${d.slice(5,7)}.${d.slice(0,4)}`;
const normal = s => s.replace(/\s+/g,' ').trim();
export function publicacoesEsperadas(lang) {
  const saida = [];
  for (const w of WORKS) {
    const e = w.editions.find(e => e.lang === lang) ?? w.editions.reduce((a,b) => (b.date ?? '') > (a.date ?? '') ? b : a);
    if (e.date) saida.push({id:`estudo:${w.slug}`, tipo:'estudo', data:e.date, origem:`studies:${w.slug}/${e.lang}`, rota:routePath('estudo',lang,{slug:w.slug})});
  }
  for (const [tipo,lista] of [['discussao',ITENS],['explicacao',EXPLICACOES]]) for (const e of lista) {
    if (!e.publicado) continue;
    saida.push({id:`${tipo}:${e.slug}`, tipo, data:e.publicado, origem:`${tipo}:${e.slug}.publicado`, rota: tipo === 'discussao' ? `${routePath('discussao',lang)}#${e.slug}` : routePath('explicacao',lang,{slug:e.slug})});
  }
  const datas = mudancasDoRegisto(lang).map(e=>e.data).sort();
  if (datas.length) saida.push({id:'atualizacao:registo', tipo:'atualizacao', data:datas.at(-1), origem:'mudancas:ultima', rota:routePath('correcoes',lang)});
  return saida.sort((a,b)=>b.data.localeCompare(a.data)||a.id.localeCompare(b.id));
}
export function conferirNovidades(root, lang, dist='dist') {
  const erros=[];
  const v=JSON.parse(fs.readFileSync(path.join(dist,'version.json'),'utf8'));
  const dia=v.construido_em.slice(0,10), r=FP1[lang];
  const todas=publicacoesEsperadas(lang), esperadas=todas.slice(0,5);
  const caixas=root.querySelectorAll('[data-novidades]');
  if(caixas.length!==1) return ['FP1: falta a caixa única'];
  const caixa=caixas[0], entradas=caixa.querySelectorAll('[data-novidade]');
  if(caixa.hasAttribute('data-bloco') || caixa.querySelector('[data-bloco]')) erros.push('FP1: mobília marcada como bloco');
  if(entradas.length>5 || entradas.length!==esperadas.length) erros.push('FP1: quantidade de entradas');
  if(caixa.querySelector('h2')?.textContent!==r.titulo) erros.push('FP1: título da caixa');
  const ids=entradas.map(e=>e.getAttribute('data-novidade'));
  if(todas[0] && !ids.includes(todas[0].id)) erros.push('FP1: peça mais recente em falta');
  if(ids.join()!==esperadas.map(e=>e.id).join()) erros.push('FP1: ordem ou seleção diferente');
  for(const p of todas) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(p.data) || Number.isNaN(Date.parse(p.data)) || new Date(p.data).toISOString().slice(0,10)!==p.data) erros.push('FP1: data declarada inválida');
    if(p.data>dia) erros.push('FP1: data no futuro');
    const [rota,ancora]=p.rota.split('#');
    const f=path.join(dist,rota,'index.html');
    if(!fs.existsSync(f)) erros.push(`FP1: entrada sem página ${p.id}`);
    else if(ancora && !parse(fs.readFileSync(f,'utf8')).getElementById(ancora)) erros.push(`FP1: entrada sem âncora ${p.id}`);
  }
  for(const el of entradas) {
    const p=todas.find(p=>p.id===el.getAttribute('data-novidade'));
    if(!p) {erros.push('FP1: peça sem declaração'); continue;}
    const data=el.querySelector('time[data-data-origem]');
    if(!data || data.getAttribute('datetime')!==p.data || data.getAttribute('data-data-origem')!==p.origem || data.textContent!==forma(p.data)) erros.push('FP1: data escrita à mão ou diferente da declaração');
    if(data?.getAttribute('datetime')>dia) erros.push('FP1: data no futuro');
    if(el.querySelector('[data-novidade-porta]')?.getAttribute('href')!==p.rota) erros.push('FP1: entrada sem página declarada');
    if(el.querySelector('.pp-novidade-tipo')?.textContent!==r[p.tipo]) erros.push('FP1: tipo diferente');
  }
  const linha=caixa.querySelector('[data-atualizacao]');
  if(!linha || normal(linha.textContent)!==`${r.atualizado} ${forma(dia)} · ${r.relidos} ${forma(VERIFICACAO.verificadoEm)}`) erros.push('FP1: linha das duas datas diferente dos ficheiros');
  const origens={'version.construido_em':dia,'verificacao.verificadoEm':VERIFICACAO.verificadoEm};
  for(const el of root.querySelectorAll('[data-data-origem]')) {
    const origem=el.getAttribute('data-data-origem');
    if(!origens[origem]) continue;
    if(el.getAttribute('datetime')!==origens[origem] || el.textContent!==forma(origens[origem]) || origens[origem]>dia) erros.push('FP1: data gerada diferente dos ficheiros');
  }
  if(linha?.querySelectorAll('time[data-data-origem]').length!==2) erros.push('FP1: faltam as duas origens');
  if(root.querySelector('[data-numeros-mais-recentes] [data-data-origem="version.construido_em"]')===null) erros.push('FP1: falta a data de atualização ao lado do período');
  return erros;
}
export function plantasDasNovidades(html,lang,dist) {
  const plantas=[
    ['entrada sem página',r=>r.querySelector('[data-novidade-porta]').setAttribute('href','/pagina-fp1-inexistente'),/sem página/],
    ['data no futuro',r=>r.querySelector('[data-novidade] time').setAttribute('datetime','9999-12-31'),/futuro/],
    ['ordem trocada',r=>{const a=r.querySelectorAll('[data-novidade]');const s=a[0].outerHTML;a[0].replaceWith(a[1].outerHTML);a[1].replaceWith(s);},/ordem/],
    ['peça mais recente em falta',r=>r.querySelector('[data-novidade]').remove(),/mais recente/],
    ['data escrita à mão no HTML',r=>{const t=r.querySelector('[data-novidade] time');t.replaceWith(t.textContent);},/escrita à mão/],
  ];
  return plantas.map(([nome,mudar,queixa])=>{const r=parse(html);mudar(r);const erros=conferirNovidades(r,lang,dist);return {nome,lang,mordeu:erros.some(e=>queixa.test(e))};});
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  const dist=process.env.OEDP_DIST ?? 'dist'; const plantas=[];
  for(const lang of ['pt','en']) {
    const html=fs.readFileSync(path.join(dist,lang==='en'?'en':'','index.html'),'utf8');
    assert.deepEqual(conferirNovidades(parse(html),lang,dist),[]);
    plantas.push(...plantasDasNovidades(html,lang,dist));
  }
  assert(plantas.every(p=>p.mordeu));
  console.log(JSON.stringify({fp1:'verde',plantas}));
}
