/**
 * Os municípios que têm página própria.
 *
 * A página de um município é uma LEITURA: as medidas que as fontes centrais
 * publicam para aquele concelho, uma frase por medida, e o fundo com o método,
 * as ressalvas e os trabalhos que o tomaram por objecto.
 *
 * NÚMEROS NÃO SE ESCREVEM AQUI. Cada medida é o id de uma afirmação do
 * livro-razão; o gabarito cita-a com <Claim id="…"/> e o selo leva à linha. As
 * palavras à volta vêm nas duas línguas, e não trazem algarismos: onde é
 * preciso um número há `{ claim: … }`, onde é preciso uma data de referência há
 * `{ ref: … }` (ver src/components/Frase.astro).
 *
 * ---------------------------------------------------------------------------
 * A LISTA COMPÕE-SE: UMA ENTRADA ESCRITA À MÃO, E 308 GERADAS (bloco dos 308, P2)
 * ---------------------------------------------------------------------------
 * Évora é o único concelho com trabalho aprofundado publicado, e a sua entrada
 * continua escrita aqui: as camadas que só ela tem (a leitura breve, as contas
 * do município, a linha do tempo das administrações, o método, as ressalvas e os
 * trabalhos) não existem em mais nenhum concelho, e não se geram de nada.
 *
 * As outras entradas vêm do ficheiro que o motor escreve, por
 * `src/data/concelhos.mjs`. Uma entrada gerada tem as oito peças, a distância
 * desenhada quando as duas linhas existem, e mais nada — e a vista rende só o
 * que existe. Ninguém escreve 308 entradas à mão, e os rótulos, unidades e
 * períodos das oito medidas estão escritos uma vez, em `concelhos.mjs`, e valem
 * para os 308 e para Évora.
 *
 * NADA AQUI É UMA REESCRITA DE UM ESTUDO. As ressalvas do fundo são a mesma
 * coisa que os estudos imprimem nos seus próprios limites, e a frase de origem
 * de cada uma está registada em DECISIONS §1.34. Onde um estudo não diz, esta
 * página não diz.
 */

import { INDICE_EVORA } from './caop-centroids.mjs';
import { relanceDoConcelho, entradasGeradas } from './concelhos.mjs';

/**
 * Um mosaico do relance, como `relanceDoConcelho()` o compõe.
 *
 * `claim`  — a afirmação do livro-razão, ou `null` quando nenhuma fonte
 *            publica esta medida para este concelho. Um mosaico com `null`
 *            desenha o estado vazio: sem número, sem selo, e a dizer porquê.
 *            IDENTIDADE §7 — uma grelha nunca mostra célula vazia, e o estado
 *            vazio desenha-se antes de ser preciso, não depois.
 * `nome`    — o nome da medida, nas duas línguas.
 * `medida`  — a unidade e o ano, em letra monoespaçada, como na primeira página.
 * `unidade` — a UNIDADE sozinha, sem período e sem figura, nas duas línguas.
 *            É um campo DECLARADO, e não um recorte da `medida`: uma peça vazia
 *            não pode trazer um algarismo, e a `medida` traz dois — a data de
 *            referência (`{ ref: … }`) e, no índice de dívida, o teto legal
 *            (`{ claim: … }`). Recortá-los da `medida` por regra dava linhas
 *            truncadas («Pessoas · dezembro de», «Percentagem, teto legal =»).
 * `nota`    — a linha curta que diz de onde vem a medida.
 *
 * @typedef {{
 *   claim: string|null,
 *   nome: { pt: string, en: string },
 *   medida: { pt: any[], en: any[] },
 *   unidade: { pt: string, en: string },
 *   nota: { pt: any[], en: any[] }|null,
 * }} Mosaico
 */

