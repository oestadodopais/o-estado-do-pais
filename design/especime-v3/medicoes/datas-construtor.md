# F1.4b · as datas de publicação, e o espaço entre o número e a palavra · relatório do construtor

*Ramo `datas-2026-09-04`, tirado de `origin/main` em `69ba3abf`. Construtor
Claude Opus 5, 04.09.2026. É uma correção urgente do bloco F1.4
(`nomes-construtor.md`, item 8 e §10), e não um bloco novo: o âmbito é o defeito
e mais nada. Sem travessões na prosa.*

## 0 · Estado ao pausar (04.09)

*O diretor fechou o portátil. Este bloco está **inteiro e commitado**; o que
falta é a confirmação da CI e a decisão da fusão, que é dele.*

**Cabeça: `fb0d79b337b3246c5a29f3c0b2b444eb2355d572` (`fb0d79b3`)**, no ramo
`datas-2026-09-04`, empurrado. A árvore está limpa e não há nada por commitar.

**Os três portões correram nesta cabeça, na máquina, e deram 0**: `npm run build`
(0), `npm run verify` (0), `npm run typecheck` (0), com as saídas lidas de
ficheiro de registo. A secção 0 que está a ler é a única coisa que entrou depois
deles, e é prosa num relatório: dos passos da cadeia, os únicos que lêem
`design/` são o `check:ledger` (os selos sha256) e o `check:voz` (o inventário
das frases e o registo das revisões), e nenhum deles lê `medicoes/`. Os dois
foram corridos outra vez com esta secção escrita, e deram 0.

**O `portao` no GitHub: corrida `33861077107`, aberta às 10:00 UTC, ainda a
correr quando esta secção foi escrita.** Não ficou confirmada. Antes de fundir,
`gh run view 33861077107` tem de dizer `success` na cabeça `fb0d79b3` (e a
corrida seguinte, se esta secção acrescentou uma).

### O que está feito, item a item

| # | o item | estado |
| --- | --- | --- |
| 1 | `scripts/datas-de-publicacao.mjs`, com a origem declarada no cabeçalho, a recusa em cópia rasa, e o JSON commitado com slug, língua, data, commit e caminho | **feito**, e corrido nesta árvore: 16 edições, 0 sem commit de adição |
| 2 | a construção lê o JSON e nunca chama o `git`; uma edição ausente do JSON fica com `[a verificar]` | **feito** (`src/lib/datas-do-repositorio.mjs`, com guarda de execução e prova) |
| 3 | o portão recusa páginas que discordem do JSON, e o JSON que discorde do `git` quando há história; com história rasa confia no ficheiro e di-lo no registo | **feito** (`scripts/check-datas.mjs`, na cadeia do `build` e do `verify`), com os três estragos plantados apanhados e o caminho da cópia rasa corrido num clone raso |
| 4 | a caixa «Datas de publicação por confirmar.» só aparece se alguma edição não tiver data, e conta-as | **feito**; hoje as dezasseis têm data e a caixa não se rende, e as duas frases passaram a «retirada» no inventário da voz |
| 5 | o script corrido nesta árvore, o JSON commitado, as dezasseis datas contra o que estava no ar e contra `studies.mjs` | **feito** (§3) |
| 6 | os números colados na primeira página («308concelhos») | **feito** (§4): causa medida no navegador, correção numa linha de marcação em `Portas.astro`, régua I11 com o defeito plantado |

### O que fica por fazer, e por quem

1. **Confirmar o `portao` na corrida `33861077107`** (ou na seguinte). É a única
   coisa que falta para o ramo estar pronto a fundir. Se ficar vermelha, o
   registo da corrida diz em que passo, e os três portões locais estão verdes
   nesta mesma cabeça.
2. **Fundir e lançar** é do diretor. Enquanto não lançar, o defeito das datas
   continua no ar: a exposição conta desde as 04:41 UTC de 04.09 e ainda não
   fechou (I113).
3. **Um projecto vazio a mais no Vercel, criado por engano por este construtor.**
   Ao tentar ler o estado do lançamento com `vercel ls`, o CLI ligou a worktree a
   um projecto NOVO com o nome do ramo, `datas-2026-09-04` (sem lançamentos, sem
   URL de produção). O `.vercel/` local foi apagado; o projecto **fica lá**,
   porque apagar é irreversível e as definições do Vercel são do diretor. É de
   apagar quando ele quiser. **Nada do sítio foi tocado**: o projecto
   `o-estado-do-pais` ficou como estava.

### Nada ficou a meio

Não há trabalho pela metade neste ramo, e por isso não houve nada a desfazer: a
única coisa que não está feita é esperar pela CI e fundir, e as duas são de quem
lê isto.

## 1 · O que estava no ar, e porquê

**O sítio publicado dizia, nos doze trabalhos de `/estudos`, «PUBLICADO A
04.09.2026».** Ao lado, uma caixa dizia «Datas de publicação por confirmar.» e as
linhas das edições diziam «ÚLTIMA ATUALIZAÇÃO: 20.08.2026». Uma data errada numa
página pública é a coisa que esta casa não pode fazer, e esta estava errada de
uma maneira particularmente má: era a data de HOJE, em todos, por baixo de uma
ressalva que dizia que nenhuma data estava confirmada.

O F1.4 calculava a data de cada edição **na construção**:

```
git log --diff-filter=A --format=%ad --date=short -- studies-src/<slug>/<lang>.html
```

A CI da casa pede `fetch-depth: 0` e vê a história inteira: nela o comando
responde `2026-08-12`. A Vercel constrói a produção de uma **cópia rasa**, e numa
cópia rasa o commit de agosto que acrescentou o ficheiro não existe. O comando
não falha: responde o commit mais antigo que a cópia tem, que é a fronteira do
clone.

