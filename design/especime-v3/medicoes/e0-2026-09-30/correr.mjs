/** Guarda uma corrida, com código lido de ficheiro e sem dados da máquina. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execFileSync } from 'node:child_process';
import { lerEstadoDaArvore } from './estado-da-arvore.mjs';
const [alvo, comando, ...args] = process.argv.slice(2);
if (!alvo || !comando) throw new Error('Uso: correr.mjs destino comando argumentos');
fs.mkdirSync(path.dirname(alvo), { recursive: true });
for (const extensao of ['codigo', 'cabeca', 'json']) fs.rmSync(`${alvo}.${extensao}`, { force: true });
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const { pendentes, codigoPorRegistar } = lerEstadoDaArvore(execFileSync('git',
  ['status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8' }));
const inicio = new Date().toISOString();
const t = performance.now();
const limpar = s => s.replaceAll(process.cwd(), '[repositorio]').replaceAll(os.homedir(), '[pasta-pessoal]')
  .replaceAll(os.userInfo().username, '[utilizador]').replace(/\u001b\[[0-9;]*m/g, '')
  .split('\n').map(l => l.trimEnd()).join('\n').trimEnd() + '\n';
const env = { ...process.env, NO_COLOR: '1' };
delete env.FORCE_COLOR;
fs.writeFileSync(`${alvo}.log`, '');
const p = spawn(comando, args, { env, stdio: ['ignore', 'pipe', 'pipe'] });
let saida = '';
for (const s of [p.stdout, p.stderr]) s.on('data', b => { saida += b.toString(); });
p.on('error', e => { saida += e.message; });
const codigo = await new Promise(r => p.on('close', c => r(c ?? 1)));
const segundos = (performance.now() - t) / 1000;
fs.writeFileSync(`${alvo}.log`, limpar(saida));
fs.writeFileSync(`${alvo}.codigo`, `${codigo}\n`);
fs.writeFileSync(`${alvo}.cabeca`, `${cabeca}\n`);
fs.writeFileSync(`${alvo}.json`, JSON.stringify({ comando: [comando, ...args].join(' '), cabeca,
  arvore_por_registar: pendentes.length > 0, codigo_por_registar: codigoPorRegistar,
  inicio, fim: new Date().toISOString(), segundos, codigo }, null, 2) + '\n');
console.log(`${alvo}: código ${fs.readFileSync(`${alvo}.codigo`, 'utf8').trim()}, ${segundos.toFixed(1)} s, cabeça ${cabeca}`);
if (codigo) console.log(limpar(saida).slice(-8000));
process.exitCode = codigo;
