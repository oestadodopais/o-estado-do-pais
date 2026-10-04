/**
 * ===========================================================================
 * A PRIMEIRA PÁGINA DE UM LEITOR COMUM · as declarações (bloco PP1, 28.09.2026)
 * ===========================================================================
 *
 * DE ONDE VEM. É a cópia das declarações do lugar de direção,
 * `design/observatorio/leituras/BLOCOS-primeira-pagina-2026-09-28.mjs`, que o brief
 * `design/observatorio/BRIEF-PP1-a-primeira-pagina-de-um-leitor-comum.md` manda trazer
 * para aqui «salvo os acertos que a auditoria exigir, cada um com o literal». As palavras
 * são do lugar de direção; os números e os ramos são da máquina, pela gramática das
 * leituras dos cartões (`src/lib/leitura-da-medida.mjs`), com três pedaços novos que o
 * cabeçalho do ficheiro de direção define: `referencia`, `publicado` e `nome`.
 *
 * O QUE MUDOU EM RELAÇÃO AO FICHEIRO DE DIREÇÃO, e é tudo. O guião
 * `design/especime-v3/medicoes/pp1-2026-09-28/acertos-pp1.mjs` prova-o: rende as duas
 * declarações pedaço a pedaço e exige que o texto seja o mesmo, carácter a carácter,
 * salvo os acertos de palavras listados em `ACERTOS_DAS_PALAVRAS`, e que as únicas
 * chaves novas sejam as de forma abaixo.
 *
 *   F1 · OS ALGARISMOS DAS PALAVRAS FIXAS SAEM DA CADEIA. O portão de HTML fecha a
 *        construção com um algarismo sem origem, e o resolvedor das leituras recusa um
 *        algarismo numa palavra fixa. «mais de 40 %», «dos 20 aos 64 anos», «dos 15 aos
 *        74», «os 20 % com mais rendimento» e «60 % do rendimento mediano» passam a
 *        pedaços `{ nl, motivo: 'escala-de-instrumento' }`, o mesmo motivo que as
 *        leituras dos cartões dão aos mesmos números da definição da mesma medida. O
 *        texto rendido é o mesmo, e cada algarismo tem o literal que o traz na
 *        auditoria (`tests/inicio/blocos-provados.json`). Os títulos dos desenhos com
 *        algarismos passam, por isso, de cadeia a lista de pedaços.
 *   F2 · A RÉGUA DE CADA ESCALA, ESCRITA PARA A MÁQUINA (`regua`), ao lado das palavras
 *        do lugar de direção (`escala`), que ficam como estavam. `desde` é a ponta de
 *        baixo; `ate` é um número declarado, `'maior'` (o maior valor desenhado) ou
 *        `'redonda'` (o primeiro número redondo, 1, 2, 2,5 ou 5 vezes uma potência de
 *        dez, que não fica abaixo do maior valor desenhado: é a leitura da casa de «com
 *        as duas pontas escritas» quando a ponta de cima não vem declarada, e a razão é
 *        que uma ponta igual ao maior valor seria um valor de uma linha escrito como
 *        escala); `pontas` diz que as duas pontas se escrevem, com o motivo
 *        `escala-de-instrumento`; `grupo` junta os painéis que partilham a escala;
 *        `unidades` corta cada barra em unidades de um.
 *   F3 · O SUFIXO DOS VALORES DESENHADOS (`sufixo`). A maqueta que o diretor viu
 *        escrevia «%» ao lado do valor onde nem a legenda nem o título do painel dizem a
 *        unidade (os preços e o trabalho), e o valor sozinho onde dizem: fica escrito
 *        aqui em vez de adivinhado.
 *
 * NENHUM VALOR MUDA E NENHUMA LINHA NOVA ENTRA: as linhas são as que as declarações
 * nomeiam, todas no livro-razão (o §0 do brief mediu 30 em 30). Sem travessões.
 */

import { RESSALVAS_DA_UNIAO } from './ressalvas-da-uniao.mjs';

