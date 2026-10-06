#!/usr/bin/env node
/**
 * A PLANTA DO TETO DA L1 (bloco R4, 05.10.2026; a cópia da passagem R4-b, 06.10.2026, que escreve em r4b/): uma contagem do registo trocada em memória é recusada pela régua do
 * teto, que exige que o teto seja o número inteiro medido no registo que ele aponta. Corre `scripts/check-lugar.mjs`
 * com a leitura do registo da medição adulterada (a contagem mais um) e exige o código 1 e a queixa da régua; escreve
 * `planta-teto-l1-r4b.json` ao lado. Não escreve em ficheiro nenhum do sítio.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..', '..');
const teto = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts', 'lugar-tetos-b1.json'), 'utf8'));
const codigo = `import fs from 'node:fs';
const ler = fs.readFileSync;
fs.readFileSync = function (f, ...a) {
  const corpo = ler.call(this, f, ...a);
  if (String(f).endsWith('/${teto.medicao}')) { const c = JSON.parse(String(corpo)); c.contagens.estudos += 1; return JSON.stringify(c); }
  return corpo;
};
await import('./scripts/check-lugar.mjs');`;
const r = spawnSync(process.execPath, ['--input-type=module', '-e', codigo], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
const saida = `${r.stdout}${r.stderr}`;
const mordeu = r.status === 1 && saida.includes('B1 L1: o teto tem de ser o número inteiro medido no registo.');
const registo = {
  nome: 'Uma contagem do registo trocada em memória é recusada pela régua do teto',
  cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim(),
  estado: execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: RAIZ, encoding: 'utf8' }),
  teto: teto.l1_paginas,
  medicao: teto.medicao,
  codigo: r.status,
  mordeu,
};
fs.writeFileSync(path.join(AQUI, 'planta-teto-l1-r4b.json'), `${JSON.stringify(registo, null, 2)}\n`);
console.log(JSON.stringify(registo));
process.exit(mordeu ? 0 : 1);
