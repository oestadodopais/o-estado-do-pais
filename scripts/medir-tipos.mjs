#!/usr/bin/env node
/**
 * A régua dos tipos. Mede o que os ficheiros WOFF2 alojados em `public/tipos/`
 * fazem de facto num navegador, e não o que a tabela de features diz que eles
 * sabem fazer.
 *
 * NÃO é um portão: não falha nada e não entra no `npm run build`. É uma fita
 * métrica, como `medir-defeitos.mjs` e `medir-contraste.mjs`. Corre à mão, e o
 * que ela imprime decide-se por escrito.
 *
 * PORQUE EXISTE. Uma família pode declarar `tnum` ou `onum` na tabela `GSUB` e
 * a substituição não mexer um décimo de pixel: a feature existe, e a folha que
 * a pede não recebe nada. A sessão de desenho da v3 encontrou exatamente isso
 * no `onum` do Spectral da compilação do Google. Uma declaração não é uma
 * medição, e a única maneira honesta de saber é renderizar e medir a largura.
 *
 * O QUE MEDE, e é sempre a mesma prova.
 *
 *   TABULARES (`tnum`). Duas cadeias com o mesmo número de glifos e algarismos
 *   diferentes («1111111» e «0000000»). Numa letra com algarismos tabulares a
 *   sério e a feature ligada, as duas medem EXATAMENTE o mesmo; sem a feature,
 *   uma letra proporcional dá-lhes larguras diferentes. Quatro larguras: as
 *   duas cadeias, com e sem `font-variant-numeric: tabular-nums`.
 *
 *   ANTIGOS (`onum`), e o par que se compara importa. O Spectral tem QUATRO
 *   conjuntos de algarismos: versais tabulares (o defeito, marcha 500 em todos),
 *   versais proporcionais (`.LP`), antigos proporcionais (`.OP`) e antigos
 *   tabulares (`.OT`). Pedir só `oldstyle-nums` troca o defeito pelos antigos
 *   TABULARES, que têm a mesma marcha: os glifos mudam, a caixa não mexe um
 *   pixel, e uma régua que só comparasse esse par diria «inerte» sobre uma
 *   feature que funciona. O par que decide é `lining-nums proportional-nums`
 *   contra `oldstyle-nums proportional-nums`: aí os dois conjuntos têm marchas
 *   diferentes e a largura di-lo. As duas comparações estão nesta régua, e a
 *   diferença entre elas é metade do resultado.
 *
 * COMO MEDE. Um `<span>` em linha, sem quebra, com `getBoundingClientRect()`,
 * depois de `document.fonts.load()` da ficha exata: uma medição feita antes de
 * o ficheiro chegar mede a pilha de recuo, e a pilha de recuo não é o que se
 * está a medir. A página de prova é servida por um servidor local efémero a
 * partir de `dist/`, e liga a MESMA folha de estilos que o sítio serve: os
 * `@font-face` medidos são os do sítio, com `%5B` e tudo, e não uns escritos
 * aqui para a ocasião.
 *
 * Uso:
 *   node scripts/medir-tipos.mjs            imprime a tabela
 *   node scripts/medir-tipos.mjs --json     imprime os números, para guardar
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');

const cinza = (s) => `\x1b[90m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;

const comoJson = process.argv.includes('--json');

if (!fs.existsSync(path.join(DIST, 'tipos'))) {
  console.error('Não há `dist/tipos/`. Corra `npm run build` primeiro: esta régua mede os ficheiros servidos.');
  process.exit(1);
}

/* --------------------------------------------------------------- as provas */

const CADEIAS = ['1111111', '0000000'];
const TAMANHO = 100; /* px: a diferença de um centésimo de em fica visível */

const PROVAS = [
  { familia: 'Bitter', peso: 400, prova: 'tnum', a: 'normal', b: 'tabular-nums' },
  { familia: 'Bitter', peso: 600, prova: 'tnum', a: 'normal', b: 'tabular-nums' },
  { familia: 'Bitter', peso: 400, prova: 'onum', a: 'lining-nums proportional-nums', b: 'oldstyle-nums proportional-nums' },
  { familia: 'Spectral', peso: 400, prova: 'tnum', a: 'normal', b: 'tabular-nums' },
  { familia: 'Spectral', peso: 400, prova: 'onum-cego', a: 'normal', b: 'oldstyle-nums' },
  { familia: 'Spectral', peso: 400, prova: 'onum', a: 'lining-nums proportional-nums', b: 'oldstyle-nums proportional-nums' },
  { familia: 'Spectral SC', peso: 400, prova: 'onum', a: 'lining-nums proportional-nums', b: 'oldstyle-nums proportional-nums' },
];

/* ------------------------------------------------------------------ o servidor
 * Estático, mínimo, e só para `dist/`, mais a página de prova em `/__medir`.
 * Existe porque `file://` trata cada ficheiro como uma origem opaca e recusa os
 * tipos: a medição feita assim mediria sempre a pilha de recuo e diria que
 * nenhuma família funciona.
 */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

const folhas = fs
  .readdirSync(path.join(DIST, '_astro'))
  .filter((f) => f.endsWith('.css'))
  .sort()
  .map((f) => `/_astro/${f}`);

const PAGINA_DE_PROVA = `<!doctype html>
<html lang="pt-PT"><head><meta charset="utf-8"><title>régua dos tipos</title>
${folhas.map((f) => `<link rel="stylesheet" href="${f}">`).join('\n')}
<style>body{margin:0}.amostra{position:absolute;left:-9999px;white-space:nowrap}</style>
</head><body></body></html>`;

