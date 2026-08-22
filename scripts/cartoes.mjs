#!/usr/bin/env node
/**
 * OS CARTÕES DE PARTILHA: desenho e rasterização.
 *
 * Corre DEPOIS do `astro build` e ANTES do `gate:html`, e a ordem é a razão de
 * ser deste passo: os cartões precisam das linhas e da prova, que só existem
 * depois de a construção resolver os dados, e o portão precisa dos cartões,
 * porque é ele que confere que cada página nomeia o cartão da sua própria rota
 * e da sua própria edição, e que cada número do cartão é o da sua linha.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTE FICHEIRO PODE E O QUE NÃO PODE FAZER
 * ---------------------------------------------------------------------------
 * PODE: desenhar. As medidas, as folgas, os corpos de letra e a ordem dos
 * elementos são deste ficheiro, e vêm da prancha `CartaoPartilha.dc.html`.
 *
 * NÃO PODE: compor uma frase, formatar um valor, decidir um estado ou traduzir
 * o que quer que seja. Tudo isso vem de `src/lib/cartoes.mjs`, que por sua vez
 * chama as MESMAS funções que as páginas chamam. Este ficheiro recebe um modelo
 * já escrito e põe-no em píxeis. Se alguma vez aqui aparecer uma cadeia de
 * texto legível pelo leitor, isso é um defeito.
 *
 * As CORES vêm de `src/styles/tokens.css`, lidas do ficheiro na construção.
 * `IDENTIDADE.md` §2 proíbe um literal de cor fora das fichas, e um cartão com
 * a sua própria paleta seria a paleta a existir em dois sítios.
 *
 * Os TIPOS vêm de `tipos-cartao/`, que é a mesma letra que o sítio serve,
 * noutro contentor: o rasterizador não lê WOFF2 (medido: `fontdb` recusa-o com
 * «malformed font»), e o Bitter que o sítio serve é variável, cujo eixo o
 * rasterizador também não move — desenharia tudo no Thin de defeito. A
 * derivação, os comandos e os resumos estão em `design/especime-v3/notas/stage-5.md`.
 *
 * ---------------------------------------------------------------------------
 * O REGISTO
 * ---------------------------------------------------------------------------
 * Cada cartão escreve, ao lado do PNG, um `.json` com: a rota, a edição, as
 * dimensões, o resumo do ficheiro, a cópia visível exacta e cada valor com a
 * linha (ou a chave da prova) de onde veio, a unidade e o período. É esse
 * registo que o portão relê, e é por ele que um cartão pode ser conferido sem
 * ninguém ter de ler píxeis.
 *
 * Regista também `codificacao` («paleta» ou «rgba») e `cores`. Nenhum portão as
 * confere: não são uma conferência, são a arrumação dos bytes escrita ao lado
 * deles, para que um cartão em RGBA se veja no registo e não só na balança.
 *
 * ---------------------------------------------------------------------------
 * OS BYTES
 * ---------------------------------------------------------------------------
 * O PNG sai em paleta indexada (tipo de cor 3) pelo codificador da casa,
 * `png-paleta.mjs`, e não pelo `asPng()` do rasterizador. Não é uma
 * quantização: os cartões têm no máximo 118 cores e nem um píxel translúcido, e
 * por isso os píxeis do ficheiro são, cor por cor, os que o rasterizador
 * desenhou. Se algum cartão passar das 256 cores ou trouxer alfa, o codificador
 * recusa, este ficheiro volta ao `asPng()` e o registo diz «rgba». A prova de
 * igualdade corre-se com `node scripts/provar-cartoes-paleta.mjs`.
 *
 * Os cartões vivem em `dist/` e mais lado nenhum. Não se commetem.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_HOST_DISPLAY } from '../site.config.mjs';
import {
  DIMENSOES,
  PASTA,
  cartoesAConstruir,
  copiaVisivel,
  modeloDoCartao,
  nomeDoCartao,
} from '../src/lib/cartoes.mjs';
import { matchPath } from '../src/lib/routes.mjs';
import { codificaPaleta } from './png-paleta.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');
const DIST = path.join(RAIZ, 'dist');
const FICHAS = path.join(RAIZ, 'src', 'styles', 'tokens.css');
const TIPOS = path.join(RAIZ, 'tipos-cartao');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

function morre(msg) {
  console.error(vermelho(`\n  CARTÕES — ${msg}\n`));
  process.exit(1);
}

if (!fs.existsSync(DIST)) morre('não existe dist/. Corra o build primeiro.');

/**
 * `--provar` guarda o RGBA de cada cartão para o comparar com o PNG escrito.
 *
 * NÃO faz parte da construção: o `npm run cartoes` corre sem a bandeira, e o
 * descodificador só é importado quando ela está lá. Quem a corre é
 * `provar-cartoes-paleta.mjs`, que é onde está escrito o que a prova prova e o
 * que ela não prova.
 */
