# A CI do sítio · o bloco F0.3 · o lado do construtor (02.09.2026)

*Escrito pelo construtor (Claude Opus 5) a 02.09.2026, na worktree
`ci-2026-09-02`, sobre o brief do bloco F0.3 do
`design/observatorio/PLANO-fiabilidade-2026-09-02.md` e o terceiro risco da
`AUDITORIA-2026-09-02.md` («nenhuma CI, nenhuma verificação obrigatória em
`main`, um `typecheck` vazio: os três portões da casa são uma promessa, e a
promessa quebrou-se a 01.09»). Todos os números vêm de corridas desta sessão e
cada um traz ao lado o comando que o produziu. Sem travessões na prosa. Modelo:
Claude Opus 5.*

---

## 1 · Os três portões locais, antes do commit final

Corridos um a um na worktree, cada um com o estado de saída lido logo a seguir
com `echo $?` e nunca lido do texto da saída:

| comando | estado de saída | segundos |
|---|---|---|
| `npm run build` | **0** | 283 |
| `npm run verify` | **0** | 58 |
| `npm run typecheck` | **0** | 0 |

O comando de cada linha, à letra:

```
S=$(date +%s); npm run build > .../build-final.log 2>&1; echo "BUILD_EXIT=$?"; E=$(date +%s); echo "BUILD_SEGUNDOS=$((E-S))"
      → BUILD_EXIT=0        BUILD_SEGUNDOS=283
S=$(date +%s); npm run verify > .../verify-final.log 2>&1; echo "VERIFY_EXIT=$?"; E=$(date +%s); echo "VERIFY_SEGUNDOS=$((E-S))"
      → VERIFY_EXIT=0       VERIFY_SEGUNDOS=58
S=$(date +%s); npm run typecheck > .../typecheck-final.log 2>&1; echo "TYPECHECK_EXIT=$?"; E=$(date +%s); echo "TYPECHECK_SEGUNDOS=$((E-S))"
      → TYPECHECK_EXIT=0    TYPECHECK_SEGUNDOS=0
```

Node local: `node -v` → `v22.23.1`. npm local: `npm -v` → `10.9.8`.

---

## 2 · O que o fluxo faz

`.github/workflows/portao.yml`, 91 linhas, mais o `.nvmrc` de uma linha
(`git show --stat 267d97db` → `2 files changed, 92 insertions(+)`).

* **Quando corre:** `on: push` sem filtro de ramo (todos os ramos) e
  `on: pull_request`. Confere a **cabeça** de cada push e de cada pedido, e não
  cada commit lá dentro (§7.1). O grupo de concorrência é
  `group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}`
  com `cancel-in-progress: true`; o `github.ref` sozinho já separava o push do
  pedido, e o `event_name` fica por ser explícito, não por ser preciso (§7.2).
* **O que pode:** `permissions: contents: read`, e mais nada. Sem escrita, sem
  pacotes, sem `id-token`.
* **Onde corre:** `runs-on: ubuntu-24.04` (preso de propósito, §7.3),
  `timeout-minutes: 30`. A corrida verde mais lenta levou 13 min 50 s (§3.5), o
  que deixa a margem larga sem a deixar infinita.
* **O nome do trabalho:** `portao`. É esse o nome do contexto que o diretor tem
  de escolher em Settings → Branches → Require status checks to pass. O trabalho
  não leva campo `name:` de propósito: assim o contexto é o identificador do
  trabalho e não há dois nomes para a mesma coisa. Confirmado na corrida:
  `gh api repos/oestadodopais/o-estado-do-pais/actions/runs/33592347822/jobs -q '.jobs[0].name'`
  → `portao`.
* **As ações de terceiros, presas ao resumo do commit:** uma etiqueta é um
  ponteiro que quem a publica pode mover; um resumo não é. As etiquetas foram
  lidas na fonte a 02.09.2026 com
  `gh release view --repo <repositório> --json tagName,publishedAt` e os resumos
  com `gh api repos/<repositório>/git/ref/tags/<etiqueta> -q '.object.type + " " + .object.sha'`:

  | ação | etiqueta | resumo do commit |
  |---|---|---|
  | `actions/checkout` | v7.0.1 (publicada 2026-07-20) | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
  | `actions/setup-node` | v7.0.0 (publicada 2026-07-14) | `820762786026740c76f36085b0efc47a31fe5020` |
  | `actions/upload-artifact` | v7.0.1 (publicada 2026-04-10) | `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a` |

  Os três resumos são de objetos do tipo `commit` (não são etiquetas anotadas), e
  os campos usados foram lidos no `action.yml` de cada uma **no resumo preso** e
  não na documentação: `gh api "repos/<r>/contents/action.yml?ref=<resumo>" -q '.content' | base64 -d`.
  É de lá que se sabe que o `setup-node` v7.0.0 aceita `node-version-file` e
  `cache`, e que o `upload-artifact` v7.0.1 aceita `retention-days` e
  `if-no-files-found`.
