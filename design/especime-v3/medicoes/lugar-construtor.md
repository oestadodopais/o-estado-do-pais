# F1.10 · uma coisa, um lugar

*Relatório do construtor (Claude Opus 5), 04.09.2026, sobre o brief
`design/observatorio/BRIEF-F1.10-uma-coisa-um-lugar.md`. Ramo `lugar-2026-09-04`,
a partir de `origin/main` em `306e4c68`. Sem travessões na prosa. Nenhum número
deste relatório foi escrito à mão: cada um tem ao lado o comando que o mediu.*

---

## Estado ao pausar (04.09, manhã)

**O bloco parou a meio, por ordem do diretor** (o portátil fecha-se; o bloco
continua noutra sessão). O que está no ramo está inteiro e verde: nenhuma
alteração ficou pela metade, e nada foi deixado com um portão vermelho.

### O que a sessão seguinte faz primeiro

`main` andou: está em **`69ba3abf`** (os ficheiros de registo e o
`timeout-minutes` do `portao.yml` subido para 45). **Funde `origin/main` antes de
tocar em código**, torna a correr os três portões, e só então continua pela lista
de baixo. O `timeout` da CI já não é o aperto que a alínea (b) do encargo
descrevia: o bloco pode acrescentar a régua `check:lugar` ao `verify` com a folga
que ela precisar, e continua a ter de medir e escrever o custo dela.

### O que está feito

| brief | item | estado |
|---|---|---|
| §2.1 | a frase de definição na primeira página | **feito**, nas duas edições |
| §2.3 | o vocabulário fechado | **feito nas cadeias que se rendem**, nas duas edições (a lista exata está na §A abaixo), menos as duas frases de `CONTEXTO_DOS_PAINEIS`, que são do F1.6 |
| §5, L8 | os três portões a 0 | **feito** para o que está no ramo |

Os ficheiros que este ramo tocou, e mais nenhum:

```
src/i18n/strings.mjs                              o vocabulário e as nove chaves novas
src/lib/prova.mjs                                 três origens de contagem («title»)
src/data/concelhos.mjs                            o nome e duas definições das medidas de concelho
src/data/dominios.mjs                             o nome de uma medida e a frase da fronteira
scripts/check-voz.mjs                             a sentinela do arame da classe
tests/inicio/correcoes-a.mjs                      a célula A11
design/especime-v3/INVENTARIO-FRASES.md           39 linhas e a secção do bloco
design/especime-v3/critica/REVISOES-DO-INVENTARIO.md  a entrada «lugar»
design/especime-v3/CHAVES-EN.md                   as chaves novas e as que mudaram
design/especime-v3/medicoes/lugar-construtor.md   este relatório
design/especime-v3/medicoes/lugar-2026-09-04/     os quatro guiões da medição
```

**Nada do que o construtor do F1.6 tem na mão foi tocado:** o bloco do atraso em
`LinhaView.astro`, o cartão do desemprego registado em `MunicipioView.astro`,
`src/data/metodo.mjs`, `CONTEXTO_DOS_PAINEIS` em `src/data/figuras.mjs`,
`src/data/fontes.mjs` e o `DECISIONS.md`. Nenhum desses ficheiros aparece no
`git diff` deste ramo.

**A frase de definição.** `s.identidade` deixa de ser «Um observatório de
Portugal.» e passa a «Um observatório de Portugal: cada número com a sua fonte,
lido por território, por domínio e em estudos.» (e a inglesa, «An observatory of
Portugal: every number with its source, read by territory, by domain and in
studies.»). Continua onde a Emenda 18 a pôs: por baixo da marca, na primeira
página e em mais lado nenhum, sem quem a faz, sem adjetivos, sem porta, sem
algarismo e sem selo; a classe do inventário continua a ser navegação e a rota
`home` continua com autorreferência 0. Origem escrita ao lado dela em
`src/i18n/strings.mjs`: decisão do lugar de direção, `DECISIONS.md` §1.98,
segunda emenda, item 3.

