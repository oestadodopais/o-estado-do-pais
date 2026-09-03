# Bloco F1.8 · a moldura dos documentos alojados · o relatório do construtor

*Escrito pelo construtor (Claude Opus 5) a 03.09.2026, no ramo `moldura-2026-09-03` a partir de `origin/main` em `d447286f`. O bloco é o F1.8 do `PLANO-fiabilidade-2026-09-02.md` §3, e o brief é `design/observatorio/BRIEF-F1.8-moldura-dos-documentos.md`. Cada número aqui foi medido com o comando que está ao lado, nos dezasseis documentos alojados e nos dois temas que eles próprios declaram; onde o brief disse uma coisa e a medição disse outra, está escrito qual foi qual. Sem travessões na prosa.*

## 0 · O que ficou feito, e o que não

| item do brief §1 | estado | onde |
|---|---|---|
| 1 · `<main>` à volta do documento, faixa fora dele, um `<h1>` visível | feito | `src/lib/documentos.mjs:994`, `:1007`, `:1319`; portão em `scripts/gate-html.mjs:1224` |
| 2 · filetes das tabelas a 3:1 e texto das tabelas a 4,5:1, nos dois temas | feito para o texto PRÓPRIO das células; 50 nós de selos da obra citada ficam abaixo | `src/lib/documentos.mjs:1047`; §3 deste relatório |
| 3 · caixas com deslocamento focáveis, rotuladas, com as setas | feito, e alargado ao deslocamento vertical | `src/lib/documentos.mjs:1132` |
| 4 · o filete fora da paleta passa à cor da casa | feito, com `--rule-strong` e não `--g3` | §4 deste relatório |
| 5 · o provador dos bytes do F0.7 continua verde, com a geometria nova | feito | `src/lib/documentos.mjs:1218` |
| C1 · axe a 0 nas graves nos dezasseis | **não feito, e é decisão do diretor** | §3 |

A conta curta: as violações graves do axe nos dezasseis, nos dois temas, passam de **2 069 para 1 111**; os documentos com zero graves passam de **4 para 7**; as caixas que se deslocam sem teclado passam de **92 para 0**; os filetes abaixo de 3:1 passam de **18 936 para 0**; o texto próprio das células abaixo de 4,5:1 passa de **3 070 para 0**. O que resta são 1 111 nós de `color-contrast` no corpo das obras citadas, todos fora do que este bloco toca, e a §3 diz o que seria preciso decidir para lá chegar.

## 1 · Como se mede, e onde estão os números

A régua nova é `tests/documentos/moldura.mjs` (689 linhas). Não é um portão: não entra no `npm run build` e não constrói nada. Corre `axe-core` e o estilo calculado em Chromium 148 sem cabeça sobre `dist/`, nos 16 documentos × 2 temas = 32 passagens, a 1 280 px.

```
node tests/documentos/moldura.mjs                                   # esta árvore
node tests/documentos/moldura.mjs --json <ficheiro> --vermelhos     # com as plantas
OEDP_DIST=<outra construção> node tests/documentos/moldura.mjs      # o antes
```

O ANTES foi medido sobre a construção de `origin/main` em `d447286f`, extraída com `git archive origin/main | tar -x -C <pasta>` e construída lá (`npm ci` e `npm run build`, saída 0), e depois medida com a MESMA régua por `OEDP_DIST`. Sem isso os dois lados não eram comparáveis: uma régua escrita depois da mudança e corrida só depois da mudança não mede um antes, mede um depois.

A régua mede o âmbito da moldura quando ela existe e o corpo (menos a faixa) quando não existe, exactamente para que os dois lados contem as mesmas coisas. E **uma medição vazia não é um verde**: a primeira forma da régua dava C2 e C5 verdes sobre a construção antiga porque não encontrava moldura nenhuma e portanto não media nada. As duas células passaram a exigir que o número de coisas medidas seja maior do que zero.

## 2 · As medidas de aceitação, antes e depois

| # | medida | antes (`d447286f`) | depois | como se mede |
|---|---|---|---|---|
| C1 | axe a 0 nas graves («serious» e «critical»), 16 × 2 temas | **2 069** nós: `color-contrast` 2 021, `scrollable-region-focusable` 48. Documentos com 0 graves: **4 de 16** | **1 111** nós: `color-contrast` 1 111, `scrollable-region-focusable` **0**. Documentos com 0 graves: **7 de 16** | `tests/documentos/moldura.mjs`, célula C1 |
| C2 | filetes ≥ 3:1 e texto das tabelas ≥ 4,5:1, nos dois temas | filetes: 19 264 medidos, **18 936 abaixo de 3:1**, o pior **1,15:1**. Texto próprio das células: 17 014 medidos, **3 070 abaixo de 4,5:1**, o pior **2,63:1** | filetes: 19 264 medidos, **0 abaixo**, o pior **3,23:1**. Texto próprio das células: 17 014 medidos, **0 abaixo**, o pior **6,94:1** | célula C2 |
| C3 | caixas com deslocamento focáveis e rotuladas | 92 caixas · **92 sem teclado**, 92 sem nome, 92 sem marco | 92 caixas · **0 sem teclado**, 0 sem nome, 0 sem marco, 0 nomes repetidos | célula C3 |
| C4 | `<main>` a 1 e `<h1>` visível a 1 em cada um | **26 das 32 passagens sem `<main>` a um** (13 documentos); `<h1>` visível a 1 nas 32 | **0** sem `<main>` a um; `<h1>` visível a 1 nas 32; 0 com a faixa dentro da moldura | célula C4 |
| C5 | 0 cores fora da paleta nos filetes | **20 cores distintas, 20 fora da paleta**, entre elas `rgb(22, 85, 110)` (150 nós) e `rgb(111, 179, 204)` (150) | **2 cores distintas, 0 fora da paleta**: `rgb(127, 134, 129)` em claro e `rgb(142, 148, 143)` em escuro | célula C5 |
| C6 | o provador dos bytes verde e a planta vermelha | 16 de 16 verdes · 16 de 16 plantas apanhadas (provador do F0.7, sobre a construção de `origin/main`) | 16 de 16 verdes · 16 de 16 plantas apanhadas (provador com a geometria nova) | célula C6 |
| C7 | `build`, `verify`, `typecheck` a 0 | não se mediu no antes | **0, 0, 0** | os três comandos, saídas lidas de ficheiro |

