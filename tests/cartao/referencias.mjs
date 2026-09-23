import { ladosDoLimiar } from '../../src/data/figuras.mjs';

/**
 * Os números de um valor de referência, com sinal, e o sentido dele.
 *
 * Lê as duas formas: a cadeia que o motor copia da página da Comissão («60%»,
 * «-35%», «-4/+6%», «+/-3% (EA)», «-0.2pp») e a declaração estruturada de
 * `figuras.mjs`. Devolve os números por ordem crescente, para que a comparação
 * não dependa de qual das duas escreveu primeiro o lado de baixo.
 *
 * `+/-n` E `-/+n` SÃO DUAS PONTAS E NÃO UMA, e é o caso do câmbio efetivo real:
 * uma expressão regular de números lê «+/-3» como um número só, e a comparação
 * dizia que a declaração tem dois lados e o motor um. Expandem-se antes de ler.
 *
 * @param {string} cru
 * @returns {number[]}
 */
function numerosDoValorDeReferencia(cru) {
  const normal = String(cru)
    .replace(/−/g, '-')
    .replace(/([+]\/[-]|[-]\/[+])\s*(\d+(?:[.,]\d+)?)/g, '-$2/+$2');
  const achados = normal.match(/[+-]?\d+(?:[.,]\d+)?/g) ?? [];
  return achados
    .map((s) => Number(s.replace(/,/g, '.')))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

/**
 * Os números da declaração de `figuras.mjs`, pela mesma forma.
 *
 * @param {ReturnType<typeof ladosDoLimiar>} lados
 * @returns {number[]}
 */
function numerosDaDeclaracao(lados) {
  if (!lados) return [];
  return [lados.inferior, lados.superior]
    .filter((x) => typeof x === 'string' && x !== '')
    .map((x) => Number(String(x).replace(/−/g, '-').replace(/,/g, '.')))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

/**
 * A célula K9, escrita à parte para o `--prova` a poder exercer com um par que
 * NÃO bate certo. Não se planta um estrago num ficheiro de dados do motor: o que
 * se prova é a comparação, com dois valores escritos aqui.
 *
 * @param {string} id
 * @param {{ limiar: string, sentido: string }|null} doMotor
 * @param {ReturnType<typeof ladosDoLimiar>} lados
 * @param {boolean} banda
 * @returns {string|null}  a queixa, ou `null` quando batem certo
 */
export function compararAsDuasTestemunhas(id, doMotor, lados, banda) {
  if (!doMotor) return null;
  const a = numerosDoValorDeReferencia(doMotor.limiar);
  const b = numerosDaDeclaracao(lados);
  if (a.length !== b.length || a.some((n, i) => n !== b[i])) {
    return (
      `K9 · ${id}: o valor de referência tem duas testemunhas e elas não batem certo. ` +
      `A declaração de figuras.mjs diz [${b.join(', ')}] e o motor leu «${doMotor.limiar}» ` +
      `na página do painel, que dá [${a.join(', ')}]`
    );
  }
  const sentidoDeclarado = banda ? 'intervalo' : lados?.inferior ? 'inferior' : 'superior';
  if (doMotor.sentido && doMotor.sentido !== sentidoDeclarado) {
    return (
      `K9 · ${id}: o sentido do valor de referência tem duas testemunhas e elas não batem ` +
      `certo. A declaração de figuras.mjs diz «${sentidoDeclarado}» e o motor diz ` +
      `«${doMotor.sentido}»`
    );
  }
  return null;
}

/** A segunda testemunha nacional vem do texto selado, com leitura própria. */
export function referenciaNacionalDaLinha(id, linha) {
  if (id === 'saldo-das-administracoes-publicas-2025') {
    const m = /limiar de ([0-9]+(?:[,.][0-9]+)?)\s*% do PIB/.exec(linha?.note ?? '');
    // A série distingue saldo positivo e negativo. O limite é o de défice,
    // cuja atribuição ao Pacto já está documentada no domínio desde F1.10.
    const saldo = /Net lending \(\+\)\/net borrowing \(-\)/.test(linha?.excerpt ?? '');
    return m && saldo ? { limiar: `−${m[1]}%`, sentido: 'inferior' } : null;
  }
  if (id === 'crescimento-da-despesa-liquida-2025') {
    const m = /taxa de crescimento de ([0-9]+(?:[,.][0-9]+)?)\s*% recomendada/.exec(linha?.excerpt ?? '');
    const teto = /teto que o CFP cita/.test(linha?.note ?? '');
    return m && teto ? { limiar: `${m[1]}%`, sentido: 'superior' } : null;
  }
  return null;
}

