import assert from 'node:assert/strict';
import {WORKS} from '../../src/data/studies.mjs';
import {MUNICIPIOS_COM_PAGINA} from '../../src/data/municipios.mjs';
import {conferirReferenciasSemLigacao as conferir} from '../../scripts/estudos-retirados-conferir.mjs';
for (const w of WORKS) for (const lang of ['pt','en']) assert(Array.isArray(w.alcunhas?.[lang]), `${w.slug}: alcunhas ${lang} por declarar`);
const antigas = [
  'As fontes dos pelouros registam a repartição deste mandato, e ela está no estudo de quem governou a câmara.',
  'The portfolio sources record this term’s split, and it is in the study of who governed the council.',
];
for (const frase of antigas) assert(conferir(WORKS, '/municipios/evora/', `<p>${frase}</p>`).length);
assert(conferir(WORKS, '/agenda/', '<p>A repartição está no <em>estudo dos pelouros</em>.</p>').length);
assert.deepEqual(conferir(WORKS, '/agenda/', '<p>A rubrica está no estudo das contas da Câmara de Évora.</p>'), []);
assert.deepEqual(conferir(WORKS, '/', '<script>estudo dos pelouros</script><p hidden>estudo dos pelouros</p>'), []);
const preparado = {slug:'preparado', publication:'declared', editions:[{lang:'pt',date:null}], alcunhas:{pt:['estudo por publicar'],en:[]}};
assert(conferir([preparado], '/', '<p>Está no estudo por publicar.</p>').length);
const dados = JSON.stringify(MUNICIPIOS_COM_PAGINA);
for (const frase of antigas) assert(!dados.includes(frase));
console.log('RET1 remissões: frase antiga PT/EN e alcunha retirada noutra página recusadas; publicado passa; preparação recusa; texto oculto excluído; alcunhas declaradas em todos os trabalhos.');
