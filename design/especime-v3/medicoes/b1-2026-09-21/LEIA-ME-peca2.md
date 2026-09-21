# B1, segunda peça: os lugares

Ramo: `b1-peca2-2026-09-21`, sobre `0cfd9832`. Doze commits, sem push. **Os três
portões correram na cabeça do código, `992fcd1d`, que é o décimo primeiro
commit; o décimo segundo é este relatório com as capturas e as medições, e não
toca em `src/`, em `scripts/`, em `tests/`, em `ledger/` nem em `vercel.json`.**
Construtor: Claude Opus 5 (1M de contexto). Nenhuma linha de `ledger/claims/` foi tocada; nenhum número foi
escrito à mão.

## As cinco partes do mandato, e a medida de cada uma

| # | o que | a medida |
|---|---|---|
| 1a | O tema de cada medida de concelho, declarado em `src/data/temas-das-medidas.mjs` | nove chaves com tema (as oito do ficheiro do motor mais `ganho`), três temas da carta; `check:lugares` T1 e T2 a 0, com 4 928 medidas rendidas em 616 páginas, todas debaixo do tema que a tabela lhes dá; duas plantas |
| 1b | A região e o distrito de cada concelho, lidos dos três extratos da Carta, em `src/data/carta-dos-lugares.mjs` | 308 concelhos, 29 distritos e ilhas, 9 regiões, lidos dos ficheiros; 0 sem região, 0 sem distrito; as duas regiões autónomas ligadas a `regioes.mjs` por correspondência de nome declarada; `check:lugares` C1 a C4 a 0; duas plantas |
| 2 | A página do lugar, pela maqueta | as 616 páginas com a linha, o nome, a leitura, os números por tema, os estudos e (onde há registo) o que mudou; 56 capturas sem deslocamento lateral; `check:lugar` 8.17 refeito para a linha do lugar, a 0 |
| 3 | A página dos lugares, os redirecionamentos e o menu | `/lugares` e `/en/places` com o mapa, a busca, 9 regiões e 29 distritos; quatro entradas 301 conferidas pelo portão de HTML; o menu com «Lugares» no lugar de «Concelhos» e «Distritos» |
| 4 | O corte das duas frases nas páginas de região e de distrito | a frase de abertura do distrito e o parágrafo dos níveis das duas, a 0 nas 18 + 58 páginas |
| 5 | O inventário das frases destas famílias | 65 linhas retiradas com a razão, 14 apagadas por não se renderem em lado nenhum, 10 novas; `check:voz` a 0 com a lista fechada |

**As capturas «antes»** foram tiradas pelo lugar de direção, de `main`
(`97d2cbc`), e estão na mesma pasta com o seu guião e as suas medidas
(`captar-antes-peca2.mjs`, `capturas-antes-peca2.json`): Évora, `/municipios`, a
região do Alentejo e o distrito de Évora, a 390 e a 1 280, em português.

**A passagem de correção de 21.09.2026 está no fim deste ficheiro**, e o que ela
mudou nas secções acima fica dito lá: esta parte descreve a construção.

## As duas tabelas declaradas, os portões e as plantas

**(a) O tema de cada medida** · `src/data/temas-das-medidas.mjs`. Nove pares
chave-tema: `populacao` em população; `desempregoRegistado` e `ganho` em
trabalho; `divida`, `limite`, `indice`, `pmp`, `poderDeCompra` e `empresas` em
economia e finanças públicas. `limite` não tem cartão e tem tema, porque o portão
confere a tabela contra as chaves do ficheiro do motor e uma chave sem tema é um
buraco à espera do dia em que ela ganhar cartão.

**(b) A região e o distrito de cada concelho** · `src/data/carta-dos-lugares.mjs`,
lido de `public/dados/caop-2025-municipios-{continente,acores,madeira}.csv`
(colunas `dtmn`, `municipio`, `distrito_ilha`, `nuts2`). O módulo não tem uma
função de distrito para região, e diz porquê: seis distritos têm concelhos em
duas regiões (Aveiro, Guarda, Leiria, Lisboa, Setúbal, Viseu; 102 dos 308). A
única coisa escrita no ficheiro são duas correspondências de nome, as das regiões
autónomas, porque a Carta escreve o nome oficial inteiro e `regioes.mjs` usa a
forma curta.

