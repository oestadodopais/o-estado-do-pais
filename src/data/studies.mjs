/**
 * Registo de estudos publicados.
 *
 * Um "trabalho" (work) é um estudo. Um trabalho pode ter mais do que uma
 * "edição" — a mesma investigação publicada em PT e em EN. O arquivo lista
 * edições (é o que o leitor procura); as rotas /estudos/<slug> são por trabalho.
 *
 * OS TÍTULOS SÃO LITERAIS. Não normalizar, não traduzir, não corrigir.
 * A edição EN de "Onde está a água?" e de "Água Não Faturada" existe, mas o
 * seu título em inglês não é conhecido aqui — fica o título original, com o
 * emblema EN. Inventar um título inglês seria inventar conteúdo.
 *
 * DATAS: nenhuma data de publicação está confirmada. Ficam todas por verificar.
 * `updated` é a data da última revisão de uma edição: `null` significa que não
 * se sabe, e a página mostra-o como tal. Não se escreve a data de publicação no
 * lugar dela — seriam duas afirmações diferentes com o mesmo valor por acaso.
 * DESCRIÇÕES: são reformulações do próprio título, sem números e sem factos
 * acrescentados. Carecem de aprovação do director. Ver DECISIONS.md.
 *
 * DOCUMENTOS: o documento original de um estudo não se declara aqui. Basta
 * pousá-lo em `studies-src/<slug>/pt.html` (ou `en.html`) e o endereço
 * `/estudos/<slug>/documento` passa a existir — ver src/lib/documentos.mjs.
 */

/**
 * O marcador único, importado e reexportado: uma definição só, em
 * `src/data/marcador.mjs` (IDENTIDADE §6; DECISIONS §1.40). Estava escrito aqui
 * e outra vez em `src/lib/ledger.mjs`.
 */
export { POR_VERIFICAR } from './marcador.mjs';
import { POR_VERIFICAR } from './marcador.mjs';

/**
 * Os temas dos trabalhos. O tema é o objecto do estudo, não uma etiqueta de
 * arrumação: é ele que reconcilia a contagem `estudos_evora_no_arquivo` com o
 * arquivo. Um trabalho sem tema atribuído fica com `subject: null`, e a página
 * di-lo por palavras em vez de inventar um.
 */
export const SUBJECTS = {
  evora: { pt: 'Évora', en: 'Évora' },
};

/** O nome legível de um tema, ou null quando não há tema atribuído. */
export function subjectLabel(subject, lang = 'pt') {
  if (!subject) return null;
  const s = SUBJECTS[subject];
  if (!s) throw new Error(`studies: tema desconhecido "${subject}". Acrescente-o a SUBJECTS.`);
  return s[lang] ?? s.pt;
}

