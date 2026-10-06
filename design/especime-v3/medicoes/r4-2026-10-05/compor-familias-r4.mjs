#!/usr/bin/env node
/**
 * O COMPOSITOR DAS FRASES DAS FAMÍLIAS (bloco R4, 05.10.2026).
 *
 * Lê a especificação ao lado (`familias-r4.mjs`), confere cada apoio contra as linhas do livro-razão e as origens
 * declaradas, recusa um algarismo numa frase, confirma que cada linha do livro tem família (ou cartão) e nome, e
 * escreve:
 *   · `src/data/o-que-e-das-familias.mjs` · a declaração que o resolvedor do sítio lê;
 *   · `tests/cartao/leituras-provadas.json` · a chave `familias` da auditoria que a K17 confere (o resto do ficheiro
 *     fica como está, e a leitura deste bloco entra na lista `leituras`).
 *
 * Não confere por conta da K17: a K17 refaz tudo isto por conta própria, a partir da auditoria e da declaração, e é a
 * ela que a construção obedece. Este guião só falha cedo, para quem escreve as frases.
 *
 * Uso, a partir da raiz do sítio:  node design/especime-v3/medicoes/r4-2026-10-05/compor-familias-r4.mjs [--seco]
 *   --seco  confere e diz, sem escrever nada.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAMILIAS_R4, FAMILIAS_DOS_CONCELHOS_R4 } from './familias-r4.mjs';
import { ORIGENS_DAS_DEFINICOES } from '../../../../src/data/figuras.mjs';
import { TERMOS_DOS_CARTOES } from '../../../../src/data/termos-dos-cartoes.mjs';
import { MEDIDAS_DO_CONCELHO } from '../../../../src/data/concelhos.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../../../../src/data/municipios.mjs';
import { LEITURAS_DAS_MEDIDAS } from '../../../../src/data/leituras-das-medidas.mjs';
import { corteDaLeitura } from '../../../../src/lib/leitura-da-medida.mjs';
import { allClaims } from '../../../../src/lib/ledger.mjs';
import { nomeDaMedida, nomeDaLinhaDerivada } from '../../../../src/lib/nomes.mjs';
import { folhasDaLeitura } from '../../../../tests/cartao/leituras.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const SECO = process.argv.includes('--seco');
const DECLARACAO = path.join(RAIZ, 'src', 'data', 'o-que-e-das-familias.mjs');
const AUDITORIA = path.join(RAIZ, 'tests', 'cartao', 'leituras-provadas.json');

const erros = [];
const falha = (m) => erros.push(m);

/* ------------------------------------------------------------------ as linhas e as famílias */
const linhas = new Map(allClaims().map((c) => [c.id, c]));
const DO_CONCELHO = new Map();
for (const m of MUNICIPIOS_COM_PAGINA) {
  for (const p of m.relance ?? []) if (p.claim) DO_CONCELHO.set(p.claim, p.chave);
  if (m.distancia?.limite) DO_CONCELHO.set(m.distancia.limite, 'limite');
}
const semPeriodo = (id) => id.replace(/-\d{4}(-\d{2})?(?=(-ue)?$)/, '');
const familia = (id) => (Object.prototype.hasOwnProperty.call(LEITURAS_DAS_MEDIDAS, id) ? { tipo: 'cartao', chave: id }
  : DO_CONCELHO.has(id) ? { tipo: 'concelho', chave: DO_CONCELHO.get(id) } : { tipo: 'familia', chave: semPeriodo(id) });
/** @type {Map<string, string[]>} as linhas de cada família nacional e de cada medida dos concelhos (`concelho:<chave>`) */
const linhasDe = new Map();
for (const id of linhas.keys()) {
  const f = familia(id);
  if (f.tipo === 'cartao') continue;
  const k = f.tipo === 'concelho' ? `concelho:${f.chave}` : f.chave;
  if (!linhasDe.has(k)) linhasDe.set(k, []);
  linhasDe.get(k).push(id);
}

/* ------------------------------------------------------------------ os campos que apoiam */
const CAMPOS_DA_FONTE = new Set(['excerpt', 'unit', 'name', 'source', 'document.title', 'document.locator', 'document.edition']);
const CAMPOS_DA_CASA = new Set(['derivation', 'derivation_en', 'ressalva', 'ressalva_en']);
const campoDaLinha = (l, c) => (c === 'document.title' ? l?.document?.title : c === 'document.locator' ? l?.document?.locator : c === 'document.edition' ? l?.document?.edition : l?.[c]);
const nomeDaCasa = (id, lingua) => {
  const c = linhas.get(id);
  const n = nomeDaMedida(c, lingua);
  if (n?.fonte) return n.texto;
  return nomeDaLinhaDerivada(c, lingua)?.texto ?? null;
};
const texto = (x) => (Array.isArray(x) ? x.map((p) => (typeof p === 'string' ? p : p.termo)).join('') : x);

