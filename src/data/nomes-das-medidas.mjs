/**
 * ---------------------------------------------------------------------------
 * OS NOMES DO PROJETO PARA AS MEDIDAS QUE SÓ TINHAM O NOME DA FONTE
 * ---------------------------------------------------------------------------
 * Bloco P3, 16.09.2026, item 1 do brief («Os nomes das medidas»). A norma §1.5
 * diz que uma medida tem três nomes, cada um no seu lugar: o oficial (o do INE
 * primeiro, o da PORDATA a seguir), no recibo; o nome corrente do projeto, no
 * título do cartão; e o nome que a fonte usa, na língua dela, também no recibo.
 * O que faltava era o do meio.
 *
 * O QUE ISTO CORRIGE, MEDIDO E NÃO SUPOSTO. A 16.09.2026, sobre o `dist/` da
 * cabeça `796c9032`, 164 cartões de 236 (82 por edição, de 81 linhas distintas)
 * encabeçavam-se com o título do documento de onde a linha foi lida ou com o
 * rótulo que a fonte imprime por cima da figura. O leitor da página da área da
 * habitação lia «Residential building permits - annual data»; o da economia lia
 * quatro vezes «Evolução endividamento total» e onze vezes «Gross domestic
 * product (GDP) at current market prices by NUTS 2 region». Nenhum desses é um
 * nome: são o nome de um ficheiro e o cabeçalho de uma coluna.
 *
 * ---------------------------------------------------------------------------
 * A REGRA DE QUEM ESCREVE (brief P3, §2b, a emenda de 16.09.2026)
 * ---------------------------------------------------------------------------
 * Um nome do projeto é **um nome corrente em português para a medida que a
 * linha declara**, com as palavras que a medida pede e o menos possível. A
 * primeira redação da regra dizia «duas a cinco palavras, sem sigla»: a leitura
 * a frio do Codex de 16.09.2026 (achado 7) mostrou 72 dos 105 nomes fora dessa
 * janela, e nenhum deles por estar mal escrito, porque a medida de um concelho
 * precisa de dizer o concelho e a de uma região precisa de dizer a região. Uma
 * regra que 72 de 105 nomes quebram é uma contagem e não uma regra, e o brief
 * emendou-a. O que fica:
 *
 *   · o nome DIZ O QUE A MEDIDA MEDE. Se não a distingue de outra do mesmo
 *     cartão, ou não diz a grandeza, faltam-lhe palavras: «Peso das quatro
 *     maiores empresas» não dizia peso em quê, e «Distância à média europeia»
 *     não dizia distância de quê (achado 6);
 *   · os PARTIDOS escrevem-se como a imprensa os escreve, e com eles as siglas
 *     que ela usa como palavras correntes: PS, CDU, AD, Chega, PIB, PRR. Uma
 *     sigla que o leitor de jornal lê todos os dias é o nome da coisa;
 *   · o JARGÃO DA FONTE não entra. «Atuarialmente neutro» é a expressão de um
 *     relatório técnico e não diz nada a quem lê: o que ela quer dizer é «sem
 *     custo para o sistema», e é isso que o nome escreve (achado 7). O nome de
 *     um ficheiro e o cabeçalho de uma coluna continuam a não ser um nome.
 *
 * Não substitui o nome oficial e não compete com ele: onde o motor confirmar
 * que a medida do INE ou da PORDATA é a mesma, o nome oficial rende-se no
 * recibo, com o endereço e o dia em que foi lido.
 *
 * O TERRITÓRIO ENTRA NO NOME ONDE ELE DISTINGUE, e não por enfeite. O cartão
 * mostra o nome, o valor, a unidade, o período e a marca da fonte, e mais nada:
 * numa página onde onze regiões publicam o mesmo produto interno bruto por
 * habitante no mesmo ano, um nome sem o território dava onze cartões iguais. O
 * mesmo vale para as medidas do concelho de Évora quando partilham a página com
 * medidas do país.
 *
 * NENHUM ALGARISMO. Um nome não traz números: onde a medida fala de idades, de
 * anos ou de quantidades, quem as diz é a unidade da linha e o período dela.
 *
 * O QUE ESTA LISTA NÃO É. Não é uma tradução do nome da fonte, e não se mede
 * contra ele: o nome da fonte continua no recibo, na língua em que ela o
 * escreveu. Não é o nome oficial: esse vem de fora, de
 * `src/data/enquadramento/nomes.json`, e só entra quando o motor o confirma
 * como a mesma medida.
 *
 * A MARCA É `data-nome="projeto"`, e é ela que faz do nome uma coisa conferida:
 * `scripts/medir-defeitos.mjs` lê este ficheiro por conta própria e compara,
 * carácter a carácter, o texto rendido com o nome DAQUELA linha nesta edição;
 * `scripts/check-voz.mjs` fecha a construção quando não bate certo.
 */

