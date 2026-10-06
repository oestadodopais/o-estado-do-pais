/** H4: mede a forma servida e a proposta só no navegador, antes de mudar a folha.
 * Adaptado dos captores do EX1. Não pede recursos externos nem muda o dist.
 * node design/especime-v3/medicoes/h4-2026-10-06/medir-menu.mjs antes|depois
 */
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { ROUTES, routePath } from '../../../../src/lib/routes.mjs';
import { ANCORA_DA_POLITICA } from '../../../../src/data/politica-ia.mjs';

const fase = process.argv[2];
if (!['antes', 'depois'].includes(fase)) throw Error('Diga antes ou depois.');
const AQUI = 'design/especime-v3/medicoes/h4-2026-10-06';
const CAP = 'design/especime-v3/capturas/h4-2026-10-06';
const DIST = path.resolve('dist');
const versao = JSON.parse(await fs.readFile('dist/version.json', 'utf8'));
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (versao.commit !== cabeca) throw Error('A construção não é desta cabeça.');
const sha = (b) => createHash('sha256').update(b).digest('hex');
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const servidor = http.createServer(async (q, r) => {
  try {
    let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(q.url, 'http://x').pathname));
    if (f !== DIST && !f.startsWith(DIST + path.sep)) throw Error('fora');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    r.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    r.end(await fs.readFile(f));
  } catch { r.writeHead(404).end(); }
});
await fs.mkdir(CAP, { recursive: true });
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch();
const medidas = [];
try {
  for (const lang of ['pt', 'en']) for (const largura of [360, 390, 768]) {
    for (const forma of fase === 'antes' ? ['servida', 'proposta', 'proposta-espaco-768'] : ['servida']) {
      const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await ctx.route('**/*', (r) => new URL(r.request().url()).origin === origem ? r.continue() : r.abort());
      const p = await ctx.newPage();
      const rota = routePath('home', lang);
      const resposta = await p.goto(origem + rota, { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) throw Error(`HTTP ${resposta.status()} em ${rota}`);
      await p.evaluate(() => document.fonts.ready);
      if (forma.startsWith('proposta')) {
        const espaco = forma === 'proposta-espaco-768' && largura <= 430 ? '21.504px' : 'clamp(16px,2.8vw,34px)';
        await p.addStyleTag({ content: `.menu-cinco{gap:0 ${espaco}!important}.menu-cinco a{font-size:15px!important;letter-spacing:.05em!important}` });
        await p.evaluate(({ lang, explicacoes, estudos, uniao }) => {
          const nav = document.querySelector('#nav-principal');
          const a = [...nav.querySelectorAll('a')].find((a) => a.getAttribute('href') === estudos);
          if (!a) throw Error('A porta dos estudos não existe.');
          const nova = a.cloneNode(true);
          nova.textContent = lang === 'pt' ? 'Explicações' : 'Explainers';
          nova.setAttribute('href', explicacoes); nova.removeAttribute('aria-current');
          a.after(nova);
          const ue = [...nav.querySelectorAll('a')].find((a) => a.getAttribute('href') === uniao);
          ue.textContent = lang === 'pt' ? 'União Europeia' : 'European Union';
        }, { lang, explicacoes: routePath('explicacoes', lang), estudos: routePath('estudos', lang), uniao: routePath('uniaoEuropeia', lang) });
        await p.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
      }
      const m = await p.evaluate(() => {
        const n = document.querySelector('#nav-principal');
        const rect = (a) => { const b = a.getBoundingClientRect(); return { x: b.x, y: b.y, largura: b.width, altura: b.height, direita: b.right, fundo: b.bottom }; };
        const portas = [...n.querySelectorAll('a')];
        const caixas = portas.map((a) => ({ texto: a.textContent.trim(), href: a.getAttribute('href'), ...rect(a) }));
        const gap = parseFloat(getComputedStyle(n).columnGap);
        const linhas = [...new Set(caixas.map((b) => b.y))].map((y) => caixas.filter((b) => b.y === y));
        const folgas = linhas.flatMap((l) => l.slice(1).map((b, i) => b.x - l[i].direita));
        const larguraNatural = caixas.reduce((s, b) => s + b.largura, 0) + gap * (caixas.length - 1);
        return { coluna: n.clientWidth, natural: larguraNatural, linhas: linhas.length, portas: caixas.length,
          caixas, ultima: caixas.at(-1), gap, folgas, letra: getComputedStyle(portas[0]).fontSize, espaco_das_letras: getComputedStyle(portas[0]).letterSpacing,
          sem_transbordo: n.scrollWidth <= n.clientWidth && caixas.every((b) => b.x >= 0 && b.direita <= innerWidth),
          cabe_em_duas: linhas.length <= 2 && n.scrollWidth <= n.clientWidth && caixas.every((b) => b.x >= 0 && b.direita <= innerWidth) };
      });
      const ficheiro = `${CAP}/menu-${fase}-${forma}-${lang}-${largura}.png`;
      const cabecalho = await p.locator('header').first().boundingBox();
      const imagem = await p.screenshot({ path: ficheiro, clip: { x: 0, y: 0, width: largura, height: Math.ceil(cabecalho.y + cabecalho.height) } });
      medidas.push({ lang, largura, forma, ...m, captura: ficheiro, sha256: sha(imagem) });
      await ctx.close();
    }
  }
} finally { await navegador.close(); servidor.close(); }
const candidatos = medidas.filter((m) => m.largura === 390 && m.forma === (fase === 'antes' ? 'proposta' : 'servida'));
const politica = Object.fromEntries(['pt', 'en'].map((lang) => [lang, `${routePath('metodo', lang)}#${ANCORA_DA_POLITICA}`]));
const r = { comando: `node ${AQUI}/medir-menu.mjs ${fase}`, construcao: versao, cabeca, fase, medidas,
  nome_inteiro_cabe: candidatos.length === 2 && candidatos.every((m) => m.portas === 7 && m.cabe_em_duas),
  politica: { rotas: politica, rota_do_brief_existe: Object.values(ROUTES).some((r) => r.pt === '/sobre/politica-ia') } };
await fs.writeFile(`${AQUI}/${fase === 'antes' ? 'menu-a-390' : 'menu-depois'}.json`, JSON.stringify(r, null, 2) + '\n');
console.log(JSON.stringify({ medidas: medidas.map(({ lang, largura, forma, natural, coluna, linhas, gap, letra, sem_transbordo }) => ({ lang, largura, forma, natural, coluna, linhas, gap, letra, sem_transbordo })), nome_inteiro_cabe: r.nome_inteiro_cabe, politica: r.politica }, null, 2));
