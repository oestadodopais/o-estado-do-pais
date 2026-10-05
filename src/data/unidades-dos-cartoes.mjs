/**
 * ---------------------------------------------------------------------------
 * AS UNIDADES QUE OS CARTÕES IMPRIMEM, NUMA FONTE SÓ (bloco R2, 03.10.2026)
 * ---------------------------------------------------------------------------
 *
 * A unidade de uma linha do livro-razão é escrita pelo motor, a partir da etiqueta da fonte, e diz em que é que o
 * número está contado na tabela de onde veio («% da população», «rácio», «variação em três anos, %»). Num cartão,
 * ao lado do número, é a primeira coisa que um leitor lê para saber de que é a percentagem, e o brief R2 (§5,
 * decisão 1) fixa a regra: uma unidade diz de que é a percentagem, uma contagem diz o que conta, um índice diz o
 * que indexa e qual é a base. A auditoria dos rótulos de 03.10.2026 e a triagem do lugar de direção
 * (`design/especime-v3/critica/AUDITORIA-R2-rotulos-2026-10-03.md`) disseram cartão a cartão onde a unidade da
 * linha não chega.
 *
 * O QUE ESTE FICHEIRO DECLARA, e é a única declaração da unidade de um cartão nacional:
 *
 *   `UNIDADES_DOS_CARTOES`  a unidade que o cartão de uma linha imprime, quando difere da unidade da linha, nas duas
 *                           línguas, em pedaços como os de uma pergunta (um algarismo entra por `{ nl, motivo }`), e o
 *                           APOIO: os literais que mostram que a unidade diz o que a fonte diz. O cartão rende-a com a
 *                           marca `data-unidade-da-casa`, e o portão de HTML só a aceita no cartão da sua linha, com o
 *                           texto desta declaração e com cada apoio no campo que diz (a porta da passagem K2-c e da
 *                           passagem P4-c, generalizada);
 *   `UNIDADES_DA_LINHA_ACEITES_NUM_CARTAO`  as unidades de linha que um cartão pode imprimir como o motor as escreveu,
 *                           cada uma com a razão de chegar. É uma lista FECHADA: um cartão de uma linha cuja unidade
 *                           não está aqui, e que não tem unidade declarada acima, fecha a construção pela régua do
 *                           inventário (`scripts/inventario-rotulos.mjs`). É assim que uma unidade nova do motor chega
 *                           a quem lê antes de chegar a um cartão.
 *
 * As medidas dos concelhos declaram a sua em `src/data/concelhos.mjs` (`unidadeDaCasa` e `apoioDaUnidadeDaCasa`),
 * porque cada uma tem 308 linhas e a declaração é da medida e não de uma linha.
 *
 * A LINHA DO LIVRO E O RECIBO NÃO MUDAM. A unidade da linha é do motor, e o recibo (`/livro-razao/<id>`) continua a
 * dizê-la como a linha a guarda: o que muda é o que o cartão imprime ao lado do número.
 *
 * OS APOIOS. Cada apoio é um literal com pelo menos quatro caracteres, e diz onde está:
 *   `{ campo, literal }`             num campo da linha do próprio cartão: `excerpt`, `unit`, `name`, `document.title`,
 *                                    `document.locator`, `derivation` ou `derivation_en`;
 *   `{ origem, campo, literal }`     num campo (`excerto`, `excertoEn` ou `documento`) de uma origem declarada em
 *                                    `ORIGENS_DAS_DEFINICOES` (`src/data/figuras.mjs`), selada como as outras;
 *   `{ pergunta: true }`             a unidade de cada língua é um pedaço da pergunta declarada da mesma medida, cujos
 *                                    pedaços a K16 audita (a regra da passagem K2-c).
 * O portão confere que cada literal está mesmo no campo que diz; não infere que o literal quer dizer o que a unidade
 * diz, e essa leitura é a de quem assina a declaração e a do leitor a frio, como na K16.
 *
 * NENHUM VALOR MUDA, e nenhuma linha muda de unidade: estas declarações são rótulos.
 */

/**
 * Um algarismo de uma idade, de uma base ou de um ano de referência: a régua do instrumento, não a medição.
 *
 * @param {string} nl
 */
const n = (nl) => ({ nl, motivo: 'escala-de-instrumento' });

