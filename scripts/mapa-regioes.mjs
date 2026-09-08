#!/usr/bin/env node
/**
 * =============================================================================
 * A GEOMETRIA DAS NOVE REGIÕES, CALCULADA DOS CONCELHOS QUE A CASA JÁ TEM
 * =============================================================================
 *
 * Escreve `src/data/mapa-regioes.gerado.json` (o nível do país: uma área por
 * região) e `public/dados/mapa/regiao-<slug>.json` (o nível da região: os seus
 * concelhos, um a um). Corre na cadeia do `build`, antes do `astro build`, e o
 * portão `check:mapa` reconfere o que ele escreveu com um leitor próprio.
 *
 *   node scripts/mapa-regioes.mjs            escreve os ficheiros
 *   node scripts/mapa-regioes.mjs --verifica não escreve nada, e sai com 1 se
 *                                            o que está no disco não for o que
 *                                            as fontes dão
 *
 * ---------------------------------------------------------------------------
 * NENHUM NÚMERO DESTE FICHEIRO É ESCRITO À MÃO, E AS TRÊS FONTES SÃO ESTAS
 * ---------------------------------------------------------------------------
 *   1. `mapa/distritos/<unidade>.json`, os 308 concelhos da CAOP 2025 com o seu
 *      caminho, cada unidade na sua grelha local. É o que o motor exportou, e a
 *      geometria da região não é mais do que a união dos seus concelhos.
 *   2. `mapa/pais.json`, as 29 unidades no campo do desenho. Dele vem a CAIXA de
 *      cada unidade, que é o que leva a grelha local de volta ao campo comum.
 *   3. `public/dados/caop-2025-municipios-*.csv`, uma linha por concelho com a
 *      coluna `nuts2` tal como a Carta a escreve. É de lá, e de lado nenhum, que
 *      sai a região de cada concelho. Os três ficheiros trazem no cabeçalho o
 *      zip de origem, o seu sha256 e a camada de onde foram lidos.
 *
 * A LISTA DAS NOVE REGIÕES é `src/data/regioes.mjs`, com o seu `slug` e o seu
 * `codigo` NUTS II. Nenhuma região é escrita aqui, e uma que a Carta traga e a
 * lista não tenha (ou o contrário) fecha a corrida.
 *
 * ---------------------------------------------------------------------------
 * A CONTA, PASSO A PASSO
 * ---------------------------------------------------------------------------
 * a) DE VOLTA AO CAMPO COMUM. A grelha local de uma unidade é a sua caixa no
 *    campo do desenho, esticada para caber num campo de 2000 unidades no lado
 *    maior; os dois espaços são o mesmo espaço com outra escala. O ajuste é de
 *    caixa para caixa, e é medido e não suposto: a caixa dos concelhos de cada
 *    unidade na grelha local vai para a caixa da unidade em `pais.json`. O
 *    resíduo de cada ajuste fica escrito no ficheiro gerado.
 *
 * b) A UNIÃO, PELAS ARESTAS QUE SE ANULAM. Dois concelhos vizinhos da mesma
 *    unidade partilham a fronteira ponto por ponto, e o mesmo segmento aparece
 *    nos dois em sentidos opostos. Anular cada par de arestas inversas deixa só
 *    a fronteira de fora, e costurá-la dá os anéis da união. Não há aqui
 *    aritmética de recorte nenhuma: é a topologia da própria Carta, e por isso
 *    a conta é exacta enquanto a Carta o for. A área da união é comparada com a
 *    soma das áreas dos concelhos, e a corrida fecha se as duas discordarem.
 *
 * c) AS UNIDADES CORTADAS. Uma região não é um conjunto de unidades inteiras
 *    (Aveiro reparte-se pelo Norte e pelo Centro), e por isso a união faz-se
 *    unidade a unidade, sobre os concelhos daquela unidade que são daquela
 *    região, e os pedaços juntam-se depois como subcaminhos do mesmo caminho. A
 *    costura entre duas unidades não se refaz, porque as duas grelhas locais
 *    arredondam a mesma fronteira de maneiras diferentes: o desvio está medido
 *    no ficheiro gerado, em unidades do campo, e é o que separa dois pedaços que
 *    a regra de preenchimento junta na mesma.
 *
 * d) A GRELHA DE CADA REGIÃO. O nível da região desenha os seus concelhos, e
 *    fá-lo na sua própria grelha, pela mesma regra das unidades: a caixa da
 *    região no campo comum, esticada para 2000 no lado maior. Sem isso, os
 *    concelhos da Grande Lisboa (uma caixa de 300 unidades no campo do país)
 *    ficariam com trezentos pontos de resolução para trezentos píxeis de ecrã.
 *
 * ---------------------------------------------------------------------------
 * O FICHEIRO É DETERMINÍSTICO
 * ---------------------------------------------------------------------------
 * Não leva data nem hora: leva o sha256 de cada ficheiro que leu. A mesma
 * entrada dá o mesmo byte, e por isso o `build` pode reescrevê-lo sempre sem
 * sujar a árvore, e uma diferença no `git status` depois de uma construção é
 * sempre uma fonte que mudou.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { REGIOES } from '../src/data/regioes.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAPA = path.join(RAIZ, 'mapa');
const DADOS = path.join(RAIZ, 'public', 'dados');
const SAIDA = path.join(RAIZ, 'src', 'data', 'mapa-regioes.gerado.json');
const SAIDA_CLIENTE = path.join(DADOS, 'mapa');

const VERIFICA = process.argv.includes('--verifica');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** Uma paragem com a frase do que falta, e nunca um ficheiro meio escrito. */
class Falha extends Error {}

const sha256 = (b) => crypto.createHash('sha256').update(b).digest('hex');

/* ==========================================================================
 * O CAMINHO: LER E ESCREVER
 * ========================================================================== */

/**
 * Os anéis de um caminho `M x y l dx dy,… Z`, em coordenadas absolutas.
 *
 * O formato é o que `ResearchHub/publisher/MAPA.md` §1 fixa e o manifesto
 * repete: inteiros, `l` relativo, um `M…Z` por anel, o exterior no sentido
 * directo e os buracos no inverso.
 *
 * @param {string} d
 * @returns {number[][][]}
 */
