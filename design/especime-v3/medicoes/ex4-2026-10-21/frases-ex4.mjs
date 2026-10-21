/**
 * AS FRASES DA EXPLICAÇÃO DE 2027 COMO O `dist/` AS IMPRIME (bloco EX4, 21.10.2026; lidas do `dist/` desde a correção
 * EX4-b), nas duas edições: o título, os títulos das secções, os parágrafos, os títulos das figuras e as portas do fim,
 * pela ordem da página, tirados de dentro de `<main>`. Uma página que o `dist/` não tem fica `ausente` (sai com 1), e ao
 * lado vai, para as duas edições, o texto que o resolvedor devolve (`resolvedor`), que é o que a página imprime quando
 * existe. Corre-se da raiz, depois da construção:
 * `node design/especime-v3/medicoes/ex4-2026-10-21/frases-ex4.mjs [--json <ficheiro>]`.
 */
import fs from 'node:fs';
import { explicacaoResolvida, textoDosPedacosDaExplicacao } from '../../../../src/lib/explicacoes.mjs';

const PAGINAS = { pt: 'dist/explicacoes/dinheiro-do-estado-2027/index.html', en: 'dist/en/explainers/dinheiro-do-estado-2027/index.html' };
const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'", '&nbsp;': ' ' };
const texto = (/** @type {string} */ h) => h.replace(/<[^>]+>/g, '').replace(/&(?:amp|lt|gt|quot|nbsp|#39|#x27);/g, (m) => /** @type {any} */ (ENT)[m]).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/\s+/g, ' ').trim();
/** @param {string} html */
function blocos(html) {
  const main = /<main\b[\s\S]*?<\/main>/.exec(html)?.[0];
  if (!main) throw new Error('a página não tem <main>');
  const sem = main.replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/g, '');
  const out = [];
  for (const m of sem.matchAll(/<(h1|h2|p|figcaption|caption)\b[^>]*>([\s\S]*?)<\/\1>/g)) { const t = texto(m[2]); if (t) out.push({ tag: m[1], texto: t }); }
  return out;
}
const out = /** @type {Record<string, any>} */ ({});
for (const [lang, rel] of Object.entries(PAGINAS)) {
  const e = explicacaoResolvida('dinheiro-do-estado-2027', /** @type {'pt'|'en'} */ (lang));
  const resolvedor = [e.tituloTexto, ...e.abertura.map((/** @type {any} */ p) => textoDosPedacosDaExplicacao(p.pedacos, lang))];
  for (const s of e.seccoes) { resolvedor.push(s.titulo); for (const b of s.blocos) resolvedor.push(b.tipo === 'figura' ? String(b.modelo.titulo) : textoDosPedacosDaExplicacao(b.pedacos, lang)); }
  resolvedor.push(...e.naoDiz.map((/** @type {any} */ p) => textoDosPedacosDaExplicacao(p.pedacos, lang)));
  out[lang] = fs.existsSync(rel) ? { pagina: rel, blocos: blocos(fs.readFileSync(rel, 'utf8')), resolvedor } : { pagina: rel, ausente: true, resolvedor };
}
const j = process.argv.indexOf('--json');
if (j > 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(out, null, 2) + '\n');
for (const lang of Object.keys(out)) {
  if (out[lang].ausente) { console.log(`[${lang}] ${out[lang].pagina}: ausente do dist/; o resolvedor:`); for (const t of out[lang].resolvedor) console.log(`[${lang}] resolvedor: ${t}`); }
  else for (const b of out[lang].blocos) console.log(`[${lang}] ${b.tag}: ${b.texto}`);
}
if (Object.values(out).some((x) => x.ausente)) process.exit(1);
