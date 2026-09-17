# O bloco E1, medido · «Évora 2027: o prometido, o painel, o dinheiro» (a metade do sítio)

*16.09.2026, ramo `e1-2026-09-16`, sobre `c032cbfe`. Construtor: **Claude Opus 5**. É a cópia do relatório do bloco, no formato do §1 item 6 do brief (`BRIEF-E1-evora-2027-sitio.md`). As capturas estão em `design/especime-v3/capturas/e1-2026-09-16/`; a régua das tabelas e a das portas repetidas estão nesta pasta, ao lado deste ficheiro.*

**O bloco fecha, e fecha com os três portões a 0.** Os seis itens do mandato estão feitos e medidos.

**Houve três passagens: a segunda está no §8 e a terceira no §11.** A primeira aterrou com o `verify` a 1 numa célula: os dois documentos que o motor tinha escrito não declaravam papel nem tinta, e por isso a moldura deste projeto e a tela do navegador diziam coisas diferentes ao mesmo leitor. Não se contornou nem se enfraqueceu portão nenhum: disse-se ao lugar de direção, o motor corrigiu a folha em `b99e2254052c773d526281704ab7405ad2becfe6`, e aqui refixaram-se os bytes e voltou a correr-se a travessia. A `check:moldura` passou de 3 167 nós graves a **0**, e o pior contraste de texto de célula de 1,17:1 a **7,57:1**. O antes e o depois estão fotografados.

## 1 · O mandato, item a item

| # | o que | a medida | medido |
| --- | --- | --- | --- |
| 1 | **A declaração do estudo** em `src/data/studies.mjs` | a entrada; `STUDY_IDS`, `EDITIONS` e o resto a seguir por si | **feito.** A entrada com `id` e `slug` `evora-2027-prometido-painel-dinheiro`, `subject: 'evora'`, as duas edições com o título que o documento imprime, lido do `<h1>` de cada uma («Évora 2027: o prometido, o que o painel escreveu, e o dinheiro em linhas» e «Évora 2027: what was promised, what the panel wrote, and the money line by line»; estiveram aqui os nomes dos ficheiros do motor até à terceira passagem, §11), `date: '2026-09-16'`, `updated: null` e `artifactUrl: null`, com a razão da data no comentário: o commit `c0b19d4bbc1b05819b6e0ea5b9e8e83f60ae40f4` do motor, de 2026-09-16, que escreveu esses bytes pela última vez. A descrição é uma frase por edição a dizer o que o estudo põe lado a lado, sem se explicar (norma §1.4), e não é transcrição: por isso não leva `verbatimDaAbertura`. **O resto seguiu por si, e três contagens da casa subiram com o arquivo:** `estudos_no_arquivo` 12 → 13, `edicoes_no_arquivo` 16 → 18, `estudos_evora_no_arquivo` 5 → 6, as três recalculadas pelo `ledger:check` a cada construção e nenhuma escrita à mão sem prova |
| 2 | **Os bytes fixados** e o `studies-src/manifest.yml` | D5 verde | **feito, e refixado uma vez.** `pt.html` 61 558 bytes e `en.html` 59 780, copiados byte a byte de `content/14 Évora 2027/` com as cópias brutas em `_raw/`, e as duas linhas do manifesto com `origin: researchhub` e o `origin_ref` ao commit `b99e2254…becfe6`. Os dois resumos de cada linha são iguais porque não houve invólucro para tirar, e cada `sha256_normalized` é o `edicao_html_sha256` que o motor prova: `bdb34624…2e70f6` (pt) e `c34d7eaa…57180c` (en). **O D5 corre e bate nas duas.** Os primeiros bytes fixados (61 064 e 59 286, de `c0b19d4b…`) eram os da folha sem papel nem tinta, e saíram com a correção do §8 |
| 3 | **A travessia dos registos** | D1 a D4 e D6 verdes; o `git status` do motor limpo depois | **feito, e corrido duas vezes** (a segunda com os bytes refixados; as duas estão citadas no §2). `registos/evora-2027-prometido-painel-dinheiro/{pt,en}.{record,cortes}.json` e as duas entradas novas no `registos/manifest.json`; as oito que já lá estavam não mudaram (a corrida diz «2 nova(s) · 0 alterada(s) · 8 inalterada(s)»). **O `git status` do motor ficou como estava antes da corrida**, com os mesmos quatro caminhos por confirmar de outras corridas e nada deste estudo. O portão dos documentos diz «10 atravessado(s) · D5 correu em 9 e não corre em 1», e as duas linhas novas dizem «119 bloco(s) · 182 referência(s) · o D5 correu e bate» |
| 4 | **A página de texto** | capturas nas cinco larguras, duas edições | **feito, e sem CSS novo.** A `TextoView` compõe o registo inteiro: 119 blocos, 28 tabelas, 8 títulos de nível 2 e 18 de nível 3, nas duas edições, sem uma linha de guião (o `<article>` tem 157 227 bytes de HTML estático, que são 155 507 caracteres). As citações ficam na língua da fonte nas duas edições. **A régua das tabelas largas está no §3**, e diz zero tabelas fora do seu contentor e zero páginas a deslocar de lado, nas cinco larguras e nas duas edições. O gabarito já tinha o que o item 4 permitia acrescentar, e por isso não se acrescentou nada |
| 5 | **A lista dos estudos** e a primeira página | a captura de `/estudos` a 390 e 1 280 | **feito.** `/estudos` mostra «Évora 2027: o prometido, o que o painel escreveu, e o dinheiro em linhas» no seu lugar, a seguir ao «Prometido, Pago, Auditado», com o estado «documento alojado» (que é o que ele é: a leitura da casa sobre o trabalho não está escrita) e a data 16.09.2026 em cada edição. **As contagens subiram por si**, e as capturas mostram-nas: 13 estudos publicados e 18 edições no cabeçalho de `/estudos`, as duas com a porta da prova, e a linha «Estudos» da primeira página a dizer 13, com o `data-prova="estudos"` que o portão reconta. Nenhum dos três foi escrito à mão |
| 6 | **O relatório** | completo | este ficheiro |

