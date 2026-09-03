/**
 * O corredor diário: quando perguntou às fontes, e quais não responderam.
 *
 * FICHEIRO GERADO. Não editar à mão.
 * Escrito por ResearchHub/indicators/corredor.py a cada corrida.
 *
 * `CONFERENCIA` é o que a última corrida INTEIRA mediu: a hora UTC em que
 * perguntou, quantos endereços perguntou, quantas linhas do livro-razão
 * esses endereços sustentam, e o que cada resposta foi. Nenhum destes
 * números é escrito à mão; todos vêm da corrida que os produziu, e a
 * corrida que falha não escreve nada, pelo que a página mostra a última
 * conferência REAL em vez de dizer «hoje» por omissão. Uma corrida
 * PARCIAL (o modo do portátil, `--so-anfitrioes`) não lhe toca: ela
 * pergunta a alguns endereços e não pode assinar a frescura de todos.
 *
 * `FONTES_SEM_RESPOSTA` traz uma entrada por endereço que deixou de
 * ser lido, com a data da primeira falha depois da última resposta boa.
 * Um endereço que responde não tem entrada: a página não desenha um
 * estado que não existe. `estado` tem DOIS valores e não um:
 *
 *   'sem-resposta'        não atendeu de todo (tempo esgotado, ligação
 *                         recusada, nome que não resolve, TLS);
 *   'respondeu-com-erro'  atendeu com um estado que não é 2xx nem 304
 *                         (403, 404, 5xx). Há resposta, e ela diz
 *                         outra coisa.
 *
 * `maquina` diz QUEM observou, porque «a fonte não responde» e «a fonte
 * não respondeu a esta máquina» são duas frases diferentes e só a
 * segunda é verdade. Uma linha escrita pelo disjuntor por anfitrião não
 * conta para este bloco: é uma consequência da corrida e não uma
 * observação daquele endereço.
 *
 * `ANFITRIOES_SEM_RESPOSTA` traz o mesmo por ANFITRIÃO, e só quando os
 * endereços que o arquivo conhece dele foram TODOS observados, NA MESMA
 * CORRIDA e NO MESMO ESTADO. A data é a do ÚLTIMO que ainda respondia a
 * deixar de responder, que é quando o publicador ficou inteiro assim.
 * Serve as linhas cujo endereço não foi pedido na última corrida e cujo
 * anfitrião se calou: sem ele, a página desenhava silêncio sobre o
 * silêncio.
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
    'estado': 'respondeu-com-erro',
    'desde': '2026-08-30',
    'ultimaResposta': null,
    'maquina': null
  },
  'https://www.dgcp.mtsss.gov.pt/documents/10182/331337/Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf/1e42612d-c6c0-4232-89df-810c44af07ef': {
    'estado': 'sem-resposta',
    'desde': '2026-09-01',
    'ultimaResposta': null,
    'maquina': null
  }
};

export const ANFITRIOES_SEM_RESPOSTA = {
  'www.dgcp.mtsss.gov.pt': {
    'estado': 'sem-resposta',
    'desde': '2026-09-01',
    'enderecos': 1,
    'maquina': null
  }
};
