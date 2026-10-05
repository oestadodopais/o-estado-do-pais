/**
 * RP4-m: as plantas da L1 do `check:lingua` depois de ela passar a contar as unidades das séries (o ponto 5 do
 * mandato). Planta-se numa CÓPIA do livro-razão (as linhas e as séries), pela porta `OEDP_LEDGER_DIR` que o portão
 * documenta, e nunca no que a construção publica; não escreve no `dist/` (o portão lê-o, como lê sempre).
 *
 *   · O CONTROLO: a cópia intacta não dá nenhuma queixa de unidade.
 *   · A ENTRADA MORTA: as duas séries de índice com a unidade «%» em vez de «índice (base 2025 = 100)»; nenhuma linha
 *     nem série usa já a entrada, e a L1 tem de a chamar morta (a regra de antes, que continua a morder).
 *   · A UNIDADE DE SÉRIE SEM ENTRADA: a série do salário real com uma unidade inventada; a L1 tem de dizer que ela não
 *     tem entrada no dicionário (a regra nova, que as linhas já tinham).
 *
 * Uso (na raiz do sítio, com uma construção em dist/): node design/especime-v3/medicoes/rp4m-2026-10-05/plantas-da-lingua.mjs
 * Escreve `plantas-da-lingua.json` ao lado.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const QUEIXA_DE_UNIDADE = /unidade «|UNIDADES_EM_PORTUGUES declara/;

function copia(muda) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rp4m-lingua-'));
  fs.cpSync(path.join(RAIZ, 'ledger', 'claims'), path.join(tmp, 'ledger', 'claims'), { recursive: true });
  fs.cpSync(path.join(RAIZ, 'ledger', 'series'), path.join(tmp, 'ledger', 'series'), { recursive: true });
  muda(path.join(tmp, 'ledger', 'series'));
  return tmp;
}
function troca(ficheiro, de, para) {
  const t = fs.readFileSync(ficheiro, 'utf8');
  if (!t.includes(de)) throw new Error(`a planta não encontrou «${de}» em ${path.basename(ficheiro)}`);
  fs.writeFileSync(ficheiro, t.replace(de, para));
}
function corre(tmp) {
  const r = spawnSync(process.execPath, ['scripts/check-lingua.mjs'], {
    cwd: RAIZ, encoding: 'utf8', env: { ...process.env, OEDP_LEDGER_DIR: path.join(tmp, 'ledger', 'claims') }, maxBuffer: 64 * 1024 * 1024,
  });
  fs.rmSync(tmp, { recursive: true, force: true });
  const linhas = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '').split('\n').map((l) => l.trim()).filter((l) => QUEIXA_DE_UNIDADE.test(l));
  return { codigo: r.status, queixas_de_unidade: linhas };
}

const controlo = corre(copia(() => {}));
const morta = corre(copia((dir) => {
  for (const f of ['serie-ipc-indice.yml', 'serie-ipc-indice-anual.yml']) troca(path.join(dir, f), 'unit: "índice (base 2025 = 100)"', 'unit: "%"');
}));
const semEntrada = corre(copia((dir) => troca(path.join(dir, 'serie-remuneracao-bruta-mensal-media-real.yml'), 'unit: "euros de 2015 por mês"', 'unit: "unidade inventada da planta"')));
const plantas = [
  { nome: 'a entrada «índice (base 2025 = 100)» sem nenhuma série que a use', espera: 'que nenhuma linha nem série do livro-razão usa',
    mordeu: morta.queixas_de_unidade.some((l) => l.includes('«índice (base 2025 = 100)»') && l.includes('que nenhuma linha nem série do livro-razão usa')), ...morta },
  { nome: 'a série do salário real com uma unidade sem entrada', espera: 'não tem entrada',
    mordeu: semEntrada.queixas_de_unidade.some((l) => l.includes('«unidade inventada da planta» (1 série(s))') && l.includes('não tem entrada')), ...semEntrada },
];
const saida = { o_que: 'RP4-m: as plantas da L1 do check:lingua, numa cópia do livro-razão', controlo, controlo_integro: controlo.queixas_de_unidade.length === 0, plantas,
  plantas_quantas: plantas.length, plantas_mordidas: plantas.filter((p) => p.mordeu).length };
fs.writeFileSync(path.join(AQUI, 'plantas-da-lingua.json'), JSON.stringify(saida, null, 2) + '\n');
console.log(`controlo ${saida.controlo_integro ? 'íntegro' : 'COM QUEIXAS'} · ${saida.plantas_mordidas} de ${saida.plantas_quantas} planta(s) morderam`);
process.exit(saida.controlo_integro && saida.plantas_mordidas === saida.plantas_quantas ? 0 : 1);
