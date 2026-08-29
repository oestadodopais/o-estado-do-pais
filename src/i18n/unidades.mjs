/**
 * ---------------------------------------------------------------------------
 * AS UNIDADES DAS LINHAS DO LIVRO-RAZÃO, NA LÍNGUA DE CADA EDIÇÃO (I92)
 * ---------------------------------------------------------------------------
 *
 * A unidade de uma linha é um RÓTULO, e não uma citação. O título de um
 * documento é o nome que a fonte lhe deu e não se traduz (I91); a unidade é a
 * palavra com que a casa diz em que é que o número está contado, e uma edição
 * inglesa que escreve «620 pessoas» ao lado de «620 people» na mesma página diz
 * a mesma coisa de duas maneiras. Foi o que a leitura do Codex de 29.08.2026
 * apanhou (I92): as medidas dos concelhos já tinham unidade nas duas línguas,
 * escrita na definição da medida (`src/data/concelhos.mjs`), e as linhas do
 * livro-razão não tinham nenhuma.
 *
 * ---------------------------------------------------------------------------
 * O QUE ENTRA AQUI, E O QUE NÃO ENTRA
 * ---------------------------------------------------------------------------
 * **Toda a entrada é um facto de dicionário, ou o inglês que a própria casa já
 * escreve para a mesma coisa.** Não se inventa uma tradução para caber na
 * tabela: o que não tiver entrada rende-se em português, com `lang="pt-PT"`, e
 * `scripts/check-lingua.mjs` conta-o e imprime a lista. Uma unidade em
 * português numa página inglesa é honesta; uma unidade traduzida à sorte não é.
 *
 * Três origens sustentam as entradas, e cada uma está nomeada na linha:
 *
 *   1. **a casa** — `src/data/concelhos.mjs` já traduz seis destas unidades na
 *      definição da medida (Pessoas → People, Euros → Euros, Dias → Days,
 *      Empresas → Enterprises, Percentagem → Percentage), e `strings.mjs`
 *      traduz «Lugares» por «Seats» e «Pelouros» por «Portfolios». Onde a casa
 *      já tem uma palavra inglesa para a coisa, é essa: duas palavras inglesas
 *      para a mesma unidade na mesma página seria o defeito que a I92 abriu,
 *      escrito ao contrário;
 *   2. **a fonte** — o excerto de cada linha traz muitas vezes o inglês do
 *      próprio organismo («Percentage of gross domestic product (GDP)»,
 *      «Chain linked volumes (2015), euro per capita», «Score», «Ratio»). Onde
 *      traz, é dele que a entrada sai, e o comentário diz de que linha;
 *   3. **o dicionário** — «dias» é «days» e «votos» é «votes», e não é preciso
 *      mais nada.
 *
 * ---------------------------------------------------------------------------
 * A CAIXA É A DO LIVRO-RAZÃO
 * ---------------------------------------------------------------------------
 * A chave é a cadeia EXACTA do campo `unit`, e o valor rende-se com a mesma
 * caixa: o livro-razão escreve «euros» e «pessoas» em minúsculas porque a
 * unidade aparece a meio de uma lista de campos, e não à cabeça de uma linha
 * como nas medidas dos concelhos. Traduzir e capitalizar de uma vez seriam duas
 * mudanças numa, e a segunda não foi pedida.
 */

/**
 * O dicionário: a cadeia exacta do livro-razão → o inglês.
 *
 * A ordem é a da contagem no livro-razão, das mais frequentes para as mais
 * raras, para que quem lê veja primeiro o que mais se rende.
 */
