# V2-b: implementação dos dois itens, aceitação por demonstrar

A entrega não está aceite. A implementação está comitada, mas a corrida sobre o código novo não conseguiu adquirir a tranca partilhada. Faltam a conferência do HTML construído, o inventário das frases efetivamente rendidas, os portões finais, as provas de navegação e as capturas. Não houve publicação nem push.

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
