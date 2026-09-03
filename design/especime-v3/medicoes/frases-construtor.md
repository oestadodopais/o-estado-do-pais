# F0.9 · as sete frases de 18.08 · relatório do construtor

*Ramo `frases-2026-09-03`, tirado de `main` em `2ab66578`. Construtor Claude Opus 5,
03.09.2026. O bloco é o F0.9 do `design/observatorio/PLANO-fiabilidade-2026-09-02.md`,
§2: cada frase da primeira página que afirma uma tendência, uma comparação ou uma
atribuição sem linha ganha a linha que a prova, ou sai. A origem da lista é a
`DECISIONS.md` §1.44, que as deixou escritas com as palavras exatas nas duas
edições. Sem travessões na prosa.*

## 1 · O resultado, em três linhas

Nenhuma das orações ganhou linha, porque **nenhuma linha existe**: as seis medidas
em causa têm um só ficheiro cada no livro-razão, todos de Portugal e todos de 2025.
Por isso **saíram todas**, e ficou a definição da medida mais o estado que a própria
página calcula das suas linhas. Ficou um arame na construção para que a classe não
volte em silêncio antes de o F3.1 a saber tipar.

E ficou à vista uma coisa que o bloco não ia procurar: **das sete frases da §1.44, o
portão da voz só via uma.** As outras seis estavam estruturalmente fora da régua.
A §5 escreve-o.

## 2 · A varredura: o que existe na primeira página, e onde

A busca não foi por lista, foi por classe. O comando varreu o texto rendido das duas
edições da primeira página e imprimiu o elemento mais interior que contivesse uma
palavra de tendência (a descer, a subir, duplicou, cresceu, caiu, estável), de
comparação contra um valor fora da página (média da União, média europeia, mais se
destaca, o único, entre os primeiros), de valor de outro período (era, no início do
século) ou de atribuição (adverte, a Comissão diz).

A varredura devolveu **seis frases, nas duas edições, todas em `src/data/figuras.mjs`**.
`src/views/HomeView.astro` não tem nenhuma: a única ocorrência de «média europeia» no
ficheiro está na linha 470 e é um comentário de código, não prosa rendida (conferido
com um positivo conhecido ao lado, `grep -c "primeira" src/views/HomeView.astro` a 3,
para provar que o `grep` daquele ficheiro encontrava alguma coisa).

| # | célula | ficheiro:linha antes | ficheiro:linha depois | classe |
| --- | --- | --- | --- | --- |
| 1 | Dívida pública | `src/data/figuras.mjs:123` (pt) · `:126` (en) | `:131` (pt) · `:134` (en) | tendência |
| 2 | Preços da habitação | `src/data/figuras.mjs:196` (pt) · `:200` (en) | `:207` (pt) · `:208` (en) | valor de outro período + comparação entre dois períodos |
| 3 | Custo unitário do trabalho | `src/data/figuras.mjs:173` (pt) · `:177` (en) | `:187` (pt) · `:188` (en) | atribuição sem excerto sobre a metodologia da fonte |
| 4 | Taxa de emprego | `src/data/figuras.mjs:360` (pt) · `:363` (en) | `:376` (pt) · `:377` (en) | comparação contra valor fora da página |
| 5 | Abandono escolar precoce | `src/data/figuras.mjs:407` (pt) · `:408` (en) | `:425` (pt) · `:426` (en) | valor de outro período |
| 6 | Sobrecarga do custo da habitação | `src/data/figuras.mjs:444` (pt) · `:449` (en) | `:475` (pt) · `:480` (en) | comparação + atribuição sem excerto |

**A sétima da §1.44 já não existia.** «É das medidas em que Portugal mais se destaca
no painel social» e «It is one of the measures where Portugal stands out most on the
social scoreboard» saíram com a Emenda 16, que tirou `criancas-em-creche-2025` do
painel social porque o registo do motor não coloca lá nenhuma linha de cuidados
formais para a infância. A razão está escrita em `src/data/figuras.mjs`, no cabeçalho
da `FIGURAS_SOCIAL`. Medido antes de mexer em nada:
`grep -c "mais se destaca" dist/index.html` a **0** e
`grep -c "stands out most" dist/en/index.html` a **0**.

A sexta e a sétima linha da tabela da §1.44 são as duas orações da mesma célula, e
por isso a tabela acima tem seis entradas para as sete linhas dela. A oitava, a que a
§1.44 chama «de outra natureza», é a n.º 3.

