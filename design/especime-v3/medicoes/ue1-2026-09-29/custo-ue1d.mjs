/** UE1d: o custo da passagem da §1.140 e das definições, em custo-ue1d.json.
 *
 * As horas leem-se de ficheiros e do git: o começo é a hora do commit das provas da UE1c (`42a368a3`),
 * depois do qual a passagem começou, e o fim é o de `portoes/ue1d/typecheck.fim`, o último portão. O tempo
 * de espera pela construção de outra árvore lê-se dos dois `espera.log` que o `portao-ue1d.sh` escreve: o da
 * primeira corrida dos portões, na cabeça `de17f63e` (`portoes/ue1d-de17f63e/`), e o da corrida final. Os símbolos são a leitura, à mão, do contador que o ambiente mostra ao agente (o total da sessão
 * menos o que resta), passada como argumento; o total que a ferramenta reporta ao lugar de direção é o que
 * conta.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/custo-ue1d.mjs <o que resta do contador>
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const resta = Number(process.argv[2]);
if (!Number.isInteger(resta) || resta <= 0) throw new Error('passe o que resta do contador, um inteiro');
const TOTAL = 15000000;
const inicio = execFileSync('git', ['show', '-s', '--format=%cI', '42a368a3'], { encoding: 'utf8' }).trim();
const fim = fs.readFileSync(path.join(PASTA, 'portoes/ue1d/typecheck.fim'), 'utf8').trim();
const ue1c = JSON.parse(fs.readFileSync(path.join(PASTA, 'custo-ue1c.json'), 'utf8')).medidas.simbolos_da_sessao_no_fecho_da_passagem.valor;
const espera = ['portoes/ue1d-de17f63e/espera.log', 'portoes/ue1d/espera.log'].flatMap((f) => fs.readFileSync(path.join(PASTA, f), 'utf8').split('\n').filter(Boolean));
const esperas = espera.map((l) => Number((l.match(/esperei (\d+) s/) ?? [])[1]));
const segundos = Math.round((Date.parse(fim) - Date.parse(inicio)) / 1000);
const medidas = {
  inicio_da_passagem: { valor: new Date(inicio).toISOString().replace('.000Z', 'Z'), comando: 'git show -s --format=%cI 42a368a3 (o commit das provas da UE1c)', o_que: 'a hora leu-se', encontrado: Number.isFinite(Date.parse(inicio)) },
  fim_dos_portoes: { valor: fim, comando: `cat ${PASTA}/portoes/ue1d/typecheck.fim`, o_que: 'o ficheiro existe e é uma hora UTC', encontrado: Number.isFinite(Date.parse(fim)) },
  segundos_da_passagem: { valor: segundos, comando: 'a diferença entre as duas horas acima', o_que: 'é positiva', encontrado: segundos > 0 },
  segundos_de_espera_pelos_portoes: { valor: esperas.reduce((a, b) => a + b, 0), comando: `a soma dos «esperei N s» das ${espera.length} linhas de ${PASTA}/portoes/ue1d-de17f63e/espera.log e ${PASTA}/portoes/ue1d/espera.log`, o_que: 'cada linha tem o seu número', encontrado: esperas.length > 0 && esperas.every(Number.isFinite) },
  simbolos_da_sessao_no_fecho_da_passagem: { valor: TOTAL - resta, comando: `15 000 000 (o total da sessão que o ambiente deu ao agente) menos ${resta} (o que restava, lido à mão antes do último commit da passagem)`, o_que: 'é maior do que a leitura do fecho da passagem UE1c', encontrado: TOTAL - resta > ue1c },
  simbolos_da_passagem: { valor: TOTAL - resta - ue1c, comando: 'a leitura acima menos a do fecho da passagem UE1c (custo-ue1c.json)', o_que: 'é positiva', encontrado: TOTAL - resta - ue1c > 0 },
};
fs.writeFileSync(path.join(PASTA, 'custo-ue1d.json'), JSON.stringify({ _: 'O custo da passagem UE1d. As horas leem-se do git e dos ficheiros dos portões; os símbolos são a leitura, à mão, do contador que o ambiente mostra ao agente, e o total que a ferramenta reporta ao lugar de direção é o que conta.', medidas }, null, 2) + '\n');
console.log(JSON.stringify(medidas, null, 2));
