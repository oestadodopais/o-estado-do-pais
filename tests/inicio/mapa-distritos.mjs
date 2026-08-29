#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DO MAPA POR DISTRITOS · Emenda 20, D6 do BRIEF-mapa-distritos
 * =============================================================================
 *
 * Uma célula por alvo que o brief escreve, medida em Chromium sem cabeça sobre
 * `dist/`. NÃO é um portão: não entra no `npm run build` e não constrói nada.
 * Imprime uma linha por célula e SAI COM 0 quando todas passam e com 1 quando
 * alguma falha, como `tests/inicio/mapa-navegacao.mjs` e ao contrário de
 * `matriz.mjs`, que só imprime. O código de saída é o que faz um estrago
 * plantado ser visível (regra 14 da casa).
 *
 *   node tests/inicio/mapa-distritos.mjs
 *   node tests/inicio/mapa-distritos.mjs --json <ficheiro>
 *   node tests/inicio/mapa-distritos.mjs --vermelhos
 *
 * O servidor toma uma porta livre (`listen(0)`), como as outras réguas da casa:
 * o sistema dá a porta e ninguém a escolhe.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * M1 e M2 · os alvos das 29, a 1280 e nas quatro larguras de telemóvel que a
 * casa serve (320, 360, 390 e 430). Mede-se NO NAVEGADOR, e não sobre a caixa do
 * artefacto multiplicada por uma escala: o que interessa é o que o dedo
 * encontra, e entre o artefacto e o dedo estão a folha, o `viewBox` e a largura
 * da coluna.
 *
 * O ALVO DE UMA ÁREA É A SUA ÁREA INSCRITA, E NÃO A SUA CAIXA (I82, 27.08.2026).
 * A primeira forma desta régua media `getBoundingClientRect`, e a medição cega M3
 * mostrou porque é que isso sobrestima: o centro da caixa da Ilha da Madeira cai
 * fora do polígono da Ilha da Madeira. Uma caixa é o rectângulo que envolve a
 * forma, e numa forma côncava, que é o que uma costa é, quase nada da caixa é
 * a forma. A régua passa a medir o MAIOR QUADRADO INSCRITO À VOLTA DO PONTO
 * REPRESENTATIVO: rasteriza-se a área a 2 px com `isPointInFill`, faz-se a
 * programação dinâmica do quadrado máximo sobre essa grelha, e o alvo é o maior
 * quadrado que cabe dentro da área e contém o ponto onde a régua clica.
 *
 * A MEDIDA MUDA A RESPOSTA, E MUITO. Pela caixa, 19 das 29 chegavam aos 44 px a
 * 1280 e 19 a 390; pela área inscrita chegam 5 a 1280 e nenhuma a 390. A rede da
 * Emenda 20c é o que sustenta a diferença: para cada unidade abaixo dos 44 px
 * exige-se o seu nome numa lista por baixo do mapa, e a lista é por PARCELA e
 * não por moldura (I81), porque o continente não tem moldura.
 *
 * O QUADRADO CENTRADO NO PONTO fica medido ao lado e não decide nada: nenhuma das
 * 29 o cumpre a nenhuma largura, e uma medida que nunca separa nada não separa
 * um alvo de um não-alvo. Fica na saída porque é a leitura estrita do alvo, e
 * porque quem ler estes números tem de ver as duas.
 *
 * M3 · uma página de distrito. As mesmas duas perguntas para os concelhos, e a
 * lista da página é a resposta para os que não chegam. Mede-se em três: Lisboa
 * (16 concelhos, denso), Aveiro (19, com os dois mais pequenos do país) e a Ilha
 * de São Miguel (6, uma moldura própria).
 *
 * M4 · os pesos. O brief fixa dois: a primeira página com o desenho das 29
 * dentro, e uma página de distrito com no máximo 25 KB de caminhos. Conta-se o
 * `d=` de cada `<path>` no HTML servido, que é o que atravessa a rede.
 *
 * M5 · a neutralidade da Emenda 10. Três coisas: as 29 áreas com o MESMO estilo
 * computado (traço, enchimento, largura); o que muda ao passar o rato ou ao
 * chegar pelo teclado é só a largura do traço; e nenhuma cor de estatuto em
 * lado nenhum do desenho (as cores de estado que os tokens declaram, resolvidas
 * pela sonda que a célula descreve).
 *
 * M6 · dez cliques reais, cinco na primeira página e cinco numa página de
 * distrito, no PONTO REPRESENTATIVO de cada área e não na borda: um `<path>` com
 * `fill: none` só recebe eventos onde está pintado, e foi essa a lição medida a
 * 26.08 no ponto de Évora. Mais um percurso de teclado, que é a outra maneira de
 * lá chegar.
 *
 * M7 e M8 · as duas réguas de voz que o brief nomeia, corridas como elas são.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.csv': 'text/csv',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const argv = process.argv.slice(2);
const opcao = (nome) => {
  const i = argv.indexOf(nome);
  return i >= 0 ? (argv[i + 1] ?? true) : null;
};
const FICHEIRO_JSON = opcao('--json');
const VERMELHOS = argv.includes('--vermelhos');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

/* ---------------------------------------------------------------------------
 * O SERVIDOR, COM UM ESTRAGO OPCIONAL POR CIMA
 * ---------------------------------------------------------------------------
 * O estrago plantado desta régua não toca em disco: é uma transformação do HTML
 * no caminho entre o ficheiro e o navegador. Assim a régua mede exactamente o
 * que mediria de verdade, e o `dist/` fica como estava.
 */
let ESTRAGO = null;

const servidor = http.createServer((req, res) => {
  const semQuery = req.url.split('?')[0];
  let ficheiro;
  try {
    ficheiro = path.resolve(DIST, '.' + decodeURIComponent(semQuery));
  } catch {
    ficheiro = path.resolve(DIST, '.' + semQuery);
  }
  if (!ficheiro.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(ficheiro) && fs.statSync(ficheiro).isDirectory()) {
    ficheiro = path.join(ficheiro, 'index.html');
  }
  if (!fs.existsSync(ficheiro)) return void res.writeHead(404).end('404');
  const tipo = MIME[path.extname(ficheiro)] ?? 'application/octet-stream';
  if (ESTRAGO && path.extname(ficheiro) === '.html') {
    const html = ESTRAGO(fs.readFileSync(ficheiro, 'utf8'), semQuery);
    res.writeHead(200, { 'content-type': tipo });
    return void res.end(html);
  }
  res.writeHead(200, { 'content-type': tipo });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

let celulas = [];
let medidas = {};
const conta = (nome, passa, prova) =>
  celulas.push({ nome, passa: !!passa, prova: String(prova) });

const nav = await chromium.launch({ headless: true });
async function pagina(rota, largura) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 900 } });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

