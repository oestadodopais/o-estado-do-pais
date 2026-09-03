/**
 * Os tipos da casa.
 *
 * Ficheiro de declarações puro: não é importado por ninguém em tempo de
 * execução, não entra no pacote e não muda uma linha do que o sítio publica.
 * Existe para que o JSDoc dos módulos `.mjs` possa nomear as formas que já
 * circulam entre eles sem repetir a forma em cada `@param`.
 *
 * Não tem `import` nem `export` de topo de propósito: assim é um guião global
 * e os nomes daqui vêem-se em todos os ficheiros do programa, que é o que o
 * `tsconfig.check.json` inclui.
 *
 * A regra é a mesma da casa: o que está aqui foi lido dos dados, não inventado.
 * `Linha` tem os 24 campos de `CAMPOS` (`src/lib/ledger.mjs`) mais `__file`,
 * que o carregador acrescenta; os campos opcionais são os que faltam nalguma
 * das 2 916 linhas de hoje.
 */

/** As duas edições do sítio. */
type Lingua = 'pt' | 'en';

/** Um par de textos, um por edição. */
interface ParDeLinguas {
  pt: string;
  en: string;
}

/** Uma extração de um ficheiro alojado: de que ficheiro veio, e com que resumo. */
interface ExtracaoDoArquivo {
  file: string;
  url: string;
  sha256: string;
  bytes: number;
}

/** O ficheiro que esta casa aloja e sobre o qual a linha foi contada. */
interface FicheiroAlojado {
  /** O validador lê chaves que ainda não são de confiança, uma a uma. */
  [outro: string]: unknown;
  asset: string;
  sha256: string;
  bytes: number;
  licence: string;
  licence_url: string;
  attribution: string;
  extracted_from: ExtracaoDoArquivo[];
}

/** O documento de onde a linha foi lida. */
interface DocumentoDaLinha {
  title?: string | null;
  edition?: string | null;
  kind?: string | null;
  locator?: string | null;
  page?: string | number | null;
  url?: string | null;
  crop?: Record<string, any> | null;
  computed_over?: Record<string, any> | null;
  hosted?: FicheiroAlojado | null;
  [outro: string]: unknown;
}

/** Uma reconferência da linha contra a fonte. */
interface VerificacaoDaLinha {
  date: string;
  path?: string | null;
  result: string;
  by?: string | null;
  note?: string | null;
  note_en?: string | null;
  [outro: string]: unknown;
}

/** Uma correção, atualização ou revisão de proveniência publicada sobre a linha. */
interface CorrecaoDaLinha {
  date: string;
  kind: string;
  old_value?: string | null;
  new_value?: string | null;
  reason?: string | null;
  reason_en?: string | null;
  fields?: string[] | null;
  [outro: string]: unknown;
}

/**
 * Uma linha do livro-razão, como o carregador a serve.
 *
 * `value` é sempre uma cadeia (as 2 916 de hoje são todas cadeias): o número
 * publicado guarda-se como a fonte o escreve e só se converte onde é preciso.
 */
interface Linha {
  id: string;
  value: string;
  unit: string | null;
  name?: string | null;
  name_source?: string | null;
  source: string | null;
  document: DocumentoDaLinha | null;
  source_url: string | null;
  access_date: string | null;
  published_at?: string | null;
  reference_date: string | null;
  excerpt: string | null;
  source_flag?: string | null;
  source_flag_note?: string | null;
  source_flag_note_en?: string | null;
  derivation: string | null;
  derivation_en?: string | null;
  derived_from: string[] | null;
  check: string | null;
  attributed_to?: string[] | null;
  study: string | null;
  note: string | null;
  corrections: CorrecaoDaLinha[] | null;
  verifications?: VerificacaoDaLinha[] | null;
  /** O caminho do ficheiro de onde a linha veio; posto pelo carregador. */
  __file?: string;
  [outro: string]: unknown;
}

/* ---------------------------------------------------------- os registos ---
 *
 * O que o motor escreve para cada edição que prova (`registos/<slug>/<lingua>.record.json`)
 * e o que o renderizador da página de leitura faz com ele. As formas foram
 * lidas dos ficheiros que atravessaram, não escritas de cabeça.
 */

