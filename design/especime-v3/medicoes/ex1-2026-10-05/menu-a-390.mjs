/** EX1 (05.10.2026, o ponto 1 do mandato): a sétima porta do menu, «Explicações» / «Explainers», medida a 390 px nas
 * duas edições, como o H3 mediu a da União: entra se as sete portas couberem numa linha, e se não couberem fica fora do
 * menu e diz-se a largura que faltou.
 *
 * Para cada edição da primeira página a 390 px, mede a fila das portas publicada (as seis) e a fila com a sétima posta
 * só no navegador, ao lado de «Estudos» / «Studies», com o mesmo elemento e a mesma folha das outras: a largura natural
 * (as portas e os intervalos, sem dobrar) contra a largura da coluna, e as linhas que a fila ocupa quando dobra.
 * Captura o cabeçalho das duas formas em `design/especime-v3/capturas/ex1-2026-10-05/` e escreve `menu-a-390.json`.
 * Corre sobre `dist/`, da raiz da worktree: node design/especime-v3/medicoes/ex1-2026-10-05/menu-a-390.mjs
 * Sai 0 depois de medir; 1 se não conseguir. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const DIST = path.resolve('dist');
const CAPTURAS = path.resolve('design/especime-v3/capturas/ex1-2026-10-05');
const AQUI = path.resolve('design/especime-v3/medicoes/ex1-2026-10-05');
fs.mkdirSync(CAPTURAS, { recursive: true });
const versao = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  let f = path.join(DIST, decodeURIComponent((q.url ?? '/').split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { 'content-type': tipos[/** @type {keyof typeof tipos} */ (path.extname(f))] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
});
await new Promise((ok) => srv.listen(0, '127.0.0.1', () => ok(null)));
const base = `http://127.0.0.1:${/** @type {any} */ (srv.address()).port}`;
const SETIMA = { pt: { rotulo: 'Explicações', href: '/explicacoes', depois: '/estudos' }, en: { rotulo: 'Explainers', href: '/en/explainers', depois: '/en/studies' } };
const nav = await chromium.launch();
const medidas = [];
for (const [rota, lang] of /** @type {const} */ ([['/', 'pt'], ['/en/', 'en']])) for (const forma of ['publicada', 'com a sétima porta']) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.route('**/*', (r) => (new URL(r.request().url()).origin === base ? r.continue() : r.abort()));
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const m = await p.evaluate(({ poe, setima }) => {
    const navEl = /** @type {HTMLElement} */ (document.querySelector('#nav-principal'));
    if (poe) {
      const estudos = [...navEl.querySelectorAll('a')].find((a) => a.getAttribute('href')?.replace(/\/$/, '') === setima.depois);
      if (!estudos) return null;
      const nova = /** @type {HTMLElement} */ (estudos.cloneNode(true));
      nova.setAttribute('href', setima.href);
      nova.removeAttribute('aria-current');
      nova.textContent = setima.rotulo;
      estudos.insertAdjacentElement('afterend', nova);
    }
    const portas = [...navEl.querySelectorAll('a')];
    const coluna = navEl.clientWidth;
    const linhas = new Set(portas.map((a) => Math.round(a.getBoundingClientRect().top))).size;
    navEl.style.flexWrap = 'nowrap';
    const gap = parseFloat(getComputedStyle(navEl).columnGap) || 0;
    const larguras = portas.map((a) => a.getBoundingClientRect().width);
    const natural = larguras.reduce((s, w) => s + w, 0) + gap * (portas.length - 1);
    navEl.style.flexWrap = '';
    return { coluna, natural: +natural.toFixed(1), linhas, portas: portas.length, rotulos: portas.map((a) => a.textContent?.trim()).join(' · ') };
  }, { poe: forma !== 'publicada', setima: SETIMA[lang] });
  if (!m) { console.error(`${lang}: não se achou a porta «Estudos» no menu`); process.exit(1); }
  const nome = `menu-${forma === 'publicada' ? 'publicado' : 'com-a-setima'}-${lang}-390.png`;
  const cabeca = await p.locator('header').first().boundingBox();
  const buf = await p.screenshot({ clip: { x: 0, y: 0, width: 390, height: Math.ceil((cabeca?.y ?? 0) + (cabeca?.height ?? 200)) } });
  fs.writeFileSync(path.join(CAPTURAS, nome), buf);
  const cabe = m.natural <= m.coluna && m.linhas === 1;
  medidas.push({ lang, forma, ...m, cabe, falta: cabe ? 0 : +(m.natural - m.coluna).toFixed(1), captura: `design/especime-v3/capturas/ex1-2026-10-05/${nome}`, sha256: crypto.createHash('sha256').update(buf).digest('hex') });
  console.log(`${lang} · ${forma}: ${m.natural} px de portas numa coluna de ${m.coluna} · ${m.linhas} linha(s) · ${cabe ? 'cabe' : `não cabe, faltam ${(m.natural - m.coluna).toFixed(1)} px`} · ${m.rotulos}`);
  await ctx.close();
}
await nav.close();
srv.close();
const decisao = medidas.filter((x) => x.forma !== 'publicada').every((x) => x.cabe) ? 'entra' : 'fica fora do menu';
fs.writeFileSync(path.join(AQUI, 'menu-a-390.json'), JSON.stringify({ o_que_e: 'A sétima porta do menu, «Explicações» / «Explainers», ao lado de «Estudos», medida a 390 px nas duas edições, com a porta posta só no navegador.', construcao: versao.commit, construido_em: versao.construido_em, medidas, decisao }, null, 2) + '\n');
console.log(`a sétima porta ${decisao}.`);
