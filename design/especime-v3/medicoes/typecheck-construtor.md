# Bloco F0.4 · o `typecheck` a valer, primeira etapa · relatório do construtor

*Escrito pelo construtor (Claude Opus 5) a 03.09.2026, no ramo `typecheck-2026-09-03`, a partir de `main` em `2ab66578`. O bloco é o F0.4 do `design/observatorio/PLANO-fiabilidade-2026-09-02.md` §2, e o achado é o da `AUDITORIA-2026-09-02.md` §4: «`npm run typecheck` confere um ficheiro». Cada número deste relatório traz o comando que o produziu. `[V]` é medido, `[I]` é inferido. Sem travessões na prosa.*

## 1 · O que estava errado, medido

`tsconfig.check.json` trazia `checkJs: false`. O programa tinha 74 ficheiros do projeto, e **um só era conferido**: o `astro.config.mjs`, o único com `// @ts-check` na cabeça. Os outros 73 entravam no programa e passavam sem uma única conferência de tipo. Um portão nomeado como verde que não podia falhar.

```
$ npm run typecheck                                      # em main, 2ab66578
EXIT=0                                                   # em 0,401 s
$ npx tsc -p tsconfig.check.json --listFiles | wc -l
     726                                                 # 74 fora de node_modules
$ grep -rln '@ts-check' src/ scripts/ *.mjs
astro.config.mjs                                         # um ficheiro
```

## 2 · Os erros que o `checkJs` levanta, antes

Ligado o `checkJs` numa cópia de rascunho (`tsconfig.scratch-src.json`, medido e não commitado):

| onde | erros [V] | comando |
|---|---|---|
| no commit da auditoria (`96af81bc`), só `src/` | **461** | `tsc -p <rascunho> --pretty false` numa árvore em `96af81bc` |
| no commit da auditoria, `src/` mais `site.config.mjs` | 462 | o mesmo |
| no ponto de partida do ramo (`2ab66578`) | 528 | o mesmo, na árvore do ramo |
| no ponto de partida, dentro do programa final (sem `src/data/sobre.mjs`, §6) | **526** | o mesmo, menos as 2 linhas de `sobre.mjs` |

**O 461 da auditoria reproduz-se exactamente.** A auditoria contou `src/`; a contagem de hoje soma-lhe o `site.config.mjs`, e por isso dá 462 no mesmo commit. Os 67 erros a mais no ponto de partida do ramo são de cinco ficheiros que mexeram entre 02 e 03.09 (`git diff --numstat 96af81bc 2ab66578 -- src/lib src/data src/i18n`): `src/lib/decimal.mjs` (novo, 350 linhas, do bloco F0.5), `src/lib/jsonld.mjs` (novo, 40 linhas), `documentos.mjs` (+387), `eyetext.mjs` (+132), `ledger.mjs` (+114).

### Por diretório, no programa final

| diretório | antes [V] | depois [V] |
|---|---|---|
| `src/lib` | 477 | **0** |
| `src/data` | 32 | **0** |
| `src/i18n` | 16 | **0** |
| `site.config.mjs` | 1 | **0** |
| `astro.config.mjs` | 0 | **0** |
| **total** | **526** | **0** |

### Por código de erro, no programa final

| código | o que diz | antes [V] | depois [V] |
|---|---|---|---|
| TS7006 | parâmetro com `any` implícito | 343 | 0 |
| TS2339 | propriedade que não existe no tipo | 30 | 0 |
| TS7053 | índice de cadeia num objeto sem assinatura de índice | 27 | 0 |
| TS2345 | argumento que não cabe no parâmetro | 22 | 0 |
| TS7005 | variável com `any` implícito | 22 | 0 |
| TS7034 | variável cujo tipo não se determina | 16 | 0 |
| TS18047 | valor possivelmente `null` | 15 | 0 |
| TS7031 | elemento de desestruturação com `any` implícito | 15 | 0 |
| TS18046 | valor de tipo `unknown` (o `err` de um `catch`) | 9 | 0 |
| TS7015 | índice que não é número num array | 5 | 0 |
| TS7022 | variável referida na própria inicialização | 5 | 0 |
| TS18048 | valor possivelmente `undefined` | 4 | 0 |
| TS7023 | função recursiva sem tipo de retorno | 4 | 0 |
| TS2362 / TS2363 / TS2365 | aritmética sobre o que não é número | 6 | 0 |
| TS2314 / TS2322 / TS2353 | genérico sem argumento, atribuição, chave a mais | 3 | 0 |

Por ficheiro, os dez maiores antes: `ledger.mjs` 77, `documentos.mjs` 74, `registo-html.mjs` 61, `eyetext.mjs` 41, `mapa.mjs` 37, `prova.mjs` 34, `cartoes.mjs` 30, `decimal.mjs` 24, `inicio.mjs` 23, `registos.mjs` 17.

## 3 · O que se construiu

`tsconfig.check.json` passa a ter `checkJs: true`, `scripts/` sai do `include`, e entra `src/tipos.d.ts`. A base continua a ser a do Astro (`astro/tsconfigs/strict`, com `strict: true`): a régua não se afrouxou em lado nenhum.

`src/tipos.d.ts` é um ficheiro de declarações puro: não é importado por ninguém em tempo de execução, não entra no pacote, e por não ter `import` nem `export` de topo os seus nomes veem-se em todo o programa. Declara as formas que já circulavam entre os módulos e que cada `@param` repetia por extenso: `Linha` (os 24 campos de `CAMPOS` mais o `__file` que o carregador acrescenta, lidos das 2 916 linhas e não escritos de cabeça), `Limiar`, `RegistoDeConteudo` e os seus blocos, `BlocoDoOlho`, `UnidadeDoMapa`, `ChaveDaProva`.

