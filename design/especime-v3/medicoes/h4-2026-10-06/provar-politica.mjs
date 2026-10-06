/** H4: plantas da célula dos lugares, sobre cópias em memória do HTML construído.
 * Cada estrago exige a mensagem própria, e cada cópia intacta tem de passar.
 * node design/especime-v3/medicoes/h4-2026-10-06/provar-politica.mjs
 */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { conferirLugaresIA } from '../../../../scripts/lugares-ia-do-portao.mjs';
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
    ['a medição no lugar da leitura', (r) => r.querySelectorAll('.politica-lugares li')[2].set_content('Medição inventada'), 'H4 IA: os lugares não são os da redação do brief.'],
    ['a introdução antiga', (r) => r.querySelector('.politica-lugares').parentNode.querySelectorAll('p')[0].set_content(lang === 'pt' ? 'São quatro lugares.' : 'There are four places.'), 'H4 IA: a introdução dos lugares difere da redação do brief.'],
    ['a família da construção trocada', (r) => { const p = r.querySelector('.politica-lugares').parentNode.querySelectorAll('p').at(-1); p.set_content(p.textContent.replace('Codex', 'Claude')); }, 'H4 IA: as famílias e os lugares do fecho diferem da redação do brief.'],
  ];
  for (const [nome, muda, mensagem] of plantas) {
    const r = parse(bytes.toString()); muda(r);
    const falhas = conferirLugaresIA(r, lang);
    resultados.push({ nome, lang, mensagem, falhas, passou: !limpas.length && falhas.includes(mensagem) });
  }
  if (sha !== createHash('sha256').update(fs.readFileSync(ficheiro)).digest('hex')) throw Error('A prova alterou o HTML em disco.');
}
const passou = intactas.every((r) => !r.falhas.length) && resultados.every((r) => r.passou);
fs.writeFileSync('design/especime-v3/medicoes/h4-2026-10-06/plantas-politica.json', JSON.stringify({ comando: 'node design/especime-v3/medicoes/h4-2026-10-06/provar-politica.mjs', intactas, plantas: resultados, passou }, null, 2) + '\n');
console.log(`${resultados.length} plantas dos lugares: ${resultados.filter((r) => r.passou).length} morderam a mensagem esperada.`);
process.exitCode = passou ? 0 : 1;
