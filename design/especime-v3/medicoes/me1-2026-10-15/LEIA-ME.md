# O bloco ME1 · o Método para o leitor (15.10.2026)

*Construtor: Claude Opus 5.5 (a definição `construtor`), lançado pelo lugar de direção (Claude Fable 5.1) pelo
mandato `design/observatorio/mandatos/MANDATO-ME1-2026-10-15.md`, numa worktree própria, no ramo `me1-2026-10-15`,
cortado de `main` em `4b50b92e`. Cada número deste relatório está num JSON desta pasta: `medidas.json`, escrito por
`medir-me1.mjs` em último lugar, e as provas que ele lê (`plantas/`, `frases/`, `partida/`, `motor/`, e os
`capturas.json` em `design/especime-v3/capturas/me1-2026-10-15/`); os códigos dos portões estão também nos ficheiros
`.codigo` de `portoes/`. As provas de cada passagem anterior estão na sua pasta (`primeira-passagem/`,
`passagem-de-correcao/`, `passagem-do-me1-21/` e `passagem-depois-da-leitura/`, e a corrida dos portões do ME1-23 em
`portoes-me1-23/`); as destes caminhos são as da passagem depois da leitura curta, na cabeça do código `9d8a0034` (os
portões, a régua das frases, as capturas do Método e as medidas), salvo as plantas, as conferências com o motor e os
resumos do marcador, que são as de `c8825d09` e que esta passagem não corre outra vez. Nenhum `push`.*

*A aterragem (15.10.2026, à noite): o bloco aterrou em `main` num só commit, com a identidade do projeto, porque os 59
commits do ramo de trabalho `me1-2026-10-15`, feitos antes da reescrita da história pública (§1.195), traziam a
identidade pessoal e não se publicam. O conteúdo é o da cabeça desse ramo (`9db0e405`), aplicado a três vias sobre
`main` (`1f30c079`) sem um conflito; o ramo fica fora do repositório público, e as cabeças citadas nesta pasta
(`9d8a0034`, `c8825d09`, `93a884f6` e as outras) são as dele, pelo que as medições que as leem pelo Git não se
refazem a partir da história pública. A partida `b16bcfbc` escreve-se `4b50b92e`, pelo mapa da reescrita
(`design/observatorio/reescrita-2026-10-15/mapa-dos-commits-sitio.txt`). Os portões correram outra vez na cabeça
que aterra; os códigos estão em `portoes-aterragem/`.*

## As cabeças

- **Partida:** `4b50b92e` (`main`), e `61919ee1`, o commit com o mandato fundido e os ficheiros do §0, como o
  coordenador os pôs na worktree (pedido dele, comitado como está no disco).
- **A primeira passagem:** a cabeça do código foi `99b572ec` (os três portões a zero, as plantas, a régua das frases e
  as capturas); as provas dela estão em `primeira-passagem/`.
- **A passagem de correção:** o mandato mudado pelo lugar de direção depois de ler as frases construídas (`043cbb8b`).
  A cabeça do código, onde correram os três portões, as plantas, a régua das frases, as duas conferências com o motor
  e as capturas do Método, é `93a884f6`, e o commit das provas dela é `2204dcd5`.
- **A passagem do ME1-21:** o mandato com a decisão do lugar de direção sobre a questão ME1-21 (`8743357a`). A cabeça
  do código, onde correram os três portões, as plantas da amarra e as plantas sobre o `dist/`, é `c15b2030`, e o
  commit das provas dela é `770f3230`.
- **A passagem depois da leitura a frio:** o mandato com as decisões do lugar de direção sobre a leitura (`5b2e78f1`)
  e os dois ficheiros da leitura (`600b1a41`). Uma primeira corrida dos portões, em `e0356e2f`, deu build 0, verify 1
  e typecheck 0 (`portoes-e0356e2f-verify-1/`, ver ME1-24). A cabeça do código, onde correram os três portões, as
  duas conferências com o motor, todas as plantas, a régua das frases e as capturas do Método, é `c8825d09`, e o
  commit das provas dela é `11a75560`.
- **O ME1-23:** o mandato com o ponto (8) do §7 corrigido pelo lugar de direção (`8d6feb25`) e a §1.196 regenerada
  pelo guião (`2da1f320`), com os mesmos resumos. A cabeça do código final é `2da1f320`, onde os três portões correram
  outra vez, porque a amarra lê o `DECISIONS.md` (`portoes-me1-23/`); nada mais mudou (nenhum ficheiro de `src/` nem
  de `ledger/`), e as outras provas ficam as de `c8825d09`. O commit das provas dele é `52a9857b`.
- **A passagem depois da leitura curta:** o mandato com o ponto (15) do §7 e a frase nova da escala (`4b5b75c0`), e a
  leitura curta e o registo das suas plantas (`b37d691b`). A cabeça do código, onde correram os três portões, a régua
  das frases e as capturas do Método, é `9d8a0034`; a cabeça final é a do commit das provas desta passagem, que a
  resposta final diz.

## A passagem de correção

*As provas desta passagem estão em `passagem-de-correcao/`, e as medidas que esta secção cita são as do
`medidas.json` de lá.*

O lugar de direção leu as frases construídas nas duas edições antes de lançar a leitura a frio (a regra 14), decidiu
as questões ME1-1 a ME1-6 e mudou 7 parágrafos do §3 do mandato e a entrada §1.196 do §7. O que esta passagem fez:

- **Os textos gerados outra vez do mandato**, pelos mesmos geradores (`gerar/montar-metodo.mjs`, `gerar/montar-politica.mjs`
  e `gerar/seccao1.mjs`, que corria em linha e fica agora no repositório). Antes, os geradores reproduziram os dois
  ficheiros da primeira passagem byte a byte a partir dos originais da partida e das frases antigas, e só depois
  geraram estes das frases novas; o `montar-politica.mjs` leva as duas correções que a primeira passagem tinha feito à
  mão (o tipo da língua em `portaDaPolitica` e o comentário dos algarismos). Mudaram só os 14 textos dos 7 parágrafos
  (§3.1 P2, §3.2 P1, §3.2 P2, §3.3 P2, §3.3 P3, §3.4 P2 e §3.5 P1, nas duas edições); os títulos, as portas, a abertura,
  a descrição e o título da primeira secção ficaram, e por isso as cadeias da interface e a porta do Sobre não mudam.
- **O que muda com eles:** a cópia do lado do portão (os papéis novos), os resumos do parágrafo do marcador em
  `scripts/sem-marcadores.mjs` (`resumos-do-marcador.json`, com o conhecido-positivo dos resumos da regra 5), as 14
  linhas do inventário, reescritas a partir das páginas construídas por `inventario-me1.py`, agora repetível, a citação
  do §5 da `IDENTIDADE.md` (o P2 novo do selo, com a marca), e a entrada §1.196 do mandato novo no `DECISIONS.md`, pelo
  `entrada-da-decisao.py`, que passa a trocar a entrada que lá está pela do mandato e continua a mudar só o
  `<RESUMO>`. O token `fontes` saiu do Método: ficam 10 tokens por edição.
- **O resumo novo de `src/data/metodo.mjs`:** `893a8b5e47d9` (na primeira passagem era `bdd975b1cb9b`), pelo mesmo
  comando da secção do resumo, conferido contra o carimbo da §1.196 (`resumo_de_metodo_mjs`).
- **A contagem final das palavras**, pela mesma definição: antes 2 477 e 2 477; depois 1 727 na edição portuguesa e
  1 722 na inglesa, que são 0,697 e 0,695 do que eram (na primeira passagem, 1 703 e 1 693). A meta de menos de metade
  não se cumpre, e o lugar de direção aceitou-o (ME1-4).
- **As provas corridas outra vez, na cabeça do código e com a árvore seguida limpa:** os três portões a zero; a régua
  das frases, com 40 parágrafos (20 por edição), nenhuma diferença e as 20 plantas a morder; as 11 plantas em memória;
  as 8 plantas novas e as 2 antigas sobre o `dist/`; as 3 da amarra; e as duas conferências com o motor ao lado, a
  zero.
- **As capturas PNG saem do repositório, pela §1.197**, que o lugar de direção decidiu durante esta passagem: o
  `.gitignore` ganhou `design/especime-v3/capturas/**/*.png` e `design/especime-v3/medicoes/**/*.png`, os PNG que o ramo
  tinha comitado saíram do índice num commit próprio e ficaram no disco, e no repositório ficam só os manifestos
  `capturas.json`. As capturas do Método tiraram-se outra vez nesta cabeça; as da primeira página e do Sobre são as da
  primeira passagem, porque a porta do Sobre não mudou (ver «As capturas»).
