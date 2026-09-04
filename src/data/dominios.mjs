/**
 * OS DEZOITO DOMÍNIOS DA CARTA, E AS MEDIDAS DO PRIMEIRO.
 *
 * ---------------------------------------------------------------------------
 * O QUE UM DOMÍNIO É
 * ---------------------------------------------------------------------------
 * «A unidade é o domínio: uma área da vida do país sobre a qual um leitor tem
 * perguntas» (`design/observatorio/CARTA-DOS-CONTEUDOS.md` §0). Os dezoito, os
 * seus nomes e a vaga de cada um saem da tabela do §2 daquele ficheiro, sem uma
 * palavra mudada; a ordem é a dela. Um domínio entra no sítio quando as suas
 * medidas passam a disciplina inteira, e até lá a ausência diz-se.
 *
 * ---------------------------------------------------------------------------
 * NENHUM ALGARISMO SE ESCREVE AQUI
 * ---------------------------------------------------------------------------
 * A regra de `src/data/municipios.mjs` e de `src/data/concelhos.mjs`, e é a
 * mesma: cada medida declara o ID de uma linha do livro-razão, e o valor vem de
 * lá por `<Claim/>`. As palavras à volta vêm nas duas línguas e não trazem
 * algarismos: onde é preciso um número há `{ claim: … }`, onde é preciso um
 * período há `{ ref: … }`, e um limiar publicado por um quadro institucional
 * entra pelo motivo `limiar-do-quadro` que a peça e a faixa já usam.
 *
 * ---------------------------------------------------------------------------
 * O QUE É SUPOSIÇÃO DO LUGAR DE DIREÇÃO, E FICA NOS PENDENTES
 * ---------------------------------------------------------------------------
 * O brief F1.2 §1 escreve três decisões que são do diretor e que este ficheiro
 * assume enquanto ele não decide, cada uma marcada onde vive:
 *
 *   · o SLUG de cada domínio (`slug`, aqui em baixo);
 *   · a MEDIDA DE CABEÇA do domínio 1 e as CINCO da faixa (`cabeca` e `faixa`);
 *   · a MANCHETE do domínio, que é texto do diretor e que aqui se compõe pela
 *     regra da manchete do país (Emenda 16): os algarismos são todos linhas
 *     seladas, e nenhuma diferença a um limiar é feita à mão.
 *
 * ---------------------------------------------------------------------------
 * O DOMÍNIO 2 NÃO DIZ «AINDA SEM MEDIDAS CONFERIDAS», E A RAZÃO É QUE SERIA
 * FALSO
 * ---------------------------------------------------------------------------
 * O brief §0 manda construir «Economia e finanças públicas» **com «Trabalho»
 * dentro**, que é a ordem estreita da primeira vaga; e a sua medida B9 pede o
 * índice «com os outros dezassete sem ligação e com "ainda sem medidas
 * conferidas"». As duas coisas não podem ser verdade ao mesmo tempo: as cinco
 * medidas de Trabalho (T1, T2, T3, T4b, T5) estão conferidas, estão no
 * livro-razão desde a §1.90 e estão à vista na página do domínio 1. Escrever
 * «ainda sem medidas conferidas» debaixo do nome «Trabalho» era a casa a
 * afirmar o contrário do que a sua própria página mostra.
 *
 * O estado é por isso um campo de cada domínio, e são três:
 *
 *   · `no-ar`     tem página própria, e o índice abre-a;
 *   · `dentro-de` as medidas estão conferidas e vivem na página de outro
 *                 domínio, nomeado em `dentroDe`; o índice diz onde e leva lá;
 *   · `sem`       ainda sem medidas conferidas, e sem ligação.
 *
 * O diretor troca o estado de Trabalho numa linha no dia em que decidir que ele
 * tem página própria. Fica nos pendentes.
 */

import { hasClaim } from '../lib/ledger.mjs';

/**
 * Um domínio da carta.
 *
 * @typedef {{
 *   n: number,
 *   slug: string,
 *   nome: ParDeLinguas,
 *   vaga: 'primeira'|'segunda'|'terceira',
 *   estado: 'no-ar'|'dentro-de'|'sem',
 *   dentroDe?: string,
 *   ancoraDentro?: string,
 * }} Dominio
 */