## 2 · As corridas do exportador, com as linhas citadas

Correram da árvore principal do motor (`~/Instruments/ResearchHub`, em `master`, cabeça `7b64e8eaeade`), com `OEDP_SITE` apontado a esta worktree. O caminho impresso foi conferido no ensaio ANTES de correr com `--write`, e é o da worktree e não o da árvore principal do sítio.

**O ensaio** (`python3 publisher/export_records_site.py`, código 0):

```
  travessia dos registos de conteúdo · motor 7b64e8eaeade · destino /Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/e1-2026-09-16/registos

  03 pt  → avaliacao-economica-regional-de-portugal-2026/pt    blocos  53 · refs 411 · edicao-html            · o D5 não corre: os bytes alojados são um artefacto do claude.ai e a edição que o motor prova é «Technical Source/artifact_pt.html», que o sítio não aloja
  14 en  → evora-2027-prometido-painel-dinheiro/en             blocos 119 · refs 182 · edicao-html            · o D5 corre e bate
  14 pt  → evora-2027-prometido-painel-dinheiro/pt             blocos 119 · refs 182 · edicao-html            · o D5 corre e bate
  06 pt  → evora-economia-investidores-portas-abertas-2026/pt  blocos  49 · refs 171 · edicao-html            · o D5 corre e bate
  07 en  → evora-orcamentado-pago-devido-2025/en               blocos  87 · refs 194 · edicao-html            · o D5 corre e bate
  07 pt  → evora-orcamentado-pago-devido-2025/pt               blocos  88 · refs 194 · edicao-html            · o D5 corre e bate
  09 pt  → evora-os-pelouros-quem-os-teve-o-que-fizeram/pt     blocos 138 · refs 296 · edicao-html            · o D5 corre e bate
  04 en  → evora-prometido-pago-auditado-2026/en               blocos  95 · refs 324 · render-sem-graficos    · o D5 corre e bate
  04 pt  → evora-prometido-pago-auditado-2026/pt               blocos  95 · refs 324 · render-sem-graficos    · o D5 corre e bate
  08 pt  → evora-quinze-anos-cinco-mandatos/pt                 blocos 173 · refs 682 · edicao-html            · o D5 corre e bate

  «03 en»: sem edição alojada no sítio
  «06 en»: sem edição alojada no sítio
  «08 en»: sem edição alojada no sítio
  «09 en»: sem edição alojada no sítio

  D5 corre em 9 edição(ões) e não corre em 1: avaliacao-economica-regional-de-portugal-2026/pt
  2 nova(s) · 0 alterada(s) · 8 inalterada(s)

  Ensaio. Nada escrito, passe --write.
```

**O `--write`** (`python3 publisher/export_records_site.py --write`, código 0) imprimiu as mesmas linhas e, no fim:

```
  Escritos 20 ficheiro(s) em /Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/e1-2026-09-16/registos
  Registo de travessia em /Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/e1-2026-09-16/registos/manifest.json
```

