/**
 * O ESTADO DE UMA MEDIDA CONTRA A SUA REFERÊNCIA.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE, E O QUE NÃO PRODUZ
 * ---------------------------------------------------------------------------
 * A Emenda 1 de 20.08.2026 fecha a cor: **cor só onde a fonte publica um limiar
 * formal** — âmbar no marcador e ocre na palavra quando o valor está fora dele,
 * cobalto quando está dentro. Posições face a médias, destaques e rankings ficam
 * a tinta e a palavras. Este módulo é o sítio único onde essa comparação se faz,
 * para que a peça, a fila de estados e a régua digam todas a mesma coisa.
 *
 * **NENHUMA FUNÇÃO DAQUI DEVOLVE UM ALGARISMO.** Devolvem uma de quatro
 * palavras-chave (`'fora'`, `'dentro'`, `'sem'`, `null`), e o gabarito escolhe a
 * cadeia da edição. É a mesma disciplina de `comparacaoComOLimiar()` em
 * `src/data/figuras.mjs`: prosa da casa gerada de dois números que já existem,
 * e não um número novo. Uma distância em algarismos é a decisão (e) do plano, e
 * a fase 1 não a publica.
 *
 * `null` NÃO É UM ESTADO: é a ausência de comparação. Rende-se como nada — nem
 * palavra, nem quadrado, nem barra. Uma palavra inventada onde a comparação
 * falhou seria pior do que o silêncio.
 */

import { parsePtNumber } from './ledger.mjs';
import { ladosDoLimiar } from '../data/figuras.mjs';

/**
 * O estado de uma medida do painel contra o limiar que o quadro publica.
 *
 * @param {{ value?: any }|null|undefined} claim  a linha do livro-razão
 * @param {{ nl: string, sinal?: string, lado?: 'superior'|'inferior' }|null|undefined} limiar
 * @returns {'fora'|'dentro'|'sem'|null}
 *
 *   `'sem'`     não há limiar publicado para esta medida. É um estado, e
 *               diz-se por palavras («sem limiar»), a tinta e sem cor.
 *   `'fora'`    o valor passou o limiar do lado declarado.
 *   `'dentro'`  o valor está do lado certo, OU está exactamente no limiar.
 *   `null`      um dos dois lados não é um número simples, ou o limiar não
 *               declara lado. Não se rende.
 *
 * A IGUALDADE CONTA COMO `dentro`, e é uma escolha, não um acaso: um limiar do
 * quadro é «não passar de», e quem está exactamente nele não passou. A regra
 * fica escrita aqui porque é o género de decisão que, deixada implícita, muda
 * sozinha na primeira reescrita.
 *
 * O LADO É LIDO, NUNCA ADIVINHADO. Sem `lado` declarado não há comparação
 * possível e a resposta é `null`: inferir «negativo, logo chão» acertaria na
 * posição de investimento internacional e erraria na primeira linha negativa
 * com teto que o painel viesse a ganhar.
 *
 * ---------------------------------------------------------------------------
 * A BANDA DE DOIS LADOS (etapa 2l, Emenda 16)
 * ---------------------------------------------------------------------------
 * Duas das treze linhas do Procedimento não têm um lado: têm dois. O saldo da
 * balança corrente publica «-4/+6%» e a taxa de câmbio efetiva real publica
 * «+/-3%», e as duas notas escrevem os dois lados. Estar DENTRO é estar entre
 * eles; estar fora é passar um dos dois, e a regra é a mesma dos dois lados
 * (a igualdade continua a contar como dentro, pela mesma razão de sempre).
 *
 * A leitura da declaração vive numa função só, `ladosDoLimiar()`, ao lado da
 * declaração: um teto é uma banda sem chão, um chão é uma banda sem teto, e
 * escrever a comparação uma vez sobre `{ inferior, superior }` é o que faz com
 * que uma banda não seja um caso especial com regras próprias. Uma banda a que
 * falte um dos lados por engano cai no caso de um lado só e não em silêncio.
 *
 * O PORTÃO NÃO CHAMA ISTO. `scripts/gate-html.mjs` escreve a sua própria
 * leitura da declaração e a sua própria comparação, pela razão que a §1.24
 * fixou: importar a função punha a mesma regra dos dois lados da conta.
 */
export function estadoDaMedida(claim, limiar) {
  if (!limiar) return 'sem';
  const valor = parsePtNumber(claim?.value);
  if (valor === null) return null;
  const lados = ladosDoLimiar(limiar);
  if (!lados) return null;
  const inferior = lados.inferior === null ? null : parsePtNumber(lados.inferior);
  const superior = lados.superior === null ? null : parsePtNumber(lados.superior);
  if (lados.inferior !== null && inferior === null) return null;
  if (lados.superior !== null && superior === null) return null;
  if (inferior === null && superior === null) return null;
  if (superior !== null && valor > superior) return 'fora';
  if (inferior !== null && valor < inferior) return 'fora';
  return 'dentro';
}