* **O Node:** `actions/setup-node` com `node-version-file: .nvmrc` e `cache: npm`.
  O `.nvmrc` diz `22.23.1` (`od -c .nvmrc` → `2 2 . 2 3 . 1 \n`), a versão exata
  do portátil, e o `engines` do `package.json` fica como estava (`>=22.12.0`): o
  `engines` diz o mínimo que a casa aceita, o `.nvmrc` diz a versão em que a casa
  desenvolve, com o remendo e tudo (§7.3). Na primeira passagem o `.nvmrc` dizia
  `22` e o anfitrião resolveu para `node: v22.23.2`, um remendo à frente do
  portátil sem ninguém decidir nada.
* **Os três portões, um passo cada:** `npm ci`, `npm run build`,
  `npm run verify`, `npm run typecheck`. Separados para o registo dizer qual caiu
  sem ninguém ter de ler onze mil linhas de saída
  (`gh run view 33592347822 --log | wc -l` → `11577`).
* **A prova de cada corrida verde:** `dist/prova.json` (escrito pelo `gate:html`)
  e `dist/cadeia.json` (escrito pelo `check:cadeia`), guardados 14 dias. Sobem só
  quando os três portões fecharam verdes, e um passo antes da subida exige os
  dois ficheiros com `test -f` cada (§7.4 e §7.5). Na primeira corrida verde:
  `prova-267d97db4faec412787b40fcb7d9ff0a3baf9382`, 2 646 bytes, a expirar em
  `2026-09-16T05:00:05Z`
  (`gh api repos/oestadodopais/o-estado-do-pais/actions/runs/33592347822/artifacts`).

---

## 3 · As corridas no GitHub

### 3.1 A corrida verde, à primeira

Ramo `ci-2026-09-02`, commit `267d97db4faec412787b40fcb7d9ff0a3baf9382`.
**https://github.com/oestadodopais/o-estado-do-pais/actions/runs/33592347822**

Total da corrida: **9 min 35 s** (575 s), de `2026-09-02T04:50:35Z` a
`2026-09-02T05:00:10Z`
(`gh run view 33592347822 --json createdAt,updatedAt,conclusion`; conclusão
`success`).

Os passos, com os tempos lidos em
`gh api repos/oestadodopais/o-estado-do-pais/actions/runs/33592347822/jobs -q '.jobs[0].steps[] | "\(.number)\t\(.name)\t\(.conclusion)\t\(.started_at)\t\(.completed_at)"'`:

| # | passo | resultado | início | fim | segundos |
|---|---|---|---|---|---|
| 1 | Set up job | success | 04:50:39 | 04:50:40 | 1 |
| 2 | A árvore (`actions/checkout`) | success | 04:50:40 | 04:50:52 | 12 |
| 3 | O Node (`actions/setup-node`) | success | 04:50:52 | 04:50:56 | 4 |
| 4 | `npm ci` | success | 04:50:56 | 04:51:03 | 7 |
| 5 | `npm run build` | success | 04:51:03 | 04:58:32 | **449** |
| 6 | `npm run verify` | success | 04:58:32 | 05:00:04 | 92 |
| 7 | `npm run typecheck` | success | 05:00:04 | 05:00:04 | 0 |
| 8 | A prova desta construção | success | 05:00:04 | 05:00:05 | 1 |
| 15 | Post O Node | success | 05:00:05 | 05:00:07 | 2 |
| 16 | Post A árvore | success | 05:00:07 | 05:00:08 | 1 |
| 17 | Complete job | success | 05:00:08 | 05:00:08 | 0 |

Três coisas que estes números dizem e vale a pena escrever:

1. **A construção é 78,1 % do tempo da corrida** (449 s de 575 s; nas três
   corridas verdes a fração ficou entre 76,8 % e 79,8 %, §3.5). O anfitrião é
   mais lento do que o portátil: 449 s contra os 283 s medidos localmente na
   mesma árvore (§1), ou seja **1,59 vezes**. É o número com que se conta antes
   de pôr mais alguma coisa no `build`.