Os vinte ficheiros são as dez edições × dois (o registo e as operações da passagem de voz); dezasseis deles foram reescritos com os mesmos bytes que já lá estavam, e os quatro novos são os do 14, que são dois por edição. **O `git status` do motor depois da corrida é o mesmo de antes:** `sweeps/state.json` modificado e `.maintenance-locks/`, `publisher/recortes/manifest.regioes.json` e `sweeps/sweep-2026-09-01.md` por confirmar, todos de outras corridas e nenhum deste estudo. O exportador só lê do motor.

**A recusa do ensaio de antes de o sítio declarar o estudo** não se repetiu aqui, e não podia: este bloco começa por declarar o trabalho, que é o item 1 do mandato. A recusa está citada no relatório da metade do motor.

### A segunda travessia, depois de o motor corrigir a folha

Mesma forma, mesma variável, mesmo destino conferido no ensaio antes da escrita. **O ensaio** (código 0) e o **`--write`** (código 0) imprimiram:

```
  travessia dos registos de conteúdo · motor b99e2254052c · destino /Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/e1-2026-09-16/registos

  14 en  → evora-2027-prometido-painel-dinheiro/en             blocos 119 · refs 182 · edicao-html            · o D5 corre e bate
  14 pt  → evora-2027-prometido-painel-dinheiro/pt             blocos 119 · refs 182 · edicao-html            · o D5 corre e bate

  D5 corre em 9 edição(ões) e não corre em 1: avaliacao-economica-regional-de-portugal-2026/pt
  0 nova(s) · 2 alterada(s) · 8 inalterada(s)

  Escritos 20 ficheiro(s) em …/e1-2026-09-16/registos
  Registo de travessia em …/e1-2026-09-16/registos/manifest.json
```

**«0 nova(s) · 2 alterada(s)» é a frase que prova que o texto não mudou.** Nenhum dos quatro ficheiros de `registos/` mudou um byte: os dois `.record.json` do motor têm o resumo que já tinham (`1037c50a…` e `333ca97d…`). O que mudou no registo de travessia foi a proveniência, e só ela: o `origin_ref` das dez edições passa ao commit novo do motor, e as duas do 14 levam o `edicao_html_sha256` e o `rh_manifest_sha256` novos. **O `git status` do motor ficou outra vez como estava.**

## 3 · A régua das tabelas largas (item 4)

`node design/especime-v3/medicoes/e1-2026-09-16/medir-tabelas.mjs`, código 0. Mede em píxeis do motor, e não em caixas do código: a pergunta é o que o leitor vê. Corrida nas duas cabeças, antes e depois da refixação dos bytes, com o mesmo resultado: a página de texto compõe-se do registo e não do HTML da edição, e o registo não mudou.

```
  edição  largura  tabelas  fora do contentor  com deslocação  a página desloca
  pt          390       28                  0               9               não
  pt          768       28                  0               0               não
  pt         1024       28                  0               0               não
  pt         1280       28                  0               0               não
  pt         1600       28                  0               0               não
  en          390       28                  0               5               não
  en          768       28                  0               0               não
  en         1024       28                  0               0               não
  en         1280       28                  0               0               não
  en         1600       28                  0               0               não
```

**Nenhum CSS novo, e a razão está medida.** Cada tabela do corpo transcrito sai de `src/lib/registo-html.mjs` dentro de um `div.texto-tabela`, e o `src/styles/texto.css` §5 dá-lhe `overflow-x: auto`. A 390 as tabelas mais largas usam-no: nove na edição portuguesa e cinco na inglesa, entre elas a das promessas (cinco colunas, com as citações do painel) e a das fontes (54 linhas). Das 768 para cima cabem todas sem deslocação. O item 4 permitia acrescentar esse CSS se faltasse, e não faltava.

## 4 · Os commits e a cabeça

Dezasseis commits sobre `c032cbfe`, todos com os dois trailers exactos e todos por caminhos explícitos (nunca `git add -A`), em três passagens: **sete** na primeira, **quatro** na segunda (a que fecha a `check:moldura`) e **cinco** na terceira (a da leitura a frio do Codex).

