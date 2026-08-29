/**
 * AS PRANCHAS (§4.4 do brief, e a adenda 2): AS CINCO PÁGINAS, lado a lado, em
 * cada família, e os algarismos ampliados.
 *
 * SEGUNDA RONDA. As pranchas da primeira traziam duas páginas por largura, e a
 * leitura cruzada apontou-o: a rubrica pede cinco, e a leitura cega da §8 não se
 * pode fazer sobre duas. Estas trazem as cinco:
 *
 *   `PRANCHA-2-390.png`   as cinco páginas a 390 e 3×, nas seis construções.
 *   `PRANCHA-2-1280.png`  as mesmas cinco a 1280 e 2×.
 *   `PRANCHA-2-ALGARISMOS.png`  os algarismos a 13,5 px e a 12 px, capturados a
 *                       1× e ampliados 4× sem interpolação.
 *
 * OS PÍXEIS SÃO OS DAS CAPTURAS, E À ESCALA DE UM PARA UM. Cada célula é uma
 * janela sobre o PNG que a régua tirou, mostrada no seu tamanho nativo: um
 * retrato de 3× encolhido para caber numa página seria um retrato da
 * interpolação do navegador e não da letra. As pranchas ficam largas por causa
 * disso, e ficam largas de propósito.
 *
 * PORQUE 13,5 PX E 12 PX NA PRANCHA DOS ALGARISMOS. A adenda fixa 13,5 px, «o
 * corpo real da linha do livro-razão». Medida a página, o que lá está é outra
 * coisa, e diz-se em vez de se calar: dentro do `<main>` da linha do livro-razão
 * o instrumento compõe-se a 40 px (o valor grande, uma vez), a 14 px (doze
 * vezes), a 12,5 px (uma) e a 12 px (dezanove); a 13,5 px compõe-se na página de
 * leitura de estudo (noventa e nove vezes) e na do concelho (quatro). A prancha
 * traz as duas: os 13,5 px que a adenda fixou e os 12 px que a linha do
 * livro-razão de facto usa mais vezes.
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
const CAPTURAS = path.join(ESTUDO, 'capturas-2');

const COMBINACOES = [
  { id: 'spectral+bitter', rotulo: 'Spectral + Bitter', nota: 'o sítio de hoje' },
  { id: 'newsreader+bitter', rotulo: 'Newsreader + Bitter', nota: 'sem versaletes próprios' },
  { id: 'sourceserif4+bitter', rotulo: 'Source Serif 4 + Bitter', nota: '' },
  { id: 'literata+bitter', rotulo: 'Literata + Bitter', nota: '' },
  { id: 'ledger+bitter', rotulo: 'Ledger + Bitter', nota: 'um só peso, sem itálico e sem versaletes' },
  { id: 'spectral+publicsans', rotulo: 'Spectral + Public Sans', nota: 'só o instrumento muda' },
];

/**
 * AS CINCO PÁGINAS, e o quanto se salta em cada uma antes de mostrar.
 *
 * `salto` é em píxeis de CSS, um por largura, e multiplica-se pela densidade: o
 * que se quer é saltar a mobília do cabeçalho e cair onde a página tem letra
 * para julgar. Os números saíram de ABRIR as capturas de 1× e ver onde começa o
 * texto em cada uma, e não de uma regra: a 390 a página é uma coluna e a 1280
 * são quatro, e o mesmo salto não serve às duas.
 *
 * A captura é sempre tirada com a página no topo (ver `regua.mjs`), e por isso
 * este salto cai no mesmo sítio em todas as colunas: o que difere entre elas é
 * a letra e o que ela faz à mancha, que é o que se quer ver.
 */
const PAGINAS = [
  { pagina: 'primeira', rotulo: '/', salto: { 390: 240, 1280: 250 } },
  { pagina: 'concelho', rotulo: '/municipios/evora', salto: { 390: 400, 1280: 490 } },
  { pagina: 'regiao', rotulo: '/regioes/alentejo', salto: { 390: 380, 1280: 380 } },
  { pagina: 'linha', rotulo: '/livro-razao/evora-prr-vencido-aprovado-2026', salto: { 390: 195, 1280: 240 } },
  { pagina: 'leitura', rotulo: '/estudos/evora-orcamentado-pago-devido-2025/texto', salto: { 390: 560, 1280: 470 } },
];

const b64 = (f) => fs.readFileSync(f).toString('base64');

/**
 * Uma prancha: cinco linhas (as páginas da rubrica) × seis colunas (as
 * construções), cada célula uma janela de `larguraCelula` × `alturaCelula`
 * píxeis nativos sobre a captura.
 */
