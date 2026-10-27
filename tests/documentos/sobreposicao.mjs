#!/usr/bin/env node
/** M118: caixas de texto de blocos distintos e texto de pseudo-elementos fora do fluxo.
 * Deriva da varredura FP2. A caixa dos pseudo-elementos é uma estimativa pela fonte
 * calculada, não a geometria dos glifos. O conhecido-positivo protege esta aproximação.
 * Uso: npm run check:sobreposicao -- [--json ficheiro] [--rotas /,/en/] [--planta]
 * A planta repõe a folha defeituosa em memória: 1 se apanha a habitação, 2 se não apanha.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
const inicio = performance.now();
const DIST = fs.realpathSync(process.env.OEDP_DIST ?? fileURLToPath(new URL('../../dist', import.meta.url)));
const args = process.argv.slice(2);
let saida = process.env.OEDP_SOBREPOSICAO_JSON, planta = false;
let rotas;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--planta') planta = true;
  else if (args[i] === '--json' && args[i + 1]) saida = args[++i];
  else if (args[i] === '--rotas' && args[i + 1]) rotas = args[++i].split(',');
  else throw Error('M118: argumento desconhecido ou sem valor');
}
const LARGURAS = [390, 768, 1024, 1280, 1600];
const ROTAS = rotas ?? [
  '/', '/en/', '/estudos/', '/estudos/a-casa-em-portugal-e-na-europa', '/en/studies/a-casa-em-portugal-e-na-europa',
  '/estudos/orcamento-2027-o-que-muda-e-para-quem', '/estudos/evora-2027-capital-europeia-da-cultura',
  '/o-que-se-discute/', '/en/under-discussion/', '/precos/', '/habitacao/', '/estado-e-economia/', '/lugares/',
  '/uniao-europeia', '/correcoes/', '/metodo/', '/livro-razao/divida-publica-2025', '/en/ledger/divida-publica-2025',
];
if (!ROTAS.length || ROTAS.some(r => !r.startsWith('/') || r.startsWith('//'))) throw Error('M118: rotas locais obrigatórias');
const tipos = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.webp':'image/webp'};
const servidor = http.createServer((req, res) => {
  try {
    let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(req.url, 'http://local').pathname));
    if (f !== DIST && !f.startsWith(DIST + path.sep)) throw Error('fora');
    if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    f = fs.realpathSync(f);
    if (!f.startsWith(DIST + path.sep)) throw Error('fora');
    res.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    res.end(fs.readFileSync(f));
  } catch { res.writeHead(404).end(); }
});
const MEDIR = () => {
  const escondido = (el) => { const cs = getComputedStyle(el); if (cs.clip && cs.clip !== 'auto' && /rect\(0px,? 0px,? 0px,? 0px\)/.test(cs.clip)) return true; if (cs.clipPath && cs.clipPath !== 'none' && /inset\(50%|inset\(100%/.test(cs.clipPath)) return true; const r = el.getBoundingClientRect(); return (r.width <= 1 && r.height <= 1); };
  const vis = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false; if (escondido(el)) return false; for (let e = el; e && e !== document.body; e = e.parentElement) { if (e.tagName === 'DETAILS' && !e.open) { let dentroDoSummary = false; for (let f = el; f && f !== e; f = f.parentElement) if (f.tagName === 'SUMMARY') dentroDoSummary = true; if (!dentroDoSummary) return false; } if (e !== el && escondido(e)) return false; } return true; };
  const bloco = (el) => { let e = el; while (e && e !== document.body) { const d = getComputedStyle(e).display; if (d !== 'inline' && d !== 'contents') return e; e = e.parentElement; } return document.body; };
  const caminho = (el) => { const p = []; let e = el; while (e && e !== document.body && p.length < 4) { p.unshift(e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')); e = e.parentElement; } return p.join('>'); };
  const linhas = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement; if (!el || !vis(el)) continue;
    if (['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT'].includes(el.tagName)) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const b of r.getClientRects()) {
      if (b.width < 2 || b.height < 2) continue;
      linhas.push({ x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height, el, bloco: bloco(el), texto: n.nodeValue.trim().slice(0, 60) });
    }
  }
  const pseudos = [];
  const canvas = document.createElement('canvas').getContext('2d');
  for (const el of document.body.querySelectorAll('*')) {
    if (!vis(el)) continue;
    for (const ps of ['::before', '::after']) {
      const cs = getComputedStyle(el, ps);
      const c = cs.content;
      if (!c || c === 'none' || c === 'normal' || c === '""' || c === "''") continue;
      if (cs.display === 'none') continue;
      const texto = c.includes('counter(') ? '00/00' : c.replace(/^["']|["']$/g, '').replace(/"\s*"/g, '');
      if (!texto.trim() || /^(url|attr)\(/.test(texto)) continue;
      canvas.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const w = canvas.measureText(texto).width + (parseFloat(cs.letterSpacing) || 0) * texto.length;
      const fs = parseFloat(cs.fontSize) || 12; const lh = parseFloat(cs.lineHeight) || fs * 1.2;
      const base = el.getBoundingClientRect();
      let x = base.left, y = base.top;
      if (cs.position === 'absolute' || cs.position === 'fixed') {
        const top = parseFloat(cs.top), left = parseFloat(cs.left), bottom = parseFloat(cs.bottom), right = parseFloat(cs.right);
        if (!Number.isNaN(top)) y = base.top + top; else if (!Number.isNaN(bottom)) y = base.bottom - bottom - lh;
        if (!Number.isNaN(left)) x = base.left + left; else if (!Number.isNaN(right)) x = base.right - right - w;
      } else continue; // só os posicionados fora do fluxo podem cair em cima de texto
      pseudos.push({ x: x + scrollX, y: y + scrollY, w, h: lh, el, bloco: bloco(el), texto: ps + ' ' + texto, pseudo: true });
    }
  }
  const cruza = (a, b) => { const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x); const iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); return ix >= 3 && iy >= 3 ? ix * iy : 0; };
  const achados = []; const vistos = new Set();
  const todos = linhas.concat(pseudos);
  for (let i = 0; i < todos.length; i++) for (let j = i + 1; j < todos.length; j++) {
    const a = todos[i], b = todos[j];
    if (!a.pseudo && !b.pseudo && a.bloco === b.bloco) continue; // a mesma caixa de bloco: linhas vizinhas, não é sobreposição
    const area = cruza(a, b); if (!area) continue;
    const chave = caminho(a.el) + '|' + caminho(b.el); if (vistos.has(chave)) continue; vistos.add(chave);
    achados.push({ area: Math.round(area), a: { caminho: caminho(a.el), texto: a.texto, y: Math.round(a.y) }, b: { caminho: caminho(b.el), texto: b.texto, y: Math.round(b.y) } });
  }
  return { linhas: linhas.length, pseudos: pseudos.length, achados };
};

await new Promise((ok, nao) => { servidor.once('error', nao); servidor.listen(0, '127.0.0.1', ok); });
const origem = `http://127.0.0.1:${servidor.address().port}`;
const paginas = [];
let navegador;
try {
  navegador = await chromium.launch({ headless: true });
  for (const largura of LARGURAS) {
    const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' });
    await ctx.route('**/*', r => new URL(r.request().url()).origin === origem ? r.continue() : r.abort());
    const pagina = await ctx.newPage();
    for (const rota of ROTAS) {
      try {
        const resposta = await pagina.goto(origem + rota, { waitUntil: 'load', timeout: 30000 });
        if (!resposta?.ok()) throw Error(`HTTP ${resposta?.status()}`);
        await pagina.evaluate(() => document.fonts.ready);
        if (planta) await pagina.addStyleTag({ content: '.estudo-leitura > h2:first-of-type { margin-top: 0 !important; } .texto-artigo h2 { position: relative; padding-top: 0 !important; } .texto-artigo h2::before { display: block; position: absolute !important; top: -1.35em !important; left: 0; margin: 0 !important; }' });
        await pagina.evaluate(() => new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok))));
        const r = await pagina.evaluate(MEDIR);
        paginas.push({ largura, rota, ...r });
        if (r.achados.length) console.log(`${largura} ${rota}: ${r.achados.length} sobreposições`);
      } catch (e) { paginas.push({ largura, rota, erro: String(e).replaceAll(DIST, '<dist>') }); }
    }
    await ctx.close();
  }
} finally {
  await navegador?.close();
  await new Promise(ok => servidor.close(ok));
}
const total = paginas.reduce((s, p) => s + (p.achados?.length ?? 0), 0);
const erros = paginas.filter(p => p.erro).length;
const positivo = paginas.some(p => p.rota.includes('/a-casa-em-portugal-e-na-europa') && p.achados?.some(a => [a.a, a.b].some(x => x.caminho.includes('h2') && x.texto.startsWith('::before'))));
const ligacoes = Object.fromEntries(['index.html','en/index.html'].map(f => [f, parse(fs.readFileSync(path.join(DIST, f), 'utf8')).querySelectorAll('a').length]));
const resultado = { planta, larguras: LARGURAS, rotas: ROTAS, duracaoSegundos: (performance.now() - inicio) / 1000, total, erros, conhecidoPositivo: positivo, ligacoes, paginas };
if (saida) fs.writeFileSync(saida, JSON.stringify(resultado, null, 2) + '\n');
console.log(`M118: ${paginas.length} combinações, ${total} sobreposições, ${erros} erros; ${resultado.duracaoSegundos.toFixed(2)} s; planta ${planta ? (positivo ? 'mordeu' : 'não mordeu') : 'não pedida'}.`);
process.exitCode = planta ? (positivo && !erros ? 1 : 2) : (total || erros ? 1 : 0);
