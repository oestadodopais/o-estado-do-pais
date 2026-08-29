/**
 * A DIREÇÃO K, RENDIDA NO NAVEGADOR DO REPOSITÓRIO (ADENDA 8, 29.08.2026).
 *
 * O diretor entregou sete ficheiros em `design/marca/direcoes-k/`. Este programa
 * NÃO OS TOCA: lê-os, põe-nos nas celas onde a adenda os manda ver, e escreve os
 * PNG em `design/marca/EXPORT-K/`.
 *
 * DUAS PASTAS DE DESENHO DESTA RONDA, e a diferença entre elas importa:
 *   · `derivados-k/`           o que a ADENDA 8 pede para se poder medir: a regra
 *                              do esquema escuro e os dois glifos de interface
 *                              (marcadores, não são marca de ninguém);
 *   · `direcoes-k/derivadas/`  as sugestões de diferença na marca dele (K2 a K5),
 *                              pedidas depois, cada uma com UMA coisa mudada.
 *
 * É a mesma máquina de `render-estado.mjs`, e não uma segunda: o mesmo servidor
 * (que existe por causa dos tipos, ver abaixo), a mesma marcação de cabeçalho, a
 * mesma medição com `getBoundingClientRect()`. Não se importou o ficheiro porque
 * ele corre `principal()` ao ser importado, e isso punha as 96 capturas da sétima
 * ronda a refazerem-se antes desta começar.
 *
 * O SERVIDOR EXISTE POR CAUSA DOS TIPOS. `tokens.css` declara os `@font-face`
 * com caminhos absolutos (`/tipos/spectral/…`). Sobre `file://` não resolvem e o
 * Chromium cairia no Georgia sem o dizer, o que daria uma medição do tipo
 * errado, e nesta ronda há um «E» composto em Spectral Bold a servir de
 * vizinho, ou seja de RÉGUA, e uma régua no tipo errado não mede nada. Por isso
 * o «E» só se captura depois de `document.fonts.check()` confirmar que o
 * ficheiro da casa está carregado, e o programa PÁRA se não estiver.
 * NÃO ESCREVE NADA EM `src/` NEM EM `public/`.
 *
 * USO: node design/marca/render-k.mjs celas        as celas de ícone e favicon
 *      node design/marca/render-k.mjs colisao      as celas com os vizinhos
 *      node design/marca/render-k.mjs cabecalhos   os cabeçalhos, com e sem marca
 *      node design/marca/render-k.mjs formas       as formas às três medidas
 *      node design/marca/render-k.mjs referencias  os favicons dos vizinhos
 *      node design/marca/render-k.mjs              tudo
 */

import { chromium } from 'playwright';
import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
const PUBLIC = path.join(RAIZ, 'public');
const DIRETOR = path.join(AQUI, 'direcoes-k');
const DERIVADOS = path.join(AQUI, 'derivados-k');
const DERIVADAS = path.join(DIRETOR, 'derivadas');
const SAIDA = path.join(AQUI, 'EXPORT-K');

/** As sugestões de diferença, por ordem de número. A K1 é o ficheiro do diretor
 *  e não está aqui: entra sempre pelo caminho dele. */
const VARIANTES = ['k2', 'k3', 'k4', 'k5'];
/** Todas as cinco, para as provas em que a K1 é o controlo. */
const CINCO = ['k1', ...VARIANTES];

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
          res.writeHead(200, {
            'content-type': TIPOS[path.extname(f)] ?? 'application/octet-stream',
          });
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
/* OS FICHEIROS, LIDOS E NÃO REESCRITOS                                      */
/* ------------------------------------------------------------------------ */
/**
 * O `viewBox` de cada ficheiro é a moldura QUE ELE TRAZ, e é ela que manda no
 * enquadramento. É a diferença desta ronda para as anteriores: ali o programa
 * enquadrava cada desenho a 70,3 % do campo (360 em 512) para que nenhum ganhasse
 * por ter mais folga; aqui o enquadramento faz parte da entrega (o favicon e o
 * ícone trazem o campo de 512, as marcas trazem a caixa de tinta) e reenquadrar
 * era medir outro desenho.
 */
