/** P4 (02.10.2026, item 3 do brief P4; a §1.152, decisão 4): a auditoria das duas perguntas cujos termos ficaram por
 * explicar depois da passagem UE2-b, pedaço a pedaço (a K16 do `check:cartao`).
 *
 * «em pontos percentuais», na pergunta da diferença de emprego entre sexos, e «regimes de ocupação», na da sobrecarga
 * do custo da habitação no total, passam à forma única das definições: as palavras comuns primeiro e o termo da fonte
 * entre parênteses. Os pontos percentuais dizem-se pela conta que a definição do Eurostat escreve («the difference
 * between the employment rates», e a unidade da linha, «Percentage of total population»), como na pergunta da taxa de
 * atividade; os regimes de ocupação pelas categorias da resposta do Eurostat (`eurostat-tessi164-regimes`), com as
 * palavras que a leitura do mesmo cartão já usa e a K17 já audita.
 *
 * Antes de escrever, confere: que os pedaços juntos são a pergunta declarada nas duas edições; que cada literal está
 * mesmo no campo que cita, numa origem que a pergunta declara ou num campo selado da linha da própria medida; e que
 * cada origem declarada apoia um pedaço. A K16 confere o mesmo, na construção, sobre o ficheiro escrito.
 *
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/p4-2026-10-02/auditoria-das-perguntas-p4.mjs            (confere e escreve)
 *   node design/especime-v3/medicoes/p4-2026-10-02/auditoria-das-perguntas-p4.mjs --confere  (só confere o ficheiro)
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
const REGIMES = '"OWN_L":"Owner, with mortgage or loan","OWN_NL":"Owner, no outstanding mortgage or housing loan","RENT_MKT":"Tenant, rent at market price","RENT_FR":"Tenant, rent at reduced price or free"';

const PERGUNTAS = [
  {
    id: 'disparidade-de-emprego-entre-sexos-2025',
    mudanca: 'P4 (02.10.2026, item 3 do brief P4): os pontos percentuais dizem-se pela conta que a definição do Eurostat escreve, a diferença entre as duas percentagens (as taxas de emprego, que a linha mede em percentagem da população), e o termo fica entre parênteses, como na pergunta da taxa de atividade.',
    pedacos: [
      pedaco('Qual é a diferença entre a taxa de emprego dos homens ', 'What is the difference between the employment rate of men ',
        o('eurostat-tesem060-descricao', 'defined as the difference between the employment rates'),
        o('eurostat-tesem060-descricao', 'the employment rates of men and women')),
      pedaco('dos 20 aos 64 anos ', 'aged 20 to 64 ', o('eurostat-tesem060-descricao', 'men and women aged 20-64')),
      pedaco('e a das mulheres, ', 'and that of women, ', o('eurostat-tesem060-descricao', 'employment rates of men and women')),
      pedaco('contada como a diferença entre as duas percentagens ', 'counted as the difference between the two percentages ',
        o('eurostat-tesem060-descricao', 'the difference between the employment rates'),
        l('excerpt', 'Percentage of total population')),
      pedaco('(em pontos percentuais)?', '(in percentage points)?', o('ce-swd-2026-222-disparidade-de-emprego', '(percentage points, population aged 20-64')),
    ],
  },
  {
    id: 'sobrecarga-do-custo-da-habitacao-2025',
    mudanca: 'P4 (02.10.2026, item 3 do brief P4): os regimes de ocupação dizem-se pelas categorias da resposta do Eurostat (casa própria com ou sem crédito, arrendada a preço de mercado ou a renda reduzida ou gratuita), com as palavras que a leitura do mesmo cartão já usa, e o termo fica entre parênteses; o resto da pergunta não muda.',
    pedacos: [
      pedaco('Que parte das pessoas, ', 'What share of people, ', o('eurostat-tespm140-populacao', 'Percentage of the population living in a household')),
      pedaco('em casa própria com ou sem crédito ou arrendada a preço de mercado ou a renda reduzida ou gratuita ',
        'whether their home is owned with or without a mortgage or rented at market price or at a reduced rent or free ',
        o('eurostat-tessi164-regimes', REGIMES)),
      pedaco('(todos os regimes de ocupação), ', '(all tenure statuses), ',
        o('eurostat-tessi164-regimes', 'by tenure status', 'documento'),
        o('eurostat-tespm140-populacao', 'Percentage of the population living in a household')),
      pedaco('vive em agregados onde o custo total da habitação, ', 'are in households where total housing costs, ',
        o('glossario-sobrecarga', 'population living in households where the total housing costs')),
      pedaco('descontados os apoios à habitação, ', 'after deducting housing allowances, ', o('glossario-sobrecarga', "total housing costs ('net' of housing allowances)")),
      pedaco('leva mais de 40 % do que o agregado recebe do trabalho, de investimentos e de prestações sociais, ', 'take more than 40 % of what the household receives from work, investment and social benefits, ',
        o('glossario-sobrecarga', 'represent more than 40 % of disposable income'),
        o('eurostat-glossario-rendimento-disponivel', 'all monetary incomes received from any source by each member of a household are added up; these include income from work, investment and social benefits')),
      pedaco('depois de pagos os impostos e as contribuições sociais ', 'after paying taxes and social contributions ',
        o('eurostat-glossario-rendimento-disponivel', 'taxes and social contributions that have been paid, are deducted from this sum')),
      pedaco('(o rendimento disponível), ', '(disposable income), ', o('glossario-sobrecarga', 'of disposable income')),
      pedaco('também descontados os apoios à habitação?', 'also after deducting housing allowances?', o('glossario-sobrecarga', "disposable income ('net' of housing allowances)")),
    ],
  },
];

const LEITURA = {
  quem: 'Claude Opus 5.5',
  quando: '2026-10-02',
  o_que:
    'o P4, item 3 do brief: os pontos percentuais na pergunta da diferença de emprego entre sexos e os regimes de ocupação na da sobrecarga do custo da habitação no total, explicados em palavras comuns pela forma única, pedaço a pedaço. Escrito por design/especime-v3/medicoes/p4-2026-10-02/auditoria-das-perguntas-p4.mjs',
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
const ids = new Set(PERGUNTAS.map((q) => q.id));
if (so) {
  for (const e of entradas) {
    const noFicheiro = auditoria.perguntas.find((q) => q.id === e?.id && !q.forma);
    if (JSON.stringify(noFicheiro) !== JSON.stringify(e)) erros.push(`${e?.id}: a entrada no ficheiro não é a que este guião escreve`);
  }
  if (!auditoria.leituras.some((x) => JSON.stringify(x) === JSON.stringify(LEITURA))) erros.push('falta a leitura do P4 no registo das leituras');
} else if (!erros.length) {
  /* As duas entradas substituem as antigas no mesmo lugar da lista. */
  auditoria.perguntas = auditoria.perguntas.map((q) => (ids.has(q.id) && !q.forma ? entradas.find((e) => e.id === q.id) : q));
  if (!auditoria.leituras.some((x) => JSON.stringify(x) === JSON.stringify(LEITURA))) auditoria.leituras.push(LEITURA);
  fs.writeFileSync(FICHEIRO, JSON.stringify(auditoria, null, 2) + '\n');
}
if (erros.length) {
  for (const e of erros) console.error(`  ${e}`);
  process.exit(1);
}
const pedacos = entradas.reduce((n, e) => n + e.pedacos.length, 0);
const apoios = entradas.reduce((n, e) => n + e.pedacos.reduce((m, p) => m + p.apoios.length, 0), 0);
console.log(`P4: ${entradas.length} perguntas auditadas, ${pedacos} pedaços, ${apoios} apoios${so ? ' (só conferido)' : ' (escritas)'}.`);