const ALVO = 44;
/* No ecrã com rato (a partir de 1024) a lista dos nomes é o índice do mapa e a
   linha de um nome mede 32 px (29.08.2026, a emenda do alinhamento à §1.84); os
   44 px são a regra do toque e ficam nas larguras de telemóvel. */
const ALVO_PONTEIRO = 32;

/* Os pontos representativos, lidos do artefacto uma vez. É o mesmo ficheiro em
   que a célula M6 vai buscar o alvo dos seus cliques, e o mesmo ponto: o que a
   régua mede é o alvo à volta do sítio onde ela clica. */
const PONTOS_DAS_UNIDADES = Object.fromEntries(
  JSON.parse(fs.readFileSync(path.join(RAIZ, 'mapa', 'pais.json'), 'utf8')).unidades.map((u) => [
    u.slug,
    u.ponto,
  ]),
);

/* AS LARGURAS DE TELEMÓVEL QUE A CASA SERVE, do iPhone SE aos telefones largos.
   A folha dá ao mapa a largura da JANELA abaixo de 640 (I81), e por isso cada
   uma destas é ao mesmo tempo a janela e a largura do desenho. */
const TELEMOVEIS = [320, 360, 390, 430];
const LIMIAR_DA_JANELA = 640;

/* UM CLIQUE QUE MUDA DE PÁGINA ESPERA-SE ANTES DE SE DAR, E NÃO DEPOIS.
   `waitForLoadState('load')` a seguir a um clique devolve na hora: a página
   ACTUAL já está carregada, e a viagem ainda nem começou. Medido na primeira
   corrida desta régua: dez cliques certos deram dez endereços por mudar, e a
   célula acusou o desenho de um defeito que era da medição. A espera arma-se
   antes do clique, como o Playwright manda. */
async function clica(p, ponto) {
  const viagem = p.waitForNavigation({ waitUntil: 'load' }).catch(() => null);
  await p.mouse.click(ponto.x, ponto.y);
  await viagem;
}

/* ---------------------------------------------------------------------------
 * O QUADRADO INSCRITO, MEDIDO NO NAVEGADOR (I82)
 * ---------------------------------------------------------------------------
 * Corre dentro da página porque `isPointInFill` é do elemento e não do ficheiro:
 * o que se pergunta é se um ponto do ECRÃ cai dentro da forma tal como o
 * navegador a desenha, com a folha, o `viewBox` e a escala pelo meio. O ponto
 * chega em unidades do campo (é o ponto representativo do artefacto) e a escala
 * lê-se da matriz do próprio `svg`, que é a mesma conversão que a célula M6 usa
 * para clicar.
 *
 * A GRELHA TEM 2 px DE PASSO, e é uma escolha com custo escrito: um passo maior
 * deixaria passar um entalhe estreito, e um passo menor multiplica as chamadas
 * sem mudar a resposta a esta escala (o traço do desenho tem 1 px). O lado que
 * se devolve é múltiplo do passo, e por isso a régua arredonda PARA BAIXO: um
 * alvo de 44 px medido assim tem pelo menos 44 px.
 * ------------------------------------------------------------------------- */
const QUADRADO_INSCRITO = ({ pontos, PASSO }) => {
  const svg = document.querySelector('[data-mapa-areas]');
  const inv = svg.getScreenCTM().inverse();
  const p0 = new DOMPoint(0, 0).matrixTransform(inv);
  const p1 = new DOMPoint(1, 0).matrixTransform(inv);
  const u = Math.hypot(p1.x - p0.x, p1.y - p0.y); // unidades do campo por px de ecrã
  const passo = PASSO * u;
  return Object.fromEntries(
    [...document.querySelectorAll('[data-areas] .uni')].map((el) => {
      const slug = el.getAttribute('data-unidade');
      const bb = el.getBBox();
      const [px, py] = pontos[slug];
      /* A grelha alinha-se ao ponto representativo, para que ele seja um nó dela
         e não um sítio entre dois nós. */
      const x0 = px - Math.ceil((px - bb.x) / passo) * passo;
      const y0 = py - Math.ceil((py - bb.y) / passo) * passo;
      const cols = Math.ceil((bb.x + bb.width - x0) / passo) + 1;
      const rows = Math.ceil((bb.y + bb.height - y0) / passo) + 1;
      const dentro = [];
      for (let r = 0; r < rows; r++) {
        const linha = new Uint8Array(cols);
        for (let c = 0; c < cols; c++) {
          linha[c] = el.isPointInFill(new DOMPoint(x0 + c * passo, y0 + r * passo)) ? 1 : 0;
        }
        dentro.push(linha);
      }
      const ic = Math.round((px - x0) / passo);
      const ir = Math.round((py - y0) / passo);
      /* O quadrado máximo com canto inferior direito em cada nó. */
      const dp = dentro.map((l) => new Int32Array(l.length));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!dentro[r][c]) { dp[r][c] = 0; continue; }
          dp[r][c] = r === 0 || c === 0 ? 1 : 1 + Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]);
        }
      }
      let contem = 0;
      for (let r = ir; r < rows; r++) {
        for (let c = ic; c < cols; c++) {
          const k = dp[r][c];
          if (k <= contem) continue;
          if (r - k + 1 <= ir && c - k + 1 <= ic) contem = k;
        }
      }
      let centrado = 0;
      for (let k = 1; ; k++) {
        let ok = true;
        for (let r = ir - k; r <= ir + k && ok; r++) {
          for (let c = ic - k; c <= ic + k && ok; c++) {
            if (r < 0 || c < 0 || r >= rows || c >= cols || !dentro[r][c]) ok = false;
          }
        }
        if (!ok) break;
        centrado = 2 * k;
      }
      return [
        slug,
        {
          dentro: !!dentro[ir][ic],
          inscrito: Math.max(0, (contem - 1) * PASSO),
          centrado: centrado * PASSO,
        },
      ];
    }),
  );
};

