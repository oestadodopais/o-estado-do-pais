/**
 * ===========================================================================
 * PARA ONDE VAI O DINHEIRO DO ESTADO EM 2027, PELA PROPOSTA DE ORÇAMENTO · a declaração (bloco EX4, 21.10.2026)
 * ===========================================================================
 *
 * DE ONDE VEM. O texto é o do mandato EX4 do lugar de direção (21.10.2026), §2, à letra, com os tokens a resolver nas
 * linhas que ele nomeia, pela gramática da primeira explicação (`dinheiro-do-estado-2026.mjs`, cujo cabeçalho a
 * descreve) e do resolvedor (`src/lib/explicacoes.mjs`). Os números são as linhas do Mapa 2 da Proposta de Lei
 * n.º 110/XVII/2.ª e do Mapa 2 da Lei n.º 73-A/2025, exportadas do motor pelo manifesto `publisher/manifest.pf1.json`
 * (o registo `ledger/cruzamentos/pf1.json`); os nomes declarados das linhas estão em `src/data/medidas-pf1.mjs`.
 *
 * O QUE O EX4 ACRESCENTOU À GRAMÁTICA, e só isto: o título de uma secção pode ser uma lista de pedaços (os anos por
 * `{ periodo }`); o número do mapa e o código da subfunção entram por `{ verbatim }`, relidos em cada construção nos
 * campos selados das linhas (`IDENTIFICADORES_SELADOS`); e as portas do fim levam também a página de um estudo e a de
 * outra explicação.
 *
 * O QUE MUDOU EM RELAÇÃO AO TEXTO DO MANDATO, e é tudo: a lista `ACERTOS`, abaixo, cada um com a razão, que o guião
 * `design/especime-v3/medicoes/ex4-2026-10-21/acertos-ex4.mjs` prova frase a frase. Sem travessões.
 */

const N10 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
const F27 = (/** @type {string} */ n) => `oe-2027-cem-euros-funcao-${n}-mapa`;
const F26 = (/** @type {string} */ n) => `oe-2026-cem-euros-funcao-${n}-mapa`;
const S27 = (/** @type {string} */ n) => `oe-2027-cem-euros-funcao-${n}-sem-divida-mapa`;
const E27 = (/** @type {string} */ n) => `oe-2027-despesa-funcao-${n}-mapa`;
const V = (/** @type {string} */ n) => `der-oe2027-funcao-${n}-variacao-pct`;
const TOTAL27 = 'oe-2027-despesa-total-mapa';
const TOTAL26 = 'oe-2026-despesa-total-mapa';
const CONS27 = 'oe-2027-despesa-total-consolidada-mapa';
const DIV27 = 'oe-2027-despesa-subfuncao-01-7-mapa';
const SEMDIV27 = 'oe-2027-despesa-sem-divida-mapa';
const SEMDIV26 = 'oe-2026-despesa-sem-divida-mapa';
const VTOTAL = 'der-oe2027-despesa-total-mapa-variacao-pct';
const VSEM = 'der-oe2027-despesa-sem-divida-variacao-pct';
const ENTREGA = 'oe-2027-calendario-entrega';
/** O programa Saúde do Quadro 5.37 do relatório da proposta, total consolidado, em milhões de euros (a secção «Os gémeos» do LEIA-ME do PF1). */
const PROGRAMA_SAUDE = 'oe-2027-saude-despesa-total-consolidada-2027';
/** A primeira explicação, cuja base (a despesa efetiva consolidada dos dados abertos) o fim nomeia pelo ano. */
const BASE_DE_2026 = 'oe-2026-cem-euros-funcao-01';
const EUR = ' euros';
const PC = ' %';
/* Os identificadores com algarismos, relidos nos campos selados (`IDENTIFICADORES_SELADOS`). */
const MAPA_2027 = { verbatim: 'pf1-mapa-2027-numero' };
const MAPA_2026 = { verbatim: 'pf1-mapa-2026-numero' };
const SUBFUNCAO = { verbatim: 'pf1-subfuncao-01-7-codigo' };

/* AS CONDIÇÕES, nomeadas: a lista de referência é a família inteira das dez. */
const A_MAIOR_FATIA_SEM_DIVIDA = { primeiros: [S27('07')], de: N10.map(S27) };
const A_QUE_MAIS_CRESCE = { primeiros: [V('04')], de: N10.map(V) };
const O_TOTAL_ACIMA_DO_CONSOLIDADO = { primeiros: [TOTAL27], de: [TOTAL27, CONS27] };