async function svgDe(nome, base = DIRETOR) {
  const cru = await readFile(path.join(base, nome), 'utf8');
  const vb = /viewBox="([^"]+)"/.exec(cru)[1].trim().split(/\s+/).map(Number);
  const dentro = cru
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<title>[\s\S]*?<\/title>/, '');
  return { cru, vb, dentro };
}

/** O desenho posto NA GRELHA DE 512 a um tamanho de cela, e não à sua caixa.
 *  É o que a prova do LEIA-ME pede: «o fio de 7 unidades numa grelha de 512
 *  mede quanto a 60 e a 32». Sem isto, uma marca de 340 de largura rendida a
 *  60 px daria um fio de 1,2 px e não os 0,8 px que a grelha manda. */
function emGrelha(peca, px, cor) {
  const estilo = cor ? ` style="color:${cor}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" `
    + `width="${px}" height="${px}"${estilo}>${peca.dentro}</svg>`;
}

/** O desenho à sua própria caixa, com o lado maior a medir `px`. É como se
 *  julga uma marca (a caixa de tinta é o que o olho vê) e não uma cela. */
function aoNatural(peca, px, cor) {
  const [, , w, h] = peca.vb;
  const razao = w / h;
  const [lw, lh] = razao >= 1 ? [px, px / razao] : [px * razao, px];
  const estilo = cor ? `color:${cor};` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${peca.vb.join(' ')}" `
    + `width="${lw.toFixed(3)}" height="${lh.toFixed(3)}" `
    + `style="${estilo}display:block">${peca.dentro}</svg>`;
}

/* ------------------------------------------------------------------------ */
/* OS CAMPOS                                                                 */
/* ------------------------------------------------------------------------ */
/**
 * As cores são as do LEIA-ME do diretor, que são as de `tokens.css` medidas por
 * `scripts/medir-contraste.mjs`: tinta `#17191b`, papel `#f6f7f4`, cobalto
 * `#1f4e8c`, e em campo escuro papel-claro `#eceeea` e cobalto-claro `#7fa6dc`.
 * Nenhuma foi reescrita: leem-se do ficheiro dele.
 *
 * OS DOIS CINZENTOS DE SEPARADOR. O escuro (`#35363a` no separador ativo,
 * `#202124` na barra) é o do tema escuro do Chromium tal como aparece na captura
 * que o diretor mandou na sétima ronda, lido a olho e não do código dele. O
 * CLARO NÃO TEM CAPTURA e é ESCOLHIDO: um branco no separador ativo e um
 * cinzento claro na barra. O que a medição usa é o contraste do sinal contra o
 * campo, e essa relação não muda com dois pontos de cinzento.
 */
const CAMPOS = {
  papel: '#f6f7f4',
  tinta: '#17191b',
  'tira-escura': '#35363a',
  'tira-clara': '#ffffff',
};

function pagina(dentro, fundo, comTipos = false) {
  const tipos = comTipos ? '<link rel="stylesheet" href="/src/styles/tokens.css">' : '';
  return `<!doctype html><html><head><meta charset="utf-8">${tipos}
<style>
  html,body{margin:0;padding:0;background:${fundo ?? 'transparent'}}
  .cela{background:${fundo ?? 'transparent'};display:flex;align-items:center;
        justify-content:center;overflow:hidden}
  .cela svg{display:block}
  /* O «E» vizinho é composto, e o tipo é o da casa. Vai pela variável e não por
     uma cadeia escrita aqui: se um dia a casa trocar de serifada, esta régua
     troca com ela em vez de mentir. */
  .cela text{font-family:var(--f-prosa);font-weight:700}
</style></head><body>${dentro}</body></html>`;
}

async function captura(page, html, px, alvo, transparente) {
  await page.setViewportSize({ width: Math.max(px, 40), height: Math.max(px, 40) });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.cela').screenshot({ path: alvo, omitBackground: !!transparente });
}

