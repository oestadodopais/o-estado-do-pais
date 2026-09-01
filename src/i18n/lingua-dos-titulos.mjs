/**
 * ---------------------------------------------------------------------------
 * A LÍNGUA DO TÍTULO DE CADA DOCUMENTO DO LIVRO-RAZÃO (I91, segunda metade)
 * ---------------------------------------------------------------------------
 *
 * **O título de um documento é um nome, e um nome não se traduz.** O que
 * faltava era dizer em que língua ele está: «Evolução do endividamento total,
 * por município - prestação de contas 2024» rende-se dentro de uma página
 * inglesa, e sem `lang="pt-PT"` um leitor de ecrã lê-o com fonética inglesa —
 * exactamente o defeito que a I91 abriu na referência legal do selo das áreas,
 * fechado a 29.08.2026 pela primeira metade daquela linha.
 *
 * É a MESMA regra, e a mesma forma, que os títulos dos estudos já tinham desde
 * 27.08.2026 (`linguaDoTitulo` em `src/data/studies.mjs`, aplicada por
 * `TituloDeTrabalho.astro`). A diferença é a origem: ali a língua de cada
 * edição está declarada no arquivo dos trabalhos, e aqui o livro-razão não a
 * guarda. Guarda o título, e mais nada.
 *
 * ---------------------------------------------------------------------------
 * PORQUE É UMA TABELA E NÃO UMA REGRA
 * ---------------------------------------------------------------------------
 * A tentação era marcar todos os `document.title` com `pt-PT`, e está errada:
 * dos 67 títulos distintos do livro-razão, **34 estão em inglês** — as séries
 * do Eurostat («Real GDP per capita», «Gender employment gap»), o índice da
 * Transparency International, o PIB regional. Marcá-los `pt-PT` mandaria um
 * leitor de ecrã ler inglês com fonética portuguesa, que é o mesmo defeito
 * virado ao contrário.
 *
 * E a tentação seguinte era adivinhar a língua por palavras ou por acentos.
 * Também está errada: adivinhar é inventar, e uma cadeia como «RASARP —
 * Relatório Anual dos Serviços de Águas e Resíduos em Portugal» ou «Corruption
 * Perceptions Index» não precisa de adivinhação nenhuma — precisa de alguém que
 * olhe para ela uma vez e o escreva. É o que esta tabela é: **um título, uma
 * língua, declarada à mão**, e `scripts/check-lingua.mjs` fecha a construção
 * quando o livro-razão traz um título que não está aqui. Um título novo chega
 * assim a quem decide, em vez de se marcar sozinho.
 *
 * O MARCADOR NÃO ESTÁ NESTA TABELA. Uma linha cujo `document.title` seja
 * `[a verificar]` não tem título nenhum, e o marcador já se rende na forma da
 * casa nas duas edições, com `lang="pt-PT"` (`CampoDaLinha`). Declarar a língua
 * do marcador seria declarar a língua de um buraco.
 */

