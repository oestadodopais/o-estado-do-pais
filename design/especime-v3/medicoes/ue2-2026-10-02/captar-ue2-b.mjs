/** UE2-b: as capturas da passagem, refeitas sobre a construção da cabeça atual: a página da União e a do emprego, a 390
 * e a 1 280 px, nas duas edições; e, de perto, o que a passagem mudou: a faixa dos inquilinos a preço de mercado e a da
 * inflação com a definição por baixo do nome, a definição do saldo da balança corrente aberta pela porta do seu cartão
 * na página da União, e a do cartão da taxa de atividade aberta na página do emprego. O servidor efémero e o bloqueio
 * dos pedidos de fora são os do captor do UE2 (`captar-ue2.mjs`, nesta pasta). O manifesto guarda a cabeça da
 * construção, o resumo de cada imagem e as medidas de cada página (a altura, o transbordo horizontal, as faixas da
 * secção dos países e quantas dizem a definição) e, nas capturas de perto, o texto da definição mostrada.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/ue2-2026-10-02/captar-ue2-b.mjs
 *   (sobre `dist/`, que tem de ser uma construção da cabeça atual)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const dist = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const pasta = 'design/especime-v3/medicoes/ue2-2026-10-02';
const saida = 'design/especime-v3/capturas/ue2-2026-10-02';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}).`);
const larguras = [390, 1280];
const rotas = {
  uniao: { pt: '/uniao-europeia/', en: '/en/european-union/' },
  emprego: { pt: '/emprego/', en: '/en/employment/' },
};
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
const medir = () => ({
  janela: innerWidth,
  documento: document.documentElement.scrollWidth,
  altura: document.documentElement.scrollHeight,
  h1: document.querySelector('main h1')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
  faixas_dos_paises: document.querySelectorAll('[data-faixa-paises]').length,
  faixas_com_definicao: document.querySelectorAll('[data-faixa-paises] > [data-faixa-o-que-conta]').length,
  descricao: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
});

const contexto = async (largura) => {
  const c = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
  await c.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (pedidosRecusados.push(rota.request().url()), rota.abort())));
  return c;
};
const guarda = (bytes, ficheiro, registo) => {
  resultados.push({ ficheiro, ...registo, sha256: createHash('sha256').update(bytes).digest('hex') });
};
const texto = (e) => e.textContent.replace(/\s+/g, ' ').trim();

try {
  /* AS PÁGINAS INTEIRAS */
  for (const [pagina, porLingua] of Object.entries(rotas)) for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const c = await contexto(largura);
    const page = await c.newPage();
    page.on('pageerror', (e) => problemas.push(`${pagina}/${lang}/${largura}: ${e.message}`));
    const resposta = await page.goto(origem + porLingua[lang], { waitUntil: 'networkidle' });
    if (resposta.status() !== 200) problemas.push(`${pagina}/${lang}/${largura}: HTTP ${resposta.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const medidas = await page.evaluate(medir);
    if (medidas.documento > largura + 1) problemas.push(`${pagina}/${lang}/${largura}: transbordo horizontal`);
    const ficheiro = `${saida}/ue2-b-${pagina}-${lang}-${largura}.png`;
    const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
    guarda(bytes, ficheiro, { tipo: 'pagina', rota: porLingua[lang], lang, largura, medidas });
    await c.close();
    console.log(`UE2-b: ${pagina}, ${lang}, ${largura} px.`);
  }
  /* DE PERTO: duas faixas com a definição por baixo do nome, nas duas larguras */
  for (const sid of ['sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-paises', 'ihpc-variacao-homologa-paises']) for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const c = await contexto(largura);
    const page = await c.newPage();
    await page.goto(origem + rotas.uniao[lang], { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const faixa = page.locator(`[data-faixa-paises="${sid}"]`);
    const definicao = await faixa.locator('[data-faixa-o-que-conta]').evaluate(texto);
    const ficheiro = `${saida}/ue2-b-faixa-${sid.replace(/-2025-paises$|-paises$/, '')}-${lang}-${largura}.png`;
    const bytes = await faixa.screenshot({ path: ficheiro });
    guarda(bytes, ficheiro, { tipo: 'faixa', serie: sid, lang, largura, definicao });
    await c.close();
  }
  /* DE PERTO: a definição do saldo da balança corrente, aberta pela porta do seu cartão na página da União */
  for (const lang of ['pt', 'en']) {
    const c = await contexto(390);
    const page = await c.newPage();
    const id = 'saldo-da-balanca-corrente-2025';
    await page.goto(`${origem}${rotas.uniao[lang]}#m-${id}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const dobra = page.locator(`[data-leitura="${id}"]`);
    const aberta = await dobra.evaluate((d) => d.open);
    if (!aberta) problemas.push(`definição/uniao/${lang}: a leitura não abriu`);
    const definicao = await dobra.locator('.dobra-definicao').evaluate(texto);
    const ficheiro = `${saida}/ue2-b-definicao-uniao-${lang}-390.png`;
    const bytes = await dobra.screenshot({ path: ficheiro });
    guarda(bytes, ficheiro, { tipo: 'definicao', pagina: 'uniao', linha: id, lang, largura: 390, aberta, definicao });
    await c.close();
  }
  /* DE PERTO: a dobra do cartão da taxa de atividade, aberta na página do emprego, nas duas larguras */
  for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const c = await contexto(largura);
    const page = await c.newPage();
    const id = 'taxa-de-actividade-2025';
    await page.goto(origem + rotas.emprego[lang], { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const cartao = page.locator(`[data-cartao-medida="${id}"]`);
    await cartao.locator(`[data-cartao-dobra="${id}"] summary`).click();
    await page.mouse.move(0, 0);
    const aberta = await cartao.locator(`[data-cartao-dobra="${id}"]`).evaluate((d) => d.open);
    if (!aberta) problemas.push(`definição/emprego/${lang}/${largura}: a dobra não abriu`);
    const definicao = await cartao.locator('[data-cartao-definicao]').evaluate(texto);
    const ficheiro = `${saida}/ue2-b-definicao-emprego-${lang}-${largura}.png`;
    const bytes = await cartao.screenshot({ path: ficheiro });
    guarda(bytes, ficheiro, { tipo: 'definicao', pagina: 'emprego', linha: id, lang, largura, aberta, definicao });
    await c.close();
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'UE2-b', cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), larguras, capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-ue2-b.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`UE2-b: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
