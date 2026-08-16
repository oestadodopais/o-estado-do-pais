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

/** O registo da agenda, ou `null` se ainda não atravessou. */
export function agendaCruzada() {
  const cru = leJson(FICHEIRO_DA_AGENDA);
  return Array.isArray(cru?.itens) ? cru : null;
}

/** O registo do calendário das fontes, ou `null`. */
export function calendarioCruzado() {
  const cru = leJson(FICHEIRO_DO_CALENDARIO);
  return Array.isArray(cru?.eventos) ? cru : null;
}

/** Os itens de um estado, pela ordem do registo. */
export function itensDoEstado(estado, agenda = agendaCruzada()) {
  return (agenda?.itens ?? []).filter((i) => i?.estado === estado);
}

/** Um acontecimento pelo seu id, para o critério que o nomeia. */
export function eventoPorId(id, calendario = calendarioCruzado()) {
  return (calendario?.eventos ?? []).find((e) => e?.id === id) ?? null;
}

/** A data por que um acontecimento se ordena: a sua, ou o início da janela. */
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
 */
export function eventosOrdenados(calendario = calendarioCruzado()) {
  const eventos = calendario?.eventos ?? [];
  const datados = eventos
    .filter((e) => dataDoEvento(e))
    .sort((a, b) => String(dataDoEvento(a)).localeCompare(String(dataDoEvento(b))));
  const semData = eventos.filter((e) => !dataDoEvento(e));
  return { datados, semData };
}

/** A âncora de um acontecimento dentro da página. */
export function ancoraDoEvento(id) {
  return `ev-${id}`;
}