2. **O `typecheck` custa 0 s**, e não é uma vitória: o `tsconfig.check.json` tem
   `checkJs: false`, e por isso o `tsc` abre os ficheiros e não confere nada.
   Medido: `npx tsc -p tsconfig.check.json --listFiles | wc -l` → `729`
   ficheiros, dos quais `729 - 659 = 70` são do projeto e 659 são de
   `node_modules`. É exatamente o buraco que o bloco F0.4 fecha; a CI apenas o
   torna visível a cada push em vez de o esconder.
3. **A cache do npm está fria nesta corrida.** O passo «O Node» escreveu
   `npm cache is not found`, e a cache só foi guardada no fim
   (`Cache saved with the key: node-cache-Linux-x64-npm-141a93da…`). Os 7 s de
   `npm ci` são portanto tempo de cache fria. O que a cache fez quando ficou
   quente está medido em §3.4, e não é o que se esperava.

### 3.2 O que o `npm ci` instalou no anfitrião, e o caso do `@resvg/resvg-js`

O brief pedia que se conferisse se o `@resvg/resvg-js`, que o `npm run cartoes`
usa dentro do `build`, instala o seu binário de Linux com `npm ci` no anfitrião.
**Instala, e não foi preciso conserto nenhum.** As três razões, cada uma medida:

* O `package-lock.json` traz as doze dependências opcionais por plataforma do
  `@resvg/resvg-js` 2.6.2, incluindo `@resvg/resvg-js-linux-x64-gnu` com
  `"os": ["linux"]` e `"cpu": ["x64"]` (`grep -n "resvg" package-lock.json`,
  linhas 1530 a 1541 e 1656 a 1671). O `npm ci` resolve a opcional certa pelo
  anfitrião: `added 218 packages` no portátil e `added 223 packages, and audited
  224 packages in 7s` no anfitrião (linha do passo `npm ci` do registo).
* O `scripts/cartoes.mjs` corre com `loadSystemFonts: false` e
  `fontFiles: TIPOS_DO_CARTAO`, e esses ficheiros estão em git
  (`git ls-files tipos-cartao | wc -l` → `7`, cinco `.ttf` e duas licenças). O
  anfitrião não precisa de uma única letra instalada, e por isso não há passo de
  `fonts-*` no fluxo.
* O resultado no anfitrião, lido no registo da corrida verde:
  `cartões · 302 cartões × 2 medidas = 604 PNG e 604 registos · 9.54 MB · 752 medições de texto · 8.5s`
  e `paleta · 604 de 604 PNG em paleta exacta (tipo de cor 3), no máximo 118 cores num cartão · 0 em RGBA`.

Pelo mesmo caminho se confirmou uma segunda coisa que podia ter custado minutos:
o `playwright` 1.60.0 **não** tem `hasInstallScript` no `package-lock.json`
(`grep -n "hasInstallScript" package-lock.json` → três linhas, e são o `esbuild`
e dois `fsevents`), pelo que o `npm ci` não descarrega navegadores. Os 7 s do
passo são todos de pacotes.

### 3.3 A planta, vista vermelha

Ramo descartável `ci-planta-2026-09-02`, cortado do `ci-2026-09-02`, commit
`283617da1bb9ace2b7a2a0c9e877fd65928bad98`. Uma só linha mudada, a linha 11831 do
`DECISIONS.md`, na entrada mais recente do registo:

```
-**Afecta:** nenhum
+**Afecta:** todos
```

(`git diff -U1 DECISIONS.md` → `1 file changed, 1 insertion(+), 1 deletion(-)`.)

**https://github.com/oestadodopais/o-estado-do-pais/actions/runs/33592422857**

Conclusão `failure`. Total da corrida: **28 s**, de `2026-09-02T04:51:46Z` a
`2026-09-02T04:52:14Z`. Os passos:

| # | passo | resultado | segundos |
|---|---|---|---|
| 1 | Set up job | success | 1 |
| 2 | A árvore | success | 10 |
| 3 | O Node | success | 1 |
| 4 | `npm ci` | success | 6 |
| 5 | `npm run build` | **failure** | 1 |
| 6 | `npm run verify` | skipped | 0 |
| 7 | `npm run typecheck` | skipped | 0 |
| 8 | A prova desta construção | skipped | 0 |

A frase que fechou a corrida, copiada do registo
(`gh run view 33592422857 --log-failed`):