**Uma ocorrência fora do âmbito, dita para não voltar a ser descoberta.**
`src/data/agenda.json:37` e `:38` citam «a própria Comissão adverte» e «the Commission
itself warns» dentro de uma nota do registo da agenda, que se rende em `/agenda` e não
na primeira página. É texto do registo, não prosa da casa, e o F0.9 não lhe toca. O
arame da §4 morde só em `/` e em `/en/`, e por isso não a apanha.

## 3 · O que cada frase passou a ser, e porquê

A regra que decidiu cada uma: a oração por provar sai; fica a definição da medida e o
estado que a página calcula das suas próprias linhas. «Está acima do limiar do painel
europeu» é desse segundo tipo e fica: sai de `comparacaoComOLimiar()`, que compara o
valor publicado da linha com o limiar publicado pelo quadro, e os dois números estão
na célula, cada um com o seu selo.

**1 · Dívida pública.** Sai «, e a descer» e «, and falling».
Fica: «Dívida bruta das administrações públicas, no conceito do Procedimento dos
Défices Excessivos. Está acima do limiar do painel europeu.» ·
«General government gross debt, on the Excessive Deficit Procedure concept. It is
above the European scoreboard threshold.»

**2 · Preços da habitação.** Sai a segunda frase inteira, «O limiar foi ultrapassado
em 2024 e o excesso quase duplicou no ano seguinte.» São duas afirmações numa: um
valor de 2024, que a página não publica, e a comparação entre 2024 e 2025, que sem ele
não existe.
Fica: «Índice nominal de preços da habitação.» · «Nominal house price index.»

**3 · Custo unitário do trabalho.** Sai «A definição por hora é de 2024: antes
media-se por pessoa empregada.» É a frase que a §1.44 pôs à parte: não compara valores
nem afirma um sentido, mas afirma o que a fonte media antes e quando mudou, sem
excerto que o diga e sem linha do período anterior. Uma atribuição prova-se com as
palavras de quem a fez.
Fica: «Custo do trabalho por unidade produzida, por hora trabalhada.» · «Labour cost
per unit of output, per hour worked.»

**4 · Taxa de emprego.** Sai «Está acima da média da União», e sai com ela a glosa
«que é uma posição relativa, não um limiar: muda quando os outros mudam»: a glosa
explica uma comparação que deixa de estar escrita, e sozinha não diz nada.
Fica: «Indicador principal do Painel Social Europeu.» · «A headline indicator of the
European Social Scoreboard.»

**5 · Abandono escolar precoce.** Sai «Era mais de um terço no início do século.»
Fica: «Jovens que deixaram a escola com o secundário incompleto e não estão em
formação.» · «Young people who left school without completing secondary education and
are not in training.» A definição guarda «secundário incompleto», que é a cadeia da
exceção `complet` do `VOZ-MARCADORES.md`: a exceção continua exercida, e a régua não
passa a imprimi-la como dispensa por usar.

**6 · Sobrecarga do custo da habitação.** Saem duas orações e fica a terceira.
Sai «Está abaixo da média europeia»: comparação contra um valor que a página não tem.
Sai «e a própria Comissão adverte que só se lê ao lado do regime de propriedade»:
atribuição sem excerto.
**Fica** «Onde a taxa de proprietários é alta, esta medida não vê quem não conseguiu
comprar», e fica com duas razões escritas. A Emenda 15 guarda «as ressalvas sobre os
dados (limites, bandeiras de provisório, definições)», e a Emenda 18d permite a
conclusão que segue dos dados e não toma partido: a ressalva segue da definição que
está na mesma frase, que conta quem gasta mais de 40% do rendimento em habitação. O
cabeçalho da `FIGURAS_SOCIAL` já escrevia o custo de a deixar cair, com as palavras do
motor (`convergence.md` §3, «Where convergence is a trap»): «Published naked, it says
Portuguese housing is fine.»
O que não podia ficar era o nome de quem advertiu sem as palavras dele. Em F3.3, que
dá excerto às definições e às citações, o nome volta com o excerto ao lado.
Fica: «Proporção que gasta mais de 40% do rendimento disponível em habitação. Onde a
taxa de proprietários é alta, esta medida não vê quem não conseguiu comprar.» · «The
share spending more than 40% of disposable income on housing. Where owner-occupation
is high, this measure does not see those who never bought.»

## 4 · As linhas que não existem, e as que o F3.1 deve acrescentar

