# Correções pequenas, quinta passagem · o relatório do construtor

*Ramo `pequenas-5-2026-08-29`, saído de `main` `98fd779`. Construtor: Claude Opus
5, 29.08.2026. Três commits, cada um verde na cadeia inteira (`npm run build`,
`npm run verify`, `npm run typecheck`). Sem travessões na prosa.*

---

## 0 · Os três commits

| commit | o que fecha |
| --- | --- |
| `d5ef2b3` | I92 · a unidade de uma linha é um rótulo, e diz-se na língua da página |
| `3335d4b` | I91, segunda metade · o título de um documento é um nome, e diz em que língua está |
| o terceiro | ISSUES, o brief e este relatório. Não se nomeia a si próprio: o identificador de um commit não existe antes de ele ser escrito |

A ordem não é a do brief, e a razão é a cadeia: a peça partilhada pelas duas
metades é a propriedade `lingua` de `CampoDaLinha.astro`, que nasceu com a
unidade. O commit da I91 assenta nela.

---

## 1 · As contagens, antes e depois

Medidas com o mesmo instrumento nas duas construções, sobre `dist/en` inteiro
(3 299 ficheiros HTML). O instrumento lê a língua efectiva de cada elemento subindo pela
árvore até ao primeiro `lang`, que é o que um leitor de ecrã faz.

| medida | antes (`98fd779`) | depois |
| --- | --- | --- |
| títulos de documento **portugueses** sem `lang="pt-PT"` | **4 518** | **0** |
| títulos de documento portugueses **com** a marca | 0 | 4 518 |
| títulos de documento ingleses (sem marca, e é o certo) | 128 | 128 |
| nomes de lei portuguesa sem a marca | **1 237** | **316**, e as 316 estão dentro de texto transcrito |
| nomes de lei portuguesa com a marca | 9 | 930 |
| títulos de estudo portugueses sem a marca | **11** | **0** |
| títulos de estudo portugueses com a marca | 94 | 105 |
| unidades traduzidas na edição inglesa | 0 | **5 320** |
| unidades em português na edição inglesa | 5 329 | 9, **todas com a marca** |

As 316 ocorrências de lei que ficam estão explicadas em §5. As nove unidades que
ficam em português são as três linhas de `avisos` (seis ocorrências) e `factor`
(três), cada uma rendida no índice do livro-razão, na sua página de linha e na
página da sua área de governo; ficam com `lang="pt-PT"` e com a razão escrita no
dicionário.

A saída da régua nova, na construção verde:

```
  língua ✓ 36 unidade(s) do livro-razão: 34 traduzida(s), 2 em português com razão escrita ·
  2216 localizador(es), todos dentro de documento português ·
  66 título(s) de documento com língua declarada (33 pt, 33 en)
      6590 página(s) lidas · unidades em «en»: 5329 (5320 traduzidas, 9 em português, todas com
      marca) · títulos com marca de língua: 4639 de 9278 rendidos · localizadores em «en»: 2216
      com marca · leis em «en»: 930 com marca, 315 dentro de transcrição do motor ·
      títulos de estudo portugueses em «en»: 105, todos com marca
```

---

## 2 · I92 · as 36 unidades do livro-razão, e o que cada uma diz em inglês

O conjunto é fechado e foi lido do livro-razão inteiro (`ledger/claims/*.yml`,
campo `unit`, 2 602 linhas). **Trinta e quatro traduzem-se; duas ficam em
português.** Cada entrada do dicionário
(`src/i18n/unidades.mjs`) leva ao lado a origem do inglês, e a coluna «de onde
vem» desta tabela é a mesma:

* **a casa** — o inglês que o sítio já escreve para a mesma coisa
  (`src/data/concelhos.mjs`, `src/i18n/strings.mjs`, `src/data/leituras.mjs`).
  Duas palavras inglesas para a mesma unidade na mesma página seria o defeito da
  I92 escrito ao contrário;
* **a fonte** — o inglês do próprio organismo, tal como o excerto daquela linha o
  traz;
* **o dicionário** — «dias» é «days», e não é preciso mais nada.

