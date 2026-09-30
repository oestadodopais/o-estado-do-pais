# E0 · As linhas do projeto e a correção do desemprego

O conteúdo e as provas locais estão medidos. Os três portões da cabeça final ainda estão por correr.

Construção por Codex `gpt-6.1-sol`, no ramo `e0-2026-09-30`. Base: `07549ee1e9ec2b39186f9e9f13eeac4914bf5e76`. Cabeça do ramo: `29f39453a55b7f14157c8c59725a26e625431da4`. Cabeça das medidas: `52eae9be3c6c1b1d28dfb8f0cbb1053c4956b79c`.

## Mandato e medidas

O guião [medir-e0.mjs](medir-e0.mjs) escreve [medidas.json](medidas.json), com 14 registos de medida e as provas dos detetores. A E0b revê os positivos do decimal da fonte, do diff e dos códigos dos portões, em [detetores-e0b.json](detetores-e0b.json). A aceitação completa exige também os portões na cabeça final. O §0 do brief foi reproduzido pelo seu guião antes da mudança.

| # | Mandato | Medida e resultado |
| --- | --- | --- |
| 1 | O lugar do projeto | O resolvedor aceita a chave declarada, com o nome O Estado do País e a porta de Correções nas duas edições. A A3 recusa a falta da declaração; a A1 recusa uma declaração falsa de Portugal. |
| 2 | As correções do desemprego | As 2 linhas estão em 6,0, cada uma com uma correção de 6 para 6,0, datada de 30.09.2026 e selada pelo guião. Os excertos conservam 6.0. |
| 3 | A recontagem | O contador está em 5, com uma atualização de 3 para 5. A contagem direta do livro dá 5. O ledger:check dirigido deu 0 em [ensaios/livro.codigo](ensaios/livro.codigo). |
| 4 | O que o leitor vê | A primeira página e o cartão do desemprego mostram 6,0 % nas duas edições. O registo mostra as 3 mudanças em cada edição, com Portugal nas correções e O Estado do País na recontagem. |
| 5 | A célula e as decisões | A célula [linhas-da-casa.mjs](../../../../tests/inicio/linhas-da-casa.mjs) corre em check:pais, portanto no build e no verify. As 8 plantas mordem. A lista das decisões fica abaixo. |
| 6 | O relatório e as provas | Este relatório, o medidor, as plantas, o custo e as 12 capturas estão nesta entrega. Os comprovativos finais atualizam-se depois do commit de entrega. |

## O diagnóstico medido e o mecanismo

A [prova do estado anterior](estado-anterior.json), executada na cabeça `29f39453a55b7f14157c8c59725a26e625431da4`, recompõe em memória as linhas da base `07549ee1e9ec2b39186f9e9f13eeac4914bf5e76` e confirma que os bytes do selador continuam iguais aos dessa base. Sela a entrada 3 para 5 numa cópia de uma linha com source_url nulo e derivação declarada, com código 0. O registo das mudanças recusa a mesma entrada sem lugar, nas duas edições. A cabeça escrita no comprovativo é a da execução, e a base recomposta é outro campo.

O selador não precisou de mudar. A localização continua a ser a derivação. O [ensaio para E1](prova-e1.json) usa o mesmo selador numa cópia: conserva as 4 entradas de Évora e acrescenta uma atualização. A linha real de Évora fica em 6. A prova correu na cabeça `29f39453a55b7f14157c8c59725a26e625431da4`.

[atualizar-linhas.mjs](atualizar-linhas.mjs) acrescenta as entradas datadas e chama o selador para cada linha. As 9 listas anteriores da história selada conservam os seus prefixos. Só mudaram os valores das 3 linhas autorizadas. A E0b altera RegistoCorrecoes para imprimir também os nomes lidos de campos do livro. A anatomia do cartão reservada ao K2, as vistas e as folhas de estilo conservaram-se. Nenhum ficheiro do repositório foi apagado.

O lugar do projeto entra pela mesma resolução de chave que a União Europeia. O campo study não atribui automaticamente esse lugar. A segunda leitura da A3 verifica a declaração contra a origem interna e a expressão da contagem, mas não substitui a declaração em falta. As decisões §1.144, §1.145 e §1.146 continuam a orientar o mecanismo e o seu uso no E1.

