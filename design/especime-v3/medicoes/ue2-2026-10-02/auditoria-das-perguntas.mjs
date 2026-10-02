/** UE2 e UE2-b: a auditoria das perguntas em palavras comuns, pedaço a pedaço (a K16 do `check:cartao`).
 *
 * No bloco UE2 este guião chamava-se `auditoria-das-formas.mjs` e escrevia a auditoria das formas `uniao` de sete
 * perguntas, que só a página da União rendia. Na passagem UE2-b o lugar de direção decidiu que a forma em palavras
 * comuns é a ÚNICA (uma definição é uma coisa e vive num lugar, §1.143), e mandou explicar os outros termos que a
 * leitura a frio apontou: o PIB, os ativos e os passivos, a balança corrente e a média móvel, a OCDE, a população
 * ativa, os pontos percentuais, a privação material e social grave, o rendimento disponível e os apoios à habitação.
 * O guião passou a escrever as entradas da auditoria das perguntas que mudaram (as entradas de base, sem forma), e a
 * tirar as entradas das formas que deixaram de existir.
 *
 * Antes de escrever, confere: que os pedaços juntos são a pergunta declarada nas duas edições; que cada literal está
 * mesmo no campo que cita, numa origem que a pergunta declara ou num campo selado da linha da própria medida; e que
 * cada origem declarada apoia um pedaço. A K16 confere o mesmo, na construção, sobre o ficheiro escrito.
 *
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/ue2-2026-10-02/auditoria-das-perguntas.mjs            (confere e escreve)
 *   node design/especime-v3/medicoes/ue2-2026-10-02/auditoria-das-perguntas.mjs --confere  (só confere o ficheiro)
 * Sai 0 quando tudo bate; 1 com a lista do que não bate.
 */
import fs from 'node:fs';
import { DEFINICOES_DAS_MEDIDAS, ORIGENS_DAS_DEFINICOES, textoDaDefinicao } from '../../../../src/data/figuras.mjs';
import { loadClaims } from '../../../../src/lib/ledger.mjs';

const FICHEIRO = 'tests/cartao/perguntas-provadas.json';
const so = process.argv.includes('--confere');
const LINHAS = loadClaims();

/** Um apoio numa origem. */
const o = (origem, literal, campo = 'excerto') => ({ origem, campo, literal });
/** Um apoio num campo selado da linha da própria medida (o id entra quando a entrada se monta). */
const l = (campo, literal) => ({ linha: true, campo, literal });
const pedaco = (pt, en, ...apoios) => ({ pt, en, apoios });

/* O PIB EM PALAVRAS COMUNS, o mesmo pedaço em cinco perguntas: a descrição do Eurostat do PIB por habitante diz o que
   o PIB mede, e o «ano» é o da razão que a mesma descrição escreve. */
const PIB_VALOR = (prefixo) => [
  o('eurostat-tipsna40-descricao', 'GDP measures the value of total final output of goods and services produced by an economy within a certain period of time.'),
  o('eurostat-tipsna40-descricao', 'the average population of a specific year'),
  ...prefixo,
];

const MUDANCA_UE2B = (o_que) => `UE2-b: a forma em palavras comuns passa a ser a única (a decisão do lugar de direção sobre o achado 14 da leitura a frio do UE2). ${o_que}`;