/** O que o navegador vê do mapa das 29, a uma largura. */
async function mapaDoPais(largura) {
  const p = await pagina('/', largura);
  const r = await p.evaluate(() => {
    const svg = document.querySelector('[data-mapa-areas]');
    if (!svg) return { erro: 'a primeira página não tem o mapa das áreas' };
    const caixa = svg.getBoundingClientRect();
    const tela = document.querySelector('.mapa-tela').getBoundingClientRect();
    const areas = [...document.querySelectorAll('[data-areas] .uni')].map((el) => {
      const b = el.getBoundingClientRect();
      return {
        slug: el.getAttribute('data-unidade'),
        nome: el.getAttribute('data-u'),
        parcela: el.getAttribute('data-parcela'),
        lado: Math.max(b.width, b.height),
      };
    });
    const daLista = [...document.querySelectorAll('[data-mapa-ilhas] [data-lista-porta]')];
    return {
      caixa: { w: caixa.width, h: caixa.height },
      tela: tela.width,
      janela: window.innerWidth,
      areas,
      naLista: [...new Set(daLista.map((a) => a.getAttribute('data-lista-porta')))],
      alvosDaLista: daLista.map((a) => {
        const b = a.getBoundingClientRect();
        return { slug: a.getAttribute('data-lista-porta'), h: b.height, w: b.width };
      }),
      ligacoes: document.querySelectorAll('[data-areas] a.uni-porta').length,
    };
  });
  if (!r.erro) {
    const inscritos = await p.evaluate(QUADRADO_INSCRITO, { pontos: PONTOS_DAS_UNIDADES, PASSO: 2 });
    for (const a of r.areas) Object.assign(a, inscritos[a.slug]);
  }
  await p.__ctx.close();
  return r;
}

async function mediuOPais(largura, id) {
  const r = await mapaDoPais(largura);
  if (r.erro) return void conta(`${id} · o mapa das 29 a ${largura}`, false, r.erro);

  /* O ALVO É O QUADRADO INSCRITO (I82), e a caixa fica ao lado para que a
     diferença entre as duas medidas se veja em números e não em prosa. */
  const chegam = r.areas.filter((a) => a.inscrito >= ALVO);
  const naoChegam = r.areas.filter((a) => a.inscrito < ALVO);
  const semRede = naoChegam.filter((a) => !r.naLista.includes(a.slug));
  const alvoDaLista = largura >= 1024 ? ALVO_PONTEIRO : ALVO;
  const listaCurta = r.alvosDaLista.filter((a) => a.h < alvoDaLista);
  const porCaixa = r.areas.filter((a) => a.lado >= ALVO);
  const foraDoPonto = r.areas.filter((a) => !a.dentro);

  medidas[`pais_${largura}`] = {
    janela: r.janela,
    tela: Number(r.tela.toFixed(2)),
    caixa: [Number(r.caixa.w.toFixed(2)), Number(r.caixa.h.toFixed(2))],
    areas: r.areas.length,
    ligacoes: r.ligacoes,
    chegamPorAreaInscrita: chegam.length,
    chegamPorCaixa: porCaixa.length,
    naLista: r.naLista.length,
    unidades: r.areas
      .slice()
      .sort((x, y) => y.inscrito - x.inscrito)
      .map((a) => ({
        nome: a.nome,
        parcela: a.parcela,
        caixa: Number(a.lado.toFixed(1)),
        inscrito: a.inscrito,
        centrado: a.centrado,
        naLista: r.naLista.includes(a.slug),
      })),
  };

  conta(
    `${id}a · a ${largura}, o mapa tem as 29 áreas e as 29 ligações`,
    r.areas.length === 29 && r.ligacoes === 29,
    `janela ${r.janela} · tela ${r.tela.toFixed(1)} px · desenho ${r.caixa.w.toFixed(1)} × ${r.caixa.h.toFixed(1)} px · ${r.areas.length} áreas · ${r.ligacoes} ligações`,
  );
  conta(
    `${id}b · a ${largura}, cada unidade abaixo de ${ALVO} px de área inscrita tem o nome numa lista`,
    semRede.length === 0,
    semRede.length === 0
      ? `${chegam.length}/29 chegam aos ${ALVO} px de quadrado inscrito (pela caixa seriam ${porCaixa.length}) · ${naoChegam.length} não chegam e as ${r.naLista.length} da lista cobrem-nas`
      : `sem rede: ${semRede.map((a) => `${a.nome} ${a.inscrito}px`).join(', ')}`,
  );
  conta(
    `${id}c · a ${largura}, cada nome da lista é um alvo de ${alvoDaLista} px`,
    r.naLista.length > 0 && listaCurta.length === 0,
    listaCurta.length === 0
      ? `${r.alvosDaLista.length} nomes, o mais baixo ${Math.min(...r.alvosDaLista.map((a) => a.h)).toFixed(0)} px de altura`
      : `${listaCurta.length} abaixo de ${alvoDaLista}`,
  );
  conta(
    `${id}d · a ${largura}, o ponto representativo cai dentro da sua área`,
    foraDoPonto.length === 0,
    foraDoPonto.length === 0
      ? `29/29 pontos dentro da própria área · o maior quadrado inscrito vai de ${Math.min(...r.areas.map((a) => a.inscrito))} a ${Math.max(...r.areas.map((a) => a.inscrito))} px`
      : `fora: ${foraDoPonto.map((a) => a.nome).join(', ')}`,
  );
  /* ABAIXO DE 640 O MAPA MEDE A JANELA (I81). É a decisão desta passagem, e é
     medível: a tela toma a largura da janela em vez da coluna, que é a janela
     menos duas goteiras. Acima do limiar a célula não corre, porque ali a folha
     manda outra coisa e essa outra coisa está medida nas células a, b e c. */
  if (largura < LIMIAR_DA_JANELA) {
    conta(
      `${id}e · a ${largura}, a tela do mapa mede a janela e não a coluna`,
      Math.abs(r.tela - r.janela) < 0.5,
      `tela ${r.tela.toFixed(1)} px numa janela de ${r.janela} px (a coluna mede ${(r.janela - r.tela).toFixed(1)} px menos)`,
    );
  }
}

/* ------------------------------------------------------------------ M1 e M2 */
await mediuOPais(1280, 'M1');
for (const w of TELEMOVEIS) await mediuOPais(w, `M2·${w}`);