/** @typedef {string | { nl: string, motivo: string }} PedacoDaUnidade */
/** @typedef {{ campo: string, literal: string } | { origem: string, campo: string, literal: string } | { pergunta: true }} ApoioDaUnidade */
/** @typedef {{ pt: PedacoDaUnidade[], en: PedacoDaUnidade[], apoio: ApoioDaUnidade[], achado: string }} UnidadeDoCartao */

/**
 * As unidades da casa dos cartões nacionais, por linha.
 *
 * @type {Record<string, UnidadeDoCartao>}
 */
export const UNIDADES_DOS_CARTOES = {
  /* ------------------------------------------------ as populações (achados 1 e 9) */
  'jovens-nem-2025': {
    pt: ['% das pessoas dos ', n('15'), ' aos ', n('29'), ' anos'],
    en: ['% of people aged ', n('15'), ' to ', n('29')],
    apoio: [
      { campo: 'excerpt', literal: 'Age class: From 15 to 29 years' },
      { campo: 'excerpt', literal: 'Percentage of total population' },
    ],
    achado: '1 (Blocking): «% da população» nomeava uma população maior do que a da linha, que é a dos 15 aos 29 anos.',
  },
  'competencias-digitais-2025': {
    pt: ['% das pessoas dos ', n('16'), ' aos ', n('74'), ' anos'],
    en: ['% of people aged ', n('16'), ' to ', n('74')],
    apoio: [
      { campo: 'excerpt', literal: 'Percentage of individuals' },
      { origem: 'eurostat-tepsr_sp410-descricao', campo: 'excerto', literal: 'individuals aged 16-74' },
    ],
    achado: '1 (Blocking): «% dos indivíduos» não dizia de que idades; a descrição do conjunto diz «individuals aged 16-74».',
  },
  'taxa-de-emprego-2025': {
    pt: ['% das pessoas dos ', n('20'), ' aos ', n('64'), ' anos'],
    en: ['% of people aged ', n('20'), ' to ', n('64')],
    apoio: [
      { campo: 'excerpt', literal: 'Age class: From 20 to 64 years' },
      { campo: 'excerpt', literal: 'Percentage of total population' },
    ],
    achado: '9: «% da população» não dizia a idade que a linha fixa.',
  },
  'taxa-de-desemprego-2025': {
    pt: ['% de quem trabalha ou procura trabalho'],
    en: ['% of people working or looking for work'],
    apoio: [
      { campo: 'excerpt', literal: 'Percentage of population in the labour force' },
      /* R2-b (04.10.2026, achado 6 da leitura a frio): a origem do apoio é uma das origens da pergunta da própria linha,
         que o recibo dela rende; o glossário da atividade não era. */
      { origem: 'eurostat-tipsun20-descricao', campo: 'excerto', literal: 'The labour force is the total number of people employed and unemployed.' },
    ],
    achado: '9: «% da população ativa» é o termo da fonte; a unidade diz em palavras comuns de quem é a percentagem, e a dobra guarda o termo.',
  },
  'taxa-de-desemprego-mip-2025': {
    pt: ['% de quem trabalha ou procura trabalho'],
    en: ['% of people working or looking for work'],
    apoio: [
      { campo: 'excerpt', literal: 'Percentage of population in the labour force' },
      { origem: 'eurostat-tipsun20-descricao', campo: 'excerto', literal: 'The labour force is the total number of people employed and unemployed.' },
    ],
    achado: '9: a mesma unidade da taxa de desemprego do painel social, porque é a mesma população.',
  },
  'desemprego-de-longa-duracao-2025': {
    pt: ['% de quem trabalha ou procura trabalho'],
    en: ['% of people working or looking for work'],
    apoio: [
      { campo: 'excerpt', literal: 'Percentage of population in the labour force' },
      { origem: 'glossario-atividade', campo: 'excerto', literal: 'The economically active population comprises employed and unemployed persons' },
    ],
    achado: '9: o desemprego de longa duração conta-se na mesma população que o desemprego; a dobra diz o ano de procura.',
  },
  'abandono-escolar-precoce-2025': {
    pt: ['% das pessoas dos ', n('18'), ' aos ', n('24'), ' anos'],
    en: ['% of people aged ', n('18'), ' to ', n('24')],
    apoio: [{ origem: 'glossario-abandono', campo: 'excerto', literal: 'refers to a person aged 18 to 24' }],
    achado: '9: «%» sozinho não dizia de que é a percentagem.',
  },
  'criancas-em-creche-2025': {
    pt: ['% das crianças com menos de três anos'],
    en: ['% of children under three'],
    apoio: [{ campo: 'excerpt', literal: 'Children aged less than 3 years in formal childcare' }],
    achado: '9 e 5: «%» sozinho não dizia de que é a percentagem.',
  },
  'risco-de-pobreza-ou-exclusao-2025': {
    pt: ['% da população'],
    en: ['% of the population'],
    apoio: [{ origem: 'glossario-arope', campo: 'excerto', literal: 'The AROPE rate is the share of the total population' }],
    achado: '9: «%» sozinho não dizia de que é a percentagem.',
  },
  'sobrecarga-do-custo-da-habitacao-2025': {
    pt: ['% da população'],
    en: ['% of the population'],
    apoio: [{ origem: 'eurostat-tespm140-populacao', campo: 'excerto', literal: 'Percentage of the population living in a household' }],
    achado: '9: «%» sozinho não dizia de que é a percentagem.',
  },
  'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025': {
    pt: ['% dos inquilinos a preço de mercado'],
    en: ['% of tenants at market rent'],
    apoio: [{ campo: 'excerpt', literal: 'Tenure status: Tenant, rent at market price' }],
    achado: '9: «%» sozinho não dizia de que é a percentagem; a linha fixa os inquilinos a preço de mercado.',
  },
  'necessidades-medicas-nao-satisfeitas-2025': {
    pt: ['% das pessoas'],
    en: ['% of people'],
    apoio: [{ origem: 'eurostat-tespm110-descricao', campo: 'excerto', literal: 'a person’s own assessment' }],
    achado: '9: «%» sozinho não dizia de que é a percentagem; a descrição do conjunto conta pessoas, pela avaliação de cada uma.',
  },
  'independencia-da-justica-2025': {
    pt: ['% das pessoas inquiridas'],
    en: ['% of respondents'],
    apoio: [{ origem: 'eurostat-sdg_16_40-descricao', campo: 'excerto', literal: 'respondents’ perceptions' }],
    achado: '9: «%» sozinho não dizia de que é a percentagem; a descrição do conjunto fala das perceções de quem respondeu ao inquérito.',
  },
  'disparidade-salarial-entre-sexos-2024': {
    pt: ['% do ganho por hora dos homens'],
    en: ['% of men’s hourly earnings'],
    apoio: [
      { campo: 'excerpt', literal: 'Percentage' },
      { origem: 'eurostat-earn-grgpg2-definicao', campo: 'excerto', literal: 'as a percentage of average gross hourly earnings of male paid employees' },
    ],
    achado: '9 e 18: «%» sozinho não dizia de que é a percentagem; a definição do Eurostat diz que é do ganho por hora dos homens.',
  },
  'penalizacao-antecipacao-um-ano-neutra': {
    pt: ['% da pensão'],
    en: ['% of the pension'],
    apoio: [
      { campo: 'document.title', literal: 'Reformar as Pensões em Portugal' },
      { campo: 'excerpt', literal: 'efeito da antecipação da idade de reforma' },
    ],
    achado: '9: «%» sozinho não dizia de que é o corte.',
  },
  'penalizacao-antecipacao-um-ano-sem-factor-2026': {
    pt: ['% da pensão'],
    en: ['% of the pension'],
    apoio: [{ campo: 'excerpt', literal: 'a penalização resulta apenas da redução de 0,5% por mês' }],
    achado: '9: «%» sozinho não dizia de que é o corte.',
  },
  'penalizacao-antecipacao-um-ano-com-factor-2026': {
    pt: ['% da pensão'],
    en: ['% of the pension'],
    apoio: [{ campo: 'excerpt', literal: 'a penalização passa de 22,6%, para um ano de antecipação' }],
    achado: '9: «%» sozinho não dizia de que é o corte.',
  },
  'crescimento-da-despesa-liquida-2025': {
    pt: ['% de crescimento num ano'],
    en: ['% growth over a year'],
    apoio: [{ campo: 'excerpt', literal: 'um crescimento da despesa líquida de 6,4% em 2025' }],
    achado: '9: «%» sozinho não dizia de que é a percentagem.',
  },

  /* --------------------------------------------------------- os preços (achado 9) */
  'ipc-variacao-homologa': {
    pt: ['% de variação em doze meses'],
    en: ['% change over twelve months'],
    apoio: [
      { campo: 'name', literal: 'Taxa de variação homóloga' },
      { origem: 'rp1-ipc-homologa', campo: 'excerto', literal: 'compara o nível da variável entre o mês corrente e o mesmo mês do ano anterior' },
    ],
    achado: '9: a forma da triagem para a inflação, «% de variação em doze meses».',
  },
  'ipc-alimentacao-variacao-homologa': {
    pt: ['% de variação em doze meses'],
    en: ['% change over twelve months'],
    apoio: [
      { campo: 'name', literal: 'Taxa de variação homóloga' },
      { origem: 'rp1-ipc-homologa', campo: 'excerto', literal: 'compara o nível da variável entre o mês corrente e o mesmo mês do ano anterior' },
    ],
    achado: '9: a mesma variação homóloga da inflação, na classe dos alimentos.',
  },
  'ipc-energia-em-casa-variacao-homologa': {
    pt: ['% de variação em doze meses'],
    en: ['% change over twelve months'],
    apoio: [
      { campo: 'name', literal: 'Taxa de variação homóloga' },
      { origem: 'rp1-ipc-classes-homologa', campo: 'excerto', literal: 'compara o nível da variável entre o mês corrente e o mesmo mês do ano anterior' },
    ],
    achado: '9: a mesma variação homóloga, na classe da eletricidade, do gás e dos outros combustíveis.',
  },
  'ipc-combustiveis-variacao-homologa': {
    pt: ['% de variação em doze meses'],
    en: ['% change over twelve months'],
    apoio: [
      { campo: 'name', literal: 'Taxa de variação homóloga' },
      { origem: 'rp1-ipc-classes-homologa', campo: 'excerto', literal: 'compara o nível da variável entre o mês corrente e o mesmo mês do ano anterior' },
    ],
    achado: '9: a mesma variação homóloga, na classe dos combustíveis.',
  },
  'ipc-rendas-variacao-homologa': {
    pt: ['% de variação em doze meses'],
    en: ['% change over twelve months'],
    apoio: [
      { campo: 'name', literal: 'Taxa de variação homóloga' },
      { origem: 'rp1-ipc-classes-homologa', campo: 'excerto', literal: 'compara o nível da variável entre o mês corrente e o mesmo mês do ano anterior' },
    ],
    achado: '9: a mesma variação homóloga, na classe das rendas.',
  },
  'ihpc-variacao-homologa': {
    pt: ['% de variação em doze meses'],
    en: ['% change over twelve months'],
    apoio: [
      { campo: 'excerpt', literal: 'Annual rate of change' },
      { origem: 'rp1-ihpc-homologa', campo: 'excerto', literal: 'compared to the same month of the previous year' },
    ],
    achado: '9: a variação homóloga do índice harmonizado, na mesma forma da inflação.',
  },
  'ipc-variacao-media-12-meses': {
    pt: ['% de variação média em doze meses'],
    en: ['average % change over twelve months'],
    apoio: [
      { campo: 'name', literal: 'Taxa de variação média dos últimos 12 meses' },
      { origem: 'rp1-ipc-media', campo: 'excerto', literal: 'compara o nível do índice médio de preços dos últimos doze meses com os doze meses imediatamente anteriores' },
    ],
    achado: '9: a variação média dos últimos doze meses, que não é a homóloga.',
  },
  'ipc-sem-habitacao-variacao-media-12-meses': {
    pt: ['% de variação média em doze meses'],
    en: ['average % change over twelve months'],
    apoio: [
      { campo: 'name', literal: 'Taxa de variação média dos últimos 12 meses' },
      { origem: 'rp1-ipc-media', campo: 'excerto', literal: 'compara o nível do índice médio de preços dos últimos doze meses com os doze meses imediatamente anteriores' },
    ],
    achado: '9: a mesma variação média, sem a habitação.',
  },

  /* ----------------------------------------- as variações e os pontos (achado 13) */
  'custo-unitario-do-trabalho-2025': {
    pt: ['% de variação em três anos'],
    en: ['% change over three years'],
    apoio: [{ campo: 'excerpt', literal: 'Percentage change (t/t-3)' }],
    achado: '13 e 16: «variação em três anos, %» lia-se como o cabeçalho de uma coluna; a variação passa do nome para a unidade.',
  },
  'taxa-de-cambio-efectiva-real-2025': {
    pt: ['% de variação em três anos'],
    en: ['% change over three years'],
    apoio: [{ campo: 'excerpt', literal: 'Percentage change (t/t-3)' }],
    achado: '13 e 16: a mesma forma do custo unitário do trabalho.',
  },
  'desempenho-das-exportacoes-2025': {
    pt: ['% de variação em três anos'],
    en: ['% change over three years'],
    apoio: [
      { campo: 'excerpt', literal: '3-year change' },
      { origem: 'eurostat-tipsbp60-descricao', campo: 'excerto', literal: 'calculated as the 3 year % change' },
    ],
    achado: '4 (passagem R2-b, 04.10.2026, a decisão do lugar de direção sobre o achado parado): a forma segue o excerto da linha («Share of exports of advanced economies» e «3-year change»); a unidade diz a variação em três anos, e o total de que a quota é parte vai para o nome e para a dobra.',
  },
  'taxa-de-actividade-2025': {
    pt: ['diferença em três anos, em pontos percentuais'],
    en: ['difference over three years, in percentage points'],
    apoio: [{ campo: 'excerpt', literal: 'Percentage point change (t-(t-3))' }],
    achado: '13 e 16: uma diferença entre duas percentagens conta-se em pontos, e não é uma variação percentual.',
  },
  'precos-da-habitacao-2025': {
    pt: ['% de variação anual média'],
    en: ['average annual % change'],
    apoio: [{ campo: 'excerpt', literal: 'Annual average rate of change' }],
    achado: '13: «variação anual média, %» lia-se como o cabeçalho de uma coluna.',
  },
  'disparidade-de-emprego-entre-sexos-2025': {
    pt: ['pontos percentuais'],
    en: ['percentage points'],
    apoio: [{ pergunta: true }],
    achado: '13: fica como a passagem K2-c a escreveu; a declaração mudou de casa, de `DEFINICOES_DAS_MEDIDAS` para aqui.',
  },

  /* ------------------------------------- as dívidas, o crédito e a balança (10, 15) */
  'fluxo-de-credito-as-empresas-2025': {
    pt: ['% da dívida no fim do ano anterior'],
    en: ['% of debt at the end of the previous year'],
    apoio: [
      { campo: 'excerpt', literal: 'Percentage of stocks (closing balance sheet)' },
      { origem: 'pdm-credito-as-empresas', campo: 'excerto', literal: 'in % of NFC debt stock in t-1' },
    ],
    achado: '15: «stock» lia-se como um inventário e «período» escondia que é o ano.',
  },
  'fluxo-de-credito-as-familias-2025': {
    pt: ['% da dívida no fim do ano anterior'],
    en: ['% of debt at the end of the previous year'],
    apoio: [
      { campo: 'excerpt', literal: 'Percentage of stocks (closing balance sheet)' },
      { origem: 'pdm-credito-as-familias', campo: 'excerto', literal: 'in % of household debt stock in t-1' },
    ],
    achado: '15: a mesma forma do crédito às empresas.',
  },
  'saldo-da-balanca-corrente-2025': {
    pt: ['% do PIB, média do ano e dos dois anteriores'],
    en: ['% of GDP, average of the year and the two before'],
    apoio: [
      { campo: 'excerpt', literal: 'Percentage of GDP - three-year average' },
      { origem: 'pdm-balanca-corrente', campo: 'excerto', literal: '3-year backward moving average' },
    ],
    achado: '10: «média de três anos» não dizia que anos; a linha da Comissão diz a média móvel para trás.',
  },

  /* ------------------------------------------------------------ o PIB real (12) */
  'pib-real-per-capita-2025': {
    pt: ['euros por pessoa, a preços de ', n('2015')],
    en: ['euros per person, at ', n('2015'), ' prices'],
    apoio: [
      { campo: 'excerpt', literal: 'Chain linked volumes (2015), euro per capita' },
      { origem: 'eurostat-nama10-volumes', campo: 'excerto', literal: 'excluding inflation' },
    ],
    achado: '12: «volumes encadeados (2015)» pedia conhecimento técnico; a dobra guarda o termo.',
  },

  /* ---------------------------------------------- o rácio e o fator (achado 14) */
  'racio-s80-s20-2025': {
    pt: ['vezes'],
    en: ['times'],
    apoio: [{ pergunta: true }],
    achado: '14: «rácio» não dizia como se lê o número; a pergunta declarada diz «quantas vezes».',
  },
  'factor-sustentabilidade-2026': {
    pt: ['multiplicador da pensão'],
    en: ['pension multiplier'],
    apoio: [
      { campo: 'excerpt', literal: 'este factor é de 0,8237' },
      { campo: 'excerpt', literal: 'correspondendo a uma redução de 17,63% do montante estatutário da pensão' },
    ],
    achado: '14: «factor» não dizia como se lê o número; o excerto diz que o fator corresponde a uma redução do montante da pensão.',
  },

  /* -------------------------------------------- o dinheiro por extenso (brief, §3.3) */
  'remuneracao-bruta-mensal-media': {
    pt: ['euros por mês'],
    en: ['euros per month'],
    apoio: [{ campo: 'unit', literal: '€ por mês' }],
    achado: 'a regra da casa do euro por extenso: a linha escreve «€ por mês», e o cartão escreve a palavra pela declaração.',
  },
  'linha-de-risco-de-pobreza-2025': {
    pt: ['euros por ano'],
    en: ['euros per year'],
    apoio: [{ campo: 'unit', literal: '€ por ano' }],
    achado: 'a regra da casa do euro por extenso; a dobra diz que a linha é a de uma pessoa que vive sozinha (achado 24).',
  },
  'pensao-media-anual-2025': {
    pt: ['euros por pensionista por ano'],
    en: ['euros per pensioner per year'],
    apoio: [
      { campo: 'unit', literal: '€ por pensionista por ano' },
      { origem: 'rp1-pensoes-formula', campo: 'excerto', literal: 'Valor das pensões da segurança social/ Pensionistas da segurança social' },
    ],
    achado: 'a regra da casa do euro por extenso; o [verify] do achado 24 conferido: a fórmula do INE divide pelos pensionistas.',
  },

  /* -------------------------------------- os lugares, a área e os pelouros (25, 27) */
  'evora-camara-lugares': {
    pt: ['lugares na câmara'], en: ['council seats'],
    apoio: [{ campo: 'document.locator', literal: 'órgão Câmara Municipal' }],
    achado: '27: «lugares» não dizia de quê.',
  },
  'evora-camara-mandatos-ps-2009': {
    pt: ['lugares na câmara'], en: ['council seats'],
    apoio: [{ campo: 'document.locator', literal: 'órgão Câmara Municipal' }],
    achado: '27: «lugares» não dizia de quê.',
  },
  'evora-camara-mandatos-ps-2025': {
    pt: ['lugares na câmara'], en: ['council seats'],
    apoio: [{ campo: 'document.locator', literal: 'órgão Câmara Municipal' }],
    achado: '27: «lugares» não dizia de quê.',
  },
  'evora-camara-mandatos-cdu-2013': {
    pt: ['lugares na câmara'], en: ['council seats'],
    apoio: [{ campo: 'document.locator', literal: 'órgão Câmara Municipal' }],
    achado: '27: «lugares» não dizia de quê.',
  },
  'evora-camara-mandatos-cdu-2017': {
    pt: ['lugares na câmara'], en: ['council seats'],
    apoio: [{ campo: 'document.locator', literal: 'órgão Câmara Municipal' }],
    achado: '27: «lugares» não dizia de quê.',
  },
  'evora-camara-mandatos-cdu-2021': {
    pt: ['lugares na câmara'], en: ['council seats'],
    apoio: [{ campo: 'document.locator', literal: 'órgão Câmara Municipal' }],
    achado: '27: «lugares» não dizia de quê.',
  },
  'evora-executivo-2025-ps': {
    pt: ['lugares na câmara'], en: ['council seats'],
    apoio: [{ campo: 'document.locator', literal: 'órgão Câmara Municipal' }],
    achado: '27: «lugares» não dizia de quê.',
  },
  'evora-executivo-2025-ad': {
    pt: ['lugares na câmara'], en: ['council seats'],
    apoio: [{ campo: 'document.locator', literal: 'órgão Câmara Municipal' }],
    achado: '27: «lugares» não dizia de quê.',
  },
  'evora-executivo-2025-cdu': {
    pt: ['lugares na câmara'], en: ['council seats'],
    apoio: [{ campo: 'document.locator', literal: 'órgão Câmara Municipal' }],
    achado: '27: «lugares» não dizia de quê.',
  },
  'evora-executivo-2025-chega': {
    pt: ['lugares na câmara'], en: ['council seats'],
    apoio: [{ campo: 'document.locator', literal: 'órgão Câmara Municipal' }],
    achado: '27: «lugares» não dizia de quê.',
  },
  'licencas-de-construcao-2025': {
    pt: ['metros quadrados por mil habitantes'],
    en: ['square metres per thousand residents'],
    apoio: [{ campo: 'excerpt', literal: 'Square metres per 1000 inhabitants' }],
    achado: '27: «m² por 1000 habitantes» abreviava a unidade.',
  },
  'evora-pelouros-2021-presidente': {
    pt: ['áreas de responsabilidade (pelouros)'], en: ['areas of responsibility (portfolios)'],
    apoio: [{ campo: 'unit', literal: 'pelouros' }, { campo: 'excerpt', literal: 'Pelouro:' }],
    achado: '25: «pelouros» pedia que o leitor soubesse o que é um pelouro.',
  },
  'evora-pelouros-2021-vice-presidente': {
    pt: ['áreas de responsabilidade (pelouros)'], en: ['areas of responsibility (portfolios)'],
    apoio: [{ campo: 'unit', literal: 'pelouros' }, { campo: 'excerpt', literal: 'Pelouro:' }],
    achado: '25: «pelouros» pedia que o leitor soubesse o que é um pelouro.',
  },
  'evora-pelouros-2025-presidente': {
    pt: ['áreas de responsabilidade (pelouros)'], en: ['areas of responsibility (portfolios)'],
    apoio: [{ campo: 'unit', literal: 'pelouros' }, { campo: 'excerpt', literal: 'Pelouro:' }],
    achado: '25: «pelouros» pedia que o leitor soubesse o que é um pelouro.',
  },
  'evora-pelouros-2025-vice-presidente': {
    pt: ['áreas de responsabilidade (pelouros)'], en: ['areas of responsibility (portfolios)'],
    apoio: [{ campo: 'unit', literal: 'pelouros' }, { campo: 'excerpt', literal: 'Pelouro:' }],
    achado: '25: «pelouros» pedia que o leitor soubesse o que é um pelouro.',
  },
  'evora-pelouros-2025-vereadora': {
    pt: ['áreas de responsabilidade (pelouros)'], en: ['areas of responsibility (portfolios)'],
    apoio: [{ campo: 'unit', literal: 'pelouros' }, { campo: 'excerpt', literal: 'Pelouro:' }],
    achado: '25: «pelouros» pedia que o leitor soubesse o que é um pelouro.',
  },
};

