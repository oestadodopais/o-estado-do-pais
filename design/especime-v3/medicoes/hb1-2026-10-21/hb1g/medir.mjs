/* HB1-g (22.10.2026): as medidas da passagem, escritas por guião (os pontos 5, 6, 7 e 8 do mandato).
   Uso, na raiz da worktree: node design/especime-v3/medicoes/hb1-2026-10-21/hb1g/medir.mjs <dist de antes>
   O dist/ de antes é a cópia do dist/ construído na cabeça 77c354ea1, guardada fora do repositório antes da
   construção desta passagem; o dist/ novo é o da worktree. Escreve medidas.json ao lado: cada medida com o
   nome, o valor, o comando e um conhecido-positivo. Nenhum caminho da máquina entra no ficheiro. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadClaims, paginaSoComEdicao } from '../../../../../src/lib/ledger.mjs';
import { lerPaginaComCodigo } from '../../../../../scripts/incorporar-do-portao.mjs';
import { routePath } from '../../../../../src/lib/routes.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '../../../../..');
const novo = path.join(raiz, 'dist');
const antes = process.argv[2] ? path.resolve(process.argv[2]) : '';
if (!antes || !fs.existsSync(path.join(antes, 'livro-razao'))) {
  console.error('uso: node design/especime-v3/medicoes/hb1-2026-10-21/hb1g/medir.mjs <dist de antes>');
  process.exit(2);
}
const COMANDO = 'node design/especime-v3/medicoes/hb1-2026-10-21/hb1g/medir.mjs <temporario>/dist-antes';
const EDITADAS = ['hab-eurostat-privacao-severa-definicao', 'hab-il-proposta'];
const medidas = [];
const limpo = (x) => String(x ?? '').replace(/\s+/g, ' ').trim();

function ficheiros(dir) {
  const out = [];
  const andar = (d, rel) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) andar(path.join(d, e.name), r); else out.push(r);
    }
  };
  if (fs.existsSync(dir)) andar(dir, '');
  return out;
}
function diferencas(a, b) {
  const fa = new Set(ficheiros(a)), fb = new Set(ficheiros(b)), out = [];
  for (const f of [...new Set([...fa, ...fb])].sort()) {
    if (!fb.has(f)) out.push(`${f} (só antes)`);
    else if (!fa.has(f)) out.push(`${f} (só agora)`);
    else {
      const pa = path.join(a, f), pb = path.join(b, f);
      if (fs.statSync(pa).size !== fs.statSync(pb).size || !fs.readFileSync(pa).equals(fs.readFileSync(pb))) out.push(f);
    }
  }
  return out;
}
/* O conhecido-positivo da comparação: duas pastas com um ficheiro igual, um mudado e um só de um lado. */
const ensaio = fs.mkdtempSync(path.join(os.tmpdir(), 'hb1g-'));
for (const [lado, conteudo] of [['a', 'x'], ['b', 'y']]) {
  fs.mkdirSync(path.join(ensaio, lado, 'sub'), { recursive: true });
  fs.writeFileSync(path.join(ensaio, lado, 'igual.html'), 'igual');
  fs.writeFileSync(path.join(ensaio, lado, 'sub', 'mudado.html'), conteudo);
}
fs.writeFileSync(path.join(ensaio, 'b', 'novo.json'), '{}');
const positivoDiff = diferencas(path.join(ensaio, 'a'), path.join(ensaio, 'b'));
fs.rmSync(ensaio, { recursive: true, force: true });

/* 1. O predicado (o ponto 5). */
const todas = loadClaims({ includeWithdrawn: true }), publicas = loadClaims();
const ids = (m) => [...m.values()].filter((c) => paginaSoComEdicao(c)).map((c) => c.id).sort();
const verdadeiras = ids(todas), verdadeirasPublicas = ids(publicas);
medidas.push({
  nome: 'linhas do livro em que paginaSoComEdicao é verdadeiro (todas, com as retiradas)',
  valor: verdadeiras.length, ids: verdadeiras, linhas_lidas: todas.size,
  publicas: { valor: verdadeirasPublicas.length, ids: verdadeirasPublicas, linhas_lidas: publicas.size },
  comando: COMANDO,
  conhecido_positivo: {
    descricao: 'o predicado numa linha last-edited com data (verdadeiro), com período (falso) e sem a marca (falso)',
    resultado: [paginaSoComEdicao({ published_at_kind: 'last-edited', published_at: '2026-01-01' }),
      paginaSoComEdicao({ published_at_kind: 'last-edited', published_at: '2026-01-01', period: '2026' }),
      paginaSoComEdicao({ published_at: '2026-01-01' })],
    esperado: [true, false, false],
  },
});