/* ------------------------------------------------------------------------ */
/* 1 · AS CELAS DE FAVICON E DE ÍCONE                                        */
/* ------------------------------------------------------------------------ */
/**
 * Por peça, e a adenda nomeia-as todas:
 *
 *  · `cru`        o favicon tal como veio: campo TRANSPARENTE, barras de tinta.
 *                 Guarda-se com canal alfa (`omitBackground`), para que a
 *                 composição sobre o separador seja feita onde ela acontece e
 *                 não aqui: um `convert("RGB")` de um PNG transparente pinta o
 *                 campo de PRETO e mostraria um campo que o ficheiro não tem.
 *  · `sep-*`      o mesmo, composto PELO NAVEGADOR sobre o cinzento do separador.
 *                 É o que a régua mede, para não haver duas composições a dizer
 *                 coisas diferentes sobre a mesma cela.
 *  · `regra-*`    o mesmo com `prefers-color-scheme: dark`, nos dois esquemas.
 *  · `tinta`      o campo de tinta do ícone do telemóvel, com os cantos do
 *                 aparelho; guardado com alfa, para que os cantos mostrem o
 *                 separador e não um branco que o ficheiro não tem.
 *  · `papel`      o favicon sobre papel, que é o campo em que foi desenhado.
 */
const TAMANHOS_CELA = [512, 180, 60, 32, 16];

function trabalhosDaPeca(id, favicon, icone, px) {
  return [
    { id: `${id}-cru-${px}`, peca: favicon, px, fundo: null, transp: true },
    { id: `${id}-papel-${px}`, peca: favicon, px, fundo: CAMPOS.papel },
    { id: `${id}-sep-escuro-${px}`, peca: favicon, px, fundo: CAMPOS['tira-escura'] },
    { id: `${id}-sep-claro-${px}`, peca: favicon, px, fundo: CAMPOS['tira-clara'] },
    { id: `${id}-tinta-${px}`, peca: icone, px, fundo: null, transp: true },
    { id: `${id}-tinta-sep-escuro-${px}`, peca: icone, px, fundo: CAMPOS['tira-escura'] },
    { id: `${id}-tinta-sep-claro-${px}`, peca: icone, px, fundo: CAMPOS['tira-clara'] },
  ];
}

async function celas(page) {
  const favicon = await svgDe('favicon.svg');
  const icone = await svgDe('icone-telemovel.svg');
  const regra = await svgDe('favicon-regra-escuro.svg', DERIVADOS);
  const daVariante = {};
  for (const v of VARIANTES) {
    daVariante[v] = [await svgDe(`${v}-favicon.svg`, DERIVADAS),
      await svgDe(`${v}-icone-telemovel.svg`, DERIVADAS)];
  }

  const trabalhos = [];
  for (const px of TAMANHOS_CELA) {
    trabalhos.push(...trabalhosDaPeca('k', favicon, icone, px));
    trabalhos.push({ id: `k-regra-claro-${px}`, peca: regra, px, fundo: null, transp: true, esquema: 'light' });
    trabalhos.push({ id: `k-regra-escuro-${px}`, peca: regra, px, fundo: null, transp: true, esquema: 'dark' });
    trabalhos.push({ id: `k-regra-sep-escuro-${px}`, peca: regra, px, fundo: CAMPOS['tira-escura'], esquema: 'dark' });
    trabalhos.push({ id: `k-regra-sep-claro-${px}`, peca: regra, px, fundo: CAMPOS['tira-clara'], esquema: 'light' });
    for (const v of VARIANTES) {
      trabalhos.push(...trabalhosDaPeca(v, daVariante[v][0], daVariante[v][1], px));
    }
  }

  for (const t of trabalhos) {
    await page.emulateMedia({ colorScheme: t.esquema ?? null });
    const html = pagina(
      `<div class="cela" style="width:${t.px}px;height:${t.px}px">${emGrelha(t.peca, t.px)}</div>`,
      t.fundo,
    );
    await captura(page, html, t.px, path.join(SAIDA, `ic-${t.id}.png`), t.transp);
  }
  await page.emulateMedia({ colorScheme: null });
  console.log(`escritas ${trabalhos.length} celas em EXPORT-K/`);
}