/**
 * AS UNIDADES DE LINHA QUE UM CARTÃO IMPRIME COMO O MOTOR AS ESCREVEU, lidas uma a uma no bloco R2 com as três
 * perguntas da auditoria (claro, exato, o certo para o caso). A chave é a cadeia exata do campo `unit`; a edição
 * inglesa imprime a entrada do dicionário (`src/i18n/unidades.mjs`).
 *
 * @type {Record<string, string>}
 */
export const UNIDADES_DA_LINHA_ACEITES_NUM_CARTAO = {
  euros: 'Uma quantia em euros, com o que ela é no nome do cartão (a dívida, o orçamento, as verbas). A auditoria dá-a por clara («What is fine»).',
  pessoas: 'Uma contagem de pessoas, com quem são no nome do cartão. A auditoria dá-a por clara.',
  empresas: 'Uma contagem de empresas, com quais no nome do cartão. A auditoria dá-a por clara.',
  dias: 'Um prazo em dias, com de quê no nome do cartão. A auditoria dá-a por clara.',
  municípios: 'Uma contagem de concelhos, com onde no nome do cartão. A auditoria dá-a por clara.',
  votos: 'Uma contagem de votos, com em quê no nome do cartão. A auditoria dá-a por clara.',
  'euros por mês': 'Uma quantia mensal em euros. A auditoria dá-a por clara.',
  'por mil pessoas em idade ativa': 'Uma taxa com o denominador dito. A auditoria dá-a por clara.',
  '% do PIB': 'O termo da fonte, curto; a triagem do achado 10 deixa-o na unidade e manda explicar o PIB na dobra, que as perguntas da forma única já explicam.',
  '% do VAB empresarial': 'O termo da fonte, curto; a triagem do achado 10 deixa-o na unidade. A explicação do VAB na dobra ficou por fazer: nenhuma origem declarada o define (o relatório do bloco R2).',
  'índice (UE-27 = 100)': 'Um índice com a base dita; a triagem do achado 11 deixa a unidade. A explicação na dobra ficou por fazer: nenhuma origem declarada diz a paridade do poder de compra (o relatório do bloco R2).',
  'índice (Portugal = 100)': 'Um índice com a base dita; a triagem do achado 11 deixa a unidade, e a nota da medida dos concelhos já diz que Portugal vale cem.',
  '% do orçamento': 'A triagem do achado 24 mandava «% da receita prevista no orçamento» se o excerto o dissesse; os excertos das duas linhas não dizem «prevista», e a unidade fica com o termo da fonte (o relatório do bloco R2).',
};

