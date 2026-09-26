/** RP1: composição da catraca, comparada com a prova congelada do B2. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { matchPath, normalizePath, routePath } from '../../../../src/lib/routes.mjs';
import { ANCORA_DA_POLITICA } from '../../../../src/data/politica-ia.mjs';
import { verificaVeredictoDoPais } from '../../../../scripts/pais-veredicto.mjs';
import { verificaCartaoDasCamaras } from '../../../../scripts/pais-camaras.mjs';


const AQUI=path.dirname(fileURLToPath(import.meta.url));
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const paginasDe = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? paginasDe(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : []).sort();
const semCor = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
function listaDoPortao(s) {
  const paginas = {};
  const texto = semCor(s);
  const total = texto.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto (\d+)\)/);
  if (!total) throw new Error('A régua não imprimiu a medição L1; uma exceção antes da contagem não é uma medição.');
  for (const l of texto.split('\n')) {
    const m = l.match(/^\s+· (\S+) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/);
    if (m) paginas[m[1]] = { destinos: Number(m[2]), exemplo: m[3], vezes: Number(m[4]) };
  }
  if (Object.keys(paginas).length !== Number(total[1])) throw new Error(`Amostra incompleta: ${Object.keys(paginas).length} páginas para ${total[1]} contadas.`);
  return { total: Number(total[1]), teto: Number(total[2]), paginas };
}
function composicao(dist, b2 = false) {
  const paginas = {}, todas = [], falhas = [], semRota = new Set(['404.html', 'en/404/index.html']);
  for (const f of paginasDe(dist)) {
    const rel = path.relative(dist, f).split(path.sep).join('/');
    if (semRota.has(rel)) continue;
    const url = normalizePath('/' + rel.replace(/index\.html$/, '').replace(/\.html$/, ''));
    const rota = matchPath(url), lang = rota?.lang ?? (rel.startsWith('en/') ? 'en' : 'pt');
    const root = parse(fs.readFileSync(f, 'utf8'));
    const corpo = root.querySelector('body');
    if (!corpo) continue;
    todas.push(url);
    // A composição não chama o helper da L1. Reconhece a lista fechada de
    // nós obrigatórios só depois das conferências V1/V2, as mesmas que
    // protegem contagens, nomes e portas. Qualquer âncora extra é contada.
    // O antes usa a regra original, sem este reconhecimento do B2.
    const obrigatorias = new Set();
    if (b2 && ['home', 'temas'].includes(rota?.key)) {
      const erros = verificaCartaoDasCamaras(root, lang);
      if (rota.key === 'home') {
        const ficheiroTemas = path.join(dist, lang === 'pt' ? 'temas/index.html' : 'en/themes/index.html');
        erros.push(...verificaVeredictoDoPais(root, parse(fs.readFileSync(ficheiroTemas, 'utf8')), lang));
      }
      falhas.push(...erros.map(erro => `${url}: ${erro}`));
      if (!erros.length) {
        const veredicto = root.querySelector('main [data-veredicto-pais]');
        for (const chave of ['painel_fora_do_limiar', 'painel_com_limiar', 'painel_dentro_do_limiar']) {
          const a = veredicto?.querySelector(`a[data-prova="${chave}"]`);
          if (a) obrigatorias.add(a);
        }
        for (const a of veredicto?.querySelectorAll('a[data-veredicto-medida]') ?? []) obrigatorias.add(a);
        const camaras = root.querySelector('main [data-cartao-camaras]');
        for (const chave of ['camaras_acima_do_limite', 'municipios_com_pagina', 'camaras_dentro_do_limite', 'camaras_sem_valor']) {
          const a = camaras?.querySelector(`a[data-prova="${chave}"]`);
          if (a) obrigatorias.add(a);
        }
        const a = camaras?.querySelector('.pais-porta-tema a');
        if (a) obrigatorias.add(a);
      }
    }
    const mobilia = new Set();
    for (const m of [root.querySelector('header'), root.querySelector('footer')]) if (m) { mobilia.add(m); for (const x of m.querySelectorAll('*')) mobilia.add(x); }
    const destinos = new Map();
    for (const a of corpo.querySelectorAll('a[href]')) {
      if (mobilia.has(a) || obrigatorias.has(a) || (rota?.key === 'estudo' && a.closest('[data-registo-unidade]'))) continue;
      const href = a.getAttribute('href') ?? '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) continue;
      if (a.matches('a.marcador') && a.closest('[data-cartao-definicao]') && href === routePath('marcador', lang)) continue;
      if (a.closest('[data-rotulo-ia="topo"]') && href === `${routePath('metodo', lang)}#${ANCORA_DA_POLITICA}`) continue;
      if (a.matches('a.marcador.marcador-de-titulo') && href === routePath('marcador', lang)) continue;
      const chave = href.split('#')[0].replace(/\/$/, '') || (href.startsWith('/') ? '/' : '');
      if (!chave) continue;
      if (!destinos.has(chave)) destinos.set(chave, []);
      destinos.get(chave).push({ href, texto: a.textContent.replace(/\s+/g, ' ').trim(), classe: a.getAttribute('class') ?? '', cartao: a.closest('[data-cartao-medida]')?.getAttribute('data-cartao-medida') ?? null });
    }
    const repetidos = [...destinos].filter(([, as]) => as.length > 1);
    if (repetidos.length) paginas[url] = { familia: rota?.key ?? '(sem rota)', destinos: repetidos.length, repetidos: Object.fromEntries(repetidos.map(([destino, as]) => [destino, { vezes: as.length, ancoras: as }])) };
  }
  return { todas, paginas, falhas };
}
function conferir(composicao, oficial) {
  const ks = Object.keys(composicao.paginas).sort(), os = Object.keys(oficial.paginas).sort();
  if (JSON.stringify(ks) !== JSON.stringify(os)) throw new Error('A composição e a L1 original não contam as mesmas páginas.');
  for (const k of ks) if (composicao.paginas[k].destinos !== oficial.paginas[k].destinos) throw new Error(`${k}: a composição e a L1 não contam os mesmos destinos.`);
}

const referencia='design/especime-v3/medicoes/b2-2026-09-23/l1-depois.json';
const base=json(referencia), antes=base.composicao, depois=composicao('dist',true);
if(depois.falhas.length)throw Error(depois.falhas.join('\n'));
const novas=execFileSync('git',['diff','--name-only','--diff-filter=A','38d3627894416097de26c52346c595c45a7b2884','--','ledger/claims'],{encoding:'utf8'}).trim().split('\n').map(p=>path.basename(p,'.yml'));
const permitidas=new Set(novas.flatMap(id=>['/livro-razao/'+id,'/en/ledger/'+id]));
const entraram=Object.keys(depois.paginas).filter(p=>!antes.paginas[p]);
const sairam=Object.keys(antes.paginas).filter(p=>!depois.paginas[p]);
const agravadas=Object.keys(antes.paginas).filter(p=>depois.paginas[p]&&depois.paginas[p].destinos>antes.paginas[p].destinos);
const fora=entraram.filter(p=>!permitidas.has(p));
const saida={referencia,referencia_cabeca:base.cabeca,dist_construido_de:json('dist/version.json').commit,
 contagens:{estudos:Object.keys(depois.paginas).length,antes:Object.keys(antes.paginas).length,entraram:entraram.length,sairam:sairam.length,paginas_antigas_agravadas:agravadas.length,outras_entradas:fora.length},
 entraram:entraram.map(p=>({url:p,...depois.paginas[p]})),sairam,agravadas,fora};
fs.writeFileSync(path.join(AQUI,'l1-rp1.json'),JSON.stringify(saida,null,2)+'\n');
if(fora.length||sairam.length||agravadas.length||entraram.length!==permitidas.size)throw Error('Crescimento fora dos recibos novos: '+JSON.stringify(saida.contagens));
console.log(JSON.stringify(saida.contagens));
