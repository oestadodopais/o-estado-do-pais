/**
 * OS VERMELHOS PLANTADOS DE TODOS OS DETETORES, E A PORTA POR ONDE A SEGUNDA
 * RONDA PASSA ANTES DE MEDIR SEJA O QUE FOR.
 *
 * A regra do brief (§5 da `RUBRICA.md`) diz que um detetor que nunca viu um
 * vermelho não mediu nada. Na primeira ronda essa regra foi cumprida para as
 * medidas 2, 3 e 4, e não para as outras: a medida 1 saiu das unidades do tipo
 * e nunca foi confrontada com o caso de o tipo não ter carregado; a medida 6
 * contava linhas sem que alguma vez lhe tivessem plantado uma linha fora do
 * ecrã; a medida 7 somava bytes de uma lista de nomes sem que um nome errado
 * alguma vez a tivesse feito parar.
 *
 * Este ficheiro planta um vermelho a CADA detetor da segunda ronda e pára a
 * corrida se algum deles não o vir. É chamado pelo `regua.mjs` e pelo
 * `aberturas.mjs` antes da primeira medição, e pelo `agregar.mjs` antes da
 * primeira soma. Corre também sozinho:
 *
 *   node design/tipografia/programa/provas.mjs
 *
 * O QUE É UM VERMELHO, AQUI. Não é um teste de que o programa não parte: é um
 * caso em que a resposta certa é «isto está mal» e em que um detetor
 * complacente responderia «está bem». Um detetor que diga sempre verde é tão
 * inútil como um que não meça, e por isso quase todos os casos vêm em par: o
 * verde conhecido ao lado do vermelho conhecido, com o mesmo detetor.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { provas as provasDePixeis } from './pixeis.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const TIPOS = path.join(RAIZ, 'design', 'tipografia', 'tipos');

/** Um tipo do estudo como `data:` URI, para o espécime não precisar de servidor. */
function tipoEmDados(rel) {
  const f = path.join(TIPOS, rel);
  if (!fs.existsSync(f)) throw new Error(`a prova precisa de ${rel} e ele não está em tipos/`);
  return `data:font/woff2;base64,${fs.readFileSync(f).toString('base64')}`;
}

let falhas = 0;
function exige(condicao, mensagem) {
  if (!condicao) { console.error('  FALHOU: ' + mensagem); falhas++; return false; }
  console.log('  visto: ' + mensagem);
  return true;
}

/* ------------------------------------------------------------------ *
 * MEDIDA 1 · a altura de x, lida no navegador
 * ------------------------------------------------------------------ */

/**
 * O DETETOR, e é o mesmo texto que o `regua.mjs` corre dentro da página.
 *
 * `canvas.measureText` responde SEMPRE, e é esse o perigo: pedida uma família
 * que não carregou, devolve com toda a calma a altura de x do recuo. A primeira
 * ronda escapou-lhe porque nem sequer usou o navegador; a segunda usa-o, e por
 * isso precisa de saber quando é que o número é da letra pedida e quando é da
 * Georgia com outro nome.
 *
 * A guarda não é `document.fonts.check`, que responde verdadeiro a uma pilha em
 * que só o recuo existe: é medir DUAS vezes, uma com a pilha real e outra com a
 * mesma pilha com o primeiro nome trocado por um que não existe. Se as duas
 * medições derem o mesmo, o primeiro nome não pesou, e o número não é dele.
 */
export const DETETOR_ALTURA_X = `(familia, corpo) => {
  const c = document.createElement('canvas').getContext('2d');
  const medir = (pilha) => {
    c.font = corpo + 'px ' + pilha;
    const m = c.measureText('x');
    const mx = c.measureText('X');
    return {
      x: +(m.actualBoundingBoxAscent + Math.min(0, m.actualBoundingBoxDescent)).toFixed(4),
      X: +mx.actualBoundingBoxAscent.toFixed(4),
      largura_x: +m.width.toFixed(4),
      fonte_pedida: c.font,
    };
  };
  const real = medir(familia);
  /* A mesma pilha sem o primeiro nome: é o que o navegador teria composto se o
     ficheiro não tivesse chegado. */
  const recuo = medir(familia.split(',').slice(1).join(',') || 'serif');
  const igual = real.x === recuo.x && real.largura_x === recuo.largura_x;
  return {
    ...real,
    recuo_x: recuo.x,
    recuo_largura_x: recuo.largura_x,
    /* Sem esta linha o número podia ser da Georgia. Com ela, ou é da letra
       pedida, ou a célula diz que não é de ninguém. */
    carregou: !igual,
    x: igual ? null : real.x,
  };
}`;

