/**
 * RP4-c: as capturas e as medidas da legibilidade do desenho das séries, sobre a construção local, nas duas edições e
 * nas cinco larguras (o ponto 5 do mandato e o §2 do brief: «a legibilidade medida nas cinco larguras, e em 390 px a
 * decisão escrita de se o toque precisa do caminho 2»). Não pertence à cadeia do `verify` e não escreve no `dist/`:
 * serve o `dist/` por um servidor local efémero, com o Chromium sem cabeça, e recusa tudo o que não venha da origem.
 *
 * As rotas: a primeira página (o desenho da inflação), a página dos preços (os seis cartões com série) e o recibo da
 * inflação. Em cada captura mede, por desenho: a largura no ecrã e a escala do desenho; o corpo da letra dos eixos e da
 * etiqueta no ecrã (12 × a escala); o menor espaço entre duas etiquetas do eixo do tempo, no ecrã; se alguma etiqueta do
 * tempo sai do desenho; a largura no ecrã da zona de leitura mais estreita e da mais larga; e quantas zonas um rato
 * alcança, passando de píxel em píxel pela largura do campo (as zonas alcançáveis). Mede também se a página transborda.
 *
 * A LEITURA DE UM PONTO, PROVADA COM O RATO. Numa largura de rato (1 280), o guião põe o rato num píxel do campo do
 * desenho da primeira página (e do primeiro cartão da página dos preços), espera dois fotogramas e exige que fique acesa
 * exatamente uma leitura, a da zona que contém o píxel do rato, com a linha, o ponto marcado e a etiqueta à vista, a
 * etiqueta dentro do desenho e com o valor e o período do mesmo ponto; e, com o rato fora, nenhuma. Num contexto de toque
 * (390, `hasTouch`, `isMobile`), a consulta `(hover: hover) and (pointer: fine)` não casa, e o mesmo gesto não acende
 * nada: sem rato o desenho fica como estava. As capturas com o rato sobre um ponto ficam com o prefixo `rato-`.
 *
 * AS PLANTAS, no navegador e nunca no ficheiro: a etiqueta escondida por uma folha posta na página (a prova do rato tem
 * de falhar); a regra de mostrar posta fora da consulta do rato (a prova do toque tem de falhar); e um desenho mais
 * largo do que o ecrã (o transbordo tem de ser visto).
 *
 * Uso: node design/especime-v3/medicoes/rp4c-2026-10-05/captar-rp4c.mjs [--json capturas.json]   (na raiz, depois do build)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

const DIST = path.resolve('dist');
const AQUI = path.dirname(new URL(import.meta.url).pathname);
const CAP = 'design/especime-v3/capturas/rp4c-2026-10-05';
const argumento = (nome) => { const i = process.argv.indexOf(nome); return i > 1 ? process.argv[i + 1] : null; };
const SAIDA = argumento('--json') ?? 'capturas.json';
const versao = JSON.parse(await fs.readFile(path.join(DIST, 'version.json'), 'utf8'));
await fs.mkdir(CAP, { recursive: true });
const ROTAS = [
  ['primeira', '/', '/en/'],
  ['precos', '/precos/', '/en/prices/'],
  ['recibo-da-inflacao', '/livro-razao/series/serie-ipc-variacao-homologa/', '/en/ledger/series/serie-ipc-variacao-homologa/'],
];
const LARGURAS = [390, 768, 1024, 1280, 1600];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (req, res) => {
  try {
    let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!f.startsWith(DIST + path.sep) && f !== DIST) throw Error('fora');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    res.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    res.end(await fs.readFile(f));
  } catch { res.writeHead(404).end(); }
});
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch({ headless: true });
const sha = (b) => createHash('sha256').update(b).digest('hex');
const capturas = []; const erros = []; const plantas = []; const provas = []; const extras = [];

async function abre(rota, largura, opcoes = {}) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light', ...opcoes });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : r.abort()));
  const pagina = await ctx.newPage();
  const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
  if (resposta.status() !== 200) throw Error(`página não encontrada: ${rota}`);
  await pagina.evaluate(() => document.fonts.ready);
  return { ctx, pagina };
}

/** As medidas de cada desenho da página, no ecrã. */
const medir = () => {
  const desenhos = [...document.querySelectorAll('svg[data-forma="serie-do-pais"]')].map((svg) => {
    const caixa = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const escala = caixa.width / vb.width;
    const tempo = [...svg.querySelectorAll('[data-eixo="tempo"] text')].map((t) => t.getBoundingClientRect());
    const espacos = tempo.slice(1).map((r, i) => r.left - tempo[i].right);
    const foraDoDesenho = tempo.filter((r) => r.left < caixa.left - 0.5 || r.right > caixa.right + 0.5).length;
    const grupos = [...svg.querySelectorAll(':scope > g:not([data-eixo])')];
    const zonas = grupos.map((g) => g.querySelector('rect').getBoundingClientRect());
    /* AS ZONAS ALCANÇÁVEIS: o rato passa de píxel em píxel, no meio de cada píxel, pela largura do campo; conta-se
       quantas zonas diferentes ficam debaixo dele. */
    let alcancaveis = 0;
    if (zonas.length) {
      const vistas = new Set();
      let k = 0;
      for (let x = Math.floor(zonas[0].left) + 0.5; x <= zonas[zonas.length - 1].right; x += 1) {
        while (k < zonas.length - 1 && x >= zonas[k].right) k++;
        if (x >= zonas[k].left && x < zonas[k].right) vistas.add(k);
      }
      alcancaveis = vistas.size;
    }
    const larguras = zonas.map((z) => z.width).sort((a, b) => a - b);
    return {
      series: svg.getAttribute('data-series'), largura_no_ecra: caixa.width, escala,
      letra_dos_eixos_px: 12 * escala, menor_espaco_do_tempo_px: espacos.length ? Math.min(...espacos) : null,
      etiquetas_do_tempo: tempo.length, etiquetas_fora_do_desenho: foraDoDesenho,
      zonas: zonas.length, zona_mais_estreita_px: larguras[0] ?? null, zona_mais_larga_px: larguras[larguras.length - 1] ?? null,
      zonas_alcancaveis: alcancaveis,
      /* Para a decisão do toque: um desenho dentro de uma ligação abre o recibo com um toque, e um arrasto para ler
         competiria com esse toque e com o deslizar da página. */
      dentro_de_uma_ligacao: Boolean(svg.closest('a')),
      legenda_da_unidade: svg.parentElement?.querySelector('[data-serie-unidade-legenda]')?.textContent?.trim() ?? null,
    };
  });
  const transborda = document.documentElement.scrollWidth > window.innerWidth + 1;
  return { desenhos, transborda };
};

