/**
 * ===========================================================================
 * A LEITURA DA SEMANA · o resolvedor (bloco EX1, 05.10.2026, o ponto 2 do mandato)
 * ===========================================================================
 *
 * O QUE FAZ: lê, em cada construção, as entradas datadas das linhas do livro-razão (as `corrections` e as
 * `verifications`) dos sete dias que acabam no dia da construção, e devolve o que a página da leitura da
 * semana diz: a janela, as três contagens, uma mudança por linha cujo valor mudou, e as frases da primeira
 * página que mudaram de ramo por causa disso. Nada se escreve à mão: as palavras fixas são cadeias da casa
 * (`strings.mjs`, a chave `semana`), os números são campos do livro e as escolhas são contas.
 *
 * O DIA DA CONSTRUÇÃO é o dia UTC em que a página se rende (`OEDP_DIA_DA_CONSTRUCAO` à frente, para as
 * plantas e os ensaios). O carimbo `construido_em` de `dist/version.json` escreve-se logo a seguir ao
 * `astro build`; o portão de HTML e a célula da semana leem a janela que a página declara
 * (`data-semana-janela`) e exigem que acabe no dia desse carimbo, ou no dia anterior quando o carimbo cai
 * na primeira meia hora do dia (uma construção que passou a meia-noite UTC entre a página e o carimbo).
 *
 * O ÂMBITO SÃO OS NÚMEROS DO PAÍS. As contagens do próprio projeto (o estudo `o-estado-do-pais`: as
 * correções publicadas, os estudos e as edições do arquivo) ficam fora, porque a leitura não fala da casa
 * (o ponto 2 do mandato do brief); e a linha que a casa declara a mesma medida de outra
 * (`MEDIDA_REUNIDA`, `src/lib/pais.mjs`) entra pela que fica, como no índice: duas frases iguais para o
 * mesmo número diriam duas vezes a mesma coisa.
 *
 *   · RELIDAS: as linhas do âmbito com pelo menos uma entrada em `verifications` dentro da janela;
 *   · MUDARAM DE VALOR: as linhas do âmbito com entradas `correcao` ou `atualizacao` em que o NÚMERO mudou, do
 *     valor antes da primeira ao valor depois da última (EX1-c, 06.10.2026, o achado 5 da leitura a frio: uma
 *     mudança de valor é uma mudança do número);
 *   · MUDARAM SÓ NA FORMA DE ESCREVER (EX1-c): as linhas do âmbito com entradas dessas em que o número ficou o mesmo
 *     e o literal mudou (a fonte passou a escrever «3,0» onde escrevia «3»); contam-se à parte e dizem-se pelo que
 *     são, numa secção própria da página, e a primeira frase só as nomeia quando há alguma;
 *   · MUDARAM DE PROVENIÊNCIA: as linhas do âmbito com pelo menos uma entrada `proveniencia`.
 *
 * Uma linha cujas entradas da semana voltam ao número e ao literal de antes não mudou nada, e não se conta.
 *
 * UMA LINHA, UMA FRASE. Uma linha cujo valor mudou duas vezes na semana diz-se numa frase só, do valor
 * antes da primeira mudança ao valor depois da última, cada um com a marca da sua entrada; duas frases
 * davam duas portas para o mesmo recibo na mesma página, que é o que a L1 do `check:lugar` conta. A
 * palavra do lado («subiu», «desceu», «não mudou») é a conta dos dois números (`parsePtNumber`).
 *
 * AS FRASES DA PRIMEIRA PÁGINA: um bloco de «O que se passa» cujas linhas mudaram de valor na semana é
 * avaliado duas vezes, com os valores de antes da semana e com os de agora: se se mostra e que ramo cada
 * comparação escolhe. Um bloco cuja assinatura mudou diz-se, com a frase que mostra agora (ou com a
 * palavra de que saiu); quando nenhum mudou, a leitura diz que nenhum mudou.
 */

