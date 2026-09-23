/** check:cabeca, C1: a hierarquia dos títulos interiores, medida no navegador.
 * Corre no verify, nas famílias do mandato B2, nas duas edições e nas cinco
 * larguras. O predicado vive em tests/inicio/cabeca.mjs e serve também o captor.
 * A planta corre este mesmo portão num processo separado, com o título europeu
 * no tamanho antigo. Exige o código de saída real 1 e a falha C1 esperada.
 * Só injeta CSS no navegador desse processo; nunca altera os bytes de dist/.
 * OEDP_DIST escolhe a construção; --json <ficheiro> guarda as medidas.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { falhasDaCabeca } from './cabeca.mjs';

const args = process.argv.slice(2);
let saida, plantar = false;
while (args.length) {
  const arg = args.shift();
  if (arg === '--json' && args[0]) saida = args.shift();
  else if (arg === '--planta-titulo-europeu') plantar = true;
  else throw Error(`Argumento desconhecido ou incompleto: ${arg}`);
}
const dist = path.resolve(process.env.OEDP_DIST ?? 'dist');
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
const inicio = new Date().toISOString();
const larguras = [390, 768, 1024, 1280, 1600];
const paginas = [
  ['temas', '/temas/', '/en/themes/'],
  ['europeia', '/uniao-europeia/', '/en/european-union/'],
  ['lugares', '/lugares/', '/en/places/'],
  ['concelho', '/municipios/mourao/', '/en/municipalities/mourao/'],
  ['estudos', '/estudos/', '/en/studies/'],
  ['estudo', '/estudos/evora-prometido-pago-auditado-2026/', '/en/studies/evora-prometido-pago-auditado-2026/'],
  ['sobre', '/sobre/', '/en/about/'],
  ['metodo', '/metodo/', '/en/method/'],
  ['correcoes', '/correcoes/', '/en/corrections/'],
  ['agenda', '/agenda/', '/en/agenda/'],
  ['recibo', '/livro-razao/divida-publica-2025/', '/en/ledger/divida-publica-2025/'],
];
const europeias = paginas.filter(([familia]) => familia === 'europeia');
const servidor = http.createServer(async (req, res) => {
  try {
    let p = path.resolve(dist, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!p.startsWith(dist + path.sep)) throw Error('Caminho inválido');
    if ((await fs.stat(p)).isDirectory()) p = path.join(p, 'index.html');
    res.setHeader('Content-Type', { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2' }[path.extname(p)] ?? 'application/octet-stream');
    res.end(await fs.readFile(p));
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const origem = `http://127.0.0.1:${servidor.address().port}`;
let navegador, temporaria;
const falhas = [];
try {
  navegador = await chromium.launch({ headless: true });
  const pagina = await navegador.newPage({ viewport: { width: larguras[0], height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' });
  await pagina.route('**/*', r => new URL(r.request().url()).origin === origem ? r.continue() : r.abort());

  async function medir(familias, comEstrago = false) {
    const resultados = [];
    for (const [familia, pt, en] of familias) for (const [lingua, rota] of [['pt', pt], ['en', en]]) {
      for (const largura of larguras) {
        await pagina.setViewportSize({ width: largura, height: 900 });
        const resposta = await pagina.goto(origem + rota, { waitUntil: 'load' });
        if (resposta?.status() !== 200) throw Error(`${rota}: não abriu`);
        await pagina.evaluate(() => document.fonts.ready);
        if (comEstrago) {
          await pagina.addStyleTag({ content: 'h1 { font-size: clamp(26px, 3.2vw, 40px) !important; }' });
          await pagina.waitForFunction(() => Math.abs(parseFloat(getComputedStyle(document.querySelector('h1')).fontSize) - Math.max(26, Math.min(40, innerWidth * .032))) < .001);
        }
        const medida = await pagina.evaluate(() => {
          const marca = document.querySelector('.wordmark'), titulo = document.querySelector('h1');
          return {
            wordmark: { elemento: marca?.tagName.toLowerCase() ?? null, tamanho: marca ? parseFloat(getComputedStyle(marca).fontSize) : null },
            h1: { quantidade: document.querySelectorAll('h1').length, tamanho: titulo ? parseFloat(getComputedStyle(titulo).fontSize) : null },
          };
        });
        const r = { familia, lingua, largura, ficheiro: rota, ...medida };
        resultados.push({ ...r, falhas: falhasDaCabeca(r) });
      }
    }
    return resultados;
  }

  const limpas = plantar ? [] : await medir(paginas);
  let estragadas = plantar ? await medir(europeias, true) : [], repostas = [], plantas = [];
  falhas.push(...(plantar ? estragadas : limpas).flatMap(r => r.falhas.map(f => `${f} (${r.lingua}, ${r.largura} px)`)));
  if (!plantar) {
    temporaria = await fs.mkdtemp(path.join(os.tmpdir(), 'oedp-cabeca-'));
    const prova = path.join(temporaria, 'planta.json');
    const argumentos = [fileURLToPath(import.meta.url), '--planta-titulo-europeu', '--json', prova];
    const corrida = await new Promise(resolve => {
      execFile(process.execPath, argumentos, { env: { ...process.env, OEDP_DIST: dist }, maxBuffer: 1024 * 1024 }, (erro, stdout, stderr) => {
        resolve({ codigo: erro ? erro.code : 0, stdout, stderr });
      });
    });
    const registoDaPlanta = JSON.parse(await fs.readFile(prova, 'utf8'));
    estragadas = registoDaPlanta.estragadas;
    repostas = await medir(europeias);
    const mordidas = estragadas.filter(r => r.falhas.length);
    const caso = r => `${r.familia}:${r.lingua}:${r.largura}`;
    const base = new Map(limpas.map(r => [caso(r), r]));
    const reposicao = repostas.every(r => JSON.stringify(r) === JSON.stringify(base.get(caso(r))));
    const marcaIntacta = estragadas.every(r => JSON.stringify(r.wordmark) === JSON.stringify(base.get(caso(r))?.wordmark));
    const passou = corrida.codigo === 1 && registoDaPlanta.cabeca === versao.commit && estragadas.length === europeias.length * 2 * larguras.length &&
      mordidas.length === 4 && mordidas.every(r => [768, 1024].includes(r.largura) && r.falhas.every(f => /C1, wordmark/.test(f))) &&
      ['pt', 'en'].every(l => mordidas.filter(r => r.lingua === l).length === 2) && marcaIntacta && reposicao;
    plantas = [{ nome: 'b2-titulo-europeu-anterior', comando: 'node tests/inicio/hierarquia-b2.mjs --planta-titulo-europeu',
      codigo: corrida.codigo, mordida: 'C1, wordmark maior ou igual ao H1 nas duas edições a 768 e 1024', passou,
      marca_intacta: marcaIntacta, reposicao, casos: mordidas, stdout: corrida.stdout, stderr: corrida.stderr }];
    if (!passou) falhas.push('C1, a planta do título europeu não produziu o código e as falhas esperadas, ou a reposição divergiu');
  }
  const registo = { cabeca: versao.commit, construido_em: versao.construido_em, inicio, fim: new Date().toISOString(),
    familias: paginas.map(([familia]) => familia), larguras, edicoes: ['pt', 'en'], limpas, estragadas, repostas, plantas, falhas };
  if (saida) {
    await fs.mkdir(path.dirname(saida), { recursive: true });
    await fs.writeFile(saida, JSON.stringify(registo, null, 2) + '\n');
  }
  console.log(`check:cabeca C1; construção ${versao.commit}; ${limpas.length} cabeças; ${estragadas.filter(r => r.falhas.length).length} mordidas; ${repostas.length} reposições`);
  for (const falha of falhas) console.error(falha);
  console.log(`check:cabeca: ${falhas.length ? 'FAIL' : 'PASS'}`);
  if (falhas.length) process.exitCode = 1;
} finally {
  await navegador?.close();
  await new Promise(r => servidor.close(r));
  if (temporaria) await fs.rm(temporaria, { recursive: true, force: true });
}