async function provaDaMedida1(navegador) {
  console.log('MEDIDA 1 · a altura de x lida no navegador');
  const ctx = await navegador.newContext({ deviceScaleFactor: 1, viewport: { width: 400, height: 400 } });
  const p = await ctx.newPage();
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    @font-face{font-family:'Provada';src:url('${tipoEmDados('newsreader/Newsreader-latin.woff2')}') format('woff2');
      font-weight:200 800;font-style:normal;font-display:block}
    @font-face{font-family:'ProvadaFixa';src:url('${tipoEmDados('spectral/Spectral-Regular-latin.woff2')}') format('woff2');
      font-weight:400;font-style:normal;font-display:block}
  </style><p style="font-family:'Provada',Georgia,serif">x X 0123456789</p>
  <p style="font-family:'ProvadaFixa',Georgia,serif">x X 0123456789</p>`, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);

  const verde = await p.evaluate(
    ([det, fam, corpo]) => eval(det)(fam, corpo), [DETETOR_ALTURA_X, `'Provada',Georgia,serif`, 17]);
  exige(verde.carregou === true && verde.x !== null,
    `com o ficheiro carregado a régua dá um número (x=${verde.x} px a 17 px, recuo=${verde.recuo_x})`);
  exige(verde.x !== verde.recuo_x,
    `e esse número não é o do recuo (${verde.x} contra ${verde.recuo_x})`);

  /* VERMELHO PLANTADO: uma família que não existe, com o mesmo recuo. Um
     detetor sem guarda devolvia aqui a altura de x da Georgia e a tabela
     chamava-lhe Newsreader. */
  const vermelho = await p.evaluate(
    ([det, fam, corpo]) => eval(det)(fam, corpo), [DETETOR_ALTURA_X, `'NaoExisteEsteTipo',Georgia,serif`, 17]);
  exige(vermelho.carregou === false && vermelho.x === null,
    `uma família que não existe não dá número nenhum (carregou=${vermelho.carregou}, x=${vermelho.x})`);

  /* VERDE de escala: num tipo SEM eixo ótico, a mesma letra a 15 px tem de dar
     15/17 do valor de 17 px. Um detetor que devolvesse uma constante passava as
     duas provas de cima e falha esta. A Spectral serve porque não tem eixos
     (`fvar` vazio em `MEDIDAS-tipo.json`). */
  const fixa17 = await p.evaluate(
    ([det, fam]) => eval(det)(fam, 17), [DETETOR_ALTURA_X, `'ProvadaFixa',Georgia,serif`]);
  const fixa15 = await p.evaluate(
    ([det, fam]) => eval(det)(fam, 15), [DETETOR_ALTURA_X, `'ProvadaFixa',Georgia,serif`]);
  const razaoFixa = fixa15.x / fixa17.x;
  exige(Math.abs(razaoFixa - 15 / 17) < 0.02,
    `num tipo sem eixo ótico a altura de x escala com o corpo: ${fixa15.x} / ${fixa17.x} = `
    + `${razaoFixa.toFixed(3)}, contra ${(15 / 17).toFixed(3)}`);

  /* E O CASO QUE JUSTIFICA A CORREÇÃO DA ADENDA. A mesma conta num tipo COM
     eixo ótico não dá o mesmo: o navegador pede ao ficheiro o desenho de 15 e o
     desenho de 17, que são duas letras com alturas de x diferentes em relação ao
     em. É por isto que a medida 1 tem de ser lida no navegador ao corpo real, e
     não calculada de `sxHeight / unitsPerEm` como a primeira ronda a pôs na
     tabela: a razão do ficheiro é uma só e a do ecrã muda com o corpo. */
  const opt15 = await p.evaluate(
    ([det, fam]) => eval(det)(fam, 15), [DETETOR_ALTURA_X, `'Provada',Georgia,serif`]);
  const razaoOpt = opt15.x / verde.x;
  exige(Math.abs(razaoOpt - 15 / 17) > 0.02,
    `e num tipo COM eixo ótico não escala: ${opt15.x} / ${verde.x} = ${razaoOpt.toFixed(3)}, `
    + `contra ${(15 / 17).toFixed(3)} (x/em de ${(opt15.x / 15).toFixed(4)} a 15 px e `
    + `${(verde.x / 17).toFixed(4)} a 17 px)`);
  await ctx.close();
}

/* ------------------------------------------------------------------ *
 * MEDIDA 4 · os tabulares, no caminho real
 * ------------------------------------------------------------------ */

export const DETETOR_DIGITOS = `(hospedeiro, forcarNormal, corpo) => {
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
}`;

async function provaDaMedida4(navegador) {
  console.log('\nMEDIDA 4 · os algarismos tabulares no caminho real da página');
  const ctx = await navegador.newContext({ deviceScaleFactor: 1, viewport: { width: 400, height: 400 } });
  const p = await ctx.newPage();
  /* A Literata é a planta certa para este caso: os algarismos dela por defeito
     são proporcionais (variância 0,4344 a 15 px no ficheiro) e com `tnum`
     passam a ter todos a mesma largura. Um detetor que não visse a diferença
     estaria a ler outra coisa. */
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    @font-face{font-family:'Provada';src:url('${tipoEmDados('literata/Literata-latin.woff2')}') format('woff2');
      font-weight:200 900;font-style:normal;font-display:block}
    #alvo{font-family:'Provada',Georgia,serif;font-variant-numeric:tabular-nums lining-nums;font-size:15px}
  </style><div id="alvo">0123456789</div>`, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(([det]) => {
    const f = eval(det);
    const alvo = document.getElementById('alvo');
    return { com: f(alvo, false, 15), sem: f(alvo, true, 15) };
  }, [DETETOR_DIGITOS]);
  exige(r.com.variancia === 0,
    `com \`tabular-nums\` as dez larguras são iguais (variância ${r.com.variancia})`);
  exige(r.sem.variancia > 0,
    `e tirados os tabulares deixam de ser (variância ${r.sem.variancia}): o vermelho foi visto`);
  await ctx.close();
}