/* ------------------------------------------------------------------------ */
/* 2 · A COLISÃO, COM TRÊS VIZINHOS                                          */
/* ------------------------------------------------------------------------ */
/**
 * A pergunta da adenda é «a barra do meio mais curta e em cobalto chega para a
 * marca não se ler como botão?», e o diretor acrescentou uma segunda ao dizer
 * que a marca «lembra o E de estado»: se a leitura de letra é uma qualidade e
 * não um acaso, então há um vizinho a mais a pôr na fila, e é a letra.
 *
 * TRÊS VIZINHOS, e cada um é uma pergunta:
 *   · o BOTÃO DE MENU (três linhas iguais): para que lado é que a marca cai;
 *   · o ALINHAR À ESQUERDA (quatro alternadas): o mesmo, com mais uma linha;
 *   · o «E» VERSAL EM SPECTRAL BOLD: quanto é que falta à marca para ser letra.
 *
 * Os dois glifos são MARCADORES desenhados na grelha da própria marca
 * (`derivados-k/`), para que a resposta seja sobre a marca e não sobre a grelha.
 * O «E» não é marcador: é o tipo da casa, e por isso é uma régua a sério, e está
 * à MESMA ALTURA DE MAIÚSCULA que a marca tem de caixa (312 unidades em 512), com
 * a haste na mesma margem esquerda (86) e a base na mesma linha (412).
 *
 * A 16 px porque é o separador do navegador, a 24 px porque é o tamanho a que um
 * botão de menu vive numa barra de aplicação, e a 512 px porque é onde se podem
 * MEDIR os braços do «E» do tipo em vez de repetir de cor a proporção deles.
 */
const TAMANHOS_COLISAO = [16, 24, 512];

/** A altura de maiúscula do Spectral: 660 em 1000 de em, `sCapHeight` da tabela
 *  `OS/2` do ficheiro da casa. Com a caixa da marca a medir 312 unidades, o
 *  corpo do «E» que lhe iguala a maiúscula é 312 / 0,660. */
const MAIUSCULA = 0.66;
const CORPO_DO_E = 312 / MAIUSCULA;

function celaDoE(px, cor) {
  return `<div class="cela" style="width:${px}px;height:${px}px">`
    + `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${px}" height="${px}">`
    + `<text x="86" y="412" font-size="${CORPO_DO_E.toFixed(3)}" fill="${cor}">E</text>`
    + `</svg></div>`;
}