export const UNIDADES = {
  /* 645 linhas. A casa: `concelhos.mjs`, medida «divida», Euros → Euros. */
  euros: 'euros',
  /* 620 linhas. A casa: `concelhos.mjs`, medidas «populacao» e
     «desempregoRegistado», Pessoas → People. */
  pessoas: 'people',
  /* 311 linhas. O índice de dívida dos 308 e o seu limite. A casa:
     `concelhos.mjs`, `tectoTexto`, «teto legal = » → «legal cap = ». */
  '% (limite legal = 150)': '% (legal cap = 150)',
  /* 310 linhas. A casa: `concelhos.mjs`, medida «pmp», Dias → Days. */
  dias: 'days',
  /* 309 linhas. O poder de compra concelhio do INE, com Portugal na base 100.
     Dicionário: «índice» é «index»; o parêntesis é um nome próprio e um
     algarismo, e não se traduz. */
  'índice (Portugal = 100)': 'index (Portugal = 100)',
  /* 308 linhas. A casa: `concelhos.mjs`, medida «empresas», Empresas →
     Enterprises. */
  empresas: 'enterprises',
  /* 12 linhas. A distância de cada região à média da UE-27. Dicionário:
     «pontos de índice» é «index points». São linhas calculadas, sem excerto: não
     há inglês da fonte. */
  'pontos de índice': 'index points',
  /* 12 linhas. O símbolo não muda de língua. */
  '%': '%',
  /* 11 linhas. O PIB per capita regional do Eurostat. A casa escreve «EU-27»
     na edição inglesa («with the EU-27 average», página das regiões). */
  'índice (UE-27 = 100)': 'index (EU-27 = 100)',
  /* 10 linhas. Os lugares de uma câmara municipal. A casa:
     `strings.mjs`, `tempoLugares`, Lugares → Seats. */
  lugares: 'seats',
  /* 7 linhas. A casa: `strings.mjs`, `tempoPelouros`, Pelouros → Portfolios, e
     a descrição inglesa do estudo dos pelouros diz «each portfolio». */
  pelouros: 'portfolios',
  /* 6 linhas. A rota inglesa do sítio é `/en/municipalities`. */
  municípios: 'municipalities',
  /* 6 linhas. A fonte: «Percentage of gross domestic product (GDP)», no excerto
     de `despesa-em-id-2024` e das outras cinco. */
  '% do PIB': '% of GDP',
  /* 3 linhas. Dicionário: «população» é «population». A fonte escreve
     «Percentage of total population» nas três, e a entrada NÃO segue a fonte
     aqui: a cadeia do livro-razão não diz «total», e o rótulo diz o que a linha
     guarda. Quem quiser «total» muda a linha, não a tradução dela. */
  '% da população': '% of the population',
  /* 3 linhas. A fonte: «Percentage of population in the labour force», no
     excerto de `taxa-de-desemprego-2025` e das outras duas. */
  '% da população ativa': '% of the labour force',
  /* 2 linhas (`evora-contas-2024-votos-favor` e `-contra`). Dicionário: «votos»
     é «votes». O excerto é a acta em português. */
  votos: 'votes',
  /* 2 linhas. A fonte: «Percentage change (t/t-3)», no excerto de
     `custo-unitario-do-trabalho-2025`. */
  'variação em três anos, %': 'three-year change, %',
  /* 2 linhas. A rota inglesa do sítio é `/en/studies`. */
  estudos: 'studies',
  /* 2 linhas. A casa: `leituras.mjs` escreve, para a mesma medida, «gross value
     added by enterprises in the municipality». */
  '% do VAB empresarial': '% of gross value added by enterprises',
  /* 2 linhas. A fonte: «Percentage of stocks (closing balance sheet)», no
     excerto de `fluxo-de-credito-as-empresas-2025`. */
  '% do stock no final do período anterior': '% of the stock at the end of the previous period',
  /* 2 linhas (`evora-execucao-da-receita-2021` e `-2025`). Dicionário:
     «orçamento» é «budget». O excerto das duas é o quadro da prestação de
     contas em português, e não traz inglês nenhum de onde tirar a palavra. */
  '% do orçamento': '% of the budget',
  /* 2 linhas (`evora-prr-execucao-2026` e `evora-prr-vencido-quota-2026`).
     Dicionário: «valor aprovado» é «approved amount». As duas são linhas
     calculadas, sem documento e sem excerto: não há inglês do organismo. */
  '% do valor aprovado': '% of the approved amount',
  /* 1 linha. A fonte: «Percentage point change (t-(t-3))», no excerto de
     `taxa-de-actividade-2025`. */
  'variação em três anos, pontos percentuais': 'three-year change, percentage points',
  /* 1 linha. A fonte: «Annual average rate of change», no excerto de
     `precos-da-habitacao-2025`. */
  'variação anual média, %': 'average annual change, %',
  /* 1 linha. A fonte: «Ratio», no excerto de `racio-s80-s20-2025`. */
  rácio: 'ratio',
  /* 1 linha. A fonte: «Score», no excerto de
     `indice-de-percepcao-da-corrupcao-2025`. */
  pontuação: 'score',
  /* 1 linha. A fonte: «Square metres per 1000 inhabitants», no excerto de
     `licencas-de-construcao-2025`. O símbolo do metro quadrado não muda. */
  'm² por 1000 habitantes': 'm² per 1000 inhabitants',
  /* 1 linha. A fonte: «Chain linked volumes (2015), euro per capita», no
     excerto de `pib-real-per-capita-2025`, e são as palavras dela que a entrada
     usa. Escrevia «euros per inhabitant», que é a tradução literal do português
     e não o que o Eurostat imprime: onde a fonte tem inglês próprio, é o dela. */
  'euros por habitante · volumes encadeados (2015)':
    'euro per capita · chain linked volumes (2015)',
  /* 1 linha (`edicoes-publicadas`). A casa: `strings.mjs`, `stubEdicoes`,
     escreve «Editions» na edição inglesa para a mesma coisa. */
  edições: 'editions',
  /* 1 linha (`correcoes-publicadas`). A casa: a rota inglesa do registo é
     `/en/corrections` (`src/lib/routes.mjs`). */
  correções: 'corrections',
  /* 1 linha (`ciclo-substituicao-condutas`). Dicionário: «anos» é «years». A
     linha tem documento e excerto «[a verificar]», e por isso não há inglês da
     fonte; a palavra, essa, não depende de fonte nenhuma. */
  anos: 'years',
  /* 1 linha. A fonte: «Percentage of individuals», no excerto de
     `competencias-digitais-2025`. */
  '% dos indivíduos': '% of individuals',
  /* 1 linha. A fonte: «Percentage of OECD and non-OECD EU countries total -
     3-year change», no excerto de `desempenho-das-exportacoes-2025`. A entrada
     deixava cair «countries», e o total é de PAÍSES: sem a palavra, «the OECD
     and non-OECD EU total» podia ler-se como um total de outra coisa. */
  '% do total OCDE e UE não-OCDE, variação em três anos':
    '% of the OECD and non-OECD EU countries total, three-year change',
  /* 1 linha. A fonte: «Percentage of GDP - three-year average», no excerto de
     `saldo-da-balanca-corrente-2025`. */
  '% do PIB (média de três anos)': '% of GDP (three-year average)',
};

