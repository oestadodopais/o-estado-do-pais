# V2-b: dois itens, verificações e capturas

Estado histórico no fim da retoma 1, antes dos resultados da retoma 2 acrescentados abaixo: a entrega não estava aceite. A implementação está comitada, mas a corrida sobre o código novo não conseguiu adquirir a tranca partilhada. Faltam a conferência do HTML construído, o inventário das frases efetivamente rendidas, os portões finais, as provas de navegação e as capturas. Não houve publicação nem push.

Cabeça da implementação: `f5ce0ef40e852fee85316e645f80df3b74f3bd7b`. O pedido `pedido-20261019T153920-90258.json` devolveu código 247 no invólucro. Os códigos presentes na pasta de saída são `[]`. O escrivão registou `-9` e a razão «portoes: passou do teto (50 minutos) e foi interrompido». O código do invólucro não é um resultado de build, verify ou typecheck. O estado do pedido no escrivão, quando se escreveu o relatório, está em `retoma/impedimento.json`.

## O impedimento, V2B-11

A tranca declara um início às 15:36:07 UTC de 19.10.2026, mas o dono aparece como `<worktree>`, não como um caminho identificável. Em duas observações, o conteúdo manteve o mesmo sha256 e a data de modificação avançou. A consulta de existência do processo pelo sinal 0 foi recusada com `PermissionError`; não se enviou nenhum sinal de interrupção. Um ensaio num ficheiro temporário separado demonstrou que a tentativa de aquisição com `set -C` preserva tanto o conteúdo como a data do ficheiro. A renovação da tranca real não é explicada por esse ensaio. Não se conclui que a tranca esteja órfã nem que pertença a outra worktree.

A tranca real ficou intocada. Foi pedida à direção a confirmação de uma corrida ativa. A prova está em `retoma/tranca-anomalia.json`. O pedido não foi duplicado. O escrivão interrompeu esta tentativa ao atingir o teto; o pedido ficou concluído com essa recusa. Antes de uma nova corrida, a direção deve conferir o estado da tranca. Não se contorna a serialização.

## A partida repetida

Sítio: `f927983478e6a00bc3db04e6b184129e1038880f`. Motor: `78a5e500be4789cdc5a99618a0b35b0f4f63d912`. Ascendência de `main` e `master`: códigos 0 e 0. Não houve fusão nesta passagem.

`medir-partida.py` conferiu individualmente os 18 identificadores, as 3 afirmações e as 15 linhas numéricas. A medição, os campos das três afirmações e os sha256 estão em `retoma/partida.json`. Todas as quinze linhas numéricas têm ressalva. A marca de afirmação é `afirmacao: true`, não apenas o prefixo do identificador.

