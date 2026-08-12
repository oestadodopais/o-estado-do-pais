#!/usr/bin/env node
/**
 * NORMALIZAÇÃO DE UM DOCUMENTO VINDO DE UM ARTEFACTO claude.ai
 *
 * Uma função pura, de bytes para bytes: os mesmos bytes de entrada dão SEMPRE
 * os mesmos bytes de saída. Sem juízo sobre o conteúdo, sem casos por estudo,
 * sem heurísticas. Se um ficheiro não encaixar EXACTAMENTE no molde descrito
 * abaixo, esta função ATIRA — nunca improvisa um corte.
 *
 * ---------------------------------------------------------------------------
 * O MOLDE, DERIVADO DOS BYTES (não do que a documentação do anfitrião diga)
 * ---------------------------------------------------------------------------
 *
 * O anfitrião de artefactos serve o documento do autor embrulhado assim, e
 * sempre assim — verificado byte a byte em 19 ficheiros descarregados, de 13
 * artefactos diferentes e de duas gerações do invólucro:
 *
 *   <!doctype html><html><head>            ← PREFIXO   (27 bytes, constante)
 *   <!-- frame-runtime -->                 ← abre o runtime injectado
 *      …script do anfitrião…               ← VARIÁVEL, e muda com o tempo
 *   <!-- /frame-runtime -->                ← fecha o runtime injectado
 *   <meta charset=utf8>…</style></head><body>   ← CABEÇA  (263 bytes, constante)
 *   …o documento do autor, tal como o escreveu…  ← O QUE NOS INTERESSA
 *   </body></html>                         ← SUFIXO    (14 bytes, constante)
 *
 * O PREFIXO, a CABEÇA e o SUFIXO estão escritos por extenso mais abaixo, e são
 * conferidos por igualdade de bytes. O corpo do runtime não é conferido: é
 * precisamente a parte que não é do autor.
 *
 * ---------------------------------------------------------------------------
 * A REGRA, E SÓ ELA
 * ---------------------------------------------------------------------------
 *
 *   Apaga-se UM intervalo contíguo — de `<!-- frame-runtime -->` até
 *   `<!-- /frame-runtime -->`, inclusive — e mais nada.
 *
 * Tudo o resto passa byte a byte: o `<!doctype>`, o `<html>`, o `<head>`, os
 * dois `<meta>`, o estilo-base do anfitrião, o `<body>`, o documento inteiro e
 * o `</body></html>` final.
 *
 * PORQUE NÃO SE TIRA TAMBÉM O ANDAIME DO ANFITRIÃO. É a pergunta óbvia, e a
 * resposta tem duas metades:
 *
 *   1. O documento do autor, nestes artefactos, NÃO é um ficheiro HTML
 *      completo — em 12 dos 13 casos começa em `<title>` e nunca abre `<body>`.
 *      Sem o andaime não é um documento, é um fragmento: não teria `<body>`
 *      onde a faixa do observatório entra (ver src/lib/documentos.mjs), e o
 *      build pararia. Substituir o andaime do anfitrião por um andaime nosso
 *      seria escrever HTML por cima de obra citada — exactamente o que o
 *      mecanismo dos documentos existe para impedir.
 *   2. O andaime é inerte e o runtime não é. O runtime fala por `postMessage`
 *      com claude.ai, importa módulos de `/_runtime/…` que neste domínio não
 *      existem, e trava APIs do navegador. É código morto e alheio. O andaime
 *      são dois `<meta>` e um estilo-base que o próprio documento sobrepõe.
 *
 * Tirar um e deixar o outro não é meio-caminho: é a fronteira entre o que o
 * anfitrião INJECTA (removido) e o que o anfitrião USA PARA SERVIR (mantido).
 *
 * ---------------------------------------------------------------------------
 * PORQUE É QUE ISTO TEM DE SER DETERMINISTA — a razão não é estética
 * ---------------------------------------------------------------------------
 *
 * O runtime injectado MUDA SOZINHO. Medido: os artefactos `ec1cdb39`,
 * `bc6cb6de` e `193481f2` não foram tocados pelo autor entre duas
 * descargas — mesma versão do artefacto — e mesmo assim os bytes descarregados
 * cresceram 2570 bytes cada, porque o anfitrião passou de uma geração de
 * runtime de 14 571 bytes para outra de 17 141.
 *
 * Consequência, e está registada no manifesto: **`sha256_raw` não é
 * reproduzível** — é o registo honesto do que foi descarregado naquele
 * instante. **`sha256_normalized` é o invariante**: o mesmo documento do autor
 * dá o mesmo resumo, hoje e daqui a um ano, atravesse o runtime as gerações que
 * atravessar. É por isso que é o normalizado, e não o bruto, que o portão
 * `check:documentos` confere a cada construção.
 *
 * ---------------------------------------------------------------------------
 * USO
 * ---------------------------------------------------------------------------
 *
 *   node scripts/normalize-study.mjs <bruto.html>              # resumo e medidas
 *   node scripts/normalize-study.mjs <bruto.html> <saída.html> # escreve
 */

