# CI1 · a corrida «portão» em metade do tempo, sem uma conferência a menos

*Relatório do construtor (Claude Opus 5.5), 28.09.2026, pelo brief `design/observatorio/BRIEF-CI1-o-portao-em-metade-do-tempo.md`, que nasceu da pergunta do diretor desse dia («Is there a way to optimise CI», e «without jeopardise a single bit of quality»). Worktree própria, ramo `ci1-2026-09-28`, a partir de `1c1952c9`. Cada número deste relatório está em `medidas.json`, que `medir-ci1.mjs` escreve a partir das provas de `evidencias/` e de `portoes/`, e cada frase diz ao lado do número o nome da medição. As medições locais foram feitas numa máquina partilhada com outros dois construtores: a condição de cada uma está na tabela dos tempos. Sem travessões.*

## O que mudou

- **Cada conferência uma vez.** A corrida «portão» fazia o `npm run build` e depois o `npm run verify` inteiro, que tornava a correr, sobre o mesmo `dist/`, 17 conferências que o `build` acabara de correr com o mesmo comando (`passos_repetidos`). Agora, depois do `build`, corre `scripts/verify-depois-do-build.mjs` (`npm run verify:depois-do-build`): lê as duas cadeias do `package.json` e corre só os 16 passos do `verify` que o `build` não correu (`passos_corridos_pelo_guiao`). O `npm run verify` que se corre à mão não mudou: continua a ter os seus 33 passos (`passos_do_verify`).
- **As lentas lado a lado.** Os 16 passos correm num fundo de processos, tantos quantos os núcleos da máquina, as mais lentas primeiro, no mesmo trabalho `portao`, que continua a ser a verificação que a proteção de `main` exige. O anfitrião do GitHub de um repositório público tem 4 núcleos e 16 GB (`anfitriao_nucleos`, `anfitriao_memoria_gb`, lidos na documentação do GitHub com o endereço, a hora e o sha256 da resposta em `evidencias/anfitriao-github.json`).
- **A construção do Astro mais depressa, com o mesmo resultado.** O `t()` de `src/i18n/strings.mjs` conferia a paridade das chaves das duas línguas em cada chamada (as chaves achatadas, ordenadas e procuradas com `includes`), e cada componente de cada página chama o `t()`. No perfil de CPU da construção eram 123,9 s de 229,7 s (`perfil_paridade_s`, `perfil_astro_s`), 53,9 % (`perfil_paridade_pct`). Passou a conferir na primeira chamada de cada processo, com a mesma mensagem, e a árvore das cadeias fica congelada a seguir, para a conferência não poder envelhecer. (A primeira redação dizia também «antes de a primeira página se render» sem o ter provado numa construção; a passagem CI1b prova-o, abaixo.) Localmente, a construção do Astro passou de 225,6 s para 9,5 s (`build_antes_astro_s`, `build_depois_astro_s`) e o `build` inteiro de 320 s para 73,1 s (`build_antes_s`, `build_depois_s`). O `dist/` sai igual byte a byte.

## O teste de aceitação do §2, ponto por ponto

