# F2.2b · as corridas prontas a armar, com F2.2c e F2.2d

A F2.2d está concluída no âmbito do mandato. O clone raso sem `master` local
e o portão da cabeça final do motor passaram. A referência fixa conserva os comandos, cabeçalhos, ordem e regra de
saída do guião de `68318e0`. Só o nome do utilizador no rótulo do agente e o caminho
do portátil foram trocados pelas marcas autorizadas. As provas de fecho estão
na secção F2.2d.

O bloco prepara a publicação dos ramos e os ensaios no GitHub. Os efeitos
externos nulos são declarações do construtor, não medições pela API. Não houve
`push`, despacho, alteração de interruptor nem reforma de agentes reais.
O teste operacional com chaves continua fora desta construção.

Autoria: Codex gpt-6-astra. Este relatório recupera a estrutura e o âmbito do
texto de `77d9e407`, com os comportamentos corrigidos. As afirmações sem prova
sobre reparações de `core.bare`, opções locais do Git e outras intervenções
históricas não voltam. As correções posteriores estão nas secções F2.2c e F2.2d.
As bases do bloco são motor `1af04566898ddfc2c5244c55c7f229b1c287fee2` e sítio
`24e7c8752f5bf80b263f13530f618278ba474992`.

## O mandato do brief e a medida, no estado corrigido

| Ponto | Entrega | Prova e limite |
|---|---|---|
| `1` | Corredor, retomas e painel usam a mesma publicação: `fetch`, guarda contra `main`, ramo datado, portão do mesmo SHA, segunda guarda contra o `main` do momento e avanço desse SHA. A API é consultada a cada 60 segundos, até 3600 segundos; só `success` passa. | Plantas do valor alterado com zero `push`, diff privado e issue; controlo com dois `push` do mesmo SHA; portão vermelho, outras conclusões, erros da API, teto, SHA e fluxo errados, alterações proibidas e avanço concorrente de `main`. As chamadas externas são dublês. Um candidato recusado pela primeira guarda nunca sai para o repositório público. |
| `2` | `painel.yml`, segunda-feira às 08:30 UTC, dependente de `PAINEL_ARMADO`; despacho apenas em ensaio. Reutiliza os leitores e canários, conserva quatro saídas e até duas retomas em trabalhos distintos. O silêncio das linhas impede o carimbo global; o do limiar guarda-se à parte e não o impede. | Painel sintético inteiro; silêncio persistente sem «inacessível»; recusa e TLS tratados como sem resposta no runner; revisão com issue e valor intacto; patch aplicado noutra cópia Git; saídas conferidas e portão do motor vermelho a impedir commit. Limiar no mesmo anfitrião de uma linha, retoma que retira o aviso, HTTP de erro e página sem números. O ensaio despachado permanece por executar. |
| `3` | `varrimento.yml`, dia 1 às 09:00 UTC, dependente de `VARRIMENTO_ARMADO`. `decisoes.py` recebe `--site` ou `OEDP_SITE`. O runner passa `--write` e `--quiet`; a chamada sem argumentos conserva a ordem, o relatório e a regra de saída do portátil, com a pasta descoberta pelo guião. | Os leitores de dublê geram relatório, códigos e carimbo; achado abre issue; leitor partido impede o carimbo. As plantas da compatibilidade com o portátil e do clone raso são detalhadas na F2.2d. Não escreve livros nem faz commits. O ensaio despachado permanece por executar. |
| `4` | O vigia respeita os interruptores apenas no agendamento. O despacho manual corre sempre. Painel e varrimento exigem a corrida devida e o carimbo próprio; um trabalho real `skipped` identifica a corrida dormente. O título inclui rotina e data devida, e a issue aberta com esse título impede repetição. | Ausência abre issue; falha repetida em dias seguidos abre uma só; corrida dormente e verde com carimbo não abrem. Ensaio, corrida vermelha, incompleta, carimbo alheio, antigo ou futuro são recusados. Folga de seis horas depois do cron. |
| `5` | `reformar_agentes.py` prepara o arquivo e a descarga dos dois agentes, depois de duas corridas reais verdes de cada rotina. O modo de ensaio mostra o que faria. | O próprio `main --aplicar` é exercido sobre definições sintéticas, com `launchctl` de dublê. Prova ausente, incompleta, repetida ou de ensaio: nenhuma chamada. No controlo, a ordem das chamadas e os bytes do arquivo são conferidos antes de apagar. Nenhum agente real foi tocado. |
| `6` | Frescura, plano da fiabilidade, registo M41, README das corridas e este relatório. `medir.py` agrega códigos, cabeças, árvores, saídas e contadores. | O pacote conserva as provas históricas e as de cada passagem. A F2.2c guardou a reprodução do §0 e a exclusão de construções. A F2.2d restitui o prompt da direção, explicita a proveniência dos registos e completa o relatório. O §2 da frescura mantém os bytes recebidos. |

