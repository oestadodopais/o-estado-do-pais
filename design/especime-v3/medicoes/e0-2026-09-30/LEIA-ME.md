# E0 · As linhas do projeto e a correção do desemprego

O conteúdo e as provas locais estão medidos. Os três portões da cabeça final ainda estão por correr.

Construção por Codex `gpt-6.1-sol`, no ramo `e0-2026-09-30`. Base: `07549ee1e9ec2b39186f9e9f13eeac4914bf5e76`. Cabeça desta medição: `1a281e1ddf9603aa37009c8bdf2b1f7c6ee533f0`.

## Mandato e medidas

O guião [medir-e0.mjs](medir-e0.mjs) escreve [medidas.json](medidas.json), com 14 medidas e um conhecido-positivo por medida. O código do medidor confirma as medições e as plantas; a aceitação completa exige também os portões na cabeça final. O §0 do brief foi reproduzido pelo seu guião antes da mudança.

| # | Mandato | Medida e resultado |
| --- | --- | --- |
| 1 | O lugar do projeto | O resolvedor aceita a chave declarada, com o nome O Estado do País e a porta de Correções nas duas edições. A A3 recusa a falta da declaração; a A1 recusa uma declaração falsa de Portugal. |
| 2 | As correções do desemprego | As 2 linhas estão em 6,0, cada uma com uma correção de 6 para 6,0, datada de 30.09.2026 e selada pelo guião. Os excertos conservam 6.0. |
| 3 | A recontagem | O contador está em 5, com uma atualização de 3 para 5. A contagem direta do livro dá 5. O ledger:check dirigido deu 0 em [ensaios/livro.codigo](ensaios/livro.codigo). |
| 4 | O que o leitor vê | A primeira página e o cartão do desemprego mostram 6,0 % nas duas edições. O registo mostra as 3 mudanças em cada edição, com Portugal nas correções e O Estado do País na recontagem. |
| 5 | A célula e as decisões | A célula [linhas-da-casa.mjs](../../../../tests/inicio/linhas-da-casa.mjs) corre em check:pais, portanto no build e no verify. As 8 plantas mordem. A lista das decisões fica abaixo. |
| 6 | O relatório e as provas | Este relatório, o medidor, as plantas, o custo e as 12 capturas estão nesta entrega. Os comprovativos finais atualizam-se depois do commit de entrega. |

## O diagnóstico medido e o mecanismo

A parte do diagnóstico que atribuía ao selador uma exigência de localizador externo não se reproduziu. A [prova do estado anterior](estado-anterior.json) recompõe em memória as linhas da base e confirma que os bytes do selador continuam iguais aos dessa base. Sela a entrada 3 para 5 numa cópia de uma linha com source_url nulo e derivação declarada, com código 0. O registo das mudanças recusa a mesma entrada sem lugar, nas duas edições. A prova corre também na cabeça final, sem checkout. A própria prova N1b já distinguia estas duas coisas.

Parou-se nesse ponto da interpretação: não se reescreveu um selador que já aceita as linhas do projeto. A localização continua a ser a derivação. O [ensaio para E1](prova-e1.json) usa o mesmo selador numa cópia: conserva as 4 entradas de Évora e acrescenta uma atualização. A linha real de Évora fica em 6.

[atualizar-linhas.mjs](atualizar-linhas.mjs) acrescenta as entradas datadas e chama o selador para cada linha. As 9 listas anteriores da história selada conservam os seus prefixos. Só mudaram os valores das 3 linhas autorizadas. Nenhum componente, vista ou folha de estilo mudou, incluindo a anatomia do cartão reservada ao K2. Nenhum ficheiro do repositório foi apagado.

O lugar do projeto entra pela mesma resolução de chave que a União Europeia. O campo study não atribui automaticamente esse lugar. A segunda leitura da A3 verifica a declaração contra a origem interna e a expressão da contagem, mas não substitui a declaração em falta. As decisões §1.144, §1.145 e §1.146 continuam a orientar o mecanismo e o seu uso no E1.

A célula permanente conserva as entradas históricas do E0, compara o valor atual com a última entrada selada e reconta todas as correções. Permite que a história cresça numa atualização futura. O medidor deste bloco exige os valores de aceitação 6,0, 6,0 e 5.

## Plantas e conferências dirigidas

As [plantas](plantas.json) usam processos isolados e cópias em memória. A planta A retira o lugar e exige código 1 com a queixa A3 do portão real, na mesma corrida que aceita a declaração. O resolvedor também recusa a falta. Uma declaração falsa de Portugal é recusada pela segunda leitura. As plantas B retiram cada entrada selada, separadamente, e exigem código 1 com a queixa de história do valor. Há ainda uma planta que retira o decimal da primeira página e outra que retira o lugar do registo inglês. Todas as 8 plantas mordem; os ficheiros reais ficam intactos.

