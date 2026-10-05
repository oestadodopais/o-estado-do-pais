# H2 · a passagem de higiene de 04.10.2026

Depois das emendas H2-c, a implementação e as provas locais estão verdes na cabeça de código `a2b8213ae49ca789349cb5dbe050fe5dbb44164f`. O ensaio histórico do H2 está verde na cabeça `f7048ce08956d89fbefc54ebd40ea8b75b830d47`; não houve publicação nesta passagem. A aceitação que exige o portão verde no ramo e em `main` confirma-se na aterragem pelo diretor; este construtor não publicou `main` nem `h2-2026-10-04`. A linha final do H2 já foi transcrita; as das passagens H2-b e H2-c continuam em `[verify]`, separadas dos respetivos contadores parciais medidos.

## A reprodução antes de mexer

Foram lidos o `CLAUDE.md`, o mapa inteiro e o brief. Antes da primeira alteração, o guião do brief produziu `brief-reproduzido.json`: as 11 medidas, os comandos e os conhecidos-positivos são integralmente iguais a `design/observatorio/medidas/BRIEF-H2.json`. Portanto, o §0 bate. Essa referência lê a cabeça presa `905105b7`; a base efetiva desta worktree era `ce325a3cd772b4317436345cec720cd739c2279d`. Não se confundem as duas cabeças.

```sh
OEDP_MEDIDAS_JSON=design/especime-v3/medicoes/h2-2026-10-04/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-H2.py
```

## O mandato, ponto a ponto

| Ponto | Resultado e medida | Prova |
|---|---|---|
| 1 · estudo em curso | Évora declara `emCurso`, a razão e o horizonte de acompanhamento. A primeira página conserva 3 estudos em cada edição, com 1 marca na portuguesa e 1 na inglesa, no estudo à cabeça. A marca imprime o ano lido da ficha. O prazo passado fecha a construção e exige decidir a ficha: prolongar a data ou retirar o estado. | `medidas.json`, `capturas.json`, E1 de `check:pais`, plantas e `tests/inicio/estudos-em-curso.mjs`. |
| 2 · I190 | 0 ligações dentro de outras nos 7883 HTML construídos, incluindo a lista inglesa. O título é a própria porta. A recusa de `a a` corre antes da saída antecipada dos documentos. | Varrimento integral em `medir-h2.mjs`; planta da ligação encaixada. |
| 3 · I191 | 0 portas para `/texto` ou `/text` nas 18 páginas de área das duas edições. As pastas das áreas contêm 20 ficheiros HTML, contando também os índices. O título liga à página do estudo; a porta auxiliar redundante foi retirada. | A2 de `check:areas`, `check:mortos` e planta da rota antiga. |
| 4 · I192 | Caminhos sem extensão só resolvem pela pasta com `index.html`; ficheiros com extensão resolvem pelo nome exato. Há 1 página só em ficheiro, enumerada abaixo. | Planta de `/404` quando só existe `404.html`; a âncora interna do próprio ficheiro resolve a partir de `/404.html`. |
| 5 · I193 | A isenção conta apenas as palavras dentro do endereço completo da API do INE. Prosa antes ou depois do endereço continua sujeita à régua. | Controlos em memória de `check:lugar` e planta com prosa no mesmo bloco. |
| 6 · I194 | No H2, 20 repetições locais, cada uma com 12 controlos e plantas. A troca mede bytes e hora iguais, outro inode e a mordida da D. A função `celulaDoDist` tem 0 alterações, por comparação literal com a base. A corrida remota `37238803296` passou. | `i194-repeticoes.json`, `github-i194.json`, `github-ensaio.json` e os logs. A confirmação de aceitação no ramo e em `main` fica para a aterragem pelo diretor. |
| 7 · M49 | `PACOTE_RETIRA` filtra secções do diff e conserva os ficheiros; `PACOTE_MOTOR` leva ficheiros e diff da cabeça do motor com as exclusões declaradas. 20 controlos e plantas passaram no H2-c. | `tests/leituras/pacote.py`, `pacote-casos-h2c.json`; cobre os dois lados, caminhos com espaços e acentos, montagem limpa, recusa de diferenças por comitar antes da cópia, extras e a conferência prévia do relatório. |
| 8 · registos | As 5 questões estão fechadas com data e commit; a M49 está feita. Inventário, chaves inglesas, revisão por ler e mapa atualizados. O conferidor leu 380 citações e reportou 0 desvios; isso não prova os números de linha, como regista a I195 aberta. Há 10 capturas inteiras e 10 recortes. | Esta pasta, as capturas, `mapa-h2c.log`, `medidas.json` e o resultado de `conferir-relatorio.py`. |