/** `pt` ou `en`, para cada título distinto do campo `document.title`. */
export const LINGUA_DOS_TITULOS = {
  /* --- os documentos portugueses ---------------------------------------- */
  'Evolução do endividamento total, por município - prestação de contas 2024': 'pt',
  'Lista do prazo médio de pagamento registado por município em dezembro de 2025': 'pt',
  'População residente (N.º) por Local de residência (NUTS - 2024), Sexo e Grupo etário (Por ciclos de vida); Anual - INE, Estimativas anuais da população residente':
    'pt',
  'Poder de compra per capita por Localização geográfica (NUTS - 2024); Bienal - INE, Estudo sobre o poder de compra concelhio':
    'pt',
  'Empresas (N.º) por Localização geográfica (NUTS - 2024) e Dimensão; Anual - INE, Sistema de contas integradas das empresas':
    'pt',
  'SIE - Desemprego registado por concelhos': 'pt',
  'Resumo - Desemprego registado nos Açores': 'pt',
  'Prestação de Contas 2025': 'pt',
  'Boletim Mensal por Concelhos': 'pt',
  'Evolução endividamento total': 'pt',
  'Autárquicas 2025 — resultados oficiais por território': 'pt',
  'Autárquicas 2021 — resultados oficiais por território': 'pt',
  'Autárquicas 2017 — resultados oficiais por território': 'pt',
  'Autárquicas 2013 — resultados oficiais por território': 'pt',
  'Autárquicas 2009 — resultados oficiais por território': 'pt',
  'Listagem de entidades PRR': 'pt',
  'Executivo — Câmara Municipal de Évora': 'pt',
  'Relatório de Gestão 2021': 'pt',
  'Relatório de Gestão 2017': 'pt',
  'Relatório de Gestão 2016': 'pt',
  'Relatório de Gestão 2015': 'pt',
  'Reformar as Pensões em Portugal: Por um Sistema Sustentável, Adequado e Justo — um Contrato entre Gerações':
    'pt',
  'Carta Administrativa Oficial de Portugal (CAOP)': 'pt',
  'Certificação Legal das Contas': 'pt',
  'Concentração do VAB nas 4 maiores (%)': 'pt',
  'Poder de compra per capita (PT=100)': 'pt',
  'População residente (N.º) × sexo × grupo etário': 'pt',
  'Empresas (N.º) × CAE divisão × forma jurídica': 'pt',
  'VAB (€) das empresas × CAE divisão': 'pt',
  'RASARP — Relatório Anual dos Serviços de Águas e Resíduos em Portugal': 'pt',
  'Anuário Financeiro dos Municípios Portugueses 2024 — apresentação das conclusões': 'pt',
  /* Os documentos do primeiro domínio da primeira vaga (estudo 13 do motor). */
  'Ganho médio mensal (€) por Localização geográfica (NUTS - 2024); Anual - MTSSS/GEP, Quadros de pessoal':
    'pt',
  'PARECER RELATIVO AO RELATÓRIO ANUAL DE PROGRESSO 2026': 'pt',
  'Decreto-Lei n.º 139/2025, de 29 de dezembro': 'pt',
  /* Os dois documentos do próprio sítio. O nome deles é português nas duas
     edições, e é o nome com que eles se publicam: a edição inglesa cita-os pelo
     nome que eles têm, e diz em que língua está. */
  'Arquivo de estudos': 'pt',
  'Registo de correções': 'pt',

  /* --- os documentos ingleses ------------------------------------------- */
  'Gross domestic product (GDP) at current market prices by NUTS 2 region': 'en',
  'Government deficit/surplus, debt and associated data': 'en',
  'Gender pay gap in unadjusted form by NACE Rev. 2 activity - structure of earnings survey methodology':
    'en',
  'Monthly minimum wages - bi-annual data': 'en',
  'Young persons (aged 15-24) neither in employment nor in education and training - % of total population in private households in the same age group':
    'en',
  'Unemployment rate - annual data': 'en',
  'Unemployment by sex and age - annual data': 'en',
  'Share of exports of advanced economies': 'en',
  'Self-reported unmet need for medical care by sex': 'en',
  'Residential building permits - annual data': 'en',
  'Real GDP per capita': 'en',
  'Real effective exchange rate - percentage changes, 42 trading partners': 'en',
  'Perceived independence of the justice system': 'en',
  'People at risk of poverty or social exclusion': 'en',
  'Non-financial corporations excluding foreign direct investments credit flow, consolidated': 'en',
  'Non-financial corporations debt, consolidated - % of GDP': 'en',
  'Nominal unit labour cost per hour worked': 'en',
  'Net international investment position - annual data': 'en',
  'Long-term unemployment rate by sex': 'en',
  'Labour force participation rate': 'en',
  'Individuals who have basic or above basic overall digital skills by sex': 'en',
  'Income quintile share ratio (S80/S20) by sex': 'en',
  'Housing cost overburden rate': 'en',
  'Household including non-profit institutions serving households (NPISH) credit flow, consolidated':
    'en',
  'Household debt including non-profit institutions serving households, consolidated': 'en',
  'House price index, nominal - annual data': 'en',
  'Gross non-performing loans, domestic and foreign entities - % of gross loans': 'en',
  'Gross fixed capital formation at current prices': 'en',
  'Gross domestic expenditure on research and development (R&D)': 'en',
  'General government gross debt (EDP concept), consolidated - annual data': 'en',
  'Gender employment gap': 'en',
  'Employment and labour force by sex and age - annual data': 'en',
  'Early leavers from education and training by labour status': 'en',
  'Current account balance - 3 year average': 'en',
  'Corruption Perceptions Index': 'en',
  'Children aged less than 3 years in formal childcare': 'en',
};

