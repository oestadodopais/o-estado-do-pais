#!/usr/bin/env node
/**
 * =============================================================================
 * AS RÉGUAS DO BLOCO A DAS CORREÇÕES DE UX (25.08.2026)
 * =============================================================================
 *
 * Uma régua por item do `design/especime-v3/briefs/BRIEF-correcoes-ux-A.md` §2,
 * com o objetivo medido que o brief escreve para cada um. NÃO é um portão: não
 * entra no `npm run build` e não constrói nada. Corre sobre `dist/`, imprime uma
 * linha por régua e SAI COM 0 quando todas passam e com 1 quando alguma falha —
 * ao contrário de `matriz.mjs`, que só imprime, porque estas existem para que um
 * estrago plantado se veja no código de saída.
 *
 *   node tests/inicio/correcoes-a.mjs
 *   node tests/inicio/correcoes-a.mjs --json <ficheiro>
 *   node tests/inicio/correcoes-a.mjs --capturas <dir>   (JPEG, escala 2)
 *
 * ---------------------------------------------------------------------------
 * OS DOIS APARELHOS, E PORQUÊ DOIS
 * ---------------------------------------------------------------------------
 * Telemóvel: WebKit com `devices['iPhone 13']` e toque a sério (`page.tap`),
 * que é o aparelho com que a auditoria de 25.08 mediu os achados B1, B2, D3,
 * D4, D6 e D7. Um clique de rato num viewport estreito não é a mesma coisa: o
 * defeito B1 nasce do que o navegador faz com o foco a seguir a um toque.
 * Computador: Chromium a 1280 × 800, rato e teclado, que é onde vivem B3 e C3.
 *
 * As duas medições de PIXÉIS (o vazio do item A8) correm com
 * `deviceScaleFactor: 1`, para que um pixel da imagem seja um pixel de CSS e os
 * números se leiam contra os da auditoria sem conversão nenhuma.
 *
 * ---------------------------------------------------------------------------
 * O DETETOR DE BANDAS VAZIAS, E A SUA PROVA
 * ---------------------------------------------------------------------------
 * O item A8 pede o vazio medido «nos pixéis como o leitor-utilizador mediu». O
 * detetor é o dele, reescrito aqui: fotografa a página inteira, desenha-a numa
 * tela, e procura corridas de linhas horizontais em que TODOS os pixéis têm a
 * mesma cor; uma corrida acaba quando a cor muda, e por isso um filete de 1px
 * parte a banda em duas, como parte no ecrã. Conta-se a corrida que tem tinta
 * acima E abaixo, que é o «entre dois blocos de conteúdo» do brief.
 *
 * **Provado num caso conhecido antes de valer como medição** (regra 14): sobre a
 * construção anterior a este bloco, o detetor devolvia 97px em y = 824 a 390 e
 * 125px em y = 1043 a 1280, que são o vazio que o diretor fotografou e os dois
 * números que a auditoria publicou (96 e 125). A régua imprime o valor medido
 * ao lado do limiar, para que ninguém tenha de acreditar nela.
 *
 * O ÂMBITO DA MEDIÇÃO É `<main>`, e é uma escolha dita: a mobília do cabeçalho
 * e o ar antes do rodapé são composição — as goteiras da marca e a separação do
 * pé —, e não bandas entre dois blocos de conteúdo. Ficam medidas e impressas ao
 * lado, sem entrar no juízo, para que a decisão de as mudar seja de quem tem de
 * a tomar e não um efeito colateral desta ronda.
 *
 * ---------------------------------------------------------------------------
 * A ÁREA EFETIVA DE UM ALVO (item A10)
 * ---------------------------------------------------------------------------
 * A caixa do elemento UNIDA com a do seu `::after` posicionado, quando ele
 * existe: é a técnica que `a.src-chip` já usa desde a etapa 1 — um
 * pseudo-elemento absoluto e centrado, que alarga o que se toca sem alargar o
 * que se compõe. Medir só a caixa do elemento conta 52 × 14px onde o dedo
 * encontra 52 × 44, que foi o que aconteceu na auditoria.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit, devices } from 'playwright';

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
const DIR_CAPTURAS = opcao('--capturas');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

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
  res.writeHead(200, { 'content-type': MIME[path.extname(ficheiro)] ?? 'application/octet-stream' });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const reguas = [];
const medidas = {};
const conta = (nome, passa, prova) => reguas.push({ nome, passa: !!passa, prova: String(prova) });

/* ========================================================================== */
/* As sondas que correm dentro da página. Escritas uma vez, usadas nas duas     */
/* larguras e nas duas edições.                                                */
/* ========================================================================== */

