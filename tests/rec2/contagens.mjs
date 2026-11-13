import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { WORKS, PUBLISHED_WORKS, COUNTS } from '../../src/data/studies.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';
const dist = process.env.OEDP_DIST ?? 'dist';
const frases = {
  "estudos-publicados": {
    "pt": "Oito estudos saíram do arquivo a 13.11.2026 para serem reescritos: as auditorias acharam neles erros, números sem a cópia da fonte ou dados que a fonte já reviu.",
    "en": "Eight studies left the archive on 13.11.2026 to be rewritten: the audits found errors in them, figures without a stored copy of the source, or data the source has since revised."
  },
  "estudos-evora-publicados": {
    "pt": "Dois estudos de Évora saíram do arquivo a 13.11.2026 para serem reescritos: uma auditoria achou neles erros e números sem a cópia da fonte.",
    "en": "Two Évora studies left the archive on 13.11.2026 to be rewritten: an audit found errors in them and figures without a stored copy of the source."
  }
};
const definicaoEvora = {
  pt:'É o número de estudos publicados cujo objeto é o concelho de Évora.',
  en:'It is the number of studies published whose subject is the municipality of Évora.',
};
const claims = loadClaims();
assert.equal(Number(claims.get('estudos-publicados').value), PUBLISHED_WORKS.length);
assert.equal(Number(claims.get('estudos-evora-publicados').value), PUBLISHED_WORKS.filter(w => w.subject === 'evora').length);
assert.equal(COUNTS.estudos_evora_no_arquivo, PUBLISHED_WORKS.filter(w => w.subject === 'evora').length);
for(const id of Object.keys(frases)) {
  const entrada = claims.get(id).corrections.at(-1);
  assert.equal(entrada.date,'2026-11-13');assert.equal(entrada.kind,'atualizacao');
  assert.equal(entrada.reason,frases[id].pt);assert.equal(entrada.reason_en,frases[id].en);
}
for (const lang of ['pt','en']) {
  const base = lang === 'pt' ? 'estudos' : 'en/studies';
  const construidos = WORKS.filter(w => fs.existsSync(`${dist}/${base}/${w.slug}/index.html`));
  assert.equal(construidos.length,PUBLISHED_WORKS.length);
  for (const [id, frase] of Object.entries(frases)) {
    const html = fs.readFileSync(`${dist}/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${id}/index.html`,'utf8');
    if(id === 'estudos-evora-publicados')assert(parse(html).textContent.replace(/\s+/g,' ').includes(definicaoEvora[lang]),`${id}/${lang}: definição da contagem ausente no HTML`);
    assert(parse(html).textContent.replace(/\s+/g,' ').includes(frase[lang]),`${id}/${lang}: frase do mandato ausente no HTML`);
  }
}
console.log(`REC2 contagens: ${PUBLISHED_WORKS.length} estudos construídos, ${COUNTS.estudos_evora_no_arquivo} de Évora; quatro frases do mandato e duas definições conferidas no HTML.`);