/** Um algarismo do documento, agarrado à linha do motor que o bate. */
interface FiguraDoRegisto {
  start: number;
  end: number;
  printed: string;
  value: string;
  row: string;
  source_sha256?: string | null;
  source_digest_kind?: string | null;
}

/** Um intervalo de ênfase sobre o texto de uma unidade. */
interface EnfaseDoRegisto {
  start: number;
  end: number;
  kind: string;
}

/** Uma ligação do documento, sobre o texto de uma unidade. */
interface LigacaoDoRegisto {
  start: number;
  end: number;
  href: string;
}

/** Uma unidade de texto do registo: um parágrafo, um item, uma célula. */
interface UnidadeDoRegisto {
  text?: string | null;
  figures?: FiguraDoRegisto[] | null;
  emphasis?: EnfaseDoRegisto[] | null;
  links?: LigacaoDoRegisto[] | null;
  header?: boolean;
  [outro: string]: unknown;
}

/** Um bloco do registo. O género manda no que o bloco traz. */
type BlocoDoRegisto =
  | (UnidadeDoRegisto & { i: number; kind: 'heading'; level?: number })
  | (UnidadeDoRegisto & { i: number; kind: 'paragraph' })
  | (UnidadeDoRegisto & { i: number; kind: 'list'; ordered?: boolean; items: UnidadeDoRegisto[] })
  | (UnidadeDoRegisto & { i: number; kind: 'table'; rows: UnidadeDoRegisto[][] })
  | (UnidadeDoRegisto & { i: number; kind: 'rule' });

/** O registo de uma edição, como o exportador do motor o escreve. */
interface RegistoDeConteudo {
  blocks: BlocoDoRegisto[];
  title?: string;
  lang?: string;
  [outro: string]: unknown;
}

/** Uma saída que fica pendente até a ligação do documento fechar. */
interface SaidaPendenteDoRegisto {
  selo?: string;
  porta?: string;
}

/**
 * Um nó filho da partição única. A raiz nunca é filha de ninguém, e é por isso
 * que os dois tipos são distintos: quem escreve um intervalo sabe que tem um
 * dos três géneros, e não tem de contar com a raiz.
 */
type NoFilhoDoIntervalo =
  | {
      tipo: 'ligacao';
      inicio: number;
      fim: number;
      href: string;
      filhos: NoFilhoDoIntervalo[];
      saidasPendentes?: SaidaPendenteDoRegisto[];
    }
  | { tipo: 'enfase'; inicio: number; fim: number; kind: string; filhos: NoFilhoDoIntervalo[] }
  | {
      tipo: 'figura';
      inicio: number;
      fim: number;
      figura: FiguraDoRegisto;
      marca: string;
      filhos: NoFilhoDoIntervalo[];
    };

/** Um nó da partição única de uma unidade: a raiz, ou um dos três géneros. */
type NoDoIntervalo =
  | { tipo: 'raiz'; inicio: number; fim: number; filhos: NoFilhoDoIntervalo[] }
  | NoFilhoDoIntervalo;

/** Uma linha do documento, na tabela «As linhas deste documento». */
interface LinhaDoDocumento {
  row: string;
  valor: string;
  impressos: string[];
  origem: string | null;
  comResumo: boolean;
  siteId: string | null;
  figuras: number;
}

/** Um intervalo antes de entrar na árvore: o mesmo nó, ainda sem filhos. */
type IntervaloDaUnidade =
  | { tipo: 'ligacao'; inicio: number; fim: number; href: string }
  | { tipo: 'enfase'; inicio: number; fim: number; kind: string }
  | { tipo: 'figura'; inicio: number; fim: number; figura: FiguraDoRegisto; marca: string };

/** Uma peça do corpo transcrito: HTML seguido, ou o pedido de um selo. */
type PecaDoRegisto = { html: string } | { selo: string };

/** O que o renderizador do registo precisa de saber e não sabe sozinho. */
interface ContextoDoRegisto {
  linhaDoSitio: (row: string) => string | null;
  rotuloDaPorta: string;
  dentroDeLigacao: number;
  ligacaoAberta: NoDoIntervalo | null;
}

