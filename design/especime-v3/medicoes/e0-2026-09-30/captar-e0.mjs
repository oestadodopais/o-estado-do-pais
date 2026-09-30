/** E0: a primeira página, o cartão do desemprego e a secção das mudanças. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
const pasta = 'design/especime-v3/medicoes/e0-2026-09-30';
const saida = 'design/especime-v3/capturas/e0-2026-09-30';
const dist = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = JSON.parse(await fs.readFile('dist/version.json', 'utf8'));
if (versao.commit !== cabeca) throw new Error('A construção não é da cabeça atual.');
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
const paginas = [
  { id: 'primeira', rotas: { pt: '/', en: '/en/' }, seletor: null },
  { id: 'desemprego', rotas: { pt: '/emprego/', en: '/en/employment/' }, seletor: '[data-cartao-medida="taxa-de-desemprego-mip-2025"]' },
  { id: 'mudancas', rotas: { pt: '/correcoes', en: '/en/corrections' }, seletor: '[aria-labelledby="registo-mudancas"]' },
];
const larguras = [390, 1280];
await fs.mkdir(saida, { recursive: true });
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const origem = `http://127.0.0.1:${servidor.address().port}`;
let navegador;
const resultados = [];
const problemas = [];
let recusados = 0;
const inicio = new Date().toISOString();
try {
  navegador = await chromium.launch();
  for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    await contexto.route('**/*', rota => rota.request().url().startsWith(origem) ? rota.continue() : (recusados++, rota.abort()));
    const pagina = await contexto.newPage();
    pagina.on('pageerror', e => problemas.push(`${lang}/${largura}: ${e.message}`));
    for (const alvo of paginas) {
      const resposta = await pagina.goto(origem + alvo.rotas[lang], { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) problemas.push(`${alvo.id}/${lang}/${largura}: HTTP ${resposta.status()}`);
      await pagina.evaluate(() => document.fonts.ready);
      const medidas = await pagina.evaluate(seletor => {
        const el = seletor ? document.querySelector(seletor) : document.querySelector('main');
        const caixa = el?.getBoundingClientRect();
        const valor = el?.querySelector('.cartao-medida-quantidade')?.textContent.trim();
        const mudancas = [...(el?.querySelectorAll('[data-correcao-entrada]') ?? [])].filter(e => ['correcoes-publicadas', 'taxa-de-desemprego-2025', 'taxa-de-desemprego-mip-2025'].includes(e.getAttribute('data-correcao-entrada')));
        return { janela: innerWidth, documento: document.documentElement.scrollWidth,
          alvo: el ? { largura: caixa.width, altura: caixa.height, scroll: el.scrollWidth, client: el.clientWidth } : null,
          valor, mudancas: mudancas.map(e => ({ id: e.getAttribute('data-correcao-entrada'), lugar: e.querySelector('.registo-lugar')?.textContent.trim() })) };
      }, alvo.seletor);
      if (!medidas.alvo || medidas.documento > largura + 1 || medidas.alvo.scroll > medidas.alvo.client + 1)
        problemas.push(`${alvo.id}/${lang}/${largura}: alvo em falta ou transbordo horizontal`);
      const ficheiro = `${saida}/${alvo.id}-${lang}-${largura}.png`;
      const bytes = alvo.seletor ? await pagina.locator(alvo.seletor).screenshot({ path: ficheiro }) : await pagina.screenshot({ path: ficheiro, fullPage: true });
      resultados.push({ ficheiro, pagina: alvo.id, rota: alvo.rotas[lang], seletor: alvo.seletor, lang, largura,
        sha256: createHash('sha256').update(bytes).digest('hex'), medidas });
    }
    await contexto.close();
    console.log(`E0: três capturas, ${lang}, ${largura} px.`);
  }
} finally {
  await navegador?.close();
  await new Promise(r => servidor.close(r));
}
await fs.writeFile(`${pasta}/capturas-e0.json`, JSON.stringify({ cabeca, construcao: versao, inicio,
  fim: new Date().toISOString(), larguras, capturas: resultados.length, pedidos_externos_recusados: recusados, problemas, resultados }, null, 2) + '\n');
console.log(`E0: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
