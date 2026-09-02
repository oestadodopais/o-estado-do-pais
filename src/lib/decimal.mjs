/**
 * ===========================================================================
 * A ARITMÉTICA DA CASA, DO LADO DO SÍTIO (bloco F0.5 do plano de 02.09.2026)
 * ===========================================================================
 *
 * O PORQUÊ, medido e não suposto. A auditoria de 02.09.2026 (§5, «Duas
 * especificações escritas duas vezes dão respostas diferentes») encontrou três
 * especificações duplicadas entre o motor e este sítio, e as três discordavam:
 *
 *   · `round ( 0,5 , 0 )` dava 0 no motor e 1 aqui; `round ( 2,5 , 0 )` dava 2
 *     e 3. O motor usava o `Decimal.quantize` no contexto por omissão do
 *     Python, que é meio-para-o-par;
 *   · as contas corriam em `Decimal` de 28 algarismos lá e em `float64` aqui;
 *   · a aceitação de uma derivação era igualdade exata lá («there is no
 *     tolerance») e `Math.abs(calculado - publicado) > 1e-9` aqui, uma
 *     tolerância absoluta cega à grandeza: numa linha de milhões não recusava
 *     nada, e numa linha pequena tapava o erro que o `check` existe para ver.
 *
 * Uma linha num meio exato era, portanto, aceite por um portão e recusada pelo
 * outro. Este módulo fecha a metade do sítio: é o `decimal` do Python, com o
 * contexto que o motor corre, escrito em inteiros grandes.
 *
 * AS TRÊS REGRAS, que são as do `core/derivations.py`:
 *
 *   1. as contas intermédias (`+ - * /`) correm com **28 algarismos
 *      significativos** e **meio-para-o-par**, que é o contexto por omissão do
 *      `decimal` do Python. Não é uma escolha editorial: é a norma que o motor
 *      herda, e a divisão precisa dela (`1 / 3` tem de parar em algum lado);
 *   2. o `round ( x , n )` arredonda **meio para longe do zero**, e é a única
 *      decisão de meio caminho do avaliador. Esta é editorial, e a razão está
 *      escrita: é o arredondamento que os publicadores portugueses imprimem;
 *   3. a comparação é **exata, por valor**: `71` e `71,0` são o mesmo número, e
 *      `0,1 + 0,2` não é `0,3` por pouco. Sem tolerância de nenhuma espécie.
 *
 * PORQUE NÃO UMA BIBLIOTECA. A gramática das expressões `check` é `+ - * /`,
 * parênteses e `round ( x , n )`, e mais nada: medido a 02.09.2026 sobre as 334
 * linhas do livro-razão que trazem `check`, os símbolos usados são exatamente
 * esses e as casas pedidas ao `round` são 0, 1 e 2. Uma dependência nova
 * (`decimal.js` são 1 300 linhas e uma superfície de API que ninguém deste lado
 * usaria) traria muito mais do que isto e um contrato que não é o do motor: o
 * que é preciso não é «decimais», é **as regras do `core/derivations.py`**, e
 * essas escrevem-se aqui, com o comentário de cada uma ao lado da linha que a
 * impõe. O que este módulo tem: somar, subtrair, multiplicar, dividir,
 * arredondar e comparar, sobre `BigInt`, sem uma única operação em vírgula
 * flutuante.
 *
 * A PROVA DE QUE AS DUAS CASAS CONTINUAM A DIZER O MESMO é
 * `ledger/derivacoes-paridade.json`: um ficheiro de expressões com a resposta
 * que as regras da casa lhes dão, escrito no motor
 * (`core/derivacoes-paridade.json`), atravessado com os bytes presos
 * (`ledger/cruzamentos/paridade.json`, conferido pelo `check:cruzamento`) e
 * avaliado pelos dois portões: `python3 -m core.derivations_test` e
 * `node scripts/check-ledger.mjs`.
 *
 * UM VALOR é `{ neg, coef, exp }` e vale `(neg ? -1 : 1) × coef × 10^exp`, com
 * `coef` um `BigInt` nunca negativo. É a tripla do `decimal` do Python, e o
 * sinal anda à parte de propósito: o arredondamento é sobre a grandeza, e é
 * assim que «meio para longe do zero» é uma regra e não dois casos.
 */

/** Os algarismos significativos das contas intermédias. O `prec` do Python. */
export const PRECISAO = 28;

/** Quantos algarismos tem este inteiro não negativo. */
function algarismos(n) {
  return n === 0n ? 1 : String(n).length;
}

/** 10^k como `BigInt`, para k inteiro não negativo. */
function dez(k) {
  return 10n ** BigInt(k);
}

