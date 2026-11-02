import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { provaDosBytes } from '../src/lib/documentos.mjs';
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
export const rotaPrimeira = (e) => `${rotaAtual(e.slug,e.lang)}/${e.primeira_edicao.date}`;
export function conferirEdicoes({works, manifesto, correcoes, raiz, paginas = null}) {
  const erros = [], vistas = new Set();
  for (const w of works) for (const d of w.editions) {
    if (!d.updated) continue;
    const chave = `${w.slug}/${d.lang}`;
    const excecao = EXCECOES_EDICOES.find(e => e.slug === w.slug && e.lang === d.lang && e.updated === d.updated);
    if (excecao) continue;
    const e = manifesto.edicoes.find(e => e.slug === w.slug && e.lang === d.lang), p = e?.primeira_edicao;
    if (!p || !p.file?.startsWith('_edicoes/') || p.file.includes('..') || p.date !== d.date || !/^[a-f0-9]{64}$/.test(p.sha256 ?? '')) {
      erros.push(`ED1 arquivo: ${chave} sem primeira edição válida`); continue;
    }
    const file = path.join(raiz,p.file);
    if (!fs.existsSync(file) || sha(fs.readFileSync(file)) !== p.sha256) erros.push(`ED1 sha256: ${chave}`);
    if (!correcoes.some(c => c.kind === 'texto' && c.slug === w.slug && c.data === d.updated)) erros.push(`ED1 entrada: ${chave} sem correção na data ${d.updated}`);
    if (paginas) {
      const html = paginas.get(rotaPrimeira(e));
      if (!html || !fs.existsSync(file) || provaDosBytes(fs.readFileSync(file,'utf8'),html)) erros.push(`ED1 servido: ${chave} diverge da primeira edição`);
      const pagina = paginas.get(`${d.lang === 'pt' ? '/estudos' : '/en/studies'}/${w.slug}`);
      const faixa = pagina && parse(pagina).querySelector(`[data-estudo-edicao="${chave}"]`);
      const links = faixa?.querySelectorAll('a[href]') ?? [];
      const labels = d.lang === 'pt' ? ['Primeira edição, tal como foi publicada','Edição atual'] : ['First edition, as published','Current edition'];
      if (links.length !== 2 || links.some((a,i) => normal(a.textContent) !== labels[i] || a.getAttribute('href')?.replace(/\/$/,'') !== [rotaPrimeira(e),rotaAtual(w.slug,d.lang)][i])) erros.push(`ED1 portas: ${chave}`);
    }
  }
  for (const c of correcoes) {
    const chave = `${c.slug}|${c.data}`, w = works.find(w => w.slug === c.slug);
    if (c.kind !== 'texto' || !w || !w.editions.some(d => d.updated === c.data) || !c.frase?.pt || !c.frase?.en || vistas.has(chave)) erros.push(`ED1 órfã: ${chave}`);
    vistas.add(chave);
  }
  if (paginas) for (const [rota,html] of paginas) {
    const root = parse(html);
    for (const a of root.querySelectorAll('a[href]')) {
      if (!['Edição tal como foi publicada','Edition as published','Primeira edição, tal como foi publicada','First edition, as published'].includes(normal(a.textContent))) continue;
      const par = a.closest('[data-estudo-edicao]')?.getAttribute('data-estudo-edicao');
      const e = manifesto.edicoes.find(e => `${e.slug}/${e.lang}` === par);
      const w = works.find(w => w.slug === e?.slug), d = w?.editions.find(d => d.lang === e.lang);
      const destino = a.getAttribute('href')?.replace(/\/$/,'');
      if (!e || destino !== (d?.updated ? (e.primeira_edicao ? rotaPrimeira(e) : null) : rotaAtual(e.slug,e.lang))) erros.push(`ED1 rótulo: ${rota} liga a ${destino}`);
    }
  }
  return erros;
}

/** Cada campo visível tem comparação própria. O portão só dispensa algarismos depois dela. */
export function conferirTextoHtml(root, lang, works, correcoes, manifesto) {
  const erros = [], campos = [];
  for (const li of root.querySelectorAll('[data-texto-estudo]')) {
    const slug = li.getAttribute('data-texto-estudo'), data = li.getAttribute('data-texto-data');
    const c = correcoes.find(c => c.slug === slug && c.data === data), w = works.find(w => w.slug === slug);
    const e = manifesto.edicoes.find(e => e.slug === slug && e.lang === lang);
    const titulo = w?.editions.find(d => d.lang === lang)?.title;
    if (!c || !titulo || !e?.primeira_edicao) {erros.push(`ED1 texto: entrada desconhecida ${slug}`);continue;}
    const valores = {data: data.split('-').reverse().join('.'), titulo, frase:c.frase[lang], kind:lang === 'pt' ? 'Estudo corrigido' : 'Study corrected'};
    for (const [campo,valor] of Object.entries(valores)) {
      const els = li.querySelectorAll(`[data-texto-campo="${campo}"]`);
      if (els.length !== 1 || normal(els[0].textContent) !== normal(valor) || (campo === 'data' && els[0].getAttribute('datetime') !== data)) erros.push(`ED1 texto: ${slug} campo ${campo}`);
      else campos.push(els[0]);
    }
    for (const [porta,rota,label] of [['primeira',rotaPrimeira(e),lang==='pt'?'Primeira edição':'First edition'],['atual',rotaAtual(slug,lang),lang==='pt'?'Edição atual':'Current edition']]) {
      const links = li.querySelectorAll(`[data-texto-porta="${porta}"]`);
      if (links.length !== 1 || links[0].getAttribute('href') !== rota || normal(links[0].textContent) !== label) erros.push(`ED1 texto: ${slug} porta ${porta}`);
    }
    if(li.querySelectorAll('[data-texto-campo]').length !== 4) erros.push(`ED1 texto: ${slug} campos a mais`);
  }
  for(const el of root.querySelectorAll('[data-texto-campo]')) if(!el.closest('[data-texto-estudo]')) erros.push('ED1 texto: campo sem entrada');
  return {erros,campos};
}
