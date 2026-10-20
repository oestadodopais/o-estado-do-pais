import fs from 'node:fs';
import { ESTUDO_EO1 } from '../src/data/portas-eo1.mjs';
const normal = s => String(s ?? '').replace(/\s+/g,' ').trim();
const records = Object.fromEntries(['pt','en'].map(lang => [lang,
  JSON.parse(fs.readFileSync(new URL(`../registos/${ESTUDO_EO1}/${lang}.record.json`, import.meta.url),'utf8'))]));

/** Retira apenas os excertos de terceiros de unidades inteiramente conferidas. */
export function retirarCitacoesEo1(root, rota, claims) {
  if (rota?.params?.slug !== ESTUDO_EO1 || !['estudo','documento'].includes(rota.key)) return;
  const record = records[rota.lang];
  const raw = root.querySelectorAll('[data-oedp-moldura] h1,[data-oedp-moldura] h2,[data-oedp-moldura] p');
  for (const block of record.blocks) {
    const el = rota.key === 'estudo'
      ? root.querySelector(`[data-registo-unidade="${ESTUDO_EO1}/${rota.lang}#${block.i}"]`)
      : raw[block.i];
    if (!el) continue;
    el.querySelectorAll('[data-selo-etiqueta]').forEach(s=>s.remove());
    let text = normal(el.textContent);
    if (text !== normal(block.text)) continue;
    for (const q of block.proofs ?? []) {
      if (q.tipo !== 'excerto' || normal(claims.get(q.id)?.excerpt) !== normal(q.texto)) continue;
      text = text.replace(normal(q.texto),'');
    }
    el.set_content(text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'));
  }
}
