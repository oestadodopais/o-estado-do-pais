# Correções pequenas, sexta passagem · relatório do construtor

*Escrito a 29.08.2026 por Claude Opus 5, ramo `pequenas-6-2026-08-29`, saído de
`main` `58cc881`, contra `briefs/BRIEF-correcoes-pequenas-6.md`. Seis commits, mais
o que traz este relatório, que não pode conter o seu próprio resumo. Nada
fundido, nada empurrado. Sem travessões na prosa.*

## 0 · O que fica feito, em três linhas

* **O nome de cada linha.** 1553 das 2602 linhas do livro-razão trazem o rótulo
  com que a fonte publica a figura, escritas pelo motor em três corridas do
  exportador. Nenhuma linha nova. A superfície mostra-o onde ele existe, na
  língua da fonte, e o identificador desce a atributo e ao recibo.
* **Os tipos.** 694,8 KiB passam a 408,1 KiB nos mesmos oito ficheiros, com uma
  célula de prova que recusa o corte que o estudo recomendava, porque ele
  perdia a seta que o sítio rende 30 505 vezes.
* **I37.** O byte nulo saiu de `src/lib/ledger.mjs`, o resto do ficheiro ficou
  igual byte a byte, e a régua do livro-razão passa a recusar bytes de controlo.

## 1 · Os commits

| commit | o quê |
| --- | --- |
| `fbe2375` | I37: o byte nulo sai de `ledger.mjs`, e `check-ledger.mjs` recusa bytes de controlo |
| `7317464` | o formato aprende `name` e `name_source`, e as réguas que os prendem |
| `0c73bf3` | as 1553 linhas ganham o rótulo, das três corridas do exportador |
| `1577d1c` | a superfície mostra o nome, com a língua declarada e a régua que a impõe |
| `c10119e` | os oito tipos cortados, o utensílio, a célula e a §8 do `TIPOS.md` |
| `b354118` | ISSUES: a I37 fecha, com o commit que a fechou |

Todos com caminhos explícitos, nunca `git add -A`. Todos com os dois trailers.
`DECISIONS.md` não foi tocado. A cadeia inteira (`npm run build`, `verify`,
`typecheck`) corre verde em cada um e corre verde em `b354118`.

## 2 · As contagens

### 2.1 · As linhas com rótulo

| | |
| --- | ---: |
| linhas do livro-razão | 2602 |
| com `name` escrito | **1553** |
| sem rótulo impresso, e por isso sem o campo | 1049 |
| rótulos distintos | 15 (14 portugueses, 1 do Eurostat) |
| ficheiros de linha alterados pelas três corridas | 1553 |
| linhas acrescentadas em cada um | 5, e zero removidas, nos 1553 |
| linhas novas | **0** |

Os 1553 são 1537 + 12 + 4, que é exactamente o que o motor previu no
`RELATORIO-P4.md`. As três corridas imprimiram `0 nova(s)` cada uma. As 5 linhas
de cada ficheiro são as duas chaves, os dois comentários que as explicam e a
linha em branco que as separa da proveniência: `git diff --numstat` sobre
`ledger/claims` dá `{"5/0": 1553}` e mais nada.

Os 15 rótulos, com quantas linhas cada um:

| linhas | rótulo | fonte |
| ---: | --- | --- |
| 309 | `Poder de compra per capita por Localização geográfica (NUTS - 2024); Bienal - INE, …` | INE |
| 308 | `PMP (N.º dias)` | DGAL |
| 307 | `Empresas (N.º) por Localização geográfica (NUTS - 2024) e Dimensão; Anual - INE, …` | INE |
| 307 | `População residente (N.º) por Local de residência (NUTS - 2024), Sexo e Grupo etário …` | INE |
| 278 | `Total` | IEFP |
| 19 | `DESEMPREGO REGISTADO` | DRQPE |
| 11 | `TOTAL` | IEM |
| 4 | `Gross domestic product (GDP) at current market prices by NUTS 2 region` | Eurostat |
| 3 | `DÍVIDA TOTAL DE OPERAÇÕES ORÇAMENTAIS = (1) + (2)` | Évora |
| 2 | `Indicador de concentração do valor acrescentado bruto das quatro maiores empresas (%) …` | INE |
| 1 cada | `Dívida Total no Início do Mandato`, `LIMITE = Média dos Últimos 3 Exercícios * 1,5`, e três séries do INE | Évora, INE |

Três publicadores chamam três coisas diferentes à mesma medida, e as linhas
dizem-no: o desemprego registado é `Total` para o IEFP, `DESEMPREGO REGISTADO`
para a DRQPE e `TOTAL` para o IEM.

### 2.2 · Os bytes dos tipos