```
> o-estado-do-pais@0.1.0 ledger:check
> node scripts/check-ledger.mjs
...
  amarra das decisões · 55 entrada(s) a partir da §1.38 · 2 texto(s) governado(s) · 2 citação(ões) da constituição conferida(s), de 43 entre «…»
  A AMARRA DAS DECISÕES NÃO FECHA · 1 erro(s):

    ✗ §1.92: **Afecta:** nomeia "todos", que não é um dos quatro.

  Uma mudança de rumo não sai em silêncio (direção, 2026-08-15).
##[error]Process completed with exit code 1.
```

O `ledger:check` é o primeiro comando do `npm run build`, e por isso a corrida
morre ao primeiro segundo: o anfitrião gasta 18 s a chegar lá e 1 s a recusar.
Antes de empurrar, o mesmo estrago foi corrido no portátil como conhecido
positivo: `npm run ledger:check > planta-ledger.log 2>&1; echo "LEDGER_EXIT=$?"`
→ `LEDGER_EXIT=1`, com a mesma frase. A régua que apanha isto não é nova: o que é
novo é ser o GitHub a corrê-la, em cada push, sem depender de quem se lembra.

A corrida da planta **não deixou artefacto**
(`gh api .../runs/33592422857/artifacts -q '.total_count'` → `0`), que é o
comportamento desenhado: o passo do artefacto está preso ao resultado do passo da
construção, e uma corrida que cai antes de haver `dist/` não junta um segundo
vermelho por um ficheiro que nunca podia existir.

O ramo da planta foi apagado no remoto logo a seguir:
`git push origin --delete ci-planta-2026-09-02` → ` - [deleted]  ci-planta-2026-09-02`,
`PUSH_DELETE_EXIT=0`. **O ramo local ficou por apagar** e é a única coisa deste
bloco que precisa de mão humana: `git branch -D` está na lista de recusa do
`~/.claude/settings.json` do diretor (linha 45, dentro de `deny`), e o construtor
não contorna uma recusa do diretor por outro comando que faça o mesmo. Falta
correr, na worktree `ci-2026-09-02`:

```
git branch -D ci-planta-2026-09-02
```

A planta nunca esteve em `main` nem no ramo `ci-2026-09-02`: foi cortada para um
ramo próprio, e o `git status --porcelain` do ramo de trabalho voltou vazio com a
linha 11831 a dizer `**Afecta:** nenhum` outra vez.

### 3.4 A terceira corrida, e o que ela diz da cache e do anfitrião

O commit deste relatório produziu uma terceira corrida no mesmo ramo, e vale a
pena escrevê-la porque é a primeira que apanha a cache do npm e a primeira que
mede a variação entre anfitriões.

Ramo `ci-2026-09-02`, commit `6b746e673b11f6d48ff5c9da66685750ad05f2ef`.
**https://github.com/oestadodopais/o-estado-do-pais/actions/runs/33593721414**

Conclusão `success`. Total: **11 min 43 s** (703 s), de `2026-09-02T05:11:52Z` a
`2026-09-02T05:23:35Z`.

| # | passo | segundos na 3.ª corrida | segundos na 1.ª (§3.1) |
|---|---|---|---|
| 2 | A árvore | 13 | 12 |
| 3 | O Node | 12 | 4 |
| 4 | `npm ci` | 12 | 7 |
| 5 | `npm run build` | **540** | 449 |
| 6 | `npm run verify` | 114 | 92 |
| 7 | `npm run typecheck` | 1 | 0 |
| 8 | A prova desta construção | 1 | 1 |

Duas leituras, e nenhuma delas é uma conclusão:

1. **O mesmo trabalho custa mais, e o quanto varia por portão** (leitura a frio
   do Codex, achado 14: um «20 %» só não descreve os dois). Contra a 1.ª corrida:
   a construção **+20,3 %** (540 s contra 449 s), o `verify` **+23,9 %** (114 s
   contra 92 s), os dois juntos **+20,9 %**, a corrida inteira **+22,3 %**. Não
   há nada a consertar: as duas corridas saíram na mesma imagem
   (`Image: ubuntu-24.04` nas duas), pelo que a diferença é dispersão de
   anfitriões partilhados e não uma mudança de sistema. É por isso que o
   `timeout-minutes: 30` tem de ficar largo.
2. **A cache do npm acertou, e o que isso custou não se sabe destas corridas**
   (leitura a frio do Codex, achado 15). O passo «O Node» diz
   `Cache hit for: node-cache-Linux-x64-npm-141a93da…`, `Cache Size: ~84 MB
   (88128500 B)`, `Cache restored successfully`, e nesta corrida os dois passos
   do Node custaram 24 s contra os 11 s da 1.ª, que estava fria. A primeira
   redação deste relatório concluiu daí que a cache custava mais do que poupava:
   **estava errado**, e a 4.ª corrida mostra porquê (§3.5). Duas corridas sem
   controlo nenhum não separam o custo da cache da variação do anfitrião e da
   rede, e este parágrafo passa a dizer só o que foi medido.