/**
 * A MARCA DE LÍNGUA DE UM TÍTULO DE DOCUMENTO, NUMA PÁGINA DE UMA LÍNGUA.
 *
 * Devolve `pt-PT` ou `en` quando o título está numa língua que não é a da
 * página, e `null` quando é a da página ou quando não há declaração. A forma é
 * a de `linguaDoTitulo()` dos estudos, e de propósito: as duas respondem à
 * mesma pergunta sobre a mesma espécie de cadeia, e um leitor que conheça uma
 * conhece a outra.
 *
 * **Marca nas duas edições**, como a referência legal do selo das áreas: um
 * título inglês dentro de uma página portuguesa tem o mesmo defeito que um
 * título português dentro de uma página inglesa, e a marca que o corrige é a
 * mesma escrita ao contrário.
 *
 * Um título sem declaração não ganha marca nenhuma. Não é um silêncio: é
 * `scripts/check-lingua.mjs` que o vê, e fecha a construção.
 */
export function linguaDoTituloDoDocumento(titulo, lang = 'pt') {
  const cru = titulo === null || titulo === undefined ? '' : String(titulo);
  const declarada = Object.prototype.hasOwnProperty.call(LINGUA_DOS_TITULOS, cru)
    ? LINGUA_DOS_TITULOS[cru]
    : null;
  if (declarada === null) return null;
  if (declarada === lang) return null;
  return declarada === 'pt' ? 'pt-PT' : 'en';
}

/**
 * ---------------------------------------------------------------------------
 * E A LÍNGUA DE CADA RÓTULO DA FONTE (29.08.2026)
 * ---------------------------------------------------------------------------
 *
 * `name` é o rótulo com que o publicador imprime a figura, copiado do ficheiro
 * alojado. É um nome, como o título de um documento, e vale-lhe a mesma regra
 * pela mesma razão: não se traduz, e tem de dizer em que língua está, senão um
 * leitor de ecrã lê «PMP (N.º dias)» com fonética inglesa dentro da edição
 * inglesa.
 *
 * Fica NESTE ficheiro e não num ao lado, porque é a mesma pergunta sobre a
 * mesma espécie de cadeia. Duas tabelas em dois ficheiros seriam duas coisas
 * para lembrar no dia em que a regra mudar, e a segunda ficava para trás.
 *
 * São quinze rótulos distintos em 1553 linhas, e catorze deles são portugueses:
 * o décimo quinto é a série do Eurostat. Como na tabela de cima, a língua
 * escreve-se à mão por quem olha para a cadeia — «Total» é a palavra que o IEFP
 * imprime na folha portuguesa dele, e adivinhá-la pelo aspecto dava inglês.
 * `scripts/check-lingua.mjs` fecha a construção quando o livro-razão traz um
 * rótulo que não está aqui, e quando esta tabela nomeia um que já não existe.
 */

/** `pt` ou `en`, para cada rótulo distinto do campo `name`. */
export const LINGUA_DOS_ROTULOS = {
  /* --- os rótulos portugueses ------------------------------------------- */
  'PMP (N.º dias)': 'pt',
  Total: 'pt',
  TOTAL: 'pt',
  'DESEMPREGO REGISTADO': 'pt',
  'Poder de compra per capita por Localização geográfica (NUTS - 2024); Bienal - INE, Estudo sobre o poder de compra concelhio':
    'pt',
  'Empresas (N.º) por Localização geográfica (NUTS - 2024) e Dimensão; Anual - INE, Sistema de contas integradas das empresas':
    'pt',
  'Empresas (N.º) por Localização geográfica (NUTS - 2024), Atividade económica (Divisão - CAE Rev. 3) e Forma jurídica; Anual - INE, Sistema de contas integradas das empresas':
    'pt',
  'População residente (N.º) por Local de residência (NUTS - 2024), Sexo e Grupo etário (Por ciclos de vida); Anual - INE, Estimativas anuais da população residente':
    'pt',
  'População residente (N.º) por Local de residência (NUTS - 2024), Sexo e Grupo etário; Anual - INE, Estimativas anuais da população residente':
    'pt',
  'Indicador de concentração do valor acrescentado bruto das quatro maiores empresas (%) por Localização geográfica (NUTS - 2024); Anual - INE, Sistema de contas integradas das empresas':
    'pt',
  'Valor acrescentado bruto (€) das Empresas por Localização geográfica (NUTS - 2024) e Atividade económica (Divisão - CAE Rev. 3); Anual - INE, Sistema de contas integradas das empresas':
    'pt',
  'DÍVIDA TOTAL DE OPERAÇÕES ORÇAMENTAIS = (1) + (2)': 'pt',
  'LIMITE = Média dos Últimos 3 Exercícios * 1,5': 'pt',
  'Dívida Total no Início do Mandato': 'pt',
  'Ganho médio mensal (€) por Localização geográfica (NUTS - 2024); Anual - MTSSS/GEP, Quadros de pessoal':
    'pt',

  /* --- os rótulos ingleses ----------------------------------------------- */
  'Gross domestic product (GDP) at current market prices by NUTS 2 region': 'en',
  'Government deficit/surplus, debt and associated data': 'en',
  'Gender pay gap in unadjusted form by NACE Rev. 2 activity - structure of earnings survey methodology':
    'en',
  'Monthly minimum wages - bi-annual data': 'en',
};

