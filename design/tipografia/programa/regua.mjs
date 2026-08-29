/**
 * A RÉGUA DO ESTUDO TIPOGRÁFICO: as medidas 1 a 6 nas páginas reais do sítio.
 *
 * Corre-se com a construção de uma combinação já feita em `dist/`:
 *
 *   TIPOS_ESTUDO=literata+bitter npx astro build
 *   node design/tipografia/programa/regua.mjs literata+bitter
 *
 * O que faz, por esta ordem:
 *
 *   1. levanta um servidor estático sobre `dist/`, com `/tipos-estudo/` mapeado
 *      para `design/tipografia/tipos/`. É assim que as candidatas chegam ao
 *      navegador sem um único byte entrar em `public/tipos`;
 *   2. abre três contextos do Chromium, um por densidade (1×, 2×, 3×), e em cada
 *      um percorre as cinco páginas e as sete larguras, redimensionando a
 *      janela: a página é a mesma, o que muda é o ecrã, que é o que a rubrica
 *      pede;
 *   3. em cada célula tira a captura e lê as medidas 1, 4 e 6;
 *   4. a 1×, recorta o corpo da prosa e um bloco de algarismos, volta a abrir os
 *      PNG no navegador e passa os píxeis pelo `pixeis.mjs` (medidas 2 e 3).
 *
 * NENHUM DETETOR DIZ VERDE SEM TER VISTO O SEU VERMELHO. O `pixeis.mjs` planta
 * os seus; a medida 4 planta o dela aqui, em `provaDosTabulares`, com o mesmo
 * tipo medido duas vezes, uma com `tabular-nums` e outra sem.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { traçoMaisFino, abertura } from './pixeis.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const DIST = path.join(RAIZ, 'dist');
const TIPOS = path.join(RAIZ, 'design', 'tipografia', 'tipos');
const CAPTURAS = path.join(RAIZ, 'design', 'tipografia', 'capturas');

/** As cinco páginas da rubrica, e o nome curto com que entram nos ficheiros. */
export const PAGINAS = [
  { nome: 'primeira', rota: '/' },
  { nome: 'concelho', rota: '/municipios/evora' },
  { nome: 'regiao', rota: '/regioes/alentejo' },
  { nome: 'linha', rota: '/livro-razao/evora-prr-vencido-aprovado-2026' },
  { nome: 'leitura', rota: '/estudos/evora-orcamentado-pago-devido-2025/texto' },
];

export const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280];
export const DENSIDADES = [1, 2, 3];

/** A altura da janela: o telemóvel da rubrica é 390 × 844. */
const alturaPara = (w) => (w <= 430 ? 844 : 900);

/** As duas páginas que entram nas pranchas e no varrimento de larguras. */
const PAGINAS_DA_PRANCHA = ['concelho', 'leitura'];

/**
 * QUE CÉLULAS FICAM EM PNG, E PORQUE NÃO SÃO TODAS.
 *
 * As MEDIDAS correm na grelha inteira da rubrica: cinco páginas × sete larguras
 * × três densidades × cinco combinações, 525 células, e não falta uma. As
 * CAPTURAS são outra coisa: 525 PNG de janela cheia dão perto de cento e
 * quarenta megabytes por nada, porque o que se julga com os olhos são as duas
 * larguras das pranchas e a densidade a que se lê.
 *
 * Ficam em PNG:
 *   · as cinco páginas a 390 e a 1280, que são as larguras das pranchas e da
 *     leitura cega da §8, a 1× e a 2×, e a 390 também a 3×, que é o telemóvel
 *     de hoje;
 *   · as duas páginas das pranchas nas outras cinco larguras a 2×, para o
 *     varrimento se ver.
 *
 * Não ficam: 1280 a 3×, que não é ecrã de ninguém, e as páginas fora das
 * pranchas nas larguras intermédias. As medidas dessas células estão todas no
 * JSON; o que falta é o retrato, e diz-se qual.
 */
function deveCapturar(pagina, largura, densidade) {
  if (largura === 390) return true;
  if (largura === 1280) return densidade <= 2;
  return densidade === 2 && PAGINAS_DA_PRANCHA.includes(pagina);
}