Os 526 erros fecharam-se com anotações JSDoc, estreitamentos e cinco refactorizações pequenas. As que mudam uma linha de código, e não só um comentário:

- **`documentos.mjs`, `recusa` passa de seta a declaração de função**, com `@returns {never}`. Só uma declaração deixa o verificador saber que a chamada não regressa; com a seta, as onze leituras que se seguem («`if (!html) recusa(...)`», e depois `html.atributos`) liam-se como leituras de um valor possivelmente nulo. É privada, não é reatribuída e não usa `this`: nada mais muda.
- **`registos.mjs`, `CACHE = doc; return CACHE;` passa a `CACHE = doc; return doc;`.** É a mesma referência.
- **`ledger.mjs`, `loadClaims()`**: o documento cru do YAML passa a uma variável `bruto` e o molde faz-se uma vez, depois da conferência `typeof bruto !== 'object'`.
- **`ledger.mjs`, `alojamentoCompleto()`**: `h[k].trim()` passa por uma variável local com o mesmo valor, e `h.bytes < 1` ganha à cabeça um `typeof h.bytes !== 'number'` que é redundante em execução (`Number.isInteger` já é falso para o que não é número) e diz ao verificador o que a linha seguinte assume.
- **`registo-html.mjs`, `ctx.ligacaoAberta`** lê-se por uma função `aberta(ctx)` que é um molde e mais nada.

O resto são linhas de comentário. Nos três ficheiros que outros dois construtores têm abertos hoje (`src/data/figuras.mjs`, `src/i18n/strings.mjs`, `src/data/fontes.mjs`), a regra foi só linhas de comentário JSDoc, com **uma excepção declarada**: `src/i18n/strings.mjs:2464`, dentro de `t()`, onde `const s = STRINGS[lang]` ganhou um molde. Não havia forma de fechar aquele TS7053 por comentário sem estreitar `lang` a `'pt'|'en'` e empurrar o estreitamento para uma dúzia de chamadores. Fica dito aqui porque é uma linha de código num ficheiro de outro ramo; está no fim do ficheiro, longe das frases da primeira página, e a fusão não deve tropeçar nela.

`src/data/fontes.mjs` e `src/views/LinhaView.astro` e `src/views/HomeView.astro` **não foram tocados**.

### O tamanho

```
$ git diff --stat | tail -1
 38 files changed, 953 insertions(+), 169 deletions(-)
```

mais `src/tipos.d.ts`, novo, 367 linhas.

## 4 · O defeito real que estava escondido atrás de um erro de tipo

**`src/lib/documentos.mjs:856` (antes da anotação; hoje a guarda está em `:965`) · `provaDosBytes()` podia atirar em vez de devolver a frase do que falhou.**

O código era:

```js
const corpoR = etiquetaReal(reposto, 'body', zonasR);
const cabecaR = etiquetaReal(reposto, 'head', zonasR, { antesDe: corpoR ? corpoR.inicio : Infinity });
if (!cabecaO || !cabecaR) return 'não encontrei o `<head>` dos dois lados para comparar.';
...
const entreR = bufR.subarray(bytesAte(reposto, cabecaR.fim), bytesAte(reposto, corpoR.inicio));
```

A linha do meio conta explicitamente com `corpoR` ausente (`corpoR ? corpoR.inicio : Infinity`); a linha de baixo lê `corpoR.inicio` sem guarda nenhuma. **O caso que o teria disparado:** um documento construído em `dist/estudos/<slug>/documento/index.html` sem um `<body>` de verdade fora das zonas opacas (truncado, ou com o `<body>` só dentro de um comentário ou de um `<script>`). O provador promete ao portão «devolve `null` quando está bem, ou a frase do que falhou»; naquele caso devolvia um `TypeError` a subir pelo `check:documentos`, que é a construção a parar com a mensagem errada em vez de com a que nomeia o ficheiro e a razão.

Não é alcançável hoje: `comFaixa()` insere a faixa a seguir ao `<body>` real e atira quando ele não existe, e os dezasseis documentos têm-no. É um defeito de contrato, não de dados, e por isso não mexe num byte de `dist/`.

**O conserto:** uma guarda própria, com a sua frase, antes da guarda das cabeças.

```js
if (!corpoR) return 'o construído não tem um `<body>` de verdade.';
```

### As leituras que ficaram honestas, e que não eram defeitos

Vale dizer o que se conferiu e **não** era um defeito, para que a lista de cima não pareça maior do que é. As quinze TS18047 e as quatro TS18048 restantes eram todas invariantes que o verificador não via: `recusa()` e `morre()` atiram sempre (resolvido pelo `@returns {never}`); `String.prototype.match` sem `g` traz sempre o `index`; `REGISTOS_DIR` só chega às funções de baixo depois de `manifestoDosRegistos()` ter atirado por ele; `LANGS.find(l => l !== corrente)` acha sempre, porque a lista tem duas entradas. Cada uma dessas está no código com a razão escrita ao lado do molde, e não como um molde mudo.

Uma inconsistência que se registou sem mexer: em `registo-html.mjs`, `fechaIntervalo()` pergunta `if (ctx.ligacaoAberta)` num ramo e `if (ctx.dentroDeLigacao > 0)` no ramo seguinte para a mesma invariante. Os dois campos movem-se sempre juntos em `escreveNo()`, por isso as duas perguntas dão hoje a mesma resposta; ficam as duas, com a razão escrita na função `aberta()`.

## 5 · A prova de que nada mudou no que o sítio publica