import { allClaims, getClaim, hasClaim, parsePtNumber } from './ledger.mjs';
import { MEDIDA_REUNIDA } from './pais.mjs';
import { nomeDaLinhaDerivada, nomeDoCartao } from './nomes.mjs';
import { BLOCOS_DA_PRIMEIRA_PAGINA } from '../data/primeira-pagina.mjs';
import { limiarDaLinha, nomeNaLista } from './primeira-pagina.mjs';

/** O estudo das contagens do próprio projeto, fora do âmbito da leitura. */
export const ESTUDO_DO_PROJETO = 'o-estado-do-pais';
/** As naturezas de entrada que mudam um valor. */
export const NATUREZAS_DE_VALOR = /** @type {const} */ (['correcao', 'atualizacao']);
/** Quantos dias tem a janela, contando o dia da construção. */
export const DIAS_DA_JANELA = 7;

const DIA = /^\d{4}-\d{2}-\d{2}$/;

/** O dia da construção, AAAA-MM-DD em UTC. */
export function diaDaConstrucao() {
  const posto = process.env.OEDP_DIA_DA_CONSTRUCAO;
  if (posto !== undefined && posto !== '') {
    if (!DIA.test(posto)) throw new Error(`leitura da semana: OEDP_DIA_DA_CONSTRUCAO="${posto}" não é AAAA-MM-DD.`);
    return posto;
  }
  return new Date().toISOString().slice(0, 10);
}