**O portão** é `scripts/check-lugares.mjs`, novo, no `build` e no `verify`, com
seis células (C1 as três contagens, C2 região e distrito de cada concelho, C3
cada região da Carta com entrada, C4 a base do índice do poder de compra lida da
unidade de cada linha, T1 cada chave com tema, T2 cada medida rendida debaixo do
seu tema).

**As seis plantas** (`plantas-peca2.json`, uma saída por planta em
`planta-<nome>.txt`) deram todas código diferente de zero com a falha esperada e
repuseram os bytes originais (sha256 igual antes e depois):

| planta | o que planta | a mordida |
|---|---|---|
| C1-um-concelho-a-menos | tira uma linha ao extrato da Madeira | «os três extratos da Carta dão 307 concelhos» |
| C3-uma-regiao-sem-entrada | troca «Centro» por «Centreo» na linha de Águeda | «essa região não tem entrada em src/data/regioes.mjs» |
| T1-uma-medida-sem-tema | tira `pmp` da tabela dos temas | «a medida "pmp" não tem tema» |
| T2-uma-medida-no-tema-errado | põe o cartão da população debaixo de «trabalho» em `dist/` | «rende-se debaixo de "trabalho" e a tabela dá-lhe "populacao"» |
| 8.17-a-linha-do-lugar-sem-uma-parte | tira a região à linha de Águeda em `dist/` | «páginas de concelho sem o mapa da sua unidade: 1» |
| B1-lugares-um-destino-trocado | troca o destino de `/municipios` em `vercel.json` | «tem de ter uma entrada 301 incondicional para /lugares/» |

## A regra de paragem: os três casos em que um portão mandou parar

**1 · O instrumento dos mandatos não saiu da página de um lugar.** A emenda de
21.09 manda que ele fique no estudo dos mandatos. A célula do I77 em
`scripts/gate-html.mjs` protege uma PESSOA: o mandato de 2009–2013 declara
`quemPorVerificar` porque duas fontes oficiais dão formas diferentes do nome de
quem presidiu a partir de maio de 2013, e a célula exige que esse nome se renda,
nas duas edições, na página deste concelho, com o marcador `[a verificar]` e a
porta para a página dele. Tirar o instrumento tirava da superfície o nome E o
marcador. O instrumento ficou, mudado para
`src/components/lugar/InstrumentoDosMandatos.astro`, sem uma linha de código
alterada, e é o último bloco da página de Évora. **Para ele sair, o nome e a sua
incerteza têm de passar a render-se no estudo «Évora — Quinze Anos, Cinco
Mandatos», que é composto do registo que o motor escreve: é uma mudança do lado
do motor.**

**2 · O índice das regiões não passou a redirecionamento.** É a casa da régua da
convergência: dez valores selados e duas contagens recontadas de três pontos. A
célula R3 de `scripts/check-regioes.mjs` (P) exige que cada uma das 18 páginas de
região tenha a porta para essa régua (`/regioes#regua`), e a régua não tem outra
casa. Redirecionam `/municipios` e `/distritos`, e as inglesas: quatro entradas,
e não seis. **Para `/regioes` seguir os outros dois, a régua tem de ganhar casa
no B3.**

**3 · A porta do ficheiro dos 308 não desapareceu.** O mandato escreve-a como um
exemplo do que se perde com `/municipios`. A célula do `check:dados` que declara,
ficheiro a ficheiro, em que rota vive a porta de cada um protege uma FONTE: o
Método promete que os dados são descarregáveis, e um ficheiro sem rota declarada
fecha a construção «em vez de deixar de ser conferido». A porta seguiu a lista
que o ficheiro publica, que hoje é a página dos lugares: uma linha no fim dela,
com o mesmo rótulo e o mesmo ficheiro. Não é um lugar novo; é o mesmo lugar com
outro nome.