Construiu-se antes e depois, do mesmo commit de origem, e compararam-se **todos os ficheiros** de `dist/` por sha256.

```
$ (cd dist && find . -type f -print0 | sort -z | xargs -0 shasum -a 256) > dist-<antes|depois>.sha256
$ diff dist-antes-todos.sha256 dist-depois-todos.sha256
```

| | antes [V] | depois [V] |
|---|---|---|
| ficheiros em `dist/` | 11 420 | 11 420 |
| `index.html` | 7 233 | 7 233 |
| linhas de soma comparadas | 11 420 | 11 420 |
| ficheiros com soma diferente | **2** | |

Os dois são `dist/version.json` e `dist/prova.json`, e em cada um a **única linha que difere é o carimbo da hora da construção**:

```
$ diff <(python3 -m json.tool dist-antes/prova.json) <(python3 -m json.tool dist/prova.json)
11c11
<     "construido_em": "2026-09-03T07:51:50.599Z",
---
>     "construido_em": "2026-09-03T08:22:24.601Z",
```

`dist/cadeia.json`, os conjuntos de dados (`dist/dados/*.csv`), os 2 916 JSON por linha, os 7 233 `index.html`, os mapas do sítio, os cartões e as folhas: **soma igual, byte a byte**.

## 6 · O ficheiro que ficou de fora, e porquê

`src/data/sobre.mjs` está no `exclude` do `tsconfig.check.json`, com a razão escrita lá dentro. Não é uma conveniência: **é um texto governado**. A amarra das decisões (`scripts/check-ledger.mjs`, §1.41) prende os bytes do ficheiro ao resumo sha256 carimbado na entrada do `DECISIONS.md` que o governa. Uma linha de JSDoc acrescentada lá dentro muda o resumo, e a construção fecha:

```
  A AMARRA DAS DECISÕES NÃO FECHA · 1 erro(s):
    ✗ "sobre": o texto mudou depois da última decisão que o governa...
        §1.89 carimba 0507f5f3d6af
        src/data/sobre.mjs está hoje em a7e1be1b044c
```

Reescrever o carimbo é acto de quem regista, não de quem constrói. O ficheiro tem 38 linhas: duas cadeias e uma função de três linhas (`textoDoSobre`), e os seus dois erros eram um TS7006 e um TS7053 na mesma função. Ninguém dentro do programa o importa (quem o lê é `SobreView.astro` e o portão), por isso o `exclude` tira-o mesmo do programa e não o deixa por conferir em silêncio.

**O que destrava:** a entrada de `DECISIONS.md` que fecha este bloco pode nomear `sobre` com o resumo do dia, e a linha do `exclude` sai. O outro texto governado, `src/data/metodo.mjs`, **está dentro do programa e está a 0**.

## 7 · O portão pode falhar: a planta

Plantou-se um erro de tipo em `src/lib/ledger.mjs`, correu-se o portão, repôs-se, correu-se outra vez. Os três resumos do ficheiro estão aqui para que a planta se possa refazer.

```
$ shasum -a 256 src/lib/ledger.mjs
39225a33e2c569bc933d718b413a0b8870d13c4db1d2b529466d681369039b29   (original)
```

A planta, dentro de `eValorTextual()`: `const planta = arredonda(String(value), 2);`, e o `arredonda()` pede um `Decimal` e recebe a cadeia do valor publicado.

```
$ shasum -a 256 src/lib/ledger.mjs
d34059ffbf88d58959dcf5a74a8bda2a0b6b0f77d5147eab54d4d78e55d08cfc   (com a planta)
$ npm run typecheck
EXIT=1
src/lib/ledger.mjs(877,28): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Decimal'.
```

Reposto:

```
$ shasum -a 256 src/lib/ledger.mjs
39225a33e2c569bc933d718b413a0b8870d13c4db1d2b529466d681369039b29   (igual ao original)
$ npm run typecheck
EXIT=0                                                             (0 erros)
```

Uma primeira planta (uma soma sobre o retorno de `digitsOf`) também deu `EXIT=1`, mas com TS7023 e TS7022, que é o verificador a queixar-se da recursão e não da soma. Trocou-se por esta, que nomeia o erro que se plantou.

## 8 · O programa confere mais do que um ficheiro

```
$ npx tsc -p tsconfig.check.json --listFiles | wc -l
     677                                                 # antes: 726
$ npx tsc -p tsconfig.check.json --listFiles | grep -vc node_modules
      45                                                 # antes: 74
```

O número de linhas desceu porque os 28 ficheiros de `scripts/` saíram do programa (§9) e o `src/tipos.d.ts` entrou. O que interessa não é o total: é que **antes eram 74 ficheiros no programa e um conferido, e agora são 45 no programa e 45 conferidos**.

## 9 · O que `scripts/` levantaria hoje (bloco F4.2)

Medido uma vez, com um `tsconfig` de rascunho que acrescenta `scripts/**/*.mjs` ao `include`, e que **não foi commitado**:

| | erros [V] |
|---|---|
| `scripts/` no ponto de partida do ramo | 1 295 |
| `scripts/` depois deste bloco | **1 316** |

Sobe 21 e não é ruído: os módulos de `src/` passaram a ter tipos, e os guiões que os chamam passam a ver os desacordos que antes eram `any` dos dois lados. Os dois maiores são `scripts/gate-html.mjs` com 272 e `scripts/design-bundle.mjs` com 149. Por código, 819 são TS7006, 122 TS7053, 68 TS2339.

## 10 · O `astro check`, a segunda etapa

