/** S1: as capturas da caixa das sugestões, sobre a construção da cabeça atual (o §3, ponto 9 do brief): a página do
 * formulário nas cinco larguras da casa e nas duas edições; a página do obrigado a 390 e a 1 280 px, nas duas edições;
 * e o rodapé com as duas portas a 390 px, nas duas edições. O servidor efémero e o bloqueio dos pedidos de fora são os
 * do captor do UE2 (`design/especime-v3/medicoes/ue2-2026-10-02/captar-ue2-b.mjs`). O manifesto guarda a cabeça da
 * construção, o resumo de cada imagem e as medidas de cada página: a altura, o transbordo horizontal, o título, e na
 * página do formulário a altura do botão, a caixa do campo armadilhado (que tem de estar fora do ecrã) e o destino da
 * porta das sugestões do rodapé.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/s1-2026-10-02/captar-s1.mjs
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
const pasta = 'design/especime-v3/medicoes/s1-2026-10-02';
const saida = 'design/especime-v3/capturas/s1-2026-10-02';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}).`);
const LARGURAS = [390, 768, 1024, 1280, 1600];
const rotas = {
  formulario: { pt: '/sugestoes/', en: '/en/suggestions/' },
  obrigado: { pt: '/sugestoes/obrigado/', en: '/en/suggestions/thank-you/' },
  rodape: { pt: '/lugares/', en: '/en/places/' },
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
const medir = () => {
  const botao = document.querySelector('[data-sugestoes-formulario] button[type="submit"]');
  const armadilha = document.querySelector('[data-sugestoes-armadilha] input');
  const porta = document.querySelector('[data-porta-sugestoes] a');
  const caixa = (el) => (el ? (({ left, top, width, height }) => ({ left: Math.round(left), top: Math.round(top), largura: Math.round(width), altura: Math.round(height) }))(el.getBoundingClientRect()) : null);
  return {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    altura: document.documentElement.scrollHeight,
    h1: document.querySelector('main h1')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
    botao: caixa(botao),
    armadilha: caixa(armadilha),
    porta_das_sugestoes: porta?.getAttribute('href') ?? null,
  };
};

const contexto = async (largura) => {
  const c = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
  await c.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (pedidosRecusados.push(rota.request().url()), rota.abort())));
  return c;
};
const guarda = (bytes, ficheiro, registo) => {
  resultados.push({ ficheiro, ...registo, sha256: createHash('sha256').update(bytes).digest('hex') });
};

try {
  /* A PÁGINA DO FORMULÁRIO, NAS CINCO LARGURAS, e A DO OBRIGADO A 390 E A 1 280 */
  for (const [pagina, larguras] of [['formulario', LARGURAS], ['obrigado', [390, 1280]]]) for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const c = await contexto(largura);
    const page = await c.newPage();
    page.on('pageerror', (e) => problemas.push(`${pagina}/${lang}/${largura}: ${e.message}`));
    const resposta = await page.goto(origem + rotas[pagina][lang], { waitUntil: 'networkidle' });
    if (resposta.status() !== 200) problemas.push(`${pagina}/${lang}/${largura}: HTTP ${resposta.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const medidas = await page.evaluate(medir);
    if (medidas.documento > largura + 1) problemas.push(`${pagina}/${lang}/${largura}: transbordo horizontal`);
    if (pagina === 'formulario') {
      if (!medidas.botao || medidas.botao.altura < 44) problemas.push(`${pagina}/${lang}/${largura}: o botão tem menos de 44 px`);
      if (!medidas.armadilha || medidas.armadilha.left + medidas.armadilha.largura > 0) problemas.push(`${pagina}/${lang}/${largura}: o campo armadilhado não está fora do ecrã`);
    }
    if (pagina === 'obrigado' && medidas.robots !== 'noindex, follow') problemas.push(`${pagina}/${lang}/${largura}: sem noindex`);
    const ficheiro = `${saida}/s1-${pagina}-${lang}-${largura}.png`;
    const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
    guarda(bytes, ficheiro, { tipo: 'pagina', rota: rotas[pagina][lang], lang, largura, medidas });
    await c.close();
    console.log(`S1: ${pagina}, ${lang}, ${largura} px.`);
  }
  /* O RODAPÉ COM AS DUAS PORTAS, A 390 */
  for (const lang of ['pt', 'en']) {
    const c = await contexto(390);
    const page = await c.newPage();
    await page.goto(origem + rotas.rodape[lang], { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const rodape = page.locator('footer.rodape');
    const portas = await rodape.evaluate((f) => ({
      correcoes: f.querySelector('[data-porta-correccoes] a')?.getAttribute('href') ?? null,
      sugestoes: f.querySelector('[data-porta-sugestoes] a')?.getAttribute('href') ?? null,
      rotulo: f.querySelector('[data-porta-sugestoes] a')?.textContent.trim() ?? null,
    }));
    if (!portas.correcoes || !portas.sugestoes) problemas.push(`rodapé/${lang}: falta uma das duas portas`);
    const ficheiro = `${saida}/s1-rodape-${lang}-390.png`;
    const bytes = await rodape.screenshot({ path: ficheiro });
    guarda(bytes, ficheiro, { tipo: 'rodape', rota: rotas.rodape[lang], lang, largura: 390, portas });
    await c.close();
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'S1', cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), larguras: LARGURAS, capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-s1.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`S1: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
