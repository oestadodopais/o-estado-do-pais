/**
 * A RÉGUA DO ESTUDO TIPOGRÁFICO: as medidas 1 a 6 nas páginas reais do sítio.
 *
 * SEGUNDA RONDA (ADENDA-2-segunda-ronda.md). Este ficheiro é o da primeira
 * ronda corrigido, e não um ficheiro novo. O que mudou, e porquê:
 *
 *   · a medida 2 corre a 1× nas SETE larguras da rubrica, e não só a 390 e a
 *     1280. A leitura cruzada apontou que a rubrica pede as sete e que a
 *     primeira ronda só entregou duas;
 *   · a medida 1 é lida no navegador com o detetor de `provas.mjs`, que se
 *     recusa a dar um número quando o tipo pedido não pesou na composição. A
 *     tabela da primeira ronda trazia `sxHeight / unitsPerEm` do ficheiro, que
 *     é outra coisa: num tipo com eixo ótico a razão do ecrã muda com o corpo;
 *   · a medida 4 mede também a 13,5 px, além dos 15 px da rubrica e do corpo
 *     que a página herda;
 *   · a medida 6 mede também o lugar do INSTRUMENTO, na ficha do aparelho da
 *     linha do livro-razão, que é a tabela que essa página compõe em `--f-instr`;
 *   · o motor e a versão ficam escritos no ficheiro de medidas, e o carimbo de
 *     relógio sai: regenerar tem de dar o mesmo ficheiro.
 *
 * Os resultados da segunda ronda vão para `medidas-2/` e `capturas-2/`. Os da
 * primeira ficam onde estão, intactos: foram o que a leitura cruzada leu, e
 * apagá-los era apagar a prova de que a segunda ronda foi precisa.
 *
 * Corre-se com a construção de uma combinação já feita em `dist/`:
 *
 *   TIPOS_ESTUDO=literata+bitter npx astro build
 *   node design/tipografia/programa/regua.mjs literata+bitter
 *
 * O que faz, por esta ordem:
 *
 *   0. corre TODAS as provas dos detetores (`provas.mjs`) e pára se alguma
 *      falhar: nenhum número sai daqui sem que o detetor que o deu tenha visto
 *      o seu vermelho;
 *   1. levanta um servidor estático sobre `dist/`, com `/tipos-estudo/` mapeado
 *      para `design/tipografia/tipos/`. É assim que as candidatas chegam ao
 *      navegador sem um único byte entrar em `public/tipos`;
 *   2. abre três contextos do Chromium, um por densidade (1×, 2×, 3×), e em cada
 *      um percorre as cinco páginas e as sete larguras, redimensionando a
 *      janela: a página é a mesma, o que muda é o ecrã, que é o que a rubrica
 *      pede;
 *   3. em cada célula tira a captura e lê as medidas 1, 4 e 6;
 *   4. a 1×, em cada uma das sete larguras, recorta o corpo da prosa e os blocos
 *      de algarismos, volta a abrir os PNG no navegador e passa os píxeis pelo
 *      `pixeis.mjs` (medida 2).
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { traçoMaisFino, abertura } from './pixeis.mjs';
import {
  exigeAsProvas, DETETOR_ALTURA_X, DETETOR_DIGITOS, DETETOR_LINHAS, DETETOR_TABELA,
} from './provas.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const DIST = path.join(RAIZ, 'dist');
const TIPOS = path.join(RAIZ, 'design', 'tipografia', 'tipos');
const CAPTURAS = path.join(RAIZ, 'design', 'tipografia', 'capturas-2');

/**
 * A TABELA DO INSTRUMENTO, e é uma medida e não uma escolha de gosto.
 *
 * A adenda pede a medida 6 «para o instrumento (uma tabela de linha do
 * livro-razão)». A página `/livro-razao/…` não tem `<table>` nenhuma: o que
 * tem é a ficha do aparelho, `dl.aparelho-ficha`, sete pares de rótulo e valor
 * em que o rótulo é `--f-versal` e o VALOR é `--f-instr`. É a única tabela
 * dessa página cuja altura muda quando o instrumento muda, e por isso é a que
 * responde à pergunta.
 */
