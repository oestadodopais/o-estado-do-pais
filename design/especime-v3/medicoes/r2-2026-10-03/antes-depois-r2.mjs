/** R2 (03.10.2026): a forma de antes e a de depois dos rótulos que cada um dos 27 achados da triagem toca, nas duas
 * edições, lidas de duas construções pela régua do inventário dos rótulos (`--inventario`), e não escritas à mão.
 *
 *   antes   a construção da cabeça de partida do bloco (d9b168b9), feita numa cópia de `git archive` fora da árvore,
 *           com a tranca da máquina: `OEDP_DIST=<cópia>/dist node scripts/inventario-rotulos.mjs --inventario
 *           design/especime-v3/medicoes/r2-2026-10-03/antes-inventario-r2.json`;
 *   depois  a construção da cabeça do bloco em `dist/`: `node scripts/inventario-rotulos.mjs --inventario
 *           design/especime-v3/medicoes/r2-2026-10-03/depois-inventario-r2.json`.
 *
 * Cada achado diz os cartões e os campos que toca (a chave da régua: família, edição e linha ou medida); o guião
 * escreve `achados-antes-depois.json` com as formas de cada campo nas duas construções (os algarismos do período, do
 * estado e das frases da faixa estão apagados pela régua, «#»), e se mudou. O conhecido-positivo: o achado 1 tem de
 * mudar (a unidade dos jovens), e o achado 4, parado, não pode mudar.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r2-2026-10-03/antes-depois-r2.mjs
 */
import fs from 'node:fs';

const PASTA = 'design/especime-v3/medicoes/r2-2026-10-03';
const ler = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const antes = ler(`${PASTA}/antes-inventario-r2.json`);
const depois = ler(`${PASTA}/depois-inventario-r2.json`);
const estados = ler(`${PASTA}/achados-r2.json`).estados;

const N = (id, ...campos) => campos.map((c) => ['nacional', id, c]);
const U = (id, ...campos) => campos.map((c) => ['uniao', id, c]);
const C = (medida, ...campos) => campos.map((c) => ['concelho', `concelho:${medida}`, c]);
const ACHADOS = {
  1: [...N('jovens-nem-2025', 'unidade'), ...N('competencias-digitais-2025', 'unidade')],
  2: [...C('divida', 'nome', 'dobra')],
  3: [...C('indice', 'unidade'), ['camaras', 'camaras', 'unidade']],
  4: [...N('desempenho-das-exportacoes-2025', 'nome', 'unidade'), ...U('desempenho-das-exportacoes-2025', 'nome')],
  5: [...N('criancas-em-creche-2025', 'nome', 'dobra')],
  6: [...N('retribuicao-minima-mensal-garantida-continente-2026', 'nome', 'dobra'), ...N('retribuicao-minima-mensal-doze-meses-2026', 'nome')],
  7: [...N('divida-das-empresas-2025', 'nome'), ...N('fluxo-de-credito-as-empresas-2025', 'nome'), ...N('divida-das-familias-2025', 'nome'), ...U('divida-das-empresas-2025', 'nome')],
  8: [],
  9: [...N('taxa-de-emprego-2025', 'unidade'), ...N('taxa-de-desemprego-2025', 'unidade'), ...N('desemprego-de-longa-duracao-2025', 'unidade'), ...N('ipc-variacao-homologa', 'unidade'), ...N('ipc-variacao-media-12-meses', 'unidade'), ...N('risco-de-pobreza-ou-exclusao-2025', 'unidade'), ...N('penalizacao-antecipacao-um-ano-com-factor-2026', 'unidade'), ...N('agua-nao-faturada-portugal-2024', 'unidade')],
  10: [...N('saldo-da-balanca-corrente-2025', 'unidade'), ...N('divida-publica-2025', 'unidade', 'dobra'), ...N('evora-vab-empresarial-2024', 'unidade')],
  11: [...N('pib-pc-alentejo-2024', 'unidade', 'dobra'), ...N('evora-poder-de-compra-2023', 'unidade', 'dobra')],
  12: [...N('pib-real-per-capita-2025', 'unidade', 'dobra')],
  13: [...N('taxa-de-actividade-2025', 'unidade'), ...N('custo-unitario-do-trabalho-2025', 'unidade'), ...N('taxa-de-cambio-efectiva-real-2025', 'unidade'), ...N('disparidade-de-emprego-entre-sexos-2025', 'unidade')],
  14: [...N('racio-s80-s20-2025', 'nome', 'unidade'), ...N('factor-sustentabilidade-2026', 'unidade', 'dobra')],
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
  25: [...N('evora-pelouros-2025-presidente', 'unidade'), ...N('evora-prr-aprovado-2026', 'nome'), ...N('evora-divida-inicio-mandato-reexpressa', 'dobra')],
  26: [...C('pmp', 'dobra')],
  27: [...N('evora-camara-lugares', 'unidade'), ...N('licencas-de-construcao-2025', 'unidade')],
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
    const d = formas(depois, familia, lang, id, campo);
    campos.push({ lang, chave: `${familia}|${lang}|${id}`, campo, antes: a, depois: d, mudou: JSON.stringify(a) !== JSON.stringify(d) });
  }
  saida.push({ achado: Number(n), estado: estados[n], campos, campos_que_mudaram: campos.filter((c) => c.mudou).length });
}
const positivo = {
  achado_1_mudou: saida.find((a) => a.achado === 1).campos_que_mudaram > 0,
  achado_4_nao_mudou: saida.find((a) => a.achado === 4).campos_que_mudaram === 0,
};
fs.writeFileSync(`${PASTA}/achados-antes-depois.json`, JSON.stringify({
  o_que: 'As formas de antes (a construção de d9b168b9) e de depois (a de dist/) dos rótulos que cada achado toca, lidas pela régua do inventário dos rótulos.',
  antes: antes.construcao ?? 'd9b168b9 (cópia de git archive, sem version.json)',
  depois: depois.construcao,
  conhecido_positivo: positivo,
  achados: saida,
}, null, 1) + '\n');
for (const a of saida) console.log(`achado ${a.achado} (${a.estado}): ${a.campos_que_mudaram} de ${a.campos.length} campo(s) mudaram`);
console.log(`conhecido-positivo: ${JSON.stringify(positivo)}`);
process.exitCode = positivo.achado_1_mudou && positivo.achado_4_nao_mudou ? 0 : 1;
