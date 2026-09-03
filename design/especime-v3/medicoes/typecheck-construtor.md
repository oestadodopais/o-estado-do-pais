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

## 12 · Os três códigos de saída locais

```
$ npm run build     → EXIT=0
$ npm run verify    → EXIT=0
$ npm run typecheck → EXIT=0
```

Lidos dos ficheiros de registo de cada corrida, e não de um `echo` a seguir a um redireccionamento.

## 13 · O que fica para os blocos seguintes

1. **`src/data/sobre.mjs`** entra no programa no dia em que uma entrada do registo o nomear com o resumo do dia (§6).
2. **`scripts/`**, 1 316 erros, é o F4.2 (§9).
3. **`astro check`**, 337 erros na camada `.astro`, espera por uma decisão de dependências: ou o `@astrojs/check` passa a aceitar o TypeScript nativo, ou a casa carrega um segundo TypeScript (§10).
4. **A linha de código em `src/i18n/strings.mjs`** (§3) é a única do bloco fora dos ficheiros deste construtor, e é uma linha.
