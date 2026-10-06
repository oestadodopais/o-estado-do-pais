/**
 * EX1-c: o texto rendido das páginas que a passagem mudou, lido da construção, para o relatório citar as frases com os
 * números que elas têm (cada número do relatório num ficheiro desta pasta): os parágrafos da explicação nas duas edições,
 * sem os selos, e a primeira frase da leitura da semana com as entradas das mudanças só da forma de escrever.
 * Uso (na raiz, depois do build): node design/especime-v3/medicoes/ex1-2026-10-05/frases-rendidas.mjs <saída.json>
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const DIST = path.resolve('dist');
const saida = process.argv[2];
const versao = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));
const normal = (/** @type {string} */ s) => s.replace(/[\s  ]+/g, ' ').trim();
/** @param {any} el */
const semSelos = (el) => { const c = parse(el.outerHTML); c.querySelectorAll('.src-chip, .claim-provisorio-chip').forEach((n) => n.remove()); return normal(c.textContent); };
const out = { o_que_e: 'EX1-c: o texto rendido das páginas que a passagem mudou, lido da construção (frases-rendidas.mjs).', construcao: versao.commit, construido_em: versao.construido_em, explicacao: {}, semana: {} };
for (const [lang, f] of [['pt', 'explicacoes/dinheiro-do-estado-2026/index.html'], ['en', 'en/explainers/dinheiro-do-estado-2026/index.html']]) {
  const r = parse(fs.readFileSync(path.join(DIST, f), 'utf8'));
  out.explicacao[lang] = {
    paragrafos: Object.fromEntries(r.querySelectorAll('[data-explicacao-paragrafo]').map((p) => [p.getAttribute('data-explicacao-paragrafo'), semSelos(p)])),
    portas_do_fim: r.querySelectorAll('[data-explicacao-portas] a').map((a) => [a.getAttribute('href'), normal(a.textContent)]),
  };
}
for (const [lang, f] of [['pt', 'explicacoes/leitura-da-semana/index.html'], ['en', 'en/explainers/weekly-reading/index.html']]) {
  const r = parse(fs.readFileSync(path.join(DIST, f), 'utf8'));
  out.semana[lang] = {
    primeira_frase: normal(r.querySelector('main [data-semana-frase]')?.textContent ?? ''),
    mudancas_de_valor: r.querySelectorAll('main [data-semana-mudanca]').length,
    formas: r.querySelectorAll('main [data-semana-forma]').map((li) => semSelos(li)),
  };
}
fs.writeFileSync(saida, JSON.stringify(out, null, 2) + '\n');
console.log(`frases rendidas da construção ${versao.commit.slice(0, 8)}: ${Object.keys(out.explicacao.pt.paragrafos).length} parágrafos por edição, ${out.semana.pt.formas.length} mudança(s) só da forma na página da semana`);