/**
 * Os nomes do projeto, por linha do livro-razão.
 *
 * @type {Record<string, ParDeLinguas>}
 */
export const NOMES_DO_PROJETO = {
  'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025': {
    pt: 'Sobrecarga do custo da habitação, inquilinos a preço de mercado',
    en: 'Housing cost overburden, tenants at market rent',
  },
  'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2024': {
    pt: 'Sobrecarga do custo da habitação, inquilinos a preço de mercado',
    en: 'Housing cost overburden, tenants at market rent',
  },
  'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue': {
    pt: 'Sobrecarga do custo da habitação, inquilinos a preço de mercado na União Europeia',
    en: 'Housing cost overburden, tenants at market rent in the European Union',
  },
  'saldo-das-administracoes-publicas-2024': {
    pt: 'Saldo das administrações públicas', en: 'General government balance',
  },
  'disparidade-salarial-entre-sexos-2023': {
    pt: 'Disparidade salarial entre sexos', en: 'Gender pay gap',
  },
  'crescimento-da-despesa-liquida-2024': {
    pt: 'Crescimento da despesa líquida', en: 'Net expenditure growth',
  },
  /* ---------------------------------------------------------- água e ambiente */
  'agua-nao-faturada-portugal-2024': {
    pt: 'Água não faturada',
    en: 'Unbilled water',
  },

  /* ------------------------------------------------------ trabalho e pensões */
  'criancas-em-creche-2025': {
    pt: 'Crianças em creche',
    en: 'Children in formal childcare',
  },
  'disparidade-de-emprego-entre-sexos-2025': {
    pt: 'Diferença de emprego entre homens e mulheres',
    en: 'Employment gap between men and women',
  },
  'retribuicao-minima-mensal-doze-meses-2026': {
    pt: 'Salário mínimo por mês',
    en: 'Monthly minimum wage',
  },
  'factor-sustentabilidade-2026': {
    pt: 'Fator de sustentabilidade das pensões',
    en: 'Pension sustainability factor',
  },
  'penalizacao-antecipacao-um-ano-neutra': {
    pt: 'Corte na pensão por um ano de antecipação, sem custo para o sistema',
    en: 'Pension cut for one year of early retirement, at no cost to the system',
  },
  'penalizacao-antecipacao-um-ano-sem-factor-2026': {
    pt: 'Corte na pensão por um ano de antecipação, sem o fator de sustentabilidade',
    en: 'Pension cut for one year of early retirement, without the sustainability factor',
  },
  'penalizacao-antecipacao-um-ano-com-factor-2026': {
    pt: 'Corte na pensão por um ano de antecipação, com o fator de sustentabilidade',
    en: 'Pension cut for one year of early retirement, with the sustainability factor',
  },

  /* ------------------------ as cinco que só tinham o nome oficial (21.09.2026) */
  /* Até 21.09.2026 estas cinco medidas encabeçavam-se com o nome oficial do INE
     ou da PORDATA, que era o segundo degrau da escada dos nomes. Nesse dia o
     lugar de direção encontrou no ar nomes do INE de outros indicadores
     (`DECISIONS.md` §1.115), e um nome oficial passou a render-se só quando o
     motor o confirma como a mesma medida; nenhum está confirmado, e por isso
     estas cinco ganham o nome que a norma §1.5 lhes pede desde o princípio: o
     do projeto. Cada nome diz o que a linha mede, pelas palavras do rótulo da
     fonte que a linha guarda. */
  'formacao-bruta-de-capital-fixo-2025': {
    pt: 'Investimento (formação bruta de capital fixo)',
    en: 'Investment (gross fixed capital formation)',
  },
  'despesa-em-id-2024': {
    pt: 'Despesa em investigação e desenvolvimento',
    en: 'Spending on research and development',
  },
  'competencias-digitais-2025': {
    pt: 'Pessoas com competências digitais básicas ou superiores',
    en: 'People with basic or above basic digital skills',
  },
  'independencia-da-justica-2025': {
    pt: 'Perceção de independência da justiça',
    en: 'Perceived independence of the justice system',
  },
  'necessidades-medicas-nao-satisfeitas-2025': {
    pt: 'Necessidades de cuidados médicos por satisfazer',
    en: 'Unmet need for medical care',
  },

  /* ----------------------------------------------------------- habitação */
  'licencas-de-construcao-2025': {
    pt: 'Área licenciada para habitação',
    en: 'Floor area licensed for housing',
  },

  /* --------------------------------------------- o país e as suas regiões */
  'pib-pc-portugal-2024': {
    pt: 'Produto interno bruto por habitante em Portugal',
    en: 'Gross domestic product per inhabitant in Portugal',
  },
  'pib-pc-norte-2024': {
    pt: 'Produto interno bruto por habitante no Norte',
    en: 'Gross domestic product per inhabitant in the Norte region',
  },
  'pib-pc-centro-2024': {
    pt: 'Produto interno bruto por habitante no Centro',
    en: 'Gross domestic product per inhabitant in the Centro region',
  },
  'pib-pc-grande-lisboa-2024': {
    pt: 'Produto interno bruto por habitante na Grande Lisboa',
    en: 'Gross domestic product per inhabitant in Greater Lisbon',
  },
  'pib-pc-peninsula-de-setubal-2024': {
    pt: 'Produto interno bruto por habitante na Península de Setúbal',
    en: 'Gross domestic product per inhabitant in Península de Setúbal',
  },
  'pib-pc-oeste-e-vale-do-tejo-2024': {
    pt: 'Produto interno bruto por habitante no Oeste e Vale do Tejo',
    en: 'Gross domestic product per inhabitant in Oeste e Vale do Tejo',
  },
  'pib-pc-alentejo-2024': {
    pt: 'Produto interno bruto por habitante no Alentejo',
    en: 'Gross domestic product per inhabitant in the Alentejo',
  },
  'pib-pc-alentejo-2000': {
    pt: 'Produto interno bruto por habitante no Alentejo',
    en: 'Gross domestic product per inhabitant in the Alentejo',
  },
  'pib-pc-algarve-2024': {
    pt: 'Produto interno bruto por habitante no Algarve',
    en: 'Gross domestic product per inhabitant in the Algarve',
  },
  'pib-pc-acores-2024': {
    pt: 'Produto interno bruto por habitante nos Açores',
    en: 'Gross domestic product per inhabitant in the Azores',
  },
  'pib-pc-madeira-2024': {
    pt: 'Produto interno bruto por habitante na Madeira',
    en: 'Gross domestic product per inhabitant in Madeira',
  },
  'portugal-concentracao-vab4-2024': {
    pt: 'Peso das quatro maiores empresas no valor acrescentado, em Portugal',
    en: 'Share of the four largest companies in gross value added, in Portugal',
  },
  'municipios-portugal-caop-2025': {
    pt: 'Concelhos em Portugal',
    en: 'Municipalities in Portugal',
  },
  'municipios-continente-caop-2025': {
    pt: 'Concelhos no continente',
    en: 'Municipalities on the mainland',
  },
  'municipios-acores-caop-2025': {
    pt: 'Concelhos nos Açores',
    en: 'Municipalities in the Azores',
  },
  'municipios-madeira-caop-2025': {
    pt: 'Concelhos na Madeira',
    en: 'Municipalities in Madeira',
  },

  /* ----------------------------------------------- o concelho de Évora: economia */
  'evora-poder-de-compra-2023': {
    pt: 'Poder de compra por habitante em Évora',
    en: 'Purchasing power per inhabitant in Évora',
  },
  'alentejo-central-poder-de-compra-2023': {
    pt: 'Poder de compra por habitante no Alentejo Central',
    en: 'Purchasing power per inhabitant in Alentejo Central',
  },
  'evora-vab-empresarial-2024': {
    pt: 'Valor acrescentado bruto das empresas de Évora',
    en: 'Gross value added by companies in Évora',
  },
  'evora-concentracao-vab4-2024': {
    pt: 'Peso das quatro maiores empresas no valor acrescentado, em Évora',
    en: 'Share of the four largest companies in gross value added, in Évora',
  },
  'evora-desemprego-registado-2013': {
    pt: 'Desemprego registado em Évora',
    en: 'Registered unemployment in Évora',
  },
  'evora-desemprego-registado-2024': {
    pt: 'Desemprego registado em Évora',
    en: 'Registered unemployment in Évora',
  },

  /* ------------------------------------ o concelho de Évora: contas públicas */
  'evora-orcamento-2025': {
    pt: 'Orçamento do município de Évora',
    en: 'Budget of the municipality of Évora',
  },
  'evora-receita-cobrada-2025': {
    pt: 'Receita cobrada pelo município de Évora',
    en: 'Revenue collected by the municipality of Évora',
  },
  'evora-despesa-paga-2025': {
    pt: 'Despesa paga pelo município de Évora',
    en: 'Spending paid by the municipality of Évora',
  },
  'evora-execucao-da-receita-2021': {
    pt: 'Receita cobrada face ao orçamento',
    en: 'Revenue collected against the budget',
  },
  'evora-execucao-da-receita-2025': {
    pt: 'Receita cobrada face ao orçamento',
    en: 'Revenue collected against the budget',
  },
  'evora-pagamentos-em-atraso-2025': {
    pt: 'Pagamentos em atraso do município de Évora',
    en: 'Payments in arrears of the municipality of Évora',
  },
  'evora-prazo-medio-de-pagamento-2023': {
    pt: 'Prazo médio de pagamento a fornecedores',
    en: 'Average time to pay suppliers',
  },
  'evora-prazo-medio-de-pagamento-2025': {
    pt: 'Prazo médio de pagamento a fornecedores',
    en: 'Average time to pay suppliers',
  },
  'evora-contas-2024-votos-favor': {
    pt: 'Votos a favor da aprovação das contas',
    en: 'Votes in favour of approving the accounts',
  },
  'evora-contas-2024-votos-contra': {
    pt: 'Votos contra a aprovação das contas',
    en: 'Votes against approving the accounts',
  },

  /* ----------------------------------- o concelho de Évora: dívida e limites */
  'evora-divida-total-2017': {
    pt: 'Dívida total do município de Évora',
    en: 'Total debt of the municipality of Évora',
  },
  'evora-divida-total-2021': {
    pt: 'Dívida total do município de Évora',
    en: 'Total debt of the municipality of Évora',
  },
  'evora-divida-total-2024': {
    pt: 'Dívida total do município de Évora',
    en: 'Total debt of the municipality of Évora',
  },
  'evora-divida-total-2025': {
    pt: 'Dívida total do município de Évora',
    en: 'Total debt of the municipality of Évora',
  },
  'evora-divida-dgal-2014': {
    pt: 'Endividamento total do município de Évora',
    en: 'Total indebtedness of the municipality of Évora',
  },
  'evora-divida-dgal-2017': {
    pt: 'Endividamento total do município de Évora',
    en: 'Total indebtedness of the municipality of Évora',
  },
  'evora-divida-dgal-2021': {
    pt: 'Endividamento total do município de Évora',
    en: 'Total indebtedness of the municipality of Évora',
  },
  'evora-divida-dgal-2024': {
    pt: 'Endividamento total do município de Évora',
    en: 'Total indebtedness of the municipality of Évora',
  },
  'evora-divida-31-10-2013': {
    pt: 'Dívida registada no início do mandato',
    en: 'Debt recorded at the start of the term',
  },
  'evora-divida-inicio-mandato-reexpressa': {
    pt: 'Dívida do início do mandato, reexpressa',
    en: 'Debt at the start of the term, restated',
  },
  'evora-limite-divida-2025': {
    pt: 'Limite da dívida total',
    en: 'Limit on total debt',
  },
  'evora-limite-divida-dgal-2014': {
    pt: 'Limite do endividamento',
    en: 'Limit on indebtedness',
  },
  'evora-limite-divida-dgal-2017': {
    pt: 'Limite do endividamento',
    en: 'Limit on indebtedness',
  },
  'evora-limite-divida-dgal-2021': {
    pt: 'Limite do endividamento',
    en: 'Limit on indebtedness',
  },
  'evora-limite-divida-dgal-2024': {
    pt: 'Limite do endividamento',
    en: 'Limit on indebtedness',
  },
  'evora-excesso-endividamento-2014': {
    pt: 'Dívida acima do limite legal',
    en: 'Debt above the legal limit',
  },
  'evora-excesso-endividamento-2019': {
    pt: 'Dívida acima do limite legal',
    en: 'Debt above the legal limit',
  },
  'evora-margem-endividamento-2025': {
    pt: 'Margem até ao limite da dívida',
    en: 'Headroom up to the debt limit',
  },
  'evora-pael-emprestimo': {
    pt: 'Empréstimo do apoio à economia local',
    en: 'Loan from the local economy support programme',
  },
  'evora-saneamento-financeiro-2016': {
    pt: 'Empréstimo de saneamento financeiro',
    en: 'Financial recovery loan',
  },

  /* ------------------------------ o concelho de Évora: o Plano de Recuperação */
  'evora-prr-aprovado-2026': {
    pt: 'Verbas do PRR aprovadas para Évora',
    en: 'PRR funds approved for Évora',
  },
  'evora-prr-pago-2026': {
    pt: 'Verbas do PRR pagas em Évora',
    en: 'PRR funds paid in Évora',
  },
  'evora-prr-vencido-aprovado-2026': {
    pt: 'Verbas aprovadas em projetos fora de prazo',
    en: 'Approved funds in projects past their deadline',
  },
  'evora-prr-municipio-contratado': {
    pt: 'Verbas do PRR contratadas pelo município de Évora',
    en: 'PRR funds contracted by the municipality of Évora',
  },
  'evora-prr-universidade-contratado': {
    pt: 'Verbas do PRR contratadas pela Universidade de Évora',
    en: 'PRR funds contracted by the University of Évora',
  },

  /* --------------------------------- o concelho de Évora: quem governa a câmara */
  'evora-camara-lugares': {
    pt: 'Lugares na câmara municipal de Évora',
    en: 'Seats on the municipal council of Évora',
  },
  'evora-camara-mandatos-ps-2009': {
    pt: 'Mandatos ganhos pelo PS em Évora',
    en: 'Seats won by the PS in Évora',
  },
  'evora-camara-mandatos-ps-2025': {
    pt: 'Mandatos ganhos pelo PS em Évora',
    en: 'Seats won by the PS in Évora',
  },
  'evora-camara-mandatos-cdu-2013': {
    pt: 'Mandatos ganhos pela CDU em Évora',
    en: 'Seats won by the CDU in Évora',
  },
  'evora-camara-mandatos-cdu-2017': {
    pt: 'Mandatos ganhos pela CDU em Évora',
    en: 'Seats won by the CDU in Évora',
  },
  'evora-camara-mandatos-cdu-2021': {
    pt: 'Mandatos ganhos pela CDU em Évora',
    en: 'Seats won by the CDU in Évora',
  },
  'evora-executivo-2025-ps': {
    pt: 'Lugares do PS no executivo de Évora',
    en: 'PS seats on the executive of Évora',
  },
  'evora-executivo-2025-ad': {
    pt: 'Lugares da AD no executivo de Évora',
    en: 'AD seats on the executive of Évora',
  },
  'evora-executivo-2025-cdu': {
    pt: 'Lugares da CDU no executivo de Évora',
    en: 'CDU seats on the executive of Évora',
  },
  'evora-executivo-2025-chega': {
    pt: 'Lugares do Chega no executivo de Évora',
    en: 'Chega seats on the executive of Évora',
  },
  'evora-pelouros-2021-presidente': {
    pt: 'Pelouros do presidente da câmara',
    en: 'Portfolios held by the mayor',
  },
  'evora-pelouros-2025-presidente': {
    pt: 'Pelouros do presidente da câmara',
    en: 'Portfolios held by the mayor',
  },
  'evora-pelouros-2021-vice-presidente': {
    pt: 'Pelouros do vice-presidente da câmara',
    en: 'Portfolios held by the deputy mayor',
  },
  'evora-pelouros-2025-vice-presidente': {
    pt: 'Pelouros do vice-presidente da câmara',
    en: 'Portfolios held by the deputy mayor',
  },
  'evora-pelouros-2025-vereadora': {
    pt: 'Pelouros da vereadora',
    en: 'Portfolios held by the councillor',
  },
};

