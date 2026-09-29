/**
 * ===========================================================================
 * A PRIMEIRA PÁGINA DE UM LEITOR COMUM (a peça PP1, 28.09.2026): os cinco blocos de
 * «O que se passa» e as seis entradas, escritos pelo lugar de direção (Claude Fable 5.1)
 * depois da decisão do diretor do mesmo dia (o leitor comum primeiro, §1.133), dos dois
 * memorandos de conteúdo (`design/observatorio/BRAINSTORM-conteudos-2026-09-28-*.md`) e
 * da maqueta que o diretor viu (a do Claude Opus 5.5, com as oito questões que deixou
 * abertas respondidas no brief)
 * ===========================================================================
 *
 * UM BLOCO É UMA DECLARAÇÃO, NÃO UMA FRASE ESCRITA PARA OS VALORES DE HOJE.
 *
 * As palavras fixas são do lugar de direção; os números e os ramos são da máquina, pela
 * gramática das leituras do RP1, com três pedaços novos:
 *   - uma cadeia: palavras fixas;
 *   - `{ claim: id, sufixo }`: o valor da linha, pelo `<Claim>` (a porta do recibo);
 *   - `{ periodo: id }`: o período de referência da linha, escrito como o sítio o escreve;
 *   - `{ compara: [a, b], menor, maior, igual }`: o ramo que os valores de a e b escolhem;
 *   - `{ referencia: id }` (novo na primeira página): o limiar da linha, lido de
 *     `src/data/enquadramento/referencias.json`, com o `data-referencia` da casa;
 *   - `{ publicado: id }` (novo): o `published_at` da linha, na forma de data da casa;
 *   - `{ nome: id }` (novo, só nos desenhos): o nome curto do cartão da linha.
 *
 * `condicao` é a lista de comparações que tem de ser verdadeira para o título e a frase
 * dizerem a verdade. Operadores: `>`, `<`, `=`, `!=` entre duas linhas (`a`, `b`), contra
 * um valor (`valor`) ou contra o limiar de uma linha (`referencia`); `mesmo_periodo` com
 * uma lista de linhas; `mes` para o mês do período de uma linha. Quando uma condição
 * falha, o bloco (ou a peça que a declara) SAI da página e fica um sinal para o lugar de
 * direção o reescrever: nunca fica uma manchete velha por cima de números novos, e nunca
 * uma atualização de rotina dos dados faz falhar a construção.
 *
 * Os desenhos declaram a forma, as linhas e a regra da escala. Cada número de um desenho
 * é o valor de uma linha; as pontas de uma escala escrita marcam-se como instrumento.
 *
 * As palavras que dizem o que uma medida é precisam de literal de origem, como as das
 * leituras dos cartões (a K17); quase todas as destes blocos já estão nos cartões do
 * sítio, e o brief diz onde. Sem travessões.
 */

const PC = ' %';

