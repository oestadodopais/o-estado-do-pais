# CR2: séries por país, contrato de revisão e estado da entrega

## CR2-c: paragem exigida pelo ponto 1

O gerador disponível não permite a atualização pedida com história por país. O ensaio terminou com código 1: `SERIES_PAISES: FAIL · divida-publica-2025: o ponto de uniao (81,7) não é, como número, a linha «divida-publica-2025-ue» (81,5)`. A primeira invocação tinha um caminho relativo incorreto, saiu a 2 e foi corrigida; não foi uma execução do gerador. Os dois códigos e registos estão em `c/`.

A instrução aplicável do mandato é: «se não tiver e o sítio exigir a história de um ponto que muda, para e diz exatamente que regra o exige». A condição confirmou-se:

- `publisher/series_paises.py:496` escreve sempre `corrections: []`; não lê nem regista revisões.
- `publisher/export_series.py:234-247`, regra **VS6**, exige para cada ponto publicado que mude uma entrada em `corrections` com `geo`, `old_value` e `new_value` correspondentes. A mensagem é: «sem uma entrada em corrections que o diga».
- `ledger/series/README.md`, regra **S8**, exige geografia, data, natureza, valor antigo, valor novo e motivo nas duas línguas.
- O `series-revisoes.json` existente pertence às séries no tempo: `publisher/dominios_series.py:71-76` define entradas por `periodo`. O gerador de países não o importa nem o lê.

Há ainda uma diferença entre o mandato e o programa disponível: `series_paises.py` não pede respostas novas ao Eurostat. `construir_serie()` lê por `alojado()`, que restringe a procura a `source/ue1/` e exige um único corpo por endereço. O ensaio lê assim o corpo antigo. Não foi feita nenhuma releitura de rede nesta passagem, nem medido qualquer carimbo novo.

### Séries e pontos

`c/resultado.json` guarda o inventário das dez séries existentes, os seus carimbos publicados e a contagem dos pontos. São dez séries de 28 pontos. Esses carimbos são históricos, não uma atualização medida hoje.

| Série | País | Antes | Depois nesta passagem | Estado |
|---|---|---|---|---|
| `divida-publica-2025-paises` | PT | 89,7 | Sem escrita | O mandato pede 89,2; não relido nesta passagem |
| `divida-publica-2025-paises` | EU27_2020 | 81,7 | Sem escrita | O ensaio confirma o desacordo com 81,5 na linha escalar |
| Outras nove séries do inventário | Todos os pontos | Conservados | Sem escrita | Revisões atuais e carimbos novos não medidos |

Nenhum ponto mudou. Não se executaram `--write`, exportação, construção ou conferências subsequentes. Não há commit do motor: a sua árvore está limpa e a cabeça continua `e4628c173dd4ffd155ba58ad8fa2cd74f8fe7e93`. A cabeça inicial do sítio é `0558afed2`; o commit desta passagem guarda apenas relatório e provas.

### Frases, recibos, códigos e custo

Não há `dist/index.html`. Nenhuma frase foi alterada nesta passagem; as frases e os 34 recibos das duas edições continuam por verificar no HTML. Os resultados CR2-b abaixo são históricos e não foram repetidos. `medidas.json` conserva essas medidas e acrescenta `continuacao_cr2c`, com os códigos e as ausências desta passagem.

Códigos CR2-c: invocação inválida 2; ensaio do gerador 1. Construção, `ledger:check` e conferências: não executados. Zero corridas inteiras, capturas e gates do motor. `custo.json` discrimina as chamadas desta passagem. `tokens used`: não exposto.

O passo necessário é dotar o caminho das séries por país de alojamento de respostas atuais e de revisões tipadas por geografia, conservando a história, antes de repetir o ensaio e atravessar. Essa implementação não foi feita porque o mandato manda parar nesta condição. A leitura a frio, a corrida inteira, as capturas e a aterragem continuam a cargo do lugar de direção.

## Histórico anterior

# Histórico CR2-b

A paragem do ponto 4 foi esclarecida pelo lugar de direção. Nesta continuação, a construção única foi tentada e recusada antes de produzir `dist/`: a série `divida-publica-2025-paises` conserva 89,7 para Portugal e 81,7 para a União, contra 89,2 e 81,5 nas linhas atualizadas. O `ledger:check` confirma os mesmos dois erros S6. Não há recibos ou frases do HTML novo que se possam declarar conferidos.

## A razão da paragem anterior e a verificação pela raiz

Os quatro alarmes anteriores eram um artefacto da base da corrida: `refresh.py` executado na worktree do motor compara com os `indicators/*.json` comitados em `master`, cuja linha de base é de 28.09.2026. A regra 11 conserva esses ficheiros. A corrida semanal escreve as linhas de base vivas apenas na árvore principal do motor.