/* ------------------------------------------------------------------ *
 * MEDIDA 6 · a densidade, da prosa e do instrumento
 * ------------------------------------------------------------------ */

/**
 * O CONTADOR DE LINHAS DE PROSA. Conta as caixas de linha que cabem INTEIRAS na
 * janela, e não as que o parágrafo tem. É a mesma função que o `regua.mjs`
 * corre; está aqui em texto para a prova poder plantar-lhe o caso.
 */
export const DETETOR_LINHAS = `(seletor) => {
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
  const colunas = [...document.querySelectorAll(seletor)]
    .filter((p) => p.textContent.trim().length > 120 && p.getClientRects().length);
  let linhasNoEcra = 0, caracteresNoEcra = 0, linhasTotais = 0;
  const alto = window.innerHeight;
  for (const p of colunas) {
    const lh = parseFloat(getComputedStyle(p).lineHeight);
    const linhas = caixasDeLinha(p);
    const texto = p.textContent.replace(/\\s+/g, ' ').trim();
    const porLinha = linhas.length ? texto.length / linhas.length : 0;
    linhasTotais += linhas.length;
    for (const l of linhas) {
      if (l.top >= 0 && l.top + lh <= alto) { linhasNoEcra++; caracteresNoEcra += porLinha; }
    }
  }
  return { linhas_no_ecra: linhasNoEcra, linhas_totais: linhasTotais,
           caracteres_no_ecra: Math.round(caracteresNoEcra), paragrafos: colunas.length };
}`;

/**
 * O CONTADOR DA TABELA DO INSTRUMENTO. A medida 6 da rubrica é a densidade de
 * leitura; a adenda estende-a ao lugar do instrumento com «uma tabela de linha
 * do livro-razão», que na página real é a ficha do aparelho (`dl.aparelho-ficha`):
 * sete pares de rótulo e valor, com os valores compostos em `--f-instr`.
 *
 * Três números, e nenhum deles depende de onde a página está rolada:
 *   · a altura total da tabela, que é a densidade propriamente dita (o mesmo
 *     conteúdo, o mesmo corpo, outra letra, outra altura);
 *   · quantos pares cabem inteiros num ecrã de 844 px contados do topo dela;
 *   · quantos caracteres esses pares trazem.
 */
