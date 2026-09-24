/**
 * ===========================================================================
 * A LEITURA DE UMA MEDIDA · o resolvedor (bloco L1, 24.09.2026)
 * ===========================================================================
 *
 * A regra do diretor de 23.09.2026 (I150, §1.129): cada conteúdo diz o que
 * significa para uma pessoa sem conhecimento do assunto, ou não está acabado. O
 * L1 põe por baixo do número de cada um dos 36 cartões nacionais uma leitura em
 * palavras correntes. As palavras são do lugar de direção e vivem em
 * `src/data/leituras-das-medidas.mjs`; OS NÚMEROS E OS RAMOS SÃO DAQUI, e são
 * escolhidos dos valores selados, nunca escritos.
 *
 * O QUE ESTE MÓDULO FAZ, e é uma coisa só: achata a leitura declarada de uma
 * medida numa lista plana de pedaços de `Frase.astro`, a partir de
 *
 *   · a linha do cartão (o valor, o período), pelo livro-razão;
 *   · a régua do cartão (`reguaDoCartao()`, que cala a média da União onde a
 *     declaração a cala, como a `ReguaDoCartao` faz), para o período anterior
 *     e a União;
 *   · a referência declarada (`REFERENCIAS_DAS_MEDIDAS`), `estadoDaMedida()` e
 *     `comparacaoComOLimiar()`, para os veredictos;
 *   · as chaves da prova (`prova(lang)`) e `periodoDasCamaras()`, para o cartão
 *     das câmaras.
 *
 * OS NÚMEROS COMPARAM-SE COMO NÚMEROS. `parsePtNumber()` lê «20 600» e «−50,2»;
 * um `Number()` sobre a cadeia não lê nenhum dos dois, e foi assim que o ensaio
 * a seco do lugar de direção deu «ficou igual» onde era «subiu». E a igualdade
 * é a dos números: «6» e «6,0» são iguais.
 *
 * NENHUMA LEITURA SAI A MEIO. Um pedaço que não resolva (um ramo em falta, uma
 * referência que a medida não tem, uma chave que a prova não tem, uma linha da
 * régua pedida por nome que não existe) FECHA A CONSTRUÇÃO com a razão. O que
 * não fecha é a ausência que a gramática prevê: uma comparação com uma linha
 * da régua que não existe não se diz, e a frase inteira sai com ela.
 *
 * NENHUM ALGARISMO NAS PALAVRAS FIXAS. Uma cadeia declarada com um algarismo
 * fecha a construção: os algarismos entram por `{ claim }`, `{ periodo }`,
 * `{ referencia }`, `{ prova }` ou `{ nl }`, cada um com a sua origem, e o
 * portão de HTML confere cada um deles.
 *
 * QUEM CONFERE ISTO NÃO É ESTE MÓDULO. A célula K17 do `check:cartao`
 * (`tests/cartao/leituras.mjs`) lê as páginas construídas e reconta os ramos por
 * uma conta sua, sobre o livro-razão, sem chamar esta função para os escolher.
 */

import { LEITURAS_DAS_MEDIDAS } from '../data/leituras-das-medidas.mjs';
import { DOMINIO_DAS_MEDIDAS } from '../data/dominios.mjs';
import { REFERENCIAS_DAS_MEDIDAS } from '../data/referencias-das-medidas.mjs';
import { comparacaoComOLimiar, ladosDoLimiar } from '../data/figuras.mjs';
import { getClaim, parsePtNumber } from './ledger.mjs';
import { reguaDoCartao } from './enquadramento.mjs';
import { estadoDaMedida } from './estado.mjs';
import { prova, periodoDasCamaras } from './prova.mjs';
import { dataDaCasa } from './datas.mjs';
import { t } from '../i18n/strings.mjs';

/** A chave do cartão das câmaras, que é uma contagem da prova e não uma linha. */
export const LEITURA_DAS_CAMARAS = 'camaras';
/** A linha do limite legal, que o país e os temas não rendem como cartão. */
export const LINHA_DO_LIMITE = 'indice-de-divida-limite-legal';

/**
 * AS MEDIDAS QUE TÊM DE TER LEITURA, nas duas edições: as chaves da tabela das
 * medidas do país (`DOMINIO_DAS_MEDIDAS`) menos a linha do limite legal, com a
 * medida reunida na do procedimento (a taxa de desemprego, que a tabela conta e
 * o cartão do procedimento rende), mais o cartão das câmaras. A lista lê-se da
 * tabela e não se escreve aqui: uma medida nova no país sem leitura declarada
 * fecha a construção no acto de ser declarada.
 *
 * @returns {string[]}
 */
