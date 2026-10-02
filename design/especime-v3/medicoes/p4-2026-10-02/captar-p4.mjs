/** P4 (02.10.2026): as capturas do bloco, sobre a construção da cabeça atual.
 *
 * A primeira página, «Lugares» e a página da União, nas cinco larguras (390, 768, 1 024, 1 280 e 1 600 px) e nas duas
 * edições, no tema claro que é o de omissão: o aparelho está em modo escuro e nada está guardado, e a página tem de
 * abrir clara. Uma captura escura de cada página (390 px, edição portuguesa), com a escolha «escuro» guardada no
 * aparelho como o comando a guarda (`localStorage`, chave «tema»). E o cabeçalho a 390 px nas duas edições, tal como
 * se publica e, só na captura, com a porta da União com o nome inteiro («União Europeia», «European Union»), para
 * mostrar porque é que o menu leva «Europa» e «Europe»: com o nome inteiro, as seis portas não cabem numa linha.
 *
 * O servidor efémero e o bloqueio dos pedidos de fora são os dos captores do UE2. O manifesto guarda a cabeça da
 * construção, o resumo sha256 de cada imagem e as medidas de cada página: o atributo do tema na raiz, a cor do papel
 * do corpo, as portas do menu e em quantas linhas ficam, e o transbordo horizontal do documento e do menu.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/p4-2026-10-02/captar-p4.mjs
 *   (sobre `dist/`, que tem de ser uma construção da cabeça atual). Sai 0 sem problemas; 1 com a lista deles.
 */
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
const larguras = [390, 768, 1024, 1280, 1600];
const rotas = {
  inicio: { pt: '/', en: '/en/' },
  lugares: { pt: '/lugares/', en: '/en/places/' },
  uniao: { pt: '/uniao-europeia/', en: '/en/european-union/' },
};
/* O nome inteiro da página da União, como `src/i18n/strings.mjs` o escreve no índice dos assuntos. */
const NOME_INTEIRO = { pt: 'União Europeia', en: 'European Union' };
const PAPEL = { claro: 'rgb(246, 247, 244)', escuro: 'rgb(21, 23, 26)' };
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
  const portas = [...document.querySelectorAll('#nav-principal a')];
  const nav = document.querySelector('#nav-principal');
  const controlo = document.querySelector('header [data-tema-controlo]');
  return {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    altura: document.documentElement.scrollHeight,
    tema: document.documentElement.getAttribute('data-theme'),
    papel: getComputedStyle(document.body).backgroundColor,
    portas: portas.map((a) => a.textContent.trim()),
    linhas_do_menu: new Set(portas.map((a) => Math.round(a.getBoundingClientRect().top))).size,
    menu_transborda: nav ? nav.scrollWidth > nav.clientWidth + 0.5 : null,
    menu_direita: nav ? +Math.max(...portas.map((a) => a.getBoundingClientRect().right)).toFixed(1) : null,
    comando_do_tema_a_vista: controlo ? controlo.checkVisibility() : false,
  };
};

const contexto = async (largura, escuro = false) => {
  const c = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'dark', reducedMotion: 'reduce' });
  await c.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (pedidosRecusados.push(rota.request().url()), rota.abort())));
  if (escuro) await c.addInitScript(() => { try { localStorage.setItem('tema', 'dark'); } catch {} });
  return c;
};
const guarda = (bytes, ficheiro, registo) => {
  resultados.push({ ficheiro, ...registo, sha256: createHash('sha256').update(bytes).digest('hex') });
};