Nenhuma oração ganhou `data-afirma`, e a razão é medida e não presumida. Cada medida
do painel tem **um só ficheiro** no livro-razão, e é o de Portugal no ano corrente.
O comando, por conjunto de dados, e o que devolveu:

```
grep -rl tipsgo10 ledger/claims/      → divida-publica-2025.yml
grep -rl tipsho20 ledger/claims/      → precos-da-habitacao-2025.yml
grep -rl lfsi_emp_a ledger/claims/    → taxa-de-emprego-2025.yml
grep -rl edat_lfse_14 ledger/claims/  → abandono-escolar-precoce-2025.yml
grep -rl tespm140 ledger/claims/      → sobrecarga-do-custo-da-habitacao-2025.yml
grep -rl tipslm10 ledger/claims/      → custo-unitario-do-trabalho-2025.yml
```

Um ficheiro cada, e o positivo conhecido do comando ao lado:
`grep -rl tespm140 ledger/claims/ | wc -l` a **1**, e `grep -rl "geo=PT" ledger/claims/`
a **46**, que prova que a busca por conteúdo alcança o livro-razão inteiro.

**Nenhuma média da União existe como linha.** A busca por agregados europeus
(`grep -rlE "geo=EU|EU27|EU-27|União Europeia|European Union" ledger/claims/`) devolve
só as linhas do PIB per capita regional, `pib-pc-*` e `distancia-*-ue27-*`, que são
outro indicador e não servem nenhuma destas células. As 2 916 linhas do livro-razão
não têm uma média europeia de taxa de emprego nem de sobrecarga do custo da habitação.

**As linhas que o F3.1 deve acrescentar**, escritas com o que é preciso para as pedir,
para que nada se perca. Todas saem de conjuntos que o painel já lê, e por isso são
baratas: é o mesmo endereço com uma dimensão mudada. **Cada uma é um bloco do motor**
(a linha lê-se da fonte e o corredor escreve-a), e por isso fica registada aqui e não
construída neste bloco.

| para a frase | conjunto | dimensões | unidade | o que destrava |
| --- | --- | --- | --- | --- |
| «e a descer» (dívida) | `tipsgo10` | `geo=PT`, período 2024 | % do PIB | a tendência tipada sobre dois valores |
| «o excesso quase duplicou» (preços) | `tipsho20` | `geo=PT`, período 2024 | % (variação anual) | o valor de 2024 e a comparação entre os dois anos |
| «acima da média da União» (emprego) | `lfsi_emp_a` | `geo=EU27_2020`, `indic_em=EMP_LFS`, `sex=T`, `age=Y20-64`, `unit=PC_POP`, período 2025 | % da população | a comparação com a média como linha |
| «era mais de um terço» (abandono) | `edat_lfse_14` | `geo=PT`, `sex=T`, `age=Y18-24`, `unit=PC`, período 2000 | % dos 18 aos 24 anos | o valor do início do século |
| «abaixo da média europeia» (sobrecarga) | `tespm140` | `geo=EU27_2020`, `sex=T`, período 2025 | % | a comparação com a média como linha |
| a mudança de definição (custo do trabalho) | `tipslm10` | a nota metodológica do publicador | excerto, não valor | a atribuição com as palavras da fonte (é F3.3, não F3.1) |
| a advertência da Comissão (sobrecarga) | SWD(2026) 222 ou a ficha do `tespm140` | o excerto literal do parágrafo do regime de propriedade | excerto | a atribuição com porta (F3.3) |

Os códigos dos conjuntos e as dimensões saem dos `source_url` das linhas que já
existem, e não de memória: por exemplo, `taxa-de-emprego-2025.yml` traz
`…/lfsi_emp_a?format=JSON&lang=EN&geo=PT&indic_em=EMP_LFS&sex=T&age=Y20-64&unit=PC_POP`.
O `geo=EU27_2020` das duas linhas de média **não foi conferido contra a fonte** (o
bloco corre sem rede): é o código que o Eurostat usa para o agregado, e o F3.1
confirma-o na primeira leitura antes de escrever a linha. Fica marcado `[a verificar]`
aqui e não escrito como facto.

## 5 · O que o bloco encontrou sem procurar: o portão da voz via uma frase em sete

Este achado não estava no brief e é o mais pesado do bloco.

