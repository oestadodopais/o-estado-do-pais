/**
 * AS FRASES DA EXPLICAÇÃO DE 2027 COMO O RESOLVEDOR AS RENDE (bloco EX4, 21.10.2026), nas duas edições, com as linhas
 * que cada parágrafo cita. Não são lidas de `dist/`: a construção não corre com as linhas do PF1 no livro (o
 * `ledger:check` recusa o campo `period` das 83 linhas, a regra 7 de `src/lib/ledger.mjs`), e por isso a página não
 * existe; isto é o que o resolvedor que a página usaria devolve. Corre-se da raiz:
 * `node design/especime-v3/medicoes/ex4-2026-10-21/frases-ex4.mjs [--json <ficheiro>]`.
 */
import fs from 'node:fs';
import { explicacaoResolvida, textoDosPedacosDaExplicacao } from '../../../../src/lib/explicacoes.mjs';

const ids = (/** @type {any[]} */ pedacos) => [...new Set(pedacos.flatMap((p) => (typeof p === 'string' ? [] : 'claim' in p ? [p.claim] : 'data' in p ? [p.data.id] : 'nome' in p ? [p.nome.id] : 'verbatim' in p ? [`verbatim:${p.verbatim}`] : [])))];
const out = {};
for (const lang of /** @type {const} */ (['pt', 'en'])) {
  const e = explicacaoResolvida('dinheiro-do-estado-2027', lang);
  const blocos = [{ onde: 'titulo', texto: e.tituloTexto, linhas: ids(e.titulo) }];
  for (const p of e.abertura) blocos.push({ onde: p.caminho, texto: textoDosPedacosDaExplicacao(p.pedacos, lang), linhas: ids(p.pedacos) });
  for (const s of e.seccoes) {
    blocos.push({ onde: `secao:${s.id}`, texto: s.titulo, linhas: ids(s.tituloPedacos) });
    for (const b of s.blocos) if (b.tipo === 'paragrafo') blocos.push({ onde: b.caminho, texto: textoDosPedacosDaExplicacao(b.pedacos, lang), linhas: ids(b.pedacos) });
  }
  for (const p of e.naoDiz) blocos.push({ onde: p.caminho, texto: textoDosPedacosDaExplicacao(p.pedacos, lang), linhas: ids(p.pedacos) });
  for (const p of e.portas) blocos.push({ onde: `porta:${p.rota}`, texto: `${p.texto} → ${p.href}`, linhas: [] });
  /** @type {any} */ (out)[lang] = { blocos, sinais: e.sinais };
}
const j = process.argv.indexOf('--json');
if (j > 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(out, null, 2) + '\n');
for (const lang of ['pt', 'en']) for (const b of /** @type {any} */ (out)[lang].blocos) console.log(`[${lang}] ${b.onde}: ${b.texto}`);
