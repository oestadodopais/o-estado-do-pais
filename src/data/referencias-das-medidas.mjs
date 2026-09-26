import { FIGURAS, fixadorDoLimiar } from './figuras.mjs';

/**
 * Uma declaração para todas as vistas. As referências do painel pertencem a
 * figuras.mjs; as duas nacionais, antes repetidas pelo domínio, vivem aqui.
 * K9 compara cada uma com a testemunha exportada pelo motor.
 */
/* A TESTEMUNHA DISCORDANTE (passagem de correção do L1, 26.09.2026, I151): onde
   uma segunda fonte diz outro valor de referência, a declaração de `figuras.mjs`
   traz, ao pé do `limiar`, o que cada uma diz, a data de cada uma e quem manda.
   Vai com a referência porque é aqui que a K9 do `check:cartao` lê as
   testemunhas; não muda o valor que o cartão rende. */
/** @typedef {{limiar: Limiar, limiarFixadoPor: 'comissao'|'pacto'|'conselho'|'lei', testemunhaDiscordante?: Record<string, any>}} ReferenciaDaMedida */
/** @type {Map<string, ReferenciaDaMedida>} */
export const REFERENCIAS_DAS_MEDIDAS = new Map([
  ['saldo-das-administracoes-publicas-2025', {
    // Pacto: o limite aplica-se ao défice, logo o saldo tem um chão negativo.
    limiar: { nl: '3', sinal: '−', lado: 'inferior', simbolo: '%' },
    limiarFixadoPor: 'pacto',
  }],
  ['crescimento-da-despesa-liquida-2025', {
    // Conselho da UE, pela trajetória citada no parecer selado do CFP.
    limiar: { nl: '5', lado: 'superior', simbolo: '%' },
    limiarFixadoPor: 'conselho',
  }],
]);

for (const figura of FIGURAS) {
  if (!('limiar' in figura) || !figura.limiar) continue;
  const fixador = fixadorDoLimiar(figura, 'referências dos cartões');
  if (!fixador) throw new Error(`Referência sem fixador: ${figura.claim}`);
  const testemunha = 'testemunhaDiscordante' in figura ? figura.testemunhaDiscordante : undefined;
  REFERENCIAS_DAS_MEDIDAS.set(figura.claim, {
    limiar: figura.limiar,
    limiarFixadoPor: fixador,
    ...(testemunha ? { testemunhaDiscordante: testemunha } : {}),
  });
}

/** @param {string} id */
export function referenciaDaMedida(id) {
  const declarada = REFERENCIAS_DAS_MEDIDAS.get(id);
  if (!declarada) throw new Error(`Referência não declarada: ${id}`);
  return declarada;
}