/**
 * A MARCA DE LÍNGUA DE UM RÓTULO DA FONTE, NUMA PÁGINA DE UMA LÍNGUA.
 *
 * A mesma forma e o mesmo contrato de `linguaDoTituloDoDocumento()`: `pt-PT` ou
 * `en` quando o rótulo está numa língua que não é a da página, `null` quando é
 * a da página ou quando não há declaração. Um rótulo sem declaração não ganha
 * marca nenhuma, e não é um silêncio: é `scripts/check-lingua.mjs` que o vê.
 */
export function linguaDoRotuloDaFonte(rotulo, lang = 'pt') {
  const cru = rotulo === null || rotulo === undefined ? '' : String(rotulo);
  const declarada = Object.prototype.hasOwnProperty.call(LINGUA_DOS_ROTULOS, cru)
    ? LINGUA_DOS_ROTULOS[cru]
    : null;
  if (declarada === null) return null;
  if (declarada === lang) return null;
  return declarada === 'pt' ? 'pt-PT' : 'en';
}

/**
 * ---------------------------------------------------------------------------
 * E A LÍNGUA DO NOME DE CADA ORGANISMO (I97, 29.08.2026)
 * ---------------------------------------------------------------------------
 *
 * `source` é o nome de quem publica o número, escrito como o organismo se
 * escreve. É um nome, como o título de um documento e como o rótulo da fonte, e
 * vale-lhe a mesma regra pela mesma razão: não se traduz, e diz em que língua
 * está. Sem isso, «Direção-Geral das Autarquias Locais (DGAL)» era lido com
 * fonética inglesa em 2 798 sítios da edição inglesa.
 *
 * NÃO SE TRADUZ, E NEM SEQUER PARA OS QUE TÊM NOME INGLÊS OFICIAL. O INE publica
 * em inglês como «Statistics Portugal», e escrever isso aqui era a casa a
 * escolher por qual dos dois nomes a fonte se chama nesta linha. A linha do
 * livro-razão guarda um, e é esse que se rende, na língua em que está.
 *
 * SÃO DEZASSEIS NOMES E QUINZE SÃO PORTUGUESES. O décimo sexto é o Eurostat, que
 * é o nome inglês de um organismo europeu e leva `lang="en"` na edição
 * portuguesa, como qualquer outro nome fora da língua da página. As siglas
 * contam como o nome de que saíram: «INE», «ERSAR» e «PORDATA» são portuguesas,
 * e uma sigla portuguesa lida com fonética inglesa soa a outra coisa.
 *
 * O NOME DA PRÓPRIA CASA fica em português nas duas edições, como o «Arquivo de
 * estudos» e o «Registo de correções» da tabela de cima: a edição inglesa cita a
 * casa pelo nome que ela tem.
 *
 * O MARCADOR NÃO ESTÁ AQUI, pela razão de sempre: uma linha cujo `source` é
 * `[a verificar]` não tem organismo nenhum, e declarar a língua de um buraco não
 * diz nada. `CampoDaLinha` já o rende com `lang="pt-PT"`.
 */