async function colisao(page, base) {
  const menu = await svgDe('glifo-menu.svg', DERIVADOS);
  const alinhar = await svgDe('glifo-alinhar-esquerda.svg', DERIVADOS);
  const monos = {};
  for (const v of CINCO) monos[v] = await svgDe(`${v}-mono.svg`, DERIVADAS);
  /* as celas a cores: a K1 é o ficheiro do diretor; as outras quatro trazem as
     cores claras dele, que é o que os ficheiros delas têm */
  const cores = { k1: await svgDe('favicon.svg') };
  for (const v of VARIANTES) cores[v] = await svgDe(`${v}-favicon.svg`, DERIVADAS);
  const k1Escuro = await svgDe('favicon-regra-escuro.svg', DERIVADOS);

  /* O TIPO TEM DE ESTAR CARREGADO, e confere-se em vez de se esperar. */
  await page.goto(`${base}/design/marca/_k.html`).catch(() => {});
  await page.setContent(pagina(celaDoE(512, '#17191b'), CAMPOS.papel, true));
  await page.evaluate(() => document.fonts.ready);
  const temTipo = await page.evaluate(() => document.fonts.check('700 100px Spectral'));
  if (!temTipo) {
    throw new Error('o Spectral Bold não carregou; o «E» sairia em Georgia e não mediria nada');
  }

  for (const px of TAMANHOS_COLISAO) {
    for (const [tema, fundo, tinta, esquema] of [
      ['claro', CAMPOS.papel, '#17191b', 'light'],
      ['escuro', CAMPOS.tinta, '#eceeea', 'dark'],
    ]) {
      await page.emulateMedia({ colorScheme: esquema });
      const cela = (dentro) => `<div class="cela" style="width:${px}px;height:${px}px">${dentro}</div>`;
      /* os três vizinhos */
      await captura(page, pagina(cela(emGrelha(menu, px, tinta)), fundo),
        px, path.join(SAIDA, `col-menu-${tema}-${px}.png`));
      await captura(page, pagina(cela(emGrelha(alinhar, px, tinta)), fundo),
        px, path.join(SAIDA, `col-alinhar-${tema}-${px}.png`));
      await page.goto(`${base}/design/marca/_k.html`).catch(() => {});
      await captura(page, pagina(celaDoE(px, tinta), fundo, true),
        px, path.join(SAIDA, `col-E-${tema}-${px}.png`));
      /* as cinco em monocromia: é onde se vê o que resta sem a cor */
      for (const v of CINCO) {
        await captura(page, pagina(cela(emGrelha(monos[v], px, tinta)), fundo),
          px, path.join(SAIDA, `col-m-${v}-${tema}-${px}.png`));
      }
      /* e a cores. Em campo escuro só a K1 tem ficheiro de cores escuras (a
         regra derivada); as outras quatro trazem as cores claras, e por isso a
         prova de cor delas é em campo claro, que é onde elas foram desenhadas. */
      if (tema === 'claro') {
        for (const v of CINCO) {
          await captura(page, pagina(cela(emGrelha(cores[v], px)), fundo),
            px, path.join(SAIDA, `col-c-${v}-${tema}-${px}.png`));
        }
      } else {
        await captura(page, pagina(cela(emGrelha(k1Escuro, px)), fundo),
          px, path.join(SAIDA, `col-c-k1-${tema}-${px}.png`));
      }
    }
  }
  await page.emulateMedia({ colorScheme: null });
  console.log(`escritas as celas de colisão a ${TAMANHOS_COLISAO.join(', ')} px`);
}

/* ------------------------------------------------------------------------ */
/* 3 · O CABEÇALHO                                                           */
/* ------------------------------------------------------------------------ */
const LARGURAS = [320, 390, 768, 1280];
const TEMAS = ['claro', 'escuro'];

/**
 * A ÂNCORA B (`NOTAS.md` §5): a marca à ALTURA DE MAIÚSCULA do cabeçalho, e não
 * ao corpo dele. É a âncora que não obriga a mexer no cabeçalho, e é por isso
 * que é a que se mede.
 *
 * A marca do diretor mede 340 × 312 na grelha de 512, ou seja é MAIS LARGA DO
 * QUE ALTA. Presa à altura de maiúscula, a largura sai da proporção. As quatro
 * variantes têm a MESMA caixa (só o meio muda), e por isso entram no cabeçalho
 * exactamente com o mesmo tamanho: o que se mede na K1 vale para as cinco.
 *
 * O ESPAÇO ENTRE A MARCA E O NOME é 0,42 da altura de maiúscula, que é o número
 * da §6 bis. HERDADO, e não medido aqui: aquele 0,42 saiu de duas formas
 * REDONDAS quase encostadas (o anel do «e» e o «O» de «O Estado»), e esta marca
 * é uma pilha de rectângulos, que é outro problema de espaço. Fica dito em vez
 * de fingir que foi medido.
 */
const ESPACO_MARCA = 0.42;

function estiloDaMarca(vb) {
  const [, , w, h] = vb;
  const larguraEm = (w / h) * MAIUSCULA;
  return `display:inline-block;height:${MAIUSCULA}em;width:${larguraEm.toFixed(4)}em;`
    + `vertical-align:baseline;margin-right:${(ESPACO_MARCA * MAIUSCULA).toFixed(4)}em;`
    + `letter-spacing:normal;`;
}

