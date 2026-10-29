/**
 * O MÉTODO · o texto que a página diz ao leitor (bloco ME1, 15.10.2026).
 *
 * ---------------------------------------------------------------------------
 * O QUE MUDOU, E PORQUÊ
 * ---------------------------------------------------------------------------
 * Até 15.10.2026 eram dez regras, cada uma com o seu mecanismo, o seu limite e a
 * sua prova, com o desenho do mecanismo por cima delas e a política da
 * inteligência artificial perto do fim. O financiador leu a página como leitor a
 * 14.10.2026 e disse que ela explicava este projeto a si próprio, que nomeava
 * modelos onde não devia, e que o rótulo de todas as páginas levava ao meio dela
 * (o mandato `design/observatorio/mandatos/MANDATO-ME1-2026-10-15.md`). A página
 * passa a ter nove secções em palavras correntes, pela ordem do mandato: quem
 * escreve estas páginas, que é o texto da política e vive em
 * `src/data/politica-ia.mjs`; as sete deste ficheiro (`SECOES`); e a forma
 * (`FECHO`), como estava. As frases são as do mandato, palavra por palavra, e a
 * entrada do `DECISIONS.md` que as governa carimba o resumo deste ficheiro.
 *
 * NENHUM PEDAÇO DE TEXTO CORRIDO PODE TRAZER ALGARISMOS. Os números que ficam são
 * números deste projeto sobre si próprio, e entram pelos tokens da prova
 * (`{ prova: '<chave>' }`), que o `Frase` rende pelo `ValorDaProva`, com a marca
 * `data-prova` e a porta da chave; o portão de HTML reconta cada um.
 *
 * ---------------------------------------------------------------------------
 * PEDAÇOS DE TEXTO · o mesmo sistema de sempre (ver src/components/Frase.astro)
 * ---------------------------------------------------------------------------
 *   'palavras'                     texto corrido
 *   { prova: '<chave>' }           um número deste projeto, de src/lib/prova.mjs
 *   { marcador: '…', gloss: '…' }  o marcador, em chip visível
 *   { email: '…' }                 endereço de correio, como ligação
 *
 * ---------------------------------------------------------------------------
 * A FORMA DE UMA SECÇÃO
 * ---------------------------------------------------------------------------
 *   id           a âncora da secção no endereço da página; as antigas ficam
 *   titulo       o nome da secção: o `<h2>` e a entrada do sumário
 *   paragrafos   os parágrafos, cada um nas duas edições; um `id` num parágrafo
 *                é uma âncora antiga que passou a viver nele (`selo`, `construcao`)
 *   depois       o que vem a seguir aos parágrafos (`recusas`: as cinco recusas
 *                da política, de `src/data/politica-ia.mjs`)
 *   ligacoes     as portas da secção, no fim, com a seta
 */

/**
 * O endereço das correções.
 *
 * É o domínio SEM acento, de propósito. Um endereço com domínio acentuado
 * depende de o programa de quem envia o converter para punycode antes de
 * enviar, e nem todos o fazem: falha em silêncio, do lado de quem escreve, e
 * ninguém fica a saber. Num canal que existe para que nada se perca, isso é
 * inaceitável. O domínio acentuado tem o mesmo reencaminhamento configurado,
 * como rede de segurança para quem o escrever à mão; não é o que se publica.
 */
export const ENDERECO_CORRECOES = 'correcoes@oestadodopais.pt';

/**
 * A linha de abertura do Método, por baixo do título. O Sobre não a usa: a porta
 * dele para o Método diz o título da primeira secção (`POLITICA.titulo`).
 */
export const ABERTURA = {
  pt: 'Como estas páginas são feitas, conferidas e corrigidas, para quem quer saber se pode confiar num número e o que fazer se encontrar um errado.',
  en: 'How these pages are made, checked and corrected, for anyone who wants to know whether a number can be trusted and what to do on finding a wrong one.',
};

