# E0 · As linhas do projeto e a correção do desemprego

O teste de aceitação do §2 está cumprido, com os três portões na cabeça final.

Construção por Codex `gpt-6.1-sol`, no ramo `e0-2026-09-30`. Base: `07549ee1e9ec2b39186f9e9f13eeac4914bf5e76`. Cabeça do ramo: `472cba4257942989faf41f945760f120a6988171`. Cabeça das medidas: `472cba4257942989faf41f945760f120a6988171`.

## Mandato e medidas

O guião [medir-e0.mjs](medir-e0.mjs) escreve [medidas.json](medidas.json), com 14 registos de medida e as provas dos detetores. A E0b revê os positivos do decimal da fonte, do diff e dos códigos dos portões, em [detetores-e0b.json](detetores-e0b.json). A aceitação completa exige também os portões na cabeça final. O §0 do brief foi reproduzido pelo seu guião antes da mudança.

| # | Mandato | Medida e resultado |
| --- | --- | --- |
| 1 | O lugar do projeto | O resolvedor aceita a chave declarada, com o nome O Estado do País e a porta de Correções nas duas edições. A A3 recusa a falta da declaração; a A1 recusa uma declaração falsa de Portugal. |
| 2 | As correções do desemprego | As 2 linhas estão em 6,0, cada uma com uma correção de 6 para 6,0, datada de 30.09.2026 e selada pelo guião. Os excertos conservam 6.0. |
| 3 | A recontagem | O contador está em 5, com uma atualização de 3 para 5. A contagem direta do livro dá 5. O ledger:check dirigido deu 0 em [ensaios/livro.codigo](ensaios/livro.codigo). |
| 4 | O que o leitor vê | A primeira página e o cartão do desemprego mostram 6,0 % nas duas edições. O registo mostra as 3 mudanças em cada edição, com Portugal nas correções e O Estado do País na recontagem. |
| 5 | A célula e as decisões | A célula [linhas-da-casa.mjs](../../../../tests/inicio/linhas-da-casa.mjs) corre em check:pais, portanto no build e no verify. As 14 plantas mordem. A lista das decisões fica abaixo. |
| 6 | O relatório e as provas | Este relatório, o medidor, as plantas, o custo e as 12 capturas estão nesta entrega. Os comprovativos finais atualizam-se depois do commit de entrega. |

## O diagnóstico medido e o mecanismo

A [prova do estado anterior](estado-anterior.json), executada na cabeça `a595201bbc440a6d57d2f23cd95321b26099b7d4`, recompõe em memória as linhas da base `07549ee1e9ec2b39186f9e9f13eeac4914bf5e76` e confirma que os bytes do selador continuam iguais aos dessa base. Sela a entrada 3 para 5 numa cópia de uma linha com source_url nulo e derivação declarada, com código 0. O registo das mudanças recusa a mesma entrada sem lugar, nas duas edições. A cabeça escrita no comprovativo é a da execução, e a base recomposta é outro campo.

O selador não precisou de mudar. A localização continua a ser a derivação. O [ensaio para E1](prova-e1.json) usa o mesmo selador numa cópia: conserva as 4 entradas de Évora e acrescenta uma atualização. A linha real de Évora fica em 6. A prova correu na cabeça `a595201bbc440a6d57d2f23cd95321b26099b7d4`.

[atualizar-linhas.mjs](atualizar-linhas.mjs) acrescenta as entradas datadas e chama o selador para cada linha. As 9 listas anteriores da história selada conservam os seus prefixos. Só mudaram os valores das 3 linhas autorizadas. A E0b altera RegistoCorrecoes para imprimir também os nomes lidos de campos do livro. A anatomia do cartão reservada ao K2, as vistas e as folhas de estilo conservaram-se. Nenhum ficheiro do repositório foi apagado.

