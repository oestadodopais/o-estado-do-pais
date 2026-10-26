# CR2: entrega parcial, parada no ponto 4

O mandato exige parar se o painel escrever outro resultado. A corrida delimitada terminou com **91 últimas reconferências iguais, zero divergentes e zero inacessíveis**, mas deu **quatro alarmes e código 1**. O sinal global ficou com os **17 alarmes anteriores**. Não houve construção, capturas ou corrida inteira; as conferências do ponto 6 e a leitura dos recibos no `dist/` ficaram por fazer.

## A razão da paragem

`indicators/refresh.py`, nas linhas 1475 a 1479 da base do motor, só chama `escreve_sinal_do_sitio` quando não recebe uma seleção de linhas. Com `--linhas`, imprime «corrida delimitada: sem carimbo global do sítio». Portanto, o comando do ponto 4 não pode, por si só, deixar `src/data/verificacao.mjs` com zero alarmes. O ficheiro não foi alterado.

Além disso, a corrida deu estes alarmes, conservados em `painel/refresh_report.json`:

- `pib-real-per-capita-2024`, `pib-real-per-capita-2025` e `pib-real-per-capita-2025-ue`: a dimensão `unit` passou de uma para duas categorias contra a base usada pelo painel.
- A página dos limiares da Comissão: o vigia encontrou mudança no conteúdo numérico. A causa não foi investigada nesta passagem, por força da paragem. Não se presume que seja apenas grafia.

A corrida escreveu 17 reconferências iguais e encontrou 74 já escritas hoje. Os quatro alarmes não são divergências dos valores das linhas. O relatório histórico do C2 descreve alarmes das mesmas categorias; isso não prova que a causa de hoje seja a mesma.

## O que mudou no livro

As 17 linhas foram relidas pelo cliente da casa, em 12 pedidos com resposta 200. Cada corpo está alojado pelo sha256 no motor. A releitura sem rede deu as mesmas linhas e as mesmas paragens, nenhuma. Os valores vêm dos literais dos corpos, não da tabela do mandato.

Cada linha recebeu uma atualização e duas entradas de proveniência, 51 entradas no total: valor, acesso e excerto. As correções antigas ficaram intactas. A divergência de 26.10 foi conservada e o painel acrescentou a igualdade. O `published_at` veio do carimbo do corpo; o dia local do carimbo e o dia UTC coincidem nas 17 linhas. Saíram as marcas provisórias das dívidas das empresas e das famílias de 2024. As histórias dos valores foram seladas pelo guião existente.

Isto descreve o livro na worktree, não uma publicação. Os recibos e as frases construídas ainda não foram conferidos.

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
| Recibos nas duas edições | Pendente: não houve construção após a paragem |
| Frases e comparações | Parcial: nove cartões, 18 leituras, nenhuma mudança de texto; nenhum dos 50 ramos inverteu; o comparador detetou a planta de um ramo trocado |
| Livro-razão e conferências do ponto 6 | Pendentes: não correram após a paragem |
| Painel delimitado | 91 últimas reconferências iguais, mas quatro alarmes; código 1 |
| Sinal global | Intacto, com 17 alarmes; o comando delimitado não o escreve |
| Construção, capturas e corrida inteira | Não correram |

## As duas ferramentas

`indicators/reler_linhas.py` conserva o caminho do C2 e recebe `--linhas` ou `--do-painel`. Lê as linhas por Git na cabeça dada, imprime a seleção antes dos pedidos e aceita `--de-corpos`. Procura corpos anteriores também nas pastas aninhadas. Um carimbo ausente ou ilegível, um rótulo incompatível ou a falta de um corpo anterior com o valor selado deixam uma paragem. O ensaio `indicators/reler_linhas_test.py` passou os cinco casos: corpo intacto, literal adulterado, rótulo alterado, carimbo ausente e seleção por autor, data e divergência.

`scripts/aplicar-releituras.py` recebe `--motor`, `--releitura` e `--saida`. Confere a cabeça da releitura contra `main`, refaz a leitura dos corpos novo e anterior e compõe as entradas do C2 com as datas desta corrida. A aplicação prepara e confere todas as linhas antes da escrita. Conserva a indentação das correções existentes, incluindo listas com margem, que o primeiro ensaio apanhou. O modo `--published-at` aceita uma data já existente e altera-a apenas pelo carimbo. As linhas paradas no motor são anunciadas e ficam fora da aplicação.

