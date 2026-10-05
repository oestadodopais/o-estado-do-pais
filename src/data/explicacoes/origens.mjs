/**
 * ===========================================================================
 * AS ORIGENS DAS EXPLICAÇÕES (bloco EX1, 05.10.2026)
 * ===========================================================================
 *
 * O QUE SÃO. As fontes de onde vêm as palavras de uma explicação que dizem o que uma coisa é (o que a
 * classificação das funções conta, o que é o Orçamento do Estado), lidas em ficheiros que o motor já
 * aloja, com o pedido registado ao lado. Os números de uma explicação não vêm daqui: cada um é uma linha
 * do livro-razão. Estas origens só apoiam palavras, e é a auditoria das leituras
 * (`tests/cartao/leituras-provadas.json`, a secção «explicacoes») que diz que parte cada uma apoia.
 *
 * PORQUE NÃO ESTÃO EM `ORIGENS_DAS_DEFINICOES`. As duas foram pedidas pelo corredor do bloco OE1 e vivem
 * na pasta do estudo do Orçamento no motor (`content/20 Orcamento do Estado/source/`), com o registo de
 * cada pedido num `.pedido.json` ao lado (o endereço, a hora, o cliente e o sha256). As origens das
 * definições dos cartões têm outra regra, a da K16 e da K17: uma resposta da API do Eurostat traz um
 * selo de `indicators/out/` e o cliente `core.http.HttpClient`, e uma origem alojada vive em
 * `content/13 Dominios/source/`. Pôr estas lá obrigava a mudar essas duas células sem razão; ficam aqui,
 * com a forma das alojadas e o cliente que o registo do pedido escreve, e a célula da explicação
 * (`tests/explicacoes/explicacao.mjs`) confere-as: a forma do selo sempre, e, com o motor ao lado
 * (`RESEARCHHUB_DIR`), o sha256 do ficheiro, o registo do pedido e o campo lido, carácter a carácter.
 *
 * O excerto é o campo tal como a fonte o escreve, com a pontuação dela. Sem travessões na prosa deste
 * cabeçalho; o que vem copiado de uma fonte fica como a fonte o escreveu.
 */

/**
 * @typedef {{ motor: string, campo: string, hora: string, cliente: string, sha256: string }} SeloAlojado
 * @typedef {{ publicador: string, documento: string, url: string, lido: string, lingua: 'pt'|'en', excerto: string, alojada: SeloAlojado, composicao?: { chave: string, rotulos: string[], separador: string } }} OrigemDeExplicacao
 */

/** @type {Record<string, OrigemDeExplicacao>} */
export const ORIGENS_DAS_EXPLICACOES = {
  /* A descrição do conjunto «Orçamento do Estado - Despesa por classificação funcional» no catálogo do
     dados.gov.pt: o que é o Orçamento do Estado, o que a dimensão funcional classifica e que perímetro os
     dados cobrem. É o conjunto de onde vêm as dez linhas das funções (o `source_url` delas é um recurso
     dele). */
  'dados-gov-oe-despesa-funcional': {
    publicador: 'Entidade Orçamental',
    documento: 'Orçamento do Estado - Despesa por classificação funcional',
    url: 'https://dados.gov.pt/api/1/datasets/orcamento-do-estado-despesa-por-classificacao-funcional/',
    lido: '2026-10-04',
    lingua: 'pt',
    excerto:
      'Os dados do Orçamento do Estado (OE) são disponibilizados uma vez por ano após a aprovação do OE na Assembleia da República e respetiva promulgação pelo Presidente da República.\nA fonte dos dados é o Orçamento do Estado aprovado, conforme consta dos sistemas da DGO. \nAs dimensões de análise representam as várias perspetivas sob as quais os dados são apresentados, relevando substancialmente na apreciação dos dados orçamentais. \nA dimensão funcional utiliza um classificador internacional, a Classificação das Funções do Governo, abreviada como COFOG – _Classification of the Functions of Government_. Esta classificação especifica os fins e atividades típicos do Estado (em sentido lato) e evidencia a afetação dos recursos públicos às diversas macrofunções do Estado: soberania, sociais e económicas. \nOs dados são apresentados numa ótica consolidada e de contabilidade pública, isto é, contemplam as despesas a pagar no ano.\nOs dados excluem os fluxos relativos a operações financeiras (ativos e passivos financeiros), bem como operações extraorçamentais. \nOs dados abrangem todas as entidades públicas integradas no perímetro da Administração Central em cada ano.',
    alojada: {
      motor: 'content/20 Orcamento do Estado/source/dados-funcao.json',
      campo: 'description',
      hora: '2026-10-04T03:55:05Z',
      cliente: 'OEstadoDoPais/corredor',
      sha256: '43bb18f15b663e31b75ce6e09daaf68527aff412b1703319fcdb3e2496ddb8e7',
    },
  },
  /* Os rótulos da classificação das funções na resposta do Eurostat ao pedido da despesa por função de
     2024, que o bloco OE1 alojou para as trinta linhas da despesa por função: a divisão 01, e as duas
     subdivisões dela que a explicação nomeia (as operações da dívida pública e as transferências de
     caráter geral entre níveis da administração). O excerto junta os três rótulos pela ordem da
     composição, com « — » entre eles, que é a forma com que o motor compõe as etiquetas de uma resposta. */
  'eurostat-cofog-divisao-01': {
    publicador: 'Eurostat',
    documento: 'General government expenditure by function (COFOG)',
    url: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024',
    lido: '2026-10-04',
    lingua: 'en',
    excerto: 'General public services — Public debt transactions — Transfers of a general character between different levels of government',
    composicao: { chave: 'dimension.cofog99.category.label', rotulos: ['GF01', 'GF0107', 'GF0108'], separador: ' — ' },
    alojada: {
      motor: 'content/20 Orcamento do Estado/source/eurostat-gov-10a-exp-2024.json',
      campo: 'dimension.cofog99.category.label, os rótulos de GF01, GF0107 e GF0108, por esta ordem, unidos por « — »',
      hora: '2026-10-04T03:58:33Z',
      cliente: 'OEstadoDoPais/corredor',
      sha256: 'd9fb5f9304976b2628f34cb111fb9d2494801d28a0d5b9bdc6b14ada8c137910',
    },
  },
};
