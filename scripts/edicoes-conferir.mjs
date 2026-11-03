import fs from 'node:fs';
import {loadClaims} from '../src/lib/ledger.mjs';
import {partesDaCorrecao} from '../src/lib/texto-correcao.mjs';
import {textoDaMudancaGate} from './texto-mudanca-gate.mjs';
import {conferirHistoria} from './historia-edicoes-conferir.mjs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { provaDosBytesDaEdicao } from '../src/lib/leis-da-edicao.mjs';
export const EXCECOES_EDICOES = [
  ['evora-quinze-anos-cinco-mandatos', 'pt', '2026-08-20'],
  ['evora-orcamentado-pago-devido-2025', 'pt', '2026-08-20'],
  ['evora-orcamentado-pago-devido-2025', 'en', '2026-08-20'],
  ['evora-prometido-pago-auditado-2026', 'pt', '2026-08-20'],
  ['evora-prometido-pago-auditado-2026', 'en', '2026-08-20'],
  ['penalizacoes-por-reforma-antecipada-2026', 'pt', '2026-09-23'],
].map(([slug, lang, updated]) => ({slug, lang, updated,
  razao: 'anteriores ao registo do texto dos estudos, que começa a 30.10.2026'}));
const sha = b => createHash('sha256').update(b).digest('hex');
const normal = s => String(s ?? '').replace(/\s+/g, ' ').trim();
export const rotaAtual = (slug, lang) => `${lang === 'pt' ? '/estudos' : '/en/studies'}/${slug}/${lang === 'pt' ? 'documento' : 'document'}`;
export const rotaPrimeira = (e) => `${rotaAtual(e.slug,e.lang)}/${e.edicoes?.[0]?.data ?? e.primeira_edicao.date}`;
export function conferirEdicoes({works, manifesto, correcoes, raiz, paginas = null}) {
  const erros = conferirHistoria({works,manifesto,correcoes,raiz}), vistas = new Set();
  for (const w of works) for (const d of w.editions) {
    const declaracao=manifesto.edicoes.find(e=>e.slug===w.slug&&e.lang===d.lang);
    if ((declaracao?.edicoes?.length??0)<2) continue;
    const chave = `${w.slug}/${d.lang}`;

    const e = manifesto.edicoes.find(e => e.slug === w.slug && e.lang === d.lang), p = e?.primeira_edicao;
    if (!p || !p.file?.startsWith('_edicoes/') || p.file.includes('..') || p.date !== d.date || !/^[a-f0-9]{64}$/.test(p.sha256 ?? '')) {
      erros.push(`ED1 arquivo: ${chave} sem primeira edição válida`); continue;
    }
    const file = path.join(raiz,p.file);
    if (!fs.existsSync(file) || sha(fs.readFileSync(file)) !== p.sha256) erros.push(`ED1 sha256: ${chave}`);
    if (!correcoes.some(c => c.kind === 'texto' && c.slug === w.slug && c.data === declaracao.edicoes.at(-1).data)) erros.push(`ED1 entrada: ${chave} sem correção na data ${d.updated}`);
    if (paginas) {
      for(const v of e.edicoes.slice(0,-1)){
        const html=paginas.get(`${rotaAtual(e.slug,e.lang)}/${v.data}`),arquivo=path.join(raiz,v.file);
        if(!html||!fs.existsSync(arquivo)||provaDosBytesDaEdicao(fs.readFileSync(arquivo,'utf8'),html,d.lang))erros.push(`ED1 servido: ${chave}/${v.data} diverge da edição guardada`);
      }
      const pagina = paginas.get(`${d.lang === 'pt' ? '/estudos' : '/en/studies'}/${w.slug}`);
      const faixa = pagina && parse(pagina).querySelector(`[data-estudo-edicao="${chave}"]`);
      const links = faixa?.querySelectorAll('a[href]') ?? [];
      const labels = d.lang === 'pt' ? ['Primeira edição, tal como foi publicada','Edição atual'] : ['First edition, as published','Current edition'];
      if (links.length !== 2 || links.some((a,i) => normal(a.textContent) !== labels[i] || a.getAttribute('href')?.replace(/\/$/,'') !== [rotaPrimeira(e),rotaAtual(w.slug,d.lang)][i])) erros.push(`ED1 portas: ${chave}`);
    }
  }
  for (const c of correcoes) {
    const chave = `${c.slug}|${c.data}`, w = works.find(w => w.slug === c.slug);
    if (c.kind !== 'texto' || !w || !manifesto.edicoes.some(e=>e.slug===c.slug&&e.edicoes?.slice(1).some(v=>v.data===c.data)) || !c.frase?.pt || !c.frase?.en || vistas.has(chave)) erros.push(`ED1 órfã: ${chave}`);
    vistas.add(chave);
  }
  if (paginas) for (const [rota,html] of paginas) {
    const root = parse(html);
    for (const a of root.querySelectorAll('a[href]')) {
      if (!['Edição tal como foi publicada','Edition as published','Primeira edição, tal como foi publicada','First edition, as published'].includes(normal(a.textContent))) continue;
      const destino=a.getAttribute('href')?.replace(/\/$/,'');
      const e=manifesto.edicoes.find(e=>destino===(e.edicoes?.length>1?rotaPrimeira(e):rotaAtual(e.slug,e.lang)));
      if(!e)erros.push(`ED1 rótulo: ${rota} liga a ${destino}`);
    }
  }
  return erros;
}