export class Decimal {
  /**
   * @param {boolean} neg
   * @param {bigint} coef  nunca negativo
   * @param {number} exp
   */
  constructor(neg, coef, exp) {
    this.neg = Boolean(neg);
    this.coef = coef;
    this.exp = exp;
  }

  /**
   * Um decimal a partir de uma cadeia `-?\d+(\.\d+)?`.
   *
   * É a mesma forma que o motor lê: o `claim_value_canonical` do
   * `core/reconcile.py` reduz o valor publicado a esta forma antes de o dar ao
   * `Decimal` do Python. Uma cadeia que não seja esta atira, e nunca dá zero:
   * um zero em vez de uma recusa era um número inventado.
   */
  static de(texto) {
    const s = String(texto).trim();
    const m = /^([+-]?)(\d+)(?:\.(\d+))?$/.exec(s);
    if (!m) throw new Error(`"${texto}" não é um número decimal simples`);
    const fracao = m[3] ?? '';
    return new Decimal(m[1] === '-', BigInt(m[2] + fracao), -fracao.length);
  }

  /** Zero é zero, com qualquer expoente e com qualquer sinal. */
  get zero() {
    return this.coef === 0n;
  }

  /**
   * O mesmo valor com os zeros à direita tirados: a `normalize()` do Python.
   *
   * É o que faz a igualdade ser POR VALOR: `71` e `71,0` normalizam para a
   * mesma tripla.
   */
  normaliza() {
    /* O SINAL DO ZERO FICA, e a igualdade é que o ignora: é o que o Python faz
       (`Decimal('-0.00').normalize()` dá `-0`, e `Decimal('-0') == 0` é
       verdade). Fica porque a cadeia canónica das mensagens de erro tem de ser
       a mesma dos dois lados, e o motor imprime `-0`. */
    if (this.zero) return new Decimal(this.neg, 0n, 0);
    let coef = this.coef;
    let exp = this.exp;
    while (coef % 10n === 0n) {
      coef /= 10n;
      exp += 1;
    }
    return new Decimal(this.neg, coef, exp);
  }

  /** Este valor é exatamente aquele? Por valor, nunca por cadeia. */
  igual(outro) {
    /* Zero é zero, com qualquer sinal e com qualquer expoente. */
    if (this.zero && outro.zero) return true;
    const a = this.normaliza();
    const b = outro.normaliza();
    return a.neg === b.neg && a.coef === b.coef && a.exp === b.exp;
  }

  /** O valor escrito por extenso, sem notação exponencial. */
  toString() {
    const sinal = this.neg ? '-' : '';
    const d = this.coef.toString();
    if (this.exp >= 0) return sinal + d + '0'.repeat(this.exp);
    const casas = -this.exp;
    const cheio = d.padStart(casas + 1, '0');
    return `${sinal}${cheio.slice(0, cheio.length - casas)}.${cheio.slice(cheio.length - casas)}`;
  }

  /**
   * O valor sem os zeros à direita: a forma canónica das mensagens de erro.
   *
   * É a mesma cadeia que o `_as_canonical` do motor imprime
   * (`format(valor.normalize(), 'f')`), para que uma linha vermelha aqui e uma
   * linha vermelha lá se possam comparar sem tradução.
   */
  canonica() {
    return this.normaliza().toString();
  }

  /**
   * Uma aproximação em vírgula flutuante, para quem só quer desenhar.
   *
   * NÃO SE USA EM NENHUMA COMPARAÇÃO. Está aqui porque uma vista que desenha
   * uma barra precisa de um número e não de uma prova, e porque a alternativa
   * (deixar cada chamador escrever a sua própria conversão) é como as duas
   * aritméticas apareceram.
   */
  paraNumero() {
    return Number(this.toString());
  }
}

/**
 * Arredondar a grandeza a `PRECISAO` algarismos, meio-para-o-par.
 *
 * É o `_fix()` do `decimal` do Python: toda a operação aritmética passa por
 * aqui, e é por aqui que `1 / 3 * 3` dá `0,999…9` com 28 noves e não 1.
 */
function ajusta(neg, coef, exp) {
  const n = algarismos(coef);
  if (n <= PRECISAO) return new Decimal(neg, coef, exp);
  const corta = n - PRECISAO;
  const p = dez(corta);
  let q = coef / p;
  const resto = coef % p;
  const dobro = resto * 2n;
  /* Meio-para-o-par: passa do meio sobe; exatamente no meio sobe só se o
     algarismo que fica for ímpar. */
  if (dobro > p || (dobro === p && q % 2n === 1n)) q += 1n;
  let novoExp = exp + corta;
  /* O transporte pode acrescentar um algarismo (999…9 passa a 100…0). */
  if (algarismos(q) > PRECISAO) {
    q /= 10n;
    novoExp += 1;
  }
  return new Decimal(neg, q, novoExp);
}

