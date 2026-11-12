import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {lerTextosJulgados} from '../../scripts/textos-julgados.mjs';
import {conferirTextoDaPagina} from '../../scripts/texto-da-pagina-julgada.mjs';

const medidas = [];
for (const {estudo, lingua} of lerTextosJulgados()) {
  const par = `${estudo}/${lingua}`, base = lingua === 'pt' ? 'estudos' : 'en/studies';
  const html = fs.readFileSync(`dist/${base}/${estudo}/index.html`, 'utf8');
  const registo = JSON.parse(fs.readFileSync(`registos/${par}.record.json`, 'utf8'));
  const erros = conferirTextoDaPagina(parse(html), registo, par);
  // Diferença real: parar com o bloco e as duas versões, sem a normalizar.
  assert.deepEqual(erros, [], JSON.stringify(erros, null, 2));
  const plantas = [];
  for (const [nome, mudar] of [
    ['palavra no parágrafo', root => {
      const el = root.querySelector('.estudo-texto p[data-registo-bloco]');
      el.set_content(el.textContent.replace(/\p{L}+/u, 'ADULTERADO'));
    }],
    ['palavra na primeira célula', root => {
      const el = root.querySelector('[data-registo-bloco] tr td');
      assert(el.nextElementSibling, 'a célula não pode ser a última');
      el.set_content(el.textContent.replace(/\p{L}+/u, 'ADULTERADO'));
    }],
    ['número no texto', root => {
      const el = root.querySelector('.estudo-texto .texto-figura');
      assert(/\d/u.test(el.textContent));
      el.set_content(el.textContent.replace(/\d/u, n => String((Number(n) + 1) % 10)));
    }],
    ['blocos fora de ordem', root => {
      const [a, b] = root.querySelectorAll('.estudo-texto p[data-registo-bloco]');
      const copiaA = a.outerHTML, copiaB = b.outerHTML;
      a.insertAdjacentHTML('beforebegin', copiaB); b.insertAdjacentHTML('beforebegin', copiaA);
      a.remove(); b.remove();
    }],
  ]) {
    const copia = parse(html); mudar(copia);
    const recusas = conferirTextoDaPagina(copia, registo, par);
    assert(recusas.length > 0, `${par}: planta aceite: ${nome}`);
    plantas.push({nome, recusas: recusas.length});
  }
  const m = {estudo, lingua, blocos: registo.blocks.length,
    paragrafos: registo.blocks.filter(b => b.kind === 'paragraph').length,
    titulos: registo.blocks.filter(b => b.kind === 'heading').length,
    itens: registo.blocks.filter(b => b.kind === 'list').reduce((n, b) => n + b.items.length, 0),
    celulas: registo.blocks.filter(b => b.kind === 'table').reduce((n, b) => n + b.rows.reduce((s, r) => s + r.length, 0), 0), plantas};
  medidas.push(m);
  console.log(`${par}: ${m.blocos} blocos, ${m.paragrafos} parágrafos, ${m.titulos} títulos, ${m.itens} itens, ${m.celulas} células; ${plantas.length} plantas recusadas.`);
}
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(medidas, null, 2) + '\n');
