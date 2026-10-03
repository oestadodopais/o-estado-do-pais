/** R2 (03.10.2026): o inventário das frases (`design/especime-v3/INVENTARIO-FRASES.md`) com as frases que o bloco mudou.
 *
 * Três operações, e só estas:
 *   1. RETIRAR: as linhas vivas cujo texto deixou de se render (as notas antigas das medidas dos concelhos, as formas do
 *      estado sem o dono, a comparação com a base do índice sem a média, a legenda e o cabeçalho do mapa da dívida com a
 *      unidade de antes) passam a «retirada», com a razão escrita;
 *   2. APAGAR: as três formas curtas do estado («fora do valor de referência», «dentro do valor de referência», «dentro
 *      dos valores de referência») continuam DENTRO das formas novas («… da Comissão») e das etiquetas da prova, e uma
 *      linha retirada que volta dentro de outra frase fecha a construção (a célula 7 do `check:voz`); a saída
 *      documentada é apagá-las do ficheiro (o mapa do repositório, §4, e a armadilha das frases retiradas);
 *   3. ACRESCENTAR: a secção do bloco R2, com as linhas novas tal como a régua da voz as lê (os pedaços com marca de
 *      língua separados por espaços, como ela os junta).
 *
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/r2-2026-10-03/inventario-frases-r2.mjs [--confere]
 * Sai 0 quando o ficheiro fica (ou está) como este guião o escreve; 1 com a lista do que não bate.
 */
import fs from 'node:fs';

const FICHEIRO = 'design/especime-v3/INVENTARIO-FRASES.md';
const so = process.argv.includes('--confere');

const RAZAO_NOTA = 'Bloco R2 (03.10.2026, achados 2, 23 e 26 da auditoria dos rótulos): a nota da medida do concelho passa a dizer o que se conta, com o termo da fonte entre parênteses; a forma nova está na secção do bloco r2.';
const RAZAO_ESTADO = 'Bloco R2 (03.10.2026, achado 20 da auditoria dos rótulos): o estado diz quem fixa a referência, inteiro, pela tabela `estado.doDono` de `strings.mjs` (a Comissão, o limite do Pacto de Estabilidade, a trajetória aprovada pelo Conselho da UE); as formas novas estão na secção do bloco r2.';
const RAZAO_BASE = 'Bloco R2 (03.10.2026, achado 22 da auditoria dos rótulos): a comparação com a base do índice diz a média de Portugal e a base, «Está acima da média de Portugal (100).»; o bloco tem agora uma marca de origem e a régua lê só as palavras do lado, que estão na secção do bloco r2.';
const RAZAO_MAPA = 'Bloco R2 (03.10.2026, achado 3 da auditoria dos rótulos): a unidade do índice de dívida passa a «% da receita média dos três anos anteriores»; a legenda e o cabeçalho novos estão na secção do bloco r2.';

const RETIRAR = [
  ['Estimativa anual do INE para o concelho.', RAZAO_NOTA],
  ['Inscritos no fim do mês nos serviços de emprego, ficheiro mensal por concelho.', RAZAO_NOTA],
  ['Registered with the employment service at month end, monthly file by municipality.', RAZAO_NOTA],
  ['The statistics institute’s annual estimate for the municipality.', RAZAO_NOTA],
  ['Sistema de contas integradas das empresas; cada empresa conta num único concelho.', RAZAO_NOTA],
  ['Integrated business accounts; each enterprise counts in a single municipality.', RAZAO_NOTA],
  ['Dias que a câmara demora a pagar aos fornecedores, pela lista anual da Direção-Geral das Autarquias Locais.', RAZAO_NOTA],
  ['Days the council takes to pay its suppliers, from the annual list of the Directorate-General for Local Authorities.', RAZAO_NOTA],
  ['O que a câmara deve no fim do ano, pela série anual da Direção-Geral das Autarquias Locais.', RAZAO_NOTA],
  ['What the council owes at the end of the year, from the annual series of the Directorate-General for Local Authorities.', RAZAO_NOTA],
  ['outside the reference value', RAZAO_ESTADO],
  ['within the reference value', RAZAO_ESTADO],
  ['within the reference values', RAZAO_ESTADO],
  [': União Europeia : fora do valor de referência (acima de %)', RAZAO_ESTADO],
  [': European Union : outside the reference value (above %)', RAZAO_ESTADO],
  [': dentro do valor de referência (acima de − %)', RAZAO_ESTADO],
  [': dentro do valor de referência do Pacto (acima de − %)', RAZAO_ESTADO],
  [': fora do valor de referência do Conselho da UE (acima de %)', RAZAO_ESTADO],
  [': within the reference value (above − %)', RAZAO_ESTADO],
  [': within the reference value of the Pact (above − %)', RAZAO_ESTADO],
  [': outside the reference value of the Council of the EU (above %)', RAZAO_ESTADO],
  ['dentro do valor de referência do Pacto', RAZAO_ESTADO],
  ['fora do valor de referência do Conselho da UE', RAZAO_ESTADO],
  ['within the reference value of the Pact', RAZAO_ESTADO],
  ['outside the reference value of the Council of the EU', RAZAO_ESTADO],
  ['Está abaixo de Portugal , que é a base do índice.', RAZAO_BASE],
  ['Está acima de Portugal , que é a base do índice.', RAZAO_BASE],
  ['It is below Portugal , which is the base of the index.', RAZAO_BASE],
  ['It is above Portugal , which is the base of the index.', RAZAO_BASE],
  ['% da receita média de três anos · o limite legal é %', RAZAO_MAPA],
  ['% of the three-year average revenue · the legal limit is %', RAZAO_MAPA],
  ['Valor ( % da receita média de três anos ; o limite legal é % )', RAZAO_MAPA],
  ['Value ( % of the three-year average revenue ; the legal limit is % )', RAZAO_MAPA],
];

