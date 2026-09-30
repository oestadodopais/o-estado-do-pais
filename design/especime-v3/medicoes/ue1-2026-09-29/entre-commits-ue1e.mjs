/** UE1e: as conferências que cada commit da passagem tocou, corridas antes dele, em entre-commits-ue1e.json.
 *
 * Cada conferência correu no seu comando, com o código escrito num ficheiro acabado de escrever numa pasta
 * de trabalho fora do repositório, depois de esperar que nenhuma outra construção corresse; este guião lê
 * esses códigos (e, do mapa, as contas do registo, porque o `conferir-mapa.py` sai sempre com 0) e escreve-os
 * aqui, sem o caminho da pasta.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/entre-commits-ue1e.mjs <pasta dos códigos> <commit do código> <commit do mapa>
 */
import fs from 'node:fs';
import path from 'node:path';

const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const [codigos, commitDoCodigo, commitDoMapa] = process.argv.slice(2);
if (!codigos || !fs.existsSync(codigos) || !commitDoCodigo || !commitDoMapa) throw new Error('passe a pasta dos códigos e os dois commits');
const le = (f) => {
  const p = path.join(codigos, `${f}.codigo`);
  return fs.existsSync(p) ? Number(fs.readFileSync(p, 'utf8').trim()) : null;
};
const registo = (f) => {
  const p = path.join(codigos, `${f}.log`);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
};
const espera = (f) => {
  const p = path.join(codigos, `${f}.espera`);
  const m = fs.existsSync(p) ? /esperei (\d+) s/.exec(fs.readFileSync(p, 'utf8')) : null;
  return m ? Number(m[1]) : null;
};
const contasDoMapa = (f) => {
  const t = registo(f);
  if (t === null) return null;
  const n = (re) => { const m = t.match(re); return m ? Number(m[1]) : null; };
  return {
    conferidas_na_linha_citada: n(/citações conferidas na linha citada \(±7\): (\d+)/),
    no_ficheiro_mas_longe: n(/citação está no ficheiro, mas longe da linha citada: (\d+)/),
    nao_encontradas: n(/citação não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)/),
    para_la_do_fim: n(/linha citada para lá do fim do ficheiro: (\d+)/),
  };
};
const MAPA = 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md';
const commits = [
  { commit: commitDoCodigo, o_que: 'a forma da definição para o recibo da série (a do índice harmonizado sem «em Portugal»), o recibo a usá-la onde existe, e o portão de HTML a conferir cada recibo contra a forma que deve usar e que nenhuma definição de recibo de série nomeia Portugal',
    corridas: [['npm run typecheck', 'tipos-e1'], ['npm run build', 'build-e1'], ['npm run check:lugar', 'lugar-e1'], ['npm run check:cartao', 'cartao-e1']] },
];
const saida = commits.map((c) => ({ commit: c.commit, o_que: c.o_que, corridas: c.corridas.map(([comando, f]) => ({ comando, codigo: le(f), segundos_de_espera: espera(f) })) }));
const mapa = {
  commit: commitDoMapa, o_que: 'o mapa do repositório: as citações que as linhas novas deslocaram, remapeadas, e a forma do recibo da série na entrada do que a medida conta',
  corrida: { comando: MAPA, contas: contasDoMapa('mapa-e2') },
  antes_da_emenda: { comando: MAPA, contas: contasDoMapa('mapa-e0') },
  nota: 'o guião sai sempre com 0; a prova são as contas',
};
const todas = saida.flatMap((c) => c.corridas);
const mapaLimpo = Boolean(mapa.corrida.contas) && mapa.corrida.contas.no_ficheiro_mas_longe === 0 && mapa.corrida.contas.nao_encontradas === 0 && mapa.corrida.contas.para_la_do_fim === 0;
const resumo = {
  bloco: 'UE1e', commits: saida, mapa,
  corridas: todas.length, corridas_a_zero: todas.filter((c) => c.codigo === 0).length,
  mapa_sem_citacoes_perdidas: mapaLimpo,
  conhecido_positivo: {
    o_que: 'um código que não existe lê-se como nulo e não como zero; e o mapa antes da emenda tem citações longe da linha citada',
    codigo_inexistente_nulo: le('um-ficheiro-que-nao-existe') === null,
    mapa_antes_com_citacoes_longe: (mapa.antes_da_emenda.contas?.no_ficheiro_mas_longe ?? 0) > 0,
  },
};
fs.writeFileSync(path.join(PASTA, 'entre-commits-ue1e.json'), JSON.stringify(resumo, null, 2) + '\n');
console.log(`UE1e entre commits: ${resumo.corridas_a_zero} de ${resumo.corridas} corridas a zero; o mapa ${JSON.stringify(mapa.corrida.contas)} (antes da emenda ${JSON.stringify(mapa.antes_da_emenda.contas)})`);
const ok = resumo.corridas_a_zero === resumo.corridas && mapaLimpo && resumo.conhecido_positivo.codigo_inexistente_nulo && resumo.conhecido_positivo.mapa_antes_com_citacoes_longe;
process.exit(ok ? 0 : 1);