const PC = ' %';
/** Um algarismo da definição de uma medida, com o motivo das leituras dos cartões. @param {string} n */
const nl = (n) => ({ nl: n, motivo: 'escala-de-instrumento' });

/**
 * OS ACERTOS DE PALAVRAS, cada um com o literal que o sustenta. Uma palavra fixa que a
 * auditoria recuse (diz o que uma medida é e não tem literal em nenhuma origem nem em nenhum
 * campo da linha), ou que um portão que protege a voz recuse, troca-se pela mais próxima que
 * os cartões já sustentam, e fica aqui escrita. A auditoria não recusou nenhuma; a célula 11
 * do `check:voz` recusou quatro.
 * @type {{ id: string, onde: string, de: string, para: string, literal: string, origem: string }[]}
 */
export const ACERTOS_DAS_PALAVRAS = [
  /* A1 a A4 · «a casa» é uma palavra que o sítio nunca usa para si (a norma §1.3), e a célula 11 do
     `check:voz` recusa-a por expressão regular (`scripts/voz-palavras.mjs`, «a casa»), sem distinguir
     o sentido. As quatro cadeias do lugar de direção dizem «casa» no sentido de habitação, que é o que
     o projeto mede; o portão não se toca, e a palavra troca-se pela que a leitura do cartão da
     sobrecarga já usa para a mesma coisa, «do rendimento disponível com a habitação»
     (`src/data/leituras-das-medidas.mjs`), apoiada no glossário do Eurostat («total housing costs»). */
  { id: 'A1', onde: 'casa · título · pt', de: 'A casa: a média engana quem arrenda', para: 'A habitação: a média engana quem arrenda', literal: 'total housing costs', origem: 'glossario-sobrecarga' },
  { id: 'A2', onde: 'casa · frase · pt', de: ' % do rendimento disponível com a casa é menor do que na União.', para: ' % do rendimento disponível com a habitação é menor do que na União.', literal: 'total housing costs', origem: 'glossario-sobrecarga' },
  { id: 'A3', onde: 'entrada casa · linha · pt', de: 'O peso da casa, as rendas e os preços.', para: 'O peso da habitação, as rendas e os preços.', literal: 'total housing costs', origem: 'glossario-sobrecarga' },
  { id: 'A4', onde: 'entrada casa · secção · pt', de: 'O peso da casa', para: 'O peso da habitação', literal: 'total housing costs', origem: 'glossario-sobrecarga' },
];