## O que as guardas conservam

Uma linha guarda as últimas quatro reconferências; a história inteira fica no
índice do arquivo. A guarda aceita apenas um acrescento não vazio desta corrida
seguido da poda exata ao limite importado de `refresh.py`. Recusa uma quinta
entrada sem poda, poda excessiva, reescrita ou reordenação. Valor, excerto,
endereço e os restantes campos da linha ficam protegidos. Criação, remoção,
mudança de modo e estados JavaScript executáveis ou com exportações adicionais
são recusados. Os estados são lidos como dados.

Uma recusa antes da publicação deixa o diff como artefacto da corrida privada
do motor, com issue e ligação à corrida. Depois de o ramo datado existir,
portão vermelho ou teto esgotado deixam-no para revisão, sem avançar `main`.
Uma recusa local continua a bloquear o avanço, mesmo com o portão público verde.

A regra da I116 no runner inclui recusa de ligação e TLS: pede-se outro runner
sem declarar a fonte «inacessível». No portátil conserva-se a classificação da
C1e e as mensagens do limiar da I115. Uma revisão da fonte abre issue e conserva
o valor; a `atualizacao` continua por decidir. O fecho do painel confere as quatro
saídas contra as leituras e a base; avanço concorrente de `master` impede o commit.

O varrimento sem argumentos guarda `sweeps/sweep-AAAA-MM-DD.md`, usa `OEDP_SITE`
ou o repositório irmão, e devolve o erro do calendário, se existir; caso contrário,
o código do vigia das publicações. No runner, qualquer leitor falhado dá código
1, salvo `core.sweep` a 1, que significa achados; nos restantes casos dá 0.

## As plantas e os registos do bloco

As provas originais estão em `provas/` e `portoes/`; as passagens têm subpastas
`f22c/` e `f22d/`. Os nomes das plantas e as suas contagens vêm dos JSON emitidos
pelos próprios provadores. As plantas usam fontes, GitHub e lançamento simulados;
as cópias temporárias, patches e commits sintéticos usam Git real.

O §0 foi reproduzido por `BRIEF-F22b.py`, na cabeça histórica fixada no guião:
3009 linhas, 91 reconferidas pelo painel, 2545 pelo corredor, seis commits semanais
e 93 ficheiros no commit semanal observado, dos quais 91 linhas. Os sete
conhecidos-positivos foram encontrados. A execução reproduzida está em
`provas/f22c/brief.json`, com código 0 e os instantes
`2026-09-29T21:29:34.238247Z` e `2026-09-29T21:30:29.509905Z`.

Os registos anteriores que só guardaram `HEAD` sobre código por registar passam
a chamar-lhe base Git. As referências a árvores de commits posteriores são
reconstituições, não fotografias da execução. A lacuna histórica fica dita em
`provas/f22d/registos-historicos.json`. As novas execuções fotografam a árvore
antes de correr, sem mudar o índice do construtor, e guardam-na em `.arvore` e
`codigo_executado`; os códigos são escritos depois de o processo acabar.

## Commits dos dois repositórios

Os commits do bloco, incluindo as junções e as leituras que o dirigiram, são:

| Repositório | Commit | Conteúdo |
|---|---|---|
| Motor | `6432b88b000cdcdc47a08a8721bafac8f7ab023a` | Publicação guardada e rotinas transportáveis. |
| Motor | `5335e129b3167c93d1822c8af7cecbb909922877` | Fluxos, README, plantas e portão. |
| Motor | `68318e0da2036cc29e4704fa1bb8a96dee246095` | C1e recebida de `master`. |
| Motor | `f9dc0df2c1474b44a47cdd6781ea2cf64885cfe1` | Junção de `master` na F2.2c. |
| Motor | `e7dbae267919aa6e9eb0345d25a085f50e4c5a72` | Correções e plantas da F2.2c. |
| Motor | `1a67dea9a4e479c00f4fe4c8d645364a3a943446` | Documentação e registo da execução da F2.2c. |
| Sítio | `01362b78a810795ee6870b8a6f439c39b9fe25e0` | Frescura, plano e registo do F2.2b. |
| Sítio | `77d9e4076eb8098a45e6ca0cd3c27964d54a9301` | Provas e resposta do F2.2b. |
| Sítio | `22510cd9119ae01a9bca8a75c4382654cbf7e0b2` | Junção de `main`, M41 e §2 da frescura. |
| Sítio | `fb1dd0dd442684221a5e4aceae3b8ac5491d5546` | Leitura, triagem e mandato da F2.2c. |
| Sítio | `934af43bfb1f8205ad81bafa27b32c0d0fc8aadc` | Ordem da publicação e natureza das medidas. |
| Sítio | `cb1600b6e147f2bdc05f73396404f344b3495c2b` | Provas, relatório e resposta da F2.2c. |
| Sítio | `df1c262242dc94f5b6aef8d8e01f9e554209baf2` | Releitura, triagem e mandato da F2.2d. |

Os commits já registados da F2.2d são:

| Repositório | Commit | Conteúdo |
|---|---|---|
| Motor | `f8a20fb2d20f89bec387acff2271c4b1672be034` | Limiar, compatibilidade do portátil, plantas e proveniência das execuções. |
| Motor | `7fddf67fa1a9c9851f712c118a7d049b8ddc0ea8` | Provador do clone raso sem `master` local. |
| Motor | `7c43b0746f8c43d9ace5cfdcb4d71a79927a6813` | Referência fixa expurgada, proveniência, SHA-256 e plantas independentes de `master`. |
| Sítio | `f97d7d60d3611f011cbaef26fc05cff92c9ac7a1` | Relatório do bloco, prompt reposto e proveniência das provas. |
| Sítio | `ad4722fa92bafcacf7b99d3da56363f3b58dcbed` | Provas e resposta da entrega parcial, com a paragem na referência pessoal. |

O inventário completo, incluindo os antepassados recebidos pela junção de
`main`, fica em `medidas.json`. O último commit do sítio contém as provas de
fecho e `RESPOSTA-construtor-f22d.md`; o seu SHA é comunicado fora do ramo.
O SHA do último commit das provas resolve-se pelo histórico da resposta da sua
passagem e é comunicado fora do ramo: um commit não contém o seu próprio SHA.

## Os portões do bloco

As provas históricas conservam a cabeça que cada processo leu. Os portões da
F2.2d são os de fecho desta passagem; os anteriores não os substituem.

| Passagem | Comando | Código lido | Segundos | Ficheiro |
|---|---|---:|---:|---|
| F2.2b | `python3 -m core.gate` | 0 | 209,215 | `provas/core-final.codigo` |
| F2.2b | `npm run build` | 0 | 667,472 | `portoes/build.codigo` |
| F2.2b | `npm run verify` | 0 | 706,278 | `portoes/verify.codigo` |
| F2.2b | `npm run typecheck` | 0 | 0,784 | `portoes/typecheck.codigo` |
| F2.2c | `python3 -m core.gate` | 0 | 425,57 | `provas/f22c/core-final.codigo` |
| F2.2c | `npm run build` | 0 | 231,698 | `portoes/f22c/build.codigo` |
| F2.2c | `npm run verify` | 0 | 849,736 | `portoes/f22c/verify.codigo` |
| F2.2c | `npm run typecheck` | 0 | 0,828 | `portoes/f22c/typecheck.codigo` |

