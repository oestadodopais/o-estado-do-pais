# CI1 · a corrida «portão» em metade do tempo, sem uma conferência a menos

*Relatório do construtor (Claude Opus 5.5), 28.09.2026, pelo brief `design/observatorio/BRIEF-CI1-o-portao-em-metade-do-tempo.md`, que nasceu da pergunta do diretor desse dia («Is there a way to optimise CI», e «without jeopardise a single bit of quality»). Worktree própria, ramo `ci1-2026-09-28`, a partir de `1c1952c9`. Cada número deste relatório está em `medidas.json`, que `medir-ci1.mjs` escreve a partir das provas de `evidencias/` e de `portoes/`, e cada frase diz ao lado do número o nome da medição. As medições locais foram feitas numa máquina partilhada com outros dois construtores: a condição de cada uma está na tabela dos tempos. Sem travessões.*

## O que mudou

- **Cada conferência uma vez.** A corrida «portão» fazia o `npm run build` e depois o `npm run verify` inteiro, que tornava a correr, sobre o mesmo `dist/`, 17 conferências que o `build` acabara de correr com o mesmo comando (`passos_repetidos`). Agora, depois do `build`, corre `scripts/verify-depois-do-build.mjs` (`npm run verify:depois-do-build`): lê as duas cadeias do `package.json` e corre só os 16 passos do `verify` que o `build` não correu (`passos_corridos_pelo_guiao`). O `npm run verify` que se corre à mão não mudou: continua a ter os seus 33 passos (`passos_do_verify`).
- **As lentas lado a lado.** Os 16 passos correm num fundo de processos, tantos quantos os núcleos da máquina, as mais lentas primeiro, no mesmo trabalho `portao`, que continua a ser a verificação que a proteção de `main` exige. O anfitrião do GitHub de um repositório público tem 4 núcleos e 16 GB (`anfitriao_nucleos`, `anfitriao_memoria_gb`, lidos na documentação do GitHub com o endereço, a hora e o sha256 da resposta em `evidencias/anfitriao-github.json`).
- **A construção do Astro mais depressa, com o mesmo resultado.** O `t()` de `src/i18n/strings.mjs` conferia a paridade das chaves das duas línguas em cada chamada (as chaves achatadas, ordenadas e procuradas com `includes`), e cada componente de cada página chama o `t()`. No perfil de CPU da construção eram 123,9 s de 229,7 s (`perfil_paridade_s`, `perfil_astro_s`), 53,9 % (`perfil_paridade_pct`). Passou a conferir na primeira chamada de cada processo, antes de a primeira página se render e com a mesma mensagem, e a árvore das cadeias fica congelada a seguir, para a conferência não poder envelhecer. Localmente, a construção do Astro passou de 225,6 s para 9,5 s (`build_antes_astro_s`, `build_depois_astro_s`) e o `build` inteiro de 320 s para 73,1 s (`build_antes_s`, `build_depois_s`). O `dist/` sai igual byte a byte.

## O teste de aceitação do §2, ponto por ponto

| o que o §2 pede | a prova | onde está |
|---|---|---|
| a corrida corre cada conferência do `verify` pelo menos uma vez, sobre o mesmo `dist/` que o `build` fez | a célula U: dos 33 passos do `verify`, 17 correu-os o `build` e 16 correram no guião e saíram com 0; a célula D: os 12 484 ficheiros de `dist/` (`dist_ficheiros`) com os mesmos bytes antes e depois das conferências; a célula C: o `dist/`, o `prova.json` e o `cadeia.json` são da cabeça da árvore | `evidencias/verify-depois-B1-p4.resultado.json` e, na cabeça dos portões, `evidencias/verify-depois-final-p4.resultado.json` |
| e a segunda passagem das repetidas não conferia nada que a primeira não conferisse | as 17 conferências repetidas escreveram a mesma saída no `build` e no `verify` inteiro corrido a seguir sobre o mesmo `dist/`: 17 de 17 (`repetidas_iguais`, `repetidas_total`), com 0 linhas diferentes sem normalizar nada (`repetidas_linhas_diferentes_sem_normalizar`); e o `prova.json` e o `cadeia.json` que o `verify` torna a escrever saem com os mesmos bytes que os do `build` (`prova_e_cadeia_iguais_depois_do_verify`) | `evidencias/repetidas-B1.json`, `evidencias/prova-cadeia-verify.json` |
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

Nenhuma toca no que outra lê, e é isso que as deixa correr lado a lado. A célula D torna a prová-lo em cada corrida, sobre o `dist/` inteiro.

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