| o que o §2 pede | a prova | onde está |
|---|---|---|
| a corrida corre cada conferência do `verify` pelo menos uma vez, sobre o mesmo `dist/` que o `build` fez | a célula U: dos 33 passos do `verify`, 17 correu-os o `build` e 16 correram no guião e saíram com 0; a célula D: os 12 484 ficheiros de `dist/` (`dist_ficheiros`) com os mesmos bytes antes e depois das conferências; a célula C: o `dist/` e o `prova.json` são da cabeça da árvore (a primeira redação dizia-o também do `cadeia.json`, que só se conferia por existir; a passagem CI1b confere-o pela hora de escrita) | `evidencias/verify-depois-B1-p4.resultado.json` e, na cabeça dos portões, `evidencias/verify-depois-final-p4.resultado.json` |
| e a segunda passagem das repetidas não conferia nada que a primeira não conferisse | as 17 conferências repetidas escreveram a mesma saída no `build` e no `verify` inteiro corrido a seguir sobre o mesmo `dist/`: 17 de 17 (`repetidas_iguais`, `repetidas_total`), com 0 linhas diferentes numa conta que a primeira redação dizia «sem normalizar nada» e que tirava a hora, os segundos e o canal que o cronómetro põe à frente de cada linha, e as linhas em branco (`repetidas_linhas_diferentes_ci1`); a passagem CI1b refê-la, abaixo, a tirar só o que não é da conferência; e o `prova.json` e o `cadeia.json` que o `verify` torna a escrever saem com os mesmos bytes que os do `build` (`prova_e_cadeia_iguais_depois_do_verify`) | `evidencias/repetidas-B1.json`, `evidencias/prova-cadeia-verify.json` |
| uma célula prova-o a partir do `package.json`, e uma conferência nova no `verify` entra sozinha | a U lê as duas cadeias com um leitor próprio (não chama a escolha) e o que correu no registo dos processos lançados; as plantas, abaixo | `scripts/verify-depois-do-build.mjs` |
| a verificação obrigatória de `main` continua a chamar-se `portao` e a dizer o estado de tudo | um só trabalho, `portao`, com o `build`, o guião e o `typecheck` como passos dele: um vermelho em qualquer um fecha-o | `.github/workflows/portao.yml` |
| o sítio construído na mesma cabeça, antes e depois do bloco, igual byte a byte, provado por um guião que compara os resumos | 0 diferenças fora do carimbo entre a construção da cabeça de partida e a do portão `build` (`diferencas_final`), e entre ela e a de logo a seguir à correção (`diferencas_depois`); o controlo, o mesmo código construído duas vezes, também dá 0 (`diferencas_controlo`); no carimbo mudam só o `commit` e o `construido_em` de `version.json` e de `prova.json` (`carimbo_campos_depois`) | `comparar-dist.mjs`, `evidencias/comparar-A1-*.json` |
| a corrida fica perto de metade do tempo, medida em duas corridas | as corridas no GitHub são do lugar de direção; a previsão é de 8,3 minutos contra a metade, 13,9 (`previsao_ci_depois_min`, `metade_da_corrida_de_referencia_min`), com a fórmula e o que ela não conta em `medidas.json` | `tempos-da-corrida.mjs` |
| o `npm run verify` que se corre à mão fica igual | a cadeia não mudou, e passou a 0 no portão (`portao_verify_codigo`) | `portoes/verify.*` |
| nenhuma conferência se enfraquece, nenhuma se retira, e nenhum resultado se guarda em cache | nenhuma saiu do `verify` nem do `build`; o `provar:guardas` ganhou 5 casos (`plantas_novas_da_paridade`); o guião não escreve nada que passe de uma corrida para outra, e a corrida não ganhou cache nenhuma | o diff |

## O mandato do §3

| # | o que | como ficou | a medida |
|---|---|---|---|
| 1 | cada conferência uma vez | `scripts/verify-depois-do-build.mjs` e a entrada `verify:depois-do-build` do `package.json`; a corrida usa-o depois do `build` | a planta de uma conferência nova só no `verify`: correu, na cadeia sintética e na cadeia real (`planta_cadeia_real_mordeu`); a planta de uma conferência tirada da escolha: a U fechou (uma das 7 plantas do guião, `plantas_do_guiao_mordidas`) |
| 2 | as conferências lentas lado a lado | processos lado a lado no mesmo trabalho, depois de medir o que cada conferência abre | os tempos, abaixo; a planta de uma conferência vermelha: a corrida fecha com 1 e nomeia-a, na cadeia sintética e na real, onde a frase plantada fechou o `check:palavras` e o `check:alvos` (`planta_cadeia_real_vermelhas`) |
| 3 | a construção do Astro mais depressa, com o mesmo resultado | a paridade das duas línguas conferida uma vez por processo, com a árvore congelada a seguir | 0 diferenças (`diferencas_depois`, `diferencas_final`); os tempos |
| 4 | o relatório | este ficheiro, `medidas.json` e `medir-ci1.mjs`; a resposta curta em `RESPOSTA-construtor-ci1.md` | completos |

## Onde iam os minutos

