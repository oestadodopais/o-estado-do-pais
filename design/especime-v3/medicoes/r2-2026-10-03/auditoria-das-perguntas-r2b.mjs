/** R2-b (04.10.2026, o achado 4 da auditoria dos rótulos, pela decisão do lugar de direção sobre o achado que o R2
 * parou): a auditoria da pergunta da quota das exportações, pedaço a pedaço (a K16 do `check:cartao`). A pergunta passa a
 * dizer o que são as economias avançadas pelo termo da fonte; cada pedaço apoia-se num literal de uma origem que a
 * pergunta já declarava (o painel do Procedimento, a descrição do Eurostat e o SEC 2010).
 *
 * Antes de escrever, confere: que os pedaços juntos são a pergunta declarada nas duas edições; que cada literal está
 * mesmo no campo que cita, numa origem que a pergunta declara; e que cada origem declarada apoia um pedaço. A K16
 * confere o mesmo, na construção, sobre o ficheiro escrito. É o guião do R2 (`auditoria-das-perguntas-r2.mjs`) com a
 * entrada desta pergunta.
 *
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/r2-2026-10-03/auditoria-das-perguntas-r2b.mjs            (confere e escreve)
 *   node design/especime-v3/medicoes/r2-2026-10-03/auditoria-das-perguntas-r2b.mjs --confere  (só confere o ficheiro)
 * Sai 0 quando tudo bate; 1 com a lista do que não bate.
 */
import fs from 'node:fs';
import { DEFINICOES_DAS_MEDIDAS, ORIGENS_DAS_DEFINICOES, textoDaDefinicao } from '../../../../src/data/figuras.mjs';
import { loadClaims } from '../../../../src/lib/ledger.mjs';

const FICHEIRO = 'tests/cartao/perguntas-provadas.json';
const so = process.argv.includes('--confere');
const LINHAS = loadClaims();

/** Um apoio numa origem. */
const o = (origem, literal, campo = 'excerto') => ({ origem, campo, literal });
/** Um apoio num campo selado da linha da própria medida (o id entra quando a entrada se monta). */
const l = (campo, literal) => ({ linha: true, campo, literal });
const pedaco = (pt, en, ...apoios) => ({ pt, en, apoios });

const PERGUNTAS = [
  {
    id: 'desempenho-das-exportacoes-2025',
    mudanca: 'R2-b (04.10.2026, o achado 4 da auditoria dos rótulos, pela decisão do lugar de direção): a dobra diz o que são as economias avançadas pelo termo da fonte, entre parênteses a seguir aos países que a descrição do Eurostat conta; a ordem inglesa põe os três anos à cabeça, para o termo ficar ao pé dos países.',
    pedacos: [
      pedaco('Quanto mudou em três anos ', 'Over three years, how much has ',
        o('pdm-exportacoes', '3-year percentage change')),
      pedaco('a parte que as exportações de bens e serviços do país têm no total das exportações dos países ',
        'the part that the country’s exports of goods and services make up of the total exports of the countries ',
        o('eurostat-tipsbp60-descricao', 'shares of exports of goods and services of EU Member States in relation to total exports of goods and services of OECD countries and non-OECD EU Member States')),
      pedaco('da Organização para a Cooperação e Desenvolvimento Económico (OCDE) ', 'of the Organisation for Economic Cooperation and Development (OECD) ',
        o('eurostat-sec2010-ocde', 'the Organisation for Economic Cooperation and Development (OECD)')),
      pedaco('e dos países da União que não são da OCDE ', 'and of EU countries outside the OECD ',
        o('eurostat-tipsbp60-descricao', 'OECD countries and non-OECD EU Member States')),
      pedaco('(as economias avançadas)?', '(the advanced economies) changed?',
        o('eurostat-tipsbp60-descricao', 'Share of exports of advanced economies', 'documento'),
        o('pdm-exportacoes', 'export performance against advanced economies'),
        o('pdm-exportacoes', '3-year percentage change')),
    ],
  },
];

