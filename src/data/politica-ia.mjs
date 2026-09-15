/**
 * ---------------------------------------------------------------------------
 * A POLÍTICA DA CASA SOBRE A IA, DITA AO LEITOR (01.09.2026)
 * ---------------------------------------------------------------------------
 *
 * O texto de que se fazem três superfícies: o rótulo que vai em todas as
 * páginas, a frase da política no Sobre e no Método, e a secção da política em
 * `/metodo`. A decisão é a via B, tomada pelo diretor a 30.08.2026 (decisão 4)
 * e registada em `design/observatorio/POLITICA-DA-AUTONOMIA.md` §2; o brief é
 * `design/observatorio/BRIEF-divulgacao-via-B.md`.
 *
 * PORQUE ESTE FICHEIRO EXISTE, E NÃO É `src/data/metodo.mjs`. Aquele é um dos
 * dois textos governados pela amarra das decisões (`scripts/check-ledger.mjs`):
 * o resumo do ficheiro está carimbado numa entrada do `DECISIONS.md`, e mexer
 * num byte dele obriga a uma entrada nova, que é escrita do lugar de direção e
 * não do construtor. Este ficheiro é do mesmo tipo, texto que a página rende e
 * que não se reescreve em passagem, e o lugar de direção decidirá se o traz
 * para dentro da amarra com uma entrada sua.
 *
 * ---------------------------------------------------------------------------
 * O QUE AQUI NÃO SE MEXE
 * ---------------------------------------------------------------------------
 * As cadeias de `ROTULO`, a `FRASE` e a `O_PROJETO` são texto decidido, e só
 * mudam por decisão escrita, aqui e no oráculo do portão ao mesmo tempo. A
 * redação de 01.09.2026 era:
 *
 *   pt · «Texto gerado por IA sob a política da casa · responsável editorial:
 *         Nuno dos Santos»
 *   en · «AI-generated text under the house policy · editorial responsibility:
 *         Nuno dos Santos»
 *
 * **E MUDOU A 15.09.2026, PELO BLOCO P1** (`BRIEF-P1-o-rodape-e-a-primeira-
 * pagina.md`, itens 1, 2 e 3), depois de o diretor ler o rodapé no ar. Três
 * coisas, e cada uma tem a sua razão:
 *
 *   · «política da casa» é decalque de *house policy*: uma *policy* é um
 *     conjunto de regras, e «política» em português é a dos partidos. **E «a
 *     casa» também não serve** (emenda do diretor das 16:35 UTC de 15.09): em
 *     português, casa é a habitação, que este projeto também mede. A porta
 *     passa a ser «Método» / «Method», que é o nome da página onde a política
 *     da IA já vive, e a secção dela muda de título com o rótulo;
 *   · «IA» passa a «inteligência artificial» por extenso, que é a palavra da
 *     lei (o artigo 50.º fala de «sistema de IA» e o título do Regulamento
 *     escreve-o por extenso) e a que um leitor de jornal lê sem sigla;
 *   · **o nome sai do rótulo.** «responsável editorial» é decalque de
 *     *editorial responsibility*, e o rótulo não precisa de nomear ninguém: o
 *     que a divulgação obriga a dizer é o que o texto é e onde estão as regras.
 *     Quem escreve e sob que regras diz-se aqui e no Método; o que este
 *     projeto é diz-se no Sobre, numa frase de prosa.
 *
 * O rótulo está partido em três pedaços porque «Método» / «Method» é a porta
 * para a secção da política dentro dele, e uma ligação é um elemento e não um
 * pedaço de cadeia. Juntar os três pela ordem em que estão dá o texto
 * decidido, e `scripts/gate-html.mjs` compara-o com o que a página rende,
 * carácter a carácter, em todas as páginas construídas.
 *
 * NENHUM ALGARISMO NESTE FICHEIRO SEM ORIGEM DECLARADA. As três cadeias que
 * trazem algarismos são nomes de modelos, e vão à página dentro de
 * `data-nonledger="identificador-tecnico"`, que é o motivo já escrito em
 * `ledger/allowlist.yml` para versões e identificadores de máquina.
 */