**A construção do Astro.** O registo da corrida de referência dá 500,7 s de páginas (`ci_antes_astro_s`), e a soma das páginas por família, no mesmo registo, mostrou que a maior parte era das páginas de linha do livro-razão. Um perfil de CPU de uma construção local inteira (`node --cpu-prof` em cada processo Node da cadeia, `perfil.mjs` para o ler) pôs o pedaço onde o Vite empacotou `src/i18n/strings.mjs` à cabeça: 123,9 s de tempo próprio em 229,7 s (`perfil_paridade_s`, `perfil_astro_s`), todo nas funções da paridade (`chaves`, `assertKeyParity`, `t` e os dois `filter`). O segundo nome do perfil era o invólucro que o Astro põe à volta de cada componente. A minha leitura, que o perfil sozinho não prova: o V8 embute lá o corpo dos componentes e, com ele, parte da mesma conferência, e é isso que explica que, corrigida a paridade, a construção do Astro tenha caído mais do que o perfil prometia. O `gate:html` também a pagava (14,5 s de 37,89 s no seu perfil, `perfil_gate_html_paridade_s`, `perfil_gate_html_s`), porque importa as bibliotecas de `src/` que chamam o `t()`: passou de 37,5 s para 12,1 s (`build_antes_gate_html_s`, `build_depois_gate_html_s`).

**As conferências repetidas.** Na corrida de referência, o `verify` gastou 179,3 s a correr outra vez as 17 que o `build` correra (`ci_antes_repetidas_no_verify_s`), e 703,2 s nas 16 que só ele corre (`ci_antes_so_do_verify_s`), em série.

**As lentas.** Os alvos, as palavras e a moldura somavam 588,7 s em série no anfitrião (`ci_antes_tres_lentas_s`): 266,8 s, 169,4 s e 152,5 s (`ci_antes_alvos_s`, `ci_antes_palavras_s`, `ci_antes_moldura_s`).

## O que cada conferência abre, e porque podem correr ao mesmo tempo

`inventariar.mjs` correu cada uma das 16 sozinha (`conferencias_inventariadas`), com uma sonda em cada processo Node (`sonda.mjs`, pelo `NODE_OPTIONS`, que regista as escritas, os servidores e os processos lançados), com o sha256 de cada ficheiro de `dist/` e o `git status --porcelain --ignored` antes e depois. A sonda provou primeiro que via, no `check:cabeca`. O que mediu:

- 4 conferências abrem um servidor (`conferencias_com_servidor`), e nenhum servidor pede uma porta fixa: todos pedem a porta 0, que o sistema dá livre (`servidores_com_porta_fixa`);
- 4 abrem um Chromium (`conferencias_com_chromium`), cada uma o seu, com o perfil numa pasta temporária de nome único;
- todas as pastas temporárias vêm de `mkdtemp`, com nome único;
- nenhuma escreve em `dist/` (`conferencias_que_escrevem_em_dist`), e nenhuma muda o `git status` (`conferencias_que_mudam_o_git`);
- só 1 escreve na árvore (`conferencias_que_escrevem_na_arvore`): o `design:feixe`, na sua pasta `design-system/`, que o `git` ignora e que mais nenhuma conferência lê;
- todas escrevem, na pasta da casa, o registo do próprio `npm`, um ficheiro por chamada, que nenhuma conferência lê;
- a memória máxima é a do `check:indice`, 1 946 MiB (`memoria_max_mib`), contra os 16 GB do anfitrião.

Nenhuma escreve em `dist/`, e a célula D prova-o em cada corrida. A primeira redação dizia também que nenhuma toca no que outra lê, sem ter medido as leituras; a passagem CI1b mediu-as e pôs o `design:feixe` a correr sozinho depois das outras (abaixo).

## Porque processos lado a lado num trabalho, e não trabalhos paralelos

O brief deixava as duas formas e pedia a que medisse mais depressa. O tempo do passo novo é o do `check:alvos`: sozinho leva 198,2 s (`alvos_sozinho_s`), dentro da corrida com 4 processos leva 198,1 s (`alvos_no_p4_s`), e a corrida toda 200,2 s (`verify_depois_do_build_p4_s`), contra os 425 s das 16 em série (`so_do_verify_em_serie_s`). O `check:alvos` espera mais do que calcula: faz 230 passagens (`alvos_passagens`, 46 rotas nas cinco larguras), e cada uma espera 500 ms de rede parada (`alvos_networkidle_ms`, o `networkidle` do Playwright instalado, que a própria documentação desaconselha) e mais 120 ms fixos (`alvos_espera_fixa_ms_por_passagem`): pelo menos 142,6 s de espera (`alvos_espera_minima_s`). Um trabalho à parte para ele pagaria outra vez a preparação da máquina (72 s na corrida de referência, `ci_antes_preparacao_s`) e a passagem do `dist/` por artefacto, antes de a conferência começar; lado a lado no mesmo trabalho, a preparação paga-se uma vez e a espera do `check:alvos` cobre as outras. Não medi a forma dos trabalhos paralelos no GitHub, porque as corridas lá são do lugar de direção: a escolha é pelos componentes medidos, e as duas corridas dele confirmam-na ou não.

