/**
 * AS PRANCHAS (§4.4 do brief): as mesmas duas páginas, lado a lado, em cada
 * família, e os recortes de algarismos ampliados.
 *
 * Constrói três coisas:
 *
 *   `PRANCHA-390.png`   a página de concelho e a página de leitura, a 390 e 3×,
 *                       nas cinco combinações, lado a lado.
 *   `PRANCHA-1280.png`  as mesmas duas páginas a 1280 e 2×.
 *   `PRANCHA-ALGARISMOS.png`  uma tabela de algarismos por família, composta a
 *                       15 px e capturada a 1×, ampliada 4× sem interpolação.
 *
 * OS PÍXEIS SÃO OS DAS CAPTURAS, E À ESCALA DE UM PARA UM. Cada célula é uma
 * janela sobre o PNG que a régua tirou, mostrada no seu tamanho nativo: um
 * retrato de 3× encolhido para caber numa página seria um retrato da
 * interpolação do navegador e não da letra. A prancha fica larga por causa
 * disso, e fica larga de propósito.
 *
 * A prancha dos algarismos é a única coisa deste ficheiro que NÃO é um recorte
 * de página, e a razão é que nenhuma página do sítio compõe algarismos a 15 px:
 * a linha do livro-razão compõe-os a 13,5 e a tabela de um estudo a 13. A
 * rubrica pede 15 px, e por isso a tabela é composta aqui, com a ficha
 * `--f-instr` de cada combinação e o `font-variant-numeric: tabular-nums` que o
 * sítio pede em 143 sítios. Está dito, e é o que é.
 *
 * Corre-se depois de todas as combinações estarem medidas:
 *   node design/tipografia/programa/pranchas.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const ESTUDO = path.join(RAIZ, 'design', 'tipografia');
const CAPTURAS = path.join(ESTUDO, 'capturas');

const COMBINACOES = [
  { id: 'spectral+bitter', rotulo: 'Spectral + Bitter', nota: 'o sítio de hoje' },
  { id: 'newsreader+bitter', rotulo: 'Newsreader + Bitter', nota: 'sem versaletes próprios' },
  { id: 'sourceserif4+bitter', rotulo: 'Source Serif 4 + Bitter', nota: '' },
  { id: 'literata+bitter', rotulo: 'Literata + Bitter', nota: '' },
  { id: 'spectral+publicsans', rotulo: 'Spectral + Public Sans', nota: 'só o instrumento muda' },
];

const b64 = (f) => fs.readFileSync(f).toString('base64');

/**
 * Uma prancha: duas linhas (concelho e leitura) × cinco colunas (as famílias),
 * cada célula uma janela de `larguraCelula` × `alturaCelula` píxeis nativos
 * sobre a captura, deslocada de `saltoY` para saltar a mobília do cabeçalho.
 */