/** As perguntas que mudaram, pela ordem de `DEFINICOES_DAS_MEDIDAS`. */
const PERGUNTAS = [
  {
    id: 'divida-publica-2025',
    mudanca: MUDANCA_UE2B('O PIB diz-se pelo que mede, o valor dos bens e serviços finais que a economia produz num ano, pela descrição do Eurostat, e a sigla fica entre parênteses.'),
    pedacos: [
      pedaco('Quanto devem as administrações públicas, ', 'How much does general government owe, ', o('pdm-divida-publica', 'general government sector debt')),
      pedaco('em percentagem do valor dos bens e serviços finais que a economia produz num ano ', 'as a percentage of the value of the final goods and services the economy produces in a year ',
        ...PIB_VALOR([o('pdm-divida-publica', 'in % of GDP')])),
      pedaco('(o PIB)?', '(GDP)?', o('pdm-divida-publica', 'in % of GDP'), l('excerpt', 'Percentage of gross domestic product (GDP)')),
    ],
  },
  {
    id: 'posicao-de-investimento-internacional-2025',
    mudanca: MUDANCA_UE2B('Os ativos financeiros e os passivos dizem-se pelo que são, o que os residentes têm no resto do mundo e o que lhe devem, com as palavras da leitura do cartão nacional, e o PIB pelo que mede.'),
    pedacos: [
      pedaco('Qual é a diferença entre o que os residentes do país têm no resto do mundo e o que lhe devem ', 'What is the difference between what the country’s residents own in the rest of the world and what they owe to it ',
        o('bdp-pii', 'o saldo entre os ativos financeiros e os passivos que os residentes de uma economia têm relativamente ao resto do mundo'),
        o('bdp-pii', 'the difference between financial assets and liabilities that residents of an economy have vis-à-vis the rest of the world', 'excertoEn')),
      pedaco('(os ativos financeiros e os passivos face ao exterior), ', '(financial assets and liabilities relative to the rest of the world), ',
        o('bdp-pii', 'os ativos financeiros e os passivos'), o('bdp-pii', 'financial assets and liabilities', 'excertoEn')),
      pedaco('em percentagem do valor dos bens e serviços finais que a economia produz num ano ', 'as a percentage of the value of the final goods and services the economy produces in a year ',
        ...PIB_VALOR([o('pdm-posicao-de-investimento', 'as percent of GDP')])),
      pedaco('(o PIB)?', '(GDP)?', o('pdm-posicao-de-investimento', 'as percent of GDP'), l('excerpt', 'Percentage of gross domestic product (GDP)')),
    ],
  },
  {
    id: 'custo-unitario-do-trabalho-2025',
    mudanca: MUDANCA_UE2B('O índice nominal do custo unitário do trabalho diz-se em palavras comuns (a remuneração por hora de trabalho, aos preços de cada ano, a dividir pelo que se produz numa hora de trabalho), pela descrição do Eurostat que a leitura do cartão nacional já cita, e o termo da Comissão fica entre parênteses.'),
    pedacos: [
      pedaco('Quanto mudou em três anos ', 'How much has ', o('pdm-custo-do-trabalho', '3-year percentage change')),
      pedaco('a remuneração por hora de trabalho', 'pay per hour of work',
        o('eurostat-tipslm10-descricao', 'labour cost is the ratio of compensation of employees (current prices) to hours worked by employees')),
      pedaco(', aos preços de cada ano', ', at each year’s prices', o('eurostat-tipslm10-descricao', 'compensation of employees (current prices)')),
      pedaco(', a dividir pelo que se produz numa hora de trabalho ', ', divided by what an hour of work produces, changed over three years ',
        o('eurostat-tipslm10-descricao', 'the ratio of labour cost to labour productivity'),
        o('eurostat-tipslm10-descricao', 'labour productivity is the ratio of gross domestic product'),
        o('eurostat-tipslm10-descricao', 'to total hours worked'),
        o('pdm-custo-do-trabalho', '3-year percentage change')),
      pedaco('(o índice nominal do custo unitário do trabalho, por hora trabalhada)?', '(the nominal unit labour cost index, per hour worked)?',
        o('pdm-custo-do-trabalho', 'nominal unit labour cost index, per hour worked')),
    ],
  },
  {
    id: 'precos-da-habitacao-2025',
    mudanca: MUDANCA_UE2B('A pergunta diz a base da comparação, um ano, pela descrição do Eurostat do indicador do painel (a variação num ano do índice).'),
    pedacos: [
      pedaco('Quanto mudaram num ano ', 'How much have ', o('eurostat-tipsho20-descricao', 'The MIP Scoreboard indicator is expressed as the 1-year percentage change of the HPI.')),
      pedaco('os preços de transação das casas compradas pelas famílias?', 'the transaction prices of homes purchased by households changed in a year?',
        o('glossario-hpi', 'measures the changes in the transaction prices of dwellings purchased by households'),
        o('eurostat-tipsho20-descricao', '1-year percentage change')),
    ],
  },
  {
    id: 'desempenho-das-exportacoes-2025',
    mudanca: MUDANCA_UE2B('As economias avançadas dizem-se pelo que a descrição do Eurostat conta, e a OCDE pelo nome por extenso, que o SEC 2010 escreve ao lado da sigla.'),
    pedacos: [
      pedaco('Quanto mudou em três anos ', 'How much has ', o('pdm-exportacoes', '3-year percentage change')),
      pedaco('a parte que as exportações de bens e serviços do país têm no total das exportações dos países ', 'the part that the country’s exports of goods and services make up of the total exports of the countries ',
        o('eurostat-tipsbp60-descricao', 'shares of exports of goods and services of EU Member States in relation to total exports of goods and services of OECD countries and non-OECD EU Member States')),
      pedaco('da Organização para a Cooperação e Desenvolvimento Económico (OCDE) ', 'of the Organisation for Economic Cooperation and Development (OECD) ',
        o('eurostat-sec2010-ocde', 'the Organisation for Economic Cooperation and Development (OECD)')),
      pedaco('e dos países da União que não são da OCDE ', 'and of EU countries outside the OECD changed over three years ',
        o('eurostat-tipsbp60-descricao', 'OECD countries and non-OECD EU Member States'), o('pdm-exportacoes', '3-year percentage change')),
      pedaco('(o desempenho das exportações face às economias avançadas)?', '(export performance against advanced economies)?',
        o('pdm-exportacoes', 'export performance against advanced economies')),
    ],
  },
  {
    id: 'divida-das-empresas-2025',
    mudanca: MUDANCA_UE2B('As sociedades não financeiras dizem-se como as empresas que não são financeiras, a dívida pelos instrumentos que a descrição do Eurostat conta, «consolidada» pelo que a descrição do Eurostat do mesmo setor diz dos dados consolidados, e o PIB pelo que mede.'),
    pedacos: [
      pedaco('Quanto devem as empresas que não são financeiras', 'How much do companies other than financial companies owe', o('eurostat-tipspd30', 'Non-financial corporations debt')),
      pedaco(', em empréstimos e títulos de dívida', ' in loans and debt securities', o('eurostat-tipspd30-descricao', 'Debt securities (F.3) and Loans (F.4)')),
      pedaco(', sem contar o que devem umas às outras ', ', leaving out what they owe one another ',
        o('eurostat-tipspc30-descricao', 'Data are presented in consolidated terms (i.e. excluding intra-sector transactions)')),
      pedaco('(a dívida consolidada das sociedades não financeiras)', '(the consolidated debt of non-financial corporations)',
        o('pdm-divida-das-empresas', 'NFC consolidated debt'), o('eurostat-tipspd30', 'Non-financial corporations debt, consolidated')),
      pedaco(', em percentagem do valor dos bens e serviços finais que a economia produz num ano ', ', as a percentage of the value of the final goods and services the economy produces in a year ',
        ...PIB_VALOR([o('pdm-divida-das-empresas', 'in % of GDP')])),
      pedaco('(o PIB)?', '(GDP)?', o('pdm-divida-das-empresas', 'in % of GDP'), l('excerpt', 'Percentage of gross domestic product (GDP)')),
    ],
  },
  {
    id: 'divida-das-familias-2025',
    mudanca: MUDANCA_UE2B('A dívida diz-se pelos instrumentos que a descrição do Eurostat conta, «consolidada» pelo que a descrição do Eurostat do mesmo setor diz dos dados consolidados, e o PIB pelo que mede.'),
    pedacos: [
      pedaco('Quanto devem as famílias e as instituições sem fim lucrativo ao seu serviço', 'How much do households and non-profit institutions serving them owe',
        o('pdm-divida-das-familias', 'household (incl. NPISH) consolidated debt'), o('glossario-npish', 'Non-profit institutions serving households')),
      pedaco(', em empréstimos e títulos de dívida', ' in loans and debt securities', o('eurostat-tipspd22-descricao', 'Debt securities (F.3) and Loans (F.4)')),
      pedaco(', sem contar o que devem umas às outras ', ', leaving out what they owe one another ',
        o('eurostat-tipspc40-descricao', 'transactions within the same sector are not taken into account')),
      pedaco('(a dívida consolidada)', '(consolidated debt)', o('pdm-divida-das-familias', 'consolidated debt')),
      pedaco(', em percentagem do valor dos bens e serviços finais que a economia produz num ano ', ', as a percentage of the value of the final goods and services the economy produces in a year ',
        ...PIB_VALOR([o('pdm-divida-das-familias', 'in % of GDP')])),
      pedaco('(o PIB)?', '(GDP)?', o('pdm-divida-das-familias', 'in % of GDP'), l('excerpt', 'Percentage of gross domestic product (GDP)')),
    ],
  },
  {
    id: 'fluxo-de-credito-as-empresas-2025',
    mudanca: MUDANCA_UE2B('O fluxo de crédito consolidado diz-se com as palavras da leitura do cartão nacional (o crédito contraído num ano, descontado o que se reembolsou), pela descrição do Eurostat e pelo SEC 2010, e «consolidado» pelo que a descrição diz dos dados consolidados; a dívida do período anterior diz-se no fim do ano anterior, como a descrição a diz.'),
    pedacos: [
      pedaco('Quanto crédito contraíram num ano ', 'How much credit did ', o('eurostat-tipspc30-descricao', 'the net amount of liabilities incurred during the year')),
      pedaco('as empresas que não são financeiras', 'companies other than financial companies take on in a year',
        o('eurostat-tipspd30', 'Non-financial corporations debt'),
        o('eurostat-tipspc30-descricao', 'non-financial corporations sector (S.11)'),
        o('eurostat-tipspc30-descricao', 'the net amount of liabilities incurred during the year')),
      pedaco(', descontado o que reembolsaram', ', minus what they repaid',
        o('eurostat-sec2010-registo-liquido', 'incurrences of liabilities are shown net of repayments of liabilities')),
      pedaco(' e sem contar as operações entre elas ', ' and leaving out operations among themselves ',
        o('eurostat-tipspc30-descricao', 'Data are presented in consolidated terms (i.e. excluding intra-sector transactions)')),
      pedaco('(o fluxo de crédito consolidado das sociedades não financeiras)', '(the consolidated credit flow of non-financial corporations)',
        o('pdm-credito-as-empresas', 'consolidated credit flow'), o('eurostat-tipspd30', 'Non-financial corporations')),
      pedaco(', em percentagem da dívida que tinham no fim do ano anterior', ', as a percentage of the debt they had at the end of the previous year',
        o('eurostat-tipspc30-descricao', 'expressed as a percentage of the corresponding stocks (excluding FDI) at the end of the previous year')),
      pedaco(', excluindo o investimento direto estrangeiro das duas parcelas?', ', excluding foreign direct investment from both amounts?',
        o('pdm-credito-as-empresas', 'NFC (excl. FDI) consolidated credit flow in % of NFC debt stock in t-1 (excl. FDI)'),
        o('glossario-fdi', 'Foreign direct investment, abbreviated as FDI')),
    ],
  },
  {
    id: 'fluxo-de-credito-as-familias-2025',
    mudanca: MUDANCA_UE2B('O fluxo de crédito consolidado diz-se com as palavras da leitura do cartão nacional (o crédito contraído num ano, descontado o que se reembolsou), pela descrição do Eurostat e pelo SEC 2010, e «consolidado» pelo que a descrição diz dos dados consolidados; a dívida do período anterior diz-se no fim do ano anterior, como a descrição a diz.'),
    pedacos: [
      pedaco('Quanto crédito contraíram num ano ', 'How much credit did ', o('eurostat-tipspc40-descricao', 'have incurred during the year')),
      pedaco('as famílias e as instituições sem fim lucrativo ao seu serviço', 'households and non-profit institutions serving them take on in a year',
        o('pdm-credito-as-familias', 'household (incl. NPISH)'),
        o('glossario-npish', 'Non-profit institutions serving households'),
        o('eurostat-tipspc40-descricao', 'have incurred during the year')),
      pedaco(', descontado o que reembolsaram', ', minus what they repaid',
        o('eurostat-sec2010-registo-liquido', 'net of repayments of liabilities'),
        o('eurostat-tipspc40-descricao', 'the net amount of liabilities')),
      pedaco(' e sem contar as operações entre elas ', ' and leaving out operations among themselves ',
        o('eurostat-tipspc40-descricao', 'transactions within the same sector are not taken into account')),
      pedaco('(o fluxo de crédito consolidado)', '(the consolidated credit flow)', o('pdm-credito-as-familias', 'consolidated credit flow')),
      pedaco(', em percentagem da dívida que tinham no fim do ano anterior?', ', as a percentage of the debt they had at the end of the previous year?',
        o('eurostat-tipspc40-descricao', 'expressed in percentage of the related stocks at the end of the previous year')),
    ],
  },
  {
    id: 'saldo-da-balanca-corrente-2025',
    mudanca: MUDANCA_UE2B('A balança corrente diz-se pelo que mede, com as palavras da leitura do cartão nacional e a descrição do Eurostat; o PIB pelo que mede; e a média móvel de três anos para trás como a média desse ano e dos dois anteriores. Os termos ficam entre parênteses.'),
    pedacos: [
      pedaco('Qual é a diferença entre o que o país recebeu do resto do mundo e o que lhe pagou, ', 'What is the difference between what the country received from the rest of the world and what it paid to it, ',
        o('eurostat-tipsbp10-descricao', 'the transactions of a country with the rest of the world'),
        o('eurostat-tipsbp10-descricao', 'marked as a credit, a debit or a balance')),
      pedaco('por bens, serviços e rendimentos ', 'for goods, services and income ', o('eurostat-tipsbp10-descricao', 'in goods, services, primary income and secondary income')),
      pedaco('(o saldo da balança corrente), ', '(the current account balance), ', o('pdm-balanca-corrente', 'current account balance')),
      pedaco('em percentagem do valor dos bens e serviços finais que a economia produz num ano ', 'as a percentage of the value of the final goods and services the economy produces in a year ',
        ...PIB_VALOR([o('pdm-balanca-corrente', 'as percent of GDP')])),
      pedaco('(o PIB), ', '(GDP), ', o('pdm-balanca-corrente', 'as percent of GDP'), l('excerpt', 'Percentage of GDP')),
      pedaco('na média desse ano e dos dois anteriores ', 'on the average of that year and the two before it ',
        o('pdm-balanca-corrente', '3-year backward moving average'), l('unit', 'média de três anos')),
      pedaco('(a média móvel de três anos para trás)?', '(the three-year backward moving average)?', o('pdm-balanca-corrente', '3-year backward moving average')),
    ],
  },
  {
    id: 'taxa-de-actividade-2025',
    mudanca: MUDANCA_UE2B('A população comparável diz-se pelo grupo de idades que a descrição do Eurostat do mesmo indicador escreve, as pessoas ativas pelo que são, e os pontos percentuais pela conta que o excerto da linha escreve (a diferença entre o ano e três anos antes).'),
    pedacos: [
      pedaco('Quanto mudou em três anos a parte das pessoas dos 15 aos 64 anos ', 'How much has the share of people aged 15 to 64 ',
        o('pdm-taxa-de-actividade', '3-year change in pps'),
        o('eurostat-tipslm60-idade', 'the percentage of economically active population aged 15-64 on the total population of the same age')),
      pedaco('que trabalham ou procuram trabalho ', 'who work or are looking for work ', o('glossario-atividade', 'The economically active population comprises employed and unemployed persons.')),
      pedaco('(as pessoas ativas, empregadas ou desempregadas), ', '(active people, employed or unemployed) changed over three years, ',
        o('glossario-atividade', 'Activity rate is the percentage of active persons'),
        o('glossario-atividade', 'comprises employed and unemployed persons'),
        o('pdm-taxa-de-actividade', '3-year change in pps')),
      pedaco('contada como a diferença entre a percentagem desse ano e a de três anos antes ', 'counted as the difference between that year’s percentage and the one three years earlier ',
        l('excerpt', 'Percentage point change (t-(t-3))')),
      pedaco('(em pontos percentuais)?', '(in percentage points)?', o('pdm-taxa-de-actividade', '3-year change in pps'), l('unit', 'pontos percentuais')),
    ],
  },
  {
    id: 'taxa-de-cambio-efectiva-real-2025',
    mudanca: MUDANCA_UE2B('A taxa de câmbio efetiva real diz-se pelo que mede (os preços do país face aos de outros países, contando as taxas de câmbio e os preços no consumidor), pela descrição do Eurostat que a leitura do cartão nacional já cita, e os deflatores ficam entre parênteses, com o termo.'),
    pedacos: [
      pedaco('Quanto mudaram em três anos ', 'How much have ', o('pdm-cambio-efectivo-real', '3-year percentage change')),
      pedaco('os preços do país face aos de outros 41 países industriais, ', 'the country’s prices relative to those of 41 other industrial countries, ',
        o('eurostat-tipser10-descricao', 'price or cost competitiveness relative to its principal competitors'),
        o('pdm-cambio-efectivo-real', 'relative to 41 other industrial countries')),
      pedaco('contando as taxas de câmbio e os preços no consumidor de cada um ', 'allowing for exchange rates and each country’s consumer prices, changed over three years ',
        o('eurostat-tipser10-descricao', 'depend not only on exchange rate movements but also on cost and price trends'),
        o('eurostat-tipser10-descricao', 'deflated by the consumer price indices'),
        o('pdm-cambio-efectivo-real', '3-year percentage change')),
      pedaco('(a taxa de câmbio efetiva real, com base nos deflatores dos índices de preços no consumidor)?', '(the real effective exchange rate, based on consumer price index deflators)?',
        o('pdm-cambio-efectivo-real', 'real effective exchange rates'), o('pdm-cambio-efectivo-real', 'based on HICP/CPI deflators')),
    ],
  },
  ...['taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-2025'].map((id) => ({
    id,
    mudanca: MUDANCA_UE2B('A população ativa diz-se pelo que é, as pessoas que trabalham ou procuram trabalho, pela descrição do Eurostat da taxa de desemprego do painel, e o termo fica entre parênteses.'),
    pedacos: [
      pedaco('Que parte das pessoas dos 15 aos 74 anos ', 'What share of people aged 15 to 74 ',
        o('glossario-desemprego', 'the number of people unemployed as a percentage of the labour force'), l('excerpt', 'Age class: From 15 to 74 years')),
      pedaco('que trabalham ou procuram trabalho ', 'who work or are looking for work ', o('eurostat-tipsun20-descricao', 'The labour force is the total number of people employed and unemployed.')),
      pedaco('(a população ativa) ', '(the labour force) ', o('glossario-desemprego', 'as a percentage of the labour force')),
      pedaco('está sem emprego?', 'is unemployed?', o('glossario-desemprego', 'The unemployment rate is the number of people unemployed')),
    ],
  })),
  {
    id: 'desemprego-de-longa-duracao-2025',
    mudanca: MUDANCA_UE2B('A população ativa diz-se pelo que é, as pessoas que trabalham ou procuram trabalho, pelo glossário do Eurostat da taxa de atividade, e o termo fica entre parênteses.'),
    pedacos: [
      pedaco('Que parte das pessoas dos 15 aos 74 anos ', 'What share of people aged 15 to 74 ',
        o('eurostat-tesem130-denominador', 'the number of long-term unemployed aged 15-74 as a percentage of the active population of the same age')),
      pedaco('que trabalham ou procuram trabalho ', 'who work or are looking for work ', o('glossario-atividade', 'The economically active population comprises employed and unemployed persons.')),
      pedaco('(a população ativa) ', '(the labour force) ', o('eurostat-tesem130-denominador', 'as a percentage of the active population')),
      pedaco('está sem trabalho e procura emprego ativamente há pelo menos um ano?', 'is out of work and has been actively seeking employment for at least a year?',
        o('glossario-longa-duracao', 'the number of people who are out of work and have been actively seeking employment for at least a year')),
    ],
  },
  {
    id: 'risco-de-pobreza-ou-exclusao-2025',
    mudanca: MUDANCA_UE2B('As três situações dizem-se pelo que são, quem entra em cada uma: o rendimento abaixo de 60 % do rendimento que deixa metade da população do país acima dele e metade abaixo, pela descrição do Eurostat e pelo glossário da mediana; as privações, pela descrição do Eurostat que a resposta selada ao pedido da linha traz; e o agregado onde quase ninguém trabalha, pelo glossário. Os termos ficam entre parênteses.'),
    pedacos: [
      pedaco('Que parte da população está em pelo menos uma de três situações: ', 'What share of the population is in at least one of three situations: ',
        o('glossario-arope', 'The AROPE rate is the share of the total population which is at risk of poverty or social exclusion.'),
        o('glossario-arope', 'the sum of persons who are either at risk of poverty, or severely materially and socially deprived or living in a household with a very low work intensity')),
      pedaco('rendimento abaixo de 60 % do rendimento que deixa metade da população do país acima dele e metade abaixo, o mediano ', 'income below 60 % of the income that leaves half of the country’s population above it and half below, the median ',
        o('eurostat-tipslc10-descricao', 'with an equalised disposable income below the risk-of-poverty threshold, which is set at 60 % of the national median equalised disposable income'),
        o('eurostat-glossario-mediana', 'The median is the middle value in a group of numbers ranked in order of size.'),
        o('eurostat-glossario-mediana', 'so that 50% of the scores are above and 50% are below')),
      pedaco('(risco de pobreza); ', '(at risk of poverty); ', o('glossario-arope', 'at risk of poverty')),
      pedaco('pelo menos sete de treze privações por falta de recursos ', 'at least seven out of thirteen deprivations because of a lack of resources ',
        o('eurostat-tipslc10-privacao', 'having living conditions severely constrained by a lack of resources, they experience at least seven out of thirteen deprivation items')),
      pedaco('(privação material e social grave); ', '(severe material and social deprivation); ', o('glossario-arope', 'severely materially and socially deprived')),
      pedaco('ou viver num agregado onde quase ninguém trabalha ', 'or living in a household where almost nobody works ', o('glossario-arope', '(quasi-)jobless households')),
      pedaco('(intensidade de trabalho muito baixa), ', '(very low work intensity), ', o('glossario-arope', 'living in a household with a very low work intensity')),
      pedaco('contando cada pessoa uma única vez?', 'counting each person only once?', o('glossario-arope', 'People are included only once')),
    ],
  },
  ...[
    ['sobrecarga-do-custo-da-habitacao-2025',
      pedaco('Que parte das pessoas, no total de todos os regimes de ocupação, ', 'What share of people, across all tenure statuses, ',
        o('eurostat-tespm140-populacao', 'Percentage of the population living in a household'))],
    ['sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025',
      pedaco('Que parte dos inquilinos a preço de mercado ', 'What share of tenants at market rent ', o('eurostat-tessi164-inquilinos', 'Tenant, rent at market price'))],
  ].map(([id, primeiro]) => ({
    id,
    mudanca: MUDANCA_UE2B('O rendimento disponível diz-se pelo que é, o que o agregado recebe depois de pagos os impostos e as contribuições sociais, pelo glossário do Eurostat, e «líquido de subsídios à habitação» como «descontados os apoios à habitação», pelo glossário da sobrecarga; o termo fica entre parênteses.'),
    pedacos: [
      primeiro,
      pedaco('vive em agregados onde o custo total da habitação, ', 'are in households where total housing costs, ',
        o('glossario-sobrecarga', 'population living in households where the total housing costs')),
      pedaco('descontados os apoios à habitação, ', 'after deducting housing allowances, ', o('glossario-sobrecarga', "total housing costs ('net' of housing allowances)")),
      pedaco('leva mais de 40 % do que o agregado recebe do trabalho, de investimentos e de prestações sociais, ', 'take more than 40 % of what the household receives from work, investment and social benefits, ',
        o('glossario-sobrecarga', 'represent more than 40 % of disposable income'),
        o('eurostat-glossario-rendimento-disponivel', 'all monetary incomes received from any source by each member of a household are added up; these include income from work, investment and social benefits')),
      pedaco('depois de pagos os impostos e as contribuições sociais ', 'after paying taxes and social contributions ',
        o('eurostat-glossario-rendimento-disponivel', 'taxes and social contributions that have been paid, are deducted from this sum')),
      pedaco('(o rendimento disponível), ', '(disposable income), ', o('glossario-sobrecarga', 'of disposable income')),
      pedaco('também descontados os apoios à habitação?', 'also after deducting housing allowances?', o('glossario-sobrecarga', "disposable income ('net' of housing allowances)")),
    ],
  })),
];

