#!/usr/bin/env node
/**
 * PARA QUEM VEM DE FORA CONFERIR: uma descarga nova contra o que está alojado.
 *
 * Descarregue o artefacto outra vez, guarde os bytes num ficheiro, e corra:
 *
 *   node scripts/verify-fetch.mjs <descarga.html> <slug> <lingua>
 *
 * O que faz: normaliza a descarga com a MESMA função que produziu o ficheiro
 * alojado, e compara o resumo em três sítios — a descarga nova, a linha do
 * manifesto, e os bytes que estão em disco. Imprime MATCH ou MISMATCH com os
 * resumos à vista, e sai com 0 ou 1.
 *
 * ---------------------------------------------------------------------------
 * LEIA ISTO ANTES DE INTERPRETAR UM MISMATCH
 * ---------------------------------------------------------------------------
 *
 * **`sha256_raw` DEVE divergir, e isso não é defeito nenhum.** O anfitrião
 * injecta no documento um runtime seu que muda sozinho, sem o autor tocar no
 * artefacto: entre 10 e 12 de Agosto de 2026 cresceu 2570 bytes em três
 * artefactos intocados. Uma descarga feita noutro dia traz outro runtime e,
 * portanto, outros bytes brutos. Este comando imprime a diferença mas **não
 * falha por ela**.
 *
 * **`sha256_normalized` NÃO deve divergir.** É o documento do autor, sem o
 * invólucro. Se divergir, uma de três coisas aconteceu, e vale a pena separá-las
 * antes de acusar seja quem for:
 *
 *   1. o autor publicou uma versão nova do artefacto — a mais provável, e a
 *      inocente. Compare `artifact_ver`, se a tiver, ou o texto do documento;
 *   2. o ficheiro alojado foi alterado no repositório — é o que
 *      `check:documentos` apanha a cada construção;
 *   3. a normalização está errada — o molde do invólucro mudou e alguém o
 *      reescreveu mal.
 *
 * Este comando diz **onde** os três valores deixam de coincidir, que é o que
 * separa os três casos: se a descarga nova bate certo com o disco mas não com o
 * manifesto, é o manifesto; se bate com o manifesto e não com o disco, é o
 * ficheiro; se a descarga nova sozinha diverge das outras duas, é o artefacto a
 * montante ou a normalização.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

import { measure, WrapperMismatch } from './normalize-study.mjs';
import { FICHEIRO_DA_EDICAO } from '../src/lib/documentos.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SRC = path.join(ROOT, 'studies-src');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const [descarga, slug, lang] = process.argv.slice(2);
if (!descarga || !slug || !lang) {
  console.error('uso: node scripts/verify-fetch.mjs <descarga.html> <slug> <lingua>');
  process.exit(2);
}

/* ------------------------------------------------------------- a descarga -- */

let bruto;
try {
  bruto = fs.readFileSync(descarga);
} catch (e) {
  console.error(vermelho(`\n  não foi possível ler "${descarga}": ${e.message}\n`));
  process.exit(1);
}

let m;
try {
  m = measure(bruto);
} catch (e) {
  console.error('');
  console.error(vermelho('  MISMATCH — a descarga não encaixa no invólucro conhecido.'));
  console.error('');
  console.error('  ' + e.message.split('\n').join('\n  '));
  console.error('');
  console.error(
    cinza(
      e instanceof WrapperMismatch
        ? '  Isto costuma querer dizer que o anfitrião mudou o invólucro. Ver o cabeçalho de\n' +
          '  scripts/normalize-study.mjs: o molde tem de ser derivado outra vez, dos bytes.'
        : '',
    ),
  );
  process.exit(1);
}

/* -------------------------------------------------------- o que está cá -- */

const manifesto = load(fs.readFileSync(path.join(SRC, 'manifest.yml'), 'utf8')) ?? {};
const linha = (manifesto.edicoes ?? []).find((e) => e.slug === slug && e.lang === lang);
if (!linha) {
  console.error(vermelho(`\n  MISMATCH — não há linha para "${slug}/${lang}" no manifesto.\n`));
  process.exit(1);
}

const ficheiro = path.join(SRC, slug, FICHEIRO_DA_EDICAO[lang] ?? `${lang}.html`);
if (!fs.existsSync(ficheiro)) {
  console.error(vermelho(`\n  MISMATCH — não existe ${path.relative(ROOT, ficheiro)}.\n`));
  process.exit(1);
}
const emDisco = crypto.createHash('sha256').update(fs.readFileSync(ficheiro)).digest('hex');

/* ------------------------------------------------------------- o veredito -- */

const igualManifesto = m.sha256_normalized === linha.sha256_normalized;
const igualDisco = m.sha256_normalized === emDisco;
const brutoIgual = m.sha256_raw === linha.sha256_raw;

const marca = (b) => (b ? verde('=') : vermelho('≠'));

console.log('');
console.log(`  ${slug} · ${lang}`);
console.log(cinza(`  descarga: ${descarga}`));
console.log('');
console.log('  sha256_normalized');
console.log(`    descarga nova   ${m.sha256_normalized}  (${m.bytes_normalized} bytes)`);
console.log(`    manifesto       ${linha.sha256_normalized}  ${marca(igualManifesto)}`);
console.log(`    ficheiro alojado ${emDisco}  ${marca(igualDisco)}`);
console.log('');
console.log('  sha256_raw ' + cinza('(informativo — não decide nada)'));
console.log(`    descarga nova   ${m.sha256_raw}  (${m.bytes_raw} bytes, runtime ${m.bytes_runtime})`);
console.log(`    manifesto       ${linha.sha256_raw}  ${brutoIgual ? cinza('=') : amarelo('≠')}`);
console.log('');

if (igualManifesto && igualDisco) {
  console.log('  ' + verde('MATCH') + ' — o documento alojado é o documento do artefacto.');
  if (!brutoIgual) {
    console.log(
      cinza(
        '  Os bytes brutos divergem, e é esperado: o anfitrião mudou o runtime que injecta,\n' +
          '  não o documento. É exactamente para isto que o resumo normalizado existe.',
      ),
    );
  }
  console.log('');
  process.exit(0);
}

console.log('  ' + vermelho('MISMATCH') + ' — o documento normalizado não é o que está registado.');
console.log('');
if (igualDisco && !igualManifesto) {
  console.log('  O ficheiro em disco e a descarga concordam, e o manifesto é que não.');
  console.log(cinza('  → a linha do manifesto está desactualizada ou errada.'));
} else if (igualManifesto && !igualDisco) {
  console.log('  O manifesto e a descarga concordam, e o ficheiro em disco é que não.');
  console.log(cinza('  → o ficheiro alojado foi alterado. É o que check:documentos apanha.'));
} else {
  console.log('  A descarga diverge do manifesto E do ficheiro, que concordam entre si.');
  console.log(
    cinza(
      '  → ou o autor publicou uma versão nova do artefacto (o caso provável, e inocente),\n' +
        '    ou a normalização mudou. Compare o texto do documento antes de concluir.',
    ),
  );
}
console.log('');
process.exit(1);
