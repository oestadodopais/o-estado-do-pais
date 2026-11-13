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

const frases = [
 'As decisões com autor, e as eleições que decidiram quem as tomou, estão no estudo Quem governou a Câmara de Évora, 2009 a 2025.',
 'The decisions with an author, and the elections that decided who took them, are in the study Who governed the Câmara de Évora, 2009 to 2025.',
 'Ver também o estudo A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara.',
 'See also the study A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara.',
];
for(const rota of ['/estudos/evora-contas-da-camara-2010-2025/','/en/studies/evora-2027-capital-europeia-da-cultura/document/'])for(const frase of frases){
 assert(conferir(WORKS,rota,`<p>${frase}</p>`).length,rota+frase);
 assert(conferir(WORKS,rota,`<a href="/">${frase}</a>`).length);
}
const titulo='A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara';
const historia=`<div class="historico-entrada"><span data-correcao-campo="date">13.11.2026</span><p>${titulo}</p></div>`;
assert.deepEqual(conferir(WORKS,'/livro-razao/exemplo/',historia),[]);
assert(conferir(WORKS,'/livro-razao/exemplo/',historia.replace('13.11.2026','')).length);
assert(conferir(WORKS,'/estudos/exemplo/',historia).length);
assert.deepEqual(conferir(WORKS,'/correcoes/',`<p>${titulo}</p>`),[]);
assert.deepEqual(conferir(WORKS,'/en/corrections/',`<p>${titulo}</p>`),[]);
for(const rota of ['/estudos/evora-economia-e-dinheiro-publico-de-fora-da-camara','/en/studies/evora-economia-e-dinheiro-publico-de-fora-da-camara'])assert(conferir(WORKS,'/',`<p>${rota}</p>`).length);
console.log('RET1-B: remissões das contas e de Évora 2027 repostas recusadas, também dentro de ligações; endereço visível recusa; história datada e correções passam; história sem data ou fora do recibo recusa.');