**A causa foi reproduzida, e não deduzida.** Num clone raso feito para este
relatório (`git clone --depth 1`, 1 commit):

```
$ git rev-parse --is-shallow-repository
true
$ git rev-list --count HEAD
1
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/onde-esta-a-agua/pt.html
2026-09-04 69ba3abf4def15dfd86ab70a6d73e9938814981a
```

`69ba3abf` é a cabeça de `main` de hoje, e `2026-09-04` é exactamente a data que
a página publicada mostrava. A leitura certa, na árvore com história, é
`2026-08-12 b4f45d3f`.

**A lição não é «pedir história à Vercel».** As definições do serviço são do
diretor, e uma construção cuja correção depende do ambiente parte-se sozinha
outra vez. A lição é que **um facto do repositório mede-se uma vez, onde a
história está, e viaja escrito**.

**E há uma segunda lição, sobre as réguas.** A célula I9 de
`tests/livro/indice.mjs` já refazia esta leitura por conta própria, e estava
verde: corre na CI, onde a história é completa, isto é, no único ambiente em que
o defeito não acontece. Uma régua que mede o ambiente em que a coisa funciona
não é uma régua. É por isso que o portão novo deste bloco entra na cadeia do
`build`, e não só na do `verify`: **corre na Vercel**, que é onde o defeito
nasceu.

## 2 · O que passou a ser

### 2.1 · A medição sai da construção (`scripts/datas-de-publicacao.mjs`, novo)

Corre à mão, numa árvore com história completa, e escreve
`src/data/datas-de-publicacao.json`, que entra no commit. Por edição: `slug`,
`lang`, `data`, `commit` (o resumo completo do commit que acrescentou o ficheiro)
e `ficheiro`. **Declara a origem no cabeçalho do próprio ficheiro** (`origem.comando`,
`origem.o_que_e`, `origem.o_que_nao_e`, `origem.como_refazer`), e o cabeçalho do
script escreve por extenso o defeito de que nasceu.

**Recusa-se a correr numa cópia rasa**, que é o ponto: é exactamente aí que
escreveria as datas erradas. Provado num clone raso de verdade, com a mensagem a
dizer o que fazer (`git fetch --unshallow`) e a garantia de que nada foi escrito.

**Uma edição sem commit de adição não entra no ficheiro.** Não se escreve `null`:
a ausência de linha é a ausência de facto, e a página volta ao marcador
`[a verificar]`. E o script é idempotente por decisão (nenhum carimbo de hora),
para que correr duas vezes sobre a mesma história dê o mesmo ficheiro byte a
byte.

### 2.2 · A construção lê o ficheiro e nunca chama o `git` (`src/lib/datas-do-repositorio.mjs`)

A mesma superfície de antes (`dataDaEdicaoNoRepositorio(slug, lang)`), outra
fonte. O `execFileSync` saiu. O ficheiro passa por um guarda de execução
(`eDatasDePublicacao` / `eDataDeEdicao`, com prova em `scripts/provar-guardas.mjs`):
um JSON estragado fecha a construção com a frase do que falta, em vez de pintar
dezasseis marcadores em silêncio.

### 2.3 · A caixa das datas por confirmar passa a ser verdade (`EstudosView.astro`)

Rende-se **se e só se** alguma edição não tem data, e **conta-as**: «Datas de
publicação por confirmar em N edições». Hoje as dezasseis têm data e a caixa não
se rende. As duas frases antigas passaram a `retirada` no `INVENTARIO-FRASES.md`,
com a razão escrita, porque uma linha `viva` que não se rende é o inventário a
mentir sobre o sítio (e o `check:voz` fecha a construção por isso, como deve).

### 2.4 · O portão (`scripts/check-datas.mjs`, novo; `build` e `verify`)

Três contas, e nenhuma confia na anterior:

| # | o quê | quando |
| --- | --- | --- |
| 1 | cada data impressa em `dist/` com `data-nonledger="data-do-repositorio"` é uma data que o ficheiro declara, e cada edição do ficheiro tem a sua data impressa na sua página | sempre |
| 2 | a caixa rende-se se e só se há edições sem data, e o N é o número delas, recontado do arquivo e do ficheiro | sempre |
| 3 | data e commit de cada edição refeitos do `git`, e nenhuma edição da árvore com commit de adição pode faltar ao ficheiro | só com história completa |

**Numa cópia rasa a conta 3 não se faz, e o passo escreve no registo da
construção que confiou no ficheiro, e porquê.** É a diferença entre uma conta que
não se pôde fazer e uma conta que passou.

**Os três positivos conhecidos foram plantados e apanhados** (regra 14):

| estrago plantado | o que o portão disse | saída |
| --- | --- | --- |
| a data de uma edição trocada no JSON para `2026-09-04` | «a página não imprime essa data» **e** «o `git` diz 2026-08-12» | 1 |
| a data trocada na página construída para `04.09.2026` (o defeito que esteve no ar) | «a página imprime «04.09.2026» … e o ficheiro não a declara em edição nenhuma» | 1 |
| uma edição retirada do JSON | «1 edição(ões) sem data … e a página mostra 0 caixa(s) de aviso» **e** «o `git` diz que esta edição entrou a 2026-08-12 e o ficheiro não a declara» | 1 |

E o caminho da cópia rasa foi corrido num clone raso de verdade, com o `dist/`
das páginas de trabalho copiado para lá: linha de registo a dizer «RASA», contas
1 e 2 feitas, saída 0.

### 2.5 · A régua I9 confere o ficheiro (`tests/livro/indice.mjs`)

A I9 continua a refazer a leitura do `git` por conta própria, e passa a comparar
o ficheiro com esse mesmo `git`, entrada a entrada (data e commit), nos dois
sentidos: uma edição da árvore que falte ao ficheiro, e uma linha do ficheiro sem
ficheiro na árvore. Um ficheiro que ninguém volta a conferir envelhece em
silêncio, e essa é a dívida que a saída deste bloco cria.