/* ---------------------------------------------------------------------- M3 */
const DISTRITOS_MEDIDOS = ['lisboa', 'aveiro', 'ilha-de-sao-miguel'];
for (const slug of DISTRITOS_MEDIDOS) {
  for (const largura of [1280, 390]) {
    const p = await pagina(`/distritos/${slug}`, largura);
    const r = await p.evaluate(() => {
      const svg = document.querySelector('[data-mapa-concelhos]');
      const caixa = svg.getBoundingClientRect();
      const areas = [...document.querySelectorAll('[data-areas] .uni')].map((el) => {
        const b = el.getBoundingClientRect();
        return {
          slug: el.getAttribute('data-caop'),
          nome: el.getAttribute('data-m'),
          lado: Math.max(b.width, b.height),
        };
      });
      const lista = [...document.querySelectorAll('#concelhos li a')].map((a) => {
        const b = a.getBoundingClientRect();
        return { texto: a.textContent.trim(), h: b.height };
      });
      return { caixa: { w: caixa.width, h: caixa.height }, areas, lista };
    });
    await p.__ctx.close();

    const naoChegam = r.areas.filter((a) => a.lado < ALVO);
    medidas[`distrito_${slug}_${largura}`] = {
      caixa: [Number(r.caixa.w.toFixed(1)), Number(r.caixa.h.toFixed(1))],
      concelhos: r.areas.length,
      naLista: r.lista.length,
      naoChegam: naoChegam.map((a) => `${a.nome} ${a.lado.toFixed(1)}px`),
    };
    conta(
      `M3 · ${slug} a ${largura}: a caixa do mapa, e a lista com todos os concelhos`,
      r.lista.length === r.areas.length && r.caixa.h <= 560.5,
      `caixa ${r.caixa.w.toFixed(1)} × ${r.caixa.h.toFixed(1)} px · ${r.areas.length} áreas · ${r.lista.length} na lista · ${naoChegam.length} abaixo de ${ALVO} px${naoChegam.length ? ` (${naoChegam.map((a) => a.nome).join(', ')})` : ''}`,
    );
  }
}

/* ---------------------------------------------------------------------- M4 */
{
  const bytesDosCaminhos = (rel) => {
    const html = fs.readFileSync(path.join(DIST, rel), 'utf8');
    return [...html.matchAll(/ d="([^"]+)"/g)].reduce((n, m) => n + m[1].length, 0);
  };
  const peso = (rel) => fs.statSync(path.join(DIST, rel)).size;
  const paginasDeDistrito = fs
    .readdirSync(path.join(DIST, 'distritos'))
    .filter((n) => fs.statSync(path.join(DIST, 'distritos', n)).isDirectory())
    .map((n) => ({
      slug: n,
      caminhos: bytesDosCaminhos(path.join('distritos', n, 'index.html')),
      peso: peso(path.join('distritos', n, 'index.html')),
    }))
    .sort((a, b) => b.caminhos - a.caminhos);
  const maior = paginasDeDistrito[0];
  medidas.pesos = {
    inicio: peso('index.html'),
    inicio_caminhos: bytesDosCaminhos('index.html'),
    maior_distrito: maior,
  };
  conta(
    'M4a · a primeira página, com o desenho das 29 dentro',
    true,
    `${(medidas.pesos.inicio / 1024).toFixed(1)} KB de HTML, ${(medidas.pesos.inicio_caminhos / 1024).toFixed(1)} KB de caminhos`,
  );
  conta(
    'M4b · a maior página de distrito, com no máximo 25 KB de caminhos',
    maior.caminhos <= 25 * 1024,
    `${maior.slug}: ${(maior.caminhos / 1024).toFixed(1)} KB de caminhos, ${(maior.peso / 1024).toFixed(1)} KB de HTML`,
  );
}

/* ---------------------------------------------------------------------- M5 */
{
  const p = await pagina('/', 1280);
  const r = await p.evaluate(() => {
    const areas = [...document.querySelectorAll('[data-areas] .uni')];
    const estilo = (el) => {
      const c = getComputedStyle(el);
      return [c.fill, c.stroke, c.strokeWidth, c.opacity].join('|');
    };
    const distintos = [...new Set(areas.map(estilo))];
    return { n: areas.length, distintos };
  });
  /* O rato e o teclado: o que muda é o contorno e só ele. */
  const antes = await p.evaluate(() => {
    const c = getComputedStyle(document.querySelector('[data-areas] .uni'));
    return { fill: c.fill, stroke: c.stroke, w: c.strokeWidth };
  });
  await p.hover('[data-areas] a.uni-porta');
  const comRato = await p.evaluate(() => {
    const c = getComputedStyle(document.querySelector('[data-areas] .uni'));
    return { fill: c.fill, stroke: c.stroke, w: c.strokeWidth };
  });
  await p.__ctx.close();

  conta(
    'M5a · as 29 áreas têm o mesmo desenho (Emenda 10)',
    r.distintos.length === 1,
    r.distintos.length === 1
      ? `um estilo só para as ${r.n}: ${r.distintos[0]}`
      : `${r.distintos.length} estilos: ${r.distintos.join(' ; ')}`,
  );
  conta(
    'M5b · ao passar o rato muda o contorno, e só ele (Emenda 20b)',
    comRato.fill === antes.fill &&
      comRato.stroke === antes.stroke &&
      comRato.w !== antes.w,
    `traço ${antes.w} → ${comRato.w} · enchimento ${antes.fill} (igual) · cor ${antes.stroke} (igual)`,
  );

  /* Nenhuma cor de estatuto no desenho: as três do sítio, lidas dos tokens. */
  const p2 = await pagina('/', 1280);
  const semEstatuto = await p2.evaluate(() => {
    /* ---------------------------------------------------------------------
       UMA COR COMPARA-SE NA FORMA EM QUE O NAVEGADOR A DEVOLVE
       ---------------------------------------------------------------------
       `getPropertyValue('--amber')` devolve o texto do token («#8a5a00») e
       `getComputedStyle(el).stroke` devolve «rgb(138, 90, 0)»: comparar os dois
       nunca dá igual, e esta célula passava com a cor de estatuto pintada na
       área. Foi o estrago plantado que o mostrou, e é por isso que ele existe.
       O token resolve-se por uma sonda: um elemento a que se dá
       `color: var(--token)` e de quem se lê a cor computada. */
    const resolveCores = (nomes) => {
      const sonda = document.createElement('span');
      sonda.style.position = 'absolute';
      sonda.style.visibility = 'hidden';
      document.body.appendChild(sonda);
      const raiz = getComputedStyle(document.documentElement);
      const out = [];
      for (const n of nomes) {
        /* UM TOKEN QUE NÃO EXISTE NÃO É UMA COR DE ESTATUTO. `color: var(--x)`
           com `--x` por declarar é uma declaração inválida: a sonda fica com a
           cor herdada, que é a tinta do sítio, e a célula acusava a área de ter
           a cor de um estatuto quando o que ela tem é a tinta. Só entram os
           tokens que a raiz declara; `--amber-palavra` não é um deles. */
        if (!raiz.getPropertyValue(n).trim()) continue;
        sonda.style.color = '';
        sonda.style.color = `var(${n})`;
        const c = getComputedStyle(sonda).color;
        if (c && !out.includes(c)) out.push(c);
      }
      sonda.remove();
      return out;
    };
    const cores = resolveCores(['--amber', '--cobalt', '--cobalt-palavra', '--amber-palavra']);
    const areas = [...document.querySelectorAll('[data-areas] .uni')];
    const usadas = new Set();
    for (const el of areas) {
      const c = getComputedStyle(el);
      usadas.add(c.fill);
      usadas.add(c.stroke);
    }
    return { cores, usadas: [...usadas] };
  });
  await p2.__ctx.close();
  const colisao = semEstatuto.usadas.filter((u) => semEstatuto.cores.includes(u));
  conta(
    'M5c · nenhuma cor de estatuto no desenho das áreas',
    colisao.length === 0,
    `${semEstatuto.cores.length} cores de estatuto declaradas, ${colisao.length} usadas nas áreas`,
  );
}