const PROVAR = process.argv.includes('--provar');
const { compara } = PROVAR ? await import('./provar-cartoes-paleta.mjs') : { compara: null };

/* ------------------------------------------------------------ o rasterizador */

/**
 * O rasterizador entra por importação dinâmica para que a falta dele seja uma
 * MENSAGEM e não um traço de pilha. Falha a construção — não se salta: uma
 * página com `og:image` a apontar para um ficheiro que não existe é pior do que
 * uma construção parada, porque só se vê no dia em que alguém partilha.
 */
let Resvg;
try {
  ({ Resvg } = await import('@resvg/resvg-js'));
} catch (e) {
  morre(
    `não foi possível carregar @resvg/resvg-js (${e.message}).\n` +
      `  É uma dependência de construção declarada em package.json. Sem ela não há cartões,\n` +
      `  e sem cartões o portão de HTML fecha a construção na conferência do og:image.`,
  );
}

const TIPOS_DO_CARTAO = [
  'Spectral-Regular.ttf',
  'Spectral-Medium.ttf',
  'SpectralSC-SemiBold.ttf',
  'Bitter-400.ttf',
  'Bitter-600.ttf',
].map((n) => path.join(TIPOS, n));

for (const f of TIPOS_DO_CARTAO) {
  if (!fs.existsSync(f)) morre(`falta o tipo ${path.relative(RAIZ, f)}.`);
}

/**
 * `fontFiles` e não `fontBuffers`, e é uma medição e não um gosto: com
 * `fontBuffers` cada `new Resvg()` custou 77 ms nesta máquina e com `fontFiles`
 * custa 0,1 ms (o caminho dos buffers arrasta um varrimento dos tipos do
 * sistema que o `loadSystemFonts: false` não trava). São 532 cartões: a
 * diferença é entre 41 s e 4 s de construção.
 */
const OPCOES_DO_TIPO = {
  font: {
    loadSystemFonts: false,
    fontFiles: TIPOS_DO_CARTAO,
    defaultFontFamily: 'Spectral',
  },
  logLevel: 'error',
};

/* ------------------------------------------------------------------- as cores */

/**
 * As fichas do tema claro, lidas de `tokens.css`.
 *
 * Só o PRIMEIRO bloco `:root`, que é o claro: o cartão é uma folha impressa, e
 * uma folha não tem tema. `var(--x)` resolve-se aqui porque as fichas se citam
 * umas às outras (`--onamber: var(--ink)`), e uma ficha que ficasse por
 * resolver entrava no SVG como texto e o rasterizador pintava preto sem dizer
 * nada.
 */
