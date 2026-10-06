/**
 * ===========================================================================
 * O QUE É CADA NÚMERO · o resolvedor (bloco R4, 05.10.2026, os pontos 1 e 2 do brief
 * `design/observatorio/BRIEF-R4-as-palavras-correntes-em-cada-numero.md`)
 * ===========================================================================
 *
 * O recibo de cada linha do livro-razão abre com o nome que o projeto dá à medida, o nome com que a fonte a publica
 * e uma frase em português corrente que diz o que o número é. A frase é uma por medida (a decisão 1 do brief: «a casa
 * não tem duas explicações para o mesmo número»), e por isso este módulo não escreve frase nenhuma: diz, para cada
 * linha, DE ONDE a frase vem.
 *
 *   · UMA LINHA COM CARTÃO NACIONAL (as chaves de `LEITURAS_DAS_MEDIDAS`): a metade «o que é» da leitura do cartão,
 *     a mesma que a dobra do cartão mostra, pelo resolvedor das leituras (`partesDaLeitura()`).
 *   · UMA LINHA DE UMA MEDIDA DOS CONCELHOS: a nota da medida em `MEDIDAS_DO_CONCELHO`, a mesma frase que a dobra do
 *     cartão do concelho mostra (a decisão 2: a população de Abrantes e a de Viseu são a mesma medida), e para o limite
 *     da dívida, que não tem cartão, a frase declarada em `FAMILIAS_DOS_CONCELHOS`. A família lê-se do que cada
 *     concelho declara no seu relance e na sua distância (`MUNICIPIOS_COM_PAGINA`), e não de um sufixo do identificador:
 *     o sufixo juntava ao concelho vinte e cinco linhas do Orçamento do Estado que acabam em «administracao-central».
 *   · QUALQUER OUTRA LINHA: a família do identificador sem o período no fim (o ano, ou o ano e o mês), com o «-ue» de
 *     uma linha da União guardado, porque o nome e a frase de uma linha da União dizem o lugar; a família declara-se
 *     em `FAMILIAS_DAS_LINHAS`, com a sua frase, ou com o cartão cuja metade «o que é» lê contra a própria linha (o
 *     ano anterior de uma medida com cartão diz o seu próprio valor, período e sinal).
 *
 * NENHUMA LINHA FICA SEM FRASE NEM SEM NOME, e uma declaração que nenhuma linha usa também fecha a construção: as
 * duas guardas correm quando o módulo carrega, sobre o livro-razão inteiro. Quem confere as palavras não é este
 * módulo: é a K17 do `check:cartao` (`tests/cartao/leituras.mjs`), sobre a auditoria `tests/cartao/leituras-provadas.json`,
 * e o portão de HTML conta a frase em cada recibo.
 *
 * NENHUM ALGARISMO NAS FRASES DAS FAMÍLIAS: uma palavra fixa com um algarismo fecha a construção. As frases dos
 * cartões trazem os seus, cada um com o literal na auditoria da K17.
 */

import { LEITURAS_DAS_MEDIDAS } from '../data/leituras-das-medidas.mjs';
import { FAMILIAS_DAS_LINHAS, FAMILIAS_DOS_CONCELHOS, LINHAS_POR_CONFIRMAR_NA_FONTE } from '../data/o-que-e-das-familias.mjs';
import { MEDIDAS_DO_CONCELHO } from '../data/concelhos.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../data/municipios.mjs';
import { partesDaLeitura, oQueEContraALinha, sinalDaLeitura } from './leitura-da-medida.mjs';
import { notaDaBandeira } from './bandeira-da-fonte.mjs';
import { nomeDaMedida, nomeDaLinhaDerivada } from './nomes.mjs';
import { getClaim, allClaims } from './ledger.mjs';
import { allSeries, getSerie, pontoDaSerie } from './series.mjs';
import { NOMES_DAS_SERIES } from '../data/series-no-tempo.mjs';
import { FRASES_DAS_SERIES, SERIES_POR_CONFIRMAR_NA_FONTE } from '../data/o-que-e-das-series.mjs';

