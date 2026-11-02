# Adenda B ao mandato PAI1: a leitura da semana diz as revisões da fonte que ainda não se aplicaram, por régua (02.11.2026)

Acrescenta: frases

*A mesma worktree do lote, por cima da SEL1 e da PAI1 (e da correção SEL1-E, se já estiver comitada). Escrita pelo lugar de direção (Claude Opus 5.5). A página "A leitura da semana" (`src/lib/leitura-da-semana.mjs`, as frases em `src/i18n/strings.mjs`, `semana`) conta só as linhas cujo valor mudou por correção. Construída na cabeça 9518b5565 (com o painel de 02.11), diz: "Entre 27.10.2026 e 02.11.2026, 90 números foram relidos na fonte, e nenhum mudou de valor nem de proveniência." O painel de 02.11 encontrou três linhas em que a fonte reviu o valor (`desempenho-das-exportacoes-2024`, 17,1 para 17.0; `desempenho-das-exportacoes-2025`, 8,2 para 8.0; `sobrecarga-do-custo-da-habitacao-2025-ue`, 7,7 para 7.6; `result: diverge`, com `found`), que esta página ainda publica com o valor anterior. A frase, lida por um leitor, diz que a releitura não encontrou mudanças: é falsa, e não pode aterrar assim.*

## §1 O que muda

1. **A frase conta as revisões da fonte por aplicar.** Uma linha conta quando a sua última reconferência na janela da semana é `diverge` e não há, depois dela, uma correção nem uma atualização dessa linha. Quando há uma ou mais, a frase de abertura acrescenta, antes do ponto final, a oração do §2.1; e a página ganha uma secção com o título do §2.2 e uma entrada por linha, na forma do §2.3, com o selo depois da medida inteira (a régua da SEL1).
2. **A contagem dos relidos confere.** A frase diz "90 números foram relidos" e o painel de 02.11 releu 91 linhas: medes porquê (uma linha sem página, uma inacessível, uma contada de outra maneira) e dizes no relatório; se a contagem estiver errada, corriges a contagem, não a frase.
3. **A régua** (no `verify`): os números da frase de abertura e da secção nova conferem, nas duas edições, com uma contagem independente das `verifications` do livro na mesma janela (os relidos, os que mudaram de valor ou de proveniência por correção, os que divergem por aplicar). **Plantas**, cada uma numa cópia: uma divergência por aplicar que a frase não conta; uma frase que diz "nenhum mudou" com uma divergência por aplicar; e um controlo que passa.
4. As réguas que a página arrasta (a voz, o inventário das frases, `check:datas`, o portão do HTML) mudam de forma com ela, cada uma com a sua planta.

## §2 As frases (palavra por palavra; `⟦n⟧` pela contagem)

1. A oração da frase de abertura: pt, com uma linha, «; a fonte reviu ⟦n⟧ deles, que aqui ainda tem o valor anterior»; com várias, «; a fonte reviu ⟦n⟧ deles, que aqui ainda têm o valor anterior»; en, com uma, «; the source revised ⟦n⟧ of them, which still carries the previous value here»; com várias, «; the source revised ⟦n⟧ of them, which still carry the previous value here».
2. O título da secção: pt «Os números que a fonte reviu e que aqui ainda têm o valor anterior»; en «The numbers the source revised that still carry the previous value here».
3. Cada entrada: pt «⟦nome da medida⟧, ⟦período⟧: publicado ⟦valor⟧ ⟦unidade⟧; a fonte escreve agora ⟦found⟧, na releitura de ⟦data⟧.»; en «⟦measure name⟧, ⟦period⟧: published ⟦value⟧ ⟦unit⟧; the source now writes ⟦found⟧, in the re-reading of ⟦date⟧.».
4. O `found` rende-se como a fonte o escreve, com a vírgula na edição portuguesa, pela forma de "a fonte passou a escrever" que já existe.

## §3 O orçamento e o que pára

Quarenta e cinco minutos, sessenta chamadas; um commit para o §1.1 a §1.2, outro para a régua e as plantas; as conferências que a mudança toca e o `build` inteiro pelo escrivão no fim. Paras e dizes: se uma frase do §2 for apanhada por um marcador da voz (diz qual; muda a frase, não a lista); se a contagem independente der outros números que não os da página por uma razão que não seja a das divergências por aplicar.
