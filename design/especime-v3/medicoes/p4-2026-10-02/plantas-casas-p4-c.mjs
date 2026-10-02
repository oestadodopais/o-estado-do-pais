/** P4-c (02.10.2026, achados 4 e 9 da leitura a frio): as plantas da regra das casas decimais corridas na célula de
 * hoje e na célula de antes da passagem (a da cabeça 4012a35c, lida do Git para uma pasta temporária), para mostrar o
 * que a de antes deixava passar: o registo do INE com o «ind_string» tirado caía em «por ler» sem erro.
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/p4-2026-10-02/plantas-casas-p4-c.mjs
 * Sai 0 quando todas as plantas estão certas na célula de hoje; 1 se não. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { plantasDasCasasDecimais } from '../../../../scripts/casas-decimais.mjs';

const ANTES = '4012a35c';
const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'casas-p4-c-'));
const ficheiro = path.join(pasta, 'casas-decimais-antes.mjs');
fs.writeFileSync(ficheiro, execFileSync('git', ['show', `${ANTES}:scripts/casas-decimais.mjs`]));
const antes = await import(pathToFileURL(ficheiro).href);
const linhas = loadClaims();
const hoje = plantasDasCasasDecimais(linhas);
const comAntes = plantasDasCasasDecimais(linhas, antes.conferirCasasDecimais);
for (let i = 0; i < hoje.length; i++) {
  const h = hoje[i], a = comAntes[i];
  console.log(`${h.certo ? 'certa' : 'ERRADA'} · ${h.nome} · devia ${h.esperado}; hoje ${h.mordeu ? 'morde' : 'cala'}, com a célula de ${ANTES} ${a.mordeu ? 'morde' : 'cala'}`);
}
const novas = hoje.filter((h, i) => h.esperado === 'morder' && h.mordeu && !comAntes[i].mordeu);
console.log(`${hoje.filter((h) => h.certo).length} de ${hoje.length} certas hoje; ${novas.length} que mordem hoje e calavam com a célula de ${ANTES}`);
fs.rmSync(pasta, { recursive: true, force: true });
process.exitCode = hoje.every((h) => h.certo) ? 0 : 1;
