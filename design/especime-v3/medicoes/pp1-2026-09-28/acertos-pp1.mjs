#!/usr/bin/env node
/**
 * PP1 · OS ACERTOS DA CÓPIA DAS DECLARAÇÕES, PROVADOS (28.09.2026).
 *
 * `src/data/primeira-pagina.mjs` é a cópia das declarações do lugar de direção
 * (`design/observatorio/leituras/BLOCOS-primeira-pagina-2026-09-28.mjs`), «salvo os acertos que a
 * auditoria exigir, cada um com o literal». Este guião compara as duas, campo a campo e pedaço a
 * pedaço: o texto de cada campo, com cada pedaço calculado escrito pela sua chave (a linha do valor e o
 * sufixo, o período, a data, o limiar, o ramo com os seus três textos) e os algarismos das palavras
 * fixas lidos como texto, tem de ser o mesmo nas duas, salvo um acerto de `ACERTOS_DAS_PALAVRAS`
 * (a cadeia «de» trocada pela «para»); e as únicas chaves que a cópia pode ter a mais são as de forma
 * do cabeçalho dela (a régua, o sufixo do desenho, o motivo de um algarismo). Cada acerto tem de ser
 * usado, e cada diferença tem de ser um acerto.
 *
 * Uso: node design/especime-v3/medicoes/pp1-2026-09-28/acertos-pp1.mjs
 * Escreve: design/especime-v3/medicoes/pp1-2026-09-28/acertos-pp1.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as copia from '../../../../src/data/primeira-pagina.mjs';
import * as direcao from '../../../observatorio/leituras/BLOCOS-primeira-pagina-2026-09-28.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const CHAVES_DE_FORMA = new Set(['regua', 'sufixo', 'motivo']);
const PEDACO = ['claim', 'periodo', 'publicado', 'referencia', 'nl', 'compara', 'nome'];
/* Um pedaço é um objeto com uma destas chaves, e o valor de `nome` num pedaço é o identificador de uma
   linha: um objeto com `nome: { pt, en }` (uma entrada, uma secção) não é um pedaço, é uma declaração. */
const ePedaco = (/** @type {any} */ x) => x && typeof x === 'object' && !Array.isArray(x) && PEDACO.some((k) => k in x && (k !== 'nome' || typeof x.nome === 'string'));
const eTexto = (/** @type {any} */ v) => typeof v === 'string' || (Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string' || ePedaco(x)));
/** O texto canónico de um campo de texto. @param {any} v @returns {string} */
function canon(v) {
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map(canon).join('');
  if ('nl' in v) return String(v.nl);
  if ('claim' in v) return `⟨valor:${v.claim}${v.sufixo ? `|${v.sufixo}` : ''}⟩`;
  if ('periodo' in v) return `⟨período:${v.periodo}${'mes' in v ? `|mês ${v.mes}` : ''}⟩`;
  if ('publicado' in v) return `⟨publicado:${v.publicado}⟩`;
  if ('referencia' in v) return `⟨limiar:${v.referencia}⟩`;
  if ('nome' in v) return `⟨nome:${v.nome}⟩`;
  if ('compara' in v) return `⟨ramo:${v.compara.join(',')}|menor:${canon(v.menor ?? '')}|maior:${canon(v.maior ?? '')}|igual:${canon(v.igual ?? '')}⟩`;
  return JSON.stringify(v);
}
/** @type {{ caminho: string, direcao: string, copia: string, acerto: string|null }[]} */
const diferencas = [];
/** @type {string[]} */
const chavesNovas = [];
/** @type {string[]} */
const chavesEmFalta = [];
const usados = new Set();
/** @param {any} a @param {any} b @param {string} onde */
function compara(a, b, onde) {
  if (eTexto(a) || eTexto(b)) {
    const ca = canon(a ?? ''), cb = canon(b ?? '');
    if (ca === cb) return;
    const acerto = copia.ACERTOS_DAS_PALAVRAS.find((x) => ca.includes(x.de) && ca.replace(x.de, x.para) === cb) ?? null;
    if (acerto) usados.add(acerto.id);
    diferencas.push({ caminho: onde, direcao: ca, copia: cb, acerto: acerto?.id ?? null });
    return;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) { diferencas.push({ caminho: onde, direcao: JSON.stringify(a), copia: JSON.stringify(b), acerto: null }); return; }
    a.forEach((x, i) => compara(x, b[i], `${onde}[${i}]`));
    return;
  }
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    for (const k of Object.keys(a)) { if (!(k in b)) chavesEmFalta.push(`${onde}.${k}`); else compara(a[k], b[k], `${onde}.${k}`); }
    for (const k of Object.keys(b)) if (!(k in a)) { if (!CHAVES_DE_FORMA.has(k)) chavesNovas.push(`${onde}.${k}`); }
    return;
  }
  if (a !== b) diferencas.push({ caminho: onde, direcao: JSON.stringify(a), copia: JSON.stringify(b), acerto: null });
}
compara(direcao.BLOCOS_DA_PRIMEIRA_PAGINA, copia.BLOCOS_DA_PRIMEIRA_PAGINA, 'BLOCOS');
compara(direcao.ENTRADAS, copia.ENTRADAS, 'ENTRADAS');
const semAcerto = diferencas.filter((d) => d.acerto === null);
const naoUsados = copia.ACERTOS_DAS_PALAVRAS.filter((x) => !usados.has(x.id)).map((x) => x.id);
const saida = {
  o_que_e: 'A cópia das declarações contra as do lugar de direção, campo a campo: as diferenças, o acerto que explica cada uma, e as chaves que a cópia tem a mais ou a menos.',
  comando: 'node design/especime-v3/medicoes/pp1-2026-09-28/acertos-pp1.mjs',
  blocos: { direcao: direcao.BLOCOS_DA_PRIMEIRA_PAGINA.length, copia: copia.BLOCOS_DA_PRIMEIRA_PAGINA.length },
  entradas: { direcao: direcao.ENTRADAS.length, copia: copia.ENTRADAS.length },
  diferencas: diferencas.length, diferencas_sem_acerto: semAcerto.length, acertos_declarados: copia.ACERTOS_DAS_PALAVRAS.length, acertos_nao_usados: naoUsados,
  chaves_novas_fora_da_forma: chavesNovas, chaves_em_falta: chavesEmFalta,
  lista: diferencas,
};
fs.writeFileSync(path.join(AQUI, 'acertos-pp1.json'), JSON.stringify(saida, null, 2) + '\n');
console.log(`acertos · ${diferencas.length} diferença(s), ${semAcerto.length} sem acerto; ${naoUsados.length} acerto(s) por usar; ${chavesNovas.length} chave(s) nova(s) fora da forma; ${chavesEmFalta.length} em falta.`);
for (const d of semAcerto) console.error(`  sem acerto · ${d.caminho}: «${d.direcao.slice(0, 120)}» → «${d.copia.slice(0, 120)}»`);
if (semAcerto.length || naoUsados.length || chavesNovas.length || chavesEmFalta.length) process.exitCode = 1;