/**
 * OS DEZOITO, PELA ORDEM DA CARTA (§2).
 *
 * Os nomes portugueses são os da carta, transcritos. Os ingleses são a tradução
 * do nome do domínio, e não uma palavra nova do sítio: um domínio é uma matéria
 * e não um nome próprio.
 *
 * @type {readonly Dominio[]}
 */
export const DOMINIOS = /** @type {const} */ ([
  {
    n: 1,
    slug: 'economia-e-financas-publicas',
    nome: { pt: 'Economia e finanças públicas', en: 'Economy and public finances' },
    vaga: 'primeira',
    estado: 'no-ar',
  },
  {
    n: 2,
    slug: 'trabalho',
    nome: { pt: 'Trabalho', en: 'Labour' },
    vaga: 'primeira',
    estado: 'dentro-de',
    dentroDe: 'economia-e-financas-publicas',
    /* A PORTA VAI À SECÇÃO, E NÃO SÓ AO TOPO DA PÁGINA (segunda passagem,
       03.09.2026, achado Major 11 da leitura a frio). T1 é a primeira das
       cinco medidas de Trabalho na ordem em que a página as lista (E1 a E5,
       depois T1 a T5), e por isso é a âncora que leva à secção onde elas
       vivem, e não ao início do domínio 1. */
    ancoraDentro: 'm-t1',
  },
  {
    n: 3,
    slug: 'populacao',
    nome: { pt: 'População', en: 'Population' },
    vaga: 'primeira',
    estado: 'sem',
  },
  {
    n: 4,
    slug: 'migracao',
    nome: { pt: 'Migração', en: 'Migration' },
    vaga: 'primeira',
    estado: 'sem',
  },
  {
    n: 5,
    slug: 'seguranca-social-e-pensoes',
    nome: { pt: 'Segurança social e pensões', en: 'Social security and pensions' },
    vaga: 'primeira',
    estado: 'sem',
  },
  { n: 6, slug: 'agua', nome: { pt: 'Água', en: 'Water' }, vaga: 'primeira', estado: 'sem' },
  {
    n: 7,
    slug: 'educacao',
    nome: { pt: 'Educação', en: 'Education' },
    vaga: 'primeira',
    estado: 'sem',
  },
  { n: 8, slug: 'saude', nome: { pt: 'Saúde', en: 'Health' }, vaga: 'primeira', estado: 'sem' },
  {
    n: 9,
    slug: 'habitacao',
    nome: { pt: 'Habitação', en: 'Housing' },
    vaga: 'segunda',
    estado: 'sem',
  },
  {
    n: 10,
    slug: 'investimento',
    nome: { pt: 'Investimento', en: 'Investment' },
    vaga: 'segunda',
    estado: 'sem',
  },
  {
    n: 11,
    slug: 'ciencia-tecnologia-e-inteligencia-artificial',
    nome: {
      pt: 'Ciência, tecnologia e inteligência artificial',
      en: 'Science, technology and artificial intelligence',
    },
    vaga: 'segunda',
    estado: 'sem',
  },
  { n: 12, slug: 'espaco', nome: { pt: 'Espaço', en: 'Space' }, vaga: 'segunda', estado: 'sem' },
  {
    n: 13,
    slug: 'infraestruturas-e-ferrovia',
    nome: { pt: 'Infraestruturas e ferrovia', en: 'Infrastructure and rail' },
    vaga: 'segunda',
    estado: 'sem',
  },
  {
    n: 14,
    slug: 'ambiente-e-sustentabilidade',
    nome: { pt: 'Ambiente e sustentabilidade', en: 'Environment and sustainability' },
    vaga: 'segunda',
    estado: 'sem',
  },
  { n: 15, slug: 'cultura', nome: { pt: 'Cultura', en: 'Culture' }, vaga: 'terceira', estado: 'sem' },
  {
    n: 16,
    slug: 'seguranca',
    nome: { pt: 'Segurança', en: 'Security' },
    vaga: 'terceira',
    estado: 'sem',
  },
  { n: 17, slug: 'justica', nome: { pt: 'Justiça', en: 'Justice' }, vaga: 'terceira', estado: 'sem' },
  {
    n: 18,
    slug: 'governo-e-democracia',
    nome: { pt: 'Governo e democracia', en: 'Government and democracy' },
    vaga: 'terceira',
    estado: 'sem',
  },
]);

