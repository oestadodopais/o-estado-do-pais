const X = (ficheiro, campo, literal) => ({ ficheiro, campo, literal });
/**
 * =============================================================================
 * AS FRASES DAS FAMÍLIAS · a especificação do bloco R4 (05.10.2026)
 * =============================================================================
 *
 * O ponto 2 do brief `design/observatorio/BRIEF-R4-as-palavras-correntes-em-cada-numero.md`: cada linha do livro-razão
 * sem cartão nacional ganha a frase da sua família, escrita uma vez, sem algarismos, e com a origem de cada palavra
 * técnica na auditoria. Este ficheiro é o sítio onde as frases se escrevem, parte a parte, com o apoio de cada parte;
 * `compor-familias-r4.mjs`, ao lado, confere cada apoio contra as linhas e as origens e escreve duas coisas: a
 * declaração que o sítio lê (`src/data/o-que-e-das-familias.mjs`) e a auditoria que a K17 confere
 * (`tests/cartao/leituras-provadas.json`, chave `familias`).
 *
 * AS FORMAS DE UMA ENTRADA
 *   · `{ chaves, cartao, nome? }` · a família lê a metade «o que é» do cartão nacional da mesma medida, contra a
 *     própria linha (o ano anterior diz o seu valor, o seu período e o ramo do sinal dele); o `nome` é o da família,
 *     para as linhas sem nome do projeto (a linha da União diz o lugar), e sem ele vale o nome do cartão;
 *   · `{ chaves, nome?, partes }` · a frase da família, escrita aqui;
 *   · `{ concelho, nome?, partes }` · a frase de uma medida dos concelhos: a nota da medida em `MEDIDAS_DO_CONCELHO`
 *     (que é a frase da dobra do cartão do concelho, e não se reescreve), ou, para o limite da dívida, a frase nova.
 *
 * OS APOIOS DE UMA PARTE QUE DIZ (a forma da K17, alargada às famílias)
 *   · `O(origem, literal, campo)` · um literal num campo de uma origem de `ORIGENS_DAS_DEFINICOES`;
 *   · `L(campo, literal)` · um literal num campo selado de CADA linha da família (excerpt, unit, name, source,
 *     document.title, document.locator, e os campos da casa conferidos no motor: derivation, derivation_en, ressalva,
 *     ressalva_en);
 *   · `OU(...)` · para cada linha da família, pelo menos um dos apoios vale (as famílias dos concelhos têm a linha de
 *     Évora, lida de outra fonte);
 *   · `ANO` · o período de cada linha é um ano;
 *   · `AUSENCIA` · frase fixa que só pode aparecer quando a linha não tem excerto da fonte; a K17 confere a falta.
 *   · `TERMO(chave)` · a explicação de um termo em palavras comuns declarada em `TERMOS_DOS_CARTOES` (a decisão do
 *     lugar de direção de 04.10.2026, passagem R2-b), lida contra a fonte, para linhas que essa entrada já nomeia.
 *
 * NENHUMA FRASE TEM ALGARISMOS; NENHUMA NOMEIA UM CONCELHO NAS FAMÍLIAS DOS CONCELHOS; NENHUMA NOMEIA UMA PESSOA.
 * As frases são do construtor do bloco (Claude Opus 5.5) e lê-as a frio o leitor da outra família.
 */

import { FAMILIAS_JD1 } from '../jd1-2026-10-06/familias.mjs';
export const L = (campo, literal) => ({ linha: 'propria', campo, literal });
export const O = (origem, literal, campo = 'excerto') => ({ origem, campo, literal });
export const OU = (...alternativas) => ({ ou: alternativas });
export const ANO = { linha: 'propria', campo: 'reference_date', forma: 'ano' };
const AUSENCIA = { classe: 'retirada', pt: 'Por confirmar na fonte.', en: 'To be confirmed at source.' };
const FONTE_DO_CALCULO_AUSENTE = AUSENCIA;
export const TERMO = (termo) => ({ termo });
export const diz = (pt, en, ...apoios) => ({ pt, en, classe: 'diz', apoios });
export const liga = (pt, en) => ({ pt, en, classe: 'liga' });
const ponto = liga('.', '.');

/* ------------------------------------------------------------------ pedaços que se repetem */
const PIB_DA_ECONOMIA = [
  diz('em percentagem do PIB', 'as a percentage of GDP', L('unit', '% do PIB')),
  diz(', o valor de tudo o que a economia produz', ', the value of everything the economy produces',
    O('eurostat-tipsna40-descricao', 'GDP measures the value of total final output of goods and services produced by an economy')),
  diz(' num ano', ' in a year', O('eurostat-tipsna40-descricao', 'within a certain period of time')),
  ponto,
];

/* =============================================================================
 * 1 · O ANO ANTERIOR E O PERÍODO ANTERIOR DAS MEDIDAS COM CARTÃO: a frase do cartão, lida contra a linha
 * ============================================================================= */
