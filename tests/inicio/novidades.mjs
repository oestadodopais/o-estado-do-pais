import {conferirMarcasNovo} from '../../scripts/marca-novo.mjs';
import {provarDatasDaMarcaNovo} from './marca-novo.mjs';
import { agruparNovidades, pecasPublicadas, TIPOS_DAS_NOVIDADES } from '../../src/lib/novidades.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';
/** FP1: datas da publicação e do calendário, relidas das declarações. */
import fs from 'node:fs';
import { load } from 'js-yaml';
import { STUDIES_SRC_DIR } from '../../src/lib/documentos.mjs';
import { dataEditorialPermitida } from '../../scripts/datas-editoriais.mjs';
const lerManifesto = () => load(fs.readFileSync(path.join(STUDIES_SRC_DIR,'manifest.yml'),'utf8'));
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
import { WORKS } from '../../src/data/studies.mjs';
import { ITENS } from '../../src/data/discussao.mjs';
import { EXPLICACOES } from '../../src/data/explicacoes/index.mjs';
import { VERIFICACAO } from '../../src/data/verificacao.mjs';
import { FP1 } from '../../src/data/rotulos-fp1.mjs';
import { routePath } from '../../src/lib/routes.mjs';
const forma = d => `${d.slice(8,10)}.${d.slice(5,7)}.${d.slice(0,4)}`;
const normal = s => s.replace(/\s+/g,' ').trim();
export function publicacoesEsperadas(lang, manifesto=lerManifesto()) {
  const saida = [];
  for (const w of WORKS.filter(w => w.estado !== 'retirado')) {
    const e = w.editions.find(e => e.lang === lang) ?? w.editions.reduce((a,b) => (dataPublicacao(w,b) ?? '') > (dataPublicacao(w,a) ?? '') ? b : a);
    let atual=null;
    for(const v of manifesto.edicoes.find(d=>d.slug===w.slug&&d.lang===e.lang)?.edicoes.slice(1)??[])if(v.natureza==='atualizacao')atual=v;
    const atualizacao=atual?.natureza==='atualizacao';
    const data=atualizacao?atual.data:dataPublicacao(w,e);
    if (data) saida.push({id:`estudo:${w.slug}`, titulo:e.title, tipo:atualizacao?'estudo-atualizado':'estudo', data, publicacao:dataPublicacao(w,e), origemPublicacao:w.publication==='declared'?'publicacao.declarada':'publicacao.gerada', origem:atualizacao?'edicoes.data':w.publication === 'declared' ? 'publicacao.declarada' : 'publicacao.gerada', rota:routePath('estudo',lang,{slug:w.slug})});
  }
  for (const [tipo,lista] of [['discussao',ITENS],['explicacao',EXPLICACOES]]) for (const e of lista) {
    if (!e.publicado) continue;
    saida.push({id:`${tipo}:${e.slug}`, tipo, data:e.publicado, origem:'publicacao.declarada', titulo:textoDosPedacosDaExplicacao(resolverExplicacao(e,lang).titulo,lang), rota: tipo === 'discussao' ? `${routePath('discussao',lang)}#${e.slug}` : routePath('explicacao',lang,{slug:e.slug})});
  }
  return saida.sort((a,b)=>b.data.localeCompare(a.data)||Number(b.id.startsWith('estudo:'))-Number(a.id.startsWith('estudo:'))||a.id.localeCompare(b.id));
}
/** DO2: conta independente das declarações, sem chamar o compositor da caixa. */
export function entradasEsperadas(lang, publicacoes=publicacoesEsperadas(lang)) {
  const entradas=[], vistos=new Set();
  for(const p of publicacoes) {
    const camada={estudo:'estudos','estudo-atualizado':'estudos',explicacao:'explicacoes',discussao:'itens'}[p.tipo];
    const d=camada&&DOSSIES.find(d=>d.pecas[camada].includes(p.id.split(':')[1]));
    if(!d){entradas.push(p);continue;}
    if(vistos.has(d.slug))continue;
    vistos.add(d.slug);
    const datas=[...d.pecas.estudos.map(slug=>{const p=publicacoes.find(p=>p.id===`estudo:${slug}`);return p&&{data:p.publicacao,origem:p.origemPublicacao};}),...d.pecas.explicacoes.map(slug=>publicacoes.find(p=>p.id===`explicacao:${slug}`)),...d.pecas.itens.map(slug=>({data:ITENS.find(e=>e.slug===slug).escrita,origem:'escrita.declarada'}))].filter(Boolean).sort((a,b)=>b.data.localeCompare(a.data));
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
  if(ids.some(id=>!['estudo','discussao','explicacao','dossie'].includes(id?.split(':')[0])))erros.push('EV3-G: tipo fora das novidades');
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
  erros.push(...conferirMarcasNovo(root,dia));
  return erros;
}
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function renderNovidades(root,lang,publicacoes) {
  root.querySelector('[data-novidades] ol').set_content(entradasEsperadas(lang,publicacoes).slice(0,5).map(p=>{
   const texto=p.dossie?`${esc(p.titulo.slice(0,p.titulo.lastIndexOf(' · ')))} · <span class="prova-valor" data-prova="dossie_pecas_${p.dossie.slug.replace(/-/g,'_')}">${p.n}</span> ${lang==='pt'?(p.n===1?'peça':'peças'):(p.n===1?'piece':'pieces')}`:esc(p.titulo);
   return `<li data-novidade="${p.id}"><time datetime="${p.data}" data-nonledger="data-editorial" data-data-origem="${p.origem}">${forma(p.data)}</time><span class="pp-novidade-tipo">${p.dossie?(lang==='pt'?'dossiê':'dossier'):FP1[lang][p.tipo]}</span><a href="${p.rota}" data-novidade-porta ${p.dossie?`data-novidade-dossie="${p.dossie.slug}"`:''}>${texto}</a></li>`;
  }).join(''));
}

export function cenarioDossie(html,lang,dist) {
 const root=parse(html), manifesto=structuredClone(lerManifesto());
 for(const e of manifesto.edicoes)for(const v of e.edicoes)if(v.natureza==='atualizacao')v.natureza='correcao';
 const publicacoes=publicacoesEsperadas(lang,manifesto);
 renderNovidades(root,lang,publicacoes);
 assert(root.querySelector('[data-novidade-dossie]'),'DO4: cenário com dossiê');
 assert.deepEqual(conferirNovidades(root,lang,dist,publicacoes),[]);
 return {html:root.outerHTML,publicacoes};
}
export function cenarioFp3(html,lang,dist,semAtualizacao=false) {
 const manifesto=structuredClone(lerManifesto());
 const root=parse(html);
 const render=publicacoes=>renderNovidades(root,lang,publicacoes);
 if(semAtualizacao){
  for(const e of manifesto.edicoes)for(const v of e.edicoes)if(v.natureza==='atualizacao')v.natureza='correcao';
  const sem=publicacoesEsperadas(lang,manifesto);render(sem);
  assert.equal(root.querySelectorAll('[data-novidade] time[data-data-origem="edicoes.data"]').length,0);
  assert.deepEqual(conferirNovidades(root,lang,dist,sem),[]);
 }
 let sintetica=false;
 if(!root.querySelector('[data-novidade] time[data-data-origem="edicoes.data"]')) {
  const e=manifesto.edicoes.find(e=>e.lang===lang&&e.edicoes.length>1&&!DOSSIES.some(d=>d.pecas.estudos.includes(e.slug)));
  assert(e,'FP3: estudo para a atualização de ensaio');
  const dia=JSON.parse(fs.readFileSync(path.join(dist,'version.json'),'utf8')).construido_em.slice(0,10);
  e.edicoes.push({...e.edicoes.at(-1),data:dia,natureza:'atualizacao'});
  render(publicacoesEsperadas(lang,manifesto));sintetica=true;
 }
 const publicacoes=publicacoesEsperadas(lang,manifesto);
 assert.deepEqual(conferirNovidades(root,lang,dist,publicacoes),[]);
 const atualizadas=root.querySelectorAll('[data-novidade] time[data-data-origem="edicoes.data"]');
 assert(atualizadas.length,'FP3: falta a atualização na caixa de ensaio');
 for(const t of atualizadas)assert.equal(dataEditorialPermitida(t,'home',null,lang,manifesto),true);
 return {html:root.outerHTML,publicacoes,manifesto,sintetica};
}
export function plantasDasNovidades(html,lang,dist,apenasFp3=false,semAtualizacao=false) {
 const cenario=cenarioFp3(html,lang,dist,semAtualizacao);
 const dossie=apenasFp3?null:cenarioDossie(html,lang,dist);


  const plantas=[
    ['FP3 data de atualização diferente do manifesto',r=>{const t=r.querySelector('[data-novidade] time[data-data-origem="edicoes.data"]');t.setAttribute('datetime','2000-01-01');t.set_content('01.01.2000');assert.equal(dataEditorialPermitida(t,'home',null,lang,cenario.manifesto),false);},/data escrita à mão ou diferente/],
    ['FP3 origem de atualização trocada',r=>r.querySelector('[data-novidade] time[data-data-origem="edicoes.data"]').setAttribute('data-data-origem','publicacao.declarada'),/data escrita à mão ou diferente/],
    ['FP3 tipo de atualização trocado',r=>r.querySelector('[data-novidade]:has(time[data-data-origem="edicoes.data"]) .pp-novidade-tipo').set_content(FP1[lang].estudo),/tipo diferente/],
    ['entrada do registo na caixa',r=>r.querySelector('[data-novidade]').setAttribute('data-novidade','atualizacao:registo'),/tipo fora das novidades/],
    ['DO4 data na última coluna',r=>{const li=r.querySelector('[data-novidade^="dossie:"]'),t=li.querySelector('time');const h=t.outerHTML;t.remove();li.insertAdjacentHTML('beforeend',h);},/três colunas/],
    ['DO4 tipo em maiúscula',r=>r.querySelector('[data-novidade^="dossie:"] .pp-novidade-tipo').set_content('Dossier'),/tipo do dossiê/],
    ['DO4 cauda antiga',r=>r.querySelector('[data-novidade^="dossie:"]').insertAdjacentHTML('beforeend',', a mais recente de'),/texto fora/],
    ['DO4 marca editorial retirada',r=>r.querySelector('[data-novidade^="dossie:"] time').removeAttribute('data-nonledger'),/marca editorial/],
    ['contagem sem token',r=>r.querySelector('[data-novidades] [data-prova]').removeAttribute('data-prova'),/contagem sem token/],
    ['dossiê repetido',r=>r.querySelector('[data-novidades] ol').insertAdjacentHTML('beforeend',r.querySelector('[data-novidade^="dossie:"]').outerHTML),/quantidade|ordem/],
    ['marca novo retirada ou indevida',r=>{const marca=r.querySelector('[data-estudo-novo]');if(marca)marca.remove();else {const estudo=r.querySelector('#trabalhos [data-estudo]');assert(estudo);estudo.insertAdjacentHTML('beforeend',`<span data-estudo-novo>${FP1[lang].novo}</span>`);}},/FP1: marca novo diferente da data impressa/],
    ['dossiê da novidade trocado',r=>r.querySelector('[data-novidade-dossie]').setAttribute('href','/dossies/inexistente/'),/dossiê diferente/],
    ['dossiê da novidade retirado',r=>r.querySelector('[data-novidade-dossie]').remove(),/dossiê diferente/],
    ['título da peça trocado',r=>r.querySelector('[data-novidade-porta]').set_content('Título inventado'),/título da peça/],
    ['entrada sem página',r=>r.querySelector('[data-novidade-porta]').setAttribute('href','/pagina-fp1-inexistente'),/sem página/],
    ['data no futuro',r=>r.querySelector('[data-novidade] time').setAttribute('datetime','9999-12-31'),/futuro/],
    ['ordem trocada',r=>{const a=r.querySelectorAll('[data-novidade]');const s=a[0].outerHTML;a[0].replaceWith(a[1].outerHTML);a[1].replaceWith(s);},/ordem/],
    ['peça mais recente em falta',r=>r.querySelector('[data-novidade]').remove(),/mais recente/],
    ['data escrita à mão no HTML',r=>{const t=r.querySelector('[data-novidade] time');t.replaceWith(t.textContent);},/escrita à mão/],
  ];
  const resultado=(apenasFp3?plantas.slice(0,3):plantas).map(([nome,mudar,queixa],i)=>{const fp3=i<3,do4=/DO4|dossiê|contagem sem token/.test(nome),base=fp3?cenario:do4?dossie:null,r=parse(base?.html??html);mudar(r);const erros=conferirNovidades(r,lang,dist,base?.publicacoes??publicacoesEsperadas(lang));return {nome,lang,cenario:do4?'planta':fp3?(cenario.sintetica?'planta':'real'):'real',mordeu:erros.some(e=>queixa.test(e))};});
  if(apenasFp3)return resultado;
  const todas=dossie.publicacoes, gerada=todas.find(p=>p.origem==='publicacao.gerada');assert(gerada);
  const fonte=todas.map(p=>p.id===gerada.id?{...p,data:todas[1].data}:p).sort((a,b)=>b.data.localeCompare(a.data)||Number(b.id.startsWith('estudo:'))-Number(a.id.startsWith('estudo:'))||a.id.localeCompare(b.id));
  assert(fonte.slice(0,5).some(p=>p.id===gerada.id));
  const erros=conferirNovidades(parse(dossie.html),lang,dist,fonte);
  resultado.push({nome:'estudo com data gerada recente ausente',lang,mordeu:erros.some(e=>/seleção/.test(e))});
  return resultado;
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  provarDatasDaMarcaNovo();
  const dist=process.env.OEDP_DIST ?? 'dist'; const plantas=[];
  const grupo={slug:'ensaio',recente:'2026-10-29',origemRecente:'escrita.declarada'};
  const fora={id:'estudo:fora',tipo:'estudo',data:'2026-10-28',origem:'publicacao.declarada',rota:'/fora/',titulo:'Fora'};
  const quatro=Array.from({length:4},(_,i)=>({id:`discussao:${i}`,tipo:'discussao',dossie:grupo,data:'2026-10-27'}));
  const unidas=agruparNovidades([quatro[0],fora,...quatro.slice(1)],[grupo],'pt');
  assert.equal(unidas.length,2);assert.equal(unidas[0].data,grupo.recente);assert.equal(unidas[0].origem,grupo.origemRecente);assert.strictEqual(unidas[1],fora);
  assert.equal(agruparNovidades([...quatro,...Array.from({length:6},(_,i)=>({...fora,id:`fora:${i}`}))],[grupo],'pt').length,5);
  plantas.push({nome:'quatro peças dão uma entrada, conservam a data e a peça exterior e deixam cinco entradas',mordeu:true});
  assert.throws(()=>agruparNovidades([{id:'atualizacao:registo',tipo:'atualizacao'}],[],'pt'),/tipo fora das novidades/);
  plantas.push({nome:'entrada do registo empurrada para as novidades',mordeu:true});
  assert.equal(estadoDoInventario('condicional-fp1','fp1','under discussion'),'condicional-fp1');
  assert.equal(estadoDoInventario('condicional-fp1','outro','under discussion'),null);
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
    const cenario=cenarioFp3(html,lang,dist);
    const atualizadas=parse(cenario.html).querySelectorAll('[data-novidade] time[data-data-origem="edicoes.data"]');
    assert(atualizadas.length,'FP3: falta a atualização na caixa');
    for(const t of atualizadas)assert.equal(dataEditorialPermitida(t,'home',null,lang,cenario.manifesto),true);
    const manifesto=cenario.manifesto, publicadas=pecasPublicadas(lang,manifesto);
    assert.deepEqual(TIPOS_DAS_NOVIDADES,['estudo','estudo-atualizado','discussao','explicacao','dossie']);
    for(const p of publicadas.filter(p=>p.tipo==='estudo-atualizado')) {
      const w=WORKS.find(w=>p.id===`estudo:${w.slug}`), e=w.editions.find(e=>e.lang===lang)??(w.editions.length===1?w.editions[0]:null);assert(e);
      const copia=structuredClone(manifesto), atual=copia.edicoes.find(d=>d.slug===w.slug&&d.lang===e.lang).edicoes.slice(1).findLast(v=>v.natureza==='atualizacao');
      const comCorrecao=structuredClone(manifesto);
      comCorrecao.edicoes.find(d=>d.slug===w.slug&&d.lang===e.lang).edicoes.push({...atual,natureza:'correcao'});
      const depoisDaCorrecao=pecasPublicadas(lang,comCorrecao).find(q=>q.id===p.id);
      for(const campo of ['data','tipo','origem','rota'])assert.equal(depoisDaCorrecao[campo],p[campo]);
      for(const v of copia.edicoes.find(d=>d.slug===w.slug&&d.lang===e.lang).edicoes.slice(1))if(v.natureza==='atualizacao')v.natureza='correcao';
      atual.natureza='correcao';
      const corrigida=pecasPublicadas(lang,copia).find(q=>q.id===p.id);
      assert.equal(corrigida.tipo,'estudo');assert.equal(corrigida.data,dataPublicacao(w,e));assert.equal(corrigida.rota,p.rota);
      const anteriores=copia.edicoes.find(d=>d.slug===w.slug&&d.lang===e.lang).edicoes;
      anteriores[0].natureza='atualizacao';
      assert.equal(pecasPublicadas(lang,copia).find(q=>q.id===p.id).tipo,'estudo','FP3: a primeira edição não é uma atualização');
      atual.natureza='atualizacao';
      atual.data=ITENS[0].publicado;
      const empatadas=pecasPublicadas(lang,copia).filter(q=>q.data===atual.data);
      assert(empatadas.some(q=>q.tipo==='estudo-atualizado'));
      assert(empatadas.some(q=>q.tipo==='discussao'));
      const semEstudos=empatadas.findIndex(q=>!q.id.startsWith('estudo:'));
      assert(semEstudos>0);assert(empatadas.slice(semEstudos).every(q=>!q.id.startsWith('estudo:')));
      const estudos=empatadas.slice(0,semEstudos).map(q=>q.id);assert.deepEqual(estudos,[...estudos].sort((a,b)=>a.localeCompare(b)));
    }
    plantas.push({nome:'FP3 correção conserva publicação, tipo, ligação e desempate',lang,mordeu:true});
    plantas.push(...plantasDasNovidades(html,lang,dist));
    plantas.push(...plantasDasNovidades(html,lang,dist,true,true));
    const l1=parse(cenarioDossie(html,lang,dist).html);assert.deepEqual(conferirPortasDasNovidades(l1),[]);
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