## 3 · As dezasseis datas, contra o que estava no ar

Doze trabalhos, dezasseis edições. `date` é o campo de `src/data/studies.mjs`,
que o arquivo declara por confirmar; a coluna do meio é o que a página publicada
mostrava esta manhã.

| trabalho (edição) | no ar (04.09) | a data medida | commit | `date` em `studies.mjs` |
| --- | --- | --- | --- | --- |
| agua-nao-faturada (pt) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |
| agua-nao-faturada (en) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |
| alentejo-algarve (en) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |
| avaliacao-economica-regional-de-portugal-2026 (pt) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |
| evolucao-de-portugal-desde-1981 (pt) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |
| evora-economia-investidores-portas-abertas-2026 (pt) | 04.09.2026 | **12.08.2026** | `f30cf277` | `null` |
| evora-orcamentado-pago-devido-2025 (pt) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |
| evora-orcamentado-pago-devido-2025 (en) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |
| evora-os-pelouros-quem-os-teve-o-que-fizeram (pt) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `2026-08-12` |
| evora-prometido-pago-auditado-2026 (pt) | 04.09.2026 | **15.08.2026** | `ec152217` | `2026-08-04` |
| evora-prometido-pago-auditado-2026 (en) | 04.09.2026 | **15.08.2026** | `ec152217` | `2026-08-04` |
| evora-quinze-anos-cinco-mandatos (pt) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |
| onde-esta-a-agua (pt) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |
| onde-esta-a-agua (en) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |
| penalizacoes-por-reforma-antecipada-2026 (pt) | 04.09.2026 | **24.08.2026** | `5cb083ed` | `null` |
| which-door-is-yours (en) | 04.09.2026 | **12.08.2026** | `b4f45d3f` | `null` |

**Três leituras deste quadro.**

Primeira: **as dezasseis estavam erradas, e todas diziam a mesma coisa: o dia da
construção.** A distância à data certa é que é de cada uma, e não uma só (frase
corrigida na segunda passagem, 07.09, leitura a frio do Codex, Minor 12): treze
edições entraram a 12.08 e estavam 23 dias adiantadas, duas entraram a 15.08 e
estavam 20 dias, e uma entrou a 24.08 e estava 11. O que era comum era a origem
do erro (o `git` a responder com a fronteira da cópia rasa), e não o número de
dias.

Segunda: **as três edições que `studies.mjs` datava não coincidem todas com a
data do repositório, e isso está certo.** `evora-os-pelouros` bate ao dia
(`2026-08-12`). As duas de `evora-prometido-pago-auditado-2026` declaram
`2026-08-04` e o ficheiro entrou aqui a **15.08.2026**: são duas afirmações
diferentes, e a página diz a segunda, com a origem dita
(`data-nonledger="data-do-repositorio"`, «publicado a …», e não «Publicação: …»).
O arquivo continua a escrever no seu cabeçalho que nenhuma data de publicação
está confirmada; **este bloco não confirma nenhuma**, e não mexeu numa linha de
`src/data/studies.mjs`.

Terceira: **treze das dezasseis levam `date: null`** e ganharam superfície pela
primeira vez com o F1.4. A dívida de saber onde e quando cada trabalho foi
publicado continua aberta, e é do diretor.

## 4 · O segundo defeito: «308concelhos» a 390

Um leitor viu, na primeira página do telemóvel, **«308concelhos»** e
**«12trabalhos ·16edições»**. A 1280 os espaços estavam lá.

**A causa, medida no navegador e não deduzida.** O espaço ESTÁ no HTML: vem
dentro das próprias cadeias de `src/i18n/strings.mjs` (`' concelhos'`,
`' trabalhos · '`, `' edições'`), e o `textContent` mostra-o. Quem o apagava era a
rendição. `src/styles/inicio.css`, na `@media (max-width: 1023px)` que o F1.7
alargou pela I104, põe `.porta-conta { display: flex }`. **Num contentor
flexível cada corrida de texto solto vira um item anónimo, e o CSS apara o espaço
no princípio e no fim de cada item.** Medido, com o `dist/` desta árvore:

| largura | `display` de `.porta-conta` | `textContent` | `innerText` (o que se rende) |
| --- | --- | --- | --- |
| 390 | `flex` | `308 concelhos` | `308⏎concelhos` |
| 1280 | `block` | `308 concelhos` | `308 concelhos` |

A linha da agenda nunca teve o defeito, e a razão explica a correção: cada
contagem dela já vivia dentro de um `.porta-conta-item`, e por isso o par número
mais palavra era **um** item, com o espaço no meio dele.

**A correção é essa caixa, nas outras duas portas**, e só ela:
`src/components/inicio/Portas.astro`, o par número mais palavra embrulhado no
`.porta-conta-item` que a folha já define. **Não se tocou em
`src/styles/inicio.css`** (bloco F1.1c) nem em nenhuma regra de CSS: a mudança
é de marcação, num ficheiro só, e vale nas duas edições.

**A régua nova (I11, `tests/livro/indice.mjs`, com `--navegador`) não lê texto:
mede.** Para cada contagem, o vão entre a borda direita da caixa do número e a
primeira letra que vem a seguir, com um `Range` de um carácter, a 390. Um espaço
rendido a 13px vale uns 3,5px; um aparado vale zero.

**E tem o positivo conhecido plantado na própria página**: com
`.porta-conta-item { display: contents }` as caixas desaparecem e o texto volta a
ser item anónimo, que é exactamente o defeito que esteve no ar. Medido:

| rota | contagens | vão mínimo | com o defeito plantado |
| --- | --- | --- | --- |
| `/` | 7 | 2,59 px | 7 de 7 apanhadas |
| `/en/` | 7 | 2,59 px | 7 de 7 apanhadas |