- **As decisões do lugar de direção sobre as questões**, como ele as deu, e o que as frases novas fazem:
  - **ME1-1** resolve-se pela frase: o §3.2 P2 diz agora que a imprensa não é fonte de nenhum número e que um
    observatório que compila dados oficiais é onde um número se encontra, não onde se cita, e o §3.2 P1 diz que as
    entradas cujo valor ainda não foi lido no documento da fonte se contam entre as que estão por confirmar. A linha
    `saldo-natural-portugal-2025` não se toca (nenhum ficheiro de `ledger/` mudou no ramo, `ledger_tocado_no_ramo`),
    fica contada entre as 4 por confirmar (`linhas_por_confirmar`: ela e as 3 do PRR de Évora) e vai para o bloco das
    proveniências.
  - **ME1-2** resolve-se pela frase: o §3.4 P2 diz agora onde o inventário trava («nas páginas que ele cobre, que são
    quase todas») e o que prende o texto desta página e o da página «Sobre» (uma decisão registada que carimbe a versão
    nova). A célula 3 do `check:voz` não se estende ao Método; a amarra das decisões já prende o texto. O que medi depois
    sobre esta frase está em ME1-21, que o lugar de direção decidiu a seguir (ver «A passagem do ME1-21»).
  - **ME1-3** resolve-se pela frase: o recibo «diz o que falta e marca esse campo com [a verificar]», e a definição
    curta que o portão põe a seguir ao marcador fecha a oração, antes do ponto e vírgula.
  - **ME1-4:** a meta de menos de metade não se cumpre e aceita-se, com a contagem final medida (1 727 e 1 722
    palavras, 0,697 e 0,695 do que eram).
  - **ME1-5:** o token sai; o §3.3 P3 já não diz de quantas fontes vêm as entradas, e ficam 10 tokens por edição.
  - **ME1-6** resolve-se pela frase: o §3.4 P2 diz «cada trabalho novo, uma página, uma regra, um texto», e não
    «cada mudança».
  - **ME1-17** fica para a higiene, que o lugar de direção trata.

## A passagem do ME1-21

*As provas desta passagem estão em `passagem-do-me1-21/`, e as medidas que esta secção cita são as do
`medidas.json` de lá.*

Depois da passagem de correção, o lugar de direção decidiu a questão ME1-21: a frase do §3.4 P2 fica como está, e
passa a ser verdadeira por um portão a mais, não por uma palavra a menos. O mandato ganhou a decisão no §5, no §7
(`**Afecta:** metodo · politica`) e no ponto (7) do parágrafo das decisões (`8743357a`). O que esta passagem fez:

- **A amarra das decisões carimba também a política.** Em `scripts/check-ledger.mjs`, `TEXTOS.politica` aponta a
  `src/data/politica-ia.mjs`; `cadeiasDoTexto('politica')` lê o que o módulo exporta, como faz ao Método, e com isso a
  conferência das citações da `IDENTIDADE.md` passa a conhecer as cadeias da política; a marca solta conhece os três
  nomes; e as mensagens dizem os nomes aceites, lidos do conjunto, em vez de dizerem «um dos quatro». Pela régua, a
  constituição não cita o texto da política: a corrida do `check-ledger` com a política na amarra e ainda sem entrada
  que a nomeasse deu um só erro, o da entrada em falta. Um nome novo não pediu mais nada: as duas regras que comparam
  uma entrada com a anterior que nomeia o mesmo texto (o resumo repetido sem «Sem alteração», e o «Sem alteração» com
  resumo novo) saltam a primeira entrada que o nomeia, porque `ultimaQueNomeia[nome]` ainda não existe, e a
  conferência que fecha o círculo compara-a com o ficheiro de hoje, como a qualquer outra.
- **A §1.196 carimba os dois textos:** `**Texto:** metodo 893a8b5e47d9 · politica 62e42b67cf86`, escritos por
  `entrada-da-decisao.py`, que troca agora os dois lugares, `<RESUMO>` e `<RESUMO-POLITICA>`, pela conta de
  `resumoDoTexto()` sobre cada ficheiro, e substituiu a §1.196 que estava no `DECISIONS.md` pela do mandato
  (`resumo_de_metodo_mjs` e `resumo_de_politica_ia_mjs` em `medidas.json`, cada um com o carimbo lido da entrada).
- **As quatro primeiras recusas entram no inventário** como linhas vivas `divulgacao`, nas duas edições, como a quinta
  (8 linhas), pelo mesmo `inventario-me1.py`, com a razão escrita e o rasto em `REVISOES-DO-INVENTARIO.md`; as outras
  54 linhas da secção saíram iguais (`inventario_do_metodo`: 62 linhas novas vivas).
- **As plantas.** As da amarra são agora 5 (`plantas/plantas-da-amarra.json`): às três de antes juntam-se uma
  recusa com uma palavra mudada em `src/data/politica-ia.mjs` sem entrada nova, e a §1.196 com o resumo da política
  da partida, desatualizado; as duas param o `check-ledger` na amarra, com a queixa do texto da política. Sobre o
  `dist/`, uma planta nova, `me1-primeira-recusa-mudada`, muda uma palavra da primeira recusa inglesa, e o `check:voz`
  recusa-a pela linha nova do inventário; as 9 plantas `me1-` e as 2 antigas correram outra vez nesta cabeça, todas a
  morder.
- **A medida dos textos fora da amarra** (`textos_das_paginas_fora_da_amarra`) diz o estado de depois: a amarra
  carimba 3 textos (`sobre`, `metodo`, `politica`), as 5 recusas estão presas pela amarra e pela sua linha viva do
  inventário nas duas edições, e nenhuma fica sem portão. Fica fora da amarra, e é dito, o que as duas páginas
  importam de `src/i18n/strings.mjs` (as cadeias da interface, como o título e a descrição da página), de
  `src/lib/prova.mjs` (as contagens que os tokens rendem e as suas dicas), de `src/lib/routes.mjs` (os caminhos) e,
  no Sobre, de `src/lib/navegacao.mjs` (os nomes das suas portas).
- **Os portões**, na cabeça do código `c15b2030`, com a árvore limpa: build 0, verify 0, typecheck 0 (ver «Os portões»).
  O commit da amarra (`38a86dc2`) deixa-a vermelha sozinho, porque a amarra nova pede uma entrada que nomeie a
  política e a entrada tem o seu próprio commit, o seguinte (`d4026d67`); nenhuma corrida se fez entre os dois.
- **O que não correu outra vez, e porquê.** As duas conferências com o motor, a régua das frases, os resumos do
  marcador e as capturas correram em `93a884f6` e não correram outra vez, porque o que elas leem não mudou: entre
  `93a884f6` e `c15b2030` não mudou nenhum ficheiro de `src/` nem de `ledger/` (`fontes_das_paginas_desde_a_cabeca_da_correcao`), e o
  `dist/` construído em `c15b2030` é igual ao de `93a884f6` ficheiro a ficheiro, pelo sha256, em 15 008 dos
  15 010 ficheiros; os 2 que diferem são `prova.json` e `version.json`, os que trazem a cabeça e a hora da
  construção, e nenhum é uma página (`dist_desde_a_cabeca_da_correcao`, escrita por `comparar-dist.py` contra o
  manifesto do `dist/` de `93a884f6`, tirado antes da construção nova).

## A passagem depois da leitura

*As provas desta passagem estão em `passagem-depois-da-leitura/` (os portões, as medidas, as frases construídas e o
manifesto das capturas do Método) e, para as que a passagem seguinte não correu outra vez, nos caminhos de cima. A
frase da escala citada aqui mudou outra vez depois da leitura curta (ver «A passagem depois da leitura curta»).*

A leitura a frio do Codex `gpt-6-astra` (`design/especime-v3/critica/LEITURA-ME1-2026-10-15.md`, com o registo das
plantas em `design/especime-v3/critica/PLANTAS-ME1-2026-10-15.json`) mordeu as cinco plantas em cinco: os achados 1,
2, 3, 4 e 13 eram as plantas. O lugar de direção decidiu os achados reais no §7 do mandato (os pontos 8 a 14) e mudou
quatro frases do §3 (`5b2e78f1`); os dois ficheiros da leitura estão no ramo (`600b1a41`). A §1.196 carimba agora
`metodo fcb1354596d4 · politica 62e42b67cf86`: o resumo do Método mudou com as frases, e o da política não mudou. Cada achado real,
com a decisão e o que esta passagem fez:

- **O achado 5 (Major), a terceira recusa contra a frase das fontes.** Decisão: a recusa não se reescreve, porque a
  política pública diz que as recusas não mudam de substância sem a palavra do financiador; a contradição resolve-se
  na raiz, pelo bloco RP4-o (as linhas confirmam-se na fonte ou saem das páginas), que aterra antes deste. A terceira
  recusa não mudou nesta passagem. Ao fechar este achado medi as linhas, e a descrição delas na §1.196 não batia com o
  livro-razão; o lugar de direção corrigiu-a (ME1-23).
