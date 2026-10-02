/** UE2: a prova do toque numa marca da secção dos países, numa página construída, com guião e sem guião (o item 2 do
 * brief). Serve `dist/` por um servidor local efémero, bloqueia todos os pedidos de fora, e mede no Chromium sem
 * cabeça, nas duas edições da página da União:
 *
 *   COM GUIÃO, AO DEDO (um contexto com toque, a 390 px): em cada uma das dez faixas, toca a marca do país mais alto, a
 *   de Portugal e a da média da União, e lê que etiquetas ficam à vista: tem de ser uma, a da marca tocada, com o nome
 *   e o valor que o documento já trazia para ela, e a marca tocada leva o anel; um toque fora das faixas esconde-as.
 *   COM GUIÃO, AO RATO (1 280 px): pousa o rato numa marca e lê a etiqueta; tira o rato do desenho e lê que se esconde.
 *   SEM GUIÃO (o JavaScript desligado, 390 px): nenhuma etiqueta à vista, a secção sem a marca do guião, e cada lista
 *   dobrada abre com um toque no resumo, nativa, com os 27 países e a média da União à vista.
 *
 * O conhecido-positivo é o próprio detetor: antes de cada toque, a etiqueta da marca está escondida, e depois está à
 * vista; um detetor que lesse sempre «à vista» ou sempre «escondida» falhava uma das duas leituras.
 *
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/ue2-2026-10-02/toque-ue2.mjs
 *   (sobre `dist/`, que tem de ser uma construção da cabeça atual; escreve `toque.json` nesta pasta)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const pasta = 'design/especime-v3/medicoes/ue2-2026-10-02';
const dist = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}).`);
const rotas = { pt: '/uniao-europeia/', en: '/en/european-union/' };
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    let ficheiro = path.resolve(dist, '.' + decodeURIComponent(new URL(pedido.url, 'http://localhost').pathname));
    if (!ficheiro.startsWith(dist + path.sep) && ficheiro !== dist) throw new Error('Caminho inválido.');
    if ((await fs.stat(ficheiro)).isDirectory()) ficheiro = path.join(ficheiro, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(ficheiro)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(ficheiro));
  } catch { resposta.writeHead(404).end(); }
});
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch();
const pedidosRecusados = [];
const problemas = [];
const resultado = { bloco: 'UE2', cabeca, construcao: { commit: versao.commit, construido_em: versao.construido_em }, inicio: new Date().toISOString(), edicoes: {} };

/** As etiquetas à vista de um desenho, e o estado da marca tocada, lidos no navegador. */
const leDesenho = (sid) => {
  const d = document.querySelector(`[data-toques="${sid}"]`);
  const visiveis = [...d.querySelectorAll('[data-toque-de]')].filter((e) => getComputedStyle(e).display !== 'none' && !e.hidden);
  return {
    visiveis: visiveis.map((e) => ({ de: e.getAttribute('data-toque-de'), texto: e.textContent.replace(/\s+/g, ' ').trim() })),
    tocadas: [...d.querySelectorAll('[data-tocada]')].map((m) => m.getAttribute('data-faixa-marca')),
  };
};
/** O texto que o documento traz para a etiqueta de uma marca (o que o toque tem de mostrar). */
const textoDaEtiqueta = (id) => {
  const e = [...document.querySelectorAll('[data-toque-de]')].find((x) => x.getAttribute('data-toque-de') === id);
  return e ? e.textContent.replace(/\s+/g, ' ').trim() : null;
};

