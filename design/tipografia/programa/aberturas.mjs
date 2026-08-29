/**
 * MEDIDA 3, POR FAMÍLIA E COM RESOLUÇÃO QUE CHEGUE.
 *
 * A abertura de um «e» é uma propriedade do desenho, não da página: não muda
 * entre a primeira página e um concelho. Mede-se por isso uma vez por família,
 * e não uma vez por combinação.
 *
 * PORQUE ESTE FICHEIRO EXISTE ALÉM DA RÉGUA. A régua mede a abertura a 17 px e
 * 1×, que é o que a rubrica manda, e a 3×. A 1× o número é 1 px para toda a
 * gente e a 3× ÷ 3 ainda cai em degraus de um terço de píxel: as famílias
 * separam-se por menos do que isso. Aqui mede-se a mesma letra ao mesmo corpo
 * de 17 px a 1×, 3×, 6× e 12×, e divide-se pela densidade. O CORPO NÃO MUDA, e
 * é essa a razão de não se compor a 204 px: as três serifas candidatas têm eixo
 * `opsz`, e a 204 px o navegador pede-lhes o desenho de titulação, que tem
 * outras aberturas. Subir a densidade dá mais píxeis sobre a MESMA letra.
 *
 * O número da rubrica continua a ser o de 1×, e vai na tabela. O de 12× é o que
 * ordena as famílias, e vai ao lado dito como o que é.
 *
 * Corre: node design/tipografia/programa/aberturas.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { abertura } from './pixeis.mjs';

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
  { nome: 'Bitter', papel: 'instrumento', peso: 600, url: publico('bitter/Bitter%5Bwght%5D.woff2'), variavel: '100 900' },
  { nome: 'Public Sans', papel: 'instrumento', peso: 600, url: raiz('publicsans/PublicSans-latin.woff2'), variavel: '100 900' },
  { nome: 'IBM Plex Sans', papel: 'instrumento', peso: 600, url: raiz('ibmplexsans/IBMPlexSans-latin.woff2'), variavel: '100 700' },
];

const DENSIDADES = [1, 3, 6, 12];
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
  const escala = { papel: 246.5708, tinta: 24.7192 }; // as luminâncias de --paper e --ink
  const fora = {
    escrito: new Date().toISOString(),
    corpo_px: 17,
    escala_de_tinta: escala,
    nota: 'o corpo é sempre 17 px; o que sobe é a densidade, para o `opsz` das '
      + 'candidatas ficar em 17 e a letra ser a mesma em todas as leituras',
    familias: {},
  };

  for (const f of FAMILIAS) {
    const d = { papel: f.papel, peso: f.peso, ficheiro: f.url, por_densidade: {} };
    for (const dsf of DENSIDADES) {
      const ctx = await navegador.newContext({
        deviceScaleFactor: dsf, viewport: { width: 400, height: 800 },
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
      d.por_densidade[dsf + 'x'] = linha;
      await ctx.close();
    }
    fora.familias[f.nome] = d;
    const doze = d.por_densidade['12x'];
    console.log(`${f.nome.padEnd(15)} peso ${f.peso}  `
      + LETRAS.map((l) => `${l}=${doze[l].px_de_css === null ? '—' : doze[l].px_de_css.toFixed(2)}`).join('  ')
      + '   (px de CSS, lidos a 12×)');
  }

  await navegador.close();
  srv.close();
  fs.writeFileSync(path.join(ESTUDO, 'MEDIDAS-aberturas.json'), JSON.stringify(fora, null, 2) + '\n');
  console.log('\nescrito design/tipografia/MEDIDAS-aberturas.json');
}

principal().catch((e) => { console.error(e); process.exit(1); });
