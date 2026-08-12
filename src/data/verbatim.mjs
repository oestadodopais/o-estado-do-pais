/**
 * Citações transcritas — texto que viaja com o código, palavra por palavra.
 *
 * Estes blocos vêm do colofão do estudo de identidade aprovado
 * (observatorio-identidade-v2.html, 12.08.2026) e não podem ser reescritos,
 * resumidos nem traduzidos. São a proveniência das 308 coordenadas.
 *
 * O portão de HTML (scripts/gate-html.mjs) trata um bloco marcado com
 * data-verbatim="<chave>" como permitido APENAS se o texto renderizado for
 * exactamente igual ao texto aqui registado (espaços normalizados). Não é um
 * passe livre para números: é uma verificação de transcrição.
 */

export const VERBATIM = {
  'caop-fonte': {
    lang: 'pt',
    origem: 'Colofão do estudo de identidade v2, bloco «Coordenadas · fonte».',
    text: `Carta Administrativa Oficial de Portugal (CAOP) 2025
Publicação: Direção-Geral do Território (DGT)
Distribuição: dados.gov.pt · licença CC-BY
Ficheiros: CAOP_Continente_2025-gpkg.zip · CAOP_RAA_2025-gpkg.zip · CAOP_RAM_2025-gpkg.zip (GeoPackage)
https://geo2.dgterritorio.gov.pt/caop/
https://dados.gov.pt/datasets/carta-administrativa-oficial-de-portugal-caop2025-continente
Acedido a 12 de Agosto de 2026.`,
  },

  'caop-processamento': {
    lang: 'pt',
    origem: 'Colofão do estudo de identidade v2, bloco «Coordenadas · processamento».',
    text: `Contagem verificada nos ficheiros oficiais: 278 municípios no Continente, 19 nos Açores, 11 na Madeira = 308.

Para cada município: centróide ponderado pela área, calculado sobre os polígonos oficiais no sistema de coordenadas nativo de cada ficheiro (ETRS89/PT-TM06 no Continente; PTRA08/UTM 25N, 26N e 28N nos arquipélagos) e convertido para WGS84.

Verificação: a área calculada a partir da geometria reproduz o campo area_ha publicado pela DGT com erro relativo máximo de 0,00023% nos 308 municípios.

Posições projetadas em Web Mercator e normalizadas para o referencial da página. Madeira à mesma escala do Continente; Açores a 0,38× dessa escala. Nenhuma coordenada foi estimada.`,
  },

  'caop-legenda-mapa': {
    lang: 'pt',
    origem: 'Legenda do instrumento n.º 2 do estudo de identidade v2.',
    text: `Posições: Carta Administrativa Oficial de Portugal 2025, Direção-Geral do Território. Centróides ponderados pela área, calculados a partir dos polígonos oficiais. Madeira à mesma escala do Continente; Açores a 0,38× dessa escala, por o arquipélago se estender por cerca de 600 km. Detalhe completo no colofão.`,
  },

  'regra-do-amarelo': {
    lang: 'pt',
    origem: 'Colofão do estudo de identidade v2, bloco «Esta página».',
    text: `O amarelo #E8A80C é reservado a marcas de medição e nunca é usado como texto sobre fundo claro.`,
  },

  'sem-pedidos-de-rede': {
    lang: 'pt',
    origem: 'Colofão do estudo de identidade v2, bloco «Esta página».',
    text: `Não faz pedidos de rede. As 308 posições estão embebidas no ficheiro.`,
  },
};

/** Normalização de espaços usada pelo portão — a mesma dos dois lados da comparação. */
export function normalizeWhitespace(s) {
  return String(s).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

export function verbatim(key) {
  const entry = VERBATIM[key];
  if (!entry) throw new Error(`verbatim: bloco desconhecido "${key}"`);
  return entry;
}