A célula permanente conserva as entradas históricas do E0, compara o valor atual com a última entrada selada e reconta todas as correções. Permite que a história cresça numa atualização futura. O medidor deste bloco exige os valores de aceitação 6,0, 6,0 e 5.

## Plantas e conferências dirigidas

As [plantas](plantas.json) usam processos isolados e cópias em memória. A planta A retira o lugar e exige código 1 com a queixa A3 do portão real, na mesma corrida que aceita a declaração. O resolvedor também recusa a falta. Uma declaração falsa de Portugal é recusada pela segunda leitura. As plantas B retiram cada entrada selada, separadamente, e exigem código 1 com a queixa de história do valor. Há ainda uma planta que retira o decimal da primeira página e outra que retira o lugar do registo inglês. Todas as 8 plantas mordem; os ficheiros reais ficam intactos.

As conferências dirigidas do livro, da travessia, dos tipos e do país passaram. Os primeiros ensaios da célula falharam por um seletor de planta que nomeava a linha irmã, ausente da primeira página, e por rótulos esperados com maiúscula onde o registo usa minúscula. Os dois erros da célula foram corrigidos; as saídas anteriores e a corrida limpa ficam em ensaios. A primeira tentativa de captura foi impedida pela restrição do servidor local; a corrida com acesso ao servidor local terminou com código 0.

Uma primeira corrida dos três portões passou a zero, mas o guião dos comprovativos marcou erradamente os artefactos como código por registar: retirava o espaço inicial do formato porcelain antes de ler as colunas. A [prova do estado da árvore](estado-da-arvore.json) reproduz esse falso positivo e confirma que alterações de código ou do livro continuam a ser recusadas. Corrigiu-se a leitura; os portões serão repetidos na cabeça final. Os primeiros comprovativos conservam-se em ensaios.

## Capturas e inspeção

As 12 imagens PNG existem no ramo em `design/especime-v3/capturas/e0-2026-09-30/`: primeira página integral, cartão do desemprego em Emprego e secção integral das mudanças, a 390 e a 1 280 px, nas duas edições. Não entram no pacote da leitura a frio por serem binárias. O [manifesto](capturas-e0.json) guarda a cabeça construída `52eae9be3c6c1b1d28dfb8f0cbb1053c4956b79c`, dimensões e SHA-256. O medidor recalculou todos os resumos e encontrou 0 problemas de captura ou transbordo.

O captor segue os guiões N1: servidor efémero local, fontes carregadas, pedidos externos recusados, movimento reduzido e escala do dispositivo fixa. A inspeção visual incluiu a primeira página e a secção das mudanças em português a 390 px, e o cartão em português a 390 px e em inglês a 390 e a 1 280 px. A disposição do cartão existente mantém-se.

## Commits

- `bd7886ed`: Declara o lugar do projeto no registo das mudanças.
- `96b058df`: Corrige a precisão do desemprego e sela a recontagem.
- `1a281e1d`: Guarda a história E0 sem fixar a próxima recontagem.
- `b52713ad`: Entrega as provas, as capturas e o relatório do E0.
- `97ade15e`: Lê as decisões nos textos e conserva as capturas binárias.
- `52eae9be`: Preserva as colunas de estado nos comprovativos E0.
- `70e12554`: E0: os comprovativos finais, o relatório atualizado e os registos dos portões, deixados na árvore pelo construtor depois do último commit.
- `30fbc01d`: E0b: a leitura a frio do E0 pelo Claude Opus 5.5 (cinco plantas em cinco), com o registo das plantas e a triagem do lugar de direção, e o mandato da passagem E0b.
- `728ffc67`: M46: os três portões com a tranca da máquina num ficheiro da pasta comum do Git, no lugar da procura de processos que abria sessões do revisor automático do Codex.
- `4c1d39f0`: Nomeia cada medida no registo e simplifica as razões E0.
- `2858cead`: Exercita os detetores do medidor com positivos da corrida.
- `bd39e8bf`: Data o contador pela recontagem e recusa datas anteriores.
- `5aece940`: Entrega a E0b e documenta a paragem por fonte do limiar.
- `baf8c5dd`: Admite só o campo do nome na própria entrada do registo.
- `29f39453`: Guarda a primeira corrida E0b e a prova da guarda dos nomes.

