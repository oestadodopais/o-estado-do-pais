/**
 * ===========================================================================
 * PARA ONDE VAI O DINHEIRO DO ESTADO EM 2026 · a declaração (bloco EX1, 05.10.2026)
 * ===========================================================================
 *
 * DE ONDE VEM. O texto é o do brief EX1, §5, ponto 4, escrito pelo lugar de direção, à letra, com os
 * tokens a resolver nas linhas que ele nomeia. As palavras são do lugar de direção; os números, os nomes
 * das funções e os ramos são da máquina, pela gramática das frases da primeira página
 * (`src/lib/primeira-pagina.mjs`), com quatro pedaços que esta explicação acrescenta e que o resolvedor
 * (`src/lib/explicacoes.mjs`) define: `nome`, `sinal`, `se` e a condição `primeiros`.
 *
 *   · uma cadeia: palavras fixas, sem algarismos;
 *   · `{ claim, sufixo }`: o valor de uma linha, com o selo ao lado;
 *   · `{ periodo: id }`: o período de referência de uma linha, na forma da casa (é assim que os anos do
 *     texto do brief, «2026», «agosto de 2026» e «2025», entram: nenhum algarismo escrito à mão);
 *   · `{ nome: id }`: o nome declarado da função de uma linha, tirado do nome do projeto dela
 *     (`src/data/medidas-oe1.mjs`), que é onde o texto do brief diz «[nome: id]»; `inicial` põe a
 *     primeira letra em maiúscula, para a edição inglesa começar uma frase por um nome;
 *   · `{ sinal: id, positivo, negativo }`: a palavra que o sinal do valor da linha decide («excedente»
 *     ou «défice»);
 *   · `{ se: [condições], partes }`: palavras que só se rendem enquanto as condições declaradas forem
 *     verdadeiras. É assim que uma frase que compara («a maior fatia», «o maior é o das Finanças») se
 *     mantém certa sozinha: quando os números deixam de lhe dar razão, sai da página, e o guião dos sinais
 *     di-lo ao lugar de direção;
 *   · `{ maiores: [ids], familia, n, frase, antes, abre, sufixo, fecha, entre, ultimo }` (desde o EX1-b,
 *     06.10.2026, a decisão do lugar de direção sobre a I213): as `n` linhas de maior valor da lista, por
 *     ordem decrescente, cada uma com o nome declarado e o valor ao lado, decididas pelos números em cada
 *     construção. A lista tem de ser a família inteira das linhas que casam com `familia` no livro: um
 *     identificador fora da família é um defeito da declaração; uma linha nova da família, um valor que
 *     não se lê ou um empate na fronteira tiram as palavras e deixam um sinal.
 *
 * AS PORTAS DO FIM (`portas`, desde o EX1-b): os recibos (`livro`) e, por decisão do lugar de direção sobre a
 * I212, a página do tema «Estado e economia», cujo nome sai de `ENTRADAS` (`src/data/primeira-pagina.mjs`).
 *
 * O QUE MUDOU EM RELAÇÃO AO TEXTO DO BRIEF, e é tudo: a lista `ACERTOS`, abaixo, cada um com a razão. O
 * guião `design/especime-v3/medicoes/ex1-2026-10-05/acertos-ex1.mjs` rende o texto português desta
 * declaração e compara-o com o do brief, frase a frase, e só aceita as diferenças desta lista.
 *
 * A EDIÇÃO INGLESA é a tradução fiel, com a mesma forma (os mesmos tokens pela mesma ordem), e entra na
 * auditoria das leituras ao lado da portuguesa. Sem travessões.
 */

const PC = ' %';