## Os tempos

| o quê | tempo | cabeça | condições |
|---|---|---|---|
| a corrida de referência no GitHub, o trabalho `portao` | 27,75 min (`ci_antes_trabalho_min`); a corrida inteira 27,8 min (`ci_antes_corrida_min`) | `17758ec7` | o anfitrião do GitHub; lida na API por `tempos-da-corrida.mjs` |
| ... o `build` / o `verify` | 703 s / 883 s (`ci_antes_build_s`, `ci_antes_verify_s`) | `17758ec7` | idem |
| `build` local, antes | 320 s, com o Astro em 225,6 s (`build_antes_s`, `build_antes_astro_s`) | `1c1952c9` | sem outra construção; um `check:alvos` de outro construtor, com Chromium, a correr ao começar |
| `build` local perfilado | 323,7 s (`build_perfilada_s`) | `1c1952c9` | com `--cpu-prof` em cada processo Node; o `check:alvos --vermelhos` de outro construtor ao lado |
| `build` local, depois da correção | 73,1 s, com o Astro em 9,5 s (`build_depois_s`, `build_depois_astro_s`) | `27b13b92` | a máquina livre ao começar; um Chromium de outro construtor no fim |
| o portão `build` | 75,6 s, com o Astro em 10 s (`portao_build_s`, `portao_build_astro_s`) | `7b63369e` | a máquina livre do princípio ao fim |
| `npm run verify` inteiro, depois | 471,4 s (`verify_inteiro_depois_s`) | `27b13b92` | livre ao começar; o `gate:html` de outro construtor no fim |
| o portão `verify` | 473 s (`portao_verify_s`) | `7b63369e` | a máquina livre do princípio ao fim |
| o `verify` sem repetir o `build`, 4 processos | 200,2 s (`verify_depois_do_build_p4_s`) | `27b13b92` | livre ao começar; a construção de uma planta de outro construtor no fim |
| o mesmo, 10 processos | 205,4 s (`verify_depois_do_build_p10_s`) | `27b13b92` | idem |
| o mesmo, 4 processos, na cabeça dos portões | 201,2 s (`verify_depois_do_build_final_s`) | `7b63369e` | livre ao começar; o `verify` de outro construtor no fim |
| a corrida como era, com o código de hoje, local | 544,5 s (`build_e_verify_inteiro_depois_s`) | `27b13b92` | a soma das duas medições |
| a corrida como fica, local | 273,4 s (`build_e_guiao_depois_s`) | `27b13b92` | a soma das duas medições |
| a corrida no GitHub, depois | previsão de 8,3 min (`previsao_ci_depois_min`), contra a metade, 13,9 min | por medir | a fórmula refaz a corrida de referência em 27,6 min contra os 27,75 medidos |

A previsão não conta a disputa dos 4 núcleos do anfitrião nos primeiros minutos, quando as conferências começam ao mesmo tempo, nem o que a correção da paridade tira ao próprio `check:alvos` no anfitrião; por isso é previsão e não medida.

## O que o lugar de direção corre no GitHub, e o que esperar

1. Publicar o ramo, e ler as duas corridas com `node design/especime-v3/medicoes/ci1-2026-09-28/tempos-da-corrida.mjs <corrida> <corrida> --json <saída>`, que primeiro lê a corrida de referência como conhecido-positivo e depois diz, de cada corrida, o trabalho, cada passo, a construção do Astro, as conferências do passo novo com os seus segundos e as três células.
2. O que esperar: o trabalho `portao` verde; no passo «npm run verify, sem repetir o build», as 7 plantas mordidas, «4 processo(s) lado a lado», as 16 conferências verdes, a U com «33 passos no verify: 17 corridos pelo build, 16 corridos aqui e verdes», a D com os 12 484 ficheiros e a C com a cabeça da corrida; no passo do `build`, o Astro muito abaixo dos 500,7 s de antes (`ci_antes_astro_s`); a corrida perto da previsão.
3. A planta vermelha no GitHub: num ramo de deitar fora, acrescentar ao fim da cadeia `verify` do `package.json` um passo `node -e "process.exit(1)"`. A corrida tem de ficar vermelha no passo «npm run verify, sem repetir o build», com a U a nomear esse passo, e o trabalho `portao` vermelho.