Os três códigos de saída, lidos de ficheiro e não de um `echo` encadeado:

```
npm run build     > g-build.log 2>&1;     echo $? > g-build.exit       # 0
npm run verify    > g-verify.log 2>&1;    echo $? > g-verify.exit      # 0
npm run typecheck > g-typecheck.log 2>&1; echo $? > g-typecheck.exit   # 0
```

O `gate:html` e o `check:documentos` correm dentro do `build` e do `verify`, e os dois passaram nas duas corridas.

## 3 · O C1, que não se cumpriu, e porquê

O C1 pede zero violações graves. Ficaram **1 111**, todas de uma regra só, `color-contrast`, e a sua distribuição diz o que elas são:

```
node tests/documentos/moldura.mjs      # a linha «o axe, regra a regra»
  color-contrast [serious]  1111   ·  dentro de tabela: 50
  region [moderate]           32   (a faixa, que fica de fora do marco por desenho)
  heading-order [moderate]     4   (a ordem dos títulos da obra citada)
```

Nove documentos trazem o resto; sete estão a zero. E 1 003 dos 1 111 estão em quatro ficheiros:

```
  316  /en/studies/onde-esta-a-agua/document/
  313  /estudos/onde-esta-a-agua/documento/
  188  /en/studies/agua-nao-faturada/document/
  186  /estudos/agua-nao-faturada/documento/
```

Os pares de cor que os produzem são do PRÓPRIO documento, e são poucos e repetidos:

```
   80  #7a8895 sobre #ffffff · 3,63:1 · 12,5 px · P.psub
   80  #6e808d sobre #161e24 · 4,12:1 · 12,5 px · P.psub
   72  #7a8895 sobre #f7f8f9 · 3,41:1 · 12,5 px · DIV
   72  #6e808d sobre #0f1519 · 4,49:1 · 12,5 px · DIV
   ... 62 pares distintos ao todo
```

São o cinzento secundário com que essas obras compõem o seu texto de apoio, a 12,5 px. **A moldura não lhes toca, e é uma escolha e não um esquecimento.** Corrigi-los pela folha exigia uma de duas coisas, e nenhuma cabe neste bloco:

1. **Reescrever as fichas de cor de cada documento**, uma a uma, na folha da casa. São dezasseis folhas com nomes de ficha diferentes; escrever o valor de substituição de cada uma era escrever cores novas em código da casa, que o brief §2 proíbe pelo nome, e era a casa a redesenhar a tipografia de uma obra citada em cerca de dois mil nós.
2. **Achatar toda a cor do texto para a tinta**, dentro da moldura. Foi medido o custo antes de se decidir: apagava o código de cor com que essas obras distinguem tipos de fonte, níveis e estados, apagava a cor das ligações dentro das tabelas, e criava violações NOVAS onde há texto claro sobre fundo escuro dentro dos gráficos.

**É decisão do diretor**, e as duas hipóteses são as de cima. O que este bloco fez foi tudo o que se conserta sem tocar no que a obra citada quer dizer: as caixas sem teclado (48 nós, a zero), a grelha das tabelas, o texto próprio das células e os filetes de cor.

### 3.1 Os 50 que ficam dentro das tabelas

O brief §1.2 pede «o texto das tabelas a 4,5:1». O texto PRÓPRIO das células está a 0 abaixo de 4,5:1 (17 014 medidos, o pior 6,94:1). Ficam 50 nós, todos de elementos que declaram a sua PRÓPRIA cor dentro de uma célula:

```
   12  #009aa6 sobre #d6eff1 · 2,83:1 · 10 px · SPAN.tag src
   12  #189ca8 sobre #163239 · 4,10:1 · 10 px · SPAN.tag src     (escuro)
   10  #7a8a91 sobre #fafbf9 · 3,44:1 · 12,5 px · SPAN.chip tier-2
    6  #c85c15 sobre #f6e5da · 3,42:1 · 10 px · SPAN.tag prs
    6  #de7433 sobre #362c26 · 4,30:1 · 10 px · SPAN.tag prs     (escuro)
    2  #6486ce sobre #222f3f · 3,77:1 · 10 px · SPAN.tag inf     (escuro)
    2  #9a6212 sobre #f6ebd4 · 4,29:1 · 11 px · SPAN.chip soon
```