/* ---------------------------------------------------------------------- M6 */
/* ---------------------------------------------------------------------------
 * O CLIQUE VAI AO PONTO REPRESENTATIVO, E NÃO AO CENTRO DA CAIXA
 * ---------------------------------------------------------------------------
 * A primeira forma desta célula clicava no centro da caixa de cada área, e três
 * dos dez cliques não abriam nada: Faro é um rectângulo deitado cujo centro cai
 * no mar, a caixa da Ilha da Madeira vai da costa norte às Selvagens e o seu
 * centro é oceano, e o mesmo se passa com Cascais dentro do distrito de Lisboa.
 * Não era um defeito do desenho: era a medição a supor que o centro de uma caixa
 * está dentro da forma que ela envolve, o que numa costa não é verdade.
 *
 * O artefacto traz a resposta certa e traz de propósito: `ponto` é o ponto
 * representativo de cada área, achado pelo motor por lançamento de raio sobre o
 * maior anel, e provado dentro da área em 337 de 337 (MAPA.md §4). Clicar nele é
 * clicar onde a mão vai, e é ao mesmo tempo a conferência deste lado da fronteira
 * de que esse ponto cai mesmo dentro da área tal como ela se desenha.
 *
 * A CONVERSÃO É A DO PRÓPRIO SVG (`getScreenCTM`), e não uma regra de três sobre
 * o rectângulo do elemento. Num distrito ao alto o `max-height` da folha deixa
 * barras de papel dos dois lados do desenho, e uma regra de três sobre a caixa do
 * elemento apontaria ao lado.
 */
{
  const leArtefacto = (rel) =>
    JSON.parse(fs.readFileSync(path.join(RAIZ, 'mapa', rel), 'utf8'));
  const pais = leArtefacto('pais.json');
  const distritoDeLisboa = leArtefacto('distritos/lisboa.json');

  async function clicaNoPonto(rota, seletorDoSvg, atributo, alvo) {
    const p = await pagina(rota, 1280);
    /* O MAPA VAI À JANELA ANTES DE SE CLICAR NELE. Um rato clica em coordenadas
       da JANELA, e o mapa da primeira página tem 646 px de altura numa janela de
       900 com cabeçalho por cima: o Algarve e a costa de Cascais ficam abaixo do
       fundo, e um clique em y=962 não acerta em nada. Medido: as duas células
       que faltavam eram isto, e não o desenho. */
    const ponto = await p.evaluate(
      ({ sel, xy }) => {
        const svg = document.querySelector(sel);
        svg.scrollIntoView({ block: 'center' });
        const pt = svg.createSVGPoint();
        pt.x = xy[0];
        pt.y = xy[1];
        const s = pt.matrixTransform(svg.getScreenCTM());
        return { x: s.x, y: s.y };
      },
      { sel: seletorDoSvg, xy: alvo.ponto },
    );
    const emCima = await p.evaluate(
      ({ x, y, at }) => {
        const el = document.elementFromPoint(x, y);
        const a = el && el.closest ? el.closest(`[${at}]`) : null;
        return a ? a.getAttribute(at) : null;
      },
      { x: ponto.x, y: ponto.y, at: atributo },
    );
    await clica(p, ponto);
    const para = new URL(p.url()).pathname;
    await p.__ctx.close();
    return { slug: alvo.slug, emCima, para };
  }

  const cliques = [];
  const cincoDoPais = ['lisboa', 'faro', 'braga', 'viseu', 'ilha-da-madeira'].map((slug) =>
    pais.unidades.find((u) => u.slug === slug),
  );
  for (const alvo of cincoDoPais) {
    const r = await clicaNoPonto('/', '[data-mapa-areas]', 'data-uni-porta', alvo);
    cliques.push({ ...r, esperado: `/distritos/${alvo.slug}` });
  }
  const cincoDeLisboa = ['lisboa', 'sintra', 'cascais', 'loures', 'mafra'].map((slug) =>
    distritoDeLisboa.concelhos.find((c) => c.slug === slug),
  );
  for (const alvo of cincoDeLisboa) {
    const r = await clicaNoPonto(
      '/distritos/lisboa',
      '[data-mapa-concelhos]',
      'data-concelho-porta',
      alvo,
    );
    cliques.push({ ...r, esperado: `/municipios/${alvo.slug}` });
  }

  const certos = cliques.filter((c) => c.para === c.esperado);
  const noAlvo = cliques.filter((c) => c.emCima === c.slug);
  medidas.cliques = cliques;
  conta(
    'M6a · dez cliques no ponto representativo de dez áreas abrem dez páginas',
    certos.length === 10,
    `${certos.length}/10 · ${cliques.map((c) => `${c.slug}→${c.para}`).join(' · ')}`,
  );
  conta(
    'M6b · e o ponto representativo cai dentro da área que o traz',
    noAlvo.length === 10,
    `${noAlvo.length}/10 pontos caem na sua própria área`,
  );

  /* E pelo teclado: o foco pousa numa área e o Enter abre a página dela. */
  const p = await pagina('/', 1280);
  const chegou = await p.evaluate(() => {
    const a = document.querySelector('[data-areas] a.uni-porta');
    a.focus();
    return {
      focado: document.activeElement === a,
      destino: a.getAttribute('href'),
      contornoNoFoco: getComputedStyle(a.querySelector('.uni')).strokeWidth,
    };
  });
  const viagem = p.waitForNavigation({ waitUntil: 'load' }).catch(() => null);
  await p.keyboard.press('Enter');
  await viagem;
  const depois = new URL(p.url()).pathname;
  await p.__ctx.close();
  conta(
    'M6c · pelo teclado: o foco pousa numa área e o Enter abre a página dela',
    chegou.focado && depois === chegou.destino,
    `foco em ${chegou.destino} (contorno ${chegou.contornoNoFoco}), Enter → ${depois}`,
  );
}

