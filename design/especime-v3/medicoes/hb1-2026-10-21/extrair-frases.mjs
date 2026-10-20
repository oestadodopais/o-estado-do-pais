/** HB1-c: extrai a prosa das páginas construídas e localiza o primeiro uso das siglas. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const {parse} = createRequire(path.resolve('package.json'))('node-html-parser');
const destino = process.argv[2];
assert(destino, 'indique o ficheiro de saída');
const slug = 'a-casa-em-portugal-e-na-europa';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const normalizar = s => s.replace(/\s+/g, ' ').trim();
const expansoes = {
  INE: ['Instituto Nacional de Estatística', 'National Statistics Institute'],
  IVA: ['imposto sobre o valor acrescentado', 'value added tax'],
  IRS: ['imposto sobre o rendimento das pessoas singulares', 'personal income tax'],
  PSP: ['Polícia de Segurança Pública', 'Public Security Police'],
  IGAI: ['Inspeção-Geral da Administração Interna', 'Inspectorate-General of Home Affairs'],
  CGTP: ['Confederação Geral dos Trabalhadores Portugueses', 'General Confederation of Portuguese Workers'],
  PS: ['Partido Socialista', 'Socialist Party'],
  PCP: ['Partido Comunista Português', 'Portuguese Communist Party'],
  BE: ['Bloco de Esquerda', 'Left Bloc'],
  PAN: ['Pessoas-Animais-Natureza', 'People-Animals-Nature'],
  IL: ['Iniciativa Liberal', 'Liberal Initiative'],
  PSD: ['Partido Social Democrata', 'Social Democratic Party'],
  CDS: ['Centro Democrático Social, Partido Popular', 'Democratic and Social Centre, People’s Party'],
  FEH: ['Fundo de Emergência para a Habitação', 'Housing Emergency Fund'],
};
const resultado = {
  codigo: 0,
  cabeca: JSON.parse(fs.readFileSync('dist/version.json')).commit,
  criterio: 'Prosa extraída por textContent; apenas .src-chip e .vh excluídos da comparação. Espaços normalizados só na comparação, nunca nos textos guardados. Blocos numerados como data-registo-bloco, a partir de zero.',
  edicoes: {},
};
for (const [idioma, lingua] of ['pt', 'en'].entries()) {
  const base = lingua === 'pt' ? `/estudos/${slug}` : `/en/studies/${slug}`;
  const rota = base + (lingua === 'pt' ? '/documento' : '/document');
  const documentoBytes = fs.readFileSync(`dist${rota}/index.html`);
  const estudoBytes = fs.readFileSync(`dist${base}/index.html`);
  const documento = parse(documentoBytes.toString()), estudo = parse(estudoBytes.toString());
  const frases = documento.querySelector('main').childNodes.filter(n => n.tagName).map(n => n.textContent);
  const blocos = estudo.querySelectorAll('[data-registo-bloco]').map(n => {
    const copia = parse(n.outerHTML);
    for (const elemento of copia.querySelectorAll('.src-chip,.vh')) elemento.remove();
    return {bloco: Number(n.getAttribute('data-registo-bloco')), texto: copia.textContent, texto_com_selos: n.textContent};
  });
  assert(frases.length > 0);
  assert.equal(blocos.length, frases.length);
  assert.equal(new Set(blocos.map(b => b.bloco)).size, frases.length);
  for (const b of blocos) assert.equal(normalizar(b.texto), normalizar(frases[b.bloco]), `${lingua}: bloco ${b.bloco}`);
  const siglas = Object.entries(expansoes).map(([sigla, nomes]) => {
    const padrao = new RegExp(`\\b${sigla}\\b`);
    const bloco = frases.findIndex(t => padrao.test(t));
    assert(bloco >= 0, `${lingua}: sigla ${sigla} ausente`);
    const texto = frases[bloco], posicao = texto.search(padrao), expansao = nomes[idioma];
    const inicio = texto.indexOf(expansao);
    assert(inicio >= 0 && inicio < posicao, `${lingua}: ${sigla} não expandida ao primeiro uso`);
    return {sigla, expansao, bloco, seletor: `[data-registo-bloco="${bloco}"]`, contexto: texto.slice(inicio, posicao + sigla.length)};
  });
  resultado.edicoes[lingua] = {
    estudo: base, documento: rota,
    estudo_sha256: sha(estudoBytes), documento_sha256: sha(documentoBytes),
    documento_blocos: frases, estudo_blocos: blocos, siglas,
    comparacao: {blocos: frases.length, diferencas: 0},
  };
}
fs.writeFileSync(destino, JSON.stringify(resultado, null, 2) + '\n');
console.log(JSON.stringify({codigo: resultado.codigo, cabeca: resultado.cabeca, edicoes: Object.fromEntries(Object.entries(resultado.edicoes).map(([l,e]) => [l,{...e.comparacao,siglas:e.siglas.length}]))}));