- **O achado 6 (Major), as contagens e o painel semanal.** Decisão: as datas das reconferências do painel europeu
  medem-se nos registos, por guião, e o relatório diz de onde vêm as contagens. As contagens das verificações (as
  entradas reconferidas, as reconferências e as divergências) e as das correções (as correções, as atualizações e as
  revisões de proveniência) vêm do livro-razão, `ledger/`: das entradas `verifications` e `corrections` de cada
  linha, que o registo das correções junta; o pacote de uma leitura não leva o livro-razão inteiro. A página rende-as
  pelos tokens da prova (`src/lib/prova.mjs`), e o portão de HTML reconta cada uma. As datas
  (`reconferencias_do_painel_europeu`): as entradas do painel semanal no livro-razão têm as datas 21.09.2026, 28.09.2026, 05.10.2026, 12.10.2026,
  de sete em sete dias, e a história de `src/data/verificacao.mjs` tem uma data por corrida do painel, desde
  12.08.2026, com as mesmas datas desde a primeira do livro-razão; a última é a de hoje no ficheiro,
  12.10.2026.
- **O achado 7 (Major), a frase inglesa dos estudos de Évora.** Decisão: diz que um deles só tem a abertura na edição
  portuguesa (a medida do §0, `estudos-aberturas.json`). Feito no §3.7 P2 inglês.
- **O achado 8 (Major), a régua das frases.** Decisão: conta todos os parágrafos visíveis. Feito:
  `conferir-frases.mjs` lê todos os `<p>` visíveis de cada secção, menos a linha das portas, e um parágrafo a mais é
  uma diferença no número de parágrafos; a planta nova põe um `<p>` sem a classe a seguir ao primeiro parágrafo das
  fontes, nas duas edições, e a régua recusa-o.
- **O achado 9 (Major), a régua dos nomes e o `noscript`.** Decisão: a régua lê também o texto de `noscript`. Feito,
  com um achado meu pelo caminho: o portão de HTML lê as páginas com o conteúdo de `noscript` deitado fora
  (`noscript: false` em `blockTextElements`), e por isso tirar `noscript` dos excluídos não bastava, porque a árvore
  do portão já não o tem. A régua passa a reler o HTML da página com `noscript` lido como HTML (`LEITURA_DOS_NOMES`),
  o portão passa-lhe o HTML, o décimo segundo caso em memória lê a sua página como o portão a lê, e uma planta sobre o
  `dist/`, `me1-nome-dentro-de-noscript`, prova o caminho do portão. A medida dos nomes lê `noscript` da mesma maneira.
- **O achado 10 (Major), a frase das limitações e a repetição da leitura.** Decisão: «guião» e «atributo» saem e a
  frase diz o mesmo em palavras correntes, e a frase da leitura por outra família deixa de repetir o que a primeira
  secção já diz. Feito no §3.4 P1 e no §3.4 P2, nas duas edições. Ao tirar «que não conhece o trabalho de antemão», a
  L3 do `check:lugar` passou a contar o «trabalho» de «cada trabalho novo» (ME1-24).
- **O achado 11 (Major), a frase da escala.** Decisão: passa a palavras correntes com o mesmo sentido. Feito na
  entrada `a-escala` do fecho, nas duas edições, pelo gerador; a linha antiga do inventário, do bloco `dominio`,
  passou a retirada com a razão do achado, e a nova entrou viva, como autorreferência, porque diz o que este projeto
  escolheu. A régua das frases compara a forma de antes com a frase nova no lugar da antiga, e o comentário do mapa
  por concelho deixou de dizer que as palavras não mudavam.
- **O achado 12 (Major), os termos da pobreza na primeira página.** Decisão: são de outra página e de outro bloco, e
  ficam na questão I229. Nada mudou aqui.
- **O achado 14 (Minor), a comparação dos `dist/`.** Decisão: fica anotado; as capturas novas desta passagem
  substituem a justificação da comparação. Nesta passagem tudo correu outra vez na cabeça do código, e a comparação
  fica com as provas da passagem do ME1-21.

E o resto do que o lugar de direção pediu: o §8 da `IDENTIDADE.md` diz os três nomes curtos (`metodo`, `sobre` e
`politica`); a entrada `me1` de `REVISOES-DO-INVENTARIO.md` passa a lida pelo Codex `gpt-6-astra` e pelo lugar de
direção; as linhas do inventário dos parágrafos mudados reescreveram-se pelo mesmo guião (5 linhas, e as 2 da escala
nova, com as 2 antigas retiradas); os três portões, as duas conferências com o motor, todas as plantas, a régua das
frases e as capturas do Método correram outra vez na cabeça `c8825d09`.

Os quatro parágrafos mudados, como o HTML de `c8825d09` os diz:

- §3.4 P1, PT: «Estas páginas são geradas a partir dessa lista. De cada vez que são construídas, um programa lê o texto de todas elas: cada algarismo tem de ter uma origem declarada, uma entrada da lista ou uma das razões escritas numa lista fechada, como um número de ordem ou a data da própria página; um algarismo sem origem trava a publicação, e um valor diferente do da sua entrada, também. O que esse programa não vê: um número escrito por extenso, um número no código que a página carrega, ou um número guardado fora do texto que se lê, passam. A revisão junta estas verificações a leituras por amostra; nenhuma página é lida uma a uma antes de sair.» EN: «These pages are generated from that list. Every time they are built, a program reads the text of all of them: every digit must have a declared origin, an entry in the list or one of the reasons written on a closed list, such as an ordinal or the page's own date; a digit without an origin stops publication, and so does a value that differs from its entry. What that program does not see: a number written out in words, a number in the code the page loads, or a number stored outside the text one reads, all pass. Review combines these checks with sample readings; no page is read one by one before it goes out.»
- §3.4 P2, PT: «Antes de uma mudança chegar a estas páginas, as mesmas verificações recusam, entre outras coisas, uma frase copiada de uma fonte que não seja igual à da fonte, um nome ou uma definição que a fonte não dá a essa medida, e qualquer dado pessoal, segredo ou caminho de uma máquina. As frases que este projeto escreve sobre si e sobre os números estão num inventário, e nas páginas que ele cobre, que são quase todas, uma frase nova que não esteja lá trava a publicação; o texto desta página e o da página «Sobre» só mudam com uma decisão registada que carimbe a versão nova. E cada trabalho novo, uma página, uma regra, um texto, é lido antes de se publicar por um sistema de outra família, com cinco erros plantados de propósito que tem de encontrar todos; o que ele encontra que mude um número ou uma frase corrige-se antes de publicar, e os reparos pequenos juntam-se numa passagem semanal.» EN: «Before a change reaches these pages, the same checks refuse, among other things, a sentence copied from a source that is not identical to the source's, a name or a definition the source does not give to that measure, and any personal data, secret or machine path. The sentences this project writes about itself and about the numbers are kept in an inventory, and on the pages it covers, which are nearly all of them, a new sentence that is not in it stops publication; the text of this page and of the «About» page changes only with a recorded decision that stamps the new version. And every new piece of work, a page, a rule, a text, is read before publication by a system from another family, with five errors planted on purpose that it must find, all of them; whatever it finds that changes a number or a sentence is corrected before publishing, and the small repairs are gathered into a weekly pass.»
- §3.7 P2 (mudou só a edição inglesa), PT: «Os estudos de Évora abrem com a pergunta a que respondem e com a leitura deste projeto: o que os números mostram, o que este projeto conclui e o que podia funcionar melhor. Os estudos mais antigos têm o texto e as fontes, sem essa abertura.» EN: «The Évora studies open with the question they answer and with this project's reading: what the numbers show, what this project concludes and what could work better; one of them has that opening in the Portuguese edition only. The older studies have the text and the sources, without that opening.»
- §3.9, a escala, PT: «Nos mapas, as classes da escala são números redondos escolhidos por este projeto, e não um limite oficial.» EN: «On the maps, the scale classes are round numbers chosen by this project, not an official limit.» (a régua das frases
  confere-as na forma, contra o §3.9 do mandato)

## A passagem depois da leitura curta

A leitura curta da passagem de correção pelo Codex `gpt-6-astra` (a M48;
`design/especime-v3/critica/LEITURA-CURTA-ME1-correcao-2026-10-15.md`, com o registo das plantas em
`design/especime-v3/critica/PLANTAS-ME1-correcao-2026-10-15.json`) mordeu as cinco plantas em cinco: os achados 1, 2,
3, 5 e 8 eram as plantas. O lugar de direção decidiu os achados reais no ponto (15) do §7 do mandato e mudou a frase da
escala no §3.9 (`4b5b75c0`); os dois ficheiros da leitura estão no ramo (`b37d691b`). A §1.196 carimba agora
`metodo 1db645c40fa5 · politica 62e42b67cf86`: o resumo do Método mudou com a frase da escala, e o da política não mudou. Cada achado
real, com a decisão e o que esta passagem fez:

- **O achado 4 (Major), a régua das frases e a linha das portas.** Decisão: a régua confere também o texto dos
  parágrafos das portas, e não só as suas ligações, e lê `noscript` como o comentário promete. Feito em
  `conferir-frases.mjs`: cada `<p class="regra-portas">` visível de uma secção confere-se pelo texto inteiro contra as
  portas do mandato, juntas como a página as rende, e a página lê-se com o conteúdo de `noscript` como HTML (a leitura
  com `noscript: false` deitava-o fora, e o comentário dizia o contrário). Duas plantas novas, nas duas edições: um
  `<p class="regra-portas">` com prosa a mais nas fontes, recusado pelo texto da linha das portas, e um parágrafo
  dentro de `noscript`, recusado pelo número de parágrafos. A régua leu 40 parágrafos, sem diferenças, e as
  26 plantas morderam.
