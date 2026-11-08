/** HIG-6A: camada 0, sem alterar a régua da página nem o vocabulário do motor. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {frasesDoTexto, medirPagina} from '../voz-autorreferencia.mjs';
// A régua das listas conserva a distinção decimal da VOZ-2 e conta sha256 como 256.
export const numeros = t => (t.match(/(?<!\d)\d+(?:[.,]\d+)*/gu) ?? []).map(n => n.replace(',', '.'));

const normal = t => t.replace(/\u200b/g, '').replace(/\s+/g, ' ').trim();
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
export const recusaVoz = t => [...new Set([...frasesDoTexto(t), ...medirPagina('<p>' + esc(t) + '</p>', '/camada-zero').frases])];
const tags = 'p,li,h1,h2,h3,h4,h5,h6,figcaption,dd,dt,td,th,summary,blockquote';
const tagsVoz = tags + ',div,section,article';
export function blocos(html, tipo = 'documento', seletores = tags) {
  const root = parse(html); root.querySelectorAll('script,style,.src-chip').forEach(n => n.remove());
  // As transcrições fora da leitura já são excluídas pela régua da página.
  if (tipo === 'página') root.querySelectorAll('[data-registo-unidade], .estudo-indice, [data-registo-indice]').filter(n => !n.closest('.texto-artigo.estudo-leitura, .texto-sumario, .estudo-sumario')).forEach(n => n.remove());
  const corpo = root.querySelector('[data-oedp-moldura]') ?? root.querySelector('main') ?? root;
  return corpo.querySelectorAll(seletores).filter(n => !n.querySelector(seletores)).map(n => normal(n.textContent)).filter(Boolean);
}
export function validarLista(lista) {
  if (!Array.isArray(lista) || !lista.length) throw new Error('lista vazia ou inválida');
  const ids = new Set();
  for (const f of lista) {
    if (!f || typeof f.id !== 'string' || !f.id || ids.has(f.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.estudo ?? '') ||
        !['pt', 'en'].includes(f.lingua) || !['SAI', 'REESCREVE', 'FICA'].includes(f.classe) || typeof f.frase !== 'string' || !f.frase.trim() ||
        (f.classe === 'REESCREVE' && (typeof f.nova !== 'string' || !f.nova.trim())) || ('nova' in f && typeof f.nova !== 'string')) throw new Error('entrada da lista inválida ou repetida');
    ids.add(f.id);
  }
}
export function conferirNumeros(lista, bilingues) {
  const tirados = new Map();
  for (const f of lista) {
    if (f.classe === 'FICA') continue;
    const antes = numeros(f.frase), depois = f.classe === 'REESCREVE' ? numeros(f.nova) : [];
    for (const n of depois) { const i = antes.indexOf(n); if (i >= 0) antes.splice(i, 1); else antes.push('+' + n); }
    const k = f.estudo + '|' + f.lingua;
    tirados.set(k, [...(tirados.get(k) ?? []), ...antes]);
  }
  return [...new Set(lista.map(f => f.estudo))].filter(s => bilingues.has(s)).flatMap(estudo => {
    const pt = (tirados.get(estudo + '|pt') ?? []).sort(), en = (tirados.get(estudo + '|en') ?? []).sort();
    return JSON.stringify(pt) === JSON.stringify(en) ? [] : [{estudo, pt, en}];
  });
}
const contem = (texto, frase) => normal(texto).includes(normal(frase));
const nomeada = (texto, entradas) => entradas.some(f => contem(texto, f.frase) || contem(f.frase, texto) || (f.nova && (contem(texto, f.nova) || contem(f.nova, texto))));
export function conferirBlocos(lista, documentos) {
  const semPar = new Map(), semEntrada = new Map();
  for (const d of documentos) {
    const entradas = lista.filter(f => f.lingua === d.lingua && (f.estudo === d.estudo || f.paginas?.includes(d.rota)));
    (d.textosVoz ?? d.blocos).forEach((t, i) => {
      for (const frase of recusaVoz(t)) if (!nomeada(frase, entradas)) {
        const k = [d.estudo, d.lingua, frase].join('|');
        semEntrada.set(k, {estudo:d.estudo, lingua:d.lingua, bloco:i, frase});
      }
    });
    const gemeo = documentos.find(g => g.estudo === d.estudo && g.tipo === d.tipo && g.lingua !== d.lingua);
    if (!gemeo) continue;
    const outras = lista.filter(f => f.lingua === gemeo.lingua && (f.estudo === gemeo.estudo || f.paginas?.includes(gemeo.rota)));
    for (const f of entradas) for (const [i, t] of d.blocos.entries()) {
      if (!contem(t, f.frase) && !(f.nova && contem(t, f.nova))) continue;
      const candidatos = d.blocos.length === gemeo.blocos.length ? [gemeo.blocos[i]] : gemeo.blocos.slice(Math.max(0, i - 3), i + 4);
      const captadas = candidatos.flatMap(recusaVoz);
      if (captadas.length && !candidatos.some(t => nomeada(t, outras))) semPar.set(f.id, {id:f.id, estudo:d.estudo, lingua:d.lingua, bloco:i});
    }
  }
  return {semPar:[...semPar.values()], semEntrada:[...semEntrada.values()]};
}
export function lerDocumentos(lista, dist) {
  const documentos = [], bilingues = new Set();
  for (const estudo of new Set(lista.map(f => f.estudo))) {
    const lidos = new Set();
    for (const lingua of ['pt', 'en']) for (const tipo of ['documento', 'página']) {
      const rota = (lingua === 'pt' ? '/estudos/' : '/en/studies/') + estudo + (tipo === 'documento' ? (lingua === 'pt' ? '/documento' : '/document') : '');
      const ficheiro = path.join(dist, rota, 'index.html');
      if (!fs.existsSync(ficheiro)) continue;
      documentos.push({estudo, lingua, tipo, rota, blocos:blocos(fs.readFileSync(ficheiro, 'utf8'), tipo), textosVoz:blocos(fs.readFileSync(ficheiro, 'utf8'), tipo, tagsVoz)});
      if (tipo === 'documento') lidos.add(lingua);
    }
    if (lidos.size === 2) bilingues.add(estudo);
    if (!documentos.some(d => d.estudo === estudo)) throw new Error(`estudo sem páginas no dist: ${estudo}`);
  }
  return {documentos, bilingues};
}
export function conferir(lista, documentos, bilingues, quantificadores) {
  validarLista(lista);
  return {voz:lista.filter(f => f.nova && recusaVoz(f.nova).length).map(f => f.id), numeros:conferirNumeros(lista, bilingues),
    quantificadores, ...conferirBlocos(lista, documentos)};
}
export const recusas = r => Object.values(r).reduce((n, xs) => n + xs.length, 0);
export function conferirLista(ficheiro, dist = 'dist') {
  const lista = JSON.parse(fs.readFileSync(ficheiro, 'utf8')); validarLista(lista);
  const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
  if (JSON.parse(fs.readFileSync(path.join(dist, 'version.json'), 'utf8')).commit !== cabeca) throw new Error('dist não corresponde à cabeça da worktree');
  const {documentos, bilingues} = lerDocumentos(lista, dist);
  const quantificadores = JSON.parse(execFileSync('python3', [fileURLToPath(new URL('./quantificadores.py', import.meta.url))], {input:JSON.stringify(lista), encoding:'utf8', stdio:['pipe','pipe','pipe']}));
  return conferir(lista, documentos, bilingues, quantificadores);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const r = conferirLista(process.argv[2], process.argv[3] ?? 'dist');
    console.log(`camada 0: voz ${r.voz.length}; números ${r.numeros.length}; quantificadores ${r.quantificadores.length}; entradas sem par ${r.semPar.length}; frases sem entrada ${r.semEntrada.length}`);
    for (const [regra, erros] of Object.entries(r)) for (const erro of erros) console.log(`${regra}: ${JSON.stringify(erro)}`);
    if (process.argv[4]) fs.writeFileSync(process.argv[4], JSON.stringify(r, null, 2) + '\n');
    process.exitCode = recusas(r) ? 9 : 0;
  } catch (e) { console.error('camada 0: ' + (e.stderr?.toString().trim() || (e.code ? 'ficheiro, dist ou guião ilegível' : e.message))); process.exitCode = 9; }
}
