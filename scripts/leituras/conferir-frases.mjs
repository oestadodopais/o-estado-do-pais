/** HIG-6A: camada 0, sem alterar a régua da página nem o vocabulário do motor. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {frasesDoTexto, medirPagina} from '../voz-autorreferencia.mjs';
import {formasNumericas} from '../paridade-numeros.mjs';
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
        !['pt', 'en'].includes(f.lingua) || !['SAI', 'REESCREVE', 'FICA'].includes(f.classe) || typeof f.frase !== 'string' || [...normal(f.frase)].length < 12 ||
        (f.classe === 'REESCREVE' && (typeof f.nova !== 'string' || !f.nova.trim())) || ('nova' in f && typeof f.nova !== 'string')) throw new Error('entrada da lista inválida ou repetida');
    if (!Array.isArray(f.paginas) || !f.paginas.length || f.paginas.some(r => typeof r !== 'string' || !/^\/(?:estudos|en\/studies)\/[a-z0-9-]+(?:\/(?:documento|document))?$/.test(r))) throw new Error('entrada sem páginas válidas');
    if (('par' in f || 'razao_par' in f) && !parDispensado(f)) throw new Error('par: nenhum exige razao_par de pelo menos vinte carateres');
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
const textoDaEntrada = (f, aplicada) => aplicada ? (f.classe === 'SAI' ? null : f.classe === 'REESCREVE' ? f.nova : f.frase) : f.frase;
const nomeada = (texto, entradas, bloco, aplicada) => entradas.some(f => {
  const frase = textoDaEntrada(f, aplicada);
  // Só uma frase comprovadamente dentro deste bloco pode cobrir a frase captada.
  return frase && contem(bloco, frase) && (contem(texto, frase) || contem(frase, texto));
});
export function conferirPresenca(lista, documentos, aplicada = false) {
  return lista.flatMap(f => {
    const paginas = documentos.filter(d => f.paginas.includes(d.rota));
    const frase = aplicada && f.classe === 'REESCREVE' ? f.nova : f.frase;
    const presente = paginas.some(d => contem(d.textoComSelos ?? d.texto ?? d.blocos.join(' '), frase)) ||
      paginas.some(d => contem(d.texto ?? d.blocos.join(' '), frase));
    const ok = aplicada && f.classe === 'SAI' ? f.paginas.every(rota => paginas.some(d => d.rota === rota)) && !presente : presente;
    return ok ? [] : [{id:f.id, classe:f.classe, razao:aplicada && f.classe === 'SAI' ? 'frase retirada ainda presente ou páginas ausentes' : 'frase ausente das páginas declaradas'}];
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
      for (const frase of recusaVoz(t)) if (!nomeada(frase, entradas, t, aplicada)) {
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
      const indicesComEntrada = (doc, es) => doc.blocos.flatMap((t, i) => es.some(f => { const frase = textoDaEntrada(f, aplicada); return frase && contem(t, frase); }) ? [i] : []);
      const ip = indicesComEntrada(p, ep), ie = indicesComEntrada(e, ee);
      const indices = emparelharBlocos(ip, ie, p.blocos.length === e.blocos.length);
      emparelhamentos.set(chave, {pt:new Set(indices.keys()), en:new Set(indices.values())});
    }
    const pares = emparelhamentos.get(chave);
    for (const f of entradas.filter(f => f.classe !== 'FICA' && !parDispensado(f))) for (const [i, t] of d.blocos.entries()) {
      const frase = textoDaEntrada(f, aplicada);
      if (!frase || !contem(t, frase)) continue;
      const temPar = pares[d.lingua].has(i);
      if (!temPar) semPar.set(f.id, {id:f.id, estudo:d.estudo, lingua:d.lingua, bloco:i});
    }
  }
  return {semPar:[...semPar.values()], semEntrada:[...semEntrada.values()]};
}
export function lerDocumentos(lista, dist) {
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
      const corpo = parse(fs.readFileSync(ficheiro, 'utf8')); corpo.querySelectorAll('script,style').forEach(n => n.remove());
      const textoComSelos = normal((corpo.querySelector('[data-oedp-moldura]') ?? corpo.querySelector('main') ?? corpo).textContent);
      corpo.querySelectorAll('.src-chip').forEach(n => n.remove());
      const texto = normal((corpo.querySelector('[data-oedp-moldura]') ?? corpo.querySelector('main') ?? corpo).textContent);
      documentos.push({estudo, lingua, tipo, rota, soPresenca, textoComSelos, texto, blocos:blocos(fs.readFileSync(ficheiro, 'utf8'), tipo), textosVoz:blocos(fs.readFileSync(ficheiro, 'utf8'), tipo, tagsVoz)});
      if (tipo === 'documento') lidos.add(lingua);
    }
    if (estudos.has(estudo) && lidos.size === 2) bilingues.add(estudo);
    if (estudos.has(estudo) && !documentos.some(d => d.estudo === estudo)) throw new Error(`estudo sem páginas no dist: ${estudo}`);
  }
  return {documentos, bilingues};
}
export function conferirQuantificadores(lista) {
  return JSON.parse(execFileSync('python3', [fileURLToPath(new URL('./quantificadores.py', import.meta.url))],
    {input:JSON.stringify(lista), encoding:'utf8', stdio:['pipe','pipe','pipe']}));
}
export function conferir(lista, documentos, bilingues, {aplicada = false} = {}) {
  validarLista(lista);
  return {voz:lista.filter(f => f.nova && recusaVoz(f.nova).length).map(f => f.id), numeros:conferirNumeros(lista, bilingues),
    quantificadores:conferirQuantificadores(lista), presenca:conferirPresenca(lista, documentos, aplicada),
    ...conferirBlocos(lista, documentos, bilingues, aplicada)};
}
export const recusas = r => Object.values(r).reduce((n, xs) => n + xs.length, 0);
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
    console.log(`camada 0: voz ${r.voz.length}; números ${r.numeros.length}; quantificadores ${r.quantificadores.length}; entradas sem par ${r.semPar.length}; frases sem entrada ${r.semEntrada.length}; presença ${r.presenca.length}`);
    for (const [regra, erros] of Object.entries(r)) for (const erro of erros) console.log(`${regra}: ${JSON.stringify(erro)}`);
    if (args[2]) fs.writeFileSync(args[2], JSON.stringify(r, null, 2) + '\n');
    process.exitCode = recusas(r) ? 9 : 0;
  } catch (e) { console.error('camada 0: ' + (e.stderr?.toString().trim() || (e.code ? 'ficheiro, dist ou guião ilegível' : e.message))); process.exitCode = 9; }
}
