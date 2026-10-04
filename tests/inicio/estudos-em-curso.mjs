/** H2: controlos e plantas da composição variável, só em memória. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { WORKS } from '../../src/data/studies.mjs';
import { metaDoEstudoConferida } from '../../scripts/meta-do-estudo.mjs';
let casos = 0;
for (const lang of ['pt','en']) {
  const html = fs.readFileSync(`${process.env.OEDP_DIST ?? 'dist'}/${lang === 'pt' ? '' : 'en/'}index.html`, 'utf8');
  const root = parse(html);
  for (const el of root.querySelectorAll('#trabalhos .estudo-meta')) {
    assert(metaDoEstudoConferida(el,lang)); casos++;
  }
  const marcado = root.querySelector('[data-estudo-em-curso]');
  if (!marcado) continue; // a ficha pode encerrar o acompanhamento.
  const artigo = marcado.closest('[data-estudo]').outerHTML;
  const ensaio = (muda, obras = WORKS) => {
    const r = parse(`<section id="trabalhos">${artigo}</section>`);
    muda(r);
    return metaDoEstudoConferida(r.querySelector('.estudo-meta'),lang,obras);
  };
  for (const muda of [
    r=>r.querySelector('[data-estudo-em-curso]').remove(),
    r=>r.querySelector('[data-estudo-em-curso]').set_content('estado errado'),
    r=>r.querySelector('.estudo-meta').insertAdjacentHTML('beforeend',' prosa sem declaração'),
    r=>r.querySelector('.estudo-meta span').set_content('outro lugar'),
    r=>r.querySelector('time').setAttribute('datetime','2000-01-01'),
    r=>r.querySelector('[data-estudo-em-curso]').removeAttribute('data-estudo-em-curso'),
  ]) { assert.equal(ensaio(muda),false); casos++; }
  const encerrados = structuredClone(WORKS);
  delete encerrados.find(w=>w.slug===marcado.closest('[data-estudo]').getAttribute('data-estudo')).emCurso;
  assert.equal(ensaio(r=>r.querySelector('[data-estudo-em-curso]').remove(),encerrados),true); casos++;
}
console.log(`H2: ${casos} controlos e plantas da composição dos estudos, sem escrever em dist/.`);
