/**
 * ---------------------------------------------------------------------------
 * DUAS LISTAS DECLARADAS, COM O QUADRO NOMEADO POR ENTRADA (v3, etapa 2l)
 * ---------------------------------------------------------------------------
 *
 * A Emenda 16 de 21.08.2026 (segunda leitura da pré-visualização n.º 1) fecha
 * duas coisas que estavam abertas:
 *
 *   1. **o painel da primeira página é o painel inteiro, não a sua metade má.**
 *      Mostravam-se quatro medidas fora do limiar e quatro sem limiar; passam a
 *      mostrar-se as TREZE linhas que o livro-razão guarda com limiar publicado
 *      do Procedimento dos Desequilíbrios Macroeconómicos, cada uma com o seu
 *      estado. Portugal ultrapassa 4 e cumpre 9;
 *   2. **o Painel Social Europeu é uma lista à parte**, sem cor, porque não
 *      publica limiares: o que ele classifica é uma posição na distribuição dos
 *      Estados-Membros do ano, e uma posição não é um limiar (Emenda 1).
 *
 * A LISTA DAS TREZE SAI DE UM COMANDO, E NÃO DE UMA ESCOLHA DA CASA:
 *
 *     grep -l "Limiar do Procedimento" ledger/claims/*.yml     → 13 ficheiros
 *
 * e cada entrada abaixo escreve o limiar **como a nota daquela linha o
 * escreve**, sem uma conversão, sem um arredondamento e sem um valor que a
 * linha não carregue. Onde a nota diz «-4/+6%», a entrada declara uma BANDA de
 * dois lados; onde diz «-0.2pp», declara o sinal, o algarismo e o símbolo que a
 * nota usa. O símbolo é declarado por entrada e nunca inferido: doze notas
 * escrevem «%» e uma escreve «pp», e uma regra que assumisse a percentagem
 * escreveria «limiar −0,2%» debaixo de uma linha que mede pontos percentuais.
 *
 * A LISTA DO PAINEL SOCIAL SAI DO REGISTO DO MOTOR, linha a linha, e cada
 * entrada diz a LINHA do documento que a coloca:
 * `ResearchHub/indicators/convergence.md`, o quadro comparativo da §2, coluna
 * «Social SB». Uma linha que o documento não coloca não entra na lista —
 * medido, e não presumido: nenhum ficheiro do livro-razão nomeia o Painel
 * Social Europeu (`grep -rin "social scoreboard\|painel social" ledger/claims/`
 * → sem saída, exit 1), e por isso o registo que o coloca é o do motor e mais
 * nenhum.
 *
 * O QUE FICA DE FORA DAS DUAS LISTAS FICA ATRÁS DE UMA PORTA, que é o resto do
 * livro-razão. Uma medida que este ficheiro não nomeia continua a ter linha,
 * página e selo; o que ela não tem é lugar na primeira página.
 *
 * ---------------------------------------------------------------------------
 * A LINHA DO LIMIAR (v2, direção S; IDENTIDADE.md §11)
 * ---------------------------------------------------------------------------
 * O limiar saiu da linha da medida e ganhou linha própria: «limiar 60% ·
 * acima». Não leva barra e não leva distância. Uma barra por célula,
 * normalizada ao seu próprio limiar, convida a comparar medidas que não são
 * comparáveis, e uma distância seria um número novo, sem linha e sem selo
 * (`design/CRITICA-codex.md`; `design/DECISAO.md`). O desenho de distância vive
 * na régua, onde há uma escala escrita.
 *
 * A PALAVRA É DERIVADA, E DE DOIS NÚMEROS QUE JÁ EXISTEM. «acima», «abaixo» ou
 * «no limiar» sai de `comparacaoComOLimiar()`, que compara o valor publicado da
 * linha com o limiar publicado pelo quadro. É prosa da casa gerada de uma
 * comparação, e não um algarismo: não acrescenta um dígito à página, e por isso
 * não pede proveniência nova.
 *
 * O SINAL VAI À FRENTE E EM PROSA. O limiar da posição de investimento é −35, e
 * o sinal é um símbolo, não um algarismo: fica fora da marca.
 *
 * ---------------------------------------------------------------------------
 * O LADO DO LIMIAR, DECLARADO (v3, etapa 2a; ISSUES I6) — E A BANDA (etapa 2l)
 * ---------------------------------------------------------------------------
 * Cada `limiar` diz de que lado dele o valor tem de ficar, com a palavra que o
 * quadro publica:
 *
 *   `lado: 'superior'`  o limiar é um TETO. Estar acima dele é estar fora.
 *   `lado: 'inferior'`  o limiar é um CHÃO. Estar abaixo dele é estar fora.
 *   `inferior` + `superior`  é uma BANDA: estar dentro é estar entre os dois.
 *
 * É um campo DECLARADO, e nunca inferido do sinal. A posição de investimento
 * internacional publica −35 e é um chão: uma regra que lesse «negativo, logo
 * chão» acertaria nesta linha e erraria na primeira linha negativa com teto que
 * o painel viesse a ganhar.
 *
 * As frases dizem o que a medida é, não o que ela significa. A interpretação é
 * trabalho do director, e vai nos estudos.
 *
 * ESCOLHA DOS INDICADORES — 2026-08-12, alargada a 2026-08-21.
 * Estes não são indicadores escolhidos por nós. São os do painel do
 * Procedimento relativo aos Desequilíbrios Macroeconómicos e do Painel Social
 * Europeu: o conjunto que as instituições europeias usam para avaliar um
 * Estado-Membro, com os limiares que elas próprias publicam. O critério de
 * selecção, e a comparação entre os quadros do FMI, da OCDE, do Banco Mundial e
 * da ONU, estão em ResearchHub/indicators/convergence.md.
 *
 * Cada valor foi confirmado contra a Comissão Europeia, SWD(2026) 222, por
 * caminho independente da API do Eurostat. Ver a nota de cada afirmação.
 */

import { parsePtNumber } from '../lib/ledger.mjs';

/**
 * AS TREZE LINHAS COM LIMIAR PUBLICADO DO PROCEDIMENTO (Emenda 16).
 *
 * A ordem tem duas partes, e as duas são mecânicas:
 *
 *   · primeiro as QUATRO que a página já mostrava, pela ordem em que a lede da
 *     manchete as nomeia (dívida pública, posição de investimento internacional,
 *     custo unitário do trabalho, preços da habitação). São as quatro que estão
 *     fora do limiar, e são as únicas que trazem frase. A frase de cada uma era
 *     a da célula da v2, relocada sem mudar uma palavra (R1); **três das quatro
 *     deixaram de o ser a 03.09.2026**, quando o F0.9 lhes tirou a oração que
 *     afirmava sem linha (a tendência da dívida, os dois anos dos preços da
 *     habitação, a mudança de definição do custo do trabalho). A quarta, a da
 *     posição de investimento internacional, já tinha sido reescrita na §1.44 e
 *     não muda aqui. A razão de cada corte está na entrada da sua célula;
 *   · depois as NOVE novas, pela ordem em que o `grep` as devolve, que é a
 *     alfabética do nome do ficheiro. Uma ordem mecânica, para que a lista não
 *     tenha uma arrumação da casa por dentro. As nove não trazem frase: nome,
 *     valor, unidade, estado e selo, que é o que a Emenda 16 lhes dá.
 */
