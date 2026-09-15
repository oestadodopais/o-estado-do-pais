/**
 * A agenda e o calendário das fontes, lidos do que atravessou do motor.
 *
 * Dois registos, escritos em `ResearchHub` e trazidos por
 * `publisher/export_agenda.py`: `src/data/agenda.json` diz o que esta
 * publicação está a medir, porquê, quem o propôs e quem o decidiu, e por que
 * estados passou; `src/data/calendario.json` diz o que as fontes que ela cita
 * publicam a seguir, e, onde uma fonte não publica calendário nenhum, diz isso
 * em vez de adivinhar uma data.
 *
 * ESTE MÓDULO NÃO RECALCULA NADA. Lê, ordena para renderizar, e mais nada. As
 * contagens do registo da travessia (`ledger/cruzamentos/agenda.json`) estão lá
 * para serem comparadas com o que a página conta, não para serem a fonte da
 * página: quem as compara é o portão.
 *
 * Ficheiro em falta não é erro nem zero: é ausência, e quem chama diz a
 * ausência por palavras (IDENTIDADE §7). É a mesma disciplina de `agenda()` em
 * `src/lib/prova.mjs`, que existia antes de a travessia acontecer.
 */
import fs from 'node:fs';
import path from 'node:path';

import { FICHEIRO_DA_AGENDA } from './prova.mjs';

/** O calendário vive ao lado da agenda, escrito pela mesma corrida. */
export const FICHEIRO_DO_CALENDARIO = path.join(
  path.dirname(FICHEIRO_DA_AGENDA),
  'calendario.json',
);

/**
 * Os quatro estados, pela ordem em que a página os mostra.
 *
 * A ordem é uma decisão editorial e não do registo: o que está a acontecer
 * primeiro, o que vem a seguir depois, o que acabou em terceiro, e o que saiu
 * no fim. Um leitor que abra a página quer saber o que se está a fazer.
 */
export const ESTADOS = /** @type {const} */ (['em_curso', 'a_seguir', 'concluido', 'retirado']);

/** As naturezas de uma entrada do histórico, tal como o registo as escreve. */
export const TIPOS_DE_HISTORICO = /** @type {const} */ ([
  'entrada',
  'repriorizacao',
  'conclusao',
  'retirada',
  'alteracao',
]);

/** @param {string} ficheiro */
/**
 * @param {string} ficheiro
 * @returns {unknown}
 */
function leJson(ficheiro) {
  try {
    if (!fs.existsSync(ficheiro)) return null;
    return JSON.parse(fs.readFileSync(ficheiro, 'utf8'));
  } catch {
    /* Um ficheiro partido vale o mesmo que não existir: a página diz a
       ausência em vez de renderizar metade de um registo. */
    return null;
  }
}

/**
 * O registo da agenda, ou `null` se ainda não atravessou.
 *
 * @returns {RegistoDaAgenda | null}
 */
export function agendaCruzada() {
  const cru = /** @type {{ itens?: unknown } | null} */ (leJson(FICHEIRO_DA_AGENDA));
  return Array.isArray(cru?.itens) ? /** @type {RegistoDaAgenda} */ (cru) : null;
}

/**
 * O registo do calendário das fontes, ou `null`.
 *
 * @returns {RegistoDoCalendario | null}
 */
export function calendarioCruzado() {
  const cru = /** @type {{ eventos?: unknown } | null} */ (leJson(FICHEIRO_DO_CALENDARIO));
  return Array.isArray(cru?.eventos) ? /** @type {RegistoDoCalendario} */ (cru) : null;
}

/**
 * Os itens de um estado, pela ordem do registo.
 *
 * @param {string} estado
 * @param {RegistoDaAgenda | null} [agenda]
 */
export function itensDoEstado(estado, agenda = agendaCruzada()) {
  return (agenda?.itens ?? []).filter((i) => i?.estado === estado);
}

/**
 * Um acontecimento pelo seu id, para o critério que o nomeia.
 *
 * @param {string} id
 * @param {RegistoDoCalendario | null} [calendario]
 */
export function eventoPorId(id, calendario = calendarioCruzado()) {
  return (calendario?.eventos ?? []).find((e) => e?.id === id) ?? null;
}