**Não corre neste repositório hoje, e a razão está medida.** O `typescript` da casa é o 7.0.2, que é o compilador nativo e **não publica a API programática** (`node_modules/typescript/lib/` tem `tsc.js` e `getExePath.js`, e não tem `typescript.js`). O `@astrojs/check@0.9.10`, que é o último publicado, declara `peerDependencies = { typescript: '^5.0.0 || ^6.0.0' }` e o seu servidor de língua recusa-se a arrancar com a versão 7:

```
$ npm install --no-save --legacy-peer-deps @astrojs/check@0.9.10
$ npx astro check
The TypeScript module loaded (found 7.0.2) does not expose the programmatic API that
`astro check` relies on. TypeScript's native compiler (7.0 and later) does not ship this
API yet. Until it does, run `astro check` with a TypeScript version that still provides
it (6.x). See https://github.com/withastro/roadmap/discussions/1321 to track support.
EXIT=1
```

Para dar o número que o bloco pede, instalaram-se `typescript@6.0.3` e `@astrojs/check@0.9.10` **com `--no-save`**, correu-se uma vez, e repôs-se a árvore com `npm ci`. `package.json` e `package-lock.json` ficaram byte a byte iguais (`diff` a 0 nos dois), e o `typescript` voltou a 7.0.2.

```
$ npx astro check                                        # com typescript@6.0.3
Result (260 files):
- 337 errors
- 0 warnings
- 11 hints
                                                         # 8,4 s
```

Os cinco maiores: `MunicipioView.astro` 101, `MetodoView.astro` 34, `AgendaView.astro` 30, `LinhaView.astro` 23, `Pesquisa.astro` 19. Por código: 106 TS7006, 76 TS7053, 66 TS2339, 36 TS18047, 11 TS1005.

**Não se ligou a nenhum portão**, como o bloco manda: o número não é 0. E não se acrescentou dependência nenhuma, porque acrescentá-la hoje significava trazer um segundo TypeScript (o 6.x) para o repositório só para o servidor de língua, com o 7.0.2 a continuar a ser o que corre o `typecheck`. É uma decisão de dependências que não é deste bloco: fica escrita aqui, com o número medido, para quem a tomar. Nota de leitura: **os 337 são de hoje e alguns são novos**, porque os tipos que este bloco escreveu propagam-se para a camada `.astro` e passam a apanhar coisas como `peca.selo` numa peça que o tipo diz ser `{ html: string }` (`TextoView.astro:238`).

## 11 · Os tempos

| | antes [V] | depois [V] |
|---|---|---|
| `npm run typecheck` | 0,401 s (a conferir um ficheiro) | 0,545 s e 0,220 s, duas corridas (a conferir 45) |
| `tsc -p tsconfig.check.json`, três corridas seguidas | | 0,24 s · 0,22 s · 0,22 s |
| `npm run build` | 4 m 54,25 s | 5 m 01,54 s e 5 m 12,16 s, duas corridas |
| `npm run verify` | | 1 m 03,38 s e 1 m 01,03 s, duas corridas |
| `npx astro check` (com o `typescript@6.0.3` do §10) | | 8,4 s |

O `typecheck` custa **menos de um segundo** e passou de conferir um ficheiro a conferir quarenta e cinco: o portão que a auditoria dizia estar vazio custa hoje meio segundo por commit. A diferença na construção está dentro do que corridas da mesma árvore variam nesta máquina, e as próprias corridas «depois» diferem 11 s entre si [I]; nada no caminho de construção mudou, e o `dist/` prova-o (§5).

## 12 · Os três códigos de saída locais, e o portão do GitHub

```
$ npm run build     → EXIT=0
$ npm run verify    → EXIT=0
$ npm run typecheck → EXIT=0
```

Lidos dos ficheiros de registo de cada corrida, e não de um `echo` a seguir a um redireccionamento.

No GitHub, o contexto `portao` sobre o commit deste bloco:

```
$ gh run view 33734492674 --json status,conclusion
status=completed | conclusion=success
https://github.com/oestadodopais/o-estado-do-pais/actions/runs/33734492674
```

Os doze passos verdes, `npm run build`, `npm run verify` e `npm run typecheck` entre eles. **14 m 19 s** de ponta a ponta (`run_duration_ms` 859 000, lido em `gh api .../timing`); o trabalho arrancou às 08:39:05Z e fechou às 08:53:18Z. Facturado 0, porque o repositório é público.

## 13 · O que fica para os blocos seguintes

1. **`src/data/sobre.mjs`** entra no programa no dia em que uma entrada do registo o nomear com o resumo do dia (§6).
2. **`scripts/`**, 1 316 erros, é o F4.2 (§9).
3. **`astro check`**, 337 erros na camada `.astro`, espera por uma decisão de dependências: ou o `@astrojs/check` passa a aceitar o TypeScript nativo, ou a casa carrega um segundo TypeScript (§10).
4. **A linha de código em `src/i18n/strings.mjs`** (§3) é a única do bloco fora dos ficheiros deste construtor, e é uma linha.

---

# Segunda passagem · 03.09.2026

*Escrita pelo construtor depois da leitura a frio do Codex (`design/especime-v3/critica/2026-09-03-codex-leitura-f04-typecheck.md`, 21 achados, cinco plantas de três classes vistas 5 de 5). O Blocking 1, o 2, o 3 e o Minor 19 são as plantas e não estavam neste ramo; a parte da CI do Minor 21 é do empacotamento. Os Major 4 a 18 e o Minor 20 são reais, e é o que esta secção conserta. A leitura tem razão no essencial: um portão de tipos que fecha 526 erros com 43 `any` e com moldes afirmados antes da validação prova menos do que diz.*

