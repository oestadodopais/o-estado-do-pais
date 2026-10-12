/**
 * A ESPECIFICAÇÃO DAS FRASES «O QUE É» DAS SÉRIES NO TEMPO SEM LINHA PRESA (bloco R4, 05.10.2026, o ponto 3 do brief).
 *
 * Catorze das vinte e quatro séries no tempo têm uma linha do livro-razão (a que o nome da série declara, ou a última
 * linha presa à série pelo campo `serie`): a frase dessas é a da linha, e não se escreve outra. As dez que não têm
 * escrevem-se aqui, parte a parte, cada parte com o literal que a apoia num campo da própria série (`S`), numa origem
 * declarada (`O`) ou, onde nenhum dos dois o diz, no nome que o projeto dá à série (`NOME`, que conta como da casa).
 * Nenhum algarismo nas frases: os períodos e os valores ficam para a frase do último ponto, pelos seus componentes.
 *
 * O compositor ao lado (`compor-series-r4.mjs`) confere cada apoio e escreve `src/data/o-que-e-das-series.mjs` e a
 * chave `series` de `tests/cartao/leituras-provadas.json`, que a K17 do `check:cartao` refaz por conta própria.
 */

/** Um literal de um campo da própria série. @param {string} campo @param {string} literal */
const S = (campo, literal) => ({ serie: 'propria', campo, literal });
/** Um literal de uma origem declarada. @param {string} origem @param {string} literal @param {string} [campo] */
const O = (origem, literal, campo = 'excerto') => ({ origem, campo, literal });
/** @param {string} pt @param {string} en @param {...any} apoios */
const diz = (pt, en, ...apoios) => ({ classe: 'diz', pt, en, apoios });
/** @param {string} pt @param {string} en */
const liga = (pt, en) => ({ classe: 'liga', pt, en });

const VARIACAO_HOMOLOGA = O('rp1-ihpc-homologa', 'the annual rate of change, representing the percentage change');
const MESMO_MES = O('rp1-ihpc-homologa', 'compared to the same month of the previous year');
const COMPARAVEL = O('rp1-ihpc-comparavel', 'gives comparable measures of inflation for the countries');
const NOME_DO_IHPC = S('name', 'Harmonised index of consumer prices (HICP)');

/** As partes de uma série do IHPC português, com a classe no meio. @param {any} classe */
const ihpcPortugues = (classe) => [
  diz('É quanto mudaram', 'It is how much', VARIACAO_HOMOLOGA),
  diz(', em Portugal,', ', in Portugal,', S('document.edition', 'geo=PT')),
  classe,
  diz(' face ao mesmo mês do ano anterior,', ' compared with the same month of the previous year,', MESMO_MES),
  diz(' na medida harmonizada que serve para comparar os países da União Europeia', ' in the harmonised measure used to compare the countries of the European Union', COMPARAVEL),
  diz(' (índice harmonizado de preços no consumidor)', ' (harmonised index of consumer prices)', NOME_DO_IHPC),
  liga('.', '.'),
];

/* RP4-n: as classes e a unidade anual vêm dos rótulos literais que o motor exporta dos corpos selados. */
const COMBUSTIVEIS = diz(' os preços dos combustíveis e lubrificantes para transporte pessoal', ' fuel and lubricant prices for personal transport changed', O('rp4n-combustiveis', 'Fuels and lubricants for personal transport equipment'));
/** O índice de preços no consumidor do INE, mês a mês ou ano a ano. @param {string} pt @param {string} en @param {string} literal */
const ipc = (pt, en, literal) => [
  diz(pt, en, S('name', literal)),
  diz(
    ' a evolução dos preços de um conjunto de bens e serviços que representa o que as famílias residentes gastam em consumo',
    ' the change in the prices of a set of goods and services that represents what resident households spend on consumption',
    O('rp1-ipc-metodo', 'medir a evolução dos preços de um conjunto de bens e serviços considerados representativos da estrutura de despesa monetária de consumo final das famílias residentes em Portugal'),
  ),
  diz(' (índice de preços no consumidor)', ' (consumer price index)', S('name', 'Índice de preços no consumidor (IPC, Base - 2025)')),
  liga('.', '.'),
];