export const BLOCOS_DA_PRIMEIRA_PAGINA = [
  {
    id: 'precos',
    serie: 'serie-ipc-variacao-homologa',
    entrada: 'precos',
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
      regua: { desde: 0, ate: 'maior' },
      sufixo: PC,
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
    entrada: 'habitacao',
    titulo: { pt: 'A habitação: a média engana quem arrenda', en: 'Housing: the average hides the renters' },
    frase: {
      pt: ['Em Portugal, a parte das pessoas que gastam mais de ', nl('40'), ' % do rendimento disponível com a habitação é menor do que na União. Entre quem arrenda a preço de mercado, é maior.'],
      en: ['In Portugal, the share of people spending more than ', nl('40'), ' % of their disposable income on housing is smaller than in the Union. Among people renting at market price, it is larger.'],
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
      regua: { desde: 0, ate: 'maior' },
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
    /* A RESSALVA DA COMISSÃO vive desde a §1.140 (29.09.2026) numa fonte só, que
       o cartão e os recibos da medida também leem: o texto é o que estava aqui,
       sem uma palavra mudada. */
    ressalva: RESSALVAS_DA_UNIAO['sobrecarga-do-custo-da-habitacao-2025'],
  },
  {
    id: 'trabalho',
    entrada: 'emprego',
    titulo: { pt: 'O trabalho: mais emprego, e mais desemprego de longa duração', en: 'Work: more employment, and more long-term unemployment' },
    frase: {
      pt: ['Em ', { periodo: 'taxa-de-emprego-2025' }, ', a parte das pessoas dos ', nl('20'), ' aos ', nl('64'), ' anos com emprego era maior em Portugal do que na União, e o desemprego ', { compara: ['taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-mip-2025-ue'], menor: ['era mais baixo'], maior: ['era mais alto'], igual: ['era o mesmo'] }, '. Mas era maior a parte de quem procura trabalho há um ano ou mais.'],
      en: ['In ', { periodo: 'taxa-de-emprego-2025' }, ', the share of people aged ', nl('20'), ' to ', nl('64'), ' in work was larger in Portugal than in the Union, and unemployment ', { compara: ['taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-mip-2025-ue'], menor: ['was lower'], maior: ['was higher'], igual: ['was the same'] }, '. But the share of people who had been looking for work for a year or more was larger.'],
    },
    condicao: [
      { mesmo_periodo: ['taxa-de-emprego-2025', 'taxa-de-emprego-2025-ue', 'taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-mip-2025-ue', 'desemprego-de-longa-duracao-2025', 'desemprego-de-longa-duracao-2025-ue'] },
      { a: 'taxa-de-emprego-2025', op: '>', b: 'taxa-de-emprego-2025-ue' },
      { a: 'desemprego-de-longa-duracao-2025', op: '>', b: 'desemprego-de-longa-duracao-2025-ue' },
    ],
    desenho: {
      forma: 'pares',
      pares: [
        { titulo: { pt: ['Com emprego, dos ', nl('20'), ' aos ', nl('64'), ' anos'], en: ['In work, aged ', nl('20'), ' to ', nl('64')] }, pt: 'taxa-de-emprego-2025', ue: 'taxa-de-emprego-2025-ue', escala: 'de 0 a 100, com as duas pontas escritas', regua: { desde: 0, ate: 100, pontas: true } },
        { titulo: { pt: 'Desemprego', en: 'Unemployment' }, pt: 'taxa-de-desemprego-mip-2025', ue: 'taxa-de-desemprego-mip-2025-ue', escala: 'a mesma do desemprego de longa duração, com as duas pontas escritas', regua: { desde: 0, ate: 'redonda', pontas: true, grupo: 'desemprego' } },
        { titulo: { pt: 'Desemprego de longa duração', en: 'Long-term unemployment' }, pt: 'desemprego-de-longa-duracao-2025', ue: 'desemprego-de-longa-duracao-2025-ue', escala: 'a mesma do desemprego, com as duas pontas escritas', regua: { desde: 0, ate: 'redonda', pontas: true, grupo: 'desemprego' } },
      ],
      sufixo: PC,
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
      pt: ['O emprego conta-se entre as pessoas dos ', nl('20'), ' aos ', nl('64'), ' anos; o desemprego, entre as que trabalham ou procuram trabalho, dos ', nl('15'), ' aos ', nl('74'), '.'],
      en: ['Employment is counted among people aged ', nl('20'), ' to ', nl('64'), '; unemployment, among those working or looking for work, aged ', nl('15'), ' to ', nl('74'), '.'],
    },
  },
  {
    id: 'estado',
    entrada: 'estado-e-economia',
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
      regua: { desde: 0, ate: 'maior' },
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
    entrada: 'pobreza-e-desigualdade',
    titulo: { pt: 'Pobreza e desigualdade não são a mesma coisa', en: 'Poverty and inequality are not the same thing' },
    frase: {
      pt: ['Em ', { periodo: 'risco-de-pobreza-ou-exclusao-2025' }, ', a parte das pessoas em risco de pobreza ou exclusão social era menor em Portugal do que na União. Mas os ', nl('20'), ' % com mais rendimento recebiam ', { claim: 'racio-s80-s20-2025' }, ' vezes o que recebiam os ', nl('20'), ' % com menos, contra ', { claim: 'racio-s80-s20-2025-ue' }, ' na União.'],
      en: ['In ', { periodo: 'risco-de-pobreza-ou-exclusao-2025' }, ', the share of people at risk of poverty or social exclusion was smaller in Portugal than in the Union. But the ', nl('20'), ' % with the highest income received ', { claim: 'racio-s80-s20-2025' }, ' times what the ', nl('20'), ' % with the lowest income received, against ', { claim: 'racio-s80-s20-2025-ue' }, ' in the Union.'],
    },
    condicao: [
      { mesmo_periodo: ['risco-de-pobreza-ou-exclusao-2025', 'risco-de-pobreza-ou-exclusao-2025-ue', 'racio-s80-s20-2025', 'racio-s80-s20-2025-ue'] },
      { a: 'risco-de-pobreza-ou-exclusao-2025', op: '<', b: 'risco-de-pobreza-ou-exclusao-2025-ue' },
      { a: 'racio-s80-s20-2025', op: '>', b: 'racio-s80-s20-2025-ue' },
    ],
    desenho: {
      forma: 'paineis',
      paineis: [
        { titulo: { pt: 'Em risco de pobreza ou exclusão social, % das pessoas', en: 'At risk of poverty or social exclusion, % of people' }, pt: 'risco-de-pobreza-ou-exclusao-2025', ue: 'risco-de-pobreza-ou-exclusao-2025-ue', escala: 'própria, desde zero, com as duas pontas escritas', regua: { desde: 0, ate: 'redonda', pontas: true } },
        { titulo: { pt: ['Quantas vezes o rendimento dos ', nl('20'), ' % de cima é o dos ', nl('20'), ' % de baixo'], en: ['How many times the income of the top ', nl('20'), ' % is that of the bottom ', nl('20'), ' %'] }, pt: 'racio-s80-s20-2025', ue: 'racio-s80-s20-2025-ue', escala: 'própria, desde zero, cortada em unidades (cada unidade é o rendimento dos 20 % de baixo)', regua: { desde: 0, ate: 'unidades', unidades: true } },
      ],
    },
    pecas: [],
    /* AS TRÊS PARTES DA DEFINIÇÃO (passagem K2-c, 02.10.2026, achado 7 da leitura a frio do Codex): o número do painel é
       o da pobreza ou exclusão social, e a explicação só dizia o rendimento abaixo de 60 % da mediana. Diz agora as três
       situações da definição declarada (`DEFINICOES_DAS_MEDIDAS`, a do glossário do Eurostat) e que cada pessoa conta
       uma vez, para os dois números do painel, o de Portugal e o da União; os valores não mudam. */
    ressalva: {
      pt: ['Os dois números, o de Portugal e o da União, contam quem está em pelo menos uma de três situações: rendimento abaixo de ', nl('60'), ' % do rendimento mediano do seu país, o do meio; privação material e social grave; ou viver num agregado com intensidade de trabalho muito baixa. Cada pessoa conta uma só vez.'],
      en: ['Both figures, Portugal’s and the Union’s, count the people in at least one of three situations: income below ', nl('60'), ' % of their country’s median income, the one in the middle; severe material and social deprivation; or living in a household with very low work intensity. Each person counts only once.'],
    },
  },
];

/** N1: as oito portas por assunto, com as secções e os cartões existentes. */
export const ENTRADAS = [
  {
    id: 'precos',
    rota: { pt: '/precos/', en: '/en/prices/' },
    nome: { pt: 'Preços', en: 'Prices' },
    linha: {
      pt: 'Os números de Portugal sobre os preços dos bens e serviços.',
      en: 'Portugal’s figures on the prices of goods and services.'
    },
    seccoes: [
      {
        nome: { pt: 'Os preços', en: 'Prices' },
        cartoes: [
          'ipc-variacao-homologa',
          'ipc-variacao-media-12-meses',
          'ipc-alimentacao-variacao-homologa',
          'ipc-energia-em-casa-variacao-homologa',
          'ipc-combustiveis-variacao-homologa',
          'ihpc-variacao-homologa',
          'ihpc-variacao-homologa-ue'
        ]
      }
    ]
  },
  {
    id: 'salarios-pensoes-e-apoios',
    rota: { pt: '/salarios-pensoes-e-apoios/', en: '/en/pay-pensions-and-benefits/' },
    nome: { pt: 'Salários, pensões e apoios', en: 'Pay, pensions and benefits' },
    linha: {
      pt: 'Os números de Portugal sobre os salários, as pensões e os apoios sociais.',
      en: 'Portugal’s figures on pay, pensions and social benefits.'
    },
    seccoes: [
      {
        nome: { pt: 'O salário', en: 'Pay' },
        cartoes: [
          'remuneracao-bruta-mensal-media',
          'ganho-medio-mensal-2024',
          'retribuicao-minima-mensal-garantida-continente-2026',
          'disparidade-salarial-entre-sexos-2024'
        ]
      },
      {
        nome: { pt: 'As pensões e os apoios', en: 'Pensions and benefits' },
        cartoes: [ 'pensao-media-anual-2025', 'beneficiarios-do-rsi-por-mil-2024', 'linha-de-risco-de-pobreza-2025' ]
      }
    ]
  },
  {
    id: 'pobreza-e-desigualdade',
    rota: { pt: '/pobreza-e-desigualdade/', en: '/en/poverty-and-inequality/' },
    nome: { pt: 'Pobreza e desigualdade', en: 'Poverty and inequality' },
    linha: {
      pt: 'Os números de Portugal sobre a pobreza, a desigualdade, as dívidas e o crédito das famílias.',
      en: 'Portugal’s figures on poverty, inequality, household debt and credit.'
    },
    seccoes: [
      {
        nome: { pt: 'A pobreza e a desigualdade', en: 'Poverty and inequality' },
        cartoes: [ 'risco-de-pobreza-ou-exclusao-2025', 'racio-s80-s20-2025' ]
      },
      {
        nome: { pt: 'As dívidas e o crédito das famílias', en: 'Household debt and credit' },
        cartoes: [ 'divida-das-familias-2025', 'fluxo-de-credito-as-familias-2025' ]
      }
    ]
  },
  {
    id: 'emprego',
    rota: { pt: '/emprego/', en: '/en/employment/' },
    nome: { pt: 'Emprego', en: 'Employment' },
    linha: {
      pt: 'Os números de Portugal sobre o emprego, o desemprego, os jovens e o custo do trabalho.',
      en: 'Portugal’s figures on employment, unemployment, young people and labour costs.'
    },
    seccoes: [
      {
        nome: { pt: 'O emprego e o desemprego', en: 'Employment and unemployment' },
        cartoes: [
          'taxa-de-emprego-2025',
          'taxa-de-actividade-2025',
          'taxa-de-desemprego-mip-2025',
          'desemprego-de-longa-duracao-2025'
        ]
      },
      {
        nome: {
          pt: 'Os jovens e as diferenças entre homens e mulheres',
          en: 'Young people and the gaps between men and women'
        },
        cartoes: [ 'jovens-nem-2025', 'disparidade-de-emprego-entre-sexos-2025' ]
      },
      {
        nome: { pt: 'O custo do trabalho', en: 'The cost of labour' },
        cartoes: [ 'custo-unitario-do-trabalho-2025' ]
      }
    ]
  },
  {
    id: 'habitacao',
    rota: { pt: '/habitacao/', en: '/en/housing/' },
    nome: { pt: 'Habitação', en: 'Housing' },
    linha: {
      pt: 'Os números de Portugal sobre o peso da habitação, as rendas, os preços e a construção.',
      en: 'Portugal’s figures on housing costs, rents, prices and building.'
    },
    seccoes: [
      {
        nome: { pt: 'O peso da habitação', en: 'The cost of housing' },
        cartoes: [ 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025', 'sobrecarga-do-custo-da-habitacao-2025' ]
      },
      {
        nome: { pt: 'As rendas', en: 'Rents' },
        cartoes: [ 'ipc-rendas-variacao-homologa', 'ipc-sem-habitacao-variacao-media-12-meses' ]
      },
      {
        nome: { pt: 'Os preços e a construção', en: 'Prices and building' },
        cartoes: [ 'precos-da-habitacao-2025', 'licencas-de-construcao-2025' ]
      }
    ]
  },
  {
    id: 'educacao-e-saude',
    rota: { pt: '/educacao-e-saude/', en: '/en/education-and-health/' },
    nome: { pt: 'Educação e saúde', en: 'Education and health' },
    linha: {
      pt: 'Os números de Portugal sobre o abandono escolar, as competências digitais, a creche e o acesso aos cuidados de saúde.',
      en: 'Portugal’s figures on early school leaving, digital skills, childcare and access to healthcare.'
    },
    seccoes: [
      {
        nome: { pt: 'A escola', en: 'School' },
        cartoes: [ 'abandono-escolar-precoce-2025', 'competencias-digitais-2025', 'criancas-em-creche-2025' ]
      },
      { nome: { pt: 'A saúde', en: 'Health' }, cartoes: [ 'necessidades-medicas-nao-satisfeitas-2025' ] }
    ]
  },
  {
    id: 'estado-e-economia',
    rota: { pt: '/estado-e-economia/', en: '/en/state-and-economy/' },
    nome: { pt: 'Estado e economia', en: 'State and economy' },
    linha: {
      pt: 'Os números de Portugal sobre as contas públicas, o crescimento, o investimento, as contas com o exterior, as empresas e a justiça.',
      en: 'Portugal’s figures on public accounts, growth, investment, external accounts, companies and justice.'
    },
    seccoes: [
      {
        nome: { pt: 'Contas públicas', en: 'Public accounts' },
        cartoes: [ 'divida-publica-2025', 'saldo-das-administracoes-publicas-2025', 'crescimento-da-despesa-liquida-2025' ]
      },
      {
        nome: { pt: 'O crescimento e o investimento', en: 'Growth and investment' },
        cartoes: [ 'pib-real-per-capita-2025', 'formacao-bruta-de-capital-fixo-2025', 'despesa-em-id-2024' ]
      },
      {
        nome: { pt: 'As contas com o exterior', en: 'The external accounts' },
        cartoes: [
          'saldo-da-balanca-corrente-2025',
          'posicao-de-investimento-internacional-2025',
          'taxa-de-cambio-efectiva-real-2025',
          'desempenho-das-exportacoes-2025'
        ]
      },
      {
        nome: { pt: 'As empresas', en: 'Companies' },
        cartoes: [ 'divida-das-empresas-2025', 'fluxo-de-credito-as-empresas-2025' ]
      },
      { nome: { pt: 'A justiça', en: 'Justice' }, cartoes: [ 'independencia-da-justica-2025' ] }
    ]
  },
  {
    id: 'lugares',
    rota: { pt: '/lugares/', en: '/en/places/' },
    nome: { pt: 'Lugares', en: 'Places' },
    linha: {
      pt: 'Os números de Portugal sobre os concelhos, os distritos, as ilhas e as regiões.',
      en: 'Portugal’s figures on municipalities, districts, islands and regions.'
    },
    seccoes: [
      { nome: { pt: 'Os concelhos', en: 'Municipalities' }, cartoes: [] },
      { nome: { pt: 'As regiões', en: 'Regions' }, cartoes: [] },
      { nome: { pt: 'Os distritos e as ilhas', en: 'Districts and islands' }, cartoes: [] },
      { nome: { pt: 'As medidas dos concelhos', en: 'Municipal figures' }, cartoes: [] }
    ],
    existente: true,
    /* L2a (01.10.2026, §1.149): o mapa inteiro saiu da primeira página e é de «Lugares»; a porta
       leva um sinal, o contorno do país, sem dados (`SinalDosLugares.astro`). */
    sinal: 'contorno-do-pais'
  }
];

/** O limite legal pertence às comparações municipais, nos lugares. */
export const CARTOES_FORA_DAS_ENTRADAS = {
  "indice-de-divida-limite-legal": "O limite legal e a contagem das câmaras pertencem aos lugares."
};
