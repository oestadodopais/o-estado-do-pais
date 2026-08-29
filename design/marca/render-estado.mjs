/**
 * O CABEÇALHO E OS ÍCONES DA SÉTIMA ADENDA, RENDIDOS NO NAVEGADOR DO REPOSITÓRIO.
 *
 * A adenda pede «o cabeçalho aos tamanhos reais do sítio», e a única maneira
 * honesta de o fazer é não voltar a escrever nenhum número: esta página carrega
 * `src/styles/tokens.css` e `src/styles/site.css` tal como estão e monta a
 * marcação que `src/components/Masthead.astro` monta, com o `.wrap`, o
 * `.masthead`, o `.wordmark` e a `.masthead-identidade`. O `clamp()` resolve-se
 * contra a largura da janela, e por isso a janela é posta a 320, 390, 768 e
 * 1280, que são as quatro larguras que a adenda nomeia. Nada aqui repete uma
 * medida da folha de estilos; o que a folha diz é o que aparece.
 *
 * NÃO ESCREVE NADA EM `src/` NEM EM `public/`. Lê os dois ficheiros de estilo e
 * os tipos da casa, e escreve só em `design/marca/EXPORT-ESTADO/`.
 *
 * O SERVIDOR EXISTE POR CAUSA DOS TIPOS. `tokens.css` declara os `@font-face`
 * com caminhos absolutos (`/tipos/spectral/…`), que é o que eles são no sítio
 * construído, onde `public/` é a raiz. Sobre `file://` esses caminhos não
 * resolvem e o Chromium cairia no Georgia sem o dizer, o que daria uma medição
 * do tipo errado. O servidor daqui serve `public/` na raiz e o resto do
 * repositório por baixo, que é o mapa que o sítio tem.
 *
 * USO: node design/marca/render-estado.mjs provas       o contacto das letras
 *      node design/marca/render-estado.mjs cabecalhos   os 96 cabeçalhos
 *      node design/marca/render-estado.mjs icones       as candidaturas a ícone
 *      node design/marca/render-estado.mjs              tudo
 */

import { chromium } from 'playwright';
import http from 'node:http';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
const PUBLIC = path.join(RAIZ, 'public');
const DESENHOS = path.join(AQUI, 'estado');
const SAIDA = path.join(AQUI, 'EXPORT-ESTADO');

/* ------------------------------------------------------------------------ */
/* O SERVIDOR                                                                */
/* ------------------------------------------------------------------------ */
const TIPOS = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

function servidor() {
  const s = http.createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    for (const raiz of [PUBLIC, RAIZ]) {
      const f = path.join(raiz, p);
      if (!f.startsWith(raiz)) continue;
      if (existsSync(f) && !f.endsWith('/')) {
        try {
          const corpo = await readFile(f);
          res.writeHead(200, { 'content-type': TIPOS[path.extname(f)] ?? 'application/octet-stream' });
          return res.end(corpo);
        } catch {
          /* segue para a raiz seguinte */
        }
      }
    }
    res.writeHead(404).end('não está');
  });
  return new Promise((ok) => s.listen(0, '127.0.0.1', () => ok({ s, porta: s.address().port })));
}

/* ------------------------------------------------------------------------ */
/* AS TRÊS CONSTRUÇÕES E AS TRÊS LINHAS DE DESCRITOR                         */
/* ------------------------------------------------------------------------ */
const LARGURAS = [320, 390, 768, 1280];
const TEMAS = ['claro', 'escuro'];

/** As três linhas que a adenda manda comparar. A primeira é a que já existe em
 *  `src/i18n/strings.mjs` (a frase de identidade), sem o ponto final: aqui ela
 *  deixa de ser uma frase debaixo de um nome e passa a ser o descritor DO nome,
 *  e um descritor não leva ponto. */
const DESCRITORES = [
  ['d1', 'observatório de Portugal'],
  ['d2', 'observatório do estado do país'],
  ['d3', 'observatório do estado de Portugal'],
];