O motor do F2.2b foi testado em `5335e129b3167c93d1822c8af7cecbb909922877`,
o sítio em `01362b78a810795ee6870b8a6f439c39b9fe25e0`. Na F2.2c, o motor
foi testado em `1a67dea9a4e479c00f4fe4c8d645364a3a943446`, o sítio em
`934af43bfb1f8205ad81bafa27b32c0d0fc8aadc`. Os ficheiros `.cabeca` dos portões
do sítio ficam ao lado dos códigos. A F2.2c tem um `.exclusao.json` por portão,
com o último `pgrep` sem outra construção antes de iniciar. Não se atribui essa
prova às corridas históricas que não a guardaram. Os portões da F2.2d conservam
a mesma regra de exclusão. Nesta retoma só mudou o pacote de provas do sítio;
os três portões já verdes conservam-se, conforme a condição do mandato final. A comparação posterior entre a cabeça dos portões
e o último commit das provas cabe à direção na aterragem.

## O custo do bloco inteiro

As fotografias históricas conservam-se: construção com 15830614 símbolos;
retoma com acréscimo de 8587703 e cumulativo de 26360707; F2.2c com 21079437.
Os contadores seguintes incluem também o fecho dessas passagens, até ao último
contador antes da retoma seguinte ou ao fim da sessão antiga. A F2.2d usa a sua
própria diferença, sem voltar a contar a F2.2c.

<!-- custo-bloco-inicio -->
| Segmento | Símbolos do segmento | Contador cumulativo final | Segundos |
|---|---:|---:|---:|
| construcao | 17773004 | 17773004 | 3997,751 |
| retoma | 10474123 | 28247127 | 1851,757 |
| f22c | 21748675 | 21748675 | 3498,598 |
| f22d | 13670876 | 35419551 | 3929,194 |

Total observado: 63666678 símbolos e 13277,3 segundos dos segmentos.
<!-- custo-bloco-fim -->

Os contadores, as fronteiras e as fotografias anteriores estão em
`provas/f22d/custo-bloco.json`; o contador desta passagem está em
`provas/f22d/custo.json`. Os símbolos incluem as releituras em cache. Os segundos
são tempo decorrido, sem os intervalos entre passagens, e não tempo de CPU.
A F2.2d inclui a pausa antes da decisão sobre as marcas da referência fixa.
A fotografia desta passagem antecede o último commit e a resposta final.
Não foi medido custo monetário nem de execução no GitHub.

## F2.2c · a passagem de correção

Autoria: Codex gpt-6-astra. Registo da passagem anterior, completado pelas retificações da F2.2d abaixo. Âmbito: os pontos do mandato em
`prompts/PROMPT-f22c-construtor.md`. As plantas usam fontes, API e lançamento
simulados; Git e os ficheiros temporários são reais. Nenhuma prova aplica
`launchctl` a um agente real. As contagens de efeitos externos em `medidas.json`
são declarações do construtor, identificadas como tal. O lugar de direção mede
os interruptores e os despachos na aterragem.