## 5 · O que não se fez, e porquê

- **Não se mexeu na Vercel.** As definições do serviço são do diretor, e a
  correção não devia depender delas: a construção passa a dar a mesma resposta
  com ou sem história.
- **Não se confirmou nenhuma data de publicação.** `src/data/studies.mjs` não foi
  tocado, e o que a página diz continua a ser o dia em que o ficheiro entrou
  neste repositório, com a origem dita.
- **Não se verificou a hora do lançamento do F1.4 na fonte.** O `vercel ls`
  desta árvore não fala com o projecto do sítio (liga-se ao nome do ramo). A hora
  que a I113 regista é a do brief do diretor; a corroboração que esta árvore tem
  é o commit `cad7dc29` do F1.4, de 04.09 às 03:34 UTC, e a cabeça `69ba3abf`,
  que é o commit que o clone raso desta manhã devolvia como data de todas as
  edições.
- **Não se fundiu nada em `main`.** A fusão e o lançamento são do diretor.

## 6 · Segunda passagem (07.09)

*Ramo `datas-b-2026-09-07`, tirado de `origin/main` em `cc79128e`. Construtor
Claude Opus 5, 07.09.2026. O bloco fundiu-se em `main` a 04.09 antes da leitura a
frio, por excepção (`DECISIONS.md` §1.99); a leitura do Codex correu a 07.09
(`design/especime-v3/critica/2026-09-07-codex-leitura-f14b-datas.md`) e o que ela
encontrou de real entra por aqui. A triagem do lugar de direcção está no
cabeçalho dessa leitura, e esta secção segue-a item a item, com o comando, o
antes e o depois de cada um.*

### 6.0 · O que era planta do pacote de leitura, e ficou confirmado

O pacote que foi ao leitor levava cinco estragos plantados. Quatro dos achados
saem deles, e o código de `main` está certo nesses pontos. Conferido nesta
árvore, sem mudar nada por causa deles:

| achado | o que a leitura viu | o que `main` tem |
| --- | --- | --- |
| Blocking 1 | `04.09.2026` na linha de `evora-economia-investidores-portas-abertas-2026` no índice construído | a planta P4. O `dist/` desta árvore imprime `12.08.2026` nessa linha, e o portão passa a verde |
| Blocking 2 | a terceira conta invertida (`raso === 'true'`) | a planta P1a e P1b. `scripts/check-datas.mjs` tem `const comHistoria = raso === 'false'`, e a corrida na cópia rasa de hoje escreve a linha «RASA» e salta a conta 3 (§6.5) |
| Major 4 | a I9 a comparar só o ano (`declarada.data.slice(0, 4)`) | a planta P2. `tests/livro/indice.mjs` compara a data inteira (`declarada.data !== data`) e o commit inteiro |
| Major 7 | `14.08.2026` na edição inglesa de `evora-prometido-pago-auditado-2026` | a planta P3. A tabela do §3 diz `15.08.2026` nas duas edições, e o `git` desta árvore também (§6.5) |
| Minor 11 | o relatório copiado sem `medicoes/datas-construtor.md` | é do pacote: o ficheiro está no repositório desde `fb0d79b3`, e é este |

### 6.1 · Major 3 · cada data impressa presa à SUA edição

**O que estava errado.** A conta 1a pergunta se a data impressa pertence ao
CONJUNTO das datas declaradas. A conta 1b antiga só olhava à página da edição, e
fazia `continue` em silêncio quando uma página não tinha a marca. As linhas dos
dois índices imprimem a data de cada trabalho e nenhuma das duas contas as
prendia à edição certa.

**O que passou a ser.** Cada data impressa vai presa à sua edição, em todas as
páginas que a imprimem, nas duas edições do sítio: nos índices pela porta de cada
edição (`a.badge-porta`, cujo `href` dá o slug e a língua), nas páginas dos
trabalhos pelo bloco `.edicao` (cujo `.badge` dá a língua e cuja rota dá o slug).
A conta 1b passa a percorrer também as páginas SEM a marca cuja rota imprime
datas, conta quantas conferiu e quantos laços fez, e falha se conferir zero. Uma
data impressa que nenhuma edição prenda é uma falha, e uma página com a marca
numa rota que o passo não conhece é outra.

**A planta, e as duas saídas.** Numa linha do índice português, a data de
`evora-prometido-pago-auditado-2026` trocada de `15.08.2026` por `12.08.2026`,
que é OUTRA data declarada no ficheiro.

```
$ node scripts/check-datas.mjs      # o portão como estava em cc79128e
check-datas: história completa · 16 edição(ões) do ficheiro refeitas do `git`.
check-datas · 16 edição(ões) datadas, 56 data(s) impressa(s) em 26 página(s), 0 edição(ões) sem data e nenhuma caixa de aviso.
$ echo $?
0
```

```
$ node scripts/check-datas.mjs      # o portão desta passagem
check-datas: história completa · 16 edição(ões) do ficheiro refeitas do `git`.
check-datas: 2 falha(s).
  · /estudos: a linha de evora-prometido-pago-auditado-2026, na porta PT imprime «12.08.2026» e src/data/datas-de-publicacao.json diz que evora-prometido-pago-auditado-2026 (pt) entrou a 15.08.2026 (commit ec152217). Uma data que pertence ao conjunto das declaradas mas NÃO a esta edição é o que a conta 1a sozinha deixava passar.
  · /estudos: a linha de evora-prometido-pago-auditado-2026, na porta EN imprime «12.08.2026» e src/data/datas-de-publicacao.json diz que evora-prometido-pago-auditado-2026 (en) entrou a 15.08.2026 (commit ec152217). Uma data que pertence ao conjunto das declaradas mas NÃO a esta edição é o que a conta 1a sozinha deixava passar.
$ echo $?
1
```