try {
  /* AS PÁGINAS INTEIRAS, NO CLARO DE OMISSÃO (o aparelho escuro, nada guardado) */
  for (const [pagina, porLingua] of Object.entries(rotas)) for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const c = await contexto(largura);
    const page = await c.newPage();
    page.on('pageerror', (e) => problemas.push(`${pagina}/${lang}/${largura}: ${e.message}`));
    const resposta = await page.goto(origem + porLingua[lang], { waitUntil: 'networkidle' });
    if (resposta.status() !== 200) problemas.push(`${pagina}/${lang}/${largura}: HTTP ${resposta.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const medidas = await page.evaluate(medir);
    if (medidas.tema !== null || medidas.papel !== PAPEL.claro) problemas.push(`${pagina}/${lang}/${largura}: não abriu clara (${medidas.tema}, ${medidas.papel})`);
    if (medidas.portas.length !== 6 || medidas.linhas_do_menu !== 1 || medidas.menu_transborda) problemas.push(`${pagina}/${lang}/${largura}: o menu não tem as seis portas numa linha`);
    if (!medidas.comando_do_tema_a_vista) problemas.push(`${pagina}/${lang}/${largura}: o comando do tema não está à vista`);
    if (medidas.documento > largura + 1) problemas.push(`${pagina}/${lang}/${largura}: transbordo horizontal de ${medidas.documento - largura} px`);
    const ficheiro = `${saida}/p4-${pagina}-${lang}-${largura}.png`;
    const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
    guarda(bytes, ficheiro, { tipo: 'pagina', tema: 'claro de omissão (aparelho escuro, nada guardado)', rota: porLingua[lang], lang, largura, medidas });
    await c.close();
    console.log(`P4: ${pagina}, ${lang}, ${largura} px, claro.`);
  }
  /* UMA CAPTURA ESCURA DE CADA PÁGINA, com a escolha guardada */
  for (const pagina of Object.keys(rotas)) {
    const c = await contexto(390, true);
    const page = await c.newPage();
    page.on('pageerror', (e) => problemas.push(`${pagina}/pt/390/escuro: ${e.message}`));
    await page.goto(origem + rotas[pagina].pt, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const medidas = await page.evaluate(medir);
    if (medidas.tema !== 'dark' || medidas.papel !== PAPEL.escuro) problemas.push(`${pagina}/pt/390/escuro: não abriu escura (${medidas.tema}, ${medidas.papel})`);
    const ficheiro = `${saida}/p4-${pagina}-pt-390-escuro.png`;
    const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
    guarda(bytes, ficheiro, { tipo: 'pagina', tema: 'escuro (a escolha guardada no aparelho)', rota: rotas[pagina].pt, lang: 'pt', largura: 390, medidas });
    await c.close();
    console.log(`P4: ${pagina}, pt, 390 px, escuro.`);
  }
  /* O CABEÇALHO A 390 PX: como se publica, e com o nome inteiro da União (só na captura) */
  for (const lang of ['pt', 'en']) for (const variante of ['publicado', 'nome-inteiro']) {
    const c = await contexto(390);
    const page = await c.newPage();
    await page.goto(origem + rotas.inicio[lang], { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    if (variante === 'nome-inteiro') {
      const trocadas = await page.evaluate((nome) => {
        const porta = [...document.querySelectorAll('#nav-principal a')].find((a) => /uniao-europeia|european-union/.test(a.getAttribute('href')));
        if (!porta) return 0;
        porta.textContent = nome;
        return 1;
      }, NOME_INTEIRO[lang]);
      if (trocadas !== 1) problemas.push(`cabeçalho/${lang}: a porta da União não se encontrou para a troca`);
    }
    const medidas = await page.evaluate(medir);
    const ficheiro = `${saida}/p4-cabecalho-${lang}-390-${variante}.png`;
    const bytes = await page.locator('header').first().screenshot({ path: ficheiro });
    guarda(bytes, ficheiro, { tipo: 'cabecalho', variante, lang, largura: 390, medidas });
    await c.close();
    console.log(`P4: cabeçalho, ${lang}, 390 px, ${variante}: ${medidas.linhas_do_menu} linha(s).`);
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'P4', cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), larguras, capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-p4.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`P4: ${resultados.length} capturas, ${problemas.length} problemas.`);
for (const p of problemas) console.log(`  ${p}`);
process.exitCode = problemas.length ? 1 : 0;
