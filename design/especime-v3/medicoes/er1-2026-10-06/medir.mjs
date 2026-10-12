/* Medições do ER1. Os registos publicados só têm caminhos relativos. */
import fs from 'node:fs';
import os from 'node:os';
import { spawnSync, execFileSync } from 'node:child_process';
import { allClaims } from '../../../../src/lib/ledger.mjs';
const pasta = 'design/especime-v3/medicoes/er1-2026-10-06';
export function limpar(texto) {
  return texto.replaceAll(process.cwd(), '<worktree>').replaceAll(os.homedir(), '<casa>')
    .replaceAll(os.userInfo().username, '<utilizador>');
}
export function escrever(nome, dados) {
  fs.writeFileSync(`${pasta}/${nome}.json`, limpar(JSON.stringify(dados, null, 2)) + '\n');
}
const [modo, ...args] = process.argv.slice(2);
if (modo === 'antes') {
  const linhas = allClaims();
  escrever('antes', {
    comando: 'node design/especime-v3/medicoes/er1-2026-10-06/medir.mjs antes',
    cabeca: execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim(),
    linhas: linhas.length,
    verificacoesSemConfirmacao: linhas.filter(c => c.verifications?.some(v => v.result !== 'igual')).map(c => ({id:c.id, verificacoes:c.verifications})),
    ausencias: Object.fromEntries(['access_date','reference_date','source','unit'].map(k => [k, linhas.filter(c => !c[k]).length])),
    cabecalhos: JSON.parse(fs.readFileSync('vercel.json', 'utf8')).routes.filter(r => r.headers),
  });
} else if (modo === 'correr') {
  const [nome, cmd, ...argv] = args;
  const inicio = new Date();
  const r = spawnSync(cmd, argv, {encoding:'utf8', maxBuffer:128*1024*1024});
  fs.writeFileSync(`${pasta}/${nome}.log`, limpar((r.stdout ?? '') + (r.stderr ?? '')));
  fs.writeFileSync(`${pasta}/${nome}.codigo`, String(r.status) + '\n');
  escrever('corrida-'+nome, {comando:[cmd,...argv].join(' '), inicio, fim:new Date(), codigo:r.status, sinal:r.signal});
  console.log(`${nome}: ${r.status}`);
  process.exitCode = r.status ?? 1;
}