| Identificador | Valor | Unidade | Referência |
|---|---|---|---|
| `afirmacao-leitao-amaro-saude-oe2027-2026-10-09` | 3 | % | 2026-10-09 |
| `afirmacao-rtp-saude-queda-oe2027-2026-10-09` | 1,5 | % de queda | 2026-10-09 |
| `afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09` | 1 700 | milhões de euros | 2026-10-09 |
| `oe-2027-saude-despesa-total-consolidada-2026` | 18 125,9 | milhões de euros | 2026 |
| `oe-2027-saude-despesa-total-consolidada-2027` | 17 858,4 | milhões de euros | 2027 |
| `oe-2027-saude-despesa-total-consolidada-variacao` | −1,5 | % | 2027 |
| `oe-2027-saude-despesa-efetiva-consolidada-2026` | 18 062,4 | milhões de euros | 2026 |
| `oe-2027-saude-despesa-efetiva-consolidada-2027` | 17 803,1 | milhões de euros | 2027 |
| `oe-2027-saude-despesa-efetiva-consolidada-variacao` | −1,4 | % | 2027 |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026` | 17 291,3 | milhões de euros | 2026 |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027` | 17 803,1 | milhões de euros | 2027 |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao` | 3,0 | % | 2027 |
| `oe-2027-ppp-rodoviario-encargos-brutos-2027` | 1 152 | milhões de euros | 2027 |
| `oe-2027-ppp-rodoviario-receitas-2027` | 263 | milhões de euros | 2027 |
| `oe-2027-ppp-rodoviario-encargos-liquidos-2027` | 889 | milhões de euros | 2027 |
| `oe-2027-ppp-total-encargos-liquidos-2027` | 1 438 | milhões de euros | 2027 |
| `oe-2027-cenario-pib-real-crescimento-2027` | 2,1 | % | 2027 |
| `oe-2027-cenario-ihpc-2026` | 2,9 | % | 2026 |

## A comparação das parcerias

Valor afirmado: 1 700. O guião normaliza os espaços de milhares e a vírgula decimal e compara cada valor separadamente.

| Linha | Valor | Diferente do valor afirmado |
|---|---|---|
| `oe-2027-ppp-rodoviario-encargos-brutos-2027` | 1 152 | sim |
| `oe-2027-ppp-rodoviario-receitas-2027` | 263 | sim |
| `oe-2027-ppp-rodoviario-encargos-liquidos-2027` | 889 | sim |
| `oe-2027-ppp-total-encargos-liquidos-2027` | 1 438 | sim |

## O que se implementou

Os dois itens nas duas edições, com o título e as seis secções prescritas; os tokens literais de citação, atribuição e ressalva no resolvedor comum das explicações; a célula dos itens com os cinco estragos; o bloco na primeira página; a porta do rodapé; as portas por coincidência de linhas e a exceção temática em `por-funcao`. O menu não foi alterado. O motor e os dados do livro-razão não foram alterados. A presença no código não é apresentada como prova do resultado no navegador.

## Decisões e omissões

- V2B-1: o item 3 ficou para o LR1. A afirmação textual do CFP não tem valor nem unidade, exigidos pelos dois livros. Não se criou nem exportou essa linha.
- V2B-2: o parágrafo contínuo do CFP e a revisão de proveniência do «4do» ficam para o LR1; a linha do PIB ficou intacta.
- V2B-3: a conferência de origem das pensões e a das séries deram 0 na partida, antes da implementação.
- V2B-4: a explicação também tem `divida-e-saldo`; a porta temática fica em `por-funcao`.
- V2B-5: os portões da partida aguardaram a tranca e acabaram a zero. A anomalia da corrida seguinte é a V2B-11, descrita acima.
- V2B-6: usa-se o resolvedor comum, sem resolvedor paralelo. O token literal admite apenas `excerpt`, `attributed_to` e `ressalva`; os dois primeiros exigem uma afirmação. A atribuição conserva o separador dos recibos; a ressalva inglesa usa `ressalva_en`. `note` não se publica nem apoia os itens.
- V2B-7: os dois itens têm a mesma data de escrita e conservam a ordem do mandato.
- V2B-8: a implementação considera também os recibos e o índice do livro-razão na coincidência de linhas. A única exceção temática é a da Saúde. A contagem de portas sobre o HTML final continua pendente.
- V2B-9: saiu apenas a frase opcional sobre o dinheiro do PRR terminar em 2026, por falta dessa afirmação literal no apoio `v2a-prr-ciclo`, em `src/data/origens-v2a.json`. «Estimativa» e «Orçamento» constam dos excertos e permaneceram. Não se omitiu nenhuma parte obrigatória dos dois itens.
- V2B-10: os números dos quadros usam os campos de apoio já selados no V2-a. As aspas portuguesas são reconhecidas como pontuação pela auditoria; o nome curto de uma fonte só apoia uma frase quando coincide integralmente com `source`.

## Verificações obtidas e pendentes

| Momento | Comando | Código | Prova |
|---|---|---|---|
| Partida | `npm run build` | 0 | `retoma/portoes-partida/build.log` |
| Partida | `npm run verify` | 0 | `retoma/portoes-partida/verify.log` |
| Partida | `npm run typecheck` | 0 | `retoma/portoes-partida/typecheck.log` |
| Partida | `python3 -m core.gate` | 0 | `retoma/portoes-partida/motor.log` |
| Partida | `RESEARCHHUB_DIR=<motor> npm run check:cruzamento -- --with-origin` | 0 | `retoma/cruzamento-partida.log` |
| Partida | `npm run check:series` | 0 | `retoma/series-partida.log` |
| Implementação | `npm run typecheck` | 0 | `retoma/typecheck-implementacao.log` |
| Implementação comitada | `node tests/discussao/itens.mjs --dados` | 0 | `retoma/declaracoes-comitadas.log` |

A conferência `--dados` só confere as declarações e os apoios. Não executa as plantas de HTML nem mede as integrações. O typecheck da implementação foi executado antes do commit, sobre os mesmos ficheiros que esse commit contém.

Permanecem por executar ou concluir: inventariar as frases extraídas do HTML novo e registar a leitura cruzada como pendente; conferir a célula completa e as plantas; obter os três portões finais e as duas conferências com o motor; confirmar os percursos de dois toques, um toque e um toque até aos recibos; capturar as páginas e os recortes nas edições e larguras mandatadas; inspecionar as imagens; extrair as frases construídas para a direção. Não existe prova final de capturas nem de leitura a frio. Nenhum PNG foi comitado.

Os ficheiros `RELATORIO.*` do lançador não foram comitados. Os sha256 das mudanças de nome estão nos registos da partida e da tentativa seguinte. O registo aberto pode crescer durante a corrida; a igualdade conferida é a de cada mudança de nome. Não houve pedido novo para alojar fontes nem uso da tranca HTTP alternativa.

tokens used: não disponível.

## A retoma 2

Cabeça do código conferido: `1cb1cde0cab39309a101e8fe19335069122108fc`. Motor: `78a5e500be4789cdc5a99618a0b35b0f4f63d912`. Ascendência confirmada na partida, de `main` no sítio e de `master` no motor: códigos 0 e 0. Nenhuma fusão, alteração no motor, linha nova ou publicação nesta retoma.

A V2B-11 fica esclarecida pela direção: a tranca da passagem anterior pertencia a uma aterragem real por `aterrar.sh`; o dono aparecia como `<worktree>` por higienização do guião. Esse nome não permitia identificar o dono. Nesta retoma os pedidos esperaram pela tranca, sem interromper outra corrida. Os intervalos abaixo medem o tempo entre o arranque do pedido pelo escrivão e o início do build, incluindo a aquisição da tranca e a preparação do comando.

| Corrida | Arranque do pedido, UTC | Início do build, UTC | Intervalo, segundos |
|---|---|---|---|
| portoes-a | 2026-10-19T16:37:19Z | 2026-10-19T16:49:32Z | 733 |
| portoes-b | 2026-10-19T17:02:20Z | 2026-10-19T17:42:29Z | 2409 |
| portoes-c | 2026-10-19T17:55:17Z | 2026-10-19T18:12:21Z | 1024 |

Os ficheiros do lançador saíram da worktree por mudança de nome e voltaram no fim de cada corrida. Os sha256 coincidiram antes e depois de cada mudança; o registo aberto cresceu entre a retirada e a reposição. As provas estão em `retoma2/mudancas-de-nome-*.json`. A consulta de processos foi recusada pela sandbox com `PermissionError: [Errno 1] Operation not permitted: 'ps'`; não houve pedido de escalada.

### Os portões e as conferências

Os códigos seguintes foram lidos dos ficheiros `.codigo`, depois de os processos terminarem. Os registos, as cabeças e as horas estão nas pastas de cada corrida. Os relatórios extensos dos alvos ficam integralmente no disco; os ficheiros `alvos-resumo.json` guardam os resultados selecionados, as contagens, a localização e o sha256 dos originais.

| Corrida | build | verify | typecheck | motor |
|---|---|---|---|---|
| `portoes-a` | 1 | 125 | 0 | 0 |
| `portoes-b` | 0 | não escrito | não escrito | não escrito |
| `portoes-c` | 0 | 0 | 0 | não repetido |

A primeira corrida recusou a atribuição do PCP, que usava uma barra entre os nomes. O resolvedor passou a usar `atribuicaoDaLinha`, a mesma função dos recibos, com o separador « · ». As expectativas independentes das células usam esse separador. Isto corrige a execução da V2B-6, sem mudar a decisão nem os nomes selados. O verify dessa corrida ficou por executar, código 125.

Na cabeça final, `RESEARCHHUB_DIR=<motor> npm run check:series`: código 0; `RESEARCHHUB_DIR=<motor> npm run check:cruzamento -- --with-origin`: código 0. Comandos, códigos e saídas em `retoma2/series.*` e `retoma2/cruzamento.*`. O cruzamento conserva um aviso sobre o ficheiro agregado do Orçamento, cujo `built_at` pode mudar; a conferência de cada linha e ficheiro com a origem passou. O portão do motor correu pelo escrivão como `python3 -m core.gate`, na primeira corrida. O código 0 é reutilizado na mesma cabeça do motor, sem alterações; a corrida final repete apenas os três portões do sítio.

A célula dos itens terminou sem erros e com 26 de 26 plantas mordidas. As cinco plantas exigidas correram em cada item e em cada edição: citação sem token, citação alterada, adjetivo junto do nome, opinião sem rótulo e item sem uma parte. A prova completa está em `retoma2/itens.json`. A corrida final inclui `check:primeira`, `check:navegacao`, `check:palavras` e a auditoria das palavras dos itens.

### O inventário e as decisões

O inventário ganhou 58 cadeias extraídas das páginas construídas: 46 de conteúdo e 12 de navegação. As portas compostas usam a marca existente `data-voz`, para que a recolha não as omita por serem ligações. A lista, as classes e as rotas estão em `retoma2/inventario-adicionado.json`; a leitura cruzada permanece assinalada como «por ler». O inventário final não tem cadeias por classificar.

- V2B-12: corrige-se o separador da atribuição para cumprir a V2B-6; nenhum campo do livro-razão muda.
- V2B-13: as portas completas entram no inventário pelo mecanismo `data-voz`, como navegação nas duas edições.
- V2B-14: o guião comum das capturas usa sempre as cinco larguras; a primeira página e todas as secções com portas foram capturadas também nessas larguras, além das duas exigidas.
- V2B-15: a L1 passa do teto medido de 2780 para 2782, pela entrada das duas edições da discussão. O conjunto das páginas anteriores com repetição permanece o mesmo; a regra que conta os destinos não muda. A decomposição, as multiplicidades e as quatro plantas estão em `retoma2/l1-v2b.json`. A fotografia histórica não é apresentada como igualdade de todas as multiplicidades.
- V2B-16: os nomes acessíveis das secções juntam o título do item ao rótulo da parte; as portas de integração têm um alvo de pelo menos 44 px em todas as larguras. Corrigem-se as duas falhas da régua de acessibilidade, sem dispensá-las.
- V2B-17: o teto do escrivão inclui a espera pela tranca. A segunda corrida atingiu cinquenta minutos e foi interrompida depois do build; não escreveu códigos de verify nem de typecheck. O processo de verify terminou depois e guardou o seu JSON, com a L1 e os alvos vermelhos. A tentativa de saída ordenada por SIGTERM, identificada como o próprio pedido, foi recusada pela sandbox. A tranca permaneceu no disco. O pedido seguinte esperou; o resultado do escrivão registou «tranca com mais de quarenta minutos» e «ignora-se». Não a removi à mão. A mensagem integral, higienizada, está em `retoma2/resultado-escrivao-c.json`.
- As V2B-6 a V2B-10 mantêm-se. O item 3 fica para o LR1, porque a afirmação textual do CFP não tem valor nem unidade. Não se criou uma linha para a substituir.

### A prova de aceitação no HTML

- PT: da primeira página à página de discussão e ao item, dois toques; o título de cada item na primeira página oferece ainda um caminho direto de um toque. Da secção `por-funcao` da explicação ao item da Saúde, um toque. Os 14 valores numéricos marcados têm selo adjacente para o recibo em um toque; os 16 recibos distintos das linhas citadas têm destino existente.
- EN: da primeira página à página de discussão e ao item, dois toques; o título de cada item na primeira página oferece ainda um caminho direto de um toque. Da secção `por-funcao` da explicação ao item da Saúde, um toque. Os 14 valores numéricos marcados têm selo adjacente para o recibo em um toque; os 16 recibos distintos das linhas citadas têm destino existente.

A prova está em `retoma2/aceitacao.json`, medida sobre o HTML e com os sha256 das páginas. `check:frases-compostas`, dentro do verify final, executa também os cliques reais a 390 px nas duas edições.

V2B-8, medida sobre o HTML final: 38 portas em 36 páginas, contando as duas edições. São 36 portas por coincidência de linhas, nos recibos e no índice do livro-razão, e 2 portas temáticas, na explicação do Orçamento. As páginas dos temas não têm coincidências nem portas novas. O JSON enumera cada porta, o item, o destino e os identificadores comuns; a célula confere também as ausências.

### As capturas

Captura pelo escrivão, código 0, presa à cabeça `1cb1cde0cab39309a101e8fe19335069122108fc`. Há 410 PNG no disco, 200 páginas inteiras e os respetivos recortes, nas larguras 390, 768, 1024, 1280, 1600 px, nas duas edições. Todos os sha256 foram reconferidos; nenhuma página excedeu a largura da janela e não houve pedidos externos, recursos recusados ou erros do navegador.

As imagens estão em `design/especime-v3/capturas/v2b-2026-10-12/retoma2/`. O `capturas.json` dessa pasta regista cada nome, rota, medida e sha256; `retoma2/capturas-medidas.json` acrescenta as dimensões de cada PNG, incluindo os recortes. Nenhum PNG entrou num commit. A inspeção visual de 34 imagens está registada em `retoma2/inspecao-visual.json`. Os recortes do índice completo são demasiado altos para leitura na redução do visualizador; a presença e os destinos dessas portas foram conferidos pelo HTML e pelas células. A leitura das dimensões gerou dois avisos do Pillow pelo tamanho das imagens, guardados em `capturas-medidas.json`, sem erro de leitura.

A tabela lista as páginas inteiras. As alturas seguem a ordem das larguras 390, 768, 1024, 1280 e 1600 px. Os recortes são os dois itens, o bloco da primeira página, a secção `por-funcao`, a prova dos recibos e a lista do índice do livro-razão.

| Página | Edição | Alturas em px |
|---|---|---|
| `/o-que-se-discute/` | pt | 4114, 3388, 3429, 3531, 3567 |
| `/en/under-discussion/` | en | 4272, 3388, 3429, 3531, 3567 |
| `/` | pt | 8458, 6642, 6052, 5952, 5969 |
| `/en/` | en | 8361, 6707, 6155, 5952, 6040 |
| `/explicacoes/dinheiro-do-estado-2026/` | pt | 6729, 4737, 4786, 4882, 4904 |
| `/en/explainers/dinheiro-do-estado-2026/` | en | 6737, 4670, 4720, 4816, 4837 |
| `/livro-razao/afirmacao-leitao-amaro-saude-oe2027-2026-10-09/` | pt | 4465, 3830, 3137, 3172, 3178 |
| `/en/ledger/afirmacao-leitao-amaro-saude-oe2027-2026-10-09/` | en | 4513, 3830, 3137, 3172, 3178 |
| `/livro-razao/afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09/` | pt | 4053, 3535, 2822, 2857, 2863 |
| `/en/ledger/afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09/` | en | 4076, 3535, 2822, 2857, 2863 |
| `/livro-razao/afirmacao-rtp-saude-queda-oe2027-2026-10-09/` | pt | 4330, 3795, 3040, 3057, 3063 |
| `/en/ledger/afirmacao-rtp-saude-queda-oe2027-2026-10-09/` | en | 4378, 3795, 3040, 3057, 3063 |
| `/livro-razao/` | pt | 75678, 50436, 60251, 60282, 60288 |
| `/en/ledger/` | en | 76225, 50446, 60822, 60852, 60859 |
| `/livro-razao/oe-2027-ppp-rodoviario-encargos-brutos-2027/` | pt | 4336, 3730, 2744, 2779, 2785 |
| `/en/ledger/oe-2027-ppp-rodoviario-encargos-brutos-2027/` | en | 4354, 3722, 2700, 2735, 2742 |
| `/livro-razao/oe-2027-ppp-rodoviario-encargos-liquidos-2027/` | pt | 4329, 3715, 2725, 2760, 2766 |
| `/en/ledger/oe-2027-ppp-rodoviario-encargos-liquidos-2027/` | en | 4316, 3707, 2657, 2691, 2698 |
| `/livro-razao/oe-2027-ppp-rodoviario-receitas-2027/` | pt | 4295, 3722, 2682, 2716, 2723 |
| `/en/ledger/oe-2027-ppp-rodoviario-receitas-2027/` | en | 4312, 3714, 2657, 2691, 2698 |
| `/livro-razao/oe-2027-ppp-total-encargos-liquidos-2027/` | pt | 4332, 3890, 2686, 2734, 2740 |
| `/en/ledger/oe-2027-ppp-total-encargos-liquidos-2027/` | en | 4371, 3882, 2661, 2709, 2715 |
| `/livro-razao/oe-2027-saude-despesa-efetiva-consolidada-2026/` | pt | 4065, 3667, 2488, 2523, 2529 |
| `/en/ledger/oe-2027-saude-despesa-efetiva-consolidada-2026/` | en | 4128, 3684, 2488, 2523, 2529 |
| `/livro-razao/oe-2027-saude-despesa-efetiva-consolidada-2027/` | pt | 4186, 3760, 2578, 2628, 2635 |
| `/en/ledger/oe-2027-saude-despesa-efetiva-consolidada-2027/` | en | 4248, 3777, 2534, 2585, 2591 |
| `/livro-razao/oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026/` | pt | 4745, 4197, 3038, 3072, 3079 |
| `/en/ledger/oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026/` | en | 4862, 4274, 3100, 3135, 3141 |
| `/livro-razao/oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027/` | pt | 4865, 4290, 3084, 3134, 3141 |
| `/en/ledger/oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027/` | en | 4982, 4367, 3109, 3159, 3166 |
| `/livro-razao/oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao/` | pt | 4800, 4293, 3106, 3141, 3147 |
| `/en/ledger/oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao/` | en | 4947, 4334, 3212, 3247, 3253 |
| `/livro-razao/oe-2027-saude-despesa-efetiva-consolidada-variacao/` | pt | 4762, 4258, 3106, 3141, 3147 |
| `/en/ledger/oe-2027-saude-despesa-efetiva-consolidada-variacao/` | en | 4917, 4309, 3106, 3141, 3147 |
| `/livro-razao/oe-2027-saude-despesa-total-consolidada-2026/` | pt | 4091, 3719, 2488, 2523, 2529 |
| `/en/ledger/oe-2027-saude-despesa-total-consolidada-2026/` | en | 4153, 3735, 2488, 2523, 2529 |
| `/livro-razao/oe-2027-saude-despesa-total-consolidada-2027/` | pt | 4212, 3812, 2618, 2668, 2675 |
| `/en/ledger/oe-2027-saude-despesa-total-consolidada-2027/` | en | 4274, 3828, 2574, 2624, 2631 |
| `/livro-razao/oe-2027-saude-despesa-total-consolidada-variacao/` | pt | 4551, 4118, 2927, 2962, 2968 |
| `/en/ledger/oe-2027-saude-despesa-total-consolidada-variacao/` | en | 4681, 4134, 2927, 2962, 2968 |

### As frases tal como renderizam

Extraídas das páginas construídas, com os espaços HTML normalizados e os selos de ligação omitidos. Conservam-se os valores, as citações, as atribuições e as ressalvas mostradas ao leitor.

#### PT · A Saúde no Orçamento: que despesa se está a comparar?

**Como foi dito**

«Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, num documento publicado pela RTP, a 09.10.2026. No mesmo dia, RTP publicou: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.».

**O que as fontes dizem**

O quadro 5.37 do relatório do Orçamento, o programa Saúde, em milhões de euros.

A despesa total consolidada passa de 18 125,9 em 2026 para 17 858,4 em 2027, uma variação de −1,5 %.

A despesa efetiva consolidada passa de 18 062,4, na estimativa, para 17 803,1, no Orçamento, uma variação de −1,4 %.

A despesa efetiva consolidada sem o PRR passa de 17 291,3 para 17 803,1, uma variação de 3,0 %.

**A comparação**

Há duas diferenças de perímetro: a despesa total ou a efetiva, e a despesa com ou sem o PRR. Para ver a diferença que o PRR faz, compara-se a variação da despesa efetiva consolidada com a da despesa efetiva consolidada sem o PRR.

**A conclusão**

O quadro dá variações de sinal contrário conforme o perímetro da despesa; comparar exige dizer que medida se usa em cada caso.

**A recomendação**

Quem cita o orçamento da Saúde diz o perímetro: a despesa total ou a efetiva, com ou sem o PRR.

**A opinião do lugar de direção**

A apresentação pública devia dar o mesmo destaque à despesa total consolidada e à despesa efetiva consolidada, com e sem o PRR. Dizer só a conta que sobe, ou só a que desce, é escolher o que o leitor fica a pensar.

#### PT · As parcerias rodoviárias: a afirmação e os valores do relatório

**Como foi dito**

«Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», Paulo Raimundo · PCP, na Assembleia da República, a 09.10.2026.

**O que as fontes dizem**

O quadro 4.25 do relatório do Orçamento, as parcerias público-privadas, 2027, em milhões de euros.

Os encargos brutos do setor rodoviário são 1 152; as receitas, 263; os encargos líquidos, 889. O total líquido impresso para todos os setores das parcerias é 1 438. Previsão, não execução. As linhas setoriais do quadro não somam exatamente o total impresso; o quadro não explica a diferença. O quadro diz que os valores são de caixa e, quando aplicável, incluem o IVA.

**A comparação**

Nenhum dos quatro valores acima é igual a 1 700 milhões de euros.

**A conclusão**

O excerto citado não diz se o encargo é bruto ou líquido, nem a que ano se refere.

**A recomendação**

Quem cita um encargo com as parcerias diz o quadro, o ano e se é bruto ou líquido.

**A opinião do lugar de direção**

Uma afirmação com um número que o quadro não imprime pede a conta que lhe deu origem; até ela ser mostrada, o leitor fica com os valores do quadro, os brutos, as receitas e os líquidos, sem escolher nenhum deles como o sentido da afirmação.

#### EN · Health in the Budget: which expenditure is being compared?

**As it was said**

«Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, in a document published by RTP, on 09.10.2026. On the same day, RTP published: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.».

**What the sources say**

Table 5.37 of the Budget report, the Health programme, in million euros.

Total consolidated expenditure goes from 18 125,9 in 2026 to 17 858,4 in 2027, a change of −1,5 %.

Consolidated effective expenditure goes from 18 062,4, in the estimate, to 17 803,1, in the Budget, a change of −1,4 %.

Consolidated effective expenditure without the RRP goes from 17 291,3 to 17 803,1, a change of 3,0 %.

**The comparison**

There are two differences of scope: total or effective expenditure, and expenditure with or without the RRP. To see the difference the RRP makes, compare the change in consolidated effective expenditure with the change in consolidated effective expenditure without the RRP.

**The conclusion**

The table gives changes of opposite sign depending on the scope of expenditure; comparing requires saying which measure is used in each case.

**The recommendation**

Whoever quotes the Health budget states the scope: total or effective expenditure, with or without the RRP.

**The editorial seat's opinion**

Public presentation should give the same prominence to total consolidated expenditure and to consolidated effective expenditure, with and without the RRP. Giving only the count that rises, or only the one that falls, is choosing what the reader is left thinking.

#### EN · The road partnerships: the statement and the report's figures

**As it was said**

«Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», Paulo Raimundo · PCP, in the Assembleia da República, on 09.10.2026.

**What the sources say**

Table 4.25 of the Budget report, the public-private partnerships, 2027, in million euros.

Gross charges for the road sector are 1 152; revenue, 263; net charges, 889. The printed net total for all partnership sectors is 1 438. Forecast, not outturn. The sector rows in the table do not add up exactly to the printed total; the table does not explain the difference. The table says the values are on a cash basis and, where applicable, include VAT.

**The comparison**

None of the four values above equals 1 700 million euros.

**The conclusion**

The quoted excerpt does not say whether the charge is gross or net, nor which year it refers to.

**The recommendation**

Whoever quotes a charge for the partnerships states the table, the year and whether it is gross or net.

**The editorial seat's opinion**

A statement with a number the table does not print calls for the calculation behind it; until it is shown, the reader is left with the table's values, gross, revenue and net, without picking any of them as the meaning of the statement.

Não saiu nenhuma parte obrigatória. A única frase opcional omitida continua a ser a do fim do dinheiro do PRR em 2026, sem esse apoio literal, como a V2B-9 já regista. A leitura a frio e a leitura das frases pela direção são etapas posteriores a esta construção.

tokens used: não disponível.

## A correção da leitura (19.10.2026, à noite)

Item 1: quatro parágrafos ligam cada afirmação à linha do quadro; PRR/RRP por extenso, porta para a explicação e atribuição e pontuação corrigidas.
Item 2: a unidade passa para dentro do token, antes do selo; o espaço antes dos sufixos das comparações fica preservado no ecrã.

Cabeça final do código conferido: `f3ac9261221d5f3c1b0b6a248137d4093d53b078`. O relatório e as provas entram num commit posterior, sem alterações ao código nem ao HTML medido. As sete linhas da partida conservam os sha256 de `correcao/partida.json`; não houve alterações no livro-razão. A igualdade dos dois valores de despesa efetiva em 2027 foi confirmada antes da edição: 17 803,1 nas duas linhas.

A entrega fica com verificações pendentes. O escrivão disponível só aceita a corrida completa dos portões ou capturas, e o mandato proíbe a corrida completa e o navegador dentro da sandbox. Foi pedida a execução seletiva, sem resposta até este registo. Não correram `check:frases-compostas` com os cliques reais a 390 px, `check:primeira` completo nem a régua `check:alvos`. As capturas e a conferência estática não substituem esses resultados. Prova da limitação em `correcao/navegador-pendente.json`.

Os códigos seguintes foram lidos dos ficheiros `.codigo`, depois de os comandos terminarem. Não correu a união dos três portões nem o `core.gate` do motor.

| Conferência | Código | Ficheiro |
|---|---:|---|
| build | 0 | `correcao/build.codigo` |
| itens | 0 | `correcao/itens.codigo` |
| palavras | 0 | `correcao/palavras.codigo` |
| html | 0 | `correcao/html.codigo` |
| navegacao | 0 | `correcao/navegacao.codigo` |
| primeira-estatica | 0 | `correcao/primeira-estatica.codigo` |
| l1 | 0 | `correcao/l1.codigo` |
| medicao-html | 0 | `correcao/medicao-html.codigo` |
| capturas | 0 | `correcao/capturas.codigo` |
| capturas-medidas | 0 | `correcao/capturas-medidas.codigo` |

`primeira-estatica` corresponde a `node tests/inicio/primeira-pagina.mjs --prova`, não ao conjunto completo `check:primeira`. A tentativa inicial de `check:palavras` terminou a 1 enquanto outra construção recriava `dist/`: «não há página em dist/ para plantar». A corrida sobre a construção estável passou, com as plantas; o ensaio inicial não é apresentado como resultado da cabeça final.

A célula dos itens passou com 28 de 28 plantas. A planta nova retira a porta da explicação nas duas edições. A célula confere presença, texto, destino existente, posição na parte das fontes, classe da porta e `data-voz`. A auditoria conserva os apoios das linhas já citadas; o inventário retira seis cadeias substituídas e recebe doze cadeias de conteúdo e duas de navegação.

As quatro frases da comparação e as duas corrigidas, extraídas do HTML construído, com os selos omitidos. Os espaços inseparáveis dos milhares são conservados em `correcao/frases.json`.

**PT**

- Comparação 1: Há duas diferenças de perímetro: a despesa total ou a efetiva, e a despesa com ou sem o PRR, o Plano de Recuperação e Resiliência. Para ver a diferença que o PRR faz, compara-se a variação da despesa efetiva consolidada com a da despesa efetiva consolidada sem o PRR.
- Comparação 2: Os números da RTP, a queda, o montante e a diferença, coincidem com a linha da despesa total consolidada do quadro: de 18 125,9 em 2026 para 17 858,4 em 2027, uma variação de −1,5 %.
- Comparação 3: O número do ministro coincide com a variação da linha da despesa efetiva consolidada sem o PRR, 3,0 %; o quadro não diz que conta ele fez.
- Comparação 4: Em 2027 a despesa efetiva consolidada é a mesma com e sem o PRR, 17 803,1 e 17 803,1; a diferença que o PRR faz está toda em 2026, e é por isso que uma linha desce e a outra sobe.
- Como foi dito: «Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, num documento publicado pela RTP, a 09.10.2026. No mesmo dia, a RTP publicou: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.»
- Comparação das parcerias: Nenhum dos quatro valores acima é igual a 1 700 milhões de euros.
- Porta: «O que é a despesa efetiva consolidada →», para `/explicacoes/dinheiro-do-estado-2026/`. Destino existente: sim. Inventariada como navegação: sim.

**EN**

- Comparação 1: There are two differences of scope: total or effective expenditure, and expenditure with or without the RRP, the Recovery and Resilience Plan. To see the difference the RRP makes, compare the change in consolidated effective expenditure with the change in consolidated effective expenditure without the RRP.
- Comparação 2: RTP's figures, the fall, the amount and the difference, match the table's line for total consolidated expenditure: from 18 125,9 in 2026 to 17 858,4 in 2027, a change of −1,5 %.
- Comparação 3: The minister's figure coincides with the change in the line for consolidated effective expenditure without the RRP, 3,0 %; the table does not say which calculation he made.
- Comparação 4: In 2027 consolidated effective expenditure is the same with and without the RRP, 17 803,1 and 17 803,1; the difference the RRP makes is all in 2026, which is why one line falls and the other rises.
- Como foi dito: «Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, in a document published by RTP, on 09.10.2026. On the same day, RTP published: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.»
- Comparação das parcerias: None of the four values above equals 1 700 million euros.
- Porta: «What consolidated effective expenditure is →», para `/en/explainers/dinheiro-do-estado-2026/`. Destino existente: sim. Inventariada como navegação: sim.

Capturas pelo escrivão: 10 páginas inteiras e 30 recortes, 40 PNG, nas duas edições e nas larguras 390, 768, 1024, 1280, 1600 px. Sha256 reconferidos, 0 erros e 0 avisos. Nenhum PNG entra num commit. Os recortes da ligação nova têm entre 45 e 53 px de altura; esta medida da imagem não prova por si a área clicável nem substitui a régua de acessibilidade.

Os nomes abaixo são relativos a `design/especime-v3/capturas/v2b-2026-10-12/correcao/`. Os sha256 de cada imagem e os recursos servidos estão em `capturas.json`; as dimensões estão também em `correcao/capturas-medidas.json` nas medições. O manifesto da raiz foi criado, pois antes só existia `retoma2/capturas.json`, e remete para essa prova histórica sem a alterar.

| Captura | Largura × altura, px |
|---|---:|
| `discussao-pt-390.png` | 390 × 4658 |
| `discussao-pt-390-saude-no-orcamento.png` | 354 × 2279 |
| `discussao-pt-390-parcerias-rodoviarias.png` | 354 × 1432 |
| `discussao-pt-390-porta-explicacao.png` | 323 × 45 |
| `discussao-pt-768.png` | 768 × 3794 |
| `discussao-pt-768-saude-no-orcamento.png` | 529 × 1811 |
| `discussao-pt-768-parcerias-rodoviarias.png` | 529 × 1212 |
| `discussao-pt-768-porta-explicacao.png` | 283 × 45 |
| `discussao-pt-1024.png` | 1024 × 3835 |
| `discussao-pt-1024-saude-no-orcamento.png` | 529 × 1844 |
| `discussao-pt-1024-parcerias-rodoviarias.png` | 529 × 1244 |
| `discussao-pt-1024-porta-explicacao.png` | 283 × 45 |
| `discussao-pt-1280.png` | 1280 × 3937 |
| `discussao-pt-1280-saude-no-orcamento.png` | 528 × 1885 |
| `discussao-pt-1280-parcerias-rodoviarias.png` | 528 × 1285 |
| `discussao-pt-1280-porta-explicacao.png` | 282 × 45 |
| `discussao-pt-1600.png` | 1600 × 3974 |
| `discussao-pt-1600-saude-no-orcamento.png` | 528 × 1900 |
| `discussao-pt-1600-parcerias-rodoviarias.png` | 528 × 1300 |
| `discussao-pt-1600-porta-explicacao.png` | 282 × 45 |
| `discussao-en-390.png` | 390 × 4880 |
| `discussao-en-390-saude-no-orcamento.png` | 354 × 2425 |
| `discussao-en-390-parcerias-rodoviarias.png` | 354 × 1459 |
| `discussao-en-390-porta-explicacao.png` | 354 × 53 |
| `discussao-en-768.png` | 768 × 3794 |
| `discussao-en-768-saude-no-orcamento.png` | 529 × 1866 |
| `discussao-en-768-parcerias-rodoviarias.png` | 529 × 1157 |
| `discussao-en-768-porta-explicacao.png` | 327 × 45 |
| `discussao-en-1024.png` | 1024 × 3835 |
| `discussao-en-1024-saude-no-orcamento.png` | 529 × 1899 |
| `discussao-en-1024-parcerias-rodoviarias.png` | 529 × 1189 |
| `discussao-en-1024-porta-explicacao.png` | 327 × 45 |
| `discussao-en-1280.png` | 1280 × 3937 |
| `discussao-en-1280-saude-no-orcamento.png` | 528 × 1940 |
| `discussao-en-1280-parcerias-rodoviarias.png` | 528 × 1230 |
| `discussao-en-1280-porta-explicacao.png` | 326 × 45 |
| `discussao-en-1600.png` | 1600 × 3974 |
| `discussao-en-1600-saude-no-orcamento.png` | 528 × 1955 |
| `discussao-en-1600-parcerias-rodoviarias.png` | 528 × 1245 |
| `discussao-en-1600-porta-explicacao.png` | 326 × 45 |

As outras páginas não foram recapturadas. O manifesto da retoma 2 contém 40 páginas no total, incluindo as duas páginas da discussão. Há, portanto, 38 páginas restantes, não quarenta: todos os 38 sha256 são iguais aos da retoma 2, medidos por guião. Os pares completos estão em `correcao/paginas-inalteradas.json`.

As primeiras capturas mostraram o número colado à unidade, apesar do espaço presente no HTML. A regra local `white-space: pre` preserva esse espaço apenas nos sufixos das partes de comparação. As capturas finais substituem as da primeira tentativa, feita na cabeça anterior; as imagens do ensaio ficam em `correcao-preparacao/` e não entram no commit. A inspeção visual final está em `correcao/inspecao-visual.json`.

Decisões desta passagem:

- V2B-18: preservar no ecrã o espaço antes da unidade e do sinal de percentagem, com uma regra local às comparações reescritas. O token mantém as palavras exatas do mandato; não se altera a tipografia partilhada.
- V2B-19: conservar a L1 e o teto em 2782. A porta nova não aumenta a contagem de páginas com destinos repetidos. Os tokens das novas frases repetem os recibos já citados nas fontes; a decomposição fica em `correcao/l1-destinos.json` e a comparação em `correcao/l1.json`.
- V2B-20: registar a contagem real de 38 páginas inalteradas no manifesto histórico, sem fabricar duas páginas para chegar às quarenta indicadas no pedido.
- V2B-21: não substituir os portões com navegador por capturas nem contornar o escrivão com uma corrida completa proibida. As três verificações ficam explicitamente pendentes.

O achado 6, o 13 e as duas correções de frase do 15 foram tratados no âmbito pedido. Não se acrescentou uma definição da administração central ao programa Saúde nem um «[sic]» à citação. Os restantes Minor ficam para a higiene, como mandatado.

A consulta de leitura ao motor encontrou a worktree limpa na cabeça `570e41199dc184b7def83f22f571273367e8fae2`, diferente da cabeça indicada no mandato. Não houve edição, commit, fusão nem portão do motor nesta passagem. `correcao/motor-observado.json` regista a observação; não se afirma que a cabeça seja a prevista.

Não houve push nem publicação. O trailer de sessão foi copiado do commit de direção na cabeça de partida, porque o mandato não forneceu uma linha `Claude-Session:` explícita. Os ficheiros `RELATORIO.escrivao.log`, `RELATORIO.pontos.json` e `RELATORIO-correcao.md` não entram nos commits.