| Ponto | Correção | Medida e planta |
|---|---|---|
| `0` | `master` entrou por fusão, conservando a C1e e a retoma. | `fusao-rede-local`, `fusao-rotinas`, `fusao-fluxo` e o pre-commit em `commit-fusao`. A primeira tentativa do servidor local foi impedida pelo sandbox; a repetição autorizada passou. |
| `1` | A linha conserva as últimas quatro reconferências; o índice do arquivo conserva a história. O limite importa-se de `refresh.py`. | Quatro antigas e uma nova, seis antigas e uma nova: aceites após a poda exata. Reescrita, reordenação e poda excessiva: recusadas. A célula `13` do corredor conserva o teto. |
| `2` | Só `success` dá verde. Erros permanentes param com causa; limites, servidor e rede repetem dentro do teto. | O próprio `esperar_portao` recebe pela API simulada cada conclusão pedida. HTTP `400`, `401`, `404`, `410` e `403` sem limite param; `403` e `429` de limite, `500`, `503` e rede repetem. A razão conserva o último erro. A versão mantém-se, com a fonte em `api-versoes.json`. |
| `3` | `main --aplicar` prova as corridas antes de qualquer chamada a `launchctl`. | Sem provas, só uma corrida, identificadores repetidos e ensaio em vez de real: recusas sem chamadas. O controlo verde confere a ordem das chamadas, os bytes arquivados antes de apagar e os bytes finais. |
| `4` | `fetch`, guarda contra `main`, ramo datado, portão, segunda guarda e avanço do mesmo SHA. | Uma mudança de valor é recusada antes de qualquer `push`; o diff fica no artefacto privado e a issue liga a corrida e diz a causa. O controlo verde faz os dois `push` do mesmo SHA por dublê. Corredor e retoma guardam `publicacao.*` mesmo quando a publicação falha. |
| `5` | O vigia lê os trabalhos da corrida e reconhece o trabalho real `skipped`. O título do alarme inclui rotina e data devida. | Corrida dormente e verde com carimbo: sem issue. Falta e falha: uma issue. A repetição no dia seguinte procura o título aberto e não abre outra, nas duas rotinas. |
| `6` | O despacho manual do vigia corre sempre; só o agendamento respeita o interruptor. | O provador do fluxo exerce o corredor desarmado; as plantas exercem as duas rotinas desarmadas com despacho. |
| `7` | Só o silêncio do limiar pede retoma. O limiar não decide o carimbo das linhas nem a completude das leituras. | HTTP `503` e página sem números chegam à issue com causa, sem retoma, com as linhas e o carimbo global escritos. Silêncio mantém o carimbo e repete só o limiar na tentativa seguinte. As saídas passam a sua guarda. |
| `8` | A chamada mensal sem argumentos conserva os passos, as bandeiras, o relatório e a regra de saída do portátil. | Na F2.2c, os comandos eram comparados com um `master` local; a F2.2d elimina essa dependência com a referência fixa de `68318e0`, expurgada e conferida por SHA-256. O calendário falhado determina a saída; caso contrário, determina-a o vigia das publicações. `OEDP_SITE` e repositório irmão são exercidos. O runner conserva `--write`, `--quiet` e a sua regra de saída própria. |
| `9` | O modo decidido chega pelo ambiente à publicação no corredor e na retoma. | Os YAML são lidos pelas plantas; a atribuição fixa na linha de comando é recusada. |
| `10` | As guardas em falta têm plantas nas funções e nas entradas principais. | `fontes.mjs`, valores novos, exportação adicional, ficheiro criado, apagado e modo alterado; `main` de publicação e fecho com despacho ou modo não real; `OEDP_SITE` aceite com código verde num sítio sintético. Os dois estados reais da cabeça do sítio passam `dados_js` e um diff plausível passa `guardar_diff`. |
| `11` | Declarações separadas de medidas; caminhos pessoais removidos de todo o pacote; nenhuma conferência posterior aos portões atribuída ao medidor. | §0 reproduzido com comando, ambiente declarado, código e hora. Exclusão de construções registada antes de cada portão. Isolamento com variáveis Git inválidas, comando e ambiente sem segredos. O detetor tem conhecido-positivo e planta num ficheiro binário aninhado. A comparação entre a cabeça dos portões e a final cabe à direção na aterragem. |

### As plantas e a prova reproduzível

As saídas desta passagem ficam em `provas/f22c/`. `plantas.log` e
`plantas-detalhe.json` nomeiam as plantas das rotinas; `plantas-f22c.log` e
`plantas-f22c-detalhe.json` nomeiam as adicionais e a cabeça dos estados reais.
Passaram 39 plantas das rotinas e 25 adicionais. `fluxo.log` guarda as 94
conferências dos YAML, contadas também em `fecho.json`. `isolamento` guarda o comando e as
variáveis artificiais que exercem a separação das cópias Git.

