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

/**
 * ---------------------------------------------------------------------------
 * O `codigo`: A CHAVE DA REGIÃO NA CLASSIFICAÇÃO, LIDA DA FONTE (Emenda 21e)
 * ---------------------------------------------------------------------------
 * Cada região traz o seu código NUTS II, e ao lado dele, em comentário, o nome
 * OFICIAL tal como a classificação o escreve. Nenhum dos dois é escrito de
 * memória: os nove códigos e os nove nomes saem da nota que o motor alojou,
 * `content/03 Regional Economy/Technical Source/NUTS-2024.md`, que por sua vez
 * os lê de três ficheiros guardados com o seu resumo — `nuts_datasets.json`
 * (qual é a versão em vigor: NUTS 2024), `nuts2024_at.csv` (que unidades ela tem
 * e como se chamam) e `nuts_geo_codelist.xml` (o nível de cada código). É a
 * mesma disciplina do `slug`: o que se traduz é o rótulo, nunca a chave.
 *
 * O CÓDIGO NÃO SE RENDE em página nenhuma, e não é para render: é a chave que
 * liga esta entrada à classificação e à linha do livro-razão, e o que o leitor
 * vê é o nome. Está aqui para que a próxima região que entre traga a sua origem
 * consigo, e para que uma trocada se veja ao lado do nome.
 *
 * A REFERÊNCIA NÃO TEM CÓDIGO NUTS II, e é a mesma razão de sempre: `PT` é o
 * país, nível 0, e não é uma região NUTS II. A nota do motor di-lo com estas
 * palavras: «(`pib-pc-portugal-2024` é o país, `PT`, que é nível 0 e não é uma
 * região NUTS II.)»
 *
 * ---------------------------------------------------------------------------
 * A ORDEM DESTA LISTA É A ORDEM EM QUE AS ENTRADAS CHEGARAM
 * ---------------------------------------------------------------------------
 * As seis primeiras são as da etapa 2, e as quatro últimas entraram a 28.08.2026
 * pela ordem em que a tabela da nota do motor as escreve (`PT11`, `PT19`,
 * `PT1D`, `PT20`). Nada se reordena: a lista da régua rende-se por esta ordem e o
 * eixo arruma-se pelo VALOR, que é uma ordem geométrica e não editorial. Uma
 * reordenação é uma decisão de desenho, e não um efeito secundário de acrescentar
 * quatro linhas.
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
    /** `PT1A` · «Grande Lisboa» na NUTS 2024. */
    codigo: 'PT1A',
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
    /** `PT1B` · «Península de Setúbal» na NUTS 2024. */
    codigo: 'PT1B',
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
    /** `PT15` · «Algarve» na NUTS 2024. */
    codigo: 'PT15',
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
    /** `PT30` · «Região Autónoma da Madeira» na NUTS 2024. */
    codigo: 'PT30',
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
    /** `PT1C` · «Alentejo» na NUTS 2024. */
    codigo: 'PT1C',
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
  /* -------------------------------------------------------------------------
     AS QUATRO QUE FALTAVAM (Emenda 21e, 28.08.2026)
     -------------------------------------------------------------------------
     O motor confirmou na fonte o conjunto NUTS II em vigor — nove regiões — e
     atravessou as linhas das quatro que o sítio não tinha. Entram aqui pela
     mesma via que as outras seis: uma entrada com as suas duas afirmações, e
     `src/lib/regioes.mjs` faz o resto (barra, página, endereço, contagem).

     OS NOMES SEGUEM A CONVENÇÃO DA CASA, e a convenção é esta: o nome oficial
     encurta-se onde o uso corrente o encurta («Região Autónoma da Madeira» já era
     «Madeira» desde a etapa 2), e só se traduz onde existe um nome inglês
     estabelecido («Greater Lisbon», «Setúbal Peninsula»). O Eurostat não traduz
     nenhum destes nomes — a nota do motor mede-o: «`NAME_LATN` e `NUTS_NAME` são
     iguais nas nove linhas, e o nome inglês da lista de códigos `GEO` é o mesmo:
     o Eurostat não traduz estes nomes» —, e por isso «Norte», «Centro» e «Oeste e
     Vale do Tejo» ficam em português nas duas edições. «Açores» tem nome inglês
     estabelecido, «Azores», e traduz-se.

     O «(PT)» DE «Centro (PT)» NÃO ENTRA: é o desambiguador da classificação, que
     tem um «Centro» em mais de um país, e não faz parte do nome da região. Fica
     escrito no comentário do código, que é onde o nome oficial vive.
     ------------------------------------------------------------------------- */
  {
    id: 'nor',
    /** `PT11` · «Norte» na NUTS 2024. */
    codigo: 'PT11',
    slug: 'norte',
    nome: { pt: 'Norte', en: 'Norte' },
    valor: 'pib-pc-norte-2024',
    distancia: 'distancia-norte-ue27-2024',
    sinal: '−',
    frase: {
      pt: ['O Norte está ', { claim: 'distancia-norte-ue27-2024' }, ' pontos abaixo da média da UE-27.'],
      en: ['Norte is ', { claim: 'distancia-norte-ue27-2024' }, ' points below the EU-27 average.'],
    },
  },
  {
    id: 'cen',
    /** `PT19` · «Centro (PT)» na NUTS 2024. */
    codigo: 'PT19',
    slug: 'centro',
    nome: { pt: 'Centro', en: 'Centro' },
    valor: 'pib-pc-centro-2024',
    distancia: 'distancia-centro-ue27-2024',
    sinal: '−',
    frase: {
      pt: ['O Centro está ', { claim: 'distancia-centro-ue27-2024' }, ' pontos abaixo da média da UE-27.'],
      en: ['Centro is ', { claim: 'distancia-centro-ue27-2024' }, ' points below the EU-27 average.'],
    },
  },
  {
    id: 'ovt',
    /** `PT1D` · «Oeste e Vale do Tejo» na NUTS 2024. */
    codigo: 'PT1D',
    slug: 'oeste-e-vale-do-tejo',
    nome: { pt: 'Oeste e Vale do Tejo', en: 'Oeste e Vale do Tejo' },
    valor: 'pib-pc-oeste-e-vale-do-tejo-2024',
    distancia: 'distancia-oeste-e-vale-do-tejo-ue27-2024',
    sinal: '−',
    frase: {
      pt: [
        'O Oeste e Vale do Tejo está ',
        { claim: 'distancia-oeste-e-vale-do-tejo-ue27-2024' },
        ' pontos abaixo da média da UE-27.',
      ],
      en: [
        'Oeste e Vale do Tejo is ',
        { claim: 'distancia-oeste-e-vale-do-tejo-ue27-2024' },
        ' points below the EU-27 average.',
      ],
    },
  },
  {
    id: 'aco',
    /** `PT20` · «Região Autónoma dos Açores» na NUTS 2024. */
    codigo: 'PT20',
    slug: 'acores',
    nome: { pt: 'Açores', en: 'Azores' },
    valor: 'pib-pc-acores-2024',
    distancia: 'distancia-acores-ue27-2024',
    sinal: '−',
    frase: {
      pt: ['Os Açores estão ', { claim: 'distancia-acores-ue27-2024' }, ' pontos abaixo da média da UE-27.'],
      en: ['The Azores are ', { claim: 'distancia-acores-ue27-2024' }, ' points below the EU-27 average.'],
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
/**
 * A CAIXA DA RÉGUA ENCOLHEU (direção, 21.08.2026; `DECISIONS.md` §1.52).
 *
 * A leitura da pré-visualização n.º 1 pediu «o Instrumento n.º 1 mais pequeno,
 * com escala fluida». O SVG desenha-se a 100% da largura do seu contentor e a
 * altura sai da proporção da caixa: encolher a caixa encolhe o instrumento em
 * TODAS as larguras, sem um salto de patamar e sem uma segunda regra de folha.
 *
 * O que se cortou, e o que não se cortou:
 *   · `altura` 300 -> 262. Os 38 pontos de baixo eram papel: o rótulo mais baixo
 *     é o da distância, cuja base fica a `eixoY + 42`;
 *   · `eixoY` 216 -> 206. Fecha dez pontos entre o patamar mais baixo (178) e o
 *     eixo. O pé do marcador continua a ter 18 pontos de haste, e tudo o que se
 *     desenha por baixo do eixo — traços, rótulos da escala, rótulo da distância
 *     — está escrito EM RELAÇÃO a `eixoY`, e por isso desce com ele sem mudar
 *     uma distância entre si;
 *   · os `patamares` ficam como estavam. Os 30 pontos entre eles são a medição
 *     da subetapa 2g, que foi a que separou o nome da região do seu valor; mexer
 *     neles era desfazer uma correção já medida.
 */
/**
 * OS PATAMARES PASSAM A ESTAR A 42 UNIDADES, E A CAIXA CRESCE COM ELES
 * (Emenda 21, 27.08.2026; medido pela régua de `tests/inicio/regioes.mjs`, M1b).
 *
 * A chapa de papel de um rótulo vai de `y-37` a `y+4`: são 41 unidades de altura.
 * Os patamares estavam a 30, e por isso duas chapas de patamares vizinhos
 * cruzavam-se SEMPRE em 11 unidades. Enquanto a régua desenhava uma leitura isso
 * não tinha consequência; com a régua completa tem, e a régua mediu-a a 1280: a
 * chapa de Portugal tapava o rótulo do Alentejo e a do Algarve tapava o da
 * Madeira, porque uma chapa é desenhada depois do rótulo do vizinho.
 *
 * O empacotador separa os rótulos EM X dentro de um patamar; nada os separava em
 * Y entre patamares. Com 42 unidades de intervalo, duas chapas de patamares
 * vizinhos deixam de se tocar (`y+4` de um fica uma unidade abaixo de `y-37` do
 * de cima), e a garantia passa a ser das duas dimensões:
 *
 *   · dentro de um patamar, o empacotador;
 *   · entre patamares, a geometria.
 *
 * `eixoY` desce 42 e `altura` cresce 28. O que estava escrito EM RELAÇÃO a
 * `eixoY` — os traços da escala, os rótulos da escala — desce com ele sem mudar
 * uma distância entre si, e o que se ganhou em altura é o que os patamares
 * pediram. A altura da caixa é agora `eixoY + 42`, e não `eixoY + 56`: o rótulo
 * da distância, que era o que vivia lá em baixo, saiu com a barra do eixo
 * (Emenda 21c: a barra é da lista, uma por leitura).
 *
 * SÃO QUATRO PATAMARES, E COM DEZ LEITURAS CONTINUAM A CHEGAR (I85, medida e
 * fechada a 28.08.2026). A nota de 27.08 previa o contrário: «com seis leituras
 * isso chega — mas não chega por definição … a resposta desse dia é um patamar a
 * mais aqui e mais 42 unidades de caixa». O motor trouxe as quatro regiões que
 * faltavam, as leituras passaram de seis a dez, e a previsão foi posta à prova
 * em vez de aplicada de cor.
 *
 * O QUE A RÉGUA MEDIU, com as duas geometrias construídas e fotografadas:
 *
 *   cinco patamares    10 marcas · 0 rótulos cruzados · 0 tapados · 4 patamares
 *                      usados (1, 1, 3, 5), o quinto VAZIO
 *   quatro patamares   10 marcas · 0 rótulos cruzados · 0 tapados · 4 patamares
 *                      usados (1, 1, 3, 5)
 *
 * O empacotador nunca precisou do quinto: percorre a régua da esquerda para a
 * direita e só sobe de patamar quando o rótulo não cabe, e com estes dez valores
 * o mais alto de que precisa é o quarto. O quinto patamar seria 42 unidades de
 * papel no cimo do desenho, e a leitura da pré-visualização n.º 1 encolheu esta
 * caixa precisamente por isso: «os 38 pontos de baixo eram papel».
 *
 * E NÃO HÁ CRESCIMENTO POR QUE ESPERAR: o conjunto NUTS II em vigor tem NOVE
 * regiões, confirmado na fonte pelo motor (`nuts_datasets.json` diz que a versão
 * em vigor é a NUTS 2024, `nuts2024_at.csv` diz que unidades ela tem), e as nove
 * têm linha. A régua está no seu tamanho final até a classificação mudar; nesse
 * dia, a M1b vê-o e a resposta continua escrita aqui.
 *
 * O QUE FICA DE PÉ DA NOTA DE 27.08: os quatro patamares estão TODOS ocupados
 * (1, 1, 3 e 5 marcas), e por isso não há folga nenhuma. Uma décima primeira
 * leitura na vizinhança densa da escala iria para o último patamar por não caber
 * em nenhum, e dois rótulos cruzar-se-iam. Quem o vê é a M1b, que imprime quantos
 * patamares o empacotador usou; a resposta desse dia é o patamar a mais e as 42
 * unidades de caixa, e a conta está escrita aqui: o patamar novo entra por cima
 * (`262`), `eixoY` passa de 248 para 290 e `altura` de 290 para 332.
 *
 * A MEDIÇÃO DA SUBETAPA 2g FICA INTACTA: o que ela mediu foi a distância entre o
 * nome e o valor DENTRO de uma chapa (24 unidades, `y-24` e `y-1`), e essa não
 * muda. O que muda é a distância entre chapas.
 */
export const GEOMETRIA = {
  largura: 980,
  altura: 290,
  esquerda: 64,
  direita: 916,
  eixoY: 248,
  patamares: [220, 178, 136, 94],
};
