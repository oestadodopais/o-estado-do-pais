/** R3: quantas ligações internas das páginas construídas só resolvem pela regra permissiva do portão de HTML
 * (`existeConstruido()` aceita `/x` quando existe `x.html`), e não pela regra da Vercel (um caminho sem extensão é a
 * pasta com o seu `index.html`; medido no ar a 04.10.2026, `sondagem-vercel.json`). Lê `dist/` e mais nada, e escreve
 * `ligacoes-pela-regra-da-vercel.json` nesta pasta. O conhecido-positivo: uma ligação plantada em memória para
 * `/404`, que só existe como `404.html`, tem de cair na conta das que só a regra permissiva aceita.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r3-2026-10-04/ligacoes-pela-regra-da-vercel.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const PASTA = 'design/especime-v3/medicoes/r3-2026-10-04';
const construidos = new Set();
const anda = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) anda(f);
    else construidos.add('/' + path.relative(DIST, f).split(path.sep).join('/'));
  }
};
anda(DIST);
const pelaVercel = (c) => {
  const limpo = c.replace(/\/+$/, '');
  if (/\.[a-z0-9]+$/i.test(limpo)) return construidos.has(limpo);
  return construidos.has(`${limpo}/index.html`) || (limpo === '' && construidos.has('/index.html'));
};
const peloPortao = (c) => {
  if (construidos.has(c)) return true;
  const limpo = c.replace(/\/$/, '');
  return construidos.has(`${limpo}.html`) || construidos.has(`${limpo}/index.html`) || (limpo === '' && construidos.has('/index.html'));
};
const desfaz = (s) => s.replace(/&amp;/g, '&');
let paginas = 0, ligacoes = 0;
const soPeloPortao = new Map();
const nenhuma = new Map();
const conta = (c, onde) => {
  ligacoes++;
  if (pelaVercel(c)) return;
  const alvo = peloPortao(c) ? soPeloPortao : nenhuma;
  if (!alvo.has(c)) alvo.set(c, []);
  if (alvo.get(c).length < 3) alvo.get(c).push(onde);
};
for (const rel of construidos) {
  if (!rel.endsWith('.html')) continue;
  paginas++;
  const cru = fs.readFileSync(path.join(DIST, rel), 'utf8');
  for (const m of cru.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = desfaz(m[1]);
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const c = decodeURIComponent(href.split('#')[0].split('?')[0]);
    if (c === '') continue;
    conta(c, rel);
  }
}
/* O conhecido-positivo, em memória, pelo mesmo detetor. */
const antes = soPeloPortao.size;
conta('/404', 'planta em memória');
const positivo = soPeloPortao.has('/404');
soPeloPortao.delete('/404');
ligacoes--;
const saida = {
  o_que: 'as ligações internas (<a href="/...">) das páginas construídas, resolvidas pela regra da Vercel e pela regra do existeConstruido() do portão de HTML',
  paginas_lidas: paginas,
  ligacoes_lidas: ligacoes,
  destinos_que_so_a_regra_do_portao_aceita: soPeloPortao.size,
  exemplos_so_pelo_portao: [...soPeloPortao].slice(0, 10).map(([c, onde]) => ({ destino: c, em: onde })),
  destinos_que_nenhuma_regra_aceita: nenhuma.size,
  exemplos_nenhuma: [...nenhuma].slice(0, 10).map(([c, onde]) => ({ destino: c, em: onde })),
  conhecido_positivo: { o_que: 'uma ligação para /404, que só existe como 404.html, cai na conta das que só a regra do portão aceita', encontrado: positivo && antes === soPeloPortao.size },
};
fs.writeFileSync(path.join(PASTA, 'ligacoes-pela-regra-da-vercel.json'), JSON.stringify(saida, null, 2) + '\n');
console.log(JSON.stringify({ ...saida, exemplos_so_pelo_portao: saida.exemplos_so_pelo_portao.slice(0, 3), exemplos_nenhuma: saida.exemplos_nenhuma.slice(0, 3) }, null, 1));
process.exitCode = positivo ? 0 : 2;