import fs from 'node:fs';
import crypto from 'node:crypto';

/* --------------------------------------------------------------- o molde -- */

/** Antes do runtime. Constante em todos os ficheiros observados. */
export const HOST_PREFIX = '<!doctype html><html><head>';

/** Os dois comentários que delimitam o runtime injectado. */
export const RUNTIME_OPEN = '<!-- frame-runtime -->';
export const RUNTIME_CLOSE = '<!-- /frame-runtime -->';

/**
 * Entre o fim do runtime e o início do documento do autor. Constante.
 * Escrito por extenso, e não por padrão: um padrão aceitaria variações que
 * ninguém examinou.
 */
export const HOST_HEAD =
  '<meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">' +
  '<style>:root{color-scheme:light}body{margin:0;padding:0;font:14px -apple-system,' +
  'BlinkMacSystemFont,sans-serif;background:#faf9f5;color:#141413}img{max-width:100%}' +
  '</style></head><body>';

/** Depois do documento do autor. Constante, e sem espaço antes. */
export const HOST_SUFFIX = '</body></html>';

/** Erro próprio: quem chama distingue «não encaixa no molde» de «falhou o disco». */
export class WrapperMismatch extends Error {
  constructor(message) {
    super(message);
    this.name = 'WrapperMismatch';
  }
}

/* ------------------------------------------------------------ a função -- */

const bufOf = (s) => Buffer.from(s, 'utf8');

/**
 * Onde estão as fronteiras do invólucro, em bytes. Atira se não encaixar.
 *
 * Trabalha sobre Buffer e não sobre string: os delimitadores são ASCII, o
 * documento pode ser qualquer coisa, e passar por string arriscaria uma
 * reescrita silenciosa de bytes mal formados. Byte a byte quer dizer bytes.
 *
 * @param {Buffer} raw os bytes descarregados, tal e qual
 * @returns {{ prefixEnd: number, runtimeStart: number, runtimeEnd: number,
 *             authoredStart: number, authoredEnd: number }}
 */
export function wrapperBounds(raw) {
  if (!Buffer.isBuffer(raw)) {
    throw new TypeError('normalize-study: espera um Buffer com os bytes descarregados.');
  }

  const P = bufOf(HOST_PREFIX);
  const O = bufOf(RUNTIME_OPEN);
  const C = bufOf(RUNTIME_CLOSE);
  const H = bufOf(HOST_HEAD);
  const S = bufOf(HOST_SUFFIX);

  const falha = (o) => {
    throw new WrapperMismatch(
      `normalize-study: o ficheiro descarregado não encaixa no invólucro do anfitrião — ${o}\n` +
        `  Isto é uma PARAGEM, não um caso a contornar: o molde foi derivado dos bytes e, se\n` +
        `  mudou, tem de ser derivado outra vez e reescrito neste ficheiro. Nada é cortado a olho.`,
    );
  };

  /* 1 — o prefixo, exacto e no princípio. */
  if (raw.length < P.length || !raw.subarray(0, P.length).equals(P)) {
    falha(`não começa por ${JSON.stringify(HOST_PREFIX)}.`);
  }

  /* 2 — o runtime, uma vez e só uma, e logo a seguir ao prefixo. */
  const runtimeStart = raw.indexOf(O);
  if (runtimeStart !== P.length) {
    falha(
      runtimeStart < 0
        ? `não traz o comentário ${JSON.stringify(RUNTIME_OPEN)}.`
        : `traz ${JSON.stringify(RUNTIME_OPEN)} no byte ${runtimeStart} e devia trazê-lo no ${P.length}.`,
    );
  }
  if (raw.indexOf(O, runtimeStart + O.length) >= 0) {
    falha(`traz ${JSON.stringify(RUNTIME_OPEN)} mais do que uma vez.`);
  }
  const closeAt = raw.indexOf(C, runtimeStart + O.length);
  if (closeAt < 0) falha(`não traz o comentário ${JSON.stringify(RUNTIME_CLOSE)}.`);
  if (raw.indexOf(C, closeAt + C.length) >= 0) {
    falha(`traz ${JSON.stringify(RUNTIME_CLOSE)} mais do que uma vez.`);
  }
  const runtimeEnd = closeAt + C.length;

  /* 3 — a cabeça do anfitrião, exacta, colada ao fim do runtime. */
  if (!raw.subarray(runtimeEnd, runtimeEnd + H.length).equals(H)) {
    falha(
      `depois de ${JSON.stringify(RUNTIME_CLOSE)} não vem a cabeça constante do anfitrião.\n` +
        `      esperado: ${JSON.stringify(HOST_HEAD.slice(0, 70))}…\n` +
        `      lido:     ${JSON.stringify(raw.subarray(runtimeEnd, runtimeEnd + 70).toString('utf8'))}…`,
    );
  }
  const authoredStart = runtimeEnd + H.length;

  /* 4 — o sufixo, exacto e no fim. */
  const authoredEnd = raw.length - S.length;
  if (authoredEnd < authoredStart || !raw.subarray(authoredEnd).equals(S)) {
    falha(`não termina em ${JSON.stringify(HOST_SUFFIX)}.`);
  }

  /* 5 — sobra documento. Um artefacto vazio é um engano, não um documento. */
  if (authoredEnd === authoredStart) {
    falha('o documento do autor está vazio entre o <body> e o </body>.');
  }

  return { prefixEnd: P.length, runtimeStart, runtimeEnd, authoredStart, authoredEnd };
}

