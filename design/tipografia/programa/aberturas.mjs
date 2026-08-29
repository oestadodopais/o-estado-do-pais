/**
 * MEDIDA 3, POR FAMÍLIA E COM RESOLUÇÃO QUE CHEGUE.
 *
 * A abertura de um «e» é uma propriedade do desenho, não da página: não muda
 * entre a primeira página e um concelho. Mede-se por isso uma vez por família,
 * e não uma vez por combinação.
 *
 * SEGUNDA RONDA, E O QUE MUDOU. Na primeira, este ficheiro mediu a mesma letra
 * a 1×, 3×, 6× e 12× e a ordem saiu da leitura de 12× dividida por doze, porque
 * a 1× o número é um píxel para quase toda a gente. A leitura cruzada apontou
 * que isso é outra medida, e a adenda 2 fixou: **o número que ordena é o de 1×,
 * e se a 1× a medida não distinguir as famílias, diz-se e a medida pesa zero.**
 * É o que se faz. As outras densidades ficam medidas e escritas, e nenhuma delas
 * entra na conta da ordem.
 *
 * O CORPO NÃO MUDA em nenhuma leitura, e é essa a razão de não se compor a 204
 * px: as serifas candidatas com eixo `opsz` dariam a 204 px o desenho de
 * titulação, que tem outras aberturas. Subir a densidade dá mais píxeis sobre a
 * MESMA letra.
 *
 * E A 1× MEDE-SE NAS SETE LARGURAS da rubrica, porque a adenda §2 as pede para
 * as medidas 2 e 3. O espécime é um `inline-block` a 17 px, que não depende da
 * janela; em vez de o argumentar, medem-se as sete e escreve-se se deram todas o
 * mesmo.
 *
 * Corre: node design/tipografia/programa/aberturas.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { abertura } from './pixeis.mjs';
import { exigeAsProvas } from './provas.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const ESTUDO = path.join(RAIZ, 'design', 'tipografia');
/**
 * OS TIPOS TÊM DE VIR POR HTTP, E NÃO POR `file://`.
 *
 * A página do espécime é montada com `setContent`, e a origem dela é
 * `about:blank`. O Chromium recusa um subrecurso `file://` a uma página dessa
 * origem, e o que se vê é a pilha de recuo com a cara de outra letra. A
 * primeira versão deste ficheiro fazia isso, e o `document.fonts.check` foi o
 * que a apanhou: a régua parou em vez de medir a Georgia e lhe chamar Spectral.
 *
 * Levanta-se por isso um servidor mínimo com dois caminhos: `/estudo/` para as
 * candidatas e `/publico/` para os três tipos que o sítio já aloja, LIDOS de
 * `public/tipos` e nunca escritos.
 */
const raiz = (p) => `/estudo/${p}`;
const publico = (p) => `/publico/${p}`;

function servidor() {
  return http.createServer((req, res) => {
    const rel = decodeURIComponent((req.url || '/').split('?')[0]);
    let f = null;
    if (rel.startsWith('/estudo/')) f = path.join(ESTUDO, 'tipos', rel.slice(8));
    else if (rel.startsWith('/publico/')) f = path.join(RAIZ, 'public', 'tipos', rel.slice(9));
    if (f && fs.existsSync(f) && fs.statSync(f).isFile()) {
      res.writeHead(200, { 'content-type': 'font/woff2', 'cache-control': 'no-store' });
      fs.createReadStream(f).pipe(res);
      return;
    }
    res.writeHead(rel === '/' ? 200 : 404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(rel === '/' ? '<!doctype html><title>base</title>' : 'nao ha ' + rel);
  });
}

/**
 * O peso é o que o sítio usa: 400 na prosa, 600 no aparelho. Medir uma
 * candidata de instrumento a 400 seria medir uma letra que nenhuma regra pede.
 */
const FAMILIAS = [
  { nome: 'Spectral', papel: 'prosa', peso: 400, url: publico('spectral/Spectral-Regular.woff2'), variavel: false },
  { nome: 'Newsreader', papel: 'prosa', peso: 400, url: raiz('newsreader/Newsreader-latin.woff2'), variavel: '200 800' },
  { nome: 'Source Serif 4', papel: 'prosa', peso: 400, url: raiz('sourceserif4/SourceSerif4-latin.woff2'), variavel: '200 900' },
  { nome: 'Literata', papel: 'prosa', peso: 400, url: raiz('literata/Literata-latin.woff2'), variavel: '200 900' },
  /* Acrescentada pelo lugar de direção depois da adenda 2. Não é variável: o
     `variavel: false` faz o `@font-face` declarar `font-weight: 400`, que é o
     único peso que o ficheiro tem. */
  { nome: 'Ledger', papel: 'prosa', peso: 400, url: raiz('ledger/Ledger-latin.woff2'), variavel: false },
  { nome: 'Bitter', papel: 'instrumento', peso: 600, url: publico('bitter/Bitter%5Bwght%5D.woff2'), variavel: '100 900' },
  { nome: 'Public Sans', papel: 'instrumento', peso: 600, url: raiz('publicsans/PublicSans-latin.woff2'), variavel: '100 900' },
  { nome: 'IBM Plex Sans', papel: 'instrumento', peso: 600, url: raiz('ibmplexsans/IBMPlexSans-latin.woff2'), variavel: '100 700' },
];

const DENSIDADES = [1, 3, 6, 12];
/** As sete larguras da rubrica, para a medida 3 as ver a 1× como a adenda pede. */
const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280];
const LETRAS = ['e', 'a', 's', 'c', 'o'];