O lugar do projeto entra pela mesma resolução de chave que a União Europeia. O campo study não atribui automaticamente esse lugar. A segunda leitura da A3 verifica a declaração contra a origem interna e a expressão da contagem, mas não substitui a declaração em falta. As decisões §1.144, §1.145 e §1.146 continuam a orientar o mecanismo e o seu uso no E1.

A célula permanente conserva as entradas históricas do E0, compara o valor atual com a última entrada selada e reconta todas as correções. Permite que a história cresça numa atualização futura. O medidor deste bloco exige os valores de aceitação 6,0, 6,0 e 5.

## Plantas e conferências dirigidas

As [plantas](plantas.json) usam processos isolados e cópias em memória. A planta A exige código 1 com a queixa A3 do portão real, na mesma corrida que aceita a declaração. Esta é a lista completa lida do comprovativo:

- A: contador sem declaração, A3: mordeu.
- A: contador sem declaração, resolvedor: mordeu.
- declaração falsa de Portugal: mordeu.
- data antiga do contador: mordeu.
- valor pela marca do nome no portão real: mordeu.
- nome fora da página do registo: mordeu.
- nome de outra linha na entrada: mordeu.
- B: taxa-de-desemprego-2025 sem entrada selada: mordeu.
- B: taxa-de-desemprego-mip-2025 sem entrada selada: mordeu.
- B: correcoes-publicadas sem entrada selada: mordeu.
- decimal retirado da primeira: mordeu.
- lugar retirado do registo inglês: mordeu.
- nome retirado da recontagem: mordeu.
- nome retirado da dívida das famílias: mordeu.

Foram conferidas 14 plantas, das quais 14 morderam; os ficheiros reais ficam intactos.

As conferências dirigidas do livro, da travessia, dos tipos e do país passaram. Os primeiros ensaios da célula falharam por um seletor de planta que nomeava a linha irmã, ausente da primeira página, e por rótulos esperados com maiúscula onde o registo usa minúscula. Os dois erros da célula foram corrigidos; as saídas anteriores e a corrida limpa ficam em ensaios. A primeira tentativa de captura foi impedida pela restrição do servidor local; a corrida com acesso ao servidor local terminou com código 0.

Uma primeira corrida dos três portões passou a zero, mas o guião dos comprovativos marcou erradamente os artefactos como código por registar: retirava o espaço inicial do formato porcelain antes de ler as colunas. A [prova do estado da árvore](estado-da-arvore.json) reproduz esse falso positivo e confirma que alterações de código ou do livro continuam a ser recusadas. Corrigiu-se a leitura; os portões foram repetidos na cabeça final. Os primeiros comprovativos conservam-se em ensaios.

## Capturas e inspeção

As 12 imagens PNG existem no ramo em `design/especime-v3/capturas/e0-2026-09-30/`: primeira página integral, cartão do desemprego em Emprego e secção integral das mudanças, a 390 e a 1 280 px, nas duas edições. Não entram no pacote da leitura a frio por serem binárias. O [manifesto](capturas-e0.json) guarda a cabeça construída `472cba4257942989faf41f945760f120a6988171`, dimensões e SHA-256. O medidor recalculou todos os resumos e encontrou 0 problemas de captura ou transbordo.

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
- `a595201b`: Declara a edição do contador sem língua e regista a corrida interrompida.
- `321a2427`: E0b: os comprovativos finais e as capturas renovadas, deixados na árvore pelo construtor depois do último commit.
- `a99d45cc`: E0c: a releitura a frio da E0b pelo Claude Opus 5.5 (cinco plantas em cinco), com o registo das plantas e a triagem, as duas faltas do portoes.sh corrigidas com provas (a pasta de saída depois do cd, a corrida para quando um portão morre por um sinal), e o mandato da passagem E0c.
- `ddb2bc8e`: Nomeia a dívida das famílias da União nas duas edições do registo.
- `fff4acaa`: Prova a recontagem e a conservação da história pelos próprios detetores.
- `32d8238b`: Inclui os dois revisores no custo cobrado da passagem E0b.
- `e64fff59`: Data a razão permanente e conta todas as plantas listadas no relatório.
- `472cba42`: Entrega o fecho E0c com portões próprios e o custo dos revisores.