/**
 * O documento do autor, alojável: os bytes descarregados menos o runtime.
 *
 * PURA. Sem disco, sem relógio, sem aleatoriedade, sem estado. Mesmos bytes de
 * entrada, mesmos bytes de saída.
 *
 * @param {Buffer} raw os bytes descarregados, tal e qual
 * @returns {Buffer} os bytes a guardar em studies-src/<slug>/<lingua>.html
 */
export function normalizeStudy(raw) {
  const { runtimeStart, runtimeEnd } = wrapperBounds(raw);
  const out = Buffer.concat([raw.subarray(0, runtimeStart), raw.subarray(runtimeEnd)]);

  /* Conferência de saída — barata, e fecha a porta ao engano mais provável:
     um runtime que tivesse mudado de forma e escapasse por uma fresta. */
  if (out.includes('frame-runtime') || out.includes('__FRAME_PREAMBLE')) {
    throw new WrapperMismatch(
      'normalize-study: depois de retirado o runtime ainda há vestígios dele no documento ' +
        '("frame-runtime" ou "__FRAME_PREAMBLE"). O molde mudou; não se corta o resto a olho.',
    );
  }
  if (!out.includes('<body>')) {
    throw new WrapperMismatch(
      'normalize-study: o documento normalizado ficou sem <body>, e a faixa do observatório ' +
        'não saberia onde entrar (ver src/lib/documentos.mjs).',
    );
  }
  return out;
}

/** sha256 em hexadecimal, minúsculas. */
export function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

/** As medidas de um ficheiro bruto — é isto que alimenta o manifesto. */
export function measure(raw) {
  const b = wrapperBounds(raw);
  const normalized = normalizeStudy(raw);
  return {
    bytes_raw: raw.length,
    bytes_normalized: normalized.length,
    bytes_runtime: b.runtimeEnd - b.runtimeStart,
    bytes_authored: b.authoredEnd - b.authoredStart,
    sha256_raw: sha256(raw),
    sha256_normalized: sha256(normalized),
    normalized,
  };
}

/* ---------------------------------------------------------------- linha -- */

const executadoDirectamente =
  process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (executadoDirectamente) {
  const [entrada, saida] = process.argv.slice(2);
  if (!entrada) {
    console.error('uso: node scripts/normalize-study.mjs <bruto.html> [<saída.html>]');
    process.exit(2);
  }
  let m;
  try {
    m = measure(fs.readFileSync(entrada));
  } catch (e) {
    console.error(`\n  ${e.message}\n`);
    process.exit(1);
  }
  if (saida) fs.writeFileSync(saida, m.normalized);
  console.log(
    [
      `bruto:        ${m.bytes_raw} bytes  sha256 ${m.sha256_raw}`,
      `runtime:      ${m.bytes_runtime} bytes (retirado)`,
      `normalizado:  ${m.bytes_normalized} bytes  sha256 ${m.sha256_normalized}`,
      saida ? `escrito em:   ${saida}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  );
}