function pagina(f, porto) {
  return `<!doctype html><meta charset="utf-8"><style>
    @font-face{font-family:'X';src:url('http://127.0.0.1:${porto}${f.url}') format('woff2');`
    + (f.variavel ? `font-weight:${f.variavel};` : 'font-weight:400;')
    + `font-style:normal;font-display:block}
    html,body{margin:0;background:#f6f7f4}
    .g{display:inline-block;background:#f6f7f4;color:#17191b;padding:16px;
       font:${f.peso} 17px/1 'X';}
  </style>`
    + LETRAS.map((l) => `<div><span class="g" id="${l}">${l}</span></div>`).join('');
}

async function principal() {
  const srv = servidor();
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const porto = srv.address().port;
  const navegador = await chromium.launch();
  await exigeAsProvas(navegador);
  const escala = { papel: 246.5708, tinta: 24.7192 }; // as luminâncias de --paper e --ink
  const fora = {
    ronda: 2,
    motor: { nome: 'Chromium (Playwright)', versao: navegador.version(), plataforma: process.platform },
    corpo_px: 17,
    escala_de_tinta: escala,
    /* O NÚMERO DA RUBRICA É O DE 1×, E É ESSE QUE ORDENA (ou não ordena).
       A adenda fixou a medida 3 «a 17 px e 1×, pelo método que a primeira ronda
       encontrou (quanto o traço tem de engordar até a garganta selar) A 1×, e se
       a 1× a medida não distingue as famílias, di-lo e a medida pesa zero». As
       outras densidades ficam aqui como leitura de contexto, e nenhuma delas
       entra na ordem: substituir 1× por 12× era medir outra coisa, e foi isso
       que a leitura cruzada apontou à primeira ronda.
       Não há carimbo de relógio: regenerar tem de dar o mesmo ficheiro. */
    nota: 'o corpo é sempre 17 px; o que sobe é a densidade, para o `opsz` das '
      + 'candidatas ficar em 17 e a letra ser a mesma em todas as leituras. '
      + 'A ordem da segunda ronda usa só a linha de 1×.',
    familias: {},
  };

  /** Uma leitura das cinco letras, numa densidade e numa largura de janela. */
  const leLetras = async (f, dsf, larguraDaJanela) => {
    const ctx = await navegador.newContext({
      deviceScaleFactor: dsf, viewport: { width: larguraDaJanela, height: 800 },
    });
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${porto}/`);
    await p.setContent(pagina(f, porto), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const carregou = await p.evaluate(() => document.fonts.check('17px X'));
    if (!carregou) throw new Error(`o tipo ${f.nome} não carregou`);
    const linha = {};
    for (const l of LETRAS) {
      const buf = await p.locator('#' + l).screenshot();
      const img = await p.evaluate(async (b) => {
        const bin = atob(b);
        const u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        const bmp = await createImageBitmap(new Blob([u8], { type: 'image/png' }));
        const c = new OffscreenCanvas(bmp.width, bmp.height);
        const g = c.getContext('2d');
        g.drawImage(bmp, 0, 0);
        return { largura: bmp.width, altura: bmp.height, dados: Array.from(g.getImageData(0, 0, bmp.width, bmp.height).data) };
      }, buf.toString('base64'));
      const r = abertura(img, escala);
      linha[l] = r.abertura_px === null
        ? { px_do_ecra: null, px_de_css: null, razao: r.razao }
        : { px_do_ecra: r.abertura_px, px_de_css: +(r.abertura_px / dsf).toFixed(3) };
    }
    await ctx.close();
    return linha;
  };

  for (const f of FAMILIAS) {
    const d = { papel: f.papel, peso: f.peso, ficheiro: f.url, por_densidade: {}, a_1x_por_largura: {} };
    for (const dsf of DENSIDADES) {
      d.por_densidade[dsf + 'x'] = await leLetras(f, dsf, 400);
    }
    /**
     * AS SETE LARGURAS, A 1×, PORQUE A ADENDA §2 AS PEDE PARA A MEDIDA 3.
     *
     * A abertura de um «e» é uma propriedade do desenho e não da página, e a
     * largura da janela não lhe toca: o espécime é um `inline-block` a 17 px,
     * que mede o mesmo numa janela de 320 e numa de 1280. Não se responde com
     * um argumento, responde-se com as sete leituras: se derem todas o mesmo,
     * fica provado que a largura não é uma variável desta medida, e é isso que
     * o campo `identica_nas_sete_larguras` diz.
     */
    for (const w of LARGURAS) d.a_1x_por_largura[w] = await leLetras(f, 1, w);
    const assinatura = (linha) => LETRAS.map((l) => String(linha[l].px_de_css)).join('|');
    const assinaturas = new Set(Object.values(d.a_1x_por_largura).map(assinatura));
    d.identica_nas_sete_larguras = assinaturas.size === 1;
    d.assinaturas_distintas_nas_sete_larguras = assinaturas.size;
    fora.familias[f.nome] = d;
    const um = d.por_densidade['1x'];
    const doze = d.por_densidade['12x'];
    const mostra = (linha) => LETRAS.map(
      (l) => `${l}=${linha[l].px_de_css === null ? '—' : linha[l].px_de_css.toFixed(2)}`).join(' ');
    console.log(`${f.nome.padEnd(15)} peso ${f.peso}  1×: ${mostra(um)}`
      + `   (as sete larguras dão ${d.identica_nas_sete_larguras ? 'o mesmo' : 'valores diferentes'})`);
    console.log(`${''.padEnd(15)}         12×: ${mostra(doze)}   (contexto, fora da ordem)`);
  }

  await navegador.close();
  srv.close();
  fs.writeFileSync(path.join(ESTUDO, 'MEDIDAS-2-aberturas.json'), JSON.stringify(fora, null, 2) + '\n');
  console.log('\nescrito design/tipografia/MEDIDAS-2-aberturas.json');
}

principal().catch((e) => { console.error(e); process.exit(1); });