**A segunda planta, a do silêncio.** `/estudos/onde-esta-a-agua` deixa de
imprimir as duas datas, e a página fica sem a marca.

```
$ node scripts/check-datas.mjs      # o portão como estava em cc79128e
check-datas: história completa · 16 edição(ões) do ficheiro refeitas do `git`.
check-datas · 16 edição(ões) datadas, 54 data(s) impressa(s) em 25 página(s), 0 edição(ões) sem data e nenhuma caixa de aviso.
$ echo $?
0
```

```
$ node scripts/check-datas.mjs      # o portão desta passagem
check-datas: história completa · 16 edição(ões) do ficheiro refeitas do `git`.
check-datas: 2 falha(s).
  · /estudos/onde-esta-a-agua: o bloco da edição PT não imprime data nenhuma e src/data/datas-de-publicacao.json declara 12.08.2026 (commit b4f45d3f) para onde-esta-a-agua (pt).
  · /estudos/onde-esta-a-agua: o bloco da edição EN não imprime data nenhuma e src/data/datas-de-publicacao.json declara 12.08.2026 (commit b4f45d3f) para onde-esta-a-agua (en).
$ echo $?
1
```

**A terceira planta, a das contagens da própria conta.** Um `dist/` sem os
índices e sem as páginas dos trabalhos, com uma só página a imprimir uma data
numa rota desconhecida. O portão antigo já ficava vermelho, mas pela conta 2 (a
caixa); o desta passagem diz que a conta 1b não mediu nada:

```
$ node scripts/check-datas.mjs      # o portão desta passagem
check-datas: história completa · 16 edição(ões) do ficheiro refeitas do `git`.
check-datas: 21 falha(s).
  · /qualquer: imprime uma data com a marca `data-nonledger="data-do-repositorio"` e este passo não sabe a que edição a prender. A primeira passagem saltava em silêncio as páginas que não conhecia, e uma data que ninguém prende é uma data que ninguém confere.
  · de 1 página(s) de `dist/`, nenhuma foi conferida edição a edição: não há índice (/estudos, /en/studies) nem página de trabalho. Sem um positivo conhecido a conta 1b não mede nada.
  · 0 página(s) conferida(s) e nenhuma data presa a uma edição: a conta 1b percorreu-as e não prendeu nada.
  · studies-src/agua-nao-faturada/pt.html: src/data/datas-de-publicacao.json declara 12.08.2026 (commit b4f45d3f) e nenhuma página construída imprime essa data presa a esta edição.
  … e mais 17 linha(s)
$ echo $?
1
```

**E o verde, sem plantas:**

```
$ node scripts/check-datas.mjs
check-datas: história completa · 16 edição(ões) do ficheiro refeitas do `git`.
check-datas · 16 edição(ões) datadas, 56 data(s) impressa(s) em 26 página(s), 64 laço(s) data-edição em 26 página(s) conferida(s), 0 edição(ões) sem data e nenhuma caixa de aviso.
$ echo $?
0
```

Os 64 laços são as dezasseis edições presas duas vezes nos dois índices (32) e
uma vez em cada uma das 24 páginas de trabalho, que listam todas as edições do
seu trabalho (32).

### 6.2 · Major 5 · um erro do `git` não é a ausência de um facto

**O que estava errado.** `scripts/datas-de-publicacao.mjs` apanhava qualquer
excepção do `git log` de uma edição e punha `linhas = []`, que o resto do script
lê como «esta edição não tem commit de adição». O script seguia, e escrevia por
cima do ficheiro commitado um resultado parcial, com saída 0.

**A planta.** Um `git` posto à frente no `PATH` que responde a tudo e falha só no
`log` de `studies-src/onde-esta-a-agua/pt.html`, com código 128.

```
$ PATH=<a planta>:$PATH node scripts/datas-de-publicacao.mjs   # o script como estava
datas-de-publicacao · 15 edição(ões) com data, 1 sem commit de adição (studies-src/onde-esta-a-agua/pt.html)
  src/data/datas-de-publicacao.json escrito
  b4f45d3f  2026-08-12  agua-nao-faturada (pt)
  … e mais 14 linha(s)
$ echo $?
0
$ node -e "..."          # edições escritas no ficheiro
15
$ git diff --stat -- src/data/datas-de-publicacao.json
 src/data/datas-de-publicacao.json | 7 -------
 1 file changed, 7 deletions(-)
```

Quinze linhas escritas, uma apagada em silêncio, e o ficheiro commitado por cima.

```
$ PATH=<a planta>:$PATH node scripts/datas-de-publicacao.mjs   # o script desta passagem
datas-de-publicacao: o `git` falhou em studies-src/onde-esta-a-agua/pt.html.
  `git log --diff-filter=A --format=%ad %H --date=short -- studies-src/onde-esta-a-agua/pt.html`
  saiu com 128: fatal: unable to read tree (planta do F1.4b, segunda passagem)

  Um erro do `git` NÃO é a prova de que esta edição não tem commit de adição, e
  escrever o ficheiro sem ela apagava uma data que está medida e commitada. Nada foi
  escrito: src/data/datas-de-publicacao.json fica como está.
$ echo $?
1
$ git diff --stat -- src/data/datas-de-publicacao.json
(nada: o ficheiro não foi tocado)
```

E sem a planta, o script continua a dar o mesmo ficheiro byte a byte:

```
$ node scripts/datas-de-publicacao.mjs
datas-de-publicacao · 16 edição(ões) com data, 0 sem commit de adição
  src/data/datas-de-publicacao.json sem mudança
  b4f45d3f  2026-08-12  agua-nao-faturada (pt)
  … e mais 15 linha(s)
$ git diff --stat -- src/data/datas-de-publicacao.json
(nada)
```