`brief.json`, `brief.codigo`, `brief.log` e `brief-reproduzido.json` registam a
reprodução do §0 na cabeça histórica que o guião fixa. Terminou com código 0,
entre `2026-09-29T21:29:34.238247Z` e `2026-09-29T21:30:29.509905Z`. `medidor-planta` prova
o detetor e o varrimento de todos os ficheiros do pacote, incluindo binários.
O guião `medir.py` relê os códigos, as cabeças e os resumos das saídas. Não
confere o futuro commit das provas contra a cabeça dos portões.

## F2.2d · a releitura e a correção

A releitura a frio e a triagem estão em
`design/especime-v3/critica/LEITURA-f22c-2026-09-29.md`.
Esta passagem mantém o âmbito do mandato e não altera páginas do sítio.

| Ponto | Correção e prova |
|---|---|
| `1` | A referência fixa está em `indicators/fixtures/monthly-68318e0.sh`, com a proveniência ao lado. O teste confere o SHA-256 e recusa uma cópia alterada. `referencia-fixa.json` confere as duas substituições autorizadas e os restantes bytes contra `68318e0`. O defeito fica documentado em `clone-antes`; o controlo corrigido fica em `clone`. |
| `2` | Os cinco cabeçalhos e a descoberta da pasta sem Git estão corrigidos. A planta compara o texto e a ordem das linhas `python3` e `echo` com a referência fixa, e a sequência efetivamente emitida, incluindo o calendário falhado. Um dublê recusa qualquer chamada a Git. Exercita a saída do calendário falhado, a das publicações e o controlo verde. |
| `3` | A tabela dos pontos do brief, as plantas, os commits, os portões e os contadores dos quatro segmentos voltaram a este relatório. |
| `4` | A regra da I116 fica dita no código. As plantas oferecem recusa de ligação e TLS às linhas e ao limiar, e distinguem deliberadamente o portátil do runner. |
| `5` | O silêncio do limiar tem campo próprio; uma linha no mesmo anfitrião continua a carimbar. A retoma retira o aviso de silêncio e conserva os alarmes de revisão. As mensagens do portátil e o comentário da I115 foram repostos a partir de `68318e0`. |
| `6` | A quinta reconferência sem poda é recusada. A célula `13` foi executada pelo `corredor.py --provar`, com código 0 em `provas/f22d/corredor.codigo`. A API tem leituras atribuídas separadamente. Os novos registos identificam a árvore, e os antigos explicitam o que não registaram. |
| `7` | O prompt F2.2c foi reposto byte a byte de `fb1dd0dd`. O detetor exclui apenas o exemplo `<pasta-pessoal>/...`, que não é um caminho, e continua a recusar caminhos reais e continuações desse exemplo. Os prompts da direção não voltam a ser editados. |

Nesta passagem passaram 47 plantas das rotinas, 26 adicionais e 94
conferências dos fluxos: `provas/f22d/plantas`, `plantas-f22c` e `fluxo`, com
nomes e resultados nos JSON de detalhe e nas saídas. Cada registo identifica
a cabeça e a árvore da sua execução. A corrida de trabalho
anterior permanece em `trabalho-rotinas`. A conferência do novo registo da
árvore está em `registro-planta`, a do detetor em `medidor-planta`. A prova
`prompt-reposto.json` confere os bytes e os resumos do prompt original e reposto.

A leitura fornecida pela direção da página das versões da API é de
`2026-09-29T21:03:00Z`, HTTP `200`, e cita «2026-03-10 (latest)». A leitura
própria do construtor em `2026-09-29T22:54:12.038567Z`, também HTTP `200`,
recebeu a tabela com `2026-03-10` entre as versões suportadas, sem «latest».
São leituras distintas. A segunda não confirma o excerto da primeira. O endereço,
a hora e o excerto estão em `provas/f22d/api-versoes.json`; o cabeçalho mantém-se.