O último commit de entrega inclui [RESPOSTA-construtor-e0.md](RESPOSTA-construtor-e0.md). A cabeça final lê-se dos ficheiros .cabeca e da resposta de fecho da sessão, fora do ramo.

## Portões

Os três comandos finais correm depois do commit de entrega, cada um no seu comando. Esta tabela será regenerada a partir dos ficheiros acabados de escrever.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
| `npm run build` | [0](portoes/e0b/build.codigo) | `52eae9be3c6c1b1d28dfb8f0cbb1053c4956b79c` | 97,9 |
| `npm run verify` | [0](portoes/e0b/verify.codigo) | `52eae9be3c6c1b1d28dfb8f0cbb1053c4956b79c` | 649 |
| `npm run typecheck` | [0](portoes/e0b/typecheck.codigo) | `52eae9be3c6c1b1d28dfb8f0cbb1053c4956b79c` | 0,2 |

Na E0b, os portões inteiros correm pelo guião scripts/leituras/portoes.sh, que toma a tranca comum do Git (M46). Os registos passam pela limpeza dos caminhos e do nome da conta local. O medidor encontrou 0 ficheiros com dados da máquina entre os ficheiros do bloco.

O typecheck executa tsc com tsconfig.check.json, allowJs, checkJs, strict e noEmit. Inclui src/tipos.d.ts, astro.config.mjs, site.config.mjs e os ficheiros .mjs de src/lib, src/data e src/i18n; exclui dist e src/data/sobre.mjs. Portanto confere os dados de nomes alterados nesta passagem. Componentes .astro, scripts, testes e guiões das medições ficam fora desse programa. O código zero não significa uma conferência de tipos desses ficheiros; o build e as células exercitam-nos por outras vias.

Um commit não pode conter o seu próprio identificador. Os comprovativos finais, a atualização deste relatório, a resposta, o custo e o medidas.json ficam na árvore de trabalho depois do último commit, sem fazer outro commit que invalidasse a cabeça conferida. Os guiões que os reproduzem estão no ramo. A cabeça das capturas está declarada no manifesto e pode anteceder o commit que só entrega documentação e provas.

## Decisões em vigor nos ficheiros tocados

A leitura anterior aos ficheiros existentes mostrou a §1.117 em mudancas e a §1.127 em check-pais. Ambas se conservaram. A §1.146 é citada nas novas guardas do E0. A lista final foi obtida por `python3 scripts/leituras/decisoes-em-vigor.py` com os caminhos explícitos dos textos tocados. O modo por intervalo falha ao tentar ler uma captura PNG; o fecho passou a dar-lhe apenas texto. O comando completo e os caminhos estão em [decisoes-em-vigor.json](decisoes-em-vigor.json), e a lista em [decisoes-em-vigor.txt](decisoes-em-vigor.txt).

