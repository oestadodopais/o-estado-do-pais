/** H4: as linhas do inventário vêm das declarações, nunca de uma transcrição à mão.
 * node design/especime-v3/medicoes/h4-2026-10-06/inventario-politica.mjs
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { POLITICA } from '../../../../src/data/politica-ia.mjs';
const base = '207d7134';
const anterior = execFileSync('git', ['show', `${base}:src/data/politica-ia.mjs`], { encoding: 'utf8' });
const { POLITICA: antes } = await import('data:text/javascript;base64,' + Buffer.from(anterior).toString('base64'));
const linhas = (p) => ['pt', 'en'].flatMap((lang) => [...p.lugares.intro[lang], ...p.lugares.itens.map((i) => `${i.rotulo[lang]} ${i.texto[lang]}`), ...p.lugares.fecho[lang]]);
const antigas = linhas(antes); const novas = linhas(POLITICA);
const retiradas = antigas.filter((s) => !novas.includes(s));
const acrescentadas = novas.filter((s) => !antigas.includes(s));
const destino = 'design/especime-v3/INVENTARIO-FRASES.md';
let inventario = fs.readFileSync(destino, 'utf8');
for (const frase of retiradas) {
  const linha = inventario.split('\n').find((l) => l.includes(`| ${frase} |`));
  if (!linha) throw Error(`Não se achou a frase antiga: ${frase}`);
  if (linha.includes('| retirada |')) continue;
  inventario = inventario.replace(linha, `| divulgacao | ${frase} | h4 | retirada | H4, §1.172: o Codex constrói; a direção e a leitura cabem aos modelos Claude; a medição cega não foi exercida. |`);
}
if (!inventario.includes('## H4 · os lugares da inteligência artificial')) {
  inventario += '\n## H4 · os lugares da inteligência artificial\n\nTexto provisório do brief H4, §3, ponto 4, nas duas edições. A direção confirma a redação antes de aterrar. Linhas geradas por `design/especime-v3/medicoes/h4-2026-10-06/inventario-politica.mjs`.\n\n';
  inventario += acrescentadas.map((s) => `| divulgacao | ${s} | h4 | viva | texto provisório do brief H4 |`).join('\n') + '\n';
}
fs.writeFileSync(destino, inventario);
const revisoes = 'design/especime-v3/critica/REVISOES-DO-INVENTARIO.md';
let rev = fs.readFileSync(revisoes, 'utf8');
if (!rev.includes('## H4 · os lugares da inteligência artificial')) {
  rev += `\n## H4 · os lugares da inteligência artificial\n\n| bloco | mudança | estado | nota |\n| --- | --- | --- | --- |\n| h4 | ${acrescentadas.length} cadeias novas, ${retiradas.length} retiradas | por ler | Codex gpt-6-astra: texto provisório do brief H4, §3, ponto 4. Os lugares e as famílias dizem a organização decidida na §1.172; a medição cega sai porque não foi exercida. A leitura a frio pelo Claude Opus e a confirmação da redação pela direção ficam pendentes antes da fusão. |\n`;
}
fs.writeFileSync(revisoes, rev);
fs.writeFileSync('design/especime-v3/medicoes/h4-2026-10-06/inventario-politica.json', JSON.stringify({ comando: 'node design/especime-v3/medicoes/h4-2026-10-06/inventario-politica.mjs', base, retiradas, acrescentadas, contagens: { retiradas: retiradas.length, acrescentadas: acrescentadas.length, lugares: POLITICA.lugares.itens.length } }, null, 2) + '\n');
