#!/usr/bin/env node
/**
 * O COMPOSITOR DAS FRASES «O QUE É» DAS SÉRIES NO TEMPO SEM LINHA PRESA (bloco R4, 05.10.2026, o ponto 3 do brief).
 *
 * Lê a especificação ao lado (`series-r4.mjs`), confere cada apoio contra os campos da série, as origens declaradas e
 * o nome que o projeto dá à série, recusa um algarismo numa frase, confirma que cada série no tempo tem frase (a da
 * sua linha, ou uma desta especificação, e nunca as duas) e escreve:
 *   · `src/data/o-que-e-das-series.mjs` · a declaração que o resolvedor do sítio lê;
 *   · `tests/cartao/leituras-provadas.json` · a chave `series` da auditoria que a K17 confere (o resto do ficheiro fica
 *     como está, e a leitura deste passo entra na lista `leituras`).
 *
 * Não confere por conta da K17: a K17 refaz tudo isto por conta própria. Este guião só falha cedo, para quem escreve.
 *
 * Uso, a partir da raiz do sítio:  node design/especime-v3/medicoes/r4-2026-10-05/compor-series-r4.mjs [--seco]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERIES_R4 } from './series-r4.mjs';
import { ORIGENS_DAS_DEFINICOES } from '../../../../src/data/figuras.mjs';
import { NOMES_DAS_SERIES } from '../../../../src/data/series-no-tempo.mjs';
import { allSeries } from '../../../../src/lib/series.mjs';
import { allClaims } from '../../../../src/lib/ledger.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const SECO = process.argv.includes('--seco');
const DECLARACAO = path.join(RAIZ, 'src', 'data', 'o-que-e-das-series.mjs');
const AUDITORIA = path.join(RAIZ, 'tests', 'cartao', 'leituras-provadas.json');

/** @type {string[]} */
const erros = [];
const falha = (/** @type {string} */ m) => erros.push(m);

const CAMPOS_DA_FONTE = new Set(['name', 'unit', 'source', 'document.title', 'document.edition']);
const CAMPOS_DA_CASA = new Set(['derivation', 'derivation_en']);
/** @param {any} s @param {string} c */
const campoDaSerie = (s, c) => (c === 'document.title' ? s?.document?.title : c === 'document.edition' ? s?.document?.edition : s?.[c]);

const noTempo = allSeries().filter((s) => s.eixo === 'periodo');
const linhas = allClaims();
/** A linha de onde vem a frase de uma série: a que o nome declara, ou a última presa a ela. @param {string} id */
const linhaDaSerie = (id) => {
  const d = /** @type {any} */ (NOMES_DAS_SERIES)[id];
  if (d && 'linha' in d) return d.linha;
  const presas = linhas.filter((c) => /** @type {any} */ (c).serie === id).sort((a, b) => String(a.reference_date).localeCompare(String(b.reference_date)));
  return presas.length ? presas[presas.length - 1].id : null;
};

/** @param {any} a @param {any} s @returns {string|null} */
function verifica(a, s) {
  if (typeof a.literal !== 'string' || a.literal.trim().length < 4) return `o literal «${a.literal}» tem menos de quatro caracteres`;
  if (a.origem) {
    const o = /** @type {any} */ (ORIGENS_DAS_DEFINICOES)[a.origem];
    if (!o) return `a origem «${a.origem}» não está declarada`;
    if (!['excerto', 'excertoEn', 'documento', 'publicador'].includes(a.campo) || typeof o[a.campo] !== 'string' || !o[a.campo].includes(a.literal)) return `«${a.literal}» não está no campo «${a.campo}» da origem «${a.origem}»`;
    return null;
  }
  if (a.declaracao === 'nome') {
    const n = /** @type {any} */ (NOMES_DAS_SERIES)[s.id]?.nome?.[a.lingua];
    if (typeof n !== 'string' || !n.includes(a.literal)) return `o nome da série (${a.lingua}) não traz «${a.literal}»`;
    return null;
  }
  if (a.serie === 'propria') {
    if (!CAMPOS_DA_FONTE.has(a.campo) && !CAMPOS_DA_CASA.has(a.campo)) return `o campo «${a.campo}» não pode apoiar`;
    const v = campoDaSerie(s, a.campo);
    if (typeof v !== 'string' || !v.includes(a.literal)) return `«${a.literal}» não está no campo «${a.campo}» da série`;
    return null;
  }
  return 'um apoio de forma desconhecida';
}
const classeDe = (/** @type {any} */ a) => (a.origem || (a.serie === 'propria' && CAMPOS_DA_FONTE.has(a.campo)) ? 'fonte' : 'casa');
/* R4-b: uma parte confirma-se pela fonte ou pela conta declarada de uma série calculada; o nome do projeto não confirma. */
const confirma = (/** @type {any} */ a) => Boolean(a.origem || (a.serie === 'propria' && (CAMPOS_DA_FONTE.has(a.campo) || CAMPOS_DA_CASA.has(a.campo))));
/** @type {string[]} */
const porConfirmar = [];

