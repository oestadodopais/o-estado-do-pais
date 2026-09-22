/**
 * ---------------------------------------------------------------------------
 * UM AVISO DO MOTOR RECUSA O NOME, ESTEJA ELE ONDE ESTIVER
 * ---------------------------------------------------------------------------
 * A 21.09.2026 o campo `aviso` era uma frase em prosa que nenhum código lia, e
 * sete nomes do INE por conferir estiveram no ar como oficiais (`DECISIONS.md`
 * §1.115). A correção desse dia passou a recusar um nome cujo objeto trouxesse a
 * chave `aviso`, e a releitura a frio acrescentou que a PRESENÇA da chave chega:
 * um aviso vazio continua a ser o motor a dizer que há um aviso.
 *
 * A LEITURA A FRIO DO M3b (Codex `gpt-5.6-sol`, 22.09.2026, achado 7) mostrou
 * que a regra estava a ser lida num sítio só: os três leitores perguntavam pela
 * chave no objeto do nome e mais nada. O ficheiro de 22.09 traz `prova`,
 * `conferencia` e, em dois nomes, `resolucao`, cada um com objetos e listas
 * dentro, e um aviso escrito em qualquer um deles passava os três. Esta função
 * fecha isso: **a chave `aviso` a qualquer profundidade, dentro de qualquer
 * objeto ou lista do nome, recusa o nome**.
 *
 * ---------------------------------------------------------------------------
 * PORQUE É QUE ESTA É A ÚNICA PEÇA PARTILHADA PELOS TRÊS LEITORES
 * ---------------------------------------------------------------------------
 * A regra da casa é que cada leitor escreve a sua decisão por conta própria: uma
 * conferência que fosse buscar a lista à mesma função que compõe a página
 * confirmava a função e não o ficheiro de dados. Essa regra continua inteira, e
 * a decisão (a marca por fonte, o estado, o `mesma_medida`, o endereço e a hora)
 * continua escrita três vezes, uma em cada leitor.
 *
 * O que está aqui é outra coisa: uma pergunta ESTRUTURAL sobre uma árvore de
 * JSON, que não sabe o que é um nome, uma fonte ou uma medida. Escrevê-la três
 * vezes dava três travessias de árvore diferentes e três maneiras diferentes de
 * falhar numa lista aninhada, que é precisamente o defeito que o achado 7
 * encontrou. Uma só função, com as suas plantas a correrem em cada construção
 * (`scripts/check-nomes-oficiais.mjs --prova`), é o lado seguro: um erro aqui
 * aparece nas plantas, e não em três sítios com três comportamentos.
 *
 * @param {unknown} valor  o objeto do nome, ou qualquer coisa lá de dentro
 * @param {number} [profundidade]  guarda contra uma árvore funda ou cíclica
 * @returns {boolean}
 */
export function temAviso(valor, profundidade = 0) {
  if (profundidade > 20) return false;
  if (Array.isArray(valor)) {
    for (const x of valor) if (temAviso(x, profundidade + 1)) return true;
    return false;
  }
  if (valor === null || typeof valor !== 'object') return false;
  /* A PRESENÇA da chave chega, com o valor que for: `null`, cadeia vazia, ou
     uma frase. Um aviso vazio continua a ser o motor a dizer que há um aviso
     (releitura a frio de 21.09.2026, achado 8). */
  if (Object.prototype.hasOwnProperty.call(valor, 'aviso')) return true;
  for (const x of Object.values(valor)) if (temAviso(x, profundidade + 1)) return true;
  return false;
}

/**
 * O corpo de prova desta função, para quem a usa poder plantá-la sem a
 * reescrever. Cada caso é `[rótulo, valor, esperado]`.
 *
 * @type {ReadonlyArray<readonly [string, unknown, boolean]>}
 */
export const PLANTAS_DO_AVISO = /** @type {const} */ ([
  ['sem aviso nenhum', { nome: 'N', prova: { conceito: { diz: 'x' } } }, false],
  ['o aviso no próprio nome', { nome: 'N', aviso: 'por conferir' }, true],
  ['o aviso vazio no próprio nome', { nome: 'N', aviso: '' }, true],
  ['o aviso a null no próprio nome', { nome: 'N', aviso: null }, true],
  ['o aviso dentro da prova', { nome: 'N', prova: { unidade: { aviso: 'x' } } }, true],
  ['o aviso fundo, em conferencia.criterios.unidade', { nome: 'N', conferencia: { criterios: { unidade: { aviso: 'a conferência ficou por fazer' } } } }, true],
  ['o aviso dentro de uma lista', { nome: 'N', conferencia: { criterios: [{ campo: 'unidade' }, { aviso: 'x' }] } }, true],
  ['o aviso dentro de uma resolução', { nome: 'N', resolucao: { por: 'alguém', aviso: 'x' } }, true],
  ['uma chave que só se parece com aviso', { nome: 'N', avisos: 'x', aviso_do_motor: 'y' }, false],
]);
