/**
 * ===========================================================================
 * A PRIMEIRA PÁGINA DE UM LEITOR COMUM · o resolvedor (bloco PP1, 28.09.2026)
 * ===========================================================================
 *
 * O QUE FAZ, e é uma coisa só: para um bloco de «O que se passa» e uma edição, lê as
 * declarações de `src/data/primeira-pagina.mjs` contra os valores selados do livro-razão
 * e devolve se o bloco se mostra, as condições que falharam, o título, a frase, as peças
 * que se mostram, o modelo do desenho (os valores, as escalas, as posições), a fonte (o
 * publicador e o período de cada linha mostrada) e a lista das linhas. Não usa Astro: o
 * componente do bloco rende o que isto devolve, o guião dos sinais lê o mesmo, e a célula
 * da primeira página (`tests/inicio/blocos.mjs`) reconta tudo por uma conta sua.
 *
 * A GRAMÁTICA É A DAS LEITURAS DOS CARTÕES (`src/lib/leitura-da-medida.mjs`), com as
 * linhas nomeadas pelo identificador em vez de «proprio», «anterior» e «ue»:
 *   · uma cadeia: palavras fixas, sem algarismos (um algarismo entra por `{ nl }`);
 *   · `{ claim, sufixo }`: o valor da linha, rendido pelo `<Claim>` com o selo;
 *   · `{ periodo: id }`: o período de referência, na forma da casa (`DataDaLinha`);
 *   · `{ publicado: id }`: o `published_at` da linha, na forma da casa;
 *   · `{ referencia: id }`: o limiar da linha, lido de `referencias.json` pela função
 *     do enquadramento, e conferido contra a declaração do cartão (duas testemunhas);
 *   · `{ compara: [a, b], menor, maior, igual }`: o ramo que os valores de a e b escolhem;
 *   · `{ nl, motivo }`: um algarismo da definição de uma medida, com o motivo declarado.
 *
 * OS NÚMEROS COMPARAM-SE COMO NÚMEROS, por `parsePtNumber()`, que lê «20 600» e «−50,2»; a
 * igualdade é a dos números («6» e «6,0» são iguais).
 *
 * UMA ATUALIZAÇÃO DOS DADOS NUNCA FAZ FALHAR A CONSTRUÇÃO (o §5.2 do brief). Uma condição
 * falsa, uma linha que desapareceu do livro, um limiar que o motor deixou de exportar:
 * tudo isso tira o bloco (ou a peça) da página e fica escrito em `falhas`, que é o que o
 * guião dos sinais escreve para o lugar de direção. O que fecha a construção é um defeito
 * da DECLARAÇÃO: um pedaço de tipo desconhecido, um ramo em falta, um algarismo numa
 * palavra fixa, uma forma de desenho que não é das quatro. Esse é trabalho de quem
 * escreve, e não de quem atualiza.
 */

import { BLOCOS_DA_PRIMEIRA_PAGINA, ENTRADAS } from '../data/primeira-pagina.mjs';
import { REFERENCIAS_DAS_MEDIDAS } from '../data/referencias-das-medidas.mjs';
import { getSerie } from './series.mjs';
import { hasClaim, getClaim, parsePtNumber } from './ledger.mjs';
import { valorDeReferenciaDoMotor } from './enquadramento.mjs';
import { dataDaCasa } from './datas.mjs';
import { t } from '../i18n/strings.mjs';
import { nomeDoCartao } from './nomes.mjs';
import { reguaDaMedida } from './enquadramento.mjs';
import { DOMINIO_DAS_MEDIDAS } from '../data/dominios.mjs';
import { WORKS } from '../data/studies.mjs';
import { estudosRecentes } from './pais.mjs';

/** RP4: uma série desconhecida ou de países é um defeito, mesmo num bloco oculto.
 * @param {{serie?: unknown}} bloco
 * @returns {string|null}
 */
export function serieDoBloco(bloco) {
  if (bloco.serie === undefined) return null;
  if (typeof bloco.serie !== 'string' || getSerie(bloco.serie).eixo !== 'periodo') throw new Error('primeira página: a série do bloco não é uma série no tempo.');
  return bloco.serie;
}

/** As quatro formas declaradas pelo brief, e mais nenhuma. */
export const FORMAS_DOS_BLOCOS = /** @type {const} */ (['barras', 'paineis', 'pares', 'colunas']);

/** Os pedaços calculados que a gramática conhece. */
const CHAVES_DE_PEDACO = ['claim', 'periodo', 'publicado', 'referencia', 'compara', 'nl'];

/**
 * @typedef {string
 *   | { claim: string, sufixo?: string }
 *   | { data: { id: string, campo: string, valor: string } }
 *   | { nl: string, motivo: string }
 *   | { referencia: string, nl: string, motivo: string }
 * } PedacoDoBloco
 */

