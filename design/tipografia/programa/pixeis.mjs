/**
 * A ARITMÉTICA DOS PÍXEIS DA CAPTURA (medidas 2 e 3 da rubrica).
 *
 * Funções puras sobre um mapa de píxeis `{largura, altura, dados}`, em que
 * `dados` é um `Uint8ClampedArray` RGBA como o `getImageData` o devolve. Os
 * píxeis vêm da CAPTURA e não de um desenho meu: o `regua.mjs` tira o PNG com o
 * Playwright, volta a abri-lo no navegador e lê-o com `createImageBitmap`.
 *
 * Correr este ficheiro sozinho (`node pixeis.mjs`) planta os vermelhos e os
 * verdes conhecidos de cada detetor e pára se algum deles não for visto. Não há
 * medida deste ficheiro que não tenha passado por essa porta.
 */

/* ------------------------------------------------------------------------ *
 * A COBERTURA: quanto de tinta há em cada píxel
 * ------------------------------------------------------------------------ */

/**
 * Converte RGBA em cobertura de tinta entre 0 e 1, com o papel a 0 e a tinta a
 * 1. O papel e a tinta não são adivinhados: entram medidos da própria página
 * (`--paper` e `--ink`), convertidos em luminância relativa.
 *
 * @param {{largura:number, altura:number, dados:Uint8ClampedArray|number[]}} img
 * @param {{papel:number, tinta:number}} escala luminâncias 0..255
 * @returns {Float32Array} cobertura, uma por píxel
 */
export function cobertura(img, escala) {
  const { largura, altura, dados } = img;
  const fora = new Float32Array(largura * altura);
  const { papel, tinta } = escala;
  const intervalo = papel - tinta;
  if (intervalo <= 0) throw new Error('o papel tem de ser mais claro do que a tinta.');
  for (let i = 0, p = 0; i < fora.length; i++, p += 4) {
    // luma perceptual, a mesma que a régua de contraste do sítio usa para o cinzento
    const l = 0.2126 * dados[p] + 0.7152 * dados[p + 1] + 0.0722 * dados[p + 2];
    let c = (papel - l) / intervalo;
    if (c < 0) c = 0;
    if (c > 1) c = 1;
    fora[i] = c;
  }
  return fora;
}

/* ------------------------------------------------------------------------ *
 * MEDIDA 2 · o traço mais fino, e se desaparece
 * ------------------------------------------------------------------------ */

/**
 * O TRAÇO MAIS FINO E O TRAÇO MAIS PÁLIDO.
 *
 * Percorre cada linha de píxeis e parte-a em CORRIDAS: trechos seguidos em que
 * há alguma tinta (cobertura acima de `limiarTenue`). De cada corrida guarda-se
 *
 *   · a largura, em píxeis;
 *   · o pico de cobertura, que é o máximo de tinta que essa corrida chega a ter.
 *
 * Duas coisas saem daqui, e são coisas diferentes:
 *
 *   `traco_mais_fino_px` — a menor largura entre as corridas que chegam a ser
 *   TINTA A SÉRIO (pico ≥ `limiarSolido`, por omissão 0,5). É a espessura do
 *   traço mais fino que o ecrã de facto desenha.
 *
 *   `pico_mais_palido` — o menor pico entre TODAS as corridas. Uma corrida cujo
 *   pico nunca chega a 0,5 é um traço que o ecrã não conseguiu pousar: existe no
 *   desenho e no ecrã é um cinzento. É isto que a rubrica chama «e se
 *   desaparece», e a resposta é `desaparece: true` quando esse pico fica abaixo
 *   de `limiarSolido`.
 *
 * Corridas de um píxel com pico muito baixo são a borda de qualquer letra
 * suavizada, e não um traço: por isso a contagem de «desaparece» exige que a
 * corrida tenha pelo menos `larguraMinima` píxeis (2 por omissão), que é o que
 * separa um fio de uma franja de antialiasing.
 *
 * NOS DOIS SENTIDOS, E NÃO SÓ AO LONGO DAS LINHAS. Uma primeira versão deste
 * detetor varria só as linhas, e o caso conhecido apanhou-a: uma barra
 * horizontal de 3 px de espessura era lida como um traço de 36 px, porque ao
 * longo da linha ela mede 36. Uma corrida horizontal mede a espessura dos
 * traços VERTICAIS; para os horizontais é preciso varrer as colunas. O traço
 * mais fino é o mínimo dos dois varrimentos, e é por isso que este ficheiro
 * planta os vermelhos antes de dizer um número.
 *
 * VÁRIOS RECORTES, UMA SÓ AMOSTRA. `img` pode ser um recorte ou uma lista
 * deles, e nesse caso as corridas de todos entram no mesmo saco. Numa página o
 * maior bloco só de algarismos é uma figura de uma linha, com meia dúzia de
 * corridas de um píxel: uma mediana sobre seis corridas não é uma mediana. Com
 * as figuras todas da página juntas, a amostra passa a ter tamanho, e cada
 * píxel continua a ser um píxel capturado e não um desenho meu.
 *
 * @param {object|object[]} img um recorte, ou vários
 * @param {{papel:number, tinta:number}} escala
 * @param {{limiarTenue?:number, limiarSolido?:number, larguraMinima?:number}} [op]
 */