## S1 · O que mudou, em números

```
$ git diff --stat 2ab66578 | tail -1
 42 files changed, 2522 insertions(+), 264 deletions(-)
$ npm run typecheck   → EXIT=0, 0,208 s
$ npm run verify      → EXIT=0, 58,5 s
$ npm run build       → EXIT=0, 4 m 54,67 s
```

| | primeira passagem | segunda passagem |
|---|---|---|
| erros do `typecheck` | 0 | **0**, com tipos muito mais apertados |
| `any` nas linhas acrescentadas [V] | 43 | **0** |
| guardas de execução | 0 | **15** (nove exportados) |
| conhecidos-positivos dos guardas | 0 | **37**, em `npm run verify` |
| afirmações de compilação sobre as listas | 0 (escritas onde nunca corriam) | **4**, num ficheiro conferido |
| `strict` | herdado | **escrito no `tsconfig.check.json`** |

## S2 · Major 4 · o `strict` escrito, e a varredura das dispensas

`"strict": true` passa a estar escrito no `tsconfig.check.json`, ao lado do `checkJs`. A base já o punha (`astro/tsconfigs/strict`), e a leitura tem razão: uma régua herdada é uma régua que quem lê o portão não vê.

```
$ grep -rn '@ts-nocheck\|@ts-ignore\|@ts-expect-error' src/ site.config.mjs astro.config.mjs | wc -l
       0
```

Zero antes do bloco e zero depois: nenhuma dispensa existia e nenhuma se acrescentou.

## S3 · Major 5 · o inventário dos hunks que mexem em linhas executáveis

A frase «cinco refactorizações; tudo o resto são comentários» estava errada, e o número do leitor está certo em ordem de grandeza. Medido sobre o diff inteiro do ramo, contando como executável toda a linha acrescentada ou retirada que não seja em branco nem comentário:

```
$ git diff 2ab66578 -- src/ site.config.mjs scripts/ > diff.patch   # e o contador do §S3
HUNKS COM LINHA EXECUTÁVEL: 110 de 263 hunks
LINHAS EXECUTÁVEIS: +761 -169
```

Dos 110, um é `src/tipos.d.ts` inteiro (ficheiro novo, só declarações, sem uma linha que corra: +316). Ficam **109 hunks em `.mjs`, com +445 e -169 linhas executáveis**, assim distribuídos:

| ficheiro | hunks com código / hunks | + / - |
|---|---|---|
| `src/lib/ledger.mjs` | 48 / 66 | +184 / -90 |
| `src/lib/prova.mjs` | 8 / 18 | +14 / -10 |
| `src/lib/registo-html.mjs` | 8 / 22 | +16 / -7 |
| `src/lib/documentos.mjs` | 6 / 24 | +19 / -8 |
| `src/lib/registos.mjs` | 5 / 7 | +53 / -11 |
| `src/lib/eyetext.mjs` | 4 / 18 | +6 / -5 |
| `src/i18n/lingua-dos-titulos.mjs` | 4 / 4 | +4 / -4 |
| `src/data/studies.mjs` | 3 / 6 | +7 / -4 |
| `src/data/correcoes.mjs` | 3 / 3 | +3 / -3 |
| `src/lib/mapa.mjs` | 2 / 10 | +96 / -4 |
| `src/lib/areas.mjs`, `livro.mjs`, `routes.mjs`, `marca.mjs` | 2 cada | |
| `cartoes.mjs`, `agenda.mjs`, `inicio.mjs`, `livro-concelhos.mjs`, `estado.mjs`, `leituras.mjs`, `concelhos.mjs`, `verbatim.mjs`, `politica-ia.mjs`, `unidades.mjs` | 1 cada | |

**Doze ficheiros levam SÓ linhas de comentário**, e entre eles os dois que outros construtores têm abertos hoje:

```
site.config.mjs · src/data/areas.mjs · src/data/caop-centroids.mjs · src/data/figuras.mjs
src/data/municipios.mjs · src/i18n/strings.mjs · src/lib/conjunto.mjs · src/lib/dados.mjs
src/lib/datas.mjs · src/lib/decimal.mjs · src/lib/jsonld.mjs · src/lib/regioes.mjs
```

A linha de código que a primeira passagem tinha posto em `src/i18n/strings.mjs:2464` **saiu**: `t()` recebe agora `Lingua` e lê `STRINGS[lang]` sem molde nenhum, que é ao mesmo tempo o tipo certo e o ficheiro de volta a comentário puro.

### Os três hunks que podiam mudar um resultado de fronteira

O leitor nomeou três. Aqui está o que se fez a cada um, e o que se escolheu:

1. **`alojamentoCompleto()`, as leituras dos campos** (`src/lib/ledger.mjs:459`). **Voltou ao comportamento anterior, exacto.** A primeira passagem guardava `h[k]` numa variável (uma leitura em vez de duas) e acrescentava um `typeof h.bytes !== 'number'` (uma leitura a mais). Agora está outra vez `typeof h[k] !== 'string' || h[k].trim() === ''` e `!Number.isInteger(h.bytes) || h.bytes < 1`, com um molde na segunda leitura de cada par cuja justificação é a conferência que a acabou de preceder. O mesmo número de leituras, pela mesma ordem, com os mesmos curtos-circuitos: um objeto com getters responde como respondia.
2. **O tratamento do objeto cru em `loadClaims()`** (`src/lib/ledger.mjs:876`). **Mudou de propósito, e é o Major 7.** Onde havia um molde (`/** @type {Linha} */ (bruto)`) há agora `eLinha()`, e um ficheiro do livro-razão sem `id` de cadeia não vazia é **recusado com a frase do que lhe falta**, em vez de entrar no mapa com a chave `undefined`. Conhecido-positivo: `eLinha/sem-id`, `eLinha/id-vazio`, `eLinha/lista`, `eLinha/nulo`, `eLinha/cadeia` em `scripts/provar-guardas.mjs`.
3. **O encadeamento opcional sobre entrada malformada** (`src/lib/ledger.mjs`, dez sítios). As dez leituras de `c.document` passam por `documentoDaLinha(c)`, calculado uma vez por linha, que devolve o mapa ou `null`. Para toda a entrada possível o resultado é o mesmo que antes: `null`, uma lista, um escalar e um mapa dão hoje exactamente o que davam (`undefined` nos três primeiros casos, o campo no quarto), porque `c.document && typeof c.document === 'object' ? c.document.X : undefined` e `documentoDaLinha(c)?.X` só divergiriam num objeto que fosse `typeof 'object'` e não fosse mapa, que é só uma lista, e numa lista as duas expressões dão `undefined`. Conhecido-positivo: `documentoDaLinha/lista` e `documentoDaLinha/mapa`.

Mais duas mudanças de comportamento sobre entrada malformada, escritas aqui porque também o são: `textoOuNulo()` devolve `null` para um campo de prosa que não seja cadeia (as 702 ocorrências dos quatro campos de prosa das 2 916 linhas de hoje são todas cadeias, medido), `listaDaLinha()` devolve `[]` para um campo de lista que não seja lista, e os nove `catch` deixaram de ler `.message` às cegas: leem `erro instanceof Error ? erro.message : String(erro)`, que imprime a coisa em vez de «undefined».

## S4 · Major 6 · as somas dos 11 420 ficheiros, guardadas

As duas listas ficam no repositório, e não numa frase:

```
design/especime-v3/medicoes/typecheck-dist/dist-antes.sha256    11 420 linhas
design/especime-v3/medicoes/typecheck-dist/dist-depois.sha256   11 420 linhas
```

São a saída crua de `shasum -a 256` sobre todos os ficheiros de `dist/`, por ordem de caminho, antes (construído em `main`, `2ab66578`) e depois (construído neste ramo). Quem quiser refazer a comparação corre:

```
$ diff design/especime-v3/medicoes/typecheck-dist/dist-antes.sha256 \
       design/especime-v3/medicoes/typecheck-dist/dist-depois.sha256
```

Diferem **dois** ficheiros, `./prova.json` e `./version.json`, e neles diferem **dois campos**: `commit` (o carimbo de que commit foi construído: `2ab66578` na primeira, `65265d93` na segunda) e `construido_em`. Os 7 233 `index.html`, o `cadeia.json`, os conjuntos de dados, os 2 916 JSON por linha, os cartões, os mapas do sítio e as folhas têm a mesma soma, byte a byte.

## S5 · Major 7 a 10 · nenhuma forma é afirmada antes de ser validada

Entraram **quinze guardas de execução**, nove deles exportados, e saíram os moldes que os precediam:

| guarda | onde | o que confere |
|---|---|---|
| `eMapa` | `ledger.mjs` | um mapa: nem `null`, nem escalar, nem lista |
| `eLinha` | `ledger.mjs` | o `id` de cadeia não vazia, que é a chave do mapa do livro-razão |
| `eVerificacao` | `ledger.mjs` | `date`, `result`, `by` e o `path` (cadeia ou `null`) |
| `eCorrecao` | `ledger.mjs` | `date` e `kind` |
| `documentoDaLinha` | `ledger.mjs` | o bloco `document`, quando é um mapa |
| `correcoesDaLinha`, `listaDaLinha` | `ledger.mjs` | as listas de uma linha, quando são listas |
| `eManifestoDosRegistos` | `registos.mjs` | `exporter`, `origin` e o mapa `registos` |
| `eRegistoDeConteudo` | `registos.mjs` | `blocks`, com o índice e o género de cada bloco |
| `ePaisDoMapa` | `mapa.mjs` | o campo, as molduras e as unidades com a sua parcela |
| `eDistritoDoMapa` | `mapa.mjs` | a identidade, o campo e os concelhos |
| `eManifestoDoMapa` | `mapa.mjs` | a menção da fonte que a licença da CAOP obriga |
| `eUnidade`, `eUnidadeComParcela`, `eIdentidadeDeDistrito`, `eCampo`, `eMoldura`, `eCaixa`, `ePonto` | `mapa.mjs` | as peças de que os três de cima se compõem |

**Onde o validador diz o que falta campo a campo, o guarda é só `eMapa`.** Trocar as sete frases de uma correção estragada por um «tem de ser um mapa» seria perder o que o validador existe para dizer; `eCorrecao` e `eVerificacao` servem quem CONSOME (a página, as contagens), e o validador continua a nomear cada campo.

### O que os guardas apanharam à primeira construção

`DistritoDoMapa.unidade` **estava errado no tipo que a primeira passagem escreveu**. O tipo prometia uma `UnidadeDoMapa` com desenho, caixa e ponto; o `unidade` de `mapa/distritos/<slug>.json` traz slug, nome e tipo, e mais nada. Medido nos 29 ficheiros: `slug` 29, `nome` 29, `tipo` 29, `d` 0, `caixa` 0, `ponto` 0. O guarda recusou os 29 ficheiros na primeira construção depois de entrar, com a frase do que faltava, e o tipo passou a `IdentidadeDoDistrito`. **É a demonstração do Major 10 no próprio bloco**: uma forma declarada sem ninguém a ter olhado estava errada, e nada a teria dito.