| cabeça | o que |
| --- | --- |
| `1acba6c4` | Arquivo: entra «Évora 2027 — O Prometido, o Painel, o Dinheiro» |
| `7a12f9fe` | Os bytes das duas edições, com os resumos que o motor prova |
| `fc102b08` | As duas datas do repositório, medidas e não escritas |
| `7252a707` | A travessia dos registos: as duas edições do 14, com o D5 a bater |
| `ad1915fb` | A edição das três contagens muda de data, e a tabela das línguas com ela |
| `3c330473` | As vinte e quatro capturas e a régua das tabelas largas |
| `38ad3ec3` | Os dois números que medem o tamanho do arquivo andam com ele |
| `a5d66b8a` | O relatório do bloco, com a cabeça, os portões, o custo e o que falta (a primeira passagem, com o `verify` a 1) |
| `81c6915a` | Os bytes refixados: a folha das duas edições passa a ter papel e tinta |
| `445b4d69` | A combinação que partia, fotografada antes e depois |
| `01ebdf27` | O relatório refeito: a segunda passagem, e os três portões a 0 |
| `11266be7` | O título de cada edição é o que o documento imprime |
| `d7fa77d8` | A proveniência da data diz o commit que escreveu os bytes que estão alojados |
| `741fdac9` | As três contagens erradas do relatório |
| `5743ede7` | As prosas que nomeavam o estudo pelo título antigo |
| (o commit deste ficheiro) | O relatório com a terceira passagem. **É a cabeça final**, e não traz os seus próprios portões porque um commit não se pode nomear a si próprio: os códigos do §5 são os da corrida sobre `5743ede7`, que é a cabeça com todo o código, os bytes, os registos e as capturas. Este commit acrescenta um ficheiro de relatório, e nenhuma das três cadeias o lê: a lista de documentos que o `check:registo` mede tem cinco nomes e não tem este, e o `check:voz` lê o `dist/` |

**Um par que não se pode juntar, e fica dito.** `7a12f9fe` pousa os bytes e `fc102b08` mede a data deles, e os dois têm de ser commits diferentes: a data de uma edição é a do commit que a acrescenta, e um ficheiro não pode trazer dentro de si o resumo do commit que o cria. Entre os dois, a conta 3 do `check:datas` fica vermelha, e é a única coisa que fica.

**Quatro coisas mexeram fora do que o brief nomeia, e as quatro são consequência mecânica de o arquivo crescer.** Nenhuma é uma escolha de forma, e nenhuma enfraquece um portão:

1. **As três contagens do livro-razão** (`estudos-publicados`, `edicoes-publicadas`, `estudos-evora-publicados`), que o `ledger:check` recalcula do próprio arquivo e compara com o valor publicado. O brief §2 dizia para não tocar em `ledger/`, e sem estas três o `npm run build` não passa do primeiro passo: o valor é o que o portão conta, não uma afirmação à parte. A do Évora leva a correção datada, como as três subidas anteriores desta mesma linha.
2. **Quatro números de documentos que governam** (`VISAO.md`, `README.md`, `PENDENTES-DO-DIRETOR.md`), que o `check:registo` mede contra o arquivo e que passaram a dizer 13 trabalhos, 18 edições e 18 documentos alojados. O da lista dos pendentes não muda o que o diretor tem a fazer: data o número, porque as oito páginas de leitura de 24.08 continuam a ser oito.
3. **A tabela das línguas dos títulos**, porque as três contagens mudaram de edição (`15.08.2026` e `24.08.2026` saíram, `16.09.2026` entrou) e o `check:lingua` fecha a construção nos dois sentidos.
4. **Dois números que declaram o tamanho do que uma régua mede**: o âmbito do `provar:eyetext` (5 → 7 edições, com a prova relida sobre as duas novas: 119 blocos lidos contra 119 no registo, 880 unidades iguais carácter a carácter, 0 isentas) e a catraca L1 do `check:lugar` (2 284 → 2 286). A subida da catraca está medida e é inteira: a família `documento` passa de 15 para 17 páginas e nenhuma outra família mexe, porque cada documento alojado traz o par que a FAIXA DESTE PROJETO põe por cima dele (a marca contra a porta de voltar, as duas a abrir a página do estudo). É dívida deste projeto e não da obra citada, e fechá-la tira as dezassete de uma vez, levando a catraca a 2 269. A composição está em `l1-composicao-2026-09-16.txt`, ao lado deste ficheiro.

## 5 · Os três portões

Cada comando no seu, com o código lido de um ficheiro, sobre `5743ede7`.

```
npm run build     → 0
npm run verify    → 0
npm run typecheck → 0
```

Os códigos ficaram em `i-build.code`, `i-verify.code` e `i-typecheck.code`, com as saídas ao lado, no directório de trabalho da sessão. A segunda passagem tinha saído a 0, 0 e 0 sobre `445b4d69`, com os códigos em `g-*.code`.

**A célula que estava vermelha, agora:**

