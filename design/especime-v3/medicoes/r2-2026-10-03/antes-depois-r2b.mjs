/** R2-b (04.10.2026): a forma de antes, a da entrega do R2 e a de depois da passagem R2-b dos rótulos que cada um dos 27
 * achados da triagem toca, e dos que a passagem R2-b mudou por decisão do lugar de direção, nas duas edições, lidas de três
 * construções pela régua do inventário dos rótulos (`--inventario`), e não escritas à mão.
 *
 *   antes    a construção da cabeça de partida do bloco (d9b168b9): `antes-inventario-r2.json`, escrito no R2;
 *   entrega  a construção da cabeça que o R2 entregou (6a711d3e), numa cópia de `git archive` fora da árvore, lida pela
 *            régua desta passagem (que já conhece a faixa dos 27 e o recibo): `entrega-inventario-r2b.json`;
 *   depois   a construção da cabeça da passagem em `dist/`: `depois-inventario-r2b.json`.
 *
 * Escreve `achados-antes-depois-r2b.json`. O conhecido-positivo: o achado 4 muda da entrega para depois (a forma do
 * excerto), e o achado 19, recusado pela triagem, não muda em construção nenhuma.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r2-2026-10-03/antes-depois-r2b.mjs
 */
import fs from 'node:fs';

const PASTA = 'design/especime-v3/medicoes/r2-2026-10-03';
const ler = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const antes = ler(`${PASTA}/antes-inventario-r2.json`);
const entrega = ler(`${PASTA}/entrega-inventario-r2b.json`);
const depois = ler(`${PASTA}/depois-inventario-r2b.json`);
const estados = ler(`${PASTA}/achados-r2b.json`).estados;

