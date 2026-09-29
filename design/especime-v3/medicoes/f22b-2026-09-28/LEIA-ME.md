# F2.2b · as corridas prontas a armar

Construção local de 28.09.2026, com as provas de fecho renovadas a 29.09.2026. As corridas estão preparadas para publicação dos
ramos e ensaio no GitHub. Não houve `push`, despacho de corrida, alteração de
interruptor nem reforma de agentes reais. O teste operacional com chaves continua
por executar, como exige a separação entre este bloco e o F2.2.

Autoria: Codex, com o trailer de modelo `gpt-6-astra` exigido pelo mandato.
Bases lidas: motor `1af04566898ddfc2c5244c55c7f229b1c287fee2`, sítio
`24e7c8752f5bf80b263f13530f618278ba474992`. O C1 antecede estes ramos.

## O mandato e a medida

| # | Entrega | Prova e limite |
|---|---|---|
| 1.º | O corredor, as duas retomas e o painel usam a mesma publicação guardada. Ramo datado, API pública a cada 60 segundos durante no máximo 3600 segundos, portão do mesmo SHA, avanço normal desse SHA para `main`. | Plantas do portão vermelho, SHA e fluxo errados, teto, valor, excerto, endereço, história, estado executável, outro ficheiro e avanço concorrente de `main`. A issue é recebida por um dublê. Não se publicou um ramo real. |
| 2.º | `painel.yml`, segunda-feira às 08:30 UTC, dependente de `PAINEL_ARMADO`; despacho manual apenas de ensaio. O `refresh.py --site` reutiliza leitores e canários, leva quatro saídas em artefacto e chama `--check-heartbeat`. | Painel completo sintético, silêncio com retoma apenas do anfitrião calado, silêncio persistente sem «inacessível», revisão com issue e valor intacto, patch aplicado noutra cópia Git, quatro saídas conferidas e portão do motor vermelho a impedir commit. Até duas retomas em trabalhos distintos. O ensaio despachado fica pendente. |
| 3.º | `varrimento.yml`, dia 1 às 09:00 UTC, dependente de `VARRIMENTO_ARMADO`. `decisoes.py` recebe `--site` ou `OEDP_SITE`, sem omissão pessoal. | O varrimento com leitores substituídos por dublês gera relatório, códigos e carimbo; um achado abre issue, um leitor partido impede o carimbo. Não escreve livros nem faz commits. O ensaio despachado fica pendente. |
| 4.º | O vigia respeita os três interruptores e as três cadências. Painel e varrimento exigem o artefacto e o carimbo da própria corrida agendada. | Segunda-feira sem corrida abre issue. Ensaio, corrida vermelha, corrida incompleta, carimbo de outra corrida, carimbo antigo e data futura são recusados. Dormente não consulta a API nem abre aviso. Folga de seis horas depois do cron. |
| 5.º | `reformar_agentes.py` prepara o arquivo e a descarga dos dois agentes, depois de duas corridas reais verdes de cada rotina. | Só o modo de ensaio foi executado, sobre definições construídas para a planta. Os bytes permanecem iguais e não é criada pasta de arquivo. As provas da aplicação recusam identificadores repetidos e ensaios apresentados como reais. Nenhum agente real foi tocado. |
| 6.º | Frescura, plano da fiabilidade, registo de melhorias, README das corridas e este relatório. | `medir.py` produz `medidas.json` a partir das provas e do Git. As novas saídas, cabeças e códigos do sítio ficam em `portoes/`; as provas anteriores permanecem em `provas/`. |

## O que as guardas conservam

A publicação só acrescenta reconferências. A automação conserva todas as
reconferências anteriores; a chamada local anterior conserva o seu comportamento. O diff
recusa criação, remoção, mudança de modo, alterações fora de `verifications` e
campos de estado não permitidos. Os estados JavaScript são analisados como dados,
sem os executar. Valor, excerto, endereço e história anterior ficam protegidos.