```
  ✓ C1  0 nó(s) graves em 72 passagens · nenhuma
  ✓ C2  filetes: 44896 medidos, 0 abaixo de 3:1 (o pior 3.23:1) · texto próprio das células: 39964 medidos, 0 abaixo de 4,5:1 (o pior 7.57:1)
  ✓ C3  326 caixa(s) que se deslocam · 0 sem teclado · 0 sem nome · 0 sem marco · 0 nome(s) repetido(s)
  ✓ C4  72 passagens · 0 sem <main> a um · 0 sem <h1> visível a um · 0 com a moldura errada ou a faixa lá dentro
  ✓ C5  4 cor(es) distintas nos filetes da moldura · 0 fora da paleta da casa
  ✓ C6  18 de 18 verdes · 18 de 18 plantas apanhadas
  todas as células verdes.
```

E o que a moldura não corrige, que era o resto do achado: **0 nós**, onde eram 212 a 1,17:1.

**Na primeira passagem o `verify` saiu a 1**, na `check:moldura`, e como a cadeia pára no primeiro vermelho os dezanove passos seguintes correram um a um para que o estado do ramo não ficasse por saber. Saíram todos a 0 nessa altura, e voltaram a sair a 0 dentro da cadeia inteira agora.

## 6 · As capturas

Vinte e oito, em `design/especime-v3/capturas/e1-2026-09-16/`, contadas no disco. Vinte e quatro são do `capturas-e1.mjs` e quatro do `capturas-tema.mjs`. As vinte e quatro não levam momento no nome, porque este estudo entra pela primeira vez e não há «antes» delas; as quatro da combinação cruzada levam-no, porque é delas que o antes e o depois são a prova.

| conjunto | rotas | larguras | quantas |
| --- | --- | --- | --- |
| `estudo` | `/estudos/evora-2027-prometido-painel-dinheiro` e `/en/studies/…` | 390, 768, 1 024, 1 280, 1 600 | 10 |
| `texto` | `/estudos/evora-2027-prometido-painel-dinheiro/texto` e `/en/studies/…/text` | as mesmas cinco | 10 |
| `estudos` | `/estudos` e `/en/studies` | 390 e 1 280 | 4 |
| `documento-tema-cruzado` | `/estudos/…/documento` e `/en/studies/…/document`, com o sistema em escuro e o leitor a escolher «claro» | 1 280, antes e depois | 4 |

**As dez capturas da página de texto não mudaram um byte com a segunda passagem**, e a razão foi medida e não presumida: refizeram-se as quatro que o brief nomeia (390 e 1 280, duas edições) e saíram idênticas às que já estavam. O que mudou na página foi a linha do `origin_ref` no aparelho técnico, que está **dentro do `<details class="texto-dobra">`**, uma dobra fechada por omissão que uma captura de página inteira não mostra. As dez continuam exactas para esta cabeça, incluindo as seis que não se refizeram.

**As quatro da combinação cruzada são a prova do §8.** Levam ao lado, impressos pelo guião, a tinta calculada da primeira célula e a tela composta por baixo dela:

| | tinta | tela |
| --- | --- | --- |
| antes | `rgb(23, 25, 27)` | transparente até à raiz |
| depois | `rgb(23, 25, 27)` | `BODY rgb(250, 251, 249)` |

A tinta é a mesma nas duas: o que faltava era a tela. O «antes» foi tirado do `dist/` dos bytes antigos, antes de os substituir, e não reconstituído depois.

## 7 · O custo

**Tempo de parede:** das 17:36 às 20:10 UTC de 16.09.2026, **2 h 34 m**, em três passagens: a primeira até às 18:45 (1 h 9 m), a segunda, depois de o motor corrigir a folha, das 18:52 às 19:30 (38 m), e a terceira, sobre a leitura a frio do Codex, das 19:40 às 20:10 (30 m).

Perto de duas horas disso foi em construções e portões: oito `npm run build` (cada um cerca de seis minutos), cinco `npm run verify` (cerca de nove cada; um parou na célula vermelha da moldura e outro numa corrida suja, ver o §11), os dezanove passos do resto da cadeia corridos um a um, e cinco passagens da régua da moldura com navegador, entre as do portão e as três sondas que atribuíram os 3 167 nós documento a documento.

**Símbolos:** cerca de **525 mil**, contados pelo orçamento da sessão da ferramenta (de 15 000 000 no início a cerca de 14 475 000 no fim). Não é a mesma conta que o contador do modelo faz, e por isso diz-se de onde vem.

## 8 · O achado da primeira passagem, e como fechou

**A primeira passagem aterrou com o `npm run verify` a 1**, na `check:moldura`, com duas células vermelhas:

```
  ✗ C1  3167 nó(s) graves em 72 passagens · color-contrast [serious]=3167
  ✗ C2  filetes: 44896 medidos, 0 abaixo de 3:1 (o pior 3.10:1) · texto próprio das células: 39964 medidos, 2968 abaixo de 4,5:1 (o pior 1.17:1)
```

**A atribuição foi medida documento a documento**, nos dezoito documentos alojados, nos dois temas e nas duas larguras, e não deduzida de um total:

```
evora-2027-prometido-painel-dinheiro/en dark  390: 789
evora-2027-prometido-painel-dinheiro/en dark 1280: 794
evora-2027-prometido-painel-dinheiro/pt dark  390: 790
evora-2027-prometido-painel-dinheiro/pt dark 1280: 794
TOTAL graves 3167 · dos dois documentos novos 3167 · dos outros dezasseis 0
```

**A causa.** A moldura deste projeto escreve `color: var(--oedp-ink)!important` no `th` e no `td` de qualquer documento alojado, porque não pode confiar nas cores das células de uma obra citada; e escolhe a tinta clara ou escura por `@media (prefers-color-scheme:dark)` com a guarda `:root:not([data-theme="light"])`, que é a guarda que os documentos usam. O comentário de `src/lib/documentos.mjs` di-lo por extenso: «a guarda é a mesma que os documentos usam, para que as duas folhas nunca digam coisas diferentes ao mesmo leitor». A primeira folha do 14 declarava `:root { color-scheme: light dark; }` e mais nada: sem papel, sem tinta, com a tela entregue ao navegador. O `color-scheme` resolve-se pelo sistema operativo e não vê o `data-theme` que o botão deste sítio escreve.

Daí saíam duas coisas, e as duas eram reais: o `axe` não tinha tela para compor e resolvia contra branco (1,17:1, 3 167 nós); e, com o sistema em escuro e o leitor a escolher «claro», as tabelas ficavam quase ilegíveis. A segunda está fotografada, e não era uma hipótese.

**O QUE NÃO SE FEZ, e fica escrito para não ser redescoberto:** não se pintou um fundo por cima da obra citada na moldura. Seria este projeto a reescrever o que serve byte a byte, contra a regra que a própria moldura escreve («as cores INTERIORES da obra citada ficam das obras»), e mudava como os dezoito documentos se rendem. Não era uma correção: era outra decisão, e de outro bloco.

**O QUE SE FEZ.** Disse-se ao lugar de direção, e o motor corrigiu a folha das duas edições em `b99e2254052c773d526281704ab7405ad2becfe6`: as fichas `--paper` e `--ink` nas três guardas (`@media (prefers-color-scheme: dark) :root:where(:not([data-theme="light"]))`, `:root[data-theme="dark"]` e `:root[data-theme="light"]`), com o `html` e o `body` pintados com elas, que é o que as dezasseis irmãs já faziam. Aqui refixaram-se os bytes e as duas linhas do manifesto, e correu-se a travessia outra vez.

**O resultado, medido na mesma régua:** C1 de 3 167 para **0**; C2 de 2 968 textos de célula abaixo de 4,5:1 para **0**, com o pior a subir de 1,17:1 para **7,57:1**; e o que a moldura não corrige de 212 nós para **0**. A combinação que partia lê-se agora com tinta `rgb(23, 25, 27)` sobre tela `rgb(250, 251, 249)`.

**O texto do documento não mudou**, e é a parte que importa dizer: os dois `.record.json` do motor têm o resumo que já tinham, e nenhum ficheiro de `registos/` mudou um byte. Mudou a folha de estilos da edição, e mais nada.

## 9 · O que fica por fazer

**Do mandato, nada.** Os seis itens estão feitos e os três portões estão a 0.

**Fora do mandato, três coisas que são de quem funde, e ficam ditas:**

1. **A leitura a frio deste bloco**, que a regra da casa manda fazer antes da fusão e que não é de quem constrói. A entrada do bloco no registo das revisões do inventário está escrita com `por ler`, que é o estado legítimo enquanto o bloco está em construção, e o portão da voz nomeia-a em voz alta a cada construção.
2. **A leitura do estudo pelo diretor.** As duas páginas de leitura novas entram com `noindex`, como as outras oito, e a linha dos pendentes continua a pedir a leitura das oito da parte 3: estas duas não foram acrescentadas a essa linha, porque acrescentar trabalho à lista do diretor não é de quem constrói.
3. **A dívida da faixa**, medida de passagem e dita ao pé do número que a mede: a marca deste projeto e a porta de voltar apontam as duas para a página do estudo, em cada documento alojado, e são 17 das 2 286 páginas da catraca L1. Fechá-la leva a catraca a 2 269.