/**
 * ---------------------------------------------------------------------------
 * A ENTRADA DE FECHO · as linhas rotuladas com que a página acaba
 * ---------------------------------------------------------------------------
 * As duas frases são texto do diretor, aprovadas a 20.08.2026 (decisões g e h
 * do plano do redesenho v3, `design/especime-v3/PLANO-redesenho-v3.md` §12), e
 * entram no mesmo commit que a entrada do `DECISIONS.md` que as governa, com
 * `Afecta: metodo` e o resumo deste ficheiro. Não muda um carácter de nenhuma
 * das duas.
 *
 * «A COR» SÓ PODE SER ESCRITA DEPOIS DE A FORMA EXISTIR, e essa é a condição
 * que o diretor pôs: «aprovada tal como está redigida, com uma condição: o
 * registo de correções tem de render mesmo a forma riscada até a frase entrar».
 * O registo rende-a desde a subetapa 4a (`DECISIONS.md` §1.55): o valor antigo
 * num `<s>` em `--g1`, o novo em tinta ao lado, em quinze de quinze entradas com
 * par de valores, nas duas edições. A entrada do `DECISIONS.md` di-lo, e a
 * conferência faz-se pela porta: quem quiser ver a forma abre o registo. Uma
 * frase a dizer que a prova existe seria a prova dita em vez de dada, e a
 * direção cortou-a a 21.08.2026.
 *
 * «A LETRA» é verbatim do diretor e não reclama linhagem nenhuma (Emenda 5). É
 * verdadeira no ramo desde `7643251`, que é o commit em que os tipos passaram a
 * ser servidos daqui; os ficheiros de licença estão em `public/tipos/*∕OFL.txt`
 * e os seus resumos em `design/especime-v3/TIPOS.md`.
 *
 * A FORMA É A DE UMA REGRA, SEM O APARELHO DE UMA: um id para a âncora, um
 * título, e o texto em pedaços como todo o resto deste ficheiro. Não leva
 * mecanismo nem prova, porque não é uma regra: é o que a página fecha a dizer.
 */
export const FECHO = {
  id: 'a-forma',
  titulo: { pt: 'A forma', en: 'The form' },
  entradas: [
    {
      id: 'a-cor',
      titulo: { pt: 'A cor', en: 'Colour' },
      texto: {
        pt: [
          'A cor aparece só onde a fonte publica um valor de referência: âmbar quando o valor está fora dele, cobalto quando está dentro. Tudo o resto é tinta e cinzento, e uma correção diz-se pela forma, com o valor antigo riscado e o novo ao lado, nunca por uma cor.',
        ],
        en: [
          'Colour appears only where the source publishes a reference value: amber when the value is outside it, cobalt when it is within. Everything else is ink and grey, and a correction is said by form, with the old value struck through and the new one beside it, never by a colour.',
        ],
      },
      ligacoes: [
        { rota: 'correcoes', rotulo: { pt: 'O registo de correções', en: 'The corrections register' } },
      ],
    },
    {
      /* A ESCALA ENTRA AQUI COM O §9.2 DO F1.10 (08.09.2026).
         ---------------------------------------------------------------------
         A frase vivia por baixo da legenda do mapa por concelho da página do
         domínio, à vista e fora de qualquer dobra. A leitura cruzada do
         inventário das frases de 08.09 classificou-a como prosa de diligência da
         página do domínio («a legenda da escala a explicar as classes»), e a
         decisão do lugar de direção é que ela «sai do primeiro ecrã e vai para a
         página da linha ou para o Método». Esta não é de UMA linha: é a regra
         com que a casa desenha uma escala em qualquer mapa, e por isso o destino
         é o Método, ao pé da cor e da letra, que são as outras duas decisões de
         forma que a página fecha a dizer.

         AS PALAVRAS MUDARAM A 15.10.2026 (bloco ME1): a leitura a frio do Codex
         (o achado 11) leu a frase antiga, que falava de classes e de marcas sem
         dizer de quê, como ininteligível para um leitor de primeira vez, e o
         mandato (§3.9) dá a frase nova, que diz o mesmo em palavras correntes.
         A primeira redação nova, «as classes da escala», foi lida pela leitura
         curta do Codex do mesmo dia (o achado 7) como um termo ainda por
         explicar, e a frase diz agora «os valores onde a cor muda».
         A cadeia não se duplica: saiu de `src/i18n/strings.mjs`
         (`dominios.mapaEscalaNota`, nas duas edições) e vive aqui, que é o
         único sítio onde ela se rende. */
      id: 'a-escala',
      titulo: { pt: 'A escala', en: 'The scale' },
      texto: {
        pt: ['Nos mapas, os valores onde a cor muda são números redondos escolhidos por este projeto, e não um limite oficial.'],
        en: ['On the maps, the values where the colour changes are round numbers chosen by this project, not an official limit.'],
      },
      ligacoes: [],
    },
    {
      id: 'a-letra',
      titulo: { pt: 'A letra', en: 'The type' },
      texto: {
        pt: [
          'Os tipos deste sítio são Spectral, com a sua família de versaletes Spectral SC, e Bitter, de licença aberta (SIL Open Font License), alojados aqui e servidos por este sítio, sem anfitriões de terceiros.',
        ],
        en: [
          /* O apóstrofo é o RETO, e não o tipográfico: é o carácter que o texto
             verbatim do diretor traz (`PLANO-redesenho-v3.md` §12 e o brief da
             etapa, os dois com U+0027), e o brief diz «não muda um carácter».
             Fica assinalado na nota da etapa: se a direção quiser o tipográfico,
             é uma decisão dela e um carácter. */
          'This site\'s typefaces are Spectral, with its small-caps family Spectral SC, and Bitter, under an open licence (SIL Open Font License), hosted here and served by this site, with no third-party hosts.',
        ],
      },
      ligacoes: [],
    },
  ],
};

