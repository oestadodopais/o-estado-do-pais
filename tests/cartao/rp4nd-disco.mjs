/** K16: executa-se isoladamente pela tranca, nunca em paralelo com os leitores. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {conferirOrigemRP4N} from './origens-rp4n.mjs';
const ficheiro = new URL('../../src/data/origens-rp4n.json', import.meta.url);
const original = fs.readFileSync(ficheiro);
const origens = JSON.parse(original);
assert.equal(conferirOrigemRP4N('rp4n-orcamento', origens['rp4n-orcamento']), null);
try {
  const copia = structuredClone(origens);
  copia['rp4n-orcamento'].excerto += ' PALAVRA PLANTADA';
  fs.writeFileSync(ficheiro, JSON.stringify(copia));
  assert.equal(conferirOrigemRP4N('rp4n-orcamento', copia['rp4n-orcamento']), 'a exportação documental difere do registo da travessia');
  console.log('K16: o ficheiro exportado alterado em disco foi recusado pelo resumo da travessia.');
} finally { fs.writeFileSync(ficheiro, original); }
assert.deepEqual(fs.readFileSync(ficheiro), original);
assert.equal(conferirOrigemRP4N('rp4n-orcamento', origens['rp4n-orcamento']), null);
console.log('K16: reposição byte a byte confirmada; controlo íntegro a zero.');