/* ---------------------------------------------------------------------- M9 */
/* ---------------------------------------------------------------------------
 * NENHUM ATRIBUTO REPETIDO NUM DESENHO DE MAPA
 * ---------------------------------------------------------------------------
 * Achado pela medição cega: depois de o `<svg>` do mapa ter sido partido em dois
 * ramos (as 29 áreas na primeira página, os 308 pontos no cartão localizador), o
 * ramo dos pontos ficou com `class` e `viewBox` escritos DUAS VEZES. O
 * analisador de HTML guarda a primeira ocorrência e deita a segunda fora, e por
 * isso nada se via na página; mas as 616 páginas de concelho levavam bytes a
 * mais, e a Emenda 20d diz que o cartão localizador não muda.
 *
 * UMA REPETIÇÃO INERTE É UMA REPETIÇÃO NA MESMA, e é o tipo de defeito que só
 * uma leitura dos bytes apanha: nem o navegador se queixa, nem o portão de HTML,
 * que lê a árvore e não a fonte. Esta célula lê a FONTE de cada `<svg>` de mapa
 * do `dist/` e de cada etiqueta lá dentro, e conta os nomes de atributo.
 *
 * Lê o disco e não o navegador, e por isso o seu estrago plantado é aplicado à
 * cadeia em memória, e não pelo servidor.
 * --------------------------------------------------------------------------- */
const MARCAS_DO_MAPA = ['data-mapa', 'data-mapa-areas', 'data-mapa-concelhos'];

function paginasComMapa() {
  const out = [];
  const anda = (dir) => {
    for (const nome of fs.readdirSync(dir).sort()) {
      const abs = path.join(dir, nome);
      if (fs.statSync(abs).isDirectory()) anda(abs);
      else if (nome.endsWith('.html')) {
        const html = fs.readFileSync(abs, 'utf8');
        if (MARCAS_DO_MAPA.some((m) => html.includes(m))) {
          out.push({ rel: path.relative(DIST, abs), html });
        }
      }
    }
  };
  anda(DIST);
  return out;
}

/**
 * Os nomes de atributo de uma etiqueta de abertura, lidos da fonte.
 *
 * PERCORRE A ETIQUETA E SALTA OS VALORES ENTRE ASPAS, e não é um requinte: a
 * primeira forma desta função era uma expressão regular sobre a etiqueta
 * inteira, e apanhava as palavras de dentro dos valores. `aria-label="Point map
 * of the municipalities of Portugal."` dava-lhe «of» duas vezes, e a célula
 * saiu a vermelho em 4 929 etiquetas de páginas que não têm defeito nenhum. Um
 * atributo é o que está FORA das aspas, e é isso que este ciclo lê.
 */
function nomesDeAtributo(etiqueta) {
  const corpo = etiqueta
    .replace(/^<[a-zA-Z][-a-zA-Z0-9:]*/, '')
    .replace(/\/?>$/, '');
  const nomes = [];
  let i = 0;
  const espaco = (c) => c === ' ' || c === '\n' || c === '\t' || c === '\r';
  while (i < corpo.length) {
    while (i < corpo.length && espaco(corpo[i])) i++;
    const inicio = i;
    while (i < corpo.length && !espaco(corpo[i]) && corpo[i] !== '=') i++;
    const nome = corpo.slice(inicio, i);
    if (nome) nomes.push(nome.toLowerCase());
    while (i < corpo.length && espaco(corpo[i])) i++;
    if (corpo[i] !== '=') continue;
    i++;
    while (i < corpo.length && espaco(corpo[i])) i++;
    const aspa = corpo[i];
    if (aspa === '"' || aspa === "'") {
      i++;
      while (i < corpo.length && corpo[i] !== aspa) i++;
      i++;
    } else {
      while (i < corpo.length && !espaco(corpo[i])) i++;
    }
  }
  return nomes;
}

/** Os nomes de atributo repetidos numa etiqueta de abertura. */
function atributosRepetidos(etiqueta) {
  const vezes = new Map();
  for (const n of nomesDeAtributo(etiqueta)) vezes.set(n, (vezes.get(n) ?? 0) + 1);
  return [...vezes.entries()].filter(([, n]) => n > 1).map(([n]) => n);
}

/** Todas as repetições dentro dos `<svg>` de mapa de uma lista de páginas. */
function repeticoesNosMapas(paginas) {
  const achados = [];
  for (const pg of paginas) {
    for (const bloco of pg.html.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/g)) {
      const svg = bloco[0];
      if (!MARCAS_DO_MAPA.some((m) => svg.includes(m))) continue;
      for (const et of svg.matchAll(/<[a-zA-Z][^>]*>/g)) {
        const repetidos = atributosRepetidos(et[0]);
        if (repetidos.length) {
          achados.push({ rel: pg.rel, etiqueta: et[0].slice(0, 90), repetidos });
        }
      }
    }
  }
  return achados;
}

{
  const paginas = paginasComMapa();
  const achados = repeticoesNosMapas(paginas);
  medidas.repeticoes = { paginas: paginas.length, achados: achados.length };
  conta(
    'M9 · nenhum atributo repetido num `<svg>` de mapa do dist/',
    achados.length === 0,
    achados.length === 0
      ? `${paginas.length} páginas com mapa varridas, 0 etiquetas com um atributo escrito duas vezes`
      : `${achados.length} etiqueta(s): ${achados
          .slice(0, 3)
          .map((a) => `${a.rel} <${a.repetidos.join(', ')}> «${a.etiqueta}»`)
          .join(' · ')}`,
  );
}

/* ---------------------------------------------------------------------- M10 */
/* ---------------------------------------------------------------------------
 * A LISTA POR BAIXO DO MAPA ESTÁ POR ORDEM ALFABÉTICA, DENTRO DE CADA PARCELA
 * ---------------------------------------------------------------------------
 * A leitura de fora achou «Évora» no fim da lista das duas edições, depois de
 * Viseu, e a causa não era uma ordenação por cobertura: era a ordem em que as
 * unidades vêm no artefacto, que é a dos pontos de código, onde É cai depois de
 * Z e um T maiúsculo antes de um d minúsculo.
 *
 * A CÉLULA COMPARA COM A COLAÇÃO DA LÍNGUA, que é a mesma que a lista usa para
 * se ordenar. Não é uma tautologia: o que ela mede é a ORDEM RENDIDA, lida do
 * HTML construído, contra a ordem que a colação dá aos mesmos nomes. Entre as
 * duas está o componente, e é lá que a ordem se pode perder outra vez.
 * --------------------------------------------------------------------------- */
