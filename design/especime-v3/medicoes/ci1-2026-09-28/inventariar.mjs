#!/usr/bin/env node
/**
 * O INVENTÁRIO DO QUE CADA CONFERÊNCIA ABRE (bloco CI1, 28.09.2026). Corre
 * sozinha, uma de cada vez, cada conferência que `scripts/verify-depois-do-build.mjs`
 * corre (a mesma escolha, importada dele), com a sonda ao lado
 * (`sonda.mjs`, pelo `NODE_OPTIONS`), e escreve por conferência:
 *
 *   - os servidores que abre e a porta que pede (0 é efémera);
 *   - os processos que lança, com o Chromium contado à parte;
 *   - o que escreve: em `dist/`, no resto da raiz do sítio (caminho relativo),
 *     nas pastas temporárias do sistema (quantas, e se o nome é único), e fora;
 *   - o `dist/` antes e depois, ficheiro a ficheiro (sha256), e o
 *     `git status --porcelain --ignored` antes e depois, que vê também o que um
 *     processo que não é Node escreve na árvore;
 *   - o código de saída, os segundos e a memória máxima (`/usr/bin/time -l`).
 *
 * A sonda prova primeiro que vê: o `check:cabeca` abre um servidor, um
 * Chromium e uma pasta temporária, e se a sonda não vir os três o inventário
 * sai com 2 antes de escrever o que quer que seja.
 *
 * Uso: node inventariar.mjs <saida.json>
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const { restantesDoVerify } = await import(path.join(RAIZ, 'scripts', 'verify-depois-do-build.mjs'));
const saida = process.argv[2];
if (!saida) {
  console.error('uso: node inventariar.mjs <saida.json>');
  process.exit(2);
}
const DIST = path.join(RAIZ, 'dist');
const TMPS = [os.tmpdir(), fs.realpathSync(os.tmpdir()), '/tmp', '/private/tmp', '/var/folders', '/private/var/folders'];
const CASA = os.homedir();

function resumos() {
  const m = new Map();
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.isFile()) m.set(path.relative(DIST, p), crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'));
    }
  };
  anda(DIST);
  return m;
}
const estado = () => execFileSync('git', ['status', '--porcelain', '--ignored', '--untracked-files=all'], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 2 ** 20 })
  .split('\n').filter((l) => l && !/^!! (dist|node_modules)\//.test(l));

/** @param {string} p */
function classe(p) {
  if (!p) return { onde: 'desconhecido' };
  const abs = path.isAbsolute(p) ? p : path.resolve(RAIZ, p);
  if (abs === DIST || abs.startsWith(DIST + path.sep)) return { onde: 'dist', rel: path.relative(RAIZ, abs) };
  if (abs.startsWith(RAIZ + path.sep)) return { onde: 'raiz', rel: path.relative(RAIZ, abs) };
  if (TMPS.some((t) => abs.startsWith(t + path.sep))) return { onde: 'tmp' };
  if (abs.startsWith(CASA + path.sep)) return { onde: 'casa', rel: `<casa>/${path.relative(CASA, abs).split(path.sep).slice(0, 3).join('/')}` };
  return { onde: 'fora', rel: abs.split(path.sep).slice(0, 3).join('/') };
}

