# CR2: quinze das dezassete revisões do Eurostat postas no sítio; as duas da dívida pública de 2025 esperam pela ferramenta das séries por país

A CR2-e ultrapassou a quarta paragem: a direção repôs os selos das duas dívidas em `c63fa86e7`, e `ledger:check` deu 0. Não foi necessário repor nem voltar a selar outro artefacto.

A construção única deu 1 por uma quinta paragem, agora numa das quinze linhas: `custo-unitario-do-trabalho-2025-ue` mudou, mas nenhuma declaração lhe atribui um lugar. `src/lib/mudancas.mjs` recusa renderizar `/correcoes/` e pede uma declaração fundamentada em `src/data/lugar-das-linhas.mjs`. A condição expressa do CR2-e manda parar quando a recusa incide numa das quinze linhas. Não se alterou essa declaração nem se repetiu a construção. O `dist/` é parcial, sem `index.html`, `version.json` ou os recibos conferidos: esta entrega não está pronta.

As provas novas estão em `e/`, preservando as anteriores em `d/`. Não houve corrida inteira, capturas, publicação ou alterações do motor.

## Ponto de partida conferido por guião

`d/partida.mjs`, com saída em `e/partida.json`: 15 linhas atualizadas, uma `atualizacao` e duas `proveniencia` por linha, 45 entradas de 26.10; duas linhas pendentes, sem correções dessa data; as 17 conservam a reconferência «diverge» de 26.10. Os valores e correções das duas pendentes foram comparados com `main`. Código 0. A história do valor passou também isoladamente: 4 controlos e 18 plantas, código 0.

A cabeça inicial do sítio é `c63fa86e7`. O mandato indica o motor em `e4628c17`, mas a cabeça observada foi `d8f0513b0713bedbd73f0c510bed875659a2f04f`, uma fusão posterior que contém aquele commit. A árvore estava limpa; foi esta worktree que `RESEARCHHUB_DIR` indicou na construção e no cruzamento com origem. Não foi alterada.

## As quatro paragens anteriores

1. **CR2, painel delimitado e linhas de base vivas.** A corrida na worktree deu código 1, com quatro alarmes, porque comparou com as bases comitadas de 28.09. A repetição pelo lugar de direção na árvore principal, com bases vivas de 26.10, deu código 0: 91 reconferências já escritas, zero alarmes e zero avisos. Prova conservada em `painel-raiz.resumo.txt`. O sinal global não é escrito por esta corrida delimitada.
2. **CR2-b, série S6.** Construção e livro-razão deram 1: a série por país conservava PT 89,7 e UE 81,7, enquanto as linhas tinham 89,2 e 81,5. Registo, cruzamento com origem e typecheck deram 0; explicações, discussão e cartões deram 1 por falta de `dist/`.
3. **CR2-c, gerador sem releitura nem VS6.** O ensaio válido deu 1; uma invocação anterior com caminho incorreto deu 2. O gerador lê apenas corpos alojados em `source/ue1/` e escreve `corrections: []`; não relê a fonte. VS6 exige história por `geo`, com valores antigo e novo, para cada ponto publicado alterado. S8 exige também data, natureza e motivo nas duas línguas. A passagem parou sem escrita, construção ou conferências, conforme o mandato. Provas em `c/resultado.json` e nos códigos de `c/`.

4. **CR2-d, história selada das duas linhas.** A reposição das linhas em `3a8932b67` conservou indevidamente os selos das atualizações retiradas. Construção e livro-razão deram 1: «uma entrada selada foi retirada ou alterada» e «a lista tem 0 entradas e o registo sela 1». Registo, cruzamento com origem e typecheck deram 0; explicações, discussão e cartões deram 1 por falta de HTML. A direção repôs os dois selos ao estado de `main` em `c63fa86e7`; a CR2-e confirmou `ledger:check` a 0. As quinze histórias restantes foram conservadas.

## As quinze linhas que seguem

Os valores anteriores e novos vêm da releitura medida na CR2, conservada em `medidas.json`; esta passagem confere o estado do livro, sem novas chamadas ao Eurostat.

| Linha | Antes | Novo |
|---|---|---|
| `custo-unitario-do-trabalho-2025-ue` | 15,2 | 14,8 |
| `divida-das-empresas-2024` | 67,1 | 66,6 |
| `divida-das-empresas-2025` | 64,9 | 65,1 |
| `divida-das-empresas-2025-ue` | 70,0 | 70,2 |
| `divida-das-familias-2024` | 52,6 | 52,3 |
| `divida-das-familias-2025` | 53,9 | 54,4 |
| `divida-publica-2024` | 93,5 | 93,0 |
| `fluxo-de-credito-as-empresas-2024` | 2,4 | 2,2 |
| `fluxo-de-credito-as-empresas-2025` | 3,0 | 3,4 |
| `fluxo-de-credito-as-familias-2024` | 4,1 | 4,0 |
| `fluxo-de-credito-as-familias-2025` | 8,6 | 9,0 |
| `fluxo-de-credito-as-familias-2025-ue` | 2,9 | 3,0 |
| `formacao-bruta-de-capital-fixo-2025-ue` | 21,4 | 21,5 |
| `licencas-de-construcao-2025-ue` | 377,5 | 377,6 |
| `pib-real-per-capita-2025-ue` | 31 890 | 31 980 |

## As duas linhas que esperam

| Linha | Valor publicado conservado | Revisão lida na CR2, ainda não aplicada |
|---|---|---|
| `divida-publica-2025` | 89,7 | 89,2 |
| `divida-publica-2025-ue` | 81,7 | 81,5 |

