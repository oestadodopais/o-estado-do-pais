/** UE1e: as capturas dos dois recibos da série do índice harmonizado, nas duas edições e nas cinco larguras.
 *
 * Adaptado de `captar-ue1d.mjs`. Serve `dist/` por um servidor local efémero, recusa todo o pedido que não
 * seja da origem local e confere que a construção é da cabeça. Captura, em cada edição e largura, a cabeça do
 * recibo (o título e a definição) e o que a janela mostra ao abrir a página (a definição por cima do princípio
 * da tabela dos 27). E mede: a definição é a forma do recibo da série declarada, carácter a carácter, não
 * nomeia Portugal, e a página não transborda na horizontal.
 *
 * O CONHECIDO-POSITIVO corre antes, na largura mais estreita de cada edição: o lugar posto de volta na
 * definição e um elemento mais largo do que a janela têm de ser vistos pelo mesmo detetor.
 *
 * Uso: node design/especime-v3/medicoes/ue1-2026-09-29/captar-ue1e.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { DEFINICOES_DAS_MEDIDAS } from '../../../../src/data/figuras.mjs';

const raiz = process.cwd();
const dist = path.resolve('dist');
const pastaRelativa = 'design/especime-v3/medicoes/ue1-2026-09-29';
const saidaRelativa = 'design/especime-v3/capturas/ue1-2026-09-29/ue1e';
const saida = path.join(raiz, saidaRelativa);
const esperado = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: raiz, encoding: 'utf8' }).trim();
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error(`A construção declara ${versao.commit}; esperava ${esperado}.`);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const larguras = [390, 768, 1024, 1280, 1600];
const SERIE = 'ihpc-variacao-homologa-paises';
const recibos = { pt: `/livro-razao/series/${SERIE}/`, en: `/en/ledger/series/${SERIE}/` };
const formaDaSerie = (lang) => DEFINICOES_DAS_MEDIDAS['ihpc-variacao-homologa'].serie[lang].join('').replace(/\s+/g, ' ').trim();
const NOMEIA_PORTUGAL = /\bPortugal\b|\bportugu[eê]s(?:es)?\b|\bportuguesas?\b|\bPortuguese\b/i;
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

const MEDIR = () => {
  const d = document.querySelector('[data-serie-o-que-conta]');
  return {
    janela: innerWidth, documento: document.documentElement.scrollWidth,
    definicao: d ? d.textContent.replace(/\s+/g, ' ').trim() : null,
    tabela: Boolean(document.querySelector('[data-serie-tabela]')),
  };
};

const navegador = await chromium.launch();
const resultados = [];
const plantas = [];
const recusados = [];
try {
  for (const lang of ['pt', 'en']) {
    for (const largura of larguras) {
      const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (recusados.push(rota.request().url()), rota.abort())));
      const pagina = await contexto.newPage();
      const carrega = async (url) => { await pagina.goto(`${origem}${url}`, { waitUntil: 'networkidle' }); await pagina.evaluate(() => document.fonts.ready); };
      if (largura === larguras[0]) {
        await carrega(recibos[lang]);
        await pagina.evaluate((l) => { const d = document.querySelector('[data-serie-o-que-conta]'); if (d) d.textContent = d.textContent.replace(l === 'pt' ? 'no consumidor face' : 'consumer prices changed', l === 'pt' ? 'no consumidor em Portugal face' : 'consumer prices in Portugal changed'); }, lang);
        const m1 = await pagina.evaluate(MEDIR);
        plantas.push({ lang, largura, nome: 'o lugar posto de volta na definição', visto: NOMEIA_PORTUGAL.test(m1.definicao ?? '') && m1.definicao !== formaDaSerie(lang) });
        await carrega(recibos[lang]);
        await pagina.evaluate(() => { const d = document.createElement('div'); Object.assign(d.style, { width: `${innerWidth + 200}px`, height: '1px' }); document.body.appendChild(d); });
        const m2 = await pagina.evaluate(MEDIR);
        plantas.push({ lang, largura, nome: 'um elemento mais largo do que a janela', visto: m2.documento > m2.janela + 0.5 });
      }
      await carrega(recibos[lang]);
      {
        const ficheiro = `${SERIE}-cabeca-${lang}-${largura}.png`;
        const alvo = pagina.locator('.serie-cabeca');
        const bytes = await alvo.screenshot({ path: path.join(saida, ficheiro) });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), tipo: 'cabeca', lang, largura, medidas: await pagina.evaluate(MEDIR) });
      }
      {
        const ficheiro = `${SERIE}-janela-${lang}-${largura}.png`;
        await pagina.evaluate(() => window.scrollTo(0, 0));
        const bytes = await pagina.screenshot({ path: path.join(saida, ficheiro) });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), tipo: 'janela', lang, largura, medidas: await pagina.evaluate(MEDIR) });
      }
      await contexto.close();
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}
const problemas = resultados.flatMap((r) => {
  const m = r.medidas;
  const p = [];
  if (m.documento > m.janela + 0.5) p.push('a página transborda na horizontal');
  if (m.definicao !== formaDaSerie(r.lang)) p.push(`a definição é «${m.definicao}» e a forma do recibo da série é «${formaDaSerie(r.lang)}»`);
  if (NOMEIA_PORTUGAL.test(m.definicao ?? '')) p.push('a definição nomeia Portugal');
  if (!m.tabela) p.push('a página não tem a tabela da série');
  return p.map((x) => `${r.ficheiro}: ${x}`);
});
const manifesto = {
  bloco: 'UE1e', construcao: versao, cabeca_esperada: esperado, larguras,
  capturas: resultados.length,
  capturas_por_tipo: Object.fromEntries(['cabeca', 'janela'].map((t) => [t, resultados.filter((r) => r.tipo === t).length])),
  plantas, plantas_vistas: plantas.filter((p) => p.visto).length,
  pedidos_recusados_para_fora: recusados.length, problemas, resultados,
};
await fs.writeFile(path.join(raiz, pastaRelativa, 'capturas-ue1e.json'), JSON.stringify(manifesto, null, 2) + '\n');
console.log(`UE1e capturas: ${resultados.length} imagens, ${problemas.length} problema(s), plantas vistas ${manifesto.plantas_vistas} de ${plantas.length}, ${recusados.length} pedido(s) para fora`);
for (const p of problemas) console.log(`  · ${p}`);
process.exit(problemas.length || manifesto.plantas_vistas !== plantas.length ? 1 : 0);
