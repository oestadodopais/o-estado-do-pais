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
 * redação de 01.09.2026 acabava no nome do responsável editorial:
 *
 *   pt · «Texto gerado por IA sob a política da casa · responsável editorial:»
 *         seguido do nome do diretor
 *   en · «AI-generated text under the house policy · editorial responsibility:»
 *         seguido do mesmo nome
 *
 * O nome não se escreve aqui: mora no oráculo do portão
 * (`scripts/textos-aprovados.json`), que nenhum ficheiro de `src/` lê, e é lá
 * que o `gate:html` e o `check:lingua` o vão buscar (M5, 22.09.2026).
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
 * O NOME DE QUEM RESPONDE PELO SÍTIO, E PORQUE NÃO ESTÁ AQUI (M5, 22.09.2026).
 *
 * Havia aqui uma constante exportada com o nome do diretor, escrita a
 * 01.09.2026 quando o rótulo de todas as páginas o imprimia. Desde 15.09.2026
 * (§1.108, as emendas da tarde, e §1.109) nem o rótulo nem a regra 9 do Método
 * o imprimem: o sítio não diz nome nenhum, medido em todas as páginas
 * construídas. O que ficava era um nome de pessoa no código de um repositório
 * público, sem uma página que o rendesse, e por isso saiu.
 *
 * O NOME NÃO DESAPARECEU DO PORTÃO, MUDOU DE CASA. Mora no oráculo,
 * `scripts/textos-aprovados.json`, que nenhum ficheiro de `src/` e de `public/`
 * lê e que existe para ser independente do que confere. É de lá que o
 * `gate:html` e o `check:lingua` o leem.
 *
 * O QUE O PORTÃO PROTEGIA CONTINUA PROTEGIDO, E POR MAIS LADOS. A célula
 * comparava esta constante com o oráculo, para que o nome de quem responde
 * fosse uma cadeia só no dia em que uma página o rendia. Hoje exige duas coisas
 * que valem enquanto o sítio não disser nome nenhum: que o nome do oráculo não
 * se renda em página nenhuma de `dist/`, e que não exista em ficheiro nenhum de
 * `src/` e de `public/`, com o detetor a provar primeiro que vê. Quem responde
 * está no registo deste repositório e na ficha que a lei vier a exigir, se a
 * exigir (a pergunta 2 da `DILIGENCIA-LEGAL.md`).
 */

/**
 * A língua em que o nome de quem responde está escrito, na forma que o `lang`
 * do HTML usa.
 *
 * Fica declarada porque continua a ser verdade e porque o oráculo a confere;
 * nenhuma página a escreve num atributo desde que o nome saiu do rótulo. Não é
 * um nome: é uma etiqueta de língua, e por isso fica aqui.
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
/* A FRASE MUDOU A 07.10.2026 (§1.181, o acrescento (f), por decisão do diretor): o sítio
   deixa de dizer quem responde por ele, porque é um projeto de inteligência artificial,
   e a frase diz onde estão as regras e as recusas, que é o que a divulgação pede; a
   redação anterior («nenhum humano revê cada peça antes de sair; uma pessoa com nome
   define as regras e as recusas, e responde») era a cobertura legal de 30.08.2026, e
   o diretor aceitou a exposição de a retirar. O oráculo mudou no mesmo commit. */
