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
  // V2-e: cadeias lidas nos documentos e nas respostas das fontes.
  "Relatório Semanal de Monitorização | 14-10-2026": "pt",
  "Anexo III - Listagem de Marcos e Metas": "pt",
  "ANEXOS ESTATÍSTICOS Agosto de 2026": "pt",
  "Health personnel": "en",
  "Monitorização da despesa com medicamentos | Ambulatório | Julho de 2026": "pt",
  "Monitorização da despesa com medicamentos | Hospitalar | Julho de 2026": "pt",
  "Orçamento do Estado 2027 RELATÓRIO": "pt",
  "Concessões Rodoviárias": "pt",
  "Resolução do Conselho de Ministros n.º 198-B/2008": "pt",
  "Despacho n.º 15154/2024": "pt",
  "Declaração de Retificação n.º 2/2023": "pt",
  "Decreto-Lei n.º 87-A/2022": "pt",
  "Lei n.º 37/2024, de 7 de agosto": "pt",
  "AUDITORIA AO MODELO DE GESTÃO, FINANCIAMENTO E REGULAÇÃO DO SETOR RODOVIÁRIO": "pt",
  "Intervenções Cirúrgicas nos Cuidados de Saúde Hospitalares": "pt",
  "Consultas Médicas nos Cuidados de Saúde Primários": "pt",
  "Consultas Médicas Hospitalares": "pt",
  "Dívida Total, Vencida e Pagamentos em Atraso": "pt",
  "Utentes a Aguardar Vaga de Cuidados Continuados": "pt",
  "Inscritos em LIC dentro do TMRG (180 dias)": "pt",
  "Utentes Inscritos em Cuidados de Saúde Primários": "pt",
  "Inscritos em Cuidados de Saúde Primários": "pt",
  "Atendimentos por Tipo de Urgência Hospitalar": "pt",

  // EO1: nomes conferidos nos documentos alojados.
  "European Economic Forecast Spring 2026": "en",
  "Decreto-Lei n.º 97/2026, de 20 de maio": "pt",
  "Lei n.º 64/2025, de 7 de novembro": "pt",
  "Artigo 68.º Taxas gerais": "pt",
  "Proposta de Lei n.º 110/XVII/2.ª Orçamento do Estado para 2027": "pt",
  "OE2027: BE diz que Orçamento “dá migalhas a quem trabalha” e beneficia os mais ricos": "pt",
  "\"Temos um bom Orçamento para 2027\", garante o CDS-PP": "pt",
  "Ventura acusa PS de hipocrisia na habitação: “Montenegro falhou brutalmente, mas os socialistas fizeram pior”": "pt",
  "Orçamento do Estado reforça valorização dos rendimentos e apoios às famílias e empresas": "pt",
  "Miranda Sarmento: dívida pública abaixo dos 85% do PIB em 2027 é a \"principal preocupação\" do Governo": "pt",
  "JPP pede maior protecção das famílias não abrangidas pela descida de IRS": "pt",
  "Primeiro-ministro rejeita totalmente descer o IVA dos atuais 23% para 21%": "pt",
  "OE2027: PS leva propostas à especialidade para responder ao custo de vida": "pt",
  "Habitação: o que propusemos e o que vamos propor": "pt",
  "\"Baile\" na AR com OE em destaque: A \"dança\" de Montenegro e oposição": "pt",
  "Real Decreto 126/2026, de 18 de febrero, por el que se fija el salario mínimo interprofesional para 2026.": "es",
  "Relatório UTAO n.º 17/2026 Apreciação preliminar da Proposta de Orçamento do Estado para 2027": "pt",
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
  return declarada === 'pt' ? 'pt-PT' : declarada;
}

/**
 * ---------------------------------------------------------------------------
 * E A LÍNGUA DE CADA RÓTULO DA FONTE (29.08.2026)
 * ---------------------------------------------------------------------------
 *
 * Nas linhas tradicionais, `name` copia o rótulo do publicador. Nas linhas EO1,
 * `name` identifica a medida em português e `name_en` declara o nome paralelo
 * inglês, conservando o rótulo original em `source_label` no motor e na prova.
 * Cada cadeia tem língua explícita: a edição da página não determina a língua
 * do campo, nem permite adivinhar a língua pelo aspeto do nome.
 *
 * Fica NESTE ficheiro e não num ao lado, porque é a mesma pergunta sobre a
 * mesma espécie de cadeia. Duas tabelas em dois ficheiros seriam duas coisas
 * para lembrar no dia em que a regra mudar, e a segunda ficava para trás.
 *
 * A língua declara-se cadeia a cadeia, sem inferência por palavras ou acentos.
 * «Total» é a palavra que o IEFP imprime na folha portuguesa dele; a grafia
 * partilhada com outra língua não altera a declaração da fonte.
 * `scripts/check-lingua.mjs` fecha a construção quando o livro-razão traz um
 * rótulo que não está aqui, e quando esta tabela nomeia um que já não existe.
 */

/** Língua explícita de cada cadeia de name e name_en. No EO1, são nomes paralelos
 * da medida; source_label conserva o rótulo original no motor e na prova exportada. */