const LEITURA = {
  quem: 'Claude Opus 5.5',
  quando: '2026-10-02',
  o_que:
    'a passagem UE2-b: a forma em palavras comuns passa a ser a única, nas 18 perguntas que mudaram, pedaço a pedaço, com os termos que a leitura a frio do UE2 apontou explicados; as entradas das formas da página da União saem. Escrito por design/especime-v3/medicoes/ue2-2026-10-02/auditoria-das-perguntas.mjs',
};

const erros = [];
const entradas = PERGUNTAS.map((q) => {
  const d = /** @type {any} */ (DEFINICOES_DAS_MEDIDAS)[q.id];
  if (!d) {
    erros.push(`${q.id}: a pergunta não está declarada`);
    return null;
  }
  if (d.uniao) erros.push(`${q.id}: a declaração ainda tem a forma «uniao»`);
  const pergunta = { pt: textoDaDefinicao(d.pt), en: textoDaDefinicao(d.en) };
  for (const lang of ['pt', 'en']) {
    const junta = q.pedacos.map((p) => p[lang]).join('');
    if (junta !== pergunta[lang]) erros.push(`${q.id} (${lang}): os pedaços juntos dão «${junta}» e a pergunta é «${pergunta[lang]}»`);
  }
  const usadas = new Set();
  const pedacos = q.pedacos.map((p) => ({
    ...p,
    apoios: p.apoios.map((a) => {
      if (a.linha) {
        const linha = LINHAS.get(q.id);
        const valor = a.campo === 'document.title' ? linha?.document?.title : linha?.[a.campo];
        if (typeof valor !== 'string' || !valor.includes(a.literal)) erros.push(`${q.id}: «${a.literal}» não está no campo «${a.campo}» da linha`);
        return { linha: q.id, campo: a.campo, literal: a.literal };
      }
      const origem = /** @type {any} */ (ORIGENS_DAS_DEFINICOES)[a.origem];
      if (!d.origens.includes(a.origem)) erros.push(`${q.id}: o apoio cita «${a.origem}», que a pergunta não declara`);
      if (typeof origem?.[a.campo] !== 'string' || !origem[a.campo].includes(a.literal)) {
        erros.push(`${q.id}: «${a.literal}» não está no campo «${a.campo}» de «${a.origem}»`);
      }
      usadas.add(a.origem);
      return a;
    }),
  }));
  for (const k of d.origens) if (!usadas.has(k)) erros.push(`${q.id}: a origem «${k}» não apoia pedaço nenhum`);
  return { id: q.id, origens: [...d.origens], pergunta, mudanca: q.mudanca, pedacos };
});
const formasDeclaradas = Object.entries(DEFINICOES_DAS_MEDIDAS).filter(([, d]) => /** @type {any} */ (d).uniao).map(([id]) => id);
if (formasDeclaradas.length) erros.push(`a declaração ainda tem formas «uniao»: ${formasDeclaradas.join(', ')}`);