export const DINHEIRO_DO_ESTADO_2027 = {
  slug: 'dinheiro-do-estado-2027',
  escrita: '2026-10-21',
  titulo: {
    pt: ['Para onde vai o dinheiro do Estado em ', { periodo: F27('01') }, ', pela proposta de Orçamento'],
    en: ['Where the State’s money goes in ', { periodo: F27('01') }, ', by the Budget proposal'],
  },
  abertura: [
    {
      pt: [
        'A proposta de Orçamento do Estado para ', { periodo: F27('01') }, ', entregue ao Parlamento a ', { periodo: ENTREGA },
        ', traz um mapa da despesa da Administração Central por função, o Mapa ', MAPA_2027, '. Esse mapa soma ', { claim: TOTAL27, sufixo: EUR }, ', e ',
        { compara: [DIV27, SEMDIV27],
          palavras: { maior: { contem: ['mais de metade'], naoContem: ['menos de metade'] }, menor: { contem: ['menos de metade'], naoContem: ['mais de metade'] }, igual: { contem: ['metade'], naoContem: ['mais de', 'menos de'] } },
          maior: ['mais de metade desse total'], menor: ['menos de metade desse total'], igual: ['metade desse total'] },
        ', ', { claim: DIV27, sufixo: EUR }, ', é a subfunção a que o mapa chama «operações relacionadas com a dívida pública». Tirando essa subfunção, sobram ',
        { claim: SEMDIV27, sufixo: EUR }, '. De cada cem euros desses, ',
        { claim: S27('07') }, ' vão para a ', { nome: S27('07') }, ', ', { claim: S27('04') }, ' para os ', { nome: S27('04') }, ', ',
        { claim: S27('01') }, ' para os ', { nome: S27('01') }, ', ', { claim: S27('10') }, ' para a ', { nome: S27('10') }, ' e ',
        { claim: S27('09') }, ' para a ', { nome: S27('09') }, '.',
        { se: [A_MAIOR_FATIA_SEM_DIVIDA], partes: [' A maior fatia é a da ', { nome: S27('07') }, '.'] },
      ],
      en: [
        'The State Budget proposal for ', { periodo: F27('01') }, ', delivered to Parliament on ', { periodo: ENTREGA },
        ', carries a map of central administration expenditure by function, Map ', MAPA_2027, '. That map adds up to ', { claim: TOTAL27, sufixo: EUR }, ', and ',
        { compara: [DIV27, SEMDIV27],
          palavras: { maior: { contem: ['more than half'], naoContem: ['less than half'] }, menor: { contem: ['less than half'], naoContem: ['more than half'] }, igual: { contem: ['half'], naoContem: ['more than', 'less than'] } },
          maior: ['more than half of that total'], menor: ['less than half of that total'], igual: ['half of that total'] },
        ', ', { claim: DIV27, sufixo: EUR }, ', is the subfunction the map calls «operations related to public debt». Taking that subfunction out, ',
        { claim: SEMDIV27, sufixo: EUR }, ' remain. Of every hundred euros of those, ',
        { claim: S27('07') }, ' go to ', { nome: S27('07') }, ', ', { claim: S27('04') }, ' to ', { nome: S27('04') }, ', ',
        { claim: S27('01') }, ' to ', { nome: S27('01') }, ', ', { claim: S27('10') }, ' to ', { nome: S27('10') }, ' and ',
        { claim: S27('09') }, ' to ', { nome: S27('09') }, '.',
        { se: [A_MAIOR_FATIA_SEM_DIVIDA], partes: [' The largest share is ', { nome: S27('07') }, '.'] },
      ],
    },
  ],
  seccoes: [
    {
      id: 'como-o-mapa-a-escreve',
      titulo: { pt: 'Por função, como o mapa a escreve', en: 'By function, as the map writes it' },
      conteudo: [
        {
          paragrafo: {
            pt: [
              'Lido como o mapa o escreve, ', { claim: F27('01') }, ' de cada cem euros vão para os ', { nome: F27('01') },
              ', porque a subfunção das operações relacionadas com a dívida pública está dentro dessa função; a ', { nome: F27('07') }, ' leva ', { claim: F27('07') },
              ', os ', { nome: F27('04') }, ' ', { claim: F27('04') }, ', a ', { nome: F27('10') }, ' ', { claim: F27('10') }, ' e a ', { nome: F27('09') }, ' ', { claim: F27('09') },
              '. A ', { nome: F27('03') }, ' leva ', { claim: F27('03') }, ', a ', { nome: F27('02') }, ' ', { claim: F27('02') }, ', a ', { nome: F27('06') }, ' ', { claim: F27('06') },
              ', a ', { nome: F27('05') }, ' ', { claim: F27('05') }, ' e o ', { nome: F27('08') }, ' ', { claim: F27('08') }, '.',
            ],
            en: [
              'Read as the map writes it, ', { claim: F27('01') }, ' of every hundred euros go to ', { nome: F27('01') },
              ', because the subfunction of the operations related to public debt sits inside that function; ', { nome: F27('07'), inicial: true }, ' takes ', { claim: F27('07') },
              ', ', { nome: F27('04') }, ' ', { claim: F27('04') }, ', ', { nome: F27('10') }, ' ', { claim: F27('10') }, ' and ', { nome: F27('09') }, ' ', { claim: F27('09') },
              '. ', { nome: F27('03'), inicial: true }, ' takes ', { claim: F27('03') }, ', ', { nome: F27('02') }, ' ', { claim: F27('02') }, ', ', { nome: F27('06') }, ' ', { claim: F27('06') },
              ', ', { nome: F27('05') }, ' ', { claim: F27('05') }, ' and ', { nome: F27('08') }, ' ', { claim: F27('08') }, '.',
            ],
          },
        },
      ],
    },
    {
      id: 'sem-a-divida',
      titulo: { pt: 'Sem as operações relacionadas com a dívida pública', en: 'Without the operations related to public debt' },
      conteudo: [
        {
          paragrafo: {
            pt: [
              'Esta conta é deste projeto: a despesa total do mapa menos a subfunção ', SUBFUNCAO, ', e cada função a dividir por esse resto; o recibo de cada linha mostra a conta. A ',
              { nome: S27('03') }, ' leva ', { claim: S27('03') }, ' de cada cem euros, a ', { nome: S27('02') }, ' ', { claim: S27('02') }, ', a ', { nome: S27('06') }, ' ', { claim: S27('06') },
              ', a ', { nome: S27('05') }, ' ', { claim: S27('05') }, ' e o ', { nome: S27('08') }, ' ', { claim: S27('08') }, '.',
            ],
            en: [
              'This calculation is this project’s: the map’s total expenditure minus subfunction ', SUBFUNCAO, ', and each function divided by that remainder; each row’s receipt shows the calculation. ',
              { nome: S27('03'), inicial: true }, ' takes ', { claim: S27('03') }, ' of every hundred euros, ', { nome: S27('02') }, ' ', { claim: S27('02') }, ', ', { nome: S27('06') }, ' ', { claim: S27('06') },
              ', ', { nome: S27('05') }, ' ', { claim: S27('05') }, ' and ', { nome: S27('08') }, ' ', { claim: S27('08') }, '.',
            ],
          },
        },
      ],
    },
    {
      id: 'o-que-muda',
      titulo: {
        pt: ['O que muda da lei de ', { periodo: F26('01') }, ' para a proposta de ', { periodo: F27('01') }, ''],
        en: ['What changes from the ', { periodo: F26('01') }, ' law to the ', { periodo: F27('01') }, ' proposal'],
      },
      conteudo: [
        {
          paragrafo: {
            pt: [
              'A comparação certa é o Mapa ', MAPA_2026, ' da Lei do Orçamento para ', { periodo: F26('01') }, ': o mesmo mapa, o mesmo perímetro, a mesma unidade. A despesa total do mapa passa de ',
              { claim: TOTAL26, sufixo: EUR }, ' para ', { claim: TOTAL27, sufixo: EUR }, ', uma variação de ', { claim: VTOTAL, sufixo: PC },
              '; sem as operações relacionadas com a dívida pública, passa de ', { claim: SEMDIV26, sufixo: EUR }, ' para ', { claim: SEMDIV27, sufixo: EUR }, ', ', { claim: VSEM, sufixo: PC },
              '. Por função, em euros: os ', { nome: V('04') }, ' variam ', { claim: V('04'), sufixo: PC }, ', a ', { nome: V('07') }, ' ', { claim: V('07'), sufixo: PC },
              ', a ', { nome: V('10') }, ' ', { claim: V('10'), sufixo: PC }, ', a ', { nome: V('09') }, ' ', { claim: V('09'), sufixo: PC }, ', a ', { nome: V('02') }, ' ', { claim: V('02'), sufixo: PC },
              ', a ', { nome: V('05') }, ' ', { claim: V('05'), sufixo: PC }, ' e o ', { nome: V('08') }, ' ', { claim: V('08'), sufixo: PC }, '.',
              { se: [A_QUE_MAIS_CRESCE], partes: [' A função que mais cresce é a dos ', { nome: V('04') }, '.'] },
              ' O que está dentro de cada função, medida a medida, lê-se no estudo do Orçamento.',
            ],
            en: [
              'The right comparison is Map ', MAPA_2026, ' of the Budget Law for ', { periodo: F26('01') }, ': the same map, the same perimeter, the same unit. The map’s total expenditure goes from ',
              { claim: TOTAL26, sufixo: EUR }, ' to ', { claim: TOTAL27, sufixo: EUR }, ', a change of ', { claim: VTOTAL, sufixo: PC },
              '; without the operations related to public debt, it goes from ', { claim: SEMDIV26, sufixo: EUR }, ' to ', { claim: SEMDIV27, sufixo: EUR }, ', ', { claim: VSEM, sufixo: PC },
              '. By function, in euros: ', { nome: V('04'), inicial: true }, ' change by ', { claim: V('04'), sufixo: PC }, ', ', { nome: V('07') }, ' by ', { claim: V('07'), sufixo: PC },
              ', ', { nome: V('10') }, ' by ', { claim: V('10'), sufixo: PC }, ', ', { nome: V('09') }, ' by ', { claim: V('09'), sufixo: PC }, ', ', { nome: V('02') }, ' by ', { claim: V('02'), sufixo: PC },
              ', ', { nome: V('05') }, ' by ', { claim: V('05'), sufixo: PC }, ' and ', { nome: V('08') }, ' by ', { claim: V('08'), sufixo: PC }, '.',
              { se: [A_QUE_MAIS_CRESCE], partes: [' The function that grows most is ', { nome: V('04') }, '.'] },
              ' What sits inside each function, measure by measure, is read in the Budget study.',
            ],
          },
        },
      ],
    },
    {
      id: 'saude',
      titulo: { pt: 'A Saúde: a função e o programa', en: 'Health: the function and the programme' },
      conteudo: [
        {
          paragrafo: {
            pt: [
              'A função ', { nome: F27('07') }, ' do mapa, ', { claim: E27('07'), sufixo: EUR }, ', não é o programa Saúde do Orçamento, ',
              { claim: PROGRAMA_SAUDE, sufixo: ' milhões de euros' }, ' em ', { periodo: PROGRAMA_SAUDE },
              ': o programa é consolidado e é um programa orçamental; a função é uma classificação da despesa, não consolidada, que conta as transferências entre serviços. As duas contas medem coisas diferentes, e nenhuma está errada.',
            ],
            en: [
              'The map’s ', { nome: F27('07') }, ' function, ', { claim: E27('07'), sufixo: EUR }, ', is not the Budget’s Health programme, ',
              { claim: PROGRAMA_SAUDE, sufixo: ' million euros' }, ' in ', { periodo: PROGRAMA_SAUDE },
              ': the programme is consolidated and is a budget programme; the function is a classification of expenditure, unconsolidated, which counts the transfers between services. The two accounts measure different things, and neither is wrong.',
            ],
          },
        },
      ],
    },
  ],
  naoDiz: [
    {
      pt: [
        'Esta explicação lê o Mapa ', MAPA_2027, ' de uma proposta: o que o Parlamento aprovar pode ser diferente, e o que se gasta de facto lê-se depois, na execução.',
        { se: [O_TOTAL_ACIMA_DO_CONSOLIDADO], partes: [
          ' Os valores não são consolidados, contam as transferências entre serviços, e por isso a despesa total do mapa é maior do que a despesa total consolidada, ',
          { claim: CONS27, sufixo: EUR }, ' em ', { periodo: CONS27 }, '.',
        ] },
        ' A conta «sem as operações relacionadas com a dívida pública» é deste projeto, declarada no recibo de cada linha; o mapa só dá o nome a essa subfunção, e esta explicação não diz o que entra nela. A base da explicação de ',
        { periodo: BASE_DE_2026 }, ', a despesa efetiva consolidada por função dos dados abertos, ainda não existe para ', { periodo: F27('01') }, '; quando existir, esta explicação passa a essa base.',
      ],
      en: [
        'This explainer reads Map ', MAPA_2027, ' of a proposal: what Parliament approves may differ, and what is actually spent is read afterwards, in the budget execution.',
        { se: [O_TOTAL_ACIMA_DO_CONSOLIDADO], partes: [
          ' The values are unconsolidated, they count the transfers between services, and so the map’s total expenditure is larger than the consolidated total expenditure, ',
          { claim: CONS27, sufixo: EUR }, ' in ', { periodo: CONS27 }, '.',
        ] },
        ' The calculation «without the operations related to public debt» is this project’s, declared in each row’s receipt; the map only names that subfunction, and this explainer does not say what goes into it. The basis of the ',
        { periodo: BASE_DE_2026 }, ' explainer, consolidated effective expenditure by function from the open data, does not yet exist for ', { periodo: F27('01') }, '; when it does, this explainer moves to that basis.',
      ],
    },
  ],
  portas: [
    { rota: 'livro' },
    { rota: 'estudo', slug: 'orcamento-2027-o-que-muda-e-para-quem' },
    { rota: 'explicacao', slug: 'dinheiro-do-estado-2026' },
  ],
};