export function traçoMaisFino(img, escala, op = {}) {
  const limiarTenue = op.limiarTenue ?? 0.06;
  const limiarSolido = op.limiarSolido ?? 0.5;
  const larguraMinima = op.larguraMinima ?? 2;
  const recortes = Array.isArray(img) ? img : [img];

  let finoSolido = Infinity;
  let picoMaisPalido = Infinity;
  let corridas = 0;
  let corridasSolidas = 0;
  const larguras = [];
  const picosDe1px = [];
  const picosLargos = [];

  /**
   * Varre uma linha ou uma coluna. `n` é o comprimento do varrimento e `em`
   * devolve o índice do píxel k desse varrimento.
   */
  const varre = (n, em) => {
    let k = 0;
    while (k < n) {
      if (cob[em(k)] <= limiarTenue) { k++; continue; }
      const inicio = k;
      let pico = 0;
      while (k < n && cob[em(k)] > limiarTenue) {
        const c = cob[em(k)];
        if (c > pico) pico = c;
        k++;
      }
      const w = k - inicio;
      corridas++;
      if (w === 1) picosDe1px.push(pico);
      if (w >= larguraMinima) {
        picosLargos.push(pico);
        if (pico < limiarSolido && pico < picoMaisPalido) picoMaisPalido = pico;
      }
      if (pico >= limiarSolido) {
        corridasSolidas++;
        larguras.push(w);
        if (w < finoSolido) finoSolido = w;
      }
    }
  };

  let cob = null, largura = 0, altura = 0;
  for (const r of recortes) {
    cob = cobertura(r, escala); largura = r.largura; altura = r.altura;
    for (let y = 0; y < altura; y++) varre(largura, (x) => y * largura + x);
    for (let x = 0; x < largura; x++) varre(altura, (y) => y * largura + x);
  }
  larguras.sort((a, b) => a - b);
  const p05 = larguras.length
    ? larguras[Math.min(larguras.length - 1, Math.floor(larguras.length * 0.05))]
    : null;

  /**
   * O NÚMERO QUE SEPARA AS FAMÍLIAS, E O QUE NÃO SEPARA NENHUMA.
   *
   * A 17 px e 1× o traço sólido mais fino é UM PÍXEL em todas as serifas que
   * este estudo mediu, e o pico mais pálido é a franja de qualquer curva: os
   * dois números são iguais para toda a gente e não dizem nada sobre nenhuma.
   * O que difere é QUANTA TINTA cabe nesse píxel. Uma haste que o navegador
   * pousa a 85% imprime-se; a mesma haste a 35% é um cinzento com a forma de
   * uma letra.
   *
   * `pico_mediano_1px` é a mediana do pico das corridas de um só píxel: é a
   * espessura efetiva do traço fino desta família neste tamanho. `desaparece`
   * passa a ser essa mediana abaixo de meio, e não a existência de uma franja
   * pálida algures na imagem, que existe sempre.
   */
  const mediana = (a) => {
    if (!a.length) return null;
    const b = [...a].sort((x, y) => x - y);
    const m = b.length >> 1;
    return +(b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2).toFixed(4);
  };
  const picoMediano1px = mediana(picosDe1px);
  const palidas = picosLargos.filter((p) => p < limiarSolido).length;
  return {
    recortes: recortes.length,
    corridas,
    corridas_solidas: corridasSolidas,
    traco_mais_fino_px: Number.isFinite(finoSolido) ? finoSolido : null,
    traco_fino_p05_px: p05,
    corridas_de_1px: picosDe1px.length,
    pico_mediano_1px: picoMediano1px,
    pico_mais_palido: Number.isFinite(picoMaisPalido) ? +picoMaisPalido.toFixed(4) : null,
    fracao_corridas_palidas: picosLargos.length
      ? +(palidas / picosLargos.length).toFixed(4) : null,
    desaparece: picoMediano1px !== null && picoMediano1px < limiarSolido,
    limiares: { limiarTenue, limiarSolido, larguraMinima },
  };
}