- **O achado 6 (Major), a medida do painel europeu.** Decisão: fica como está. As datas leem-se das entradas
  `verifications` do livro-razão e da história de `src/data/verificacao.mjs`, que o pacote de uma leitura não leva; a
  medida dá o comando e o conhecido-positivo, e quem tiver o repositório repete-a.
- **O achado 7 (Major), a frase da escala.** Decisão: diz «os valores onde a cor muda» em vez de «as classes da
  escala». Feito na entrada `a-escala` do fecho, nas duas edições, pelo gerador; a linha do inventário da redação
  intermédia passou a retirada, na secção ME1, com a razão do achado, e a nova entrou viva. A frase anterior não volta
  (o guião do inventário recusa-a numa página).
- **O achado 9 (Minor), o relatório e a forma.** Decisão: o relatório deixa de dizer que a forma ficou carácter a
  carácter. Feito em «O que mudou para o leitor» e em «Os ficheiros tocados»: a cor, a letra e as recusas estão como
  estavam, e a frase da escala mudou duas vezes, com a razão de cada uma.

E o resto: a entrada `me1` de `REVISOES-DO-INVENTARIO.md` acrescenta a leitura curta; a §1.196 foi regenerada pelo
guião; os três portões, a régua das frases e as capturas do Método correram outra vez na cabeça `9d8a0034`; as plantas
sobre o `dist/`, as da amarra e as duas conferências com o motor ficam as de `c8825d09`, porque esta passagem não muda
nenhuma régua delas nem o livro-razão. O `custo-construtor.json`, a leitura do custo deste construtor pelo `custo.py`,
posta pelo lugar de direção, está nesta pasta.

A frase da escala, como o HTML de `9d8a0034` a diz: PT «Nos mapas, os valores onde a cor muda são números redondos escolhidos por este projeto, e não um limite oficial.» EN «On the maps, the values where the colour changes are round numbers chosen by this project, not an official limit.»

## O §0 do mandato, repetido

Corri `medir-mandato.py` (o mesmo sha256 do guião do lugar de direção) sobre a worktree de partida às 03:20 UTC,
antes de mudar um ficheiro: `partida/comparacao.json` compara as 26 medidas com as do lugar de direção, e nenhuma
diverge (com o conhecido-positivo de uma cópia estragada que diverge só na medida estragada). Os três portões de
partida, na cabeça `61919ee1`, com a árvore limpa no princípio e no fim, deram build 0, verify 0 e typecheck 0
(`partida/portoes/`). A primeira corrida de partida foi parada: ver ME1-15.

## O que mudou para o leitor

- **O Método fala ao leitor, em 9 secções**, pela ordem do §2 do mandato e com as frases do §3 palavra por palavra,
  nas duas edições: quem escreve estas páginas; de onde vêm os números; o recibo de cada número; como se confere; o
  que está por confirmar; as correções; o que se mede, e quem decide; o que este projeto não faz; a forma. Cada
  secção tem o seu título na coluna de rótulo e parágrafos corridos, com as portas no fim e a seta. Saíram o desenho
  do mecanismo com as suas contagens, as dobras, o número das regras, as linhas «Mecanismo», «O que isto não apanha»
  e «Prova», o sinal das fontes (que mostrava a última corrida do corredor na máquina, de 01.09.2026) e a lista do
  que se mede a seguir. A abertura e a descrição da página são as do mandato, e o sumário diz as 9 secções, sem
  números.
- **A secção de quem escreve estas páginas é a primeira** e guarda o `id="politica-de-ia"` para as ligações que
  estiveram no ar. O rótulo de todas as páginas, a faixa dos documentos alojados e a porta do Sobre abrem o Método pelo
  princípio (`/metodo` e `/en/method`, sem âncora; `porta_do_rotulo` e `porta_do_sobre`); a porta do Sobre diz o título
  novo, «Quem escreve estas páginas» / «Who writes these pages». O rodapé não muda.
- **Nenhum nome de modelo nem de fornecedor** no texto visível do Método (`nomes_de_modelos_no_metodo`, com o
  conhecido-positivo dos quatro nomes no Método de antes), e a régua nova confere-o em cada construção. A página diz os
  três papéis, a regra das famílias, e liga ao documento público da política, que é a única ligação para fora dela
  (`ligacoes_para_fora_do_metodo`).
- **Os números que ficam entram na prosa pelos tokens da prova**: 10 por edição (11 na primeira passagem, que tinha o
  das fontes distintas), cada um com a marca `data-prova`, a
  sua porta e o valor que o portão de HTML reconta (`tokens_da_prova_no_texto_corrido`). As duas contagens do atraso
  das séries passaram a abrir a secção do que está por confirmar (ME1-7).
- **As cinco recusas, a cor e a letra estão como estavam**, carácter a carácter, conferidas contra as páginas de antes
  do bloco, guardadas em `antes/`. **A frase da escala mudou duas vezes:** a leitura a frio do Codex leu a antiga, que
  falava de classes e de marcas sem dizer de quê, como ininteligível para um leitor de primeira vez (o achado 11), e a
  leitura curta da passagem de correção leu a primeira redação nova, «as classes da escala», como um termo ainda por
  explicar (o achado 7); a de agora diz «os valores onde a cor muda». A régua das frases confere a forma de antes com a
  frase do §3.9 do mandato no lugar da antiga.
- **As âncoras antigas** `motor`, `intervencao-humana` e `a-seguir` deixam de existir, as outras ficam, e entra
  `por-confirmar` (`ancoras_antigas_do_metodo`, com o conhecido-positivo das 17 âncoras na página de antes). Nenhuma
  página do sítio ligava às três que saem.

## As frases construídas

`frases/frases-construidas.json` tem as frases do Método lidas do HTML de `dist/`, nas duas edições, parágrafo a
parágrafo, com a secção, os valores de cada token e as portas, para o lugar de direção as ler antes de lançar a
leitura a frio. A régua das frases (`conferir-frases.mjs`) compara cada uma com as frases tiradas do mandato por
`frases-do-mandato.py` (nunca datilografadas): a abertura, a descrição, o sumário, a ordem e os títulos das secções,
cada parágrafo no seu molde (o texto de fora das marcas carácter a carácter, e cada token no seu lugar e com a sua
chave), a frase da política contra o oráculo, as portas, e as recusas e a forma contra as páginas de antes. Em
`frases/conferencia-das-frases.json`: 40 parágrafos lidos, 20 por edição, e nenhuma diferença; e 26 plantas, uma
palavra trocada por secção e por edição (as 8 secções de texto, uma recusa e a forma), um parágrafo a mais sem a
classe numa secção (desde a leitura a frio), e prosa a mais com a classe da linha das portas e um parágrafo dentro de
`noscript` (desde a leitura curta), todas recusadas na secção onde foram postas. Os parágrafos são todos os `<p>`
visíveis de cada secção, com o conteúdo de `noscript`, menos a linha das portas, que se confere pelo texto inteiro; e a
forma compara-se com a frase do §3.9 do mandato no lugar da antiga da escala.

Três frases, como o HTML de `9d8a0034` as diz (não mudaram depois da passagem de correção):

- §3.1 P1, PT: «Escrito, conferido e atualizado por sistemas de inteligência artificial, segundo regras publicadas;
  nenhum humano revê cada mudança antes de se publicar, e as regras e as recusas estão nesta página.» EN: «Written,
  checked and updated by artificial intelligence systems, under published rules; no human reviews each change before
  it is published, and the rules and the refusals are on this page.»
- §3.3 P3, PT: «Hoje a lista tem 3 226 entradas; 3 222 têm a origem completa e 4 esperam a confirmação de um campo
  na fonte.» EN: «Today the list has 3 226 entries; 3 222 have their origin complete and 4 await the confirmation of a
  field at the source.»
- §3.4 P3, PT: «Estas verificações provam que o que a página mostra é o que a lista guarda; a releitura na fonte
  prova que a lista diz o que a fonte imprimiu; nenhuma prova que a fonte esteja certa, nem que as conclusões deste
  projeto o estejam. Cada recibo diz se o seu número já foi relido na fonte por um caminho diferente e por um sistema
  que não o publicou, em que data e com que resultado. O painel europeu, na página «Portugal na União Europeia», é
  reconferido contra a fonte todas as semanas, e essa página diz quando foi a última vez.» EN: «These checks prove
  that what the page shows is what the list holds; the re-reading at the source proves that the list says what the
  source printed; neither proves that the source is right, nor that this project's conclusions are. Each receipt says
  whether its number has been read again at the source by a different route and by a system that did not publish it,
  on what date and with what result. The European panel, on the page «Portugal in the European Union», is re-checked
  against the source every week, and that page says when the last time was.»

## As palavras do corpo do Método