| unidade, tal como o livro-razão a escreve | linhas | inglês | de onde vem |
| --- | ---: | --- | --- |
| `euros` | 645 | euros | a casa · `concelhos.mjs`, medida «divida» (Euros → Euros) |
| `pessoas` | 620 | people | a casa · `concelhos.mjs`, «populacao» e «desempregoRegistado» (Pessoas → People) |
| `% (limite legal = 150)` | 311 | % (legal cap = 150) | a casa · `concelhos.mjs`, `tectoTexto` («teto legal = » → «legal cap = ») |
| `dias` | 310 | days | a casa · `concelhos.mjs`, medida «pmp» (Dias → Days) |
| `índice (Portugal = 100)` | 309 | index (Portugal = 100) | dicionário; o parêntesis é um nome próprio e um algarismo |
| `empresas` | 308 | enterprises | a casa · `concelhos.mjs`, medida «empresas» (Empresas → Enterprises) |
| `pontos de índice` | 12 | index points | dicionário |
| `%` | 12 | % | o símbolo não muda de língua |
| `índice (UE-27 = 100)` | 11 | index (EU-27 = 100) | a casa escreve «EU-27» na edição inglesa (página das regiões) |
| `lugares` | 10 | seats | a casa · `strings.mjs`, `tempoLugares` (Lugares → Seats) |
| `pelouros` | 7 | portfolios | a casa · `strings.mjs`, `tempoPelouros`, e a descrição inglesa do estudo dos pelouros («each portfolio») |
| `municípios` | 6 | municipalities | a casa · a rota inglesa é `/en/municipalities` |
| `% do PIB` | 6 | % of GDP | a fonte · «Percentage of gross domestic product (GDP)» |
| `% da população` | 3 | % of the population | dicionário |
| `% da população ativa` | 3 | % of the labour force | a fonte · «Percentage of population in the labour force» |
| `votos` | 2 | votes | dicionário |
| `variação em três anos, %` | 2 | three-year change, % | a fonte · «Percentage change (t/t-3)» |
| `estudos` | 2 | studies | a casa · a rota inglesa é `/en/studies` |
| `% do VAB empresarial` | 2 | % of gross value added by enterprises | a casa · `leituras.mjs` escreve, para a mesma medida, «gross value added by enterprises in the municipality» |
| `% do stock no final do período anterior` | 2 | % of the stock at the end of the previous period | a fonte · «Percentage of stocks (closing balance sheet)» |
| `% do orçamento` | 2 | % of the budget | dicionário |
| `% do valor aprovado` | 2 | % of the approved amount | dicionário |
| `variação em três anos, pontos percentuais` | 1 | three-year change, percentage points | a fonte · «Percentage point change (t-(t-3))» |
| `variação anual média, %` | 1 | average annual change, % | a fonte · «Annual average rate of change» |
| `rácio` | 1 | ratio | a fonte · «Ratio» |
| `pontuação` | 1 | score | a fonte · «Score» |
| `m² por 1000 habitantes` | 1 | m² per 1000 inhabitants | a fonte · «Square metres per 1000 inhabitants» |
| `euros por habitante · volumes encadeados (2015)` | 1 | euros per inhabitant · chain linked volumes (2015) | a fonte · «Chain linked volumes (2015), euro per capita» |
| `edições` | 1 | editions | dicionário |
| `correções` | 1 | corrections | dicionário |
| `anos` | 1 | years | dicionário |
| `% dos indivíduos` | 1 | % of individuals | a fonte · «Percentage of individuals» |
| `% do total OCDE e UE não-OCDE, variação em três anos` | 1 | % of the OECD and non-OECD EU total, three-year change | a fonte · «Percentage of OECD and non-OECD EU countries total - 3-year change» |
| `% do PIB (média de três anos)` | 1 | % of GDP (three-year average) | a fonte · «Percentage of GDP - three-year average» |

### As duas que ficam em português, e porquê

| unidade | linhas | razão |
| --- | ---: | --- |
| `avisos` | 2 | um «aviso» do Portugal 2030 é um acto administrativo com nome próprio, e as duas linhas (`avisos-pt2030-abertos`, `avisos-pt2030-pessoas-singulares`) têm fonte, documento e excerto `[a verificar]`. Não há inglês do organismo de onde tirar a palavra, e escolher entre «call» e «notice» era a casa a decidir o que a fonte quis dizer |
| `factor` | 1 | o factor de sustentabilidade é o nome que o relatório citado dá ao número, e não uma unidade de contagem. A linha cita-o em português, com a grafia dele |

### Um desvio ao brief, dito por inteiro

