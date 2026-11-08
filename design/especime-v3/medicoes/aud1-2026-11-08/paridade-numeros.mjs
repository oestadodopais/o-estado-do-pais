// AUD1-1 (08.11.2026): a paridade dos números entre as duas edições de cada estudo bilingue, por guião.
// Um número compara-se pela sequência dos seus algarismos, sem separadores («45.784.603,10» e «45,784,603.10» são o mesmo),
// para que as formas de cada língua e as formas citadas da fonte não contem como diferença. Compara-se o documento e a página de
// cada estudo; onde as duas línguas têm o mesmo número de blocos, bloco a bloco; senão, o estudo inteiro.
// Uso: node paridade-numeros.mjs <worktree com dist/> [--json <saída>]
import fs from 'node:fs';
import {createRequire} from 'node:module';
const V = process.argv[2]; const req = createRequire(V + '/package.json'); const {parse} = req('node-html-parser');
const tags = 'p,li,h1,h2,h3,h4,h5,h6,figcaption,dd,dt,td,th,summary,blockquote,caption';
export const blocosDe = html => { const r = parse(html); r.querySelectorAll('script,style,a.src-chip,.src-chip').forEach(n => n.remove());
  const c = r.querySelector('[data-oedp-moldura]') ?? r.querySelector('main') ?? r;
  return c.querySelectorAll(tags).filter(n => !n.querySelector(tags)).map(n => n.textContent.replace(/​/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean); };
// um número: um a três algarismos com grupos de milhares (espaço, ponto ou vírgula seguidos de exatamente três algarismos) e uma parte decimal; ou só algarismos
export const numeros = t => (t.match(/(?<!\d)(?:\d{1,3}(?:[\u00a0\u202f .,]\d{3})+(?!\d)(?:[.,]\d+(?!\d))?|\d+(?:[.,]\d+)?(?!\d))/g) ?? []).map(x => x.replace(/[^\d]/g, ''));
const conta = xs => xs.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map());
const menos = (a, b) => { const r = []; for (const [k, n] of a) { const d = n - (b.get(k) ?? 0); for (let i = 0; i < d; i++) r.push(k); } return r; };
export function compara(bp, be) {
  const r = {total: {soPt: menos(conta(bp.flatMap(numeros)), conta(be.flatMap(numeros))), soEn: menos(conta(be.flatMap(numeros)), conta(bp.flatMap(numeros)))}, blocos: []};
  if (bp.length === be.length) for (let i = 0; i < bp.length; i++) {
    const a = conta(numeros(bp[i])), b = conta(numeros(be[i])); const sp = menos(a, b), se = menos(b, a);
    if (sp.length || se.length) r.blocos.push({i, soPt: sp, soEn: se, pt: bp[i].slice(0, 220), en: be[i].slice(0, 220)});
  }
  return r;
}
// As plantas: um número trocado num bloco tem de aparecer; a mesma coisa nas duas formas, não.
const p1 = compara(['O valor é 45.784.603,10 € em 2025.'], ['The value is 45.784.603,10 € in 2025.']);
const p2 = compara(['O valor é 1 234,5 em 2025.'], ['The value is 1,234.5 in 2025.']);
const p3 = compara(['O valor é 1 234,5 em 2025.'], ['The value is 1,243.5 in 2025.']);
const p4 = compara(['Três blocos.', 'Saiu 12 %.'], ['Three blocks.', 'Out 21%.']);
const p5 = compara(['no 2.º trimestre de 2026, 5 299 em Lisboa'], ['in Q2 2026, 5,299 in Lisbon']);
const p6 = compara(['em 2025 licenciaram-se 3,8 por mil'], ['in 2025 3.8 per thousand']);
const plantas = [p1.total.soPt.length === 0 && p1.total.soEn.length === 0, p2.total.soPt.length === 0, p3.total.soPt.length === 1 && p3.blocos.length === 1, p4.blocos.length === 1, p5.blocos.length === 0, p6.blocos.length === 0];
console.log(`plantas: ${plantas.filter(Boolean).length} de ${plantas.length}`);
if (plantas.some(x => !x)) { process.exitCode = 1; }
const res = [];
for (const s of fs.readdirSync(V + '/dist/estudos').sort()) {
  for (const [tipo, pp, pe] of [['documento', `/estudos/${s}/documento`, `/en/studies/${s}/document`], ['página', `/estudos/${s}`, `/en/studies/${s}`]]) {
    const fp = `${V}/dist${pp}/index.html`, fe = `${V}/dist${pe}/index.html`;
    if (!fs.existsSync(fp) || !fs.existsSync(fe)) continue;
    const bp = blocosDe(fs.readFileSync(fp, 'utf8')), be = blocosDe(fs.readFileSync(fe, 'utf8'));
    const r = compara(bp, be);
    res.push({estudo: s, tipo, blocos_pt: bp.length, blocos_en: be.length, so_pt: r.total.soPt.length, so_en: r.total.soEn.length, blocos_diferentes: r.blocos.length, detalhe: r});
  }
}
for (const x of res) console.log(`${x.estudo.padEnd(52)} ${x.tipo.padEnd(9)} blocos ${String(x.blocos_pt).padStart(4)}/${String(x.blocos_en).padEnd(4)} só pt ${String(x.so_pt).padStart(3)} · só en ${String(x.so_en).padStart(3)}${x.blocos_pt === x.blocos_en ? ` · blocos com números diferentes ${x.blocos_diferentes}` : ' · (sem alinhamento por blocos)'}`);
const j = process.argv.indexOf('--json'); if (j > 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(res, null, 1));
