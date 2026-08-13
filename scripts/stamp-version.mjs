/**
 * Carimba em `dist/version.json` o commit de que esta construção saiu.
 *
 * Porquê: os portões todos correm sobre `dist/`, antes de publicar. Nenhum deles
 * vê o que está no ar. O sítio publicado pode discordar do repositório e nada o
 * diz — aconteceu duas vezes a 2026-08-13, e das duas foi uma pessoa a reparar,
 * uma delas depois de uma auditoria inteira feita contra um sítio quatro commits
 * atrasado. Este ficheiro é a metade do sítio dessa conferência;
 * `scripts/verify-deploy.mjs` é a outra.
 *
 * Não é uma afirmação do livro-razão: é metadado de construção, e por isso vai
 * para JSON e não para uma página. O portão de HTML varre `dist/**\/*.html` — um
 * SHA em JSON não lhe passa pela frente, e não precisa de dispensa nenhuma.
 *
 * NUNCA inventar o commit. Se nem o Vercel nem o git o souberem dizer, escreve-se
 * `commit: null` com a razão à vista, e quem confere trata isso como falha. Um
 * carimbo que adivinha é pior do que carimbo nenhum: faz passar a conferência que
 * existe precisamente para não passar.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const OUT = path.join(process.cwd(), 'dist', 'version.json');

function doGit(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

/* No Vercel o SHA vem do ambiente — VERCEL_GIT_COMMIT_SHA, confirmado na
   documentação (disponível em build e em runtime). Vem a null se as variáveis de
   sistema não estiverem ligadas nas definições do projecto, e nesse caso o
   directório .git também não existe na construção: daí o motivo explícito. */
const doVercel = process.env.VERCEL_GIT_COMMIT_SHA || null;
const commit = doVercel || doGit(['rev-parse', 'HEAD']);

const origem = doVercel ? 'vercel' : commit ? 'git' : null;
const motivo = commit
  ? null
  : process.env.VERCEL
    ? 'construído no Vercel sem VERCEL_GIT_COMMIT_SHA: as variáveis de sistema estão desligadas nas definições do projecto.'
    : 'sem VERCEL_GIT_COMMIT_SHA e sem repositório git legível a partir daqui.';

const stamp = {
  commit,
  ref: process.env.VERCEL_GIT_COMMIT_REF || doGit(['rev-parse', '--abbrev-ref', 'HEAD']) || null,
  env: process.env.VERCEL_ENV || 'local',
  origem,
  motivo,
  construido_em: new Date().toISOString(),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(stamp, null, 2) + '\n', 'utf8');

const cinza = (s) => `\x1b[90m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
console.log();
if (commit) {
  console.log(cinza(`  versão · ${commit.slice(0, 7)} (${stamp.ref ?? 'ref desconhecida'}, ${stamp.origem})`));
} else {
  /* Não falha a construção: falhar aqui derrubava o deploy por uma caixa por
     ticar nas definições. Falha em quem confere, que é onde importa. */
  console.log(amarelo(`  versão · sem commit — ${motivo}`));
  console.log(cinza('    A conferência do que está no ar vai falhar, e é para falhar.'));
}