| ficheiro | antes | depois | menos |
| --- | ---: | ---: | ---: |
| `spectral/Spectral-Regular.woff2` | 80 084 | 48 328 | 39,7% |
| `spectral/Spectral-Italic.woff2` | 83 140 | 50 156 | 39,7% |
| `spectral/Spectral-Medium.woff2` | 88 008 | 50 808 | 42,3% |
| `spectral/Spectral-SemiBold.woff2` | 88 800 | 51 192 | 42,4% |
| `spectral/Spectral-Bold.woff2` | 88 664 | 51 252 | 42,2% |
| `spectral-sc/SpectralSC-Regular.woff2` | 79 864 | 48 316 | 39,5% |
| `spectral-sc/SpectralSC-SemiBold.woff2` | 88 908 | 51 108 | 42,5% |
| `bitter/Bitter[wght].woff2` | 113 960 | 66 732 | 41,4% |
| **total** | **711 428** | **417 892** | **286,7 KiB** |

694,8 KiB → 408,1 KiB. Os três `OFL.txt` não mudaram um byte.

### 2.3 · O byte nulo

Um só, no deslocamento **85 259**, linha **1861**, o `\x00` escrito como
carácter dentro de `[v.date, v.path, v.by, v.result].join(…)`. É o mesmo
deslocamento que a passagem de higiene mediu. Trocado pela sequência de escape:
88 754 bytes passam a 88 759, e desfeita só a troca os bytes de antes voltam
exactos (`099f3e90…` contra `27349eb6…`). Nenhum outro byte de controlo no
ficheiro, antes ou depois. `grep -c "eDerivada"` passa de 1 sem imprimir nada,
que é o que o `grep` faz com um ficheiro binário, a **2** com as duas linhas.

## 3 · O que se mediu na superfície

Nas quatro páginas que o brief pede, sobre a construção:

| página | nomes rendidos | com marca de língua | localizador do nome |
| --- | ---: | --- | ---: |
| `/areas/economia-e-coesao-territorial/` | 14 de 88 medidas | nenhum (é a língua da página) | 0 |
| `/en/areas/economia-e-coesao-territorial/` | 14 de 88 | todos com `lang="pt-PT"` | 0 |
| `/livro-razao/abrantes-prazo-medio-de-pagamento-2025-12/` | 1 | nenhum | 1 |
| `/en/ledger/abrantes-prazo-medio-de-pagamento-2025-12/` | 1 | `lang="pt-PT"` | 1 |

Nas 88 medidas da página de área, 14 têm rótulo e 74 continuam a mostrar o
identificador, porque a fonte não imprime rótulo nenhum sobre elas. Os 88 itens
levam o identificador em `data-linha-id`.

O que se lê muda assim: uma medida da página de área lia
`evora-divida-total-2025` e passa a ler `DÍVIDA TOTAL DE OPERAÇÕES ORÇAMENTAIS =
(1) + (2)`, que é o que a Câmara escreve por cima daquele número.

## 4 · As plantas, uma a uma

Nenhum detetor desta passagem deu um zero sem ter visto um vermelho antes.

| detetor | planta | o que fez |
| --- | --- | --- |
| validação do livro-razão | rótulo sem localizador | saída 1 |
| " | localizador sem rótulo | 1 |
| " | rótulo com a almofada de uma disposição em colunas | 1 |
| " | rótulo com branco nas pontas | 1 |
| " | rótulo com uma quebra de linha por dentro | 1 |
| " | rótulo que é uma data (`31/12/2025`) | 1 |
| " | rótulo que é o marcador | 1 |
| " | rótulo que não é uma cadeia | 1 |
| " | localizador que não é uma cadeia | 1 |
| " | o verde: rótulo e localizador bem formados | 0 |
| `check:cruzamento` | rótulo numa linha da casa, escrito à mão | 1, com o id nomeado |
| " | três casos sintéticos antes da contagem | comportaram-se |
| `check:lingua` | rótulo sem língua declarada | 1 |
| " | a tabela declara um rótulo que não existe | 1 |
| " | o rótulo rendido sem a marca da língua | 1 |
| `gate:html` | o rótulo transcrito com uma palavra a mais | 1, com as duas cadeias |
| `check:voz` | o rótulo como bloco de prosa, sem origem declarada | 1, «bloco por classificar» por rótulo distinto |
| `check-ledger` (bytes) | o NUL reposto no ficheiro real | 1, com o deslocamento certo |
| " | três casos sintéticos (NUL, campainha, o verde com tabulação) | comportaram-se |
| célula dos tipos | `--plantar U+2192` | 1, nos oito ficheiros |
| " | o corte «só latim», feito a sério | 1, com nove glifos nomeados |

