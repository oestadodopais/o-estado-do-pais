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
import { ORIGENS_DAS_DEFINICOES } from './figuras.mjs';

/**
 * ---------------------------------------------------------------------------
 * AS ORIGENS DAS DEFINIÇÕES DA PÁGINA EUROPEIA (F1.10, segunda passagem,
 * 09.09.2026)
 * ---------------------------------------------------------------------------
 * A leitura a frio de 09.09.2026 abriu o Blocking 1 contra a primeira passagem:
 * as 21 definições das medidas e as duas dos painéis eram apresentadas como
 * citadas da Comissão e do Eurostat, e a página não rendia uma única prova
 * disso. A decisão do lugar de direção manda a página render, ao pé de cada
 * definição, o publicador, o documento como porta para o endereço, a data de
 * leitura e o excerto literal.
 *
 * TRÊS DESSES QUATRO CAMPOS SÃO TRANSCRIÇÃO, e passam por aqui, que é o registo
 * que o portão de HTML confere carácter a carácter. O nome de um organismo, o
 * título de um documento e um excerto da fonte não são prosa da casa.
 *
 * A TABELA NÃO É UMA SEGUNDA CÓPIA. As cadeias são as de
 * `ORIGENS_DAS_DEFINICOES`, em `src/data/figuras.mjs`, lidas daqui: escrever o
 * excerto outra vez neste ficheiro era criar duas versões da mesma citação para
 * divergirem à primeira correção. O que este bloco acrescenta é a CHAVE que o
 * portão conhece, uma por campo e por origem.
 *
 * `lang`: a página da Comissão e as do Eurostat estão em inglês; a do Banco de
 * Portugal publica as duas, e a declaração traz `excertoEn` para a edição
 * inglesa. O campo é documental (nenhum código o lê), e diz a verdade.
 */
/** @type {Record<string, { lang: string|null, origem: string, text: string }>} */
const ORIGENS_TRANSCRITAS = Object.fromEntries(
  Object.entries(ORIGENS_DAS_DEFINICOES).flatMap(([chave, origem]) => {
    const o = /** @type {{ publicador: string, documento: string, excerto: string, excertoEn?: string }} */ (
      /** @type {unknown} */ (origem)
    );
    const onde = `\`ORIGENS_DAS_DEFINICOES['${chave}']\`, em src/data/figuras.mjs.`;
    const lingua = chave === 'bdp-pii' ? 'pt' : 'en';
    return [
      [`origem-${chave}-publicador`, { lang: null, origem: onde, text: o.publicador }],
      [`origem-${chave}-documento`, { lang: lingua, origem: onde, text: o.documento }],
      [`origem-${chave}-excerto`, { lang: lingua, origem: onde, text: o.excerto }],
      ...(o.excertoEn
        ? [[`origem-${chave}-excerto-en`, { lang: 'en', origem: onde, text: o.excertoEn }]]
        : []),
    ];
  }),
);

