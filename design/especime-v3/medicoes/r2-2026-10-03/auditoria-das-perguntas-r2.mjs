/** R2 (03.10.2026, os achados 5, 6, 12, 18 e 24 da auditoria dos rótulos, aceites na dobra): a auditoria das sete
 * perguntas que o bloco acrescenta, pedaço a pedaço (a K16 do `check:cartao`).
 *
 * Os sete cartões rendiam-se sem pergunta: nas páginas de assunto a dobra tinha só a metade da leitura que diz o que o
 * número é, e nas páginas das áreas, onde o cartão não leva leitura, não tinha dobra. A triagem mandou a dobra dizer o
 * que o nome deixa de fora (a creche fora da família, o continente e os Açores, os volumes encadeados, o ganho por hora
 * em percentagem do dos homens, os motivos dos cuidados por satisfazer, o «muito boa ou razoavelmente boa» da justiça,
 * o tempo completo e o antes de descontos do ganho), pela forma única das definições (§1.152). Cada pedaço apoia-se num
 * literal de uma origem que já estava selada (as das leituras do L1 e do RP1) ou num campo selado da linha da própria
 * medida.
 *
 * Antes de escrever, confere: que os pedaços juntos são a pergunta declarada nas duas edições; que cada literal está
 * mesmo no campo que cita, numa origem que a pergunta declara ou num campo selado da linha da própria medida; e que
 * cada origem declarada apoia um pedaço. A K16 confere o mesmo, na construção, sobre o ficheiro escrito.
 *
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/r2-2026-10-03/auditoria-das-perguntas-r2.mjs            (confere e escreve)
 *   node design/especime-v3/medicoes/r2-2026-10-03/auditoria-das-perguntas-r2.mjs --confere  (só confere o ficheiro)
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
    id: 'criancas-em-creche-2025',
    mudanca: 'R2 (03.10.2026, achado 5): a pergunta nova diz que o cuidado é fora da família e o que são os cuidados formais, com o termo da fonte entre parênteses.',
    pedacos: [
      pedaco('Que parte das crianças com menos de três anos ', 'What share of children under three ',
        o('eurostat-tepsr_sp210-descricao', 'the percentage of children (under 3 years old)'),
        l('excerpt', 'Children aged less than 3 years')),
      pedaco('é cuidada fora da família, ', 'are cared for outside the family, ',
        o('eurostat-tepsr_sp210-descricao', 'cared for by formal arrangements other than by the family')),
      pedaco('num programa planeado por entidades públicas ou privadas reconhecidas ', 'in a programme planned by public or recognised private bodies ',
        o('eurostat-cuidado-formal', 'planned through public organizations and recognized private bodies')),
      pedaco('(os cuidados formais para a infância)?', '(formal childcare)?',
        o('eurostat-cuidado-formal', 'Formal childcare is a formal education programme'),
        l('document.title', 'formal childcare')),
    ],
  },
  {
    id: 'retribuicao-minima-mensal-garantida-continente-2026',
    mudanca: 'R2 (03.10.2026, achado 6): a pergunta nova diz que o valor é o do continente e que os Açores lhe somam um acréscimo; a Madeira fica de fora, porque nenhuma origem declarada a diz ([verify] no relatório do bloco).',
    pedacos: [
      pedaco('Qual é o valor mínimo que a lei garante por mês a quem trabalha por conta de outrem ', 'What is the lowest monthly pay the law guarantees to employees ',
        o('dre-dlr-37-2023-a', 'O montante da retribuição mínima mensal garantida, estabelecido ao nível nacional para os trabalhadores por conta de outrem')),
      pedaco('no continente, ', 'on the mainland, ',
        o('dl-139-2025-ambito', 'O presente decreto-lei é aplicável a todo o território continental')),
      pedaco('sem o acréscimo que a lei dos Açores lhe soma ', 'without the increase that Azores law adds to it ',
        o('dre-dlr-37-2023-a', 'tem, na Região Autónoma dos Açores, o acréscimo de 5 %')),
      pedaco('(a retribuição mínima mensal garantida)?', '(the guaranteed minimum monthly wage)?',
        o('dre-dlr-37-2023-a', 'O montante da retribuição mínima mensal garantida'),
        l('excerpt', 'O valor da RMMG')),
    ],
  },
  {
    id: 'pib-real-per-capita-2025',
    mudanca: 'R2 (03.10.2026, achado 12): a unidade do cartão passou a «euros por pessoa, a preços de 2015», e a pergunta nova guarda o termo da fonte, «volumes encadeados».',
    pedacos: [
      pedaco('Quanto valem, por pessoa, os bens e serviços finais que a economia produz num ano, ', 'How much are the final goods and services the economy produces in a year worth per person, ',
        o('eurostat-tipsna40-descricao', 'GDP measures the value of total final output of goods and services produced by an economy'),
        o('eurostat-tipsna40-descricao', 'the ratio of real gross domestic product to the average population of a specific year')),
      pedaco('descontada a subida dos preços ', 'leaving out price rises ',
        o('eurostat-nama10-volumes', 'Volume figures show the development of aggregates excluding inflation')),
      pedaco('(o PIB real por habitante, em volumes encadeados)?', '(real GDP per capita, in chain linked volumes)?',
        l('excerpt', 'Real GDP per capita — Chain linked volumes (2015), euro per capita'),
        o('eurostat-nama10-volumes', 'presented as chain linked volumes')),
    ],
  },
  {
    id: 'disparidade-salarial-entre-sexos-2024',
    mudanca: 'R2 (03.10.2026, achado 18): a pergunta nova diz a regra da contagem, o ganho bruto por hora em percentagem do dos homens, nas empresas com dez ou mais trabalhadores.',
    pedacos: [
      pedaco('Quanto menos ganham as mulheres do que os homens por hora de trabalho, antes de descontos, ', 'How much less do women earn than men per hour of work, before deductions, ',
        o('eurostat-earn-grgpg2-definicao', 'the difference between average gross hourly earnings of male paid employees and of female paid employees')),
      pedaco('em percentagem do ganho dos homens, ', 'as a percentage of men’s earnings, ',
        o('eurostat-earn-grgpg2-definicao', 'as a percentage of average gross hourly earnings of male paid employees')),
      pedaco('nas empresas com 10 ou mais trabalhadores ', 'in enterprises with 10 or more employees ',
        o('eurostat-earn-grgpg2-cobertura', 'only enterprises with 10 employees or more')),
      pedaco('(a disparidade salarial não ajustada)?', '(the unadjusted gender pay gap)?',
        o('eurostat-earn-grgpg2-definicao', 'The unadjusted gender pay gap (GPG)')),
    ],
  },
  {
    id: 'necessidades-medicas-nao-satisfeitas-2025',
    mudanca: 'R2 (03.10.2026, achado 18): a pergunta nova diz a regra da contagem, quem diz ter ficado sem cuidados médicos por custo, espera ou distância.',
    pedacos: [
      pedaco('Que parte das pessoas diz ter precisado de um exame ou tratamento médico ', 'What share of people say they needed a medical examination or treatment ',
        o('eurostat-tespm110-descricao', 'a person’s own assessment of whether he or she needed examination or treatment')),
      pedaco('e não o ter tido ', 'and did not get it ',
        o('eurostat-tespm110-descricao', 'but did not have it or did not seek it')),
      pedaco('por razões financeiras, por estar em lista de espera ou por ficar longe ', 'because of the cost, a waiting list or the distance ',
        o('eurostat-tespm110-descricao', '‘Financial reasons’, ‘Waiting list’ and ‘Too far to travel’')),
      pedaco('(as necessidades de cuidados médicos por satisfazer, declaradas pela própria pessoa)?', '(self-reported unmet needs for medical care)?',
        o('eurostat-tespm110-descricao', 'Self-reported unmet needs for medical care')),
    ],
  },
  {
    id: 'independencia-da-justica-2025',
    mudanca: 'R2 (03.10.2026, achado 18): a pergunta nova diz a regra da contagem, quem considera muito boa ou razoavelmente boa a independência dos tribunais e dos juízes.',
    pedacos: [
      pedaco('Que parte das pessoas inquiridas ', 'What share of respondents ',
        o('eurostat-sdg_16_40-descricao', 'explore respondents’ perceptions about the independence of the judiciary')),
      pedaco('considera muito boa ou razoavelmente boa a independência dos tribunais e dos juízes ', 'rate the independence of the courts and judges as very good or fairly good ',
        o('eurostat-sdg_16_40-nivel', 'Very good or fairly good'),
        o('eurostat-sdg_16_40-descricao', 'the perceived independence of the courts and judges')),
      pedaco('(a perceção da independência da justiça)?', '(perceived independence of the justice system)?',
        l('document.title', 'Perceived independence of the justice system')),
    ],
  },
  {
    id: 'ganho-medio-mensal-2024',
    mudanca: 'R2 (03.10.2026, achado 24): a pergunta nova diz a população e o que entra no ganho, os trabalhadores por conta de outrem a tempo completo com remuneração completa, antes de descontos.',
    pedacos: [
      pedaco('Quanto ganham por mês, em média e antes de descontos, os trabalhadores por conta de outrem a tempo completo com remuneração completa ',
        'How much do full-time employees on full pay earn per month, on average and before deductions ',
        o('ine-ganho-conceito', 'Montante ilíquido em dinheiro e/ou géneros pago ao trabalhador com caráter regular'),
        o('ine-ganho-nota', 'trabalhadores por conta de outrem a tempo completo com remuneração completa'),
        l('document.title', 'Ganho médio mensal')),
      pedaco('(o ganho médio mensal)?', '(average monthly earnings)?',
        l('document.title', 'Ganho médio mensal')),
    ],
  },
];

const LEITURA = {
  quem: 'Claude Opus 5.5',
  quando: '2026-10-03',
  o_que:
    'o R2, os achados 5, 6, 12, 18 e 24 da auditoria dos rótulos, aceites na dobra: sete perguntas novas para cartões que se rendiam sem pergunta, pela forma única, pedaço a pedaço. Escrito por design/especime-v3/medicoes/r2-2026-10-03/auditoria-das-perguntas-r2.mjs',
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
  if (!auditoria.leituras.some((x) => JSON.stringify(x) === JSON.stringify(LEITURA))) erros.push('falta a leitura do R2 no registo das leituras');
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
console.log(`R2: ${entradas.length} perguntas auditadas, ${pedacos} pedaços, ${apoios} apoios${so ? ' (só conferido)' : ' (escritas)'}.`);
