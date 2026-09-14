/**
 * ---------------------------------------------------------------------------
 * O QUE SÓ SE RENDE UMA VEZ EM CADA PÁGINA
 * ---------------------------------------------------------------------------
 * F1.10, §7.10, 14.09.2026. O item pede uma coisa que a árvore de componentes
 * não sabe dizer sozinha: «`[a verificar]` com a sua definição ao pé da PRIMEIRA
 * ocorrência em cada página». O marcador é rendido por quatro sítios diferentes
 * (`Marcador.astro`, `CampoDaLinha.astro`, `Frase.astro` e o selo de
 * `Provenance.astro`), nenhum deles sabe quantos vieram antes, e a definição
 * repetida em cada ocorrência seria ruído: há páginas de linha com dezenas.
 *
 * O QUE ISTO É. Uma marca por página e por coisa, guardada enquanto a página se
 * rende: a primeira chamada devolve `true`, as seguintes devolvem `false`.
 *
 * PORQUE É QUE A PÁGINA A ABRE, e não um contador que se limpasse sozinho. Uma
 * marca guardada só pelo endereço da página nunca mais se apagava: na construção
 * cada página rende-se uma vez e isso bastaria, mas em `astro dev` a mesma
 * página rende-se a cada pedido, e à segunda visita a definição desaparecia sem
 * que ninguém percebesse porquê. `Base.astro`, que é o invólucro de todas as
 * páginas e a primeira coisa que se rende em cada uma, chama `abrePagina()` e
 * apaga o que ficou da vez anterior. O servidor de desenvolvimento passa a ver o
 * mesmo que a construção, que é a única maneira de isto não ser uma armadilha.
 *
 * A ORDEM É A DO DOCUMENTO, E MEDE-SE. Nada aqui garante que o primeiro a
 * chamar seja o primeiro a aparecer na página: quem o garante é a ordem por que
 * o Astro rende a árvore, e por isso a promessa não fica por conta da confiança.
 * A régua do bloco (`scripts/check-lugar.mjs`, a célula §7.10) abre cada página
 * construída, procura o primeiro `.marcador` do documento e exige que a
 * definição esteja ao lado DELE. O dia em que a ordem mudar, a régua fecha a
 * construção em vez de a deixar passar com a definição ao pé do marcador errado.
 */

/** @type {Map<string, Set<string>>} */
const vistos = new Map();

/**
 * A página abre: o que ficou da rendição anterior desta mesma página apaga-se.
 *
 * @param {string} caminho o endereço da página que se está a render
 */
export function abrePagina(caminho) {
  vistos.set(caminho, new Set());
}

/**
 * É esta a primeira vez que `coisa` se rende nesta página?
 *
 * @param {string} coisa o nome do que se conta, por exemplo `'marcador'`
 * @param {string} caminho o endereço da página que se está a render
 * @returns {boolean}
 */
export function primeiraVezNaPagina(coisa, caminho) {
  let set = vistos.get(caminho);
  if (!set) {
    set = new Set();
    vistos.set(caminho, set);
  }
  if (set.has(coisa)) return false;
  set.add(coisa);
  return true;
}
