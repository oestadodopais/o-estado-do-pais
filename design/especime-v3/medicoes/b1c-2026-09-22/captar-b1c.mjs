/** B1c, 22.09.2026. As capturas da primeira página e do registo, a 390 e a
 * 1 280, nas duas edições. O guião é o de `captar-peca3.mjs`, com duas famílias
 * e duas larguras, e mede o que este bloco mudou: quantas mudanças cada lista
 * rende, se a porta «Todas as mudanças» está lá, e quantas definições do
 * marcador a página tem. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';

const raiz = process.cwd();
const dist = path.join(raiz, 'dist');
const pasta = path.join(raiz, 'design/especime-v3/capturas/b1c-2026-09-22');
const medicoes = path.join(raiz, 'design/especime-v3/medicoes/b1c-2026-09-22');
const larguras = [390, 1280];
const paginas = [
  ['pais', 'pt', '/'],
  ['pais', 'en', '/en/'],
  ['registo', 'pt', '/correcoes/'],
  ['registo', 'en', '/en/corrections/'],
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
        const valores = [...document.querySelectorAll('.texto-figura, .claim-value, [data-registo-linha$=".impresso"]')];
        const selos = [...document.querySelectorAll('.src-chip')];
        const partidos = (nos) => nos.filter((n) => new Set([...n.getClientRects()].filter((r) => r.width && r.height).map((r) => Math.round(r.top))).size > 1).length;
        const porta = [...document.querySelectorAll('main .regra-portas a')].map((a) => a.textContent.trim());
        return {
          janela: innerWidth,
          documento: document.documentElement.scrollWidth,
          corpo: document.body.scrollWidth,
          altura: document.documentElement.scrollHeight,
          mudancasNaLista: document.querySelectorAll('[data-mudou-ambito] li[data-mudanca]').length,
          mudancasNoRegisto: document.querySelectorAll('[data-mudou-registo] li[data-mudanca]').length,
          lugaresComPorta: document.querySelectorAll('[data-mudou-registo] .registo-lugar[href]').length,
          portasDeMudancas: porta,
          marcadores: document.querySelectorAll('.marcador').length,
          definicoesDoMarcador: document.querySelectorAll('.marcador-definicao').length,
          valores: valores.length,
          selos: selos.length,
          valoresPartidos: partidos(valores),
          selosPartidos: partidos(selos),
          selosSemNowrap: selos.filter((n) => getComputedStyle(n).whiteSpace !== 'nowrap').length,
        };
      });
      const ficheiro = `depois-${familia}-${lingua}-${largura}.png`;
      const bytes = await pagina.screenshot({ path: path.join(pasta, ficheiro), fullPage: true, animations: 'disabled' });
      resultados.push({ ficheiro, rota, familia, lingua, largura, ...medida, deslocamento: Math.max(medida.documento, medida.corpo) - medida.janela, sha256: createHash('sha256').update(bytes).digest('hex') });
      await contexto.close();
    }
  }
  const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  await fs.writeFile(path.join(medicoes, 'capturas-b1c.json'), JSON.stringify({ cabeca, navegador: navegador.version(), resultados }, null, 2) + '\n');
  /* Os positivos conhecidos deste guião: uma captura sem deslocamento lateral,
     sem valor nem selo partido, com a porta «Todas as mudanças» em cada página
     do país, com o teto respeitado e com uma definição do marcador por página
     quando há marcador. Uma medição que não morda nada não mediu nada. */
  const falhas = resultados.filter(
    (r) =>
      r.deslocamento > 0 ||
      r.valoresPartidos ||
      r.selosPartidos ||
      r.selosSemNowrap ||
      r.definicoesDoMarcador > 1 ||
      (r.marcadores > 0 && r.definicoesDoMarcador !== 1) ||
      (r.familia === 'pais' && (r.mudancasNaLista === 0 || r.mudancasNaLista > 8 || r.portasDeMudancas.length !== 1)) ||
      (r.familia === 'registo' && (r.mudancasNoRegisto === 0 || r.lugaresComPorta !== r.mudancasNoRegisto)),
  );
  if (falhas.length) throw new Error(`Capturas com defeito: ${falhas.map((f) => f.ficheiro).join(', ')}`);
  console.log(`${resultados.length} capturas; listas do país: ${resultados.filter((r) => r.familia === 'pais').map((r) => r.mudancasNaLista).join(', ')}; registo: ${resultados.filter((r) => r.familia === 'registo').map((r) => r.mudancasNoRegisto).join(', ')}.`);
} finally {
  await navegador?.close();
  await new Promise((resolve) => servidor.close(resolve));
}