São os selos com que a obra citada diz de que TIPO é cada fonte (`src`, `prs`, `inf`) e em que nível está cada item (`tier-2`, `soon`). A regra da moldura é `[data-oedp-moldura] th, td { color }` e não `th *, td *`, exactamente para que um filho que declare a sua cor a mantenha. Achatá-los é possível numa linha e o custo está medido: nos selos com pastilha (`tag src`, `tag prs`, `chip soon`) a distinção sobreviveria pelo fundo; no `chip tier-2` sobreviveria só pelo peso da letra; e as ligações dentro de células perderiam a cor de ligação. **Fica também para o diretor**, na mesma decisão da §3.

## 4 · Onde o brief diz `--g3` e a medição diz `--g2`

O brief §1.4 manda o filete fora da paleta passar «à cor da casa que a folha define para filetes (`--g3`, o cinza dos filetes)». O brief §1.2 manda, na linha acima, os filetes a pelo menos 3:1. **As duas coisas não podem ser verdade ao mesmo tempo**, e é a `tokens.css` que o diz, no comentário que ela própria escreve ao lado da ficha:

```
--g3: #d9ddd8;   /* grelha e molduras · 1,28:1, decoração */
--g2: #7f8681;   /* eixos e fronteiras · 3,47:1 */
```

Em escuro, `--g3` é `#3a3f3c` (1,67:1) e `--g2` é `#8e948f` (5,80:1). O filete da moldura é por isso **`--rule-strong`**, que a folha define como `var(--g2)`, e não `--rule`, que é `var(--g3)`. Não é uma cor nova nem uma cor de fora: é a outra ficha de filete da mesma folha, escolhida por a medida de aceitação ser um número e o nome da ficha não ser. É também a mesma escolha, pela mesma razão, que o F0.7 já tinha feito no fio da faixa quando mediu `--g3` a 1,28:1 e passou à tinta.

Medido depois: as duas únicas cores de filete da moldura nos dezasseis são `rgb(127, 134, 129)` (que é `#7f8681`) em claro e `rgb(142, 148, 143)` (que é `#8e948f`) em escuro, e o pior contraste medido nos 19 264 filetes é 3,23:1. O 3,23 e não o 3,47 porque nem todos os filetes assentam no papel da casa: assentam nos fundos das próprias tabelas.

## 5 · A geometria nova, e o que a prova dos bytes passou a fazer

O que a casa acrescenta a um documento, por ordem no ficheiro:

```
<body>  [a faixa]  <style>a folha da moldura</style><script>o guião</script>
        <main data-oedp-moldura>   … o documento, byte a byte …   </main>
        </body>
```

Três coisas mudam de sentido e todas estão escritas no código:

**A regra da casa mudou de palavras e não de sentido.** Dizia «abaixo da faixa não se mexe um byte». Com o corpo dentro de um elemento da casa isso passaria a ser falso à letra, e a frase nova é a que o provador confere: *os bytes do documento são os mesmos, na mesma ordem, e o que a casa acrescenta é uma abertura e um fecho de comprimento conhecido*.

**A prova das fatias passou de uma subtracção a quatro.** Descasca o construído pelo fim: a cauda (do primeiro `</body>` de verdade até ao fim), o fecho da moldura, **os bytes do corpo** e a abertura da moldura. É a terceira fatia que apanha um carácter mudado no meio do documento, e é sobre ela que a régua planta o conhecido-positivo. As três cadeias que o provador conhece (`MARCA_DOS_ROBOS` e as duas da moldura) são fixas e não dependem da língua: ele continua a não saber compor nada da casa, que é o que o torna uma prova e não um espelho.

**Três documentos levam um `<div>` e não um `<main>`.** `evora-economia-investidores-portas-abertas-2026/pt`, `alentejo-algarve/en` e `which-door-is-yours/en` já trazem um `<main>` seu. Um `<main>` dentro de outro é markup inválido e dois marcos principais são um defeito: nesses, a moldura é um `<div>` com a mesma marca. A escolha lê-se do documento de origem e o provador refá-la por si.

### 5.1 Onde o fecho entra, e a medição que o decidiu

O `</main>` entra antes do **primeiro** `</body>` de verdade, e não do último. Três dos dezasseis trazem `</body></html>` repetido no fim (`agua-nao-faturada/en` e `onde-esta-a-agua/en` duas vezes, `onde-esta-a-agua/pt` três), e este último tem um `<!doctype html><html><head></head><body>` inteiro DENTRO do corpo do primeiro. O analisador do navegador fecha o corpo no primeiro fecho; a casa fecha a moldura no mesmo sítio.

### 5.2 O portão pergunta por posição, e a medição que o obrigou

A primeira forma do portão novo perguntava à árvore (`root.querySelectorAll('main')`) e **chumbou `onde-esta-a-agua/pt`**, que está bem. Medido nos dois analisadores:

```
Chromium 148   body > [DIV[faixa], STYLE, SCRIPT, MAIN[moldura]]   ·  main = 1
node-html-parser (o do portão, com `comment: false`)               ·  main = 0
```

O que o portão quer saber é o que o LEITOR recebe, e o leitor recebe a árvore certa. Conta-se por posição no ficheiro, com um leitor de etiquetas próprio do portão (`scripts/gate-html.mjs:1063`), que não é o do módulo: uma conferência que usasse o código do módulo confirmava-se a si própria. É a mesma escolha, escrita pela mesma razão, que o ponto 7 do mesmo portão já fazia na marca dos robôs.