/** Os dois nomes que a adenda manda ver ao lado da marca. */
const NOMES = [
  ['nome', 'O Estado do País'],
  ['estado', 'estado'],
];

/** O desenho que vai ao cabeçalho, por variante e por tema. A K1 tem os dois
 *  ficheiros do diretor; as outras quatro só têm as cores claras, e por isso o
 *  cabeçalho delas mede-se em campo claro. O que muda entre variantes é a
 *  geometria, e a geometria é a mesma nos dois temas. */
async function marcaDoCabecalho(v, tema) {
  if (v === 'k1') {
    return svgDe(tema === 'escuro' ? 'marca-cheia-escuro.svg' : 'marca-cheia-claro.svg');
  }
  const p = await svgDe(`${v}-favicon.svg`, DERIVADAS);
  /* o favicon traz o campo de 512; no cabeçalho o que entra é a CAIXA DA MARCA,
     que é a mesma da cheia do diretor: 86 100 340 312 */
  return { ...p, vb: [86, 100, 340, 312] };
}

async function paginaCabecalho(nomeTexto, v, tema) {
  let marca = '';
  if (v) {
    const peca = await marcaDoCabecalho(v, tema);
    marca = `<svg class="marca-k" viewBox="${peca.vb.join(' ')}" aria-hidden="true" `
      + `focusable="false" style="${estiloDaMarca(peca.vb)}">${peca.dentro}</svg>`;
  }
  return `<!doctype html><html lang="pt"><head><meta charset="utf-8">
<link rel="stylesheet" href="/src/styles/tokens.css">
<link rel="stylesheet" href="/src/styles/site.css">
<style>
  /* nada de composição nova: só o que tira da folha o que a página inteira
     traria e que aqui não há (a navegação, a mobília, o conteúdo). */
  body { margin: 0; }
</style></head><body>
<div class="wrap">
  <header>
    <div class="masthead">
      <h1 class="wordmark" id="marca">${marca}${nomeTexto}</h1>
      <p class="masthead-identidade" id="descritor">Um observatório de Portugal.</p>
    </div>
  </header>
</div>
</body></html>`;
}

/** O que se mede em cada cabeçalho: a ALTURA DO `.masthead`, que é o que o
 *  cabeçalho custa à página, e a caixa do `.wordmark`. A tinta não se mede
 *  aqui (`getBoundingClientRect()` devolve a caixa de LINHA), mede-se no PNG
 *  com `marca-k.py`, que é o método da §8. */
async function mede(page) {
  return page.evaluate(() => {
    const m = document.querySelector('.masthead').getBoundingClientRect();
    const w = document.querySelector('#marca').getBoundingClientRect();
    const cs = getComputedStyle(document.querySelector('#marca'));
    const sig = document.querySelector('.marca-k');
    const s = sig ? sig.getBoundingClientRect() : null;
    return {
      masthead: +m.height.toFixed(2),
      wordmarkCaixa: +w.height.toFixed(2),
      corpo: cs.fontSize,
      marcaAlta: s ? +s.height.toFixed(2) : null,
      marcaLarga: s ? +s.width.toFixed(2) : null,
      janela: window.innerWidth,
    };
  });
}

async function umCabecalho(page, base, nomeTexto, v, largura, tema) {
  const html = await paginaCabecalho(nomeTexto, v, tema);
  await page.setViewportSize({ width: largura, height: 460 });
  await page.goto(`${base}/design/marca/_k.html`).catch(() => {});
  await page.setContent(html);
  await page.evaluate((t) => {
    if (t === 'escuro') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }, tema);
  await page.evaluate(() => document.fonts.ready);
  return mede(page);
}