/* AS FRASES POR CONFIRMAR NA FONTE (passagem R4-b, 06.10.2026, o achado 5 da leitura a frio). Uma frase com uma parte que
   nem a fonte nem a conta declarada de uma linha calculada dizem (só o nome do projeto, a ressalva da casa ou a explicação
   de um termo) leva no recibo o marcador da casa, `[a verificar]`. As listas são do compositor, pela auditoria das
   frases; a K17 do `check:cartao` refá-las por conta própria e confere que o marcador está onde elas dizem e em mais
   lado nenhum. */
const POR_CONFIRMAR = new Set(/** @type {readonly string[]} */ (LINHAS_POR_CONFIRMAR_NA_FONTE));
const SERIES_POR_CONFIRMAR = new Set(/** @type {readonly string[]} */ (SERIES_POR_CONFIRMAR_NA_FONTE));

/** @param {string} onde @param {string} razao */
function fecha(onde, razao) {
  return new Error(`o que é cada número · ${onde}: ${razao} Uma linha sem frase ou sem nome fecha a construção (bloco R4, pontos 1 e 2 do brief).`);
}

/** As chaves das medidas dos concelhos, pela ordem da declaração, e o limite, que é a nona família. */
export const CHAVES_DOS_CONCELHOS = [...MEDIDAS_DO_CONCELHO.map((m) => m.chave), 'limite'];

/**
 * A linha de cada medida de cada concelho, pelo que o concelho declara: o relance (as oito medidas) e a distância (o
 * limite da dívida). Uma linha declarada por dois concelhos, ou por duas medidas, fecha a construção.
 * @type {Map<string, { chave: string, slug: string, nome: { pt: string, en: string } }>}
 */
const DO_CONCELHO = new Map();
for (const m of MUNICIPIOS_COM_PAGINA) {
  const poe = (/** @type {string} */ claim, /** @type {string} */ chave) => {
    const ja = DO_CONCELHO.get(claim);
    if (ja && (ja.slug !== m.slug || ja.chave !== chave)) {
      throw fecha(claim, `a linha é declarada por «${ja.slug}» (${ja.chave}) e por «${m.slug}» (${chave}).`);
    }
    DO_CONCELHO.set(claim, { chave, slug: m.slug, nome: m.nome });
  };
  for (const p of m.relance ?? []) if (p.claim) poe(p.claim, p.chave);
  if (m.distancia?.limite) poe(m.distancia.limite, 'limite');
}

/**
 * O identificador sem o período no fim: o ano, ou o ano e o mês, antes do fim ou de um «-ue» final, que fica.
 * @param {string} id
 */
export function semPeriodo(id) {
  return id.replace(/-\d{4}(-\d{2})?(?=(-ue)?$)/, '');
}

/**
 * A família de uma linha.
 * @param {string} id
 * @returns {{ tipo: 'cartao', chave: string } | { tipo: 'concelho', chave: string, concelho: { slug: string, nome: { pt: string, en: string } } } | { tipo: 'familia', chave: string }}
 */
export function familiaDaLinha(id) {
  if (Object.prototype.hasOwnProperty.call(LEITURAS_DAS_MEDIDAS, id)) return { tipo: 'cartao', chave: id };
  const c = DO_CONCELHO.get(id);
  if (c) return { tipo: 'concelho', chave: c.chave, concelho: { slug: c.slug, nome: c.nome } };
  return { tipo: 'familia', chave: semPeriodo(id) };
}

/** @param {string} chave */
function medidaDoConcelho(chave) {
  const m = MEDIDAS_DO_CONCELHO.find((x) => x.chave === chave);
  if (m) return { nome: m.nome, frase: m.nota };
  const extra = /** @type {Record<string, any>} */ (FAMILIAS_DOS_CONCELHOS)[chave];
  if (extra) return { nome: extra.nome, frase: extra.frase };
  return null;
}

/**
 * A frase «o que é» de uma linha, com a sua origem, a parte do sinal quando a frase lê a metade «o que é» de um cartão
 * contra outra linha e o sinal vive na metade que compara (R4-b), e se a frase está por confirmar na fonte (R4-b).
 *
 * @param {string} id @param {'pt'|'en'} lang
 * @returns {{ pedacos: any[], tipo: 'cartao'|'concelho'|'familia', chave: string, cartao: string|null, sinal: string[] | null, porConfirmar: boolean }}
 */
