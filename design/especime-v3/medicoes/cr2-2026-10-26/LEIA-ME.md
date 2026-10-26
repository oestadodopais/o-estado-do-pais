# CR2: quinze das dezassete revisões do Eurostat postas no sítio; as duas da dívida pública de 2025 esperam pela ferramenta das séries por país

A CR2-d encontrou uma quarta paragem. O commit de reposição das duas linhas retirou as atualizações de 26.10 das correções, mas conservou os seus selos em `ledger/historias-valores.json`. A construção única e o `ledger:check` saíram a 1: «uma entrada selada foi retirada ou alterada» e «a lista tem 0 entradas e o registo sela 1», para as duas linhas. Não existe `dist/index.html`; esta entrega não pode ser declarada pronta.

Não se alteraram os selos nem se repetiu a construção. Foi pedida uma decisão para repor também os dois selos ao estado de `main` e autorizar uma segunda tentativa, porque o mandato limita a construção a uma. O pedido não tinha resposta no momento deste relatório. Não houve corrida inteira, capturas, publicação ou alterações do motor.

## Ponto de partida conferido por guião

`d/partida.mjs` e `d/partida.json`: 15 linhas atualizadas, uma `atualizacao` e duas `proveniencia` por linha, 45 entradas de 26.10; duas linhas pendentes, sem correções dessa data; as 17 conservam a reconferência «diverge» de 26.10. Os valores e correções das duas pendentes foram comparados com `main`. Esta conferência dos campos passa, mas não declara os selos consistentes.

A cabeça inicial do sítio é `3a8932b67`. O motor foi conferido limpo em `e4628c173dd4ffd155ba58ad8fa2cd74f8fe7e93` e não muda nesta passagem.

## As três paragens anteriores

1. **CR2, painel delimitado e linhas de base vivas.** A corrida na worktree deu código 1, com quatro alarmes, porque comparou com as bases comitadas de 28.09. A repetição pelo lugar de direção na árvore principal, com bases vivas de 26.10, deu código 0: 91 reconferências já escritas, zero alarmes e zero avisos. Prova conservada em `painel-raiz.resumo.txt`. O sinal global não é escrito por esta corrida delimitada.
2. **CR2-b, série S6.** Construção e livro-razão deram 1: a série por país conservava PT 89,7 e UE 81,7, enquanto as linhas tinham 89,2 e 81,5. Registo, cruzamento com origem e typecheck deram 0; explicações, discussão e cartões deram 1 por falta de `dist/`.
3. **CR2-c, gerador sem releitura nem VS6.** O ensaio válido deu 1; uma invocação anterior com caminho incorreto deu 2. O gerador lê apenas corpos alojados em `source/ue1/` e escreve `corrections: []`; não relê a fonte. VS6 exige história por `geo`, com valores antigo e novo, para cada ponto publicado alterado. S8 exige também data, natureza e motivo nas duas línguas. A passagem parou sem escrita, construção ou conferências, conforme o mandato. Provas em `c/resultado.json` e nos códigos de `c/`.

A direção repôs as duas linhas no commit `3a8932b67`, conservando as outras quinze. Isso resolve o desacordo numérico S6, mas deixou os selos incompatíveis que bloquearam esta construção.

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

São pontos da série `divida-publica-2025-paises`. Esperam pela UE1-c, que deve reler as fontes e conservar recibos e história de cada ponto. O livro conserva a «diverge» de 26.10 e o valor publicado. É isso que os quatro recibos devem mostrar; nesta passagem não foi possível inspecioná-los no HTML. Não se afirma que o leitor já os vê numa construção nova.

## Frases e recibos

`frases-cr2.mjs resolvedores` e `d/frases-comparadas-sem-html.json` comparam as 50 frases nas duas edições com `frases-antes.json`: **50 iguais, zero textos alterados**, em 21 ficheiros de origem. Esta é uma medida dos resolvedores, sem validação do HTML. A comparação histórica das leituras dos nove cartões tinha 18 textos iguais e 50 ramos sem inversões; não foi repetida nesta passagem nem apresentada como medida atual do HTML.

Os guiões foram preparados para distinguir os 30 recibos das quinze linhas atualizadas dos quatro recibos pendentes, conferir a divergência visível e permitir que a comparação de frases encontre zero alterações. Os modos de leitura do `dist/` não correram porque a construção não o produziu. A lista das páginas, as frases e ramos no HTML e os 34 recibos continuam por verificar.

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

## Custo das passagens

Configuração indicada pelos mandatos: CR2 no Astra; CR2-b, CR2-c e CR2-d no Sol 6.1 medium. Isto regista a configuração declarada, sem inventar um identificador interno do modelo.

| Passagem | Chamadas de ferramentas | Construções | Conferências pedidas |
|---|---|---|---|
| CR2 | 53, segundo o relatório final; custo.json mediu 51 antes do commit e da inspeção | 0 | 0 |
| CR2-b | 20, segundo o relatório final; custo.json mediu 16 antes do commit e da inspeção | 1 | 7 |
| CR2-c | 10 | 0 | 0 |
| CR2-d | 21 até à preparação do commit; exclui commit e inspeção final | 1 | 7 |

A contagem CR2-d inclui os invólucros `functions.exec`, o pedido assíncrono e a espera; os comandos internos são contados à parte. Sem corrida inteira, capturas ou gate do motor nesta passagem. `tokens used`: não exposto.

## Commits

Histórico do sítio: `8bb4d1018` aplicou as releituras; `13450306a` guardou provas e relatório da CR2; `0558afed2` documentou a S6; `6c62ece05` documentou a falta da ferramenta por país; `3a8932b67` repôs as duas dívidas. O commit CR2-d guarda a prova da quarta paragem e a preparação dos guiões. A sua cabeça exata é inspecionada e comunicada na resposta final.

## O que ficou aberto

- Repor os dois selos em coerência com a reposição autorizada pela direção e decidir a exceção de uma segunda construção. Sem isso não se consegue concluir esta entrega.
- Conferir os 34 recibos e as páginas, frases e ramos no `dist/`, depois de uma construção bem-sucedida.
- A leitura a frio, a corrida inteira, as capturas e a aterragem, a cargo do lugar de direção.
- UE1-c: releitura das séries por país com recibos e história dos pontos.
- `src/data/verificacao.mjs`: conserva os 17 alarmes semanais; a corrida semanal de 02.11 reconfere e reescreve o sinal.