## As células de portões que mudaram de forma, o que protegiam e o que protegem

| célula | classe | protegia | protege agora | planta |
|---|---|---|---|---|
| `gate:html` · redirecionamentos B1 | M/P | as dez rotas `/texto` antigas | mais quatro: os dois índices do território e as suas inglesas, com origem exata, destino existente com canónica única, entrada antes do `filesystem` e ausência em `dist/` | B1-lugares-um-destino-trocado |
| `check:datas` · 1b | P | cada data presa à sua edição nos dois índices e nas páginas dos trabalhos | mais as 616 páginas de lugar, e o número de edições esperadas sai dos dados (quantos estudos declaram aquele lugar), que é um segundo ponto de observação que não existia | a construção fecha com uma data trocada, como fechava |
| `check:dados` · a porta declarada | P | o CSV dos 308 com porta em `/municipios` | o mesmo CSV com porta em `/lugares` | a célula falha com a porta fora da rota declarada |
| `check:mapa` · R7 | M | a colação portuguesa nos 29 cabeçalhos e nas 308 linhas do índice dos concelhos | a colação nos 29 nomes da lista da página dos lugares, e nos concelhos de cada unidade na página dela: o mesmo em duas páginas em vez de três | «R7 (a lista dos distritos e ilhas)», no próprio ficheiro |
| `check:mapa` · R9 | M | as páginas que o mapa promete | as mesmas, com a página dos lugares no lugar do índice dos concelhos | a célula falha com a página em falta |
| `check:lugar` · L2a | M | uma segunda lista dos 308 fora de `/municipios` | a mesma, fora de `/lugares` | o teto continua a 0 |
| `check:lugar` · L4 | M | a frase de definição e as três de hierarquia | a de definição e as dos dois índices que a rendem (domínios e áreas). A do território saiu com os índices que a rendiam | o teto continua a 0 |
| `check:lugar` · 8.17 | M | o mapa da unidade na página de um concelho, com o anel no próprio | a linha do lugar com as quatro partes, a última marcada como esta página, o slug declarado igual ao da rota e cada destino construído | 8.17-a-linha-do-lugar-sem-uma-parte |
| `check:indice` · I8 | M | a frase de abertura de uma página de unidade | a lista dos concelhos daquela unidade, com pelo menos uma porta: o que a página tem, em vez do que ela diz ser | a célula falha com a lista vazia |
| `check:alvos` · H13 | M | as 308 portas de concelho dentro da lista agrupada de `/municipios` | as 308 portas de concelho dentro de uma lista declarada da página dos lugares | «lista-a-dobrar», acertada à marca nova |
| `check:alvos` · H2 | M | 44 px em cada alvo da faixa 641–1023 | o mesmo, com o título de um estudo e os selos da leitura a ganharem o ar que precisam | a célula falha com o alvo encolhido |
| `check:alvos` · H7 | M | os dois degraus da manchete, e nenhum algarismo com a porta de outra linha dentro da sua área | o mesmo, sem exigir que o primeiro degrau tenha instâncias: era o das 308 páginas de concelho, e a manchete de um lugar passou a ser o nome | a célula falha com uma porta alheia |
| `check:voz` · a lista fechada B1 | M | as cadeias das páginas de estudo e da lista | as mesmas, e a régua ganhou a fonte `concelho` para `data-nome` (308 × 8 pares linha-nome lidos de `src/data/concelhos.mjs`), que é conferência a mais e não a menos | `check:palavras`, 20 de 20 |
| `design:feixe` · cartão 04 | M | o desenho da distância ao teto legal, lido da página de Évora | a régua por palavras do cartão do índice de dívida, lida da mesma página | a corrida pára se o cartão não tiver régua |
| `design:feixe` · cartão 05 | M | o cartão localizador, lido da página de Évora | a ausência dele, medida nas 7 352 páginas construídas, como já fazia com `.banda` e `.movel-selo` | a corrida pára se ele voltar |
| `check:alcance` | M | as linhas alcançáveis a partir da página da Economia | as mesmas; deixou de rebentar numa pasta sem `index.html` | a régua continua a contar as mesmas linhas |

