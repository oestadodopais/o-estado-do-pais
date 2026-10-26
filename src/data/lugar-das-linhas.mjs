/**
 * O LUGAR DE UMA LINHA QUE NENHUMA OUTRA DECLARAÇÃO COLOCA (B1c, 22.09.2026).
 *
 * O lugar de quase todas as linhas do livro-razão lê-se de uma declaração que
 * já existe, e `src/lib/mudancas.mjs` percorre-as todas: a região que nomeia a
 * linha (`src/data/regioes.mjs`), o concelho que a rende no seu relance
 * (`src/data/municipios.mjs`), o estudo que declara o seu objeto
 * (`WORKS[].subject`, em `src/data/studies.mjs`) e a tabela das medidas do país
 * (`DOMINIO_DAS_MEDIDAS`, com as linhas que a leitura do país cita).
 *
 * Esta tabela é para as que nenhuma dessas alcança, e cada entrada escreve a
 * razão. Não é um atalho: uma linha de mudança que fique sem lugar FECHA a
 * construção (a célula A3 do `check:pais`), e é por isso que a tabela nunca
 * pode falhar em silêncio. O lugar declarado aqui vale sobre todos os outros,
 * e duas declarações que discordem também fecham a construção.
 *
 * A chave é o id da linha; o valor é `'portugal'`, o slug de uma região ou o
 * slug de um concelho, `'uniao-europeia'` ou `'o-estado-do-pais'`.
 */