/* ------------------------------------------------------------------------ *
 * MEDIDA 3 · a abertura, medida no estrangulamento
 * ------------------------------------------------------------------------ */

/**
 * A DISTÂNCIA DE CADA PÍXEL DE PAPEL À TINTA MAIS PRÓXIMA (transformada de
 * distância, duas passagens, métrica de chanfro 3-4 dividida por 3).
 * A tinta vale 0. A moldura da imagem conta como fora, e não como tinta.
 */
function distanciaAoTraço(cob, largura, altura, limiar) {
  const GRANDE = 1e9;
  const d = new Float32Array(largura * altura);
  for (let i = 0; i < d.length; i++) d[i] = cob[i] >= limiar ? 0 : GRANDE;
  const p = (x, y) => y * largura + x;
  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      const i = p(x, y);
      if (d[i] === 0) continue;
      let m = d[i];
      if (x > 0) m = Math.min(m, d[i - 1] + 1);
      if (y > 0) m = Math.min(m, d[i - largura] + 1);
      if (x > 0 && y > 0) m = Math.min(m, d[i - largura - 1] + 1.3333);
      if (x < largura - 1 && y > 0) m = Math.min(m, d[i - largura + 1] + 1.3333);
      d[i] = m;
    }
  }
  for (let y = altura - 1; y >= 0; y--) {
    for (let x = largura - 1; x >= 0; x--) {
      const i = p(x, y);
      if (d[i] === 0) continue;
      let m = d[i];
      if (x < largura - 1) m = Math.min(m, d[i + 1] + 1);
      if (y < altura - 1) m = Math.min(m, d[i + largura] + 1);
      if (x < largura - 1 && y < altura - 1) m = Math.min(m, d[i + largura + 1] + 1.3333);
      if (x > 0 && y < altura - 1) m = Math.min(m, d[i + largura - 1] + 1.3333);
      d[i] = m;
    }
  }
  return d;
}