O último commit de entrega inclui [RESPOSTA-construtor-e0.md](RESPOSTA-construtor-e0.md). A cabeça final lê-se dos ficheiros .cabeca e da resposta de fecho da sessão, fora do ramo.

## Portões

Os três comandos correram separadamente na cabeça final `472cba4257942989faf41f945760f120a6988171`. Os códigos e cabeças foram lidos dos ficheiros acabados de escrever.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
| `npm run build` | [0](portoes/e0c/build.codigo) | `472cba4257942989faf41f945760f120a6988171` | 131 |
| `npm run verify` | [0](portoes/e0c/verify.codigo) | `472cba4257942989faf41f945760f120a6988171` | 723 |
| `npm run typecheck` | [0](portoes/e0c/typecheck.codigo) | `472cba4257942989faf41f945760f120a6988171` | 1 |

Na E0b, os portões inteiros correm pelo guião scripts/leituras/portoes.sh, que toma a tranca comum do Git (M46). Os registos passam pela limpeza dos caminhos e do nome da conta local. O medidor encontrou 0 ficheiros com dados da máquina entre os ficheiros do bloco.

O typecheck executa tsc com tsconfig.check.json, allowJs, checkJs, strict e noEmit. Inclui src/tipos.d.ts, astro.config.mjs, site.config.mjs e os ficheiros .mjs de src/lib, src/data e src/i18n; exclui dist e src/data/sobre.mjs. Portanto confere os dados de nomes alterados nesta passagem. Componentes .astro, scripts, testes e guiões das medições ficam fora desse programa. O código zero não significa uma conferência de tipos desses ficheiros; o build e as células exercitam-nos por outras vias.

Um commit não pode conter o seu próprio identificador. Os comprovativos finais, a atualização deste relatório, a resposta, o custo e o medidas.json ficam na árvore de trabalho depois do último commit, sem fazer outro commit que invalidasse a cabeça conferida. Os guiões que os reproduzem estão no ramo. A cabeça das capturas está declarada no manifesto e pode anteceder o commit que só entrega documentação e provas.

## Decisões em vigor nos ficheiros tocados

A leitura anterior aos ficheiros existentes mostrou a §1.117 em mudancas e a §1.127 em check-pais. Ambas se conservaram. A §1.146 é citada nas novas guardas do E0. A lista final foi obtida por `python3 scripts/leituras/decisoes-em-vigor.py` com os caminhos explícitos dos textos tocados. O modo por intervalo falha ao tentar ler uma captura PNG; o fecho passou a dar-lhe apenas texto. O comando completo e os caminhos estão em [decisoes-em-vigor.json](decisoes-em-vigor.json), e a lista em [decisoes-em-vigor.txt](decisoes-em-vigor.txt).

