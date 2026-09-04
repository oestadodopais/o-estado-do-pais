# F1.4b · as datas de publicação, e o espaço entre o número e a palavra · relatório do construtor

*Ramo `datas-2026-09-04`, tirado de `origin/main` em `69ba3abf`. Construtor
Claude Opus 5, 04.09.2026. É uma correção urgente do bloco F1.4
(`nomes-construtor.md`, item 8 e §10), e não um bloco novo: o âmbito é o defeito
e mais nada. Sem travessões na prosa.*

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

Primeira: **as dezasseis estavam erradas**, e todas pela mesma quantidade (a
distância entre o dia do commit e o dia da construção).

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
