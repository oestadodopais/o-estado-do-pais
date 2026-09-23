/** QA do recibo novo, PT/EN a 390 px, sem pedidos externos.
 * node design/especime-v3/medicoes/b2-2026-09-23/qa-recibo-inquilinos.mjs [dist] [commit]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
const raiz = process.cwd(), dist = path.resolve(process.argv[2] ?? 'dist');
const bloco = path.join(raiz, 'design/especime-v3/medicoes/b2-2026-09-23'), base = path.join(bloco, 'qa-recibo-inquilinos-390');
const slug = 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025';
const git = (...args) => execFileSync('git', args, { cwd: raiz, encoding: 'utf8' }).trim();
const esperado = git('rev-parse', process.argv[3] ?? 'HEAD');
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error('A versão do dist não coincide com a cabeça pedida para o QA.');
const sha = b => createHash('sha256').update(b).digest('hex');
const inicio = new Date(), resultados = [], falhas = [], log = [];
await fs.rm(base + '.codigo', { force: true });
await fs.writeFile(base + '.inicio', inicio.toISOString() + '\n');
await fs.writeFile(base + '.cabeca', esperado + '\n');
await fs.mkdir(path.join(bloco, 'capturas'), { recursive: true });
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const servidor = http.createServer(async (req, res) => {
  try {
    let f = path.resolve(dist, '.' + decodeURIComponent(new URL(req.url, 'http://local').pathname));
    if (f !== dist && !f.startsWith(dist + path.sep)) throw new Error('Caminho inválido');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    res.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    res.end(await fs.readFile(f));
  } catch { res.writeHead(404).end(); }
});
let navegador;
try {
  await new Promise((resolve, reject) => { servidor.once('error', reject); servidor.listen(0, '127.0.0.1', resolve); });
  const origem = `http://127.0.0.1:${servidor.address().port}`;
  navegador = await chromium.launch({ headless: true });
  for (const [lingua, rota] of [['pt', `/livro-razao/${slug}/`], ['en', `/en/ledger/${slug}/`]]) {
    const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    const pagina = await contexto.newPage(), externos = [], erros = [];
    await contexto.route('**/*', r => {
      if (new URL(r.request().url()).origin === origem) return r.continue();
      externos.push(r.request().url()); return r.abort();
    });
    pagina.on('pageerror', e => erros.push(e.message));
    const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
    if (resposta?.status() !== 200) throw new Error(`${rota}: HTTP ${resposta?.status()}`);
    await pagina.evaluate(() => document.fonts.ready);
    const definicao = pagina.locator(`[data-definicao="${slug}"]`);
    if (await definicao.count() !== 1) throw new Error(`${rota}: a definição não é única`);
    const medir = () => definicao.evaluate(el => {
      const texto = e => e?.textContent.replace(/\s+/g, ' ').trim() ?? null;
      return {
        fontes: document.fonts.status, largura: innerWidth,
        transbordoPagina: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        transbordoBloco: Math.max(0, el.scrollWidth - el.clientWidth),
        definicao: texto(el.querySelector('.dobra-definicao')),
        origens: [...el.querySelectorAll('[data-def-origem]')].map(o => {
          const a = o.querySelector('.def-origem-doc'), seta = o.querySelector('.dobra-seta');
          const css = seta ? getComputedStyle(seta, '::before') : null;
          return { chave: o.getAttribute('data-def-origem'), documento: texto(a), href: a?.getAttribute('href'),
            sublinhado: a ? getComputedStyle(a).textDecorationLine : null,
            aberto: o.querySelector('details.def-excerto')?.open ?? null,
            excertoVisivel: o.querySelector('.def-excerto-texto')?.getBoundingClientRect().height > 0,
            seta: css ? { transform: css.transform, bordaEsquerda: css.borderLeftWidth, bordaCima: css.borderTopWidth, conteudo: css.content } : null };
        }),
      };
    });
    const guardar = async estado => {
      const ficheiro = `qa-recibo-inquilinos-${lingua}-390-${estado}.png`;
      const bytes = await definicao.screenshot({ path: path.join(bloco, 'capturas', ficheiro), animations: 'disabled' });
      const medida = await medir();
      if (medida.transbordoPagina > 0 || medida.transbordoBloco > 0) falhas.push(`${lingua}/${estado}: transbordo horizontal`);
      if (medida.fontes !== 'loaded') falhas.push(`${lingua}/${estado}: fontes não carregadas`);
      for (const o of medida.origens) {
        if (!o.sublinhado?.includes('underline')) falhas.push(`${lingua}/${estado}/${o.chave}: a ligação perdeu o sublinhado`);
        if (!(parseFloat(o.seta?.bordaEsquerda) > 0 && parseFloat(o.seta?.bordaCima) > 0)) falhas.push(`${lingua}/${estado}/${o.chave}: falta o sinal da dobra`);
      }
      return { estado, ficheiro, sha256: sha(bytes), ...medida };
    };
    const estados = [await guardar('fechada')];
    const dobras = definicao.locator('details.def-excerto'), quantidade = await dobras.count();
    if (!quantidade) falhas.push(`${lingua}: não há origens para abrir`);
    if (estados[0].origens.some(o => o.aberto)) falhas.push(`${lingua}: uma dobra já estava aberta ao entrar`);
    for (let i = 0; i < quantidade; i++) {
      await dobras.nth(i).locator('summary.def-excerto-abrir').click();
      const estado = await guardar(`origem-${i + 1}-aberta`), o = estado.origens[i];
      if (!o.aberto || !o.excertoVisivel) falhas.push(`${lingua}/${o.chave}: a interação não abriu o excerto`);
      if (o.seta?.transform === estados[0].origens[i].seta?.transform) falhas.push(`${lingua}/${o.chave}: o sinal da dobra não rodou`);
      estados.push(estado);
    }
    if (erros.length) falhas.push(`${lingua}: erros do navegador: ${erros.join('; ')}`);
    if (externos.length) falhas.push(`${lingua}: pedidos externos tentados e abortados`);
    resultados.push({ lingua, rota, dobras: quantidade, estados, errosDoNavegador: erros, pedidosExternosAbortados: externos });
    log.push(`${lingua}: ${quantidade} origens abertas pelo respetivo summary`);
    await contexto.close();
  }
} catch (e) { falhas.push(e.stack ?? e.message ?? String(e)); }
finally {
  const versaoNavegador = navegador?.version() ?? null;
  await navegador?.close();
  if (servidor.listening) await new Promise(resolve => servidor.close(resolve));
  const fim = new Date(), codigo = falhas.length ? 1 : 0;
  const d = { cabeca: esperado, dist_construido_de: versao.commit, dist_construido_em: versao.construido_em, inicio: inicio.toISOString(), fim: fim.toISOString(), segundos: (fim - inicio) / 1000, largura: 390, navegador: versaoNavegador, codigo, passou: !falhas.length, falhas, paginas: resultados.length, origens_abertas: resultados.reduce((n, r) => n + r.dobras, 0), capturas: resultados.reduce((n, r) => n + r.estados.length, 0), resultados };
  await fs.writeFile(base + '.json', JSON.stringify(d, null, 2) + '\n');
  await fs.writeFile(base + '.fim', fim.toISOString() + '\n');
  await fs.writeFile(base + '.codigo', String(codigo) + '\n');
  await fs.writeFile(base + '.log', [...log, ...falhas].join('\n') + '\n');
  console.log(`${resultados.length} páginas, ${d.origens_abertas} origens abertas, ${d.capturas} capturas; código ${codigo}.`);
  process.exitCode = codigo;
}