O ramo recebe o candidato também quando a guarda o recusa: é a prova para a
revisão. `main` só avança depois de duas conferências do diff, da conclusão verde
do portão público e sem refazer o commit. Um portão local vermelho conserva o
ramo e continua a bloquear `main`, mesmo com o portão público verde. A cabeça
remota é lida antes de o artefacto afirmar que aterrou.

O painel não transforma silêncio num erro de existência. Uma resposta HTTP de
erro mantém a classificação de resposta; timeout e ligação falhada pedem retoma.
Um painel parcial pode publicar as reconferências que efetivamente leu, mas não
substitui as quatro saídas do motor nem o carimbo global. Uma corrida completa
confere resumos criptográficos e a correspondência da linha de base, relatório,
carimbo e vintages com as leituras. Uma mudança em `master` entretanto impede o
commit. Os alarmes de revisão, estrutura, metadados, limiar e existência continuam
a depender dos canários do painel; não autorizam a mudança de um valor publicado.

O varrimento guarda o relatório de cada leitor e o seu código. O `core.sweep`
corre sem `--write`: as observações entram no artefacto e nas issues, sem gravar
estado de varrimento num clone efémero. A chamada antiga do agente continua
suportada por descoberta de um repositório irmão ou por `OEDP_SITE`. A remoção
real dos agentes exige aplicação expressa e confirmação de duas corridas verdes.

