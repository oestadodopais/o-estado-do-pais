/**
 * Os tipos da casa.
 *
 * Ficheiro de declarações puro: não é importado por ninguém em tempo de
 * execução, não entra no pacote e não muda uma linha do que o sítio publica.
 * Existe para que o JSDoc dos módulos `.mjs` possa nomear as formas que já
 * circulam entre eles sem repetir a forma em cada `@param`.
 *
 * Não tem `import` nem `export` de topo de propósito: assim é um guião global e
 * os nomes daqui vêem-se em todos os ficheiros do programa. Os `import(...)` que
 * aparecem lá para baixo são moldes de tipo em posição de tipo, que não fazem
 * deste ficheiro um módulo nem carregam nada em execução.
 *
 * ---------------------------------------------------------------------------
 * OS TIPOS DERIVAM DAS AUTORIDADES, E NÃO AS COPIAM
 * ---------------------------------------------------------------------------
 * Segunda passagem de 03.09.2026 (leitura a frio do Codex, Major 17). A
 * primeira versão copiava à mão a lista dos 24 campos de `CAMPOS` e repetia o
 * conjunto das línguas: duas listas escritas duas vezes, que é exactamente o
 * modo de falhar que esta casa persegue no motor e no sítio. Agora `Lingua` sai
 * de `LANGS`, os campos de uma linha saem de `CAMPOS`, as chaves de rota saem de
 * `ROUTES`, as naturezas de uma correção saem de `KINDS`, e as afirmações de
 * compilação do fim deste ficheiro **fecham a construção** no dia em que uma
 * lista e a outra se afastarem.
 *
 * ---------------------------------------------------------------------------
 * UM TIPO NÃO É UMA VALIDAÇÃO
 * ---------------------------------------------------------------------------
 * Segunda passagem (Major 7 a 10). Estes tipos descrevem o que a casa espera;
 * quem os aplica a dados que vêm de fora (YAML, JSON) é um guarda de execução
 * que confere os campos e estreita o tipo: `eLinha()`, `eVerificacao()`,
 * `eCorrecao()` em `src/lib/ledger.mjs`, `eRegistoDeConteudo()` e
 * `eManifestoDosRegistos()` em `src/lib/registos.mjs`, `ePaisDoMapa()`,
 * `eDistritoDoMapa()` e `eManifestoDoMapa()` em `src/lib/mapa.mjs`. Não há um
 * único molde sobre dados por validar: onde a forma não se confere, o campo é
 * `unknown` e quem o lê estreita-o.
 */

/* ========================================================================== */
/* As autoridades                                                             */
/* ========================================================================== */

type _TabelaDeRotas = typeof import('./lib/routes.mjs').ROUTES;
type _TabelaDeLinguas = typeof import('./lib/routes.mjs').LANGS;
type _CamposDeUmaLinha = typeof import('./lib/ledger.mjs').CAMPOS;
type _CamposDeUmDocumento = typeof import('./lib/ledger.mjs').CAMPOS_DO_DOCUMENTO;
type _TiposDeDocumento = typeof import('./lib/ledger.mjs').TIPOS_DE_DOCUMENTO;
type _CamposDaVerificacao = typeof import('./lib/ledger.mjs').CAMPOS_DA_VERIFICACAO;
type _NaturezasDaCorrecao = typeof import('./data/correcoes.mjs').KINDS;
type _CamposDeProveniencia = typeof import('./data/correcoes.mjs').CAMPOS_DE_PROVENIENCIA;

/** As duas edições do sítio, lidas de `LANGS` em `src/lib/routes.mjs`. */
type Lingua = _TabelaDeLinguas[number];

/** As chaves da tabela de rotas, lidas de `ROUTES` em `src/lib/routes.mjs`. */
type ChaveDeRota = keyof _TabelaDeRotas;

/** Os campos de uma linha, lidos de `CAMPOS` em `src/lib/ledger.mjs`. */
type CampoDaLinha = _CamposDeUmaLinha[number];

/** As chaves do bloco `document`, lidas de `CAMPOS_DO_DOCUMENTO`. */
type CampoDoDocumento = _CamposDeUmDocumento[number];

