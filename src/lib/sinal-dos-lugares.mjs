/**
 * ===========================================================================
 * O SINAL DA PORTA DOS LUGARES: o contorno do país (bloco L2a, 01.10.2026)
 * ===========================================================================
 *
 * PORQUE EXISTE. A §1.149 tira o mapa inteiro da primeira página, porque ele é
 * de «Lugares» (uma coisa, um lugar, §1.143), e dá à porta «Lugares» do índice
 * dos assuntos um mapa pequeno como sinal: o contorno do país, estático, sem
 * dados e sem legenda de valores. O índice é o mesmo na primeira página e na
 * página dos temas, e por isso o sinal vive nas duas.
 *
 * O DESENHO NÃO SE ESCREVE: SAI DO ARTEFACTO. As linhas são as das mesmas 29
 * unidades de `mapa/pais.json` que o mapa inteiro desenha, lidas pela mesma
 * porta (`paisDoMapa()`), com as duas molduras arrumadas pela mesma função
 * (`arrumacaoDasMolduras()`). É a geometria da Carta Administrativa, e por isso
 * o sinal leva a mesma menção da fonte que o mapa: a única obrigação da licença
 * da CAOP, que a Emenda 20e manda escrever onde o desenho está.
 *
 * PORQUE ISTO NÃO VIVE EM `mapa.mjs`. Esse ficheiro diz de si que não calcula
 * geometria nem simplifica nada, e é verdade; este simplifica, e di-lo. O que
 * se simplifica é um desenho de quarenta píxeis de largura, onde um píxel são
 * cento e cinquenta unidades do campo: o mapa inteiro continua a ser byte a
 * byte o que o motor exportou.
 *
 * O CONTORNO É A FRONTEIRA DA UNIÃO, E LÊ-SE PELAS ARESTAS. As unidades
 * vizinhas partilham as fronteiras ponto a ponto, porque o motor as
 * simplificou juntas, e cada fronteira interior aparece duas vezes, uma em cada
 * sentido. As arestas que não têm a sua gémea inversa são a costa, a raia e as
 * ilhas; encadeiam-se em linhas, e só essas se desenham. Uma fronteira interior
 * que o motor não tivesse partilhado ponto a ponto apareceria aqui como um
 * traço dentro do país, e é isso que a célula do sinal mede antes de o dar
 * por bom.
 *
 * O TAMANHO DECIDE A SIMPLIFICAÇÃO, E NENHUM NÚMERO DA GEOMETRIA É ESCRITO. A
 * tolerância (Douglas-Peucker) e o passo da grelha para onde os pontos se
 * arredondam medem-se em unidades do campo e vêm de quem desenha, a partir da
 * largura em píxeis a que o sinal se rende. Uma ilha que se reduza a menos de
 * três pontos distintos fica como um ponto do tamanho do traço, e não sai.
 */

import { paisDoMapa, arrumacaoDasMolduras } from './mapa.mjs';

/**
 * Os anéis de um caminho do artefacto, em coordenadas absolutas.
 *
 * O FORMATO É O QUE O MANIFESTO DECLARA, e só esse: «M x y l dx dy,… Z,
 * inteiros, l relativo». Um símbolo fora dele fecha a construção, porque um
 * caminho lido pela metade daria um contorno errado sem aviso nenhum.
 *
 * @param {string} d
 * @returns {[number, number][][]}
 */
