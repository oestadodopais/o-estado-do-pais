/** COR-AGUA: a paridade dos blocos não vê os dados que os gráficos leem. */
import {WORKS} from '../src/data/studies.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parse} from 'node-html-parser';

export function valoresNumericos(valor, caminho = '', resultado = {}) {
  if (typeof valor === 'number') resultado[caminho] = valor;
  else if (valor && typeof valor === 'object') {
    for (const [chave, filho] of Object.entries(valor)) valoresNumericos(filho, caminho + '/' + chave, resultado);
  }
  return resultado;
}
export function compararDados(pt, en) {
  const a = valoresNumericos(pt), b = valoresNumericos(en);
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].sort().flatMap(caminho =>
    a[caminho] === b[caminho] ? [] : [{caminho, pt:a[caminho] ?? null, en:b[caminho] ?? null}]);
}
export function compararHtml(pt, en) {
  const dados = html => {
    const no = parse(html).querySelector('script#payload[type="application/json"]');
    return no ? JSON.parse(no.textContent) : null;
  };
  const a = dados(pt), b = dados(en);
  if (!a && !b) return {medido:false, diferencas:[]};
  if (!a || !b) return {medido:true, diferencas:[{caminho:'payload', razao:'dados ausentes numa edição'}]};
  return {medido:true, diferencas:compararDados(a, b)};
}
export function conferirGraficos(raiz = 'dist', esperados = null, razaoSemGraficos = null) {
  const fontes = !fs.existsSync(path.join(raiz, 'estudos'));
  const estudos = fontes ? raiz : path.join(raiz, 'estudos');
  const erros = [], medidos = [], inspecionados = [];
  for (const estudo of fs.readdirSync(estudos).sort()) {
    const pt = fontes ? path.join(raiz, estudo, 'pt.html') : path.join(estudos, estudo, 'documento/index.html');
    const en = fontes ? path.join(raiz, estudo, 'en.html') : path.join(raiz, 'en/studies', estudo, 'document/index.html');
    if (!fs.existsSync(pt) || !fs.existsSync(en)) continue;
    inspecionados.push(estudo);
    const r = compararHtml(fs.readFileSync(pt, 'utf8'), fs.readFileSync(en, 'utf8'));
    for (const f of [pt,en]) if (!r.medido && parse(fs.readFileSync(f,'utf8')).querySelector('canvas, svg, script[type="application/json"]')) erros.push({estudo,razao:'gráfico ou dados sem formato de medição reconhecido'});
    if (r.medido) medidos.push(estudo);
    for (const diferenca of r.diferencas) erros.push({estudo, ...diferenca});
  }
  if (!inspecionados.length) erros.push({razao:'nenhum estudo bilingue inspecionado'});
  if (!medidos.length && !(esperados?.length === 0 && typeof razaoSemGraficos === 'string' && razaoSemGraficos.trim().length >= 20)) erros.push({razao:'nenhum estudo bilingue com dados de gráficos medido, sem razão escrita'});
  if (esperados !== null) {
    for (const estudo of esperados) if (!medidos.includes(estudo)) erros.push({estudo,razao:'gráfico declarado na fonte não foi medido'});
    for (const estudo of medidos) if (!esperados.includes(estudo)) erros.push({estudo,razao:'gráfico medido fora do conjunto declarado nas fontes publicadas'});
  }
  return {medidos, inspecionados, erros, razaoSemGraficos:medidos.length ? null : razaoSemGraficos};
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const raiz = process.argv[2] ?? 'dist';
    const esperados = fs.existsSync(path.join(raiz,'estudos')) ? WORKS.filter(w => w.estado !== 'retirado').filter(w => {
      const pt=path.join('studies-src',w.slug,'pt.html'),en=path.join('studies-src',w.slug,'en.html');
      return fs.existsSync(pt) && fs.existsSync(en) && compararHtml(fs.readFileSync(pt,'utf8'),fs.readFileSync(en,'utf8')).medido;
    }).map(w => w.slug) : null;
    const razao = esperados?.length === 0 ? 'Os documentos bilingues publicados não contêm dados de gráficos no formato payload; ausência conferida nas fontes e no HTML construído.' : null;
    const r = conferirGraficos(raiz, esperados, razao);
    console.log(`paridade dos gráficos: ${r.inspecionados.length} estudos bilingues inspecionados; ${r.medidos.length} com dados de gráficos; ${r.erros.length} diferenças`);
    if (r.razaoSemGraficos) console.log(r.razaoSemGraficos);
    for (const e of r.erros) console.error(JSON.stringify(e));
    process.exitCode = r.erros.length ? 1 : 0;
  } catch { console.error('paridade dos gráficos: HTML ou dados JSON ilegíveis'); process.exitCode = 1; }
}