/* ------------------------------------------------------ a leitura do olho ---
 *
 * O que `src/lib/eyetext.mjs` lê de um HTML construído, na forma que o portão
 * compara com o registo. É o porte de `core/eyetext.py`.
 */

/** Um intervalo de elemento de linha, em posições de pedaço. */
interface IntervaloDoOlho {
  tag: string;
  href: string | null;
  inicio: number;
  fim: number;
}

/** Uma unidade lida do olho: os pedaços de texto e os intervalos de linha. */
interface UnidadeDoOlho {
  pedacos: string[];
  intervalos: IntervaloDoOlho[];
  header?: boolean;
}

/** Um bloco lido do olho. O género manda no que o bloco traz. */
type BlocoDoOlho =
  | { kind: 'heading'; level: number; unidade: UnidadeDoOlho }
  | { kind: 'paragraph'; unidade: UnidadeDoOlho }
  | { kind: 'rule' }
  | { kind: 'list'; ordered: boolean; items: UnidadeDoOlho[] }
  | { kind: 'table'; rows: UnidadeDoOlho[][] };

/* ------------------------------------------------------------- o mapa ------
 *
 * O que o motor escreve em `mapa/` (`publisher/mapa_distritos.py`). As formas
 * foram lidas dos artefactos, não escritas de cabeça.
 */

/** Uma caixa `[x, y, largura, altura]` no campo do mapa. */
type CaixaDoMapa = [number, number, number, number];

/** O campo onde os caminhos do mapa vivem. */
interface CampoDoMapa {
  largura: number;
  altura: number;
}

/** Uma unidade do mapa: um distrito, uma ilha, um concelho. */
interface UnidadeDoMapa {
  slug: string;
  nome: string;
  tipo?: string;
  parcela?: string;
  d: string;
  caixa: CaixaDoMapa;
  ponto: [number, number];
}

/** Uma moldura: a caixa de uma parcela, com a escala a que se desenha. */
interface MolduraDoMapa {
  nome: string;
  caixa: CaixaDoMapa;
  escala: number;
}

/** O país: o campo, as molduras e as 29 unidades. */
interface PaisDoMapa {
  campo: CampoDoMapa;
  molduras: MolduraDoMapa[];
  unidades: UnidadeDoMapa[];
}

/** Um distrito: a sua unidade, o seu campo local e os seus concelhos. */
interface DistritoDoMapa {
  unidade: UnidadeDoMapa;
  campo: CampoDoMapa;
  concelhos: UnidadeDoMapa[];
}

/* ------------------------------------------------------- o limiar do quadro ---
 *
 * O que o quadro europeu publica ao lado de uma medida: um teto, um chão, ou
 * uma banda com os dois lados. A declaração está em `src/data/figuras.mjs` e a
 * leitura numa função só, `ladosDoLimiar()`.
 */

/** Um dos lados de uma banda. */
interface LadoDoLimiar {
  nl: string;
  sinal?: string;
}

/** O limiar de uma medida do painel, como a nota da fonte o escreve. */
interface Limiar {
  nl?: string;
  sinal?: string;
  lado?: string;
  simbolo?: string;
  inferior?: LadoDoLimiar;
  superior?: LadoDoLimiar;
}

/* ------------------------------------------------------------- a prova ------
 *
 * Os números que o sítio diz sobre si próprio, cada um com a frase que o nomeia
 * e a porta que o abre. É `src/lib/prova.mjs`, e o portão reconta-os no `dist/`.
 */

/** Uma chave da prova: o valor, o nome do que se conta, e a porta. */
interface ChaveDaProva {
  valor: any;
  origem: string;
  porta: string;
  [outro: string]: any;
}

/** As contagens dos registos de conteúdo, recontadas dos ficheiros. */
interface ContagensDosRegistos {
  edicoes: number;
  blocos: number;
  algarismos: number;
  resolvidos: number;
  por_resolver: number;
  com_linha_do_sitio: number;
  com_resumo_de_origem: number;
  sem_resumo_de_origem: number;
  motivos: Record<string, number>;
}