/** As três construções. A 1 e a 2 entram como desenho; a 3 é texto composto. */
const CONSTRUCOES = [
  { id: '1', nome: 'geométrica', svg: '1-geometrica-estado.svg' },
  { id: '2', nome: 'humanista', svg: '2-humanista-estado.svg' },
  { id: '3', nome: 'Spectral (controlo)', svg: null },
];

async function marcaSvg(ficheiro) {
  const cru = await readFile(path.join(DESENHOS, ficheiro), 'utf8');
  const vb = /viewBox="([^"]+)"/.exec(cru)[1].split(/\s+/).map(Number);
  return { cru, vb };
}

/**
 * A PALAVRA DESENHADA, POSTA NO `.wordmark` COM A RÉGUA DA CAIXA DE TINTA.
 *
 * O SVG está recortado da ascendente (750) à saliência (10), ou seja 760
 * milésimos de em, que é a caixa de tinta que o cabeçalho já tem hoje. Por isso
 * a altura em `em` é 0,76 e a largura sai da proporção do `viewBox`; e o
 * `vertical-align` desce a caixa 0,01 em, que é a saliência, para a LINHA DE
 * BASE do desenho cair na linha de base do texto. Sem isso a palavra assentava
 * pelo fundo do «o» e ficava 0,01 em acima do sítio.
 */
function estiloDaMarca(vb) {
  const alturaEm = vb[3] / 1000;
  const larguraEm = (vb[2] / vb[3]) * alturaEm;
  return `display:inline-block;height:${alturaEm}em;width:${larguraEm.toFixed(4)}em;`
    + `vertical-align:-0.01em;`;
}

async function paginaCabecalho(constr, descritor) {
  let marca;
  if (constr.svg) {
    const { cru, vb } = await marcaSvg(constr.svg);
    const corpo = cru.replace(/^[\s\S]*?<svg /, '<svg ').replace(/<title>[\s\S]*?<\/title>/, '');
    marca = corpo.replace('<svg ', `<svg class="marca-palavra" style="${estiloDaMarca(vb)}" `);
  } else {
    marca = 'estado';
  }
  return `<!doctype html><html lang="pt"><head><meta charset="utf-8">
<link rel="stylesheet" href="/src/styles/tokens.css">
<link rel="stylesheet" href="/src/styles/site.css">
<style>
  /* nada de composição nova: só o que tira da folha o que a página inteira
     traria e que aqui não há (a barra de navegação, a mobília, o conteúdo). */
  body { margin: 0; }
  .marca-palavra path { fill: currentColor; }
  /* letter-spacing normal pela mesma razão que .wordmark-e o leva na folha do
     sítio: o aperto de −0,014 em aplica-se também depois de um elemento
     substituído, e o que ele apertaria aqui não é texto. */
  .marca-palavra { letter-spacing: normal; }
</style></head><body>
<div class="wrap">
  <header>
    <div class="masthead">
      <h1 class="wordmark" id="marca">${marca}</h1>
      <p class="masthead-identidade" id="descritor">${descritor}</p>
    </div>
  </header>
</div>
</body></html>`;
}

/** O cabeçalho de HOJE, para o «antes» ser medido e não lembrado. */
async function paginaHoje() {
  const favicon = await readFile(path.join(PUBLIC, 'favicon.svg'), 'utf8');
  const grupo = /<g transform="([^"]+)">([\s\S]*?)<\/g>/.exec(favicon);
  const caminhos = [...grupo[2].matchAll(/<path class="tinta" d="([^"]+)"\s*\/>/g)].map((m) => m[1]);
  const sinal = `<svg class="wordmark-e" viewBox="76 76 360 360" aria-hidden="true" focusable="false">`
    + `<g transform="${grupo[1]}" fill="currentColor">${caminhos.map((d) => `<path d="${d}"/>`).join('')}</g></svg>`;
  return `<!doctype html><html lang="pt"><head><meta charset="utf-8">
<link rel="stylesheet" href="/src/styles/tokens.css">
<link rel="stylesheet" href="/src/styles/site.css">
<style>body { margin: 0; }</style></head><body>
<div class="wrap"><header><div class="masthead">
  <h1 class="wordmark" id="marca">${sinal}O Estado do País</h1>
  <p class="masthead-identidade" id="descritor">Um observatório de Portugal.</p>
</div></header></div></body></html>`;
}