/**
 * UMA MEDIDA DE UM DOMÍNIO.
 *
 * `chave`      o nome da linha do inventário das fontes (E1 a E5, T1 a T5), que
 *              é por onde a carta e o inventário lhe chamam. Não se rende: é a
 *              âncora entre este ficheiro e `INVENTARIO-DAS-FONTES.md`.
 * `claim`      o id da linha nacional, ou `null` quando a medida só existe ao
 *              nível do concelho (E5) ou quando não existe de todo (T4a).
 * `claims`     ids adicionais da mesma medida, quando a fonte publica mais do
 *              que um número para a mesma pergunta (T5: o diploma continental e
 *              a série do Eurostat em doze meses). Cada um traz o seu rótulo.
 * `pergunta`   a pergunta da carta, palavra por palavra.
 * `nome`       o nome da medida, nas duas línguas.
 * `unidade`    a unidade sozinha, sem período e sem figura, como nas peças.
 * `ambito`     o intervalo que faz parte da definição publicada do indicador (as
 *              idades), quando existe. Vive fora do nome porque o nome é o
 *              rótulo de um cartão e um cartão não leva algarismos soltos.
 * `rotuloDoValor` o que o número com selo é, quando ele não é «o valor da
 *              medida»: E5 mostra o limite legal, e o rótulo di-lo.
 * `limiar`     o limiar publicado pelo quadro, quando existe, na forma que
 *              `Peca.astro` já lê.
 * `porConcelho` a chave das 308 linhas desta medida, quando existem.
 * `forma`      a forma gráfica admitida que esta medida ganha (`§3` do brief da
 *              forma dos domínios), ou `null`.
 * `ausencia`   a razão da ausência, quando não há número público.
 * `ressalva`   uma frase de ressalva sobre o ALCANCE da medida, quando a fonte
 *              publica menos do que a página deixaria supor (segunda passagem,
 *              03.09.2026, Blocking 4): a meta da União que não é de Portugal
 *              em T1, o território que o diploma de T5 não cobre. Nunca um
 *              número novo, sempre com o marcador da casa onde algo falta.
 *
 * @typedef {{
 *   chave: string,
 *   claim: string|null,
 *   claims?: { id: string, rotulo: ParDeLinguas }[],
 *   pergunta: ParDeLinguas,
 *   nome: ParDeLinguas,
 *   unidade: ParDeLinguas,
 *   ambito?: ParDeLinguas,
 *   rotuloDoValor?: ParDeLinguas,
 *   limiar?: Limiar|null,
 *   porConcelho?: 'ganho'|'indice'|null,
 *   forma?: 'barra-concelho'|'mapa'|null,
 *   ausencia?: ParDeLinguas|null,
 *   ressalva?: FraseDasDuasLinguas|null,
 * }} MedidaDoDominio
 */

/**
 * AS DEZ MEDIDAS DO DOMÍNIO 1, MAIS A AUSÊNCIA (brief F1.2 §2, item 5 e 6).
 *
 * E1 a E5 e T1 a T5, com T4 na forma que o inventário confirmou: a disparidade
 * salarial NACIONAL do Eurostat (T4b). A do concelho (T4a) não existe, e a razão
 * está na entrada da ausência, ao fim desta lista.
 *
 * @type {readonly MedidaDoDominio[]}
 */
