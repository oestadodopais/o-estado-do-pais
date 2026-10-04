/** RP3: «nenhuma página do leitor além dos recibos novos muda» (o §1 do brief), medido.
 *
 * Compara duas construções do sítio, a da base do ramo e a da cabeça do código, ficheiro a ficheiro, e escreve
 * `paginas-rp3.json` ao lado: as páginas novas (têm de ser os recibos das séries no tempo, nas duas edições), as que
 * saíram (nenhuma), e, das comuns, as iguais byte a byte, as iguais depois de tirar o que é da construção e não da
 * página (os nomes com resumo dos ficheiros de `/_astro/` e o carimbo da construção em `version.json`), e as que
 * mudaram, cada uma com a primeira diferença. Os ficheiros que não são HTML contam-se à parte. Nenhum caminho da
 * máquina entra no ficheiro: os caminhos são relativos à raiz de cada construção.
 *
 * AS DUAS CONSTRUÇÕES FAZEM-SE DA MESMA MANEIRA, para que a comparação só veja o que o bloco mudou: cada uma é o
 * `astro build` de uma exportação do commit (`git archive <commit>`, sem `.git`, com as mesmas dependências), e por
 * isso nenhuma delas tem o carimbo da versão; os dois commits passam-se como argumentos e escrevem-se no ficheiro.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/rp3-2026-10-04/paginas-rp3.mjs <dist da base> <commit da base> <dist da cabeça> <commit da cabeça>
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'js-yaml';

const [baseArg, commitDaBase, cabecaArg, commitDaCabeca] = process.argv.slice(2);
if (!baseArg || !commitDaBase || !cabecaArg || !commitDaCabeca) throw new Error('uso: paginas-rp3.mjs <dist da base> <commit da base> <dist da cabeça> <commit da cabeça>');
const base = path.resolve(baseArg);
const cabeca = path.resolve(cabecaArg);
const PASTA = 'design/especime-v3/medicoes/rp3-2026-10-04';
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
/* O que é da construção e não da página: os nomes com resumo dos ficheiros de /_astro/. */
const semConstrucao = (t) => t.replace(/\/_astro\/[A-Za-z0-9_.-]+?\.[A-Za-z0-9_-]{8}\.(css|js|woff2|svg|png|webp)/g, '/_astro/<ficheiro>.$1');
const primeiraDiferenca = (a, b) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return { posicao: i, base: a.slice(Math.max(0, i - 80), i + 120), cabeca: b.slice(Math.max(0, i - 80), i + 120) };
};

/* PORQUE MUDOU, ficheiro a ficheiro. Uma página que muda só na folha de estilo embutida (`<style>`), e um ficheiro de
   dados do livro-razão que muda só pelo campo `serie` (a chave num JSON, a coluna num CSV), dizem-se à parte; tudo o
   resto lista-se com a primeira diferença. */
const semEstilo = (t) => t.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '<style></style>');
const semSerie = (v) => {
  if (Array.isArray(v)) return v.map(semSerie);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'serie').map(([k, x]) => [k, semSerie(x)]));
  return v;
};
const linhasCsv = (t) => {
  /* Um leitor de CSV pequeno, com aspas: o bastante para tirar uma coluna e comparar o resto. */
  const linhas = [];
  let campo = '', linha = [], aspas = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (aspas) {
      if (c === '"' && t[i + 1] === '"') { campo += '"'; i++; } else if (c === '"') aspas = false; else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ',') { linha.push(campo); campo = ''; }
    else if (c === '\n') { linha.push(campo); linhas.push(linha); linha = []; campo = ''; }
    else if (c !== '\r') campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas;
};
const csvSemSerie = (t) => {
  const l = linhasCsv(t);
  const i = l[0]?.indexOf('serie') ?? -1;
  return { tinha: i >= 0, linhas: i >= 0 ? l.map((r) => r.filter((_, j) => j !== i)) : l };
};
/* O mapa do sítio: as entradas `<url>` de cada lado; muda só pelos endereços dos recibos novos quando a cabeça tem
   as entradas da base e mais as dos recibos, e nenhuma outra. */
const entradasDoMapa = (t) => t.match(/<url>[\s\S]*?<\/url>/g) ?? [];
const RECIBO_NOVO = /<loc>[^<]*\/(livro-razao|en\/ledger)\/series\/serie-[^<]*<\/loc>/;
const porque = (f, a, b) => {
  if (f.endsWith('.html')) return semEstilo(a) === semEstilo(b) ? 'só a folha de estilo embutida' : null;
  if (f.endsWith('.xml')) {
    const ea = entradasDoMapa(a), eb = entradasDoMapa(b);
    const sa = new Set(ea);
    const novas = eb.filter((e) => !sa.has(e));
    const semNovas = b.replace(/<url>[\s\S]*?<\/url>/g, (e) => (sa.has(e) ? e : ''));
    return ea.every((e) => eb.includes(e)) && novas.length > 0 && novas.every((e) => RECIBO_NOVO.test(e)) && semNovas === a
      ? `só os endereços dos recibos novos (${novas.length})` : null;
  }
  if (f.endsWith('.json')) {
    try { return JSON.stringify(semSerie(JSON.parse(a))) === JSON.stringify(semSerie(JSON.parse(b))) ? 'só o campo serie' : null; } catch { return null; }
  }
  if (f.endsWith('.csv')) {
    const x = csvSemSerie(a), y = csvSemSerie(b);
    return !x.tinha && y.tinha && JSON.stringify(x.linhas) === JSON.stringify(y.linhas) ? 'só a coluna serie' : null;
  }
  return null;
};