```text
§1.3 · Numa linha derivada, os campos de proveniência podem ser `null`
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:86
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:1
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-anterior.log:11582
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-cabeca-97ade15e.log:11582
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1445
    design/especime-v3/medicoes/e0-2026-09-30/portoes/build.log:11582
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1445
§1.5 · A linha de método e a linha de autoria não são traduzidas
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:94
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:9
    src/data/nomes-das-medidas.mjs:140
    src/data/nomes-das-medidas.mjs:6
§1.19 · Os estudos migram para dois sítios, não um
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:99
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:14
    scripts/gate-html.mjs:1193
    scripts/gate-html.mjs:5237
    scripts/gate-html.mjs:8786
§1.24 · O livro-razão passou a ter páginas, e o selo passou a ser uma porta
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:103
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:18
    scripts/gate-html.mjs:142
    scripts/gate-html.mjs:147
    scripts/gate-html.mjs:2713
    scripts/gate-html.mjs:2869
    scripts/gate-html.mjs:3543
    scripts/gate-html.mjs:3747
    scripts/gate-html.mjs:3761
§1.31 · O motor e o publicador, e os dois campos que o material de Évora pediu
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:111
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:26
    scripts/gate-html.mjs:2592
    scripts/gate-html.mjs:856
    scripts/gate-html.mjs:879
§1.34 · O primeiro tipo de página de município, e o que ele se recusa a dizer
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:115
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:30
    scripts/gate-html.mjs:3204
    scripts/gate-html.mjs:3313
    scripts/gate-html.mjs:3986
    scripts/gate-html.mjs:7075
§1.36 · Os dez defeitos que a medição da confiança encontrou, e o que se fez a cada um
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:120
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:35
    scripts/gate-html.mjs:5067
§1.38 · A ortografia do sítio passa a ser uma só
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:122
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:37
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-anterior.log:250
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-cabeca-97ade15e.log:250
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-datas-livro.log:241
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-livro.log:241
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/build.log:250
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/verify.log:245
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/livro.log:241
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:245
    design/especime-v3/medicoes/e0-2026-09-30/portoes/build.log:250
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:245
§1.39 · O sítio passa a dizer o que é, e o Método a provar o que faz
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:133
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:48
    scripts/gate-html.mjs:4942
    scripts/gate-html.mjs:7955
    scripts/gate-html.mjs:8654
§1.40 · A agenda: o que se mede agora, e nada sai dela em silêncio
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:137
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:52
    scripts/gate-html.mjs:268
    scripts/gate-html.mjs:360
    scripts/gate-html.mjs:3850
    scripts/gate-html.mjs:78
§1.41 · A revisão cruzada do bloco V, e o que ela mudou
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:142
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:57
    scripts/gate-html.mjs:3005
    scripts/gate-html.mjs:3048
§1.42 · Segunda revisão cruzada do bloco V
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:145
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:60
    scripts/gate-html.mjs:3027
    scripts/gate-html.mjs:3048
    scripts/gate-html.mjs:3419
    scripts/gate-html.mjs:7366
§1.44 · A revisão cruzada da identidade v2
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:150
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:65
    scripts/gate-html.mjs:871
§1.47 · O bloco T: a página da linha passa a ser o recibo, com dados a sério
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:152
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:67
    scripts/gate-html.mjs:880
§1.64 · A parte 3: as páginas de leitura constroem-se dos registos de conteúdo do motor
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:154
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:69
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-anterior.log:362
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-cabeca-97ade15e.log:362
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/build.log:362
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/verify.log:357
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:357
    design/especime-v3/medicoes/e0-2026-09-30/portoes/build.log:362
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:357
    scripts/gate-html.mjs:3962
    scripts/gate-html.mjs:85
    scripts/gate-html.mjs:8654
§1.68 · As páginas dos 308 concelhos
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:165
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:80
    scripts/gate-html.mjs:4749
    scripts/gate-html.mjs:93
§1.82 · Correções pequenas, quinta passagem (I91, segunda metade; I92): a língua dos nomes e dos rótulos na edição inglesa
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:168
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:83
    scripts/gate-html.mjs:1594
§1.90 · As linhas do primeiro domínio da primeira vaga: economia e finanças públicas com trabalho, do inventário ao livro-razão
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:170
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:85
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1215
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1216
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1217
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1218
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1220
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1215
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1216
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1217
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1218
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1220
§1.91 · A cabeça nova como contentor: a faixa de cartões, o mapa como navegação, as três camadas com a mesma cabeça
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:183
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:98
    scripts/gate-html.mjs:5842
    scripts/gate-html.mjs:6747
    scripts/gate-html.mjs:7969
    scripts/gate-html.mjs:852
§1.108 · A manhã de 15.09: o diretor na primeira página no ar, a regra das capturas antes de aterrar, e a primeira página à frente do descarregamento
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:188
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:103
    scripts/gate-html.mjs:4134
    scripts/gate-html.mjs:4190
    scripts/gate-html.mjs:4331
§1.109 · A regra 9 do Método deixa de nomear o diretor
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:192
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:107
    scripts/gate-html.mjs:4135
    scripts/gate-html.mjs:4190
    scripts/gate-html.mjs:4331
§1.115 · Sete nomes do INE por conferir estiveram no ar como nomes oficiais: a correção, e o que muda para não voltar a acontecer
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:196
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:111
    src/data/nomes-das-medidas.mjs:138
§1.117 · A peça 3 do B1, o país: o Codex constrói, o lugar de direção corrige o seu próprio guião, o Opus lê a frio
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:200
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:83
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:115
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:18
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:96
    src/lib/mudancas.mjs:205
§1.118 · O M3, a segunda metade: a conferência estrutural no motor, e os nomes confirmados de volta aos recibos
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:207
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:122
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/verify.log:646
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:646
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:646
§1.119 · A I129: o grupo etário passa a estar escrito na linha e na definição, e a célula que não deixa uma definição contradizer a sua linha
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:212
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:127
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/verify.log:645
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:645
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:645
§1.120 · «O que mudou» no seu lugar: a página do país curta, o registo inteiro numa página, e dois erros de medição do lugar de direção
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:217
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:132
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/verify.log:644
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:644
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:644
    scripts/gate-html.mjs:4156
§1.127 · O brief do B2: o bloco do veredicto em duas peças, o que o lugar de direção mediu antes de o escrever, e as decisões que ele fixa
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:223
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:83
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:138
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:18
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:96
    scripts/check-pais.mjs:296
§1.138 · O nome e o utilizador fora da árvore pública: o pedido do diretor de 29.09.2026, a auditoria dos segredos, a redação, e o detetor do nome alargado
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:230
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:145
    scripts/gate-html.mjs:228
§1.140 · Onde Portugal fica entre os 27: as séries por país no livro-razão, a faixa da União nos dez cartões, a média da União de volta ao cartão da sobrecarga com a ressalva da Comissão, e a aterragem
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:232
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:147
    scripts/gate-html.mjs:19
    scripts/gate-html.mjs:41
§1.144 · O N1 construído pelo Codex e lido a frio duas vezes pelo Opus: uma porta por assunto, a correção adiada do desemprego, e a primeira medida da M43
    design/especime-v3/critica/LEITURA-e0-2026-09-30.md:5
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:235
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:28
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:150
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:56
§1.145 · Os estudos de Évora passam de seis a quatro (o E1): as contas da câmara, quem governou, a economia e o dinheiro de fora, e o Évora 2027, com o que se repete dito uma vez e o que se contradiz reconciliado; e a aterragem do N1
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:241
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:28
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:156
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:56
§1.146 · O orçamento gasta-se até ao fim por decisão do diretor, o GPT-6.1 Sol entra (a recusa era do CLI), o leitor passa a ele e o construtor ensaia-se com ele no E0; e a aterragem dos registos do E1
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:246
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:28
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:83
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:161
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:56
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:96
    scripts/check-pais.mjs:171
    src/data/lugar-das-linhas.mjs:22
    src/lib/mudancas.mjs:101
    tests/inicio/linhas-da-casa.mjs:1
32 decisão(ões) citada(s) em 176 ficheiro(s)
```