O brief dá como exemplo **«Pessoas → Persons»**. O dicionário escreve **people**,
e a razão é medida: `src/data/concelhos.mjs` já traduz a mesma unidade por
«People» na definição de duas medidas dos concelhos, e essas medidas rendem-se na
MESMA página que as linhas do livro-razão do concelho. Com «Persons», a página
inglesa de um concelho dizia «People» no relance e «persons» na lista das linhas,
que é o defeito que a I92 abriu, escrito ao contrário. As duas são facto de
dicionário; a que a casa já escreve ganha.

Pela mesma regra, a caixa é a do livro-razão: ele escreve `euros` e `pessoas` em
minúsculas porque a unidade aparece a meio de uma lista de campos, e não à cabeça
de uma linha como nas medidas dos concelhos. Traduzir e capitalizar de uma vez
eram duas mudanças numa, e a segunda não foi pedida.

---

## 3 · I91 · a língua de cada título, declarada e não adivinhada

**Marcar todos os `document.title` com `pt-PT` estava errado, e isso mede-se:**
dos 66 títulos distintos do livro-razão, **33 estão em inglês** — as séries do
Eurostat («Real GDP per capita», «Gender employment gap»), o índice da
Transparency International, o PIB regional. Marcá-los `pt-PT` mandava um leitor
de ecrã ler inglês com fonética portuguesa, que é o mesmo defeito virado ao
contrário.

Adivinhar a língua por acentos ou por palavras também estava errado: adivinhar é
inventar. O sítio ganha `src/i18n/lingua-dos-titulos.mjs`, **um título, uma
língua, declarada à mão**, e a régua fecha a construção quando o livro-razão traz
um título que não está lá — ou quando a tabela nomeia um título que o livro-razão
já não traz. Um título novo chega assim a quem decide, em vez de se marcar
sozinho.

**A marca vai nas duas edições**, como a referência legal do selo das áreas: um
título inglês dentro de uma página portuguesa tem o mesmo defeito que um título
português dentro de uma página inglesa. É também a forma que os títulos dos
estudos já tinham desde 27.08.2026 (`linguaDoTitulo`), e fazer o contrário era
escrever uma segunda regra, mais fraca, para a mesma espécie de cadeia.

### O localizador entrou com os títulos, e não por gosto

Depois de os títulos ficarem marcados, a régua ainda contava **928 nomes de lei
sem marca em `dist/en`**, e estavam todos no `document.locator`: «linha de
ÁGUEDA, coluna (5) do quadro — Dívida total (Exclui dívidas não orçamentais,
exceções previstas na Lei n.º 73/2013, no OE/2024 e FAM)». O localizador está na
língua do documento que localiza, e por isso recebe a marca do título.

**Não é uma suposição.** Os 2 216 localizadores do livro-razão pertencem, todos,
a linhas cujo documento está declarado português — medido, não presumido — e a
régua fecha a construção no dia em que aparecer um localizador numa linha de
documento inglês, que é o dia em que esta regra deixa de valer e alguém tem de
decidir.

### Os dois títulos de estudo que faltavam

`linguaDoTitulo()` devolvia `null` quando a mesma cadeia era título das duas
edições, e «Onde está a água?» e «Água Não Faturada» são exactamente isso: o
título inglês daquelas edições não é conhecido (`titleUnverified`), e fica o
original português. Onze ocorrências em `dist/en` sem marca. O comentário da
função já dizia a razão certa — «a decisão é do TEXTO e não da edição» — e o que
faltava era a linha de código que a cumprisse: a língua do texto é o português
sempre que a mesma cadeia é o título de uma edição portuguesa.

### O nome da lei na frase do limite de dívida

`municipio.distanciaLei` era uma cadeia só, com «Lei n.º 73/2013» lá dentro, em
616 páginas de concelho. Passou a três peças, e a do meio é o nome do diploma,
num `<span lang="pt-PT">`. **O texto publicado não mudou, carácter a carácter.**

O que mudou foi a leitura da régua do inventário: `texto()` de
`scripts/medir-defeitos.mjs` junta os pedaços de texto de um bloco com um espaço
entre eles, e por isso passou a ler «…Lei n.º 73/2013 : uma vez e meia…». As duas
linhas do `INVENTARIO-FRASES.md` foram actualizadas para a cadeia que a régua lê,
com o bloco `pequenas-5` e uma nota que o explica; é a mesma razão do « ." » que
a manchete dos painéis europeus tem naquela lista desde o primeiro dia. A
alternativa era pôr os dois pontos dentro da marca de língua para a régua não dar
por nada, e isso era marcar pontuação como portuguesa para que uma medida ficasse
verde.