export const WORKS = [
  {
    id: 'evora-quinze-anos-cinco-mandatos',
    slug: 'evora-quinze-anos-cinco-mandatos',
    subject: 'evora',
    /* Republicado a 2026-08-20 do motor: os excertos da ilha de recibos ganharam
       a janela que o extractor corrigido produz, e nenhum valor mexeu. A razão é
       de ponteiro, e a prova é o portão das edições do motor. DECISIONS §1.49. */
    editions: [
      { lang: 'pt', title: 'Évora — Quinze Anos, Cinco Mandatos', date: null, updated: '2026-08-20' },
    ],
    description: {
      pt: 'Quinze anos de governo municipal em Évora, ao longo de cinco mandatos.',
      en: 'Fifteen years of municipal government in Évora, across five terms.',
    },
  },
  {
    id: 'evora-economia-investidores-portas-abertas-2026',
    slug: 'evora-economia-investidores-portas-abertas-2026',
    subject: 'evora',
    editions: [
      { lang: 'pt', title: 'Évora — Economia, Investidores, Portas Abertas 2026', date: null, updated: null },
    ],
    description: {
      pt: 'Economia, investidores e portas abertas no município de Évora.',
      en: 'Economy, investors and open doors in the municipality of Évora.',
    },
  },
  {
    id: 'evora-orcamentado-pago-devido-2025',
    slug: 'evora-orcamentado-pago-devido-2025',
    subject: 'evora',
    /* Republicado a 2026-08-20 do motor, como o do 08 e pela mesma razão de
       ponteiro. DECISIONS §1.49. */
    editions: [
      { lang: 'pt', title: 'Évora — Orçamentado, Pago, Devido 2025', date: null, updated: '2026-08-20' },
      /* O TÍTULO É O NOME DO DOCUMENTO, e não a sua etiqueta `<title>`.
         Até 2026-08-20 as duas coisas coincidiam, porque o que estava alojado
         era o artefacto do claude.ai, cujo `<title>` o anfitrião punha a
         «Évora — Budgeted, Paid, Owed 2025». O que está alojado agora é o
         ficheiro do motor, e nele o `<title>` é o h1, «Évora — what was
         budgeted, what was paid, and what is owed». O nome mantém-se, que é o
         do próprio ficheiro do motor, e é a mesma convenção que as duas edições
         de «Prometido, Pago, Auditado» já seguiam desde 15.08.2026. Estava aqui
         sem o «Évora — », e um título literal não se abrevia (15.08.2026,
         revisão cruzada). */
      { lang: 'en', title: 'Évora — Budgeted, Paid, Owed 2025', date: null, updated: '2026-08-20' },
    ],
    description: {
      pt: 'O que foi orçamentado, o que foi pago e o que ficou em dívida no município de Évora.',
      en: 'What was budgeted, what was paid and what was left owing in the municipality of Évora.',
    },
  },
  {
    id: 'evora-os-pelouros-quem-os-teve-o-que-fizeram',
    slug: 'evora-os-pelouros-quem-os-teve-o-que-fizeram',
    subject: 'evora',
    editions: [
      {
        lang: 'pt',
        title: 'Évora — Os Pelouros, Quem Os Teve, O Que Fizeram',
        date: '2026-08-12',
        updated: null,
      },
    ],
    // Publicado fora deste sítio enquanto a migração não chega. O endereço vive
    // aqui, no registo, e não escrito à mão num gabarito.
    artifactUrl: 'https://claude.ai/code/artifact/fe9876aa-e778-4519-bc9a-5f2fa199b29a',
    /**
     * A DESCRIÇÃO É A FRASE DE ABERTURA, e desde 16.08.2026 é mesmo (§1.40).
     *
     * O que aqui estava era uma reformulação com o rótulo «frase de abertura do
     * documento» por cima: a página afirmava uma coisa sobre o documento que o
     * documento não dizia. O português passa a ser a frase, transcrita, e entra
     * por `src/data/verbatim.mjs`, onde o portão a compara com o ficheiro.
     *
     * O documento NÃO tem edição inglesa. O inglês é tradução da casa dessa
     * mesma frase, e a página rotula-o como tradução e não como a frase: um
     * rótulo que dissesse «frase de abertura» sobre uma tradução seria o mesmo
     * defeito com outra roupa.
     */
    descricaoDoDocumento: { pt: 'verbatim', en: 'traducao' },
    verbatimDaAbertura: { pt: 'estudo-pelouros-abertura-pt' },
    description: {
      pt: 'Quem teve cada pelouro da Câmara Municipal de Évora ao longo de cinco mandatos, quanto gastaram as contas do próprio município nas áreas que esses pelouros cobrem, e o que os relatórios dizem que essas áreas fizeram.',
      en: 'Who held each portfolio of the Câmara Municipal de Évora across five terms, how much the municipality’s own accounts spent in the areas those portfolios cover, and what the reports say those areas did.',
    },
  },
  {
    id: 'evora-prometido-pago-auditado-2026',
    slug: 'evora-prometido-pago-auditado-2026',
    subject: 'evora',
    /**
     * A DATA, e como foi encontrada. Este trabalho nunca passou por um
     * anfitrião de artefactos: foi produzido no motor de investigação
     * (ResearchHub) e atravessou de lá como ficheiro. A data de publicação de
     * uma edição é, por isso, a data do commit que escreveu esses bytes pela
     * última vez — `49758b4c16b483c92fe56b51eb88e6913dd42930`, de 2026-08-04,
     * o commit que acrescentou as conclusões assinadas nas duas línguas. Os
     * dois ficheiros HTML mudaram nesse mesmo commit e não voltaram a mudar,
     * por isso `updated` fica a null: não há revisão posterior a registar.
     */
    editions: [
      /* Republicadas a 2026-08-20 do motor, e a razão é SUBSTANTIVA e não de
         ponteiro: os números da página mudaram com o instantâneo do PRR, que
         passou de 2026-08-17 para 2026-08-19, e a frase de abertura passou a
         dizer que o registo do plano de recuperação foi relido a 2026-08-20.
         DECISIONS §1.49. */
      { lang: 'pt', title: 'Évora — Prometido, Pago, Auditado 2026', date: '2026-08-04', updated: '2026-08-20' },
      { lang: 'en', title: 'Évora — Promised, Paid, Audited 2026', date: '2026-08-04', updated: '2026-08-20' },
    ],
    // Nunca foi publicado fora deste sítio: não há endereço externo para dar.
    artifactUrl: null,
    /**
     * A frase de abertura, nas duas edições, transcrita (16.08.2026, §1.40).
     *
     * O que aqui estava dizia «do município de Évora» e o documento diz «de um
     * município português»; e faltava-lhe a data da recolha, que a frase traz.
     * A data é a razão de isto entrar por `verbatim.mjs` em vez de ser texto
     * corrido: um algarismo numa descrição precisa de origem, e a origem certa
     * de uma transcrição é a transcrição conferida.
     */
    descricaoDoDocumento: { pt: 'verbatim', en: 'verbatim' },
    verbatimDaAbertura: {
      pt: 'estudo-prometido-abertura-pt',
      en: 'estudo-prometido-abertura-en',
    },
    description: {
      pt: 'Uma leitura transversal de um município português: o registo de projetos do plano de recuperação, o registo de contratos públicos e o catálogo do tribunal de contas do Estado, recolhidos em direto a 2026-08-04, e o registo do plano de recuperação relido a 2026-08-20.',
      en: "A cross-vertical reading of one Portuguese municipality: the recovery-plan project register, the public-contracts register and the state auditor's catalogue, all fetched live on 2026-08-04, and the recovery-plan register read again on 2026-08-20.",
    },
  },
  {
    id: 'onde-esta-a-agua',
    slug: 'onde-esta-a-agua',
    // subject por preencher: o título não diz de que território trata. Se vier
    // a ser sobre Évora, a contagem estudos_evora_no_arquivo muda — e o build
    // avisa, porque a afirmação estudos-evora-publicados é verificada contra ela.
    subject: null,
    editions: [
      { lang: 'pt', title: 'Onde está a água?', date: null, updated: null },
      { lang: 'en', title: 'Onde está a água?', date: null, updated: null, titleUnverified: true },
    ],
    /* O título não determina o objecto do estudo. Não se escreve uma descrição
       a partir de nada — e a falta diz-se com o MARCADOR ÚNICO do sítio.
       Até 15.08.2026 estava aqui `[descrição em preparação]` / `[description
       pending]`: um segundo marcador, que IDENTIDADE §6 tinha retirado e que
       continuava a aparecer sete vezes em três páginas. Um sítio com duas
       linguagens de incerteza tem, na prática, nenhuma. */
    description: { pt: POR_VERIFICAR, en: POR_VERIFICAR },
  },
  {
    id: 'agua-nao-faturada',
    slug: 'agua-nao-faturada',
    editions: [
      { lang: 'pt', title: 'Água Não Faturada', date: null, updated: null },
      { lang: 'en', title: 'Água Não Faturada', date: null, updated: null, titleUnverified: true },
    ],
    description: {
      pt: 'Água não faturada nos sistemas de abastecimento em Portugal.',
      en: 'Non-revenue water in Portugal’s public supply systems.',
    },
  },
  {
    id: 'avaliacao-economica-regional-de-portugal-2026',
    slug: 'avaliacao-economica-regional-de-portugal-2026',
    editions: [
      { lang: 'pt', title: 'Avaliação Económica Regional de Portugal 2026', date: null, updated: null },
    ],
    description: {
      pt: 'Avaliação económica das regiões de Portugal.',
      en: 'Economic assessment of Portugal’s regions.',
    },
  },
  {
    id: 'which-door-is-yours',
    slug: 'which-door-is-yours',
    editions: [
      {
        lang: 'en',
        title: 'Which Door Is Yours — public funding in Portugal, August 2026',
        date: null,
        updated: null,
      },
    ],
    description: {
      pt: 'Financiamento público em Portugal.',
      en: 'Public funding in Portugal.',
    },
  },
  {
    id: 'alentejo-algarve',
    slug: 'alentejo-algarve',
    editions: [
      { lang: 'en', title: 'Alentejo & Algarve — Economy, Society, Strategy', date: null, updated: null },
    ],
    description: {
      pt: 'Economia, sociedade e estratégia no Alentejo e no Algarve.',
      en: 'Economy, society and strategy in the Alentejo and the Algarve.',
    },
  },
  {
    id: 'evolucao-de-portugal-desde-1981',
    slug: 'evolucao-de-portugal-desde-1981',
    editions: [{ lang: 'pt', title: 'Evolução de Portugal desde 1981', date: null, updated: null }],
    description: {
      pt: 'Séries longas sobre a evolução do país.',
      en: 'Long series on the country’s evolution.',
    },
  },
  {
    /* A data de publicação fica por decidir pela direção: o trabalho está
       construído e conferido, mas não foi publicado. `date: null` diz isso, e
       não se escreve nele a data em que o ficheiro entrou no repositório. */
    id: 'penalizacoes-por-reforma-antecipada-2026',
    slug: 'penalizacoes-por-reforma-antecipada-2026',
    editions: [
      {
        lang: 'pt',
        title: 'Penalizações por Reforma Antecipada em Portugal',
        date: null,
        updated: null,
      },
    ],
    description: {
      pt: 'O que a lei cobra por antecipar a reforma, e o que seria atuarialmente neutro.',
      en: 'What the law charges for retiring early, and what would be actuarially neutral.',
    },
  },
];

