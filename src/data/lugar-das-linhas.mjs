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