## 6 · O guião, e a linha que ele não atravessa

`tabindex`, `role` e `aria-label` são atributos, e um atributo só entra numa caixa do documento mexendo nos bytes dela. É a única coisa deste bloco que não se resolve pela folha, e por isso é a única que leva guião (`src/lib/documentos.mjs:1132`, uma função anónima imediata, sem pedidos de rede, sem escrever nem apagar uma palavra da página).

**O essencial não depende dele.** Sem guião, o documento lê-se inteiro, com a moldura, com os filetes corrigidos e com as tabelas onde estão; o que falta é chegar de teclado a uma caixa que se desloca. É a linha que o brief traça, «sem guião novo para o essencial».

Duas coisas que o guião faz e o brief não pediu, e ambas se medem:

- **apanha também o deslocamento vertical.** O brief fala de caixas com deslocamento horizontal; o axe conta as duas direcções na mesma regra, e das 92 caixas medidas há-as das duas. Deixar as verticais de fora era deixar o mesmo defeito por corrigir com outro nome;
- **os nomes são únicos na página.** A primeira forma dava o mesmo nome a caixas irmãs e criou 12 nós de `landmark-unique` que antes não existiam. Onde há repetição, todas as do grupo levam a sua ordem, e a regra voltou a zero.

## 7 · As capturas

Em `design/especime-v3/capturas/moldura-2026-09-03/`, 20 ficheiros PNG, dois documentos (`evora-prometido-pago-auditado-2026`, edição pt e edição en) a 390 e a 1 280, antes e depois, com o tema escuro do português a 1 280 também:

```
topo-<pt|en>-<390|1280>[-escuro]-<antes|depois>.png      a faixa, o <h1> e o seu fio
tabela-<pt|en>-<390|1280>[-escuro]-<antes|depois>.png    a grelha e a caixa que se desloca
```

O que se vê no par `tabela-pt-1280-antes` / `-depois`: os filetes da grelha passam do cinzento de 1,2:1 ao `--g2`, o texto dos cabeçalhos das colunas passa do cinzento ao tinta, e as pastilhas azuis com que a obra codifica os seus valores ficam onde estavam. No par `topo-pt-390`: o fio por baixo do `<h1>` e a barra do `h2::before` deixam de ser `#16556E`. A faixa não mudou num pixel.

## 8 · O que se acrescentou às dependências

`axe-core` **4.13.0**, e só como dependência de desenvolvimento, com a versão presa ao exacto (`npm install --save-dev --save-exact axe-core`). Não era dependência do projeto e não entra em nada que seja servido: é usada pela régua deste bloco e por mais nada. Nenhum outro pacote entrou.

## 9 · O que um leitor a frio deve tentar partir

1. **A terceira fatia da prova.** Mudar um carácter no corpo de um documento construído e ver o `check:documentos` e o `gate:html` fecharem. A régua já o faz nos dezasseis, mas a régua é minha.
2. **A ordem da faixa e da moldura.** Pôr a faixa dentro da moldura no HTML construído e ver o portão apanhá-lo pela posição.
3. **O `:has(> table)`.** Está em regra própria de propósito, para que um motor sem `:has()` a deixe cair sem levar a grelha atrás. Confirmar que a grelha continua corrigida com essa regra removida.
4. **A guarda do tema.** A moldura segue `prefers-color-scheme` porque as dezasseis obras a seguem; a faixa não segue tema nenhum (Emenda 12). Confirmar que nenhuma das duas fica ilegível com o sistema em escuro e `data-theme="light"` no `:root`.
5. **O `!important`.** São quatro propriedades declaradas autoritárias (a cor dos filetes da grelha, a cor do texto das células, o fio do `<h1>` e a barra do `h2::before`) e nenhuma mais. Procurar uma quinta.

## 10 · O ramo e a corrida

```
ramo:   moldura-2026-09-03, a partir de origin/main d447286f
SHA:    b66e3ba7 (a cabeça depois da segunda passagem e das quatro fusões de origin/main)
corrida `portao`: 33804407060, verde em 17m54s
```

Não fundido em `main`, por ordem do brief.

## Segunda passagem (Claude Sonnet 5, 03.09.2026)

*Escrita pelo medidor (Claude Sonnet 5), na mesma worktree, sobre a lista exacta de sete achados que a leitura a frio do Codex confirmou como reais e o lugar de direção mandou consertar (Blocking 4, Major 6 a 10, Minor 11; os Blocking 1 a 3 e o Major 5 eram plantas do pacote dado ao Codex, não bugs do código desta árvore, e não entram aqui). Cada número desta secção foi medido nesta árvore, com `tests/documentos/moldura.mjs` corrido sobre `dist/` depois do `npm run build`, ou computado pela mesma fórmula de contraste que a régua usa, num guião à parte, sobre os valores que o axe-core ou o `getComputedStyle()` devolveram. Sem travessões.*

### Blocking 4 · as cores do texto das obras, uma a uma, nunca achatadas

O C1 pedia zero violações graves e ficaram 1 111, todas `color-contrast`, todas do texto das PRÓPRIAS obras. A decisão do lugar de direção: não achatar as cores das obras para a tinta da casa, e não as reescrever à mão; onde uma cor do texto falha 4,5:1 (ou um objecto de interface falha 3:1), substitui-se pela sombra mais próxima da MESMA matiz e saturação que passa, mais escura em claro e mais clara em escuro.