/** As dez funções do Orçamento, pela ordem da classificação. */
export const FUNCOES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].map((n) => `oe-2026-cem-euros-funcao-${n}`);
/** Os dezasseis ministérios do mapa da despesa por ministérios, pela ordem alfabética dos identificadores. */
export const MINISTERIOS = [
  'administracao-interna', 'agricultura-e-mar', 'ambiente-e-energia', 'cultura-juventude-e-desporto',
  'defesa-nacional', 'economia-e-coesao-territorial', 'educacao-ciencia-e-inovacao', 'encargos-gerais-do-estado',
  'financas', 'infraestruturas-e-habitacao', 'justica', 'negocios-estrangeiros',
  'presidencia-do-conselho-de-ministros', 'reforma-do-estado', 'saude', 'trabalho-solidariedade-e-seguranca-social',
].map((m) => `oe-2026-cem-euros-ministerio-${m}`);
/** Os vinte programas da execução acumulada até agosto (o quadro da página 72 da síntese, de 001 a 020). */
export const PROGRAMAS_DA_EXECUCAO = Array.from({ length: 20 }, (_, i) => `execucao-2026-08-despesa-programa-${String(i + 1).padStart(3, '0')}`);
/** A família dos programas no livro: a lista de `maiores` tem de ser ela inteira. */
export const FAMILIA_DOS_PROGRAMAS = '^execucao-2026-08-despesa-programa-\\d{3}$';

const F = (/** @type {string} */ n) => `oe-2026-cem-euros-funcao-${n}`;
const M = (/** @type {string} */ m) => `oe-2026-cem-euros-ministerio-${m}`;
const DESPESA_DAS_FINANCAS = 'oe-2026-despesa-ministerio-financas';
const DESPESA_EXECUTADA = 'execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social';
const RECEITA_EXECUTADA = 'execucao-2026-08-receita-efetiva-administracao-central-seguranca-social';
const DIVIDA = 'divida-publica-2025';
const DIVIDA_UE = 'divida-publica-2025-ue';
const SALDO = 'saldo-das-administracoes-publicas-2025';

/* AS CONDIÇÕES, nomeadas, para a auditoria as poder citar pelo nome. */
const A_MAIOR_FUNCAO = { primeiros: [F('01')], de: FUNCOES };
const O_MAIOR_MINISTERIO = { primeiros: [M('financas')], de: MINISTERIOS };
const OS_QUATRO_MINISTERIOS = { primeiros: [M('financas'), M('saude'), M('trabalho-solidariedade-e-seguranca-social'), M('educacao-ciencia-e-inovacao')], de: MINISTERIOS };
const A_EXECUCAO_E_DE_AGOSTO = { periodo: DESPESA_EXECUTADA, mes: 8 };
/* «Os juros da dívida não estão ainda no livro-razão»: verdadeiro enquanto nenhuma linha tiver «juros», «servico-da-divida»
   ou «encargos-da-divida» no identificador, que é a medida do §0 do brief (`linhas_sobre_os_juros_da_divida`). */
const SEM_LINHAS_DOS_JUROS = { sem_linhas: 'juros|servico-da-divida|encargos-da-divida' };

