/** PP1: o resolvedor do construtor contra a testemunha do lugar de direção (M31).
 *
 * Corre o ensaio a seco do lugar de direção (`design/observatorio/leituras/ensaio-blocos-primeira-pagina.mjs`)
 * sobre as declarações DELE, e rende o mesmo formato pelo resolvedor do sítio
 * (`src/lib/primeira-pagina.mjs`) sobre a cópia (`src/data/primeira-pagina.mjs`). Compara linha a
 * linha, com os espaços normalizados. As diferenças esperadas são declaradas abaixo, cada uma com a
 * razão; qualquer outra fecha com código 1.
 *
 * Uso: node design/especime-v3/medicoes/pp1-2026-09-28/ensaio-contra-resolvedor.mjs [--json saída]
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const { BLOCOS_DA_PRIMEIRA_PAGINA: B } = await import(path.join(RAIZ, 'src/data/primeira-pagina.mjs'));
const { blocoResolvido, textoDosPedacos } = await import(path.join(RAIZ, 'src/lib/primeira-pagina.mjs'));
const { ACERTOS_DAS_PALAVRAS } = await import(path.join(RAIZ, 'src/data/primeira-pagina.mjs'));

/* AS DIFERENÇAS ESPERADAS, e só estas.
   D1 · a palavra «provisório» do salário de 2026. A linha `remuneracao-bruta-mensal-media` traz a
   bandeira `&` com a nota «Dado provisório», que o `<Claim>` do sítio escreve por palavras («dado
   provisório», «provisional data») desde o RP1b (a I153); o ensaio do lugar de direção só reconhece a bandeira `p`. */
const ESPERADAS = [
  { de: '1 835 euros por mês no', para: '1 835 euros por mês (dado provisório) no', razao: 'D1' },
  { de: '1 835 euros a month in the', para: '1 835 euros a month (provisional data) in the', razao: 'D1' },
  /* D2 · os acertos das palavras declarados na cópia (`ACERTOS_DAS_PALAVRAS`), cada um com o literal;
     os das entradas não passam pelo ensaio, que só rende os blocos. */
  ...ACERTOS_DAS_PALAVRAS.filter((a) => !a.onde.startsWith('entrada')).map((a) => ({ de: a.de.trim(), para: a.para.trim(), razao: a.id })),
];

const normal = (s) => s.replace(/[\s   ]+/g, ' ').trim();
const r = spawnSync(process.execPath, [path.join(RAIZ, 'design/observatorio/leituras/ensaio-blocos-primeira-pagina.mjs'), RAIZ], { encoding: 'utf8' });
if (r.status !== 0) { console.error(r.stdout + r.stderr); process.exit(1); }
const testemunha = r.stdout.split('\n').filter((l) => /^ \[(pt|en)\] |^       /.test(l)).map(normal);

const nosso = [];
for (const b of B) {
  for (const lang of ['pt', 'en']) {
    const x = blocoResolvido(b.id, lang);
    nosso.push(`[${lang}] ${textoDosPedacos(x.titulo, lang)}`);
    nosso.push(textoDosPedacos(x.frase, lang));
    if (x.desenho?.legenda) nosso.push(`legenda: ${textoDosPedacos(x.desenho.legenda, lang)}`);
    for (const p of x.pecas) {
      const t = p.titulo ? ` «${textoDosPedacos(p.titulo, lang)}»` : '';
      nosso.push(`peça ${p.id}${p.mostra ? '' : ' (SAI)'}${t}: ${textoDosPedacos(p.pedacos, lang)}`);
    }
    nosso.push(`ressalva: ${textoDosPedacos(x.ressalva, lang)}`);
  }
}
const nossoN = nosso.map(normal);
const diferencas = [];
const usadas = new Set();
const n = Math.max(testemunha.length, nossoN.length);
for (let i = 0; i < n; i++) {
  const a = testemunha[i] ?? '(nada)';
  const b = nossoN[i] ?? '(nada)';
  if (a === b) continue;
  const e = ESPERADAS.findIndex((x) => a.includes(x.de) && b === a.replace(x.de, x.para));
  if (e >= 0) { usadas.add(e); continue; }
  diferencas.push({ linha: i + 1, testemunha: a, resolvedor: b });
}
const porUsar = ESPERADAS.filter((_, i) => !usadas.has(i));
const saida = {
  testemunha: 'design/observatorio/leituras/ensaio-blocos-primeira-pagina.mjs',
  resolvedor: 'src/lib/primeira-pagina.mjs',
  linhas_comparadas: n,
  iguais: n - diferencas.length - usadas.size,
  diferencas_esperadas_vistas: usadas.size,
  diferencas_esperadas: ESPERADAS,
  diferencas_por_explicar: diferencas,
  esperadas_por_ver: porUsar,
};
const j = process.argv.indexOf('--json');
if (j !== -1) fs.writeFileSync(process.argv[j + 1], JSON.stringify(saida, null, 2) + '\n');
console.log(`${n} linhas comparadas: ${saida.iguais} iguais, ${usadas.size} diferenças esperadas vistas, ${diferencas.length} por explicar, ${porUsar.length} esperadas por ver.`);
for (const d of diferencas) console.log(`  linha ${d.linha}\n    testemunha: ${d.testemunha}\n    resolvedor: ${d.resolvedor}`);
process.exit(diferencas.length || porUsar.length ? 1 : 0);
