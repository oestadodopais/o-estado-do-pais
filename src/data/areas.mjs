/**
 * ===========================================================================
 * AS ÁREAS DE GOVERNO, E A MATÉRIA POR QUE CADA PEÇA LÁ ENTRA
 * ===========================================================================
 *
 * Uma área de governo é o conjunto de matérias de um ministério. O nome é o que
 * o Governo publica, nas duas edições, e a fonte de cada nome está escrita
 * abaixo com a data em que foi lida.
 *
 * ---------------------------------------------------------------------------
 * A REGRA, E É UMA SÓ: A ÁREA DE UMA PEÇA É A DE QUEM TEM A MATÉRIA
 * ---------------------------------------------------------------------------
 * A área de uma peça é a do ministério cujas matérias, tal como a lei orgânica
 * as lista, cobrem o ASSUNTO da peça. As matérias de um ministério estão no
 * artigo dele, no número que diz «tem por missão formular, conduzir, executar e
 * avaliar as políticas de …»; esse número está transcrito ao lado de cada
 * matéria, e cada regra diz que assunto é que a matéria cobre.
 *
 * A REGRA ANTERIOR ERA A DE QUEM PUBLICA O NÚMERO, e mudou por decisão do
 * diretor de 28.08.2026: era rigorosa e ilegível. A dívida de um município
 * caía na área de quem a publica, e a população de um concelho na Presidência,
 * porque o INE está debaixo do Ministro da Presidência. Um leitor que procura a
 * população não pensa «Presidência», e uma arrumação que ele não consegue
 * adivinhar não é navegação.
 *
 * O QUE MUDA NA PROVA. A regra antiga conferia-se contra um campo do
 * livro-razão; esta confere-se contra o texto da lei, que está aqui transcrito,
 * e contra uma lista de regras que diz, linha a linha, que assunto é o dela.
 * `scripts/check-areas.mjs` prova que as regras cobrem TODAS as linhas do
 * livro-razão e que nenhuma linha é coberta duas vezes: uma linha nova sem
 * assunto declarado fecha a construção.
 *
 * O DESEMPATE, QUANDO DUAS MATÉRIAS COBREM O MESMO ASSUNTO, é a área do
 * organismo que publica o número, e a razão da regra di-lo. Hoje NENHUMA regra
 * precisa dele: o portão prova que cada linha é coberta por uma matéria só, e a
 * escolha entre matérias vizinhas está escrita no relatório do bloco, uma a
 * uma, com o que ficou de fora dela.
 *
 * ---------------------------------------------------------------------------
 * QUANDO A LEI CALA, A PEÇA FICA DE FORA
 * ---------------------------------------------------------------------------
 * Nenhuma matéria se inventa. Uma peça cujo assunto não esteja nas matérias de
 * nenhum ministério fica fora, com a razão escrita em `SEM_AREA`. É por isso
 * que a população dos concelhos não tem área: «estatística» não é matéria de
 * ministério nenhum neste diploma (a palavra só ocorre no nome de dois
 * organismos), e uma contagem de pessoas não é uma política.
 *
 * ---------------------------------------------------------------------------
 * ESTA LISTA TEM AS ÁREAS QUE O CONTEÚDO SUSTENTA, E NÃO AS DEZASSEIS
 * ---------------------------------------------------------------------------
 * O Governo tem dezasseis áreas. Uma área entra aqui quando alguém escreve a
 * sua entrada, com as matérias e o artigo que as lista; enquanto isso não
 * acontece, ela não existe no sítio, e nenhuma página vazia é construída.
 * `src/lib/areas.mjs` é quem decide quais das declaradas ganham página, e a
 * decisão é o conteúdo.
 *
 * A ORDEM É A DO GOVERNO, e não a do tamanho: a lista publicada da composição
 * do XXV Governo Constitucional, na ordem em que ela nomeia os ministros. Uma
 * ordem por número de peças era uma ordenação nossa a parecer-se com uma coisa
 * do Governo.
 */