const SONDA_ALVOS = () => {
  const areaEfetiva = (el) => {
    const r = el.getBoundingClientRect();
    let x1 = r.left;
    let y1 = r.top;
    let x2 = r.right;
    let y2 = r.bottom;
    const cs = getComputedStyle(el, '::after');
    if (cs && cs.content !== 'none' && cs.position === 'absolute') {
      const W = Math.max(parseFloat(cs.width) || 0, parseFloat(cs.minWidth) || 0);
      const H = Math.max(parseFloat(cs.height) || 0, parseFloat(cs.minHeight) || 0);
      if (W > 0 && H > 0) {
        const cx = (r.left + r.right) / 2;
        const cy = (r.top + r.bottom) / 2;
        x1 = Math.min(x1, cx - W / 2);
        x2 = Math.max(x2, cx + W / 2);
        y1 = Math.min(y1, cy - H / 2);
        y2 = Math.max(y2, cy + H / 2);
      }
    }
    return { x: x1, y: y1 + scrollY, w: x2 - x1, h: y2 - y1 };
  };
  const seletor = 'a[href], button, input, select, textarea, summary, [role="button"]';
  const alvos = [];
  for (const el of document.querySelectorAll(seletor)) {
    if (el.closest('[hidden]') || el.closest('.vh')) continue;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0) || !(r.height > 0)) continue;
    const a = areaEfetiva(el);
    alvos.push({
      nome:
        el.tagName.toLowerCase() +
        (typeof el.className === 'string' && el.className
          ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
          : ''),
      txt: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 26),
      naMobilia: !!el.closest('header'),
      noMain: !!el.closest('main'),
      w: +a.w.toFixed(1),
      h: +a.h.toFixed(1),
      x1: a.x,
      x2: a.x + a.w,
      y1: a.y,
      y2: a.y + a.h,
    });
  }
  /* Os pares que se sobrepõem: a regra da casa é que uma área sobreposta não é
     um alvo maior, é uma porta que abre a linha do vizinho. */
  const pares = [];
  for (let i = 0; i < alvos.length; i++) {
    for (let j = i + 1; j < alvos.length; j++) {
      const a = alvos[i];
      const b = alvos[j];
      const ox = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
      const oy = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
      if (ox > 0.5 && oy > 0.5) pares.push(`${a.nome}«${a.txt}» × ${b.nome}«${b.txt}»`);
    }
  }
  return { alvos, pares };
};

const SONDA_TEXTO = () => {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length) continue;
    if (el.matches('script, style, template')) continue;
    if (el.closest('[hidden]') || el.closest('.vh')) continue;
    if (!(el.textContent || '').replace(/\s+/g, ' ').trim()) continue;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0) || !(r.height > 0)) continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px < 12) {
      out.push(
        `${px}px ${el.tagName.toLowerCase()}.${
          typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : ''
        } «${(el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24)}»`,
      );
    }
  }
  return out;
};

/**
 * As bandas de cor uniforme, medidas nos pixéis da captura de página inteira.
 * Devolve, por banda, o topo, a altura e se ela cai dentro de `<main>`.
 */