export const DINHEIRO_DO_ESTADO_2026 = {
  slug: 'dinheiro-do-estado-2026',
  /** A data de escrita, que dá a ordem da lista das explicações (a mais recente primeiro). */
  escrita: '2026-10-05',
  titulo: {
    pt: ['Para onde vai o dinheiro do Estado em ', { periodo: F('01') }],
    en: ['Where the State’s money goes in ', { periodo: F('01') }],
  },
  abertura: [
    {
      pt: [
        'O Orçamento do Estado para ', { periodo: F('01') }, ' diz, euro a euro, para onde vai o dinheiro. De cada cem euros, ',
        { claim: F('07') }, ' vão para a ', { nome: F('07') }, ', ', { claim: F('10') }, ' para a ', { nome: F('10') }, ', ',
        { claim: F('09') }, ' para a ', { nome: F('09') }, ' e ', { claim: F('04') }, ' para os ', { nome: F('04') }, '.',
        { se: [A_MAIOR_FUNCAO], partes: [
          ' A maior fatia, ', { claim: F('01') }, ', é a dos ', { nome: F('01') },
          ', onde a classificação das funções conta os juros da dívida e as transferências entre administrações.',
        ] },
      ],
      en: [
        'The State Budget for ', { periodo: F('01') }, ' says, euro by euro, where the money goes. Of every hundred euros, ',
        { claim: F('07') }, ' go to ', { nome: F('07') }, ', ', { claim: F('10') }, ' to ', { nome: F('10') }, ', ',
        { claim: F('09') }, ' to ', { nome: F('09') }, ' and ', { claim: F('04') }, ' to ', { nome: F('04') }, '.',
        { se: [A_MAIOR_FUNCAO], partes: [
          ' The largest share, ', { claim: F('01') }, ', is ', { nome: F('01') },
          ', where the classification of functions counts the interest on the debt and the transfers between levels of government.',
        ] },
      ],
    },
  ],
  seccoes: [
    {
      id: 'por-funcao',
      titulo: { pt: 'Por função', en: 'By function' },
      conteudo: [
        { figura: { forma: 'barras-do-livro', id: 'funcoes', linhas: FUNCOES, titulo: { pt: 'As dez funções, de cada cem euros', en: 'The ten functions, of every hundred euros' } } },
        {
          paragrafo: {
            pt: [
              'A ', { nome: F('02') }, ' leva ', { claim: F('02') }, ', a ', { nome: F('03') }, ' ', { claim: F('03') }, ', a ',
              { nome: F('05') }, ' ', { claim: F('05') }, ', a ', { nome: F('06') }, ' ', { claim: F('06') }, ' e o ',
              { nome: F('08') }, ' ', { claim: F('08') }, '.',
            ],
            en: [
              '', { nome: F('02'), inicial: true }, ' takes ', { claim: F('02') }, ', ', { nome: F('03') }, ' ', { claim: F('03') }, ', ',
              { nome: F('05') }, ' ', { claim: F('05') }, ', ', { nome: F('06') }, ' ', { claim: F('06') }, ' and ',
              { nome: F('08') }, ' ', { claim: F('08') }, '.',
            ],
          },
        },
      ],
    },
    {
      id: 'por-ministerio',
      titulo: { pt: 'Por ministério', en: 'By ministry' },
      conteudo: [
        {
          paragrafo: {
            pt: [
              { se: [O_MAIOR_MINISTERIO], partes: [
                'Visto pelos ministérios, o maior é o das Finanças, com ', { claim: M('financas') }, ' de cada cem euros, ',
                { claim: DESPESA_DAS_FINANCAS, sufixo: ' euros' },
                { se: [OS_QUATRO_MINISTERIOS], partes: [
                  '; seguem-se a Saúde (', { claim: M('saude') }, '), o Trabalho, Solidariedade e Segurança Social (',
                  { claim: M('trabalho-solidariedade-e-seguranca-social') }, ') e a Educação, Ciência e Inovação (',
                  { claim: M('educacao-ciencia-e-inovacao') }, ')',
                ] },
                '.',
              ] },
            ],
            en: [
              { se: [O_MAIOR_MINISTERIO], partes: [
                'Seen by ministry, the largest is Finance, with ', { claim: M('financas') }, ' of every hundred euros, ',
                { claim: DESPESA_DAS_FINANCAS, sufixo: ' euros' },
                { se: [OS_QUATRO_MINISTERIOS], partes: [
                  '; then come Health (', { claim: M('saude') }, '), Labour, Solidarity and Social Security (',
                  { claim: M('trabalho-solidariedade-e-seguranca-social') }, ') and Education, Science and Innovation (',
                  { claim: M('educacao-ciencia-e-inovacao') }, ')',
                ] },
                '.',
              ] },
            ],
          },
        },
        { figura: { forma: 'barras-do-livro', id: 'ministerios', linhas: MINISTERIOS, titulo: { pt: 'Os dezasseis ministérios, de cada cem euros', en: 'The sixteen ministries, of every hundred euros' } } },
        /* EX1-b (06.10.2026, a decisão do lugar de direção sobre a I215): as duas contas dão à saúde e à educação partes
           diferentes, e a página diz porquê. A auditoria cita a origem de cada parte e marca como leitura do projeto as
           duas que nenhuma origem diz com estas palavras. */
        {
          paragrafo: {
            pt: ['As duas contas não batem porque medem coisas diferentes: a conta por função soma tudo o que o Estado gasta com um fim, como a saúde ou a educação, seja qual for o ministério que o gasta; a conta por ministério é o orçamento de cada ministério, que paga também coisas de outros fins.'],
            en: ['The two counts do not match because they measure different things: the count by function adds up everything the State spends for one purpose, such as health or education, whichever ministry spends it; the count by ministry is each ministry’s budget, which also pays for things with other purposes.'],
          },
        },
      ],
    },
    {
      id: 'execucao',
      titulo: { pt: 'O que já se gastou este ano', en: 'What has been spent this year' },
      conteudo: [
        {
          paragrafo: {
            pt: [
              'Até ', { periodo: DESPESA_EXECUTADA }, ', a administração central e a segurança social tinham gasto ',
              { claim: DESPESA_EXECUTADA, sufixo: ' milhões de euros' }, ' e recebido ', { claim: RECEITA_EXECUTADA, sufixo: ' milhões' },
              { maiores: PROGRAMAS_DA_EXECUCAO, familia: FAMILIA_DOS_PROGRAMAS, n: 3,
                frase: '; os programas que mais gastaram foram ', antes: 'o de ', abre: ' (', sufixo: ' milhões', fecha: ')', entre: ', ', ultimo: ' e ' },
              '.',
            ],
            en: [
              'By ', { periodo: DESPESA_EXECUTADA }, ', central government and social security had spent ',
              { claim: DESPESA_EXECUTADA, sufixo: ' million euros' }, ' and taken in ', { claim: RECEITA_EXECUTADA, sufixo: ' million' },
              { maiores: PROGRAMAS_DA_EXECUCAO, familia: FAMILIA_DOS_PROGRAMAS, n: 3,
                frase: '; the programmes that spent the most were ', antes: '', abre: ' (', sufixo: ' million', fecha: ')', entre: ', ', ultimo: ' and ' },
              '.',
            ],
          },
        },
      ],
    },
    {
      id: 'divida-e-saldo',
      titulo: { pt: 'A dívida e o saldo', en: 'Debt and the balance' },
      conteudo: [
        {
          paragrafo: {
            pt: [
              'No fim de ', { periodo: DIVIDA }, ', a dívida pública valia ', { claim: DIVIDA, sufixo: PC }, ' do que o país produz num ano, contra ',
              { claim: DIVIDA_UE, sufixo: PC }, ' na média da União Europeia, e as contas públicas fecharam o ano com um saldo de ',
              { claim: SALDO, sufixo: PC }, ' do produto, ', { sinal: SALDO, positivo: ['um excedente'], negativo: ['um défice'] }, '.',
            ],
            en: [
              'At the end of ', { periodo: DIVIDA }, ', public debt was worth ', { claim: DIVIDA, sufixo: PC }, ' of what the country produces in a year, against ',
              { claim: DIVIDA_UE, sufixo: PC }, ' on average in the European Union, and the public accounts closed the year with a balance of ',
              { claim: SALDO, sufixo: PC }, ' of output, ', { sinal: SALDO, positivo: ['a surplus'], negativo: ['a deficit'] }, '.',
            ],
          },
        },
      ],
    },
  ],
  /** «O que isto não diz», a secção que fecha (o §5, ponto 3, do brief); o título é a cadeia da casa. */
  naoDiz: [
    {
      pt: [
        { se: [A_EXECUCAO_E_DE_AGOSTO], partes: ['O orçamento é uma previsão: o que se gasta de facto lê-se na execução, mês a mês, e a de agosto está acima.'] },
        { se: [SEM_LINHAS_DOS_JUROS], partes: [' Os juros da dívida não estão ainda no livro-razão deste projeto como linha própria; quando entrarem, esta explicação diz quanto são.'] },
        ' O detalhe por programa e por ministério, com a fonte de cada número, está no recibo de cada um, a um toque, e nos números do tema «Estado e economia».',
      ],
      en: [
        { se: [A_EXECUCAO_E_DE_AGOSTO], partes: ['The budget is a forecast: what is actually spent is read in the budget execution, month by month, and August’s is above.'] },
        { se: [SEM_LINHAS_DOS_JUROS], partes: [' The interest on the debt is not yet in this project’s ledger as a line of its own; when it is, this explainer will say how much it is.'] },
        ' The detail by programme and by ministry, with the source of each figure, is in each one’s receipt, one tap away, and in the figures of the theme «State and economy».',
      ],
    },
  ],
  /** As portas do fim (o §5, ponto 3, do brief, e a decisão do lugar de direção sobre a I212): os recibos e a página do
      tema, com o nome que `ENTRADAS` lhe dá; a porta para o estudo do Orçamento de 2026 volta quando ele tiver página. */
  portas: [{ rota: 'livro' }, { rota: 'entradaEstado', entrada: 'estado-e-economia' }],
};

