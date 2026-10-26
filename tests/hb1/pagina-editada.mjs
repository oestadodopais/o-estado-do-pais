/** HB1-g (22.10.2026): as duas linhas que só declaram a última edição de uma página dizem essa data com o seu
    nome em todos os lugares da página (a descrição da cabeça, o excerto para incorporar, o JSON e a atribuição),
    nunca como edição do documento nem como período; uma linha com período fica como estava. Corre no
    `check:datas`, depois da construção, porque a atribuição só existe no HTML construído. Com
    OEDP_DIST_HB1G=<pasta> lê outro dist/ (o conhecido-positivo da medição: o dist/ de antes da HB1-g fecha). */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadClaims, paginaSoComEdicao } from '../../src/lib/ledger.mjs';
import { descricaoDaLinha } from '../../src/lib/livro.mjs';
import { codigoDaIncorporacao } from '../../src/lib/incorporar.mjs';
import { lerPaginaComCodigo, codigoEsperado, conferirJson } from '../../scripts/incorporar-do-portao.mjs';
import { routePath } from '../../src/lib/routes.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';
import { t } from '../../src/i18n/strings.mjs';

const dist = process.env.OEDP_DIST_HB1G ? path.resolve(process.env.OEDP_DIST_HB1G) : fileURLToPath(new URL('../../dist', import.meta.url));
const EDITADAS = ['hab-eurostat-privacao-severa-definicao', 'hab-il-proposta'];
const CONTROLO = 'hab-ine-iphab-homologa';
const LINGUAS = ['pt', 'en'];
const linhas = loadClaims({ includeWithdrawn: true });
const minuscula = (x) => x.charAt(0).toLocaleLowerCase('pt-PT') + x.slice(1);
const limpo = (x) => String(x ?? '').replace(/\s+/g, ' ').trim();

/* A contagem: o predicado vale exatamente nas duas linhas do livro. */
const verdadeiras = [...linhas.values()].filter((c) => paginaSoComEdicao(c)).map((c) => c.id).sort();
assert.deepEqual(verdadeiras, EDITADAS, `o predicado vale em ${verdadeiras.length} linhas: ${verdadeiras.join(', ')}`);

function problemasDaDescricao(texto, c, lang) {
  const s = t(lang), erros = [];
  if (texto.includes(s.prov.referencia)) erros.push(`a descrição diz «${s.prov.referencia}»`);
  if (texto.includes(`(${c.published_at})`)) erros.push('a descrição tem a data entre parênteses');
  if (!texto.includes(`${s.livro.linha.editadoEmK} ${c.published_at}`)) erros.push('a descrição não diz a data com o seu nome');
  return erros;
}
function problemasDoExcerto(codigo, c, lang) {
  const data = dataDaCasa(c.published_at, lang), erros = [];
  if (!codigo.includes(`, ${minuscula(t(lang).livro.linha.editadoEmK)} ${data}: `)) erros.push('o excerto não diz a data com o seu nome');
  if (codigo.includes(`, ${data}: `)) erros.push('o excerto põe a data no lugar do período');
  return erros;
}
function problemasDaAtribuicao(html, texto, c, lang) {
  const erros = [];
  if (texto.includes(dataDaCasa(c.published_at, lang)) || texto.includes(String(c.published_at))) erros.push('a atribuição tem a data');
  if (html.includes('data-de-campo="document.edition"')) erros.push('a atribuição tem o campo da edição');
  return erros;
}
function pagina(id, lang) {
  const root = lerPaginaComCodigo(fs.readFileSync(`${dist}${routePath('linha', lang, { slug: id })}/index.html`, 'utf8'));
  const atribuicao = root.querySelector('p.linha-atribuicao');
  return {
    descricao: root.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    og: root.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '',
    codigo: root.querySelector('#codigo-incorporar')?.textContent ?? '',
    atribuicaoHtml: atribuicao?.outerHTML ?? '',
    atribuicao: limpo(atribuicao?.textContent),
  };
}
let plantas = 0;
function morde(nome, erros) {
  assert(erros.length > 0, `a planta não mordeu: ${nome}`);
  plantas++;
  console.log(`PLANTA HB1-g ${nome}: vermelho 1, verde 0`);
}