/** As naturezas de uma entrada do registo, lidas de `KINDS`. */
type NaturezaDaCorrecao = _NaturezasDaCorrecao[number];

/** Os campos que uma revisão de proveniência pode nomear. */
type CampoDeProveniencia = _CamposDeProveniencia[number];

/** Um par de textos, um por edição. */
type ParDeLinguas = Record<Lingua, string>;

/**
 * Um pedaço de uma frase composta, na forma que `Frase.astro` lê (segunda
 * passagem, 03.09.2026, bloco F1.2). As sete formas são exactamente as que
 * aquele componente trata: texto corrido, um valor selado, um período, uma
 * palavra em negrito, um endereço de correio, um marcador de incerteza com a
 * sua glosa inglesa, ou um outro contexto estrutural declarado.
 */
type PedacoDeFrase =
  | string
  | { claim: string; sufixo?: string }
  | { ref: string }
  | { forte: string }
  | { email: string }
  | { marcador: string; gloss?: string }
  | { nl: string; motivo: string };

/** Uma frase composta, pronta para `<Frase partes={...} />`, nas duas edições. */
type FraseDasDuasLinguas = Record<Lingua, PedacoDeFrase[]>;

/**
 * O tipo dos valores de um objeto literal.
 *
 * Serve para ler uma tabela fechada por uma chave que vem de fora sem inventar
 * um `any`: o que sai é a união dos valores que a tabela de facto declara.
 */
type ValorDe<T> = T[keyof T];

/**
 * Uma tabela literal lida por uma chave que pode não existir.
 *
 * O `| undefined` é a parte verdadeira: uma chave que a tabela não tem devolve
 * `undefined`, e quem lê tem de o dizer antes de usar o valor.
 */
type TabelaAberta<T> = Record<string, ValorDe<T> | undefined>;

/* ========================================================================== */
/* O livro-razão                                                              */
/* ========================================================================== */

/** Uma extração de um ficheiro alojado: de que ficheiro veio, e com que resumo. */
interface ExtracaoDoArquivo {
  file: string;
  url: string;
  sha256: string;
  bytes: number;
  snapshot_date?: unknown;
  archived?: unknown;
}

/**
 * O ficheiro que esta casa aloja e sobre o qual a linha foi contada.
 *
 * Os campos são os de `CAMPOS_DO_ALOJADO`, e nenhum é de confiança antes de o
 * validador os ler: por isso os que ele confere um a um estão a `unknown` e não
 * ao tipo que se espera deles.
 */
interface FicheiroAlojado {
  asset: unknown;
  sha256: unknown;
  bytes: unknown;
  licence: unknown;
  licence_url: unknown;
  attribution: unknown;
  extracted_from: unknown;
}

/** O documento de onde a linha foi lida. Cada campo é conferido antes de valer. */
type DocumentoDaLinha = { [K in CampoDoDocumento]?: unknown };

/** Os géneros de documento que uma linha pode declarar. */
type TipoDeDocumento = _TiposDeDocumento[number];

/**
 * Uma reconferência da linha contra a fonte.
 *
 * `found` só existe numa entrada `diverge`, e é o valor como a fonte o imprimiu;
 * o validador recusa-o em qualquer outra. As quatro chaves obrigatórias saem de
 * `CAMPOS_DA_VERIFICACAO`, e a afirmação de compilação do fim do ficheiro fecha
 * a construção se a lista mudar sem esta forma mudar com ela.
 */
interface VerificacaoDaLinha {
  date: string;
  path: string | null;
  result: string;
  by: string;
  found?: string;
}

/**
 * Uma correção, atualização ou revisão de proveniência publicada sobre a linha.
 *
 * `field` é SINGULAR, e é o nome que o validador exige e lê numa entrada
 * `proveniencia` (leitura a frio, Major 9: a primeira versão declarava um
 * `fields` plural que ninguém escreve nem lê, e uma assinatura de índice aberta
 * escondia a diferença). Sem assinatura de índice: uma chave a mais numa
 * correção é um erro de tipo, como é um erro de construção.
 */
interface CorrecaoDaLinha {
  date: string;
  kind: NaturezaDaCorrecao;
  old_value?: string | null;
  new_value?: string | null;
  reason?: string | null;
  reason_en?: string | null;
  field?: CampoDeProveniencia;
}