async function bandas(paginaEmBranco, buf, limites) {
  const dataUrl = 'data:image/png;base64,' + buf.toString('base64');
  return paginaEmBranco.evaluate(
    async ({ dataUrl, limites }) => {
      const img = new Image();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = dataUrl;
      });
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const W = c.width;
      const H = c.height;
      /* A guarda que o leitor-utilizador escreveu: acima de ~50 000px a tela
         aceita a imagem e desenha-a vazia, e a página inteira lê-se como uma
         banda só. Sem esta leitura, um zero seria um achado falso. */
      const telaVazia = H > 40000;
      const linhas = new Array(H);
      for (let y = 0; y < H; y++) {
        const o = y * W * 4;
        const r = d[o];
        const gg = d[o + 1];
        const b = d[o + 2];
        let uniforme = true;
        for (let x = 1; x < W; x++) {
          const q = o + x * 4;
          if (d[q] !== r || d[q + 1] !== gg || d[q + 2] !== b) {
            uniforme = false;
            break;
          }
        }
        linhas[y] = uniforme ? `${r},${gg},${b}` : null;
      }
      const out = [];
      let i = 0;
      while (i < H) {
        if (linhas[i] === null) {
          i++;
          continue;
        }
        let j = i;
        while (j < H && linhas[j] === linhas[i]) j++;
        /* Tinta acima e abaixo: é o «entre dois blocos de conteúdo». */
        let a = i - 1;
        while (a >= 0 && linhas[a] !== null) a--;
        let b2 = j;
        while (b2 < H && linhas[b2] !== null) b2++;
        if (a >= 0 && b2 < H) {
          out.push({
            y: i,
            alt: j - i,
            noMain: i >= limites.topo && j <= limites.fundo,
          });
        }
        i = j;
      }
      return { telaVazia, altura: H, bandas: out.sort((x, y) => y.alt - x.alt) };
    },
    { dataUrl, limites },
  );
}

/* ========================================================================== */
/* 390 · WebKit, iPhone 13, toque a sério                                      */
/* ========================================================================== */

const navMovel = await webkit.launch({ headless: true });