function html({ largura, densidade, larguraCelula, alturaCelula, saltoY, titulo }) {
  const linhas = [
    { pagina: 'concelho', rotulo: '/municipios/evora' },
    { pagina: 'leitura', rotulo: '/estudos/evora-orcamentado-pago-devido-2025/texto' },
  ];
  let corpo = '';
  for (const l of linhas) {
    corpo += `<div class="rotulo-linha">${l.rotulo} · ${largura} px · ${densidade}×</div><div class="fila">`;
    for (const c of COMBINACOES) {
      const f = path.join(CAPTURAS, c.id, `${l.pagina}-${largura}-${densidade}x.png`);
      if (!fs.existsSync(f)) {
        corpo += `<div class="cel"><div class="cab">${c.rotulo}</div>`
          + `<div class="janela vazia">sem captura: ${path.basename(f)}</div></div>`;
        continue;
      }
      corpo += `<div class="cel"><div class="cab">${c.rotulo}`
        + (c.nota ? `<span class="nota"> · ${c.nota}</span>` : '')
        + `</div><div class="janela" style="background-image:url(data:image/png;base64,${b64(f)});`
        + `background-position:center -${saltoY}px"></div></div>`;
    }
    corpo += '</div>';
  }
  return `<!doctype html><meta charset="utf-8"><style>
  *{box-sizing:border-box}
  body{margin:0;background:#e7e9e4;font:13px/1.4 -apple-system,system-ui,sans-serif;color:#17191b;padding:20px}
  h1{font:600 20px/1.3 system-ui;margin:0 0 4px}
  .sub{color:#585d5b;margin:0 0 18px}
  .rotulo-linha{font:600 13px/1 system-ui;color:#585d5b;margin:16px 0 8px;letter-spacing:.02em}
  .fila{display:flex;gap:14px}
  .cel{background:#f6f7f4;border:1px solid #b9beb8}
  .cab{padding:6px 8px;border-bottom:1px solid #b9beb8;font:600 13px/1.3 system-ui;background:#dfe2dd}
  .nota{font-weight:400;color:#585d5b}
  .janela{width:${larguraCelula}px;height:${alturaCelula}px;background-repeat:no-repeat}
  .vazia{display:flex;align-items:center;justify-content:center;color:#7a5300;font-size:12px}
</style>
<h1>${titulo}</h1>
<p class="sub">As mesmas duas páginas do sítio, nas cinco combinações do estudo. Píxeis das capturas, um para um: nada aqui foi redimensionado.</p>
${corpo}`;
}

/** A prancha dos algarismos: uma tabela a 15 px, a 1×, ampliada 4×. */
function htmlAlgarismos(faces, fichasPorCombinacao) {
  const linhas = [
    ['2019', '64 390 566', '152,8', '1 204', '89,7'],
    ['2020', '64 827 142', '148,6', '1 118', '90,1'],
    ['2021', '61 737 315', '141,9', '1 073', '88,4'],
    ['2024', '54 681 562', '105,5', '1 007', '91,6'],
  ];
  let corpo = '';
  for (const c of COMBINACOES) {
    const ficha = fichasPorCombinacao[c.id];
    if (!ficha) continue;
    /* AS ASPAS DA FICHA. `--f-instr` chega como `"Bitter", "Rockwell", …`, com
       aspas duplas, que são as mesmas que fecham um atributo de HTML: posta
       assim, a pilha partia o `style` ao meio e a tabela saía na letra do
       sistema com o rótulo «Bitter» por cima. Foi a guarda do
       `document.fonts.check` que o apanhou, e não os meus olhos. Passam a
       simples, que dentro de um atributo entre aspas duplas não fecham nada. */
    const pilha = ficha.instr.replaceAll('"', "'");
    corpo += `<div class="cel"><div class="cab">${c.rotulo}<span class="nota"> · ${ficha.instr.split(',')[0].replace(/["']/g, '')}</span></div>`
      + `<table style="font-family:${pilha}">`
      + linhas.map((l) => '<tr>' + l.map((v) => `<td>${v}</td>`).join('') + '</tr>').join('')
      + '</table></div>';
  }
  return `<!doctype html><meta charset="utf-8"><style>${faces}</style><style>
  *{box-sizing:border-box}
  body{margin:0;background:#e7e9e4;font:13px/1.4 system-ui,sans-serif;color:#17191b;padding:20px}
  h1{font:600 20px/1.3 system-ui;margin:0 0 4px}
  .sub{color:#585d5b;margin:0 0 18px;max-width:900px}
  .fila{display:flex;gap:14px;flex-wrap:wrap}
  .cel{background:#f6f7f4;border:1px solid #b9beb8}
  .cab{padding:6px 8px;border-bottom:1px solid #b9beb8;font:600 13px/1.3 system-ui;background:#dfe2dd}
  .nota{font-weight:400;color:#585d5b}
  table{border-collapse:collapse;font-size:15px;font-variant-numeric:tabular-nums lining-nums;
        font-weight:600;margin:10px}
  td{padding:2px 10px;text-align:right}
</style>
<h1>Os algarismos de cada instrumento, a 15 px e 1×</h1>
<p class="sub">Compostos aqui e não recortados de uma página, porque nenhuma página do sítio compõe algarismos a 15 px: a linha do livro-razão compõe-os a 13,5. A ficha de família é a <code>--f-instr</code> de cada combinação, com <code>font-variant-numeric: tabular-nums</code>, que é o que a folha do sítio pede em 143 sítios. A imagem é capturada a 1× e ampliada 4× sem interpolação: cada quadrado é um píxel do ecrã.</p>
<div class="fila">${corpo}</div>`;
}