## 10 · Duas notas de facto, para o registo

1. **O documento tem oito secções de nível 2, e não sete.** O §0 do brief do sítio diz «as sete secções». As oito, nas duas edições, são: «Os limites deste documento», «A linha do tempo», «O que a candidatura prometeu, e o que o painel escreveu», «O dinheiro em linhas», «O que não se encontrou», «O que mudou», «Quem dirige a associação» e «As fontes». A sétima é a que o §1.6 do brief do motor manda escrever (os órgãos sociais da associação, pelo cargo e pelo nome, com a falta das remunerações dita). Não é um desvio: é a contagem do brief do sítio que está uma curta.
2. **Nenhuma das 182 referências de cada edição tem linha no livro-razão deste sítio**, e é o esperado: as linhas deste estudo vivem no livro-razão do motor e não atravessaram. A página de texto dá a cada figura a porta da sua entrada em «As linhas deste documento», que é a saída que a `IDENTIDADE.md` §10 prescreve quando não há linha para prometer, e nenhum selo promete uma linha que não existe.

## 11 · A terceira passagem: a leitura a frio do Codex

**A leitura a frio sobre `01ebdf27` apanhou as cinco plantas e trouxe três pontos reais.** Cada um levou o seu commit.

1. **Os títulos declarados não eram os do documento** (`11266be7`). `studies.mjs` e o `studies-src/manifest.yml` diziam o nome do ficheiro do motor, que é como ele arruma as suas edições em disco. O título passa a ser o que o documento imprime, lido do `<h1>` de cada edição, e as quatro fontes do mesmo facto dizem agora a mesma cadeia, conferida carácter a carácter: o `<h1>`, a etiqueta `<title>`, o campo `title` do registo e o bloco 0 desse registo. **Nenhum portão compara o título com o nome do ficheiro do motor**, e foi conferido antes de mexer.
2. **A proveniência da data nomeava o commit errado** (`d7fa77d8`). O comentário dizia `c0b19d4` e que os bytes «não voltaram a mudar»; voltaram, com `b99e225`, que é o que o manifesto já dizia. Os dois lugares diziam coisas diferentes sobre o mesmo facto.
3. **Três contagens deste relatório estavam erradas** (`741fdac9`): vinte e quatro capturas onde são vinte e oito; «155 507 bytes» que eram caracteres (são 157 227 bytes); e «dois novos» entre os vinte ficheiros da travessia, que são quatro, porque cada edição traz um registo e um ficheiro de operações.

**E uma quarta coisa, que é consequência da primeira e não estava na lista** (`5743ede7`): trocado o título, três prosas ficaram a nomear um título que já não existe. A que importa é a do livro-razão, porque a `derivation` de `estudos-evora-publicados` é impressa na página da linha: um número deste sítio resolve numa linha, e a linha não pode nomear uma coisa que o arquivo não tem. Com ela foram duas gralhas de pontuação da mesma frase, escritas na primeira passagem.

**O que fica da leitura e não é deste bloco**, por decisão do lugar de direção: os guiões do tema nas páginas, o `origin_ref` das oito entradas antigas do registo de travessia, e a catraca L1. São do brief ou do desenho.

**UMA NOTA DE MÉTODO, porque custou uma corrida.** A primeira corrida dos portões desta passagem saiu a 1 no `build` e no `verify`, e não era um defeito: o `astro build` rendeu as páginas, eu editei o livro-razão enquanto ele corria, e o `gate:html` comparou o `dist/` velho com o ficheiro novo. O portão apanhou uma diferença real entre o que estava construído e o que estava declarado, que é exactamente o que ele existe para apanhar. A corrida que vale é a de uma árvore limpa em que nada se toca do princípio ao fim.

**A ENTRADA DE «ORÇAMENTADO, PAGO, DEVIDO» DIZ A REGRA DO TÍTULO AO CONTRÁRIO**, com a data de 15.08.2026: «o título é o nome do documento, e não a sua etiqueta `<title>`». As duas regras não podem valer as duas, e qual delas fica é decisão da direção. Este bloco aplicou a que a leitura a frio mandou aplicar e não mexeu nas outras entradas; fica dito aqui e no comentário da entrada.

## 12 · A quarta passagem: a leitura de abertura (ramo `e1-abertura-2026-09-16`)

*Sobre `main` `3bdf0b36`, que já tem tudo o que aterrou a 16.09. É um ramo à parte, e não a continuação do `e1-2026-09-16`.*

