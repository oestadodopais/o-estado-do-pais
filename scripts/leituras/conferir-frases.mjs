/** HIG-6A: camada 0, sem alterar a régua da página nem o vocabulário do motor. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {WORKS} from '../../src/data/studies.mjs';
import {frasesDoTexto, medirPagina} from '../voz-autorreferencia.mjs';
import {formasNumericas, blocosDe, compara} from '../paridade-numeros.mjs';
import {assinatura, validarExcecoes} from '../check-paridade.mjs';
// REC2: a lista histórica permanece intacta. Só o estado de retirada autoriza
// saltar uma entrada ou uma porta adicional para o estudo retirado.
export function conferirSaltadas(lista, saltadas, trabalhos = WORKS) {
  const retirados = new Set(trabalhos.filter(w => w.estado === 'retirado').map(w => w.slug));
  const esperadas = lista.filter(f => retirados.has(f.estudo)).map(f => f.id).sort();
  if (JSON.stringify(esperadas) !== JSON.stringify(saltadas.map(f => f.id).sort())) throw new Error('entradas saltadas não correspondem aos trabalhos retirados');
  return esperadas.length;
}
export function separarRetirados(lista, trabalhos = WORKS) {
  const retirados = new Set(trabalhos.filter(w => w.estado === 'retirado').map(w => w.slug));
  const ativas = [], saltadas = [];
  for (const f of lista) {
    if (retirados.has(f.estudo)) { saltadas.push({id:f.id, estudo:f.estudo}); continue; }
    const paginas = f.paginas.filter(r => !retirados.has(r.match(/^\/(?:estudos|en\/studies)\/([^/]+)/)?.[1]));
    if (!paginas.length) throw new Error(`entrada de estudo não retirado sem páginas publicadas: ${f.id}`);
    ativas.push({...f, paginas});
  }
  conferirSaltadas(lista, saltadas, trabalhos);
  return {ativas, saltadas, retirados};
}
// Grupos de milhares da paridade, conservando a distinção entre 1,2 e 12.
export const numeros = t => formasNumericas(t).map(n => {
  n = n.replace(/[\s\u00a0\u202f]/g, '');
  if (n.includes(',') && n.includes('.')) {
    const i = Math.max(n.lastIndexOf(','), n.lastIndexOf('.'));
    return n.slice(0, i).replace(/[.,]/g, '') + '.' + n.slice(i + 1);
  }
  return /^\d{1,3}(?:[.,]\d{3})+$/.test(n) ? n.replace(/[.,]/g, '') : n.replace(',', '.');
});

const normal = t => t.replace(/\u200b/g, '').replace(/\s+/g, ' ').trim();
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
export const recusaVoz = t => [...new Set([...frasesDoTexto(t), ...medirPagina('<p>' + esc(t) + '</p>', '/camada-zero').frases])];
const tags = 'p,li,h1,h2,h3,h4,h5,h6,figcaption,dd,dt,td,th,summary,blockquote';
const tagsVoz = tags + ',div,section,article';
// Cada carater do texto com selos conserva a sua projeção no texto sem selos.
// U+200B marca apenas os carateres retirados e é eliminado pela normalização.
export function textoParaProcura(no) {
  const partes = [], projecoes = [];
  function visitar(n, selo = false) {
    selo ||= n.classList?.contains('src-chip') ?? false;
    if (n.nodeType === 3) {
      const t = n.textContent; partes.push(t); projecoes.push(selo ? '\u200b'.repeat(t.length) : t);
    } else for (const filho of n.childNodes) visitar(filho, selo);
  }
  visitar(no);
  const bruto = partes.join(''), projecao = projecoes.join('');
  let textoComSelos = '', semSelosPorCarater = '', espaco = false, espacoSemSelo = false;
  for (let i = 0; i < bruto.length; i++) {
    const c = bruto[i];
    if (c === '\u200b') continue;
    if (/\s/.test(c)) { espaco = true; espacoSemSelo ||= projecao[i] !== '\u200b'; continue; }
    if (espaco && textoComSelos) {
      textoComSelos += ' '; semSelosPorCarater += espacoSemSelo ? ' ' : '\u200b';
    }
    espaco = false; espacoSemSelo = false;
    textoComSelos += c; semSelosPorCarater += projecao[i];
  }
  return {textoComSelos, texto:normal(semSelosPorCarater), semSelosPorCarater};
}
function blocosParaProcura(html, tipo, seletores) {
  const root = parse(html); root.querySelectorAll('script,style').forEach(n => n.remove());
  // As transcrições fora da leitura já são excluídas pela régua da página.
  if (tipo === 'página') root.querySelectorAll('[data-registo-unidade], .estudo-indice, [data-registo-indice]').filter(n => !n.closest('.texto-artigo.estudo-leitura, .texto-sumario, .estudo-sumario')).forEach(n => n.remove());
  const corpo = root.querySelector('[data-oedp-moldura]') ?? root.querySelector('main') ?? root;
  return corpo.querySelectorAll(seletores).filter(n => !n.closest('.src-chip') && !n.querySelectorAll(seletores).some(f => !f.closest('.src-chip'))).map(textoParaProcura).filter(b => b.texto);
}
export function blocos(html, tipo = 'documento', seletores = tags) {
  return blocosParaProcura(html, tipo, seletores).map(b => b.texto);
}
// Procura única para presença, pares, índices e cobertura. Os intervalos referem-se
// à forma indicada; texto é sempre a ocorrência projetada sem os selos.
export function procurarFrase(frase, bloco) {
  if (!frase) return [];
  if (typeof bloco === 'string') bloco = {texto:normal(bloco)};
  const alvo = normal(frase);
  if (!alvo) return [];
  for (const forma of ['textoComSelos', 'texto']) {
    const texto = bloco[forma];
    if (texto === undefined) continue;
    const ocorrencias = [];
    for (let inicio = texto.indexOf(alvo); inicio >= 0; inicio = texto.indexOf(alvo, inicio + 1)) {
      const fim = inicio + alvo.length;
      const projecao = forma === 'textoComSelos' ? bloco.semSelosPorCarater ?? texto : texto;
      ocorrencias.push({inicio, fim, forma, texto:normal(projecao.slice(inicio, fim))});
    }
    if (ocorrencias.length) return ocorrencias;
  }
  return [];
}
export function validarLista(lista) {
  if (!Array.isArray(lista) || !lista.length) throw new Error('lista vazia ou inválida');
  const ids = new Set();
  for (const f of lista) {
    if (!f || typeof f.id !== 'string' || !f.id || ids.has(f.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.estudo ?? '') ||
        !['pt', 'en'].includes(f.lingua) || !['SAI', 'REESCREVE', 'FICA'].includes(f.classe) || typeof f.frase !== 'string' || [...normal(f.frase)].length < 12 ||
        (f.classe === 'REESCREVE' && (typeof f.nova !== 'string' || !f.nova.trim())) || ('nova' in f && typeof f.nova !== 'string')) throw new Error('entrada da lista inválida ou repetida');
    if (!Array.isArray(f.paginas) || !f.paginas.length || f.paginas.some(r => typeof r !== 'string' || !/^\/(?:estudos|en\/studies)\/[a-z0-9-]+(?:\/(?:documento|document))?$/.test(r))) throw new Error('entrada sem páginas válidas');
    if (('par' in f || 'razao_par' in f) && !parDispensado(f)) throw new Error('par: nenhum exige razao_par de pelo menos vinte carateres');
    ids.add(f.id);
  }
}
// A procura conserva as frases com selos, mas a comparação usa os blocos
// de check:paridade, incluindo legendas e transcrições da página.
const blocosNumericos = d => d.blocosNumericos ?? d.blocos;
const frasesSemSelos = (frase, d) => [...new Set(d.procuraPagina
  ? procurarFrase(frase, d.procuraPagina).map(o => o.texto).filter(Boolean)
  : [normal(frase)])];
function aplicarLista(lista, d) {
  let resultado = [...blocosNumericos(d)];
  for (const f of lista.filter(f => f.estudo === d.estudo && f.lingua === d.lingua && f.classe !== 'FICA')) {
    for (const frase of frasesSemSelos(f.frase, d)) {
      resultado = resultado.map(b => b.replaceAll(frase, () => f.classe === 'SAI' ? '' : normal(f.nova)));
    }
  }
  return resultado.map(normal).filter(Boolean);
}
export function conferirNumeros(lista, documentos, bilingues, {aplicada = false, excecoes = JSON.parse(fs.readFileSync(new URL('../paridade-excecoes.json', import.meta.url), 'utf8'))} = {}) {
  validarExcecoes(excecoes);
  const erros = [];
  for (const estudo of new Set(lista.map(f => f.estudo))) {
    if (!bilingues.has(estudo)) continue;
    for (const tipo of ['documento', 'página']) {
      const edicao = lingua => documentos.find(d => !d.soPresenca && d.estudo === estudo && d.tipo === tipo && d.lingua === lingua);
      const pt = edicao('pt'), en = edicao('en');
      if (!pt || !en) continue;
      const depois = d => aplicada ? blocosNumericos(d) : aplicarLista(lista, d);
      const numeros = assinatura(compara(depois(pt), depois(en)));
      const difere = numeros.total.soPt.length || numeros.total.soEn.length || numeros.blocos.length;
      const excecao = excecoes.diferencas.find(e => e.estudo === estudo && e.tipo === tipo);
      if (difere && JSON.stringify(numeros) !== JSON.stringify(excecao?.numeros)) erros.push({estudo, tipo, numeros});
    }
  }
  return erros;
}
const textoDaEntrada = (f, aplicada) => aplicada ? (f.classe === 'SAI' ? null : f.classe === 'REESCREVE' ? f.nova : f.frase) : f.frase;
const nomeada = (texto, entradas, bloco, aplicada) => entradas.some(f =>
  procurarFrase(textoDaEntrada(f, aplicada), bloco).some(o => o.texto &&
    (f.classe === 'FICA' ? normal(texto) === o.texto : (normal(texto).includes(o.texto) || o.texto.includes(normal(texto))))));
export function conferirPresenca(lista, documentos, aplicada = false) {
  return lista.flatMap(f => {
    const paginas = documentos.filter(d => f.paginas.includes(d.rota));
    const frase = aplicada && f.classe === 'REESCREVE' ? f.nova : f.frase;
    // Antes de aplicar, SAI e REESCREVE têm de caber num bloco da paridade.
    // A presença recusa a entrada inaplicável; os números medem o resultado.
    const presente = paginas.some(d => !aplicada && f.classe !== 'FICA'
      ? frasesSemSelos(frase, d).some(t => blocosNumericos(d).some(b => b.includes(t)))
      : procurarFrase(frase, d.procuraPagina ?? d.texto ?? d.blocos.join(' ')).length);
    const ok = aplicada && f.classe === 'SAI' ? f.paginas.every(rota => paginas.some(d => d.rota === rota)) && !presente : presente;
    return ok ? [] : [{id:f.id, classe:f.classe, razao:aplicada && f.classe === 'SAI' ? 'frase retirada ainda presente ou páginas ausentes' : !aplicada && f.classe !== 'FICA' ? 'frase ausente dos blocos das páginas declaradas' : 'frase ausente das páginas declaradas'}];
  });
}

export const parDispensado = f => f.par === 'nenhum' && typeof f.razao_par === 'string' && [...f.razao_par.trim()].length >= 20;
// A folga não permite reutilizar um bloco para justificar dois blocos da outra língua.
// Limite HIG-6A: um bloco com par pode conter uma frase gémea por mudar (V122).
// A correspondência pelo conteúdo fica para a HIG-6B.
// Conserva a ordem, maximiza os pares e, entre emparelhamentos iguais, minimiza a distância.
// No empate final prefere o par mais recente, como no segundo ensaio da adenda A.
export function emparelharBlocos(a, b, alinhados) {
  const dp = Array.from({length:a.length + 1}, () => Array.from({length:b.length + 1}, () => ({n:0, custo:0, passo:null})));
  const melhor = (x, y) => x.n > y.n || (x.n === y.n && x.custo <= y.custo);
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    let r = {...dp[i - 1][j], passo:'a'};
    const salto = {...dp[i][j - 1], passo:'b'};
    if (melhor(salto, r)) r = salto;
    const distancia = Math.abs(a[i - 1] - b[j - 1]);
    if (distancia <= (alinhados ? 0 : 3)) {
      const antes = dp[i - 1][j - 1], par = {n:antes.n + 1, custo:antes.custo + distancia, passo:'par'};
      if (melhor(par, r)) r = par;
    }
    dp[i][j] = r;
  }
  const pares = new Map();
  for (let i = a.length, j = b.length; i && j;) {
    const passo = dp[i][j].passo;
    if (passo === 'par') { pares.set(a[--i], b[--j]); }
    else if (passo === 'a') i--; else j--;
  }
  return pares;
}
export function conferirBlocos(lista, documentos, bilingues = new Set(documentos.filter(d => d.tipo === 'documento' && documentos.some(g => g.tipo === 'documento' && g.estudo === d.estudo && g.lingua !== d.lingua)).map(d => d.estudo)), aplicada = false) {
  const semPar = new Map(), semEntrada = new Map(), emparelhamentos = new Map();
  for (const d of documentos.filter(d => !d.soPresenca)) {
    const entradas = lista.filter(f => f.lingua === d.lingua && (f.estudo === d.estudo || f.paginas?.includes(d.rota)));
    (d.textosVoz ?? d.blocos).forEach((t, i) => {
      for (const frase of recusaVoz(t)) if (!nomeada(frase, entradas, d.procuraVoz?.[i] ?? t, aplicada)) {
        const k = [d.estudo, d.lingua, frase].join('|');
        semEntrada.set(k, {estudo:d.estudo, lingua:d.lingua, bloco:i, frase});
      }
    });
    const gemeo = documentos.find(g => !g.soPresenca && g.estudo === d.estudo && g.tipo === d.tipo && g.lingua !== d.lingua);
    if (!gemeo || !bilingues.has(d.estudo)) continue;
    const outras = lista.filter(f => f.lingua === gemeo.lingua && (f.estudo === gemeo.estudo || f.paginas?.includes(gemeo.rota)));
    const chave = d.estudo + '|' + d.tipo;
    if (!emparelhamentos.has(chave)) {
      const p = d.lingua === 'pt' ? d : gemeo, e = d.lingua === 'en' ? d : gemeo;
      const ep = d.lingua === 'pt' ? entradas : outras, ee = d.lingua === 'en' ? entradas : outras;
      const indicesComEntrada = (doc, es) => doc.blocos.flatMap((t, i) => es.some(f => { const frase = textoDaEntrada(f, aplicada); return procurarFrase(frase, doc.procuraBlocos?.[i] ?? t).length; }) ? [i] : []);
      const ip = indicesComEntrada(p, ep), ie = indicesComEntrada(e, ee);
      const indices = emparelharBlocos(ip, ie, p.blocos.length === e.blocos.length);
      emparelhamentos.set(chave, {pt:new Set(indices.keys()), en:new Set(indices.values())});
    }
    const pares = emparelhamentos.get(chave);
    for (const f of entradas.filter(f => f.classe !== 'FICA' && !parDispensado(f))) for (const [i, t] of d.blocos.entries()) {
      const frase = textoDaEntrada(f, aplicada);
      if (!procurarFrase(frase, d.procuraBlocos?.[i] ?? t).length) continue;
      const temPar = pares[d.lingua].has(i);
      if (!temPar) semPar.set(f.id, {id:f.id, estudo:d.estudo, lingua:d.lingua, bloco:i});
    }
  }
  return {semPar:[...semPar.values()], semEntrada:[...semEntrada.values()]};
}
export function lerDocumentos(lista, dist) {
  const {ativas, saltadas} = separarRetirados(lista);
  lista = ativas;
  const documentos = [], bilingues = new Set(), estudos = new Set(lista.map(f => f.estudo));
  for (const estudo of new Set([...estudos, ...lista.flatMap(f => f.paginas.map(r => r.match(/^\/(?:estudos|en\/studies)\/([^/]+)/)[1]))])) {
    const lidos = new Set();
    for (const lingua of ['pt', 'en']) for (const tipo of ['documento', 'página']) {
      const rota = (lingua === 'pt' ? '/estudos/' : '/en/studies/') + estudo + (tipo === 'documento' ? (lingua === 'pt' ? '/documento' : '/document') : '');
      // Uma rota adicional prova a presença; não acrescenta um estudo ao âmbito da lista.
      const soPresenca = !estudos.has(estudo);
      if (soPresenca && !lista.some(f => f.paginas.includes(rota))) continue;
      const ficheiro = path.join(dist, rota, 'index.html');
      if (!fs.existsSync(ficheiro)) continue;
      const html = fs.readFileSync(ficheiro, 'utf8'), corpo = parse(html);
      corpo.querySelectorAll('script,style').forEach(n => n.remove());
      const procuraPagina = textoParaProcura(corpo.querySelector('[data-oedp-moldura]') ?? corpo.querySelector('main') ?? corpo);
      const procuraBlocos = blocosParaProcura(html, tipo, tags), procuraVoz = blocosParaProcura(html, tipo, tagsVoz);
      documentos.push({estudo, lingua, tipo, rota, soPresenca, procuraPagina, procuraBlocos, procuraVoz,
        textoComSelos:procuraPagina.textoComSelos, texto:procuraPagina.texto, blocosNumericos:blocosDe(html),
        blocos:procuraBlocos.map(b => b.texto), textosVoz:procuraVoz.map(b => b.texto)});
      if (tipo === 'documento') lidos.add(lingua);
    }
    if (estudos.has(estudo) && lidos.size === 2) bilingues.add(estudo);
    if (estudos.has(estudo) && !documentos.some(d => d.estudo === estudo)) throw new Error(`estudo sem páginas no dist: ${estudo}`);
  }
  return {documentos, bilingues, saltadas};
}
export function conferirQuantificadores(lista) {
  return JSON.parse(execFileSync('python3', [fileURLToPath(new URL('./quantificadores.py', import.meta.url))],
    {input:JSON.stringify(lista), encoding:'utf8', stdio:['pipe','pipe','pipe']}));
}
export function conferir(lista, documentos, bilingues, {aplicada = false} = {}) {
  validarLista(lista);
  const {ativas, saltadas, retirados} = separarRetirados(lista);
  lista = ativas;
  documentos = documentos.filter(d => !retirados.has(d.estudo));
  bilingues = new Set([...bilingues].filter(s => !retirados.has(s)));
  return {saltadas, voz:lista.filter(f => f.nova && recusaVoz(f.nova).length).map(f => f.id), numeros:conferirNumeros(lista, documentos, bilingues, {aplicada}),
    quantificadores:lista.length ? conferirQuantificadores(lista) : [], presenca:conferirPresenca(lista, documentos, aplicada),
    ...conferirBlocos(lista, documentos, bilingues, aplicada)};
}
export const recusas = r => Object.entries(r).filter(([regra]) => regra !== 'saltadas').reduce((n, [, xs]) => n + xs.length, 0);
export function conferirLista(ficheiro, dist = 'dist', opcoes = {}) {
  const lista = JSON.parse(fs.readFileSync(ficheiro, 'utf8')); validarLista(lista);
  const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
  if (JSON.parse(fs.readFileSync(path.join(dist, 'version.json'), 'utf8')).commit !== cabeca) throw new Error('dist não corresponde à cabeça da worktree');
  const {documentos, bilingues} = lerDocumentos(lista, dist);
  return conferir(lista, documentos, bilingues, opcoes);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2).filter(a => a !== '--aplicada');
    if (args.some(a => a.startsWith('--')) || args.length < 1 || args.length > 3) throw new Error('argumentos inválidos');
    const r = conferirLista(args[0], args[1] ?? 'dist', {aplicada:process.argv.includes('--aplicada')});
    console.log(`camada 0: voz ${r.voz.length}; números ${r.numeros.length}; quantificadores ${r.quantificadores.length}; entradas sem par ${r.semPar.length}; frases sem entrada ${r.semEntrada.length}; presença ${r.presenca.length}; entradas saltadas ${r.saltadas.length}`);
    for (const [regra, erros] of Object.entries(r)) if (regra !== 'saltadas') for (const erro of erros) console.log(`${regra}: ${JSON.stringify(erro)}`);
    if (args[2]) fs.writeFileSync(args[2], JSON.stringify(r, null, 2) + '\n');
    process.exitCode = recusas(r) ? 9 : 0;
  } catch (e) { console.error('camada 0: ' + (e.stderr?.toString().trim() || (e.code ? 'ficheiro, dist ou guião ilegível' : e.message))); process.exitCode = 9; }
}