/**
 * ---------------------------------------------------------------------------
 * OS NOMES DAS LINHAS QUE NÃO SE RENDEM COMO CARTÃO
 * ---------------------------------------------------------------------------
 * Vinte e quatro linhas por edição não têm nome em degrau nenhum da escada do
 * cartão: são as DERIVADAS, que não têm fonte nem documento porque a
 * proveniência delas é a das origens, e as três cujo único título de
 * documento é o marcador deste projeto (`avisos-pt2030-abertos`,
 * `avisos-pt2030-pessoas-singulares` e `ciclo-substituicao-condutas`: vinte e
 * uma derivadas mais três, que é a conta que a tabela do bloco faz e que este
 * comentário dizia mal, com «quatro», até à leitura a frio de 16.09.2026). O bloco P2 decidiu, a 15.09.2026, que elas
 * não se rendem como cartão: rendem-se como linha do livro-razão, com a
 * aritmética que a própria linha declara no campo `derivation`.
 *
 * ESSA DECISÃO NÃO SE DESFAZ AQUI. O que muda é que a linha passa a levar um
 * NOME por cima da sua aritmética, em vez de abrir com o valor: é o que o item 1
 * do brief P3 pede («onde a medida vier de uma linha derivada sem declaração, o
 * nome escreve-se onde a página a lista»). O nome diz o que a linha mede; a
 * conta continua por baixo, palavra por palavra como a linha a escreve.
 *
 * A MARCA É A MESMA, `data-nome="projeto"`, e a conferência também: o texto
 * rendido é comparado carácter a carácter com o nome DAQUELA linha, nesta
 * edição, contra este ficheiro.
 *
 * @type {Record<string, ParDeLinguas>}
 */
