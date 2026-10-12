/** EX1-f: as duas edições, o saldo do mesmo perímetro e as capturas da construção da cabeça. Sem rede externa. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { textoSemSelos, conferirOrigensDasExplicacoes } from '../../../../tests/explicacoes/explicacao.mjs';

const PASTA = 'design/especime-v3/medicoes/ex2-2026-10-06';
const CAP = 'design/especime-v3/capturas/ex2-2026-10-06';
const DIST = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = JSON.parse(await fs.readFile(path.join(DIST, 'version.json'), 'utf8'));
if (versao.commit !== cabeca) throw Error('EX1-f: a construção não é da cabeça');
const linhas = loadClaims();
const ids = ['execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social', 'execucao-2026-08-receita-efetiva-administracao-central-seguranca-social', 'execucao-2026-08-saldo-global-administracao-central-seguranca-social', 'oe-2026-saldo-global-administracao-central-seguranca-social'];
const medidas = ids.map(id => {
  const l = linhas.get(id);
  return { id, value: l.value, unit: l.unit, reference_date: l.reference_date, name: l.name, document: l.document, excerpt: l.excerpt, ressalva: l.ressalva, note: l.note };
});
const decimos = s => Number(s.replace(/[\s ]/g, '').replace('−', '-').replace(',', ''));
const saldoConfere = decimos(medidas[1].value) - decimos(medidas[0].value) === decimos(medidas[2].value);
if (!saldoConfere) throw Error('EX1-f: o saldo não é a receita menos a despesa');
const origens = conferirOrigensDasExplicacoes();
if (origens.erros.length) throw Error(origens.erros.join('\n'));
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const servidor = http.createServer(async (req, res) => {
  try {
    let f = path.resolve(DIST, '.' + new URL(req.url, 'http://local').pathname);
    if (!f.startsWith(DIST + path.sep) && f !== DIST) throw Error('fora');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    res.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    res.end(await fs.readFile(f));
  } catch { res.writeHead(404).end(); }
});
await new Promise(ok => servidor.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const capturas = [], paginas = [], erros = [];
let browser;
await fs.mkdir(CAP, { recursive: true });
try {
  browser = await chromium.launch({ headless: true });
  for (const [lang, rota] of [['pt', '/explicacoes/dinheiro-do-estado-2026/'], ['en', '/en/explainers/dinheiro-do-estado-2026/']]) {
    const html = parse(await fs.readFile(path.join(DIST, rota, 'index.html'), 'utf8'));
    const saldo = textoSemSelos(html.querySelector('[data-explicacao-paragrafo="seccoes[2].conteudo[1].paragrafo"]'));
    const limite = textoSemSelos(html.querySelector('[data-explicacao-paragrafo="naoDiz[0]"]'));
    const abertura = textoSemSelos(html.querySelector('[data-explicacao-paragrafo="abertura[0]"]'));
    const frases = [saldo];
    const ordem = html.querySelectorAll('[data-explicacao-paragrafo]').map(p => p.getAttribute('data-explicacao-paragrafo'));
    if (ordem.indexOf('seccoes[3].conteudo[0].paragrafo') !== ordem.indexOf('seccoes[2].conteudo[1].paragrafo') + 1) throw Error('EX1-f: as contas públicas não são o parágrafo seguinte');
    paginas.push({ lang, rota, frases, ordem, limite, saldoSeguinte: textoSemSelos(html.querySelector('[data-explicacao-paragrafo="seccoes[3].conteudo[0].paragrafo"]')) });
    for (const largura of [390, 1280]) {
      const ctx = await browser.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' });
      await ctx.route('**/*', r => r.request().url().startsWith(origem) ? r.continue() : r.abort());
      const p = await ctx.newPage();
      if ((await p.goto(origem + rota, { waitUntil: 'load' })).status() !== 200) throw Error('página em falta');
      await p.evaluate(() => document.fonts.ready);
      const medida = await p.evaluate(() => ({ largura: document.documentElement.scrollWidth, janela: innerWidth }));
      if (medida.largura > largura) erros.push(`${lang}: transbordo a ${largura}`);
      for (const tipo of ['inteira', 'correcoes']) {
        const ficheiro = `${CAP}/ex1f-${lang}-${largura}-${tipo}.png`;
        let opcoes = { path: ficheiro, fullPage: true };
        if (tipo === 'correcoes') {
          const inicio = await p.locator('[data-explicacao-secao="execucao"]').boundingBox();
          const fim = await p.locator('[data-explicacao-paragrafo="naoDiz[0]"]').boundingBox();
          opcoes = { path: ficheiro, fullPage: true, clip: { x: 0, y: inicio.y, width: largura, height: fim.y + fim.height - inicio.y + 16 } };
        }
        const bytes = await p.screenshot(opcoes);
        capturas.push({ lang, largura, tipo, ficheiro, sha256: createHash('sha256').update(bytes).digest('hex'), medida });
      }
      for (const id of ids.slice(2)) {
        await p.locator(`[data-explicacao-secao="execucao"] .claim`).filter({ has: p.locator(`[data-claim="${id}"]`) }).locator('a.src-chip').click();
        if (!new URL(p.url()).pathname.endsWith('/' + id)) throw Error('o selo não abriu o recibo do saldo');
        if (!(await p.locator('main').innerText()).replace(/\s/g, ' ').includes(linhas.get(id).value.replace(/\s/g, ' '))) throw Error('o recibo não mostra o saldo');
        await p.goBack({ waitUntil: 'load' });
      }
      await ctx.close();
    }
  }
} finally { await browser?.close(); servidor.close(); }
const manifesto = { comando: 'RESEARCHHUB_DIR=<motor> node design/especime-v3/medicoes/ex2-2026-10-06/captar-ex1f.mjs', cabeca, versao, medidas, saldoConfere, origens, paginas, capturas, erros };
await fs.writeFile(`${PASTA}/capturas-ex1f.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(JSON.stringify({ cabeca, capturas: capturas.length, erros }));
if (erros.length) process.exitCode = 1;
