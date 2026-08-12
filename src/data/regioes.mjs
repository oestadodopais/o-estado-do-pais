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
 */

export const REGIOES = [
  {
    id: 'pt',
    nome: { pt: 'Portugal', en: 'Portugal' },
    valor: 'pib-pc-portugal-2024',
    distancia: 'distancia-portugal-ue27-2024',
    sinal: '−',
    predefinida: true,
    frase: {
      pt: ['Portugal está ', { claim: 'distancia-portugal-ue27-2024' }, ' pontos abaixo da média da UE-27.'],
      en: ['Portugal is ', { claim: 'distancia-portugal-ue27-2024' }, ' points below the EU-27 average.'],
    },
  },
  {
    id: 'gl',
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
    nome: { pt: 'Península de Setúbal', en: 'Setúbal Peninsula' },
    valor: 'pib-pc-peninsula-de-setubal-2024',
    distancia: 'distancia-peninsula-de-setubal-ue27-2024',
    sinal: '−',
    frase: {
      pt: [
        'A Península de Setúbal está ',
        { claim: 'distancia-peninsula-de-setubal-ue27-2024' },
        ' pontos abaixo da média da UE-27 — e a ',
        { claim: 'distancia-setubal-grande-lisboa-2024' },
        ' pontos da Grande Lisboa, sua vizinha.',
      ],
      en: [
        'The Setúbal Peninsula is ',
        { claim: 'distancia-peninsula-de-setubal-ue27-2024' },
        ' points below the EU-27 average — and ',
        { claim: 'distancia-setubal-grande-lisboa-2024' },
        ' points from Greater Lisbon, its neighbour.',
      ],
    },
  },
  {
    id: 'alg',
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
