/** UE1b: as conferências que cada commit da passagem tocou, corridas antes dele, em entre-commits-ue1b.json.
 *
 * Cada conferência correu no seu comando, com o código escrito num ficheiro acabado de escrever numa pasta
 * de trabalho fora do repositório; este guião lê esses códigos e escreve-os aqui, sem o caminho da pasta.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/entre-commits-ue1b.mjs <pasta dos códigos>
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
  { commit: '63f54d18', o_que: 'o ordinal inglês, as ressalvas da fonte nas pontas e a legenda das marcas do recibo da série (o estado sem a porta, construído à parte)',
    corridas: [['python3 acertos-ue1.py', 'acertos'], ['npm run check:voz (depois de pôr o inventário em dia)', 'voz-b1'], ['npm run build', 'build-A'], ['npm run check:cartao', 'cartao-A'], ['npm run typecheck', 'tipos-A']] },
  { commit: '181ce25c', o_que: 'a porta do recibo da linha portuguesa para a sua série',
    corridas: [['npm run build', 'build-B'], ['npm run check:alvos', 'check-alvos-B'], ['npm run check:lugar', 'check-lugar-B'], ['npm run check:cartao', 'check-cartao-B'], ['npm run typecheck', 'typecheck-B']] },
  { commit: 'c9859d31', o_que: 'o mapa do repositório',
    corridas: [['python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md', 'mapa-2']] },
];
const saida = commits.map((c) => ({ commit: c.commit, o_que: c.o_que, corridas: c.corridas.map(([comando, f]) => ({ comando, codigo: le(f) })) }));
const todas = saida.flatMap((c) => c.corridas);
const resumo = {
  bloco: 'UE1b', commits: saida,
  corridas: todas.length, corridas_a_zero: todas.filter((c) => c.codigo === 0).length,
  conhecido_positivo: { o_que: 'um código que não existe lê-se como nulo e não como zero', encontrado: le('um-ficheiro-que-nao-existe') === null },
};
fs.writeFileSync(path.join(PASTA, 'entre-commits-ue1b.json'), JSON.stringify(resumo, null, 2) + '\n');
console.log(`UE1b entre commits: ${resumo.corridas_a_zero} de ${resumo.corridas} corridas a zero`);
process.exit(resumo.corridas_a_zero === resumo.corridas && resumo.conhecido_positivo.encontrado ? 0 : 1);