### `CorrecaoDaLinha`, o `field` singular (Major 9)

O tipo declarava `fields?: string[]` plural, e o validador exige e lê `corr.field` singular. O plural saiu, o singular entrou tipado com os campos de `CAMPOS_DE_PROVENIENCIA`, e a assinatura de índice aberta que escondia a diferença saiu também: uma chave a mais numa correção é agora um erro de tipo, como já era um erro de construção. Conhecido-positivo: `eCorrecao/fields-plural`.

### `parcela` (Major 13)

Medido a 03.09.2026: as **29 de 29** unidades de `mapa/pais.json` declaram `parcela`; **0 de 308** concelhos dos 29 ficheiros de distrito a declaram. Por isso `PaisDoMapa.unidades` é `UnidadeComParcela[]` (obrigatória, e o guarda confere-a) e `UnidadeDoMapa.parcela` fica opcional. Os dois moldes `/** @type {string} */ (u.parcela)` saíram. Conhecido-positivo: `ePaisDoMapa/unidade-sem-parcela`.

## S6 · Major 11, 12, 14, 15 · os contratos escritos como são

- **`evaluateCheck` exige `claims`** e, sem ele, atira «falta o mapa das linhas», em vez de rebentar com um `TypeError` a meio da avaliação. O comentário que admitia que a chamada documentada rebentava saiu com o molde. Os cinco chamadores de hoje passam-no todos (medido: `src/lib/ledger.mjs:2460`, quatro em `scripts/check-ledger.mjs`, um em `tests/municipio/vazios.mjs`). Conhecidos-positivos: `evaluateCheck/sem-claims` e `evaluateCheck/com-claims`.
- **`cartaoDoEstudo` pergunta antes de moldar**: recebe `unknown`, faz `typeof study !== 'string'` e só então procura no mapa dos estudos de dados.
- **`MarcaDaExpressao` reconhece-se por `instanceof`**, e não pela verdade da cadeia. Uma marca de cadeia vazia é falsa: `if (ma || mb)` caía no ramo dos números e entregava à aritmética um objeto que não é um `Decimal`. Nenhuma das marcas de `VALORES_NAO_NUMERICOS` é vazia, por isso nada do que hoje se publica muda. Conhecidos-positivos: `MarcaDaExpressao/vazia` (duas conferências).
- **As invariantes do renderizador estão no tipo.** `SaidaPendenteDoRegisto` é agora `{ selo: string } | { porta: string }` (um ou o outro, nunca os dois nem nenhum) e lê-se com `'selo' in saida`; `ContextoDoRegisto.ligacaoAberta` é `NoDeLigacao | null` e não um nó qualquer, e a função-molde `aberta(ctx)` desapareceu porque deixou de ser precisa.

## S7 · Major 16 · os `any`

```
$ git diff -U0 2ab66578 -- src/ site.config.mjs | grep '^+' | grep -v '^+++' | grep -c '\bany\b'
```

**43 na primeira passagem, 0 na segunda** (as únicas ocorrências que sobram da palavra são quatro linhas de prosa em comentários que explicam porque saíram). Onde foram parar:

| eram | passaram a |
|---|---|
| nove `catch (/** @type {any} */ err)` | `catch (erro)` com `erro instanceof Error ? erro.message : String(erro)` |
| o objeto das traduções | `t(lang: Lingua)` a indexar `STRINGS` sem molde |
| `LEITURAS`, `VERBATIM`, `FONTES_SEM_RESPOSTA` | `TabelaAberta<typeof X>`, que é a união dos valores declarados mais o `undefined` de uma chave que não existe |
| as estruturas da agenda | `RegistoDaAgenda`, `ItemDaAgenda`, `RegistoDoCalendario`, `EventoDoCalendario`, com todas as chaves dos ficheiros declaradas e as que ninguém lê a `unknown` |
| o manifesto do mapa | `ManifestoDoMapa` com a `FonteDoMapa` que a licença obriga, conferida no leitor |
| os valores da validação do livro-razão | `unknown` com o guarda que os estreita |
| `area`, `municipio`, `r`, `medida`, `modelo` | derivados das próprias tabelas: `(typeof AREAS)[number]`, `(typeof MUNICIPIOS_COM_PAGINA)[number]`, `(typeof REGIOES)[number]`, `ReturnType<typeof modeloDoCartao>` |
| `gramatica`, `medidas` | `GramaticaDoLede` (derivado de `STRINGS`) e `MedidaDoPainel` |
| os nós do `node-html-parser` | `import('node-html-parser').Node`, com o molde para `HTMLElement` só onde a linha de cima já provou que é um elemento |

## S8 · Major 17 · os tipos derivam das autoridades

`src/tipos.d.ts` deixou de copiar listas:

```ts
type Lingua        = (typeof import('./lib/routes.mjs').LANGS)[number];
type ChaveDeRota   = keyof typeof import('./lib/routes.mjs').ROUTES;
type CampoDaLinha  = (typeof import('./lib/ledger.mjs').CAMPOS)[number];
type CampoDoDocumento    = (typeof import('./lib/ledger.mjs').CAMPOS_DO_DOCUMENTO)[number];
type NaturezaDaCorrecao  = (typeof import('./data/correcoes.mjs').KINDS)[number];
type CampoDeProveniencia = (typeof import('./data/correcoes.mjs').CAMPOS_DE_PROVENIENCIA)[number];
```

`ROUTES` deixou de estar alargada a `Record<string, Record<string, string>>`: as chaves voltam a ser as suas, `routePath()` pede uma `ChaveDeRota`, e o `conjunto` de um estudo de dados é uma chave de rota, não uma cadeia qualquer. Uma rota escrita com um nome que a tabela não tem passa a ser um erro de tipo.

