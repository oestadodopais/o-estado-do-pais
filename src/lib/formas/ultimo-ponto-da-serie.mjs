/**
 * O QUE O ÚLTIMO PONTO DE UMA SÉRIE QUER DIZER · bloco R4 (05.10.2026), o ponto 3 e a decisão 4 do brief
 * `design/observatorio/BRIEF-R4-as-palavras-correntes-em-cada-numero.md`.
 *
 * O recibo de uma série no tempo mostrava o último ponto sem dizer se é mais ou menos do que há um ano. A frase que
 * o diz escreve-se com as cadeias da casa (`livro.serieNoTempo.ultimo*`, nas duas edições) e com os componentes da
 * série: o período e o valor de cada ponto vão pelas suas marcas (`DataDaSerie`, `PontoDaSerie`), e a palavra do lado
 * é a que esta conta escolhe. Este módulo não escreve texto: diz que pontos se comparam e de que lado fica o último.
 *
 * A COMPARAÇÃO É COM O MESMO PERÍODO DE HÁ UM ANO: o mesmo mês, o mesmo trimestre, o mesmo semestre ou o ano
 * anterior, que é a comparação que o leitor faz de cabeça e a que a fonte usa nas variações homólogas. Quando a série
 * não tem esse ponto (a cadência começou há menos de um ano, ou a fonte não publicou o valor), compara com o ponto
 * anterior, e a frase diz que é com ele.
 *
 * O desenho da série não muda aqui: é do bloco RP4-c, e este módulo fica ao lado de `serie-do-pais.mjs`.
 */
import { pontosDaSerie } from '../series.mjs';
import { parsePtNumber } from '../ledger.mjs';

/**
 * O mesmo período, um ano antes: «2026-08» dá «2025-08», «2026-T2» dá «2025-T2», «2026-S2» dá «2025-S2», «2025» dá
 * «2024». Um período de outra forma atira.
 * @param {string} periodo
 */
export function periodoDeHaUmAno(periodo) {
  const m = /^(\d{4})(-(?:0[1-9]|1[0-2]|T[1-4]|S[12]))?$/.exec(String(periodo));
  if (!m) throw new Error(`o período «${periodo}» não tem uma forma que a frase do último ponto conheça`);
  return `${Number(m[1]) - 1}${m[2] ?? ''}`;
}

/**
 * @typedef {{ indice: number, periodo: string, valor: string, bandeira: string | null }} PontoComparado
 * @typedef {{ ultimo: PontoComparado, outro: PontoComparado, com: 'ha-um-ano' | 'anterior', lado: 'maior' | 'menor' | 'igual' }} ComparacaoDoUltimo
 */

/**
 * Os dois pontos que a frase compara e o lado do último. Uma série com menos de dois pontos não tem frase (`null`).
 * @param {any} serie
 * @returns {ComparacaoDoUltimo | null}
 */
export function comparacaoDoUltimoPonto(serie) {
  const pontos = pontosDaSerie(serie);
  if (pontos.length < 2) return null;
  /** @param {number} i @returns {PontoComparado} */
  const ponto = (i) => ({
    indice: i,
    periodo: String(pontos[i].periodo),
    valor: String(pontos[i].valor),
    bandeira: pontos[i].bandeira ? String(pontos[i].bandeira) : null,
  });
  const iUltimo = pontos.length - 1;
  const alvo = periodoDeHaUmAno(String(pontos[iUltimo].periodo));
  const iHaUmAno = pontos.findIndex((p) => String(p.periodo) === alvo);
  const com = iHaUmAno >= 0 ? 'ha-um-ano' : 'anterior';
  const iOutro = iHaUmAno >= 0 ? iHaUmAno : iUltimo - 1;
  const a = parsePtNumber(String(pontos[iUltimo].valor));
  const b = parsePtNumber(String(pontos[iOutro].valor));
  if (a === null || b === null) throw new Error(`série «${serie?.id}»: o último ponto ou o ponto com que se compara não é um número.`);
  return { ultimo: ponto(iUltimo), outro: ponto(iOutro), com, lado: a > b ? 'maior' : a < b ? 'menor' : 'igual' };
}
