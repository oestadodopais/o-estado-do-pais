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
      livro: 'Livro-razão',
      metodo: 'Método',
      saltar: 'Saltar para o conteúdo',
    },

    prov: {
      calculado: 'calculado',
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
        h2: 'Medidas do painel europeu',
        sub: 'Estes indicadores não são escolha nossa. São os do painel de desequilíbrios macroeconómicos e do painel social europeu — o conjunto com que as instituições avaliam um Estado-Membro, com os limiares que elas próprias publicam. Cada valor está tal como foi publicado, e a etiqueta diz de onde veio.',
        nota: 'Os campos por confirmar aparecem marcados. Nenhum foi preenchido com um valor plausível.',
        verificacaoEm: 'Linha de base reconferida contra a fonte a',
        verificacaoVencida: 'Verificação em atraso: estes valores não são reconferidos contra a fonte desde',
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
      livroLink: 'Ver o livro-razão',

      caixaTitulo: 'Escrever uma correção',
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
      metaTitle: 'Livro-razão — O Estado do País',
      metaDescription:
        'Todas as afirmações publicadas neste sítio, uma linha cada: o valor tal como foi publicado, a fonte, o documento, o endereço, a data de acesso e o excerto.',
      eyebrow: 'Livro-razão',
      h1: 'O livro-razão',
      lede1:
        'Uma linha por número publicado. Cada linha guarda o valor tal como a fonte o publicou, quem o produziu, o documento e a edição, o endereço, a data em que o lemos e um excerto textual — e, quando o número é calculado por nós, a conta explicada e reavaliada a cada construção.',
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
        'Só estão aqui os números que este sítio publica. Os números dentro dos documentos de estudo alojados aqui não estão no livro-razão — a proveniência deles é a do próprio documento, no dia em que foi publicado. O livro-razão também não é uma base de séries: guarda a leitura que citámos, não a série de onde ela saiu.',
      metodoLink: 'Como isto é feito',

      linha: {
        eyebrow: 'Linha do livro-razão',
        aparelhoK: 'Proveniência',
        excertoNota:
          'Transcrito da fonte palavra por palavra. A construção do sítio falha se o texto desta página deixar de ser igual, carácter a carácter, ao que está guardado na linha.',
        excertoPorConfirmar:
          'O excerto textual desta linha ainda não foi transcrito da fonte. Escrever aqui uma paráfrase plausível seria exactamente a fabricação que este sistema existe para impedir.',
        excertoDerivada:
          'Esta linha não cita nenhuma frase: o valor é calculado a partir de outras linhas, e a prova documental é a delas.',
        excertoDaCasa:
          'Esta linha não cita nenhuma frase porque não há nenhuma para citar: o valor é uma contagem do próprio registo desta casa, e é reavaliado a cada construção do sítio. Nenhum documento externo o publica.',
        derivacaoNota: 'A conta, por palavras.',
        expressaoK: 'Reavaliada na construção',
        expressaoNota:
          'A mesma conta como expressão. É refeita a cada construção do sítio e tem de dar exactamente o valor publicado; se não der, não se constrói nada.',
        derivaDeK: 'Deriva de',
        historicoK: 'Correções e atualizações desta linha',
        historicoVazio: 'Esta linha nunca foi corrigida nem actualizada.',
        historicoNota:
          'Nada é apagado. Um valor que estava errado fica à vista, datado, com o motivo — e um valor que deixou de estar certo porque o que mede mudou fica registado como atualização, que não é a mesma coisa.',
        bandeiraK: 'Estado na fonte',
        atribuicaoNota:
          'A quem o valor é creditado, tal como consta do documento. Quando aparece um rótulo partidário, é registo do que consta e mais nada: este sítio não ordena partidos nem compara territórios que não têm nada em comum.',
        incompletaK: 'O que falta nesta linha',
        incompletaV:
          'Os campos assinalados não foram confirmados contra a fonte. O valor publicado não muda por isso; o que falta é a prova documental, e enquanto faltar a linha fica fora do índice dos motores de busca.',
        completaK: 'Estado',
        completaV: 'Proveniência completa: todos os campos preenchidos e conferidos contra a fonte.',
        voltar: 'Voltar ao livro-razão',
      },
    },

    municipio: {
      eyebrow: 'Município',
      /* O título e a descrição do <head> não podem ter algarismos: o portão só
         tolera aí as cadeias que calcula do registo. Compõem-se com o nome do
         concelho, que não tem nenhum. */
      metaCauda: 'o município, medido — O Estado do País',
      metaDescricaoA: 'O que as fontes publicam sobre o município de ',
      metaDescricaoB:
        ': população, poder de compra, emprego, empresas, dívida e execução orçamental. Cada valor tem linha no livro-razão, com fonte, documento e data de acesso.',
      ledeA: 'Esta página mede o município de ',
      ledeB:
        ' e mostra de onde vem cada medida. Não interpreta: onde uma fonte não estabelece uma coisa, a página di-lo em vez de a supor.',

      relanceK: 'Relance',
      relanceSub:
        'Oito medidas. Seis vêm de organismos que publicam para todos os concelhos do país; duas só existem porque o próprio município as publica, e cada uma dessas diz-lo na sua linha.',
      relanceVazio: 'Nenhuma fonte central publica esta medida para este concelho.',

      breveK: 'Leitura breve',
      breveSub: 'Uma frase por medida. Todos os números são citações do livro-razão.',

      distanciaK: 'A dívida contra o tecto legal',
      distanciaLegenda:
        'A barra é a dívida total que o regulador publica para o concelho; o fio é o limite legal do mesmo ano. O índice mede uma contra o outro numa escala em que o tecto é o valor permitido.',
      /* Pedaços de uma frase que o gabarito monta com as afirmações DESTE
         município. Nenhum id de afirmação se escreve aqui: isto é a língua,
         não os dados. */
      distanciaIndiceA: 'O índice é ',
      distanciaIndiceB: ' % em ',
      distanciaIndiceC: ', contra um tecto legal de ',
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
      contasDivergenciaArredondada: '— a diferença é publicada arredondada ao euro; os dois valores acima diferem em cêntimos.',
      /* A frase da camada 2 do instrumento. Só os anos que a página publica:
         dizer «todos os anos» seria dizer mais do que se mostra. */
      tempoSerieA: 'O índice de dívida do regulador desceu de ',
      tempoSerieB: ' % em ',
      tempoSerieC: ' para ',
      tempoSerieD: ' % em ',
      tempoSerieE: ', nos quatro anos que esta página publica.',
      tempoK: 'Quem administrou, e o que as contas registaram',
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
      tempoExcessoK: 'O excesso sobre o tecto legal',
      tempoExcessoV:
        'O que a dívida excedia o limite legal, no primeiro e no último ano em que o relatório o publica como um valor positivo. Depois disso o quadro passa a números negativos, que já não são excesso mas capacidade de endividamento — e por isso esta página pára aqui.',
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
        'Cada valor desta página tem uma linha no livro-razão. O selo ao lado do número é a porta para essa linha, onde estão a fonte, o documento, o sítio exacto de onde o valor foi lido, o excerto e o dia em que foi lido. Nenhuma data de leitura é escrita aqui: quem quiser sabê-la, abre a linha.',
      correccoesK: 'Encontrou um erro',
      correccoesV: 'Escreva para ',
      correccoesW:
        '. Um erro confirmado entra no registo de correções e na própria linha, com o valor antigo à vista. Nada é apagado.',
      correccoesLink: 'O registo de correções',

      estudosK: 'Os trabalhos sobre este concelho',
      estudosV:
        'Cada um tem a sua página, com a medida que o faz valer a pena, a frase do que concluiu, o método e o documento original quando está alojado aqui.',
      estudoLink: 'Abrir a leitura',

      voltarMapa: 'Voltar ao mapa dos municípios',
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


      /* Trabalho com leitura do observatório escrita (src/data/leituras.mjs).
         É este o estado que levanta o noindex — ver DECISIONS §1.35. */
      leituraEstado: 'Leitura publicada',
      leituraLede: 'Este trabalho já tem a leitura do observatório: a medida que o faz valer a pena, a frase do que concluiu, o método e as ressalvas.',
      leituraExplicacao:
        'A frase abaixo é prosa da casa, e não uma citação: assenta numa frase impressa no próprio trabalho, e foi cortada onde ia mais longe do que ela. Os números são citações do livro-razão, cada um com o selo que leva à sua linha. O documento original continua alojado aqui, tal como foi publicado.',
      leituraRelanceK: 'Relance',
      leituraBreveK: 'Leitura breve',
      leituraFundoK: 'Método e ressalvas',
      leituraOutraLingua: 'A mesma frase na outra edição',
      municipioK: 'O concelho de que trata',
      municipioLink: 'A página do município',

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
      descricoesDoDocumento:
        'A descrição deste trabalho não é uma reformulação do título: é a frase de abertura do próprio documento, nas duas edições, sem nada acrescentado.',
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
      livro: 'Ledger',
      metodo: 'Method',
      saltar: 'Skip to content',
    },

    prov: {
      calculado: 'calculated',
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
        h2: 'Measures from the European scoreboard',
        sub: 'These indicators are not our choice. They are the macroeconomic imbalance and social scoreboards — the set the European institutions use to assess a member state, with the thresholds those institutions publish themselves. Every value is exactly as published, and the tag says where it came from.',
        nota: 'Fields still to be confirmed are marked as such. None has been filled in with a plausible value.',
        verificacaoEm: 'Baseline last re-checked against source on',
        verificacaoVencida: 'Verification overdue: these values have not been re-checked against source since',
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
      livroLink: 'See the ledger',

      caixaTitulo: 'Write a correction',
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
      metaTitle: 'Ledger — O Estado do País',
      metaDescription:
        'Every claim published on this site, one row each: the value exactly as published, the source, the document, the address, the access date and the excerpt.',
      eyebrow: 'Ledger',
      h1: 'The ledger',
      lede1:
        'One row per published figure. Each row holds the value exactly as the source published it, who produced it, the document and edition, the address, the date we read it and a textual excerpt — and, when the figure is calculated by us, the sum spelled out and re-evaluated at every build.',
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
        'Only the figures this site publishes are here. The figures inside the study documents hosted here are not in the ledger — their provenance is the document’s own, on the day it was published. Nor is the ledger a database of series: it holds the reading we cited, not the series it came from.',
      metodoLink: 'How this is made',

      linha: {
        eyebrow: 'Ledger row',
        aparelhoK: 'Provenance',
        excertoNota:
          'Transcribed from the source word for word. The build fails if the text on this page stops being identical, character for character, to what the row holds.',
        excertoPorConfirmar:
          'The textual excerpt for this row has not been transcribed from the source yet. Writing a plausible paraphrase here would be exactly the fabrication this system exists to prevent.',
        excertoDerivada:
          'This row quotes no sentence: the value is calculated from other rows, and the documentary proof is theirs.',
        excertoDaCasa:
          'This row quotes no sentence because there is none to quote: the value is a count of this publication\'s own record, re-evaluated every time the site is built. No external document publishes it.',
        derivacaoNota: 'The sum, in words.',
        expressaoK: 'Re-evaluated at build time',
        expressaoNota:
          'The same sum as an expression. It is recomputed at every build and must yield exactly the published value; if it does not, nothing is built.',
        derivaDeK: 'Derived from',
        historicoK: 'Corrections and updates to this row',
        historicoVazio: 'This row has never been corrected or updated.',
        historicoNota:
          'Nothing is deleted. A value that was wrong stays in plain sight, dated, with the reason — and a value that stopped being right because what it measures changed is recorded as an update, which is not the same thing.',
        bandeiraK: 'Status at source',
        atribuicaoNota:
          'Who the value is credited to, as the document records it. Where a party label appears, it is a fact of record and nothing more: this site does not rank parties, nor compare territories that have nothing in common.',
        incompletaK: 'What is missing from this row',
        incompletaV:
          'The marked fields have not been confirmed against the source. The published value does not change because of it; what is missing is the documentary proof, and while it is missing the row stays out of search engine indexes.',
        completaK: 'State',
        completaV: 'Complete provenance: every field filled in and checked against the source.',
        voltar: 'Back to the ledger',
      },
    },

    municipio: {
      eyebrow: 'Municipality',
      metaCauda: 'the municipality, measured — O Estado do País',
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
      contasDivergenciaArredondada: '— the difference is published rounded to the euro; the two figures above differ by cents.',
      tempoSerieA: 'The regulator’s debt index fell from ',
      tempoSerieB: ' % in ',
      tempoSerieC: ' to ',
      tempoSerieD: ' % in ',
      tempoSerieE: ', across the four years this page publishes.',
      tempoK: 'Who governed, and what the accounts recorded',
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
        'How far the debt exceeded the legal limit, in the first and the last year in which the report publishes it as a positive figure. After that the table turns negative, and a negative there is no longer excess but borrowing capacity — so this page stops here.',
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
      correccoesK: 'Found an error',
      correccoesV: 'Write to ',
      correccoesW:
        '. A confirmed error enters the corrections log and the row itself, with the old value still visible. Nothing is deleted.',
      correccoesLink: 'The corrections log',

      estudosK: 'The works about this concelho',
      estudosV:
        'Each has its own page, with the measure that makes it worth reading, the sentence of what it concluded, the method, and the original document where it is hosted here.',
      estudoLink: 'Open the reading',

      voltarMapa: 'Back to the map of municipalities',
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


      leituraEstado: 'Reading published',
      leituraLede: 'This work now has the observatory’s reading: the measure that makes it worth reading, the sentence of what it concluded, the method and the caveats.',
      leituraExplicacao:
        'The sentence below is house prose, not a quotation: it rests on a sentence printed in the work itself, and it was cut back where it went further than that sentence. The figures are citations from the ledger, each with the seal that leads to its row. The original document remains hosted here, exactly as it was published.',
      leituraRelanceK: 'At a glance',
      leituraBreveK: 'Brief reading',
      leituraFundoK: 'Method and caveats',
      leituraOutraLingua: 'The same sentence in the other edition',
      municipioK: 'The concelho it is about',
      municipioLink: 'The municipality page',

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
      descricoesDoDocumento:
        'This work’s description does not restate the title: it is the opening sentence of the document itself, in both editions, with nothing added.',
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