Duas réguas foram atrás dela, e as duas com a razão escrita:

* `scripts/check-voz.mjs` · a **sentinela** do arame da classe por provar era a
  frase antiga, palavra por palavra. Passa a ser a cadeia nova inteira: uma
  sentinela cortada no prefixo deixava de provar que a frase nova se rende.
* `tests/inicio/correcoes-a.mjs` · a célula **A11** exigia `linhas === 1`. Uma
  frase de dezasseis palavras não cabe numa linha a 390 px, e exigir que
  coubesse era exigir que a frase não mudasse. A célula mantém tudo o que media
  (uma ocorrência, a letra da prosa, sem porta, sem algarismo) e troca o «uma
  linha» por um tecto medido de três a 390 px. *Esta régua não corre no `verify`
  nem na CI; corre-se à mão.*

### O que está a meio, e como se retoma

**As cadeias estão escritas e declaradas; falta a vista que as rende.** São
chaves novas em `src/i18n/strings.mjs`, nas duas edições, com a razão escrita ao
lado de cada uma. Nenhuma se rende ainda, e por isso nenhuma está no
`INVENTARIO-FRASES.md`: uma linha `viva` que não se rende fecha a construção, e é
a régua a dizer a verdade. **Quem as usar declara-as no mesmo commit.**

| chave | pt | para onde vai |
|---|---|---|
| `hierarquia.territorio` | O país lê-se em quatro níveis: país, região NUTS II, distrito ou ilha, concelho. | `/municipios`, `/distritos`, `/regioes` (brief §2.2) |
| `hierarquia.dominio` | Um domínio é um assunto da carta dos conteúdos; uma área de governo é um ministério. | `/dominios` |
| `hierarquia.area` | Uma área de governo é um ministério; um domínio é um assunto da carta dos conteúdos. | `/areas` |
| `secoes.medidas` | As medidas | o `<h2>` que hoje diz «Relance» em `MunicipioView.astro` |
| `secoes.leitura` | A leitura de cada medida | os `<h2>` que hoje dizem «Leitura breve» em `MunicipioView.astro` e `DominioView.astro` |
| `nav.rotuloCaminho` | Onde está | o nome da região de navegação do caminho (brief §2.5) |
| `regioes.compararPorta` | Comparar as regiões | a porta da página de uma região para `/regioes` (brief §1) |
| `municipio.estudosPorta` | Os estudos sobre este concelho, no arquivo | a porta da página do concelho para `/estudos?concelho=` |
| `estudos.filtroConcelhoA` · `filtroConcelhoB` · `filtroTudo` | Mostram-se só os estudos sobre  · . · Ver o arquivo inteiro | o estado do arquivo filtrado, escondido do servidor e aceso pelo guião |

**A frase do território pára nos quatro níveis, e é uma decisão medida.** O brief
escreve-a com uma segunda oração, «as regiões não contêm distritos inteiros», e
manda conferi-la nos dados do sítio antes de a escrever. **Foi conferida e não se
escreve.** O repositório não tem correspondência nenhuma entre as 29 unidades da
Carta e as 9 regiões NUTS II: `regiaoDe()`, em `src/data/caop-centroids.mjs`,
devolve «continente», «acores» ou «madeira», que são as três parcelas do mapa e
não as regiões da régua, e `src/data/regioes.mjs` declara as nove regiões sem uma
lista de distritos nem de concelhos. Uma afirmação sobre a sobreposição das duas
divisões não resolve em dado nenhum desta árvore.

```
grep -n "regiaoDe" src/data/caop-centroids.mjs   → devolve continente|acores|madeira
grep -n "distrito\|concelhos" src/data/regioes.mjs → 0 linhas
```

### O que não foi tocado