const APAGAR = ['fora do valor de referência', 'dentro do valor de referência', 'dentro dos valores de referência'];

const NOVAS = [
  ['Estima quantas pessoas vivem no concelho (população residente), pela estimativa anual do INE.', 'A dobra do cartão da população residente em cada página de concelho (achado 23): diz o que se conta, com o termo da fonte entre parênteses. A célula do inventário dos rótulos (`scripts/inventario-rotulos.mjs`) confere-a contra a nota declarada da medida.'],
  ['Estimates how many people have their home in the municipality (resident population), from the statistics institute’s annual estimate.', 'A mesma dobra na edição inglesa; «have their home», e não «live», que é uma frase retirada deste inventário.'],
  ['Conta as pessoas desempregadas inscritas nos serviços de emprego no fim do mês (desemprego registado).', 'A dobra do cartão do desemprego registado em cada página de concelho (achado 23).'],
  ['Counts the unemployed people registered with the employment service at month end (registered unemployment).', 'A mesma dobra na edição inglesa.'],
  ['Conta as empresas não financeiras atribuídas ao concelho (sistema de contas integradas das empresas).', 'A dobra do cartão das empresas em cada página de concelho (achado 23).'],
  ['Counts the non-financial enterprises attributed to the municipality (integrated business accounts system).', 'A mesma dobra na edição inglesa.'],
  ['A dívida da câmara que conta para o limite legal no fim do ano (a «dívida total» da DGAL, sem as dívidas não orçamentais e as exceções da lei).', 'A dobra do cartão da dívida total em cada página de concelho (achado 2, Blocking, aceite na dobra): a coluna é a que conta para o limite legal, como o localizador de cada linha diz.'],
  ['The council’s debt that counts towards the legal limit at year end (DGAL’s “ dívida total ”, without non-budget debts and the exceptions in the law).', 'A mesma dobra na edição inglesa, com o termo da DGAL em português e a marca da língua (os espaços à volta do termo são os da régua da voz, que junta os pedaços).'],
  ['O número médio de dias que a câmara demora a pagar aos fornecedores (prazo médio de pagamento), pela lista anual da DGAL.', 'A dobra do cartão do prazo médio de pagamento em cada página de concelho (achado 26), com o termo do título da lista da DGAL, no singular.'],
  ['The average number of days the council takes to pay its suppliers (DGAL’s “ prazo médio de pagamento ”, from its annual list).', 'A mesma dobra na edição inglesa, com o termo da DGAL em português e a marca da língua; «average payment time» é uma frase retirada deste inventário.'],
  ['abaixo da média de Portugal', 'A palavra do lado na comparação do poder de compra com a média de Portugal, que é a base do índice (achado 22): «Está abaixo da média de Portugal (100).»; o resto da frase leva a marca da base, que a célula FC confere contra a unidade da linha.'],
  ['acima da média de Portugal', 'A mesma palavra, quando o índice do concelho passa a base.'],
  ['below Portugal’s average', 'A mesma palavra na edição inglesa.'],
  ['above Portugal’s average', 'A mesma palavra na edição inglesa, quando o índice passa a base.'],
  ['fora do valor de referência da Comissão', 'O estado de um cartão contra o valor de referência do painel da Comissão (achado 20): diz quem o fixa. A K15 escolhe o lado pelas contas, e a régua do inventário dos rótulos confere que a forma é a do dono declarado.'],
  ['dentro do valor de referência da Comissão', 'A mesma forma, dentro do valor de referência.'],
  ['dentro dos valores de referência da Comissão', 'A mesma forma, numa banda de dois lados (o saldo da balança corrente, a taxa de câmbio efetiva real).'],
  ['outside the Commission’s reference value', 'A mesma forma na edição inglesa.'],
  ['within the Commission’s reference value', 'A mesma forma na edição inglesa.'],
  ['within the Commission’s reference values', 'A mesma forma na edição inglesa, numa banda.'],
  ['dentro do limite do Pacto de Estabilidade', 'O estado do saldo das contas públicas contra o limite do défice do Pacto de Estabilidade (achado 20).'],
  ['within the Stability Pact limit', 'A mesma forma na edição inglesa.'],
  ['fora da trajetória da despesa aprovada pelo Conselho da UE', 'O estado do crescimento da despesa líquida contra a trajetória que o Conselho da UE aprovou (achado 20).'],
  ['outside the expenditure path approved by the Council of the EU', 'A mesma forma na edição inglesa.'],
  ['Que parte das crianças com menos de três anos é cuidada fora da família, num programa planeado por entidades públicas ou privadas reconhecidas (os cuidados formais para a infância)?', 'A pergunta nova do cartão das crianças com menos de três anos (achado 5), pela forma única; cada pedaço tem o apoio que a K16 confere em tests/cartao/perguntas-provadas.json.'],
  ['What share of children under three are cared for outside the family, in a programme planned by public or recognised private bodies (formal childcare)?', 'A mesma pergunta na edição inglesa.'],
  ['Qual é o valor mínimo que a lei garante por mês a quem trabalha por conta de outrem no continente, sem o acréscimo que a lei dos Açores lhe soma (a retribuição mínima mensal garantida)?', 'A pergunta nova do cartão do salário mínimo (achado 6), pela forma única; «garante» é a palavra da lei e não a casa a falar de si.'],
  ['What is the lowest monthly pay the law guarantees to employees on the mainland, without the increase that Azores law adds to it (the guaranteed minimum monthly wage)?', 'A mesma pergunta na edição inglesa; «guarantees» é a palavra da lei.'],
  ['Quanto valem, por pessoa, os bens e serviços finais que a economia produz num ano, descontada a subida dos preços (o PIB real por habitante, em volumes encadeados)?', 'A pergunta nova do cartão do PIB real por habitante (achado 12), que guarda o termo da fonte, «volumes encadeados».'],
  ['How much are the final goods and services the economy produces in a year worth per person, leaving out price rises (real GDP per capita, in chain linked volumes)?', 'A mesma pergunta na edição inglesa.'],
  ['Que parte das pessoas diz ter precisado de um exame ou tratamento médico e não o ter tido por razões financeiras, por estar em lista de espera ou por ficar longe (as necessidades de cuidados médicos por satisfazer, declaradas pela própria pessoa)?', 'A pergunta nova do cartão das necessidades de cuidados médicos por satisfazer (achado 18), com a regra da contagem.'],
  ['What share of people say they needed a medical examination or treatment and did not get it because of the cost, a waiting list or the distance (self-reported unmet needs for medical care)?', 'A mesma pergunta na edição inglesa.'],
  ['Que parte das pessoas inquiridas considera muito boa ou razoavelmente boa a independência dos tribunais e dos juízes (a perceção da independência da justiça)?', 'A pergunta nova do cartão da perceção da independência da justiça (achado 18); «independência» é a palavra da fonte e não a casa a falar de si.'],
  ['What share of respondents rate the independence of the courts and judges as very good or fairly good (perceived independence of the justice system)?', 'A mesma pergunta na edição inglesa; «independence» é a palavra da fonte.'],
  ['Quanto ganham por mês, em média e antes de descontos, os trabalhadores por conta de outrem a tempo completo com remuneração completa (o ganho médio mensal)?', 'A pergunta nova do cartão do ganho médio mensal do país (achado 24); «completo» e «completa» são as palavras do INE e não a casa a falar de si.'],
  ['How much do full-time employees on full pay earn per month, on average and before deductions (average monthly earnings)?', 'A mesma pergunta na edição inglesa.'],
  ['% da receita média dos três anos anteriores · o limite legal é %', 'A legenda do mapa da dívida em «Lugares» com a unidade do cartão do índice de dívida (achado 3) e o teto, que a régua da voz lê sem o 150.'],
  ['% of the average revenue of the previous three years · the legal limit is %', 'A mesma legenda na edição inglesa.'],
  ['Valor ( % da receita média dos três anos anteriores ; o limite legal é % )', 'O cabeçalho da coluna dos valores na tabela do mapa da dívida, com a unidade e o teto do cartão.'],
  ['Value ( % of the average revenue of the previous three years ; the legal limit is % )', 'O mesmo cabeçalho na edição inglesa.'],
];

