#!/usr/bin/env node
/** Os tempos reais de cada processo, sem inferir durações das linhas do registo.
 * M-A: cada processo escreve um ficheiro próprio, para as escritas paralelas não
 * se perderem. O fecho reúne-os em tempos.json. O ambiente passa inteiro.
 * Uso: node scripts/leituras/tempos.mjs medir <nome> <comando> [argumentos...]
 *      node scripts/leituras/tempos.mjs fechar <pasta>
 * OEDP_TEMPOS_DIR aponta para a pasta de saída; sem ela o observador é inerte.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function inicioDoPasso(passo, cadeia = process.env.OEDP_CADEIA ?? '') {
  return { passo, cadeia, inicio: new Date().toISOString(), relogio: performance.now() };
}
export function fimDoPasso(inicio, codigo, pasta = process.env.OEDP_TEMPOS_DIR) {
  if (!pasta) return;
  const { relogio, ...campos } = inicio;
  const registo = { ...campos, fim: new Date().toISOString(), segundos: (performance.now() - relogio) / 1000, codigo };
  const dir = path.join(pasta, '.tempos');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${crypto.randomUUID()}.json`), JSON.stringify(registo) + '\n');
}
export function fechar(pasta) {
  const dir = path.join(pasta, '.tempos');
  const passos = fs.existsSync(dir) ? fs.readdirSync(dir).map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) : [];
  passos.sort((a, b) => a.inicio.localeCompare(b.inicio));
  const cabeca = fs.existsSync(path.join(pasta, 'cabeca')) ? fs.readFileSync(path.join(pasta, 'cabeca'), 'utf8').trim() : null;
  const inicio = passos.reduce((a, p) => Math.min(a, Date.parse(p.inicio)), Infinity);
  const fim = passos.reduce((a, p) => Math.max(a, Date.parse(p.fim)), -Infinity);
  const r = { cabeca, inicio: Number.isFinite(inicio) ? new Date(inicio).toISOString() : null, fim: Number.isFinite(fim) ? new Date(fim).toISOString() : null, segundos: passos.length ? (fim - inicio) / 1000 : null, passos };
  fs.writeFileSync(path.join(pasta, 'tempos.json'), JSON.stringify(r, null, 2) + '\n');
  return r;
}
if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const [modo, nome, comando, ...args] = process.argv.slice(2);
  if (modo === 'fechar') fechar(nome);
  else if (modo === 'medir') {
    const inicio = inicioDoPasso(nome);
    const filho = spawn(comando, args, { stdio: 'inherit', env: process.env });
    for (const sinal of ['SIGINT', 'SIGTERM']) process.on(sinal, () => filho.kill(sinal));
    filho.on('error', e => { console.error(e.message); });
    filho.on('close', (codigo, sinal) => {
      const estado = codigo ?? (sinal === 'SIGINT' ? 130 : sinal === 'SIGTERM' ? 143 : 127);
      fimDoPasso(inicio, estado);
      process.exitCode = estado;
    });
  } else throw new Error('tempos: use medir ou fechar');
}
