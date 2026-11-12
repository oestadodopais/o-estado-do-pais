/** EVL-C: as duas listas reais recusam palavras, anos e prosa sem declaração. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {verificaVozPais} from '../../scripts/voz-pais.mjs';
import {verificaB1} from '../../scripts/voz-b1.mjs';
const raiz = process.cwd();
const slug = 'evora-2027-capital-europeia-da-cultura';
const resultados = [];
for (const [rota, lang, lista] of [['','pt',false], ['en','en',false], ['estudos','pt',true], ['en/studies','en',true]]) {
  const html = fs.readFileSync(`dist/${rota ? rota+'/' : ''}index.html`, 'utf8');
  const conferir = pagina => {
    const documentos = new Map([[rota, pagina.toString()]]);
    return lista ? verificaB1(raiz, documentos).erros : verificaVozPais(raiz, documentos);
  };
  const controlo = conferir(parse(html));
  assert.deepEqual(controlo, [], `controlo ${rota || '/'}`);
  resultados.push({rota:rota || '/', caso:'controlo', recusas:0});
  for (const indice of [0,1]) {
    for (const caso of ['palavra trocada','ano trocado']) {
      const pagina = parse(html);
      const medida = pagina.querySelectorAll(`[data-estudo="${slug}"] [data-medida-estudo]`)[indice];
      assert(medida);
      if (caso === 'ano trocado') medida.querySelector('[data-nonledger="data-de-referencia"]').set_content('2024');
      else medida.set_content(medida.innerHTML.replace(lang === 'pt' ? 'protocolo' : 'protocol', 'intruso').replace(lang === 'pt' ? 'painel' : 'panel', 'intruso'));
      const erros = conferir(pagina);
      assert(erros.some(e => e.startsWith('B1 medida:')), `${rota}: ${caso} aceite`);
      resultados.push({rota:rota || '/', medida:indice, caso, recusas:erros.length});
    }
  }
  const pagina = parse(html);
  pagina.querySelector(`[data-estudo="${slug}"]`).insertAdjacentHTML('beforeend','<p>Texto intruso sem medida declarada.</p>');
  const erros = conferir(pagina);
  assert(erros.some(e => e.includes('B1 lista fechada') && e.includes('Texto intruso')), `${rota}: prosa solta aceite`);
  resultados.push({rota:rota || '/', caso:'texto solto', recusas:erros.length});
}
if (process.env.OEDP_MEDICOES) fs.writeFileSync(`${process.env.OEDP_MEDICOES}/evl-c-plantas.json`,JSON.stringify(resultados,null,2)+'\n');
console.log(`EVL-C: ${resultados.filter(r=>r.caso==='controlo').length} controlos verdes; ${resultados.filter(r=>r.caso!=='controlo').length} plantas recusadas nas duas páginas e línguas.`);