/**
 * @typedef {{ tipo: 'nome', linha: string }
 *   | { tipo: 'pais' }
 *   | { tipo: 'uniao' }
 *   | { tipo: 'periodo', linha: string, valor: string }
 * } RotuloDaBarra
 */

/**
 * @typedef {{ linha: string, valor: number, texto: string, papel: 'linha'|'total'|'pt'|'ue', rotulo: RotuloDaBarra, forte: boolean, fracao: number, inicio: number }} BarraDoDesenho
 * @typedef {{ min: number, max: number, pontas: [string, string]|null, unidades: number|null }} EscalaDoDesenho
 * @typedef {{ id: string, titulo: PedacoDoBloco[]|null, escala: string, barras: BarraDoDesenho[], referencia: { linha: string, valor: number, nl: string, fracao: number }|null }} PainelDoDesenho
 * @typedef {{ forma: typeof FORMAS_DOS_BLOCOS[number], legenda: PedacoDoBloco[]|null, sufixo: string, escalas: Record<string, EscalaDoDesenho>, paineis: PainelDoDesenho[] }} ModeloDoDesenho
 */

/** @param {string} onde @param {string} razao */
function defeito(onde, razao) {
  return new Error(
    `primeira página · ${onde}: ${razao} Um defeito da declaração fecha a construção; uma ` +
      `condição falsa ou uma linha ausente tiram o bloco da página e deixam um sinal (§5.2 do brief).`,
  );
}

/** Uma linha que falta no livro-razão: não é um defeito da declaração, é um sinal. */
class LinhaAusente extends Error {
  /** @param {string} id */
  constructor(id) {
    super(`a linha «${id}» não está no livro-razão`);
    this.id = id;
  }
}

/** @param {string} id */
function linha(id) {
  if (!hasClaim(id)) throw new LinhaAusente(id);
  return getClaim(id);
}

/** O valor de uma linha como número, ou `null`. @param {string} id */
export function numeroDaLinha(id) {
  return parsePtNumber(linha(id).value);
}

/**
 * O limiar de uma linha, lido de `referencias.json` pela função do enquadramento, e
 * conferido contra a declaração do cartão (`REFERENCIAS_DAS_MEDIDAS`). Duas testemunhas
 * que discordam são um defeito, e a K9 do `check:cartao` já o diz; aqui a discordância
 * tira o pedaço, com o sinal.
 *
 * @param {string} id
 * @returns {{ nl: string, sinal: string, numero: number }|null}
 */
export function limiarDaLinha(id) {
  const doMotor = valorDeReferenciaDoMotor(id);
  if (!doMotor) return null;
  const m = /^([+\-−]?)(\d+(?:,\d+)?)%$/.exec(doMotor.limiar.replace(/\s/g, ''));
  if (!m) return null;
  const sinal = m[1] === '-' || m[1] === '−' ? '−' : '';
  const nl = m[2];
  const declarado = REFERENCIAS_DAS_MEDIDAS.get(id)?.limiar;
  if (!declarado || !('nl' in declarado) || declarado.nl !== nl) return null;
  const numero = parsePtNumber(`${sinal}${nl}`);
  return numero === null ? null : { nl, sinal, numero };
}

/**
 * O FIM DE UM PERÍODO, para escolher o mais recente pelo fim (o §2, ponto 3, do brief).
 * Um ano acaba a 31 de dezembro, um mês no seu último dia, um trimestre no último dia do
 * seu último mês, e um dia é o próprio dia. Devolve AAAA-MM-DD, que se ordena como texto.
 *
 * @param {string} periodo
 * @returns {string|null}
 */
export function fimDoPeriodo(periodo) {
  const p = String(periodo ?? '');
  const ultimoDia = (/** @type {number} */ ano, /** @type {number} */ mes) =>
    new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  let m = /^(\d{4})$/.exec(p);
  if (m) return `${m[1]}-12-31`;
  m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(p);
  if (m) return `${m[1]}-${m[2]}-${String(ultimoDia(Number(m[1]), Number(m[2]))).padStart(2, '0')}`;
  m = /^(\d{4})-T([1-4])$/.exec(p);
  if (m) {
    const mes = Number(m[2]) * 3;
    return `${m[1]}-${String(mes).padStart(2, '0')}-${String(ultimoDia(Number(m[1]), mes)).padStart(2, '0')}`;
  }
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p);
  return m ? p : null;
}

/**
 * AS CONDIÇÕES, avaliadas com os valores selados. Cada uma devolve se é verdadeira e a
 * frase do porquê, para o sinal.
 *
 * @param {any} c
 * @returns {{ ok: boolean, texto: string }}
 */