### 3.5 A quarta corrida, que desfaz a conclusão da cache

Ramo `ci-2026-09-02`, commit `8144787958451e1836617cfcfec03a6063f4d4eb`.
**https://github.com/oestadodopais/o-estado-do-pais/actions/runs/33594974810**

Conclusão `success`. Total: **13 min 50 s** (830 s), de `2026-09-02T05:30:55Z` a
`2026-09-02T05:44:45Z`. Artefacto
`prova-8144787958451e1836617cfcfec03a6063f4d4eb`, 2 647 bytes.

| passo | 1.ª corrida (cache fria) | 3.ª corrida (cache quente) | 4.ª corrida (cache quente) |
|---|---|---|---|
| O Node | 4 | 12 | **3** |
| `npm ci` | 7 | 12 | **5** |
| os dois juntos | **11** | **24** | **8** |
| `npm run build` | 449 | 540 | 662 |
| `npm run verify` | 92 | 114 | 138 |
| total da corrida | 575 | 703 | 830 |

A 4.ª corrida acertou na mesma cache (`Cache hit for:
node-cache-Linux-x64-npm-141a93da…`, e no fim `Cache hit occurred on the primary
key …, not saving cache`) e fez os dois passos do Node em **8 s**, ou seja menos
do que os 11 s da corrida fria. A cache quente deu portanto o pior resultado
(24 s) e o melhor (8 s) das três, o que fecha a questão: **destas corridas não se
tira nenhuma conclusão sobre o custo da cache**, e a dispersão do anfitrião
domina tudo o resto (a construção subiu +47,4 % da 1.ª para a 4.ª, e o `verify`
+50,0 %, sempre na mesma imagem `ubuntu-24.04`). O `cache: npm` fica como está;
para decidir se compensa era preciso o mesmo commit corrido várias vezes com e
sem a linha, e isso não é trabalho deste bloco.

O que estas três corridas verdes dizem com segurança é uma coisa só, e é
estável: **a construção vale entre 76,8 % e 79,8 % do tempo da corrida** (449 de
575, 540 de 703, 662 de 830). É esse o número com que se conta antes de pôr mais
alguma coisa no `build`.

---

## 4 · O que uma verificação de estado obrigatória em `main` muda no fluxo da casa

Hoje o portão é uma convenção: quem funde corre os três comandos, e se se
esquecer, ou se os correr numa árvore que não é a que empurra, o commit vermelho
entra em `main` e é o Vercel a descobri-lo depois do push, como a 01.09. Com o
contexto `portao` exigido em `main`, o GitHub deixa de aceitar em `main` qualquer
commit cujo resumo não tenha uma verificação verde com esse nome: um push direto
de um commit de fusão recém-fabricado é recusado à entrada, porque esse resumo é
novo e nunca correu em lado nenhum. O que passa a haver são dois caminhos, e
ambos deixam registo. O primeiro é a fusão em avanço rápido: o lugar de direção
espera que a corrida do ramo fique verde, e funde sem criar commit novo, de modo
que o resumo que chega a `main` é exatamente o resumo que o GitHub já viu verde;
é o caminho barato e é o que serve a maior parte dos blocos, mas obriga o ramo a
estar em cima da cabeça de `main` (um rebase antes da fusão, e a corrida a
repetir-se sobre o resumo novo). O segundo é o pedido de integração: o commit de
fusão nasce dentro do GitHub, a corrida do pedido corre sobre ele, e a fusão só
fica disponível quando o `portao` fecha verde; custa uma corrida a mais e dá em
troca a página onde a fusão fica escrita. A diferença prática para o diretor é
que a frase «commit verde» deixa de ser uma promessa que alguém tem de cumprir e
passa a ser uma condição que a máquina impõe, e que ninguém dentro da casa pode
levantar sem ir às definições do repositório, que são dele.

O que continua a não estar coberto, e é honesto dizê-lo aqui: a exigência protege
`main` de commits que não correram os portões, não protege de commits que
correram os portões e mesmo assim estão errados, porque nenhum dos catorze
portões lê um ficheiro `.md` para saber se é verdade (é o caso dos 53 011 da
auditoria, e é o que os blocos F0.6 e F3.1 vão buscar).