for (const edicao of ['pt', 'en']) {
  const rota = edicao === 'pt' ? '/' : '/en';
  const ctx = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);

  /* ---------------------------------------------------------------- A2 · o comando */
  const comando = await p.evaluate(() => {
    const segs = [...document.querySelectorAll('[data-comando] [data-modo]')];
    const visiveis = segs.filter((a) => a.getBoundingClientRect().width > 0);
    return {
      modos: visiveis.map((a) => a.getAttribute('data-modo')),
      rotulos: visiveis.map((a) => a.textContent.replace(/\s+/g, ' ').trim()),
      papeis: visiveis.map((a) => a.getAttribute('role')),
      hrefs: visiveis.map((a) => a.getAttribute('href')),
      moveis: document.querySelectorAll('.movel-destino, .movel-selo').length,
    };
  });
  conta(
    `A2 · um comando com «País» e «Concelho», com papel de botão · 390 ${edicao}`,
    comando.modos.join(',') === 'pais,municipio' &&
      comando.papeis.every((r) => r === 'button') &&
      comando.moveis === 0,
    `${comando.rotulos.join(' · ')} → ${comando.hrefs.join(' ')} · ${comando.moveis} destino(s) do telemóvel`,
  );

  /* ---------------------------------------------------------------- A4 · o mapa */
  const mapa = await p.evaluate(() => {
    const svg = document.querySelector('.mapa-svg');
    const r = svg ? svg.getBoundingClientRect() : null;
    const pontos = [...document.querySelectorAll('circle.mun')].filter(
      (c) => c.getBoundingClientRect().width > 0,
    ).length;
    const pesquisa = document.querySelector('#pesquisa');
    const rp = pesquisa ? pesquisa.getBoundingClientRect() : null;
    const lede = document.querySelector('[data-cabeca]:not([hidden]) .cabeca-lede');
    const linha = document.querySelector('.mapa-linha');
    const rl = linha ? linha.getBoundingClientRect() : null;
    return {
      svg: r ? +r.width.toFixed(1) : null,
      pontos,
      pesquisaVisivel: !!rp && rp.width > 0 && !pesquisa.closest('[hidden]'),
      pesquisaDepoisDaLede: !!lede && !!rp && rp.top + scrollY > lede.getBoundingClientRect().top + scrollY,
      rotulo: document.querySelector('.pesquisa-rotulo')?.textContent.trim() ?? null,
      linhaVisivel: !!rl && rl.width > 0,
      distanciaDaLinha: rl && rp ? +(rl.top - rp.bottom).toFixed(1) : null,
    };
  });
  conta(
    `A4 · abaixo de 640 o mapa não se rende e a pesquisa fica à vista · 390 ${edicao}`,
    mapa.svg === 0 &&
      mapa.pontos === 0 &&
      mapa.pesquisaVisivel &&
      mapa.pesquisaDepoisDaLede &&
      mapa.linhaVisivel,
    `svg ${mapa.svg}px · ${mapa.pontos} ponto(s) com caixa · pesquisa à vista ${mapa.pesquisaVisivel} · depois da lede ${mapa.pesquisaDepoisDaLede} · rótulo «${mapa.rotulo}» · linha dos 308 à vista ${mapa.linhaVisivel}, a ${mapa.distanciaDaLinha}px da pesquisa`,
  );

  /* -------------------------------------------------- A1 · o comando põe a pesquisa à vista */
  await p.tap('[data-comando] [data-modo="municipio"]');
  await p.waitForTimeout(250);
  const a1 = await p.evaluate(() => {
    const el = document.querySelector('#pesquisa');
    const r = el.getBoundingClientRect();
    return {
      topo: +r.top.toFixed(1),
      fundo: +r.bottom.toFixed(1),
      ecra: innerHeight,
      dentro: r.top >= 0 && r.top < innerHeight,
      foco: document.activeElement ? document.activeElement.id || document.activeElement.tagName : null,
      anuncio: document.querySelector('[data-anuncio]')?.textContent.replace(/\s+/g, ' ').trim() ?? '',
      endereco: location.search,
    };
  });
  conta(
    `A1 · «Concelho» revela a pesquisa dentro do ecrã, com o foco no campo · 390 ${edicao}`,
    a1.dentro && a1.foco === 'pesquisa-concelho' && a1.anuncio.length > 0,
    `topo ${a1.topo} de ${a1.ecra} (dentro: ${a1.dentro}) · foco «${a1.foco}» · anúncio «${a1.anuncio}» · endereço «${a1.endereco}»`,
  );
  if (edicao === 'pt') medidas.a1 = a1;

  /* ------------------------------------------------------- A9 e A10, no estado de entrada */
  await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);

  const texto = await p.evaluate(SONDA_TEXTO);
  conta(
    `A9 · nenhum texto abaixo de 12px na rota home · 390 ${edicao}`,
    texto.length === 0,
    texto.length === 0 ? 'zero elementos com font-size < 12px' : texto.slice(0, 6).join(' · '),
  );

  const { alvos, pares } = await p.evaluate(SONDA_ALVOS);
  const pequenos = alvos.filter((a) => a.w < 44 || a.h < 44);
  const pequenosNoCorpo = pequenos.filter((a) => !a.naMobilia);
  const selos = alvos.filter((a) => a.nome.startsWith('a.src-chip'));
  conta(
    `A10 · a área efetiva do selo já é 44px, e não se mexeu · 390 ${edicao}`,
    selos.length > 0 && selos.every((a) => a.w >= 44 && a.h >= 44),
    `${selos.length} selos · mínimo ${Math.min(...selos.map((a) => a.w)).toFixed(1)}×${Math.min(
      ...selos.map((a) => a.h),
    ).toFixed(1)} de área efetiva (a caixa do elemento mede 52×14)`,
  );
  conta(
    `A10 · zero alvos efetivos abaixo de 44px fora da mobília, e zero áreas sobrepostas · 390 ${edicao}`,
    pequenosNoCorpo.length === 0 && pares.length === 0,
    `${alvos.length} alvos · ${pequenosNoCorpo.length} abaixo de 44 fora da mobília · ${pares.length} pares sobrepostos · exceção medida na mobília: ${pequenos
      .filter((a) => a.naMobilia)
      .map((a) => `${a.nome} ${a.w}×${a.h}`)
      .join(', ') || 'nenhuma'}`,
  );

  /* ------------------------------------------------------------------- A7 · a cabeça */
  const cabeca = await p.evaluate(() => {
    const h = document.querySelector('header').getBoundingClientRect();
    const h1 = document.querySelector('[data-cabeca]:not([hidden]) h1');
    const temaNoMenu = document.querySelector('#nav-principal .tema-no-menu');
    const temaNaMobilia = document.querySelector('.masthead-furniture > .tema');
    return {
      cabecaAlt: +h.height.toFixed(1),
      manchete: h1 ? +h1.getBoundingClientRect().top.toFixed(1) : null,
      ecra: innerHeight,
      temaNoMenu: !!temaNoMenu,
      temaNaMobiliaVisivel: !!temaNaMobilia && temaNaMobilia.getBoundingClientRect().width > 0,
      leituras: [...document.querySelectorAll('.masthead-furniture .mob-leitura')].length,
      marcaLinhas: (() => {
        const m = document.querySelector('.wordmark');
        if (!m) return null;
        const r = m.getBoundingClientRect();
        const lh = parseFloat(getComputedStyle(m).lineHeight);
        return Math.round(r.height / lh);
      })(),
    };
  });
  const limiar40 = cabeca.ecra * 0.4;
  conta(
    `A7 · a cabeça e a manchete começam antes de 40% do ecrã · 390 ${edicao}`,
    cabeca.cabecaAlt < limiar40 &&
      cabeca.manchete !== null &&
      cabeca.manchete < limiar40 &&
      cabeca.leituras === 2 &&
      cabeca.marcaLinhas === 1 &&
      cabeca.temaNoMenu &&
      !cabeca.temaNaMobiliaVisivel,
    `cabeça ${cabeca.cabecaAlt}px · manchete a ${cabeca.manchete}px · 40% = ${limiar40.toFixed(
      1,
    )}px · marca em ${cabeca.marcaLinhas} linha(s) · ${cabeca.leituras} leituras · tema dentro do menu ${cabeca.temaNoMenu}, fora da mobília ${!cabeca.temaNaMobiliaVisivel}`,
  );
  if (edicao === 'pt') medidas.cabeca390 = cabeca;

  /* ------------------------------------------------------------------ A11 · a identidade */
  const identidade = await p.evaluate(() => {
    const els = [...document.querySelectorAll('.masthead-identidade')];
    return {
      n: els.length,
      texto: els[0] ? els[0].textContent.trim() : null,
      familia: els[0] ? getComputedStyle(els[0]).fontFamily.split(',')[0].replace(/["']/g, '') : null,
      corpo: els[0] ? getComputedStyle(els[0]).fontSize : null,
      linhas: els[0]
        ? Math.round(
            els[0].getBoundingClientRect().height / parseFloat(getComputedStyle(els[0]).lineHeight),
          )
        : null,
      ligacoes: els[0] ? els[0].querySelectorAll('a').length : null,
      algarismos: els[0] ? /\d/.test(els[0].textContent) : null,
    };
  });
  const esperada = edicao === 'pt' ? 'Um observatório de Portugal.' : 'An observatory of Portugal.';
  conta(
    `A11 · a frase de identidade, uma vez, na letra da prosa e sem porta · 390 ${edicao}`,
    identidade.n === 1 &&
      identidade.texto === esperada &&
      identidade.linhas === 1 &&
      identidade.ligacoes === 0 &&
      identidade.algarismos === false,
    `«${identidade.texto}» · ${identidade.n} ocorrência(s) · ${identidade.familia} ${identidade.corpo} · ${identidade.linhas} linha · ${identidade.ligacoes} ligações · algarismos ${identidade.algarismos}`,
  );

  /* ------------------------------------------------------------------- A8 · o vazio */
  const limites = await p.evaluate(() => {
    const m = document.querySelector('main').getBoundingClientRect();
    return { topo: Math.round(m.top + scrollY), fundo: Math.round(m.bottom + scrollY) };
  });
  const buf = await p.screenshot({ fullPage: true, type: 'png' });
  const branco = await ctx.newPage();
  await branco.goto('about:blank');
  const b390 = await bandas(branco, buf, limites);
  const noMain390 = b390.bandas.filter((x) => x.noMain);
  const foraDoMain390 = b390.bandas.filter((x) => !x.noMain && x.alt > 48);
  conta(
    `A8 · nenhuma banda de cor uniforme acima de 48px dentro do <main> · 390 ${edicao}`,
    !b390.telaVazia && noMain390.length > 0 && noMain390[0].alt <= 48,
    `maior banda no main: ${noMain390[0]?.alt ?? 0}px em y=${noMain390[0]?.y ?? '—'} (era 97px em y=824) · ${
      noMain390.length
    } bandas medidas · fora do main, na composição da mobília e do pé: ${
      foraDoMain390.map((x) => `${x.alt}px@${x.y}`).join(', ') || 'nenhuma'
    } · página ${b390.altura}px`,
  );
  if (edicao === 'pt') medidas.bandas390 = { noMain: noMain390.slice(0, 4), fora: foraDoMain390 };

  if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string') {
    fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
    const ctx2 = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
    const p2 = await ctx2.newPage();
    await p2.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
    await p2.evaluate(() => document.fonts.ready);
    await p2.screenshot({
      path: path.join(DIR_CAPTURAS, `depois-inicio-390-${edicao}-cima.jpg`),
      type: 'jpeg',
      quality: 72,
    });
    await p2.screenshot({
      path: path.join(DIR_CAPTURAS, `depois-inicio-390-${edicao}-inteira.jpg`),
      type: 'jpeg',
      quality: 72,
      fullPage: true,
    });
    await ctx2.close();
  }

  await ctx.close();
}
await navMovel.close();

