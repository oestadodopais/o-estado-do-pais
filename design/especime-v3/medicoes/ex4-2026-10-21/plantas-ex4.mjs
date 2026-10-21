/**
 * AS PLANTAS DO EX4 (21.10.2026): cada forma nova da gramática das explicações tem um estrago em memória que tem de
 * fechar a construção (o resolvedor atira) ou mudar o que a célula X conta, e o controlo sem estrago tem de passar.
 *   · uma porta para um estudo que não existe, e uma para uma explicação que não existe (o mandato, §2, «as portas»);
 *   · um identificador transcrito cujo texto registado não é o que o campo selado dá («Mapa 3» em vez de «Mapa 2»);
 *   · um identificador cuja linha saiu do livro;
 *   · uma secção com um título em pedaços que traz um algarismo escrito à mão.
 * Corre-se da raiz: `node design/especime-v3/medicoes/ex4-2026-10-21/plantas-ex4.mjs [--json <ficheiro>]`.
 */
import fs from 'node:fs';
import { resolverExplicacao, portasDaExplicacao, IDENTIFICADORES_SELADOS } from '../../../../src/lib/explicacoes.mjs';
import { VERBATIM } from '../../../../src/data/verbatim.mjs';
import { DINHEIRO_DO_ESTADO_2027 as E } from '../../../../src/data/explicacoes/dinheiro-do-estado-2027.mjs';

/** @type {{ nome: string, mordeu: boolean, queixa: string }[]} */
const out = [];
const atira = (/** @type {string} */ nome, /** @type {() => unknown} */ f, /** @type {RegExp} */ mordida) => {
  try { f(); out.push({ nome, mordeu: false, queixa: 'nenhuma' }); } catch (err) { const q = String(/** @type {any} */ (err)?.message ?? err); out.push({ nome, mordeu: mordida.test(q), queixa: q.slice(0, 200) }); }
};
let controlo = true;
for (const lang of /** @type {const} */ (['pt', 'en'])) { try { resolverExplicacao(E, lang); portasDaExplicacao(E, lang); } catch { controlo = false; } }
atira('uma porta para um estudo que não existe', () => portasDaExplicacao({ ...E, portas: [{ rota: 'livro' }, { rota: 'estudo', slug: 'estudo-que-nao-existe' }] }, 'pt'), /não está em WORKS/);
atira('uma porta para uma explicação que não existe', () => portasDaExplicacao({ ...E, portas: [{ rota: 'livro' }, { rota: 'explicacao', slug: 'explicacao-que-nao-existe' }] }, 'en'), /não está declarada/);
const v = /** @type {any} */ (VERBATIM)['pf1-mapa-2027-numero'];
const antes = v.text;
v.text = '3';
atira('o número do mapa registado não é o do campo selado', () => resolverExplicacao(E, 'pt'), /pf1-mapa-2027-numero.*regista «3»/);
v.text = antes;
const d = /** @type {any} */ (IDENTIFICADORES_SELADOS)['pf1-subfuncao-01-7-codigo'];
const linha = d.linha;
d.linha = 'linha-que-saiu-do-livro';
atira('o identificador lê uma linha que saiu do livro', () => resolverExplicacao(E, 'pt'), /não está no livro-razão/);
d.linha = linha;
const t = structuredClone(E);
t.seccoes[2].titulo.pt = ['O que muda de 2026 para a proposta de ', { periodo: 'oe-2027-cem-euros-funcao-01-mapa' }, ''];
atira('um algarismo escrito à mão num título de secção em pedaços', () => resolverExplicacao(t, 'pt'), /traz um algarismo/);
for (const lang of /** @type {const} */ (['pt', 'en'])) { try { resolverExplicacao(E, lang); } catch { controlo = false; } }
const resumo = { controlo, plantas: out, todas: controlo && out.every((p) => p.mordeu) };
const j = process.argv.indexOf('--json');
if (j > 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(resumo, null, 2) + '\n');
console.log(`plantas EX4: controlo ${controlo ? 'limpo' : 'SUJO'}; ${out.filter((p) => p.mordeu).length} de ${out.length} morderam.`);
for (const p of out) if (!p.mordeu) console.error(`  · não mordeu: ${p.nome} (${p.queixa})`);
if (!resumo.todas) process.exit(1);
