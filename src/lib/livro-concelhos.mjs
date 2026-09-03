/**
 * AS LINHAS DOS CONCELHOS, AGRUPADAS PELO CONCELHO QUE AS DECLARA.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE (decisão D6 do diretor, 26.08.2026)
 * ---------------------------------------------------------------------------
 * `/livro-razao` rende todas as linhas do livro-razão numa página. Com as
 * medidas dos 308 concelhos, essa página passaria de 136 entradas para cerca de
 * 2 570, e uma lista de 2 570 entradas não é um índice. As linhas do estudo
 * `concelhos-2026` saem do índice principal para a página do conjunto, e é este
 * módulo que as separa — uma conta só, lida pela vista que as rende e pelo
 * portão que reconta as chaves da prova.
 *
 * ---------------------------------------------------------------------------
 * O AGRUPAMENTO SAI DA ENTRADA DO CONCELHO, E NÃO DO NOME DA LINHA
 * ---------------------------------------------------------------------------
 * O id de uma linha começa pelo slug do concelho, e seria fácil recortá-lo com
 * uma expressão. Seria fácil e errado: `vila-real-populacao-2025` e
 * `vila-real-de-santo-antonio-populacao-2025` partilham o princípio, e um
 * recorte guloso ou preguiçoso põe as linhas de um no outro, em silêncio. O
 * agrupamento faz-se pelos ids que cada entrada DECLARA — as sete medidas do
 * relance e o limite da dívida —, que é a mesma declaração que a página do
 * concelho usa para os render.
 *
 * UMA LINHA DO ESTUDO QUE NENHUMA ENTRADA DECLARE não desaparece: fica no grupo
 * dos não declarados, que é um estado desenhado (IDENTIDADE §7) e a medida
 * exacta do que o exportador escreveu e o sítio ainda não lê.
 */

import { allClaims, provenienciaIncompleta } from './ledger.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../data/municipios.mjs';

/** O identificador do estudo, tal como o contrato com o motor o fixa. */
export const ESTUDO_DOS_CONCELHOS = 'concelhos-2026';

/**
 * As linhas que uma entrada de concelho declara: as sete peças e o limite.
 *
 * @param {(typeof MUNICIPIOS_COM_PAGINA)[number]} municipio
 */
export function idsDoConcelho(municipio) {
  /** @type {(string | null | undefined)[]} */
  const ids = municipio.relance.map((medida) => medida.claim);
  const d = municipio.distancia ?? {};
  /* O limite da dívida não é uma peça: é a referência contra que a peça do
     índice se lê, e a segunda ponta do desenho da distância. É uma linha do
     estudo como as outras, e a página do conjunto tem de a listar. */
  ids.push('limite' in d ? d.limite : null);
  return /** @type {string[]} */ (ids.filter(Boolean));
}

/**
 * As linhas do estudo dos concelhos, por concelho.
 *
 * @returns {{
 *   linhas: object[],
 *   grupos: { slug: string, nome: object, linhas: object[] }[],
 *   naoDeclaradas: object[],
 *   completas: number,
 * }}
 */
export function linhasDosConcelhos() {
  const linhas = allClaims().filter((c) => c.study === ESTUDO_DOS_CONCELHOS);
  const porId = new Map(linhas.map((c) => [c.id, c]));

  const grupos = [];
  const usadas = new Set();
  for (const m of MUNICIPIOS_COM_PAGINA) {
    const minhas = [];
    for (const id of idsDoConcelho(m)) {
      const linha = porId.get(id);
      if (!linha || usadas.has(id)) continue;
      usadas.add(id);
      minhas.push(linha);
    }
    if (minhas.length > 0) grupos.push({ slug: m.slug, nome: m.nome, linhas: minhas });
  }

  const naoDeclaradas = linhas.filter((c) => !usadas.has(c.id));
  return {
    linhas,
    grupos,
    naoDeclaradas,
    completas: linhas.filter((c) => !provenienciaIncompleta(c)).length,
  };
}

/**
 * As três contagens desta página, num sítio só.
 *
 * `linhas`    — quantas linhas o estudo dos concelhos guarda.
 * `concelhos` — quantos concelhos têm pelo menos uma dessas linhas. **Não** é
 *               308 escrito à mão: é o que o livro-razão tem, e enquanto o
 *               exportador não correr é zero, que é a verdade.
 * `completas` — quantas dessas linhas não têm nenhum campo de proveniência por
 *               confirmar. É a mesma conta do índice principal, sobre este
 *               subconjunto.
 */
/**
 * As linhas de UM concelho, na ordem em que a entrada dele as declara.
 *
 * A ordem não é a alfabética do id: é a das sete medidas da Emenda 14, mais o
 * limite da dívida no fim, que é a referência da peça do índice. A página do
 * concelho mostra as medidas por essa ordem, e a página do livro-razão dele
 * mostra as linhas pela mesma: são a mesma coisa vista de dois lados.
 *
 * @param {(typeof MUNICIPIOS_COM_PAGINA)[number]} municipio  o registo de `municipios.mjs`
 */
export function linhasDeUmConcelho(municipio) {
  const doEstudo = new Map(
    allClaims()
      .filter((c) => c.study === ESTUDO_DOS_CONCELHOS)
      .map((c) => [c.id, c]),
  );
  const vistas = new Set();
  const linhas = [];
  for (const id of idsDoConcelho(municipio)) {
    const linha = doEstudo.get(id);
    if (!linha || vistas.has(id)) continue;
    vistas.add(id);
    linhas.push(linha);
  }
  return linhas;
}

export function contagensDosConcelhos() {
  const { linhas, grupos, completas } = linhasDosConcelhos();
  return { linhas: linhas.length, concelhos: grupos.length, completas };
}
