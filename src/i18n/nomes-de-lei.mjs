/**
 * ---------------------------------------------------------------------------
 * OS NOMES DE DIPLOMA CITADOS DENTRO DE PROSA INGLESA DA CASA (I95)
 * ---------------------------------------------------------------------------
 *
 * «Lei n.º 51/2018» é uma cadeia portuguesa, e numa página inglesa um leitor de
 * ecrã lê-a com a fonética do inglês. A I95 contou-as: a 04.09.2026 eram 316 em
 * `dist/en`, e a régua `check:lingua` já as separava das outras porque elas não
 * estão soltas na página — estão DENTRO de um campo que a casa transcreve
 * carácter a carácter (`data-linha-campo`, `data-agenda`, `data-verbatim`), e a
 * regra da casa é que um campo transcrito só se marca inteiro, na língua do
 * campo. Marcar o fragmento obrigava a partir a cadeia, e partir a cadeia era o
 * que a régua da transcrição existia para impedir.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTE MÓDULO FAZ, E PORQUE NÃO QUEBRA A TRANSCRIÇÃO
 * ---------------------------------------------------------------------------
 * Parte a cadeia em corridas, sem lhe tirar nem lhe pôr um carácter: a
 * concatenação das partes É a cadeia de partida, e a função `provaDaParticao()`
 * di-lo por conta própria, para que quem chame não tenha de acreditar. Quem
 * rende põe um `<span lang="pt-PT">` à volta das corridas que são nome de
 * diploma e nada à volta das outras — de modo que o TEXTO renderizado continua
 * igual ao campo do livro-razão, carácter a carácter, e o portão de HTML, que
 * compara o texto e não o markup (`textoTranscrito()`), continua a compará-lo
 * exactamente como comparava.
 *
 * O QUE NÃO ENTRA AQUI. Um campo que é ELE PRÓPRIO uma transcrição de uma fonte
 * portuguesa — um `excerpt`, o corpo de um documento alojado — não se parte:
 * esse marca-se inteiro, na língua da fonte, e não é este o módulo que o faz.
 * Este é para a PROSA DA CASA escrita em inglês que cita um diploma pelo nome
 * português: a `derivation_en` de uma linha derivada e a nota de um evento da
 * agenda. A diferença está escrita porque é ela que decide: a casa não edita o
 * que transcreve, e a `derivation_en` não é uma transcrição, é a explicação da
 * conta, escrita pela casa nas duas línguas (`src/lib/ledger.mjs`).
 *
 * ---------------------------------------------------------------------------
 * O FEITIO, E PORQUE É ESTE
 * ---------------------------------------------------------------------------
 * `Decreto-Lei n.º 12/2004` e `Lei n.º 51/2018`: o nome do diploma, «n.º», o
 * número com um sufixo opcional («n.º 73/2013-A») e o ano. É o mesmo feitio que
 * `scripts/check-lingua.mjs` já usava para os CONTAR, e passa a viver aqui,
 * exportado, para que a régua que conta e o gabarito que marca leiam o mesmo
 * feitio e não dois que se possam separar.
 */

/**
 * O feitio de um nome de diploma português.
 *
 * Sem a bandeira `g`: quem precisa de a percorrer faz a sua cópia com
 * `feitioDeLei()`, porque uma expressão global guarda o `lastIndex` e uma
 * constante partilhada com estado é uma armadilha entre chamadores.
 */
export const NOME_DE_LEI = /(?:Decreto-Lei|Lei)\s+n\.º\s*\d+[-\w]*\/\d{4}/;

/** Uma cópia global do feitio, para quem percorre uma cadeia. */
export function feitioDeLei() {
  return new RegExp(NOME_DE_LEI.source, 'g');
}

/**
 * Uma corrida de uma cadeia partida: o texto, e se ele é um nome de diploma.
 * @typedef {{ texto: string, lei: boolean }} CorridaDeTexto
 */

/**
 * Parte uma cadeia nas corridas de texto e nos nomes de diploma que ela cita.
 *
 * Devolve sempre pelo menos uma corrida quando a cadeia não é vazia, e a
 * concatenação de `texto` de todas elas é a cadeia de partida.
 *
 * @param {unknown} texto
 * @returns {CorridaDeTexto[]}
 */
export function partesComNomesDeLei(texto) {
  const s = texto === null || texto === undefined ? '' : String(texto);
  if (s === '') return [];
  /** @type {CorridaDeTexto[]} */
  const partes = [];
  const re = feitioDeLei();
  let i = 0;
  for (;;) {
    const m = re.exec(s);
    if (m === null) break;
    if (m.index > i) partes.push({ texto: s.slice(i, m.index), lei: false });
    partes.push({ texto: m[0], lei: true });
    i = m.index + m[0].length;
    /* Um casamento de comprimento zero nunca acontece com este feitio (ele
       exige pelo menos «Lei n.º 1/2000»), e a guarda fica escrita para que uma
       mudança futura do feitio não faça este ciclo andar para sempre. */
    if (m[0].length === 0) re.lastIndex++;
  }
  if (i < s.length) partes.push({ texto: s.slice(i), lei: false });
  return partes;
}

/**
 * A PROVA DA PARTIÇÃO: a concatenação das partes é a cadeia de partida.
 *
 * Não é uma conveniência: é a única coisa que separa «marcar um fragmento» de
 * «editar o que se transcreve». Quem rende chama-a e atira quando ela falha, de
 * modo que uma partição que perca ou acrescente um carácter fecha a construção
 * em vez de publicar um campo que já não é o do livro-razão.
 *
 * @param {unknown} texto
 * @param {CorridaDeTexto[]} partes
 * @returns {boolean}
 */
export function provaDaParticao(texto, partes) {
  const s = texto === null || texto === undefined ? '' : String(texto);
  let junto = '';
  for (const p of partes) junto += p.texto;
  return junto === s;
}

/**
 * As partes de uma cadeia, provadas.
 *
 * A porta que os gabaritos usam: parte, prova, e atira com o nome do campo
 * quando a prova falha. Um gabarito que chame isto não tem como publicar uma
 * transcrição partida ao meio.
 *
 * @param {unknown} texto
 * @param {string} onde o nome do campo, para a mensagem
 * @returns {CorridaDeTexto[]}
 */
export function partesProvadas(texto, onde) {
  const partes = partesComNomesDeLei(texto);
  if (!provaDaParticao(texto, partes)) {
    throw new Error(
      `a partição de "${onde}" não devolve a cadeia de partida. ` +
        `Marcar um nome de diploma não pode mudar um carácter do campo transcrito.`,
    );
  }
  return partes;
}
