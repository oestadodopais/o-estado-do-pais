/**
 * Os números da primeira página.
 *
 * Cada cartão é uma afirmação do livro-razão, mais as palavras que a rodeiam
 * nas duas línguas. As palavras não trazem números: onde é preciso um número,
 * há um { claim: … }; onde é preciso uma data, há um { ref: … }; onde é preciso
 * um limiar publicado, há um { nl: …, motivo: 'limiar-do-quadro' }.
 *
 * As frases dizem o que a medida é, não o que ela significa. A interpretação
 * é trabalho do director, e vai nos estudos.
 *
 * ESCOLHA DOS INDICADORES — 2026-08-12.
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

export const FIGURAS = [
  // ——— Os quatro limiares ultrapassados ———
  {
    claim: 'divida-publica-2025',
    nome: { pt: 'Dívida pública', en: 'Government debt' },
    medida: {
      pt: ['Percentagem do PIB · limiar ', { nl: '60', motivo: 'limiar-do-quadro' }, '% · ', { ref: '2025' }],
      en: ['Percentage of GDP · threshold ', { nl: '60', motivo: 'limiar-do-quadro' }, '% · ', { ref: '2025' }],
    },
    frase: {
      pt: [
        'Dívida bruta das administrações públicas, no conceito do Procedimento dos Défices Excessivos. Está acima do limiar do painel europeu, e a descer.',
      ],
      en: [
        'General government gross debt, on the Excessive Deficit Procedure concept. It is above the European scoreboard threshold, and falling.',
      ],
    },
  },
  {
    claim: 'posicao-de-investimento-internacional-2025',
    nome: { pt: 'Posição de investimento internacional', en: 'Net international investment position' },
    medida: {
      pt: ['Percentagem do PIB · limiar −', { nl: '35', motivo: 'limiar-do-quadro' }, '% · ', { ref: '2025' }],
      en: ['Percentage of GDP · threshold −', { nl: '35', motivo: 'limiar-do-quadro' }, '% · ', { ref: '2025' }],
    },
    frase: {
      pt: [
        'O que o país deve ao exterior menos o que tem a haver dele. É a medida com a maior distância ao limiar, e a que mais tem melhorado.',
      ],
      en: [
        'What the country owes the rest of the world, less what it is owed. It sits furthest from its threshold, and has improved most.',
      ],
    },
  },
  {
    claim: 'custo-unitario-do-trabalho-2025',
    nome: { pt: 'Custo unitário do trabalho', en: 'Unit labour cost' },
    medida: {
      pt: ['Variação em três anos · limiar ', { nl: '9', motivo: 'limiar-do-quadro' }, '% · ', { ref: '2025' }],
      en: ['Three-year change · threshold ', { nl: '9', motivo: 'limiar-do-quadro' }, '% · ', { ref: '2025' }],
    },
    frase: {
      pt: [
        'Custo do trabalho por unidade produzida, por hora trabalhada. A definição por hora é de ',
        { ref: '2024' },
        ': antes media-se por pessoa empregada.',
      ],
      en: [
        'Labour cost per unit of output, per hour worked. The per-hour definition dates from ',
        { ref: '2024' },
        '; before that it was measured per person employed.',
      ],
    },
  },
  {
    claim: 'precos-da-habitacao-2025',
    nome: { pt: 'Preços da habitação', en: 'House prices' },
    medida: {
      pt: ['Variação anual · limiar ', { nl: '9', motivo: 'limiar-do-quadro' }, '% · ', { ref: '2025' }],
      en: ['Annual change · threshold ', { nl: '9', motivo: 'limiar-do-quadro' }, '% · ', { ref: '2025' }],
    },
    frase: {
      pt: [
        'Índice nominal de preços da habitação. O limiar foi ultrapassado em ',
        { ref: '2024' },
        ' e o excesso quase duplicou no ano seguinte.',
      ],
      en: [
        'Nominal house price index. The threshold was breached in ',
        { ref: '2024' },
        ', and the overshoot nearly doubled the following year.',
      ],
    },
  },

  // ——— O mesmo quadro regista também onde o país está à frente ———
  {
    claim: 'taxa-de-emprego-2025',
    nome: { pt: 'Taxa de emprego', en: 'Employment rate' },
    medida: {
      pt: ['Percentagem da população dos ', { nl: '20', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '64', motivo: 'escala-de-instrumento' }, ' anos · ', { ref: '2025' }],
      en: ['Percentage of the population aged ', { nl: '20', motivo: 'escala-de-instrumento' }, ' to ', { nl: '64', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2025' }],
    },
    frase: {
      pt: [
        'Indicador principal do Painel Social Europeu. Está acima da média da União — que é uma posição relativa, não um limiar: muda quando os outros mudam.',
      ],
      en: [
        'A headline indicator of the European Social Scoreboard. It sits above the Union average — a relative position, not a threshold: it moves when other countries move.',
      ],
    },
  },
  {
    claim: 'criancas-em-creche-2025',
    nome: { pt: 'Crianças em creche', en: 'Children in formal childcare' },
    medida: {
      pt: ['Percentagem das crianças com menos de ', { nl: '3', motivo: 'escala-de-instrumento' }, ' anos · ', { ref: '2025' }],
      en: ['Percentage of children under ', { nl: '3', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2025' }],
    },
    frase: {
      pt: ['Crianças com menos de três anos em cuidados formais. É das medidas em que Portugal mais se destaca no painel social.'],
      en: ['Children under three in formal childcare. It is one of the measures where Portugal stands out most on the social scoreboard.'],
    },
  },
  {
    claim: 'abandono-escolar-precoce-2025',
    nome: { pt: 'Abandono escolar precoce', en: 'Early school leaving' },
    medida: {
      pt: ['Percentagem dos ', { nl: '18', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '24', motivo: 'escala-de-instrumento' }, ' anos · ', { ref: '2025' }],
      en: ['Percentage of those aged ', { nl: '18', motivo: 'escala-de-instrumento' }, ' to ', { nl: '24', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2025' }],
    },
    frase: {
      pt: ['Jovens que deixaram a escola com o secundário incompleto e não estão em formação. Era mais de um terço no início do século.'],
      en: ['Young people who left school without completing secondary education and are not in training. It was over a third at the turn of the century.'],
    },
  },

  // ——— O cartão que não se lê sozinho ———
  {
    claim: 'sobrecarga-do-custo-da-habitacao-2025',
    nome: { pt: 'Sobrecarga do custo da habitação', en: 'Housing cost overburden' },
    medida: {
      pt: ['Percentagem da população · ', { ref: '2025' }],
      en: ['Percentage of the population · ', { ref: '2025' }],
    },
    frase: {
      pt: [
        'Proporção que gasta mais de ',
        { nl: '40', motivo: 'escala-de-instrumento' },
        '% do rendimento disponível em habitação. Está abaixo da média europeia — e a própria Comissão adverte que só se lê ao lado do regime de propriedade. Onde a taxa de proprietários é alta, esta medida não vê quem não conseguiu comprar.',
      ],
      en: [
        'The share spending more than ',
        { nl: '40', motivo: 'escala-de-instrumento' },
        '% of disposable income on housing. It is below the European average — and the Commission itself warns it must be read alongside the tenure structure. Where owner-occupation is high, this measure does not see those who never bought.',
      ],
    },
  },
];