export const MEDIDAS_DO_DOMINIO_1 = /** @type {const} */ ([
  {
    chave: 'E1',
    claim: 'pib-real-per-capita-2025',
    pergunta: {
      pt: 'Quanto cresce a economia por pessoa?',
      en: 'How much does the economy grow per person?',
    },
    nome: { pt: 'PIB real por habitante', en: 'Real GDP per capita' },
    unidade: {
      pt: 'Euros por habitante · volumes encadeados',
      en: 'Euros per inhabitant · chain linked volumes',
    },
    limiar: null,
    porConcelho: null,
    forma: null,
  },
  {
    chave: 'E2',
    claim: 'saldo-das-administracoes-publicas-2025',
    pergunta: {
      pt: 'As contas públicas estão em equilíbrio?',
      en: 'Are the public accounts in balance?',
    },
    nome: {
      pt: 'Saldo das administrações públicas',
      en: 'General government balance',
    },
    unidade: { pt: 'Percentagem do PIB', en: 'Percentage of GDP' },
    /* O limiar de 3 % do Protocolo n.º 12, do lado do défice: um saldo abaixo de
       −3 % está fora. O sinal escreve-se, porque o limiar é negativo. */
    limiar: { nl: '3', sinal: '−', lado: 'inferior', simbolo: '%' },
    porConcelho: null,
    forma: null,
  },
  {
    chave: 'E3',
    claim: 'divida-publica-2025',
    pergunta: { pt: 'Quanto deve o Estado?', en: 'How much does the State owe?' },
    nome: { pt: 'Dívida pública', en: 'Government debt' },
    unidade: { pt: 'Percentagem do PIB', en: 'Percentage of GDP' },
    limiar: { nl: '60', lado: 'superior', simbolo: '%' },
    porConcelho: null,
    forma: null,
  },
  {
    chave: 'E4',
    claim: 'crescimento-da-despesa-liquida-2025',
    pergunta: {
      pt: 'O Estado gasta dentro da regra europeia?',
      en: 'Does the State spend within the European rule?',
    },
    nome: { pt: 'Crescimento da despesa líquida', en: 'Net expenditure growth' },
    unidade: { pt: 'Percentagem', en: 'Percentage' },
    /* O teto recomendado pela trajetória do Conselho da UE, lido no parecer do
       Conselho das Finanças Públicas. É um limiar publicado, como os do
       Procedimento, e entra pelo mesmo motivo declarado. */
    limiar: { nl: '5', lado: 'superior', simbolo: '%' },
    porConcelho: null,
    forma: null,
  },
  {
    chave: 'E5',
    /* ------------------------------------------------------------------------
       A MEDIDA É DO CONCELHO, E O NÚMERO NACIONAL DESTA LEITURA É O LIMITE
       ------------------------------------------------------------------------
       E5 não tem linha nacional: a dívida de um município é do município, e a
       soma dos 308 não é uma medida que alguém publique. O que esta leitura
       mostra com selo é o LIMITE LEGAL, que é nacional, é uma linha do
       livro-razão com as suas três datas, e é a referência contra a qual o mapa
       pinta os 308. O rótulo diz o que o número é, para que ninguém o leia como
       a dívida.

       AS TRÊS DATAS SÃO AS DESTA LINHA, e não uma média das 308. As 308 linhas
       da dívida não concordam nas três datas (medido: 307 lidas a 26.08.2026 e
       uma a 10.08), e escolher uma para representar as outras seria afirmar
       sobre 307 o que só é verdade de uma. As datas de cada concelho estão na
       página dele e na linha dele, que é onde são verdade. */
    claim: 'indice-de-divida-limite-legal',
    rotuloDoValor: { pt: 'o limite legal', en: 'the legal cap' },
    pergunta: {
      pt: 'Quanto deve a minha câmara, e qual é o limite?',
      en: 'How much does my municipality owe, and what is the cap?',
    },
    nome: {
      pt: 'Dívida da câmara contra o limite legal',
      en: 'Municipal debt against the legal cap',
    },
    unidade: { pt: 'Percentagem', en: 'Percentage' },
    limiar: null,
    /* A MEDIDA QUE O MAPA PINTA É O ÍNDICE, e não os euros. A dívida total de um
       município e a de outro não se comparam num mapa: o que um mapa de euros
       desenha é o tamanho do município, e a §1 da carta recusa por nome «uma
       forma que ponha duas medidas com bases diferentes na mesma escala». O
       índice é a mesma dívida contra o limite que o artigo 52.º da Lei
       n.º 73/2013 fixa para cada município, é uma linha derivada com a sua
       aritmética registada, e é a comparação que a fonte permite. Os euros
       ficam onde são verdade: na peça de cada uma das 308 páginas de concelho. */
    porConcelho: 'indice',
    forma: 'mapa',
  },
  {
    chave: 'T1',
    claim: 'taxa-de-emprego-2025',
    pergunta: { pt: 'Quantas pessoas trabalham?', en: 'How many people work?' },
    nome: { pt: 'Taxa de emprego', en: 'Employment rate' },
    /* O ÂMBITO É DA DEFINIÇÃO E NÃO DO VALOR, e por isso é um campo à parte: o
       nome da medida sem ele seria outra medida (o Eurostat publica taxas de
       emprego para vários intervalos), e o nome COM ele traria algarismos para
       dentro do rótulo de um cartão. O intervalo é a dimensão `age=Y20-64` do
       `source_url` desta linha, e vai debaixo do motivo declarado
       `ambito-da-medida`. */
    ambito: { pt: 'dos 20 aos 64 anos', en: '20 to 64 years' },
    unidade: { pt: 'Percentagem da população', en: 'Percentage of the population' },
    /* A meta de 78 % em 2030 do Plano de Ação do Pilar Europeu dos Direitos
       Sociais é DA UNIÃO no seu conjunto e não de Portugal, e a carta di-lo. Um
       limiar que não é do país não se põe ao lado do valor do país como se
       fosse: a medida fica sem limiar, e a meta nacional continua `[verify]`. */
    limiar: null,
    porConcelho: null,
    forma: null,
    /* O MARCADOR FICA VISÍVEL, E NÃO SÓ NO COMENTÁRIO (segunda passagem,
       03.09.2026, Blocking 4). A meta que falta é a de Portugal e não a da
       União: dizê-lo sem o número da meta europeia, que não tem linha neste
       domínio e não se escreve à mão. */
    ressalva: {
      pt: [
        'A meta desta medida é da União Europeia no seu conjunto e não de Portugal; uma meta nacional própria permanece ',
        { marcador: 'a verificar', gloss: 'to verify' },
        '.',
      ],
      en: [
        'This measure’s target belongs to the European Union as a whole, not to Portugal; a national target of its own remains ',
        { marcador: 'a verificar', gloss: 'to verify' },
        '.',
      ],
    },
  },
  {
    chave: 'T2',
    claim: 'taxa-de-desemprego-2025',
    pergunta: {
      pt: 'Quantas procuram trabalho e não encontram?',
      en: 'How many are looking for work and not finding it?',
    },
    nome: { pt: 'Taxa de desemprego', en: 'Unemployment rate' },
    /* A dimensão `age=Y15-74` do `source_url` desta linha. Ver T1. */
    ambito: { pt: 'dos 15 aos 74 anos', en: '15 to 74 years' },
    unidade: { pt: 'Percentagem da população ativa', en: 'Percentage of the labour force' },
    limiar: null,
    /* O DESEMPREGO REGISTADO POR CONCELHO NÃO É ESTA MEDIDA, e por isso esta
       entrada não o declara: o ficheiro do IEFP conta PESSOAS inscritas e este
       valor é uma PERCENTAGEM da população ativa do inquérito ao emprego. Pôr as
       duas na mesma escala era «uma forma que põe duas medidas com bases
       diferentes na mesma escala», que o §3 do brief da forma recusa por nome. O
       desemprego registado continua onde é verdade: nas 308 páginas de concelho,
       com a sua unidade. */
    porConcelho: null,
    forma: null,
  },
  {
    chave: 'T3',
    claim: 'ganho-medio-mensal-2024',
    pergunta: { pt: 'Quanto se ganha?', en: 'How much do people earn?' },
    nome: { pt: 'Ganho médio mensal', en: 'Average monthly earnings' },
    unidade: { pt: 'Euros por mês', en: 'Euros per month' },
    limiar: null,
    porConcelho: 'ganho',
    forma: 'mapa',
  },
  {
    chave: 'T4',
    claim: 'disparidade-salarial-entre-sexos-2024',
    pergunta: { pt: 'As mulheres ganham o mesmo?', en: 'Do women earn the same?' },
    nome: {
      pt: 'Disparidade salarial não ajustada entre homens e mulheres',
      en: 'Unadjusted gender pay gap',
    },
    unidade: { pt: 'Percentagem', en: 'Percentage' },
    limiar: null,
    porConcelho: null,
    forma: null,
  },
  {
    chave: 'T5',
    claim: 'retribuicao-minima-mensal-garantida-continente-2026',
    claims: [
      {
        id: 'retribuicao-minima-mensal-doze-meses-2026',
        rotulo: {
          pt: 'em doze meses, na base do Eurostat',
          en: 'over twelve months, on the Eurostat basis',
        },
      },
    ],
    pergunta: {
      pt: 'Qual é o salário mínimo em vigor?',
      en: 'What is the minimum wage in force?',
    },
    nome: {
      pt: 'Retribuição mínima mensal garantida',
      en: 'Guaranteed minimum monthly wage',
    },
    unidade: { pt: 'Euros por mês', en: 'Euros per month' },
    limiar: null,
    porConcelho: null,
    forma: null,
    /* O MARCADOR FICA VISÍVEL (segunda passagem, 03.09.2026, Blocking 4). A
       linha do diploma é do território continental (artigo 2.º, «Âmbito
       territorial»); os Açores e a Madeira fixam o seu valor por diploma
       regional próprio, que o inventário das fontes não leu. Paráfrase da
       fronteira territorial e não citação: a citação exacta vive no campo
       `document.locator` da linha, para quem quiser conferi-la. */
    ressalva: {
      pt: [
        'Este valor é o do território continental. Os Açores e a Madeira fixam o seu por diploma regional próprio, que não foi lido: ',
        { marcador: 'a verificar', gloss: 'to verify' },
        '.',
      ],
      en: [
        'This value is for mainland Portugal. The Azores and Madeira set their own value by separate regional decree, which has not been read: ',
        { marcador: 'a verificar', gloss: 'to verify' },
        '.',
      ],
    },
  },
]);