function fichasDoTemaClaro() {
  const css = fs.readFileSync(FICHAS, 'utf8');
  const bloco = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!bloco) morre('não encontrei o bloco :root em src/styles/tokens.css.');
  const cru = {};
  for (const m of bloco[1].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    cru[m[1]] = m[2].trim();
  }
  const resolve = (nome, profundidade = 0) => {
    if (profundidade > 8) morre(`ficha ${nome} com referência circular.`);
    const v = cru[nome];
    if (v === undefined) morre(`falta a ficha ${nome} em src/styles/tokens.css.`);
    const ref = v.match(/^var\((--[a-z0-9-]+)\)$/i);
    return ref ? resolve(ref[1], profundidade + 1) : v;
  };
  const precisa = [
    '--paper',
    '--ink',
    '--g1',
    '--g2',
    '--amber',
    '--onamber',
    '--ochre',
    '--cobalt',
    '--cobalt-palavra',
  ];
  const out = {};
  for (const n of precisa) out[n] = resolve(n);
  return out;
}

const COR = fichasDoTemaClaro();

/** A cor do quadrado e a cor da palavra, por estado. É a regra da IDENTIDADE §2. */
const PINTURA = {
  fora: { enchimento: COR['--amber'], contorno: COR['--onamber'], palavra: COR['--ochre'] },
  dentro: { enchimento: COR['--cobalt'], contorno: COR['--ink'], palavra: COR['--cobalt-palavra'] },
  sem: { enchimento: 'none', contorno: COR['--ink'], palavra: COR['--g1'] },
};

/* ------------------------------------------------------------------- o SVG */

const TIPO = {
  prosa: 'Spectral',
  versal: 'Spectral SC',
  aparelho: 'Bitter',
};

const escapa = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * A largura de um texto, medida pelo próprio rasterizador que o vai desenhar.
 *
 * Não é uma estimativa por número de caracteres: desenha-se o texto sozinho num
 * SVG e lê-se a caixa que ele ocupa. É a única medida honesta, porque é a que o
 * desenho vai ter. Memorizada, porque a mesma cadeia mede-se muitas vezes ao
 * procurar o corpo que cabe.
 */