```text
§1.3 · Numa linha derivada, os campos de proveniência podem ser `null`
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:111
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:1
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-anterior.log:11582
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-cabeca-97ade15e.log:11582
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-corrida-interrompida/build.log:11904
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1445
    design/especime-v3/medicoes/e0-2026-09-30/portoes/build.log:11582
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/build.log:11904
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:1767
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1445
§1.5 · A linha de método e a linha de autoria não são traduzidas
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:122
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:12
    src/data/nomes-das-medidas.mjs:145
    src/data/nomes-das-medidas.mjs:6
§1.19 · Os estudos migram para dois sítios, não um
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:127
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:17
    scripts/gate-html.mjs:1193
    scripts/gate-html.mjs:5237
    scripts/gate-html.mjs:8786
§1.24 · O livro-razão passou a ter páginas, e o selo passou a ser uma porta
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:133
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:23
    scripts/gate-html.mjs:142
    scripts/gate-html.mjs:147
    scripts/gate-html.mjs:2713
    scripts/gate-html.mjs:2869
    scripts/gate-html.mjs:3543
    scripts/gate-html.mjs:3747
    scripts/gate-html.mjs:3761
§1.31 · O motor e o publicador, e os dois campos que o material de Évora pediu
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:143
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:33
    scripts/gate-html.mjs:2592
    scripts/gate-html.mjs:856
    scripts/gate-html.mjs:879
§1.34 · O primeiro tipo de página de município, e o que ele se recusa a dizer
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:149
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:39
    scripts/gate-html.mjs:3204
    scripts/gate-html.mjs:3313
    scripts/gate-html.mjs:3986
    scripts/gate-html.mjs:7075
§1.36 · Os dez defeitos que a medição da confiança encontrou, e o que se fez a cada um
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:156
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:46
    scripts/gate-html.mjs:5067
§1.38 · A ortografia do sítio passa a ser uma só
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:160
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:50
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-anterior.log:250
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-cabeca-97ade15e.log:250
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-corrida-interrompida/build.log:250
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-corrida-interrompida/verify.log:245
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-datas-livro.log:241
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-livro.log:241
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/build.log:250
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/verify.log:245
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/livro.log:241
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:245
    design/especime-v3/medicoes/e0-2026-09-30/portoes/build.log:250
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/build.log:250
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:245
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:245
§1.39 · O sítio passa a dizer o que é, e o Método a provar o que faz
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:177
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:67
    scripts/gate-html.mjs:4942
    scripts/gate-html.mjs:7955
    scripts/gate-html.mjs:8654
§1.40 · A agenda: o que se mede agora, e nada sai dela em silêncio
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:183
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:73
    scripts/gate-html.mjs:268
    scripts/gate-html.mjs:360
    scripts/gate-html.mjs:3850
    scripts/gate-html.mjs:78
§1.41 · A revisão cruzada do bloco V, e o que ela mudou
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:190
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:80
    scripts/gate-html.mjs:3005
    scripts/gate-html.mjs:3048
§1.42 · Segunda revisão cruzada do bloco V
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:195
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:85
    scripts/gate-html.mjs:3027
    scripts/gate-html.mjs:3048
    scripts/gate-html.mjs:3419
    scripts/gate-html.mjs:7366
§1.44 · A revisão cruzada da identidade v2
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:202
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:92
    scripts/gate-html.mjs:871
§1.47 · O bloco T: a página da linha passa a ser o recibo, com dados a sério
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:206
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:96
    scripts/gate-html.mjs:880
§1.64 · A parte 3: as páginas de leitura constroem-se dos registos de conteúdo do motor
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:210
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:100
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-anterior.log:362
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/build-cabeca-97ade15e.log:362
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-corrida-interrompida/build.log:362
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-corrida-interrompida/verify.log:357
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/build.log:362
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/verify.log:357
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:357
    design/especime-v3/medicoes/e0-2026-09-30/portoes/build.log:362
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/build.log:362
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:357
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:357
    scripts/gate-html.mjs:3962
    scripts/gate-html.mjs:85
    scripts/gate-html.mjs:8654
§1.68 · As páginas dos 308 concelhos
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:227
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:117
    scripts/gate-html.mjs:4749
    scripts/gate-html.mjs:93
§1.82 · Correções pequenas, quinta passagem (I91, segunda metade; I92): a língua dos nomes e dos rótulos na edição inglesa
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:232
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:122
    scripts/gate-html.mjs:1594
§1.90 · As linhas do primeiro domínio da primeira vaga: economia e finanças públicas com trabalho, do inventário ao livro-razão
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:236
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:126
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1215
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1216
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1217
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1218
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:1220
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:1215
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:1216
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:1217
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:1218
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:1220
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1215
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1216
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1217
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1218
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:1220
§1.91 · A cabeça nova como contentor: a faixa de cartões, o mapa como navegação, as três camadas com a mesma cabeça
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:254
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:144
    scripts/gate-html.mjs:5842
    scripts/gate-html.mjs:6747
    scripts/gate-html.mjs:7969
    scripts/gate-html.mjs:852
§1.108 · A manhã de 15.09: o diretor na primeira página no ar, a regra das capturas antes de aterrar, e a primeira página à frente do descarregamento
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:261
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:151
    scripts/gate-html.mjs:4134
    scripts/gate-html.mjs:4190
    scripts/gate-html.mjs:4331
§1.109 · A regra 9 do Método deixa de nomear o diretor
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:267
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:157
    scripts/gate-html.mjs:4135
    scripts/gate-html.mjs:4190
    scripts/gate-html.mjs:4331
§1.115 · Sete nomes do INE por conferir estiveram no ar como nomes oficiais: a correção, e o que muda para não voltar a acontecer
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:273
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:163
    src/data/nomes-das-medidas.mjs:143
§1.117 · A peça 3 do B1, o país: o Codex constrói, o lugar de direção corrige o seu próprio guião, o Opus lê a frio
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:108
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:277
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:167
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:101
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:18
    src/lib/mudancas.mjs:205
§1.118 · O M3, a segunda metade: a conferência estrutural no motor, e os nomes confirmados de volta aos recibos
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:284
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:174
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-corrida-interrompida/verify.log:646
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/verify.log:646
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:646
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:646
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:646
§1.119 · A I129: o grupo etário passa a estar escrito na linha e na definição, e a célula que não deixa uma definição contradizer a sua linha
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:292
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:182
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-corrida-interrompida/verify.log:645
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/verify.log:645
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:645
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:645
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:645
§1.120 · «O que mudou» no seu lugar: a página do país curta, o registo inteiro numa página, e dois erros de medição do lugar de direção
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:300
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:190
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-corrida-interrompida/verify.log:644
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/e0b-primeira-corrida/verify.log:644
    design/especime-v3/medicoes/e0-2026-09-30/ensaios/verify-cabeca-97ade15e.log:644
    design/especime-v3/medicoes/e0-2026-09-30/portoes/e0b/verify.log:644
    design/especime-v3/medicoes/e0-2026-09-30/portoes/verify.log:644
    scripts/gate-html.mjs:4156
§1.127 · O brief do B2: o bloco do veredicto em duas peças, o que o lugar de direção mediu antes de o escrever, e as decisões que ele fixa
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:108
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:309
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:199
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:101
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:18
    scripts/check-pais.mjs:296
§1.138 · O nome e o utilizador fora da árvore pública: o pedido do diretor de 29.09.2026, a auditoria dos segredos, a redação, e o detetor do nome alargado
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:316
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:206
    scripts/gate-html.mjs:228
§1.140 · Onde Portugal fica entre os 27: as séries por país no livro-razão, a faixa da União nos dez cartões, a média da União de volta ao cartão da sobrecarga com a ressalva da Comissão, e a aterragem
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:320
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:210
    scripts/gate-html.mjs:19
    scripts/gate-html.mjs:41
§1.144 · O N1 construído pelo Codex e lido a frio duas vezes pelo Opus: uma porta por assunto, a correção adiada do desemprego, e a primeira medida da M43
    design/especime-v3/critica/LEITURA-e0-2026-09-30.md:5
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:28
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:325
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:215
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:57
§1.145 · Os estudos de Évora passam de seis a quatro (o E1): as contas da câmara, quem governou, a economia e o dinheiro de fora, e o Évora 2027, com o que se repete dito uma vez e o que se contradiz reconciliado; e a aterragem do N1
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:28
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:331
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:221
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:57
§1.146 · O orçamento gasta-se até ao fim por decisão do diretor, o GPT-6.1 Sol entra (a recusa era do CLI), o leitor passa a ele e o construtor ensaia-se com ele no E0; e a aterragem dos registos do E1
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:108
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:28
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:336
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:226
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:101
    design/especime-v3/medicoes/e0-2026-09-30/fechar-e0.mjs:57
    scripts/check-pais.mjs:171
    src/data/lugar-das-linhas.mjs:22
    src/lib/mudancas.mjs:101
    tests/inicio/linhas-da-casa.mjs:1
§1.148 · sem título em DECISIONS.md
    design/especime-v3/critica/LEITURA-e0b-2026-09-30.md:5
    design/especime-v3/medicoes/e0-2026-09-30/LEIA-ME.md:347
    design/especime-v3/medicoes/e0-2026-09-30/decisoes-em-vigor.txt:237
33 decisão(ões) citada(s) em 238 ficheiro(s)
```

