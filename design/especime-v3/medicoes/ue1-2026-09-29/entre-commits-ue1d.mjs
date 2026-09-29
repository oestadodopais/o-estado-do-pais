/** UE1d: as conferências que cada commit da passagem tocou, corridas antes dele, em entre-commits-ue1d.json.
 *
 * Cada conferência correu no seu comando, com o código escrito num ficheiro acabado de escrever numa pasta
 * de trabalho fora do repositório; este guião lê esses códigos (e, do mapa, as contas do registo) e
 * escreve-os aqui, sem o caminho da pasta.
 *
 * O MAPA. O `conferir-mapa.py` é um guião de leitura e sai sempre com 0, haja ou não citações perdidas; a
 * prova dele são as quatro contas que escreve, e não o código. Por isso este guião lê as contas do registo,
 * e o conhecido-positivo é a corrida antes da emenda do mapa, que viu as 5 citações que a passagem mudou de
 * sítio. (Na UE1c o `entre-commits-ue1c.json` guardou só o código do mapa; o registo dessa corrida, lido
 * agora, dizia 135 citações conferidas e 0 perdidas, e fica aqui também.)
 *
 * O ESTADO COMPLETO. Antes de partir a passagem em dois commits, as conferências correram no estado
 * completo; duas falharam e ficam aqui com a queixa contada no registo e o que a resolveu.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/entre-commits-ue1d.mjs <pasta dos códigos>
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
const registo = (f) => {
  const p = path.join(codigos, `${f}.log`);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
};
const conta = (f, re) => {
  const t = registo(f);
  return t === null ? null : (t.match(new RegExp(re, 'g')) ?? []).length;
};
/** As quatro contas do `conferir-mapa.py`, lidas do registo; nulas se o registo não as tiver. */
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
  { commit: '530d5edc', o_que: 'a média da União de volta ao cartão da sobrecarga do custo da habitação no total, com a ressalva da Comissão de uma fonte única no cartão e nos recibos, a K14 na forma nova e a K17 a contar as origens da auditoria da primeira página (o estado sem a definição declarada nos recibos das séries, construído à parte)',
    corridas: [['npm run build', 'build-G'], ['npm run check:cartao', 'check-cartao-G'], ['npm run check:primeira', 'check-primeira-G'], ['npm run check:alvos', 'check-alvos-G'], ['npm run check:lugar', 'check-lugar-G'], ['npm run typecheck', 'typecheck-G']] },
  { commit: '165650cf', o_que: 'a definição declarada da medida nos recibos das dez séries, conferida pelo portão de HTML, sem a regra do corte',
    corridas: [['npm run build', 'build-H'], ['npm run typecheck', 'tipos-H'], ['npm run check:lugar', 'lugar-H']] },
];
commits.push({ commit: '99b9f73a', o_que: 'o construtor da prova do check:cartao lê a ressalva declarada sem rebentar quando a declaração não a tem (a planta da declaração, que fechava a construção com um TypeError)',
  corridas: [['npm run check:cartao', 'check-cartao-I']] });
const saida = commits.map((c) => ({ commit: c.commit, o_que: c.o_que, corridas: c.corridas.map(([comando, f]) => ({ comando, codigo: le(f) })) }));
/* As duas plantas da declaração corridas antes do commit 99b9f73a, à mão, cada uma reposta pelo sha256: têm de
   sair com 1 e com a queixa da K14. */