export function medidasComLeitura() {
  return [...Object.keys(DOMINIO_DAS_MEDIDAS).filter((id) => id !== LINHA_DO_LIMITE), LEITURA_DAS_CAMARAS];
}

/** Os pedaços calculados que a gramática conhece, e mais nenhum. */
const CHAVES_DE_PEDACO = ['claim', 'periodo', 'referencia', 'prova', 'nl', 'sinal', 'compara', 'estado', 'comparacao'];
/** Os ramos de cada nó, pela ordem da gramática do ficheiro das leituras. */
const RAMOS = {
  sinal: ['positivo', 'negativo', 'zero'],
  compara: ['maior', 'menor', 'igual'],
  estado: ['fora', 'dentro'],
  comparacao: ['acima', 'abaixo', 'entre', 'igual'],
};

/**
 * @typedef {string
 *   | { claim: string, sufixo?: string }
 *   | { data: { id: string, campo: string, valor: string } }
 *   | { nl: string, motivo: string }
 *   | { prova: string, item: { valor: unknown, origem: string, porta: string }, semPorta: boolean }
 * } PedacoDaFrase
 */

/**
 * Uma escolha feita pela máquina, para o relatório do bloco e para quem a
 * quiser recontar. A K17 NÃO a lê para decidir: reconta por conta própria.
 *
 * @typedef {{ no: string, caminho: string, escolha: string|null, porque: string }} RamoEscolhido
 */

/** @param {string} onde @param {string} razao */
function fecha(onde, razao) {
  return new Error(
    `leitura da medida · ${onde}: ${razao} Uma leitura que não resolva fecha a construção, ` +
      `e nenhuma leitura sai a meio (bloco L1, item 1 do brief).`,
  );
}

/**
 * A FORMA DE UMA DECLARAÇÃO, conferida quando o módulo carrega: cada leitura
 * obrigatória existe nas duas edições, cada pedaço é de um tipo que a gramática
 * conhece, cada nó tem só ramos que a gramática conhece, e nenhuma palavra fixa
 * traz um algarismo. É a mesma lista de erros que a K17 lê.
 *
 * @param {Record<string, any>} declaracoes
 * @returns {string[]}
 */
export function errosDaDeclaracao(declaracoes = LEITURAS_DAS_MEDIDAS) {
  /** @type {string[]} */
  const erros = [];
  const obrigatorias = medidasComLeitura();
  for (const id of obrigatorias) {
    const d = declaracoes[id];
    for (const lang of ['pt', 'en']) {
      if (!d || !Array.isArray(d[lang]) || d[lang].length === 0) {
        erros.push(`${id} · ${lang}: a medida rende-se como cartão nacional e não tem leitura declarada nesta edição`);
      }
    }
  }
  for (const id of Object.keys(declaracoes)) {
    if (!obrigatorias.includes(id)) {
      erros.push(`${id}: há uma leitura declarada para uma medida que não é cartão nacional`);
    }
  }
  /** @param {unknown} parte @param {string} onde */
  const anda = (parte, onde) => {
    if (Array.isArray(parte)) {
      parte.forEach((p, i) => anda(p, `${onde}[${i}]`));
      return;
    }
    if (typeof parte === 'string') {
      if (/\d/.test(parte)) erros.push(`${onde}: a palavra fixa «${parte}» traz um algarismo`);
      return;
    }
    if (!parte || typeof parte !== 'object') {
      erros.push(`${onde}: um pedaço que não é texto nem objeto`);
      return;
    }
    const o = /** @type {Record<string, any>} */ (parte);
    const chave = CHAVES_DE_PEDACO.find((k) => k in o);
    if (!chave) {
      erros.push(`${onde}: um pedaço de tipo desconhecido (${Object.keys(o).join(', ')})`);
      return;
    }
    if (chave === 'sinal' || chave === 'estado' || chave === 'comparacao') {
      const ramos = o[chave];
      for (const k of Object.keys(ramos ?? {})) {
        if (!RAMOS[chave].includes(k)) erros.push(`${onde}: o ramo «${k}» não é um ramo de «${chave}»`);
        else anda(ramos[k], `${onde}.${chave}.${k}`);
      }
      return;
    }
    if (chave === 'compara') {
      if (o.compara !== 'anterior' && o.compara !== 'ue') erros.push(`${onde}: compara com «${o.compara}», que não é uma linha da régua`);
      for (const k of Object.keys(o)) {
        if (k === 'compara') continue;
        if (!RAMOS.compara.includes(k)) erros.push(`${onde}: o ramo «${k}» não é um ramo de «compara»`);
        else anda(o[k], `${onde}.compara-${o.compara}.${k}`);
      }
      return;
    }
    if (chave === 'nl' && (typeof o.nl !== 'string' || !/^\d+(,\d+)?$/.test(o.nl) || typeof o.motivo !== 'string')) {
      erros.push(`${onde}: um algarismo declarado sem a forma «{ nl, motivo }»`);
    }
    if (chave === 'claim' && !['proprio', 'anterior', 'ue'].includes(o.claim)) erros.push(`${onde}: claim «${o.claim}» não é uma linha da régua`);
    if (chave === 'periodo' && !['proprio', 'anterior'].includes(o.periodo)) erros.push(`${onde}: período «${o.periodo}» desconhecido`);
    if (chave === 'referencia' && !['unico', 'inferior', 'superior'].includes(o.referencia)) erros.push(`${onde}: referência «${o.referencia}» desconhecida`);
    if ('sufixo' in o && /\d/.test(String(o.sufixo))) erros.push(`${onde}: o sufixo traz um algarismo`);
  };
  for (const [id, d] of Object.entries(declaracoes)) {
    for (const lang of ['pt', 'en']) if (d?.[lang]) anda(d[lang], `${id} · ${lang}`);
  }
  return erros;
}