Das sete frases da §1.44, o `INVENTARIO-FRASES.md` declarava **uma**: a da dívida
pública, nas duas edições. As outras não estavam por esquecimento; estavam
**estruturalmente fora da régua**, por duas causas independentes, ambas em
`scripts/medir-defeitos.mjs`:

1. **As três frases do Painel Social vivem num `<span class="social-frase">`.**
   A régua da voz recolhe blocos de `BLOCOS`, que é
   `p,li,dd,dt,h1,h2,h3,h4,figcaption,summary,blockquote,td,th,caption`, mais os
   `<span>` de `CLASSES_DE_ROTULO`, que hoje tem uma classe só, `eyebrow`. Um
   `span.social-frase` não é bloco para a régua, e por isso a taxa de emprego, o
   abandono escolar precoce e a sobrecarga do custo da habitação nunca entraram no
   inventário nem foram contadas em rota nenhuma.
2. **Duas das frases do Procedimento embrulhavam uma marca de origem declarada.**
   `blocosDe()` salta o bloco inteiro quando ele contém um seletor de
   `ORIGEM_DECLARADA`, e as frases dos preços da habitação e do custo unitário do
   trabalho traziam um `{ ref: '2024' }`, que rende
   `<span data-nonledger="data-de-referencia">2024</span>`. O bloco todo caía com a
   marca dentro dele.

A prova de que a segunda causa é essa e não outra veio da própria construção: ao tirar
as orações por provar, tirou-se com elas o `{ ref }`, e as duas frases **apareceram
pela primeira vez** na saída do portão, como «bloco por classificar em /» e «em /en».
Foi preciso declará-las no inventário para o portão voltar a verde. As três do Painel
Social continuam fora, e continuam a não aparecer.

É por isso que o arame da §4 **lê o HTML construído e não a régua**: um arame que
passasse pela régua herdava os dois buracos e contava zero com a página cheia. As duas
causas ficam escritas aqui e são material para o F3.1, cuja régua do mundo fechado tem
de alcançar todo o bloco de texto de uma página do leitor, `<span>` e marca de origem
incluídos.

## 6 · O arame, e o que ele é

Entrou em `scripts/check-voz.mjs` como **décimo caso** do portão da voz.
Lê `dist/index.html` e `dist/en/index.html`, tira o texto do `<body>` e fecha a
construção quando encontra uma palavra da classe. As oito palavras do brief, com a
gémea inglesa de cada uma, porque uma linha é uma decisão editorial e leva as duas
edições:

| razão | pt | en |
| --- | --- | --- |
| tendência sem série | a descer | falling |
| tendência sem série | a subir | rising |
| comparação entre dois períodos, e a página tem um | duplicou | doubled |
| a média da União não é linha do livro-razão | média da União | Union average |
| a média europeia não é linha do livro-razão | média europeia | European average |
| superlativo sobre medidas que a página não mostra | mais se destaca | stands out most |
| valor de outro período, sem linha | no início do século | turn of the century |
| atribuição sem excerto | adverte | warns |

**É um tapa-buraco declarado, e o F3.1 substitui-o.** Está escrito assim no cabeçalho
do ficheiro e na própria secção: a saída certa é a frase tipada, com os ids das linhas
que a provam e um vocabulário fechado, e não uma lista de palavras proibidas. A secção
sai inteira, com a lista, no dia em que o `check:prosa` entrar.

**Porque não foi para o `VOZ-MARCADORES.md`.** Duas razões, escritas no código. Um
marcador daquele ficheiro pergunta «isto é a casa a falar de si?», e a saída dele é uma
declaração de autorreferência: estas palavras não são autorreferência, são afirmações
por provar, e declará-las na coluna errada faria a lista mentir sobre o que classifica.
E um marcador morde em **todas** as rotas inventariadas, enquanto esta classe só está
fechada na primeira página: «adverte» é palavra legítima no corpo de um estudo
transcrito, e «era» de um documento citado não é uma afirmação da casa. A dispensa
teria de ser escrita rota a rota, e uma proibição com trinta exceções é uma proibição
que ninguém lê.

**O arame tem o seu próprio positivo conhecido** (regra 14 da casa). Um detetor que lê
dois ficheiros e conta zero tem duas explicações e só uma é boa: ou a classe não está
lá, ou a leitura partiu-se. Por isso cada edição declara uma sentinela, o nome de uma
medida que a primeira página tem de render («Dívida pública» e «Government debt»), e a
ausência dela fecha a construção antes de o zero das palavras valer alguma coisa.

## 7 · O conhecido-positivo: vermelho e depois verde

