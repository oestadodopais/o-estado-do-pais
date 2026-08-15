#!/usr/bin/env node
/**
 * Portão dos documentos alojados: o disco contra o manifesto.
 *
 * Corre ANTES do `astro build`, porque o que ele confere é a origem e não a
 * saída: se os bytes de `studies-src/<slug>/<lingua>.html` já não são os que
 * foram instalados, não vale a pena construir por cima deles.
 *
 * O QUE FALHA, e são três coisas, cada uma um engano diferente:
 *
 *   1. RESUMO DIFERENTE — o ficheiro em disco não é o que o manifesto declara.
 *      Alguém editou um documento alojado. É a falha que este portão existe
 *      para apanhar: a promessa da casa é que um documento vai byte a byte
 *      como foi publicado, e uma promessa sem verificação é uma intenção.
 *   2. FICHEIRO ÓRFÃO — está em disco e não está no manifesto. Um documento
 *      sem linha de proveniência não é um documento alojado, é um ficheiro.
 *   3. LINHA ÓRFÃ — está no manifesto e não está em disco. O registo passou a
 *      dizer uma coisa que o disco não confirma.
 *
 * O que NÃO é conferido, e é honesto dizê-lo: `sha256_raw`. Não é reproduzível
 * — o anfitrião de artefactos injecta um runtime que muda sozinho, e os mesmos
 * bytes de autor dão descargas diferentes em semanas diferentes. Esse campo é
 * o registo do que foi descarregado, com os bytes guardados ao lado em `_raw/`
 * para quem quiser confrontá-lo. O invariante é `sha256_normalized`, e é esse
 * que este portão confere. Ver scripts/normalize-study.mjs.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

import { WORKS } from '../src/data/studies.mjs';
import { LANGS } from '../src/lib/routes.mjs';
import { FICHEIRO_DA_EDICAO, todosOsDocumentos } from '../src/lib/documentos.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SRC = path.join(ROOT, 'studies-src');
const MANIFESTO = path.join(SRC, 'manifest.yml');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const erros = [];
const err = (m) => erros.push(m);

/* ------------------------------------------------------------- manifesto -- */

if (!fs.existsSync(MANIFESTO)) {
  console.error(vermelho(`\n  PORTÃO DOS DOCUMENTOS — não existe ${path.relative(ROOT, MANIFESTO)}.\n`));
  process.exit(1);
}

const doc = load(fs.readFileSync(MANIFESTO, 'utf8')) ?? {};
const edicoes = doc.edicoes ?? [];
if (!Array.isArray(edicoes)) {
  console.error(vermelho('\n  PORTÃO DOS DOCUMENTOS — "edicoes" no manifesto não é uma lista.\n'));
  process.exit(1);
}

const OBRIGATORIOS = [
  'slug',
  'lang',
  'title',
  'raw_file',
  'fetched_utc',
  'bytes_raw',
  'bytes_normalized',
  'sha256_raw',
  'sha256_normalized',
];

/**
 * DE ONDE VIERAM OS BYTES — e há duas respostas possíveis, não uma.
 *
 * Até 2026-08-15 todos os documentos alojados eram artefactos do claude.ai, e
 * `artifact_url` era obrigatório. Os dois documentos de «Prometido, Pago,
 * Auditado» nunca foram artefactos: foram produzidos no motor de investigação
 * e atravessaram para cá como ficheiros. Não têm endereço de anfitrião, e
 * inventar-lhes um seria proveniência fabricada — exactamente o que este
 * portão existe para impedir.
 *
 * A regra passou a ser: **uma das duas, e pelo menos uma**.
 *
 *   artifact_url            o documento foi servido por um anfitrião externo;
 *   origin + origin_ref     o documento veio de outro sistema desta casa, e
 *                           `origin_ref` diz de onde, ao commit.
 *
 * Um documento com nenhuma das duas continua a parar o build, que é a
 * severidade que existia antes. Ver DECISIONS §1.31.
 */
const ORIGENS_CONHECIDAS = ['researchhub'];

const chaveDe = (e) => `${e.slug}/${e.lang}`;
const porChave = new Map();