/**
 * A FONTE DOS NOMES, uma por edição.
 *
 * O Governo publica a lista das suas áreas nas duas línguas, e são duas secções
 * diferentes do mesmo sítio: em português a secção chama-se «área de governo»,
 * que é a expressão que dá nome a estas páginas; em inglês chama-se
 * «ministries». As duas listas têm dezasseis entradas, pela mesma ordem.
 *
 * O NOME PORTUGUÊS DE CADA ÁREA TEM DUAS FONTES QUE DIZEM O MESMO: a lista
 * publicada da composição do Governo, lida a 28.08.2026, e o título do artigo
 * da lei orgânica que fixa as matérias daquele ministério. Os dois estão
 * escritos por baixo de cada área.
 *
 * O NOME INGLÊS DAS NOVE ÁREAS É O QUE O GOVERNO PUBLICA, e nenhum é tradução da
 * casa. O campo `nomeEnFonte` diz de onde veio cada um, e hoje vale `governo`
 * nos nove.
 *
 * FORAM DUAS LEITURAS, EM DUAS PÁGINAS, e ficam separadas porque foram: os
 * nomes de Economia e Coesão Territorial, Administração Interna e Trabalho,
 * Solidariedade e Segurança Social saíram da página da composição do Governo,
 * lida no navegador a 28.08.2026; os de Finanças, Infraestruturas e Habitação,
 * Justiça, Educação, Ciência e Inovação, Saúde e Ambiente e Energia saíram da
 * página das áreas de governo (`/en/gc25/ministries`), lida no navegador no
 * mesmo dia pelo lugar de direção. As duas páginas são construídas por script e
 * não se deixam ler por um leitor simples, e é por isso que a leitura é sempre
 * de navegador e a data fica escrita.
 *
 * O CAMPO FICA, mesmo com um valor só. Ele não é uma nota histórica: é a
 * pergunta que uma área nova tem de responder antes de entrar. Uma área
 * declarada com `nomeEnFonte: 'casa'` está a dizer que o nome inglês dela é uma
 * tradução literal nossa e não o nome oficial, e isso tem de ficar dito na linha
 * do inventário. Traduzir por conta própria e não o dizer era inventar um nome
 * oficial.
 */
export const FONTE_DOS_NOMES = {
  pt: {
    url: 'https://www.portugal.gov.pt/pt/gc25/governo/composicao',
    seccao: '/pt/gc25/area-de-governo/',
    lido: '2026-08-28',
  },
  en: {
    /* A página das áreas de governo é a que lista os dezasseis nomes ingleses, e
       é dela que saem seis dos nove desta lista; a da composição do Governo é a
       irmã inglesa da portuguesa, e é dela que saíram os outros três. As duas
       foram lidas no navegador a 28.08.2026. */
    url: 'https://www.portugal.gov.pt/en/gc25/ministries',
    composicao: 'https://www.portugal.gov.pt/en/gc25/government/composition',
    seccao: '/en/gc25/ministries/',
    lido: '2026-08-28',
  },
};

/**
 * A LEI QUE LISTA AS MATÉRIAS DE CADA MINISTÉRIO.
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
 * `nome` é o nome publicado, nas duas edições. `materias` é a lista das
 * matérias desta área que alguma peça do sítio toca, cada uma com:
 *
 *   · `materia`  as palavras da lei, tal como ela as escreve;
 *   · `artigo`   o artigo e o número onde elas estão;
 *   · `citacao`  a transcrição do número inteiro, para que a matéria se possa
 *                ler no seu contexto sem abrir o diploma;
 *   · `regras`   que linhas do livro-razão é que esta matéria cobre, e porquê.
 *
 * Uma regra é `{ estudos?, id, razao }`: `estudos` limita a regra a um estudo
 * (quando falta, vale para todos), `id` é a expressão que os identificadores
 * das linhas têm de casar, e `razao` diz que assunto é o delas e porque é que a
 * matéria o cobre. A expressão é sobre o IDENTIFICADOR da linha porque o
 * identificador é o nome do assunto («evora-divida-dgal-2024»), e não sobre a
 * fonte: a fonte era a regra antiga.
 *
 * `citacao` não se rende em página nenhuma: é o que faz a entrada conferível
 * por quem abrir o ficheiro.
 */