Nenhuma célula foi enfraquecida no que protege. As três que protegem números,
fontes ou pessoas e que mandaram parar estão na secção acima, com o caso escrito.

## As cadeias que saíram, por família e por razão

75 linhas do inventário levam o bloco `b1-peca2`: 65 retiradas e 10 vivas. Mais
14 saíram do ficheiro, porque não se rendiam em rota nenhuma nem por inteiro em
lado nenhum (o estado «retirada» delas ficava em contradição com a segunda
varredura, que as via dentro de frases maiores).

| razão | quantas | de onde |
|---|---|---|
| explica a página | 31 | as contas do município e as suas ressalvas, a legenda da distância desenhada, a nota da lei do limite de dívida, a frase da divergência entre as duas contas da mesma dívida, a nota do mapa localizador |
| segunda porta | 30 | os rótulos do índice dos concelhos e do índice dos distritos, e as duas entradas de menu que eles tinham |
| palavra fora do lugar | 18 | «região NUTS II», «distrito», «ilha da Região Autónoma», e as frases de abertura das duas páginas |

As 10 novas: «Temas»/«Themes», «Estudos sobre este lugar»/«Studies about this
place», a primeira frase da nota da dívida total nas duas edições, e as quatro
palavras da comparação do poder de compra com a média do país.

Os nomes dos dezoito temas e os das oito medidas de um concelho **não** entram no
inventário: vão com a marca `data-nome`, conferida carácter a carácter contra o
ficheiro de dados de onde dizem vir. Sem a marca eram 52 linhas a repetir duas
listas.

## O que saiu da página do lugar, e o que ficou sem porta

| o que saiu | para onde foi |
|---|---|
| a faixa dos oito cartões | os mesmos oito números estão nos cartões por tema, uma vez |
| a leitura breve de cada medida | a frase de definição de cada medida está no cartão dela, uma frase só |
| o mapa localizador da unidade | a linha do lugar diz onde o concelho fica, com quatro portas; o mapa inteiro está na página dos lugares |
| a distância desenhada ao teto legal | a comparação diz-se por palavras, na leitura e na régua do cartão do índice |
| a barra do ganho médio contra o país | **sem porta.** A comparação do ganho de um concelho com o valor nacional deixou de se render em lado nenhum; as duas linhas continuam no livro-razão, com as suas páginas |
| as contas do próprio município de Évora (orçamento, receita, despesa, dívida, limite, margem, execução da receita, prazo médio, divergência) | **sem porta na página.** As 12 linhas continuam a ter a sua página de livro-razão e a entrar na página de livro-razão do concelho |
| as três saídas do fim (índice dos concelhos, livro-razão deste concelho, Método) | o índice é agora a página dos lugares, no menu; **o livro-razão deste concelho ficou sem porta a partir da página do lugar** |
| a porta «ver estes estudos no índice» | o índice dos estudos está no menu |

O que `/municipios` tinha e a página dos lugares não tem: a lista dos 308
agrupada pelas 29 unidades (a busca substitui-a, e cada unidade tem a sua
página), a linha de cobertura com as duas contagens da prova, a contagem por
parcelas da Carta com os seus quatro selos, e a citação da fonte da Carta. **As
quatro ficaram sem porta.** A porta do ficheiro `municipios-308.csv` ficou, pela
razão da secção da regra de paragem.

O índice dos distritos tinha a contagem `mapa_unidades` com a sua porta: ficou
sem rendição, e a chave continua declarada em `src/lib/prova.mjs`.

## Os commits

Saída de `git log --format='%h %s%n%(trailers)' main..HEAD`:

```text
<esta cabeça> O relatório, as 88 capturas e as medições da peça 2
992fcd1d O portão das duas tabelas declaradas, com as suas plantas
f610c7ef Os tipos da composição da página do lugar e da leitura
f3614a92 As duas declarações que ficaram sem uso no feixe de desenho
91f36a20 Os cartões do feixe de desenho e a régua do alcance, que seguiram o que saiu das páginas
e3d3b264 Os alvos de 44 px da página do lugar, e o degrau da manchete que deixou de ter instâncias
44780f46 As células de mobília que seguiram o desenho, cada uma conservando o que protege
b6a2d5ec O inventário das frases destas famílias, e as células que seguiram o desenho
119ea77a A página dos lugares, e os três índices antigos a redirecionarem para ela
f795e891 O corte das duas frases nas páginas de região e de distrito
a2ace566 A página do lugar pela maqueta: a linha, o nome, a leitura, os números por tema, os estudos e o que mudou
ff1329b4 As duas tabelas declaradas da peça 2: a região e o distrito de cada concelho, lidos da Carta, e o tema de cada medida
```

Os doze levam os dois trailers, `Co-Authored-By: Claude Opus 5
<noreply@anthropic.com>` e `Claude-Session: e52c0f39-ab9c-4e0f-b9db-11d420f316ed`.

**Uma nota sobre o primeiro commit:** as seis páginas e as três vistas dos
índices antigos foram apagadas com `git rm` antes de o primeiro commit ser
escrito, e entraram nele em vez de entrarem no commit da página dos lugares, que
é onde a razão delas está escrita. A árvore está certa; a arrumação é que não.

## Os portões na cabeça final

```text
Cabeça: 992fcd1de7348dc7b987e06c8182272158bdac87 (o código; a cabeça final
        acrescenta-lhe o relatório, as capturas e as medições)
Ramo: b1-peca2-2026-09-21

npm run build
Código: 0
Registo: build-peca2.log
Início: 2026-09-21T15:03:53Z
Fim:    2026-09-21T15:08:40Z   (4 m 47 s)

npm run verify
Código: 0
Registo: verify-peca2.log
Início: 2026-09-21T15:08:55Z
Fim:    2026-09-21T15:16:44Z   (7 m 49 s)

npm run typecheck
Código: 0
Registo: typecheck-peca2.log
Início: 2026-09-21T15:16:44Z
Fim:    2026-09-21T15:16:44Z   (menos de 1 s)
```

Cada comando correu separadamente, com o código de saída escrito em
`build-peca2.codigo`, `verify-peca2.codigo` e `typecheck-peca2.codigo`.

## As capturas

56 capturas «depois» em `design/especime-v3/capturas/b1-2026-09-21/`, mais 32
capturas de janela a 390 e 1 280. Os resumos sha256, as larguras e as medidas de
cada uma estão em `capturas-depois-peca2.json`. Medido: **0 com deslocamento
lateral, 0 valores partidos em duas linhas, 0 selos partidos, 0 separadores de
milhar quebráveis, 0 selos sem `nowrap`**; 49 das 56 têm valores selados, e as 7
que não têm são a página de um distrito, que não publica medidas.

Oito páginas, cada uma por um caso: Évora (a maqueta, e o único concelho com
estudos e com registo), Vila Real de Santo António (o primeiro dos dez fora do
limite legal), Penedono (índice de dívida não publicado: a leitura perde metade e
o cartão leva a marca), Espinho (distrito repartido por duas regiões), Corvo (uma
ilha), `/lugares/`, `/regioes/alentejo/` e `/distritos/evora/`. As cinco larguras
em português (390, 768, 1 024, 1 280 e 1 600) e a 390 e a 1 280 em inglês.

## O tempo de parede

A sessão inteira, do `npm ci` à última corrida das plantas: cerca de 3 h 20 m,
das quais cerca de 1 h 10 m em construções e portões (dez construções completas a
uma média de 4 m 50 s, mais quatro corridas do `verify`).

## O que ficou por fazer, e porquê

1. **As capturas «antes».** A razão está na primeira secção: o guião está pronto
   e o argumento existe.
2. **O instrumento dos mandatos na página de Évora.** Caso 1 da regra de
   paragem. O que falta é do lado do motor.
3. **O índice das regiões como redirecionamento.** Caso 2 da regra de paragem. O
   que falta é a régua da convergência ganhar casa, no B3.