/* ========================================================================== */
/* 1280 · Chromium, rato e teclado                                             */
/* ========================================================================== */

const navMesa = await chromium.launch({ headless: true });

for (const edicao of ['pt', 'en']) {
  const rota = edicao === 'pt' ? '/' : '/en';
  const destino = edicao === 'pt' ? '/municipios/evora' : '/en/municipalities/evora';
  const ctx = await navMesa.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();
  await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);

  /* -------------------------------------------------- A5 · os pontos com página */
  const a5 = await p.evaluate((destino) => {
    const todos = [...document.querySelectorAll('circle.mun')];
    const comPagina = todos.filter((c) => c.getAttribute('data-pagina') === 'sim');
    const semPagina = todos.filter((c) => c.getAttribute('data-pagina') !== 'sim');
    const dentroDeA = comPagina.filter((c) => c.closest('a'));
    const raios = new Set(todos.map((c) => c.getAttribute('r')));
    const enchimentos = new Set(todos.map((c) => getComputedStyle(c).fill));
    const porta = comPagina[0] ? comPagina[0].closest('a') : null;
    return {
      total: todos.length,
      comPagina: comPagina.length,
      semPaginaDentroDeA: semPagina.filter((c) => c.closest('a')).length,
      dentroDeA: dentroDeA.length,
      href: porta ? porta.getAttribute('href') : null,
      certo: porta ? porta.getAttribute('href') === destino : false,
      titulo: porta ? (porta.querySelector('title')?.textContent ?? null) : null,
      cursor: comPagina[0] ? getComputedStyle(comPagina[0]).cursor : null,
      cursorDaPorta: porta ? getComputedStyle(porta).cursor : null,
      raiosDistintos: [...raios],
      enchimentosDistintos: [...enchimentos],
    };
  }, destino);
  conta(
    `A5 · o ponto com página é uma ligação com nome, e os outros 307 não · 1280 ${edicao}`,
    a5.comPagina === 1 &&
      a5.dentroDeA === 1 &&
      a5.semPaginaDentroDeA === 0 &&
      a5.certo &&
      !!a5.titulo &&
      a5.cursorDaPorta === 'pointer' &&
      a5.raiosDistintos.length === 1 &&
      a5.enchimentosDistintos.length === 1,
    `${a5.total} pontos · ${a5.comPagina} com página, ${a5.dentroDeA} dentro de <a> → «${a5.href}» · title «${a5.titulo}» · cursor ${a5.cursorDaPorta} · ${a5.semPaginaDentroDeA} dos 307 dentro de <a> · raio(s) ${a5.raiosDistintos.join('/')} · enchimento(s) ${a5.enchimentosDistintos.join('/')}`,
  );

  /* O teclado chega lá. A ligação é o único `<a>` dentro do `svg`, e o Tab
     percorre-a como percorre qualquer outra: o que isto mede é que ela está na
     ordem do documento e recebe foco. */
  const tab = await p.evaluate(() => {
    const foco = [...document.querySelectorAll('a[href], button, input, summary')].filter(
      (e) => !e.closest('[hidden]'),
    );
    const porta = document.querySelector('.mun-porta');
    return { indice: porta ? foco.indexOf(porta) : -1, total: foco.length };
  });
  await p.evaluate(() => document.querySelector('.mun-porta').focus());
  const focado = await p.evaluate(() => ({
    classe: document.activeElement ? document.activeElement.getAttribute('class') : null,
    href: document.activeElement ? document.activeElement.getAttribute('href') : null,
  }));
  conta(
    `A5 · o leitor de teclado chega ao ponto com página · 1280 ${edicao}`,
    tab.indice >= 0 && focado.classe === 'mun-porta' && focado.href === destino,
    `posição ${tab.indice} de ${tab.total} alvos focáveis · foco em «${focado.classe}» → ${focado.href}`,
  );

  /* -------------------------------------------------- A6 · o nome ao passar o rato */
  const sitio = await p.evaluate(() => {
    const c = document.querySelector('circle.mun[data-pagina="sim"]');
    const r = c.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await p.mouse.move(sitio.x - 40, sitio.y - 40);
  await p.mouse.move(sitio.x, sitio.y);
  await p.waitForTimeout(200);
  const a6 = await p.evaluate(() => {
    const l = document.querySelector('[data-readout]');
    const visivel = [...l.children].filter((c) => !c.hidden);
    return {
      lido: visivel.map((c) => c.textContent).join('').replace(/\s+/g, ' ').trim(),
      partes: visivel.map((c) => c.className),
    };
  });
  const esperadoA6 = edicao === 'pt' ? 'Évora · distrito de Évora' : 'Évora · district of Évora';
  conta(
    `A6 · o nome e o distrito com o separador da casa · 1280 ${edicao}`,
    a6.lido === esperadoA6,
    `lê «${a6.lido}» (esperado «${esperadoA6}») · partes: ${a6.partes.join(' + ')}`,
  );

  /* ------------------------------------------------------------- C1 · o mapa não some */
  const c1 = await p.evaluate(async () => {
    const antes = getComputedStyle(document.querySelector('#mapa')).display;
    const estados = [];
    for (const q of ['?ambito=municipio', '?ambito=regiao:algarve', '?ambito=municipio:evora', '']) {
      history.pushState({}, '', location.pathname + q);
      window.dispatchEvent(new PopStateEvent('popstate'));
      await new Promise((r) => setTimeout(r, 60));
      const f = document.querySelector('#mapa');
      estados.push(`${q || '(defeito)'}: ${getComputedStyle(f).display}, hidden=${f.hidden}`);
    }
    return { antes, estados };
  });
  conta(
    `C1 · o mapa nunca desaparece ao mudar de estado · 1280 ${edicao}`,
    !c1.estados.some((e) => e.includes('display: none') || e.includes('hidden=true')),
    c1.estados.join(' · '),
  );

  /* --------------------------------------------------------- A3 · a régua saiu de `/` */
  await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const a3 = await p.evaluate(() => ({
    seccao: !!document.querySelector('#convergencia'),
    banda: !!document.querySelector('[data-instrumento="banda"]'),
    escala: document.querySelectorAll('[data-nonledger="escala-de-instrumento"]').length,
    portaDoTelemovel: !!document.querySelector('.conv-porta'),
  }));
  /* `dist/prova.json` é o ficheiro que o portão escreve no fim de um varrimento
     sem erros; as chaves estão em `.prova`, cada uma com o valor e a vista de
     onde ele a recontou. Contá-las aqui é a prova de que a régua saiu da página
     sem levar consigo nenhuma chave da prova. */
  const prova = JSON.parse(fs.readFileSync(path.join(DIST, 'prova.json'), 'utf8')).prova;
  conta(
    `A3 · a régua da convergência não se rende em / e as chaves da prova ficam · 1280 ${edicao}`,
    !a3.seccao && !a3.banda && !a3.portaDoTelemovel && Object.keys(prova).length >= 41,
    `#convergencia ${a3.seccao} · banda ${a3.banda} · porta do telemóvel ${a3.portaDoTelemovel} · ${
      Object.keys(prova).length
    } chaves da prova reconferidas pelo portão`,
  );

  /* ---------------------------------------------------------------- A8 · o vazio a 1280 */
  const limites = await p.evaluate(() => {
    const m = document.querySelector('main').getBoundingClientRect();
    return { topo: Math.round(m.top + scrollY), fundo: Math.round(m.bottom + scrollY) };
  });
  const buf = await p.screenshot({ fullPage: true, type: 'png' });
  const branco = await ctx.newPage();
  await branco.goto('about:blank');
  const b1280 = await bandas(branco, buf, limites);
  const noMain = b1280.bandas.filter((x) => x.noMain);
  const fora = b1280.bandas.filter((x) => !x.noMain && x.alt > 48);
  conta(
    `A8 · nenhuma banda de cor uniforme acima de 48px dentro do <main> · 1280 ${edicao}`,
    !b1280.telaVazia && noMain.length > 0 && noMain[0].alt <= 48,
    `maior banda no main: ${noMain[0]?.alt ?? 0}px em y=${noMain[0]?.y ?? '—'} (era 125px em y=1043) · fora do main: ${
      fora.map((x) => `${x.alt}px@${x.y}`).join(', ') || 'nenhuma'
    } · página ${b1280.altura}px`,
  );
  if (edicao === 'pt') medidas.bandas1280 = { noMain: noMain.slice(0, 4), fora };

  /* A mesma medida na página do concelho, que é a segunda metade do item A8. */
  const pe = await ctx.newPage();
  await pe.goto(`${base}${destino}`, { waitUntil: 'networkidle' });
  await pe.evaluate(() => document.fonts.ready);
  const limitesE = await pe.evaluate(() => {
    const m = document.querySelector('main').getBoundingClientRect();
    return { topo: Math.round(m.top + scrollY), fundo: Math.round(m.bottom + scrollY) };
  });
  /* «Quatro valores cortados pela margem inferior depois de uma área vazia»: os
     quatro são os da PRIMEIRA fila do relance do concelho (a segunda fila fica
     abaixo da dobra por desenho, e sempre ficou). O que se mede é se os quatro
     primeiros cabem no primeiro ecrã de 800px, e onde começa o primeiro cartão. */
  const dobra = await pe.evaluate(() => {
    const vals = [...document.querySelectorAll('#relance .peca .peca-valor')].slice(0, 4);
    const c = document.querySelector('#relance .peca');
    const rc = c ? c.getBoundingClientRect() : null;
    return {
      valores: vals.length,
      dentro: vals.filter((v) => v.getBoundingClientRect().bottom <= innerHeight).length,
      primeiro: vals[0] ? +vals[0].getBoundingClientRect().top.toFixed(0) : null,
      cartao: rc ? +rc.top.toFixed(0) : null,
      pedDoCartao: rc ? +rc.bottom.toFixed(0) : null,
    };
  });
  const bufE = await pe.screenshot({ fullPage: true, type: 'png' });
  const bE = await bandas(branco, bufE, limitesE);
  const noMainE = bE.bandas.filter((x) => x.noMain);
  conta(
    `A8 · o mesmo no concelho, e os quatro valores dentro do primeiro ecrã · 1280 ${edicao}`,
    !bE.telaVazia &&
      noMainE.length > 0 &&
      noMainE[0].alt <= 48 &&
      dobra.valores === 4 &&
      dobra.dentro === 4,
    `maior banda no main: ${noMainE[0]?.alt ?? 0}px em y=${noMainE[0]?.y ?? '—'} (era 86px, o ar da secção) · ${
      dobra.dentro
    } de ${dobra.valores} valores da primeira fila dentro dos 800px, o primeiro a ${
      dobra.primeiro
    }px (era 582) · cartão ${dobra.cartao}..${dobra.pedDoCartao}px (era 545..908)`,
  );
  if (edicao === 'pt') medidas.evora1280 = { dobra, maiorBanda: noMainE[0] ?? null };

  if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string') {
    fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
    const ctx2 = await navMesa.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const p2 = await ctx2.newPage();
    await p2.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
    await p2.evaluate(() => document.fonts.ready);
    await p2.screenshot({
      path: path.join(DIR_CAPTURAS, `depois-inicio-1280-${edicao}-cima.jpg`),
      type: 'jpeg',
      quality: 72,
    });
    await p2.screenshot({
      path: path.join(DIR_CAPTURAS, `depois-inicio-1280-${edicao}-inteira.jpg`),
      type: 'jpeg',
      quality: 72,
      fullPage: true,
    });
    await ctx2.close();
  }

  await ctx.close();
}
await navMesa.close();
servidor.close();

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ reguas, medidas }, null, 2));
}

console.log('');
console.log(cinza(`  correções de UX · bloco A · ${reguas.length} réguas`));
console.log('');
let falhas = 0;
for (const r of reguas) {
  if (!r.passa) falhas++;
  console.log(`  ${r.passa ? verde('passa') : vermelho('falha')}  ${r.nome}`);
  console.log(cinza(`         ${r.prova}`));
}
console.log('');
console.log(
  falhas === 0
    ? verde(`  ${reguas.length} de ${reguas.length} réguas passam.`)
    : vermelho(`  ${falhas} de ${reguas.length} réguas falham.`),
);
console.log('');
process.exit(falhas === 0 ? 0 : 1);
