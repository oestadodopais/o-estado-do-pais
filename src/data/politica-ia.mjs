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
 * não do construtor. Este ficheiro é do mesmo tipo — texto que a página rende e
 * que não se reescreve em passagem — e o lugar de direção decidirá se o traz
 * para dentro da amarra com uma entrada sua.
 *
 * ---------------------------------------------------------------------------
 * O QUE AQUI NÃO SE MEXE
 * ---------------------------------------------------------------------------
 * As duas primeiras cadeias de `ROTULO` e a `FRASE` inteira são texto aprovado
 * pelo diretor, carácter a carácter, na ordem de construção de 01.09.2026 §3.
 * Não se apertam, não se traduzem outra vez e não se acrescenta nada:
 *
 *   pt · «Texto gerado por IA sob a política da casa · responsável editorial:
 *         Nuno dos Santos»
 *   en · «AI-generated text under the house policy · editorial responsibility:
 *         Nuno dos Santos»
 *
 * O rótulo está partido em três pedaços porque «a política da casa» / «the
 * house policy» é a porta para a secção da política, e uma ligação é um
 * elemento e não um pedaço de cadeia. Juntar os três pela ordem em que estão dá
 * o texto aprovado, e `scripts/gate-html.mjs` compara-o com o que a página
 * rende, carácter a carácter, em todas as páginas construídas.
 *
 * NENHUM ALGARISMO NESTE FICHEIRO SEM ORIGEM DECLARADA. As três cadeias que
 * trazem algarismos são nomes de modelos, e vão à página dentro de
 * `data-nonledger="identificador-tecnico"`, que é o motivo já escrito em
 * `ledger/allowlist.yml` para versões e identificadores de máquina.
 */

/**
 * O NOME DE QUEM DETÉM A RESPONSABILIDADE EDITORIAL.
 *
 * A forma exacta foi lida em `src/data/metodo.mjs`, regra 9 («A direção é de
 * **Nuno dos Santos**, que escolhe o que se publica e responde por ele»), que é
 * onde o sítio já a imprimia, e não escrita de memória. O portão de HTML
 * confere que as duas formas continuam a ser a mesma cadeia: uma segunda grafia
 * do nome da pessoa que responde seria duas pessoas para um leitor.
 *
 * É um NOME, e um nome não se traduz: numa página inglesa leva `lang="pt-PT"`,
 * pela mesma regra dos títulos de documento (§1.82). `scripts/check-lingua.mjs`
 * confere-o nas duas edições.
 */
export const RESPONSAVEL_EDITORIAL = 'Nuno dos Santos';

/** A língua em que o nome está escrito, na forma que o `lang` do HTML usa. */
export const LINGUA_DO_RESPONSAVEL = 'pt-PT';

/** A âncora da secção da política, dentro do Método. */
export const ANCORA_DA_POLITICA = 'politica-de-ia';


/**
 * O rótulo, em três pedaços: o que vem antes da porta, o texto da porta, e o
 * que vem depois dela. O nome entra a seguir a `depois`, e é o fim da linha.
 */
export const ROTULO = {
  pt: {
    antes: 'Texto gerado por IA sob ',
    porta: 'a política da casa',
    depois: ' · responsável editorial: ',
  },
  en: {
    antes: 'AI-generated text under ',
    porta: 'the house policy',
    depois: ' · editorial responsibility: ',
  },
};