/**
 * OS ACERTOS EM RELAÇÃO AO TEXTO DO §2 DO MANDATO EX4, cada um com a razão. Uma diferença que não esteja aqui fecha o
 * guião `acertos-ex4.mjs`. `frases` lista as frases portuguesas do mandato que o acerto toca (o número de ordem que o
 * guião lhes dá, na sua lista), e `tipo` diz se a frase sai (`fora`) ou se o texto rendido é o mesmo (`igual`).
 * @type {{ id: string, onde: string, tipo: 'fora'|'igual', frases: string[], o_que: string, razao: string }[]}
 */
export const ACERTOS = [
  { id: 'EX4-A1', onde: 'secção 1 e secção 2', tipo: 'fora', frases: ['figura-1', 'figura-2'],
    o_que: 'as duas figuras `barras-do-livro` (as dez `F27` e as dez `S27`) não se rendem, com os seus títulos',
    razao: 'os dois títulos do mandato levam o ano por `{ periodo }` e o número do mapa («Mapa 2») ou o código da subfunção («01.7»), e o título de uma figura, na gramática (`resolverExplicacao`, `modeloDasBarrasDoLivro`, a F22 e a X1), é uma cadeia sem algarismos nem pedaços; mudar a forma da figura (o modelo, o componente, a F22, a X1 e a X4) não coube no orçamento do bloco, e o mandato manda que uma frase que não se escreve como está fique fora' },
  { id: 'EX4-A2', onde: 'o que isto não diz', tipo: 'fora', frases: ['naoDiz-2'],
    o_que: 'a frase «O mapa é só o subsetor da Administração Central: a Segurança Social, com as pensões, tem o seu mapa, o Mapa 7, que não está aqui.» não se rende (nas duas edições)',
    razao: 'o número «7» do Mapa 7 não está em nenhum campo selado de nenhuma linha do livro (procurado em `ledger/claims/*.yml`), e nenhum algarismo se escreve à mão numa palavra fixa' },
  { id: 'EX4-A3', onde: 'título, abertura, secção 3, secção 4, o que isto não diz', tipo: 'igual', frases: [],
    o_que: 'os anos e a data da entrega entram por `{ periodo }` das linhas nomeadas; «Mapa 2» e «01.7» entram por `{ verbatim }`, relidos em cada construção no `document.locator` das linhas dos totais e no `excerpt` da linha da subfunção',
    razao: 'nenhum algarismo escrito à mão (o mandato, cabeçalho); o texto rendido é o mesmo' },
  { id: 'EX4-A4', onde: 'o que isto não diz', tipo: 'igual', frases: [],
    o_que: 'a frase «Os valores não são consolidados, […] é maior do que a despesa total consolidada, […]» fica guardada pela condição de a despesa total do mapa ser maior do que a consolidada',
    razao: 'é uma frase que compara («maior do que»), e as frases que comparam levam a guarda que os números decidem (o mandato, §1.3); o texto rendido é o mesmo' },
  { id: 'EX4-A5', onde: 'títulos das secções, edição inglesa', tipo: 'igual', frases: [],
    o_que: 'os quatro títulos ingleses das secções são a tradução do construtor («By function, as the map writes it», «Without the operations related to public debt», «What changes from the [periodo] law to the [periodo] proposal», «Health: the function and the programme»)',
    razao: 'o §2 do mandato dá os títulos das secções só em português; o guião compara a edição portuguesa' },
];
