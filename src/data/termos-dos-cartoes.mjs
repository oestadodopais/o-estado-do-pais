/**
 * =============================================================================
 * OS TERMOS EXPLICADOS NA DOBRA DE UM CARTÃO (passagem R2-b, 04.10.2026)
 * =============================================================================
 *
 * PORQUE EXISTE. A triagem da auditoria dos rótulos mandava explicar na dobra o valor acrescentado bruto, a paridade do
 * poder de compra, o fator de sustentabilidade como multiplicador e o que quer dizer «reexpressa»; o construtor do R2
 * deixou-os por escrever, porque a pergunta de uma medida só se escreve com cada pedaço apoiado numa origem selada, e
 * nenhuma origem declarada os definia. A decisão do lugar de direção de 04.10.2026 separa duas coisas: a explicação de um
 * termo em palavras comuns é a palavra da casa, e não uma afirmação sobre a linha, e escreve-se, desde que não
 * contradiga a fonte; o que afirma um facto sobre a linha sem origem selada fica com o termo da fonte e vai para a lista
 * dos pedidos ao motor.
 *
 * O QUE CADA ENTRADA DIZ. Os cartões onde o termo aparece (`cartoes`), a explicação nas duas línguas, em pedaços (um
 * algarismo entra por `{ nl, motivo: 'escala-de-instrumento' }`, como nas unidades), e `lidoContra`: o texto da fonte
 * contra o qual a explicação foi lida, para que quem confere veja que ela não o contradiz. A explicação vai na dobra do
 * primeiro cartão de cada termo, pela ordem da página (a vista calcula-o), com a marca `data-termo-na-dobra`; a régua
 * do inventário dos rótulos confere o texto e a regra da primeira vez.
 *
 * O QUE NÃO É. Não é uma definição da medida: essa é a pergunta declarada (`DEFINICOES_DAS_MEDIDAS`), com a auditoria da
 * K16. Um termo explicado aqui não diz o valor, a população nem o período de linha nenhuma.
 *
 * @typedef {string | { nl: string, motivo: string }} PedacoDoTermo
 * @type {Record<string, { cartoes: readonly string[], pt: readonly PedacoDoTermo[], en: readonly PedacoDoTermo[], lidoContra: string }>}
 */
export const TERMOS_DOS_CARTOES = {
  vab: {
    cartoes: ['evora-vab-empresarial-2024', 'evora-concentracao-vab4-2024', 'portugal-concentracao-vab4-2024'],
    pt: ['O valor acrescentado bruto (VAB) é o valor do que se produz menos o valor dos bens e serviços consumidos para o produzir.'],
    en: ['Gross value added is the value of what is produced minus the value of the goods and services used up in producing it.'],
    lidoContra:
      'O Sistema Europeu de Contas (SEC 2010), ponto 9.31, no documento da origem eurostat-sec2010-ocde (a cópia do motor em indicators/out/l1-2026-09-26/eurostat-esa2010-KS-02-13-269-EN.txt): «Gross value added is recorded at basic prices. It is output valued at basic prices less intermediate consumption valued at purchasers’ prices.»',
  },
  'paridade-do-poder-de-compra': {
    cartoes: [
      'pib-pc-portugal-2024',
      'pib-pc-norte-2024',
      'pib-pc-centro-2024',
      'pib-pc-oeste-e-vale-do-tejo-2024',
      'pib-pc-grande-lisboa-2024',
      'pib-pc-peninsula-de-setubal-2024',
      'pib-pc-alentejo-2024',
      'pib-pc-alentejo-2000',
      'pib-pc-algarve-2024',
      'pib-pc-acores-2024',
      'pib-pc-madeira-2024',
    ],
    pt: [
      'O produto por habitante converte-se, pelas paridades do poder de compra, numa moeda fictícia que tira as diferenças de preços entre países, e diz-se face à média da União, que é ',
      { nl: '100', motivo: 'escala-de-instrumento' },
      '.',
    ],
    en: [
      'Output per inhabitant is converted, with purchasing power parities, into a fictive currency that removes price differences between countries, and is given against the EU average, which is ',
      { nl: '100', motivo: 'escala-de-instrumento' },
      '.',
    ],
    lidoContra:
      'A unidade das linhas (PPS_HAB_EU27_2020, no excerto de cada uma) e a metainformação das contas nacionais do Eurostat (a cópia do motor em indicators/out/l1-2026-09-26/eurostat-md-nama10_esms.htm): «Purchasing Power Standards (PPS) (CP_MPPS) are fictive \'currency\' units that remove differences in purchasing power, i.e. different price levels between countries.» e «Figures expressed in Purchasing Power Standards are derived from figures expressed in national currency by using Purchasing Power Parities (PPP) as conversion factors.»',
  },
  'fator-de-sustentabilidade': {
    cartoes: ['factor-sustentabilidade-2026'],
    pt: ['O fator multiplica o montante da pensão: abaixo de um, a pensão baixa, e o que falta para chegar a um é a parte que se corta.'],
    en: ['The factor multiplies the amount of the pension: below one, the pension falls, and the gap to one is the share that is cut.'],
    lidoContra:
      'O excerto da linha factor-sustentabilidade-2026: «este factor é de 0,8237, correspondendo a uma redução de 17,63% do montante estatutário da pensão» (a parte cortada é o que falta ao fator para chegar a um).',
  },
  reexpressa: {
    cartoes: ['evora-divida-inicio-mandato-reexpressa'],
    pt: ['Reexpressa quer dizer apresentada de novo mais tarde: é a dívida do início do mandato como a apresenta um relatório de gestão posterior da câmara.'],
    en: ['Restated means presented again later: it is the debt at the start of the term as a later management report of the council presents it.'],
    lidoContra:
      'O documento e o excerto da linha evora-divida-inicio-mandato-reexpressa: o «Relatório de Gestão 2021» do Município de Évora, p. 30, «Dívida Total no Início do Mandato 95.082.509,86 iniciado em Outubro/2013».',
  },
};

/**
 * O termo que um cartão explica, ou `null`. Um cartão explica no máximo um termo.
 *
 * @param {string} id
 * @returns {string | null}
 */
export function termoDoCartao(id) {
  const achados = Object.entries(TERMOS_DOS_CARTOES).filter(([, t]) => t.cartoes.includes(id)).map(([k]) => k);
  if (achados.length > 1) throw new Error(`termos dos cartões: o cartão «${id}» está em ${achados.length} termos, e explica no máximo um`);
  return achados[0] ?? null;
}