// EO1-b: lista explícita das línguas dos nomes PT e das traduções EN, conferida com as linhas.
export const LINGUA_DOS_ROTULOS = {
  // EO1-e: nomes conferidos na página citada do decreto e do relatório.
  "salário mínimo (RMMG)": "pt",
  "minimum wage (RMMG)": "en",
  "retribuição mínima mensal garantida": "pt",
  "guaranteed minimum monthly wage": "en",
  // EO1-d: nomes conferidos das medidas invariantes e da UTAO.
  "Medidas invariantes: impacto no saldo": "pt",
  "Invariant measures: balance impact": "en",
  "Medidas invariantes: receita": "pt",
  "Invariant measures: revenue": "en",
  "Medidas invariantes: despesa": "pt",
  "Invariant measures: expenditure": "en",
  "UTAO: variação das despesas com pessoal em contabilidade nacional, 2027": "pt",
  "UTAO: change in staff costs in national accounts, 2027": "en",
  "UTAO: dívida pública em euros, fim de 2026": "pt",
  "UTAO: public debt in euros, end of 2026": "en",
  "UTAO: dívida pública em euros, fim de 2027": "pt",
  "UTAO: public debt in euros, end of 2027": "en",
  "UTAO: acréscimo anual da dívida pública, 2026": "pt",
  "UTAO: annual increase in public debt, 2026": "en",
  "UTAO: acréscimo anual da dívida pública, 2027": "pt",
  "UTAO: annual increase in public debt, 2027": "en",
  // V2-e: cadeias lidas nos documentos e nas respostas das fontes.
  "Regularização de dívidas vencidas a fornecedores por parte de entidades do Serviço Nacional de Saúde, com contrapartida em reforços dos respetivos capitais pelo Estado (a)": "pt",
  "Health personnel": "en",

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
  "2014 Wales Summit": "en",
  "The 5% Hague defence commitment": "en",
  "Core defence requirements": "en",
  "Table 1: Core defence expenditure": "en",
  "Share of real GDP (%)": "en",
  "Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%": "pt",
  "Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias": "pt",
  "O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.": "pt",
  "IHPC": "pt",
  "PIB": "pt",
  "encargos brutos": "pt",
  "Rodoviário": "pt",
  "receitas": "pt",
  "Despesa efetiva consolidada": "pt",
  "Despesa total consolidada": "pt",
  "dcum x : cumulative reduction": "en",
  "penalização legal": "pt",
  "AA08b – Água não faturada": "pt",
  "Custo da dívida emitida": "pt",
  "Custo do stock da dívida": "pt",
  "Dívida total / Total debt": "pt",
  "p.m. EMISSÕES DE DÍVIDA NO ANO CIVIL (Dívida Fundada)": "pt",
  "Juros": "pt",
  "Interest, expenditure": "en",
  "Juros e outros encargos": "pt",
  "3. NECESSIDADES BRUTAS DE FINANCIAMENTO (1. + 2.)": "pt",
  "2. AMORTIZAÇÕES E ANULAÇÕES (Dívida Fundada)": "pt",
  "Produto Interno Bruto, a preços de mercado": "pt",
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
  "Índice de preços no consumidor (Taxa de variação homóloga - Base 2025 - %) por Localização geográfica e Consumo individual por objetivo; Mensal - INE, Índice de preços no consumidor": "pt",
  "Harmonised index of consumer prices (HICP) - ECOICOP ver.2 - indices and rates of change, monthly data": "en",
  "Índice de preços no consumidor (Taxa de variação homóloga - Base 2025 - %) por Localização geográfica (NUTS II - 2024) e Consumo individual por objetivo; Mensal - INE, Índice de preços no consumidor": "pt",
  "Índice de preços no consumidor (Taxa de variação média dos últimos 12 meses - Base 2025 - %) por Localização geográfica (NUTS II - 2024) e Agregados especiais; Mensal - INE, Índice de preços no consumidor": "pt",
  "Remuneração bruta mensal média por trabalhador (€) por Componente remuneratória e Natureza dos bens e serviços transacionados (CAE Rev. 4); Trimestral - Declaração Mensal de Remunerações da Segurança Social e Relação Contributiva da Caixa Geral de Aposentações": "pt",
  "Valor médio das pensões da segurança social (Série 2017 - €/ N.º) por Local de residência (NUTS - 2024) e Tipo de pensão; Anual - Instituto de Informática": "pt",
  "Beneficiárias/os do rendimento social de inserção, da segurança social por 1000 habitantes em idade ativa (‰) por Local de residência (NUTS - 2024); Anual - Instituto de Informática": "pt",
  "At-risk-of-poverty thresholds": "en",
  "Housing cost overburden rate by tenure status - EU-SILC survey": "en",
  "PMP (N.º dias)": "pt",
  "Total": "pt",
  "TOTAL": "pt",
  "DESEMPREGO REGISTADO": "pt",
  "Poder de compra per capita por Localização geográfica (NUTS - 2024); Bienal - INE, Estudo sobre o poder de compra concelhio": "pt",
  "Empresas (N.º) por Localização geográfica (NUTS - 2024) e Dimensão; Anual - INE, Sistema de contas integradas das empresas": "pt",
  "Empresas (N.º) por Localização geográfica (NUTS - 2024), Atividade económica (Divisão - CAE Rev. 3) e Forma jurídica; Anual - INE, Sistema de contas integradas das empresas": "pt",
  "População residente (N.º) por Local de residência (NUTS - 2024), Sexo e Grupo etário (Por ciclos de vida); Anual - INE, Estimativas anuais da população residente": "pt",
  "População residente (N.º) por Local de residência (NUTS - 2024), Sexo e Grupo etário; Anual - INE, Estimativas anuais da população residente": "pt",
  "Indicador de concentração do valor acrescentado bruto das quatro maiores empresas (%) por Localização geográfica (NUTS - 2024); Anual - INE, Sistema de contas integradas das empresas": "pt",
  "Valor acrescentado bruto (€) das Empresas por Localização geográfica (NUTS - 2024) e Atividade económica (Divisão - CAE Rev. 3); Anual - INE, Sistema de contas integradas das empresas": "pt",
  "DÍVIDA TOTAL DE OPERAÇÕES ORÇAMENTAIS = (1) + (2)": "pt",
  "LIMITE = Média dos Últimos 3 Exercícios * 1,5": "pt",
  "Dívida Total no Início do Mandato": "pt",
  "Ganho médio mensal (€) por Localização geográfica (NUTS - 2024); Anual - MTSSS/GEP, Quadros de pessoal": "pt",
  "Gross domestic product (GDP) at current market prices by NUTS 2 region": "en",
  "Government deficit/surplus, debt and associated data": "en",
  "Gender pay gap in unadjusted form by NACE Rev. 2 activity - structure of earnings survey methodology": "en",
  "Monthly minimum wages - bi-annual data": "en",
  "Dívida pública bruta": "pt",
  "General government gross debt": "en",
  "Trajetória da dívida no texto da Comissão Europeia": "pt",
  "Debt trajectory in the European Commission text": "en",
  "Crescimento real do PIB": "pt",
  "Real GDP growth": "en",
  "Saldo das administrações públicas": "pt",
  "General government balance": "en",
  "Medidas: comparabilidade das previsões": "pt",
  "Measures: comparability of forecasts": "en",
  "Riscos: emprego, salários e receita": "pt",
  "Risks: employment, wages and revenue": "en",
  "Medidas: impacto macroeconómico": "pt",
  "Measures: macroeconomic impact": "en",
  "Pensões e IRS: as medidas de 2026 (o suplemento extraordinário e a descida das taxas), pelo CFP": "pt",
  "Pensions and income tax: the 2026 measures (the extraordinary supplement and the rate reduction), according to the CFP": "en",
  "IRS: reembolsos e rendimento disponível": "pt",
  "Personal income tax: refunds and disposable income": "en",
  "Riscos: PIB e inflação": "pt",
  "Risks: GDP and inflation": "en",
  "CSI: referência mensal de 2026": "pt",
  "Solidarity supplement: 2026 monthly reference": "en",
  "Dívida: diferença entre Comissão Europeia e Orçamento": "pt",
  "Debt: gap between European Commission and Budget": "en",
  "Dívida: diferença entre plano de médio prazo e Orçamento": "pt",
  "Debt: gap between medium-term plan and Budget": "en",
  "Dívida: Portugal face à União em 2025": "pt",
  "Debt: Portugal against the Union in 2025": "en",
  "IRS: atualização do limite do escalão 1": "pt",
  "Income tax: bracket 1 limit update": "en",
  "Despesa sem PRR: crescimento": "pt",
  "Expenditure excluding the recovery plan: growth": "en",
  "Investimento: variação em contabilidade pública": "pt",
  "Investment: public accounting change": "en",
  "Juros: variação em contabilidade nacional": "pt",
  "Interest: national accounts change": "en",
  "Juros: variação em contabilidade pública": "pt",
  "Interest: public accounting change": "en",
  "Medidas novas: impacto no saldo": "pt",
  "New measures: balance impact": "en",
  "Soma dos impactos das linhas invariantes e das medidas novas no saldo": "pt",
  "Sum of unchanged-policy and new-measure balance impacts": "en",
  "PRR: peso na despesa de 2026": "pt",
  "Recovery plan: share of 2026 expenditure": "en",
  "Receita sem PRR: crescimento": "pt",
  "Revenue excluding the recovery plan: growth": "en",
  "Saldo: variação em contabilidade pública": "pt",
  "Balance: public accounting change": "en",
  "Salário mínimo: aumento face a 2024": "pt",
  "Minimum wage: increase against 2024": "en",
  "Salário mínimo: aumento face a 2026": "pt",
  "Minimum wage: increase against 2026": "en",
  "Salário mínimo: aumento percentual face a 2026": "pt",
  "Minimum wage: percentage increase against 2026": "en",
  "Salários públicos: receita fiscal e contributiva sobre a atualização": "pt",
  "Public wages: tax and contributions as a share of the update": "en",
  "IVA: condições da taxa reduzida na habitação": "pt",
  "VAT: reduced housing rate conditions": "en",
  "Habitação: datas e condições de produção de efeitos": "pt",
  "Housing: dates and conditions for legal effects": "en",
  "IVA: construção e reabilitação de habitação": "pt",
  "VAT: housing construction and rehabilitation": "en",
  "IVA: taxa de 6 % e rendimentos prediais": "pt",
  "VAT: 6% rate and rental income": "en",
  "IRC: taxa de 18 % em 2027": "pt",
  "Corporate income tax: 18% rate in 2027": "en",
  "Dívida pública bruta consolidada, em percentagem do PIB": "pt",
  "General government consolidated gross debt, as a percentage of GDP": "en",
  "Saldo das administrações públicas, em percentagem do PIB": "pt",
  "General government net lending or borrowing, as a percentage of GDP": "en",
  "IRC: taxa geral em 2026": "pt",
  "Corporate tax: general rate in 2026": "en",
  "IRC: taxa geral em 2027": "pt",
  "Corporate tax: general rate in 2027": "en",
  "IRS: limite superior do escalão 1 em 2026": "pt",
  "Income tax: upper limit of bracket 1 in 2026": "en",
  "IRS: taxa normal do escalão 1 na tabela anterior a setembro de 2026": "pt",
  "Income tax: normal rate of bracket 1 in the table preceding September 2026": "en",
  "IRS: limite superior do escalão 2 em 2026": "pt",
  "Income tax: upper limit of bracket 2 in 2026": "en",
  "IRS: taxa normal do escalão 2 na tabela anterior a setembro de 2026": "pt",
  "Income tax: normal rate of bracket 2 in the table preceding September 2026": "en",
  "IRS: limite superior do escalão 3 em 2026": "pt",
  "Income tax: upper limit of bracket 3 in 2026": "en",
  "IRS: taxa normal do escalão 3 na tabela anterior a setembro de 2026": "pt",
  "Income tax: normal rate of bracket 3 in the table preceding September 2026": "en",
  "IRS: limite superior do escalão 4 em 2026": "pt",
  "Income tax: upper limit of bracket 4 in 2026": "en",
  "IRS: taxa normal do escalão 4 na tabela anterior a setembro de 2026": "pt",
  "Income tax: normal rate of bracket 4 in the table preceding September 2026": "en",
  "IRS: limite superior do escalão 5 em 2026": "pt",
  "Income tax: upper limit of bracket 5 in 2026": "en",
  "IRS: taxa normal do escalão 5 na tabela anterior a setembro de 2026": "pt",
  "Income tax: normal rate of bracket 5 in the table preceding September 2026": "en",
  "IRS: limite superior do escalão 6 em 2026": "pt",
  "Income tax: upper limit of bracket 6 in 2026": "en",
  "IRS: taxa normal do escalão 6 na tabela anterior a setembro de 2026": "pt",
  "Income tax: normal rate of bracket 6 in the table preceding September 2026": "en",
  "IRS: limite superior do escalão 7 em 2026": "pt",
  "Income tax: upper limit of bracket 7 in 2026": "en",
  "IRS: limite superior do escalão 8 em 2026": "pt",
  "Income tax: upper limit of bracket 8 in 2026": "en",
  "IRS: limite superior do escalão 1 em 2027": "pt",
  "Income tax: upper limit of bracket 1 in 2027": "en",
  "IRS: limite superior do escalão 2 em 2027": "pt",
  "Income tax: upper limit of bracket 2 in 2027": "en",
  "IRS: limite superior do escalão 3 em 2027": "pt",
  "Income tax: upper limit of bracket 3 in 2027": "en",
  "IRS: limite superior do escalão 4 em 2027": "pt",
  "Income tax: upper limit of bracket 4 in 2027": "en",
  "IRS: limite superior do escalão 5 em 2027": "pt",
  "Income tax: upper limit of bracket 5 in 2027": "en",
  "IRS: limite superior do escalão 6 em 2027": "pt",
  "Income tax: upper limit of bracket 6 in 2027": "en",
  "IRS: limite superior do escalão 7 em 2027": "pt",
  "Income tax: upper limit of bracket 7 in 2027": "en",
  "IRS: limite superior do escalão 8 em 2027": "pt",
  "Income tax: upper limit of bracket 8 in 2027": "en",
  "Até 8 666; Normal (A), taxa em percentagem, 2027 proposta": "pt",
  "Personal income tax: normal rate for bracket 1; Normal (A), rate as a percentage, 2027 proposal": "en",
  "De mais de 8 666 até 13 075; Normal (A), taxa em percentagem, 2027 proposta": "pt",
  "Personal income tax: normal rate for bracket 2; Normal (A), rate as a percentage, 2027 proposal": "en",
  "De mais de 13 075 até 18 530; Normal (A), taxa em percentagem, 2027 proposta": "pt",
  "Personal income tax: normal rate for bracket 3; Normal (A), rate as a percentage, 2027 proposal": "en",
  "De mais de 18 530 até 23 985; Normal (A), taxa em percentagem, 2027 proposta": "pt",
  "Personal income tax: normal rate for bracket 4; Normal (A), rate as a percentage, 2027 proposal": "en",
  "De mais de 23 985 até 30 538; Normal (A), taxa em percentagem, 2027 proposta": "pt",
  "Personal income tax: normal rate for bracket 5; Normal (A), rate as a percentage, 2027 proposal": "en",
  "De mais de 30 538 até 44 762; Normal (A), taxa em percentagem, 2027 proposta": "pt",
  "Personal income tax: normal rate for bracket 6; Normal (A), rate as a percentage, 2027 proposal": "en",
  "De mais de 44 762 até 48 373; Normal (A), taxa em percentagem, 2027 proposta": "pt",
  "Personal income tax: normal rate for bracket 7; Normal (A), rate as a percentage, 2027 proposal": "en",
  "De mais de 48 373 até 89 995; Normal (A), taxa em percentagem, 2027 proposta": "pt",
  "Personal income tax: normal rate for bracket 8; Normal (A), rate as a percentage, 2027 proposal": "en",
  "Superior a 89 995; Normal (A), taxa em percentagem, 2027 proposta": "pt",
  "Personal income tax: normal rate for bracket 9; Normal (A), rate as a percentage, 2027 proposal": "en",
  "Entrega da proposta de Orçamento": "pt",
  "Delivery of the Budget proposal": "en",
  "Debate e votação na especialidade": "pt",
  "Committee debate and vote": "en",
  "Votação final global": "pt",
  "Final global vote": "en",
  "Debate e votação na generalidade": "pt",
  "General debate and vote": "en",
  "CSI: aumento mensal do valor de referência": "pt",
  "Solidarity supplement: monthly increase": "en",
  "CSI: valor de referência mensal": "pt",
  "Solidarity supplement: monthly reference amount": "en",
  "CSI: objetivo do valor de referência mensal": "pt",
  "Solidarity supplement: target monthly reference amount": "en",
  "IRS: sexta redução segundo o relatório": "pt",
  "Income tax: sixth cut according to the report": "en",
  "Fim do PRR: investimento": "pt",
  "End of the recovery plan: investment": "en",
  "Quadro das medidas: definição da marca (i)": "pt",
  "Measures table: definition of mark (i)": "en",
  "Administração Pública: atualização das remunerações": "pt",
  "Public administration: wage update": "en",
  "Valor de referência e despesa do CSI": "pt",
  "CSI reference amount and expenditure": "en",
  "Trajetória da dívida pública (POENMP)": "pt",
  "Public debt path (POENMP)": "en",
  "Objetivo da dívida no final da década": "pt",
  "Debt target at the end of the decade": "en",
  "Atualização regular das pensões": "pt",
  "Regular pension update": "en",
  "Pensões e CSI no capítulo 3": "pt",
  "Pensions and CSI in chapter 3": "en",
  "Investimento (FBCF); 2026; estimativa; %": "pt",
  "Investment (gross fixed capital formation); 2026; estimate; %": "en",
  "Investimento (FBCF); 2027; previsão; %": "pt",
  "Investment (gross fixed capital formation); 2027; forecast; %": "en",
  "IHPC; 2026; estimativa; %": "pt",
  "Harmonised index of consumer prices; 2026; estimate; %": "en",
  "IHPC; 2027; previsão; %": "pt",
  "Harmonised index of consumer prices; 2027; forecast; %": "en",
  "Emprego (ótica de Contas Nacionais); 2027; previsão; %": "pt",
  "Employment (national accounts); 2027; forecast; %": "en",
  "Taxa de desemprego (% da população ativa); 2027; previsão; %": "pt",
  "Unemployment rate (% of the labour force); 2027; forecast; %": "en",
  "Remunerações por trabalhador; 2027; previsão; %": "pt",
  "Compensation per employee; 2027; forecast; %": "en",
  "PIB; 2026; estimativa; %": "pt",
  "GDP; 2026; estimate; %": "en",
  "PIB; 2027; previsão; %": "pt",
  "GDP; 2027; forecast; %": "en",
  "Consumo privado; 2027; previsão; %": "pt",
  "Private consumption; 2027; forecast; %": "en",
  "Receita total; 2026; estimativa; milhões de euros": "pt",
  "Total revenue; 2026; estimate; million euros": "en",
  "Receita total; 2027; orçamento; milhões de euros": "pt",
  "Total revenue; 2027; budget; million euros": "en",
  "Receita total; 2026; estimativa; % do PIB": "pt",
  "Total revenue; 2026; estimate; % of GDP": "en",
  "Receita total; 2027; orçamento; % do PIB": "pt",
  "Total revenue; 2027; budget; % of GDP": "en",
  "PRR; 2026; estimativa; milhões de euros": "pt",
  "Recovery and Resilience Plan (Total revenue); 2026; estimate; million euros": "en",
  "PRR; 2027; orçamento; milhões de euros": "pt",
  "Recovery and Resilience Plan (Total revenue); 2027; budget; million euros": "en",
  "sem PRR; 2026; estimativa; milhões de euros": "pt",
  "Excluding the Recovery and Resilience Plan (Total revenue); 2026; estimate; million euros": "en",
  "sem PRR; 2027; orçamento; milhões de euros": "pt",
  "Excluding the Recovery and Resilience Plan (Total revenue); 2027; budget; million euros": "en",
  "Juros; 2026; estimativa; milhões de euros": "pt",
  "Interest; 2026; estimate; million euros": "en",
  "Juros; 2027; orçamento; milhões de euros": "pt",
  "Interest; 2027; budget; million euros": "en",
  "Juros; 2027; orçamento; % do PIB": "pt",
  "Interest; 2027; budget; % of GDP": "en",
  "Despesa total; 2026; estimativa; milhões de euros": "pt",
  "Total expenditure; 2026; estimate; million euros": "en",
  "Despesa total; 2027; orçamento; milhões de euros": "pt",
  "Total expenditure; 2027; budget; million euros": "en",
  "Despesa total; 2026; estimativa; % do PIB": "pt",
  "Total expenditure; 2026; estimate; % of GDP": "en",
  "Despesa total; 2027; orçamento; % do PIB": "pt",
  "Total expenditure; 2027; budget; % of GDP": "en",
  "Recovery and Resilience Plan (Total expenditure); 2026; estimate; million euros": "en",
  "Recovery and Resilience Plan (Total expenditure); 2027; budget; million euros": "en",
  "Excluding the Recovery and Resilience Plan (Total expenditure); 2026; estimate; million euros": "en",
  "Excluding the Recovery and Resilience Plan (Total expenditure); 2027; budget; million euros": "en",
  "Saldo primário; 2026; estimativa; milhões de euros": "pt",
  "Primary balance; 2026; estimate; million euros": "en",
  "Saldo primário; 2027; orçamento; milhões de euros": "pt",
  "Primary balance; 2027; budget; million euros": "en",
  "Saldo primário; 2026; estimativa; % do PIB": "pt",
  "Primary balance; 2026; estimate; % of GDP": "en",
  "Saldo primário; 2027; orçamento; % do PIB": "pt",
  "Primary balance; 2027; budget; % of GDP": "en",
  "Habitação - redução IRS rendas moderadas de 25% para 10% (i); 2027; impacto incremental; milhões de euros": "pt",
  "Housing: personal income tax on moderate rents cut from 25% to 10% (i); 2027; incremental impact; million euros": "en",
  "Atualização dedução específica e escalões (i); 2027; impacto incremental; milhões de euros": "pt",
  "Updating the specific deduction and tax brackets (i); 2027; incremental impact; million euros": "en",
  "Receita decorrente do aumento de salários (i); 2027; impacto incremental; milhões de euros": "pt",
  "Revenue arising from wage increases (i) (personal income tax); 2027; incremental impact; million euros": "en",
  "Atualização do limite do mínimo de existência; 2027; impacto incremental; milhões de euros": "pt",
  "Updating the minimum subsistence threshold; 2027; incremental impact; million euros": "en",
  "IRC; 2027; impacto incremental; milhões de euros": "pt",
  "Corporate income tax; 2027; incremental impact; million euros": "en",
  "Redução taxa em 1 p.p. (i); 2027; impacto incremental; milhões de euros": "pt",
  "Rate cut by 1 percentage point (i); 2027; incremental impact; million euros": "en",
  "SIFIDE indireto (reversão) (i); 2027; impacto incremental; milhões de euros": "pt",
  "Indirect SIFIDE (reversal) (i); 2027; incremental impact; million euros": "en",
  "Contribuições sociais; 2027; impacto incremental; milhões de euros": "pt",
  "Social contributions; 2027; incremental impact; million euros": "en",
  "Revenue arising from wage increases (i) (Social contributions); 2027; incremental impact; million euros": "en",
  "Medidas despesa; 2027; impacto incremental; milhões de euros": "pt",
  "Expenditure measures; 2027; incremental impact; million euros": "en",
  "Despesas com pessoal; 2027; impacto incremental; milhões de euros": "pt",
  "Compensation of employees; 2027; incremental impact; million euros": "en",
  "Aumento acordo de rendimentos (i); 2027; impacto incremental; milhões de euros": "pt",
  "Increase under the incomes agreement (i); 2027; incremental impact; million euros": "en",
  "Aumento RMMG (i); 2027; impacto incremental; milhões de euros": "pt",
  "Minimum wage increase (i); 2027; incremental impact; million euros": "en",
  "Acordos salariais (i); 2027; impacto incremental; milhões de euros": "pt",
  "Wage agreements (i); 2027; incremental impact; million euros": "en",
  "Prestações sociais; 2027; impacto incremental; milhões de euros": "pt",
  "Social benefits; 2027; incremental impact; million euros": "en",
  "Reforço Complemento Solidário para Idosos (CSI); 2027; impacto incremental; milhões de euros": "pt",
  "Increase in the solidarity supplement for older people; 2027; incremental impact; million euros": "en",
  "Impacto no saldo; 2027; impacto incremental; milhões de euros": "pt",
  "Impact on the balance; 2027; incremental impact; million euros": "en",
  "Medidas receita; 2027; impacto incremental; milhões de euros": "pt",
  "Revenue measures; 2027; incremental impact; million euros": "en",
  "IVA; 2027; impacto incremental; milhões de euros": "pt",
  "VAT; 2027; incremental impact; million euros": "en",
  "Habitação - redução IVA construção de 23% para 6% (i); 2027; impacto incremental; milhões de euros": "pt",
  "Housing: construction VAT cut from 23% to 6% (i); 2027; incremental impact; million euros": "en",
  "Combate à fraude no setor dos combustíveis; 2027; impacto incremental; milhões de euros": "pt",
  "Combating fraud in the fuel sector; 2027; incremental impact; million euros": "en",
  "IRS; 2027; impacto incremental; milhões de euros": "pt",
  "Personal income tax; 2027; incremental impact; million euros": "en",
  "Administração Central; 2027; orçamento; milhões de euros": "pt",
  "Central government (1. General government balance in public accounts); 2027; budget; million euros": "en",
  "Administração Regional e Local; 2027; orçamento; milhões de euros": "pt",
  "Regional and local government (1. General government balance in public accounts); 2027; budget; million euros": "en",
  "Segurança Social; 2027; orçamento; milhões de euros": "pt",
  "Social security (1. General government balance in public accounts); 2027; budget; million euros": "en",
  "2. Ajustamentos em Contas Nacionais; 2027; orçamento; milhões de euros": "pt",
  "2. National accounts adjustments; 2027; budget; million euros": "en",
  "Diferença entre juros pagos e devidos do Estado; 2027; orçamento; milhões de euros": "pt",
  "Difference between State interest paid and accrued; 2027; budget; million euros": "en",
  "Entidades Públicas Reclassificadas; 2027; orçamento; milhões de euros": "pt",
  "Reclassified public entities; 2027; budget; million euros": "en",
  "Injeções de capital e empréstimos; 2027; orçamento; milhões de euros": "pt",
  "Capital injections and loans; 2027; budget; million euros": "en",
  "3. Saldo das AP em contabilidade nacional (1+2); 2026; estimativa; milhões de euros": "pt",
  "3. General government balance in national accounts (1+2); 2026; estimate; million euros": "en",
  "3. Saldo das AP em contabilidade nacional (1+2); 2027; orçamento; milhões de euros": "pt",
  "3. General government balance in national accounts (1+2); 2027; budget; million euros": "en",
  "3. Saldo das AP em contabilidade nacional (1+2); 2027; orçamento; % do PIB": "pt",
  "3. General government balance in national accounts (1+2); 2027; budget; % of GDP": "en",
  "Dívida pública consolidada (%); 2025; observado; % do PIB": "pt",
  "Consolidated public debt (%); 2025; actual; % of GDP": "en",
  "Dívida pública consolidada (%); 2026; estimativa; % do PIB": "pt",
  "Consolidated public debt (%); 2026; estimate; % of GDP": "en",
  "Dívida pública consolidada (%); 2027; orçamento; % do PIB": "pt",
  "Consolidated public debt (%); 2027; budget; % of GDP": "en",
  "Variação (p.p.); 2026; estimativa; pontos percentuais do PIB": "pt",
  "Change (percentage points); 2026; estimate; percentage points of GDP": "en",
  "Variação (p.p.); 2027; orçamento; pontos percentuais do PIB": "pt",
  "Change (percentage points); 2027; budget; percentage points of GDP": "en",
  "Efeito saldo primário; 2026; estimativa; pontos percentuais do PIB": "pt",
  "Primary balance effect; 2026; estimate; percentage points of GDP": "en",
  "Efeito saldo primário; 2027; orçamento; pontos percentuais do PIB": "pt",
  "Primary balance effect; 2027; budget; percentage points of GDP": "en",
  "Efeito dinâmico; 2026; estimativa; pontos percentuais do PIB": "pt",
  "Dynamic effect; 2026; estimate; percentage points of GDP": "en",
  "Efeito dinâmico; 2027; orçamento; pontos percentuais do PIB": "pt",
  "Dynamic effect; 2027; budget; percentage points of GDP": "en",
  "Efeito juros; 2027; orçamento; pontos percentuais do PIB": "pt",
  "Interest effect; 2027; budget; percentage points of GDP": "en",
  "Efeito PIB; 2027; orçamento; pontos percentuais do PIB": "pt",
  "GDP effect; 2027; budget; percentage points of GDP": "en",
  "Ajustamento défice-dívida; 2026; estimativa; pontos percentuais do PIB": "pt",
  "Deficit-debt adjustment; 2026; estimate; percentage points of GDP": "en",
  "Ajustamento défice-dívida; 2027; orçamento; pontos percentuais do PIB": "pt",
  "Deficit-debt adjustment; 2027; budget; percentage points of GDP": "en",
  "Impostos diretos; 2027; orçamento; milhões de euros": "pt",
  "Direct taxes; 2027; budget; million euros": "en",
  "Impostos diretos; 2027/2026; variação; %": "pt",
  "Direct taxes; 2027/2026; change; %": "en",
  "Impostos indiretos; 2027; orçamento; milhões de euros": "pt",
  "Indirect taxes; 2027; budget; million euros": "en",
  "Impostos indiretos; 2027/2026; variação; %": "pt",
  "Indirect taxes; 2027/2026; change; %": "en",
  "Contribuições de segurança social; 2027; orçamento; milhões de euros": "pt",
  "Social security contributions; 2027; budget; million euros": "en",
  "Contribuições de segurança social; 2027/2026; variação; %": "pt",
  "Social security contributions; 2027/2026; change; %": "en",
  "Receita Total; 2026; estimativa; milhões de euros": "pt",
  "Receita Total; 2027; orçamento; milhões de euros": "pt",
  "Receita Total; 2027/2026; variação; %": "pt",
  "Total revenue; 2027/2026; change; %": "en",
  "Despesas com pessoal; 2026; estimativa; milhões de euros": "pt",
  "Compensation of employees; 2026; estimate; million euros": "en",
  "Despesas com pessoal; 2027; orçamento; milhões de euros": "pt",
  "Compensation of employees; 2027; budget; million euros": "en",
  "Despesas com pessoal; 2027/2026; variação; %": "pt",
  "Compensation of employees; 2027/2026; change; %": "en",
  "Juros e outros encargos; 2026; estimativa; milhões de euros": "pt",
  "Interest and other charges; 2026; estimate; million euros": "en",
  "Juros e outros encargos; 2027; orçamento; milhões de euros": "pt",
  "Interest and other charges; 2027; budget; million euros": "en",
  "Juros e outros encargos; 2027/2026; variação; %": "pt",
  "Interest and other charges; 2027/2026; change; %": "en",
  "Transferências correntes; 2027; orçamento; milhões de euros": "pt",
  "Current transfers; 2027; budget; million euros": "en",
  "Transferências correntes; 2027/2026; variação; %": "pt",
  "Current transfers; 2027/2026; change; %": "en",
  "Investimentos; 2026; estimativa; milhões de euros": "pt",
  "Investment; 2026; estimate; million euros": "en",
  "Investimentos; 2027; orçamento; milhões de euros": "pt",
  "Investment; 2027; budget; million euros": "en",
  "Investimentos; 2027/2026; variação; %": "pt",
  "Investment; 2027/2026; change; %": "en",
  "Despesa Total; 2026; estimativa; milhões de euros": "pt",
  "Despesa Total; 2027; orçamento; milhões de euros": "pt",
  "Despesa Total; 2027/2026; variação; %": "pt",
  "Total expenditure; 2027/2026; change; %": "en",
  "Saldo Global; 2026; estimativa; milhões de euros": "pt",
  "Overall balance; 2026; estimate; million euros": "en",
  "Saldo Global; 2027; orçamento; milhões de euros": "pt",
  "Overall balance; 2027; budget; million euros": "en",
  "Saldo Global; 2026; estimativa; % do PIB": "pt",
  "Overall balance; 2026; estimate; % of GDP": "en",
  "Saldo Global; 2027; orçamento; % do PIB": "pt",
  "Overall balance; 2027; budget; % of GDP": "en",
  "Atualização das remunerações públicas e reforço do CSI": "pt",
  "Public wage update and CSI increase": "en",
  "Remuneração mínima mensal garantida": "pt",
  "Guaranteed minimum monthly wage": "en",
  "Trajetória da dívida pública": "pt",
  "Public debt path": "en",
  "Rendimentos dos trabalhadores": "pt",
  "Workers income": "en",
  "Posição sobre o Orçamento do Estado de 2027": "pt",
  "Position on the 2027 State Budget": "en",
  "Pacote fiscal e apoios à habitação": "pt",
  "Housing tax package and rent support": "en",
  "CSI, pensões e atualização do IRS": "pt",
  "Solidarity supplement, pensions and income tax adjustment": "en",
  "Miranda Sarmento: dívida, citação pela notícia": "pt",
  "Miranda Sarmento: debt, quotation in the news report": "en",
  "Dívida pública abaixo de 85% do PIB em 2027": "pt",
  "Public debt below 85% of GDP in 2027": "en",
  "Redução do IRC": "pt",
  "Corporate income tax reduction": "en",
  "IRS e IRS Jovem": "pt",
  "Personal income tax and youth income tax": "en",
  "Proteção das famílias não abrangidas pela descida do IRS": "pt",
  "Protection for households outside the income tax reduction": "en",
  "Descida da taxa normal do IVA para 21%": "pt",
  "Standard VAT rate reduction to 21%": "en",
  "Investimento em habitação": "pt",
  "Housing investment": "en",
  "IRC e benefícios fiscais": "pt",
  "Corporate income tax and tax benefits": "en",
  "IRS Jovem, residentes não habituais e rendas": "pt",
  "Youth income tax, non-habitual residents and rents": "en",
  "Pensões e prestações sociais": "pt",
  "Pensions and social benefits": "en",
  "Salários públicos e subsídio de alimentação": "pt",
  "Public wages and meal allowance": "en",
  "Salário mínimo nacional": "pt",
  "National minimum wage": "en",
  "Redução seletiva do IRC": "pt",
  "Targeted corporate income tax reduction": "en",
  "Posição do PS sobre a atualização das pensões": "pt",
  "PS position on pension updates": "en",
  "Dedução das rendas no IRS": "pt",
  "Income tax deduction for rents": "en",
  "Política fiscal e impostos": "pt",
  "Fiscal policy and taxes": "en",
  "Espanha: salário mínimo mensal em 2026": "pt",
  "Spain: monthly minimum wage in 2026": "en",
  "Dívida: ajustamento défice-dívida": "pt",
  "Debt: deficit-debt adjustment": "en",
  "Dívida: saldo primário e efeito dinâmico": "pt",
  "Debt: primary balance and dynamic effect": "en",
  "UTAO: crescimento dos juros": "pt",
  "UTAO: interest growth": "en",
  "Dívida: despesa com juros": "pt",
  "Debt: interest expenditure": "en",
  "Medidas: novas e anteriormente adotadas": "pt",
  "Measures: new and previously adopted": "en",
  "New measures: impact on balance": "en",
  "Medidas: revisão das políticas invariantes": "pt",
  "Measures: unchanged-policy revision": "en",
  "Medidas: impacto das políticas invariantes": "pt",
  "Measures: unchanged-policy impact": "en",
  "Saldo: revisão face ao plano de médio prazo": "pt",
  "Balance: revision against medium-term plan": "en",
  "Riscos: responsabilidades contingentes": "pt",
  "Risks: contingent liabilities": "en",
  "Riscos: emprego público": "pt",
  "Risks: public employment": "en",
  "Riscos: fenómenos naturais extremos": "pt",
  "Risks: extreme natural events": "en",
  "Riscos: combate à fraude nos combustíveis": "pt",
  "Risks: fuel fraud measures": "en",
  "Riscos: encargos com juros": "pt",
  "Risks: interest expenditure": "en",
  "Riscos: mercados de dívida soberana": "pt",
  "Risks: sovereign debt markets": "en",
  "Riscos: crescimento económico e receita": "pt",
  "Risks: economic growth and revenue": "en",
  "Riscos: execução do SNS": "pt",
  "Risks: national health service execution": "en",
  "UTAO: contribuições da atualização salarial": "pt",
  "UTAO: contributions from the wage update": "en",
  "UTAO: receita de IRS da atualização salarial": "pt",
  "UTAO: income tax from the wage update": "en",
  "UTAO: atualização salarial": "pt",
  "UTAO: wage update": "en",
  "Salários públicos: atualização": "pt",
  "Public wages: adjustment": "en",
  "Saldo orçamental": "pt",
  "Budget balance": "en",
  "UTAO: taxa de juro implícita": "pt",
  "UTAO: implicit interest rate": "en"
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
  return declarada === 'pt' ? 'pt-PT' : declarada;
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
  // V2-e: cadeias lidas nos documentos e nas respostas das fontes.
  "Recuperar Portugal": "pt",
  "INFARMED": "pt",
  "Assembleia da República": "pt",
  "Instituto da Mobilidade e dos Transportes": "pt",
  "Tribunal de Contas": "pt",
  "Serviço Nacional de Saúde": "pt",

  // EO1: nomes conferidos nos documentos alojados.
  "European Commission": "en",
  "PRESIDÊNCIA DO CONSELHO DE MINISTROS": "pt",
  "AT": "pt",
  "Presidência do Conselho de Ministros": "pt",
  "TV RECORD EUROPA": "pt",
  "Folha Nacional": "pt",
  "Governo": "pt",
  "Observador": "pt",
  "Diário de Notícias": "pt",
  "Partido Comunista Português": "pt",
  "Partido Socialista": "pt",
  "Notícias ao Minuto": "pt",
  "Boletín Oficial del Estado": "es",
  "Unidade Técnica de Apoio Orçamental": "pt",
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
  return declarada === 'pt' ? 'pt-PT' : declarada;
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
  // V2-e: cadeias lidas nos documentos e nas respostas das fontes.
  "2026-10-14": null,
  "2026-08": null,
  "2026-01/2026-08": null,
  "2026-01/2026-07": null,
  "2025-01/2025-07": null,
  "2026-07": null,
  "1972/2035": null,
  "2035-12-31": null,
  "2008-12-31": null,
  "2008": null,
  "2024-12-27": null,
  "2025-01-01": null,
  "2012": null,
  "2025-12-31": null,
  "2025-08": null,
  "2025-10-19": null,
  "2026-10-19": null,
  "2025-07": null,
  "2025-06": null,
  "2026-06": null,

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
  return declarada === 'pt' ? 'pt-PT' : declarada;
}

