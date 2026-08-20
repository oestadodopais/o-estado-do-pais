/**
 * As regiões da régua da convergência.
 *
 * Os dados são partilhados pelas duas línguas; só os nomes e as frases mudam.
 * As frases são listas de pedaços, não cadeias com números lá dentro:
 *
 *   'texto'            — palavras
 *   { claim: 'id' }    — um número, citado do livro-razão
 *   { ref: '2000' }    — um ano de referência (é a data da leitura, não a leitura)
 *
 * Assim uma frase nunca pode ganhar um número que não passe pelo livro-razão.
 *
 * ---------------------------------------------------------------------------
 * O `slug`: O NOME DA REGIÃO NO ENDEREÇO (v3, etapa 2a)
 * ---------------------------------------------------------------------------
 * A primeira página da v3 codifica o âmbito no URL, e o URL é o que se partilha
 * (Emenda 7). `?ambito=regiao:<slug>` resolve-se contra ESTA lista, que é a
 * lista fechada: um valor que não esteja aqui cai no âmbito por defeito, em
 * silêncio, e o endereço é reescrito para a forma normalizada.
 *
 * O `slug` é a máquina e o `id` é o desenho: o `id` («gl», «ps») é curto porque
 * vive dentro de um SVG e de uma ilha de dados; o `slug` é legível porque vive
 * num endereço que alguém copia para uma mensagem. São iguais nas duas edições:
 * o que se traduz é o rótulo, nunca a chave (plano §13).
 *
 * ---------------------------------------------------------------------------
 * O `referencia`: PORTUGAL NÃO É UMA REGIÃO (etapa 2i, achado 5 da leitura cruzada)
 * ---------------------------------------------------------------------------
 * Esta lista tem seis leituras porque a régua da convergência as desenha às
 * seis: as cinco regiões e o país contra o qual elas se leem. Mas o esquema
 * fechado do endereço (plano §13) tem CINCO regiões — `grande-lisboa`,
 * `peninsula-de-setubal`, `algarve`, `madeira`, `alentejo` — e Portugal não é
 * uma delas. O brief da etapa 2 mandou seis fichas, a construção deu-lhes seis
 * estados, e `?ambito=regiao:portugal` rendia uma cabeça que dizia «Portugal ·
 * região», que é falso.
 *
 * `referencia: true` é um campo DECLARADO, como o `lado` dos limiares: diz que
 * aquela leitura é a marca de referência da régua e não um âmbito. Quem monta a
 * lista fechada dos âmbitos lê-o em `src/lib/inicio.mjs`; quem desenha a régua
 * (a banda e o Instrumento n.º 1) continua a desenhar as seis, porque as seis
 * estão publicadas. Uma lista escrita à mão noutro sítio divergiria desta à
 * primeira alteração.
 */