/**
 * A LEITURA DE UM PONTO COM O RATO. O rato vai a um píxel do campo (o meio do píxel que contém o meio da zona pedida),
 * espera dois fotogramas (o Chromium aplica o `:hover` no fotograma seguinte ao movimento, e uma leitura logo a seguir
 * ainda via o estado anterior) e lê quais leituras estão acesas: tem de ser exatamente uma, a da zona que contém o
 * píxel do rato, com a linha, o ponto marcado e a etiqueta à vista, a etiqueta dentro do desenho e a dizer o valor e o
 * período desse ponto. Com o rato fora do desenho, nenhuma. Devolve o que se viu em cada momento.
 */
async function lerPonto(pagina, seletor, alvo) {
  const dois = () => pagina.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
  const sitio = await pagina.evaluate(({ seletor, alvo }) => {
    const svg = document.querySelector(seletor);
    svg.scrollIntoView({ block: 'center' });
    const grupos = [...svg.querySelectorAll(':scope > g:not([data-eixo])')];
    const i = alvo === 'ultimo' ? grupos.length - 1 : Math.floor(grupos.length / 2);
    const z = grupos[i].querySelector('rect').getBoundingClientRect();
    return { pedida: i, x: Math.floor(z.left + z.width / 2) + 0.5, y: z.top + z.height / 2 };
  }, { seletor, alvo });
  const ver = () => pagina.evaluate(({ seletor, x }) => {
    const svg = document.querySelector(seletor);
    const caixa = svg.getBoundingClientRect();
    /* Acesa: a visibilidade calculada e a exibição (uma folha que ponha `display: none` também esconde). */
    const acesa = (el) => getComputedStyle(el).visibility === 'visible' && getComputedStyle(el).display !== 'none';
    const grupos = [...svg.querySelectorAll(':scope > g:not([data-eixo])')];
    const acesas = grupos.map((g, i) => ({ g, i })).filter(({ g }) => acesa(g.querySelector('text')) || acesa(g.querySelector('circle')) || acesa(g.querySelector('line')));
    const lida = acesas.length === 1 ? (() => {
      const { g, i } = acesas[0];
      const t = g.querySelector('text'); const et = t.getBoundingClientRect(); const z = g.querySelector('rect').getBoundingClientRect();
      return {
        zona: i, linha: acesa(g.querySelector('line')), ponto: acesa(g.querySelector('circle')), etiqueta: acesa(t),
        zona_contem_o_rato: x >= z.left - 0.5 && x <= z.right + 0.5,
        etiqueta_no_desenho: et.width > 0 && et.left >= caixa.left - 0.5 && et.right <= caixa.right + 0.5 && et.top >= caixa.top - 0.5 && et.bottom <= caixa.bottom + 0.5,
        valor: g.querySelector('[data-ponto]').textContent, periodo: g.querySelector('[data-ponto-periodo]').textContent,
        chave_do_valor: g.querySelector('[data-ponto]').getAttribute('data-ponto'), chave_do_periodo: g.querySelector('[data-ponto-periodo]').getAttribute('data-ponto-periodo'),
        corpo_da_etiqueta_px: parseFloat(getComputedStyle(t).fontSize) * (caixa.width / svg.viewBox.baseVal.width),
      };
    })() : null;
    return { acesas: acesas.length, lida, rato_casa: matchMedia('(hover: hover) and (pointer: fine)').matches };
  }, { seletor, x: sitio.x });
  await pagina.mouse.move(1, 1); await dois();
  const antes = await ver();
  await pagina.mouse.move(sitio.x, sitio.y); await dois();
  const durante = await ver();
  await pagina.mouse.move(1, 1); await dois();
  const depois = await ver();
  return { zona_pedida: sitio.pedida, rato: { x: sitio.x, y: sitio.y }, antes, durante, depois };
}
const leituraCerta = (r) => r.antes.acesas === 0 && r.durante.acesas === 1 && r.durante.lida.linha && r.durante.lida.ponto && r.durante.lida.etiqueta
  && r.durante.lida.zona_contem_o_rato && r.durante.lida.etiqueta_no_desenho && r.durante.lida.chave_do_valor === r.durante.lida.chave_do_periodo && r.depois.acesas === 0;

