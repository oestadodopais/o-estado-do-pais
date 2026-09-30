/** Corre uma conferência e guarda código, cabeça, duração e saída sem dados da máquina. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execFileSync } from 'node:child_process';
const [alvo, comando, ...args] = process.argv.slice(2);
if (!alvo || !comando) throw new Error('Uso: correr.mjs destino comando argumentos');
fs.mkdirSync(path.dirname(alvo), { recursive: true });
for (const extensao of ['codigo', 'cabeca', 'json']) fs.rmSync(`${alvo}.${extensao}`, { force: true });
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const pendentes = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8' }).trimEnd().split('\n').filter(Boolean);
const arvorePorRegistar = pendentes.length > 0;
const codigoPorRegistar = pendentes.some((l) => /\.(?:mjs|py|js|astro|ts|css)$/.test(l.slice(3)) || (!l.slice(3).startsWith('design/especime-v3/medicoes/n1-2026-09-30/') && !l.slice(3).startsWith('design/especime-v3/capturas/n1-2026-09-30/')));
const estadoDaArvore = arvorePorRegistar ? 'árvore por registar' : 'árvore limpa';
const inicio = new Date().toISOString();
const t = performance.now();
const limpar = (s) => s.replaceAll(process.cwd(), '[repositorio]').replaceAll(os.homedir(), '[pasta-pessoal]').replaceAll(os.userInfo().username, '[utilizador]').replace(/\u001b\[[0-9;]*m/g, '').split('\n').map((l) => l.trimEnd()).join('\n').trimEnd() + '\n';
fs.writeFileSync(`${alvo}.log`, '');
const p = spawn(comando, args, { env: { ...process.env, NO_COLOR: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
let saida = '';
for (const s of [p.stdout, p.stderr]) s.on('data', (b) => { saida += b.toString(); });
p.on('error', (e) => { saida += e.message; });
const codigo = await new Promise((r) => p.on('close', (c) => r(c ?? 1)));
const segundos = (performance.now() - t) / 1000;
/* Alguns medidores antigos escrevem a raiz em --json. O comprovativo do N1
   conserva os dados, mas passa pela mesma limpeza que a saída do comando. */
const indiceJson = args.indexOf('--json');
const jsonDoBloco = indiceJson >= 0 ? args[indiceJson + 1] : null;
if (jsonDoBloco?.startsWith('design/especime-v3/medicoes/n1-2026-09-30/') && fs.existsSync(jsonDoBloco)) {
  fs.writeFileSync(jsonDoBloco, limpar(fs.readFileSync(jsonDoBloco, 'utf8')));
}
fs.writeFileSync(`${alvo}.log`, limpar(saida));
fs.writeFileSync(`${alvo}.codigo`, `${codigo}\n`);
fs.writeFileSync(`${alvo}.cabeca`, `${cabeca}\n`);
fs.writeFileSync(`${alvo}.json`, JSON.stringify({ comando: [comando, ...args].join(' '), cabeca, estado_da_arvore: estadoDaArvore, arvore_por_registar: arvorePorRegistar, codigo_por_registar: codigoPorRegistar, inicio, fim: new Date().toISOString(), segundos, codigo }, null, 2) + '\n');
console.log(`${alvo}: código ${codigo}, ${segundos.toFixed(1)} s, cabeça ${cabeca}, ${estadoDaArvore}`);
if (codigo) console.log(limpar(saida).slice(-10000));
process.exitCode = Number(codigo);