/**
 * O NOME DE QUEM RESPONDE PELO SÍTIO.
 *
 * A forma exacta foi lida em `src/data/metodo.mjs`, regra 9 («A direção é de
 * **Nuno dos Santos**, que escolhe o que se publica e responde por ele»), que é
 * onde o sítio já a imprimia, e não escrita de memória. O portão de HTML
 * confere que as duas formas continuam a ser a mesma cadeia: uma segunda grafia
 * do nome da pessoa que responde seria duas pessoas para um leitor.
 *
 * **JÁ NÃO SE RENDE EM PÁGINA NENHUMA DESTE FICHEIRO** (P1, itens 1, 2 e 3,
 * 15.09.2026, com a emenda do diretor das 16:35 UTC): o rótulo de todas as
 * páginas e a ficha da primeira página deixaram de o dizer, e o Sobre passou a
 * dizer o que o projeto é em vez de dizer de quem ele é. O único sítio do
 * sítio onde o nome continua a render-se é a regra 9 do Método, que é um dos
 * dois textos governados pela amarra das decisões e uma das dez regras da
 * lista fechada do diretor: muda com uma entrada em `DECISIONS.md` escrita do
 * lugar de direção, e não com um commit de construtor.
 *
 * Esta constante fica por uma razão só, e é a comparação: o portão de HTML
 * confere que o nome deste ficheiro e o do oráculo são a mesma cadeia, e que
 * o Método a imprime se o rótulo a imprimir, e não a imprime se o rótulo não a
 * imprimir. Desde 15.09.2026 (§1.108, as emendas da tarde, e §1.109) nem o
 * rótulo nem a regra 9 a imprimem: o sítio não diz nome nenhum, e quem
 * responde fica aqui e no registo, por decisão do diretor.
 *
 * É um NOME, e um nome não se traduz.
 */
export const RESPONSAVEL_EDITORIAL = 'Nuno dos Santos';

/**
 * A língua em que o nome está escrito, na forma que o `lang` do HTML usa.
 *
 * Fica declarada porque continua a ser verdade e porque o oráculo a confere;
 * nenhuma página a escreve num atributo desde que o nome saiu do rótulo.
 */
export const LINGUA_DO_RESPONSAVEL = 'pt-PT';

/** A âncora da secção da política, dentro do Método. */
export const ANCORA_DA_POLITICA = 'politica-de-ia';

/**
 * ---------------------------------------------------------------------------
 * A MESMA DIVULGAÇÃO, PARA MÁQUINAS (schema.org, lido na fonte a 01.09.2026)
 * ---------------------------------------------------------------------------
 * O brief manda acrescentar ao JSON-LD «o que o esquema permitir para dizer a
 * geração por IA sem inventar propriedades». Existe, e está lido na fonte:
 *
 *   · `https://schema.org/digitalSourceType`: «Indicates an
 *     IPTCDigitalSourceEnumeration code indicating the nature of the digital
 *     source(s) for some CreativeWork.» Usa-se em `CreativeWork`, e por isso
 *     em `Article`, que dela herda;
 *   · `https://schema.org/TrainedAlgorithmicMediaDigitalSource`: «Content
 *     coded as “trained algorithmic media” using the IPTC digital source type
 *     vocabulary.» O código do IPTC de que ela é o eco chama-se «Created using
 *     Generative AI» e define-se «Digital media created algorithmically using
 *     an Artificial Intelligence model trained on captured content»
 *     (`http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia`).
 *
 * As duas estão na área «new» do vocabulário, na versão 30.0 (19.03.2026), e é
 * honesto dizê-lo: são termos publicados por schema.org e podem ainda mudar de
 * definição. Não são inventadas por esta casa, que era a condição.
 *
 * O VALOR VAI COMO `@id`, E FOI MEDIDO. O contexto JSON-LD de schema.org
 * (`https://schema.org/docs/jsonldcontext.jsonld`) declara `digitalSourceType`
 * como `{"@id": "schema:digitalSourceType"}` e **não** como `@type: @vocab`:
 * uma cadeia solta seria lida como um literal de texto e não como o termo do
 * vocabulário. `{ '@id': … }` é a única forma que resolve no termo.
 */