const LISTA_PDM = [
  // ——— Os quatro limiares ultrapassados ———
  {
    claim: 'divida-publica-2025',
    quadro: 'pdm',
    nome: { pt: 'Dívida pública', en: 'Government debt' },
    medida: {
      pt: ['Percentagem do PIB · ', { ref: '2025' }],
      en: ['Percentage of GDP · ', { ref: '2025' }],
    },
    /* nota: «Limiar do Procedimento relativo aos Desequilíbrios Macroeconómicos: 60%.» */
    limiar: { nl: '60', lado: 'superior', simbolo: '%' },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'posicao-de-investimento-internacional-2025',
    quadro: 'pdm',
    nome: { pt: 'Posição de investimento internacional', en: 'Net international investment position' },
    medida: {
      pt: ['Percentagem do PIB · ', { ref: '2025' }],
      en: ['Percentage of GDP · ', { ref: '2025' }],
    },
    /* nota: «… -35%.» */
    limiar: { nl: '35', sinal: '−', lado: 'inferior', simbolo: '%' },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'custo-unitario-do-trabalho-2025',
    quadro: 'pdm',
    nome: { pt: 'Custo unitário do trabalho', en: 'Unit labour cost' },
    medida: {
      pt: ['Variação em três anos · ', { ref: '2025' }],
      en: ['Three-year change · ', { ref: '2025' }],
    },
    /* nota: «… +9% (EA).» */
    limiar: { nl: '9', lado: 'superior', simbolo: '%' },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'precos-da-habitacao-2025',
    quadro: 'pdm',
    nome: { pt: 'Preços da habitação', en: 'House prices' },
    medida: {
      pt: ['Variação anual · ', { ref: '2025' }],
      en: ['Annual change · ', { ref: '2025' }],
    },
    /* nota: «… +9%.» */
    limiar: { nl: '9', lado: 'superior', simbolo: '%' },
    limiarFixadoPor: 'comissao',
  },

  // ——— As nove que o painel também publica, e que o país cumpre ———
  {
    claim: 'desempenho-das-exportacoes-2025',
    quadro: 'pdm',
    nome: { pt: 'Quota nas exportações', en: 'Share of exports' },
    medida: {
      pt: ['Percentagem do total OCDE e UE não-OCDE, variação em três anos · ', { ref: '2025' }],
      en: ['Percentage of the OECD and non-OECD EU total, three-year change · ', { ref: '2025' }],
    },
    /* nota: «… -3%.» */
    limiar: { nl: '3', sinal: '−', lado: 'inferior', simbolo: '%' },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'divida-das-empresas-2025',
    quadro: 'pdm',
    nome: { pt: 'Dívida das empresas', en: 'Corporate debt' },
    medida: {
      pt: ['Percentagem do PIB · ', { ref: '2025' }],
      en: ['Percentage of GDP · ', { ref: '2025' }],
    },
    /* nota: «… 85%.» */
    limiar: { nl: '85', lado: 'superior', simbolo: '%' },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'divida-das-familias-2025',
    quadro: 'pdm',
    nome: { pt: 'Dívida das famílias', en: 'Household debt' },
    medida: {
      pt: ['Percentagem do PIB · ', { ref: '2025' }],
      en: ['Percentage of GDP · ', { ref: '2025' }],
    },
    /* nota: «… 55%.» */
    limiar: { nl: '55', lado: 'superior', simbolo: '%' },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'fluxo-de-credito-as-empresas-2025',
    quadro: 'pdm',
    nome: { pt: 'Fluxo de crédito às empresas', en: 'Credit flow to corporations' },
    medida: {
      pt: ['Percentagem do stock no final do período anterior · ', { ref: '2025' }],
      en: ['Percentage of the stock at the end of the previous period · ', { ref: '2025' }],
    },
    /* nota: «… 13%.» */
    limiar: { nl: '13', lado: 'superior', simbolo: '%' },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'fluxo-de-credito-as-familias-2025',
    quadro: 'pdm',
    nome: { pt: 'Fluxo de crédito às famílias', en: 'Credit flow to households' },
    medida: {
      pt: ['Percentagem do stock no final do período anterior · ', { ref: '2025' }],
      en: ['Percentage of the stock at the end of the previous period · ', { ref: '2025' }],
    },
    /* nota: «… 14%.» */
    limiar: { nl: '14', lado: 'superior', simbolo: '%' },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'saldo-da-balanca-corrente-2025',
    quadro: 'pdm',
    nome: { pt: 'Saldo da balança corrente', en: 'Current account balance' },
    medida: {
      pt: ['Percentagem do PIB, média de três anos · ', { ref: '2025' }],
      en: ['Percentage of GDP, three-year average · ', { ref: '2025' }],
    },
    /* nota: «… -4/+6%.» É uma BANDA, e é a nota que a declara com os dois
       lados: o défice não passa de 4% e o excedente não passa de 6%. */
    limiar: {
      inferior: { nl: '4', sinal: '−' },
      superior: { nl: '6', sinal: '+' },
      simbolo: '%',
    },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'taxa-de-actividade-2025',
    quadro: 'pdm',
    nome: { pt: 'Taxa de atividade', en: 'Activity rate' },
    medida: {
      pt: ['Variação em três anos, em pontos percentuais · ', { ref: '2025' }],
      en: ['Three-year change, in percentage points · ', { ref: '2025' }],
    },
    /* nota: «… -0.2pp.» A nota escreve o limiar por extenso e não truncado, e é
       dela que o algarismo sai: −0,2, com o símbolo «pp» que ela usa e que não
       é o «%» das outras doze. */
    limiar: { nl: '0,2', sinal: '−', lado: 'inferior', simbolo: ' pp' },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'taxa-de-cambio-efectiva-real-2025',
    quadro: 'pdm',
    nome: { pt: 'Taxa de câmbio efetiva real', en: 'Real effective exchange rate' },
    medida: {
      pt: ['Variação em três anos · ', { ref: '2025' }],
      en: ['Three-year change · ', { ref: '2025' }],
    },
    /* nota: «… +/-3% (EA).» É uma BANDA simétrica, escrita com os dois lados. */
    limiar: {
      inferior: { nl: '3', sinal: '−' },
      superior: { nl: '3', sinal: '+' },
      simbolo: '%',
    },
    limiarFixadoPor: 'comissao',
  },
  {
    claim: 'taxa-de-desemprego-mip-2025',
    quadro: 'pdm',
    nome: { pt: 'Taxa de desemprego', en: 'Unemployment rate' },
    medida: {
      pt: ['Percentagem da população ativa · ', { ref: '2025' }],
      en: ['Percentage of the labour force · ', { ref: '2025' }],
    },
    /* nota: «… 10%.» */
    limiar: { nl: '10', lado: 'superior', simbolo: '%' },
    limiarFixadoPor: 'comissao',
  },
];

/**
 * O PAINEL SOCIAL EUROPEU (Emenda 16).
 *
 * Sem limiar, e por isso sem cor: o Painel Social classifica um Estado-Membro
 * pela sua posição na distribuição do ano, e uma posição não é um limiar
 * (Emenda 1, e `convergence.md` §5, que o escreve por extenso: «Thresholds:
 * published, numeric, legally grounded (MIP) | None fixed anywhere»).
 *
 * O campo `documento` de cada entrada diz a LINHA de
 * `ResearchHub/indicators/convergence.md` que coloca aquela linha neste painel,
 * na coluna «Social SB» do quadro da §2. É a única origem: nenhum ficheiro do
 * livro-razão nomeia o Painel Social Europeu.
 *
 * **`criancas-em-creche-2025` não entra**, e a ausência é a regra a funcionar e
 * não um esquecimento: o quadro do motor não tem linha nenhuma de cuidados
 * formais para a infância, e uma medida que o registo não coloca não é colocada
 * aqui. Tinha frase na primeira página da v2; a frase é retirada e a linha fica
 * atrás da porta do livro-razão, onde continua a ter página e selo.
 *
 * AS FRASES QUE FICAM SÃO AS QUE JÁ EXISTIAM (R1), aparadas pelo F0.9 de
 * 03.09.2026: cada oração que afirmava uma tendência, uma comparação contra um
 * valor que a página não tem, um valor de outro período ou uma atribuição sem
 * excerto saiu, e ficou a definição da medida. As razões estão por entrada.
 *
 * A RESSALVA DA SOBRECARGA DO CUSTO DA HABITAÇÃO FICA, e o nome da Comissão
 * sai de cima dela. O documento do motor (§3, «Where convergence is a trap»)
 * diz o que acontece sem a ressalva: «Published naked, it says Portuguese
 * housing is fine.» Uma lista que a deixasse cair publicaria um número que se lê
 * ao contrário, e é por isso que ela fica. O que não podia ficar era a
 * atribuição: a página nomeava quem advertiu e não trazia as palavras dele, e
 * uma atribuição prova-se com o excerto. Em F3.3 o excerto entra e o nome volta
 * com ele.
 *
 * As outras cinco entradas não trazem frase nenhuma, porque nunca tiveram uma.
 */
