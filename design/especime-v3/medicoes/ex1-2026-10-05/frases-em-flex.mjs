/**
 * EX1: as frases compostas das explicações e da semana (as que levam pedaços marcados, `data-de-linha` ou `data-semana`)
 * que caem dentro de um contentor flexível ou de grelha, nas páginas onde se rendem, a 390 px e a 1280 px. Num contentor
 * flexível, cada pedaço marcado e cada corrida de texto à volta dele é um item: os espaços das pontas apagam-se («em2026»)
 * e a frase não dobra como prosa. O guião mede, para cada pai direto de um pedaço marcado, o `display` calculado; e, por
 * página, se a página transborda. Sai 1 se achar uma frase dessas num contentor flexível ou de grelha, ou um transbordo.
 * Uso (na raiz, depois do build): node design/especime-v3/medicoes/ex1-2026-10-05/frases-em-flex.mjs [--json <ficheiro>]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';
const DIST = path.resolve('dist');
const i = process.argv.indexOf('--json'); const SAIDA = i > 1 ? process.argv[i + 1] : null;
const ROTAS = ['/', '/en/', '/indice/', '/en/index/', '/explicacoes/', '/en/explainers/', '/explicacoes/leitura-da-semana/', '/en/explainers/weekly-reading/', '/explicacoes/dinheiro-do-estado-2026/', '/en/explainers/dinheiro-do-estado-2026/'];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const srv = http.createServer(async (req, res) => { try { let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname)); if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html'); res.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream'); res.end(await fs.readFile(f)); } catch { res.writeHead(404).end(); } });
await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${srv.address().port}`;
const versao = JSON.parse(await fs.readFile(path.join(DIST, 'version.json'), 'utf8'));
const nav = await chromium.launch();
const resultados = []; const erros = [];
for (const largura of [390, 1280]) for (const rota of ROTAS) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  await p.goto(origem + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const pedacos = [...document.querySelectorAll('main [data-semana], main [data-de-linha]')].filter((x) => x.closest('[data-explicacao-declarado], [data-semana-declarado], [data-explicacao-porta], [data-semana-frase]'));
    const pais = new Set(pedacos.map((x) => x.parentElement));
    const flex = [...pais].filter((el) => /flex|grid/.test(getComputedStyle(el).display)).map((el) => ({ tag: el.tagName.toLowerCase(), cls: String(el.className), display: getComputedStyle(el).display, texto: el.textContent.trim().slice(0, 70) }));
    return { pedacos: pedacos.length, pais: pais.size, flex, transborda: document.documentElement.scrollWidth > window.innerWidth + 1, largura_do_documento: document.documentElement.scrollWidth };
  });
  resultados.push({ rota, largura, ...r });
  for (const f of r.flex) erros.push(`${rota} a ${largura}: uma frase composta dentro de um contentor ${f.display} (${f.tag}.${f.cls}): «${f.texto}»`);
  if (r.transborda) erros.push(`${rota} a ${largura}: a página transborda (${r.largura_do_documento} px)`);
  await ctx.close();
}
/* O conhecido-positivo, no navegador e nunca no ficheiro: a porta da lista posta num contentor flexível tem de ser vista. */
const plantas = [];
{
  const ctx = await nav.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  await p.goto(origem + '/explicacoes/', { waitUntil: 'networkidle' });
  await p.evaluate(() => { const a = document.querySelector('.explicacoes-item a'); a.style.display = 'inline-flex'; });
  await p.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
  const viu = await p.evaluate(() => [...document.querySelectorAll('main [data-de-linha]')].some((x) => x.closest('[data-explicacao-porta]') && /flex|grid/.test(getComputedStyle(x.parentElement).display)));
  plantas.push({ nome: 'a porta da lista das explicações posta num contentor flexível', mordeu: viu });
  if (!viu) erros.push('a planta da porta num contentor flexível não mordeu');
  await ctx.close();
}
await nav.close(); srv.close();
const resumo = { o_que_e: 'EX1: as frases compostas das explicações e da semana dentro de um contentor flexível ou de grelha, e os transbordos, nas páginas onde se rendem.', construcao: versao.commit, construido_em: versao.construido_em, resultados, plantas, erros };
if (SAIDA) await fs.writeFile(SAIDA, JSON.stringify(resumo, null, 2) + '\n');
console.log(`EX1 · ${resultados.length} passagens, ${resultados.reduce((s, x) => s + x.pedacos, 0)} pedaços marcados vistos, ${plantas.filter((x) => x.mordeu).length} de ${plantas.length} plantas, ${erros.length} erro(s)`);
for (const e of erros) console.log(`  · ${e}`);
process.exit(erros.length ? 1 : 0);
