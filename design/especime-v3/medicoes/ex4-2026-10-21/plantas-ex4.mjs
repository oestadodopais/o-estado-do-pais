/**
 * AS PLANTAS DO EX4 (21.10.2026): cada forma nova da gramática das explicações tem um estrago em memória que tem de
 * fechar a construção (o resolvedor atira) ou mudar o que a célula X conta, e o controlo sem estrago tem de passar.
 *   · uma porta para um estudo que não existe, e uma para uma explicação que não existe (o mandato, §2, «as portas»);
 *   (os dois identificadores transcritos do EX4, o número do mapa e o código da subfunção, saíram na correção EX4-b com o
 *   mecanismo que os relia, e as suas plantas com eles; a planta das cadeias só de algarismos está em `scripts/gate-html.mjs`);
 *   · uma secção com um título em pedaços que traz um algarismo escrito à mão.
 * Corre-se da raiz: `node design/especime-v3/medicoes/ex4-2026-10-21/plantas-ex4.mjs [--json <ficheiro>]`.
 */
import fs from 'node:fs';
import { resolverExplicacao, portasDaExplicacao } from '../../../../src/lib/explicacoes.mjs';
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
