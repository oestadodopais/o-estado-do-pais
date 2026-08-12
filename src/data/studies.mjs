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

/** Marcador único para campos que não foram verificados. Nunca inventar um valor. */
export const POR_VERIFICAR = '[a verificar]';

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
    editions: [{ lang: 'pt', title: 'Évora — Quinze Anos, Cinco Mandatos', date: null, updated: null }],
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
    editions: [
      { lang: 'pt', title: 'Évora — Orçamentado, Pago, Devido 2025', date: null, updated: null },
      { lang: 'en', title: 'Budgeted, Paid, Owed 2025', date: null, updated: null },
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
    description: {
      pt: 'Quem teve cada pelouro da Câmara de Évora em cinco mandatos, ligado — por este documento, não por fonte oficial — ao que as contas gastaram nessas áreas.',
      en: 'Who held each portfolio on Évora’s council across five terms, mapped — by this document alone, not by any official source — against what the accounts spent in those areas.',
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
    // O título não determina o objecto do estudo. Não se escreve uma descrição a partir de nada.
    description: { pt: '[descrição em preparação]', en: '[description pending]' },
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
      'Registo de método e de processo sobre a infraestrutura de investigação com IA do próprio dono. Não é um estudo sobre Portugal, e o arquivo é o que este observatório publica sobre Portugal. A exclusão não é um juízo sobre o valor do documento: é o arquivo ter um objecto, e este documento não ser dele.',
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
    label: { pt: 'O Estado do País — apuramento próprio', en: 'O Estado do País — own count' },
  },
  {
    // Não é um apuramento próprio: os números são dos organismos que os publicam.
    // É a linha de base — os indicadores que as instituições usam para avaliar um
    // país, lidos directamente na fonte. A proveniência de cada linha diz qual.
    // Escolha do conjunto: indicators/convergence.md no ResearchHub.
    id: 'quadro-institucional',
    label: {
      pt: 'Quadro institucional de indicadores — leitura directa da fonte',
      en: 'Institutional indicator framework — read directly from source',
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
