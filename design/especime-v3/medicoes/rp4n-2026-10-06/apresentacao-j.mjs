/** Compõe só as listas visíveis do JD1; conserva as frases já integradas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {FAMILIAS_JD1} from '../jd1-2026-10-06/familias.mjs';
const file = 'src/data/o-que-e-das-familias.mjs';
const texto = fs.readFileSync(file,'utf8');
const inicio = texto.indexOf('export const FAMILIAS_DAS_LINHAS = ') + 'export const FAMILIAS_DAS_LINHAS = '.length;
const fim = texto.indexOf(';\n\nexport const FAMILIAS_DOS_CONCELHOS',inicio);
assert.ok(inicio>0 && fim>inicio);
const familias = JSON.parse(texto.slice(inicio,fim));
let resultado = texto;
for(const f of FAMILIAS_JD1) {
 assert.deepEqual(f.origens,[],'O JD1 conserva a apresentação anterior.');
 for(const chave of f.chaves) {
  assert.ok(familias[chave]);familias[chave].origens=f.origens;
  const a=resultado.indexOf(`  "${chave}": {`);
  const z=resultado.indexOf('\n  }',a)+4;
  assert.ok(a>=0 && z>a);
  const corpo=JSON.stringify(familias[chave],null,2).replaceAll('\n','\n  ');
  resultado=resultado.slice(0,a)+`  "${chave}": `+corpo+resultado.slice(z);
 }
}
fs.writeFileSync(file,resultado);
console.log('Listas visíveis do JD1 compostas sem reescrever as frases.');
