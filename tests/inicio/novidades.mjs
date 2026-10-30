import { agruparNovidades } from '../../src/lib/novidades.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';
/** FP1: datas da publicação e do calendário, relidas das declarações. */
import fs from 'node:fs';
import { DOSSIES } from '../../src/data/dossies.mjs';
import {estadoDoInventario} from '../../scripts/voz.mjs';
import {PALAVRAS_PROIBIDAS} from '../../scripts/voz-palavras.mjs';
import {metaDoEstudoConferida} from '../../scripts/meta-do-estudo.mjs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { dataPublicacao } from '../../src/lib/publicacao.mjs';
import { resolverExplicacao, textoDosPedacosDaExplicacao } from '../../src/lib/explicacoes.mjs';
import {atualizacaoDaNovidade,htmlDaAtualizacao,conferirAtualizacao} from '../../src/lib/atualizacao-da-novidade.mjs';
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
    const e = w.editions.find(e => e.lang === lang) ?? w.editions.reduce((a,b) => (dataPublicacao(w,b) ?? '') > (dataPublicacao(w,a) ?? '') ? b : a);
    const data=dataPublicacao(w,e);
    if (data) saida.push({id:`estudo:${w.slug}`, titulo:e.title, tipo:'estudo', data, origem:w.publication === 'declared' ? 'publicacao.declarada' : 'publicacao.gerada', rota:routePath('estudo',lang,{slug:w.slug})});
  }
  for (const [tipo,lista] of [['discussao',ITENS],['explicacao',EXPLICACOES]]) for (const e of lista) {
    if (!e.publicado) continue;
    saida.push({id:`${tipo}:${e.slug}`, tipo, data:e.publicado, origem:'publicacao.declarada', titulo:textoDosPedacosDaExplicacao(resolverExplicacao(e,lang).titulo,lang), rota: tipo === 'discussao' ? `${routePath('discussao',lang)}#${e.slug}` : routePath('explicacao',lang,{slug:e.slug})});
  }
  const ultima=mudancasDoRegisto(lang)[0];
  if (ultima?.tipo==='correcao' && ['correcao','atualizacao'].includes(ultima.kind)) saida.push({id:'atualizacao:registo',tipo:'atualizacao',data:ultima.data,origem:'mudancas.ultima',titulo:`${ultima.motivo} ${ultima.antes} → ${ultima.depois}`,atualizacao:ultima,rota:routePath('correcoes',lang)});
  return saida.sort((a,b)=>b.data.localeCompare(a.data)||Number(b.tipo==='estudo')-Number(a.tipo==='estudo')||a.id.localeCompare(b.id));
}
/** DO2: conta independente das declarações, sem chamar o compositor da caixa. */
export function entradasEsperadas(lang, publicacoes=publicacoesEsperadas(lang)) {
  const entradas=[], vistos=new Set();
  for(const p of publicacoes) {
    const camada={estudo:'estudos',explicacao:'explicacoes',discussao:'itens'}[p.tipo];
    const d=camada&&DOSSIES.find(d=>d.pecas[camada].includes(p.id.split(':')[1]));
    if(!d){entradas.push(p);continue;}
    if(vistos.has(d.slug))continue;
    vistos.add(d.slug);
    const datas=[...d.pecas.estudos.map(slug=>publicacoes.find(p=>p.id===`estudo:${slug}`)),...d.pecas.explicacoes.map(slug=>publicacoes.find(p=>p.id===`explicacao:${slug}`)),...d.pecas.itens.map(slug=>({data:ITENS.find(e=>e.slug===slug).escrita,origem:'escrita.declarada'}))].filter(Boolean).sort((a,b)=>b.data.localeCompare(a.data));
    const n=Object.values(d.pecas).reduce((n,a)=>n+a.length,0);
    entradas.push({id:`dossie:${d.slug}`,tipo:'dossie',dossie:d,n,data:datas[0].data,origem:datas[0].origem,rota:routePath('dossie',lang,{slug:d.slug}),titulo:`${d.titulo[lang]} · ${n} ${lang==='pt'?(n===1?'peça':'peças'):(n===1?'piece':'pieces')}`});
  }
  return entradas;
}
/** DO4: a L1 conserva a porta do dossiê na conta, uma vez na caixa inteira. */
export function conferirPortasDasNovidades(root) {
 const erros=[];
 for(const li of root.querySelectorAll('[data-novidade^="dossie:"]')) {
  const a=li.querySelector('[data-novidade-dossie]'),href=a?.getAttribute('href');
  if(!href||li.querySelectorAll('a').length!==1||root.querySelectorAll('[data-novidades] a').filter(n=>n.getAttribute('href')===href).length!==1)erros.push('L1 DO4: porta do dossiê ausente ou repetida');
 }
 return erros;
}
export function conferirNovidades(root, lang, dist='dist', publicacoes=publicacoesEsperadas(lang)) {
  const erros=[];
  const v=JSON.parse(fs.readFileSync(path.join(dist,'version.json'),'utf8'));
  const dia=v.construido_em.slice(0,10), r=FP1[lang];
  const todas=entradasEsperadas(lang,publicacoes), esperadas=todas.slice(0,5);
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
    if(data?.getAttribute('data-nonledger')!=='data-editorial')erros.push('DO4: data sem marca editorial');
    if(!data || data.getAttribute('datetime')!==p.data || data.getAttribute('data-data-origem')!==p.origem || data.textContent!==forma(p.data)) erros.push('FP1: data escrita à mão ou diferente da declaração');
    if(data?.getAttribute('datetime')>dia) erros.push('FP1: data no futuro');
    if(el.querySelector('[data-novidade-porta]')?.getAttribute('href')!==p.rota) erros.push('FP1: entrada sem página declarada');
    if(p.atualizacao&&!conferirAtualizacao(el.querySelector('[data-novidade-porta]'),p.atualizacao))erros.push('FP1-e: atualização sem valores selados');
    if(normal(el.querySelector('[data-novidade-porta]')?.textContent ?? '')!==normal(p.titulo)) erros.push('FP1: título da peça diferente da declaração');
    if(p.dossie) {
      const d=p.dossie, chave=`dossie_pecas_${d.slug.replace(/-/g,'_')}`;
      const tokens=el.querySelectorAll('[data-prova]'), portas=el.querySelectorAll('a');
      if(tokens.length!==1||tokens[0].getAttribute('data-prova')!==chave||tokens[0].text!==String(p.n)||tokens[0].closest('a')!==portas[0])erros.push('DO2: contagem sem token ou diferente das peças');
      if(portas.length!==1||portas[0].getAttribute('data-novidade-dossie')!==d.slug||portas[0].getAttribute('href')!==p.rota)erros.push('DO2: dossiê diferente da pertença da peça');
      const filhos=el.children;
      if(filhos.length!==3||filhos[0]!==data||!filhos[1]?.matches('.pp-novidade-tipo')||filhos[2]!==portas[0])erros.push('DO4: três colunas fora de ordem');
      if(normal(filhos[1]?.text??'')!==(lang==='pt'?'dossiê':'dossier'))erros.push('DO4: tipo do dossiê diferente');
      if(el.childNodes.some(n=>n.nodeType===3&&normal(n.text)))erros.push('DO4: texto fora das colunas');
      if(el.querySelector('.pp-novidade-dossie'))erros.push('DO4: forma antiga do dossiê');
    } else {
      if(normal(el.querySelector('.pp-novidade-tipo')?.textContent ?? '')!==r[p.tipo])erros.push('FP1: tipo diferente');
      if(el.querySelector('[data-novidade-dossie]'))erros.push('DO2: dossiê diferente da pertença da peça');
    }
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
  if(root.querySelectorAll('[data-data-origem="version.construido_em"]').length!==1) erros.push('FP1: carimbo repetido ou ausente');
  for(const estudo of root.querySelectorAll('#trabalhos [data-estudo]')) {
    const data=estudo.querySelector('.estudo-meta time')?.getAttribute('datetime');
    const dias=(Date.parse(dia)-Date.parse(data??''))/86400000;
    const esperado=Number(dias>=0&&dias<=7);
    if(estudo.querySelectorAll('[data-estudo-novo]').length!==esperado)erros.push('FP1: marca novo diferente da data impressa');
  }
  return erros;
}
export function plantasDasNovidades(html,lang,dist) {

  const plantas=[
    ['DO4 data na última coluna',r=>{const li=r.querySelector('[data-novidade^="dossie:"]'),t=li.querySelector('time');const h=t.outerHTML;t.remove();li.insertAdjacentHTML('beforeend',h);},/três colunas/],
    ['DO4 tipo em maiúscula',r=>r.querySelector('[data-novidade^="dossie:"] .pp-novidade-tipo').set_content('Dossier'),/tipo do dossiê/],
    ['DO4 cauda antiga',r=>r.querySelector('[data-novidade^="dossie:"]').insertAdjacentHTML('beforeend',', a mais recente de'),/texto fora/],
    ['DO4 marca editorial retirada',r=>r.querySelector('[data-novidade^="dossie:"] time').removeAttribute('data-nonledger'),/marca editorial/],
    ['contagem sem token',r=>r.querySelector('[data-novidades] [data-prova]').removeAttribute('data-prova'),/contagem sem token/],
    ['dossiê repetido',r=>r.querySelector('[data-novidades] ol').insertAdjacentHTML('beforeend',r.querySelector('[data-novidade^="dossie:"]').outerHTML),/quantidade|ordem/],
    ['marca novo retirada',r=>r.querySelector('[data-estudo-novo]').remove(),/marca novo/],
    ['dossiê da novidade trocado',r=>r.querySelector('[data-novidade-dossie]').setAttribute('href','/dossies/inexistente/'),/dossiê diferente/],
    ['dossiê da novidade retirado',r=>r.querySelector('[data-novidade-dossie]').remove(),/dossiê diferente/],
    ['título da peça trocado',r=>r.querySelector('[data-novidade-porta]').set_content('Título inventado'),/título da peça/],
    ['entrada sem página',r=>r.querySelector('[data-novidade-porta]').setAttribute('href','/pagina-fp1-inexistente'),/sem página/],
    ['data no futuro',r=>r.querySelector('[data-novidade] time').setAttribute('datetime','9999-12-31'),/futuro/],
    ['ordem trocada',r=>{const a=r.querySelectorAll('[data-novidade]');const s=a[0].outerHTML;a[0].replaceWith(a[1].outerHTML);a[1].replaceWith(s);},/ordem/],
    ['peça mais recente em falta',r=>r.querySelector('[data-novidade]').remove(),/mais recente/],
    ['data escrita à mão no HTML',r=>{const t=r.querySelector('[data-novidade] time');t.replaceWith(t.textContent);},/escrita à mão/],
  ];
  const resultado=plantas.map(([nome,mudar,queixa])=>{const r=parse(html);mudar(r);const erros=conferirNovidades(r,lang,dist);return {nome,lang,mordeu:erros.some(e=>queixa.test(e))};});
  const todas=publicacoesEsperadas(lang), gerada=todas.find(p=>p.origem==='publicacao.gerada');assert(gerada);
  const fonte=todas.map(p=>p.id===gerada.id?{...p,data:todas[1].data}:p).sort((a,b)=>b.data.localeCompare(a.data)||Number(b.tipo==='estudo')-Number(a.tipo==='estudo')||a.id.localeCompare(b.id));
  assert(fonte.slice(0,5).some(p=>p.id===gerada.id));
  const erros=conferirNovidades(parse(html),lang,dist,fonte);
  resultado.push({nome:'estudo com data gerada recente ausente',lang,mordeu:erros.some(e=>/seleção/.test(e))});
  return resultado;
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  const dist=process.env.OEDP_DIST ?? 'dist'; const plantas=[];
  for(const lang of ['pt','en']) {
    const registo=mudancasDoRegisto(lang), publicacao=registo.find(m=>m.tipo==='publicacao'), correcao=registo.find(m=>m.tipo==='correcao');
    assert.equal(atualizacaoDaNovidade(publicacao,lang),null);plantas.push({nome:'última publicação não gera atualização',lang,mordeu:true});
    const peca=atualizacaoDaNovidade(correcao,lang);assert(peca);
    const texto=parse('<a>'+htmlDaAtualizacao(correcao)+'</a>').querySelector('a');assert(conferirAtualizacao(texto,correcao));
    texto.querySelector('[data-correcao-campo="new_value"]').removeAttribute('data-correcao-claim');
    const mordeu=!conferirAtualizacao(texto,correcao);assert(mordeu);plantas.push({nome:'correção gera texto selado e recusa selo retirado',lang,mordeu});
  }
  const grupo={slug:'ensaio',recente:'2026-10-29',origemRecente:'escrita.declarada'};
  const fora={id:'estudo:fora',tipo:'estudo',data:'2026-10-28',origem:'publicacao.declarada',rota:'/fora/',titulo:'Fora'};
  const quatro=Array.from({length:4},(_,i)=>({id:`discussao:${i}`,dossie:grupo,data:'2026-10-27'}));
  const unidas=agruparNovidades([quatro[0],fora,...quatro.slice(1)],[grupo],'pt');
  assert.equal(unidas.length,2);assert.equal(unidas[0].data,grupo.recente);assert.equal(unidas[0].origem,grupo.origemRecente);assert.strictEqual(unidas[1],fora);
  assert.equal(agruparNovidades([...quatro,...Array.from({length:6},(_,i)=>({...fora,id:`fora:${i}`}))],[grupo],'pt').length,5);
  plantas.push({nome:'quatro peças dão uma entrada, conservam a data e a peça exterior e deixam cinco entradas',mordeu:true});
  assert.equal(estadoDoInventario('condicional-fp1','fp1','update'),'condicional-fp1');
  assert.equal(estadoDoInventario('condicional-fp1','outro','update'),null);
  for(const tipo of ['o que se discute','under discussion']) {assert.equal(estadoDoInventario('condicional-fp1','fp1',tipo),'condicional-fp1');assert.equal(estadoDoInventario('condicional-fp1','do2',tipo),null);}
  assert.equal(estadoDoInventario('condicional-fp1','fp1','texto arbitrário'),null);
  plantas.push({nome:'condição do inventário limitada aos rótulos condicionais FP1',mordeu:true});
  const palavra=PALAVRAS_PROIBIDAS.find(p=>p.chave==='lido na fonte a');
  assert(palavra.marca.test('read at the source on'));
  assert(!palavra.marca.test(FP1.en.relidos));
  plantas.push({nome:'read continua proibido e re-read aprovado não é uma palavra parcial',mordeu:true});
  for(const lang of ['pt','en']) {
    const html=fs.readFileSync(path.join(dist,lang==='en'?'en':'','index.html'),'utf8');
    assert.deepEqual(conferirNovidades(parse(html),lang,dist),[]);
    plantas.push(...plantasDasNovidades(html,lang,dist));
    const l1=parse(html);assert.deepEqual(conferirPortasDasNovidades(l1),[]);
    const a=l1.querySelector('[data-novidade-dossie]');a.insertAdjacentHTML('afterend',a.outerHTML);
    assert(conferirPortasDasNovidades(l1).length);plantas.push({nome:'DO4 L1 porta do dossiê duplicada',lang,mordeu:true});
    const arquivo=parse(fs.readFileSync(path.join(dist,routePath('estudos',lang),'index.html'),'utf8'));
    const meta=arquivo.querySelector('[data-estudo-em-curso]')?.closest('.estudo-meta');
    assert(metaDoEstudoConferida(meta,lang),'FP1-d: estado declarado no arquivo');
    meta.querySelector('[data-estudo-em-curso]').set_content('estado inventado 1999');
    const mordeu=!metaDoEstudoConferida(meta,lang);assert(mordeu);plantas.push({nome:'estado em curso trocado no arquivo',lang,mordeu});
  }
  assert(plantas.every(p=>p.mordeu));
  console.log(JSON.stringify({fp1:'verde',plantas}));
}