{
  const erros = errosDaDeclaracao();
  if (erros.length) {
    throw fecha('a declaração', `${erros.length} defeito(s) em src/data/leituras-das-medidas.mjs:\n  ${erros.join('\n  ')}\n`);
  }
}

/** @type {Map<string, ReturnType<typeof prova>>} */
const PROVA_POR_LINGUA = new Map();
/** @param {'pt'|'en'} lang */
function provaDaEdicao(lang) {
  if (!PROVA_POR_LINGUA.has(lang)) PROVA_POR_LINGUA.set(lang, prova(lang));
  return /** @type {ReturnType<typeof prova>} */ (PROVA_POR_LINGUA.get(lang));
}

/**
 * O valor de uma linha como número, ou `null`.
 * @param {string} id
 */
function numeroDaLinha(id) {
  return parsePtNumber(getClaim(id).value);
}

/**
 * A comparação com a referência, nas quatro palavras da gramática.
 *
 * `comparacaoComOLimiar()` devolve «acima», «abaixo», «noLimiar» ou `null`, e
 * numa banda devolve `null` com o valor lá dentro. A gramática separa o que a
 * função junta: `igual` é o valor no limite (o «noLimiar» de um teto ou de um
 * chão, ou uma das duas pontas de uma banda, que a função conta como dentro) e
 * `entre` é o valor no interior da banda.
 *
 * @param {Linha} linha @param {Limiar} limiar @param {string} onde
 * @returns {'acima'|'abaixo'|'entre'|'igual'}
 */
function comparacaoNaGramatica(linha, limiar, onde) {
  const c = comparacaoComOLimiar(linha, limiar);
  if (c === 'acima' || c === 'abaixo') return c;
  if (c === 'noLimiar') return 'igual';
  const lados = ladosDoLimiar(limiar);
  const valor = parsePtNumber(linha.value);
  if (!lados || lados.inferior === null || lados.superior === null || valor === null) {
    throw fecha(onde, 'a comparação com a referência não resolveu (um dos números não se lê, ou a referência não é uma banda).');
  }
  const inf = parsePtNumber(lados.inferior);
  const sup = parsePtNumber(lados.superior);
  if (inf === null || sup === null) throw fecha(onde, 'uma das pontas da banda não se lê como número.');
  return valor === inf || valor === sup ? 'igual' : 'entre';
}

/**
 * A leitura resolvida de uma medida numa edição.
 *
 * @param {string} id  o identificador da linha do cartão, ou `camaras`
 * @param {'pt'|'en'} lang
 * @returns {{ pedacos: PedacoDaFrase[], ramos: RamoEscolhido[], citadas: string[] }}
 */