Pela mesma definição antes e depois (o texto de `<main>`, lido elemento a elemento, sem guiões nem folhas; ME1-18):
antes, 2 477 palavras na edição portuguesa e 2 477 na inglesa (as páginas de `antes/`, da construção de `61919ee1`);
depois, na cabeça `9d8a0034`, 1 729 e 1 736, que são 0,698 e 0,701 do que eram (depois da leitura a
frio, 1 727 e 1 733, `passagem-depois-da-leitura/medidas.json`; na passagem de correção, 1 727 e 1 722,
`passagem-de-correcao/medidas.json`; na primeira passagem, 1 703 e 1 693, `primeira-passagem/medidas.json`). **A meta
do §6.5, menos de metade, não se cumpre** com as frases do mandato postas palavra por palavra, e o lugar de direção
aceitou-o (ME1-4). Por parte, na edição portuguesa (`palavras_por_parte_do_metodo`): a secção «Como se confere» tem
455 palavras, a de quem escreve estas páginas 242, a do recibo de cada número 184, a das fontes 164, a do que este
projeto não faz 145, a do que se mede 129, a das correções 111, a forma 116 e a do que está por confirmar 108; na
inglesa, pela mesma ordem, 464, 244, 176, 159, 160, 125, 108, 113 e 106. A soma das partes é o corpo inteiro nas duas edições.

## Os ficheiros tocados

- **O texto e a página:** `src/data/metodo.mjs` (as secções 2 a 8 em `SECOES`, geradas das frases do mandato por
  `gerar/montar-metodo.mjs`; a abertura nova; o endereço, a forma e o marcador copiados byte a byte, salvo a frase da
  escala, que o gerador troca pela do §3.9 do mandato),
  `src/data/politica-ia.mjs` (a âncora vazia, `ID_DA_SECCAO_DA_POLITICA`, `DOCUMENTO_DA_POLITICA`, `portaDaPolitica()`,
  e a primeira secção, gerada do mandato por `gerar/montar-politica.mjs`; as cinco recusas copiadas byte a byte),
  `src/views/MetodoView.astro`, `src/components/Frase.astro` (o token da prova pela chave, com a prova da página),
  `src/i18n/strings.mjs` (a descrição nova; saem as chaves do desenho, das linhas rotuladas, da lista e das vagas),
  `src/styles/leitura.css` e `src/styles/site.css`, `src/lib/prova.mjs` (a porta das duas contagens do atraso),
  `src/components/RotuloDeIA.astro`, `src/lib/documentos.mjs` e `src/views/SobreView.astro` (a porta), e sai
  `src/components/InstrumentoMecanismo.astro`.
- **As réguas:** `scripts/lugares-ia-do-portao.mjs`, `scripts/gate-html.mjs`, `scripts/textos-aprovados.json`,
  `scripts/sem-marcadores.mjs`, `scripts/check-lugar.mjs`, `scripts/check-ledger.mjs`,
  `scripts/incorporar-do-portao.mjs`, e as plantas novas em `tests/pais/portoes.mjs`.
- **Os documentos:** `design/especime-v3/INVENTARIO-FRASES.md`, `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`,
  `IDENTIDADE.md` §5 (e duas frases que o bloco tornaria falsas, ME1-9), e a entrada §1.196 no fim do
  `DECISIONS.md`, no seu próprio commit.
- **Esta pasta:** os guiões do bloco (`frases-do-mandato.py`, `conferir-frases.mjs`, `medir-me1.mjs`,
  `resumos-do-marcador.mjs`, `entrada-da-decisao.py`, `blocos-do-metodo.py`, `inventario-me1.py`,
  `pedido-das-capturas.py`, `motor.sh`, `plantas/plantas-da-amarra.py`, `partida/comparar-o-par.py`, `gerar/`, com o
  `gerar/seccao1.mjs` da passagem de correção) e as provas das duas passagens.
- **O `.gitignore`**, pela §1.197: os PNG das capturas e das medições deixam de entrar no repositório.
- **Na passagem do ME1-21:** `scripts/check-ledger.mjs` (a amarra carimba a política), a §1.196 do `DECISIONS.md` com os
  dois resumos, as 8 linhas das recusas em `INVENTARIO-FRASES.md` e o rasto em `REVISOES-DO-INVENTARIO.md`, a planta
  `me1-primeira-recusa-mudada` em `tests/pais/portoes.mjs`, e nesta pasta `entrada-da-decisao.py` (os dois lugares),
  `inventario-me1.py` (as recusas), `plantas/plantas-da-amarra.py` (cinco plantas), `medir-me1.mjs` e o guião novo
  `comparar-dist.py`.
- **Depois da leitura a frio:** `src/data/metodo.mjs` (quatro parágrafos e a frase da escala, pelo gerador, que passa
  a trocar a da escala), `src/components/formas/MapaPorConcelho.astro` (um comentário), a §1.196 do `DECISIONS.md`,
  `scripts/lugares-ia-do-portao.mjs` e `scripts/gate-html.mjs` (a régua dos nomes com `noscript`),
  `scripts/check-lugar.mjs` (a exceção do labor), `tests/pais/portoes.mjs` (a planta de `noscript`), o inventário e o
  registo das revisões, o §8 da `IDENTIDADE.md`, os dois ficheiros da leitura em `design/especime-v3/critica/`, e
  nesta pasta `frases-do-mandato.py`, `gerar/montar-metodo.mjs`, `conferir-frases.mjs`, `inventario-me1.py` e
  `medir-me1.mjs`.
- **Depois da leitura curta:** `src/data/metodo.mjs` (a frase da escala, pelo gerador), a §1.196 do `DECISIONS.md`, o
  inventário e o registo das revisões, os dois ficheiros da leitura curta em `design/especime-v3/critica/`, e nesta
  pasta `frases/frases-do-mandato.json`, `gerar/montar-metodo.mjs` (o comentário da escala), `conferir-frases.mjs`,
  `inventario-me1.py`, `medir-me1.mjs` e o `custo-construtor.json` do lugar de direção.

## As réguas que mudaram de forma, e as plantas que provam que mordem

Cada régua que encodava a forma do Método mudou com a página, conservando o que protege (a regra 4). Nenhum portão
que proteja um número, uma fonte ou uma pessoa mudou de substância. As plantas sobre o `dist/` correram pelo
mecanismo de `tests/pais/portoes.mjs` (o ficheiro muda no lugar, o portão corre inteiro, os bytes repõem-se e os dois
sha256 conferem-se), na cabeça do código e com a árvore seguida limpa (`OEDP_EXIGIR_ARVORE_LIMPA=1`); os registos
estão em `plantas/`, e `plantas_do_bloco` em `medidas.json` conta-as: 12 em memória, 10 novas sobre o `dist/` e
2 antigas que o bloco tocou, 5 da amarra e 26 das frases, todas a morder com a queixa esperada. As 12 em
memória correram no `gate:html` e as das frases na régua, na cabeça `9d8a0034`; as do `dist/` e as da amarra correram em
`c8825d09`, e esta passagem não mudou nenhuma régua delas.

