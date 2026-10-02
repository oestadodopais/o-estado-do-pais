/** UE2: as capturas da página da União, antes e depois do bloco «a página dos países», nas cinco larguras (390, 768,
 * 1 024, 1 280 e 1 600 px) e nas duas edições; e, depois, uma lista dobrada aberta e o toque numa marca. O servidor
 * efémero e o bloqueio dos pedidos de fora seguem o captor do K2 (`design/especime-v3/medicoes/k2-2026-10-02/
 * captar-k2.mjs`). O manifesto guarda a cabeça da construção, o resumo de cada imagem e as medidas de cada página: a
 * altura, o transbordo horizontal, as faixas da secção dos países, a forma da fila dos 21 cartões (quantas colunas e
 * se corre de lado) e a altura de cada faixa.
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/ue2-2026-10-02/captar-ue2.mjs depois
 *     (sobre `dist/`, que tem de ser uma construção da cabeça atual)
 *   node design/especime-v3/medicoes/ue2-2026-10-02/captar-ue2.mjs antes <pasta da construção de base> <cabeça de base>
 *     (a pasta fica fora do repositório, e o manifesto não a nomeia: guarda só a cabeça que o `version.json` dela diz)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const fase = process.argv[2];
if (!['antes', 'depois'].includes(fase)) throw new Error('Uso: captar-ue2.mjs antes <dist> <cabeça> | depois');
const dist = path.resolve(fase === 'antes' ? process.argv[3] : 'dist');
const cabeca = fase === 'antes' ? process.argv[4] : execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const pasta = 'design/especime-v3/medicoes/ue2-2026-10-02';
const saida = 'design/especime-v3/capturas/ue2-2026-10-02';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (!cabeca || versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça pedida (${cabeca}).`);
const larguras = [390, 768, 1024, 1280, 1600];
const rotas = { pt: '/uniao-europeia/', en: '/en/european-union/' };
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    let ficheiro = path.resolve(dist, '.' + decodeURIComponent(new URL(pedido.url, 'http://localhost').pathname));
    if (!ficheiro.startsWith(dist + path.sep) && ficheiro !== dist) throw new Error('Caminho inválido.');
    if ((await fs.stat(ficheiro)).isDirectory()) ficheiro = path.join(ficheiro, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(ficheiro)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(ficheiro));
  } catch { resposta.writeHead(404).end(); }
});
await fs.mkdir(saida, { recursive: true });
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch();
const resultados = [];
const problemas = [];
const pedidosRecusados = [];
const inicio = new Date().toISOString();

/** As medidas da página, lidas no navegador. */
const medir = () => {
  const fila = document.querySelector('[data-faixa]');
  const estilo = fila ? getComputedStyle(fila) : null;
  const colunas = estilo && estilo.display === 'grid' ? estilo.gridTemplateColumns.split(' ').filter(Boolean).length : null;
  return {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    altura: document.documentElement.scrollHeight,
    h1: document.querySelector('main h1')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    faixas_dos_paises: document.querySelectorAll('[data-faixa-paises]').length,
    alturas_das_faixas: [...document.querySelectorAll('[data-faixa-paises]')].map((f) => Math.round(f.getBoundingClientRect().height)),
    fila: fila
      ? {
          display: estilo.display,
          colunas,
          corre_de_lado: fila.scrollWidth > fila.clientWidth + 1,
          cartoes: fila.querySelectorAll('li.cartao').length,
          altura: Math.round(fila.getBoundingClientRect().height),
        }
      : null,
    definicoes: document.querySelectorAll('.dobra-definicao').length,
  };
};

const contexto = async (largura, extra = {}) => {
  const c = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce', ...extra });
  await c.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (pedidosRecusados.push(rota.request().url()), rota.abort())));
  return c;
};
const guarda = async (bytes, ficheiro, registo) => {
  resultados.push({ ficheiro, ...registo, sha256: createHash('sha256').update(bytes).digest('hex') });
};

try {
  for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const c = await contexto(largura);
    const page = await c.newPage();
    page.on('pageerror', (e) => problemas.push(`${lang}/${largura}: ${e.message}`));
    const resposta = await page.goto(origem + rotas[lang], { waitUntil: 'networkidle' });
    if (resposta.status() !== 200) problemas.push(`${lang}/${largura}: HTTP ${resposta.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const medidas = await page.evaluate(medir);
    if (medidas.documento > largura + 1) problemas.push(`${lang}/${largura}: transbordo horizontal`);
    const ficheiro = `${saida}/${fase}-uniao-${lang}-${largura}.png`;
    const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
    await guarda(bytes, ficheiro, { tipo: 'pagina', rota: rotas[lang], lang, largura, medidas });
    await c.close();
    console.log(`UE2 ${fase}: ${lang}, ${largura} px.`);
  }
  if (fase === 'depois') {
    /* UMA LISTA DOBRADA ABERTA: a dos preços da habitação, que tem pontos com marca da fonte, a 390 e a 1 280 px. */
    for (const lang of ['pt', 'en']) for (const largura of [390, 1280]) {
      const c = await contexto(largura);
      const page = await c.newPage();
      await page.goto(origem + rotas[lang], { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const faixa = page.locator('[data-faixa-paises="precos-da-habitacao-2025-paises"]');
      await faixa.locator('summary').click();
      await page.mouse.move(0, 0);
      const aberta = await faixa.locator('details').evaluate((d) => d.open);
      if (!aberta) problemas.push(`lista/${lang}/${largura}: a lista não abriu`);
      const ficheiro = `${saida}/depois-lista-aberta-${lang}-${largura}.png`;
      const bytes = await faixa.screenshot({ path: ficheiro });
      await guarda(bytes, ficheiro, { tipo: 'lista', serie: 'precos-da-habitacao-2025-paises', lang, largura, aberta });
      await c.close();
    }
    /* O TOQUE NUMA MARCA, ao dedo a 390 px: a Grécia na dívida pública, e Portugal na pobreza ou exclusão, onde a
       etiqueta diz o grupo dos três países com o mesmo valor. */
    for (const lang of ['pt', 'en']) for (const [sid, geo] of [['divida-publica-2025-paises', 'EL'], ['risco-de-pobreza-ou-exclusao-2025-paises', 'PT']]) {
      const c = await contexto(390, { hasTouch: true, isMobile: true });
      const page = await c.newPage();
      await page.goto(origem + rotas[lang], { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const faixa = page.locator(`[data-faixa-paises="${sid}"]`);
      await faixa.scrollIntoViewIfNeeded();
      const caixa = await faixa.locator(`[data-faixa-marca="${sid}#${geo}"]`).boundingBox();
      await page.touchscreen.tap(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
      const visivel = await faixa.evaluate((f) => [...f.querySelectorAll('[data-toque-de]')].filter((e) => !e.hidden).map((e) => e.textContent.replace(/\s+/g, ' ').trim()));
      if (visivel.length !== 1) problemas.push(`toque/${lang}/${sid}: ${visivel.length} etiquetas à vista`);
      const ficheiro = `${saida}/depois-toque-${lang}-390-${geo.toLowerCase()}.png`;
      const bytes = await faixa.screenshot({ path: ficheiro });
      await guarda(bytes, ficheiro, { tipo: 'toque', serie: sid, marca: geo, lang, largura: 390, etiqueta_a_vista: visivel[0] ?? null });
      await c.close();
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'UE2', fase, cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), larguras, capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-${fase}.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`UE2 ${fase}: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
