/* Capturas da maqueta da primeira página nova (v1).
 * Abre o index.html desta pasta a partir do disco (sem servidor nem construção do sítio),
 * com o Playwright da worktree c1-2026-09-28, e grava em capturas/:
 *   primeira-pagina-390-inteira.png      a página inteira a 390 px
 *   primeira-pagina-1280-inteira.png     a página inteira a 1 280 px
 *   primeira-pagina-390-primeiro-ecra.png o primeiro ecrã a 390 × 844
 * Uso: node captar.mjs            (as três capturas pedidas)
 *      node captar.mjs --rever     (também 768 e 1 024 px e o tema escuro, em _rascunho/, para rever)
 * Antes de gravar, confere que os tipos do sítio carregaram e que nenhuma largura rola na horizontal;
 * se alguma coisa falhar, sai com código diferente de 0 e não grava por cima.
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PLAYWRIGHT = path.join(process.env.HOME, 'Instruments/OEstadoDoPais/.claude/worktrees/c1-2026-09-28/node_modules/playwright/index.mjs');
const { chromium } = await import(pathToFileURL(PLAYWRIGHT).href);

const pasta = path.dirname(fileURLToPath(import.meta.url));
const pagina = pathToFileURL(path.join(pasta, 'index.html')).href;
const destino = path.join(pasta, 'capturas');
const rever = process.argv.includes('--rever');

const pedidas = [
  { nome: 'primeira-pagina-390-inteira.png', largura: 390, altura: 844, inteira: true },
  { nome: 'primeira-pagina-1280-inteira.png', largura: 1280, altura: 800, inteira: true },
  { nome: 'primeira-pagina-390-primeiro-ecra.png', largura: 390, altura: 844, inteira: false },
];
const extra = rever ? [
  { nome: 'rever-768-inteira.png', largura: 768, altura: 1024, inteira: true, pasta: '_rascunho' },
  { nome: 'rever-1024-inteira.png', largura: 1024, altura: 768, inteira: true, pasta: '_rascunho' },
  { nome: 'rever-1600-inteira.png', largura: 1600, altura: 900, inteira: true, pasta: '_rascunho' },
  { nome: 'rever-390-escuro.png', largura: 390, altura: 844, inteira: true, pasta: '_rascunho', escuro: true },
  { nome: 'rever-1280-escuro.png', largura: 1280, altura: 800, inteira: true, pasta: '_rascunho', escuro: true },
] : [];

const browser = await chromium.launch();
let falhas = 0;
try {
  for (const c of [...pedidas, ...extra]) {
    const context = await browser.newContext({
      viewport: { width: c.largura, height: c.altura },
      deviceScaleFactor: 1,
      colorScheme: c.escuro ? 'dark' : 'light',
    });
    const page = await context.newPage();
    const pedidosFalhados = [];
    page.on('requestfailed', (r) => pedidosFalhados.push(r.url()));
    await page.goto(pagina, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const estado = await page.evaluate(() => ({
      tipos: ['600 15px "Spectral SC"', '400 20px Spectral', '600 20px Spectral', '500 20px Spectral', '600 15px Bitter', '400 13px Bitter']
        .map((f) => [f, document.fonts.check(f)]),
      carregados: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`),
      larguraDoc: document.documentElement.scrollWidth,
      alturaDoc: document.documentElement.scrollHeight,
    }));
    const semTipo = estado.tipos.filter(([, ok]) => !ok).map(([f]) => f);
    const locais = pedidosFalhados.filter((u) => u.startsWith('file:'));
    const rola = estado.larguraDoc > c.largura;
    if (semTipo.length || locais.length || rola) {
      falhas++;
      console.error(`FALHA ${c.nome}: tipos em falta ${JSON.stringify(semTipo)}; pedidos locais falhados ${JSON.stringify(locais)}; largura do documento ${estado.larguraDoc} para ${c.largura}`);
      await context.close();
      continue;
    }
    const alvo = path.join(pasta, c.pasta ?? 'capturas', c.nome);
    await fs.mkdir(path.dirname(alvo), { recursive: true });
    await page.screenshot({ path: alvo, fullPage: c.inteira });
    console.log(`${path.relative(pasta, alvo)}  ${c.largura} px  página com ${estado.alturaDoc} px de altura  tipos carregados: ${estado.carregados.length}`);
    await context.close();
  }
} finally {
  await browser.close();
}
if (falhas) process.exit(1);