/**
 * A AUSÊNCIA DECLARADA DO DOMÍNIO 1 (brief F1.2 §2, item 6; Emenda 14).
 *
 * «Uma pergunta da carta cuja medida não existe imprime a pergunta e a resposta
 * "não há número público para isto", com a fonte que se procurou»
 * (`BRIEF-forma-dos-dominios.md` §2). É a T4a do inventário, e a razão é a que
 * ele mediu: o indicador do INE por concelho é um coeficiente de variação do
 * ganho, e não a disparidade entre sexos.
 *
 * @type {readonly { chave: string, pergunta: ParDeLinguas, procurado: ParDeLinguas, codigo: string, razao: ParDeLinguas }[]}
 */
export const AUSENCIAS_DO_DOMINIO_1 = /** @type {const} */ ([
  {
    chave: 'T4a',
    pergunta: {
      pt: 'As mulheres ganham o mesmo, no meu concelho?',
      en: 'Do women earn the same, in my municipality?',
    },
    /* A fonte que se procurou, partida em duas: as palavras, e o CÓDIGO do
       indicador, que é um identificador técnico de um conjunto de dados e leva o
       seu motivo declarado. Sem o código, a pista não se segue; com ele dentro
       da frase, seriam algarismos sem origem num cartão que existe justamente
       para não ter números. */
    procurado: {
      pt: 'INE, Quadros de Pessoal do MTSSS/GEP, indicador ',
      en: 'Statistics Portugal, MTSSS/GEP staff records, indicator ',
    },
    codigo: '0012661',
    razao: {
      pt: 'O indicador que o publicador dá por concelho é um coeficiente de variação do ganho, e não a disparidade entre sexos.',
      en: 'The indicator the publisher gives by municipality is a coefficient of variation of earnings, not the gap between sexes.',
    },
  },
]);