export function oQueEDaLinha(id, lang) {
  const f = familiaDaLinha(id);
  const porConfirmar = POR_CONFIRMAR.has(id);
  if (f.tipo === 'cartao') {
    const p = partesDaLeitura(id, lang).oQueE;
    if (!p) throw fecha(`${id} · ${lang}`, 'a leitura do cartão não tem metade «o que é».');
    return { pedacos: p.pedacos, tipo: 'cartao', chave: id, cartao: id, sinal: null, porConfirmar };
  }
  if (f.tipo === 'concelho') {
    const m = medidaDoConcelho(f.chave);
    const frase = m?.frase?.[lang];
    if (!Array.isArray(frase) || frase.length === 0) throw fecha(`${id} · ${lang}`, `a medida dos concelhos «${f.chave}» não declara frase nesta edição.`);
    return { pedacos: frase, tipo: 'concelho', chave: f.chave, cartao: null, sinal: null, porConfirmar };
  }
  const d = /** @type {Record<string, any>} */ (FAMILIAS_DAS_LINHAS)[f.chave];
  if (!d) throw fecha(`${id} · ${lang}`, `a família «${f.chave}» não está declarada em src/data/o-que-e-das-familias.mjs.`);
  if (d.cartao) {
    const sinal = sinalDaLeitura(d.cartao, lang, id);
    return { pedacos: oQueEContraALinha(d.cartao, lang, id).pedacos, tipo: 'familia', chave: f.chave, cartao: d.cartao, sinal: sinal ? sinal.pedacos : null, porConfirmar };
  }
  const frase = d.frase?.[lang];
  if (!Array.isArray(frase) || frase.length === 0) throw fecha(`${id} · ${lang}`, `a família «${f.chave}» não declara frase nesta edição.`);
  return { pedacos: frase, tipo: 'familia', chave: f.chave, cartao: null, sinal: null, porConfirmar };
}

/**
 * O nome no título do recibo: o nome do projeto, quando a linha o tem em algum degrau da escada dos nomes da casa
 * (o cartão da primeira página, o da medida do domínio, a tabela dos nomes do projeto, a das linhas derivadas), e o
 * nome da família quando não tem. Nunca o nome da fonte: esse vai por baixo, entre aspas, na língua dela.
 *
 * @param {string} id @param {'pt'|'en'} lang
 * @returns {{ texto: string, fonte: 'figuras'|'medidas'|'projeto'|'familia', familia: string|null }}
 */
export function nomeNoRecibo(id, lang) {
  const c = getClaim(id);
  const n = nomeDaMedida(c, lang);
  if (n && (n.fonte === 'figuras' || n.fonte === 'medidas' || n.fonte === 'projeto')) return { texto: n.texto, fonte: n.fonte, familia: null };
  const d = nomeDaLinhaDerivada(c, lang);
  if (d) return { texto: d.texto, fonte: 'projeto', familia: null };
  const f = familiaDaLinha(id);
  if (f.tipo === 'concelho') {
    const m = medidaDoConcelho(f.chave);
    const texto = m?.nome?.[lang];
    if (typeof texto !== 'string' || !texto) throw fecha(`${id} · ${lang}`, `a medida dos concelhos «${f.chave}» não declara nome nesta edição.`);
    return { texto, fonte: 'familia', familia: `concelho:${f.chave}` };
  }
  if (f.tipo === 'familia') {
    const decl = /** @type {Record<string, any>} */ (FAMILIAS_DAS_LINHAS)[f.chave];
    const proprio = decl?.nome?.[lang];
    if (typeof proprio === 'string' && proprio) return { texto: proprio, fonte: 'familia', familia: f.chave };
    if (decl?.cartao) {
      const doCartao = nomeDaMedida(getClaim(decl.cartao), lang);
      if (doCartao?.fonte) return { texto: doCartao.texto, fonte: 'familia', familia: f.chave };
    }
  }
  throw fecha(`${id} · ${lang}`, `a linha não tem nome do projeto nem nome de família (família «${f.chave}»).`);
}