/** O marcador, citado na secção do que está por confirmar. */
export const MARCADORES = {
  mencaoVerificar: {
    marcador: 'a verificar',
    gloss: 'to verify',
  },
};

const M = MARCADORES;

/** As secções 2 a 8, pela ordem da página; a primeira é a da política e a nona é o `FECHO`. */
export const SECOES = [
  {
    id: 'fontes',
    titulo: { pt: 'De onde vêm os números', en: 'Where the numbers come from' },
    paragrafos: [
      {
        pt: [
          'Os números destas páginas vêm de fontes oficiais e de autoridades reconhecidas: os institutos de estatística, os reguladores, os tribunais, os ministérios, as câmaras municipais, as universidades e os institutos independentes de interesse público. Cada valor é lido no documento onde a fonte o publicou, e não em quem o cita; as entradas em que isso ainda não aconteceu contam-se abaixo, entre as que estão por confirmar. Quando este projeto calcula um número, o recibo mostra a conta e os valores de onde ele vem.',
        ],
        en: [
          'The numbers on these pages come from official sources and recognised authorities: the statistics institutes, regulators, courts, ministries, municipal councils, universities and independent public-interest institutes. Each value is read in the document where the source published it, not in whoever quotes it; the entries where that has not yet happened are counted below, among those still to be confirmed. When this project calculates a number, the receipt shows the arithmetic and the values it comes from.',
        ],
      },
      {
        pt: [
          'A imprensa não é fonte de nenhum número, e um observatório que compila dados oficiais é onde um número se encontra, não onde se cita. O que uma pessoa ou um partido afirmou em público entra de outra maneira: como foi dito, no documento onde foi dito, com quem o disse, ao lado do que as fontes oficiais mostram sobre a mesma medida, no mesmo período e para a mesma população.',
        ],
        en: [
          'The press is not a source for any number, and an observatory that compiles official data is where a number is found, not where it is quoted from. What a person or a party stated in public enters in another way: as it was said, in the document where it was said, with who said it, beside what the official sources show for the same measure, in the same period and for the same population.',
        ],
      },
    ],
    ligacoes: [
      { rota: 'livro', rotulo: { pt: 'Ver o livro-razão', en: 'See the ledger' } },
    ],
  },
  {
    id: 'livro-razao',
    titulo: { pt: 'O recibo de cada número', en: 'The receipt for each number' },
    paragrafos: [
      {
        pt: [
          'Todos os números publicados estão numa só lista, a que este projeto chama livro-razão: uma entrada por medição, com o organismo que a publicou, o documento, a página, o excerto exato, a data em que foi lida e, quando o número é calculado, a conta e os números de onde vem. A lista é pública, entrada a entrada, nas duas edições.',
        ],
        en: [
          'Every published number is in a single list, which this project calls the ledger: one entry per measurement, with the body that published it, the document, the page, the exact excerpt, the date it was read and, when the number is calculated, the arithmetic and the numbers it comes from. The list is public, entry by entry, in both editions.',
        ],
      },
      {
        id: 'selo',
        pt: [
          'Ao lado de cada medição há um selo que abre a sua entrada, o recibo do número: cheio quando a origem está completa, a tracejado quando falta um campo.',
        ],
        en: [
          "Beside every measurement there is a seal that opens its entry, the number's receipt: filled when the origin is complete, dashed when a field is missing.",
        ],
      },
      {
        pt: [
          'Hoje a lista tem ',
          { prova: 'afirmacoes' },
          ' entradas; ',
          { prova: 'indexaveis' },
          ' têm a origem completa e ',
          { prova: 'divida' },
          ' esperam a confirmação de um campo na fonte.',
        ],
        en: [
          'Today the list has ',
          { prova: 'afirmacoes' },
          ' entries; ',
          { prova: 'indexaveis' },
          ' have their origin complete and ',
          { prova: 'divida' },
          ' await the confirmation of a field at the source.',
        ],
      },
      {
        pt: [
          'O recibo inclui um código para mostrar o número noutra página, com a fonte, a data em que foi lido e a ligação para o recibo; esse código acompanha as atualizações do número neste projeto. Este projeto não guarda nenhum registo de quem incorpora um número. A licença é a do conjunto de dados, Creative Commons de atribuição.',
        ],
        en: [
          "The receipt includes code to show the number on another page, with its source, the date it was read and the link to the receipt; that code follows the updates of the number in this project. This project keeps no record of who embeds a number. The licence is the dataset's, Creative Commons attribution.",
        ],
      },
    ],
    ligacoes: [
      { rota: 'livro', rotulo: { pt: 'Ver o livro-razão', en: 'See the ledger' } },
      { rota: 'linha', params: { slug: 'divida-publica-2025' }, rotulo: { pt: 'Ver um recibo de exemplo', en: 'See an example receipt' } },
    ],
  },
  {
    id: 'releitura',
    titulo: { pt: 'Como se confere', en: 'How it is checked' },
    paragrafos: [
      {
        id: 'construcao',
        pt: [
          'Estas páginas são geradas a partir dessa lista. De cada vez que são construídas, um programa lê o texto de todas elas: cada algarismo tem de ter uma origem declarada, uma entrada da lista ou uma das razões escritas numa lista fechada, como um número de ordem ou a data da própria página; um algarismo sem origem trava a publicação, e um valor diferente do da sua entrada, também. O que esse programa não vê: um número escrito por extenso, um número no código que a página carrega, ou um número guardado fora do texto que se lê, passam. A revisão junta estas verificações a leituras por amostra; nenhuma página é lida uma a uma antes de sair.',
        ],
        en: [
          "These pages are generated from that list. Every time they are built, a program reads the text of all of them: every digit must have a declared origin, an entry in the list or one of the reasons written on a closed list, such as an ordinal or the page's own date; a digit without an origin stops publication, and so does a value that differs from its entry. What that program does not see: a number written out in words, a number in the code the page loads, or a number stored outside the text one reads, all pass. Review combines these checks with sample readings; no page is read one by one before it goes out.",
        ],
      },
      {
        pt: [
          'Antes de uma mudança chegar a estas páginas, as mesmas verificações recusam, entre outras coisas, uma frase copiada de uma fonte que não seja igual à da fonte, um nome ou uma definição que a fonte não dá a essa medida, uma citação de uma pessoa ou de um partido, nas afirmações do item do Orçamento de ',
          { ref: '2027' },
          ', sem a passagem da fonte que nomeia quem fala selada ao lado dela, e qualquer dado pessoal, segredo ou caminho de uma máquina. As frases que este projeto escreve sobre si e sobre os números estão num inventário, e nas páginas que ele cobre, que são quase todas, uma frase nova que não esteja lá trava a publicação; o texto desta página e o da página «Sobre» só mudam com uma decisão registada que carimbe a versão nova. E cada trabalho novo, uma página, uma regra, um texto, é lido antes de se publicar por um sistema de outra família, com cinco erros plantados de propósito que tem de encontrar todos; o que ele encontra que mude um número ou uma frase corrige-se antes de publicar, e os reparos pequenos juntam-se numa passagem semanal.',
        ],
        en: [
          "Before a change reaches these pages, the same checks refuse, among other things, a sentence copied from a source that is not identical to the source's, a name or a definition the source does not give to that measure, a quotation from a person or a party, in the statements of the ",
          { ref: '2027' },
          " Budget item, without the source passage that names the speaker sealed next to it, and any personal data, secret or machine path. The sentences this project writes about itself and about the numbers are kept in an inventory, and on the pages it covers, which are nearly all of them, a new sentence that is not in it stops publication; the text of this page and of the «About» page changes only with a recorded decision that stamps the new version. And every new piece of work, a page, a rule, a text, is read before publication by a system from another family, with five errors planted on purpose that it must find, all of them; whatever it finds that changes a number or a sentence is corrected before publishing, and the small repairs are gathered into a weekly pass.",
        ],
      },
      {
        pt: [
          'Estas verificações provam que o que a página mostra é o que a lista guarda; a releitura na fonte prova que a lista diz o que a fonte imprimiu; nenhuma prova que a fonte esteja certa, nem que as conclusões deste projeto o estejam. Cada recibo diz se o seu número já foi relido na fonte por um caminho diferente e por um sistema que não o publicou, em que data e com que resultado. O painel europeu, na página «Portugal na União Europeia», é reconferido contra a fonte todas as semanas, e essa página diz quando foi a última vez.',
        ],
        en: [
          "These checks prove that what the page shows is what the list holds; the re-reading at the source proves that the list says what the source printed; neither proves that the source is right, nor that this project's conclusions are. Each receipt says whether its number has been read again at the source by a different route and by a system that did not publish it, on what date and with what result. The European panel, on the page «Portugal in the European Union», is re-checked against the source every week, and that page says when the last time was.",
        ],
      },
      {
        pt: [
          'Hoje ',
          { prova: 'linhas_reconferidas' },
          ' entradas têm pelo menos uma reconferência escrita, em ',
          { prova: 'releituras_registadas' },
          ' reconferências; em ',
          { prova: 'releituras_divergentes' },
          ' a fonte dizia outra coisa. Quando a fonte diz outra coisa, o valor novo não entra sozinho: espera a decisão da direção e, quando entra, fica no registo das correções com o valor anterior à vista. A última reconferência do painel europeu foi a ',
          { prova: 'painel_reconferido_em' },
          '.',
        ],
        en: [
          'Today ',
          { prova: 'linhas_reconferidas' },
          ' entries have at least one re-check written, in ',
          { prova: 'releituras_registadas' },
          ' re-checks; in ',
          { prova: 'releituras_divergentes' },
          " the source said something else. When the source says something else, the new value does not enter on its own: it waits for direction's decision and, when it enters, it goes into the corrections register with the previous value in plain sight. The European panel was last re-checked on ",
          { prova: 'painel_reconferido_em' },
          '.',
        ],
      },
    ],
    /* A PORTA DA PROVA é o ficheiro que o portão de HTML escreve no fim de um varrimento limpo. O endereço vem
       de `src/lib/prova.mjs` e não se escreve aqui: este ficheiro não pode importar de lá (a prova importa daqui
       o endereço das correções), e por isso a vista resolve a marca. */
    ligacoes: [
      { prova: true, rotulo: { pt: 'Os resultados das verificações desta construção', en: "The results of this build's checks" } },
      { rota: 'uniaoEuropeia', rotulo: { pt: 'Portugal na União Europeia', en: 'Portugal in the European Union' } },
    ],
  },
  {
    id: 'por-confirmar',
    titulo: { pt: 'O que está por confirmar', en: 'What is still to be confirmed' },
    paragrafos: [
      {
        pt: [
          'Quando um campo da origem de um número não pôde ser confirmado na fonte, o recibo diz o que falta e marca esse campo com ',
          M.mencaoVerificar,
          '; a página do número não o esconde, e a entrada fica fora dos motores de busca até estar completa. Quando a fonte marca um valor como provisório, a página di-lo por palavras. Quando a fonte já publicou um período mais recente do que o que estas páginas mostram, a página do número di-lo também.',
        ],
        en: [
          "When a field in a number's origin could not be confirmed at the source, the receipt says what is missing and marks that field with ",
          M.mencaoVerificar,
          "; the number's page does not hide it, and the entry stays out of search engines until it is complete. When the source marks a value as provisional, the page says so in words. When the source has already published a more recent period than the one these pages show, the number's page says so too.",
        ],
      },
    ],
    ligacoes: [
      { rota: 'marcador', rotulo: { pt: 'O que quer dizer este marcador', en: 'What this marker means' } },
    ],
  },
  {
    id: 'correcoes',
    titulo: { pt: 'As correções', en: 'Corrections' },
    paragrafos: [
      {
        pt: [
          'O registo público das correções distingue três tipos de alteração: a correção, quando um valor estava errado; a atualização, quando um valor estava certo e ficou desatualizado; a revisão de proveniência, quando o valor se mantém e muda a documentação da sua origem. Cada alteração é datada e permanente, com o valor anterior à vista. Até hoje: ',
          { prova: 'correcoes' },
          ' correções, ',
          { prova: 'atualizacoes' },
          ' atualizações e ',
          { prova: 'revisoes_de_proveniencia' },
          ' revisões de proveniência.',
        ],
        en: [
          'The public register of corrections distinguishes three types of change: a correction, when a value was wrong; an update, when a value was right and became outdated; a provenance revision, when the value stays the same and the documentation of its origin changes. Each change is dated and permanent, with the previous value in plain sight. So far: ',
          { prova: 'correcoes' },
          ' corrections, ',
          { prova: 'atualizacoes' },
          ' updates and ',
          { prova: 'revisoes_de_proveniencia' },
          ' provenance revisions.',
        ],
      },
      {
        pt: [
          'Quem encontrar um erro escreve para ',
          { email: ENDERECO_CORRECOES },
          '; há em todas as páginas uma ligação para o fazer. Quem for nomeado numa página pode responder para o mesmo endereço, e a resposta publica-se ao lado do texto em causa, sem edição.',
        ],
        en: [
          'Anyone who finds an error writes to ',
          { email: ENDERECO_CORRECOES },
          '; every page has a link for doing so. Anyone named on a page may reply to the same address, and the reply is published alongside the text in question, unedited.',
        ],
      },
    ],
    ligacoes: [
      { rota: 'correcoes', rotulo: { pt: 'O registo inteiro', en: 'The whole register' } },
    ],
  },
  {
    id: 'agenda',
    titulo: { pt: 'O que se mede, e quem decide', en: 'What gets measured, and who decides' },
    paragrafos: [
      {
        pt: [
          'O que se mede a seguir decide-se por critérios declarados: os problemas que as instituições identificam ao avaliar Portugal, o que as fontes oficiais vão publicar, o que os leitores perguntam ou corrigem. A direção decide, e a agenda mostra, item a item, o critério, quem propôs, quem decidiu e cada mudança de estado com a sua data. A pergunta de um estudo fixa-se e guarda-se antes de se recolherem os dados.',
        ],
        en: [
          'What gets measured next is decided by declared criteria: the problems institutions identify when assessing Portugal, what the official sources will publish, what readers ask about or correct. Direction decides, and the agenda shows, item by item, the criterion, who proposed, who decided and every change of state with its date. The question of a study is fixed and stored before the data are collected.',
        ],
      },
      {
        pt: [
          'Os estudos de Évora abrem com a pergunta a que respondem e com a leitura deste projeto: o que os números mostram, o que este projeto conclui e o que podia funcionar melhor. Os estudos mais antigos têm o texto e as fontes, sem essa abertura.',
        ],
        en: [
          "The Évora studies open with the question they answer and with this project's reading: what the numbers show, what this project concludes and what could work better; one of them has that opening in the Portuguese edition only. The older studies have the text and the sources, without that opening.",
        ],
      },
    ],
    ligacoes: [
      { rota: 'agenda', rotulo: { pt: 'A agenda', en: 'The agenda' } },
      { rota: 'estudos', rotulo: { pt: 'Os estudos', en: 'The studies' } },
    ],
  },
  {
    id: 'o-que-nao-faz',
    titulo: { pt: 'O que este projeto não faz', en: 'What this project does not do' },
    paragrafos: [
      {
        pt: [
          'Não classifica partidos nem faz médias por partido: regista quem decidiu o quê e o que aconteceu, com o nome tal como consta do documento e o rótulo partidário como facto de registo. Não corrige em silêncio. É financiado em privado, sem publicidade nem dinheiro de instituições.',
        ],
        en: [
          'It does not rank or classify parties and does not average by party: it records who decided what and what happened, with the name as the document gives it and the party label as a fact of record. It does not correct in silence. It is privately funded, with no advertising and no money from institutions.',
        ],
      },
    ],
    /* As cinco recusas vêm depois do parágrafo, palavra por palavra, de `POLITICA.recusas` em
       `src/data/politica-ia.mjs`: são a política, e a política diz-se onde está escrita. */
    depois: 'recusas',
    ligacoes: [
      { rota: 'privacidade', rotulo: { pt: 'Privacidade', en: 'Privacy' } },
    ],
  },
];
