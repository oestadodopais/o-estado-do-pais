import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { WORKS, PUBLISHED_WORKS, COUNTS } from '../../src/data/studies.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';
const dist = process.env.OEDP_DIST ?? 'dist';
const frases = {
  'estudos-publicados': {
    pt:'Os seis estudos de Évora de agosto e setembro de 2026, a que sucederam os quatro de outubro, saíram do arquivo.',
    en:'The six Évora studies of August and September 2026, succeeded by the four of October, left the archive.',
  },
  'estudos-evora-publicados': {
    pt:'Os seis estudos de Évora de agosto e setembro de 2026 a que estes quatro sucederam saíram do arquivo.',
    en:'The six Évora studies of August and September 2026 that these four succeeded have left the archive.',
  },
};
const claims = loadClaims();
assert.equal(Number(claims.get('estudos-publicados').value), PUBLISHED_WORKS.length);
assert.equal(Number(claims.get('estudos-evora-publicados').value), PUBLISHED_WORKS.filter(w => w.subject === 'evora').length);
assert.equal(COUNTS.estudos_evora_no_arquivo, PUBLISHED_WORKS.filter(w => w.subject === 'evora').length);
const entrada = claims.get('estudos-publicados').corrections.at(-1);
assert.equal(entrada.date,'2026-11-11');assert.equal(entrada.kind,'atualizacao');
assert.equal(entrada.reason,frases['estudos-publicados'].pt);assert.equal(entrada.reason_en,frases['estudos-publicados'].en);
for (const lang of ['pt','en']) {
  const base = lang === 'pt' ? 'estudos' : 'en/studies';
  const construidos = WORKS.filter(w => fs.existsSync(`${dist}/${base}/${w.slug}/index.html`));
  assert.equal(construidos.length,PUBLISHED_WORKS.length);
  for (const [id, frase] of Object.entries(frases)) {
    const html = fs.readFileSync(`${dist}/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${id}/index.html`,'utf8');
    assert(parse(html).textContent.replace(/\s+/g,' ').includes(frase[lang]),`${id}/${lang}: frase do mandato ausente no HTML`);
  }
}
console.log(`REC2 contagens: ${PUBLISHED_WORKS.length} estudos construídos, ${COUNTS.estudos_evora_no_arquivo} de Évora; quatro frases do mandato conferidas no HTML.`);