export function avaliarCondicao(c) {
  try {
    if (Array.isArray(c?.mesmo_periodo)) {
      const periodos = c.mesmo_periodo.map((/** @type {string} */ id) => `${id} (${linha(id).reference_date})`);
      const distintos = new Set(c.mesmo_periodo.map((/** @type {string} */ id) => linha(id).reference_date));
      return { ok: distintos.size === 1, texto: `o mesmo período: ${periodos.join(', ')}` };
    }
    if (typeof c?.periodo === 'string' && typeof c?.mes === 'number') {
      const r = String(linha(c.periodo).reference_date ?? '');
      const mes = /^\d{4}-(\d{2})$/.exec(r);
      return { ok: Boolean(mes) && Number(mes?.[1]) === c.mes, texto: `o mês de ${c.periodo} (${r}) é ${c.mes}` };
    }
    if (typeof c?.a === 'string' && typeof c?.op === 'string') {
      const a = numeroDaLinha(c.a);
      /** @type {number|null} */
      let b;
      /** @type {string} */
      let nomeB;
      if (typeof c.b === 'string') { b = numeroDaLinha(c.b); nomeB = `${c.b} (${linha(c.b).value})`; }
      else if (typeof c.valor === 'number') { b = c.valor; nomeB = String(c.valor); }
      else if (typeof c.referencia === 'string') {
        const l = limiarDaLinha(c.referencia);
        b = l ? l.numero : null;
        nomeB = `o limiar de ${c.referencia} (${l ? `${l.sinal}${l.nl}` : 'sem limiar'})`;
      } else throw defeito('uma condição', `a comparação ${JSON.stringify(c)} não tem segundo termo.`);
      const texto = `${c.a} (${linha(c.a).value}) ${c.op} ${nomeB}`;
      if (a === null || b === null) return { ok: false, texto: `${texto}: um dos números não se lê` };
      const ok = c.op === '>' ? a > b : c.op === '<' ? a < b : c.op === '=' ? a === b : c.op === '!=' ? a !== b : null;
      if (ok === null) throw defeito('uma condição', `o operador «${c.op}» não é da gramática.`);
      return { ok, texto };
    }
  } catch (e) {
    if (e instanceof LinhaAusente) return { ok: false, texto: e.message };
    throw e;
  }
  throw defeito('uma condição', `forma desconhecida: ${JSON.stringify(c)}.`);
}

/**
 * Os pedaços de uma parte declarada, resolvidos numa edição. Uma linha ausente atira
 * `LinhaAusente`, que quem chama converte em sinal; um defeito atira um `Error`.
 *
 * @param {unknown} partes @param {string} onde @param {Set<string>} linhas @param {Set<string>} comValor
 * @returns {PedacoDoBloco[]}
 */
function resolver(partes, onde, linhas, comValor) {
  const lista = typeof partes === 'string' ? [partes] : partes;
  if (!Array.isArray(lista)) throw defeito(onde, 'a parte não é uma cadeia nem uma lista.');
  /** @type {PedacoDoBloco[]} */
  const out = [];
  lista.forEach((p, i) => {
    const aqui = `${onde}[${i}]`;
    if (typeof p === 'string') {
      if (/\d/.test(p)) throw defeito(aqui, `a palavra fixa «${p}» traz um algarismo; os algarismos entram por { nl }.`);
      out.push(p);
      return;
    }
    const o = /** @type {Record<string, any>} */ (p ?? {});
    const chave = CHAVES_DE_PEDACO.find((k) => k in o);
    if (!chave) throw defeito(aqui, `um pedaço de tipo desconhecido (${Object.keys(o).join(', ')}).`);
    if (chave === 'claim') {
      linha(o.claim);
      linhas.add(o.claim);
      comValor.add(o.claim);
      if ('sufixo' in o && /\d/.test(String(o.sufixo))) throw defeito(aqui, 'o sufixo traz um algarismo.');
      out.push(o.sufixo ? { claim: o.claim, sufixo: String(o.sufixo) } : { claim: o.claim });
      return;
    }
    if (chave === 'periodo' || chave === 'publicado') {
      const campo = chave === 'periodo' ? 'reference_date' : 'published_at';
      const valor = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (linha(o[chave])))[campo];
      if (typeof valor !== 'string' || valor === '') throw new LinhaAusente(`${o[chave]} · ${campo}`);
      linhas.add(o[chave]);
      out.push({ data: { id: o[chave], campo, valor } });
      return;
    }
    if (chave === 'referencia') {
      linha(o.referencia);
      const l = limiarDaLinha(o.referencia);
      if (!l) throw new LinhaAusente(`o limiar de ${o.referencia}`);
      if (l.sinal) out.push(l.sinal);
      out.push({ referencia: o.referencia, nl: l.nl, motivo: 'limiar-do-quadro' });
      return;
    }
    if (chave === 'compara') {
      if (!Array.isArray(o.compara) || o.compara.length !== 2) throw defeito(aqui, 'compara pede duas linhas.');
      const [a, b] = o.compara.map((/** @type {string} */ id) => numeroDaLinha(id));
      if (a === null || b === null) throw new LinhaAusente(`os números de ${o.compara.join(' e ')}`);
      const ramo = a < b ? 'menor' : a > b ? 'maior' : 'igual';
      for (const r of ['menor', 'maior', 'igual']) if (!(r in o)) throw defeito(aqui, `falta o ramo «${r}».`);
      o.compara.forEach((/** @type {string} */ id) => linhas.add(id));
      out.push(...resolver(o[ramo], `${aqui}.${ramo}`, linhas, comValor));
      return;
    }
    if (chave === 'nl') {
      if (typeof o.nl !== 'string' || !/^\d+(,\d+)?$/.test(o.nl) || typeof o.motivo !== 'string') {
        throw defeito(aqui, 'um algarismo declarado sem a forma { nl, motivo }.');
      }
      out.push({ nl: o.nl, motivo: o.motivo });
    }
  });
  /* Os pedaços de texto seguidos juntam-se num só, como nas leituras dos cartões. */
  /** @type {PedacoDoBloco[]} */
  const juntos = [];
  for (const p of out) {
    const ultimo = juntos[juntos.length - 1];
    if (typeof p === 'string' && typeof ultimo === 'string') juntos[juntos.length - 1] = ultimo + p;
    else juntos.push(p);
  }
  return juntos;
}

