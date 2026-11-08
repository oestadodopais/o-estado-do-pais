/** COR-AGUA: a paridade dos blocos não vê os dados que os gráficos leem. */
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
export function conferirGraficos(raiz = 'dist') {
  const fontes = !fs.existsSync(path.join(raiz, 'estudos'));
  const estudos = fontes ? raiz : path.join(raiz, 'estudos');
  const erros = [], medidos = [];
  for (const estudo of fs.readdirSync(estudos).sort()) {
    const pt = fontes ? path.join(raiz, estudo, 'pt.html') : path.join(estudos, estudo, 'documento/index.html');
    const en = fontes ? path.join(raiz, estudo, 'en.html') : path.join(raiz, 'en/studies', estudo, 'document/index.html');
    if (!fs.existsSync(pt) || !fs.existsSync(en)) continue;
    const r = compararHtml(fs.readFileSync(pt, 'utf8'), fs.readFileSync(en, 'utf8'));
    if (r.medido) medidos.push(estudo);
    for (const diferenca of r.diferencas) erros.push({estudo, ...diferenca});
  }
  if (!medidos.length) erros.push({razao:'nenhum estudo bilingue com dados de gráficos medido'});
  return {medidos, erros};
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const r = conferirGraficos(process.argv[2] ?? 'dist');
    console.log(`paridade dos gráficos: ${r.medidos.length} estudos bilingues; ${r.erros.length} diferenças`);
    for (const e of r.erros) console.error(JSON.stringify(e));
    process.exitCode = r.erros.length ? 1 : 0;
  } catch { console.error('paridade dos gráficos: HTML ou dados JSON ilegíveis'); process.exitCode = 1; }
}