const medidas = new Map();
function largura(texto, { familia, corpo, peso = 400, espacamento = 0 }) {
  const chave = `${familia}|${corpo}|${peso}|${espacamento}|${texto}`;
  if (medidas.has(chave)) return medidas.get(chave);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="8000" height="400">` +
    `<text x="0" y="200" font-family="${escapa(familia)}" font-size="${corpo}" ` +
    `font-weight="${peso}" letter-spacing="${espacamento}">${escapa(texto)}</text></svg>`;
  const caixa = new Resvg(svg, OPCOES_DO_TIPO).getBBox();
  const w = caixa ? caixa.width : 0;
  medidas.set(chave, w);
  return w;
}

/** Um `<text>`, com a ficha e o corpo já decididos. */
function texto(t, { x, y, familia, corpo, peso = 400, cor, espacamento = 0, fim = false }) {
  return (
    `<text x="${x}" y="${y}" font-family="${escapa(familia)}" font-size="${corpo}" ` +
    `font-weight="${peso}" fill="${cor}" letter-spacing="${espacamento}"` +
    `${fim ? ' text-anchor="end"' : ''}>${escapa(t)}</text>`
  );
}

/**
 * O corpo de letra que faz um texto caber numa largura, e as linhas em que ele
 * cabe. Desce de dois em dois píxeis e nunca abaixo do mínimo: um cartão com o
 * texto cortado seria um cartão a mentir por omissão, e por isso a última
 * palavra é do mínimo e não do corte.
 */
function ajusta(t, { familia, peso, espacamento = 0, corpoMax, corpoMin, largura: max, linhas: maxLinhas }) {
  for (let corpo = corpoMax; corpo >= corpoMin; corpo -= 2) {
    const linhas = quebra(t, { familia, corpo, peso, espacamento, largura: max });
    if (linhas.length <= maxLinhas && linhas.every((l) => largura(l, { familia, corpo, peso, espacamento }) <= max)) {
      return { corpo, linhas };
    }
  }
  return { corpo: corpoMin, linhas: quebra(t, { familia, corpo: corpoMin, peso, espacamento, largura: max }) };
}

function quebra(t, { familia, corpo, peso, espacamento, largura: max }) {
  const palavras = String(t).split(' ');
  const linhas = [];
  let atual = '';
  for (const p of palavras) {
    const tentativa = atual === '' ? p : `${atual} ${p}`;
    if (largura(tentativa, { familia, corpo, peso, espacamento }) <= max || atual === '') {
      atual = tentativa;
    } else {
      linhas.push(atual);
      atual = p;
    }
  }
  if (atual !== '') linhas.push(atual);
  return linhas;
}

/**
 * O DESENHO DE UM CARTÃO.
 *
 * A prancha manda: papel, moldura de tinta, a marca em cima à esquerda e a
 * sobrancelha em cima à direita, o bloco do meio encostado ao fio do pé, e o pé
 * com o quadrado do selo à esquerda e o aparelho à direita. Sem linha de método
 * (Emenda 11), sem pontos de mapa (Emenda 10), sem frase sobre o sítio
 * (Emenda 15) e sem cor fora do par de estado.
 *
 * Devolve `{ svg, copia }`: o desenho e a cópia visível na ordem em que se lê,
 * que é o que o registo guarda e o que o portão confere.
 */
function desenha(modelo, dim) {
  const { largura: L, altura: H } = dim;
  const MARGEM = 64;
  const TOPO = Math.round(H * 0.0889);
  const FUNDO = Math.round(H * 0.0762);
  const util = L - 2 * MARGEM;
  const partes = [];

  partes.push(`<rect x="0" y="0" width="${L}" height="${H}" fill="${COR['--paper']}"/>`);
  partes.push(
    `<rect x="1" y="1" width="${L - 2}" height="${H - 2}" fill="none" ` +
      `stroke="${COR['--ink']}" stroke-width="2"/>`,
  );

  /* --- o cimo: a marca e a sobrancelha, na mesma linha de base --- */
  const yCimo = TOPO + 27;
  const sobrancelha = modelo.sobrancelha.toLocaleLowerCase(modelo.lang);
  partes.push(
    texto(modelo.marca, {
      x: MARGEM,
      y: yCimo,
      familia: TIPO.prosa,
      corpo: 34,
      peso: 500,
      cor: COR['--ink'],
      espacamento: -0.34,
    }),
  );
  partes.push(
    texto(sobrancelha, {
      x: L - MARGEM,
      y: yCimo,
      familia: TIPO.versal,
      corpo: 20,
      peso: 600,
      cor: COR['--g1'],
      espacamento: 1,
      fim: true,
    }),
  );

  /* --- o pé: o fio, o quadrado do selo, e o aparelho --- */
  const yFio = H - FUNDO - 46;
  const yPe = H - FUNDO - 12;
  partes.push(
    `<line x1="${MARGEM}" y1="${yFio}" x2="${L - MARGEM}" y2="${yFio}" ` +
      `stroke="${COR['--ink']}" stroke-width="1"/>`,
  );
  /* O SELO É O QUADRADO, e mais nada. A prancha tinha «cada número tem fonte» ao
     lado dele; a Emenda 11 tirou a linha de método do pé do cartão, e o que fica
     é a marca de prova que a constituição fixa (Emenda 10: o quadrado marca
     prova). */
  partes.push(
    `<rect x="${MARGEM}" y="${yPe - 15}" width="16" height="16" fill="${COR['--ink']}"/>`,
  );
  const pe = [SITE_HOST_DISPLAY, ...modelo.meta].join(' · ');
  partes.push(
    texto(pe, {
      x: L - MARGEM,
      y: yPe,
      familia: TIPO.aparelho,
      corpo: 19,
      peso: 400,
      cor: COR['--g1'],
      espacamento: 0.2,
      fim: true,
    }),
  );

  /* --- o meio, encostado ao fio do pé e a crescer para cima --- */
  const fundoDoMeio = yFio - 46;
  const tectoDoMeio = yCimo + 44;
  const alturaDoMeio = fundoDoMeio - tectoDoMeio;
  let y = fundoDoMeio;
  /* O topo do que o bloco do meio desenhou, para a guarda do fim. */
  let topoDesenhado = fundoDoMeio;

  if (modelo.tipo === 'inicio') {
    /* ------------------------------------------------------------------
       A FILA DE QUADRADOS, e a razão de ela poder ter duas linhas.
       ------------------------------------------------------------------
       Um grupo é «tantos quadrados de um estado, e a palavra desse estado ao
       lado». Em português os dois grupos cabem numa linha; em inglês
       «outside the threshold» e «within the threshold» são mais compridas e a
       primeira rendição saía pela margem fora — medido, não suposto. Em vez de
       encolher a letra na edição inglesa (que daria duas filas com corpos
       diferentes para a mesma coisa), a fila passa a um grupo por linha quando
       não cabe numa. O desenho é o mesmo nas duas edições; o que muda é onde
       ele quebra.
       ------------------------------------------------------------------ */
    const lado = 26;
    const folga = 8;
    const antes = 14;
    const entre = 44;
    const corpoPalavra = 24;
    const fichaDaPalavra = { familia: TIPO.versal, corpo: corpoPalavra, peso: 600, espacamento: 1.2 };
    const grupos = modelo.fila.map((g) => ({
      ...g,
      minuscula: g.palavra.toLocaleLowerCase(modelo.lang),
    }));
    const larguraDoGrupo = (g) =>
      g.quantos * lado + (g.quantos - 1) * folga + antes + largura(g.minuscula, fichaDaPalavra);
    const numaLinha =
      grupos.reduce((a, g) => a + larguraDoGrupo(g), 0) + entre * (grupos.length - 1);
    const filas = numaLinha <= util ? [grupos] : grupos.map((g) => [g]);
    for (const linha of filas) {
      const w = linha.reduce((a, g) => a + larguraDoGrupo(g), 0) + entre * (linha.length - 1);
      if (w > util) {
        morre(
          `a fila de estados do cartão de ${modelo.rota} (${modelo.lang}) mede ${Math.round(w)}px ` +
            `e a folha tem ${util}px. Um cartão cortado não sai daqui: mude o desenho.`,
        );
      }
    }

    const alturaDaFila = filas.length * (lado + 22) - 22;
    let yFila = y - (filas.length - 1) * (lado + 22);
    for (const linha of filas) {
      let x = MARGEM;
      for (const g of linha) {
        const p = PINTURA[g.estado];
        for (let i = 0; i < g.quantos; i++) {
          partes.push(
            `<rect x="${x}" y="${yFila - lado}" width="${lado}" height="${lado}" ` +
              `fill="${p.enchimento}" stroke="${p.contorno}" stroke-width="1.5"/>`,
          );
          x += lado + folga;
        }
        x = x - folga + antes;
        partes.push(
          texto(g.minuscula, { x, y: yFila - 5, ...fichaDaPalavra, cor: p.palavra }),
        );
        x += largura(g.minuscula, fichaDaPalavra) + entre;
      }
      yFila += lado + 22;
    }
    y -= alturaDaFila + 46;

    const { corpo, linhas } = ajusta(modelo.manchete, {
      familia: TIPO.prosa,
      peso: 500,
      espacamento: -0.3,
      corpoMax: 68,
      corpoMin: 34,
      largura: util,
      linhas: Math.max(2, Math.floor((alturaDoMeio - alturaDaFila - 46) / 74)),
    });
    const entrelinha = Math.round(corpo * 1.1);
    for (let i = linhas.length - 1; i >= 0; i--) {
      partes.push(
        texto(linhas[i], {
          x: MARGEM,
          y,
          familia: TIPO.prosa,
          corpo,
          peso: 500,
          cor: COR['--ink'],
          espacamento: -0.3,
        }),
      );
      topoDesenhado = y - corpo;
      y -= entrelinha;
    }
  } else {
    /* O aparelho da linha: o id e o período, em baixo. */
    partes.push(
      texto(modelo.aparelho, {
        x: MARGEM,
        y,
        familia: TIPO.aparelho,
        corpo: 22,
        peso: 400,
        cor: COR['--g1'],
        espacamento: 0.4,
      }),
    );
    y -= 44;

    /* O estado: o quadrado e a palavra, como em qualquer peça do sítio. */
    const lado = 24;
    const p = PINTURA[modelo.estado.estado];
    partes.push(
      `<rect x="${MARGEM}" y="${y - lado + 3}" width="${lado}" height="${lado}" ` +
        `fill="${p.enchimento}" stroke="${p.contorno}" stroke-width="1.5"/>`,
    );
    partes.push(
      texto(modelo.estado.palavra.toLocaleLowerCase(modelo.lang), {
        x: MARGEM + lado + 14,
        y,
        familia: TIPO.versal,
        corpo: 26,
        peso: 600,
        cor: p.palavra,
        espacamento: 1.2,
      }),
    );
    y -= 54;

    const { corpo, linhas } = ajusta(modelo.manchete, {
      familia: TIPO.aparelho,
      peso: 600,
      espacamento: -2,
      corpoMax: 96,
      corpoMin: 32,
      largura: util,
      linhas: 2,
    });
    const entrelinha = Math.round(corpo * 1.06);
    for (let i = linhas.length - 1; i >= 0; i--) {
      partes.push(
        texto(linhas[i], {
          x: MARGEM,
          y,
          familia: TIPO.aparelho,
          corpo,
          peso: 600,
          cor: COR['--ink'],
          espacamento: -2,
        }),
      );
      topoDesenhado = y - corpo;
      y -= entrelinha;
    }
  }

  /* A GUARDA DO ALTO. O bloco do meio cresce para cima; se passar por cima da
     linha da marca, o cartão está a sair da folha e não se publica. Falha a
     construção com o nome da rota, e não se encolhe mais nada em silêncio. */
  if (topoDesenhado < tectoDoMeio) {
    morre(
      `o bloco do meio do cartão de ${modelo.rota} (${modelo.lang}, ${L}×${H}) chega a ` +
        `y=${Math.round(topoDesenhado)} e o tecto é y=${tectoDoMeio}. Não cabe.`,
    );
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}" ` +
    `viewBox="0 0 ${L} ${H}">${partes.join('')}</svg>`;

  /* A cópia visível: as mesmas cadeias, na ordem de leitura, com as
     transformações que o desenho lhes fez (o versalete é minúsculo). */
  const copia = copiaVisivel(
    {
      ...modelo,
      sobrancelha,
      fila: modelo.fila?.map((g) => ({ ...g, palavra: g.palavra.toLocaleLowerCase(modelo.lang) })),
      estado: modelo.estado
        ? { ...modelo.estado, palavra: modelo.estado.palavra.toLocaleLowerCase(modelo.lang) }
        : null,
    },
    SITE_HOST_DISPLAY,
  );

  return { svg, copia };
}