/**
 * Um apoio, conferido para cada linha. Devolve a classe do apoio: 'fonte', 'casa' ou null (falhou).
 * @param {any} a @param {string[]} ids @param {string} onde @param {Map<string, string>} nomesDaFamilia
 */
function apoio(a, ids, onde, nomesDaFamilia) {
  if (a.ou) {
    let classe = 'fonte';
    for (const id of ids) {
      const valida = a.ou.map((alt) => ({ alt, ok: verifica(alt, [id], nomesDaFamilia) === null })).filter((x) => x.ok);
      if (!valida.length) { falha(`${onde}: nenhuma das alternativas vale na linha «${id}»`); return null; }
      if (!valida.some((x) => classeDe(x.alt) === 'fonte')) classe = 'casa';
    }
    return classe;
  }
  const e = verifica(a, ids, nomesDaFamilia);
  if (e) { falha(`${onde}: ${e}`); return null; }
  return classeDe(a);
}
function classeDe(a) {
  if (a.origem || (a.linha && CAMPOS_DA_FONTE.has(a.campo)) || (a.linha && a.forma === 'ano')) return 'fonte';
  return 'casa';
}
function verifica(a, ids, nomesDaFamilia) {
  if (a.forma === 'ano') {
    for (const id of ids) if (!/^\d{4}$/.test(String(linhas.get(id)?.reference_date ?? ''))) return `o período de «${id}» não é um ano`;
    return null;
  }
  if (typeof a.literal !== 'string' && !a.termo) return 'um apoio sem literal';
  if (a.literal !== undefined && a.literal.trim().length < 4) return `o literal «${a.literal}» tem menos de quatro caracteres`;
  if (a.origem) {
    const o = ORIGENS_DAS_DEFINICOES[a.origem];
    if (!o) return `a origem «${a.origem}» não está declarada`;
    if (typeof o[a.campo] !== 'string' || !o[a.campo].includes(a.literal)) return `«${a.literal}» não está no campo «${a.campo}» da origem «${a.origem}»`;
    return null;
  }
  if (a.termo) {
    const t = TERMOS_DOS_CARTOES[a.termo];
    if (!t) return `o termo «${a.termo}» não está em TERMOS_DOS_CARTOES`;
    for (const id of ids) if (!t.cartoes.includes(id)) return `o termo «${a.termo}» não nomeia a linha «${id}»`;
    return null;
  }
  if (a.declaracao === 'nome') {
    for (const id of ids) {
      const n = nomesDaFamilia.get(`${id}|${a.lingua}`);
      if (typeof n !== 'string' || !n.includes(a.literal)) return `o nome (${a.lingua}) da linha «${id}» («${n}») não traz «${a.literal}»`;
    }
    return null;
  }
  if (a.linha === 'propria') {
    if (!CAMPOS_DA_FONTE.has(a.campo) && !CAMPOS_DA_CASA.has(a.campo)) return `o campo «${a.campo}» não pode apoiar`;
    for (const id of ids) {
      const v = campoDaLinha(linhas.get(id), a.campo);
      if (typeof v !== 'string' || !v.includes(a.literal)) return `«${a.literal}» não está no campo «${a.campo}» da linha «${id}»`;
    }
    return null;
  }
  return 'um apoio de forma desconhecida';
}

/* ------------------------------------------------------------------ o que está por confirmar na fonte (R4-b) */
/* Uma parte que diz está confirmada numa linha quando um dos seus apoios, válido nessa linha, é da fonte (uma origem
   declarada, um campo da fonte da linha ou o período lido da data) ou é a conta declarada de uma linha calculada
   (`derivation`, `derivation_en`: a definição desse número, selada e refeita pelos portões). O nome do projeto, a ressalva
   da casa e a explicação de um termo são palavras da casa: uma parte que só elas apoiam está por confirmar na fonte, e
   a frase leva o marcador da casa no recibo dessa linha. */
