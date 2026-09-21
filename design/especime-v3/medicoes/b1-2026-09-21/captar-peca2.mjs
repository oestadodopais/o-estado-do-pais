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
const pasta = path.join(raiz, 'design/especime-v3/capturas/b1-2026-09-21');
const medicoes = path.join(raiz, 'design/especime-v3/medicoes/b1-2026-09-21');
const larguras = [390, 768, 1024, 1280, 1600];
/* AS OITO PÁGINAS DA PEÇA 2, e cada uma está aqui por um caso:
     · Évora, que é a maqueta e o único concelho com estudos e com registo;
     · Vila Real de Santo António, o primeiro dos dez fora do limite legal;
     · Penedono, cujo índice de dívida a fonte não publica (a leitura perde
       metade e o cartão leva a marca);
     · Espinho, um concelho de um distrito repartido por duas regiões (a linha
       diz «Portugal › Norte › Aveiro › Espinho»);
     · Corvo, uma ilha;
     · a página dos lugares;
     · uma região e um distrito, para o corte das duas frases.
   As inglesas são as mesmas rotas na outra edição, a 390 e a 1 280. */
const cincoLarguras = [
  ['evora', 'pt', '/municipios/evora/'],
  ['vila-real-de-santo-antonio', 'pt', '/municipios/vila-real-de-santo-antonio/'],
  ['penedono', 'pt', '/municipios/penedono/'],
  ['espinho', 'pt', '/municipios/espinho/'],
  ['corvo', 'pt', '/municipios/corvo/'],
  ['lugares', 'pt', '/lugares/'],
  ['regiao', 'pt', '/regioes/alentejo/'],
  ['distrito', 'pt', '/distritos/evora/'],
];
const duasLarguras = [
  ['evora', 'en', '/en/municipalities/evora/'],
  ['vila-real-de-santo-antonio', 'en', '/en/municipalities/vila-real-de-santo-antonio/'],
  ['penedono', 'en', '/en/municipalities/penedono/'],
  ['espinho', 'en', '/en/municipalities/espinho/'],
  ['corvo', 'en', '/en/municipalities/corvo/'],
  ['lugares', 'en', '/en/places/'],
  ['regiao', 'en', '/en/regions/alentejo/'],
  ['distrito', 'en', '/en/districts/evora/'],
];
const paginas = [...cincoLarguras, ...duasLarguras];
const larguraDe = (lingua) => (lingua === 'pt' ? larguras : [390, 1280]);
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
      const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
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
          titulo: document.querySelector('h1')?.textContent.trim(), valores: valores.length, selos: selos.length,
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
  await fs.writeFile(path.join(medicoes, `capturas-${fase}-peca2.json`), JSON.stringify({ cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), navegador: navegador.version(), resultados }, null, 2) + '\n');
  /* A PÁGINA DE UMA UNIDADE DA CARTA NÃO PUBLICA VALORES, e não é um defeito: é
     um índice dos concelhos daquela unidade, com o mapa deles, e o livro-razão
     não tem uma única linha de distrito ou de ilha (é o que a I8 da régua do
     índice mede). A conta dos valores passa a ser um positivo conhecido do
     conjunto — alguma captura TEM de os ter, senão a medida não mediu nada — e
     não uma exigência por página. */
  const semValores = resultados.every(r => !r.valores);
  if (fase === 'depois' && (semValores || resultados.some(r => r.deslocamento > 0 || r.valoresPartidos || r.selosPartidos || r.separadoresQuebraveis || r.selosSemNowrap)))
    throw new Error('Há deslocamento lateral, valor partido ou selo sem nowrap nas capturas depois, ou nenhuma captura tem valores.');
  console.log(`${resultados.length} capturas ${fase}; ${resultados.filter(r => r.deslocamento > 0).length} com deslocamento lateral; ${resultados.filter(r => r.valores).length} com valores selados.`);
} finally {
  await navegador?.close();
  await new Promise(resolve => servidor.close(resolve));
}
