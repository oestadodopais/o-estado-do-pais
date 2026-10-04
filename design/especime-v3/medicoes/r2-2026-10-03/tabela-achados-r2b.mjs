/** R2-b (04.10.2026): as linhas das tabelas da secção R2-b do relatório, escritas a partir de
 * `achados-antes-depois-r2b.json` (e não à mão). A primeira tabela tem os 27 achados com a forma de antes do bloco
 * (d9b168b9) e a de depois da passagem (a cabeça desta), até três campos por achado, os que mudaram primeiro; a segunda
 * tem o que a passagem mudou por decisão do lugar de direção, com a forma da entrega do R2 (6a711d3e) e a de depois.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r2-2026-10-03/tabela-achados-r2b.mjs [--r2b] > <ficheiro>
 */
import fs from 'node:fs';

const PASTA = 'design/especime-v3/medicoes/r2-2026-10-03';
const ad = JSON.parse(fs.readFileSync(`${PASTA}/achados-antes-depois-r2b.json`, 'utf8'));
const segunda = process.argv.includes('--r2b');
const NOMES = { nome: 'nome', unidade: 'unidade', dobra: 'dobra', estado: 'estado', faixa: 'frase do lugar', comparacao: 'comparação', regua: 'régua', 'dobra-referencia': 'referência na dobra', 'dobra-termo': 'termo na dobra', ressalva: 'ressalva' };
const curto = (s, n = 150) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const formas = (l) => (l === null ? '(sem rótulo)' : l.length ? l.map((f) => `«${curto(f)}»`).join(' / ') : '(nenhuma)');
const ESTADO = { feito: 'feito', feito_em_parte: 'feito em parte', recusado: 'recusado pela triagem' };
const ONDE = { uniao: 'cartão da União, ', camaras: 'cartão das câmaras, ', paises: 'faixa dos 27, ', recibo: 'recibo, ', dobra: 'dobra da União, ' };
for (const a of ad.achados) {
  if ((typeof a.achado === 'number') === segunda) continue;
  const pares = new Map();
  for (const c of a.campos) {
    const chave = `${c.chave.replace(/\|(pt|en)\|/, '|')}|${c.campo}`;
    if (!pares.has(chave)) pares.set(chave, {});
    pares.get(chave)[c.lang] = c;
  }
  const mudou = (p) => (segunda ? p.pt?.mudou_na_r2b || p.en?.mudou_na_r2b : p.pt?.mudou || p.en?.mudou);
  const mudados = [...pares.entries()].filter(([, p]) => mudou(p));
  const mostrar = (mudados.length ? mudados : [...pares.entries()]).slice(0, 3);
  const celula = (qual) => mostrar.map(([k, p]) => {
    const [familia, id, campo] = k.split('|');
    return `${ONDE[familia] ?? ''}${id.replace(/^concelho:/, 'concelho: ')}, ${NOMES[campo] ?? campo}: PT ${formas(p.pt?.[qual] ?? null)}; EN ${formas(p.en?.[qual] ?? null)}`;
  }).join('<br>');
  const resto = mudados.length > 3 ? `<br>(e mais ${mudados.length - 3} campo(s) mudados, em achados-antes-depois-r2b.json)` : '';
  if (!a.campos.length) {
    console.log(`| ${a.achado} | ${ESTADO[a.estado] ?? a.estado} | (nenhum rótulo: a régua chaveia cada cartão) | (idem) |`);
    continue;
  }
  console.log(`| ${a.achado} | ${ESTADO[a.estado] ?? a.estado} | ${celula(segunda ? 'entrega' : 'antes')} | ${celula('depois')}${resto} |`);
}