**Uma planta não mordeu, e fica dita.** A primeira tentativa de plantar o rótulo
como prosa da casa pôs o nome num `<span>` sem marca, e o `check:voz` passou. Não
é a régua partida: um `<span>` não é um bloco da voz (`BLOCOS` é
`p,li,dd,dt,h1,h2,…`, mais os `<span>` de classe de rótulo declarada), e por isso
não podia ser visto. Repetida com um `<p>`, saiu a 1. O que isto diz é que a
régua da voz não protege contra prosa da casa escrita dentro de um `<span>` solto
num item do livro-razão, e isso é uma coisa a saber, independente desta
passagem.

## 5 · O que o corte dos tipos encontrou, e que o estudo não tinha

O estudo tipográfico recomendou cortar ao `latin` + `latin-ext` do Google Fonts.
Esse corte foi feito, numa pasta à parte, e reproduz o número do estudo ao
décimo: **405,3 KiB**. E foi passado pela célula de prova, que o **recusou**:
perde nove glifos que este sítio usa.

| glifo | ponto | quantas vezes o sítio o rende |
| --- | --- | ---: |
| → | U+2192 | **30 505** |
| Δ | U+0394 | 10 |
| ≈ | U+2248 | 5 |
| ≤ | U+2264 | 4 |
| ≠ | U+2260 | 3 |
| ↗ | U+2197 | 2 |
| ⅓ | U+2153 | 1 |
| ⅔ | U+2154 | 1 |
| ⅛ | U+215B | 1 |

São nove nas sete famílias de Spectral e de Spectral SC e oito na Bitter, que
nunca teve o «↗»: 71 glifos perdidos ao todo, contados pela célula.

A seta é a porta de todas as filas de navegação do sítio. Um corte que a perdesse
deixava 30 505 caixas nas páginas construídas, e nada na cadeia de construção o
teria dito. O intervalo entregue leva por isso o latim, o latim estendido e os
160 caracteres distintos que `dist/` põe à frente de alguém, lidos das 6606
páginas das duas edições e dos 580 cartões de partilha. Custa **2,8 KiB** nos
oito ficheiros.

**Oito caracteres do sítio já não tinham glifo em família nenhuma antes do
corte**, e continuam sem ter: U+202F (o espaço fino de milhares, 15 260
ocorrências) e sete sinais dos documentos alojados (U+21C4, U+2208, U+2318,
U+23CE, U+2534, U+26A0, U+2715). O navegador já os ia buscar a uma letra do
sistema, e é por isso que a célula compara «o que havia antes» e não «tem
glifo»: a segunda pergunta dava vermelho sobre um estado que o corte não criou.

**As features sobreviveram, e não só na tabela.** Nos ficheiros: `tnum`, `smcp`,
`onum`, `kern` e `liga` nos oito, 28 features nas sete de Spectral e 26 na
Bitter, e o eixo `wght` da Bitter idêntico ao de antes (100 · 100 · 900, nove
instâncias, `usWeightClass` 100). No navegador, com `node scripts/medir-tipos.mjs`
sobre a construção cortada: a Bitter a 400 e a 600 alinha «1111111» e «0000000»
em 441 px com `tabular-nums`, contra 284,4 e 448,9 sem a feature.

## 6 · O motor, e o que lá não foi tocado

Três corridas, do `~/Instruments/ResearchHub` em `master` `1869d48`, e mais
nenhum comando:

```
python3 publisher/export_site_rows.py --manifest publisher/manifest.concelhos.json --write
python3 publisher/export_site_rows.py --manifest publisher/manifest.evora.json --write
python3 publisher/export_site_rows.py --manifest publisher/manifest.regioes.json --write
```

O `git status --porcelain` do motor é o mesmo antes e depois, linha a linha. Os
nove ficheiros que outra sessão lá tem por committar têm o mesmo sha256 antes e
depois, e o `.maintenance-locks/` tem o mesmo conteúdo. Os três manifestos de
recortes que o exportador reescreve saíram com os mesmos bytes que tinham. Nada
foi encenado, modificado ou apagado.

## 7 · Onde parei, e as decisões que tomei sozinho

**Três leituras do brief que são minhas e podem estar erradas.**

1. **O recibo mostra o nome, e não só o identificador.** O brief nomeia
   «`ItemDoLivro.astro` e os índices do livro-razão» como as superfícies que
   mostram `name`, e diz que «o identificador passa a atributo e ao recibo».
   Li a frase de verificação da §1 («medido numa página de área e numa de
   linha») como pedindo que a página de linha mostre alguma coisa nova, e pus os
   dois campos na ficha do aparelho, a seguir ao localizador. A alternativa era
   deixar o recibo como estava e `name_source` ficar publicado no conjunto de
   dados e invisível no sítio, que me pareceu pior: um localizador que ninguém
   pode ver é um localizador que ninguém pode conferir. **Se a leitura estiver
   errada, o que sai são duas entradas da ficha e duas chaves de `strings.mjs`.**
