/**
 * ===========================================================================
 * AS ÁREAS DE GOVERNO, E O ORGANISMO POR QUE CADA PEÇA LÁ ENTRA
 * ===========================================================================
 *
 * Uma área de governo é o conjunto de matérias de um ministério. O nome é o que
 * o Governo publica, nas duas edições, e a fonte de cada nome está escrita
 * abaixo com a data em que foi lida.
 *
 * ---------------------------------------------------------------------------
 * A REGRA, E É UMA SÓ: A ÁREA DE UMA PEÇA É A DE QUEM PUBLICA O SEU NÚMERO
 * ---------------------------------------------------------------------------
 * O brief das áreas escreve o critério: «os trabalhos, as leituras, as linhas do
 * livro-razão e as medidas dos concelhos cujas FONTES pertencem a essa área». A
 * fonte de uma linha é o campo `source` do livro-razão, que nomeia o organismo
 * que publicou o valor; a área desse organismo é a que a lei orgânica do Governo
 * lhe dá, e o artigo está escrito ao lado de cada entrada.
 *
 * NÃO HÁ SEGUNDA REGRA, e a ausência é deliberada. Arrumar um trabalho pela
 * matéria de que ele trata («um trabalho regional é da coesão territorial»)
 * seria um juízo editorial sem porta: ninguém o poderia conferir contra nada. A
 * regra que está aqui confere-se contra um artigo de um decreto-lei e contra um
 * campo de uma linha, e é por isso que `scripts/check-areas.mjs` a pode medir.
 *
 * O QUE ISTO DEIXA DE FORA, e fica dito porque a lista curta é o resultado da
 * regra e não um esquecimento: um organismo que a lei orgânica não nomeia não
 * dá área a nada. É o caso da ERSAR, que a lei orgânica do XXV Governo não
 * nomeia em artigo nenhum; do Município de Évora e das duas direções regionais
 * do emprego, que são de outros governos; e do Eurostat e da PORDATA, que não
 * são do Governo português. As linhas desses organismos continuam onde sempre
 * estiveram, com a sua página e o seu selo: o que não têm é área.
 *
 * ---------------------------------------------------------------------------
 * ESTA LISTA TEM AS ÁREAS QUE O CONTEÚDO SUSTENTA, E NÃO AS DEZASSEIS
 * ---------------------------------------------------------------------------
 * O Governo tem dezasseis áreas. Declarar as dezasseis obrigava a transcrever a
 * lei orgânica inteira para dizer, em doze delas, que não há nada. Uma área
 * entra aqui quando alguém escreve a sua entrada, com os organismos e o artigo
 * que os põe debaixo dela; enquanto isso não acontece, ela não existe no sítio,
 * e nenhuma página vazia é construída. `src/lib/areas.mjs` é quem decide quais
 * das declaradas ganham página, e a decisão é o conteúdo.
 */

/**
 * A FONTE DOS NOMES, uma por edição.
 *
 * O Governo publica a lista das suas áreas nas duas línguas, e são duas secções
 * diferentes do mesmo sítio: em português a secção chama-se «área de governo»,
 * que é a expressão que dá nome a estas páginas; em inglês chama-se
 * «ministries». As duas listas têm dezasseis entradas, pela mesma ordem.
 */
export const FONTE_DOS_NOMES = {
  pt: {
    url: 'https://www.portugal.gov.pt/pt/gc25/governo/composicao',
    seccao: '/pt/gc25/area-de-governo/',
    lido: '2026-08-28',
  },
  en: {
    url: 'https://www.portugal.gov.pt/en/gc25/government/composition',
    seccao: '/en/gc25/ministries/',
    lido: '2026-08-28',
  },
};

/**
 * A LEI QUE PÕE CADA ORGANISMO DEBAIXO DE UMA ÁREA.
 *
 * Lida no Diário da República, no ficheiro que o próprio Diário serve. A
 * Declaração de Retificação n.º 38/2025/1, de 22 de setembro, corrige uma
 * alínea do artigo 26.º (o nome de um conselho consultivo da juventude) e não
 * toca em nenhum dos artigos citados aqui.
 */