---

## 5 · O que ficou decidido aqui e o brief não dizia

1. **O `event_name` dentro do grupo de concorrência.** O brief pedia «um grupo
   por referência»; ficou `workflow + event_name + ref`. A razão que aqui estava
   escrita na primeira passagem estava errada, e a leitura a frio do Codex
   apanhou-a (achado 10): o `github.ref` já separa o push do pedido de
   integração. Ficou, pela razão certa, em §7.2.
2. **O passo do artefacto.** Na primeira passagem estava
   `if: always() && steps.construcao.outcome == 'success'`, o que subia a prova
   de uma construção que a seguir caía no `verify` ou no `typecheck`, e o
   `if-no-files-found: error` sozinho deixava passar uma prova com um dos dois
   ficheiros. As duas coisas eram defeitos, o Codex apanhou-as (achados 4 e 5) e
   estão consertadas em §7.4 e §7.5.
3. **O trabalho sem campo `name:`**, para o contexto da verificação de estado ser
   o identificador do trabalho (`portao`) e não haver dois nomes para a mesma
   coisa.
4. **`actions/upload-artifact` fixado tal como as outras duas**, porque também é
   uma ação de terceiros ainda que o brief só tenha nomeado o `checkout` e o
   `setup-node`.
5. **O ramo local da planta ficou por apagar** (§3.3), por a recusa do
   `git branch -D` ser do diretor.

---

## 6 · O que o diretor tem de fazer para o bloco fechar

Uma coisa só, e é nas definições do repositório, que são dele:

> Settings → Branches → Add branch ruleset (ou Branch protection rule) para
> `main` → Require status checks to pass → escolher **`portao`**.

Enquanto isso não estiver feito, o fluxo corre e vê-se, mas `main` continua a
aceitar o que lhe empurrarem. A medida de aceitação do bloco F0.3 tem duas
metades: «o fluxo verde no push», que está feita e medida em §3.1, e «um commit
com `**Afecta:** todos` plantado num ramo é recusado antes de fundir», que está
provada como recusa da corrida em §3.3 e passa a recusa da fusão no momento em
que o diretor escolher o contexto.

---

## 7 · Segunda passagem, sobre a leitura a frio do Codex

*A leitura está em `design/especime-v3/critica/2026-09-02-codex-leitura-f03-ci-sitio.md`
(Codex `gpt-5.6-sol`, xhigh, 05:46 a 05:55 UTC, 15 achados distintos), com três
estragos plantados no pacote e **3 de 3 vistos**: o achado 1 (o `checkout` preso
por etiqueta e não por resumo) e o achado 11 (a aritmética `449 s de 515 s`) são
as plantas e não existem neste ramo. Da triagem do lugar de direção: o achado 2 é
o passo do diretor depois da fusão (§6), o 6 é o bloco F0.4, o 7 conferiu-se pela
API do GitHub, o 9 é do pacote e não da obra. Os restantes oito são reais e são
esta secção. As linhas do relatório que estavam erradas foram corrigidas onde
estavam, e não só aqui: um relatório que guarda a versão errada no corpo e a
emenda no fim mente a quem lê o corpo.*

### 7.1 O que o fluxo confere, à letra (achado 3)

O fluxo confere **a cabeça de cada push e de cada pedido de integração**, e não
cada commit lá dentro: o GitHub dispara uma corrida por push, e um push com cinco
commits produz uma corrida, sobre o quinto. A regra da casa (os três portões a 0
em cada commit) continua a ser da casa e não passa a ser da máquina: o que a CI
garante é que o que chega a `main` foi conferido, não que cada passo do caminho o
foi.

Duas consequências do desenho, e ambas são propositadas. Primeira: **um vermelho
salta os portões seguintes**. Na corrida da planta o `verify` e o `typecheck`
ficaram `skipped` (§3.3), e é assim que se quer: o primeiro portão que cai é o
que se conserta, e correr os outros por cima de uma construção que não existe
custa minutos e não diz nada. Segunda: **o `cancel-in-progress` cancela a corrida
anterior da mesma referência**. Um segundo push cancela a corrida do primeiro, e
uma corrida cancelada é `cancelled` e não `success`, pelo que não vale como
verificação verde. A corrida que conta para uma verificação obrigatória é sempre
a do resumo que se vai fundir, e é por isso que a fusão em avanço rápido (§4) é o
caminho que fecha: o resumo que chega a `main` é o mesmo que o GitHub viu verde.

### 7.2 A razão da concorrência, corrigida (achado 10)