O lugar de direção repetiu a corrida delimitada a partir da árvore principal, com as linhas de base vivas de 26.10 às 09:31, contra esta worktree do sítio. O resumo em `painel-raiz.resumo.txt` regista às 14:50 UTC: «0 alarm(s) · 0 notice(s)», «91 já escrita(s) hoje» e `exit=0`. Os três alarmes da dimensão `unit` de `tipsna40` e o da página da Comissão já tinham sido absorvidos pela corrida semanal de hoje. O histórico da corrida na worktree, incluindo o seu código 1, fica conservado como prova da base usada nessa tentativa.

A corrida delimitada não escreve o sinal global. `src/data/verificacao.mjs` conserva os 17 alarmes da corrida semanal, como no C2 de 05.10. A corrida semanal seguinte, prevista para 02.11, reconfere e reescreve o sinal.

## O que mudou no livro

As 17 linhas foram relidas pelo cliente da casa, em 12 pedidos com resposta 200. Cada corpo está alojado pelo sha256 no motor. A releitura sem rede deu as mesmas linhas e as mesmas paragens, nenhuma. Os valores vêm dos literais dos corpos, não da tabela do mandato.

Cada linha recebeu uma atualização e duas entradas de proveniência, 51 entradas no total: valor, acesso e excerto. As correções antigas ficaram intactas. A divergência de 26.10 foi conservada e o painel acrescentou a igualdade. O `published_at` veio do carimbo do corpo; o dia local do carimbo e o dia UTC coincidem nas 17 linhas. Saíram as marcas provisórias das dívidas das empresas e das famílias de 2024. As histórias dos valores foram seladas pelo guião existente.

Isto descreve o livro na worktree, não uma publicação. A recusa da construção impede a conferência dos recibos e das frases no HTML.

## As linhas, medidas de `releitura.json`

O carimbo anterior é o do último corpo alojado que contém o valor selado. Pode ser anterior ao carimbo que o painel da manhã registou, pois uma atualização do conjunto pode conservar o valor. Os dois factos estão em campos separados no resultado da releitura.

| Linha | Antes | Agora | Bandeira antes / agora | Carimbo do corpo anterior | Carimbo novo |
|---|---|---|---|---|---|
| `custo-unitario-do-trabalho-2025-ue` | 15,2 | 14,8 | ausente / ausente | 2026-10-02T23:00:00+0200 | 2026-10-22T23:00:00+0200 |
| `divida-das-empresas-2024` | 67,1 | 66,6 | p / ausente | 2026-10-03T11:00:00+0200 | 2026-10-24T11:00:00+0200 |
| `divida-das-empresas-2025` | 64,9 | 65,1 | p / p | 2026-10-03T11:00:00+0200 | 2026-10-24T11:00:00+0200 |
| `divida-das-empresas-2025-ue` | 70,0 | 70,2 | p / p | 2026-10-03T11:00:00+0200 | 2026-10-24T11:00:00+0200 |
| `divida-das-familias-2024` | 52,6 | 52,3 | p / ausente | 2026-10-03T11:00:00+0200 | 2026-10-24T11:00:00+0200 |
| `divida-das-familias-2025` | 53,9 | 54,4 | p / p | 2026-10-03T11:00:00+0200 | 2026-10-24T11:00:00+0200 |
| `divida-publica-2024` | 93,5 | 93,0 | ausente / ausente | 2026-04-22T11:00:00+0200 | 2026-10-21T11:00:00+0200 |
| `divida-publica-2025` | 89,7 | 89,2 | ausente / ausente | 2026-04-22T11:00:00+0200 | 2026-10-21T11:00:00+0200 |
| `divida-publica-2025-ue` | 81,7 | 81,5 | ausente / ausente | 2026-04-22T11:00:00+0200 | 2026-10-21T11:00:00+0200 |
| `fluxo-de-credito-as-empresas-2024` | 2,4 | 2,2 | ausente / ausente | 2026-10-03T11:00:00+0200 | 2026-10-24T11:00:00+0200 |
| `fluxo-de-credito-as-empresas-2025` | 3,0 | 3,4 | ausente / ausente | 2026-10-03T11:00:00+0200 | 2026-10-24T11:00:00+0200 |
| `fluxo-de-credito-as-familias-2024` | 4,1 | 4,0 | ausente / ausente | 2026-10-03T11:00:00+0200 | 2026-10-24T11:00:00+0200 |
| `fluxo-de-credito-as-familias-2025` | 8,6 | 9,0 | ausente / ausente | 2026-10-03T11:00:00+0200 | 2026-10-24T11:00:00+0200 |
| `fluxo-de-credito-as-familias-2025-ue` | 2,9 | 3,0 | p / p | 2026-10-03T11:00:00+0200 | 2026-10-24T11:00:00+0200 |
| `formacao-bruta-de-capital-fixo-2025-ue` | 21,4 | 21,5 | ausente / ausente | 2026-10-02T23:00:00+0200 | 2026-10-22T23:00:00+0200 |
| `licencas-de-construcao-2025-ue` | 377,5 | 377,6 | ausente / ausente | 2026-10-02T23:00:00+0200 | 2026-10-21T23:00:00+0200 |
| `pib-real-per-capita-2025-ue` | 31 890 | 31 980 | ausente / ausente | 2026-10-02T23:00:00+0200 | 2026-10-22T23:00:00+0200 |