export const FRASE = {
  pt:
    'Escrito, conferido e atualizado por sistemas de inteligência artificial, segundo ' +
    'regras publicadas; nenhum humano revê cada mudança antes de se publicar, e as ' +
    'regras e as recusas estão nesta página.',
  en:
    'Written, checked and updated by artificial intelligence systems, under published ' +
    'rules; no human reviews each change before it is published, and the rules and ' +
    'the refusals are on this page.',
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
/* A FRASE MUDOU A 07.10.2026 (§1.181, o acrescento (f)), nas palavras do diretor: um
   projeto independente conduzido por uma inteligência artificial, financiado em privado.
   «Pessoal» saiu, porque o projeto deixou de se dizer de uma pessoa; «explora a
   possibilidade» saiu, porque o observatório existe. Nenhum adjetivo de mérito entrou
   (Emenda 18): «independente» e «em privado» dizem de que espécie o projeto é. */
export const O_PROJETO = {
  pt:
    'O Estado do País é um projeto independente, conduzido por uma inteligência ' +
    'artificial e financiado em privado.',
  en:
    'O Estado do País is an independent project, run by an artificial intelligence ' +
    'and privately funded.',
};

/**
 * ---------------------------------------------------------------------------
 * O CONTACTO · a terceira frase do Sobre (07.10.2026, §1.181, o acrescento (f))
 * ---------------------------------------------------------------------------
 * O sítio não diz quem responde por ele, e por isso diz como se lhe escreve: pelo
 * endereço das correções, por agora o único endereço deste projeto (no futuro, um
 * endereço do próprio projeto para o contacto editorial e geral, criado pelo diretor
 * quando entender, e a frase muda com ele). A frase está partida em dois pedaços
 * porque o endereço é uma ligação `mailto:` e não um pedaço de cadeia; juntar
 * `antes`, o endereço (`ENDERECO_CORRECOES`, de `metodo.mjs`) e `depois` dá o texto
 * decidido, que o oráculo guarda inteiro e o `gate:html` compara com o que a página
 * rende, carácter a carácter, como faz à frase do projeto.
 */
export const CONTACTO = {
  pt: { antes: 'Para contactar este projeto, escreva para o endereço das correções, ', depois: '.' },
  en: { antes: 'To contact this project, write to the corrections address, ', depois: '.' },
};

/**
 * O texto decidido do contacto, inteiro, na língua de uma edição. É o que o portão compara.
 * @param {string} lang
 * @param {string} endereco
 */
export function textoDoContacto(lang, endereco) {
  const c = /** @type {Record<string, { antes: string, depois: string }>} */ (CONTACTO)[lang];
  if (!c) return null;
  return `${c.antes}${endereco}${c.depois}`;
}

/**
 * ---------------------------------------------------------------------------
 * A SECÇÃO DA POLÍTICA, EM `/metodo`
 * ---------------------------------------------------------------------------
 * A via, os três papéis, o que se publica só pelas verificações automáticas e as
 * recusas: é a `POLITICA-DA-AUTONOMIA.md` §2, §5, §4 e §6 dita ao leitor, com a
 * emenda de 07.10.2026 (§1.181). A regra da voz
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
      'Tudo o que este projeto publica leva o rótulo de texto gerado por inteligência ' +
        'artificial, em cada página, no momento em que a página é vista. A revisão é feita por verificações automáticas e por ' +
        'amostra, e não peça a peça. As verificações automáticas são as conferências que correm em cada construção das ' +
        'páginas e a param à primeira diferença.',
    ],
    en: [
      'Everything this project publishes carries the label saying the text was generated ' +
        'by artificial intelligence, on every page, at the moment the page is seen. Review is done by automated checks and by sample, not ' +
        'piece by piece. The automated checks are the checks that run on every build of the pages and stop the build at the first ' +
        'difference.',
    ],
  },

  /**
   * O QUE SE PUBLICA SÓ PELAS VERIFICAÇÕES AUTOMÁTICAS (07.10.2026, §1.181, o acrescento (e) e (f)).
   *
   * Até 07.10.2026 eram três casos sob o título «O que se publica sem uma pessoa ler», e o
   * terceiro era «Nunca sem uma pessoa» (uma peça que nomeie alguém, o correio a terceiros, a
   * identidade, o dinheiro). Por decisão do diretor, o «nunca sem uma pessoa» deixou de ser
   * regra e portão (nada espera por uma pessoa; o diretor é avisado do que sai) e o sítio não
   * diz quem responde por ele; o caso saiu, e os dois que ficam deixam de falar de uma pessoa:
   * o que entra por rotina entra pelas verificações automáticas, e o que pára espera a
   * decisão da direção, que a secção dos papéis acima define. O que pára é o que a política
   * sempre disse (a §1.172, o ponto 3), e não muda.
   *
   * «Portões verdes» e «portão vermelho» saíram do texto do leitor, a pedido do editor na
   * leitura do Codex de 06.10.2026 (a leitura H4-e-d): a página dizia-os sem os explicar. A
   * explicação do que uma verificação automática é está no parágrafo da via, onde o leitor
   * encontra o termo pela primeira vez (a leitura do Codex de 07.10.2026, o achado 8). E «a
   * leitura já não reconhece» passou a «o motor já não reconhece», porque nesta página «a
   * leitura» é um dos três papéis e aqui era o programa que lê os ficheiros das fontes.
   */
  casos: {
    titulo: {
      pt: 'O que se publica só pelas verificações automáticas',
      en: 'What is published by the automated checks alone',
    },
    itens: [
      {
        rotulo: { pt: 'Publica-se', en: 'Published' },
        texto: {
          pt:
            'Um valor novo da mesma medida, no mesmo formato, da mesma fonte, quando passa em ' +
            'todas as verificações automáticas.',
          en:
            'A new value of the same measure, in the same format, from the same source, when it ' +
            'passes every automated check.',
        },
      },
      {
        rotulo: { pt: 'Não se publica, e a direção decide', en: 'Not published, and direction decides' },
        texto: {
          pt:
            'Uma medida nova; uma definição mudada; um ficheiro que o motor já não reconhece; ' +
            'uma revisão da fonte; uma verificação automática que falha; uma fonte que deixou ' +
            'de responder.',
          en:
            'A new measure; a changed definition; a file the engine no longer recognises; ' +
            'a revision at the source; an automated check that fails; a source that has ' +
            'stopped answering.',
        },
      },
    ],
  },

  /**
   * OS LUGARES, SEM UM ÚNICO ALGARISMO (segunda passagem, 01.09.2026).
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
  /* H4, 06.10.2026: redação decidida pelo lugar de direção (§1.173) e reescrita na
     passagem H4-e pela leitura curta do diff: a secção diz os três papéis em palavras
     correntes, sem «peça» (que o §1.98 fecha) nem «lugares» (que no sítio são os
     concelhos), diz uma vez só que a construção e a leitura são de famílias
     diferentes, e distingue o que a construção faz com cada número (a fonte e a
     data) do que a leitura faz com o que foi construído. */
  lugares: {
    titulo: { pt: 'Os três papéis', en: 'The three roles' },
    intro: {
      pt: ['São três papéis, todos de modelos: a direção, a construção e a leitura.'],
      en: ['There are three roles, all held by models: direction, building and reading.'],
    },
    itens: [
      {
        rotulo: { pt: 'A direção', en: 'Direction' },
        texto: {
          pt: 'decide o que se faz, encomenda cada mudança e revê-a antes de se publicar, e escreve as explicações e os textos sobre este projeto, que a outra família de modelos lê antes de se publicarem; os números novos que as fontes publicam entram pelas verificações automáticas, sem a direção os ler um a um.',
          en: 'decides what is done, commissions each change and reviews it before it is published, and writes the explanations and the texts about this project, which the other family of models reads before they are published; new figures from the sources enter through the automated checks, without direction reading them one by one.',
        },
      },
      {
        rotulo: { pt: 'A construção', en: 'Building' },
        texto: {
          pt: 'faz as páginas e o motor que lê as fontes; cada número que publica traz a sua fonte e a data em que foi lido, ou diz o que ainda está por confirmar.',
          en: 'makes the pages and the engine that reads the sources; every number it publishes carries its source and the date it was read, or says what is still to be confirmed.',
        },
      },
      {
        rotulo: { pt: 'A leitura', en: 'Reading' },
        texto: {
          pt: 'confere o que a construção entregou, sem contexto prévio e com erros plantados de propósito, para provar que os encontra, antes de se publicar.',
          en: 'checks what building delivered, with no prior context and with errors planted on purpose, to prove it finds them, before it is published.',
        },
      },
    ],
    fecho: {
      pt: [
        'A construção e a leitura são sempre de famílias de modelos diferentes: o modelo que construiu uma mudança nunca é o que a lê. ' +
          'Os modelos Claude da Anthropic estão na direção; na construção e na leitura estão os modelos Claude ' +
          'e o Codex da OpenAI. Um modelo novo só ocupa um papel ' +
          'depois de passar os mesmos testes que o titular passou, e a troca fica escrita ' +
          'com a data.',
      ],
      en: [
        'Building and reading are always done by different families of models: the model that built a change never reads it. ' +
          'The Claude models from Anthropic hold the direction; building and reading are held by the Claude models ' +
          'and by Codex from OpenAI. A new model takes ' +
          'a role only after passing the same tests the incumbent passed, and the replacement ' +
          'is written down with its date.',
      ],
    },
  },

  /** As cinco recusas, escritas antes de precisarem delas. */
  recusas: {
    titulo: { pt: 'As recusas', en: 'The refusals' },
    itens: [
      {
        pt: 'Este projeto não aceita dinheiro de nenhuma entidade que mede.',
        en: 'This project takes no money from any entity it measures.',
      },
      {
        pt: 'Este projeto não escreve para ter leitores a mais: mede-se por citações, não por visitas.',
        en: 'This project does not write to gain more readers: it is measured by citations, not by visits.',
      },
      {
        pt:
          'Este projeto não publica um número que não tenha lido na fonte, não estima o que ' +
          'não existe e diz o que falta.',
        en:
          'This project publishes no figure it has not read at the source, does not ' +
          'estimate what does not exist, and says what is missing.',
      },
      {
        pt: 'Este projeto não chama jornalista à inteligência artificial e não se diz jornalístico.',
        en: 'This project does not call artificial intelligence a journalist and does not call itself journalism.',
      },
      /* A quinta recusa mudou com a caixa das sugestões, por decisão do diretor de 03.10.2026 (§1.154), no texto
         que ele aprovou; o §6 de `design/observatorio/POLITICA-DA-AUTONOMIA.md` diz o mesmo, com a data. */
      {
        pt:
          'Este projeto só guarda dados pessoais de quem usa a caixa das sugestões, pelo tempo e para o fim ' +
          'que a página «Privacidade» diz, e nunca os põe no repositório.',
        en:
          'This project keeps personal data only of those who use the suggestions box, for the time and the ' +
          "purpose that the Privacy page states, and never puts it in the repository.",
      },
    ],
  },
};