O estado é uma composição declarada, conferida palavra a palavra e na sua estrutura por `meta-do-estudo.mjs`. A régua da voz não ganha uma isenção livre: lugar, tema, data ou estado trocados e prosa acrescentada são recusados. A planta em memória que retira `emCurso` da cópia da ficha e retira a marca do HTML passa, provando que encerrar o acompanhamento não exige remendar o inventário. O resolvedor de recentes continua a devolver o conjunto completo de trabalhos, necessário à contagem das publicações; só muda a ordenação e a vista conserva o corte.

### Páginas que só existem como ficheiro

| Ficheiro | Razão |
|---|---|
| `404.html` | Página de erro padrão do Astro, servida pela Vercel como ficheiro de erro. |

## As plantas e o que mordem

Na passagem H2-b, as 8 plantas sobre o `dist/` saíram com o código de recusa esperado e cada ficheiro voltou ao mesmo resumo. Correram como prova do bloco, fora de `verify`, antes dos portões finais. Nenhuma foi acrescentada à cadeia que a célula D vigia.

| Planta | O que deve recusar |
|---|---|
| `h2-em-curso-retirado` | O estudo declarado em curso retirado da primeira página. |
| `h2-em-curso-fora-da-cabeca` | O estudo em curso presente mas fora da cabeça da lista. |
| `h2-em-curso-sem-marca` | A marca em palavras retirada da edição inglesa. |
| `h2-ligacao-dentro-de-outra` | Uma ligação dentro de outra na lista inglesa. |
| `h2-porta-so-com-html-irmao` | A porta `/404`, que antes passaria pelo ficheiro irmão. |
| `h2-indicador-fora-do-endereco` | «indicador» em prosa no bloco que também contém o endereço legítimo. |
| `h2-area-porta-antiga` | A porta antiga do texto numa área. |
| `h2-voz-estado-trocado` | A palavra do estado trocada, recusada pela conferência da voz. |

O registo completo da passagem H2-b está em `plantas-portoes-h2.json`, incluindo comando, mordida esperada e resumos antes e depois da reposição; a saída efetiva de cada recusa está no log da respetiva planta. No H2-b todas correram novamente pelo prefixo H2, na cabeça `1bf209d7d77e4ead4419203fb11f0ed774bc1367` e com o estado seguido vazio antes de cada planta. Reproduzem-se com:

```sh
mkdir -p design/especime-v3/medicoes/h2-2026-10-04/reproducao
OEDP_MEDICOES=design/especime-v3/medicoes/h2-2026-10-04/reproducao node tests/pais/portoes.mjs --prefixo h2-
python3 tests/leituras/pacote.py
node scripts/verify-depois-do-build.mjs --prova --json design/especime-v3/medicoes/h2-2026-10-04/i194-reproduzida.json
```

A planta do pacote corrompe separadamente uma exclusão do diff e um ficheiro copiado do motor, confirma a recusa e repõe os dois lados. Conserva também o caso limpo sem as novas variáveis. Os códigos de aviso e erro da conferência numérica mantêm significados distintos: o relatório com números por conferir acompanha o pacote com aviso; uma conferência que nem consegue correr impede a montagem.

### A causa e a medida da I194

A redação anterior punha preparação, cópia, `touch -r` e substituição na cadeia separadas por `&&`. O próprio orquestrador divide essa cadeia em conferências independentes e lança-as em paralelo. A planta, portanto, não assegurava a ordem necessária para criar a cópia antes de lhe repor a hora e a substituir. Agora um único comando executa essas operações sincronamente. A planta só passa se a troca também saiu a zero, teve um único passo, preservou conteúdo e hora, mudou o inode e foi recusada pela célula D. Não há salto dependente da máquina nem retirada da planta.

Foi consultada a corrida histórica `37199669028`: tentativa inicial vermelha e repetição verde na mesma cabeça, guardadas em `github-historico.json`; a queixa original está em `i194-historico.log`. Esses logs não medem a ordem exata dos processos da tentativa antiga, pelo que não a invento. A falha de ordenação está demonstrada pela leitura do divisor da cadeia e da planta; a nova premissa foi medida localmente e no runner.

