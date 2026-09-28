#!/usr/bin/env node
/**
 * O CRONÓMETRO DO BLOCO CI1 (28.09.2026). Corre um comando na raiz do sítio,
 * põe a hora e os segundos decorridos em cada linha da saída, e escreve três
 * ficheiros com o mesmo prefixo:
 *
 *   <prefixo>.log     a saída, linha a linha, com a hora; os caminhos da
 *                     máquina e o nome do utilizador trocados por marcas
 *                     (<raiz>, <casa>, <tmp>, <utilizador>);
 *   <prefixo>.codigo  o código de saída, escrito DEPOIS de o processo acabar,
 *                     num ficheiro acabado de escrever (nunca lido atrás de um |);
 *   <prefixo>.json    o início, o fim, os segundos e o código, e cada passo que
 *                     o npm anuncia («> pacote@versão passo»), com os seus
 *                     segundos; a construção do Astro, que não é um guião do
 *                     npm, lê-se das marcas que o próprio Astro escreve.
 *
 * Diz também as condições da máquina: o processador, os núcleos, e os
 * processos de construção ou de conferência que corriam ao começar (lidos com
 * `ps`), porque um tempo medido com outra construção ao lado não é o mesmo
 * tempo.
 *
 * Uso: node cronometro.mjs <prefixo> -- <comando...>
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const i = process.argv.indexOf('--');
if (i < 3 || i === process.argv.length - 1) {
  console.error('uso: node cronometro.mjs <prefixo> -- <comando...>');
  process.exit(2);
}
const prefixo = path.resolve(process.argv[2]);
const comando = process.argv.slice(i + 1).join(' ');

const trocas = [];
for (const [de, para] of [
  [RAIZ, '<raiz>'],
  [fs.realpathSync(RAIZ), '<raiz>'],
  [os.tmpdir(), '<tmp>'],
  [fs.realpathSync(os.tmpdir()), '<tmp>'],
  ['/private/tmp', '<tmp>'],
  [os.homedir(), '<casa>'],
  [os.userInfo().username, '<utilizador>'],
]) {
  if (de && !trocas.some(([d]) => d === de)) trocas.push([de, para]);
}
/* Os caminhos mais compridos primeiro, para a raiz não ser comida pela casa. */
trocas.sort((a, b) => b[0].length - a[0].length);
/** @param {string} s */
const limpa = (s) => {
  let r = s.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
  for (const [de, para] of trocas) r = r.split(de).join(para);
  /* O rascunho de uma sessão vive numa pasta temporária cujo nome achata o
     caminho do projeto e traz o número do utilizador: sai inteiro. */
  return r
    .replace(/<tmp>\/claude-\d+\/[^/\s"']+\/[^/\s"']+\/scratchpad/g, '<rascunho>')
    /* Um caminho debaixo da casa (o de outro projeto ou de outra árvore, num
       processo vizinho) fica só com o último componente. */
    .replace(/<casa>\/[^\s"']+/g, (m) => `<casa>/…/${m.replace(/\/+$/, '').split('/').pop()}`);
};

/** Os processos de construção ou de conferência que já corriam, sem este. */
function vizinhos() {
  let ps = '';
  try {
    ps = execFileSync('ps', ['-Ao', 'pid,pcpu,command'], { encoding: 'utf8' });
  } catch (e) {
    return { lido: false, razao: String(e) };
  }
  const meus = new Set([String(process.pid), String(process.ppid)]);
  const padrao = /astro(\.mjs)? build|npm run (build|verify)|node (tests|scripts)\/|headless_shell|chrome-headless/;
  const achados = ps
    .split('\n')
    .slice(1)
    .map((l) => l.trim())
    .filter((l) => l && padrao.test(l) && !meus.has(l.split(/\s+/)[0]) && !l.includes('cronometro.mjs') && !/\bgrep\b|pgrep/.test(l))
    .map((l) => limpa(l).slice(0, 200));
  return { lido: true, processos: achados };
}

const maquina = {
  processador: os.cpus()[0]?.model ?? null,
  nucleos: os.availableParallelism?.() ?? os.cpus().length,
  memoria_gib: Math.round(os.totalmem() / 2 ** 30),
  sistema: `${os.type()} ${os.release()}`,
  node: process.version,
};
const antes = vizinhos();

fs.mkdirSync(path.dirname(prefixo), { recursive: true });
const log = fs.openSync(`${prefixo}.log`, 'w');
const t0 = Date.now();
const inicio = new Date(t0).toISOString();
/** @type {{t: number, linha: string}[]} */
const linhas = [];
const resto = { stdout: '', stderr: '' };
/** @param {'stdout'|'stderr'} canal @param {string} pedaco @param {boolean} fim */
function escreve(canal, pedaco, fim = false) {
  resto[canal] += pedaco;
  const partes = resto[canal].split('\n');
  resto[canal] = fim ? '' : partes.pop() ?? '';
  const agora = Date.now();
  for (const p of partes) {
    if (fim && p === '') continue;
    const linha = limpa(p);
    linhas.push({ t: agora, linha });
    fs.writeSync(log, `${new Date(agora).toISOString()} +${((agora - t0) / 1000).toFixed(3)}s ${canal === 'stderr' ? '!' : ' '} ${linha}\n`);
  }
}

const filho = spawn('sh', ['-c', comando], { cwd: RAIZ, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } });
filho.stdout.setEncoding('utf8');
filho.stderr.setEncoding('utf8');
filho.stdout.on('data', (d) => escreve('stdout', d));
filho.stderr.on('data', (d) => escreve('stderr', d));
const codigo = await new Promise((resolve) => {
  filho.on('close', (c, sinal) => resolve(c ?? (sinal ? 128 : 1)));
});
escreve('stdout', '', true);
escreve('stderr', '', true);
const t1 = Date.now();
fs.closeSync(log);

/* Os passos: cada «> pacote@versão nome» abre um passo e fecha o anterior. */
const passos = [];
for (const { t, linha } of linhas) {
  const m = /^> [^@\s]+@\S+ (\S+)/.exec(linha);
  if (m) {
    if (passos.length) passos[passos.length - 1].fim = t;
    passos.push({ nome: m[1], inicio: t, fim: t });
  }
}
if (passos.length) passos[passos.length - 1].fim = t1;
/* A construção do Astro: da primeira marca do Astro ao «Complete!». */
const primeiraAstro = linhas.find((l) => /^\d\d:\d\d:\d\d \[(types|build|content|vite)\]/.test(l.linha));
const fimAstro = linhas.find((l) => /\[build\] Complete!/.test(l.linha));
const astro = primeiraAstro && fimAstro
  ? { inicio: new Date(primeiraAstro.t).toISOString(), fim: new Date(fimAstro.t).toISOString(), segundos: (fimAstro.t - primeiraAstro.t) / 1000 }
  : null;
const paginas = linhas.map((l) => /\[build\] (\d+) page\(s\) built in/.exec(l.linha)).find(Boolean);

const resumo = {
  comando: limpa(comando),
  inicio,
  fim: new Date(t1).toISOString(),
  segundos: (t1 - t0) / 1000,
  codigo,
  maquina,
  vizinhos_ao_comecar: antes,
  vizinhos_ao_acabar: vizinhos(),
  astro_build: astro,
  paginas_do_astro: paginas ? Number(paginas[1]) : null,
  passos: passos.map((p) => ({
    nome: p.nome,
    inicio: new Date(p.inicio).toISOString(),
    segundos: (p.fim - p.inicio) / 1000,
  })),
};
fs.writeFileSync(`${prefixo}.json`, JSON.stringify(resumo, null, 1) + '\n');
fs.writeFileSync(`${prefixo}.codigo`, `${codigo}\n`);
console.log(`${limpa(comando)} · código ${codigo} · ${resumo.segundos.toFixed(1)} s · ${prefixo}.log`);
process.exit(0);
