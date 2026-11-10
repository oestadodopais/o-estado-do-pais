#!/usr/bin/env node
// VEL1: só uma corrida verde do mesmo fluxo, cabeça e repositório pode pagar main.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export function corridaQueDispensa(resposta, cabeca, repositorio) {
  const paginas = Array.isArray(resposta) ? resposta : [resposta];
  if (!paginas.every(p => p && Array.isArray(p.workflow_runs))) return null;
  const corridas = paginas.flatMap(p => p.workflow_runs);
  return corridas.find(r => r && r.name === 'portão' && r.path === '.github/workflows/portao.yml'
    && r.event === 'push' && r.head_sha === cabeca
    && typeof r.head_branch === 'string' && r.head_branch.length > 0 && r.head_branch !== 'main'
    && r.status === 'completed' && r.conclusion === 'success'
    && r.repository?.full_name === repositorio && r.head_repository?.full_name === repositorio
    && Number.isSafeInteger(r.id) && r.id > 0
    && r.html_url === `https://github.com/${repositorio}/actions/runs/${r.id}`) ?? null;
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const [ficheiro, cabeca, repositorio, saida] = process.argv.slice(2);
  if (!ficheiro || !/^[a-f0-9]{40}$/.test(cabeca ?? '') || !/^[\w.-]+\/[\w.-]+$/.test(repositorio ?? ''))
    throw new Error('use portao-dispensa.mjs <resposta.json> <commit> <dono/repositorio> [github-output]');
  let corrida = null;
  try {
    corrida = corridaQueDispensa(JSON.parse(fs.readFileSync(ficheiro, 'utf8')), cabeca, repositorio);
  } catch {
    // Sem uma resposta legível não há prova que dispense a corrida inteira.
  }
  const decisao = corrida ? 'sim' : 'nao';
  console.log(decisao);
  if (saida) fs.appendFileSync(saida, `dispensar=${decisao}\nurl=${corrida?.html_url ?? ''}\n`);
}