**Como se mediu a lista.** As 1 111 violações agrupam-se, pelo par exacto de cor e fundo que o axe-core reporta no seu próprio campo `data` (não recalculado por mim), em 69 combinações distintas. Extraídas as nove obras onde caem, e para cada uma lida a folha `<style>` de origem, confirma-se que NENHUMA cor de texto vem escrita célula a célula: todas saem de uma meia dúzia de fichas CSS próprias de cada obra (`--ink-3`, `--teal`, `--blue`…, cada uma no `:root` dessa obra, com o seu próprio bloco escuro). `.tag.src{color:var(--teal)}`, `.psub{color:var(--ink-3)}`, `.chip.tier-2{color:var(--chip-2)}`, e por aí fora: confirmado lendo a fonte de cada uma das seis obras envolvidas, não adivinhado do nome da classe.

Isso muda o mecanismo por completo: em vez de reescrever selectores, `src/lib/documentos.mjs` (nova secção, «OS AJUSTES DE COR DENTRO DAS OBRAS») redeclara a FICHA no elemento que a moldura já envolve (`[data-oedp-moldura]`), com uma cor computada por uma função de ajuste (`ajustaParaContraste()`: converte para HSL, escurece ou aclara em passos de 0,1% até passar o alvo, mantendo a matiz e a saturação). Como cada documento é o seu próprio ficheiro construído, uma regra escrita para `agua-nao-faturada` não existe no ficheiro de `evora-quinze-anos-cinco-mandatos`: nenhum atributo novo precisou de se acrescentar à moldura para isolar os documentos entre si.

**A lista completa, medida com o pior fundo de cada ficha em cada tema** (o fundo é o mais desfavorável entre TODOS os nós que a violação atingia, não o primeiro que apareceu):

| obra | ficha | tema | pior fundo medido | antes | depois (computado) |
|---|---|---|---|---|---|
| agua-nao-faturada, onde-esta-a-agua | `--ink-3` | claro | `#f1f3f5` | `#7a8895` | `#63707c` |
| agua-nao-faturada, onde-esta-a-agua | `--ink-3` | escuro | `#1c262d` | `#6e808d` | `#7e8e9a` |
| agua-nao-faturada, onde-esta-a-agua | `--teal` | claro | `#cfe9ec` | `#009aa6` | `#006d75` |
| agua-nao-faturada, onde-esta-a-agua | `--teal` | escuro | `#163239` | `#189ca8` | `#1aa7b4` |
| agua-nao-faturada, onde-esta-a-agua | `--blue` | claro | `#dae0ed` | `#3f62b0` | `#3e60ac` |
| agua-nao-faturada, onde-esta-a-agua | `--blue` | escuro | `#222f3f` | `#6486ce` | `#7c98d5` |
| agua-nao-faturada, onde-esta-a-agua | `--orange` | claro | `#efdfd5` | `#c85c15` | `#9e4911` |
| agua-nao-faturada, onde-esta-a-agua | `--orange` | escuro | `#362c26` | `#de7433` | `#e07c3f` |
| agua-nao-faturada, onde-esta-a-agua | `--olive` | claro | `#f7f8f9` | `#6e9e1f` | `#577d18` |
| evolucao-de-portugal-desde-1981 | `--ink-3` | claro | `#f2f4f7` | `#828a93` | `#687079` |
| alentejo-algarve | `--ink-3` | claro | `#f5f4f1` | `#8a877e` | `#726f67` |
| alentejo-algarve | `--ink-3` | escuro | `#232322` | `#807d74` | `#8d8a81` |
| alentejo-algarve | `--algarve` | claro | `#fcfcfb` | `#0e7fa3` | `#0e7ea1` |
| alentejo-algarve | `--alentejo` | claro | `#fcfcfb` | `#a9741a` | `#9b6a18` |
| evora-prometido-pago-auditado-2026 | `--chip-2` | claro | `#fafbf9` | `#7a8a91` | `#67767c` |
| which-door-is-yours | `--muted` | claro | `#e3e7e2` | `#5a6b70` | `#59696e` |
| which-door-is-yours | `--soon` | claro | `#f6ebd4` | `#9a6212` | `#955f11` |

Dezassete correcções, oito fichas onde só o tema que falhava leva entrada (o `--olive` escuro, o `--ink-3` escuro de duas obras, o `--algarve`/`--alentejo` escuros, o `--chip-2` escuro e o `--muted`/`--soon` escuros já passavam sozinhos, e ficam exactamente como a obra os escreveu). As outras sete obras dos dezasseis não entram: não tinham nenhuma violação de `color-contrast` a corrigir.

**Um ajuste feito de propósito não pegava à primeira**, e fica dito porque é o tipo de erro que uma medição a mais apanha e uma medição a menos deixa passar: os selos `.tag.src`, `.tag.inf` e `.tag.prs` da água pintam o seu PRÓPRIO fundo com `color-mix(in srgb,var(--teal) 16%,transparent)`, a MESMA ficha que dá a cor do texto. Um primeiro ajuste, calibrado só contra o fundo medido ANTES da correcção, deixava 59 nós ainda abaixo de 4,5:1 (entre 4,16 e 4,44:1) porque escurecer a ficha também escurece os 16% do fundo do seu próprio selo. A correcção (`misturaFundo` em `AjusteDeCor`) recompõe o fundo a cada passo do ajuste, contra o pano por trás da mistura e não contra o número medido antes: com ela, `node tests/documentos/moldura.mjs` mede 0 nós `color-contrast` em qualquer impacto, nos 16 documentos × 2 temas.