São pontos da série `divida-publica-2025-paises`. Esperam pela UE1-c, que deve reler as fontes e conservar recibos e história de cada ponto. O livro conserva a «diverge» de 26.10 e o valor publicado. É isso que os quatro recibos devem mostrar; na CR2-e também não foi possível inspecioná-los no HTML. Não se afirma que o leitor já os vê numa construção nova.

## Frases e recibos

`frases-cr2.mjs resolvedores` e `e/frases-comparadas-sem-html.json` comparam as 50 frases nas duas edições com `frases-antes.json`: **50 iguais, zero textos alterados**, em 21 ficheiros de origem. Esta é uma medida atual dos resolvedores, sem validação do HTML. A comparação histórica das leituras dos nove cartões tinha 18 textos iguais e 50 ramos sem inversões; não foi repetida nesta passagem nem apresentada como medida atual do HTML.

Os modos que leem o `dist/` não correram: faltam `version.json`, os recibos e páginas de leitura, conforme `e/dist-parcial.json`. Não há lista atual completa das páginas, comparação de frases e ramos no HTML nem validação dos 34 recibos. Os guiões agora aceitam uma pasta de saída opcional, para preservar as provas anteriores.

## Códigos CR2-d, lidos dos ficheiros

Os códigos estão em `d/*.codigo`, com registos de saída em `d/*.log`.

| Corrida | Código |
|---|---|
| `build` | 1 |
| `check-cartao` | 1 |
| `check-cruzamento` | 0 |
| `check-discussao` | 1 |
| `check-explicacoes` | 1 |
| `check-registo` | 0 |
| `frases-resolvedores` | 0 |
| `ledger-check` | 1 |
| `typecheck` | 0 |

A construção correu uma vez com `RESEARCHHUB_DIR` na worktree do motor, por `curto.sh`. As sete conferências pedidas correram uma vez cada. O cruzamento com origem passou com dois avisos de `built_at` em outros livros do motor, sem linhas divergentes. Não se executou nenhum navegador nem se pediram portões ao escrivão.

`medidas.json` conserva a medição anterior sob `historico_antes_cr2d` e acrescenta `continuacao_cr2d`, com a partida, códigos e ausências desta passagem. Os resultados históricos de 17 atualizações não representam o estado atual de 15.

## Códigos CR2-e, lidos dos ficheiros

| Corrida | Código |
|---|---|
| `build` | 1 |
| `ledger-check` | 0 |
| `check-registo` | 0 |
| `check-cruzamento` com origem | 0 |
| `check-explicacoes` | 1 |
| `check-discussao` | 1 |
| `check-cartao` | 1 |
| `typecheck` | 0 |
| `partida` | 0 |
| `historia-do-valor` | 0 |
| `frases-resolvedores` | 0 |

Uma construção por `curto.sh`, sete conferências pedidas (livro-razão e as seis do ponto 4), uma corrida de cada. Explicações e cartões falham por ficheiros HTML ausentes; discussão aponta páginas e recibos ausentes no `dist/` parcial. O cruzamento com origem passa com dois avisos de `built_at` nos mesmos dois livros do motor, sem linhas divergentes. Nenhuma falha foi corrigida por contornar a condição de paragem.

`e/medir.py` atualiza `medidas.json` com `continuacao_cr2e`, sem apagar a prova das passagens anteriores. Os resultados históricos de 17 atualizações não representam o estado atual de 15. Os modos HTML dos guiões não foram contabilizados como conferências executadas.

## Custo das passagens

Configuração indicada pelos mandatos: CR2 no Astra; CR2-b, CR2-c, CR2-d e CR2-e no Sol 6.1 medium. Isto regista a configuração declarada, sem inventar um identificador interno do modelo.

| Passagem | Chamadas de ferramentas | Construções | Conferências pedidas |
|---|---|---|---|
| CR2 | 53, segundo o relatório final; custo.json mediu 51 antes do commit e da inspeção | 0 | 0 |
| CR2-b | 20, segundo o relatório final; custo.json mediu 16 antes do commit e da inspeção | 1 | 7 |
| CR2-c | 10 | 0 | 0 |
| CR2-d | 23, segundo o relatório final | 1 | 7 |
| CR2-e | 17 até à escrita deste relatório; exclui revisão, commit e inspeção final | 1 | 7 |

A contagem CR2-e conta as chamadas `functions.exec`; os comandos internos são contados à parte. Além das sete conferências pedidas, correram partida, história do valor e frases nos resolvedores, uma vez cada. Sem corrida inteira, capturas ou gate do motor nesta passagem. `tokens used`: não exposto.

## Commits

Histórico do sítio: `8bb4d1018` aplicou as releituras; `13450306a` guardou provas e relatório da CR2; `0558afed2` documentou a S6; `6c62ece05` documentou a falta da ferramenta por país; `3a8932b67` repôs as duas dívidas. `7088d2e2e` guardou a prova da quarta paragem; `c63fa86e7` repôs os selos. O commit CR2-e guarda a prova da quinta paragem, os códigos e o relatório atualizado. A cabeça final é inspecionada e comunicada na resposta final.

## O que ficou aberto

- Resolver pela direção a quinta paragem: o lugar da linha `custo-unitario-do-trabalho-2025-ue`, com fundamento, e autorizar nova construção. Não se completou esta entrega.
- Conferir os 34 recibos e as páginas, frases e ramos no `dist/`, depois de uma construção bem-sucedida.
- A leitura a frio, a corrida inteira, as capturas e a aterragem, a cargo do lugar de direção.
- UE1-c: releitura das séries por país com recibos e história dos pontos.
- `src/data/verificacao.mjs`: conserva os 17 alarmes semanais; a corrida semanal de 02.11 reconfere e reescreve o sinal.
