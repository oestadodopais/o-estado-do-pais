#!/usr/bin/env node
/**
 * Portão (b): o livro-razão está completo e a aritmética bate certo.
 *
 * Corre ANTES do astro build. Se falhar, não se constrói nada.
 */

import { validateLedger, allClaims, POR_VERIFICAR } from '../src/lib/ledger.mjs';

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

let resultado;
try {
  resultado = validateLedger();
} catch (err) {
  console.error(vermelho('\n  LIVRO-RAZÃO — ERRO AO CARREGAR\n'));
  console.error('  ' + err.message + '\n');
  process.exit(1);
}

const { errors, warnings, stats } = resultado;

console.log('');
console.log(cinza('  livro-razão · ' + stats.total + ' afirmações'));

if (warnings.length) {
  console.log('');
  console.log(amarelo(`  ${warnings.length} aviso(s):`));
  for (const w of warnings) console.log('    ' + amarelo('·') + ' ' + w);
}

if (errors.length) {
  console.log('');
  console.error(vermelho(`  O LIVRO-RAZÃO NÃO PASSA — ${errors.length} erro(s):`));
  console.error('');
  for (const e of errors) console.error('    ' + vermelho('✗') + ' ' + e);
  console.error('');
  console.error('  Nada é construído enquanto isto não estiver resolvido.');
  console.error(
    `  Um campo que não se conhece escreve-se "${POR_VERIFICAR}". Nunca se inventa um valor plausível.`,
  );
  console.error('');
  process.exit(1);
}

// Dívida de proveniência: não bloqueia, mas fica à vista.
const porVerificar = [];
for (const c of allClaims()) {
  const campos = [];
  for (const campo of ['source', 'source_url', 'access_date', 'reference_date', 'excerpt']) {
    if (c[campo] === POR_VERIFICAR) campos.push(campo);
  }
  if (c.document && typeof c.document === 'object') {
    if (c.document.title === POR_VERIFICAR) campos.push('document.title');
    if (c.document.edition === POR_VERIFICAR) campos.push('document.edition');
  }
  if (campos.length) porVerificar.push({ id: c.id, campos });
}

console.log('');
console.log(
  '  ' +
    verde('✓') +
    ` ${stats.total} afirmações válidas · ${stats.derivadas} derivadas · ${stats.verificadas} com aritmética reavaliada no build`,
);

if (porVerificar.length) {
  console.log('');
  console.log(amarelo(`  Dívida de proveniência: ${porVerificar.length} afirmação(ões) com campos "${POR_VERIFICAR}"`));
  for (const p of porVerificar) {
    console.log(cinza(`    ${p.id} → ${p.campos.join(', ')}`));
  }
  console.log(
    cinza(
      '    Isto não impede o build. Impede que se diga que o livro-razão está fechado.',
    ),
  );
}
console.log('');