const servidor = http.createServer((req, res) => {
  const semQuery = req.url.split('?')[0];
  if (semQuery === '/__medir') {
    res.writeHead(200, { 'content-type': MIME['.html'] });
    res.end(PAGINA_DE_PROVA);
    return;
  }
  let rel;
  try {
    rel = decodeURIComponent(semQuery);
  } catch {
    rel = semQuery;
  }
  let ficheiro = path.resolve(DIST, '.' + rel);
  if (!ficheiro.startsWith(DIST)) {
    res.writeHead(403).end();
    return;
  }
  if (fs.existsSync(ficheiro) && fs.statSync(ficheiro).isDirectory()) {
    ficheiro = path.join(ficheiro, 'index.html');
  }
  if (!fs.existsSync(ficheiro)) {
    res.writeHead(404).end('404');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(ficheiro)] ?? 'application/octet-stream' });
  fs.createReadStream(ficheiro).pipe(res);
});

await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const navegador = await chromium.launch({ headless: true });
const p = await navegador.newPage();
await p.goto(`${base}/__medir`, { waitUntil: 'networkidle' });

const resultados = [];
for (const prova of PROVAS) {
  const medida = await p.evaluate(
    async ({ familia, peso, a, b, cadeias, tamanho }) => {
      /* Carrega a ficha exata antes de medir. `document.fonts.load()` devolve
         as fichas que casam com a descrição pedida; uma lista vazia é a prova
         de que a medição seguinte mediria a pilha de recuo. */
      const desc = `${peso} ${tamanho}px "${familia}"`;
      const casadas = await document.fonts.load(desc, cadeias.join(''));
      await document.fonts.ready;
      const carregada = document.fonts.check(desc, cadeias.join(''));

      const mede = (texto, variante) => {
        const el = document.createElement('span');
        el.className = 'amostra';
        el.style.fontFamily = `"${familia}"`;
        el.style.fontWeight = String(peso);
        el.style.fontSize = `${tamanho}px`;
        el.style.fontVariantNumeric = variante;
        el.textContent = texto;
        document.body.appendChild(el);
        const r = el.getBoundingClientRect();
        el.remove();
        return Number(r.width.toFixed(3));
      };

      const out = { fichasCasadas: casadas.length, carregada, larguras: {} };
      for (const variante of [a, b]) {
        for (const c of cadeias) out.larguras[`${c} · ${variante}`] = mede(c, variante);
      }
      return out;
    },
    { ...prova, cadeias: CADEIAS, tamanho: TAMANHO },
  );
  resultados.push({ ...prova, ...medida });
}

await navegador.close();
servidor.close();

/* ------------------------------------------------------------------ o veredito
 * Nenhum destes veredictos falha nada: dizem o que a medição mostra, e a
 * decisão de pedir ou não a feature na folha escreve-se noutro sítio.
 */
function veredito(r) {
  const [x, y] = CADEIAS;
  const L = (c, v) => r.larguras[`${c} · ${v}`];
  const iguaisEm = (v) => L(x, v) === L(y, v);
  const mexeu = L(x, r.a) !== L(x, r.b) || L(y, r.a) !== L(y, r.b);

  if (r.prova === 'tnum') {
    if (iguaisEm(r.b) && !iguaisEm(r.a)) return 'tabulares reais: a feature alinha o que estava desalinhado';
    if (iguaisEm(r.b) && iguaisEm(r.a)) return 'as duas cadeias já mediam o mesmo sem a feature (tabulares por defeito)';
    return 'a feature NÃO alinha: as duas cadeias continuam com larguras diferentes';
  }
  if (r.prova === 'onum-cego') {
    return mexeu
      ? 'a largura muda mesmo neste par'
      : 'a largura NÃO muda neste par, e não é prova de nada: os dois conjuntos são tabulares e têm a mesma marcha';
  }
  return mexeu
    ? 'os antigos existem e entram: a largura muda entre os dois conjuntos proporcionais'
    : 'os antigos NÃO entram: nem no par proporcional a largura muda';
}

const relatorio = resultados.map((r) => ({
  familia: r.familia,
  peso: r.peso,
  prova: r.prova,
  comparacao: `${r.a}  contra  ${r.b}`,
  fichasCasadas: r.fichasCasadas,
  carregada: r.carregada,
  tamanhoPx: TAMANHO,
  larguras: r.larguras,
  veredito: veredito(r),
}));

if (comoJson) {
  console.log(JSON.stringify({ tamanhoPx: TAMANHO, cadeias: CADEIAS, provas: relatorio }, null, 2));
} else {
  console.log('');
  console.log(cinza(`  a régua dos tipos · ${TAMANHO}px · «${CADEIAS[0]}» e «${CADEIAS[1]}»`));
  console.log('');
  for (const r of relatorio) {
    console.log(`  ${r.familia} ${r.peso} · ${r.prova} · ${r.comparacao}`);
    if (!r.carregada) {
      console.log(
        amarelo(`    A FICHA NÃO CARREGOU (${r.fichasCasadas} casada(s)): o que se mediu foi a pilha de recuo.`),
      );
    } else {
      console.log(cinza(`    ficha carregada · ${r.fichasCasadas} ficha(s) casada(s)`));
    }
    for (const [k, v] of Object.entries(r.larguras)) {
      console.log(cinza(`    ${k.padEnd(44)} ${String(v).replace('.', ',')} px`));
    }
    console.log('    ' + verde(r.veredito));
    console.log('');
  }
  console.log(cinza('  A régua não falha a construção. O que ela diz decide-se por escrito.'));
  console.log('');
}