const TABELA_DO_INSTRUMENTO = '.aparelho-ficha';

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
const DENTRO_DA_PAGINA = (D) => {
  /* OS DETETORES SÃO OS QUE LEVARAM O VERMELHO. Chegam aqui em texto, vindos de
     `provas.mjs`, e não copiados: se o texto mudasse dum lado e não do outro, o
     que corre nas páginas deixava de ser o que a prova aprovou. */
  const alturaDeX = eval(D.alturaX);
  const larguraDosDigitos = eval(D.digitos);
  const contaLinhas = eval(D.linhas);
  const leTabela = eval(D.tabela);
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
   * A POSIÇÃO EM QUE SE MEDE, E PORQUE TEM DE SER DEFINIDA.
   *
   * A régua percorre as sete larguras sem voltar a navegar, e a leitura de cada
   * largura acabava por rolar a página para o alvo que mediu. A largura
   * seguinte era portanto medida ONDE A ANTERIOR A TINHA DEIXADO, e a medida 6
   * («linhas por ecrã») contava as linhas visíveis numa posição herdada. Duas
   * corridas do mesmo programa podiam dar contagens diferentes, e deram: numa
   * prova de regeneração, a primeira página a 1280 leu 11 linhas numa corrida e
   * 13 noutra.
   *
   * Agora cada célula começa por pôr o parágrafo de prosa no meio do ecrã, e é
   * aí que tudo se mede. É uma posição definida e é a certa para a pergunta: a
   * densidade de leitura é quantas linhas de texto corrido cabem num ecrã onde
   * se está a ler, e não quantas cabem por cima de um título.
   */
  if (prosa && prosa.scrollIntoView) prosa.scrollIntoView({ block: 'center' });

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
   * MEDIDA 1 · a altura de x, LIDA NO NAVEGADOR, a 17 px, a 15 px e a 13,5 px.
   *
   * O detetor vem de `provas.mjs` e traz a guarda que lá levou o vermelho: se o
   * primeiro nome da pilha não pesou na composição, a célula fica a `null` em
   * vez de trazer a altura de x da Georgia com o nome de outra letra.
   *
   * Os três corpos, e a razão de serem três: 17 px é o da prosa na rubrica, 15
   * px é o das tabelas na rubrica, e 13,5 px é o corpo que a adenda fixa para os
   * algarismos. Num tipo com eixo ótico os três dão razões x/em diferentes, que
   * é exatamente por isto que a rubrica manda ler no navegador.
   */
  R.medida1 = {
    prosa_17: alturaDeX(R.fichas.prosa, 17),
    prosa_15: alturaDeX(R.fichas.prosa, 15),
    prosa_13_5: alturaDeX(R.fichas.prosa, 13.5),
    instr_17: alturaDeX(R.fichas.instr, 17),
    instr_15: alturaDeX(R.fichas.instr, 15),
    instr_13_5: alturaDeX(R.fichas.instr, 13.5),
  };

  /**
   * MEDIDA 4 · os tabulares no caminho real, com o vermelho ao lado.
   *
   * `corpo` força o tamanho em píxeis. A rubrica pede a medida 4 A 15 PX, e a
   * página não compõe a 15 px: compõe ao tamanho que a folha lhe deu. Medem-se
   * três coisas, e cada uma diz o que é: a herdada é o que o leitor vê, a de 15
   * px é a da rubrica, a de 13,5 px é a que a adenda fixa. A variância cresce
   * com o quadrado do corpo, e comparar 13,5 com 15 entre famílias seria
   * comparar tamanhos e chamar-lhe desenho.
   */
  R.medida4 = numeros ? {
    seletor: numeros.tagName.toLowerCase() + (numeros.className ? '.' + String(numeros.className).split(/\s+/)[0] : ''),
    com_tabulares: larguraDosDigitos(numeros, false),
    vermelho_sem_tabulares: larguraDosDigitos(numeros, true),
    com_tabulares_15px: larguraDosDigitos(numeros, false, 15),
    vermelho_sem_tabulares_15px: larguraDosDigitos(numeros, true, 15),
    com_tabulares_13_5px: larguraDosDigitos(numeros, false, 13.5),
    vermelho_sem_tabulares_13_5px: larguraDosDigitos(numeros, true, 13.5),
  } : null;

  /* MEDIDA 6 · a densidade de leitura da PROSA: linhas por ecrã e o que cabe
     nelas, com o contador que levou o vermelho de um parágrafo maior do que a
     janela. */
  const conta = contaLinhas('p');
  const p0 = [...document.querySelectorAll('p')]
    .filter((p) => p.textContent.trim().length > 120 && p.getClientRects().length)[0];
  R.medida6 = p0 ? {
    janela: { largura: window.innerWidth, altura: window.innerHeight },
    corpo: getComputedStyle(p0).fontSize,
    entrelinha: getComputedStyle(p0).lineHeight,
    linhas_no_ecra: conta.linhas_no_ecra,
    linhas_totais: conta.linhas_totais,
    caracteres_no_ecra: conta.caracteres_no_ecra,
    caracteres_por_linha: conta.linhas_no_ecra
      ? +(conta.caracteres_no_ecra / conta.linhas_no_ecra).toFixed(2) : null,
    paragrafos_medidos: conta.paragrafos,
  } : null;

  /**
   * MEDIDA 6 · a densidade do INSTRUMENTO, na tabela da linha do livro-razão.
   *
   * Só a página da linha tem esta tabela, e nas outras a célula fica a `null`
   * com a razão escrita. Não se substitui por outra: uma medida que só existe
   * numa página mede-se nessa página ou não se mede.
   */
  const t = leTabela(D.tabelaDoInstrumento, window.innerHeight);
  R.medida6_instrumento = t ? {
    seletor: D.tabelaDoInstrumento,
    janela: { largura: window.innerWidth, altura: window.innerHeight },
    ...t,
  } : { seletor: D.tabelaDoInstrumento, razao: 'esta página não compõe a ficha do aparelho' };

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
  /* A PORTA. Todos os detetores desta ronda veem o seu vermelho antes de a
     régua escrever um número, e não só os das medidas 2 e 3 como na primeira
     ronda. Se algum falhar, isto atira e nada é medido. */
  await exigeAsProvas(navegador);
  const versaoDoMotor = navegador.version();
  console.log(`\nmotor das medidas: Chromium ${versaoDoMotor}\n`);
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
        const lido = await pagina.evaluate(DENTRO_DA_PAGINA, {
          alturaX: DETETOR_ALTURA_X, digitos: DETETOR_DIGITOS,
          linhas: DETETOR_LINHAS, tabela: DETETOR_TABELA,
          tabelaDoInstrumento: TABELA_DO_INSTRUMENTO,
        });
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
          /**
           * A CAPTURA É DO TOPO DA PÁGINA, E NÃO DE ONDE A MEDIÇÃO A DEIXOU.
           *
           * A leitura de dentro da página rola os alvos para o meio do ecrã
           * antes de lhes medir a caixa, e a posição em que fica depende do
           * sítio onde a letra desta família calhou pôr esse alvo. Na primeira
           * ronda o retrato era tirado nessa posição, e o resultado é que cada
           * coluna da prancha mostrava um pedaço diferente da mesma página: uma
           * comparação em que o que muda não é só a letra não é uma comparação.
           * Repõe-se o topo, espera-se um par de quadros, e só então se retrata.
           */
          await pagina.evaluate(() => { window.scrollTo(0, 0); });
          await pagina.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          await pagina.screenshot({ path: path.join(destino, nome), animations: 'disabled' });
        }
        celulas.push({
          combinacao, pagina: pag.nome, rota: pag.rota, largura: w, densidade: dsf,
          captura: capturar ? `capturas-2/${combinacao}/${nome}` : null,
          medida1: lido.medida1, medida4: lido.medida4, medida6: lido.medida6,
          medida6_instrumento: lido.medida6_instrumento,
          fichas: lido.fichas,
        });

        /* MEDIDA 2 · a 1×, que é a densidade que a rubrica pede, e nas SETE
           larguras dela. A primeira ronda corria só a 390 e a 1280, e a leitura
           cruzada apontou-o: a rubrica escreve sete larguras e sete são. */
        if (dsf === 1) {
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
                recorte: `capturas-2/${combinacao}/recorte-${pag.nome}-${w}-numeros.png`,
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
              recorte: `capturas-2/${combinacao}/${nomeRecorte}`,
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
    /* O MOTOR E A VERSÃO, ESCRITOS. A leitura cruzada apontou que a primeira
       ronda não os declarava: tudo o que aqui está é este Chromium, e uma
       decisão que dependa do caminho tem de o confirmar noutros motores.
       Não há carimbo de relógio neste ficheiro de propósito: regenerar com a
       mesma construção tem de dar o mesmo ficheiro, byte a byte. */
    motor: { nome: 'Chromium (Playwright)', versao: versaoDoMotor, plataforma: process.platform },
    ronda: 2,
    rubrica: 'design/tipografia/RUBRICA.md',
    adenda: 'design/tipografia/ADENDA-2-segunda-ronda.md',
    fichas,
    escala_de_tinta: escala,
    prova_do_detetor_dos_tabulares: prova,
    medida3_prosa: m3,
    medida3_instrumento: m3instr,
    medida2: recortesDePixeis,
    celulas,
  };
  const ficheiro = path.join(RAIZ, 'design', 'tipografia', 'medidas-2', `${combinacao}.json`);
  fs.mkdirSync(path.dirname(ficheiro), { recursive: true });
  fs.writeFileSync(ficheiro, JSON.stringify(fora, null, 2) + '\n');
  console.log(`\n${combinacao}: ${celulas.length} células, ${recortesDePixeis.length} recortes de píxeis`);
  console.log(`  medida 4 · ${prova.veredicto}`);
  console.log(`  escrito ${path.relative(RAIZ, ficheiro)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  principal().catch((e) => { console.error(e); process.exit(1); });
}