for (const [i, e] of edicoes.entries()) {
  const onde = `edicoes[${i}]`;
  for (const campo of OBRIGATORIOS) {
    if (e[campo] === undefined || e[campo] === null || e[campo] === '') {
      err(`${onde}: falta o campo obrigatório "${campo}".`);
    }
  }
  /* A proveniência dos bytes: endereço de anfitrião, ou sistema de origem. */
  const temArtefacto = typeof e.artifact_url === 'string' && e.artifact_url.trim() !== '';
  const temOrigem = typeof e.origin === 'string' && e.origin.trim() !== '';
  if (!temArtefacto && !temOrigem) {
    err(
      `${onde}: falta a proveniência dos bytes. Ou "artifact_url" (documento servido por um ` +
        `anfitrião externo) ou "origin" + "origin_ref" (documento vindo de outro sistema desta ` +
        `casa). Um documento sem nenhuma das duas não se aloja.`,
    );
  }
  if (temArtefacto && temOrigem) {
    err(
      `${onde}: traz "artifact_url" e "origin" ao mesmo tempo. Os bytes vieram de um sítio só; ` +
        `declare esse.`,
    );
  }
  if (temOrigem) {
    if (!ORIGENS_CONHECIDAS.includes(e.origin)) {
      err(
        `${onde}: "origin" é "${e.origin}", que não é um sistema conhecido ` +
          `(${ORIGENS_CONHECIDAS.join(', ')}). Acrescente-o a este portão e diga porquê.`,
      );
    }
    if (typeof e.origin_ref !== 'string' || e.origin_ref.trim() === '') {
      err(
        `${onde}: tem "origin" sem "origin_ref". Dizer que os bytes vieram de outro sistema sem ` +
          `dizer de que ficheiro e de que commit não é proveniência.`,
      );
    }
  }

  if (!e.slug || !e.lang) continue;

  if (!LANGS.includes(e.lang)) {
    err(`${onde}: "${e.lang}" não é uma língua deste sítio (${LANGS.join(', ')}).`);
  }
  const work = WORKS.find((w) => w.slug === e.slug);
  if (!work) {
    err(`${onde}: "${e.slug}" não é o slug de nenhum trabalho de src/data/studies.mjs.`);
  } else if (!work.editions.some((ed) => ed.lang === e.lang)) {
    err(`${onde}: o trabalho "${e.slug}" não tem edição "${e.lang}" no arquivo.`);
  }
  if (typeof e.sha256_normalized === 'string' && !/^[0-9a-f]{64}$/.test(e.sha256_normalized)) {
    err(`${onde}: "sha256_normalized" não é um sha256 em hexadecimal minúsculo.`);
  }
  if (porChave.has(chaveDe(e))) {
    err(`${onde}: "${chaveDe(e)}" aparece mais do que uma vez no manifesto.`);
  }
  porChave.set(chaveDe(e), e);
}

/* ------------------------------------------------------ o disco, e a conta -- */

const emDisco = new Map(todosOsDocumentos().map((d) => [`${d.slug}/${d.lang}`, d]));

/* 1 — cada linha do manifesto tem ficheiro, e os bytes batem certo. */
for (const [chave, e] of porChave) {
  const d = emDisco.get(chave);
  if (!d) {
    err(
      `o manifesto declara "${chave}" mas não existe ` +
        `studies-src/${e.slug}/${FICHEIRO_DA_EDICAO[e.lang] ?? `${e.lang}.html`}.`,
    );
    continue;
  }
  const bytes = fs.readFileSync(d.ficheiro);
  const sha = crypto.createHash('sha256').update(bytes).digest('hex');
  if (bytes.length !== Number(e.bytes_normalized)) {
    err(
      `"${chave}": o ficheiro tem ${bytes.length} bytes e o manifesto declara ${e.bytes_normalized}.`,
    );
  }
  if (sha !== e.sha256_normalized) {
    err(
      `"${chave}": os bytes em disco não são os do manifesto.\n` +
        `      declarado: ${e.sha256_normalized}\n` +
        `      em disco:  ${sha}\n` +
        `      Um documento alojado é obra citada: se mudou, mudou por engano. Reponha-o a\n` +
        `      partir de studies-src/${e.raw_file} com scripts/normalize-study.mjs, ou\n` +
        `      declare a nova versão no manifesto — e diga porquê.`,
    );
  }
}

/* 2 — nenhum ficheiro em disco sem linha no manifesto. */
for (const [chave, d] of emDisco) {
  if (!porChave.has(chave)) {
    err(
      `existe ${path.relative(ROOT, d.ficheiro)} e não há linha nenhuma para "${chave}" no ` +
        `manifesto. Um documento sem proveniência declarada não se aloja.`,
    );
  }
}

/* 3 — os bytes brutos, que são a prova de sha256_raw, existem. */
for (const [chave, e] of porChave) {
  if (!e.raw_file) continue;
  const bruto = path.join(SRC, String(e.raw_file));
  if (!fs.existsSync(bruto)) {
    err(`"${chave}": o manifesto aponta para studies-src/${e.raw_file}, que não existe.`);
  }
}

/* ------------------------------------------------------------- relatório -- */

console.log('');
console.log(
  cinza(
    `  portão dos documentos · ${porChave.size} edição(ões) no manifesto · ` +
      `${emDisco.size} em disco`,
  ),
);

/* Uma edição que não veio pelo caminho normal diz-se em voz alta, a cada
   construção. Um campo `via` enterrado no manifesto é uma nota de rodapé; dito
   aqui, é uma coisa que quem constrói vê e pode ir conferir. */
for (const [chave, e] of porChave) {
  if (e.via) console.log(cinza(`    · "${chave}" entrou por «${e.via}» — ver DECISIONS §1.21`));
  if (e.origin) {
    console.log(cinza(`    · "${chave}" não é artefacto: veio de «${e.origin}» — ${e.origin_ref}`));
  }
}

if (erros.length) {
  console.log('');
  console.error(vermelho(`  O PORTÃO DOS DOCUMENTOS FECHOU — ${erros.length} erro(s):`));
  console.error('');
  for (const m of erros) console.error('    ' + vermelho('✗') + ' ' + m);
  console.error('');
  process.exit(1);
}

console.log('');
console.log('  ' + verde('✓') + ' cada documento alojado é, byte a byte, o que o manifesto declara.');
console.log('');