try {
  for (const lang of ['pt', 'en']) {
    const ed = { dedo: [], rato: null, sem_guiao: null };
    /* COM GUIÃO, AO DEDO */
    {
      const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : (pedidosRecusados.push(r.request().url()), r.abort())));
      const page = await contexto.newPage();
      page.on('pageerror', (e) => problemas.push(`${lang}/dedo: ${e.message}`));
      await page.goto(origem + rotas[lang], { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const guiao = await page.evaluate(() => document.querySelector('[data-paises]')?.getAttribute('data-toque'));
      const series = await page.evaluate(() => [...document.querySelectorAll('[data-faixa-paises]')].map((f) => f.getAttribute('data-faixa-paises')));
      for (const sid of series) {
        /* As três marcas a tocar: o país mais alto (a ponta «alto»), Portugal e a média da União. */
        const alvos = await page.evaluate((s) => {
          const f = document.querySelector(`[data-faixa-paises="${s}"]`);
          const alto = f.querySelector('[data-faixa-ponta="alto"] [data-pais]')?.getAttribute('data-pais');
          return [alto, 'PT', 'EU27_2020'].filter(Boolean).map((g) => `${s}#${g}`);
        }, sid);
        for (const id of alvos) {
          const marca = page.locator(`[data-faixa-marca="${id}"]`);
          await marca.scrollIntoViewIfNeeded();
          const antes = await page.evaluate(leDesenho, sid);
          const esperado = await page.evaluate(textoDaEtiqueta, id);
          const caixa = await marca.boundingBox();
          await page.touchscreen.tap(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
          const depois = await page.evaluate(leDesenho, sid);
          /* UMA MARCA EMPATADA ESTÁ NO MESMO SÍTIO DAS OUTRAS DO SEU VALOR, e a etiqueta de cada uma diz o grupo inteiro:
             o toque pode mostrar a etiqueta de outra marca do grupo, e o que se confere é que o texto à vista é o da
             marca tocada e que a marca do anel está na mesma posição. */
          const mesmaPosicao = await page.evaluate(([a, b]) => {
            const m = (x) => [...document.querySelectorAll('[data-faixa-marca]')].find((e) => e.getAttribute('data-faixa-marca') === x);
            return Boolean(m(a) && m(b) && m(a).getAttribute('style') === m(b).getAttribute('style'));
          }, [id, depois.tocadas[0] ?? '']);
          const certo = depois.visiveis.length === 1 && depois.visiveis[0].texto === esperado && depois.tocadas.length === 1 && mesmaPosicao;
          ed.dedo.push({ marca: id, escondida_antes: !antes.visiveis.some((v) => v.de === id), visiveis_depois: depois.visiveis.length, mostrada: depois.visiveis[0]?.de ?? null, texto: depois.visiveis[0]?.texto ?? null, esperado, anel_na_mesma_posicao: mesmaPosicao, certo });
          if (!certo) problemas.push(`${lang}/dedo: o toque em ${id} mostrou ${JSON.stringify(depois)}`);
        }
      }
      /* Um toque fora das faixas esconde-as todas. */
      await page.locator('h1').scrollIntoViewIfNeeded();
      const h1 = await page.locator('h1').boundingBox();
      await page.touchscreen.tap(h1.x + 5, h1.y + 5);
      const forasVisiveis = await page.evaluate(() => [...document.querySelectorAll('[data-toque-de]')].filter((e) => !e.hidden).length);
      ed.toque_fora = { etiquetas_a_vista: forasVisiveis };
      if (forasVisiveis !== 0) problemas.push(`${lang}/dedo: depois de um toque fora, ${forasVisiveis} etiquetas à vista`);
      ed.guiao = guiao;
      ed.faixas = series.length;
      await contexto.close();
    }
    /* COM GUIÃO, AO RATO */
    {
      const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : (pedidosRecusados.push(r.request().url()), r.abort())));
      const page = await contexto.newPage();
      page.on('pageerror', (e) => problemas.push(`${lang}/rato: ${e.message}`));
      await page.goto(origem + rotas[lang], { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const sid = 'taxa-de-emprego-2025-paises';
      const id = `${sid}#PT`;
      const marca = page.locator(`[data-faixa-marca="${id}"]`);
      await marca.scrollIntoViewIfNeeded();
      const caixa = await marca.boundingBox();
      await page.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
      const pousado = await page.evaluate(leDesenho, sid);
      const esperado = await page.evaluate(textoDaEtiqueta, id);
      await page.mouse.move(caixa.x + caixa.width / 2, caixa.y - 200);
      const fora = await page.evaluate(leDesenho, sid);
      ed.rato = { marca: id, visivel_ao_pousar: pousado.visiveis.map((v) => v.de).join() === id && pousado.visiveis[0]?.texto === esperado, texto: pousado.visiveis[0]?.texto ?? null, visiveis_ao_sair: fora.visiveis.length };
      if (!ed.rato.visivel_ao_pousar || ed.rato.visiveis_ao_sair !== 0) problemas.push(`${lang}/rato: ${JSON.stringify(ed.rato)}`);
      await contexto.close();
    }
    /* SEM GUIÃO */
    {
      const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, javaScriptEnabled: false, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : (pedidosRecusados.push(r.request().url()), r.abort())));
      const page = await contexto.newPage();
      await page.goto(origem + rotas[lang], { waitUntil: 'networkidle' });
      const estado = await page.evaluate(() => ({
        guiao: document.querySelector('[data-paises]')?.getAttribute('data-toque') ?? null,
        etiquetas: document.querySelectorAll('[data-toque-de]').length,
        etiquetas_a_vista: [...document.querySelectorAll('[data-toque-de]')].filter((e) => getComputedStyle(e).display !== 'none').length,
        listas: document.querySelectorAll('details[data-lista-paises]').length,
        listas_abertas: document.querySelectorAll('details[data-lista-paises][open]').length,
      }));
      const abertas = [];
      for (const lista of await page.locator('details[data-lista-paises]').all()) {
        await lista.locator('summary').click();
        abertas.push(await lista.evaluate((d) => ({ serie: d.getAttribute('data-lista-paises'), aberta: d.open, itens_a_vista: [...d.querySelectorAll('li')].filter((li) => li.getBoundingClientRect().height > 0).length })));
      }
      ed.sem_guiao = { ...estado, abertas_ao_toque: abertas.filter((a) => a.aberta).length, itens_a_vista_por_lista: [...new Set(abertas.map((a) => a.itens_a_vista))] };
      if (estado.guiao !== null || estado.etiquetas_a_vista !== 0 || estado.listas_abertas !== 0 || abertas.some((a) => !a.aberta || a.itens_a_vista !== 28)) {
        problemas.push(`${lang}/sem guião: ${JSON.stringify(ed.sem_guiao)}`);
      }
      await contexto.close();
    }
    resultado.edicoes[lang] = ed;
    console.log(`UE2 toque: ${lang}, ${ed.dedo.length} toques ao dedo, ${ed.dedo.filter((x) => x.certo).length} certos.`);
  }
} finally {
  await navegador.close();
  servidor.close();
}
resultado.fim = new Date().toISOString();
resultado.pedidos_recusados_para_fora = pedidosRecusados.length;
resultado.problemas = problemas;
await fs.writeFile(`${pasta}/toque.json`, JSON.stringify(resultado, null, 2) + '\n');
console.log(`UE2 toque: ${problemas.length} problema(s).`);
process.exitCode = problemas.length ? 1 : 0;
