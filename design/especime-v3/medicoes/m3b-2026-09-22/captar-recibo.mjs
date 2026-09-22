/**
 * A CAPTURA DO RECIBO COM OS NOMES OFICIAIS DE VOLTA (bloco M3b, 22.09.2026).
 *
 * O recibo de `despesa-em-id-2024`, que é a linha com os dois nomes confirmados
 * (o do INE e o da PORDATA), nas duas edições e a 390 e a 1 280 px. O guião é o
 * de `design/especime-v3/medicoes/b1-2026-09-22/captar-peca3.mjs`: serve o
 * `dist/` por um servidor próprio, corta a rede para fora, e mede a página ao
 * mesmo tempo que a fotografa.
 *
 * Uso:  node design/especime-v3/medicoes/m3b-2026-09-22/captar-recibo.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(AQUI, '..', '..', '..', '..');
const dist = path.join(raiz, 'dist');
const pasta = path.join(raiz, 'design/especime-v3/capturas/m3b-2026-09-22');
const larguras = [390, 1280];
const paginas = [
  ['recibo', 'pt', '/livro-razao/despesa-em-id-2024/'],
  ['recibo', 'en', '/en/ledger/despesa-em-id-2024/'],
];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    let ficheiro = path.resolve(dist, '.' + decodeURIComponent(new URL(pedido.url, 'http://localhost').pathname));
    if (!ficheiro.startsWith(dist + path.sep) && ficheiro !== dist) throw new Error('Caminho inválido');
    if ((await fs.stat(ficheiro)).isDirectory()) ficheiro = path.join(ficheiro, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(ficheiro)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(ficheiro));
  } catch {
    resposta.writeHead(404).end();
  }
});
await fs.mkdir(pasta, { recursive: true });
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
let navegador;
const resultados = [];
try {
  navegador = await chromium.launch({ headless: true });
  for (const [familia, lingua, rota] of paginas) {
    for (const largura of larguras) {
      const contexto = await navegador.newContext({ viewport: { width: largura, height: 800 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (pedido) => (pedido.request().url().startsWith(origem) ? pedido.continue() : pedido.abort()));
      const pagina = await contexto.newPage();
      const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) throw new Error(`${rota}: HTTP ${resposta.status()}`);
      await pagina.evaluate(() => document.fonts.ready);
      const medida = await pagina.evaluate(() => {
        const oficiais = [...document.querySelectorAll('[data-nonledger="nome-oficial-da-medida"]')];
        const valores = [...document.querySelectorAll('.texto-figura, .claim-value, [data-registo-linha$=".impresso"]')];
        const selos = [...document.querySelectorAll('.src-chip')];
        const partidos = (nos) => nos.filter((n) => new Set([...n.getClientRects()].filter((r) => r.width && r.height).map((r) => Math.round(r.top))).size > 1).length;
        return {
          janela: innerWidth,
          documento: document.documentElement.scrollWidth,
          corpo: document.body.scrollWidth,
          altura: document.documentElement.scrollHeight,
          titulo: document.querySelector('h1')?.textContent.trim(),
          nomesOficiais: oficiais.map((n) => ({
            rotulo: n.closest('dd')?.previousElementSibling?.textContent.trim() ?? null,
            texto: n.querySelector('a')?.textContent.trim() ?? null,
            href: n.querySelector('a')?.getAttribute('href') ?? null,
            caixa: n.getBoundingClientRect().toJSON(),
            transborda: n.getBoundingClientRect().right > document.documentElement.clientWidth,
          })),
          valores: valores.length,
          selos: selos.length,
          valoresPartidos: partidos(valores),
          selosPartidos: partidos(selos),
        };
      });
      const ficheiro = `recibo-despesa-em-id-2024-${lingua}-${largura}.png`;
      const bytes = await pagina.screenshot({ path: path.join(pasta, ficheiro), fullPage: true, animations: 'disabled' });
      resultados.push({ ficheiro, rota, familia, lingua, largura, ...medida, deslocamento: Math.max(medida.documento, medida.corpo) - medida.janela, sha256: createHash('sha256').update(bytes).digest('hex') });
      await contexto.close();
    }
  }
  const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: raiz, encoding: 'utf8' }).trim();
  await fs.writeFile(path.join(AQUI, 'capturas-recibo.json'), `${JSON.stringify({ cabeca, navegador: navegador.version(), resultados }, null, 2)}\n`);
  /* OS CONHECIDOS-POSITIVOS DESTA MEDIÇÃO: alguma captura TEM de ter os dois
     nomes oficiais, senão a medida não mediu nada; e nenhuma pode ter
     deslocamento lateral, um valor partido ou um nome a transbordar. */
  if (resultados.some((r) => r.nomesOficiais.length !== 2))
    throw new Error('Um recibo de despesa-em-id-2024 não tem os dois nomes oficiais: a medição não mediu o que devia.');
  if (resultados.some((r) => r.deslocamento > 0 || r.valoresPartidos || r.selosPartidos || r.nomesOficiais.some((n) => n.transborda)))
    throw new Error('Há deslocamento lateral, valor partido ou nome a transbordar numa captura.');
  console.log(
    `${resultados.length} capturas · ${resultados.map((r) => `${r.lingua}/${r.largura}: ${r.nomesOficiais.length} nomes oficiais, altura ${Math.round(r.altura)} px`).join(' · ')}`,
  );
} finally {
  await navegador?.close();
  await new Promise((resolve) => servidor.close(resolve));
}
