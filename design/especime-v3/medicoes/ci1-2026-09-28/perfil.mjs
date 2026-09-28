#!/usr/bin/env node
/**
 * O LEITOR DOS PERFIS DE CPU DO BLOCO CI1 (28.09.2026). Lê um `.cpuprofile`
 * do V8 (`node --cpu-prof`) e diz onde foi o tempo: por função, o tempo
 * próprio e o tempo inclusivo (a função e tudo o que ela chamou), e por
 * ficheiro do sítio. As amostras contam-se pelos intervalos de tempo que o
 * próprio perfil traz (`timeDeltas`), e não pelo número de amostras.
 *
 * Os caminhos saem relativos à raiz do sítio, ou com a marca <node_modules>
 * ou <node>, para nenhum caminho da máquina ir para um ficheiro.
 *
 * Uso: node perfil.mjs <ficheiro.cpuprofile> [--top N] [--json <saida>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const args = process.argv.slice(2);
const ficheiro = args[0];
const top = Number(args.includes('--top') ? args[args.indexOf('--top') + 1] : 30);
const saida = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const perfil = JSON.parse(fs.readFileSync(ficheiro, 'utf8'));

/** @param {string} url */
function onde(url) {
  if (!url) return '<v8>';
  let p = url.startsWith('file://') ? fileURLToPath(url) : url;
  if (p.startsWith('node:')) return '<node>';
  const nm = p.indexOf(`${path.sep}node_modules${path.sep}`);
  if (nm >= 0) return `<node_modules>/${p.slice(nm + 14).split(path.sep).slice(0, 2).join('/')}`;
  if (p.startsWith(RAIZ)) return path.relative(RAIZ, p);
  return p.includes('/') ? '<fora>' : p;
}

const nos = new Map(perfil.nodes.map((n) => [n.id, n]));
const pai = new Map();
for (const n of perfil.nodes) for (const f of n.children ?? []) pai.set(f, n.id);
/* O tempo de cada amostra é o delta até à amostra seguinte. */
const tempoProprio = new Map();
const { samples, timeDeltas } = perfil;
for (let i = 0; i < samples.length; i++) {
  const dt = (timeDeltas[i + 1] ?? 0) / 1000; /* ms */
  tempoProprio.set(samples[i], (tempoProprio.get(samples[i]) ?? 0) + dt);
}
const total = [...tempoProprio.values()].reduce((a, b) => a + b, 0);
const chave = (n) => `${n.callFrame.functionName || '(anónima)'} · ${onde(n.callFrame.url)}:${n.callFrame.lineNumber + 1}`;
const proprio = new Map();
const inclusivo = new Map();
const porFicheiro = new Map();
for (const [id, t] of tempoProprio) {
  const n = nos.get(id);
  const k = chave(n);
  proprio.set(k, (proprio.get(k) ?? 0) + t);
  const f = onde(n.callFrame.url);
  porFicheiro.set(f, (porFicheiro.get(f) ?? 0) + t);
  /* O inclusivo: cada antepassado conta uma vez por amostra, mesmo em recursão. */
  const vistos = new Set();
  let cur = id;
  while (cur !== undefined) {
    const kk = chave(nos.get(cur));
    if (!vistos.has(kk)) {
      inclusivo.set(kk, (inclusivo.get(kk) ?? 0) + t);
      vistos.add(kk);
    }
    cur = pai.get(cur);
  }
}
const ordena = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]);
const linha = ([k, t]) => `${(t / 1000).toFixed(2).padStart(9)} s ${((100 * t) / total).toFixed(1).padStart(5)} %  ${k}`;
console.log(`total amostrado: ${(total / 1000).toFixed(1)} s em ${samples.length} amostras`);
console.log('\nPOR FICHEIRO (tempo próprio)');
for (const l of ordena(porFicheiro).slice(0, top)) console.log(linha(l));
console.log('\nPOR FUNÇÃO (tempo próprio)');
for (const l of ordena(proprio).slice(0, top)) console.log(linha(l));
console.log('\nPOR FUNÇÃO (tempo inclusivo, só funções do sítio)');
for (const l of ordena(inclusivo).filter(([k]) => /· (src|scripts|astro\.config)/.test(k)).slice(0, top)) console.log(linha(l));
if (saida) {
  fs.writeFileSync(saida, JSON.stringify({
    total_ms: total,
    amostras: samples.length,
    por_ficheiro: ordena(porFicheiro).slice(0, 60),
    proprio: ordena(proprio).slice(0, 60),
    inclusivo_do_sitio: ordena(inclusivo).filter(([k]) => /· (src|scripts|astro\.config)/.test(k)).slice(0, 80),
  }, null, 1) + '\n');
}