export function aneisDoCaminho(d) {
  const simbolos = [...d.matchAll(/([MlZ])|(-?\d+)|([^\s,])/g)];
  /** @type {[number, number][][]} */
  const aneis = [];
  /** @type {[number, number][] | null} */
  let anel = null;
  let modo = '';
  let x = 0;
  let y = 0;
  const numero = (/** @type {number} */ i) => {
    const m = simbolos[i];
    if (!m || m[2] === undefined) {
      throw new Error(`sinal dos lugares: o caminho não é «M x y l dx dy,… Z» perto do símbolo ${i}.`);
    }
    return Number(m[2]);
  };
  for (let i = 0; i < simbolos.length; ) {
    const m = simbolos[i];
    if (m[3] !== undefined) {
      throw new Error(`sinal dos lugares: o caminho traz «${m[3]}», que o formato do manifesto não conhece.`);
    }
    if (m[1] === 'M') {
      x = numero(i + 1);
      y = numero(i + 2);
      anel = [[x, y]];
      aneis.push(anel);
      modo = 'M';
      i += 3;
    } else if (m[1] === 'l') {
      modo = 'l';
      i += 1;
    } else if (m[1] === 'Z') {
      modo = '';
      i += 1;
    } else if (modo === 'l' && anel) {
      x += numero(i);
      y += numero(i + 1);
      anel.push([x, y]);
      i += 2;
    } else {
      throw new Error(`sinal dos lugares: um número fora de um «l», no símbolo ${i}.`);
    }
  }
  return aneis;
}

/**
 * Douglas-Peucker sobre uma linha, sem recursão; os dois extremos ficam sempre.
 *
 * @param {[number, number][]} pontos
 * @param {number} tolerancia em unidades do campo
 * @returns {[number, number][]}
 */
function simplifica(pontos, tolerancia) {
  if (pontos.length < 3) return pontos;
  const fica = new Uint8Array(pontos.length);
  fica[0] = 1;
  fica[pontos.length - 1] = 1;
  /** @type {[number, number][]} */
  const pilha = [[0, pontos.length - 1]];
  while (pilha.length) {
    const [a, b] = /** @type {[number, number]} */ (pilha.pop());
    const [x1, y1] = pontos[a];
    const [x2, y2] = pontos[b];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const comprimento = Math.hypot(dx, dy);
    let maior = -1;
    let qual = -1;
    for (let i = a + 1; i < b; i++) {
      const [x, y] = pontos[i];
      const distancia =
        comprimento === 0 ? Math.hypot(x - x1, y - y1) : Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / comprimento;
      if (distancia > maior) {
        maior = distancia;
        qual = i;
      }
    }
    if (maior > tolerancia) {
      fica[qual] = 1;
      pilha.push([a, qual], [qual, b]);
    }
  }
  return pontos.filter((_, i) => fica[i] === 1);
}

/**
 * O CONTORNO DO PAÍS, pronto a desenhar num `<svg>` de `largura` por `altura`.
 *
 * @param {{ passo: number, tolerancia: number, folga: number }} opcoes
 *   `passo` e `tolerancia` em unidades do campo; `folga` é a das molduras, a
 *   mesma conta que o mapa inteiro faz, para que o sinal seja esse mapa em
 *   pequeno.
 * @returns {{
 *   largura: number,
 *   altura: number,
 *   d: string,
 *   molduras: [number, number, number, number][],
 *   arestas: number,
 *   gemeas: number,
 *   fronteira: number,
 *   linhas: number,
 *   desenhadas: number,
 *   pontos: number,
 * }}
 */