function html({ largura, densidade, larguraCelula, alturaCelula, titulo }) {
  let corpo = '';
  for (const l of PAGINAS) {
    const saltoCss = l.salto[largura];
    const saltoY = Math.round(saltoCss * densidade);
    corpo += `<div class="rotulo-linha">${l.rotulo} · ${largura} px · ${densidade}× · `
      + `saltados ${saltoCss} px de CSS</div><div class="fila">`;
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
  .sub{color:#585d5b;margin:0 0 18px;max-width:1100px}
  .rotulo-linha{font:600 13px/1 system-ui;color:#585d5b;margin:18px 0 8px;letter-spacing:.02em}
  .fila{display:flex;gap:14px}
  .cel{background:#f6f7f4;border:1px solid #b9beb8}
  .cab{padding:6px 8px;border-bottom:1px solid #b9beb8;font:600 13px/1.3 system-ui;background:#dfe2dd}
  .nota{font-weight:400;color:#585d5b}
  .janela{width:${larguraCelula}px;height:${alturaCelula}px;background-repeat:no-repeat}
  .vazia{display:flex;align-items:center;justify-content:center;color:#7a5300;font-size:12px}
</style>
<h1>${titulo}</h1>
<p class="sub">As cinco páginas da rubrica, nas seis construções do estudo. Píxeis das capturas, um para um: nada aqui foi redimensionado. Cada janela mostra a mesma faixa da mesma página em todas as colunas.</p>
${corpo}`;
}

/**
 * A prancha dos algarismos: duas tabelas por instrumento (13,5 px e 12 px) e uma
 * linha com os algarismos de cada família de PROSA ao corpo da prosa, que é o
 * que mostra quais delas alinham colunas sem `tnum` e quais não.
 */
function htmlAlgarismos(faces, instrumentos, prosas) {
  const linhas = [
    ['2019', '64 390 566', '152,8', '1 204', '89,7'],
    ['2020', '64 827 142', '148,6', '1 118', '90,1'],
    ['2021', '61 737 315', '141,9', '1 073', '88,4'],
    ['2024', '54 681 562', '105,5', '1 007', '91,6'],
  ];
  const tabela = (pilha, corpo, tabular) => `<table style="font-family:${pilha};font-size:${corpo}px;`
    + `font-variant-numeric:${tabular ? 'tabular-nums lining-nums' : 'normal'}">`
    + linhas.map((l) => '<tr>' + l.map((v) => `<td>${v}</td>`).join('') + '</tr>').join('')
    + '</table>';

  let instr = '';
  for (const i of instrumentos) {
    const pilha = i.pilha.replaceAll('"', "'");
    instr += `<div class="cel"><div class="cab">${i.nome}<span class="nota"> · ${i.usadaPor}</span></div>`
      + `<div class="par"><div><div class="k">13,5 px, tabulares</div>${tabela(pilha, 13.5, true)}</div>`
      + `<div><div class="k">12 px, tabulares</div>${tabela(pilha, 12, true)}</div></div></div>`;
  }
  let pro = '';
  for (const p of prosas) {
    const pilha = p.pilha.replaceAll('"', "'");
    const selo = p.tnum ? 'tem <code>tnum</code>' : 'SEM <code>tnum</code>';
    pro += `<div class="cel"><div class="cab">${p.nome}<span class="nota"> · ${selo}</span></div>`
      + `<div class="par"><div><div class="k">17 px, com «tabular-nums» pedido</div>${tabela(pilha, 17, true)}</div>`
      + `<div><div class="k">17 px, por defeito</div>${tabela(pilha, 17, false)}</div></div></div>`;
  }
  return `<!doctype html><meta charset="utf-8"><style>${faces}</style><style>
  *{box-sizing:border-box}
  body{margin:0;background:#e7e9e4;font:13px/1.4 system-ui,sans-serif;color:#17191b;padding:20px}
  h1{font:600 20px/1.3 system-ui;margin:0 0 4px}
  h2{font:600 15px/1.3 system-ui;margin:22px 0 8px}
  .sub{color:#585d5b;margin:0 0 18px;max-width:1000px}
  .fila{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start}
  .cel{background:#f6f7f4;border:1px solid #b9beb8}
  .cab{padding:6px 8px;border-bottom:1px solid #b9beb8;font:600 13px/1.3 system-ui;background:#dfe2dd}
  .nota{font-weight:400;color:#585d5b}
  .par{display:flex;gap:6px;padding:8px}
  .k{font:400 11px/1.3 system-ui;color:#585d5b;margin:0 0 4px}
  table{border-collapse:collapse;font-weight:600}
  td{padding:1px 8px;text-align:right}
</style>
<h1>Os algarismos, a 13,5 px e a 12 px, capturados a 1× e ampliados 4×</h1>
<p class="sub">Compostos aqui e não recortados de uma página, porque nenhuma página compõe os cinco casos lado a lado. A ficha de família é a <code>--f-instr</code> de cada construção, com <code>font-variant-numeric: tabular-nums</code>, que é o que a folha do sítio pede. A adenda fixou 13,5 px; dentro do <code>&lt;main&gt;</code> da linha do livro-razão o instrumento compõe-se a 12 px dezanove vezes e a 14 px doze, e a 13,5 px é na página de leitura de estudo, noventa e nove vezes. Estão os dois corpos. A imagem é capturada a 1× e ampliada 4× sem interpolação: cada quadrado é um píxel do ecrã.</p>
<h2>O instrumento</h2>
<div class="fila">${instr}</div>
<h2>A prosa, ao corpo da prosa: quais delas alinham uma coluna</h2>
<p class="sub">A rubrica compõe os algarismos das tabelas em <code>--f-instr</code> e não na prosa, e por isso esta linha não é eliminatória para nenhuma delas. Está aqui porque uma das candidatas não tem <code>tnum</code>, e o que isso quer dizer vê-se melhor do que se lê: à esquerda com <code>tabular-nums</code> pedido, à direita por defeito.</p>
<div class="fila">${pro}</div>`;
}

async function principal() {
  const navegador = await chromium.launch();
  console.log(`motor das pranchas: Chromium ${navegador.version()}`);

  /* As `@font-face` de todas as combinações juntas, para a prancha dos
     algarismos poder compor as famílias todas na mesma página. */
  const { folha } = await import('./interruptor.mjs');
  const fichas = {};
  const facesTodas = [];
  for (const c of COMBINACOES) {
    const css = folha({ TIPOS_ESTUDO: c.id });
    const ficheiro = path.join(ESTUDO, 'medidas-2', `${c.id}.json`);
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
      ficheiro: 'PRANCHA-2-390.png',
      op: { largura: 390, densidade: 3, larguraCelula: 1170, alturaCelula: 860,
            titulo: 'PRANCHA 2 · 390 · o telemóvel, as cinco páginas a 390 px e 3×' },
    },
    {
      ficheiro: 'PRANCHA-2-1280.png',
      /* A 1280 e 2× a coluna de leitura mede perto de 1500 px nativos, e é essa
         a largura da janela: uma mais estreita cortava-a nas duas margens. */
      op: { largura: 1280, densidade: 2, larguraCelula: 1560, alturaCelula: 820,
            titulo: 'PRANCHA 2 · 1280 · o portátil, as cinco páginas a 1280 px e 2× (janela de 1560 px nativos, ao centro)' },
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
    /* Uma coluna por INSTRUMENTO distinto, e não uma por construção: quatro
       colunas iguais de Bitter não mostravam nada que uma não mostre, e a
       prancha diz quais são as construções que a usam. */
    const porInstrumento = new Map();
    for (const c of COMBINACOES) {
      const f = fichas[c.id];
      if (!f) continue;
      const nome = f.instr.split(',')[0].replace(/["']/g, '').trim();
      if (!porInstrumento.has(nome)) porInstrumento.set(nome, { nome, pilha: f.instr, usos: [] });
      porInstrumento.get(nome).usos.push(c.rotulo);
    }
    const instrumentos = [...porInstrumento.values()].map((i) => ({
      nome: i.nome, pilha: i.pilha,
      usadaPor: i.usos.length === COMBINACOES.length ? 'todas as construções' : i.usos.join(', '),
    }));
    const tipoJson = JSON.parse(fs.readFileSync(path.join(ESTUDO, 'MEDIDAS-2-tipo.json'), 'utf8'));
    const porProsa = new Map();
    for (const c of COMBINACOES) {
      const f = fichas[c.id];
      if (!f) continue;
      const nome = f.prosa.split(',')[0].replace(/["']/g, '').trim();
      if (porProsa.has(nome)) continue;
      const chave = Object.keys(tipoJson.familias).find(
        (k) => k === nome || k.startsWith(nome) || nome.startsWith(k));
      porProsa.set(nome, { nome, pilha: f.prosa, tnum: chave ? tipoJson.familias[chave].tem_tnum : null });
    }
    const prosas = [...porProsa.values()];

    const ctx = await navegador.newContext({ deviceScaleFactor: 1, viewport: { width: 1500, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${porto}/`);
    await p.setContent(htmlAlgarismos(faces, instrumentos, prosas), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    /**
     * Nenhuma prancha se tira sem se confirmar que os tipos carregaram: uma
     * imagem da pilha de recuo com o rótulo «Bitter» por cima seria uma mentira
     * em PNG. Foi esta guarda que apanhou as aspas do `style` na primeira ronda.
     */
    const usadas = [...instrumentos.map((i) => i.nome), ...prosas.map((x) => x.nome)];
    const emFalta = await p.evaluate((ns) => ns.filter(
      (f) => !document.fonts.check(`600 15px "${f}"`)), usadas);
    if (emFalta.length) throw new Error('não carregaram: ' + emFalta.join(', '));
    console.log(`  guarda: ${usadas.join(', ')} carregaram`);
    const cru = await p.screenshot({ fullPage: true });
    const bruto = path.join(CAPTURAS, 'algarismos-13-5px-1x.png');
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
    await p2.screenshot({ path: path.join(ESTUDO, 'PRANCHA-2-ALGARISMOS.png'), fullPage: true });
    const b = fs.statSync(path.join(ESTUDO, 'PRANCHA-2-ALGARISMOS.png')).size;
    console.log(`  PRANCHA-2-ALGARISMOS.png  ${(b / 1048576).toFixed(2)} MB (ampliada 4×, sem interpolação)`);
    await ctx2.close();
  }

  await navegador.close();
  srv.close();
}

principal().catch((e) => { console.error(e); process.exit(1); });