## Custo e limites

Amostra de 2026-09-30T21:58:14.651847+00:00, lida dos eventos token_count da sessão identificada pelo ambiente: 401 031 símbolos de entrada sem cache mais saída; 14 364 423 no total com cache; 13 963 392 em cache. Tempo decorrido desde o início da sessão até à amostra: 4050,7 segundos. Modelo efetivamente lido: `gpt-6.1-sol`. Os revisores automáticos das aprovações têm os seus próprios contadores em [custo.json](custo.json).

É uma amostra anterior ao fecho, não um custo em euros nem o contador final do terminal. A amostra original do E0 conserva-se em [custo-e0-original.json](custo-e0-original.json). O mandato E0b regista o contador final do E0, na linha tokens used, em 412 261 símbolos; essa proveniência está em [custo-final-e0.json](custo-final-e0.json). A leitura a frio do E0 está em design/especime-v3/critica/LEITURA-e0-2026-09-30.md e originou esta passagem. O E1 continua a ser outro bloco. Não houve publicação.

## O que fica por fazer

Correr os portões E0b na cabeça final, reler os códigos e regenerar as medidas. O estado do mandato E0b está na secção seguinte. Falta a aterragem.

## E0b

O ponto 1 do mandato está parado por fonte. Os restantes pontos estão implementados; faltam os portões da cabeça final e as medidas do HTML renovado. Cabeça desta passagem: `29f39453a55b7f14157c8c59725a26e625431da4`; base: `728ffc67a702e4912f4919b8a8b356e28a66ea63`.