/* 2. O que mudou no dist/ (o ponto 5): os recibos e o dist/ inteiro. */
const recibos = [
  ...diferencas(path.join(antes, 'livro-razao'), path.join(novo, 'livro-razao')).map((f) => `livro-razao/${f}`),
  ...diferencas(path.join(antes, 'en', 'ledger'), path.join(novo, 'en', 'ledger')).map((f) => `en/ledger/${f}`),
];
medidas.push({
  nome: 'ficheiros dos recibos (livro-razao/ e en/ledger/) que mudaram do dist/ de 77c354ea1 para o dist/ novo',
  valor: recibos.length, ficheiros: recibos, comando: COMANDO,
  conhecido_positivo: { descricao: 'a mesma comparação em duas pastas de ensaio com um ficheiro igual, um mudado e um só de um lado',
    resultado: positivoDiff, esperado: ['novo.json (só agora)', 'sub/mudado.html'] },
});
const inteiro = diferencas(antes, novo);
medidas.push({ nome: 'ficheiros do dist/ inteiro que mudaram', valor: inteiro.length, ficheiros: inteiro.slice(0, 80),
  comando: COMANDO, conhecido_positivo: 'o da medida anterior (a mesma função de comparação)' });

/* 3. As frases, lidas do HTML e do JSON construídos, antes e agora (o ponto 8). */
function frases(dist, id, lang) {
  const root = lerPaginaComCodigo(fs.readFileSync(`${dist}${routePath('linha', lang, { slug: id })}/index.html`, 'utf8'));
  const doc = JSON.parse(fs.readFileSync(`${dist}/livro-razao/${id}.json`, 'utf8'));
  const codigo = lerPaginaComCodigo(root.querySelector('#codigo-incorporar')?.textContent ?? '');
  return {
    atribuicao: limpo(root.querySelector('p.linha-atribuicao')?.textContent),
    descricao: root.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    og_description: root.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '',
    excerto: limpo(codigo.querySelector('a')?.textContent),
    excerto_inteiro: limpo(codigo.querySelector('p')?.textContent),
    json_periodo: doc.incorporacao?.[lang]?.periodo ?? null,
  };
}
const tabela = {};
for (const id of EDITADAS) for (const lang of ['pt', 'en']) tabela[`${id}/${lang}`] = { antes: frases(antes, id, lang), agora: frases(novo, id, lang) };
medidas.push({ nome: 'as frases das quatro páginas, do excerto para incorporar e do JSON, antes e agora', valor: tabela, comando: COMANDO,
  conhecido_positivo: { descricao: 'a atribuição de antes da linha da IL tem «(08.06.2026)», como a leitura LEITURA-HB1-f-2026-10-22.md cita no achado 6',
    resultado: tabela['hab-il-proposta/pt'].antes.atribuicao.includes('(08.06.2026)'), esperado: true } });

