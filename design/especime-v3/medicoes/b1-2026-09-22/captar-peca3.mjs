import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';

const fase = process.argv[2];
if (!['antes', 'depois'].includes(fase)) throw new Error('Indique antes ou depois.');
const raiz = process.cwd();
const dist = path.join(raiz, 'dist');
const pasta = path.join(raiz, 'design/especime-v3/capturas/b1-2026-09-22');
const medicoes = path.join(raiz, 'design/especime-v3/medicoes/b1-2026-09-22');
const larguras = [390, 768, 1024, 1280, 1600];
const familias = [
  ['pais', '/', '/en/'], ['temas', '/temas/', '/en/themes/'],
  ['concelho', '/municipios/evora/', '/en/municipalities/evora/'],
  ['estudo', '/estudos/evora-2027-prometido-painel-dinheiro/', '/en/studies/evora-2027-prometido-painel-dinheiro/'],
  ['sobre', '/sobre/', '/en/about/'],
];
const paginas = familias.filter(f => fase === 'depois' || ['pais', 'sobre'].includes(f[0]))
  .flatMap(([nome, pt, en]) => fase === 'antes' ? [[nome, 'pt', pt]] : [[nome, 'pt', pt], [nome, 'en', en]]);
const larguraDe = lingua => fase === 'antes' || lingua === 'en' ? [390, 1280] : larguras;
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
await new Promise(resolve => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
let navegador;
const resultados = [];
try {
  navegador = await chromium.launch({ headless: true });
  for (const [familia, lingua, rota] of paginas) {
    for (const largura of larguraDe(lingua)) {
      const contexto = await navegador.newContext({ viewport: { width: largura, height: 800 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', pedido => pedido.request().url().startsWith(origem) ? pedido.continue() : pedido.abort());
      const pagina = await contexto.newPage();
      const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) throw new Error(`${rota}: HTTP ${resposta.status()}`);
      await pagina.evaluate(() => document.fonts.ready);
      const medida = await pagina.evaluate(() => {
        const valores = [...document.querySelectorAll('.texto-figura, .claim-value, [data-registo-linha$=".impresso"]')];
        const selos = [...document.querySelectorAll('.src-chip')];
        const partidos = nos => nos.filter(n => new Set([...n.getClientRects()].filter(r => r.width && r.height).map(r => Math.round(r.top))).size > 1).length;
        return { janela: innerWidth, documento: document.documentElement.scrollWidth, corpo: document.body.scrollWidth,
          finalDaIAInteiro: (() => { const f = document.querySelector('[data-rotulo-ia="rodape"] .rotulo-ia-final'); return !!f && f.getClientRects().length === 1 && getComputedStyle(f).whiteSpace === 'nowrap' && f.textContent.endsWith('.'); })(),
          titulo: document.querySelector('h1')?.textContent.trim(),
          menu: [...document.querySelectorAll('#nav-principal a')].map(a => ({ texto: a.textContent.trim(), y: a.getBoundingClientRect().y, largura: a.getBoundingClientRect().width })),
          leitura: document.querySelector('[data-leitura-pais]')?.getBoundingClientRect().toJSON(),
          mapa: document.querySelector('[data-mapa]')?.getBoundingClientRect().toJSON(),
          primeiroCartao: document.querySelector('[data-tema] [data-cartao-medida]')?.getBoundingClientRect().toJSON(), valores: valores.length, selos: selos.length,
          valoresPartidos: partidos(valores), selosPartidos: partidos(selos),
          separadoresQuebraveis: valores.filter(n => /\d[ \u2009]\d/.test(n.textContent)).length,
          selosSemNowrap: selos.filter(n => getComputedStyle(n).whiteSpace !== 'nowrap').length };
      });
      const ficheiro = `${fase}-${familia}-${lingua}-${largura}.png`;
      if (fase === 'depois' && [390, 1280].includes(largura)) await pagina.screenshot({ path: path.join(pasta, `janela-${familia}-${lingua}-${largura}.png`), animations: 'disabled' });
      const bytes = await pagina.screenshot({ path: path.join(pasta, ficheiro), fullPage: true, animations: 'disabled' });
      resultados.push({ ficheiro, rota, familia, lingua, largura, ...medida, deslocamento: Math.max(medida.documento, medida.corpo) - medida.janela, sha256: createHash('sha256').update(bytes).digest('hex') });
      await contexto.close();
    }
  }
  await fs.writeFile(path.join(medicoes, `capturas-${fase}-peca3.json`), JSON.stringify({ cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), navegador: navegador.version(), resultados }, null, 2) + '\n');
  /* A PÁGINA DE UMA UNIDADE DA CARTA NÃO PUBLICA VALORES, e não é um defeito: é
     um índice dos concelhos daquela unidade, com o mapa deles, e o livro-razão
     não tem uma única linha de distrito ou de ilha (é o que a I8 da régua do
     índice mede). A conta dos valores passa a ser um positivo conhecido do
     conjunto — alguma captura TEM de os ter, senão a medida não mediu nada — e
     não uma exigência por página. */
  const semValores = resultados.every(r => !r.valores);
  if (fase === 'depois' && (semValores || resultados.some(r => !r.finalDaIAInteiro || r.menu.length !== 5 || r.menu.some(a => a.y !== r.menu[0].y) || r.deslocamento > 0 || r.valoresPartidos || r.selosPartidos || r.separadoresQuebraveis || r.selosSemNowrap)))
    throw new Error('Há deslocamento lateral, valor partido ou selo sem nowrap nas capturas depois, ou nenhuma captura tem valores.');
  console.log(`${resultados.length} capturas ${fase}; ${resultados.filter(r => r.deslocamento > 0).length} com deslocamento lateral; ${resultados.filter(r => r.valores).length} com valores selados.`);
} finally {
  await navegador?.close();
  await new Promise(resolve => servidor.close(resolve));
}