async function cabecalhos(page, base) {
  const medidas = [];
  /* a K1 leva a grelha inteira que a adenda pede: dois nomes, com e sem marca,
     quatro larguras, dois temas */
  for (const [nk, ntxt] of NOMES) {
    for (const marca of ['com', 'sem']) {
      for (const largura of LARGURAS) {
        for (const tema of TEMAS) {
          const m = await umCabecalho(page, base, ntxt, marca === 'com' ? 'k1' : null, largura, tema);
          medidas.push({ variante: 'k1', nome: nk, marca, largura, tema, ...m });
          await page.locator('.masthead').screenshot({
            path: path.join(SAIDA, `cab-${nk}-${marca}-${largura}-${tema}.png`),
          });
          await page.locator('#marca').screenshot({
            path: path.join(SAIDA, `wm-${nk}-${marca}-${largura}-${tema}.png`),
          });
        }
      }
    }
  }
  /* as quatro variantes: campo claro, os dois nomes, a largura mais apertada e a
     mais larga. O campo claro porque é o que os ficheiros delas trazem, e as duas
     larguras porque são as que a §6 quater mostrou serem as que decidem. */
  for (const v of VARIANTES) {
    for (const [nk, ntxt] of NOMES) {
      for (const largura of [390, 1280]) {
        const m = await umCabecalho(page, base, ntxt, v, largura, 'claro');
        medidas.push({ variante: v, nome: nk, marca: 'com', largura, tema: 'claro', ...m });
        await page.locator('.masthead').screenshot({
          path: path.join(SAIDA, `cab-${v}-${nk}-com-${largura}-claro.png`),
        });
      }
    }
  }
  await writeFile(path.join(SAIDA, 'cabecalhos.json'), JSON.stringify(medidas, null, 2));
  console.log(`escritos ${medidas.length} cabeçalhos e EXPORT-K/cabecalhos.json`);
}

/* ------------------------------------------------------------------------ */
/* 4 · AS FORMAS ÀS TRÊS MEDIDAS, E A PROVA DO FIO                           */
/* ------------------------------------------------------------------------ */
/**
 * As três medidas são as do LEIA-ME e da adenda: 60, 120 e 512 px. Cada forma
 * vai ao seu campo: a cheia clara e a fina clara em papel, as escuras em tinta,
 * o ícone traz o campo dele e o favicon vai aos dois, porque o campo dele é de
 * quem o desenha.
 *
 * A MEDIDA É A DA CAIXA DE TINTA (o lado maior) para as marcas, e a da GRELHA
 * para o favicon e o ícone, que trazem o campo de 512. A prova do fio é na
 * grelha, porque é assim que o LEIA-ME a escreve.
 */
const MEDIDAS_FORMA = [512, 120, 60];

