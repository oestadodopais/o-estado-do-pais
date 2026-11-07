import fs from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { allClaims } from '../../src/lib/ledger.mjs';
import { caminhoDaLinha } from '../../src/lib/livro.mjs';
import { eMarcaDeAusencia } from '../../src/lib/marcas-de-ausencia.mjs';
import { conferirLinhas, conferirRecibo, marcaSeguidaDeUnidade, medirDist, reguaDasUnidades } from '../../scripts/ausencia-nd1.mjs';

const linhas = allClaims(), dist = process.env.OEDP_DIST || 'dist';
const c = linhas.find(c => eMarcaDeAusencia(c.value) && c.unit === 'dias');
assert(c, 'ND1: falta o controlo com marca e unidade dias');
const calculada = linhas.find(c => c.id === 'penedono-indice-de-divida-2024');
assert(calculada?.derived_from?.length && eMarcaDeAusencia(calculada.value), 'ND1 B: falta o controlo calculado com marca');
const html = (lang, linha = c) => fs.readFileSync(`${dist}${caminhoDaLinha(linha.id, lang)}/index.html`, 'utf8');
const regua = reguaDasUnidades(linhas);
const plantas = {
  titulo() {
    const root = parse(html('pt'));
    root.querySelector('title').set_content('N.d. dias · Números e fontes · O Estado do País');
    return marcaSeguidaDeUnidade(root.toString(), regua) ? ['ND1 marca seguida de unidade no título'] : [];
  },
  unidade() {
    const root = parse(html('pt'));
    root.querySelector('.linha-valor').insertAdjacentHTML('beforeend', ' <span class="linha-valor-unidade" data-linha-campo="unit">dias</span>');
    return conferirRecibo(root.toString(), c, 'pt');
  },
  frase() {
    const root = parse(html('en'));
    root.querySelector('[data-nd1-ausencia]').remove();
    return conferirRecibo(root.toString(), c, 'en');
  },
  marca() {
    return conferirLinhas([...linhas, { ...c, id: 'nd1-linha-de-teste', value: 'n.d.' }]);
  },
};
for (const lang of ['pt', 'en']) plantas[`fonte-na-calculada-${lang}`] = () => {
  const root = parse(html(lang, calculada));
  root.querySelector('[data-nd1-ausencia]').set_content(lang === 'pt'
    ? `A fonte publica «${calculada.value}» em vez de um valor.`
    : `The source publishes «<span lang="pt-PT">${calculada.value}</span>» instead of a value.`);
  return conferirRecibo(root.toString(), calculada, lang);
};
const iPlanta = process.argv.indexOf('--planta');
if (iPlanta !== -1) {
  const nome = process.argv[iPlanta + 1];
  assert(Object.hasOwn(plantas, nome), 'ND1 planta desconhecida');
  const erros = plantas[nome]();
  console.log(JSON.stringify({ planta: nome, codigo: erros.length ? 1 : 0, erros }));
  process.exit(erros.length ? 1 : 0);
}

// Os atributos, o texto entre elementos e o código escapado são superfícies distintas.
for (const fragmento of [
  '<meta content="N.d. dias">', '<p>N.d. <span>dias</span></p>',
  '<textarea>&lt;a&gt;N.d. &lt;span&gt;days&lt;/span&gt;&lt;/a&gt;</textarea>',
  '<p>N.d.&nbsp;euros</p>', '<p>N.d. % (limite legal = 150)</p>',
]) assert(marcaSeguidaDeUnidade(fragmento, regua), fragmento);
for (const fragmento of ['<p>ÉVORA 114 129 154 146 N.d.</p>', '<p>N.d.</p>', '<p>12 dias</p>']) {
  assert(!marcaSeguidaDeUnidade(fragmento, regua), fragmento);
}
assert(!eMarcaDeAusencia('n.d.'));
assert.deepEqual(conferirLinhas([
  { id: 'numero', value: '12', unit: 'dias' },
  ...['texto', 'afirmação', 'data'].map(unit => ({ id: unit, value: 'sem número', unit })),
]), []);

const depois = medirDist(dist, linhas);
for (const erro of depois.erros) console.error(erro);
assert.equal(depois.erros.length, 0, 'ND1: o sítio construído falhou a régua');
const provas = Object.keys(plantas).map(nome => {
  const r = spawnSync(process.execPath, [process.argv[1], '--planta', nome], { encoding: 'utf8' });
  assert.equal(r.status, 1, `ND1: a planta ${nome} não ficou vermelha sozinha`);
  const resultado = JSON.parse(r.stdout);
  assert(resultado.erros.length > 0);
  return resultado;
});
const copiarRecibos = linha => ['pt', 'en'].map(lang => {
  const root = parse(html(lang, linha));
  return { lang, rota: caminhoDaLinha(linha.id, lang), titulo: root.querySelector('title').textContent,
    valor: root.querySelector('.linha-valor').textContent.trim(),
    fraseHtml: root.querySelector('[data-nd1-ausencia]').outerHTML,
    excertoParaCitar: root.querySelector('[data-incorporar-codigo]').textContent };
});
const recibos = copiarRecibos(c), recibosCalculados = copiarRecibos(calculada);
const medidas = { depois, plantas: provas, recibos, recibosCalculados };
const iAntes = process.argv.indexOf('--antes');
if (iAntes !== -1) medidas.antes = JSON.parse(fs.readFileSync(process.argv[iAntes + 1], 'utf8'));
const iMedidas = process.argv.indexOf('--medidas');
if (iMedidas !== -1) fs.writeFileSync(process.argv[iMedidas + 1], JSON.stringify(medidas, null, 2) + '\n');
console.log(JSON.stringify({ antes: medidas.antes?.paginasComUnidade.length, depois: depois.paginasComUnidade.length,
  paginas: depois.paginas, recibos: depois.recibos, plantas: provas.map(({ planta, codigo }) => ({ planta, codigo })) }));
if (iMedidas !== -1) for (const recibo of [...recibos, ...recibosCalculados]) console.log(JSON.stringify(recibo));