Três plantas, todas com o comando e o código de saída lidos do registo.

**Planta 1 · as dezasseis palavras, dentro de uma marca de origem declarada.**
As oito palavras portuguesas foram plantadas em `dist/index.html` e as oito inglesas em
`dist/en/index.html`, **dentro** do elemento `data-claim="divida-publica-2025"`, que é
origem declarada e que a régua salta: assim só o arame as podia ver, e o que se mede é
o arame e não outro passo.

```
npm run check:voz   → saída 1
PORTÃO DA VOZ · 16 problema(s)
grep -c "FRASE DA CLASSE POR PROVAR" → 16
```

Dezasseis problemas, dezasseis do arame: nenhum outro passo do portão as viu, que é o
que a planta queria provar.

**Planta 2 · a sentinela.** Reposto o `dist/`, tirou-se «Government debt» da edição
inglesa (`grep -c "Government debt" dist/en/index.html` a 0).

```
npm run check:voz   → saída 1
«o positivo conhecido do arame da classe falhou em /en/»
```

O arame recusa-se a contar zero quando a leitura pode estar cega.

**Verde.** Reposto o `dist/` das duas edições:

```
npm run check:voz   → saída 0
voz ✓ 65 marcadores · 7 exceções · 714 frases distintas, 32 761 ocorrências
em 1 378 rotas · autorreferência 0 · nada por classificar
```

**Planta 3 · na fonte, com a construção inteira.** Reposto «, e a descer.» em
`src/data/figuras.mjs` e corrida a construção completa:

```
npm run build   → saída 1
PORTÃO DA VOZ · 4 problema(s)
```

E os quatro dizem que a rede tem três malhas independentes sobre o mesmo estrago:

* `bloco por classificar em /` (a frase mudou e não está declarada);
* `INVENTARIO-FRASES.md:175: linha «viva» que não se rende` (a declaração nova ficou órfã);
* `INVENTARIO-FRASES.md:174: FRASE RETIRADA QUE VOLTOU A RENDER-SE` (a sentinela do inventário);
* `FRASE DA CLASSE POR PROVAR EM / · «a descer»` (o arame).

Reposta a fonte, `npm run build` volta a **0**.

## 8 · O inventário e o rasto da revisão

O inventário passou de **632** para **638** linhas com bloco: de 556 para 560 vivas, e
de 76 para 78 retiradas. As duas retiradas novas são a frase da dívida nas duas
edições, com a razão escrita, e são sentinelas a sério: a planta 3 acendeu-as.
As seis vivas novas são as três frases aparadas do painel nas duas edições, e duas
delas entram no inventário **pela primeira vez** pela razão da §5.

Todas levam o bloco `frases`, e o bloco tem entrada nova em
`design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`, com a leitura marcada
`por ler`: a leitura cruzada faz-se antes da fusão, não antes do commit, e o portão
imprime-a na saída para que ninguém a esqueça.

O campo `lida-contra` da cabeça do inventário **não subiu**, e é o certo: continua a
Emenda 18, que é a mais alta da voz, e o F0.9 não mexeu em nenhuma emenda. Nenhum
marcador e nenhuma exceção do `VOZ-MARCADORES.md` mudaram: o portão não foi
enfraquecido em ponto nenhum para a construção passar a verde.

## 9 · As medições, cada uma com o seu comando

**As catorze cadeias em `dist/`, antes e depois.** O comando, corrido nas duas
construções:

```
for s in "e a descer" "and falling" "quase duplicou" "nearly doubled" \
         "acima da média da União" "above the Union average" \
         "mais se destaca" "stands out most" \
         "no início do século" "turn of the century" \
         "abaixo da média europeia" "below the European average" \
         "Comissão adverte" "Commission itself warns"; do
  grep -c "$s" dist/index.html; grep -c "$s" dist/en/index.html
done
```

| cadeia | `/` antes | `/en/` antes | `/` depois | `/en/` depois |
| --- | --- | --- | --- | --- |
| e a descer | 1 | 0 | 0 | 0 |
| and falling | 0 | 1 | 0 | 0 |
| quase duplicou | 1 | 0 | 0 | 0 |
| nearly doubled | 0 | 1 | 0 | 0 |
| acima da média da União | 1 | 0 | 0 | 0 |
| above the Union average | 0 | 1 | 0 | 0 |
| mais se destaca | 0 | 0 | 0 | 0 |
| stands out most | 0 | 0 | 0 | 0 |
| no início do século | 1 | 0 | 0 | 0 |
| turn of the century | 0 | 1 | 0 | 0 |
| abaixo da média europeia | 1 | 0 | 0 | 0 |
| below the European average | 0 | 1 | 0 | 0 |
| Comissão adverte | 1 | 0 | 0 | 0 |
| Commission itself warns | 0 | 1 | 0 | 0 |

