/**
 * Os números da primeira página.
 *
 * Cada cartão é uma afirmação do livro-razão, mais as palavras que a rodeiam
 * nas duas línguas. As palavras não trazem números: onde é preciso um número,
 * há um { claim: … }; onde é preciso uma data, há um { ref: … }; onde é preciso
 * um limiar publicado, há um { nl: …, motivo: 'limiar-do-quadro' }.
 *
 * ---------------------------------------------------------------------------
 * A LINHA DO LIMIAR (v2, direção S; IDENTIDADE.md §11)
 * ---------------------------------------------------------------------------
 * O limiar saiu da linha da medida e ganhou linha própria: «limiar 60% ·
 * acima». Não leva barra e não leva distância. Uma barra por célula,
 * normalizada ao seu próprio limiar, convida a comparar oito medidas que não
 * são comparáveis, e uma distância seria um número novo, sem linha e sem selo
 * (`design/CRITICA-codex.md`; `design/DECISAO.md`). O desenho de distância vive
 * no instrumento, onde há uma escala partilhada.
 *
 * A PALAVRA É DERIVADA, E DE DOIS NÚMEROS QUE JÁ EXISTEM. «acima», «abaixo» ou
 * «no limiar» sai de `comparacaoComOLimiar()`, que compara o valor publicado da
 * linha com o limiar publicado pelo quadro. É prosa da casa gerada de uma
 * comparação, e não um algarismo: não acrescenta um dígito à página, e por isso
 * não pede proveniência nova. Os dígitos que aparecem continuam a ser dois: o
 * valor, que entra por `<Claim>` com selo, e o limiar, que continua debaixo do
 * motivo `limiar-do-quadro`.
 *
 * O SINAL VAI À FRENTE E EM PROSA. O limiar da posição de investimento é −35, e
 * o sinal é um símbolo, não um algarismo: fica fora da marca, como já estava
 * quando o limiar vivia dentro da linha da medida.
 *
 * As frases dizem o que a medida é, não o que ela significa. A interpretação
 * é trabalho do director, e vai nos estudos.
 *
 * ESCOLHA DOS INDICADORES — 2026-08-12.
 * Estes não são indicadores escolhidos por nós. São os do painel do
 * Procedimento relativo aos Desequilíbrios Macroeconómicos e do Painel Social
 * Europeu: o conjunto que as instituições europeias usam para avaliar um
 * Estado-Membro, com os limiares que elas próprias publicam. O critério de
 * selecção, e a comparação entre os quadros do FMI, da OCDE, do Banco Mundial e
 * da ONU, estão em ResearchHub/indicators/convergence.md.
 *
 * Cada valor foi confirmado contra a Comissão Europeia, SWD(2026) 222, por
 * caminho independente da API do Eurostat. Ver a nota de cada afirmação.
 */

import { parsePtNumber } from '../lib/ledger.mjs';