export function aneisDoCaminho(d) {
  /** @type {number[][][]} */
  const aneis = [];
  /** @type {number[][] | null} */
  let anel = null;
  let i = 0;
  let cx = 0;
  let cy = 0;
  const n = d.length;
  const numero = () => {
    while (i < n && (d[i] === ' ' || d[i] === ',')) i++;
    const j0 = i;
    if (d[i] === '-' || d[i] === '+') i++;
    while (i < n && d[i] >= '0' && d[i] <= '9') i++;
    if (d[i] === '.') {
      i++;
      while (i < n && d[i] >= '0' && d[i] <= '9') i++;
    }
    if (i === j0) throw new Falha(`caminho: esperava um número na posição ${i} de "${d.slice(0, 40)}…"`);
    return Number(d.slice(j0, i));
  };
  while (i < n) {
    const c = d[i];
    if (c === 'M') {
      i++;
      cx = numero();
      cy = numero();
      anel = [[cx, cy]];
      aneis.push(anel);
    } else if (c === 'l') {
      i++;
    } else if (c === 'Z' || c === 'z') {
      i++;
      anel = null;
    } else if (c === ' ' || c === ',') {
      i++;
    } else if (c === '-' || c === '+' || c === '.' || (c >= '0' && c <= '9')) {
      if (!anel) throw new Falha('caminho: um passo antes de um "M"');
      cx += numero();
      cy += numero();
      anel.push([cx, cy]);
    } else {
      throw new Falha(`caminho: caractere inesperado ${JSON.stringify(c)} na posição ${i}`);
    }
  }
  /* Um anel que repita o primeiro ponto no fim fecha-se duas vezes: a aresta de
     comprimento zero não faz mal a ninguém, mas o ponto a mais faz, porque a
     costura das arestas conta cada vértice. */
  return aneis.map((a) => (a.length > 1 && a[0][0] === a[a.length - 1][0] && a[0][1] === a[a.length - 1][1] ? a.slice(0, -1) : a));
}

/** Um número no formato do artefacto: sem separador quando o sinal já separa. */
const junta = (v) => (v < 0 ? String(v) : ` ${v}`);

/**
 * O caminho de uma lista de anéis inteiros, na codificação do artefacto.
 *
 * @param {number[][][]} aneis
 */
export function caminhoDeAneis(aneis) {
  let d = '';
  for (const anel of aneis) {
    d += `M${anel[0][0]}${junta(anel[0][1])}l`;
    const passos = [];
    for (let k = 1; k < anel.length; k++) {
      passos.push(`${anel[k][0] - anel[k - 1][0]}${junta(anel[k][1] - anel[k - 1][1])}`);
    }
    d += `${passos.join(',')}Z`;
  }
  return d;
}

/* ==========================================================================
 * A SIMPLIFICAÇÃO, COM A TOLERÂNCIA QUE O MANIFESTO JÁ DECLARA
 * ==========================================================================
 * O caminho de uma região vem da fronteira dos seus concelhos, que é desenhada
 * com a resolução da grelha de um distrito: no campo do país isso são pontos a
 * menos de um décimo de píxel uns dos outros. O manifesto do motor declara o
 * erro que a casa aceita no ecrã (`tolerancia.erro_px`) e a coluna em que o
 * mediu (`tolerancia.coluna_px`); a tolerância de cada desenho é esse erro
 * convertido para as unidades daquele campo. Nenhum número novo: os dois vêm do
 * manifesto, e a conta está escrita no ficheiro gerado.
 */

/**
 * Douglas-Peucker sobre uma linha aberta.
 *
 * @param {number[][]} pontos
 * @param {number} epsilon
 * @returns {number[][]}
 */
function afina(pontos, epsilon) {
  if (pontos.length < 3) return pontos.slice();
  const guarda = new Uint8Array(pontos.length);
  guarda[0] = 1;
  guarda[pontos.length - 1] = 1;
  const pilha = [[0, pontos.length - 1]];
  while (pilha.length > 0) {
    const [a, b] = pilha.pop();
    if (b - a < 2) continue;
    const [xa, ya] = pontos[a];
    const [xb, yb] = pontos[b];
    const dx = xb - xa;
    const dy = yb - ya;
    const norma = Math.hypot(dx, dy);
    let pior = 0;
    let onde = -1;
    for (let i = a + 1; i < b; i++) {
      const [x, y] = pontos[i];
      const d = norma === 0
        ? Math.hypot(x - xa, y - ya)
        : Math.abs(dy * x - dx * y + xb * ya - yb * xa) / norma;
      if (d > pior) {
        pior = d;
        onde = i;
      }
    }
    if (pior > epsilon && onde > 0) {
      guarda[onde] = 1;
      pilha.push([a, onde], [onde, b]);
    }
  }
  return pontos.filter((_, i) => guarda[i] === 1);
}

/**
 * O mesmo, sobre um anel fechado: dois pontos fixos e duas metades.
 *
 * O ponto de partida de um anel é uma escolha do formato e não uma esquina do
 * território; fixar só esse ponto deixava um bico à volta dele. Fixam-se dois:
 * o primeiro, e o que está mais longe dele.
 *
 * @param {number[][]} anel
 * @param {number} epsilon
 */
function afinaAnel(anel, epsilon) {
  if (anel.length < 5) return anel;
  let oposto = 0;
  let maior = -1;
  for (let i = 1; i < anel.length; i++) {
    const d = (anel[i][0] - anel[0][0]) ** 2 + (anel[i][1] - anel[0][1]) ** 2;
    if (d > maior) {
      maior = d;
      oposto = i;
    }
  }
  const a = afina(anel.slice(0, oposto + 1), epsilon);
  const b = afina([...anel.slice(oposto), anel[0]], epsilon);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}