A [documentação oficial da API do GitHub](https://docs.github.com/en/rest/actions/workflow-runs#list-workflow-runs-for-a-workflow)
confirma a consulta pública e os filtros usados. Os agendamentos são UTC, conforme
a [documentação dos eventos](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
As ações reutilizam os resumos fixados nos fluxos existentes do motor.

## As provas locais e os portões

O §0 do brief foi reproduzido por `BRIEF-F22b.py`, na cabeça histórica que o
próprio guião fixa. Resultado: portão em todos os ramos, 3009 linhas, 91 com
reconferências do painel, 2545 do corredor, seis commits semanais e 93 ficheiros
no commit semanal de 28.09, dos quais 91 linhas. Os sete conhecidos positivos
foram encontrados. A cópia da medida fica em `provas/brief.json`.

As 34 plantas de `indicators.rotinas_test` e as 94 conferências de
`indicators/provar_fluxo.py` passaram. Os nomes de todas as plantas estão em
`medidas.json`. GitHub, fontes e lançamento são substituídos onde há efeito
externo; o patch e os commits das cópias de ensaio usam Git real.

Corridas novas de 29.09.2026, na cabeça final da implementação e dos documentos
`01362b78a810795ee6870b8a6f439c39b9fe25e0`. O commit de entrega acrescenta apenas este
pacote de prova. Os três comandos correram separadamente, com a exclusão entre
construções conferida antes de cada um. O medidor recusa cabeças diferentes ou
mudanças posteriores fora deste pacote.

| Comando | Código lido | Segundos | Código e cabeça guardados |
|---|---:|---:|---|
| `npm run build` | 0 | 667,472 | `portoes/build.codigo`, `portoes/build.cabeca` |
| `npm run verify` | 0 | 706,278 | `portoes/verify.codigo`, `portoes/verify.cabeca` |
| `npm run typecheck` | 0 | 0,784 | `portoes/typecheck.codigo`, `portoes/typecheck.cabeca` |

O portão final do motor ficou a 0 na cabeça `5335e129b3167c93d1822c8af7cecbb909922877`, em
209,215 segundos, lidos de `provas/core-final.codigo` e do registo
ao lado. É a prova de 28.09, preservada nesta retoma, que não mudou o motor.
As saídas anteriores do sítio em `provas/` são histórico e não substituem estas
novas corridas. `medidas.json` contém os resumos SHA-256 das saídas e os instantes
de cada execução. A conferência numérica dos textos fica em
`relatorio-conferencia.json` e `resposta-conferencia.json`.

## Falhas encontradas e corrigidas

* O primeiro portão do motor saiu com 1 porque faltavam três caches derivadas
   de recortes na worktree. Repostas a partir das cópias locais existentes e
   conferidas por SHA-256, sem alterar fontes, dados publicados ou o manifesto
   protegido. As três identidades constam de `medidas.json`. O teste de travessia
   passou depois, tanto contra a cópia versionada como contra o sítio disponível.
* O primeiro pre-commit revelou uma falha da própria planta Git: o hook exportava
   variáveis que faziam as cópias temporárias usar o repositório do chamador. Três
   commits sintéticos deslocaram a cabeça deste ramo e opções Git locais. A cabeça
   e o índice foram repostos na base, preservando os ficheiros de trabalho; as
   opções escritas pela planta foram retiradas, voltando às definições globais
   de autoria e ao hook presente, que executa `core.gate`. A leitura do estado
   de fecho apanhou também `core.bare` alterado pelo mesmo `git init`; reposto
   em `false`, a árvore principal voltou a responder e a leitura saiu com 0,
   sem editar os seus ficheiros.
   As plantas passam agora com todo o ambiente `GIT_` retirado e foram também
   executadas com variáveis deliberadamente inválidas. Os commits sintéticos não
   pertencem à história entregue. A tentativa recusada permanece em
   `provas/precommit-isolamento.log` e no respetivo código.
* A inspeção obrigatória dos processos mostrou um argumento sensível de outro
   processo. Não foi usado nem copiado para estes artefactos. As inspeções
   seguintes imprimem apenas PID e tipo de comando, sem argumentos nem ambiente.

Não foi necessário alterar um portão que protegesse números, fontes ou pessoas.
O provador do fluxo passou a reconhecer a publicação pelo módulo comum e a usar
um ficheiro temporário para `GITHUB_OUTPUT`, em vez de depender de um dispositivo
do sistema. Não se baixou nenhum chão de provas.

## Commits e custo

Motor, cabeça final `5335e129b3167c93d1822c8af7cecbb909922877`:

* `6432b88b000cdcdc47a08a8721bafac8f7ab023a`: publicação guardada e rotinas transportáveis.
* `5335e129b3167c93d1822c8af7cecbb909922877`: fluxos dormentes, README, plantas e integração no portão.

Sítio:

* `01362b78a810795ee6870b8a6f439c39b9fe25e0`: frescura, plano e registo de melhorias.
* `Regista as provas e a resposta do F2.2b`: o último commit, que contém este
  relatório, `medir.py`, `medidas.json`, as provas e `RESPOSTA-construtor-f22b.md`.
  A cabeça final é a desse commit. O seu SHA resolve-se pelo histórico do ficheiro
  da resposta, sem tentar inserir num commit o resumo criptográfico dele próprio.

Só foram preparados os caminhos do bloco. Os quatro JSON de indicadores, os
restantes ficheiros protegidos e as páginas do sítio permanecem inalterados.
O `medidas.json` confere os caminhos protegidos contra a base do motor.

Na fotografia de `2026-09-29T20:10:49.328Z`, o contador cumulativo da mesma sessão
registava **26 360 707 símbolos**, com 26 238 673
de entrada, dos quais 25 434 880 em cache, e
122 034 de saída. O acréscimo desde o último contador anterior
à retoma é de **8 587 703 símbolos**. Decorreram
**1438,405 segundos** entre o primeiro evento da retoma e
essa leitura. São contadores medidos durante o fecho, anteriores ao commit e à
resposta final. A fotografia anterior da construção permanece em `provas/custo.json`;
a comparação da retoma e os dois contadores estão em `provas/custo-retoma.json`.
As durações dos portões estão separadas do tempo da sessão. Não foi medido custo
em euros nem de execução no GitHub.

## O que falta fora desta construção

Integrar os avanços de `main` antes da leitura a frio, conforme o âmbito da
retoma de 29.09. Esta retoma conserva o ramo sem essa integração.

Publicar os dois ramos; despachar e observar os ensaios do painel e do varrimento
no GitHub, incluindo o anfitrião simulado calado; preparar as chaves e decidir
cada interruptor no F2.2; observar duas corridas reais verdes de cada rotina antes
de aplicar a reforma dos agentes. Uma máquina nova não garante um IP diferente.
O F2.3 e o F2.4 continuam a ser as condições para qualquer política de valores
novos. Nenhuma destas ações foi feita nem declarada feita por este relatório.