/**
 * Uma linha do livro-razão, como o carregador a serve.
 *
 * As chaves são exactamente as de `CAMPOS` mais o `__file` que o carregador
 * acrescenta, e a afirmação de compilação do fim do ficheiro prova-o nos dois
 * sentidos. `value` é sempre uma cadeia (as 2 916 de hoje são todas cadeias): o
 * número publicado guarda-se como a fonte o escreve.
 *
 * O que o carregador GARANTE é o `id`: é a única coisa que ele confere, porque
 * é a chave do mapa. Tudo o resto é o que o ficheiro trouxer, e quem diz se está
 * certo é `validateLedger()`, uma linha de cada vez e com a frase do que falta.
 * É por isso que os campos que o validador ainda não leu são `unknown`.
 */
interface Linha {
  id: string;
  value: unknown;
  unit: unknown;
  name?: unknown;
  name_source?: unknown;
  source: unknown;
  document: unknown;
  source_url: unknown;
  access_date: unknown;
  published_at?: unknown;
  reference_date: unknown;
  excerpt: unknown;
  source_flag?: unknown;
  source_flag_note?: unknown;
  source_flag_note_en?: unknown;
  derivation: unknown;
  derivation_en?: unknown;
  derived_from: unknown;
  check: unknown;
  attributed_to?: unknown;
  study: unknown;
  note?: unknown;
  corrections: unknown;
  verifications?: unknown;
  /** O caminho do ficheiro de onde a linha veio; posto pelo carregador. */
  __file?: string;
}

/* ========================================================================== */
/* O limiar do quadro                                                         */
/* ========================================================================== */

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

/* ========================================================================== */
/* Os registos de conteúdo                                                    */
/* ========================================================================== */

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
  i?: number;
  kind?: string;
  level?: number;
}

/** Um bloco do registo. O género manda no que o bloco traz. */
type BlocoDoRegisto =
  | (UnidadeDoRegisto & { i: number; kind: 'heading'; level?: number })
  | (UnidadeDoRegisto & { i: number; kind: 'paragraph' })
  | (UnidadeDoRegisto & { i: number; kind: 'list'; ordered?: boolean; items: UnidadeDoRegisto[] })
  | (UnidadeDoRegisto & { i: number; kind: 'table'; rows: UnidadeDoRegisto[][] })
  | (UnidadeDoRegisto & { i: number; kind: 'rule' });

/**
 * O registo de uma edição, como o exportador do motor o escreve.
 *
 * Só `blocks` é conferido pelo guarda, porque só ele é lido por este sítio: os
 * outros campos que o ficheiro traz ficam `unknown` até alguém os ler e os
 * conferir.
 */
interface RegistoDeConteudo {
  blocks: BlocoDoRegisto[];
  title?: unknown;
  lang?: unknown;
  edition?: unknown;
  ledger?: unknown;
  prova?: unknown;
  schema?: unknown;
  source?: unknown;
}

/** O registo de travessia dos registos de conteúdo. */
interface ManifestoDosRegistos {
  exporter: string;
  origin: string;
  registos: Record<string, object>;
}

/* ========================================================================== */
/* O renderizador do registo                                                  */
/* ========================================================================== */

/**
 * Uma saída que fica pendente até a ligação do documento fechar: um selo OU uma
 * porta, nunca as duas nem nenhuma (leitura a frio, Major 15).
 */
type SaidaPendenteDoRegisto = { selo: string } | { porta: string };

/** O nó de uma ligação do documento na partição única. */
interface NoDeLigacao {
  tipo: 'ligacao';
  inicio: number;
  fim: number;
  href: string;
  filhos: NoFilhoDoIntervalo[];
  saidasPendentes?: SaidaPendenteDoRegisto[];
}

/**
 * Um nó filho da partição única. A raiz nunca é filha de ninguém, e é por isso
 * que os dois tipos são distintos: quem escreve um intervalo sabe que tem um dos
 * três géneros, e não tem de contar com a raiz.
 */
type NoFilhoDoIntervalo =
  | NoDeLigacao
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