Nada disto foi começado. A ordem abaixo é a que o construtor seguinte pode
seguir, e é a do custo crescente.

| brief | item | nota para quem retoma |
|---|---|---|
| §1, linha das 21 medidas | o cartão das três medidas partilhadas | os painéis de baixo já saíram no F1.1b; falta a linha única com a porta «Ver no domínio →» |
| §1, linha dos 308 | a busca da primeira página deixa de trazer os 308 resultados | `HomeView.astro` rende `<Pesquisa>` com os 308 `<li>`; `/municipios` já tem lista única (F1.7) |
| §1, linha dos 308 | os nomes da tabela do mapa do domínio passam a portas | `MapaPorConcelho.astro`, `<th scope="row" data-lugar>` → `<a>` |
| §1, linha das 9 regiões | a régua inteira sai da página de uma região | `RegiaoView.astro` rende `<InstrumentoConvergencia>` inteiro; troca-se pela porta `regioes.compararPorta` |
| §1, linha dos estudos | as sinopses saem da página do concelho | `MunicipioView.astro`, `<p class="mun-estudo-frase">`; fica o título e a porta |
| §1, linha dos domínios | «Trabalho» indentado dentro do primeiro domínio | `DominiosView.astro` já sabe o `dentroDe`; falta a forma |
| §2.2 | as cinco frases de hierarquia | as cadeias existem; falta rendê-las e declará-las |
| §2.4 | «fonte» diz sempre o publicador | por medir; a L6 é a comparação do selo com o `source` da linha |
| §2.5 | o caminho no cabeçalho | o desenho está pensado (§C abaixo) e não escrito |
| §2.6 | a busca é uma | `/municipios` tem hoje uma cópia do formulário dentro de `MunicipiosView.astro`, e a primeira página usa `Pesquisa.astro` |
| encargo (a) | o cartão do T3 diz «sem limiar» | medido: 3 ocorrências na página do domínio, 14 na de um concelho, 2 na de uma região, 0 na primeira página |
| encargo (b) | a régua `check:lugar` e o custo dela | por escrever; a L9 (plantas vermelhas e depois verdes) vai com ela |
| §5 | L1 a L7, as capturas | por medir |

### Os três portões, no que está no ramo

| comando | código |
|---|---|
| `npm run build` | **0** |
| `npm run verify` | **0** |
| `npm run typecheck` | **0** |

Os três correram sobre a árvore que este ramo empurra, e os códigos foram lidos
dos ficheiros de saída e não do ecrã. A §D diz o que cada corrida imprimiu.

---

## A · O vocabulário fechado: o que mudou, cadeia a cadeia

A decisão é a `DECISIONS.md` §1.98, segunda emenda, item 2, pela delegação do
diretor de 04.09.2026: «medida», «linha do livro-razão», «estudo», «domínio»,
«área de governo», e para o território «país, região, distrito, concelho», com
«concelho» como a palavra visível e os endereços `/municipios` sem mudar.

### A.1 · O território: «concelho» é a palavra visível

| ficheiro | chave | antes | depois |
|---|---|---|---|
| `src/i18n/strings.mjs` | `nav.municipios` (pt) | Municípios | Concelhos |
| | `municipios.metaTitle` | Municípios · O Estado do País | Concelhos · O Estado do País |
| | `municipios.eyebrow` | Municípios | Concelhos |
| | `municipio.eyebrow` | Município | Concelho |
| | `municipio.metaCauda` | o município, medido · … | o concelho, medido · … |
| | `municipio.metaDescricaoA` | … sobre o município de | … sobre o concelho de |
| | `municipio.voltarMapa` | Voltar ao mapa dos municípios | Voltar ao mapa dos concelhos |
| | `municipio.municipioLink` | A página do município | A página do concelho |
| | `inicio.mapa.svgLabel` | Mapa de pontos dos municípios de Portugal. | Mapa de pontos dos concelhos de Portugal. |
| | `inicio.mapa.readoutHint` · `tecladoHint` | … ler o município · … municípios vizinhos | … ler o concelho · … concelhos vizinhos |