4. **A barra do ganho médio contra o país, as contas de Évora e a porta para o
   livro-razão do concelho** ficaram sem porta, e estão nomeadas na tabela acima.
   Não se inventou um lugar novo para nenhuma.
5. **A leitura de um estudo, na página do lugar, leva selos** e a maqueta
   desenha-a sem eles. Não pode ser sem eles: um valor rendido sem a porta da sua
   linha fecha a construção («o valor da afirmação aparece sem selo para a sua
   própria linha»). O que a maqueta desenhou não passou por um portão.
6. **A frase de definição do prazo médio de pagamento e a do índice de dívida**
   são as notas declaradas em `src/data/concelhos.mjs`, e não as que a nota D4 da
   maqueta escreve. A do prazo médio é do diretor e não está declarada no
   repositório; a do índice traz o artigo e o diploma, que precisam dos dois
   tokens da allowlist que este bloco retirou por já não dispensarem nada. As
   duas entram no dia em que forem declaradas.
7. **A leitura a frio**, que é de outra família (Codex), como sempre.

## Onde o mapa do repositório estava errado ou em falta

1. **`check:cartao` tem doze células, e o mapa lista nove.** O §3 do mapa escreve
   K1 a K9; o ficheiro tem K10 (uma marca da fonte por cartão), K11 (um cartão
   sem nome, e a chave da linha no texto de uma linha sem nome) e K12 (o período
   anterior é a observação anterior da mesma série). A K10 foi a que decidiu a
   forma do cartão desta peça: o teto legal saiu da linha da unidade do índice de
   dívida porque um cartão leva uma marca da fonte, e não duas.
2. **`check:alvos` tem H14 e não tem H11 nem H12.** O mapa diz «H11 os três
   comandos, H12 as plantas», e o ficheiro não tem células com esses nomes: o que
   ele tem é H1 a H10, H13 e H14. A contagem do mapa vem do brief F1.7 e não do
   código.
3. **O `check:datas` conta 1a, 1b, 2 e 3, e o mapa diz «1a, 1b, 2, 3».** Está
   certo, mas falta dizer que a 1b **fecha a construção numa rota que não
   conhece**, e não a salta: foi a primeira coisa a ficar vermelha quando a
   página do lugar passou a imprimir datas. É o comportamento certo, e quem
   constrói uma família nova tem de contar com ele.
4. **Falta ao mapa a lista das rotas inventariadas.** O §4 diz que elas são
   `ROTAS_DO_INVENTARIO` em `scripts/medir-defeitos.mjs`, e não diz que o
   `check:voz` mede **duas** pertenças diferentes com dois âmbitos diferentes: uma
   linha «viva» tem de se render **exatamente** numa rota inventariada, e uma
   linha «retirada» não pode aparecer **nem dentro de outra frase** em página
   nenhuma. Uma cadeia curta que deixe de se render por inteiro mas continue
   dentro de uma frase maior cai nas duas ao mesmo tempo, e a única saída é
   apagá-la do ficheiro. Foi o que aconteceu a catorze linhas desta passagem, e o
   mapa devia dizê-lo.
5. **`design:feixe` lê três páginas nomeadas que o mapa não lista**
   (`municipios/evora/index.html`, `municipios/index.html` e
   `distritos/evora/index.html`), e cada uma delas é um `morre()` fatal quando a
   página muda. O §3 do mapa diz «cerca de 60 `morre()` fatais» e não diz que
   alguns deles são rotas escritas: foram quatro dos oito vermelhos desta
   passagem.
6. **O §5 do mapa diz que o tempo de parede de cada portão sozinho não está
   medido em lado nenhum.** Continua sem estar; o que esta passagem mede está na
   secção dos portões acima, e é o dos três comandos inteiros.


---

# A passagem de correção · 21.09.2026

*Depois da leitura a frio do Codex (`gpt-5.6-sol`) e da leitura de editor do
lugar de direção sobre as capturas, triadas pelo lugar de direção. Ramo e
worktree os mesmos; os commits desta passagem levam o endereço da sessão nos
trailers.*

## O rebase sobre `main`

