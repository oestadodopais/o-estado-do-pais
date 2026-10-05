/**
 * AS EXPLICAÇÕES, a lista (bloco EX1, 05.10.2026).
 *
 * Uma explicação é uma dinâmica explicada em português corrente com os números do país, escrita uma vez
 * pelo lugar de direção e presa ao livro-razão: cada algarismo é uma linha, cada nome é o declarado da
 * linha, e cada frase que compara tem o ramo que os números decidem (o brief EX1, §5, ponto 3). Esta é a
 * lista delas, pela data de escrita, a mais recente primeiro; a página «Explicações» e o bloco «Para
 * perceber» da primeira página leem-na daqui e de mais lado nenhum.
 *
 * A PÁGINA DA LEITURA DA SEMANA vive debaixo da mesma rota, num segmento fixo; nenhuma explicação pode ter
 * esse segmento por nome, e uma que o tivesse fecha a construção aqui.
 */
import { DINHEIRO_DO_ESTADO_2026 } from './dinheiro-do-estado-2026.mjs';

/** O segmento da página da leitura da semana, em cada edição (`src/lib/routes.mjs`, `leituraDaSemana`). */
export const SEGMENTO_DA_SEMANA = /** @type {const} */ ({ pt: 'leitura-da-semana', en: 'weekly-reading' });

/** As explicações, da escrita mais recente para a mais antiga. */
export const EXPLICACOES = [DINHEIRO_DO_ESTADO_2026].sort((a, b) => b.escrita.localeCompare(a.escrita) || a.slug.localeCompare(b.slug));

for (const e of EXPLICACOES) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.slug)) throw new Error(`explicações: o slug «${e.slug}» não é minúsculas, algarismos e hífenes.`);
  if (Object.values(SEGMENTO_DA_SEMANA).includes(/** @type {any} */ (e.slug))) throw new Error(`explicações: o slug «${e.slug}» é o segmento da página da leitura da semana.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.escrita)) throw new Error(`explicações: a data de escrita de «${e.slug}» não é AAAA-MM-DD.`);
}
if (new Set(EXPLICACOES.map((e) => e.slug)).size !== EXPLICACOES.length) throw new Error('explicações: dois slugs iguais.');