/** A área com sinal de um anel. @param {number[][]} anel */
function area(anel) {
  let a = 0;
  for (let k = 0; k < anel.length; k++) {
    const [x1, y1] = anel[k];
    const [x2, y2] = anel[(k + 1) % anel.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

/** A caixa `[x, y, largura, altura]` de uma lista de anéis. @param {number[][][]} aneis */
function caixaDe(aneis) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const a of aneis) {
    for (const [x, y] of a) {
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  }
  return [x0, y0, x1 - x0, y1 - y0];
}

/* ==========================================================================
 * A UNIÃO, PELAS ARESTAS QUE SE ANULAM
 * ========================================================================== */

/**
 * Os anéis da união de um conjunto de polígonos que ladrilham sem se sobrepor.
 *
 * Cada aresta interior aparece duas vezes, uma em cada sentido, e as duas
 * anulam-se; o que sobra é a fronteira, e costura-se seguindo as arestas. A
 * anulação preserva o grau de entrada e de saída de cada vértice, e por isso
 * qualquer caminhada fecha sempre sobre o ponto de partida.
 *
 * @param {number[][][]} aneis
 * @returns {number[][][]}
 */
export function uniaoPorArestas(aneis) {
  /** @type {Map<string, number>} */
  const arestas = new Map();
  const chave = (p, q) => `${p[0]},${p[1]}|${q[0]},${q[1]}`;
  for (const anel of aneis) {
    for (let k = 0; k < anel.length; k++) {
      const p = anel[k];
      const q = anel[(k + 1) % anel.length];
      if (p[0] === q[0] && p[1] === q[1]) continue;
      const c = chave(p, q);
      arestas.set(c, (arestas.get(c) ?? 0) + 1);
    }
  }
  for (const c of [...arestas.keys()]) {
    const n = arestas.get(c) ?? 0;
    if (n === 0) continue;
    const [a, b] = c.split('|');
    const inversa = `${b}|${a}`;
    const m = arestas.get(inversa) ?? 0;
    if (m === 0) continue;
    const k = Math.min(n, m);
    arestas.set(c, n - k);
    arestas.set(inversa, m - k);
  }

  /** @type {Map<string, string[]>} */
  const saidas = new Map();
  let quantas = 0;
  for (const [c, n] of arestas) {
    if (n === 0) continue;
    const [a, b] = c.split('|');
    const lista = saidas.get(a) ?? [];
    for (let k = 0; k < n; k++) lista.push(b);
    saidas.set(a, lista);
    quantas += n;
  }

  const ponto = (s) => s.split(',').map(Number);
  /** @type {number[][][]} */
  const fora = [];
  for (const inicio of [...saidas.keys()]) {
    while ((saidas.get(inicio) ?? []).length > 0) {
      const anel = [ponto(inicio)];
      let aqui = inicio;
      for (let passo = 0; ; passo++) {
        const lista = saidas.get(aqui);
        if (!lista || lista.length === 0) {
          throw new Falha(
            `união: a fronteira não fecha em ${aqui} (a Carta não ladrilha como o formato promete)`,
          );
        }
        const seguinte = lista.pop();
        if (seguinte === inicio) break;
        anel.push(ponto(seguinte));
        aqui = seguinte;
        if (passo > quantas + 1) throw new Falha('união: a costura não termina');
      }
      if (anel.length >= 3) fora.push(anel);
    }
  }
  return fora;
}

/* ==========================================================================
 * AS FONTES
 * ========================================================================== */

/** @type {Map<string, string>} os ficheiros lidos, com o seu resumo. */
const lidos = new Map();

/** @param {string} absoluto */
function leTexto(absoluto) {
  if (!fs.existsSync(absoluto)) throw new Falha(`falta ${path.relative(RAIZ, absoluto)}`);
  const bruto = fs.readFileSync(absoluto);
  lidos.set(path.relative(RAIZ, absoluto), sha256(bruto));
  return bruto.toString('utf8');
}

/** @param {string} absoluto */
const leJson = (absoluto) => JSON.parse(leTexto(absoluto));

/**
 * OS MÓDULOS QUE O GERADOR IMPORTA TAMBÉM MOLDAM A SAÍDA, E POR ISSO ENTRAM NO
 * MANIFESTO.
 *
 * `src/data/regioes.mjs` dá os nomes, os códigos, a ordem e a pertença das nove
 * regiões: uma linha mudada ali muda o ficheiro gerado, e um manifesto que só
 * apanhasse os ficheiros de dados declarava uma proveniência incompleta (leitura
 * a frio do Codex de 08.09.2026, achado 13). A lista não se escreve à mão: lê-se
 * do próprio ficheiro do gerador e segue os `import` relativos até ao fim, para
 * que um módulo novo entre sozinho no dia em que alguém o importar. O portão
 * confere a cobertura (`check-mapa.mjs`, R8).
 *
 * @param {string} entrada o ficheiro por onde a busca começa
 */
function hashaOsModulosImportados(entrada) {
  const porVer = [entrada];
  const vistos = new Set([entrada]);
  while (porVer.length > 0) {
    const abs = porVer.pop();
    const texto = abs === entrada ? fs.readFileSync(abs, 'utf8') : leTexto(abs);
    for (const m of texto.matchAll(/^\s*import\s[^'"]*['"](\.[^'"]+)['"]/gm)) {
      const seguinte = path.resolve(path.dirname(abs), m[1]);
      if (vistos.has(seguinte)) continue;
      vistos.add(seguinte);
      porVer.push(seguinte);
    }
  }
}

/**
 * A região de cada concelho, lida da coluna `nuts2` da Carta.
 *
 * OS DOIS NOMES QUE A CARTA ESCREVE POR EXTENSO. Sete das nove regiões vêm da
 * Carta com o nome que a lista da casa lhes dá; as duas autónomas vêm com a
 * forma longa («Região Autónoma dos Açores»), que é o nome oficial e não um nome
 * diferente. A correspondência das duas está declarada aqui, uma linha cada, e
 * uma décima que a Carta traga sem correspondência fecha a corrida: o que não se
 * pode ter é uma região a cair em silêncio.
 */
const NOME_LONGO_DA_CARTA = {
  'Região Autónoma dos Açores': 'Açores',
  'Região Autónoma da Madeira': 'Madeira',
};

function regiaoDeCadaConcelho() {
  const porNome = new Map();
  for (const r of REGIOES) {
    if (r.referencia) continue;
    porNome.set(r.nome.pt, r);
  }
  /** @type {Map<string, {slug: string, codigo: string}>} o dico do concelho */
  const porDico = new Map();
  const ficheiros = ['continente', 'acores', 'madeira'];
  for (const parte of ficheiros) {
    const bruto = leTexto(path.join(DADOS, `caop-2025-municipios-${parte}.csv`));
    const linhas = bruto.split('\n').filter((l) => l.trim() !== '' && !l.startsWith('#'));
    const cabecalho = linhas[0].split(',');
    const iDico = cabecalho.indexOf('dtmn');
    const iNuts = cabecalho.indexOf('nuts2');
    if (iDico < 0 || iNuts < 0) {
      throw new Falha(`caop-2025-municipios-${parte}.csv: sem as colunas "dtmn" e "nuts2"`);
    }
    for (const linha of linhas.slice(1)) {
      const campos = linha.split(',');
      const nome = campos[iNuts];
      const daCasa = porNome.get(NOME_LONGO_DA_CARTA[nome] ?? nome);
      if (!daCasa) {
        throw new Falha(
          `a Carta dá a região "${nome}" e a lista da casa (src/data/regioes.mjs) não a tem`,
        );
      }
      porDico.set(campos[iDico], { slug: daCasa.slug, codigo: daCasa.codigo });
    }
  }
  return porDico;
}

/* ==========================================================================
 * A FRONTEIRA DE UM DISTRITO É A DO ARTEFACTO, E NÃO A DOS SEUS CONCELHOS
 * ==========================================================================
 * As 29 unidades de `mapa/pais.json` ladrilham o campo do desenho ponto por
 * ponto, e os concelhos de duas unidades diferentes NÃO ladrilham entre si,
 * porque cada unidade foi desenhada na sua grelha e a mesma fronteira foi
 * arredondada de duas maneiras. As DUAS CONTAS ESTÃO MEDIDAS e vão para
 * `ajuste` no ficheiro gerado (`npm run mapa:regioes`): as arestas das 29 e as
 * que têm gémea inversa, as arestas dos 308 no campo do país e as que têm
 * gémea, e a distância entre as duas leituras da mesma fronteira, unidade a
 * unidade. A prosa desta casa dizia «1,4 u» sem medida ao lado, e a leitura a
 * frio do Codex de 08.09.2026 apanhou-o (achado 18): o número está agora no
 * ficheiro, e é maior do que essa prosa dizia.
 *
 * Por isso a região não se faz da união dos 308 concelhos no campo do país. Faz-
 * -se assim, e o resultado é uma fronteira exacta:
 *
 *   · das 29 unidades, 23 estão inteiras dentro de uma região, e para essas a
 *     peça é o próprio caminho do artefacto;
 *   · 6 repartem-se por duas regiões (Aveiro, Guarda, Leiria, Lisboa, Setúbal e
 *     Viseu, medido), e cada uma dessas tem UMA linha de corte, que é a fronteira
 *     entre os concelhos de uma região e os da outra, exacta na grelha local;
 *   · a linha de corte leva-se ao campo do país e as suas duas pontas projectam-
 *     -se no caminho do artefacto: a unidade parte-se em duas ao longo dela.
 *
 * As duas pontas entram como vértices nos caminhos das unidades vizinhas que
 * partilham aquela aresta, para que as arestas continuem a poder anular-se com a
 * gémea. Feito isso, as peças de uma região anulam as fronteiras interiores
 * umas com as outras pela mesma conta das arestas, e o que sobra é o contorno da
 * região, sem uma única costura por dentro.
 */

/** O ponto de uma posição `i + t` num anel. @param {number[][]} anel @param {number} pos */
function pontoEm(anel, pos) {
  const n = anel.length;
  const i = Math.floor(pos) % n;
  const t = pos - Math.floor(pos);
  if (t === 0) return anel[i].slice();
  const j = (i + 1) % n;
  return [anel[i][0] + (anel[j][0] - anel[i][0]) * t, anel[i][1] + (anel[j][1] - anel[i][1]) * t];
}

/**
 * O arco de um anel entre duas posições, para diante.
 *
 * @param {number[][]} anel
 * @param {number} de
 * @param {number} para
 * @returns {number[][]} do ponto de partida ao de chegada, os dois incluídos
 */
function arcoDoAnel(anel, de, para) {
  const n = anel.length;
  const fim = para > de ? para : para + n;
  const saida = [pontoEm(anel, de)];
  for (let k = Math.floor(de) + 1; k <= Math.floor(fim); k++) {
    const p = anel[k % n];
    const ultimo = saida[saida.length - 1];
    if (ultimo[0] !== p[0] || ultimo[1] !== p[1]) saida.push(p.slice());
  }
  const ultimo = saida[saida.length - 1];
  const chegada = pontoEm(anel, fim % n === 0 && fim !== de ? 0 : fim % n);
  if (ultimo[0] !== chegada[0] || ultimo[1] !== chegada[1]) saida.push(chegada);
  return saida;
}

/**
 * A posição de um ponto sobre um conjunto de anéis: o anel, a posição e a
 * distância. É por aqui que a ponta de uma linha de corte encontra o sítio onde
 * o caminho do artefacto se parte.
 *
 * @param {number[][][]} aneis
 * @param {number[]} p
 */
function projeta(aneis, p) {
  let melhor = { anel: -1, pos: 0, distancia: Infinity, ponto: p };
  for (let a = 0; a < aneis.length; a++) {
    const anel = aneis[a];
    for (let i = 0; i < anel.length; i++) {
      const [x1, y1] = anel[i];
      const [x2, y2] = anel[(i + 1) % anel.length];
      const dx = x2 - x1;
      const dy = y2 - y1;
      const l2 = dx * dx + dy * dy;
      const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - x1) * dx + (p[1] - y1) * dy) / l2));
      const q = [x1 + dx * t, y1 + dy * t];
      const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (d < melhor.distancia) melhor = { anel: a, pos: i + t, distancia: d, ponto: q };
    }
  }
  return melhor;
}