/**
 * Artefactos avaliados e deliberadamente NÃO incluídos no arquivo.
 *
 * Isto não é uma lista de coisas por fazer: é uma lista de decisões tomadas.
 * Existe aqui, ao lado do arquivo, e não só na documentação, porque é aqui que
 * quem fizer a migração dos estudos vai olhar. Um artefacto nesta lista já foi
 * ponderado — não se volta a ponderar por se ter esquecido a decisão.
 */
export const EXCLUIDOS = [
  {
    titulo: 'Three Seats, One Ledger',
    data: '2026-08-12',
    motivo:
      'Registo de método e de processo sobre a infraestrutura de investigação com IA do próprio dono. Não é um estudo sobre Portugal, e o arquivo é o que este observatório publica sobre Portugal. A exclusão não é um juízo sobre o valor do documento: é o arquivo ter um objeto, e este documento não ser dele.',
  },
];

/**
 * "Estudos" internos: não são publicações, são a origem de números que a
 * própria casa apura (contagens do arquivo, processamento da CAOP).
 * Existem para que o campo `study` do livro-razão nunca fique vazio nem mentiroso.
 * Não aparecem no arquivo.
 */
export const INTERNAL_SOURCES = [
  {
    id: 'o-estado-do-pais',
    label: { pt: 'O Estado do País, apuramento próprio', en: 'O Estado do País, own count' },
  },
  {
    // Não é um apuramento próprio: os números são dos organismos que os publicam.
    // É a linha de base — os indicadores que as instituições usam para avaliar um
    // país, lidos directamente na fonte. A proveniência de cada linha diz qual.
    // Escolha do conjunto: indicators/convergence.md no ResearchHub.
    id: 'quadro-institucional',
    label: {
      pt: 'Quadro institucional de indicadores, leitura direta da fonte',
      en: 'Institutional indicator framework, read directly from source',
    },
  },
];

