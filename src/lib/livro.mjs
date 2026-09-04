/**
 * O livro-razão publicado: endereços e cabeçalho de uma página de linha.
 *
 * Existe para que o <head> de uma página de linha seja **composto a partir da
 * própria linha** e não escrito num gabarito. O portão de HTML importa daqui as
 * mesmas funções e exige que o título e a descrição construídos sejam iguais,
 * carácter a carácter, ao que estas devolvem.
 *
 * LIMITE HONESTO, e está dito também no fim de scripts/gate-html.mjs: página e
 * portão chamam a mesma função, por isso essa verificação não prova que a frase
 * esteja certa — prova que o cabeçalho não foi escrito à mão, que é da linha
 * certa e que é da língua certa. É o que se pode conferir sem manter a mesma
 * frase escrita em dois sítios, que divergiria na primeira alteração.
 */

import { routePath } from './routes.mjs';
import { eDerivada, documentoDaLinha } from './ledger.mjs';
import { t } from '../i18n/strings.mjs';
import { unidadeDaLinha } from '../i18n/unidades.mjs';
import { SITE_NAME } from '../../site.config.mjs';

/**
 * O endereço da página de uma afirmação, numa língua.
 *
 * @param {string} id
 * @param {Lingua} lang
 */
export function caminhoDaLinha(id, lang) {
  return routePath('linha', lang, { slug: id });
}

/**
 * O endereço do índice do livro-razão, numa língua.
 *
 * @param {Lingua} lang
 */
export function caminhoDoLivro(lang) {
  return routePath('livro', lang);
}

/**
 * O valor com a sua unidade, escrito como a §11 da constituição manda.
 *
 * Uma unidade que **começa por um símbolo** cola-se ao número: «26,5%»,
 * «89,7% do PIB». Uma unidade que começa por uma palavra leva o espaço:
 * «82 índice (UE-27 = 100)», «54 681 562 euros». Colar sempre daria
 * «82índice (UE-27 = 100)», e separar sempre dá «26,5 %», que é o que a §11
 * recusa: a percentagem escreve-se colada ao número.
 *
 * Hoje o único símbolo em uso é `%`: trinta e seis das 132 linhas começam a
 * unidade por ele. A regra é escrita pela forma da unidade e não por uma lista
 * de unidades, para não haver uma segunda lista a manter ao lado do
 * livro-razão.
 *
 * @param {Linha} claim
 * @param {string | null} [lang]
 */
export function valorComUnidade(claim, lang = null) {
  /* A LÍNGUA É OPCIONAL, E QUEM NÃO A PASSA FICA COM A CADEIA DO LIVRO-RAZÃO.
     Desde a I92 (29.08.2026) a unidade tem inglês onde há um facto de
     dicionário (`src/i18n/unidades.mjs`), e o título e a descrição da página de
     uma linha passam a língua para o dizerem na língua da página.

     OS CARTÕES DE PARTILHA TAMBÉM A PASSAM, DESDE 04.09.2026 (I96, bloco F1.7).
     Até aí não passavam, e era uma dívida escrita e não um esquecimento: a
     manchete de um cartão é medida em píxeis e desenhada em PNG com o seu
     registo, e traduzir a unidade ali era reconstruir os cartões todos. Medido
     antes de a pagar: 204 dos 302 registos da edição inglesa levavam a unidade
     em português ao lado de uma página que já a escrevia em inglês. O que fica
     por passar a língua é quem NÃO tem edição: `dados.mjs`, que escreve a
     descarga em CSV a partir do livro-razão e não de uma página. */
  const unidade = lang === null ? String(claim.unit ?? '') : unidadeDaLinha(claim.unit, lang).texto;
  if (!unidade) return String(claim.value);
  const comecaPorLetra = /^\p{L}/u.test(unidade);
  return comecaPorLetra ? `${claim.value} ${unidade}` : `${claim.value}${unidade}`;
}

/**
 * O título de uma página de linha: o valor, a unidade, a secção e a marca.
 * Sem prosa — é a linha a dizer o que é.
 *
 * @param {Linha} claim
 * @param {Lingua} lang
 */
export function tituloDaLinha(claim, lang) {
  const s = t(lang);
  return `${valorComUnidade(claim, lang)} · ${s.livro.eyebrow} · ${SITE_NAME}`;
}

/**
 * A descrição de uma página de linha, composta dos campos da própria linha.
 *
 * Um campo por confirmar entra como está — «[a verificar]». A descrição de uma
 * linha incompleta diz que está incompleta; não se compõe uma frase que pareça
 * completa a partir de campos que não estão.
 *
 * @param {Linha} claim
 * @param {Lingua} lang
 */
export function descricaoDaLinha(claim, lang) {
  const s = t(lang);
  const partes = [`${s.livro.linha.eyebrow} ${claim.id}`, valorComUnidade(claim, lang)];

  if (eDerivada(claim)) {
    partes.push(s.prov.naoPublicado);
  }
  if (claim.source) partes.push(`${s.prov.fonte}: ${claim.source}`);
  const doc = documentoDaLinha(claim);
  if (doc?.title) {
    partes.push(`${doc.title} (${doc.edition})`);
  }
  /* «Lido a 2026-08-12», não «Lido a: 2026-08-12» — o rótulo já traz a
     preposição. A fonte leva dois pontos porque o rótulo é um substantivo. */
  if (claim.access_date) partes.push(`${s.prov.lido} ${claim.access_date}`);
  if (claim.reference_date) partes.push(`${s.prov.referencia} ${claim.reference_date}`);

  return partes.join(' · ') + '.';
}