/** A janela dos sete dias que acabam no dia `fim`. @param {string} fim */
export function janelaQueAcabaEm(fim) {
  if (!DIA.test(fim)) throw new Error(`leitura da semana: o dia «${fim}» não é AAAA-MM-DD.`);
  const d = new Date(`${fim}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - (DIAS_DA_JANELA - 1));
  return { inicio: d.toISOString().slice(0, 10), fim };
}

/** Se uma linha está no âmbito da leitura. @param {any} l */
export function linhaDoAmbito(l) {
  return l && l.study !== ESTUDO_DO_PROJETO && !Object.hasOwn(MEDIDA_REUNIDA, String(l.id));
}

/**
 * @typedef {{ n: number, valor: string, data: string }} PontaDaMudanca
 * @typedef {{ linha: string, antes: PontaDaMudanca, depois: PontaDaMudanca, palavra: 'subiu'|'desceu'|'naoMudou', entradas: number[] }} MudancaDaSemana
 * @typedef {{ linha: string, antes: PontaDaMudanca, depois: PontaDaMudanca, entradas: number[] }} FormaDaSemana
 * @typedef {{ bloco: string, mostraAntes: boolean, mostraAgora: boolean, mudou: boolean }} FraseDaPrimeira
 */

/**
 * A LEITURA DA SEMANA.
 * @param {{ fim?: string, linhas?: Iterable<any> }} [opcoes]
 */
export function leituraDaSemana({ fim = diaDaConstrucao(), linhas = allClaims() } = {}) {
  const janela = janelaQueAcabaEm(fim);
  const dentro = (/** @type {unknown} */ d) => typeof d === 'string' && d >= janela.inicio && d <= janela.fim;
  let relidas = 0;
  /** @type {Set<string>} */
  const deValor = new Set();
  /** @type {Set<string>} */
  const deProveniencia = new Set();
  /** @type {MudancaDaSemana[]} */
  const mudancas = [];
  /** @type {FormaDaSemana[]} */
  const formas = [];
  /** @type {Map<string, number>} */
  const valoresAntes = new Map();
  for (const l of linhas) {
    if (!linhaDoAmbito(l)) continue;
    if ((l.verifications ?? []).some((/** @type {any} */ v) => dentro(v?.date))) relidas++;
    const entradas = (l.corrections ?? []).map((/** @type {any} */ c, /** @type {number} */ n) => ({ ...c, n })).filter((/** @type {any} */ c) => dentro(c.date));
    if (entradas.some((/** @type {any} */ c) => c.kind === 'proveniencia')) deProveniencia.add(String(l.id));
    const deValorAqui = entradas.filter((/** @type {any} */ c) => NATUREZAS_DE_VALOR.includes(c.kind))
      .sort((/** @type {any} */ a, /** @type {any} */ b) => a.date.localeCompare(b.date) || a.n - b.n);
    if (!deValorAqui.length) continue;
    const primeira = deValorAqui[0];
    const ultima = deValorAqui[deValorAqui.length - 1];
    const a = parsePtNumber(primeira.old_value);
    const b = parsePtNumber(ultima.new_value);
    if (a === null || b === null) throw new Error(`leitura da semana: a linha «${l.id}» mudou e um dos valores (${primeira.old_value}, ${ultima.new_value}) não se lê como número.`);
    /* O mesmo número: uma mudança só do literal, que se conta à parte, ou nenhuma mudança (EX1-c). */
    if (a === b) {
      if (String(primeira.old_value) !== String(ultima.new_value)) {
        formas.push({
          linha: String(l.id),
          antes: { n: primeira.n, valor: String(primeira.old_value), data: primeira.date },
          depois: { n: ultima.n, valor: String(ultima.new_value), data: ultima.date },
          entradas: deValorAqui.map((/** @type {any} */ c) => c.n),
        });
      }
      continue;
    }
    deValor.add(String(l.id));
    valoresAntes.set(String(l.id), a);
    mudancas.push({
      linha: String(l.id),
      antes: { n: primeira.n, valor: String(primeira.old_value), data: primeira.date },
      depois: { n: ultima.n, valor: String(ultima.new_value), data: ultima.date },
      palavra: b > a ? 'subiu' : b < a ? 'desceu' : 'naoMudou',
      entradas: deValorAqui.map((/** @type {any} */ c) => c.n),
    });
  }
  mudancas.sort((x, y) => y.depois.data.localeCompare(x.depois.data) || x.linha.localeCompare(y.linha));
  formas.sort((x, y) => y.depois.data.localeCompare(x.depois.data) || x.linha.localeCompare(y.linha));
  return {
    janela,
    contagens: { relidas, valor: deValor.size, forma: formas.length, proveniencia: deProveniencia.size },
    mudancas,
    formas,
    primeira: frasesDaPrimeiraQueMudaram(valoresAntes),
  };
}

/* ------------------------------------------------- as frases da primeira página */

/** As chaves de uma declaração de bloco que nomeiam linhas. */
const CHAVES_DE_LINHA = new Set(['claim', 'periodo', 'publicado', 'referencia', 'compara', 'mesmo_periodo', 'a', 'b', 'linhas', 'total', 'pt', 'ue', 'colunas']);

/** As linhas que uma declaração de bloco nomeia, em qualquer sítio dela. @param {unknown} x @param {Set<string>} [out] */
export function linhasDoBloco(x, out = new Set()) {
  if (Array.isArray(x)) for (const y of x) linhasDoBloco(y, out);
  else if (x && typeof x === 'object') {
    for (const [k, v] of Object.entries(x)) {
      if (CHAVES_DE_LINHA.has(k)) for (const id of [v].flat()) if (typeof id === 'string' && hasClaim(id)) out.add(id);
      linhasDoBloco(v, out);
    }
  }
  return out;
}

/**
 * Uma condição de um bloco, avaliada com um valor por linha (os de agora, ou os de antes da semana).
 * @param {any} c @param {(id: string) => number|null} valor
 */
function condicaoCom(c, valor) {
  if (Array.isArray(c?.mesmo_periodo)) return new Set(c.mesmo_periodo.map((/** @type {string} */ id) => hasClaim(id) ? getClaim(id).reference_date : null)).size === 1 && c.mesmo_periodo.every((/** @type {string} */ id) => hasClaim(id));
  if (typeof c?.periodo === 'string' && typeof c?.mes === 'number') {
    const m = hasClaim(c.periodo) ? /^\d{4}-(\d{2})$/.exec(String(getClaim(c.periodo).reference_date ?? '')) : null;
    return Boolean(m) && Number(m?.[1]) === c.mes;
  }
  if (typeof c?.a === 'string' && typeof c?.op === 'string') {
    const a = valor(c.a);
    const b = typeof c.b === 'string' ? valor(c.b) : typeof c.valor === 'number' ? c.valor : typeof c.referencia === 'string' ? (limiarDaLinha(c.referencia)?.numero ?? null) : null;
    if (a === null || b === null) return false;
    return c.op === '>' ? a > b : c.op === '<' ? a < b : c.op === '=' ? a === b : c.op === '!=' ? a !== b : false;
  }
  return false;
}

/** Os ramos que as comparações de uma parte escolhem, pela ordem em que aparecem. @param {unknown} x @param {(id: string) => number|null} valor @param {string[]} out */
function ramosCom(x, valor, out) {
  if (Array.isArray(x)) for (const y of x) ramosCom(y, valor, out);
  else if (x && typeof x === 'object') {
    const o = /** @type {any} */ (x);
    if (Array.isArray(o.compara) && o.compara.length === 2) {
      const [a, b] = o.compara.map(valor);
      const ramo = a === null || b === null ? 'sem-valor' : a < b ? 'menor' : a > b ? 'maior' : 'igual';
      out.push(ramo);
      if (ramo in o) ramosCom(o[ramo], valor, out);
      return;
    }
    for (const v of Object.values(o)) ramosCom(v, valor, out);
  }
}

/** A assinatura de um bloco com um valor por linha: se se mostra, as peças que se mostram e os ramos. @param {any} b @param {(id: string) => number|null} valor */
function assinaturaDoBloco(b, valor) {
  const mostra = (b.condicao ?? []).every((/** @type {any} */ c) => condicaoCom(c, valor));
  /** @type {string[]} */
  const ramos = [];
  ramosCom(b.frase?.pt, valor, ramos);
  const pecas = (b.pecas ?? []).map((/** @type {any} */ p) => {
    /** @type {string[]} */
    const r = [];
    ramosCom(p.pt, valor, r);
    return { id: p.id, mostra: (p.condicao ?? []).every((/** @type {any} */ c) => condicaoCom(c, valor)), ramos: r };
  });
  return { mostra, texto: JSON.stringify({ mostra, ramos, pecas }) };
}

/**
 * Os blocos da primeira página cujas linhas mudaram de valor na semana, com a assinatura de antes e a de agora.
 * @param {Map<string, number>} valoresAntes o valor de cada linha que mudou, antes da primeira mudança da semana
 * @returns {FraseDaPrimeira[]}
 */
export function frasesDaPrimeiraQueMudaram(valoresAntes) {
  const agora = (/** @type {string} */ id) => (hasClaim(id) ? parsePtNumber(getClaim(id).value) : null);
  const antes = (/** @type {string} */ id) => (valoresAntes.has(id) ? /** @type {number} */ (valoresAntes.get(id)) : agora(id));
  /** @type {FraseDaPrimeira[]} */
  const out = [];
  for (const b of BLOCOS_DA_PRIMEIRA_PAGINA) {
    const linhas = linhasDoBloco(b);
    if (![...linhas].some((id) => valoresAntes.has(id))) continue;
    const a = assinaturaDoBloco(b, antes);
    const d = assinaturaDoBloco(b, agora);
    out.push({ bloco: b.id, mostraAntes: a.mostra, mostraAgora: d.mostra, mudou: a.texto !== d.texto });
  }
  return out;
}

/** O nome de uma linha na leitura da semana: o da escada do cartão, com o nome declarado da linha derivada à frente. @param {string} id @param {'pt'|'en'} lang */
export function nomeNaSemana(id, lang) {
  const l = getClaim(nomeNaLista(id, lang).linha);
  return nomeDaLinhaDerivada(l, lang) ?? nomeDoCartao(l, lang);
}

/**
 * @typedef {string | { semana: 'inicio'|'fim'|'relidas'|'valor'|'forma'|'proveniencia', texto: string }} PedacoDaSemana
 */

/**
 * A PRIMEIRA FRASE DA LEITURA: a janela e as três contagens, pelas cadeias da casa (`strings.mjs`, `semana`).
 * As palavras de cada contagem escolhem-se pelo número (nenhum, um, vários); quando nada mudou de valor nem de
 * proveniência, a frase di-lo, com a contagem das releituras. Cada número e cada data é um pedaço marcado, que o
 * portão de HTML reconta por conta própria (`scripts/semana-do-portao.mjs`).
 * @param {ReturnType<typeof leituraDaSemana>} leitura @param {Record<string, string>} s as cadeias `semana` da edição
 * @param {(iso: string) => string} data a forma da casa de um dia
 * @param {(n: number) => string} contagem a forma da casa de uma contagem
 * @returns {PedacoDaSemana[]}
 */
export function primeiraFraseDaSemana(leitura, s, data, contagem) {
  const { relidas, valor, proveniencia } = leitura.contagens;
  const forma = leitura.contagens.forma ?? 0;
  /** @type {PedacoDaSemana[]} */
  const p = [s.entre, { semana: 'inicio', texto: data(leitura.janela.inicio) }, s.e, { semana: 'fim', texto: data(leitura.janela.fim) }, s.virgula];
  if (relidas === 0) p.push(s.nenhumRelido);
  else p.push({ semana: 'relidas', texto: contagem(relidas) }, relidas === 1 ? s.umRelido : s.variosRelidos);
  if (valor === 0 && proveniencia === 0 && forma === 0) p.push(s.nenhumMudou);
  else {
    p.push(s.virgula);
    if (valor === 0) p.push(s.nenhumDeValor);
    else p.push({ semana: 'valor', texto: contagem(valor) }, valor === 1 ? s.umDeValor : s.variosDeValor);
    /* As que mudaram só na forma de escrever (EX1-c) só se nomeiam quando há alguma. */
    if (forma > 0) p.push(s.virgula, { semana: 'forma', texto: contagem(forma) }, forma === 1 ? s.umDeForma : s.variosDeForma);
    p.push(s.e);
    if (proveniencia === 0) p.push(s.nenhumDeProveniencia);
    else p.push({ semana: 'proveniencia', texto: contagem(proveniencia) }, proveniencia === 1 ? s.umDeProveniencia : s.variosDeProveniencia);
  }
  p.push(s.ponto);
  /* Os pedaços de texto seguidos juntam-se num só. */
  /** @type {PedacoDaSemana[]} */
  const juntos = [];
  for (const x of p) {
    const ultimo = juntos[juntos.length - 1];
    if (typeof x === 'string' && typeof ultimo === 'string') juntos[juntos.length - 1] = ultimo + x;
    else juntos.push(x);
  }
  return juntos;
}

/** A identidade da medida conserva o lugar; anos consecutivos partilham a definição.
 * @param {string} id @param {'pt'|'en'} lang */
export function medidaNaSemana(id, lang) {
  const nome = nomeNaLista(id, lang);
  return `${nome.linha}/${nome.qualificador ?? ''}`;
}

/** Os identificadores do grupo só se devolvem na última linha consecutiva.
 * @param {string[]} ids @param {number} i @param {'pt'|'en'} lang */
export function grupoQueFecha(ids, i, lang) {
  const chave = medidaNaSemana(ids[i], lang);
  if (i + 1 < ids.length && medidaNaSemana(ids[i + 1], lang) === chave) return [];
  let inicio = i;
  while (inicio > 0 && medidaNaSemana(ids[inicio - 1], lang) === chave) inicio--;
  return ids.slice(inicio, i + 1);
}
