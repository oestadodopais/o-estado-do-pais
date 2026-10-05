/**
 * AS BARRAS DAS LINHAS DO LIVRO (bloco EX1, 05.10.2026, o ponto 3 do mandato).
 *
 * A forma de uma figura de uma explicação: uma barra por linha do livro-razão, da maior para a menor, com o
 * valor escrito ao lado pela própria linha. A casa já tinha barras, mas eram as dos blocos da primeira
 * página, presas à gramática deles (a barra do total, as escalas declaradas, a marca dos blocos que só vale
 * na primeira página e nas entradas); esta é a forma das linhas soltas, e entra na lista fechada das formas
 * do `check:formas`, que a recompõe a partir das linhas (a F22) como a F21 recompõe a `serie-do-pais`.
 *
 * AS REGRAS, todas daqui e nenhuma na vista:
 *   · a ordem é a dos valores, do maior para o menor; dois valores iguais ficam pela ordem declarada;
 *   · a escala é uma só para a figura inteira, de zero ao maior valor, e a fração de cada barra é o valor
 *     dividido pelo maior (a maior barra tem a faixa inteira);
 *   · uma linha sem valor legível, ou com valor negativo, é um defeito da declaração e fecha a construção:
 *     as linhas destas figuras são partes de um total, e uma parte negativa não se desenha como barra;
 *   · o rótulo de cada barra é o nome declarado da função ou do ministério da linha, sem o artigo
 *     (`rotuloDaLinhaNaExplicacao`), e a vista põe-lhe a primeira letra em maiúscula só pela folha.
 *
 * As frações saem com seis casas, e é com essas seis casas que a vista as escreve e a F22 as compara.
 */
import { getClaim, hasClaim, parsePtNumber } from '../ledger.mjs';
import { NOMES_OE1 } from '../../data/medidas-oe1.mjs';

/** O prefixo que separa a família do nome no nome do projeto (a cópia desta forma, para não importar o resolvedor). */
const PREFIXO = { pt: ' que vai para ', en: ' going to ' };
const ARTIGO = { pt: /^(?:o|a|os|as) /, en: /^the / };

/** A fração com seis casas, a forma com que a vista a escreve. @param {number} f */
export const fracaoEscrita = (f) => String(Number(f.toFixed(6)));

/**
 * @param {{ id: string, linhas: string[], titulo: { pt: string, en: string } }} figura
 * @param {'pt'|'en'} lang
 */
export function modeloDasBarrasDoLivro(figura, lang) {
  if (!Array.isArray(figura.linhas) || figura.linhas.length < 2) throw new Error(`barras-do-livro · ${figura.id}: uma figura de barras pede duas linhas ou mais.`);
  if (new Set(figura.linhas).size !== figura.linhas.length) throw new Error(`barras-do-livro · ${figura.id}: uma linha repetida.`);
  const lidas = figura.linhas.map((id, ordem) => {
    if (!hasClaim(id)) throw new Error(`barras-do-livro · ${figura.id}: a linha «${id}» não está no livro-razão.`);
    const l = getClaim(id);
    const valor = parsePtNumber(l.value);
    if (valor === null || !(valor >= 0)) throw new Error(`barras-do-livro · ${figura.id}: o valor de «${id}» («${l.value}») não é um número igual ou maior do que zero.`);
    const nome = /** @type {Record<string, { pt: string, en: string }>} */ (NOMES_OE1)[id]?.[lang];
    const i = typeof nome === 'string' ? nome.indexOf(PREFIXO[lang]) : -1;
    if (i < 0) throw new Error(`barras-do-livro · ${figura.id}: o nome do projeto de «${id}» não tem o prefixo «${PREFIXO[lang].trim()}».`);
    const rotulo = /** @type {string} */ (nome).slice(i + PREFIXO[lang].length).replace(ARTIGO[lang], '');
    return { linha: id, valor, texto: String(l.value), rotulo, ordem };
  });
  const maior = Math.max(...lidas.map((x) => x.valor));
  if (!(maior > 0)) throw new Error(`barras-do-livro · ${figura.id}: o maior valor é zero, e a escala ficava vazia.`);
  const barras = [...lidas]
    .sort((a, b) => b.valor - a.valor || a.ordem - b.ordem)
    .map(({ linha, valor, texto, rotulo }) => ({ linha, valor, texto, rotulo, fracao: Number((valor / maior).toFixed(6)) }));
  return { forma: /** @type {const} */ ('barras-do-livro'), id: figura.id, titulo: figura.titulo[lang], escala: { min: 0, max: maior }, barras };
}