## Custo e limites

Amostra de 2026-10-01T00:32:43.002733+00:00, lida dos eventos token_count da sessão identificada pelo ambiente: 1 047 986 símbolos de entrada sem cache mais saída; 32 273 202 no total com cache; 31 225 216 em cache. Tempo decorrido desde o início da sessão até à amostra: 13319,1 segundos. Modelo efetivamente lido: `gpt-6.1-sol`. Os revisores automáticos das aprovações têm os seus próprios contadores em [custo.json](custo.json).

É uma amostra anterior ao fecho, não um custo em euros nem o contador final do terminal. A amostra original do E0 conserva-se em [custo-e0-original.json](custo-e0-original.json). O mandato E0b regista o contador final do E0, na linha tokens used, em 412 261 símbolos; essa proveniência está em [custo-final-e0.json](custo-final-e0.json). A leitura a frio do E0 está em design/especime-v3/critica/LEITURA-e0-2026-09-30.md e originou esta passagem. O E1 continua a ser outro bloco. Não houve publicação.

## O que fica por fazer

Nenhum item do teste de aceitação original E0 fica por cumprir. O estado do mandato E0b e a paragem por fonte estão na secção seguinte. Falta a aterragem.

## E0b, registo histórico e custo corrigido

A passagem E0b correu na cabeça `a595201bbc440a6d57d2f23cd95321b26099b7d4`, com os três portões a zero, em portoes/e0b/. O [comprovativo E0b](e0b.json) conserva as cabeças das provas dessa passagem. O pedido sobre a média de três anos foi retirado na [triagem da releitura](../../critica/LEITURA-e0b-2026-09-30.md): o cartão do desemprego está certo, e esse ponto fecha sem defeito.