export const AREAS = [
  {
    slug: 'financas',
    nome: { pt: 'Finanças', en: 'Finance' },
    nomeEnFonte: 'governo',
    artigo: 'Artigo 12.º',
    materias: [
      {
        materia: 'a política financeira do Estado',
        artigo: 'Artigo 12.º, n.º 1',
        citacao:
          'O Ministério das Finanças é o departamento governamental que tem por missão formular, conduzir, executar e avaliar a política financeira do Estado, promovendo a gestão racional dos recursos públicos, o aumento da eficiência e a equidade na sua obtenção e gestão, bem como políticas para a Administração Pública e o emprego público.',
        regras: [
          {
            id: /^divida-publica-\d{4}$/,
            razao:
              'A dívida bruta das administrações públicas é o passivo do Estado, e o Estado é o sujeito da matéria: a política financeira DO ESTADO. O que a lei não dá às Finanças é a dívida de quem não é o Estado, e por isso a dívida das famílias e a das empresas ficam de fora.',
          },
        ],
      },
    ],
  },

  {
    slug: 'economia-e-coesao-territorial',
    nome: { pt: 'Economia e Coesão Territorial', en: 'Economy and of Territorial Cohesion' },
    nomeEnFonte: 'governo',
    artigo: 'Artigo 15.º',
    materias: [
      {
        materia: 'administração local',
        artigo: 'Artigo 15.º, n.º 1',
        citacao:
          'O Ministério da Economia e da Coesão Territorial é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de desenvolvimento dirigidas ao crescimento da economia, da competitividade, do investimento e da inovação, à internacionalização das empresas, à promoção da indústria, do comércio, dos serviços e do turismo, à defesa dos consumidores, bem como, participar na coordenação interministerial das políticas de desenvolvimento económico e social e formular, conduzir, executar e avaliar as políticas de coesão territorial, de administração local, do ordenamento do território, de cooperação territorial europeia, de desenvolvimento regional, de cidades e de valorização do interior, tendo em vista a redução das desigualdades territoriais e o desenvolvimento equilibrado do território, atendendo às especificidades das áreas do País com baixa densidade populacional e aos territórios transfronteiriços.',
        regras: [
          {
            estudos: ['concelhos-2026'],
            id: /-(divida-dgal|limite-divida-dgal|indice-de-divida)-\d{4}$/,
            razao:
              'A dívida total de um município, o limite legal dela e o índice que os divide são as contas de uma autarquia local. O assunto é a administração local, que a lei lista por esse nome.',
          },
          {
            estudos: ['concelhos-2026'],
            id: /^indice-de-divida-limite-legal$/,
            razao:
              'O limite de 150 % é a regra legal a que a dívida de um município está sujeita: é o mesmo assunto das linhas que ela limita.',
          },
          {
            estudos: ['concelhos-2026'],
            id: /-prazo-medio-de-pagamento-\d{4}-\d{2}$/,
            razao:
              'O prazo médio de pagamento a fornecedores é uma medida da execução financeira de uma autarquia local.',
          },
          {
            estudos: ['evora-orcamentado-pago-devido-2025', 'evora-os-pelouros-quem-os-teve-o-que-fizeram'],
            id: /^evora-/,
            razao:
              'O orçamento, a receita, a despesa, a dívida, a margem de endividamento, o prazo de pagamento e os pelouros de uma câmara municipal são o funcionamento de uma autarquia local, e a certificação das contas dela e o voto que a aprovou são a prestação de contas dessa autarquia.',
          },
          {
            estudos: ['evora-quinze-anos-cinco-mandatos'],
            id: /^evora-(divida-|excesso-endividamento-|pael-emprestimo|saneamento-financeiro-)/,
            razao:
              'A dívida do município ao longo de quinze anos, o excesso sobre o limite legal, o empréstimo do PAEL e o saneamento financeiro são as contas de uma autarquia local.',
          },
          {
            estudos: ['o-estado-do-pais'],
            id: /^municipios-(continente|madeira|acores|portugal)-caop-\d{4}$/,
            razao:
              'Quantos municípios existem no continente, na Madeira, nos Açores e no País é a divisão administrativa do território em autarquias locais, que a Carta Administrativa Oficial fixa.',
          },
        ],
      },
      {
        materia: 'coesão territorial',
        artigo: 'Artigo 15.º, n.º 1',
        citacao:
          'O Ministério da Economia e da Coesão Territorial é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de desenvolvimento dirigidas ao crescimento da economia, da competitividade, do investimento e da inovação, à internacionalização das empresas, à promoção da indústria, do comércio, dos serviços e do turismo, à defesa dos consumidores, bem como, participar na coordenação interministerial das políticas de desenvolvimento económico e social e formular, conduzir, executar e avaliar as políticas de coesão territorial, de administração local, do ordenamento do território, de cooperação territorial europeia, de desenvolvimento regional, de cidades e de valorização do interior, tendo em vista a redução das desigualdades territoriais e o desenvolvimento equilibrado do território, atendendo às especificidades das áreas do País com baixa densidade populacional e aos territórios transfronteiriços.',
        regras: [
          {
            estudos: ['avaliacao-economica-regional-de-portugal-2026', 'alentejo-algarve'],
            id: /^(pib-pc-|distancia-)/,
            razao:
              'O índice de PIB per capita de cada região com a UE-27 em 100, e a distância de cada uma a essa média, medem a desigualdade entre territórios. É o assunto da política de coesão territorial e de desenvolvimento regional, e o mesmo número do lado de quem o publica seria o Eurostat, que não é do Governo: a área é da matéria e não do publicador.',
          },
          {
            estudos: ['concelhos-2026'],
            id: /-poder-de-compra-\d{4}$/,
            razao:
              'O poder de compra per capita de um concelho, com Portugal em 100, mede a distância desse território à média do País. É a desigualdade territorial que a matéria da coesão territorial tem por objeto.',
          },
          {
            estudos: ['evora-economia-investidores-portas-abertas-2026'],
            id: /-poder-de-compra-\d{4}$/,
            razao:
              'O poder de compra per capita de Évora e do Alentejo Central, com Portugal em 100, mede a distância daqueles territórios à média do País.',
          },
        ],
      },
      {
        materia: 'crescimento da economia',
        artigo: 'Artigo 15.º, n.º 1',
        citacao:
          'O Ministério da Economia e da Coesão Territorial é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de desenvolvimento dirigidas ao crescimento da economia, da competitividade, do investimento e da inovação, à internacionalização das empresas, à promoção da indústria, do comércio, dos serviços e do turismo, à defesa dos consumidores, bem como, participar na coordenação interministerial das políticas de desenvolvimento económico e social e formular, conduzir, executar e avaliar as políticas de coesão territorial, de administração local, do ordenamento do território, de cooperação territorial europeia, de desenvolvimento regional, de cidades e de valorização do interior, tendo em vista a redução das desigualdades territoriais e o desenvolvimento equilibrado do território, atendendo às especificidades das áreas do País com baixa densidade populacional e aos territórios transfronteiriços.',
        regras: [
          {
            id: /^pib-real-per-capita-\d{4}$/,
            razao: 'O produto interno bruto real por habitante é a medida do tamanho da economia por pessoa.',
          },
          {
            estudos: ['evora-economia-investidores-portas-abertas-2026'],
            id: /^(evora-vab-empresarial-|evora-concentracao-vab4-|portugal-concentracao-vab4-)/,
            razao:
              'O valor acrescentado bruto das empresas de um concelho é o tamanho da economia dele, e a parte dele que cabe às quatro maiores é o quanto essa economia depende de poucas. O assunto é a economia e a sua estrutura, e não a contagem das empresas, que fica de fora.',
          },
        ],
      },
      {
        materia: 'competitividade',
        artigo: 'Artigo 15.º, n.º 1',
        citacao:
          'O Ministério da Economia e da Coesão Territorial é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de desenvolvimento dirigidas ao crescimento da economia, da competitividade, do investimento e da inovação, à internacionalização das empresas, à promoção da indústria, do comércio, dos serviços e do turismo, à defesa dos consumidores, bem como, participar na coordenação interministerial das políticas de desenvolvimento económico e social e formular, conduzir, executar e avaliar as políticas de coesão territorial, de administração local, do ordenamento do território, de cooperação territorial europeia, de desenvolvimento regional, de cidades e de valorização do interior, tendo em vista a redução das desigualdades territoriais e o desenvolvimento equilibrado do território, atendendo às especificidades das áreas do País com baixa densidade populacional e aos territórios transfronteiriços.',
        regras: [
          {
            id: /^custo-unitario-do-trabalho-\d{4}$/,
            razao:
              'O custo do trabalho por unidade produzida é um indicador de competitividade da economia, e é por isso que o painel europeu dos desequilíbrios o publica. Não é matéria de condições de trabalho: o que ele mede é o preço a que a economia produz.',
          },
        ],
      },
      {
        materia: 'investimento',
        artigo: 'Artigo 15.º, n.º 1',
        citacao:
          'O Ministério da Economia e da Coesão Territorial é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de desenvolvimento dirigidas ao crescimento da economia, da competitividade, do investimento e da inovação, à internacionalização das empresas, à promoção da indústria, do comércio, dos serviços e do turismo, à defesa dos consumidores, bem como, participar na coordenação interministerial das políticas de desenvolvimento económico e social e formular, conduzir, executar e avaliar as políticas de coesão territorial, de administração local, do ordenamento do território, de cooperação territorial europeia, de desenvolvimento regional, de cidades e de valorização do interior, tendo em vista a redução das desigualdades territoriais e o desenvolvimento equilibrado do território, atendendo às especificidades das áreas do País com baixa densidade populacional e aos territórios transfronteiriços.',
        regras: [
          {
            id: /^formacao-bruta-de-capital-fixo-\d{4}$/,
            razao:
              'A formação bruta de capital fixo é o investimento da economia, em percentagem do produto. A matéria chama-se investimento.',
          },
        ],
      },
      {
        materia: 'internacionalização das empresas',
        artigo: 'Artigo 15.º, n.º 1',
        citacao:
          'O Ministério da Economia e da Coesão Territorial é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de desenvolvimento dirigidas ao crescimento da economia, da competitividade, do investimento e da inovação, à internacionalização das empresas, à promoção da indústria, do comércio, dos serviços e do turismo, à defesa dos consumidores, bem como, participar na coordenação interministerial das políticas de desenvolvimento económico e social e formular, conduzir, executar e avaliar as políticas de coesão territorial, de administração local, do ordenamento do território, de cooperação territorial europeia, de desenvolvimento regional, de cidades e de valorização do interior, tendo em vista a redução das desigualdades territoriais e o desenvolvimento equilibrado do território, atendendo às especificidades das áreas do País com baixa densidade populacional e aos territórios transfronteiriços.',
        regras: [
          {
            id: /^desempenho-das-exportacoes-\d{4}$/,
            razao:
              'A quota de Portugal nas exportações das economias avançadas mede o que as empresas portuguesas vendem fora. O assunto é a internacionalização delas.',
          },
        ],
      },
      {
        materia: 'os programas financiados por fundos europeus, nomeadamente no âmbito da política de coesão da União Europeia e do Plano de Recuperação e Resiliência (PRR)',
        artigo: 'Artigo 15.º, n.º 2',
        citacao:
          'O Ministério da Economia e da Coesão Territorial tem ainda por missão formular, conduzir e avaliar as estratégias de desenvolvimento económico e social relacionadas com os objetivos da convergência e da coesão, assim como definir e executar a estratégia, as prioridades, as orientações, a monitorização, a avaliação e a gestão global dos programas financiados por fundos europeus, nomeadamente no âmbito da política de coesão da União Europeia e do Plano de Recuperação e Resiliência (PRR).',
        regras: [
          {
            estudos: ['evora-prometido-pago-auditado-2026'],
            id: /^evora-prr-/,
            razao:
              'O aprovado, o contratado, o pago e o vencido do PRR num concelho são a execução do Plano de Recuperação e Resiliência, que este número da lei nomeia pelo nome. A Estrutura de Missão que publica as listagens não é nomeada em artigo nenhum, e pela regra antiga estas linhas ficavam sem área; pela regra da matéria não ficam, porque o assunto está escrito na lei.',
          },
          {
            estudos: ['which-door-is-yours'],
            id: /^avisos-pt2030-/,
            razao:
              'Os avisos abertos do Portugal 2030, e quantos deles aceitam pessoas singulares, são a execução de um programa financiado por fundos europeus no âmbito da política de coesão da União Europeia. A fonte destas duas linhas está por confirmar, e com a regra da matéria isso deixa de a impedir de ter área: o assunto não depende de quem o publica.',
          },
        ],
      },
    ],
  },

  {
    slug: 'infraestruturas-e-habitacao',
    nome: { pt: 'Infraestruturas e Habitação', en: 'Infrastructure and Housing' },
    nomeEnFonte: 'governo',
    artigo: 'Artigo 19.º',
    materias: [
      {
        materia: 'habitação',
        artigo: 'Artigo 19.º, n.º 1',
        citacao:
          'O Ministro das Infraestruturas e Habitação formula, conduz, executa e avalia as políticas de infraestruturas nas áreas da mobilidade, transportes terrestres e aéreos e respetivas infraestruturas, incluindo a segurança dos mesmos, e das comunicações, bem como as políticas dos transportes fluviais, marítimos e dos portos, incluindo a segurança dos mesmos, e as políticas de habitação, de reabilitação urbana, da construção e de imobiliário, incluindo a regulação dos contratos públicos.',
        regras: [
          {
            id: /^(precos-da-habitacao|sobrecarga-do-custo-da-habitacao)-\d{4}$/,
            razao:
              'O preço das casas e a parte das famílias que gasta mais de 40 % do rendimento com a habitação são o custo de ter casa. A matéria chama-se habitação.',
          },
        ],
      },
      {
        materia: 'construção',
        artigo: 'Artigo 19.º, n.º 1',
        citacao:
          'O Ministro das Infraestruturas e Habitação formula, conduz, executa e avalia as políticas de infraestruturas nas áreas da mobilidade, transportes terrestres e aéreos e respetivas infraestruturas, incluindo a segurança dos mesmos, e das comunicações, bem como as políticas dos transportes fluviais, marítimos e dos portos, incluindo a segurança dos mesmos, e as políticas de habitação, de reabilitação urbana, da construção e de imobiliário, incluindo a regulação dos contratos públicos.',
        regras: [
          {
            id: /^licencas-de-construcao-\d{4}$/,
            razao:
              'As licenças de construção residencial emitidas por mil habitantes medem o que se licencia construir. A matéria chama-se construção, e está no mesmo número que a habitação.',
          },
        ],
      },
    ],
  },

  {
    slug: 'justica',
    nome: { pt: 'Justiça', en: 'Justice' },
    nomeEnFonte: 'governo',
    artigo: 'Artigo 20.º',
    materias: [
      {
        materia: 'a política de justiça',
        artigo: 'Artigo 20.º, n.º 1',
        citacao:
          'O Ministério da Justiça é o departamento governamental que tem por missão formular, conduzir, executar e avaliar a política de justiça definida pela Assembleia da República e pelo Governo.',
        regras: [
          {
            id: /^independencia-da-justica-\d{4}$/,
            razao:
              'A independência do sistema de justiça, tal como as pessoas a percebem, tem por objeto o sistema de justiça. É a única matéria deste diploma que o nomeia, e ela é uma só: a política de justiça.',
          },
        ],
      },
    ],
  },

  {
    slug: 'administracao-interna',
    nome: { pt: 'Administração Interna', en: 'Home Affairs' },
    nomeEnFonte: 'governo',
    artigo: 'Artigo 21.º',
    materias: [
      {
        materia: 'administração eleitoral',
        artigo: 'Artigo 21.º, n.º 1',
        citacao:
          'O Ministério da Administração Interna é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de segurança interna, do controlo de fronteiras, de proteção e socorro, de planeamento civil de emergência, de segurança rodoviária e de administração eleitoral.',
        regras: [
          {
            estudos: ['evora-quinze-anos-cinco-mandatos'],
            id: /^evora-(camara-lugares|camara-mandatos-|executivo-)/,
            razao:
              'Os lugares de uma câmara municipal, os mandatos que cada lista ganhou em cada eleição e a composição do executivo saído da última são resultados eleitorais. A matéria chama-se administração eleitoral, e é a mesma área que já publicava estes números.',
          },
        ],
      },
    ],
  },

  {
    slug: 'educacao-ciencia-e-inovacao',
    nome: { pt: 'Educação, Ciência e Inovação', en: 'Education, Science and Innovation' },
    nomeEnFonte: 'governo',
    artigo: 'Artigo 22.º',
    materias: [
      {
        materia: 'o sistema educativo',
        artigo: 'Artigo 22.º, n.º 1',
        citacao:
          'O Ministério da Educação, Ciência e Inovação é o departamento governamental que tem por missão formular, conduzir, executar e avaliar a política nacional relativa ao sistema educativo, e articular as políticas nacionais de qualificação e de formação profissional.',
        regras: [
          {
            id: /^abandono-escolar-precoce-\d{4}$/,
            razao:
              'A parte dos jovens que deixa a escola sem completar o secundário mede quem sai do sistema educativo antes do fim dele.',
          },
        ],
      },
      {
        materia: 'a ciência',
        artigo: 'Artigo 22.º, n.º 2',
        citacao:
          'O Ministério da Educação, Ciência e Inovação tem, ainda, por missão formular, conduzir, executar e avaliar a política nacional para a ciência e o ensino superior, compreendendo a inovação de base científica e tecnológica, o espaço, as orientações em matéria de competências digitais, a computação científica, a difusão da cultura científica e tecnológica e a cooperação científica e tecnológica internacional, nomeadamente com os países de língua oficial portuguesa.',
        regras: [
          {
            id: /^despesa-em-id-\d{4}$/,
            razao:
              'A despesa interna bruta em investigação e desenvolvimento, em percentagem do produto, é o que o País gasta a fazer ciência.',
          },
        ],
      },
      {
        materia: 'as orientações em matéria de competências digitais',
        artigo: 'Artigo 22.º, n.º 2',
        citacao:
          'O Ministério da Educação, Ciência e Inovação tem, ainda, por missão formular, conduzir, executar e avaliar a política nacional para a ciência e o ensino superior, compreendendo a inovação de base científica e tecnológica, o espaço, as orientações em matéria de competências digitais, a computação científica, a difusão da cultura científica e tecnológica e a cooperação científica e tecnológica internacional, nomeadamente com os países de língua oficial portuguesa.',
        regras: [
          {
            id: /^competencias-digitais-\d{4}$/,
            razao:
              'A parte das pessoas com competências digitais básicas ou acima delas tem por assunto as competências digitais, que este número nomeia por esse nome. O artigo 16.º, n.º 2, dá ao Ministro Adjunto e da Reforma do Estado a transição digital da economia e da sociedade, que é uma matéria vizinha; a que nomeia o assunto desta linha é esta.',
          },
        ],
      },
    ],
  },

  {
    slug: 'saude',
    nome: { pt: 'Saúde', en: 'Health' },
    nomeEnFonte: 'governo',
    artigo: 'Artigo 23.º',
    materias: [
      {
        materia: 'a política nacional de saúde',
        artigo: 'Artigo 23.º, n.º 1',
        citacao:
          'O Ministério da Saúde é o departamento governamental que tem por missão formular, conduzir, executar e avaliar a política nacional de saúde e, em especial, do Serviço Nacional de Saúde, garantindo uma aplicação e utilização sustentáveis de recursos e a avaliação dos seus resultados.',
        regras: [
          {
            id: /^necessidades-medicas-nao-satisfeitas-\d{4}$/,
            razao:
              'A parte das pessoas que declara ter precisado de cuidados médicos e não os ter tido mede o acesso aos cuidados de saúde.',
          },
        ],
      },
    ],
  },

  {
    slug: 'trabalho-solidariedade-e-seguranca-social',
    nome: {
      pt: 'Trabalho, Solidariedade e Segurança Social',
      en: 'Labour, Solidarity and Social Security',
    },
    nomeEnFonte: 'governo',
    artigo: 'Artigo 24.º',
    materias: [
      {
        materia: 'emprego',
        artigo: 'Artigo 24.º, n.º 1',
        citacao:
          'O Ministério do Trabalho, Solidariedade e Segurança Social é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de emprego, de formação profissional, de relações laborais e condições de trabalho, solidariedade e segurança social, bem como a coordenação das políticas sociais de apoio à família, crianças e jovens em risco, idosos e natalidade, de inclusão das pessoas com deficiência, de combate à pobreza e de promoção da inclusão social, de fortalecimento do setor cooperativo, da economia social e do voluntariado.',
        regras: [
          {
            estudos: ['concelhos-2026', 'evora-quinze-anos-cinco-mandatos'],
            id: /-desemprego-registado-/,
            razao:
              'As pessoas inscritas como desempregadas nos serviços de emprego de um concelho têm por assunto o emprego. Trinta destas linhas são publicadas pelas direções regionais dos Açores e da Madeira, que são dos governos regionais: pela regra antiga ficavam de fora, e pela regra da matéria não ficam, porque o desemprego de um concelho é o mesmo assunto onde quer que ele seja medido.',
          },
          {
            id: /^(taxa-de-desemprego|taxa-de-desemprego-mip|taxa-de-emprego|taxa-de-actividade|desemprego-de-longa-duracao|disparidade-de-emprego-entre-sexos|jovens-nem)-\d{4}$/,
            razao:
              'A taxa de desemprego, a de emprego, a de atividade, o desemprego de longa duração, a diferença de emprego entre homens e mulheres e os jovens que não estudam nem trabalham medem todos a situação das pessoas perante o emprego.',
          },
        ],
      },
      {
        materia: 'segurança social',
        artigo: 'Artigo 24.º, n.º 1',
        citacao:
          'O Ministério do Trabalho, Solidariedade e Segurança Social é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de emprego, de formação profissional, de relações laborais e condições de trabalho, solidariedade e segurança social, bem como a coordenação das políticas sociais de apoio à família, crianças e jovens em risco, idosos e natalidade, de inclusão das pessoas com deficiência, de combate à pobreza e de promoção da inclusão social, de fortalecimento do setor cooperativo, da economia social e do voluntariado.',
        regras: [
          {
            estudos: ['penalizacoes-por-reforma-antecipada-2026'],
            id: /^(factor-sustentabilidade-|penalizacao-antecipacao-)/,
            razao:
              'O fator de sustentabilidade e o corte que ele impõe a quem se reforma antes da idade legal são regras de cálculo das pensões. O assunto é a segurança social. O grupo de trabalho que publicou o relatório não é nomeado na lei orgânica, e pela regra antiga estas linhas ficavam sem área.',
          },
        ],
      },
      {
        materia: 'combate à pobreza e de promoção da inclusão social',
        artigo: 'Artigo 24.º, n.º 1',
        citacao:
          'O Ministério do Trabalho, Solidariedade e Segurança Social é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de emprego, de formação profissional, de relações laborais e condições de trabalho, solidariedade e segurança social, bem como a coordenação das políticas sociais de apoio à família, crianças e jovens em risco, idosos e natalidade, de inclusão das pessoas com deficiência, de combate à pobreza e de promoção da inclusão social, de fortalecimento do setor cooperativo, da economia social e do voluntariado.',
        regras: [
          {
            id: /^(risco-de-pobreza-ou-exclusao|racio-s80-s20)-\d{4}$/,
            razao:
              'A parte da população em risco de pobreza ou exclusão social é o objeto da política de combate à pobreza, e a distância entre o quinto mais rico e o quinto mais pobre é a desigualdade de rendimento que a mesma matéria tem por objeto.',
          },
        ],
      },
      {
        materia: 'apoio à família, crianças',
        artigo: 'Artigo 24.º, n.º 1',
        citacao:
          'O Ministério do Trabalho, Solidariedade e Segurança Social é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de emprego, de formação profissional, de relações laborais e condições de trabalho, solidariedade e segurança social, bem como a coordenação das políticas sociais de apoio à família, crianças e jovens em risco, idosos e natalidade, de inclusão das pessoas com deficiência, de combate à pobreza e de promoção da inclusão social, de fortalecimento do setor cooperativo, da economia social e do voluntariado.',
        regras: [
          {
            id: /^criancas-em-creche-\d{4}$/,
            razao:
              'As crianças com menos de três anos em creche são o alcance de um apoio às famílias com filhos pequenos. A creche não é do sistema educativo: a educação começa no pré-escolar.',
          },
        ],
      },
    ],
  },

  {
    slug: 'ambiente-e-energia',
    nome: { pt: 'Ambiente e Energia', en: 'Environment and Energy' },
    nomeEnFonte: 'governo',
    artigo: 'Artigo 25.º',
    materias: [
      {
        materia: 'água',
        artigo: 'Artigo 25.º, n.º 1',
        citacao:
          'O Ministério do Ambiente e Energia é o departamento governamental que tem por missão formular, conduzir, executar e avaliar as políticas de ambiente, água, resíduos, clima, proteção do litoral, conservação da natureza, biodiversidade, energia e geologia, numa perspetiva de desenvolvimento sustentável e de coesão social e territorial, bem como do ordenamento em matérias da sua competência, incluindo da orla costeira e do espaço rústico.',
        regras: [
          {
            estudos: ['agua-nao-faturada'],
            id: /^(agua-nao-faturada-|ciclo-substituicao-condutas)/,
            razao:
              'A água que entra na rede e não é faturada, e o ritmo a que as condutas se substituem, são o estado do serviço de águas. A matéria chama-se água. A ERSAR, que publica o primeiro número, não é nomeada em artigo nenhum da lei orgânica, e pela regra antiga estas linhas ficavam sem área.',
          },
        ],
      },
    ],
  },
];