/**
 * OS CARTÕES QUE IMPRIMEM A UNIDADE DA LINHA SEM ELA ESTAR NA LISTA ACIMA, declarados com a razão. Não é uma
 * dispensa: é a dívida dita no sítio onde a régua a lê.
 *
 * @type {Record<string, string>}
 */
export const CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA = {
  'agua-nao-faturada-portugal-2024':
    '[verify] A unidade é «%», e a triagem do achado 9 manda dizer de que é a percentagem; o excerto da linha está por confirmar («[a verificar]»), e por isso não há literal da fonte que diga de quê.',
};

/**
 * OS NOMES QUE DEIXAM A VARIAÇÃO PARA A UNIDADE (passagem R2-b, 04.10.2026, a decisão do lugar de direção sobre o que o
 * construtor do R2 deixou). O bloco K2-b pôs a variação no nome dos cartões de preços, porque o nome de nível se lia como
 * um preço; o R2 pôs a variação na unidade declarada do mesmo cartão («% de variação em doze meses»), e o cartão passou a
 * dizê-la duas vezes. Onde a unidade declarada a diz ao pé do valor (o cartão nacional, o cartão da página da União e a
 * faixa dos países), o nome é o de nível; onde o nome aparece sem essa unidade (a primeira página, o índice do
 * livro-razão, o recibo), fica o nome do K2-b, que diz a variação. A régua dos rótulos e a da voz leem esta tabela por
 * conta própria (a marca `data-nome="cartao"`).
 *
 * @type {Record<string, { pt: string, en: string }>}
 */