## As plantas

- **O guião, em cada corrida.** Antes de lançar uma conferência, o guião corre 7 plantas numa cadeia sintética, numa pasta temporária (`plantas_do_guiao_mordidas` de `plantas_do_guiao_total`): a cadeia limpa passa e o que o `build` correu não corre outra vez; uma conferência nova só no `verify` corre sozinha; uma conferência tirada da escolha fecha a U; uma vermelha fecha a corrida e as outras acabam; uma que escreve no `dist/` fecha a D; um `dist/` de outra cabeça fecha a C; um passo vazio na cadeia não passa pela contagem. As contraprovas: numa cópia do guião, cada célula posta a dizer sempre «ok» fez a prova fechar com 1 e nomear a planta dessa célula, as 3 (`contraprovas_das_celulas`).
- **A cadeia real** (`planta-na-cadeia-real.sh`). Sobre o `package.json` e o `dist/` verdadeiros: um passo novo acrescentado ao `verify` correu e saiu com 0; uma frase com uma palavra da lista da norma, plantada em `dist/index.html`, fechou o `check:palavras` (que a recusa em repouso) e o `check:alvos` (o parágrafo fica fora de qualquer marco, e o axe acusa-o); a corrida fechou com 1 e a U nomeou-os; os dois ficheiros voltaram com o sha256 de antes (`planta_cadeia_real_mordeu`).
- **A paridade das línguas**, no `provar:guardas` (de 129 para 134 casos, `guardas_casos_antes`, `guardas_casos_depois`). O texto de `src/i18n/strings.mjs` lê-se do ficheiro e importa-se da memória por um endereço `data:`, sem escrever no disco: a cópia com uma chave plantada só na edição portuguesa tem de fechar na primeira chamada do `t()`, a dizer a chave; a cópia intacta tem de passar; e, depois da primeira chamada, a árvore tem de recusar uma chave nova e uma cadeia trocada. As contraprovas: com o `t()` sem a conferência, e com o `t()` sem congelar, o `provar:guardas` fechou nas plantas certas; os bytes voltaram com o sha256 de antes (`contraprovas_da_paridade`).

## As decisões deste bloco que o lugar de direção deve conhecer

- **O `provar:guardas` mudou de conteúdo.** É uma conferência do `verify`, e ganhou 5 casos. A cadeia do `verify` é a mesma; o que ela confere cresceu.
- **A árvore das cadeias fica congelada** depois da primeira chamada do `t()`. Uma escrita nela, que antes passava calada, passa a atirar: é mais estrito do que era, e nenhuma página nem conferência escreve lá (a construção e o `verify` inteiros passaram assim).
- **O guião não para as outras quando uma cai**: todas acabam, e a corrida diz todas as vermelhas de uma vez. Uma corrida vermelha leva por isso o mesmo tempo que uma verde.
- **O passo da corrida chama-se «npm run verify, sem repetir o build»**, e o fundo de processos é, por omissão, o número de núcleos da máquina; `--paralelo N` muda-o, e `--a-seco` diz o que correria sem correr nada.

## Os commits

- `85a719b2` · as ferramentas de medição do bloco.
- `790e255b` · o `verify` depois do `build` (os mandatos 1 e 2).
- `96bbb7f1` · a corrida «portão» passa a usá-lo.
- `27b13b92` · a paridade das línguas uma vez por processo, com as plantas no `provar:guardas` (o mandato 3).
- `7b63369e` · as provas do bloco e o guião das medidas.
- o último commit, que traz os portões, o `medidas.json`, este relatório e a resposta curta.

## Os portões

Na cabeça `7b63369e`, cada um no seu comando, com o código escrito num ficheiro acabado de escrever por `cronometro.mjs` depois de o processo acabar: `npm run build` a 0 (`portao_build_codigo`), em 75,6 s; `npm run verify` a 0 (`portao_verify_codigo`), em 473 s; `npm run typecheck` a 0 (`portao_typecheck_codigo`), em 0,3 s. O último commit só acrescenta ficheiros a esta pasta, que nenhum portão lê.

## O custo

Tempo de parede, do primeiro ficheiro do bloco ao fim do portão `typecheck`: 121,8 minutos (`tempo_de_parede_ate_aos_portoes_min`), com esperas por janelas sem construções de outros construtores pelo meio. Os símbolos não se leem de dentro do agente: são os que a ferramenta reporta ao lugar de direção no fim.