/**
 * OS ASSUNTOS QUE AS MATÉRIAS DA LEI NÃO COBREM.
 *
 * Não é uma lista de coisas por fazer: é a lista das decisões que a regra
 * tomou, com a razão de cada uma, ao lado da lista que a regra construiu.
 *
 * `scripts/check-areas.mjs` confere que TODAS as linhas do livro-razão estão ou
 * numa matéria de uma área, ou aqui, e nunca nas duas. Uma linha nova que não
 * esteja em nenhuma das duas fecha a construção, que é o que faz esta lista
 * valer alguma coisa.
 *
 * A forma de uma entrada é a mesma de uma regra: `{ estudos?, id, assunto,
 * motivo }`.
 */
export const SEM_AREA = [
  {
    assunto: 'A população residente de um concelho',
    estudos: ['concelhos-2026', 'evora-economia-investidores-portas-abertas-2026'],
    id: /-populacao-\d{4}$/,
    motivo:
      'Uma contagem de pessoas não é uma política. Nenhum ministério tem «estatística» nas suas matérias: neste diploma a palavra só ocorre no nome de dois organismos, o Instituto Nacional de Estatística e a Direção-Geral de Estatísticas da Educação e Ciência. E «população» não ocorre uma única vez. O mais perto que a lei chega é o artigo 24.º, n.º 10, e o artigo 26.º, n.º 7, que dão a duas ministras, em conjunto, a superintendência de um conselho consultivo «no que diz respeito às matérias de demografia e desigualdade»: é o alcance de um poder sobre um conselho, e não uma matéria do ministério.',
  },
  {
    assunto: 'O saldo natural do País',
    id: /^saldo-natural-portugal-\d{4}$/,
    motivo:
      'Nascimentos menos óbitos é a mesma espécie de número que a população, e fica fora pela mesma razão. A lei lista a «natalidade» entre as políticas sociais que o Ministério do Trabalho coordena, e essa matéria é o apoio a quem tem filhos, e não a contagem do que a demografia fez.',
  },
  {
    assunto: 'O número de empresas de um concelho',
    estudos: ['concelhos-2026', 'evora-economia-investidores-portas-abertas-2026'],
    id: /-empresas-\d{4}$/,
    motivo:
      'Uma contagem de empresas é uma estatística do tecido empresarial, e não uma política. As matérias vizinhas do artigo 15.º, n.º 1, são «a internacionalização das empresas» e «a promoção da indústria, do comércio, dos serviços e do turismo»: nenhuma tem por objeto quantas empresas existem num concelho. O valor que elas produzem tem área, porque o assunto dele é o tamanho da economia.',
  },
  {
    assunto: 'A dívida e o crédito de quem não é o Estado',
    id: /^(divida-das-familias|divida-das-empresas|fluxo-de-credito-as-empresas|fluxo-de-credito-as-familias|credito-malparado)-\d{4}$/,
    motivo:
      'A lei orgânica não lista o sistema financeiro, a banca nem o crédito como matéria de ministério nenhum: as três palavras não ocorrem no diploma. O que o artigo 12.º, n.º 1, dá às Finanças é a política financeira DO ESTADO e a gestão dos recursos públicos, e a dívida das famílias e das empresas não é nem uma coisa nem outra.',
  },
  {
    assunto: 'As contas externas e a taxa de câmbio',
    id: /^(saldo-da-balanca-corrente|posicao-de-investimento-internacional|taxa-de-cambio-efectiva-real)-\d{4}$/,
    motivo:
      'Nem «balança», nem «cambial», nem «moeda» como matéria ocorrem no diploma. O saldo da balança corrente, a posição de investimento internacional e a taxa de câmbio efetiva real são o resultado agregado da economia com o exterior, e a lei não os põe debaixo de nenhum ministério.',
  },
  {
    assunto: 'A perceção da corrupção',
    id: /^indice-de-percepcao-da-corrupcao-\d{4}$/,
    motivo:
      'A palavra «corrupção» não ocorre uma única vez neste diploma. O artigo 20.º, n.º 1, dá ao Ministério da Justiça «a política de justiça», que tem por objeto o sistema de justiça e não a perceção de quem observa o Estado inteiro. Sem matéria que o nomeie, o índice fica fora.',
  },
  {
    assunto: 'As contagens deste arquivo sobre si próprio',
    estudos: ['o-estado-do-pais'],
    id: /^(estudos-publicados|estudos-evora-publicados|edicoes-publicadas|correcoes-publicadas|municipios-com-estudo-aprofundado|municipios-sem-estudo-aprofundado)$/,
    motivo:
      'Quantos estudos, edições e correções este sítio publicou, e a quantos concelhos já chegou, é este sítio a contar-se a si próprio. Não é matéria de governo nenhum.',
  },
];

/** Uma área pelo seu nome no endereço, tal como o ficheiro a declara. */
export function areaDeclarada(slug) {
  return AREAS.find((a) => a.slug === slug) ?? null;
}
