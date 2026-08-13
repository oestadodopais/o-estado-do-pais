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
import { eDerivada } from './ledger.mjs';
import { t } from '../i18n/strings.mjs';
import { SITE_NAME } from '../../site.config.mjs';

/** O endereço da página de uma afirmação, numa língua. */
export function caminhoDaLinha(id, lang) {
  return routePath('linha', lang, { slug: id });
}

/** O endereço do índice do livro-razão, numa língua. */
export function caminhoDoLivro(lang) {
  return routePath('livro', lang);
}

/**
 * O título de uma página de linha: o valor, a unidade, a secção e a marca.
 * Sem prosa — é a linha a dizer o que é.
 */
export function tituloDaLinha(claim, lang) {
  const s = t(lang);
  return `${claim.value} ${claim.unit} — ${s.livro.eyebrow} — ${SITE_NAME}`;
}

/**
 * A descrição de uma página de linha, composta dos campos da própria linha.
 *
 * Um campo por confirmar entra como está — «[a verificar]». A descrição de uma
 * linha incompleta diz que está incompleta; não se compõe uma frase que pareça
 * completa a partir de campos que não estão.
 */
export function descricaoDaLinha(claim, lang) {
  const s = t(lang);
  const partes = [`${s.livro.linha.eyebrow} ${claim.id}`, `${claim.value} ${claim.unit}`];

  if (eDerivada(claim)) {
    partes.push(s.prov.naoPublicado);
  }
  if (claim.source) partes.push(`${s.prov.fonte}: ${claim.source}`);
  if (claim.document?.title) {
    partes.push(`${claim.document.title} (${claim.document.edition})`);
  }
  /* «Lido a 2026-08-12», não «Lido a: 2026-08-12» — o rótulo já traz a
     preposição. A fonte leva dois pontos porque o rótulo é um substantivo. */
  if (claim.access_date) partes.push(`${s.prov.lido} ${claim.access_date}`);
  if (claim.reference_date) partes.push(`${s.prov.referencia} ${claim.reference_date}`);

  return partes.join(' · ') + '.';
}