/** O primeiro número redondo (1, 2, 2,5 ou 5 vezes uma potência de dez) que não fica abaixo de v. @param {number} v */
export function numeroRedondo(v) {
  if (!(v > 0)) return 1;
  const potencia = 10 ** Math.floor(Math.log10(v));
  for (const f of [1, 2, 2.5, 5, 10]) {
    const r = f * potencia;
    if (r >= v - 1e-12) return Number(r.toPrecision(12));
  }
  return 10 * potencia;
}

/** Um número de escala escrito como a casa escreve (vírgula decimal). @param {number} n */
function textoDaEscala(n) {
  return String(Number(n.toPrecision(12))).replace('.', ',');
}

/**
 * O MODELO DO DESENHO de um bloco, numa edição. As frações são a posição de cada valor
 * na sua escala, de 0 a 1; o componente converte-as em comprimentos e a célula da
 * geometria confere-as na página desenhada.
 *
 * @param {any} b @param {'pt'|'en'} lang @param {Set<string>} linhas @param {Set<string>} comValor
 * @returns {ModeloDoDesenho}
 */
function modeloDoDesenho(b, lang, linhas, comValor) {
  const d = b.desenho;
  const onde = `${b.id} · ${lang} · desenho`;
  if (!FORMAS_DOS_BLOCOS.includes(d?.forma)) throw defeito(onde, `a forma «${d?.forma}» não é das quatro.`);
  /** @type {(id: string) => { valor: number, texto: string }} */
  const valorDe = (id) => {
    const l = linha(id);
    const valor = parsePtNumber(l.value);
    if (valor === null) throw new LinhaAusente(`o número de ${id}`);
    linhas.add(id);
    comValor.add(id);
    return { valor, texto: String(l.value) };
  };
  const citadasNaFrase = new Set();
  for (const p of [...(b.frase.pt ?? []), ...(b.frase.en ?? [])]) if (p && typeof p === 'object' && 'claim' in p) citadasNaFrase.add(p.claim);
  const titulo = (/** @type {any} */ t) => (t ? resolver(t[lang], `${onde} · título`, new Set(), new Set()) : null);

  /** @type {Record<string, { regua: any, valores: number[] }>} */
  const grupos = {};
  /** @type {{ painel: Omit<PainelDoDesenho, 'escala'> & { escala: string }, regua: any }[]} */
  const paineis = [];
  /** @param {string} chave @param {any} regua @param {number[]} valores */
  const junta = (chave, regua, valores) => {
    grupos[chave] ??= { regua, valores: [] };
    grupos[chave].valores.push(...valores);
  };

  if (d.forma === 'barras') {
    const grupo = d.linhas.map((/** @type {string} */ id) => ({ id, ...valorDe(id) }));
    grupo.sort((/** @type {any} */ x, /** @type {any} */ y) => y.valor - x.valor);
    const total = { id: d.total, ...valorDe(d.total) };
    /** @type {BarraDoDesenho[]} */
    const barras = [...grupo, total].map((x, i) => ({
      linha: x.id, valor: x.valor, texto: x.texto, papel: i === grupo.length ? 'total' : 'linha',
      rotulo: { tipo: 'nome', linha: x.id }, forte: citadasNaFrase.has(x.id), fracao: 0, inicio: 0,
    }));
    junta('unica', d.regua, barras.map((x) => x.valor));
    paineis.push({ painel: { id: 'barras', titulo: null, escala: 'unica', barras, referencia: null }, regua: d.regua });
  } else if (d.forma === 'paineis' || d.forma === 'pares') {
    const lista = d.forma === 'paineis' ? d.paineis : d.pares;
    lista.forEach((/** @type {any} */ p, /** @type {number} */ i) => {
      const regua = p.regua ?? d.regua;
      if (!regua) throw defeito(onde, `o painel ${i + 1} não tem régua de escala.`);
      const chave = p.regua ? (p.regua.grupo ?? `painel-${i}`) : 'unica';
      const pt = valorDe(p.pt), ue = valorDe(p.ue);
      /** @type {BarraDoDesenho[]} */
      const barras = [
        { linha: p.pt, valor: pt.valor, texto: pt.texto, papel: 'pt', rotulo: { tipo: 'pais' }, forte: true, fracao: 0, inicio: 0 },
        { linha: p.ue, valor: ue.valor, texto: ue.texto, papel: 'ue', rotulo: { tipo: 'uniao' }, forte: false, fracao: 0, inicio: 0 },
      ];
      junta(chave, regua, [pt.valor, ue.valor]);
      paineis.push({ painel: { id: `painel-${i}`, titulo: titulo(p.titulo), escala: chave, barras, referencia: null }, regua });
    });
  } else {
    d.paineis.forEach((/** @type {any} */ p, /** @type {number} */ i) => {
      /** @type {BarraDoDesenho[]} */
      const barras = p.colunas.map((/** @type {string} */ id) => {
        const v = valorDe(id);
        const periodo = String(linha(id).reference_date ?? '');
        if (!periodo) throw new LinhaAusente(`${id} · reference_date`);
        return { linha: id, valor: v.valor, texto: v.texto, papel: i === 0 ? 'pt' : 'ue', rotulo: { tipo: 'periodo', linha: id, valor: periodo }, forte: i === 0, fracao: 0, inicio: 0 };
      });
      /** @type {PainelDoDesenho['referencia']} */
      let referencia = null;
      if (p.referencia) {
        linha(p.referencia);
        const l = limiarDaLinha(p.referencia);
        if (!l) throw new LinhaAusente(`o limiar de ${p.referencia}`);
        referencia = { linha: p.referencia, valor: l.numero, nl: `${l.sinal}${l.nl}`, fracao: 0 };
      }
      junta('unica', d.regua, barras.map((x) => x.valor));
      paineis.push({ painel: { id: `painel-${i}`, titulo: titulo(p.titulo), escala: 'unica', barras, referencia }, regua: d.regua });
    });
  }

  /* AS ESCALAS. A ponta de baixo é a declarada, alargada a um valor negativo se houver
     algum (uma barra negativa desenha-se para trás da origem); a de cima é a declarada,
     o maior valor, o número redondo que não fica abaixo dele, ou as unidades. */
  /** @type {Record<string, EscalaDoDesenho>} */
  const escalas = {};
  for (const [chave, g] of Object.entries(grupos)) {
    const r = g.regua;
    const maior = Math.max(...g.valores, 0);
    const menor = Math.min(...g.valores, typeof r.desde === 'number' ? r.desde : 0);
    let max;
    if (typeof r.ate === 'number') max = r.ate;
    else if (r.ate === 'maior') max = maior;
    else if (r.ate === 'redonda') max = numeroRedondo(maior);
    else if (r.ate === 'unidades') max = Math.ceil(maior);
    else throw defeito(onde, `a régua da escala «${chave}» não diz até onde vai.`);
    if (!(max > menor)) throw new LinhaAusente(`uma escala vazia em ${chave}`);
    if (Math.max(...g.valores) > max + 1e-9) throw new LinhaAusente(`um valor acima da ponta declarada de ${chave}`);
    escalas[chave] = {
      min: menor, max,
      pontas: r.pontas ? [textoDaEscala(menor), textoDaEscala(max)] : null,
      unidades: r.unidades ? max : null,
    };
  }
  /** @type {PainelDoDesenho[]} */
  const prontos = paineis.map(({ painel }) => {
    const e = escalas[painel.escala];
    const posicao = (/** @type {number} */ v) => (v - e.min) / (e.max - e.min);
    const zero = posicao(0);
    return {
      ...painel,
      barras: painel.barras.map((x) => ({ ...x, fracao: posicao(x.valor), inicio: zero })),
      referencia: painel.referencia ? { ...painel.referencia, fracao: posicao(painel.referencia.valor) } : null,
    };
  });
  return {
    forma: d.forma,
    legenda: d.legenda ? resolver(d.legenda[lang], `${onde} · legenda`, linhas, new Set()) : null,
    sufixo: typeof d.sufixo === 'string' ? d.sufixo : '',
    escalas,
    paineis: prontos,
  };
}