const SECCAO = `## R2 · os rótulos do sítio, 03.10.2026

*O bloco R2, pela auditoria dos rótulos de 03.10.2026 e pela triagem do lugar de direção
(\`design/especime-v3/critica/AUDITORIA-R2-rotulos-2026-10-03.md\`): as notas das medidas dos concelhos dizem o que se conta,
o estado diz quem fixa o valor de referência, a comparação com a base do índice diz a média de Portugal, as perguntas novas
de sete cartões, e a legenda do mapa da dívida com a unidade nova. As unidades dos cartões não entram aqui: são dados
declarados (\`src/data/unidades-dos-cartoes.mjs\`) que o portão de HTML confere pela marca \`data-unidade-da-casa\`. As frases
da faixa do concelho com o nome, o valor e o lugar levam marcas de origem e a régua salta-as nas páginas de concelho; a
célula FC recompõe-nas e a régua do inventário dos rótulos confere a forma. A pergunta da disparidade salarial leva um
algarismo declarado e a régua salta-a nas rotas onde ela se rende. Escrito por
\`design/especime-v3/medicoes/r2-2026-10-03/inventario-frases-r2.mjs\`.*

| classe | texto | bloco | estado | razão |
|---|---|---|---|---|
${NOVAS.map(([texto, razao]) => `| conteudo | ${texto} | r2 | viva | ${razao} |`).join('\n')}
`;

