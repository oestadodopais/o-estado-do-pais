// Varredura de sobreposições de texto no sítio no ar (27.10.2026): caixas de linha de texto que se cruzam entre blocos
// diferentes, e pseudo-elementos com texto em posição absoluta que caem em cima de texto. Só leitura; escreve JSON.
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = 'https://xn--oestadodopas-2fb.pt';
const LARGURAS = [390, 768, 1024, 1280, 1600];
const ROTAS = (process.argv[2] ? process.argv[2].split(',') : [
  '/', '/en/', '/estudos/', '/estudos/a-casa-em-portugal-e-na-europa', '/en/studies/a-casa-em-portugal-e-na-europa',
  '/estudos/orcamento-2027-o-que-muda-e-para-quem', '/estudos/evora-2027-capital-europeia-da-cultura',
  '/o-que-se-discute/', '/en/under-discussion/', '/precos/', '/habitacao/', '/estado-e-economia/', '/lugares/',
  '/uniao-europeia', '/correcoes/', '/metodo/', '/livro-razao/divida-publica-2025', '/en/ledger/divida-publica-2025',
]);
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
  const parente = (a, b) => a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el);
  const achados = []; const vistos = new Set();
  const todos = linhas.concat(pseudos);
  for (let i = 0; i < todos.length; i++) for (let j = i + 1; j < todos.length; j++) {
    const a = todos[i], b = todos[j];
    if (!a.pseudo && !b.pseudo && a.bloco === b.bloco) continue; // a mesma caixa de bloco: linhas vizinhas, não é sobreposição
    if (parente(a, b)) continue;
    const area = cruza(a, b); if (!area) continue;
    const chave = caminho(a.el) + '|' + caminho(b.el); if (vistos.has(chave)) continue; vistos.add(chave);
    achados.push({ area: Math.round(area), a: { caminho: caminho(a.el), texto: a.texto, y: Math.round(a.y) }, b: { caminho: caminho(b.el), texto: b.texto, y: Math.round(b.y) } });
  }
  return { linhas: linhas.length, pseudos: pseudos.length, achados };
};
const navegador = await chromium.launch();
const saida = [];
for (const largura of LARGURAS) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1 });
  const pagina = await ctx.newPage();
  for (const rota of ROTAS) {
    try {
      await pagina.goto(BASE + rota, { waitUntil: 'networkidle', timeout: 45000 });
      await pagina.evaluate(() => document.fonts.ready);
      const r = await pagina.evaluate(MEDIR);
      saida.push({ largura, rota, ...r });
      console.log(`${largura} ${rota} · ${r.linhas} linhas · ${r.pseudos} pseudo · ${r.achados.length} sobreposição(ões)`);
    } catch (e) { saida.push({ largura, rota, erro: String(e).slice(0, 160) }); console.log(`${largura} ${rota} · ERRO ${String(e).slice(0, 100)}`); }
  }
  await ctx.close();
}
await navegador.close();
fs.writeFileSync(process.argv[3] || 'sobreposicao.json', JSON.stringify(saida, null, 1));
const total = saida.reduce((s, x) => s + (x.achados?.length || 0), 0);
console.log(`FIM · ${saida.length} páginas×larguras · ${total} sobreposições · erros ${saida.filter(x => x.erro).length}`);