/* 4. O ensaio do ponto 6, no dist/ novo e contra o dist/ de antes, que tem de fechar. */
function correr(env = {}) {
  const r = spawnSync(process.execPath, ['tests/hb1/pagina-editada.mjs'], { cwd: raiz, encoding: 'utf8', env: { ...process.env, ...env } });
  const saida = `${r.stdout}`.split('\n').filter(Boolean);
  return { codigo: r.status, plantas: saida.filter((l) => l.startsWith('PLANTA HB1-g')).length, ultima: saida.at(-1) ?? '',
    erro: (`${r.stderr}`.split('\n').find((l) => /Error/.test(l)) ?? '').replaceAll(antes, '<temporario>/dist-antes').replaceAll(raiz, '<worktree>') };
}
const agora = correr(), contraAntes = correr({ OEDP_DIST_HB1G: antes });
medidas.push({ nome: 'tests/hb1/pagina-editada.mjs no dist/ novo', valor: { codigo: agora.codigo, plantas: agora.plantas, ultima_linha: agora.ultima },
  comando: 'node tests/hb1/pagina-editada.mjs',
  conhecido_positivo: { descricao: 'o mesmo ensaio contra o dist/ de antes da HB1-g (OEDP_DIST_HB1G) tem de fechar',
    codigo: contraAntes.codigo, plantas_antes_de_fechar: contraAntes.plantas, erro: contraAntes.erro } });

/* 5. As plantas do ensaio da HB1-f (o Minor 7), lidas do ficheiro. */
const fonteHb1f = fs.readFileSync(path.join(raiz, 'tests/hb1/data-sem-publicacao.mjs'), 'utf8');
const expressao = /^\s*\['([^']+)',c=>/gm;
const nomesHb1f = [...fonteHb1f.matchAll(expressao)].map((m) => m[1]);
medidas.push({ nome: 'as plantas de tests/hb1/data-sem-publicacao.mjs', valor: nomesHb1f.length, nomes: nomesHb1f,
  controlo: fonteHb1f.includes('assert.deepEqual(errors(original),[]);'), comando: COMANDO,
  conhecido_positivo: { descricao: 'a mesma expressão numa linha de ensaio', resultado: [..."  ['planta de ensaio',c=>{}],".matchAll(expressao)].length, esperado: 1 } });

/* 5b. O que mudou nos dois ficheiros da construção fora dos recibos. */
function folhas(o, prefixo = '', out = {}) {
  if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) folhas(v, prefixo ? `${prefixo}.${k}` : k, out);
  else out[prefixo] = o;
  return out;
}
function chavesMudadas(a, b) {
  const fa = folhas(a), fb = folhas(b);
  return [...new Set([...Object.keys(fa), ...Object.keys(fb)])].filter((k) => fa[k] !== fb[k]).sort();
}
const lerJson = (dist, f) => JSON.parse(fs.readFileSync(path.join(dist, f), 'utf8'));
medidas.push({ nome: 'as chaves que mudaram em prova.json e version.json', comando: COMANDO,
  valor: Object.fromEntries(['prova.json', 'version.json'].map((f) => [f, chavesMudadas(lerJson(antes, f), lerJson(novo, f))])),
  conhecido_positivo: { descricao: 'a mesma comparação em {a:1,b:{c:2}} e {a:1,b:{c:3}}', resultado: chavesMudadas({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } }), esperado: ['b.c'] } });

/* 6. Os códigos das conferências e da construção, lidos dos ficheiros. */
const pasta = path.join(aqui, 'codigos');
const codigos = Object.fromEntries((fs.existsSync(pasta) ? fs.readdirSync(pasta) : []).filter((f) => f.endsWith('.code')).sort()
  .map((f) => [f.replace(/\.code$/, ''), fs.readFileSync(path.join(pasta, f), 'utf8').trim()]));
medidas.push({ nome: 'os códigos das conferências tocadas e da construção', valor: codigos, comando: COMANDO,
  conhecido_positivo: 'cada código é a saída do seu comando, escrita num ficheiro acabado de escrever pela corrida' });

const cabeca = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: raiz, encoding: 'utf8' }).stdout.trim();
fs.writeFileSync(path.join(aqui, 'medidas.json'), JSON.stringify({ bloco: 'HB1-g', cabeca_medida: cabeca,
  dist_antes: 'o dist/ construído na cabeça 77c354ea1, copiado antes da construção desta passagem', medidas }, null, 2) + '\n');
console.log(JSON.stringify({ predicado: verdadeiras, publicas: verdadeirasPublicas, recibos, dist_inteiro: inteiro.length,
  ensaio: agora, contra_antes: contraAntes, plantas_hb1f: nomesHb1f, positivoDiff, codigos }, null, 1));