**C1, medido antes e depois desta passagem**: 1 111 nós `color-contrast` (nove obras) → **0**, em 64 passagens (dezasseis documentos × dois temas × duas larguras, Major 8, abaixo). Os 50 nós dentro de tabela que o C2 do relatório original media entre 2,83:1 e 4,30:1 estão dentro destes 1 111 e resolvem-se pelo mesmo mecanismo: são os mesmos `.tag.*`/`.chip.*` medidos dentro de uma célula.

### Major 6 · o C5 escrito como a decisão pede

A decisão: **a moldura e os filetes das tabelas usam só cores da casa; as cores interiores das obras ficam das obras, excepto onde o contraste falha (Blocking 4)**. É esta a frase que substitui a leitura anterior de C5, e o código já a cumpre à letra, porque as duas coisas vivem em mecanismos diferentes desde a origem:

- `[data-oedp-moldura] table, ... td{border-color:var(--oedp-rule-strong)!important}` e as suas variantes (`h1`, `h2::before`, e agora `estiloDoFileteReforcado()`, Major 7) só escrevem fichas de `tokens.css`, resolvidas e comparadas pela régua contra a lista completa da folha da casa (célula C5, que só olha para `coresDosFiletes`);
- `estiloDosAjustesDeCor()` (Blocking 4) redeclara fichas PRÓPRIAS de cada obra (`--ink-3`, `--teal`…) com sombras da MESMA matiz, nunca com uma cor da casa; a régua mede-as em C1/C2 (contraste), nunca em C5 (paleta), porque C5 só olha para `coresDosFiletes` e as cores das obras nunca lá entram.

Medido: C5 continua a listar só as cores que a moldura declara suas (agora 4 distintas: `--rule-strong`/`--g2` em claro e escuro, mais `--ink` em claro e escuro, pelos dois filetes reforçados do Major 7), e 0 fora da paleta. As dezassete cores de obra do Blocking 4 nunca entram nesta lista, e é assim que a regra fica escrita no cabeçalho da célula (`tests/documentos/moldura.mjs`, C5).

### Major 7 · o filete contra os dois fundos, e a `opacity` que faltava

A régua só olhava para o fundo do elemento-mãe. `piorContraste()` (nova função em `medeNaPagina()`) mede agora contra os DOIS fundos que um filete toca (o composto pelo PRÓPRIO elemento e o do elemento-mãe) e guarda o pior, que é o que a WCAG 2.1 §1.4.11 pede: distinguir-se de CADA fundo que o toca.

Medir os dois lados nos dezasseis documentos revelou dois sítios onde `--rule-strong` não chega a 3:1 mesmo assim, e revelou também um segundo problema, mais fundo: a `opacity` de um elemento não é o alfa do seu fundo, e `fundoDe()` ignorava-a por completo. A fileira que assinala um mandato em `evora-quinze-anos-cinco-mandatos` (`tr.boundary td{background:var(--series-1-soft);opacity:.85}`) esbate o PRÓPRIO filete, e não só o fundo, contra o que está atrás: sem contar a opacidade, um filete que parecia passar a 3,18:1 (escalado a `--g1`) media, de facto, 2,49:1. A correcção (`filetEfetivo()`, que trata `opacity` como um multiplicador do alfa do fundo desse nó, algebricamente equivalente a compor cada nó com `sobre()`) apanha o efeito nos dois lados, e é essa versão que decidiu a correcção final:

| onde | tema | antes (`--rule-strong`, com `opacity`) | depois (`--ink`, com `opacity`) |
|---|---|---|---|
| `evora-quinze-anos-cinco-mandatos`, `tr.boundary td` | claro | 1,57:1 | 5,97:1 |
| `evora-quinze-anos-cinco-mandatos`, `tr.boundary td` | escuro | 2,34:1 | 5,84:1 |
| `which-door-is-yours`, `table thead th` (sem `opacity`) | claro | 2,98:1 | 14,10:1 |

Os dois selectores sobem ao degrau mais escuro da casa, `--ink` (`estiloDoFileteReforcado()`, `src/lib/documentos.mjs`, ao lado de `estiloDosAjustesDeCor()`): é a mesma escolha, pela mesma razão, que o F0.7 fez no fio da faixa quando `--g3` não chegava. `--oedp-ink` já estava declarado nos dois temas por `estiloDaMoldura()` (é a ficha do texto das células), e por isso a regra nova não precisa da sua própria metade escura.

**Um efeito colateral descoberto no caminho, e corrigido**: o Chromium serializa um `color-mix()` como `color(srgb r g b / a)`, com os canais em 0 a 1 e não em 0 a 255. A leitura de cor da régua (`cor()`, em `medeNaPagina()`) só apanhava números com uma expressão regular e lia 0,43 como se fosse quase preto; isso fazia os selos `tag src/prs/inf` dentro de tabela medirem, no diagnóstico interno «o que a moldura não corrige» (`saida.selos`), abaixo de 4,5:1 mesmo depois de corrigidos pelo Blocking 4, quando o axe-core (que resolve a cor à parte, correctamente) já os media a passar com folga (4,81:1 a 4,84:1, medido directamente no campo `data` do axe). Corrigido `cor()` para reconhecer a forma `color(espaço r g b / a)`: o diagnóstico interno lê agora **0 nós** «que a moldura não corrige», que é o que de facto se vê no ecrã.