async function principal() {
  const navegador = await chromium.launch();

  /* As `@font-face` de todas as combinações juntas, para a prancha dos
     algarismos poder compor as cinco famílias na mesma página. */
  const { folha, FAMILIAS } = await import('./interruptor.mjs');
  const fichas = {};
  const facesTodas = [];
  for (const c of COMBINACOES) {
    const css = folha({ TIPOS_ESTUDO: c.id });
    const ficheiro = path.join(ESTUDO, 'medidas', `${c.id}.json`);
    if (fs.existsSync(ficheiro)) {
      fichas[c.id] = JSON.parse(fs.readFileSync(ficheiro, 'utf8')).fichas;
    }
    for (const m of css.matchAll(/@font-face\{[^}]*\}/g)) facesTodas.push(m[0]);
  }
  /* OS TIPOS VÊM POR HTTP, e não por `file://`. A prancha dos algarismos é
     montada com `setContent`, cuja origem é `about:blank`, e o Chromium recusa
     um subrecurso `file://` a uma página dessa origem: o que se via era a pilha
     de recuo com a cara de outra letra. Levanta-se um servidor mínimo com
     `/publico/` (o que o sítio já aloja, lido e nunca escrito) e `/estudo/` (as
     candidatas). */
  const srv = http.createServer((req, res) => {
    const rel = decodeURIComponent((req.url || '/').split('?')[0]);
    let f = null;
    if (rel.startsWith('/publico/')) f = path.join(RAIZ, 'public', 'tipos', rel.slice(9));
    else if (rel.startsWith('/estudo/')) f = path.join(ESTUDO, 'tipos', rel.slice(8));
    if (f && fs.existsSync(f) && fs.statSync(f).isFile()) {
      res.writeHead(200, { 'content-type': 'font/woff2', 'cache-control': 'no-store' });
      fs.createReadStream(f).pipe(res);
      return;
    }
    res.writeHead(rel === '/' ? 200 : 404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(rel === '/' ? '<!doctype html><title>base</title>' : 'nao ha');
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const porto = srv.address().port;

  const facesDeHoje = fs.readFileSync(path.join(RAIZ, 'src', 'styles', 'tokens.css'), 'utf8')
    .match(/@font-face\s*\{[\s\S]*?\}/g) || [];
  const faces = [...facesDeHoje, ...new Set(facesTodas)]
    .join('\n')
    .replaceAll("url('/tipos/", `url('http://127.0.0.1:${porto}/publico/`)
    .replaceAll("url('/tipos-estudo/", `url('http://127.0.0.1:${porto}/estudo/`);

  const trabalhos = [
    {
      ficheiro: 'PRANCHA-390.png',
      op: { largura: 390, densidade: 3, larguraCelula: 1170, alturaCelula: 1000, saltoY: 900,
            titulo: 'PRANCHA 390 · o telemóvel, a 390 px e 3×' },
    },
    {
      ficheiro: 'PRANCHA-1280.png',
      /* A janela era de 1300 px e cortava a coluna de leitura pelo meio nas duas
         margens: a comparação continuava a ser válida, porque o corte é o mesmo
         nas cinco colunas, mas lia-se mal. A 1280 e 2× a coluna de leitura mede
         perto de 1500 px nativos, e é essa a largura da janela agora. */
      op: { largura: 1280, densidade: 2, larguraCelula: 1560, alturaCelula: 1000, saltoY: 700,
            titulo: 'PRANCHA 1280 · o portátil, a 1280 px e 2× (janela de 1560 px nativos, ao centro)' },
    },
  ];

  for (const t of trabalhos) {
    const ctx = await navegador.newContext({ deviceScaleFactor: 1, viewport: { width: 1200, height: 800 } });
    const p = await ctx.newPage();
    await p.setContent(html(t.op), { waitUntil: 'load' });
    await p.screenshot({ path: path.join(ESTUDO, t.ficheiro), fullPage: true });
    const b = fs.statSync(path.join(ESTUDO, t.ficheiro)).size;
    console.log(`  ${t.ficheiro}  ${(b / 1048576).toFixed(2)} MB`);
    await ctx.close();
  }

  /* Os algarismos: capturar a 1× e ampliar 4× sem interpolação. */
  {
    const ctx = await navegador.newContext({ deviceScaleFactor: 1, viewport: { width: 1400, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${porto}/`);
    await p.setContent(htmlAlgarismos(faces, fichas), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    /**
     * Nenhuma prancha se tira sem se confirmar que os tipos carregaram: uma
     * imagem da pilha de recuo com o rótulo «Bitter» por cima seria uma mentira
     * em PNG. Foi esta guarda que apanhou as aspas do `style`.
     *
     * A GUARDA PERGUNTA PELO QUE ESTA PÁGINA COMPÕE, e não por tudo o que
     * declarou. A primeira versão exigia as sete famílias e falhava nas quatro
     * de prosa, com razão: esta prancha só compõe algarismos, e algarismos
     * compõem-se em `--f-instr`. Um tipo declarado que nenhum caractere usa não
     * é pedido pelo navegador, e `document.fonts.check` responde falso sobre
     * ele com toda a razão. A lista sai das fichas das combinações, e por isso
     * é a lista do que está mesmo na imagem.
     */
    const usadas = [...new Set(Object.values(fichas)
      .map((f) => f.instr.split(',')[0].replace(/["']/g, '').trim()))];
    const emFalta = await p.evaluate((ns) => ns.filter(
      (f) => !document.fonts.check(`600 15px "${f}"`)), usadas);
    if (emFalta.length) throw new Error('não carregaram: ' + emFalta.join(', '));
    console.log(`  guarda: ${usadas.join(', ')} carregaram`);
    const cru = await p.screenshot({ fullPage: true });
    const bruto = path.join(ESTUDO, 'capturas', 'algarismos-15px-1x.png');
    fs.mkdirSync(path.dirname(bruto), { recursive: true });
    fs.writeFileSync(bruto, cru);
    await ctx.close();

    const ctx2 = await navegador.newContext({ deviceScaleFactor: 1, viewport: { width: 1200, height: 800 } });
    const p2 = await ctx2.newPage();
    await p2.setContent(`<!doctype html><meta charset="utf-8"><style>
      body{margin:0;background:#e7e9e4}
      img{image-rendering:pixelated;width:calc(4 * var(--w))}
    </style><img id="i" src="data:image/png;base64,${cru.toString('base64')}">
    <script>
      const i = document.getElementById('i');
      i.onload = () => { document.documentElement.style.setProperty('--w', i.naturalWidth + 'px'); };
    </script>`, { waitUntil: 'load' });
    await p2.waitForFunction(() => {
      const i = document.getElementById('i');
      return i.complete && i.naturalWidth > 0
        && getComputedStyle(document.documentElement).getPropertyValue('--w');
    });
    await p2.screenshot({ path: path.join(ESTUDO, 'PRANCHA-ALGARISMOS.png'), fullPage: true });
    const b = fs.statSync(path.join(ESTUDO, 'PRANCHA-ALGARISMOS.png')).size;
    console.log(`  PRANCHA-ALGARISMOS.png  ${(b / 1048576).toFixed(2)} MB (ampliada 4×, sem interpolação)`);
    await ctx2.close();
  }

  await navegador.close();
  srv.close();
}

principal().catch((e) => { console.error(e); process.exit(1); });
