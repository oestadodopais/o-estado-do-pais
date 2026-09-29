# F2.2b e F2.2c · as corridas prontas a armar

## A primeira entrega

O F2.2b foi construído localmente a 28.09.2026 e teve as provas do sítio
renovadas a 29.09.2026. Os registos históricos permanecem em `provas/` e
`portoes/`. A leitura a frio e a triagem estão em
`design/especime-v3/critica/LEITURA-f22b-2026-09-29.md`.
Esta redação substitui as descrições de comportamento que a triagem corrigiu.
As afirmações anteriores sem comando e saída, incluindo a reparação histórica
de `core.bare` e de opções locais do Git, foram retiradas. Os registos antigos
não provam essas reparações e este relatório não as apresenta como verificadas.

Os commits iniciais do motor são `6432b88b000cdcdc47a08a8721bafac8f7ab023a` e
`5335e129b3167c93d1822c8af7cecbb909922877`. No sítio, a direção juntou `main`
em `22510cd9119ae01a9bca8a75c4382654cbf7e0b2` e entregou a triagem e o mandato
em `fb1dd0dd442684221a5e4aceae3b8ac5491d5546`. A linha do registo continua M41.
O §2 da frescura conserva os bytes da base recebida.

## F2.2c · a passagem de correção

Autoria: Codex gpt-6-astra. Âmbito: os pontos do mandato em
`prompts/PROMPT-f22c-construtor.md`. As plantas usam fontes, API e lançamento
simulados; Git e os ficheiros temporários são reais. Nenhuma prova aplica
`launchctl` a um agente real. As contagens de efeitos externos em `medidas.json`
são declarações do construtor, identificadas como tal. O lugar de direção mede
os interruptores e os despachos na aterragem.

| Ponto | Correção | Medida e planta |
|---|---|---|
| 0 | `master` entrou por fusão, conservando a C1e e a retoma. | `fusao-rede-local`, `fusao-rotinas`, `fusao-fluxo` e o pre-commit em `commit-fusao`. A primeira tentativa do servidor local foi impedida pelo sandbox; a repetição autorizada passou. |
| 1 | A linha conserva as últimas quatro reconferências; o índice do arquivo conserva a história. O limite importa-se de `refresh.py`. | Quatro antigas e uma nova, seis antigas e uma nova: aceites após a poda exata. Reescrita, reordenação e poda excessiva: recusadas. A célula 13 do corredor conserva o teto. |
| 2 | Só `success` dá verde. Erros permanentes param com causa; limites, servidor e rede repetem dentro do teto. | O próprio `esperar_portao` recebe pela API simulada cada conclusão pedida. HTTP 400, 401, 404, 410 e 403 sem limite param; 403 e 429 de limite, 500, 503 e rede repetem. A razão conserva o último erro. A versão mantém-se, com a fonte em `api-versoes.json`. |
| 3 | `main --aplicar` prova as corridas antes de qualquer chamada a `launchctl`. | Sem provas, só uma corrida, identificadores repetidos e ensaio em vez de real: recusas sem chamadas. O controlo verde confere a ordem das chamadas, os bytes arquivados antes de apagar e os bytes finais. |
| 4 | `fetch`, guarda contra `main`, ramo datado, portão, segunda guarda e avanço do mesmo SHA. | Uma mudança de valor é recusada antes de qualquer `push`; o diff fica no artefacto privado e a issue liga a corrida e diz a causa. O controlo verde faz os dois `push` do mesmo SHA por dublê. Corredor e retoma guardam `publicacao.*` mesmo quando a publicação falha. |
| 5 | O vigia lê os trabalhos da corrida e reconhece o trabalho real `skipped`. O título do alarme inclui rotina e data devida. | Corrida dormente e verde com carimbo: sem issue. Falta e falha: uma issue. A repetição no dia seguinte procura o título aberto e não abre outra, nas duas rotinas. |
| 6 | O despacho manual do vigia corre sempre; só o agendamento respeita o interruptor. | O provador do fluxo exerce o corredor desarmado; as plantas exercem as duas rotinas desarmadas com despacho. |
| 7 | Só o silêncio do limiar pede retoma. O limiar não decide o carimbo das linhas nem a completude das leituras. | HTTP 503 e página sem números chegam à issue com causa, sem retoma, com as linhas e o carimbo global escritos. Silêncio mantém o carimbo e repete só o limiar na tentativa seguinte. As saídas passam a sua guarda. |
| 8 | A chamada mensal sem argumentos conserva os passos, as bandeiras, o relatório e a regra de saída do portátil. | Os comandos executados pelo guião são comparados com os lidos de `master`. O calendário falhado determina a saída; caso contrário, determina-a o vigia das publicações. `OEDP_SITE` e repositório irmão são exercidos. O runner conserva `--write`, `--quiet` e a sua regra de saída própria. |
| 9 | O modo decidido chega pelo ambiente à publicação no corredor e na retoma. | Os YAML são lidos pelas plantas; a atribuição fixa na linha de comando é recusada. |
| 10 | As guardas em falta têm plantas nas funções e nas entradas principais. | `fontes.mjs`, valores novos, exportação adicional, ficheiro criado, apagado e modo alterado; `main` de publicação e fecho com despacho ou modo não real; `OEDP_SITE` aceite com código verde num sítio sintético. Os dois estados reais da cabeça do sítio passam `dados_js` e um diff plausível passa `guardar_diff`. |
| 11 | Declarações separadas de medidas; caminhos pessoais removidos de todo o pacote; nenhuma conferência posterior aos portões atribuída ao medidor. | §0 reproduzido com comando, ambiente declarado, código e hora. Exclusão de construções registada antes de cada portão. Isolamento com variáveis Git inválidas, comando e ambiente sem segredos. O detetor tem conhecido-positivo e planta num ficheiro binário aninhado. A comparação entre a cabeça dos portões e a final cabe à direção na aterragem. |

### As plantas e a prova reproduzível

As saídas desta passagem ficam em `provas/f22c/`. `plantas.log` e
`plantas-detalhe.json` nomeiam as plantas das rotinas; `plantas-f22c.log` e
`plantas-f22c-detalhe.json` nomeiam as adicionais e a cabeça dos estados reais.
`fluxo.log` guarda as conferências dos YAML. `isolamento` guarda o comando e as
variáveis artificiais que exercem a separação das cópias Git.

`brief.json`, `brief.codigo`, `brief.log` e `brief-reproduzido.json` registam a
reprodução do §0 na cabeça histórica que o guião fixa. `medidor-planta` prova
o detetor e o varrimento de todos os ficheiros do pacote, incluindo binários.
O guião `medir.py` relê os códigos, as cabeças e os resumos das saídas. Não
confere o futuro commit das provas contra a cabeça dos portões.

### Commits e portões

Em verificação. Os códigos finais só serão transcritos depois de os processos
acabarem e de os ficheiros correspondentes serem lidos.

### Custo

A medir no fecho, a partir dos contadores de símbolos da sessão e do tempo
entre o primeiro evento e a fotografia do contador. Não se mede custo em euros.

### O que fica fora desta passagem

Publicar os ramos, despachar ensaios no GitHub, preparar chaves, armar
interruptores e reformar agentes reais continuam fora do mandato. As duas
corridas reais verdes de cada rotina continuam a ser condição da reforma.
As plantas locais não provam que um runner do GitHub terá outro IP.