### As afirmações de compilação, e onde vivem

Quatro afirmações prendem as duas listas uma à outra e fecham a construção quando se afastarem:

```js
/** @typedef {Verdadeiro<SemSobras<CampoDaLinha, keyof Linha>>} _TodoOCampoEstaNaLinha */
/** @typedef {Verdadeiro<SemSobras<Exclude<keyof Linha, '__file'>, CampoDaLinha>>} _ALinhaNaoInventaCampos */
/** @typedef {Verdadeiro<SemSobras<CampoDoDocumento, keyof DocumentoDaLinha>>} _TodaAChaveDoDocumento */
/** @typedef {Verdadeiro<SemSobras<_CamposDaVerificacao[number], keyof VerificacaoDaLinha>>} _OsCamposDaVerificacao */
```

**Vivem em `src/lib/ledger.mjs`, e não em `src/tipos.d.ts`, e a razão é medida.** O `skipLibCheck` que a base do Astro liga faz o verificador saltar o corpo de qualquer `.d.ts`: escritas no ficheiro de declarações, as afirmações **nunca corriam**. Foi assim que a primeira versão desta secção as escreveu, e a planta mostrou-o. Desligar o `skipLibCheck` não serve:

```
$ npx tsc -p tsconfig.check.json --pretty false     # com "skipLibCheck": false
57 erros, todos dentro de node_modules
28 deles em node_modules/astro/dist/core/config/schemas/relative.d.ts
```

**As duas plantas que provam que agora correm:**

| planta | resultado |
|---|---|
| um campo a mais em `Linha` (`campoInventado`) | `EXIT=1` · `ledger.mjs(338,26): error TS2344: Type 'false' does not satisfy the constraint 'true'` |
| um campo a mais em `CAMPOS` (`campo_novo_do_formato`) | `EXIT=1` · o mesmo TS2344, mais um TS7053 em `cartoes.mjs` |
| repostos os dois | `EXIT=0` |

## S9 · Major 18 e Minor 20 · o programa, contado e provado

**A aritmética dos ficheiros.** A leitura contou 28 guiões; são 29.

```
$ npx tsc -p tsconfig.check.json --listFiles | grep -v node_modules | grep -c '/scripts/'   # antes: 29
$ npx tsc -p tsconfig.check.json --listFiles | grep -vc node_modules                        # antes: 74, agora: 45
```

74 = 45 do sítio + 29 de `scripts/`. Tirados os 29, ficam 45; menos `src/data/sobre.mjs`, 44; mais `src/tipos.d.ts`, **45**.

**`sobre.mjs` não reentra por importação, e prova-se mecanicamente:**

```
$ npx tsc -p tsconfig.check.json --listFiles | grep -c 'src/data/sobre.mjs'
0
$ grep -rn "data/sobre" src/ scripts/
src/views/SobreView.astro:40   (uma vista, fora do programa)
scripts/gate-html.mjs:127      (um guião, fora do programa)
scripts/check-ledger.mjs:25    (um guião, fora do programa)
```

O `--listFiles` é a prova que conta: se alguém dentro do programa o importasse, o ficheiro reentrava e apareceria nesta lista. Não aparece.

**As duas plantas que provam que `src/data` e `src/i18n` são CONFERIDOS e não só listados** (o segundo ponto do Minor 20, que é o que importa):

| ficheiro | sha256 antes | com a planta | erro |
|---|---|---|---|
| `src/data/marcador.mjs` | `b93205ea…cb83` | `0c79cb53…0dd3` | `TS2362: The left-hand side of an arithmetic operation must be of type…` |
| `src/i18n/unidades.mjs` | `e8af0f74…943b` | `cf710d04…6ab8` | `TS2345` e `TS2339: Property 'naoExiste' does not exist on type 'string'` |

Com as duas plantas, `EXIT=1`; repostos os dois ficheiros aos mesmos sha256, `EXIT=0`.

## S10 · Minor 21 · o TypeScript preso ao número exacto

```
$ node -e "console.log(require('./package.json').devDependencies.typescript)"
7.0.2                                                    (era "^7.0.2")
```

`package-lock.json` atualizado na mesma passagem, com o `integrity` da 7.0.2. A casa prende as versões, e esta era a única do sítio que flutuava.

## S11 · Os conhecidos-positivos, num guião que o `verify` corre

`scripts/provar-guardas.mjs`, novo, entra em `npm run verify` ao lado de `provar-eyetext.mjs`:

```
  guardas · 37 conferência(s) sobre os guardas de execução do bloco F0.4
  ✓ cada guarda recusa o que promete recusar e aceita o que promete aceitar.
```

Para cada guarda, um caso que tem de ser recusado e um que tem de passar, com a razão escrita ao lado. Os três que o brief da segunda passagem pediu por nome estão lá: **uma linha sem campo obrigatório** (`eLinha/sem-id`), **uma correção com `fields`** (`eCorrecao/fields-plural`) e **um manifesto sem `origin`** (`eManifestoDosRegistos/sem-origin`), cada um recusado com a sua frase.

## S12 · O que fica dito e não feito

1. `src/data/sobre.mjs` continua fora do programa, pela razão do §6 (é texto governado). O que muda com a segunda passagem é que a exclusão passa a ter prova mecânica de que não reentra.
2. `scripts/` continua fora até ao F4.2. A contagem de hoje muda com os tipos novos e volta a medir-se nesse bloco.
3. `astro check` continua sem correr, pela razão do §10, e os 337 erros que ele mede com um TypeScript 6 continuam por resolver.
