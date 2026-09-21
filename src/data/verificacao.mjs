/**
 * Estado da verificação da linha de base institucional.
 *
 * FICHEIRO GERADO. Não editar à mão.
 * Escrito por ResearchHub/indicators/refresh.py a cada verificação.
 *
 * `verificadoEm` é a data em que as afirmações do estudo
 * `quadro-institucional` foram reconferidas contra a fonte. A página
 * publica-a: se a verificação atrasar, o leitor vê o atraso em vez de
 * ver um número que parece fresco.
 *
 * `observadoPor` é a máquina que fez os pedidos, e só existe quando
 * alguém lhe deu um nome (`OEDP_OBSERVADOR`). «A fonte não respondeu»
 * e «a fonte não respondeu a esta máquina» são duas frases
 * diferentes, e só a segunda é verdade quando a rede falha deste
 * lado; o nome da máquina de uma pessoa não entra num repositório
 * público por omissão.
 */
export const VERIFICACAO = {
  verificadoEm: '2026-09-21',
  afirmacoes: 91,
  alarmes: 0,
  validadeDias: 45,
};