/** @type {Record<string, string>} */
export const LUGAR_DECLARADO_DAS_LINHAS = {
  /* CR2-f, 26.10.2026: seis agregados com geo=EU27_2020, como a dívida
     das famílias da União já declarada abaixo. São as comparações europeias
     dos cartões de Emprego (custo do trabalho), Habitação (licenças), Pobreza
     e desigualdade (crédito às famílias) e Estado e economia (dívida das
     empresas, investimento e PIB). As réguas são lidas por enquadramento.mjs;
     as páginas estão declaradas em primeira-pagina.mjs. O inventário medido
     de src e dist fica em design/especime-v3/medicoes/
     cr2-2026-10-26/f/lugares.json. */
  'custo-unitario-do-trabalho-2025-ue': 'uniao-europeia',
  'divida-das-empresas-2025-ue': 'uniao-europeia',
  'fluxo-de-credito-as-familias-2025-ue': 'uniao-europeia',
  'formacao-bruta-de-capital-fixo-2025-ue': 'uniao-europeia',
  'licencas-de-construcao-2025-ue': 'uniao-europeia',
  'pib-real-per-capita-2025-ue': 'uniao-europeia',
  /* Os cinco pontos de 2024 têm PT como única geografia do pedido, como as
     cinco linhas de 2024 do C2 abaixo. São o período anterior das réguas dos
     cartões de dívida e crédito: empresas e Estado em Estado e economia;
     famílias em Pobreza e desigualdade. Os quatro cartões de 2025 que mudaram
     já têm lugar pela tabela DOMINIO_DAS_MEDIDAS, sem entrada adicional. */
  'divida-das-empresas-2024': 'portugal',
  'divida-das-familias-2024': 'portugal',
  'divida-publica-2024': 'portugal',
  'fluxo-de-credito-as-empresas-2024': 'portugal',
  'fluxo-de-credito-as-familias-2024': 'portugal',
  /* UE1-c: a revisão da dívida do agregado da União pertence à União. */
  'divida-publica-2025-ue': 'uniao-europeia',
  /* EO1-e: a entrega pertence ao calendário do Orçamento nacional, na página parlamentar selada. */
  'oe-2027-calendario-entrega': 'portugal',
  /* V2-e-b: os excertos corrigidos do relatório do orçamento nacional
     tratam os encargos das parcerias e as pretensões das concessionárias
     perante o Estado, incluindo a negociação da Beira Interior. */
  'pe-oe-beira-abolicao': 'portugal',
  'pe-oe-riscos-nao-reconhecimento': 'portugal',
  /* HB1-b: a Euronews descreve manifestações em cidades de Portugal; a RTP
     situa a acampada e a retirada das tendas na Praça D. João I, no Porto.
     As correções completam esses excertos, sem mudar o seu âmbito geográfico. */
  'hab-imprensa-manif-euronews': 'portugal',
  'hab-imprensa-tendas': 'porto',
  /* V2-d-b: as correções completam citações da UTAO sobre o orçamento
     nacional, os riscos das parcerias e a execução do SNS em Portugal. */
  'utao-ppp-contingencias-natureza-2026': 'portugal',
  'utao-risco-execucao-sns-2027': 'portugal',
  /* V2-d-f: o excerto corrigido identifica receitas de impostos e verbas
     do contrato-programa da ACSS no orçamento nacional da Saúde. */
  'oe-2027-saude-contrato-programa-acss': 'portugal',
  /* CR1, 21.10.2026: o Eurostat reviu o valor de 2024 destas duas linhas na
     atualização do conjunto gov_10a_exp; medem o agregado da União Europeia
     que a explicação de 2026 cita, e não Portugal. */
  'despesa-por-funcao-2024-gf01-ue': 'uniao-europeia',
  'despesa-por-funcao-2024-gf10-ue': 'uniao-europeia',
  /* E0, §1.146: a linha conta as confissões do próprio projeto. O seu lugar
     é O Estado do País, com a porta para o registo das correções. Não mede
     Portugal, uma região nem um concelho. */
  'correcoes-publicadas': 'o-estado-do-pais',
  /* E1b, §1.145: as duas contagens do arquivo também medem o próprio projeto,
     e não Portugal, uma região nem um concelho: contam os estudos e as edições
     que O Estado do País publicou. A 01.10.2026 entraram no arquivo os quatro
     estudos de Évora e as sete edições deles, e os seis estudos de agosto e
     setembro continuam alojados e contam. A porta é a do registo das
     correções, como a da linha de cima. */
  'estudos-publicados': 'o-estado-do-pais',
  'edicoes-publicadas': 'o-estado-do-pais',
  /* A observação europeia enquadra Portugal, mas não é um valor de Portugal.
     A atualização pertence ao registo e aos temas, fora da lista do país. */
  'divida-das-familias-2025-ue': 'uniao-europeia',
  /* C2, 05.10.2026: as revisões da Eurostat de 02.10.2026 deram a primeira
     atualização a mais um agregado da União e a cinco linhas do período
     anterior de medidas do país. O agregado segue a dívida das famílias da
     União, pela mesma razão. */
  'despesa-em-id-2024-ue': 'uniao-europeia',
  /* As cinco do período anterior são o ponto de 2024 do mesmo pedido da
     medida do país, com a geografia de Portugal: são valores de Portugal, e
     nenhuma outra declaração as alcança (não são cartões, e a tabela das
     medidas do país só tem o período da medida). A A1 do `check:pais` deriva o
     lugar delas pela coordenada selada de Portugal. */
  'custo-unitario-do-trabalho-2024': 'portugal',
  'formacao-bruta-de-capital-fixo-2024': 'portugal',
  'pib-real-per-capita-2024': 'portugal',
  'posicao-de-investimento-internacional-2024': 'portugal',
  'saldo-da-balanca-corrente-2024': 'portugal',
  /* A CONTAGEM DOS ESTUDOS SOBRE ÉVORA é um apuramento da casa: o campo `study`
     desta linha é `o-estado-do-pais`, que é uma origem interna e não um trabalho
     do arquivo, e por isso não declara objeto nenhum. O que a linha conta são os
     trabalhos cujo objeto é o município de Évora, e é a Évora que ela pertence:
     foi uma das dezasseis correções que o diretor leu na página do país a
     22.09.2026 sem ser de uma medida do país. */
  'estudos-evora-publicados': 'evora',
};