O único ramo publicado no H2 foi `h2-ensaio-i194-2026-10-04`, na cabeça `f7048ce08956d89fbefc54ebd40ea8b75b830d47`. O H2-b e o H2-c não publicaram nenhum ramo. A [corrida `37238803296`](https://github.com/oestadodopais/o-estado-do-pais/actions/runs/37238803296) passou no `ubuntu-24.04`; `github-i194.json` conserva a medida da troca e a mordida. O ramo remoto foi apagado depois da conclusão; a consulta posterior encontra 0 referências (`github-ramo-apagado.json`). A exigência de duas corridas remotas, ramo e `main`, não é declarada cumprida: a confirmação do portão no ramo e em `main` cabe ao diretor na aterragem, fora do mandato desta passagem.

## Os portões na cabeça do código H2-c

```sh
sh scripts/leituras/portoes.sh <esta-worktree> design/especime-v3/medicoes/h2-2026-10-04/portoes
```

Corrida pela tranca da máquina. Os códigos abaixo foram lidos de `portoes/build.codigo`, `portoes/verify.codigo` e `portoes/typecheck.codigo`, sem cadeia com `|`. `portoes/cabeca` e `portoes/cabeca.fim` contêm ambos `a2b8213ae49ca789349cb5dbe050fe5dbb44164f`. Os resumos dos logs, já sem caminhos locais, estão em `medidas.json`.

| Portão | Código lido | Segundos | Início UTC | Fim UTC |
|---|---:|---:|---|---|
| `build` | 0 | 188 | `2026-10-05T00:26:14Z` | `2026-10-05T00:29:22Z` |
| `verify` | 0 | 1007 | `2026-10-05T00:29:22Z` | `2026-10-05T00:46:09Z` |
| `typecheck` | 0 | 0 | `2026-10-05T00:46:09Z` | `2026-10-05T00:46:09Z` |

Os tempos dos portões usam carimbos com resolução de 1 segundo; uma duração nula significa que a conferência terminou no mesmo segundo em que começou.

Entre commits correram as conferências tocadas pela mudança. Os registos originais do H2 foram feitos sobre árvores por comitar: os resumos de commit que escrevi não identificavam todo o código testado. O H2-b substitui os registos de `check:pais`, `gate:html`, `check:lugar` e do mapa por corridas na cabeça `1bf209d7d77e4ead4419203fb11f0ed774bc1367`, com `git status --porcelain --untracked-files=no` vazio antes e depois. Os registos adicionais e cada planta sobre o `dist/` também escrevem cabeça e estado. Os restantes registos antigos conservam valor histórico, não são apresentados como provas da cabeça H2-c. No fecho correram os portões inteiros. Não houve paragem por um portão de número, fonte ou pessoa. A comparação com a base encontra 0 ficheiros alterados em `ledger/`, `registos/` ou `studies-src/`.

## Capturas e leitura visual

`captar-h2.mjs` serviu a construção H2-b da cabeça `1bf209d7d77e4ead4419203fb11f0ed774bc1367` apenas localmente, esperou pelas fontes e guardou a primeira página nas larguras 390, 768, 1024, 1280, 1600 px, nas edições portuguesa e inglesa, em `design/especime-v3/capturas/h2-2026-10-04/`. Há uma página inteira e um recorte dos estudos por combinação. `capturas.json` guarda as dimensões, a lista apresentada, as marcas e os resumos dos PNG; não encontrou transbordo horizontal nem erros de página.

O H2-c conserva estas capturas: tem 0 ficheiros alterados em `src/` e `public/`. A inspeção visual efetiva H2-b está registada em `leitura-visual.json`, com os ficheiros vistos e os critérios. A marca aparece junto da data, a ordem conserva o estudo em curso à cabeça e o texto permanece legível nas larguras pedidas.

## Commits e fecho

- `5f7cf57d0ab6a24af520d14db3b288654365e4e1`: H2: executar a substituição da planta I194 num passo indivisível
- `ea5a0ed8c5903a1aedfea2ba06e177e6ec534025`: H2: montar pacotes com exclusões declaradas e ficheiros do motor
- `bfa81e08843bfc8a8bd4cee25069d14601ff1b22`: H2: declarar estudos em curso e fechar as falhas de ligações e vocabulário
- `f7048ce08956d89fbefc54ebd40ea8b75b830d47`: H2: fechar questões e registar as regras e as plantas
- `bc76aa9f7267c6f3cde81c5bb912fa74c0f8c893`: H2: guardar a prova verde e as capturas da cabeça do código
- `1bf209d7d77e4ead4419203fb11f0ed774bc1367`: H2-b: decidir prazos vencidos e corrigir a montagem e as provas
- `4d85508f736774e1fdca1ae4093eafe5e2b591d3`: H2-b: guardar as provas verdes da cabeça limpa e as capturas
- `a2b8213ae49ca789349cb5dbe050fe5dbb44164f`: H2-c: provar as recusas do pacote e a chamada E1

Todos levam os trailers `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: https://claude.ai/code/session_019Dr4reeqSo5uscMFC16k9g`. O commit de entrega seguinte contém apenas provas nesta pasta de medições; o seu resumo está na resposta ao diretor, fora do próprio commit para não criar uma referência circular. Nenhum código do sítio mudou depois da cabeça verde acima; o fecho apenas reúne as provas e os seus guiões de recolha e conferência.

Cada medição refeita em `medidas.json` leva comando e conhecido-positivo. O total final do H2 é uma transcrição externa, identificada à parte, sem conhecido-positivo próprio. O coletor recusa uma premissa falsa; não se limita a imprimir contagens. `conferir-relatorio.py` foi corrido sobre este relatório e esta pasta, com o resultado em `conferencia-relatorio.json`, e o log e o código em `relatorio-trabalho.log` e `relatorio-trabalho.codigo`.

## Modelo, custo e o que falta

Modelo lido no registo de lançamento: `gpt-6-astra`. O instante inicial, o instante do último contador e o instante da leitura de fecho estão em `custo.json`. Até essa leitura decorreram 2 599,823 segundos. O contador cumulativo parcial da própria sessão era 13 011 366 símbolos: 12 946 473 de entrada (incluindo 12 594 048 em cache) e 64 893 de saída. Esse contador é parcial e inclui entradas em cache; não é apresentado como a linha final «tokens used».

**Linha final «tokens used» do H2: 432 918.** Proveniência: o registo do lançador, lido pelo lugar de direção às 22:31 UTC de 04.10.2026 e comunicado no mandato H2-b. Trata-se de uma transcrição, sem conhecido-positivo próprio no repositório; não se apresenta como uma reconferência demonstrada pelo construtor. O contador parcial anterior permanece em `custo.json` ao lado do total final e da proveniência. O tempo acima continua a ser o que foi medido até à leitura original.

A leitura a frio do H2 está em `LEITURA-H2-2026-10-04.md`. Ficam a releitura das emendas H2-c e a aterragem com a confirmação do portão no ramo e em `main` sob responsabilidade do diretor, e a recolha da linha final do custo desta passagem após o encerramento. O ramo de trabalho não foi publicado. As chaves inglesas continuam com a revisão humana marcada por ler; não se atribui a este construtor essa revisão.

## H2-b · as emendas depois da leitura a frio (registo histórico)

A passagem parte de `acc928f23f5954d1cfc51a11fa86e94d4f6da56e`. Os achados plantados nas cópias do pacote não estavam no ramo; a divergência real de nome na contagem das áreas foi corrigida: 18 páginas de área, a contagem da `check:areas`, e 20 ficheiros HTML sob as pastas das áreas, com os índices. A medida conserva os dois nomes distintos e confirma as rotas declaradas contra os ficheiros existentes.

| Achado | Emenda e prova |
|---|---|
| 6 · I194 | A linha da questão fecha pela planta determinística e pela corrida de ensaio `37238803296`, no `ubuntu-24.04`, na cabeça `f7048ce0`. A aceitação do brief, o portão verde no ramo e em `main`, confirma-se na aterragem e é registada em `DECISIONS.md` §1.158 pelo lugar de direção. A célula D não foi alterada. |
| 7 · cabeça das provas | 8 plantas H2 e 8 registos de trabalho correram em `1bf209d7d77e4ead4419203fb11f0ed774bc1367` com `estado` vazio. O coletor recusa um registo de outra cabeça ou com diferenças seguidas. Os resultados ficaram fora da árvore enquanto corriam, para a escrita das provas não sujar a corrida seguinte. |
| 8 · argumento relativo | O repositório passa a caminho absoluto real antes da troca por marcas. A planta com `.` confirma que `relatorio.md` e `conferir-relatorio.py` conservam os pontos e que a conferência chega intacta ao pacote. |
| 9 · árvore suja | O pacote recusa modificações em ficheiros seguidos, com a razão escrita, antes de criar a pasta. Há plantas de alteração no sítio e no motor sintéticos; o controlo limpo inclui um `node_modules` ligado e não seguido. Nenhum ficheiro do motor real foi escrito. |
| 10 · data e horizonte | A E1 e os testes leem o dia UTC de `dist/version.json`. Uma data anterior exige decidir a ficha. O próprio dia-limite é válido. A marca diz «em curso até 2027» / «ongoing until 2027», com o ano vindo de `emCurso.ate`; as cadeias, o inventário e as capturas foram atualizados. |
| 11 · registos | O resto do estado antigo da I190 saiu. A linha H2 da revisão ficou dentro da tabela; a formulação nova mantém a revisão humana por ler. |
| 12 · custo | O H2 conserva o parcial e passa a citar a linha final de 432 918 símbolos com proveniência. Esta passagem tem o parcial medido abaixo e a linha final em `[verify]`. As capturas foram refeitas por cima das anteriores, nas larguras e edições pedidas. |

As plantas novas são o prazo passado (com a exigência de decisão), o prazo do próprio dia e o futuro como controlos válidos, a data ausente ou impossível, a retirada explícita do estado, o ano errado na marca, o argumento `.` no pacote e as árvores seguidas sujas. Os testes do prazo correm mesmo sem fichas reais em curso; contam 28 controlos e plantas de prazo e composição. A planta adicional `h2b-horizonte-trocado` põe um ano errado na página e exige a recusa do `gate:html`, conservando a proteção numérica. O seu resultado está em `plantas-portoes-h2b.json`. Todas as plantas que escrevem no `dist/` continuam fora do `verify`.

Os 20 controlos e plantas do pacote estão em `pacote-plantas.json`; os testes apenas criam repositórios sintéticos temporários. Os registos de trabalho com a cabeça e o estado são enumerados por `registos_trabalho` em `medidas.json`.

Cabeça do código H2-b: `1bf209d7d77e4ead4419203fb11f0ed774bc1367`. Os códigos históricos são build 0, verify 0 e typecheck 0, conservados em `portoes-h2b/`; os portões atuais da tabela acima são os do H2-c. Os commits desta passagem são:

- `1bf209d7d77e4ead4419203fb11f0ed774bc1367`: H2-b: decidir prazos vencidos e corrigir a montagem e as provas

O commit de provas H2-b é `4d85508f736774e1fdca1ae4093eafe5e2b591d3`. A segunda leitura curta do Opus originou as emendas H2-c abaixo.

Modelo desta passagem: `gpt-6-astra`. Até `2026-10-04T23:49:44.123487+00:00` decorreram 3 102,098 segundos desde o mandato H2-b. O parcial medido desta passagem é 13 730 468 símbolos: 13 675 370 de entrada, dos quais 13 439 488 em cache, e 55 098 de saída. É a diferença entre o contador anterior ao mandato e o último contador da mesma sessão, ambos conservados em `custo-h2b.json`; não inclui o trabalho H2 anterior. Linha final «tokens used» desta passagem: `[verify]`.

Não houve `push` nesta passagem. Fica por recolher a linha final do custo H2-b. A segunda leitura foi recebida no mandato H2-c. Continuam pendentes a revisão humana das cadeias novas, a aterragem com a confirmação do portão no ramo e em `main` pelo lugar de direção e a recolha da linha final de custo. Nenhum bloqueio de número, fonte ou pessoa foi contornado.

## H2-c · depois da segunda leitura curta

Base: `4d85508f736774e1fdca1ae4093eafe5e2b591d3`. Cabeça do código: `a2b8213ae49ca789349cb5dbe050fe5dbb44164f`. Os estragos plantados nas cópias do pacote não estavam no ramo. Esta passagem responde aos achados reais da segunda leitura, transcrita no mandato do lugar de direção.

| Achado | O que se fez e como se prova |
|---|---|
| 5 · plantas do pacote | O relatório inexistente não altera ficheiros seguidos e tem de falhar pela mensagem de `conferir-relatorio.py`, com o seu código de erro. As diferenças reais dos bytes do sítio e do motor sintético são recusadas antes da cópia, pelas respetivas mensagens da árvore suja. O controlo limpo deixou de ser apresentado como prova da origem Git dos bytes. Os 20 casos passaram; os códigos e as queixas das recusas estão em `pacote-casos-h2c.json`. |
| 6 · a chamada E1 | A própria `check:pais` corre sobre uma cópia temporária independente dos HTML, folhas, mapas e `version.json`. A ficha de ensaio é alterada só na memória do processo. O prazo passado e a razão em branco saem com as mensagens E1 exigidas. Uma cópia do guião sem a chamada aceita os mesmos defeitos, demonstrando que a prova acusa a eliminação dessa chamada. São 5 corridas, com 2 recusas E1, em `e1-h2c.json` e `e1-trabalho-h2c.log`. Nenhuma escreve no `dist/` real. |
| 7 · onde se conferem as provas | Os códigos dos portões, os registos completos do mapa e as capturas conferem-se no repositório, não no pacote da leitura. Os caminhos estão indicados abaixo. A ausência desses ficheiros no pacote limita o que o leitor pode confirmar apenas com ele. Não houve mudança no código por este achado. |
| 8 · números de linha do mapa | As duas âncoras foram lidas diretamente em `scripts/gate-html.mjs`: linhas 6519 e 7948. Só estas duas citações foram corrigidas. A I195 fica aberta para o lugar de direção decidir; `conferir-mapa.py` não foi alterado. O seu resultado de 0 desvios não prova a exatidão dos números de linha. |
| 9 · revisão do H2 | A linha ficou sob o cabeçalho próprio «H2 · o estudo em curso», com tabela própria, fora da secção OE1-e. A revisão humana mantém o estado por ler. |
| 10 · linha final do custo H2 | Os 432 918 símbolos são uma transcrição da linha «tokens used» do lançador, comunicada pelo lugar de direção no mandato H2-b, com a proveniência em `custo.json`. Não têm conhecido-positivo próprio. A comparação anterior entre dois campos transcritos só conferia a sua consistência, não validava a linha do lançador; essa qualificação foi retirada da medida atual. Não houve mudança no código do sítio por este achado. |

As recusas do pacote afirmam as mensagens que as causam e guardam as queixas observadas. O controlo limpo e as plantas da E1 usam a mesma `check:pais`; retirar a chamada na cópia do guião elimina as recusas do prazo e da razão. As plantas novas entram na conferência dos estudos em curso porque só escrevem na pasta temporária. As plantas sobre o `dist/` real continuam fora da cadeia de `verify`.

Os 3 registos de trabalho H2-c (`pacote-h2c.json`, `e1-trabalho-h2c.json` e `mapa-h2c.json`) nomeiam esta cabeça e têm o estado seguido vazio antes e depois. O registo anterior das oito plantas H2, da planta H2-b e das capturas mantém a cabeça H2-b; não se apresenta como uma nova corrida H2-c. Os portões H2-b foram preservados em `portoes-h2b/` e as medidas anteriores em `medidas-h2b.json`.

No repositório, os portões atuais estão em `design/especime-v3/medicoes/h2-2026-10-04/portoes/`: `build.codigo`, `verify.codigo`, `typecheck.codigo`, os registos completos e as cabeças. O mapa H2-c está em `mapa-h2c.log`, nesta pasta. Os PNG permanecem em `design/especime-v3/capturas/h2-2026-10-04/`, com os resumos em `capturas.json`. Os códigos desta corrida completa pela tranca, lidos dos ficheiros, são build 0, verify 0 e typecheck 0. `conferir-relatorio.py` voltou a sair a zero no fecho, com o resultado em `conferencia-relatorio.json`.

Commits do código desta passagem:

- `a2b8213ae49ca789349cb5dbe050fe5dbb44164f`: H2-c: provar as recusas do pacote e a chamada E1

O último commit contém só as provas. A cabeça final fica na resposta H2-c, fora do próprio commit.

Modelo: `gpt-6-astra`. Até `2026-10-05T00:46:19.399369+00:00`, o custo parcial H2-c é 8 855 041 símbolos cumulativos: 8 814 115 de entrada, incluindo 8 675 584 em cache, e 40 926 de saída; decorreram 1 743,772 segundos desde o mandato. A diferença dos contadores da mesma sessão está em `custo-h2c.json`, separada do trabalho anterior. Linha final «tokens used» H2-c: `[verify]`.

Ficam a decisão da I195, a releitura das emendas, a revisão humana das cadeias, a aterragem com os portões remotos do ramo e de `main` e o registo pelo lugar de direção em `DECISIONS.md` §1.158, e a recolha das linhas finais de custo em falta. Não houve `push`, escrita no motor real nem paragem por um portão de número, fonte ou pessoa.
