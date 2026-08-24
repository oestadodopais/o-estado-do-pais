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
      /* O comando que abre a navegação no telemóvel. É a mesma palavra nas duas
         edições, e está na lista de identidades aceites do `CHAVES-EN.md`. */
      menu: 'Menu',
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
      agendaConcluido: 'concluído',
      agendaRetirado: 'retirado',
    },

    /**
     * O CONTROLO DO TEMA (Emenda 12, 21.08.2026; DECISIONS §1.52).
     *
     * Claro por defeito para todos, independentemente da preferência do
     * sistema; o leitor pede escuro num controlo do cabeçalho, e a escolha fica
     * no aparelho dele. As palavras vão em minúsculas porque são as duas metades
     * de um comando de aparelho, como «abrir»/«fechar», e não títulos.
     *
     * `rotulo` é o nome do grupo, e só é ouvido: dois botões que dizem «claro» e
     * «escuro» sem nada que diga de que é a escolha não dizem nada a quem não
     * vê o cabeçalho.
     */
    tema: {
      rotulo: 'Tema',
      claro: 'claro',
      escuro: 'escuro',
    },

    prov: {
      calculado: 'calculado',
      /* A palavra que o selo escreve, à vista (IDENTIDADE.md §5.4). Esteve
         escondida para leitores de ecrã até à v2, e um leitor com vista via só
         um título de estudo em cinzento. */
      selo: 'fonte',
      /* A ressalva da fonte, dita por palavras ao pé do valor (decisão (d) da
         direção, 20.08.2026). Não é a nota: a nota é o campo `source_flag_note`
         da página da linha, e continua lá inteira. Esta é a palavra que viaja
         com o número para onde quer que ele vá. */
      provisorio: 'provisório',
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
      /* Quando o endereço da linha é um ponto de acesso de dados e não um
         documento. Uma série não é um documento, um pedido não é um endereço
         de leitura, e o que a resposta traz é um campo — não uma frase que se
         possa citar. Ver DECISIONS §1.36, item 7. */
      serie: 'Série',
      pedido: 'Pedido',
      campoDevolvido: 'Campo devolvido',
      /* O rótulo da ligação para a página exata do documento. O número vem de
         `document.page`, que desde 18.08.2026 é a única origem da página: o
         fragmento `#page=` do endereço deriva dela. */
      abrirNaPagina: 'Abrir na página',
      /* O recorte da linha impressa (bloco T2). O texto alternativo compõe-se
         só dos campos que existem: sem título de documento, fica a página. */
      recorteAlt: 'Recorte da linha impressa, página',
      recorteAltDe: 'de',
      recortePagina: 'página',
      /* O ficheiro de dados que este sítio aloja, e de que a linha é contada
         (bloco T3). A licença e a atribuição vão à vista, porque a obrigação
         que a fonte impõe a quem redistribui é dizê-las. */
      alojado: 'Ficheiro alojado',
      alojadoBytes: 'bytes',
      alojadoResumo: 'sha256',
      alojadoExtraido: 'extraído de',
      /* Os ficheiros sobre que a conta foi feita e que este sítio NÃO aloja.
         O estado é desenhado e dito por palavras: não é o marcador, porque não
         é um campo por confirmar (IDENTIDADE.md §6, §7). */
      calculadoSobre: 'Calculado sobre',
      calculadoSobreInstantaneo: 'instantâneo de',
      calculadoSobreColuna: 'coluna',
      calculadoSobreFiltro: 'filtro',
      calculadoSobreNota:
        'Este sítio não aloja estes ficheiros. O conjunto de onde vieram declara, em ' +
        'dados.gov.pt, a licença «Licença não especificada», e redistribuir um ficheiro sem ' +
        'licença dita é uma reutilização que este sítio não pode defender. Fica o resumo de ' +
        'cada ficheiro, para que quem tenha o instantâneo possa refazer a conta.',
      /* A porta para a cópia que um terceiro guardou do ficheiro contado. Só
         aparece quando o resumo da captura é o dos bytes que foram contados:
         uma captura que não bate certo é uma porta para outro ficheiro. */
      calculadoSobreArquivada: 'cópia arquivada pelo Internet Archive',
      /* A página humana de uma série de dados: a página do indicador, para
         pessoas, antes do pedido exato que a máquina faz. */
      paginaDaSerie: 'Página da série',
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
    /**
     * A PORTA DAS CORREÇÕES, REDUZIDA (Emenda 17, 21.08.2026).
     *
     * «A porta das correções reduz-se a "Encontrou um erro?
     * correcoes@oestadodopais.pt · O registo de correções →"; a frase da
     * política vive em /correcoes.» A frase que saiu — «Um erro confirmado entra
     * no registo de correções e na própria linha, com o valor antigo à vista.
     * Nada é apagado.» — era a política do sítio dita em 307 páginas, e a página
     * das correções di-la inteira, com as três naturezas e o registo.
     */
    porta: {
      k: 'Encontrou um erro?',
      link: 'O registo de correções',
    },

    /**
     * A MOBÍLIA DA FAMÍLIA DA LEITURA, uma vez só.
     *
     * O sumário no cimo nasceu no Método (subetapa 4b) como `metodo.sumarioK`,
     * e a Agenda precisou das mesmas duas palavras na 4c. Duas cópias da mesma
     * cadeia em duas famílias são duas cadeias no dia em que uma mudar, e por
     * isso a chave desce para aqui, ao pé da folha que estas páginas partilham
     * (`src/styles/leitura.css`). Nomeia o que a página tem, e não o que a casa
     * faz.
     */
    leitura: {
      sumarioK: 'Nesta página',
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
      /* A LEDE E A NOTA DE ORIGEM SAÍRAM (subetapa 4c, a regra da direção de
         21.08.2026). A lede descrevia o aparelho da própria página («cada item
         traz o critério… e traz o registo de cada mudança de estado») e fechava
         com uma promessa da casa («Nada sai desta lista em silêncio»); a nota
         dizia de que motor os dois registos vieram e que atravessaram tal e
         qual. Tirar as duas não faz ninguém ler mal um número: o critério, o
         proponente e o histórico estão em cada item, com os seus rótulos. */
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
      /* A ausência em duas palavras (Emenda 15). O parágrafo que aqui estava
         explicava a política («um item não se apaga, muda de estado»), que é o
         que o histórico de cada item mostra ao fazê-lo. */
      vazioRetirado: 'Nenhum até hoje.',
      tipos: {
        estudo: 'Estudo',
        vigilancia: 'Vigilância',
        pagina: 'Página',
      },
      perguntaK: 'A pergunta',
      /* UMA CHAVE, E É UMA RESSALVA SOBRE O DADO (subetapa 4c). Eram duas, e as
         duas abriam com a regra da casa («a pergunta é selada no motor antes de
         a recolha começar») e diziam o estado desta — que o registo já diz, com
         data, na linha `registoPrevio*` logo abaixo. O que fica é a metade que
         um leitor precisa para não ler mal o que tem à frente: qual dos dois
         textos é o registado. Tirá-la faria alguém tomar a edição portuguesa
         pelo registo, que é o teste da direção de 21.08.2026. */
      perguntaNota:
        'O registo do motor escreve-se em inglês: o inglês é a forma registada, palavra por palavra, e o português acima é a edição portuguesa dessa mesma pergunta.',
      porqueK: 'Porquê',
      criteriosK: 'Critérios',
      quadroK: 'Quadro institucional',
      limiarK: 'Limiar publicado pela Comissão:',
      eventoK: 'Calendário das fontes',
      leitorK: 'Pedido de leitor',
      correcaoK: 'Correção',
      /* A ausência em duas palavras (Emenda 15). O parágrafo dizia de onde o
         item tinha vindo em vez disso, e essa proveniência está nos campos que
         a levam: «Proposto pelo motor a», «Decidido pela direção a», o porquê e
         o histórico, cada um com a sua data. */
      semCriterios: 'Sem critério.',
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
      /* Uma entrada que sai de um estado e chega ao mesmo não é uma transição, e
         escrevê-la com a seta («Em curso → Em curso») fazia a página anunciar
         uma mudança de estado onde só houve uma decisão registada. */
      historicoMantem: 'estado mantido:',
      calendarioH2: 'O calendário das fontes',
      /* A segunda frase saiu (subetapa 4c): dizia o que cada acontecimento tem
         por baixo, e cada um tem-no com o seu rótulo à vista. A primeira fica,
         porque nomeia o que o calendário é. */
      calendarioLede: 'O que as fontes que este sítio cita publicam a seguir.',
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

    /**
     * ------------------------------------------------------------------
     * A PRIMEIRA PÁGINA v3: O ÂMBITO, A DENSIDADE E A CABEÇA
     * ------------------------------------------------------------------
     * A página passou a ter estado, e o estado está no endereço (Emenda 7). Estas
     * são as palavras dos comandos e da cabeça, e nenhuma delas traz algarismos:
     * onde a frase precisa de um número, ele entra por `<Claim/>` (uma medição de
     * Portugal) ou por `data-prova` (uma contagem do próprio sítio), e a cadeia
     * parte-se em dois pedaços à volta dele, como `municipios.contagemA/B` já faz.
     */
    ambito: {
      rotulo: 'Âmbito',
      pais: 'País',
      regiao: 'Região',
      municipio: 'Município',
      /* A meta da fila das regiões. Dizia «as seis leituras» porque a etapa 2
         rendia seis pastilhas, com Portugal entre elas; a leitura cruzada de
         20.08 mostrou que Portugal não é uma região, e a fila passou a cinco
         (plano §13). A frase deixa de contar: as leituras que a régua publica
         continuam a ser seis, e as regiões da fila são as que a fila mostra.
         Contar aqui obrigaria a mudar a frase de cada vez que a lista mudasse. */
      regioesMeta: 'As regiões publicadas na régua da convergência.',
      pesquisaRotulo: 'Escreva o nome do concelho',
      pesquisaSemResultado: 'Nenhum concelho com esse nome.',
    },

    densidade: {
      rotulo: 'Densidade',
      relance: 'Relance',
      leitura: 'Leitura breve',
      abrir: 'abrir',
      fechar: 'fechar',
    },

    inicio: {
      cabeca: {
        /* O rótulo do âmbito País, na gramática dos outros três: nome e âmbito,
           e mais nada. Levava a contagem do painel («painel europeu · 8
           medidas»), e a Emenda 16 tornou-a ambígua — a página passou a ter DOIS
           painéis, e um número ao lado de «painel europeu» diria o do primeiro
           como se fosse o dos dois. As contagens que a página precisa de dizer
           estão na manchete, e são as duas que a Emenda 16 escreve. */
        paisA: 'Portugal · país',
        regiaoSufixo: ' · região',
        municipioSufixo: ' · município',
        municipioPalavra: ' · município · ',
        /* A MANCHETE DA EMENDA 16, palavra por palavra do lugar de direção:
           «Portugal ultrapassa 4 limiares do Procedimento dos Desequilíbrios
           Macroeconómicos e cumpre 9.» As duas contagens são chaves da prova, e
           a frase parte-se onde elas entram. O singular e o plural do primeiro
           são escolhidos na construção, com a contagem que o portão reconta; o
           segundo não tem substantivo a seguir e serve os dois. */
        tituloPaisA: 'Portugal ultrapassa ',
        tituloPaisUm: ' limiar do Procedimento dos Desequilíbrios Macroeconómicos e cumpre ',
        tituloPaisMuitos: ' limiares do Procedimento dos Desequilíbrios Macroeconómicos e cumpre ',
        tituloPaisFim: '.',
        tituloEvora: 'As medidas do concelho, cada uma com a sua linha.',
        tituloVazioA: 'Ainda sem linhas para ',
        tituloVazioB: '.',
        /* A LEDE DA EMENDA 16, palavra por palavra. Nomeia as quatro medidas que
           estão fora do limiar, e o ano é o `reference_date` das quatro linhas,
           marcado como data de referência e não escrito como prosa. */
        /* A LEDE DO PAÍS DEIXA DE SER UMA FRASE ESCRITA (etapa 2m).
         *
         * Era uma cadeia com quatro nomes de medida dentro dela, e ficava falsa
         * no dia em que uma quinta medida atravessasse o seu limiar — sem que
         * nada no sítio o dissesse. Passa a ser CONSTRUÍDA, na construção, dos
         * nomes das peças do Procedimento cujo estado é «fora», pela ordem do
         * painel, com estas palavras de gramática pelo meio. O portão conta os
         * itens da lista e compara-os com a chave `painel_fora_do_limiar`, que
         * é a mesma contagem que a manchete leva.
         *
         * Nenhuma destas cadeias traz um algarismo: o único que a frase escreve
         * é o ano, e esse é o `reference_date` das linhas, marcado como em toda
         * a casa. Os nomes vêm de `figuras.mjs` e mais de lado nenhum. */
        ledePais: {
          abre: 'Fora do limiar: ',
          separador: ', ',
          ultimo: ' e ',
          ano: ', em ',
          fecha: '.',
        },
        ledeRegiaoPartes: [
          'PIB per capita em paridades de poder de compra, com a média da UE-27 fixada em ',
          { nl: '100', motivo: 'escala-de-instrumento' },
          '.',
        ],
        ledeVazioA: 'O ponto marca a posição do concelho na Carta Administrativa, e não cobertura. Quando houver linhas para ',
        ledeVazioB: ', entram aqui com a sua fonte e a sua data de leitura.',
        /* O prefixo do distrito (ISSUES I18, subetapa 2g). A Carta escreve
           «Beja» e «Ilha do Faial»; a etiqueta de Évora, que vem de
           `municipios.mjs`, escreve «distrito de Évora». A regra é uma só para
           os 308: prefixo quando o campo é um distrito, nome de ilha nu quando
           começa por «Ilha». O prefixo é uma cadeia validada, e o servidor diz
           em `data-ilha` a qual dos dois casos cada concelho pertence; o script
           só troca `hidden`. */
        distritoDe: 'distrito de ',
      },

      movel: {
        abrirConcelho: 'Abrir um concelho',
        verRegiao: 'Ver uma região',
        seloDaEscolha: 'Abrir a escolha de concelho',
      },

      portas: {
        /* O nome da região de navegação, e só se ouve. A legenda visível («As
           páginas · o resto vive a uma porta») saiu com a Emenda 15: três portas
           de uma linha cada não precisam de uma frase a dizer que são portas. */
        rotulo: 'As páginas',
        abrir: 'a página inteira',
        concelhos: ' concelhos',
        estudosA: ' trabalhos · ',
        estudosB: ' edições',
      },

      mapa: {
        /* A LINHA DA EMENDA 17, por baixo do mapa: «308 concelhos · CAOP 2025 ■
           fonte». Nomeia o que a coisa é — a contagem, a Carta e o ano —, e mais
           nada. «Contagem verificada nos ficheiros» era o que a casa fez, e saiu
           com a Emenda 15. */
        linha: ' concelhos · CAOP ',
        acores: 'Açores',
        madeira: 'Madeira',
        escolher: 'Toque num ponto para escolher o concelho.',
        readoutHint: 'Passe o cursor sobre um ponto para ler o município.',
        tecladoHint:
          'Teclado: Tab até ao mapa, setas para percorrer os municípios vizinhos, Home para voltar a Évora.',
        /* A INSTRUÇÃO DE TECLADO SAIU DO RÓTULO (commit 4-0, 21.08.2026).
           Dizia «Mapa de pontos dos municípios de Portugal. Use as setas para
           percorrer os municípios.» — e as setas só percorrem alguma coisa onde
           o script da primeira página está carregado. A página do concelho
           carrega `tema.js` e mais nada, e prometia a um leitor de ecrã um
           comando que ali não existe (achado 13 da quarta leitura do Codex). O
           rótulo passa a nomear o que o desenho é; a instrução continua escrita,
           uma vez só, em `tecladoHint`, que vive dentro de `#mapa-descricao` e
           só se constrói na postura inteira. */
        svgLabel: 'Mapa de pontos dos municípios de Portugal.',
        trocar: 'trocar de concelho',
        paginaInteira: 'a página inteira, com quem governou',
      },

      banda: {
        rotuloPartes: [
          'A régua da convergência · UE-27 = ',
          { nl: '100', motivo: 'escala-de-instrumento' },
        ],
        /* O nome acessível do desenho. Era a frase «As regiões não se desenham
           em pontos de concelho…», que a Emenda 15 retirou por ser a casa a
           explicar o desenho; um `role="img"` sem nome é uma imagem que um
           leitor de ecrã anuncia sem saber dizer o que é. O nome diz o que a
           coisa é, e não porque é assim. Sem algarismos: a escala está escrita
           no rótulo, que é onde ela é conferida. */
        svgLabel: 'Régua da convergência: o PIB per capita de cada região contra a média europeia.',
      },

      /**
       * O PAINEL SOCIAL EUROPEU (Emenda 16, 21.08.2026).
       *
       * Duas cadeias, e as duas são nomes: o do painel, que é como a instituição
       * lhe chama, e o do livro-razão, que é a porta por onde sai o resto das
       * medidas. Nenhuma das duas diz o que a casa fez nem o que a casa promete.
       */
      social: {
        titulo: 'Painel Social Europeu',
        porta: 'O livro-razão',
      },
    },

    /**
     * ------------------------------------------------------------------
     * O VOCABULÁRIO DE ESTADO E O DE COBERTURA (v3, etapa 2a)
     * ------------------------------------------------------------------
     * Duas listas fechadas, decididas uma vez, antes da primeira etapa que as
     * rende (`design/especime-v3/CHAVES-EN.md`). São a única maneira de o sítio
     * dizer estas duas coisas, e é por isso que vivem no topo e não dentro de
     * `home`: a mesma palavra tem de sair igual na primeira página, no índice
     * dos concelhos e na página de um concelho.
     *
     * O ESTADO é a comparação com um limiar publicado (Emenda 1). «fora» e não
     * «acima»: a posição de investimento internacional ultrapassa o seu limiar
     * POR BAIXO, porque −35 é um chão, e uma palavra que dissesse «acima»
     * estaria errada em duas das quatro medidas com limiar.
     *
     * `porConfirmar` é a PALAVRA do estado, e não o marcador: o marcador é
     * `[a verificar]` e fica em português nas duas edições (IDENTIDADE §6).
     *
     * A COBERTURA é editorial, e não uma medição: diz se este sítio já
     * construiu a página de um concelho. Tinha três formulações em uso ao mesmo
     * tempo (defeito 7); passa a ter duas palavras e mais nenhuma, e cada
     * rendição leva `data-cobertura="com-pagina|sem-pagina"` para que a régua
     * `medir-defeitos.mjs` conte quantas cadeias distintas existem por estado.
     */
    estado: {
      foraDoLimiar: 'fora do limiar',
      dentroDoLimiar: 'dentro do limiar',
      semLimiar: 'sem limiar',
      porConfirmar: 'por confirmar',
    },

    cobertura: {
      temPagina: 'tem página',
      semPaginaAinda: 'sem página ainda',
      /* A terceira palavra da cobertura, e é de outra escala (Emenda 14,
         21.08.2026). «sem página ainda» é sobre o CONCELHO; esta é sobre uma
         MEDIDA daquele concelho: a medida existe, a página do concelho ainda
         não tem uma linha para ela. É o que cada uma das oito peças vazias diz
         de si, no lugar onde uma peça com linha diz o valor. */
      semLinhaAinda: 'sem linha ainda',
    },

    /** O índice dos concelhos. */
    municipios: {
      metaTitle: 'Municípios · O Estado do País',
      /* A DESCRIÇÃO APARA-SE, e vai assinalada em vez de decidida (Emenda 15).
         Dizia, a seguir: «Os que já têm página do observatório levam a ela; os
         outros dizem que ainda não têm.» — a cobertura do próprio sítio, que é
         uma das cinco classes que a emenda nomeia. Nenhuma palavra mudou: a
         primeira frase é a que já lá estava. */
      metaDescription: 'Todos os concelhos de Portugal, pela Carta Administrativa Oficial.',
      eyebrow: 'Municípios',
      h1: 'Os concelhos de Portugal',
      lede: 'Todos os concelhos, pela Carta Administrativa Oficial de Portugal.',
      /* A CONTAGEM DA COBERTURA, com as duas chaves da prova (IDENTIDADE.md §10).
         Dizia «São 308 concelhos. Um tem página do observatório; os restantes
         ainda não têm, e esta lista di-lo em vez de os esconder.»: o «Um» era uma
         contagem escrita à mão, que a §10 recusa, e a segunda metade era a casa a
         dizer que é honesta. As duas palavras que ficam são as da ficha do mapa da
         primeira página, relocadas sem uma letra mudada (R11). */
      coberturaA: ' de ',
      coberturaB: ' concelhos · ',
      fonteK: 'De onde vem a lista',
      mapaLink: 'O mapa dos concelhos',
      /* A CONTAGEM POR PARCELAS (Emenda 17; decisão 4 da direção, 21.08.2026;
         ISSUES I33). Vivia na ficha do mapa da primeira página, com o rótulo
         «Contagem verificada nos ficheiros», que é a casa a falar de si (Emenda
         15) e não entra. Os quatro rótulos são nomes de territórios e a palavra
         que soma: nomeiam o que a contagem é. */
      parcelaContinente: 'Continente',
      parcelaAcores: 'Açores',
      parcelaMadeira: 'Madeira',
      parcelaTotal: 'Total',
      /* A porta do CSV dos 308, que sai da primeira página e assenta aqui, que é
         a página que os lista (ISSUES I34). As palavras da porta são as de
         `home.dadosLink`, sem uma mudada; o rótulo nomeia o que a coisa é, e não
         o que a casa fez com ela (Emenda 15). */
      dadosK: 'A lista em ficheiro',
      dadosLink: 'descarregar os dados (CSV)',
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
      /* A DESCRIÇÃO DA PRIMEIRA PÁGINA NOMEIA O QUE ELA TEM (Emenda 15, decisão
         da direção de 21.08.2026). Dizia «Observatório de dados sobre Portugal.
         Cada número publicado tem uma linha no livro-razão, com fonte, documento
         e data de acesso.»: a segunda frase é o método do próprio sítio, que é a
         classe de frase que a emenda tira das páginas do leitor, e o `<head>` é
         superfície pública como o corpo. A nova diz os painéis, os indicadores,
         os limiares e as fontes, que é o que a página mostra. */
      metaDescription:
        'Portugal nos painéis europeus: os indicadores, os limiares e as fontes.',

      numeros: {
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
        /* A dobra «Método, ressalvas e proveniência» saiu com a Emenda 15, e
           com ela nove cadeias: o seu título, «Os dados desta régua» e a frase
           que dizia que o ficheiro é gerado a cada construção, «O que o número
           quer dizer», «Ressalva», «Distâncias» e a sua frase, «Proveniência», e
           a linha «Sem JavaScript, a régua mostra Portugal». Fica a frase que
           diz o que o índice compara, que é o que a régua É. */
        significadoV:
          'O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27. Um valor abaixo da média significa menos poder de compra por pessoa; um valor acima, mais.',
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
      /* OS PREFIXOS QUE SÓ UM LEITOR DE ECRÃ OUVE (subetapa 4a, decisão c).
         A forma da correção é o valor antigo riscado e o novo ao lado, e um
         risco não se ouve: sem estes dois prefixos, quem ouve a página recebe
         dois números seguidos e nenhuma maneira de saber qual é qual. Os
         cabeçalhos de coluna acima são um `<div>` de `<span>`s e não uma tabela,
         e por isso não se associam a célula nenhuma; nas atualizações a seta
         entre os dois valores é `aria-hidden`. Vão FORA do elemento marcado com
         `data-correcao-campo`, para que o portão continue a comparar só o valor
         com o do livro-razão. */
      valorAnteriorVh: 'valor anterior: ',
      valorNovoVh: 'valor novo: ',
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
      /* AS DUAS NOTAS DE GRUPO SAÍRAM (decisão da direção, 21.08.2026, tarde).
         Diziam «Todos os campos preenchidos e conferidos contra a fonte. O selo
         é um quadrado cheio.» e «Falta pelo menos um campo de proveniência. O
         campo fica marcado, e nenhum foi preenchido com um valor plausível. O
         selo é um quadrado a tracejado.» — as duas únicas frases de
         autorreferência que o inventário contava nesta rota: a casa a dizer o
         que fez e a explicar o seu próprio selo. O nome do grupo diz o estado, e
         o estado é o que a página tem para dizer. */
      grupoCompletasK: 'Proveniência completa',
      grupoPorConfirmarK: 'Com campos por confirmar',
      colunaValor: 'Valor',
      colunaAfirmacao: 'Afirmação',
      colunaSelo: 'Proveniência',
      /* As contagens deste índice, pelas chaves da prova que já existem
         (`src/lib/prova.mjs`). São números do próprio sítio (IDENTIDADE.md §10):
         entram por `data-prova`, o portão reconta-os por conta própria, e cada um
         leva a sua porta. As palavras ao lado nomeiam o que é contado. */
      contaAfirmacoes: 'afirmações',
      contaDerivadas: 'calculadas',
      /* A LEGENDA DO SELO PASSA A NOMEAR OS ESTADOS (direção, 21.08.2026).
         Dizia «Quadrado cheio: a proveniência está completa.» e «Quadrado a
         tracejado: falta pelo menos um campo, e a linha di-lo.» — duas frases a
         descrever o glifo que está desenhado ao lado. Uma legenda nomeia o que a
         coisa é (Emenda 15): o quadrado desenha-se, e o que fica escrito é o
         nome do estado. */
      seloK: 'Os dois estados do selo',
      seloCheio: 'proveniência completa',
      seloTracejado: 'um campo por confirmar',
      marcadorK: 'O marcador',
      marcadorGloss: '',
      metodoLink: 'Como isto é feito',

      /* O conjunto de dados (bloco T, T4). Com a licença por decidir, o bloco
         diz o estado e não oferece ficheiro nenhum; com ela decidida, oferece
         os dois e escreve a licença ao lado. Ver src/data/licenca.mjs. */
      /* O rótulo do ficheiro da régua da convergência, cuja porta desceu da
         primeira página na relocação R13. Nomeia o que a coisa é, e mais nada. */
      convergenciaK: 'A régua da convergência, em ficheiro',
      conjuntoK: 'O livro-razão como conjunto de dados',
      conjuntoEstado: 'Conjunto de dados preparado; a licença aguarda decisão da direção.',
      conjuntoV: 'Todas as linhas, com todos os campos publicados.',
      conjuntoDescarregar: 'Descarregar o livro-razão',
      conjuntoLicenca: 'Publicado sob',
      conjuntoAtribuicao: 'Atribuição',
      conjuntoAmbito:
        'A licença cobre o conjunto: a estrutura, os valores da casa, as derivações e as descrições. Os excertos transcritos das fontes continuam sob os termos de quem os publicou.',

      linha: {
        eyebrow: 'Linha do livro-razão',
        aparelhoK: 'Proveniência',
        excertoNota: 'Transcrito da fonte, palavra por palavra.',
        excertoPorConfirmar: 'O excerto textual desta linha ainda não foi transcrito da fonte.',
        excertoDerivada:
          'Esta linha não cita nenhuma frase: o valor é calculado a partir de outras linhas, e a prova documental é a delas.',
        excertoDaCasa:
          'Esta linha não cita nenhuma frase porque não há nenhuma para citar: o valor é uma contagem do próprio registo desta casa, e é reavaliado a cada construção do sítio. Nenhum documento externo o publica.',
        excertoAlojado:
          'Esta linha não cita nenhuma frase porque a fonte não publica nenhuma: o valor é a contagem das linhas do ficheiro que este sítio aloja, acima, e é recontado a cada construção.',
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
        /* A porta para os dados desta linha. Só existe com licença decidida:
           sem ela não há bloco nenhum, porque uma ausência não se desenha
           (IDENTIDADE.md §6). */
        dadosK: 'Acesso aos dados',
        linhaEmJson: 'Esta linha em JSON',
        /* O conjunto inteiro, ao pé da linha: quem confere uma linha muitas vezes
           quer o conjunto, e o índice do livro-razão já o oferece. É a mesma
           licença e são os mesmos ficheiros; o que muda é a distância. */
        conjuntoK: 'O conjunto inteiro',
        /* «Esta linha noutro sítio» (IDENTIDADE.md §11; design/DECISAO.md). A
           mesma linha na outra edição: é o «noutro sítio» que esta casa pode
           provar para todas as 132 linhas sem inventar um índice de superfícies.
           O cabeçalho faz a mesma viagem, e é mobília; a §11 pede-a ao aparelho. */
        noutroSitioK: 'Esta linha noutro sítio',
        noutraEdicao: 'Esta linha na edição inglesa',
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
        /* As reconferências independentes de uma linha (bloco T, §1.47). Os
           rótulos vivem aqui e o portão tem a sua própria cópia deles: se ele
           lesse esta tabela, confirmava a tabela e não o livro-razão. */
        verificacaoPor: {
          'leitura-independente': 'leitura independente',
          'painel-semanal': 'reconferência semanal do painel',
          'revisao-cruzada': 'revisão cruzada',
        },
        verificacaoResultado: {
          igual: 'o mesmo valor',
          diverge: 'valor diferente:',
          inacessivel: 'fonte inacessível nesse dia',
        },
        verificacaoPorta: 'Repetir a leitura',
      },
    },

    municipio: {
      eyebrow: 'Município',
      /* O título e a descrição do <head> não podem ter algarismos: o portão só
         tolera aí as cadeias que calcula do registo. Compõem-se com o nome do
         concelho, que não tem nenhum. */
      metaCauda: 'o município, medido · O Estado do País',
      /* A DESCRIÇÃO DO `<head>` PERDE A SEGUNDA FRASE (commit 4-0). Dizia ainda
         «Cada valor tem linha no livro-razão, com fonte, documento e data de
         acesso.» — o método do sítio escrito na descrição, que é superfície
         pública e é medida pela mesma régua desde o commit 3-0 (decisão 1 do
         diretor). O que fica nomeia o que a página traz. */
      metaDescricaoA: 'O que as fontes publicam sobre o município de ',
      metaDescricaoB:
        ': população, poder de compra, emprego, empresas, dívida e execução orçamental.',
      /* A ABERTURA E AS CONTAGENS POR EXTENSO SAÍRAM (direção, 21.08.2026,
         tarde; Emenda 15 e `DECISIONS.md` §4 item Q). Eram «Esta página mede o
         município de <nome> e mostra de onde vem cada medida. Não interpreta:
         onde uma fonte não estabelece uma coisa, a página di-lo em vez de a
         supor.» e «Oito medidas. Seis vêm de organismos que publicam para todos
         os concelhos do país; duas só existem porque o próprio município as
         publica, e cada uma dessas di-lo na sua linha.» A primeira é a página a
         declarar o que faz; a segunda escreve duas contagens à mão, contra a
         `IDENTIDADE.md` §10, e explica a cobertura, contra a emenda. */
      relanceK: 'Relance',

      breveK: 'Leitura breve',

      distanciaK: 'A dívida contra o teto legal',
      /* A LEGENDA SEGUE O DESENHO (Emenda 4, subetapa 3d), e vai assinalada em
         vez de decidida. Dizia «A barra é a dívida total que o regulador publica
         para o concelho; o fio é o limite legal do mesmo ano.» — verdade
         enquanto a barra enchia do zero até ao valor. A emenda fixa uma só
         gramática de régua para o sítio inteiro: a referência a tinta à altura
         toda, a barra é a DISTÂNCIA à referência, o traço fino é o valor. Com o
         desenho novo, a frase antiga passava a descrever uma coisa que a página
         não desenha, e uma legenda falsa não se publica. O que mudou foram as
         duas primeiras orações; a terceira, que explica o índice, é a que já
         estava, palavra por palavra. */
      distanciaLegenda:
        'O traço fino é a dívida total que o regulador publica para o concelho; a barra é a distância até ao limite legal do mesmo ano, que é o fio da direita. O índice mede uma contra o outro numa escala em que o teto é o valor permitido.',
      /* Pedaços de uma frase que o gabarito monta com as afirmações DESTE
         município. Nenhum id de afirmação se escreve aqui: isto é a língua,
         não os dados. */
      distanciaIndiceA: 'O índice é ',
      distanciaIndiceB: ' em ',
      distanciaIndiceC: ', contra um teto legal de ',
      distanciaIndiceD: '.',
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
      tempoSerieB: ' em ',
      tempoSerieC: ' para ',
      tempoSerieD: ' em ',
      tempoSerieE: ', nos quatro anos que esta página publica.',
      tempoK: 'Quem administrou, e o que as contas registaram',
      /* A banda dos mandatos: o rótulo do desenho e o rótulo da legenda que
         leva as portas (IDENTIDADE.md §10). Os anos do eixo e os períodos são
         os que a página já publica; a banda não escreve nenhum número novo. */
      tempoBandaK: 'Mandatos, no tempo',
      tempoBandaLegendaK: 'Abrir cada mandato',
      tempoRelanceK: 'Índice de dívida, do primeiro ano legível ao último',
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
      /* Fica só como nome da secção, por cima da banda dos mandatos (direção,
         21.08.2026, tarde). O parágrafo que levava por baixo saiu com a Emenda
         15. */
      tempoAtribuicaoK: 'Quem responde pelo quê',

      metodoK: 'Método e ressalvas',
      naoSabeK: 'O que esta página não sabe',
      provenienciaK: 'Proveniência',
      estudosK: 'Os trabalhos sobre este concelho',
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
      /* AS DUAS FRASES DO ESTADO SAÍRAM (subetapa 4e, a regra da direção de
         21.08.2026). O estado desta página diz-se no seu rótulo, que está três
         linhas abaixo («Rascunho · sem conteúdo»): a lede repetia-o em prosa e a
         explicação contava a fase seguinte do projecto e o cuidado da casa
         («Fingir conteúdo seria pior do que não ter nenhum»). Nenhuma das duas
         faz ninguém ler melhor um número, e o rótulo é a ausência dita em duas
         palavras, que é o que a Emenda 15 manda. */
      stubEdicoes: 'Edições',
      stubVoltar: 'Voltar ao arquivo',
      stubEstado: 'Rascunho · sem conteúdo',
      stubForaK: 'Publicado fora deste sítio',
      /* A primeira metade saiu: contava a fase do projecto. A segunda FICA, e
         não é diligência — é o aviso de que o comando ao lado leva o leitor para
         fora deste sítio, que é a única coisa que ele precisa de saber antes de
         carregar. */
      stubForaV: 'A ligação sai deste domínio.',
      stubForaLink: 'Abrir o estudo',

      /* Estudo com o documento já alojado aqui, mas com a página do
         observatório ainda por escrever. É um estado a sério, e diz-se. */
      migradoEstado: 'Documento alojado · página por escrever',

      /* Trabalho com leitura do observatório escrita (src/data/leituras.mjs).
         É este o estado que levanta o noindex — ver DECISIONS §1.35. */
      /* `leituraEstado` saiu na 4e: era a casa a dizer de si que tinha acabado
         o trabalho, por cima de uma página onde o trabalho está à vista. Os
         outros dois estados ficam porque são ausências declaradas. */
      leituraRelanceK: 'Relance',
      leituraBreveK: 'Leitura breve',
      leituraBreveRotulo: 'Leitura breve · prosa da casa, assente numa frase do trabalho',
      leituraFundoK: 'Método e ressalvas',
      leituraOutraLingua: 'A mesma frase na outra edição',
      municipioK: 'O concelho de que trata',
      municipioLink: 'A página do município',

      documentoK: 'O documento original',
      /* `documentoV` saiu: dizia com que cuidado o documento foi alojado. A
         porta («Ler o documento →») é o que o leitor precisa, e a faixa que o
         documento leva no topo vê-se quando ele abre. */
      documentoVazio: 'O documento deste estudo ainda não foi alojado aqui.',
      documentoLink: 'Ler o documento',
      /* Vai dentro da faixa, no topo do documento. Sem algarismos: é regra do
         portão, e a razão dela está em src/lib/documentos.mjs. */
      documentoFaixa: 'Documento do estudo · edição de registo',
      documentoVoltar: 'Voltar à página do estudo',

      /* ------------------------------------------------------------------
         A PÁGINA DE LEITURA (`/estudos/<slug>/texto`), parte 3 P2.
         ------------------------------------------------------------------
         O antetítulo diz o que a coisa é e nada mais, na forma paralela ao
         rótulo da faixa do documento arquivado: as duas superfícies servem o
         mesmo documento, uma composta aqui e a outra byte a byte.
         Os rótulos de «As linhas deste documento» nomeiam campos, e nenhum
         deles fala do método, da verificação ou da casa (Emenda 15). */
      textoEyebrow: 'Documento do estudo · texto',
      textoLink: 'Ler no sítio',
      textoLinhasK: 'As linhas deste documento',
      textoLinhaK: 'linha do motor',
      textoValorK: 'o valor como a linha o guarda',
      textoImpressoK: 'como este documento o imprime',
      textoOrigemK: 'resumo de origem',
      textoLinhaDoLivro: 'linha do livro-razão',
      /* O nome acessível da porta que vai a seguir a uma ligação do documento,
         onde a figura não pode ser ela própria uma âncora. Rende-se em
         `aria-label`, com o identificador da linha do motor a seguir: a porta
         não tem texto, e sem nome nenhum um leitor de ecrã anunciava uma
         ligação vazia. As mesmas palavras do rótulo do campo, porque é a mesma
         coisa que a porta abre. */
      textoPortaDaLinha: 'linha do motor',
      textoRegistoK: 'O registo de conteúdo',
      textoContaBlocos: 'blocos',
      textoContaAlgarismos: 'algarismos',
      textoContaComLinha: 'com linha do livro-razão',

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
      /* A segunda metade saiu (subetapa 4d, a regra da direção de 21.08.2026):
         «enquanto os estudos são mudados para aqui» é o sítio a contar o seu
         próprio projecto a quem só quer o caminho de volta. O que fica é o que
         explica o endereço vazio, e as três portas por baixo é que resolvem. */
      corpo: 'A ligação pode estar errada, ou a página pode ter mudado de sítio.',
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
      menu: 'Menu',
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
      agendaConcluido: 'concluded',
      agendaRetirado: 'withdrawn',
    },

    tema: {
      rotulo: 'Theme',
      claro: 'light',
      escuro: 'dark',
    },

    prov: {
      calculado: 'calculated',
      selo: 'source',
      provisorio: 'provisional',
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
      serie: 'Series',
      pedido: 'Request',
      campoDevolvido: 'Field returned',
      abrirNaPagina: 'Open at page',
      recorteAlt: 'Crop of the printed line, page',
      recorteAltDe: 'of',
      recortePagina: 'page',
      alojado: 'Hosted file',
      alojadoBytes: 'bytes',
      alojadoResumo: 'sha256',
      alojadoExtraido: 'extracted from',
      calculadoSobre: 'Computed over',
      calculadoSobreInstantaneo: 'snapshot of',
      calculadoSobreColuna: 'column',
      calculadoSobreFiltro: 'filter',
      calculadoSobreNota:
        'This site does not host these files. The dataset they came from declares, on ' +
        'dados.gov.pt, the licence "Licença não especificada" (licence not specified), and ' +
        'redistributing a file whose licence is not stated is a reuse this site cannot ' +
        'defend. What stays is the hash of each file, so that anybody holding the snapshot ' +
        'can re-make the count.',
      calculadoSobreArquivada: 'copy archived by the Internet Archive',
      paginaDaSerie: 'Series page',
    },

    rodape: {
      estudos: 'works in the archive',
      edicoes: 'editions',
    },

    porta: {
      k: 'Found an error?',
      link: 'The corrections log',
    },

    leitura: {
      sumarioK: 'On this page',
    },

    agenda: {
      metaTitle: 'Agenda · O Estado do País',
      metaDescription:
        'What this observatory is measuring, what comes next, and the criterion that put each thing there. With the calendar of what the sources publish next.',
      eyebrow: 'Agenda',
      h1: 'What gets measured next',
      estados: {
        em_curso: 'Under way',
        a_seguir: 'Next',
        concluido: 'Concluded',
        retirado: 'Withdrawn',
      },
      quadroDeEstadosK: 'What is in each state',
      semRegisto: 'no record',
      vazioRetirado: 'None to date.',
      tipos: {
        estudo: 'Study',
        vigilancia: 'Watch',
        pagina: 'Page',
      },
      perguntaK: 'The question',
      perguntaNota:
        'The engine’s record is written in English: the English is the registered form, word for word, and the Portuguese edition renders that same question.',
      porqueK: 'Why',
      criteriosK: 'Criteria',
      quadroK: 'Institutional framework',
      limiarK: 'Threshold published by the Commission:',
      eventoK: 'Source calendar',
      leitorK: 'Reader request',
      correcaoK: 'Correction',
      semCriterios: 'No criterion.',
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
      historicoMantem: 'state unchanged:',
      calendarioH2: 'The source calendar',
      calendarioLede: 'What the sources this site cites publish next.',
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

    ambito: {
      rotulo: 'Scope',
      pais: 'Country',
      regiao: 'Region',
      municipio: 'Municipality',
      regioesMeta: 'The regions published on the convergence rule.',
      pesquisaRotulo: 'Type the name of the concelho',
      pesquisaSemResultado: 'No concelho by that name.',
    },

    densidade: {
      rotulo: 'Density',
      relance: 'At a glance',
      leitura: 'Brief reading',
      abrir: 'open',
      fechar: 'close',
    },

    inicio: {
      cabeca: {
        paisA: 'Portugal · country',
        regiaoSufixo: ' · region',
        municipioSufixo: ' · municipality',
        municipioPalavra: ' · municipality · ',
        tituloPaisA: 'Portugal breaches ',
        tituloPaisUm: ' threshold of the Macroeconomic Imbalance Procedure and meets ',
        tituloPaisMuitos: ' thresholds of the Macroeconomic Imbalance Procedure and meets ',
        tituloPaisFim: '.',
        tituloEvora: 'The measures of the concelho, each with its own row.',
        tituloVazioA: 'Still no rows for ',
        tituloVazioB: '.',
        ledePais: {
          abre: 'Outside the threshold: ',
          separador: ', ',
          ultimo: ' and ',
          ano: ', in ',
          fecha: '.',
        },
        ledeRegiaoPartes: [
          'GDP per capita in purchasing power standards, with the EU-27 average fixed at ',
          { nl: '100', motivo: 'escala-de-instrumento' },
          '.',
        ],
        ledeVazioA: 'The point marks where the concelho sits on the official administrative map, and not coverage. When there are rows for ',
        ledeVazioB: ', they will appear here with their source and their reading date.',
        /* «district of », com o espaço final, como o par português. Os nomes de
           ilha da Carta ficam em português nas duas edições, como já acontece
           com «concelho»: são nomes próprios. */
        distritoDe: 'district of ',
      },

      movel: {
        abrirConcelho: 'Open a concelho',
        verRegiao: 'See a region',
        seloDaEscolha: 'Open the concelho chooser',
      },

      portas: {
        rotulo: 'The pages',
        abrir: 'the whole page',
        concelhos: ' concelhos',
        estudosA: ' works · ',
        estudosB: ' editions',
      },

      mapa: {
        linha: ' concelhos · CAOP ',
        acores: 'Azores',
        madeira: 'Madeira',
        escolher: 'Tap a point to choose the concelho.',
        readoutHint: 'Hover over a point to read the municipality.',
        tecladoHint:
          'Keyboard: Tab to the map, arrow keys to move between neighbouring municipalities, Home to return to Évora.',
        svgLabel: 'Point map of the municipalities of Portugal.',
        trocar: 'change concelho',
        paginaInteira: 'the whole page, with who governed it',
      },

      banda: {
        rotuloPartes: [
          'The convergence rule · EU-27 = ',
          { nl: '100', motivo: 'escala-de-instrumento' },
        ],
        svgLabel: 'Convergence rule: GDP per capita of each region against the European average.',
      },

      social: {
        titulo: 'European Social Scoreboard',
        porta: 'The ledger',
      },
    },

    estado: {
      foraDoLimiar: 'outside the threshold',
      dentroDoLimiar: 'within the threshold',
      semLimiar: 'no threshold',
      porConfirmar: 'unconfirmed',
    },

    cobertura: {
      temPagina: 'has a page',
      semPaginaAinda: 'no page yet',
      semLinhaAinda: 'no row yet',
    },

    municipios: {
      metaTitle: 'Municipalities · O Estado do País',
      metaDescription: 'Every concelho in Portugal, from the official administrative map.',
      eyebrow: 'Municipalities',
      h1: 'The concelhos of Portugal',
      lede: 'Every concelho, from the Carta Administrativa Oficial de Portugal.',
      coberturaA: ' of ',
      coberturaB: ' concelhos · ',
      fonteK: 'Where the list comes from',
      mapaLink: 'The map of concelhos',
      parcelaContinente: 'Mainland',
      parcelaAcores: 'Azores',
      parcelaMadeira: 'Madeira',
      parcelaTotal: 'Total',
      dadosK: 'The list as a file',
      dadosLink: 'download the data (CSV)',
    },

    home: {
      metaTitle: 'O Estado do País · Portugal, measured',
      metaDescription:
        'Portugal on the European scoreboards: the indicators, the thresholds and the sources.',

      numeros: {
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
        significadoV:
          'The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average. A value below the average means less purchasing power per person; a value above it, more.',
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
      valorAnteriorVh: 'previous value: ',
      valorNovoVh: 'new value: ',
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
      grupoCompletasK: 'Complete provenance',
      grupoPorConfirmarK: 'With fields to confirm',
      colunaValor: 'Value',
      colunaAfirmacao: 'Claim',
      colunaSelo: 'Provenance',
      contaAfirmacoes: 'claims',
      contaDerivadas: 'calculated',
      seloK: 'The two states of the seal',
      seloCheio: 'provenance complete',
      seloTracejado: 'one field unconfirmed',
      marcadorK: 'The marker',
      marcadorGloss: 'to verify',
      metodoLink: 'How this is made',

      convergenciaK: 'The convergence rule, as a file',
      conjuntoK: 'The ledger as a dataset',
      conjuntoEstado: 'Dataset prepared; the licence awaits the director’s decision.',
      conjuntoV: 'Every row, with every published field.',
      conjuntoDescarregar: 'Download the ledger',
      conjuntoLicenca: 'Published under',
      conjuntoAtribuicao: 'Attribution',
      conjuntoAmbito:
        'The licence covers the dataset: its structure, the house values, the derivations and the descriptions. Excerpts transcribed from sources remain under their publishers’ terms.',

      linha: {
        eyebrow: 'Ledger row',
        aparelhoK: 'Provenance',
        excertoNota: 'Transcribed from the source, word for word.',
        excertoPorConfirmar: 'The textual excerpt for this row has not been transcribed from the source yet.',
        excertoDerivada:
          'This row quotes no sentence: the value is calculated from other rows, and the documentary proof is theirs.',
        excertoDaCasa:
          'This row quotes no sentence because there is none to quote: the value is a count of this publication\'s own record, re-evaluated every time the site is built. No external document publishes it.',
        excertoAlojado:
          'This row quotes no sentence because the source publishes none: the value is the line count of the file this site hosts, above, and it is re-counted at every build.',
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
        dadosK: 'Access to the data',
        linhaEmJson: 'This row as JSON',
        conjuntoK: 'The whole dataset',
        noutroSitioK: 'This row elsewhere',
        noutraEdicao: 'This row in the Portuguese edition',
        provaK: 'Proof',
        publicadoPor: 'Published by',
        publicadoEm: 'in',
        publicadoPagina: 'p.',
        publicadoLido: 'read on',
        verificacoesK: 'Verifications',
        reconferidoK: 'Re-checked on',
        releituraPorta: 'The re-reading rule',
        verificacaoPor: {
          'leitura-independente': 'independent reading',
          'painel-semanal': 'weekly panel re-check',
          'revisao-cruzada': 'cross-family review',
        },
        verificacaoResultado: {
          igual: 'the same value',
          diverge: 'a different value:',
          inacessivel: 'source unreachable that day',
        },
        verificacaoPorta: 'Repeat the reading',
      },
    },

    municipio: {
      eyebrow: 'Municipality',
      metaCauda: 'the municipality, measured · O Estado do País',
      metaDescricaoA: 'What the sources publish about the municipality of ',
      metaDescricaoB:
        ': population, purchasing power, employment, enterprises, debt and budget execution.',
      relanceK: 'At a glance',

      breveK: 'Brief reading',

      distanciaK: 'The debt against the legal ceiling',
      distanciaLegenda:
        'The thin line is the total debt the regulator publishes for the concelho; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value.',
      distanciaIndiceA: 'The index is ',
      distanciaIndiceB: ' in ',
      distanciaIndiceC: ', against a legal cap of ',
      distanciaIndiceD: '.',
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
      tempoSerieB: ' in ',
      tempoSerieC: ' to ',
      tempoSerieD: ' in ',
      tempoSerieE: ', across the four years this page publishes.',
      tempoK: 'Who governed, and what the accounts recorded',
      tempoBandaK: 'Terms, in time',
      tempoBandaLegendaK: 'Open each term',
      tempoRelanceK: 'Debt index, from the first readable year to the last',
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

      metodoK: 'Method and caveats',
      naoSabeK: 'What this page does not know',
      provenienciaK: 'Provenance',
      estudosK: 'The works about this concelho',
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
      stubEdicoes: 'Editions',
      stubVoltar: 'Back to the archive',
      stubEstado: 'Draft · no content',
      stubForaK: 'Published outside this site',
      stubForaV: 'The link leaves this domain.',
      stubForaLink: 'Open the study',

      migradoEstado: 'Document hosted · page not yet written',

      leituraRelanceK: 'At a glance',
      leituraBreveK: 'Brief reading',
      leituraBreveRotulo: 'Brief reading · house prose, resting on a sentence of the study',
      leituraFundoK: 'Method and caveats',
      leituraOutraLingua: 'The same sentence in the other edition',
      municipioK: 'The concelho it is about',
      municipioLink: 'The municipality page',

      documentoK: 'The original document',
      documentoVazio: 'The document for this study has not been hosted here yet.',
      documentoLink: 'Read the document',
      documentoFaixa: 'Study document · edition of record',
      documentoVoltar: 'Back to the study page',

      textoEyebrow: 'Study document · text',
      textoLink: 'Read on the site',
      textoLinhasK: 'The rows of this document',
      textoLinhaK: 'engine row',
      textoValorK: 'the value as the row keeps it',
      textoImpressoK: 'as this document prints it',
      textoOrigemK: 'source digest',
      textoLinhaDoLivro: 'ledger row',
      textoPortaDaLinha: 'engine row',
      textoRegistoK: 'The content record',
      textoContaBlocos: 'blocks',
      textoContaAlgarismos: 'figures',
      textoContaComLinha: 'with a ledger row',

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
      corpo: 'The link may be wrong, or the page may have moved.',
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
