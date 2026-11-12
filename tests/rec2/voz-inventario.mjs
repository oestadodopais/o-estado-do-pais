/** REC2: dispensa estreita das descrições retiradas e dos rótulos já declarados. */
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {WORKS} from '../../src/data/studies.mjs';
import {DOSSIES} from '../../src/data/dossies.mjs';
import {FP1} from '../../src/data/rotulos-fp1.mjs';
import {routePath} from '../../src/lib/routes.mjs';
import {leInventario} from '../../scripts/voz.mjs';
import {donosRetiradosDaDescricao, separarDescricoesRetiradas, rotuloDoDossieNaNovidade} from '../../scripts/voz-inventario-retirados.mjs';
const inventario = leInventario(process.cwd()).linhas;
const esperadas = inventario.filter(l => l.estado === 'viva' && l.classe === 'conteudo' && WORKS.filter(w => w.estado === 'retirado').some(w => Object.values(w.description).includes(l.texto)));
assert.equal(esperadas.length, 28);
const ausentes = esperadas.map(({n, texto, classe, bloco}) => ({n, texto, classe, bloco}));
const r = separarDescricoesRetiradas(ausentes, inventario);
assert.equal(r.saltadas.length, 28); assert.deepEqual(r.restantes, []);
const viva = inventario.find(l => l.estado === 'viva' && WORKS.filter(w => w.estado !== 'retirado').some(w => Object.values(w.description).includes(l.texto)));
assert(viva); assert.equal(separarDescricoesRetiradas([viva], inventario).restantes.length, 1);
assert.equal(separarDescricoesRetiradas([...ausentes, viva], inventario).restantes.length, 1);
let plantas = 2;
for (const alterar of [l => ({...l, texto:l.texto + ' Outra frase.'}), l => ({...l, classe:'navegacao'}), l => ({...l, n:-1}), l => ({...l, bloco:'outro'})]) {
  assert.equal(separarDescricoesRetiradas([alterar(ausentes[0])], inventario).restantes.length, 1); plantas++;
}
const dona = WORKS.find(w => r.saltadas[0].estudos.includes(w.slug));
assert.equal(donosRetiradosDaDescricao(esperadas[0], [{...dona, estado:undefined}]).length, 0); plantas++;
assert.equal(donosRetiradosDaDescricao(esperadas[0], [dona, {...dona, slug:'planta-publicada', estado:undefined}]).length, 0); plantas++;
for (const lang of ['pt','en']) {
  const slug = DOSSIES[0].slug;
  const html = `<main><section data-novidades><li data-novidade="dossie:${slug}"><span class="pp-novidade-tipo"><span data-voz>${FP1[lang].dossie}</span></span><a data-novidade-dossie="${slug}" href="${routePath('dossie',lang,{slug})}"></a></li></section></main>`;
  const root = parse(html), el = root.querySelector('.pp-novidade-tipo');
  assert(rotuloDoDossieNaNovidade(el, lang, 'home'));
  assert(!rotuloDoDossieNaNovidade(el, lang, 'estudo')); plantas++;
  for (const mudar of [
    r => r.querySelector('.pp-novidade-tipo').set_content(FP1[lang].dossie + ' prosa acrescentada'),
    r => r.querySelector('li').setAttribute('data-novidade','dossie:inexistente'),
    r => r.querySelector('a').setAttribute('href','/destino-trocado/'),
    r => r.querySelector('section').removeAttribute('data-novidades'),
    r => r.querySelector('li').setAttribute('data-novidade','estudo:' + slug),
  ]) {
    const alterado = parse(html); mudar(alterado);
    assert(!rotuloDoDossieNaNovidade(alterado.querySelector('.pp-novidade-tipo'), lang, 'home')); plantas++;
  }
}
console.log(`REC2 voz: 28 descrições de retirados contadas; ${plantas} plantas recusadas, incluindo descrição publicada ausente e rótulo alterado.`);
