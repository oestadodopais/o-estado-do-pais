/**
 * Os números da primeira página.
 *
 * Cada cartão é uma afirmação do livro-razão, mais as palavras que a rodeiam
 * nas duas línguas. As palavras não trazem números: onde é preciso um número,
 * há um { claim: … }; onde é preciso uma data, há um { ref: … }.
 *
 * As frases dizem o que a medida é, não o que ela significa. A interpretação
 * é trabalho do director, e vai nos estudos.
 */

export const FIGURAS = [
  {
    claim: 'pib-pc-portugal-2024',
    nome: { pt: 'Portugal na UE-27', en: 'Portugal in the EU-27' },
    medida: {
      pt: ['PIB per capita · PPS · UE-27 = ', { nl: '100', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2024' }],
      en: ['GDP per capita · PPS · EU-27 = ', { nl: '100', motivo: 'escala-de-instrumento' }, ' · ', { ref: '2024' }],
    },
    frase: {
      pt: [
        'Portugal está ',
        { claim: 'distancia-portugal-ue27-2024' },
        ' pontos abaixo da média da UE-27. O valor de ',
        { ref: '2024' },
        ' é provisório.',
      ],
      en: [
        'Portugal is ',
        { claim: 'distancia-portugal-ue27-2024' },
        ' points below the EU-27 average. The ',
        { ref: '2024' },
        ' value is provisional.',
      ],
    },
  },
  {
    claim: 'agua-nao-faturada-portugal-2024',
    nome: { pt: 'Água não faturada', en: 'Non-revenue water' },
    medida: {
      pt: ['Percentagem · dados de ', { ref: '2024' }],
      en: ['Percentage · data for ', { ref: '2024' }],
    },
    frase: {
      pt: ['Água não faturada nos sistemas de abastecimento em Portugal, em ', { ref: '2024' }, '.'],
      en: ['Non-revenue water in Portugal’s public supply systems, in ', { ref: '2024' }, '.'],
    },
  },
  {
    claim: 'saldo-natural-portugal-2025',
    nome: { pt: 'Saldo natural', en: 'Natural change' },
    medida: {
      pt: ['Pessoas · ', { ref: '2025' }],
      en: ['People · ', { ref: '2025' }],
    },
    frase: {
      pt: ['Diferença entre nascimentos e óbitos em Portugal, em ', { ref: '2025' }, '.'],
      en: ['The difference between births and deaths in Portugal, in ', { ref: '2025' }, '.'],
    },
  },
  {
    claim: 'ciclo-substituicao-condutas',
    nome: { pt: 'Ciclo de substituição de condutas', en: 'Pipe replacement cycle' },
    medida: {
      pt: ['Anos'],
      en: ['Years'],
    },
    frase: {
      pt: ['O ciclo de substituição de condutas publicado no estudo. A base de cálculo está por confirmar.'],
      en: ['The pipe replacement cycle as published in the study. The basis of the calculation is still to be confirmed.'],
    },
  },
  {
    claim: 'avisos-pt2030-pessoas-singulares',
    nome: { pt: 'Avisos abertos a pessoas singulares', en: 'Calls open to individuals' },
    medida: {
      pt: ['Avisos do PT2030 · ', { ref: '8 de Agosto de 2026' }],
      en: ['PT2030 calls · ', { ref: '8 August 2026' }],
    },
    frase: {
      pt: [
        'De ',
        { claim: 'avisos-pt2030-abertos' },
        ' avisos abertos nessa data, este é o número dos que aceitam candidaturas de pessoas singulares.',
      ],
      en: [
        'Of the ',
        { claim: 'avisos-pt2030-abertos' },
        ' calls open on that date, this is how many accept applications from individuals.',
      ],
    },
  },
];