/** O texto aprovado, inteiro, na língua de uma edição. É o que o portão compara. */
export function textoDoRotulo(lang) {
  const r = ROTULO[lang];
  if (!r) return null;
  return `${r.antes}${r.porta}${r.depois}${RESPONSAVEL_EDITORIAL}`;
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
 * edições construídas — `/` e `/en`. Num sítio em atualização contínua não há
 * números de edição, e a página inicial é a que faz o papel da primeira página
 * de um jornal. Se o advogado ler de outra maneira, muda-se a condição num
 * sítio só (`RotuloDeIA.astro`) e a linha passa a render onde ele disser. A
 * pergunta de fundo — se a casa é sequer uma publicação periódica no sentido do
 * artigo 9.º — é a primeira das perguntas para o advogado (§3 da diligência), e
 * cumprir o artigo antes da resposta não custa nada e não decide nada.
 *
 * A menção de gratuitidade diz o que a coisa é e não tem adjetivo nenhum: não
 * diz que é livre, aberta ou de acesso universal, diz que não se paga.
 */
export const FICHA_DA_PRIMEIRA_PAGINA = {
  pt: { diretorK: 'Diretor:', gratuito: 'Publicação gratuita' },
  en: { diretorK: 'Director:', gratuito: 'Free publication' },
};

/**
 * A frase da política, aprovada pelo diretor. Vive no Sobre e no Método, nas
 * duas edições, e em mais lado nenhum: as páginas do leitor levam o rótulo, que
 * é uma linha e uma porta.
 */
export const FRASE = {
  pt:
    'Escrito, conferido e atualizado por sistemas de IA sob uma política publicada; ' +
    'nenhum humano revê cada peça antes de sair; uma pessoa com nome detém a ' +
    'responsabilidade editorial, define as regras e as recusas, e responde.',
  en:
    'Written, checked and updated by AI systems under a published policy; no human ' +
    'reviews each piece before it goes out; a named person holds editorial ' +
    'responsibility, sets the rules and the refusals, and answers for it.',
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
  titulo: { pt: 'A política da casa', en: 'The house policy' },

  /** A via escolhida, e o que ela obriga. */
  via: {
    pt: [
      'Tudo o que a casa publica leva o rótulo de gerado por IA, em cada página, ' +
        'no momento em que a página é vista. A revisão faz-se por portões e por ' +
        'amostra, e não peça a peça. A casa não finge uma revisão que não existe.',
    ],
    en: [
      'Everything the house publishes carries the AI-generated label, on every page, ' +
        'at the moment the page is seen. Review is done by gates and by sample, not ' +
        'piece by piece. The house does not pretend to a review that does not exist.',
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
   * Os quatro lugares. Os nomes dos modelos trazem algarismos e são
   * identificadores de máquina: vão marcados, com o motivo já escrito na lista
   * de excepções, e não são uma medição do país.
   */
  lugares: {
    titulo: { pt: 'Os lugares', en: 'The places' },
    intro: {
      pt: [
        'São quatro lugares, e a família de modelos que construiu nunca verifica o que construiu:',
      ],
      en: [
        'There are four places, and the family of models that built a thing never checks it:',
      ],
    },
    itens: [
      {
        modelo: 'Claude Fable 5',
        pt: { antes: '', depois: ' decide, escreve as regras, revê e funde.' },
        en: { antes: '', depois: ' decides, writes the rules, reviews and merges.' },
      },
      {
        modelo: 'Claude Opus 5',
        pt: { antes: '', depois: ' constrói, e verifica lotes na fonte.' },
        en: { antes: '', depois: ' builds, and checks batches at the source.' },
      },
      {
        modelo: 'Claude Sonnet 5',
        pt: { antes: '', depois: ' mede às cegas, com código próprio, numa cópia.' },
        en: { antes: '', depois: ' measures blind, with its own code, on a copy.' },
      },
      {
        modelo: 'gpt-5.6-sol',
        pt: { antes: 'O Codex (', depois: ') lê a frio, com estragos plantados.' },
        en: { antes: 'Codex (', depois: ') reads cold, with planted damage.' },
      },
    ],
    fecho: {
      pt: [
        'Um modelo novo só ocupa um lugar depois de passar os mesmos testes que o ' +
          'titular passou, e a troca fica escrita com a data.',
      ],
      en: [
        'A new model takes a place only after passing the same tests the incumbent ' +
          'passed, and the change is written down with its date.',
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