export function contornoDoPais({ passo, tolerancia, folga }) {
  if (!(passo > 0) || !(tolerancia >= 0)) {
    throw new Error('sinal dos lugares: o passo tem de ser positivo e a tolerância não pode ser negativa.');
  }
  const pais = paisDoMapa();
  const molduras = arrumacaoDasMolduras(pais, folga);
  /** @param {string} parcela */
  const deslocacao = (parcela) => molduras.find((m) => m.parcela === parcela)?.dy ?? 0;

  /* AS ARESTAS DAS 29 UNIDADES, com as molduras já arrumadas: a translação é a
     mesma que o mapa inteiro aplica a cada parcela. */
  /** @type {[number, number, number, number][]} */
  const arestas = [];
  for (const u of pais.unidades) {
    const dy = deslocacao(u.parcela);
    for (const anel of aneisDoCaminho(u.d)) {
      for (let i = 0; i < anel.length; i++) {
        const [x1, y1] = anel[i];
        const [x2, y2] = anel[(i + 1) % anel.length];
        if (x1 === x2 && y1 === y2) continue;
        arestas.push([x1, y1 + dy, x2, y2 + dy]);
      }
    }
  }
  const chave = (/** @type {number} */ a, /** @type {number} */ b, /** @type {number} */ c, /** @type {number} */ d) =>
    `${a},${b},${c},${d}`;
  const todas = new Set(arestas.map(([a, b, c, d]) => chave(a, b, c, d)));
  const fronteira = arestas.filter(([a, b, c, d]) => !todas.has(chave(c, d, a, b)));

  /* AS ARESTAS DA FRONTEIRA ENCADEADAS EM LINHAS, pela ordem do artefacto. */
  /** @type {Map<string, number[]>} */
  const saidas = new Map();
  fronteira.forEach(([a, b], i) => {
    const k = `${a},${b}`;
    const lista = saidas.get(k);
    if (lista) lista.push(i);
    else saidas.set(k, [i]);
  });
  const usada = new Uint8Array(fronteira.length);
  /** @type {[number, number][][]} */
  const linhas = [];
  for (let inicio = 0; inicio < fronteira.length; inicio++) {
    if (usada[inicio]) continue;
    /** @type {[number, number][]} */
    const linha = [[fronteira[inicio][0], fronteira[inicio][1]]];
    let atual = inicio;
    while (atual >= 0 && !usada[atual]) {
      usada[atual] = 1;
      const [, , c, d] = fronteira[atual];
      linha.push([c, d]);
      atual = (saidas.get(`${c},${d}`) ?? []).find((j) => !usada[j]) ?? -1;
    }
    linhas.push(linha);
  }

  /* SIMPLIFICADAS, ARREDONDADAS À GRELHA E ESCRITAS no formato do artefacto. */
  const q = (/** @type {number} */ v) => Math.round(v / passo);
  let pontos = 0;
  const pedacos = [];
  for (const linha of linhas) {
    const fechada = linha.length > 2 && linha[0][0] === linha[linha.length - 1][0] && linha[0][1] === linha[linha.length - 1][1];
    /** @type {[number, number][]} */
    const grelha = [];
    for (const [x, y] of simplifica(linha, tolerancia)) {
      const p = /** @type {[number, number]} */ ([q(x), q(y)]);
      const ultimo = grelha[grelha.length - 1];
      if (!ultimo || ultimo[0] !== p[0] || ultimo[1] !== p[1]) grelha.push(p);
    }
    if (fechada) {
      while (grelha.length > 1 && grelha[0][0] === grelha[grelha.length - 1][0] && grelha[0][1] === grelha[grelha.length - 1][1]) grelha.pop();
    }
    /* UMA ILHA PEQUENA FICA COMO UM PONTO, E NÃO DESAPARECE. Abaixo de três
       pontos distintos um anel deixa de ter área à escala do sinal, e é a forma
       de um mapa pequeno: o que é menor do que o traço desenha-se com o tamanho
       do traço. Sai aberto, porque um caminho fechado não leva as pontas
       redondas da folha, e é a ponta que faz o ponto. */
    const fecha = fechada && grelha.length >= 3;
    pontos += grelha.length;
    const pares = [];
    for (let i = 1; i < grelha.length; i++) {
      const dx = grelha[i][0] - grelha[i - 1][0];
      const dy = grelha[i][1] - grelha[i - 1][1];
      pares.push(dy < 0 ? `${dx}${dy}` : `${dx} ${dy}`);
    }
    if (!pares.length) pares.push('0 0');
    pedacos.push(`M${grelha[0][0]} ${grelha[0][1]}l${pares.join(',')}${fecha ? 'Z' : ''}`);
  }

  return {
    largura: Math.ceil(pais.campo.largura / passo),
    altura: Math.ceil(pais.campo.altura / passo),
    d: pedacos.join(''),
    molduras: molduras.map((m) => /** @type {[number, number, number, number]} */ (m.desenho.map(q))),
    arestas: arestas.length,
    gemeas: arestas.length - fronteira.length,
    fronteira: fronteira.length,
    linhas: linhas.length,
    desenhadas: pedacos.length,
    pontos,
  };
}