2. **`check:cruzamento` confere o rótulo pelo lado que faltava.** O brief pede
   que a régua «confira `name` contra o registo do cruzamento como confere os
   outros campos». O registo do cruzamento **não guarda o rótulo** — conferi no
   exportador, `build_record()` não lhe acrescenta chave nenhuma — e o resumo dos
   bytes da linha já o prende: um rótulo alterado à mão numa linha cruzada já
   fechava a construção antes desta passagem. O que faltava era o outro lado, e é
   o que ficou: **uma linha que traga rótulo sem ter atravessado fecha a
   construção**. É isso que faz do campo uma origem e não prosa da casa.
3. **O intervalo do corte não é «o latim».** Está na §5 e é a mais consequente
   das três. O brief diz «cortados ao latim com as features todas» e cita o
   número do estudo; segui a instrução, medi o resultado, e ele perdia a seta.
   Entreguei o corte alargado e guardei o corte estrito como o vermelho da
   célula.

**O que não pude fazer honestamente.**

* **A régua que já lê `src/lib/ledger.mjs` não existia.** O brief manda
  acrescentar a recusa de bytes de controlo «à régua que já lê esse ficheiro».
  Procurei-a: **nenhum script deste repositório lê `src/lib/ledger.mjs` como
  bytes.** Todos o importam como módulo; `scripts/ortografia.mjs`, que é o que
  varre ficheiros de origem, junta `src/i18n/strings.mjs`, `src/data/*.mjs`, os
  `.astro` e as linhas do livro-razão, e `src/lib/` não está na lista. Pus a
  recusa em `scripts/check-ledger.mjs`, que é a régua de que aquele ficheiro é o
  módulo e que já lê como bytes os dois textos governados (`src/data/sobre.mjs`,
  `src/data/metodo.mjs`). É a leitura mais próxima que consigo defender, e não é
  a literal.
* **A régua da voz não podia ver os nomes.** «Os nomes são origem, não prosa da
  casa: confirma pela régua.» Confirmei, e a confirmação é mais fraca do que
  parece: o rótulo rende dentro de `data-linha-campo="name"`, que é origem
  declarada, e os dois rótulos de campo novos do recibo vivem dentro de uma ficha
  que já leva origem declarada — como «Onde no documento», que também nunca
  esteve no inventário. O inventário fica nas mesmas 576 linhas, e a linha do
  bloco em `REVISOES-DO-INVENTARIO.md` é `| pequenas-6 | 0 | por ler | … |`.
  A régua viu o vermelho (§4), mas só depois de eu pôr o nome num `<p>`: no
  lugar em que ele de facto vive, ela nunca teria oportunidade de o ver.
* **Não medi o sítio no ar, e não o devia.** Nada aqui foi lido do sítio
  publicado.
* **`scripts/design-bundle.mjs` está vermelho, e já estava.** Corri-o depois do
  corte dos tipos, porque é ele que confere os resumos de `TIPOS.md`, e morre em
  «não encontrei em `src/styles/inicio.css`: a largura do selo do mapa no
  telemóvel (`.movel-selo { width }`)». Não é desta passagem: `.movel-selo` não
  existe naquela folha em `58cc881` (`grep -c` dá 0 nos dois estados) e a folha
  não foi tocada aqui. O que **é** desta passagem foi conferido à mão com a mesma
  regra de leitura do feixe: **os 11 ficheiros declarados em `TIPOS.md` batem
  certo com os bytes em disco, e os 8 WOFF2 pelos resumos novos da §8.** O
  gerador não entra no `npm run build`.
* **Os títulos da tabela de língua não foram relidos.** Acrescentei
  `LINGUA_DOS_ROTULOS` ao lado de `LINGUA_DOS_TITULOS` e declarei a língua dos
  15 rótulos olhando para cada um. Catorze são portugueses e um é do Eurostat.
  `Total` e `TOTAL` são as palavras que o IEFP e o IEM imprimem em folhas
  portuguesas, e é por isso que estão declarados `pt` apesar de se escreverem
  igual em inglês. Se a direção discordar de algum, muda-se uma linha.

## 8 · O custo

Cerca de **345 000 tokens**, lidos do contador de orçamento da própria sessão:
15 000 000 quando abriu e cerca de 14 655 000 quando esta linha foi escrita. É a
aritmética desse contador e não uma contabilidade por chamada, e o que vier
depois desta linha fica de fora dela.