export const NOMES_DAS_LINHAS_DERIVADAS = {
  // A contagem e o lugar estão declarados na derivação desta linha.
  'estudos-evora-publicados': {
    pt: 'Estudos publicados sobre Évora',
    en: 'Published studies about Évora',
  },
  'distancia-portugal-ue27-2024': {
    pt: 'Distância do PIB por habitante à média europeia, em Portugal',
    en: 'Gap between GDP per inhabitant and the European average, in Portugal',
  },
  'distancia-norte-ue27-2024': {
    pt: 'Distância do PIB por habitante à média europeia, no Norte',
    en: 'Gap between GDP per inhabitant and the European average, in the Norte region',
  },
  'distancia-centro-ue27-2024': {
    pt: 'Distância do PIB por habitante à média europeia, no Centro',
    en: 'Gap between GDP per inhabitant and the European average, in the Centro region',
  },
  'distancia-grande-lisboa-ue27-2024': {
    pt: 'Distância do PIB por habitante à média europeia, na Grande Lisboa',
    en: 'Gap between GDP per inhabitant and the European average, in Greater Lisbon',
  },
  'distancia-peninsula-de-setubal-ue27-2024': {
    pt: 'Distância do PIB por habitante à média europeia, na Península de Setúbal',
    en: 'Gap between GDP per inhabitant and the European average, in Península de Setúbal',
  },
  'distancia-oeste-e-vale-do-tejo-ue27-2024': {
    pt: 'Distância do PIB por habitante à média europeia, no Oeste e Vale do Tejo',
    en: 'Gap between GDP per inhabitant and the European average, in Oeste e Vale do Tejo',
  },
  'distancia-alentejo-ue27-2024': {
    pt: 'Distância do PIB por habitante à média europeia, no Alentejo',
    en: 'Gap between GDP per inhabitant and the European average, in the Alentejo',
  },
  'distancia-alentejo-ue27-2000': {
    pt: 'Distância do PIB por habitante à média europeia, no Alentejo',
    en: 'Gap between GDP per inhabitant and the European average, in the Alentejo',
  },
  'distancia-algarve-ue27-2024': {
    pt: 'Distância do PIB por habitante à média europeia, no Algarve',
    en: 'Gap between GDP per inhabitant and the European average, in the Algarve',
  },
  'distancia-acores-ue27-2024': {
    pt: 'Distância do PIB por habitante à média europeia, nos Açores',
    en: 'Gap between GDP per inhabitant and the European average, in the Azores',
  },
  'distancia-madeira-ue27-2024': {
    pt: 'Distância do PIB por habitante à média europeia, na Madeira',
    en: 'Gap between GDP per inhabitant and the European average, in Madeira',
  },
  'distancia-setubal-grande-lisboa-2024': {
    pt: 'Distância do PIB por habitante entre a Península de Setúbal e a Grande Lisboa',
    en: 'Gap in GDP per inhabitant between Península de Setúbal and Greater Lisbon',
  },
  'evora-indice-de-divida-2014': {
    pt: 'Dívida medida contra o limite legal',
    en: 'Debt measured against the legal limit',
  },
  'evora-indice-de-divida-2017': {
    pt: 'Dívida medida contra o limite legal',
    en: 'Debt measured against the legal limit',
  },
  'evora-indice-de-divida-2021': {
    pt: 'Dívida medida contra o limite legal',
    en: 'Debt measured against the legal limit',
  },
  'evora-indice-de-divida-2024': {
    pt: 'Dívida medida contra o limite legal',
    en: 'Debt measured against the legal limit',
  },
  'evora-divergencia-municipio-dgal-2024': {
    pt: 'Diferença entre as duas contas da dívida',
    en: 'Difference between the two debt figures',
  },
  'evora-pelouros-2021-total': {
    pt: 'Pelouros distribuídos no executivo',
    en: 'Portfolios allocated across the executive',
  },
  'evora-pelouros-2025-total': {
    pt: 'Pelouros distribuídos no executivo',
    en: 'Portfolios allocated across the executive',
  },
  'evora-prr-execucao-2026': {
    pt: 'Parte das verbas aprovadas que já foi paga',
    en: 'Share of approved funds already paid',
  },
  'evora-prr-vencido-quota-2026': {
    pt: 'Parte das verbas aprovadas em projetos fora de prazo',
    en: 'Share of approved funds in projects past their deadline',
  },
  /* SEM O NOME DO PROGRAMA, e a razão é a regra dos algarismos: «Portugal 2030»
     traz um número que não é uma medição e não resolve em linha nenhuma, e o
     `gate:html` recusa-o (medido: a construção fechou com «algarismos fora do
     livro-razão: "2030"»). O nome diz o que a linha conta, que é o que um nome
     tem de fazer; o programa fica onde a proveniência dela o disser, no dia em
     que a proveniência deixar de ser o marcador deste projeto. */
  'avisos-pt2030-abertos': {
    pt: 'Avisos de candidatura abertos',
    en: 'Open calls for applications',
  },
  'avisos-pt2030-pessoas-singulares': {
    pt: 'Avisos abertos a pessoas singulares',
    en: 'Open calls for individuals',
  },
  'ciclo-substituicao-condutas': {
    pt: 'Ciclo de substituição das condutas',
    en: 'Replacement cycle of water mains',
  },
};