/* ------------------------------------------------------------------ *
 * O SERVIDOR
 * ------------------------------------------------------------------ */

const TIPO_MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv', '.avif': 'image/avif', '.webp': 'image/webp',
};

function servidor() {
  return http.createServer((req, res) => {
    let rel = decodeURIComponent((req.url || '/').split('?')[0]);
    let base = DIST;
    if (rel.startsWith('/tipos-estudo/')) {
      base = TIPOS;
      rel = rel.slice('/tipos-estudo'.length);
    }
    let f = path.join(base, rel);
    if (!f.startsWith(base)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) {
      const alt = f.endsWith('.html') ? f : f + '/index.html';
      if (fs.existsSync(alt)) f = alt;
      else { res.writeHead(404, { 'content-type': 'text/plain' }).end('404 ' + rel); return; }
    }
    res.writeHead(200, {
      'content-type': TIPO_MIME[path.extname(f)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    fs.createReadStream(f).pipe(res);
  });
}

/* ------------------------------------------------------------------ *
 * O QUE SE LÊ DENTRO DA PÁGINA
 * ------------------------------------------------------------------ */

/**
 * Corre no navegador. Devolve as medidas 1, 4 e 6 e as caixas dos dois recortes
 * que a análise de píxeis vai querer.
 *
 * A MEDIDA 4 É MEDIDA NO CAMINHO REAL DO SÍTIO, e não num `canvas`: cria-se um
 * `<span>` filho do próprio elemento que a folha compôs com `tabular-nums`,
 * herda-se tudo o que ele herda, e medem-se as larguras de «0» a «9» com um
 * `Range`. É o que o leitor vê, e não uma reconstrução do que devia ver.
 */
const DENTRO_DA_PAGINA = () => {
  const R = {};
  const raiz = getComputedStyle(document.documentElement);
  R.fichas = {
    prosa: raiz.getPropertyValue('--f-prosa').trim(),
    instr: raiz.getPropertyValue('--f-instr').trim(),
    versal: raiz.getPropertyValue('--f-versal').trim(),
    papel: raiz.getPropertyValue('--paper').trim(),
    tinta: raiz.getPropertyValue('--ink').trim(),
  };

  /**
   * O ELEMENTO DE PROSA, e prefere-se o que não tem entretítulo em negro.
   * Muitos parágrafos deste sítio abrem com uma frase em `<strong>`; medir a
   * espessura do traço fino numa mistura de dois pesos é medir os dois. Fica
   * o mais longo SEM filhos de peso diferente, e só se não houver nenhum é que
   * entra o mais longo de todos.
   */
  const paragrafos = [...document.querySelectorAll('p')]
    .filter((p) => p.textContent.trim().length > 120 && p.getClientRects().length);
  paragrafos.sort((a, b) => b.textContent.length - a.textContent.length);
  const limpos = paragrafos.filter((p) => !p.querySelector('strong,b,em,i,a'));
  const prosa = limpos[0] || paragrafos[0] || document.body;

  /**
   * O ELEMENTO DE ALGARISMOS, e é uma FIGURA e não uma tabela inteira.
   *
   * A primeira versão pedia o maior elemento com `tabular-nums`, e o que isso
   * devolvia numa página de leitura era a `<table>` toda. O recorte apanhava as
   * réguas entre as linhas, os sublinhados das fontes e os marcadores
   * cinzentos, e a medida 2 contava seis mil corridas de um píxel que eram
   * mobília. Vi a imagem e é isso que lá está.
   *
   * Pede-se agora o elemento MAIS FUNDO com `tabular-nums` cujo texto seja
   * sobretudo algarismos: uma célula, um valor, uma figura. Dentro do recorte
   * ficam algarismos e papel.
   */
  const soDigitos = (t) => {
    const limpo = (t || '').replace(/\s/g, '');
    if (limpo.length < 3) return 0;
    return (limpo.match(/[\d.,\u00a0\u202f\u2009%€]/g) || []).length / limpo.length;
  };
  const candidatosNum = [...document.querySelectorAll('*')].filter((e) => {
    const rects = e.getClientRects();
    if (!rects.length) return false;
    const cs = getComputedStyle(e);
    if (!/tabular-nums/.test(cs.fontVariantNumeric)) return false;
    if (!/\d/.test(e.textContent || '')) return false;
    /* UMA LINHA DE ALTURA, e é este o filtro que exclui a tabela inteira sem
       excluir uma célula que tenha um `<span>` lá dentro. Um bloco com mais de
       duas linhas e meia traz réguas e sublinhados com ele. */
    if (e.getBoundingClientRect().height > parseFloat(cs.fontSize) * 2.5) return false;
    if (e.querySelector('a,hr,img,svg')) return false;
    return soDigitos(e.textContent) > 0.8;
  });
  /* Tira-se quem contém outro candidato: fica a figura, e não a caixa dela. */
  const folhasNum = candidatosNum.filter(
    (e) => !candidatosNum.some((o) => o !== e && e.contains(o)),
  );
  folhasNum.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);
  const numeros = folhasNum[0] || null;
  const numerosTodos = folhasNum.slice(0, 24);

  /**
   * Larguras de «0» a «9» dentro de um elemento, com um `Range`.
   *
   * `corpo` força o tamanho em píxeis. A rubrica pede a medida 4 A 15 PX, e a
   * tabela que a página compõe não está a 15 px: está ao tamanho que a folha
   * lhe deu, que na linha do livro-razão é 13,5. Mede-se as duas coisas, e cada
   * uma diz o que é: a herdada é o que o leitor vê, a de 15 px é a da rubrica.
   * A variância cresce com o quadrado do corpo, e comparar 13,5 com 15 entre
   * famílias seria comparar tamanhos e chamar-lhe desenho.
   */
  const larguraDosDigitos = (hospedeiro, forcarNormal, corpo) => {
    if (!hospedeiro) return null;
    const s = document.createElement('span');
    s.style.whiteSpace = 'pre';
    if (corpo) s.style.fontSize = corpo + 'px';
    if (forcarNormal) s.style.fontVariantNumeric = 'normal';
    hospedeiro.appendChild(s);
    const larguras = [];
    for (const d of '0123456789') {
      s.textContent = d;
      const r = document.createRange();
      r.selectNodeContents(s);
      larguras.push(+r.getBoundingClientRect().width.toFixed(4));
    }
    const cs = getComputedStyle(s);
    const ficha = { fonte: cs.font, tamanho: cs.fontSize, variante: cs.fontVariantNumeric };
    s.remove();
    const media = larguras.reduce((a, b) => a + b, 0) / larguras.length;
    const variancia = larguras.reduce((a, b) => a + (b - media) ** 2, 0) / larguras.length;
    return { larguras, media: +media.toFixed(4), variancia: +variancia.toFixed(6), ficha };
  };

  /* MEDIDA 1 · a altura de x, do tipo carregado, a 17 px e a 15 px. */
  const alturaDeX = (familia, corpo) => {
    const c = document.createElement('canvas').getContext('2d');
    c.font = `${corpo}px ${familia}`;
    const m = c.measureText('x');
    const mx = c.measureText('X');
    return {
      x: +(m.actualBoundingBoxAscent + Math.min(0, m.actualBoundingBoxDescent)).toFixed(4),
      X: +mx.actualBoundingBoxAscent.toFixed(4),
      largura_x: +m.width.toFixed(4),
      fonte_pedida: c.font,
    };
  };

  R.medida1 = {
    prosa_17: alturaDeX(R.fichas.prosa, 17),
    prosa_15: alturaDeX(R.fichas.prosa, 15),
    instr_15: alturaDeX(R.fichas.instr, 15),
    instr_17: alturaDeX(R.fichas.instr, 17),
  };

  /* MEDIDA 4 · os tabulares no caminho real, com o vermelho ao lado. */
  R.medida4 = numeros ? {
    seletor: numeros.tagName.toLowerCase() + (numeros.className ? '.' + String(numeros.className).split(/\s+/)[0] : ''),
    com_tabulares: larguraDosDigitos(numeros, false),
    vermelho_sem_tabulares: larguraDosDigitos(numeros, true),
    com_tabulares_15px: larguraDosDigitos(numeros, false, 15),
    vermelho_sem_tabulares_15px: larguraDosDigitos(numeros, true, 15),
  } : null;

  /* MEDIDA 6 · linhas por ecrã e o que cabe nelas. */
  const caixasDeLinha = (el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const rects = [...r.getClientRects()].filter((x) => x.height > 0 && x.width > 0);
    const linhas = [];
    for (const x of rects) {
      const j = linhas.find((l) => Math.abs(l.top - x.top) < 1.5);
      if (j) { j.largura += x.width; } else linhas.push({ top: x.top, largura: x.width });
    }
    return linhas;
  };
  const colunas = [...document.querySelectorAll('p')]
    .filter((p) => p.textContent.trim().length > 120 && p.getClientRects().length);
  let linhasNoEcra = 0, caracteresNoEcra = 0;
  const alto = window.innerHeight;
  for (const p of colunas) {
    const cs = getComputedStyle(p);
    const lh = parseFloat(cs.lineHeight);
    const linhas = caixasDeLinha(p);
    const texto = p.textContent.replace(/\s+/g, ' ').trim();
    const porLinha = linhas.length ? texto.length / linhas.length : 0;
    for (const l of linhas) {
      if (l.top >= 0 && l.top + lh <= alto) { linhasNoEcra++; caracteresNoEcra += porLinha; }
    }
  }
  const p0 = colunas[0];
  R.medida6 = p0 ? {
    janela: { largura: window.innerWidth, altura: window.innerHeight },
    corpo: getComputedStyle(p0).fontSize,
    entrelinha: getComputedStyle(p0).lineHeight,
    linhas_no_ecra: linhasNoEcra,
    caracteres_no_ecra: Math.round(caracteresNoEcra),
    caracteres_por_linha: +(caixasDeLinha(p0).length
      ? p0.textContent.replace(/\s+/g, ' ').trim().length / caixasDeLinha(p0).length
      : 0).toFixed(2),
    paragrafos_medidos: colunas.length,
  } : null;

  /**
   * AS CAIXAS DOS RECORTES DE PÍXEIS, E PORQUE SÃO LINHAS E NÃO BLOCOS.
   *
   * A medida 2 pergunta pelo traço mais fino DA LETRA. Recortar o bloco inteiro
   * trazia com ele a mobília: o sítio desenha fios e molduras a `--g3`, que é um
   * cinzento a 1,28:1 sobre o papel, e um fio desses é, para um detetor de
   * tinta, um traço pálido de dois píxeis. A régua dizia «desaparece» e o que
   * tinha visto era uma grelha, não uma haste.
   *
   * Recorta-se por isso a CAIXA DE UMA LINHA DE TEXTO, tirada de um `Range`
   * sobre o próprio nó de texto: dentro dela há glifos e papel, e mais nada. E
   * rola-se o elemento para o meio do ecrã antes de medir, porque numa página de
   * leitura o primeiro parágrafo grande está quase sempre abaixo da dobra e uma
   * caixa fora da janela recorta zero píxeis.
   */
  const caixaDeLinhas = (el, quantas) => {
    if (!el) return null;
    const r = document.createRange();
    r.selectNodeContents(el);
    const rects = [...r.getClientRects()]
      .filter((x) => x.height > 2 && x.width > 20)
      .sort((a, b) => a.top - b.top);
    if (!rects.length) return null;
    const dentro = rects.filter((x) => x.top >= 0 && x.bottom <= window.innerHeight);
    const usar = (dentro.length ? dentro : rects).slice(0, quantas);
    if (!usar.length) return null;
    const x = Math.max(0, Math.floor(Math.min(...usar.map((u) => u.left))));
    const y = Math.max(0, Math.floor(Math.min(...usar.map((u) => u.top))));
    const x1 = Math.min(window.innerWidth, Math.ceil(Math.max(...usar.map((u) => u.right))));
    const y1 = Math.min(window.innerHeight, Math.ceil(Math.max(...usar.map((u) => u.bottom))));
    if (x1 - x < 8 || y1 - y < 6) return null;
    return { x, y, width: x1 - x, height: y1 - y };
  };
  if (prosa && prosa.scrollIntoView) prosa.scrollIntoView({ block: 'center' });
  R.recortes = { prosa: caixaDeLinhas(prosa, 3), numeros: null };
  if (numeros) {
    numeros.scrollIntoView({ block: 'center' });
    R.recortes.numeros = caixaDeLinhas(numeros, 3);
    R.recortes.prosa = caixaDeLinhas(prosa, 3);
  }
  window.__alvos = { prosa, numeros };
  window.__numerosTodos = numerosTodos;
  R.tipos_carregados = [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.style} ${f.status}`);
  return R;
};

/* ------------------------------------------------------------------ *
 * OS PÍXEIS DA CAPTURA, LIDOS DE VOLTA
 * ------------------------------------------------------------------ */

/** Abre um PNG num navegador e devolve os píxeis RGBA. */
async function pixeisDoPng(pagina, buffer) {
  const b64 = buffer.toString('base64');
  return pagina.evaluate(async (b) => {
    const bin = atob(b);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    const bmp = await createImageBitmap(new Blob([u8], { type: 'image/png' }));
    const c = new OffscreenCanvas(bmp.width, bmp.height);
    const ctx = c.getContext('2d');
    ctx.drawImage(bmp, 0, 0);
    const d = ctx.getImageData(0, 0, bmp.width, bmp.height);
    return { largura: bmp.width, altura: bmp.height, dados: Array.from(d.data) };
  }, b64);
}

/** Converte uma cor CSS em luminância 0..255, no próprio navegador. */
async function luminancia(pagina, cor) {
  return pagina.evaluate((c) => {
    const el = document.createElement('div');
    el.style.color = c; document.body.appendChild(el);
    const m = getComputedStyle(el).color.match(/[\d.]+/g).map(Number);
    el.remove();
    return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2];
  }, cor);
}

/* ------------------------------------------------------------------ *
 * MEDIDA 3 · o «e», o «a» e o «s», isolados
 * ------------------------------------------------------------------ */

const ESPECIME_LETRAS = `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;background:%PAPEL%}
  .g{display:inline-block;background:%PAPEL%;color:%TINTA%;padding:14px;
     font-size:17px;line-height:1;font-family:%FAMILIA%}
</style>%FACES%
<div><span class="g" id="e">e</span></div>
<div><span class="g" id="a">a</span></div>
<div><span class="g" id="s">s</span></div>
<div><span class="g" id="o">o</span></div>`;

/**
 * A medida 3, para uma família. As letras são compostas a 17 px, que é o corpo
 * que a rubrica manda, e capturadas a 1×, que é a densidade que a rubrica manda.
 *
 * E OUTRA VEZ A 3×, COM O MESMO CORPO DE 17 PX, e não a 51 px. A diferença não é
 * de forma: as três serifas candidatas têm eixo `opsz`, e a 51 px o navegador
 * pede-lhes o desenho de titulação, que é outra letra, com outras aberturas.
 * Dividir esse número por três dava a abertura de uma letra que ninguém vai ler
 * a 17 px. Subir a densidade mantém `opsz` em 17 e triplica só os píxeis, que é
 * exatamente o que um telemóvel faz.
 *
 * O número da rubrica é o de 1×. A 17 px e 1× uma abertura mede um ou dois
 * píxeis e a régua não distingue famílias: o valor de 3× dividido por três é que
 * separa, e vai ao lado dito como o que é.
 */
async function medida3(navegador, familiaCss, faces, escala, porto) {
  const fora = {};
  for (const dsf of [1, 3]) {
    const ctx = await navegador.newContext({
      deviceScaleFactor: dsf, viewport: { width: 400, height: 700 },
    });
    const p = await ctx.newPage();
    const html = ESPECIME_LETRAS
      .replaceAll('%PAPEL%', '#f6f7f4').replaceAll('%TINTA%', '#17191b')
      .replace('%FAMILIA%', familiaCss).replace('%FACES%', faces ? `<style>${faces}</style>` : '');
    await p.goto(`http://127.0.0.1:${porto}/`);
    await p.setContent(html, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    for (const id of ['e', 'a', 's', 'o']) {
      const buf = await p.locator('#' + id).screenshot();
      const img = await pixeisDoPng(p, buf);
      fora[`${id}_${dsf}x`] = abertura(img, escala);
    }
    await ctx.close();
  }
  const em = (id, dsf) => fora[`${id}_${dsf}x`].abertura_px;
  const div3 = (v) => (v === null ? null : +(v / 3).toFixed(2));
  return {
    a_17px_1x: { e: em('e', 1), a: em('a', 1), s: em('s', 1), o: em('o', 1) },
    a_17px_3x_em_px_de_css: {
      e: div3(em('e', 3)), a: div3(em('a', 3)), s: div3(em('s', 3)), o: div3(em('o', 3)),
    },
    cru: fora,
  };
}

/* ------------------------------------------------------------------ *
 * A CORRIDA
 * ------------------------------------------------------------------ */

/**
 * A prova da medida 4, com o vermelho e o verde no mesmo tipo. Um tipo com
 * `tnum` medido COM `tabular-nums` tem de dar variância zero; o MESMO tipo
 * medido com `font-variant-numeric: normal` tem de dar variância acima de zero
 * quando os seus algarismos por defeito são proporcionais. Se os dois derem o
 * mesmo, a régua não está a medir a feature, e diz-se.
 */
function provaDosTabulares(celulas) {
  const comNumeros = celulas.filter((c) => c.medida4 && c.medida4.com_tabulares);
  if (!comNumeros.length) {
    return { veredicto: 'NENHUMA CÉLULA TROUXE ALGARISMOS: a medida 4 não mediu nada.', ok: false };
  }
  const zeroComTab = comNumeros.filter((c) => c.medida4.com_tabulares.variancia === 0).length;
  const mudaSemTab = comNumeros.filter(
    (c) => c.medida4.vermelho_sem_tabulares
      && c.medida4.vermelho_sem_tabulares.variancia > c.medida4.com_tabulares.variancia + 1e-9,
  ).length;
  return {
    celulas_com_algarismos: comNumeros.length,
    celulas_com_variancia_zero_com_tabulares: zeroComTab,
    celulas_em_que_tirar_os_tabulares_piora: mudaSemTab,
    veredicto: mudaSemTab > 0
      ? 'a régua distingue com e sem tabulares no mesmo tipo (o vermelho foi visto)'
      : 'tirar os tabulares NÃO mudou nada: ou o tipo já tem algarismos de largura fixa por defeito, e diz-se, ou a régua não está a medir a feature',
    ok: true,
  };
}

async function principal() {
  const combinacao = process.argv[2] || 'spectral+bitter';
  const soMedidas = process.argv.includes('--sem-capturas');
  /* Duas rédeas para a corrida de ensaio, e não para o estudo: `SO_PAGINAS` e
     `SO_DENSIDADES` cortam a grelha para se ver depressa se a régua parte.
     O estudo corre sem elas, com a grelha inteira da rubrica. */
  const paginas = process.env.SO_PAGINAS
    ? PAGINAS.filter((p) => process.env.SO_PAGINAS.split(',').includes(p.nome))
    : PAGINAS;
  const densidades = process.env.SO_DENSIDADES
    ? process.env.SO_DENSIDADES.split(',').map(Number)
    : DENSIDADES;
  const larguras = process.env.SO_LARGURAS
    ? process.env.SO_LARGURAS.split(',').map(Number)
    : LARGURAS;
  const srv = servidor();
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const porto = srv.address().port;
  console.log(`servidor em 127.0.0.1:${porto}, dist=${DIST}`);

  const navegador = await chromium.launch();
  const celulas = [];
  const destino = path.join(CAPTURAS, combinacao);
  fs.mkdirSync(destino, { recursive: true });

  let escala = null;
  let fichas = null;
  const recortesDePixeis = [];

  for (const dsf of densidades) {
    const ctx = await navegador.newContext({
      deviceScaleFactor: dsf,
      viewport: { width: larguras[0], height: alturaPara(larguras[0]) },
      reducedMotion: 'reduce',
    });
    const pagina = await ctx.newPage();
    for (const pag of paginas) {
      await pagina.goto(`http://127.0.0.1:${porto}${pag.rota}`, { waitUntil: 'load' });
      for (const w of larguras) {
        await pagina.setViewportSize({ width: w, height: alturaPara(w) });
        await pagina.evaluate(() => document.fonts.ready);
        await pagina.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        const lido = await pagina.evaluate(DENTRO_DA_PAGINA);
        if (!escala) {
          escala = {
            papel: await luminancia(pagina, lido.fichas.papel),
            tinta: await luminancia(pagina, lido.fichas.tinta),
          };
          fichas = lido.fichas;
        }
        const nome = `${pag.nome}-${w}-${dsf}x.png`;
        const capturar = !soMedidas && deveCapturar(pag.nome, w, dsf);
        if (capturar) {
          await pagina.screenshot({ path: path.join(destino, nome), animations: 'disabled' });
        }
        celulas.push({
          combinacao, pagina: pag.nome, rota: pag.rota, largura: w, densidade: dsf,
          captura: capturar ? `capturas/${combinacao}/${nome}` : null,
          medida1: lido.medida1, medida4: lido.medida4, medida6: lido.medida6,
          fichas: lido.fichas,
        });

        /* MEDIDA 2 · só a 1×, que é o que a rubrica pede, e nas larguras
           que as pranchas usam. */
        if (dsf === 1 && (w === 390 || w === 1280)) {
          for (const qual of ['prosa', 'numeros']) {
            /* Rola-se outra vez para o alvo desta volta: as duas caixas vieram
               da mesma leitura, mas cada uma foi medida com o seu elemento no
               meio do ecrã, e é preciso repor essa posição para o recorte cair
               onde a caixa diz. */
            const cx = await pagina.evaluate((q) => {
              const el = window.__alvos && window.__alvos[q];
              if (!el) return null;
              el.scrollIntoView({ block: 'center' });
              const r = document.createRange();
              r.selectNodeContents(el);
              const rects = [...r.getClientRects()]
                .filter((x) => x.height > 2 && x.width > 20)
                .sort((a, b) => a.top - b.top)
                .filter((x) => x.top >= 0 && x.bottom <= window.innerHeight)
                .slice(0, 3);
              if (!rects.length) return null;
              const x = Math.max(0, Math.floor(Math.min(...rects.map((u) => u.left))));
              const y = Math.max(0, Math.floor(Math.min(...rects.map((u) => u.top))));
              const x1 = Math.min(window.innerWidth, Math.ceil(Math.max(...rects.map((u) => u.right))));
              const y1 = Math.min(window.innerHeight, Math.ceil(Math.max(...rects.map((u) => u.bottom))));
              if (x1 - x < 8 || y1 - y < 6) return null;
              return { x, y, width: x1 - x, height: y1 - y };
            }, qual);
            if (!cx) continue;
            if (qual === 'numeros') {
              /* Todas as figuras da página, uma a uma, no mesmo saco. */
              const caixas = await pagina.evaluate(() => {
                const fora = [];
                for (const el of (window.__numerosTodos || [])) {
                  el.scrollIntoView({ block: 'center' });
                  const r = el.getBoundingClientRect();
                  const x = Math.max(0, Math.floor(r.left)), y = Math.max(0, Math.floor(r.top));
                  const x1 = Math.min(window.innerWidth, Math.ceil(r.right));
                  const y1 = Math.min(window.innerHeight, Math.ceil(r.bottom));
                  if (x1 - x >= 8 && y1 - y >= 6) fora.push({ x, y, width: x1 - x, height: y1 - y });
                }
                return fora;
              });
              const imgs = [];
              let primeiro = null;
              for (const c of caixas.slice(0, 12)) {
                await pagina.evaluate((i) => {
                  const el = (window.__numerosTodos || [])[i];
                  if (el) el.scrollIntoView({ block: 'center' });
                }, caixas.indexOf(c));
                const r2 = await pagina.evaluate((i) => {
                  const el = (window.__numerosTodos || [])[i];
                  if (!el) return null;
                  const r = el.getBoundingClientRect();
                  const x = Math.max(0, Math.floor(r.left)), y = Math.max(0, Math.floor(r.top));
                  const x1 = Math.min(window.innerWidth, Math.ceil(r.right));
                  const y1 = Math.min(window.innerHeight, Math.ceil(r.bottom));
                  if (x1 - x < 8 || y1 - y < 6) return null;
                  return { x, y, width: x1 - x, height: y1 - y };
                }, caixas.indexOf(c));
                if (!r2) continue;
                const b = await pagina.screenshot({ clip: r2, animations: 'disabled' });
                if (!primeiro) {
                  primeiro = b;
                  fs.writeFileSync(
                    path.join(destino, `recorte-${pag.nome}-${w}-numeros.png`), b);
                }
                imgs.push(await pixeisDoPng(pagina, b));
              }
              if (!imgs.length) continue;
              recortesDePixeis.push({
                combinacao, pagina: pag.nome, largura: w, alvo: qual,
                recorte: `capturas/${combinacao}/recorte-${pag.nome}-${w}-numeros.png`,
                caixa: caixas[0],
                ...traçoMaisFino(imgs, escala),
              });
              continue;
            }
            const buf = await pagina.screenshot({ clip: cx, animations: 'disabled' });
            /* O recorte fica no disco ao lado do número que dele saiu. Uma
               medida de píxeis sem os píxeis é uma afirmação: quem quiser
               conferir a medida 2 abre esta imagem e conta. */
            const nomeRecorte = `recorte-${pag.nome}-${w}-${qual}.png`;
            fs.writeFileSync(path.join(destino, nomeRecorte), buf);
            const img = await pixeisDoPng(pagina, buf);
            recortesDePixeis.push({
              combinacao, pagina: pag.nome, largura: w, alvo: qual,
              recorte: `capturas/${combinacao}/${nomeRecorte}`,
              caixa: cx,
              ...traçoMaisFino(img, escala),
            });
          }
        }
      }
    }
    await ctx.close();
    console.log(`  densidade ${dsf}× feita`);
  }

  /* MEDIDA 3 · as letras isoladas, na família de prosa desta combinação. */
  const paginaAux = await (await navegador.newContext()).newPage();
  await paginaAux.goto(`http://127.0.0.1:${porto}/`);
  const facesDaFolha = await paginaAux.evaluate(async () => {
    const fora = [];
    for (const f of document.fonts) fora.push(f.family);
    const folhas = [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n');
    return { familias: [...new Set(fora)], folhaInline: folhas };
  });
  await paginaAux.context().close();

  const facesCss = await (async () => {
    /* As `@font-face` que a página de facto usa, tiradas do CSS servido, para
       que o espécime das letras carregue exatamente os mesmos ficheiros. */
    const css = [];
    const dir = path.join(DIST, '_astro');
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.css'))) {
        const t = fs.readFileSync(path.join(dir, f), 'utf8');
        for (const m of t.matchAll(/@font-face\s*\{[^}]*\}/g)) css.push(m[0]);
      }
    }
    const inline = facesDaFolha.folhaInline || '';
    for (const m of inline.matchAll(/@font-face\s*\{[^}]*\}/g)) css.push(m[0]);
    return css.join('\n').replaceAll("url(/tipos", `url(http://127.0.0.1:${porto}/tipos`);
  })();

  const m3 = await medida3(navegador, fichas.prosa, facesCss, escala, porto);
  const m3instr = await medida3(navegador, fichas.instr, facesCss, escala, porto);

  await navegador.close();
  srv.close();

  const prova = provaDosTabulares(celulas);
  const fora = {
    combinacao,
    quando: new Date().toISOString(),
    fichas,
    escala_de_tinta: escala,
    prova_do_detetor_dos_tabulares: prova,
    medida3_prosa: m3,
    medida3_instrumento: m3instr,
    medida2: recortesDePixeis,
    celulas,
  };
  const ficheiro = path.join(RAIZ, 'design', 'tipografia', 'medidas', `${combinacao}.json`);
  fs.mkdirSync(path.dirname(ficheiro), { recursive: true });
  fs.writeFileSync(ficheiro, JSON.stringify(fora, null, 2) + '\n');
  console.log(`\n${combinacao}: ${celulas.length} células, ${recortesDePixeis.length} recortes de píxeis`);
  console.log(`  medida 4 · ${prova.veredicto}`);
  console.log(`  escrito ${path.relative(RAIZ, ficheiro)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  principal().catch((e) => { console.error(e); process.exit(1); });
}
