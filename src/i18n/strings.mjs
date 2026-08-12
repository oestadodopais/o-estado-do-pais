/**
 * Gabaritos de texto, por língua.
 *
 * Uma só fonte de conteúdo: os dados vivem no livro-razão e em src/data/,
 * e aqui estão as palavras que os embrulham. As duas línguas partilham
 * exactamente as mesmas chaves — assertKeyParity() falha o build se
 * divergirem, para que nunca haja duas edições mantidas à mão.
 *
 * NÚMEROS NÃO SE ESCREVEM AQUI. Uma frase que precise de um número deixa o
 * buraco e o gabarito enche-o com <Claim id="…"/>.
 */

export const STRINGS = {
  pt: {
    lang: 'pt-PT',
    langNome: 'Português',
    outraLingua: 'English',
    outraLinguaCodigo: 'EN',

    nav: {
      inicio: 'Início',
      estudos: 'Estudos',
      metodo: 'Método',
      saltar: 'Saltar para o conteúdo',
    },

    prov: {
      calculado: 'calculado',
      porConfirmar: 'fonte por confirmar',
      lido: 'lido',
      fonte: 'Fonte',
      documento: 'Documento',
      excerto: 'Excerto',
      derivacao: 'Aritmética',
      unidade: 'Unidade',
      referencia: 'Dados de',
      naoPublicado: 'Valor calculado, não publicado',
    },

    rodape: {
      metodoTexto: 'Como isto é feito',
      edicao: 'Edição de',
      municipios: 'municípios',
      estudos: 'estudos',
      edicoes: 'edições',
      dominioNota: 'Domínio canónico',
    },

    home: {
      metaTitle: 'O Estado do País — Portugal, medido',
      metaDescription:
        'Observatório de dados sobre Portugal. Cada número publicado tem uma linha no livro-razão, com fonte, documento e data de acesso.',
      lede1:
        'Este é um observatório de dados sobre Portugal. Mede o país e mostra de onde vem cada medida.',
      lede2:
        'Nenhum número aparece aqui sem uma linha no livro-razão: valor tal como foi publicado, fonte, documento, data de acesso e, quando é calculado, a aritmética explicada. Um número sem essa linha não passa no build.',

      numeros: {
        eyebrow: 'O país em números verificados',
        h2: 'Cinco medidas, cinco fontes',
        sub: 'Cada valor abaixo está tal como foi publicado. A etiqueta diz de onde veio.',
        nota: 'Os campos por confirmar aparecem marcados. Nenhum foi preenchido com um valor plausível.',
      },

      instr1: {
        eyebrow: 'Instrumento',
        h2: 'A régua da convergência',
        subPartes: [
          'PIB per capita em paridades de poder de compra, com a média da UE-27 fixada em ',
          { nl: '100', motivo: 'escala-de-instrumento' },
          '. Seleccione regiões para as pôr na mesma régua.',
        ],
        glanceUnidade: 'Índice · UE-27 = 100',
        controlsLabel: 'Pôr na régua',
        todas: 'Todas as regiões',
        repor: 'Repor',
        svgTitulo: 'Régua de convergência: índice de PIB per capita em PPS, UE-27 = 100',
        svgDescricao:
          'Uma escala horizontal com a média da UE-27 marcada em 100. Cada região seleccionada aparece como um marcador na régua, com o seu valor.',
        deepTitulo: 'Método, ressalvas e proveniência',
        significadoK: 'O que o número quer dizer',
        significadoV:
          'O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27. Um valor abaixo da média significa menos poder de compra por pessoa; um valor acima, mais.',
        ressalvaK: 'Ressalva',
        ressalvaPartes: ['O valor de ', { ref: '2024' }, ' para Portugal é provisório.'],
        distanciasK: 'Distâncias',
        distanciasV:
          'As diferenças em pontos que a régua desenha são calculadas a partir dos valores publicados. São aritmética sobre esses valores, não valores publicados em si — e cada uma tem a sua própria linha no livro-razão, com a conta explicada.',
        provenienciaK: 'Proveniência',
        semJs:
          'Sem JavaScript, a régua mostra Portugal. Os comandos acrescentam regiões à mesma régua.',
      },

      instr2: {
        eyebrow: 'Instrumento',
        h2: 'O país em pontos',
        sub: 'Um ponto por município, na posição real do seu centróide. Sem fronteiras desenhadas: a forma do país é o que os dados fazem.',
        coberturaLabel: 'Municípios com estudo aprofundado publicado',
        legendaAceso: 'Município com estudo publicado',
        legendaApagado: 'Município sem estudo publicado',
        contagemK: 'Contagem verificada nos ficheiros',
        continente: 'Continente',
        acores: 'Açores',
        madeira: 'Madeira',
        total: 'Total',
        legendaA: 'Aceso: ',
        legendaB: ' — ',
        legendaC: ' estudos aprofundados publicados (um com edição em inglês). Os restantes ',
        legendaD: ' pontos marcam a posição do município; não representam cobertura.',
        readoutHint: 'Passe o cursor sobre um ponto para ler o município.',
        tecladoHint:
          'Teclado: Tab até ao mapa, setas para percorrer os municípios vizinhos, Home para voltar a Évora.',
        svgLabel:
          'Mapa de pontos dos municípios de Portugal. Use as setas para percorrer os municípios.',
        deepTitulo: 'Método, ressalvas e proveniência',
        fonteK: 'Coordenadas · fonte',
        processamentoK: 'Coordenadas · processamento',
        coberturaK: 'O que o mapa não diz',
        coberturaV:
          'O ponto aceso marca cobertura editorial, não qualidade nem importância. Os restantes pontos marcam a posição do município e mais nada.',
      },

      estaPagina: {
        eyebrow: 'Esta página',
        rede: 'Sem pedidos de rede',
        tipos:
          'Tipos: Iowan Old Style (marcas) · Avenir Next (prosa) · SF Mono (números e rótulos), com alternativas de sistema.',
      },
    },

    metodo: {
      metaTitle: 'Método — O Estado do País',
      metaDescription:
        'Quem faz este observatório, como se escreve, o que é o livro-razão, como se corrigem os erros e o que não se afirma sobre causas.',
      h1: 'Método',
      lede: 'Como este observatório é feito, e o que se pode e não se pode concluir do que aqui está.',
      emPreparacao: '[texto em preparação]',
      porEscrever: 'Por escrever',
      quemK: 'Quem faz isto',
      quemNota:
        'A secção sobre a divisão de trabalho entre a IA que escreve e a pessoa que dirige. Escrita pelo director.',
      comoK: 'Como se escreve',
      comoNota:
        'O processo: da pergunta à fonte, da fonte ao livro-razão, do livro-razão à página. Escrita pelo director.',
      livroK: 'O livro-razão',
      livroNota:
        'O que é uma linha do livro-razão, que campos leva, e porque é que uma página não constrói sem ela. Escrita pelo director.',
      livroFuncional:
        'O mecanismo já está a funcionar, e o texto que o explica ainda não está escrito. As duas coisas são independentes.',
      correcoesK: 'Correções',
      correcoesNota:
        'A política de correções. O registo abaixo está vazio e pronto a receber entradas datadas.',
      correcoesVazioK: 'Registo de correções',
      correcoesVazioV: 'Nenhuma correção publicada até hoje.',
      correcoesVazioNota:
        'Quando um valor for corrigido, a entrada aparece aqui e na própria linha do livro-razão: data, valor antigo, valor novo, motivo. Nada é apagado.',
      colunaData: 'Data',
      colunaAntigo: 'Valor antigo',
      colunaNovo: 'Valor novo',
      colunaMotivo: 'Motivo',
      colunaAfirmacao: 'Afirmação',
      causalK: 'Atribuição causal',
      causalNota:
        'O que este observatório afirma e não afirma sobre causas. Escrita pelo director.',
    },

    estudos: {
      metaTitle: 'Estudos — O Estado do País',
      metaDescription: 'O arquivo de estudos publicados, com as suas edições em português e em inglês.',
      h1: 'Estudos',
      lede: 'O que já foi publicado. Os estudos estão a ser mudados para aqui; por enquanto, cada entrada tem uma página de destino sem conteúdo.',
      aviso:
        'Datas de publicação e descrições ainda não foram confirmadas pelo director. As descrições são reformulações do título, não resumos do conteúdo.',
      dataLabel: 'Publicação',
      lingua: 'Língua',
      verEstudo: 'Página do estudo',
      stubLede: 'Este estudo ainda não foi mudado para aqui.',
      stubExplicacao:
        'A migração dos estudos é a fase seguinte do trabalho. Até lá, esta página existe para fixar o endereço e nada mais: não há aqui um resumo, nem uma versão curta, nem números do estudo. Fingir conteúdo seria pior do que não ter nenhum.',
      stubEdicoes: 'Edições',
      stubVoltar: 'Voltar ao arquivo',
      stubEstado: 'Rascunho — sem conteúdo',
    },

    erro404: {
      metaTitle: 'Página não encontrada — O Estado do País',
      metaDescription: 'Não existe nada neste endereço.',
      h1: 'Não existe nada neste endereço.',
      corpo:
        'A ligação pode estar errada, ou a página pode ter mudado de sítio enquanto os estudos são mudados para aqui.',
      inicio: 'Ir para o início',
      estudos: 'Ver os estudos',
      metodo: 'Ler o método',
    },
  },

  en: {
    lang: 'en',
    langNome: 'English',
    outraLingua: 'Português',
    outraLinguaCodigo: 'PT',

    nav: {
      inicio: 'Home',
      estudos: 'Studies',
      metodo: 'Method',
      saltar: 'Skip to content',
    },

    prov: {
      calculado: 'calculated',
      porConfirmar: 'source to confirm',
      lido: 'read',
      fonte: 'Source',
      documento: 'Document',
      excerto: 'Excerpt',
      derivacao: 'Arithmetic',
      unidade: 'Unit',
      referencia: 'Data for',
      naoPublicado: 'Calculated value, not published',
    },

    rodape: {
      metodoTexto: 'How this is made',
      edicao: 'Edition of',
      municipios: 'municipalities',
      estudos: 'studies',
      edicoes: 'editions',
      dominioNota: 'Canonical domain',
    },

    home: {
      metaTitle: 'O Estado do País — Portugal, measured',
      metaDescription:
        'A data observatory on Portugal. Every published figure has a row in the ledger, with source, document and access date.',
      lede1:
        'This is a data observatory on Portugal. It measures the country and shows where each measurement came from.',
      lede2:
        'No figure appears here without a row in the ledger: the value exactly as published, the source, the document, the access date and, when it is calculated, the arithmetic spelled out. A figure without that row fails the build.',

      numeros: {
        eyebrow: 'The country in verified figures',
        h2: 'Five measurements, five sources',
        sub: 'Every value below is exactly as published. The tag says where it came from.',
        nota: 'Fields still to be confirmed are marked as such. None has been filled in with a plausible value.',
      },

      instr1: {
        eyebrow: 'Instrument',
        h2: 'The convergence rule',
        subPartes: [
          'GDP per capita in purchasing power standards, with the EU-27 average fixed at ',
          { nl: '100', motivo: 'escala-de-instrumento' },
          '. Select regions to place them on the same rule.',
        ],
        glanceUnidade: 'Index · EU-27 = 100',
        controlsLabel: 'Place on the rule',
        todas: 'All regions',
        repor: 'Reset',
        svgTitulo: 'Convergence rule: GDP per capita index in PPS, EU-27 = 100',
        svgDescricao:
          'A horizontal scale with the EU-27 average marked at 100. Each selected region appears as a marker on the rule, with its value.',
        deepTitulo: 'Method, caveats and provenance',
        significadoK: 'What the figure means',
        significadoV:
          'The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average. A value below the average means less purchasing power per person; a value above it, more.',
        ressalvaK: 'Caveat',
        ressalvaPartes: ['The ', { ref: '2024' }, ' value for Portugal is provisional.'],
        distanciasK: 'Distances',
        distanciasV:
          'The point differences the rule draws are calculated from the published values. They are arithmetic on those values, not published values themselves — and each has its own ledger row, with the sum spelled out.',
        provenienciaK: 'Provenance',
        semJs:
          'Without JavaScript, the rule shows Portugal. The controls add regions to the same rule.',
      },

      instr2: {
        eyebrow: 'Instrument',
        h2: 'The country in points',
        sub: 'One point per municipality, at the real position of its centroid. No borders are drawn: the shape of the country is what the data makes.',
        coberturaLabel: 'Municipalities with a published in-depth study',
        legendaAceso: 'Municipality with a published study',
        legendaApagado: 'Municipality without a published study',
        contagemK: 'Count verified in the files',
        continente: 'Mainland',
        acores: 'Azores',
        madeira: 'Madeira',
        total: 'Total',
        legendaA: 'Lit: ',
        legendaB: ' — ',
        legendaC: ' in-depth studies published (one with an English edition). The remaining ',
        legendaD: ' points mark the position of the municipality; they do not represent coverage.',
        readoutHint: 'Hover over a point to read the municipality.',
        tecladoHint:
          'Keyboard: Tab to the map, arrow keys to move between neighbouring municipalities, Home to return to Évora.',
        svgLabel:
          'Point map of the municipalities of Portugal. Use the arrow keys to move between municipalities.',
        deepTitulo: 'Method, caveats and provenance',
        fonteK: 'Coordinates · source',
        processamentoK: 'Coordinates · processing',
        coberturaK: 'What the map does not say',
        coberturaV:
          'The lit point marks editorial coverage, not quality or importance. The remaining points mark the position of the municipality and nothing else.',
      },

      estaPagina: {
        eyebrow: 'This page',
        rede: 'No network requests',
        tipos:
          'Typefaces: Iowan Old Style (wordmarks) · Avenir Next (prose) · SF Mono (figures and labels), with system fallbacks.',
      },
    },

    metodo: {
      metaTitle: 'Method — O Estado do País',
      metaDescription:
        'Who makes this observatory, how it is written, what the ledger is, how errors are corrected and what is not claimed about causes.',
      h1: 'Method',
      lede: 'How this observatory is made, and what can and cannot be concluded from what is here.',
      emPreparacao: '[text in preparation]',
      porEscrever: 'Not yet written',
      quemK: 'Who makes this',
      quemNota:
        'The section on the division of labour between the AI that writes and the person who directs. Written by the director.',
      comoK: 'How it is written',
      comoNota:
        'The process: from question to source, from source to ledger, from ledger to page. Written by the director.',
      livroK: 'The ledger',
      livroNota:
        'What a ledger row is, which fields it carries, and why a page will not build without one. Written by the director.',
      livroFuncional:
        'The mechanism already works; the text explaining it is not written yet. The two are independent.',
      correcoesK: 'Corrections',
      correcoesNota:
        'The corrections policy. The log below is empty and ready to receive dated entries.',
      correcoesVazioK: 'Corrections log',
      correcoesVazioV: 'No corrections published to date.',
      correcoesVazioNota:
        'When a value is corrected, the entry appears here and in the ledger row itself: date, old value, new value, reason. Nothing is deleted.',
      colunaData: 'Date',
      colunaAntigo: 'Old value',
      colunaNovo: 'New value',
      colunaMotivo: 'Reason',
      colunaAfirmacao: 'Claim',
      causalK: 'Causal attribution',
      causalNota:
        'What this observatory does and does not claim about causes. Written by the director.',
    },

    estudos: {
      metaTitle: 'Studies — O Estado do País',
      metaDescription: 'The archive of published studies, with their Portuguese and English editions.',
      h1: 'Studies',
      lede: 'What has been published. The studies are being moved here; for now, each entry has a landing page with no content.',
      aviso:
        'Publication dates and descriptions have not yet been confirmed by the director. The descriptions restate the title; they are not summaries of the content.',
      dataLabel: 'Published',
      lingua: 'Language',
      verEstudo: 'Study page',
      stubLede: 'This study has not been moved here yet.',
      stubExplicacao:
        'Migrating the studies is the next phase of the work. Until then, this page exists to hold the address and nothing else: there is no summary here, no short version, no figures from the study. Faking content would be worse than having none.',
      stubEdicoes: 'Editions',
      stubVoltar: 'Back to the archive',
      stubEstado: 'Draft — no content',
    },

    erro404: {
      metaTitle: 'Page not found — O Estado do País',
      metaDescription: 'There is nothing at this address.',
      h1: 'There is nothing at this address.',
      corpo:
        'The link may be wrong, or the page may have moved while the studies are being brought over.',
      inicio: 'Go to the home page',
      estudos: 'See the studies',
      metodo: 'Read the method',
    },
  },
};

/** Todas as chaves, em profundidade, de um objecto de strings. */
function chaves(obj, prefixo = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const aqui = prefixo ? `${prefixo}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...chaves(v, aqui));
    else out.push(aqui);
  }
  return out.sort();
}

/**
 * Falha o build se as duas línguas divergirem. É esta função que impede
 * que a edição inglesa passe a ser mantida à mão.
 */
export function assertKeyParity() {
  const pt = chaves(STRINGS.pt);
  const en = chaves(STRINGS.en);
  const soPt = pt.filter((k) => !en.includes(k));
  const soEn = en.filter((k) => !pt.includes(k));
  if (soPt.length || soEn.length) {
    throw new Error(
      'i18n: as duas línguas não têm as mesmas chaves.\n' +
        (soPt.length ? `  só em pt: ${soPt.join(', ')}\n` : '') +
        (soEn.length ? `  só em en: ${soEn.join(', ')}\n` : ''),
    );
  }
  return true;
}

export function t(lang) {
  assertKeyParity();
  const s = STRINGS[lang];
  if (!s) throw new Error(`i18n: língua desconhecida "${lang}"`);
  return s;
}