/** Todas as edições, em lista plana — é isto que o arquivo mostra. */
export const EDITIONS = WORKS.flatMap((w) =>
  w.editions.map((e) => ({
    ...e,
    workId: w.id,
    slug: w.slug,
    description: w.description,
    /* O que a descrição é, por edição: a frase de abertura do documento
       transcrita, uma tradução da casa dessa frase, ou (por omissão) uma
       reformulação do título. O arquivo rotula-a como o que ela é, para que não
       seja lida como um resumo do conteúdo. */
    descricaoDoDocumento: w.descricaoDoDocumento ?? null,
    verbatimDaAbertura: w.verbatimDaAbertura ?? null,
  })),
);

/** Ids aceites no campo `study` de uma linha do livro-razão. */
export const STUDY_IDS = new Set([
  ...WORKS.map((w) => w.id),
  ...INTERNAL_SOURCES.map((s) => s.id),
]);

export function workById(id) {
  return WORKS.find((w) => w.id === id) ?? null;
}

/** Nome legível de um estudo, para a etiqueta de proveniência. */
export function studyLabel(id, lang = 'pt') {
  const w = workById(id);
  if (w) {
    const preferred = w.editions.find((e) => e.lang === lang) ?? w.editions[0];
    return preferred.title;
  }
  const internal = INTERNAL_SOURCES.find((s) => s.id === id);
  if (internal) return internal.label[lang] ?? internal.label.pt;
  return id;
}

/** Contagens usadas pelas expressões `check:` do livro-razão. */
export const COUNTS = {
  estudos_no_arquivo: WORKS.length,
  edicoes_no_arquivo: EDITIONS.length,
  /**
   * Trabalhos cujo objecto é o município de Évora. Trabalhos, não edições:
   * uma tradução não é um estudo novo. É esta a contagem que reconcilia a
   * afirmação estudos-evora-publicados com o arquivo.
   */
  estudos_evora_no_arquivo: WORKS.filter((w) => w.subject === 'evora').length,
};