## O que ficou por fazer

- **As duas corridas no GitHub**, com `tempos-da-corrida.mjs`, e a planta vermelha lá: do lugar de direção, que publica o ramo.
- **O chão da corrida é agora o `check:alvos`**: 230 passagens com a espera `networkidle`. Trocá-la por uma espera que não dependa da rede parada tiraria a maior parte dos seus 142,6 s de espera, mas é mexer no que uma conferência mede, e fica para decisão.
- **O mapa do repositório** (o §3, a cadeia da corrida; o §5, os tempos) e **o registo das melhorias** ficam por pôr em dia, pelo lugar de direção.
- **No `build`**, o `check:voz` (22 s locais, `build_depois_check_voz_s`), o `gate:html` e os cartões são agora as maiores partes; não lhes mexi.

---

## A passagem de correção CI1b (28.09.2026, à noite)

*Pela leitura a frio do Codex gpt-5.6-sol (`design/especime-v3/critica/LEITURA-ci1-2026-09-28.md`) e pela triagem do lugar de direção: os achados 1, 2, 3, 4 e 10 eram as cinco plantas e não se corrigem; o 5 é do lugar de direção, que mediu a primeira corrida no GitHub e faz a segunda e a planta vermelha; os outros seis corrigem-se aqui. As provas da passagem estão em `evidencias/ci1b/`, em `evidencias/manifestos/` e em `portoes/ci1b/`; as medições têm o prefixo `ci1b_` em `medidas.json`. As da primeira entrega ficam onde estavam, porque são o que sustenta o que ela disse.*

### Achado por achado

| achado | o que a leitura viu | o que ficou | a prova |
|---|---|---|---|
| 6 | o paralelo sem interferência provada: o inventário corria cada conferência sozinha, a sonda não registava leituras, a D só comparava os bytes no fim, e o `design:feixe` escreve numa pasta da árvore | o `design:feixe` corre sozinho depois do grupo (`DEPOIS_DO_GRUPO`); a sonda regista as leituras e o inventário cruza o que cada conferência escreve com o que cada outra lê ou consulta; a D vê também uma escrita reposta, pela hora de escrita e pelo inode, no `dist/` e nos ficheiros que o `git` segue, e diz o que não vê | 0 pares com contacto (`ci1b_pares_com_contacto`) e 0 leitores de `design-system/` além do feixe (`ci1b_leitores_de_design_system`); na corrida da cabeça dos portões, o feixe começou depois de a última do grupo acabar (`ci1b_feixe_depois_do_grupo`) |
| 7 | a C só via o `cadeia.json` existir | o `prova.json` e o `cadeia.json` têm de ter sido escritos depois do carimbo desta construção, com dois segundos de folga | a planta de um `cadeia.json` de outra construção fecha a C; na cabeça dos portões, o `prova.json` foi escrito 23,3 s e o `cadeia.json` 24,5 s depois do carimbo (`ci1b_prova_escrita_depois_do_carimbo_s`, `ci1b_cadeia_escrita_depois_do_carimbo_s`) |
| 8 | a prova byte a byte não se refazia sem a máquina | os manifestos das cinco construções comparadas (o caminho e o sha256 de cada ficheiro, e o carimbo por inteiro) ficam em `evidencias/manifestos/`, e `comparar-dist.mjs` compara manifestos | as quatro comparações refeitas só com os manifestos, 0 diferenças cada |
| 9 | as plantas da paridade chamavam o `t()`, e nenhuma construção real o provava | uma cópia da árvore da cabeça, construída intacta e depois com uma chave só na edição portuguesa | o resultado, abaixo |
| 11 | a frase das «0 linhas diferentes sem normalizar nada» era falsa | a conta crua tira só o que não é da conferência, e diz o quê; a frase da primeira entrega está corrigida acima | 0 linhas diferentes em 659 (`ci1b_repetidas_linhas_diferentes_crua`, `ci1b_repetidas_linhas_comparadas_crua`) |
| 12 | a planta na cadeia real podia deixar os dois ficheiros estragados se fosse interrompida | a reposição está num `trap` (a saída normal, um erro, INT, TERM ou HUP), que confere o sha256 de cada um | a planta interrompida com um INT ao grupo inteiro, depois de plantar e de lançar as conferências, voltou aos bytes de antes (`ci1b_planta_interrompida_reposta`) |

### As células, como ficam