/**
 * AS UNIDADES QUE FICAM EM PORTUGUÊS, COM A RAZÃO ESCRITA.
 *
 * Uma unidade sem entrada no dicionário rende-se tal como o livro-razão a
 * guarda, com `lang="pt-PT"`, nas duas edições. **Estar nesta lista não é uma
 * dispensa**: é a declaração de que alguém olhou para a unidade e não encontrou
 * um facto de dicionário para ela. `scripts/check-lingua.mjs` fecha a
 * construção quando uma unidade do livro-razão não está nem no dicionário nem
 * aqui, e é assim que uma unidade nova chega a quem decide em vez de se
 * traduzir sozinha.
 *
 * «factor» é a palavra do relatório que a linha cita, com a grafia dele, e a
 * palavra inglesa seria a mesma cadeia com outro sentido de origem: fica como
 * está para que o rótulo não pareça traduzido quando não foi.
 */
export const UNIDADES_EM_PORTUGUES = {
  /* 2 linhas (`avisos-pt2030-abertos`, `avisos-pt2030-pessoas-singulares`). Um
     «aviso» do Portugal 2030 é um acto administrativo com nome próprio, e as
     duas linhas têm fonte e documento por confirmar: não há inglês do organismo
     de onde tirar a palavra, e escolher entre «call» e «notice» seria a casa a
     decidir o que a fonte quis dizer. */
  avisos: 'sem inglês do organismo: as duas linhas têm fonte e documento «[a verificar]»',
  /* 1 linha (`factor-sustentabilidade-2026`). O factor de sustentabilidade é o
     nome que o relatório dá ao número, e a linha cita-o em português. */
  factor: 'é o nome que o relatório citado dá ao número, e não uma unidade de contagem',
};

/**
 * A UNIDADE DE UMA LINHA, NA LÍNGUA DE UMA EDIÇÃO.
 *
 * Devolve `{ texto, lingua }`:
 *
 *   · `texto` — o que a página escreve;
 *   · `lingua` — o valor do atributo `lang`, ou `null` quando não há nada a
 *     marcar. Em português é sempre `pt-PT`, como era antes desta tabela
 *     (DECISIONS §1.24: a unidade era prosa da casa numa só língua); em inglês
 *     é `pt-PT` quando a unidade fica em português e `null` quando o dicionário
 *     a traduziu, porque um `lang` que repete o da página é ruído para quem
 *     ouve.
 *
 * O MARCADOR NÃO PASSA POR AQUI. Uma linha cujo campo `unit` seja o marcador
 * `[a verificar]` não tem unidade nenhuma para traduzir, e o marcador tem a sua
 * própria forma nas duas edições (`CampoDaLinha`). O marcador não é uma unidade
 * do livro-razão e não entra nem no dicionário nem na lista das que ficam.
 */
export function unidadeDaLinha(unit, lang = 'pt') {
  const cru = unit === null || unit === undefined ? '' : String(unit);
  if (lang !== 'en') return { texto: cru, lingua: 'pt-PT' };
  const traduzida = Object.prototype.hasOwnProperty.call(UNIDADES, cru) ? UNIDADES[cru] : null;
  if (traduzida === null) return { texto: cru, lingua: 'pt-PT' };
  return { texto: traduzida, lingua: null };
}