export const LEI_ORGANICA = {
  diploma: 'Decreto-Lei n.º 87-A/2025, de 25 de julho',
  publicacao: 'Diário da República, 1.ª série, n.º 142, Suplemento, 25-07-2025',
  url: 'https://files.diariodarepublica.pt/1s/2025/07/14201/0000200027.pdf',
  lido: '2026-08-28',
  retificacao: 'Declaração de Retificação n.º 38/2025/1, de 22 de setembro',
};

/**
 * AS ÁREAS DECLARADAS.
 *
 * `nome` é o nome publicado, nas duas edições, sem abreviar nem traduzir por
 * conta própria: o inglês é o que o Governo escreve na sua página inglesa, e
 * não uma tradução da casa. `organismos` é a lista das fontes do livro-razão
 * que pertencem a esta área, cada uma com o artigo que a lá põe e com o poder
 * que o artigo nomeia; `fonte` é a cadeia exata do campo `source` das linhas,
 * porque é por ela que a comparação se faz.
 *
 * `citacao` é a transcrição da frase da lei. Não se rende em página nenhuma: é
 * o que faz a entrada conferível por quem abrir o ficheiro, e o leitor tem, na
 * página, o nome do organismo em cada linha.
 */
export const AREAS = [
  {
    slug: 'presidencia',
    nome: { pt: 'Presidência', en: 'Presidency' },
    artigo: 'Artigo 14.º',
    organismos: [
      {
        fonte: 'INE',
        artigo: 'Artigo 14.º, n.º 5, alínea a)',
        poder: 'superintendência e tutela',
        citacao:
          'O Ministro da Presidência exerce os poderes de superintendência e tutela sobre: a) O Instituto Nacional de Estatística, I. P.;',
      },
    ],
  },
  {
    slug: 'economia-e-coesao-territorial',
    nome: { pt: 'Economia e Coesão Territorial', en: 'Economy and of Territorial Cohesion' },
    artigo: 'Artigo 15.º',
    organismos: [
      {
        /**
         * A TUTELA DA DGAL, QUE ERA A PERGUNTA ABERTA DO BRIEF.
         *
         * O brief mandava verificá-la na lei orgânica antes de pôr Évora e os
         * concelhos numa área, e dava como alternativa uma área própria
         * «Autarquias locais», dita como divisão do sítio. A alternativa não foi
         * precisa: a lei nomeia a Direção-Geral das Autarquias Locais e diz de
         * quem ela é. A área das autarquias é, por isso, a mesma área da
         * economia, e não uma divisão nossa.
         *
         * O Ministro Adjunto e da Reforma do Estado também nomeia a DGAL, no
         * artigo 16.º, n.º 4, alínea d), e não é a mesma coisa: ali o poder é o
         * de intervir junto dos serviços em matéria de modernização da
         * Administração Pública, e a lista tem catorze organismos de sete áreas
         * diferentes. O poder de direção é o do artigo 15.º, e é ele que decide
         * a área.
         */
        fonte: 'Direção-Geral das Autarquias Locais (DGAL)',
        artigo: 'Artigo 15.º, n.º 3, alínea c)',
        poder: 'direção',
        citacao:
          'O Ministro da Economia e da Coesão Territorial exerce o poder de direção sobre: a) A Direção-Geral da Economia; b) A Direção-Geral do Consumidor; c) A Direção-Geral das Autarquias Locais;',
      },
      {
        fonte: 'Direção-Geral do Território (DGT)',
        artigo: 'Artigo 15.º, n.º 4',
        poder: 'direção, em coordenação com o Ambiente e Energia e com a Agricultura e Mar',
        citacao:
          'O Ministro da Economia e da Coesão Territorial exerce o poder de direção sobre a Direção-Geral do Território, em coordenação com a Ministra do Ambiente e Energia e com o Ministro da Agricultura e Mar, em matérias da sua competência.',
      },
    ],
  },
  {
    slug: 'administracao-interna',
    nome: { pt: 'Administração Interna', en: 'Home Affairs' },
    artigo: 'Artigo 21.º',
    organismos: [
      {
        fonte: 'Secretaria-Geral do Ministério da Administração Interna (SGMAI)',
        artigo: 'Artigo 21.º, n.º 2, alínea d)',
        poder: 'direção',
        citacao:
          'A Ministra da Administração Interna exerce o poder de direção sobre: … d) A Secretaria-Geral do Ministério da Administração Interna;',
      },
    ],
  },
  {
    slug: 'trabalho-solidariedade-e-seguranca-social',
    nome: {
      pt: 'Trabalho, Solidariedade e Segurança Social',
      en: 'Labour, Solidarity and Social Security',
    },
    artigo: 'Artigo 24.º',
    organismos: [
      {
        fonte: 'Instituto do Emprego e Formação Profissional (IEFP)',
        artigo: 'Artigo 24.º, n.º 7',
        poder: 'superintendência e tutela, em coordenação com a Economia e Coesão Territorial',
        citacao:
          'A Ministra do Trabalho, Solidariedade e Segurança Social exerce os poderes de superintendência e tutela sobre o Instituto do Emprego e da Formação Profissional, I. P., em coordenação com o Ministro da Economia e da Coesão Territorial.',
      },
    ],
  },
];

