/** K2, item 6: as plantas do portão inteiro para a célula das casas decimais. Cada planta copia `ledger/claims/` para
 * uma pasta temporária, estraga uma linha na cópia, corre `node scripts/check-ledger.mjs` com `OEDP_LEDGER_DIR` a
 * apontar para a cópia, e exige o código 1 com a queixa esperada; as linhas reais não se tocam (o resumo de cada uma
 * confere-se antes e depois). As plantas em memória da própria célula correm em cada `ledger:check`; estas provam o
 * caminho inteiro, do ficheiro da linha à saída do portão.
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/k2-2026-10-02/plantas-casas-decimais.mjs <saída.json> */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const saida = process.argv[2];
if (!saida) throw new Error('Uso: plantas-casas-decimais.mjs <saída.json>');
const resumo = (f) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const limpa = (s) => s.replaceAll(process.cwd(), '[repositorio]').replaceAll(os.tmpdir(), '[temporario]').replaceAll(os.homedir(), '[pasta-pessoal]').replaceAll(os.userInfo().username, '[utilizador]');
const plantas = [
  { nome: 'a linha do crédito malparado arredondada, «2» onde o excerto composto acaba em «2.1 p»', id: 'credito-malparado-2025', de: 'value: "2,1"', para: 'value: "2"', mordida: /D2 · credito-malparado-2025: o excerto composto acaba em «2\.1 p»/ },
  { nome: 'a retribuição mínima sem os cêntimos do diploma, «920» onde o excerto escreve «€ 920,00»', id: 'retribuicao-minima-mensal-garantida-continente-2026', de: 'value: "920,00"', para: 'value: "920"', mordida: /D1 · retribuicao-minima-mensal-garantida-continente-2026: o valor «920» escreve 0 casa\(s\)/ },
];
const resultados = [];
for (const p of plantas) {
  const real = `ledger/claims/${p.id}.yml`;
  const antes = resumo(real);
  /* A CÓPIA TEM A FORMA DO REPOSITÓRIO: o livro-razão lê os recortes e os dados servidos dois níveis acima da pasta
     das linhas (`public/recortes`, `public/dados`), e por isso a pasta temporária leva `ledger/claims` copiada e
     `public` como ligação para a pasta real, só de leitura. */
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'k2-casas-'));
  const pasta = path.join(raiz, 'ledger', 'claims');
  fs.mkdirSync(pasta, { recursive: true });
  fs.symlinkSync(path.resolve('public'), path.join(raiz, 'public'));
  try {
    for (const f of fs.readdirSync('ledger/claims')) fs.copyFileSync(path.join('ledger/claims', f), path.join(pasta, f));
    const copia = path.join(pasta, `${p.id}.yml`);
    const texto = fs.readFileSync(copia, 'utf8');
    if (!texto.includes(p.de)) throw new Error(`${p.id}: a cópia não tem «${p.de}»`);
    fs.writeFileSync(copia, texto.replace(p.de, p.para));
    const r = spawnSync(process.execPath, ['scripts/check-ledger.mjs'], { encoding: 'utf8', env: { ...process.env, OEDP_LEDGER_DIR: pasta, NO_COLOR: '1' }, maxBuffer: 32 * 1024 * 1024 });
    const texto2 = limpa(`${r.stdout}\n${r.stderr}`).replace(/\x1b\[[0-9;]*m/g, '');
    const queixa = texto2.split('\n').find((l) => p.mordida.test(l))?.trim() ?? null;
    resultados.push({ nome: p.nome, linha: p.id, codigo: r.status, mordida: p.mordida.source, queixa, mordeu: r.status === 1 && Boolean(queixa), resumo_antes: antes, resumo_depois: resumo(real), linha_real_intacta: antes === resumo(real) });
  } finally {
    fs.rmSync(raiz, { recursive: true, force: true });
  }
}
fs.writeFileSync(saida, JSON.stringify({ o_que: 'as plantas do portão inteiro da célula das casas decimais (ledger:check sobre uma cópia estragada do livro)', plantas: resultados }, null, 2) + '\n');
console.log(resultados.map((r) => `${r.mordeu ? 'mordeu' : 'NÃO MORDEU'} · ${r.nome} (código ${r.codigo})`).join('\n'));
process.exitCode = resultados.every((r) => r.mordeu && r.linha_real_intacta) ? 0 : 1;