async function mediuAOrdemDaLista(rota, id) {
  const p = await pagina(rota, 1280);
  const grupos = await p.evaluate(() =>
    [...document.querySelectorAll('[data-parcela-lista]')].map((g) => ({
      parcela: g.getAttribute('data-parcela-lista'),
      nomes: [...g.querySelectorAll('[data-lista-porta]')].map((a) => a.textContent.trim()),
    })),
  );
  await p.__ctx.close();
  const foraDeOrdem = grupos.filter((g) => {
    const ordenada = [...g.nomes].sort((x, y) => x.localeCompare(y, 'pt'));
    return g.nomes.join('|') !== ordenada.join('|');
  });
  conta(
    `${id} · em ${rota}, a lista de cada parcela está por ordem alfabética`,
    grupos.length > 0 && foraDeOrdem.length === 0,
    foraDeOrdem.length === 0
      ? `${grupos.length} parcelas, ${grupos.reduce((n, g) => n + g.nomes.length, 0)} nomes · ${grupos
          .map((g) => `${g.parcela}: ${g.nomes[0]} … ${g.nomes[g.nomes.length - 1]}`)
          .join(' · ')}`
      : foraDeOrdem
          .map((g) => `${g.parcela} fora de ordem: ${g.nomes.join(', ')}`)
          .join(' | '),
  );
}
await mediuAOrdemDaLista('/', 'M10a');
await mediuAOrdemDaLista('/en', 'M10b');