/** Um ponto dentro de um conjunto de anéis, pela paridade dos cruzamentos. */
function dentroDe(aneis, [x, y]) {
  let dentro = false;
  for (const anel of aneis) {
    for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
      const [xi, yi] = anel[i];
      const [xj, yj] = anel[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
    }
  }
  return dentro;
}

/**
 * A linha de corte de uma unidade repartida: as arestas de um grupo cuja gémea
 * inversa está no outro, costuradas numa polilinha aberta.
 *
 * @param {number[][][]} deA
 * @param {number[][][]} deB
 * @returns {number[][]}
 */
function linhaDeCorte(deA, deB) {
  const chave = (p, q) => `${p[0]},${p[1]}|${q[0]},${q[1]}`;
  const noB = new Set();
  for (const anel of deB) {
    for (let k = 0; k < anel.length; k++) {
      const p = anel[k];
      const q = anel[(k + 1) % anel.length];
      if (p[0] !== q[0] || p[1] !== q[1]) noB.add(chave(p, q));
    }
  }
  /** @type {Map<string, string[]>} */
  const saidas = new Map();
  /** @type {Map<string, number>} */
  const entradas = new Map();
  let arestas = 0;
  for (const anel of deA) {
    for (let k = 0; k < anel.length; k++) {
      const p = anel[k];
      const q = anel[(k + 1) % anel.length];
      if (p[0] === q[0] && p[1] === q[1]) continue;
      if (!noB.has(chave(q, p))) continue;
      const a = `${p[0]},${p[1]}`;
      const b = `${q[0]},${q[1]}`;
      saidas.set(a, [...(saidas.get(a) ?? []), b]);
      entradas.set(b, (entradas.get(b) ?? 0) + 1);
      arestas++;
    }
  }
  const pontas = [...saidas.keys()].filter((k) => (saidas.get(k) ?? []).length > (entradas.get(k) ?? 0));
  if (pontas.length !== 1) {
    throw new Falha(`linha de corte: ${pontas.length} pontas de partida, e a conta espera uma`);
  }
  const linha = [pontas[0].split(',').map(Number)];
  let aqui = pontas[0];
  for (let passo = 0; passo < arestas + 1; passo++) {
    const lista = saidas.get(aqui);
    if (!lista || lista.length === 0) return linha;
    const seguinte = lista.pop();
    linha.push(seguinte.split(',').map(Number));
    aqui = seguinte;
  }
  throw new Falha('linha de corte: a costura não termina');
}

/* ==========================================================================
 * A CONTA
 * ========================================================================== */