### Portões e fecho desta passagem

Os códigos foram lidos depois de os processos acabarem. O motor foi testado na
cabeça `7c43b0746f8c43d9ace5cfdcb4d71a79927a6813`; o sítio em
`f97d7d60d3611f011cbaef26fc05cff92c9ac7a1`, antes do commit final das provas.
Os registos da árvore distinguem o commit limpo do motor das árvores do sítio,
que continham os ficheiros de prova em construção. O medidor não atribui o
commit futuro das provas aos comandos já executados.

| Comando | Código lido | Segundos | Ficheiro |
|---|---:|---:|---|
| `python3 -m core.gate` | 0 | 209,994 | `provas/f22d/core-final.codigo` |
| `npm run build` | 0 | 79,571 | `portoes/f22d/build.codigo` |
| `npm run verify` | 0 | 541,615 | `portoes/f22d/verify.codigo` |
| `npm run typecheck` | 0 | 0,245 | `portoes/f22d/typecheck.codigo` |

A exclusão foi registada antes de cada comando do sítio. O `typecheck` esperou
por outra construção antes de arrancar. O primeiro pre-commit recusou a planta
que comparava o alias da pasta temporária com a sua forma física; a comparação
foi corrigida, e os commits posteriores passaram. A tentativa recusada permanece
em `provas/f22d/commit-limiar`, com código 1.

A prova vermelha anterior conserva-se em `clone-antes.codigo`: o clone raso
sem `master` local falhava ao pedir essa referência. A cópia fixa já não faz
essa consulta. O controlo depois da correção deu código 0 com 25 plantas em `clone.codigo`,
na cabeça `7c43b0746f8c43d9ace5cfdcb4d71a79927a6813`, com a cabeça,
a árvore, a condição de clone raso e a ausência de `master` em `clone-detalhe.json`.

O SHA-256 do original é
`45336f7489b6f36bf6062c6c88aadad4bc847729f32be1465314753335f814fc`;
o da cópia expurgada é
`d99ce84230204fdf55a80eae748897197f42c54a8375cc7dcdcb5f7b904dfa33`.
A proveniência ao lado da cópia guarda o comando
`git show 68318e0:sweeps/monthly.sh | shasum -a 256` e as linhas substituídas.
No rótulo do agente, só o nome passa a `<utilizador>`; no `cd`, só o caminho
passa a `<motor>`. As outras linhas, incluindo as chamadas Python, os cabeçalhos
e a regra de saída, conferem byte a byte. A primeira proposta, não aplicada,
fica identificada como histórica em `referencia-proposta-historica.json`.

O pre-commit `precommit-referencia-interrompido` foi interrompido antes do commit
para mover os novos metadados para `indicators/fixtures/`, fora dos JSON protegidos
da raiz. O registo conserva o código de terminação; `precommit-referencia` é a
repetição completa. A tentativa `precommit-referencia-json` foi recusada pelo
portão das respostas HTTP: os metadados de código Git estavam em JSON na pasta
dessas respostas. A proveniência passou para Markdown, ao lado do guião, com
os dois resumos e as linhas trocadas. O teste específico continua a conferir
a cópia e a recusar bytes alterados; o portão das respostas não mudou. Os
caminhos protegidos não entram no diff dos commits.

As árvores exatas das execuções históricas não guardadas não são recuperáveis
com certeza a partir deste pacote. Os registos dizem essa limitação; as novas
execuções guardam a árvore antes de correr. Não se fabricou prova retroativa.

Não há pendências locais desta passagem. `fecho.json` reúne os códigos lidos,
a referência fixa e o controlo verde do clone. `ambito-retoma.json` regista
que esta retoma só mudou as provas do sítio, antes do último commit.

### Fora desta passagem

Publicação dos ramos, ensaios despachados, chaves, interruptores e reforma de
agentes reais continuam fora do mandato. Duas corridas reais verdes de cada
rotina continuam a ser condição da reforma. As plantas não provam que outro
runner do GitHub terá outro IP.
