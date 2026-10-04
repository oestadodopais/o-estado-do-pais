/** R2-b (04.10.2026): as portas das origens das definições, numa construção. Para cada invólucro de uma definição (o pai
 * dos blocos `[data-def-origem]`), conta as origens, as portas (`a.def-origem-doc`) e os endereços com mais de uma porta.
 * Corre sobre `dist/` ou sobre outra construção (`OEDP_DIST`), e escreve o ficheiro que o argumento diz. O conhecido-
 * positivo: o recibo da disparidade salarial tem duas origens no mesmo endereço, e o detetor tem de as ver como duas
 * origens e um endereço.
 *
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/r2-2026-10-03/portas-das-origens-r2b.mjs <saída.json>
 *   OEDP_DIST=<outra>/dist node design/especime-v3/medicoes/r2-2026-10-03/portas-das-origens-r2b.mjs <saída.json>
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const DIST = path.resolve(process.env.OEDP_DIST ?? 'dist');
const saida = process.argv[2];
if (!saida) throw new Error('falta o ficheiro de saída');
let involucros = 0;
let origens = 0;
let portas = 0;
let comPortaRepetida = 0;
const exemplos = [];
let disparidade = null;
(function anda(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) anda(p);
    else if (e.name === 'index.html') {
      const html = fs.readFileSync(p, 'utf8');
      if (!html.includes('data-def-origem')) continue;
      const root = parse(html);
      const vistos = new Set();
      for (const bloco of root.querySelectorAll('[data-def-origem]')) {
        const inv = bloco.parentNode;
        if (vistos.has(inv)) continue;
        vistos.add(inv);
        involucros++;
        const blocos = inv.querySelectorAll('[data-def-origem]');
        origens += blocos.length;
        const hrefs = inv.querySelectorAll('[data-def-origem] a.def-origem-doc').map((a) => a.getAttribute('href') ?? '');
        portas += hrefs.length;
        const repetidos = [...new Set(hrefs.filter((h, i) => hrefs.indexOf(h) !== i))];
        if (repetidos.length) {
          comPortaRepetida++;
          if (exemplos.length < 12) exemplos.push(`${path.relative(DIST, path.dirname(p)) || '/'} · ${repetidos.length} endereço(s) com mais de uma porta`);
        }
        const rel = path.relative(DIST, path.dirname(p));
        if (rel === path.join('livro-razao', 'disparidade-salarial-entre-sexos-2024') && inv.querySelector('[data-def-origem="eurostat-earn-grgpg2-cobertura"]')) {
          disparidade = { origens: blocos.length, portas: hrefs.length, enderecos: new Set(hrefs).size };
        }
      }
    }
  }
})(DIST);
const out = {
  o_que: 'As portas das origens das definições numa construção: os invólucros, as origens, as portas e os invólucros com um endereço com mais de uma porta.',
  construcao: (() => { try { return JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8')).commit ?? null; } catch { return null; } })(),
  involucros,
  origens,
  portas,
  involucros_com_porta_repetida: comPortaRepetida,
  exemplos,
  disparidade_no_recibo_portugues: disparidade,
  conhecido_positivo: { o_que: 'o recibo da disparidade salarial tem duas origens no mesmo endereço', encontrado: Boolean(disparidade && disparidade.origens === 2) },
};
fs.writeFileSync(saida, JSON.stringify(out, null, 2) + '\n');
console.log(`portas das origens: ${involucros} invólucros, ${origens} origens, ${portas} portas, ${comPortaRepetida} com um endereço repetido; a disparidade: ${JSON.stringify(disparidade)}.`);
process.exitCode = out.conhecido_positivo.encontrado ? 0 : 1;
