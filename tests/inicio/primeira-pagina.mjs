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
import { conferirSerieDoBloco, plantasDaSerieDoBloco } from './serie-do-bloco.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { conferirAuditoriaDosBlocos, conferirBlocosDaPagina, plantasDosBlocos, idsDosBlocos, ENTRADAS, parse } from './blocos.mjs';
import { conferirEntradas, plantasDasEntradas } from './entradas.mjs';
import { plantasDaReguaDasFrases } from './regua-das-frases.mjs';
import { verificaExplicacoesDoVeredicto } from '../../scripts/pais-veredicto.mjs';
import { documentoDosAssuntos } from './paginas-dos-assuntos.mjs';

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
  ...ENTRADAS.filter((e) => !('existente' in e && e.existente)).flatMap((e) => /** @type {const} */ (['pt', 'en']).map((lang) => ({ rota: e.rota[lang], lang, ids: [], primeira: false }))),
];
for (const p of paginas) {
  const f = path.join(DIST, p.rota.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(f)) { erros.push(`PP1 · ${p.rota}: a página não existe na construção`); continue; }
  const r = conferirBlocosDaPagina(parse(fs.readFileSync(f, 'utf8')), p.lang, p.rota, { ids: p.ids, primeira: p.primeira });
  erros.push(...r.erros);
  if (p.primeira) {
    const html = fs.readFileSync(f, 'utf8');
    erros.push(...conferirSerieDoBloco(parse(html), p.lang));
    if (process.argv.includes('--prova')) for (const x of plantasDaSerieDoBloco(html, p.lang)) {
      relatorio.plantas.push(x);
      if (!x.mordeu) erros.push(`RP4 NÃO MORDEU ${x.nome}: ${x.queixa}`);
    }
  }
  relatorio.paginas.push({ rota: p.rota, ...r.contas, erros: r.erros.length });
}
const e = conferirEntradas(DIST);
erros.push(...e.erros);
relatorio.entradas = e.contas;

/* V1-R4 (bloco R4, 05.10.2026): as plantas da explicação dos valores de referência, sobre cópias em memória da
   primeira página: o lado trocado (a marca e as palavras, de maneira que só a conta da célula o recusa), uma medida de
   dentro tirada da porta dobrada, e uma frase «o que é» que não é a do cartão. A célula corre limpa antes. */
const plantasDoVeredicto = [];
if (process.argv.includes('--prova')) {
  for (const lang of /** @type {const} */ (['pt', 'en'])) {
    const html = fs.readFileSync(path.join(DIST, lang === 'pt' ? '' : 'en', 'index.html'), 'utf8');
    const indice = documentoDosAssuntos(DIST, lang);
    const limpa = verificaExplicacoesDoVeredicto(parse(html), indice, lang);
    if (limpa.length) erros.push(`V1-R4 · a primeira página limpa (${lang}) já tem erros: ${limpa[0]}`);
    const corre = (/** @type {string} */ nome, /** @type {(r: any) => void} */ estraga, /** @type {RegExp} */ mordida) => {
      const r = parse(html);
      estraga(r);
      const e = verificaExplicacoesDoVeredicto(r, indice, lang);
      plantasDoVeredicto.push({ nome: `${nome} (${lang})`, mordeu: e.some((x) => mordida.test(x)), queixa: e[0] ?? null });
    };
    corre('o lado trocado na explicação de um valor de referência', (r) => {
      const item = r.querySelector('[data-veredicto-fora] [data-veredicto-lado="acima"]');
      const frase = item.querySelector('[data-veredicto-lado-frase]');
      item.setAttribute('data-veredicto-lado', 'abaixo');
      frase.set_content(frase.innerHTML.replace(lang === 'pt' ? 'acima do valor' : 'above the', lang === 'pt' ? 'abaixo do valor' : 'below the'));
    }, /a explicação diz o lado «abaixo», e a conta desta célula dá «acima»/);
    corre('uma medida de dentro fora da porta dobrada', (r) => {
      const porta = r.querySelector('details[data-veredicto-dentro]');
      const item = porta.querySelector('[data-veredicto-explica]');
      const copia = item.outerHTML;
      item.remove();
      r.querySelector('[data-veredicto-fora]').insertAdjacentHTML('beforeend', copia);
    }, /está dentro e a explicação está fora da porta dobrada/);
    corre('a frase «o que é» de outra medida', (r) => {
      const a = r.querySelector('[data-veredicto-fora] [data-veredicto-o-que-e]');
      const b = r.querySelector('details[data-veredicto-dentro] [data-veredicto-o-que-e]');
      a.set_content(b.innerHTML);
    }, /a frase «o que é» não é a do cartão/);
  }
  for (const x of plantasDoVeredicto) {
    relatorio.plantas.push(x);
    if (!x.mordeu) erros.push(`V1-R4 · a planta «${x.nome}» não mordeu com a queixa esperada (disse: ${x.queixa ?? 'nada'})`);
  }
}

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
