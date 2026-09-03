/**
 * O JSON-LD, serializado para dentro de um `<script>`.
 *
 * ---------------------------------------------------------------------------
 * PORQUE ISTO NÃO É `JSON.stringify` (03.09.2026, bloco F0.7)
 * ---------------------------------------------------------------------------
 * O conteúdo de um `<script>` não é HTML: o analisador não lhe decodifica
 * entidades e não lhe reconhece marcação. O que ele procura, e a única coisa
 * que procura, é a cadeia que FECHA o elemento. Por isso um título de estudo
 * que contenha `</script>` — ou um comentário que abra `<!--` — sai de
 * `JSON.stringify` tal e qual, fecha o bloco a meio, e o resto do JSON passa a
 * ser markup que o navegador tenta ler. A auditoria de 02.09.2026 encontrou
 * `JSON.stringify` nu nos dois blocos de `Base.astro`, sobre 7 866 blocos
 * construídos.
 *
 * O CONSERTO É DENTRO DO JSON, E NÃO EM HTML. Escapar `<` como `&lt;` seria o
 * erro simétrico e pior: dentro de um `<script>` ninguém decodifica a entidade,
 * e o JSON passaria a conter os cinco caracteres `&lt;` no lugar do sinal. O que
 * se usa é `\u003c`, que é uma sequência de escape DO JSON: o analisador de
 * JSON devolve exactamente o mesmo caractere, e o analisador de HTML nunca vê
 * um `<`. A cadeia que sai daqui e a que sairia de `JSON.stringify` desserializam
 * para o mesmo objecto, byte a byte igual depois de lido.
 *
 * Escapam-se três, que é a prática corrente: `<` fecha o elemento e abre o
 * comentário, `>` fecha o `-->` que o par dele abriria, e `&` não é preciso mas
 * fecha a família. Nenhum deles muda o valor lido.
 */

/** Os três caracteres que um `<script>` lê como marcação, e os seus escapes. */
/** @type {Record<string, string>} */
const ESCAPES = { '<': '\\u003c', '>': '\\u003e', '&': '\\u0026' };

/**
 * Serializa um objecto para dentro de um `<script type="application/ld+json">`.
 *
 * @param {unknown} objeto
 * @returns {string} JSON válido, sem um `<` literal
 */
export function jsonLd(objeto) {
  return JSON.stringify(objeto).replace(/[<>&]/g, (c) => ESCAPES[c]);
}