const auditoria = JSON.parse(fs.readFileSync(FICHEIRO, 'utf8'));
const ids = new Set(PERGUNTAS.map((q) => q.id));
if (so) {
  for (const e of entradas) {
    const noFicheiro = auditoria.perguntas.find((q) => q.id === e.id && !q.forma);
    if (JSON.stringify(noFicheiro) !== JSON.stringify(e)) erros.push(`${e.id}: a entrada no ficheiro não é a que este guião escreve`);
  }
  if (auditoria.perguntas.some((q) => q.forma)) erros.push('o ficheiro ainda tem entradas de formas');
  if (!auditoria.leituras.some((x) => JSON.stringify(x) === JSON.stringify(LEITURA))) erros.push('falta a leitura da UE2-b no registo das leituras');
} else if (!erros.length) {
  /* As entradas que mudaram substituem as antigas no mesmo lugar da lista; as das formas saem. */
  auditoria.perguntas = auditoria.perguntas
    .filter((q) => !q.forma)
    .map((q) => (ids.has(q.id) ? entradas.find((e) => e.id === q.id) : q));
  if (!auditoria.leituras.some((x) => JSON.stringify(x) === JSON.stringify(LEITURA))) auditoria.leituras.push(LEITURA);
  fs.writeFileSync(FICHEIRO, JSON.stringify(auditoria, null, 2) + '\n');
}
if (erros.length) {
  for (const e of erros) console.error(`  ${e}`);
  process.exit(1);
}
const pedacos = entradas.reduce((n, e) => n + e.pedacos.length, 0);
const apoios = entradas.reduce((n, e) => n + e.pedacos.reduce((m, p) => m + p.apoios.length, 0), 0);
console.log(`UE2-b: ${entradas.length} perguntas auditadas, ${pedacos} pedaços, ${apoios} apoios${so ? ' (só conferido)' : ' (escritas)'}.`);
