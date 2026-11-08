/** MET1: texto aprovado pelo mandato, nas duas edições. As contagens são tokens de prova. */
export const ENDERECO_CORRECOES = 'correcoes@oestadodopais.pt';
export const METODO = {
  "titulos": {
    "pt": [
      "Conferir um número",
      "Do documento à página",
      "As marcas",
      "Quando um número muda"
    ],
    "en": [
      "Check a number",
      "From document to page",
      "The marks",
      "When a number changes"
    ]
  },
  "abrir": {
    "pt": [
      "Toque em «fonte», ao lado de um número, para abrir o seu recibo."
    ],
    "en": [
      "Tap «source», next to a number, to open its receipt."
    ]
  },
  "divida": {
    "pt": [
      "Um selo a tracejado quer dizer que falta confirmar um campo do recibo na fonte; hoje são ",
      {
        "prova": "divida"
      },
      "."
    ],
    "en": [
      "A dashed seal means a field of the receipt is still to be confirmed at the source; today there are ",
      {
        "prova": "divida"
      },
      "."
    ]
  },
  "passos": [
    {
      "pt": [
        "Um modelo de inteligência artificial lê as notícias, os calendários das fontes e o que os partidos publicam, e aponta o que mudou."
      ],
      "en": [
        "An artificial intelligence model reads the news, source calendars and what parties publish, and identifies what has changed."
      ]
    },
    {
      "pt": [
        "Um programa descarrega o documento da fonte e mede o número no próprio documento."
      ],
      "en": [
        "A program downloads the source document and measures the number in the document itself."
      ]
    },
    {
      "pt": [
        "O número entra no livro-razão com a fonte, o documento, o excerto e a data."
      ],
      "en": [
        "The number enters the ledger with its source, document, excerpt and date."
      ]
    },
    {
      "pt": [
        "A direção escreve o que muda e as frases que o leitor vai ler, conferidas na fonte."
      ],
      "en": [
        "The directing model writes what changes and the sentences the reader will read, checked against the source."
      ]
    },
    {
      "pt": [
        "Um modelo constrói a mudança."
      ],
      "en": [
        "A model builds the change."
      ]
    },
    {
      "pt": [
        "Antes de cada mudança ir para o ar, correm ",
        {
          "prova": "conferencias_da_corrida"
        },
        " conferências automáticas: um algarismo sem linha no livro-razão, ou com outro valor, trava a publicação."
      ],
      "en": [
        "Before each change goes live, ",
        {
          "prova": "conferencias_da_corrida"
        },
        " automated checks run: a digit without a ledger row, or with a different value, stops publication."
      ]
    },
    {
      "pt": [
        "Um modelo de outra família, que não construiu a mudança, lê-a contra os documentos, com cinco erros plantados nas suas cópias para medir se os apanha."
      ],
      "en": [
        "A model from another family, which did not build the change, reads it against the documents, with five errors planted in its copies to measure whether it finds them."
      ]
    },
    {
      "pt": [
        "O que a leitura encontra corrige-se, e a correção volta a ser lida."
      ],
      "en": [
        "What the reading finds is corrected, and the correction is read again."
      ]
    },
    {
      "pt": [
        "Só se publica o que passou em todas as conferências, e a cópia publicada volta a ser conferida depois de estar no ar."
      ],
      "en": [
        "Only work that has passed every check is published, and the published copy is checked again once it is live."
      ]
    },
    {
      "pt": [
        "Os números do painel são relidos na fonte, a última vez a ",
        {
          "prova": "painel_reconferido_em"
        },
        "; quando a fonte muda um valor, o número muda e o registo diz o que estava antes."
      ],
      "en": [
        "The panel numbers are read again at the source, most recently on ",
        {
          "prova": "painel_reconferido_em"
        },
        "; when the source changes a value, the number changes and the register shows what was there before."
      ]
    }
  ],
  "marcas": [
    {
      "pt": [
        "fonte: abre o recibo do número."
      ],
      "en": [
        "source: opens the number’s receipt."
      ]
    },
    {
      "pt": [
        "dado provisório: a fonte diz que o valor ainda pode mudar."
      ],
      "en": [
        "provisional data: the source says the value may still change."
      ]
    },
    {
      "pt": [
        "calculado: o número foi calculado a partir de outros, e o recibo mostra a conta."
      ],
      "en": [
        "calculated: the number was calculated from others, and the receipt shows the arithmetic."
      ]
    },
    {
      "pt": [
        "por confirmar na fonte: um campo do recibo ainda não foi confirmado no documento."
      ],
      "en": [
        "to be confirmed at the source: a field of the receipt has not yet been confirmed in the document."
      ]
    },
    {
      "pt": [
        "Âmbar: o valor está fora do valor de referência que a fonte publica. Cobalto: está dentro. Uma medida sem valor de referência não leva cor."
      ],
      "en": [
        "Amber: the value is outside the reference value published by the source. Cobalt: it is within it. A measure without a reference value carries no colour."
      ]
    },
    {
      "pt": [
        "Estudo atualizado: o estudo ganhou documentos novos. Estudo corrigido: o texto dizia uma coisa que não devia. A edição anterior fica sempre a um toque."
      ],
      "en": [
        "Study updated: the study has gained new documents. Study corrected: the text said something it should not have. The previous edition is always one tap away."
      ]
    }
  ],
  "mudanca": {
    "pt": [
      "Cada mudança fica no registo das correções, com a data, o que estava e o que ficou."
    ],
    "en": [
      "Each change is recorded in the corrections register, with the date, what was there and what replaced it."
    ]
  },
  "autoria": {
    "pt": [
      "Estas páginas são escritas, conferidas e atualizadas por modelos de inteligência artificial; nenhuma pessoa revê cada mudança antes de se publicar."
    ],
    "en": [
      "These pages are written, checked and updated by artificial intelligence models; no person reviews each change before publication."
    ]
  },
  "campos": {
    "pt": [
      "quem o publicou",
      "o documento",
      "onde está no documento",
      "o excerto, como a fonte o escreveu",
      "a data em que foi lido"
    ],
    "en": [
      "who published it",
      "the document",
      "where it is in the document",
      "the excerpt, as the source wrote it",
      "the date it was read"
    ]
  },
  "recibo": {
    "id": "retribuicao-minima-mensal-garantida-continente-2026"
  },
  "ligacoes": {
    "pt": [
      "A agenda"
    ],
    "en": [
      "The agenda"
    ]
  }
};
