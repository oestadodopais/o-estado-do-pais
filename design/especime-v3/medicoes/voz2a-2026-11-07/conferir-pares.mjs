// VOZ-2A, adenda H (08.11.2026): as duas línguas mudam juntas. Para cada estudo da lista com as duas edições e uma edição anterior guardada,
// os blocos de texto do documento que mudaram ou saíram entre a edição guardada e a atual, numa língua, têm um par que mudou na outra
// (o mesmo lugar na ordem dos blocos, com uma folga de três). Um bloco mudado sem par é uma frase que uma edição diz e a outra não.
// E nenhuma mudança fora da lista: cada bloco que muda contém a frase antiga de uma entrada da lista nessa língua (uma composição
// que importa uma frase de outro estudo não muda o que a lista não manda mudar).
// Executar da raiz, depois do build: node design/especime-v3/medicoes/voz2a-2026-11-07/conferir-pares.mjs <dist> <lista.json> <data da edição>
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'node-html-parser';
const pasta = path.dirname(fileURLToPath(import.meta.url));
const dist = process.argv[2] ?? 'dist';
const EDICAO = process.argv[4];
if (!/^\d{4}-\d{2}-\d{2}$/.test(EDICAO ?? '') || !process.argv[3]) throw new Error('uso: conferir-pares.mjs <dist> <lista.json> <data da edição>');
const lista = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const tags = 'p,li,h1,h2,h3,h4,h5,h6,figcaption,dd,dt,td,th,summary,blockquote';
const blocos = f => {
  const root = parse(fs.readFileSync(f, 'utf8'));
  root.querySelectorAll('script,style').forEach(n => n.remove());
  const corpo = root.querySelector('[data-oedp-moldura]') ?? root.querySelector('main') ?? root;
  return corpo.querySelectorAll(tags).filter(n => !n.querySelector(tags)).map(n => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
};
// os índices dos blocos da edição anterior que não ficam iguais na atual (com repetições contadas)
const mudados = (antes, agora) => {
  const resto = new Map();
  for (const b of agora) resto.set(b, (resto.get(b) ?? 0) + 1);
  const fora = [];
  antes.forEach((b, i) => { const n = resto.get(b) ?? 0; if (n) resto.set(b, n - 1); else fora.push(i); });
  return fora;
};
const emparelhar = (p, e, pa, ea, sem, rotulo) => {
  const usados = new Set();
  for (const i of p) { const j = e.find(j => !usados.has(j) && Math.abs(j - i) <= 3); if (j === undefined) sem.push(['pt' + rotulo, i, pa[i]]); else usados.add(j); }
  for (const j of e) if (!usados.has(j)) sem.push(['en' + rotulo, j, ea[j]]);
  return usados;
};
export function conferirEstudo(pa, pn, ea, en) {
  const p = mudados(pa, pn), e = mudados(ea, en), sem = [];
  const usados = emparelhar(p, e, pa, ea, sem, '');
  sem.pares = new Set([...p.filter(i => !sem.some(([l, k]) => l === 'pt' && k === i)).map(i => 'pt' + i), ...[...usados].map(j => 'en' + j)]);
  // e o lado novo: um bloco que só existe na edição nova de uma língua (uma frase acrescentada) tem par na outra
  emparelhar(mudados(pn, pa), mudados(en, ea), pn, en, sem, ' (bloco novo)');
  return sem;
}
const antigas = {pt: [], en: []};
for (const f of lista) if (f.classe !== 'FICA') antigas[f.lingua].push(f.frase.replace(/\s+/g, ' ').trim());
// um bloco explica-se se contiver a frase antiga de uma entrada (as entradas cortadas aos dois pontos contam pelo seu texto)
const explicado = (l, t) => antigas[l].some(a => t.includes(a)) || /\bResearch\s*Hub\b/.test(t);
// As composições importam frases de outros estudos da lista: no estudo da economia (a composição 18 do motor), uma mudança
// que tem par na outra língua é a frase reescrita no estudo de origem; uma mudança sem par nunca se explica assim.
const COMPOSICOES = new Set(['evora-economia-e-dinheiro-publico-de-fora-da-camara']);
let total = 0, estudos = 0, fora = 0;
for (const slug of [...new Set(lista.map(f => f.estudo))]) {
  const dp = path.join(dist, 'estudos', slug, 'documento'), de = path.join(dist, 'en', 'studies', slug, 'document');
  if (!fs.existsSync(de)) continue;
  // a edição anterior à da VOZ-2A, contra a edição da VOZ-2A (guardada, se já houver outra depois dela; senão, a atual)
  const datas = fs.readdirSync(dp).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d) && d < EDICAO && fs.existsSync(path.join(de, d))).sort();
  if (!datas.length) continue;
  const d = datas.at(-1); estudos++;
  const vp = fs.existsSync(path.join(dp, EDICAO)) ? path.join(dp, EDICAO) : dp, ve = fs.existsSync(path.join(de, EDICAO)) ? path.join(de, EDICAO) : de;
  const [pa, pn, ea, en] = [path.join(dp, d), vp, path.join(de, d), ve].map(x => blocos(path.join(x, 'index.html')));
  const sem = conferirEstudo(pa, pn, ea, en);
  for (const [l, i, t] of sem) console.log(`${slug} (desde ${d}): o bloco ${i} muda só em ${l}: ${t.slice(0, 140)}`);
  total += sem.length;
  for (const [l, antes, agora] of [['pt', pa, pn], ['en', ea, en]]) for (const i of mudados(antes, agora)) if (!explicado(l, antes[i]) && !(COMPOSICOES.has(slug) && sem.pares.has(l + i))) {
    fora++; console.log(`${slug} (desde ${d}): o bloco ${i} em ${l} muda sem entrada na lista: ${antes[i].slice(0, 140)}`);
  }
}
export const codigo = (sem, fora, planta, controlo, estudos) => (sem || fora || planta !== 2 || controlo !== 0 || !estudos ? 1 : 0);
// As plantas do ramo das mudanças fora da lista, do bloco novo e do código: cada uma tem de morder.
const plantasFora = [!explicado('pt', 'Uma frase que nenhuma entrada nomeia.'), explicado(lista.find(f => f.classe !== 'FICA').lingua, lista.find(f => f.classe !== 'FICA').frase),
  conferirEstudo(['a', 'b'], ['a', 'b', 'Isto é novo.'], ['a', 'b'], ['a', 'b']).length === 1,
  codigo(0, 1, 2, 0, 1) === 1, codigo(1, 0, 2, 0, 1) === 1, codigo(0, 0, 2, 0, 1) === 0];
// A planta: um par em que só o português muda tem de dar dois blocos sem par (o antigo e o novo); o mesmo par a mudar nas duas línguas, nenhum.
const planta = conferirEstudo(['a', 'Isto entra neste documento.', 'c'], ['a', 'Isto entra.', 'c'], ['a', 'This enters this document.', 'c'], ['a', 'This enters this document.', 'c']).length;
const controlo = conferirEstudo(['a', 'Isto entra neste documento.', 'c'], ['a', 'Isto entra.', 'c'], ['a', 'This enters this document.', 'c'], ['a', 'This enters.', 'c']).length;
console.log(`estudos com as duas línguas: ${estudos}; blocos mudados sem par: ${total}; blocos mudados sem entrada na lista: ${fora}; planta ${planta} (tem de ser 2: o bloco antigo e o novo), controlo ${controlo} (tem de ser 0)`);
const mordem = plantasFora.filter(Boolean).length;
console.log(`plantas do ramo fora da lista, do bloco novo e do código: ${mordem} de ${plantasFora.length}`);
process.exitCode = codigo(total, fora, planta, controlo, estudos) || (mordem !== plantasFora.length ? 1 : 0);