export function leituraDaMedida(id, lang) {
  const declaracao = /** @type {Record<string, any>} */ (LEITURAS_DAS_MEDIDAS)[id];
  const partes = declaracao?.[lang];
  if (!Array.isArray(partes)) throw fecha(`${id} · ${lang}`, 'não há leitura declarada para esta medida nesta edição.');
  const camaras = id === LEITURA_DAS_CAMARAS;
  const linha = camaras ? null : getClaim(id);
  const valor = linha ? parsePtNumber(linha.value) : null;
  const regua = camaras ? { anterior: null, ue: null } : reguaDoCartao(id);
  const referencia = camaras ? null : (REFERENCIAS_DAS_MEDIDAS.get(id) ?? null);
  /** @type {RamoEscolhido[]} */
  const ramos = [];
  /** @type {string[]} */
  const citadas = [];

  /**
   * @param {unknown} parte @param {string} caminho
   * @returns {PedacoDaFrase[]}
   */
  const resolve = (parte, caminho) => {
    const onde = `${id} · ${lang} · ${caminho}`;
    if (Array.isArray(parte)) return parte.flatMap((p, i) => resolve(p, `${caminho}[${i}]`));
    if (typeof parte === 'string') return [parte];
    const o = /** @type {Record<string, any>} */ (parte);

    if ('claim' in o) {
      const alvo = o.claim === 'proprio' ? (linha ? id : null) : o.claim === 'anterior' ? regua.anterior?.id : regua.ue?.id;
      if (!alvo) throw fecha(onde, `a leitura cita a linha «${o.claim}», que esta medida não tem na régua do cartão.`);
      citadas.push(alvo);
      return [o.sufixo ? { claim: alvo, sufixo: String(o.sufixo) } : { claim: alvo }];
    }
    if ('periodo' in o) {
      if (o.periodo === 'proprio') {
        if (camaras) {
          const p = periodoDasCamaras();
          return [{ data: { id: p.id, campo: 'reference_date', valor: p.periodo } }];
        }
        const r = linha?.reference_date;
        if (typeof r !== 'string' || r === '') throw fecha(onde, 'a linha do cartão não publica o período que a leitura escreve.');
        return [{ data: { id, campo: 'reference_date', valor: r } }];
      }
      const a = regua.anterior;
      if (!a || !a.periodo) throw fecha(onde, 'a leitura escreve o período anterior e a régua do cartão não o tem.');
      return [{ data: { id: a.id, campo: 'reference_date', valor: a.periodo } }];
    }
    if ('referencia' in o) {
      const limiar = referencia?.limiar;
      if (!limiar) throw fecha(onde, 'a leitura escreve um valor de referência que a medida não declara.');
      const banda = Boolean(limiar.inferior && limiar.superior);
      /** @type {LadoDoLimiar|Limiar|undefined} */
      const lado =
        o.referencia === 'unico' ? (banda ? undefined : limiar) : banda ? limiar[/** @type {'inferior'|'superior'} */ (o.referencia)] : undefined;
      if (!lado || typeof lado.nl !== 'string') {
        throw fecha(onde, `a leitura pede a ponta «${o.referencia}» e a referência declarada ${banda ? 'é uma banda' : 'tem um lado só'}.`);
      }
      /* O sinal é um símbolo e não um algarismo: vai à frente e em prosa, como no
         veredicto do cartão (`VeredictoDaReferencia.astro`). O «+» cala-se. */
      const sinal = o.semSinal || lado.sinal !== '−' ? '' : '−';
      return [...(sinal ? [sinal] : []), { nl: lado.nl, motivo: 'limiar-do-quadro' }];
    }
    if ('prova' in o) {
      if (!camaras) throw fecha(onde, 'só o cartão das câmaras cita chaves da prova, e esta leitura é de uma linha.');
      const p = /** @type {Record<string, any>} */ (provaDaEdicao(lang));
      const item = p[o.prova];
      if (!item || item.valor === null || item.valor === undefined) throw fecha(onde, `a prova não tem a chave «${o.prova}» com valor.`);
      return [{ prova: String(o.prova), item, semPorta: true }];
    }
    if ('nl' in o) return [{ nl: String(o.nl), motivo: String(o.motivo) }];

    if ('sinal' in o) {
      if (valor === null) throw fecha(onde, 'o ramo pelo sinal pede um valor numérico, e a linha não o tem.');
      const escolha = valor > 0 ? 'positivo' : valor < 0 ? 'negativo' : 'zero';
      ramos.push({ no: 'sinal', caminho, escolha, porque: `o valor da linha é ${linha?.value}` });
      if (!(escolha in o.sinal)) throw fecha(onde, `falta o ramo «${escolha}» do sinal, e é o que o valor ${linha?.value} manda.`);
      return resolve(o.sinal[escolha], `${caminho}.sinal.${escolha}`);
    }
    if ('compara' in o) {
      const outra = o.compara === 'anterior' ? regua.anterior : regua.ue;
      if (!outra) {
        ramos.push({ no: `compara-${o.compara}`, caminho, escolha: null, porque: 'a régua do cartão não tem esta linha' });
        return [];
      }
      const n = numeroDaLinha(outra.id);
      if (valor === null || n === null) throw fecha(onde, `a comparação com «${outra.id}» pede dois números, e um não se lê.`);
      const escolha = valor > n ? 'maior' : valor < n ? 'menor' : 'igual';
      ramos.push({ no: `compara-${o.compara}`, caminho, escolha, porque: `${linha?.value} contra ${getClaim(outra.id).value} (${outra.id})` });
      if (!(escolha in o)) throw fecha(onde, `falta o ramo «${escolha}» da comparação com ${o.compara}.`);
      return resolve(o[escolha], `${caminho}.compara-${o.compara}.${escolha}`);
    }
    if ('estado' in o) {
      if (!referencia || !linha) {
        ramos.push({ no: 'estado', caminho, escolha: null, porque: 'a medida não declara valor de referência' });
        return [];
      }
      const e = estadoDaMedida(linha, referencia.limiar);
      if (e !== 'fora' && e !== 'dentro') throw fecha(onde, `o estado contra a referência não resolveu («${e}»).`);
      ramos.push({ no: 'estado', caminho, escolha: e, porque: `estadoDaMedida() sobre ${linha.value}` });
      if (!(e in o.estado)) throw fecha(onde, `falta o ramo «${e}» do estado.`);
      return resolve(o.estado[e], `${caminho}.estado.${e}`);
    }
    if ('comparacao' in o) {
      if (!referencia || !linha) {
        ramos.push({ no: 'comparacao', caminho, escolha: null, porque: 'a medida não declara valor de referência' });
        return [];
      }
      const c = comparacaoNaGramatica(linha, referencia.limiar, onde);
      ramos.push({ no: 'comparacao', caminho, escolha: c, porque: `comparacaoComOLimiar() sobre ${linha.value}` });
      if (!(c in o.comparacao)) throw fecha(onde, `falta o ramo «${c}» da comparação com a referência.`);
      return resolve(o.comparacao[c], `${caminho}.comparacao.${c}`);
    }
    throw fecha(onde, 'um pedaço de tipo desconhecido.');
  };

  /* Os pedaços de texto seguidos juntam-se num só, para a página e o texto
     rendido serem os mesmos que a declaração diz, sem nós a mais. */
  /** @type {PedacoDaFrase[]} */
  const pedacos = [];
  for (const p of resolve(partes, lang)) {
    const ultimo = pedacos[pedacos.length - 1];
    if (typeof p === 'string' && typeof ultimo === 'string') pedacos[pedacos.length - 1] = ultimo + p;
    else pedacos.push(p);
  }
  if (pedacos.length === 0) throw fecha(`${id} · ${lang}`, 'a leitura resolveu para nada.');
  return { pedacos, ramos, citadas };
}

/**
 * O texto de uma leitura resolvida, como a página o rende: o valor de uma linha
 * como `<Claim>` o escreve (o valor da linha, o sufixo colado e, onde a linha
 * traz a bandeira `p`, a palavra «provisório»), as datas pela forma da casa, e
 * as contagens da prova como `ValorDaProva` as escreve. É o que a K17 compara,
 * carácter a carácter, com o texto do `dist/`.
 *
 * @param {PedacoDaFrase[]} pedacos @param {'pt'|'en'} lang
 */
export function textoDaLeitura(pedacos, lang) {
  const s = t(lang);
  return pedacos
    .map((p) => {
      if (typeof p === 'string') return p;
      if ('claim' in p) {
        const c = getClaim(p.claim);
        return `${c.value}${p.sufixo ?? ''}${c.source_flag === 'p' ? s.prov.provisorio : ''}`;
      }
      if ('data' in p) return dataDaCasa(p.data.valor);
      if ('prova' in p) return dataDaCasa(String(p.item.valor));
      return p.nl;
    })
    .join('');
}