## Teste de aceitação, parte a parte

| Parte | Resultado |
|---|---|
| Releitura das 17 linhas | Confirmada com rede e sem rede; 12 corpos conferidos pelo sha256 |
| Atualização e duas proveniências por linha | Aplicadas; 136 plantas da composição detetadas |
| Valor, excerto, acesso e divergência conservada | Conferidos pelo guião da aplicação e pela medição das linhas |
| Data de publicação | Atualizada; 102 plantas detetadas |
| Recibos nas duas edições | Pendente: a construção CR2-b recusou a série desatualizada |
| Frases e comparações | Parcial: nove cartões, 18 leituras, nenhuma mudança de texto; nenhum dos 50 ramos inverteu; o comparador detetou a planta de um ramo trocado |
| Livro-razão e conferências do ponto 6 | Executadas; códigos e impedimentos na tabela abaixo |
| Painel delimitado | Corrida anterior: quatro alarmes, código 1; corrida pela raiz: 91 já escritas, zero alarmes, código 0 |
| Sinal global | Intacto, com 17 alarmes; o comando delimitado não o escreve |
| Construção | Uma tentativa, código 1; sem `dist/` |
| Capturas e corrida inteira | Não correram; pertencem ao lugar de direção |

## As duas ferramentas

`indicators/reler_linhas.py` conserva o caminho do C2 e recebe `--linhas` ou `--do-painel`. Lê as linhas por Git na cabeça dada, imprime a seleção antes dos pedidos e aceita `--de-corpos`. Procura corpos anteriores também nas pastas aninhadas. Um carimbo ausente ou ilegível, um rótulo incompatível ou a falta de um corpo anterior com o valor selado deixam uma paragem. O ensaio `indicators/reler_linhas_test.py` passou os cinco casos: corpo intacto, literal adulterado, rótulo alterado, carimbo ausente e seleção por autor, data e divergência.

`scripts/aplicar-releituras.py` recebe `--motor`, `--releitura` e `--saida`. Confere a cabeça da releitura contra `main`, refaz a leitura dos corpos novo e anterior e compõe as entradas do C2 com as datas desta corrida. A aplicação prepara e confere todas as linhas antes da escrita. Conserva a indentação das correções existentes, incluindo listas com margem, que o primeiro ensaio apanhou. O modo `--published-at` aceita uma data já existente e altera-a apenas pelo carimbo. As linhas paradas no motor são anunciadas e ficam fora da aplicação.

Os guiões históricos do C2 ficaram intactos. A origem das frases inglesas das razões continua a ser o modelo bilingue do C2. As notas internas antigas dos geradores, incluindo a nota da dívida pública que menciona 89.7, ficaram intactas, pois não são um campo deste mandato.

## Frases e páginas

`leituras-cr2.mjs` mediu antes e depois pelos resolvedores do sítio. Os nove cartões têm valores de régua diferentes, mas as 18 leituras nas duas edições têm texto igual e os 50 ramos conservam o sentido. A planta do comparador alterou exatamente um ramo e foi detetada.

`frases-cr2.mjs antes` guardou 50 frases e encontrou 21 ficheiros de `src/` que contêm identificadores das linhas. A fotografia anterior vem dos resolvedores: não existia `dist/` nesta worktree. A construção CR2-b parou no desacordo da série antes de gerar HTML. A fotografia posterior no HTML, as explicações do Orçamento, os itens de discussão e os recibos não puderam ser medidos. Não se declara nenhuma frase do `dist/` como conferida. Os guiões `frases-cr2.mjs` e `recibos-cr2.mjs` estão preparados, mas os seus modos posteriores à construção não foram executados. A contagem de frases iguais no HTML permanece por verificar; as 18 leituras iguais e os 50 ramos conservados acima são medidas dos resolvedores anteriores, não do `dist/`.

## Códigos lidos dos ficheiros