---

## 4 · A régua nova, e os sete estragos plantados

`scripts/check-lingua.mjs` entra na cadeia do `build` e do `verify`. Sete
conferências:

| | o que fecha a construção |
| --- | --- |
| L1 | uma unidade do livro-razão sem entrada no dicionário nem na lista das que ficam em português (ou com as duas) |
| L2 | um `document.title` do livro-razão sem língua declarada |
| L3 | em `dist/en`, uma unidade em português sem `lang="pt-PT"` |
| L4 | nas duas edições, um título de documento na língua errada e sem a marca da sua |
| L5 | em `dist/en`, um nome de lei portuguesa em prosa da casa sem a marca |
| L6 | em `dist/en`, um título de estudo português sem a marca |
| L7 | um localizador numa linha cujo documento não esteja declarado português |

E, nos dois sentidos: uma entrada do dicionário ou da declaração que nenhuma
linha do livro-razão use fecha a construção também. É a regra do inventário das
frases aplicada a estas duas tabelas — uma declaração que não se rende não é uma
sentinela, é uma linha morta.

**Nenhum zero foi contado antes de um vermelho.** As duas portas do estrago
plantado são variáveis de ambiente, e plantam numa CÓPIA — nunca no que a
construção publica:

| planta | onde | visto vermelho |
| --- | --- | --- |
| uma unidade inventada, «quilómetros de pinheiro» | `OEDP_LEDGER_DIR` numa cópia do livro-razão | L1, com saída 1 |
| um título inventado, «Um documento que não existe, plantado para a régua o ver» | a mesma cópia | L2 |
| a marca tirada de uma unidade que fica em português (`factor`) | `OEDP_DIST` numa cópia de quatro páginas de `dist/en` | L3 |
| a marca tirada de dois títulos de documento | a mesma cópia | L4 |
| a marca tirada de dois localizadores | a mesma cópia | L4b |
| o `<span lang="pt-PT">` tirado da frase da lei, e a marca tirada do selo legal de uma área | a mesma cópia | L5, nas duas formas («Lei n.º 73/2013» e «Decreto-Lei n.º 87-A/2025») |
| a marca tirada de dois títulos de estudo portugueses | a mesma cópia | L6 |

A régua traz ainda o seu próprio positivo, corrido em **cada** construção: se a
edição inglesa render unidades e nenhuma traduzida, o dicionário não está a ser
aplicado, e o zero de L3 não prova nada. E o portão de HTML continua a conferir a
unidade carácter a carácter contra o livro-razão — o que mudou é que o que ele
espera passa a depender da edição (`CAMPOS_DA_LINHA_POR_LINGUA`), como já
dependia na `derivation` e na nota de bandeira.

---

## 5 · O que não foi feito, e porquê

### 5.1 · As 316 ocorrências de lei que ficam sem marca, e estão contadas

Todas dentro de **texto transcrito**, onde a casa não escreve uma palavra:

| onde | ocorrências | porquê |
| --- | ---: | --- |
| `derivation_en` de uma linha do livro-razão | 314 | «…the legal ceiling is 1.5 times the three-year average of net current revenue (art. 52.º, Lei n.º 73/2013)…» é prosa inglesa do motor com o nome de uma lei portuguesa lá dentro. O campo é transcrito carácter a carácter; marcar aquele pedaço obrigava a casa a partir uma cadeia que ela copia |
| a nota de um critério da agenda (`data-agenda`) | 1 | o mesmo, sobre o registo da agenda |
| o documento original de um estudo, alojado tal como está (`/en/studies/<slug>/document`) | 1 | não é uma página deste sítio (`src/lib/routes.mjs`). Marcar por dentro dele era editar o documento que a casa aloja para que uma régua sua ficasse verde |

**A regra que fica escrita**, e que a régua aplica: um campo transcrito marca-se
INTEIRO, na língua do campo — é o que o localizador faz, porque é português de
uma ponta à outra. Um fragmento português dentro de um campo inglês fica por
marcar, contado e impresso em cada construção. Escondê-lo era pior.

Se a direção quiser fechar também esses, há duas portas, e as duas são dela: um
campo de língua por fragmento no motor, ou uma `derivation_en` que não cite a lei
pelo nome português.