/** Cada campo visível tem comparação própria. O portão só dispensa algarismos depois dela. */
export function conferirTextoHtml(root, lang, works, correcoes, manifesto, claims=loadClaims()) {
  const erros = [], campos = [];
  for (const li of root.querySelectorAll('[data-texto-estudo]')) {
    const slug = li.getAttribute('data-texto-estudo'), data = li.getAttribute('data-texto-data');
    const c = correcoes.find(c => c.slug === slug && c.data === data), w = works.find(w => w.slug === slug);
    const e = manifesto.edicoes.find(e => e.slug === slug && e.lang === lang);
    const titulo = w?.editions.find(d => d.lang === lang)?.title;
    if (!c || !titulo || !e?.primeira_edicao) {erros.push(`ED1 texto: entrada desconhecida ${slug}`);continue;}
    const partes=partesDaCorrecao(c,lang),frase=textoDaMudancaGate(partes,claims,true);
    if(frase===null||frase!==c.frase[lang])erros.push(`ED1 números: ${slug} frase sem origem selada`);
    const valores = {data: data.split('-').reverse().join('.'), titulo, frase:frase??c.frase[lang], kind:lang === 'pt' ? 'Estudo corrigido' : 'Study corrected'};
    for (const [campo,valor] of Object.entries(valores)) {
      const els = li.querySelectorAll(`[data-texto-campo="${campo}"]`);
      if (els.length !== 1 || normal(textoSemPortas(els[0])) !== normal(valor) || (campo === 'data' && els[0].getAttribute('datetime') !== data)) erros.push(`ED1 texto: ${slug} campo ${campo}`);
      else {if(campo==='frase')erros.push(...conferirNumerosDaCorrecao(els[0],claims,lang));campos.push(els[0]);}
    }
    const vs=e.edicoes,i=vs.findIndex(v=>v.data===data);
    if(i<1){erros.push(`ED1 texto: ${slug} sem par de versões`);continue;}
    const rotaDaVersao=n=>n===vs.length-1?rotaAtual(slug,lang):`${rotaAtual(slug,lang)}/${vs[n].data}`;
    const rotuloDaVersao=n=>n===0?(lang==='pt'?'Primeira edição':'First edition'):n===vs.length-1?(lang==='pt'?'Edição atual':'Current edition'):(lang==='pt'?'Edição de ':'Edition of ')+vs[n].data.split('-').reverse().join('.');
    for (const [porta,rota,label] of [['primeira',rotaDaVersao(i-1),rotuloDaVersao(i-1)],['atual',rotaDaVersao(i),rotuloDaVersao(i)]]) {
      const links = li.querySelectorAll(`[data-texto-porta="${porta}"]`);
      if (links.length !== 1 || links[0].getAttribute('href') !== rota || normal(links[0].textContent) !== label) erros.push(`ED1 texto: ${slug} porta ${porta}`);
    }
    if(li.querySelectorAll('[data-texto-campo]').length !== 4) erros.push(`ED1 texto: ${slug} campos a mais`);
  }
  for(const el of root.querySelectorAll('[data-texto-campo]')) if(!el.closest('[data-texto-estudo]')) erros.push('ED1 texto: campo sem entrada');
  return {erros,campos};
}

/** A segunda conta usa as naturezas das entradas, sem chamar a contagem da vista. */
export function contagemDasCorrecoesNoPortao(correcoesDoLivro, textos) {
  return correcoesDoLivro + textos.filter(e => e.kind === 'texto').length;
}

function textoSemPortas(el){const copia=parse(el.outerHTML);for(const p of copia.querySelectorAll('.src-chip'))p.remove();return copia.textContent;}
export function conferirNumerosDaCorrecao(el,claims,lang){
 const copia=parse(el.outerHTML),erros=[];
 const prefixo=lang==='pt'?'/livro-razao/':'/en/ledger/';
 const datas=copia.querySelectorAll('[data-nonledger="data-da-linha"]');
 for(const id of new Set(datas.map(d=>d.getAttribute('data-de-linha')))){
  if(copia.querySelectorAll(`a.src-chip[href="${prefixo}${id}"]`).length<datas.filter(d=>d.getAttribute('data-de-linha')===id).length)erros.push('ED1 números: cada data exige o seu selo');
 }
 for(const data of datas){
  const id=data.getAttribute('data-de-linha'),campo=data.getAttribute('data-de-campo'),linha=claims.get(id);
  if(campo!=='reference_date'||!linha||data.textContent.trim()!==linha.reference_date||!copia.querySelector(`a.src-chip[href="${prefixo}${id}"]`))erros.push('ED1 números: data sem campo e selo correspondentes');
  else data.remove();
 }
 for(const valor of copia.querySelectorAll('[data-claim]')){
  const id=valor.getAttribute('data-claim'),linha=claims.get(id);
  if(!linha||normal(valor.textContent)!==normal(String(linha.value))||!copia.querySelector(`a.src-chip[href="${prefixo}${id}"]`))erros.push('ED1 números: valor sem linha e selo correspondentes');
  else valor.remove();
 }
 for(const selo of copia.querySelectorAll('.src-chip'))selo.remove();
 if(/\d/.test(copia.textContent))erros.push('ED1 números: algarismo sem valor ou data selada');
 if(lang==='en')for(const nome of ['Partido Socialista','Unidade Técnica de Apoio Orçamental','pelo menos'])if(el.textContent.includes(nome)&&!el.querySelectorAll('[lang="pt-PT"]').some(n=>n.textContent===nome))erros.push('ED1 língua: nome português sem marca');
 return erros;
}
