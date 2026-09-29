/** UE1b: o custo da passagem de correção, em custo-ue1b.json.
 *
 * As horas leem-se de ficheiros e do git: o começo é a hora do commit das provas do UE1 (`0f75298f`),
 * que é quando a passagem começou, e o fim é o de `portoes/ue1b/typecheck.fim`, o último portão. Os
 * símbolos são a leitura, à mão, do contador que o ambiente mostra ao agente (o total da sessão menos o
 * que resta), passada como argumento; o total que a ferramenta reporta ao lugar de direção é o que conta.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/custo-ue1b.mjs <o que resta do contador>
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const resta = Number(process.argv[2]);
if (!Number.isInteger(resta) || resta <= 0) throw new Error('passe o que resta do contador, um inteiro');
const TOTAL = 15000000;
const inicio = execFileSync('git', ['show', '-s', '--format=%cI', '0f75298f'], { encoding: 'utf8' }).trim();
const fim = fs.readFileSync(path.join(PASTA, 'portoes/ue1b/typecheck.fim'), 'utf8').trim();
const ue1 = JSON.parse(fs.readFileSync(path.join(PASTA, 'custo-ue1.json'), 'utf8')).medidas.simbolos_da_sessao_no_fecho.valor;
const segundos = Math.round((Date.parse(fim) - Date.parse(inicio)) / 1000);
const medidas = {
  inicio_da_passagem: { valor: new Date(inicio).toISOString().replace('.000Z', 'Z'), comando: 'git show -s --format=%cI 0f75298f (o commit das provas do UE1)', o_que: 'a hora leu-se', encontrado: Number.isFinite(Date.parse(inicio)) },
  fim_dos_portoes: { valor: fim, comando: `cat ${PASTA}/portoes/ue1b/typecheck.fim`, o_que: 'o ficheiro existe e é uma hora UTC', encontrado: Number.isFinite(Date.parse(fim)) },
  segundos_da_passagem: { valor: segundos, comando: 'a diferença entre as duas horas acima', o_que: 'é positiva', encontrado: segundos > 0 },
  simbolos_da_sessao_no_fecho_da_passagem: { valor: TOTAL - resta, comando: `15 000 000 (o total da sessão que o ambiente deu ao agente) menos ${resta} (o que restava, lido à mão antes do último commit da passagem)`, o_que: 'é maior do que a leitura do fecho do UE1', encontrado: TOTAL - resta > ue1 },
  simbolos_da_passagem: { valor: TOTAL - resta - ue1, comando: 'a leitura acima menos a do fecho do UE1 (custo-ue1.json)', o_que: 'é positiva', encontrado: TOTAL - resta - ue1 > 0 },
};
fs.writeFileSync(path.join(PASTA, 'custo-ue1b.json'), JSON.stringify({ _: 'O custo da passagem UE1b. As horas leem-se do git e dos ficheiros dos portões; os símbolos são a leitura, à mão, do contador que o ambiente mostra ao agente, e o total que a ferramenta reporta ao lugar de direção é o que conta.', medidas }, null, 2) + '\n');
console.log(JSON.stringify(medidas, null, 2));