try {
  for (const [nome, rotaPt, rotaEn] of ROTAS) {
    for (const [lang, rota] of [['pt', rotaPt], ['en', rotaEn]]) {
      for (const largura of LARGURAS) {
        const { ctx, pagina } = await abre(rota, largura);
        const ficheiro = `${CAP}/${nome}-${lang}-${largura}.png`;
        const imagem = await pagina.screenshot({ path: ficheiro, fullPage: true });
        const medidas = await pagina.evaluate(medir);
        if (medidas.transborda) erros.push(`${ficheiro}: a página transborda`);
        for (const d of medidas.desenhos) if (d.etiquetas_fora_do_desenho) erros.push(`${ficheiro}: ${d.series} tem etiquetas do tempo fora do desenho`);
        capturas.push({ ficheiro: path.basename(ficheiro), rota, lang, largura, sha256: sha(imagem), bytes: imagem.length, ...medidas });
        await ctx.close();
      }
    }
  }
  /* A LEITURA DE UM PONTO, COM O RATO, a 1 280 nas duas edições: a primeira página (o ponto do meio da série) e o
     primeiro cartão da página dos preços (o último ponto), com a captura do desenho com a leitura à vista. */
  for (const [lang, rota, nomeDaRota, seletor, alvo] of [
    ['pt', '/', 'primeira', '[data-bloco="precos"] svg[data-forma="serie-do-pais"]', 'meio'],
    ['en', '/en/', 'primeira', '[data-bloco="precos"] svg[data-forma="serie-do-pais"]', 'meio'],
    ['pt', '/precos/', 'precos', '[data-cartao-medida="ipc-variacao-homologa"] svg[data-forma="serie-do-pais"]', 'ultimo'],
  ]) {
    const { ctx, pagina } = await abre(rota, 1280);
    const r = await lerPonto(pagina, seletor, alvo);
    const ok = r.antes.rato_casa && leituraCerta(r);
    if (!ok) erros.push(`a leitura de um ponto com o rato falhou em ${rota} (${lang})`);
    /* a captura com a leitura à vista: o rato volta ao píxel, espera dois fotogramas, e recorta-se o pai do desenho */
    await pagina.mouse.move(r.rato.x, r.rato.y);
    await pagina.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
    const pai = await pagina.$(`${seletor.replace(/ svg\[data-forma="serie-do-pais"\]$/, '')} svg[data-forma="serie-do-pais"]`);
    const ficheiro = `${CAP}/rato-${nomeDaRota}-${lang}-1280.png`;
    const imagem = await (await pai.evaluateHandle((s) => s.parentElement)).asElement().screenshot({ path: ficheiro });
    const inteira = `${CAP}/rato-${nomeDaRota}-${lang}-1280-ecra.png`;
    const imagemInteira = await pagina.screenshot({ path: inteira });
    provas.push({ prova: 'rato', rota, lang, largura: 1280, passou: ok, ...r, captura: path.basename(ficheiro), sha256: sha(imagem), captura_do_ecra: path.basename(inteira), sha256_do_ecra: sha(imagemInteira) });
    await ctx.close();
  }
  /* A SEGUNDA FORMA DO PONTO 1, À VISTA: as rotas que o brief pede só têm séries em «%»; o primeiro cartão com a
     legenda da unidade por extenso, na página dos salários e pensões, nas duas edições, recortado. */
  for (const [lang, rota] of [['pt', '/salarios-pensoes-e-apoios/'], ['en', '/en/pay-pensions-and-benefits/']]) {
    const { ctx, pagina } = await abre(rota, 1280);
    const legenda = await pagina.$('[data-serie-unidade-legenda]');
    if (!legenda) { erros.push(`nenhuma legenda da unidade em ${rota}`); await ctx.close(); continue; }
    const porta = await legenda.evaluateHandle((l) => l.closest('a') ?? l.parentElement);
    await porta.asElement().scrollIntoViewIfNeeded();
    const ficheiro = `${CAP}/legenda-salarios-${lang}-1280.png`;
    const imagem = await porta.asElement().screenshot({ path: ficheiro });
    const texto = await legenda.evaluate((l) => l.textContent.trim());
    extras.push({ ficheiro: path.basename(ficheiro), rota, lang, largura: 1280, sha256: sha(imagem), legenda: texto });
    await ctx.close();
  }
  /* SEM RATO, NADA MUDA: a 390, num contexto de toque, a consulta do rato não casa e o mesmo gesto não acende nada. */
  for (const [lang, rota] of [['pt', '/'], ['en', '/en/']]) {
    const { ctx, pagina } = await abre(rota, 390, { hasTouch: true, isMobile: true });
    const r = await lerPonto(pagina, '[data-bloco="precos"] svg[data-forma="serie-do-pais"]', 'meio');
    const ok = !r.antes.rato_casa && r.antes.acesas === 0 && r.durante.acesas === 0 && r.depois.acesas === 0;
    if (!ok) erros.push(`no toque, a leitura de um ponto acendeu-se em ${rota} (${lang})`);
    provas.push({ prova: 'toque', rota, lang, largura: 390, passou: ok, ...r });
    await ctx.close();
  }
  /* AS PLANTAS, no navegador. */
  {
    const { ctx, pagina } = await abre('/', 1280);
    await pagina.addStyleTag({ content: '.serie-do-pais > g:not([data-eixo]) > text { display: none !important; }' });
    const r = await lerPonto(pagina, '[data-bloco="precos"] svg[data-forma="serie-do-pais"]', 'meio');
    plantas.push({ nome: 'a etiqueta escondida por uma folha posta na página', mordeu: !leituraCerta(r) });
    await ctx.close();
  }
  {
    const { ctx, pagina } = await abre('/', 390, { hasTouch: true, isMobile: true });
    await pagina.addStyleTag({ content: '.serie-do-pais > g:not([data-eixo]):hover > * { visibility: visible; }' });
    const r = await lerPonto(pagina, '[data-bloco="precos"] svg[data-forma="serie-do-pais"]', 'meio');
    plantas.push({ nome: 'a regra de mostrar fora da consulta do rato, num toque', mordeu: r.durante.acesas > 0 });
    await ctx.close();
  }
  {
    const { ctx, pagina } = await abre('/precos/', 390);
    await pagina.addStyleTag({ content: '.serie-do-pais { max-width: none !important; width: 720px !important; }' });
    const m = await pagina.evaluate(medir);
    plantas.push({ nome: 'um desenho mais largo do que o ecrã', mordeu: m.transborda });
    await ctx.close();
  }
} finally {
  await navegador.close();
  servidor.close();
}
const mordidas = plantas.filter((p) => p.mordeu).length;
await fs.writeFile(path.join(AQUI, SAIDA), JSON.stringify({
  commit: versao.commit, construido_em: versao.construido_em, larguras: LARGURAS,
  capturas: capturas.length, erros, provas, plantas, plantas_mordidas: mordidas, lista: capturas, extras,
}, null, 2) + '\n');
console.log(`${capturas.length} capturas · ${provas.length} provas (${provas.filter((p) => p.passou).length} passaram) · ${mordidas} de ${plantas.length} plantas mordidas · ${erros.length} erro(s)`);
for (const e of erros) console.error(`  ✗ ${e}`);
if (erros.length || mordidas !== plantas.length || provas.some((p) => !p.passou)) process.exit(1);