- **D** confere, antes de a primeira conferência começar e depois de a última acabar, o sha256, a hora de escrita (em nanossegundos), o inode e o tamanho de cada ficheiro do `dist/`, e a hora de escrita, o inode e o tamanho de cada ficheiro que o `git` segue. Uma conferência que escreva num deles fecha a corrida mesmo que reponha os bytes, e uma que o troque por uma cópia com os mesmos bytes e a mesma hora de escrita também (o inode muda). **O que a D não vê, e diz-se no guião:** uma escrita que reponha também a hora de escrita no mesmo inode, que é apagar o rasto de propósito; e o que se escreve nas pastas temporárias de nome único de cada conferência e nas pastas ignoradas, como `design-system/`. A hora de mudança do inode apanharia a primeira e não serve: o `check:palavras` copia o `dist/` com ligações duras, e cada ligação muda-a sem tocar no conteúdo.
- **C** confere o commit do `version.json` e do `prova.json`, e a hora de escrita do `prova.json` e do `cadeia.json` contra o `construido_em` do carimbo, porque os dois se escrevem no `build` depois dele e o `cadeia.json` não traz o commit.
- **As plantas passaram de 7 para 12** (`ci1b_plantas_mordidas` de `ci1b_plantas_total`): uma escrita reposta no `dist/`; uma troca por uma cópia com os mesmos bytes e a mesma hora de escrita; uma escrita reposta num ficheiro seguido; um `cadeia.json` de outra construção; e uma conferência que escreve na árvore a correr depois do grupo. **As contraprovas:** em cópias do guião, cada proteção desligada (a U, a D inteira, o inode, a hora de escrita, a árvore, a C inteira, a hora de escrita da C, e o feixe no grupo) fez a prova fechar com 1 na planta dessa proteção, 8 de 8 (`ci1b_contraprovas_apanhadas`, `ci1b_contraprovas_total`).

### O que a sonda regista, e o que não regista

A sonda regista, em cada processo Node de cada conferência, as escritas, os servidores, os processos lançados, e agora as leituras: o conteúdo de um ficheiro, a listagem de uma pasta, um ficheiro aberto para ler, e as consultas de estado, existência ou acesso. O inventário da passagem correu as 16 conferências, uma de cada vez (`ci1b_conferencias_inventariadas`), em 35 processos Node (`ci1b_processos_node`), e nenhum deixou de escrever a linha das leituras (`ci1b_processos_node_sem_leituras`); 11 das 16 leem o `dist/` (`ci1b_conferencias_que_leem_dist`), e só 1 escreve na árvore (`ci1b_conferencias_que_escrevem_na_arvore`), o feixe. **O que não regista, e porque chega:**

- o que o Node lê para carregar os módulos (`import`): são ficheiros de `src/`, `scripts/`, `tests/` e `node_modules/`; os três primeiros são ficheiros que o `git` segue, e a D confere em cada corrida que ninguém os escreve; no quarto ninguém escreve;
- o que lê um processo que não é Node: o Chromium lê as páginas pelo servidor da própria conferência, que é Node e está registado, e escreve o seu perfil numa pasta temporária própria; o `git` do `check:indice` lê o repositório, onde nenhuma conferência escreve; o `cp` do `check:palavras` lê o `dist/`, onde nenhuma escreve (a D); o `python3` do `check:briefs` e os guiões das medições dos briefs leram-se no código, e nenhum dos 16 nomeia `design-system` (`ci1b_guioes_python_que_nomeiam_design_system` de `ci1b_guioes_python_lidos`), com o conhecido-positivo de o mesmo detetor o achar no guião do feixe;
- os caminhos da casa guardam-se reduzidos à primeira pasta (quando é das escondidas das ferramentas, como `.npm`) e ao nome do ficheiro, para não levarem a disposição da máquina; o cruzamento faz-se sobre eles, e juntar caminhos só pode criar contactos a mais. O registo do próprio npm fica fora do cruzamento: é dele e nenhuma conferência o lê.

As listas inteiras (o que cada conferência escreveu, criou, leu e consultou) estão comprimidas em `evidencias/ci1b/inventario.leituras.json.gz`, para o cruzamento se refazer sem esta máquina.

### A paridade numa construção real

