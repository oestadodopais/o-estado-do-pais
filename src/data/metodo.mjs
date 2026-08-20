/**
 * O Método: dez regras, cada uma com o seu mecanismo, a sua prova de hoje e,
 * onde é preciso, o seu limite honesto.
 *
 * ---------------------------------------------------------------------------
 * O QUE MUDOU, E PORQUÊ
 * ---------------------------------------------------------------------------
 * O texto anterior eram seis secções de prosa, cópia final da direção de
 * 2026-08-12, com quatro marcadores por resolver lá dentro. Descrevia o
 * método; não o provava. As dez regras abaixo foram propostas à direção a
 * 2026-08-15 e substituem-no: a regra diz o que se faz, o mecanismo diz o que
 * a impõe e onde isso se confere, e a prova traz os números de hoje, calculados
 * na construção a partir dos dados do próprio sítio (`src/lib/prova.mjs`).
 * Nada aqui é um número escrito à mão. Ver `DECISIONS.md` §1.13 e §1.39.
 *
 * Os quatro marcadores saíram por estarem resolvidos: o nome de quem dirige
 * (regra 9), o endereço das correções (regra 7, vivo desde §1.26), o modelo de
 * financiamento (regra 10) e a contagem das autárquicas, cuja frase saiu por
 * inteiro. Um facto que não está verificado não se escreve com outras palavras:
 * cai.
 *
 * ---------------------------------------------------------------------------
 * PEDAÇOS DE TEXTO — o mesmo sistema de sempre (ver src/components/Frase.astro)
 * ---------------------------------------------------------------------------
 *   'palavras'                     texto corrido
 *   { forte: '…' }                 negrito
 *   { marcador: '…', gloss: '…' }  o marcador da casa, em chip visível
 *   { email: '…' }                 endereço de correio, como ligação
 *   { ref: '…' }                   ano ou período de referência
 *
 * NENHUM PEDAÇO DE TEXTO CORRIDO PODE TRAZER ALGARISMOS. É o que obriga a que
 * todo o número desta página venha da prova, com a sua chave e a sua porta.
 *
 * ---------------------------------------------------------------------------
 * A FORMA DE UMA REGRA
 * ---------------------------------------------------------------------------
 *   n            o número da regra (rótulo; escrito por extenso no gabarito)
 *   id           a âncora da regra no endereço da página
 *   titulo       o nome da regra
 *   regra        o que se faz
 *   mecanismo    o que a impõe, e onde isso se confere
 *   limite       o que o mecanismo NÃO apanha (só onde existe)
 *   prova        as chaves de src/lib/prova.mjs a mostrar, com o seu rótulo
 *   provaNota    o estado por palavras, quando não há número (ou não há ainda)
 *   ligacoes     as portas desta regra
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
 * A linha de abertura do Método, e o rótulo da porta que o Sobre lhe abre.
 * Uma origem só: se mudar aqui, muda nos dois sítios.
 */
export const ABERTURA = {
  pt: 'Como se procura a independência e o rigor',
  en: 'How independence and rigour are pursued',
};

/** A leitura breve do instrumento: uma frase, e mais nada (IDENTIDADE §4). */
export const LEITURA_BREVE = {
  pt: 'Uma medição chega ao leitor só se tem linha, e a linha diz de onde veio.',
  en: 'A measurement reaches the reader only if it has a row, and the row says where it came from.',
};

/** O marcador da casa, citado dentro da regra 5. */
export const MARCADORES = {
  mencaoVerificar: {
    marcador: 'a verificar',
    gloss: 'to verify',
  },
};

const M = MARCADORES;

