#!/usr/bin/env node
// AT1: partes disjuntas, sobre um único dist transportado com as datas intactas.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {conferirFatia, juntarAlvos} from './alvos-fatias.mjs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { restantesDoVerify, celulaDaUniao, celulaDaCabeca, correr, plantas, passosDaEscrita } from './verify-depois-do-build.mjs';

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
  const escrita = passosDaEscrita(scripts);
  const exigidos = scripts['build:escrever'] === undefined ? todos : [...new Set([...todos, ...build])];
  const esperados = exigidos.filter(p => !escrita.includes(p) && !motor.includes(p));
  const recebidos = partes.flat();
  assert.equal(new Set(recebidos).size, recebidos.length, 'passo repetido nas partes');
  assert.deepEqual([...recebidos].sort(), [...esperados].sort(), 'faltam ou sobram passos nas partes');
}

export function dividir(scripts, tempos, n = 8) {
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
  const fatias = scripts.verify.split(/\s*&&\s*/).filter(p => /^npm run check:alvos:[012]$/.test(p));
  let alvos;
  if (fatias.length) {
    assert.deepEqual([...fatias].sort(), [0,1,2].map(i=>`npm run check:alvos:${i}`), 'faltam passos dos alvos');
    for (const p of provas) {
      const esperadas = base.partes[p.parte].filter(p=>/^npm run check:alvos:[012]$/.test(p)).map(p=>Number(p.at(-1)));
      assert.deepEqual((p.alvos ?? []).map(a=>a.fatia).sort(), esperadas.sort(), 'prova de alvos fora da sua parte');
    }
    alvos = juntarAlvos(provas.flatMap(p=>p.alvos ?? []), resumo(JSON.stringify(base)));
  }
  const corridos = provas.flatMap(p => p.corridos);
  conferirPartes(scripts, [corridos.map(c => c.passo)]);
  const U = celulaDaUniao(scripts, corridos, base.construidos);
  assert(U.ok, U.falhas.join('\n'));
  return { ok: true, cabeca: base.cabeca, U, alvos, partes: provas };
}

async function main() {
  const [modo, numero, ficheiro] = process.argv.slice(2);
  const scripts = ler(path.join(raiz, 'package.json')).scripts;
  const dist = path.join(raiz, 'dist');
  const basePath = path.join(raiz, 'at1-build.json');
  if (modo === 'construir') {
    const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'vel1-escrita-'));
    fs.rmSync(path.join(raiz, 'at1-escrita.json'), { force: true });
    try {
      execFileSync('python3', ['scripts/leituras/com-tranca.py', 'npm', 'run', 'build:escrever'], {
        cwd: raiz, stdio: 'inherit', env: { ...process.env, OEDP_TEMPOS_DIR: pasta,
          OEDP_CADEIA: 'build:escrever', npm_config_script_shell: path.join(raiz, 'scripts/leituras/tempos-shell.py') },
      });
      const corridos = fs.readdirSync(path.join(pasta, '.tempos'))
        .map(f => ler(path.join(pasta, '.tempos', f)))
        .filter(c => c.cadeia === 'build:escrever' && !c.passo.startsWith('cadeia:'))
        .sort((a, b) => a.inicio.localeCompare(b.inicio));
      assert.deepEqual(corridos.map(c => c.passo), passosDaEscrita(scripts), 'registo incompleto da escrita');
      assert(corridos.every(c => c.codigo === 0), 'escrita vermelha');
      fs.writeFileSync(path.join(raiz, 'at1-escrita.json'), JSON.stringify({ cabeca: head(),
        scripts: resumo(JSON.stringify(scripts)), corridos }, null, 2) + '\n');
    } finally { fs.rmSync(pasta, { recursive: true, force: true }); }
    return;
  }
  if (modo === 'planear') {
    const tempos = ler(path.join(raiz, 'scripts/verify-partes-tempos.json'));
    const plano = dividir(scripts, {...tempos.estimativas, ...tempos.passos}, tempos.partes);
    plano.estimados = plano.partes.flat().filter(p => p in (tempos.estimativas ?? {}) && !(p in tempos.passos));
    const C = celulaDaCabeca(dist, head());
    assert(C.ok, C.falhas.join('\n'));
    const registo = ler(numero ?? 'at1-escrita.json');
    assert.equal(registo.cabeca, head(), 'registo de outra cabeça');
    assert.equal(registo.scripts, resumo(JSON.stringify(scripts)), 'registo de outras cadeias');
    const construidos = registo.corridos;
    const U = celulaDaUniao(scripts, plano.partes.flat().map(passo => ({passo, codigo: 0})), construidos);
    assert(U.ok, U.falhas.join('\n'));
    const base = { cabeca: head(), ...plano, construidos, dist: inventario(dist), scripts: resumo(JSON.stringify(scripts)) };
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
    const pastaAlvos = fs.mkdtempSync(path.join(os.tmpdir(), 'vel1-alvos-'));
    const manifesto = resumo(JSON.stringify(base));
    const anteriores = {dir:process.env.OEDP_ALVOS_DIR, execucao:process.env.OEDP_ALVOS_EXECUCAO};
    try {
      process.env.OEDP_ALVOS_DIR = pastaAlvos;
      process.env.OEDP_ALVOS_EXECUCAO = manifesto;
      const r = await correr({ raiz, dist, cabeca: head(), paralelo: 1,
        scripts: { build: '', verify: selecionados.join(' && ') }, escolher: () => selecionados });
      assert.deepEqual(inventario(dist), base.dist, 'dist alterado pela parte');
      const alvos = selecionados.filter(p=>/^npm run check:alvos:[012]$/.test(p)).map(p=>ler(path.join(pastaAlvos, `fatia-${p.at(-1)}.json`)));
      for (const p of alvos) conferirFatia(p, manifesto);
      const prova = { ...r, corridos: r.corridos.map(({ saida, ...c }) => c), alvos,
        cabeca: head(), parte: i, manifesto };
      fs.writeFileSync(ficheiro, JSON.stringify(prova, null, 2) + '\n');
      assert(r.ok, 'parte vermelha');
    } finally {
      fs.rmSync(pastaAlvos, {recursive:true, force:true});
      for (const [k, v] of [['OEDP_ALVOS_DIR', anteriores.dir], ['OEDP_ALVOS_EXECUCAO', anteriores.execucao]])
        if (v === undefined) delete process.env[k]; else process.env[k] = v;
    }
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