export const VERBATIM = {
  /**
   * O IDENTIFICADOR DO DOCUMENTO DA COMISSÃO, TRANSCRITO (F1.1, 03.09.2026).
   *
   * As duas frases de contexto dos painéis da primeira página dizem que os
   * valores estão confirmados contra a Comissão Europeia, e nomeiam o documento
   * onde essa confirmação foi feita. O identificador traz algarismos e não é uma
   * medição: é a morada de um documento, e a morada transcreve-se.
   *
   * A ORIGEM É O LIVRO-RAZÃO, e são as 21 linhas dos dois quadros da União: o
   * campo `note` de cada uma escreve «Valor confirmado contra a Comissão
   * Europeia, SWD(2026) 222 (Relatório por País 2026 — Portugal): <o valor>».
   * A cadeia registada aqui é o pedaço que a página rende, carácter a carácter,
   * e o portão compara-os.
   *
   * A MESMA CADEIA NAS DUAS EDIÇÕES, e por isso `lang` é `null`: o identificador
   * de um documento não se traduz. É o mesmo princípio pelo qual o marcador
   * `[a verificar]` fica em português nas duas edições — o que se copia de uma
   * fonte fica como a fonte o escreveu.
   */
  /**
   * A DESIGNAÇÃO DO DOCUMENTO, TRANSCRITA (F1.1, segunda passagem, 03.09.2026).
   *
   * A leitura a frio do Codex (Blocking 6) mostrou que a frase dizia menos do que
   * a linha sabe: a nota das 21 linhas não nomeia só a Comissão, nomeia o
   * documento em que a confirmação foi feita, e diz o que ele é. A frase passa a
   * dizê-lo, e o nome do documento é uma transcrição como o identificador dele.
   *
   * A CADEIA É UM PEDAÇO DA NOTA, palavra por palavra, e sem a parte que traz o
   * travessão: a nota escreve «(Relatório por País 2026 — Portugal)», e o que a
   * frase precisa é da designação do relatório, não do país, que já está dito na
   * página inteira. Uma transcrição pode ser um pedaço; o que ela não pode ser é
   * uma paráfrase, e o portão compara carácter a carácter o que a página rende
   * com o que está aqui.
   *
   * SÓ NA EDIÇÃO PORTUGUESA, e `lang` di-lo. A nota do livro-razão é portuguesa,
   * e traduzir a designação seria escrever um título inglês que este bloco não
   * leu em lado nenhum: a edição inglesa diz o que o documento É, em minúsculas
   * («the European Commission's country report»), que é uma descrição e não um
   * título, e leva o mesmo identificador ao lado.
   */
  'relatorio-por-pais-2026': {
    lang: 'pt',
    origem:
      'Campo `note` das 21 linhas dos dois quadros da União em ledger/claims/, ' +
      'o parêntesis que designa o documento: «(Relatório por País 2026 — Portugal)».',
    text: `Relatório por País 2026`,
  },

  'swd-2026-222': {
    lang: null,
    origem:
      'Campo `note` das 21 linhas dos dois quadros da União em ledger/claims/, ' +
      'por exemplo divida-publica-2025.yml e taxa-de-emprego-2025.yml.',
    text: `SWD(2026) 222`,
  },

  /**
   * As frases de abertura de dois documentos alojados.
   *
   * O arquivo rotula estas duas descrições como «frase de abertura do
   * documento» — uma afirmação sobre o documento, que ninguém conferia. A
   * 16.08.2026 a cadeira comparou-as com os ficheiros e as duas eram
   * reformulações (DECISIONS §1.35, item 6, corrigido em §1.40). Passam a ser a
   * frase, e a frase entra por aqui: o portão compara-a, carácter a carácter,
   * com o que a página rende. Um rótulo que diz «isto é a frase do documento»
   * passa a ser conferível em vez de ser uma promessa.
   *
   * Lidas dos próprios ficheiros em `studies-src/`, que são os que o sítio
   * aloja e o `check:documentos` prende ao seu resumo.
   */
  'estudo-pelouros-abertura-pt': {
    lang: 'pt',
    origem:
      'Frase de abertura de studies-src/evora-os-pelouros-quem-os-teve-o-que-fizeram/pt.html.',
    text: `Quem teve cada pelouro da Câmara Municipal de Évora ao longo de cinco mandatos, quanto gastaram as contas do próprio município nas áreas que esses pelouros cobrem, e o que os relatórios dizem que essas áreas fizeram.`,
  },

  /* Relidas dos ficheiros a 2026-08-20, com a republicação do documento: a
     abertura passou a nomear a releitura do registo do plano de recuperação,
     que é de onde vêm os valores do instantâneo de 2026-08-19. Uma transcrição
     não se atualiza de memória; estas foram extraídas do próprio ficheiro
     alojado, que é o que o `check:documentos` prende ao seu resumo. */
  'estudo-prometido-abertura-pt': {
    lang: 'pt',
    origem: 'Frase de abertura de studies-src/evora-prometido-pago-auditado-2026/pt.html.',
    text: `Uma leitura transversal do município de Évora: o registo de projetos do plano de recuperação, o registo de contratos públicos e o catálogo do tribunal de contas do Estado.`,
  },

  'estudo-prometido-abertura-en': {
    lang: 'en',
    origem: 'Opening sentence of studies-src/evora-prometido-pago-auditado-2026/en.html.',
    text: `A cross-cutting reading of the municipality of Évora: the recovery-plan project register, the public-contracts register and the state auditor's catalogue.`,
  },

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

  /* As duas citações do bloco «Esta página» do colofão saíram a 18.08.2026
     (DECISIONS §1.44) com a secção que as rendia. Eram comentário de
     implementação numa página pública, e o portão só exige que uma chave
     renderizada exista aqui: uma entrada que ninguém rende não guarda nada. */

  ...ORIGENS_TRANSCRITAS,
};

/**
 * Normalização de espaços usada pelo portão — a mesma dos dois lados da comparação.
 *
 * @param {unknown} s
 */
export function normalizeWhitespace(s) {
  return String(s).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

/** @param {string} key */
export function verbatim(key) {
  const entry = /** @type {TabelaAberta<typeof VERBATIM>} */ (VERBATIM)[key];
  if (!entry) throw new Error(`verbatim: bloco desconhecido "${key}"`);
  return entry;
}