export const FONTE_DIGITAL_GERADA_POR_IA = {
  '@id': 'https://schema.org/TrainedAlgorithmicMediaDigitalSource',
};

/**
 * O rótulo, em três pedaços: o que vem antes da porta, o texto da porta, e o
 * que vem depois dela. O nome entra a seguir a `depois`, e é o fim da linha.
 */
export const ROTULO = {
  pt: {
    antes: 'Texto gerado por inteligência artificial, segundo o ',
    porta: 'Método',
    depois: '.',
  },
  en: {
    antes: 'Text generated by artificial intelligence, according to the ',
    porta: 'Method',
    depois: '.',
  },
};

/**
 * O texto decidido, inteiro, na língua de uma edição. É o que o portão compara.
 *
 * O NOME SAIU DAQUI A 15.09.2026 (P1, item 1): a linha acaba no ponto final, e
 * o que ela diz é o que o artigo 50.º pede, que o texto foi gerado por um
 * sistema de inteligência artificial e onde estão as regras sob as quais o foi.
 *
 * @param {string} lang
 */
export function textoDoRotulo(lang) {
  const r = /** @type {Record<string, { antes: string, porta: string, depois: string }>} */ (ROTULO)[lang];
  if (!r) return null;
  return `${r.antes}${r.porta}${r.depois}`;
}

/**
 * ---------------------------------------------------------------------------
 * A PRIMEIRA PÁGINA · o artigo 15.º, n.º 1 da Lei de Imprensa
 * ---------------------------------------------------------------------------
 * «As publicações periódicas devem conter, na primeira página de cada edição, o
 * título, a data, o período de tempo a que respeitam, o nome do director e o
 * preço por unidade ou a menção da sua gratuitidade» (Lei n.º 2/99, texto
 * consolidado, citado em `design/observatorio/DILIGENCIA-LEGAL.md` §2.1). O
 * título e a data já estão; o que faltava eram estas duas cadeias, e vão numa
 * linha só, no rodapé da primeira página de cada edição.
 *
 * A LEITURA QUE SE FEZ, e fica escrita para poder ser desfeita: «a primeira
 * página de cada edição» lê-se como a página inicial de cada uma das duas
 * edições construídas, `/` e `/en`. Num sítio em atualização contínua não há
 * números de edição, e a página inicial é a que faz o papel da primeira página
 * de um jornal. Se o advogado ler de outra maneira, muda-se a condição num
 * sítio só (`RotuloDeIA.astro`) e a linha passa a render onde ele disser. A
 * pergunta de fundo, se a casa é sequer uma publicação periódica no sentido do
 * artigo 9.º, é a primeira das perguntas para o advogado (§3 da diligência), e
 * cumprir o artigo antes da resposta não custa nada e não decide nada.
 *
 * A menção de gratuitidade diz o que a coisa é e não tem adjetivo nenhum: não
 * diz que é livre, aberta ou de acesso universal, diz que não se paga.
 *
 * ---------------------------------------------------------------------------
 * O NOME SAIU DESTA LINHA A 15.09.2026, E A LEITURA FICA ESCRITA
 * ---------------------------------------------------------------------------
 * **A decisão é do diretor**, na tarde de 15.09.2026, depois de ler a primeira
 * página no ar: «posing as a director with my name is just not right». O que
 * sai é a palavra «Diretor:» e o nome a seguir a ela; o que fica é a menção de
 * gratuitidade, sozinha, na primeira página de cada edição.
 *
 * **A LEITURA DO ARTIGO 15.º NÃO SE APAGA, E É POR ISSO QUE ESTE PARÁGRAFO
 * CONTINUA AQUI.** O que o artigo pede continua a ser o que está escrito acima,
 * e a casa deixa de o cumprir numa das suas partes com uma decisão escrita e
 * datada, em vez de o cumprir por hábito: se o advogado responder que o sítio é
 * uma publicação periódica no sentido do artigo 9.º, a palavra e o nome voltam
 * a uma linha só, neste ficheiro, e a condição de onde a linha se rende já está
 * escrita num sítio só (`RotuloDeIA.astro`). A pergunta de fundo é a primeira
 * das perguntas para o advogado (§3 da diligência), e a posição do diretor
 * entra ali pela mão do lugar de direção.
 */
