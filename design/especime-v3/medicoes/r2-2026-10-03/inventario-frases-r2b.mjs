/** R2-b (04.10.2026): o inventário das frases (`design/especime-v3/INVENTARIO-FRASES.md`) com as frases que a passagem de
 * correção mudou.
 *
 * Três operações, e só estas:
 *   1. RETIRAR: as linhas vivas cujo texto deixou de se render (a ressalva do recibo do salário mínimo que dizia que os
 *      diplomas regionais não tinham sido lidos, a pergunta da quota das exportações de antes, a dobra da dívida dos
 *      concelhos sem o fundo de apoio municipal) passam a «retirada», com a razão escrita;
 *   2. APAGAR: a palavra «Fundo», retirada com a peça 2 do B1 (um rótulo das contas do município), vive agora dentro do
 *      nome próprio do Fundo de Apoio Municipal, na dobra inglesa da dívida, e uma linha retirada que volta dentro de outra
 *      frase fecha a construção (a célula 7 do `check:voz`); a saída documentada é apagá-la do ficheiro, como o R2 fez às
 *      três formas curtas do estado (o mapa do repositório, a armadilha das frases retiradas);
 *   3. ACRESCENTAR: a secção da passagem R2-b, com as linhas novas tal como a régua da voz as lê.
 *
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/r2-2026-10-03/inventario-frases-r2b.mjs [--confere]
 * Sai 0 quando o ficheiro fica (ou está) como este guião o escreve; 1 com a lista do que não bate.
 */
import fs from 'node:fs';

const FICHEIRO = 'design/especime-v3/INVENTARIO-FRASES.md';
const so = process.argv.includes('--confere');

const RAZAO_RESSALVA = 'Passagem R2-b (04.10.2026, a decisão do lugar de direção): a ressalva dizia que os diplomas regionais não tinham sido lidos, e o recibo da mesma linha rende o diploma dos Açores como origem da pergunta, lido a 24.09.2026; a ressalva compõe-se agora da lista dos diplomas regionais (`DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO`), e a forma nova está na secção da passagem r2b.';
const RAZAO_EXPORTACOES = 'Passagem R2-b (04.10.2026, o achado 4 da auditoria dos rótulos, pela decisão do lugar de direção): a pergunta da quota das exportações diz o que são as economias avançadas pelo termo da fonte; a forma nova está na secção da passagem r2b.';
const RAZAO_DIVIDA = 'Passagem R2-b (04.10.2026, a decisão do lugar de direção): a dobra da dívida dos concelhos diz também a contribuição para o Fundo de Apoio Municipal, que a coluna da DGAL exclui; a forma nova está na secção da passagem r2b.';

const RETIRAR = [
  ['Este valor é o do território continental. Os Açores e a Madeira fixam o seu por diploma regional próprio, que não foi lido: [a verificar] · um campo não confirmado contra a fonte, e não uma dúvida sobre o que está publicado .', RAZAO_RESSALVA],
  ['This value is for mainland Portugal. The Azores and Madeira set their own value by separate regional decree, which has not been read: [a verificar] (to verify) · a field not confirmed against the source, not a doubt about what is published .', RAZAO_RESSALVA],
  ['Quanto mudou em três anos a parte que as exportações de bens e serviços do país têm no total das exportações dos países da Organização para a Cooperação e Desenvolvimento Económico (OCDE) e dos países da União que não são da OCDE (o desempenho das exportações face às economias avançadas)?', RAZAO_EXPORTACOES],
  ['How much has the part that the country’s exports of goods and services make up of the total exports of the countries of the Organisation for Economic Cooperation and Development (OECD) and of EU countries outside the OECD changed over three years (export performance against advanced economies)?', RAZAO_EXPORTACOES],
  ['A dívida da câmara que conta para o limite legal no fim do ano (a «dívida total» da DGAL, sem as dívidas não orçamentais e as exceções da lei).', RAZAO_DIVIDA],
  ['The council’s debt that counts towards the legal limit at year end (DGAL’s “ dívida total ”, without non-budget debts and the exceptions in the law).', RAZAO_DIVIDA],
];

const APAGAR = ['Fundo'];