`planta-paridade-na-construcao.mjs` copia a árvore da cabeça para uma pasta temporária (`git archive`), clona os módulos, e corre o `astro build` duas vezes. A cópia intacta constrói e escreve as suas páginas (`ci1b_paridade_controlo_paginas`). Com uma chave só na edição portuguesa, a construção fecha com o código 1 (`ci1b_paridade_planta_codigo`) ao renderizar a primeira rota, `/404`, que é a mesma por onde o controlo começa, com a mensagem da guarda e a chave nomeada (`ci1b_paridade_planta_erro_na_primeira_rota`, `ci1b_paridade_planta_mensagem`): 0 páginas acabadas (`ci1b_paridade_planta_paginas_acabadas`) e 0 ficheiros `.html` escritos (`ci1b_paridade_planta_paginas`). O Astro escreve a linha de uma rota quando a começa e o tempo dela quando a acaba; a primeira redação deste guião contava as linhas sem distinguir e deu «não mordeu»; guardadas as linhas, viu-se que a única era a da primeira rota, começada e não acabada, e a condição passou a ser a das páginas acabadas.

### A primeira corrida no GitHub

Medida pelo lugar de direção, na cabeça `1875866b` do ramo (a corrida 36475236795), e lida aqui na API com `tempos-da-corrida.mjs`, que primeiro lê a corrida de referência como conhecido-positivo: 8,97 minutos de corrida (`ci1b_corrida1_min`), 530 s de passos somados (`ci1b_corrida1_passos_s`), contra os 27,75 minutos de trabalho da corrida de referência. O `build` levou 88 s (`ci1b_corrida1_build_s`), com o Astro em 12,9 s (`ci1b_corrida1_astro_s`); o passo novo 241 s (`ci1b_corrida1_passo_novo_s`), que é o tempo do `check:alvos` lá (240,2 s, `ci1b_corrida1_alvos_s`); a árvore 166 s (`ci1b_corrida1_arvore_s`), contra 34 s na corrida de referência: é o passo do `actions/checkout` com a história inteira, e varia do lado do GitHub. As três células passaram (`ci1b_corrida1_celulas_verdes`). A previsão da primeira entrega era de 8,3 minutos sem contar a disputa dos núcleos; a corrida levou 8,97, e a diferença está quase toda na árvore.

### Os portões da passagem

Na cabeça `b485ae52`, cada um no seu comando, com o código em `portoes/ci1b/`: `npm run build` a 0 (`ci1b_portao_build_codigo`), em 75,1 s (`ci1b_portao_build_s`), com a máquina livre ao começar; `npm run verify` a 0 (`ci1b_portao_verify_codigo`), em 471,4 s (`ci1b_portao_verify_s`), com um `check:alvos` de outro construtor a correr ao lado do princípio ao fim; `npm run typecheck` a 0 (`ci1b_portao_typecheck_codigo`), em 0,3 s (`ci1b_portao_typecheck_s`). A construção do portão sai igual byte a byte à da cabeça de partida, 0 diferenças fora do carimbo (`ci1b_diferencas_final`), e o seu manifesto é o quinto de `evidencias/manifestos/`. O `verify` sem repetir o `build`, com 4 processos, sobre essa construção: 202,7 s (`ci1b_verify_depois_do_build_s`), as três células verdes, com um `check:alvos` de outro construtor a correr ao lado o tempo todo. Os commits da passagem, a seguir aos que a leitura leu: `5dd1d2d1` (o guião), `8c51a519` (as ferramentas), `a7a4ac40` e `7e0f6240` (o mapa, a M38 e os tempos de uma corrida), `b485ae52` (o inventário, a paridade e as medidas), e o último, com o relatório, as provas, os portões e as duas ferramentas desta pasta acertadas depois deles (o inventário a reduzir também os caminhos de fora da casa, e a planta da paridade a contar as páginas acabadas), que nenhum portão lê.

### O custo

Tempo de parede da passagem, da pasta do rascunho onde começou ao fim do portão `typecheck`: 62,2 minutos (`ci1b_tempo_de_parede_ate_aos_portoes_min`), com esperas por janelas sem construções de outros construtores pelo meio. Os símbolos são os que a ferramenta reporta ao lugar de direção no fim.

### O que ficou por fazer

- **A segunda corrida no GitHub e a planta vermelha lá**, que são do lugar de direção.
- **O chão da corrida continua a ser o `check:alvos`**, e mexer na sua espera fica para decisão.
- **Uma conferência nova que escreva numa pasta ignorada** não é vista pela D: o que a vê é o inventário, que se corre quando uma conferência nova entra no `verify`.