function calcula() {
  hashaOsModulosImportados(fileURLToPath(import.meta.url));
  const pais = leJson(path.join(MAPA, 'pais.json'));
  const manifesto = leJson(path.join(MAPA, 'manifest.json'));
  const concelhos = leJson(path.join(RAIZ, 'src', 'data', 'concelhos.gerado.json'));
  const regiaoDoDico = regiaoDeCadaConcelho();

  const dicoDoSlug = new Map(concelhos.map((c) => [c.slug, c.dico]));
  if (dicoDoSlug.size !== 308) throw new Falha(`concelhos.gerado.json tem ${dicoDoSlug.size} entradas, e não 308`);

  /* A TOLERÂNCIA VEM DO MANIFESTO, e a conta é a dele: o erro que a casa aceita
     no ecrã, convertido para as unidades do campo em que se está a desenhar. */
  const erroPx = manifesto.tolerancia?.erro_px;
  const colunaPx = manifesto.tolerancia?.coluna_px;
  if (typeof erroPx !== 'number' || typeof colunaPx !== 'number') {
    throw new Falha('mapa/manifest.json: sem "tolerancia.erro_px" e "tolerancia.coluna_px"');
  }
  const tolerancia = (larguraDoCampo) => (erroPx * larguraDoCampo) / colunaPx;
  const toleranciaDoPais = tolerancia(pais.campo.largura);

  /* A ORDEM DAS NOVE É A COLAÇÃO PORTUGUESA, E NÃO A DA LISTA DA CASA. Em
     `src/data/regioes.mjs` as regiões estão pela ordem em que entraram, que é a
     ordem da régua da convergência e não muda; aqui o que se escreve é o DESENHO,
     e a I84 fixou que os caminhos de um mapa e as listas que o acompanham vão na
     colação portuguesa. É a mesma ordem que `mapa/pais.json` traz para as 29. */
  const daCasa = REGIOES.filter((r) => !r.referencia).sort((a, b) => a.slug.localeCompare(b.slug, 'pt'));
  if (daCasa.length !== 9) throw new Falha(`a lista da casa tem ${daCasa.length} regiões, e não nove`);

  /* ------------------------------------------------------- as 29 unidades */
  let vistos = 0;
  let residuoDoAjuste = 0;
  const unidades = pais.unidades.map((u) => {
    const artefacto = leJson(path.join(MAPA, 'distritos', `${u.slug}.json`));
    /* O AJUSTE DE CAIXA PARA CAIXA. A caixa dos concelhos na grelha local vai
       para a caixa da unidade no campo do desenho. Mede-se a caixa em vez de se
       usar o campo declarado, porque o campo é o inteiro em que a grelha coube e
       a caixa é onde os pontos estão. */
    const locais = artefacto.concelhos.map((c) => ({ ...c, aneis: aneisDoCaminho(c.d) }));
    const caixaLocal = caixaDe(locais.flatMap((c) => c.aneis));
    const kx = u.caixa[2] / caixaLocal[2];
    const ky = u.caixa[3] / caixaLocal[3];
    residuoDoAjuste = Math.max(residuoDoAjuste, Math.abs(kx - ky) * Math.max(caixaLocal[2], caixaLocal[3]));
    const paraOCampo = ([x, y]) => [
      u.caixa[0] + (x - caixaLocal[0]) * kx,
      u.caixa[1] + (y - caixaLocal[1]) * ky,
    ];

    /** @type {Map<string, typeof locais>} */
    const grupos = new Map();
    for (const c of locais) {
      const dico = dicoDoSlug.get(c.slug);
      if (!dico) throw new Falha(`o concelho "${c.slug}" do artefacto não está em concelhos.gerado.json`);
      const r = regiaoDoDico.get(dico);
      if (!r) throw new Falha(`o concelho "${c.slug}" (dico ${dico}) não tem região na Carta`);
      grupos.set(r.slug, [...(grupos.get(r.slug) ?? []), c]);
      vistos++;
    }
    if (grupos.size > 2) {
      throw new Falha(`a unidade "${u.slug}" reparte-se por ${grupos.size} regiões, e a conta do corte espera duas`);
    }
    return { u, locais, paraOCampo, grupos, aneisDoPais: aneisDoCaminho(u.d) };
  });
  if (vistos !== 308) throw new Falha(`os artefactos deram ${vistos} concelhos, e não 308`);

  /* -------------------------------------------- o desvio entre as duas grelhas
     O NÚMERO QUE DECIDE A CONTA MEDE-SE AQUI, e não se escreve em prosa. A mesma
     fronteira existe duas vezes: no caminho da unidade em `mapa/pais.json`, e na
     união dos caminhos dos seus concelhos, que vieram da grelha local de
     `mapa/distritos/<unidade>.json`. As duas foram arredondadas em grelhas
     diferentes, e a distância entre elas é o que proíbe fazer a região da união
     dos 308 no campo do país. Mede-se assim: a união dos concelhos de cada
     unidade, e a distância de cada vértice dela ao caminho do artefacto daquela
     unidade. O maior de todos vai para `ajuste`, com o comando que o refaz.

       npm run mapa:regioes   (e o número fica em src/data/mapa-regioes.gerado.json) */
  let desvioEntreGrelhas = 0;
  let ondeODesvio = '';
  const porUnidade = [];
  const arestasDos308 = new Map();
  const chaveDeAresta = (p, q) => `${p[0]},${p[1]}|${q[0]},${q[1]}`;
  for (const d of unidades) {
    const noCampo = d.locais.flatMap((c) => c.aneis.map((a) => a.map(d.paraOCampo)));
    for (const anel of noCampo) {
      for (let k = 0; k < anel.length; k++) {
        const a = anel[k];
        const b = anel[(k + 1) % anel.length];
        if (a[0] === b[0] && a[1] === b[1]) continue;
        const c = chaveDeAresta(a, b);
        arestasDos308.set(c, (arestasDos308.get(c) ?? 0) + 1);
      }
    }
    let pior = 0;
    for (const anel of uniaoPorArestas(noCampo)) {
      for (const v of anel) pior = Math.max(pior, projeta(d.aneisDoPais, v).distancia);
    }
    porUnidade.push(pior);
    if (pior > desvioEntreGrelhas) {
      desvioEntreGrelhas = pior;
      ondeODesvio = d.u.slug;
    }
  }
  porUnidade.sort((a, b) => a - b);
  const desvioMediano = porUnidade[Math.floor(porUnidade.length / 2)];

  /* AS ARESTAS QUE SE ANULAM, DOS DOIS LADOS. As 29 unidades ladrilham ponto por
     ponto e a sua conta é a prova disso; os 308 concelhos no campo do país não,
     e a diferença entre as duas contas é a razão da conta das peças. */
  const contaDasArestas = (aneis) => {
    const arestas = new Map();
    for (const anel of aneis) {
      for (let k = 0; k < anel.length; k++) {
        const a = anel[k];
        const b = anel[(k + 1) % anel.length];
        if (a[0] === b[0] && a[1] === b[1]) continue;
        const c = chaveDeAresta(a, b);
        arestas.set(c, (arestas.get(c) ?? 0) + 1);
      }
    }
    let total = 0;
    let comGemea = 0;
    for (const [c, n] of arestas) {
      total += n;
      const [a, b] = c.split('|');
      if (arestas.has(`${b}|${a}`)) comGemea += n;
    }
    return { total, comGemea };
  };
  const das29 = contaDasArestas(unidades.flatMap((d) => d.aneisDoPais));
  let totalDos308 = 0;
  let gemeasDos308 = 0;
  for (const [c, n] of arestasDos308) {
    totalDos308 += n;
    const [a, b] = c.split('|');
    if (arestasDos308.has(`${b}|${a}`)) gemeasDos308 += n;
  }

  /* ------------------------------------- as linhas de corte das repartidas */
  const repartidas = unidades.filter((d) => d.grupos.size === 2);
  /** @type {Map<string, number[][]>} os pontos a acrescentar a cada aresta. */
  const acrescentos = new Map();
  const chaveDaAresta = (p, q) => `${p[0]},${p[1]}|${q[0]},${q[1]}`;
  let piorProjeccao = 0;
  const cortes = repartidas.map((d) => {
    const [slugA, slugB] = [...d.grupos.keys()];
    const corte = linhaDeCorte(
      d.grupos.get(slugA).flatMap((c) => c.aneis),
      d.grupos.get(slugB).flatMap((c) => c.aneis),
    ).map(d.paraOCampo);
    const inicio = projeta(d.aneisDoPais, corte[0]);
    const fim = projeta(d.aneisDoPais, corte[corte.length - 1]);
    piorProjeccao = Math.max(piorProjeccao, inicio.distancia, fim.distancia);
    if (inicio.anel !== fim.anel) {
      throw new Falha(`${d.u.slug}: as duas pontas do corte caem em anéis diferentes do artefacto`);
    }
    /* As duas pontas passam a ser vértices do anel, aqui e em qualquer unidade
       vizinha que tenha a mesma aresta ao contrário: sem isso, a aresta partida
       de um lado e inteira do outro não se anulam e fica uma espora. */
    for (const ponta of [inicio, fim]) {
      const anel = d.aneisDoPais[ponta.anel];
      const i = Math.floor(ponta.pos) % anel.length;
      const p = anel[i];
      const q = anel[(i + 1) % anel.length];
      for (const chave of [chaveDaAresta(p, q), chaveDaAresta(q, p)]) {
        acrescentos.set(chave, [...(acrescentos.get(chave) ?? []), ponta.ponto]);
      }
    }
    return { d, slugA, slugB, corte, inicio, fim };
  });

  /* Os pontos acrescentados entram em todos os anéis de todas as unidades. */
  for (const d of unidades) {
    d.aneisDoPais = d.aneisDoPais.map((anel) => {
      const novo = [];
      for (let i = 0; i < anel.length; i++) {
        const p = anel[i];
        const q = anel[(i + 1) % anel.length];
        novo.push(p);
        const extra = acrescentos.get(chaveDaAresta(p, q)) ?? [];
        if (extra.length === 0) continue;
        const ordenados = [...extra].sort(
          (a, b) => (a[0] - p[0]) ** 2 + (a[1] - p[1]) ** 2 - ((b[0] - p[0]) ** 2 + (b[1] - p[1]) ** 2),
        );
        for (const e of ordenados) {
          const ultimo = novo[novo.length - 1];
          if ((ultimo[0] !== e[0] || ultimo[1] !== e[1]) && (e[0] !== q[0] || e[1] !== q[1])) novo.push(e);
        }
      }
      return novo;
    });
  }

  /* ----------------------------------------------- as peças de cada região */
  /** @type {Map<string, {aneis: number[][][], concelhos: {slug: string, nome: string, aneis: number[][][], ponto: number[]}[], parcelas: Set<string>, unidades: string[]}>} */
  const porRegiao = new Map(
    daCasa.map((r) => [r.slug, { aneis: [], concelhos: [], parcelas: new Set(), unidades: [] }]),
  );
  for (const d of unidades) {
    for (const [slugDaRegiao, lista] of d.grupos) {
      const alvo = porRegiao.get(slugDaRegiao);
      if (!alvo) throw new Falha(`a região "${slugDaRegiao}" não está na lista da casa`);
      alvo.parcelas.add(d.u.parcela);
      alvo.unidades.push(d.u.slug);
      for (const c of lista) {
        alvo.concelhos.push({
          slug: c.slug,
          nome: c.nome,
          aneis: c.aneis.map((a) => a.map(d.paraOCampo)),
          ponto: d.paraOCampo(c.ponto),
        });
      }
    }
    if (d.grupos.size === 1) {
      const alvo = porRegiao.get([...d.grupos.keys()][0]);
      alvo.aneis.push(...d.aneisDoPais.map((a) => a.map((p) => p.slice())));
      continue;
    }

    /* A UNIDADE REPARTIDA PARTE-SE AO LONGO DO CORTE. O anel onde as duas pontas
       caem dá dois arcos, e cada um fecha com a linha de corte num sentido. Os
       outros anéis do artefacto (as ilhas de uma unidade) vão para o grupo que os
       contém, provado com um ponto de um concelho seu. */
    const c = cortes.find((x) => x.d === d);
    const anel = d.aneisDoPais[c.inicio.anel];
    const posDe = (ponta) => {
      const i = anel.findIndex((p) => p[0] === ponta.ponto[0] && p[1] === ponta.ponto[1]);
      if (i < 0) throw new Falha(`${d.u.slug}: a ponta do corte não entrou no anel do artefacto`);
      return i;
    };
    const iInicio = posDe(c.inicio);
    const iFim = posDe(c.fim);
    const meio = c.corte.slice(1, -1);
    const pecaA = [c.inicio.ponto, ...meio, ...arcoDoAnel(anel, iFim, iInicio).slice(0, -1)];
    const pecaB = [c.fim.ponto, ...meio.slice().reverse(), ...arcoDoAnel(anel, iInicio, iFim).slice(0, -1)];
    const somaDosDois = Math.abs(area(pecaA)) + Math.abs(area(pecaB));
    const doAnel = Math.abs(area(anel));
    if (Math.abs(somaDosDois - doAnel) / doAnel > 1e-6) {
      throw new Falha(
        `${d.u.slug}: as duas peças somam ${somaDosDois.toFixed(2)} u² e o anel tem ${doAnel.toFixed(2)} u²`,
      );
    }
    for (const peca of [pecaA, pecaB]) {
      const dentro = [...d.grupos.entries()].filter(([, lista]) =>
        lista.every((cc) => dentroDe([peca], d.paraOCampo(cc.ponto))),
      );
      if (dentro.length !== 1) {
        throw new Falha(`${d.u.slug}: uma das peças do corte não é de um grupo só (${dentro.length})`);
      }
      porRegiao.get(dentro[0][0]).aneis.push(peca);
    }
    for (let a = 0; a < d.aneisDoPais.length; a++) {
      if (a === c.inicio.anel) continue;
      const ilha = d.aneisDoPais[a];
      const donos = [...d.grupos.entries()].filter(([, lista]) =>
        lista.some((cc) => dentroDe([ilha.map((p) => p)], d.paraOCampo(cc.ponto))),
      );
      /* Um anel pequeno pode não conter nenhum ponto representativo: fica com o
         grupo do concelho mais próximo, que é a mesma leitura por outra medida. */
      let dono = donos.length === 1 ? donos[0][0] : null;
      if (!dono) {
        let melhor = Infinity;
        const centro = ilha.reduce((s, p) => [s[0] + p[0] / ilha.length, s[1] + p[1] / ilha.length], [0, 0]);
        for (const [slugDaRegiao, lista] of d.grupos) {
          for (const cc of lista) {
            const q = d.paraOCampo(cc.ponto);
            const dist = Math.hypot(q[0] - centro[0], q[1] - centro[1]);
            if (dist < melhor) {
              melhor = dist;
              dono = slugDaRegiao;
            }
          }
        }
      }
      porRegiao.get(dono).aneis.push(ilha.map((p) => p.slice()));
    }
  }

  /* ------------------------------------------------------------- as nove */
  const regioes = [];
  const clientes = [];
  let piorArea = 0;
  for (const r of daCasa) {
    const dados = porRegiao.get(r.slug);
    if (!dados || dados.concelhos.length === 0) {
      throw new Falha(`a região "${r.slug}" não recebeu um único concelho`);
    }
    if (dados.parcelas.size !== 1) {
      throw new Falha(`a região "${r.slug}" cai em ${dados.parcelas.size} parcelas do desenho`);
    }

    /* AS FRONTEIRAS INTERIORES ANULAM-SE. As peças de duas unidades vizinhas da
       mesma região partilham a aresta ponto por ponto, e a união pelas arestas
       deixa só o contorno. */
    const contorno = uniaoPorArestas(dados.aneis);
    const areaDasPecas = dados.aneis.reduce((s, a) => s + area(a), 0);
    const areaDoContorno = contorno.reduce((s, a) => s + area(a), 0);
    if (Math.abs(areaDoContorno - areaDasPecas) / Math.abs(areaDasPecas) > 1e-9) {
      throw new Falha(
        `${r.slug}: o contorno dá ${areaDoContorno.toFixed(2)} u² e as peças somam ${areaDasPecas.toFixed(2)} u²`,
      );
    }

    /* O NÍVEL DO PAÍS: o contorno arredondado ao campo e afinado. */
    const inteiros = [];
    let areaDepois = 0;
    for (const anel of contorno) {
      const arredondado = [];
      for (const [x, y] of anel) {
        const p = [Math.round(x), Math.round(y)];
        const ultimo = arredondado[arredondado.length - 1];
        if (!ultimo || ultimo[0] !== p[0] || ultimo[1] !== p[1]) arredondado.push(p);
      }
      while (
        arredondado.length > 1 &&
        arredondado[0][0] === arredondado[arredondado.length - 1][0] &&
        arredondado[0][1] === arredondado[arredondado.length - 1][1]
      ) {
        arredondado.pop();
      }
      if (arredondado.length < 3) continue;
      const afinado = afinaAnel(arredondado, toleranciaDoPais);
      if (afinado.length < 3 || Math.abs(area(afinado)) < 1) continue;
      inteiros.push(afinado);
      areaDepois += area(afinado);
    }
    piorArea = Math.max(piorArea, Math.abs(areaDepois - areaDasPecas) / Math.abs(areaDasPecas));

    /* O NÍVEL DA REGIÃO: a grelha própria, 2000 no lado maior. A caixa é a do
       contorno e a dos concelhos juntas, porque as duas geometrias vêm de
       arredondamentos diferentes da mesma fronteira. */
    const caixaNoCampo = caixaDe([...contorno, ...dados.concelhos.flatMap((c) => c.aneis)]);
    const k = 2000 / Math.max(caixaNoCampo[2], caixaNoCampo[3]);
    const paraAGrelha = ([x, y]) => [
      Math.round((x - caixaNoCampo[0]) * k),
      Math.round((y - caixaNoCampo[1]) * k),
    ];
    const campoDaRegiao = {
      largura: Math.round(caixaNoCampo[2] * k),
      altura: Math.round(caixaNoCampo[3] * k),
    };
    const toleranciaDaRegiao = tolerancia(campoDaRegiao.largura);
    const naGrelha = dados.concelhos
      .map((c) => {
        const aneis = c.aneis
          .map((a) => {
            const pontos = [];
            for (const p of a.map(paraAGrelha)) {
              const ultimo = pontos[pontos.length - 1];
              if (!ultimo || ultimo[0] !== p[0] || ultimo[1] !== p[1]) pontos.push(p);
            }
            while (
              pontos.length > 1 &&
              pontos[0][0] === pontos[pontos.length - 1][0] &&
              pontos[0][1] === pontos[pontos.length - 1][1]
            ) {
              pontos.pop();
            }
            return afinaAnel(pontos, toleranciaDaRegiao);
          })
          .filter((a) => a.length >= 3 && Math.abs(area(a)) >= 1);
        if (aneis.length === 0) throw new Falha(`o concelho "${c.slug}" desapareceu na grelha de ${r.slug}`);
        return {
          slug: c.slug,
          nome: c.nome,
          d: caminhoDeAneis(aneis),
          caixa: caixaDe(aneis),
          ponto: paraAGrelha(c.ponto),
        };
      })
      .sort((a, b) => a.slug.localeCompare(b.slug, 'pt'));

    /* ---------------------------------------------------------------------
       O PONTO REPRESENTATIVO DA REGIÃO, PELO LANÇAMENTO DE RAIO SOBRE O MAIOR
       ANEL, que é a definição que o motor já usa para as 29 unidades da Carta
       (`ResearchHub/publisher/MAPA.md` §4) e a que a régua do alvo pede: o maior
       quadrado inscrito mede-se À VOLTA DESTE PONTO (I82), e um ponto mal posto
       dá um alvo pequeno a uma área que se toca bem.

       Duas formas anteriores desta regra foram medidas e saíram: o ponto do
       concelho mais perto do centro da caixa dava 0 px aos Açores (o centro da
       caixa daquele arquipélago é mar, e o concelho mais perto dele é de uma ilha
       pequena), e o ponto do concelho maior dava 8 px à Grande Lisboa (o concelho
       maior é Mafra, que é estreito). Este toma o maior anel do contorno, corta-o
       por uma linha horizontal na altura do centro da caixa dele, e fica no meio
       do troço interior mais comprido.
       --------------------------------------------------------------------- */
    const maiorAnel = contorno.reduce((a, b) => (Math.abs(area(b)) > Math.abs(area(a)) ? b : a));
    const caixaDoAnel = caixaDe([maiorAnel]);
    const yDoCorte = caixaDoAnel[1] + caixaDoAnel[3] / 2;
    const cruzamentos = [];
    for (let k = 0; k < maiorAnel.length; k++) {
      const [x1, y1] = maiorAnel[k];
      const [x2, y2] = maiorAnel[(k + 1) % maiorAnel.length];
      if (y1 > yDoCorte === y2 > yDoCorte) continue;
      cruzamentos.push(x1 + ((yDoCorte - y1) * (x2 - x1)) / (y2 - y1));
    }
    cruzamentos.sort((a, b) => a - b);
    let ponto = null;
    let maisLargo = -1;
    for (let k = 0; k + 1 < cruzamentos.length; k += 2) {
      const largura = cruzamentos[k + 1] - cruzamentos[k];
      if (largura > maisLargo) {
        maisLargo = largura;
        ponto = [(cruzamentos[k] + cruzamentos[k + 1]) / 2, yDoCorte];
      }
    }
    if (!ponto) throw new Falha(`${r.slug}: a linha do corte não atravessa o maior anel`);

    regioes.push({
      slug: r.slug,
      codigo: r.codigo,
      parcela: [...dados.parcelas][0],
      ponto: [Math.round(ponto[0]), Math.round(ponto[1])],
      concelhos: dados.concelhos.length,
      unidades: [...new Set(dados.unidades)].sort((a, b) => a.localeCompare(b, 'pt')),
      d: caminhoDeAneis(inteiros),
      caixa: caixaDe(inteiros).map(Math.round),
      /* A CAIXA DA GRELHA DESTA REGIÃO, NO CAMPO DO PAÍS, COM AS CASAS TODAS.
         É o que leva um ponto do campo do país à grelha da região, e é o único
         número da conta dos nove ficheiros do cliente que não se lê das fontes:
         junta a caixa do contorno à dos concelhos, e as duas vêm de
         arredondamentos diferentes da mesma fronteira. Fica escrita para que o
         portão possa REFAZER os nove ficheiros das fontes, byte a byte, sem
         importar este gerador (`check-mapa.mjs`, R10). A caixa arredondada
         acima (`caixa`) não serve para isso: a Península de Setúbal dá 1 446 de
         altura de grelha com esta e 1 444 com aquela, medido a 08.09.2026. */
      caixa_da_grelha: caixaNoCampo,
      campo: campoDaRegiao,
      ficheiro: `dados/mapa/regiao-${r.slug}.json`,
    });
    clientes.push({
      slug: r.slug,
      conteudo: {
        _: [
          'FICHEIRO GERADO. Escrito por scripts/mapa-regioes.mjs, da CAOP 2025 por concelho.',
          'Os concelhos desta região, na grelha desta região: o campo, as caixas, os pontos e os',
          'caminhos vivem todos no mesmo espaço, que é o do viewBox.',
        ],
        slug: r.slug,
        campo: campoDaRegiao,
        concelhos: naGrelha,
      },
    });
  }

  const total = regioes.reduce((s, r) => s + r.concelhos, 0);
  if (total !== 308) throw new Falha(`as nove regiões somam ${total} concelhos, e não 308`);

  const ficheiro = {
    _: [
      'As nove regiões NUTS II, desenhadas dos concelhos da CAOP 2025 que cada uma tem.',
      'FICHEIRO GERADO. Escrito por scripts/mapa-regioes.mjs; conferido por scripts/check-mapa.mjs.',
      'A geometria é a da CAOP 2025 (Direção-Geral do Território, CC BY 4.0), pelos artefactos que o',
      'motor exportou para mapa/; a região de cada concelho é a coluna "nuts2" dos três ficheiros',
      'public/dados/caop-2025-municipios-*.csv, que trazem no cabeçalho o zip de origem e o seu sha256.',
      'O campo, as caixas e os caminhos das regiões vivem no campo do desenho de mapa/pais.json.',
      'Os concelhos de cada região vivem na grelha dessa região, no ficheiro que a entrada nomeia.',
      'NÃO EDITAR À MÃO.',
    ],
    origem: {
      gerador: 'scripts/mapa-regioes.mjs',
      carta: manifesto.fonte?.carta ?? null,
      atribuicao: manifesto.fonte?.atribuicao ?? null,
      lidos: Object.fromEntries([...lidos.entries()].sort(([a], [b]) => a.localeCompare(b))),
    },
    ajuste: {
      unidade: 'u, no campo em que cada desenho vive',
      unidades_repartidas: repartidas.map((d) => d.u.slug),
      residuo_do_ajuste_de_caixa: Number(residuoDoAjuste.toFixed(4)),
      projeccao_maxima_da_ponta_do_corte: Number(piorProjeccao.toFixed(4)),
      erro_px: erroPx,
      coluna_px: colunaPx,
      tolerancia_do_pais: Number(toleranciaDoPais.toFixed(4)),
      desvio_entre_as_duas_grelhas_u: Number(desvioEntreGrelhas.toFixed(4)),
      desvio_entre_as_duas_grelhas_mediana_u: Number(desvioMediano.toFixed(4)),
      unidade_do_maior_desvio: ondeODesvio,
      arestas_das_29_unidades: das29.total,
      arestas_das_29_com_gemea: das29.comGemea,
      arestas_dos_308_no_campo_do_pais: totalDos308,
      arestas_dos_308_com_gemea: gemeasDos308,
      desvio_de_area_ao_arredondar_e_afinar_pct: Number((piorArea * 100).toFixed(6)),
    },
    campo: pais.campo,
    molduras: pais.molduras,
    regioes,
  };
  return { ficheiro, clientes };
}

