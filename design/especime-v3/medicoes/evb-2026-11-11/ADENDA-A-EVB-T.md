# Adenda A do EVB-T: os dois vermelhos da corrida inteira (12.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do sítio `evb-2026-11-11`, sobre a cabeça `30565ab59`; a outra pasta com escrita é a worktree do motor `evb-2026-11-11`, onde não tens nada a mudar. Uma correção: trinta minutos e sessenta chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVB`. O teu relatório vai para `RELATORIO-EVB-T-A.txt`, nesta pasta (não na raiz do repositório), com dez linhas; as tuas medidas, para `medidas-do-construtor-evb-t-a.json`.*

## Porquê

Este lugar correu a lista inteira do `verify` por guião sobre a cabeça `30565ab59`, com o `build`: setenta e dois passos, dois vermelhos. Os outros setenta passaram, o `build` incluído. O resumo e os dois registos estão em `conferir-tudo-evb-t/`, nesta pasta.

## §0 O que se mediu

1. `check:frases-afirmacao` dá código um. A página de entrada imprime a frase da leitura do estudo, nas duas línguas, e a régua não lhe acha registo; e duas entradas de `ledger/frases/por-registar.json` da mesma página já não estão no `dist/` (são a frase antiga da leitura). A tua corrida desta régua passou porque a construção era de antes da meia-noite: o estudo ainda não era a publicação mais recente, e a página de entrada não o mostrava. A mesma frase imprime-se também na lista dos estudos, na página do concelho e na página do estudo, nas duas línguas (medido por este lugar no `dist/`).
2. `check:eo1` dá código um em `tests/eo1/maquinaria.mjs`, com a mensagem `abertura do sucessor não conferida: pt`. O teste só confere a abertura de um estudo cujo primeiro título de segundo nível seja o do resumo antigo, e exige que a deste estudo tenha sido conferida. O documento julgado abre com a pergunta.

## O que fazes

1. **A frase da leitura, em todas as páginas que a imprimem.** A cobertura de uma frase com afirmação ganha a via que falta, na régua das cópias julgadas que já fizeste: a frase da leitura de um estudo com declaração de texto julgado fica coberta quando a entrada do estudo em `src/data/leituras.mjs` cita na `origem` uma unidade do documento julgado e a frase impressa é essa unidade, letra por letra, salvo o que a entrada declara: os anos como referências e a palavra da casa para quem governa o concelho no lugar da palavra do documento (a troca escreve-se uma vez, numa lista fechada de dois pares, um por língua). Vale em qualquer página que imprima a frase. As duas entradas da frase antiga saem de `por-registar.json`. Plantas: outra palavra trocada recusa; um ano trocado recusa; a frase sem a `origem` recusa; uma troca fora da lista recusa.

2. **A abertura do sucessor.** A conferência da abertura passa a valer para as duas formas: num estudo com declaração de texto julgado, o primeiro título de segundo nível da página é o primeiro título de segundo nível do registo (a pergunta), e a planta do título trocado recusa; nos outros fica como está. A exigência de que a abertura deste estudo seja conferida, nas duas línguas, mantém-se.

3. **A prova.** `check:frases-afirmacao`, `check:eo1`, `check:frases-reais` e `check:leituras`, cada um com o código lido de um ficheiro, numa pasta `evb-t-a-conferencias`; se mudares alguma página, o `build` antes. Não corras a lista inteira.

## O que fica como está, por decisão

O texto julgado, a frase da leitura como está impressa, os outros estudos.

## Quando paras

Só se a frase da leitura só passar mudando o que diz. Para tudo o resto: decide, anota e continua.

## O fim

O relatório em dez linhas: os dois pontos, as plantas, os códigos.
