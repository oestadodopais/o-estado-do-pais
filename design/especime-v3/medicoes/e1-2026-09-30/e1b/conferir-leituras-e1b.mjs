/**
 * A CONFERÊNCIA DAS CÓPIAS DAS LEITURAS (passagem E1b, 01.10.2026).
 *
 *     node design/especime-v3/medicoes/e1-2026-09-30/e1b/conferir-leituras-e1b.mjs <motor> [--json <ficheiro>]
 *
 * Corre da raiz do sítio. Para cada um dos quatro estudos de Évora de 01.10.2026, lê a
 * leitura em `src/data/leituras.mjs` e confere a cópia contra o texto do motor:
 *
 *   1. cada pedaço de `origem.pt` (separados por « · ») está, letra a letra, numa das
 *      linhas que `origem.onde` cita, no `.md` português do motor na cabeça do ramo
 *      (lido por `git show`, nunca da árvore de trabalho), depois de tirar ao Markdown
 *      as marcas que não se leem (negrito, itálico, ligações, escapes);
 *   2. cada pedaço de `origem.en` está nas mesmas linhas do `.md` inglês da mesma pasta,
 *      quando o estudo tem edição inglesa (o gabarito inglês espelha as linhas do
 *      português na leitura de abertura);
 *   3. cada pedaço está também no texto visível do documento alojado no sítio
 *      (`studies-src/<slug>/<lingua>.html`), que é o que o leitor abre;
 *   4. e, só para informar, que palavras da frase da leitura não aparecem nas linhas
 *      citadas.
 *
 * O CONHECIDO-POSITIVO CORRE PRIMEIRO: o mesmo detetor tem de dizer «não está» a duas
 * frases que as emendas tiraram do motor (a «cidade relativamente próspera numa região
 * pobre» do 18 e o «A ano e meio de 2027» do 19) e a uma cópia com uma palavra trocada;
 * se não disser, a conferência sai com 2 sem conferir nada. Sai 1 com uma cópia que não
 * bate, e 0 quando todas batem.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { LEITURAS } from '../../../../../src/data/leituras.mjs';

const ESTUDOS = [
  'evora-contas-da-camara-2010-2025',
  'evora-quem-governou-a-camara-2009-2025',
  'evora-economia-e-dinheiro-publico-de-fora-da-camara',
  'evora-2027-capital-europeia-da-cultura',
];
const [motor] = process.argv.slice(2);
if (!motor || motor.startsWith('--')) {
  console.error('Uso: node conferir-leituras-e1b.mjs <motor> [--json <ficheiro>]');
  process.exit(2);
}
const git = (...a) => execFileSync('git', ['-C', motor, '-c', 'core.quotepath=off', ...a], { encoding: 'utf8', maxBuffer: 64 << 20 });
const cabeca = git('rev-parse', 'HEAD').trim();
const normal = (s) => s.replace(/[  ​]/g, ' ').replace(/\s+/g, ' ').trim();
/** O que um leitor lê numa linha de Markdown: sem marcas de ênfase, sem endereços, sem escapes. */
const lida = (md) => normal(md
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/\\([\\`*\[\]|_])/g, '\u0000$1')
  .replace(/\*\*|\*|`/g, '')
  .replace(/\u0000/g, ''));
const pedacos = (s) => s.split(' · ').map(normal).filter(Boolean);
const naLinha = (pedaco, linhas) => linhas.some((l) => l.includes(pedaco));

function edicoesDaPasta(pasta) {
  const saida = {};
  for (const lingua of ['pt', 'en']) {
    const caminho = `${pasta}/Technical Source/documento.${lingua}.md.tmpl`;
    let gabarito;
    try { gabarito = git('show', `${cabeca}:${caminho}`); } catch { continue; }
    const linha = gabarito.split('\n').find((l) => l.startsWith('@@edicao '));
    if (linha) saida[lingua] = `${pasta}/${linha.slice('@@edicao '.length).trim()}`;
  }
  return saida;
}
const visivel = (ficheiro) => normal(parse(fs.readFileSync(ficheiro, 'utf8')).querySelector('body')?.textContent ?? '');

/* O conhecido-positivo, sobre o mesmo detetor e as mesmas linhas. */
const positivos = [];
{
  const p18 = 'content/18 Évora Economia e Dinheiro de Fora/A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara (pt-PT).md';
  const p19 = 'content/19 Évora 2027 Capital Europeia da Cultura/Évora 2027, Capital Europeia da Cultura (pt-PT).md';
  const l18 = git('show', `${cabeca}:${p18}`).split('\n').map(lida);
  const l19 = git('show', `${cabeca}:${p19}`).split('\n').map(lida);
  const antes18 = git('show', `${cabeca}~2:${p18}`).split('\n').map(lida);
  positivos.push({ o_que: 'a frase do 18 que a emenda tirou não está na cabeça e estava antes dela',
    mordeu: !naLinha('Évora é uma cidade relativamente próspera numa região pobre', [l18[6]]) &&
      naLinha('Évora é uma cidade relativamente próspera numa região pobre', [antes18[6]]) });
  positivos.push({ o_que: 'o «A ano e meio de 2027» do 19 não está na cabeça', mordeu: !naLinha('A ano e meio de 2027', [l19[4]]) && naLinha('A um ano e meio de 2027', [l19[4]]) });
  positivos.push({ o_que: 'uma cópia com uma palavra trocada não está', mordeu: !naLinha('O dinheiro do Estado é o que chegou; o da câmara é o que falta.', [l19[8]]) && naLinha('O dinheiro do Estado é o que chegou; o do município é o que falta.', [l19[8]]) });
}
if (positivos.some((p) => !p.mordeu)) {
  console.log(JSON.stringify({ cabeca_do_motor: cabeca, positivos }, null, 1));
  console.error('O conhecido-positivo falhou: a conferência não diz nada.');
  process.exit(2);
}

const resultados = [];
let falhas = 0;
for (const slug of ESTUDOS) {
  const l = LEITURAS[slug];
  if (!l) { resultados.push({ slug, erro: 'sem leitura' }); falhas++; continue; }
  const [ficheiro, ...resto] = l.origem.onde.split(':');
  const numeros = [resto.join(':')].join('').split(',').map((x) => Number(x.replace(/[^0-9]/g, ''))).filter(Boolean);
  const pasta = ficheiro.split('/').slice(0, 2).join('/');
  const edicoes = edicoesDaPasta(pasta);
  const r = { slug, onde: l.origem.onde, linhas: numeros, edicoes: {} };
  for (const lingua of ['pt', 'en']) {
    const md = edicoes[lingua];
    const copia = l.origem[lingua];
    if (!md) { r.edicoes[lingua] = { edicao_no_motor: null, nota: 'o estudo não tem esta edição no motor' }; continue; }
    if (lingua === 'pt' && md !== ficheiro) { r.edicoes[lingua] = { erro: `a origem cita ${ficheiro} e a edição é ${md}` }; falhas++; continue; }
    const linhas = git('show', `${cabeca}:${md}`).split('\n').map(lida);
    const citadas = numeros.map((n) => linhas[n - 1] ?? '');
    const alojado = `studies-src/${slug}/${lingua}.html`;
    const texto = fs.existsSync(alojado) ? visivel(alojado) : null;
    const cada = pedacos(copia ?? '').map((p) => ({ pedaco: p, no_motor: naLinha(p, citadas), no_documento_alojado: texto === null ? null : texto.includes(p) }));
    const frase = (l.frase?.[lingua] ?? []).filter((x) => typeof x === 'string').join(' ');
    const palavrasDasLinhas = new Set(citadas.join(' ').toLowerCase().match(/[\p{L}’']{3,}/gu) ?? []);
    const fora = [...new Set((frase.toLowerCase().replace(/’/g, "'").match(/[\p{L}']{3,}/gu) ?? []).filter((w) => !palavrasDasLinhas.has(w) && !palavrasDasLinhas.has(w.replace(/'/g, '’'))))];
    const ok = cada.length > 0 && cada.every((c) => c.no_motor && c.no_documento_alojado !== false);
    if (!ok) falhas++;
    r.edicoes[lingua] = { edicao_no_motor: md, documento_alojado: texto === null ? null : alojado, pedacos: cada, bate: ok, palavras_da_frase_fora_das_linhas_citadas: fora };
  }
  resultados.push(r);
}
const saida = { cabeca_do_motor: cabeca, positivos, estudos: resultados, falhas };
const j = process.argv.indexOf('--json');
if (j >= 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(saida, null, 1) + '\n');
console.log(JSON.stringify(saida, null, 1));
process.exit(falhas ? 1 : 0);
