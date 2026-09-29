#!/usr/bin/env node
/**
 * check:primeira · A PRIMEIRA PÁGINA DE UM LEITOR COMUM, OS BLOCOS E AS ENTRADAS (bloco PP1, 28.09.2026)
 *
 * Corre, pela ordem: a auditoria das palavras dos cinco blocos (`tests/inicio/blocos.mjs`, a primeira
 * metade, que não lê `dist/`); os blocos rendidos na primeira página e nas cinco páginas das entradas,
 * nas duas edições (a segunda metade); e as entradas contra a página dos temas
 * (`tests/inicio/entradas.mjs`). Com `--prova`, corre também as plantas das duas células e as da régua
 * das frases nas páginas dos blocos (`tests/inicio/regua-das-frases.mjs`), e cada uma tem de morder com a
 * queixa esperada: uma célula que não morde a sua planta não conta.
 *
 * NÃO É O GUIÃO DOS SINAIS: um bloco que as condições tiram da página não é um erro aqui (a célula
 * exige que ele NÃO esteja lá); quem o diz ao lugar de direção é `scripts/sinais-da-primeira-pagina.mjs`.
 *
 * Uso: node tests/inicio/primeira-pagina.mjs [--prova] [--json saída]   (OEDP_DIST aponta outra construção)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { conferirAuditoriaDosBlocos, conferirBlocosDaPagina, plantasDosBlocos, idsDosBlocos, ENTRADAS, parse } from './blocos.mjs';
import { conferirEntradas, plantasDasEntradas } from './entradas.mjs';
import { plantasDaReguaDasFrases } from './regua-das-frases.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.resolve(process.env.OEDP_DIST ?? path.join(RAIZ, 'dist'));
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('check:primeira · não existe dist/index.html. Corra o build primeiro.');
  process.exit(2);
}
/** @type {string[]} */
const erros = [];
const relatorio = { auditoria: {}, paginas: /** @type {any[]} */ ([]), entradas: {}, plantas: /** @type {any[]} */ ([]) };

const a = conferirAuditoriaDosBlocos();
erros.push(...a.erros);
relatorio.auditoria = a.contas;

const paginas = [
  { rota: '/', lang: /** @type {'pt'|'en'} */ ('pt'), ids: idsDosBlocos(), primeira: true },
  { rota: '/en/', lang: /** @type {'pt'|'en'} */ ('en'), ids: idsDosBlocos(), primeira: true },
  ...ENTRADAS.filter((e) => !('existente' in e && e.existente)).flatMap((e) => /** @type {const} */ (['pt', 'en']).map((lang) => ({ rota: e.rota[lang], lang, ids: e.blocos, primeira: false }))),
];
for (const p of paginas) {
  const f = path.join(DIST, p.rota.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(f)) { erros.push(`PP1 · ${p.rota}: a página não existe na construção`); continue; }
  const r = conferirBlocosDaPagina(parse(fs.readFileSync(f, 'utf8')), p.lang, p.rota, { ids: p.ids, primeira: p.primeira });
  erros.push(...r.erros);
  relatorio.paginas.push({ rota: p.rota, ...r.contas, erros: r.erros.length });
}
const e = conferirEntradas(DIST);
erros.push(...e.erros);
relatorio.entradas = e.contas;

if (process.argv.includes('--prova')) {
  for (const x of [...plantasDosBlocos(DIST), ...plantasDasEntradas(DIST), ...plantasDaReguaDasFrases(DIST)]) {
    relatorio.plantas.push(x);
    if (!x.mordeu) erros.push(`PP1 · a planta «${x.nome}» não mordeu com a queixa esperada (disse: ${x.queixa ?? 'nada'})`);
  }
}

const j = process.argv.indexOf('--json');
if (j !== -1) fs.writeFileSync(process.argv[j + 1], JSON.stringify({ ...relatorio, erros }, null, 2) + '\n');
const blocosMostrados = relatorio.paginas.reduce((n, p) => n + p.blocos_mostrados, 0);
console.log(
  `check:primeira · auditoria: ${a.contas.folhas} folhas, ${a.contas.partes} partes (${a.contas.diz} diz, ${a.contas.conta} conta, ${a.contas.liga} liga), ` +
    `${a.contas.apoios} apoios, ${a.contas.algarismos} algarismos · ${relatorio.paginas.length} páginas, ${blocosMostrados} blocos rendidos e recontados · ` +
    `entradas: ${e.contas.cartoes_dos_temas} cartões nos temas, ${e.contas.cartoes_nas_entradas} nas entradas, ${e.contas.fora} fora por declaração, ` +
    `${e.contas.entradas_no_mapa_do_sitio} páginas das entradas no mapa do sítio` +
    (relatorio.plantas.length ? ` · ${relatorio.plantas.filter((x) => x.mordeu).length} de ${relatorio.plantas.length} plantas mordidas` : ''),
);
if (erros.length) {
  for (const x of erros.slice(0, 60)) console.error(`  ${x}`);
  if (erros.length > 60) console.error(`  … e mais ${erros.length - 60}`);
  process.exit(1);
}
console.log('check:primeira · todas as conferências a 0.');