export const NOMES_COM_A_VARIACAO_NA_UNIDADE = {
  'ipc-alimentacao-variacao-homologa': { pt: 'Preços dos alimentos e das bebidas não alcoólicas', en: 'Prices of food and non-alcoholic beverages' },
  'ipc-energia-em-casa-variacao-homologa': { pt: 'Preços da energia em casa', en: 'Home energy prices' },
  'ipc-combustiveis-variacao-homologa': { pt: 'Preços dos combustíveis', en: 'Fuel prices' },
  'ipc-rendas-variacao-homologa': { pt: 'Preços das rendas', en: 'Rent prices' },
  'ipc-sem-habitacao-variacao-media-12-meses': { pt: 'Preços sem a habitação', en: 'Prices excluding housing' },
  'precos-da-habitacao-2025': { pt: 'Preços da habitação', en: 'House prices' },
};

/**
 * O nome de nível de um cartão cuja unidade declarada diz a variação, ou `null`. Só vale com a unidade declarada: um
 * nome sem variação ao pé de uma unidade que também não a diz seria o defeito que o K2-b corrigiu.
 *
 * @param {string} id
 * @param {'pt'|'en'|string} lang
 * @returns {string | null}
 */
export function nomeComAVariacaoNaUnidade(id, lang) {
  if (!Object.prototype.hasOwnProperty.call(NOMES_COM_A_VARIACAO_NA_UNIDADE, id)) return null;
  if (!Object.prototype.hasOwnProperty.call(UNIDADES_DOS_CARTOES, id)) return null;
  const n = NOMES_COM_A_VARIACAO_NA_UNIDADE[id];
  return lang === 'en' ? n.en : n.pt;
}

/**
 * A unidade da casa de um cartão nacional, na língua da página, ou `null` quando o cartão imprime a da linha.
 *
 * @param {string} id
 * @param {'pt'|'en'|string} lang
 * @returns {PedacoDaUnidade[] | null}
 */
export function unidadeDoCartao(id, lang) {
  const entrada = Object.prototype.hasOwnProperty.call(UNIDADES_DOS_CARTOES, id) ? UNIDADES_DOS_CARTOES[id] : null;
  if (!entrada) return null;
  return lang === 'en' ? entrada.en : entrada.pt;
}