export const FICHA_DA_PRIMEIRA_PAGINA = {
  pt: { gratuito: 'Publicação gratuita' },
  en: { gratuito: 'Free of charge' },
};

/**
 * A frase da política, aprovada pelo diretor. Vive no Sobre e no Método, nas
 * duas edições, e em mais lado nenhum: as páginas do leitor levam o rótulo, que
 * é uma linha e uma porta.
 */
export const FRASE = {
  pt:
    'Escrito, conferido e atualizado por sistemas de inteligência artificial, segundo ' +
    'regras publicadas; nenhum humano revê cada peça antes de sair; uma pessoa com ' +
    'nome define as regras e as recusas, e responde.',
  en:
    'Written, checked and updated by artificial intelligence systems, under published ' +
    'rules; no human reviews each piece before it goes out; a named person sets the ' +
    'rules and the refusals, and answers for it.',
};

/**
 * ---------------------------------------------------------------------------
 * O QUE ESTE PROJETO É · a frase do Sobre (P1, item 3, 15.09.2026)
 * ---------------------------------------------------------------------------
 * Uma frase em prosa, sem título nenhum por cima e sem rótulo nenhum pelo
 * meio: o que isto é e o que anda a experimentar. Está no lugar da ficha com o
 * nome («Diretor: <nome>») e do rótulo que dizia «responsável editorial:
 * <nome>», e não os substitui palavra por palavra: **diz outra coisa, por
 * decisão do diretor das 16:35 UTC de 15.09.2026** («I don't see the need for
 * saying that it is mine»). O nome de quem responde sai de todas as páginas
 * construídas.
 *
 * **VIVE AQUI E NÃO EM `src/data/sobre.mjs`**, e a razão é a mesma que este
 * ficheiro já escreve sobre a frase da política: aquele é um dos dois textos
 * governados pela amarra das decisões, com o resumo carimbado numa entrada do
 * `DECISIONS.md`, e mexer num byte dele obriga a uma entrada nova, que é
 * escrita do lugar de direção e não do construtor. As duas frases do diretor
 * que lá vivem não mudam com este bloco, e o `sha256` delas continua o mesmo.
 *
 * «PESSOAL E INDEPENDENTE» É O QUE ELE ESCREVEU, e não uma escolha de palavras
 * do construtor: «pessoal» diz que não é de uma empresa nem de uma redação, e
 * «independente» diz que não responde a ninguém. Nenhuma das duas é um
 * adjetivo de mérito, que a Emenda 18 recusa: não dizem que o projeto é bom,
 * dizem de que espécie é.
 */
export const O_PROJETO = {
  pt:
    'O Estado do País é um projeto pessoal e independente: explora a possibilidade ' +
    'de um observatório sobre o país feito com inteligência artificial.',
  en:
    'O Estado do País is a personal, independent project: it explores the possibility ' +
    'of an observatory of the country made with artificial intelligence.',
};

/**
 * ---------------------------------------------------------------------------
 * A SECÇÃO DA POLÍTICA, EM `/metodo`
 * ---------------------------------------------------------------------------
 * A via, o que se publica sem humano, os lugares e as recusas: é a
 * `POLITICA-DA-AUTONOMIA.md` §2, §4, §5 e §6 dita ao leitor. A regra da voz
 * vale aqui como em todo o lado (Emenda 18): a página diz o que a coisa é, e
 * nunca porque se deve confiar nela. Por isso nenhuma destas frases é sobre o
 * cuidado da casa; são todas sobre o que a casa faz e o que não faz.
 *
 * As cinco recusas são as da política, ditas com as palavras dela: o que se
 * copia de uma fonte fica como a fonte o escreveu, e aqui a fonte é a própria
 * política do diretor.
 *
 * A tradução inglesa é da casa, fiel, sem acrescentos e sem omissões, como a do
 * Sobre. É lida pelo lugar de direção antes da fusão.
 */