Doze cadeias a 1 antes e a 0 depois; duas a 0 nas duas construções, que são as da
creche e que a Emenda 16 já tinha tirado. **O positivo conhecido do próprio `grep`**,
corrido na mesma construção para que o zero valha alguma coisa:
`grep -c "Dívida pública" dist/index.html` a **1** e
`grep -c "Government debt" dist/en/index.html` a **1**.

**A altura da primeira página a 390 px.** Medida com a definição da casa
(`document.documentElement.scrollHeight` num contexto de 390 de largura, como em
`tests/inicio/lista.mjs`), com o `chromium` do Playwright que já estava na árvore e
nos caches: **nada foi instalado**. O «depois» é a construção real; o «antes» é
reconstruído no DOM da mesma página, repondo as seis orações exatas com a marca
`data-nonledger` que o `{ ref }` rende, e o contador diz que as seis foram repostas em
cada edição. É uma reconstrução e não uma segunda construção, e fica dito como tal: a
única diferença entre os dois estados é o texto que saiu.

| rota | antes (reconstruído) | depois (real) | diferença |
| --- | --- | --- | --- |
| `/` | 7 071 px | 6 963 px | 108,0 px |
| `/en/` | 7 042 px | 6 933 px | 109,0 px |

A primeira página encolheu cerca de um sexto de um ecrã de telemóvel nas duas edições.
É ganho para a F1.1, cuja medida de aceitação é «a altura de `/` menor do que hoje».

**As frases mudadas.** Seis frases, nas duas edições: **doze cadeias**. Oito afirmações
da classe saíram (as sete da tabela da §1.44 menos a da creche, que já não existia,
mais a «de outra natureza» do custo unitário do trabalho, mais a segunda oração dos
preços da habitação, que a §1.44 conta como uma e são duas afirmações).

**O diff.**

```
git diff --stat
 design/especime-v3/INVENTARIO-FRASES.md           |  10 +-
 design/especime-v3/critica/REVISOES-DO-INVENTARIO.md |   1 +
 scripts/check-voz.mjs                             | 101 ++++++++++++++++++-
 src/data/figuras.mjs                              | 111 +++++++++++--------
 4 files changed, 180 insertions(+), 43 deletions(-)
```

**Os três portões locais**, corridos na árvore do ramo depois da última mudança, com
os códigos de saída lidos dos registos:

```
npm run build      → 0
npm run verify     → 0
npm run typecheck  → 0
```

## 10 · O que fica para os blocos seguintes

* **F3.1** · as seis linhas da tabela da §4, e a régua do mundo fechado que alcance um
  `span.social-frase` e um bloco com marca de origem lá dentro (§5). Quando o
  `check:prosa` entrar, o décimo caso do `check-voz.mjs` sai inteiro, com a lista.
* **F3.3** · o excerto da advertência da Comissão sobre o regime de propriedade, e o
  excerto da mudança de definição do custo unitário do trabalho. Com eles, as duas
  atribuições voltam com porta.
* **O motor** · as seis linhas da §4 lêem-se da fonte, e por isso são blocos do motor.
  Ficam registadas e não construídas: este bloco correu sem rede.
* **`[a verificar]`** · o código `geo=EU27_2020` das duas linhas de média não foi
  conferido contra o Eurostat neste bloco.
* **Herdado, e não deste bloco** · `node scripts/ortografia.mjs --verificar` sai a 1
  com uma ocorrência, e é anterior a este ramo:
  `ledger/claims/ganho-medio-mensal-2024.yml:45`, no campo `note`, escreve «Instituto
  Nacional de Estatística, IP – Portugal» com meio travessão. Conferido: o ficheiro não
  está no diff deste bloco (`git diff --name-only` não o nomeia) e a linha já está em
  `HEAD`. É um nome transcrito dentro de uma nota do motor, e o que se copia de uma
  fonte fica como a fonte o escreveu; a régua da ortografia não corre nem no `build`
  nem no `verify`, e a nota é propriedade do motor. Fica dito e não fica corrigido
  aqui.