/** `pt` ou `en`, para cada valor distinto do campo `source`. */
export const LINGUA_DAS_FONTES = {
  /* --- os organismos portugueses ---------------------------------------- */
  'Direção-Geral das Autarquias Locais (DGAL)': 'pt',
  INE: 'pt',
  'Instituto do Emprego e Formação Profissional (IEFP)': 'pt',
  'Município de Évora': 'pt',
  'Direção Regional de Qualificação Profissional e Emprego (DRQPE)': 'pt',
  'Instituto de Emprego da Madeira, IP-RAM (IEM)': 'pt',
  'Secretaria-Geral do Ministério da Administração Interna (SGMAI)': 'pt',
  'Estrutura de Missão Recuperar Portugal': 'pt',
  'Grupo de Trabalho para a Reforma da Segurança Social': 'pt',
  'Direção-Geral do Território (DGT)': 'pt',
  'Marques, Cruz & Associados': 'pt',
  ERSAR: 'pt',
  'CICF/IPCA — Anuário Financeiro dos Municípios Portugueses': 'pt',
  PORDATA: 'pt',
  'Conselho das Finanças Públicas': 'pt',
  'Diário da República': 'pt',
  /* A casa, que se cita a si própria pelo nome que tem. */
  'O Estado do País': 'pt',

  /* --- o organismo de nome inglês --------------------------------------- */
  Eurostat: 'en',
};

/**
 * A MARCA DE LÍNGUA DE UM NOME DE ORGANISMO, NUMA PÁGINA DE UMA LÍNGUA.
 *
 * O mesmo contrato de `linguaDoTituloDoDocumento()`: `pt-PT` ou `en` quando o
 * nome está numa língua que não é a da página, `null` quando é a da página ou
 * quando não há declaração. Um nome sem declaração não ganha marca nenhuma, e
 * `scripts/check-lingua.mjs` fecha a construção quando um chega sem ela.
 */
export function linguaDaFonte(fonte, lang = 'pt') {
  const cru = fonte === null || fonte === undefined ? '' : String(fonte);
  const declarada = Object.prototype.hasOwnProperty.call(LINGUA_DAS_FONTES, cru)
    ? LINGUA_DAS_FONTES[cru]
    : null;
  if (declarada === null) return null;
  if (declarada === lang) return null;
  return declarada === 'pt' ? 'pt-PT' : 'en';
}

/**
 * ---------------------------------------------------------------------------
 * E A LÍNGUA DE CADA EDIÇÃO DE DOCUMENTO (I97, 29.08.2026)
 * ---------------------------------------------------------------------------
 *
 * `document.edition` diz de que edição do documento saiu o número: «dezembro de
 * 2025», «indicador 0014580», «tipsbd10», «2024». É o campo que obriga esta
 * tabela a ter uma terceira resposta, e é uma resposta que as outras duas não
 * precisavam de dar.
 *
 * **UMA EDIÇÃO PODE NÃO TER LÍNGUA NENHUMA.** Um ano («2024»), uma data
 * («12.08.2026») e um código de série do Eurostat («tipsbd10») não estão em
 * português nem em inglês: são cadeias de máquina. Marcá-las `pt-PT` na edição
 * inglesa era dizer a um leitor de ecrã que «tipsbd10» é português, que é tão
 * falso como o defeito que esta linha veio fechar. Marcá-las `en` era o mesmo
 * erro virado ao contrário.
 *
 * Por isso a tabela declara **três coisas e não duas**: `'pt'`, `'en'` e `null`,
 * e `null` ESCRITO não é o mesmo que ausente. A régua distingue os dois pela
 * presença da chave: uma edição declarada `null` não ganha marca e está
 * decidida; uma edição que falte à tabela fecha a construção. É a diferença
 * entre «não tem língua» e «ninguém olhou».
 *
 * SÃO 61 EDIÇÕES DISTINTAS, CONTADAS: 16 em português, 45 sem língua (7 anos, 3
 * datas, 3 nomes de ficheiro e 32 códigos de série do Eurostat), e nenhuma em
 * inglês. A coluna do inglês fica de pé na mesma, porque a regra é sobre a
 * espécie de cadeia e não sobre o que hoje calha existir.
 *
 * UMA EDIÇÃO MISTURADA MARCA-SE INTEIRA, NA LÍNGUA DA PROSA que ela traz.
 * «nama_10r_2gdp, atualizado 2026-02-10» é um código e uma palavra portuguesa, e
 * é a palavra que um leitor de ecrã lê mal: o campo leva `pt-PT`. É a mesma
 * regra dos campos transcritos, que se marcam inteiros na língua do campo.
 *
 * «indicador 0014580» É PORTUGUÊS, e não um código: «indicador» é a palavra que
 * o INE imprime, e a tabela declara o que a cadeia é, não o que ela parece.
 */