/**
 * O lugar que o título diz, quando o nome é o de uma família dos concelhos: a população de Abrantes diz «Abrantes»
 * depois do nome da medida, que é a mesma nos 308. Um nome do projeto já diz o lugar onde ele distingue.
 *
 * @param {string} id @param {'pt'|'en'} lang
 * @returns {{ slug: string, nome: string } | null}
 */
export function lugarNoRecibo(id, lang) {
  if (nomeNoRecibo(id, lang).fonte !== 'familia') return null;
  const f = familiaDaLinha(id);
  return f.tipo === 'concelho' ? { slug: f.concelho.slug, nome: f.concelho.nome[lang] ?? f.concelho.nome.pt } : null;
}

/**
 * O nome com que a fonte publica a medida, para o recibo: o título do documento ou da série, e, onde a linha não o
 * tem, o rótulo que a fonte imprime por cima da figura. Uma linha calculada não tem nem um nem outro.
 *
 * @param {string} id
 * @returns {{ campo: 'document.title'|'name', valor: string } | null}
 */
export function nomeDaFonteNoRecibo(id) {
  const c = /** @type {any} */ (getClaim(id));
  const util = (/** @type {unknown} */ v) => typeof v === 'string' && v.trim() !== '' && v !== '[a verificar]';
  if (util(c.document?.title)) return { campo: /** @type {const} */ ('document.title'), valor: /** @type {string} */ (c.document.title) };
  if (util(c.name)) return { campo: /** @type {const} */ ('name'), valor: /** @type {string} */ (c.name) };
  return null;
}

/**
 * OS ALGARISMOS E AS DECLARAÇÕES, conferidos quando o módulo carrega: nenhuma palavra fixa de uma família traz um
 * algarismo, cada família declarada tem frase ou cartão nas duas edições, e nenhuma fica sem linha. É a mesma lista
 * de erros que a K17 lê.
 *
 * @param {Record<string, any>} [familias] @param {Record<string, any>} [doConcelho]
 * @returns {string[]}
 */
export function errosDasFamilias(familias = FAMILIAS_DAS_LINHAS, doConcelho = FAMILIAS_DOS_CONCELHOS) {
  /** @type {string[]} */
  const erros = [];
  /** @param {unknown} parte @param {string} onde */
  const anda = (parte, onde) => {
    if (Array.isArray(parte)) return parte.forEach((p, i) => anda(p, `${onde}[${i}]`));
    if (typeof parte === 'string') {
      if (/\d/.test(parte)) erros.push(`${onde}: a palavra fixa «${parte}» traz um algarismo`);
      return;
    }
    const o = /** @type {Record<string, any>} */ (parte);
    if (o && typeof o === 'object' && typeof o.termo === 'string' && typeof o.lingua === 'string') {
      if (/\d/.test(o.termo)) erros.push(`${onde}: o termo «${o.termo}» traz um algarismo`);
      return;
    }
    erros.push(`${onde}: um pedaço que não é texto nem um termo de outra língua (uma frase de família não cita números)`);
  };
  for (const [chave, d] of Object.entries(familias)) {
    if (d.cartao) {
      if (!Object.prototype.hasOwnProperty.call(LEITURAS_DAS_MEDIDAS, d.cartao)) erros.push(`${chave}: lê a frase do cartão «${d.cartao}», que não tem leitura declarada`);
      if (d.frase) erros.push(`${chave}: declara frase e cartão ao mesmo tempo`);
    } else {
      for (const lang of ['pt', 'en']) {
        if (!Array.isArray(d.frase?.[lang]) || d.frase[lang].length === 0) erros.push(`${chave} · ${lang}: a família não tem frase nesta edição`);
        else anda(d.frase[lang], `${chave} · ${lang}`);
      }
    }
    for (const lang of ['pt', 'en']) {
      if (d.nome !== undefined && (typeof d.nome?.[lang] !== 'string' || /\d/.test(d.nome[lang]))) erros.push(`${chave} · ${lang}: o nome da família falta ou traz um algarismo`);
    }
  }
  for (const [chave, d] of Object.entries(doConcelho)) {
    for (const lang of ['pt', 'en']) {
      if (typeof d.nome?.[lang] !== 'string' || /\d/.test(d.nome[lang])) erros.push(`concelho:${chave} · ${lang}: o nome falta ou traz um algarismo`);
      if (!Array.isArray(d.frase?.[lang]) || d.frase[lang].length === 0) erros.push(`concelho:${chave} · ${lang}: a frase falta`);
      else anda(d.frase[lang], `concelho:${chave} · ${lang}`);
    }
  }
  for (const m of MEDIDAS_DO_CONCELHO) for (const lang of ['pt', 'en']) anda(/** @type {Record<string, unknown>} */ (/** @type {unknown} */ (m.nota))?.[lang] ?? [], `concelho:${m.chave} · ${lang} (a nota da medida)`);
  return erros;
}