/** @type {Record<string, any>} */
const declaracao = {};
/** @type {any[]} */
const auditoria = [];
/** @type {{ fonte: string[], casa: string[] }} */
const classes = { fonte: [], casa: [] };
const usadas = new Set();
for (const e of SERIES_R4) {
  const s = noTempo.find((x) => x.id === e.serie);
  if (!s) { falha(`«${e.serie}» não é uma série no tempo`); continue; }
  if (usadas.has(e.serie)) falha(`«${e.serie}» aparece duas vezes`);
  usadas.add(e.serie);
  if (linhaDaSerie(e.serie)) falha(`«${e.serie}» tem a linha «${linhaDaSerie(e.serie)}», e a frase é a dela`);
  const origens = new Set();
  let daFonte = true;
  for (const [j, p] of e.partes.entries()) {
    const onde = `${e.serie}, parte ${j + 1} («${p.pt.slice(0, 50)}»)`;
    for (const lang of ['pt', 'en']) if (/\d/.test(p[lang])) falha(`${onde} · ${lang}: traz um algarismo`);
    if (p.classe === 'liga') {
      for (const lang of ['pt', 'en']) if (p[lang].replace(/[\s.,:;()−%’'!?]+/g, '') !== '') falha(`${onde}: uma ligação com palavras`);
      continue;
    }
    if (!p.apoios?.length) { falha(`${onde}: diz e não tem apoio`); continue; }
    let parteDaFonte = false;
    for (const a of p.apoios) {
      const er = verifica(a, s);
      if (er) falha(`${onde}: ${er}`);
      else if (classeDe(a) === 'fonte') parteDaFonte = true;
      if (a.origem) origens.add(a.origem);
    }
    if (!parteDaFonte) daFonte = false;
  }
  const pt = e.partes.map((p) => p.pt).join('');
  const en = e.partes.map((p) => p.en).join('');
  declaracao[e.serie] = { frase: { pt: [pt], en: [en] } };
  const por = e.partes.some((/** @type {any} */ p) => p.classe === 'diz' && !(p.apoios ?? []).some(confirma));
  if (por) porConfirmar.push(e.serie);
  auditoria.push({ serie: e.serie, origens: [...origens], ...(por ? { por_confirmar_na_fonte: true } : {}), folhas: [{ pt, en, partes: e.partes }] });
  (daFonte ? classes.fonte : classes.casa).push(e.serie);
}
for (const s of noTempo) if (!linhaDaSerie(s.id) && !usadas.has(s.id)) falha(`«${s.id}» não tem linha nem frase na especificação`);

if (erros.length) {
  console.error(`compor-series-r4: ${erros.length} defeito(s):\n  ${erros.join('\n  ')}`);
  process.exit(1);
}
const comLinha = noTempo.filter((s) => linhaDaSerie(s.id)).map((s) => `${s.id} ← ${linhaDaSerie(s.id)}`);
console.log(`séries no tempo ${noTempo.length} · com a frase da linha ${comLinha.length} · com frase própria ${SERIES_R4.length}`);
console.log(`com todas as partes apoiadas na fonte ${classes.fonte.length} · com alguma parte só da casa ${classes.casa.length}: ${classes.casa.join(', ')}`);
console.log(`por confirmar na fonte: ${porConfirmar.length}: ${porConfirmar.join(', ')}`);
if (SECO) process.exit(0);

const cabeca = `/**
 * O QUE É CADA SÉRIE · as frases das séries no tempo sem linha do livro-razão (bloco R4, 05.10.2026, o ponto 3 do brief
 * \`design/observatorio/BRIEF-R4-as-palavras-correntes-em-cada-numero.md\`).
 *
 * GERADO por \`design/especime-v3/medicoes/r4-2026-10-05/compor-series-r4.mjs\` a partir da especificação
 * \`series-r4.mjs\`, na mesma pasta, onde cada frase se escreve parte a parte com o apoio de cada parte. Não se edita à
 * mão: muda-se a especificação e corre-se o compositor, que reescreve este ficheiro e a auditoria
 * (\`tests/cartao/leituras-provadas.json\`, chave \`series\`), que a K17 do \`check:cartao\` confere.
 *
 * As séries com linha (a que o nome declara, ou a última presa à série) leem a frase da linha, e não estão aqui.
 */
`;
const ordenado = Object.fromEntries(Object.keys(declaracao).sort().map((k) => [k, declaracao[k]]));
fs.writeFileSync(DECLARACAO, `${cabeca}export const FRASES_DAS_SERIES = ${JSON.stringify(ordenado, null, 2)};\n\n/** As séries cuja frase está por confirmar na fonte (R4-b): o recibo leva o marcador da casa ao pé dela. */\nexport const SERIES_POR_CONFIRMAR_NA_FONTE = ${JSON.stringify(porConfirmar.sort(), null, 2)};\n`);
const AUD = JSON.parse(fs.readFileSync(AUDITORIA, 'utf8'));
const leitura = {
  quem: 'Claude Opus 5.5',
  quando: '2026-10-05',
  o_que: 'o bloco R4, as séries: as frases «o que é» das dez séries no tempo sem linha do livro-razão, cada parte com o literal que a apoia num campo da própria série, numa origem declarada (com os rótulos das classes do IHPC e da unidade do índice de preços da habitação trimestral, lidos na API do Eurostat a 05.10.2026) ou, onde nenhum dos dois o diz, no nome que o projeto dá à série',
};
AUD.leituras = [...AUD.leituras.filter((/** @type {any} */ l) => !(l.quando === leitura.quando && l.o_que.startsWith('o bloco R4, as séries'))), leitura];
AUD.series = auditoria;
fs.writeFileSync(AUDITORIA, `${JSON.stringify(AUD, null, 2)}\n`);
console.log(`escrito: ${path.relative(RAIZ, DECLARACAO)} e a chave series de ${path.relative(RAIZ, AUDITORIA)}`);