A primeira redação dizia que sem o `event_name` no grupo a corrida do pedido de
integração cancelava a do push. **Estava errado.** Um push corre em
`refs/heads/<ramo>` e um pedido de integração corre em `refs/pull/<n>/merge`: são
referências distintas, e o `github.ref` sozinho já as separava.

O `event_name` **fica** no grupo, pela razão certa: é explícito, e uma chave que
não depende de saber de cor como o GitHub nomeia as referências dos pedidos não
pode agrupar por acidente dois acontecimentos diferentes se essa nomenclatura
mudar. Não custa nada e não esconde nada. O que sai é a justificação falsa, aqui
e no comentário do ficheiro.

### 7.3 O ambiente preso, e quando se mexe (achado 8)

O `.nvmrc` dizia `22`, que é todos os remendos do maior; o `runs-on` dizia
`ubuntu-latest`, que é a imagem que o GitHub quiser. Um commit verde de hoje
podia correr amanhã noutro Node e noutro sistema sem ninguém decidir nada, e a
primeira passagem já o mostrava sem lhe chamar defeito: o portátil corre
`v22.23.1` e o anfitrião resolveu `v22.23.2`.

* `.nvmrc` → **`22.23.1`** (`od -c .nvmrc` → `2 2 . 2 3 . 1 \n`), o `node -v` do
  portátil. **Quando mudar:** quando o portátil mudar de Node, na mesma passagem
  e com o número medido.
* `runs-on` → **`ubuntu-24.04`**. Não muda nada hoje: as quatro corridas da
  primeira passagem saíram todas em `Image: ubuntu-24.04` (linha do passo «Set up
  job»), que é o que o `ubuntu-latest` resolvia a 02.09.2026. Muda no dia em que
  o GitHub mover o `latest`. **Quando mudar:** por decisão registada, quando a
  casa quiser o maior seguinte, e nunca a meio de um bloco.

O `engines` do `package.json` fica como estava (`>=22.12.0`): diz o mínimo que a
casa aceita, que é outra pergunta.

### 7.4 A prova exige os dois ficheiros (achado 4)

O `if-no-files-found: error` só falha quando **nenhum** dos caminhos casa. Com o
`dist/prova.json` presente e o `dist/cadeia.json` ausente, a subida passava e o
artefacto ficava meio, com o nome de uma prova inteira. A primeira redação dizia
que «com a construção verde os dois ficheiros têm mesmo de estar lá»: era o que
se queria, não o que o ficheiro fazia.

Entra um passo antes da subida:

```yaml
      - name: Os dois ficheiros da prova existem
        if: success()
        run: |
          test -f dist/prova.json
          test -f dist/cadeia.json
```

O `if-no-files-found: error` fica, como segunda rede. Conhecido positivo corrido
no portátil sobre o `dist/` desta árvore, com o mesmo `bash -e` que o GitHub usa
nos passos `run`:

```
os dois presentes                      → GUARDA_A_EXIT=0
dist/cadeia.json escondido             → GUARDA_B_EXIT=1
dist/cadeia.json outra vez no lugar    → GUARDA_C_EXIT=0
```

No estado B o `ls dist/prova.json` continuava a encontrar o ficheiro: é
exatamente o caso em que o `if-no-files-found` sozinho não via nada.

### 7.5 O artefacto é a prova de uma corrida verde (achado 5)

A condição era `if: always() && steps.construcao.outcome == 'success'`, que subia
a prova de uma corrida cuja construção passou e que a seguir morreu no `verify`
ou no `typecheck`. Um ficheiro chamado prova numa corrida vermelha é pior do que
nenhum. Passa a `if: success()` nos dois passos, o do `test -f` e o da subida:
**uma corrida vermelha não deixa artefacto nenhum**, e o registo é a prova do que
falhou.

E há uma coisa que a primeira redação não dizia e é o achado do Codex: **o
`verify` reescreve os dois ficheiros.** O `npm run verify` torna a correr o
`gate:html` e o `check:cadeia` (`package.json`, o `verify` chama os dois), que
são precisamente quem escreve `dist/prova.json` e `dist/cadeia.json`. O que sobe
não é portanto a prova da construção: é **o estado depois dos três portões**, que
é o estado que interessa, porque é esse que corresponde ao verde que a
verificação obrigatória vai ler. O nome do artefacto leva o resumo do commit
(`prova-${{ github.sha }}`), de modo que o ficheiro diz sozinho a que árvore
pertence.

### 7.6 O comentário do tamanho do registo (achado 12)