export const BLOCOS_DA_PRIMEIRA_PAGINA = [
  {
    id: 'precos',
    entrada: 'dinheiro',
    titulo: { pt: 'Os preços: os combustíveis sobem mais do que o resto', en: 'Prices: fuel is rising faster than the rest' },
    frase: {
      pt: ['Em ', { periodo: 'ipc-combustiveis-variacao-homologa' }, ', os combustíveis estavam ', { claim: 'ipc-combustiveis-variacao-homologa', sufixo: PC }, ' mais caros do que um ano antes. Os preços no seu conjunto subiram ', { claim: 'ipc-variacao-homologa', sufixo: PC }, '.'],
      en: ['In ', { periodo: 'ipc-combustiveis-variacao-homologa' }, ', fuel was ', { claim: 'ipc-combustiveis-variacao-homologa', sufixo: PC }, ' more expensive than a year earlier. Prices as a whole rose ', { claim: 'ipc-variacao-homologa', sufixo: PC }, '.'],
    },
    condicao: [
      { mesmo_periodo: ['ipc-combustiveis-variacao-homologa', 'ipc-rendas-variacao-homologa', 'ipc-alimentacao-variacao-homologa', 'ipc-energia-em-casa-variacao-homologa', 'ipc-variacao-homologa'] },
      { a: 'ipc-combustiveis-variacao-homologa', op: '>', b: 'ipc-rendas-variacao-homologa' },
      { a: 'ipc-combustiveis-variacao-homologa', op: '>', b: 'ipc-alimentacao-variacao-homologa' },
      { a: 'ipc-combustiveis-variacao-homologa', op: '>', b: 'ipc-energia-em-casa-variacao-homologa' },
      { a: 'ipc-combustiveis-variacao-homologa', op: '>', b: 'ipc-variacao-homologa' },
      { a: 'ipc-variacao-homologa', op: '>', valor: 0 },
    ],
    desenho: {
      forma: 'barras',
      linhas: ['ipc-combustiveis-variacao-homologa', 'ipc-rendas-variacao-homologa', 'ipc-alimentacao-variacao-homologa', 'ipc-energia-em-casa-variacao-homologa'],
      ordem: 'do maior para o menor',
      total: 'ipc-variacao-homologa',
      escala: 'uma só para as cinco barras, desde zero até ao maior valor',
    },
    pecas: [
      {
        id: 'uniao',
        pt: ['Na medida harmonizada que compara os países da União, os preços subiram ', { claim: 'ihpc-variacao-homologa', sufixo: PC }, ' em Portugal e ', { claim: 'ihpc-variacao-homologa-ue', sufixo: PC }, ' na União.'],
        en: ['On the harmonised measure that compares the countries of the Union, prices rose ', { claim: 'ihpc-variacao-homologa', sufixo: PC }, ' in Portugal and ', { claim: 'ihpc-variacao-homologa-ue', sufixo: PC }, ' in the Union.'],
        condicao: [
          { mesmo_periodo: ['ihpc-variacao-homologa', 'ihpc-variacao-homologa-ue', 'ipc-variacao-homologa'] },
          { a: 'ihpc-variacao-homologa', op: '>', valor: 0 },
          { a: 'ihpc-variacao-homologa-ue', op: '>', valor: 0 },
        ],
      },
    ],
    ressalva: {
      pt: 'Os preços no seu conjunto medem-se num cabaz de bens e serviços que representa o que as famílias compram.',
      en: 'Prices as a whole are measured on a basket of goods and services that represents what households buy.',
    },
  },
  {
    id: 'casa',
    entrada: 'casa',
    titulo: { pt: 'A casa: a média engana quem arrenda', en: 'Housing: the average hides the renters' },
    frase: {
      pt: ['Em Portugal, a parte das pessoas que gastam mais de 40 % do rendimento disponível com a casa é menor do que na União. Entre quem arrenda a preço de mercado, é maior.'],
      en: ['In Portugal, the share of people spending more than 40 % of their disposable income on housing is smaller than in the Union. Among people renting at market price, it is larger.'],
    },
    condicao: [
      { mesmo_periodo: ['sobrecarga-do-custo-da-habitacao-2025', 'sobrecarga-do-custo-da-habitacao-2025-ue', 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025', 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue'] },
      { a: 'sobrecarga-do-custo-da-habitacao-2025', op: '<', b: 'sobrecarga-do-custo-da-habitacao-2025-ue' },
      { a: 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025', op: '>', b: 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue' },
    ],
    desenho: {
      forma: 'paineis',
      paineis: [
        { titulo: { pt: 'Todas as pessoas', en: 'All people' }, pt: 'sobrecarga-do-custo-da-habitacao-2025', ue: 'sobrecarga-do-custo-da-habitacao-2025-ue' },
        { titulo: { pt: 'Quem arrenda a preço de mercado', en: 'Renting at market price' }, pt: 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025', ue: 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue' },
      ],
      escala: 'uma só para os dois painéis, desde zero até ao maior dos quatro valores',
      legenda: {
        pt: ['% das pessoas, ', { periodo: 'sobrecarga-do-custo-da-habitacao-2025' }],
        en: ['% of people, ', { periodo: 'sobrecarga-do-custo-da-habitacao-2025' }],
      },
    },
    pecas: [
      {
        id: 'precos-das-casas',
        pt: ['Os preços das casas subiram ', { claim: 'precos-da-habitacao-2025', sufixo: PC }, ' em ', { periodo: 'precos-da-habitacao-2025' }, ', na média do ano, contra ', { claim: 'precos-da-habitacao-2025-ue', sufixo: PC }, ' na União. Para a Comissão Europeia, uma subida acima de ', { referencia: 'precos-da-habitacao-2025' }, ' % num ano é sinal de possível desequilíbrio.'],
        en: ['House prices rose ', { claim: 'precos-da-habitacao-2025', sufixo: PC }, ' in ', { periodo: 'precos-da-habitacao-2025' }, ', on the year’s average, against ', { claim: 'precos-da-habitacao-2025-ue', sufixo: PC }, ' in the Union. For the European Commission, a rise above ', { referencia: 'precos-da-habitacao-2025' }, ' % in a year is a sign of a possible imbalance.'],
        condicao: [
          { mesmo_periodo: ['precos-da-habitacao-2025', 'precos-da-habitacao-2025-ue'] },
          { a: 'precos-da-habitacao-2025', op: '>', valor: 0 },
          { a: 'precos-da-habitacao-2025', op: '>', b: 'precos-da-habitacao-2025-ue' },
        ],
      },
      {
        id: 'rendas',
        caixa: true,
        titulo: { pt: 'As rendas no próximo ano', en: 'Rents next year' },
        pt: ['A referência para a atualização das rendas no próximo ano ficou em ', { claim: 'ipc-sem-habitacao-variacao-media-12-meses', sufixo: PC }, ': é a variação média de doze meses dos preços sem a habitação, em ', { periodo: 'ipc-sem-habitacao-variacao-media-12-meses' }, '.'],
        en: ['The reference for updating rents next year stood at ', { claim: 'ipc-sem-habitacao-variacao-media-12-meses', sufixo: PC }, ': it is the twelve-month average change in prices excluding housing, in ', { periodo: 'ipc-sem-habitacao-variacao-media-12-meses' }, '.'],
        // O INE diz que é o valor de agosto que serve de referência: noutro mês, a caixa sai.
        condicao: [{ periodo: 'ipc-sem-habitacao-variacao-media-12-meses', mes: 8 }],
      },
    ],
    ressalva: {
      pt: 'Este total mistura situações muito diferentes, e a Comissão Europeia diz que deve ler-se com a estrutura por regime de ocupação.',
      en: 'This total mixes very different situations, and the European Commission says it should be read together with the breakdown by tenure status.',
    },
  },
  {
    id: 'trabalho',
    entrada: 'trabalho',
    titulo: { pt: 'O trabalho: mais emprego, e mais desemprego de longa duração', en: 'Work: more employment, and more long-term unemployment' },
    frase: {
      pt: ['Em ', { periodo: 'taxa-de-emprego-2025' }, ', a parte das pessoas dos 20 aos 64 anos com emprego era maior em Portugal do que na União, e o desemprego ', { compara: ['taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-mip-2025-ue'], menor: ['era mais baixo'], maior: ['era mais alto'], igual: ['era o mesmo'] }, '. Mas era maior a parte de quem procura trabalho há um ano ou mais.'],
      en: ['In ', { periodo: 'taxa-de-emprego-2025' }, ', the share of people aged 20 to 64 in work was larger in Portugal than in the Union, and unemployment ', { compara: ['taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-mip-2025-ue'], menor: ['was lower'], maior: ['was higher'], igual: ['was the same'] }, '. But the share of people who had been looking for work for a year or more was larger.'],
    },
    condicao: [
      { mesmo_periodo: ['taxa-de-emprego-2025', 'taxa-de-emprego-2025-ue', 'taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-mip-2025-ue', 'desemprego-de-longa-duracao-2025', 'desemprego-de-longa-duracao-2025-ue'] },
      { a: 'taxa-de-emprego-2025', op: '>', b: 'taxa-de-emprego-2025-ue' },
      { a: 'desemprego-de-longa-duracao-2025', op: '>', b: 'desemprego-de-longa-duracao-2025-ue' },
    ],
    desenho: {
      forma: 'pares',
      pares: [
        { titulo: { pt: 'Com emprego, dos 20 aos 64 anos', en: 'In work, aged 20 to 64' }, pt: 'taxa-de-emprego-2025', ue: 'taxa-de-emprego-2025-ue', escala: 'de 0 a 100, com as duas pontas escritas' },
        { titulo: { pt: 'Desemprego', en: 'Unemployment' }, pt: 'taxa-de-desemprego-mip-2025', ue: 'taxa-de-desemprego-mip-2025-ue', escala: 'a mesma do desemprego de longa duração, com as duas pontas escritas' },
        { titulo: { pt: 'Desemprego de longa duração', en: 'Long-term unemployment' }, pt: 'desemprego-de-longa-duracao-2025', ue: 'desemprego-de-longa-duracao-2025-ue', escala: 'a mesma do desemprego, com as duas pontas escritas' },
      ],
    },
    pecas: [
      {
        id: 'salario',
        pt: ['A remuneração média antes de descontos de quem trabalha por conta de outrem passou de ', { claim: 'remuneracao-bruta-mensal-media-periodo-anterior', sufixo: ' euros por mês' }, ' no ', { periodo: 'remuneracao-bruta-mensal-media-periodo-anterior' }, ' para ', { claim: 'remuneracao-bruta-mensal-media', sufixo: ' euros por mês' }, ' no ', { periodo: 'remuneracao-bruta-mensal-media' }, '.'],
        en: ['Average pay before deductions for employees went from ', { claim: 'remuneracao-bruta-mensal-media-periodo-anterior', sufixo: ' euros a month' }, ' in the ', { periodo: 'remuneracao-bruta-mensal-media-periodo-anterior' }, ' to ', { claim: 'remuneracao-bruta-mensal-media', sufixo: ' euros a month' }, ' in the ', { periodo: 'remuneracao-bruta-mensal-media' }, '.'],
        condicao: [],
      },
    ],
    ressalva: {
      pt: 'O emprego conta-se entre as pessoas dos 20 aos 64 anos; o desemprego, entre as que trabalham ou procuram trabalho, dos 15 aos 74.',
      en: 'Employment is counted among people aged 20 to 64; unemployment, among those working or looking for work, aged 15 to 74.',
    },
  },
  {
    id: 'estado',
    entrada: 'estado',
    titulo: { pt: 'As contas do Estado', en: 'The state’s accounts' },
    frase: {
      pt: ['A dívida pública ', { compara: ['divida-publica-2025', 'divida-publica-2024'], menor: ['desceu'], maior: ['subiu'], igual: ['não mudou'] }, ' de ', { periodo: 'divida-publica-2024' }, ' para ', { periodo: 'divida-publica-2025' }, ' e está acima da média da União. Para a Comissão Europeia, uma dívida acima de ', { referencia: 'divida-publica-2025' }, ' % do PIB é sinal de possível desequilíbrio, e a de Portugal está acima.'],
      en: ['Public debt ', { compara: ['divida-publica-2025', 'divida-publica-2024'], menor: ['fell'], maior: ['rose'], igual: ['did not change'] }, ' from ', { periodo: 'divida-publica-2024' }, ' to ', { periodo: 'divida-publica-2025' }, ' and is above the Union average. For the European Commission, debt above ', { referencia: 'divida-publica-2025' }, ' % of GDP is a sign of a possible imbalance, and Portugal’s is above it.'],
    },
    condicao: [
      { mesmo_periodo: ['divida-publica-2025', 'divida-publica-2025-ue'] },
      { a: 'divida-publica-2025', op: '>', b: 'divida-publica-2025-ue' },
      { a: 'divida-publica-2025', op: '>', referencia: 'divida-publica-2025' },
    ],
    desenho: {
      forma: 'colunas',
      paineis: [
        { titulo: { pt: 'Portugal', en: 'Portugal' }, colunas: ['divida-publica-2024', 'divida-publica-2025'], referencia: 'divida-publica-2025' },
        { titulo: { pt: 'A União', en: 'The Union' }, colunas: ['divida-publica-2025-ue'] },
      ],
      escala: 'uma só para os dois painéis, desde zero até ao maior valor',
      legenda: { pt: ['% do PIB'], en: ['% of GDP'] },
      // A linha do limiar atravessa só o painel de Portugal: é o estado de um valor contra o seu limiar.
    },
    pecas: [
      {
        id: 'revisao-do-ine',
        pt: ['A notificação do INE de ', { publicado: 'divida-publica-2025-notificacao-ine-2026-09' }, ' já revê a dívida de ', { periodo: 'divida-publica-2025-notificacao-ine-2026-09' }, ' para ', { claim: 'divida-publica-2025-notificacao-ine-2026-09', sufixo: PC }, ' do PIB.'],
        en: ['INE’s notification of ', { publicado: 'divida-publica-2025-notificacao-ine-2026-09' }, ' already revises the ', { periodo: 'divida-publica-2025-notificacao-ine-2026-09' }, ' debt to ', { claim: 'divida-publica-2025-notificacao-ine-2026-09', sufixo: PC }, ' of GDP.'],
        // Quando o Eurostat publicar o valor revisto, as duas linhas ficam iguais e a peça sai sozinha.
        condicao: [
          { mesmo_periodo: ['divida-publica-2025-notificacao-ine-2026-09', 'divida-publica-2025'] },
          { a: 'divida-publica-2025-notificacao-ine-2026-09', op: '!=', b: 'divida-publica-2025' },
        ],
      },
    ],
    ressalva: {
      pt: 'É tudo o que as administrações públicas devem, em percentagem do PIB, o valor de tudo o que o país produz num ano.',
      en: 'It is everything general government owes, as a percentage of GDP, the value of everything the country produces in a year.',
    },
  },
  {
    id: 'pobreza',
    entrada: 'dinheiro',
    titulo: { pt: 'Pobreza e desigualdade não são a mesma coisa', en: 'Poverty and inequality are not the same thing' },
    frase: {
      pt: ['Em ', { periodo: 'risco-de-pobreza-ou-exclusao-2025' }, ', a parte das pessoas em risco de pobreza ou exclusão social era menor em Portugal do que na União. Mas os 20 % com mais rendimento recebiam ', { claim: 'racio-s80-s20-2025' }, ' vezes o que recebiam os 20 % com menos, contra ', { claim: 'racio-s80-s20-2025-ue' }, ' na União.'],
      en: ['In ', { periodo: 'risco-de-pobreza-ou-exclusao-2025' }, ', the share of people at risk of poverty or social exclusion was smaller in Portugal than in the Union. But the 20 % with the highest income received ', { claim: 'racio-s80-s20-2025' }, ' times what the 20 % with the lowest income received, against ', { claim: 'racio-s80-s20-2025-ue' }, ' in the Union.'],
    },
    condicao: [
      { mesmo_periodo: ['risco-de-pobreza-ou-exclusao-2025', 'risco-de-pobreza-ou-exclusao-2025-ue', 'racio-s80-s20-2025', 'racio-s80-s20-2025-ue'] },
      { a: 'risco-de-pobreza-ou-exclusao-2025', op: '<', b: 'risco-de-pobreza-ou-exclusao-2025-ue' },
      { a: 'racio-s80-s20-2025', op: '>', b: 'racio-s80-s20-2025-ue' },
    ],
    desenho: {
      forma: 'paineis',
      paineis: [
        { titulo: { pt: 'Em risco de pobreza ou exclusão social, % das pessoas', en: 'At risk of poverty or social exclusion, % of people' }, pt: 'risco-de-pobreza-ou-exclusao-2025', ue: 'risco-de-pobreza-ou-exclusao-2025-ue', escala: 'própria, desde zero, com as duas pontas escritas' },
        { titulo: { pt: 'Quantas vezes o rendimento dos 20 % de cima é o dos 20 % de baixo', en: 'How many times the income of the top 20 % is that of the bottom 20 %' }, pt: 'racio-s80-s20-2025', ue: 'racio-s80-s20-2025-ue', escala: 'própria, desde zero, cortada em unidades (cada unidade é o rendimento dos 20 % de baixo)' },
      ],
    },
    pecas: [],
    ressalva: {
      pt: 'O risco de pobreza mede-se contra o rendimento de cada país: é ter menos de 60 % do rendimento mediano, o do meio.',
      en: 'The risk of poverty is measured against each country’s own income: it means having less than 60 % of the median income, the one in the middle.',
    },
  },
];

