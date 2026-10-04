/** R2-b (04.10.2026): as capturas das páginas que mudaram na passagem de correção, a 390 e a 1 280 px, nas duas edições,
 * sobre a construção da cabeça atual, com o aparelho claro. Cada captura começa no elemento que mudou (o cartão da quota
 * das exportações, a faixa dos 27 dos preços da habitação, os cartões com o termo explicado, o nome de nível dos
 * combustíveis, a dobra da dívida de Évora, a ressalva do recibo do salário mínimo e as origens do recibo da disparidade
 * salarial), tem no máximo 1 600 px de altura, e as dobras dos cartões capturados abrem-se antes. O manifesto guarda a
 * cabeça da construção, o sha256 de cada imagem e o que cada elemento âncora diz, lido do documento.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r2-2026-10-03/captar-r2b.mjs
 *   (sobre `dist/`, que tem de ser uma construção da cabeça atual). Sai 0 sem problemas; 1 com a lista deles. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const dist = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const pasta = 'design/especime-v3/medicoes/r2-2026-10-03';
const saida = 'design/especime-v3/capturas/r2-2026-10-03';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}).`);
const PAGINAS = [
  { nome: 'uniao-cartao', rotas: { pt: '/uniao-europeia/', en: '/en/european-union/' }, ancora: 'li.cartao[data-cartao="desempenho-das-exportacoes-2025"]' },
  { nome: 'uniao-faixa', rotas: { pt: '/uniao-europeia/', en: '/en/european-union/' }, ancora: 'article.paises-medida[data-faixa-paises="precos-da-habitacao-2025-paises"]' },
  { nome: 'estado', rotas: { pt: '/estado-e-economia/', en: '/en/state-and-economy/' }, ancora: 'article.cartao-medida[data-cartao-medida="desempenho-das-exportacoes-2025"]' },
  { nome: 'area-vab', rotas: { pt: '/areas/economia-e-coesao-territorial/', en: '/en/areas/economia-e-coesao-territorial/' }, ancora: 'article.cartao-medida:has([data-termo-na-dobra="vab"])' },
  { nome: 'area-ppc', rotas: { pt: '/areas/economia-e-coesao-territorial/', en: '/en/areas/economia-e-coesao-territorial/' }, ancora: 'article.cartao-medida:has([data-termo-na-dobra="paridade-do-poder-de-compra"])' },
  { nome: 'area-reexpressa', rotas: { pt: '/areas/economia-e-coesao-territorial/', en: '/en/areas/economia-e-coesao-territorial/' }, ancora: 'article.cartao-medida:has([data-termo-na-dobra="reexpressa"])' },
  { nome: 'area-fator', rotas: { pt: '/areas/trabalho-solidariedade-e-seguranca-social/', en: '/en/areas/trabalho-solidariedade-e-seguranca-social/' }, ancora: 'article.cartao-medida:has([data-termo-na-dobra="fator-de-sustentabilidade"])' },
  { nome: 'precos', rotas: { pt: '/precos/', en: '/en/prices/' }, ancora: 'article.cartao-medida[data-cartao-medida="ipc-combustiveis-variacao-homologa"]' },
  { nome: 'evora', rotas: { pt: '/municipios/evora/', en: '/en/municipalities/evora/' }, ancora: 'article.cartao-medida[data-medida-chave="divida"]' },
  { nome: 'recibo-salario', rotas: { pt: '/livro-razao/retribuicao-minima-mensal-garantida-continente-2026/', en: '/en/ledger/retribuicao-minima-mensal-garantida-continente-2026/' }, ancora: 'p.linha-alcance' },
  { nome: 'recibo-disparidade', rotas: { pt: '/livro-razao/disparidade-salarial-entre-sexos-2024/', en: '/en/ledger/disparidade-salarial-entre-sexos-2024/' }, ancora: '[data-definicao="disparidade-salarial-entre-sexos-2024"]' },
];
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
  for (const p of PAGINAS) for (const lang of ['pt', 'en']) for (const largura of [390, 1280]) {
    const c = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    await c.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : (recusados.push(r.request().url()), r.abort())));
    const page = await c.newPage();
    page.on('pageerror', (e) => problemas.push(`${p.nome}/${lang}/${largura}: ${e.message}`));
    const resposta = await page.goto(origem + p.rotas[lang], { waitUntil: 'networkidle' });
    if (resposta.status() !== 200) problemas.push(`${p.nome}/${lang}/${largura}: HTTP ${resposta.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const diz = await page.evaluate((seletor) => {
      const el = document.querySelector(seletor);
      if (!el) return { seletor, falta: true };
      for (const d of document.querySelectorAll('details')) d.setAttribute('open', '');
      return { seletor, texto: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 600) };
    }, p.ancora);
    if (diz.falta) problemas.push(`${p.nome}/${lang}/${largura}: falta a âncora ${p.ancora}`);
    let y = 0;
    const caixa = await page.locator(p.ancora).first().boundingBox();
    if (!caixa) problemas.push(`${p.nome}/${lang}/${largura}: a âncora ${p.ancora} não tem caixa`);
    else y = Math.max(0, Math.floor(caixa.y + (await page.evaluate(() => window.scrollY)) - 24));
    const altura = await page.evaluate(() => document.documentElement.scrollHeight);
    const clip = { x: 0, y, width: largura, height: Math.max(1, Math.min(1600, altura - y)) };
    const ficheiro = `${saida}/r2b-${p.nome}-${lang}-${largura}.png`;
    const bytes = await page.screenshot({ path: ficheiro, fullPage: true, clip });
    resultados.push({ ficheiro, pagina: p.nome, rota: p.rotas[lang], lang, largura, recorte: clip, diz, sha256: createHash('sha256').update(bytes).digest('hex') });
    await c.close();
    console.log(`R2-b: ${p.nome}, ${lang}, ${largura} px: ${String(diz.texto ?? '').slice(0, 140)}.`);
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'R2-b', cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), capturas: resultados.length, pedidos_recusados_para_fora: recusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-r2b.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`R2-b: ${resultados.length} capturas, ${problemas.length} problemas.`);
for (const p of problemas) console.log(`  ${p}`);
process.exitCode = problemas.length ? 1 : 0;