for (const id of EDITADAS) {
  const c = linhas.get(id);
  assert(c && paginaSoComEdicao(c), `${id}: o predicado não vale`);
  const doc = JSON.parse(fs.readFileSync(`${dist}/livro-razao/${id}.json`, 'utf8'));
  for (const lang of LINGUAS) {
    const onde = `${id} (${lang})`;
    const descricao = descricaoDaLinha(c, lang), codigo = codigoDaIncorporacao(c, lang) ?? '';
    assert.deepEqual(problemasDaDescricao(descricao, c, lang), [], `${onde}: a descrição`);
    assert.deepEqual(problemasDoExcerto(codigo, c, lang), [], `${onde}: o excerto`);
    assert.equal(codigoEsperado(c, lang), codigo, `${onde}: o portão recontado e o compositor divergem`);
    const p = pagina(id, lang);
    assert.deepEqual(problemasDaDescricao(p.descricao, c, lang), [], `${onde}: a descrição construída`);
    assert.deepEqual(problemasDaDescricao(p.og, c, lang), [], `${onde}: a og:description construída`);
    assert.deepEqual(problemasDoExcerto(p.codigo, c, lang), [], `${onde}: o excerto construído`);
    assert.equal(p.codigo, codigoEsperado(c, lang), `${onde}: o excerto construído não é o do portão`);
    assert.deepEqual(problemasDaAtribuicao(p.atribuicaoHtml, p.atribuicao, c, lang), [], `${onde}: a atribuição construída: ${p.atribuicao}`);
    assert.deepEqual(conferirJson(doc, c, lang), [], `${onde}: o JSON`);

    /* As plantas: cada uma inverte uma regra, na linha, na página ou diante do portão, e tem de fechar. */
    const semMarca = structuredClone(c);
    delete semMarca.published_at_kind;
    morde(`descrição pela regra antiga (a linha sem published_at_kind), ${onde}`, problemasDaDescricao(descricaoDaLinha(semMarca, lang), c, lang));
    const comPeriodo = { ...structuredClone(c), period: c.published_at };
    assert(!paginaSoComEdicao(comPeriodo), 'com período o predicado não vale');
    morde(`excerto com a data no lugar do período (a linha com period), ${onde}`, problemasDoExcerto(codigoDaIncorporacao(comPeriodo, lang) ?? '', c, lang));
    const data = dataDaCasa(c.published_at, lang);
    morde(`atribuição com a data como edição (a página), ${onde}`, problemasDaAtribuicao(
      p.atribuicaoHtml.replace('</p>', ` (<span data-de-campo="document.edition">${data}</span>)</p>`), `${p.atribuicao} (${data})`, c, lang));
    const antigo = codigoDaIncorporacao(semMarca, lang) ?? '';
    morde(`portão do código diante do excerto antigo, ${onde}`, antigo !== codigoEsperado(c, lang) ? ['o código antigo difere do recontado'] : []);
    const jsonAntigo = structuredClone(doc);
    jsonAntigo.incorporacao[lang].periodo = data;
    morde(`portão do JSON diante do período antigo, ${onde}`, conferirJson(jsonAntigo, c, lang));
  }
}

/* O controlo: uma linha com período fica como estava. */
const k = linhas.get(CONTROLO);
assert(k && !paginaSoComEdicao(k), 'o controlo não pode ser uma página editada');
for (const lang of LINGUAS) {
  const s = t(lang), onde = `${CONTROLO} (${lang})`;
  const descricao = descricaoDaLinha(k, lang);
  assert(descricao.includes(`${s.prov.referencia} ${k.reference_date}`), `${onde}: a descrição perdeu «${s.prov.referencia}»`);
  assert(!descricao.includes(s.livro.linha.editadoEmK), `${onde}: a descrição ganhou o rótulo da página editada`);
  const codigo = codigoDaIncorporacao(k, lang) ?? '';
  assert(codigo.includes(`, ${dataDaCasa(k.period ?? k.reference_date, lang)}: `), `${onde}: o excerto perdeu o período`);
  assert(!codigo.includes(minuscula(s.livro.linha.editadoEmK)), `${onde}: o excerto ganhou o rótulo da página editada`);
  const p = pagina(CONTROLO, lang);
  assert(p.atribuicao.includes(`(${k.document.edition})`), `${onde}: a atribuição perdeu a edição: ${p.atribuicao}`);
  assert.equal(p.codigo, codigoEsperado(k, lang), `${onde}: o excerto construído não é o do portão`);
}
console.log(`HB1-g: ${EDITADAS.length} linhas que só declaram a última edição de uma página, nas duas edições (a descrição, o excerto, o JSON e a atribuição); o controlo ${CONTROLO} como estava; ${plantas} plantas.`);