/* ------------------------------------------------------------------ M7 e M8 */
function corre(guiao, args = []) {
  try {
    const saida = execFileSync(process.execPath, [path.join(RAIZ, guiao), ...args], {
      encoding: 'utf8',
      maxBuffer: 128 * 1024 * 1024,
    });
    return { ok: true, saida };
  } catch (e) {
    return { ok: false, saida: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}
{
  const r = corre('scripts/medir-defeitos.mjs', ['--json']);
  let porClassificar = null;
  let autorreferencia = null;
  if (r.ok) {
    const m = JSON.parse(r.saida);
    const rotas = Object.entries(m.frases_da_casa.por_rota);
    porClassificar = rotas.reduce((n, [, x]) => n + x.nao_classificados.length, 0);
    autorreferencia = rotas.reduce((n, [, x]) => n + x.por_classe.autorreferencia, 0);
    medidas.voz = { rotas: rotas.length, porClassificar, autorreferencia };
  }
  conta(
    'M7 · medir-defeitos: nada por classificar, autorreferência 0',
    r.ok && porClassificar === 0 && autorreferencia === 0,
    r.ok
      ? `${medidas.voz.rotas} rotas · ${porClassificar} por classificar · autorreferência ${autorreferencia}`
      : 'a régua não correu',
  );
}
{
  const r = corre('scripts/check-voz.mjs');
  conta('M8 · check:voz verde', r.ok, r.saida.split('\n').filter(Boolean).slice(-3).join(' | '));
}

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS (regra 14)
 * ===========================================================================
 * Cada um é a coisa que uma célula existe para apanhar, posto no HTML servido e
 * em mais lado nenhum. A régua volta a correr as células que ele toca e exige
 * que fiquem vermelhas.
 */
const PLANTAS = [
  {
    nome: 'o mapa encolhido para 200 px na primeira página',
    celulas: ['M1b', 'M2·320e'],
    estrago: (html, rota) =>
      rota === '/' || rota === '/index.html'
        ? html.replace('</head>', '<style>.mapa-tela{width:200px !important;margin-inline:0 !important}</style></head>')
        : html,
  },
  {
    nome: 'os nomes retirados das listas por baixo do mapa',
    celulas: ['M1b', 'M2·320b'],
    estrago: (html, rota) =>
      rota === '/' || rota === '/index.html'
        ? html.replace(
            /<li><a href="\/distritos\/[^"]*" data-lista-porta="[^"]*">[^<]*<\/a><\/li>/g,
            '',
          )
        : html,
  },
  {
    /* O ESTRAGO DA I81. A folha volta a dar ao mapa a largura da COLUNA abaixo
       de 640, que é o que ela dizia até esta passagem: a margem negativa que o
       leva às bordas da caixa de conteúdo é anulada. Numa janela de 320 a tela
       cai de 320 para 284 px, e a célula que mede a decisão sai vermelha. */
    nome: 'o mapa do telemóvel de volta à largura da coluna',
    celulas: ['M2·320e'],
    estrago: (html, rota) =>
      rota === '/' || rota === '/index.html'
        ? html.replace(
            '</head>',
            '<style>@media (max-width:640px){[data-inicio] .mapa-tela{margin-inline:0 !important}}</style></head>',
          )
        : html,
  },
  {
    /* O ESTRAGO DA I82, e é o caso conhecido da medição cega M3. A Ilha da
       Madeira tem uma CAIXA de 186 px a 390 e um quadrado inscrito de 8: pela
       caixa é um alvo folgado, pela área inscrita não é alvo nenhum. Tirar-lhe o
       nome da lista era invisível para a régua antiga e é vermelho para esta,
       que é exactamente a diferença entre as duas medidas. */
    nome: 'o nome da Ilha da Madeira retirado da lista da sua parcela',
    celulas: ['M1b', 'M2·390b'],
    estrago: (html, rota) =>
      rota === '/' || rota === '/index.html'
        ? html.replace(
            /<li><a href="\/distritos\/ilha-da-madeira" data-lista-porta="ilha-da-madeira">[^<]*<\/a><\/li>/g,
            '',
          )
        : html,
  },
  {
    nome: 'uma área pintada com a cor de um estatuto',
    celulas: ['M5a', 'M5c'],
    estrago: (html, rota) =>
      rota === '/' || rota === '/index.html'
        ? html.replace(
            '</head>',
            '<style>[data-unidade="lisboa"]{stroke:var(--amber) !important}</style></head>',
          )
        : html,
  },
  {
    /* A ÚNICA PLANTA QUE NÃO PASSA PELO SERVIDOR, porque a célula que ela apanha
       não passa pelo navegador: a M9 lê os bytes do `dist/`, e o estrago é a
       repetição posta de volta na cadeia em memória. É exactamente o defeito que
       a medição cega achou: `class` e `viewBox` escritos duas vezes no `<svg>`
       do cartão localizador. */
    nome: 'o `class` e o `viewBox` repetidos no `<svg>` do cartão localizador',
    celulas: ['M9'],
    emMemoria: () => {
      const paginas = paginasComMapa().map((pg) => ({ ...pg }));
      const alvo = paginas.find((pg) => pg.rel.startsWith('municipios/evora/'));
      alvo.html = alvo.html.replace(
        '<svg class="mapa-svg" viewBox="0 0 600 790"',
        '<svg class="mapa-svg" viewBox="0 0 600 790" class="mapa-svg" viewBox="0 0 600 790"',
      );
      const achados = repeticoesNosMapas(paginas);
      conta(
        'M9 · nenhum atributo repetido num `<svg>` de mapa do dist/',
        achados.length === 0,
        `${achados.length} etiqueta(s): ${achados
          .map((a) => `${a.rel} <${a.repetidos.join(', ')}>`)
          .join(' · ')}`,
      );
    },
  },
  {
    /* O ESTRAGO DA X2. Um nome muda de sítio na lista do continente, e é o
       defeito que a leitura de fora achou: «Évora» no fim, depois de Viseu. O
       estrago tira-o de onde ele agora está e volta a pô-lo no fim. */
    nome: 'um nome movido para o fim da lista do continente',
    celulas: ['M10a'],
    estrago: (html, rota) => {
      if (rota !== '/' && rota !== '/index.html') return html;
      const item = '<li><a href="/distritos/evora" data-lista-porta="evora">Évora</a></li>';
      if (!html.includes(item)) return html;
      const sem = html.replace(item, '');
      const fim = sem.indexOf('</ul>', sem.indexOf('data-parcela-lista="continente"'));
      return sem.slice(0, fim) + item + sem.slice(fim);
    },
  },
  {
    nome: 'o destino de uma área trocado pelo de outra',
    celulas: ['M6a'],
    estrago: (html, rota) =>
      rota === '/' || rota === '/index.html'
        ? html.replace('href="/distritos/faro"', 'href="/distritos/beja"')
        : html,
  },
];

if (VERMELHOS) {
  console.log('');
  let falhou = false;
  for (const planta of PLANTAS) {
    celulas = [];
    medidas = {};
    ESTRAGO = planta.estrago ?? null;
    if (planta.emMemoria) planta.emMemoria();
    /* Só se voltam a correr as células que a planta toca: uma régua inteira por
       planta seria quatro corridas de tudo para provar quatro linhas. */
    if (planta.celulas.some((c) => c.startsWith('M1'))) await mediuOPais(1280, 'M1');
    for (const w of TELEMOVEIS) {
      if (planta.celulas.some((c) => c.startsWith(`M2·${w}`))) await mediuOPais(w, `M2·${w}`);
    }
    if (planta.celulas.some((c) => c.startsWith('M5'))) {
      const p = await pagina('/', 1280);
      const r = await p.evaluate(() => {
        const resolveCores = (nomes) => {
          const sonda = document.createElement('span');
          sonda.style.position = 'absolute';
          sonda.style.visibility = 'hidden';
          document.body.appendChild(sonda);
          const raiz = getComputedStyle(document.documentElement);
          const out = [];
          for (const n of nomes) {
            /* UM TOKEN QUE NÃO EXISTE NÃO É UMA COR DE ESTATUTO. `color: var(--x)`
               com `--x` por declarar é uma declaração inválida: a sonda fica com a
               cor herdada, que é a tinta do sítio, e a célula acusava a área de ter
               a cor de um estatuto quando o que ela tem é a tinta. Só entram os
               tokens que a raiz declara; `--amber-palavra` não é um deles. */
            if (!raiz.getPropertyValue(n).trim()) continue;
            sonda.style.color = '';
            sonda.style.color = `var(${n})`;
            const c = getComputedStyle(sonda).color;
            if (c && !out.includes(c)) out.push(c);
          }
          sonda.remove();
          return out;
        };
        const areas = [...document.querySelectorAll('[data-areas] .uni')];
        const estilo = (el) => {
          const c = getComputedStyle(el);
          return [c.fill, c.stroke, c.strokeWidth, c.opacity].join('|');
        };
        const cores = resolveCores(['--amber', '--cobalt', '--cobalt-palavra', '--amber-palavra']);
        const usadas = new Set();
        for (const el of areas) {
          const c = getComputedStyle(el);
          usadas.add(c.fill);
          usadas.add(c.stroke);
        }
        return { distintos: [...new Set(areas.map(estilo))], cores, usadas: [...usadas] };
      });
      await p.__ctx.close();
      conta('M5a · as 29 áreas têm o mesmo desenho', r.distintos.length === 1, `${r.distintos.length} estilos`);
      const colisao = r.usadas.filter((u) => r.cores.includes(u));
      conta('M5c · nenhuma cor de estatuto', colisao.length === 0, `${colisao.length} colisões`);
    }
    if (planta.celulas.includes('M10a')) await mediuAOrdemDaLista('/', 'M10a');
    if (planta.celulas.includes('M6a')) {
      const p = await pagina('/', 1280);
      const pais = JSON.parse(fs.readFileSync(path.join(RAIZ, 'mapa', 'pais.json'), 'utf8'));
      const faro = pais.unidades.find((u) => u.slug === 'faro');
      const ponto = await p.evaluate((xy) => {
        const svg = document.querySelector('[data-mapa-areas]');
        svg.scrollIntoView({ block: 'center' });
        const pt = svg.createSVGPoint();
        pt.x = xy[0];
        pt.y = xy[1];
        const s = pt.matrixTransform(svg.getScreenCTM());
        return { x: s.x, y: s.y };
      }, faro.ponto);
      await clica(p, ponto);
      const para = new URL(p.url()).pathname;
      await p.__ctx.close();
      conta('M6a · o clique numa área abre a página dela', para === '/distritos/faro', `faro → ${para}`);
    }
    const tocadas = celulas.filter((c) => planta.celulas.some((n) => c.nome.startsWith(n)));
    const vermelhas = tocadas.filter((c) => !c.passa);
    const apanhou = vermelhas.length > 0;
    if (!apanhou) falhou = true;
    console.log(
      `  ${apanhou ? verde('vermelho ✓') : vermelho('NÃO APANHOU ✗')}  ${planta.nome}`,
    );
    for (const c of vermelhas) console.log(cinza(`              ${c.nome} · ${c.prova}`));
  }
  ESTRAGO = null;
  console.log('');
  await nav.close();
  servidor.close();
  process.exit(falhou ? 1 : 0);
}

/* ------------------------------------------------------------------- a saída */
await nav.close();
servidor.close();

console.log('');
for (const c of celulas) {
  console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}`);
  console.log(cinza(`      ${c.prova}`));
}
const falhadas = celulas.filter((c) => !c.passa);
console.log('');
console.log(
  falhadas.length === 0
    ? verde(`  ${celulas.length} células, todas verdes.\n`)
    : vermelho(`  ${falhadas.length} de ${celulas.length} células vermelhas.\n`),
);

if (FICHEIRO_JSON) {
  fs.writeFileSync(
    path.resolve(RAIZ, String(FICHEIRO_JSON)),
    JSON.stringify({ celulas, medidas }, null, 2),
  );
}
process.exit(falhadas.length === 0 ? 0 : 1);
