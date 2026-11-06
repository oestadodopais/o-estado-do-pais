#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {conferirFrequencias} from '../../scripts/frequencia-verificacoes.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {t} from '../../src/i18n/strings.mjs';

// Cópias das tabelas reais, sem importar o portão que escreve a prova do dist.
const gate = fs.readFileSync(new URL('../../scripts/gate-html.mjs', import.meta.url), 'utf8');
function tabela(nome) {
  const trecho = gate.match(new RegExp(`const ${nome} = (\\{[\\s\\S]*?\\n\\});`));
  assert(trecho, `Tabela ${nome} ausente do portão`);
  return structuredClone(vm.runInNewContext(`(${trecho[1]})`));
}
const original = {
  rotulos: tabela('ROTULO_DE_QUEM_RELEU'),
  frequencias: tabela('FREQUENCIA_DE_QUEM_RELEU'),
  linhas: [...loadClaims({includeWithdrawn: true}).values()],
  construidoEm: JSON.parse(fs.readFileSync(new URL('../../dist/version.json', import.meta.url), 'utf8')).construido_em,
};
const producao = structuredClone(Object.fromEntries(['pt', 'en'].map(lang => [lang, t(lang).livro.linha.verificacaoPor])));
const planta = process.argv[2];
if (planta) {
  const copia = structuredClone(original);
  const copiaProducao = structuredClone(producao);
  if (planta === 'a') {
    for (const rotulos of [copia.rotulos, copiaProducao]) {
      rotulos.pt['corredor-diario'] = 'conferência diária do ficheiro da fonte';
      rotulos.en['corredor-diario'] = 'daily check of the source file';
    }
  } else if (planta === 'b') {
    // Recuar toda a sequência mantém os intervalos e recua o último dia trinta dias.
    for (const linha of copia.linhas) for (const entrada of linha.verifications ?? []) {
      if (entrada.by === 'painel-semanal')
        entrada.date = new Date(Date.parse(`${entrada.date}T00:00:00Z`) - 30 * 86400000).toISOString().slice(0, 10);
    }
  } else if (planta === 'c') delete copia.frequencias['painel-semanal'];
  else throw new Error(`Planta desconhecida: ${planta}`);
  const erros = [...conferirFrequencias(copia), ...conferirFrequencias({...copia, rotulos: copiaProducao})];
  for (const erro of erros) console.error(erro);
  process.exit(erros.length ? 1 : 0);
}

assert.equal(original.frequencias['painel-semanal'], 7);
assert.deepEqual(conferirFrequencias(original), []);
assert.deepEqual(conferirFrequencias({...original, rotulos: producao}), []);
for (const nome of ['a', 'b', 'c']) {
  const resultado = spawnSync(process.execPath, [fileURLToPath(import.meta.url), nome], {encoding: 'utf8'});
  assert.equal(resultado.status, 1, `Planta ${nome}: ${resultado.stderr}`);
  assert.match(resultado.stderr, /REL1:/);
  if (nome === 'a') {
    assert.match(resultado.stderr, /corredor-diario \(pt\)/);
    assert.match(resultado.stderr, /corredor-diario \(en\)/);
  } else if (nome === 'b') assert.match(resultado.stderr, /dias, limite 14/);
  else assert.match(resultado.stderr, /painel-semanal.*sem período declarado/);
  console.log(`Planta ${nome}: código ${resultado.status}`);
}

const exemplo = {...original, linhas: [{verifications: [{by: 'painel-semanal', date: '2026-11-02'}]}]};
assert.deepEqual(conferirFrequencias({...exemplo, construidoEm: '2026-11-16T23:59:59Z'}), []);
assert(conferirFrequencias({...exemplo, construidoEm: '2026-11-17T00:00:00Z'}).some(e => /2026-11-02 a 2026-11-17/.test(e)));
for (const [dia, falha] of [['2026-10-19', false], ['2026-10-18', true]]) {
  const linhas = structuredClone(exemplo.linhas);
  linhas[0].verifications.push({by: 'painel-semanal', date: dia});
  assert.equal(conferirFrequencias({...exemplo, linhas}).some(e => /dias, limite 14/.test(e)), falha);
}
for (const palavra of ['diário', 'diária', 'diários', 'diárias', 'semanal', 'semanais', 'mensal', 'mensais', 'anual', 'anuais', 'daily', 'weekly', 'monthly', 'yearly', 'annual']) {
  assert(conferirFrequencias({...original, rotulos: {pt: {extra: palavra}}}).some(e => /extra.*sem período declarado/.test(e)), palavra);
}
assert(conferirFrequencias({...original, construidoEm: undefined}).some(e => /construido_em/.test(e)));
assert.deepEqual(conferirFrequencias(original), [], 'As plantas não alteram as tabelas nem as linhas originais');
console.log('REL1: tabelas reais, três plantas, vocabulário e limites de catorze dias conferidos.');