| régua | o que protege | o que mudou | plantas |
| --- | --- | --- | --- |
| `scripts/lugares-ia-do-portao.mjs`, chamada pelo `gate:html` no Método | que a política publicada, que o rótulo legal aponta, diga os papéis e a regra das famílias como a direção os decidiu | confere os dois parágrafos novos (`data-papeis`, `data-familias`) e a porta do documento público da política, em vez da lista dos lugares; e a régua nova: nenhum nome de modelo nem de fornecedor no texto visível do Método, com o de `noscript` desde a leitura a frio (o achado 9), relendo o HTML da página que o portão lhe passa | 12 em memória a cada corrida do portão de HTML (a primeira com «Opus 5» numa frase, e a décima segunda, depois da leitura a frio, com «Opus 5» dentro de `noscript`, lida como o portão a lê); e `me1-nome-de-modelo-no-metodo`, `me1-nome-dentro-de-noscript`, `me1-papeis-mudados` e `me1-familias-com-a-porta-trocada` sobre o `dist/` |
| `scripts/gate-html.mjs`, o rótulo e a faixa dos documentos | o rótulo do artigo 50.º e a sua porta (proteção legal) | compõe a porta do oráculo com a regra de `portaDaPolitica()`, nos três lugares, e confere a função da página contra essa composição | `me1-porta-do-rotulo-com-a-ancora-antiga`, `me1-faixa-do-documento-com-a-ancora-antiga` |
| `scripts/textos-aprovados.json` | o oráculo do texto legal | `ancora_da_politica` vazia, com a nota no `_` | as duas de cima |
| `scripts/sem-marcadores.mjs` | que a marca «[a verificar]» não seja uma forma de publicar | os resumos do parágrafo do Método que cita a marca são os da secção do que está por confirmar | `me1-marcador-num-paragrafo-mudado`; e `resumos-do-marcador.mjs` reproduz primeiro os dois resumos antigos (`resumos-do-marcador.json`) |
| `scripts/check-lugar.mjs`, a L1 e a L3 | a porta obrigatória do rótulo não conta como escolha; «trabalho» não nomeia um estudo | a dispensa lê a porta de `portaDaPolitica()`; a exceção do labor ganha as três frases do mandato e perde as duas que nenhuma página rende (ME1-11); depois da leitura a frio, «não conhece o trabalho de antemão» dá o lugar a «cada trabalho novo» (ME1-24) | `r1-porta-da-politica-fora-do-rotulo` (posta em dia para `/metodo`), `me1-trabalho-fora-da-excecao` |
| `scripts/check-ledger.mjs`, a amarra das decisões | que o texto governado não mude em silêncio e que a constituição o cite palavra por palavra | `cadeiasDoTexto('metodo')` percorre o módulo inteiro; e, pela decisão do ME1-21, a amarra carimba também `src/data/politica-ia.mjs` (`politica`), cujas cadeias entram na conferência das citações | as 5 de `plantas/plantas-da-amarra.py`: a citação do selo mudada, uma citação sem marca, o texto do Método mudado sem entrada, uma recusa mudada sem entrada, o resumo da política desatualizado na §1.196 |
| `scripts/incorporar-do-portao.mjs` | a porta do recibo de exemplo no Método e as cadeias aprovadas da incorporação | lê a porta de `SECOES` e confere as palavras novas, «Ver um recibo de exemplo» / «See an example receipt» | as do próprio `check:incorporar`, que correram no `verify` (a porta tirada nas duas edições, e cada cadeia do inventário mudada) |
| `scripts/check-voz.mjs` com `INVENTARIO-FRASES.md` e `REVISOES-DO-INVENTARIO.md` | que uma frase declarada se renda e que uma retirada não volte | 64 linhas novas do Método (14 de navegação, 14 de divulgação, 36 de autorreferência; 8 das de divulgação são as quatro primeiras recusas, pela decisão do ME1-21, e 2 das de autorreferência são a frase nova da escala), 24 retiradas com a razão (10 da H4, 4 do TP1, 6 do sinal das fontes, 2 da escala antiga, do bloco `dominio`, e 2 da redação intermédia da escala, na secção ME1, pela leitura curta), 2 saem do ficheiro (ME1-12), a linha `metodo.exemplo` posta em dia, e a entrada `me1` no registo das revisões, lida pelo Codex e pelo lugar de direção | `me1-linha-do-inventario-mudada`, `me1-primeira-recusa-mudada`, `s1c-voz-recusa-do-metodo-mudada` |
| `src/styles/leitura.css` e `src/styles/site.css` | (mobília) | saem as regras das dobras, do número das regras, da vaga, das linhas da prova, da lista dos lugares, dos casos e do instrumento; a anulação da área alargada dos números da prova passa de `.regra-prova` para `.metodo-p`, onde eles vivem agora (nenhuma outra página tinha números da prova dentro de `.metodo-p`, medido na construção de partida) | o `check:css` e o `check:alvos` correram no `verify` |
| `IDENTIDADE.md` §5 | a citação do Método pela constituição | cita o P2 novo do recibo de cada número, com a marca | a primeira das 3 da amarra |
| `scripts/check-css.mjs`, `tests/inicio/capturas.mjs` | (mobília) | não mudam: o primeiro só cita o Método em comentários, e o segundo pede a página e o recorte `#a-forma`, que fica | não se aplica |

## Os portões

Os três portões correram por `sh scripts/leituras/portoes.sh <worktree> <worktree>/design/especime-v3/medicoes/me1-2026-10-15/portoes`
na cabeça do código da passagem depois da leitura curta, `9d8a0034` (a da passagem depois da leitura a frio, `c8825d09`,
está em `passagem-depois-da-leitura/portoes/`, também com os três a zero), com a árvore limpa no princípio
(`portoes/arvore.inicio`) e só a pasta das provas por seguir no fim (`portoes/estado.fim`), e cada código foi lido do
seu ficheiro depois de o processo acabar: `build.codigo` 0, `verify.codigo` 0, `typecheck.codigo` 0 (e `portoes` em
`medidas.json`). A corrida anterior desta passagem, em `e0356e2f`, deu build 0, verify 1 e typecheck 0
(`portoes-e0356e2f-verify-1/`, ME1-24). Depois do ME1-23 correram outra vez na cabeça `2da1f320`, com a árvore limpa, para
`portoes-me1-23/`: `build.codigo` 0, `verify.codigo` 0, `typecheck.codigo` 0; e depois da leitura curta, na cabeça
`9d8a0034`, os que este parágrafo diz no princípio. Na passagem do ME1-21, em `c15b2030`, na passagem de correção, em `93a884f6`,
e na primeira passagem, em `99b572ec`, deram os três a zero (`passagem-do-me1-21/portoes/`,
`passagem-de-correcao/portoes/` e `primeira-passagem/portoes/`). A união do `verify` confere que nada ficou
por correr, que nenhuma conferência escreveu nos ficheiros seguidos nem no `dist/`, e que o `dist/` é desta cabeça:

- <!-- portao: portoes/verify.log | U ✓ --> a união dos passos;
- <!-- portao: portoes/verify.log | D ✓ --> nenhuma escrita durante as conferências;
- <!-- portao: portoes/verify.log | C ✓ --> o `dist/` desta cabeça;
- <!-- portao: portoes/verify.log | npm run check:lugar · --> a L1, a L3 e a dispensa do rótulo;
- <!-- portao: portoes/verify.log | npm run check:incorporar · --> a porta do recibo de exemplo e as suas plantas;
- <!-- portao: portoes/verify.log | npm run check:alvos · --> os alvos e o título do Método;
- <!-- portao: portoes/verify.log | npm run check:privacidade · --> nada pessoal nem caminhos em ficheiro nenhum seguido;
- <!-- portao: portoes/build.log | ME1: --> as plantas da cópia do portão, em memória, dentro do `gate:html`.

Na primeira passagem, uma corrida final anterior, na cabeça `d7a4656a`, deu build 0, verify 0 e typecheck 1: `portaDaPolitica(lang)`
passava uma cadeia solta a `routePath`, que pede `'pt'|'en'`. A correção (`99b572ec`) diz o tipo no sítio da chamada,
como o ficheiro já fazia, e o `typecheck` sozinho passou antes de a corrida se repetir.

As duas conferências que precisam do motor ao lado, só em leitura do motor (`motor.sh`, que regista a cabeça e o
estado dele; o motor tinha ficheiros seguidos por comitar de outro trabalho, que não se tocaram): `check:series` com
`RESEARCHHUB_DIR`, código 0, e `check:cruzamento --with-origin`, código 0 (`motor/`, e `portoes.motor` em
`medidas.json`), na cabeça `c8825d09`. Na passagem de correção correram em `93a884f6` (`passagem-de-correcao/motor/`),
e não correram outra vez na passagem do ME1-21, porque nem o livro-razão nem as páginas construídas mudaram (ver «A
passagem do ME1-21»). Na primeira passagem correram em `e69fb9a0`, sobre o livro-razão e o `dist/` de `99b572ec`, que
esse commit não mudou (`primeira-passagem/motor/`).

## Os resumos dos textos governados

O de `src/data/metodo.mjs` é `1db645c40fa5` (depois da leitura a frio, `fcb1354596d4`; na passagem de correção e na do
ME1-21, `893a8b5e47d9`; na primeira passagem, `bdd975b1cb9b`), e o de `src/data/politica-ia.mjs`, governado desde a
decisão do ME1-21, é `62e42b67cf86`, que não mudou depois: os doze primeiros hexadecimais do sha256 de cada ficheiro com
as mudanças de linha normalizadas, que é a conta de `resumoDoTexto()` em `scripts/check-ledger.mjs`. O comando, para
o Método (para a política, o mesmo com o caminho trocado):

```
node -e "const c=require('crypto'),f=require('fs');console.log(c.createHash('sha256').update(f.readFileSync('src/data/metodo.mjs','utf8').replace(/\r\n/g,'\n'),'utf8').digest('hex').slice(0,12))"
```

(e `shasum -a 256 src/data/metodo.mjs`, que dá o mesmo começo, porque o ficheiro não tem mudanças de linha CRLF). A
entrada §1.196 está no fim do `DECISIONS.md`, no seu próprio commit, copiada do §7 do mandato por
`entrada-da-decisao.py`, que só troca os lugares dos resumos (`<RESUMO>` e, desde o ME1-21, `<RESUMO-POLITICA>`);
desde a passagem de correção, uma entrada §1.196 que já esteja no ficheiro troca-se inteira pela do mandato, porque é
o mandato que manda no texto. A §1.196 carimba os dois: `resumo_de_metodo_mjs` e `resumo_de_politica_ia_mjs` em
`medidas.json` conferem cada carimbo contra o seu ficheiro, o primeiro com o conhecido-positivo do resumo da cabeça de
partida, que é o da §1.184, e o segundo com o da política na partida, que a planta da amarra põe na §1.196 e que a
amarra recusa.

## As capturas

**Pela §1.197, os PNG não entram no repositório**: entram os manifestos `capturas.json` (o nome, a largura, a altura e o
sha256 de cada captura), que são a prova, e os PNG ficam no disco da worktree, onde o lugar de direção os vai buscar
para os enviar ao financiador. Pelo guião das capturas do projeto (`scripts/leituras/captar.mjs`), presas à cabeça de
`dist/version.json`:

- `<worktree>/design/especime-v3/capturas/me1-2026-10-15/metodo/`: o Método nas duas edições e nas cinco larguras,
  tirado outra vez depois da leitura curta, na cabeça `9d8a0034` (10 capturas, com 30 recortes da primeira
  secção, da secção da conferência e da forma);
- `<worktree>/design/especime-v3/capturas/me1-2026-10-15/metodo-c8825d09/`: as do Método depois da leitura a frio, em
  `c8825d09`, guardadas ao lado no disco, com o manifesto em `passagem-depois-da-leitura/capturas-metodo.json`;
- `<worktree>/design/especime-v3/capturas/me1-2026-10-15/metodo-93a884f6/`: as do Método da passagem de correção, em
  `93a884f6`, guardadas ao lado no disco, com o manifesto em `passagem-de-correcao/capturas-metodo.json`;
- `<worktree>/design/especime-v3/capturas/me1-2026-10-15/primeira-e-sobre/`: a primeira página e o Sobre nas duas
  edições e nas cinco larguras, da primeira passagem, em `99b572ec` (20 capturas e 20 recortes: o rótulo do topo e a
  porta do Sobre), porque nenhuma passagem depois mudou a porta do Sobre nem o rótulo.

Os `capturas.json` dizem nenhuma falha, nenhum pedido para fora e nenhuma largura com o documento mais largo do que a
janela. O manifesto das capturas do Método da primeira passagem está em `primeira-passagem/capturas-metodo.json`. Os
pedidos estão em `capturas-pedidos/`. Vi as capturas: na primeira passagem, a primeira secção a 390 px, a página
inteira a 1 280 px, o primeiro ecrã inglês a 390 px, a secção da conferência a 768 px e o Sobre a 390 px; na passagem
de correção, a secção do que está por confirmar a 1 280 px e a primeira secção inglesa a 390 px; depois da leitura a
frio, a secção «Como se confere» portuguesa a 390 px e a forma inglesa a 1 280 px, com as frases novas; depois da
leitura curta, a forma portuguesa a 390 px e a inglesa a 768 px, com a frase nova da escala.

## As questões

- **ME1-1 · a frase dos agregadores (para o lugar de direção, antes da leitura a frio).** O §3.2 P2 diz «A imprensa e
  os agregadores não são fonte de nenhum número» / «The press and aggregators are not a source for any number».
  Medido (`linhas_com_a_pordata_por_fonte`): 1 linha publicada do livro-razão tem a PORDATA por fonte,
  `saldo-natural-portugal-2025`, do estudo `evolucao-de-portugal-desde-1981`, com o documento, o endereço, a data de
  acesso e o excerto por confirmar; a carta dos conteúdos chama segundo publicador a quem compila dados de outrem, e a
  frase de antes dizia «agregadores comerciais». O mesmo facto toca o §3.2 P1 («Cada valor é lido no documento onde a
  fonte o publicou, e não em quem o cita»). A frase está como o mandato a escreve; o que a torna verdadeira é uma
  decisão: a linha sair, ou passar ao publicador primário no motor, ou a frase voltar a dizer «comerciais».
  *Decidida na passagem de correção: ver «A passagem de correção».*
- **ME1-2 · a frase do inventário (para o lugar de direção, antes da leitura a frio).** O §3.4 P2 diz «As frases que
  este projeto escreve sobre si e sobre os números estão num inventário, e uma frase nova que não esteja lá trava a
  publicação». Medido (`o_metodo_na_regua_da_voz`): a célula 3 do `check:voz` (um bloco por classificar) só corre nas
  rotas inventariadas, e o Método, o Sobre e o recibo de cada número são isentos (`ROTAS_QUE_PROVAM_A_RENDICAO`): uma
  frase nova numa delas não trava a publicação. A nota do coordenador dizia que o `check:voz` exige as linhas novas do
  Método; não exige. As linhas novas entram, vivas, e travam a publicação quando uma frase muda (a planta
  `me1-linha-do-inventario-mudada`); uma frase acrescentada sem linha não trava. As saídas são a frase dizer onde o
  inventário trava, ou a célula 3 passar a correr no Método (com a contagem da autorreferência isenta, como a Emenda 15
  quer), que é um portão mais apertado e por isso decisão do lugar de direção.
  *Decidida na passagem de correção: ver «A passagem de correção».*
- **ME1-3 · a definição do marcador dentro da frase do §3.5 (de leitura).** À primeira vez em cada página, o marcador
  rende-se com a sua definição curta logo a seguir (é a §7.10a do `check:lugar`, um portão P), e a frase lê-se «…o
  recibo marca esse campo com [a verificar] · um campo não confirmado contra a fonte, e não uma dúvida sobre o que está
  publicado e diz o que falta; …». Na página a definição sai em letra pequena e cinzenta, o que ajuda, mas a frase lê-se
  partida. A regra 5 de antes tinha o mesmo arranjo, seguido de um ponto e vírgula. A frase está como o mandato a
  escreve; uma saída que não toca no portão é o marcador acabar uma oração («…marca esse campo com {marcador}; diz o que
  falta…»).
  *Decidida na passagem de correção: ver «A passagem de correção».*
- **ME1-4 · a meta das palavras não se cumpre com as frases do mandato.** Depois, 0,688 e 0,683 do que eram (1 703 e
  1 693 palavras contra 2 477 e 2 477); a meta do §6.5 é menos de metade. As frases são as do mandato, palavra por
  palavra, e não as cortei; a secção «Como se confere» tem sozinha 422 palavras na edição portuguesa e 429 na inglesa.
  *Decidida na passagem de correção: ver «A passagem de correção».*
- **ME1-5 · as fontes distintas.** «de {fontes} fontes distintas» conta os organismos do campo `source` das linhas
  publicadas, e entre eles estão a RTP e o PCP, que só aparecem nas 3 afirmações, e O Estado do País, das linhas
  calculadas; ao lado do §3.2 P2, um leitor atento pode ler a RTP como fonte de números.
  *Decidida na passagem de correção: ver «A passagem de correção».*
- **ME1-6 · duas frases que se podem ler como contrárias (editorial).** O §3.4 P2 diz «E cada mudança é lida por um
  sistema de outra família» e o §3.1 P4 diz que um valor novo da mesma medida «publica-se quando passa em todas as
  verificações automáticas, sem uma leitura individual». «Cada mudança» quer dizer cada mudança de trabalho, e não cada
  valor novo, mas a página não o diz.
  *Decidida na passagem de correção: ver «A passagem de correção».*
- **ME1-7 · decisão: a porta das contagens do atraso.** `series_atrasadas` e `linhas_atrasadas` abriam `#releitura` e
  abrem `#por-confirmar`, pela regra do §2 («a secção nova que a explica»: a série atrasada é a terceira frase do
  §3.5). O único componente que as rendia era o sinal das fontes, que saiu do Método.
- **ME1-8 · decisão: as palavras da ordem dos domínios.** As chaves `dominios.vagaPrimeira`, `vagaSegunda` e
  `vagaTerceira` só serviam a lista do que se mede a seguir, e saíram com ela das duas edições.
- **ME1-9 · decisão: a IDENTIDADE.md.** Além da citação do §5 que o mandato manda, acertei as duas frases que o bloco
  tornaria falsas («as dez regras do Método», e o Método entre as páginas com um instrumento dentro).
- **ME1-10 · registo: a abertura e o Sobre.** O §3.0 do mandato diz que o Sobre usa a ABERTURA como rótulo da porta, e
  o comentário de `ABERTURA` dizia o mesmo; o Sobre usa `POLITICA.titulo`, que é o que o §4 do mandato pede. A porta do
  Sobre diz o título da primeira secção, e o comentário diz agora isso.
- **ME1-11 · decisão: a exceção de «trabalho».** Saem as duas alternativas que nenhuma página rende («trabalho de quem
  não escreveu», que saiu com a regra 5, e «dirige o trabalho», da redação dos lugares anterior à H4-e, medido sobre o
  `dist/` com o conhecido-positivo da frase nova), e entram as três do mandato.
- **ME1-12 · decisão: a forma das linhas novas do inventário.** São os blocos do Método como a régua os lê, tirados das
  páginas construídas por `blocos-do-metodo.py` e `inventario-me1.py`. Um parágrafo com contagens da prova lê-se, na
  medida 8, com os números dentro, e uma linha assim deixava de se render na primeira atualização dos dados e fechava a
  construção: esses parágrafos entram pela forma da varredura da voz, sem os números. As linhas «O livro-razão» e «The
  ledger» saíram do ficheiro em vez de passarem a retiradas, porque uma retirada morde a cadeia dentro de qualquer frase
  das páginas medidas, e estas são palavras correntes. As dicas dos números da prova (o texto do `title`) já existiam e
  não entram.
- **ME1-13 · decisão: os componentes.** O `SinalDasFontes` fica no repositório, sem uso, para voltar quando o corredor
  do GitHub for armado. O `InstrumentoMecanismo` sai, com as suas cadeias e as suas regras de folha, que viviam na
  `site.css` e não na `leitura.css` que o mandato nomeia.
