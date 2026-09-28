#!/usr/bin/env node
/** C1, ponto 5: o CSV limpo passa; um valor trocado é recusado pela C7.
 * As plantas correm o portão numa cópia temporária e repõem os mesmos bytes.
 * Com --construido, a origem dos bytes é dist/, depois da construção final. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { GET } from '../../src/pages/dados/indicadores-dos-concelhos.csv.js';
import { lerCsv } from '../../src/lib/dados.mjs';
import { confereIndicadoresDosConcelhos } from '../../scripts/dados-concelhos.mjs';

const resposta = GET();
assert.equal(resposta.headers.get('Content-Type'), 'text/csv; charset=utf-8');
const gerado = await resposta.text();
const construido = process.argv.includes('--construido');
const bruto = construido ? fs.readFileSync('dist/dados/indicadores-dos-concelhos.csv', 'utf8') : gerado;
if (construido) assert.equal(bruto, gerado, 'O ficheiro construído diverge do endpoint.');
const medicao = confereIndicadoresDosConcelhos(bruto);
assert.deepEqual(medicao.erros, []);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-c1-dados-'));
const relativo = 'dados/indicadores-dos-concelhos.csv';
const alvo = path.join(tmp, relativo);
fs.mkdirSync(path.dirname(alvo), { recursive: true });
const sha = (s) => createHash('sha256').update(s).digest('hex');
const resultados = [];
const correr = () => {
  const r = spawnSync(process.execPath, ['scripts/check-dados.mjs', '--celula', 'C7'], {
    encoding: 'utf8', env: { ...process.env, OEDP_DIST: tmp }, maxBuffer: 4 * 1024 * 1024,
  });
  return { codigo: r.status, saida: (r.stdout + r.stderr).trim() };
};
const registos = bruto.split('\n');
const primeira = registos.findIndex((l) => l && !l.startsWith('#')) + 1;
const campos = lerCsv(bruto).linhas[0];
function planta(nome, estragar, mordida) {
  fs.writeFileSync(alvo, bruto);
  const antes = sha(fs.readFileSync(alvo));
  const alterado = estragar([...registos]);
  assert.notEqual(alterado, bruto);
  let recusa;
  try { fs.writeFileSync(alvo, alterado); recusa = correr(); }
  finally { fs.writeFileSync(alvo, bruto); }
  const reposto = sha(fs.readFileSync(alvo));
  const limpa = correr();
  const passou = recusa.codigo === 1 && mordida.test(recusa.saida) && reposto === antes && limpa.codigo === 0;
  resultados.push({ nome, ficheiro: `dist/${relativo}`, comando: 'node scripts/check-dados.mjs --celula C7',
    ...recusa, mordida: mordida.source, antes, reposto, codigo_reposicao: limpa.codigo, passou });
  assert.ok(passou, `${nome}: ${recusa.saida}`);
  console.log(`OK ${nome}`);
}
try {
  fs.writeFileSync(alvo, bruto);
  const limpa = correr();
  assert.equal(limpa.codigo, 0, limpa.saida);
  planta('valor-trocado-no-csv', (linhas) => {
    linhas[primeira] = linhas[primeira].replace(campos[2], 'VALOR-TROCADO');
    return linhas.join('\n');
  }, /C7 .*valor difere da linha/);
  planta('unidade-trocada-no-csv', (linhas) => {
    linhas[primeira] = linhas[primeira].replace(campos[3], 'UNIDADE-TROCADA');
    return linhas.join('\n');
  }, /C7 .*unidade difere da linha/);
  planta('medida-omitida-no-csv', (linhas) => {
    linhas.splice(primeira, 1); return linhas.join('\n');
  }, /C7 .*falta o concelho e a medida/);
  planta('medida-repetida-no-csv', (linhas) => {
    linhas.splice(primeira, 0, linhas[primeira]); return linhas.join('\n');
  }, /C7 .*concelho e medida repetidos/);
  const prova = { origem: construido ? 'dist/' : 'endpoint sem construção', ...medicao, limpa, plantas: resultados };
  const i = process.argv.indexOf('--json');
  if (i >= 0) {
    const destino = process.argv[i + 1];
    assert.ok(destino && !path.isAbsolute(destino), 'A prova exige um destino relativo.');
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, JSON.stringify(prova, null, 2) + '\n');
  }
  console.log(`C7: ${medicao.linhas} linhas, ${medicao.concelhos} concelhos, ${resultados.length} plantas recusadas e repostas.`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