Ficou também a distinção que faltava do outro lado: uma saída limpa e vazia é
ausência legítima, e diz-se no registo com o nome da edição; e uma saída com
código 0 que o script não sabe ler (o formato a mudar por baixo da medição)
também pára, em vez de virar ausência.

### 6.3 · Major 8 · o guarda exige um dia do calendário e chaves únicas

**O que estava errado.** `eDataDeEdicao` lia a data por `/^\d{4}-\d{2}-\d{2}$/`,
e `2026-99-99` passava; `eDatasDePublicacao` conferia cada linha por si e não
conferia a lista, de modo que duas linhas com o mesmo `slug/lang` passavam e o
`Map` da construção guardava só a última.

**O que passou a ser.** A data tem de voltar de `Date` como o mesmo dia com que
entrou (é o que recusa `2026-99-99` e `2026-02-30` sem escrever uma tabela de
meses), e a lista não pode ter duas linhas com a mesma chave. A chave subiu para
o topo do módulo, para que o guarda e o mapa da construção usem a MESMA.

**As provas, em `scripts/provar-guardas.mjs`:** cinco casos novos
(`eDataDeEdicao/dia-que-nao-existe`, `/30-de-fevereiro`, `/dia-real`,
`eDatasDePublicacao/chave-repetida`, `/mesmo-trabalho-outra-lingua`), com os dois
positivos ao lado dos negativos.

```
$ node scripts/provar-guardas.mjs   # com as provas novas e o guarda como estava
  guardas · 67 conferência(s) sobre os guardas de execução do bloco F0.4
  OS GUARDAS NÃO PASSAM · 3 caso(s):
    ✗ eDataDeEdicao/dia-que-nao-existe: esperava RECUSADO e foi ACEITE.
        o mês 99 e o dia 99 passavam no padrão de algarismos e não são um dia do calendário.
    ✗ eDataDeEdicao/30-de-fevereiro: esperava RECUSADO e foi ACEITE.
        fevereiro de 2026 tem 28 dias: uma data que o calendário não tem não é a data de um commit.
    ✗ eDatasDePublicacao/chave-repetida: esperava RECUSADO e foi ACEITE.
        duas linhas para onde-esta-a-agua (pt): o mapa da construção guardava só a última.
$ echo $?
1
```

```
$ node scripts/provar-guardas.mjs   # com o guarda desta passagem
  guardas · 67 conferência(s) sobre os guardas de execução do bloco F0.4
  ✓ cada guarda recusa o que promete recusar e aceita o que promete aceitar.
$ echo $?
0
```

### 6.4 · Minor 10 · a I11 exige os pares todos, e o defeito plantado em todos

**O que estava errado.** A célula exigia UM par medido e UM par apanhado. Um par
em sete deixava-a verde.

**O que passou a ser.** A função que corre dentro da página passa a devolver
também o número de contagens que a página tem (`.porta-conta [data-prova]`,
contado da própria página e não escrito à mão). A célula exige que os pares
medidos sejam tantos quantas as contagens, e que o defeito plantado seja apanhado
em TODOS, e não em algum.

**A primeira planta:** na primeira página construída, a contagem `308` fica sem a
palavra que vem a seguir. Sete contagens, seis pares.

```
$ node tests/livro/indice.mjs --navegador   # a célula como estava
  ✓ I11 · o espaço entre o número e a palavra, a 390
        /: 6 contagem(ns), vão mínimo 2.59px · com o defeito plantado, 6 de 6 apanhada(s) · /en/: 7 contagem(ns), vão mínimo 2.59px · com o defeito plantado, 7 de 7 apanhada(s)
```

```
$ node tests/livro/indice.mjs --navegador   # a célula desta passagem
  ✗ I11 · o espaço entre o número e a palavra, a 390
        /: 6 par(es) medido(s) para 7 contagem(ns), vão mínimo 2.59px · com o defeito plantado, 6 de 6 apanhada(s) · /en/: 7 par(es) medido(s) para 7 contagem(ns), vão mínimo 2.59px · com o defeito plantado, 7 de 7 apanhada(s)
        · /: a página tem 7 contagem(ns) em `.porta-conta` e a régua mediu 6 par(es) número-palavra. Uma contagem que fica sem par não é medida, e uma régua que se dá por satisfeita com um par não cobre a página.
        · /: com o defeito plantado a régua mediu 6 par(es) e a página tem 7 contagem(ns). A planta não pode fazer desaparecer pares da medição: o que ela muda é o vão, não o que se mede.
```

**A segunda planta, na própria régua:** o estrago plantado estreitado para
`.porta-conta .porta-conta-item:first-child{display:contents}`, que atinge quatro
das sete contagens.

```
$ node tests/livro/indice.mjs --navegador   # a célula como estava
  ✓ I11 · o espaço entre o número e a palavra, a 390
        /: 7 contagem(ns), vão mínimo 2.59px · com o defeito plantado, 4 de 7 apanhada(s) · /en/: 7 contagem(ns), vão mínimo 2.59px · com o defeito plantado, 4 de 7 apanhada(s)
```

```
$ node tests/livro/indice.mjs --navegador   # a célula desta passagem
  ✗ I11 · o espaço entre o número e a palavra, a 390
        /: 7 par(es) medido(s) para 7 contagem(ns), vão mínimo 2.59px · com o defeito plantado, 4 de 7 apanhada(s) · /en/: 7 par(es) medido(s) para 7 contagem(ns), vão mínimo 2.59px · com o defeito plantado, 4 de 7 apanhada(s)
        · /: com o defeito plantado (`.porta-conta-item{display:contents}`, que devolve o texto a item anónimo) a régua apanhou 4 de 7 par(es). Tinha de apanhar todos: um par apanhado em sete deixava-a verde sobre uma página inteira por medir, e uma régua assim não prova nada.
        · /en/: com o defeito plantado (`.porta-conta-item{display:contents}`, que devolve o texto a item anónimo) a régua apanhou 4 de 7 par(es). Tinha de apanhar todos: um par apanhado em sete deixava-a verde sobre uma página inteira por medir, e uma régua assim não prova nada.
```