/**
 * AS LINHAS SEM FRASE, SEM NOME, E AS FAMÍLIAS SEM LINHA, sobre o livro-razão inteiro.
 * @param {Iterable<{ id: string }>} [linhas]
 * @returns {{ erros: string[], porTipo: Record<string, number>, familiasUsadas: Set<string> }}
 */
export function cobertura(linhas = allClaims()) {
  /** @type {string[]} */
  const erros = [];
  /** @type {Record<string, number>} */
  const porTipo = { cartao: 0, concelho: 0, familia: 0 };
  /** @type {Set<string>} */
  const usadas = new Set();
  for (const c of linhas) {
    for (const lang of /** @type {const} */ (['pt', 'en'])) {
      try {
        const o = oQueEDaLinha(c.id, lang);
        if (lang === 'pt') { porTipo[o.tipo]++; if (o.tipo === 'familia') usadas.add(o.chave); if (o.tipo === 'concelho') usadas.add(`concelho:${o.chave}`); }
        nomeNoRecibo(c.id, lang);
      } catch (e) {
        erros.push(e instanceof Error ? e.message : String(e));
      }
    }
  }
  for (const chave of Object.keys(FAMILIAS_DAS_LINHAS)) if (!usadas.has(chave)) erros.push(`a família «${chave}» está declarada e nenhuma linha do livro-razão a usa`);
  for (const chave of Object.keys(FAMILIAS_DOS_CONCELHOS)) if (!usadas.has(`concelho:${chave}`)) erros.push(`a família dos concelhos «${chave}» está declarada e nenhuma linha a usa`);
  /* R4-b: uma linha por confirmar na fonte que não existe é uma lista desacertada do livro-razão. */
  const ids = new Set([...linhas].map((c) => c.id));
  for (const id of POR_CONFIRMAR) if (!ids.has(id)) erros.push(`a linha «${id}» está na lista das frases por confirmar na fonte e não está no livro-razão`);
  return { erros, porTipo, familiasUsadas: usadas };
}

/**
 * ===========================================================================
 * O QUE É CADA SÉRIE NO TEMPO (bloco R4, o ponto 3 do brief)
 * ===========================================================================
 * A frase de uma série vem da sua linha do livro-razão, quando a há: a que o nome da série declara
 * (`NOMES_DAS_SERIES`, `{ linha }`) ou, se o nome não declara linha, a última linha presa à série pelo campo `serie`.
 * As séries sem linha leem a frase escrita e provada para elas (`src/data/o-que-e-das-series.mjs`). Uma série com as
 * duas, ou sem nenhuma, fecha a construção.
 */

/** A linha de onde vem a frase de uma série no tempo, ou `null`. @param {string} id */
export function linhaDaSerie(id) {
  const d = /** @type {Record<string, any>} */ (NOMES_DAS_SERIES)[id];
  if (d && 'linha' in d) return /** @type {string} */ (d.linha);
  const presas = allClaims()
    .filter((c) => /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (c)).serie === id)
    .sort((a, b) => String(a.reference_date).localeCompare(String(b.reference_date)));
  return presas.length ? presas[presas.length - 1].id : null;
}