const LISTA_SOCIAL = [
  {
    claim: 'taxa-de-emprego-2025',
    quadro: 'social',
    documento: 'convergence.md:60 · «Employment rate | aux | ✓ | …»',
    nome: { pt: 'Taxa de emprego', en: 'Employment rate' },
    medida: {
      pt: ['Percentagem da população dos ', { nl: '20', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '64', motivo: 'escala-de-instrumento' }, ' anos · ', { ref: '2025' }],
      en: ['Percentage of the population aged ', { nl: '20', motivo: 'escala-de-instrumento' }, ' to ', { nl: '64', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2025' }],
    },
  },
  {
    claim: 'taxa-de-desemprego-2025',
    quadro: 'social',
    documento: 'convergence.md:59 · «Unemployment rate | 10% | ✓ | …»',
    nome: { pt: 'Taxa de desemprego', en: 'Unemployment rate' },
    medida: {
      pt: ['Percentagem da população ativa · ', { ref: '2025' }],
      en: ['Percentage of the labour force · ', { ref: '2025' }],
    },
  },
  {
    claim: 'desemprego-de-longa-duracao-2025',
    quadro: 'social',
    documento: 'convergence.md:61 · «Long-term unemployment | aux | ✓ | …»',
    nome: { pt: 'Desemprego de longa duração', en: 'Long-term unemployment' },
    medida: {
      pt: ['Percentagem da população ativa · ', { ref: '2025' }],
      en: ['Percentage of the labour force · ', { ref: '2025' }],
    },
  },
  {
    claim: 'jovens-nem-2025',
    quadro: 'social',
    documento: 'convergence.md:73 · «NEET | aux | ✓ | …»',
    nome: { pt: 'Jovens sem emprego, escola ou formação', en: 'Young people not in employment, education or training' },
    medida: {
      pt: ['Percentagem da população · ', { ref: '2025' }],
      en: ['Percentage of the population · ', { ref: '2025' }],
    },
  },
  {
    claim: 'abandono-escolar-precoce-2025',
    quadro: 'social',
    documento: 'convergence.md:74 · «Early leavers from education | ✓ | …»',
    nome: { pt: 'Abandono escolar precoce', en: 'Early school leaving' },
    medida: {
      pt: ['Percentagem dos ', { nl: '18', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '24', motivo: 'escala-de-instrumento' }, ' anos · ', { ref: '2025' }],
      en: ['Percentage of those aged ', { nl: '18', motivo: 'escala-de-instrumento' }, ' to ', { nl: '24', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2025' }],
    },
  },
  {
    claim: 'risco-de-pobreza-ou-exclusao-2025',
    quadro: 'social',
    documento: 'convergence.md:72 · «At-risk-of-poverty or social exclusion | aux | ✓ | …»',
    nome: { pt: 'Risco de pobreza ou exclusão social', en: 'At risk of poverty or social exclusion' },
    medida: {
      pt: ['Percentagem da população · ', { ref: '2025' }],
      en: ['Percentage of the population · ', { ref: '2025' }],
    },
  },
  {
    claim: 'racio-s80-s20-2025',
    quadro: 'social',
    documento: 'convergence.md:71 · «Income inequality (S80/S20 or Gini) | ✓ | …»',
    nome: { pt: 'Desigualdade de rendimento', en: 'Income inequality' },
    medida: {
      pt: ['Rácio entre o quinto mais rico e o quinto mais pobre · ', { ref: '2025' }],
      en: ['Ratio of the richest fifth to the poorest fifth · ', { ref: '2025' }],
    },
  },
  {
    claim: 'sobrecarga-do-custo-da-habitacao-2025',
    quadro: 'social',
    documento: 'convergence.md:70 · «Housing cost overburden / affordability | ✓ | …»',
    nome: { pt: 'Sobrecarga do custo da habitação', en: 'Housing cost overburden' },
    medida: {
      pt: ['Percentagem da população · ', { ref: '2025' }],
      en: ['Percentage of the population · ', { ref: '2025' }],
    },
  },
];

/**
 * As duas listas numa só, para quem precisa de percorrer o painel inteiro.
 * A ordem é a das duas listas, e não uma terceira.
 */

/**
 * ===========================================================================
 * AS DEFINIÇÕES: O QUE CADA PAINEL É, E O QUE CADA UMA DAS 21 MEDIDAS MEDE
 * ===========================================================================
 *
 * O item 8.4 do brief F1.10, do que o diretor viu a 07.09 à noite: os dois
 * painéis europeus «it's not easy to understand what they are». E o item 8.14:
 * cada leitura abre com «uma frase de definição da medida em palavras simples,
 * tirada da descrição da própria Comissão e citada, antes do valor e do limiar,
 * porque nomes como "jovens NEM" ou "rácio S80/S20" não se entendem sem ela».
 *
 * ---------------------------------------------------------------------------
 * A REGRA DESTE BLOCO, E É A ÚNICA
 * ---------------------------------------------------------------------------
 * **Nenhuma destas frases foi escrita de cabeça.** Cada uma diz o que uma
 * descrição da Comissão Europeia ou do Eurostat diz, e mais nada; a descrição
 * está aqui ao lado, palavra por palavra, com o documento, o endereço e a data
 * em que foi lido. Onde a fonte publica só o rótulo da medida e não uma
 * explicação, a definição é esse rótulo e não cresce por conta da casa: a
 * entrada di-lo, e o relatório do bloco nomeia as que ficaram assim.
 *
 * **Nenhuma delas fala da casa** (§9.3 do brief, sobre a leitura cruzada do
 * inventário de 08.09): a definição diz o que o painel é e o que os números
 * querem dizer, e cita a Comissão como FONTE DA DEFINIÇÃO, nunca como
 * testemunha do trabalho desta casa. As duas frases de contexto que diziam
 * «confirmados contra o Relatório por País» saíram por causa disso.
 *
 * **Nenhuma delas leva um algarismo sem marca.** Onde a descrição da fonte traz
 * um número (o limiar, o número de parceiros comerciais, a percentagem de
 * rendimento da sobrecarga), ou ele fica fora da frase, ou entra com a marca de
 * escala de instrumento que as outras frases desta lista já usam.
 *
 * ---------------------------------------------------------------------------
 * AS ORIGENS
 * ---------------------------------------------------------------------------
 * Três famílias, e as três são documentação do publicador e não uma fonte do
 * corredor: a página da Comissão sobre o painel do Procedimento, as páginas do
 * Eurostat sobre o Pilar e sobre cada conceito (Statistics Explained), e a
 * página do Banco de Portugal que explica a posição de investimento
 * internacional, que é a estatística que o Banco compila para Portugal. O
 * brief autoriza lê-las pela rede por serem isso mesmo.
 *
 * A TERCEIRA FAMÍLIA ENTROU A 08.09.2026, e a razão escreve-se. A quarta
 * sessão do bloco fechou sem definição para a posição de investimento
 * internacional, porque a página da Comissão sobre o painel publica só o
 * rótulo e o Eurostat não tem glossário para o conceito. O lugar de direção
 * alargou as origens autorizadas, por esta ordem de preferência, ao compilador
 * nacional (o Banco de Portugal) e depois ao manual do FMI (BPM6) ou ao
 * glossário do BCE. O compilador nacional tem o texto, e é ele que fica.
 */
export const ORIGENS_DAS_DEFINICOES = /** @type {const} */ ({
  'painel-pdm': {
    publicador: 'Comissão Europeia',
    documento: 'Scoreboard · Macroeconomic Imbalance Procedure',
    url: 'https://economy-finance.ec.europa.eu/economic-and-fiscal-governance/macroeconomic-imbalance-procedure/scoreboard_en',
    lido: '2026-09-08',
    excerto:
      'The analysis in the alert mechanism report (AMR) builds on the economic reading of a scoreboard of 13 headline indicators covering the most relevant areas of macroeconomic imbalances, competitiveness, and adjustment issues. … The scoreboard is designed to capture the most relevant internal and external aspects of macroeconomic imbalances through a limited set of relevant indicators of high statistical quality. … The headline indicators consist of the following 13 indicators and indicative thresholds, covering the major sources of macroeconomic imbalances:',
  },
  'pilar-social': {
    publicador: 'Eurostat',
    documento: 'European pillar of social rights · Information on data',
    url: 'https://ec.europa.eu/eurostat/web/european-pillar-of-social-rights/information-data',
    lido: '2026-09-08',
    excerto:
      'The Pillar is supported by a ‘scoreboard’ of key indicators which is used to assess the employment and social performances of participating EU countries. This scoreboard serves as a reference framework to monitor societal progress and quickly identify significant employment and social challenges, as well as long-term progress.',
  },
  'glossario-hpi': {
    publicador: 'Eurostat',
    documento: 'Statistics Explained · Glossary: House price index (HPI)',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:House_price_index_(HPI)',
    lido: '2026-09-08',
    excerto:
      'The house price index, abbreviated as HPI, is an index that measures the changes in the transaction prices of dwellings purchased by households.',
  },
  'glossario-atividade': {
    publicador: 'Eurostat',
    documento: 'Statistics Explained · Glossary: Activity rate',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Activity_rate',
    lido: '2026-09-08',
    excerto:
      'Activity rate is the percentage of active persons in relation to the comparable total population. The economically active population comprises employed and unemployed persons.',
  },
  'glossario-emprego': {
    publicador: 'Eurostat',
    documento: 'Statistics Explained · Glossary: Employment rate',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Employment_rate',
    lido: '2026-09-08',
    excerto:
      'The employment rate is the percentage of employed persons in relation to the comparable total population.',
  },
  'glossario-desemprego': {
    publicador: 'Eurostat',
    documento: 'Statistics Explained · Glossary: Unemployment',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Unemployment_rate',
    lido: '2026-09-08',
    excerto:
      'The unemployment rate is the number of people unemployed as a percentage of the labour force.',
  },
  'glossario-longa-duracao': {
    publicador: 'Eurostat',
    documento: 'Statistics Explained · Glossary: Long-term unemployment',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Long-term_unemployment',
    lido: '2026-09-08',
    excerto:
      'Long-term unemployment refers to the number of people who are out of work and have been actively seeking employment for at least a year.',
  },
  'glossario-nem': {
    publicador: 'Eurostat',
    documento:
      'Statistics Explained · Glossary: Young people neither in employment nor in education and training (NEET)',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Young_people_neither_in_employment_nor_in_education_and_training_(NEET)',
    lido: '2026-09-08',
    excerto:
      'The indicator young people neither in employment nor in education and training, abbreviated as NEET, corresponds to the percentage of the population of a given age group and sex who is not employed and not involved in further education or training.',
  },
  'glossario-abandono': {
    publicador: 'Eurostat',
    documento: 'Statistics Explained · Glossary: Early leaver from education and training',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Early_leaver_from_education_and_training',
    lido: '2026-09-08',
    excerto:
      'Early leaver from education and training, previously named early school leaver, refers to a person aged 18 to 24 who has completed at most lower secondary education and is not involved in further education or training.',
  },
  'glossario-arope': {
    publicador: 'Eurostat',
    documento: 'Statistics Explained · Glossary: At risk of poverty or social exclusion (AROPE)',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:At_risk_of_poverty_or_social_exclusion_(AROPE)',
    lido: '2026-09-08',
    excerto:
      'At risk of poverty or social exclusion, abbreviated as AROPE, corresponds to the sum of persons who are either at risk of poverty, or severely materially and socially deprived or living in a household with a very low work intensity - (quasi-)jobless households. People are included only once even if they are in more than one of the situations mentioned above. The AROPE rate is the share of the total population which is at risk of poverty or social exclusion.',
  },
  'glossario-s80s20': {
    publicador: 'Eurostat',
    documento: 'Statistics Explained · Glossary: Income quintile share ratio',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Income_quintile_share_ratio',
    lido: '2026-09-08',
    excerto:
      'The income quintile share ratio or the S80/S20 ratio is a measure of the inequality of income distribution. It is calculated as the ratio of total income received by the 20 % of the population with the highest income (the top quintile) to that received by the 20 % of the population with the lowest income (the bottom quintile).',
  },
  'glossario-sobrecarga': {
    publicador: 'Eurostat',
    documento: 'Statistics Explained · Glossary: Housing cost overburden rate',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Housing_cost_overburden_rate',
    lido: '2026-09-08',
    excerto:
      "The housing cost overburden rate is the percentage of the population living in households where the total housing costs ('net' of housing allowances) represent more than 40 % of disposable income ('net' of housing allowances).",
  },
  'bdp-pii': {
    publicador: 'Banco de Portugal',
    documento: 'BPstat · O que é a posição de investimento internacional (PII)?',
    url: 'https://bpstat.bportugal.pt/conteudos/paginas/940',
    lido: '2026-09-08',
    excerto:
      'A posição de investimento internacional, também conhecida por PII, apresenta o saldo entre os ativos financeiros e os passivos que os residentes de uma economia têm relativamente ao resto do mundo. … A diferença entre os ativos financeiros e os passivos corresponde ao valor líquido da posição de investimento internacional.',
    excertoEn:
      'The international investment position, also known as IIP, represents the difference between financial assets and liabilities that residents of an economy have vis-à-vis the rest of the world. … The difference between the value of these assets and liabilities corresponds to the net value of the international investment position.',
  },
});

/**
 * A DEFINIÇÃO DE CADA PAINEL, e o nome curto que passa a encabeçá-lo.
 *
 * O item 8.4 manda «o nome oficial a ficar como subtítulo»: o cabeçalho passa a
 * dizer, em palavras simples, o que aquilo é, e o nome oficial com a contagem
 * das medidas fica na linha de baixo, onde continua a levar a chave da prova que
 * o portão reconta. A frase de contexto do F1.1 sai e esta entra no lugar dela
 * (§9.3), sem uma palavra sobre o que a casa conferiu.
 */
export const DEFINICAO_DOS_PAINEIS = /** @type {const} */ ({
  pdm: {
    origens: ['painel-pdm'],
    titulo: {
      pt: 'O painel dos desequilíbrios da economia',
      en: 'The scoreboard of macroeconomic imbalances',
    },
    pt: [
      'Um conjunto limitado de medidas com que a Comissão Europeia apanha os aspetos internos e externos mais relevantes dos desequilíbrios macroeconómicos, cada uma com o seu limiar indicativo.',
    ],
    en: [
      'A limited set of measures with which the European Commission captures the most relevant internal and external aspects of macroeconomic imbalances, each with its indicative threshold.',
    ],
  },
  social: {
    origens: ['pilar-social'],
    titulo: {
      pt: 'O painel do emprego e das condições sociais',
      en: 'The employment and social conditions scoreboard',
    },
    pt: [
      'O painel de medidas que apoia o Pilar Europeu dos Direitos Sociais, e com que se avalia o desempenho de emprego e social dos países da União.',
    ],
    en: [
      'The scoreboard of key measures that supports the European Pillar of Social Rights, used to assess the employment and social performance of EU countries.',
    ],
  },
});

/**
 * A DEFINIÇÃO DE CADA UMA DAS 21 MEDIDAS, com a origem de cada uma.
 *
 * A ordem é a das duas listas. Cada entrada diz de que origem a frase saiu; o
 * excerto literal dessa origem está em `ORIGENS_DAS_DEFINICOES`, acima. Onde a
 * frase junta duas origens (o conceito num glossário do Eurostat e o recorte que
 * o painel usa), as duas estão declaradas, pela ordem em que a frase as usa.
 *
 * **NENHUMA ENTRADA DIZ SÓ O RÓTULO.** A da posição de investimento
 * internacional esteve assim durante a quarta sessão do bloco, e deixou de
 * estar a 08.09.2026: a página do painel publica «net international investment
 * position as percent of GDP» e mais nada, e o Eurostat não tem página de
 * glossário para o conceito (procurado em
 * `Glossary:Net_international_investment_position`, `…_(NIIP)` e
 * `Glossary:International_investment_position_(IIP)`: as três respondem «Page
 * not found»). O lugar de direção alargou as origens ao compilador nacional, e
 * o Banco de Portugal, que compila a posição de investimento internacional de
 * Portugal, publica uma página que a explica nas duas línguas: é dela que a
 * frase sai agora, palavra por palavra, com o endereço e o excerto ao lado.
 */
const DEFINICOES_DAS_MEDIDAS = /** @type {const} */ ({
  'divida-publica-2025': {
    origens: ['painel-pdm'],
    pt: ['A dívida do setor das administrações públicas, em percentagem do PIB.'],
    en: ['General government sector debt, as a percentage of GDP.'],
  },
  'posicao-de-investimento-internacional-2025': {
    origens: ['bdp-pii'],
    pt: [
      'A diferença entre os ativos financeiros e os passivos que os residentes de uma economia têm relativamente ao resto do mundo, em percentagem do PIB.',
    ],
    en: [
      'The difference between the financial assets and liabilities that residents of an economy have vis-à-vis the rest of the world, as a percentage of GDP.',
    ],
  },
  'custo-unitario-do-trabalho-2025': {
    origens: ['painel-pdm'],
    pt: [
      'O índice do custo nominal do trabalho por unidade produzida, por hora trabalhada, e quanto ele mudou em três anos.',
    ],
    en: [
      'The nominal unit labour cost index, per hour worked, and how much it changed over three years.',
    ],
  },
  'precos-da-habitacao-2025': {
    origens: ['glossario-hpi'],
    pt: [
      'O índice que mede a variação dos preços de transação das casas compradas pelas famílias.',
    ],
    en: [
      'The index that measures the changes in the transaction prices of dwellings purchased by households.',
    ],
  },
  'desempenho-das-exportacoes-2025': {
    origens: ['painel-pdm'],
    pt: [
      'A quota do país nas exportações das economias avançadas, e quanto ela mudou em três anos.',
    ],
    en: [
      'The country’s share of the exports of advanced economies, and how much it changed over three years.',
    ],
  },
  'divida-das-empresas-2025': {
    origens: ['painel-pdm'],
    pt: ['A dívida consolidada das sociedades não financeiras, em percentagem do PIB.'],
    en: ['Non-financial corporations’ consolidated debt, as a percentage of GDP.'],
  },
  'divida-das-familias-2025': {
    origens: ['painel-pdm'],
    pt: [
      'A dívida consolidada das famílias, incluindo as instituições sem fim lucrativo ao serviço delas, em percentagem do PIB.',
    ],
    en: [
      'Household consolidated debt, including non-profit institutions serving households, as a percentage of GDP.',
    ],
  },
  'fluxo-de-credito-as-empresas-2025': {
    origens: ['painel-pdm'],
    pt: [
      'O crédito novo às sociedades não financeiras no ano, sem o investimento direto estrangeiro, em percentagem da dívida que elas tinham no fim do ano anterior.',
    ],
    en: [
      'The consolidated credit flow to non-financial corporations in the year, excluding foreign direct investment, as a percentage of their debt stock at the end of the previous year.',
    ],
  },
  'fluxo-de-credito-as-familias-2025': {
    origens: ['painel-pdm'],
    pt: [
      'O crédito novo às famílias no ano, em percentagem da dívida que elas tinham no fim do ano anterior.',
    ],
    en: [
      'The consolidated credit flow to households in the year, as a percentage of their debt stock at the end of the previous year.',
    ],
  },
  'saldo-da-balanca-corrente-2025': {
    origens: ['painel-pdm'],
    pt: ['O saldo da balança corrente em percentagem do PIB, na média dos três anos anteriores.'],
    en: [
      'The current account balance as a percentage of GDP, on a three-year backward moving average.',
    ],
  },
  'taxa-de-actividade-2025': {
    origens: ['glossario-atividade', 'painel-pdm'],
    pt: [
      'A percentagem de pessoas ativas, empregadas ou desempregadas, na população comparável, e quanto ela mudou em três anos.',
    ],
    en: [
      'The percentage of active persons, employed or unemployed, in the comparable total population, and how much it changed over three years.',
    ],
  },
  'taxa-de-cambio-efectiva-real-2025': {
    origens: ['painel-pdm'],
    pt: [
      'A taxa de câmbio efetiva real face às moedas dos outros países industriais, com base nos deflatores dos preços no consumidor, e quanto ela mudou em três anos.',
    ],
    en: [
      'The real effective exchange rate against the currencies of other industrial countries, based on HICP/CPI deflators, and how much it changed over three years.',
    ],
  },
  'taxa-de-desemprego-mip-2025': {
    origens: ['glossario-desemprego'],
    pt: ['O número de pessoas sem emprego, em percentagem da população ativa.'],
    en: ['The number of people unemployed, as a percentage of the labour force.'],
  },
  'taxa-de-emprego-2025': {
    origens: ['glossario-emprego'],
    pt: ['A percentagem de pessoas com emprego na população comparável.'],
    en: ['The percentage of employed persons in relation to the comparable total population.'],
  },
  'taxa-de-desemprego-2025': {
    origens: ['glossario-desemprego'],
    pt: ['O número de pessoas sem emprego, em percentagem da população ativa.'],
    en: ['The number of people unemployed, as a percentage of the labour force.'],
  },
  'desemprego-de-longa-duracao-2025': {
    origens: ['glossario-longa-duracao'],
    pt: ['As pessoas sem trabalho que procuram emprego ativamente há pelo menos um ano.'],
    en: ['People who are out of work and have been actively seeking employment for at least a year.'],
  },
  'jovens-nem-2025': {
    origens: ['glossario-nem'],
    pt: [
      'A percentagem das pessoas de um grupo de idades que não tem emprego e não está em estudos nem em formação.',
    ],
    en: [
      'The percentage of the population of a given age group who is not employed and not involved in further education or training.',
    ],
  },
  'abandono-escolar-precoce-2025': {
    origens: ['glossario-abandono'],
    pt: [
      'As pessoas dos ',
      { nl: '18', motivo: 'escala-de-instrumento' },
      ' aos ',
      { nl: '24', motivo: 'escala-de-instrumento' },
      ' anos que completaram no máximo o ensino básico e não estão em estudos nem em formação.',
    ],
    en: [
      'People aged ',
      { nl: '18', motivo: 'escala-de-instrumento' },
      ' to ',
      { nl: '24', motivo: 'escala-de-instrumento' },
      ' who have completed at most lower secondary education and are not involved in further education or training.',
    ],
  },
  'risco-de-pobreza-ou-exclusao-2025': {
    origens: ['glossario-arope'],
    pt: [
      'A parte da população que está em risco de pobreza, ou em privação material e social grave, ou a viver num agregado com intensidade de trabalho muito baixa; quem está em mais do que uma destas situações conta uma vez só.',
    ],
    en: [
      'The share of the total population who are either at risk of poverty, or severely materially and socially deprived, or living in a household with a very low work intensity; people are counted only once even if they are in more than one of these situations.',
    ],
  },
  'racio-s80-s20-2025': {
    origens: ['glossario-s80s20'],
    pt: [
      'Uma medida da desigualdade na distribuição do rendimento: o rendimento total do quinto da população com mais rendimento a dividir pelo do quinto com menos.',
    ],
    en: [
      'A measure of the inequality of income distribution: the total income of the fifth of the population with the highest income divided by that of the fifth with the lowest.',
    ],
  },
  'sobrecarga-do-custo-da-habitacao-2025': {
    origens: ['glossario-sobrecarga'],
    pt: [
      'A percentagem da população que vive em agregados onde o custo total da habitação leva mais de ',
      { nl: '40', motivo: 'escala-de-instrumento' },
      '% do rendimento disponível.',
    ],
    en: [
      'The percentage of the population living in households where total housing costs take more than ',
      { nl: '40', motivo: 'escala-de-instrumento' },
      '% of disposable income.',
    ],
  },
});

/**
 * O GUARDA: uma medida sem definição não se rende, e uma definição sem origem
 * declarada também não. É o mesmo desenho do `fixadorDoLimiar()`: a construção
 * fecha em vez de a página sair com uma medida sem dizer o que ela é.
 *
 * @template {{ claim: string }} T
 * @param {T} f
 */
const comDefinicao = (f) => {
  const d = /** @type {Record<string, { origens: readonly string[] }>} */ (
    DEFINICOES_DAS_MEDIDAS
  )[f.claim];
  if (!d) {
    throw new Error(
      `figuras: a medida "${f.claim}" não tem definição declarada. Acrescenta-a a ` +
        `\`DEFINICOES_DAS_MEDIDAS\`, com a origem e o excerto literal em ` +
        `\`ORIGENS_DAS_DEFINICOES\`. Nunca se inventa: onde a fonte só publica o ` +
        `rótulo, a definição é o rótulo e a entrada di-lo (item 8.4 do F1.10).`,
    );
  }
  for (const chave of d.origens) {
    if (!(chave in ORIGENS_DAS_DEFINICOES)) {
      throw new Error(
        `figuras: a definição de "${f.claim}" diz vir de "${chave}", que não está ` +
          `em \`ORIGENS_DAS_DEFINICOES\`.`,
      );
    }
  }
  return { ...f, definicao: d };
};

export const FIGURAS_PDM = LISTA_PDM.map(comDefinicao);
export const FIGURAS_SOCIAL = LISTA_SOCIAL.map(comDefinicao);

export const FIGURAS = [...FIGURAS_PDM, ...FIGURAS_SOCIAL];

/**
 * OS DOIS LADOS DE UM LIMIAR, seja ele um teto, um chão ou uma banda.
 *
 * Uma função só, para que a peça, a régua, a prova e o portão leiam a mesma
 * declaração da mesma maneira. Devolve `{ inferior, superior }` como cadeias
 * prontas a passar por `parsePtNumber()`, ou `null` onde não há lado nenhum.
 * Não devolve um algarismo para a página: devolve o que a nota já escreveu.
 *
 * @param {Limiar | null | undefined} limiar
 * @returns {{ inferior: string | null, superior: string | null } | null}
 */
export function ladosDoLimiar(limiar) {
  if (!limiar) return null;
  /** @param {LadoDoLimiar | undefined} l */
  const escreve = (l) => (l ? `${l.sinal === '−' ? '−' : ''}${l.nl}` : null);
  if (limiar.inferior || limiar.superior) {
    return { inferior: escreve(limiar.inferior), superior: escreve(limiar.superior) };
  }
  const um = `${limiar.sinal ?? ''}${limiar.nl}`;
  if (limiar.lado === 'superior') return { inferior: null, superior: um };
  if (limiar.lado === 'inferior') return { inferior: um, superior: null };
  return null;
}

/**
 * A palavra que compara o valor da linha com o limiar do quadro.
 *
 * PROSA DA CASA, GERADA DE DOIS NÚMEROS QUE JÁ EXISTEM. Não devolve nenhum
 * algarismo: devolve `'acima'`, `'abaixo'` ou `'noLimiar'`, e é o gabarito que
 * escolhe a palavra da edição. Uma distância seria um número novo, sem linha e
 * sem selo, e a §11 da identidade recusa-a: o desenho de distância vive na
 * régua, onde há uma escala escrita.
 *
 * CONSCIENTE DO SINAL. O limiar da posição de investimento é −35 e o valor é
 * −50,2: a comparação é entre números com sinal, e a resposta é «abaixo». Uma
 * comparação sobre o módulo diria «acima» e estaria errada.
 *
 * NUMA BANDA, A PALAVRA SÓ EXISTE QUANDO O VALOR SAIU DELA (etapa 2l). O saldo
 * da balança corrente tem uma banda de −4 a +6: um valor lá dentro não está
 * «acima» nem «abaixo» de coisa nenhuma, e escolher uma das duas pontas para o
 * comparar seria a casa a decidir qual das metades da banda conta. Devolve
 * `null`, e um `null` não se rende: fica a linha do limiar sem palavra de
 * direcção, e o estado continua a dizer-se por extenso ao lado do marcador.
 *
 * Devolve `null` quando um dos dois lados não é um número simples. Um `null`
 * não se rende: a célula fica sem a palavra, e não com uma palavra inventada.
 *
 * @param {Linha | null | undefined} claim
 * @param {Limiar | null | undefined} limiar
 * @returns {'acima' | 'abaixo' | 'noLimiar' | null}
 */
export function comparacaoComOLimiar(claim, limiar) {
  if (!limiar) return null;
  const valor = parsePtNumber(claim?.value);
  if (valor === null) return null;
  const lados = ladosDoLimiar(limiar);
  if (!lados) return null;
  const inf = lados.inferior === null ? null : parsePtNumber(lados.inferior);
  const sup = lados.superior === null ? null : parsePtNumber(lados.superior);

  /* Banda: só há palavra fora dela. */
  if (inf !== null && sup !== null) {
    if (valor > sup) return 'acima';
    if (valor < inf) return 'abaixo';
    return null;
  }
  const alvo = inf !== null ? inf : sup;
  if (alvo === null) return null;
  if (valor > alvo) return 'acima';
  if (valor < alvo) return 'abaixo';
  return 'noLimiar';
}

/**
 * ===========================================================================
 * QUEM FIXOU O LIMIAR (F1.10, item 8.5, 08.09.2026)
 * ===========================================================================
 *
 * O diretor, a 07.09 à noite, sobre a palavra «limiar»: «doesn't really reflect
 * exactly what they mean». A decisão (2) da emenda de 07.09 à §1.101, tomada
 * pelo lugar de direção pela delegação da §1.98: a palavra fica, porque é a que
 * a Comissão e o INE usam, mas **nunca aparece sozinha** — o cartão diz em
 * palavras de que lado dela o valor está E de quem ela é, e a leitura diz numa
 * frase o que o limiar é e quem o fixou.
 *
 * ---------------------------------------------------------------------------
 * PORQUE É UM CAMPO DECLARADO, E NÃO UMA TROCA DE DUAS CADEIAS
 * ---------------------------------------------------------------------------
 * «dentro do limiar» e «fora do limiar» serviam, com as mesmas duas cadeias,
 * medidas de limiares de origens diferentes: os dois quadros da União, o
 * domínio, e o ÍNDICE DE DÍVIDA de uma câmara, cujo limiar é o limite que a lei
 * portuguesa fixa e não é da Comissão. Uma troca de cadeias teria posto «limiar
 * da Comissão» debaixo de 616 páginas de concelho onde a Comissão não tem nada
 * que ver com o número.
 *
 * Por isso o qualificador vem de QUEM FIXOU o limiar daquela medida, que é um
 * campo da declaração, ao lado do `lado` e do `simbolo`, e é **declarado e nunca
 * inferido** pela mesma razão que o `lado`: uma regra que lesse «é do painel,
 * logo é da Comissão» acertaria hoje e erraria no primeiro limiar que o painel
 * ganhasse de outra origem.
 *
 * ---------------------------------------------------------------------------
 * A LISTA É FECHADA, E CADA VALOR TRAZ A ORIGEM
 * ---------------------------------------------------------------------------
 * `comissao`   as treze medidas do painel do Procedimento e a E3 do domínio, que
 *              é a mesma linha. A origem está em dois sítios do repositório e
 *              não numa frase escrita aqui: o campo `note` de cada uma das treze
 *              linhas abre «Limiar do Procedimento relativo aos Desequilíbrios
 *              Macroeconómicos: <n>», e o motivo `limiar-do-quadro` de
 *              `ledger/allowlist.yml` — que é a dispensa registada com que estes
 *              algarismos entram na página — escreve, palavra por palavra,
 *              «fixado no Regulamento (UE) n.º 1176/2011 e revisto pela
 *              Comissão». É por causa dessa segunda metade que a frase da
 *              leitura diz «fixado no regulamento que criou o Procedimento e
 *              revisto pela Comissão Europeia» e não «fixado pela Comissão»: o
 *              registo distingue quem fixou de quem revê, e a página também.
 *
 * `lei`        o limite de dívida total de um município. A origem é a linha
 *              `indice-de-divida-limite-legal`, cujo localizador cita o quadro
 *              «LIMITE À DÍVIDA TOTAL — LEI 73/2013 (ART. 52º)» e cuja
 *              derivação, nas 308 linhas do índice, escreve «art. 52.º da Lei
 *              n.º 73/2013». A página do concelho já rende a frase que diz o que
 *              o limite é e quem o fixou (`s.municipio.distanciaLeiAntes` e as
 *              duas peças seguintes), e por isso a leitura de uma medida com
 *              este fixador não escreve uma segunda: o §0 do brief manda uma
 *              coisa num lugar só.
 *
 * `pacto`      o limite de défice do saldo das administrações públicas (E2). A
 *              origem é a que a `note` da própria linha nomeia: «O limiar de 3 %
 *              do PIB não está nesta resposta: está na página Statistics
 *              Explained do Eurostat, alojada neste estudo, e não tem linha
 *              própria». Essa página é `source/eurostat/statistics-explained-
 *              government-finance-statistics.html` do estudo `13 Dominios` do
 *              motor, alojada com o sha256 dos seus bytes em
 *              `source/MANIFEST.sha256`, e diz, palavra por palavra: «Under the
 *              terms of the EU's Stability and Growth Pact (SGP), Member States
 *              pledged to keep their deficits and debt below certain limits: a
 *              Member State's government deficit may not exceed 3% of its gross
 *              domestic product (GDP), while its debt may not exceed 60% of
 *              GDP.» O documento diz de onde o limite é (o Pacto) e não nomeia
 *              um corpo que o tenha fixado, e a página escreve o que ele diz e
 *              nada mais. **O Protocolo n.º 12, que é onde o limiar está em
 *              direito, continua por ler**: o EUR-Lex devolveu 202 com corpo
 *              vazio ao verificador de 01.09.2026, e por isso não é ele que a
 *              página cita.
 *
 * `conselho`   a taxa de crescimento da despesa líquida (E4). A origem é o
 *              MESMO documento que a linha cita, o Parecer n.º 02/2026 do
 *              Conselho das Finanças Públicas: a linha lê o excerto na p. 9 do
 *              PDF («superando em 1,4 p.p. a taxa de crescimento de 5%
 *              recomendada»), e a p. 6 do mesmo PDF diz quem a recomendou,
 *              palavra por palavra: «Nesse documento comprometeu-se com uma
 *              determinada trajetória de crescimento da despesa líquida, que
 *              depois foi aprovada pelo Conselho da UE, passando a ser a
 *              trajetória assumida nos termos da Recomendação do Conselho da
 *              União Europeia de janeiro de 2025.» A p. 9 repete a atribuição na
 *              frase do próprio excerto: «a taxa de crescimento em 2025 foi
 *              superior à prevista no compromisso assumido por Portugal e
 *              endossado pelo Conselho da UE».
 *
 * **`porRegistar` SAIU DA LISTA A 08.09.2026, E A RAZÃO ESCREVE-SE.** Era o par
 * honesto das duas medidas acima enquanto ninguém tinha lido os documentos que
 * as linhas citam. A decisão do lugar de direção do fecho do dia (§1.102): o
 * fixador vem do documento que a linha cita, e de mais lado nenhum; leram-se os
 * dois, e os dois dizem-no. Um valor sem utilizador numa lista fechada é uma
 * porta aberta para o próximo que não quiser procurar; volta com a origem ao
 * lado no dia em que uma medida tenha limiar publicado e um documento calado.
 *
 * O GUARDA ESTÁ EM `fixadorDoLimiar()`, e fecha a construção: uma medida com
 * limiar e sem fixador declarado não se rende, porque a alternativa é a palavra
 * «limiar» a voltar a aparecer sozinha sem que nada o diga.
 */
export const FIXADORES_DO_LIMIAR = /** @type {const} */ ([
  'comissao',
  'lei',
  'pacto',
  'conselho',
]);

/**
 * O fixador declarado de uma medida, ou `null` quando ela não tem limiar.
 *
 * NÃO DEVOLVE UMA PALAVRA. Devolve a chave, e é o gabarito que escolhe a cadeia
 * da edição em `s.estado`, como já faz com `'fora'`, `'dentro'` e `'sem'`: as
 * palavras vivem no inventário da voz e não num ficheiro de dados.
 *
 * OS DOIS NOMES DO MESMO CAMPO. Um limiar chama-se `limiar` nos dois quadros da
 * União e nas medidas do domínio, e chama-se `tecto` na medida do concelho, onde
 * a referência é uma LINHA do livro-razão e não um algarismo declarado. São a
 * mesma coisa para esta pergunta, e por isso o guarda olha para os dois: uma
 * medida com `tecto` e sem fixador fecha a construção como uma com `limiar`.
 *
 * @param {{ limiar?: unknown, tecto?: unknown, limiarFixadoPor?: unknown }} medida
 * @param {string} onde  o nome do sítio que declarou a medida, para o erro
 * @returns {'comissao'|'lei'|'pacto'|'conselho'|null}
 */
export function fixadorDoLimiar(medida, onde) {
  const fixador = medida?.limiarFixadoPor ?? null;
  const temLimiar = Boolean(medida?.limiar ?? medida?.tecto);
  if (fixador === null) {
    if (!temLimiar) return null;
    throw new Error(
      `${onde}: esta medida declara um limiar e não declara quem o fixou. ` +
        `Acrescenta \`limiarFixadoPor\`, com um dos valores fechados ` +
        `(${FIXADORES_DO_LIMIAR.join(', ')}) e a origem escrita ao lado. ` +
        `Sem ele o cartão escreveria «dentro do limiar» sem dizer de quem, que é ` +
        `o que o item 8.5 do F1.10 veio tirar da página.`,
    );
  }
  if (!FIXADORES_DO_LIMIAR.includes(/** @type {never} */ (fixador))) {
    throw new Error(
      `${onde}: "${String(fixador)}" não é um fixador de limiar declarado. ` +
        `A lista é fechada (${FIXADORES_DO_LIMIAR.join(', ')}) e cresce com a ` +
        `origem escrita ao lado, em src/data/figuras.mjs.`,
    );
  }
  return /** @type {'comissao'|'lei'|'pacto'|'conselho'} */ (fixador);
}

/**
 * ===========================================================================
 * AS DUAS FRASES DE CONTEXTO DOS PAINÉIS (F1.1, item 1, 03.09.2026)
 * ===========================================================================
 *
 * O achado C6 da auditoria de UX de 25.08.2026: «não se percebe porque estão
 * ali treze indicadores, depois um painel social de outra forma, depois mais;
 * "Procedimento dos Desequilíbrios Macroeconómicos" nunca explicado, "limiar
 * 60% · acima" sem dizer quem o fixou». A decisão 3.4 da mesma auditoria é a
 * forma A: uma frase por painel, do que ele é e de quem publica as medidas e os
 * limiares. A Emenda 15 proíbe o sítio de se explicar; não proíbe dizer o que a
 * coisa é.
 *
 * ---------------------------------------------------------------------------
 * DE ONDE VEM CADA AFIRMAÇÃO DAS DUAS FRASES
 * ---------------------------------------------------------------------------
 * A regra dura do brief: nada entra na frase que não esteja numa linha do
 * livro-razão ou numa decisão registada. Afirmação a afirmação, com o comando
 * que a confirma:
 *
 * **A SEGUNDA PASSAGEM APERTOU OS VERBOS** (03.09.2026, o Blocking 6 da leitura a
 * frio do Codex). A primeira redação dizia «com os limiares que o Procedimento
 * publica» e «que não publica limiares»: dois verbos que as linhas não sustentam.
 * Uma linha diz que o limiar É do Procedimento, não que o Procedimento o publica;
 * e a Emenda 16 diz que o Painel Social «não tem limiares», que é outra coisa de
 * «não publica limiares». Cada verbo passou a ser o das linhas ou o da emenda,
 * palavra por palavra, e o que não tinha origem saiu.
 *
 *   «do painel do Procedimento relativo aos Desequilíbrios Macroeconómicos»
 *     → o campo `note` das treze linhas, que abre «Limiar do Procedimento
 *       relativo aos Desequilíbrios Macroeconómicos: …».
 *       `grep -l "Limiar do Procedimento" ledger/claims/*.yml` → 13 ficheiros,
 *       que são exactamente os treze `claim` de `FIGURAS_PDM`.
 *
 *   «cada um com o limiar do Procedimento»
 *     → o mesmo campo `note`, que escreve o limiar de cada uma e diz de quem ele
 *       é: «Limiar do Procedimento relativo aos Desequilíbrios Macroeconómicos:
 *       60%». A frase diz o que a nota diz, e mais nada. **Quem PUBLICA o limiar
 *       não entra na frase**, e é a correção do Blocking 6: `ledger/allowlist.yml`
 *       explica o motivo `limiar-do-quadro` com «fixado no Regulamento (UE)
 *       n.º 1176/2011 e revisto pela Comissão», que não é «o Procedimento
 *       publica»; e a explicação de um motivo do registo não é uma linha nem uma
 *       decisão. Quem fixa e quem revê fica por dizer até haver linha ou decisão
 *       que o diga.
 *
 *   «Os valores são do Eurostat»
 *     → o campo `source` das 21 linhas: `Eurostat` nas treze e nas oito.
 *       Medido, e não presumido: `grep -h "^source:" ledger/claims/<as 21>.yml`
 *       devolve «Eurostat» vinte e uma vezes.
 *
 *   «confirmados contra o Relatório por País 2026 da Comissão Europeia,
 *   SWD(2026) 222»
 *     → o campo `note` das 21 linhas, que escreve «Valor confirmado contra a
 *       Comissão Europeia, SWD(2026) 222 (Relatório por País 2026 — Portugal):
 *       <o valor>». As 21 trazem-no. **A nota nomeia o SWD(2026) 222 COMO o
 *       Relatório por País**, e a primeira redação deixava isso de fora: dizia só
 *       «contra a Comissão Europeia», e o leitor não sabia contra o quê. As duas
 *       designações entram como transcrições conferidas
 *       (`data-verbatim`), e não como prosa da casa.
 *
 *   «os indicadores que o livro-razão guarda e cujo registo nomeia o Painel
 *   Social Europeu»
 *     → a **Emenda 16, palavra por palavra** (`design/especime-v3/direcao.md`,
 *       21.08.2026): «com os indicadores que o livro-razão guarda e cujo registo
 *       nomeia esse painel». O registo é `ResearchHub/indicators/convergence.md`
 *       §2, coluna «Social SB», e está escrito no cabeçalho de `FIGURAS_SOCIAL`.
 *
 *   «sem cor porque não tem limiares»
 *     → a **Emenda 16, palavra por palavra**, na forma em que a `DECISIONS.md`
 *       (§ das emendas, entrada 16) a regista: «O Painel Social Europeu entra
 *       como lista compacta por baixo, sem cor porque não tem limiares». É a
 *       razão pela qual os oito cartões não levam palavra de estado nem quadrado,
 *       dita com as palavras da decisão que o decidiu.
 *
 * ---------------------------------------------------------------------------
 * O QUE FICOU DE FORA, E PORQUÊ
 * ---------------------------------------------------------------------------
 * **«porquê estes oito», que o brief pedia**, não entra. A razão de estarem
 * ali é a coluna «Social SB» de um documento do motor, e a única coisa que ela
 * autoriza a dizer é que o quadro os coloca lá; dizer mais seria a casa a
 * explicar uma escolha que não é dela. O relatório do bloco escreve esta
 * lacuna, como o brief manda.
 *
 * **A posição face à média da União** não entra, e a segunda passagem confirmou-o
 * por dois caminhos. O primeiro é o do F0.9: nenhuma média da União existe como
 * linha do livro-razão (`grep -rlE "geo=EU|EU27" ledger/claims/` devolve só as
 * linhas do PIB per capita regional), e uma comparação contra um valor que a
 * página não tem é exactamente a classe de afirmação que aquele bloco veio tirar.
 * O segundo é a **Emenda 16 lida por inteiro**: procurada nos dois sítios onde
 * ela vive (`DECISIONS.md` e `design/especime-v3/direcao.md`), a emenda **não tem
 * cláusula nenhuma sobre a posição face à média da União**; o que ela diz do
 * Painel Social é «sem cor porque não tem limiares» e «os indicadores que o
 * livro-razão guarda e cujo registo nomeia esse painel». Uma frase que não está
 * numa linha nem numa decisão não entra, mesmo quando um brief a sugere.
 *
 * **Nenhuma das duas fala da casa nem de confiança** (Emenda 15 e Emenda 18):
 * dizem o que o painel é e quem publica as medidas e os limiares. Não dizem que
 * a casa confere, não dizem que os números têm fonte, não dizem porque se deve
 * acreditar neles.
 *
 * **NENHUMA DAS DUAS TRAZ UM ALGARISMO DA CASA, E AS DUAS TRAZEM ALGARISMOS
 * TRANSCRITOS.** A primeira redação deste cabeçalho escrevia «nenhuma das duas
 * traz um algarismo», e era falso: as duas imprimem «Relatório por País 2026» e
 * «SWD(2026) 222», que são a designação e o identificador de um documento. O
 * Blocking 4 da leitura a frio apanhou-o. Os algarismos que elas trazem são
 * TRANSCRIÇÕES CONFERIDAS, marcadas `data-verbatim` e comparadas carácter a
 * carácter com `src/data/verbatim.mjs`; nenhum é uma medição de Portugal, e
 * nenhum foi escrito à mão.
 *
 * O que continua a não entrar é a CONTAGEM das medidas: ela já está no nome de
 * cada painel, marcada `data-prova` e recontada pelo portão, e escrevê-la outra
 * vez na frase punha um número que se move dentro de uma linha do inventário da
 * voz.
 *
 * As frases são um rascunho da casa e ficam nos pendentes do diretor como
 * frase a substituir pelas palavras dele (o plano §7 dá-as como texto dele).
 */
/**
 * ===========================================================================
 * QUANTAS MEDIDAS PRINCIPAIS TEM O PAINEL SOCIAL EUROPEU (bloco F1.6, 04.09.2026)
 * ===========================================================================
 *
 * Decisão (5) da `DECISIONS.md` §1.98: «a do Painel Social passa a dizer a
 * seleção ("oito das dezassete medidas principais") quando o número das medidas
 * principais estiver conferido na página da Comissão ou do Eurostat, e não
 * antes». Está conferido, e a origem vai aqui e não numa frase do relatório.
 *
 * A FONTE É O DOCUMENTO OPERATIVO DA COMISSÃO, e não uma página de navegação: o
 * Anexo 2 do Relatório Conjunto sobre o Emprego de 2026, COM(2025) 958, que
 * imprime a lista das medidas principais «endorsed by the Council» por baixo dos
 * três capítulos do Pilar. Contadas na lista: seis em «Equal opportunities»,
 * quatro em «Fair working conditions», sete em «Social protection and
 * inclusion».
 *
 * O DOCUMENTO NÃO IMPRIME O NÚMERO, IMPRIME A LISTA, e isso diz-se em vez de se
 * esconder: dezassete é a contagem da lista dele, não uma cadeia copiada de uma
 * página. O relatório do bloco traz o excerto e a contagem por capítulo.
 *
 * NENHUM PEDIDO SAIU DESTE PORTÁTIL PARA A COMISSÃO. O ficheiro foi descarregado
 * pelo motor a 2026-08-18 e está lá com o seu recibo
 * (`content/10 Housing/Technical Source/raw/MANIFEST.json`): estado 200,
 * 1 702 896 bytes, sha256 `0d49c0bc…e2eaa` (o resumo inteiro está no relatório).
 *
 * O NÚMERO NÃO SE RENDE COMO ALGARISMO, rende-se por extenso, e é a única maneira
 * honesta de ele entrar: não é uma medição de Portugal (não tem linha), não é um
 * número deste sítio sobre si próprio (não há nada que o portão possa recontar
 * aqui), e um `data-nonledger` novo seria uma dispensa que nada reconfere. Por
 * extenso, o que o guarda é o `check:formas` (F16) e a régua da voz: a frase
 * inteira está declarada no inventário, e no dia em que ela mudar, muda a linha.
 */
export const MEDIDAS_PRINCIPAIS_DO_PAINEL_SOCIAL = {
  /* UM CAMPO SÓ, E A PALAVRA COMPÕE-SE DELE (segunda passagem, 04.09.2026,
     Major 10 da leitura a frio do Codex). A primeira redação tinha `numero: 17` e
     `palavra: { pt: 'dezassete', … }` lado a lado, e a régua F16 comparava a
     frase com o campo `palavra`, que era o mesmo campo com que a frase tinha sido
     construída: mudar os dois para uma palavra errada passava. Agora só existe o
     número, a palavra sai de `numeralPorExtenso()`, e a régua lê o número, compõe
     a palavra por conta própria e procura-a na PÁGINA CONSTRUÍDA. Os dois lados
     da comparação deixaram de ser o mesmo. */
  numero: 17,
  origem: {
    documento: 'Joint Employment Report 2026, COM(2025) 958, Annex 2',
    publicador: 'Comissão Europeia',
    url: 'https://employment-social-affairs.ec.europa.eu/document/download/82702c6c-135c-4042-ae74-4afd6432e83f_en?filename=COM_2025_958_1_EN_annexe.pdf',
    lidoEm: '2026-08-18',
  },
};

/**
 * Os numerais por extenso de que as frases dos painéis precisam.
 *
 * A LISTA É CURTA E FECHADA de propósito: o que ela serve é o numerador de uma
 * frase que conta medidas de um painel, e um painel com mais de vinte e uma
 * medidas não existe neste sítio. Um número fora da lista fecha a construção em
 * vez de render um algarismo por dentro de uma frase, que é exactamente o que a
 * casa não escreve à mão.
 *
 * O GÉNERO É O DE «MEDIDAS», que é feminino: «uma medida», «duas medidas».
 */
const NUMERAIS = {
  pt: ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
    'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezasseis', 'dezassete', 'dezoito',
    'dezanove', 'vinte', 'vinte e uma'],
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
    'nineteen', 'twenty', 'twenty-one'],
};

/**
 * Um numeral por extenso, com a primeira letra maiúscula quando abre a frase.
 *
 * @param {number} n
 * @param {'pt'|'en'} lang
 * @param {boolean} [maiuscula]
 * @returns {string}
 */
export function numeralPorExtenso(n, lang, maiuscula = false) {
  const lista = NUMERAIS[lang] ?? NUMERAIS.pt;
  const palavra = lista[n];
  if (palavra === undefined) {
    throw new Error(
      `figuras: não há numeral por extenso para ${n} em "${lang}". A lista fechada vai até ` +
        `${lista.length - 1}; um painel maior do que isso é uma decisão, não um acidente.`,
    );
  }
  return maiuscula ? palavra.charAt(0).toUpperCase() + palavra.slice(1) : palavra;
}

/**
 * ===========================================================================
 * O ALCANCE DO PAINEL SOCIAL: QUANTAS DAS MEDIDAS PRINCIPAIS ESTÃO AQUI
 * ===========================================================================
 *
 * **As duas frases de contexto dos painéis saíram a 08.09.2026** (§9.3 do brief
 * do F1.10, sobre a leitura cruzada do inventário pelo Codex): diziam contra o
 * que a casa tinha confirmado os valores, e a Emenda 15 não deixa a página do
 * leitor falar do trabalho da casa. O que entrou no lugar delas é a definição de
 * cada painel (`DEFINICAO_DOS_PAINEIS`), que cita a Comissão como FONTE DA
 * DEFINIÇÃO e não como testemunha desta casa. Com elas saíram as duas glosas do
 * Painel Social («as que o livro-razão guarda …»), pelo §9.4.
 *
 * **O QUE NÃO PODIA SAIR É A FRAÇÃO**, e a razão é de honestidade e não de
 * forma: o subtítulo do painel diz «Painel Social Europeu · 8 medidas», e um
 * leitor que só leia isso fica a pensar que o painel TEM oito medidas. Tem
 * dezassete principais, e o livro-razão guarda oito. A frase fica, sem a glosa e
 * sem uma palavra sobre a conferência, e é ela que a régua F16 do
 * `check:formas` continua a ler no `dist/` com as duas contagens compostas por
 * conta própria.
 */
export const ALCANCE_DO_PAINEL_SOCIAL = {
  pt: [
    `${numeralPorExtenso(FIGURAS_SOCIAL.length, 'pt', true)} das ${numeralPorExtenso(MEDIDAS_PRINCIPAIS_DO_PAINEL_SOCIAL.numero, 'pt')} medidas principais do Painel Social Europeu.`,
  ],
  en: [
    `${numeralPorExtenso(FIGURAS_SOCIAL.length, 'en', true)} of the ${numeralPorExtenso(MEDIDAS_PRINCIPAIS_DO_PAINEL_SOCIAL.numero, 'en')} headline measures of the European Social Scoreboard.`,
  ],
};