**A saída da célula fica guardada**, como os outros blocos guardam as suas
medidas, em `design/especime-v3/medicoes/datas-i11.json`. As duas linhas que a
escreveram:

```
node tests/livro/indice.mjs --navegador --json /tmp/f14b2-indice.json
node -e "const fs=require('fs'); const j=JSON.parse(fs.readFileSync('/tmp/f14b2-indice.json','utf8')); const c=j.celulas.find((x)=>x.id==='I11'); fs.writeFileSync('design/especime-v3/medicoes/datas-i11.json', JSON.stringify({origem:{...}, celula:c, medida:j.medida.I11}, null, 2)+'\n')"
```

| rota | contagens | pares medidos | vão mínimo | com o defeito plantado |
| --- | --- | --- | --- | --- |
| `/` | 7 | 7 | 2,59 px | 7 de 7 apanhadas |
| `/en/` | 7 | 7 | 2,59 px | 7 de 7 apanhadas |

### 6.5 · Major 6 e Major 9 · as dezasseis linhas do `git`, e as saídas guardadas

A leitura não podia refazer nenhuma das dezasseis medições porque o pacote não
levava a história do repositório. A parte real do achado é que o relatório as
cite. **São estas, tal como saem nesta árvore, que tem a história completa**
(831 commits, `git rev-parse --is-shallow-repository` a dizer `false`); a linha
que conta é a mais antiga, e cada um destes ficheiros tem exactamente um commit
de adição:

```
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/agua-nao-faturada/pt.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/agua-nao-faturada/en.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/alentejo-algarve/en.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/avaliacao-economica-regional-de-portugal-2026/pt.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/evolucao-de-portugal-desde-1981/pt.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/evora-economia-investidores-portas-abertas-2026/pt.html
2026-08-12 f30cf277e17c0af8c6096f53fd55d8cda573acf5
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/evora-orcamentado-pago-devido-2025/pt.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/evora-orcamentado-pago-devido-2025/en.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/evora-os-pelouros-quem-os-teve-o-que-fizeram/pt.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/evora-prometido-pago-auditado-2026/pt.html
2026-08-15 ec152217f0ab7a8490b49cede57886e07f14c8cd
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/evora-prometido-pago-auditado-2026/en.html
2026-08-15 ec152217f0ab7a8490b49cede57886e07f14c8cd
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/evora-quinze-anos-cinco-mandatos/pt.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/onde-esta-a-agua/pt.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/onde-esta-a-agua/en.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/penalizacoes-por-reforma-antecipada-2026/pt.html
2026-08-24 5cb083eda12859ca40558dd68dde4e457a010c27
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/which-door-is-yours/en.html
2026-08-12 b4f45d3f2d02e941dc393bfbc06868c223e35887
```

Batem, uma a uma, com `src/data/datas-de-publicacao.json` e com a tabela do §3.
Nas duas edições de `evora-prometido-pago-auditado-2026` o `git` diz `2026-08-15`
e não `2026-08-14`: o `14.08.2026` do pacote de leitura era a planta P3.

**O caminho da cópia rasa, corrido hoje num clone raso de verdade**
(`git clone --depth 1 file://<esta árvore>`, 1 commit), com as páginas dos
trabalhos e os dois índices copiados para lá. Primeiro, o defeito original
reproduzido outra vez, agora com a cabeça de hoje:

```
$ git rev-parse --is-shallow-repository
true
$ git rev-list --count HEAD
1
$ git log --diff-filter=A --format='%ad %H' --date=short -- studies-src/onde-esta-a-agua/pt.html
2026-09-04 cc79128ee72022b5d248e728cdbf3435b373bf6b
```

`cc79128e` é a cabeça de que este ramo saiu, e `2026-09-04` a data de autoria
dela: numa cópia rasa o comando continua a responder a fronteira do clone. A
leitura certa, na árvore com história, é `2026-08-12 b4f45d3f`.

E o portão, na mesma cópia rasa:

```
$ node scripts/check-datas.mjs
check-datas: a história desta cópia é RASA · o ficheiro src/data/datas-de-publicacao.json é a fonte e não se confere contra o `git` aqui. Foi medido e commitado numa árvore com história completa (scripts/datas-de-publicacao.mjs, que se recusa a correr numa cópia rasa). As contas 1 e 2 (as páginas contra o ficheiro, e a caixa que conta) fizeram-se.
check-datas · 16 edição(ões) datadas, 56 data(s) impressa(s) em 26 página(s), 64 laço(s) data-edição em 26 página(s) conferida(s), 0 edição(ões) sem data e nenhuma caixa de aviso.
$ echo $?
0
```

A linha diz RASA, a conta 3 não se faz e di-lo, e as contas 1 e 2 fizeram-se
inteiras: 64 laços em 26 páginas. O gerador, na mesma cópia, recusa-se:

```
$ node scripts/datas-de-publicacao.mjs
datas-de-publicacao: esta cópia do repositório é RASA.
  `git rev-parse --is-shallow-repository` respondeu «true».

  Numa cópia rasa o commit que acrescentou uma edição em agosto não existe, e o
  `git log --diff-filter=A` responde com o commit mais antigo que a cópia tem: foi
  assim que o sítio publicado passou a dizer que os doze trabalhos tinham sido
  publicados hoje. Este script recusa-se a escrever essas datas.

  Corra-o numa árvore com a história inteira (`git fetch --unshallow`), e commite o
  ficheiro. Nada foi escrito.
$ echo $?
1
```