### O mandato e o que se mediu

| # | Mandato | Resultado e prova |
| --- | --- | --- |
| 1 | Limiar do Procedimento no cartão | Parado. A página atual da Comissão lista a taxa com limiar de 10 %. O Eurostat lista a média de três anos entre os indicadores adicionais e publica a fórmula U(t)/LF(t). Não se alteraram o limiar, o veredicto, a ressalva nem a nota do cartão para afirmar o contrário. |
| 2 | Nomes e razões do registo | A declaração da contagem dá Correções publicadas e Published corrections. O componente também imprime os nomes lidos dos campos da fonte, conservando as marcas de campo e de língua. As razões das três entradas usam a fonte e as duas correções publicadas hoje. A conferência do HTML fica para os portões finais. |
| 3 | Positivos do medidor | Os três detetores foram exercitados na cabeça `bd39e8bf5d8873c881d2d17fe0dc11c68506b9c7`. Leem os dois campos excerpt; encontram RegistoCorrecoes no diff real e uma planta do cartão; leem códigos 0 e 1 de processos desta corrida e recusam os mesmos ficheiros envelhecidos. |
| 4 | Datas do contador | Valor 5; reference_date e access_date em 2026-09-30; edição 30.09.2026. A nota explica a recontagem. A planta da data antiga exige a queixa E0b datas. |
| 5 | Relatório verificável | Cada prova tem a sua cabeça abaixo. Saiu a atribuição sobre o localizador externo. O alcance do typecheck está escrito acima. As capturas binárias e os dois contadores de custo do E0 estão distinguidos. |
| 6 | Tranca da máquina | Os portões inteiros usam scripts/leituras/portoes.sh, pela M46. A chamada usa a worktree corrente, sem procurar processos. |
| 7 | Portões, capturas e resposta | Portões finais por correr. O captor conserva as larguras e as duas edições. A resposta está em RESPOSTA-construtor-e0b.md. |

### A fonte que faz parar o ponto 1

