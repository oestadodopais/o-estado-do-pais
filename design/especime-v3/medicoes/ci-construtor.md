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
  `on: pull_request`. Um ramo com pedido de integração aberto produz duas
  corridas, e é por isso que o grupo de concorrência leva o `event_name`:
  `group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}`,
  com `cancel-in-progress: true`. Sem o `event_name` a corrida do pedido
  cancelava a do push, e a verificação de estado que o diretor vai exigir em
  `main` ficava dependente de qual das duas chegou primeiro.
* **O que pode:** `permissions: contents: read`, e mais nada. Sem escrita, sem
  pacotes, sem `id-token`.
* **Onde corre:** `runs-on: ubuntu-latest`, `timeout-minutes: 30`. A corrida
  verde levou 9 min 35 s (§3), o que deixa a margem larga sem a deixar infinita.
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
  O `.nvmrc` novo diz `22` (`od -c .nvmrc` → `2 2 \n`), e o `engines` do
  `package.json` fica como estava (`>=22.12.0`): o `engines` diz o mínimo que a
  casa aceita, o `.nvmrc` diz o maior em que a casa desenvolve. No anfitrião isso
  resolveu para `node: v22.23.2` (linha do passo «O Node» do registo da corrida).
* **Os três portões, um passo cada:** `npm ci`, `npm run build`,
  `npm run verify`, `npm run typecheck`. Separados para o registo dizer qual caiu
  sem ninguém ter de ler onze mil linhas de saída
  (`gh run view 33592347822 --log | wc -l` → `11577`).
* **A prova de cada construção:** `dist/prova.json` (escrito pelo `gate:html`) e
  `dist/cadeia.json` (escrito pelo `check:cadeia`), guardados 14 dias. Na corrida
  verde: `prova-267d97db4faec412787b40fcb7d9ff0a3baf9382`, 2 646 bytes, a expirar
  em `2026-09-16T05:00:05Z`
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
| 15 | Post O Node (guardar a cache) | success | 05:00:05 | 05:00:07 | 2 |
| 16 | Post A árvore | success | 05:00:07 | 05:00:08 | 1 |
| 17 | Complete job | success | 05:00:08 | 05:00:08 | 0 |

Três coisas que estes números dizem e vale a pena escrever:

1. **A construção é 78 % do tempo da corrida** (449 s de 575 s). O anfitrião é
   mais lento do que o portátil: 449 s contra os 283 s medidos localmente na
   mesma árvore (§1), ou seja **1,59 vezes**. É o número com que se conta antes
   de pôr mais alguma coisa no `build`.
2. **O `typecheck` custa 0 s**, e não é uma vitória: o `tsconfig.check.json` tem
   `checkJs: false`, e por isso o `tsc` abre os ficheiros e não confere nada.
   Medido: `npx tsc -p tsconfig.check.json --listFiles | wc -l` → `729`
   ficheiros, dos quais `729 - 659 = 70` são do projeto e 659 são de
   `node_modules`. É exatamente o buraco que o bloco F0.4 fecha; a CI apenas o
   torna visível a cada push em vez de o esconder.
3. **A cache do npm ainda não pagou nada.** Nas duas corridas desta sessão o
   passo «O Node» escreveu `npm cache is not found`, e a cache só foi guardada no
   fim da primeira (`Cache saved with the key: node-cache-Linux-x64-npm-141a93da…`).
   Os 7 s e os 6 s de `npm ci` são portanto tempos de cache fria; a terceira
   corrida em diante é que começa a poupar.

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
   por referência»; ficou `workflow + event_name + ref`, porque com um grupo só
   por referência a corrida do `pull_request` cancelava a do `push` no mesmo ramo
   e a verificação de estado ficava a depender de qual delas sobrevivia.
2. **O passo do artefacto preso ao resultado da construção**
   (`if: always() && steps.construcao.outcome == 'success'`) com
   `if-no-files-found: error`. As duas metades contam: o `always()` faz com que
   uma corrida que caia no `verify` ou no `typecheck` deixe mesmo assim a prova
   da construção; a condição do passo da construção evita que uma corrida que cai
   antes de haver `dist/` (como a da planta) junte um segundo vermelho falso. E,
   com a construção verde, os dois ficheiros têm mesmo de estar lá, o que é uma
   régua e não um aviso.
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
