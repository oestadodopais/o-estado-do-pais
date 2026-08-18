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
      municipios: 'Municípios',
      estudos: 'Estudos',
      livro: 'Livro-razão',
      agenda: 'Agenda',
      metodo: 'Método',
      correcoes: 'Correções',
      sobre: 'Sobre',
      saltar: 'Saltar para o conteúdo',
      /* Os nomes das regiões de navegação. Uma região nomeia-se pelo que é,
         e não pela primeira ligação que tem dentro: as quatro diziam «Início»
         ou «English», e um leitor de ecrã que percorra as regiões de uma
         página ouvia o mesmo nome três vezes. */
      rotuloPrincipal: 'Navegação principal',
      rotuloRodape: 'Navegação do rodapé',
      rotuloIdioma: 'Idioma',
      rotuloErro: 'Por onde continuar',
    },

    /**
     * O sinal de tempo. Uma cadeia só, lida pelo cabeçalho de todas as
     * páginas e pela primeira página: duas frases para o mesmo facto seriam
     * duas frases de moldura, e divergiriam à primeira alteração.
     */
    sinal: {
      reconferido: 'Painel europeu reconferido a',
      vencido: 'Verificação em atraso: o painel europeu não é reconferido contra a fonte desde',
      agenda: 'Agenda:',
      agendaEmCurso: 'em curso',
      agendaASeguir: 'a seguir',
    },

    prov: {
      calculado: 'calculado',
      /* A palavra que o selo escreve, à vista (IDENTIDADE.md §5.4). Esteve
         escondida para leitores de ecrã até à v2, e um leitor com vista via só
         um título de estudo em cinzento. */
      selo: 'fonte',
      lido: 'Lido a',
      fonte: 'Fonte',
      documento: 'Documento',
      edicao: 'Edição',
      localizacao: 'Onde no documento',
      endereco: 'Endereço',
      excerto: 'Excerto',
      derivacao: 'Aritmética',
      unidade: 'Unidade',
      referencia: 'Dados de',
      atribuicao: 'Atribuído a',
      estudo: 'Estudo',
      afirmacao: 'Afirmação',
      naoPublicado: 'Valor calculado, não publicado',
      verLinha: 'Linha do livro-razão',
      /* Quando o endereço da linha é um ponto de acesso de dados e não um
         documento. Uma série não é um documento, um pedido não é um endereço
         de leitura, e o que a resposta traz é um campo — não uma frase que se
         possa citar. Ver DECISIONS §1.36, item 7. */
      serie: 'Série',
      pedido: 'Pedido',
      campoDevolvido: 'Campo devolvido',
      /* O rótulo da ligação quando o endereço fixa a página do PDF. */
      abrirNaPagina: 'Abrir o documento na página',
    },

    /**
     * O rodapé é navegação e mais nada desde 16.08.2026: a linha de autoria
     * passou para o Sobre, e a linha do domínio e a data de edição saíram
     * (§1.39). O que resta são os rótulos das duas contagens do arquivo, que
     * passaram do cabeçalho para a página dos estudos.
     */
    rodape: {
      estudos: 'trabalhos no arquivo',
      edicoes: 'edições',
    },

    /**
     * A porta das correções. Uma só, igual em todas as páginas.
     *
     * O texto é o que a página de Évora já dizia, palavra por palavra: foi
     * escrito para o sítio onde o leitor está mais perto de um erro, e é esse
     * o sítio onde tem de estar em todo o lado. Ver DECISIONS §1.36, item 1.
     */
    porta: {
      k: 'Encontrou um erro',
      v: 'Escreva para ',
      w: '. Um erro confirmado entra no registo de correções e na própria linha, com o valor antigo à vista. Nada é apagado.',
      link: 'O registo de correções',
    },

    /** A página que explica o marcador. IDENTIDADE §6 promete-a. */
    /**
     * A agenda e o calendário das fontes.
     *
     * As palavras que embrulham dois registos que vêm do motor. Nenhuma delas
     * escreve um estado, uma data ou uma contagem: isso vem do registo, e vai
     * marcado `data-agenda` para o portão o comparar carácter a carácter.
     */
    agenda: {
      metaTitle: 'Agenda · O Estado do País',
      metaDescription:
        'O que este observatório está a medir, o que se segue, e o critério que pôs lá cada coisa. Com o calendário do que as fontes publicam a seguir.',
      eyebrow: 'Agenda',
      h1: 'O que se mede a seguir',
      lede:
        'Cada item traz o critério que o pôs aqui, quem o propôs e quem o decidiu, ou diz o que ainda lhe falta; e traz o registo de cada mudança de estado. Nada sai desta lista em silêncio.',
      origemNota:
        'A lista e o calendário são dois registos do motor de investigação, publicados tal como atravessaram.',
      estados: {
        em_curso: 'Em curso',
        a_seguir: 'A seguir',
        concluido: 'Concluído',
        retirado: 'Retirado',
      },
      /* O quadro de estados (IDENTIDADE.md §7). Quatro colunas, uma por estado,
         cada uma com a sua contagem por `data-prova` e a âncora da sua secção
         por porta (§10). Uma coluna sem itens desenha-se na mesma. */
      quadroDeEstadosK: 'O que está em cada estado',
      semRegisto: 'sem registo',
      vazioRetirado:
        'Nada foi retirado desta agenda até hoje. Quando alguma coisa for, fica aqui, com a data e o motivo: um item não se apaga, muda de estado.',
      tipos: {
        estudo: 'Estudo',
        vigilancia: 'Vigilância',
        pagina: 'Página',
      },
      perguntaK: 'A pergunta',
      /* Duas frases, e a que sai depende do registo prévio. A primeira frase diz
         a regra, no plural e sobre os estudos; a segunda diz o estado DESTA. Uma
         frase que dissesse «a pergunta fica fixada» ao lado de um histórico que
         diz «não foi selado» punha a página a contradizer-se (revisão cruzada 2,
         R11), e «o português abaixo» apontava para cima (R12). */
      perguntaNotaSelada:
        'Nos estudos, a pergunta é selada no motor antes de a recolha começar. Esta está selada. O registo do motor escreve-se em inglês: o inglês é a forma registada, palavra por palavra, e o português acima é a edição portuguesa dessa mesma pergunta.',
      perguntaNotaPorSelar:
        'Nos estudos, a pergunta é selada no motor antes de a recolha começar. Esta está registada e ainda não selada: a direção não a leu. O registo do motor escreve-se em inglês: o inglês é a forma registada, palavra por palavra, e o português acima é a edição portuguesa dessa mesma pergunta.',
      porqueK: 'Porquê',
      criteriosK: 'Critérios',
      quadroK: 'Quadro institucional',
      limiarK: 'Limiar publicado pela Comissão:',
      eventoK: 'Calendário das fontes',
      leitorK: 'Pedido de leitor',
      correcaoK: 'Correção',
      semCriterios:
        'Sem critério de nenhum dos quatro tipos. Veio de uma decisão da direção sobre o que faltava ao sítio, e não de um quadro institucional, de um calendário, de um leitor ou de uma correção. A razão está escrita no porquê e no histórico.',
      verNoCalendario: 'Ver no calendário',
      /* Um tempo esgotado não prova que a fonte não publique calendário. O
         registo distingue as duas coisas e a página diz qual delas é. */
      semDataMotivos: {
        nao_publica: 'a fonte não publica data',
        nao_lida: 'a fonte não foi lida',
      },
      evidenciaK: 'O que se observou',
      propostoK: 'Proposto pelo motor a',
      decididoK: 'Decidido pela direção a',
      porDecidir: 'Sem decisão da direção registada',
      entradaK: 'Entrada no registo',
      alteracaoK: 'Última alteração',
      registoPrevioIniciado: 'Registo prévio iniciado a',
      registoPrevioSelado: 'Registo prévio selado a',
      registoPrevioPorSelar: 'por selar',
      documentosK: 'Documentos alojados',
      edicoesDoDocumento: { pt: 'edição portuguesa', en: 'edição inglesa' },
      historicoK: 'O que mudou',
      historicoTipos: {
        entrada: 'entrada',
        repriorizacao: 'repriorização',
        conclusao: 'conclusão',
        retirada: 'retirada',
        alteracao: 'alteração',
      },
      historicoPara: 'passa a',
      calendarioH2: 'O calendário das fontes',
      calendarioLede:
        'O que as fontes que este sítio cita publicam a seguir. Cada data traz o sítio onde está escrita, a data em que foi lida e a frase que a diz.',
      /* O eixo do tempo do calendário (IDENTIDADE.md §11). As janelas a amarelo,
         porque são marcas de medição; os dias que uma fonte publica como marcas
         no eixo; e a legenda a levar as portas, porque uma âncora dentro de um
         desenho não se lê como porta (§10). */
      eixoK: 'O calendário, no tempo',
      eixoLegendaK: 'Abrir cada acontecimento',
      datadosK: 'Com data publicada pela fonte',
      semDataK: 'Sem data, porque a fonte não publica nenhuma',
      fonteK: 'Fonte',
      janelaEntre: 'entre',
      janelaE: 'e',
      origemDaDataK: 'Onde está escrito',
      acedidoK: 'Lido a',
      afectaK: 'Linhas que isto move',
      notaK: 'Nota',
      voltarALista: 'Voltar à agenda',
    },

    marcador: {
      metaTitle: 'O marcador [a verificar] · O Estado do País',
      metaDescription:
        'O que quer dizer o marcador de incerteza deste sítio, porque existe, e o que acontece a uma linha que o traz.',
      eyebrow: 'O marcador',
      h1: 'O que quer dizer este marcador',
      lede: 'É o único marcador de incerteza deste sítio. Aparece onde um campo não foi confirmado contra a fonte.',
      queEK: 'O que é',
      queEV:
        'Uma ausência declarada. Não é um valor por defeito, não é uma estimativa, e não é uma dúvida sobre o número publicado: é o sítio a dizer que aquele campo (a fonte, o documento, o endereço, a data de leitura ou o excerto) ainda não foi conferido contra a origem.',
      porqueK: 'Porque existe',
      porqueV:
        'Porque a alternativa é preencher o campo com uma coisa plausível. Um campo plausível parece proveniência e não é, e quem o lesse ficava sem maneira de saber a diferença. O marcador torna a falta visível, contável e datável, e é por isso que aparece em vez de desaparecer.',
      linhaK: 'O que acontece a uma linha que o traz',
      linhaItens: [
        'o selo dessa linha desenha-se a tracejado, e não cheio;',
        'a página da linha diz, por palavras, que campos lhe faltam;',
        'a linha fica fora do índice dos motores de busca e fora do mapa do sítio, enquanto faltar;',
        'o valor publicado não muda por causa disto: o que falta é a prova documental, não o número.',
      ],
      voltaK: 'Como sai',
      voltaV:
        'Sozinho. No dia em que o campo for preenchido e conferido, o selo passa a cheio e a linha volta ao índice, sem mais ninguém decidir nada.',
      soUmK: 'Só há um',
      soUmV:
        'Não há um segundo marcador para dizer a mesma coisa por outras palavras. Um sítio com duas linguagens de incerteza tem, na prática, nenhuma.',
      livroLink: 'Ver as linhas que o trazem',
      metodoLink: 'Como isto é feito',
    },

    /** O índice dos concelhos. */
    municipios: {
      metaTitle: 'Municípios · O Estado do País',
      metaDescription:
        'Todos os concelhos de Portugal, pela Carta Administrativa Oficial. Os que já têm página do observatório levam a ela; os outros dizem que ainda não têm.',
      eyebrow: 'Municípios',
      h1: 'Os concelhos de Portugal',
      lede: 'Todos os concelhos, pela Carta Administrativa Oficial de Portugal.',
      contagemA: 'São ',
      contagemB: ' concelhos. Um tem página do observatório; os restantes ainda não têm, e esta lista di-lo em vez de os esconder.',
      semPagina: 'sem página ainda',
      comPagina: 'Abrir a página',
      naoDizK: 'O que este índice não diz',
      naoDizV:
        'Nada sobre o concelho. É uma lista de nomes e de estados: um concelho aparece aqui porque existe na Carta Administrativa, não porque este sítio tenha alguma coisa medida sobre ele.',
      fonteK: 'De onde vem a lista',
      mapaLink: 'O mapa dos concelhos',
    },

    /**
     * A primeira página não se explica antes de mostrar.
     *
     * Saíram, a 16.08.2026 (§1.39): a introdução (dizia por outras palavras o
     * que a linha de método do cabeçalho já diz, e a ideia passou a ter casa
     * no Sobre); a frase da mecânica (o sítio a descrever o próprio portão); e
     * a nota dos campos por confirmar (a página do marcador di-lo, e o selo a
     * tracejado mostra-o). O que sobra do subtítulo do painel é o que ele é.
     */
    home: {
      metaTitle: 'O Estado do País · Portugal, medido',
      metaDescription:
        'Observatório de dados sobre Portugal. Cada número publicado tem uma linha no livro-razão, com fonte, documento e data de acesso.',

      numeros: {
        eyebrow: 'O país em números verificados',
        h2: 'Medidas do painel europeu',
        sub: 'O painel de desequilíbrios macroeconómicos e o painel social europeu, com os limiares que as instituições publicam.',
        /* A linha do limiar de um cartão (IDENTIDADE.md §11). A palavra é
           derivada de dois números que já existem, e não é um número. */
        limiar: 'limiar',
        acima: 'acima',
        abaixo: 'abaixo',
        noLimiar: 'no limiar',
      },

      instr1: {
        eyebrow: 'Instrumento',
        h2: 'A régua da convergência',
        subPartes: [
          'PIB per capita em paridades de poder de compra, com a média da UE-27 fixada em ',
          { nl: '100', motivo: 'escala-de-instrumento' },
          '. Selecione regiões para as pôr na mesma régua.',
        ],
        glanceUnidade: 'Índice · UE-27 = 100',
        controlsLabel: 'Pôr na régua',
        todas: 'Todas as regiões',
        repor: 'Repor',
        svgTitulo: 'Régua de convergência: índice de PIB per capita em PPS, UE-27 = 100',
        svgDescricao:
          'Uma escala horizontal com a média da UE-27 marcada em 100. Cada região selecionada aparece como um marcador na régua, com o seu valor.',
        deepTitulo: 'Método, ressalvas e proveniência',
        dadosK: 'Os dados desta régua',
        dadosV:
          'Uma linha por região posta na régua: o valor tal como foi publicado, o ano a que se refere, a unidade, o estudo e o id da afirmação no livro-razão. O ficheiro é gerado do livro-razão a cada construção; não é uma cópia mantida à parte.',
        significadoK: 'O que o número quer dizer',
        significadoV:
          'O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27. Um valor abaixo da média significa menos poder de compra por pessoa; um valor acima, mais.',
        ressalvaK: 'Ressalva',
        ressalvaPartes: ['O valor de ', { ref: '2024' }, ' para Portugal é provisório.'],
        distanciasK: 'Distâncias',
        distanciasV:
          'As diferenças em pontos que a régua desenha são calculadas a partir dos valores publicados. São aritmética sobre esses valores, não valores publicados em si. Cada uma tem a sua própria linha no livro-razão, com a conta explicada.',
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
        legendaB: ' · ',
        legendaC: ' estudos aprofundados publicados (dois com edição em inglês). Os restantes ',
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
    },

    /** O Sobre: duas frases decididas e uma porta. Nada mais rende aqui. */
    sobre: {
      metaTitle: 'Sobre · O Estado do País',
      metaDescription:
        'O que é O Estado do País, em duas frases, e a porta para o método que as sustenta.',
      h1: 'Sobre',
    },

    metodo: {
      metaTitle: 'Método · O Estado do País',
      metaDescription:
        'As dez regras deste observatório, o mecanismo que impõe cada uma e os números que o provam nesta construção.',
      h1: 'Método',
      mecanismoK: 'Mecanismo',
      provaK: 'Prova',
      limiteK: 'O que isto não apanha',

      /** O instrumento: a cadeia desenhada, com os números de hoje. */
      instrumento: {
        svgTitulo: 'O mecanismo, das fontes ao leitor',
        svgDescricao:
          'Uma cadeia de seis passos, da esquerda para a direita: fontes, motor de investigação, livro-razão, construção do sítio, página e leitor. Três retornos entram na cadeia: a agenda alimenta o motor, a releitura alimenta o livro-razão, e a correção escrita pelo leitor volta ao livro-razão. Cada passo mostra os números desta construção.',
        fontes: 'FONTES',
        motor: 'MOTOR',
        livro: 'LIVRO-RAZÃO',
        construcao: 'CONSTRUÇÃO',
        pagina: 'PÁGINA',
        leitor: 'LEITOR',
        agenda: 'AGENDA',
        releitura: 'RELEITURA',
        correcoes: 'CORREÇÕES',
        capOrganismos: 'organismos',
        capAtravessadas: 'linhas atravessadas',
        capLinhas: 'linhas',
        capPorConfirmar: 'por confirmar',
        capContas: 'contas refeitas',
        capNoMapa: 'linhas no mapa do sítio',
        capItens: 'itens',
        capRegistadas: 'registadas',
        capReconferido: 'reconferido a',
        capEmAtraso: 'em atraso desde',
        capPublicadas: 'publicadas',
        capSemContagem: 'não é contado',
        semRegisto: 'sem registo',
        legendaK: 'Portas',
      },
    },

    /** A casa única da política das correções, e do registo. */
    correcoes: {
      metaTitle: 'Correções · O Estado do País',
      metaDescription:
        'A política de correções deste sítio e o registo de todas: o valor anterior à vista, datado, com o motivo, e nada apagado.',
      eyebrow: 'Correções',
      h1: 'O que foi corrigido, e o que mudou',
      lede: 'Corrigir em silêncio é a forma mais barata de mentir.',
      politicaK: 'A política',
      politicaV:
        'Uma entrada do registo guarda o valor anterior, o valor novo, a data, o motivo e a linha do livro-razão que mudou. Nada é removido: uma entrada corrigida acresce à história daquela linha, não a substitui. São três naturezas, e não se misturam:',
      naturezas: [
        { k: 'Correção.', v: 'O valor publicado estava errado. É uma confissão, e é a razão de o registo existir.' },
        { k: 'Atualização.', v: 'O valor estava certo e deixou de estar, porque aquilo que mede mudou. Não é um erro.' },
        { k: 'Revisão de proveniência.', v: 'O valor não mudou; mudou o caminho até à fonte, um endereço por exemplo. Não é erro nem atualização.' },
      ],
      enderecoA: 'Quem encontrar um erro escreve para ',
      enderecoB:
        '. Um erro confirmado entra no registo com crédito a quem o encontrou, se o desejar.',
      metodoLink: 'A regra, no Método',
      registoK: 'O registo',
      caixaTitulo: 'Escrever uma correção',

      registoCorrecoesK: 'Correções',
      registoCorrecoesNota:
        'Valores que estavam errados. Cada um fica com o valor anterior à vista, datado, e nenhum é removido.',
      registoConta: 'correções publicadas',
      registoContaSing: 'correção publicada',
      registoAtualizacoesK: 'Atualizações',
      registoAtualizacoesNota:
        'Valores que estavam certos e deixaram de estar, porque aquilo que medem mudou. Não são erros, e não contam para o número acima.',
      registoProvenienciaK: 'Revisões de proveniência',
      registoProvenienciaConta: 'revisões de proveniência',
      registoProvenienciaContaSing: 'revisão de proveniência',
      registoProvenienciaNota:
        'O valor não mudou; mudou a maneira de lá chegar: uma fonte que muda de endereço, por exemplo. Não são erros nem atualizações, e não se listam aqui uma a uma: são muitas de cada vez e afogariam as correções. Cada linha abaixo leva à sua própria história, onde a revisão está escrita por extenso.',
      correcoesVazioV: 'Nenhuma correção publicada até hoje.',
      colunaData: 'Data',
      colunaAntigo: 'Valor antigo',
      colunaNovo: 'Valor novo',
      colunaMotivo: 'Motivo',
      colunaAfirmacao: 'Afirmação',

      caixaNota:
        'Escreva aqui e o botão abre o seu programa de correio com o texto já dentro. Nada é enviado deste sítio: a mensagem sai de si, para si ficar com uma cópia.',
      caixaExemplo:
        'Que número ou frase está errado, em que página o encontrou, e o que deveria dizer. Se souber, deixe a fonte.',
      caixaBotao: 'Abrir no meu programa de correio',
      caixaVazia: 'Escreva primeiro o que está errado.',
      caixaComoFunciona:
        'Se o botão não abrir nada, o seu computador não tem programa de correio configurado. Nesse caso copie o endereço acima e escreva de onde costuma escrever.',
      caixaAssunto: 'Correção',
    },

    livro: {
      metaTitle: 'Livro-razão · O Estado do País',
      metaDescription:
        'Todas as afirmações publicadas neste sítio, uma linha cada: o valor tal como foi publicado, a fonte, o documento, o endereço, a data de acesso e o excerto.',
      eyebrow: 'Livro-razão',
      h1: 'O livro-razão',
      lede1:
        'Uma linha por número publicado. Cada linha guarda o valor tal como a fonte o publicou, quem o produziu, o documento e a edição, o endereço, a data em que o lemos e um excerto textual (e, quando o número é calculado por nós, a conta explicada e reavaliada a cada construção).',
      lede2:
        'O selo de proveniência junto a cada número é a porta para a sua linha. É este o índice dessas portas.',
      grupoCompletasK: 'Proveniência completa',
      grupoCompletasV:
        'Todos os campos preenchidos e conferidos contra a fonte. O selo é um quadrado cheio.',
      grupoPorConfirmarK: 'Com campos por confirmar',
      grupoPorConfirmarV:
        'Falta pelo menos um campo de proveniência. O campo fica marcado, e nenhum foi preenchido com um valor plausível. O selo é um quadrado a tracejado.',
      colunaValor: 'Valor',
      colunaAfirmacao: 'Afirmação',
      colunaSelo: 'Proveniência',
      seloK: 'Os dois estados do selo',
      seloCheio: 'Quadrado cheio: a proveniência está completa.',
      seloTracejado: 'Quadrado a tracejado: falta pelo menos um campo, e a linha di-lo.',
      marcadorK: 'O marcador',
      marcadorV:
        'É o único marcador de incerteza deste sítio. Aparece onde um campo não foi confirmado contra a fonte. Não é um valor por defeito nem uma estimativa: é a ausência declarada.',
      marcadorGloss: '',
      naoDizK: 'O que este índice não diz',
      naoDizV:
        'Só estão aqui os números que este sítio publica. Os números dentro dos documentos de estudo alojados aqui não estão no livro-razão: a proveniência deles é a do próprio documento, no dia em que foi publicado. O livro-razão também não é uma base de séries: guarda a leitura que citámos, não a série de onde ela saiu.',
      metodoLink: 'Como isto é feito',

      linha: {
        eyebrow: 'Linha do livro-razão',
        aparelhoK: 'Proveniência',
        excertoNota: 'Transcrito da fonte, palavra por palavra.',
        excertoPorConfirmar: 'O excerto textual desta linha ainda não foi transcrito da fonte.',
        excertoDerivada:
          'Esta linha não cita nenhuma frase: o valor é calculado a partir de outras linhas, e a prova documental é a delas.',
        excertoDaCasa:
          'Esta linha não cita nenhuma frase porque não há nenhuma para citar: o valor é uma contagem do próprio registo desta casa, e é reavaliado a cada construção do sítio. Nenhum documento externo o publica.',
        derivacaoNota: 'A conta, por palavras.',
        expressaoK: 'Reavaliada em cada construção',
        expressaoNota: 'A mesma conta como expressão.',
        derivaDeK: 'Deriva de',
        historicoK: 'Correções e atualizações desta linha',
        historicoVazio: 'Esta linha nunca foi corrigida nem atualizada.',
        /* A política das correções vive em `/correcoes`, e esta linha é a
           porta para lá. O parágrafo inteiro estava repetido em 264 páginas de
           linha, a dizer a política onde ela não se decide (BRIEF §6.3;
           DECISIONS §1.40). */
        historicoNota: 'Correções: públicas, datadas, permanentes',
        historicoNotaPorta: 'A política inteira',
        bandeiraK: 'Estado na fonte',
        /* A promessa de não ordenar partidos vive na regra 10 do Método e na
           página do município, e aqui fica o rótulo e a porta (DECISIONS §1.40). */
        atribuicaoNota: 'Como consta do documento.',
        incompletaK: 'O que falta nesta linha',
        incompletaV:
          'Os campos assinalados não foram confirmados contra a fonte. O valor publicado não muda por isso; o que falta é a prova documental, e enquanto faltar a linha fica fora do índice dos motores de busca.',
        completaK: 'Estado da proveniência',
        completaV: 'Completa.',
        marcadorLink: 'O que quer dizer este marcador',
        voltar: 'Voltar ao livro-razão',
        /* O recibo, v2 (IDENTIDADE.md §11). A frase de atribuição compõe-se
           dos campos que existem; os que não existem não deixam buraco nem
           palavra a mais. */
        provaK: 'Prova',
        publicadoPor: 'Publicado por',
        publicadoEm: 'em',
        publicadoPagina: 'p.',
        publicadoLido: 'lido a',
        verificacoesK: 'Verificações',
        reconferidoK: 'Reconferido a',
        releituraPorta: 'A regra da releitura',
      },
    },

    municipio: {
      eyebrow: 'Município',
      /* O título e a descrição do <head> não podem ter algarismos: o portão só
         tolera aí as cadeias que calcula do registo. Compõem-se com o nome do
         concelho, que não tem nenhum. */
      metaCauda: 'o município, medido · O Estado do País',
      metaDescricaoA: 'O que as fontes publicam sobre o município de ',
      metaDescricaoB:
        ': população, poder de compra, emprego, empresas, dívida e execução orçamental. Cada valor tem linha no livro-razão, com fonte, documento e data de acesso.',
      ledeA: 'Esta página mede o município de ',
      ledeB:
        ' e mostra de onde vem cada medida. Não interpreta: onde uma fonte não estabelece uma coisa, a página di-lo em vez de a supor.',

      relanceK: 'Relance',
      relanceSub:
        'Oito medidas. Seis vêm de organismos que publicam para todos os concelhos do país; duas só existem porque o próprio município as publica, e cada uma dessas di-lo na sua linha.',
      relanceVazio: 'Nenhuma fonte central publica esta medida para este concelho.',

      breveK: 'Leitura breve',
      breveSub: 'Uma frase por medida. Todos os números são citações do livro-razão.',

      distanciaK: 'A dívida contra o teto legal',
      distanciaLegenda:
        'A barra é a dívida total que o regulador publica para o concelho; o fio é o limite legal do mesmo ano. O índice mede uma contra o outro numa escala em que o teto é o valor permitido.',
      /* Pedaços de uma frase que o gabarito monta com as afirmações DESTE
         município. Nenhum id de afirmação se escreve aqui: isto é a língua,
         não os dados. */
      distanciaIndiceA: 'O índice é ',
      distanciaIndiceB: ' % em ',
      distanciaIndiceC: ', contra um teto legal de ',
      distanciaIndiceD: ' %.',
      distanciaLei:
        'O limite é fixado no artigo 52.º da Lei n.º 73/2013: uma vez e meia a média da receita corrente líquida dos três anos anteriores. É a lei que o define, não este sítio.',
      distanciaDivida: 'dívida',
      distanciaTecto: 'limite legal',

      fundoK: 'Fundo',

      contasK: 'A última prestação de contas do município',
      contasV:
        'O que o município orçamentou, o que cobrou, o que pagou, e o que dizia dever no fim do ano. São números do próprio município sobre si mesmo: a prestação de contas é dele.',
      contasOrcamento: 'Orçamento corrigido',
      contasReceita: 'Receita cobrada',
      contasDespesa: 'Despesa paga',
      contasDivida: 'Dívida total',
      contasLimite: 'Limite de dívida',
      contasMargem: 'Margem de endividamento',
      contasDivergenciaK: 'A diferença entre as duas contas da mesma dívida',
      contasDivergenciaV:
        'O regulador e o município publicam a dívida do mesmo ano com uma diferença. A diferença é pequena, e mostra-se porque é o único sítio onde uma voz de fora e a voz do próprio medem a mesma coisa.',
      contasDivergenciaRegulador: 'O regulador publica',
      contasDivergenciaMunicipio: 'O município publica',
      contasDivergenciaDiferenca: 'Diferença',

      tempoIndice: 'índice',
      contasDivergenciaArredondada: '· a diferença é publicada arredondada ao euro; os dois valores acima diferem em cêntimos.',
      /* A frase da camada 2 do instrumento. Só os anos que a página publica:
         dizer «todos os anos» seria dizer mais do que se mostra. */
      tempoSerieA: 'O índice de dívida do regulador desceu de ',
      tempoSerieB: ' % em ',
      tempoSerieC: ' para ',
      tempoSerieD: ' % em ',
      tempoSerieE: ', nos quatro anos que esta página publica.',
      tempoK: 'Quem administrou, e o que as contas registaram',
      /* A banda dos mandatos: o rótulo do desenho e o rótulo da legenda que
         leva as portas (IDENTIDADE.md §10). Os anos do eixo e os períodos são
         os que a página já publica; a banda não escreve nenhum número novo. */
      tempoBandaK: 'Mandatos, no tempo',
      tempoBandaLegendaK: 'Abrir cada mandato',
      tempoRelanceK: 'Índice de dívida, do primeiro ano legível ao último',
      tempoBreve:
        'Cinco administrações, contadas como foram instaladas e não como foram eleitas. As decisões vão atribuídas a quem as tomou, com o rótulo da lista que ganhou; os índices não vão atribuídos a ninguém.',
      tempoInstalado: 'instalado a',
      tempoLugares: 'Lugares',
      tempoHerdou: 'Herdou',
      tempoDecidiu: 'Decidiu',
      tempoDeixou: 'Deixou',
      tempoRegulador: 'O regulador',
      tempoPelouros: 'Pelouros',
      tempoExecutivo: 'Executivo instalado',
      tempoContas: 'Contas do penúltimo ano',
      tempoEmFuncoes: 'em funções',
      tempoExcessoK: 'O excesso sobre o teto legal',
      tempoExcessoV:
        'O que a dívida excedia o limite legal, no primeiro e no último ano em que o relatório o publica como um valor positivo. Depois disso o quadro passa a números negativos, que já não são excesso mas capacidade de endividamento, e por isso esta página para aqui.',
      tempoFundoK: 'Como esta linha do tempo é feita',
      tempoFundoPartes: [
        'Os períodos são os das administrações tal como foram instaladas, e as datas de instalação vêm do trabalho sobre os quinze anos. Cada valor tem linha no livro-razão. As duas dívidas herdadas em ',
        { ref: '2013' },
        ' aparecem as duas: a que foi reportada no fim do mandato e a que um relatório posterior reexpressou. Escolher uma em silêncio seria esconder que a diferença existe.',
      ],
      tempoAtribuicaoK: 'Quem responde pelo quê',
      tempoAtribuicaoV:
        'Uma administração responde pelas decisões que tomou. Não responde por um índice: nada do que foi lido permite separar a parte de um executivo na população, no emprego ou no poder de compra do concelho. Por isso as decisões levam nome e lista, e os índices não levam nenhum. Não há aqui nenhuma tabela classificativa de partidos, e não vai haver.',

      metodoK: 'Método e ressalvas',
      naoSabeK: 'O que esta página não sabe',
      provenienciaK: 'Proveniência',
      provenienciaV:
        'Cada valor desta página tem uma linha no livro-razão. O selo ao lado do número é a porta para essa linha, onde estão a fonte, o documento, o sítio exato de onde o valor foi lido, o excerto e o dia em que foi lido. Nenhuma data de leitura é escrita aqui: quem quiser sabê-la, abre a linha.',
      estudosK: 'Os trabalhos sobre este concelho',
      estudosV:
        'Cada um tem a sua página, com a medida que o faz valer a pena, a frase do que concluiu, o método e o documento original quando está alojado aqui.',
      estudoLink: 'Abrir a leitura',

      voltarMapa: 'Voltar ao mapa dos municípios',
    },

    estudos: {
      metaTitle: 'Estudos · O Estado do País',
      metaDescription: 'O arquivo de estudos publicados, com as suas edições em português e em inglês.',
      h1: 'Estudos',
      lede: 'O arquivo do observatório: cada estudo publicado, com as suas edições, datas e estado de migração. O que ainda não vive aqui está ligado onde vive.',
      aviso: 'Datas de publicação por confirmar.',
      descricaoRotulo: 'Descrição: reformulação do título',
      descricaoDoDocumentoRotulo: 'Descrição: frase de abertura do documento',
      descricaoTraduzidaRotulo: 'Descrição: tradução da casa da frase de abertura do documento',
      dataLabel: 'Publicação',
      lingua: 'Língua',
      verEstudo: 'Página do estudo',
      stubLede: 'Este estudo ainda não foi mudado para aqui.',
      stubExplicacao:
        'A migração dos estudos é a fase seguinte do trabalho. Até lá, esta página existe para fixar o endereço e nada mais: não há aqui um resumo, nem uma versão curta, nem números do estudo. Fingir conteúdo seria pior do que não ter nenhum.',
      stubEdicoes: 'Edições',
      stubVoltar: 'Voltar ao arquivo',
      stubEstado: 'Rascunho · sem conteúdo',
      stubForaK: 'Publicado fora deste sítio',
      stubForaV: 'Enquanto a migração não chega, este estudo está publicado noutro sítio. A ligação sai deste domínio.',
      stubForaLink: 'Abrir o estudo',

      /* Estudo com o documento já alojado aqui, mas com a página do
         observatório ainda por escrever. É um estado a sério, e diz-se. */
      migradoEstado: 'Documento alojado · página por escrever',
      migradoLede: 'O documento deste estudo já está alojado aqui. A página do observatório à volta dele ainda não foi escrita.',
      migradoExplicacao:
        'O que se lê no documento é o estudo tal como foi publicado: não foi reescrito, resumido nem atualizado para caber aqui. O que falta é a página do observatório: a leitura curta, os números do estudo ligados ao livro-razão e a proveniência de cada um. Fingir esse conteúdo seria pior do que não ter nenhum.',


      /* Trabalho com leitura do observatório escrita (src/data/leituras.mjs).
         É este o estado que levanta o noindex — ver DECISIONS §1.35. */
      leituraEstado: 'Leitura publicada',
      leituraRelanceK: 'Relance',
      leituraBreveK: 'Leitura breve',
      leituraBreveRotulo: 'Leitura breve · prosa da casa, assente numa frase do trabalho',
      leituraFundoK: 'Método e ressalvas',
      leituraOutraLingua: 'A mesma frase na outra edição',
      municipioK: 'O concelho de que trata',
      municipioLink: 'A página do município',

      documentoK: 'O documento original',
      documentoV: 'Alojado aqui na forma exata em que foi publicado, com uma faixa no topo e mais nada.',
      documentoVazio: 'O documento deste estudo ainda não foi alojado aqui.',
      documentoLink: 'Ler o documento',
      /* Vai dentro da faixa, no topo do documento. Sem algarismos: é regra do
         portão, e a razão dela está em src/lib/documentos.mjs. */
      documentoFaixa: 'Documento do estudo, tal como foi publicado',
      documentoVoltar: 'Voltar à página do estudo',

      edicaoIrma: 'Ver esta edição',
      atualizadoLabel: 'Última atualização',
      temaK: 'Tema',
      temaNenhum: 'Sem tema atribuído',
      descricoesK: 'Descrições',
      descarregarK: 'Descarregar',
      descarregarVazio: 'Sem ficheiros para descarregar.',
    },

    erro404: {
      metaTitle: 'Página não encontrada · O Estado do País',
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
      municipios: 'Municipalities',
      estudos: 'Studies',
      livro: 'Ledger',
      agenda: 'Agenda',
      metodo: 'Method',
      correcoes: 'Corrections',
      sobre: 'About',
      saltar: 'Skip to content',
      rotuloPrincipal: 'Main navigation',
      rotuloRodape: 'Footer navigation',
      rotuloIdioma: 'Language',
      rotuloErro: 'Where to continue',
    },

    sinal: {
      reconferido: 'European panel re-checked on',
      vencido:
        'Verification overdue: the European panel has not been re-checked against the source since',
      agenda: 'Agenda:',
      agendaEmCurso: 'under way',
      agendaASeguir: 'next',
    },

    prov: {
      calculado: 'calculated',
      selo: 'source',
      lido: 'Read on',
      fonte: 'Source',
      documento: 'Document',
      edicao: 'Edition',
      localizacao: 'Where in the document',
      endereco: 'Address',
      excerto: 'Excerpt',
      derivacao: 'Arithmetic',
      unidade: 'Unit',
      referencia: 'Data for',
      atribuicao: 'Attributed to',
      estudo: 'Study',
      afirmacao: 'Claim',
      naoPublicado: 'Calculated value, not published',
      verLinha: 'Ledger row',
      serie: 'Series',
      pedido: 'Request',
      campoDevolvido: 'Field returned',
      abrirNaPagina: 'Open the document at page',
    },

    rodape: {
      estudos: 'works in the archive',
      edicoes: 'editions',
    },

    porta: {
      k: 'Found an error',
      v: 'Write to ',
      w: '. A confirmed error enters the corrections log and the row itself, with the old value still visible. Nothing is deleted.',
      link: 'The corrections log',
    },

    agenda: {
      metaTitle: 'Agenda · O Estado do País',
      metaDescription:
        'What this observatory is measuring, what comes next, and the criterion that put each thing there. With the calendar of what the sources publish next.',
      eyebrow: 'Agenda',
      h1: 'What gets measured next',
      lede:
        'Each item carries the criterion that put it here, who proposed it and who decided it, or says what it still lacks; and it carries the record of every change of state. Nothing leaves this list in silence.',
      origemNota:
        'The list and the calendar are two records from the research engine, published exactly as they crossed.',
      estados: {
        em_curso: 'Under way',
        a_seguir: 'Next',
        concluido: 'Concluded',
        retirado: 'Withdrawn',
      },
      quadroDeEstadosK: 'What is in each state',
      semRegisto: 'no record',
      vazioRetirado:
        'Nothing has been withdrawn from this agenda to date. When something is, it stays here, with the date and the reason: an item is not deleted, it changes state.',
      tipos: {
        estudo: 'Study',
        vigilancia: 'Watch',
        pagina: 'Page',
      },
      perguntaK: 'The question',
      perguntaNotaSelada:
        'In studies, the question is sealed in the engine before collection begins. This one is sealed. The engine’s record is written in English: the English is the registered form, word for word, and the Portuguese edition renders that same question.',
      perguntaNotaPorSelar:
        'In studies, the question is sealed in the engine before collection begins. This one is registered and not yet sealed: the director has not read it. The engine’s record is written in English: the English is the registered form, word for word, and the Portuguese edition renders that same question.',
      porqueK: 'Why',
      criteriosK: 'Criteria',
      quadroK: 'Institutional framework',
      limiarK: 'Threshold published by the Commission:',
      eventoK: 'Source calendar',
      leitorK: 'Reader request',
      correcaoK: 'Correction',
      semCriterios:
        'No criterion of any of the four kinds. It came from a direction decision about what the site lacked, and not from an institutional framework, a calendar, a reader or a correction. The reason is written in the why and in the change log.',
      verNoCalendario: 'See in the calendar',
      semDataMotivos: {
        nao_publica: 'the source publishes no date',
        nao_lida: 'the source was not read',
      },
      evidenciaK: 'What was observed',
      propostoK: 'Proposed by the engine on',
      decididoK: 'Decided by the director on',
      porDecidir: 'No director decision on record',
      entradaK: 'Entered the record',
      alteracaoK: 'Last change',
      registoPrevioIniciado: 'Pre-registration started on',
      registoPrevioSelado: 'Pre-registration sealed on',
      registoPrevioPorSelar: 'not yet sealed',
      documentosK: 'Hosted documents',
      edicoesDoDocumento: { pt: 'Portuguese edition', en: 'English edition' },
      historicoK: 'What changed',
      historicoTipos: {
        entrada: 'entry',
        repriorizacao: 'repriorisation',
        conclusao: 'conclusion',
        retirada: 'withdrawal',
        alteracao: 'change',
      },
      historicoPara: 'moves to',
      calendarioH2: 'The source calendar',
      calendarioLede:
        'What the sources this site cites publish next. Each date carries the place where it is written, the date it was read, and the sentence that says it.',
      eixoK: 'The calendar, in time',
      eixoLegendaK: 'Open each event',
      datadosK: 'With a date the source publishes',
      semDataK: 'With no date, because the source publishes none',
      fonteK: 'Source',
      janelaEntre: 'between',
      janelaE: 'and',
      origemDaDataK: 'Where it is written',
      acedidoK: 'Read on',
      afectaK: 'Rows this moves',
      notaK: 'Note',
      voltarALista: 'Back to the agenda',
    },

    marcador: {
      metaTitle: 'The [a verificar] marker · O Estado do País',
      metaDescription:
        'What this site’s uncertainty marker means, why it exists, and what happens to a row that carries it.',
      eyebrow: 'The marker',
      h1: 'What this marker means',
      lede:
        'It is the only uncertainty marker on this site. It appears where a field has not been confirmed against the source. The marker is kept in Portuguese, as in the original; it reads “to verify”.',
      queEK: 'What it is',
      queEV:
        'A declared absence. It is not a default, not an estimate, and not a doubt about the published figure: it is the site saying that this field (the source, the document, the address, the read date or the excerpt) has not yet been checked against the origin.',
      porqueK: 'Why it exists',
      porqueV:
        'Because the alternative is to fill the field with something plausible. A plausible field looks like provenance and is not, and a reader would have no way of telling the difference. The marker makes the gap visible, countable and datable, which is why it appears instead of disappearing.',
      linhaK: 'What happens to a row that carries it',
      linhaItens: [
        'the seal for that row is drawn dashed, not filled;',
        'the row’s page says, in words, which fields are missing;',
        'the row stays out of search engine indexes and out of the sitemap while the gap lasts;',
        'the published value does not change because of it: what is missing is the documentary proof, not the figure.',
      ],
      voltaK: 'How it goes away',
      voltaV:
        'On its own. The day the field is filled in and checked, the seal turns solid and the row returns to the index, with nobody else deciding anything.',
      soUmK: 'There is only one',
      soUmV:
        'There is no second marker saying the same thing in other words. A site with two languages of uncertainty has, in practice, none.',
      livroLink: 'See the rows that carry it',
      metodoLink: 'How this is made',
    },

    municipios: {
      metaTitle: 'Municipalities · O Estado do País',
      metaDescription:
        'Every concelho in Portugal, from the official administrative map. Those that already have an observatory page link to it; the others say they do not yet.',
      eyebrow: 'Municipalities',
      h1: 'The concelhos of Portugal',
      lede: 'Every concelho, from the Carta Administrativa Oficial de Portugal.',
      contagemA: 'There are ',
      contagemB: ' concelhos. One has an observatory page; the rest do not yet, and this list says so rather than hiding them.',
      semPagina: 'no page yet',
      comPagina: 'Open the page',
      naoDizK: 'What this index does not say',
      naoDizV:
        'Anything about the concelho. It is a list of names and states: a concelho appears here because it exists in the official administrative map, not because this site has measured anything about it.',
      fonteK: 'Where the list comes from',
      mapaLink: 'The map of concelhos',
    },

    home: {
      metaTitle: 'O Estado do País · Portugal, measured',
      metaDescription:
        'A data observatory on Portugal. Every published figure has a row in the ledger, with source, document and access date.',

      numeros: {
        eyebrow: 'The country in verified figures',
        h2: 'Measures from the European scoreboard',
        sub: 'The macroeconomic imbalance scoreboard and the European social scoreboard, with the thresholds the institutions publish.',
        limiar: 'threshold',
        acima: 'above',
        abaixo: 'below',
        noLimiar: 'at threshold',
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
          'One row per region placed on the rule: the value exactly as published, the year it refers to, the unit, the study and the id of the ledger row. The file is generated from the ledger at every build; it is not a copy kept on the side.',
        significadoK: 'What the figure means',
        significadoV:
          'The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average. A value below the average means less purchasing power per person; a value above it, more.',
        ressalvaK: 'Caveat',
        ressalvaPartes: ['The ', { ref: '2024' }, ' value for Portugal is provisional.'],
        distanciasK: 'Distances',
        distanciasV:
          'The point differences the rule draws are calculated from the published values. They are arithmetic on those values, not published values themselves. Each has its own ledger row, with the sum spelled out.',
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
        legendaB: ' · ',
        legendaC: ' in-depth studies published (two with an English edition). The remaining ',
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
    },

    sobre: {
      metaTitle: 'About · O Estado do País',
      metaDescription:
        'What O Estado do País is, in two sentences, and the door to the method that holds them up.',
      h1: 'About',
    },

    metodo: {
      metaTitle: 'Method · O Estado do País',
      metaDescription:
        'The ten rules of this observatory, the mechanism that enforces each one and the figures that prove it in this build.',
      h1: 'Method',
      mecanismoK: 'Mechanism',
      provaK: 'Proof',
      limiteK: 'What this does not catch',

      instrumento: {
        svgTitulo: 'The mechanism, from the sources to the reader',
        svgDescricao:
          'A chain of six steps, left to right: sources, research engine, ledger, site build, page and reader. Three returns feed into the chain: the agenda feeds the engine, the re-reading feeds the ledger, and the correction written by the reader goes back into the ledger. Each step shows the figures for this build.',
        fontes: 'SOURCES',
        motor: 'ENGINE',
        livro: 'LEDGER',
        construcao: 'BUILD',
        pagina: 'PAGE',
        leitor: 'READER',
        agenda: 'AGENDA',
        releitura: 'RE-READING',
        correcoes: 'CORRECTIONS',
        capOrganismos: 'bodies',
        capAtravessadas: 'rows crossed',
        capLinhas: 'rows',
        capPorConfirmar: 'to confirm',
        capContas: 'arithmetic re-evaluated',
        capNoMapa: 'rows in the sitemap',
        capItens: 'items',
        capRegistadas: 'on record',
        capReconferido: 're-checked on',
        capEmAtraso: 'overdue since',
        capPublicadas: 'published',
        capSemContagem: 'not counted',
        semRegisto: 'no record',
        legendaK: 'Doors',
      },
    },

    correcoes: {
      metaTitle: 'Corrections · O Estado do País',
      metaDescription:
        'The corrections policy of this site and the register of them all: the previous value in plain sight, dated, with the reason, and nothing deleted.',
      eyebrow: 'Corrections',
      h1: 'What was corrected, and what changed',
      lede: 'Correcting in silence is the cheapest way of lying.',
      politicaK: 'The policy',
      politicaV:
        'An entry in the register holds the previous value, the new value, the date, the reason and the ledger row that changed. Nothing is removed: a corrected entry is added to that row’s history, it does not replace it. There are three kinds, and they are not mixed:',
      naturezas: [
        { k: 'Correction.', v: 'The published value was wrong. It is a confession, and it is the reason the register exists.' },
        { k: 'Update.', v: 'The value was right and stopped being so, because what it measures changed. It is not an error.' },
        { k: 'Provenance revision.', v: 'The value did not change; the route to the source did, an address for example. It is neither an error nor an update.' },
      ],
      enderecoA: 'Anyone who finds an error writes to ',
      enderecoB: '. A confirmed error enters the register with credit to whoever found it, if they wish.',
      metodoLink: 'The rule, in the Method',
      registoK: 'The register',
      caixaTitulo: 'Write a correction',

      registoCorrecoesK: 'Corrections',
      registoCorrecoesNota:
        'Values that were wrong. Each keeps its previous value in plain sight, dated, and none is removed.',
      registoConta: 'corrections published',
      registoContaSing: 'correction published',
      registoAtualizacoesK: 'Updates',
      registoAtualizacoesNota:
        'Values that were right and stopped being so, because what they measure changed. They are not errors, and they do not count towards the number above.',
      registoProvenienciaK: 'Provenance revisions',
      registoProvenienciaConta: 'provenance revisions',
      registoProvenienciaContaSing: 'provenance revision',
      registoProvenienciaNota:
        'The value did not change; the way to find it did: a source that moves address, for example. They are neither errors nor updates, and they are not listed one by one here: they come many at a time and would drown the corrections. Each row below leads to its own history, where the revision is written out in full.',
      correcoesVazioV: 'No corrections published to date.',
      colunaData: 'Date',
      colunaAntigo: 'Old value',
      colunaNovo: 'New value',
      colunaMotivo: 'Reason',
      colunaAfirmacao: 'Claim',

      caixaNota:
        'Write here and the button opens your own mail program with the text already in it. Nothing is sent from this site: the message leaves from you, so you keep a copy of it.',
      caixaExemplo:
        'Which figure or sentence is wrong, on which page you found it, and what it should say. If you know the source, leave it.',
      caixaBotao: 'Open in my mail program',
      caixaVazia: 'Write what is wrong first.',
      caixaComoFunciona:
        'If the button opens nothing, your computer has no mail program set up. In that case copy the address above and write from wherever you normally write.',
      caixaAssunto: 'Correction',
    },

    livro: {
      metaTitle: 'Ledger · O Estado do País',
      metaDescription:
        'Every claim published on this site, one row each: the value exactly as published, the source, the document, the address, the access date and the excerpt.',
      eyebrow: 'Ledger',
      h1: 'The ledger',
      lede1:
        'One row per published figure. Each row holds the value exactly as the source published it, who produced it, the document and edition, the address, the date we read it and a textual excerpt (and, when the figure is calculated by us, the sum spelled out and re-evaluated at every build).',
      lede2:
        'The provenance seal beside each figure is the door to its row. This is the index of those doors.',
      grupoCompletasK: 'Complete provenance',
      grupoCompletasV:
        'Every field filled in and checked against the source. The seal is a filled square.',
      grupoPorConfirmarK: 'With fields to confirm',
      grupoPorConfirmarV:
        'At least one provenance field is missing. The field is marked as such, and none has been filled in with a plausible value. The seal is a dashed square.',
      colunaValor: 'Value',
      colunaAfirmacao: 'Claim',
      colunaSelo: 'Provenance',
      seloK: 'The two states of the seal',
      seloCheio: 'Filled square: the provenance is complete.',
      seloTracejado: 'Dashed square: at least one field is missing, and the row says so.',
      marcadorK: 'The marker',
      marcadorV:
        'It is the only uncertainty marker on this site. It appears where a field has not been confirmed against the source. It is not a default or an estimate: it is a declared absence. The marker is kept in Portuguese, as in the original.',
      marcadorGloss: 'to verify',
      naoDizK: 'What this index does not say',
      naoDizV:
        'Only the figures this site publishes are here. The figures inside the study documents hosted here are not in the ledger: their provenance is the document’s own, on the day it was published. Nor is the ledger a database of series: it holds the reading we cited, not the series it came from.',
      metodoLink: 'How this is made',

      linha: {
        eyebrow: 'Ledger row',
        aparelhoK: 'Provenance',
        excertoNota: 'Transcribed from the source, word for word.',
        excertoPorConfirmar: 'The textual excerpt for this row has not been transcribed from the source yet.',
        excertoDerivada:
          'This row quotes no sentence: the value is calculated from other rows, and the documentary proof is theirs.',
        excertoDaCasa:
          'This row quotes no sentence because there is none to quote: the value is a count of this publication\'s own record, re-evaluated every time the site is built. No external document publishes it.',
        derivacaoNota: 'The sum, in words.',
        expressaoK: 'Re-evaluated at every build',
        expressaoNota: 'The same sum as an expression.',
        derivaDeK: 'Derived from',
        historicoK: 'Corrections and updates to this row',
        historicoVazio: 'This row has never been corrected or updated.',
        historicoNota: 'Corrections: public, dated, permanent',
        historicoNotaPorta: 'The whole policy',
        bandeiraK: 'Status at source',
        atribuicaoNota: 'As the document records it.',
        incompletaK: 'What is missing from this row',
        incompletaV:
          'The marked fields have not been confirmed against the source. The published value does not change because of it; what is missing is the documentary proof, and while it is missing the row stays out of search engine indexes.',
        completaK: 'Provenance',
        completaV: 'Complete.',
        marcadorLink: 'What this marker means',
        voltar: 'Back to the ledger',
        provaK: 'Proof',
        publicadoPor: 'Published by',
        publicadoEm: 'in',
        publicadoPagina: 'p.',
        publicadoLido: 'read on',
        verificacoesK: 'Verifications',
        reconferidoK: 'Re-checked on',
        releituraPorta: 'The re-reading rule',
      },
    },

    municipio: {
      eyebrow: 'Municipality',
      metaCauda: 'the municipality, measured · O Estado do País',
      metaDescricaoA: 'What the sources publish about the municipality of ',
      metaDescricaoB:
        ': population, purchasing power, employment, enterprises, debt and budget execution. Every value has a ledger row, with source, document and access date.',
      ledeA: 'This page measures the municipality of ',
      ledeB:
        ' and shows where each measure comes from. It does not interpret: where a source does not establish something, the page says so rather than assume it.',

      relanceK: 'At a glance',
      relanceSub:
        'Eight measures. Six come from bodies that publish for every concelho in the country; two exist only because the municipality itself publishes them, and each of those says so on its own line.',
      relanceVazio: 'No central source publishes this measure for this concelho.',

      breveK: 'Brief reading',
      breveSub: 'One sentence per measure. Every figure is a citation from the ledger.',

      distanciaK: 'The debt against the legal ceiling',
      distanciaLegenda:
        'The bar is the total debt the regulator publishes for the concelho; the rule is the legal limit for the same year. The index measures one against the other on a scale whose cap is the permitted value.',
      distanciaIndiceA: 'The index is ',
      distanciaIndiceB: ' % in ',
      distanciaIndiceC: ', against a legal cap of ',
      distanciaIndiceD: ' %.',
      distanciaLei:
        'The limit is set by article 52.º of Lei n.º 73/2013: one and a half times the three-year average of net current revenue. The law defines it, not this site.',
      distanciaDivida: 'debt',
      distanciaTecto: 'legal limit',

      fundoK: 'Background',

      contasK: 'The municipality’s latest accounts',
      contasV:
        'What the municipality budgeted, what it collected, what it paid, and what it said it owed at year end. These are the municipality’s own figures about itself: the accounts are its own.',
      contasOrcamento: 'Corrected budget',
      contasReceita: 'Revenue collected',
      contasDespesa: 'Expenditure paid',
      contasDivida: 'Total debt',
      contasLimite: 'Debt limit',
      contasMargem: 'Borrowing margin',
      contasDivergenciaK: 'The gap between the two accounts of the same debt',
      contasDivergenciaV:
        'The regulator and the municipality publish the same year’s debt with a difference between them. The difference is small, and it is shown because it is the only place where an outside voice and the municipality’s own voice measure the same thing.',
      contasDivergenciaRegulador: 'The regulator publishes',
      contasDivergenciaMunicipio: 'The municipality publishes',
      contasDivergenciaDiferenca: 'Difference',

      tempoIndice: 'index',
      contasDivergenciaArredondada: '· the difference is published rounded to the euro; the two figures above differ by cents.',
      tempoSerieA: 'The regulator’s debt index fell from ',
      tempoSerieB: ' % in ',
      tempoSerieC: ' to ',
      tempoSerieD: ' % in ',
      tempoSerieE: ', across the four years this page publishes.',
      tempoK: 'Who governed, and what the accounts recorded',
      tempoBandaK: 'Terms, in time',
      tempoBandaLegendaK: 'Open each term',
      tempoRelanceK: 'Debt index, from the first readable year to the last',
      tempoBreve:
        'Five administrations, counted as they were installed and not as they were elected. Decisions are attributed to whoever took them, with the label of the list that won; indices are attributed to nobody.',
      tempoInstalado: 'installed on',
      tempoLugares: 'Seats',
      tempoHerdou: 'Inherited',
      tempoDecidiu: 'Decided',
      tempoDeixou: 'Left',
      tempoRegulador: 'The regulator',
      tempoPelouros: 'Portfolios',
      tempoExecutivo: 'Executive installed',
      tempoContas: 'Accounts of the year before last',
      tempoEmFuncoes: 'in office',
      tempoExcessoK: 'The excess over the legal ceiling',
      tempoExcessoV:
        'How far the debt exceeded the legal limit, in the first and the last year in which the report publishes it as a positive figure. After that the table turns negative, and a negative there is no longer excess but borrowing capacity, so this page stops here.',
      tempoFundoK: 'How this timeline is made',
      tempoFundoPartes: [
        'The periods are those of the administrations as they were installed, and the installation dates come from the study of the fifteen years. Every value has a ledger row. The two debts inherited in ',
        { ref: '2013' },
        ' both appear: the one reported at the end of the term and the one a later report restated. Choosing one silently would hide that the difference exists.',
      ],
      tempoAtribuicaoK: 'Who answers for what',
      tempoAtribuicaoV:
        'An administration answers for the decisions it took. It does not answer for an index: nothing that was read allows an executive’s share of the concelho’s population, employment or purchasing power to be carved out. So decisions carry a name and a list, and indices carry neither. There is no party league table here, and there will not be one.',

      metodoK: 'Method and caveats',
      naoSabeK: 'What this page does not know',
      provenienciaK: 'Provenance',
      provenienciaV:
        'Every value on this page has a ledger row. The seal beside the figure is the door to that row, where the source, the document, the exact place the value was read from, the excerpt and the day it was read all live. No reading date is written here: whoever wants it opens the row.',
      estudosK: 'The works about this concelho',
      estudosV:
        'Each has its own page, with the measure that makes it worth reading, the sentence of what it concluded, the method, and the original document where it is hosted here.',
      estudoLink: 'Open the reading',

      voltarMapa: 'Back to the map of municipalities',
    },

    estudos: {
      metaTitle: 'Studies · O Estado do País',
      metaDescription: 'The archive of published studies, with their Portuguese and English editions.',
      h1: 'Studies',
      lede: 'The observatory’s archive: every published study, with its editions, dates and migration state. What does not live here yet is linked where it lives.',
      aviso: 'Publication dates not yet confirmed.',
      descricaoRotulo: 'Description: restatement of the title',
      descricaoDoDocumentoRotulo: 'Description: opening sentence of the document',
      descricaoTraduzidaRotulo: 'Description: house translation of the document’s opening sentence',
      dataLabel: 'Published',
      lingua: 'Language',
      verEstudo: 'Study page',
      stubLede: 'This study has not been moved here yet.',
      stubExplicacao:
        'Migrating the studies is the next phase of the work. Until then, this page exists to hold the address and nothing else: there is no summary here, no short version, no figures from the study. Faking content would be worse than having none.',
      stubEdicoes: 'Editions',
      stubVoltar: 'Back to the archive',
      stubEstado: 'Draft · no content',
      stubForaK: 'Published outside this site',
      stubForaV: 'Until the migration happens, this study is published elsewhere. The link leaves this domain.',
      stubForaLink: 'Open the study',

      migradoEstado: 'Document hosted · page not yet written',
      migradoLede: 'The document for this study is already hosted here. The observatory page around it has not been written yet.',
      migradoExplicacao:
        'What you read in the document is the study exactly as it was published: it has not been rewritten, shortened or updated to fit here. What is missing is the observatory page: the short reading, the study’s figures tied to the ledger and the provenance of each one. Faking that content would be worse than having none.',


      leituraEstado: 'Reading published',
      leituraRelanceK: 'At a glance',
      leituraBreveK: 'Brief reading',
      leituraBreveRotulo: 'Brief reading · house prose, resting on a sentence of the study',
      leituraFundoK: 'Method and caveats',
      leituraOutraLingua: 'The same sentence in the other edition',
      municipioK: 'The concelho it is about',
      municipioLink: 'The municipality page',

      documentoK: 'The original document',
      documentoV: 'Hosted here in the exact form in which it was published, with a banner at the top and nothing else.',
      documentoVazio: 'The document for this study has not been hosted here yet.',
      documentoLink: 'Read the document',
      documentoFaixa: 'Study document, exactly as published',
      documentoVoltar: 'Back to the study page',

      edicaoIrma: 'See this edition',
      atualizadoLabel: 'Last updated',
      temaK: 'Subject',
      temaNenhum: 'No subject assigned',
      descricoesK: 'Descriptions',
      descarregarK: 'Downloads',
      descarregarVazio: 'No files to download.',
    },

    erro404: {
      metaTitle: 'Page not found · O Estado do País',
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
