/** Recibos alterados na JD1-d, nas duas línguas e cinco larguras. */
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

// JD1-d: só os recibos alterados, nas cinco larguras.
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const dist = path.join(raiz, 'dist');
const pasta = 'design/especime-v3/medicoes/jd1-2026-10-06';
const saida = 'design/especime-v3/capturas/jd1-2026-10-06/jd1d';
const manifesto = `${pasta}/capturas-d.json`;
const argumentos = process.argv.slice(2);
assert(argumentos.length === 0 || (argumentos.length === 2 && argumentos[0] === '--code-head'),
  'Uso: node captar-d.mjs [--code-head <cabeça do código>].');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', cwd: raiz }).trim();
const cabeca = git('rev-parse', 'HEAD');
const cabecaCodigo = git('rev-parse', '--verify', `${argumentos[1] ?? 'HEAD'}^{commit}`);
execFileSync('git', ['merge-base', '--is-ancestor', cabecaCodigo, cabeca], { cwd: raiz });
const versaoOriginal = await fs.readFile(path.join(dist, 'version.json'), 'utf8');
const versao = JSON.parse(versaoOriginal);
assert.equal(versao.commit, cabecaCodigo, 'dist/version.json não é a cabeça do código pedida.');
// O último commit pode conter apenas provas. Nunca se isentam os compositores, as definições ou outros guiões.
const prova = p => /^design\/especime-v3\/medicoes\/jd1-2026-10-06\/(?:frases|plantas|controlos|fontes|fecho)-d\.json$/.test(p) || p === `${pasta}/LEIA-ME.md` || p === manifesto || p.startsWith(`${saida}/`) || p.startsWith(`${pasta}/portoes-d/`);
function conferirCodigo() {
  const alterados = git('diff', '--name-only', cabecaCodigo, '--').split('\n').filter(Boolean);
  const novos = git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean);
  const fora = [...alterados, ...novos].filter(p => !prova(p));
  assert.equal(fora.length, 0, `Há mudanças fora das provas desde a cabeça do código: ${fora.join(', ')}`);
}
conferirCodigo();
const cruzamento = JSON.parse(await fs.readFile(path.join(raiz, 'ledger/cruzamentos/jd1.json'), 'utf8'));
const linhas = ['amortizacoes-e-anulacoes-de-divida-fundada-2025', 'juros-das-administracoes-publicas-2024', 'juros-das-administracoes-publicas-2025'];
assert(linhas.every(id => cruzamento.rows[id]), 'Falta uma linha alterada no cruzamento.');
const ids = Object.fromEntries(linhas.map(id => [id, id]));
const larguras = [390, 768, 1024, 1280, 1600];
function conferirPortas(portas, largura) {
  const erros = [];
  if (largura < 1024) {
    if (portas.some(p => !p.rotulo_acima)) erros.push('O rótulo da página não fica acima do endereço.');
    if (portas.some(p => p.alvo < 44)) erros.push('A ligação ao documento não conserva a área de toque mínima.');
  }
  return erros;
}
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
const capturas = [], problemas = [];
await fs.mkdir(path.join(raiz, saida), { recursive: true });
try {
  for (const [nome, id] of Object.entries(ids)) for (const lingua of ['pt', 'en']) for (const largura of larguras) {
    const context = await browser.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    const p = await context.newPage();
    p.on('pageerror', e => problemas.push(`${nome}/${lingua}/${largura}: ${e.message}`));
    const url = (lingua === 'pt' ? '/livro-razao/' : '/en/ledger/') + id + '/';
    const response = await p.goto(base + url, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    if (response.status() !== 200) problemas.push(`${url}: HTTP ${response.status()}`);
    const medidas = await p.evaluate(() => {
      const texto = s => (document.querySelector(s)?.textContent ?? '').replace(/\s+/g, ' ').trim();
      return { largura: innerWidth, documento: document.documentElement.scrollWidth,
        titulo: texto('.linha-cabeca h1'),
        frase: texto('[data-o-que-e-parte="o-que-e"]') || texto('[data-o-que-e-da-serie] .linha-o-que-e-frase'),
        ultimo: texto('[data-serie-ultimo]'),
        parcela: texto('[data-jd1-parcela]'),
        evolucao: texto('[data-jd1-evolucao]'),
        excerto: texto('[data-linha-campo="excerpt"]'),
        cabecalho: [...document.querySelectorAll('.linha-quadro-financiamento thead th')].map(e => e.textContent.trim()),
        excerto_grafico: document.querySelector('.linha-excerto-grafico') ? {whiteSpace: getComputedStyle(document.querySelector('.linha-excerto-grafico')).whiteSpace, largura: document.querySelector('.linha-excerto-grafico').clientWidth, conteudo: document.querySelector('.linha-excerto-grafico').scrollWidth} : null,
        por_confirmar: document.querySelectorAll('[data-por-confirmar-na-fonte]').length,
        portas: [...document.querySelectorAll('.linha-endereco-abrir')].map(e => {
          const rotulo = e.getBoundingClientRect(), endereco = e.parentElement.querySelector('.linha-endereco-bruto').getBoundingClientRect();
          return { rotulo_acima: endereco.top >= rotulo.bottom - 1, alvo: e.parentElement.getBoundingClientRect().height };
        }) };
    });
    if (medidas.documento > largura) problemas.push(`${url}: largura ${medidas.documento} excede ${largura}`);
    if (medidas.excerto_grafico && medidas.excerto_grafico.whiteSpace !== 'pre') problemas.push(`${url}: os espaços do excerto foram colapsados`);
    if (!medidas.frase || medidas.por_confirmar) problemas.push(`${url}: frase ausente ou por confirmar`);
    problemas.push(...conferirPortas(medidas.portas, largura).map(e => `${url}: ${e}`));
    const ficheiro = `${saida}/${nome}-${lingua}-${largura}.png`;
    const bytes = await p.screenshot({ path: path.join(raiz, ficheiro), fullPage: true });
    capturas.push({ ficheiro, url, lingua, largura, medidas, sha256: createHash('sha256').update(bytes).digest('hex') });
    await context.close();
  }
} finally { await browser.close(); servidor.close(); }
conferirCodigo();
assert.equal(await fs.readFile(path.join(dist, 'version.json'), 'utf8'), versaoOriginal, 'A construção mudou durante as capturas.');
assert.equal(capturas.length, linhas.length * 2 * larguras.length, 'Faltam capturas dos recibos alterados.');
assert.equal(new Set(capturas.map(c => `${c.url}/${c.largura}`)).size, capturas.length, 'Há capturas repetidas.');
const comando = `node ${pasta}/captar-d.mjs --code-head ${cabecaCodigo}`;
await fs.writeFile(path.join(raiz, manifesto), JSON.stringify({ comando, cabeca, cabeca_codigo: cabecaCodigo, construcao: versao.commit, linhas, larguras, capturas, problemas }, null, 2) + '\n');
console.log(`Capturas: ${capturas.length}; problemas: ${problemas.length}.`);
if (problemas.length) { console.error(problemas.join('\n')); process.exitCode = 1; }
