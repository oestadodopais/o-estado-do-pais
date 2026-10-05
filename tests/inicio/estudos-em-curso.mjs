/** H2: controlos e plantas da composição variável, só em memória. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { WORKS } from '../../src/data/studies.mjs';
import { metaDoEstudoConferida } from '../../scripts/meta-do-estudo.mjs';
import { conferirPrazosEmCurso, dataDaConstrucao } from '../../scripts/estudos-em-curso.mjs';
let casos = 0;
const dist = process.env.OEDP_DIST ?? 'dist';
const hoje = dataDaConstrucao(dist);
assert.deepEqual(conferirPrazosEmCurso(WORKS, hoje), []);
// Correm mesmo que todas as fichas reais tenham encerrado o acompanhamento.
const ontem = new Date(Date.parse(hoje) - 86400000).toISOString().slice(0, 10);
const amanha = new Date(Date.parse(hoje) + 86400000).toISOString().slice(0, 10);
const obra = ate => [{ slug: 'planta-do-prazo', emCurso: { razao: 'Ensaio sintético.', ate } }];
const passado=conferirPrazosEmCurso(obra(ontem), hoje).join(' ');
assert.match(passado, /ficha tem de ser decidida: prolongar a data ou tirar o campo emCurso/); casos++;
console.log(`mordeu · prazo passado · ${passado}`);
for (const ate of [hoje, amanha]) { assert.deepEqual(conferirPrazosEmCurso(obra(ate), hoje), []); casos++; }
for (const ate of [undefined, '2027-02-30']) { assert.match(conferirPrazosEmCurso(obra(ate), hoje).join(' '), /data de fim válida/); casos++; }
assert.deepEqual(conferirPrazosEmCurso([{ slug: 'acompanhamento-encerrado' }], hoje), []); casos++;
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
    r=>r.querySelector('[data-estudo-em-curso]').set_content(lang === 'pt' ? 'em curso até 1999' : 'ongoing until 1999'),
    r=>r.querySelector('.estudo-meta').insertAdjacentHTML('beforeend',' prosa sem declaração'),
    r=>r.querySelector('.estudo-meta span').set_content('outro lugar'),
    r=>r.querySelector('time').setAttribute('datetime','2000-01-01'),
    r=>r.querySelector('[data-estudo-em-curso]').removeAttribute('data-estudo-em-curso'),
  ]) { assert.equal(ensaio(muda),false); casos++; }
  const encerrados = structuredClone(WORKS);
  delete encerrados.find(w=>w.slug===marcado.closest('[data-estudo]').getAttribute('data-estudo')).emCurso;
  assert.equal(ensaio(r=>r.querySelector('[data-estudo-em-curso]').remove(),encerrados),true); casos++;
}
console.log(`H2-b: ${casos} controlos e plantas do prazo e da composição dos estudos, data da construção ${hoje}, sem escrever em dist/.`);
await import('./prazo-pela-celula.mjs');