async function formas(page) {
  for (const [id, ficheiro, base, fundo] of [
    ['cheia-claro', 'marca-cheia-claro.svg', DIRETOR, CAMPOS.papel],
    ['cheia-escuro', 'marca-cheia-escuro.svg', DIRETOR, CAMPOS.tinta],
    ['fina-claro', 'marca-fina-claro.svg', DIRETOR, CAMPOS.papel],
    ['fina-escuro', 'marca-fina-escuro.svg', DIRETOR, CAMPOS.tinta],
  ]) {
    const peca = await svgDe(ficheiro, base);
    for (const px of MEDIDAS_FORMA) {
      const html = pagina(
        `<div class="cela" style="padding:${Math.round(px * 0.12)}px">${aoNatural(peca, px)}</div>`,
        fundo);
      await captura(page, html, Math.round(px * 1.4), path.join(SAIDA, `fm-${id}-${px}.png`));
    }
  }
  const naGrelha = [
    ['icone', 'icone-telemovel.svg', DIRETOR, null],
    ['favicon-papel', 'favicon.svg', DIRETOR, CAMPOS.papel],
    ['favicon-tinta', 'favicon.svg', DIRETOR, CAMPOS.tinta],
  ];
  for (const v of VARIANTES) {
    naGrelha.push([`${v}-icone`, `${v}-icone-telemovel.svg`, DERIVADAS, null]);
    naGrelha.push([`${v}-favicon-papel`, `${v}-favicon.svg`, DERIVADAS, CAMPOS.papel]);
    naGrelha.push([`${v}-favicon-tinta`, `${v}-favicon.svg`, DERIVADAS, CAMPOS.tinta]);
  }
  for (const [id, ficheiro, base, fundo] of naGrelha) {
    const peca = await svgDe(ficheiro, base);
    for (const px of MEDIDAS_FORMA) {
      const html = pagina(
        `<div class="cela" style="width:${px}px;height:${px}px">${emGrelha(peca, px)}</div>`, fundo);
      await captura(page, html, px, path.join(SAIDA, `fm-${id}-${px}.png`));
    }
  }

  /**
   * A PROVA DO PRÓPRIO LEIA-ME: «fio da fina 7» numa grelha de 512, e «nunca
   * abaixo de 60 px». O que a adenda manda medir é quanto é que esse fio mede a
   * 60 e a 32, e a resposta tem de ser LIDA no PNG e não calculada, porque o que
   * decide não é a fração: é o que o suavizado do navegador faz com ela.
   *
   * As duas leituras da mesma frase, e é preciso dar as duas porque o LEIA-ME
   * não diz de qual fala:
   *   · na GRELHA (o campo de 512 rendido a n px) o fio dá 7/512 × n;
   *   · à CAIXA DE TINTA (a marca, 340 de largura, rendida a n px) dá 7/340 × n.
   */
  const fina = await svgDe('marca-fina-claro.svg');
  for (const px of [120, 60, 32, 16]) {
    await captura(page, pagina(
      `<div class="cela" style="width:${px}px;height:${px}px">${emGrelha(fina, px)}</div>`,
      CAMPOS.papel), px, path.join(SAIDA, `fio-grelha-${px}.png`));
    /* A CELA DA CAIXA LEVA UMA MARGEM DE PAPEL, e é preciso: sem ela o canto da
       imagem cai em cima do contorno da marca (o desenho começa no canto do
       viewBox), a régua lê TINTA como campo e inverte o sinal. Apanhou-se ao ler
       76,8 % de sinal numa marca de fio. */
    await captura(page, pagina(
      `<div class="cela" style="padding:${Math.max(2, Math.round(px * 0.10))}px">`
      + `${aoNatural(fina, px)}</div>`,
      CAMPOS.papel), Math.round(px * 1.4), path.join(SAIDA, `fio-caixa-${px}.png`));
  }
  console.log('escritas as formas e as celas do fio');
}

/* ------------------------------------------------------------------------ */
/* 5 · OS FAVICONS DOS VIZINHOS                                              */
/* ------------------------------------------------------------------------ */
/**
 * Os mesmos três de sempre, dos ficheiros de `referencias/` recolhidos numa
 * sessão anterior. NADA SE VAI BUSCAR À REDE. O da Guardian é um SVG com nome de
 * PNG e vai por conteúdo. A Anthropic e a Google não estão em `referencias/` e
 * ficam quadrados marcadores, desenhados por `marca-k.py`: um desenho de memória
 * da marca de outrem não é medição nenhuma.
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
  console.log('escritos os favicons dos vizinhos');
}

/* ------------------------------------------------------------------------ */
async function principal() {
  await mkdir(SAIDA, { recursive: true });
  const { s, porta } = await servidor();
  const base = `http://127.0.0.1:${porta}`;
  const b = await chromium.launch();
  const page = await b.newPage({ deviceScaleFactor: 1 });
  const modo = process.argv[2] ?? 'tudo';
  if (modo === 'celas' || modo === 'tudo') await celas(page);
  if (modo === 'colisao' || modo === 'tudo') await colisao(page, base);
  if (modo === 'cabecalhos' || modo === 'tudo') await cabecalhos(page, base);
  if (modo === 'formas' || modo === 'tudo') await formas(page);
  if (modo === 'referencias' || modo === 'tudo') await referencias(page);
  await b.close();
  s.close();
}

principal();