**As três plantas do portão da primeira passagem, refeitas hoje contra o portão
desta**, com as saídas tal como saíram:

```
$ # 1. a data de uma edição trocada no ficheiro para 2026-09-04
check-datas: história completa · 16 edição(ões) do ficheiro refeitas do `git`.
check-datas: 5 falha(s).
  · /en/studies: a linha de onde-esta-a-agua, na porta PT imprime «12.08.2026» e src/data/datas-de-publicacao.json diz que onde-esta-a-agua (pt) entrou a 04.09.2026 (commit b4f45d3f). Uma data que pertence ao conjunto das declaradas mas NÃO a esta edição é o que a conta 1a sozinha deixava passar.
  · /en/studies/onde-esta-a-agua: o bloco da edição PT imprime «12.08.2026» e src/data/datas-de-publicacao.json diz que onde-esta-a-agua (pt) entrou a 04.09.2026 (commit b4f45d3f). Uma data que pertence ao conjunto das declaradas mas NÃO a esta edição é o que a conta 1a sozinha deixava passar.
  · /estudos: a linha de onde-esta-a-agua, na porta PT imprime «12.08.2026» e src/data/datas-de-publicacao.json diz que onde-esta-a-agua (pt) entrou a 04.09.2026 (commit b4f45d3f). Uma data que pertence ao conjunto das declaradas mas NÃO a esta edição é o que a conta 1a sozinha deixava passar.
  · /estudos/onde-esta-a-agua: o bloco da edição PT imprime «12.08.2026» e src/data/datas-de-publicacao.json diz que onde-esta-a-agua (pt) entrou a 04.09.2026 (commit b4f45d3f). Uma data que pertence ao conjunto das declaradas mas NÃO a esta edição é o que a conta 1a sozinha deixava passar.
  · studies-src/onde-esta-a-agua/pt.html: src/data/datas-de-publicacao.json declara 2026-09-04 (b4f45d3f) e o `git` diz 2026-08-12 (b4f45d3f).
$ echo $?
1
```

```
$ # 2. a data trocada na página construída para 04.09.2026 (o defeito que esteve no ar)
check-datas: história completa · 16 edição(ões) do ficheiro refeitas do `git`.
check-datas: 2 falha(s).
  · /estudos/onde-esta-a-agua: a página imprime «04.09.2026» como data de repositório e src/data/datas-de-publicacao.json não a declara em edição nenhuma. É exactamente a forma do defeito de 04.09: uma data que saiu do ambiente da construção e não do facto medido.
  · /estudos/onde-esta-a-agua: o bloco da edição PT imprime «04.09.2026» e src/data/datas-de-publicacao.json diz que onde-esta-a-agua (pt) entrou a 12.08.2026 (commit b4f45d3f). Uma data que pertence ao conjunto das declaradas mas NÃO a esta edição é o que a conta 1a sozinha deixava passar.
$ echo $?
1
```

```
$ # 3. uma edição retirada do ficheiro
check-datas: história completa · 15 edição(ões) do ficheiro refeitas do `git`.
check-datas: 7 falha(s).
  · /en/studies: a linha de onde-esta-a-agua, na porta PT imprime «12.08.2026» e src/data/datas-de-publicacao.json não declara data nenhuma para onde-esta-a-agua (pt). Uma data sem linha no ficheiro é uma data sem origem.
  · /en/studies/onde-esta-a-agua: o bloco da edição PT imprime «12.08.2026» e src/data/datas-de-publicacao.json não declara data nenhuma para onde-esta-a-agua (pt). Uma data sem linha no ficheiro é uma data sem origem.
  · /estudos: a linha de onde-esta-a-agua, na porta PT imprime «12.08.2026» e src/data/datas-de-publicacao.json não declara data nenhuma para onde-esta-a-agua (pt). Uma data sem linha no ficheiro é uma data sem origem.
  · /estudos/onde-esta-a-agua: o bloco da edição PT imprime «12.08.2026» e src/data/datas-de-publicacao.json não declara data nenhuma para onde-esta-a-agua (pt). Uma data sem linha no ficheiro é uma data sem origem.
  · /estudos: 1 edição(ões) sem data em src/data/datas-de-publicacao.json e a página mostra 0 caixa(s) de aviso. Tinha de mostrar uma.
  · /en/studies: 1 edição(ões) sem data em src/data/datas-de-publicacao.json e a página mostra 0 caixa(s) de aviso. Tinha de mostrar uma.
  · studies-src/onde-esta-a-agua/pt.html: o `git` diz que esta edição entrou a 2026-08-12 (b4f45d3f) e src/data/datas-de-publicacao.json não a declara. Refaça o ficheiro com `node scripts/datas-de-publicacao.mjs`.
$ echo $?
1
```

### 6.6 · Minor 12 · a frase do §3

A frase «as dezasseis estavam erradas, e todas pela mesma quantidade» dizia duas
coisas, e só uma era verdade. Corrigida no §3: as dezasseis diziam todas o dia da
construção, e a distância à data certa é a de cada edição (13 edições a 23 dias,
2 a 20 dias, 1 a 11 dias). O que era comum era a origem do erro, não o número de
dias.

### 6.7 · O que esta passagem não fez

- **Não tocou em `src/data/studies.mjs`.** Nenhuma data de publicação foi
  confirmada, e a página continua a dizer o dia em que o ficheiro entrou neste
  repositório, com a origem dita.
- **Não mudou a decisão da §1.99**: a data continua a ser a do commit de adição.
- **Não mexeu nas quatro plantas do pacote de leitura** (§6.0): o código de
  `main` está certo nesses pontos, e o que se fez foi confirmá-lo.
- **Não mexeu na Vercel nem lançou nada.** A fusão e o lançamento são do
  diretor, e o projecto vazio criado por engano a 04.09 (§0) continua lá.
