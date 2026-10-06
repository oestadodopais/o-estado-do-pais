#!/usr/bin/env node
/**
 * A PLANTA DO TETO DA L1 DEPOIS DA FUSÃO (06.10.2026), a cópia da do R4 (`r4-2026-10-05/planta-teto-l1-r4.mjs`): uma
 * contagem do registo trocada em memória é recusada pela régua do teto, que exige que o teto seja o número inteiro
 * medido no registo que ele aponta. Corre `scripts/check-lugar.mjs` com a leitura do registo da medição adulterada (a
 * contagem mais um) e exige o código 1 e a queixa da régua; corre-a também sem planta e exige o código 0, que é a prova
 * de que a queixa vem da planta. Escreve `fusao/planta-teto-l1-fusao.json`. Não escreve em ficheiro nenhum do sítio.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const teto = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts', 'lugar-tetos-b1.json'), 'utf8'));
const QUEIXA = 'B1 L1: o teto tem de ser o número inteiro medido no registo.';
const codigo = `import fs from 'node:fs';
const ler = fs.readFileSync;
fs.readFileSync = function (f, ...a) {
  const corpo = ler.call(this, f, ...a);
  if (String(f).endsWith('/${teto.medicao}')) { const c = JSON.parse(String(corpo)); c.contagens.estudos += 1; return JSON.stringify(c); }
  return corpo;
};
await import('./scripts/check-lugar.mjs');`;
const limpa = spawnSync(process.execPath, ['scripts/check-lugar.mjs'], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
const r = spawnSync(process.execPath, ['--input-type=module', '-e', codigo], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
const saida = `${r.stdout}${r.stderr}`;
const mordeu = limpa.status === 0 && r.status === 1 && saida.includes(QUEIXA);
const registo = {
  nome: 'Uma contagem do registo trocada em memória é recusada pela régua do teto',
  cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim(),
  estado: execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: RAIZ, encoding: 'utf8' }),
  teto: teto.l1_paginas,
  medicao: teto.medicao,
  codigo_sem_planta: limpa.status,
  codigo: r.status,
  queixa: saida.includes(QUEIXA) ? QUEIXA : null,
  mordeu,
};
fs.writeFileSync(path.join(AQUI, 'fusao', 'planta-teto-l1-fusao.json'), `${JSON.stringify(registo, null, 2)}\n`);
console.log(JSON.stringify(registo));
process.exit(mordeu ? 0 : 1);