/** EX3: localizadores lidos nas folhas inglesas da NATO, declarados por inteiro. */
export const LINGUA_DOS_LOCALIZADORES = {
  // V2-e: coordenadas da resposta inglesa do Eurostat.
  "freq=A; unit=P_HTHAB; wstatus=PRACT; med_spec=PHYS; geo=BE; time=2024; value[16]": "en",
  "freq=A; unit=P_HTHAB; wstatus=PRACT; med_spec=PHYS; geo=EL; time=2024; value[58]": "en",
  "freq=A; unit=P_HTHAB; wstatus=PRACT; med_spec=NRS; geo=LU; time=2024; value[574]": "en",
  "freq=A; unit=P_HTHAB; wstatus=PRACT; med_spec=PHYS; geo=PT; time=2024; value[142]": "en",
  "freq=A; unit=P_HTHAB; wstatus=PRACT; med_spec=NRS; geo=PT; time=2024; value[610]": "en",
  "freq=A; unit=P_HTHAB; wstatus=PRACT; med_spec=NRS; geo=RO; time=2024; value[616]": "en",

  "Table III.18.1: Main features of country forecast - PORTUGAL; General government gross debt (c); coluna 6: 2026; p. 143 PDF (127 impressa)": "pt-PT",
  "Table III.18.1: Main features of country forecast - PORTUGAL; General government gross debt (c); coluna 7: 2027; p. 143 PDF (127 impressa)": "pt-PT",
  "p. 143 PDF (127 impressa)": "pt-PT",
  "Table III.18.1: Main features of country forecast - PORTUGAL; GDP; coluna 9: 2027; p. 143 PDF (127 impressa)": "pt-PT",
  "Table III.18.1: Main features of country forecast - PORTUGAL; General government balance (c); coluna 7: 2027; p. 143 PDF (127 impressa)": "pt-PT",
  "freq=A; unit=PC_GDP; sector=S13; na_item=GD; geo=EE; time=2025; value[59]": "en",
  "freq=A; unit=PC_GDP; sector=S13; na_item=GD; geo=EL; time=2025; value[71]": "en",
  "freq=A; unit=PC_GDP; sector=S13; na_item=GD; geo=ES; time=2025; value[77]": "en",
  "freq=A; unit=PC_GDP; sector=S13; na_item=GD; geo=EU27_2020; time=2025; value[5]": "en",
  "freq=A; unit=PC_GDP; sector=S13; na_item=GD; geo=PT; time=2025; value[155]": "en",
  "freq=A; unit=PC_GDP; sector=S13; na_item=B9; geo=CY; time=2025; value[101]": "en",
  "freq=A; unit=PC_GDP; sector=S13; na_item=B9; geo=EU27_2020; time=2025; value[5]": "en",
  "freq=A; unit=PC_GDP; sector=S13; na_item=B9; geo=PT; time=2025; value[155]": "en",
  "freq=A; unit=PC_GDP; sector=S13; na_item=B9; geo=RO; time=2025; value[161]": "en",
  "Real Decreto 126/2026; artículo 1": "es",
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

/** EO1: o localizador pode usar outra língua que o título do documento.
 * @param {unknown} texto @param {unknown} titulo @param {string} lang
 */
export function linguaDoLocalizador(texto, titulo, lang='pt') {
 const declared=/** @type {Record<string,string>} */ (LINGUA_DOS_LOCALIZADORES)[String(texto??'')];
 if (!declared) return linguaDoTituloDoDocumento(titulo,lang);
 return declared===(lang==='pt'?'pt-PT':lang)?null:declared;
}