`main` avançou para `97d2cbc6` (a correção dos nomes oficiais, `DECISIONS.md`
§1.115) enquanto a peça se construía. `git rebase main` aplicou onze dos doze
commits sem conflito; o décimo primeiro parou num só ficheiro.

| ficheiro | conflito | como se resolveu |
|---|---|---|
| `package.json` | as duas cadeias e a lista dos guiões, cada lado com um portão novo | ficam os dois: o `check:nomes` de `main` e o `check:lugares` deste ramo, cada um no seu sítio das duas cadeias |
| `scripts/medir-defeitos.mjs` | nenhum | as duas mudanças aplicaram-se em bloco: o leitor dos nomes oficiais de `main` (que passou a exigir `mesma_medida === true`) e a fonte `concelho` do `data-nome` deste ramo |
| `ledger/allowlist.yml` | nenhum | as duas retiradas ficaram: o motivo `nome-oficial-da-medida` de `main` e os dois tokens da lei do limite de dívida deste ramo |

Nenhuma decisão do rebase foi outra coisa que mecânica.

## O que se corrigiu, célula a célula

| # | o que ficou feito | a célula | a planta |
|---|---|---|---|
| C1 | um portão confere as palavras da leitura e da régua contra as linhas | `check:lugares` **P1**, com leitor próprio: recalcula do livro-razão se o índice está dentro ou fora do limite legal e se o poder de compra está acima ou abaixo da base, nas 616 páginas, e compara com a leitura composta e com a régua do cartão; um lugar sem valor publicado não pode ter essa metade da leitura | `P1-a-leitura-ao-contrario` · a leitura de Vila Real de Santo António a dizer «dentro do limite legal» com o índice a 419,5 |
| C2 | o caminho do cabeçalho não se rende numa página de lugar | a rota perde o pai na tabela de `src/lib/caminho.mjs`, que é o mesmo mecanismo da primeira página; a **L5** do `check:lugar` muda de forma e o que ela exigia passa a ser exigido pela **8.17** na linha do lugar | `D1-a-linha-do-lugar-em-falta` · a linha a declarar outro concelho |
| C3 | o cartão rende a unidade tal como a linha a escreve | a unidade vem do campo `unit` por `CampoDaLinha`, e o portão de HTML ganha uma porta **estreita**: só o campo `unit`, só na rota de um concelho, e só dentro do cartão daquela linha | a célula fecha com a unidade mudada; a guarda larga não se usou porque desligava o `auditaSelo()` em 616 páginas |
| C4 | a entrelinha normal e o euro dentro do valor selado | o euro é sufixo em dez leituras de `src/data/leituras.mjs`; a **H2** do `check:alvos` conta à parte, com a razão medida, o selo dentro de uma sinopse | a H2 continua a fechar com um alvo encolhido |
| C5 | «O que mudou» é uma linha por mudança | a data, o nome da medida, os dois valores com a unidade e o selo, pelos atributos `data-correcao-*` que o `gate:html` compara com o campo `corrections` da linha; entradas da mesma linha no mesmo dia juntam-se | a célula do registo fecha com um valor antigo mudado |
| C6 | a porta «Todas as medidas de <lugar>» | no fim dos números por tema, para `/livro-razao/concelhos/<slug>`, nas 616 páginas; o rótulo entra na lista fechada | o `check:voz` fecha com o rótulo fora da lista |
| C7 | as duas frases de definição do diretor | declaradas em `src/data/concelhos.mjs` nas duas edições; duas linhas retiradas e quatro novas no inventário | o `check:voz` fecha com uma cadeia por classificar |
| C8 | a página dos lugares em duas colunas a partir de 1 024 px | a busca e as duas listas à esquerda, o mapa à direita; a 390 e a 768 a ordem vertical mantém-se | as capturas de janela a 1 280 × 800 |
| C9 | as oito fichas por omissão saem, e a frase do sem-guião com elas | a fila chega fechada do servidor e só se acende com texto escrito; a **H13** continua a exigir as 308 portas dentro de uma lista declarada | a planta `lista-a-dobrar` da H13 |
| C10 | nenhuma página liga à origem de um 301 | a célula dos redirecionamentos do `gate:html` recusa qualquer `href` de `dist/` cujo caminho seja uma origem; as duas portas que a região e o distrito tinham para os dois índices passam a uma | `B1-lugares-uma-ligacao-a-origem` · uma ligação de volta a `/distritos` |
| C11 | os dois anos da leitura de Évora leem-se das linhas | `anoDoIndice()` lê a `reference_date` das operandas deste lugar de cada índice derivado, e fecha a construção se elas não disserem um ano só | a função atira com o nome da linha |
| C12 | as contas do inventário batem | o registo das revisões diz 71 retiradas, 14 apagadas e 20 novas, que é o que o inventário tem | o `check:voz` conta as linhas por bloco |

