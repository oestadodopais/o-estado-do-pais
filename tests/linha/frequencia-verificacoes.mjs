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
for (const palavra of ['diário', 'diária', 'diários', 'diárias', 'semanal', 'semanais', 'mensal', 'mensais', 'anual', 'anuais', 'daily', 'weekly', 'monthly', 'yearly', 'annual',
  'diariamente', 'semanalmente', 'quinzenal', 'quinzenais', 'trimestral', 'trimestrais', 'semestral', 'semestrais',
  'todos os dias', 'cada dia', 'todas as semanas', 'every day', 'each day', 'every week', 'fortnightly', 'quarterly', 'annually', 'biweekly', 'bi-weekly',
  'dailies', 'weeklies', 'fortnightlies', 'monthlies', 'quarterlies', 'yearlies', 'annuals', 'biweeklies', 'bi-weeklies', 'Diária'.normalize('NFD')]) {
  assert(conferirFrequencias({...original, rotulos: {pt: {extra: palavra}}}).some(e => /extra.*sem período declarado/.test(e)), palavra);
}

// O painel regressa após três semanas. O limite continua a ser catorze dias.
const regresso = {...original, linhas: [{verifications: ['2026-09-01', '2026-09-22', '2026-09-29', '2026-10-06', '2026-10-13', '2026-10-20']
  .map(date => ({by: 'painel-semanal', date}))}]};
assert(conferirFrequencias({...regresso, construidoEm: '2026-10-20T00:00:00Z'}).some(e => /2026-09-01 a 2026-09-22: 21 dias, limite 14/.test(e)));
assert.deepEqual(conferirFrequencias({...regresso, construidoEm: '2026-10-21T00:00:00Z'}), []);
// A janela depende do extremo mais recente, mesmo que o primeiro seja anterior.
assert(conferirFrequencias({...regresso, construidoEm: '2026-10-19T00:00:00Z'}).some(e => /21 dias, limite 14/.test(e)));
assert(conferirFrequencias({...regresso, construidoEm: '2026-11-04T00:00:00Z'}).some(e => /2026-10-20 a 2026-11-04: 15 dias, limite 14/.test(e)));

for (const [palavra, periodo] of [['diária', 1], ['semanalmente', 7], ['quinzenais', 14], ['mensais', 30],
  ['trimestrais', 91], ['semestrais', 182], ['annually', 365], ['bi-weekly', 14]]) {
  const caso = {rotulos: {pt: {autor: palavra}}, frequencias: {autor: periodo}, construidoEm: '2026-11-06T00:00:00Z',
    linhas: [{verifications: [{by: 'autor', date: '2026-11-06'}]}]};
  assert.deepEqual(conferirFrequencias(caso), [], palavra);
  assert(conferirFrequencias({...caso, frequencias: {autor: periodo + 1}}).some(e => /mas o declarado/.test(e)), palavra);
}

// Executa o ponto real de chamada do gate, com uma cópia da tabela de produção.
// Assim, desligar a régua dessa tabela também faz esta planta falhar.
const inicioDaChamada = gate.indexOf('\n{\n  let construidoEm;');
const fimDaChamada = gate.indexOf('\nconst ROTULO_DO_RESULTADO', inicioDaChamada);
assert(inicioDaChamada > 0 && fimDaChamada > inicioDaChamada);
function errosDaChamada(rotulos) {
  const erros = [];
  vm.runInNewContext(gate.slice(inicioDaChamada, fimDaChamada), {
    fs, path: {join: (...partes) => partes.join('/')}, DIST: fileURLToPath(new URL('../../dist', import.meta.url)),
    ROTULO_DE_QUEM_RELEU: original.rotulos, FREQUENCIA_DE_QUEM_RELEU: original.frequencias,
    t: lang => ({livro: {linha: {verificacaoPor: rotulos[lang]}}}),
    livroInteiro: new Map(original.linhas.map((linha, i) => [i, linha])), conferirFrequencias, erros,
  });
  return erros;
}
assert.deepEqual(errosDaChamada(producao), []);
for (const palavra of ['diária', 'Diária'.normalize('NFD')]) {
  const copia = structuredClone(producao);
  copia.pt['painel-semanal'] = `comparação ${palavra} com a fonte`;
  assert(errosDaChamada(copia).some(e => e.rel === 'frequência das verificações (produção)' &&
    /painel-semanal.*diz período 1, mas o declarado é 7/.test(e.msg)), palavra);
}
const foraDaTabela = structuredClone(producao);
foraDaTabela.pt.extra = 'conferência semanalmente';
assert(errosDaChamada(foraDaTabela).some(e => /extra.*sem período declarado/.test(e.msg)));
assert(conferirFrequencias({...original, construidoEm: undefined}).some(e => /construido_em/.test(e)));
assert.deepEqual(conferirFrequencias(original), [], 'As plantas não alteram as tabelas nem as linhas originais');
console.log('HIG-5 A: janela, regresso, vocabulário, períodos e chamada de produção do gate conferidos.');