const EVORA = {
    slug: 'evora',
    nome: { pt: 'Évora', en: 'Évora' },
    distrito: { pt: 'distrito de Évora', en: 'district of Évora' },
    regiao: { pt: 'Alentejo Central', en: 'Alentejo Central' },
    /* A posição no mapa da primeira página vem do módulo das coordenadas, para
       que a porta da primeira página e esta página falem do mesmo ponto. */
    caopIndex: INDICE_EVORA,
    /* Não há aqui código da CAOP nem código do INE: o módulo das coordenadas
       guarda nome, distrito e posição, e mais nada. Escrever um código de
       memória seria inventá-lo. */

    /* ---------------------------------------------------- camada 1 — relance
     *
     * AS OITO MEDIDAS SÃO AS DA CASA, E ÉVORA LÊ-AS DA MESMA DECLARAÇÃO QUE OS
     * OUTROS 307 (bloco dos 308, P2; decisões D2, D3 e D5 do diretor de
     * 26.08.2026). Os rótulos estavam escritos aqui, dentro da entrada de
     * Évora; passam a vir de `MEDIDAS_DO_CONCELHO`, porque a mesma peça em 308
     * páginas tem de medir a mesma coisa e chamar-se o mesmo nome.
     *
     * O QUE ÉVORA DECLARA DE SEU são os ids das suas linhas e a data de
     * referência do desemprego, que a sua linha mede em dezembro de 2024 e o
     * ficheiro do motor mede em dezembro de 2025.
     *
     * DUAS PEÇAS FICAM VAZIAS, e é a decisão D2. A execução da receita não tem
     * fonte central desde 2019; o prazo médio de pagamento tem a lista anual do
     * regulador, e nela Évora está «N.d.» a 31 de dezembro de 2025. As duas
     * linhas que Évora lia das suas próprias contas descem para a camada das
     * contas desta página, com os seus selos: comparar 137 dias de Évora, lidos
     * da prestação de contas dela, com 5 dias de Lisboa, lidos do regulador, é
     * pôr duas definições debaixo do mesmo nome.
     */
    relance: relanceDoConcelho(
      {
        populacao: 'evora-populacao-2025',
        poderDeCompra: 'evora-poder-de-compra-2023',
        /* A LINHA DO DESEMPREGO PASSA A SER A DA FONTE CENTRAL (P2, os dados).
           Évora lia `evora-desemprego-registado-2024`, que é dezembro de 2024, e
           o exportador do motor escreveu `evora-desemprego-registado-2025-12`
           com os outros 277 do continente. Manter o de 2024 punha a mesma peça a
           medir dezembro de 2024 em Évora e dezembro de 2025 nos outros, que é
           exactamente o que a decisão D2 recusa; e deixava a linha nova sem
           concelho que a declarasse, órfã na página do conjunto. A linha de 2024
           não desaparece: continua citada na leitura breve desta página, que é a
           frase que mede a queda de 2013 para 2024. */
        desempregoRegistado: 'evora-desemprego-registado-2025-12',
        empresas: 'evora-empresas-2024',
        divida: 'evora-divida-dgal-2024',
        indice: 'evora-indice-de-divida-2024',
        execucaoDaReceita: null,
        pmp: null,
      },
      /* Sem data de referência própria: Évora passa a medir o mesmo período que
         os outros 307, que é o que a declaração das oito medidas já diz. */
      {},
    ),

    /* ---------------------------------------------- camada 2 — leitura breve */
    leitura: [
      {
        pt: [
          'A população residente subiu de ',
          { claim: 'evora-populacao-2021' },
          ' em ',
          { ref: '2021' },
          ' para ',
          { claim: 'evora-populacao-2025' },
          ' em ',
          { ref: '2025' },
          '.',
        ],
        en: [
          'The resident population rose from ',
          { claim: 'evora-populacao-2021' },
          ' in ',
          { ref: '2021' },
          ' to ',
          { claim: 'evora-populacao-2025' },
          ' in ',
          { ref: '2025' },
          '.',
        ],
      },
      {
        pt: [
          'O poder de compra por habitante está acima da média nacional, que é a base do índice: ',
          { claim: 'evora-poder-de-compra-2023' },
          ' no concelho, enquanto a sua região, o Alentejo Central, está abaixo dessa média, em ',
          { claim: 'alentejo-central-poder-de-compra-2023' },
          '.',
        ],
        en: [
          'Purchasing power per inhabitant is above the national average, which is the base of the index: ',
          { claim: 'evora-poder-de-compra-2023' },
          ' in the municipality, while its region, the Alentejo Central, is below that average, at ',
          { claim: 'alentejo-central-poder-de-compra-2023' },
          '.',
        ],
      },
      {
        pt: [
          'O desemprego registado no fim de dezembro caiu de ',
          { claim: 'evora-desemprego-registado-2013' },
          ' pessoas em ',
          { ref: '2013' },
          ' para ',
          { claim: 'evora-desemprego-registado-2024' },
          ' em ',
          { ref: '2024' },
          '.',
        ],
        en: [
          'Registered unemployment at the end of December fell from ',
          { claim: 'evora-desemprego-registado-2013' },
          ' people in ',
          { ref: '2013' },
          ' to ',
          { claim: 'evora-desemprego-registado-2024' },
          ' in ',
          { ref: '2024' },
          '.',
        ],
      },
      {
        pt: ['Estão sediadas no concelho ', { claim: 'evora-empresas-2024' }, ' empresas.'],
        en: ['There are ', { claim: 'evora-empresas-2024' }, ' enterprises headquartered in the municipality.'],
      },
      {
        pt: [
          'A execução da receita caiu de ',
          { claim: 'evora-execucao-da-receita-2021', sufixo: '%' },
          ' do orçamento em ',
          { ref: '2021' },
          ' para ',
          { claim: 'evora-execucao-da-receita-2025', sufixo: '%' },
          ' em ',
          { ref: '2025' },
          '.',
        ],
        en: [
          'Revenue execution fell from ',
          { claim: 'evora-execucao-da-receita-2021', sufixo: '%' },
          ' of the budget in ',
          { ref: '2021' },
          ' to ',
          { claim: 'evora-execucao-da-receita-2025', sufixo: '%' },
          ' in ',
          { ref: '2025' },
          '.',
        ],
      },
      {
        pt: [
          'O prazo médio de pagamento a fornecedores passou de ',
          { claim: 'evora-prazo-medio-de-pagamento-2023' },
          ' dias em ',
          { ref: '2023' },
          ' para ',
          { claim: 'evora-prazo-medio-de-pagamento-2025' },
          ' dias em ',
          { ref: '2025' },
          ', com ',
          { claim: 'evora-pagamentos-em-atraso-2025' },
          ' € de pagamentos em atraso no fim do ano.',
        ],
        en: [
          'The average time to pay suppliers went from ',
          { claim: 'evora-prazo-medio-de-pagamento-2023' },
          ' days in ',
          { ref: '2023' },
          ' to ',
          { claim: 'evora-prazo-medio-de-pagamento-2025' },
          ' days in ',
          { ref: '2025' },
          ', with ',
          { claim: 'evora-pagamentos-em-atraso-2025' },
          ' € of payments overdue at year end.',
        ],
      },
    ],

    /* ------------------------------------------- a distância desenhada (§1.2) */
    distancia: {
      valor: 'evora-divida-dgal-2024',
      limite: 'evora-limite-divida-dgal-2024',
      indice: 'evora-indice-de-divida-2024',
      tecto: 'indice-de-divida-limite-legal',
      ref: '2024',
    },

    /* --------------------------------------- as contas do próprio município */
    contas: {
      ref: '2025',
      refAnterior: '2024',
      orcamento: 'evora-orcamento-2025',
      receita: 'evora-receita-cobrada-2025',
      despesa: 'evora-despesa-paga-2025',
      divida: 'evora-divida-total-2025',
      limite: 'evora-limite-divida-2025',
      margem: 'evora-margem-endividamento-2025',
      /* As duas contas da MESMA dívida, e a diferença entre elas. Os dois pais
         da linha derivada aparecem ao lado do valor derivado: quem lê a
         diferença vê os dois números de onde ela sai. */
      reguladorAnterior: 'evora-divida-dgal-2024',
      municipioAnterior: 'evora-divida-total-2024',
      divergencia: 'evora-divergencia-municipio-dgal-2024',
      /* AS DUAS MEDIDAS QUE O MUNICÍPIO LÊ DE SI PRÓPRIO (decisão D2 do diretor,
         26.08.2026). Estavam nas peças 7 e 8 do relance, onde a mesma peça, nas
         308 páginas, tem de medir a mesma coisa: os 137 dias que Évora lê da sua
         prestação de contas e os 5 dias que o regulador publica para Lisboa não
         são a mesma medida, e o leitor não tinha como o saber. Descem para aqui,
         que é a camada onde esta página já publica o que o município diz de si,
         com os seus selos e sem um valor mudado. */
      execucaoDaReceita: 'evora-execucao-da-receita-2025',
      prazoMedioDePagamento: 'evora-prazo-medio-de-pagamento-2025',
    },

    /* -------------------------------- a linha do tempo das administrações §1.3
       Os períodos, as datas de instalação, os nomes e as listas são
       transcrições do trabalho «Quinze Anos, Cinco Mandatos» — as datas de
       instalação estão impressas nele («são as datas de instalação, e não as
       das eleições, que marcam o início efetivo dos mandatos: 2013-10-18,
       2017-10-20, 2021-10-15 e 2025-10-31»), e a tabela de presidentes e
       listas também. Onde esse trabalho não estabelece uma coisa, o campo
       fica com `null` e a página di-lo por palavras. Ver DECISIONS §1.34. */
    tempo: {
      /* O relance do instrumento: o índice do regulador no primeiro ano
         legível da série e no último. Dois números, e nada mais. */
      relance: { de: 'evora-indice-de-divida-2014', ate: 'evora-indice-de-divida-2024', deRef: '2014', ateRef: '2024' },
      /* As marcas do eixo: os anos em que uma administração foi instalada.
         São a régua desta linha do tempo, não medições. */
      eixo: ['2009', '2013', '2017', '2021', '2025'],
      mandatos: [
        {
          periodo: '2009–2013',
          instalado: null,
          quem: { pt: 'José Ernesto d’Oliveira, depois Manuel Melgão a partir de ', en: 'José Ernesto d’Oliveira, then Manuel Melgão from ' },
          quemData: '2013-05-01',
          lista: 'PS',
          lugares: 'evora-camara-mandatos-ps-2009',
          herdou: null,
          herdouNota: {
            pt: 'Antes do primeiro ano de contas legível nesta janela.',
            en: 'Before the first year of accounts readable in this window.',
          },
          decidiu: [
            {
              claim: 'evora-pael-emprestimo',
              texto: {
                pt: '€ de empréstimo do Programa de Apoio à Economia Local.',
                en: '€ of loan under the local-economy support programme.',
              },
            },
          ],
          deixou: [
            {
              claim: 'evora-divida-31-10-2013',
              texto: {
                pt: '€ de dívida total, medidos duas semanas depois da mudança de executivo.',
                en: '€ of total debt, measured two weeks after the executive changed.',
              },
            },
            {
              claim: 'evora-divida-inicio-mandato-reexpressa',
              texto: {
                pt: '€ na reexpressão de um relatório posterior, para a mesma data de início de mandato. A página mostra as duas: escolher uma em silêncio esconderia que a diferença existe.',
                en: '€ in a later report’s restatement, for the same start-of-term date. The page shows both: choosing one silently would hide that the difference exists.',
              },
            },
          ],
          regulador: null,
          reguladorNota: {
            pt: 'A série anual do regulador usada nesta página começa depois deste mandato.',
            en: 'The regulator’s annual series used on this page begins after this term.',
          },
          pelouros: null,
          pelourosNota: {
            pt: 'Não estabelecido. O trabalho sobre os pelouros diz que este mandato «é uma linha de um mapa, não um mapa»: o presidente desse mandato, e todos os outros membros dele, não foram identificados.',
            en: 'Not established. The work on the portfolios says this term «is one line of a map, not a map»: the president of that mandate, and every other member of it, were not identified.',
          },
        },
        {
          periodo: '2013–2017',
          instalado: '2013-10-18',
          quem: { pt: 'Carlos Pinto de Sá', en: 'Carlos Pinto de Sá' },
          quemData: null,
          lista: 'CDU',
          lugares: 'evora-camara-mandatos-cdu-2013',
          herdou: [
            {
              claim: 'evora-divida-31-10-2013',
              texto: { pt: '€ como reportado, e', en: '€ as reported, and' },
            },
            {
              claim: 'evora-divida-inicio-mandato-reexpressa',
              texto: { pt: '€ como reexpresso mais tarde.', en: '€ as later restated.' },
            },
          ],
          decidiu: [
            {
              claim: 'evora-saneamento-financeiro-2016',
              texto: {
                pt: '€ de empréstimo de saneamento financeiro.',
                en: '€ of financial-recovery loan.',
              },
            },
          ],
          deixou: [
            {
              claim: 'evora-divida-total-2017',
              texto: { pt: '€ de dívida total, na conta do próprio município.', en: '€ of total debt, on the municipality’s own account.' },
            },
          ],
          regulador: [
            { divida: 'evora-divida-dgal-2014', limite: 'evora-limite-divida-dgal-2014', indice: 'evora-indice-de-divida-2014', ref: '2014' },
            { divida: 'evora-divida-dgal-2017', limite: 'evora-limite-divida-dgal-2017', indice: 'evora-indice-de-divida-2017', ref: '2017' },
          ],
          reguladorNota: null,
          pelouros: null,
          pelourosNota: {
            pt: 'Fora do que foi lido: as capturas que sustentam a repartição de pelouros começam no mandato seguinte.',
            en: 'Outside what was read: the captures behind the portfolio split begin with the next term.',
          },
        },
        {
          periodo: '2017–2021',
          instalado: '2017-10-20',
          quem: { pt: 'Carlos Pinto de Sá', en: 'Carlos Pinto de Sá' },
          quemData: null,
          lista: 'CDU',
          lugares: 'evora-camara-mandatos-cdu-2017',
          herdou: [
            { claim: 'evora-divida-total-2017', texto: { pt: '€ de dívida total.', en: '€ of total debt.' } },
          ],
          decidiu: null,
          /* SEM NOTA, E A AUSÊNCIA DIZ-SE NAS DUAS PALAVRAS DA CASA (direção,
             21.08.2026, tarde). O parágrafo que aqui estava explicava a
             diferença entre um campo em branco e uma linha que falta, e isso é
             a casa a falar de si na página do leitor (Emenda 15). Com `decidiu`
             a nulo e `decidiuNota` a nulo, a vista rende «sem linha ainda» /
             «no row yet», que é a mesma cadeia que uma peça vazia usa. */
          decidiuNota: null,
          deixou: [
            { claim: 'evora-divida-total-2021', texto: { pt: '€ de dívida total.', en: '€ of total debt.' } },
          ],
          regulador: [
            { divida: 'evora-divida-dgal-2021', limite: 'evora-limite-divida-dgal-2021', indice: 'evora-indice-de-divida-2021', ref: '2021' },
          ],
          reguladorNota: null,
          pelouros: null,
          pelourosNota: {
            pt: 'Fora do que foi lido.',
            en: 'Outside what was read.',
          },
        },
        {
          periodo: '2021–2025',
          instalado: '2021-10-15',
          quem: { pt: 'Carlos Pinto de Sá', en: 'Carlos Pinto de Sá' },
          quemData: null,
          lista: 'CDU',
          listaNota: { pt: 'em minoria', en: 'in minority' },
          lugares: 'evora-camara-mandatos-cdu-2021',
          herdou: [
            { claim: 'evora-divida-total-2021', texto: { pt: '€ de dívida total.', en: '€ of total debt.' } },
          ],
          decidiu: [
            {
              claim: 'evora-pelouros-2021-total',
              texto: {
                pt: 'designações de pelouro repartidas por duas pessoas do executivo.',
                en: 'portfolio designations split between two members of the executive.',
              },
            },
          ],
          deixou: [
            { claim: 'evora-divida-total-2025', texto: { pt: '€ de dívida total.', en: '€ of total debt.' } },
            {
              claim: 'evora-prazo-medio-de-pagamento-2025',
              texto: { pt: 'dias de prazo médio de pagamento a fornecedores, e', en: 'days of average time to pay suppliers, and' },
            },
            { claim: 'evora-pagamentos-em-atraso-2025', texto: { pt: '€ de pagamentos em atraso.', en: '€ of overdue payments.' } },
          ],
          regulador: [
            { divida: 'evora-divida-dgal-2024', limite: 'evora-limite-divida-dgal-2024', indice: 'evora-indice-de-divida-2024', ref: '2024' },
          ],
          reguladorNota: null,
          pelouros: {
            total: 'evora-pelouros-2021-total',
            partes: ['evora-pelouros-2021-presidente', 'evora-pelouros-2021-vice-presidente'],
            texto: {
              pt: 'designações, sobre as duas únicas pessoas do executivo a quem a página da câmara atribuía alguma: ',
              en: 'designations, over the only two members of the executive to whom the council’s page assigned any: ',
            },
          },
          contasVotadas: {
            favor: 'evora-contas-2024-votos-favor',
            contra: 'evora-contas-2024-votos-contra',
            texto: {
              pt: 'votos a favor e contra, na votação das contas do penúltimo ano deste mandato. O auditor emitiu por isso uma declaração de impossibilidade de certificação legal das contas.',
              en: 'votes for and against, in the vote on the accounts of this term’s second-to-last year. The auditor therefore issued a declaration that the accounts could not be legally certified.',
            },
          },
        },
        {
          periodo: '2025–',
          instalado: '2025-10-31',
          quem: { pt: 'Carlos Zorrinho', en: 'Carlos Zorrinho' },
          quemData: null,
          lista: 'PS',
          lugares: 'evora-camara-mandatos-ps-2025',
          lugaresTotal: 'evora-camara-lugares',
          herdou: [
            { claim: 'evora-divida-total-2025', texto: { pt: '€ de dívida total.', en: '€ of total debt.' } },
          ],
          decidiu: [
            {
              claim: 'evora-pelouros-2025-total',
              texto: {
                pt: 'designações de pelouro repartidas por três pessoas do executivo.',
                en: 'portfolio designations split between three members of the executive.',
              },
            },
          ],
          deixou: null,
          deixouNota: { pt: 'Em funções.', en: 'In office.' },
          regulador: null,
          reguladorNota: {
            pt: 'A série anual do regulador ainda não chegou a este mandato.',
            en: 'The regulator’s annual series has not yet reached this term.',
          },
          pelouros: {
            total: 'evora-pelouros-2025-total',
            partes: [
              'evora-pelouros-2025-presidente',
              'evora-pelouros-2025-vice-presidente',
              'evora-pelouros-2025-vereadora',
            ],
            texto: {
              pt: 'designações, sobre as três pessoas do executivo a quem a página da câmara atribui alguma: ',
              en: 'designations, over the three members of the executive to whom the council’s page assigns any: ',
            },
          },
          executivo: [
            { claim: 'evora-executivo-2025-ps', rotulo: 'PS' },
            { claim: 'evora-executivo-2025-ad', rotulo: 'AD' },
            { claim: 'evora-executivo-2025-cdu', rotulo: 'CDU' },
            { claim: 'evora-executivo-2025-chega', rotulo: 'CH' },
          ],
        },
      ],
      /* O excesso sobre o tecto legal, no primeiro e no último ano em que o
         relatório o publica como um valor positivo. O ano seguinte da mesma
         tabela é negativo — e um negativo ali já não é excesso, é capacidade
         de endividamento. Por isso a página pára aqui. */
      excesso: {
        de: 'evora-excesso-endividamento-2014',
        ate: 'evora-excesso-endividamento-2019',
        deRef: 'janeiro de 2014',
        deRefEn: 'January 2014',
        ateRef: 'dezembro de 2019',
        ateRefEn: 'December 2019',
      },
    },

    /* ---------------------------------------------- método e ressalvas (§1.3)
       Cada uma é a mesma coisa que um dos cinco trabalhos imprime nos seus
       próprios limites. A frase de origem de cada uma está registada em
       DECISIONS §1.34 com ficheiro e linha. Nenhuma vai além dela. */
    metodo: [
      {
        k: { pt: 'Não existe PIB municipal', en: 'There is no municipal GDP' },
        v: {
          pt: ['Nenhuma fonte publica um produto interno bruto para um concelho, e esta página não fabrica nenhum. O que existe é o registo empresarial: as contas das empresas sediadas no concelho, que creditam toda a atividade de uma empresa ao concelho da sua sede. Não é PIB municipal, e o trabalho sobre a economia escreve porquê nos seus limites: «não capta a administração pública, a maior parte da universidade e do hospital».'],
          en: ['No source publishes a gross domestic product for a municipality, and this page manufactures none. What does exist is the business register: the accounts of enterprises headquartered in the municipality, which credit a firm’s whole activity to its head-office municipality. It is not municipal GDP, and the work on the economy writes why in its own limits: «it misses public administration, most of the university and the hospital».'],
        },
      },
      {
        k: { pt: 'Duas das oito medidas são o município a falar de si', en: 'Two of the eight measures are the municipality speaking about itself' },
        v: {
          pt: ['A execução da receita e o prazo médio de pagamento são lidos da prestação de contas do próprio município: a sua linha no livro-razão nomeia esse documento e a página onde estão. As duas vozes de fora sobre estas contas são a opinião assinada do auditor e a série anual do regulador, e as duas estão nesta página.'],
          en: ['Revenue execution and the average payment time are read from the municipality’s own accounts: their ledger rows name that document and the page they sit on. The two outside voices on these accounts are the auditor’s signed opinion and the regulator’s annual series, and both are on this page.'],
        },
      },
      {
        k: { pt: 'Um ano de contas existe sem assinatura de fora', en: 'One year of accounts exists without an outside signature' },
        v: {
          pt: [
            'As contas do penúltimo ano do mandato de ',
            { ref: '2021–2025' },
            ' foram rejeitadas em votação e nunca foram certificadas: o auditor emitiu uma declaração de impossibilidade de certificação legal das contas.',
          ],
          en: [
            'The accounts of the second-to-last year of the ',
            { ref: '2021–2025' },
            ' term were rejected in a vote and were never certified: the auditor issued a declaration that the accounts could not be legally certified.',
          ],
        },
      },
      {
        k: { pt: 'Duas vozes de fora, não uma', en: 'Two outside voices, not one' },
        v: {
          pt: ['Sobre as contas deste município existem duas vozes que não são a dele: a opinião assinada do auditor independente, e a série anual do regulador, que publica por município e por ano o mesmo conceito legal de dívida que o relatório usa, compilado do lado de fora. As duas estão nesta página.'],
          en: ['On this municipality’s accounts there are two voices that are not its own: the independent auditor’s signed opinion, and the regulator’s annual series, which publishes per municipality and per year the same legal debt concept the report uses, compiled from outside. Both are on this page.'],
        },
      },
      {
        k: { pt: 'Nenhuma fonte publica dinheiro por pelouro', en: 'No source publishes money per portfolio' },
        v: {
          pt: ['As contagens de pelouros desta página são designações, não despesa. A correspondência entre as contas e os pelouros existe num dos trabalhos, é declarada por ele como sua e não como oficial, e esta página não a usa para atribuir dinheiro a ninguém. Esse trabalho fixa também a regra: descrição, nunca classificações.'],
          en: ['The portfolio counts on this page are designations, not spending. The mapping between the accounts and the portfolios exists in one of the works, is declared by it as its own and not as official, and this page does not use it to attribute money to anyone. That work also sets the rule: description, never scores.'],
        },
      },
      {
        k: { pt: 'O dinheiro do plano de recuperação é atribuído pelo registo, não pela câmara', en: 'Recovery-plan money is attributed by the register, not by the council' },
        v: {
          pt: ['Os totais do plano de recuperação que aparecem na leitura desse trabalho são somas sobre o registo público, atribuídas ao concelho por esse registo. Do dinheiro contratado no concelho, a universidade tem mais do que o município, e a camada que administra o dinheiro é feita de organismos nacionais. Que daí resulte que o endereço da responsabilização não são os paços do concelho é a conclusão assinada desse trabalho, e está na página dele.'],
          en: ['The recovery-plan totals that appear in that work’s reading are sums over the public register, attributed to the municipality by that register. Of the money contracted in the municipality, the university holds more than the council, and the layer that administers the money is made of national bodies. That this makes the accountability address something other than the town hall is that work’s own signed conclusion, and it sits on its page.'],
        },
      },
    ],

    /* -------------------------------- o que esta página não sabe (aparelho)
     *
     * UMA RESSALVA, UMA CASA (16.08.2026, DECISIONS §1.40). Quatro destes itens
     * repetiam, em versão curta, uma ressalva que «Método e ressalvas» já diz
     * por inteiro e com a frase do trabalho que a sustenta: não existe PIB
     * municipal; duas das oito medidas são o município a falar de si; um ano de
     * contas existe sem assinatura de fora; nenhuma fonte publica dinheiro por
     * pelouro. Saíram daqui e ficaram lá, que é onde estão ditas com a sua
     * prova; o aparelho ganhou a porta para a secção, com o rótulo dela e sem
     * uma palavra nova. Nenhum valor, nenhum selo e nenhuma frase de trabalho
     * mudou.
     */
    naoSabe: [
      {
        pt: ['Não existe medida de desempenho por pessoa. As contas públicas não são cortadas dessa maneira.'],
        en: ['There is no per-person performance measure. Public accounts are not cut that way.'],
      },
      {
        pt: [
          'A repartição de pelouros do mandato de ',
          { ref: '2009–2013' },
          ' não foi estabelecida: o presidente desse mandato, e todos os outros membros dele, não foram identificados.',
        ],
        en: [
          'The portfolio split of the ',
          { ref: '2009–2013' },
          ' term was not established: the president of that mandate, and every other member of it, were not identified.',
        ],
      },
      {
        pt: [
          'O nome legal completo do presidente interino de ',
          { ref: '2013' },
          ' é ',
          { marcador: 'a verificar', gloss: 'to verify' },
          ' nas palavras do próprio trabalho: duas fontes oficiais dão nomes completos diferentes para o mesmo homem. «Manuel Melgão» é a forma que o próprio município usa.',
        ],
        en: [
          'The full legal name of the interim president of ',
          { ref: '2013' },
          ' is ',
          { marcador: 'a verificar', gloss: 'to verify' },
          ' in the work’s own words: two official sources give different full names for the same man. «Manuel Melgão» is the form the municipality itself uses.',
        ],
      },
      {
        pt: ['Não existe contrafactual para nenhum índice. Nada do que foi lido permite separar a parte de um executivo neles.'],
        en: ['There is no counterfactual for any index. Nothing that was read allows an executive’s share of them to be separated out.'],
      },
      {
        pt: [
          'Os valores do regulador para ',
          { ref: '2017' },
          ' e ',
          { ref: '2021' },
          ' trazem ressalvas do próprio ficheiro (uma nota de rodapé em ',
          { ref: '2017' },
          ', «dados provisórios» em ',
          { ref: '2021' },
          '), ditas na linha de cada um.',
        ],
        en: [
          'The regulator’s values for ',
          { ref: '2017' },
          ' and ',
          { ref: '2021' },
          ' carry caveats written into the file itself (a footnote in ',
          { ref: '2017' },
          ', «dados provisórios» in ',
          { ref: '2021' },
          '), said on each row.',
        ],
      },
      {
        pt: ['Sobre o plano de recuperação: o trabalho lê o catálogo do tribunal de contas, não as suas auditorias; a janela de contratos é um limite superior sobre um período truncado; e não existe um valor da União Europeia para um município.'],
        en: ['On the recovery plan: the work reads the state auditor’s catalogue, not its audits; the contracts window is an upper bound on a truncated period; and no European Union figure exists for a municipality.'],
      },
    ],

    /* ------------------------------------------ os trabalhos sobre o concelho */
    estudos: [
      'evora-prometido-pago-auditado-2026',
      'evora-economia-investidores-portas-abertas-2026',
      'evora-orcamentado-pago-devido-2025',
      'evora-quinze-anos-cinco-mandatos',
      'evora-os-pelouros-quem-os-teve-o-que-fizeram',
    ],
};

/**
 * A LISTA, COMPOSTA E NÃO ESCRITA.
 *
 * A entrada escrita à mão vem primeiro, e as geradas a seguir, pela ordem do
 * ficheiro do motor, que é a ordem da Carta. Um concelho que o motor exporte e
 * que já tenha entrada à mão não entra duas vezes: a escrita à mão ganha, porque
 * é a que tem as camadas que o ficheiro do motor não sabe escrever.
 *
 * Enquanto o motor não escrever o ficheiro, esta lista tem uma entrada. Isso é
 * o estado honesto e não uma falha: o repositório não leva um ficheiro gerado
 * sem dados, e as réguas constroem as 308 páginas com o ficheiro de teste, que
 * vive fora de `src/data/`.
 */
export const MUNICIPIOS_COM_PAGINA = [EVORA, ...entradasGeradas([EVORA.slug])];

/** O município deste slug, ou null. */
export function municipioPorSlug(slug) {
  return MUNICIPIOS_COM_PAGINA.find((m) => m.slug === slug) ?? null;
}