As conferências dirigidas do livro, da travessia, dos tipos e do país passaram. Os primeiros ensaios da célula falharam por um seletor de planta que nomeava a linha irmã, ausente da primeira página, e por rótulos esperados com maiúscula onde o registo usa minúscula. Os dois erros da célula foram corrigidos; as saídas anteriores e a corrida limpa ficam em ensaios. A primeira tentativa de captura foi impedida pela restrição do servidor local; a corrida com acesso ao servidor local terminou com código 0.

## Capturas e inspeção

As 12 imagens estão em `design/especime-v3/capturas/e0-2026-09-30/`: primeira página integral, cartão do desemprego em Emprego e secção integral das mudanças, a 390 e a 1 280 px, nas duas edições. O [manifesto](capturas-e0.json) guarda cabeça construída, dimensões e SHA-256. O medidor recalculou todos os resumos e encontrou 0 problemas de captura ou transbordo.

O captor segue os guiões N1: servidor efémero local, fontes carregadas, pedidos externos recusados, movimento reduzido e escala do dispositivo fixa. A inspeção visual incluiu a primeira página e a secção das mudanças em português a 390 px, e o cartão em português a 390 px e em inglês a 390 e a 1 280 px. A disposição do cartão existente mantém-se.

## Commits

- `bd7886ed`: Declara o lugar do projeto no registo das mudanças.
- `96b058df`: Corrige a precisão do desemprego e sela a recontagem.
- `1a281e1d`: Guarda a história E0 sem fixar a próxima recontagem.

O último commit de entrega inclui [RESPOSTA-construtor-e0.md](RESPOSTA-construtor-e0.md). A cabeça final lê-se dos ficheiros .cabeca e da resposta de fecho da sessão, fora do ramo.

## Portões

Os três comandos finais correm depois do commit de entrega, cada um no seu comando. Esta tabela será regenerada a partir dos ficheiros acabados de escrever.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
| `npm run build` | Por correr | Por escrever | Por medir |
| `npm run verify` | Por correr | Por escrever | Por medir |
| `npm run typecheck` | Por correr | Por escrever | Por medir |

Antes de cada corrida inteira, consulta-se a lista de processos da máquina. Os registos passam pela limpeza dos caminhos e do nome da conta local. O medidor encontrou 0 ficheiros com dados da máquina entre os ficheiros do bloco.

Um commit não pode conter o seu próprio identificador. Os comprovativos finais, a atualização deste relatório, a resposta, o custo e o medidas.json ficam na árvore de trabalho depois do último commit, sem fazer outro commit que invalidasse a cabeça conferida. Os guiões que os reproduzem estão no ramo. A cabeça das capturas está declarada no manifesto e pode anteceder o commit que só entrega documentação e provas.

## Decisões em vigor nos ficheiros tocados

A leitura anterior aos ficheiros existentes mostrou a §1.117 em mudancas e a §1.127 em check-pais. Ambas se conservaram. A §1.146 é citada nas novas guardas do E0. A lista final foi obtida por `python3 scripts/leituras/decisoes-em-vigor.py --intervalo 07549ee1e9ec2b39186f9e9f13eeac4914bf5e76..HEAD`, também guardada em [decisoes-em-vigor.txt](decisoes-em-vigor.txt).

```text
§1.38 · A ortografia do sítio passa a ser uma só
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/livro.log:241 (perto do diff)
§1.117 · A peça 3 do B1, o país: o Codex constrói, o lugar de direção corrige o seu próprio guião, o Opus lê a frio
    src/lib/mudancas.mjs:205
§1.127 · O brief do B2: o bloco do veredicto em duas peças, o que o lugar de direção mediu antes de o escrever, e as decisões que ele fixa
    scripts/check-pais.mjs:296
§1.146 · O orçamento gasta-se até ao fim por decisão do diretor, o GPT-6.1 Sol entra (a recusa era do CLI), o leitor passa a ele e o construtor ensaia-se com ele no E0; e a aterragem dos registos do E1
    scripts/check-pais.mjs:171 (perto do diff)
    src/data/lugar-das-linhas.mjs:22 (perto do diff)
    src/lib/mudancas.mjs:101 (perto do diff)
    tests/inicio/linhas-da-casa.mjs:1 (perto do diff)
4 decisão(ões) citada(s) em 45 ficheiro(s)
```

## Custo e limites

Amostra de 2026-09-30T21:13:01.206887+00:00, lida dos eventos token_count da sessão identificada pelo ambiente: 224 305 símbolos de entrada sem cache mais saída; 5 603 761 no total com cache; 5 379 456 em cache. Tempo decorrido desde o início da sessão até à amostra: 1337,3 segundos. Modelo efetivamente lido: `gpt-6.1-sol`. Os revisores automáticos das aprovações têm os seus próprios contadores em [custo.json](custo.json).

É uma amostra anterior ao fecho, não um custo em euros nem o contador final do terminal. A leitura a frio de outra família prevista no brief não foi feita nesta construção. O E1 continua a ser outro bloco. Não houve publicação.

## O que fica por fazer

Correr os três portões na cabeça do commit de entrega, reler os códigos, regenerar as medidas e esta resposta. A leitura a frio e a aterragem pertencem à fase seguinte.