- **ME1-14 · registo: a ligação para fora.** O portão de HTML salta as ligações com esquema na conferência das
  internas, e nenhuma régua da cadeia recusou a ligação ao documento público da política. Leva o estilo das ligações da
  prosa, e não o de `.ligacao-externa`, que é o das portas dos documentos nos recibos.
- **ME1-15 · registo: a primeira corrida de partida, parada.** O coordenador escreveu o mandato na worktree enquanto
  ela corria, a segunda vez já durante o `verify`, depois do retrato da célula D; parei-a, comitei os ficheiros dele
  como pediu (`61919ee1`) e repeti a corrida numa árvore limpa, que esperou pela tranca da corrida da reescrita da
  história e deu os três a zero.
- **ME1-16 · registo: as capturas.** O guião das capturas tira as cinco larguras de cada página pedida; a primeira
  página e o Sobre ficam nas cinco, e não só a 390 e a 1 280 px.
- **ME1-17 · registo: réguas fora das cadeias que conheciam a forma antiga.** `tests/linha/correcoes-b.mjs` procura
  `.mecanismo-legenda`, e as plantas da H4 em `design/especime-v3/medicoes/h4-2026-10-06/provar-politica-e.mjs`
  constroem a lista dos lugares; nenhuma corre numa cadeia, e ficam para a higiene.
  *Decidida na passagem de correção: ver «A passagem de correção».*
- **ME1-18 · registo: a contagem das palavras.** O guião do mandato que contou as palavras da página no ar não está na
  pasta; experimentei cinco definições sobre as páginas de partida e uso a que mais se aproxima da contagem do mandato
  (o texto de `<main>`, elemento a elemento). A meta compara-se com a mesma definição antes e depois.
- **ME1-19 · registo: o guião das conferências com o motor.** A primeira versão de `motor.sh` passava o motor só ao
  `check:series`, e o `check:cruzamento --with-origin` procurou-o numa pasta ao lado da worktree e saiu a 1 por isso;
  `e69fb9a0` corrige o guião, e as duas conferências saíram a 0 na corrida seguinte. O commit das provas leva também a
  correção de um rótulo de texto de `medir-me1.mjs` (o do conhecido-positivo das secções dizia uma contagem que a
  medida desmentia); nenhum dos dois toca no sítio nem nos portões.
- **ME1-20 · registo: três medidas acrescentadas depois da cabeça do código.** O commit das provas da passagem de
  correção leva `medir-me1.mjs` com três medidas novas, que só leem o código, o livro-razão e o git:
  `linhas_por_confirmar` e `ledger_tocado_no_ramo`, para a decisão do ME1-1, e `textos_das_paginas_fora_da_amarra`,
  para o ME1-21. O `medidas.json` foi escrito outra vez sobre o mesmo `dist/` da cabeça `93a884f6`, e todas as outras
  medidas saíram iguais às da corrida das provas. Nada disto toca no sítio nem nos portões.
- **ME1-21 · a frase da amarra diz mais do que a amarra prende (para o lugar de direção, antes da leitura a frio).**
  O §3.4 P2 diz «o texto desta página e o da página «Sobre» só mudam com uma decisão registada que carimbe a versão
  nova». Medido (`textos_das_paginas_fora_da_amarra`): a amarra de `scripts/check-ledger.mjs` carimba dois ficheiros,
  `src/data/metodo.mjs` e `src/data/sobre.mjs`, e as duas páginas rendem também texto de `src/data/politica-ia.mjs`,
  que ela não carimba: no Método, a primeira secção inteira (o título, a frase da política, os papéis, as famílias, o
  que se publica) e as 5 recusas; no Sobre, a frase do projeto, a do contacto e a porta da política. Também as cadeias
  da interface, de `src/i18n/strings.mjs`, ficam fora dela. Esses textos estão presos por outros portões, que travam a
  publicação se um deles mudar sem que o portão mude com ele, mas nenhum pede uma decisão registada: a frase da
  política, a do projeto e a do contacto pelo oráculo `scripts/textos-aprovados.json`; os papéis e as famílias pela
  cópia do lado do portão; o título, o que se publica e a quinta recusa pelas suas linhas vivas do inventário. E 4 das
  5 recusas não estão presas por portão nenhum: não estão no oráculo, nem na cópia do portão, nem no inventário (já não
  estavam na partida, em `4b50b92e`), e o Método é isento da célula 3 do `check:voz` (`o_metodo_na_regua_da_voz`);
  uma delas pode mudar sem que nenhuma régua morda. A frase está como o mandato a escreve, e não a mudei nem estendi a
  amarra, porque as duas coisas mudam o que o leitor lê ou apertam um portão. As saídas: a amarra passar a carimbar
  também `src/data/politica-ia.mjs` (um nome novo no `**Afecta:**`, e a §1.196 com o seu carimbo), ou a frase dizer o
  que a amarra prende; e, nos dois casos, as 4 recusas entrarem no inventário.
  *Decidida na passagem do ME1-21: a frase fica, a amarra carimba também a política e as 4 recusas entram no
  inventário (ver «A passagem do ME1-21»).*
- **ME1-22 · registo: `medir-me1.mjs` posto em dia depois da cabeça do código do ME1-21.** A linha `**Texto:**` da
  §1.196 passou a carimbar dois textos, e a medida do resumo do Método pedia que a linha acabasse no resumo dele; o
  commit das provas leva o leitor par a par (o mesmo do `check-ledger`), a medida do resumo da política, a das fontes
  das páginas e a da comparação do `dist/`, e os códigos das passagens anteriores na medida dos portões. Só leem o
  código, o git e as provas; nada disto toca no sítio nem nos portões.

- **ME1-23 · a descrição das quatro linhas na §1.196 não bate com o livro-razão (para o lugar de direção).** O
  ponto (8) da §1.196, copiado do mandato, diz que as quatro linhas publicadas sem a fonte confirmada são «três com a
  fonte «[a verificar]», dos estudos `which-door-is-yours` e `agua-nao-faturada`, e a da PORDATA». Medido
  (`linhas_por_confirmar` e `linhas_com_a_fonte_por_verificar`): as 4 entradas por confirmar que o Método conta são
  `evora-prr-aprovado-2026`, `evora-prr-pago-2026`, `evora-prr-vencido-aprovado-2026`, do estudo `evora-economia-e-dinheiro-publico-de-fora-da-camara`, com a fonte declarada «Estrutura de Missão Recuperar Portugal» e só o excerto por confirmar, e
  `saldo-natural-portugal-2025`, da PORDATA, com 5 campos por confirmar. As 3 linhas do livro-razão com a fonte «[a verificar]»
  são `avisos-pt2030-abertos`, `avisos-pt2030-pessoas-singulares`, `ciclo-substituicao-condutas`, dos estudos `which-door-is-yours` e `agua-nao-faturada`, e estão retiradas
  (`publication: withdrawn`): o leitor do livro-razão não as carrega, não se contam e nenhuma página as publica. Não
  mudei o texto da §1.196, que é do lugar de direção; o que conta para o RP4-o é que as linhas a confirmar na fonte,
  ou a tirar das páginas, são as quatro medidas aqui.
  *Decidida: o lugar de direção corrigiu o ponto (8) do §7 do mandato pela medida (`8d6feb25`): a linha da PORDATA é a
  única cuja fonte não foi lida, as três do PRR de Évora só têm o excerto por confirmar, e as três com a fonte «[a
  verificar]» estão retiradas e não contam. A §1.196 foi regenerada pelo guião (`2da1f320`), com os mesmos resumos, e
  os três portões correram outra vez em `2da1f320`, os três a zero.*
- **ME1-24 · registo: a corrida dos portões em `e0356e2f`.** Deu build 0, verify 1 e typecheck 0
  (`portoes-e0356e2f-verify-1/`): a L3 do `check:lugar` contou um «trabalho» no Método. A frase nova da leitura por
  outra família já não diz «não conhece o trabalho de antemão», que era a alternativa da exceção do labor que
  dispensava aquele bloco, e o «trabalho» de «cada trabalho novo» passou a contar. A exceção troca a alternativa que
  nenhuma página rende por «cada trabalho novo», o mesmo labor (`86684038`), e a planta `me1-trabalho-fora-da-excecao`
  continua a provar que a L3 morde noutra frase. A corrida seguinte deu os três a zero.

- **ME1-25 · registo: `medir-me1.mjs` posto em dia depois da cabeça do código da passagem depois da leitura curta.**
  A medida do inventário contava as classes em todas as linhas da secção ME1, e a secção passou a ter também as duas
  linhas retiradas da redação intermédia da escala: as classes contam-se agora só nas linhas vivas, e as retiradas da
  secção à parte (`retiradas_na_seccao_me1`). Só lê o inventário; nada disto toca no sítio nem nos portões.

## O custo

O lugar de direção lê-o do registo da sessão com `scripts/leituras/custo.py`; este relatório não o escreve à mão. A
leitura dele está em `custo-construtor.json`, nesta pasta, sem texto nem caminhos.