| Corrida | Código |
|---|---|
| `aplicacao-ensaio-2` | 0 |
| `aplicacao-ensaio` | 1 |
| `aplicacao` | 0 |
| `frases-antes` | 0 |
| `leituras-antes` | 0 |
| `leituras-comparadas` | 0 |
| `leituras-depois` | 0 |
| `motor-ensaio` | 0 |
| `painel` | 1 |
| `publicacao` | 0 |
| `releitura-corpos` | 0 |
| `releitura-rede` | 0 |
| `selar` | 0 |
| `build` (CR2-b) | 1 |
| `ledger-check` (CR2-b) | 1 |
| `check-registo` (CR2-b) | 0 |
| `check-cruzamento -- --with-origin` (CR2-b) | 0 |
| `check-explicacoes` (CR2-b) | 1 |
| `check-discussao` (CR2-b) | 1 |
| `check-cartao` (CR2-b) | 1 |
| `typecheck` (CR2-b) | 0 |

O primeiro ensaio da aplicação saiu a 1 por uma lista de correções com margem diferente. Não escreveu linhas. A correção da composição passou no segundo ensaio. O painel saiu a 1 pelos quatro alarmes descritos. Na CR2-b, `build` e `ledger-check` recusam os dois pontos desatualizados da série; `check-explicacoes` e `check-discussao` terminam com `ENOENT` por falta de HTML; `check-cartao` anuncia «não existe dist/». Não são resultados de aprovação dessas três conferências. O cruzamento usou `RESEARCHHUB_DIR` na worktree do motor e passou com dois avisos sobre `built_at` de outros estudos, sem nenhuma linha alterada nomeada.

`medidas.json` foi escrito por `medir-cr2.py`, com um conhecido-positivo para cada medida. Os códigos são os dos ficheiros, não inferidos de mensagens. Os registos têm os caminhos locais substituídos. A pasta `painel/` conserva os pedidos, os corpos e os resultados da corrida delimitada; os corpos da releitura vivem no motor. Os ficheiros de estado protegidos do motor não foram alterados.

## O que ficou aberto

1. A série da dívida pública por país tem de ser relida e atualizada pelo motor, incluindo a proveniência e as correções exigidas pelo exportador, e voltar a atravessar. Não se alteraram à mão os dois pontos para contornar S6. Esta dependência não estava prevista nos pontos 5 e 6; exige alargar a continuação e permitir outra tentativa de construção. Foi pedida uma decisão sobre essa extensão.
2. Sem essa construção, os 34 recibos e as frases das duas edições no `dist/` permanecem por verificar. As três conferências que precisam do HTML têm de voltar a correr depois de existir uma construção válida. O `ledger:check` tem de confirmar a série corrigida.
3. A leitura a frio, a corrida inteira, as capturas e a aterragem pertencem ao lugar de direção.
4. Nota para as ferramentas: `reler_linhas.py` e a corrida delimitada do painel precisam das linhas de base vivas. Devem correr a partir da árvore principal do motor ou receber a pasta das linhas de base por parâmetro.

## Custo e commits

`custo.json` conserva a medição da passagem original e mede separadamente esta continuação a partir do registo da sessão. A CR2-b tentou uma construção e executou uma vez cada uma das sete conferências pedidas. Não houve corrida inteira, captura, gate do motor ou alteração do motor nesta continuação. Os códigos estão nos ficheiros; `medidas.json` foi regenerado pelo guião com as novas medidas e os seus controlos positivos.

Os recibos anteriores ficam em `entrega.json`. O commit desta continuação guarda o relatório e as provas do novo bloqueio; a entrega continua sem condições de aterragem.

### Recibos aceites

- sitio: `8bb4d10187e221e6609e49e935d6d849350370b4`, código 0.
- motor: `e4628c173dd4ffd155ba58ad8fa2cd74f8fe7e93`, código 0.

Estas são as cabeças do código. O commit seguinte no sítio guarda apenas este relatório e as provas.

O recibo do motor mostra `GATE: PASS`: o hook correu o `core.gate`, apesar de o comando cliente ter recebido `OEDP_GATE=adiado`. A variável do cliente não foi entregue pelo pedido ao processo do escrivão. Assim, a suposição operacional do mandato sobre adiar o gate não se confirmou. Não foi pedido um gate separado nem repetida a corrida. O recibo integral disponível, limitado pelo próprio escrivão à cauda, está em `commit-motor.json`.

Uma tentativa de diagnóstico dos processos foi recusada pela sandbox com `zsh:1: operation not permitted: ps`. Não houve pedido de escalada; a confirmação veio dos recibos do escrivão.

Até à medição anterior ao commit do relatório: 51 chamadas de ferramentas, incluindo as esperas, e 13 operações com código guardado. As chamadas internas ao orquestrador são discriminadas em `custo.json`. O hook correu o core.gate uma vez; as conferências do ponto 6 correram zero vezes.