const N = (id, ...campos) => campos.map((c) => ['nacional', id, c]);
const U = (id, ...campos) => campos.map((c) => ['uniao', id, c]);
const C = (medida, ...campos) => campos.map((c) => ['concelho', `concelho:${medida}`, c]);
const ACHADOS = {
  1: [...N('jovens-nem-2025', 'unidade'), ...N('competencias-digitais-2025', 'unidade')],
  2: [...C('divida', 'nome', 'dobra')],
  3: [...C('indice', 'unidade'), ['camaras', 'camaras', 'unidade']],
  4: [...N('desempenho-das-exportacoes-2025', 'nome', 'unidade', 'dobra'), ...U('desempenho-das-exportacoes-2025', 'nome', 'unidade')],
  5: [...N('criancas-em-creche-2025', 'nome', 'dobra')],
  6: [...N('retribuicao-minima-mensal-garantida-continente-2026', 'nome', 'dobra'), ...N('retribuicao-minima-mensal-doze-meses-2026', 'nome')],
  7: [...N('divida-das-empresas-2025', 'nome'), ...N('fluxo-de-credito-as-empresas-2025', 'nome'), ...N('divida-das-familias-2025', 'nome'), ...U('divida-das-empresas-2025', 'nome')],
  8: [],
  9: [...N('taxa-de-emprego-2025', 'unidade'), ...N('taxa-de-desemprego-2025', 'unidade'), ...N('desemprego-de-longa-duracao-2025', 'unidade'), ...N('ipc-variacao-homologa', 'unidade'), ...N('ipc-variacao-media-12-meses', 'unidade'), ...N('risco-de-pobreza-ou-exclusao-2025', 'unidade'), ...N('penalizacao-antecipacao-um-ano-com-factor-2026', 'unidade'), ...N('agua-nao-faturada-portugal-2024', 'unidade')],
  10: [...N('saldo-da-balanca-corrente-2025', 'unidade'), ...N('divida-publica-2025', 'unidade', 'dobra'), ...N('evora-vab-empresarial-2024', 'unidade'), ...N('evora-concentracao-vab4-2024', 'dobra-termo')],
  11: [...N('pib-pc-alentejo-2024', 'unidade', 'dobra'), ...N('pib-pc-acores-2024', 'dobra-termo'), ...N('evora-poder-de-compra-2023', 'unidade', 'dobra')],
  12: [...N('pib-real-per-capita-2025', 'unidade', 'dobra')],
  13: [...N('taxa-de-actividade-2025', 'unidade'), ...N('custo-unitario-do-trabalho-2025', 'unidade'), ...N('taxa-de-cambio-efectiva-real-2025', 'unidade'), ...N('disparidade-de-emprego-entre-sexos-2025', 'unidade')],
  14: [...N('racio-s80-s20-2025', 'nome', 'unidade'), ...N('factor-sustentabilidade-2026', 'unidade', 'dobra-termo')],
  15: [...N('fluxo-de-credito-as-empresas-2025', 'unidade'), ...N('fluxo-de-credito-as-familias-2025', 'unidade')],
  16: [...N('custo-unitario-do-trabalho-2025', 'nome'), ...N('taxa-de-cambio-efectiva-real-2025', 'nome'), ...N('taxa-de-actividade-2025', 'nome')],
  17: [...N('saldo-das-administracoes-publicas-2025', 'nome'), ...N('posicao-de-investimento-internacional-2025', 'nome'), ...N('formacao-bruta-de-capital-fixo-2025', 'nome'), ...N('crescimento-da-despesa-liquida-2025', 'nome')],
  18: [...N('sobrecarga-do-custo-da-habitacao-2025', 'dobra'), ...N('disparidade-salarial-entre-sexos-2024', 'unidade', 'dobra'), ...N('necessidades-medicas-nao-satisfeitas-2025', 'dobra'), ...N('independencia-da-justica-2025', 'dobra')],
  19: [...N('jovens-nem-2025', 'regua')],
  20: [...N('taxa-de-desemprego-mip-2025', 'estado'), ...N('divida-publica-2025', 'estado'), ...N('crescimento-da-despesa-liquida-2025', 'estado'), ...N('divida-publica-2025', 'dobra-referencia')],
  21: [...C('indice', 'faixa')],
  22: [...C('ganho', 'comparacao'), ...C('poderDeCompra', 'comparacao')],
  23: [...C('populacao', 'dobra'), ...C('empresas', 'dobra'), ...C('desempregoRegistado', 'dobra')],
  24: [...N('ganho-medio-mensal-2024', 'dobra'), ...N('pensao-media-anual-2025', 'unidade'), ...N('linha-de-risco-de-pobreza-2025', 'unidade', 'dobra'), ...N('evora-execucao-da-receita-2025', 'unidade')],
  25: [...N('evora-pelouros-2025-presidente', 'unidade'), ...N('evora-prr-aprovado-2026', 'nome'), ...N('evora-divida-inicio-mandato-reexpressa', 'dobra-termo')],
  26: [...C('pmp', 'dobra')],
  27: [...N('evora-camara-lugares', 'unidade'), ...N('licencas-de-construcao-2025', 'unidade')],
  /* O que a passagem R2-b mudou por decisão do lugar de direção, além dos achados. */
  'R2-b · os nomes das variações': [...N('ipc-combustiveis-variacao-homologa', 'nome'), ...N('ipc-rendas-variacao-homologa', 'nome'), ...N('precos-da-habitacao-2025', 'nome'), ...U('precos-da-habitacao-2025', 'nome')],
  'R2-b · as faixas dos 27': [['paises', 'taxa-de-emprego-2025', 'unidade'], ['paises', 'precos-da-habitacao-2025', 'nome'], ['paises', 'precos-da-habitacao-2025', 'unidade'], ['paises', 'divida-publica-2025', 'unidade']],
  'R2-b · a ressalva do salário mínimo': [['recibo', 'retribuicao-minima-mensal-garantida-continente-2026', 'ressalva']],
};
const formas = (inv, familia, lang, id, campo) => {
  const c = inv.inventario[`${familia}|${lang}|${id}`];
  if (!c) return null;
  return Object.keys(c[campo] ?? {});
};
const saida = [];
for (const [n, linhas] of Object.entries(ACHADOS)) {
  const campos = [];
  for (const [familia, id, campo] of linhas) for (const lang of ['pt', 'en']) {
    const a = formas(antes, familia, lang, id, campo);
    const e = formas(entrega, familia, lang, id, campo);
    const d = formas(depois, familia, lang, id, campo);
    campos.push({ lang, chave: `${familia}|${lang}|${id}`, campo, antes: a, entrega: e, depois: d, mudou: JSON.stringify(a) !== JSON.stringify(d), mudou_na_r2b: JSON.stringify(e) !== JSON.stringify(d) });
  }
  saida.push({ achado: /^\d+$/.test(n) ? Number(n) : n, estado: estados[n] ?? 'feito', campos, campos_que_mudaram: campos.filter((c) => c.mudou).length, campos_que_mudaram_na_r2b: campos.filter((c) => c.mudou_na_r2b).length });
}
const positivo = {
  achado_4_mudou_na_r2b: saida.find((a) => a.achado === 4).campos_que_mudaram_na_r2b > 0,
  achado_19_nao_mudou: saida.find((a) => a.achado === 19).campos_que_mudaram === 0 && saida.find((a) => a.achado === 19).campos_que_mudaram_na_r2b === 0,
};
fs.writeFileSync(`${PASTA}/achados-antes-depois-r2b.json`, JSON.stringify({
  o_que: 'As formas de antes (a construção de d9b168b9), da entrega do R2 (a de 6a711d3e) e de depois da passagem R2-b (a de dist/) dos rótulos que cada achado e cada mudança da passagem tocam, lidas pela régua do inventário dos rótulos.',
  antes: antes.construcao ?? 'd9b168b9 (cópia de git archive, sem version.json)',
  entrega: entrega.construcao ?? '6a711d3e (cópia de git archive)',
  depois: depois.construcao,
  conhecido_positivo: positivo,
  achados: saida,
}, null, 1) + '\n');
for (const a of saida) console.log(`${typeof a.achado === 'number' ? `achado ${a.achado}` : a.achado} (${a.estado}): ${a.campos_que_mudaram} de ${a.campos.length} campo(s) mudaram desde o início do bloco, ${a.campos_que_mudaram_na_r2b} na R2-b`);
console.log(`conhecido-positivo: ${JSON.stringify(positivo)}`);
process.exitCode = positivo.achado_4_mudou_na_r2b && positivo.achado_19_nao_mudou ? 0 : 1;