/** Um intervalo antes de entrar na árvore: o mesmo nó, ainda sem filhos. */
type IntervaloDaUnidade =
  | { tipo: 'ligacao'; inicio: number; fim: number; href: string }
  | { tipo: 'enfase'; inicio: number; fim: number; kind: string }
  | { tipo: 'figura'; inicio: number; fim: number; figura: FiguraDoRegisto; marca: string };

/** Uma peça do corpo transcrito: HTML seguido, ou o pedido de um selo. */
type PecaDoRegisto = { html: string } | { selo: string };

/**
 * O que o renderizador do registo precisa de saber e não sabe sozinho.
 *
 * `ligacaoAberta` é um nó de LIGAÇÃO ou nada, e não um nó qualquer: é a forma da
 * invariante que o renderizador assume, escrita no tipo (leitura a frio,
 * Major 15).
 */
interface ContextoDoRegisto {
  linhaDoSitio: (row: string) => string | null;
  rotuloDaPorta: string;
  dentroDeLigacao: number;
  ligacaoAberta: NoDeLigacao | null;
}

/**
 * Uma peça do painel, como a primeira página e o cartão a compõem.
 *
 * São os três campos que `ledeDoPainel()` lê, e mais nenhum: quem constrói a
 * peça traz outros, e esta função não os toca.
 */
interface MedidaDoPainel {
  estado: string | null;
  nome: ParDeLinguas;
  linha?: Linha | null;
}

/** A gramática da frase do painel, lida do inventário da voz. */
type GramaticaDoLede = (typeof import('./i18n/strings.mjs').STRINGS)['pt']['inicio']['cabeca']['ledePais'];

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

/* ========================================================================== */
/* A leitura do olho                                                          */
/* ========================================================================== */

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

/* ========================================================================== */
/* O mapa                                                                     */
/* ========================================================================== */

/** Uma caixa `[x, y, largura, altura]` no campo do mapa. */
type CaixaDoMapa = [number, number, number, number];

/** O campo onde os caminhos do mapa vivem. */
interface CampoDoMapa {
  largura: number;
  altura: number;
}

/**
 * Uma unidade do mapa: um distrito, uma ilha, um concelho.
 *
 * `parcela` e `tipo` só existem nas 29 unidades do país; as 308 de um distrito
 * não os trazem, e é por isso que são opcionais. Quem precisa da parcela
 * pergunta-a com uma guarda, e não com um molde (leitura a frio, Major 13).
 */
interface UnidadeDoMapa {
  slug: string;
  nome: string;
  tipo?: string;
  parcela?: string;
  d: string;
  caixa: CaixaDoMapa;
  ponto: [number, number];
}

/** Uma unidade do país, que declara sempre a parcela a que pertence. */
type UnidadeComParcela = UnidadeDoMapa & { parcela: string };

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
  unidades: UnidadeComParcela[];
}

/**
 * A identidade de um distrito dentro do seu próprio ficheiro.
 *
 * NÃO É UMA `UnidadeDoMapa`, e a primeira versão deste ficheiro dizia que era:
 * o `unidade` de `mapa/distritos/<slug>.json` traz o slug, o nome e o tipo, e
 * mais nada. Medido nos 29 ficheiros a 03.09.2026: `slug` 29, `nome` 29, `tipo`
 * 29, e nem um `d`, nem uma `caixa`, nem um `ponto`. O tipo antigo prometia os
 * cinco e ninguém tinha olhado; foi o guarda de execução que o desmentiu na
 * primeira construção (segunda passagem, leitura a frio, Major 10).
 */
interface IdentidadeDoDistrito {
  slug: string;
  nome: string;
  tipo?: string;
}

/** Um distrito: a sua identidade, o seu campo local e os seus concelhos. */
interface DistritoDoMapa {
  unidade: IdentidadeDoDistrito;
  campo: CampoDoMapa;
  concelhos: UnidadeDoMapa[];
}

/** A menção da fonte que a licença da CAOP obriga, lida do manifesto. */
interface FonteDoMapa {
  atribuicao: string;
  licenca: string;
  carta: string;
}

/** O manifesto do mapa. Só o que este sítio lê é conferido e tipado. */
interface ManifestoDoMapa {
  fonte: FonteDoMapa;
}

