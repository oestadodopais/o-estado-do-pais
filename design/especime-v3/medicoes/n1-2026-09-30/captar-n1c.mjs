/** N1c: páginas tocadas, nas duas edições, a 390 e a 1 280 px.
 * O servidor efémero e o bloqueio de pedidos externos seguem o captor UE1.
 * O manifesto conserva a cabeça, os resumos e as medidas de cada captura.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { ENTRADAS } from '../../../../src/data/primeira-pagina.mjs';

const dist = path.resolve('dist');
const pasta = 'design/especime-v3/medicoes/n1-2026-09-30';
const saida = 'design/especime-v3/capturas/n1-2026-09-30/n1c';
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = JSON.parse(await fs.readFile('dist/version.json', 'utf8'));
if (versao.commit !== cabeca) throw new Error('A construção não é da cabeça atual.');
const larguras = [390, 1280];
const paginas = [{ id: 'primeira', rota: { pt: '/', en: '/en/' } }, ...ENTRADAS, { id: 'temas', rota: { pt: '/temas/', en: '/en/themes/' } }, { id: 'uniao', rota: { pt: '/uniao-europeia/', en: '/en/european-union/' } }];
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
try {
  for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    await contexto.route('**/*', (rota) => rota.request().url().startsWith(origem) ? rota.continue() : (pedidosRecusados.push(rota.request().url()), rota.abort()));
    const page = await contexto.newPage();
    page.on('pageerror', (e) => problemas.push(`${lang}/${largura}: ${e.message}`));
    for (const p of paginas) {
      const resposta = await page.goto(origem + p.rota[lang], { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) problemas.push(`${p.id}/${lang}/${largura}: HTTP ${resposta.status()}`);
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => { document.querySelectorAll('.forma-mapa-tabela, details:has(.dobra-porta)').forEach((d) => { d.open = true; }); });
      const medidas = await page.evaluate(() => {
        const caixa = (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, largura: r.width, altura: r.height }; };
        const cartoes = [...document.querySelectorAll('[data-cartao-medida]')];
        return {
          notas: [...document.querySelectorAll('[data-valor-irmao], [data-referencia-de]')].map((n) => {
            const pai = n.closest('[data-caixa-cartao]');
            const cartao = pai?.querySelector('[data-cartao-medida]');
            const nota = caixa(n); const contentor = pai ? caixa(pai) : null; const numero = cartao ? caixa(cartao) : null;
            return { id: pai?.getAttribute('data-caixa-cartao'), nota, contentor, cartao: numero, junta: !!contentor && !!numero && nota.x >= contentor.x - 1 && nota.x + nota.largura <= contentor.x + contentor.largura + 1 && nota.y >= numero.y + numero.altura - 1 && nota.y + nota.altura <= contentor.y + contentor.altura + 1 };
          }),
          janela: innerWidth, documento: document.documentElement.scrollWidth, altura: document.documentElement.scrollHeight,
          h1: document.querySelector('main h1')?.textContent.trim(),
          blocos: document.querySelectorAll('[data-bloco]').length,
          portas: document.querySelectorAll('[data-indice-assuntos] > li').length,
          cartoes: cartoes.length,
          cartoes_que_transbordam: cartoes.filter((c) => c.scrollWidth > c.clientWidth + 1).map((c) => c.getAttribute('data-cartao-medida')),
          caixas: [...document.querySelectorAll('main h1, .entrada-linha, [data-indice-assuntos], [data-comparacoes-concelhos]')].map((e) => ({ elemento: e.tagName, caixa: caixa(e) })),
        };
      });
      if (medidas.notas.some((n) => !n.junta)) problemas.push(`${p.id}/${lang}/${largura}: nota fora da caixa do cartão`);
      if (medidas.documento > largura + 1) problemas.push(`${p.id}/${lang}/${largura}: transbordo horizontal`);
      if (medidas.cartoes_que_transbordam.length) problemas.push(`${p.id}/${lang}/${largura}: cartões que transbordam: ${medidas.cartoes_que_transbordam.join(', ')}`);
      const ficheiro = `${saida}/${p.id}-${lang}-${largura}.png`;
      const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
      resultados.push({ ficheiro, pagina: p.id, rota: p.rota[lang], lang, largura, sha256: createHash('sha256').update(bytes).digest('hex'), medidas });
    }
    await contexto.close();
    console.log(`N1c: ${lang}, ${largura} px, ${paginas.length} capturas.`);
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'N1c', cabeca, construcao: versao, inicio, fim: new Date().toISOString(), larguras, capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-n1c.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`N1c: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