/**
 * A data por que um acontecimento se ordena: a sua, ou o início da janela.
 *
 * @param {EventoDoCalendario | null | undefined} evento
 * @returns {string | null}
 */
export function dataDoEvento(evento) {
  return evento?.data ?? evento?.janela?.inicio ?? null;
}

/**
 * O calendário para renderizar: primeiro o que tem data, por ordem de data;
 * depois o que a fonte não datou, pela ordem do registo.
 *
 * A separação é o próprio conteúdo do ficheiro: o marcador está presente
 * exactamente quando não há data nem janela, e é isso que separa uma lista do
 * que vai acontecer de uma lista do que se anda à espera.
 *
 * @param {RegistoDoCalendario | null} [calendario]
 */
export function eventosOrdenados(calendario = calendarioCruzado()) {
  /** @type {EventoDoCalendario[]} */
  const eventos = calendario?.eventos ?? [];
  const datados = eventos
    .filter((e) => dataDoEvento(e))
    .sort((a, b) => String(dataDoEvento(a)).localeCompare(String(dataDoEvento(b))));
  const semData = eventos.filter((e) => !dataDoEvento(e));
  return { datados, semData };
}

/**
 * A âncora de um acontecimento dentro da página.
 *
 * @param {string} id
 */
export function ancoraDoEvento(id) {
  return `ev-${id}`;
}

/**
 * ===========================================================================
 * A PRÓXIMA CONFERÊNCIA DE UMA LINHA (bloco P2, item 2, 15.09.2026)
 * ===========================================================================
 * A norma, §2.5: «Duas datas, não uma. Quando os dados foram lidos e quando a
 * página vai ser vista de novo ("Data extracted: November 2025" e "Planned
 * article update: December 2026", Eurostat; "Release date" e "Next release",
 * ONS). Este projeto já tem o calendário e a reconferência; a segunda data
 * mostra-se na página da medida, não no cartão.»
 *
 * O calendário das fontes já existe (`src/data/calendario.json`, exportado pelo
 * motor) e já diz, por acontecimento, que linhas ele afeta. O que faltava era a
 * pergunta ao contrário: dada uma linha, quando é a próxima vez que a sua fonte
 * publica.
 *
 * ---------------------------------------------------------------------------
 * SÓ UMA DATA ANUNCIADA, E NUNCA UMA JANELA NEM UM MARCADOR
 * ---------------------------------------------------------------------------
 * Dos dezasseis acontecimentos do calendário, seis trazem uma data anunciada
 * pela fonte, dois trazem uma JANELA («entre 1 e 31 de dezembro de 2026») e oito
 * não trazem nada, porque a fonte não publica calendário. Uma janela não é uma
 * data: escrever «Próxima conferência: 01.12.2026» por cima de uma janela seria
 * a casa a escolher uma ponta e a apresentá-la como o que a fonte anunciou. E o
 * marcador `[a verificar]` diz que o campo falta, não que a conferência é nesse
 * dia.
 *
 * Por isso esta função devolve `null` em tudo o que não seja uma data anunciada,
 * e a página não escreve a ausência: a linha simplesmente não tem a segunda
 * data, como não tem `published_at` quando o publicador não carimba nada.
 *
 * A MAIS PRÓXIMA, quando houver mais do que uma: duas fontes podem publicar a
 * mesma linha, e «a próxima» é a primeira que chega.
 *
 * @param {string} id  o identificador da linha
 * @param {RegistoDoCalendario | null} [calendario]
 * @returns {{ data: string, evento: string, fonte: string|null } | null}
 */
export function proximaConferenciaDaLinha(id, calendario = calendarioCruzado()) {
  /** @type {{ data: string, evento: string, fonte: string|null } | null} */
  let melhor = null;
  for (const e of calendario?.eventos ?? []) {
    if (typeof e?.data !== 'string' || e.data === '') continue;
    const linhas = Array.isArray(e.afecta_linhas) ? e.afecta_linhas : [];
    if (!linhas.includes(id)) continue;
    if (melhor === null || e.data < melhor.data) {
      melhor = { data: e.data, evento: String(e.id), fonte: typeof e.fonte === 'string' ? e.fonte : null };
    }
  }
  return melhor;
}
