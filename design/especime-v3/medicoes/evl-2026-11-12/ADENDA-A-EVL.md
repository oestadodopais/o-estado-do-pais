# Adenda A do EVL: o livro do motor fica como o compositor o faz, e o fecho das provas (12.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do sítio `evl-2026-11-12`; a outra pasta com escrita é a worktree do motor `evl-2026-11-12`. Uma correção: trinta minutos e sessenta chamadas, quase tudo do portão do motor; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVL`. O teu relatório vai para `RELATORIO-EVL-A.txt`, nesta pasta, com dez linhas; as tuas medidas, para `medidas-do-construtor-evl-a.json`.*

## Porquê

A primeira passagem construiu o cartão e os cinco recibos, e as frases estão como o mandato as escreveu. Ficou uma coisa por fechar no motor, e a causa é deste lugar: o mandato pediu que a linha `painel-transferido` ganhasse o campo `document` no livro do estudo, e esse livro é composto a partir do livro do estudo 14, de onde a linha vem. A recomposição tira a anotação, e o portão recusa.

## §0 O que se mediu

1. O `core.gate` da primeira passagem deu código um; depois das tuas duas correções fica a recomposição dos gabaritos, que retira o campo `document` da linha (`motor-gabaritos-confirmacao` com código um nos teus registos).
2. No manifesto da travessia, as entradas do estudo 16 levam o documento na própria entrada (o título, a página e o resumo do corpo alojado). É o lugar certo para a prova desta linha.
3. A correção de `tests/evb/pagina.mjs`, o relatório, as medidas e os registos da primeira passagem ficaram por comitar na worktree do sítio; este lugar comitou-os com esta adenda.

## O que fazes

1. **No motor.** A linha `painel-transferido` volta, no livro do estudo, ao que o compositor produz: sem o campo `document`. A prova documental fica na entrada da travessia dessa linha em `publisher/manifest.evora.json`: o título que o motor prova para o PDF, a página e o resumo do corpo alojado, e o exportador confere o excerto no corpo com esse resumo, inteiro e único na página, como faz às outras quatro. Planta: outro resumo na entrada recusa; um excerto que não esteja na página recusa. Corre o exportador outra vez com `--site` e `--write`: os cinco ficheiros do sítio têm de ficar byte a byte como estão, ou dizes o que mudou e porquê. No fim, o `core.gate` inteiro, uma vez, com código zero; o registo vai para esta pasta (`evl-a-gate.log` e `.codigo`), sem caminhos da máquina nem a estrutura das pastas locais. Se der código um, corrige a causa e corre-o outra vez.

2. **No sítio.** Diz, numa lista por unidade do texto julgado, que ocorrências da página do estudo ganharam um selo de fonte com as linhas novas (a unidade, o número, a linha), nas duas línguas: este lugar confere que cada uma é a medida da linha.

3. **A prova.** As conferências do sítio que a mudança toca e que não precisam do navegador nem do `build` inteiro: `ledger:check`, `check:cruzamento` (com o motor), a régua do texto da página, `typecheck`. Cada código lido de um ficheiro, em `evl-a-conferencias`. O `build`, o `gate:html` e o `check:leituras` corre-os este lugar a seguir.

## O que fica como está, por decisão

As frases do cartão e dos recibos, os nomes das medidas, o texto julgado, as outras linhas.

## Quando paras

Se o exportador só fizer bater a linha do relato ao painel mudando o valor, o excerto ou a página. Para tudo o resto: decide, anota e continua.

## O fim

O relatório em dez linhas: os três pontos, as plantas, os códigos, o código do portão do motor.
