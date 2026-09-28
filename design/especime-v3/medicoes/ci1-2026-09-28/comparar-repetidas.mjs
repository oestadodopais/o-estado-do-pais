#!/usr/bin/env node
/**
 * AS CONFERÊNCIAS REPETIDAS DIZEM DUAS VEZES A MESMA COISA? (bloco CI1, 28.09.2026)
 *
 * O `verify` inteiro torna a correr 17 conferências que o `build` já correu
 * com o mesmo comando, sobre o mesmo `dist/`. Este guião lê o registo de um
 * `npm run build` e o de um `npm run verify` corrido logo a seguir sobre o
 * mesmo `dist/` (os dois escritos por `cronometro.mjs`), tira de cada um a
 * saída de cada conferência repetida (da sua marca «> pacote@versão nome» à
 * seguinte; a do `check:documentos` no `build` acaba onde o Astro começa), e
 * compara-as linha a linha, depois de apagar só o que muda de uma corrida
 * para a outra sem ser um veredicto: a hora de cada linha e as durações
 * («1,2 s», «(+12ms)», «em 3.4 s»). Diz, por conferência, se as duas saídas
 * são iguais, e mostra as primeiras linhas diferentes quando não são.
 *
 * O CONHECIDO-POSITIVO corre primeiro: uma linha trocada numa cópia da saída
 * tem de ser vista como diferença, ou o guião sai com 2.
 *
 * Uso: node comparar-repetidas.mjs <build.log> <verify.log> [--json <saida>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const [logBuild, logVerify] = process.argv.slice(2).filter((a) => !a.startsWith('--') && !a.endsWith('.json'));
const json = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
const scripts = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).scripts;
const passos = (c) => c.split('&&').map((s) => s.trim()).filter(Boolean);
const doBuild = new Set(passos(scripts.build));
const repetidos = passos(scripts.verify).filter((p) => doBuild.has(p)).map((p) => p.replace(/^npm run /, ''));

/** As linhas do registo, sem a hora e os segundos que o cronómetro põe à frente. */
const linhasDe = (f) => fs.readFileSync(f, 'utf8').split('\n').map((l) => l.replace(/^\S+ \+[\d.]+s [ !] /, ''));
/** O que muda de uma corrida para outra sem ser veredicto. */
const normaliza = (l) =>
  l
    .replace(/\d+(?:[.,]\d+)?\s?(?:ms|s)\b/g, '<t>')
    .replace(/\(\+\d+(?:\.\d+)?m?s\)/g, '(<t>)')
    .replace(/\b\d\d:\d\d:\d\d\b/g, '<hora>')
    .replace(/\s+$/, '');

function blocos(linhas, norm = normaliza) {
  const mapa = new Map();
  let atual = null;
  for (const l of linhas) {
    const m = /^> [^@\s]+@\S+ (\S+)/.exec(l);
    if (m) {
      atual = m[1];
      mapa.set(atual, []);
      continue;
    }
    if (atual === null) continue;
    /* A construção do Astro não é um guião do npm: no `build` corre dentro do
       bloco do `check:documentos`, e o bloco acaba onde ela começa. */
    if (atual === 'check:documentos' && /^\d\d:\d\d:\d\d \[(types|build|content|vite)\]/.test(l)) {
      atual = '(astro)';
      mapa.set(atual, []);
      continue;
    }
    mapa.get(atual).push(norm(l));
  }
  return mapa;
}

function compara(a, b) {
  const n = Math.max(a.length, b.length);
  const dif = [];
  for (let i = 0; i < n && dif.length < 6; i++) if (a[i] !== b[i]) dif.push({ linha: i + 1, build: a[i] ?? null, verify: b[i] ?? null });
  return dif;
}

/* O conhecido-positivo. */
const cp = compara(['a', 'b', 'c'], ['a', 'x', 'c']);
if (cp.length !== 1 || cp[0].linha !== 2) {
  console.error('o conhecido-positivo da comparação falhou');
  process.exit(2);
}

const b = blocos(linhasDe(logBuild));
const v = blocos(linhasDe(logVerify));
/* E sem normalizar nada: quantas linhas diferem, cruas, em todas as repetidas. */
const bCru = blocos(linhasDe(logBuild), (l) => l);
const vCru = blocos(linhasDe(logVerify), (l) => l);
let cruasDiferentes = 0;
for (const nome of repetidos) {
  const x = (bCru.get(nome) ?? []).filter((l) => l.trim() !== '');
  const y = (vCru.get(nome) ?? []).filter((l) => l.trim() !== '');
  for (let i = 0; i < Math.max(x.length, y.length); i++) if (x[i] !== y[i]) cruasDiferentes++;
}
const resultado = [];
for (const nome of repetidos) {
  const lb = (b.get(nome) ?? []).filter((l) => l.trim() !== '');
  const lv = (v.get(nome) ?? []).filter((l) => l.trim() !== '');
  const dif = compara(lb, lv);
  resultado.push({ conferencia: nome, linhas_no_build: lb.length, linhas_no_verify: lv.length, iguais: lb.length > 0 && dif.length === 0, diferencas: dif });
}
const iguais = resultado.filter((r) => r.iguais).length;
for (const r of resultado) {
  console.log(`${r.iguais ? '=' : '≠'} ${r.conferencia.padEnd(20)} ${r.linhas_no_build} linhas no build, ${r.linhas_no_verify} no verify`);
  for (const d of r.diferencas) console.log(`     l.${d.linha} build «${d.build}»\n          verify «${d.verify}»`);
}
console.log(`${iguais} de ${resultado.length} conferências repetidas disseram o mesmo nas duas corridas; ${cruasDiferentes} linha(s) diferente(s) sem normalizar nada`);
if (json) fs.writeFileSync(json, JSON.stringify({ conhecido_positivo: 'uma linha trocada é vista', repetidas: resultado.length, iguais, linhas_diferentes_sem_normalizar: cruasDiferentes, conferencias: resultado }, null, 1) + '\n');