**O diretor decidiu, a 16.09.2026 à noite e depois de ver o estudo no ar, que um estudo abre com a leitura do projeto.** O motor pôs as três secções a seguir ao título («Em resumo», «O que este projeto conclui», «O que podia funcionar melhor») e corrigiu com elas a linha das ausências dos contratos da associação. Deste lado refixaram-se os bytes e refez-se a travessia.

**O que mudou, medido:** os bytes passam de 61 558 para 66 084 (pt) e de 59 780 para 64 182 (en); os registos de 119 para 130 blocos e de 182 para 190 referências, por edição. **Desta vez o texto mudou**, e por isso os dois `.record.json` mudaram com ele; os dois `.cortes.json` não mudaram um byte, que é a resposta certa: são as operações da passagem de voz, e neste estudo são zero. O título não mudou, porque a abertura entra depois dele.

**O ensaio do exportador, com o destino conferido antes da escrita:**

```
  travessia dos registos de conteúdo · motor d768bdea4c99 · destino …/e1-abertura-2026-09-16/registos
  14 en  → evora-2027-prometido-painel-dinheiro/en   blocos 130 · refs 190 · edicao-html · o D5 corre e bate
  14 pt  → evora-2027-prometido-painel-dinheiro/pt   blocos 130 · refs 190 · edicao-html · o D5 corre e bate
  0 nova(s) · 2 alterada(s) · 8 inalterada(s)
  Escritos 20 ficheiro(s) em …/e1-abertura-2026-09-16/registos
```

**As duas capturas do primeiro ecrã** (`texto-abertura-pt-390.png` e `texto-abertura-pt-1280.png`) respondem à pergunta que a decisão faz: o que é que se lê sem tocar em nada. Não são de página inteira, de propósito. Nas duas larguras couberam os mesmos dois títulos, e mais nenhum:

```
  H1 Évora 2027: o prometido, o que o painel escreveu, e o dinheiro em linhas
  H2 Em resumo
```

**A norma ganhou a regra 4 da §4**, palavra por palavra como o lugar de direção a escreveu, e o título da secção passou a «(quatro regras)». **A leitura cruzada dos seis estudos** entrou em `design/observatorio/evora/MAPA-dos-seis-estudos-2026-09-16.md`, em inglês como veio, com o parágrafo em itálico que diz quem a pediu, com que palavras, quanto custou e o que o lugar de direção recomendou.

**O QUE FICOU POR PÔR, E PORQUÊ: a entrada §1.111 do `DECISIONS.md`.** O campo `**Afecta:**` de uma entrada a partir da §1.38 é vocabulário fechado de quatro palavras (`sobre`, `metodo`, `agenda`, `nenhum`), sozinho na sua linha, e o `ledger:check` recusa qualquer outra coisa: é ele que garante que uma mudança de rumo diz que texto governa. O texto que recebi põe prosa nesse campo («os estudos (a forma do documento no motor; a norma §4.4; a carta dos conteúdos, por remissão)») e junta na mesma linha o `**Decidido por:**` e o `**Aplicado por:**`, que as outras entradas escrevem em linhas próprias. O portão dá três erros.

Esta decisão não governa nenhum dos dois textos governados nem a agenda, e por isso o valor certo do campo é `nenhum`, com a prosa a passar para o corpo da entrada. **É uma linha, e não é minha para escrever:** a instrução era não mudar uma palavra, e não mudei. A entrada fica por pôr, e o ramo fica verde; quem escreveu a entrada corrige a linha e ela entra sozinha, sem tocar em mais nada.

**Os três portões desta passagem**, cada comando no seu, com o código lido de um ficheiro, sobre `f7c2759b`:

```
npm run build     → 0
npm run verify    → 0
npm run typecheck → 0
```

Os códigos ficaram em `j-build.code`, `j-verify.code` e `j-typecheck.code`, com as saídas ao lado, no directório de trabalho da sessão.

**Os commits desta passagem**, sobre `3bdf0b36`:

| cabeça | o que |
| --- | --- |
| `35601830` | O estudo ganha a leitura de abertura, e os bytes refixam-se com ela |
| `8133c8a6` | A norma ganha a regra da leitura de abertura |
| `44d68028` | A leitura cruzada dos seis estudos de Évora entra no repositório |
| `f7c2759b` | As duas capturas do primeiro ecrã, com a leitura de abertura |
| (o commit deste ficheiro) | Esta secção. **É a cabeça final**, e acrescenta um ficheiro de relatório que nenhuma das três cadeias lê |