const LEITURA = {
  quem: 'Claude Opus 5.5',
  quando: '2026-10-04',
  o_que:
    'a passagem R2-b, o achado 4 da auditoria dos rótulos pela decisão do lugar de direção: a pergunta da quota das exportações diz o que são as economias avançadas pelo termo da fonte, pedaço a pedaço. Escrito por design/especime-v3/medicoes/r2-2026-10-03/auditoria-das-perguntas-r2b.mjs',
};

const erros = [];
const entradas = PERGUNTAS.map((q) => {
  const d = /** @type {any} */ (DEFINICOES_DAS_MEDIDAS)[q.id];
  if (!d) {
    erros.push(`${q.id}: a pergunta não está declarada`);
    return null;
  }
  const pergunta = { pt: textoDaDefinicao(d.pt), en: textoDaDefinicao(d.en) };
  for (const lang of ['pt', 'en']) {
    const junta = q.pedacos.map((p) => p[lang]).join('');
    if (junta !== pergunta[lang]) erros.push(`${q.id} (${lang}): os pedaços juntos dão «${junta}» e a pergunta é «${pergunta[lang]}»`);
  }
  const usadas = new Set();
  const pedacos = q.pedacos.map((p) => ({
    ...p,
    apoios: p.apoios.map((a) => {
      if (a.linha) {
        const linha = LINHAS.get(q.id);
        const valor = a.campo === 'document.title' ? linha?.document?.title : linha?.[a.campo];
        if (typeof valor !== 'string' || !valor.includes(a.literal)) erros.push(`${q.id}: «${a.literal}» não está no campo «${a.campo}» da linha`);
        return { linha: q.id, campo: a.campo, literal: a.literal };
      }
      const origem = /** @type {any} */ (ORIGENS_DAS_DEFINICOES)[a.origem];
      if (!d.origens.includes(a.origem)) erros.push(`${q.id}: o apoio cita «${a.origem}», que a pergunta não declara`);
      if (typeof origem?.[a.campo] !== 'string' || !origem[a.campo].includes(a.literal)) {
        erros.push(`${q.id}: «${a.literal}» não está no campo «${a.campo}» de «${a.origem}»`);
      }
      usadas.add(a.origem);
      return a;
    }),
  }));
  for (const k of d.origens) if (!usadas.has(k)) erros.push(`${q.id}: a origem «${k}» não apoia pedaço nenhum`);
  return { id: q.id, origens: [...d.origens], pergunta, mudanca: q.mudanca, pedacos };
});

const auditoria = JSON.parse(fs.readFileSync(FICHEIRO, 'utf8'));
if (so) {
  for (const e of entradas) {
    const noFicheiro = auditoria.perguntas.find((q) => q.id === e?.id && !q.forma);
    if (JSON.stringify(noFicheiro) !== JSON.stringify(e)) erros.push(`${e?.id}: a entrada no ficheiro não é a que este guião escreve`);
  }
  if (!auditoria.leituras.some((x) => JSON.stringify(x) === JSON.stringify(LEITURA))) erros.push('falta a leitura da R2-b no registo das leituras');
} else if (!erros.length) {
  /* Uma entrada que já exista substitui-se no mesmo lugar da lista; uma nova junta-se no fim. */
  for (const e of entradas) {
    const i = auditoria.perguntas.findIndex((q) => q.id === e.id && !q.forma);
    if (i >= 0) auditoria.perguntas[i] = e;
    else auditoria.perguntas.push(e);
  }
  if (!auditoria.leituras.some((x) => JSON.stringify(x) === JSON.stringify(LEITURA))) auditoria.leituras.push(LEITURA);
  fs.writeFileSync(FICHEIRO, JSON.stringify(auditoria, null, 2) + '\n');
}
if (erros.length) {
  for (const e of erros) console.error(`  ${e}`);
  process.exit(1);
}
const pedacos = entradas.reduce((n, e) => n + e.pedacos.length, 0);
const apoios = entradas.reduce((n, e) => n + e.pedacos.reduce((m, p) => m + p.apoios.length, 0), 0);
console.log(`R2-b: ${entradas.length} perguntas auditadas, ${pedacos} pedaços, ${apoios} apoios${so ? ' (só conferido)' : ' (escritas)'}.`);
