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


/* ===========================================================================
 * A TESTEMUNHA DISCORDANTE, DECLARADA E DATADA (K9, passagem de correção do
 * bloco L1, 26.09.2026; I151)
 * ===========================================================================
 *
 * PORQUE EXISTE. As descrições de dois conjuntos do Eurostat (`tipser10`,
 * `tipsbp60`) dão valores de referência que a página do painel da Comissão não
 * dá, e o construtor do L1 guardou a discordância num relatório, onde nenhum
 * portão a lia. A leitura a frio do Codex (achados 3 e 4) disse que o sítio
 * rendia um dos lados como facto assente. A Comissão é quem fixa e revê os
 * valores do painel, e a página dela, lida de novo a 26.09.2026, traz palavra
 * por palavra os que o cartão rende: os valores ficam, e a discordância deixa
 * de estar escondida. Fica declarada ao pé do `limiar` em `figuras.mjs`, e esta
 * conferência exige-lhe as quatro coisas que a tornam uma testemunha e não uma
 * nota: o que a descrição do Eurostat diz, a data de criação do conjunto, o que
 * a página da Comissão diz e a data em que foi lida; e quem manda.
 *
 * O QUE CONFERE, além da presença: que o valor de cada lado está mesmo no
 * excerto desse lado; que a testemunha de quem manda dá os mesmos números que a
 * declaração que o cartão rende; que a outra dá números diferentes (uma
 * testemunha que concorda não é discordante, e declará-la era enfeite); que a
 * data de leitura da Comissão é o dia do pedido selado e a data de criação é a
 * da anotação selada; e que cada lado traz o selo do pedido no motor
 * (ficheiro, campo, hora, cliente, sha256). Não abre os ficheiros do motor, que
 * não estão neste repositório: essa releitura é a de
 * `design/especime-v3/medicoes/l1-2026-09-24/origens-l1.py --confere`.
 */

/**
 * As medidas cuja discordância está declarada, conhecidas pelo nome e escritas
 * aqui, como a K14 conhece as medidas de média calada: tirar a testemunha de uma
 * delas voltava a esconder a discordância, e é isso que a catraca impede.
 */
export const MEDIDAS_COM_TESTEMUNHA_DISCORDANTE = Object.freeze([
  'taxa-de-cambio-efectiva-real-2025',
  'desempenho-das-exportacoes-2025',
]);

const DIA = /^\d{4}-\d{2}-\d{2}$/;
const HORA_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

/**
 * Uma testemunha discordante declarada, conferida.
 *
 * @param {string} id
 * @param {any} t  a declaração `testemunhaDiscordante`
 * @param {ReturnType<typeof ladosDoLimiar>} lados  os lados da declaração que o cartão rende
 * @param {string} fixador  quem fixa a referência (`limiarFixadoPor`)
 * @returns {string[]} as queixas; nenhuma quando a testemunha está inteira
 */