const plantasDoCommit = [
  { commit: '99b9f73a', planta: 'a medida tirada da declaração das ressalvas, com --prova', comando: 'node tests/cartao/cartao.mjs --prova', codigo: le('planta-decl-I'),
    queixa: /o controlo da K14 deu \d+ vermelho\(s\): K14 · \S+ · sobrecarga-do-custo-da-habitacao-2025: o (cartão|recibo) mostra a União e a declaração não tem o texto da ressalva desta medida/.test((registo('planta-decl-I') ?? '').replace(/\x1b\[[0-9;]*m/g, '')) },
  { commit: '99b9f73a', planta: 'a medida tirada da declaração das ressalvas, sem --prova', comando: 'node tests/cartao/cartao.mjs', codigo: le('planta-decl-sem-prova'),
    queixa: /K14 · a medida «sobrecarga-do-custo-da-habitacao-2025» exige a ressalva e a declaração não a tem/.test((registo('planta-decl-sem-prova') ?? '').replace(/\x1b\[[0-9;]*m/g, '')) },
];
const mapaI = { commit: '99b9f73a', comando: MAPA, codigo: le('mapa-I'), contas: contasDoMapa('mapa-I') };
const mapa = {
  commit: 'de17f63e', o_que: 'o mapa do repositório',
  corrida: { comando: MAPA, codigo: le('mapa-d2'), contas: contasDoMapa('mapa-d2') },
  antes_da_emenda: { comando: MAPA, codigo: le('mapa-d1'), contas: contasDoMapa('mapa-d1') },
  nota: 'o guião sai sempre com 0; a prova são as contas',
};
const ue1cMapa = { o_que: 'a corrida do mapa antes do commit 982d6446 da UE1c, lida agora do registo', contas: contasDoMapa('mapa-c3') };
const completo = {
  o_que: 'o estado completo da passagem, antes de o partir nos dois commits',
  corridas: [
    { comando: 'npm run build', codigo: le('build-d1'), queixas: { blocos_por_classificar: conta('build-d1', 'bloco por classificar em '), linhas_vivas_que_nao_se_rendem: conta('build-d1', 'linha «viva» que não se rende') }, resolvido_por: 'as linhas da ressalva e da leitura nova no inventário das frases, com a entrada ue1d nas revisões, e as duas linhas da leitura antiga fora' },
    { comando: 'npm run check:voz', codigo: le('voz-d1') },
    { comando: 'npm run check:cartao', codigo: le('cartao-d1'), queixas: { origem_declarada_sem_apoio: conta('cartao-d1', 'está declarada e não apoia') }, resolvido_por: 'a K17 passa a contar as origens da auditoria dos blocos da primeira página, com duas plantas novas' },
    { comando: 'npm run check:cartao', codigo: le('cartao-d2') },
    ...[['npm run check:nomes', 'check-nomes-d1'], ['npm run check:lingua', 'check-lingua-d1'], ['npm run sinais', 'sinais-d1'], ['npm run check:alvos', 'check-alvos-d1'], ['npm run check:lugar', 'check-lugar-d1'], ['npm run check:primeira', 'check-primeira-d1'], ['npm run check:mortos', 'check-mortos-d1'], ['npm run typecheck', 'tipos-d1']].map(([comando, f]) => ({ comando, codigo: le(f) })),
  ],
};
const todas = saida.flatMap((c) => c.corridas);
const mapaLimpo = mapa.corrida.contas && mapa.corrida.contas.no_ficheiro_mas_longe === 0 && mapa.corrida.contas.nao_encontradas === 0 && mapa.corrida.contas.para_la_do_fim === 0;
const resumo = {
  bloco: 'UE1d', commits: saida, plantas_antes_do_commit: plantasDoCommit, mapa, mapa_do_commit_99b9f73a: mapaI, ue1c_mapa: ue1cMapa, estado_completo: completo,
  corridas: todas.length, corridas_a_zero: todas.filter((c) => c.codigo === 0).length,
  mapa_sem_citacoes_perdidas: mapaLimpo,
  conhecido_positivo: {
    o_que: 'um código que não existe lê-se como nulo e não como zero; e o mapa antes da emenda tem citações perdidas',
    codigo_inexistente_nulo: le('um-ficheiro-que-nao-existe') === null,
    mapa_antes_com_perdidas: (mapa.antes_da_emenda.contas?.nao_encontradas ?? 0) > 0,
  },
};
fs.writeFileSync(path.join(PASTA, 'entre-commits-ue1d.json'), JSON.stringify(resumo, null, 2) + '\n');
console.log(`UE1d entre commits: ${resumo.corridas_a_zero} de ${resumo.corridas} corridas a zero; o mapa ${JSON.stringify(mapa.corrida.contas)} (antes da emenda ${JSON.stringify(mapa.antes_da_emenda.contas)})`);
const mapaIlimpo = mapaI.contas && mapaI.contas.no_ficheiro_mas_longe === 0 && mapaI.contas.nao_encontradas === 0 && mapaI.contas.para_la_do_fim === 0;
resumo.mapa_do_commit_99b9f73a_sem_citacoes_perdidas = mapaIlimpo;
resumo.plantas_antes_do_commit_que_morderam = plantasDoCommit.filter((x) => x.codigo !== 0 && x.codigo !== null && x.queixa).length;
fs.writeFileSync(path.join(PASTA, 'entre-commits-ue1d.json'), JSON.stringify(resumo, null, 2) + '\n');
const ok = resumo.corridas_a_zero === resumo.corridas && mapaLimpo && mapaIlimpo && resumo.plantas_antes_do_commit_que_morderam === plantasDoCommit.length && resumo.conhecido_positivo.codigo_inexistente_nulo && resumo.conhecido_positivo.mapa_antes_com_perdidas;
process.exit(ok ? 0 : 1);
