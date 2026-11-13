/** CAM2-A: cobertura exata, registo bilingue e lista que só encolhe. */
import fs from 'node:fs';
import {conferirTrechosCor3} from './trechos-cor3-julgados.mjs';
import {lerTextosJulgados,conferirTextosJulgados} from './textos-julgados.mjs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {loadClaims} from '../src/lib/ledger.mjs';
import {normal, normalDaChave, sha256, chave, lerPaginas, inventario, marcaLeitura, parDaFrase, tiposDaFrase} from './frases-com-afirmacao.mjs';
import {conferirPino} from './frases-pino.mjs';
import {conferirModelos, conferirPinoModelos} from './frases-modelos.mjs';
import {conferirOrigem, conferirSemente} from './frases-origem.mjs';
import {conferirCorpos} from './corpos-ledger.mjs';
const LISTA = 'ledger/frases/por-registar.json';
const BASE = 'd21c48f0b';
export const SEMENTE_SHA256 = 'a00ced4b9eac3c54c57567cdb8824249fcec22dff7c9cc08ed918cd267cef1fd';
export const citacoes = (t, lingua) => [...t.matchAll(lingua === 'pt' ? /«([^»]+)»/gu : /«([^»]+)»|“([^”]+)”|"([^"]+)"/gu)].map(m => m[1] ?? m[2] ?? m[3]);
export const normalExcerto = t => normal(t.replace(/\u00ad/g, '').replace(/(\p{L})-\s*\n\s*(\p{L})/gu, '$1$2').replace(/[‘’]/g, "'").replace(/[“”]/g, '"'));
export function lerRegisto(pasta = 'ledger/frases') {
  return fs.readdirSync(pasta).filter(f => f.endsWith('.json') && !['por-registar.json','textos-julgados.json'].includes(f)).sort().flatMap(f => {
    const registo = JSON.parse(fs.readFileSync(path.join(pasta, f), 'utf8'));
    if (!Array.isArray(registo)) throw new Error('registo: formato inválido');
    return registo;
  });
}
export function validarPendentes(lista) {
  if (!Array.isArray(lista)) throw new Error('por registar: não é uma lista');
  const vistos = new Set();
  for (const f of lista) {
    if (!f || typeof f.estudo !== 'string' || !f.estudo || !['pt','en'].includes(f.lingua) || !/^[a-f0-9]{64}$/.test(f.sha256 ?? '') || Object.keys(f).sort().join(',') !== 'estudo,lingua,sha256' || vistos.has(chave(f))) throw new Error('por registar: entrada inválida ou repetida');
    vistos.add(chave(f));
  }
  return vistos;
}
export function compararListas(antes, depois) {
  const a = validarPendentes(antes), d = validarPendentes(depois);
  return [...d].filter(k => !a.has(k)).map(k => `por registar: entrada nova: ${k}`);
}
export function conferirHistorico(lista, repo = '.', {base = BASE, semente = SEMENTE_SHA256, gitRun} = {}) {
  const git = gitRun ?? ((...args) => execFileSync('git', ['-C', repo, ...args], {encoding:'utf8', stdio:['ignore','pipe','pipe']}).trim());
  if (git('rev-parse', '--is-shallow-repository') !== 'false') throw new Error('por registar: histórico incompleto');
  git('merge-base', '--is-ancestor', base, 'HEAD');
  const ler = rev => {
    if (rev === base || rev.startsWith(base)) return null;
    const existe = git('ls-tree', '--name-only', rev, '--', LISTA);
    return existe ? JSON.parse(git('show', `${rev}:${LISTA}`)) : null;
  };
  const tinhaLista = rev => Boolean(git('rev-list', '-n', '1', `${base}..${rev}`, '--', LISTA));
  const inicial = l => sha256(JSON.stringify(l)) === semente ? [] : ['por registar: primeira lista diferente da semente medida'];
  const erros = [];
  // Todos os commits que tocaram a lista, incluindo aumentos entretanto desfeitos.
  for (const rev of git('rev-list', '--full-history', `${base}..HEAD`, '--', LISTA).split('\n').filter(Boolean)) {
    const atual = ler(rev) ?? [];
    validarPendentes(atual);
    const pais = git('rev-list', '--parents', '-n', '1', rev).split(' ').slice(1);
    const paisComLista = pais.some(pai => ler(pai) !== null || tinhaLista(pai));
    for (const pai of pais) {
      const anterior = ler(pai);
      if (anterior === null && !tinhaLista(pai) && paisComLista) continue;
      erros.push(...(anterior === null ? (tinhaLista(pai) ? compararListas([], atual) : inicial(atual)) : compararListas(anterior, atual)).map(e => `${rev.slice(0,12)}: ${e}`));
    }
  }
  validarPendentes(lista);
  const anterior = git('rev-parse','HEAD').startsWith(base) ? null : ler('HEAD');
  erros.push(...(anterior === null ? (tinhaLista('HEAD') ? compararListas([], lista) : inicial(lista)) : compararListas(anterior, lista)));
  return erros;
}
export function conferirRegisto(registo, paginas, livro, {medidas = 'design/especime-v3/medicoes', sementes = null} = {}) {
  const erros = [], ids = new Set(), textos = new Set(), linhas = new Map();
  const impressas = new Set(paginas.flatMap(p => p.blocos.flatMap(b => b.frases.map(frase => chave({estudo:p.estudo, lingua:p.lingua, frase})))));
  for (const f of registo) {
    const id = f.id ?? '(sem id)';
    if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id) || ids.has(id)) erros.push(`${id}: identificador inválido ou repetido`);
    ids.add(id);
    if (!Array.isArray(f.tipos) || !f.tipos.length || new Set(f.tipos).size !== f.tipos.length || f.tipos.some(t => !['atribuicao','causa','leitura'].includes(t))) erros.push(`${id}: tipos inválidos`);
    else if (['pt','en'].some(l => typeof f[l] === 'string' && tiposDaFrase(f[l],l).some(t => !f.tipos.includes(t)))) erros.push(`${id}: falta um tipo detetado`);
    erros.push(...conferirOrigem(f, medidas));
    if (typeof f.estudo !== 'string' || !f.estudo) erros.push(`${id}: falta estudo ou página`);
    for (const lingua of ['pt','en']) {
      if (typeof f[lingua] !== 'string' || !f[lingua].trim()) {erros.push(`${id}: falta ${lingua}`); continue;}
      const k = chave({estudo:f.estudo, lingua, frase:f[lingua]});
      if (!impressas.has(k)) erros.push(`${id}: ${lingua} ausente da edição`);
      for (const p of paginas.filter(p => p.estudo === f.estudo && p.lingua === lingua)) for (const b of p.blocos) for (const frase of b.frases) {
        if (chave({estudo:p.estudo, lingua, frase}) === k && JSON.stringify(citacoes(frase, lingua)) !== JSON.stringify(citacoes(f[lingua], lingua))) erros.push(`${id}: ${lingua} citação impressa diferente do registo em ${p.rota}`);
      }
      if (textos.has(k)) erros.push(`${id}: frase repetida no registo`);
      textos.add(k);
    }
    const suporte = [];
    if (!Array.isArray(f.linhas) || !f.linhas.length || new Set(f.linhas).size !== f.linhas.length) erros.push(`${id}: linhas inválidas`);
    else for (const nome of f.linhas) {
      const l = livro.get(nome);
      if (!l || typeof l.excerpt !== 'string' || !l.excerpt.trim() || !/^[a-f0-9]{64}$/.test(l.document?.source_sha256 ?? '')) erros.push(`${id}: linha ${nome} sem excerto ou documento`);
      else {suporte.push(l); linhas.set(nome, l);}
    }
    if (typeof f.pt === 'string' && typeof f.en === 'string') {
      const parEncontrado = paginas.filter(p => p.estudo === f.estudo && p.lingua === 'pt').some(p => p.blocos.some((b,bloco) => b.frases.some((t,indice) => {
        if (normalDaChave(t) !== normalDaChave(f.pt)) return false;
        const par = parDaFrase(paginas, {pagina:p.rota,bloco,indice});
        return par && normalDaChave(par.frase) === normalDaChave(f.en);
      })));
      if (!parEncontrado) erros.push(`${id}: pt e en sem par pelo alinhamento dos blocos`);
      const pt = citacoes(f.pt, 'pt'), en = citacoes(f.en, 'en');
      if (Boolean(pt.length) !== Boolean(en.length)) erros.push(`${id}: citação só numa edição`);
      for (const c of pt.filter(c => [...c].length >= 12)) if (!suporte.some(l => normalExcerto(l.excerpt).includes(normalExcerto(c)))) erros.push(`${id}: citação ausente do excerto`);
      const presa = pt.some(c => [...c].length >= 12 && suporte.some(l => normalExcerto(l.excerpt).includes(normalExcerto(c))));
      if (f.juizo !== 'por julgar') erros.push(`${id}: juízo tem de ficar por julgar`);
      if (f.origem === 'semente') {
        erros.push(...conferirSemente(f, sementes));
        const elegivel = presa && f.linhas?.length === 1 && livro.get(f.linhas[0])?.afirmacao === true && paginas.some(p => p.estudo === f.estudo && p.lingua === 'pt' && p.blocos.some(b => b.frases.some(t => normalDaChave(t) === normalDaChave(f.pt)) && b.linhas.filter(l => livro.get(l)?.afirmacao === true).join('|') === f.linhas[0]));
        if (!elegivel) erros.push(`${id}: origem semente fora da regra`);
      }
      const marcada = ['pt','en'].some(l => marcaLeitura(f[l], l));
      if (f.tipos?.includes('leitura') || marcada) {
        if (!f.tipos?.includes('leitura') || !['pt','en'].every(l => marcaLeitura(f[l], l)) || typeof f.razao !== 'string' || !f.razao.trim()) erros.push(`${id}: leitura sem marca bilingue e conta ou razão`);
      }
    }
  }
  return {erros, linhas:[...linhas.values()], textos};
}
export function conferirCobertura(frases, registo, pendentes) {
  const erros = [], presentes = new Set(frases.map(chave)), p = validarPendentes(pendentes);
  for (const k of presentes) if (!registo.has(k) && !p.has(k)) erros.push(`cobertura: frase sem registo: ${k}`);
  for (const k of p) {
    if (!presentes.has(k)) erros.push(`por registar: frase já não está no dist: ${k}`);
    if (registo.has(k)) erros.push(`por registar: frase já registada: ${k}`);
  }
  return erros;
}
export function lerLista({indice=false, gitRun=(...args)=>execFileSync('git',args,{encoding:'utf8'})}={}) {
  return JSON.parse(indice ? gitRun('show',':'+LISTA) : fs.readFileSync(LISTA,'utf8'));
}
export function conferir(dist = 'dist') {
  const paginas = lerPaginas(dist), frases = inventario(paginas), registo = lerRegisto();
  const pendentes = JSON.parse(fs.readFileSync(LISTA, 'utf8'));
  const r = conferirRegisto(registo, paginas, loadClaims());
  const julgados = conferirTextosJulgados(lerTextosJulgados(), paginas, frases);
  const cor3 = conferirTrechosCor3(paginas,frases);
  const corpos = conferirCorpos(r.linhas, true);
  return {frases:frases.length, registo:registo.length, pendentes:pendentes.length, corpos,
    erros:[...r.erros, ...julgados.erros, ...cor3.erros, ...conferirCobertura(frases, new Set([...r.textos, ...julgados.textos, ...julgados.mobilia, ...cor3.textos]), pendentes), ...conferirHistorico(pendentes), ...conferirPino(), ...conferirPinoModelos(), ...conferirModelos(), ...corpos.erros]};
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv.includes('--so-lista')) {
      const indice = process.argv.includes('--indice');
      const erros = [...conferirHistorico(lerLista({indice})), ...conferirPino({indice}), ...conferirPinoModelos({indice}), ...conferirModelos()];
      for (const e of erros) console.error(e);
      console.log(`por registar: histórico e ${indice ? 'índice preparado' : 'árvore de trabalho'}; recusas=${erros.length}`);
      process.exit(erros.length ? 1 : 0);
    }
    const r = conferir(process.argv[2] ?? 'dist');
    console.log(`frases: ${r.frases}; registo: ${r.registo}; por registar: ${r.pendentes}; recusas: ${r.erros.length}`);
    console.log(`excertos: ${r.corpos.estado}; limpa=${r.corpos.limpa}; linhas lidas=${r.corpos.lidas}`);
    for (const e of r.erros) console.error(e);
    process.exitCode = r.erros.length ? 1 : 0;
  } catch (e) {console.error(e.message); process.exitCode = 1;}
}