/**
 * @typedef {{ id: string, mostra: boolean, falhas: string[], caixa: boolean, titulo: PedacoDoBloco[]|null, pedacos: PedacoDoBloco[], linhas: string[] }} PecaResolvida
 * @typedef {{
 *   id: string, entrada: string, lang: 'pt'|'en', mostra: boolean, falhas: string[],
 *   condicoes: { ok: boolean, texto: string }[],
 *   titulo: PedacoDoBloco[], frase: PedacoDoBloco[], ressalva: PedacoDoBloco[],
 *   pecas: PecaResolvida[], desenho: ModeloDoDesenho|null,
 *   linhas: string[], comValor: string[],
 *   numeros: { linha: string, sufixo: string, nome: { linha: string, qualificador: 'ue'|null } }[],
 *   fonte: { publicador: string, linha: string, periodos: { linha: string, valor: string }[] }[],
 *   maisRecente: { linha: string, periodo: string, fim: string }|null,
 *   serie: string|null,
 * }} BlocoResolvido
 */

/**
 * UM BLOCO, numa edição.
 *
 * @param {string} id @param {'pt'|'en'} lang
 * @returns {BlocoResolvido}
 */
export function blocoResolvido(id, lang) {
  const b = /** @type {any} */ (BLOCOS_DA_PRIMEIRA_PAGINA.find((x) => x.id === id));
  if (!b) throw defeito(id, 'não há bloco declarado com este nome.');
  const serie = serieDoBloco(b);
  /** @type {string[]} */
  const falhas = [];
  const condicoes = (b.condicao ?? []).map((/** @type {any} */ c) => avaliarCondicao(c));
  for (const c of condicoes) if (!c.ok) falhas.push(`condição falsa: ${c.texto}`);
  /** @type {Set<string>} */
  const linhas = new Set();
  /** @type {Set<string>} */
  const comValor = new Set();
  /** @type {PedacoDoBloco[]} */
  let titulo = [];
  /** @type {PedacoDoBloco[]} */
  let frase = [];
  /** @type {PedacoDoBloco[]} */
  let ressalva = [];
  /** @type {ModeloDoDesenho|null} */
  let desenho = null;
  try {
    titulo = resolver(b.titulo[lang], `${id} · ${lang} · título`, new Set(), new Set());
    frase = resolver(b.frase[lang], `${id} · ${lang} · frase`, linhas, comValor);
    desenho = modeloDoDesenho(b, lang, linhas, comValor);
    ressalva = resolver(b.ressalva[lang], `${id} · ${lang} · ressalva`, new Set(), new Set());
  } catch (e) {
    if (!(e instanceof LinhaAusente)) throw e;
    falhas.push(`não resolve: ${e.message}`);
  }
  /** @type {PecaResolvida[]} */
  const pecas = (b.pecas ?? []).map((/** @type {any} */ p) => {
    /** @type {string[]} */
    const f = [];
    for (const c of (p.condicao ?? []).map((/** @type {any} */ c) => avaliarCondicao(c))) if (!c.ok) f.push(`condição falsa: ${c.texto}`);
    /** @type {Set<string>} */
    const daPeca = new Set();
    /** @type {PedacoDoBloco[]} */
    let pedacos = [];
    /** @type {PedacoDoBloco[]|null} */
    let t = null;
    try {
      pedacos = resolver(p[lang], `${id} · ${lang} · peça ${p.id}`, daPeca, new Set());
      t = p.titulo ? resolver(p.titulo[lang], `${id} · ${lang} · peça ${p.id} · título`, new Set(), new Set()) : null;
    } catch (e) {
      if (!(e instanceof LinhaAusente)) throw e;
      f.push(`não resolve: ${e.message}`);
    }
    return { id: p.id, mostra: f.length === 0, falhas: f, caixa: p.caixa === true, titulo: t, pedacos, linhas: [...daPeca] };
  });
  const mostra = falhas.length === 0;
  if (mostra) for (const p of pecas) if (p.mostra) for (const l of p.linhas) { linhas.add(l); }
  /* As linhas cujos valores se veem (a frase, o desenho e as peças mostradas), pela
     ordem em que aparecem: é esta a lista «Os números deste bloco». */
  const comValorVisto = mostra ? [...comValor] : [];
  if (mostra) for (const p of pecas) if (p.mostra) for (const x of p.pedacos) if (typeof x === 'object' && 'claim' in x && !comValorVisto.includes(x.claim)) comValorVisto.push(x.claim);
  const todas = mostra ? [...linhas] : [];
  /* O SUFIXO DE CADA NÚMERO NA LISTA é o que ele leva onde aparece: o da frase ou da peça que o
     cita, ou o do desenho; e, onde o desenho o deixa sozinho porque a legenda ou o título dizem a
     unidade, o símbolo da percentagem quando a unidade da linha começa por ele. */
  /** @type {Map<string, string>} */
  const sufixos = new Map();
  const recolhe = (/** @type {PedacoDoBloco[]} */ ps) => { for (const x of ps) if (typeof x === 'object' && 'claim' in x && !sufixos.has(x.claim)) sufixos.set(x.claim, x.sufixo ?? ''); };
  recolhe(frase);
  for (const p of pecas) if (p.mostra) recolhe(p.pedacos);
  const doDesenho = desenho?.sufixo ?? '';
  const numeros = comValorVisto.map((id) => ({
    linha: id,
    sufixo: sufixos.get(id) ?? (doDesenho || (String(getClaim(id).unit ?? '').startsWith('%') ? ' %' : '')),
    nome: nomeNaLista(id, lang),
  }));
  return {
    id, entrada: b.entrada, lang, mostra, falhas, condicoes,
    titulo, frase, ressalva, pecas, desenho, serie,
    linhas: todas, comValor: comValorVisto, numeros,
    fonte: mostra ? fonteDasLinhas(comValorVisto) : [],
    maisRecente: mostra ? maisRecente(todas) : null,
  };
}

