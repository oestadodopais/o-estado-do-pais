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
 *   · `{ sinal: id, positivo, negativo, zero }`: a palavra que o sinal do valor da linha decide («um excedente
 *     (recebeu mais do que gastou)», «um défice (gastou mais do que recebeu)» ou, desde o EX1-c, «um saldo nulo
 *     (recebeu o mesmo que gastou)»: com os três ramos, nenhum valor fecha a construção);
 *   · `{ compara: [a, b], maior, menor, igual }` (desde o EX1-c, 06.10.2026, o achado 9 da leitura a frio, pela
 *     gramática da primeira página): as palavras que a comparação dos valores de a e de b escolhe («acima dos …
 *     da média da União Europeia» ou «abaixo»);
 *   · `{ comparaSaldos: [a, b], deficitMaior, deficitMenor, deficitIgual, excedenteMaior, excedenteMenor, excedenteIgual, nulos, diferentesNegativo, diferentesPositivo, diferentesZero }`:
 *     Cada token decidido por valor declara `palavras: { ramo: { contem, naoContem } }`, na língua do texto.
 *     A X10 confere as palavras inteiras de cada ramo, incluindo os não escolhidos. Estes metadados não se rendem.
 *     compara os módulos quando os sinais coincidem; com sinais diferentes, declara a previsão sem comparar tamanhos.
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
 * AS PORTAS DO FIM (`portas`, desde o EX1-b): os recibos (`livro`). A página de um tema pode entrar, com o nome que
 * `ENTRADAS` (`src/data/primeira-pagina.mjs`) lhe dá; a do tema «Estado e economia» saiu no EX1-c (o achado 7).
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
const SALDO_EXECUTADO = 'execucao-2026-08-saldo-global-administracao-central-seguranca-social';
const SALDO_PREVISTO = 'oe-2026-saldo-global-administracao-central-seguranca-social';
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
  publicado: '2026-10-06',
  /** A data de escrita, que dá a ordem da lista das explicações (a mais recente primeiro). */
  escrita: '2026-10-05',
  titulo: {
    pt: ['Para onde vai o dinheiro do Estado em ', { periodo: F('01') }],
    en: ['Where the State’s money goes in ', { periodo: F('01') }],
  },
  abertura: [
    {
      pt: [
        'O Orçamento do Estado para ', { periodo: F('01') }, ' diz, euro a euro, para onde vai o dinheiro. De cada cem euros da despesa efetiva consolidada da administração central (a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços), ',
        { claim: F('07') }, ' vão para a ', { nome: F('07') }, ', ', { claim: F('10') }, ' para a ', { nome: F('10') }, ', ',
        { claim: F('09') }, ' para a ', { nome: F('09') }, ' e ', { claim: F('04') }, ' para os ', { nome: F('04') }, '.',
        { se: [A_MAIOR_FUNCAO], partes: [
          ' A maior fatia, ', { claim: F('01') }, ', é a dos ', { nome: F('01') },
          ', onde a classificação das funções conta as transferências entre administrações.',
        ] },
      ],
      en: [
        'The State Budget for ', { periodo: F('01') }, ' says, euro by euro, where the money goes. Of every hundred euros of central administration\'s consolidated effective expenditure (spending without transactions in financial assets and liabilities or transfers between its own services), ',
        { claim: F('07') }, ' go to ', { nome: F('07') }, ', ', { claim: F('10') }, ' to ', { nome: F('10') }, ', ',
        { claim: F('09') }, ' to ', { nome: F('09') }, ' and ', { claim: F('04') }, ' to ', { nome: F('04') }, '.',
        { se: [A_MAIOR_FUNCAO], partes: [
          ' The largest share, ', { claim: F('01') }, ', is ', { nome: F('01') },
          ', where the classification of functions counts the transfers between levels of government.',
        ] },
      ],
    },
  ],
  seccoes: [
    {
      id: 'por-funcao',
      titulo: { pt: 'Por função', en: 'By function' },
      conteudo: [
        { figura: { forma: 'barras-do-livro', id: 'funcoes', linhas: FUNCOES, titulo: { pt: 'As dez funções, de cada cem euros da despesa efetiva consolidada da administração central (a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços)', en: 'The ten functions, of every hundred euros of central administration\'s consolidated effective expenditure (spending without transactions in financial assets and liabilities or transfers between its own services)' } } },
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
        {
          "paragrafo": {
            "pt": [
              "",
              {
                "claim": "oe-2026-cem-euros-funcao-02"
              },
              " de cada cem euros desta página são a função «Defesa» da despesa efetiva consolidada da administração central (a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços), em contabilidade pública. A despesa em defesa em percentagem do PIB que a NATO publica é outra medida, pela definição da própria NATO: os pagamentos feitos por um governo nacional, sem as administrações regionais, locais e municipais, especificamente para satisfazer as necessidades das suas forças armadas, das dos outros aliados ou da Aliança no seu todo; a definição da NATO inclui as pensões de reforma pagas diretamente pelo governo aos militares na reforma e aos funcionários civis dos departamentos militares, e as relativas ao pessoal no ativo. Para Portugal, a NATO publica ",
              {
                "claim": "nato-defesa-portugal-pib-2024",
                "sufixo": " %"
              },
              " do PIB em ",
              {
                "periodo": "nato-defesa-portugal-pib-2024"
              },
              " e, como estimativas, ",
              {
                "claim": "nato-defesa-portugal-pib-2025",
                "sufixo": " %"
              },
              " em ",
              {
                "periodo": "nato-defesa-portugal-pib-2025"
              },
              " e ",
              {
                "claim": "nato-defesa-portugal-pib-2026",
                "sufixo": " %"
              },
              " em ",
              {
                "periodo": "nato-defesa-portugal-pib-2026"
              },
              " (a tabela a preços constantes), e ",
              {
                "claim": "nato-defesa-portugal-eur-2026"
              },
              " milhões de euros em ",
              {
                "periodo": "nato-defesa-portugal-eur-2026"
              },
              " (a tabela a preços correntes, também uma estimativa).",
              " A referência da própria NATO é a dos seus compromissos: ",
              {"claim": "nato-compromisso-gales-2014", "sufixo": " %"},
              " do PIB desde a cimeira de Gales de ",
              {"periodo": "nato-compromisso-gales-2014"},
              ", e, desde a cimeira de Haia de ",
              {"periodo": "nato-cimeira-haia-2025"},
              ", ",
              {"claim": "nato-compromisso-haia-2035", "sufixo": " %"},
              " do PIB por ano até ",
              {"periodo": "nato-compromisso-haia-2035"},
              ", dos quais pelo menos ",
              {"claim": "nato-compromisso-haia-essencial-2035", "sufixo": " %"},
              " em requisitos essenciais de defesa pela definição da NATO."
            ],
            "en": [
              "",
              {
                "claim": "oe-2026-cem-euros-funcao-02"
              },
              " of every hundred euros on this page are the «Defence» function of central administration's consolidated effective expenditure (spending without transactions in financial assets and liabilities or transfers between its own services), in public accounting. Defence spending as a share of GDP, as NATO publishes it, is another measure, under NATO's own definition: payments made by an Allied national government (excluding regional, local and municipal authorities) specifically to meet the needs of its own armed forces, those of other Allies or the needs of the Alliance as a whole; NATO's definition includes retirement pension payments made directly by the government to retired military and civilian employees of military departments and for active personnel. For Portugal, NATO publishes ",
              {
                "claim": "nato-defesa-portugal-pib-2024",
                "sufixo": " %"
              },
              " of GDP in ",
              {
                "periodo": "nato-defesa-portugal-pib-2024"
              },
              " and, as estimates, ",
              {
                "claim": "nato-defesa-portugal-pib-2025",
                "sufixo": " %"
              },
              " in ",
              {
                "periodo": "nato-defesa-portugal-pib-2025"
              },
              " and ",
              {
                "claim": "nato-defesa-portugal-pib-2026",
                "sufixo": " %"
              },
              " in ",
              {
                "periodo": "nato-defesa-portugal-pib-2026"
              },
              " (the table at constant prices), and ",
              {
                "claim": "nato-defesa-portugal-eur-2026"
              },
              " million euros in ",
              {
                "periodo": "nato-defesa-portugal-eur-2026"
              },
              " (the table at current prices, also an estimate).",
              " NATO's own reference is its commitments: ",
              {"claim": "nato-compromisso-gales-2014", "sufixo": " %"},
              " of GDP since the ",
              {"periodo": "nato-compromisso-gales-2014"},
              " Wales Summit, and, since the ",
              {"periodo": "nato-cimeira-haia-2025"},
              " Hague Summit, ",
              {"claim": "nato-compromisso-haia-2035", "sufixo": " %"},
              " of GDP a year by ",
              {"periodo": "nato-compromisso-haia-2035"},
              ", of which at least ",
              {"claim": "nato-compromisso-haia-essencial-2035", "sufixo": " %"},
              " for core defence requirements under NATO's definition."
            ]
          }
        },
        {
          "paragrafo": {
            "pt": [
              "Noutra conta, a de todas as administrações públicas, com as regionais e as locais, em percentagem do PIB e em contabilidade nacional, o Eurostat publica para ",
              {
                "periodo": "despesa-por-funcao-2024-gf02-pt"
              },
              ": serviços gerais das administrações públicas ",
              {
                "claim": "despesa-por-funcao-2024-gf01-pt",
                "sufixo": " %"
              },
              ", defesa ",
              {
                "claim": "despesa-por-funcao-2024-gf02-pt",
                "sufixo": " %"
              },
              ", segurança e ordem pública ",
              {
                "claim": "despesa-por-funcao-2024-gf03-pt",
                "sufixo": " %"
              },
              ", assuntos económicos ",
              {
                "claim": "despesa-por-funcao-2024-gf04-pt",
                "sufixo": " %"
              },
              ", proteção do ambiente ",
              {
                "claim": "despesa-por-funcao-2024-gf05-pt",
                "sufixo": " %"
              },
              ", habitação e infraestruturas coletivas ",
              {
                "claim": "despesa-por-funcao-2024-gf06-pt",
                "sufixo": " %"
              },
              ", saúde ",
              {
                "claim": "despesa-por-funcao-2024-gf07-pt",
                "sufixo": " %"
              },
              ", desporto, recreação, cultura e religião ",
              {
                "claim": "despesa-por-funcao-2024-gf08-pt",
                "sufixo": " %"
              },
              ", educação ",
              {
                "claim": "despesa-por-funcao-2024-gf09-pt",
                "sufixo": " %"
              },
              " e proteção social ",
              {
                "claim": "despesa-por-funcao-2024-gf10-pt",
                "sufixo": " %"
              },
              " do PIB. Estas percentagens do Eurostat referem-se a ",
              {
                "periodo": "despesa-por-funcao-2024-gf02-pt"
              },
              " e usam o PIB como denominador. As fatias por função do Orçamento referem-se a ",
              {
                "periodo": "oe-2026-cem-euros-funcao-02"
              },
              " e usam a despesa efetiva consolidada da administração central. Também diferem o perímetro e a contabilidade.",
              " As duas percentagens do PIB não medem a mesma despesa: a do Eurostat é a função «Defesa» de todas as administrações públicas, em contabilidade nacional, e a da NATO é a definição acima, que inclui as pensões. No mesmo ano de ",
              {
                "periodo": "nato-defesa-portugal-pib-2024"
              },
              ", a NATO publica ",
              {
                "claim": "nato-defesa-portugal-pib-2024",
                "sufixo": " %"
              },
              " do PIB para Portugal e o Eurostat conta ",
              {
                "claim": "despesa-por-funcao-2024-gf02-pt",
                "sufixo": " %"
              },
              ". Esta página mostra as duas medidas, cada uma com a sua definição, e não as soma nem corrige nenhuma."
            ],
            "en": [
              "In another count, that of all public administrations, with the regional and local ones, as a share of GDP and in national accounts, Eurostat publishes for ",
              {
                "periodo": "despesa-por-funcao-2024-gf02-pt"
              },
              ": general public services ",
              {
                "claim": "despesa-por-funcao-2024-gf01-pt",
                "sufixo": " %"
              },
              ", defence ",
              {
                "claim": "despesa-por-funcao-2024-gf02-pt",
                "sufixo": " %"
              },
              ", public order and safety ",
              {
                "claim": "despesa-por-funcao-2024-gf03-pt",
                "sufixo": " %"
              },
              ", economic affairs ",
              {
                "claim": "despesa-por-funcao-2024-gf04-pt",
                "sufixo": " %"
              },
              ", environmental protection ",
              {
                "claim": "despesa-por-funcao-2024-gf05-pt",
                "sufixo": " %"
              },
              ", housing and community amenities ",
              {
                "claim": "despesa-por-funcao-2024-gf06-pt",
                "sufixo": " %"
              },
              ", health ",
              {
                "claim": "despesa-por-funcao-2024-gf07-pt",
                "sufixo": " %"
              },
              ", recreation, culture and religion ",
              {
                "claim": "despesa-por-funcao-2024-gf08-pt",
                "sufixo": " %"
              },
              ", education ",
              {
                "claim": "despesa-por-funcao-2024-gf09-pt",
                "sufixo": " %"
              },
              " and social protection ",
              {
                "claim": "despesa-por-funcao-2024-gf10-pt",
                "sufixo": " %"
              },
              " of GDP. These Eurostat percentages refer to ",
              {
                "periodo": "despesa-por-funcao-2024-gf02-pt"
              },
              " and use GDP as their denominator. The Budget shares by function refer to ",
              {
                "periodo": "oe-2026-cem-euros-funcao-02"
              },
              " and use central administration's consolidated effective expenditure. Their coverage and accounting basis also differ.",
              " The two shares of GDP do not measure the same expenditure: Eurostat's is the «Defence» function of all public administrations, in national accounting, and NATO's is the definition above, which includes pensions. In the same year, ",
              {
                "periodo": "nato-defesa-portugal-pib-2024"
              },
              ", NATO publishes ",
              {
                "claim": "nato-defesa-portugal-pib-2024",
                "sufixo": " %"
              },
              " of GDP for Portugal and Eurostat counts ",
              {
                "claim": "despesa-por-funcao-2024-gf02-pt",
                "sufixo": " %"
              },
              ". This page shows both measures, each with its definition, and neither adds them up nor corrects either."
            ]
          }
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
                'Visto pelos ministérios, o maior é ', { nome: M('financas') }, ', com ', { claim: M('financas') }, ' de cada cem euros, ',
                { claim: DESPESA_DAS_FINANCAS, sufixo: ' euros' },
                ', da «', { termo: 'DESPESA TOTAL', lingua: 'pt-PT' }, '» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central (o total antes da consolidação, ',
                { verbatim: 'origem-rp4n-total-ministerios-montante' }, ' euros).',
                { se: [OS_QUATRO_MINISTERIOS], partes: [
                  ' Seguem-se ', { nome: M('saude') }, ' (', { claim: M('saude') }, '), ', { nome: M('trabalho-solidariedade-e-seguranca-social') }, ' (',
                  { claim: M('trabalho-solidariedade-e-seguranca-social') }, ') e ', { nome: M('educacao-ciencia-e-inovacao') }, ' (',
                  { claim: M('educacao-ciencia-e-inovacao') }, ').',
                ] },
                '',
              ] },
            ],
            en: [
              { se: [O_MAIOR_MINISTERIO], partes: [
                'Seen by ministry, the largest is ', { nome: M('financas') }, ', with ', { claim: M('financas') }, ' of every hundred euros, ',
                { claim: DESPESA_DAS_FINANCAS, sufixo: ' euros' },
                ', of the “', { termo: 'DESPESA TOTAL', lingua: 'pt-PT' }, '” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector (the total before consolidation, ',
                { verbatim: 'origem-rp4n-total-ministerios-montante' }, ' euros).',
                { se: [OS_QUATRO_MINISTERIOS], partes: [
                  ' Then come ', { nome: M('saude') }, ' (', { claim: M('saude') }, '), ', { nome: M('trabalho-solidariedade-e-seguranca-social') }, ' (',
                  { claim: M('trabalho-solidariedade-e-seguranca-social') }, ') and ', { nome: M('educacao-ciencia-e-inovacao') }, ' (',
                  { claim: M('educacao-ciencia-e-inovacao') }, ').',
                ] },
                '',
              ] },
            ],
          },
        },
        { figura: { forma: 'barras-do-livro', id: 'ministerios', linhas: MINISTERIOS, titulo: { pt: 'Os dezasseis ministérios, de cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação', en: 'The sixteen ministries, of every hundred euros of “DESPESA TOTAL” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation' } } },
        /* Higiene (13.10.2026, EX1-12 e a leitura curta da passagem b): a frase sobre a diferença entre as duas contas
           sai, porque os excertos selados não a explicam, e uma frase sobre os excertos do projeto não é do leitor; fica
           só o que os apoios da auditoria sustentam. */
        {
          paragrafo: {
            pt: ['A conta por função organiza a despesa da administração central por finalidade, como a saúde ou a educação.'],
            en: ['The count by function organises central government expenditure by purpose, such as health or education.'],
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
        {
          paragrafo: {
            pt: [
              'No fim de ', { periodo: SALDO_EXECUTADO }, ', as contas da administração central e da segurança social apresentavam um saldo acumulado de ',
              { claim: SALDO_EXECUTADO, sufixo: ' milhões de euros' }, ', ',
              { sinal: SALDO_EXECUTADO, palavras: { positivo: { contem: ['excedente'], naoContem: ['défice', 'nulo'] }, negativo: { contem: ['défice'], naoContem: ['excedente', 'nulo'] }, zero: { contem: ['nulo'], naoContem: ['excedente', 'défice'] } }, positivo: ['um excedente (recebeu mais do que gastou)'], negativo: ['um défice (gastou mais do que recebeu)'], zero: ['um saldo nulo (recebeu o mesmo que gastou)'] },
              '; ',
              { comparaSaldos: [SALDO_EXECUTADO, SALDO_PREVISTO],
                palavras: {
                  deficitMaior: { contem: ['défice', 'maior'], naoContem: ['excedente', 'nulo', 'menor', 'igual'] },
                  deficitMenor: { contem: ['défice', 'menor'], naoContem: ['excedente', 'nulo', 'maior', 'igual'] },
                  deficitIgual: { contem: ['défice', 'igual'], naoContem: ['excedente', 'nulo', 'maior', 'menor'] },
                  excedenteMaior: { contem: ['excedente', 'maior'], naoContem: ['défice', 'nulo', 'menor', 'igual'] },
                  excedenteMenor: { contem: ['excedente', 'menor'], naoContem: ['défice', 'nulo', 'maior', 'igual'] },
                  excedenteIgual: { contem: ['excedente', 'igual'], naoContem: ['défice', 'nulo', 'maior', 'menor'] },
                  nulos: { contem: ['nulo'], naoContem: ['excedente', 'défice', 'maior', 'menor', 'igual'] },
                  diferentesNegativo: { contem: ['défice'], naoContem: ['excedente', 'nulo', 'maior', 'menor', 'igual'] },
                  diferentesPositivo: { contem: ['excedente'], naoContem: ['défice', 'nulo', 'maior', 'menor', 'igual'] },
                  diferentesZero: { contem: ['nulo'], naoContem: ['excedente', 'défice', 'maior', 'menor', 'igual'] }
                },
                deficitMaior: ['é um défice maior do que o que o Orçamento previa para o ano inteiro (', { claim: SALDO_PREVISTO, sufixo: ' milhões de euros' }, ')'],
                deficitMenor: ['é um défice menor do que o que o Orçamento previa para o ano inteiro (', { claim: SALDO_PREVISTO, sufixo: ' milhões de euros' }, ')'],
                deficitIgual: ['é um défice igual ao que o Orçamento previa para o ano inteiro (', { claim: SALDO_PREVISTO, sufixo: ' milhões de euros' }, ')'],
                excedenteMaior: ['é um excedente maior do que o que o Orçamento previa para o ano inteiro (', { claim: SALDO_PREVISTO, sufixo: ' milhões de euros' }, ')'],
                excedenteMenor: ['é um excedente menor do que o que o Orçamento previa para o ano inteiro (', { claim: SALDO_PREVISTO, sufixo: ' milhões de euros' }, ')'],
                excedenteIgual: ['é um excedente igual ao que o Orçamento previa para o ano inteiro (', { claim: SALDO_PREVISTO, sufixo: ' milhões de euros' }, ')'],
                nulos: ['é um saldo nulo, como o que o Orçamento previa para o ano inteiro (', { claim: SALDO_PREVISTO, sufixo: ' milhões de euros' }, ')'],
                diferentesNegativo: ['o Orçamento previa para o ano inteiro um défice (saldo de ', { claim: SALDO_PREVISTO, sufixo: ' milhões de euros' }, ')'],
                diferentesPositivo: ['o Orçamento previa para o ano inteiro um excedente de ', { claim: SALDO_PREVISTO, sufixo: ' milhões de euros' }],
                diferentesZero: ['o Orçamento previa para o ano inteiro um saldo nulo de ', { claim: SALDO_PREVISTO, sufixo: ' milhões de euros' }],
              },
              ', e ainda faltam os meses de setembro a dezembro. Estas contas abrangem a administração central e a segurança social; as contas públicas de ', { periodo: SALDO }, ' incluem também as administrações regional e local.',
            ],
            en: [
              'By the end of ', { periodo: SALDO_EXECUTADO }, ', the accounts of central government and social security showed a cumulative balance of ',
              { claim: SALDO_EXECUTADO, sufixo: ' million euros' }, ', ',
              { sinal: SALDO_EXECUTADO, palavras: { positivo: { contem: ['surplus'], naoContem: ['deficit', 'nil'] }, negativo: { contem: ['deficit'], naoContem: ['surplus', 'nil'] }, zero: { contem: ['nil'], naoContem: ['surplus', 'deficit'] } }, positivo: ['a surplus (it took in more than it spent)'], negativo: ['a deficit (it spent more than it took in)'], zero: ['a nil balance (it took in the same as it spent)'] },
              '; ',
              { comparaSaldos: [SALDO_EXECUTADO, SALDO_PREVISTO],
                palavras: {
                  deficitMaior: { contem: ['deficit', 'larger'], naoContem: ['surplus', 'nil', 'smaller', 'the same'] },
                  deficitMenor: { contem: ['deficit', 'smaller'], naoContem: ['surplus', 'nil', 'larger', 'the same'] },
                  deficitIgual: { contem: ['deficit', 'the same'], naoContem: ['surplus', 'nil', 'larger', 'smaller'] },
                  excedenteMaior: { contem: ['surplus', 'larger'], naoContem: ['deficit', 'nil', 'smaller', 'the same'] },
                  excedenteMenor: { contem: ['surplus', 'smaller'], naoContem: ['deficit', 'nil', 'larger', 'the same'] },
                  excedenteIgual: { contem: ['surplus', 'the same'], naoContem: ['deficit', 'nil', 'larger', 'smaller'] },
                  nulos: { contem: ['nil'], naoContem: ['surplus', 'deficit', 'larger', 'smaller', 'the same'] },
                  diferentesNegativo: { contem: ['deficit'], naoContem: ['surplus', 'nil', 'larger', 'smaller', 'the same'] },
                  diferentesPositivo: { contem: ['surplus'], naoContem: ['deficit', 'nil', 'larger', 'smaller', 'the same'] },
                  diferentesZero: { contem: ['nil'], naoContem: ['surplus', 'deficit', 'larger', 'smaller', 'the same'] }
                },
                deficitMaior: ['it is a larger deficit than the one the Budget forecast for the full year (', { claim: SALDO_PREVISTO, sufixo: ' million euros' }, ')'],
                deficitMenor: ['it is a smaller deficit than the one the Budget forecast for the full year (', { claim: SALDO_PREVISTO, sufixo: ' million euros' }, ')'],
                deficitIgual: ['it is the same deficit as the one the Budget forecast for the full year (', { claim: SALDO_PREVISTO, sufixo: ' million euros' }, ')'],
                excedenteMaior: ['it is a larger surplus than the one the Budget forecast for the full year (', { claim: SALDO_PREVISTO, sufixo: ' million euros' }, ')'],
                excedenteMenor: ['it is a smaller surplus than the one the Budget forecast for the full year (', { claim: SALDO_PREVISTO, sufixo: ' million euros' }, ')'],
                excedenteIgual: ['it is the same surplus as the one the Budget forecast for the full year (', { claim: SALDO_PREVISTO, sufixo: ' million euros' }, ')'],
                nulos: ['it is a nil balance, as the Budget forecast for the full year (', { claim: SALDO_PREVISTO, sufixo: ' million euros' }, ')'],
                diferentesNegativo: ['the Budget forecast for the full year a deficit (balance of ', { claim: SALDO_PREVISTO, sufixo: ' million euros' }, ')'],
                diferentesPositivo: ['the Budget forecast for the full year a surplus of ', { claim: SALDO_PREVISTO, sufixo: ' million euros' }],
                diferentesZero: ['the Budget forecast for the full year a nil balance of ', { claim: SALDO_PREVISTO, sufixo: ' million euros' }],
              },
              ', and September to December are still to come. These accounts cover central government and social security; the public accounts of ', { periodo: SALDO }, ' also include regional and local government.',
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
              'No fim de ', { periodo: DIVIDA }, ', a dívida pública valia ', { claim: DIVIDA, sufixo: PC }, ' do que o país produz num ano, ',
              { compara: [DIVIDA, DIVIDA_UE],
                palavras: { maior: { contem: ['acima'], naoContem: ['abaixo', 'igual'] }, menor: { contem: ['abaixo'], naoContem: ['acima', 'igual'] }, igual: { contem: ['igual'], naoContem: ['acima', 'abaixo'] } },
                maior: ['acima dos ', { claim: DIVIDA_UE, sufixo: PC }, ' da média da União Europeia'],
                menor: ['abaixo dos ', { claim: DIVIDA_UE, sufixo: PC }, ' da média da União Europeia'],
                igual: ['igual aos ', { claim: DIVIDA_UE, sufixo: PC }, ' da média da União Europeia'] },
              ', e as contas públicas fecharam o ano com um saldo de ', { claim: SALDO, sufixo: PC }, ' do produto, ',
              { sinal: SALDO, palavras: { positivo: { contem: ['excedente'], naoContem: ['défice', 'nulo'] }, negativo: { contem: ['défice'], naoContem: ['excedente', 'nulo'] }, zero: { contem: ['nulo'], naoContem: ['excedente', 'défice'] } }, positivo: ['um excedente (recebeu mais do que gastou)'], negativo: ['um défice (gastou mais do que recebeu)'], zero: ['um saldo nulo (recebeu o mesmo que gastou)'] }, '.',
            ],
            en: [
              'At the end of ', { periodo: DIVIDA }, ', public debt was worth ', { claim: DIVIDA, sufixo: PC }, ' of what the country produces in a year, ',
              { compara: [DIVIDA, DIVIDA_UE],
                palavras: { maior: { contem: ['above'], naoContem: ['below', 'equal'] }, menor: { contem: ['below'], naoContem: ['above', 'equal'] }, igual: { contem: ['equal'], naoContem: ['above', 'below'] } },
                maior: ['above the ', { claim: DIVIDA_UE, sufixo: PC }, ' average of the European Union'],
                menor: ['below the ', { claim: DIVIDA_UE, sufixo: PC }, ' average of the European Union'],
                igual: ['equal to the ', { claim: DIVIDA_UE, sufixo: PC }, ' average of the European Union'] },
              ', and the public accounts closed the year with a balance of ', { claim: SALDO, sufixo: PC }, ' of output, ',
              { sinal: SALDO, palavras: { positivo: { contem: ['surplus'], naoContem: ['deficit', 'nil'] }, negativo: { contem: ['deficit'], naoContem: ['surplus', 'nil'] }, zero: { contem: ['nil'], naoContem: ['surplus', 'deficit'] } }, positivo: ['a surplus (it took in more than it spent)'], negativo: ['a deficit (it spent more than it took in)'], zero: ['a nil balance (it took in as much as it spent)'] }, '.',
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
        { se: [A_EXECUCAO_E_DE_AGOSTO], partes: ['O orçamento é uma previsão: o que se gasta de facto lê-se na execução, mês a mês, e a execução até agosto é a que esta explicação mostra acima.'] },
        { se: [SEM_LINHAS_DOS_JUROS], partes: [' Estes números não isolam o custo dos juros da dívida.'] },
        ' O detalhe por programa e por ministério, com a fonte de cada número, está no recibo de cada um, a um toque.',
      ],
      en: [
        { se: [A_EXECUCAO_E_DE_AGOSTO], partes: ['The budget is a forecast: what is actually spent is read in the budget execution, month by month, and the execution to August is the one this explainer shows above.'] },
        { se: [SEM_LINHAS_DOS_JUROS], partes: [' These figures do not isolate the cost of the interest on the debt.'] },
        ' The detail by programme and by ministry, with the source of each figure, is in each one’s receipt, one tap away.',
      ],
    },
  ],
  /** As portas do fim (o §5, ponto 3, do brief, e a decisão do lugar de direção sobre a I212): os recibos. A da página do
      tema «Estado e economia» saiu no EX1-c (o achado 7 da leitura a frio): essa página não tem as linhas do Orçamento
      nem as da execução. A porta para o estudo do Orçamento de 2026 volta quando ele tiver página. */
  portas: [{ rota: 'livro' }],
};

/**
 * OS ACERTOS EM RELAÇÃO AO TEXTO DO §5, PONTO 4, DO BRIEF, cada um com a razão. Uma diferença que não esteja
 * aqui fecha o guião `acertos-ex1.mjs`. As três primeiras não mudam um carácter do texto rendido.
 * @type {{ id: string, onde: string, o_que: string, razao: string }[]}
 */
export const ACERTOS = [
  { id: 'HIG-EX1', onde: 'contas e execução', o_que: 'retirar a comparação das transferências, explicar os perímetros sem referência à posição e apresentar o défice pelo saldo', razao: 'Higiene de 13.10.2026, EX1-12 a EX1-14; os valores mantêm-se e a auditoria acompanha as palavras' },
  { id: 'X24', onde: 'execução', o_que: 'dizer que ainda faltam os meses de setembro a dezembro', razao: 'EX1-f, achado 7: o saldo é acumulado de janeiro a agosto e a previsão é anual' },
  { id: 'X25', onde: 'execução', o_que: 'apontar para as contas públicas do parágrafo seguinte', razao: 'EX1-f, achado 8: usar as palavras e a posição real do parágrafo de destino' },
  { id: 'X1', onde: 'título, abertura, execução, dívida', o_que: 'os anos «2026», «agosto de 2026» e «2025» entram por `{ periodo }` de uma linha nomeada', razao: 'nenhum algarismo escrito à mão (o mandato, ponto 3); o texto rendido é o mesmo' },
  { id: 'X2', onde: 'abertura', o_que: 'o parêntese «(a fonte desta frase é a classificação das funções das administrações públicas, a divisão 01, que o construtor cita na auditoria da leitura)» não se rende', razao: 'é uma instrução ao construtor: a fonte está na auditoria, nas origens `eurostat-cofog-divisao-01` e `dados-gov-oe-despesa-funcional`' },
  { id: 'X3', onde: 'por função', o_que: '«As dez funções, de cada cem euros:» é o título da figura, e «a figura das barras, uma por linha, da maior para a menor» e «(os ids oe-2026-cem-euros-funcao-NN)» não se rendem', razao: 'são instruções ao construtor: a figura é a forma `barras-do-livro`' },
  { id: 'X4', onde: 'por função', o_que: '«e a [nome: 08]» passa a «e o [nome: 08]»', razao: 'o nome declarado da função 08 é «desporto, recreação, cultura e religião», que pede o artigo masculino' },
  { id: 'X5', onde: 'por ministério', o_que: 'a frase «A fatia das Finanças é grande porque […]» não se rende, e a das Finanças acaba em «de cada cem euros» e no valor em euros', razao: 'o relatório do Orçamento do Estado de 2026 não está alojado no motor (a pasta do estudo OE1 tem os mapas, os ficheiros do dados.gov.pt, as sínteses da execução e as respostas do Eurostat): a razão não se leu na fonte, e o brief manda que a frase acabe aí' },
  { id: 'X6', onde: 'por ministério', o_que: '«A figura das barras dos dezasseis ministérios, da maior para a menor.» é a figura, com o título «Os dezasseis ministérios, de cada cem euros»', razao: 'é uma instrução ao construtor; o título tem a forma do da figura das funções' },
  { id: 'X7', onde: 'dívida e saldo', o_que: 'os três valores levam o símbolo « %» ao lado', razao: 'a unidade das três linhas é «% do PIB»: sem o símbolo, «valia 89,7 do que o país produz» lia-se como uma quantia' },
  { id: 'X8', onde: 'o que isto não diz', o_que: 'a frase «O detalhe por programa e por ministério, com a fonte de cada número, está no estudo do Orçamento do Estado de 2026.» passa a «O detalhe por programa e por ministério, com a fonte de cada número, está no recibo de cada um, a um toque.», e a porta do fim é a dos recibos', razao: 'a decisão do lugar de direção de 06.10.2026 sobre a I212: o estudo `oe-2026` não tem página nem rota (`src/data/studies.mjs`, `INTERNAL_SOURCES`: «Este registo não cria um trabalho em WORKS, uma página ou uma rota»), e a porta para ele volta quando a tiver; a passagem EX1-c tirou a frase e a porta do tema «Estado e economia» (o achado 7 da leitura a frio: essa página não tem as linhas do Orçamento nem as da execução)' },
  { id: 'X9', onde: 'abertura, ministérios, o que isto não diz', o_que: 'as frases que comparam ou que dizem uma ausência ficam guardadas por condições declaradas (`se`)', razao: 'uma frase avaliativa leva o ramo que os números decidem (§1 do brief); quando os números deixam de lhe dar razão, sai da página e deixa um sinal' },
  { id: 'X10', onde: 'secções', o_que: 'os títulos das secções sem o ponto final («Por função.» passa a título «Por função»), e «O que isto não diz» é a cadeia da casa', razao: 'são títulos de secção; o último é o mesmo em todas as explicações (o §5, ponto 3, do brief)' },
  { id: 'X11', onde: 'o que já se gastou este ano', o_que: '«os programas que mais gastaram foram o do Trabalho, Solidariedade e Segurança Social (…), o da Saúde (…) e o da Gestão da Dívida Pública (…)» passa ao token `maiores`: os três programas de maior despesa, por ordem decrescente, cada um com o nome declarado da linha e o valor ao lado («o de [nome] ([valor] milhões), o de [nome] ([valor]) e o de [nome] ([valor])»), decididos pelos números em cada construção', razao: 'a decisão do lugar de direção de 06.10.2026 sobre a I213: com os números de 05.10.2026 a frase do brief era falsa (o programa 004, Finanças, gastou 5 337,6 milhões e o 005, 5 212,7); a decisão diz «dezanove programas», e o livro tem vinte (de `execucao-2026-08-despesa-programa-001` a `-020`, com a mesma unidade, o mesmo período e o mesmo quadro da fonte), e o token lê a família inteira' },
  { id: 'X12', onde: 'por ministério', o_que: 'entra, a seguir à figura dos ministérios, a frase «As duas contas não batem porque medem coisas diferentes: a conta por função soma o que a administração central gasta com cada fim, como a saúde ou a educação, sem as operações financeiras nem as transferências entre os seus serviços; a conta por ministério é o orçamento de cada ministério, com as operações financeiras e as transferências entre serviços do Estado.»', razao: 'a decisão do lugar de direção de 06.10.2026 sobre a I215, com a forma do EX1-c (o achado 6 da leitura a frio): a frase diz o que cada conta inclui e exclui, pelos apoios que a auditoria já tinha (a descrição da classificação funcional no dados.gov.pt, as ressalvas e as derivações das linhas)' },
  { id: 'X13', onde: 'a dívida e o saldo', o_que: '«com um [excedente|défice] de [saldo] do produto» passa a «com um saldo de [saldo] do produto, [ramo do sinal]»', razao: 'a decisão do lugar de direção de 06.10.2026 sobre a I216: com um saldo negativo, a forma do brief diria «um défice de» seguido do valor com o sinal menos; o sinal fica com o número e a palavra vai para o fim' },
  { id: 'X14', onde: 'por ministério', o_que: '«o das Finanças», «a Saúde», «o Trabalho, Solidariedade e Segurança Social» e «a Educação, Ciência e Inovação» passam a `{ nome }`, o nome declarado da linha de cada ministério («o Ministério das Finanças», …)', razao: 'o achado 12 da leitura a frio (EX1-c, 06.10.2026): os nomes estavam escritos à mão nas duas edições, e o mandato do brief pedia os nomes dos ministérios pelos nomes declarados das linhas' },
  { id: 'X15', onde: 'a dívida e o saldo', o_que: '«contra [dívida da União] na média da União Europeia» passa ao token `compara`: «acima dos [dívida da União] da média da União Europeia», «abaixo» ou «igual aos», pela comparação dos dois valores', razao: 'o achado 9 da leitura a frio (EX1-c, 06.10.2026): a frase dizia os dois números e não o lado, que a primeira página já diz pela mesma gramática' },
  { id: 'X16', onde: 'a dívida e o saldo', o_que: 'os ramos do sinal ganham a explicação entre parênteses, «um excedente (recebeu mais do que gastou)» e «um défice (gastou mais do que recebeu)», e o ramo «zero», «um saldo nulo (recebeu o mesmo que gastou)»', razao: 'os achados 9 e 17 da leitura a frio (EX1-c, 06.10.2026): a palavra sozinha não diz o que quer dizer, e sem o ramo «zero» um saldo de exatamente zero fechava a construção' },
  { id: 'X17', onde: 'o que isto não diz', o_que: '«Os juros da dívida não estão ainda no livro-razão deste projeto como linha própria; quando entrarem, esta explicação diz quanto são.» passa a «Falta aqui o custo dos juros da dívida, que o Orçamento também prevê e que estes números não mostram.»', razao: 'o achado 16 da leitura a frio (EX1-c, 06.10.2026): a frase falava do livro-razão do projeto e prometia uma atualização, e o sítio não se explica a si próprio nas páginas de conteúdo; a frase continua guardada pela condição de nenhuma linha dos juros' },
  { id: 'X18', onde: 'o que isto não diz', o_que: 'os juros não estão isolados, com a alternativa «noutra classificação» e a atualização prevista pelo mandato EX1-d', razao: 'o excerto selado nomeia Public debt transactions, mas não explicita os juros; aplica-se a alternativa autorizada, mantendo a condição da ausência de linhas' },
  { id: 'X19', onde: 'o que isto não diz', o_que: 'a execução até agosto é a que esta explicação mostra acima', razao: 'EX1-d: a referência à posição na página deixa de parecer uma comparação de valores' },
  { id: 'X23', onde: 'execução', o_que: 'no fim do mês apresentavam um saldo acumulado; distinguir a conta das administrações públicas do outro ano', razao: 'EX1-e, achado 11: não sugerir fecho anual e explicitar a diferença de perímetros, pela nota da linha e com o ano por token' },
  { id: 'X22', onde: 'abertura e o que isto não diz', o_que: 'retirar a inclusão dos juros numa classificação, a previsão não apoiada e a promessa de atualização', razao: 'EX1-e, achados 5 e 10: o selo sustenta as transferências; a ausência dos juros isolados é a condição sem_linhas, sem afirmar onde entram' },
  { id: 'X21', onde: 'execução', o_que: 'comparar a dimensão dos défices ou excedentes pelo token comparaSaldos, com todos os ramos declarados', razao: 'EX1-e, achado 4: os módulos evitam inverter o sentido da comparação de défices; sinais diferentes só apresentam a previsão anual' },
  { id: 'X20', onde: 'execução', o_que: 'o saldo global do mesmo perímetro, o significado pelo sinal e a comparação com o saldo previsto para o ano inteiro', razao: 'EX1-d: as linhas do saldo executado e previsto constam do mesmo quadro dos totais; compara-se o saldo com sinal, sem afirmar cumprimento de uma meta mensal' },
  { id: 'RP4N-9', onde: 'por ministério', o_que: 'sai a oração final sobre operações financeiras e transferências na conta por ministério', razao: 'RP4-n-d, achado 14: a oração apoiava-se apenas na ressalva não selada que saiu do recibo. Conservam-se a distinção entre funções e ministérios e os restantes apoios da I215; não se promove a ressalva retirada a fonte da explicação.' },
];
