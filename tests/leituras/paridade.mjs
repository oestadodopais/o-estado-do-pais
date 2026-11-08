import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {compara, plantasParidade} from '../../scripts/paridade-numeros.mjs';
import {assinatura, conferirParidade} from '../../scripts/check-paridade.mjs';
assert.equal(plantasParidade.filter(Boolean).length, 6);
const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'hig6-paridade-'));
let provas = 6;
try {
  const estudo = 'a-casa-em-portugal-e-na-europa';
  const escrever = (pt, en) => {
    for (const [raiz, texto] of [['estudos', pt], ['en/studies', en]]) for (const sufixo of ['', raiz === 'estudos' ? 'documento' : 'document']) {
      const dir = path.join(dist, raiz, estudo, sufixo); fs.mkdirSync(dir, {recursive:true}); fs.writeFileSync(path.join(dir, 'index.html'), '<main><p>' + texto + '</p></main>');
    }
  };
  const excecoes = {data:'2026-11-08', natureza:'permanente', razao:'A glosa inglesa repete os números das citações portuguesas.', diferencas:[]};
  escrever('12', '21');
  assert.equal(conferirParidade(dist, excecoes).erros.length, 2); provas++;
  const numeros = assinatura(compara(['12'], ['21']));
  excecoes.diferencas = ['documento','página'].map(tipo => ({estudo, tipo, numeros}));
  assert.equal(conferirParidade(dist, excecoes).erros.length, 0); provas++;
  escrever('12', '22'); assert.equal(conferirParidade(dist, excecoes).erros.length, 2); provas++;
  escrever('12', '12'); assert.equal(conferirParidade(dist, excecoes).erros.length, 2); provas++;
  excecoes.diferencas = [];
  assert.equal(conferirParidade(dist, excecoes).erros.length, 0); provas++;
  const agua = path.join(dist, 'estudos/onde-esta-a-agua/documento');
  const water = path.join(dist, 'en/studies/onde-esta-a-agua/document');
  fs.mkdirSync(agua, {recursive:true}); fs.mkdirSync(water, {recursive:true});
  for (const [dir, valor] of [[agua, '12'], [water, '13']]) {
    fs.writeFileSync(path.join(dir, 'index.html'), '<p>' + valor + '</p>');
    fs.writeFileSync(path.join(dir, '../index.html'), '<p>' + valor + '</p>');
  }
  assert.equal(conferirParidade(dist, excecoes).erros.filter(e => e.startsWith('onde-esta-a-agua|')).length, 2); provas++;
  assert.throws(() => conferirParidade(dist, {...excecoes, diferencas:[{estudo:'onde-esta-a-agua', tipo:'documento', numeros}]}), /lista fechada/); provas++;
  assert.throws(() => conferirParidade(dist, {...excecoes, razao:''}), /razão/); provas++;
  assert.throws(() => conferirParidade(dist, {...excecoes, retirar:'COR-AGUA'}), /permanente/); provas++;
  const troca = compara(['12', '21'], ['21', '12']);
  assert.equal(troca.total.soPt.length, 0); assert.equal(troca.blocos.length, 2); provas++;
} finally { fs.rmSync(dist, {recursive:true, force:true}); }
console.log(`paridade: ${provas} provas, incluindo as seis da AUD1, diferença nova, exceção exata, alterada e caduca, e troca entre blocos`);