/** `pt`, `en`, ou `null` para uma edição que não está em língua nenhuma. */
export const LINGUA_DAS_EDICOES = {
  /* --- as edições escritas em português --------------------------------- */
  'dezembro de 2025': 'pt',
  'dezembro 2024': 'pt',
  'dezembro 2013': 'pt',
  'indicador 0014580': 'pt',
  'indicador 0014061': 'pt',
  'indicador 0012917': 'pt',
  'indicador 0012918': 'pt',
  'indicador 0014047': 'pt',
  'indicador 0014063': 'pt',
  'indicador 0013863': 'pt',
  'instantâneo 20260819-1728': 'pt',
  'Relatório final, Junho de 2026': 'pt',
  'consulta de 2026-08-12': 'pt',
  '2021 — dados provisórios (rótulo da DGAL)': 'pt',
  'captura de 2021-12-28 (Wayback Machine, 20211228193105)': 'pt',
  /* Um código do Eurostat e uma palavra portuguesa: marca-se pela prosa. */
  'nama_10r_2gdp, atualizado 2026-02-10': 'pt',
  /* As edições do primeiro domínio da primeira vaga (estudo 13 do motor).
     «indicador 0012656» é português pela mesma razão que os outros: «indicador»
     é a palavra que o INE imprime. As outras duas são prosa portuguesa inteira,
     e marcam-se inteiras. */
  'indicador 0012656': 'pt',
  'Parecer n.º 02/2026, abril de 2026': 'pt',
  'Diário da República, 1.ª série, n.º 249, de 29-12-2025': 'pt',

  /* --- os anos, que não estão em língua nenhuma -------------------------- */
  '2014': null,
  '2015': null,
  '2016': null,
  '2017': null,
  '2021': null,
  '2024': null,
  '2025': null,

  /* --- as datas ---------------------------------------------------------- */
  '12.08.2026': null,
  '15.08.2026': null,
  '24.08.2026': null,

  /* --- os nomes de ficheiro do publicador -------------------------------- */
  'TERRITORY-RESULTS-LOCAL-070500-CM.json': null,
  'territory-electionId=1-territoryId=1267-organId=4.json': null,
  'territory-results-LOCAL-070500-CM.json': null,

  /* --- os códigos de série do Eurostat ----------------------------------- */
  earn_gr_gpgr2: null,
  earn_mw_cur: null,
  edat_lfse_14: null,
  gov_10dd_edpt1: null,
  lfsi_emp_a: null,
  sdg_16_40: null,
  sdg_16_50: null,
  tepsr_sp210: null,
  tepsr_sp410: null,
  tesem060: null,
  tesem130: null,
  tespm110: null,
  tespm140: null,
  tessi180: null,
  tipsbd10: null,
  tipsbp10: null,
  tipsbp60: null,
  tipser10: null,
  tipsgo10: null,
  tipsho20: null,
  tipsho50: null,
  tipsii10: null,
  tipslc10: null,
  tipslm10: null,
  tipslm60: null,
  tipslm90: null,
  tipsna20: null,
  tipsna40: null,
  tipspc30: null,
  tipspc40: null,
  tipspd22: null,
  tipspd30: null,
  tipsst10: null,
  tipsun20: null,
  une_rt_a: null,
};

/**
 * A MARCA DE LÍNGUA DE UMA EDIÇÃO, NUMA PÁGINA DE UMA LÍNGUA.
 *
 * `pt-PT` ou `en` quando a edição está numa língua que não é a da página;
 * `null` quando é a da página, quando a edição não está em língua nenhuma, e
 * quando não há declaração. Os três `null` querem dizer coisas diferentes, e é
 * `scripts/check-lingua.mjs` que os separa: o terceiro fecha a construção.
 */
export function linguaDaEdicao(edicao, lang = 'pt') {
  const cru = edicao === null || edicao === undefined ? '' : String(edicao);
  if (!Object.prototype.hasOwnProperty.call(LINGUA_DAS_EDICOES, cru)) return null;
  const declarada = LINGUA_DAS_EDICOES[cru];
  if (declarada === null) return null;
  if (declarada === lang) return null;
  return declarada === 'pt' ? 'pt-PT' : 'en';
}
