/** UE1c: as conferências que cada commit da passagem tocou, corridas antes dele, em entre-commits-ue1c.json.
 *
 * Cada conferência correu no seu comando, com o código escrito num ficheiro acabado de escrever numa pasta
 * de trabalho fora do repositório; este guião lê esses códigos e escreve-os aqui, sem o caminho da pasta.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/entre-commits-ue1c.mjs <pasta dos códigos>
 */
import fs from 'node:fs';
import path from 'node:path';

const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const codigos = process.argv[2];
if (!codigos || !fs.existsSync(codigos)) throw new Error('passe a pasta dos códigos');
const le = (f) => {
  const p = path.join(codigos, `${f}.codigo`);
  return fs.existsSync(p) ? Number(fs.readFileSync(p, 'utf8').trim()) : null;
};
const commits = [
  { commit: 'baa82bce', o_que: 'os extremos empatados na faixa (o estado sem a frase do recibo, construído à parte)',
    corridas: [['npm run build', 'build-D'], ['npm run check:cartao', 'cartao-D'], ['npm run typecheck', 'tipos-D']] },
  { commit: '2a12ff68', o_que: 'o que cada medida conta, no recibo da sua série',
    corridas: [['npm run build', 'build-E'], ['npm run typecheck', 'tipos-E'], ['npm run check:lugar', 'lugar-E']] },
  { commit: '982d6446', o_que: 'o mapa do repositório',
    corridas: [['python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md', 'mapa-c3']] },
];
const saida = commits.map((c) => ({ commit: c.commit, o_que: c.o_que, corridas: c.corridas.map(([comando, f]) => ({ comando, codigo: le(f) })) }));
const todas = saida.flatMap((c) => c.corridas);
const resumo = {
  bloco: 'UE1c', commits: saida,
  corridas: todas.length, corridas_a_zero: todas.filter((c) => c.codigo === 0).length,
  conhecido_positivo: { o_que: 'um código que não existe lê-se como nulo e não como zero', encontrado: le('um-ficheiro-que-nao-existe') === null },
};
fs.writeFileSync(path.join(PASTA, 'entre-commits-ue1c.json'), JSON.stringify(resumo, null, 2) + '\n');
console.log(`UE1c entre commits: ${resumo.corridas_a_zero} de ${resumo.corridas} corridas a zero`);
process.exit(resumo.corridas_a_zero === resumo.corridas && resumo.conhecido_positivo.encontrado ? 0 : 1);