export const REGIOES = [
  {
    id: 'pt',
    slug: 'portugal',
    nome: { pt: 'Portugal', en: 'Portugal' },
    valor: 'pib-pc-portugal-2024',
    distancia: 'distancia-portugal-ue27-2024',
    sinal: '−',
    predefinida: true,
    referencia: true,
    frase: {
      pt: ['Portugal está ', { claim: 'distancia-portugal-ue27-2024' }, ' pontos abaixo da média da UE-27.'],
      en: ['Portugal is ', { claim: 'distancia-portugal-ue27-2024' }, ' points below the EU-27 average.'],
    },
  },
  {
    id: 'gl',
    slug: 'grande-lisboa',
    nome: { pt: 'Grande Lisboa', en: 'Greater Lisbon' },
    valor: 'pib-pc-grande-lisboa-2024',
    distancia: 'distancia-grande-lisboa-ue27-2024',
    sinal: '+',
    frase: {
      pt: ['A Grande Lisboa está ', { claim: 'distancia-grande-lisboa-ue27-2024' }, ' pontos acima da média da UE-27.'],
      en: ['Greater Lisbon is ', { claim: 'distancia-grande-lisboa-ue27-2024' }, ' points above the EU-27 average.'],
    },
  },
  {
    id: 'ps',
    slug: 'peninsula-de-setubal',
    nome: { pt: 'Península de Setúbal', en: 'Setúbal Peninsula' },
    valor: 'pib-pc-peninsula-de-setubal-2024',
    distancia: 'distancia-peninsula-de-setubal-ue27-2024',
    sinal: '−',
    frase: {
      pt: [
        'A Península de Setúbal está ',
        { claim: 'distancia-peninsula-de-setubal-ue27-2024' },
        ' pontos abaixo da média da UE-27, e a ',
        { claim: 'distancia-setubal-grande-lisboa-2024' },
        ' pontos da Grande Lisboa, sua vizinha.',
      ],
      en: [
        'The Setúbal Peninsula is ',
        { claim: 'distancia-peninsula-de-setubal-ue27-2024' },
        ' points below the EU-27 average, and ',
        { claim: 'distancia-setubal-grande-lisboa-2024' },
        ' points from Greater Lisbon, its neighbour.',
      ],
    },
  },
  {
    id: 'alg',
    slug: 'algarve',
    nome: { pt: 'Algarve', en: 'Algarve' },
    valor: 'pib-pc-algarve-2024',
    distancia: 'distancia-algarve-ue27-2024',
    sinal: '−',
    frase: {
      pt: ['O Algarve está ', { claim: 'distancia-algarve-ue27-2024' }, ' pontos abaixo da média da UE-27.'],
      en: ['The Algarve is ', { claim: 'distancia-algarve-ue27-2024' }, ' points below the EU-27 average.'],
    },
  },
  {
    id: 'mad',
    slug: 'madeira',
    nome: { pt: 'Madeira', en: 'Madeira' },
    valor: 'pib-pc-madeira-2024',
    distancia: 'distancia-madeira-ue27-2024',
    sinal: '−',
    frase: {
      pt: ['A Madeira está ', { claim: 'distancia-madeira-ue27-2024' }, ' pontos abaixo da média da UE-27.'],
      en: ['Madeira is ', { claim: 'distancia-madeira-ue27-2024' }, ' points below the EU-27 average.'],
    },
  },
  {
    id: 'ale',
    slug: 'alentejo',
    nome: { pt: 'Alentejo', en: 'Alentejo' },
    valor: 'pib-pc-alentejo-2024',
    valorHistorico: 'pib-pc-alentejo-2000',
    anoHistorico: '2000',
    distancia: 'distancia-alentejo-ue27-2024',
    distanciaHistorica: 'distancia-alentejo-ue27-2000',
    sinal: '−',
    frase: {
      pt: [
        'O Alentejo está ',
        { claim: 'distancia-alentejo-ue27-2024' },
        ' pontos abaixo da média da UE-27. Em ',
        { ref: '2000' },
        ' estava a ',
        { claim: 'distancia-alentejo-ue27-2000' },
        ': a distância aumentou.',
      ],
      en: [
        'The Alentejo is ',
        { claim: 'distancia-alentejo-ue27-2024' },
        ' points below the EU-27 average. In ',
        { ref: '2000' },
        ' it was ',
        { claim: 'distancia-alentejo-ue27-2000' },
        ' points away: the gap has widened.',
      ],
    },
  },
];

/** A escala da régua. É a régua, não uma medição: por isso não está no livro-razão. */
export const ESCALA = {
  min: 50,
  max: 135,
  passo: 5,
  rotuloAte: 130,
  datum: 100,
};

/** Geometria do SVG da régua, no mesmo referencial do estudo de identidade. */
export const GEOMETRIA = {
  largura: 980,
  altura: 300,
  esquerda: 64,
  direita: 916,
  eixoY: 216,
  patamares: [178, 148, 118, 88],
};