export const REGRAS = [
  {
    n: 1,
    id: 'fontes',
    titulo: { pt: 'As fontes', en: 'The sources' },
    regra: {
      pt: [
        'Só fontes oficiais e autoridades reconhecidas: institutos de estatística, reguladores, tribunais, ministérios, câmaras, universidades e institutos independentes de interesse público, cada uma identificada pelo tipo. Imprensa e agregadores comerciais não são fontes.',
      ],
      en: [
        'Official sources and recognised authorities only: statistical institutes, regulators, courts, ministries, municipal councils, universities and independent institutes of public interest, each identified by its type. Press and commercial aggregators are not sources.',
      ],
    },
    mecanismo: {
      pt: [
        'Cada linha do livro-razão nomeia o organismo que produziu o valor e o documento onde ele está impresso. Esta regra não é imposta por uma máquina: é imposta por estar à vista, linha a linha, no livro-razão público.',
      ],
      en: [
        'Every ledger row names the body that produced the value and the document it is printed in. This rule is not enforced by a machine: it is enforced by being in plain sight, row by row, in the public ledger.',
      ],
    },
    limite: {
      pt: [
        'Nem todas as linhas têm já a proveniência completa: a que não tem leva o marcador no campo que falta, e a conta ao lado diz quantas são.',
      ],
      en: [
        'Not every row has its provenance complete yet: one that does not carries the marker in the missing field, and the count beside says how many there are.',
      ],
    },
    prova: [
      { chave: 'fontes', rotulo: { pt: 'organismos citados', en: 'bodies cited' } },
      {
        chave: 'tipos_de_documento',
        rotulo: {
          pt: 'linhas com o tipo de documento declarado',
          en: 'rows with the document kind declared',
        },
      },
      {
        chave: 'divida',
        rotulo: {
          pt: 'linhas com dívida de proveniência',
          en: 'rows with provenance debt',
        },
      },
    ],
    ligacoes: [{ rota: 'livro', rotulo: { pt: 'Ver o livro-razão', en: 'See the ledger' } }],
  },

  {
    n: 2,
    id: 'motor',
    titulo: { pt: 'O motor', en: 'The engine' },
    regra: {
      pt: [
        'A investigação corre num motor separado do sítio. É lá que se procura, lê, extrai, calcula e verifica. Cada número sai de lá com a sua origem: o organismo, o documento, a página, o excerto exato, a data da leitura e, quando é calculado, a conta e os números de onde vem.',
      ],
      en: [
        'The research runs in an engine separate from the site. That is where things are searched for, read, extracted, calculated and checked. Every figure leaves it with its origin: the body, the document, the page, the exact excerpt, the date it was read and, when it is calculated, the arithmetic and the figures it comes from.',
      ],
    },
    mecanismo: {
      pt: [
        'O sítio não sabe procurar nem calcular: só sabe ler o livro-razão. O que atravessa é conferido à chegada contra o resumo criptográfico de cada linha de origem, e uma linha alterada deste lado faz parar a construção.',
      ],
      en: [
        'The site cannot search and cannot calculate: it can only read the ledger. What crosses is checked on arrival against the cryptographic digest of each origin row, and a row edited on this side stops the build.',
      ],
    },
    prova: [
      {
        chave: 'linhas_cruzadas',
        rotulo: {
          pt: 'linhas atravessadas do motor com registo',
          en: 'rows crossed from the engine with a record',
        },
      },
      /* A honestidade que faltava a esta regra. O tubo é de 2026-08-15; as
         linhas escritas antes dele vieram da mesma investigação e não têm
         registo de travessia, porque não havia registo de travessia. Dizer
         «linhas vindas do motor: 70» ao lado de «linhas publicadas: 132»
         deixava o leitor a concluir que as outras vieram de outro lado.
         Vieram do mesmo sítio; o que lhes falta é o registo. */
      {
        chave: 'linhas_anteriores_ao_tubo',
        rotulo: {
          pt: 'linhas registadas antes de existir travessia',
          en: 'rows recorded before any crossing existed',
        },
      },
      {
        chave: 'leituras',
        rotulo: {
          pt: 'trabalhos com leitura do observatório',
          en: 'works with an observatory reading',
        },
      },
    ],
    ligacoes: [{ rota: 'estudos', rotulo: { pt: 'Ver o arquivo', en: 'See the archive' } }],
  },

  {
    n: 3,
    id: 'livro-razao',
    titulo: { pt: 'O livro-razão', en: 'The ledger' },
    regra: {
      pt: ['Uma linha por medição, com essa origem. O livro-razão é público, linha a linha.'],
      en: ['One row per measurement, with that origin. The ledger is public, row by row.'],
    },
    mecanismo: {
      pt: [
        'Cada linha tem endereço próprio e página própria, nas duas edições, e o índice de todas é o livro-razão. A construção falha se uma linha ficar sem página: um selo que aponte para o vazio é uma porta que não abre.',
      ],
      en: [
        'Every row has its own address and its own page, in both editions, and the index of them all is the ledger. The build fails if a row is left without a page: a seal pointing at nothing is a door that does not open.',
      ],
    },
    prova: [
      { chave: 'afirmacoes', rotulo: { pt: 'linhas publicadas', en: 'rows published' } },
      {
        chave: 'indexaveis',
        rotulo: { pt: 'com proveniência completa', en: 'with complete provenance' },
      },
    ],
    ligacoes: [{ rota: 'livro', rotulo: { pt: 'Ver o livro-razão', en: 'See the ledger' } }],
  },

  {
    n: 4,
    id: 'construcao',
    titulo: { pt: 'A construção', en: 'The build' },
    regra: {
      pt: [
        'O sítio é gerado a partir do livro-razão. Um número escrito numa página sem linha própria faz parar a construção; um valor na página diferente do da linha, também. Cada excerto é comparado, carácter a carácter, com o que a linha guarda.',
      ],
      en: [
        'The site is generated from the ledger. A figure written into a page with no row of its own stops the build; so does a value on the page that differs from the value in the row. Every excerpt is compared, character for character, with what the row holds.',
      ],
    },
    mecanismo: {
      pt: [
        'Depois de construído, um varrimento lê todas as páginas e fecha a construção em qualquer algarismo sem origem declarada. Cada origem legítima está escrita numa lista fechada, e nenhuma é uma dispensa: todas comparam o que a página rende com aquilo que ela diz ser.',
      ],
      en: [
        'Once built, a sweep reads every page and closes the build on any digit without a declared origin. Every legitimate origin is written on a closed list, and none of them is a waiver: each compares what the page renders with what it claims to be.',
      ],
    },
    limite: {
      pt: [
        'O varrimento vê texto. Um número dentro de um script, um número escrito por extenso ou um número dentro de um atributo passam. E um motivo estrutural declarado é confiança de quem escreve o gabarito: confere-se que o motivo consta da lista fechada, não que o número seja mesmo estrutura.',
      ],
      en: [
        'The sweep sees text. A figure inside a script, a figure written out in words or a figure inside an attribute all pass. And a declared structural reason is trust in whoever writes the template: what is checked is that the reason is on the closed list, not that the figure is really structure.',
      ],
    },
    prova: [
      { chave: 'derivadas', rotulo: { pt: 'linhas calculadas', en: 'rows calculated' } },
      {
        chave: 'aritmetica_reavaliada',
        rotulo: {
          pt: 'contas refeitas nesta construção',
          en: 'arithmetic re-evaluated in this build',
        },
      },
    ],
    ligacoes: [
      {
        /* O ficheiro que o portão escreve no fim de um varrimento limpo. O
           endereço vem de `src/lib/prova.mjs`, não escrito aqui: este ficheiro
           não pode importar de lá (a prova importa daqui o endereço das
           correções), por isso o gabarito resolve a marca. */
        prova: true,
        rotulo: { pt: 'A prova desta construção', en: 'The proof of this build' },
      },
    ],
  },

  {
    n: 5,
    id: 'selo',
    titulo: { pt: 'O selo', en: 'The seal' },
    regra: {
      pt: [
        'Ao lado de cada medição há um selo que abre a sua linha: cheio quando a origem está completa, a tracejado quando falta um campo. Um campo em falta escreve-se ',
        M.mencaoVerificar,
        '; a linha diz o que lhe falta e fica fora dos motores de busca até estar completa. Um valor que a fonte marca como provisório é dito por palavras.',
      ],
      en: [
        'Beside every measurement there is a seal that opens its row: filled when the origin is complete, dashed when a field is missing. A missing field is written ',
        M.mencaoVerificar,
        '; the row says what it lacks and stays out of search engines until it is complete. A value the source marks as provisional is said in words.',
      ],
    },
    mecanismo: {
      pt: [
        'A construção confere que cada valor tem, ao pé de si, o selo que abre a sua própria linha, e não a de outra. Uma linha incompleta sai sozinha do índice dos motores de busca e do mapa do sítio, e volta sozinha no dia em que o campo for preenchido.',
      ],
      en: [
        'The build checks that every value has, beside it, the seal that opens its own row and not another. An incomplete row leaves the search index and the sitemap on its own, and returns on its own the day the field is filled in.',
      ],
    },
    limite: {
      pt: [
        'O selo prova que o número da página é o da linha, e que a linha diz de onde veio. Não prova que a fonte diga o que a linha guarda: isso é a releitura, e é trabalho de quem não escreveu a linha.',
      ],
      en: [
        'The seal proves that the figure on the page is the figure in the row, and that the row says where it came from. It does not prove that the source says what the row holds: that is the re-reading, and it is the work of someone who did not write the row.',
      ],
    },
    prova: [
      {
        chave: 'divida',
        rotulo: { pt: 'linhas com um campo por confirmar', en: 'rows with a field to confirm' },
      },
    ],
    ligacoes: [
      { rota: 'marcador', rotulo: { pt: 'O que quer dizer este marcador', en: 'What this marker means' } },
    ],
  },

  {
    n: 6,
    id: 'releitura',
    titulo: { pt: 'A releitura', en: 'The re-reading' },
    regra: {
      pt: [
        'Os números publicados são relidos na fonte por um caminho diferente e por quem não os escreveu, linha a linha, e cada linha diz se já o foi, quando e com que resultado. O painel da primeira página é reconferido contra a fonte todas as semanas, e a página diz quando foi a última vez.',
      ],
      en: [
        'Published figures are read again at the source by a different route and by someone who did not write them, row by row, and each row says whether it has been yet, when and with what result. The panel on the front page is re-checked against the source every week, and the page says when the last time was.',
      ],
    },
    mecanismo: {
      pt: [
        'A data da última reconferência é escrita pelo motor a cada verificação, e o cabeçalho de todas as páginas mostra-a. Quando passa do prazo, o cabeçalho di-lo por palavras, em vez de mostrar uma data que parece fresca.',
      ],
      en: [
        'The date of the last re-check is written by the engine at each verification, and the masthead of every page shows it. Once it is overdue, the masthead says so in words, instead of showing a date that looks fresh.',
      ],
    },
    limite: {
      pt: [
        'A releitura de uma linha fica escrita nela: a data, o caminho, o resultado e quem a fez. O que ainda não existe é a releitura de todas as linhas: as contas ao lado dizem quantas a têm, e quantas leram um valor diferente.',
      ],
      en: [
        'The re-reading of a row is written into the row itself: the date, the path, the result and who did it. What does not yet exist is a re-reading of every row: the counts beside say how many have one, and how many read a different value.',
      ],
    },
    prova: [
      {
        chave: 'releituras_registadas',
        rotulo: {
          pt: 'releituras independentes registadas',
          en: 'independent re-readings on record',
        },
      },
      {
        chave: 'linhas_reconferidas',
        rotulo: {
          pt: 'linhas com reconferência escrita',
          en: 'rows with a re-check written',
        },
      },
      {
        chave: 'releituras_divergentes',
        rotulo: {
          pt: 'releituras que leram outro valor',
          en: 're-readings that read a different value',
        },
      },
      {
        chave: 'painel_reconferido_em',
        rotulo: { pt: 'painel reconferido a', en: 'panel re-checked on' },
      },
    ],
    ligacoes: [],
  },

  {
    n: 7,
    id: 'correcoes',
    titulo: { pt: 'As correções', en: 'The corrections' },
    regra: {
      pt: [
        'Públicas, datadas e permanentes, com o valor anterior à vista, em três naturezas: correção (o valor estava errado), atualização (o valor estava certo e o mundo mudou), revisão de proveniência (o valor não mudou; mudou o caminho até à fonte).',
      ],
      en: [
        'Public, dated and permanent, with the previous value in plain sight, in three kinds: correction (the value was wrong), update (the value was right and the world changed), provenance revision (the value did not change; the route to the source did).',
      ],
    },
    mecanismo: {
      pt: [
        'Cada entrada é um campo da própria linha, e a construção confere data, natureza, valor antigo, valor novo e motivo contra o livro-razão: reescrever a história de uma correção faz parar a construção. Quem encontrar um erro escreve para ',
        { email: ENDERECO_CORRECOES },
        ', e a porta para o fazer está em todas as páginas.',
      ],
      en: [
        'Every entry is a field of the row itself, and the build checks date, kind, old value, new value and reason against the ledger: rewriting the history of a correction stops the build. Anyone who finds an error writes to ',
        { email: ENDERECO_CORRECOES },
        ', and the door to do it is on every page.',
      ],
    },
    prova: [
      { chave: 'correcoes', rotulo: { pt: 'correções', en: 'corrections' } },
      { chave: 'atualizacoes', rotulo: { pt: 'atualizações', en: 'updates' } },
      {
        chave: 'revisoes_de_proveniencia',
        rotulo: { pt: 'revisões de proveniência', en: 'provenance revisions' },
      },
    ],
    ligacoes: [
      { rota: 'correcoes', rotulo: { pt: 'O registo inteiro', en: 'The whole register' } },
    ],
  },

  {
    n: 8,
    id: 'agenda',
    titulo: { pt: 'O que se mede a seguir', en: 'What gets measured next' },
    regra: {
      pt: [
        'A inteligência artificial propõe o que medir, a partir de critérios declarados: o que os quadros com que as instituições avaliam Portugal apontam como problema, o que as fontes oficiais vão publicar, o que os leitores perguntam ou corrigem. A direção decide. A lista do que está em curso, do que se segue e do porquê é pública, e nada sai dela em silêncio.',
      ],
      en: [
        'Artificial intelligence proposes what to measure, from declared criteria: what the frameworks the institutions use to assess Portugal flag as a problem, what the official sources will publish, what readers ask about or correct. The director decides. The list of what is under way, what comes next and why is public, and nothing leaves it in silence.',
      ],
    },
    /* O mecanismo lido contra a página construída, a 16.08.2026: a página existe
       e faz isto, nem mais nem menos. Onde um item não tem critério, ou não tem
       ainda decisão da direção, a página diz a ausência por palavras em vez de
       a esconder, e a frase abaixo diz isso porque é o que lá está. */
    mecanismo: {
      pt: [
        'A pergunta de um trabalho é fixada e guardada no motor antes da recolha, e a agenda mostra, item a item, o critério que o pôs lá, quem o propôs, quem o decidiu, e cada mudança de estado com a sua data e o seu motivo. Onde não há critério, ou onde não há ainda decisão da direção, a página di-lo.',
      ],
      en: [
        'The question of a piece of work is fixed and stored in the engine before collection begins, and the agenda shows, item by item, the criterion that put it there, who proposed it, who decided it, and every change of state with its date and its reason. Where there is no criterion, or no director decision yet, the page says so.',
      ],
    },
    /* A prova desta regra são as contagens da agenda, e mais nada. A contagem
       dos concelhos com página saiu daqui a 16.08.2026: é cobertura, e a regra 8
       não é sobre cobertura. A chave continua na prova e vive onde conta, no
       mapa e em `/municipios`. Cada uma destas quatro é uma porta para a agenda,
       que é a página onde o leitor vê o que elas contam. */
    prova: [
      {
        chave: 'agenda_em_curso',
        rotulo: { pt: 'em curso', en: 'under way' },
        vazio: { pt: 'sem registo nesta construção', en: 'no record in this build' },
      },
      {
        chave: 'agenda_a_seguir',
        rotulo: { pt: 'a seguir', en: 'next' },
        vazio: { pt: 'sem registo', en: 'no record' },
      },
      {
        chave: 'agenda_concluido',
        rotulo: { pt: 'concluídos', en: 'concluded' },
        vazio: { pt: 'sem registo', en: 'no record' },
      },
      {
        chave: 'agenda_retirado',
        rotulo: { pt: 'retirados', en: 'withdrawn' },
        vazio: { pt: 'sem registo', en: 'no record' },
      },
    ],
    ligacoes: [
      { rota: 'agenda', rotulo: { pt: 'A agenda inteira', en: 'The whole agenda' } },
    ],
  },

  {
    n: 9,
    id: 'intervencao-humana',
    titulo: { pt: 'A intervenção humana', en: 'Human intervention' },
    regra: {
      pt: [
        'A direção é de ',
        { forte: 'Nuno dos Santos' },
        ', que escolhe o que se publica e responde por ele; não escreve números. A autoria por inteligência artificial está declarada no Sobre, e todas as páginas construídas levam a porta para lá.',
      ],
      en: [
        'It is directed by ',
        { forte: 'Nuno dos Santos' },
        ', who chooses what gets published and answers for it; he does not write figures. Authorship by artificial intelligence is stated on the About page, and every page built carries the door to it.',
      ],
    },
    mecanismo: {
      pt: [
        'Um número não entra por uma pessoa nem por um gabarito: entra por uma linha do livro-razão, e por mais lado nenhum. E a construção conta a porta para o Sobre em cada página: uma página sem ela faz parar a construção.',
      ],
      en: [
        'A figure does not enter through a person or through a template: it enters through a ledger row, and through nothing else. And the build counts the door to the About page on every page: a page without it stops the build.',
      ],
    },
    prova: [],
    provaNota: {
      pt: 'a autoria está dita no Sobre, e a porta para lá está em todas as páginas desta construção',
      en: 'authorship is stated on the About page, and the door to it is on every page in this build',
    },
    ligacoes: [{ rota: 'sobre', rotulo: { pt: 'Sobre', en: 'About' } }],
  },

  {
    n: 10,
    id: 'o-que-nao-faz',
    titulo: { pt: 'O que o observatório não faz', en: 'What the observatory does not do' },
    regra: {
      pt: [
        'Não classifica partidos nem faz médias por partido: regista quem decidiu o quê e o que aconteceu, com o nome tal como consta do documento e o rótulo partidário como facto de registo. Médias por partido sobre territórios que não têm nada em comum são aritmética enganosa. Não publica um número sem linha no livro-razão; onde a fonte ainda está por confirmar, a própria linha o diz com o marcador. Não corrige em silêncio. Não recebe dinheiro de nenhuma entidade que mede: é financiado pessoalmente pelo diretor, sem publicidade nem financiamento externo.',
      ],
      en: [
        'It does not rank or classify parties and does not average by party: it records who decided what and what happened, with the name as the document gives it and the party label as a fact of record. Averages by party across territories with nothing in common are misleading arithmetic. It does not publish a figure without a ledger row; where the source is still to be confirmed, the row itself says so with the marker. It does not correct in silence. It takes no money from any entity it measures: it is funded personally by the director, with no advertising and no outside funding.',
      ],
    },
    mecanismo: {
      pt: [
        'Não há neste sítio nenhuma ordenação por partido. O crédito de um valor é um campo da sua linha, conferido carácter a carácter na página dessa linha, como qualquer outro campo. As frases sobre o financiamento e sobre a publicidade não têm máquina nenhuma por trás: são regras da casa, como a primeira, e valem por estarem escritas e por quem responde por elas.',
      ],
      en: [
        'There is no ranking by party anywhere on this site. The credit for a value is a field of its row, checked character for character on that row page, like any other field. The sentences about funding and about advertising have no machine behind them: they are house rules, like the first one, and they hold by being written down and by whoever answers for them.',
      ],
    },
    prova: [
      {
        chave: 'valores_creditados',
        rotulo: {
          pt: 'valores com crédito atribuído na linha',
          en: 'values with credit recorded in the row',
        },
      },
    ],
    ligacoes: [{ rota: 'livro', rotulo: { pt: 'Ver o livro-razão', en: 'See the ledger' } }],
  },
];