**A edição inglesa não muda.** «municipality» é a tradução de «concelho» e não é
uma segunda palavra para a mesma coisa: o defeito que o leitor de primeira vez
mediu («the same place type is "Municípios", "Os concelhos de Portugal",
"Município" and "nome do concelho"») é do português. A L3 mede «município(s)»,
que é a palavra portuguesa.

### A.2 · A câmara é o organismo; o concelho é o território

É a **exceção ao vocabulário fechado**, e está escrita ao lado de cada cadeia. Um
concelho não orçamenta, não cobra, não paga e não presta contas: quem o faz é a
câmara, que é a palavra que a página do domínio já usava («Quanto deve a minha
câmara?»). Trocá-la por «concelho» seria trocar uma palavra certa por uma falsa.

| ficheiro | antes | depois |
|---|---|---|
| `src/i18n/strings.mjs` | A última prestação de contas do município | A última prestação de contas da câmara |
| | O que o município orçamentou … a prestação de contas é dele. | O que a câmara orçamentou … a prestação de contas é dela. |
| | O município publica | A câmara publica |
| | A Direção-Geral … e o município publicam a dívida … | A Direção-Geral … e a câmara publicam a dívida … |
| `src/data/concelhos.mjs` | Dívida total do município | Dívida total da câmara |
| | … os dados das contas dos municípios. (×2) | … os dados das contas das câmaras. |
| `src/data/dominios.mjs` | Dívida do município contra o limite legal | Dívida da câmara contra o limite legal |
| | … a dívida dos municípios e o que se ganha … | … a dívida das câmaras e o que se ganha … |

### A.3 · «estudo» e não «trabalho»

| ficheiro | chave | antes | depois |
|---|---|---|---|
| `src/i18n/strings.mjs` | `rodape.estudos` | trabalhos no arquivo / works in the archive | estudos no arquivo / studies in the archive |
| | `inicio.portas.estudosA` | ` trabalhos · ` / ` works · ` | ` estudos · ` / ` studies · ` |
| | `area.trabalhosK` (pt) | Os trabalhos | Os estudos |
| | `municipio.estudosK` | Os trabalhos sobre este concelho / The works about this municipality | Os estudos sobre este concelho / The studies about this municipality |
| `src/lib/prova.mjs` | `estudos` (a origem) | trabalhos no arquivo / works in the archive | estudos no arquivo / studies in the archive |
| | `leituras` (a origem) | trabalhos do arquivo com leitura … / archive works … | estudos do arquivo com leitura … / archive studies … |
| | `CHAVE_DAS_PECAS(<área>)` (a origem) | peças na página desta área de governo / pieces on this area of government’s page | estudos e medidas na página desta área de governo / studies and measures on this area of government’s page |

O inglês de `area.trabalhosK` já dizia «The studies» antes deste bloco.

**As origens da prova contam, e a primeira passagem esqueceu-as.** Cada contagem
do sítio leva um `title` com a origem dela, e a varredura das dicas (I79) recolhe
esses `title` como frases da casa: era por aí que «trabalhos no arquivo» e «works
in the archive» continuavam a render-se na primeira página depois de a cadeia de
`strings.mjs` já ter mudado. Foi o portão da voz que o disse, e não a leitura.

### A.4 · O que **não** mudou, e porquê

* **Os endereços.** `/municipios`, `/en/municipalities`, `?ambito=municipio:` e
  os slugs continuam como estão: é o que a decisão escreve à letra.
* **«peça», nas frases da política de IA** (`src/data/politica-ia.mjs`: «nenhum
  humano revê cada peça antes de sair», «e não peça a peça», «Qualquer peça que
  nomeie uma pessoa»). São as palavras aprovadas pelo diretor, copiadas da
  `POLITICA-DA-AUTONOMIA.md`, e a regra da casa é que o que se copia de uma fonte
  fica como a fonte o escreveu. **A régua do bloco tem de as isentar por escrito**,
  e não por saltar as rotas do Método e do Sobre.
