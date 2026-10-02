/** P4-c (02.10.2026): as capturas do cartão do índice de dívida de Évora, a 390 e a 1 280 px, nas duas edições, sobre
 * a construção da cabeça atual, com o aparelho claro. O manifesto guarda a cabeça da construção, o sha256 de cada
 * imagem e o que o cartão diz: a unidade, a linha do estado e o teto.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/p4-2026-10-02/captar-p4-c.mjs
 *   (sobre `dist/`, que tem de ser uma construção da cabeça atual). Sai 0 sem problemas; 1 com a lista deles. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const dist = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const pasta = 'design/especime-v3/medicoes/p4-2026-10-02';
const saida = 'design/especime-v3/capturas/p4-2026-10-02';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}).`);
const rotas = { pt: '/municipios/evora/', en: '/en/municipalities/evora/' };
const ID = 'evora-indice-de-divida-2024';
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
const recusados = [];
const inicio = new Date().toISOString();
try {
  for (const lang of ['pt', 'en']) for (const largura of [390, 1280]) {
    const c = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    await c.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : (recusados.push(r.request().url()), r.abort())));
    const page = await c.newPage();
    page.on('pageerror', (e) => problemas.push(`${lang}/${largura}: ${e.message}`));
    const resposta = await page.goto(origem + rotas[lang], { waitUntil: 'networkidle' });
    if (resposta.status() !== 200) problemas.push(`${lang}/${largura}: HTTP ${resposta.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const cartao = page.locator(`[data-cartao-medida="${ID}"]`);
    const diz = await cartao.evaluate((el) => {
      const t = (n) => (n?.textContent ?? '').replace(/\s+/g, ' ').trim();
      return {
        valor: t(el.querySelector('.cartao-medida-num')),
        unidade: t(el.querySelector('.cartao-medida-valor .cartao-medida-unidade')),
        estado: t(el.querySelector('[data-regua="limite"] [data-voz]')),
        teto: t(el.querySelector('[data-regua="limite"] [data-claim]')),
        teto_linha: el.querySelector('[data-regua="limite"] [data-claim]')?.getAttribute('data-claim') ?? null,
        marcas_da_fonte: el.querySelectorAll('.src-chip').length,
        dobra: t(el.querySelector('[data-cartao-dobra] .cartao-medida-frase')),
      };
    });
    if (!diz.unidade || !diz.estado || !diz.teto) problemas.push(`${lang}/${largura}: o cartão não diz a unidade, o estado ou o teto`);
    const ficheiro = `${saida}/p4-c-cartao-indice-evora-${lang}-${largura}.png`;
    await cartao.scrollIntoViewIfNeeded();
    const bytes = await cartao.screenshot({ path: ficheiro });
    resultados.push({ ficheiro, rota: rotas[lang], lang, largura, diz, sha256: createHash('sha256').update(bytes).digest('hex') });
    await c.close();
    console.log(`P4-c: o cartão de Évora, ${lang}, ${largura} px: ${diz.valor} ${diz.unidade} · ${diz.estado} ${diz.teto}.`);
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'P4-c', cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), capturas: resultados.length, pedidos_recusados_para_fora: recusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-p4-c.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`P4-c: ${resultados.length} capturas, ${problemas.length} problemas.`);
for (const p of problemas) console.log(`  ${p}`);
process.exitCode = problemas.length ? 1 : 0;