### 5.2 · As entradas do dicionário não entraram no inventário das frases

O brief pede que as entradas do dicionário se classifiquem no
`INVENTARIO-FRASES.md` (bloco `pequenas-5`, classe conteúdo). **Não é possível
hoje, e foi medido em vez de suposto.**

Plantei duas linhas — `| conteudo | people | pequenas-5 | viva | — |` e a mesma
para «index (EU-27 = 100)» — e corri `npm run check:voz`: as duas saíram como
**«linha viva que não se rende em rota nenhuma»**, que fecha a construção. A razão
é dupla, e nenhuma metade se resolve com uma linha de tabela:

1. a unidade rende-se dentro de um elemento com `data-linha-claim`, que é origem
   declarada, e **as duas varreduras da régua deixam-na cair** (`ORIGEM_DECLARADA`
   em `scripts/medir-defeitos.mjs`);
2. e o elemento à volta dela é um `<div>` e um `<span>`, que não estão na
   definição de bloco (`BLOCOS`), nem entre as classes de rótulo declaradas.

É a mesma situação do bloco `voz-3`, que está no registo das revisões com **0
linhas** e a razão escrita: «o inventário não mudou (o texto dos registos é
origem declarada), a linha fica pelo rasto». A entrada de `pequenas-5` em
`critica/REVISOES-DO-INVENTARIO.md` diz as duas coisas: as duas linhas que
mudaram (a frase da lei, §3) e a razão pela qual as entradas do dicionário não
estão lá.

A casa já trata as unidades assim noutro sítio, e é o argumento mais forte de
todos: a linha de unidade de uma medida de concelho é excluída do inventário por
uma marca própria (`data-medida-unidade`), **de propósito**, porque uma unidade é
um rótulo e não uma frase. Pôr as do livro-razão dentro do inventário seria a casa
a tratar a mesma coisa de duas maneiras.

### 5.3 · Os 580 cartões de partilha continuam com a unidade portuguesa

`valorComUnidade()` alimenta o título e a descrição da página de uma linha **e** a
manchete dos cartões. Ganhou a língua, e o título e a descrição passam-lha; os
cartões não. A manchete de um cartão é medida em pixels e desenhada em 580 PNG
com o seu registo: traduzir a unidade ali é reconstruir os cartões todos, com a
sua paleta e as suas medições de texto, e isso é um bloco e não uma correção
pequena. Fica escrito no código, ao lado do parâmetro, e não num rodapé.

### 5.4 · O que a I91 não cobre, e está medido

Três campos do livro-razão são prosa portuguesa e rendem-se sem marca na edição
inglesa. O brief nomeia os títulos, e é o que esta passagem fechou; estes ficam
para a direção decidir, com a contagem já feita:

| campo | valores distintos | exemplo |
| --- | ---: | --- |
| `source` | 17, quase todos nomes de organismos portugueses | «Direção-Geral das Autarquias Locais (DGAL)», 930 linhas |
| `document.edition` | 62, com 12 em português | «dezembro de 2025» (616 linhas), «instantâneo 20260819-1728», «2021 — dados provisórios (rótulo da DGAL)» |
| `note` e a frase de atribuição | — | prosa portuguesa em linhas com proveniência por confirmar |

O `source` é o caso mais visível: é um nome próprio, como o título de um
documento, e a mesma marca resolve-o. Não entrou porque o brief o não pede, e
porque marcar 930 ocorrências de um campo que ninguém pediu numa passagem
chamada «correções pequenas» é decidir por quem decide.

---

## 6 · O custo

| | |
| --- | --- |
| modelo | Claude Opus 5 (contexto de 1M), a passagem inteira; sem subagentes |
| construções completas | 6 (`npm run build`), mais quatro `verify` e cinco `typecheck` |
| tempo de construção | cerca de 6 minutos cada |
| tokens | cerca de 380 mil, dos quais a maior parte em leitura do portão de HTML, da régua da voz e do livro-razão |

O que gastou mais foi a leitura antes de escrever: `scripts/gate-html.mjs`
(6 460 linhas) e `scripts/medir-defeitos.mjs` foram lidos por partes até se
perceber **porque** é que a marca `data-linha-campo` compara texto com o
livro-razão, e o que isso obriga quem queira traduzir uma unidade. Sem essa
leitura, o dicionário partia o portão à primeira construção.
