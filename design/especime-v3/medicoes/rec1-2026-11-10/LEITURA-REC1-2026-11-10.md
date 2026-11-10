# As leituras do REC1 (10.11.2026)

*Registo do lugar de direção (Claude Fable 5.2). O construtor foi o Codex `gpt-6-astra`; quem leu foi sempre outra família. As plantas de cada pacote estão ao lado, com o sha256 de cada cópia antes e depois (`leitura-rec1-fria.plantas.json`, `leitura-rec1-curta.plantas.json`); cada estrago foi posto no ficheiro e no diff do pacote, e só nas cópias.*

## A leitura a frio, depois da adenda A

Claude Opus 5.5 (`leitor`), a `xhigh`, sobre o pacote montado por `pacote.sh` às 11:05 UTC. Cinco plantas em cinco:

- G1: o `robots.txt` convida os motores de busca em ensaio e afasta-os depois do lançamento;
- G2: o registo mostra em ensaio tudo o que não for correção;
- G3: uma correção feita no próprio dia do lançamento fica fora do registo;
- G4: em ensaio só levam `noindex` as páginas que já o levavam;
- G5: a marca portuguesa diz que tudo já foi conferido, e a inglesa que está a ser relido.

Os achados reais são os treze pontos da adenda B. O primeiro era um erro do mandato, e não do construtor: o `Disallow` no `robots.txt` impedia os motores de busca de ler o `noindex`.

## A leitura curta, sobre o diff das adendas B e C

Claude Opus 5.5 (`leitor`), a `xhigh`, sobre o pacote montado às 12:46 UTC. Cinco plantas em cinco:

- J1: a política portuguesa troca os dois modos;
- J2: a legenda portuguesa das correções volta a dizer que conta o livro-razão;
- J3: uma data impossível passa a validação do lançamento;
- J4: as novidades mostram as atualizações de antes do lançamento e escondem as de depois;
- J5: a legenda inglesa diz páginas com `noindex`.

Os achados reais são os sete pontos da adenda D.

## As adendas D e E

Lidas pelo lugar de direção no diff, sem plantas e sem pacote: a D antes da corrida inteira, a E depois dela. O que se conferiu na E, ficheiro a ficheiro: a régua do estado da fonte no recibo (`tests/linha/sem-resposta.mjs`) conserva nos dois modos a regra de que uma linha de proveniência incompleta fica fora do mapa do sítio e com `noindex`, e passou a exigir uma só meta; a célula da semana (`tests/explicacoes/semana.mjs`) passou a ler a história textual no recibo de cada linha em ensaio, com plantas que adulteram o valor antigo e o novo; a régua da largura mede em ensaio o recibo de uma linha com história longa em vez da página do registo, e afirma que o registo está vazio; as novidades da página inicial ficaram iguais às de `main`, salvo uma linha em branco no fim do componente. Nenhuma régua que protege um número, uma fonte ou uma pessoa ficou mais fraca.

A corrida inteira (`conferir-tudo.sh` com `--build`) correu três vezes: a primeira parou no `build` (uma planta de navegação pedia a caixa das novidades, que em ensaio não se desenhava); a segunda deu oito vermelhos em setenta passos, que são a adenda E; a terceira é a da cabeça que aterra, e o seu resultado está no relatório de fecho.

## O que fica aberto

- A leitura das adendas D e E não teve plantas. A corrida inteira corre as plantas de cada régua, mas não substitui um leitor com estragos escondidos; se uma régua mudada por elas falhar depois em silêncio, é aqui que se procura primeiro.
- `tests/dossies/do2-prova.mjs` procura a caixa das novidades e não está em nenhum guião do `package.json`: não é um portão, e fica por decidir se sai ou entra.