* **«trabalho» no sentido de emprego** («Quantas procuram trabalho e não
  encontram?», «custo unitário do trabalho», «Trabalho, Solidariedade e Segurança
  Social»). A L3 mede «trabalho(s)» **como nome de estudo**, e estas não o são.
* **«indicador»** nos documentos alojados e nas páginas de leitura: são texto
  transcrito, e o §3 do brief põe as duas famílias fora do bloco.

---

## B · As medições de partida (sobre `dist/` de `306e4c68`)

Todas correm sobre a construção verde do ponto de partida, com os guiões que
ficaram em `design/especime-v3/medicoes/lugar-2026-09-04/`.

### B.1 · As palavras do vocabulário, no texto da casa

`node design/especime-v3/medicoes/lugar-2026-09-04/palavras.mjs dist` conta as
ocorrências **fora de toda a origem declarada** (`data-claim`, `data-linha-claim`,
`data-verbatim`, `data-nonledger`, `data-agenda`, `data-registo*`, `data-lugar`,
`data-nome`, `data-medida-*`), em 7 238 páginas:

| palavra | ocorrências | páginas |
|---|---|---|
| `Municípios` | 7 232 | 3 615 |
| `Município` (fora de «Municípios») | 327 | — |
| `municípios` | 941 | 313 |
| `município` | 1 063 | 325 |
| `indicador` | 51 | 8 |
| `indicadores` | 16 | 6 |
| `peça` | 10 | 5 |
| `peças` | 5 | 3 |
| `Trabalho` | 313 | 310 |
| `trabalho` | 30 | 19 |
| `trabalhos` | 8 | 8 |
| `Relance` | 325 | 324 |
| `Leitura breve` | 327 | 326 |
| `Painel` | 3 616 | 3 614 |

As duas contagens grandes são mobília: «Municípios» é o item do menu em cada
página portuguesa, e «Painel» é a leitura do painel europeu no cabeçalho. As
outras estão quase todas nos documentos alojados e nas páginas de leitura, que o
§3 do brief põe fora deste bloco.

### B.2 · Onde cada palavra se rende, por rota

`node design/especime-v3/medicoes/lugar-2026-09-04/contexto.mjs dist` imprime uma
página por rota e por edição, com os blocos de texto da casa que mordem. O que
interessa para o trabalho que falta:

* **`/` (pt)** · «Relance» e «Leitura breve» nos dois botões do comando das duas
  densidades (é a utilização que a decisão permite: são os nomes das densidades),
  «Os indicadores do painel do Procedimento…» e «Os indicadores que o
  livro-razão guarda…» nas duas frases de contexto dos painéis, e « trabalhos · »
  na fila das portas.
* **`/dominios/<slug>` (pt)** · «Leitura breve» como `<h2>` de secção, a frase da
  fronteira com «a dívida dos municípios», e duas frases com «indicador» que são
  campos da fonte.
* **`/municipios/<slug>` (pt)** · «Município», «Relance», «Leitura breve»,
  «Voltar ao mapa dos municípios» e as duas definições da DGAL.
* **`/regioes` e `/regioes/<slug>` (pt)** · «Leitura breve», que vem de
  `InstrumentoConvergencia.astro`.
* **`/areas` e `/areas/<slug>` (pt)** · «Os trabalhos» e o nome da área
  «Trabalho, Solidariedade e Segurança Social».
* **`/estudos` (pt)** · « trabalhos no arquivo» e as sinopses dos estudos.