/**
 * O estado de uma medida contra uma referência que é outra LINHA do livro-razão
 * — o caso das peças do município (etapa 2c, R2).
 *
 * Duas referências, e só uma delas colore:
 *
 *   · o **teto legal** do índice de dívida (`indice-de-divida-limite-legal`) é
 *     um limiar formal publicado: a lei fixa-o, e por isso a peça colore
 *     (cobalto quando o concelho está dentro dele);
 *   · a **base 100** de um índice cuja unidade é uma média (o poder de compra
 *     por habitante, «Portugal = 100») é uma média, e a Emenda 1 tira-lhe a
 *     cor: a posição diz-se por palavras, a tinta.
 *
 * Devolve `{ estado, colore }`, e nunca um algarismo. `colore: false` com
 * `estado: 'dentro'` é uma resposta legítima e é exactamente o caso do poder de
 * compra: o sítio sabe de que lado da média o concelho está, e desenha-o a
 * tinta.
 *
 * @param {{ value?: any }|null|undefined} claim
 * @param {{ valor: string|number, lado: 'superior'|'inferior', colore: boolean }} referencia
 * @returns {{ estado: 'fora'|'dentro'|null, colore: boolean }}
 */
export function estadoDaRegua(claim, referencia) {
  const fora = { estado: null, colore: false };
  if (!referencia) return fora;
  const valor = parsePtNumber(claim?.value);
  const alvo = parsePtNumber(String(referencia.valor));
  if (valor === null || alvo === null) return fora;
  const estado =
    referencia.lado === 'superior'
      ? valor > alvo
        ? 'fora'
        : 'dentro'
      : referencia.lado === 'inferior'
        ? valor < alvo
          ? 'fora'
          : 'dentro'
        : null;
  if (estado === null) return fora;
  return { estado, colore: referencia.colore === true };
}

/**
 * ---------------------------------------------------------------------------
 * A ESCALA DE UMA RÉGUA, CALCULADA E NÃO ESCRITA
 * ---------------------------------------------------------------------------
 *
 * A Emenda 4 fixa uma só gramática: referência a tinta à altura toda, barra =
 * distância à referência, traço fino = valor, **nenhuma barra sem referência
 * publicada**. Falta-lhe a escala, e a escala tem pontas escritas.
 *
 * As pontas são ESCALA DE INSTRUMENTO, não medições: vão marcadas
 * `data-nonledger="escala-de-instrumento"`, como as marcas do eixo da régua da
 * convergência já vão. Mas não podem ser escritas à mão, ou seriam dois números
 * plausíveis por medida — oito pares que ninguém volta a conferir. Saem daqui,
 * dos dois números que já existem na página (o valor publicado e a referência
 * publicada), por uma regra mecânica:
 *
 *   1. o intervalo bruto vai do menor ao maior de {0, valor, referência}. O zero
 *      entra sempre porque é a origem da unidade: uma barra que não mostra de
 *      onde parte convida a comparar comprimentos entre réguas diferentes;
 *   2. o passo é o menor de {1, 2, 5} × 10^k que chegue para cinco divisões;
 *   3. as pontas arredondam para fora, ao passo;
 *   4. e abre-se um passo extra do lado onde está o VALOR, quando o
 *      arredondamento o deixaria em cima da ponta. Do lado da REFERÊNCIA não se
 *      abre: uma referência que calha na ponta desenha-se na ponta, que é
 *      exactamente onde um teto legal deve estar.
 *
 * Devolve `{ min, max }` como números; quem escreve os rótulos é o gabarito,
 * pela mesma função de escrita da casa.
 */
export function escalaDaRegua(valor, referencia) {
  if (valor === null || referencia === null || referencia === undefined) return null;
  /* UMA REFERÊNCIA OU DUAS (etapa 2l). Uma banda tem dois lados publicados, e a
     escala tem de conter os dois: passa-se um array, e o resto da regra não
     muda uma linha. Um array com um `null` lá dentro é uma referência a meio,
     e não se desenha. */
  const refs = (Array.isArray(referencia) ? referencia : [referencia]).filter((r) => r !== undefined);
  if (!refs.length || refs.some((r) => r === null || !Number.isFinite(r))) return null;
  const lo = Math.min(0, valor, ...refs);
  const hi = Math.max(0, valor, ...refs);
  const amplitude = hi - lo;
  if (!(amplitude > 0)) return null;

  const alvo = amplitude / 5;
  const k = Math.floor(Math.log10(alvo));
  let passo = null;
  for (const potencia of [k, k + 1, k + 2]) {
    for (const m of [1, 2, 5]) {
      const candidato = m * 10 ** potencia;
      if (candidato >= alvo) {
        passo = candidato;
        break;
      }
    }
    if (passo !== null) break;
  }
  if (passo === null || !(passo > 0)) return null;

  /* Em vírgula flutuante, `Math.floor(-50.2 / 10) * 10` é seguro, mas
     `0.1 * 3` não é: as pontas passam por `arredonda()` para que um passo
     decimal não escreva «19,999999999999996» no rótulo da escala. */
  const arredonda = (n) => Number(n.toFixed(10));
  let min = arredonda(Math.floor(lo / passo) * passo);
  let max = arredonda(Math.ceil(hi / passo) * passo);
  if (max === hi && hi === valor) max = arredonda(max + passo);
  if (min === lo && lo === valor) min = arredonda(min - passo);
  if (!(max > min)) return null;
  return { min, max, passo };
}

/**
 * A posição de um número na régua, em percentagem da largura.
 *
 * É geometria de desenho, e não um valor: o que sai daqui vai para um atributo
 * de SVG (`x`, `x1`), nunca para texto. Fica presa ao intervalo para que um
 * valor fora da escala não desenhe fora da caixa.
 */
export function posicaoNaRegua(n, escala) {
  if (!escala || n === null) return null;
  const p = ((n - escala.min) / (escala.max - escala.min)) * 100;
  return Math.max(0, Math.min(100, p));
}
