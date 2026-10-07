/** Atualiza as linhas da política pela redação da passagem H4-e (a partir da terceira volta da H4-e, a cabeça c92532ea) e confere-as com --confere.
 * node design/especime-v3/medicoes/h4-2026-10-06/inventario-politica-h4e4.mjs
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { POLITICA } from '../../../../src/data/politica-ia.mjs';
const base = 'c92532ea';
const fonte = execFileSync('git', ['show', `${base}:src/data/politica-ia.mjs`], { encoding: 'utf8' });
const { POLITICA: antes } = await import('data:text/javascript;base64,' + Buffer.from(fonte).toString('base64'));
const linhas = (p) => ['pt', 'en'].flatMap((l) => [...p.lugares.intro[l], ...p.lugares.itens.map((i) => `${i.rotulo[l]} ${i.texto[l]}`), ...p.lugares.fecho[l]]);
const antigas = linhas(antes), novas = linhas(POLITICA);
const destino = 'design/especime-v3/INVENTARIO-FRASES.md';
let inventario = fs.readFileSync(destino, 'utf8');
if (!process.argv.includes('--confere')) {
  for (const frase of antigas.filter((s) => !novas.includes(s))) {
    const entrada = inventario.split('\n').find((s) => s.includes(`| ${frase} |`));
    if (!entrada) throw Error(`Frase anterior ausente: ${frase}`);
    inventario = inventario.replace(entrada, `| divulgacao | ${frase} | h4 | retirada | H4-e, quarta volta: a frase reescrita depois da terceira leitura (o que a direção escreve e quem o lê; as verificações automáticas em vez dos portões; o que a construção diz quando um campo está por confirmar; a leitura confere). |`);
  }
  const cabecalho = '## H4 · os lugares da inteligência artificial';
  const inicio = inventario.indexOf(cabecalho), fim = inventario.indexOf('\n## ', inicio + cabecalho.length);
  if (inicio < 0 || fim < 0) throw Error('Não se encontrou a secção H4 completa.');
  let secao = inventario.slice(inicio, fim).replace(/Texto do brief H4[^\n]+/, 'Redação decidida pelo lugar de direção (§1.173), revista na passagem H4-d pelos achados da leitura a frio. Linhas geradas por `design/especime-v3/medicoes/h4-2026-10-06/inventario-politica-h4e4.mjs`.');
  for (const frase of novas) {
    if (!inventario.split('\n').some((s) => s.includes(`| ${frase} |`) && s.includes('| viva |'))) {
      secao = secao.trimEnd() + `\n| divulgacao | ${frase} | h4 | viva | H4-e, quarta volta: redação decidida pelo lugar de direção (§1.173), reescrita depois das três leituras da H4-e. |\n`;
    }
  }
  inventario = inventario.slice(0, inicio) + secao.trimEnd() + '\n' + inventario.slice(fim);
  fs.writeFileSync(destino, inventario);
}
for (const frase of novas) {
  const entradas = inventario.split('\n').filter((s) => s.includes(`| ${frase} |`) && s.includes('| viva |'));
  if (entradas.length !== 1) throw Error(`A frase nova não tem uma linha viva única: ${frase}`);
}
for (const frase of antigas.filter((s) => !novas.includes(s))) {
  if (inventario.split('\n').some((s) => s.includes(`| ${frase} |`) && s.includes('| viva |'))) throw Error(`Frase antiga ainda viva: ${frase}`);
}
for (const l of inventario.split('\n')) {
  if (l.includes('| h4 | viva |') && !novas.some((frase) => l.includes(`| ${frase} |`))) throw Error(`Linha h4 viva que não é da redação atual: ${l.slice(0, 120)}`);
}
console.log(`${novas.length} frases vivas conferidas; ${antigas.filter((s) => !novas.includes(s)).length} frases anteriores retiradas.`);
