/** R2 (03.10.2026): as capturas das quatro páginas que o mandato pede, a primeira página, a de Évora, a da União e uma
 * página de assunto (a do emprego), a 390 e a 1 280 px, nas duas edições, sobre a construção da cabeça atual, com o
 * aparelho claro. Em cada página a captura começa no primeiro cartão que mudou de rótulo (a primeira página, que não
 * tem cartões de medida, captura-se do topo; a de Évora, no primeiro dos oito cartões, que são todos do bloco) e tem no
 * máximo 2 400 px de altura (4 800 na de Évora, para os oito cartões caberem); as dobras dos cartões capturados abrem-se
 * antes, para a definição se ver. O manifesto guarda a cabeça da construção, o sha256 de cada imagem e o que
 * cada cartão âncora diz (o nome, a unidade, o estado, a frase da faixa e a dobra), lido do documento.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r2-2026-10-03/captar-r2.mjs
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
  { nome: 'primeira', rotas: { pt: '/', en: '/en/' }, ancora: null, cartoes: [] },
  { nome: 'emprego', rotas: { pt: '/emprego/', en: '/en/employment/' }, ancora: '[data-cartao-medida="taxa-de-emprego-2025"]',
    cartoes: ['[data-cartao-medida="taxa-de-emprego-2025"]', '[data-cartao-medida="jovens-nem-2025"]', '[data-cartao-medida="taxa-de-actividade-2025"]'] },
  { nome: 'evora', rotas: { pt: '/municipios/evora/', en: '/en/municipalities/evora/' }, ancora: 'article.cartao-medida[data-medida-chave]',
    cartoes: ['poderDeCompra', 'empresas', 'divida', 'pmp', 'indice', 'desempregoRegistado', 'ganho', 'populacao'].map((k) => `article.cartao-medida[data-medida-chave="${k}"]`) },
  { nome: 'uniao', rotas: { pt: '/uniao-europeia/', en: '/en/european-union/' }, ancora: '[data-faixa-bloco]',
    cartoes: ['li.cartao[data-cartao="jovens-nem-2025"]', 'li.cartao[data-cartao="custo-unitario-do-trabalho-2025"]'] },
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
    const diz = await page.evaluate((seletores) => {
      const t = (n) => (n?.textContent ?? '').replace(/\s+/g, ' ').trim();
      return seletores.map((s) => {
        const el = document.querySelector(s);
        if (!el) return { seletor: s, falta: true };
        for (const d of el.querySelectorAll('details')) d.setAttribute('open', '');
        return {
          seletor: s,
          nome: t(el.querySelector('.cartao-medida-nome, .cartao-nome')),
          unidade: t(el.querySelector('.cartao-medida-quantidade .cartao-medida-unidade, .cartao-unidade')),
          estado: t(el.querySelector('[data-veredicto-referencia], [data-regua="limite"]')),
          faixa: t(el.querySelector('[data-faixa-concelho-frase]')),
          comparacao: t(el.querySelector('[data-faixa-comparacao]')),
          dobra: t(el.querySelector('[data-cartao-definicao], .cartao-medida-dobra .cartao-medida-frase')),
        };
      });
    }, p.cartoes);
    for (const d of diz) if (d.falta) problemas.push(`${p.nome}/${lang}/${largura}: falta o cartão ${d.seletor}`);
    let y = 0;
    if (p.ancora) {
      const caixa = await page.locator(p.ancora).first().boundingBox();
      if (!caixa) problemas.push(`${p.nome}/${lang}/${largura}: a âncora ${p.ancora} não tem caixa`);
      else y = Math.max(0, Math.floor(caixa.y + (await page.evaluate(() => window.scrollY)) - 24));
    }
    const altura = await page.evaluate(() => document.documentElement.scrollHeight);
    const clip = { x: 0, y, width: largura, height: Math.max(1, Math.min(p.nome === 'evora' ? 4800 : 2400, altura - y)) };
    const ficheiro = `${saida}/depois-${p.nome}-${lang}-${largura}.png`;
    const bytes = await page.screenshot({ path: ficheiro, fullPage: true, clip });
    resultados.push({ ficheiro, pagina: p.nome, rota: p.rotas[lang], lang, largura, recorte: clip, diz, sha256: createHash('sha256').update(bytes).digest('hex') });
    await c.close();
    console.log(`R2: ${p.nome}, ${lang}, ${largura} px: ${diz.map((d) => `${d.nome} · ${d.unidade}`).join(' | ') || 'o topo da página'}.`);
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'R2', cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), capturas: resultados.length, pedidos_recusados_para_fora: recusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-r2.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`R2: ${resultados.length} capturas, ${problemas.length} problemas.`);
for (const p of problemas) console.log(`  ${p}`);
process.exitCode = problemas.length ? 1 : 0;
