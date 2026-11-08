import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {compararDados, compararHtml, conferirGraficos} from '../../scripts/check-paridade-graficos.mjs';
const pt = {prices:[{n:'Doméstico', v:1.348}, {n:'Rega', v:0.0706}]};
const en = {prices:[{n:'Household', v:1.348}, {n:'Irrigation', v:0.0706}]};
const html = d => '<script id="payload" type="application/json">' + JSON.stringify(d) + '</script>';
assert.deepEqual(compararDados(pt, en), []);
assert.deepEqual(compararDados(pt, {...en, prices:[...en.prices].reverse()}).map(d => d.caminho), ['/prices/0/v', '/prices/1/v']);
assert.equal(compararDados(pt, {prices:[en.prices[0]]}).length, 1);
assert.equal(compararHtml(html(pt), '<p>Sem dados.</p>').diferencas.length, 1);
assert.throws(() => compararHtml('<script id="payload" type="application/json">inválido</script>', html(en)));
const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'coragua-graficos-'));
try {
  const escrever = (rota, dados) => {const p = path.join(raiz, rota); fs.mkdirSync(path.dirname(p), {recursive:true}); fs.writeFileSync(p, html(dados));};
  escrever('estudos/planta/documento/index.html', pt);
  escrever('en/studies/planta/document/index.html', en);
  assert.deepEqual(conferirGraficos(raiz), {medidos:['planta'], erros:[]});
  escrever('en/studies/planta/document/index.html', {prices:[{...en.prices[0], v:1.61}, en.prices[1]]});
  assert.deepEqual(conferirGraficos(raiz).erros, [{estudo:'planta', caminho:'/prices/0/v', pt:1.348, en:1.61}]);
} finally { fs.rmSync(raiz, {recursive:true, force:true}); }
console.log('paridade dos gráficos: 7 plantas, incluindo alteração de um valor num estudo bilingue');