/**
 * A ABERTURA DE UM GLIFO: QUANTO TEM O TRAÇO DE ENGORDAR ATÉ A GARGANTA FECHAR.
 *
 * O que é a abertura de um «e»: a garganta entre o remate de baixo e a barra.
 * Quem lê a letra a 17 px vê essa garganta fechar-se ou manter-se aberta.
 *
 * A DEFINIÇÃO. Engorda-se a tinta de um raio `r` (é a transformada de distância:
 * a tinta a `r` é o conjunto dos píxeis a distância ≤ `r` do traço) e vê-se o
 * papel que continua ligado à moldura. A abertura fecha no primeiro `r` em que
 * um pedaço de papel que ESTAVA ligado à moldura deixa de estar. A abertura é a
 * folga que esse `r` tapou.
 *
 * PORQUE NÃO É O CAMINHO MAIS LARGO ATÉ FORA, que foi a primeira versão. Essa
 * procurava a semente no papel mais largo dentro da caixa da tinta, e o caso
 * conhecido do «o» apanhou-a: entre a pança redonda e os cantos da caixa
 * retangular há papel, esse papel está ligado à moldura, e a 3× é largo. A
 * régua semeava num canto, saía direita para fora e devolvia um número para uma
 * letra que não tem abertura nenhuma. A 1× os cantos eram pequenos e o erro não
 * aparecia; foi a densidade que o mostrou.
 *
 * Esta definição não tem semente. Os cantos nunca se selam, porque são o lado de
 * fora; o olho do «e» e a pança do «a» já estão selados no princípio e por isso
 * nunca contam como fecho; e o que conta é só o que estava aberto e fechou, que
 * é a garganta.
 *
 * Devolve `null` quando nada fecha: a letra não tem abertura (um «o»), e isso
 * diz-se com `null` e não com um zero, que se leria como uma abertura fechada.
 */
export function abertura(img, escala, op = {}) {
  const limiar = op.limiar ?? 0.5;
  /* Quantos píxeis de papel têm de ficar selados para se dizer que a garganta
     fechou. Três é o que separa um fecho de um píxel de antialiasing que muda de
     lado. A 17 px e 1× uma garganta inteira tem poucos píxeis, e por isso a
     régua devolve `null` nesse tamanho quase sempre: não é «não tem abertura»,
     é «não cabe na grelha», e a leitura da tabela diz isso. */
  const minimoSelado = op.minimoSelado ?? 3;
  const cob = cobertura(img, escala);
  const { largura, altura } = img;
  const n = largura * altura;

  let x0 = largura, x1 = -1, y0 = altura, y1 = -1;
  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      if (cob[y * largura + x] >= limiar) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return { abertura_px: null, razao: 'nenhuma tinta na imagem' };

  const dist = distanciaAoTraço(cob, largura, altura, limiar);

  /** O papel ligado à moldura quando a tinta está engordada de `r`. */
  const ligadoAMoldura = (r) => {
    const visto = new Uint8Array(n);
    const pilha = [];
    const empurra = (x, y) => {
      const i = y * largura + x;
      if (!visto[i] && dist[i] > r) { visto[i] = 1; pilha.push(i); }
    };
    for (let x = 0; x < largura; x++) { empurra(x, 0); empurra(x, altura - 1); }
    for (let y = 0; y < altura; y++) { empurra(0, y); empurra(largura - 1, y); }
    while (pilha.length) {
      const i = pilha.pop();
      const x = i % largura, y = (i - x) / largura;
      if (x > 0) empurra(x - 1, y);
      if (x < largura - 1) empurra(x + 1, y);
      if (y > 0) empurra(x, y - 1);
      if (y < altura - 1) empurra(x, y + 1);
    }
    return visto;
  };

  const aberto0 = ligadoAMoldura(0);

  /* Os raios a experimentar são os valores que a transformada de facto tem,
     por ordem: entre dois valores consecutivos nada muda, e experimentar
     números redondos seria inventar uma precisão que a grelha não tem. */
  const raios = [...new Set(Array.from(dist).filter((d) => d > 0 && d < 1e8))]
    .sort((a, b) => a - b)
    .filter((r) => r <= Math.max(largura, altura) / 2);

  for (const r of raios) {
    const abertoR = ligadoAMoldura(r);
    let selados = 0;
    for (let y = y0 + 1; y <= y1 - 1; y++) {
      for (let x = x0 + 1; x <= x1 - 1; x++) {
        const i = y * largura + x;
        if (dist[i] > r && aberto0[i] && !abertoR[i]) selados++;
      }
    }
    if (selados >= minimoSelado) {
      /* O DESCONTO DE UM PÍXEL, E NÃO É UM AJUSTE PARA O NÚMERO SAIR BONITO.
         A transformada mede de CENTRO a CENTRO. Uma folga de n píxeis de papel
         fecha quando o raio chega a (n+1)/2, e o dobro disso é n+1 e não n. O
         erro é constante, é de um píxel, e é a diferença entre contar centros e
         contar folgas. Os casos conhecidos leem exatamente 5 e exatamente 11
         com este desconto, e sem tolerância nenhuma. */
      return {
        abertura_px: +(r * 2 - 1).toFixed(3),
        raio_que_fecha_px: +r.toFixed(3),
        pixeis_selados: selados,
        caixa_da_tinta: { x0, y0, x1, y1, largura: x1 - x0 + 1, altura: y1 - y0 + 1 },
      };
    }
  }
  return {
    abertura_px: null,
    razao: 'nada se selou: a letra não tem garganta aberta (contraforma fechada ou nenhuma)',
    caixa_da_tinta: { x0, y0, x1, y1, largura: x1 - x0 + 1, altura: y1 - y0 + 1 },
  };
}

