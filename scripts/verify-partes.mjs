#!/usr/bin/env node
// AT1: partes disjuntas, sobre um único dist transportado com as datas intactas.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { restantesDoVerify, celulaDaUniao, celulaDaCabeca, correr, plantas } from './verify-depois-do-build.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ler = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const resumo = texto => crypto.createHash('sha256').update(texto).digest('hex');
const head = () => execFileSync('git', ['rev-parse', 'HEAD'], { cwd: raiz, encoding: 'utf8' }).trim();

export function inventario(pasta) {
  const mapa = {};
  function andar(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(dir, e.name);
      assert(!e.isSymbolicLink(), 'ligação no dist');
      if (e.isDirectory()) andar(p);
      else mapa[path.relative(pasta, p)] = resumo(fs.readFileSync(p));
    }
  }
  andar(pasta);
  assert(Object.keys(mapa).length, 'dist vazio');
  return mapa;
}

export function conferirPartes(scripts, partes) {
  // Leitura independente da escolha e contagem sensível a repetições.
  if (scripts['build:conteudo'] !== undefined) assert.equal(scripts.build, 'python3 scripts/leituras/com-tranca.py npm run build:conteudo', 'build desligado da cadeia');
  const todos = scripts.verify.split(/\s*&&\s*/).map(x => x.trim());
  const build = (scripts['build:conteudo'] ?? scripts.build).split(/\s*&&\s*/).map(x => x.trim());
  assert(todos.every(Boolean) && build.every(Boolean), 'passo vazio');
  const motor = scripts['verify:com-motor'] === undefined ? [] : scripts['verify:com-motor'].split(/\s*&&\s*/).map(p => p.trim());
  assert(motor.every(p => p && todos.includes(p)) && new Set(motor).size === motor.length, 'verify:com-motor inválido ou fora do verify');
  const esperados = todos.filter(p => !build.includes(p) && !motor.includes(p));
  const recebidos = partes.flat();
  assert.equal(new Set(recebidos).size, recebidos.length, 'passo repetido nas partes');
  assert.deepEqual([...recebidos].sort(), [...esperados].sort(), 'faltam ou sobram passos nas partes');
}

export function dividir(scripts, tempos, n = 6) {
  const partes = Array.from({ length: n }, () => []);
  const cargas = Array(n).fill(0);
  const restantes = restantesDoVerify(scripts);
  for (const passo of [...restantes].sort((a, b) => (tempos[b] ?? 0) - (tempos[a] ?? 0))) {
    const i = cargas.indexOf(Math.min(...cargas));
    partes[i].push(passo);
    cargas[i] += tempos[passo] ?? 0;
  }
  conferirPartes(scripts, partes);
  return { partes, cargas, sem_medida: restantes.filter(p => !(p in tempos)) };
}

export function juntar(scripts, base, provas) {
  conferirPartes(scripts, base.partes);
  assert.equal(provas.length, base.partes.length, 'falta uma prova');
  const indices = provas.map(p => p.parte);
  assert.deepEqual([...indices].sort(), base.partes.map((_, i) => i), 'parte ausente ou repetida');
  for (const p of provas) {
    assert.equal(p.cabeca, base.cabeca, 'prova de outra cabeça');
    assert.equal(p.manifesto, resumo(JSON.stringify(base)), 'prova de outra construção');
    assert(p.ok && p.celulas.U.ok && p.celulas.D.ok && p.celulas.C.ok, 'prova vermelha');
    assert.deepEqual(p.corridos.map(c => c.passo).sort(), [...base.partes[p.parte]].sort(), 'execução incompleta');
    assert(p.corridos.every(c => c.codigo === 0), 'conferência vermelha');
  }
  const corridos = provas.flatMap(p => p.corridos);
  conferirPartes(scripts, [corridos.map(c => c.passo)]);
  const U = celulaDaUniao(scripts, corridos);
  assert(U.ok, U.falhas.join('\n'));
  return { ok: true, cabeca: base.cabeca, U, partes: provas };
}

async function main() {
  const [modo, numero, ficheiro] = process.argv.slice(2);
  const scripts = ler(path.join(raiz, 'package.json')).scripts;
  const dist = path.join(raiz, 'dist');
  const basePath = path.join(raiz, 'at1-build.json');
  if (modo === 'planear') {
    const tempos = ler(path.join(raiz, 'scripts/verify-partes-tempos.json'));
    const plano = dividir(scripts, tempos.passos, tempos.partes);
    const C = celulaDaCabeca(dist, head());
    assert(C.ok, C.falhas.join('\n'));
    const base = { cabeca: head(), ...plano, dist: inventario(dist), scripts: resumo(JSON.stringify(scripts)) };
    fs.writeFileSync(basePath, JSON.stringify(base, null, 2) + '\n');
    console.log(JSON.stringify({ cargas: plano.cargas, sem_medida: plano.sem_medida }));
    return;
  }
  const base = ler(basePath);
  assert.equal(base.cabeca, head(), 'artefacto de outra cabeça');
  assert.equal(base.scripts, resumo(JSON.stringify(scripts)), 'cadeias mudaram');
  assert.deepEqual(inventario(dist), base.dist, 'dist diferente do artefacto construído');
  conferirPartes(scripts, base.partes);
  if (modo === 'parte') {
    assert((await plantas()).ok, 'as plantas U/D/C falharam');
    const i = Number(numero);
    assert(Number.isInteger(i) && i >= 0 && i < base.partes.length, 'parte inválida');
    const selecionados = base.partes[i];
    // D e C são as mesmas células; U local confere cada processo selecionado.
    // A U inteira corre no trabalho final sobre os registos efetivamente recebidos.
    const r = await correr({ raiz, dist, cabeca: head(), paralelo: 1,
      scripts: { ...scripts, 'verify:com-motor': undefined, verify: selecionados.join(' && ') }, escolher: () => selecionados });
    assert.deepEqual(inventario(dist), base.dist, 'dist alterado pela parte');
    const prova = { ...r, corridos: r.corridos.map(({ saida, ...c }) => c),
      cabeca: head(), parte: i, manifesto: resumo(JSON.stringify(base)) };
    fs.writeFileSync(ficheiro, JSON.stringify(prova, null, 2) + '\n');
    assert(r.ok, 'parte vermelha');
  } else if (modo === 'juntar') {
    const provas = base.partes.map((_, i) => ler(path.join(numero, `parte-${i}.json`)));
    const prova = juntar(scripts, base, provas);
    fs.writeFileSync(ficheiro, JSON.stringify(prova, null, 2) + '\n');
    console.log('U/D/C: todas as partes verdes sobre o mesmo dist');
  } else throw new Error('use planear, parte <n> <json> ou juntar <pasta> <json>');
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  main().catch(e => { console.error(e.message); process.exitCode = 1; });
}
