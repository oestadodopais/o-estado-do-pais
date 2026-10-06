/** H4: capturas da construção identificada, adaptadas do captor EX1.
 * node design/especime-v3/medicoes/h4-2026-10-06/captar-h4.mjs [--politica] [--passagem-b] [--passagem-c] [--passagem-d] [--passagem-e]
 * A opção acrescenta o endereço real da política, lido da tabela das rotas.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { routePath } from '../../../../src/lib/routes.mjs';
import { ANCORA_DA_POLITICA } from '../../../../src/data/politica-ia.mjs';
const AQUI = 'design/especime-v3/medicoes/h4-2026-10-06';
const passagemE = process.argv.includes('--passagem-e');
const CAP = 'design/especime-v3/capturas/h4-2026-10-06' + (passagemE ? '/passagem-e' : '');
// As provas finais podem escrever numa pasta ignorada até todas acabarem com a árvore limpa.
const destino = (f) => passagemE ? path.join(process.env.OEDP_H4_PROVAS ?? '.', f) : f;
const DIST = path.resolve('dist');
const passagemB = process.argv.includes('--passagem-b');
const passagemC = process.argv.includes('--passagem-c');
const pastaPaginas = passagemE ? 'paginas-e' : passagemC ? 'paginas-c' : passagemB ? 'paginas-b' : 'paginas';
const versao = JSON.parse(await fs.readFile('dist/version.json', 'utf8'));
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const estado = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' });
if (passagemE && estado) throw Error('As capturas H4-e exigem a árvore limpa.');
if (cabeca !== versao.commit) throw Error('A construção não é desta cabeça.');
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const servidor = http.createServer(async (q, r) => {
  try {
    let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(q.url, 'http://x').pathname));
    if (f !== DIST && !f.startsWith(DIST + path.sep)) throw Error('fora');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    r.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    r.end(await fs.readFile(f));
  } catch { r.writeHead(404).end(); }
});
await fs.mkdir(destino(CAP), { recursive: true });
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch();
const sha = (b) => createHash('sha256').update(b).digest('hex');
const capturas = []; const paginas = []; const erros = [];
const familias = passagemE ? ['politica'] : passagemC ? ['primeira'] : ['primeira', 'explicacao', ...(process.argv.includes('--politica') || passagemB ? ['politica'] : [])];
try {
  for (const familia of familias) for (const lang of ['pt', 'en']) {
    const rota = familia === 'primeira' ? routePath('home', lang) : familia === 'politica' ? routePath('metodo', lang) : routePath('explicacao', lang, { slug: 'dinheiro-do-estado-2026' });
    const local = `${DIST}/${rota.replace(/^\//, '')}/index.html`.replace(/\/+/g, '/');
    const bytes = await fs.readFile(local);
    const copia = `${AQUI}/${pastaPaginas}/${familia}-${lang}.html`;
    await fs.mkdir(destino(`${AQUI}/${pastaPaginas}`), { recursive: true });
    await fs.writeFile(destino(copia), bytes);
    const folhas = [...bytes.toString().matchAll(/<link[^>]+href="([^"#?]+\.css)"/g)].map((m) => m[1]);
    paginas.push({ familia, lang, rota, copia, sha256: sha(bytes), folhas: await Promise.all(folhas.map(async (f) => ({ ficheiro: f, sha256: sha(await fs.readFile(path.join(DIST, f))) }))) });
    for (const largura of passagemE ? [390, 768, 1024, 1280, 1600] : passagemC ? [320, 360] : familia === 'politica' ? (process.argv.includes('--politica') ? [390, 1280] : []) : [390, 768, 1024, 1280, 1600]) {
      const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      const externos = [];
      await ctx.route('**/*', (r) => new URL(r.request().url()).origin === origem ? r.continue() : (externos.push(r.request().url()), r.abort()));
      const p = await ctx.newPage();
      const resposta = await p.goto(origem + rota, { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) throw Error(`HTTP ${resposta.status()} em ${rota}`);
      await p.evaluate(() => document.fonts.ready);
      const medidas = await p.evaluate(() => {
        const menu = document.querySelector('#nav-principal');
        const links = [...menu.querySelectorAll('a')];
        const portas = links.map((a) => { const b = a.getBoundingClientRect(); return { texto: a.textContent.trim(), x: b.x, y: b.y, largura: b.width, altura: b.height, direita: b.right }; });
        return { documento: document.documentElement.scrollWidth, janela: innerWidth, linhas: new Set(portas.map((p) => p.y)).size, portas, gap: parseFloat(getComputedStyle(menu).columnGap), letra: getComputedStyle(links[0]).fontSize,
          transbordo_menu: menu.scrollWidth > menu.clientWidth || portas.some((p) => p.x < 0 || p.direita > innerWidth), lugares_ia: document.querySelectorAll('.politica-lugares li').length };
      });
      const ficheiro = `${CAP}/${familia}-${lang}-${largura}.png`;
      const imagem = await p.screenshot({ path: destino(ficheiro), fullPage: true });
      const recorte = `${CAP}/${familia === 'politica' ? 'lugares-ia' : `cabecalho-${familia}`}-${lang}-${largura}.png`;
      const zona = familia === 'politica' ? p.locator('.politica-lugares').locator('..').locator('..') : p.locator('header').first();
      const buf = await zona.screenshot({ path: destino(recorte) });
      const cabecalho = passagemE ? `${CAP}/cabecalho-${familia}-${lang}-${largura}.png` : null;
      const shaCabecalho = cabecalho ? sha(await p.locator('header').first().screenshot({ path: destino(cabecalho) })) : null;
      capturas.push({ familia, lang, largura, rota, ancora: familia === 'politica' ? ANCORA_DA_POLITICA : null, ficheiro, sha256: sha(imagem), recorte, sha256_recorte: sha(buf), ...(passagemE ? { cabecalho, sha256_cabecalho: shaCabecalho } : {}), medidas, pedidos_externos: externos });
      // A TM4 protege o menu. O transbordo do documento, já registado na H4-b, continua medido em separado.
      if ((!passagemC && medidas.documento > largura) || medidas.transbordo_menu || externos.length) erros.push(`${familia}/${lang}/${largura}: transbordo ou pedido externo.`);
      await ctx.close();
    }
    if (sha(bytes) !== sha(await fs.readFile(local))) throw Error('Os bytes mudaram durante as capturas.');
  }
} finally { await navegador.close(); servidor.close(); }
await fs.writeFile(destino(`${AQUI}/${passagemE ? 'capturas-e' : passagemC ? 'capturas-c' : passagemB ? 'capturas-b' : 'capturas'}.json`), JSON.stringify({ comando: `node ${AQUI}/captar-h4.mjs${process.argv.includes('--politica') ? ' --politica' : ''}${passagemB ? ' --passagem-b' : ''}${passagemC ? ' --passagem-c' : ''}${passagemE ? ' --passagem-e' : ''}`, cabeca, estado, construcao: versao, paginas, capturas, erros }, null, 2) + '\n');
console.log(`${capturas.length} capturas e os seus recortes; ${erros.length} erros.`);
process.exitCode = erros.length ? 1 : 0;
