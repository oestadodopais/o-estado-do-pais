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
 * NENHUMA CADEIA QUE A PÁGINA RENDE TRAZ ALGARISMOS. A primeira passagem de
 * 01.09.2026 escrevia aqui os nomes dos modelos com a versão; a segunda tirou as
 * versões, e o bloco ME1 (15.10.2026) tirou os nomes: a página diz os papéis e a
 * regra das famílias, e os sistemas de cada papel leem-se no documento público
 * da política, para onde a primeira secção do Método liga.
 */

import { routePath } from '../lib/routes.mjs';

/** RH1-b, 14.10.2026, §1.192: o nome pessoal e a sua língua deixam de
 * ter um oráculo público. check:privacidade lê as fontes privadas e protege
 * dist/, documentos alojados e ficheiros seguidos, com conhecido-positivo.
 */

/**
 * A PORTA DA POLÍTICA (bloco ME1, 15.10.2026).
 *
 * O rótulo de todas as páginas, a faixa dos documentos alojados e o Sobre abrem
 * o Método pelo princípio, onde a secção de quem escreve estas páginas passou a
 * ser a primeira: a âncora fica vazia, e a porta compõe-se numa função só,
 * `portaDaPolitica()`, que é a rota do Método e mais nada enquanto a âncora for
 * vazia. O oráculo do portão (`scripts/textos-aprovados.json`) guarda a mesma
 * âncora, e o `gate:html` compõe o destino por conta própria com a mesma regra.
 */
export const ANCORA_DA_POLITICA = '';

/**
 * O `id` da primeira secção do Método, que fica para as ligações antigas: o
 * rótulo levou o leitor a `/metodo#politica-de-ia` de 01.09 a 15.10.2026, e um
 * endereço que esteve no ar continua a abrir a mesma secção.
 */
export const ID_DA_SECCAO_DA_POLITICA = 'politica-de-ia';

/**
 * O documento público da política deste projeto, onde os sistemas de cada papel
 * e as suas trocas ficam escritos com a data. É a única ligação para fora do
 * Método, e a mesma nas duas edições (o documento é um só).
 */
export const DOCUMENTO_DA_POLITICA =
  'https://github.com/oestadodopais/o-estado-do-pais/blob/main/design/observatorio/POLITICA-DA-AUTONOMIA.md';

/**
 * A porta da política na língua de uma edição: a rota do Método, e `#` com a
 * âncora só quando a âncora não for vazia.
 * @param {string} lang
 */
export function portaDaPolitica(lang) {
  const rota = routePath('metodo', /** @type {'pt'|'en'} */ (lang));
  return ANCORA_DA_POLITICA ? `${rota}#${ANCORA_DA_POLITICA}` : rota;
}


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
 * A PRIMEIRA SECÇÃO DO MÉTODO · quem escreve estas páginas (bloco ME1, 15.10.2026)
 * ---------------------------------------------------------------------------
 * Até 15.10.2026 era a secção «Como a inteligência artificial escreve este sítio»,
 * a dois terços do Método, com a via, a lista dos três papéis, os dois casos do que
 * se publica e as recusas, e uma frase com os nomes das famílias de modelos e das
 * empresas. O mandato do bloco ME1 passa-a para o princípio da página e reescreve-a
 * em quatro parágrafos: a frase da política (`FRASE`, que o oráculo guarda), os
 * papéis, a regra das famílias com a porta para o documento público da política,
 * e o que se publica só pelas verificações automáticas. Os nomes dos modelos e das
 * empresas saem da página: ficam na `POLITICA-DA-AUTONOMIA.md` §5 e no
 * `DECISIONS.md`. As frases são as do mandato, palavra por palavra, e a cópia do
 * lado do portão (`scripts/lugares-ia-do-portao.mjs`) confere os papéis e as
 * famílias contra a redação decidida; as duas mudam no mesmo commit.
 *
 * As cinco recusas são as da política, ditas com as palavras dela, e rendem-se
 * na secção do que este projeto não faz.
 */
export const POLITICA = {
  titulo: { pt: 'Quem escreve estas páginas', en: 'Who writes these pages' },

  /** Os três papéis, e o que cada um faz. */
  papeis: {
    pt: 'O trabalho divide-se em três papéis, todos de sistemas de inteligência artificial. A direção decide o que se faz, encomenda cada mudança, revê-a antes de se publicar e escreve os textos sobre este projeto, como este. A construção faz as páginas e o programa que lê as fontes; cada número que publica traz a sua fonte e a data em que foi lido, ou diz o que está por confirmar. A leitura é feita por sistemas que não participaram na construção e conferem o trabalho entregue antes de se publicar.',
    en: 'The work is divided into three roles, all held by artificial intelligence systems. Direction decides what is done, commissions each change, reviews it before it is published and writes the texts about this project, such as this one. Building makes the pages and the program that reads the sources; every number it publishes carries its source and the date it was read, or says what is still to be confirmed. Reading is done by systems that took no part in the building and check the delivered work before it is published.',
  },

  /** A regra das famílias, com a porta para o documento público da política. */
  familias: {
    pt: { antes: 'A construção e a leitura são sempre de famílias diferentes de sistemas: o que construiu uma mudança nunca é o que a lê. Um sistema novo só entra num papel depois de passar as mesmas provas que o anterior passou, e cada troca de sistema fica escrita com a data ', ligacao: 'no documento público da política deste projeto', depois: '.' },
    en: { antes: 'Building and reading are always done by different families of systems: the one that built a change is never the one that reads it. A new system takes a role only after passing the same tests the previous one passed, and every replacement of a system is recorded with its date ', ligacao: "in this project's public policy document", depois: '.' },
  },

  /** O que se publica só pelas verificações automáticas, e o que espera a decisão da direção. */
  publicacao: {
    pt: 'Um valor novo da mesma medida, no mesmo formato e da mesma fonte publica-se quando passa em todas as verificações automáticas, sem uma leitura individual. Tudo o resto espera a decisão da direção: uma medida nova, uma definição mudada, um ficheiro que o programa já não reconhece, uma revisão da fonte, uma verificação que falha, uma fonte que deixou de responder.',
    en: "A new value of the same measure, in the same format and from the same source, is published when it passes every automated check, without an individual review. Everything else waits for direction's decision: a new measure, a changed definition, a file the program no longer recognises, a revision at the source, a check that fails, a source that has stopped answering.",
  },

  /** As cinco recusas, escritas antes de precisarem delas. */
  recusas: {
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