Os guiões históricos do C2 ficaram intactos. A origem das frases inglesas das razões continua a ser o modelo bilingue do C2. As notas internas antigas dos geradores, incluindo a nota da dívida pública que menciona 89.7, ficaram intactas, pois não são um campo deste mandato.

## Frases e páginas

`leituras-cr2.mjs` mediu antes e depois pelos resolvedores do sítio. Os nove cartões têm valores de régua diferentes, mas as 18 leituras nas duas edições têm texto igual e os 50 ramos conservam o sentido. A planta do comparador alterou exatamente um ramo e foi detetada.

`frases-cr2.mjs antes` guardou 50 frases e encontrou 21 ficheiros de `src/` que contêm identificadores das linhas. A fotografia anterior vem dos resolvedores: não existia `dist/` nesta worktree. A fotografia posterior no HTML, as explicações do Orçamento, os itens de discussão e os recibos não foram medidos. Não se declara nenhuma frase do `dist/` como conferida. Os guiões `frases-cr2.mjs` e `recibos-cr2.mjs` estão preparados, mas os seus modos posteriores à construção não foram executados.

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

O primeiro ensaio da aplicação saiu a 1 por uma lista de correções com margem diferente. Não escreveu linhas. A correção da composição passou no segundo ensaio. O painel saiu a 1 pelos quatro alarmes descritos. Os restantes códigos desta tabela são zero.

`medidas.json` foi escrito por `medir-cr2.py`, com um conhecido-positivo para cada medida. Os códigos são os dos ficheiros, não inferidos de mensagens. Os registos têm os caminhos locais substituídos. A pasta `painel/` conserva os pedidos, os corpos e os resultados da corrida delimitada; os corpos da releitura vivem no motor. Os ficheiros de estado protegidos do motor não foram alterados.

## Continuação necessária pelo lugar de direção

1. Resolver o desacordo do ponto 4: confirmar a base de comparação dos três alarmes de estrutura, reler a página da Comissão e definir como publicar o sinal global depois de uma corrida delimitada completa. A pergunta enviada durante a passagem sobre gerar o sinal pela função existente não autorizava ignorar alarmes; não foi executada.
2. Só depois, retomar a construção única e as conferências pedidas. O inventário das frases ainda contém a contagem anterior das revisões de proveniência e terá de ser atualizado com a contagem medida. As mudanças das marcas provisórias também precisam da conferência dos rótulos.
3. Conferir as frases do HTML, os recibos nas duas edições e completar o relatório. A corrida inteira, a leitura a frio, as capturas e a aterragem continuam a pertencer ao lugar de direção.

## Custo e commits

A contagem das chamadas até à medição final está em `custo.json`, extraída do registo desta sessão. Houve uma corrida de ensaios do motor, duas tentativas de ensaio da aplicação, uma aplicação, um passo de publicação, duas releituras, uma selagem e uma corrida delimitada do painel. As medições dos cartões e das frases têm os seus códigos na tabela. Não houve nenhuma corrida inteira, construção ou captura.

Os recibos de commit e as cabeças verificadas ficam em `entrega.json`. A entrega é parcial e não está pronta para aterragem.

### Recibos aceites

- sitio: `8bb4d10187e221e6609e49e935d6d849350370b4`, código 0.
- motor: `e4628c173dd4ffd155ba58ad8fa2cd74f8fe7e93`, código 0.

Estas são as cabeças do código. O commit seguinte no sítio guarda apenas este relatório e as provas.

O recibo do motor mostra `GATE: PASS`: o hook correu o `core.gate`, apesar de o comando cliente ter recebido `OEDP_GATE=adiado`. A variável do cliente não foi entregue pelo pedido ao processo do escrivão. Assim, a suposição operacional do mandato sobre adiar o gate não se confirmou. Não foi pedido um gate separado nem repetida a corrida. O recibo integral disponível, limitado pelo próprio escrivão à cauda, está em `commit-motor.json`.

Uma tentativa de diagnóstico dos processos foi recusada pela sandbox com `zsh:1: operation not permitted: ps`. Não houve pedido de escalada; a confirmação veio dos recibos do escrivão.

Até à medição anterior ao commit do relatório: 51 chamadas de ferramentas, incluindo as esperas, e 13 operações com código guardado. As chamadas internas ao orquestrador são discriminadas em `custo.json`. O hook correu o core.gate uma vez; as conferências do ponto 6 correram zero vezes.