export const DETETOR_TABELA = `(seletor, alturaDaJanela) => {
  const t = document.querySelector(seletor);
  if (!t) return null;
  const dts = [...t.querySelectorAll('dt')], dds = [...t.querySelectorAll('dd')];
  if (!dts.length || dts.length !== dds.length) return null;
  const topo = t.getBoundingClientRect().top;
  const pares = [];
  for (let i = 0; i < dts.length; i++) {
    const a = dts[i].getBoundingClientRect(), b = dds[i].getBoundingClientRect();
    pares.push({
      topo: Math.min(a.top, b.top) - topo,
      fundo: Math.max(a.bottom, b.bottom) - topo,
      caracteres: (dts[i].textContent + dds[i].textContent).replace(/\\s+/g, ' ').trim().length,
    });
  }
  const cabem = pares.filter((p) => p.fundo <= alturaDaJanela);
  return {
    pares: pares.length,
    altura_total_px: +(t.getBoundingClientRect().height).toFixed(1),
    pares_no_ecra: cabem.length,
    caracteres_no_ecra: cabem.reduce((a, p) => a + p.caracteres, 0),
    caracteres_totais: pares.reduce((a, p) => a + p.caracteres, 0),
  };
}`;

async function provaDaMedida6(navegador) {
  console.log('\nMEDIDA 6 · a densidade, da prosa e do instrumento');
  const ctx = await navegador.newContext({ deviceScaleFactor: 1, viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();

  /* VERMELHO PLANTADO na prosa: um parágrafo com o dobro das linhas que cabem.
     Um contador que conte as linhas do parágrafo e não as do ECRÃ devolve aqui
     o número total, e é esse o erro que este caso planta. */
  const palavra = 'estado ';
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    body{margin:0}
    p{margin:0;font:17px/28px Georgia,serif;width:360px}
  </style><p>${palavra.repeat(700)}</p>`, { waitUntil: 'load' });
  const r = await p.evaluate(([det]) => {
    const d = eval(det)('p');
    /* Os topos das linhas, lidos à parte, para a prova poder conferir a
       FRONTEIRA em vez de acreditar na conta do próprio detetor. */
    const el = document.querySelector('p');
    const rg = document.createRange(); rg.selectNodeContents(el);
    const tops = [...rg.getClientRects()].filter((x) => x.height > 0 && x.width > 0).map((x) => x.top);
    return { d, tops, lh: parseFloat(getComputedStyle(el).lineHeight) };
  }, [DETETOR_LINHAS]);
  const N = r.d.linhas_no_ecra;
  exige(r.d.linhas_totais > N,
    `o parágrafo plantado tem ${r.d.linhas_totais} linhas e a régua conta ${N}: as de baixo da dobra ficam de fora`);
  exige(r.tops[N - 1] + r.lh <= 844 && r.tops[N] + r.lh > 844,
    `a fronteira está no sítio: a linha ${N} acaba a ${(r.tops[N - 1] + r.lh).toFixed(1)} px e a ${N + 1} a ${(r.tops[N] + r.lh).toFixed(1)} px, com o ecrã a 844`);
  exige(r.d.caracteres_no_ecra < Math.round(palavra.length * 700),
    `os caracteres no ecrã (${r.d.caracteres_no_ecra}) são menos do que os do parágrafo inteiro (${palavra.length * 700})`);

  /* VERDE conhecido: o mesmo detetor num parágrafo que cabe todo. */
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    body{margin:0}p{margin:0;font:17px/28px Georgia,serif;width:360px}
  </style><p>${palavra.repeat(40)}</p>`, { waitUntil: 'load' });
  const r2 = await p.evaluate(([det]) => eval(det)('p'), [DETETOR_LINHAS]);
  exige(r2.linhas_no_ecra === r2.linhas_totais && r2.linhas_totais > 2,
    `um parágrafo que cabe todo conta as suas ${r2.linhas_totais} linhas e não menos`);

  /* A TABELA DO INSTRUMENTO. Sete pares de 200 px de altura: só quatro cabem
     num ecrã de 844 px. */
  const linha = (i) => `<dt>campo ${i}</dt><dd style="height:180px">valor ${i} · 123 456,78</dd>`;
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    body{margin:0}dl{margin:0;font:13.5px/1.4 Georgia,serif}
    dt{height:20px;margin:0}dd{margin:0}
  </style><dl class="aparelho-ficha">${[1, 2, 3, 4, 5, 6, 7].map(linha).join('')}</dl>`, { waitUntil: 'load' });
  const t = await p.evaluate(([det]) => eval(det)('.aparelho-ficha', 844), [DETETOR_TABELA]);
  exige(t && t.pares === 7, `a tabela plantada tem ${t && t.pares} pares`);
  exige(t && t.pares_no_ecra === 4,
    `e num ecrã de 844 px cabem ${t && t.pares_no_ecra} inteiros (esperado 4, porque cada par mede 200 px)`);
  exige(t && Math.abs(t.altura_total_px - 1400) < 2,
    `a altura total lê-se ${t && t.altura_total_px} px (esperado 1400)`);
  exige(t && t.caracteres_no_ecra < t.caracteres_totais,
    `e os caracteres no ecrã (${t && t.caracteres_no_ecra}) são menos do que os da tabela toda (${t && t.caracteres_totais})`);

  /* VERMELHO ao contrário: uma tabela curta tem de dar TODOS os pares. Um
     detetor que devolvesse sempre quatro passava o caso de cima. */
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    body{margin:0}dl{margin:0;font:13.5px/1.4 Georgia,serif}dt,dd{margin:0;height:20px}
  </style><dl class="aparelho-ficha">${[1, 2, 3].map((i) => `<dt>k ${i}</dt><dd>v ${i} · 1 234</dd>`).join('')}</dl>`,
  { waitUntil: 'load' });
  const t2 = await p.evaluate(([det]) => eval(det)('.aparelho-ficha', 844), [DETETOR_TABELA]);
  exige(t2 && t2.pares_no_ecra === 3,
    `uma tabela curta dá os seus ${t2 && t2.pares_no_ecra} pares, e não um número fixo`);
  await ctx.close();
}

