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
export const FIGURAS_PDM = [
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
    /* «E A DESCER» SAI (F0.9, 03.09.2026). Era uma tendência, e o sítio publica
       um valor de 2025 e mais nenhum: não há linha de 2024 no livro-razão
       (`grep -rl tipsgo10 ledger/claims/` devolve este ficheiro e mais nenhum),
       e uma tendência sem os dois valores é uma afirmação que a página onde se
       lê não sustenta. O que fica é a definição da medida e o estado que a
       página calcula das suas próprias linhas: «acima do limiar» sai de
       `comparacaoComOLimiar()`, que compara o valor publicado com o limiar
       publicado, e os dois números estão na célula. */
    frase: {
      pt: [
        'Dívida bruta das administrações públicas, no conceito do Procedimento dos Défices Excessivos. Está acima do limiar do painel europeu.',
      ],
      en: [
        'General government gross debt, on the Excessive Deficit Procedure concept. It is above the European scoreboard threshold.',
      ],
    },
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
    /* A frase dizia o contrário do valor publicado, e dizia duas coisas que a
       página não pode mostrar.

       «O que o país deve ao exterior menos o que tem a haver dele» é passivo
       menos activo, que daria +50,2; a posição de investimento internacional é
       activo menos passivo, e a linha publica −50,2. A frase passa a ser uma
       definição, com o sinal do lado certo.

       «É a medida com a maior distância ao limiar» era falso no mesmo ecrã: a
       dívida pública está 29,7 pontos além dos 60 do seu limiar e esta está
       15,2 além dos −35. «A que mais tem melhorado» é uma tendência, e este
       sítio não publica série nenhuma. As duas saem. */
    frase: {
      pt: [
        'O que o país tem a haver do exterior menos o que lhe deve: negativo quando deve mais do que tem a haver.',
      ],
      en: [
        'What the country is owed from abroad minus what it owes abroad: negative when it owes more than it is owed.',
      ],
    },
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
    /* A MUDANÇA DE DEFINIÇÃO SAI (F0.9, 03.09.2026). É a oitava frase da §1.44,
       a «de outra natureza»: não compara valores nem afirma um sentido, mas
       afirma o que a FONTE media antes e quando mudou, e a página não tem nem o
       excerto que o diga nem uma linha do período anterior. Uma atribuição sem
       excerto é a mesma classe da advertência da Comissão, e sai pela mesma
       razão. Fica a definição da medida. Volta em F3.3, que dá excerto às
       definições. */
    frase: {
      pt: ['Custo do trabalho por unidade produzida, por hora trabalhada.'],
      en: ['Labour cost per unit of output, per hour worked.'],
    },
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
    /* A SEGUNDA ORAÇÃO SAI INTEIRA (F0.9, 03.09.2026), e são duas afirmações
       numa só: um valor de 2024, que a página não tem, e a comparação entre
       2024 e 2025, que sem ele não existe. `grep -rl tipsho20 ledger/claims/`
       devolve um só ficheiro, o de 2025. Fica a definição da medida; o estado
       lê-se no marcador da célula e na linha do limiar, que são calculados. */
    frase: {
      pt: ['Índice nominal de preços da habitação.'],
      en: ['Nominal house price index.'],
    },
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
export const FIGURAS_SOCIAL = [
  {
    claim: 'taxa-de-emprego-2025',
    quadro: 'social',
    documento: 'convergence.md:60 · «Employment rate | aux | ✓ | …»',
    nome: { pt: 'Taxa de emprego', en: 'Employment rate' },
    medida: {
      pt: ['Percentagem da população dos ', { nl: '20', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '64', motivo: 'escala-de-instrumento' }, ' anos · ', { ref: '2025' }],
      en: ['Percentage of the population aged ', { nl: '20', motivo: 'escala-de-instrumento' }, ' to ', { nl: '64', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2025' }],
    },
    /* «ESTÁ ACIMA DA MÉDIA DA UNIÃO» SAI (F0.9, 03.09.2026), e a glosa sai com
       ela: «que é uma posição relativa, não um limiar» explica uma comparação
       que deixa de estar escrita, e sozinha não diz nada. A média da União não é
       linha deste livro-razão: `grep -rl lfsi_emp_a ledger/claims/` devolve um
       só ficheiro, e é o de Portugal (`geo=PT`).

       E «INDICADOR PRINCIPAL DO PAINEL SOCIAL EUROPEU» SAI TAMBÉM (segunda
       passagem, leitura a frio do Codex, Blocking 4). Ficou na primeira
       passagem como se fosse a definição da medida, e não é: diz ONDE a medida
       está classificada, e não O QUE ela mede. É uma atribuição a uma
       instituição, da mesma classe da advertência da Comissão, e a página não
       tem o excerto que a sustente; o próprio cabeçalho desta lista escreve que
       nenhum ficheiro do livro-razão nomeia o Painel Social, e que a única
       origem é um documento do motor. O lugar dessa atribuição é o campo
       `documento` de cada entrada, que fica onde está.

       O QUE FICA É A DEFINIÇÃO, NAS PALAVRAS DA CASA: a proporção das pessoas
       dos 20 aos 64 anos com emprego. Os dois números levam a mesma marca de
       escala de instrumento que a linha da medida já usa. A atribuição volta em
       F3.3, com o excerto ao lado. */
    frase: {
      pt: [
        'Proporção das pessoas dos ',
        { nl: '20', motivo: 'escala-de-instrumento' },
        ' aos ',
        { nl: '64', motivo: 'escala-de-instrumento' },
        ' anos com emprego.',
      ],
      en: [
        'The share of people aged ',
        { nl: '20', motivo: 'escala-de-instrumento' },
        ' to ',
        { nl: '64', motivo: 'escala-de-instrumento' },
        ' who are in employment.',
      ],
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
    /* «ERA MAIS DE UM TERÇO NO INÍCIO DO SÉCULO» SAI (F0.9, 03.09.2026). É um
       valor do princípio do século, e o livro-razão não o tem:
       `grep -rl edat_lfse_14 ledger/claims/` devolve um só ficheiro, o de 2025.
       Fica a definição da medida, que é onde vive «secundário incompleto», a
       cadeia que a exceção `complet` do `VOZ-MARCADORES.md` dispensa. */
    frase: {
      pt: ['Jovens que deixaram a escola com o secundário incompleto e não estão em formação.'],
      en: ['Young people who left school without completing secondary education and are not in training.'],
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
    /* SAEM AS TRÊS ORAÇÕES QUE NÃO SÃO A DEFINIÇÃO (F0.9, 03.09.2026; a
       terceira na segunda passagem, leitura a frio do Codex, Blocking 5).
       Sai «Está abaixo da média europeia»: comparação contra um valor que a
       página não tem (`grep -rl tespm140 ledger/claims/` devolve um só
       ficheiro, `geo=PT`).
       Sai «e a própria Comissão adverte que só se lê ao lado do regime de
       propriedade»: atribuição sem excerto.
       E SAI «Onde a taxa de proprietários é alta, esta medida não vê quem não
       conseguiu comprar». A primeira passagem guardou-a como ressalva sobre os
       dados e enganou-se em duas coisas, e a leitura a frio mostrou as duas.
       «Onde a taxa de proprietários é alta» é uma comparação contra um patamar
       que a página não nomeia e contra um valor de propriedade que a célula não
       publica. E a conclusão não decorre da definição que está ao lado: a
       medida conta quem gasta mais de 40% do rendimento em habitação, e quem
       nunca comprou também tem custos de habitação e também pode ser contado.
       Uma conclusão que não segue dos dados não é a conclusão que a Emenda 18d
       permite: é interpretação, e interpretação vive nos estudos.
       Fica a definição da medida, e mais nada. A ressalva volta em F3.3, com o
       excerto da Comissão que a sustenta e com o nome de quem a fez. */
    frase: {
      pt: [
        'Proporção que gasta mais de ',
        { nl: '40', motivo: 'escala-de-instrumento' },
        '% do rendimento disponível em habitação.',
      ],
      en: [
        'The share spending more than ',
        { nl: '40', motivo: 'escala-de-instrumento' },
        '% of disposable income on housing.',
      ],
    },
  },
];

/**
 * As duas listas numa só, para quem precisa de percorrer o painel inteiro.
 * A ordem é a das duas listas, e não uma terceira.
 */
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