const erros = [];
let linhas = fs.readFileSync(FICHEIRO, 'utf8').split('\n');
const celulas = (l) => l.split(' | ').map((x) => x.trim());
const daLinha = (l) => (l.startsWith('| conteudo | ') || l.startsWith('| navegacao | ') ? celulas(l)[1] : null);

for (const texto of APAGAR) {
  const i = linhas.filter((l) => daLinha(l) === texto);
  if (so) { if (i.length) erros.push(`ainda está no ficheiro, e devia ter sido apagada: «${texto}»`); continue; }
  if (i.length > 1) erros.push(`«${texto}» está ${i.length} vezes`);
  linhas = linhas.filter((l) => daLinha(l) !== texto);
}
for (const [texto, razao] of RETIRAR) {
  const idx = linhas.map((l, k) => (daLinha(l) === texto ? k : -1)).filter((k) => k >= 0);
  if (idx.length !== 1) { erros.push(`«${texto}» está ${idx.length} vezes no ficheiro (esperava uma)`); continue; }
  const c = linhas[idx[0]].split(' | ');
  if (so) { if (c[3] !== 'retirada') erros.push(`«${texto}» não está retirada`); continue; }
  c[3] = 'retirada';
  c[4] = `${razao} |`;
  linhas[idx[0]] = c.slice(0, 5).join(' | ');
}
let texto = linhas.join('\n');
if (so) {
  if (!texto.includes(SECCAO.trim())) erros.push('a secção do bloco R2 não está no ficheiro, ou não é a que este guião escreve');
} else if (!texto.includes('## R2 · os rótulos do sítio, 03.10.2026')) {
  texto = `${texto.replace(/\n+$/, '')}\n\n${SECCAO}`;
}
if (erros.length) { for (const e of erros) console.error(`  ${e}`); process.exit(1); }
if (!so) fs.writeFileSync(FICHEIRO, texto);
console.log(`R2: o inventário das frases ${so ? 'conferido' : 'escrito'}: ${RETIRAR.length} linhas retiradas, ${APAGAR.length} apagadas, ${NOVAS.length} novas.`);