/**
 * A MEDIDA DE CABEÇA E AS CINCO DA FAIXA (brief F1.2 §1, suposição).
 *
 * A faixa leva cinco medidas e a manchete leva a de cabeça. As chaves são as do
 * inventário, e não ids: quem quiser trocar uma medida troca a chave, e a linha
 * vem com ela.
 */
export const CABECA_DO_DOMINIO_1 = 'E3';
export const FAIXA_DO_DOMINIO_1 = /** @type {const} */ (['E3', 'E2', 'T1', 'T2', 'T3']);

/**
 * A FRASE DA FRONTEIRA (brief F1.2 §1 e §2, item 4).
 *
 * «O que este domínio mede e o que não mede, uma frase, impressa uma vez,
 * citável.» As palavras vêm da carta, e o relatório do bloco diz de onde cada
 * uma vem: o que o domínio mede é a lista das perguntas da carta (§3, domínios
 * 1 e 2); o que não mede são as três exclusões que a própria carta escreve: a
 * produtividade, que ela manda para estudo; o PIB abaixo das NUTS III, que a
 * coluna «concelho» da linha E1 diz não existir; e a disparidade salarial por
 * concelho, que o inventário mostrou não ser publicada.
 *
 * NÃO TRAZ ALGARISMOS. Uma contagem das medidas seria um número da casa, e um
 * número da casa entra por `data-prova`, com quem o reconte.
 */
