/** C2 (05.10.2026): o que as nove releituras mudaram no que o leitor recebe, medido página a página.
 *
 * Compara duas construções feitas da mesma maneira (o `astro build` de uma exportação de cada commit, `git archive`,
 * com as mesmas dependências e sem o carimbo da versão): a da base do ramo e a da cabeça do código. Escreve
 * `paginas-c2.json` ao lado: as páginas novas e as que saíram (nenhuma se espera), e das comuns as iguais byte a byte,
 * as iguais depois de tirar o que é da construção (os nomes com resumo dos ficheiros de `/_astro/`) e as que mudaram.
 * Cada página que mudou classifica-se por uma razão que se lê nela, e não por uma lista escrita: cita uma das nove
 * linhas (um `data-claim`, um `data-linha`, uma porta para o recibo dela ou o seu identificador num atributo), ou é
 * uma lista de mudanças (o registo das correções, o índice); o resto fica numa razão «outra», com a primeira
 * diferença, para se ler. Os outros ficheiros (os dados do livro-razão, os mapas do sítio) contam-se à parte, com a
 * mesma regra. Nenhum caminho da máquina entra no ficheiro: os caminhos são relativos à raiz de cada construção.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/c2-2026-10-05/paginas-c2.mjs <dist da base> <commit da base> <dist da cabeça> <commit da cabeça>
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const [baseArg, commitDaBase, cabecaArg, commitDaCabeca] = process.argv.slice(2);
if (!baseArg || !commitDaBase || !cabecaArg || !commitDaCabeca) throw new Error('uso: paginas-c2.mjs <dist da base> <commit da base> <dist da cabeça> <commit da cabeça>');
const base = path.resolve(baseArg);
const cabeca = path.resolve(cabecaArg);
const PASTA = 'design/especime-v3/medicoes/c2-2026-10-05';
const NOVE = [
  'custo-unitario-do-trabalho-2024', 'despesa-em-id-2024-ue', 'formacao-bruta-de-capital-fixo-2024',
  'formacao-bruta-de-capital-fixo-2025', 'pib-real-per-capita-2024', 'pib-real-per-capita-2025',
  'posicao-de-investimento-internacional-2024', 'posicao-de-investimento-internacional-2025',
  'saldo-da-balanca-corrente-2024',
];
const lista = (raiz) => {
  const out = [];
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else out.push(path.relative(raiz, p).split(path.sep).join('/'));
    }
  };
  anda(raiz);
  return new Set(out);
};
const sha = (b) => createHash('sha256').update(b).digest('hex');
const semConstrucao = (t) => t.replace(/\/_astro\/[A-Za-z0-9_.-]+?\.[A-Za-z0-9_-]{8}\.(css|js|woff2|svg|png|webp)/g, '/_astro/<ficheiro>.$1');
const primeiraDiferenca = (a, b) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return { posicao: i, base: a.slice(Math.max(0, i - 100), i + 140), cabeca: b.slice(Math.max(0, i - 100), i + 140) };
};
/* As nove linhas citadas por um atributo ou por uma porta para o recibo, numa das duas edições. */
const citaANove = (t) => NOVE.filter((id) => t.includes(`"${id}"`) || t.includes(`/livro-razao/${id}`) || t.includes(`/en/ledger/${id}`) || t.includes(`#m-${id}`));
/* A família da página, pelo caminho, para a contagem. */
const familia = (f) => {
  const p = f.replace(/^en\//, '');
  if (/^livro-razao\/[^/]+\/index\.html$/.test(p) || /^ledger\/[^/]+\/index\.html$/.test(p)) return 'recibo de uma linha';
  if (/^(livro-razao|ledger)\/index\.html$/.test(p)) return 'índice do livro-razão';
  if (/^(correcoes|corrections)\//.test(p)) return 'registo das correções';
  if (/^(indice|index)\//.test(p)) return 'índice do sítio';
  if (/^(areas)\//.test(p)) return 'área de governo';
  if (/^(uniao-europeia|european-union)\//.test(p)) return 'página da União';
  if (/^(metodo|method)\//.test(p)) return 'Método';
  if (p === 'index.html') return 'primeira página';
  return p.split('/')[0];
};
const A = lista(base);
const B = lista(cabeca);
const novas = [...B].filter((f) => !A.has(f)).sort();
const sairam = [...A].filter((f) => !B.has(f)).sort();
const comuns = [...A].filter((f) => B.has(f)).sort();
const paginas = { iguais_byte_a_byte: 0, iguais_sem_a_construcao: 0, mudaram: [] };
const outros = { iguais: 0, mudaram: [] };
for (const f of comuns) {
  const a = fs.readFileSync(path.join(base, f));
  const b = fs.readFileSync(path.join(cabeca, f));
  if (sha(a) === sha(b)) { if (f.endsWith('.html')) paginas.iguais_byte_a_byte++; else outros.iguais++; continue; }
  const ta = semConstrucao(a.toString('utf8'));
  const tb = semConstrucao(b.toString('utf8'));
  if (ta === tb) { if (f.endsWith('.html')) paginas.iguais_sem_a_construcao++; else outros.iguais++; continue; }
  const citadas = [...new Set([...citaANove(ta), ...citaANove(tb)])];
  const ehLista = /data-mudou-registo|data-mudou-ambito|lugar-mudou|indice-mudou/.test(tb);
  const razao = citadas.length ? 'cita uma das nove linhas' : ehLista ? 'lista de mudanças' : 'outra';
  const item = { ficheiro: f, familia: familia(f), razao, linhas_citadas: citadas };
  if (razao === 'outra') Object.assign(item, primeiraDiferenca(ta, tb));
  (f.endsWith('.html') ? paginas.mudaram : outros.mudaram).push(item);
}
const conta = (xs, k) => Object.fromEntries(Object.entries(xs.reduce((m, x) => ({ ...m, [x[k]]: (m[x[k]] ?? 0) + 1 }), {})).sort());
/* O conhecido-positivo: o recibo de uma das nove linhas tem de estar entre as páginas que mudaram, e com a razão certa. */
const conhecido = paginas.mudaram.find((x) => x.ficheiro === 'livro-razao/pib-real-per-capita-2025/index.html');
const saida = {
  _: 'Escrito por design/especime-v3/medicoes/c2-2026-10-05/paginas-c2.mjs. Não se edita à mão.',
  bloco: 'C2', construcao_da_base: commitDaBase, construcao_da_cabeca: commitDaCabeca,
  como: 'astro build de uma exportação de cada commit (git archive), com as mesmas dependências',
  ficheiros_na_base: A.size, ficheiros_na_cabeca: B.size,
  paginas_html_na_base: [...A].filter((f) => f.endsWith('.html')).length,
  paginas_html_na_cabeca: [...B].filter((f) => f.endsWith('.html')).length,
  paginas_novas: novas.filter((f) => f.endsWith('.html')), outros_ficheiros_novos: novas.filter((f) => !f.endsWith('.html')),
  paginas_que_sairam: sairam.filter((f) => f.endsWith('.html')), outros_ficheiros_que_sairam: sairam.filter((f) => !f.endsWith('.html')),
  paginas_comuns: comuns.filter((f) => f.endsWith('.html')).length,
  paginas_iguais_byte_a_byte: paginas.iguais_byte_a_byte,
  paginas_iguais_sem_a_construcao: paginas.iguais_sem_a_construcao,
  paginas_que_mudaram: paginas.mudaram.length,
  paginas_que_mudaram_por_razao: conta(paginas.mudaram, 'razao'),
  paginas_que_mudaram_por_familia: conta(paginas.mudaram, 'familia'),
  paginas_que_mudaram_por_outra_razao: paginas.mudaram.filter((x) => x.razao === 'outra'),
  recibos_das_nove_que_mudaram: NOVE.flatMap((id) => [`livro-razao/${id}/index.html`, `en/ledger/${id}/index.html`]).filter((f) => paginas.mudaram.some((x) => x.ficheiro === f)).length,
  outros_ficheiros_comuns_iguais: outros.iguais,
  outros_ficheiros_que_mudaram: outros.mudaram.length,
  outros_ficheiros_que_mudaram_por_razao: conta(outros.mudaram, 'razao'),
  outros_ficheiros_que_mudaram_por_outra_razao: outros.mudaram.filter((x) => x.razao === 'outra'),
  conhecido_positivo: { o_que: 'o recibo do PIB real por habitante de 2025 mudou e cita a sua linha', encontrado: Boolean(conhecido && conhecido.razao === 'cita uma das nove linhas') },
  paginas_que_mudaram_lista: paginas.mudaram.map(({ ficheiro, familia: fa, razao, linhas_citadas }) => ({ ficheiro, familia: fa, razao, linhas_citadas })),
  outros_ficheiros_que_mudaram_lista: outros.mudaram.map(({ ficheiro, razao, linhas_citadas }) => ({ ficheiro, razao, linhas_citadas })),
};
fs.writeFileSync(path.join(PASTA, 'paginas-c2.json'), JSON.stringify(saida, null, 2) + '\n');
console.log(`C2 páginas: ${saida.paginas_novas.length} novas, ${saida.paginas_que_sairam.length} saíram, ${saida.paginas_comuns} comuns: ` +
  `${saida.paginas_iguais_byte_a_byte} iguais byte a byte, ${saida.paginas_iguais_sem_a_construcao} iguais sem a construção, ` +
  `${saida.paginas_que_mudaram} mudaram ${JSON.stringify(saida.paginas_que_mudaram_por_razao)}; outros ficheiros: ` +
  `${saida.outros_ficheiros_comuns_iguais} iguais, ${saida.outros_ficheiros_que_mudaram} mudaram ${JSON.stringify(saida.outros_ficheiros_que_mudaram_por_razao)}`);