**Duas destas frases não são deste bloco.** «Os indicadores do painel do
Procedimento…» e «Os indicadores que o livro-razão guarda…» vivem em
`CONTEXTO_DOS_PAINEIS`, em `src/data/figuras.mjs`, que é do construtor do F1.6 a
correr em paralelo. Ficaram por tocar de propósito, e o «indicador» delas conta
para a L3: **a sessão seguinte tem de as passar depois de o F1.6 fundir**, ou de
combinar com quem lá está.

### B.3 · O mesmo, depois (sobre o `dist/` deste ramo)

O mesmo comando, sobre a construção verde deste ramo. Uma palavra que caiu para
uma página de `estudos/<slug>/documento` ou `/texto` está num documento alojado
ou numa página de leitura, que o §3 do brief põe fora deste bloco.

| palavra | antes | depois | onde ficam as que ficam |
|---|---|---|---|
| `Municípios` | 7 232 | **4** | 2 documentos alojados |
| `Município` (fora de «Municípios») | 327 | **23** | 5 documentos alojados |
| `municípios` | 941 | **16** | 4 documentos alojados |
| `município` | 1 063 | **128** | 15 páginas: os documentos alojados, e as **sinopses dos estudos** em `src/data/studies.mjs` («no município de Évora»), que este bloco não tocou |
| `trabalhos` | 8 | **1** | `/metodo`, na cadeia de `src/data/metodo.mjs` que é do construtor do F1.6 |
| `trabalho` | 30 | **23** | o sentido de emprego, e os documentos alojados |
| `Trabalho` | 313 | 313 | o nome do domínio e o da área de governo, que são nomes e não a palavra |
| `indicadores` | 16 | 16 | os documentos alojados, e as duas frases de `CONTEXTO_DOS_PAINEIS` na primeira página, que são do F1.6 |
| `indicador` | 51 | 51 | os documentos alojados, e dois campos da fonte na página do domínio |
| `peça` · `peças` | 10 · 5 | 10 · 5 | as frases da política de IA e os documentos alojados (§A.4) |
| `Relance` | 325 | 325 | por fazer: são os `<h2>` de secção que a §1.98 manda mudar |
| `Leitura breve` | 327 | 327 | idem |
| `Painel` | 3 616 | 3 616 | a leitura do painel europeu no cabeçalho, que é a utilização permitida |

```
node design/especime-v3/medicoes/lugar-2026-09-04/palavras.mjs dist
```

### B.4 · Três achados que a sessão seguinte precisa

1. **`InstrumentoConvergencia.astro:308` escreve a cadeia à mão**, fora de
   `src/i18n/strings.mjs`:
   `<p class="layer-tag">{lang === 'pt' ? 'Leitura breve' : 'Brief reading'}</p>`.
   É o rótulo de uma camada de um instrumento, que é a utilização permitida da
   palavra, mas a cadeia tem de vir da tabela como todas as outras.
2. **`/municipios` não lê `?concelho=`.** A busca da primeira página é um
   `<form method="get">` para `/municipios`, e `public/js/municipios.js` filtra a
   lista pelo que está escrito no campo, que numa construção estática chega
   vazio. O leitor que submete cai na lista inteira. Sem isso, a tarefa «o meu
   concelho» custa dois toques e uma varredura, e não dois toques.
3. **A tabela do mapa do domínio é invisível à régua dos alvos.** Vive dentro de
   um `<details>` fechado, e `tests/acessibilidade/alvos.mjs` salta os elementos
   cuja caixa mede zero (`if (r.width === 0 && r.height === 0) continue;`).
   Transformar os 308 nomes em portas não acrescenta alvos medidos à H2.

### B.5 · «sem limiar», por página (encargo (a))

`grep -o 'sem limiar' <ficheiro> | wc -l`, sobre `dist/` de `306e4c68`:

| página | ocorrências |
|---|---|
| `/` | 0 |
| `/dominios/economia-e-financas-publicas` | 3 |
| `/municipios/evora` | 14 |
| `/regioes/alentejo` | 2 |