/** O par de coeficientes com sinal, alinhados no expoente mais baixo. */
function alinha(a, b) {
  const exp = Math.min(a.exp, b.exp);
  const ca = (a.neg ? -a.coef : a.coef) * dez(a.exp - exp);
  const cb = (b.neg ? -b.coef : b.coef) * dez(b.exp - exp);
  return [ca, cb, exp];
}

function daSoma(soma, exp) {
  return ajusta(soma < 0n, soma < 0n ? -soma : soma, exp);
}

export function soma(a, b) {
  const [ca, cb, exp] = alinha(a, b);
  return daSoma(ca + cb, exp);
}

export function subtrai(a, b) {
  const [ca, cb, exp] = alinha(a, b);
  return daSoma(ca - cb, exp);
}

export function multiplica(a, b) {
  return ajusta(a.neg !== b.neg, a.coef * b.coef, a.exp + b.exp);
}

/** Uma divisão que não fecha. O portão pára, e não escolhe um número. */
export class DivisaoPorZero extends Error {}

/**
 * A divisão do `decimal` do Python, algarismo a algarismo.
 *
 * O algoritmo é o do `_pydecimal.__truediv__`, e está aqui inteiro porque a
 * divisão é a única operação em que «28 algarismos» muda a resposta e não só o
 * comprimento dela: calcula-se o quociente com um algarismo a mais do que a
 * precisão, e depois:
 *
 *   · se sobrou resto, o quociente é inexato, e um quociente que acabe em 0 ou
 *     em 5 é empurrado em uma unidade para que o arredondamento seguinte não
 *     caia num meio que não existe (é a correção clássica do algoritmo, e sem
 *     ela `1 / 3` arredondaria mal na última casa);
 *   · se não sobrou resto, a divisão é exata, e o resultado encolhe até ao
 *     expoente ideal (`exp(a) - exp(b)`), que é o que faz `3 / 1` dar `3` e não
 *     `3,000…`.
 */
export function divide(a, b) {
  if (b.zero) throw new DivisaoPorZero('a expressão check divide por zero');
  const neg = a.neg !== b.neg;
  if (a.zero) return ajusta(neg, 0n, a.exp - b.exp);

  const desvio = algarismos(b.coef) - algarismos(a.coef) + PRECISAO + 1;
  let exp = a.exp - b.exp - desvio;
  let quociente;
  let resto;
  if (desvio >= 0) {
    const numerador = a.coef * dez(desvio);
    quociente = numerador / b.coef;
    resto = numerador % b.coef;
  } else {
    const denominador = b.coef * dez(-desvio);
    quociente = a.coef / denominador;
    resto = a.coef % denominador;
  }
  if (resto !== 0n) {
    if (quociente % 5n === 0n) quociente += 1n;
  } else {
    const expIdeal = a.exp - b.exp;
    while (exp < expIdeal && quociente % 10n === 0n) {
      quociente /= 10n;
      exp += 1;
    }
  }
  return ajusta(neg, quociente, exp);
}

/** O menos unário. O zero muda de sinal e continua a ser zero. */
export function nega(a) {
  return new Decimal(!a.neg, a.coef, a.exp);
}

/**
 * `round ( x , casas )`: meio PARA LONGE DO ZERO.
 *
 * É a `quantize(…, rounding=ROUND_HALF_UP)` do motor, e a única decisão de meio
 * caminho do avaliador. Faz-se sobre a GRANDEZA, com o sinal de fora, e é isso
 * que a torna simétrica: `0,5` dá 1 e `-0,5` dá -1. O `Math.round()` do
 * JavaScript sozinho não serve, porque arredonda para cima no sentido do eixo e
 * dá 0 para `-0,5`; a linha que estava aqui antes já corrigia isso com
 * `Math.sign()`, e o que ela não podia corrigir era o `float64` por baixo:
 * `1,005 × 100` são `100.49999999999999`, e o arredondamento dava `1,00`.
 */
export function arredonda(a, casas) {
  const alvo = -casas;
  const desvio = a.exp - alvo;
  let coef;
  if (desvio >= 0) {
    coef = a.coef * dez(desvio);
  } else {
    const p = dez(-desvio);
    const q = a.coef / p;
    const resto = a.coef % p;
    coef = resto * 2n >= p ? q + 1n : q;
  }
  if (algarismos(coef) > PRECISAO) {
    throw new Error(
      `arredondar ${a.canonica()} a ${casas} casa(s) precisa de mais de ${PRECISAO} algarismos`,
    );
  }
  return new Decimal(a.neg, coef, alvo);
}
