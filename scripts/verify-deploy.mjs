/**
 * Confere o que está NO AR contra o que está no repositório.
 *
 * É a única conferência do projecto que não corre sobre `dist/`. Todas as outras
 * provam coisas sobre a construção; esta pergunta se a construção que está
 * publicada é a que se julga estar. As duas falhas de 2026-08-13 eram as duas
 * desta forma — `main` à frente de `origin/main`, o sítio a servir código velho,
 * e ninguém a saber até alguém ir ver à mão.
 *
 * Três coisas têm de coincidir:
 *
 *   no ar  ==  origin/main      o publicado é o que foi empurrado
 *   main   ==  origin/main      não há trabalho por empurrar
 *
 * Sai com código != 0 em qualquer divergência, para servir de portão de
 * lançamento. Um `version.json` sem commit é FALHA, não é desculpa: o sítio não
 * consegue dizer de onde veio, e isso é exactamente o que esta conferência
 * existe para não deixar passar.
 *
 * A SEGUNDA PERGUNTA COMPARAVA `HEAD` E DIZIA «main» (v2, DECISIONS §1.43). De
 * um ramo de trabalho, `HEAD` nunca é `origin/main`, e a conferência anunciava
 * que «o "main" local está N commits à frente» quando `main` estava exactamente
 * onde devia: a mensagem nomeava um ramo e media outro. Passa a ler o ramo que
 * o `--ref` nomeia, e um `main` local que não exista é falha e não silêncio.
 * `HEAD` continua impresso, porque saber onde se está é útil; o que ele já não
 * faz é decidir.
 *
 * Uso:  node scripts/verify-deploy.mjs [--host <dominio>] [--ref <git-ref>]
 *                                      [--branch <ramo-local>]
 */
import { execFileSync } from 'node:child_process';
import { SITE_HOST } from '../site.config.mjs';

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;

const argv = process.argv.slice(2);
const arg = (nome, fallback) => {
  const i = argv.indexOf(nome);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const host = arg('--host', SITE_HOST);
const ref = arg('--ref', 'origin/main');
/* O ramo LOCAL que a segunda pergunta compara. Por defeito é o que o `--ref`
   nomeia («origin/main» → «main»): é esse que se empurra, e não onde se está a
   trabalhar. `--branch` existe para se poder provar esta conferência contra um
   ramo descartável, sem escrever um commit no `main`. */
const ramoLocal = arg('--branch', ref.replace(/^[^/]+\//, ''));

const erros = [];

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

/* Sem fetch não se está a comparar com o remoto: está-se a comparar com a última
   vez que alguém falou com ele. Falhar aqui é preferível a passar por engano. */
try {
  execFileSync('git', ['fetch', '--quiet', 'origin'], { stdio: 'ignore' });
} catch {
  erros.push(`não foi possível fazer "git fetch origin" — a comparação com ${ref} seria contra uma cópia velha.`);
}

const esperado = git(['rev-parse', ref]);
const cabeca = git(['rev-parse', 'HEAD']);
/* `refs/heads/<ramo>` e não `<ramo>`: um nome solto podia resolver-se contra uma
   etiqueta ou contra o remoto, e a pergunta é sobre o ramo local. */
const local = git(['rev-parse', `refs/heads/${ramoLocal}`]);
if (!esperado) erros.push(`"git rev-parse ${ref}" não devolveu nada.`);
if (!local) {
  erros.push(
    `não existe um ramo local "${ramoLocal}" para comparar com ${ref}.\n` +
      `      A pergunta é se há trabalho por empurrar, e sem o ramo não há resposta: ` +
      `um silêncio aqui é o que deixou o sítio para trás a 2026-08-13.`,
  );
}

/* A CDN serve o ficheiro tal como estava; sem isto podia responder-se a esta
   pergunta com uma resposta anterior à pergunta. */
let publicado = null;
let stamp = null;
const url = `https://${host}/version.json?t=${Date.now()}`;
try {
  const res = await fetch(url, { headers: { 'cache-control': 'no-cache', pragma: 'no-cache' } });
  if (!res.ok) {
    erros.push(`GET ${url} devolveu HTTP ${res.status}. O sítio no ar não publica version.json.`);
  } else {
    stamp = await res.json();
    publicado = stamp.commit ?? null;
    if (!publicado) {
      erros.push(
        `o sítio no ar publica version.json sem commit: ${stamp.motivo ?? 'sem motivo declarado'}`,
      );
    }
  }
} catch (e) {
  erros.push(`não foi possível ler ${url}: ${e.message}`);
}

console.log();
console.log(cinza(`  o que está no ar · ${host}`));
console.log(cinza(`    no ar        ${publicado ? publicado.slice(0, 7) : '·'}${stamp?.construido_em ? `  (${stamp.construido_em})` : ''}`));
console.log(cinza(`    ${ref.padEnd(12)} ${esperado ? esperado.slice(0, 7) : '·'}`));
console.log(cinza(`    ${ramoLocal.padEnd(12)} ${local ? local.slice(0, 7) : '·'}`));
console.log(cinza(`    HEAD         ${cabeca ? cabeca.slice(0, 7) : '·'}${cabeca && cabeca !== local ? '  (onde se está a trabalhar; não decide nada)' : ''}`));
console.log();

if (publicado && esperado && publicado !== esperado) {
  erros.push(
    `o sítio no ar está em ${publicado.slice(0, 7)} e ${ref} está em ${esperado.slice(0, 7)}.\n` +
      `      O que está publicado NÃO é o que está no repositório.`,
  );
}
if (local && esperado && local !== esperado) {
  const à_frente = git(['rev-list', '--count', `${esperado}..${local}`]);
  erros.push(
    `o "${ramoLocal}" local está ${à_frente ?? '?'} commit(s) à frente de ${ref}: há trabalho por empurrar.\n` +
      `      Foi assim que o sítio ficou para trás duas vezes a 2026-08-13.`,
  );
}

if (erros.length) {
  console.log(vermelho(`  NÃO CONFERE — ${erros.length} problema(s):`));
  for (const e of erros) console.log(vermelho(`    ✗ ${e}`));
  console.log();
  console.log(amarelo('  Nada se lança enquanto o que está no ar não for o que está no repositório.'));
  process.exit(1);
}

console.log(verde('  ✓ o que está no ar é o que está no repositório.'));