export function conferirTestemunhaDiscordante(id, t, lados, fixador) {
  const pre = `K9 · ${id}: a testemunha discordante declarada`;
  if (!t || typeof t !== 'object') return [`${pre} não é uma declaração`];
  /** @type {string[]} */
  const q = [];
  const e = t.eurostat ?? {};
  const c = t.comissao ?? {};
  /** @param {any} lado @param {string} quem */
  const diz = (lado, quem) => {
    if (typeof lado.excerto !== 'string' || !lado.excerto.trim()) q.push(`${pre} não diz o que ${quem} diz`);
    else if (typeof lado.limiar !== 'string' || !lado.limiar || !lado.excerto.includes(lado.limiar)) {
      q.push(`${pre}: o valor que ${quem} dá («${lado.limiar ?? ''}») não está no excerto dela`);
    }
  };
  diz(e, 'a descrição do Eurostat');
  if (!DIA.test(String(e.criado ?? ''))) q.push(`${pre} não diz a data de criação do conjunto do Eurostat`);
  diz(c, 'a página da Comissão');
  if (!DIA.test(String(c.lido ?? ''))) q.push(`${pre} não diz a data de leitura da página da Comissão`);
  if (typeof t.manda !== 'string' || !t.manda) q.push(`${pre} não diz quem manda`);
  else if (t.manda !== fixador) q.push(`${pre} diz que manda «${t.manda}», e a referência é fixada por «${fixador}»`);
  /* OS NÚMEROS. Quem manda é a Comissão, e a testemunha dela tem de dar os
     números que o cartão rende; a do Eurostat tem de dar outros, ou não há
     discordância nenhuma a declarar. */
  const declarados = numerosDaDeclaracao(lados);
  const iguais = (/** @type {number[]} */ a) => a.length === declarados.length && a.every((n, i) => n === declarados[i]);
  const mandante = t.manda === 'comissao' ? c : t.manda === 'eurostat' ? e : null;
  const outra = mandante === c ? e : mandante === e ? c : null;
  if (mandante && typeof mandante.limiar === 'string' && !iguais(numerosDoValorDeReferencia(mandante.limiar))) {
    q.push(`${pre}: quem manda diz «${mandante.limiar}», e a declaração que o cartão rende diz [${declarados.join(', ')}]`);
  }
  if (outra && typeof outra.limiar === 'string' && iguais(numerosDoValorDeReferencia(outra.limiar))) {
    q.push(`${pre}: a outra testemunha diz o mesmo que a declaração («${outra.limiar}»), e não há discordância a declarar`);
  }
  /* OS SELOS, a forma da K16. */
  for (const [lado, quem, criacao] of /** @type {[any, string, boolean][]} */ ([[e, 'do Eurostat', true], [c, 'da Comissão', false]])) {
    const s = lado.selo ?? {};
    const faltas = [];
    if (typeof s.motor !== 'string' || !s.motor.startsWith('indicators/out/')) faltas.push('o ficheiro no motor');
    if (typeof s.campo !== 'string' || !s.campo) faltas.push('o campo lido');
    if (!HORA_UTC.test(String(s.hora ?? ''))) faltas.push('a hora do pedido (UTC, ao segundo)');
    if (typeof s.cliente !== 'string' || !s.cliente.includes('core.http.HttpClient')) faltas.push('o cliente da casa');
    if (!/^[0-9a-f]{64}$/.test(String(s.sha256 ?? ''))) faltas.push('o sha256');
    if (criacao && typeof s.criacao !== 'string') faltas.push('onde se leu a data de criação');
    if (faltas.length) q.push(`${pre}: o selo ${quem} não diz ${faltas.join(', ')}`);
  }
  if (DIA.test(String(c.lido ?? '')) && HORA_UTC.test(String(c.selo?.hora ?? '')) && c.selo.hora.slice(0, 10) !== c.lido) {
    q.push(`${pre}: a data de leitura da Comissão (${c.lido}) não é o dia do pedido selado (${c.selo.hora.slice(0, 10)})`);
  }
  if (DIA.test(String(e.criado ?? '')) && typeof e.selo?.criacao === 'string' && !e.selo.criacao.includes(e.criado)) {
    q.push(`${pre}: a data de criação (${e.criado}) não é a da anotação selada («${e.selo.criacao}»)`);
  }
  return q;
}

/**
 * A catraca: cada medida da lista tem a sua testemunha declarada.
 *
 * @param {Map<string, any>} referencias
 * @returns {string[]}
 */
export function conferirDiscordanciasDeclaradas(referencias) {
  /** @type {string[]} */
  const q = [];
  for (const id of MEDIDAS_COM_TESTEMUNHA_DISCORDANTE) {
    const r = referencias.get(id);
    if (!r) q.push(`K9 · ${id}: a medida com a discordância declarada já não tem referência`);
    else if (!r.testemunhaDiscordante) {
      q.push(`K9 · ${id}: a discordância entre a descrição do Eurostat e a página da Comissão voltou a estar escondida (a testemunha saiu da declaração)`);
    }
  }
  return q;
}