A [Comissão](https://economy-finance.ec.europa.eu/economic-governance-framework/macroeconomic-imbalance-procedure/scoreboard_en) diz «unemployment rate (% of labour force Y15-74), with a threshold of 10%». A frase da média móvel de três anos, nessa página, pertence ao saldo da balança corrente. A secção 3.1 dos [metadados do Eurostat](https://ec.europa.eu/eurostat/cache/metadata/en/tipsun20_esms.htm) coloca a média de três anos na lista dos indicadores adicionais. A [fórmula atual do Eurostat](https://ec.europa.eu/eurostat/web/macroeconomic-imbalances-procedure/information-data) divide desempregados pela população ativa no mesmo período. Estas fontes foram lidas em 2026-09-30T22:31:25Z; os locais e as citações curtas estão em [fontes-e0b.json](fontes-e0b.json).

A alteração pedida para o cartão atribuía o limiar à média de três anos. Não se encontrou apoio para essa atribuição nas fontes atuais. Aplica-se a regra de paragem nesse ponto, e os outros pontos continuam. Falta uma decisão corrigida ou uma fonte específica do painel que sustente o período pedido. Nenhum dos cinco estragos do pacote foi tratado como defeito do ramo. Os achados do K2 ficaram no K2.

### Plantas e cabeças das provas

As plantas permanentes incluem agora a retirada do nome da recontagem, a retirada do nome da dívida das famílias e a data antiga do contador. A corrida do HTML limpo e das plantas fica por medir na cabeça final. Os detetores do medidor têm ainda plantas de decimal, de caminho de componente e de escrita antiga do código, em [detetores-e0b.json](detetores-e0b.json).

A primeira corrida dos portões E0b, na cabeça `5aece94099bc964163234b725d4b6e23f66df4e8`, deu build 1, verify 1 e typecheck 0. A guarda de campos do livro recusava o título da fonte fora das páginas do livro. A forma mudou por uma porta estreita: só name e document.title no nome da própria linha, dentro da sua entrada da página do registo. A comparação literal e a auditoria do selo continuam ativas. Uma planta no portão real tenta passar value por esta marca e é recusada; outras retiram o nome, trocam a linha e mudam a página. Os primeiros códigos e registos estão em ensaios/e0b-primeira-corrida.

A corrida seguinte, na cabeça `29f39453a55b7f14157c8c59725a26e625431da4`, deu build 1: a edição do contador faltava na tabela das línguas. A corrida foi interrompida depois desta falha; não há código de conclusão de verify nem de typecheck a atribuir-lhe. A data passou a estar declarada sem língua e a conferência de língua foi repetida. O estado e o código efetivamente escrito estão em ensaios/e0b-corrida-interrompida.

| Prova | Cabeça lida do comprovativo |
| --- | --- |
| Estado anterior recomposto | `29f39453a55b7f14157c8c59725a26e625431da4` |
| Atualização isolada para E1 | `29f39453a55b7f14157c8c59725a26e625431da4` |
| Detetores revistos | `bd39e8bf5d8873c881d2d17fe0dc11c68506b9c7` |
| Medidor e plantas | `52eae9be3c6c1b1d28dfb8f0cbb1053c4956b79c` |
| Capturas | `52eae9be3c6c1b1d28dfb8f0cbb1053c4956b79c` |

As 12 capturas PNG originais existem no ramo em design/especime-v3/capturas/e0-2026-09-30/. O pacote da leitura a frio omite-as por serem binárias. O captor volta a escrever o cartão e O que mudou nas duas edições, a 390 e a 1 280 px, e regista a cabeça construída no manifesto. Os comprovativos e as capturas renovados depois do commit final ficam na worktree, como no fecho do E0.

### Commits desta passagem

- `4c1d39f0`: Nomeia cada medida no registo e simplifica as razões E0.
- `2858cead`: Exercita os detetores do medidor com positivos da corrida.
- `bd39e8bf`: Data o contador pela recontagem e recusa datas anteriores.
- `5aece940`: Entrega a E0b e documenta a paragem por fonte do limiar.
- `baf8c5dd`: Admite só o campo do nome na própria entrada do registo.
- `29f39453`: Guarda a primeira corrida E0b e a prova da guarda dos nomes.

### Portões da E0b

Chamada: `sh scripts/leituras/portoes.sh . design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b`. O guião guarda cabeca, cabeca.fim, início, fim e código de cada comando. O recolhedor recusa códigos cuja escrita não esteja entre os ficheiros de início e fim desta corrida. A duração tem a resolução de segundos do guião, não uma precisão inferida.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
| `npm run build` | Por correr | Por escrever | Por medir |
| `npm run verify` | Por correr | Por escrever | Por medir |
| `npm run typecheck` | Por correr | Por escrever | Por medir |

### Custo

O E0 acabou em 412 261 símbolos na linha tokens used, segundo o ponto 5 do mandato. A amostra conservada em [custo-e0-original.json](custo-e0-original.json) tinha 401 031; foi lida antes do fim. O terminal original não está no ramo, e o valor final é transcrito do mandato, com essa proveniência em [custo-final-e0.json](custo-final-e0.json).

Nesta passagem, o início foi lido da mensagem de retoma da sessão: 2026-09-30T22:26:35.480Z. A amostra de 2026-09-30T23:10:37.914083+00:00 mede 2642,4 segundos desde a retoma e 353 566 símbolos desde o contador final E0. Modelo lido do contexto da sessão: `gpt-6.1-sol`. É uma amostra antes do fecho, não uma linha final do terminal.

### O que fica por fazer

O ponto 1 continua parado por fonte. Faltam os portões da cabeça final, as capturas renovadas e a medição do HTML. Falta a nova leitura a frio e a aterragem. Não houve publicação.
