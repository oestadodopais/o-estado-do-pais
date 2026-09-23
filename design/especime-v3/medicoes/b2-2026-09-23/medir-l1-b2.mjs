#!/usr/bin/env node
/** B2: a L1 antes e depois, sem mudar o teto nem construir páginas.
 * node design/especime-v3/medicoes/b2-2026-09-23/medir-l1-b2.mjs preparar [dist-antes] [commit]
 * node design/especime-v3/medicoes/b2-2026-09-23/medir-l1-b2.mjs antes
 * node design/especime-v3/medicoes/b2-2026-09-23/medir-l1-b2.mjs depois [--trabalho]
 * node design/especime-v3/medicoes/b2-2026-09-23/medir-l1-b2.mjs comparar [--trabalho]
 *
 * O antes corre o check:lugar original de git archive, com dist e dependências
 * por ligação simbólica. O depois corre a régua atual. A composição lê todos
 * os destinos repetidos, com o mesmo corte da L1, e exige as mesmas páginas e
 * contagens da régua. Uma página antiga pode piorar sem aumentar o total da
 * catraca: a comparação regista também esse agravamento. Só recibos de linhas
 * novas podem justificar crescimento; os outros casos saem vermelhos.
 */
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

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../../..');
const prepararJson = path.join(AQUI, 'l1-preparacao.json');
const acao = process.argv[2];
const trabalho = process.argv.includes('--trabalho');
if (trabalho && !['depois', 'comparar'].includes(acao)) throw new Error('--trabalho só se aplica ao depois e à sua comparação.');
const sha = (b) => createHash('sha256').update(b).digest('hex');
const git = (...args) => execFileSync('git', args, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }).trim();
const json = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const escreve = (p, d) => fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
const tetos = json(path.join(RAIZ, 'scripts/lugar-tetos-b1.json'));
if (trabalho && path.resolve(RAIZ, tetos.medicao) === path.join(AQUI, 'l1-b2-trabalho.json')) {
  throw new Error('A medição de trabalho já fundamenta o teto e conserva-se intacta. A medição final usa depois e comparar sem --trabalho.');
}
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
if (acao === 'preparar') {
  const dist = path.resolve(process.argv[3] ?? '/tmp/oedp-b2-antes-7f658299');
  const cabeca = git('rev-parse', process.argv[4] ?? '7f658299');
  const versao = json(path.join(dist, 'version.json'));
  if (versao.commit !== cabeca) throw new Error('O dist do antes não é da cabeça pedida.');
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-b2-l1-antes-'));
  const arvore = path.join(pasta, 'arvore'), tar = path.join(pasta, 'origem.tar');
  fs.mkdirSync(arvore);
  execFileSync('git', ['archive', '--format=tar', `--output=${tar}`, cabeca], { cwd: RAIZ });
  execFileSync('tar', ['-xf', tar, '-C', arvore]);
  fs.unlinkSync(tar);
  fs.symlinkSync(path.join(RAIZ, 'node_modules'), path.join(arvore, 'node_modules'), 'dir');
  fs.symlinkSync(dist, path.join(arvore, 'dist'), 'dir');
  const script = path.join(arvore, 'scripts/check-lugar.mjs');
  const esperado = sha(execFileSync('git', ['show', `${cabeca}:scripts/check-lugar.mjs`], { cwd: RAIZ }));
  if (sha(fs.readFileSync(script)) !== esperado) throw new Error('A régua extraída difere dos bytes do commit.');
  escreve(prepararJson, { preparado_em: new Date().toISOString(), cabeca, arvore, dist, dist_construido_em: versao.construido_em, regua_sha256: esperado, comando: `git archive ${cabeca}`, sem_checkout: true });
  console.log(`Antes preparado em ${arvore}; check:lugar ainda não correu.`);
} else if (acao === 'antes' || acao === 'depois') {
  const prep = json(prepararJson);
  const arvore = acao === 'antes' ? prep.arvore : RAIZ;
  const dist = acao === 'antes' ? prep.dist : path.join(RAIZ, 'dist');
  const versao = trabalho ? null : json(path.join(dist, 'version.json'));
  if (acao === 'antes' && versao.commit !== prep.cabeca) throw new Error('A origem do dist do antes mudou.');
  if (acao === 'depois' && !trabalho && versao.commit !== git('rev-parse', 'HEAD')) throw new Error('O dist final não foi construído da cabeça atual. Use --trabalho para uma medição exploratória, sem cabeça atribuída à construção.');
  const script = path.join(arvore, 'scripts/check-lugar.mjs');
  const resumo = sha(fs.readFileSync(script));
  if (acao === 'antes' && resumo !== prep.regua_sha256) throw new Error('A régua do antes mudou depois da preparação.');
  const fase = acao + (trabalho ? '-trabalho' : '');
  const prefixo = path.join(AQUI, `l1-${fase}-check-lugar`);
  fs.rmSync(prefixo + '.codigo', { force: true });
  const inicio = new Date();
  const r = spawnSync(process.execPath, ['scripts/check-lugar.mjs'], { cwd: arvore, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env: { ...process.env, AMOSTRA: '100000' } });
  const fim = new Date();
  fs.writeFileSync(prefixo + '.txt', (r.stdout ?? '') + (r.stderr ?? ''));
  fs.writeFileSync(prefixo + '.inicio', inicio.toISOString() + '\n');
  fs.writeFileSync(prefixo + '.fim', fim.toISOString() + '\n');
  if (r.status === null) throw new Error(`A régua não terminou: ${r.error?.message ?? r.signal}`);
  fs.writeFileSync(prefixo + '.codigo', String(r.status) + '\n');
  const oficial = listaDoPortao((r.stdout ?? '') + (r.stderr ?? ''));
  const comp = composicao(dist, acao === 'depois');
  conferir(comp, oficial);
  const claims = fs.readdirSync(path.join(arvore, 'ledger/claims')).filter(f => f.endsWith('.yml')).map(f => f.slice(0, -4)).sort();
  escreve(path.join(AQUI, `l1-${fase}.json`), { estado: acao, trabalho, estatuto: trabalho ? 'árvore de trabalho, sem atribuir a construção a um commit' : 'construção com versão do commit conferida', cabeca: acao === 'antes' ? prep.cabeca : git('rev-parse', 'HEAD'), dist_construido_de: versao?.commit ?? null, dist_construido_em: versao?.construido_em ?? null, codigo: r.status, inicio: inicio.toISOString(), fim: fim.toISOString(), segundos: (fim - inicio) / 1000, regua_sha256: resumo, log_sha256: sha(fs.readFileSync(prefixo + '.txt')), oficial, composicao: comp, linhas: claims });
  console.log(`L1 ${acao}: ${oficial.total} páginas; régua saiu com ${r.status}; composição conferida integralmente.`);
  if (comp.falhas.length) {
    console.error(comp.falhas.join('\n'));
    process.exitCode = 1;
  }
} else if (acao === 'comparar') {
  const a = json(path.join(AQUI, 'l1-antes.json')), d = json(path.join(AQUI, `l1-depois${trabalho ? '-trabalho' : ''}.json`));
  const antes = a.composicao.paginas, depois = d.composicao.paginas;
  const todasAntes = new Set(a.composicao.todas), novasLinhas = d.linhas.filter(id => !a.linhas.includes(id));
  const novosRecibos = new Set(novasLinhas.flatMap(slug => ['pt', 'en'].map(lang => routePath('linha', lang, { slug }))));
  const entraram = Object.keys(depois).filter(u => !antes[u]).sort().map(url => ({ url, ...depois[url], pagina_nova: !todasAntes.has(url), recibo_de_linha_nova: novosRecibos.has(url) }));
  const sairam = Object.keys(antes).filter(u => !depois[u]).sort();
  const alteradas = [], agravadas = [];
  for (const url of d.composicao.todas.filter(u => todasAntes.has(u))) {
    const ar = antes[url]?.repetidos ?? {}, dr = depois[url]?.repetidos ?? {};
    const destinos = [...new Set([...Object.keys(ar), ...Object.keys(dr)])].sort();
    const mudancas = destinos.filter(k => (ar[k]?.vezes ?? 0) !== (dr[k]?.vezes ?? 0)).map(destino => ({ destino, antes: ar[destino]?.vezes ?? 0, depois: dr[destino]?.vezes ?? 0 }));
    if (mudancas.length) alteradas.push({ url, mudancas });
    const piores = mudancas.filter(m => m.depois > m.antes);
    if (piores.length) agravadas.push({ url, mudancas: piores });
  }
  const outros = entraram.filter(e => !e.recibo_de_linha_nova || !e.pagina_nova);
  const familia = m => { const r = {}; for (const p of Object.values(m)) r[p.familia] = (r[p.familia] ?? 0) + 1; return r; };
  const resultado = { cabeca: d.cabeca, trabalho: d.trabalho ?? false, estatuto: d.estatuto, dist_construido_de: d.dist_construido_de, antes_cabeca: a.cabeca, regua: 'check:lugar original de cada árvore, AMOSTRA=100000, com composição independente conferida', codigos: { antes: a.codigo, depois: d.codigo }, contagens: { estudos: d.oficial.total, antes: a.oficial.total, entraram: entraram.length, sairam: sairam.length, recibos_de_linhas_novas: entraram.filter(e => e.recibo_de_linha_nova && e.pagina_nova).length, outras_entradas: outros.length, paginas_antigas_agravadas: agravadas.length }, familias: { antes: familia(antes), depois: familia(depois) }, novas_linhas: novasLinhas, entraram, sairam, paginas_antigas_alteradas: alteradas, paginas_antigas_agravadas: agravadas, crescimento_apenas_em_recibos_novos: outros.length === 0 && agravadas.length === 0, segundos: a.segundos + d.segundos };
  escreve(path.join(AQUI, `l1-b2${trabalho ? '-trabalho' : ''}.json`), resultado);
  console.log(`L1: ${a.oficial.total} antes, ${d.oficial.total} depois; ${entraram.length} entradas, ${sairam.length} saídas; ${agravadas.length} páginas antigas agravadas.`);
  for (const m of agravadas) console.log(`AGRAVOU ${m.url}: ${JSON.stringify(m.mudancas)}`);
  if (!resultado.crescimento_apenas_em_recibos_novos) process.exitCode = 1;
} else throw new Error('uso: medir-l1-b2.mjs preparar|antes|depois|comparar');
