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

    /* -----------------------------------------------------------------------
     * A FRASE DE IDENTIDADE (Emenda 18, 25.08.2026)
     * -----------------------------------------------------------------------
     * «O sítio tem um nome e uma frase de identidade, por baixo da marca na
     * primeira página e em mais lado nenhum; a frase nomeia o que o sítio é e
     * não diz quem o faz nem como.» São as palavras do diretor, e não se
     * compõem aqui: entram tal como ele as escreveu, nas duas edições.
     *
     * É o nome da publicação dito por extenso, e é por isso que o inventário a
     * classifica em NAVEGAÇÃO e não em autorreferência: não fala do método, da
     * verificação nem das intenções da casa (Emenda 15), fala do que a coisa é.
     * Não leva porta, não leva algarismo, não leva selo.
     */
    identidade: 'Um observatório de Portugal.',

    nav: {
      inicio: 'Início',
      municipios: 'Municípios',
      /* «Domínios» entra no rodapé no commit em que as páginas dos domínios
         ganham porta comum (bloco F1.2, segunda passagem, 03.09.2026). A mesma
         razão das «Áreas» ao lado: o rodapé é o índice do sítio, e uma família
         de páginas que existe e não está nele é uma família sem porta comum. O
         menu do cabeçalho fica para depois do F1.1. */
      dominios: 'Domínios',
      /* «Áreas» entra no rodapé no commit em que as páginas das áreas são
         construídas. O rodapé é o índice do sítio (ver `SiteFooter.astro`), e
         uma família de páginas que existe e não está nele é uma família sem
         porta comum. */
      areas: 'Áreas',
      /* AS TRÊS FAMÍLIAS QUE EXISTIAM SEM PORTA NO MENU (F1.1, item 11,
         03.09.2026). As páginas das regiões, dos distritos e das áreas estão
         construídas desde 28 e 29.08.2026 e só se alcançavam pelo rodapé ou por
         uma ligação de dentro de outra página. O menu é o índice do sítio que
         está sempre à vista, e uma família de páginas que ele não nomeia é uma
         família que o leitor não sabe que existe. «Áreas» já tinha cadeia (era
         a do comando de âmbito e do rodapé) e passa a ser lida também aqui; as
         duas novas são os nomes das outras duas famílias, na mesma gramática:
         o plural do que a página lista, e mais nada. */
      regioes: 'Regiões',
      distritos: 'Distritos',
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
      /* A LEITURA FICA, O VERBO SAI (V2, decisão do lugar de direção, 27.08.2026).
         Dizia «Painel europeu reconferido a <data>», em todas as páginas: o nome
         da coisa e a data são o que o leitor precisa, e «reconferido» é a casa a
         dizer que fez o seu trabalho. A Emenda 18 tira isso da página do leitor.
         O estado de atraso continua a dizer-se, porque é o estado e não a
         diligência. */
      reconferido: 'Painel europeu ·',
      vencido: 'Painel europeu em atraso ·',
      /* A SEGUNDA LEITURA DO CABEÇALHO (01.09.2026, o corredor diário).
         «Fontes ·» e a data, na mesma forma das outras duas leituras: rótulo,
         valor, porta. O verbo fica de fora, como a V2 o tirou da primeira («o
         nome da coisa e a data são o que o leitor precisa, e "reconferido" é a
         casa a dizer que fez o seu trabalho»; Emenda 18e). Isto é o estado das
         fontes e não a diligência da casa: o que muda todos os dias é a data,
         e quando ela deixa de mudar é isso que o leitor tem de ver. */
      fontes: 'Fontes ·',
      fontesVencidas: 'Fontes em atraso ·',
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
      /* O RÓTULO COM QUE A FONTE PUBLICA A FIGURA, e onde no ficheiro alojado
         ele foi lido (29.08.2026). O rótulo do campo é da casa e diz-se na
         língua da página; o rótulo em si é da fonte, não se traduz, e leva a
         marca da sua língua. */
      rotuloDaFonte: 'Nome na fonte',
      rotuloOnde: 'Onde no ficheiro',
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
        'O que está a ser medido, o que se segue, e o critério que pôs lá cada coisa. Com o calendário do que as fontes publicam a seguir.',
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
        'A pergunta está registada em inglês, palavra por palavra; o português é a edição portuguesa dessa mesma pergunta.',
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
      calendarioLede: 'O que as fontes citadas publicam a seguir.',
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
      /* «Região» SAI DO COMANDO POR AGORA (correções de UX, bloco A, item A2).
         O estado `?ambito=regiao:<slug>` continua a resolver, porque é endereço
         partilhável (Emenda 7), e rende a leitura da região que já existe; o que
         sai é a terceira posição do comando, enquanto não houver a página das
         regiões. A cadeia fica aqui, com esta nota, porque volta ao comando no
         dia em que essa página existir. */
      regiao: 'Região',
      /* «ÁREAS» É UMA PORTA, COMO «REGIÃO» (decisão 6 da auditoria de 25.08).
         Não é um estado do endereço: não existe `?ambito=area:<slug>` e não vai
         existir, porque uma área vive na sua página, como a região desde a
         Emenda 21b e o concelho desde a Emenda 19a. */
      area: 'Áreas',
      /* «CONCELHO» E NÃO «MUNICÍPIO» (bloco A, item A2). É a palavra que o resto
         da primeira página já usa — a pesquisa diz «Escreva o nome do concelho»,
         a legenda do mapa diz «308 concelhos» —, e um comando que chama à mesma
         coisa outro nome faz o leitor procurar duas coisas. Na edição inglesa
         fica «Municipality»: «concelho» por traduzir na interface inglesa é um
         defeito à parte (C12), e é do bloco B. */
      municipio: 'Concelho',
      /* `regioesMeta` SAIU (Emenda 21b, 27.08.2026). Era a meta da fila das
         regiões, o painel que o comando «Região» abria; a fila saiu a 25.08 e o
         comando voltou a 27.08 como LIGAÇÃO para `/regioes`, sem painel nenhum
         por baixo. Uma cadeia sem superfície é uma promessa de que a coisa
         volta, e esta não volta: a fila das regiões foi substituída pela régua
         completa da página das regiões. Registada em `CHAVES-EN.md`. */
      pesquisaRotulo: 'Escreva o nome do concelho',
      pesquisaSemResultado: 'Nenhum concelho com esse nome.',
      /* O COMANDO DA BUSCA, QUE PASSOU A SER UM `<form>` (F1.1, item 12).
         Sem guião a caixa não filtrava nada e a página não tinha maneira de
         levar a lado nenhum: agora a busca é um formulário com destino, e o
         destino é o índice dos 308, que existe e é a resposta à mesma pergunta.
         A palavra nomeia o que o botão faz, e mais nada. */
      pesquisaSubmeter: 'Procurar',
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
        /* AS CADEIAS DOS DOIS BLOCOS DE CONCELHO SAÍRAM (Emenda 19a, 26.08.2026).
           Eram `municipioSufixo`, `municipioPalavra`, `tituloEvora`,
           `tituloVazioA`, `tituloVazioB`, `ledeVazioA` e `ledeVazioB`: o rótulo,
           a manchete e a lede do bloco de Évora e do bloco do concelho sem
           linhas. Os dois blocos pertenciam a estados `?ambito=municipio:<slug>`
           que deixaram de existir, e uma cadeia sem superfície é uma promessa que
           ninguém pode ler. Cada uma está registada em `CHAVES-EN.md`. */
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
        /* `ledeRegiaoPartes` SAIU (Emenda 21b, 27.08.2026). Era a lede dos
           cinco blocos de cabeça das regiões, e dizia o que o índice compara. Os
           blocos saíram com os estados que os acendiam, e a mesma coisa dita
           melhor está na página das regiões, por baixo do instrumento
           (`home.instr1.significadoV`), uma vez e não cinco. Registada em
           `CHAVES-EN.md`. */
        /* O prefixo do distrito (ISSUES I18, subetapa 2g). A Carta escreve
           «Beja» e «Ilha do Faial»; a etiqueta de Évora, que vem de
           `municipios.mjs`, escreve «distrito de Évora». A regra é uma só para
           os 308: prefixo quando o campo é um distrito, nome de ilha nu quando
           começa por «Ilha». O prefixo é uma cadeia validada, e o servidor diz
           em `data-ilha` a qual dos dois casos cada concelho pertence; o script
           só troca `hidden`. */
        distritoDe: 'distrito de ',
      },

      /**
       * ---------------------------------------------------------------------
       * A FAIXA (bloco «a cabeça nova como contentor», 01.09.2026)
       * ---------------------------------------------------------------------
       * UMA CADEIA SÓ, e é o nome da faixa: o que a coisa é, na forma da Emenda
       * 18 e na gramática do nome do mapa («Mapa dos distritos e das ilhas de
       * Portugal, com uma área por unidade.»), que diz o que o desenho é e como
       * está feito, e não como se usa nem porque confiar.
       *
       * É ELA QUE SUBSTITUI «ÂMBITO» E «DENSIDADE» NA CABEÇA. As duas palavras
       * eram vocabulário da casa a nomear dois comandos, e o comando saiu da
       * cabeça; o que fica na cabeça, entre a manchete e o mapa, é a faixa, e
       * uma lista precisa de um nome para quem a ouve. O nome não se vê: é o
       * `aria-label` da lista, como o do mapa, porque um rótulo à vista por cima
       * dos cartões custaria a linha de ecrã que este bloco existe para poupar.
       * A escolha está no relatório do construtor, com as alternativas.
       *
       * NÃO NOMEIA O LUGAR, e é uma decisão medida: «As medidas de Portugal» na
       * primeira página obrigaria a «As medidas de Évora» nas 308 e a «As
       * medidas do Alentejo» nas 9, com a preposição a contrair-se por nome, e a
       * régua da voz lê os `aria-label` desde a I79 — seriam 318 frases novas no
       * inventário. O lugar já está dito no rótulo da cabeça e na manchete, a
       * três linhas de distância.
       */
      faixa: {
        rotulo: 'As medidas, uma por cartão',
        /* «1 de 21», A POSIÇÃO DE CADA CARTÃO NA FAIXA (F1.1, item 5).
           Uma faixa que se percorre de lado não diz quantos cartões tem nem
           onde o leitor está nela, e a auditoria de 25.08 leu isso como uma
           corrida sem fim. A posição vai em CADA cartão, e não numa linha só
           por cima da faixa, por uma razão da casa e não de gosto: uma linha
           única teria de mudar de algarismo enquanto o leitor rola, e o guião
           desta página não compõe números («o código de execução escolhe
           cadeias já validadas e nunca compõe um número»). Com a posição
           escrita em cada cartão, o que o leitor vê é sempre verdade, e é
           verdade sem guião nenhum.

           O SEPARADOR É A ÚNICA CADEIA: o ordinal vai marcado
           `data-nonledger="numeracao"`, que é o motivo do registo para a
           numeração de secções e de instrumentos, e o total é a chave da prova
           `faixa_cartoes`, que o portão de HTML reconta das duas listas. */
        de: ' de ',
      },

      /* AS TRÊS CADEIAS DO TELEMÓVEL FICAM SEM SUPERFÍCIE (bloco A, itens A2 e
         A4). Os dois destinos («Abrir um concelho →», «Ver uma região →») foram
         substituídos pelo comando único das duas larguras, e o selo do país saiu
         com o mapa, que abaixo de 640 deixa de se render enquanto os concelhos
         não tiverem página. As cadeias ficam, e a razão é a Emenda 3: a forma do
         telemóvel que elas nomeiam volta com o mapa por distritos. */
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
        /* O nome da terceira parcela da Carta, para o cabeçalho da lista de
           nomes por baixo do mapa (I81, 27.08.2026). As outras duas já existiam
           porque têm moldura; esta não tem, e a lista passou a ser por parcela. */
        continente: 'Continente',
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
        /* O NOME DO MAPA DA PRIMEIRA PÁGINA, QUE MUDOU DE DESENHO (Emenda 20).
           O mapa de pontos fica onde a Emenda 20d o deixa, no cartão localizador
           da página do concelho, e continua com o `svgLabel` acima. O da
           primeira página passa a ser as 29 unidades da Carta como áreas, e o
           seu nome diz isso: o que a coisa é, e não como se usa. */
        distritosLabel: 'Mapa dos distritos e das ilhas de Portugal, com uma área por unidade.',
        /* AS DUAS GAVETAS DO MAPA (01.09.2026). A afinação 1 do brief da forma
           dos domínios recolhe no mapa a busca e a lista dos nomes, e cada uma
           fica atrás de um `<summary>`. As duas cadeias nomeiam o que está do
           outro lado, e não o gesto: «Os nomes no mapa» é a lista das 29
           unidades que o desenho tem, e «Um concelho pelo nome» é a busca dos
           308. Nenhuma diz «abrir», «tocar» ou «escolher», que seria a casa a
           ensinar o leitor a usar um `<details>`. */
        nomesGaveta: 'Os nomes no mapa',
        buscaGaveta: 'Um concelho pelo nome',
        /* «trocar de concelho» rende-se no cartão localizador, que vive na
           página do concelho, e leva ao índice dos 308. `paginaInteira` («a
           página inteira, com quem governou») saiu com a Emenda 19a: era a
           segunda porta desse cartão, escondida do servidor e acesa pelo script
           quando o concelho escolhido tinha página, e onde o cartão se rende ela
           apontava para a página em que já se está. */
        trocar: 'trocar de concelho',
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
       * OS DOIS PAINÉIS LEVAM O NOME DA SUA FONTE (decisão do diretor, 29.08.2026).
       *
       * As peças grandes vinham sem nome nenhum e a lista compacta vinha com
       * nome e sem contagem, e o par lia-se como uma corrida de cartões seguida
       * de uma lista com título, sem se perceber que são dois painéis de duas
       * instituições. Cada um leva agora a mesma linha: o nome que a fonte lhe
       * dá, o ponto, e quantas medidas dele estão ali.
       *
       * O NOME É O DA FONTE E A CONTAGEM VEM DA PROVA. Nenhuma das duas cadeias
       * é uma frase sobre o sítio: a primeira metade é como a instituição chama
       * ao painel, e o algarismo do meio é um `<ValorDaProva>` que o portão
       * reconta (`painel_com_limiar` e `painel_social_total`). O que fica escrito
       * aqui é só o que está à volta do algarismo.
       *
       * OS ESPAÇOS ESTÃO DENTRO DAS CADEIAS, e não é descuido: entre uma expressão
       * e um elemento, uma mudança de linha do gabarito não é um espaço, e as duas
       * metades colavam-se ao algarismo. É a mesma forma da manchete, que escreve
       * «Portugal ultrapassa » com o espaço lá dentro pela mesma razão.
       */
      painel: {
        nomeA: 'Procedimento dos Desequilíbrios Macroeconómicos · ',
        nomeFim: ' medidas com limiar',
      },
      social: {
        titulo: 'Painel Social Europeu · ',
        tituloFim: ' medidas',
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
         não tem uma linha para ela. É o que cada peça vazia diz
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
      /* A CHAVE `comPaginaK` SAIU (bloco dos 308, P2). Era o título da secção
         que listava os concelhos com página antes da lista por distritos, e
         existia porque um em 308 a tinha. Com os 308 construídos, essa secção
         era a lista inteira repetida por cima da lista inteira, e saiu com o
         seu título. As duas palavras do estado ficam em `s.cobertura`. */
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
     * AS 29 UNIDADES DA CARTA (Emenda 20, 27.08.2026).
     *
     * O índice e a página de cada uma. Os nomes das unidades e dos concelhos são
     * da Carta e nunca destas cadeias: o que está aqui é a mobília à volta
     * deles. As duas palavras de tipo («distrito», «ilha da Região Autónoma»)
     * são as que a Carta e a Constituição dão às duas naturezas que a lista tem,
     * e o servidor escolhe entre elas pelo campo `tipo` do artefacto, nunca por
     * uma leitura do nome.
     */
    distritos: {
      metaTitle: 'Distritos e ilhas · O Estado do País',
      metaDescription: 'Os distritos e as ilhas de Portugal, pela Carta Administrativa Oficial.',
      eyebrow: 'Distritos e ilhas',
      h1: 'Os distritos e as ilhas de Portugal',
      lede: 'As unidades da Carta Administrativa Oficial de Portugal, e os concelhos de cada uma.',
      /* A cauda do `<head>` de uma unidade, composta com o nome dela. Sem
         algarismos, como a das páginas de concelho. */
      metaCauda: 'os concelhos · O Estado do País',
      metaDescricaoA: 'Os concelhos de ',
      metaDescricaoB: ', pela Carta Administrativa Oficial de Portugal.',
      tipoDistrito: 'distrito',
      tipoIlha: 'ilha da Região Autónoma',
      concelhosK: 'Os concelhos',
      /* O rótulo do bloco da fonte, por baixo do mapa de uma unidade. Era o de
         `/municipios` («De onde vem a lista»), e ali o objecto é a lista; aqui o
         objecto é o desenho, e a Emenda 20e manda a menção da fonte para onde o
         mapa está. */
      fonteK: 'De onde vem o desenho',
      /* A contagem das 29, no índice, com a chave da prova ao lado. A contagem
         de cada unidade NÃO se rende (a razão está em `DistritoView.astro`), e
         por isso não há aqui uma cadeia para ela. */
      contaUnidades: ' distritos e ilhas',
      /* O nome acessível do desenho de uma unidade. Nomeia o que a coisa é, e
         não como se usa: as portas estão nas áreas e na lista. */
      mapaLabel: 'Mapa dos concelhos, com uma área por concelho.',
      /* A LEGENDA DO MAPA DE UMA UNIDADE NÃO É A DA PRIMEIRA PÁGINA. Ali a
         legenda é «308 concelhos · CAOP 2025 ■ fonte», que a Emenda 17 fixa;
         aqui, por baixo de um mapa com dezasseis áreas, a contagem dos 308 lia-se
         como a contagem do que está desenhado. Fica o que a legenda tem de ter: o
         nome da Carta, o ano da edição e o selo que abre a linha. O nome é o
         oficial e não se traduz, como a lede de `/municipios` já faz nas duas
         edições. */
      legendaCarta: 'Carta Administrativa Oficial de Portugal · ',
      voltarIndice: 'Os distritos e as ilhas',
      voltarConcelhos: 'Os concelhos de Portugal',
    },

    /**
     * ------------------------------------------------------------------
     * AS REGIÕES (Emenda 21, 27.08.2026)
     * ------------------------------------------------------------------
     * O índice `/regioes` e a página de cada região. Nenhuma destas cadeias
     * traz um algarismo: a contagem entra por `data-prova` e os valores por
     * `<Claim/>`, como em todas as outras páginas do sítio.
     *
     * «UE-27» ESCREVE-SE NA PROSA e não vai debaixo de `data-nonledger`: é o
     * nome do agregado, como «CAOP 2025» é o nome de uma edição da Carta, e
     * `significadoV` já o escreve assim desde a etapa 2.
     *
     * A CONTAGEM TEM DUAS FORMAS, uma e muitas, e o SERVIDOR escolhe a certa
     * com a chave que o portão reconta. Enquanto as regiões forem as cinco de
     * hoje só se lê a segunda; no dia em que o motor trouxer a primeira sozinha,
     * a página não diz «1 regiões».
     */
    regioes: {
      metaTitle: 'Regiões · O Estado do País',
      metaDescription:
        'As regiões NUTS II de Portugal, e a distância de cada uma à média da UE-27.',
      eyebrow: 'Regiões',
      h1: 'As regiões de Portugal',
      lede: 'O índice de PIB per capita de cada região, em paridades de poder de compra, contra a média da UE-27.',
      /* A CONTAGEM NOMEIA AS REGIÕES E NÃO A PUBLICAÇÃO (leitura cruzada do
         Codex, 28.08.2026). Dizia «5 regiões com linhas publicadas.», e «com
         linhas publicadas» é a casa a falar da sua própria cobertura, que é o
         que a Emenda 15 manda sair de uma página do leitor. O que fica é o
         número e o que ele conta. */
      contaUma: ' região',
      contaMuitas: ' regiões',
      /* A cauda do `<head>` de uma região, composta com o nome dela, como a das
         páginas de concelho e de distrito. */
      metaCauda: 'região · O Estado do País',
      metaDescricaoA: 'O índice de PIB per capita de ',
      metaDescricaoB: ', em paridades de poder de compra, contra a média da UE-27.',
      /* O tipo da coisa, e não o que fizemos com ela (Emenda 18b). «NUTS II» é a
         nomenclatura da fonte, escrita como a fonte a escreve. */
      tipo: 'região NUTS II',
      /* Os nomes das duas peças. A distância é uma linha derivada do livro-razão,
         com a sua conta e o seu selo, e não uma subtracção feita na página. */
      pecasK: 'As medidas',
      indiceK: 'Índice de PIB per capita',
      distanciaK: 'Distância à média da UE-27',
      /* A unidade da peça da distância. O índice traz a sua de
         `home.instr1.glanceUnidade`, que é a mesma do instrumento. */
      distanciaUnidade: 'pontos do índice',
      voltarIndice: 'As regiões de Portugal',
      voltarPais: 'Portugal',
    },

    /**
     * OS DOMÍNIOS DA CARTA (bloco F1.2, 03.09.2026).
     *
     * O nome de cada domínio não está aqui: está em `src/data/dominios.mjs`,
     * como o da região está em `regioes.mjs` e o da área em `areas.mjs`. O que
     * está aqui é a mobília à volta dele, e as palavras da manchete que não são
     * algarismos.
     *
     * A LEDE NÃO EXISTE, e é a mesma razão das áreas: uma frase que dissesse o
     * que um domínio é, ou quantos o sítio cobre, seria o sítio a explicar-se
     * (Emenda 15). O índice diz os nomes e o estado de cada um; a página diz a
     * fronteira, que é conteúdo e não método.
     *
     * O ESTADO DE UM DOMÍNIO É VOCABULÁRIO FECHADO, como o de cobertura de um
     * concelho: três cadeias, declaradas uma vez, e a marca `data-dominio-estado`
     * para que a régua da voz as conte por conta própria em vez de as ler como
     * prosa nova em dezoito linhas.
     */
    dominios: {
      metaTitle: 'Domínios · O Estado do País',
      /* A DESCRIÇÃO NÃO FALA DO SÍTIO (Emenda 15). A primeira redação nomeava a
         casa a si própria («… sobre as quais este obs…»), e o portão da voz
         apanhou-a pelo marcador da autorreferência: a descrição do `<head>` é
         superfície pública desde a etapa 3, e o que ela diz é o que a página
         tem, não quem a publica. */
      metaDescription:
        'As áreas da vida do país com medidas publicadas, e as que ainda não têm medidas conferidas.',
      eyebrow: 'Domínios',
      h1: 'Por domínio',
      estadoNoAr: 'no ar',
      estadoDentroDe: 'as medidas estão em',
      estadoSem: 'ainda sem medidas conferidas',
      vagaPrimeira: 'primeira vaga',
      vagaSegunda: 'segunda vaga',
      vagaTerceira: 'terceira vaga',
      metaCauda: 'domínio · O Estado do País',
      metaDescricaoA: 'As medidas de ',
      metaDescricaoB: ', com a fonte, o período e a data de cada uma.',
      tipo: 'domínio da carta dos conteúdos',
      fronteiraK: 'A fronteira deste domínio',
      ausenciaK: 'Sem número público',
      ausenciaResposta: 'Não há número público para isto.',
      ausenciaProcurado: 'procurado em',
      /* Os três rótulos das três datas. São nomes de campos do livro-razão, e a
         página da linha já lhes chama assim: «período», «lido», «conferido». */
      dataPeriodo: 'período',
      dataLido: 'lido',
      dataConferido: 'conferido',
      fonteK: 'fonte',
      mapaSemValor: 'sem valor publicado',
      mapaMenosDe: 'menos de ',
      mapaA: ' a ',
      mapaOuMais: ' ou mais',
      /* A NOTA DA ESCALA (segunda passagem, 03.09.2026, Blocking 3). Só se
         rende no mapa cuja paleta é `escala`: as suas classes são marcas
         redondas na unidade da medida, e não um limiar publicado, ao contrário
         do mapa cuja paleta é `limiar` (o índice de dívida contra o teto
         legal), que fica ao lado dele com a mesma forma visual. Sem a frase, a
         diferença entre as duas paletas só se lê pela cor. */
      mapaEscalaNota: 'As classes são marcas redondas da escala, e não um limite oficial.',
      porConcelhoPorta: 'Os valores concelho a concelho →',
      /* A ALTERNATIVA EM TEXTO DO MAPA, DENTRO DA PÁGINA (segunda passagem,
         03.09.2026, Major 7): uma tabela com os valores de cada concelho,
         recolhida na própria página e não só uma porta para outro sítio. SEM
         ALGARISMO: uma contagem escrita aqui seria um número da casa sem
         `data-prova`, e o `<details>` já diz «concelho a concelho», que é o
         que a tabela é. */
      mapaTabelaAbrir: 'Os valores, concelho a concelho',
      mapaTabelaConcelho: 'Concelho',
      mapaTabelaValor: 'Valor',
      voltarIndice: 'Os domínios',
      voltarPais: 'Portugal',
    },

    /**
     * AS ÁREAS DE GOVERNO (decisão 6 da auditoria de 25.08.2026, forma A).
     *
     * O nome de cada área não está aqui: está em `src/data/areas.mjs`, tal como
     * o Governo o publica nas duas edições, e é o mesmo caso do nome de uma
     * região. O que está aqui é a mobília à volta dele.
     *
     * A LEDE DIZ O QUE UMA ÁREA É, e mais nada. Não diz quantas áreas o sítio
     * cobre nem porque é que estas e não outras: isso seria o sítio a falar da
     * sua própria cobertura, que é o que a Emenda 15 manda sair de uma página do
     * leitor.
     *
     * A DESCRIÇÃO DO `<head>` MUDOU COM A REGRA (28.08.2026). Dizia «os
     * trabalhos e as medidas publicados pelos ORGANISMOS de …», que era a regra
     * antiga a falar: a área de uma peça era a de quem publicava o número. A
     * regra passou a ser o assunto, e a frase diz o que a página tem. A razão
     * pela qual cada peça está onde está deixou de precisar de ser dita ao
     * leitor: é o assunto dela, e ele vê-o. Está escrita, matéria a matéria, em
     * `src/data/areas.mjs`, com o número da lei transcrito ao lado.
     */
    areas: {
      metaTitle: 'Áreas de governo · O Estado do País',
      eyebrow: 'Áreas de governo',
      /* O TÍTULO É O EIXO E NÃO A LISTA (28.08.2026). Dizia «As áreas de
         governo» sobre uma lista de nove das dezasseis, e um título assim
         promete a lista oficial inteira; corrigi-lo com uma frase seria uma
         frase de cobertura, que é o que não pode estar numa página do leitor.
         «Por área de governo» é uma das entradas do sítio, como «por região».
         A lede, que definia o que uma área é, saiu com ele. */
      h1: 'Por área de governo',
      /* Uma ou muitas, escolhidas na construção com a contagem que o portão vai
         reconferir. Sem plural inventado.

         «PEÇA» SAIU (DECISIONS.md §1.98, 04.09.2026). O vocabulário fechado da
         casa tem «estudo» para um trabalho de autor, «medida» para uma medida e
         «linha do livro-razão» para uma linha; «peça» e «indicador» saem. Esta
         contagem soma as três famílias que a página de uma área lista (os
         trabalhos, os estudos de dados e as medidas), e as três dizem-se com
         duas palavras do vocabulário: são estudos e são medidas. A forma
         singular é «estudo ou medida» porque com uma só não se sabe qual das
         duas é, e escolher uma seria adivinhar.

         O bloco F1.4 tinha DEFINIDO a palavra nesta página, que era a outra
         saída que o brief dava; a decisão do diretor chegou a meio do bloco e
         fecha-a: a palavra sai, e com ela sai a definição. O resto do sítio é do
         bloco F1.10. */
      contaUma: ' estudo ou medida',
      contaMuitas: ' estudos e medidas',
      /* A cauda do `<head>` de uma área, composta com o nome dela, como as das
         páginas de região e de concelho. A DESCRIÇÃO DEIXOU DE SER UMA FRASE:
         é o nome da área, e mais nada. As duas cadeias que a compunham saíram a
         28.08.2026, porque diziam o método do sítio na superfície pública. */
      metaCauda: 'área de governo · O Estado do País',
      /* O tipo da coisa, e não o que fizemos com ela (Emenda 18b). */
      tipo: 'área do XXV Governo Constitucional',
      trabalhosK: 'Os trabalhos',
      conjuntosK: 'Os estudos de dados',
      medidasK: 'As medidas',
      /* A porta do texto de um trabalho, quando ele existe nesta edição. */
      textoDoTrabalho: 'O texto',
      voltarIndice: 'As áreas de governo',
      voltarLivro: 'O livro-razão',
      voltarConcelhos: 'Os concelhos',
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

    /**
     * O LIVRO-RAZÃO DO CONJUNTO DOS CONCELHOS (decisão D6 do diretor,
     * 26.08.2026). O título da página é o nome do estudo, e vem de
     * `src/data/studies.mjs`: escrevê-lo aqui outra vez seriam dois nomes para a
     * mesma coisa. O que vive aqui são as palavras à volta das contagens e as
     * portas de saída.
     */
    livroConcelhos: {
      metaTitle: 'Concelhos · Livro-razão · O Estado do País',
      /* A DESCRIÇÃO NOMEIA A PÁGINA (27.08.2026), como a do índice do
         livro-razão. Dizia «As linhas do livro-razão com as medidas que as
         fontes centrais publicam para cada concelho, uma linha cada.», que
         explica a cobertura da página em vez de a nomear, e o `<head>` é
         superfície pública como o corpo. Sai também no Open Graph, que é a
         mesma cadeia. */
      metaDescription: 'Livro-razão dos concelhos · O Estado do País',
      /* A LEDE SAIU (decisão do diretor, 27.08.2026). Dizia «Uma linha por
         medida e por concelho, com o valor tal como a fonte o publicou, a
         unidade, quem o produziu e a data em que foi lido.»: é o que uma linha
         guarda, dito numa página do leitor. O que uma linha guarda lê-se na
         linha, e o método vive no Método (Emenda 15). A página fica com o
         título, as contagens, a pesquisa e as linhas.
         A `contaCompletas` saiu com ela: «com proveniência completa» é a
         escrituração da casa, e as linhas por confirmar levam o seu marcador e
         estão listadas em `/a-verificar`. As duas contagens que ficam nomeiam o
         que a página tem. */
      contaLinhas: 'linhas',
      contaConcelhos: 'concelhos',
      naoDeclaradasK: 'Linhas sem concelho declarado',
      voltarLivro: 'O livro-razão inteiro',
      indiceLink: 'O índice dos concelhos',
      /* A PÁGINA DE UM CONCELHO NO LIVRO-RAZÃO (diretor, 26.08.2026). O título é
         o nome do concelho; estas são as palavras à volta. A cauda do `<head>`
         não pode ter algarismos, e não tem. */
      metaCaudaDoConcelho: 'as linhas do livro-razão · O Estado do País',
      metaDescricaoDoConcelhoA: 'As linhas do livro-razão com as medidas que as fontes centrais publicam para o concelho de ',
      metaDescricaoDoConcelhoB: '.',
      /* A LEDE DA PÁGINA DE UM CONCELHO SAIU, PELA MESMA DECISÃO. Dizia «Uma
         linha por medida, com o valor tal como a fonte o publicou, a unidade,
         quem o produziu e a data em que foi lido.» A página fica com o nome do
         concelho, o nome do estudo e as suas linhas. */
      /* A AUSÊNCIA EM DUAS PALAVRAS (Emenda 15; item E13). Dizia «Ainda não há
         linhas deste estudo para este concelho.», que é uma frase a explicar uma
         ausência que a casa já diz em duas palavras: «sem linha ainda», «sem
         página ainda». Aqui são linhas, e por isso o plural. */
      vazioDoConcelho: 'Sem linhas ainda.',
      /* O NOME DA SECÇÃO DA LINHA QUE NÃO É DE NENHUM CONCELHO. O teto legal é
         uma constante da lei, e é contra ela que os índices de dívida se
         calculam: é a referência do estudo, e não a medida de um concelho. */
      referenciaK: 'A referência do estudo',
      paginaDoConcelho: 'A página do concelho',
      voltarAoIndice: 'Os concelhos no livro-razão',
    },

    livro: {
      metaTitle: 'Livro-razão · O Estado do País',
      /* A DESCRIÇÃO DO `<head>` NOMEIA A PÁGINA (decisão do diretor,
         27.08.2026). Dizia «Todas as afirmações publicadas neste sítio, uma
         linha cada: o valor tal como foi publicado, a fonte, o documento, o
         endereço, a data de acesso e o excerto.», que é o método do sítio na
         superfície pública, e o `<head>` é superfície pública como o corpo. O
         gabarito pede uma descrição, e a decisão diz de que feitio ela é: o nome
         da página, e nunca o método. */
      metaDescription: 'Livro-razão · O Estado do País',
      eyebrow: 'Livro-razão',
      h1: 'O livro-razão',
      /* A LEDE SAIU, COM A MESMA DECISÃO. Dizia «Uma linha por número publicado.
         Cada linha guarda o valor tal como a fonte o publicou, quem o produziu,
         o documento e a edição, o endereço, a data em que o lemos e um excerto
         textual (e, quando o número é calculado por nós, a conta explicada e
         reavaliada a cada construção).» É o que uma linha guarda, e uma linha
         guarda-o à vista de quem a abre: o índice fica com o título, as
         contagens e as suas linhas. */
      /* AS DUAS NOTAS DE GRUPO SAÍRAM (decisão da direção, 21.08.2026, tarde).
         Diziam «Todos os campos preenchidos e conferidos contra a fonte. O selo
         é um quadrado cheio.» e «Falta pelo menos um campo de proveniência. O
         campo fica marcado, e nenhum foi preenchido com um valor plausível. O
         selo é um quadrado a tracejado.» — as duas únicas frases de
         autorreferência que o inventário contava nesta rota: a casa a dizer o
         que fez e a explicar o seu próprio selo. O nome do grupo diz o estado, e
         o estado é o que a página tem para dizer. */
      /* OS DOIS TÍTULOS DE GRUPO SAÍRAM, E OS GRUPOS COM ELES (decisão do
         diretor, 27.08.2026). Diziam «2544 de 2552 linhas com proveniência
         completa» e «8 de 2552 linhas com campos por confirmar»: é a
         escrituração da casa, e não o conteúdo do índice. As linhas por
         confirmar levam o seu marcador, e estão listadas em `/a-verificar`. As
         chaves `contaDe`, `grupoCompletasFrase` e `grupoPorConfirmarFrase`
         saíram com a forma que as pedia, como `grupoCompletasK` e
         `grupoPorConfirmarK` tinham saído no item B7. As duas chaves da prova
         que as contavam, `indexaveis` e `divida`, continuam na tabela da prova e
         continuam recontadas pelo portão: o portão exige saber CONTAR cada
         chave, e não que alguma página a renda. */
      colunaValor: 'Valor',
      colunaAfirmacao: 'Afirmação',
      colunaSelo: 'Proveniência',
      /* As contagens deste índice, pelas chaves da prova que já existem
         (`src/lib/prova.mjs`). São números do próprio sítio (IDENTIDADE.md §10):
         entram por `data-prova`, o portão reconta-os por conta própria, e cada um
         leva a sua porta. As palavras ao lado nomeiam o que é contado. */
      contaAfirmacoes: 'afirmações',
      /* O DENOMINADOR DAS DUAS PARCELAS (bloco F1.4, 04.09.2026). Uma palavra
         só, entre a parcela e o total: «330 de 2916 calculadas». O total é a
         mesma chave da prova que abre a linha, rendida outra vez com a sua
         marca, e não um número escrito aqui. */
      contaDe: 'de',
      contaDerivadas: 'calculadas',
      /* A porta da página do conjunto dos concelhos, no índice. Nomeia o que
         está do outro lado, e mais nada. */
      contaConcelhos: 'linhas de concelhos',
      concelhosPorta: 'Concelhos',
      /* A BUSCA DO ÍNDICE (bloco F1.4, 04.09.2026). Três cadeias: o rótulo do
         campo, que diz o que se escreve nele e por que campos a comparação se
         faz; o botão, que é o mesmo verbo da pesquisa dos concelhos; e o estado
         vazio, que só o guião acende. */
      buscaRotulo: 'Procurar por nome, identificador ou fonte',
      buscaSemResultado: 'Nenhuma linha do livro-razão tem essas palavras.',
      /* O RÓTULO DA FILA DE RESULTADOS (segunda passagem, Major 6). A busca
         passou a cobrir as 2 916 linhas e não as 149 que a página lista: os
         resultados são uma fila de portas, e a fila diz o que é. */
      buscaResultadosK: 'Linhas que casam',
      /* Quando há mais resultados do que os que cabem na fila. Diz-se por
         palavras e não por um número: uma contagem de resultados é um número que
         a casa escreveria sem linha. */
      buscaMais: 'Há mais linhas do que as que cabem aqui. Escreva mais para estreitar.',
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
      /* NOMEIA O QUE SE DESCARREGA, E NÃO O QUE ESTÁ COMPLETO (27.08.2026).
         Dizia «Todas as linhas, com todos os campos publicados.», que é uma
         afirmação de cobertura da casa sobre o seu próprio ficheiro. */
      conjuntoV: 'Todas as linhas.',
      conjuntoDescarregar: 'Descarregar o livro-razão',
      conjuntoLicenca: 'Publicado sob',
      conjuntoAtribuicao: 'Atribuição',
      conjuntoAmbito:
        'A licença cobre o conjunto: a estrutura, os valores da casa, as derivações e as descrições. Os excertos transcritos das fontes continuam sob os termos de quem os publicou.',

      linha: {
        eyebrow: 'Linha do livro-razão',
        aparelhoK: 'Proveniência',
        /* O RÓTULO DO IDENTIFICADOR (bloco B, item B7; achado C13). O id da
           linha rendia-se solto por baixo do valor, e as duas leituras leram-no
           como «o identificador da máquina» sem saber o que era. */
        identificadorK: 'identificador',
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
        /* A TERCEIRA DATA (01.09.2026). O recibo mostrava duas: o período, no
           bloco de cima, e as leituras da casa. Esta é a do publicador. */
        publicadoEmK: 'Publicado pela fonte a',
        /* O ESTADO DE UMA FONTE SÃO DOIS ESTADOS, e não um (03.09.2026,
           segunda passagem do F0.11, Major 4 da leitura a frio). É uma data e
           não um adjectivo: o que a casa sabe é desde quando. E é uma de duas
           coisas, que não se parecem:

             `semRespostaK`         a fonte não atendeu de todo: tempo esgotado,
                                    ligação recusada, nome que não resolve, TLS;
             `respondeuComErroK`    a fonte atendeu, e o que respondeu não é
                                    2xx nem 304: um 403, um 404, um 500. Há
                                    resposta, e ela diz outra coisa. Chamar
                                    «sem resposta» a um 404 dizia ao leitor que
                                    a fonte se calou quando o que ela fez foi
                                    mudar o endereço.

           E QUEM PERGUNTOU DIZ-SE. «A DGAL não responde» e «a DGAL não
           respondeu a esta máquina» são duas frases diferentes, e só a segunda
           é verdade: o mesmo endereço responde ao portátil do diretor e não
           responde ao IP do runner do GitHub (medido a 01.09.2026). O
           qualificador vai a seguir à data. */
        semRespostaK: 'Sem resposta desde',
        respondeuComErroK: 'Respondeu com erro desde',
        aEstaMaquinaK: 'a esta máquina',
        aoCorredorK: 'ao corredor',
        /* A conferência contra a cópia arquivada de um ficheiro (F0.12): o que
           ela prova é que os bytes da cópia continuam a ser os que a linha
           declara, e não que a fonte viva ainda serve o mesmo ficheiro. */
        contraCopiaArquivadaK: 'contra a cópia arquivada de',
        /* As reconferências independentes de uma linha (bloco T, §1.47). Os
           rótulos vivem aqui e o portão tem a sua própria cópia deles: se ele
           lesse esta tabela, confirmava a tabela e não o livro-razão. */
        verificacaoPor: {
          'leitura-independente': 'leitura independente',
          'painel-semanal': 'reconferência semanal do painel',
          'revisao-cruzada': 'revisão cruzada',
          /* O corredor confere o FICHEIRO, não o valor: o rótulo di-lo, para
             que uma reconferência dele não se leia como uma releitura do
             número. Ver AUTORES_DA_VERIFICACAO em src/lib/ledger.mjs. */
          'corredor-diario': 'conferência diária do ficheiro da fonte',
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
      /* ---------------------------------------------------------------------
       * A MANCHETE DO CONCELHO (01.09.2026)
       * ---------------------------------------------------------------------
       * A cabeça das três camadas é a mesma, e o brief pede que a manchete seja
       * «uma afirmação com números selados» e não um título. A do país conta
       * limiares; a de uma região é a frase da região, que já existia. Um
       * concelho não tinha nenhuma, e esta é a mais barata que é verdadeira nos
       * 308: a população residente, que é a única medida que todos publicam, com
       * o seu selo e a sua linha.
       *
       * A FRASE PARTE-SE ONDE O NÚMERO ENTRA, como a do país: nenhuma destas
       * duas cadeias traz um algarismo, e o valor entra por `<Claim/>`. O nome
       * do concelho vai declarado como lugar e não é prosa da casa.
       *
       * NÃO DIZ MAIS NADA, e é uma decisão: um segundo membro sobre o índice de
       * dívida contra o teto legal era possível (o estado está medido em
       * `pecasDoConcelho`), e seria a casa a escolher, por 308 páginas, qual das
       * sete medidas merece a manchete. Essa escolha é do diretor, e está no
       * relatório como proposta.
       */
      mancheteA: ' tem ',
      mancheteB: ' pessoas.',
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
        'O traço fino é a dívida total que a Direção-Geral das Autarquias Locais publica para o concelho; a barra é a distância até ao limite legal do mesmo ano, que é o fio da direita. O índice mede uma contra o outro numa escala em que o teto é o valor permitido.',
      /* Pedaços de uma frase que o gabarito monta com as afirmações DESTE
         município. Nenhum id de afirmação se escreve aqui: isto é a língua,
         não os dados. */
      distanciaIndiceA: 'O índice é ',
      distanciaIndiceB: ' em ',
      distanciaIndiceC: ', contra um teto legal de ',
      distanciaIndiceD: '.',
      /* A ÚLTIMA ORAÇÃO SAIU (item E10, P2). Dizia «É a lei que o define, não
         este sítio.»: é o sítio a falar de si, que é a classe que a Emenda 15
         tira da página do leitor, e rendia-se nas 616 páginas de concelho. O que
         fica nomeia o que a coisa é: a lei, o artigo e a conta que ele manda
         fazer. A frase que saiu fica declarada como autorreferência no
         `INVENTARIO-FRASES.md`, para que a régua a apanhe pelo nome se alguém a
         repuser. */
      /* A FRASE DA LEI EM TRÊS PEÇAS, E A DO MEIO É O NOME DO DIPLOMA (I91,
         29.08.2026). O texto rendido é o mesmo, carácter a carácter; o que
         muda é que o nome da lei passa a poder levar `lang="pt-PT"` dentro da
         página inglesa, como já leva a referência legal do selo das áreas. Um
         nome de lei portuguesa lido com fonética inglesa é «lay no 73 slash
         2013», e não é o nome de coisa nenhuma. */
      distanciaLeiAntes: 'O limite é fixado no artigo 52.º da ',
      distanciaLeiDiploma: 'Lei n.º 73/2013',
      distanciaLeiDepois:
        ': uma vez e meia a média da receita corrente líquida dos três anos anteriores.',
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
      /* AS DUAS MEDIDAS QUE DESCERAM DAS PEÇAS (decisão D2 do diretor,
         26.08.2026). Os rótulos são os nomes das duas medidas, sem uma palavra
         nova: o que muda é o sítio onde se leem. A unidade dos dias fica ao pé
         do valor, como o «€» dos campos de cima. */
      contasExecucao: 'Execução da receita',
      contasPrazoMedio: 'Prazo médio de pagamento',
      contasPrazoMedioUnidade: 'dias',
      contasDivergenciaK: 'A diferença entre as duas contas da mesma dívida',
      contasDivergenciaV:
        'A Direção-Geral das Autarquias Locais e o município publicam a dívida do mesmo ano com uma diferença. A diferença é pequena.',
      contasDivergenciaRegulador: 'A Direção-Geral publica',
      contasDivergenciaMunicipio: 'O município publica',
      contasDivergenciaDiferenca: 'Diferença',

      tempoIndice: 'índice',
      /* O FACTO POR SUJEITO (V1, 27.08.2026). Dizia «· a diferença é publicada
         arredondada ao euro; os dois valores acima diferem em cêntimos.»: «é
         publicada» e «acima» são a página a descrever o que fez e onde pôs as
         coisas. Quem arredonda é a Direção-Geral, e é isso que muda a leitura
         dos cêntimos. */
      contasDivergenciaArredondada: '· a Direção-Geral arredonda ao euro; os dois valores diferem em cêntimos.',
      /* A frase da camada 2 do instrumento, e a sua cauda saiu (V1, 27.08.2026).
         Dizia «, nos quatro anos que esta página publica.»: a página como sujeito,
         e uma contagem por extenso que a `IDENTIDADE.md` §10 recusa. Os dois anos
         que ela enquadrava já estão na frase, ditos pelos dois pedaços `{ref}`
         que ela leva; repeti-los seria escrevê-los duas vezes.

         O ÍNDICE É DA CASA, E OS DADOS É QUE SÃO DA DIREÇÃO-GERAL (I88,
         28.08.2026). Dizia «O índice de dívida da Direção-Geral desceu de », e
         atribuía à DGAL um número que ela não publica: o que ela publica são as
         duas colunas, a dívida total e o limite, e o índice é o quociente que a
         casa calcula sobre elas. A peça já o diz noutro sítio; a frase da camada
         2 dizia o contrário, e é a primeira coisa que se lê no instrumento.

         O VERBO PASSOU A SER DECIDIDO PELOS DOIS VALORES (I89, 29.08.2026). Dizia
         «desceu» dentro da cadeia, e os pedaços seguintes eram só o que vai entre
         os números: o sítio não escolhia entre subida e descida. Era verdadeiro na
         única página que hoje rende a frase, Évora, onde o índice vai de 242,6% em
         2014 a 105,5% em 2024; num concelho cuja série subisse, a mesma cadeia
         escrevia uma falsidade, e nenhuma régua a apanhava. São três formas, uma
         por sentido, e a vista escolhe pelos dois valores. A forma da igualdade
         perde o «de … para …», porque não há de onde nem para onde: diz o valor
         uma vez e nomeia os dois anos. */
      tempoSerieDesceu: 'O índice de dívida, calculado sobre os dados da Direção-Geral, desceu de ',
      tempoSerieSubiu: 'O índice de dívida, calculado sobre os dados da Direção-Geral, subiu de ',
      tempoSerieManteve: 'O índice de dívida, calculado sobre os dados da Direção-Geral, manteve-se em ',
      tempoSerieB: ' em ',
      tempoSerieC: ' para ',
      tempoSerieD: ' em ',
      /* O pedaço entre os dois anos da forma da igualdade, no lugar do « para »
         que a frase da mudança leva. */
      tempoSerieIgualD: ' e em ',
      tempoSerieE: '.',
      tempoK: 'Quem administrou, e o que as contas registaram',
      /* A banda dos mandatos: o rótulo do desenho e o rótulo da legenda que
         leva as portas (IDENTIDADE.md §10). Os anos do eixo e os períodos são
         os que a página já publica; a banda não escreve nenhum número novo. */
      tempoBandaK: 'Mandatos, no tempo',
      tempoBandaLegendaK: 'Abrir cada mandato',
      /* O RÓTULO NOMEIA A SÉRIE, E NÃO A LEITURA DA CASA (decisão do diretor,
         26.08.2026). Dizia «do primeiro ano legível ao último»: «legível» é o
         sítio a descrever os limites da sua própria leitura, e a Emenda 15 tira
         isso da página do leitor. O que fica nomeia de que série são os dois
         números. E a Direção-Geral das Autarquias Locais diz-se pelo nome, nunca
         «o regulador» (item E11 do bloco dos 308, que não chegou aqui). */
      tempoRelanceK: 'Índice de dívida, do primeiro ao último ano da série da Direção-Geral das Autarquias Locais',
      tempoInstalado: 'instalado a',
      tempoLugares: 'Lugares',
      tempoHerdou: 'Herdou',
      tempoDecidiu: 'Decidiu',
      tempoDeixou: 'Deixou',
      tempoRegulador: 'A Direção-Geral',
      tempoPelouros: 'Pelouros',
      tempoExecutivo: 'Executivo instalado',
      tempoContas: 'Contas do penúltimo ano',
      tempoEmFuncoes: 'em funções',
      tempoExcessoK: 'O excesso sobre o teto legal',
      tempoExcessoV:
        'O que a dívida excedia o limite legal, no primeiro e no último ano em que o relatório o publica como um valor positivo. Depois disso o quadro passa a números negativos, que já não são excesso mas capacidade de endividamento.',
      /* AS DUAS FRASES QUE SOBREVIVERAM ÀS SECÇÕES RETIRADAS (G6, decisão do
         diretor de 26.08.2026). A primeira vinha do «Método e ressalvas» e a
         segunda do «O que esta página não sabe»; as duas mudam a leitura de um
         número desenhado ao lado, e por isso ficam, cada uma como UMA frase com
         o facto por sujeito, na nota do instrumento.

         `tempoFundoK` e `tempoFundoPartes` saíram: o nome dizia o que a camada
         era, «Como esta linha do tempo é feita», e o parágrafo explicava a
         composição da página. O que ele dizia sobre as duas dívidas de 2013 já
         está escrito ao pé de cada um dos dois valores. */
      tempoPelourosNota: 'As contagens de pelouros são designações, não despesa.',
      tempoContrafactualNota:
        'Não existe contrafactual para nenhum índice, e a parte de um executivo neles não é separável.',
      /* Fica só como nome da secção, por cima da banda dos mandatos (direção,
         21.08.2026, tarde). O parágrafo que levava por baixo saiu com a Emenda
         15. */
      tempoAtribuicaoK: 'Quem responde pelo quê',

      provenienciaK: 'Proveniência',
      estudosK: 'Os trabalhos sobre este concelho',
      estudoLink: 'Abrir a leitura',

      voltarMapa: 'Voltar ao mapa dos municípios',
    },

    estudos: {
      metaTitle: 'Estudos · O Estado do País',
      metaDescription: 'O arquivo de estudos publicados, com as suas edições em português e em inglês.',
      h1: 'Estudos',
      lede: 'Cada estudo publicado, com as suas edições e datas. Os que estão alojados noutro sítio levam a ligação para lá.',
      aviso: 'Datas de publicação por confirmar.',
      /* AS TRÊS CHAVES DO RÓTULO DA DESCRIÇÃO SAÍRAM (bloco B, item B1;
         achado C9). `descricaoRotulo`, `descricaoDoDocumentoRotulo` e
         `descricaoTraduzidaRotulo` diziam ao leitor o que a descrição era —
         «reformulação do título», «frase de abertura do documento», «tradução
         da casa» —, e isso é o sítio a descrever a sua própria descrição
         (Emenda 18(e)). A transcrição continua conferida por `data-verbatim`,
         que é onde a afirmação é prova e não frase. */
      /* A DATA DE PUBLICAÇÃO PASSA A DIZER-SE POR EXTENSO, COM A ORIGEM
         (segunda passagem do F1.4, 04.09.2026). Era «Publicação: 12.08.2026»
         sobre uma data que o arquivo declarava por confirmar. Passa a ser
         «publicado a 12.08.2026», e a data é o dia em que o ficheiro da edição
         entrou neste repositório: um facto que se prova com o `git log`, dito
         com a marca `data-nonledger="data-do-repositorio"`. A preposição fica
         fora dessa marca, porque é prosa da casa e o inventário da voz declara-a
         (a marca `data-voz` recolhe-a). */
      dataLabel: 'publicado a',
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
      migradoEstado: 'Documento alojado',

      /* Trabalho com leitura do observatório escrita (src/data/leituras.mjs).
         É este o estado que levanta o noindex — ver DECISIONS §1.35. */
      /* `leituraEstado` saiu na 4e: era a casa a dizer de si que tinha acabado
         o trabalho, por cima de uma página onde o trabalho está à vista. Os
         outros dois estados ficam porque são ausências declaradas. */
      leituraRelanceK: 'Relance',
      /* O RÓTULO DA CAMADA (decisão do diretor, 26.08.2026). Dizia «Leitura
         breve · prosa da casa, assente numa frase do trabalho»: a página a
         explicar de que género é o texto que traz e em que é que ele assenta,
         que é a classe que a Emenda 15 tira da página do leitor. O rótulo passa
         a nomear a camada e mais nada; a proveniência de cada frase vive no selo
         que ela leva e na linha a que o selo abre. `leituraBreveRotulo` saiu, e
         o gabarito passou a ler esta chave, que já existia e não se rendia. */
      leituraBreveK: 'Leitura breve',
      municipioK: 'O concelho de que trata',
      municipioLink: 'A página do município',

      documentoK: 'O documento original',
      /* `documentoV` saiu: dizia com que cuidado o documento foi alojado. A
         porta («Ler o documento →») é o que o leitor precisa, e a faixa que o
         documento leva no topo vê-se quando ele abre. */
      documentoVazio: 'O documento deste estudo ainda não foi alojado aqui.',
      documentoLink: 'Ler o documento',
      /* O RÓTULO DA EDIÇÃO ARQUIVADA SAIU (G6, decisão do diretor de
         26.08.2026). Dizia «A edição de registo, tal como foi publicada.», por
         baixo das duas portas: era o sítio a explicar o que uma das suas
         edições é. A porta chega, e o documento diz-se a si próprio na faixa
         que leva no topo. `documentoNota` saiu nas duas edições. */
      /* Vai dentro da faixa, no topo do documento. Sem algarismos: é regra do
         portão, e a razão dela está em src/lib/documentos.mjs. */
      documentoFaixa: 'Documento do estudo · edição de registo',
      documentoVoltar: 'Voltar à página do estudo',
      /* O NOME DE UMA CAIXA QUE SE DESLOCA (bloco F1.8, 03.09.2026). Não se
         rende no HTML construído: a moldura põe-no em `aria-label` no
         navegador, sobre caixas do documento alojado, porque acrescentar um
         atributo ao corpo era mexer nos bytes da obra citada. Quando a caixa
         traz uma legenda ou vem debaixo de um título, o nome do documento entra
         a seguir a este, para que duas caixas da mesma página não digam a mesma
         coisa a quem ouve. Não diz o sentido do deslocamento porque as caixas
         medidas deslocam-se umas de lado e outras a direito, e um rótulo que
         prometesse o sentido errado era pior do que um que o não promete. */
      documentoDeslocamento: 'Caixa que se desloca',

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
         `aria-label` e mais nada: a porta não tem texto, e sem nome nenhum um
         leitor de ecrã anunciava uma ligação vazia.

         O RÓTULO NOMEIA O QUE A PORTA ABRE, E NÃO A CHAVE (I83, 28.08.2026).
         Levava as palavras do rótulo do campo mais o identificador da linha,
         «linha do motor: tc-year-1-2008», e o que quem ouve a página ouvia era
         o nome de um artefacto interno do motor: é a mesma classe que a medida
         6 da régua nomeia nos localizadores das linhas, ouvida em voz alta. A
         chave fica no `href`, onde ela é um endereço e não uma palavra; o
         rótulo diz de que figura é a linha, que é o que decide entre duas
         portas seguidas.
         Deixa de ser as mesmas palavras de `textoLinhaK`, e é por isso que a
         chave é própria desde que nasceu. */
      textoPortaDaLinha: 'a linha desta figura',
      textoRegistoK: 'O registo de conteúdo',
      /* O comando fixo do telemóvel, no fim do ecrã (bloco B, item B4). Duas
         páginas de leitura medem 111 e 243 ecrãs a 390: sem ele, voltar ao
         princípio é rolar tudo outra vez. */
      textoSubir: 'Subir',
      /* A INDICAÇÃO DE PROGRESSO TAMBÉM PARA QUEM NÃO VÊ (F1.9a, segunda
         passagem, 03.09.2026; Major 8 da leitura a frio do Codex). O «n/N»
         que a folha de estilos desenha ao lado de cada título de nível 2 não
         tinha nome acessível: o texto alternativo do CSS ia vazio de propósito
         para o título continuar a ser só o texto do registo. Esta frase entra
         num irmão do título (`<span class="vh">`, fora do `<h2>`, nunca dentro
         dele) e o `aria-labelledby` do título aponta para os dois: o nome
         acessível passa a ser esta frase seguida do título, e o título em si
         não ganha um carácter. `{n}` e `{total}` são a posição e o total, os
         dois já verificados pelo L8 do portão contra o registo; a vista faz a
         substituição, porque este ficheiro não sabe línguas. */
      textoPosicaoSeccaoModelo: 'Secção {n} de {total}',
      textoContaBlocos: 'blocos',
      textoContaAlgarismos: 'algarismos',
      textoContaComLinha: 'com linha do livro-razão',

      edicaoIrma: 'Ver esta edição',
      atualizadoLabel: 'Última atualização',
      temaK: 'Tema',
      temaNenhum: 'Sem tema atribuído',
      descricoesK: 'Descrições',
      descarregarK: 'Descarregar',
      descarregarVazio: 'Sem ficheiros.',
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

    /* A frase de identidade da Emenda 18, na edição inglesa, nas palavras do
       diretor: «An observatory of Portugal.» */
    identidade: 'An observatory of Portugal.',

    nav: {
      inicio: 'Home',
      municipios: 'Municipalities',
      dominios: 'Domains',
      areas: 'Areas',
      /* As três famílias no menu. Ver a razão na edição portuguesa. */
      regioes: 'Regions',
      distritos: 'Districts',
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
      reconferido: 'European panel ·',
      vencido: 'European panel overdue ·',
      fontes: 'Sources ·',
      fontesVencidas: 'Sources overdue ·',
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
      rotuloDaFonte: 'Name at the source',
      rotuloOnde: 'Where in the file',
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
        'What is being measured, what comes next, and the criterion that put each thing there. With the calendar of what the sources publish next.',
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
        'The question is registered in English, word for word; the Portuguese is the Portuguese edition of that same question.',
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
      calendarioLede: 'What the cited sources publish next.',
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
      area: 'Areas',
      municipio: 'Municipality',
      pesquisaRotulo: 'Type the name of the municipality',
      pesquisaSemResultado: 'No municipality by that name.',
      /* O comando da busca. Ver a razão na edição portuguesa. */
      pesquisaSubmeter: 'Search',
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
        tituloPaisA: 'Portugal breaches ',
        tituloPaisUm: ' threshold of the Macroeconomic Imbalance Procedure and meets ',
        tituloPaisMuitos: ' thresholds of the Macroeconomic Imbalance Procedure and meets ',
        tituloPaisFim: '.',
        /* As cadeias dos dois blocos de concelho saíram (Emenda 19a). Ver a
           razão na edição portuguesa, e o registo em `CHAVES-EN.md`. */
        ledePais: {
          abre: 'Outside the threshold: ',
          separador: ', ',
          ultimo: ' and ',
          ano: ', in ',
          fecha: '.',
        },
        /* «district of », com o espaço final, como o par português. Os nomes de
           ilha da Carta ficam em português nas duas edições: são nomes
           próprios. A palavra «concelho» deixou de ser um deles na interface
           inglesa a 25.08.2026 (bloco B, item B6; achado C12): «concelho» fica
           só onde é o nome de uma coisa portuguesa citada — o título de um
           trabalho, um excerto de fonte, o nome «Carta Administrativa Oficial
           de Portugal» —, e a interface diz «municipality». */
        distritoDe: 'district of ',
      },

      /* O nome da faixa. Ver a razão na edição portuguesa: uma cadeia só, sem o
         nome do lugar, na gramática do nome do mapa. */
      faixa: {
        rotulo: 'The measures, one per card',
        /* «1 of 21». Ver a razão na edição portuguesa. */
        de: ' of ',
      },

      movel: {
        abrirConcelho: 'Open a municipality',
        verRegiao: 'See a region',
        seloDaEscolha: 'Open the municipality chooser',
      },

      portas: {
        rotulo: 'The pages',
        abrir: 'the whole page',
        concelhos: ' municipalities',
        estudosA: ' works · ',
        estudosB: ' editions',
      },

      mapa: {
        linha: ' municipalities · CAOP ',
        acores: 'Azores',
        madeira: 'Madeira',
        continente: 'Mainland',
        readoutHint: 'Hover over a point to read the municipality.',
        tecladoHint:
          'Keyboard: Tab to the map, arrow keys to move between neighbouring municipalities, Home to return to Évora.',
        svgLabel: 'Point map of the municipalities of Portugal.',
        distritosLabel: 'Map of the districts and islands of Portugal, one area per unit.',
        /* As duas gavetas do mapa. Ver a razão na edição portuguesa. */
        nomesGaveta: 'The names on the map',
        buscaGaveta: 'A municipality by name',
        trocar: 'change municipality',
      },

      banda: {
        rotuloPartes: [
          'The convergence rule · EU-27 = ',
          { nl: '100', motivo: 'escala-de-instrumento' },
        ],
        svgLabel: 'Convergence rule: GDP per capita of each region against the European average.',
      },

      painel: {
        nomeA: 'Macroeconomic Imbalance Procedure · ',
        nomeFim: ' measures with a threshold',
      },
      social: {
        titulo: 'European Social Scoreboard · ',
        tituloFim: ' measures',
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
      metaDescription: 'Every municipality in Portugal, from the official administrative map.',
      eyebrow: 'Municipalities',
      h1: 'The municipalities of Portugal',
      lede: 'Every municipality, from the Carta Administrativa Oficial de Portugal.',
      coberturaA: ' of ',
      coberturaB: ' municipalities · ',
      fonteK: 'Where the list comes from',
      mapaLink: 'The map of municipalities',
      parcelaContinente: 'Mainland',
      parcelaAcores: 'Azores',
      parcelaMadeira: 'Madeira',
      parcelaTotal: 'Total',
      dadosK: 'The list as a file',
      dadosLink: 'download the data (CSV)',
    },

    /* A gémea inglesa das 29 unidades (Emenda 20, 27.08.2026). «districts and
       islands» e não «districts»: nove das 29 são ilhas dos Açores e duas da
       Madeira, e a Carta chama-lhes ilhas. */
    distritos: {
      metaTitle: 'Districts and islands · O Estado do País',
      metaDescription:
        'The districts and islands of Portugal, from the official administrative map.',
      eyebrow: 'Districts and islands',
      h1: 'The districts and islands of Portugal',
      lede: 'The units of the Carta Administrativa Oficial de Portugal, and the municipalities of each.',
      metaCauda: 'the municipalities · O Estado do País',
      metaDescricaoA: 'The municipalities of ',
      metaDescricaoB: ', from the Carta Administrativa Oficial de Portugal.',
      tipoDistrito: 'district',
      tipoIlha: 'island of the Autonomous Region',
      concelhosK: 'The municipalities',
      fonteK: 'Where the drawing comes from',
      contaUnidades: ' districts and islands',
      mapaLabel: 'Map of the municipalities, one area per municipality.',
      legendaCarta: 'Carta Administrativa Oficial de Portugal · ',
      voltarIndice: 'The districts and islands',
      voltarConcelhos: 'The municipalities of Portugal',
    },

    /** As regiões (Emenda 21). Ver a nota da edição portuguesa. */
    regioes: {
      metaTitle: 'Regions · O Estado do País',
      metaDescription:
        'The NUTS II regions of Portugal, and how far each one is from the EU-27 average.',
      eyebrow: 'Regions',
      h1: 'The regions of Portugal',
      lede: 'Each region’s GDP per capita index, in purchasing power standards, against the EU-27 average.',
      contaUma: ' region',
      contaMuitas: ' regions',
      metaCauda: 'region · O Estado do País',
      metaDescricaoA: 'The GDP per capita index of ',
      metaDescricaoB: ', in purchasing power standards, against the EU-27 average.',
      tipo: 'NUTS II region',
      pecasK: 'The measures',
      indiceK: 'GDP per capita index',
      distanciaK: 'Distance from the EU-27 average',
      distanciaUnidade: 'index points',
      voltarIndice: 'The regions of Portugal',
      voltarPais: 'Portugal',
    },

    dominios: {
      metaTitle: 'Domains · O Estado do País',
      metaDescription:
        'The areas of the country’s life with published measures, and the ones with no verified measures yet.',
      eyebrow: 'Domains',
      h1: 'By domain',
      estadoNoAr: 'live',
      estadoDentroDe: 'the measures are in',
      estadoSem: 'no verified measures yet',
      vagaPrimeira: 'first wave',
      vagaSegunda: 'second wave',
      vagaTerceira: 'third wave',
      metaCauda: 'domain · O Estado do País',
      metaDescricaoA: 'The measures of ',
      metaDescricaoB: ', with the source, the period and the dates of each one.',
      tipo: 'domain of the content charter',
      fronteiraK: 'What this domain covers',
      ausenciaK: 'No published figure',
      ausenciaResposta: 'There is no published figure for this.',
      ausenciaProcurado: 'looked for in',
      dataPeriodo: 'period',
      dataLido: 'read',
      dataConferido: 'checked',
      fonteK: 'source',
      mapaSemValor: 'no published value',
      mapaMenosDe: 'less than ',
      mapaA: ' to ',
      mapaOuMais: ' or more',
      mapaEscalaNota: 'The classes are round scale marks, not an official limit.',
      porConcelhoPorta: 'The values municipality by municipality →',
      mapaTabelaAbrir: 'The values, municipality by municipality',
      mapaTabelaConcelho: 'Municipality',
      mapaTabelaValor: 'Value',
      voltarIndice: 'The domains',
      voltarPais: 'Portugal',
    },

    areas: {
      metaTitle: 'Government areas · O Estado do País',
      eyebrow: 'Government areas',
      h1: 'By area of government',
      contaUma: ' study or measure',
      contaMuitas: ' studies and measures',
      metaCauda: 'government area · O Estado do País',
      tipo: 'area of the XXV Constitutional Government',
      trabalhosK: 'The studies',
      conjuntosK: 'The data studies',
      medidasK: 'The measures',
      textoDoTrabalho: 'The text',
      voltarIndice: 'The areas of government',
      voltarLivro: 'The ledger',
      voltarConcelhos: 'The municipalities',
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

    livroConcelhos: {
      metaTitle: 'Municipalities · Ledger · O Estado do País',
      /* A gémea da portuguesa (27.08.2026). */
      metaDescription: 'Municipalities ledger · O Estado do País',
      /* A gémea da lede portuguesa, e sai com ela (27.08.2026). */
      contaLinhas: 'rows',
      contaConcelhos: 'municipalities',
      naoDeclaradasK: 'Rows with no municipality declared',
      voltarLivro: 'The whole ledger',
      indiceLink: 'The index of municipalities',
      metaCaudaDoConcelho: 'the ledger rows · O Estado do País',
      metaDescricaoDoConcelhoA: 'The ledger rows with the measures central sources publish for the municipality of ',
      metaDescricaoDoConcelhoB: '.',
      /* A gémea da lede da página de um concelho, e sai com ela (27.08.2026). */
      vazioDoConcelho: 'No rows yet.',
      referenciaK: 'The study’s reference',
      paginaDoConcelho: 'The municipality page',
      voltarAoIndice: 'The municipalities in the ledger',
    },

    livro: {
      metaTitle: 'Ledger · O Estado do País',
      /* A descrição nomeia a página, e é a gémea da portuguesa (27.08.2026). */
      metaDescription: 'Ledger · O Estado do País',
      eyebrow: 'Ledger',
      h1: 'The ledger',
      /* A lede e os dois títulos de grupo saíram com as gémeas portuguesas
         (27.08.2026): `lede1`, `contaDe`, `grupoCompletasFrase` e
         `grupoPorConfirmarFrase`. */
      colunaValor: 'Value',
      colunaAfirmacao: 'Claim',
      colunaSelo: 'Provenance',
      contaAfirmacoes: 'claims',
      contaDe: 'of',
      contaDerivadas: 'calculated',
      contaConcelhos: 'municipality rows',
      concelhosPorta: 'Municipalities',
      buscaRotulo: 'Search by name, identifier or source',
      buscaSemResultado: 'No row in the ledger matches those words.',
      buscaResultadosK: 'Rows that match',
      buscaMais: 'There are more rows than fit here. Type more to narrow it down.',
      seloK: 'The two states of the seal',
      seloCheio: 'provenance complete',
      seloTracejado: 'one field unconfirmed',
      marcadorK: 'The marker',
      marcadorGloss: 'to verify',
      metodoLink: 'How this is made',

      convergenciaK: 'The convergence rule, as a file',
      conjuntoK: 'The ledger as a dataset',
      conjuntoEstado: 'Dataset prepared; the licence awaits the director’s decision.',
      conjuntoV: 'Every row.',
      conjuntoDescarregar: 'Download the ledger',
      conjuntoLicenca: 'Published under',
      conjuntoAtribuicao: 'Attribution',
      conjuntoAmbito:
        'The licence covers the dataset: its structure, the house values, the derivations and the descriptions. Excerpts transcribed from sources remain under their publishers’ terms.',

      linha: {
        eyebrow: 'Ledger row',
        aparelhoK: 'Provenance',
        identificadorK: 'identifier',
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
        publicadoEmK: 'Published by the source on',
        semRespostaK: 'No answer since',
        respondeuComErroK: 'Answering with an error since',
        aEstaMaquinaK: 'to this machine',
        aoCorredorK: 'to the runner',
        contraCopiaArquivadaK: 'against the archived copy of',
        verificacaoPor: {
          'leitura-independente': 'independent reading',
          'painel-semanal': 'weekly panel re-check',
          'revisao-cruzada': 'cross-family review',
          'corredor-diario': 'daily check of the source file',
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
      /* A manchete do concelho. Ver a razão na edição portuguesa. */
      mancheteA: ' has ',
      mancheteB: ' people.',
      eyebrow: 'Municipality',
      metaCauda: 'the municipality, measured · O Estado do País',
      metaDescricaoA: 'What the sources publish about the municipality of ',
      metaDescricaoB:
        ': population, purchasing power, employment, enterprises, debt and budget execution.',
      relanceK: 'At a glance',

      breveK: 'Brief reading',

      distanciaK: 'The debt against the legal ceiling',
      distanciaLegenda:
        'The thin line is the total debt the local-government directorate publishes for the municipality; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value.',
      distanciaIndiceA: 'The index is ',
      distanciaIndiceB: ' in ',
      distanciaIndiceC: ', against a legal cap of ',
      distanciaIndiceD: '.',
      distanciaLeiAntes: 'The limit is set by article 52.º of ',
      distanciaLeiDiploma: 'Lei n.º 73/2013',
      distanciaLeiDepois:
        ': one and a half times the three-year average of net current revenue.',
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
      contasExecucao: 'Revenue execution',
      contasPrazoMedio: 'Average payment time',
      contasPrazoMedioUnidade: 'days',
      contasDivergenciaK: 'The gap between the two accounts of the same debt',
      contasDivergenciaV:
        'The local-government directorate and the municipality publish the same year’s debt with a difference between them. The difference is small.',
      contasDivergenciaRegulador: 'The directorate-general publishes',
      contasDivergenciaMunicipio: 'The municipality publishes',
      contasDivergenciaDiferenca: 'Difference',

      tempoIndice: 'index',
      contasDivergenciaArredondada: '· the local-government directorate rounds to the euro; the two figures differ by cents.',
      /* I88, 28.08.2026: dizia «The directorate-general’s debt index fell
         from ». Ver a razão escrita na chave portuguesa. */
      /* I89, 29.08.2026: o verbo era fixo em «fell from». Ver a razão escrita nas
         chaves portuguesas. */
      tempoSerieDesceu: 'The debt index, computed on the directorate-general’s data, fell from ',
      tempoSerieSubiu: 'The debt index, computed on the directorate-general’s data, rose from ',
      tempoSerieManteve: 'The debt index, computed on the directorate-general’s data, stayed at ',
      tempoSerieB: ' in ',
      tempoSerieC: ' to ',
      tempoSerieD: ' in ',
      tempoSerieIgualD: ' and in ',
      tempoSerieE: '.',
      tempoK: 'Who governed, and what the accounts recorded',
      tempoBandaK: 'Terms, in time',
      tempoBandaLegendaK: 'Open each term',
      tempoRelanceK: 'Debt index, from the first to the last year of the local-government directorate’s series',
      tempoInstalado: 'installed on',
      tempoLugares: 'Seats',
      tempoHerdou: 'Inherited',
      tempoDecidiu: 'Decided',
      tempoDeixou: 'Left',
      tempoRegulador: 'The directorate-general',
      tempoPelouros: 'Portfolios',
      tempoExecutivo: 'Executive installed',
      tempoContas: 'Accounts of the year before last',
      tempoEmFuncoes: 'in office',
      tempoExcessoK: 'The excess over the legal ceiling',
      tempoExcessoV:
        'How far the debt exceeded the legal limit, in the first and the last year in which the report publishes it as a positive figure. After that the table turns negative, and a negative there is no longer excess but borrowing capacity.',
      tempoPelourosNota: 'The portfolio counts are designations, not spending.',
      tempoContrafactualNota:
        'There is no counterfactual for any index, and an executive’s share of them is not separable.',
      tempoAtribuicaoK: 'Who answers for what',

      provenienciaK: 'Provenance',
      estudosK: 'The works about this municipality',
      estudoLink: 'Open the reading',

      voltarMapa: 'Back to the map of municipalities',
    },

    estudos: {
      metaTitle: 'Studies · O Estado do País',
      metaDescription: 'The archive of published studies, with their Portuguese and English editions.',
      h1: 'Studies',
      lede: 'Every published study, with its editions and dates. Those hosted elsewhere carry the link to it.',
      aviso: 'Publication dates not yet confirmed.',
      dataLabel: 'published on',
      lingua: 'Language',
      verEstudo: 'Study page',
      stubEdicoes: 'Editions',
      stubVoltar: 'Back to the archive',
      stubEstado: 'Draft · no content',
      stubForaK: 'Published outside this site',
      stubForaV: 'The link leaves this domain.',
      stubForaLink: 'Open the study',

      migradoEstado: 'Document hosted',

      leituraRelanceK: 'At a glance',
      leituraBreveK: 'Brief reading',
      municipioK: 'The municipality it is about',
      municipioLink: 'The municipality page',

      documentoK: 'The original document',
      documentoVazio: 'The document for this study has not been hosted here yet.',
      documentoLink: 'Read the document',
      documentoFaixa: 'Study document · edition of record',
      documentoVoltar: 'Back to the study page',
      documentoDeslocamento: 'Box that scrolls',

      textoEyebrow: 'Study document · text',
      textoLink: 'Read on the site',
      textoLinhasK: 'The rows of this document',
      textoLinhaK: 'engine row',
      textoValorK: 'the value as the row keeps it',
      textoImpressoK: 'as this document prints it',
      textoOrigemK: 'source digest',
      textoLinhaDoLivro: 'ledger row',
      /* I83, 28.08.2026: dizia «engine row» mais o identificador. Ver a razão
         escrita na chave portuguesa. */
      textoPortaDaLinha: 'this figure’s row',
      textoRegistoK: 'The content record',
      textoSubir: 'Back to top',
      /* See the Portuguese key for why this lives outside the `<h1>`..`<h6>`
         it labels, and never inside it. */
      textoPosicaoSeccaoModelo: 'Section {n} of {total}',
      textoContaBlocos: 'blocks',
      textoContaAlgarismos: 'figures',
      textoContaComLinha: 'with a ledger row',

      edicaoIrma: 'See this edition',
      atualizadoLabel: 'Last updated',
      temaK: 'Subject',
      temaNenhum: 'No subject assigned',
      descricoesK: 'Descriptions',
      descarregarK: 'Downloads',
      descarregarVazio: 'No files.',
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

/**
 * Todas as chaves, em profundidade, de um objecto de strings.
 *
 * @param {object} obj
 * @param {string} [prefixo]
 * @returns {string[]}
 */
function chaves(obj, prefixo = '') {
  /** @type {string[]} */
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

/** @param {Lingua} lang */
export function t(lang) {
  assertKeyParity();
  const s = STRINGS[lang];
  if (!s) throw new Error(`i18n: língua desconhecida "${lang}"`);
  return s;
}