/* ------------------------------------------------------------------------ *
 * OS VERMELHOS PLANTADOS
 * ------------------------------------------------------------------------ */

/** Um mapa de píxeis a cinzento, do papel do sítio à tinta do sítio. */
function tela(largura, altura, papel = 246) {
  const dados = new Uint8ClampedArray(largura * altura * 4);
  for (let i = 0; i < largura * altura; i++) {
    dados[i * 4] = papel; dados[i * 4 + 1] = papel; dados[i * 4 + 2] = papel;
    dados[i * 4 + 3] = 255;
  }
  return { largura, altura, dados };
}

function pinta(img, x, y, valor) {
  if (x < 0 || y < 0 || x >= img.largura || y >= img.altura) return;
  const p = (y * img.largura + x) * 4;
  img.dados[p] = valor; img.dados[p + 1] = valor; img.dados[p + 2] = valor;
}

/** Uma barra horizontal cheia, de `espessura` píxeis, com a cobertura pedida. */
function barra(img, y, altura, cobAlvo, papel = 246, tinta = 23) {
  const v = Math.round(papel - cobAlvo * (papel - tinta));
  for (let yy = y; yy < y + altura; yy++) {
    for (let x = 2; x < img.largura - 2; x++) pinta(img, x, yy, v);
  }
}

const ESCALA = { papel: 246, tinta: 23 };

function exige(condicao, mensagem) {
  if (!condicao) { console.error('FALHOU: ' + mensagem); process.exitCode = 1; return false; }
  console.log('  visto: ' + mensagem);
  return true;
}