const NOVAS = [
  ['A dívida da câmara que conta para o limite legal no fim do ano (a «dívida total» da DGAL, sem as dívidas não orçamentais, as exceções da lei e a contribuição para o Fundo de Apoio Municipal).', 'A dobra do cartão da dívida total em cada página de concelho: diz também o fundo de apoio municipal, que a coluna da DGAL exclui (o localizador de cada linha e o quadro da DGAL, transcrito no inventário das fontes).'],
  ['The council’s debt that counts towards the legal limit at year end (DGAL’s “ dívida total ”, without non-budget debts, the exceptions in the law and the contribution to the municipal support fund, the “ Fundo de Apoio Municipal ”).', 'A mesma dobra na edição inglesa, com o termo da DGAL e o nome do fundo em português e a marca da língua.'],
  ['Quanto mudou em três anos a parte que as exportações de bens e serviços do país têm no total das exportações dos países da Organização para a Cooperação e Desenvolvimento Económico (OCDE) e dos países da União que não são da OCDE (as economias avançadas)?', 'A pergunta da quota das exportações (o achado 4 da auditoria dos rótulos): diz o que são as economias avançadas pelo termo da fonte, com a auditoria da K16.'],
  ['Over three years, how much has the part that the country’s exports of goods and services make up of the total exports of the countries of the Organisation for Economic Cooperation and Development (OECD) and of EU countries outside the OECD (the advanced economies) changed?', 'A mesma pergunta na edição inglesa, com os três anos à cabeça.'],
  ['O valor acrescentado bruto (VAB) é o valor do que se produz menos o valor dos bens e serviços consumidos para o produzir.', 'A explicação do termo na dobra do primeiro cartão que o usa numa página de área (`TERMOS_DOS_CARTOES`), lida contra o ponto 9.31 do SEC 2010.'],
  ['Gross value added is the value of what is produced minus the value of the goods and services used up in producing it.', 'A mesma explicação na edição inglesa.'],
  ['Reexpressa quer dizer apresentada de novo mais tarde: é a dívida do início do mandato como a apresenta um relatório de gestão posterior da câmara.', 'A explicação do termo na dobra do cartão da dívida do início do mandato, lida contra o documento e o excerto da linha.'],
  ['Restated means presented again later: it is the debt at the start of the term as a later management report of the council presents it.', 'A mesma explicação na edição inglesa.'],
  ['O fator multiplica o montante da pensão: abaixo de um, a pensão baixa, e o que falta para chegar a um é a parte que se corta.', 'A explicação do termo na dobra do cartão do fator de sustentabilidade, lida contra o excerto da linha.'],
  ['The factor multiplies the amount of the pension: below one, the pension falls, and the gap to one is the share that is cut.', 'A mesma explicação na edição inglesa.'],
  ['Este valor é o do território continental. Nos Açores, a lei regional soma-lhe um acréscimo, e o diploma é uma das fontes da pergunta abaixo. Na Madeira, o valor é fixado por diploma regional próprio, que não é fonte de nenhuma linha deste livro: [a verificar] · um campo não confirmado contra a fonte, e não uma dúvida sobre o que está publicado .', 'A ressalva de alcance do recibo do salário mínimo, composta da lista dos diplomas regionais: diz o que foi lido (o diploma dos Açores, origem da pergunta) e o que não é fonte (o da Madeira, com o marcador).'],
  ['This value is for mainland Portugal. In the Azores, regional law adds an increase to it, and the decree is one of the sources of the question below. In Madeira, the value is set by a separate regional decree, which is not a source of any line in this ledger: [a verificar] (to verify) · a field not confirmed against the source, not a doubt about what is published .', 'A mesma ressalva na edição inglesa.'],
];

const SECCAO = `## R2-b · a passagem de correção dos rótulos, 04.10.2026

*A passagem de correção depois da leitura a frio do Sol, pelas decisões do lugar de direção
(\`design/especime-v3/critica/LEITURA-R2-2026-10-04.md\`): a pergunta da quota das exportações pela forma do excerto, as
explicações de três termos em palavras comuns (a quarta, a paridade do poder de compra, leva um algarismo declarado e a régua
salta-a nas rotas onde ela se rende), a dobra da dívida com o fundo de apoio municipal, e a ressalva do recibo do salário
mínimo composta da lista dos diplomas regionais. Os nomes de nível dos cartões de preços não entram aqui: são nomes declarados
(\`NOMES_COM_A_VARIACAO_NA_UNIDADE\`), com a marca \`data-nome="cartao"\`. Escrito por
\`design/especime-v3/medicoes/r2-2026-10-03/inventario-frases-r2b.mjs\`.*

| classe | texto | bloco | estado | razão |
|---|---|---|---|---|
${NOVAS.map(([texto, razao]) => `| conteudo | ${texto} | r2b | viva | ${razao} |`).join('\n')}
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
  /* A dobra da dívida de antes está viva no bloco r2; a nova está no bloco r2b: retira-se a do bloco r2. */
  /* Uma linha antiga tem o separador colado («viva |o …»): o estado lê-se pelo começo da célula. */
  const nossas = idx.filter((k) => /^viva\b/.test(celulas(linhas[k])[3] ?? '') || /^retirada\b/.test(celulas(linhas[k])[3] ?? ''));
  if (nossas.length !== 1) { erros.push(`«${texto.slice(0, 80)}» está ${nossas.length} vezes no ficheiro (esperava uma)`); continue; }
  const c = linhas[nossas[0]].split(' | ');
  if (so) { if (c[3] !== 'retirada') erros.push(`«${texto.slice(0, 80)}» não está retirada`); continue; }
  c[3] = 'retirada';
  c[4] = `${razao} |`;
  linhas[nossas[0]] = c.slice(0, 5).join(' | ');
}
let texto = linhas.join('\n');
if (so) {
  if (!texto.includes(SECCAO.trim())) erros.push('a secção da passagem R2-b não está no ficheiro, ou não é a que este guião escreve');
} else if (!texto.includes('## R2-b · a passagem de correção dos rótulos, 04.10.2026')) {
  texto = `${texto.replace(/\n+$/, '')}\n\n${SECCAO}`;
}
if (erros.length) { for (const e of erros) console.error(`  ${e}`); process.exit(1); }
if (!so) fs.writeFileSync(FICHEIRO, texto);
console.log(`R2-b: o inventário das frases ${so ? 'conferido' : 'escrito'}: ${RETIRAR.length} linhas retiradas, ${APAGAR.length} apagada, ${NOVAS.length} novas.`);
