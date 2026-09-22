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
 * slug de um concelho.
 */
/** @type {Record<string, string>} */
export const LUGAR_DECLARADO_DAS_LINHAS = {
  /* A CONTAGEM DOS ESTUDOS SOBRE ÉVORA é um apuramento da casa: o campo `study`
     desta linha é `o-estado-do-pais`, que é uma origem interna e não um trabalho
     do arquivo, e por isso não declara objeto nenhum. O que a linha conta são os
     trabalhos cujo objeto é o município de Évora, e é a Évora que ela pertence:
     foi uma das dezasseis correções que o diretor leu na página do país a
     22.09.2026 sem ser de uma medida do país. */
  'estudos-evora-publicados': 'evora',
};
