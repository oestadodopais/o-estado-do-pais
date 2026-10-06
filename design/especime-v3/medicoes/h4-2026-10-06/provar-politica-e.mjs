/** H4: plantas da célula dos lugares, sobre cópias em memória do HTML construído.
 * Cada estrago exige a mensagem própria, e cada cópia intacta tem de passar.
 * node design/especime-v3/medicoes/h4-2026-10-06/provar-politica.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { conferirLugaresIA } from '../../../../scripts/lugares-ia-do-portao.mjs';
const passagemE = process.argv.includes('--passagem-e');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const estado = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' });
const construcao = JSON.parse(fs.readFileSync('dist/version.json', 'utf8'));
if (passagemE && (estado || construcao.commit !== cabeca)) throw Error('A política H4-e exige uma construção desta cabeça e a árvore limpa.');
const resultados = [];
const intactas = [];
for (const [lang, ficheiro] of [['pt', 'dist/metodo/index.html'], ['en', 'dist/en/method/index.html']]) {
  const bytes = fs.readFileSync(ficheiro);
  const sha = createHash('sha256').update(bytes).digest('hex');
  const limpas = conferirLugaresIA(parse(bytes.toString()), lang);
  intactas.push({ lang, ficheiro, sha256: sha, falhas: limpas });
  const plantas = [
    ['um lugar a mais', (r) => r.querySelector('.politica-lugares').insertAdjacentHTML('beforeend', '<li>Medição inventada</li>'), 'H4 IA: a política tem de dizer três lugares.'],
    ['a construção em falta', (r) => r.querySelectorAll('.politica-lugares li')[1].remove(), 'H4 IA: a política tem de dizer três lugares.'],
    ['a medição no lugar da leitura', (r) => r.querySelectorAll('.politica-lugares li')[2].set_content('Medição inventada'), 'H4 IA: os lugares não são os da redação decidida.'],
    ['a introdução antiga', (r) => r.querySelector('.politica-lugares').parentNode.querySelectorAll('p')[0].set_content(lang === 'pt' ? 'São quatro lugares.' : 'There are four places.'), 'H4 IA: a introdução dos lugares difere da redação decidida.'],
    ['a família da construção trocada', (r) => { const p = r.querySelector('.politica-lugares').parentNode.querySelectorAll('p').at(-1); p.set_content(p.textContent.replace('Codex', 'Claude')); }, 'H4 IA: as famílias e os lugares do fecho diferem da redação decidida.'],
    ['a divisão fixa antiga', (r) => r.querySelector('.politica-lugares').parentNode.querySelectorAll('p').at(-1).set_content(lang === 'pt'
      ? 'São os modelos Claude da Anthropic na direção e na leitura, e o Codex da OpenAI na construção.'
      : 'They are the Claude models from Anthropic in the direction and the reading, and Codex from OpenAI in the building.'), 'H4 IA: as famílias e os lugares do fecho diferem da redação decidida.'],
    ['a construção e a leitura da mesma família', (r) => r.querySelectorAll('.politica-lugares li')[2].set_content(lang === 'pt'
      ? 'A leitura lê cada peça e é da mesma família de modelos que a construção.'
      : 'Reading reads each piece and is by the same family of models that built it.'), 'H4 IA: os lugares não são os da redação decidida.'],
    ['a direção com palavras de oficina', (r) => r.querySelectorAll('.politica-lugares li')[0].set_content(lang === 'pt'
      ? 'A direção dirige o trabalho: escreve os briefs, revê e funde.'
      : 'Direction directs the work: it writes the briefs, reviews and merges.'), 'H4 IA: os lugares não são os da redação decidida.'],
    ['a construção com palavras de oficina', (r) => r.querySelectorAll('.politica-lugares li')[1].set_content(lang === 'pt'
      ? 'A construção constrói o sítio e o motor, e verifica lotes na fonte.'
      : 'Building builds the site and the engine, and checks batches at the source.'), 'H4 IA: os lugares não são os da redação decidida.'],
  ];
  for (const [nome, muda, mensagem] of plantas) {
    const r = parse(bytes.toString()); muda(r);
    const falhas = conferirLugaresIA(r, lang);
    if (r.toString() === parse(bytes.toString()).toString()) throw Error(`A planta não mudou a cópia: ${nome}`);
    resultados.push({ nome, lang, mensagem, falhas, passou: !limpas.length && falhas.includes(mensagem) });
  }
  if (sha !== createHash('sha256').update(fs.readFileSync(ficheiro)).digest('hex')) throw Error('A prova alterou o HTML em disco.');
}
const passou = intactas.every((r) => !r.falhas.length) && resultados.every((r) => r.passou);
const estadoFim = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' });
if (passagemE && (estadoFim || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() !== cabeca)) throw Error('A árvore ou a cabeça mudou durante as plantas da política.');
const ficheiro = `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica${passagemE ? '-e' : ''}.json`;
const destino = passagemE ? path.join(process.env.OEDP_H4_PROVAS ?? '.', ficheiro) : ficheiro;
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, JSON.stringify({ comando: 'node design/especime-v3/medicoes/h4-2026-10-06/provar-politica.mjs' + (passagemE ? ' --passagem-e' : ''), cabeca, estado, estado_fim: estadoFim, construcao, intactas, plantas: resultados, passou }, null, 2) + '\n');
console.log(`${resultados.length} plantas dos lugares: ${resultados.filter((r) => r.passou).length} morderam a mensagem esperada.`);
process.exitCode = passou ? 0 : 1;