export const FRONTEIRA_DO_DOMINIO_1 = {
  pt: 'Este domínio mede as contas do Estado, o que a economia produz por pessoa, a dívida das câmaras e o que se ganha e se trabalha em Portugal; não mede a produtividade, que é pergunta de estudo, nem o produto abaixo das regiões, nem a disparidade salarial entre sexos ao nível do concelho, que nenhum publicador oficial calcula.',
  en: 'This domain measures the State’s accounts, what the economy produces per person, municipal debt, and what is earned and worked in Portugal; it does not measure productivity, which is a question for a study, nor output below the regions, nor the gender pay gap at municipal level, which no official publisher computes.',
};

/**
 * As medidas de um domínio, ou lista vazia.
 *
 * Hoje só o domínio 1 tem medidas, e a lista está escrita aqui. Um domínio novo
 * traz a sua, e esta função continua a ser a única porta.
 *
 * @param {string} slug
 * @returns {readonly MedidaDoDominio[]}
 */
export function medidasDoDominio(slug) {
  return slug === 'economia-e-financas-publicas' ? MEDIDAS_DO_DOMINIO_1 : [];
}

/**
 * As ausências declaradas de um domínio.
 *
 * @param {string} slug
 */
export function ausenciasDoDominio(slug) {
  return slug === 'economia-e-financas-publicas' ? AUSENCIAS_DO_DOMINIO_1 : [];
}

/**
 * A frase da fronteira de um domínio, ou `null`.
 *
 * @param {string} slug
 * @returns {ParDeLinguas|null}
 */
export function fronteiraDoDominio(slug) {
  return slug === 'economia-e-financas-publicas' ? FRONTEIRA_DO_DOMINIO_1 : null;
}

/**
 * OS DOMÍNIOS COM PÁGINA, E A REGRA É A DAS ÁREAS E DAS REGIÕES.
 *
 * Um domínio só tem endereço quando declara medidas E as linhas dessas medidas
 * existem no livro-razão. As duas condições são precisas: a lista podia declarar
 * uma medida antes de a linha atravessar do motor, e uma página que citasse uma
 * linha inexistente fechava a construção com um erro de `getClaim()` em vez de
 * uma ausência dita.
 */
export function dominiosComPagina() {
  return DOMINIOS.filter((d) => {
    const medidas = medidasDoDominio(d.slug);
    if (medidas.length === 0) return false;
    return medidas.every((m) => m.claim === null || hasClaim(m.claim));
  });
}

/** Os nomes dos domínios no endereço, para os caminhos estáticos. */
export function slugsDosDominios() {
  return dominiosComPagina().map((d) => d.slug);
}

/**
 * Um domínio pelo seu nome no endereço, ou `null` se não tiver página.
 *
 * @param {string} slug
 * @returns {Dominio|null}
 */
export function dominioDoSlug(slug) {
  return dominiosComPagina().find((d) => d.slug === slug) ?? null;
}

/**
 * Um domínio da lista, tenha página ou não. É o que o índice lê.
 *
 * @param {string} slug
 * @returns {Dominio|null}
 */
export function dominioDeclarado(slug) {
  return DOMINIOS.find((d) => d.slug === slug) ?? null;
}

/**
 * Uma medida do domínio 1 pela sua chave do inventário.
 *
 * @param {string} chave
 * @returns {MedidaDoDominio|null}
 */
export function medidaPelaChave(chave) {
  return MEDIDAS_DO_DOMINIO_1.find((m) => m.chave === chave) ?? null;
}