export const FIGURAS = [
  // ——— Os quatro limiares ultrapassados ———
  {
    claim: 'divida-publica-2025',
    nome: { pt: 'Dívida pública', en: 'Government debt' },
    medida: {
      pt: ['Percentagem do PIB · ', { ref: '2025' }],
      en: ['Percentage of GDP · ', { ref: '2025' }],
    },
    limiar: { nl: '60' },
    frase: {
      pt: [
        'Dívida bruta das administrações públicas, no conceito do Procedimento dos Défices Excessivos. Está acima do limiar do painel europeu, e a descer.',
      ],
      en: [
        'General government gross debt, on the Excessive Deficit Procedure concept. It is above the European scoreboard threshold, and falling.',
      ],
    },
  },
  {
    claim: 'posicao-de-investimento-internacional-2025',
    nome: { pt: 'Posição de investimento internacional', en: 'Net international investment position' },
    medida: {
      pt: ['Percentagem do PIB · ', { ref: '2025' }],
      en: ['Percentage of GDP · ', { ref: '2025' }],
    },
    limiar: { nl: '35', sinal: '−' },
    /* A frase dizia o contrário do valor publicado, e dizia duas coisas que a
       página não pode mostrar.

       «O que o país deve ao exterior menos o que tem a haver dele» é passivo
       menos activo, que daria +50,2; a posição de investimento internacional é
       activo menos passivo, e a linha publica −50,2. A frase passa a ser uma
       definição, com o sinal do lado certo.

       «É a medida com a maior distância ao limiar» era falso no mesmo ecrã: a
       dívida pública está 29,7 pontos além dos 60 do seu limiar e esta está
       15,2 além dos −35. «A que mais tem melhorado» é uma tendência, e este
       sítio não publica série nenhuma. As duas saem. */
    frase: {
      pt: [
        'O que o país tem a haver do exterior menos o que lhe deve: negativo quando deve mais do que tem a haver.',
      ],
      en: [
        'What the country is owed from abroad minus what it owes abroad: negative when it owes more than it is owed.',
      ],
    },
  },
  {
    claim: 'custo-unitario-do-trabalho-2025',
    nome: { pt: 'Custo unitário do trabalho', en: 'Unit labour cost' },
    medida: {
      pt: ['Variação em três anos · ', { ref: '2025' }],
      en: ['Three-year change · ', { ref: '2025' }],
    },
    limiar: { nl: '9' },
    frase: {
      pt: [
        'Custo do trabalho por unidade produzida, por hora trabalhada. A definição por hora é de ',
        { ref: '2024' },
        ': antes media-se por pessoa empregada.',
      ],
      en: [
        'Labour cost per unit of output, per hour worked. The per-hour definition dates from ',
        { ref: '2024' },
        '; before that it was measured per person employed.',
      ],
    },
  },
  {
    claim: 'precos-da-habitacao-2025',
    nome: { pt: 'Preços da habitação', en: 'House prices' },
    medida: {
      pt: ['Variação anual · ', { ref: '2025' }],
      en: ['Annual change · ', { ref: '2025' }],
    },
    limiar: { nl: '9' },
    frase: {
      pt: [
        'Índice nominal de preços da habitação. O limiar foi ultrapassado em ',
        { ref: '2024' },
        ' e o excesso quase duplicou no ano seguinte.',
      ],
      en: [
        'Nominal house price index. The threshold was breached in ',
        { ref: '2024' },
        ', and the overshoot nearly doubled the following year.',
      ],
    },
  },

  // ——— O mesmo quadro regista também onde o país está à frente ———
  {
    claim: 'taxa-de-emprego-2025',
    nome: { pt: 'Taxa de emprego', en: 'Employment rate' },
    medida: {
      pt: ['Percentagem da população dos ', { nl: '20', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '64', motivo: 'escala-de-instrumento' }, ' anos · ', { ref: '2025' }],
      en: ['Percentage of the population aged ', { nl: '20', motivo: 'escala-de-instrumento' }, ' to ', { nl: '64', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2025' }],
    },
    frase: {
      pt: [
        'Indicador principal do Painel Social Europeu. Está acima da média da União, que é uma posição relativa, não um limiar: muda quando os outros mudam.',
      ],
      en: [
        'A headline indicator of the European Social Scoreboard. It sits above the Union average, a relative position, not a threshold: it moves when other countries move.',
      ],
    },
  },
  {
    claim: 'criancas-em-creche-2025',
    nome: { pt: 'Crianças em creche', en: 'Children in formal childcare' },
    medida: {
      pt: ['Percentagem das crianças com menos de ', { nl: '3', motivo: 'escala-de-instrumento' }, ' anos · ', { ref: '2025' }],
      en: ['Percentage of children under ', { nl: '3', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2025' }],
    },
    frase: {
      pt: ['Crianças com menos de três anos em cuidados formais. É das medidas em que Portugal mais se destaca no painel social.'],
      en: ['Children under three in formal childcare. It is one of the measures where Portugal stands out most on the social scoreboard.'],
    },
  },
  {
    claim: 'abandono-escolar-precoce-2025',
    nome: { pt: 'Abandono escolar precoce', en: 'Early school leaving' },
    medida: {
      pt: ['Percentagem dos ', { nl: '18', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '24', motivo: 'escala-de-instrumento' }, ' anos · ', { ref: '2025' }],
      en: ['Percentage of those aged ', { nl: '18', motivo: 'escala-de-instrumento' }, ' to ', { nl: '24', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2025' }],
    },
    frase: {
      pt: ['Jovens que deixaram a escola com o secundário incompleto e não estão em formação. Era mais de um terço no início do século.'],
      en: ['Young people who left school without completing secondary education and are not in training. It was over a third at the turn of the century.'],
    },
  },

  // ——— O cartão que não se lê sozinho ———
  {
    claim: 'sobrecarga-do-custo-da-habitacao-2025',
    nome: { pt: 'Sobrecarga do custo da habitação', en: 'Housing cost overburden' },
    medida: {
      pt: ['Percentagem da população · ', { ref: '2025' }],
      en: ['Percentage of the population · ', { ref: '2025' }],
    },
    frase: {
      pt: [
        'Proporção que gasta mais de ',
        { nl: '40', motivo: 'escala-de-instrumento' },
        '% do rendimento disponível em habitação. Está abaixo da média europeia, e a própria Comissão adverte que só se lê ao lado do regime de propriedade. Onde a taxa de proprietários é alta, esta medida não vê quem não conseguiu comprar.',
      ],
      en: [
        'The share spending more than ',
        { nl: '40', motivo: 'escala-de-instrumento' },
        '% of disposable income on housing. It is below the European average, and the Commission itself warns it must be read alongside the tenure structure. Where owner-occupation is high, this measure does not see those who never bought.',
      ],
    },
  },
];

/**
 * A palavra que compara o valor da linha com o limiar do quadro.
 *
 * PROSA DA CASA, GERADA DE DOIS NÚMEROS QUE JÁ EXISTEM. Não devolve nenhum
 * algarismo: devolve `'acima'`, `'abaixo'` ou `'noLimiar'`, e é o gabarito que
 * escolhe a palavra da edição. Uma distância seria um número novo, sem linha e
 * sem selo, e a §11 da identidade recusa-a: o desenho de distância vive no
 * instrumento, onde há uma escala partilhada.
 *
 * CONSCIENTE DO SINAL. O limiar da posição de investimento é −35 e o valor é
 * −50,2: a comparação é entre números com sinal, e a resposta é «abaixo». Uma
 * comparação sobre o módulo diria «acima» e estaria errada.
 *
 * Devolve `null` quando um dos dois lados não é um número simples. Um `null`
 * não se rende: a célula fica sem a palavra, e não com uma palavra inventada.
 */
export function comparacaoComOLimiar(claim, limiar) {
  if (!limiar) return null;
  const valor = parsePtNumber(claim?.value);
  const alvo = parsePtNumber(`${limiar.sinal ?? ''}${limiar.nl}`);
  if (valor === null || alvo === null) return null;
  if (valor > alvo) return 'acima';
  if (valor < alvo) return 'abaixo';
  return 'noLimiar';
}