/**
 * OS ORGANISMOS QUE A LEI ORGÂNICA NÃO PÕE DEBAIXO DE UMA ÁREA.
 *
 * Não é uma lista de coisas por fazer: é a lista das decisões que a regra tomou,
 * com a razão de cada uma, ao lado da lista que a regra construiu. Existe pela
 * mesma razão que `EXCLUIDOS` existe em `src/data/studies.mjs`: quem vier a
 * seguir vai olhar para aqui, e um organismo desta lista já foi ponderado.
 *
 * `scripts/check-areas.mjs` confere que todas as fontes do livro-razão estão ou
 * numa área ou nesta lista. Uma fonte nova que não esteja em nenhuma das duas
 * fecha a construção, que é o que faz esta lista valer alguma coisa.
 */
export const SEM_AREA = [
  {
    fonte: 'Eurostat',
    motivo:
      'É o serviço de estatística da União Europeia, e não um organismo do Governo português.',
  },
  {
    fonte: 'ERSAR',
    motivo:
      'A lei orgânica do XXV Governo não a nomeia em artigo nenhum, e o artigo 25.º, que é o do Ambiente e Energia, lista os organismos daquela área sem a incluir. Sem um artigo que a ponha debaixo de uma área, não há área para lhe dar.',
  },
  {
    fonte: 'Município de Évora',
    motivo: 'É uma autarquia local, e as suas contas são publicadas por ela própria.',
  },
  {
    fonte: 'Direção Regional de Qualificação Profissional e Emprego (DRQPE)',
    motivo: 'É do Governo Regional dos Açores, e não do Governo da República.',
  },
  {
    fonte: 'Instituto de Emprego da Madeira, IP-RAM (IEM)',
    motivo: 'É do Governo Regional da Madeira, e não do Governo da República.',
  },
  {
    fonte: 'Estrutura de Missão Recuperar Portugal',
    motivo:
      'A lei orgânica não a nomeia. O plano de recuperação está nas matérias do artigo 15.º, n.º 2, mas o que a regra desta lista exige é o organismo nomeado, e não a matéria de que ele trata.',
  },
  {
    fonte: 'Grupo de Trabalho para a Reforma da Segurança Social',
    motivo:
      'A lei orgânica não o nomeia. É um grupo de trabalho, e o diploma que o criou não foi lido.',
  },
  {
    fonte: 'PORDATA',
    motivo: 'É uma base de dados de uma fundação privada.',
  },
  {
    fonte: 'Marques, Cruz & Associados',
    motivo: 'É uma sociedade de revisores oficiais de contas.',
  },
  {
    /* O TRAVESSÃO VAI ESCAPADO, e não é preciosismo: esta cadeia é o campo
       `source` de uma linha do livro-razão, e a comparação de `check-areas.mjs`
       é carácter a carácter. Escrito por extenso, o travessão fechava a régua da
       ortografia, que varre `src/data/*.mjs` inteiro e manda reescrever à mão
       todos os travessões da superfície pública. A escapatória mantém o valor
       exacto e tira o carácter do ficheiro. */
    fonte: 'CICF/IPCA \u2014 Anuário Financeiro dos Municípios Portugueses',
    motivo: 'É um centro de investigação de um instituto politécnico.',
  },
  {
    fonte: 'O Estado do País',
    motivo: 'É este sítio a contar-se a si próprio.',
  },
];

/** Uma área pelo seu nome no endereço, tal como o ficheiro a declara. */
export function areaDeclarada(slug) {
  return AREAS.find((a) => a.slug === slug) ?? null;
}