/**
 * AS SEIS ENTRADAS (por baixo dos blocos). Cinco são páginas novas que agrupam os cartões
 * que o sítio já tem, pelo que um leitor procura; a sexta é a página dos lugares, que já
 * existe. Cada cartão dos temas está numa entrada, e só numa, salvo o índice da dívida do
 * município em relação ao limite legal, que é de um concelho e fica nos temas e na página
 * de Évora. Os blocos de cada entrada são os mesmos da primeira página, com as mesmas
 * condições.
 */
export const ENTRADAS = [
  {
    id: 'dinheiro',
    rota: { pt: '/o-meu-dinheiro/', en: '/en/my-money/' },
    nome: { pt: 'O meu dinheiro', en: 'My money' },
    linha: { pt: 'Os preços, os salários, as pensões e os apoios.', en: 'Prices, pay, pensions and benefits.' },
    blocos: ['precos', 'pobreza'],
    seccoes: [
      { nome: { pt: 'Os preços', en: 'Prices' }, cartoes: ['ipc-variacao-homologa', 'ipc-variacao-media-12-meses', 'ipc-alimentacao-variacao-homologa', 'ipc-energia-em-casa-variacao-homologa', 'ipc-combustiveis-variacao-homologa', 'ihpc-variacao-homologa'] },
      { nome: { pt: 'O salário', en: 'Pay' }, cartoes: ['remuneracao-bruta-mensal-media', 'ganho-medio-mensal-2024', 'retribuicao-minima-mensal-garantida-continente-2026', 'disparidade-salarial-entre-sexos-2024'] },
      { nome: { pt: 'As pensões e os apoios', en: 'Pensions and benefits' }, cartoes: ['pensao-media-anual-2025', 'beneficiarios-do-rsi-por-mil-2024', 'linha-de-risco-de-pobreza-2025'] },
      { nome: { pt: 'A pobreza e a desigualdade', en: 'Poverty and inequality' }, cartoes: ['risco-de-pobreza-ou-exclusao-2025', 'racio-s80-s20-2025'] },
      { nome: { pt: 'As dívidas e o crédito das famílias', en: 'Household debt and credit' }, cartoes: ['divida-das-familias-2025', 'fluxo-de-credito-as-familias-2025'] },
    ],
  },
  {
    id: 'trabalho',
    rota: { pt: '/o-meu-trabalho/', en: '/en/my-work/' },
    nome: { pt: 'O meu trabalho', en: 'My work' },
    linha: { pt: 'O emprego, o desemprego e os jovens.', en: 'Employment, unemployment and young people.' },
    blocos: ['trabalho'],
    seccoes: [
      { nome: { pt: 'O emprego e o desemprego', en: 'Employment and unemployment' }, cartoes: ['taxa-de-emprego-2025', 'taxa-de-actividade-2025', 'taxa-de-desemprego-mip-2025', 'desemprego-de-longa-duracao-2025'] },
      { nome: { pt: 'Os jovens e as diferenças entre homens e mulheres', en: 'Young people and the gaps between men and women' }, cartoes: ['jovens-nem-2025', 'disparidade-de-emprego-entre-sexos-2025'] },
      { nome: { pt: 'O custo do trabalho', en: 'The cost of labour' }, cartoes: ['custo-unitario-do-trabalho-2025'] },
    ],
  },
  {
    id: 'casa',
    rota: { pt: '/a-minha-casa/', en: '/en/my-home/' },
    nome: { pt: 'A minha casa', en: 'My home' },
    linha: { pt: 'O peso da casa, as rendas e os preços.', en: 'The cost of housing, rents and prices.' },
    blocos: ['casa'],
    seccoes: [
      { nome: { pt: 'O peso da casa', en: 'The cost of housing' }, cartoes: ['sobrecarga-do-custo-da-habitacao-2025', 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025'] },
      { nome: { pt: 'As rendas', en: 'Rents' }, cartoes: ['ipc-rendas-variacao-homologa', 'ipc-sem-habitacao-variacao-media-12-meses'] },
      { nome: { pt: 'Os preços e a construção', en: 'Prices and building' }, cartoes: ['precos-da-habitacao-2025', 'licencas-de-construcao-2025'] },
    ],
  },
  {
    id: 'escola-e-saude',
    rota: { pt: '/a-escola-e-a-saude/', en: '/en/school-and-health/' },
    nome: { pt: 'A escola e a saúde', en: 'School and health' },
    linha: { pt: 'O abandono escolar, a creche e o acesso aos cuidados.', en: 'Early school leaving, childcare and access to care.' },
    blocos: [],
    seccoes: [
      { nome: { pt: 'A escola', en: 'School' }, cartoes: ['abandono-escolar-precoce-2025', 'competencias-digitais-2025', 'criancas-em-creche-2025'] },
      { nome: { pt: 'A saúde', en: 'Health' }, cartoes: ['necessidades-medicas-nao-satisfeitas-2025'] },
    ],
  },
  {
    id: 'estado',
    rota: { pt: '/o-estado-e-a-economia/', en: '/en/state-and-economy/' },
    nome: { pt: 'O Estado e a economia', en: 'The state and the economy' },
    linha: { pt: 'A dívida, o défice, o crescimento e as contas com o exterior.', en: 'Debt, the deficit, growth and the external accounts.' },
    blocos: ['estado'],
    seccoes: [
      { nome: { pt: 'As contas do Estado', en: 'The state’s accounts' }, cartoes: ['divida-publica-2025', 'saldo-das-administracoes-publicas-2025', 'crescimento-da-despesa-liquida-2025'] },
      { nome: { pt: 'O crescimento e o investimento', en: 'Growth and investment' }, cartoes: ['pib-real-per-capita-2025', 'formacao-bruta-de-capital-fixo-2025', 'despesa-em-id-2024'] },
      { nome: { pt: 'As contas com o exterior', en: 'The external accounts' }, cartoes: ['saldo-da-balanca-corrente-2025', 'posicao-de-investimento-internacional-2025', 'taxa-de-cambio-efectiva-real-2025', 'desempenho-das-exportacoes-2025'] },
      { nome: { pt: 'As empresas', en: 'Companies' }, cartoes: ['divida-das-empresas-2025', 'fluxo-de-credito-as-empresas-2025'] },
      { nome: { pt: 'A justiça', en: 'Justice' }, cartoes: ['independencia-da-justica-2025'] },
    ],
  },
  {
    id: 'terra',
    rota: { pt: '/lugares/', en: '/en/places/' },
    nome: { pt: 'A minha terra', en: 'My area' },
    linha: { pt: 'O concelho, o distrito e a região.', en: 'The municipality, the district and the region.' },
    blocos: [],
    seccoes: [],
    existente: true,
  },
];
