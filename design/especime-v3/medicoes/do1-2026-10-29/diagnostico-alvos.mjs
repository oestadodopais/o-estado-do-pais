// Diagnóstico do alvo de toque: na faixa de 641 a 1023 px, que elemento o dedo encontra sobre a ligação do item das parcerias, na primeira página e na página do dossiê.
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const dist = process.argv[2]; const rotas = ['/', '/dossies/orcamento-2027/', '/o-que-se-discute/'];
const servidor = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.join(dist, p); if (!fs.existsSync(f)) { res.statusCode = 404; return res.end(); } res.setHeader('content-type', f.endsWith('.css') ? 'text/css' : f.endsWith('.js') ? 'text/javascript' : 'text/html; charset=utf-8'); fs.createReadStream(f).pipe(res); });
await new Promise(r => servidor.listen(0, r)); const porto = servidor.address().port;
const navegador = await chromium.launch(); const largura = Number(process.argv[3] || 800); const pagina = await navegador.newPage({ viewport: { width: largura, height: 1000 } });
for (const rota of rotas) {
  await pagina.goto(`http://127.0.0.1:${porto}${rota}`, { waitUntil: 'load' });
  const r = await pagina.evaluate(() => {
    const a = document.querySelector('a[data-discussao-porta="parcerias-rodoviarias"]'); if (!a) return 'sem ligação'; a.scrollIntoView({ block: 'center' });
    const b = a.getBoundingClientRect(); const cs = getComputedStyle(a);
    const pontos = []; for (let y = b.top + 2; y < b.bottom - 1; y += 4) { const linha = []; for (const x of [b.left + 20, b.left + b.width / 2, b.right - 20]) { const el = document.elementFromPoint(x, y); linha.push(el === a || a.contains(el) ? 'a' : (el ? el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') + (el.hasAttribute('data-discussao-resumo') ? '[resumo]' : '') : 'nada')); } pontos.push([Math.round(y - b.top), linha.join('|')]); }
    return { caixa: [Math.round(b.width * 10) / 10, Math.round(b.height * 10) / 10], display: cs.display, minHeight: cs.minHeight, padding: cs.paddingTop + '/' + cs.paddingBottom, lineHeight: cs.lineHeight, pontos, pai: a.parentElement.tagName + '>' + a.parentElement.parentElement.className, seguinte: a.nextElementSibling ? a.nextElementSibling.tagName + '.' + a.nextElementSibling.className : null };
  });
  console.log(rota, JSON.stringify(r));
}
await navegador.close(); servidor.close();