export const SERIES_R4 = [
  {
    serie: 'serie-obrigacoes-do-tesouro-10-anos-rendibilidade',
    partes: [
      diz('É a taxa de juro anual a que o mercado empresta ao Estado', 'It is the annual interest rate at which the market lends to central government', O('jd1-eurostat-obrigacoes', 'central government bond yields'), O('jd1-eurostat-unidade', 'All the yields are expressed in percentages per annum.')),
      diz(' português', ' in Portugal', S('document.edition', 'geo=PT')),
      diz(', observada na compra e venda de obrigações já emitidas, antes de impostos', ', observed in trading of bonds already issued, before tax', O('jd1-eurostat-obrigacoes', 'on the secondary market, gross of tax'), O('jd1-mercado-secundario', 'previamente colocados em mercado primário')),
      diz(', a que faltam cerca de dez anos até ao reembolso', ', with around ten years remaining until repayment', O('jd1-eurostat-obrigacoes', 'with a residual maturity of around 10 years')),
      diz(', apresentada mês a mês', ', reported monthly', S('name', 'monthly data')),
      liga('.', '.'),
    ],
  },
  {
    serie: 'serie-cem-euros-de-2015-01',
    partes: [
      diz(
        'É o que cem euros compram em cada mês, contados em euros do primeiro mês da série,',
        'It is what one hundred euros buy each month, counted in euros of the series’ first month,',
        S('derivation', 'É o que cem euros compram no mês t, contado em euros de janeiro de 2015.'),
        S('derivation', 'Para cada mês t desde janeiro de 2015'),
        S('derivation_en', 'It is what one hundred euros buy in month t, counted in January 2015 euros.'),
        S('derivation_en', 'For each month t from January 2015'),
      ),
      diz(
        ' depois de descontada a subida dos preços no consumidor',
        ' net of the rise in consumer prices',
        S('derivation', '100 × I(janeiro de 2015) ÷ I(t)'),
        S('derivation_en', '100 × I(January 2015) ÷ I(t)'),
      ),
      diz(
        ' (índice de preços no consumidor do INE)',
        ' (the INE consumer price index)',
        S('derivation', 'índice de preços no consumidor do INE'),
        S('derivation_en', 'the INE consumer price index'),
      ),
      liga('.', '.'),
    ],
  },
  {
    serie: 'serie-ihpc-combustiveis-variacao-homologa-ue',
    partes: [
      diz('É quanto mudaram', 'It is how much', VARIACAO_HOMOLOGA),
      {...COMBUSTIVEIS, apoios: [O('rp4n-combustiveis-ue', 'Fuels and lubricants for personal transport equipment')]},
      diz(' face ao mesmo mês do ano anterior,', ' compared with the same month of the previous year,', MESMO_MES),
      diz(' na medida harmonizada que serve para comparar os países da União Europeia', ' in the harmonised measure used to compare the countries of the European Union', COMPARAVEL),
      diz(' (índice harmonizado de preços no consumidor)', ' (harmonised index of consumer prices)', NOME_DO_IHPC),
      diz(
        '; o valor da União é uma média dos países, ponderada pelo peso de cada um',
        '; the European Union’s value is an average of the countries, weighted by each country’s weight',
        O('rp1-ihpc-uniao', 'computed with a weighted average'),
        S('document.edition', 'geo=EU27_2020'),
      ),
      liga('.', '.'),
    ],
  },
  { serie: 'serie-ihpc-combustiveis-variacao-homologa', partes: ihpcPortugues(COMBUSTIVEIS) },
  {
    serie: 'serie-ihpc-energia-da-casa-variacao-homologa',
    partes: ihpcPortugues(diz(' os preços da eletricidade, do gás e de outros combustíveis', ' electricity, gas and other fuel prices changed', O('rp4n-energia', 'Electricity, gas and other fuels'))),
  },
  {
    serie: 'serie-ihpc-rendas-variacao-homologa',
    partes: ihpcPortugues(diz(' os preços das rendas', ' rent prices changed', O('rp4n-rendas', 'Actual rental payments made for housing'))),
  },
  { serie: 'serie-ipc-indice', partes: ipc('Mede, mês a mês,', 'It measures, month by month,', '; Mensal - INE') },
  { serie: 'serie-ipc-indice-anual', partes: ipc('Mede, ano a ano,', 'It measures, year by year,', '; Anual - INE') },
  {
    serie: 'serie-precos-da-habitacao-variacao-homologa',
    partes: [
      diz('É quanto mudaram num ano', 'It is the change over a year in', O('rp4n-hpi-anual', 'Annual rate of change')),
      diz(' os preços de transação das casas compradas pelas famílias', ' the transaction prices of dwellings purchased by households', O('glossario-hpi', 'measures the changes in the transaction prices of dwellings purchased by households')),
      diz(' em Portugal', ' in Portugal', S('document.edition', 'geo=PT')),
      diz(', novas e usadas,', ', new and existing,', O('eurostat-tipsho20-descricao', 'both new and existing')),
      diz(' em cada trimestre', ' in each quarter', S('name', 'House price index - quarterly data'), S('document.edition', 'freq=Q')),
      diz(' (índice de preços da habitação)', ' (house price index)', S('name', 'House price index')),
      liga('.', '.'),
    ],
  },
  {
    serie: 'serie-remuneracao-bruta-mensal-media-anual',
    partes: [
      diz('É o que quem trabalha por conta de outrem', 'It is what employees', O('rp1-remuneracao-trabalhadores', 'universo de trabalhadores por conta de outrem')),
      diz(' ganha em média por mês,', ' earn on average per month,', S('name', 'Remuneração bruta mensal média por trabalhador'), S('unit', '€ por mês')),
      diz(' antes de descontos', ' before deductions', O('rp1-remuneracao-bruta', 'Remuneração ilíquida')),
      diz(' e contando os subsídios,', ' and including holiday and Christmas pay,', O('rp1-remuneracao-subsidios', '“Subsídio de férias” e “Subsídio de Natal”')),
      diz(' em cada ano,', ' in each year,', S('name', '; Anual - Declaração Mensal')),
      diz(
        ' nos postos de trabalho declarados à Segurança Social e à Caixa Geral de Aposentações;',
        ' in the jobs declared to Social Security and to the civil-service pension fund;',
        S('name', 'Declaração Mensal de Remunerações da Segurança Social e Relação Contributiva da Caixa Geral de Aposentações'),
      ),
      diz(
        ' cada pessoa conta tantas vezes quantos os empregos que tem',
        ' each person counts as many times as the jobs they hold',
        O('rp1-remuneracao-trabalhadores', 'aqueles com mais de um emprego são contabilizados tantas vezes quanto o número de empregos que tenham'),
      ),
      diz(' (remuneração bruta mensal média)', ' (average gross monthly pay)', S('name', 'Remuneração bruta mensal média')),
      liga('.', '.'),
    ],
  },
  {
    serie: 'serie-remuneracao-bruta-mensal-media-real',
    partes: [
      diz(
        'É a remuneração média antes de descontos de cada ano',
        'It is each year’s average pay before deductions',
        S('derivation', 'W é a remuneração bruta mensal média por trabalhador que o INE publica por ano'),
        S('derivation_en', 'W is the average gross monthly pay per worker that INE publishes by year'),
      ),
      diz(
        ' contada nos euros do ano que a unidade nomeia,',
        ' counted in euros of the year the unit names,',
        S('derivation', 'É a remuneração de cada ano contada em euros de 2015'),
        S('derivation_en', 'counted in 2015 euros'),
        S('unit', 'euros de 2015 por mês'),
      ),
      diz(
        ' isto é, descontada a subida dos preços desde esse ano',
        ' that is, net of the rise in prices since that year',
        S('derivation', 'isto é, descontada a subida dos preços desde esse ano'),
        S('derivation_en', 'that is, net of the rise in prices since that year'),
      ),
      liga('.', '.'),
    ],
  },
];