A palavra é rendida por `Faixa.astro` (o cartão) e por `Peca.astro` (a leitura).
Pela Emenda 1 sai do **cartão** e fica na **leitura**: a correção é uma linha em
`Faixa.astro` (não desenhar a palavra quando `estado === 'sem'`, como já não
desenha o quadrado) e uma frase nova na leitura do T3 em `DominioView.astro`,
onde hoje o bloco do limiar não se rende de todo.

---

## C · O caminho no cabeçalho: o desenho, por escrever

Fica aqui para não se pensar duas vezes.

* **Onde vive.** Um componente `Caminho.astro` dentro do `<header>` do
  `Masthead.astro`, a seguir à marca, como `<nav aria-label={s.nav.rotuloCaminho}>`.
* **Porque é que não custa uma linha ao inventário da voz.** `blocosDe()` mede
  `p,li,dd,dt,h1,h2,h3,h4,figcaption,summary,blockquote,td,th,caption` e
  `span.eyebrow`, e um `<nav>` com `<a>` e `<span>` não é nenhum deles. Um
  `<p class="caminho">` seria um bloco por classificar em 7 237 páginas.
* **De onde vêm os degraus.** Um `src/lib/caminho.mjs` com uma tabela de pais por
  chave de rota (`municipio` → `municipios` → `home`, `linha` → `livro` → `home`,
  e por aí) e um resolvedor de nome de folha por rota, a ler os mesmos ficheiros
  que as vistas já leem. O nome de uma linha do livro-razão vem da escada de
  `src/lib/nomes.mjs` e **não se rende quando ela não dá texto**, que é a regra
  que `NomeDaMedida.astro` já escreve.
* **O que fica de fora, e é o §3 do brief:** os documentos alojados (`documento`)
  e as páginas de leitura (`texto`). A régua da L5 tem de nomear as duas exceções
  com a razão, e não saltá-las em silêncio.
* **As marcas de cada folha:** `data-lugar` para um concelho, um distrito ou uma
  região; `data-nome="dominios"` para um domínio; `data-nome="areas"` para uma
  área; `TituloDeTrabalho` para um estudo, que é o que põe a marca de língua na
  edição inglesa e o que a L6 do `check:lingua` exige.

---

## D · As corridas

Os três portões, sobre a árvore deste ramo, com os códigos lidos dos registos e
não da memória:

| comando | código | registo |
|---|---|---|
| `npm run build` | **0** | `build3.log`, 7 222 páginas em 4 m 31 s; a voz com 815 frases distintas em 1 382 rotas, autorreferência 0, nada por classificar, 789 linhas do inventário (684 vivas, todas rendidas; 105 retiradas, nenhuma rendida) |
| `npm run verify` | **0** | `verify.log`, as vinte e uma passagens da cadeia, incluindo `check:alvos` e `check:indice --navegador` |
| `npm run typecheck` | **0** | `typecheck.log`, sem uma linha de saída |

```
npm run build     > build3.log 2>&1;    echo $? > build3.exit     → 0
npm run verify    > verify.log 2>&1;    echo $? > verify.exit     → 0
npm run typecheck > typecheck.log 2>&1; echo $? > typecheck.exit  → 0
```

**A régua do bloco (`check:lugar`) não existe**, e por isso as L1 a L7 não têm
número. É a primeira coisa que a sessão seguinte escreve depois de fundir o
`main`: sem ela, o que este bloco arrumou fica guardado pela leitura de quem revê
o diff, e não por uma construção que fecha.

### As réguas de fora da cadeia

`tests/inicio/correcoes-a.mjs` mudou (a célula A11) e **não foi corrida**: abre um
navegador e não está no `verify` nem na CI, e o bloco parou antes de a correr. A
alteração é a que está escrita na §«O que está feito», e a célula tem de ser
corrida na sessão seguinte antes de o bloco fechar.
