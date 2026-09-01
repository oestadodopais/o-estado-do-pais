/**
 * O corredor diário: quando perguntou às fontes, e quais não responderam.
 *
 * FICHEIRO GERADO. Não editar à mão.
 * Escrito por ResearchHub/indicators/corredor.py a cada corrida.
 *
 * `CONFERENCIA` é o que a última corrida mediu: a hora UTC em que
 * perguntou, quantos endereços perguntou, quantas linhas do livro-razão
 * esses endereços sustentam, e o que cada resposta foi. Nenhum destes
 * números é escrito à mão; todos vêm da corrida que os produziu, e a
 * corrida que falha não escreve nada, pelo que a página mostra a última
 * conferência REAL em vez de dizer «hoje» por omissão.
 *
 * `FONTES_SEM_RESPOSTA` traz uma entrada por endereço que deixou de
 * responder, com a data da primeira ausência depois da última resposta
 * boa. Um endereço que responde não tem entrada: a página não desenha
 * um estado que não existe.
 */
export const CONFERENCIA = {
  conferidoEm: '2026-09-01T20:07:57+00:00',
  enderecos: 79,
  linhas: 2577,
  semDescarga: 24,
  iguais: 53,
  ficheirosNovos: 1,
  primeirasCapturas: 0,
  semResposta: 1,
  valoresNovos: 0,
};

export const FONTES_SEM_RESPOSTA = {
  'https://emprego.azores.gov.pt/estatisticas/': {
    'desde': '2026-08-30',
    'ultimaResposta': null
  },
  'https://www.dgcp.mtsss.gov.pt/documents/10182/331337/Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf/1e42612d-c6c0-4232-89df-810c44af07ef': {
    'desde': '2026-09-01',
    'ultimaResposta': null
  }
};
