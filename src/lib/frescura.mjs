/**
 * ===========================================================================
 * O ATRASO DE UMA SÉRIE, LIDO DE UMA LINHA
 * ===========================================================================
 *
 * Bloco F1.6 (04.09.2026). `src/data/frescura.mjs` declara que séries estão
 * atrasadas e qual é o último período de cada fonte; este módulo responde às
 * duas perguntas que as páginas fazem:
 *
 *   `atrasoDaLinha(linha)`   esta linha pertence a uma série atrasada?
 *   `linhasAtrasadas()`      quantas linhas do livro-razão estão nesse estado?
 *
 * UMA CONTA SÓ, PARTILHADA. A página da linha, o cartão do concelho, a prova do
 * cabeçalho e o portão que a reconta têm de responder à mesma pergunta da mesma
 * maneira. Duas cópias divergiam à primeira alteração, e uma delas rendia a
 * frase do atraso numa página onde a outra não a contava.
 *
 * A REGRA DE PERTENÇA SÃO TRÊS CAMPOS, e não uma lista de ids: `source`,
 * `document.title` e `reference_date`. A razão está escrita no cabeçalho do
 * ficheiro de dados; em resumo, é o que faz entrar as 278 do continente e deixar
 * de fora as trinta das ilhas (outra fonte) e as duas linhas históricas do
 * estudo de Évora (outro período).
 */

import { loadClaims, documentoDaLinha } from './ledger.mjs';
import { SERIES_ATRASADAS, eSerieAtrasada } from '../data/frescura.mjs';

/**
 * As séries declaradas, conferidas na forma antes de serem usadas.
 *
 * Um ficheiro de dados é dado de fora, como o livro-razão: a forma confere-se
 * ao ler, e uma entrada estragada fecha a construção com o nome dela em vez de
 * render meia frase.
 *
 * @returns {SerieAtrasada[]}
 */
export function seriesAtrasadas() {
  const boas = [];
  for (const s of SERIES_ATRASADAS) {
    if (!eSerieAtrasada(s)) {
      throw new Error(
        'src/data/frescura.mjs: uma entrada de SERIES_ATRASADAS não tem a forma declarada ' +
          '(id, fonte, documento, periodoDaCasa, periodoDaFonte e a origem com ficheiro, ' +
          'registo, campo, lidoEm e url).',
      );
    }
    boas.push(s);
  }
  return boas;
}

/**
 * O título do documento de uma linha, ou `null`.
 *
 * @param {Linha} linha
 * @returns {string | null}
 */
function tituloDoDocumento(linha) {
  const t = documentoDaLinha(linha)?.title;
  return typeof t === 'string' ? t : null;
}

/**
 * ===========================================================================
 * AS DUAS CONTAS PURAS, E PORQUE É QUE ELAS EXISTEM À PARTE
 * ===========================================================================
 * Segunda passagem (04.09.2026, Major 11 da leitura a frio do Codex): «os casos
 * fornecidos provam só a forma de `eSerieAtrasada`, e não o casamento das
 * linhas, os contadores, os períodos rendidos ou os carimbos». A objeção é
 * justa e o obstáculo era mecânico: `scripts/provar-guardas.mjs` **não toca no
 * disco** por contrato, e as duas funções que interessam liam o livro-razão e a
 * declaração das séries por conta própria.
 *
 * Passam a ser três: duas contas puras, que recebem tudo o que usam, e as
 * envolventes que lhes dão o livro-razão e as séries declaradas. O sítio chama
 * as envolventes; os guardas chamam as puras, com linhas escritas à mão. É a
 * mesma separação que o resto da casa faz entre o que se calcula e o que se lê.
 */

/**
 * A série a que uma linha pertence, dentro de uma lista de séries dada.
 *
 * A REGRA DE PERTENÇA SÃO TRÊS CAMPOS: `source`, `document.title` e
 * `reference_date`. Uma linha a que falte qualquer um deles não pertence a série
 * nenhuma, e isso não é um pormenor de programação: uma linha sem período não se
 * pode dizer atrasada, porque não há com que comparar o período da fonte.
 *
 * @param {Linha | null | undefined} linha
 * @param {SerieAtrasada[]} series
 * @returns {SerieAtrasada | null}
 */
export function serieDaLinha(linha, series) {
  if (!linha) return null;
  const fonte = typeof linha.source === 'string' ? linha.source : null;
  const periodo = typeof linha.reference_date === 'string' ? linha.reference_date : null;
  if (fonte === null || periodo === null) return null;
  const documento = tituloDoDocumento(linha);
  if (documento === null) return null;
  return (
    series.find(
      (s) => s.fonte === fonte && s.documento === documento && s.periodoDaCasa === periodo,
    ) ?? null
  );
}

/**
 * Quantas séries e quantas linhas estão atrasadas, numa lista de linhas dada.
 *
 * As duas contagens saem da mesma travessia: o cabeçalho rende as duas na mesma
 * leitura («Séries atrasadas: 1 · 278 linhas do livro-razão»), e uma série
 * declarada que não apanhe linha nenhuma não conta, porque um atraso sem linha
 * não se vê em página nenhuma.
 *
 * @param {Linha[]} linhas
 * @param {SerieAtrasada[]} series
 * @returns {{ series: number, linhas: number }}
 */
export function contagens(linhas, series) {
  const apanhadas = linhas.filter((linha) => serieDaLinha(linha, series) !== null);
  const ids = new Set(
    apanhadas.map((l) => serieDaLinha(l, series)?.id).filter((x) => typeof x === 'string'),
  );
  return { series: ids.size, linhas: apanhadas.length };
}

/**
 * A série atrasada a que esta linha pertence, ou `null`.
 *
 * @param {Linha | null | undefined} linha
 * @returns {SerieAtrasada | null}
 */
export function atrasoDaLinha(linha) {
  return serieDaLinha(linha, seriesAtrasadas());
}

/**
 * As linhas do livro-razão que estão numa série atrasada.
 *
 * @returns {Linha[]}
 */
export function linhasAtrasadas() {
  const series = seriesAtrasadas();
  return [...loadClaims().values()].filter((linha) => serieDaLinha(linha, series) !== null);
}

/**
 * Quantas séries e quantas linhas do livro-razão estão atrasadas.
 *
 * @returns {{ series: number, linhas: number }}
 */
export function contagensDoAtraso() {
  return contagens([...loadClaims().values()], seriesAtrasadas());
}
