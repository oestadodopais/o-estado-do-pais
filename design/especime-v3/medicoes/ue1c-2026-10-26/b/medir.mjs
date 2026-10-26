/** UE1-c-b: transcrição do HTML construído; este guião só lê dist/. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {load} from 'js-yaml';
const out = path.dirname(new URL(import.meta.url).pathname);
const recibos = [];
for (const lang of ['pt', 'en']) {
  for (const id of ['divida-publica-2025', 'divida-publica-2025-ue']) {
    const rota = `/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${id}/`;
    const bruto = fs.readFileSync(`dist${rota}index.html`);
    const html = parse(bruto.toString());
    const linha = load(fs.readFileSync(`ledger/claims/${id}.yml`, 'utf8'));
    const entradas = linha.corrections.map((c, i) => {
      const motivo = html.querySelector(`#alteracao-${i} .log-motivo`)?.textContent.trim();
      if (motivo !== c[lang === 'pt' ? 'reason' : 'reason_en']) throw new Error(`Motivo diferente em ${rota}, entrada ${i}`);
      return {kind: c.kind, field: c.field ?? null, motivo};
    });
    recibos.push({rota, lang, id, sha256_html: createHash('sha256').update(bruto).digest('hex'), entradas});
  }
}
fs.writeFileSync(path.join(out, 'recibos.json'), JSON.stringify({recibos}, null, 2) + '\n');
console.log(`PASS: ${recibos.length} recibos, ${recibos.reduce((n, r) => n + r.entradas.length, 0)} razões transcritas do HTML, incluindo excertos preservados.`);