/* ========================================================================== */
/* A agenda e o calendário                                                    */
/* ========================================================================== */

/**
 * Um item da agenda de decisões.
 *
 * As chaves são as que o ficheiro traz (medidas em `src/data/agenda.json`); as
 * que este programa lê estão tipadas, e as outras ficam `unknown` para que
 * ninguém as use sem primeiro dizer o que são.
 */
interface ItemDaAgenda {
  id: string;
  estado: string;
  titulo?: unknown;
  tipo?: unknown;
  pergunta?: unknown;
  porque?: unknown;
  entrada?: unknown;
  criterios?: unknown;
  historico?: unknown;
  vigilancia?: unknown;
  decidido_em?: unknown;
  decidido_por?: unknown;
  decidido_fonte?: unknown;
  proposto_em?: unknown;
  proposto_por?: unknown;
  proposto_fonte?: unknown;
  registo_previo?: unknown;
  registo_previo_em?: unknown;
  registo_previo_estado?: unknown;
  ultima_alteracao?: unknown;
}

/** O registo da agenda, tal como o motor o atravessa. */
interface RegistoDaAgenda {
  itens: ItemDaAgenda[];
  formato?: unknown;
  _origem?: unknown;
}

/** Um acontecimento do calendário das fontes. */
interface EventoDoCalendario {
  id: string;
  data?: string | null;
  janela?: { inicio?: string | null; fim?: string | null } | null;
  marcador?: unknown;
  titulo?: unknown;
  fonte?: unknown;
  serie?: unknown;
  nota?: unknown;
  precisao?: unknown;
  vigilancia?: unknown;
  afecta_linhas?: unknown;
  origem_da_data?: unknown;
  motivo_sem_data?: unknown;
  evidencia_indireta?: unknown;
}

/** O registo do calendário das fontes. */
interface RegistoDoCalendario {
  eventos: EventoDoCalendario[];
  formato?: unknown;
  gerado_por?: unknown;
  _origem?: unknown;
}

/* ========================================================================== */
/* A prova                                                                    */
/* ========================================================================== */

/**
 * Uma chave da prova: o valor, o nome do que se conta, e a porta.
 *
 * Os três campos do fim são de três chaves que dizem mais do que um número:
 * quantos manifestos de travessia, se o carimbo está vencido, e há quantos
 * dias. Estão declarados um a um, e não por uma assinatura de índice aberta,
 * para que uma chave nova não entre em silêncio.
 */
interface ChaveDaProva {
  valor: string | number | null;
  origem: string;
  porta: string;
  detalhe?: Record<string, number>;
  manifestos?: number;
  vencida?: boolean;
  dias?: number | null;
}

/* ========================================================================== */
/* As afirmações de compilação                                                */
/* ========================================================================== */

/**
 * Falha a compilação quando `T` não é `true`.
 *
 * É assim que uma lista escrita em dois sítios deixa de poder afastar-se em
 * silêncio: a afirmação é conferida quando o programa compila, e o `typecheck`
 * fica vermelho no mesmo instante em que as duas listas discordam.
 */
type Verdadeiro<T extends true> = T;

/** `true` quando `A` não tem nada que `B` não tenha. */
type SemSobras<A, B> = [Exclude<A, B>] extends [never] ? true : false;

/*
 * AS AFIRMAÇÕES QUE USAM ISTO NÃO VIVEM AQUI, E A RAZÃO É MEDIDA.
 *
 * O `skipLibCheck` que a base do Astro liga faz o verificador SALTAR o corpo de
 * qualquer `.d.ts`: uma afirmação escrita neste ficheiro nunca é conferida, e
 * uma afirmação que nunca corre é uma promessa com cara de portão. Medido a
 * 03.09.2026: com `skipLibCheck: false` o programa levanta 57 erros, todos
 * dentro de `node_modules` (28 só em
 * `astro/dist/core/config/schemas/relative.d.ts`), que é código de terceiros que
 * esta casa não conserta.
 *
 * Por isso as afirmações vivem em `src/lib/ledger.mjs`, ao lado de `CAMPOS`,
 * que é um ficheiro que o portão confere mesmo. A planta que o prova está no
 * relatório do bloco.
 */
