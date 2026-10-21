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
  // V2-d: cadeias conferidas nos corpos portugueses e na API inglesa do Eurostat.
  "Sobre o Orçamento do Estado para 2027": "pt",
  "OE 2027: Um assalto às nossas vidas. É preciso romper com esta política e abrir um novo rumo para Portugal": "pt",
  "Síntese da execução orçamental, agosto de 2026": "pt",
  "Health care expenditure by financing scheme": "en",
  "Orçamento do Estado 2020 · Relatório": "pt",
  "Orçamento do Estado 2021 · Proposta de Lei e Relatório": "pt",
  "Orçamento do Estado 2022 · Relatório": "pt",
  "Orçamento do Estado 2023 · Relatório": "pt",
  "Orçamento do Estado 2024 · Relatório": "pt",
  "Orçamento do Estado 2025 · Relatório": "pt",
  "Orçamento do Estado 2026 · Relatório": "pt",
  "Orçamento do Estado 2027 · Relatório": "pt",
  "Conta Geral do Estado 2020 · Relatório de Análise Global e Conta da Segurança Social": "pt",
  "Conta Geral do Estado 2021 · Relatório de Análise Global e Conta da Segurança Social": "pt",
  "Conta Geral do Estado 2022 · Relatório de Análise Global e Conta da Segurança Social": "pt",
  "Conta Geral do Estado 2023 · Relatório de Análise Global e Conta da Segurança Social": "pt",
  "Conta Geral do Estado 2024 · Relatório de Análise Global e Conta da Segurança Social": "pt",
  "Conta Geral do Estado 2025 · Relatório de Análise Global e Conta da Segurança Social": "pt",
  "Relatório UTAO n.º 17/2026: Apreciação preliminar da Proposta de Orçamento do Estado para 2027": "pt",

  "Defence investment and NATO's 5% commitment": 'en',
  'Defence Investment of NATO Countries (2014-2026)': 'en',
  // V2-a: línguas lidas nos documentos alojados.
  "Leitão Amaro reitera que os portugueses \"têm mais dinheiro no bolso\" e apela à responsabilidade de PS e Chega": 'pt',
  "Governo, Chega e PS dançam o bailarico. Quem paga a conta são os trabalhadores!": 'pt',
  "OE2027. Verbas para a saúde com queda de 1,5%": 'pt',
  "Previsões macroeconómicas subjacentes à Proposta de Orçamento do Estado para 2027": 'pt',
  "Orçamento do Estado para 2027": 'pt',
  /* JD1: títulos lidos nos documentos recebidos nesta corrida. */
  'Boletim Mensal': 'pt',
  'Gestão da Tesouraria do Estado e da Dívida Pública · Relatório Anual 2025': 'pt',
  'Government revenue, expenditure and main aggregates': 'en',
  /* OE1: línguas conferidas nos documentos e nas células de origem. */
  "Execução Orçamental de julho 2026 - despesa por classificação funcional": "pt",
  "Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)": "pt",
  "General government expenditure by function (COFOG)": "en",
  "MAPA 1": "pt",
  "MAPA 1 - MAPA DAS DESPESAS POR MISSÃO DE BASE ORGÂNICA, DESAGREGADAS POR PROGRAMAS DOS SUBSETORES": "pt",
  "MAPA 4": "pt",
  "MAPA 5": "pt",
  "Mapa 8": "pt",
  "Mapa 9": "pt",
  "OE2026 - Despesa por classificação funcional (contabilidade pública)": "pt",
  "OE2026 - Indicadores da Administração Central em contabilidade pública": "pt",
  "Síntese da Execução Orçamental | agosto 2026": "pt",
  "Índice de preços no consumidor (Taxa de variação homóloga - Base 2025 - %) por Localização geográfica e Consumo individual por objetivo; Mensal - INE, Índice de preços no consumidor": 'pt',
  "Harmonised index of consumer prices (HICP) - ECOICOP ver.2 - indices and rates of change, monthly data": 'en',
  /* RP1: línguas lidas nas respostas e na metainformação. */
  "Índice de preços no consumidor (Taxa de variação homóloga - Base 2025 - %) por Localização geográfica (NUTS II - 2024) e Consumo individual por objetivo; Mensal - INE, Índice de preços no consumidor": 'pt',
  "Índice de preços no consumidor (Taxa de variação média dos últimos 12 meses - Base 2025 - %) por Localização geográfica (NUTS II - 2024) e Agregados especiais; Mensal - INE, Índice de preços no consumidor": 'pt',
  "Remuneração bruta mensal média por trabalhador (€) por Componente remuneratória e Natureza dos bens e serviços transacionados (CAE Rev. 4); Trimestral - Declaração Mensal de Remunerações da Segurança Social e Relação Contributiva da Caixa Geral de Aposentações": 'pt',
  "Valor médio das pensões da segurança social (Série 2017 - €/ N.º) por Local de residência (NUTS - 2024) e Tipo de pensão; Anual - Instituto de Informática": 'pt',
  "Beneficiárias/os do rendimento social de inserção, da segurança social por 1000 habitantes em idade ativa (‰) por Local de residência (NUTS - 2024); Anual - Instituto de Informática": 'pt',
  "At-risk-of-poverty thresholds": 'en',

  'Housing cost overburden rate by tenure status - EU-SILC survey': 'en',
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
  'RASARP 2025, volume 1': 'pt',
  'Anuário Financeiro dos Municípios Portugueses 2024 — apresentação das conclusões': 'pt',
  /* Os documentos do primeiro domínio da primeira vaga (estudo 13 do motor). */
  'Ganho médio mensal (€) por Localização geográfica (NUTS - 2024); Anual - MTSSS/GEP, Quadros de pessoal':
    'pt',
  'PARECER RELATIVO AO RELATÓRIO ANUAL DE PROGRESSO 2026': 'pt',
  'Decreto-Lei n.º 139/2025, de 29 de dezembro': 'pt',
  /* A 2.ª notificação de 2026 do Procedimento dos Défices Excessivos, o destaque
     do INE de onde saem três linhas (bloco R1, 23.09.2026). */
  'Procedimento dos Défices Excessivos 2ª Notificação': 'pt',
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
 *
 * @param {unknown} titulo
 * @param {string} [lang]
 */