/* ------------------------------------------------------------------------ */
/* A MEDIÇÃO                                                                 */
/* ------------------------------------------------------------------------ */
/** O que se mede em cada cabeçalho, e porque é que é isto e não outra coisa:
 *  a ALTURA DO `.masthead` é o que o cabeçalho custa à página (é o que empurra
 *  o conteúdo para baixo), e a CAIXA DE TINTA do `.wordmark` é o que o olho vê.
 *  As duas podem mudar em sentidos contrários, e por isso são duas. */
async function mede(page) {
  return page.evaluate(() => {
    const m = document.querySelector('.masthead').getBoundingClientRect();
    const w = document.querySelector('#marca').getBoundingClientRect();
    const d = document.querySelector('#descritor');
    const dr = d.getBoundingClientRect();
    const cs = getComputedStyle(document.querySelector('#marca'));
    const cd = getComputedStyle(d);
    const linhas = Math.round(dr.height / parseFloat(cd.lineHeight));
    /* A LARGURA DO DESCRITOR MEDE-SE NO TEXTO E NÃO NO BLOCO: um `<p>` é um
       bloco e ocupa a coluna toda, e por isso `getBoundingClientRect()` devolve
       288 px em qualquer das três linhas. O que interessa é quanto da coluna a
       linha ocupa, e isso é a caixa do intervalo de texto. */
    const rng = document.createRange();
    rng.selectNodeContents(d);
    const rt = rng.getBoundingClientRect();
    return {
      masthead: +m.height.toFixed(2),
      wordmarkCaixa: +w.height.toFixed(2),
      wordmarkLargura: +w.width.toFixed(2),
      corpo: cs.fontSize,
      descritorCorpo: cd.fontSize,
      descritorLargura: +rt.width.toFixed(2),
      descritorColuna: +dr.width.toFixed(2),
      descritorLinhas: linhas,
      janela: window.innerWidth,
    };
  });
}