const A = lista(base);
const B = lista(cabeca);
const ids = fs.readdirSync('ledger/series').filter((f) => f.endsWith('.yml'))
  .map((f) => load(fs.readFileSync(path.join('ledger/series', f), 'utf8')))
  .filter((s) => s.eixo === 'periodo').map((s) => s.id).sort();
const esperadas = new Set(ids.flatMap((id) => [`livro-razao/series/${id}/index.html`, `en/ledger/series/${id}/index.html`]));
const novas = [...B].filter((f) => !A.has(f)).sort();
const sairam = [...A].filter((f) => !B.has(f)).sort();
const novasHtml = novas.filter((f) => f.endsWith('.html'));
const comuns = [...A].filter((f) => B.has(f)).sort();
const resultado = { iguais_byte_a_byte: 0, iguais_sem_a_construcao: 0, mudaram: [] };
const outros = { iguais: 0, mudaram: [] };
for (const f of comuns) {
  const a = fs.readFileSync(path.join(base, f));
  const b = fs.readFileSync(path.join(cabeca, f));
  if (!f.endsWith('.html')) {
    if (sha(a) === sha(b)) outros.iguais++;
    else outros.mudaram.push({ ficheiro: f, bytes_base: a.length, bytes_cabeca: b.length, porque: porque(f, a.toString('utf8'), b.toString('utf8')) });
    continue;
  }
  if (sha(a) === sha(b)) { resultado.iguais_byte_a_byte++; continue; }
  const ta = semConstrucao(a.toString('utf8'));
  const tb = semConstrucao(b.toString('utf8'));
  if (ta === tb) { resultado.iguais_sem_a_construcao++; continue; }
  resultado.mudaram.push({ pagina: f, porque: porque(f, ta, tb), ...primeiraDiferenca(ta, tb) });
}
const saida = {
  bloco: 'RP3',
  construcao_da_base: commitDaBase,
  construcao_da_cabeca: commitDaCabeca,
  como: 'astro build de uma exportação de cada commit (git archive), com as mesmas dependências',
  ficheiros_na_base: A.size,
  ficheiros_na_cabeca: B.size,
  paginas_html_na_base: [...A].filter((f) => f.endsWith('.html')).length,
  paginas_html_na_cabeca: [...B].filter((f) => f.endsWith('.html')).length,
  series_no_tempo: ids.length,
  paginas_novas: novasHtml.length,
  paginas_novas_sao_os_recibos: novasHtml.length === esperadas.size && novasHtml.every((f) => esperadas.has(f)),
  paginas_novas_fora_dos_recibos: novasHtml.filter((f) => !esperadas.has(f)),
  outros_ficheiros_novos: novas.filter((f) => !f.endsWith('.html')),
  paginas_que_sairam: sairam.filter((f) => f.endsWith('.html')),
  outros_ficheiros_que_sairam: sairam.filter((f) => !f.endsWith('.html')),
  paginas_comuns: comuns.filter((f) => f.endsWith('.html')).length,
  paginas_iguais_byte_a_byte: resultado.iguais_byte_a_byte,
  paginas_iguais_sem_a_construcao: resultado.iguais_sem_a_construcao,
  paginas_que_mudaram: resultado.mudaram.length,
  paginas_que_mudaram_por_razao: Object.fromEntries(Object.entries(resultado.mudaram.reduce((m, x) => ({ ...m, [x.porque ?? 'outra']: (m[x.porque ?? 'outra'] ?? 0) + 1 }), {}))),
  paginas_que_mudaram_lista: resultado.mudaram.map((x) => x.pagina),
  amostra_das_que_mudaram: resultado.mudaram.filter((x) => !x.porque).slice(0, 40),
  outros_ficheiros_comuns_iguais: outros.iguais,
  outros_ficheiros_que_mudaram_por_razao: Object.fromEntries(Object.entries(outros.mudaram.reduce((m, x) => ({ ...m, [x.porque ?? 'outra']: (m[x.porque ?? 'outra'] ?? 0) + 1 }), {}))),
  outros_ficheiros_que_mudaram_por_outra_razao: outros.mudaram.filter((x) => !x.porque),
  outros_ficheiros_que_mudaram: outros.mudaram.length,
};
fs.writeFileSync(path.join(PASTA, 'paginas-rp3.json'), JSON.stringify(saida, null, 2) + '\n');
console.log(`RP3 páginas: ${saida.paginas_novas} novas (os recibos: ${saida.paginas_novas_sao_os_recibos}), ${saida.paginas_que_sairam.length} saíram, ` +
  `${saida.paginas_comuns} comuns: ${saida.paginas_iguais_byte_a_byte} iguais byte a byte, ${saida.paginas_iguais_sem_a_construcao} iguais sem a construção, ` +
  `${saida.paginas_que_mudaram} mudaram (${JSON.stringify(saida.paginas_que_mudaram_por_razao)}); outros ficheiros: ${outros.iguais} iguais, ` +
  `${outros.mudaram.length} mudaram (${JSON.stringify(saida.outros_ficheiros_que_mudaram_por_razao)})`);