/** Os degraus da escada do nome que são nomes deste projeto, e não títulos de documento. */
const NOMES_DA_CASA = new Set(['projeto', 'figuras', 'medidas']);

/**
 * O NOME DE UM NÚMERO NA LISTA «OS NÚMEROS DESTE BLOCO»: o nome do cartão a que ele pertence.
 * Uma linha que tem nome deste projeto leva o seu. O agregado da União de uma medida (a nota da
 * linha di-lo, com a mesma frase que o portão de HTML lê) leva o nome do cartão da medida e a
 * palavra «União Europeia» ao lado, que é como a régua do cartão já o mostra. O período anterior
 * de uma medida leva o nome do cartão dela, e o período distingue-os. O resto leva o nome que a
 * escada do cartão lhe der, que é o do recibo.
 *
 * @param {string} id @param {'pt'|'en'} lang
 * @returns {{ linha: string, qualificador: 'ue'|null }}
 */
export function nomeNaLista(id, lang) {
  const c = getClaim(id);
  const proprio = nomeDoCartao(c, lang);
  if (proprio && proprio.fonte && NOMES_DA_CASA.has(proprio.fonte)) return { linha: id, qualificador: null };
  const nota = typeof c.note === 'string' ? /^Agregado da União Europeia \(EU27_2020\) da medida «([^»]+)»/.exec(c.note) : null;
  if (nota && hasClaim(nota[1])) return { linha: nota[1], qualificador: 'ue' };
  for (const k of Object.keys(DOMINIO_DAS_MEDIDAS)) if (hasClaim(k) && reguaDaMedida(k).anterior?.id === id) return { linha: k, qualificador: null };
  return { linha: id, qualificador: null };
}