/* ------------------------------------------------------------------------ */
/* AS TRÊS RONDAS                                                            */
/* ------------------------------------------------------------------------ */
async function provas(page, base) {
  /* o contacto: cada desenho a 260 px de alto, em papel, para se olhar. */
  const ficheiros = (await readdir(DESENHOS)).filter((f) => f.endsWith('.svg')).sort();
  const blocos = [];
  for (const f of ficheiros) {
    const { cru, vb } = await marcaSvg(f);
    const corpo = cru.replace(/^[\s\S]*?<svg /, '<svg ').replace(/<title>[\s\S]*?<\/title>/, '');
    const h = 260;
    const w = Math.round((vb[2] / vb[3]) * h);
    blocos.push(`<figure><div class="p">${corpo.replace('<svg ', `<svg width="${w}" height="${h}" `)}</div>`
      + `<figcaption>${f}</figcaption></figure>`);
  }
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#f6f7f4;color:#17191b;font:13px/1.4 Helvetica,sans-serif;padding:24px}
    figure{margin:0 0 26px;display:block}
    .p{border:1px solid #cfd3ce;padding:14px;display:inline-block;background:#fff}
    figcaption{margin-top:6px;color:#5b615d}
  </style>${blocos.join('\n')}`;
  await page.setViewportSize({ width: 1500, height: 900 });
  await page.goto(`${base}/design/marca/EXPORT-ESTADO/_provas.html`).catch(() => {});
  await page.setContent(html);
  await page.screenshot({ path: path.join(SAIDA, 'provas.png'), fullPage: true });
  console.log('escrito EXPORT-ESTADO/provas.png');
}

async function cabecalhos(page, base) {
  const medidas = [];
  const paginas = [['hoje', await paginaHoje()]];
  for (const c of CONSTRUCOES) {
    for (const [dk, dtxt] of DESCRITORES) {
      paginas.push([`c${c.id}-${dk}`, await paginaCabecalho(c, dtxt)]);
    }
  }
  for (const [etq, html] of paginas) {
    for (const largura of LARGURAS) {
      for (const tema of TEMAS) {
        await page.setViewportSize({ width: largura, height: 420 });
        await page.goto(`${base}/design/marca/_pagina.html`).catch(() => {});
        await page.setContent(html);
        await page.evaluate((t) => {
          if (t === 'escuro') document.documentElement.setAttribute('data-theme', 'dark');
          else document.documentElement.removeAttribute('data-theme');
        }, tema);
        await page.evaluate(() => document.fonts.ready);
        const m = await mede(page);
        medidas.push({ etq, largura, tema, ...m });
        const alvo = path.join(SAIDA, `cab-${etq}-${largura}-${tema}.png`);
        await page.locator('.masthead').screenshot({ path: alvo });
        /* A CAIXA DE TINTA NÃO SE MEDE COM `getBoundingClientRect()`, e é preciso
           dizê-lo: o que essa devolve para o `<h1>` é a CAIXA DE LINHA (1,04 do
           corpo) e a largura do bloco, que é a do `.wrap`. A tinta mede-se no
           PNG, contando píxeis, que é o método da §8 das NOTAS. Daí este
           segundo ficheiro: só a marca, para a régua de `estado.py medir`. */
        await page.locator('#marca').screenshot({
          path: path.join(SAIDA, `marca-${etq}-${largura}-${tema}.png`),
        });
      }
    }
  }
  await writeFile(path.join(SAIDA, 'medidas.json'), JSON.stringify(medidas, null, 2));
  console.log(`escritos ${medidas.length} cabeçalhos e EXPORT-ESTADO/medidas.json`);
}

/* ------------------------------------------------------------------------ */
/* AS CANDIDATURAS A ÍCONE                                                   */
/* ------------------------------------------------------------------------ */
/**
 * A 7b abriu outra vez a pergunta do ícone e disse o que ela é: a letra da
 * construção, e não o sinal que está no ar. São por isso quatro peças por
 * construção, cada uma em campo de tinta e em campo de papel:
 *   · o «e» sozinho, a 180 e a 60 px (e a 16, que é onde ele morre ou não)
 *   · a palavra inteira, a 180 px, que é a pergunta «cabe?»
 *
 * O SINAL OCUPA 70,3 % DO CAMPO, que é a régua das dezanove direções (360 em
 * 512). Sem ela, uma letra desenhada maior do que outra ganharia a comparação
 * por ter sido enquadrada com mais folga, e não por se ler melhor.
 */
const FRACAO_SINAL = 360 / 512;
const TAMANHOS_ICONE = [512, 180, 60, 32, 16];

/** A altura de x de cada construção, em milésimos de em. As duas primeiras são
 *  as constantes de `estado.py`; a terceira é `sxHeight` do ficheiro da casa. */
const ALTURA_X = { 1: 470, 2: 450, 3: 450 };

/**
 * OS TRÊS CAMPOS, e o porquê do terceiro.
 *
 * A continuação da 7b manda dar campo cheio a todas as candidaturas e uma
 * alternativa de cor «à escolha, dos tokens da casa». Os tokens de cor são
 * quatro: cobalto `#1f4e8c`, âmbar `#e0a21a`, ocre `#7a5300` e o par tinta e
 * papel. Está escolhido o COBALTO, e por duas razões que não são de gosto:
 *
 *  · o âmbar e o ocre são as duas cores que o diretor já reprovou na §6 ter
 *    («as cores não são agradáveis, preto e branco talvez fossem melhores»), e
 *    o âmbar carrega ainda a semântica da régua do sítio, onde quer dizer «fora
 *    do limiar»;
 *  · o cobalto é a paleta do azulejo que a §2 já reconheceu como da casa, e
 *    papel sobre cobalto mede 7,73:1, que passa os dois limiares.
 *
 * O QUE ISSO CUSTA, e fica dito com a amostra ao lado: na tira do diretor o
 * vizinho imediato é a Guardian, que é um campo escuro azulado. A §6 já tinha
 * medido o mesmo com o Expresso («o cobalto perde-se e o âmbar não»). A folha
 * mostra as duas e a decisão é de direção.
 */
const CAMPOS = {
  tinta: { fundo: '#17191b', letra: '#f6f7f4' },
  papel: { fundo: '#f6f7f4', letra: '#17191b' },
  cobalto: { fundo: '#1f4e8c', letra: '#f6f7f4' },
};

/**
 * AS CANDIDATURAS NO PESO DE ÍCONE (a continuação da 7b).
 *
 * «A grossura da letra é pelo menos 22 % do diâmetro do círculo da altura de x,
 * e não os 14 % do sinal do cabeçalho.» Nas duas construções desenhadas isso é
 * outro ficheiro, escrito por `estado.py` com o mesmo desenho e outro número
 * (`-negro`); na terceira é outro PESO DO MESMO TIPO, que a casa já serve:
 * `Spectral-Bold.woff2`, cuja haste do «e» mede 135,9 num círculo de 476, ou
 * seja 28,6 %. O SemiBold dá 23,8 % e também passa. Medido no ficheiro, com o
 * contorno cruzado a meia altura de x.
 */
const PECAS_NEGRAS = [
  { id: 'c1-e-negro', tipo: 'svg', ficheiro: '1-e-negro.svg' },
  { id: 'c1-palavra-negro', tipo: 'svg', ficheiro: '1-estado-negro.svg' },
  { id: 'c2-e-negro', tipo: 'svg', ficheiro: '2-e-negro.svg' },
  { id: 'c2-palavra-negro', tipo: 'svg', ficheiro: '2-estado-negro.svg' },
  { id: 'c3-e-negro', tipo: 'texto', texto: 'e', peso: 700 },
  { id: 'c3-palavra-negro', tipo: 'texto', texto: 'estado', peso: 700 },
];

async function icones(page, base) {
  const pecas = [];
  for (const c of CONSTRUCOES) {
    if (c.id === '3') {
      pecas.push({ id: `c3-e`, tipo: 'texto', texto: 'e' });
      pecas.push({ id: `c3-palavra`, tipo: 'texto', texto: 'estado' });
    } else {
      pecas.push({ id: `c${c.id}-e`, tipo: 'svg', ficheiro: `${c.id}-e.svg` });
      pecas.push({ id: `c${c.id}-palavra`, tipo: 'svg', ficheiro: c.svg });
    }
  }
  const regua = [];
  for (const peca of pecas.concat(PECAS_NEGRAS)) {
    let dentro;
    if (peca.tipo === 'svg') {
      const { cru, vb } = await marcaSvg(peca.ficheiro);
      const corpo = cru.replace(/^[\s\S]*?<svg /, '<svg ').replace(/<title>[\s\S]*?<\/title>/, '');
      const razao = vb[2] / vb[3];
      /* o enquadramento da casa: o lado maior do desenho ocupa 70,3 % do campo */
      const [w, h] = razao >= 1 ? [FRACAO_SINAL, FRACAO_SINAL / razao] : [FRACAO_SINAL * razao, FRACAO_SINAL];
      dentro = corpo.replace('<svg ',
        `<svg style="width:${(w * 100).toFixed(3)}%;height:${(h * 100).toFixed(3)}%;display:block" `);
    } else {
      dentro = `<span class="texto">${peca.texto}</span>`;
    }
    for (const [campo, cores] of Object.entries(CAMPOS)) {
      for (const px of TAMANHOS_ICONE) {
        const fundo = cores.fundo;
        const tinta = cores.letra;
        const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/src/styles/tokens.css">
<style>
  html,body{margin:0;padding:0}
  .cela{width:${px}px;height:${px}px;background:${fundo};color:${tinta};
        display:flex;align-items:center;justify-content:center;overflow:hidden}
  .cela svg{fill:currentColor}
  /* O TEXTO DA CONSTRUÇÃO 3 É COMPOSTO, e o enquadramento tem de dar o mesmo
     que o dos desenhos: o corpo é posto de maneira a que a caixa de tinta da
     palavra ou da letra ocupe a mesma fração do campo. A caixa de tinta do
     «estado» do Spectral é 0,76 em de alta e a do «e» é 0,47 em (450+20 de
     saliência), medidas no ficheiro da casa. */
  .texto{font-family:var(--f-prosa);font-weight:${peca.peso ?? 400};letter-spacing:-0.014em;
         line-height:1;font-size:${px}px;display:block}
</style></head><body><div class="cela">${dentro}</div></body></html>`;
        await page.setViewportSize({ width: Math.max(px, 40), height: Math.max(px, 40) });
        await page.goto(`${base}/design/marca/_icone.html`).catch(() => {});
        await page.setContent(html);
        await page.evaluate(() => document.fonts.ready);
        let corpoPx = null;
        if (peca.tipo === 'texto') {
          /**
           * O CORPO DO TEXTO AJUSTA-SE PELA CAIXA DE TINTA, MEDIDA NA TELA.
           *
           * `Range.getBoundingClientRect()` NÃO serve, e é preciso dizer porquê:
           * o que ela devolve é a caixa de LINHA, ou seja a altura do corpo, e
           * não a da tinta. Com ela o «e» do Spectral saía enquadrado como se
           * medisse um em de alto quando mede 0,47, e ficava com metade do
           * tamanho dos «e» desenhados na mesma cela. `measureText` com
           * `actualBoundingBox*` devolve a tinta, que é o que a régua da casa
           * enquadra nas outras direções.
           */
          corpoPx = await page.evaluate(({ alvo }) => {
            const el = document.querySelector('.texto');
            const cs = getComputedStyle(el);
            const ctx = document.createElement('canvas').getContext('2d');
            const probe = 200;
            ctx.font = `${cs.fontWeight} ${probe}px ${cs.fontFamily}`;
            ctx.letterSpacing = cs.letterSpacing;
            const m = ctx.measureText(el.textContent);
            const alt = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
            const larg = m.actualBoundingBoxRight + m.actualBoundingBoxLeft;
            const corpo = probe * alvo / Math.max(alt, larg);
            el.style.fontSize = `${corpo}px`;
            return corpo;
          }, { alvo: px * FRACAO_SINAL });
        }
        const alvo = path.join(SAIDA, `ic-${peca.id}-${campo}-${px}.png`);
        await page.locator('.cela').screenshot({ path: alvo });
        if (campo === 'tinta') {
          const cid = peca.id[1];  // «c1-e-negro» → «1»
          let xPx;
          if (peca.tipo === 'texto') {
            xPx = (ALTURA_X[cid] / 1000) * corpoPx;
          } else {
            const { vb } = await marcaSvg(peca.ficheiro);
            xPx = (ALTURA_X[cid] / Math.max(vb[2], vb[3])) * px * FRACAO_SINAL;
          }
          regua.push({ peca: peca.id, px, alturaX: +xPx.toFixed(2) });
        }
      }
    }
  }
  await writeFile(path.join(SAIDA, 'icones.json'), JSON.stringify(regua, null, 2));
  console.log(`escritas ${(pecas.length + PECAS_NEGRAS.length) * Object.keys(CAMPOS).length * TAMANHOS_ICONE.length} celas de ícone`);
}

/* ------------------------------------------------------------------------ */
/* AS TRÊS CONSTRUÇÕES DO «s», E O ALFABETO DE CADA CONSTRUÇÃO                */
/* ------------------------------------------------------------------------ */
/**
 * O «s» julga-se em dois sítios e não num: DENTRO DA PALAVRA ao tamanho do
 * cabeçalho, que é onde ele tem de manter o ritmo das outras cinco, e SOZINHO
 * a 60 px, que é o tamanho a que este trabalho julga uma forma desde a §5. Uma
 * letra que se lê sozinha e abre um buraco na palavra continua a estar errada.
 */
async function esses(page, base) {
  for (const chave of ['a', 'b', 'c']) {
    const c = { id: '1', svg: `1-geometrica-estado-s${chave}.svg` };
    const html = await paginaCabecalho(c, 'observatório de Portugal');
    for (const largura of [390, 1280]) {
      await page.setViewportSize({ width: largura, height: 420 });
      await page.goto(`${base}/design/marca/_pagina.html`).catch(() => {});
      await page.setContent(html);
      await page.evaluate(() => document.fonts.ready);
      await page.locator('#marca').screenshot({
        path: path.join(SAIDA, `s${chave}-marca-${largura}.png`),
      });
    }
    /* o «s» sozinho, na cela da casa, em papel e a 60 px */
    const { cru, vb } = await marcaSvg(`1-s${chave}.svg`);
    const corpo = cru.replace(/^[\s\S]*?<svg /, '<svg ').replace(/<title>[\s\S]*?<\/title>/, '');
    const razao = vb[2] / vb[3];
    const [w, h] = razao >= 1
      ? [FRACAO_SINAL, FRACAO_SINAL / razao] : [FRACAO_SINAL * razao, FRACAO_SINAL];
    for (const px of [180, 60]) {
      const dentro = corpo.replace('<svg ',
        `<svg style="width:${(w * 100).toFixed(3)}%;height:${(h * 100).toFixed(3)}%;display:block" `);
      await page.setViewportSize({ width: Math.max(px, 40), height: Math.max(px, 40) });
      await page.setContent(`<!doctype html><style>html,body{margin:0}
        .cela{width:${px}px;height:${px}px;background:#f6f7f4;color:#17191b;
              display:flex;align-items:center;justify-content:center}
        .cela svg{fill:currentColor}</style><div class="cela">${dentro}</div>`);
      await page.locator('.cela').screenshot({ path: path.join(SAIDA, `s${chave}-${px}.png`) });
    }
  }
  console.log('escritas as três construções do «s»');
}

/** As seis letras de cada construção, lado a lado, para o ritmo se ver letra a
 *  letra. A da terceira é composta, que é o que a terceira é. */
async function alfabetos(page, base) {
  for (const c of CONSTRUCOES) {
    let html;
    if (c.svg) {
      const { cru, vb } = await marcaSvg(`${c.id}-${c.id === '1' ? 'geometrica' : 'humanista'}-alfabeto.svg`);
      const corpo = cru.replace(/^[\s\S]*?<svg /, '<svg ').replace(/<title>[\s\S]*?<\/title>/, '');
      const alt = 300;
      html = `<!doctype html><style>html,body{margin:0;background:#f6f7f4;color:#17191b}
        .c{padding:24px;display:inline-block}svg{fill:currentColor;display:block}</style>`
        + `<div class="c">${corpo.replace('<svg ', `<svg height="${alt}" width="${Math.round(vb[2] / vb[3] * alt)}" `)}</div>`;
    } else {
      html = `<!doctype html><meta charset="utf-8">
        <link rel="stylesheet" href="/src/styles/tokens.css">
        <style>html,body{margin:0;background:#f6f7f4;color:#17191b}
        .c{padding:24px;display:inline-block;font-family:var(--f-prosa);font-weight:400;
           font-size:395px;line-height:1;letter-spacing:0.12em}</style>
        <div class="c">estado</div>`;
    }
    await page.setViewportSize({ width: 2400, height: 600 });
    await page.goto(`${base}/design/marca/_pagina.html`).catch(() => {});
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.c').screenshot({ path: path.join(SAIDA, `alf-${c.id}.png`) });
  }
  console.log('escritos os três alfabetos');
}

/* ------------------------------------------------------------------------ */
/* OS FAVICONS DA TIRA DO DIRETOR                                            */
/* ------------------------------------------------------------------------ */
/**
 * A tira de separadores da continuação da 7b precisa dos ícones dos vizinhos
 * aos 16 e aos 32 px, e eles vêm dos ficheiros que já estão em `referencias/`,
 * recolhidos numa sessão anterior. NADA SE VAI BUSCAR À REDE, que é a regra
 * deste ramo desde o princípio.
 *
 * O DA GUARDIAN É UM SVG COM NOME DE PNG, e é preciso tratá-lo como o que é: o
 * ficheiro `theguardian.com.png` traz `<svg …>` lá dentro. Vai por conteúdo,
 * embebido na página, e não por `<img src>`, porque o servidor daqui serve
 * `.png` como `image/png` e o navegador recusaria.
 *
 * A ANTHROPIC E A GOOGLE NÃO ESTÃO EM `referencias/`, e por isso ficam um
 * quadrado liso rotulado como marcador. Um desenho de memória da marca de outrem
 * não é medição nenhuma: é a mesma escolha que a §6 fez com o navegador da
 * Microsoft e com a Ecosia.
 */
const VIZINHOS = [
  { id: 'guardian', ficheiro: 'theguardian.com.png', svg: true },
  { id: 'publico', ficheiro: 'publico.pt.png' },
  { id: 'nyt', ficheiro: 'nytimes.com.png' },
];

async function referencias(page) {
  const REF = path.join(AQUI, 'referencias');
  for (const v of VIZINHOS) {
    const cru = await readFile(path.join(REF, v.ficheiro));
    let dentro;
    if (v.svg) {
      dentro = cru.toString('utf8').replace(/^[\s\S]*?<svg /, '<svg ')
        .replace('<svg ', '<svg width="100%" height="100%" ');
    } else {
      dentro = `<img src="data:image/png;base64,${cru.toString('base64')}" width="100%" height="100%">`;
    }
    for (const px of [16, 32]) {
      await page.setViewportSize({ width: 64, height: 64 });
      await page.setContent(`<!doctype html><style>html,body{margin:0}
        .c{width:${px}px;height:${px}px;overflow:hidden;display:block}
        .c img,.c svg{display:block;width:${px}px;height:${px}px}</style>
        <div class="c">${dentro}</div>`);
      await page.locator('.c').screenshot({ path: path.join(SAIDA, `ref-${v.id}-${px}.png`) });
    }
  }
  /* o favicon de HOJE, que é a queixa do diretor: fio, sem campo. O ficheiro
     traz a regra do esquema escuro do sistema, e por isso a página é rendida
     com o esquema escuro: é o que o separador dele mostra. */
  const favicon = (await readFile(path.join(PUBLIC, 'favicon.svg'), 'utf8'))
    .replace(/^[\s\S]*?<svg /, '<svg ');
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const px of [16, 32]) {
    await page.setViewportSize({ width: 64, height: 64 });
    await page.setContent(`<!doctype html><style>html,body{margin:0}
      .c{width:${px}px;height:${px}px;display:block}
      .c svg{display:block;width:${px}px;height:${px}px}</style>
      <div class="c">${favicon.replace('<svg ', '<svg width="100%" height="100%" ')}</div>`);
    await page.locator('.c').screenshot({
      path: path.join(SAIDA, `ref-hoje-${px}.png`), omitBackground: true,
    });
  }
  await page.emulateMedia({ colorScheme: null });
  console.log('escritos os favicons dos vizinhos e o de hoje');
}

/* ------------------------------------------------------------------------ */
async function principal() {
  await mkdir(SAIDA, { recursive: true });
  const { s, porta } = await servidor();
  const base = `http://127.0.0.1:${porta}`;
  const b = await chromium.launch();
  const page = await b.newPage({ deviceScaleFactor: 1 });
  const modo = process.argv[2] ?? 'tudo';
  if (modo === 'provas' || modo === 'tudo') await provas(page, base);
  if (modo === 'cabecalhos' || modo === 'tudo') await cabecalhos(page, base);
  if (modo === 'icones' || modo === 'tudo') await icones(page, base);
  if (modo === 'esses' || modo === 'tudo') await esses(page, base);
  if (modo === 'alfabetos' || modo === 'tudo') await alfabetos(page, base);
  if (modo === 'referencias' || modo === 'tudo') await referencias(page);
  await b.close();
  s.close();
}

principal();