`/regioes` continua sem redirecionamento, a porta do ficheiro dos 308 continua
onde está, e o instrumento dos mandatos continua no fim da página de Évora: são
as três decisões do lugar de direção, e as razões estão nas secções acima.

## Onde dois achados puxaram em sentidos contrários, e o que se mediu

**A entrelinha da sinopse e o alvo de 44 px do selo não cabem os dois.** O
quadrado de 44 px de um selo em prosa corrida cruza a linha de cima e a de baixo
do mesmo parágrafo, e o `elementFromPoint` de um canto devolve o vizinho. As duas
saídas foram medidas nesta passagem:

* pôr a entrelinha do parágrafo nos 44 px dá o quadrado inteiro, e é exatamente o
  que o diretor leu nas capturas (45 px entre linhas numa sinopse de duas
  frases);
* dar ao selo a área da sua própria caixa, que é a regra que `site.css` já aplica
  onde os selos se empilham, deixa-o com 18,6 px de altura e a régua conta-o na
  mesma.

Fica a entrelinha normal, e a classe passa a ser contada à parte na H2, com a
razão escrita na própria célula, como já eram as áreas do mapa e as páginas de
leitura: são a mesma classe de caso, uma área de 44 px que abriria a porta do
vizinho. Medido nesta passagem: **24 alvos sem os 44 px na faixa de 641 a 1 023,
dos quais 0 são caixas, 6 são áreas de desenho, 3 são de uma página de leitura, 3
quebram de linha dentro de uma frase e 12 são selos dentro de uma sinopse.** A
porta não se perde: o selo tem a sua área a 390 px, e o mesmo número tem o seu
recibo na página do estudo, a um toque do título por cima.

## Os portões na cabeça final do código

```text
Cabeça do código: 31fe90c421f9e1e0a47590b709b8ebd677ac56b0
Ramo: b1-peca2-2026-09-21, sobre main 97d2cbc6

npm run build       Código: 0   16:22:28Z → 16:27:21Z   (4 m 53 s)
npm run verify      Código: 0   16:37:40Z → 16:45:39Z   (7 m 59 s)
npm run typecheck   Código: 0   16:45:39Z → 16:45:39Z   (menos de 1 s)
```

## As capturas e as plantas

As oito «antes», de `main` (`97d2cbc`), com o guião e as medidas do lugar de
direção. As 56 «depois» refeitas nesta cabeça, mais as 32 de janela: **0 com
deslocamento lateral, 0 valores partidos, 0 selos partidos, 0 separadores
quebráveis, 0 selos sem `nowrap`**, 49 com valores selados.

As **nove plantas** (eram seis) deram todas código diferente de zero com a falha
esperada e repuseram os bytes: as seis da construção, mais a leitura ao
contrário, a linha do lugar de outro concelho e a ligação de volta à origem de um
301.

## O que ficou por fazer nesta passagem, e porquê

1. **Os doze selos da sinopse sem os 44 px na faixa de 641 a 1 023**, contados e
   nomeados acima. Fechá-los a sério é dar ar ao parágrafo sem esticar a
   entrelinha, e isso é uma decisão de composição que o B3 pode tomar com a
   sinopse inteira à frente.
2. **As três decisões do lugar de direção** que ficam como estão, e que já
   estavam no relatório da construção.
3. **A leitura a frio desta passagem**, que é de outra família.