/* ------------------------------------------------------------------ *
 * MEDIDA 7 · a soma dos bytes
 * ------------------------------------------------------------------ */

/**
 * A soma da medida 7, com o vermelho plantado por dentro: um nome que não está
 * na lista de subconjuntos PARA a soma em vez de somar zero. A primeira ronda
 * escrevia `bytes[f] ?? 0`, e um erro de nome tinha saído de lá como uma
 * família mais leve do que as outras.
 */
export function somaDosFicheiros(ficheiros, bytes) {
  let total = 0;
  for (const f of ficheiros) {
    const b = bytes[f];
    if (typeof b !== 'number') {
      throw new Error(`medida 7: «${f}» não está em tipos/SUBCONJUNTOS.json; a soma pararia com um zero silencioso.`);
    }
    total += b;
  }
  return total;
}

function provaDaMedida7() {
  console.log('\nMEDIDA 7 · a soma dos bytes');
  const bytes = { 'a.woff2': 100, 'b.woff2': 250 };
  exige(somaDosFicheiros(['a.woff2', 'b.woff2'], bytes) === 350,
    'dois ficheiros conhecidos somam 350 bytes');
  let parou = false;
  try { somaDosFicheiros(['a.woff2', 'c.woff2'], bytes); } catch { parou = true; }
  exige(parou, 'um nome que não existe na lista PARA a soma, e não conta zero');
}

/* ------------------------------------------------------------------ *
 * A PORTA
 * ------------------------------------------------------------------ */

/**
 * Corre tudo. Devolve o número de falhas; quem a chama pára se for maior do que
 * zero. `navegador` pode vir de fora para não levantar dois Chromium.
 */
export async function todasAsProvas(navegador = null) {
  falhas = 0;
  console.log('AS PROVAS DOS DETETORES (as medidas 2 e 3 correm no `pixeis.mjs`)\n');
  const antes = process.exitCode;
  provasDePixeis();
  if (process.exitCode) falhas++;
  process.exitCode = antes;

  const proprio = !navegador;
  const nav = navegador || await chromium.launch();
  console.log(`\nmotor: Chromium ${nav.version()} (o do Playwright desta máquina)\n`);
  await provaDaMedida1(nav);
  await provaDaMedida4(nav);
  await provaDaMedida6(nav);
  if (proprio) await nav.close();
  provaDaMedida7();

  if (falhas) {
    console.error(`\n${falhas} DETETOR(ES) NÃO VIRAM O SEU CASO CONHECIDO. Nenhuma medida vale.`);
  } else {
    console.log('\nTodos os detetores viram o seu vermelho. As medidas podem correr.');
  }
  return falhas;
}

/** Chamada pelos programas que medem: pára a corrida em vez de escrever números. */
export async function exigeAsProvas(navegador = null) {
  const f = await todasAsProvas(navegador);
  if (f) throw new Error('as provas dos detetores falharam; nada foi medido.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  todasAsProvas().then((f) => { process.exit(f ? 1 : 0); })
    .catch((e) => { console.error(e); process.exit(1); });
}