function corre(passo, registo) {
  fs.writeFileSync(registo, '');
  const t0 = Date.now();
  const r = spawnSync('/usr/bin/time', ['-l', 'sh', '-c', passo], {
    cwd: RAIZ,
    env: { ...process.env, OEDP_SONDA_REGISTO: registo, NODE_OPTIONS: `--import=${path.join(AQUI, 'sonda.mjs')}` },
    encoding: 'utf8',
    maxBuffer: 256 * 2 ** 20,
  });
  const segundos = (Date.now() - t0) / 1000;
  const memoria = /(\d+)\s+maximum resident set size/.exec(r.stderr ?? '');
  const eventos = fs.readFileSync(registo, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  return { codigo: r.status, segundos, memoria_max_mib: memoria ? Math.round(Number(memoria[1]) / 2 ** 20) : null, eventos };
}

function resume(eventos) {
  const servidores = eventos.filter((e) => e.tipo === 'servidor').map((e) => ({ porta: e.porta, anfitriao: e.anfitriao }));
  const processos = eventos.filter((e) => e.tipo === 'processo').map((e) => e.comando);
  const chromium = processos.filter((c) => /chrom|headless_shell/i.test(c)).length;
  const escritas = eventos.filter((e) => e.tipo === 'escrita');
  const porOnde = { dist: new Set(), raiz: new Set(), tmp: 0, casa: new Set(), fora: new Set() };
  const temporarias = new Set();
  for (const e of escritas) {
    for (const p of [e.caminho, e.destino].filter(Boolean)) {
      const c = classe(p);
      if (c.onde === 'tmp') porOnde.tmp++;
      else if (porOnde[c.onde] instanceof Set) porOnde[c.onde].add(c.rel);
    }
    if (e.criado) temporarias.add(path.basename(e.criado).replace(/[A-Za-z0-9]{6}$/, 'XXXXXX'));
  }
  const tipos = {};
  for (const c of processos) {
    const k = /chrom|headless_shell/i.test(c) ? 'chromium' : path.basename(c.split(' ')[0]);
    tipos[k] = (tipos[k] ?? 0) + 1;
  }
  return {
    servidores,
    processos: tipos,
    chromium,
    escritas_em_dist: [...porOnde.dist].sort(),
    escritas_na_raiz: [...porOnde.raiz].sort(),
    escritas_em_tmp: porOnde.tmp,
    pastas_temporarias_criadas: [...temporarias].sort(),
    escritas_na_casa: [...porOnde.casa].sort(),
    escritas_fora: [...porOnde.fora].sort(),
  };
}

/* A SONDA PROVA PRIMEIRO QUE VÊ. */
const reg0 = path.join(os.tmpdir(), `oedp-ci1-sonda-${process.pid}.jsonl`);
const cp0 = resume(corre('npm run check:cabeca', reg0).eventos);
fs.rmSync(reg0, { force: true });
const cpOk = cp0.servidores.length >= 1 && cp0.chromium >= 1 && cp0.pastas_temporarias_criadas.some((n) => n.startsWith('oedp-cabeca-'));
if (!cpOk) {
  console.error('a sonda não viu o servidor, o Chromium e a pasta temporária do check:cabeca:', JSON.stringify(cp0));
  process.exit(2);
}

const scripts = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).scripts;
const restantes = restantesDoVerify(scripts);
const linhas = [];
for (const passo of restantes) {
  const distAntes = resumos();
  const gitAntes = estado();
  const reg = path.join(os.tmpdir(), `oedp-ci1-sonda-${process.pid}.jsonl`);
  const r = corre(passo, reg);
  fs.rmSync(reg, { force: true });
  const distDepois = resumos();
  const gitDepois = estado();
  const mudouDist = [...distAntes].filter(([k, h]) => distDepois.get(k) !== h).map(([k]) => k)
    .concat([...distDepois.keys()].filter((k) => !distAntes.has(k)));
  const antesSet = new Set(gitAntes);
  const depoisSet = new Set(gitDepois);
  const linha = {
    passo,
    codigo: r.codigo,
    segundos: r.segundos,
    memoria_max_mib: r.memoria_max_mib,
    ...resume(r.eventos),
    dist_mudou: mudouDist.slice(0, 20),
    git_antes_e_nao_depois: gitAntes.filter((l) => !depoisSet.has(l)),
    git_depois_e_nao_antes: gitDepois.filter((l) => !antesSet.has(l)),
  };
  linhas.push(linha);
  console.log(`${linha.codigo === 0 ? '✓' : '✗'} ${passo} · ${r.segundos.toFixed(1)} s · ${linha.memoria_max_mib} MiB · servidores ${linha.servidores.length} · chromium ${linha.chromium} · tmp ${linha.pastas_temporarias_criadas.join(',') || '0'} · raiz ${linha.escritas_na_raiz.join(',') || '0'} · dist ${linha.dist_mudou.length}`);
}
fs.writeFileSync(saida, JSON.stringify({
  cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim(),
  maquina: { processador: os.cpus()[0]?.model ?? null, nucleos: os.availableParallelism?.() ?? os.cpus().length },
  conhecido_positivo: { o_que: 'o check:cabeca abre um servidor, um Chromium e uma pasta oedp-cabeca-', visto: cp0 },
  conferencias: linhas,
}, null, 1) + '\n');