export function provas() {
  console.log('MEDIDA 2 · o traço mais fino, e se desaparece');

  // VERDE conhecido: uma barra de 3 px, cheia. O detetor tem de dizer 3 e não «desaparece».
  {
    const img = tela(40, 20);
    barra(img, 8, 3, 1.0);
    const r = traçoMaisFino(img, ESCALA);
    exige(r.traco_mais_fino_px === 3,
      `uma barra de 3 px cheia mede 3 px (mediu ${r.traco_mais_fino_px})`);
    exige(r.desaparece === false,
      `uma barra cheia não desaparece (desaparece=${r.desaparece})`);
  }

  // VERMELHO PLANTADO: um fio de 2 px com 30% de cobertura, ao lado de uma barra
  // cheia. O detetor tem de o apanhar como pálido e dizer que desaparece.
  {
    const img = tela(40, 24);
    barra(img, 4, 3, 1.0);
    barra(img, 14, 2, 0.30);
    const r = traçoMaisFino(img, ESCALA);
    /* `desaparece` fala das corridas de UM píxel, e este fio tem dois: o que
       tem de o apanhar é a fração de corridas pálidas e o pico mais pálido. */
    exige(r.fracao_corridas_palidas !== null && r.fracao_corridas_palidas > 0,
      `um fio plantado a 30% aparece na fração de corridas pálidas (${r.fracao_corridas_palidas})`);
    exige(r.pico_mais_palido !== null && Math.abs(r.pico_mais_palido - 0.30) < 0.03,
      `o pico do fio plantado lê-se ~0,30 (leu ${r.pico_mais_palido})`);
    exige(r.traco_mais_fino_px === 3,
      `e o traço sólido mais fino continua a ser a barra de 3 px (leu ${r.traco_mais_fino_px})`);
  }

  // VERMELHO ao contrário: um detetor que dissesse sempre «desaparece» seria
  // igualmente inútil. Uma imagem só com traços cheios tem de dar falso.
  {
    const img = tela(40, 30);
    barra(img, 4, 5, 1.0); barra(img, 14, 2, 0.95); barra(img, 22, 4, 0.8);
    const r = traçoMaisFino(img, ESCALA);
    exige(r.fracao_corridas_palidas === 0,
      `três traços cheios não têm corridas pálidas nenhumas (${r.fracao_corridas_palidas})`);
    exige(r.traco_mais_fino_px === 2,
      `e o mais fino deles é o de 2 px (leu ${r.traco_mais_fino_px})`);
  }

  // VERDE conhecido do número que separa: fios de UM píxel, uns a 90% e outros
  // a 30%. A mediana do pico das corridas de 1 px tem de os ler, e é ela que
  // decide «desaparece», e não a franja mais pálida da imagem.
  {
    const img = tela(60, 40);
    for (let y = 4; y < 20; y += 3) barra(img, y, 1, 0.9);
    const r = traçoMaisFino(img, ESCALA);
    exige(r.pico_mediano_1px !== null && Math.abs(r.pico_mediano_1px - 0.9) < 0.03,
      `fios de 1 px a 90% dão mediana ${r.pico_mediano_1px}`);
    exige(r.desaparece === false, `e não desaparecem (desaparece=${r.desaparece})`);
  }
  {
    const img = tela(60, 40);
    for (let y = 4; y < 20; y += 3) barra(img, y, 1, 0.3);
    const r = traçoMaisFino(img, ESCALA);
    exige(r.pico_mediano_1px !== null && Math.abs(r.pico_mediano_1px - 0.3) < 0.03,
      `os mesmos fios a 30% dão mediana ${r.pico_mediano_1px}`);
    exige(r.desaparece === true, `e esses desaparecem (desaparece=${r.desaparece})`);
  }

  console.log('\nMEDIDA 3 · a abertura no gargalo');

  // VERDE conhecido: um «C» de barras, com uma boca de 6 px. A abertura tem de
  // ler ~6 px, e não a largura da caixa nem zero.
  {
    const img = tela(40, 40);
    const v = 23;
    for (let x = 8; x <= 30; x++) { for (let y = 8; y < 12; y++) pinta(img, x, y, v); }
    for (let x = 8; x <= 30; x++) { for (let y = 28; y < 32; y++) pinta(img, x, y, v); }
    for (let y = 8; y <= 31; y++) { for (let x = 8; x < 12; x++) pinta(img, x, y, v); }
    // boca à direita: entre y=12 e y=28 fica papel; estreita-se com dois esporões
    for (let y = 12; y <= 18; y++) { for (let x = 27; x <= 30; x++) pinta(img, x, y, v); }
    for (let y = 24; y <= 27; y++) { for (let x = 27; x <= 30; x++) pinta(img, x, y, v); }
    const r = abertura(img, ESCALA);
    exige(r.abertura_px === 5,
      `uma boca plantada com 5 px de folga lê-se ${r.abertura_px} px, exatamente`);
  }

  // VERMELHO PLANTADO: o mesmo desenho com a boca FECHADA. O detetor tem de
  // devolver `null` e não um número: uma contraforma fechada não tem abertura.
  {
    const img = tela(40, 40);
    const v = 23;
    for (let x = 8; x <= 30; x++) { for (let y = 8; y < 12; y++) pinta(img, x, y, v); }
    for (let x = 8; x <= 30; x++) { for (let y = 28; y < 32; y++) pinta(img, x, y, v); }
    for (let y = 8; y <= 31; y++) { for (let x = 8; x < 12; x++) pinta(img, x, y, v); }
    for (let y = 8; y <= 31; y++) { for (let x = 27; x <= 30; x++) pinta(img, x, y, v); }
    const r = abertura(img, ESCALA);
    exige(r.abertura_px === null,
      `um anel fechado não tem abertura (leu ${r.abertura_px}, razão: ${r.razao})`);
  }

  // VERDE conhecido, e é o caso que a primeira versão errava: um anel FECHADO
  // por cima de uma boca ABERTA de 5 px, como o olho e a garganta de um «e». A
  // régua tem de dar a garganta (5) e ignorar o olho, que já estava selado.
  {
    const img = tela(40, 74);
    const v = 23;
    for (let x = 8; x <= 30; x++) { for (let y = 4; y < 8; y++) pinta(img, x, y, v); }
    for (let x = 8; x <= 30; x++) { for (let y = 24; y < 28; y++) pinta(img, x, y, v); }
    for (let y = 4; y <= 27; y++) { for (let x = 8; x < 12; x++) pinta(img, x, y, v); }
    for (let y = 4; y <= 27; y++) { for (let x = 27; x <= 30; x++) pinta(img, x, y, v); }
    for (let x = 8; x <= 30; x++) { for (let y = 42; y < 46; y++) pinta(img, x, y, v); }
    for (let x = 8; x <= 30; x++) { for (let y = 62; y < 66; y++) pinta(img, x, y, v); }
    for (let y = 42; y <= 65; y++) { for (let x = 8; x < 12; x++) pinta(img, x, y, v); }
    for (let y = 46; y <= 52; y++) { for (let x = 27; x <= 30; x++) pinta(img, x, y, v); }
    for (let y = 58; y <= 61; y++) { for (let x = 27; x <= 30; x++) pinta(img, x, y, v); }
    const r = abertura(img, ESCALA);
    exige(r.abertura_px === 5,
      `com um olho fechado ao lado, a garganta de 5 px continua a ler ${r.abertura_px} px`);
  }

  // VERMELHO de escala: a mesma boca com o dobro do tamanho tem de dar o dobro.
  {
    const img = tela(80, 80);
    const v = 23;
    for (let x = 16; x <= 60; x++) { for (let y = 16; y < 24; y++) pinta(img, x, y, v); }
    for (let x = 16; x <= 60; x++) { for (let y = 56; y < 64; y++) pinta(img, x, y, v); }
    for (let y = 16; y <= 63; y++) { for (let x = 16; x < 24; x++) pinta(img, x, y, v); }
    for (let y = 24; y <= 36; y++) { for (let x = 54; x <= 60; x++) pinta(img, x, y, v); }
    for (let y = 48; y <= 55; y++) { for (let x = 54; x <= 60; x++) pinta(img, x, y, v); }
    const r = abertura(img, ESCALA);
    exige(r.abertura_px === 11,
      `a mesma boca com 11 px de folga lê-se ${r.abertura_px} px, exatamente`);
  }

  if (process.exitCode) {
    console.error('\nUM DETETOR NÃO VIU O SEU CASO CONHECIDO. Nenhuma medida deste ficheiro vale.');
  } else {
    console.log('\nOs treze casos conhecidos foram vistos. Os detetores medem.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) provas();
