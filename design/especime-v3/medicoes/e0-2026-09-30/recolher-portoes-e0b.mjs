/** Lê os ficheiros produzidos por portoes.sh e limpa os dados locais dos registos. */
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { lerCodigoDaCorrida } from './detetores-e0b.mjs';
import { lerEstadoDaArvore } from './estado-da-arvore.mjs';
const passagem = process.argv[2] ?? 'e0b';
if (!['e0b', 'e0c'].includes(passagem)) throw new Error('Passagem desconhecida.');
const pasta = `design/especime-v3/medicoes/e0-2026-09-30/portoes/${passagem}`;
const cabeca = fs.readFileSync(`${pasta}/cabeca`, 'utf8').trim();
const cabecaFim = fs.readFileSync(`${pasta}/cabeca.fim`, 'utf8').trim();
const corridaInicio = fs.statSync(`${pasta}/cabeca`).mtimeMs;
const { codigoPorRegistar } = lerEstadoDaArvore(execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8' }));
const cabecaAtual = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const limpar = s => s.replaceAll(process.cwd(), '[repositorio]').replaceAll(os.homedir(), '[pasta-pessoal]')
  .replaceAll(os.userInfo().username, '[utilizador]').replace(/\u001b\[[0-9;]*m/g, '').split('\n').map(l => l.trimEnd()).join('\n').trimEnd() + '\n';
for (const nome of ['build', 'verify', 'typecheck']) {
  const p = `${pasta}/${nome}`;
  const inicio = fs.readFileSync(`${p}.inicio`, 'utf8').trim();
  const fim = fs.readFileSync(`${p}.fim`, 'utf8').trim();
  const limites = { inicio: fs.statSync(`${p}.inicio`).mtimeMs, fim: fs.statSync(`${p}.fim`).mtimeMs };
  const lido = lerCodigoDaCorrida(`${p}.codigo`, limites.inicio, limites.fim);
  const atual = lido.medido && limites.inicio >= corridaInicio && cabeca === cabecaFim && cabecaAtual === cabeca;
  fs.writeFileSync(`${p}.log`, limpar(fs.readFileSync(`${p}.log`, 'utf8')));
  fs.writeFileSync(`${p}.json`, JSON.stringify({ comando: `npm run ${nome}`, cabeca, cabeca_fim: cabecaFim, inicio, fim,
    segundos: (Date.parse(fim) - Date.parse(inicio)) / 1000, codigo: lido.codigo, medido_nesta_corrida: atual,
    codigo_por_registar: codigoPorRegistar, limites_da_escrita: limites }, null, 2) + '\n');
  console.log(`${nome}: código lido ${lido.codigo}, escrito nesta corrida: ${atual}, cabeça ${cabeca}`);
  if (!atual || codigoPorRegistar || lido.codigo !== 0) process.exitCode = 1;
}
for (const f of ['estado.fim']) fs.writeFileSync(`${pasta}/${f}`, limpar(fs.readFileSync(`${pasta}/${f}`, 'utf8')));