/* ------------------------------------------------------------------ a corrida */

/** As rotas construídas, lidas de `dist/`: é o que decide que cartão cobre o quê. */
function rotasConstruidas() {
  const out = [];
  const anda = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const cheio = path.join(dir, e.name);
      if (e.isDirectory()) anda(cheio);
      else if (e.name.endsWith('.html')) {
        const rel = path.relative(DIST, cheio);
        const caminho =
          '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
        const rota = matchPath(caminho);
        if (rota?.key === 'documento') continue; // obra alojada, sem cabeçalho da casa
        /* Uma página fora da tabela de rotas (as de erro, `/404` e `/en/404`)
           tem a edição no seu prefixo, e o cartão que a cobre é o da primeira
           página dessa edição: sem esta linha o `/en/404` caía no cartão
           português e o portão recusava-o (ISSUES I53). */
        const lang = rota?.lang ?? (caminho === '/en' || caminho.startsWith('/en/') ? 'en' : 'pt');
        out.push({ caminho, lang });
      }
    }
  };
  anda(DIST);
  return out;
}

const inicio = Date.now();
const destino = path.join(DIST, PASTA);
fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });

const rotas = rotasConstruidas();
const cartoes = cartoesAConstruir(rotas);

let escritos = 0;
let bytes = 0;
let emPaleta = 0;
let maisCores = 0;
let provados = 0;
const recusas = [];
for (const cartao of cartoes) {
  const modelo = modeloDoCartao(cartao);
  for (const dim of DIMENSOES) {
    const { svg, copia } = desenha(modelo, dim);
    const imagem = new Resvg(svg, OPCOES_DO_TIPO).render();
    const paleta = codificaPaleta(imagem.pixels, imagem.width, imagem.height);
    const png = paleta.bytes ?? imagem.asPng();

    const nomePng = nomeDoCartao({
      rota: cartao.rota,
      lang: cartao.lang,
      largura: dim.largura,
      altura: dim.altura,
      extensao: 'png',
    });
    const nomeJson = nomePng.replace(/\.png$/, '.json');
    fs.writeFileSync(path.join(destino, nomePng), png);

    const registo = {
      rota: cartao.rota,
      edicao: cartao.lang,
      tipo: modelo.tipo,
      linha: modelo.id ?? null,
      dimensoes: { largura: dim.largura, altura: dim.altura, papel: dim.papel },
      ficheiro: `/${PASTA}/${nomePng}`,
      resumo: `sha256:${crypto.createHash('sha256').update(png).digest('hex')}`,
      bytes: png.length,
      codificacao: paleta.bytes ? 'paleta' : 'rgba',
      cores: paleta.cores,
      copia,
      valores: modelo.valores,
      quadrados: modelo.quadrados,
      cobre: cartao.cobre,
    };
    fs.writeFileSync(path.join(destino, nomeJson), JSON.stringify(registo, null, 2) + '\n');
    escritos++;
    bytes += png.length;
    if (paleta.bytes) {
      emPaleta++;
      if (paleta.cores > maisCores) maisCores = paleta.cores;
    } else {
      recusas.push(`${nomePng}: ${paleta.recusa}`);
    }

    /* A prova, quando pedida: o RGBA desta passagem ainda está em memória, e o
       PNG acabou de ser escrito. Ver `provar-cartoes-paleta.mjs`. */
    if (PROVAR && paleta.bytes) {
      const r = compara(
        fs.readFileSync(path.join(destino, nomePng)),
        imagem.pixels,
        imagem.width,
        imagem.height,
      );
      if (r.igual) provados++;
      else morre(`os píxeis de ${nomePng} não são os do rasterizador.\n  ${r.motivo}`);
    }
  }
}