/**
 * O nome do projeto de uma linha, ou `null`.
 *
 * As duas tabelas são uma só pergunta («que nome é que este projeto dá a esta
 * linha?») e vivem separadas porque respondem em superfícies diferentes: a
 * primeira encabeça um cartão, a segunda encabeça uma linha do livro-razão com
 * a sua aritmética. Nenhuma linha está nas duas, e a guarda abaixo prova-o.
 *
 * @param {string} id
 * @returns {ParDeLinguas|null}
 */
export function nomeDoProjeto(id) {
  return NOMES_DO_PROJETO[id] ?? NOMES_DAS_LINHAS_DERIVADAS[id] ?? null;
}

/* NENHUMA LINHA NAS DUAS TABELAS. Uma linha declarada nas duas rendia-se como
   cartão e como linha derivada em páginas diferentes, com o mesmo nome e duas
   formas: o defeito seria calado e a leitura dizia coisas diferentes sobre a
   mesma medida. A guarda corre na importação, que é quando a lista muda. */
for (const id of Object.keys(NOMES_DAS_LINHAS_DERIVADAS)) {
  if (id in NOMES_DO_PROJETO) {
    throw new Error(
      `nomes-das-medidas: a linha "${id}" está nas duas tabelas, e cada uma rende noutra forma.`,
    );
  }
}
