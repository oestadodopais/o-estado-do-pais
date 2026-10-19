/** EX3: a medida da NATO, com os preços e o estado que os cabeçalhos declaram. */
const linha = (campo, literal) => ({linha: 'propria', campo, literal});
const origem = {origem: 'nato-definicao-despesa-defesa', campo: 'excertoEn', literal: 'payments made by an Allied national government (excluding regional, local and municipal authorities)'};
export const FAMILIAS_EX3 = ['pib', 'eur'].map(tipo => ({
  chaves: [`nato-defesa-portugal-${tipo}`],
  nome: tipo === 'pib' ? {pt: 'Despesa em defesa de Portugal, em percentagem do PIB, pela NATO', en: 'Portugal’s defence expenditure as a share of GDP, according to NATO'} : {pt: 'Despesa em defesa de Portugal, em milhões de euros, pela NATO', en: 'Portugal’s defence expenditure in million euros, according to NATO'},
  partes: [{
    pt: 'É a estimativa da NATO para a despesa em defesa de Portugal, pelos pagamentos do governo nacional aliado, sem as administrações regionais e locais. '+(tipo === 'pib' ? 'A percentagem usa o PIB real, na tabela a preços constantes.' : 'O montante é em milhões de euros, na tabela a preços correntes.'),
    en: 'It is NATO’s estimate of Portugal’s defence expenditure, covering payments by the Allied national government, excluding regional and local authorities. '+(tipo === 'pib' ? 'The percentage uses real GDP, in the table at constant prices.' : 'The amount is in million euros, in the table at current prices.'),
    classe: 'diz',
    apoios: [origem, linha('excerpt','Portugal'),linha('excerpt','Figures for 2025 and 2026 are estimates.'),linha('excerpt',tipo === 'pib' ? 'Share of real GDP (%)' : 'Current prices'),linha('excerpt',tipo === 'pib' ? 'Based on 2021 prices' : 'Million national currency units')],
  }],
}));

// A linha de 2024 não tem a marca de estimativa da família dos anos seguintes.
const publicado=structuredClone(FAMILIAS_EX3[0]);
publicado.chaves=['nato-defesa-portugal-pib-2024'];
publicado.partes[0].pt=publicado.partes[0].pt.replace('É a estimativa da NATO para','É o valor que a NATO publica para');
publicado.partes[0].en=publicado.partes[0].en.replace('It is NATO’s estimate of','It is the value NATO publishes for');
publicado.partes[0].apoios=publicado.partes[0].apoios.filter(x=>x.literal!=='Figures for 2025 and 2026 are estimates.');
FAMILIAS_EX3.push(publicado);