const CAMPOS_QUE_CONFIRMAM = new Set([...CAMPOS_DA_FONTE, 'derivation', 'derivation_en']);
function confirmaNaLinha(a, id, nomesDaFamilia) {
  if (a.ou) return a.ou.some((alt) => verifica(alt, [id], nomesDaFamilia) === null && confirmaNaLinha(alt, id, nomesDaFamilia));
  if (a.origem || a.forma === 'ano') return true;
  return a.linha === 'propria' && CAMPOS_QUE_CONFIRMAM.has(a.campo);
}
function linhasPorConfirmar(e, ids, nomesDaFamilia) {
  const diz = e.partes.filter((p) => p.classe === 'diz');
  return ids.filter((id) => diz.some((p) => !(p.apoios ?? []).some((a) => confirmaNaLinha(a, id, nomesDaFamilia))));
}
const porConfirmar = [];
const porConfirmarDaEntrada = (todas, por) => (por.length === 0 ? null : por.length === todas.length ? true : { linhas: [...por].sort() });

/* ------------------------------------------------------------------ as entradas */
const usadas = new Set();
const declaracao = {};
const doConcelho = {};
const auditoria = [];
const classes = { fonte: [], casa: [] };

function confereEntrada(e, ids, chaveDeAuditoria, nomesDaFamilia) {
  const origens = new Set();
  let familiaDaFonte = true;
  for (const lang of ['pt', 'en']) {
    for (const p of e.partes) if (/\d/.test(texto(p[lang]))) falha(`${chaveDeAuditoria} · ${lang}: «${texto(p[lang])}» traz um algarismo`);
  }
  for (const [j, p] of e.partes.entries()) {
    const onde = `${chaveDeAuditoria}, parte ${j + 1} («${texto(p.pt).slice(0, 50)}»)`;
    if (p.classe === 'liga') {
      for (const lang of ['pt', 'en']) if (texto(p[lang]).replace(/[\s.,:;()−%’'!?]+/g, '') !== '') falha(`${onde}: uma ligação com palavras`);
      continue;
    }
    if (!p.apoios?.length) { falha(`${onde}: diz e não tem apoio`); continue; }
    let parteDaFonte = false;
    for (const a of p.apoios) {
      const c = apoio(a, ids, onde, nomesDaFamilia);
      if (c === 'fonte') parteDaFonte = true;
      const anda = (x) => { if (x.origem) origens.add(x.origem); for (const y of x.ou ?? []) anda(y); };
      anda(a);
    }
    if (!parteDaFonte) familiaDaFonte = false;
  }
  return { origens: [...origens], fonte: familiaDaFonte };
}

const nomesDe = (ids, nomeDaEntrada, cartao) => {
  const m = new Map();
  for (const id of ids) for (const lang of ['pt', 'en']) {
    const casa = nomeDaCasa(id, lang);
    const n = casa ?? nomeDaEntrada?.[lang] ?? (cartao ? nomeDaCasa(cartao, lang) : null);
    m.set(`${id}|${lang}`, n);
  }
  return m;
};

for (const e of FAMILIAS_R4) {
  const ids = [];
  for (const k of e.chaves) {
    if (usadas.has(k)) falha(`a família «${k}» aparece em duas entradas`);
    usadas.add(k);
    const ls = linhasDe.get(k);
    if (!ls?.length) { falha(`a família «${k}» não tem linha nenhuma`); continue; }
    ids.push(...ls);
  }
  const nomes = nomesDe(ids, e.nome, e.cartao);
  for (const [k, v] of nomes) if (!v) falha(`a linha «${k.split('|')[0]}» não tem nome do projeto, e a família não declara nome (${k.split('|')[1]})`);
  for (const lang of ['pt', 'en']) if (e.nome && /\d/.test(e.nome[lang])) falha(`o nome de «${e.chaves[0]}» traz um algarismo`);
  if (e.cartao) {
    if (!Object.prototype.hasOwnProperty.call(LEITURAS_DAS_MEDIDAS, e.cartao)) falha(`«${e.chaves.join(', ')}»: o cartão «${e.cartao}» não tem leitura`);
    for (const k of e.chaves) declaracao[k] = { cartao: e.cartao, ...(e.nome ? { nome: e.nome } : {}) };
    auditoria.push({ chaves: e.chaves, cartao: e.cartao, ...(e.nome ? { nome: e.nome } : {}) });
    classes.fonte.push(...e.chaves);
    continue;
  }
  const r = confereEntrada(e, ids, e.chaves.join(', '), nomes);
  const pt = e.partes.map((p) => texto(p.pt)).join('');
  const en = e.partes.map((p) => texto(p.en)).join('');
  for (const k of e.chaves) declaracao[k] = { ...(e.nome ? { nome: e.nome } : {}), frase: { pt: [pt], en: [en] } };
  const por = linhasPorConfirmar(e, ids, nomes);
  porConfirmar.push(...por);
  const pc = porConfirmarDaEntrada(ids, por);
  auditoria.push({ chaves: e.chaves, ...(e.nome ? { nome: e.nome } : {}), origens: r.origens, ...(pc ? { por_confirmar_na_fonte: pc } : {}), folhas: [{ pt, en, partes: e.partes }] });
  (r.fonte ? classes.fonte : classes.casa).push(...e.chaves);
}
for (const k of linhasDe.keys()) if (!k.startsWith('concelho:') && !usadas.has(k)) falha(`a família «${k}» (${linhasDe.get(k).length} linha(s)) não tem entrada na especificação`);

/* ------------------------------------------------------------------ as medidas dos concelhos */
const usadasConcelho = new Set();
for (const e of FAMILIAS_DOS_CONCELHOS_R4) {
  const k = `concelho:${e.concelho}`;
  usadasConcelho.add(e.concelho);
  const ids = linhasDe.get(k) ?? [];
  if (!ids.length) falha(`a medida dos concelhos «${e.concelho}» não tem linhas`);
  const medida = MEDIDAS_DO_CONCELHO.find((m) => m.chave === e.concelho);
  const nomeDaMedidaDoConcelho = medida ? medida.nome : e.nome;
  const nomes = nomesDe(ids, nomeDaMedidaDoConcelho, null);
  const r = confereEntrada(e, ids, k, nomes);
  const pt = e.partes.map((p) => texto(p.pt)).join('');
  const en = e.partes.map((p) => texto(p.en)).join('');
  if (medida) {
    if (texto(medida.nota.pt) !== pt) falha(`${k} · pt: as partes não dão a nota da medida:\n    «${pt}»\n    «${texto(medida.nota.pt)}»`);
    if (texto(medida.nota.en) !== en) falha(`${k} · en: as partes não dão a nota da medida:\n    «${en}»\n    «${texto(medida.nota.en)}»`);
    if (e.nome) falha(`${k}: uma medida com cartão tem o nome do cartão, e a entrada não declara outro`);
  } else {
    if (!e.nome) falha(`${k}: a família nova tem de declarar nome`);
    const enPedacos = e.partes.flatMap((p) => (Array.isArray(p.en) ? p.en : [p.en]));
    doConcelho[e.concelho] = { nome: e.nome, frase: { pt: [pt], en: enPedacos.reduce((acc, x) => (typeof x === 'string' && typeof acc[acc.length - 1] === 'string' ? (acc[acc.length - 1] += x, acc) : (acc.push(x), acc)), []) } };
  }
  const por = linhasPorConfirmar(e, ids, nomes);
  porConfirmar.push(...por);
  const pc = porConfirmarDaEntrada(ids, por);
  auditoria.push({ concelho: e.concelho, ...(e.nome ? { nome: e.nome } : {}), origens: r.origens, ...(pc ? { por_confirmar_na_fonte: pc } : {}), folhas: [{ pt, en, partes: e.partes }] });
  (r.fonte ? classes.fonte : classes.casa).push(k);
}
for (const k of linhasDe.keys()) if (k.startsWith('concelho:') && !usadasConcelho.has(k.slice(9))) falha(`a medida dos concelhos «${k}» não tem entrada`);

/* ------------------------------------------------------------------ as metades «o que é» dos cartões, contra as linhas da família */
const AUD = JSON.parse(fs.readFileSync(AUDITORIA, 'utf8'));
const porMedida = new Map(AUD.medidas.map((m) => [m.id, m]));
for (const e of FAMILIAS_R4.filter((x) => x.cartao)) {
  const d = LEITURAS_DAS_MEDIDAS[e.cartao];
  const corte = corteDaLeitura(d.pt);
  const folhas = folhasDaLeitura(d.pt.slice(0, corte), d.en.slice(0, corte));
  const m = porMedida.get(e.cartao);
  const entradaDe = (f) => (m.folhas ?? []).find((x) => x.pt === f.pt && x.en === f.en) ?? AUD.comuns.find((x) => x.pt === f.pt && x.en === f.en);
  const ids = e.chaves.flatMap((k) => linhasDe.get(k) ?? []);
  for (const f of folhas) {
    if (f.nl !== undefined) continue;
    const en = entradaDe(f);
    if (!en) { falha(`${e.chaves}: a folha «${f.pt}» do cartão não tem auditoria`); continue; }
    for (const p of en.partes) for (const a of p.apoios ?? []) if (a.linha === 'propria') {
      const er = verifica(a, ids, new Map());
      if (er) falha(`${e.chaves} (cartão ${e.cartao}): ${er}`);
    }
  }
  for (const a of m.algarismos ?? []) for (const ap of a.apoios ?? []) if (ap.linha === 'propria') {
    const er = verifica(ap, ids, new Map());
    if (er) falha(`${e.chaves} (cartão ${e.cartao}), o algarismo ${a.nl}: ${er}`);
  }
}

if (erros.length) {
  console.error(`compor-familias-r4: ${erros.length} defeito(s):\n  ${erros.join('\n  ')}`);
  process.exit(1);
}

/* ------------------------------------------------------------------ escrever */
const nLinhas = [...linhasDe.values()].reduce((a, v) => a + v.length, 0);
console.log(`entradas ${FAMILIAS_R4.length + FAMILIAS_DOS_CONCELHOS_R4.length} · famílias nacionais ${Object.keys(declaracao).length} · medidas dos concelhos ${FAMILIAS_DOS_CONCELHOS_R4.length} · linhas sem cartão ${nLinhas}`);
console.log(`com todas as partes apoiadas na fonte ${classes.fonte.length} · com alguma parte só da casa ${classes.casa.length}: ${classes.casa.join(', ')}`);
console.log(`por confirmar na fonte: ${auditoria.filter((x) => x.por_confirmar_na_fonte).length} entradas, ${porConfirmar.length} linhas`);
if (SECO) process.exit(0);

const ordenado = Object.fromEntries(Object.keys(declaracao).sort().map((k) => [k, declaracao[k]]));
const cabeca = `/**
 * O QUE É CADA NÚMERO · as frases das famílias (bloco R4, 05.10.2026, o ponto 2 do brief
 * \`design/observatorio/BRIEF-R4-as-palavras-correntes-em-cada-numero.md\`).
 *
 * GERADO por \`design/especime-v3/medicoes/r4-2026-10-05/compor-familias-r4.mjs\` a partir da especificação
 * \`familias-r4.mjs\`, na mesma pasta, onde cada frase se escreve parte a parte com o apoio de cada parte. Não se edita
 * à mão: muda-se a especificação e corre-se o compositor, que reescreve este ficheiro e a auditoria
 * (\`tests/cartao/leituras-provadas.json\`, chave \`familias\`), que a K17 do \`check:cartao\` confere.
 *
 * \`FAMILIAS_DAS_LINHAS\`: por família (o identificador da linha sem o período no fim), a frase nas duas edições, ou o
 * cartão cuja metade «o que é» a família lê contra a própria linha, e o nome da família para as linhas sem nome do
 * projeto. \`FAMILIAS_DOS_CONCELHOS\`: as medidas dos concelhos sem cartão (o limite da dívida); as outras leem a nota
 * da medida em \`src/data/concelhos.mjs\`.
 */
`;
const notaPorConfirmar = `
/**
 * AS LINHAS CUJA FRASE ESTÁ POR CONFIRMAR NA FONTE (passagem R4-b, 06.10.2026): uma parte da frase que nem a fonte nem a
 * conta declarada de uma linha calculada dizem (só o nome do projeto, a ressalva da casa ou a explicação de um termo). O
 * recibo dessas linhas leva o marcador da casa ao pé da frase; a K17 refaz a lista pela auditoria e confere o marcador.
 */
`;
fs.writeFileSync(DECLARACAO, `${cabeca}export const FAMILIAS_DAS_LINHAS = ${JSON.stringify(ordenado, null, 2)};\n\nexport const FAMILIAS_DOS_CONCELHOS = ${JSON.stringify(doConcelho, null, 2)};\n${notaPorConfirmar}export const LINHAS_POR_CONFIRMAR_NA_FONTE = ${JSON.stringify([...new Set(porConfirmar)].sort(), null, 2)};\n`);

const leitura = {
  quem: 'Claude Opus 5.5',
  quando: '2026-10-05',
  o_que: 'o bloco R4: as frases «o que é» das famílias das linhas sem cartão nacional (as do ano anterior e da União das medidas com cartão leem a frase do cartão contra a própria linha; as outras têm frase própria), e as partes das oito notas das medidas dos concelhos e da frase nova do limite da dívida, cada parte com o literal que a apoia nas linhas da família, numa origem declarada, num termo explicado em TERMOS_DOS_CARTOES ou, onde a fonte não diz o que a medida é, no nome do projeto',
};
AUD.leituras = [...AUD.leituras.filter((l) => !(l.quando === leitura.quando && l.o_que.startsWith('o bloco R4'))), leitura];
AUD.familias = auditoria;
fs.writeFileSync(AUDITORIA, `${JSON.stringify(AUD, null, 2)}\n`);
console.log(`escrito: ${path.relative(RAIZ, DECLARACAO)} e a chave familias de ${path.relative(RAIZ, AUDITORIA)}`);