/**
 * A frase «o que é» de uma série no tempo, com a sua origem e se está por confirmar na fonte.
 *
 * O VALOR DA LINHA DIZ-SE PELO PONTO DA SÉRIE (passagem R4-b, 06.10.2026, o achado 10 da leitura a frio). A frase de uma
 * linha com cartão diz o valor da linha, e um valor de uma linha leva o seu selo, que abre o recibo da linha; no recibo
 * da série, a lista «As linhas que são pontos desta série» já abre esse recibo, e eram duas portas para o mesmo sítio
 * no mesmo ecrã. Quando a série tem o ponto do período da linha, com o mesmo valor, cadeia a cadeia (a S5 do
 * `check:series` exige-o às linhas presas), o valor diz-se pelo ponto da série (`PontoDaSerie`, a origem dos valores
 * desta página), com o sufixo e a nota da bandeira da linha: as mesmas palavras, sem a segunda porta. Um valor sem esse
 * ponto continua a ser o da linha, com o selo.
 *
 * @param {string} id @param {'pt'|'en'} lang
 * @returns {{ pedacos: any[], origem: 'linha'|'serie', linha: string|null, porConfirmar: boolean }}
 */
export function oQueEDaSerie(id, lang) {
  const linha = linhaDaSerie(id);
  const propria = /** @type {Record<string, any>} */ (FRASES_DAS_SERIES)[id];
  if (linha) {
    if (propria) throw fecha(`${id} · ${lang}`, `a série tem a linha «${linha}» e uma frase própria; a frase é uma, e é a da linha.`);
    const o = oQueEDaLinha(linha, lang);
    const serie = getSerie(id);
    const pedacos = o.pedacos.map((p) => {
      if (!p || typeof p !== 'object' || p.claim !== linha) return p;
      const c = /** @type {any} */ (getClaim(linha));
      const ponto = pontoDaSerie(serie, String(c.reference_date));
      if (!ponto || String(ponto.valor) !== String(c.value)) return p;
      const nota = notaDaBandeira(c, lang);
      return { ponto: { serie: id, chave: String(c.reference_date) }, ...(p.sufixo ? { sufixo: p.sufixo } : {}), ...(nota ? { nota } : {}) };
    });
    return { pedacos, origem: 'linha', linha, porConfirmar: o.porConfirmar };
  }
  const frase = propria?.frase?.[lang];
  if (!Array.isArray(frase) || frase.length === 0) throw fecha(`${id} · ${lang}`, 'a série não tem linha nem frase própria nesta edição.');
  return { pedacos: frase, origem: 'serie', linha: null, porConfirmar: SERIES_POR_CONFIRMAR.has(id) };
}

/** As séries no tempo sem frase, e as frases de séries que não existem ou que trazem um algarismo. @returns {string[]} */
export function errosDasSeries() {
  /** @type {string[]} */
  const erros = [];
  const noTempo = allSeries().filter((s) => s.eixo === 'periodo').map((s) => s.id);
  for (const id of noTempo) for (const lang of /** @type {const} */ (['pt', 'en'])) {
    try { oQueEDaSerie(id, lang); } catch (e) { erros.push(e instanceof Error ? e.message : String(e)); }
  }
  for (const id of SERIES_POR_CONFIRMAR) if (!Object.prototype.hasOwnProperty.call(FRASES_DAS_SERIES, id)) erros.push(`a série «${id}» está por confirmar na fonte e não tem frase própria`);
  for (const [id, d] of Object.entries(FRASES_DAS_SERIES)) {
    if (!noTempo.includes(id)) erros.push(`a frase da série «${id}» está declarada e a série não é uma série no tempo`);
    for (const lang of ['pt', 'en']) for (const p of /** @type {any} */ (d).frase?.[lang] ?? []) if (typeof p !== 'string' || /\d/.test(p)) erros.push(`${id} · ${lang}: a frase traz um algarismo ou um pedaço que não é texto`);
  }
  return erros;
}

{
  const erros = [...errosDasFamilias(), ...cobertura().erros, ...errosDasSeries()];
  if (erros.length) {
    throw new Error(`o que é cada número: ${erros.length} defeito(s):\n  ${erros.slice(0, 40).join('\n  ')}${erros.length > 40 ? `\n  … e mais ${erros.length - 40}` : ''}\n`);
  }
}