### Major 8 · as duas larguras, dentro do `verify`

A régua corria só a 1 280 e não entrava em nenhum comando oficial. Corre agora a 390 E a 1 280 (`LARGURAS`, em `tests/documentos/moldura.mjs`), nos dois temas, e `npm run verify` chama-a (`check:moldura`, novo script em `package.json`, entre `gate:html` e `check:fontes`). Medido: a passagem limpa (sem `--vermelhos`) corre em 85 s nesta máquina, 64 passagens; a corrida com as quatro plantas (`--vermelhos`, cinco passagens completas) em 7 min 7 s. Por isso `--vermelhos` fica fora do `verify` (o custo é cinco vezes o de uma corrida), e dentro do relatório (abaixo).

A largura pequena não é decorativa: das 326 caixas que se deslocam medidas nos 64 (dezasseis × dois temas × duas larguras), uma parte só se desloca a 390 (a 1 280 muitas tabelas cabem inteiras). Sem a largura pequena, essas caixas nunca entravam na contagem do C3, e um estrago que só as afectasse nunca era apanhado.

### Major 9 · uma planta que não pega faz a corrida cair

A primeira forma calculava `bom` (o HTML mudou, uma célula nomeada caiu, essa célula estava verde antes) e só o usava para escolher a cor do símbolo no ecrã; a saída de `--vermelhos` olhava só para a corrida limpa. Agora `plantaMa` acumula-se por cada planta falhada e entra na mesma condição de saída que as células vermelhas: uma planta que não pega faz `process.exit(1)`, com uma linha própria a dizer qual.

**As saídas das quatro plantas, medidas nesta árvore** (`node tests/documentos/moldura.mjs --vermelhos --json design/especime-v3/medicoes/moldura-2026-09-03-segunda-passagem.json`, guardado por inteiro no campo `plantas` desse ficheiro):

```
✓ moldura-fora · tirar a abertura da moldura
    o HTML mudou: sim · verdes antes: C4, C5 · caíram: C1, C2, C3, C4, C5 · das nomeadas: C4, C5
✓ filete-turquesa · o filete da grelha volta à cor de fora da paleta
    o HTML mudou: sim · verdes antes: C2, C5 · caíram: C2, C5 · das nomeadas: C2, C5
✓ texto-da-celula · tirar a regra da cor do texto das células
    o HTML mudou: sim · verdes antes: C2 · caíram: C1, C2 · das nomeadas: C2
✓ sem-guiao · tirar o guião da moldura
    o HTML mudou: sim · verdes antes: C1, C3 · caíram: C1, C3 · das nomeadas: C1, C3
```

As quatro pegam (`bom: true` nas quatro, no JSON), e a corrida sai a 0 com «todas as plantas pegaram» a seguir a «todas as células verdes».

### Major 10 · o SHA, a corrida, o JSON

O resultado desta medição está guardado, por inteiro, em `design/especime-v3/medicoes/moldura-2026-09-03-segunda-passagem.json` (1,7 KB): as seis células, o axe regra a regra, os selos (vazios), a contagem de caixas e as quatro plantas com o seu `nomeadas`/`verdesAntes`/`bom`. O SHA da cabeça e o número da corrida `portao` ficam na tabela abaixo, preenchidos depois do `push` (não podiam sê-lo antes: são factos da corrida, não do código).

```
ramo:              moldura-2026-09-03
SHA da cabeça:     b66e3ba7
corrida `portao`:  33804407060, verde em 17m54s (https://github.com/oestadodopais/o-estado-do-pais/actions/runs/33804407060)
```

Entre o `push` que fechou a lista de sete achados e este SHA, `origin/main` moveu-se quatro vezes (fundido a cada uma: `3093b72b`, depois `d82bc4cf`) e a primeira corrida sobre a cabeça fundida (`33802765663`) caiu: `check:moldura`, o portão novo do Major 8, é o primeiro desta árvore a abrir um Chromium, e `npm ci` só instala a biblioteca do Playwright, nunca o motor que ela pilota. Um commit a mais (`b66e3ba7`, «O portão instala o Chromium do Playwright antes de correr», em `.github/workflows/portao.yml`) e a corrida seguinte fechou verde.

### Minor 11 · o `<h1>` visível, o `role` exacto, o `aria-labelledby` que aponta para alguém

Três conferências mais fracas do que o nome dizia, todas em `tests/documentos/moldura.mjs` salvo a primeira:

1. **`<h1>` visível** (`scripts/gate-html.mjs`, a conferência estática, e a célula C4 da régua, a dinâmica). O portão estático ganhou `h1EscondidoNaEtiqueta()`: recusa um `<h1>` com `hidden`, `aria-hidden="true"` ou `display:none`/`visibility:hidden` dentro do PRÓPRIO `style` em linha (não apanha uma regra de folha por selector: isso é trabalho da régua em navegador). A régua ganhou `visivel()`: além de `getClientRects().length>0` (que já apanhava `display:none`), confere `getComputedStyle(el).visibility!=='visible'` e `el.closest('[aria-hidden="true"]')`. Medido nos dezasseis: 0 `<h1>` escondidos, nos dois portões.
2. **O `role` tem de ser `region`**, e não qualquer valor não vazio. `semPapel` media antes `!c.papel`; agora exige `c.papel==='region'`, com uma excepção medida e não adivinhada: um `role="tablist"` já existente (a barra de separadores de `evolucao-de-portugal-desde-1981`, com os seus `role="tab"` por baixo) fica com o seu, porque o guião da moldura só escreve `region` onde a obra não declarou papel nenhum, e um `tablist` é um papel mais específico e correcto, não uma omissão. `presentation` e `none`, que apagam o marco em vez de o dar, continuam a falhar. Medido: 326 caixas, 0 sem marco.
3. **`aria-labelledby` tem de apontar para um `id` que existe.** `labelledbyValido()` verifica cada `id` que o atributo lista (pode listar mais do que um) contra `document.getElementById()`; um `id` ausente já não conta como nome. Medido: nenhuma das 326 caixas usa `aria-labelledby` hoje (todas levam `aria-label` do guião ou já tinham o seu), e por isso a conferência não muda o resultado, só a garantia.

### C1 a C7, medidos outra vez

| # | medida | antes desta passagem | depois desta passagem |
|---|---|---|---|
| C1 | axe a 0 nas graves | **1 111** nós `color-contrast` (9 obras), 32 passagens | **0** nós, em qualquer impacto, 64 passagens (2 larguras × 2 temas × 16) |
| C2 | filetes ≥ 3:1 (2 fundos), texto das tabelas ≥ 4,5:1 | filetes: 19 264 medidos, 0 abaixo de 3:1 contra 1 fundo só; celulas: 17 014 medidos, 0 abaixo de 4,5:1; selos: 50 nós entre 2,83:1 e 4,30:1 fora da célula | filetes: **38 528** medidos, **0** abaixo de 3:1 contra os 2 fundos (o pior 3,23:1); celulas: **34 028** medidos, **0** abaixo de 4,5:1 (o pior 7,57:1); selos: **0** nós (Blocking 4 chega lá por outra via) |
| C3 | caixas com teclado, nome, marco | 92 caixas (1 largura), 0 sem teclado/nome/marco | **326** caixas (2 larguras), 0 sem teclado, 0 sem nome (com o `aria-labelledby` verificado), 0 sem marco (com `region` exacto e a excepção do `tablist`) |
| C4 | `<main>` a 1, `<h1>` visível a 1 | 32 passagens, 0 sem `<main>`, 0 sem `<h1>` visível (só `getClientRects`) | 64 passagens, 0 sem `<main>`, 0 sem `<h1>` visível (`getClientRects` + `visibility` + `aria-hidden`) |
| C5 | frame e filetes só com paleta da casa; interior das obras por contraste | 20 cores → 2, 0 fora da paleta (regra não escrita explicitamente) | **2 → 4** cores (mais `--ink` claro/escuro dos 2 filetes reforçados), 0 fora da paleta; regra escrita: frame e filetes contra a paleta, interior contra o contraste (Major 6) |
| C6 | provador dos bytes, verde e depois vermelho | 16 de 16 verdes, 16 de 16 plantas apanhadas | **inalterado**: 16 de 16 verdes, 16 de 16 plantas apanhadas (a moldura não mudou de geometria nesta passagem) |
| C7 | `build`, `verify`, `typecheck` a 0 | não medido no antes desta passagem | `npm run build` → **0**; `npm run verify` (agora com `check:moldura` lá dentro) → **0**; `npm run typecheck` → **0**; os três lidos de ficheiro, nunca de um `echo` encadeado |

### O que fica

Os sete achados da lista (Blocking 4, Major 6 a 10, Minor 11) estão resolvidos e medidos a zero. Três coisas ficam fora, por não estarem na lista e por não as ter medido a falhar:

1. **As vinte capturas de `design/especime-v3/capturas/moldura-2026-09-03/`** são do construtor e não se refizeram: `evora-prometido-pago-auditado-2026` recebeu uma correcção do Blocking 4 (`--chip-2`, o selo `tier-2`) que as capturas «tabela» de ambas as edições não mostram. As capturas «topo» (o `<h1>` e o seu fio) não mudam: este documento não está no `FILETE_REFORCADO` do Major 7.
2. **A opacidade só se corrigiu onde a medição a mostrou a falhar** (o filete de `evora-quinze-anos-cinco-mandatos`): o mecanismo (`filetEfetivo()`) é geral e aplica-se a qualquer filete que a régua meça, mas não houve uma auditoria à parte a `opacity<1` fora dos filetes (por exemplo, sobre o texto das obras); nenhuma dessa classe de violação apareceu nas 1 111 do Blocking 4.
3. **O guião da moldura só segue `prefers-color-scheme`**, não o interruptor manual de tema de uma obra (`data-theme`, alternado por um botão dentro do documento, sem relação com o tema do sistema): é a mesma fronteira que `estiloDaMoldura()` já tinha antes desta passagem (documentada aí), e nem os ajustes de cor do Blocking 4 nem o filete reforçado do Major 7 a alargam nem a estreitam. A régua, que só varia `colorScheme` no navegador e nunca carrega no interruptor de uma obra, não a exercita.