const CARTAO = [
  ['abandono-escolar-precoce', 'abandono-escolar-precoce-2025'],
  ['competencias-digitais', 'competencias-digitais-2025'],
  ['criancas-em-creche', 'criancas-em-creche-2025'],
  ['custo-unitario-do-trabalho', 'custo-unitario-do-trabalho-2025'],
  ['desempenho-das-exportacoes', 'desempenho-das-exportacoes-2025'],
  ['desemprego-de-longa-duracao', 'desemprego-de-longa-duracao-2025'],
  ['despesa-em-id', 'despesa-em-id-2024'],
  ['disparidade-de-emprego-entre-sexos', 'disparidade-de-emprego-entre-sexos-2025'],
  ['disparidade-salarial-entre-sexos', 'disparidade-salarial-entre-sexos-2024'],
  ['divida-das-empresas', 'divida-das-empresas-2025'],
  ['divida-das-familias', 'divida-das-familias-2025'],
  ['divida-publica', 'divida-publica-2025'],
  ['fluxo-de-credito-as-empresas', 'fluxo-de-credito-as-empresas-2025'],
  ['fluxo-de-credito-as-familias', 'fluxo-de-credito-as-familias-2025'],
  ['formacao-bruta-de-capital-fixo', 'formacao-bruta-de-capital-fixo-2025'],
  ['independencia-da-justica', 'independencia-da-justica-2025'],
  ['jovens-nem', 'jovens-nem-2025'],
  ['licencas-de-construcao', 'licencas-de-construcao-2025'],
  ['necessidades-medicas-nao-satisfeitas', 'necessidades-medicas-nao-satisfeitas-2025'],
  ['pib-real-per-capita', 'pib-real-per-capita-2025'],
  ['posicao-de-investimento-internacional', 'posicao-de-investimento-internacional-2025'],
  ['precos-da-habitacao', 'precos-da-habitacao-2025'],
  ['racio-s80-s20', 'racio-s80-s20-2025'],
  ['risco-de-pobreza-ou-exclusao', 'risco-de-pobreza-ou-exclusao-2025'],
  ['saldo-da-balanca-corrente', 'saldo-da-balanca-corrente-2025'],
  ['saldo-das-administracoes-publicas', 'saldo-das-administracoes-publicas-2025'],
  ['sobrecarga-do-custo-da-habitacao', 'sobrecarga-do-custo-da-habitacao-2025'],
  ['sobrecarga-do-custo-da-habitacao-inquilinos-mercado', 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025'],
  ['taxa-de-actividade', 'taxa-de-actividade-2025'],
  ['taxa-de-cambio-efectiva-real', 'taxa-de-cambio-efectiva-real-2025'],
  ['taxa-de-desemprego', 'taxa-de-desemprego-2025'],
  ['taxa-de-desemprego-mip', 'taxa-de-desemprego-mip-2025'],
  ['taxa-de-emprego', 'taxa-de-emprego-2025'],
  ['linha-de-risco-de-pobreza', 'linha-de-risco-de-pobreza-2025'],
  ['pensao-media-anual', 'pensao-media-anual-2025'],
  ['beneficiarios-do-rsi-por-mil', 'beneficiarios-do-rsi-por-mil-2024'],
  ['ipc-alimentacao-variacao-homologa-periodo-anterior', 'ipc-alimentacao-variacao-homologa'],
  ['ipc-combustiveis-variacao-homologa-periodo-anterior', 'ipc-combustiveis-variacao-homologa'],
  ['ipc-energia-em-casa-variacao-homologa-periodo-anterior', 'ipc-energia-em-casa-variacao-homologa'],
  ['ipc-rendas-variacao-homologa-periodo-anterior', 'ipc-rendas-variacao-homologa'],
  ['ipc-sem-habitacao-variacao-media-12-meses-periodo-anterior', 'ipc-sem-habitacao-variacao-media-12-meses'],
  ['ipc-variacao-homologa-periodo-anterior', 'ipc-variacao-homologa'],
  ['ipc-variacao-media-12-meses-periodo-anterior', 'ipc-variacao-media-12-meses'],
  ['ihpc-variacao-homologa-periodo-anterior', 'ihpc-variacao-homologa'],
  ['remuneracao-bruta-mensal-media-periodo-anterior', 'remuneracao-bruta-mensal-media'],
].map(([chave, cartao]) => ({ chaves: [chave], cartao }));

/* =============================================================================
 * 2 · AS LINHAS DA UNIÃO EUROPEIA DAS MEDIDAS COM CARTÃO
 * A frase do cartão onde ela não diz Portugal nem «o país»; uma frase própria onde diz. O nome diz o lugar.
 * ============================================================================= */
const UE = ' na União Europeia';
const IN_EU = ' in the European Union';
const UNIAO_COM_O_CARTAO = [
  ['abandono-escolar-precoce-ue', 'abandono-escolar-precoce-2025', 'Abandono escolar precoce' + UE, 'Early school leaving' + IN_EU],
  ['competencias-digitais-ue', 'competencias-digitais-2025', 'Pessoas com competências digitais básicas ou superiores' + UE, 'People with basic or above basic digital skills' + IN_EU],
  ['criancas-em-creche-ue', 'criancas-em-creche-2025', 'Crianças com menos de três anos em creche ou outros cuidados formais' + UE, 'Children under three in formal childcare' + IN_EU],
  ['custo-unitario-do-trabalho-ue', 'custo-unitario-do-trabalho-2025', 'Custo do trabalho por unidade produzida' + UE + ' (custo unitário do trabalho)', 'Labour cost per unit of output' + IN_EU + ' (unit labour cost)'],
  ['desemprego-de-longa-duracao-ue', 'desemprego-de-longa-duracao-2025', 'Desemprego de longa duração' + UE, 'Long-term unemployment' + IN_EU],
  ['disparidade-de-emprego-entre-sexos-ue', 'disparidade-de-emprego-entre-sexos-2025', 'Diferença de emprego entre homens e mulheres' + UE, 'Employment gap between men and women' + IN_EU],
  ['fluxo-de-credito-as-familias-ue', 'fluxo-de-credito-as-familias-2025', 'Fluxo de crédito às famílias' + UE, 'Credit flow to households' + IN_EU],
  ['independencia-da-justica-ue', 'independencia-da-justica-2025', 'Perceção de independência da justiça' + UE, 'Perceived independence of the justice system' + IN_EU],
  ['jovens-nem-ue', 'jovens-nem-2025', 'Jovens sem emprego, escola ou formação' + UE, 'Young people not in employment, education or training' + IN_EU],
  ['licencas-de-construcao-ue', 'licencas-de-construcao-2025', 'Área licenciada para habitação' + UE, 'Floor area licensed for housing' + IN_EU],
  ['necessidades-medicas-nao-satisfeitas-ue', 'necessidades-medicas-nao-satisfeitas-2025', 'Necessidades de cuidados médicos por satisfazer' + UE, 'Unmet need for medical care' + IN_EU],
  ['precos-da-habitacao-ue', 'precos-da-habitacao-2025', 'Preços da habitação' + UE + ', variação anual', 'House prices' + IN_EU + ', annual change'],
  ['racio-s80-s20-ue', 'racio-s80-s20-2025', 'Rendimento do quinto mais rico face ao quinto mais pobre' + UE, 'Income of the richest fifth compared with the poorest fifth' + IN_EU],
  ['sobrecarga-do-custo-da-habitacao-ue', 'sobrecarga-do-custo-da-habitacao-2025', 'Sobrecarga do custo da habitação' + UE, 'Housing cost overburden' + IN_EU],
  ['sobrecarga-do-custo-da-habitacao-inquilinos-mercado-ue', 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025', null, null],
  ['taxa-de-actividade-ue', 'taxa-de-actividade-2025', 'Pessoas que trabalham ou procuram trabalho' + UE + ' (taxa de atividade)', 'People who work or are looking for work' + IN_EU + ' (activity rate)'],
  ['taxa-de-desemprego-ue', 'taxa-de-desemprego-2025', 'Taxa de desemprego' + UE, 'Unemployment rate' + IN_EU],
  ['taxa-de-desemprego-mip-ue', 'taxa-de-desemprego-mip-2025', 'Taxa de desemprego' + UE, 'Unemployment rate' + IN_EU],
  ['taxa-de-emprego-ue', 'taxa-de-emprego-2025', 'Taxa de emprego' + UE, 'Employment rate' + IN_EU],
].map(([chave, cartao, pt, en]) => ({ chaves: [chave], cartao, ...(pt ? { nome: { pt, en } } : {}) }));

const UNIAO_COM_FRASE_PROPRIA = [
  {
    chaves: ['despesa-em-id-ue'],
    nome: { pt: 'Despesa em investigação e desenvolvimento' + UE, en: 'Spending on research and development' + IN_EU },
    partes: [
      diz('É o que se gastou em investigação e desenvolvimento num ano', 'It is what was spent on research and development in a year',
        L('document.title', 'Gross domestic expenditure on research and development (R&D)'), ANO),
      diz(', pelas empresas, pelas administrações públicas, pelo ensino superior e pelas instituições sem fins lucrativos, ',
        ', by companies, government, higher education and non-profit institutions, ',
        O('eurostat-glossario-gerd', 'by business enterprises, higher education institutions, as well as government and private non-profit organisations')),
      ...PIB_DA_ECONOMIA,
    ],
  },
  {
    chaves: ['divida-publica-ue'],
    nome: { pt: 'Dívida pública' + UE, en: 'Government debt' + IN_EU },
    partes: [
      diz('É tudo o que as administrações públicas devem, ', 'It is everything general government owes, ',
        O('eurostat-tipsgo10-descricao', 'debt means total gross debt')),
      ...PIB_DA_ECONOMIA,
    ],
  },
  {
    chaves: ['divida-das-empresas-ue'],
    nome: { pt: 'Dívida das empresas (não financeiras)' + UE, en: 'Debt of (non-financial) companies' + IN_EU },
    partes: [
      diz('É o que as empresas devem', 'It is what companies owe', O('eurostat-tipspd30-descricao', 'the stock of debt of the sector non-financial corporations')),
      diz(' em empréstimos e títulos de dívida', ' in loans and debt securities', O('eurostat-tipspd30-descricao', 'Debt securities (F.3) and Loans (F.4)')),
      diz(', fora as financeiras, ', ', excluding financial companies, ', O('eurostat-tipspd30', 'Non-financial corporations debt')),
      ...PIB_DA_ECONOMIA,
    ],
  },
  {
    chaves: ['divida-das-familias-ue'],
    partes: [
      diz('É o que as famílias e as instituições sem fim lucrativo ao seu serviço devem', 'It is what households and non-profit institutions serving them owe',
        O('eurostat-tipspd22-descricao', 'the stock of liabilities held by the sector Households and Non-Profit institutions serving households'),
        O('glossario-npish', 'Non-profit institutions serving households')),
      diz(' em empréstimos e títulos de dívida, ', ' in loans and debt securities, ', O('eurostat-tipspd22-descricao', 'Debt securities (F.3) and Loans (F.4)')),
      ...PIB_DA_ECONOMIA,
    ],
  },
  {
    chaves: ['formacao-bruta-de-capital-fixo-ue'],
    nome: {
      pt: 'Investimento em bens duradouros para produzir' + UE + ' (formação bruta de capital fixo)',
      en: 'Investment in durable goods used for production' + IN_EU + ' (gross fixed capital formation)',
    },
    partes: [
      diz('É o que as empresas, as administrações públicas, as famílias e as instituições sem fim lucrativo', 'It is what companies, government, households and non-profit institutions',
        O('eurostat-glossario-residente', 'households and individuals who make up a household; legal and social entities, such as corporations and quasi-corporations (e.g. branches of foreign direct investors), non-profit institutions, and the government of that economy')),
      diz(' residentes', ' that are resident', O('eurostat-glossario-residente', 'resident because it has a centre of economic interest in the economic territory of a country')),
      diz(' compraram num ano, descontado o que venderam', ' acquired in a year, less what they disposed of',
        O('eurostat-glossario-fbcf', 'consists of resident producers’ acquisitions, less disposals, of fixed assets during a given period'), ANO),
      diz(', em bens que duram mais de um ano', ', in assets that last more than a year', O('eurostat-glossario-fbcf', 'used repeatedly, or continuously, for more than one year')),
      diz(', como edifícios, máquinas e programas informáticos, ', ', such as buildings, machinery and software, ',
        O('eurostat-tipsna20-descricao', 'buildings, structures, machinery and equipment, mineral exploration, computer software')),
      ...PIB_DA_ECONOMIA,
    ],
  },
  {
    chaves: ['pib-real-per-capita-ue'],
    nome: { pt: 'PIB real por habitante' + UE, en: 'Real GDP per capita' + IN_EU },
    partes: [
      diz('É o valor de tudo o que a economia produziu', 'It is the value of everything the economy produced',
        O('eurostat-tipsna40-descricao', 'GDP measures the value of total final output of goods and services produced by an economy')),
      diz(' no ano', ' in the year', O('eurostat-tipsna40-descricao', 'the average population of a specific year'), ANO),
      diz(', por habitante', ', per inhabitant', L('unit', 'euros por habitante'), O('eurostat-tipsna40-descricao', 'ratio of real gross domestic product to the average population')),
      diz(', descontada a subida dos preços', ', excluding the rise in prices',
        O('eurostat-tipsna40-descricao', 'real gross domestic product'), O('eurostat-nama10-volumes', 'Volume figures show the development of aggregates excluding inflation.')),
      diz(', a que a fonte chama volumes encadeados', ', which the source calls chain linked volumes',
        L('excerpt', 'Chain linked volumes (2015)'), O('eurostat-nama10-volumes', 'presented as chain linked volumes')),
      ponto,
    ],
  },
  {
    chaves: ['risco-de-pobreza-ou-exclusao-ue'],
    nome: { pt: 'Risco de pobreza ou exclusão social' + UE, en: 'At risk of poverty or social exclusion' + IN_EU },
    partes: [
      diz('É a parte da população que está em pelo menos uma de três situações: ', 'It is the share of the population in at least one of three situations: ',
        O('glossario-arope', 'The AROPE rate is the share of the total population which is at risk of poverty or social exclusion.'),
        O('glossario-arope', 'the sum of persons who are either at risk of poverty, or severely materially and socially deprived or living in a household with a very low work intensity')),
      diz('rendimento abaixo da linha de pobreza do seu país', 'income below their country’s poverty line',
        O('eurostat-tipslc10-descricao', 'with an equalised disposable income below the risk-of-poverty threshold'),
        O('eurostat-tipslc10-descricao', 'of the national median equalised disposable income')),
      diz(', privação material e social grave', ', severe material and social deprivation', O('glossario-arope', 'severely materially and socially deprived')),
      diz(', ou viver num agregado onde quase ninguém trabalha', ', or living in a household where almost no one works', O('glossario-arope', '(quasi-)jobless households')),
      diz('; cada pessoa conta uma só vez.', '; each person counts only once.', O('glossario-arope', 'People are included only once')),
    ],
  },
  {
    chaves: ['taxa-de-cambio-efectiva-real-ue'],
    nome: {
      pt: 'Preços face aos parceiros comerciais, com o câmbio,' + UE + ' (taxa de câmbio efetiva real)',
      en: 'Prices compared with trading partners, including the exchange rate,' + IN_EU + ' (real effective exchange rate)',
    },
    partes: [
      diz('Mede a competitividade dos preços face aos principais concorrentes', 'It measures price competitiveness against the main competitors',
        O('eurostat-tipser10-descricao', 'price or cost competitiveness relative to its principal competitors')),
      diz(', contando a inflação e as taxas de câmbio', ', allowing for inflation and exchange rates',
        O('eurostat-tipser10-descricao', 'depend not only on exchange rate movements but also on cost and price trends')),
      diz(', em três anos.', ', over three years.', L('unit', 'variação em três anos')),
      diz(' Uma subida é uma apreciação: os preços sobem face aos dos parceiros e perde-se competitividade de preços.',
        ' A rise is an appreciation: prices increase relative to those of the partners and price competitiveness falls.',
        O('c1c-eurostat-sinal-cambio', 'A positive value means real appreciation.')),
    ],
  },
  {
    chaves: ['ihpc-variacao-homologa-ue'],
    partes: [
      diz('É quanto mudaram os preços no consumidor face ao mesmo mês do ano anterior', 'It is how much consumer prices changed compared with the same month a year earlier',
        O('rp1-ihpc-homologa', 'the annual rate of change, representing the percentage change in a reference month compared to the same month of the previous year')),
      diz(', na medida harmonizada que serve para comparar os países da União Europeia', ', on the harmonised measure used to compare the countries of the European Union',
        O('rp1-ihpc-comparavel', 'The Harmonised Index of Consumer Prices ( HICP) gives comparable measures of inflation for the countries and country groups for which it is produced.')),
      diz('; o valor da União é uma média dos países, ponderada pelo peso de cada um.', '; the European Union’s value is an average of the countries, weighted by each country’s weight.',
        O('rp1-ihpc-uniao', 'computed with a weighted average of the HICP sub-indices transmitted by the NSIs and the weights of the countries')),
    ],
  },
];

/* =============================================================================
 * 3 · AS NOTIFICAÇÕES DO INE NO PROCEDIMENTO DOS DÉFICES EXCESSIVOS
 * ============================================================================= */
/* O ANO ANTERIOR DA DESPESA LÍQUIDA: a mesma frase do cartão, com o apoio no literal da própria linha («o CFP apura», no
   parecer sobre 2024, onde o de 2025 diz «o CFP apurou»). */
const DESPESA_LIQUIDA = [
  {
    chaves: ['crescimento-da-despesa-liquida'],
    partes: [
      diz('É quanto cresceu num ano a despesa pública líquida', 'It is how much net public expenditure grew in a year',
        L('excerpt', 'crescimento da despesa líquida'), O('cfp-despesa-liquida', 'Despesa Total'), ANO),
      diz(': a que não conta os juros da dívida', ': the expenditure that leaves out interest on the debt',
        O('cfp-despesa-liquida', '(da qual se ex clui)'), O('cfp-despesa-liquida', 'Encargos com Juros (2)')),
      diz(', a despesa financiada por fundos europeus', ', spending financed by European funds', O('cfp-despesa-liquida', 'Despesa financiada por fundos da UE (4)')),
      diz(' nem a que sobe e desce com o desemprego', ' and the spending that rises and falls with unemployment', O('cfp-despesa-liquida', 'Despesa cíclica com subsídio de desemprego (3)')),
      diz(', apurada pelo Conselho das Finanças Públicas.', ', as computed by the Public Finance Council.',
        L('excerpt', 'o CFP apura um crescimento da despesa líquida'), O('cfp-quem', 'Conselho das Finanças Públicas (CFP)')),
    ],
  },
];

const NOTIFICACOES = [
  {
    chaves: ['divida-publica-2024-notificacao-ine', 'divida-publica-2025-notificacao-ine'],
    nome: { pt: 'Dívida pública na notificação do INE', en: 'Government debt in the INE’s notification' },
    partes: [
      diz('É tudo o que as administrações públicas devem', 'It is everything general government owes', L('excerpt', 'A dívida bruta das AP')),
      diz(', em percentagem do PIB', ', as a percentage of GDP', L('unit', '% do PIB')),
      diz(', como o INE a apura na notificação do procedimento dos défices excessivos.', ', as the INE calculates it in its notification under the excessive deficit procedure.',
        L('document.title', 'Procedimento dos Défices Excessivos')),
    ],
  },
  {
    chaves: ['saldo-das-administracoes-publicas-2025-notificacao-ine'],
    nome: { pt: 'Saldo das contas públicas na notificação do INE', en: 'Government balance in the INE’s notification' },
    partes: [
      diz('É a diferença entre o que as administrações públicas receberam e o que gastaram', 'It is the difference between what general government took in and what it spent',
        O('eurostat-gfs-saldo', 'The difference between total revenue and total expenditure'), L('excerpt', 'as Administrações Públicas (AP) apresentaram um saldo')),
      diz(' num ano', ' in a year', ANO),
      diz(', em percentagem do PIB', ', as a percentage of GDP', L('unit', '% do PIB')),
      diz(', como o INE a apura na notificação do procedimento dos défices excessivos', ', as the INE calculates it in its notification under the excessive deficit procedure',
        L('document.title', 'Procedimento dos Défices Excessivos')),
      diz('; positivo quer dizer que receberam mais do que gastaram.', '; positive means it took in more than it spent.',
        L('excerpt', 'apresentaram um saldo positivo'), O('eurostat-gfs-saldo', 'The difference between total revenue and total expenditure')),
    ],
  },
];

export const FAMILIAS_PARTE_1 = [...CARTAO, ...UNIAO_COM_O_CARTAO, ...UNIAO_COM_FRASE_PROPRIA, ...DESPESA_LIQUIDA, ...NOTIFICACOES];

/* =============================================================================
 * 4 · O ORÇAMENTO DO ESTADO DE 2026 E A SUA EXECUÇÃO
 * Cada grupo partilha uma frase: o nome do projeto de cada linha (o motor, `publisher/oe1_nomes.py`) já diz o
 * ministério, o programa ou a função, e se o valor é o orçamentado ou o executado. A frase diz o que a grandeza é,
 * com as palavras da ressalva e da conta que a linha publica (prosa da casa conferida no motor) e do título da fonte.
 * ============================================================================= */
const id = (s) => s; // legibilidade
const FUNCOES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
const PAISES_COFOG = ['es', 'pt', 'ue'];
const MINISTERIOS = [
  'administracao-interna', 'agricultura-e-mar', 'ambiente-e-energia', 'cultura-juventude-e-desporto', 'defesa-nacional',
  'economia-e-coesao-territorial', 'educacao-ciencia-e-inovacao', 'financas', 'infraestruturas-e-habitacao', 'justica',
  'negocios-estrangeiros', 'presidencia-do-conselho-de-ministros', 'reforma-do-estado', 'saude',
  'trabalho-solidariedade-e-seguranca-social',
];
const PROGRAMAS = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(3, '0'));

const SEM_FINANCEIRAS = diz(': a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços.',
  ': spending without transactions in financial assets and liabilities or transfers between its own services.',
  O('rp4n-despesa-efetiva', 'com exclusão dos «ativos financeiros»'), O('rp4n-consolidacao', 'transferências'));
const BRUTA = ponto;

const ORCAMENTO = [
  /* 4.1 · a despesa por função do Eurostat (COFOG), em percentagem do PIB, em Portugal, em Espanha e na União */
  {
    chaves: FUNCOES.flatMap((f) => PAISES_COFOG.map((p) => `despesa-por-funcao-2024-gf${f}-${p}`)),
    partes: [
      diz('É o que as administrações públicas, com as regionais e as locais, gastaram', 'It is what general government, including regional and local government, spent',
        L('document.title', 'General government expenditure by function'), L('ressalva', 'incluindo as administrações regional e local')),
      diz(' num ano', ' in a year', ANO),
      diz(' nesta função do Estado, pela classificação das funções que o Eurostat usa', ' on this function of government, under the classification of functions that Eurostat uses',
        L('ressalva', 'Esta é a classificação das funções do Estado do Eurostat'), L('document.title', '(COFOG)')),
      liga(', ', ', '),
      ...PIB_DA_ECONOMIA,
    ],
  },
  /* 4.2 · em cada cem euros da despesa efetiva consolidada, por função: o orçamentado e o executado */
  {
    chaves: FUNCOES.map((f) => `oe-2026-cem-euros-funcao-${f}`),
    partes: [
      diz('É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central', 'It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure',
        L('derivation', 'Dividir a despesa efetiva consolidada desta função pela despesa efetiva consolidada da administração central'), L('derivation', 'multiplicar por cem')),
      diz(' que o Orçamento prevê', ' planned in the Budget', O('rp4n-orcamento', 'Orçamento aprovado')),
      SEM_FINANCEIRAS,
    ],
  },
  {
    chaves: FUNCOES.map((f) => `execucao-2026-07-cem-euros-funcao-${f}`),
    partes: [
      diz('É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou', 'It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function',
        L('derivation', 'Dividir a despesa efetiva consolidada desta função pela despesa efetiva consolidada da administração central'), L('derivation', 'multiplicar por cem')),
      diz(' de janeiro a julho', ' from January to July', L('unit', 'sobre valores acumulados de janeiro a julho')),
      SEM_FINANCEIRAS,
    ],
  },
  /* A quota por ministérios: operação conferida e palavras do MAPA alojado. */
  ...[
    [MINISTERIOS.map(m=>`oe-2026-cem-euros-ministerio-${m}`), 'este ministério', 'this ministry'],
    [['oe-2026-cem-euros-ministerio-encargos-gerais-do-estado'], 'os encargos gerais do Estado', 'the general charges of the State'],
  ].map(([chaves,pt,en])=>({chaves,mostrarOrigens:true,partes:[
    diz(`É quanto vai para ${pt} em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central.`,
      [`It is the amount for ${en} out of every hundred euros of “`, {termo:'DESPESA TOTAL',lingua:'pt-PT'}, '” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector.'],
      L('check',' / oe-2026-despesa-bruta-administracao-central * 100 , 2 )'),
      O('rp4n-total-ministerios','DESPESA TOTAL'), O('rp4n-mapa-ministerios','Mapa relativo à classificação orgânica das despesas do subsetor da Administração Central')),
  ]})),
  /* 4.4 · a despesa por função, em despesa efetiva consolidada: o orçamentado e o executado */
  {
    chaves: FUNCOES.map((f) => `oe-2026-despesa-funcao-${f}`),
    partes: [
      diz('É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções', 'It is what central administration plans to spend on this function in a year, under the classification of expenditure by function',
        L('document.title', 'OE2026 - Despesa por classificação funcional'), O('rp4n-funcional', 'Os dados abrangem todas as entidades públicas integradas no perímetro da Administração Central'), O('rp4n-orcamento', 'Orçamento aprovado')),
      diz(', em despesa efetiva consolidada', ', in consolidated effective expenditure', O('rp4n-despesa-efetiva', 'Despesa efetiva'), O('rp4n-consolidacao', 'Consolidação/Consolidado')),
      SEM_FINANCEIRAS,
    ],
  },
  {
    chaves: FUNCOES.map((f) => `execucao-2026-07-despesa-funcao-${f}`),
    partes: [
      diz('É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções', 'It is what central administration spent on this function from January to July, under the classification of expenditure by function',
        L('document.title', 'despesa por classificação funcional'), L('unit', 'acumulados de janeiro a julho')),
      diz(', em despesa efetiva consolidada', ', in consolidated effective expenditure', O('rp4n-despesa-efetiva', 'Despesa efetiva'), O('rp4n-consolidacao', 'Consolidação/Consolidado')),
      SEM_FINANCEIRAS,
    ],
  },
  {
    chaves: ['oe-2026-diferencas-consolidacao-funcional', 'execucao-2026-07-diferencas-consolidacao-funcional'],
    partes: [
      diz('É a diferença entre os registos de despesa e de receita das verbas que passam entre entidades, depois de retirar a parte comum aos dois registos, na conta por funções da administração central', 'It is the difference between expenditure and revenue records for funds passing between entities, after removing the part common to both records, in central administration’s account by function', O('rp4n-diferencas-consolidacao', 'diferenças entre os registos de despesa'), O('rp4n-diferencas-consolidacao', 'comum aos registos de receita e despesa'), L('document.title', 'classificação funcional')),
      ponto,
    ],
  },
  /* 4.5 · a despesa por ministério e por programa, em despesa bruta, no Orçamento */
  {
    chaves: MINISTERIOS.map((m) => `oe-2026-despesa-ministerio-${m}`),
    partes: [
      diz('É o que o Orçamento prevê que este ministério gaste num ano', 'It is what the Budget plans for this ministry to spend in a year',
        L('document.locator', 'POR MINISTÉRIOS'), O('rp4n-orcamento', 'Orçamento aprovado')),
      BRUTA,
    ],
  },
  {
    chaves: ['oe-2026-despesa-ministerio-encargos-gerais-do-estado'],
    partes: [
      diz('É o que o Orçamento prevê para os encargos gerais do Estado num ano', 'It is what the Budget plans for the general charges of the State in a year',
        L('document.locator', 'POR MINISTÉRIOS'), L('name', 'ENCARGOS GERAIS DO ESTADO'), O('rp4n-orcamento', 'Orçamento aprovado')),
      BRUTA,
    ],
  },
  {
    chaves: PROGRAMAS.map((p) => `oe-2026-despesa-programa-${p}`),
    partes: [
      diz('É o que o Orçamento prevê gastar neste programa da administração central num ano', 'It is what the Budget plans to spend on this central administration programme in a year',
        L('document.title', 'DESAGREGADAS POR PROGRAMAS'), O('rp4n-orcamento', 'Orçamento aprovado')),
      BRUTA,
    ],
  },
  /* 4.6 · a despesa por programa executada, consolidada dentro de cada programa, e o que liga os programas */
  {
    chaves: PROGRAMAS.map((p) => `execucao-2026-08-despesa-programa-${p}`),
    partes: [
      diz('É o que a administração central gastou neste programa de janeiro a agosto', 'It is what central administration spent on this programme from January to August',
        L('unit', 'acumulados de janeiro a agosto'), L('document.locator', 'Execução Acumulada')),
      diz(', em despesa efetiva consolidada dentro do programa', ', in effective expenditure consolidated within the programme',
        O('rp4n-programas', 'consolidados de fluxos internos aos mesmos')),
      diz(': sem operações com ativos e passivos financeiros nem os fluxos internos ao programa.', ': excluding financial asset and liability transactions and flows within the programme.', O('rp4n-despesa-efetiva', 'com exclusão dos «ativos financeiros»'), O('rp4n-programas', 'consolidados de fluxos internos aos mesmos')),
    ],
  },
  {
    chaves: ['execucao-2026-08-subtotal-programas'],
    partes: [
      diz('É a soma da despesa efetiva consolidada de cada programa da administração central, de janeiro a agosto', 'It is the sum of the consolidated effective expenditure of each central administration programme, from January to August',
        L('name', 'Subtotal despesa efetiva consolidada dos Programas Orçamentais'), L('unit', 'acumulados de janeiro a agosto')),
      diz(': cada programa sem os seus fluxos internos.', ': each programme excluding its internal flows.', O('rp4n-programas', 'consolidados de fluxos internos aos mesmos')),
    ],
  },
  {
    chaves: ['execucao-2026-08-fluxos-entre-programas'],
    partes: [
      diz('São as transferências de cada programa da administração central para outros programas, de janeiro a agosto', 'They are the transfers from each central administration programme to other programmes, from January to August',
        L('name', 'Fluxos para outros Programas Orçamentais'), L('unit', 'acumulados de janeiro a agosto')),
      diz(' (a fonte chama-lhes fluxos para outros programas orçamentais).', ' (the source calls them flows to other budget programmes).',
        L('name', 'Fluxos para outros Programas Orçamentais')),
    ],
  },
  {
    chaves: ['execucao-2026-08-diferencas-consolidacao-programas'],
    partes: [
      diz('É a diferença entre os registos de despesa e de receita das verbas que passam entre entidades, depois de retirar a parte comum aos dois registos, na conta dos programas da administração central, de janeiro a agosto', 'It is the difference between expenditure and revenue records for funds passing between entities, after removing the part common to both records, in the account of central administration programmes from January to August', O('rp4n-diferencas-consolidacao', 'diferenças entre os registos de despesa'), O('rp4n-diferencas-consolidacao', 'comum aos registos de receita e despesa'), L('unit', 'acumulados de janeiro a agosto')),
      ponto,
    ],
  },
  /* 4.7 · os agregados da administração central (e da segurança social): a frase não diz o período, que o nome diz */
  {
    chaves: ['oe-2026-despesa-efetiva-administracao-central', 'execucao-2026-07-despesa-efetiva-administracao-central', 'execucao-2026-08-despesa-efetiva-administracao-central'],
    partes: [
      diz('É a despesa efetiva da administração central', 'It is central administration’s effective expenditure', OU(L('name', 'DESPESA EFETIVA'), L('name', 'Despesa efetiva'))),
      diz(": o que ela gasta sem contar as operações com ativos e passivos financeiros.", ": what it spends without counting transactions in financial assets and liabilities.", O('rp4n-despesa-efetiva', 'financeiros')),
    ],
  },
  {
    chaves: ['oe-2026-despesa-efetiva-administracao-central-seguranca-social', 'execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social'],
    partes: [
      diz('É a despesa efetiva da administração central e da segurança social, somadas sem as transferências entre os seus serviços', 'It is the effective expenditure of central administration and social security, added together without the transfers between their services',
        L('name', 'Despesa efetiva'), L('ressalva', 'transferências internas entre os serviços considerados'), O('rp4n-ac-ss', 'Administração Central e Segurança Social')),
      diz(": o que gastam sem contar as operações com ativos e passivos financeiros.", ": what they spend without counting transactions in financial assets and liabilities.", O('rp4n-despesa-efetiva', 'financeiros')),
    ],
  },
  {
    chaves: ['oe-2026-receita-efetiva-administracao-central', 'execucao-2026-07-receita-efetiva-administracao-central', 'execucao-2026-08-receita-efetiva-administracao-central'],
    partes: [
      diz('É a receita efetiva da administração central', 'It is central administration’s effective revenue', OU(L('name', 'RECEITA EFETIVA'), L('name', 'Receita efetiva'))),
      diz(": o que ela recebe sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência, a diferença entre receita e despesa que vem do ano anterior.", ": what it takes in without counting receipts from financial assets and liabilities or carry-over balances, the difference between revenue and expenditure carried forward from the previous year.", O('rp4n-receita-efetiva', 'financeiros'), O('rp4n-receita-efetiva', 'saldos de gerência'), O('rp4n-saldos-gerencia', 'gerência (ano) anterior.')),
    ],
  },
  {
    chaves: ['oe-2026-receita-efetiva-administracao-central-seguranca-social', 'execucao-2026-08-receita-efetiva-administracao-central-seguranca-social'],
    partes: [
      diz('É a receita efetiva da administração central e da segurança social', 'It is the effective revenue of central administration and social security',
        L('name', 'Receita efetiva'), O('rp4n-ac-ss', 'Administração Central e Segurança Social')),
      diz(": o que recebem sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência, a diferença entre receita e despesa que vem do ano anterior.", ": what they take in without counting receipts from financial assets and liabilities or carry-over balances, the difference between revenue and expenditure carried forward from the previous year.", O('rp4n-receita-efetiva', 'financeiros'), O('rp4n-receita-efetiva', 'saldos de gerência'), O('rp4n-saldos-gerencia', 'gerência (ano) anterior.')),
    ],
  },
  {
    chaves: ['oe-2026-despesa-orcamental-administracao-central', 'execucao-2026-07-despesa-orcamental-administracao-central'],
    partes: [
      diz('É toda a despesa orçamental da administração central', 'It is all of central administration’s budget expenditure', L('name', 'DESPESA ORÇAMENTAL')),
      diz(", incluindo as operações com ativos e passivos financeiros, que a despesa efetiva não conta.", ", including transactions in financial assets and liabilities, which effective expenditure does not count.", O('rp4n-despesa-efetiva', 'financeiros')),
    ],
  },
  {
    chaves: ['oe-2026-receita-orcamental-administracao-central', 'execucao-2026-07-receita-orcamental-administracao-central'],
    partes: [
      diz('É toda a receita orçamental da administração central', 'It is all of central administration’s budget revenue', L('name', 'RECEITA ORÇAMENTAL')),
      diz(", incluindo os recebimentos de ativos e passivos financeiros, que a receita efetiva não conta.", ", including receipts from financial assets and liabilities, which effective revenue does not count.", O('rp4n-receita-efetiva', 'financeiros')),
    ],
  },
  {
    chaves: ['oe-2026-despesa-primaria-administracao-central', 'execucao-2026-07-despesa-primaria-administracao-central'],
    partes: [
      diz('É a despesa efetiva da administração central sem a rubrica de juros e outros encargos', 'It is central administration’s effective expenditure excluding interest and other charges', O('rp4n-despesa-primaria', 'Despesa primária')),
      diz(', a que a fonte chama despesa primária.', ', which the source calls primary expenditure.', L('name', 'DESPESA PRIMÁRIA')),
    ],
  },
  {
    chaves: ['oe-2026-saldo-global-administracao-central', 'execucao-2026-07-saldo-global-administracao-central', 'execucao-2026-08-saldo-global-administracao-central'],
    partes: [
      diz('É o saldo global da administração central', 'It is central administration’s overall balance', OU(L('name', 'SALDO GLOBAL'), L('name', 'Saldo global'))),
      diz(': a diferença entre o que ela recebe e o que gasta, sem contar as operações com ativos e passivos financeiros; negativo quer dizer que gastou mais do que recebeu.',
        ': the difference between what it takes in and what it spends, without counting transactions in financial assets and liabilities; negative means it spent more than it took in.',
        O('rp4n-saldo', 'Diferença entre a receita efetiva e a despesa'),
        OU(L('ressalva', 'receita e despesa efetivas excluem-nas'), O('rp4n-saldo', 'Diferença entre a receita efetiva e a despesa'))),
    ],
  },
  {
    chaves: ['oe-2026-saldo-global-administracao-central-seguranca-social', 'execucao-2026-08-saldo-global-administracao-central-seguranca-social'],
    partes: [
      diz('É o saldo global da administração central e da segurança social: a receita efetiva menos a despesa efetiva', 'It is the overall balance of central administration and social security: effective revenue minus effective expenditure',
        L('name', 'Saldo global'), O('rp4n-saldo', 'Diferença entre a receita efetiva e a despesa')),
      ponto,
    ],
  },
  {
    chaves: ['oe-2026-saldo-primario-administracao-central', 'execucao-2026-07-saldo-primario-administracao-central'],
    partes: [
      diz('É a receita efetiva da administração central menos a sua despesa efetiva sem juros e outros encargos', 'It is central administration’s effective revenue minus its effective expenditure excluding interest and other charges', O('rp4n-saldo', 'Saldo Primário'), O('rp4n-despesa-primaria', 'excluindo a rubrica de')),
      diz(', a que a fonte chama saldo primário.', ', which the source calls primary balance.', L('name', 'SALDO PRIMÁRIO')),
    ],
  },
  {
    chaves: ['execucao-2026-07-saldo-global-administracoes-publicas-contabilidade-publica'],
    partes: [
      diz('É o saldo global de todas as administrações públicas, contado em contabilidade pública', 'It is the overall balance of all general government, counted in public accounting',
        L('name', 'SALDO GLOBAL DAS AP EM CP')),
      diz(': a diferença entre o que recebem e o que gastam.', ': the difference between what they take in and what they spend.', O('rp4n-saldo', 'Diferença entre a receita efetiva e a despesa')),
    ],
  },
  {
    chaves: ['oe-2026-ativos-e-passivos-da-despesa-administracao-central', 'execucao-2026-07-ativos-e-passivos-da-despesa-administracao-central'],
    partes: [
      diz('É a parte da despesa orçamental da administração central feita em operações com ativos e passivos financeiros', 'It is the part of central administration’s budget expenditure made in transactions in financial assets and liabilities',
        L('name', 'ATIVOS E PASSIVOS DA DESPESA')),
      diz(", que a despesa efetiva não conta.", ", which effective expenditure does not count.", O('rp4n-despesa-efetiva', 'financeiros')),
    ],
  },
  {
    chaves: ['oe-2026-ativos-e-passivos-da-receita-administracao-central', 'execucao-2026-07-ativos-e-passivos-da-receita-administracao-central'],
    partes: [
      diz('É a parte da receita orçamental da administração central que vem de operações com ativos e passivos financeiros', 'It is the part of central administration’s budget revenue that comes from transactions in financial assets and liabilities',
        L('name', 'ATIVOS E PASSIVOS DA RECEITA')),
      diz(", que a receita efetiva não conta.", ", which effective revenue does not count.", O('rp4n-receita-efetiva', 'financeiros')),
    ],
  },
  {
    chaves: ['oe-2026-ativos-financeiros-liquidos-administracao-central-seguranca-social', 'execucao-2026-08-ativos-financeiros-liquidos-administracao-central-seguranca-social'],
    partes: [
      diz('É o que a administração central e a segurança social puseram em ativos financeiros, descontados os reembolsos que receberam', 'It is what central administration and social security put into financial assets, less the repayments they received',
        L('name', 'Ativos financeiros líquidos de reembolsos'), O('rp4n-ac-ss', 'Administração Central e Segurança Social')),
      diz(' (a fonte chama-lhes ativos financeiros líquidos de reembolsos).', ' (the source calls them financial assets net of repayments).', L('name', 'Ativos financeiros líquidos de reembolsos')),
    ],
  },
  {
    chaves: ['oe-2026-passivos-financeiros-liquidos-administracao-central-seguranca-social', 'execucao-2026-08-passivos-financeiros-liquidos-administracao-central-seguranca-social'],
    partes: [
      diz('É o que a administração central e a segurança social receberam de novos passivos financeiros, menos o que amortizaram', 'It is what central administration and social security received from new financial liabilities, less what they repaid',
        O('rp4n-passivos', 'entre valores de passivos financeiros da receita e despesa'), L('name', 'Passivos financeiros líquidos de amortizações')),
      ponto,
    ],
  },
  {
    chaves: ['oe-2026-despesa-bruta-administracao-central'],
    partes: [
      diz('É a soma de toda a despesa dos serviços da administração central que o Orçamento prevê para o ano', 'It is the sum of all the expenditure of central administration services that the Budget plans for the year',
        L('name', 'DESPESA TOTAL'), L('document.title', 'MAPA 4'), O('rp4n-orcamento', 'Orçamento aprovado')),
      BRUTA,
    ],
  },
  {
    chaves: ['oe-2026-receita-bruta-administracao-central'],
    partes: [
      diz('É a soma de toda a receita dos serviços da administração central que o Orçamento prevê para o ano', 'It is the sum of all the revenue of central administration services that the Budget plans for the year',
        L('name', 'RECEITA TOTAL'), L('document.title', 'MAPA 5'), O('rp4n-orcamento', 'Orçamento aprovado')),
      ponto,
    ],
  },
  {
    chaves: ['oe-2026-despesa-consolidada-administracao-central', 'oe-2026-despesa-consolidada-seguranca-social', 'oe-2026-despesa-total'],
    partes: [
      diz('É a despesa total que o Orçamento prevê para o ano, sem os fluxos de dinheiro entre os serviços somados', 'It is the total expenditure planned in the Budget for the year, excluding money flows between the services added together',
        OU(L('name', 'DESPESA TOTAL CONSOLIDADA'), L('name', 'Despesa total consolidada'), L('name', 'Total da Administração Central e Segurança Social consolidado')), O('rp4n-orcamento', 'Orçamento aprovado'), O('rp4n-consolidacao', 'efetuados entre as entidades do universo em análise.')),
      ponto,
    ],
  },
  {
    chaves: ['oe-2026-receita-consolidada-administracao-central', 'oe-2026-receita-consolidada-seguranca-social'],
    partes: [
      diz('É a receita total que o Orçamento prevê para o ano, sem os fluxos de dinheiro entre os serviços somados', 'It is the total revenue planned in the Budget for the year, excluding money flows between the services added together',
        OU(L('name', 'RECEITA TOTAL CONSOLIDADA'), L('name', 'Receita total consolidada')), O('rp4n-orcamento', 'Orçamento aprovado'), O('rp4n-consolidacao', 'efetuados entre as entidades do universo em análise.')),
      ponto,
    ],
  },
];

// O cabeçalho mensal não apoia a coluna anual do Orçamento Inicial.
export const FAMILIAS_PARTE_2 = ORCAMENTO.flatMap(e => {
  if (!e.partes.some(p => p.apoios?.some(a => a.origem === 'rp4n-ac-ss'))) return [e];
  return [false, true].map(anual => ({...e,
    chaves:e.chaves.filter(k => k.startsWith('oe-') === anual),
    partes:[...e.partes.map(p => ({...p, ...(p.apoios ? {apoios:p.apoios.map(a => anual && a.origem === 'rp4n-ac-ss' ? {...a,origem:'rp4n-ac-ss-orcamento'} : a)} : {})})), ...(anual ? [diz(' O valor vem da coluna do Orçamento Inicial de dois mil e vinte e seis, num quadro que apresenta também a execução acumulada de janeiro a agosto.', ' The value comes from the Initial Budget column for twenty twenty-six, in a table that also presents cumulative execution from January to August.', O('rp4n-ac-ss-orcamento', 'Orçamento\nInicial'), O('rp4n-ac-ss-orcamento', '2026'), O('rp4n-ac-ss-orcamento', 'Período: janeiro a agosto'))] : [])],
  })).filter(e => e.chaves.length);
});

/* =============================================================================
 * 5 · AS REGIÕES: o produto por habitante face à média da União, e a distância a ela
 * ============================================================================= */
const REGIOES = ['acores', 'alentejo', 'algarve', 'centro', 'grande-lisboa', 'madeira', 'norte', 'oeste-e-vale-do-tejo', 'peninsula-de-setubal'];
const PPC = diz('; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países.',
  '; the comparison is made in purchasing power parities, which remove price differences between countries.',
  TERMO('paridade-do-poder-de-compra'), L('excerpt', 'PPS_HAB_EU27_2020'));
const AS_REGIOES = [
  {
    chaves: REGIOES.map((r) => `pib-pc-${r}`),
    partes: [
      diz('É o valor de tudo o que a região produz num ano, por habitante', 'It is the value of everything the region produces in a year, per inhabitant',
        L('document.title', 'Gross domestic product (GDP) at current market prices by NUTS 2 region'),
        O('eurostat-tipsna40-descricao', 'GDP measures the value of total final output of goods and services produced by an economy'), ANO, TERMO('paridade-do-poder-de-compra')),
      diz(', em relação à média da União Europeia, que vale cem', ', relative to the European Union average, which is one hundred', L('unit', 'índice (UE-27 = 100)')),
      PPC,
    ],
  },
  {
    chaves: ['pib-pc-portugal'],
    partes: [
      diz('É o valor de tudo o que o país produz num ano, por habitante', 'It is the value of everything the country produces in a year, per inhabitant',
        L('document.title', 'Gross domestic product (GDP) at current market prices'),
        O('eurostat-tipsna40-descricao', 'GDP measures the value of total final output of goods and services produced by an economy'), ANO, TERMO('paridade-do-poder-de-compra')),
      diz(', em relação à média da União Europeia, que vale cem', ', relative to the European Union average, which is one hundred', L('unit', 'índice (UE-27 = 100)')),
      PPC,
    ],
  },
  {
    chaves: REGIOES.map((r) => `distancia-${r}-ue27`),
    partes: [
      diz('É a distância, em pontos, entre o valor de tudo o que a região produz por habitante e a média da União Europeia, que vale cem',
        'It is the distance, in points, between the value of everything the region produces per inhabitant and the European Union average, which is one hundred',
        L('unit', 'pontos de índice'), OU(L('derivation', '100 −'), L('derivation', '− 100'))),
      diz(': a diferença entre os dois índices.', ': the difference between the two indices.', OU(L('derivation', 'em pontos de índice'), L('derivation', 'A mesma distância'))),
    ],
  },
  {
    chaves: ['distancia-portugal-ue27'],
    partes: [
      diz('É a distância, em pontos, entre o valor de tudo o que o país produz por habitante e a média da União Europeia, que vale cem',
        'It is the distance, in points, between the value of everything the country produces per inhabitant and the European Union average, which is one hundred',
        L('unit', 'pontos de índice'), L('derivation', 'A média da UE-27 está fixada em 100')),
      diz(': a diferença entre os dois índices.', ': the difference between the two indices.', L('derivation', 'a distância é a diferença, em pontos de índice')),
    ],
  },
  {
    chaves: ['distancia-setubal-grande-lisboa'],
    partes: [
      diz('É a distância, em pontos, entre a Grande Lisboa e a Península de Setúbal, duas regiões vizinhas',
        'It is the distance, in points, between Greater Lisbon and the Setúbal Peninsula, two neighbouring regions',
        L('derivation', 'Distância entre duas regiões vizinhas, em pontos de índice'), L('unit', 'pontos de índice')),
      diz(', no índice do valor de tudo o que cada uma produz por habitante, em que a média da União Europeia vale cem.',
        ', on the index of the value of everything each produces per inhabitant, where the European Union average is one hundred.',
        L('derivation', '129 − 55')),
    ],
  },
];

/* =============================================================================
 * 6 · ÉVORA: as contas e a dívida da câmara, quem a governa, a economia e o Plano de Recuperação
 * ============================================================================= */
const SGMAI_CAMARA = OU(L('document.locator', 'órgão Câmara Municipal'));
const EVORA = [
  {
    chaves: ['alentejo-central-poder-de-compra'],
    partes: [
      diz('Índice do poder de compra por pessoa na sub-região', 'Index of purchasing power per person in the subregion', L('document.title', 'Poder de compra per capita')),
      diz(', em que Portugal vale cem: acima de cem, o poder de compra por pessoa é maior do que a média do país.', ', where Portugal is one hundred: above one hundred, purchasing power per person is higher than the country average.',
        L('unit', 'índice (Portugal = 100)')),
    ],
  },
  {
    chaves: ['evora-camara-lugares'],
    partes: [
      diz('É o número de mandatos da câmara municipal: os lugares que as eleições autárquicas distribuem pelas listas.', 'It is the number of seats on the municipal council: the places that the local elections share out among the lists.',
        L('document.locator', 'órgão Câmara Municipal'), L('document.locator', 'total de mandatos'), L('document.title', 'Autárquicas')),
    ],
  },
  {
    chaves: ['evora-camara-mandatos-cdu', 'evora-camara-mandatos-ps'],
    partes: [
      diz('É o número de mandatos da câmara municipal que a lista ganhou nas eleições autárquicas desse ano', 'It is the number of seats on the municipal council that the list won in that year’s local elections',
        L('document.locator', 'órgão Câmara Municipal'), L('document.locator', 'mandatos'), L('document.title', 'Autárquicas')),
      diz(', pelos resultados oficiais.', ', from the official results.', L('document.title', 'resultados oficiais por território')),
    ],
  },
  {
    chaves: ['evora-executivo-2025-ad', 'evora-executivo-2025-cdu', 'evora-executivo-2025-chega', 'evora-executivo-2025-ps'],
    partes: [
      diz('É o número de lugares que a lista tem no executivo da câmara saído das eleições autárquicas', 'It is the number of seats the list holds on the council executive that came out of the local elections',
        L('document.locator', 'mandatos no executivo'), L('document.title', 'Autárquicas')),
      diz(', pelos resultados oficiais.', ', from the official results.', L('document.title', 'resultados oficiais por território')),
    ],
  },
  {
    chaves: ['evora-concentracao-vab4', 'portugal-concentracao-vab4'],
    partes: [
      diz('É a parte do valor acrescentado bruto das empresas que cabe às quatro maiores', 'It is the share of companies’ gross value added that goes to the four largest',
        L('name', 'Indicador de concentração do valor acrescentado bruto das quatro maiores empresas'), L('unit', '% do VAB empresarial')),
      diz('; o valor acrescentado bruto é o valor do que se produz menos o valor dos bens e serviços consumidos para o produzir.',
        '; gross value added is the value of what is produced minus the value of the goods and services used up in producing it.', O('rp4n-vab', 'It is\noutput valued at basic prices less intermediate consumption valued at purchasers’ prices.')),
    ],
  },
  {
    chaves: ['evora-vab-empresarial'],
    partes: [
      diz('É o valor acrescentado bruto das empresas do concelho, somado sobre todas as atividades', 'It is the gross value added of the municipality’s companies, added up over all activities',
        L('name', 'Valor acrescentado bruto (€) das Empresas por Localização geográfica'), L('document.locator', 'total das divisões CAE')),
      diz(': o valor do que produzem menos o valor dos bens e serviços consumidos para o produzir.', ': the value of what they produce minus the value of the goods and services used up in producing it.', O('rp4n-vab', 'It is\noutput valued at basic prices less intermediate consumption valued at purchasers’ prices.')),
    ],
  },
  {
    chaves: ['evora-contas-2024-votos-contra', 'evora-contas-2024-votos-favor'],
    partes: [
      diz('É o número de votos na votação em que as contas da câmara foram rejeitadas', 'It is the number of votes in the vote in which the council’s accounts were rejected',
        L('excerpt', 'foi rejeitada com 2 votos a favor e 5 votos contra'), L('document.locator', 'Municipio-Evora-CLC')),
      diz(', como a certificação legal das contas o relata.', ', as the statutory audit of the accounts reports it.', L('document.title', 'Certificação Legal das Contas')),
    ],
  },
  {
    chaves: ['evora-desemprego-registado'],
    partes: [
      diz('Conta as pessoas desempregadas inscritas nos serviços de emprego em dezembro', 'Counts the unemployed people registered with the employment service in December',
        L('document.title', 'Desemprego registado por concelhos'), L('document.locator', 'desemprego registado por concelhos, dezembro de')),
      diz(' (desemprego registado).', ' (registered unemployment).', L('document.title', 'Desemprego registado')),
    ],
  },
  {
    chaves: ['evora-despesa-paga'],
    partes: [
      diz('É a despesa que a câmara pagou no ano, a corrente e a de capital', 'It is the spending the council paid in the year, current and capital',
        L('excerpt', 'nível de pagamentos de'), L('excerpt', 'de correntes e'), L('excerpt', 'de capital'), ANO),
      diz(', pela prestação de contas.', ', from its annual accounts.', L('document.title', 'Prestação de Contas')),
    ],
  },
  {
    chaves: ['evora-divergencia-municipio-dgal'],
    partes: [
      diz('É a diferença entre a dívida da câmara que o regulador publica e a que a própria câmara publica para o mesmo ano, arredondada ao euro.',
        'It is the difference between the council’s debt as the regulator publishes it and as the council itself publishes it for the same year, rounded to the euro.',
        L('derivation', 'A diferença entre a dívida que o regulador publica para 2024 e a que o município publica para o mesmo ano, arredondada ao euro.')),
    ],
  },
  {
    chaves: ['evora-divida-31-10'],
    partes: [
      diz('É a dívida que a câmara tinha registada no início do mandato', 'It is the debt the council had on its books at the start of the term',
        L('excerpt', 'A 31/10/2013'), O('rp4n-evora-divida-inicio', 'Dívida Total no Início do Mandato')),
      diz(', como o relatório de gestão a apresenta.', ', as the management report presents it.', L('document.title', 'Relatório de Gestão')),
    ],
  },
  {
    chaves: ['evora-divida-inicio-mandato-reexpressa'],
    partes: [
      diz('É a dívida do início do mandato como a apresenta um relatório de gestão posterior', 'It is the debt at the start of the term as a later management report presents it',
        L('name', 'Dívida Total no Início do Mandato'), L('document.title', 'Relatório de Gestão'), TERMO('reexpressa')),
      ponto,
    ],
  },
  {
    chaves: ['evora-divida-dgal'],
    partes: [
      diz('A dívida da câmara que conta para o limite legal no fim do ano', 'The council’s debt that counts towards the legal limit at year end',
        O('c1c-dgal-limites', 'não pode ultrapassar, em 31 de dezembro de cada ano'), L('document.title', 'Evolução endividamento total')),
      diz(', pela conta da Direção-Geral das Autarquias Locais: a dívida total sem o que a lei não conta para o limite, como as dívidas não orçamentais e a contribuição para o Fundo de Apoio Municipal.',
        ', as the Directorate-General for Local Authorities counts it: total debt without what the law does not count towards the limit, such as non-budget debts and the contribution to the municipal support fund.',
        L('source', 'Direção-Geral das Autarquias Locais'), L('document.locator', 'a dívida total que exclui as dívidas não orçamentais'), L('document.locator', 'e o FAM')),
    ],
  },
  {
    chaves: ['evora-divida-total'],
    partes: [
      diz('É a dívida total de operações orçamentais da câmara no fim do ano', 'It is the council’s total debt from budget operations at year end',
        OU(L('name', 'DÍVIDA TOTAL DE OPERAÇÕES ORÇAMENTAIS'), L('excerpt', 'Dívida Total de Operações Orçamentais')),
        O('c1c-dgal-limites', 'A dívida total de operações orçamentais do município')),
      diz(', pelas contas da própria câmara.', ', from the council’s own accounts.', L('source', 'Município de Évora')),
    ],
  },
  {
    chaves: ['evora-excesso-endividamento'],
    partes: [
      diz('É o montante em que a dívida da câmara passava do limite legal', 'It is the amount by which the council’s debt exceeded the legal limit',
        L('excerpt', 'Montante em Excesso'), O('c1c-dgal-limites', 'A dívida total de operações orçamentais do município')),
      diz(', pelas contas da própria câmara.', ', from the council’s own accounts.', L('source', 'Município de Évora'), L('document.title', 'Relatório de Gestão')),
    ],
  },
  {
    chaves: ['evora-execucao-da-receita'],
    partes: [
      diz('É a receita que a câmara cobrou no ano em percentagem da que o orçamento previa', 'It is the revenue the council collected in the year as a percentage of what the budget foresaw',
        L('unit', '% do orçamento'), O('rp4n-evora-receita', 'percentagem de execução')),
      diz(', pela prestação de contas.', ', from its annual accounts.', L('document.title', 'Prestação de Contas')),
    ],
  },
  {
    chaves: ['evora-indice-de-divida'],
    partes: [
      diz('A dívida em percentagem da média da receita corrente líquida cobrada nos três anos anteriores', 'Debt as a percentage of the average net current revenue collected in the previous three years',
        L('derivation', 'dividida pelo limite legal do mesmo ano e multiplicada por 150'), L('derivation', 'média da receita corrente líquida dos três anos anteriores'),
        O('c1c-dgal-limites', 'a média da receita corrente líquida cobrada nos três exercícios anteriores')),
      diz('; a lei permite uma vez e meia essa média.', '; the law allows one and a half times that average.', O('c1c-dgal-limites', '1,5 vezes a média da receita corrente líquida')),
    ],
  },
  {
    chaves: ['evora-limite-divida'],
    partes: [
      diz('É o máximo de dívida que a lei deixa a câmara ter no fim do ano: uma vez e meia a média da receita corrente líquida dos três anos anteriores',
        'It is the most debt the law lets the council have at year end: one and a half times the average net current revenue of the previous three years',
        L('name', 'LIMITE = Média dos Últimos 3 Exercícios * 1,5'), O('c1c-dgal-limites', 'não pode ultrapassar, em 31 de dezembro de cada ano, 1,5 vezes a média da receita corrente líquida cobrada nos três exercícios anteriores')),
      diz(', pelas contas da própria câmara.', ', from the council’s own accounts.', L('source', 'Município de Évora')),
    ],
  },
  {
    chaves: ['evora-limite-divida-dgal'],
    partes: [
      diz('É o máximo de dívida que a lei deixa a câmara ter no fim do ano: uma vez e meia a média da receita corrente líquida cobrada nos três anos anteriores',
        'It is the most debt the law lets the council have at year end: one and a half times the average net current revenue collected in the previous three years',
        L('document.locator', 'o limite legal de endividamento do ano'), O('c1c-dgal-limites', 'não pode ultrapassar, em 31 de dezembro de cada ano, 1,5 vezes a média da receita corrente líquida cobrada nos três exercícios anteriores')),
      diz(', pela conta da Direção-Geral das Autarquias Locais.', ', as the Directorate-General for Local Authorities counts it.', L('source', 'Direção-Geral das Autarquias Locais')),
    ],
  },
  {
    chaves: ['evora-margem-endividamento'],
    partes: [
      diz('É quanto a câmara ainda podia dever até chegar ao limite legal da dívida, no fim do ano', 'It is how much more the council could still owe before reaching the legal debt limit, at year end',
        L('excerpt', 'margem de endividamento absoluta'), O('c1c-dgal-limites', 'não pode ultrapassar, em 31 de dezembro de cada ano')),
      diz(', pela prestação de contas.', ', from its annual accounts.', L('document.title', 'Prestação de Contas')),
    ],
  },
  {
    chaves: ['evora-orcamento'],
    partes: [
      diz('É o orçamento da câmara para o ano', 'It is the council’s budget for the year', O('rp4n-evora-orcamento', 'O orçamento inicial é'), ANO),
      diz(', como a prestação de contas o apresenta.', ', as its annual accounts present it.', L('document.title', 'Prestação de Contas')),
    ],
  },
  {
    chaves: ['evora-pael-emprestimo'],
    partes: [
      diz('É o montante do empréstimo que a câmara contraiu no programa de apoio à economia local', 'It is the amount of the loan the council took out under the local economy support programme',
        L('excerpt', 'do total de empréstimo no montante de'), O('rp4n-evora-pael', 'Programa de Apoio à Economia Local')),
      diz(', como o relatório de gestão o apresenta.', ', as the management report presents it.', L('document.title', 'Relatório de Gestão')),
    ],
  },
  {
    chaves: ['evora-pagamentos-em-atraso'],
    partes: [
      diz('São os pagamentos em atraso com que a câmara fechou o ano', 'They are the payments in arrears with which the council closed the year', L('excerpt', 'encerrou 2025 com pagamentos em atraso')),
      diz(', pela prestação de contas.', ', from its annual accounts.', L('document.title', 'Prestação de Contas')),
    ],
  },
  {
    chaves: ['evora-pelouros-2021-presidente', 'evora-pelouros-2021-vice-presidente', 'evora-pelouros-2025-presidente', 'evora-pelouros-2025-vice-presidente', 'evora-pelouros-2025-vereadora'],
    partes: [
      diz('É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo', 'It is the number of portfolios that the council executive’s page assigns to this member of the executive',
        L('excerpt', 'Pelouro:'), L('document.title', 'Executivo — Câmara Municipal de Évora'), L('document.locator', 'página do executivo da Câmara Municipal de Évora')),
      ponto,
    ],
  },
  {
    chaves: ['evora-pelouros-2021-total', 'evora-pelouros-2025-total'],
    partes: [
      diz('É a soma dos pelouros atribuídos aos membros do executivo da câmara no mandato.', 'It is the sum of the portfolios assigned to the members of the council executive in the term.',
        L('derivation', 'Os pelouros designados'), L('derivation', 'somados sobre')),
    ],
  },
  {
    chaves: ['evora-populacao'],
    nome: { pt: 'População residente em Évora', en: 'Resident population of Évora' },
    partes: [
      diz('Estima quantas pessoas vivem no concelho', 'Estimates how many people have their home in the municipality', L('document.title', 'População residente'), L('name', 'Estimativas anuais')),
      diz(' (população residente)', ' (resident population)', L('document.title', 'População residente')),
      diz(', pela estimativa anual do INE.', ', from the statistics institute’s annual estimate.', L('name', 'INE, Estimativas anuais da população residente')),
    ],
  },
  {
    chaves: ['evora-prazo-medio-de-pagamento'],
    partes: [
      diz('O número médio de dias que a câmara demora a pagar aos fornecedores', 'The average number of days the council takes to pay its suppliers',
        L('excerpt', 'o PMP do Município de Évora é de'), L('unit', 'dias'), O('rp4n-evora-pmp', 'pagamento a fornecedores')),
      diz(' (prazo médio de pagamento), pelas contas da própria câmara.', ' (average payment period), from the council’s own accounts.',
        O('rp4n-evora-pmp', 'Prazo Médio de Pagamento'), L('source', 'Município de Évora')),
    ],
  },
  {
    chaves: ['evora-prr-aprovado'],
    instantaneo: true,
    partes: [
      diz("São as verbas contratadas do Plano de Recuperação e Resiliência por beneficiários intermediários e diretos com sede no concelho", "These are Recovery and Resilience Plan funds contracted by intermediate and direct beneficiaries headquartered in the municipality", L('document.computed_over.column', 'valor_contratado'), X('entidades', 'papel_entidade', 'Beneficiário Intermediário'), X('entidades', 'papel_entidade', 'Beneficiário Direto'), X('entidades', 'localizacao_sede', 'Évora')),
      diz(', pela listagem de entidades do plano.', ', from the plan’s list of entities.', L('document.title', 'Listagem de entidades PRR')),
    ],
  },
  {
    chaves: ['evora-prr-pago'],
    instantaneo: true,
    partes: [
      diz("São as verbas pagas do Plano de Recuperação e Resiliência a beneficiários intermediários e diretos com sede no concelho", "These are Recovery and Resilience Plan funds paid to intermediate and direct beneficiaries headquartered in the municipality", L('document.computed_over.column', 'valor_pago'), X('entidades', 'papel_entidade', 'Beneficiário Intermediário'), X('entidades', 'papel_entidade', 'Beneficiário Direto'), X('entidades', 'localizacao_sede', 'Évora')),
      diz(', pela listagem de entidades do plano.', ', from the plan’s list of entities.', L('document.title', 'Listagem de entidades PRR')),
    ],
  },
  {
    chaves: ['evora-prr-vencido-aprovado'],
    instantaneo: true,
    partes: [
      diz("São as verbas contratadas por beneficiários intermediários e diretos com sede no concelho, com prazo de conclusão anterior ao instantâneo e sem conclusão registada", "These are funds contracted by intermediate and direct beneficiaries headquartered in the municipality, with a completion deadline before the snapshot and no completion recorded", L('document.computed_over.column', 'valor_contratado'), X('entidades', 'papel_entidade', 'Beneficiário Intermediário'), X('entidades', 'papel_entidade', 'Beneficiário Direto'), X('entidades', 'localizacao_sede', 'Évora'), X('projetos', 'cabecalho', 'dt_prevista_conclusao'), X('projetos', 'cabecalho', 'dt_efetiva_conclusao')),
      diz(', pela listagem de entidades do Plano de Recuperação e Resiliência.', ', from the Recovery and Resilience Plan’s list of entities.', L('document.title', 'Listagem de entidades PRR')),
    ],
  },
  {
    chaves: ['evora-prr-municipio-contratado', 'evora-prr-universidade-contratado'],
    partes: [
      diz('É o valor que esta entidade contratou no concelho no Plano de Recuperação e Resiliência', 'It is the amount this entity contracted in the municipality under the Recovery and Resilience Plan',
        L('excerpt', 'contratado_neste_concelho'), L('document.locator', 'valor contratado neste concelho')),
      diz(', pela listagem de entidades do plano.', ', from the plan’s list of entities.', L('document.title', 'Listagem de entidades PRR')),
    ],
  },
  {
    chaves: ['evora-prr-execucao'],
    partes: [
      diz('É a parte das verbas do Plano de Recuperação e Resiliência contratadas por beneficiários intermediários e diretos com sede no concelho que já foi paga.', 'It is the share of Recovery and Resilience Plan funds contracted by intermediate and direct beneficiaries headquartered in the municipality that has already been paid.',
        L('derivation', 'As verbas pagas a beneficiários intermediários e diretos com sede em Évora')),
    ],
  },
  {
    chaves: ['evora-prr-vencido-quota'],
    partes: [
      diz('É a parte das verbas contratadas por beneficiários intermediários e diretos com sede no concelho em projetos com prazo de conclusão anterior ao instantâneo e sem conclusão registada.',
        'It is the share of funds contracted by intermediate and direct beneficiaries headquartered in the municipality in projects with a completion deadline before the snapshot and no completion recorded.',
        L('derivation', 'As verbas contratadas por beneficiários intermediários e diretos com sede em Évora em projetos com prazo de conclusão anterior ao instantâneo e sem conclusão registada')),
    ],
  },
  {
    chaves: ['evora-receita-cobrada'],
    partes: [
      diz('É a receita que a câmara cobrou no ano', 'It is the revenue the council collected in the year', L('excerpt', 'As receitas cobradas no ano 2025 totalizaram'), ANO),
      diz(', pela prestação de contas.', ', from its annual accounts.', L('document.title', 'Prestação de Contas')),
    ],
  },
  {
    chaves: ['evora-saneamento-financeiro'],
    partes: [
      diz('É o montante do empréstimo de saneamento financeiro que a câmara contraiu', 'It is the amount of the financial recovery loan the council took out',
        L('excerpt', 'Passivos Financeiros'), O('rp4n-evora-saneamento', 'Empréstimo de Saneamento Financeiro')),
      diz(', como o relatório de gestão o apresenta.', ', as the management report presents it.', L('document.title', 'Relatório de Gestão')),
    ],
  },
];

/* =============================================================================
 * 7 · AS CONTAGENS QUE ESTE PROJETO FAZ DE SI E DA CARTA ADMINISTRATIVA
 * ============================================================================= */
const CONTAGENS = [
  {
    chaves: ['correcoes-publicadas'],
    partes: [
      diz('É o número de entradas do registo de correções que são correções, em todas as linhas do livro-razão', 'It is the number of entries in the corrections log that are corrections, across all the ledger rows',
        L('derivation', 'Contagem das entradas do registo de correções classificadas como «correcao», em todas as linhas do livro-razão.')),
      diz('; as atualizações não contam, porque uma atualização não é um erro admitido.', '; updates do not count, because an update is not an admitted error.',
        L('derivation', 'As atualizações não contam: uma atualização não é um erro admitido')),
    ],
  },
  {
    chaves: ['estudos-publicados'],
    partes: [
      diz('É o número de estudos distintos publicados', 'It is the number of distinct studies published', L('derivation', 'Contagem dos trabalhos distintos no arquivo de estudos.')),
      diz('; as traduções não contam como estudos novos.', '; translations do not count as new studies.', L('derivation', 'As traduções não contam como trabalhos novos.')),
    ],
  },
  {
    chaves: ['edicoes-publicadas'],
    partes: [
      diz('É o número de edições dos estudos publicados', 'It is the number of editions of the studies published', L('derivation', 'Contagem das edições no arquivo.')),
      diz('; a edição portuguesa e a inglesa do mesmo estudo contam em separado.', '; the Portuguese and English editions of the same study count separately.',
        L('derivation', 'As edições PT e EN do mesmo trabalho contam em separado.')),
    ],
  },
  {
    chaves: ['estudos-evora-publicados'],
    partes: [
      diz('É o número de estudos publicados cujo objeto é o concelho de Évora e a que nenhum outro estudo sucedeu.', 'It is the number of studies published whose subject is the municipality of Évora and that no other study has succeeded.',
        L('derivation', 'Contagem dos trabalhos do arquivo cujo objeto é o município de Évora e a que nenhum outro estudo sucedeu')),
    ],
  },
  {
    chaves: ['municipios-portugal-caop'],
    partes: [
      diz('É o número de concelhos de Portugal na carta administrativa oficial', 'It is the number of municipalities of Portugal in the official administrative map',
        L('document.title', 'Carta Administrativa Oficial de Portugal (CAOP)')),
      diz(': a soma dos três ficheiros que a Direção-Geral do Território publica, um por região.', ': the sum of the three files that the Directorate-General for the Territory publishes, one per region.',
        L('derivation', 'A Direção-Geral do Território não publica um ficheiro com os 308: publica três, um por região.')),
    ],
  },
  {
    chaves: ['municipios-acores-caop', 'municipios-continente-caop', 'municipios-madeira-caop'],
    partes: [
      diz('É o número de concelhos desta região na carta administrativa oficial', 'It is the number of municipalities of this region in the official administrative map',
        L('document.title', 'Carta Administrativa Oficial de Portugal (CAOP)'), L('document.locator', 'contagem das entradas de município')),
      diz(', contados linha a linha no ficheiro que a Direção-Geral do Território publica.', ', counted row by row in the file that the Directorate-General for the Territory publishes.',
        L('derivation', 'linhas, uma por município'), L('source', 'Direção-Geral do Território (DGT)')),
    ],
  },
  {
    chaves: ['municipios-com-estudo-aprofundado'],
    nome: { pt: 'Concelhos com estudo aprofundado', en: 'Municipalities with an in-depth study' },
    partes: [
      diz('É o número de concelhos com pelo menos um estudo aprofundado publicado.', 'It is the number of municipalities with at least one in-depth study published.',
        L('derivation', 'Contagem dos municípios com pelo menos um estudo aprofundado publicado.')),
    ],
  },
  {
    chaves: ['municipios-sem-estudo-aprofundado'],
    nome: { pt: 'Concelhos sem estudo aprofundado', en: 'Municipalities without an in-depth study' },
    partes: [
      diz('É o número de concelhos que ainda não têm estudo aprofundado publicado: o total dos concelhos menos os que já o têm.', 'It is the number of municipalities that do not yet have an in-depth study published: all municipalities minus those that already have one.',
        L('derivation', 'Total de municípios menos os que já têm estudo aprofundado publicado.')),
    ],
  },
];

/* =============================================================================
 * 8 · AS OUTRAS
 * ============================================================================= */
const OUTRAS = [
  {
    chaves: ['credito-malparado'],
    nome: { pt: 'Crédito malparado', en: 'Non-performing loans' },
    partes: [
      diz('É o crédito malparado, os empréstimos que não estão a ser pagos como combinado', 'It is non-performing loans, the loans that are not being repaid as agreed', L('document.title', 'Gross non-performing loans')),
      diz(', em percentagem de todos os empréstimos, contando as entidades nacionais e as estrangeiras.', ', as a percentage of all loans, counting domestic and foreign entities.',
        L('document.title', '% of gross loans'), L('document.title', 'domestic and foreign entities')),
    ],
  },
  {
    chaves: ['indice-de-percepcao-da-corrupcao'],
    nome: { pt: 'Índice de perceção da corrupção', en: 'Corruption Perceptions Index' },
    partes: [
      diz('É a pontuação no índice de perceção da corrupção', 'It is the score in the corruption perceptions index', L('document.title', 'Corruption Perceptions Index'), L('unit', 'pontuação')),
      diz(', como o Eurostat a publica.', ', as Eurostat publishes it.', L('source', 'Eurostat')),
    ],
  },
  {
    chaves: ['indice-de-percepcao-da-corrupcao-ue'],
    nome: { pt: 'Índice de perceção da corrupção' + UE, en: 'Corruption Perceptions Index' + IN_EU },
    partes: [
      diz('É a pontuação no índice de perceção da corrupção', 'It is the score in the corruption perceptions index', L('document.title', 'Corruption Perceptions Index'), L('unit', 'pontuação')),
      diz(', como o Eurostat a publica.', ', as Eurostat publishes it.', L('source', 'Eurostat')),
    ],
  },
  {
    chaves: ['saldo-natural-portugal'],
    nome: { pt: 'Saldo natural da população', en: 'Natural balance of the population' },
    partes: [
      diz('É o saldo natural da população de Portugal num ano, em pessoas', 'It is the natural balance of the population of Portugal in a year, in people',
        L('unit', 'pessoas'), ANO),
      diz(', como a PORDATA o publica.', ', as PORDATA publishes it.', L('source', 'PORDATA')),
    ],
  },
  {
    chaves: ['avisos-pt2030-abertos'],
    partes: [
      AUSENCIA,
    ],
  },
  {
    chaves: ['avisos-pt2030-pessoas-singulares'],
    partes: [
      AUSENCIA,
    ],
  },
  {
    chaves: ['ciclo-substituicao-condutas'],
    partes: [
      FONTE_DO_CALCULO_AUSENTE,
    ],
  },
  {
    chaves: ['agua-nao-faturada-portugal'],
    mostrarOrigens: true,
    partes: [diz('É a parte da água entrada no sistema que não é faturada, nas entidades gestoras em baixa de Portugal continental.', 'It is the share of water entering the system that is not billed by retail operators in mainland Portugal.', O('rp4n-agua-nao-faturada', 'percentagem de água entrada\nno sistema que não é faturada'), O('rp4n-agua-ambito','Avaliação em Portugal continental'), O('rp4n-agua-ambito','AA08 baixa')), diz(' A avaliação global abrange noventa e três por cento das entidades gestoras; a página apresenta também a avaliação em alta.', ' The overall assessment covers ninety-three per cent of operators; the page also presents the wholesale assessment.', O('rp4n-agua-ambito','(para 93 % de EG)'), O('rp4n-agua-ambito','AA08 alta')), diz(' O valor situa-se na faixa «Qualidade do serviço mediana» da ERSAR: acima de vinte e até trinta por cento, incluindo o limite superior.', ' The value falls in ERSAR’s “medium service quality” band: above twenty and up to thirty per cent, including the upper limit.', O('rp4n-agua-faixas','Qualidade do serviço mediana'), O('rp4n-agua-faixas',']20,0; 30,0]'))],
  },
  {
    chaves: ['penalizacao-antecipacao-um-ano-com-factor'],
    partes: [
      diz('É quanto a pensão baixa quando a reforma se antecipa um ano, somando o corte por cada mês de antecipação e o fator de sustentabilidade',
        'It is how much the pension falls when retirement is brought forward by one year, adding the cut for each month brought forward and the sustainability factor',
        L('excerpt', 'Quando se aplica adicionalmente o factor de sustentabilidade, a redução total é substancialmente mais elevada'), L('excerpt', 'para um ano de antecipação')),
      diz(', pelas contas do relatório final sobre a reforma da segurança social.', ', from the calculations of the final report on social security reform.',
        L('document.locator', 'Relatorio_Final_GT_Reforma_Seg_Social'), L('source', 'Grupo de Trabalho para a Reforma da Segurança Social')),
    ],
  },
  {
    chaves: ['penalizacao-antecipacao-um-ano-sem-factor'],
    partes: [
      diz('É quanto a pensão baixa quando a reforma se antecipa um ano, só pelo corte por cada mês de antecipação, sem o fator de sustentabilidade',
        'It is how much the pension falls when retirement is brought forward by one year, only from the cut for each month brought forward, without the sustainability factor',
        L('excerpt', 'Sem aplicação do factor de sustentabilidade, a penalização resulta apenas da redução de 0,5% por mês'), L('excerpt', 'para um ano de antecipação')),
      diz(', pelas contas do relatório final sobre a reforma da segurança social.', ', from the calculations of the final report on social security reform.',
        L('document.locator', 'Relatorio_Final_GT_Reforma_Seg_Social'), L('source', 'Grupo de Trabalho para a Reforma da Segurança Social')),
    ],
  },
  {
    chaves: ['penalizacao-antecipacao-um-ano-neutra'],
    mostrarOrigens: true,
    compara: {
      a:'penalizacao-legal-um-ano-antecipacao-2026', b:'penalizacao-antecipacao-um-ano-neutra',
      pt:{antes:' A penalização que a lei aplica por um ano de antecipação, sem o fator de sustentabilidade, é de cerca de ', menor:' e é menor do que a redução atuarialmente neutra de ', maior:' e é maior do que a redução atuarialmente neutra de ', igual:' e é igual à redução atuarialmente neutra de ', depois:'.'},
      en:{antes:' The statutory penalty for retiring one year early, excluding the sustainability factor, is about ', menor:' and is lower than the actuarially neutral reduction of ', maior:' and is higher than the actuarially neutral reduction of ', igual:' and is equal to the actuarially neutral reduction of ', depois:'.'},
      apoios:[O('pensao-legal','equivalente a cerca de 6% por ano')],
    },
    partes: [
      diz('É a estimativa preliminar do grupo de trabalho da redução atuarialmente neutra para antecipar a reforma um ano', 'It is the working group’s preliminary estimate of the actuarially neutral reduction for retiring one year early', O('pensao-estimativa','estimativa preliminar dos factores de ajustamento actuarial neutrais'), L('excerpt','Decrementos por reforma antecipada: caso geral')),
      diz(': a redução que, nas contas do grupo, deixa a pessoa sem vantagem financeira esperada entre reformar-se já e adiar a reforma um ano', ': the reduction that, in the group’s calculations, leaves the person with no expected financial advantage between retiring now and postponing retirement by one year', O('pensao-neutralidade','financeiramente indiferente, em termos de valor actual esperado')),
      diz(', contando as contribuições que deixam de ser feitas e os direitos que deixam de ser formados.', ', including contributions no longer paid and pension rights no longer accrued.', O('pensao-direitos','no esforço contributivo e no'), O('pensao-direitos','acréscimo de direitos sobre o sistema de pensões')),
      diz(' Não é a penalização legal por antecipação.', ' It is not the statutory early-retirement penalty.', O('pensao-legal','essa penalização isolada tende a ficar abaixo do valor actuarialmente neutral')),
    ],
  },
  {
    chaves: ['penalizacao-legal-um-ano-antecipacao'],
    partes: [diz('É a penalização legal por antecipar a reforma um ano, sem o fator de sustentabilidade, apresentada como aproximada pelo relatório do grupo de trabalho.', 'It is the statutory penalty for retiring one year early, excluding the sustainability factor, presented as approximate by the working group’s report.', L('excerpt','a penalização legal'), L('excerpt','equivalente a cerca de 6% por ano'), L('source','Grupo de Trabalho para a Reforma da Segurança Social'))],
  },
  {
    chaves: ['factor-sustentabilidade'],
    partes: [
      diz('É o fator que multiplica o montante das pensões de velhice que começam no ano e a que ele se aplica', 'It is the factor that multiplies the amount of the old-age pensions that start in the year and to which it applies',
        L('excerpt', 'Para as pensões de velhice iniciadas em 2026 às quais seja aplicável o factor de sustentabilidade, este factor é de'), TERMO('fator-de-sustentabilidade')),
      ponto,
    ],
  },
  {
    chaves: ['retribuicao-minima-mensal-doze-meses'],
    partes: [
      diz('É o salário mínimo mensal na série que o Eurostat publica duas vezes por ano, em euros por mês.', 'It is the monthly minimum wage in the series that Eurostat publishes twice a year, in euros a month.',
        L('document.title', 'Monthly minimum wages - bi-annual data'), L('unit', 'euros por mês'), L('source', 'Eurostat')),
    ],
  },
  {
    chaves: ['indice-de-divida-limite-legal'],
    partes: [
      diz('É o teto que a lei fixa ao índice de dívida das câmaras', 'It is the ceiling that the law sets on the councils’ debt index',
        L('excerpt', 'Índice de divida total (Índice permitido <= 150%)'), L('document.locator', 'LIMITE À DÍVIDA TOTAL — LEI 73/2013 (ART. 52º)')),
      diz(': a dívida não pode passar de uma vez e meia a média da receita corrente líquida cobrada nos três anos anteriores.', ': debt may not exceed one and a half times the average net current revenue collected in the previous three years.',
        O('c1c-dgal-limites', 'não pode ultrapassar, em 31 de dezembro de cada ano, 1,5 vezes a média da receita corrente líquida cobrada nos três exercícios anteriores')),
    ],
  },
];

export const FAMILIAS_PARTE_3 = [...AS_REGIOES, ...EVORA, ...CONTAGENS, ...OUTRAS];

/* =============================================================================
 * 9 · AS MEDIDAS DOS CONCELHOS
 * As oito notas de `MEDIDAS_DO_CONCELHO` são a frase da dobra do cartão de cada concelho e ficam como estão: aqui
 * escrevem-se só as partes e os apoios, que a K17 confere contra as 308 linhas de cada medida (a de Évora lê-se de
 * outra fonte, e por isso há apoios em alternativa). O limite da dívida não tem cartão nem nota: a frase é nova.
 * ============================================================================= */
const termo = (t) => ({ termo: t, lingua: 'pt-PT' });
const CONCELHOS = [
  {
    concelho: 'populacao',
    partes: [
      diz('Estima quantas pessoas vivem no concelho', 'Estimates how many people have their home in the municipality',
        L('document.title', 'População residente (N.º)'), OU(L('document.title', 'Estimativas anuais da população residente'), L('name', 'Estimativas anuais da população residente'))),
      diz(' (população residente)', ' (resident population)', L('document.title', 'População residente')),
      diz(', pela estimativa anual do INE.', ', from the statistics institute’s annual estimate.',
        OU(L('document.title', 'INE, Estimativas anuais da população residente'), L('name', 'INE, Estimativas anuais da população residente'))),
    ],
  },
  {
    concelho: 'poderDeCompra',
    partes: [
      diz('Índice do poder de compra por pessoa', 'Index of purchasing power per person', L('document.title', 'Poder de compra per capita')),
      diz(', em que Portugal vale cem: acima de cem, o poder de compra por pessoa no concelho é maior do que a média do país',
        ', where Portugal is one hundred: above one hundred, purchasing power per person in the municipality is higher than the country average', L('unit', 'índice (Portugal = 100)')),
      diz('; publicado pelo INE para todos os concelhos.', '; published for every municipality.',
        OU(L('document.title', 'INE, Estudo sobre o poder de compra concelhio'), L('name', 'INE, Estudo sobre o poder de compra concelhio'))),
    ],
  },
  {
    concelho: 'desempregoRegistado',
    partes: [
      diz('Conta as pessoas desempregadas inscritas nos serviços de emprego', 'Counts the unemployed people registered with the employment service',
        OU(L('document.title', 'Desemprego registado'), L('name', 'DESEMPREGO REGISTADO'), L('source', 'Instituto de Emprego da Madeira'))),
      diz(' no mês de referência', ' in the reference month', L('document.edition', 'dezembro de 2025')),
      diz(' (desemprego registado).', ' (registered unemployment).', OU(L('document.title', 'Desemprego registado'), L('name', 'DESEMPREGO REGISTADO'), O('rp4n-madeira', 'DESEMPREGADOS/DESEMPREGO REGISTADO'))),
    ],
  },
  {
    concelho: 'empresas',
    partes: [
      diz('Conta as empresas', 'Counts the enterprises', L('document.title', 'Empresas (N.º)')),
      diz(' atribuídas ao concelho', ' attributed to the municipality', OU(L('document.title', 'por Localização geográfica'), L('name', 'por Localização geográfica'))),
      diz(' (sistema de contas integradas das empresas).', ' (integrated business accounts system).',
        OU(L('document.title', 'Sistema de contas integradas das empresas'), L('name', 'Sistema de contas integradas das empresas'))),
    ],
  },
  {
    concelho: 'divida',
    partes: [
      diz('A dívida da câmara que conta para o limite legal', 'The council’s debt that counts towards the legal limit',
        O('c1c-dgal-limites', 'A dívida total de operações orçamentais do município'),
        OU(L('document.locator', 'Dívida total (Exclui dívidas não orçamentais'), L('document.locator', 'a dívida total que exclui as dívidas não orçamentais'))),
      diz(' no fim do ano', ' at year end', O('c1c-dgal-limites', 'em 31 de dezembro de cada ano')),
      diz(' (a «dívida total» da DGAL', [' (DGAL’s “', termo('dívida total'), '”'],
        L('source', 'Direção-Geral das Autarquias Locais (DGAL)'), OU(L('document.locator', 'Dívida total'), L('document.locator', 'a dívida total'))),
      diz(', sem as dívidas não orçamentais, as exceções da lei e a contribuição para o Fundo de Apoio Municipal).',
        [', without non-budget debts, the exceptions in the law and the contribution to the municipal support fund, the “', termo('Fundo de Apoio Municipal'), '”).'],
        OU(L('document.locator', 'Exclui dívidas não orçamentais, exceções previstas na Lei n.º 73/2013, no OE/2024 e FAM'), L('document.locator', 'exclui as dívidas não orçamentais, as exceções e o FAM'))),
    ],
  },
  {
    concelho: 'indice',
    partes: [
      diz('A dívida em percentagem da média da receita corrente líquida cobrada nos três anos anteriores', 'Debt as a percentage of the average net current revenue that the municipality collected in the previous three years',
        O('c1c-dgal-limites', 'a média da receita corrente líquida cobrada nos três exercícios anteriores'), L('unit', '% (limite legal = 150)')),
      diz('; a lei permite uma vez e meia essa média.', '; the law allows one and a half times that average.', O('c1c-dgal-limites', '1,5 vezes a média da receita corrente líquida')),
    ],
  },
  {
    concelho: 'pmp',
    partes: [
      diz('O número médio de dias que a câmara demora a pagar aos fornecedores', 'The average number of days the council takes to pay its suppliers',
        L('name', 'PMP (N.º dias)'), L('document.title', 'prazo médio de pagamento')),
      diz(' (prazo médio de pagamento)', [' (DGAL’s “', termo('prazo médio de pagamento'), '”'], L('document.title', 'Lista do prazo médio de pagamento registado por município')),
      diz(', pela lista anual da DGAL.', ', from its annual list).', L('source', 'Direção-Geral das Autarquias Locais (DGAL)'), L('document.title', 'Lista do prazo médio de pagamento')),
    ],
  },
  {
    concelho: 'ganho',
    partes: [
      diz('O que os trabalhadores por conta de outrem a tempo completo com remuneração completa', 'What full-time employees on full pay',
        O('ine-ganho-nota', 'trabalhadores por conta de outrem a tempo completo com remuneração completa')),
      diz(' ganham por mês, em média', ' earn per month, on average', L('document.title', 'Ganho médio mensal')),
      diz(', antes de descontos', ', before deductions', O('ine-ganho-conceito', 'Montante ilíquido')),
      diz(', pelos Quadros de Pessoal do Gabinete de Estratégia e Planeamento do Ministério do Trabalho.', ', from the staff records of the labour ministry’s strategy and planning office.',
        L('document.title', 'MTSSS/GEP, Quadros de pessoal')),
    ],
  },
  {
    concelho: 'limite',
    nome: { pt: 'Limite legal da dívida da câmara', en: 'Legal debt limit of the council' },
    partes: [
      diz('É o máximo de dívida que a lei deixa a câmara ter no fim do ano: uma vez e meia a média da receita corrente líquida cobrada nos três anos anteriores',
        'It is the most debt the law lets the council have at year end: one and a half times the average net current revenue collected in the previous three years',
        O('c1c-dgal-limites', 'não pode ultrapassar, em 31 de dezembro de cada ano, 1,5 vezes a média da receita corrente líquida cobrada nos três exercícios anteriores'),
        OU(L('document.locator', 'Limite 2024 (Art.º 52.º, n.º 1 da Lei n.º 73/2013)'), L('document.locator', 'o limite legal de endividamento do ano'))),
      diz(', pela conta da Direção-Geral das Autarquias Locais.', ', as the Directorate-General for Local Authorities counts it.', L('source', 'Direção-Geral das Autarquias Locais (DGAL)')),
    ],
  },
];

export const FAMILIAS_DOS_CONCELHOS_R4 = CONCELHOS;
export const FAMILIAS_R4 = [...FAMILIAS_PARTE_1, ...FAMILIAS_PARTE_2, ...FAMILIAS_PARTE_3, ...FAMILIAS_JD1];