/**
 * A LINHA DA FONTE, calculada: o publicador de cada linha cujo valor se vê, pela ordem
 * em que aparece, e os períodos distintos de cada publicador.
 *
 * @param {string[]} ids
 */
export function fonteDasLinhas(ids) {
  /** @type {Map<string, { publicador: string, linha: string, periodos: { linha: string, valor: string }[] }>} */
  const grupos = new Map();
  for (const id of ids) {
    const l = getClaim(id);
    const publicador = String(l.source ?? '');
    if (!publicador) continue;
    if (!grupos.has(publicador)) grupos.set(publicador, { publicador, linha: id, periodos: [] });
    const g = /** @type {{ periodos: { linha: string, valor: string }[] }} */ (grupos.get(publicador));
    const periodo = String(l.reference_date ?? '');
    if (periodo && !g.periodos.some((p) => p.valor === periodo)) g.periodos.push({ linha: id, valor: periodo });
  }
  return [...grupos.values()];
}

/**
 * O período de referência mais recente, pelo fim do período, de uma lista de linhas.
 *
 * @param {string[]} ids
 * @returns {{ linha: string, periodo: string, fim: string }|null}
 */
export function maisRecente(ids) {
  /** @type {{ linha: string, periodo: string, fim: string }|null} */
  let melhor = null;
  for (const id of ids) {
    const periodo = String(getClaim(id).reference_date ?? '');
    const fim = fimDoPeriodo(periodo);
    if (!fim) continue;
    if (!melhor || fim > melhor.fim) melhor = { linha: id, periodo, fim };
  }
  return melhor;
}

/**
 * OS BLOCOS DE UMA PÁGINA: os declarados para ela, pela ordem declarada, resolvidos.
 * A primeira página leva os cinco; uma entrada leva os seus.
 *
 * @param {string[]} ids @param {'pt'|'en'} lang
 */
export function blocosDaPagina(ids, lang) {
  return ids.map((id) => blocoResolvido(id, lang));
}

/** Os identificadores dos cinco blocos, pela ordem declarada. */
export function idsDosBlocos() {
  return BLOCOS_DA_PRIMEIRA_PAGINA.map((b) => b.id);
}

/**
 * A DATA DE «O QUE SE PASSA»: o período de referência mais recente, pelo fim, das linhas
 * que os blocos MOSTRADOS usam.
 *
 * @param {BlocoResolvido[]} blocos
 */