O nome Correções publicadas, ou Published corrections na edição inglesa, vem de NOMES_DAS_LINHAS_DERIVADAS em src/data/nomes-das-medidas.mjs. A localização continua a vir da derivação declarada.

A amostra E0b de 2026-09-30T23:26:00.999446+00:00 dá 408 878 símbolos do construtor e 63 492 e 27 007 nas duas sessões do revisor automático. Os revisores somam 90 499; o total cobrado na amostra é 499 377, ao lado dos 408 878 do construtor. O tempo medido foi 3565,5 segundos. São os contadores lidos de [custo-e0b.json](custo-e0b.json), também no campo e0b de [custo.json](custo.json). A E0c não prolonga essa amostra. O custo final do E0 continua distinguido acima.

## E0c

O mandato E0c está conferido, com os três portões a zero na cabeça final. Cabeça: `472cba4257942989faf41f945760f120a6988171`. Base recebida: `a99d45cc44281dff386561b6826440610e1df60e`.

### Mandato e medidas

| # | Mandato | Resultado e prova |
| --- | --- | --- |
| 1 | Nome da dívida das famílias | A tabela NOMES_DO_PROJETO declara Dívida das famílias e Household debt, os nomes correntes do cartão. O lugar diz União Europeia ou European Union. A célula conferiu 20 nomes em português e 20 em inglês. |
| 2 | Positivos da recontagem e da história | O mesmo detetor da medida reconta 5 e, sem a correção do PIB do Alentejo numa cópia, 4. Alterar new_value de uma entrada selada de Évora numa cópia produz a queixa de história alterada. O livro e a história reais conservaram-se. Prova: detetores-e0c.json, cabeça `472cba4257942989faf41f945760f120a6988171`. |
| 3 | Custo completo da E0b | 408 878 do construtor + 90 499 dos dois revisores = 499 377 na amostra, nos ficheiros e na secção histórica acima. |
| 4 | Razão permanente e frases do relatório | A razão diz duas correções publicadas a 30.09.2026, e published on 30.09.2026. Valor, assinatura e ficheiro da história selada conservados. O relatório identifica a tabela do nome e lista todas as 14 plantas que conta. |
| 5 | Portões, capturas, relatório e resposta | Portões a zero, códigos lidos desta corrida; capturas e medidor da mesma cabeça. A resposta está em RESPOSTA-construtor-e0c.md. |

