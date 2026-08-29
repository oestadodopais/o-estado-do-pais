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
  /* Os dois documentos do próprio sítio. O nome deles é português nas duas
     edições, e é o nome com que eles se publicam: a edição inglesa cita-os pelo
     nome que eles têm, e diz em que língua está. */
  'Arquivo de estudos': 'pt',
  'Registo de correções': 'pt',

  /* --- os documentos ingleses ------------------------------------------- */
  'Gross domestic product (GDP) at current market prices by NUTS 2 region': 'en',
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

  /* --- o rótulo inglês --------------------------------------------------- */
  'Gross domestic product (GDP) at current market prices by NUTS 2 region': 'en',
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
