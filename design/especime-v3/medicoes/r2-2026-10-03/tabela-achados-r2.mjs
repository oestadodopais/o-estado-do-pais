/** R2 (03.10.2026): as linhas da tabela «Os 27 achados, antes e depois» do relatório, escritas a partir de
 * `achados-antes-depois.json` (e não à mão). Para cada achado, os campos que mudaram (até três), com a forma de antes e a
 * de depois em português e em inglês; um achado sem campos mudados diz a forma que ficou. Escreve para a saída padrão.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r2-2026-10-03/tabela-achados-r2.mjs > <ficheiro>
 */
import fs from 'node:fs';

const PASTA = 'design/especime-v3/medicoes/r2-2026-10-03';
const ad = JSON.parse(fs.readFileSync(`${PASTA}/achados-antes-depois.json`, 'utf8'));
const NOMES = { nome: 'nome', unidade: 'unidade', dobra: 'dobra', estado: 'estado', faixa: 'frase do lugar', comparacao: 'comparação', regua: 'régua', 'dobra-referencia': 'referência na dobra' };
const curto = (s, n = 150) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const formas = (l) => (l === null ? '(sem cartão)' : l.length ? l.map((f) => `«${curto(f)}»`).join(' / ') : '(nenhuma)');
const ESTADO = { feito: 'feito', feito_em_parte: 'feito em parte', por_verificar: 'por fazer, [verify]', parado: 'parado', recusado: 'recusado pela triagem' };
for (const a of ad.achados) {
  const pares = new Map();
  for (const c of a.campos) {
    const chave = `${c.chave.replace(/\|(pt|en)\|/, '|')}|${c.campo}`;
    if (!pares.has(chave)) pares.set(chave, {});
    pares.get(chave)[c.lang] = c;
  }
  const mudados = [...pares.entries()].filter(([, p]) => p.pt?.mudou || p.en?.mudou);
  const mostrar = (mudados.length ? mudados : [...pares.entries()]).slice(0, 3);
  const celula = (qual) => mostrar.map(([k, p]) => {
    const [familia, id, campo] = k.split('|');
    const onde = familia === 'uniao' ? 'cartão da União, ' : familia === 'camaras' ? 'cartão das câmaras, ' : '';
    return `${onde}${id.replace(/^concelho:/, 'concelho: ')}, ${NOMES[campo] ?? campo}: PT ${formas(p.pt?.[qual] ?? null)}; EN ${formas(p.en?.[qual] ?? null)}`;
  }).join('<br>');
  const resto = (mudados.length > 3 ? `<br>(e mais ${mudados.length - 3} campo(s) mudados, em achados-antes-depois.json)` : '');
  if (!a.campos.length) {
    console.log(`| ${a.achado} | ${ESTADO[a.estado]} | (nenhum rótulo: a régua chaveia cada cartão) | (idem) |`);
    continue;
  }
  console.log(`| ${a.achado} | ${ESTADO[a.estado]} | ${celula('antes')} | ${celula('depois')}${resto} |`);
}
