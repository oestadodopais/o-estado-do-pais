import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {contarEstudosDoLugar} from '../../scripts/contar-estudos-do-lugar.mjs';
import {WORKS} from '../../src/data/studies.mjs';
import {routePath} from '../../src/lib/routes.mjs';
const vivos = WORKS.filter(w => w.subject === 'evora' && w.estado !== 'retirado');
for (const lang of ['pt','en']) {
  const contar = (html, lugar='evora') => contarEstudosDoLugar(parse(html), '/planta', lang, lugar, WORKS);
  const portas = vivos.map(w => `<a href="${routePath('estudo',lang,{slug:w.slug})}">Estudo</a>`).join('');
  assert.equal(contar(`<section id="trabalhos">${portas}</section>`), vivos.length);
  assert.equal(contar('<main></main>', 'alentejo'), 0);
  assert.throws(() => contar('<main></main>'), /não tem a secção/);
  assert.throws(() => contar('<section id="trabalhos"></section>'), /exatamente/);
  assert.throws(() => contar(`<main>${portas}</main>`, 'alentejo'), /exatamente/);
  assert.throws(() => contar(`<section id="trabalhos">${portas.replace(routePath('estudo',lang,{slug:vivos[0].slug}),routePath('estudo',lang==='pt'?'en':'pt',{slug:vivos[0].slug}))}</section>`), /noutra língua/);
}
console.log('RET1 lugares: vazio aceite; secção e estudo vivo ausentes, porta indevida e língua trocada recusados nas duas línguas.');
