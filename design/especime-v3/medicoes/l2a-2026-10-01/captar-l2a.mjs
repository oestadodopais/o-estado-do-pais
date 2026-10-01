/** L2a: «Lugares» e a primeira página, nas duas edições e nas cinco larguras, e «Lugares» a 390 com a gaveta
 * das regiões aberta. O servidor efémero e o bloqueio dos pedidos de fora seguem o captor do N1
 * (`design/especime-v3/medicoes/n1-2026-09-30/captar-n1.mjs`). O manifesto guarda a cabeça da construção, o
 * resumo de cada imagem e as medidas de cada página: a altura, o transbordo, a caixa da pesquisa, do mapa e
 * das duas gavetas em «Lugares», e o sinal da porta e as peças que saíram na primeira página.
 * Uso, da raiz da worktree e depois de uma construção da cabeça: node design/especime-v3/medicoes/l2a-2026-10-01/captar-l2a.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const dist = path.resolve('dist');
const pasta = 'design/especime-v3/medicoes/l2a-2026-10-01';
const saida = 'design/especime-v3/capturas/l2a-2026-10-01';
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = JSON.parse(await fs.readFile('dist/version.json', 'utf8'));
if (versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}).`);
const larguras = [390, 768, 1024, 1280, 1600];
const paginas = [
  { id: 'lugares', rota: { pt: '/lugares/', en: '/en/places/' } },
  { id: 'primeira', rota: { pt: '/', en: '/en/' } },
];
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

/** As medidas que o relatório cita, lidas no navegador. */
const medir = () => {
  const caixa = (sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y + scrollY), largura: Math.round(r.width), altura: Math.round(r.height) };
  };
  /* À VISTA É `checkVisibility()`, E NÃO A CAIXA: o corpo de um `<details>` fechado não se desenha, mas os
     seus elementos continuam a devolver uma caixa com altura, e a primeira corrida deste captor contou assim
     os 38 nomes das duas gavetas fechadas como se estivessem à vista. */
  const visiveis = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.checkVisibility()).length;
  return {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    altura: document.documentElement.scrollHeight,
    h1: document.querySelector('main h1')?.textContent.trim() ?? null,
    pesquisa: caixa('main [data-pesquisa-bloco]'),
    mapa: caixa('main [data-lugares-mapa]'),
    gaveta_das_regioes: caixa('[data-dobra-lugares="regioes"] summary'),
    gaveta_dos_distritos: caixa('[data-dobra-lugares="distritos"] summary'),
    nomes_das_listas_a_vista: visiveis('ul[data-lista-lugares] a'),
    mapas_inteiros: document.querySelectorAll('[data-mapa-raiz][data-postura="inteiro"]').length,
    pesquisas: document.querySelectorAll('[data-pesquisa-bloco]').length,
    sinal: caixa('[data-sinal-dos-lugares]'),
    portas: document.querySelectorAll('[data-indice-assuntos] > li').length,
  };
};

try {
  for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    await contexto.route('**/*', (rota) => rota.request().url().startsWith(origem) ? rota.continue() : (pedidosRecusados.push(rota.request().url()), rota.abort()));
    const page = await contexto.newPage();
    page.on('pageerror', (e) => problemas.push(`${lang}/${largura}: ${e.message}`));
    const fotografa = async (id, rota, nome) => {
      const medidas = await page.evaluate(medir);
      if (medidas.documento > largura + 1) problemas.push(`${id}/${lang}/${largura}: transbordo horizontal`);
      const ficheiro = `${saida}/${nome}.png`;
      const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
      resultados.push({ ficheiro, pagina: id, rota, lang, largura, sha256: createHash('sha256').update(bytes).digest('hex'), medidas });
    };
    for (const p of paginas) {
      const resposta = await page.goto(origem + p.rota[lang], { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) problemas.push(`${p.id}/${lang}/${largura}: HTTP ${resposta.status()}`);
      await page.evaluate(() => document.fonts.ready);
      await fotografa(p.id, p.rota[lang], `${p.id}-${lang}-${largura}`);
    }
    /* A 390, «Lugares» também com a gaveta das regiões aberta: os mesmos nomes, com as mesmas portas. */
    if (largura === 390) {
      await page.goto(origem + paginas[0].rota[lang], { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.locator('[data-dobra-lugares="regioes"] summary').click();
      await fotografa('lugares-regioes-abertas', paginas[0].rota[lang], `lugares-regioes-abertas-${lang}-${largura}`);
    }
    await contexto.close();
    console.log(`L2a: ${lang}, ${largura} px.`);
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'L2a', cabeca, construcao: versao, inicio, fim: new Date().toISOString(), larguras, capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-l2a.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`L2a: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