export const POLITICA = {
  /* O TÍTULO MUDOU A 15.09.2026 (P1, item 1, com a emenda do diretor das 16:35
     UTC): «A política da casa» era o decalque de *house policy*, e «regras da
     casa» trocava um decalque por outro problema, porque casa em português é a
     habitação. O título passa a dizer o que a secção faz, em palavras
     correntes, e a porta do rótulo abre-a pelo nome da página. */
  titulo: {
    pt: 'Como a inteligência artificial escreve este sítio',
    en: 'How artificial intelligence writes this site',
  },

  /** A via escolhida, e o que ela obriga. */
  via: {
    pt: [
      'Tudo o que a casa publica leva o rótulo de gerado por IA, em cada página, ' +
        'no momento em que a página é vista. A revisão faz-se por portões e por ' +
        'amostra, e não peça a peça.',
    ],
    en: [
      'Everything the house publishes carries the AI-generated label, on every page, ' +
        'at the moment the page is seen. Review is done by gates and by sample, not ' +
        'piece by piece.',
    ],
  },

  /**
   * O que se publica sem o diretor, o que pára, e o que nunca sai sem ele.
   *
   * A política escreve-o como uma tabela de duas colunas; a página escreve-o na
   * forma que já existe aqui, a linha rotulada do Método («Mecanismo», «Prova»,
   * «O que isto não apanha»). Uma tabela nova pedia uma folha nova e uma
   * disposição que a constituição não tem, e o que ela diria é isto: três
   * casos, e o que acontece em cada um.
   */
  casos: {
    titulo: { pt: 'O que sai sem o diretor', en: 'What goes out without the director' },
    itens: [
      {
        /* A política diz «fica registado na página “O que mudou”». Essa página
           ainda não existe neste sítio, e nomear uma página que não se
           constrói seria uma porta que não abre: a frase diz a condição, que é
           a parte que já é verdade hoje. */
        rotulo: { pt: 'Publica-se', en: 'Published' },
        texto: {
          pt:
            'Um valor novo da mesma medida, no mesmo formato, da mesma fonte, com ' +
            'todos os portões verdes.',
          en:
            'A new value of the same measure, in the same format, from the same source, ' +
            'with every gate green.',
        },
      },
      {
        /* «Pára» é a palavra da política, e não pode ser a da página: o Acordo
           de 1990 tira-lhe o acento, e «Para, e o diretor é avisado» lê-se como
           a preposição. O portão da ortografia apanhou-o. A frase diz a mesma
           coisa sem o homógrafo. */
        rotulo: { pt: 'Não se publica, e o diretor é avisado', en: 'Not published, and the director is told' },
        texto: {
          pt:
            'Uma medida nova; uma definição mudada; um ficheiro que a leitura já não ' +
            'reconhece; uma revisão da fonte; um portão vermelho; uma fonte que deixou ' +
            'de responder.',
          en:
            'A new measure; a changed definition; a file the reader no longer recognises; ' +
            'a revision at the source; a red gate; a source that has stopped answering.',
        },
      },
      {
        rotulo: { pt: 'Nunca sem o diretor', en: 'Never without the director' },
        texto: {
          pt:
            'Qualquer peça que nomeie uma pessoa; correio a terceiros em nome da casa; ' +
            'uma mudança de identidade; dinheiro, contratos, contas.',
          en:
            'Any piece that names a person; mail to third parties in the name of the house; ' +
            'a change of identity; money, contracts, accounts.',
        },
      },
    ],
  },

  /**
   * OS QUATRO LUGARES, SEM UM ÚNICO ALGARISMO (segunda passagem, 01.09.2026).
   *
   * A primeira passagem escreveu os nomes dos modelos com a versão («Claude
   * Opus 5», «gpt-5.6-sol») e marcou os algarismos `identificador-tecnico`. A
   * leitura a frio recusou-o por duas razões que valem as duas: um número de
   * versão de um produto de terceiros envelhece sozinho na página, e a marca
   * punha algarismos novos no sítio para dizer uma coisa que não precisa deles.
   * A página passa a nomear as FAMÍLIAS e os lugares, que é o que o leitor
   * precisa de saber para ler a regra que se segue: quem verifica não é quem
   * construiu.
   *
   * E A VOZ MUDOU COM ELES. «Claude Fable 5 decide, escreve as regras» dizia
   * uma coisa falsa: as regras são do diretor, e a primeira frase desta secção
   * di-lo. «Mede às cegas» e «lê a frio» são o jargão da casa, e a página do
   * leitor diz o que a coisa é: mede sem ver a construção, lê sem contexto
   * prévio.
   */
  lugares: {
    titulo: { pt: 'Os lugares', en: 'The places' },
    intro: {
      pt: ['São quatro lugares, e a verificação é sempre de outra família de modelos:'],
      en: ['There are four places, and checking is always done by a different family of models:'],
    },
    itens: [
      {
        rotulo: { pt: 'A direção', en: 'Direction' },
        texto: {
          pt: 'dirige o trabalho: escreve os briefs, revê e funde.',
          en: 'directs the work: it writes the briefs, reviews and merges.',
        },
      },
      {
        rotulo: { pt: 'A construção', en: 'Building' },
        texto: {
          pt: 'constrói o sítio, e verifica lotes na fonte.',
          en: 'builds the site, and checks batches at the source.',
        },
      },
      {
        rotulo: { pt: 'A medição', en: 'Measurement' },
        texto: {
          pt: 'mede numa cópia, com código próprio, sem ver a construção.',
          en: 'measures on a copy, with its own code, without seeing the build.',
        },
      },
      {
        rotulo: { pt: 'A leitura', en: 'Reading' },
        texto: {
          pt: 'lê sem contexto prévio, com erros plantados que tem de encontrar.',
          en: 'reads with no prior context, with planted errors it has to find.',
        },
      },
    ],
    fecho: {
      pt: [
        'São os modelos Claude da Anthropic, em três lugares (a direção, a construção, ' +
          'a medição), e o Codex da OpenAI na leitura. Um modelo novo só ocupa um lugar ' +
          'depois de passar os mesmos testes que o titular passou, e a troca fica escrita ' +
          'com a data.',
      ],
      en: [
        'They are the Claude models from Anthropic in three of the places (direction, ' +
          'building, measurement), and Codex from OpenAI in the reading. A new model takes ' +
          'a place only after passing the same tests the incumbent passed, and the change ' +
          'is written down with its date.',
      ],
    },
  },

  /** As cinco recusas, escritas antes de precisarem delas. */
  recusas: {
    titulo: { pt: 'As recusas', en: 'The refusals' },
    itens: [
      {
        pt: 'A casa não aceita dinheiro de nenhuma entidade que mede.',
        en: 'The house takes no money from any entity it measures.',
      },
      {
        pt: 'A casa não escreve para o alcance: mede-se por citações, não por visitas.',
        en: 'The house does not write for reach: it is measured by citations, not by visits.',
      },
      {
        pt:
          'A casa não publica um número que não tenha lido na fonte, não aproxima o ' +
          'que não existe, e diz as ausências.',
        en:
          'The house publishes no figure it has not read at the source, does not ' +
          'approximate what does not exist, and says what is missing.',
      },
      {
        pt: 'A casa não chama jornalista à IA e não se diz jornalística.',
        en: 'The house does not call the AI a journalist and does not call itself journalism.',
      },
      {
        pt: 'A casa não guarda dados pessoais dos leitores nem os põe no repositório.',
        en: 'The house keeps no personal data of its readers and puts none in the repository.',
      },
    ],
  },
};
