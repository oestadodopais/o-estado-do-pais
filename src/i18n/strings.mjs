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
        dadosK: 'Os dados desta régua',
        dadosV:
          'Uma linha por região posta na régua: o valor tal como foi publicado, o ano a que se refere, a unidade, o estudo e o id da afirmação no livro-razão. O ficheiro é gerado do livro-razão a cada construção — não é uma cópia mantida à parte.',
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
        dadosK: 'Os dados deste mapa',
        dadosV:
          'Uma linha por município: nome, distrito ou ilha, região e a posição normalizada que o mapa desenha. O cabeçalho traz a citação da CAOP e a data de acesso, tal como aparecem aqui.',
        fonteK: 'Coordenadas · fonte',
        processamentoK: 'Coordenadas · processamento',
        coberturaK: 'O que o mapa não diz',
        coberturaV:
          'O ponto aceso marca cobertura editorial, não qualidade nem importância. Os restantes pontos marcam a posição do município e mais nada.',
      },

      /* O rótulo é o mesmo nos dois instrumentos: a acção é a mesma, e um
         rótulo por instrumento seria duas coisas para manter e nenhuma razão. */
      dadosLink: 'descarregar os dados (CSV)',

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
      avisoTraducao: 'Tradução por rever.',
      correcoesVazioK: 'Registo de correções',
      registoCorrecoesK: 'Correções',
      registoCorrecoesNota:
        'Valores que estavam errados. Cada um fica com o valor anterior à vista, datado, e nenhum é removido.',
      registoConta: 'correções publicadas',
      registoContaSing: 'correção publicada',
      registoActualizacoesK: 'Atualizações',
      registoActualizacoesNota:
        'Valores que estavam certos e deixaram de estar, porque aquilo que medem mudou. Não são erros, e não contam para o número acima.',
      correcoesVazioV: 'Nenhuma correção publicada até hoje.',
      correcoesVazioNota:
        'Quando um valor for corrigido, a entrada aparece aqui e na própria linha do livro-razão: data, valor antigo, valor novo, motivo. Nada é apagado.',
      colunaData: 'Data',
      colunaAntigo: 'Valor antigo',
      colunaNovo: 'Valor novo',
      colunaMotivo: 'Motivo',
      colunaAfirmacao: 'Afirmação',
    },

    estudos: {
      metaTitle: 'Estudos — O Estado do País',
      metaDescription: 'O arquivo de estudos publicados, com as suas edições em português e em inglês.',
      h1: 'Estudos',
      lede: 'O arquivo do observatório: cada estudo publicado, com as suas edições, datas e estado de migração. O que ainda não vive aqui está ligado onde vive.',
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
      stubForaK: 'Publicado fora deste sítio',
      stubForaV: 'Enquanto a migração não chega, este estudo está publicado noutro sítio. A ligação sai deste domínio.',
      stubForaLink: 'Abrir o estudo',

      /* Estudo com o documento já alojado aqui, mas com a página do
         observatório ainda por escrever. É um estado a sério, e diz-se. */
      migradoEstado: 'Documento alojado — página por escrever',
      migradoLede: 'O documento deste estudo já está alojado aqui. A página do observatório à volta dele ainda não foi escrita.',
      migradoExplicacao:
        'O que se lê no documento é o estudo tal como foi publicado: não foi reescrito, resumido nem actualizado para caber aqui. O que falta é a página do observatório — a leitura curta, os números do estudo ligados ao livro-razão e a proveniência de cada um. Fingir esse conteúdo seria pior do que não ter nenhum.',

      documentoK: 'O documento original',
      documentoV:
        'Alojado aqui na forma exacta em que foi publicado. A única coisa que lhe foi acrescentada é uma faixa no topo, com a marca do observatório e o caminho de volta a esta página; os estilos, os gráficos e o texto do documento não foram tocados.',
      documentoVazio: 'O documento deste estudo ainda não foi alojado aqui.',
      documentoLink: 'Ler o documento',
      /* Vai dentro da faixa, no topo do documento. Sem algarismos: é regra do
         portão, e a razão dela está em src/lib/documentos.mjs. */
      documentoFaixa: 'Documento do estudo, tal como foi publicado',
      documentoVoltar: 'Voltar à página do estudo',

      edicaoIrma: 'Ver esta edição',
      actualizadoLabel: 'Última actualização',
      temaK: 'Tema',
      temaNenhum: 'Sem tema atribuído',
      descricoesK: 'Descrições',
      descricoesNota: 'As descrições são reformulações do título, não resumos do conteúdo, e aguardam o director.',
      descarregarK: 'Descarregar',
      descarregarVazio:
        'Este estudo ainda não tem ficheiros para descarregar. Quando tiver, aparecem aqui — com a mesma disciplina dos dados dos instrumentos: gerados da origem, com a proveniência no próprio ficheiro.',
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
        dadosK: 'The data behind this rule',
        dadosV:
          'One row per region placed on the rule: the value exactly as published, the year it refers to, the unit, the study and the id of the ledger row. The file is generated from the ledger at every build — it is not a copy kept on the side.',
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
        dadosK: 'The data behind this map',
        dadosV:
          'One row per municipality: name, district or island, region and the normalised position the map draws. The header carries the CAOP citation and the access date, exactly as they appear here.',
        fonteK: 'Coordinates · source',
        processamentoK: 'Coordinates · processing',
        coberturaK: 'What the map does not say',
        coberturaV:
          'The lit point marks editorial coverage, not quality or importance. The remaining points mark the position of the municipality and nothing else.',
      },

      dadosLink: 'download the data (CSV)',

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
      avisoTraducao: 'This is a translation of the Portuguese text and is awaiting the director’s review. The markers in square brackets are kept in Portuguese, as in the original, with an English gloss.',
      correcoesVazioK: 'Corrections log',
      registoCorrecoesK: 'Corrections',
      registoCorrecoesNota:
        'Values that were wrong. Each keeps its previous value in plain sight, dated, and none is removed.',
      registoConta: 'corrections published',
      registoContaSing: 'correction published',
      registoActualizacoesK: 'Updates',
      registoActualizacoesNota:
        'Values that were right and stopped being so, because what they measure changed. They are not errors, and they do not count towards the number above.',
      correcoesVazioV: 'No corrections published to date.',
      correcoesVazioNota:
        'When a value is corrected, the entry appears here and in the ledger row itself: date, old value, new value, reason. Nothing is deleted.',
      colunaData: 'Date',
      colunaAntigo: 'Old value',
      colunaNovo: 'New value',
      colunaMotivo: 'Reason',
      colunaAfirmacao: 'Claim',
    },

    estudos: {
      metaTitle: 'Studies — O Estado do País',
      metaDescription: 'The archive of published studies, with their Portuguese and English editions.',
      h1: 'Studies',
      lede: 'The observatory’s archive: every published study, with its editions, dates and migration state. What does not live here yet is linked where it lives.',
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
      stubForaK: 'Published outside this site',
      stubForaV: 'Until the migration happens, this study is published elsewhere. The link leaves this domain.',
      stubForaLink: 'Open the study',

      migradoEstado: 'Document hosted — page not yet written',
      migradoLede: 'The document for this study is already hosted here. The observatory page around it has not been written yet.',
      migradoExplicacao:
        'What you read in the document is the study exactly as it was published: it has not been rewritten, shortened or updated to fit here. What is missing is the observatory page — the short reading, the study’s figures tied to the ledger and the provenance of each one. Faking that content would be worse than having none.',

      documentoK: 'The original document',
      documentoV:
        'Hosted here in the exact form in which it was published. The only thing added to it is a slim banner at the top, with the observatory’s wordmark and the way back to this page; the document’s styles, graphics and text were not touched.',
      documentoVazio: 'The document for this study has not been hosted here yet.',
      documentoLink: 'Read the document',
      documentoFaixa: 'Study document, exactly as published',
      documentoVoltar: 'Back to the study page',

      edicaoIrma: 'See this edition',
      actualizadoLabel: 'Last updated',
      temaK: 'Subject',
      temaNenhum: 'No subject assigned',
      descricoesK: 'Descriptions',
      descricoesNota: 'The descriptions restate the title; they are not summaries of the content, and they await the director.',
      descarregarK: 'Downloads',
      descarregarVazio:
        'This study has no files to download yet. When it does, they appear here — under the same discipline as the instrument data: generated from the source, with the provenance inside the file itself.',
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
