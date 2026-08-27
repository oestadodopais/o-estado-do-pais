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
 * M1 e M2 · os alvos das 29, a 1280 e a 390. Mede-se a caixa de cada área NO
 * NAVEGADOR (`getBoundingClientRect` do `<path>`), e não a caixa do artefacto
 * multiplicada por uma escala: o que interessa é o que o dedo encontra, e entre
 * o artefacto e o dedo estão a folha, o `viewBox` e a largura da coluna. Para
 * cada unidade abaixo dos 44 px, exige-se o seu nome numa lista por baixo da
 * moldura (Emenda 20c). Uma unidade abaixo dos 44 e FORA de uma moldura é uma
 * falha: a emenda escreve que cada distrito é alvo.
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

/** O que o navegador vê do mapa das 29, a uma largura. */
async function mapaDoPais(largura) {
  const p = await pagina('/', largura);
  const r = await p.evaluate((alvo) => {
    const svg = document.querySelector('[data-mapa-areas]');
    if (!svg) return { erro: 'a primeira página não tem o mapa das áreas' };
    const caixa = svg.getBoundingClientRect();
    const areas = [...document.querySelectorAll('[data-areas] .uni')].map((el) => {
      const b = el.getBoundingClientRect();
      return {
        slug: el.getAttribute('data-unidade'),
        nome: el.getAttribute('data-u'),
        parcela: el.getAttribute('data-parcela'),
        lado: Math.max(b.width, b.height),
      };
    });
    const naLista = new Set(
      [...document.querySelectorAll('[data-mapa-ilhas] [data-ilha-porta]')].map((a) =>
        a.getAttribute('data-ilha-porta'),
      ),
    );
    const alvosDaLista = [...document.querySelectorAll('[data-mapa-ilhas] [data-ilha-porta]')].map(
      (a) => {
        const b = a.getBoundingClientRect();
        return { slug: a.getAttribute('data-ilha-porta'), h: b.height, w: b.width };
      },
    );
    return {
      caixa: { w: caixa.width, h: caixa.height },
      areas,
      naLista: [...naLista],
      alvosDaLista,
      ligacoes: document.querySelectorAll('[data-areas] a.uni-porta').length,
    };
  }, ALVO);
  await p.__ctx.close();
  return r;
}

async function mediuOPais(largura, id) {
  const r = await mapaDoPais(largura);
  if (r.erro) return void conta(`${id} · o mapa das 29 a ${largura}`, false, r.erro);

  const chegam = r.areas.filter((a) => a.lado >= ALVO);
  const naoChegam = r.areas.filter((a) => a.lado < ALVO);
  const semRede = naoChegam.filter((a) => !r.naLista.includes(a.slug));
  const listaCurta = r.alvosDaLista.filter((a) => a.h < ALVO);

  medidas[`pais_${largura}`] = {
    caixa: [Number(r.caixa.w.toFixed(2)), Number(r.caixa.h.toFixed(2))],
    areas: r.areas.length,
    ligacoes: r.ligacoes,
    chegam: chegam.length,
    naoChegam: naoChegam.map((a) => `${a.nome} ${a.lado.toFixed(1)}px`),
    menorQueChega: chegam.sort((x, y) => x.lado - y.lado)[0],
    naLista: r.naLista.length,
  };

  conta(
    `${id}a · a ${largura}, o mapa mede a coluna e tem as 29 ligações`,
    r.areas.length === 29 && r.ligacoes === 29,
    `caixa ${r.caixa.w.toFixed(1)} × ${r.caixa.h.toFixed(1)} px · ${r.areas.length} áreas · ${r.ligacoes} ligações`,
  );
  conta(
    `${id}b · a ${largura}, cada unidade abaixo de ${ALVO} px tem o nome na lista da sua moldura`,
    semRede.length === 0,
    semRede.length === 0
      ? `${chegam.length}/29 chegam aos ${ALVO} px (a menor: ${medidas[`pais_${largura}`].menorQueChega.nome} ${medidas[`pais_${largura}`].menorQueChega.lado.toFixed(2)} px) · ${naoChegam.length} não chegam e as ${r.naLista.length} da lista cobrem-nas`
      : `sem rede: ${semRede.map((a) => a.nome).join(', ')}`,
  );
  conta(
    `${id}c · a ${largura}, cada nome da lista é um alvo de ${ALVO} px`,
    r.naLista.length > 0 && listaCurta.length === 0,
    listaCurta.length === 0
      ? `${r.alvosDaLista.length} nomes, o mais baixo ${Math.min(...r.alvosDaLista.map((a) => a.h)).toFixed(0)} px de altura`
      : `${listaCurta.length} abaixo de ${ALVO}`,
  );
}

/* ------------------------------------------------------------------ M1 e M2 */
await mediuOPais(1280, 'M1');
await mediuOPais(390, 'M2');

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
    celulas: ['M1b', 'M2b'],
    estrago: (html, rota) =>
      rota === '/' || rota === '/index.html'
        ? html.replace('</head>', '<style>.mapa-tela{width:200px !important}</style></head>')
        : html,
  },
  {
    nome: 'os nomes das ilhas retirados das listas por baixo das molduras',
    celulas: ['M1b', 'M2b'],
    estrago: (html, rota) =>
      rota === '/' || rota === '/index.html'
        ? html.replace(
            /<li><a href="\/distritos\/[^"]*" data-ilha-porta="[^"]*">[^<]*<\/a><\/li>/g,
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
    ESTRAGO = planta.estrago;
    /* Só se voltam a correr as células que a planta toca: uma régua inteira por
       planta seria quatro corridas de tudo para provar quatro linhas. */
    if (planta.celulas.some((c) => c.startsWith('M1'))) await mediuOPais(1280, 'M1');
    if (planta.celulas.some((c) => c.startsWith('M2'))) await mediuOPais(390, 'M2');
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
