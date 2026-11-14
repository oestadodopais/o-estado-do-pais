/** Renova os apoios das definições COR3 sem mudar as frases lidas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {FAMILIAS_DAS_LINHAS} from '../src/data/o-que-e-das-familias.mjs';
import {ORIGENS_DAS_DEFINICOES} from '../src/data/figuras.mjs';
const file = 'tests/cartao/leituras-provadas.json';
const auditoria = JSON.parse(fs.readFileSync(file, 'utf8'));
const antiga = 'hb1c-eurostat-preco-rendimento', nova = antiga + '-rendimento';
let n = 0;
for (const e of auditoria.familias) {
  if (!e.chaves?.some(k => FAMILIAS_DAS_LINHAS[k]?.origens?.includes(nova))) continue;
  assert(e.chaves.every(k => FAMILIAS_DAS_LINHAS[k]?.origens?.includes(nova)), 'família mistura unidades');
  e.origens = e.origens.map(o => o === antiga ? nova : o);
  for (const folha of e.folhas) for (const parte of folha.partes) for (const apoio of parte.apoios ?? []) {
    if (apoio.origem !== antiga && apoio.origem !== nova) continue;
    assert(ORIGENS_DAS_DEFINICOES[nova][apoio.campo].includes(apoio.literal), 'literal fora do excerto selado');
    apoio.origem = nova;
  }
  n += e.chaves.length;
}
assert.equal(n, 11);
fs.writeFileSync(file, JSON.stringify(auditoria, null, 2) + '\n');
console.log(`COR3: ${n} definições de índice de ano base com o apoio do rendimento.`);