/* ==========================================================================
 * A CORRIDA
 * ========================================================================== */

let saida;
try {
  saida = calcula();
} catch (e) {
  if (e instanceof Falha) {
    console.error(vermelho(`\n  MAPA DAS REGIÕES · ${e.message}\n`));
    process.exit(1);
  }
  throw e;
}

const texto = `${JSON.stringify(saida.ficheiro, null, 2)}\n`;
const porCliente = saida.clientes.map((c) => ({
  caminho: path.join(SAIDA_CLIENTE, `regiao-${c.slug}.json`),
  texto: `${JSON.stringify(c.conteudo)}\n`,
}));

if (VERIFICA) {
  const diferentes = [];
  if (!fs.existsSync(SAIDA) || fs.readFileSync(SAIDA, 'utf8') !== texto) diferentes.push(path.relative(RAIZ, SAIDA));
  for (const c of porCliente) {
    if (!fs.existsSync(c.caminho) || fs.readFileSync(c.caminho, 'utf8') !== c.texto) {
      diferentes.push(path.relative(RAIZ, c.caminho));
    }
  }
  if (diferentes.length > 0) {
    console.error(
      vermelho(`\n  MAPA DAS REGIÕES · ${diferentes.length} ficheiro(s) diferentes do que as fontes dão:\n`) +
        diferentes.map((d) => cinza(`    ${d}\n`)).join('') +
        cinza('\n  Corra `npm run mapa:regioes`.\n'),
    );
    process.exit(1);
  }
  console.log(verde(`  mapa das regiões · ${saida.ficheiro.regioes.length} regiões, 308 concelhos, tudo igual ao que as fontes dão.`));
  process.exit(0);
}

fs.mkdirSync(SAIDA_CLIENTE, { recursive: true });
fs.writeFileSync(SAIDA, texto);
for (const c of porCliente) fs.writeFileSync(c.caminho, c.texto);

const bytesCliente = porCliente.reduce((s, c) => s + Buffer.byteLength(c.texto), 0);
console.log(
  `  mapa das regiões · ${saida.ficheiro.regioes.length} regiões e 308 concelhos · ` +
    `${Buffer.byteLength(texto).toLocaleString('pt-PT')} B em src/data/mapa-regioes.gerado.json · ` +
    `${bytesCliente.toLocaleString('pt-PT')} B em ${porCliente.length} ficheiros de public/dados/mapa/`,
);