const segundos = ((Date.now() - inicio) / 1000).toFixed(1);
console.log(
  cinza(
    `\n  cartões · ${cartoes.length} cartões × ${DIMENSOES.length} medidas = ${escritos} PNG e ${escritos} registos · ` +
      `${(bytes / 1024 / 1024).toFixed(2)} MB · ${medidas.size} medições de texto · ${segundos}s`,
  ),
);
console.log(
  cinza(
    `  paleta · ${emPaleta} de ${escritos} PNG em paleta exacta (tipo de cor 3), ` +
      `no máximo ${maisCores} cores num cartão · ${recusas.length} em RGBA`,
  ),
);
/* Uma recusa não fecha a construção: o cartão sai em RGBA, que é o que saía
   antes, e o registo diz «rgba». O que ela não pode é passar despercebida. */
for (const r of recusas) console.log(cinza(`    · em RGBA por recusa da paleta: ${r}`));
if (PROVAR) {
  console.log(
    `  ${verde('✓')} ${provados} de ${emPaleta} PNG em paleta descodificados e iguais, píxel a ` +
      `píxel, ao RGBA que o rasterizador desenhou na mesma passagem.`,
  );
}
console.log(`  ${verde('✓')} os cartões estão em dist/${PASTA}/, e o portão vai conferi-los.\n`);