export function linguaDoTituloDoDocumento(titulo, lang = 'pt') {
  const cru = titulo === null || titulo === undefined ? '' : String(titulo);
  const declarada = Object.prototype.hasOwnProperty.call(LINGUA_DOS_TITULOS, cru)
    ? /** @type {Record<string, string | null>} */ (LINGUA_DOS_TITULOS)[cru]
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
  // V2-d: cadeias conferidas nos corpos portugueses e na API inglesa do Eurostat.
  "015 - Saúde": "pt",
  "Serviço Nacional de Saúde": "pt",
  "Aquisição de bens e serviços": "pt",
  "Fundos Europeus": "pt",
  "Receitas de Impostos": "pt",
  "Receitas Próprias": "pt",
  "Investimento": "pt",
  "Outras despesas correntes": "pt",
  "Despesas com o pessoal": "pt",
  "Transferências de capital": "pt",
  "TRANSFERÊNCIAS SERVIÇO NACIONAL DE SAÚDE": "pt",
  "Ferroviário": "pt",
  "Despesa Total Consolidada": "pt",
  "Despesa total consolidada (1)": "pt",
  "Despesa efetiva (consolidação intra PO/PL)": "pt",
  "Health care expenditure by financing scheme": "en",

  '2014 Wales Summit': 'en',
  'The 5% Hague defence commitment': 'en',
  'Core defence requirements': 'en',
  'Table 1: Core defence expenditure': 'en',
  'Share of real GDP (%)': 'en',
  // V2-a: palavras das afirmações, não títulos dos artigos.
  "Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%": 'pt',
  "Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias": 'pt',
  "O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.": 'pt',
  "IHPC": 'pt',
  "PIB": 'pt',
  "encargos brutos": 'pt',
  "Rodoviário": 'pt',
  "receitas": 'pt',
  "Despesa efetiva consolidada": 'pt',
  "Despesa total consolidada": 'pt',
  'dcum x : cumulative reduction': 'en',
  'penalização legal': 'pt',
  'AA08b – Água não faturada': 'pt',
  /* JD1: conserva-se o rótulo impresso, incluindo o paralelo inglês do IGCP. */
  'Custo da dívida emitida': 'pt',
  'Custo do stock da dívida': 'pt',
  'Dívida total / Total debt': 'pt',
  'p.m. EMISSÕES DE DÍVIDA NO ANO CIVIL (Dívida Fundada)': 'pt',
  'Juros': 'pt',
  'Interest, expenditure': 'en',
  'Juros e outros encargos': 'pt',
  '3. NECESSIDADES BRUTAS DE FINANCIAMENTO (1. + 2.)': 'pt',
  '2. AMORTIZAÇÕES E ANULAÇÕES (Dívida Fundada)': 'pt',
  'Produto Interno Bruto, a preços de mercado': 'pt',
  /* OE1: línguas conferidas nos documentos e nas células de origem. */
  "ADMINISTRAÇÃO INTERNA": "pt",
  "AGRICULTURA E MAR": "pt",
  "AMBIENTE E ENERGIA": "pt",
  "ASSUNTOS ECONÓMICOS": "pt",
  "ATIVOS E PASSIVOS DA DESPESA": "pt",
  "ATIVOS E PASSIVOS DA RECEITA": "pt",
  "Agricultura e Mar": "pt",
  "Ambiente e Energia": "pt",
  "Ativos financeiros líquidos de reembolsos": "pt",
  "COESÃO TERRITORIAL": "pt",
  "CULTURA": "pt",
  "CULTURA, JUVENTUDE E DESPORTO": "pt",
  "Coesão Territorial": "pt",
  "Cultura": "pt",
  "DEFESA": "pt",
  "DEFESA NACIONAL": "pt",
  "DESPESA EFETIVA": "pt",
  "DESPESA ORÇAMENTAL": "pt",
  "DESPESA PRIMÁRIA": "pt",
  "DESPESA TOTAL": "pt",
  "DESPESA TOTAL CONSOLIDADA": "pt",
  "DESPORTO, RECREAÇÃO, CULTURA E RELIGIÃO": "pt",
  "DIFERENÇAS DE CONSOLIDAÇÃO": "pt",
  "Defence": "en",
  "Defesa": "pt",
  "Despesa efetiva": "pt",
  "Despesa total consolidada no âmbito do setor da Segurança Social": "pt",
  "Diferenças de consolidação (3)": "pt",
  "ECONOMIA": "pt",
  "ECONOMIA E COESAO TERRITORIAL": "pt",
  "EDUCAÇÃO": "pt",
  "EDUCAÇÃO, CIÊNCIA E INOVAÇÃO": "pt",
  "ENCARGOS GERAIS DO ESTADO": "pt",
  "ENSINO SUPERIOR, CIÊNCIA E INOVAÇÃO": "pt",
  "Economia": "pt",
  "Economic affairs": "en",
  "Education": "en",
  "Educação": "pt",
  "Ensino Superior, Ciência e Inovação": "pt",
  "Environmental protection": "en",
  "FINANÇAS": "pt",
  "Finanças": "pt",
  "Fluxos para outros Programas Orçamentais (2)": "pt",
  "GESTÃO DA DÍVIDA PÚBLICA": "pt",
  "GOVERNAÇÃO": "pt",
  "General public services": "en",
  "Gestão da Dívida Pública": "pt",
  "Governação": "pt",
  "HABITAÇÃO E INFRAESTRUTURAS COLETIVAS": "pt",
  "Health": "en",
  "Housing and community amenities": "en",
  "INFRAESTRUTURAS E HABITACÃO": "pt",
  "INFRAESTRUTURAS E HABITAÇÃO": "pt",
  "Infraestruturas e Habitação": "pt",
  "JUSTIÇA": "pt",
  "JUVENTUDE E DESPORTO": "pt",
  "Justiça": "pt",
  "Juventude e Desporto": "pt",
  "NEGÓCIOS ESTRANGEIROS": "pt",
  "PRESIDÊNCIA DO CONSELHO DE MINISTROS": "pt",
  "PROTEÇÃO DO AMBIENTE": "pt",
  "PROTEÇÃO SOCIAL": "pt",
  "Passivos financeiros líquidos de amortizações": "pt",
  "Public order and safety": "en",
  "RECEITA EFETIVA": "pt",
  "RECEITA ORÇAMENTAL": "pt",
  "RECEITA TOTAL": "pt",
  "RECEITA TOTAL CONSOLIDADA": "pt",
  "REFORMA DO ESTADO": "pt",
  "REPRESENTAÇÃO EXTERNA": "pt",
  "Receita efetiva": "pt",
  "Receita total consolidada no âmbito do setor da Segurança Social": "pt",
  "Recreation, culture and religion": "en",
  "Reforma do Estado": "pt",
  "Representação Externa": "pt",
  "SALDO GLOBAL": "pt",
  "SALDO GLOBAL DAS AP EM CP": "pt",
  "SALDO PRIMÁRIO": "pt",
  "SAÚDE": "pt",
  "SEGURANÇA E ORDEM PÚBLICA": "pt",
  "SEGURANÇA INTERNA": "pt",
  "SERVIÇOS GERAIS DAS ADMINISTRAÇÕES PÚBLICAS": "pt",
  "Saldo global": "pt",
  "Saúde": "pt",
  "Segurança Interna": "pt",
  "Social protection": "en",
  "Subtotal despesa efetiva consolidada dos Programas Orçamentais (1)": "pt",
  "TRABALHO, SOLIDARIEDADE E SEGURANÇA SOCIAL": "pt",
  "Total da Administração Central e Segurança Social consolidado": "pt",
  "Trabalho, Solidariedade e Segurança Social": "pt",
  "ÓRGÃOS DE SOBERANIA": "pt",
  "Órgãos de Soberania": "pt",
  "Índice de preços no consumidor (Taxa de variação homóloga - Base 2025 - %) por Localização geográfica e Consumo individual por objetivo; Mensal - INE, Índice de preços no consumidor": 'pt',
  "Harmonised index of consumer prices (HICP) - ECOICOP ver.2 - indices and rates of change, monthly data": 'en',

  /* RP1: línguas lidas nas respostas e na metainformação. */
  "Índice de preços no consumidor (Taxa de variação homóloga - Base 2025 - %) por Localização geográfica (NUTS II - 2024) e Consumo individual por objetivo; Mensal - INE, Índice de preços no consumidor": 'pt',
  "Índice de preços no consumidor (Taxa de variação média dos últimos 12 meses - Base 2025 - %) por Localização geográfica (NUTS II - 2024) e Agregados especiais; Mensal - INE, Índice de preços no consumidor": 'pt',
  "Remuneração bruta mensal média por trabalhador (€) por Componente remuneratória e Natureza dos bens e serviços transacionados (CAE Rev. 4); Trimestral - Declaração Mensal de Remunerações da Segurança Social e Relação Contributiva da Caixa Geral de Aposentações": 'pt',
  "Valor médio das pensões da segurança social (Série 2017 - €/ N.º) por Local de residência (NUTS - 2024) e Tipo de pensão; Anual - Instituto de Informática": 'pt',
  "Beneficiárias/os do rendimento social de inserção, da segurança social por 1000 habitantes em idade ativa (‰) por Local de residência (NUTS - 2024); Anual - Instituto de Informática": 'pt',
  "At-risk-of-poverty thresholds": 'en',

  'Housing cost overburden rate by tenure status - EU-SILC survey': 'en',
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
 *
 * @param {unknown} rotulo
 * @param {string} [lang]
 */
export function linguaDoRotuloDaFonte(rotulo, lang = 'pt') {
  const cru = rotulo === null || rotulo === undefined ? '' : String(rotulo);
  const declarada = Object.prototype.hasOwnProperty.call(LINGUA_DOS_ROTULOS, cru)
    ? /** @type {Record<string, string | null>} */ (LINGUA_DOS_ROTULOS)[cru]
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
  // V2-d: cadeias conferidas nos corpos portugueses e na API inglesa do Eurostat.
  "Paula Santos": "pt",
  "Paulo Raimundo": "pt",
  "UTAO": "pt",

  'NATO': 'en',
  // V2-a: línguas lidas nos documentos alojados.
  "RTP": 'pt',
  "PCP": 'pt',
  "Ministério das Finanças": 'pt',
  /* JD1: nomes dos organismos portugueses, conservados nas duas edições. */
  'IGCP': 'pt',
  'Instituto Nacional de Estatística': 'pt',
  /* OE1: línguas conferidas nos documentos e nas células de origem. */
  "Entidade Orçamental": "pt",
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
 *
 * @param {unknown} fonte
 * @param {string} [lang]
 */
export function linguaDaFonte(fonte, lang = 'pt') {
  const cru = fonte === null || fonte === undefined ? '' : String(fonte);
  const declarada = Object.prototype.hasOwnProperty.call(LINGUA_DAS_FONTES, cru)
    ? /** @type {Record<string, string | null>} */ (LINGUA_DAS_FONTES)[cru]
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
  // V2-d: cadeias conferidas nos corpos portugueses e na API inglesa do Eurostat.
  "2026-10-12": null,
  "2022": null,
  "2023": null,
  "2020": null,

  "2026-10-15": null, // Data da cópia alojada da página da NATO.
  // V2-a: línguas lidas nos documentos alojados.
  "2026-10-09": null,
  "2027": null,
  /* JD1: a prosa tem língua; o identificador do conjunto é um código. */
  'setembro de 2026': 'pt',
  'Setembro de 2026': 'pt',
  'gov_10a_main': null,
  'agosto 2026': 'pt',
  /* OE1: línguas conferidas nos documentos e nas células de origem. */
  "2026": null,
  'gov_10a_exp; geo=PT': null,
  'gov_10a_exp; geo=ES': null,
  'gov_10a_exp; geo=EU27_2020': null,
  '0014647, geocod=PT, dim_3=045': null,
  '0014647, geocod=PT, dim_3=0722': null,
  '0014647, geocod=PT, dim_3=041': null,
  'prc_hicp_minr, freq=M, unit=RCH_A, coicop18=TOTAL': null,
  /* RP1: códigos de série e coordenadas da API, sem língua natural. */
  '0013420, geocod=PT': null,
  '0014663, geocod=PT, dim_3=01': null,
  '0014666, geocod=PT, dim_3=001': null,
  '0014663, geocod=PT, dim_3=T': null,
  '0014666, geocod=PT, dim_3=T': null,
  'ilc_li01, freq=A, statinfo=MED_EI, hhcomp=A1, rskpovth=B_60, unit=EUR, geo=PT': null,
  '0014532, geocod=PT, dim_3=T': null,
  '0014751, geocod=PT, dim_3=T, dim_4=T': null,
  /* --- as edições escritas em português --------------------------------- */
  'dezembro de 2025': 'pt',
  /* A data impressa do destaque da 2.ª notificação de 2026 do Procedimento dos
     Défices Excessivos, que é a edição das suas três linhas (bloco R1). */
  '23 de setembro de 2026': 'pt',
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
  /* A edição das três contagens do próprio arquivo é a data em que o arquivo
     mudou, e por isso esta chave anda com ele: as de 15.08 e de 24.08 saíram
     quando «Évora 2027: o prometido, o que o painel escreveu, e o dinheiro em
     linhas» entrou e as três
     linhas passaram a 16.09.2026 (bloco E1). A tabela declara o que existe, e
     uma chave que nenhuma linha traz fecha a construção. As três passaram a
     01.10.2026, quando os seis estudos de Évora passaram a quatro (bloco E1
     dos estudos de Évora, e a passagem E1b para as duas contagens do arquivo),
     e a de 16.09.2026 saiu. */
  '12.08.2026': null,
  /* A recontagem de Correções publicadas usa a data da edição, sem língua.
     A edição passou de 02.10.2026 para 20.10.2026 na correção V2-d-b. */
  '20.10.2026': null,
  '01.10.2026': null,

  /* --- os nomes de ficheiro do publicador -------------------------------- */
  'TERRITORY-RESULTS-LOCAL-070500-CM.json': null,
  'territory-electionId=1-territoryId=1267-organId=4.json': null,
  'territory-results-LOCAL-070500-CM.json': null,

  /* --- os códigos de série do Eurostat ----------------------------------- */
  earn_gr_gpgr2: null,
  earn_mw_cur: null,
  edat_lfse_14: null,
  gov_10dd_edpt1: null,
  tessi164: null,
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
 *
 * @param {unknown} edicao
 * @param {string} [lang]
 */
export function linguaDaEdicao(edicao, lang = 'pt') {
  const cru = edicao === null || edicao === undefined ? '' : String(edicao);
  if (!Object.prototype.hasOwnProperty.call(LINGUA_DAS_EDICOES, cru)) return null;
  const declarada = /** @type {Record<string, string | null>} */ (LINGUA_DAS_EDICOES)[cru];
  if (declarada === null) return null;
  if (declarada === lang) return null;
  return declarada === 'pt' ? 'pt-PT' : 'en';
}

/** EX3: localizadores lidos nas folhas inglesas da NATO, declarados por inteiro. */
export const LINGUA_DOS_LOCALIZADORES = {
  // V2-d: cadeias conferidas nos corpos portugueses e na API inglesa do Eurostat.
  "freq=A; unit=EUR_HAB; icha11_hf=TOT_HF; geo=EU27_2020; time=2024; value[4]": "en",
  "freq=A; unit=EUR_HAB; icha11_hf=TOT_HF; geo=PT; time=2024; value[136]": "en",
  "freq=A; unit=PC_GDP; icha11_hf=HF1; geo=EU27_2020; time=2024; value[508]": "en",
  "freq=A; unit=PC_GDP; icha11_hf=HF1; geo=PT; time=2024; value[640]": "en",
  "freq=A; unit=PC_GDP; icha11_hf=TOT_HF; geo=EU27_2020; time=2024; value[340]": "en",
  "freq=A; unit=PC_GDP; icha11_hf=TOT_HF; geo=PT; time=2024; value[472]": "en",

  '2014 Wales Summit': 'en',
  'The 5% Hague defence commitment': 'en',
  'Core defence requirements': 'en',
  'Table 1!N27; Portugal (Euros); 2026e': 'en',
  'Table 3!L27; Portugal; 2024': 'en',
  'Table 3!M27; Portugal; 2025e': 'en',
  'Table 3!N27; Portugal; 2026e': 'en',
};

// HB1: cadeias lidas nos documentos e linhas de origem.
Object.assign(LINGUA_DOS_TITULOS, {
  "House price index, deflated - annual data": "en",
  "House price index - quarterly data": "en",
  "Standardised house price-to-income ratio - annual data": "en",
  "ESTATÍSTICAS DE PREÇOS DA HABITAÇÃO AO NÍVEL LOCAL": "pt",
  "Valor mediano das vendas por m² de alojamentos familiares": "pt",
  "ESTATÍSTICAS DE RENDAS DA HABITAÇÃO AO NÍVEL LOCAL": "pt",
  "Valor mediano das rendas por m2 de novos contratos de arrendamento de alojamentos familiares (€)": "pt",
  "Share of housing costs in disposable household income, by type of household and income group": "en",
  "Housing cost overburden rate by tenure status": "en",
  "Distribution of population by tenure status, type of household and income group": "en",
  "Housing cost overburden rate by tenure status - EU-SILC survey": "en",
  "Estimated average age of young persons leaving the parental household": "en",
  "Persons living with their parents or contributing/benefiting from the household income (population aged 18 to 34 years)": "en",
  "Proposta de Lei 103/XVII/1 Autoriza o Governo a alterar o Novo Regime do Arrendamento Urbano, aprovado pela Lei n.º 6/2006, de 27 de fevereiro, o Código Civil, o Código de Processo Civil, o Decreto-Lei n.º 157/2006, de 8 de agosto, que aprova o regime jurídico das obras em prédios arrendados, e legislação conexa": "pt",
  "Comunicado do Conselho de Ministros de 9 de julho de 2026": "pt",
  "Plataforma “Não dá mais” organiza protestos por todo o país devido à crise na habitação": "pt",
  "Montenegro afasta \"país em turbulência\". Dezenas de feridos em investida da polícia contra manifestantes no Porto": "pt",
  "Manifestantes pela habitação voltam à Praça D. João I e atiram a Pedro Duarte": "pt",
  "Confrontos nos protestos pela habitação no Porto. Manifestantes denunciam 37 feridos": "pt",
  "RELATÓRIO": "pt",
  "Harmonised index of consumer prices (HICP) - ECOICOP ver.2 - indices and rates of change, monthly data": "en",
  "Building permits by type of building - annual data": "en",
  "Population on 1 January by age and sex": "en",
  "Revista Eletrónica do INE - agosto de 2024": "pt",
  "Proporção de alojamentos familiares clássicos vagos (%) por Localização geográfica à data dos Censos [2021] (NUTS - 2024); Decenal - INE, Recenseamento da população e habitação - Censos 2021": "pt",
  "Proposta de Lei n.º 103/XVII": "pt",
  "IGAI abre processo sobre carga policial contra protesto pela habitação no Porto": "pt",
  "Defender a maioria que vive do seu salário contra os ataques da direita": "pt",
  "Construir Portugal - Arrendamento e simplificação": "pt",
  "ÍNDICE DE PREÇOS DA HABITAÇÃO": "pt",
  "Harmonised index of consumer prices (HICP) - ECOICOP ver.2 - indices and rates of change, annual data": "en",
  "Housing cost overburden rate": "en",
  "Housing cost overburden rate by age, sex and poverty status": "en",
  "Overcrowding rate by age, sex and poverty status - total population": "en",
  "Glossary:Severe housing deprivation rate": "en",
  "Severe housing deprivation rate by age, sex and poverty status": "en",
  "Conventional dwellings by occupancy status, type of building and NUTS 3 region": "en",
  "Alojamentos familiares clássicos (N.º) por Localização geográfica à data dos Censos [2021] (NUTS - 2024), Forma de ocupação e Época de construção; Decenal - INE, Recenseamento da população e habitação - Censos 2021": "pt",
  "Habitação: o que propusemos e o que vamos propor": "pt",
  "Montante de novas operações de empréstimos à habitação": "pt",
  "Taxa de juro (TAA) de novas operações de empréstimos à habitação": "pt",
  "Empréstimos-Particulares-PRT-Habitação-M€ (OIFM)": "pt",
  "TAXAS DE JURO IMPLÍCITAS NO CRÉDITO À HABITAÇÃO": "pt",
  "Decreto-Lei n.º 97/2026, de 20 de maio": "pt",
  "Rendas e despejos: o governo quer ainda mais selvajaria, o PCP quer defender a tua segurança e estabilidade": "pt",
  "Projeto de Resolução n.º 1272/XVII/2ª": "pt",
  "Projeto de Resolução 1272/XVII/2 Por uma política de arrendamento que sirva à classe média e às famílias mais vulneráveis": "pt",
  "Projeto de Lei": "pt",
  "Projeto de Lei 793/XVII/2 Isenta de mais valia o investimento em habitação em cooperativa de propriedade coletiva": "pt",
  "Altera o regime de tributação das mais-valias imobiliárias, em caso de reinvestimento": "pt",
  "Projeto de Lei 788/XVII/2 Altera o regime de tributação das mais-valias imobiliárias, em caso de reinvestimento": "pt",
  "Ventura acusa PS de hipocrisia na habitação: “Montenegro falhou brutalmente, mas os socialistas fizeram pior”": "pt",
  "Habitação Já": "pt",
  "\"Não consegues pagar renda? Traz tenda\". Polícia desmonta acampamento no Porto": "pt",
  "Milhares saem à rua em Lisboa contra o custo de vida: “Não dá mais para viver assim”": "pt",
  "MANIFESTAÇÃO NACIONAL DIA 17 DE OUTUBRO": "pt",
  "Manifestação - Já não dá mais para viver assim!": "pt",
  "Manifestantes pela habitação no Porto justificam protesto por \"desespero político\"": "pt",
  "Montenegro defende forças policiais e pede a manifestantes que não sejam egoístas": "pt",
  "Montenegro nega ter acusado manifestantes de egoísmo e revela que ameaçaram a sua casa (com vídeo)": "pt",
  "Ministro da Administração Interna diz que intervenção policial no Porto foi legítima": "pt",
  "Habitação: Governo avisa que \"não vai ceder aos gritos que vêm da rua\"": "pt",
  "Governo \"de parabéns\" ou em \"bolha\"? Habitação e Orçamento do Estado dominam debate quinzenal": "pt",
  "Portal Oficial - Instituto Nacional de Estatística": "pt",
  "Orçamento do Estado para 2027": "pt"
});

// HB1: cadeias lidas nos documentos e linhas de origem.
Object.assign(LINGUA_DOS_ROTULOS, {
  "Índice de preços da habitação, descontada a inflação, índice, média de 2015 igual a cem, Portugal, 2025": "pt",
  "House price index, deflated, Annual average index, 2015=100, Portugal, 2025": "en",
  "Índice de preços da habitação, descontada a inflação, índice, média de 2015 igual a cem, União Europeia, 2025": "pt",
  "House price index, deflated, Annual average index, 2015=100, European Union - 27 countries (from 2020), 2025": "en",
  "Índice de preços da habitação, variação homóloga, Portugal, 2.º trimestre de 2026": "pt",
  "House price index, Annual rate of change, Portugal, quarter 2 of 2026": "en",
  "Índice de preços da habitação, variação homóloga, União Europeia, 2.º trimestre de 2026": "pt",
  "House price index, Annual rate of change, European Union - 27 countries (from 2020), quarter 2 of 2026": "en",
  "Rácio padronizado entre preços da habitação e rendimento, índice, 2015 igual a cem, Portugal, 2024": "pt",
  "Standardised house price-to-income ratio, Price-to-income ratio, index 2015=100, Portugal, 2024": "en",
  "Rácio padronizado entre preços da habitação e rendimento, índice, 2015 igual a cem, União Europeia, 2024": "pt",
  "Standardised house price-to-income ratio, Price-to-income ratio, index 2015=100, European Union - 27 countries (from 2020), 2024": "en",
  "preço mediano dos 35 953 alojamentos familiares transacionados em Portugal": "pt",
  "preços da habitação": "pt",
  "Valor mediano das vendas por m² de alojamentos familiares; Porto": "pt",
  "renda mediana dos 35 407 novos contratos de arrendamento em Portugal": "pt",
  "renda mediana": "pt",
  "Valor mediano das rendas por m2 de novos contratos de arrendamento de alojamentos familiares (€); Porto": "pt",
  "Peso dos custos da habitação no rendimento disponível do agregado, Portugal, 2025": "pt",
  "Share of housing costs in disposable household income, Portugal, 2025": "en",
  "Peso dos custos da habitação no rendimento disponível do agregado, União Europeia, 2025": "pt",
  "Share of housing costs in disposable household income, European Union - 27 countries (from 2020), 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, total, Portugal, 2025": "pt",
  "Housing cost overburden rate, Total, Portugal, 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, total, União Europeia, 2025": "pt",
  "Housing cost overburden rate, Total, European Union - 27 countries (from 2020), 2025": "en",
  "Distribuição da população por regime de ocupação, proprietários com empréstimo, Portugal, 2025": "pt",
  "Distribution of population by tenure status, Owner, with mortgage or loan, Portugal, 2025": "en",
  "Distribuição da população por regime de ocupação, proprietários sem empréstimo, Portugal, 2025": "pt",
  "Distribution of population by tenure status, Owner, no outstanding mortgage or housing loan, Portugal, 2025": "en",
  "Housing cost overburden rate by tenure status - EU-SILC survey": "en",
  "Taxa de sobrecarga dos custos da habitação, inquilinos a preços de mercado, Portugal, 2020": "pt",
  "Housing cost overburden rate, Tenant, rent at market price, Portugal, 2020": "en",
  "Idade média estimada de saída de casa dos pais, Portugal, 2025": "pt",
  "Estimated average age of leaving the parental household, Portugal, 2025": "en",
  "Idade média estimada de saída de casa dos pais, União Europeia, 2025": "pt",
  "Estimated average age of leaving the parental household, European Union - 27 countries (from 2020), 2025": "en",
  "Pessoas que vivem com os pais ou contribuem para o rendimento do agregado ou dele beneficiam, vinte e cinco a trinta e quatro anos, Portugal, 2025": "pt",
  "Persons living with their parents or contributing/benefiting from the household income, From 25 to 34 years, Portugal, 2025": "en",
  "Pessoas que vivem com os pais ou contribuem para o rendimento do agregado ou dele beneficiam, vinte e cinco a trinta e quatro anos, União Europeia, 2025": "pt",
  "Persons living with their parents or contributing/benefiting from the household income, From 25 to 34 years, European Union - 27 countries (from 2020), 2025": "en",
  "Proposta de Lei 103/XVII/1 Autoriza o Governo a alterar o Novo Regime do Arrendamento Urbano, aprovado pela Lei n.º 6/2006, de 27 de fevereiro, o Código Civil, o Código de Processo Civil, o Decreto-Lei n.º 157/2006, de 8 de agosto, que aprova o regime jurídico das obras em prédios arrendados, e legislação conexa": "pt",
  "2. Aprovou um Decreto-Lei que cria o Fundo de Emergência para a Habitação (FEH) destinado a apoiar pessoas e famílias em situação de emergência habitacional, tais como despejos motivados por carência económica ou situações de violência doméstica. O FEH introduz um apoio financeiro direto, não reembolsável, para garantir um realojamento rápido, temporário ou permanente, permitindo que ninguém fique sem solução imediata em caso de perda de casa. O FEH visa assegurar que é o Estado, e não os proprietários, a assumir os custos sociais das situações de emergência habitacional.": "pt",
  "Plataforma “Não dá mais” organiza protestos por todo o país devido à crise na habitação": "pt",
  "37 feridos, dois em estado grave": "pt",
  "39 feridos, dois deles graves": "pt",
  "35 feridos, pelo menos": "pt",
  "P1 Habitação": "pt",
  "Habitação - redução IVA construção de 23% para 6% (i)": "pt",
  "Habitação - redução IRS rendas moderadas de 25% para 10% (i)": "pt",
  "Índice harmonizado de preços no consumidor, rendas efetivas da habitação, variação homóloga, Portugal, setembro de 2026": "pt",
  "Harmonised index of consumer prices, actual rentals for housing, Annual rate of change, Portugal, September 2026": "en",
  "Índice harmonizado de preços no consumidor, rendas efetivas da habitação, variação homóloga, União Europeia, setembro de 2026": "pt",
  "Harmonised index of consumer prices, actual rentals for housing, Annual rate of change, European Union - 27 countries (from 2020), September 2026": "en",
  "Taxa de sobrecarga dos custos da habitação, total, Portugal, 2015": "pt",
  "Housing cost overburden rate, Total, Portugal, 2015": "en",
  "Taxa de sobrecarga dos custos da habitação, inquilinos a preços de mercado, Portugal, 2025": "pt",
  "Housing cost overburden rate, Tenant, rent at market price, Portugal, 2025": "en",
  "Distribuição da população por regime de ocupação, inquilinos a preços de mercado, Portugal, 2025": "pt",
  "Distribution of population by tenure status, Tenant, rent at market price, Portugal, 2025": "en",
  "Idade média estimada de saída de casa dos pais, Portugal, 2015": "pt",
  "Estimated average age of leaving the parental household, Portugal, 2015": "en",
  "Alojamentos licenciados, milhares, Portugal, 2025": "pt",
  "Dwellings permitted, Thousand, Portugal, 2025": "en",
  "População residente a um de janeiro, número, Portugal, 2025": "pt",
  "Population on one January, Number, Portugal, 2025": "en",
  "Alojamentos licenciados, milhares, União Europeia, 2025": "pt",
  "Dwellings permitted, Thousand, European Union - 27 countries (from 2020), 2025": "en",
  "População residente a um de janeiro, número, União Europeia, 2025": "pt",
  "Population on one January, Number, European Union - 27 countries (from 2020), 2025": "en",
  "alojamentos vagos": "pt",
  "Proporção de alojamentos familiares clássicos vagos (%) por Localização geográfica à data dos Censos [2021] (NUTS - 2024); Decenal - INE, Recenseamento da população e habitação - Censos 2021": "pt",
  "Proposta de Lei n.º 103/XVII": "pt",
  "A reforma assenta em quatro eixos principais: maior liberdade contratual, reforço da segurança e do cumprimento dos contratos, simplificação e aceleração dos mecanismos de despejo e resolução de litígios, e reforço da responsabilidade social do Estado na proteção das situações de maior vulnerabilidade.": "pt",
  "a IGAI abriu um processo administrativo, com solicitação de informações à PSP": "pt",
  "um polícia ficou ferido": "pt",
  "5. A crise na habitação continua a agravar-se e os seus efeitos agudizam-se. Os despejos aumentaram 40% em 2025, e o Governo avança com medidas para os facilitar ainda mais.": "pt",
  "Redução da taxa de IVA para 6% na construção de habitações para venda até 648 mil euros ou, no caso de arrendamento, para rendas até 2.300 euros. Este regime fiscal vigora até 2029.": "pt",
  "Índice de preços da habitação, índice trimestral, 2015 igual a cem, Portugal, 2.º trimestre de 2026": "pt",
  "House price index, Quarterly index, 2015=100, Portugal, quarter 2 of 2026": "en",
  "Índice de preços da habitação, índice trimestral, 2015 igual a cem, União Europeia, 2.º trimestre de 2026": "pt",
  "House price index, Quarterly index, 2015=100, European Union - 27 countries (from 2020), quarter 2 of 2026": "en",
  "Índice de preços da habitação, índice trimestral, 2015 igual a cem, Finlândia, 2.º trimestre de 2026": "pt",
  "House price index, Quarterly index, 2015=100, Finland, quarter 2 of 2026": "en",
  "Índice de preços da habitação, índice trimestral, 2015 igual a cem, Hungria, 2.º trimestre de 2026": "pt",
  "House price index, Quarterly index, 2015=100, Hungary, quarter 2 of 2026": "en",
  "Índice de preços da habitação, variação homóloga, Finlândia, 2.º trimestre de 2026": "pt",
  "House price index, Annual rate of change, Finland, quarter 2 of 2026": "en",
  "taxa de variação homóloga do IPHab": "pt",
  "Índice de preços da habitação, descontada a inflação, índice, média de 2015 igual a cem, Finlândia, 2025": "pt",
  "House price index, deflated, Annual average index, 2015=100, Finland, 2025": "en",
  "Índice de preços da habitação, descontada a inflação, índice, média de 2015 igual a cem, Portugal, 2020": "pt",
  "House price index, deflated, Annual average index, 2015=100, Portugal, 2020": "en",
  "Índice de preços da habitação, descontada a inflação, variação da média anual, Portugal, 2025": "pt",
  "House price index, deflated, Annual average rate of change, Portugal, 2025": "en",
  "Índice de preços da habitação, descontada a inflação, variação da média anual, União Europeia, 2025": "pt",
  "House price index, deflated, Annual average rate of change, European Union - 27 countries (from 2020), 2025": "en",
  "Rácio padronizado entre preços da habitação e rendimento, índice, 2015 igual a cem, Roménia, 2024": "pt",
  "Standardised house price-to-income ratio, Price-to-income ratio, index 2015=100, Romania, 2024": "en",
  "Rácio padronizado entre preços da habitação e rendimento, índice, 2015 igual a cem, Portugal, 2019": "pt",
  "Standardised house price-to-income ratio, Price-to-income ratio, index 2015=100, Portugal, 2019": "en",
  "Rácio padronizado entre preços da habitação e rendimento, índice, média de longo prazo igual a cem, Portugal, 2024": "pt",
  "Standardised house price-to-income ratio, Price-to-income ratio relative to long-term average, Portugal, 2024": "en",
  "Rácio padronizado entre preços da habitação e rendimento, índice, média de longo prazo igual a cem, União Europeia, 2024": "pt",
  "Standardised house price-to-income ratio, Price-to-income ratio relative to long-term average, European Union - 27 countries (from 2020), 2024": "en",
  "Rácio padronizado entre preços da habitação e rendimento, índice, média de longo prazo igual a cem, Roménia, 2024": "pt",
  "Standardised house price-to-income ratio, Price-to-income ratio relative to long-term average, Romania, 2024": "en",
  "Índice harmonizado de preços no consumidor, rendas efetivas da habitação, variação da média anual, Portugal, 2025": "pt",
  "Harmonised index of consumer prices, actual rentals for housing, Annual average rate of change, Portugal, 2025": "en",
  "Índice harmonizado de preços no consumidor, rendas efetivas da habitação, variação da média anual, União Europeia, 2025": "pt",
  "Harmonised index of consumer prices, actual rentals for housing, Annual average rate of change, European Union - 27 countries (from 2020), 2025": "en",
  "Índice harmonizado de preços no consumidor, rendas efetivas da habitação, variação da média anual, Finlândia, 2025": "pt",
  "Harmonised index of consumer prices, actual rentals for housing, Annual average rate of change, Finland, 2025": "en",
  "Índice harmonizado de preços no consumidor, rendas efetivas da habitação, variação da média anual, Croácia, 2025": "pt",
  "Harmonised index of consumer prices, actual rentals for housing, Annual average rate of change, Croatia, 2025": "en",
  "Distribuição da população por regime de ocupação, proprietários com empréstimo, União Europeia, 2025": "pt",
  "Distribution of population by tenure status, Owner, with mortgage or loan, European Union - 27 countries (from 2020), 2025": "en",
  "Distribuição da população por regime de ocupação, proprietários sem empréstimo, União Europeia, 2025": "pt",
  "Distribution of population by tenure status, Owner, no outstanding mortgage or housing loan, European Union - 27 countries (from 2020), 2025": "en",
  "Distribuição da população por regime de ocupação, proprietários com empréstimo, Roménia, 2025": "pt",
  "Distribution of population by tenure status, Owner, with mortgage or loan, Romania, 2025": "en",
  "Distribuição da população por regime de ocupação, proprietários com empréstimo, Países Baixos, 2025": "pt",
  "Distribution of population by tenure status, Owner, with mortgage or loan, Netherlands, 2025": "en",
  "Distribuição da população por regime de ocupação, inquilinos com renda reduzida ou gratuita, Portugal, 2025": "pt",
  "Distribution of population by tenure status, Tenant, rent at reduced price or free, Portugal, 2025": "en",
  "Distribuição da população por regime de ocupação, inquilinos a preços de mercado, União Europeia, 2025": "pt",
  "Distribution of population by tenure status, Tenant, rent at market price, European Union - 27 countries (from 2020), 2025": "en",
  "Distribuição da população por regime de ocupação, inquilinos com renda reduzida ou gratuita, União Europeia, 2025": "pt",
  "Distribution of population by tenure status, Tenant, rent at reduced price or free, European Union - 27 countries (from 2020), 2025": "en",
  "Distribuição da população por regime de ocupação, inquilinos a preços de mercado, Alemanha, 2025": "pt",
  "Distribution of population by tenure status, Tenant, rent at market price, Germany, 2025": "en",
  "Distribuição da população por regime de ocupação, proprietários com empréstimo, Portugal, 2020": "pt",
  "Distribution of population by tenure status, Owner, with mortgage or loan, Portugal, 2020": "en",
  "Distribuição da população por regime de ocupação, inquilinos a preços de mercado, Portugal, 2020": "pt",
  "Distribution of population by tenure status, Tenant, rent at market price, Portugal, 2020": "en",
  "Taxa de sobrecarga dos custos da habitação, total, Chipre, 2025": "pt",
  "Housing cost overburden rate, Total, Cyprus, 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, total, Grécia, 2025": "pt",
  "Housing cost overburden rate, Total, Greece, 2025": "en",
  "Peso dos custos da habitação no rendimento disponível do agregado, Chipre, 2025": "pt",
  "Share of housing costs in disposable household income, Cyprus, 2025": "en",
  "Peso dos custos da habitação no rendimento disponível do agregado, Grécia, 2025": "pt",
  "Share of housing costs in disposable household income, Greece, 2025": "en",
  "Peso dos custos da habitação no rendimento disponível do agregado, Portugal, 2015": "pt",
  "Share of housing costs in disposable household income, Portugal, 2015": "en",
  "Taxa de sobrecarga dos custos da habitação, total, União Europeia, 2015": "pt",
  "Housing cost overburden rate, Total, European Union - 27 countries (from 2020), 2015": "en",
  "Taxa de sobrecarga dos custos da habitação, proprietários com empréstimo, Portugal, 2025": "pt",
  "Housing cost overburden rate, Owner, with mortgage or loan, Portugal, 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, proprietários com empréstimo, União Europeia, 2025": "pt",
  "Housing cost overburden rate, Owner, with mortgage or loan, European Union - 27 countries (from 2020), 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, proprietários sem empréstimo, Portugal, 2025": "pt",
  "Housing cost overburden rate, Owner, no outstanding mortgage or housing loan, Portugal, 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, proprietários sem empréstimo, União Europeia, 2025": "pt",
  "Housing cost overburden rate, Owner, no outstanding mortgage or housing loan, European Union - 27 countries (from 2020), 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, inquilinos com renda reduzida ou gratuita, Portugal, 2025": "pt",
  "Housing cost overburden rate, Tenant, rent at reduced price or free, Portugal, 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, inquilinos com renda reduzida ou gratuita, União Europeia, 2025": "pt",
  "Housing cost overburden rate, Tenant, rent at reduced price or free, European Union - 27 countries (from 2020), 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, inquilinos a preços de mercado, União Europeia, 2025": "pt",
  "Housing cost overburden rate, Tenant, rent at market price, European Union - 27 countries (from 2020), 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, inquilinos a preços de mercado, Portugal, 2015": "pt",
  "Housing cost overburden rate, Tenant, rent at market price, Portugal, 2015": "en",
  "Taxa de sobrecarga dos custos da habitação, inquilinos a preços de mercado, Finlândia, 2025": "pt",
  "Housing cost overburden rate, Tenant, rent at market price, Finland, 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, inquilinos a preços de mercado, Roménia, 2025": "pt",
  "Housing cost overburden rate, Tenant, rent at market price, Romania, 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, dezasseis a vinte e nove anos, Portugal, 2025": "pt",
  "Housing cost overburden rate, From 16 to 29 years, Portugal, 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, dezasseis a vinte e nove anos, União Europeia, 2025": "pt",
  "Housing cost overburden rate, From 16 to 29 years, European Union - 27 countries (from 2020), 2025": "en",
  "Taxa de sobrecarga dos custos da habitação, dezasseis a vinte e nove anos, Grécia, 2025": "pt",
  "Housing cost overburden rate, From 16 to 29 years, Greece, 2025": "en",
  "Taxa de sobrelotação da habitação, Portugal, 2025": "pt",
  "Overcrowding rate, Portugal, 2025": "en",
  "Taxa de sobrelotação da habitação, União Europeia, 2025": "pt",
  "Overcrowding rate, European Union - 27 countries (from 2020), 2025": "en",
  "Taxa de sobrelotação da habitação, Chipre, 2025": "pt",
  "Overcrowding rate, Cyprus, 2025": "en",
  "Taxa de sobrelotação da habitação, Roménia, 2025": "pt",
  "Overcrowding rate, Romania, 2025": "en",
  "Taxa de sobrelotação da habitação, dezasseis a vinte e nove anos, Portugal, 2025": "pt",
  "Overcrowding rate, From 16 to 29 years, Portugal, 2025": "en",
  "Taxa de sobrelotação da habitação, dezasseis a vinte e nove anos, União Europeia, 2025": "pt",
  "Overcrowding rate, From 16 to 29 years, European Union - 27 countries (from 2020), 2025": "en",
  "Glossary:Severe housing deprivation rate": "en",
  "Taxa de privação severa das condições da habitação, Portugal, 2023": "pt",
  "Severe housing deprivation rate, Portugal, 2023": "en",
  "Taxa de privação severa das condições da habitação, União Europeia, 2023": "pt",
  "Severe housing deprivation rate, European Union - 27 countries (from 2020), 2023": "en",
  "Taxa de privação severa das condições da habitação, Malta, 2023": "pt",
  "Severe housing deprivation rate, Malta, 2023": "en",
  "Taxa de privação severa das condições da habitação, Letónia, 2023": "pt",
  "Severe housing deprivation rate, Latvia, 2023": "en",
  "Taxa de privação severa das condições da habitação, dezasseis a vinte e nove anos, Portugal, 2023": "pt",
  "Severe housing deprivation rate, From 16 to 29 years, Portugal, 2023": "en",
  "Taxa de privação severa das condições da habitação, dezasseis a vinte e nove anos, União Europeia, 2023": "pt",
  "Severe housing deprivation rate, From 16 to 29 years, European Union - 27 countries (from 2020), 2023": "en",
  "Idade média estimada de saída de casa dos pais, Finlândia, 2025": "pt",
  "Estimated average age of leaving the parental household, Finland, 2025": "en",
  "Idade média estimada de saída de casa dos pais, Croácia, 2025": "pt",
  "Estimated average age of leaving the parental household, Croatia, 2025": "en",
  "Pessoas que vivem com os pais ou contribuem para o rendimento do agregado ou dele beneficiam, vinte e cinco a trinta e quatro anos, Dinamarca, 2025": "pt",
  "Persons living with their parents or contributing/benefiting from the household income, From 25 to 34 years, Denmark, 2025": "en",
  "Pessoas que vivem com os pais ou contribuem para o rendimento do agregado ou dele beneficiam, vinte e cinco a trinta e quatro anos, Croácia, 2025": "pt",
  "Persons living with their parents or contributing/benefiting from the household income, From 25 to 34 years, Croatia, 2025": "en",
  "Pessoas que vivem com os pais ou contribuem para o rendimento do agregado ou dele beneficiam, vinte e cinco a trinta e quatro anos, Portugal, 2020": "pt",
  "Persons living with their parents or contributing/benefiting from the household income, From 25 to 34 years, Portugal, 2020": "en",
  "Pessoas que vivem com os pais ou contribuem para o rendimento do agregado ou dele beneficiam, vinte e cinco a trinta e quatro anos, Portugal, 2015": "pt",
  "Persons living with their parents or contributing/benefiting from the household income, From 25 to 34 years, Portugal, 2015": "en",
  "Pessoas que vivem com os pais ou contribuem para o rendimento do agregado ou dele beneficiam, dezoito a trinta e quatro anos, Portugal, 2025": "pt",
  "Persons living with their parents or contributing/benefiting from the household income, From 18 to 34 years, Portugal, 2025": "en",
  "Pessoas que vivem com os pais ou contribuem para o rendimento do agregado ou dele beneficiam, dezoito a trinta e quatro anos, União Europeia, 2025": "pt",
  "Persons living with their parents or contributing/benefiting from the household income, From 18 to 34 years, European Union - 27 countries (from 2020), 2025": "en",
  "Alojamentos familiares clássicos, número, Portugal, 2021": "pt",
  "Conventional dwellings, Number, Portugal, 2021": "en",
  "Alojamentos familiares clássicos (N.º) por Localização geográfica à data dos Censos [2021] (NUTS - 2024), Forma de ocupação e Época de construção; Decenal - INE, Recenseamento da população e habitação - Censos 2021": "pt",
  "centenas de milhares de casas vazias em condições de serem habitadas. Para as trazer para o mercado, o PS vai propor um regime excecional, válido durante três anos:": "pt",
  "Montante de novas operações de empréstimos à habitação": "pt",
  "Taxa de juro (TAA) de novas operações de empréstimos à habitação": "pt",
  "Empréstimos-Particulares-PRT-Habitação-M€ (OIFM)": "pt",
  "taxa de juro implícita no conjunto dos contratos de crédito à habitação": "pt",
  "Ação 1.1 Promoção da oferta e reabilitação habitacional": "pt",
  "Ação 1.3 Promoção do acesso à habitação e apoio ao arrendamento": "pt",
  "Ação 1.2 Gestão urbanística e qualidade do edificiado": "pt",
  "RELATÓRIO": "pt",
  "Decreto-Lei n.º 97/2026, de 20 de maio": "pt",
  "Isenção de mais-valias na venda de casas já existentes, até 300 mil euros, para habitação própria, e tributação reduzida entre 300 e 500 mil euros.": "pt",
  "Um contrato de arrendamento de cinco anos, por opção das partes, com as rendas tributadas a uma taxa de 5% e com garantia pública para o senhorio em caso de falta de pagamento.": "pt",
  "Propomos critérios para a limitação dos valores de renda dos novos contratos, nomeadamente a possibilidade de aumento até 2% do valor de renda do novo contrato, ou caso tenha tido mais de um contrato nos últimos cinco anos, o aumento até 2% aplica-se ao valor de renda mais baixo nesse período.": "pt",
  "Em primeiro lugar, é urgente manter e estudar o alargamento do controlo de rendas para novos contratos. A incerteza na situação política internacional tem levado ao aumento generalizado do custo de vida, ao aumento das taxas de juro e dos custos de arrendamento. Face a este contexto, é necessário garantir previsibilidade para quem tem e procura casa para arrendar.": "pt",
  "Em segundo lugar, o PAN propõe o estabelecimento de tetos às cauções, que devem estar ajustados à realidade económica das famílias. Estes devem ter em conta os rendimentos familiares e respetiva taxa de esforço dos arrendatários, evitando abusos por parte dos senhorios e garantindo que a caução não exceda o que é comportável pelos respectivos orçamentos familiares.": "pt",
  "Por fim, urge travar, a curto prazo, o aumento do valor das rendas. Por isso, o PAN propõe a criação de um projeto piloto de aplicação de tetos às rendas. Este deve ser considerado para pessoas e famílias em situação económica desfavorável e a requerimento das mesmas. Esta medida deverá ser temporária e excecional, de forma a resolver os problemas com a subida do valor das rendas a curto prazo mas sem levar a efeitos perversos que se poderão revelar com a manutenção desta medida a longo prazo e de forma generalizada.": "pt",
  "Projeto de Resolução 1272/XVII/2 Por uma política de arrendamento que sirva à classe média e às famílias mais vulneráveis": "pt",
  "[NOVO] g) Sem prejuízo do disposto nas alíneas b) a e) do número anterior, são igualmente excluídos da tributação os ganhos provenientes da transmissão onerosa de imóveis destinados a habitação própria e permanente do sujeito passivo ou do seu agregado familiar, quando o valor de realização, deduzido da amortização de eventual empréstimo contraído para a aquisição do imóvel, seja reinvestido na aquisição do direito de habitação em fogo que pertença a cooperativa em regime de propriedade coletiva e que se destine à sua habitação própria e permanente.": "pt",
  "Projeto de Lei 793/XVII/2 Isenta de mais valia o investimento em habitação em cooperativa de propriedade coletiva": "pt",
  "O propósito da presente iniciativa é o de tornar essa norma de isenção temporária em norma definitiva, inserindo-a no próprio CIRS, pela importância de que se pode revestir.": "pt",
  "Projeto de Lei 788/XVII/2 Altera o regime de tributação das mais-valias imobiliárias, em caso de reinvestimento": "pt",
  "propõe ao Governo medidas para colocar mais casas no mercado, desbloquear imóveis parados em heranças e tornar o arrendamento mais simples, seguro e funcional, tanto para inquilinos como para proprietários.": "pt",
  "\"Não consegues pagar renda? Traz tenda\". Polícia desmonta acampamento no Porto": "pt",
  "Milhares saem à rua em Lisboa contra o custo de vida: “Não dá mais para viver assim”": "pt",
  "CONTRA O AUMENTO DO CUSTO DE VIDA! DIVULGA E PARTICIPA! LISBOA- 14H30 CAIS SODRÉ/ROSSIO": "pt",
  "Manifestação - Já não dá mais para viver assim!": "pt",
  "não como uma escolha de lazer, ou de campismo, mas como ato de desespero político": "pt",
  "oito pessoas foram assistidas no seu quartel": "pt",
  "Duas pessoas foram encaminhadas para o hospital.": "pt",
  "Espero que os partidos políticos, movimentos associativos, organizações portuguesas, não caiam na tentação, por razões meramente egoísticas da sua própria ação, importarem para Portugal climas de instabilidade, de contestação, que não tenham de facto respaldo na sociedade portuguesa.": "pt",
  "Eu dirigi-me a partidos políticos, a movimentos associativos e organizações no desenvolvimento da sua ação, dessas organizações.": "pt",
  "há lei e ordem que têm de ser cumpridas": "pt",
  "o Governo \"não vai ceder aos gritos que vêm da rua\".": "pt",
  "Os aumentos com os custos na habitação foram superiores a 100 por cento na esmagadora maioria das cidades": "pt",
  "vão proteger as pessoas": "pt",
  "Portal Oficial - Instituto Nacional de Estatística": "pt"
});

// HB1: cadeias lidas nos documentos e linhas de origem.
Object.assign(LINGUA_DAS_FONTES, {
  "Eurostat": "en",
  "INE": "pt",
  "Assembleia da República": "pt",
  "Conselho de Ministros": "pt",
  "Euronews": "pt",
  "Movimento pela Habitação": "pt",
  "organização": "pt",
  "José Soeiro, dirigente nacional do BE": "pt",
  "Governo": "pt",
  "Presidência do Conselho de Ministros": "pt",
  "IGAI": "pt",
  "PSP": "pt",
  "Bloco de Esquerda": "pt",
  "José Luís Carneiro": "pt",
  "Banco de Portugal": "pt",
  "PRESIDÊNCIA DO CONSELHO DE MINISTROS": "pt",
  "Paula Santos": "pt",
  "Inês de Sousa Real": "pt",
  "LIVRE": "pt",
  "Chega": "pt",
  "André Ventura": "pt",
  "Iniciativa Liberal": "pt",
  "RTP": "pt",
  "Postal": "pt",
  "hotelariasul": "pt",
  "Não dá mais para viver assim": "pt",
  "manifestantes": "pt",
  "Luís Silva, comandante dos Bombeiros Voluntários do Porto": "pt",
  "Luís Montenegro": "pt",
  "Luís Neves": "pt",
  "Carlos Abreu Amorim": "pt"
});

// HB1: cadeias lidas nos documentos e linhas de origem.
Object.assign(LINGUA_DAS_EDICOES, {
  "2025": null,
  "2026-Q2": null,
  "2024": null,
  "2026-Q1": null,
  "tessi164": null,
  "2020": null,
  "2026-09-30": null,
  "2026-07-10": null,
  "2026-10-10": null,
  "2026-10-15": null,
  "2027": null,
  "2026-09": null,
  "2015": null,
  "2021": null,
  "2026-08-12": null,
  "2026-10-16": null,
  "2026-03-28": null,
  "2025-09-25": null,
  "2019": null,
  "tespm140": null,
  "2021-04-13": null,
  "2023": null,
  "2026-10-19": null,
  "2026-08-31": null,
  "2026-08": null,
  "2026-05-20": null,
  "2026-03-13": null,
  "2026-09-19": null,
  "2026-09-25": null,
  "2026-06-08": null,
  "2026-10-12": null,
  "2026-09-15": null,
  "2026-10-14": null,
  "2026-10-09": null,
  "[a verificar]": null,
  "2026-10-27/2026-10-28": null
});

// HB1: cadeias lidas nos documentos e linhas de origem.
Object.assign(LINGUA_DOS_LOCALIZADORES, {
  "freq=A; unit=I15_A_AVG; geo=PT; time=2025; value[252]": "en",
  "freq=A; unit=I15_A_AVG; geo=EU27_2020; time=2025; value[10]": "en",
  "freq=Q; purchase=TOTAL; unit=RCH_A; geo=PT; time=2026-Q2; value[3495]": "en",
  "freq=Q; purchase=TOTAL; unit=RCH_A; geo=EU27_2020; time=2026-Q2; value[2529]": "en",
  "freq=A; unit=PTIR_I15; geo=PT; time=2024; value[509]": "en",
  "freq=A; unit=PTIR_I15; geo=EU27_2020; time=2024; value[289]": "en",
  "PDF p. 1; parágrafo identificado pelo início; área física declarada": "pt-PT",
  "Trimestral1_N2024.csv; linha 22; coluna 3": "pt-PT",
  "Trimestral1.csv; linha 18; coluna 3": "pt-PT",
  "freq=A; hhcomp=TOTAL; rskpovth=TOTAL; unit=PC; geo=PT; time=2025; value[252]": "en",
  "freq=A; hhcomp=TOTAL; rskpovth=TOTAL; unit=PC; geo=EU27_2020; time=2025; value[10]": "en",
  "freq=A; unit=PC; tenure=TOTAL; geo=PT; time=2025; value[252]": "en",
  "freq=A; unit=PC; tenure=TOTAL; geo=EU27_2020; time=2025; value[10]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=OWN_L; unit=PC; geo=PT; time=2025; value[252]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=OWN_NL; unit=PC; geo=PT; time=2025; value[560]": "en",
  "freq=A; unit=PC; tenure=RENT_MKT; geo=PT; time=2020; value[1171]": "en",
  "freq=A; unit=AVG; sex=T; geo=PT; time=2025; value[252]": "en",
  "freq=A; unit=AVG; sex=T; geo=EU27_2020; time=2025; value[10]": "en",
  "freq=A; age=Y25-34; sex=T; unit=PC; geo=PT; time=2025; value[560]": "en",
  "freq=A; age=Y25-34; sex=T; unit=PC; geo=EU27_2020; time=2025; value[318]": "en",
  "Histórico da iniciativa; votação na generalidade, reunião, resultado e votos por partido": "pt-PT",
  "HTML; início literal único": "pt-PT",
  "PDF p. 243; Quadro 5.24; Orçamento; página impressa 227": "pt-PT",
  "PDF p. 59; Quadro 3.2; impacto incremental em 2027; página impressa 43": "pt-PT",
  "freq=M; unit=RCH_A; coicop18=CP041; geo=PT; time=2026-09; value[7190]": "en",
  "freq=M; unit=RCH_A; coicop18=CP041; geo=EU27_2020; time=2026-09; value[4088]": "en",
  "freq=A; unit=PC; tenure=TOTAL; geo=PT; time=2015; value[242]": "en",
  "freq=A; unit=PC; tenure=RENT_MKT; geo=PT; time=2025; value[1176]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=RENT_MKT; unit=PC; geo=PT; time=2025; value[868]": "en",
  "freq=A; unit=AVG; sex=T; geo=PT; time=2015; value[242]": "en",
  "freq=A; indic_bt=BPRM_DW; cpa2_1=CPA_F41001_X_410014; s_adj=NSA; unit=THS; geo=PT; time=2025; value[868]": "en",
  "freq=A; unit=NR; age=TOTAL; sex=T; geo=PT; time=2025; value[1]": "en",
  "freq=A; indic_bt=BPRM_DW; cpa2_1=CPA_F41001_X_410014; s_adj=NSA; unit=THS; geo=EU27_2020; time=2025; value[626]": "en",
  "freq=A; unit=NR; age=TOTAL; sex=T; geo=EU27_2020; time=2025; value[0]": "en",
  "Dados.2021[0]": "pt-PT",
  "PDF p. 1; Exposição de Motivos; estimativa pelos Censos de 2021; autoria na folha de rosto; data da proposta na página do Parlamento": "pt-PT",
  "PDF p. 2; parágrafo identificado pelo início; área física declarada": "pt-PT",
  "freq=Q; purchase=TOTAL; unit=I15_Q; geo=PT; time=2026-Q2; value[1011]": "en",
  "freq=Q; purchase=TOTAL; unit=I15_Q; geo=EU27_2020; time=2026-Q2; value[45]": "en",
  "freq=Q; purchase=TOTAL; unit=I15_Q; geo=FI; time=2026-Q2; value[1195]": "en",
  "freq=Q; purchase=TOTAL; unit=I15_Q; geo=HU; time=2026-Q2; value[781]": "en",
  "freq=Q; purchase=TOTAL; unit=RCH_A; geo=FI; time=2026-Q2; value[3679]": "en",
  "freq=A; unit=I15_A_AVG; geo=FI; time=2025; value[296]": "en",
  "freq=A; unit=I15_A_AVG; geo=PT; time=2020; value[247]": "en",
  "freq=A; unit=RCH_A_AVG; geo=PT; time=2025; value[560]": "en",
  "freq=A; unit=RCH_A_AVG; geo=EU27_2020; time=2025; value[318]": "en",
  "freq=A; unit=PTIR_I15; geo=RO; time=2024; value[519]": "en",
  "freq=A; unit=PTIR_I15; geo=PT; time=2019; value[504]": "en",
  "freq=A; unit=PTIR_LT_AVG; geo=PT; time=2024; value[789]": "en",
  "freq=A; unit=PTIR_LT_AVG; geo=EU27_2020; time=2024; value[569]": "en",
  "freq=A; unit=PTIR_LT_AVG; geo=RO; time=2024; value[799]": "en",
  "freq=A; unit=RCH_A_AVG; coicop18=CP041; geo=PT; time=2025; value[560]": "en",
  "freq=A; unit=RCH_A_AVG; coicop18=CP041; geo=EU27_2020; time=2025; value[318]": "en",
  "freq=A; unit=RCH_A_AVG; coicop18=CP041; geo=FI; time=2025; value[604]": "en",
  "freq=A; unit=RCH_A_AVG; coicop18=CP041; geo=HR; time=2025; value[439]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=OWN_L; unit=PC; geo=EU27_2020; time=2025; value[10]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=OWN_NL; unit=PC; geo=EU27_2020; time=2025; value[318]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=OWN_L; unit=PC; geo=RO; time=2025; value[263]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=OWN_L; unit=PC; geo=NL; time=2025; value[219]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=RENT_FR; unit=PC; geo=PT; time=2025; value[1176]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=RENT_MKT; unit=PC; geo=EU27_2020; time=2025; value[626]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=RENT_FR; unit=PC; geo=EU27_2020; time=2025; value[934]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=RENT_MKT; unit=PC; geo=DE; time=2025; value[681]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=OWN_L; unit=PC; geo=PT; time=2020; value[247]": "en",
  "freq=A; rskpovth=TOTAL; hhcomp=TOTAL; tenure=RENT_MKT; unit=PC; geo=PT; time=2020; value[863]": "en",
  "freq=A; unit=PC; tenure=TOTAL; geo=CY; time=2025; value[153]": "en",
  "freq=A; unit=PC; tenure=TOTAL; geo=EL; time=2025; value[98]": "en",
  "freq=A; hhcomp=TOTAL; rskpovth=TOTAL; unit=PC; geo=CY; time=2025; value[153]": "en",
  "freq=A; hhcomp=TOTAL; rskpovth=TOTAL; unit=PC; geo=EL; time=2025; value[98]": "en",
  "freq=A; hhcomp=TOTAL; rskpovth=TOTAL; unit=PC; geo=PT; time=2015; value[242]": "en",
  "freq=A; unit=PC; tenure=TOTAL; geo=EU27_2020; time=2015; value[0]": "en",
  "freq=A; unit=PC; tenure=OWN_L; geo=PT; time=2025; value[560]": "en",
  "freq=A; unit=PC; tenure=OWN_L; geo=EU27_2020; time=2025; value[318]": "en",
  "freq=A; unit=PC; tenure=OWN_NL; geo=PT; time=2025; value[868]": "en",
  "freq=A; unit=PC; tenure=OWN_NL; geo=EU27_2020; time=2025; value[626]": "en",
  "freq=A; unit=PC; tenure=RENT_FR; geo=PT; time=2025; value[1484]": "en",
  "freq=A; unit=PC; tenure=RENT_FR; geo=EU27_2020; time=2025; value[1242]": "en",
  "freq=A; unit=PC; tenure=RENT_MKT; geo=EU27_2020; time=2025; value[934]": "en",
  "freq=A; unit=PC; tenure=RENT_MKT; geo=PT; time=2015; value[1166]": "en",
  "freq=A; unit=PC; tenure=RENT_MKT; geo=FI; time=2025; value[1220]": "en",
  "freq=A; unit=PC; tenure=RENT_MKT; geo=RO; time=2025; value[1187]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=PT; time=2025; value[252]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=EU27_2020; time=2025; value[10]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=EL; time=2025; value[98]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; age=TOTAL; sex=T; geo=PT; time=2025; value[252]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; age=TOTAL; sex=T; geo=EU27_2020; time=2025; value[10]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; age=TOTAL; sex=T; geo=CY; time=2025; value[153]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; age=TOTAL; sex=T; geo=RO; time=2025; value[263]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=PT; time=2025; value[560]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=EU27_2020; time=2025; value[318]": "en",
  "Glossário, dois parágrafos da definição": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; sex=T; age=TOTAL; geo=PT; time=2023; value[160]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; sex=T; age=TOTAL; geo=EU27_2020; time=2023; value[6]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; sex=T; age=TOTAL; geo=MT; time=2023; value[132]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; sex=T; age=TOTAL; geo=LV; time=2023; value[104]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; sex=T; age=Y16-29; geo=PT; time=2023; value[356]": "en",
  "freq=A; unit=PC; rskpovth=TOTAL; sex=T; age=Y16-29; geo=EU27_2020; time=2023; value[202]": "en",
  "freq=A; unit=AVG; sex=T; geo=FI; time=2025; value[296]": "en",
  "freq=A; unit=AVG; sex=T; geo=HR; time=2025; value[131]": "en",
  "freq=A; age=Y25-34; sex=T; unit=PC; geo=DK; time=2025; value[362]": "en",
  "freq=A; age=Y25-34; sex=T; unit=PC; geo=HR; time=2025; value[439]": "en",
  "freq=A; age=Y25-34; sex=T; unit=PC; geo=PT; time=2020; value[555]": "en",
  "freq=A; age=Y25-34; sex=T; unit=PC; geo=PT; time=2015; value[550]": "en",
  "freq=A; age=Y18-34; sex=T; unit=PC; geo=PT; time=2025; value[252]": "en",
  "freq=A; age=Y18-34; sex=T; unit=PC; geo=EU27_2020; time=2025; value[10]": "en",
  "freq=A; housing=DW; building=TOTAL; unit=NR; geo=PT; time=2021; value[22]": "en",
  "Dados.2021[40]": "pt-PT",
  "Dados.2021[41]": "pt-PT",
  "17=2705; 18=35; 19=7; 40=4264; 43=4427; 48=3777; 54=3019; 56=3118; 66=2799; 70=3331; reference_date=2026-08-31; 29=3609; 59=308; 63=349; value[283]": "pt-PT",
  "17=2705; 18=35; 40=4264; 43=4427; 48=3777; 54=3019; 56=3118; 66=2799; 70=3327; reference_date=2026-08-31; 29=3648; 59=308; 63=349; value[283]": "pt-PT",
  "8=4130; 17=2705; 18=35; 19=12; 40=4264; 46=4427; 48=3777; 54=3125; 56=3118; 66=2779; 70=3331; reference_date=2026-08-31; 29=3635; 59=349; 63=349; value[560]": "pt-PT",
  "PDF p. 243; Quadro 5.24, Ação 1.2, Orçamento; página impressa 227": "pt-PT",
  "PDF p. 23; Eixo VII, Construir Portugal; página impressa 7": "pt-PT",
  "PDF p. 59; Quadro 3.2; nota da legenda; página impressa 43": "pt-PT",
  "PDF p. 12; Artigo 45.º-C do EBF": "pt-PT",
  "PDF p. 15; Artigo 15.º, n.º 1, norma transitória": "pt-PT",
  "PDF p. 8; Artigo 78.º-E, n.º 10; aplicação temporal pelo artigo 15.º, n.º 1": "pt-PT",
  "Corpo da página; frase integral identificada pelo excerto; data editorial no documento": "pt-PT",
  "PDF p. 3; parágrafo identificado pelo início; área física declarada": "pt-PT",
  "PDF p. 4; parágrafo identificado pelo início; área física declarada": "pt-PT",
  "HTML; expressão literal na notícia que cita a Lusa": "pt-PT",
  "HTML; cobertura do debate quinzenal; início literal único": "pt-PT",
  "Página parlamentar, calendário da proposta": "pt-PT"
});