export function periodoDosNumerosMaisRecentes(blocos) {
  return maisRecente(blocos.filter((b) => b.mostra).flatMap((b) => b.linhas));
}

/**
 * OS SINAIS PARA O LUGAR DE DIREÇÃO: cada bloco e cada peça que sai, e porquê, avaliados
 * pelo mesmo resolvedor (edição portuguesa: as condições não dependem da língua).
 */
export function sinaisDaPrimeiraPagina() {
  return BLOCOS_DA_PRIMEIRA_PAGINA.map((b) => {
    const r = blocoResolvido(b.id, 'pt');
    return {
      bloco: b.id,
      mostra: r.mostra,
      falhas: r.falhas,
      pecas: r.pecas.map((p) => ({ peca: p.id, mostra: r.mostra && p.mostra, falhas: p.falhas })),
    };
  });
}

/**
 * O TEXTO DE UMA LISTA DE PEDAÇOS, como a página o rende: o valor de uma linha como o
 * `<Claim>` o escreve (o valor, o sufixo e, onde a linha traz a bandeira `p`, ou `&` com a
 * nota «Dado provisório», a palavra «provisório»), as datas na forma da casa, e os
 * algarismos declarados. É o que a célula da primeira página compara, carácter a
 * carácter, com o texto construído.
 *
 * @param {PedacoDoBloco[]} pedacos @param {'pt'|'en'} lang
 */
export function textoDosPedacos(pedacos, lang) {
  const s = t(lang);
  return pedacos
    .map((p) => {
      if (typeof p === 'string') return p;
      if ('claim' in p) {
        const c = getClaim(p.claim);
        const provisorio = c.source_flag === 'p' || (c.source_flag === '&' && c.source_flag_note === 'Dado provisório');
        return `${c.value}${p.sufixo ?? ''}${provisorio ? ` (${s.prov.dadoProvisorio})` : ''}`;
      }
      if ('data' in p) return dataDaCasa(p.data.valor, lang);
      return p.nl;
    })
    .join('');
}

/**
 * AS ENTRADAS, resolvidas numa edição: o nome, a linha, a rota, os blocos e as secções.
 * @param {'pt'|'en'} lang
 */
export function entradasDaPrimeiraPagina(lang) {
  return ENTRADAS.map((e) => ({
    id: e.id,
    nome: e.nome[lang],
    linha: e.linha[lang],
    rota: e.rota[lang],
    existente: 'existente' in e && e.existente === true,
    seccoes: e.seccoes.map((s) => ({ nome: s.nome[lang], cartoes: s.cartoes })),
  }));
}

/**
 * OS ESTUDOS DE UMA ENTRADA (o §2, ponto 4, do brief: «os estudos do mesmo tema, o construtor mede
 * quais»). Medido a 28.09.2026: a regra literal punha na página do dinheiro os estudos das contas da
 * câmara de Évora, porque os cartões dos preços e das dívidas das famílias estão no tema da economia
 * e das finanças públicas. A regra desta função dá a cada tema uma entrada só, a que tem mais cartões
 * dele (a economia e as finanças públicas ficam com «O Estado e a economia», 10 cartões contra 8), e a
 * cada entrada os estudos do PAÍS sobre os seus temas: os estudos de um lugar (Évora, o Alentejo e o
 * Algarve) são da entrada «A minha terra», que é a página dos lugares. A ordem é a dos estudos
 * recentes, do mais recente para o mais antigo.
 *
 * @param {string} entrada o identificador da entrada nas declarações
 * @param {'pt'|'en'} lang
 */
export function estudosDaEntrada(entrada, lang) {
  /** @type {Map<string, Map<string, number>>} */
  const porTema = new Map();
  for (const e of ENTRADAS) {
    for (const id of e.seccoes.flatMap((x) => x.cartoes)) {
      const tema = /** @type {Record<string, string>} */ (DOMINIO_DAS_MEDIDAS)[id];
      if (!tema) continue;
      if (!porTema.has(tema)) porTema.set(tema, new Map());
      const m = /** @type {Map<string, number>} */ (porTema.get(tema));
      m.set(e.id, (m.get(e.id) ?? 0) + 1);
    }
  }
  /** @type {Set<string>} */
  const temas = new Set();
  for (const [tema, m] of porTema) {
    /* A entrada com mais cartões do tema; num empate, a primeira pela ordem declarada. */
    let dona = null, mais = -1;
    for (const e of ENTRADAS) { const n = m.get(e.id) ?? 0; if (n > mais) { mais = n; dona = e.id; } }
    if (dona === entrada) temas.add(tema);
  }
  const doPais = new Set(WORKS.filter((w) => typeof w.subject !== 'string' && temas.has(String(w.tema))).map((w) => w.slug));
  return estudosRecentes(lang).filter((e) => doPais.has(e.work.slug));
}