/**
 * OS ACERTOS EM RELAÇÃO AO TEXTO DO §5, PONTO 4, DO BRIEF, cada um com a razão. Uma diferença que não esteja
 * aqui fecha o guião `acertos-ex1.mjs`. As três primeiras não mudam um carácter do texto rendido.
 * @type {{ id: string, onde: string, o_que: string, razao: string }[]}
 */
export const ACERTOS = [
  { id: 'X1', onde: 'título, abertura, execução, dívida', o_que: 'os anos «2026», «agosto de 2026» e «2025» entram por `{ periodo }` de uma linha nomeada', razao: 'nenhum algarismo escrito à mão (o mandato, ponto 3); o texto rendido é o mesmo' },
  { id: 'X2', onde: 'abertura', o_que: 'o parêntese «(a fonte desta frase é a classificação das funções das administrações públicas, a divisão 01, que o construtor cita na auditoria da leitura)» não se rende', razao: 'é uma instrução ao construtor: a fonte está na auditoria, nas origens `eurostat-cofog-divisao-01` e `dados-gov-oe-despesa-funcional`' },
  { id: 'X3', onde: 'por função', o_que: '«As dez funções, de cada cem euros:» é o título da figura, e «a figura das barras, uma por linha, da maior para a menor» e «(os ids oe-2026-cem-euros-funcao-NN)» não se rendem', razao: 'são instruções ao construtor: a figura é a forma `barras-do-livro`' },
  { id: 'X4', onde: 'por função', o_que: '«e a [nome: 08]» passa a «e o [nome: 08]»', razao: 'o nome declarado da função 08 é «desporto, recreação, cultura e religião», que pede o artigo masculino' },
  { id: 'X5', onde: 'por ministério', o_que: 'a frase «A fatia das Finanças é grande porque […]» não se rende, e a das Finanças acaba em «de cada cem euros» e no valor em euros', razao: 'o relatório do Orçamento do Estado de 2026 não está alojado no motor (a pasta do estudo OE1 tem os mapas, os ficheiros do dados.gov.pt, as sínteses da execução e as respostas do Eurostat): a razão não se leu na fonte, e o brief manda que a frase acabe aí' },
  { id: 'X6', onde: 'por ministério', o_que: '«A figura das barras dos dezasseis ministérios, da maior para a menor.» é a figura, com o título «Os dezasseis ministérios, de cada cem euros»', razao: 'é uma instrução ao construtor; o título tem a forma do da figura das funções' },
  { id: 'X7', onde: 'dívida e saldo', o_que: 'os três valores levam o símbolo « %» ao lado', razao: 'a unidade das três linhas é «% do PIB»: sem o símbolo, «valia 89,7 do que o país produz» lia-se como uma quantia' },
  { id: 'X8', onde: 'o que isto não diz', o_que: 'a frase «O detalhe por programa e por ministério, com a fonte de cada número, está no estudo do Orçamento do Estado de 2026.» passa a «O detalhe por programa e por ministério, com a fonte de cada número, está no recibo de cada um, a um toque, e nos números do tema «Estado e economia».», e a porta do fim é a da página do tema, ao lado da dos recibos', razao: 'a decisão do lugar de direção de 06.10.2026 sobre a I212: o estudo `oe-2026` não tem página nem rota (`src/data/studies.mjs`, `INTERNAL_SOURCES`: «Este registo não cria um trabalho em WORKS, uma página ou uma rota»); a porta para o estudo volta quando ele tiver página' },
  { id: 'X9', onde: 'abertura, ministérios, o que isto não diz', o_que: 'as frases que comparam ou que dizem uma ausência ficam guardadas por condições declaradas (`se`)', razao: 'uma frase avaliativa leva o ramo que os números decidem (§1 do brief); quando os números deixam de lhe dar razão, sai da página e deixa um sinal' },
  { id: 'X10', onde: 'secções', o_que: 'os títulos das secções sem o ponto final («Por função.» passa a título «Por função»), e «O que isto não diz» é a cadeia da casa', razao: 'são títulos de secção; o último é o mesmo em todas as explicações (o §5, ponto 3, do brief)' },
  { id: 'X11', onde: 'o que já se gastou este ano', o_que: '«os programas que mais gastaram foram o do Trabalho, Solidariedade e Segurança Social (…), o da Saúde (…) e o da Gestão da Dívida Pública (…)» passa ao token `maiores`: os três programas de maior despesa, por ordem decrescente, cada um com o nome declarado da linha e o valor ao lado («o de [nome] ([valor] milhões), o de [nome] ([valor]) e o de [nome] ([valor])»), decididos pelos números em cada construção', razao: 'a decisão do lugar de direção de 06.10.2026 sobre a I213: com os números de 05.10.2026 a frase do brief era falsa (o programa 004, Finanças, gastou 5 337,6 milhões e o 005, 5 212,7); a decisão diz «dezanove programas», e o livro tem vinte (de `execucao-2026-08-despesa-programa-001` a `-020`, com a mesma unidade, o mesmo período e o mesmo quadro da fonte), e o token lê a família inteira' },
  { id: 'X12', onde: 'por ministério', o_que: 'entra, a seguir à figura dos ministérios, a frase «As duas contas não batem porque medem coisas diferentes: a conta por função soma tudo o que o Estado gasta com um fim, como a saúde ou a educação, seja qual for o ministério que o gasta; a conta por ministério é o orçamento de cada ministério, que paga também coisas de outros fins.»', razao: 'a decisão do lugar de direção de 06.10.2026 sobre a I215: a página dava duas respostas a «quanto é a saúde» e a «quanto é a educação» sem dizer porquê; a auditoria cita a origem de cada parte e marca como leitura do projeto as duas que nenhuma origem diz com estas palavras' },
  { id: 'X13', onde: 'a dívida e o saldo', o_que: '«com um [excedente|défice] de [saldo] do produto» passa a «com um saldo de [saldo] do produto, [um excedente|um défice]»', razao: 'a decisão do lugar de direção de 06.10.2026 sobre a I216: com um saldo negativo, a forma do brief diria «um défice de» seguido do valor com o sinal menos; o sinal fica com o número e a palavra vai para o fim' },
];