Os achados 1 a 5 da releitura são as plantas do pacote e ficaram intactos. Os achados 7 e 11 ficam registados sem passagem. O achado 10 já vinha corrigido no guião portoes.sh, que se conservou. O cartão do desemprego e os números do livro ficaram intactos.

### Plantas e capturas

A lista completa das 14 plantas está na secção de conferências dirigidas acima, gerada do mesmo comprovativo que conta 14 mordidas. Os dois positivos novos estão separados em detetores-e0c.json e usam os detetores que escrevem as medidas, com cópias em memória.

As 12 capturas foram renovadas na cabeça `472cba4257942989faf41f945760f120a6988171`, com 0 problemas. Incluem O que mudou nas duas edições, a 390 e a 1 280 px, e mantêm as capturas da primeira página e do cartão. Os resumos SHA-256 são recalculados pelo medidor.

### Commits E0c

- `ddb2bc8e`: Nomeia a dívida das famílias da União nas duas edições do registo.
- `fff4acaa`: Prova a recontagem e a conservação da história pelos próprios detetores.
- `32d8238b`: Inclui os dois revisores no custo cobrado da passagem E0b.
- `e64fff59`: Data a razão permanente e conta todas as plantas listadas no relatório.
- `472cba42`: Entrega o fecho E0c com portões próprios e o custo dos revisores.

### Portões E0c

Chamada: `sh scripts/leituras/portoes.sh . design/especime-v3/medicoes/e0-2026-09-30/portoes/e0c`. O recolhedor e o medidor recusam códigos antigos, cabeças diferentes ou código por registar. As durações têm a resolução de segundos do guião.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
| `npm run build` | [0](portoes/e0c/build.codigo) | `472cba4257942989faf41f945760f120a6988171` | 131 |
| `npm run verify` | [0](portoes/e0c/verify.codigo) | `472cba4257942989faf41f945760f120a6988171` | 723 |
| `npm run typecheck` | [0](portoes/e0c/typecheck.codigo) | `472cba4257942989faf41f945760f120a6988171` | 1 |

### Custo E0c e limite

A amostra de 2026-10-01T00:32:43.002733+00:00 dá 211 531 símbolos do construtor, 57 029 dos revisores e 268 560 no total cobrado; 2214,9 segundos desde a retoma de 2026-09-30T23:55:48.135Z. O delta começa no último token_count anterior à retoma. O critério dos revisores está em custo.json. Modelo lido: `gpt-6.1-sol`. É uma amostra anterior ao fecho. Os mostradores foram lidos antes dos portões e estão em uso-e0c.json.

### O que fica por fazer

Nenhum ponto do mandato E0c fica por cumprir. Falta a conferência do diff e a aterragem, conforme a triagem; não há pedido de quarta leitura. Os comprovativos e a resposta finais atualizam-se na worktree depois do último commit, conservando a cabeça conferida. Não houve publicação.
