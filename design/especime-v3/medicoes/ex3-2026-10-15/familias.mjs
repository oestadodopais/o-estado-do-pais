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

// Compromissos e data da cimeira, cada frase apoiada na sua linha literal.
for (const [id,pt,en,frasePt,fraseEn,literal] of [
 ['nato-compromisso-gales-2014','Compromisso da NATO na cimeira de Gales','NATO commitment at the Wales Summit','É a percentagem do PIB nacional que os aliados acordaram destinar à defesa na cimeira de Gales.','It is the share of national GDP that Allies agreed to commit to defence spending at the Wales Summit.','Previously, at the 2014 Wales Summit'],
 ['nato-compromisso-haia-2035','Compromisso anual da NATO na cimeira de Haia','Annual NATO commitment at the Hague Summit','É a percentagem do PIB que os aliados se comprometeram a investir anualmente em defesa, até ao prazo indicado, na cimeira de Haia.','It is the share of GDP that Allies committed to investing annually on defence by the stated deadline at the Hague Summit.','annually on defence by 2035'],
 ['nato-compromisso-haia-essencial-2035','Compromisso da NATO para requisitos essenciais de defesa','NATO commitment for core defence requirements','É a percentagem mínima do PIB acordada para os requisitos essenciais de defesa e as metas de capacidades da NATO, pela definição de despesa em defesa da NATO.','It is the minimum share of GDP agreed for core defence requirements and NATO Capability Targets, under NATO’s definition of defence expenditure.','Core defence requirements: Firstly, Allies agreed to allocate at least 3.5%'],
 ['nato-cimeira-haia-2025','Cimeira de Haia em que a NATO assumiu o compromisso','Hague Summit at which NATO made the commitment','É a cimeira de Haia em que os aliados assumiram o compromisso anual de investimento em defesa; o período indica o ano da cimeira.','It is the Hague Summit at which Allies made the annual defence investment commitment; the reference period gives the year of the summit.','At the 2025 NATO Summit in The Hague'],
]) FAMILIAS_EX3.push({chaves:[id],nome:{pt,en},partes:[{pt:frasePt,en:fraseEn,classe:'diz',apoios:[linha('excerpt',literal)]}]});
