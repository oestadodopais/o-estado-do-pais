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
 * A REGRA DE QUEM ESCREVE (brief P3, §0, regra 2)
 * ---------------------------------------------------------------------------
 * Um nome do projeto é **um nome corrente em português para a medida que a
 * linha declara**: sem sigla da fonte, sem jargão do ficheiro, sem uma palavra
 * que a linha não sustente. Não substitui o nome oficial e não compete com ele:
 * onde o motor confirmar que a medida do INE ou da PORDATA é a mesma, o nome
 * oficial rende-se no recibo, com o endereço e o dia em que foi lido.
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
    pt: 'Corte atuarialmente neutro na pensão',
    en: 'Actuarially neutral pension cut',
  },
  'penalizacao-antecipacao-um-ano-sem-factor-2026': {
    pt: 'Corte na pensão sem o fator de sustentabilidade',
    en: 'Pension cut without the sustainability factor',
  },
  'penalizacao-antecipacao-um-ano-com-factor-2026': {
    pt: 'Corte na pensão com o fator de sustentabilidade',
    en: 'Pension cut with the sustainability factor',
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
    pt: 'Peso das quatro maiores empresas em Portugal',
    en: 'Share of the four largest companies in Portugal',
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
    pt: 'Peso das quatro maiores empresas em Évora',
    en: 'Share of the four largest companies in Évora',
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
    en: "Budget of Évora's municipality",
  },
  'evora-receita-cobrada-2025': {
    pt: 'Receita cobrada pelo município de Évora',
    en: "Revenue collected by Évora's municipality",
  },
  'evora-despesa-paga-2025': {
    pt: 'Despesa paga pelo município de Évora',
    en: "Spending paid by Évora's municipality",
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
    en: "Payments in arrears of Évora's municipality",
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
    en: "Total debt of Évora's municipality",
  },
  'evora-divida-total-2021': {
    pt: 'Dívida total do município de Évora',
    en: "Total debt of Évora's municipality",
  },
  'evora-divida-total-2024': {
    pt: 'Dívida total do município de Évora',
    en: "Total debt of Évora's municipality",
  },
  'evora-divida-total-2025': {
    pt: 'Dívida total do município de Évora',
    en: "Total debt of Évora's municipality",
  },
  'evora-divida-dgal-2014': {
    pt: 'Endividamento total do município de Évora',
    en: "Total indebtedness of Évora's municipality",
  },
  'evora-divida-dgal-2017': {
    pt: 'Endividamento total do município de Évora',
    en: "Total indebtedness of Évora's municipality",
  },
  'evora-divida-dgal-2021': {
    pt: 'Endividamento total do município de Évora',
    en: "Total indebtedness of Évora's municipality",
  },
  'evora-divida-dgal-2024': {
    pt: 'Endividamento total do município de Évora',
    en: "Total indebtedness of Évora's municipality",
  },
  'evora-divida-31-10-2013': {
    pt: 'Dívida registada no início do mandato',
    en: 'Debt recorded at the start of the mandate',
  },
  'evora-divida-inicio-mandato-reexpressa': {
    pt: 'Dívida do início do mandato, reexpressa',
    en: 'Debt at the start of the mandate, restated',
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
    en: 'Room left up to the debt limit',
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
    pt: 'Dinheiro aprovado do Plano de Recuperação',
    en: 'Money approved under the Recovery Plan',
  },
  'evora-prr-pago-2026': {
    pt: 'Dinheiro pago do Plano de Recuperação',
    en: 'Money paid under the Recovery Plan',
  },
  'evora-prr-vencido-aprovado-2026': {
    pt: 'Dinheiro aprovado em projetos com prazo ultrapassado',
    en: 'Money approved on projects past their deadline',
  },
  'evora-prr-municipio-contratado': {
    pt: 'Dinheiro contratado pelo município de Évora',
    en: "Money contracted by Évora's municipality",
  },
  'evora-prr-universidade-contratado': {
    pt: 'Dinheiro contratado pela Universidade de Évora',
    en: 'Money contracted by the University of Évora',
  },

  /* --------------------------------- o concelho de Évora: quem governa a câmara */
  'evora-camara-lugares': {
    pt: 'Lugares na câmara municipal de Évora',
    en: "Seats on Évora's municipal council",
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
    en: "PS seats on Évora's executive",
  },
  'evora-executivo-2025-ad': {
    pt: 'Lugares da AD no executivo de Évora',
    en: "AD seats on Évora's executive",
  },
  'evora-executivo-2025-cdu': {
    pt: 'Lugares da CDU no executivo de Évora',
    en: "CDU seats on Évora's executive",
  },
  'evora-executivo-2025-chega': {
    pt: 'Lugares do Chega no executivo de Évora',
    en: "Chega seats on Évora's executive",
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
 * proveniência delas é a das origens, e as quatro cujo único título de
 * documento é o marcador da casa. O bloco P2 decidiu, a 15.09.2026, que elas
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
  'distancia-portugal-ue27-2024': {
    pt: 'Distância de Portugal à média europeia',
    en: 'Gap between Portugal and the European average',
  },
  'distancia-norte-ue27-2024': {
    pt: 'Distância do Norte à média europeia',
    en: 'Gap between the Norte region and the European average',
  },
  'distancia-centro-ue27-2024': {
    pt: 'Distância do Centro à média europeia',
    en: 'Gap between the Centro region and the European average',
  },
  'distancia-grande-lisboa-ue27-2024': {
    pt: 'Distância da Grande Lisboa à média europeia',
    en: 'Gap between Greater Lisbon and the European average',
  },
  'distancia-peninsula-de-setubal-ue27-2024': {
    pt: 'Distância da Península de Setúbal à média europeia',
    en: 'Gap between Península de Setúbal and the European average',
  },
  'distancia-oeste-e-vale-do-tejo-ue27-2024': {
    pt: 'Distância do Oeste e Vale do Tejo à média europeia',
    en: 'Gap between Oeste e Vale do Tejo and the European average',
  },
  'distancia-alentejo-ue27-2024': {
    pt: 'Distância do Alentejo à média europeia',
    en: 'Gap between the Alentejo and the European average',
  },
  'distancia-alentejo-ue27-2000': {
    pt: 'Distância do Alentejo à média europeia',
    en: 'Gap between the Alentejo and the European average',
  },
  'distancia-algarve-ue27-2024': {
    pt: 'Distância do Algarve à média europeia',
    en: 'Gap between the Algarve and the European average',
  },
  'distancia-acores-ue27-2024': {
    pt: 'Distância dos Açores à média europeia',
    en: 'Gap between the Azores and the European average',
  },
  'distancia-madeira-ue27-2024': {
    pt: 'Distância da Madeira à média europeia',
    en: 'Gap between Madeira and the European average',
  },
  'distancia-setubal-grande-lisboa-2024': {
    pt: 'Distância entre a Península de Setúbal e a Grande Lisboa',
    en: 'Gap between Península de Setúbal and Greater Lisbon',
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
    en: 'Portfolios handed out on the executive',
  },
  'evora-pelouros-2025-total': {
    pt: 'Pelouros distribuídos no executivo',
    en: 'Portfolios handed out on the executive',
  },
  'evora-prr-execucao-2026': {
    pt: 'Parte do dinheiro aprovado que já foi paga',
    en: 'Share of the approved money already paid',
  },
  'evora-prr-vencido-quota-2026': {
    pt: 'Parte do dinheiro aprovado com prazo ultrapassado',
    en: 'Share of the approved money past its deadline',
  },
  /* SEM O NOME DO PROGRAMA, e a razão é a regra dos algarismos: «Portugal 2030»
     traz um número que não é uma medição e não resolve em linha nenhuma, e o
     `gate:html` recusa-o (medido: a construção fechou com «algarismos fora do
     livro-razão: "2030"»). O nome diz o que a linha conta, que é o que um nome
     tem de fazer; o programa fica onde a proveniência dela o disser, no dia em
     que a proveniência deixar de ser o marcador da casa. */
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