O comentário do ficheiro dizia «duas mil linhas de saída» e o relatório dizia
11 577 medidas. Ficam as 11 577, com o comando ao lado no próprio comentário
(`gh run view 33592347822 --log | wc -l`).

### 7.7 As três correções no relatório (achados 13, 14 e 15)

* **Achado 13, o nome do passo.** A tabela da §3.1 escrevia
  `Post O Node (guardar a cache)`. O nome que a API dá é `Post O Node`, e o
  relatório diz que os nomes vieram da API: passa a dizer o que veio.
* **Achado 14, um «20 %» para duas subidas diferentes.** Passa a haver o número
  de cada portão: da 1.ª para a 3.ª corrida a construção subiu **+20,3 %** e o
  `verify` **+23,9 %** (os dois juntos +20,9 %); da 1.ª para a 4.ª, **+47,4 %** e
  **+50,0 %**.
* **Achado 15, a conclusão da cache.** A primeira redação concluiu de duas
  corridas sem controlo que a cache do npm custava mais do que poupava. A 4.ª
  corrida desfá-lo: também acertou na cache e fez os dois passos do Node em 8 s,
  contra os 24 s da 3.ª e os 11 s da 1.ª, que estava fria. A conclusão sai e fica
  a medição, em §3.5.

### 7.8 A corrida que prova a segunda passagem

Ramo `ci-2026-09-02`, commit `29b7a5255fd19c9e4d5951e9ebb2087879fe576d`.
**https://github.com/oestadodopais/o-estado-do-pais/actions/runs/33597530623**

Conclusão `success`, à primeira. Total: **10 min 40 s** (640 s), de
`2026-09-02T06:07:52Z` a `2026-09-02T06:18:32Z`.

| # | passo | resultado | segundos |
|---|---|---|---|
| 1 | Set up job | success | 1 |
| 2 | A árvore | success | 10 |
| 3 | O Node | success | 6 |
| 4 | `npm ci` | success | 3 |
| 5 | `npm run build` | success | 506 |
| 6 | `npm run verify` | success | 106 |
| 7 | `npm run typecheck` | success | 0 |
| 8 | **Os dois ficheiros da prova existem** | success | 0 |
| 9 | **A prova desta corrida** | success | 1 |
| 17 | Post O Node | success | 0 |
| 18 | Post A árvore | success | 0 |
| 19 | Complete job | success | 0 |

O que esta corrida prova, linha a linha do registo:

* **O ambiente está preso.** `Image: ubuntu-24.04` no passo «Set up job», e no
  «O Node»: `Attempting to download 22.23.1...`,
  `Acquiring 22.23.1 - x64 from https://github.com/actions/node-versions/releases/download/22.23.1-28070984979/node-22.23.1-linux-x64.tar.gz`,
  `node: v22.23.1`. É a versão exata do portátil, e já não a que o anfitrião
  tivesse à mão. Custa: o passo «O Node» passou de 3 s (a 4.ª corrida, com o
  `22.23.2` já na cache de ferramentas do anfitrião) para 6 s, porque o `22.23.1`
  teve de ser descarregado. Seis segundos numa corrida de 640 s.
* **A guarda dos dois ficheiros corre mesmo.** O passo 8 traz no registo
  `Run test -f dist/prova.json` e `test -f dist/cadeia.json`, as duas linhas.
* **O artefacto leva os dois ficheiros.** Descarregado e aberto:
  `gh run download 33597530623 --dir <pasta>` → `prova-29b7a5255fd19c9e4d5951e9ebb2087879fe576d/`
  com `prova.json` (7 877 bytes) e `cadeia.json` (2 843 bytes); o artefacto tem
  2 646 bytes comprimidos e expira a `2026-09-16T06:18:28Z`. Os dois tamanhos são
  os mesmos dos ficheiros que o `verify` deixou no `dist/` do portátil, o que
  confirma o que a §7.5 diz: o que sobe é o estado depois dos três portões.

O que esta corrida **não** prova, e é honesto separá-lo: que a guarda dos dois
ficheiros fica vermelha quando um falta. Isso não se vê numa corrida verde. Está
provado no portátil pelo conhecido positivo da §7.4 (`GUARDA_B_EXIT=1` com o
`dist/cadeia.json` escondido), com o mesmo `bash -e` e as mesmas duas linhas do
passo. Plantar essa falta numa corrida do GitHub obrigaria a partir um portão da
casa de propósito para o `dist/` sair incompleto, e isso é uma planta de outro
bloco, não deste.
