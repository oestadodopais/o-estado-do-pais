/** Recibos JD1 e série nas duas línguas, com medidas e imagens da construção real. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const raiz = process.cwd();
const dist = path.join(raiz, 'dist');
const pasta = 'design/especime-v3/medicoes/jd1-2026-10-06';
const saida = 'design/especime-v3/capturas/jd1-2026-10-06';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const alterados = execFileSync('git', ['diff', '--name-only', versao.commit, '--'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
if (alterados.some(p => !p.startsWith(pasta) && !p.startsWith(saida))) throw new Error('A construção não corresponde ao código a capturar.');
const ids = {
  ine: 'juros-das-administracoes-publicas-2025',
  eurostat: 'juros-das-administracoes-publicas-2025-ue',
  execucao: 'juros-e-outros-encargos-execucao-2026-08',
  igcp: 'custo-do-stock-da-divida-direta-2025',
  serie: 'series/serie-obrigacoes-do-tesouro-10-anos-rendibilidade',
};
const larguras = [390, 768, 1024, 1280, 1600];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    let f = path.resolve(dist, '.' + decodeURIComponent(new URL(pedido.url, 'http://localhost').pathname));
    if (!f.startsWith(dist + path.sep)) throw new Error('Caminho inválido.');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(f));
  } catch { resposta.writeHead(404).end(); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;
const browser = await chromium.launch();
const capturas = [], interacoes = [], plantas = [], problemas = [];
await fs.mkdir(saida, { recursive: true });
try {
  for (const [nome, id] of Object.entries(ids)) for (const lingua of ['pt', 'en']) for (const largura of larguras) {
    const context = await browser.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    const p = await context.newPage();
    p.on('pageerror', e => problemas.push(`${nome}/${lingua}/${largura}: ${e.message}`));
    const url = (lingua === 'pt' ? '/livro-razao/' : '/en/ledger/') + id + '/';
    const response = await p.goto(base + url, { waitUntil: 'networkidle' });
    if (response.status() !== 200) problemas.push(`${url}: HTTP ${response.status()}`);
    const medidas = await p.evaluate(() => {
      const texto = s => (document.querySelector(s)?.textContent ?? '').replace(/\s+/g, ' ').trim();
      return { largura: innerWidth, documento: document.documentElement.scrollWidth,
        titulo: texto('.linha-cabeca h1'),
        frase: texto('[data-o-que-e-parte="o-que-e"]') || texto('[data-o-que-e-da-serie] .linha-o-que-e-frase'),
        ultimo: texto('[data-serie-ultimo]'),
        por_confirmar: document.querySelectorAll('[data-por-confirmar-na-fonte]').length,
        portas: [...document.querySelectorAll('.linha-endereco-abrir')].map(e => {
          const rotulo = e.getBoundingClientRect(), endereco = e.parentElement.querySelector('.linha-endereco-bruto').getBoundingClientRect();
          return { rotulo_acima: endereco.top >= rotulo.bottom - 1, alvo: e.parentElement.getBoundingClientRect().height };
        }) };
    });
    if (medidas.documento > largura) problemas.push(`${url}: largura ${medidas.documento} excede ${largura}`);
    if (!medidas.frase || medidas.por_confirmar) problemas.push(`${url}: frase ausente ou por confirmar`);
    if (largura < 1024 && medidas.portas.some(p => !p.rotulo_acima || p.alvo < 44)) problemas.push(`${url}: rótulo da página sem a sua linha ou alvo inferior ao mínimo`);
    const ficheiro = `${saida}/${nome}-${lingua}-${largura}.png`;
    const bytes = await p.screenshot({ path: ficheiro, fullPage: true });
    capturas.push({ ficheiro, url, lingua, largura, medidas, sha256: createHash('sha256').update(bytes).digest('hex') });
    if (nome === 'execucao' && lingua === 'pt' && largura === 390) {
      const mensagem = 'O rótulo da página não fica acima do endereço.';
      const etiqueta = p.locator('.linha-endereco-abrir').first();
      const estilo = await etiqueta.evaluate(e => e.parentElement.getAttribute('style'));
      await etiqueta.evaluate(e => { e.parentElement.style.flexDirection = 'row'; });
      const mordeu = await etiqueta.evaluate(e => e.parentElement.querySelector('.linha-endereco-bruto').getBoundingClientRect().top < e.getBoundingClientRect().bottom - 1);
      if (!mordeu) problemas.push(`A planta da porta não recusou: ${mensagem}`);
      plantas.push({ nome: 'Rótulo e endereço comprimidos na mesma fila', mensagem, planta: true, passou: mordeu });
      await etiqueta.evaluate((e, anterior) => { if (anterior === null) e.parentElement.removeAttribute('style'); else e.parentElement.setAttribute('style', anterior); }, estilo);
    }
    if (nome === 'serie') {
      const pedidos = p.locator('.serie-pedidos');
      await pedidos.locator('summary').click();
      const aberto = await pedidos.evaluate(el => el.open && el.querySelectorAll('[data-serie-pedido]').length > 0);
      if (!aberto) problemas.push(`${url}: os pedidos não abrem`);
      const janela = p.locator('.serie-tabela-janela');
      const dimensoes = await janela.evaluate(el => ({ largura: el.clientWidth, tabela: el.scrollWidth }));
      let deslocamento = null;
      if (dimensoes.tabela > dimensoes.largura) {
        await janela.focus();
        await janela.press('ArrowRight');
        try { await p.waitForFunction(() => document.querySelector('.serie-tabela-janela').scrollLeft > 0, null, { timeout: 2000 }); }
        catch { problemas.push(`${url}: a tabela não se desloca pelo teclado`); }
        deslocamento = await janela.evaluate(el => el.scrollLeft);
      }
      interacoes.push({ url, lingua, largura, pedidos_abertos: aberto, dimensoes, deslocamento });
    }
    await context.close();
  }
} finally { await browser.close(); servidor.close(); }
await fs.writeFile(`${pasta}/capturas.json`, JSON.stringify({ comando: 'node design/especime-v3/medicoes/jd1-2026-10-06/captar.mjs', cabeca, construcao: versao.commit, larguras, capturas, interacoes, plantas, problemas }, null, 2) + '\n');
console.log(`Capturas: ${capturas.length}; problemas: ${problemas.length}.`);
if (problemas.length) { console.error(problemas.join('\n')); process.exitCode = 1; }
