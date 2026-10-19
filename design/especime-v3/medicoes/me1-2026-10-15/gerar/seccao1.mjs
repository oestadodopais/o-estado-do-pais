// Os textos da primeira secção do Método (o §3.1 do mandato: os papéis, as famílias com a ligação ao documento
// público da política, e o que se publica só pelas verificações automáticas), tirados de frases-do-mandato.json.
// Corria em linha na primeira passagem; fica aqui para que a geração se possa repetir.
// uso: node seccao1.mjs <frases-do-mandato.json> <saída seccao1.json>
import fs from 'node:fs';
const [entrada, saida] = process.argv.slice(2);
const d = JSON.parse(fs.readFileSync(entrada, 'utf8'));
const s1 = d.seccoes.find((s) => s.n === 1);
const P = Object.fromEntries(s1.paragrafos.map((p) => [p.n, p]));
const familia = (t) => {
  const m = t.match(/^(.*)\[([^\]]+)\]\{politica\}(.*)$/);
  if (!m) throw new Error(`a frase das famílias não tem a ligação: ${t}`);
  return { antes: m[1], ligacao: m[2], depois: m[3] };
};
const out = { papeis: { pt: P[2].pt, en: P[2].en }, familias: { pt: familia(P[3].pt), en: familia(P[3].en) }, publicacao: { pt: P[4].pt, en: P[4].en } };
fs.writeFileSync(saida, JSON.stringify(out, null, 1));
console.log('escrito', saida);
